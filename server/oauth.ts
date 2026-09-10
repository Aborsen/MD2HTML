import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { Hono } from 'hono';
import type { Context } from 'hono';
import { currentUser, selfOrigin } from './auth.js';
import { clientDocument, isDocumentId } from './cimd.js';
import { sql } from './db.js';
import { countCall } from './limits.js';

/*
 * TransformPipe as an OAuth 2.1 authorization server, for one resource: the MCP endpoint.
 *
 * It has to be its own server. The MCP authorization spec forbids a resource accepting a token
 * issued by anybody else, so the Neon Auth session cannot be handed to a client — the person signs
 * in here exactly as they always do, approves a named client on a page they looked at, and the
 * client walks away with a token of ours that acts as them and reaches nothing else.
 *
 * The order of events, which is not obvious from any one file:
 *
 *   1. The client POSTs /api/mcp with no token and gets 401 plus a WWW-Authenticate header naming
 *      the protected-resource document.
 *   2. It reads /.well-known/oauth-protected-resource (RFC 9728) to find the authorization server,
 *      then /.well-known/oauth-authorization-server (RFC 8414) to find these endpoints.
 *   3. It identifies itself: either its client_id is an https URL and we fetch the metadata
 *      document there (`server/cimd.ts`), or it registers here (RFC 7591) and is given one. No
 *      secret either way — a client running on someone else's machine cannot keep one, which is
 *      what PKCE is for.
 *   4. It sends the person to /authorize with a PKCE challenge. Not signed in, they are parked and
 *      bounced through the app's own sign-in.
 *   5. They approve — a POST from a page they read, so a link on its own authorises nothing.
 *   6. The client exchanges the code and its verifier at /token for an access and a refresh token.
 */

/*
 * Lifetimes, in seconds, and used both in the SQL that sets the expiry and in what the client is
 * told — an interval written twice is an interval that ends up meaning two different things.
 */
const CODE_TTL = 5 * 60;
const ACCESS_TTL = 30 * 24 * 60 * 60;
const REFRESH_TTL = 180 * 24 * 60 * 60;
/*
 * Half an hour, not a quarter. The person may have to sign in, and the assistant may put a
 * confirmation of its own in the way; a request that dies while they are reading a page somebody
 * else wrote reads as our failure.
 */
const PENDING_TTL = 30 * 60;

/** Ten is generous for a real client and stops one registration carrying a list of a thousand. */
const MAX_REDIRECT_URIS = 10;

export const SCOPES = ['documents:read', 'documents:write'] as const;
export const SCOPE = SCOPES.join(' ');

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

/** Comparing a hash with `===` leaks its prefix to anybody who can time it. */
function sameSecret(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Text from a stranger, made safe to store and to show.
 *
 * NUL cannot go into a Postgres text column at all — a single one in a client name turns a
 * registration into a 500 — and the bidi overrides are worse than that: they let a client register
 * as `Claude<U+202E> (verified by Anthropic)` and have the consent page render the lie right-to-left,
 * which escaping HTML does nothing about. Neither belongs in a name, a scope or a URL.
 */
const clean = (value: unknown, limit: number): string =>
  String(value ?? '')
    // C0 and C1 controls, the bidi overrides and isolates, and the zero-width joiners.
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .slice(0, limit);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export interface OAuthClient {
  id: string;
  name: string;
  redirect_uris: string[];
  /**
   * The host its description came from, for a client that identified itself with a metadata
   * document. Absent for one that registered: a registration has no source to name.
   */
  from?: string;
}

/** The canonical name of the thing these tokens are for (RFC 8707). */
export const resourceUri = (c: Context) => `${selfOrigin(c)}/api/mcp`;

/**
 * Whether a redirect_uri may be used at all.
 *
 * https, or loopback for a client that runs on the person's own machine. Claude Code declares
 * `http://localhost/callback`, listens on whatever port it was given, and expects the port to be
 * ignored (RFC 8252) — so loopback is compared without it.
 */
function usableRedirect(uri: string): boolean {
  try {
    const parsed = new URL(uri);

    if (parsed.protocol === 'https:') {
      return true;
    }

    return (
      parsed.protocol === 'http:' &&
      /^(127\.0\.0\.1|\[::1\]|localhost)$/.test(parsed.hostname)
    );
  } catch {
    return false;
  }
}

const loopback = (uri: URL) =>
  uri.protocol === 'http:' &&
  /^(127\.0\.0\.1|\[::1\]|localhost)$/.test(uri.hostname);

/**
 * Whether this client registered this redirect_uri.
 *
 * Exact string equality, not a prefix and not a host: a prefix match is how
 * `https://good.example/cb` comes to accept `https://good.example/cb.evil.test`, and this one check
 * is what stands between an authorization code and whoever asked for it. The single exception is a
 * loopback address, where the port is assigned at runtime and cannot have been registered.
 */
function registered(client: OAuthClient, uri: string): boolean {
  if (client.redirect_uris.some((known) => known === uri)) {
    return true;
  }

  let asked: URL;

  try {
    asked = new URL(uri);
  } catch {
    return false;
  }

  if (!loopback(asked)) {
    return false;
  }

  return client.redirect_uris.some((known) => {
    try {
      const parsed = new URL(known);

      return (
        loopback(parsed) &&
        parsed.hostname === asked.hostname &&
        parsed.pathname === asked.pathname
      );
    } catch {
      return false;
    }
  });
}

/**
 * A client that identified itself with a metadata document, from the document.
 *
 * The row it writes is not the source of truth — the document is, and it is re-read when the cache
 * lets go — but everything downstream of a token was written against a client that has a row: the
 * connections screen joins it for a name, and without one a person would be offered
 * "https://claude.ai/oauth/claude-code-client-metadata" to disconnect. So the fetched description
 * is mirrored, keyed by the URL, and refreshed whenever it is used.
 */
async function documentClient(id: string): Promise<OAuthClient | null> {
  const read = await clientDocument(id);

  if (!read.ok) {
    console.warn('cimd: refused %s — %s', id, read.why);

    return null;
  }

  const name = clean(read.document.client_name, 120) || 'an MCP client';
  const uris = read.document.redirect_uris
    .map((uri) => clean(uri, 500))
    .filter(usableRedirect)
    .slice(0, MAX_REDIRECT_URIS);

  if (uris.length === 0) {
    console.warn('cimd: refused %s — no usable redirect_uri', id);

    return null;
  }

  await sql()`
    insert into m2h_oauth_client (id, name, redirect_uris)
    values (${id}, ${name}, ${JSON.stringify(uris)}::jsonb)
    on conflict (id) do update
      set name = excluded.name, redirect_uris = excluded.redirect_uris
  `.catch(() => undefined);

  return { id, name, redirect_uris: uris, from: new URL(id).host };
}

async function findClient(id: string): Promise<OAuthClient | null> {
  if (!id) {
    return null;
  }

  if (isDocumentId(id)) {
    return documentClient(id);
  }

  const rows = (await sql()`
    select id, name, redirect_uris from m2h_oauth_client where id = ${id}
  `) as Array<{ id: string; name: string; redirect_uris: unknown }>;

  if (rows.length === 0) {
    return null;
  }

  return {
    id: rows[0].id,
    name: rows[0].name,
    redirect_uris: Array.isArray(rows[0].redirect_uris)
      ? (rows[0].redirect_uris as string[])
      : [],
  };
}

interface AuthorizeParams {
  client_id: string;
  redirect_uri: string;
  state: string;
  code_challenge: string;
  code_challenge_method: string;
  response_type: string;
  scope: string;
  resource: string;
}

function readAuthorizeParams(query: URLSearchParams): AuthorizeParams {
  return {
    // 512 rather than 80: a metadata document URL is the client_id itself, and `cimd.ts`
    // refuses anything longer than this before it fetches.
    client_id: clean(query.get('client_id'), 512),
    redirect_uri: clean(query.get('redirect_uri'), 500),
    state: clean(query.get('state'), 500),
    code_challenge: clean(query.get('code_challenge'), 200),
    code_challenge_method: clean(query.get('code_challenge_method'), 20),
    response_type: clean(query.get('response_type') ?? 'code', 20),
    scope: clean(query.get('scope') ?? SCOPE, 200),
    resource: clean(query.get('resource'), 300),
  };
}

/** A refusal the client is allowed to hear about, sent back on its own redirect_uri. */
function bounce(
  c: Context,
  params: AuthorizeParams,
  error: string,
  description: string
): Response {
  const back = new URL(params.redirect_uri);

  back.searchParams.set('error', error);
  back.searchParams.set('error_description', description);

  if (params.state) {
    back.searchParams.set('state', params.state);
  }

  // RFC 9207: naming the issuer lets a client that talks to several notice a mix-up.
  back.searchParams.set('iss', selfOrigin(c));

  return c.redirect(back.toString(), 302);
}

/**
 * The consent page.
 *
 * Exported so anything that needs to show what consent looks like renders this rather than a
 * mock-up — a picture of a consent screen that is not the consent screen is a lie with a long life.
 * It carries no scripts, which is why the route can serve it under `script-src 'none'`.
 */
export function consentPage(options: {
  origin: string;
  client: OAuthClient;
  who: { email: string | null; name: string };
  params: AuthorizeParams;
  pendingId: string;
}): string {
  const { origin, client, who, params, pendingId } = options;
  const canWrite = params.scope.includes('documents:write');

  /*
   * A client whose every address is on this machine cannot be told from anything else on this
   * machine: the metadata document is published by the real client, but binding a port is all it
   * takes to receive the code that comes back. The draft asks for the warning for exactly this,
   * and it is the one thing on this page the person alone can judge.
   */
  const onlyLoopback =
    client.redirect_uris.length > 0 &&
    client.redirect_uris.every((uri) => {
      try {
        return loopback(new URL(uri));
      } catch {
        return false;
      }
    });

  const hidden = [
    ['pending', pendingId],
    ['decision', ''],
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Connect ${escapeHtml(client.name)} to TransformPipe</title>
<style>
  :root { color-scheme: dark; --ink: #f4f4f5; --dim: #a1a1aa; --line: #2a2a35; --card: #17171e;
          --page: #0f0e14; --brand: #14a8af; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100dvh; display: grid; place-items: center; padding: 1.5rem;
         background: var(--page); color: var(--ink);
         font: 15px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { width: 100%; max-width: 30rem; border: 1px solid var(--line); border-radius: 12px;
         background: var(--card); padding: 1.5rem; }
  h1 { margin: 0 0 0.25rem; font-size: 1.25rem; }
  p { margin: 0 0 0.85rem; color: var(--dim); }
  strong { color: var(--ink); font-weight: 600; }
  ul { margin: 0 0 1rem; padding-left: 1.1rem; color: var(--dim); }
  li { margin: 0 0 0.35rem; }
  code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.8rem;
         word-break: break-all; color: var(--ink); }
  .row { display: flex; gap: 0.5rem; margin-top: 1.25rem; }
  button { flex: 1; padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid var(--line);
           background: transparent; color: var(--ink); font: inherit; font-weight: 500;
           cursor: pointer; }
  button.go { background: var(--brand); border-color: var(--brand); color: #06121a; }
  .foot { margin: 1rem 0 0; font-size: 0.8rem; }
  .warn { border: 1px solid #4a3a12; border-radius: 8px; background: #221a06; padding: 0.7rem 0.8rem;
          color: #e8d9a8; font-size: 0.85rem; }
</style>
</head>
<body>
<main>
  <h1>Connect ${escapeHtml(client.name)}?</h1>
  <p>It is asking to act as <strong>${escapeHtml(who.email ?? who.name)}</strong> on transformpipe.</p>

  <ul>
    <li>Read the documents on this account, and their share links.</li>
    ${canWrite ? '<li>Save new documents, share them, and delete them.</li>' : '<li>It cannot save, share or delete anything — this connection is read-only.</li>'}
    <li>Sharing a document publishes a page anyone with the link can open.</li>
    <li>It cannot reach your account, your sign-in, or your API keys.</li>
  </ul>

  <p>You can take this back at any time from the account menu, under API keys.</p>
${
  client.from
    ? `  <p class="foot">Its name and the addresses it may be sent back to are published at <code>${escapeHtml(
        client.from
      )}</code>, and were read from there just now.</p>`
    : ''
}${
  onlyLoopback
    ? `  <p class="warn">It will be sent back to a program running on this computer. Any program on
       your machine can ask to be sent there, and this page cannot tell them apart — approve it
       only if you just started this yourself.</p>`
    : ''
}
  <p class="foot">It will send you back to <code>${escapeHtml(params.redirect_uri)}</code></p>

  <form method="POST" action="${escapeHtml(origin)}/api/oauth/approve">
    ${hidden
      .filter(([, value]) => value !== '')
      .map(
        ([key, value]) =>
          `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}">`
      )
      .join('\n    ')}
    <div class="row">
      <button type="submit" name="decision" value="deny">Cancel</button>
      <button class="go" type="submit" name="decision" value="allow">Connect</button>
    </div>
  </form>
</main>
</body>
</html>
`;
}

/**
 * Something happened that is not an error the client should hear about, and not a page to approve.
 *
 * A bare line of text at a URL nobody recognises reads as a broken site. This says what happened
 * and what to do next, which is the difference between a dead end and a next step.
 */
export function noticePage(options: {
  title: string;
  body: string;
  origin: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(options.title)} — TransformPipe</title>
<style>
  :root { color-scheme: dark; --ink: #f4f4f5; --dim: #a1a1aa; --line: #2a2a35; --card: #17171e;
          --page: #0f0e14; --brand: #14a8af; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100dvh; display: grid; place-items: center; padding: 1.5rem;
         background: var(--page); color: var(--ink);
         font: 15px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { width: 100%; max-width: 30rem; border: 1px solid var(--line); border-radius: 12px;
         background: var(--card); padding: 1.5rem; }
  h1 { margin: 0 0 0.5rem; font-size: 1.15rem; }
  p { margin: 0 0 0.85rem; color: var(--dim); }
  a { color: var(--brand); }
</style>
</head>
<body>
<main>
  <h1>${escapeHtml(options.title)}</h1>
  <p>${options.body}</p>
  <p><a href="${escapeHtml(options.origin)}/docs#assistant">How connecting works</a></p>
</main>
</body>
</html>
`;
}

const CONSENT_HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'no-store',
  // It carries no scripts of its own, and a consent page that can be framed can be dressed up as
  // somebody else's page — which is the whole of what this flow exists to prevent.
  'content-security-policy':
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; script-src 'none'; frame-ancestors 'none'",
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
};

/** Occasionally, and never on the request that pays for it being slow. */
async function sweep(): Promise<void> {
  if (Math.random() > 0.02) {
    return;
  }

  await sql()`
    delete from m2h_oauth_code where expires_at < now() - interval '1 day'
  `.catch(() => undefined);

  await sql()`
    delete from m2h_oauth_pending where expires_at < now()
  `.catch(() => undefined);

  /*
   * A client anybody can create is a client anybody can create a million of. One that is a day old
   * and was never used for anything is either an abandoned attempt or noise, and either way the row
   * is worth nothing — a client that holds a token is left alone, since that is somebody's
   * connection.
   */
  await sql()`
    delete from m2h_oauth_client
    where created_at < now() - interval '1 day'
      and id not in (select client_id from m2h_oauth_token)
      and id not in (select client_id from m2h_oauth_code)
  `.catch(() => undefined);
}

async function issue(
  client_id: string,
  user_id: string,
  scope: string,
  resource: string | null,
  /** Continues an existing chain on a rotation; starts one when the code was exchanged. */
  grantId: string = randomUUID()
) {
  const access = randomBytes(32).toString('base64url');
  const refresh = randomBytes(32).toString('base64url');

  await sql()`
    insert into m2h_oauth_token
      (token_hash, kind, client_id, user_id, scope, resource, grant_id, expires_at)
    values
      (${hashToken(access)}, 'access', ${client_id}, ${user_id}, ${scope}, ${resource},
       ${grantId}, now() + make_interval(secs => ${ACCESS_TTL})),
      (${hashToken(refresh)}, 'refresh', ${client_id}, ${user_id}, ${scope}, ${resource},
       ${grantId}, now() + make_interval(secs => ${REFRESH_TTL}))
  `;

  return {
    access_token: access,
    token_type: 'Bearer',
    expires_in: ACCESS_TTL,
    refresh_token: refresh,
    scope,
  };
}

export interface TokenOwner {
  userId: string;
  email: string | null;
  scope: string;
  resource: string | null;
  clientId: string;
}

/**
 * Who an access token belongs to, or null.
 *
 * Expired, revoked and never-existed all answer the same way, and the caller turns that into one
 * 401 — a client that can tell them apart learns which strings are tokens.
 */
export async function ownerOfAccessToken(
  token: string
): Promise<TokenOwner | null> {
  const rows = (await sql()`
    select t.token_hash, t.user_id, t.scope, t.resource, t.client_id, t.expires_at, u.email
    from m2h_oauth_token t
    left join neon_auth."user" u on u.id = t.user_id
    where t.token_hash = ${hashToken(token)}
      and t.kind = 'access'
      and t.revoked_at is null
  `) as Array<{
    token_hash: string;
    user_id: string;
    scope: string;
    resource: string | null;
    client_id: string;
    expires_at: string | null;
    email: string | null;
  }>;

  const row = rows[0];

  if (!row) {
    return null;
  }

  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    return null;
  }

  /*
   * Bookkeeping should not add latency to every call, and losing one on a cold start costs nothing.
   * Hourly, like the API keys: the column answers "is this connection still in use", which is a
   * question no screen asks to the second, and a tools/call resolves the caller more than once.
   */
  void sql()`
    update m2h_oauth_token set last_used_at = now()
    where token_hash = ${row.token_hash}
      and (last_used_at is null or last_used_at < now() - interval '1 hour')
  `.catch(() => undefined);

  return {
    userId: row.user_id,
    email: row.email,
    scope: row.scope,
    resource: row.resource,
    clientId: row.client_id,
  };
}

const oauth = new Hono().basePath('/api/oauth');

/* ---------------------------------------------------------------- registration (RFC 7591) */

oauth.post('/register', async (c) => {
  /*
   * Anonymous by design — RFC 7591, and a client that runs on somebody else's machine has nothing
   * to authenticate with — so the only thing standing between this and a table full of junk is a
   * count. Keyed by address: one caller registering thirty clients a minute is not a client.
   */
  const from =
    c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
    c.req.header('x-real-ip') ||
    'unknown';
  const verdict = await countCall(`register:${from}`).catch(() => ({ ok: true }));

  if (!verdict.ok) {
    return c.json(
      {
        error: 'temporarily_unavailable',
        error_description: 'Too many registrations from here. Try again in a minute.',
      },
      429
    );
  }

  type Registration = { redirect_uris?: unknown; client_name?: unknown };

  const body = await c.req
    .json<Registration>()
    .catch(() => ({}) as Registration);

  const uris = (Array.isArray(body.redirect_uris) ? body.redirect_uris : [])
    // Capped in length as well as in number: a redirect_uri is a URL, not a place to keep things.
    .map((uri) => clean(uri, 500))
    .filter(usableRedirect)
    .slice(0, MAX_REDIRECT_URIS);

  if (uris.length === 0) {
    return c.json(
      {
        error: 'invalid_redirect_uri',
        error_description:
          'Give at least one https redirect_uri, or an http one on loopback.',
      },
      400
    );
  }

  const id = `m2hc_${randomBytes(12).toString('hex')}`;
  const name = clean(body.client_name, 120) || 'an MCP client';

  await sql()`
    insert into m2h_oauth_client (id, name, redirect_uris)
    values (${id}, ${name}, ${JSON.stringify(uris)}::jsonb)
  `;

  return c.json(
    {
      client_id: id,
      client_name: name,
      redirect_uris: uris,
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    },
    201
  );
});

/* ---------------------------------------------------------------- authorize */

/**
 * The consent step.
 *
 * Only a browser session reaches past here: `currentUser` is the only identity this handler asks
 * for, and it cannot be satisfied by a token of any kind. That is deliberate and load-bearing — a
 * token that could authorise another token is a grant that renews itself past any revocation.
 */
oauth.get('/authorize', async (c) => {
  await sweep();

  const url = new URL(c.req.url);
  const origin = selfOrigin(c);
  const parked = url.searchParams.get('p');

  let params: AuthorizeParams;

  if (parked) {
    const rows = (await sql()`
      select params, approved_at, expires_at < now() as stale
      from m2h_oauth_pending where id = ${parked}
    `) as Array<{
      params: AuthorizeParams;
      approved_at: string | null;
      stale: boolean;
    }>;

    if (rows.length === 0 || rows[0].stale) {
      return c.html(
        noticePage({
          title: 'That sign-in took too long',
          body: 'The request it belonged to is no longer good. Start the connection again from your assistant and it will bring you straight back here.',
          origin,
        }),
        400,
        CONSENT_HEADERS
      );
    }

    // Coming back to a request already approved: say so rather than asking again.
    if (rows[0].approved_at) {
      return c.html(
        noticePage({
          title: 'Already approved',
          body: 'TransformPipe has given your assistant what it asked for. Go back to it and finish there.',
          origin,
        }),
        200,
        CONSENT_HEADERS
      );
    }

    params = rows[0].params;
  } else {
    params = readAuthorizeParams(url.searchParams);
  }

  const client = await findClient(params.client_id);

  /*
   * The two failures that must not redirect: redirecting them would mean trusting the very
   * parameter that is wrong. Everything after this point can be reported to the client.
   */
  if (!client) {
    return c.text('Unknown client. Register it first.', 400);
  }

  if (!params.redirect_uri || !registered(client, params.redirect_uri)) {
    return c.text('That redirect_uri is not one this client registered.', 400);
  }

  if (params.response_type !== 'code') {
    return bounce(
      c,
      params,
      'unsupported_response_type',
      'Only the authorization code flow is supported.'
    );
  }

  if (!params.code_challenge || params.code_challenge_method !== 'S256') {
    return bounce(
      c,
      params,
      'invalid_request',
      'PKCE with code_challenge_method=S256 is required.'
    );
  }

  // RFC 8707. A token minted for one resource must not be usable at another, so a request naming
  // something that is not us is refused rather than quietly granted.
  if (params.resource && params.resource !== resourceUri(c)) {
    return bounce(
      c,
      params,
      'invalid_target',
      `This server issues tokens for ${resourceUri(c)} only.`
    );
  }

  const asked = params.scope.split(/\s+/).filter(Boolean);
  const granted = asked.filter((one) => SCOPES.includes(one as never));

  if (asked.length > 0 && granted.length === 0) {
    return bounce(
      c,
      params,
      'invalid_scope',
      `Ask for ${SCOPES.join(' or ')}.`
    );
  }

  params.scope = (granted.length > 0 ? granted : [...SCOPES]).join(' ');

  const who = await currentUser(c);

  if (!who) {
    /*
     * Park the whole validated request and send them through the app's own sign-in, which is the
     * one that already works — cookies, challenge and all. The id is opaque on purpose: a return
     * path carrying somebody else's redirect_uri is one encoding mistake away from mattering.
     */
    const id = parked ?? randomBytes(16).toString('base64url');

    await sql()`
      insert into m2h_oauth_pending (id, params, expires_at)
      values (${id}, ${JSON.stringify(params)}::jsonb, now() + make_interval(secs => ${PENDING_TTL}))
      on conflict (id) do update set params = excluded.params, expires_at = excluded.expires_at
    `;

    return c.redirect(`${origin}/?connect=${encodeURIComponent(id)}`, 302);
  }

  if (!parked) {
    // Park it anyway: the approval posts an id rather than a form full of parameters, so nothing
    // the person's browser sends back can change what they were shown.
    const id = randomBytes(16).toString('base64url');

    await sql()`
      insert into m2h_oauth_pending (id, params, expires_at, shown_to)
      values (${id}, ${JSON.stringify(params)}::jsonb,
              now() + make_interval(secs => ${PENDING_TTL}), ${who.id})
    `;

    return c.html(
      consentPage({ origin, client, who, params, pendingId: id }),
      200,
      CONSENT_HEADERS
    );
  }

  /*
   * Records who is looking at it. Approving is then something only this person's session can do
   * with this id — otherwise anyone able to start a request holds one that somebody else's browser
   * could be made to approve, and the code would go to whoever started it.
   */
  await sql()`
    update m2h_oauth_pending
    set shown_to = ${who.id}, expires_at = now() + make_interval(secs => ${PENDING_TTL})
    where id = ${parked}
  `;

  return c.html(
    consentPage({ origin, client, who, params, pendingId: parked }),
    200,
    CONSENT_HEADERS
  );
});

/*
 * Somebody reloaded the address the form posted to. It has no meaning as a GET, and answering with
 * nothing at all is how a person concludes the site is broken mid-connection.
 */
oauth.get('/approve', (c) =>
  c.html(
    noticePage({
      title: 'Nothing to approve here',
      body: 'This address is where the Connect button posts to, not a page. Start the connection again from your assistant and it will bring you back to a page you can read.',
      origin: selfOrigin(c),
    }),
    405,
    CONSENT_HEADERS
  )
);

/* ---------------------------------------------------------------- approve */

oauth.post('/approve', async (c) => {
  const origin = selfOrigin(c);
  const notice = (title: string, body: string, status: 200 | 400 | 401 | 403) =>
    c.html(noticePage({ title, body, origin }), status, CONSENT_HEADERS);

  /*
   * This is the one POST in the app that acts on a session with real consequences, so it refuses to
   * be driven from anywhere else. A browser sends Origin on every cross-site POST and Sec-Fetch-Site
   * on every request it makes; either one disagreeing is enough to stop here. Without this the
   * defence is the session cookie's SameSite attribute, which is somebody else's default to change.
   */
  const from = c.req.header('origin');
  const site = c.req.header('sec-fetch-site');

  if ((from && from !== origin) || (site && site !== 'same-origin')) {
    return notice(
      'That did not come from here',
      'This form only works from the page TransformPipe showed you. Start the connection again from your assistant.',
      403
    );
  }

  const form = await c.req.parseBody().catch(() => ({}) as Record<string, unknown>);
  const pendingId = String(form.pending ?? '');
  const decision = String(form.decision ?? 'deny');

  // Consent is given by a person at a browser, so a session is the only thing that can give it.
  const who = await currentUser(c);

  if (!who) {
    return notice(
      'Sign in first',
      'The connection has to be approved by the account it will act as. Start it again from your assistant and sign in when TransformPipe asks.',
      401
    );
  }

  const rows = (await sql()`
    select params, shown_to, approved_at, expires_at < now() as stale
    from m2h_oauth_pending
    where id = ${pendingId}
  `) as Array<{
    params: AuthorizeParams;
    shown_to: string | null;
    approved_at: string | null;
    stale: boolean;
  }>;

  const row = rows[0];

  if (!row) {
    return notice(
      'Nothing to approve',
      'There is no record of this request. It may have been approved a while ago, or the connection was started again since. Start it once more from your assistant.',
      400
    );
  }

  /*
   * Already approved. A second press of the button, or a client that started the flow again in
   * another tab, lands here — and telling somebody their request expired when they in fact
   * approved it sends them round the loop for no reason.
   */
  if (row.approved_at) {
    return notice(
      'Already approved',
      'TransformPipe has given your assistant what it asked for. Go back to it and finish there — there is nothing left to do on this page.',
      200
    );
  }

  if (row.stale) {
    return notice(
      'That took too long',
      'The request is older than half an hour, so it is no longer good. Start the connection again from your assistant.',
      400
    );
  }

  /*
   * The approval has to come from the session the page was rendered for. Anybody can start an
   * authorization request and hold its id; this is what stops one being approved by a browser it
   * was never shown to.
   */
  if (!row.shown_to || row.shown_to !== who.id) {
    return notice(
      'Approve it from the page you were shown',
      'This request was not the one TransformPipe showed this account. Start the connection again from your assistant.',
      403
    );
  }

  const params = row.params;
  const client = await findClient(params.client_id);

  if (!client || !registered(client, params.redirect_uri)) {
    return notice(
      'That client has changed',
      'The address it wants to be sent back to is not one it registered. Nothing was approved.',
      400
    );
  }

  if (decision !== 'allow') {
    await sql()`delete from m2h_oauth_pending where id = ${pendingId}`.catch(
      () => undefined
    );

    return bounce(c, params, 'access_denied', 'You did not approve this.');
  }

  const code = randomBytes(32).toString('base64url');

  await sql()`
    insert into m2h_oauth_code
      (code_hash, client_id, user_id, redirect_uri, code_challenge, resource, scope, expires_at)
    values
      (${hashToken(code)}, ${client.id}, ${who.id}, ${params.redirect_uri},
       ${params.code_challenge}, ${params.resource || null}, ${params.scope},
       now() + make_interval(secs => ${CODE_TTL}))
  `;

  // Kept, not deleted: the row is now the record that this was approved, which is what lets a
  // second press be answered honestly. The sweep clears it when it expires.
  await sql()`
    update m2h_oauth_pending set approved_at = now() where id = ${pendingId}
  `.catch(() => undefined);

  const back = new URL(params.redirect_uri);

  back.searchParams.set('code', code);

  if (params.state) {
    back.searchParams.set('state', params.state);
  }

  back.searchParams.set('iss', origin);

  return c.redirect(back.toString(), 302);
});

/* ---------------------------------------------------------------- token */

const oops = (c: Context, error: string, description: string) =>
  c.json({ error, error_description: description }, 400, {
    'cache-control': 'no-store',
  });

/**
 * Reads either encoding.
 *
 * RFC 6749 says form-urlencoded and that is what Claude sends, but a client that posts JSON here is
 * common enough that refusing it produces a 415 nobody can diagnose from the other end.
 */
async function readTokenBody(c: Context): Promise<Record<string, string>> {
  const type = c.req.header('content-type') ?? '';

  if (type.includes('application/json')) {
    const body = await c.req.json<Record<string, unknown>>().catch(() => ({}));

    return Object.fromEntries(
      Object.entries(body).map(([key, value]) => [key, String(value ?? '')])
    );
  }

  const form = await c.req
    .parseBody()
    .catch(() => ({}) as Record<string, unknown>);

  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, String(value ?? '')])
  );
}

oauth.post('/token', async (c) => {
  const body = await readTokenBody(c);
  const grantType = body.grant_type ?? '';
  const clientId = body.client_id ?? '';

  if (grantType === 'authorization_code') {
    const presented = body.code ?? '';
    const verifier = body.code_verifier ?? '';

    const rows = (await sql()`
      select code_hash, client_id, user_id, redirect_uri, code_challenge, resource, scope,
             expires_at, used_at
      from m2h_oauth_code where code_hash = ${hashToken(presented)}
    `) as Array<{
      code_hash: string;
      client_id: string;
      user_id: string;
      redirect_uri: string;
      code_challenge: string;
      resource: string | null;
      scope: string;
      expires_at: string;
      used_at: string | null;
    }>;

    const row = rows[0];

    if (!row) {
      return oops(c, 'invalid_grant', 'No such code.');
    }

    /*
     * Burnt before anything is checked against it. A code replayed while the first exchange is
     * still in flight would otherwise mint a second set of tokens, and this conditional update is
     * the only lock available when two invocations can run at once.
     */
    const burnt = (await sql()`
      update m2h_oauth_code set used_at = now()
      where code_hash = ${row.code_hash} and used_at is null
      returning code_hash
    `) as Array<{ code_hash: string }>;

    if (burnt.length === 0) {
      return oops(c, 'invalid_grant', 'That code has already been used.');
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      return oops(c, 'invalid_grant', 'That code has expired.');
    }

    if (clientId && row.client_id !== clientId) {
      return oops(c, 'invalid_grant', 'That code belongs to another client.');
    }

    if (body.redirect_uri && row.redirect_uri !== body.redirect_uri) {
      return oops(c, 'invalid_grant', 'The redirect_uri does not match.');
    }

    if (body.resource && body.resource !== resourceUri(c)) {
      return oops(c, 'invalid_target', 'That resource is not this server.');
    }

    const computed = createHash('sha256')
      .update(verifier)
      .digest('base64url');

    if (!verifier || !sameSecret(computed, row.code_challenge)) {
      return oops(
        c,
        'invalid_grant',
        'The code_verifier does not match the challenge.'
      );
    }

    const issued = await issue(
      row.client_id,
      row.user_id,
      row.scope,
      row.resource ?? resourceUri(c)
    );

    return c.json(issued, 200, { 'cache-control': 'no-store' });
  }

  if (grantType === 'refresh_token') {
    const presented = body.refresh_token ?? '';

    /*
     * Rotated in one statement rather than read-then-write: two calls arriving together would
     * otherwise both find a live row and both mint a pair, which is a refresh token that never
     * stops being worth using. Whoever wins the update owns the rotation; the loser is refused.
     */
    const rows = (await sql()`
      update m2h_oauth_token set revoked_at = now()
      where token_hash = ${hashToken(presented)}
        and kind = 'refresh'
        and revoked_at is null
      returning token_hash, client_id, user_id, scope, resource, grant_id, expires_at
    `) as Array<{
      token_hash: string;
      client_id: string;
      user_id: string;
      scope: string;
      resource: string | null;
      grant_id: string | null;
      expires_at: string | null;
    }>;

    const row = rows[0];

    if (!row) {
      /*
       * Either it was never ours, or it was rotated out already. The second case is the only signal
       * anyone gets that a refresh token has been copied — the real client and the thief both hold
       * one, and the loser of the race replays it — so the whole chain ends here. Refusing quietly
       * would leave the thief's newer token working.
       */
      const replayed = (await sql()`
        select user_id, client_id, grant_id from m2h_oauth_token
        where token_hash = ${hashToken(presented)} and kind = 'refresh'
      `) as Array<{ user_id: string; client_id: string; grant_id: string | null }>;

      if (replayed[0]) {
        await revokeGrant(replayed[0]);
      }

      return oops(c, 'invalid_grant', 'No such refresh token.');
    }

    if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
      return oops(c, 'invalid_grant', 'That refresh token has expired.');
    }

    if (clientId && row.client_id !== clientId) {
      return oops(
        c,
        'invalid_grant',
        'That refresh token belongs to another client.'
      );
    }

    const issued = await issue(
      row.client_id,
      row.user_id,
      row.scope,
      row.resource,
      row.grant_id ?? randomUUID()
    );

    return c.json(issued, 200, { 'cache-control': 'no-store' });
  }

  return c.json(
    {
      error: 'unsupported_grant_type',
      error_description: 'authorization_code or refresh_token.',
    },
    400,
    { 'cache-control': 'no-store' }
  );
});

/**
 * Ends a whole authorisation: the access token, the refresh token beside it, and every rotation
 * since.
 *
 * A grant is the unit a person thinks in — "that thing I connected" — and it is the unit RFC 7009
 * requires: handing back a refresh token has to end the access token issued with it, or a client
 * that was told it was disconnected keeps working until the hour is up. Rows without a grant_id
 * predate the column, so those fall back to the client, which is the same thing the account screen
 * revokes.
 */
async function revokeGrant(of: {
  user_id: string;
  client_id: string;
  grant_id: string | null;
}): Promise<number> {
  const gone = (of.grant_id
    ? await sql()`
        update m2h_oauth_token set revoked_at = now()
        where grant_id = ${of.grant_id} and revoked_at is null
        returning token_hash
      `
    : await sql()`
        update m2h_oauth_token set revoked_at = now()
        where user_id = ${of.user_id} and client_id = ${of.client_id} and revoked_at is null
        returning token_hash
      `) as Array<{ token_hash: string }>;

  return gone.length;
}

/* ---------------------------------------------------------------- revoke (RFC 7009) */

oauth.post('/revoke', async (c) => {
  const body = await readTokenBody(c);
  const presented = body.token ?? '';

  if (presented) {
    /*
     * The whole grant, not the row that was handed in. RFC 7009: a refresh token handed back must
     * take the access tokens issued under the same authorisation with it — and a client calling
     * this on disconnect means to be disconnected, not to lose one of its two tokens.
     */
    const rows = (await sql()`
      select user_id, client_id, grant_id from m2h_oauth_token
      where token_hash = ${hashToken(presented)}
    `.catch(() => [])) as Array<{
      user_id: string;
      client_id: string;
      grant_id: string | null;
    }>;

    if (rows[0]) {
      await revokeGrant(rows[0]).catch(() => 0);
    }
  }

  // A token that was never valid is answered exactly like one that was, so this cannot be used to
  // find out which strings are tokens.
  return c.json({}, 200, { 'cache-control': 'no-store' });
});

/* ---------------------------------------------------------------- what this person has connected */

export interface Grant {
  clientId: string;
  name: string;
  since: string;
  lastUsed: string | null;
  tokens: number;
}

/**
 * Grouped by client, not by token: nobody thinks in access tokens — they think "that thing I
 * connected". Session-only, like every other management route.
 */
oauth.get('/grants', async (c) => {
  const who = await currentUser(c);

  if (!who) {
    return c.json({ error: 'Sign in first' }, 401);
  }

  const rows = (await sql()`
    select t.client_id,
           coalesce(max(c.name), t.client_id) as name,
           min(t.created_at)                  as since,
           max(t.last_used_at)                as last_used,
           count(*)::int                      as tokens
    from m2h_oauth_token t
    left join m2h_oauth_client c on c.id = t.client_id
    where t.user_id = ${who.id} and t.revoked_at is null
    group by t.client_id
    order by min(t.created_at) desc
  `) as Array<{
    client_id: string;
    name: string;
    since: string;
    last_used: string | null;
    tokens: number;
  }>;

  return c.json({
    grants: rows.map((row) => ({
      clientId: row.client_id,
      name: row.name,
      since: row.since,
      lastUsed: row.last_used,
      tokens: row.tokens,
    })),
  });
});

/**
 * Disconnect one client.
 *
 * The id comes from `?client=` first and the path second. A metadata-document client_id is a URL,
 * and a URL in a path segment means an encoded slash — which platforms, proxies and routers each
 * normalise in their own way, and one of them turning `%2F` back into `/` is a route that no longer
 * matches. The query string carries the same value with none of that. The path form stays for the
 * registered ids that are already out there.
 */
const revokeClient = async (c: Context) => {
  const who = await currentUser(c);

  if (!who) {
    return c.json({ error: 'Sign in first' }, 401);
  }

  const clientId = c.req.query('client') ?? c.req.param('clientId') ?? '';

  if (!clientId) {
    return c.json({ error: 'Name the client to disconnect' }, 400);
  }

  /*
   * Every token for that client, in one statement. Revoking the access token alone would leave the
   * client able to mint another within the minute, which is the same as not revoking anything.
   */
  const gone = (await sql()`
    update m2h_oauth_token set revoked_at = now()
    where user_id = ${who.id} and client_id = ${clientId} and revoked_at is null
    returning token_hash
  `) as Array<{ token_hash: string }>;

  return c.json({ ok: true, revoked: gone.length });
};

oauth.delete('/grants', revokeClient);
oauth.delete('/grants/:clientId', revokeClient);

export default oauth;
