/*
 * End to end against the running dev server and the real database.
 *
 * The half that needs a browser — signing in with Google and pressing Connect — cannot be driven
 * from here, so the authorization code is minted directly in the table exactly as /approve would
 * mint it, with the same hash and the same challenge. Everything on either side of that is the
 * real code path: discovery, the 401, registration, redirect_uri validation, PKCE, the token
 * exchange, replay, refresh rotation, revocation, and every tool.
 */
import { createHash, randomBytes } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: ['.env.local', '.env'], quiet: true });

const HOST = process.env.MCP_HOST ?? 'http://127.0.0.1:5180';
const sql = neon(process.env.DATABASE_URL);
const hash = (t) => createHash('sha256').update(t).digest('hex');

let passed = 0;
let failed = 0;
let skipped = 0;

function check(name, ok, detail = '') {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

/*
 * Said out loud, and counted separately from a pass.
 *
 * A local checkout's Vercel OIDC token expires every few hours, and without it nothing can be
 * saved — which used to report as eight broken tools. A gate that cannot tell "this code is wrong"
 * from "this machine has no credentials" is a gate people learn to ignore.
 */
function skip(name, why) {
  skipped += 1;
  console.log(`  skip ${name} — ${why}`);
}

const post = (path, body, headers = {}) =>
  fetch(`${HOST}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    redirect: 'manual',
  });

const call = async (token, method, params) => {
  const response = await post(
    '/api/mcp',
    { jsonrpc: '2.0', id: 1, method, params },
    token ? { authorization: `Bearer ${token}` } : {}
  );

  const text = await response.text();

  return {
    status: response.status,
    headers: response.headers,
    body: text ? JSON.parse(text) : null,
  };
};

const tool = async (token, name, args = {}) => {
  const { body } = await call(token, 'tools/call', { name, arguments: args });

  return {
    text: body?.result?.content?.[0]?.text ?? '',
    isError: Boolean(body?.result?.isError),
  };
};

console.log('\n— discovery');

for (const path of [
  '/.well-known/oauth-protected-resource',
  '/.well-known/oauth-protected-resource/api/mcp',
  '/.well-known/oauth-authorization-server',
]) {
  const response = await fetch(`${HOST}${path}`);
  const body = await response.json().catch(() => null);

  check(`${path} answers JSON`, response.ok && body, `status ${response.status}`);

  if (path.includes('protected-resource') && body) {
    check(
      `${path} names one authorization server`,
      body.authorization_servers?.length === 1,
      JSON.stringify(body.authorization_servers)
    );
    check(
      `${path} resource is the endpoint`,
      body.resource === `${HOST}/api/mcp`,
      body.resource
    );
  }

  if (path.includes('authorization-server') && body) {
    check('S256 only', JSON.stringify(body.code_challenge_methods_supported) === '["S256"]');
    check('no client secret expected', body.token_endpoint_auth_methods_supported?.includes('none'));
    check(
      'CIMD is advertised',
      body.client_id_metadata_document_supported === true
    );
    check('and registration is still offered beside it', Boolean(body.registration_endpoint));
  }
}

console.log('\n— the 401 that starts a sign-in');

const bare = await call(null, 'initialize', {});
const challenge = bare.headers.get('www-authenticate') ?? '';

check('unauthenticated POST is 401, not 200', bare.status === 401, `got ${bare.status}`);
check('WWW-Authenticate names the metadata', challenge.includes('resource_metadata='), challenge);
check('and the scopes', challenge.includes('documents:write'), challenge);

const wrongToken = await call('not-a-real-token', 'tools/list');
check('an unknown bearer is 401 too', wrongToken.status === 401, `got ${wrongToken.status}`);

const getIt = await fetch(`${HOST}/api/mcp`);
check('GET is 405 with Allow', getIt.status === 405 && getIt.headers.get('allow')?.includes('POST'));

console.log('\n— registration');

const registered = await post('/api/oauth/register', {
  client_name: 'e2e probe',
  redirect_uris: ['https://claude.ai/api/mcp/auth_callback', 'http://localhost/callback'],
});
const client = await registered.json();

check('registration is 201', registered.status === 201, `got ${registered.status}`);
check('a client id comes back', String(client.client_id ?? '').startsWith('m2hc_'), client.client_id);
check('and no secret', client.client_secret === undefined);

const rejected = await post('/api/oauth/register', {
  redirect_uris: ['http://evil.example/cb'],
});
check('a non-loopback http redirect_uri is refused', rejected.status === 400, `got ${rejected.status}`);

console.log('\n— authorize, before anybody is signed in');

const authorize = (params) =>
  fetch(`${HOST}/api/oauth/authorize?${new URLSearchParams(params)}`, {
    redirect: 'manual',
  });

const unknownClient = await authorize({
  client_id: 'm2hc_nope',
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
  response_type: 'code',
  code_challenge: 'x',
  code_challenge_method: 'S256',
});
check('an unknown client gets a plain 400, never a redirect', unknownClient.status === 400);

const strayRedirect = await authorize({
  client_id: client.client_id,
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback.evil.test',
  response_type: 'code',
  code_challenge: 'x',
  code_challenge_method: 'S256',
});
check('a redirect_uri that only looks right is refused', strayRedirect.status === 400);

const noPkce = await authorize({
  client_id: client.client_id,
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
  response_type: 'code',
  state: 'st',
});
const noPkceTo = noPkce.headers.get('location') ?? '';
check(
  'a request without PKCE is bounced to the client as invalid_request',
  noPkce.status === 302 && noPkceTo.includes('error=invalid_request'),
  noPkceTo
);
check('and keeps its state', noPkceTo.includes('state=st'), noPkceTo);

const wrongResource = await authorize({
  client_id: client.client_id,
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
  response_type: 'code',
  code_challenge: 'x',
  code_challenge_method: 'S256',
  resource: 'https://somewhere.else/api/mcp',
});
check(
  'a token asked for another resource is refused',
  (wrongResource.headers.get('location') ?? '').includes('error=invalid_target'),
  wrongResource.headers.get('location') ?? ''
);

const signedOut = await authorize({
  client_id: client.client_id,
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
  response_type: 'code',
  code_challenge: 'x'.repeat(43),
  code_challenge_method: 'S256',
  state: 'st',
});
const parked = signedOut.headers.get('location') ?? '';
check(
  'a signed-out person is parked and sent to the app to sign in',
  signedOut.status === 302 && parked.includes('/?connect='),
  parked
);

const pendingId = new URL(parked, HOST).searchParams.get('connect');
const pendingRow = await sql`select params from m2h_oauth_pending where id = ${pendingId}`;
check(
  'the whole request is parked server-side, not carried in the address',
  pendingRow.length === 1 && pendingRow[0].params.client_id === client.client_id
);

console.log('\n— a client that identified itself with a metadata document');

/*
 * Claude Code's own document, fetched from the address Claude Code puts in its client_id. A
 * fixture of ours would prove the parser and nothing else; this proves the thing that has to
 * work — the real document, the real fetch, and the loopback redirect_uri with a port that
 * cannot have been registered because it is chosen at runtime.
 */
const CIMD = 'https://claude.ai/oauth/claude-code-client-metadata';

const byDocument = await authorize({
  client_id: CIMD,
  redirect_uri: 'http://localhost:53119/callback',
  response_type: 'code',
  code_challenge: 'x'.repeat(43),
  code_challenge_method: 'S256',
  state: 'st',
});

check(
  'a URL client_id is fetched and accepted',
  byDocument.status === 302 && (byDocument.headers.get('location') ?? '').includes('/?connect='),
  `${byDocument.status} ${byDocument.headers.get('location') ?? (await byDocument.text()).slice(0, 80)}`
);

const mirrored = await sql`select name, redirect_uris from m2h_oauth_client where id = ${CIMD}`;
check(
  'and mirrored into the client table under its URL',
  mirrored.length === 1 && mirrored[0].name === 'Claude Code',
  JSON.stringify(mirrored[0] ?? null)
);

const strayFromDocument = await authorize({
  client_id: CIMD,
  redirect_uri: 'https://evil.example/callback',
  response_type: 'code',
  code_challenge: 'x'.repeat(43),
  code_challenge_method: 'S256',
});
check(
  'a redirect_uri the document does not list is refused',
  strayFromDocument.status === 400,
  `got ${strayFromDocument.status}`
);

const notJson = await authorize({
  client_id: `${HOST.replace('http://', 'https://')}/docs`,
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
  response_type: 'code',
  code_challenge: 'x'.repeat(43),
  code_challenge_method: 'S256',
});
check(
  'an https URL that is not a metadata document is refused',
  notJson.status === 400,
  `got ${notJson.status}`
);

const bareOrigin = await authorize({
  client_id: 'https://claude.ai',
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
  response_type: 'code',
  code_challenge: 'x'.repeat(43),
  code_challenge_method: 'S256',
});
check(
  'an origin with no path is not a client_id',
  bareOrigin.status === 400,
  `got ${bareOrigin.status}`
);

const insideOut = await authorize({
  client_id: 'https://localhost/client.json',
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
  response_type: 'code',
  code_challenge: 'x'.repeat(43),
  code_challenge_method: 'S256',
});
check(
  'a client_id pointing inside is refused before it is fetched',
  insideOut.status === 400,
  `got ${insideOut.status}`
);

console.log('\n— the token exchange');

const [someone] = await sql`
  select d.user_id from m2h_document d group by d.user_id order by count(*) desc limit 1
`;

if (!someone) {
  console.log('  (no account in this database to act as; stopping here)');
  process.exit(failed > 0 ? 1 : 0);
}

const verifier = randomBytes(32).toString('base64url');
const codeChallenge = createHash('sha256').update(verifier).digest('base64url');
const code = randomBytes(32).toString('base64url');

await sql`
  insert into m2h_oauth_code
    (code_hash, client_id, user_id, redirect_uri, code_challenge, resource, scope, expires_at)
  values (${hash(code)}, ${client.client_id}, ${someone.user_id},
          'https://claude.ai/api/mcp/auth_callback', ${codeChallenge},
          ${`${HOST}/api/mcp`}, 'documents:read documents:write',
          now() + interval '5 minutes')
`;

const form = (fields) =>
  fetch(`${HOST}/api/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields),
  });

const wrongVerifier = await form({
  grant_type: 'authorization_code',
  code,
  code_verifier: 'not-the-verifier',
  client_id: client.client_id,
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
});
const wrongBody = await wrongVerifier.json();

check(
  'a wrong code_verifier is invalid_grant',
  wrongVerifier.status === 400 && wrongBody.error === 'invalid_grant',
  JSON.stringify(wrongBody)
);

// That attempt burnt the code, which is the point: one code, one exchange, whatever the outcome.
const replay = await form({
  grant_type: 'authorization_code',
  code,
  code_verifier: verifier,
  client_id: client.client_id,
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
});
const replayBody = await replay.json();

check(
  'and the code is burnt by the attempt, not by success',
  replay.status === 400 && /already been used/.test(replayBody.error_description ?? ''),
  JSON.stringify(replayBody)
);

const second = randomBytes(32).toString('base64url');

await sql`
  insert into m2h_oauth_code
    (code_hash, client_id, user_id, redirect_uri, code_challenge, resource, scope, expires_at)
  values (${hash(second)}, ${client.client_id}, ${someone.user_id},
          'https://claude.ai/api/mcp/auth_callback', ${codeChallenge},
          ${`${HOST}/api/mcp`}, 'documents:read documents:write',
          now() + interval '5 minutes')
`;

const exchanged = await form({
  grant_type: 'authorization_code',
  code: second,
  code_verifier: verifier,
  client_id: client.client_id,
  redirect_uri: 'https://claude.ai/api/mcp/auth_callback',
});
const tokens = await exchanged.json();

check('form-urlencoded is accepted', exchanged.status === 200, `got ${exchanged.status}`);
check('an access token comes back', Boolean(tokens.access_token), JSON.stringify(tokens).slice(0, 120));
check('with a refresh token', Boolean(tokens.refresh_token));
check('and a bearer type', tokens.token_type === 'Bearer');

console.log('\n— the endpoint, with a real token');

const hello = await call(tokens.access_token, 'initialize', {
  protocolVersion: '2025-06-18',
  clientInfo: { name: 'e2e', version: '1' },
});

check('initialize is 200', hello.status === 200, `got ${hello.status}`);
check(
  'and echoes the version it was asked for',
  hello.body?.result?.protocolVersion === '2025-06-18',
  JSON.stringify(hello.body?.result?.protocolVersion)
);
check('a session id is minted', Boolean(hello.headers.get('mcp-session-id')));
check(
  'the instructions warn about publishing and deleting',
  /public web/.test(hello.body?.result?.instructions ?? '') &&
    /no undo/.test(hello.body?.result?.instructions ?? '')
);

const older = await call(tokens.access_token, 'initialize', { protocolVersion: '1999-01-01' });
check(
  'an unknown version gets ours rather than an error',
  older.body?.result?.protocolVersion === '2025-11-25',
  JSON.stringify(older.body?.result?.protocolVersion)
);

const note = await fetch(`${HOST}/api/mcp`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    authorization: `Bearer ${tokens.access_token}`,
  },
  body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
});
check('a notification is answered 202 with no body', note.status === 202);

const listed = await call(tokens.access_token, 'tools/list');
const names = (listed.body?.result?.tools ?? []).map((t) => t.name);

check('tools/list answers', listed.status === 200);
check('ten tools or fewer, and none named after a document', names.length <= 10 && names.length >= 7, names.join(', '));
check('every tool has an inputSchema', (listed.body?.result?.tools ?? []).every((t) => t.inputSchema?.type === 'object'));

const unknown = await call(tokens.access_token, 'resources/list');
check(
  'an unknown method is a JSON-RPC -32601, not an HTTP error',
  unknown.status === 200 && unknown.body?.error?.code === -32601,
  JSON.stringify(unknown.body)
);

console.log('\n— the tools');

const help = await tool(tokens.access_token, 'tp_help', { question: 'what are the limits' });
check('help answers from the documentation', /100/.test(help.text) && !help.isError, help.text.slice(0, 80));

const converted = await tool(tokens.access_token, 'tp_convert_markdown', {
  markdown: '# Hi\n\n<script>alert(1)</script>\n\n| a | b |\n| --- | --- |\n| 1 | 2 |',
});
check('convert renders a table', /<table>/.test(converted.text));
check('and drops the script', !/<script/.test(converted.text), converted.text.slice(0, 120));

const empty = await tool(tokens.access_token, 'tp_convert_markdown', { markdown: '   ' });
check('an empty conversion is refused in a sentence', empty.isError && /no Markdown/i.test(empty.text));

const saved = await tool(tokens.access_token, 'tp_save_document', {
  markdown: '# From an assistant\n\nHello.',
  name: 'mcp-e2e.md',
  share: 'link',
});
/*
 * A local checkout keeps a Vercel OIDC token that expires every few hours; without it the Blob
 * store refuses the write and nothing can be saved. That is this machine's credential, not this
 * code's behaviour, so what depends on it is skipped rather than failed — and named, so nobody
 * reads a green run as coverage it did not have.
 */
const blobless = /No blob credentials|BLOB_READ_WRITE_TOKEN/.test(saved.text);
const why = 'no Blob credentials here — run `vercel env pull .env.local`';

const savedId = (saved.text.match(/id ([0-9a-f-]{36})/) ?? [])[1];
const savedUrl = (saved.text.match(/https?:\/\/\S+\/s\/\S+/) ?? [])[0];

if (blobless) {
  for (const name of [
    'save returns an id',
    'and a share link',
    'which serves the document',
    'the list finds it and states what it showed',
    'get returns the source',
    'and the HTML',
  ]) {
    skip(name, why);
  }
} else {
check('save returns an id', Boolean(savedId), saved.text);
check('and a share link', Boolean(savedUrl), saved.text);

if (savedUrl) {
  const page = await fetch(savedUrl);
  const html = await page.text();

  check('which serves the document', page.ok && /From an assistant/.test(html));
}

const list = await tool(tokens.access_token, 'tp_list_documents', { query: 'mcp-e2e' });
check('the list finds it and states what it showed', /1 of 1 shown/.test(list.text), list.text.slice(0, 100));

const got = await tool(tokens.access_token, 'tp_get_document', { id: savedId });
check('get returns the source', /Hello\./.test(got.text));

const asHtml = await tool(tokens.access_token, 'tp_get_document', { id: savedId, as: 'html' });
check('and the HTML', /<h1/.test(asHtml.text));
}

const missing = await tool(tokens.access_token, 'tp_get_document', {
  id: '00000000-0000-0000-0000-000000000000',
});
check('a document that is not yours is simply not found', missing.isError, missing.text.slice(0, 80));

if (blobless) {
  skip('sharing can be revoked', why);
} else {
  const shared = await tool(tokens.access_token, 'tp_share_document', {
    id: savedId,
    mode: 'private',
  });
  check('sharing can be revoked', /private/.test(shared.text) && /no longer opens/.test(shared.text), shared.text);
}

const usage = await tool(tokens.access_token, 'tp_usage', {});
check('usage names both ceilings', /of 100.0 MB/.test(usage.text) && /of 500 documents/.test(usage.text), usage.text);

const unconfirmed = await tool(tokens.access_token, 'tp_delete_document', {
  id: savedId ?? '00000000-0000-0000-0000-000000000000',
  confirm: false,
});
check('a delete without confirmation refuses and says why', unconfirmed.isError && /confirm/.test(unconfirmed.text));

if (blobless) {
  skip('and with it, the document goes', why);
} else {
  const deleted = await tool(tokens.access_token, 'tp_delete_document', { id: savedId, confirm: true });
  check('and with it, the document goes', /Deleted/.test(deleted.text), deleted.text);
}

const nonsenseId = await tool(tokens.access_token, 'tp_get_document', { id: '../usage' });
check(
  'an id that is not an id is not found, rather than a crash',
  nonsenseId.isError,
  nonsenseId.text.slice(0, 80)
);

console.log('\n— scope');

const readOnly = randomBytes(32).toString('base64url');

await sql`
  insert into m2h_oauth_token (token_hash, kind, client_id, user_id, scope, resource, expires_at)
  values (${hash(readOnly)}, 'access', ${client.client_id}, ${someone.user_id},
          'documents:read', ${`${HOST}/api/mcp`}, now() + interval '1 hour')
`;

const refusedWrite = await tool(readOnly, 'tp_save_document', { markdown: '# no' });
check('a read-only grant cannot save', refusedWrite.isError && /read-only/.test(refusedWrite.text), refusedWrite.text);

const allowedRead = await tool(readOnly, 'tp_list_documents', {});
check('but can still read', !allowedRead.isError);

console.log('\n— refresh and revocation');

const refreshed = await form({
  grant_type: 'refresh_token',
  refresh_token: tokens.refresh_token,
  client_id: client.client_id,
});
const rolled = await refreshed.json();

check('a refresh returns a new pair', refreshed.status === 200 && Boolean(rolled.access_token));

const reused = await form({
  grant_type: 'refresh_token',
  refresh_token: tokens.refresh_token,
  client_id: client.client_id,
});
check('and the old refresh token dies with it', reused.status === 400);

const revoke = await fetch(`${HOST}/api/oauth/revoke`, {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ token: rolled.access_token }),
});
check('revoke answers 200', revoke.status === 200);

const afterRevoke = await call(rolled.access_token, 'tools/list');
check('and the token stops working', afterRevoke.status === 401, `got ${afterRevoke.status}`);

const neverExisted = await fetch(`${HOST}/api/oauth/revoke`, {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ token: 'nonsense' }),
});
check('a token that never existed is answered the same way', neverExisted.status === 200);

console.log('\n— clearing up');

/*
 * Its own token: the section above deliberately revokes the one the rest of the run used, and a
 * test that reads a revoked credential proves nothing about the boundary it is checking.
 */
const stillGood = randomBytes(32).toString('base64url');

await sql`
  insert into m2h_oauth_token (token_hash, kind, client_id, user_id, scope, resource, expires_at)
  values (${hash(stillGood)}, 'access', ${client.client_id}, ${someone.user_id},
          'documents:read documents:write', ${`${HOST}/api/mcp`}, now() + interval '1 hour')
`;

const asApi = (path, init = {}, token = readOnly) =>
  fetch(`${HOST}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
    redirect: 'manual',
  });

/*
 * Invariant 8, at the door the tools go through rather than at the tools. The read-only refusal
 * used to live only in the MCP dispatcher, which left the same token free to write straight at the
 * public API, so every one of these is checked where the write actually happens.
 */
const [mine] = await sql`
  select id from m2h_document where user_id = ${someone.user_id} limit 1
`;

if (mine) {
  const roShare = await asApi(`/api/v1/documents/${mine.id}/share`, {
    method: 'PUT',
    body: JSON.stringify({ mode: 'link' }),
  });
  check('a read-only token cannot share through the API', roShare.status === 403, `got ${roShare.status}`);

  const roDelete = await asApi(`/api/v1/documents/${mine.id}`, { method: 'DELETE' });
  check('nor delete', roDelete.status === 403, `got ${roDelete.status}`);

  const roRead = await asApi(`/api/v1/documents/${mine.id}`);

  if (blobless && roRead.status === 502) {
    skip('but reading is what it was granted', why);
  } else {
    check('but reading is what it was granted', roRead.status === 200, `got ${roRead.status}`);
  }
} else {
  skip('a read-only token cannot share through the API', 'no document on this account');
}

const roPost = await asApi('/api/v1/documents?name=no.md', {
  method: 'POST',
  headers: { 'content-type': 'text/markdown' },
  body: '# no',
});
check('nor save', roPost.status === 403, `got ${roPost.status}`);

/* Invariant 9: the account and its credentials are not reachable with a token of any kind. */
const keysWithToken = await asApi('/api/keys', {}, stillGood);
check('an OAuth token cannot list the API keys', keysWithToken.status === 401, `got ${keysWithToken.status}`);

const keysMint = await asApi('/api/keys', {
  method: 'POST',
  body: JSON.stringify({ name: 'minted by a token' }),
}, stillGood);
check('nor mint one', keysMint.status === 401, `got ${keysMint.status}`);

const grantsWithToken = await asApi('/api/oauth/grants', {}, stillGood);
check('nor read what else is connected', grantsWithToken.status === 401, `got ${grantsWithToken.status}`);

/* Invariant 1: consent belongs to a session, and a token is not one. */
const consentByToken = await fetch(`${HOST}/api/oauth/approve`, {
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    origin: HOST,
    authorization: `Bearer ${stillGood}`,
  },
  body: new URLSearchParams({ pending: pendingId, decision: 'allow' }),
  redirect: 'manual',
});
check('a token cannot approve a connection', consentByToken.status === 401, `got ${consentByToken.status}`);

/* Invariant 2: somebody else's document, with a correct-looking id, is not found. */
const [stranger] = await sql`
  select id from m2h_document where user_id <> ${someone.user_id} limit 1
`;

if (stranger) {
  const theirs = await tool(stillGood, 'tp_get_document', { id: stranger.id });
  check("another account's document is not found, id or no id", theirs.isError, theirs.text.slice(0, 80));
} else {
  skip("another account's document is not found", 'only one account in this database');
}

/* The one place redirect_uri matching is relaxed, and it is relaxed only for loopback. */
const loopbackPort = await fetch(
  `${HOST}/api/oauth/authorize?${new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: 'http://localhost:57231/callback',
    response_type: 'code',
    code_challenge: 'x'.repeat(43),
    code_challenge_method: 'S256',
  })}`,
  { redirect: 'manual' }
);
check(
  'a loopback redirect_uri is accepted on any port',
  loopbackPort.status === 302 && (loopbackPort.headers.get('location') ?? '').includes('/?connect='),
  `${loopbackPort.status} ${loopbackPort.headers.get('location') ?? ''}`
);

const notLoopback = await fetch(
  `${HOST}/api/oauth/authorize?${new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: 'https://claude.ai:8443/api/mcp/auth_callback',
    response_type: 'code',
    code_challenge: 'x'.repeat(43),
    code_challenge_method: 'S256',
  })}`,
  { redirect: 'manual' }
);
check('but a public one is matched exactly, port and all', notLoopback.status === 400, `got ${notLoopback.status}`);

/* A forged forwarding header must not choose what the discovery documents say. */
const forged = await fetch(`${HOST}/.well-known/oauth-authorization-server`, {
  headers: { 'x-forwarded-host': 'evil.test', 'x-forwarded-proto': 'https' },
});
const forgedBody = await forged.json();
check(
  'a forged x-forwarded-host does not become the issuer',
  !JSON.stringify(forgedBody).includes('evil.test'),
  forgedBody.issuer
);

/* A message with no id is a notification: no answer, and nothing run. */
const notification = await fetch(`${HOST}/api/mcp`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    authorization: `Bearer ${stillGood}`,
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/call',
    params: { name: 'tp_usage', arguments: {} },
  }),
});
const notificationBody = await notification.text();
check(
  'a call with no id is answered 202 and nothing else',
  notification.status === 202 && notificationBody === '',
  `${notification.status} ${notificationBody.slice(0, 60)}`
);

await sql`delete from m2h_oauth_token where client_id = ${client.client_id}`;
await sql`delete from m2h_oauth_code where client_id = ${client.client_id}`;
await sql`delete from m2h_oauth_pending where id = ${pendingId}`;
await sql`delete from m2h_oauth_client where id = ${client.client_id}`;
await sql`delete from m2h_document where name in ('mcp-e2e.md', 'no.md')`;

console.log(
  `
${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped` : ''}
`
);
process.exit(failed > 0 ? 1 : 0);
