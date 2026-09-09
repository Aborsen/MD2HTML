import { randomBytes } from 'node:crypto';
import { Hono, type Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { buildStandaloneHtml, getDocStats } from '../shared/markdown.js';
import { selfOrigin } from './auth.js';
import { type Caller, mayWrite, resolveCaller } from './caller.js';
import { canSendMail, sendShareNotice } from './mail.js';
import { sql } from './db.js';
import {
  checkQuota,
  countCall,
  isVerified,
  QUOTA,
  RATE,
  usageOf,
} from './limits.js';
import {
  CONVERSIONS,
  conversion,
  type ConversionId,
  DEFAULT_CONVERSION,
} from '../shared/conversions.js';
import { htmlToMarkdown } from '../shared/from-html.js';
import { jsonToMarkdown } from '../shared/from-json.js';
import { delimitedToMarkdown } from '../shared/from-table.js';
import { markdownToHtml } from './render.js';
import { deleteSources, putSource, readSource } from './source.js';

/*
 * The public API.
 *
 * Everything the app does through cookies, a script can do with a key — with one deliberate
 * exception: a key cannot manage the account or its keys. A leaked key must not be able to mint
 * its own replacement or lock the owner out.
 *
 * Shapes here are a contract. The app's own /api/documents endpoints stay internal and free to
 * change; these do not.
 */

type Env = { Variables: { caller: Caller } };

const v1 = new Hono<Env>().basePath('/api/v1');

/*
 * An API key, an OAuth token from a connected assistant, or the session cookie the app carries.
 *
 * All three resolve through `resolveCaller`, which is the only place that answers "whose documents
 * are these" — a second copy of that question is how two parts of a server come to disagree on it.
 */
const requireCaller = createMiddleware<Env>(async (c, next) => {
  const caller = await resolveCaller(c);

  if (!caller) {
    return c.json(
      {
        error: c.req.header('authorization')
          ? 'Unknown or revoked credential'
          : 'Send an API key as `Authorization: Bearer tp_live_…`',
      },
      401
    );
  }

  c.set('caller', caller);

  return next();
});

v1.use('*', requireCaller);

/*
 * A read-only connection cannot change anything, and this is where that holds.
 *
 * It used to be enforced only in the MCP tool dispatcher, which meant the promise on the consent
 * page — "it cannot save, share or delete anything" — was true of the tools and false of the API
 * the tools call, and the token the connector already holds was one curl away from publishing a
 * document. The check belongs on the credential, not on one of the doors it opens.
 *
 * An allowlist of safe methods rather than a list of unsafe ones: a route added here later is
 * covered by default, which is exactly the property the first version lacked.
 */
const READ_ONLY_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

v1.use('*', async (c, next) => {
  if (READ_ONLY_METHODS.has(c.req.method) || mayWrite(c.get('caller'))) {
    return next();
  }

  c.header(
    'www-authenticate',
    'Bearer error="insufficient_scope", scope="documents:write"'
  );

  return c.json(
    {
      error:
        'This connection was granted read-only access, so it cannot save, share or delete.',
    },
    403
  );
});

/*
 * One counter per caller per minute. Keys are counted by key, a browser session by user, so one
 * runaway script cannot spend the allowance of the person whose account it belongs to.
 */
v1.use('*', async (c, next) => {
  const caller = c.get('caller');
  const verdict = await countCall(`${caller.via}:${caller.id}`);

  if (!verdict.ok) {
    c.header('retry-after', String(verdict.retryAfter));

    return c.json(
      {
        error: `Too many requests — the limit is ${RATE.perMinute} a minute. Try again in ${verdict.retryAfter}s.`,
      },
      429
    );
  }

  return next();
});

v1.get('/usage', async (c) => c.json(await usageOf(c.get('caller').id)));

interface DocumentRow {
  id: string;
  name: string;
  kind: string;
  size: number;
  stats: Record<string, number>;
  created_at: string;
  share_mode: 'private' | 'link' | 'people';
  share_token: string | null;
}

/*
 * Built from the forwarded protocol, not from the request URL: behind the platform's proxy the
 * function sees a plain http:// address, and a share link that starts with http is one redirect
 * away from working — which is exactly the kind of link people paste into a chat and blame us for.
 */
const shareUrl = (c: Context, token: string | null) =>
  token ? `${selfOrigin(c)}/s/${token}` : null;

/** One document, as the API describes it. Kept flat and boring on purpose. */
const asDocument = (
  c: Context,
  row: DocumentRow,
  extra: Record<string, unknown> = {}
) => ({
  id: row.id,
  name: row.name,
  kind: row.kind,
  size: row.size,
  words: row.stats?.words ?? 0,
  created_at: row.created_at,
  share: {
    mode: row.share_mode,
    url: shareUrl(c, row.share_token),
  },
  ...extra,
});

v1.get('/documents', async (c) => {
  const rows = (await sql()`
    select id, name, kind, size, stats, created_at, share_mode, share_token
    from m2h_document
    where user_id = ${c.get('caller').id}
    order by created_at desc
    limit ${QUOTA.documents}
  `) as DocumentRow[];

  return c.json({ documents: rows.map((row) => asDocument(c, row)) });
});

/**
 * Creates a document.
 *
 * Two ways in, because two kinds of caller exist: `curl --data-binary @file.md` sends the Markdown
 * as the body and names it with `?name=`, while a programme with more to say sends JSON. Adding
 * `?share=link` publishes it in the same call and returns the URL — the whole point of an API for
 * a tool like this is that publishing a document should be one request.
 */
v1.post('/documents', async (c) => {
  const userId = c.get('caller').id;
  const type = c.req.header('content-type') ?? '';

  /*
   * What made this document. A caller that says nothing means Markdown, which is what every
   * document was before there was more than one conversion.
   *
   * Two of the conversions run here as well as in the browser, because both are text in and text
   * out. Word is not: reading a .docx needs a zip reader and an XML mapper, and putting those in
   * the function to serve an endpoint nobody has asked for yet is weight for its own sake — so it
   * is refused by name rather than silently stored as if it had been converted.
   */
  const asked = c.req.query('kind') ?? '';
  const named = CONVERSIONS.find((one) => one.id === asked);

  if (asked && !named) {
    return c.json(
      {
        error: `kind must be one of ${CONVERSIONS.map((one) => one.id).join(', ')}`,
      },
      400
    );
  }

  const kind: ConversionId = named?.id ?? DEFAULT_CONVERSION;

  if (kind === 'word-to-markdown') {
    return c.json(
      {
        error:
          'word-to-markdown runs in the browser only. Convert the .docx at /word-to-markdown, or post the Markdown it produced.',
      },
      400
    );
  }

  let name = c.req.query('name') ?? '';
  let source = '';

  /*
   * The `{name, markdown}` envelope belongs to Markdown alone.
   *
   * It is recognised by the content type, and the natural way to post a JSON file for conversion
   * is `content-type: application/json` with the file as the body — which this used to read as an
   * envelope, find no `markdown` field in, and refuse. So a named conversion means the body is the
   * source file, whatever its content type says; only the default reads an envelope.
   */
  if (kind === DEFAULT_CONVERSION && type.includes('application/json')) {
    const body = await c.req
      .json<{ name?: string; markdown?: string }>()
      .catch(() => ({}) as { name?: string; markdown?: string });

    name = body.name ?? name;
    source = body.markdown ?? '';
  } else {
    source = await c.req.text();
  }

  if (!source.trim()) {
    return c.json(
      {
        error:
          kind === DEFAULT_CONVERSION
            ? 'Send Markdown as the request body, or as `markdown` in JSON'
            : `Send the ${conversion(kind).extensions.join(' or ')} file as the request body`,
      },
      400
    );
  }

  let markdown = source;

  if (kind === 'html-to-markdown') {
    markdown = htmlToMarkdown(source);
  }

  if (kind === 'csv-to-markdown') {
    const table = delimitedToMarkdown(source, {
      delimiter: name.toLowerCase().endsWith('.tsv') ? '\t' : undefined,
    });

    if (!table) {
      return c.json({ error: 'That file has no rows in it' }, 400);
    }

    markdown = table;
  }

  if (kind === 'json-to-markdown') {
    try {
      markdown = jsonToMarkdown(source, {
        title: (name || 'document').replace(/\.[^.]+$/, ''),
      });
    } catch (cause) {
      /*
       * The parser says where it stopped, and that is the whole of what a caller can act on. A
       * flat "could not convert" would send somebody hunting through a megabyte by eye.
       */
      return c.json(
        {
          error:
            cause instanceof Error ? cause.message : 'That is not valid JSON',
        },
        400
      );
    }
  }

  if (!markdown.trim()) {
    return c.json({ error: 'Nothing came out of that file' }, 400);
  }

  const share = c.req.query('share');

  if (share !== undefined && share !== 'link' && share !== 'people') {
    return c.json({ error: 'share must be `link` or `people`' }, 400);
  }

  const size = new TextEncoder().encode(markdown).length;
  const room = await checkQuota(userId, size);

  if (!room.ok) {
    return c.json({ error: room.error, usage: room.usage }, room.status);
  }

  // A converted file keeps its name but not its extension: what is stored is Markdown.
  const documentName = (
    kind === DEFAULT_CONVERSION
      ? name || 'document.md'
      : `${(name || 'document').replace(/\.[^.]+$/, '')}.md`
  ).slice(0, 200);
  const html = markdownToHtml(markdown);
  const stats = getDocStats(markdown, html);

  const created = (await sql()`
    insert into m2h_document (user_id, name, kind, size, markdown, stats, share_mode, share_token)
    values (
      ${userId},
      ${documentName},
      ${kind},
      ${size},
      null,
      ${JSON.stringify(stats)}::jsonb,
      ${share ?? 'private'},
      ${share ? randomBytes(16).toString('base64url') : null}
    )
    returning id, name, kind, size, stats, created_at, share_mode, share_token
  `) as DocumentRow[];

  try {
    const stored = await putSource(userId, created[0].id, markdown);

    await sql()`
      update m2h_document
      set blob_path = ${stored.blobPath}, markdown = ${stored.markdown}
      where id = ${created[0].id}
    `;
  } catch (cause) {
    await sql()`delete from m2h_document where id = ${created[0].id}`;

    const why = cause instanceof Error ? cause.message : 'upload failed';

    return c.json({ error: `Could not store the document: ${why}` }, 502);
  }

  return c.json({ document: asDocument(c, created[0], { words: stats.words }) }, 201);
});

/** Postgres rejects a malformed uuid with an error, which reaches the caller as a 500. */
const looksLikeId = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

async function findDocument(userId: string, id: string) {
  if (!looksLikeId(id)) {
    return null;
  }

  const rows = (await sql()`
    select id, user_id, name, kind, size, stats, created_at, share_mode, share_token,
           markdown, blob_path
    from m2h_document
    where user_id = ${userId} and id = ${id}
  `) as Array<
    DocumentRow & {
      user_id: string;
      markdown: string | null;
      blob_path: string | null;
    }
  >;

  return rows[0] ?? null;
}

v1.get('/documents/:id', async (c) => {
  const id = c.req.param('id').replace(/\.html$/, '');
  const wantsHtml = c.req.param('id').endsWith('.html');
  const row = await findDocument(c.get('caller').id, id);

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  /*
   * The store answering at all is a separate question from the row existing. A missing file is a
   * 410 — the document is gone and saying so is the answer — but a store that cannot be reached is
   * ours to own: it used to arrive as a bare 500, which tells a caller nothing they can act on.
   */
  let markdown: string | null;

  try {
    markdown = await readSource(row);
  } catch (cause) {
    const why = cause instanceof Error ? cause.message : 'unknown';

    return c.json(
      { error: `Could not read the document's source: ${why}` },
      502
    );
  }

  if (markdown === null) {
    return c.json({ error: 'The source of this document is missing' }, 410);
  }

  if (wantsHtml) {
    // The same file the app downloads, so a script and a person get the same document.
    return c.html(
      buildStandaloneHtml({
        title: row.name,
        body: markdownToHtml(markdown),
        createdAt: new Date(row.created_at).getTime(),
        theme: c.req.query('theme') === 'dark' ? 'dark' : 'light',
      })
    );
  }

  return c.json({ document: asDocument(c, row, { markdown }) });
});

v1.delete('/documents/:id', async (c) => {
  if (!looksLikeId(c.req.param('id'))) {
    return c.json({ error: 'Not found' }, 404);
  }

  const removed = (await sql()`
    delete from m2h_document
    where user_id = ${c.get('caller').id} and id = ${c.req.param('id')}
    returning blob_path
  `) as Array<{ blob_path: string | null }>;

  if (removed.length === 0) {
    return c.json({ error: 'Not found' }, 404);
  }

  await deleteSources(removed.map((row) => row.blob_path));

  return c.json({ ok: true });
});

v1.get('/documents/:id/share', async (c) => {
  const row = await findDocument(c.get('caller').id, c.req.param('id'));

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  const emails = (await sql()`
    select email from m2h_document_share
    where document_id = ${row.id}
    order by created_at
  `) as Array<{ email: string }>;

  return c.json({
    mode: row.share_mode,
    url: shareUrl(c, row.share_token),
    emails: emails.map((entry) => entry.email),
  });
});

v1.put('/documents/:id/share', async (c) => {
  const userId = c.get('caller').id;
  const id = c.req.param('id');

  if (!looksLikeId(id)) {
    return c.json({ error: 'Not found' }, 404);
  }
  type ShareBody = {
    mode?: 'private' | 'link' | 'people';
    emails?: string[];
  };

  const body = await c.req.json<ShareBody>().catch(() => ({}) as ShareBody);

  if (!body.mode || !['private', 'link', 'people'].includes(body.mode)) {
    return c.json({ error: 'mode must be private, link or people' }, 400);
  }

  const row = await findDocument(userId, id);

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  /*
   * Publishing to the open web waits for a confirmed address.
   *
   * `link` puts a page at /s/<token> that anybody holding the URL can read, on our domain, with
   * somebody else's content on it — which is the one thing an account made with an address nobody
   * has proved should not be able to do. `people` is not held back: it names addresses and asks
   * each reader to sign in, so it publishes nothing.
   *
   * Checked here rather than on the caller, because confirming should take effect on the next
   * request and not on the next sign-in.
   */
  if (body.mode === 'link' && !(await isVerified(userId))) {
    return c.json(
      {
        error:
          'Confirm your email address before publishing a document to a public link. Sharing with named addresses works either way.',
      },
      403
    );
  }

  if (body.mode === 'private') {
    // Revoking drops the token: a link already sent has to stop working.
    await sql()`
      update m2h_document
      set share_mode = 'private', share_token = null
      where user_id = ${userId} and id = ${id}
    `;
  } else {
    await sql()`
      update m2h_document
      set share_mode = ${body.mode},
          share_token = coalesce(share_token, ${randomBytes(16).toString('base64url')})
      where user_id = ${userId} and id = ${id}
    `;
  }

  /* Who gets told, worked out before the list is rewritten. Empty unless somebody is added. */
  let added: string[] = [];

  if (body.emails) {
    const clean = body.emails
      .map((email) => String(email).trim().toLowerCase())
      .filter((email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email));

    /*
     * The difference, not the list.
     *
     * This endpoint replaces the whole audience on every call, which is right for the data and
     * wrong for the mail: the share dialog saves when a name is removed too, and a person who was
     * already on the list would then get a second "shared with you" for a document they have had
     * for a week. Only an address that was not there a moment ago is new.
     */
    const before = (await sql()`
      select email from m2h_document_share where document_id = ${id}
    `) as Array<{ email: string }>;

    const known = new Set(before.map((entry) => entry.email));

    added = clean.filter((email) => !known.has(email));

    await sql()`delete from m2h_document_share where document_id = ${id}`;

    for (const email of clean) {
      await sql()`
        insert into m2h_document_share (document_id, email)
        values (${id}, ${email})
        on conflict do nothing
      `;
    }
  }

  const after = await findDocument(userId, id);
  const emails = (await sql()`
    select email from m2h_document_share where document_id = ${id} order by created_at
  `) as Array<{ email: string }>;

  const url = shareUrl(c, after?.share_token ?? null);

  /*
   * Tell the people who were just added, and do not make the share wait for it.
   *
   * Until this existed, naming an address granted access and told nobody: the person found out
   * when the sharer sent them the link by hand, which is the step the feature was supposed to
   * remove. Notices are sent only in `people` mode — a link share has no audience to notify —
   * and only to addresses that were not on the list a moment ago.
   *
   * Deliberately not awaited into the response. A slow mail provider must not turn a share that
   * has already been written into a request that looks like it failed, and a share whose email
   * bounced is still a share: the access is in the database either way. Failures are logged,
   * because a person who thinks a colleague was told and was not has no way to notice otherwise.
   */
  if (after?.share_mode === 'people' && url && added.length > 0) {
    const sender = c.get('caller').email;

    void Promise.all(
      added.map(async (to) => {
        const sent = await sendShareNotice({
          to,
          from: sender ?? 'Somebody',
          documentName: after.name,
          url,
        });

        if (!sent.ok) {
          console.error(`share notice to ${to} not sent: ${sent.reason}`);
        }
      })
    );
  }

  return c.json({
    mode: after?.share_mode,
    url,
    emails: emails.map((entry) => entry.email),
    /*
     * What actually happened, so the dialog can stop implying an email that was never sent. A
     * deployment with no key configured reports zero, which is the truth.
     */
    notified: canSendMail() ? added : [],
  });
});

export default v1;
