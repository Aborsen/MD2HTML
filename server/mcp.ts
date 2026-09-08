import { Hono } from 'hono';
import type { Context } from 'hono';
import { buildStandaloneHtml } from '../shared/markdown.js';
import { DOCS_SECTIONS } from '../src/lib/docs-sections.js';
import { FAQ_ENTRIES } from '../src/lib/faq.js';
import { MCP_TOOL_NAMES, type McpToolName } from '../src/lib/mcp-facts.js';
import { selfOrigin } from './auth.js';
import { type Caller, mayWrite, resolveCaller } from './caller.js';
import { countCall, QUOTA, RATE } from './limits.js';
import { markdownToHtml } from './render.js';
import v1 from './v1.js';

/*
 * transformpipe as an MCP server, so a person can add it to an assistant and convert, save and share
 * documents from a conversation.
 *
 * Two decisions worth stating before the code.
 *
 * The transport is JSON-RPC over a single POST, with no event stream. Every tool here answers from
 * Postgres or Blob in well under a second, so the only thing a stream would buy is progress
 * reporting on work that finishes before it could be reported — and the specification is explicit
 * that answering GET with 405 is a conforming way to say "no stream here".
 *
 * The tools do not reimplement anything: each one calls this app's own public API in process, with
 * the caller's credential forwarded, so a chat and a script get the same answer from the same code.
 * A tool that queried the database directly would be a second implementation of "whose documents
 * are these", and that is the question you least want two answers to.
 */

/** Versions this server will speak if a client asks for one of them. */
const SPOKEN = new Set(['2024-11-05', '2025-03-26', '2025-06-18', '2025-11-25']);
const NEWEST = '2025-11-25';
const SERVER = { name: 'transformpipe', version: '1.0.0' };

/** Long enough to be useful, short enough that a document does not eat a conversation. */
const MAX_TEXT = 40_000;

const INSTRUCTIONS = `These tools act on one person's transformpipe account — the one that authorised this connector — and see nothing else.

Three things worth holding on to. tp_save_document with a share mode publishes a page on the public web, so share a document only when the person asked for it. tp_delete_document is permanent and has no undo. tp_convert_markdown returns the whole document through this conversation, so for anything long, save it and share the link instead.

tp_help answers questions about how transformpipe works; use it rather than answering from memory.`;

interface Rpc {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
}

type Id = string | number | null;

const rpc = (id: Id, result: unknown) => ({ jsonrpc: '2.0', id: id ?? null, result });

const rpcError = (id: Id, code: number, message: string) => ({
  jsonrpc: '2.0',
  id: id ?? null,
  error: { code, message },
});

/** A tool answers in sentences a person could read, whether it worked or not. */
const say = (text: string, isError = false) => ({
  content: [{ type: 'text', text }],
  isError,
});

/** Says what it dropped. Silent truncation reads as completeness, which is worse than a gap. */
function clip(text: string, limit = MAX_TEXT): string {
  if (text.length <= limit) {
    return text;
  }

  const dropped = text.length - limit;

  return `${text.slice(0, limit)}\n\n[…${dropped.toLocaleString('en-GB')} further characters not shown. Save it with tp_save_document and share the link instead — that returns a URL rather than the whole document.]`;
}

/*
 * CORS for this endpoint only, and with no credentials.
 *
 * `Access-Control-Allow-Credentials` is set nowhere on purpose: the app is same-origin with its own
 * API, so nothing legitimate needs a cookie to travel cross-origin, and a reflected origin plus
 * credentials is how a site you have never visited comes to read your documents with your own
 * cookie. Origin is not validated either — the specification says to reject an origin that is
 * present and disallowed, and over-strict checking here is a documented cause of connectors that
 * cannot complete a handshake.
 */
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'authorization, content-type, mcp-protocol-version',
  'access-control-expose-headers': 'mcp-session-id, www-authenticate',
  'access-control-max-age': '86400',
};

const mcp = new Hono().basePath('/api/mcp');

mcp.options('/', (c) => c.body(null, 204, CORS));

/**
 * A 401 the client can act on.
 *
 * The status is the protocol signal: a 200 carrying an error, however well worded, is read as a
 * tool that failed and never starts a sign-in. The header names the document that says where to
 * sign in, and the body is for whoever is reading a log.
 */
function unauthorised(c: Context, why: string) {
  const origin = selfOrigin(c);

  c.header(
    'www-authenticate',
    `Bearer error="invalid_token", error_description="${why}", ` +
      `resource_metadata="${origin}/.well-known/oauth-protected-resource/api/mcp", ` +
      'scope="documents:read documents:write"'
  );

  for (const [key, value] of Object.entries(CORS)) {
    c.header(key, value);
  }

  return c.json(
    {
      error: 'invalid_token',
      error_description: why,
      resource: `${origin}/api/mcp`,
      hint: `Add ${origin}/api/mcp to your assistant and sign in with your transformpipe account.`,
    },
    401
  );
}

/*
 * Anything that is not a POST.
 *
 * A person who pastes the URL into a browser lands here, so it says what the endpoint is rather
 * than only refusing. 405 with `Allow` is also how the protocol expects a server with no event
 * stream to answer a GET.
 */
const notPost = (c: Context) =>
  c.json(
    {
      name: SERVER.name,
      version: SERVER.version,
      protocol: 'MCP over HTTP POST, JSON-RPC 2.0',
      auth: 'Add this URL to your assistant as a connector and sign in with your transformpipe account.',
      documentation: `${selfOrigin(c)}/docs`,
    },
    405,
    { ...CORS, allow: 'POST, OPTIONS' }
  );

mcp.get('/', notPost);
mcp.delete('/', notPost);

/* ---------------------------------------------------------------- the tools */

interface Tool {
  description: string;
  inputSchema: Record<string, unknown>;
  /** Set on anything that writes, so a read-only grant is refused before it runs. */
  writes?: boolean;
  run: (
    c: Context,
    args: Record<string, unknown>,
    caller: Caller
  ) => Promise<{ content: Array<{ type: string; text: string }>; isError: boolean }>;
}

/** An id is one path segment and nothing else: a `?` or a `..` in it must not choose the route. */
const segment = (value: unknown) => encodeURIComponent(String(value ?? ''));

/**
 * Calls this app's own API in process.
 *
 * The credential and the forwarding headers travel with it, so the API resolves the same caller it
 * would over the wire and `selfOrigin` still builds https share links behind the platform's proxy.
 */
async function callApi(
  c: Context,
  path: string,
  init: RequestInit = {}
): Promise<{ status: number; body: any }> {
  const headers = new Headers(init.headers);

  for (const name of [
    'authorization',
    'cookie',
    'host',
    'x-forwarded-proto',
    'x-forwarded-host',
  ]) {
    const value = c.req.header(name);

    if (value) {
      headers.set(name, value);
    }
  }

  const response = await v1.fetch(
    new Request(`${selfOrigin(c)}${path}`, { ...init, headers })
  );

  const text = await response.text();

  try {
    return { status: response.status, body: text ? JSON.parse(text) : null };
  } catch {
    return { status: response.status, body: { error: text.slice(0, 200) } };
  }
}

const bytes = (n: number) =>
  n < 1024
    ? `${n} B`
    : n < 1024 * 1024
      ? `${(n / 1024).toFixed(1)} kB`
      : `${(n / 1024 / 1024).toFixed(1)} MB`;

const describe = (document: {
  id: string;
  name: string;
  size: number;
  words?: number;
  created_at: string;
  share: { mode: string; url: string | null };
}) =>
  [
    `${document.name}`,
    `  id: ${document.id}`,
    `  ${bytes(document.size)}${document.words ? ` · ${document.words} words` : ''} · ${new Date(
      document.created_at
    ).toISOString().slice(0, 10)} · ${document.share.mode}`,
    document.share.url ? `  ${document.share.url}` : null,
  ]
    .filter(Boolean)
    .join('\n');

/*
 * Keyed by name, and the names come from the module the documentation page reads. TypeScript then
 * insists the two agree: a tool renamed here and not there stops the build, which is the only way a
 * page describing a tool cannot outlive the tool.
 */
const TOOLS: Record<McpToolName, Tool> = {
  tp_help: {
    description:
      'The transformpipe documentation itself: what Markdown it understands, what happens to a file, what is stored and what is not, how sharing works, the limits, and the HTTP API. Use this to answer any question about how transformpipe works INSTEAD of answering from memory. Ask a question to get the sections that answer it, or call it with nothing for all of them.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        question: {
          type: 'string',
          description: 'What you want to know. Matched against the documentation.',
        },
      },
    },
    run: async (c, args) => {
      const question = String(args.question ?? '')
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3);

      const score = (text: string) =>
        question.filter((word) => text.toLowerCase().includes(word)).length;

      const sections = DOCS_SECTIONS.map((section) => ({
        title: section.title,
        text: section.summary,
        hits: score(`${section.title} ${section.summary}`),
      }));

      const questions = FAQ_ENTRIES.map((entry) => ({
        title: entry.question,
        text: entry.answer,
        hits: score(`${entry.question} ${entry.answer}`),
      }));

      const all = [...sections, ...questions];
      const hit = all.filter((entry) => entry.hits > 0);
      const shown = (question.length > 0 && hit.length > 0 ? hit : all).sort(
        (a, b) => b.hits - a.hits
      );

      return say(
        clip(
          [
            `transformpipe — ${selfOrigin(c)} · full documentation at ${selfOrigin(c)}/docs`,
            '',
            ...shown.map((entry) => `## ${entry.title}\n${entry.text}`),
          ].join('\n')
        )
      );
    },
  },

  tp_convert_markdown: {
    description:
      'Convert Markdown to sanitised HTML and return it. GitHub Flavored Markdown; raw HTML in the source goes through a sanitiser, so a script tag in a file someone sent cannot survive. `standalone: true` returns a complete self-contained document with its styles inlined — the same file the app downloads. Nothing is saved to the account. For anything long, prefer tp_save_document and share the link: what this returns has to travel back through the conversation.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['markdown'],
      properties: {
        markdown: { type: 'string', description: 'The Markdown source.' },
        standalone: {
          type: 'boolean',
          description:
            'A whole HTML document with inline styles, rather than the body fragment. Default false.',
        },
        theme: {
          type: 'string',
          enum: ['light', 'dark'],
          description: 'Palette for a standalone document. Default light.',
        },
        name: {
          type: 'string',
          description: 'Title for a standalone document. Default "document".',
        },
      },
    },
    run: async (_c, args) => {
      const markdown = String(args.markdown ?? '');

      if (!markdown.trim()) {
        return say('There is no Markdown to convert.', true);
      }

      if (markdown.length > QUOTA.documentBytes) {
        return say(
          `That is ${bytes(markdown.length)} of Markdown; the limit for one document is ${bytes(QUOTA.documentBytes)}.`,
          true
        );
      }

      const body = markdownToHtml(markdown);

      if (!args.standalone) {
        return say(clip(body));
      }

      return say(
        clip(
          buildStandaloneHtml({
            title: String(args.name ?? 'document'),
            body,
            createdAt: Date.now(),
            theme: args.theme === 'dark' ? 'dark' : 'light',
          })
        )
      );
    },
  },

  tp_save_document: {
    description:
      'Save Markdown to this transformpipe account as a document, and optionally publish it in the same call. Returns the id, the size and — when shared — the URL. `share: "link"` is anyone holding the URL, `"people"` narrows it to the addresses in `emails`, `"private"` is nobody but the owner. Publishing makes a page on the public web: share a document the person actually asked to share.',
    writes: true,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['markdown'],
      properties: {
        markdown: { type: 'string', description: 'The Markdown source to store.' },
        name: {
          type: 'string',
          description: 'File name, ending in .md. Default "document.md".',
        },
        share: {
          type: 'string',
          enum: ['private', 'link', 'people'],
          description: 'Who may open it. Default private.',
        },
        emails: {
          type: 'array',
          items: { type: 'string' },
          description: 'Addresses for share: "people". Replaces any existing list.',
        },
      },
    },
    run: async (c, args) => {
      const markdown = String(args.markdown ?? '');

      if (!markdown.trim()) {
        return say('There is no Markdown to save.', true);
      }

      const name = String(args.name ?? 'document.md');
      const share = args.share === 'link' || args.share === 'people' ? args.share : '';
      const query = new URLSearchParams({ name });

      if (share) {
        query.set('share', share);
      }

      const created = await callApi(c, `/api/v1/documents?${query}`, {
        method: 'POST',
        headers: { 'content-type': 'text/markdown' },
        body: markdown,
      });

      if (created.status !== 201) {
        return say(
          created.body?.error ?? `The save failed (${created.status}).`,
          true
        );
      }

      const document = created.body.document;

      if (share === 'people' && Array.isArray(args.emails)) {
        const shared = await callApi(
          c,
          `/api/v1/documents/${segment(document.id)}/share`,
          {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ mode: 'people', emails: args.emails }),
          }
        );

        if (shared.status !== 200) {
          return say(
            `Saved as ${document.name} (id ${document.id}), but the addresses were not set: ${
              shared.body?.error ?? shared.status
            }`,
            true
          );
        }

        return say(
          `Saved ${document.name} (id ${document.id}, ${bytes(document.size)}) and shared it with ${
            (shared.body.emails ?? []).join(', ') || 'nobody yet'
          }.\n${shared.body.url ?? ''}`.trim()
        );
      }

      return say(
        [
          `Saved ${document.name} — id ${document.id}, ${bytes(document.size)}, ${document.words} words.`,
          /*
           * What the document is, not what was asked for. A share that did not take leaves the URL
           * null, and a sentence promising a link nobody can open is worse than no sentence.
           */
          document.share.mode === 'link' && document.share.url
            ? `Anyone with this link can read it: ${document.share.url}`
            : document.share.mode === 'people' && document.share.url
              ? `Only the addresses on it can read it: ${document.share.url}`
              : 'It is private. Share it with tp_share_document when asked.',
        ].join('\n')
      );
    },
  },

  tp_list_documents: {
    description:
      'What is on this transformpipe account: documents with their names, sizes, dates and whether each is shared. Start here when the question is "what have I got". Prints the id of each, which is what the other tools take.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 200,
          description: 'How many to show, newest first. Default 50.',
        },
        query: {
          type: 'string',
          description: 'Only documents whose name contains this.',
        },
      },
    },
    run: async (c, args) => {
      const listed = await callApi(c, '/api/v1/documents');

      if (listed.status !== 200) {
        return say(listed.body?.error ?? `Could not read the list (${listed.status}).`, true);
      }

      const needle = String(args.query ?? '').toLowerCase();
      const all = (listed.body.documents ?? []) as Array<Parameters<typeof describe>[0]>;
      const matching = needle
        ? all.filter((document) => document.name.toLowerCase().includes(needle))
        : all;

      if (matching.length === 0) {
        return say(
          needle
            ? `Nothing on this account has "${needle}" in its name.`
            : 'This account has no documents yet.'
        );
      }

      const limit = Math.min(Math.max(Number(args.limit ?? 50) || 50, 1), 200);
      const shown = matching.slice(0, limit);

      return say(
        clip(
          [
            `${shown.length} of ${matching.length} shown, newest first.`,
            '',
            ...shown.map(describe),
          ].join('\n')
        )
      );
    },
  },

  tp_get_document: {
    description:
      'One document from this account, by the id tp_list_documents printed: its Markdown source, or the rendered HTML.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'The document id.' },
        as: {
          type: 'string',
          enum: ['markdown', 'html'],
          description: 'Which face of it. Default markdown.',
        },
      },
    },
    run: async (c, args) => {
      const id = String(args.id ?? '');

      if (!id) {
        return say('Which document? tp_list_documents prints the ids.', true);
      }

      if (args.as === 'html') {
        const response = await v1.fetch(
          new Request(`${selfOrigin(c)}/api/v1/documents/${segment(id)}.html`, {
            headers: {
              authorization: c.req.header('authorization') ?? '',
              cookie: c.req.header('cookie') ?? '',
            },
          })
        );

        const text = await response.text();

        return response.ok
          ? say(clip(text))
          : say(`That document is not on this account (${response.status}).`, true);
      }

      const got = await callApi(c, `/api/v1/documents/${segment(id)}`);

      if (got.status !== 200) {
        return say(
          got.body?.error ?? `That document is not on this account (${got.status}).`,
          true
        );
      }

      const document = got.body.document;

      return say(
        clip(
          `${document.name} — ${bytes(document.size)}\n\n${document.markdown ?? ''}`
        )
      );
    },
  },

  tp_share_document: {
    description:
      'Change who may open a document. "link" is anyone holding the URL, "people" is only the addresses given, "private" revokes the link entirely — a URL already sent stops working. `emails` REPLACES the list rather than adding to it. Returns the mode, the URL and the addresses as they now stand.',
    writes: true,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['id', 'mode'],
      properties: {
        id: { type: 'string', description: 'The document id.' },
        mode: {
          type: 'string',
          enum: ['private', 'link', 'people'],
          description: 'Who may open it. No default: say which.',
        },
        emails: {
          type: 'array',
          items: { type: 'string' },
          description: 'The whole address list, for mode "people".',
        },
      },
    },
    run: async (c, args) => {
      const id = String(args.id ?? '');
      const mode = String(args.mode ?? '');

      if (!id || !['private', 'link', 'people'].includes(mode)) {
        return say(
          'Give the document id and a mode of private, link or people.',
          true
        );
      }

      const changed = await callApi(c, `/api/v1/documents/${segment(id)}/share`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mode,
          ...(Array.isArray(args.emails) ? { emails: args.emails } : {}),
        }),
      });

      if (changed.status !== 200) {
        return say(
          changed.body?.error ?? `That did not work (${changed.status}).`,
          true
        );
      }

      const emails = (changed.body.emails ?? []) as string[];

      return say(
        [
          `Now ${changed.body.mode}.`,
          changed.body.url ? changed.body.url : 'The link is revoked, so one already sent no longer opens.',
          emails.length > 0 ? `Readers: ${emails.join(', ')}` : null,
        ]
          .filter(Boolean)
          .join('\n')
      );
    },
  },

  tp_usage: {
    description:
      'What this account is using against its limits: bytes stored, documents held, and the ceiling on each. Ask this when a save was refused.',
    inputSchema: { type: 'object', additionalProperties: false, properties: {} },
    run: async (c) => {
      const usage = await callApi(c, '/api/v1/usage');

      if (usage.status !== 200) {
        return say(usage.body?.error ?? `Could not read the usage (${usage.status}).`, true);
      }

      const { bytes: used, documents, limits } = usage.body;

      return say(
        [
          `${bytes(used)} of ${bytes(limits.bytes)} stored.`,
          `${documents} of ${limits.documents} documents.`,
          `One document may hold ${bytes(limits.documentBytes)} of Markdown.`,
          'Reaching a limit refuses the next save; nothing already saved is deleted to make room.',
        ].join('\n')
      );
    },
  },

  tp_delete_document: {
    description:
      'Permanently delete one document from this account, and its Markdown source with it. There is no undo and no trash. Pass confirm: true only when the person has named this document and asked for it to be deleted; ask them otherwise. Deletes exactly one — there is no tool that deletes several.',
    writes: true,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['id', 'confirm'],
      properties: {
        id: { type: 'string', description: 'The document id.' },
        confirm: {
          type: 'boolean',
          description: 'True only when the person asked for this document to be deleted.',
        },
      },
    },
    run: async (c, args) => {
      const id = String(args.id ?? '');

      if (!id) {
        return say('Which document? tp_list_documents prints the ids.', true);
      }

      if (args.confirm !== true) {
        return say(
          'Not deleted. Ask the person to confirm which document should go, then call this again with confirm: true.',
          true
        );
      }

      const gone = await callApi(c, `/api/v1/documents/${segment(id)}`, {
        method: 'DELETE',
      });

      if (gone.status !== 200) {
        return say(
          gone.body?.error ?? `That document is not on this account (${gone.status}).`,
          true
        );
      }

      return say(`Deleted. ${id} and its source are gone.`);
    },
  },
};

const LISTED = MCP_TOOL_NAMES.map((name) => ({
  name,
  description: TOOLS[name].description,
  inputSchema: TOOLS[name].inputSchema,
}));

/* ---------------------------------------------------------------- the endpoint */

mcp.post('/', async (c) => {
  const caller = await resolveCaller(c);

  if (!caller) {
    return unauthorised(c, 'Sign in to transformpipe');
  }

  for (const [key, value] of Object.entries(CORS)) {
    c.header(key, value);
  }

  const body = await c.req.json<Rpc>().catch(() => null);

  if (!body || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    return c.json(rpcError(body?.id ?? null, -32600, 'Not a JSON-RPC 2.0 request'), 400);
  }

  const { id, method } = body;
  const params = body.params ?? {};

  /*
   * A notification is a message with no id — that is the whole of the definition — and it gets no
   * response at all. Keying this on the method name instead meant a `tools/call` sent without an
   * id ran the tool and answered anyway, which is the one thing that must not happen: the work
   * was done and nothing asked for it.
   */
  if (!('id' in body) || body.id === undefined) {
    return c.body(null, 202);
  }

  if (method === 'initialize') {
    const asked = String(
      (params as { protocolVersion?: unknown }).protocolVersion ?? ''
    );

    // Minted because clients read it; never validated, because this server keeps no session.
    c.header('mcp-session-id', crypto.randomUUID());

    return c.json(
      rpc(id ?? null, {
        protocolVersion: SPOKEN.has(asked) ? asked : NEWEST,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER,
        instructions: INSTRUCTIONS,
      })
    );
  }

  if (method === 'ping') {
    return c.json(rpc(id ?? null, {}));
  }

  if (method === 'tools/list') {
    /*
     * A fixed list. A client fetches it once and holds it until it reconnects, so it must not grow
     * with the account: a tool per document would put its definition in front of every message the
     * person ever sends, and rename anything the moment they rename a file.
     */
    return c.json(
      rpc(id ?? null, { tools: LISTED })
    );
  }

  if (method === 'tools/call') {
    /*
     * Counted here rather than only inside /api/v1: two of these tools — the documentation and the
     * conversion — answer without touching the account at all, and an unmetered tool is a way to
     * spend this deployment's time for free. `initialize` and `tools/list` stay uncounted: a client
     * re-runs both every time it reconnects, and neither reads or writes anything.
     */
    const spend = await countCall(`${caller.via}:${caller.id}`);

    if (!spend.ok) {
      c.header('retry-after', String(spend.retryAfter));

      return c.json(
        rpc(
          id ?? null,
          say(
            `Too many calls — the limit is ${RATE.perMinute} a minute. Try again in ${spend.retryAfter}s.`,
            true
          )
        )
      );
    }

    const name = String((params as { name?: unknown }).name ?? '');
    const tool = (TOOLS as Record<string, Tool | undefined>)[name];

    if (!tool) {
      return c.json(
        rpc(
          id ?? null,
          say(
            `There is no tool called ${name}. tools/list has the ones there are.`,
            true
          )
        )
      );
    }

    if (tool.writes && !mayWrite(caller)) {
      return c.json(
        rpc(
          id ?? null,
          say(
            'This connection was granted read-only access, so it cannot save, share or delete. Reconnect it and approve writing if that is what you want.',
            true
          )
        )
      );
    }

    const args = ((params as { arguments?: unknown }).arguments ?? {}) as Record<
      string,
      unknown
    >;

    try {
      return c.json(rpc(id ?? null, await tool.run(c, args, caller)));
    } catch (cause) {
      /*
       * A thrown error is still a tool answer when it happened inside one: the client should get a
       * sentence it can act on, not a transport failure it cannot.
       */
      const why = cause instanceof Error ? cause.message : String(cause);

      return c.json(rpc(id ?? null, say(`That did not work: ${why}`, true)));
    }
  }

  return c.json(rpcError(id ?? null, -32601, `No method "${method}"`));
});

export default mcp;
