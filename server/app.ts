import { randomBytes } from 'node:crypto';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import {
  buildNoticePage,
  buildReportPage,
  buildSharedPage,
  buildStandaloneHtml,
} from '../shared/markdown.js';
import { authProxy, currentUser, type SessionUser } from './auth.js';
import { sql, type DocumentRow } from './db.js';
import { createKey, forgetKey, listKeys, revokeKey } from './keys.js';
import { checkQuota, QUOTA, usageOf } from './limits.js';
import mcp from './mcp.js';
import oauth from './oauth.js';
import { authorizationServer, protectedResource } from './wellknown.js';
import { deleteSources, putSource, readSource } from './source.js';
import v1 from './v1.js';

type Env = { Variables: { user: SessionUser } };

/*
 * Two roots: the API, and the share links people paste around. A shared page is rendered here
 * rather than in the browser so it can be cached at the edge — see `GET /s/:token`.
 */
const app = new Hono<Env>();

const api = new Hono<Env>().basePath('/api');

api.get('/health', (c) => c.json({ ok: true }));

interface ShareRow {
  id: string;
  name: string;
  markdown: string;
  created_at: string;
  share_mode: 'private' | 'link' | 'people';
  share_token: string | null;
}

const normaliseEmail = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

/**
 * A shared document, if this caller may have it.
 *
 * 'link' is anyone holding the token. 'people' is the owner plus the addresses on the document —
 * checked against the session, never against anything the caller says about themselves.
 */
api.get('/shared/:token', async (c) => {
  const rows = (await sql()`
    select id, user_id, name, markdown, blob_path, created_at, share_mode, share_token
    from m2h_document
    where share_token = ${c.req.param('token')}
  `) as Array<ShareRow & { user_id: string; blob_path: string | null }>;

  const document = rows[0];

  if (!document || document.share_mode === 'private') {
    return c.json({ error: 'Not found' }, 404);
  }

  if (document.share_mode === 'people') {
    const user = await currentUser(c);

    if (!user) {
      return c.json({ error: 'Sign in to open this document' }, 401);
    }

    const allowed =
      user.id === document.user_id ||
      ((await sql()`
        select 1 from m2h_document_share
        where document_id = ${document.id}
          and email = ${normaliseEmail(user.email)}
      `) as unknown[]).length > 0;

    if (!allowed) {
      return c.json({ error: 'This document was not shared with you' }, 403);
    }
  }

  return c.json({
    document: {
      name: document.name,
      markdown: await readSource(document),
      created_at: document.created_at,
    },
  });
});

// Sign-in, sign-out and the session read all live at the auth service; this app only forwards
// them so its cookie is first-party. See server/auth.ts.
api.all('/auth/*', authProxy);

/** Everything below needs a session. */
const requireUser = createMiddleware<Env>(async (c, next) => {
  const user = await currentUser(c);

  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  c.set('user', user);

  return next();
});

/*
 * Key management is session-only, deliberately: a leaked key must not be able to mint its
 * replacement or revoke the owner's other keys.
 */
api.use('/keys', requireUser);
api.use('/keys/*', requireUser);

api.get('/keys', async (c) => c.json({ keys: await listKeys(c.get('user').id) }));

api.post('/keys', async (c) => {
  const body = await c.req
    .json<{ name?: string }>()
    .catch(() => ({}) as { name?: string });
  const name = (body.name ?? '').trim();

  if (!name) {
    return c.json({ error: 'Give the key a name you will recognise' }, 400);
  }

  const created = await createKey(c.get('user').id, name);

  // The only time the key itself is ever returned.
  return c.json({ key: created.key, created: created.row }, 201);
});

/*
 * `?forget=1` deletes the row rather than revoking the key. It only works on a key that is already
 * revoked, so the sequence is always stop-it-working, then tidy up — never the other way round.
 */
api.delete('/keys/:id', async (c) => {
  const userId = c.get('user').id;
  const id = c.req.param('id');

  if (c.req.query('forget') === '1') {
    const forgotten = await forgetKey(userId, id);

    return forgotten
      ? c.json({ ok: true })
      : c.json({ error: 'Revoke the key before removing it' }, 409);
  }

  const revoked = await revokeKey(userId, id);

  return revoked ? c.json({ ok: true }) : c.json({ error: 'Not found' }, 404);
});

/*
 * What the account is using, for the line under the history. It lives here rather than being read
 * from /api/v1 so the app's own screens do not spend the public API's rate budget — the panel
 * re-asks whenever the list changes.
 */
api.use('/usage', requireUser);
api.get('/usage', async (c) => c.json(await usageOf(c.get('user').id)));

api.use('/documents', requireUser);
api.use('/documents/*', requireUser);
api.use('/shared-with-me', requireUser);

/**
 * Documents other people shared with this address.
 *
 * Only 'people' shares appear: a link share is addressed to whoever holds the link, not to anyone
 * in particular, so it has no business showing up in someone's list. The content is not returned
 * here — the row carries the token and reads it through /shared/:token, which is the one place
 * access is decided.
 */
api.get('/shared-with-me', async (c) => {
  const user = c.get('user');

  const rows = (await sql()`
    select d.id,
           d.name,
           d.size,
           d.stats,
           d.created_at,
           d.share_token,
           coalesce(u.email, '') as owner_email,
           s.created_at as shared_at
    from m2h_document_share s
    join m2h_document d on d.id = s.document_id
    left join neon_auth."user" u on u.id = d.user_id
    where s.email = ${normaliseEmail(user.email)}
      and d.share_mode = 'people'
      and d.user_id <> ${user.id}
    order by s.created_at desc
    limit ${QUOTA.documents}
  `) as Array<DocumentRow & { share_token: string; owner_email: string }>;

  return c.json({ documents: rows });
});

api.get('/documents', async (c) => {
  const rows = (await sql()`
    select id, name, size, stats, created_at
    from m2h_document
    where user_id = ${c.get('user').id}
    order by created_at desc
    limit ${QUOTA.documents}
  `) as DocumentRow[];

  return c.json({ documents: rows });
});

api.post('/documents', async (c) => {
  const userId = c.get('user').id;

  type CreateBody = {
    name?: string;
    size?: number;
    markdown?: string;
    stats?: Record<string, number>;
  };

  const body = await c.req.json<CreateBody>().catch(() => ({}) as CreateBody);

  if (!body.name || typeof body.markdown !== 'string') {
    return c.json({ error: 'name and markdown are required' }, 400);
  }

  const size = new TextEncoder().encode(body.markdown).length;
  const room = await checkQuota(userId, size);

  if (!room.ok) {
    return c.json({ error: room.error, usage: room.usage }, room.status);
  }

  /*
   * The row is created first, empty of text, because a source's path is derived from its id. If
   * the upload then fails the row is removed again: a document that cannot be opened would be
   * worse than no document at all.
   */
  const rows = (await sql()`
    insert into m2h_document (user_id, name, size, markdown, stats)
    values (
      ${userId},
      ${body.name},
      ${body.size ?? body.markdown.length},
      null,
      ${JSON.stringify(body.stats ?? {})}::jsonb
    )
    returning id, name, size, stats, created_at
  `) as DocumentRow[];

  try {
    const stored = await putSource(userId, rows[0].id, body.markdown);

    await sql()`
      update m2h_document
      set blob_path = ${stored.blobPath}, markdown = ${stored.markdown}
      where id = ${rows[0].id}
    `;
  } catch (cause) {
    await sql()`delete from m2h_document where id = ${rows[0].id}`;

    const why = cause instanceof Error ? cause.message : 'upload failed';

    return c.json({ error: `Could not store the document: ${why}` }, 502);
  }

  return c.json({ document: rows[0] }, 201);
});

api.get('/documents/:id', async (c) => {
  const rows = (await sql()`
    select id, name, size, stats, created_at, markdown, blob_path
    from m2h_document
    where user_id = ${c.get('user').id} and id = ${c.req.param('id')}
  `) as Array<DocumentRow & { blob_path: string | null }>;

  if (rows.length === 0) {
    return c.json({ error: 'Not found' }, 404);
  }

  const { blob_path: _stored, ...document } = rows[0];

  return c.json({
    document: {
      ...document,
      markdown: await readSource({ ...rows[0], user_id: c.get('user').id }),
    },
  });
});

/** The document's sharing state, as the dialog needs it. */
async function shareState(userId: string, documentId: string) {
  const rows = (await sql()`
    select id, share_mode, share_token
    from m2h_document
    where user_id = ${userId} and id = ${documentId}
  `) as Array<Pick<ShareRow, 'id' | 'share_mode' | 'share_token'>>;

  if (rows.length === 0) {
    return null;
  }

  const emails = (await sql()`
    select email from m2h_document_share
    where document_id = ${documentId}
    order by created_at
  `) as Array<{ email: string }>;

  return {
    mode: rows[0].share_mode,
    token: rows[0].share_token,
    emails: emails.map((row) => row.email),
  };
}

/** Mints the token the first time a document is shared; later modes reuse it. */
async function ensureToken(userId: string, documentId: string) {
  const rows = (await sql()`
    update m2h_document
    set share_token = coalesce(share_token, ${randomBytes(16).toString('base64url')})
    where user_id = ${userId} and id = ${documentId}
    returning share_token
  `) as Array<{ share_token: string }>;

  return rows[0]?.share_token ?? null;
}

api.get('/documents/:id/share', async (c) => {
  const state = await shareState(c.get('user').id, c.req.param('id'));

  return state ? c.json(state) : c.json({ error: 'Not found' }, 404);
});

api.put('/documents/:id/share', async (c) => {
  const userId = c.get('user').id;
  const id = c.req.param('id');
  const body = await c.req
    .json<{ mode?: 'private' | 'link' | 'people' }>()
    .catch(() => ({}) as { mode?: 'private' | 'link' | 'people' });

  if (!body.mode || !['private', 'link', 'people'].includes(body.mode)) {
    return c.json({ error: 'mode must be private, link or people' }, 400);
  }

  if (body.mode === 'private') {
    // Revoking drops the token as well: a link that was sent must stop working.
    await sql()`
      update m2h_document
      set share_mode = 'private', share_token = null
      where user_id = ${userId} and id = ${id}
    `;
  } else {
    if (!(await ensureToken(userId, id))) {
      return c.json({ error: 'Not found' }, 404);
    }

    await sql()`
      update m2h_document
      set share_mode = ${body.mode}
      where user_id = ${userId} and id = ${id}
    `;
  }

  const state = await shareState(userId, id);

  return state ? c.json(state) : c.json({ error: 'Not found' }, 404);
});

api.post('/documents/:id/share/people', async (c) => {
  const userId = c.get('user').id;
  const id = c.req.param('id');
  const body = await c.req
    .json<{ email?: string }>()
    .catch(() => ({}) as { email?: string });
  const email = normaliseEmail(body.email);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return c.json({ error: 'That does not look like an email address' }, 400);
  }

  if (!(await ensureToken(userId, id))) {
    return c.json({ error: 'Not found' }, 404);
  }

  await sql()`
    insert into m2h_document_share (document_id, email)
    values (${id}, ${email})
    on conflict do nothing
  `;

  await sql()`
    update m2h_document
    set share_mode = 'people'
    where user_id = ${userId} and id = ${id} and share_mode <> 'link'
  `;

  const state = await shareState(userId, id);

  return state ? c.json(state) : c.json({ error: 'Not found' }, 404);
});

api.delete('/documents/:id/share/people', async (c) => {
  const userId = c.get('user').id;
  const id = c.req.param('id');
  const email = normaliseEmail(c.req.query('email'));

  await sql()`
    delete from m2h_document_share
    where document_id = ${id}
      and email = ${email}
      and exists (
        select 1 from m2h_document
        where id = ${id} and user_id = ${userId}
      )
  `;

  const state = await shareState(userId, id);

  return state ? c.json(state) : c.json({ error: 'Not found' }, 404);
});

api.delete('/documents/:id', async (c) => {
  const removed = (await sql()`
    delete from m2h_document
    where user_id = ${c.get('user').id} and id = ${c.req.param('id')}
    returning blob_path
  `) as Array<{ blob_path: string | null }>;

  await deleteSources(removed.map((row) => row.blob_path));

  return c.json({ ok: true });
});

api.delete('/documents', async (c) => {
  const removed = (await sql()`
    delete from m2h_document
    where user_id = ${c.get('user').id}
    returning blob_path
  `) as Array<{ blob_path: string | null }>;

  await deleteSources(removed.map((row) => row.blob_path));

  return c.json({ ok: true });
});

/*
 * The page a share link opens.
 *
 * A link share is the same bytes for everyone, so it is built once and handed to the CDN with a
 * short s-maxage: repeat visitors never reach this function, and the database sees one read per
 * minute per document instead of one per visitor. The window is deliberately short — revoking a
 * share has to take effect in about a minute, not a day.
 *
 * An addressed share depends on who is asking, so it is never cached; a stranger is bounced to
 * the app, which knows how to ask them to sign in.
 */
/*
 * A page of somebody's content, served from our domain.
 *
 * It carries no scripts of its own, so it says so: `script-src 'none'` means an injection that
 * survived the sanitiser still cannot run, and `frame-ancestors 'none'` keeps the document out of
 * someone else's frame, where it could be dressed up as their page.
 */
const SHARED_PAGE_HEADERS: Record<string, string> = {
  'content-security-policy': [
    "default-src 'none'",
    "script-src 'none'",
    "style-src 'unsafe-inline' https://fonts.googleapis.com",
    'font-src https://fonts.gstatic.com',
    'img-src https: data:',
    "connect-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
};

app.get('/s/:token', async (c) => {
  const token = c.req.param('token');

  for (const [header, value] of Object.entries(SHARED_PAGE_HEADERS)) {
    c.header(header, value);
  }

  /*
   * Loaded here, not at the top of the file. The renderer is the one dependency with a history of
   * refusing to load in this runtime, and when it did, it took sign-in and every document call
   * down with it — a page failing to render must never be able to do that again.
   */
  const { markdownToHtml } = await import('./render.js');

  const rows = (await sql()`
    select id, user_id, name, markdown, blob_path, created_at, share_mode
    from m2h_document
    where share_token = ${token}
  `) as Array<{
    id: string;
    user_id: string;
    name: string;
    markdown: string | null;
    blob_path: string | null;
    created_at: string;
    share_mode: 'private' | 'link' | 'people';
  }>;

  const document = rows[0];

  if (!document || document.share_mode === 'private') {
    c.header('cache-control', 'no-store');
    c.status(404);

    return c.html(
      buildNoticePage(
        'This link does not open a document',
        'It was never shared, or the person who shared it has since revoked the link.'
      )
    );
  }

  if (document.share_mode === 'people') {
    const user = await currentUser(c);
    const allowed =
      user &&
      (user.id === document.user_id ||
        ((await sql()`
          select 1 from m2h_document_share
          where document_id = ${document.id}
            and email = ${normaliseEmail(user.email)}
        `) as unknown[]).length > 0);

    if (!allowed) {
      // The app owns the sign-in flow; /open/<token> is the same page, client-side.
      c.header('cache-control', 'no-store');

      return c.redirect(`/open/${encodeURIComponent(token)}`, 302);
    }

    c.header('cache-control', 'private, no-store');
  } else {
    c.header(
      'cache-control',
      'public, max-age=0, s-maxage=60, stale-while-revalidate=600'
    );
  }

  const source = await readSource(document);

  if (source === null) {
    c.header('cache-control', 'no-store');
    c.status(404);

    return c.html(
      buildNoticePage(
        'This document is no longer available',
        'Its contents could not be found. The owner may have removed it.'
      )
    );
  }

  const body = markdownToHtml(source);
  const createdAt = new Date(document.created_at).getTime();

  if (c.req.query('download') !== undefined) {
    const fileName = `${document.name.replace(/\.(md|markdown|mdown|mkd|txt)$/i, '')}.html`;

    c.header('content-disposition', `attachment; filename="${fileName}"`);

    return c.html(
      buildStandaloneHtml({ title: document.name, body, createdAt, theme: 'light' })
    );
  }

  return c.html(
    buildSharedPage({
      title: document.name,
      body,
      createdAt,
      downloadHref: `/s/${encodeURIComponent(token)}?download`,
      reportHref: `/report/${encodeURIComponent(token)}`,
    })
  );
});

/*
 * Somewhere for a report to land.
 *
 * A form, not an API call: the page it is reached from runs no JavaScript, and someone reporting a
 * phishing page should not have to. Nothing is revoked automatically — a report is a claim, and
 * acting on it is `npm run reports`, where a person reads it.
 */
app.get('/report/:token', (c) => {
  for (const [header, value] of Object.entries(SHARED_PAGE_HEADERS)) {
    c.header(header, value);
  }

  return c.html(buildReportPage(c.req.param('token')));
});

app.post('/report/:token', async (c) => {
  const body = await c.req.parseBody();
  const reason = String(body.reason ?? '').slice(0, 2000);
  const reporter = String(body.reporter ?? '').slice(0, 200) || null;

  if (!reason.trim()) {
    return c.html(buildReportPage(c.req.param('token'), 'Say what is wrong with it.'));
  }

  await sql()`
    insert into m2h_report (share_token, reason, reporter)
    values (${c.req.param('token')}, ${reason}, ${reporter})
  `;

  return c.html(
    buildNoticePage(
      'Thank you — the report has been logged',
      'Someone will look at this document. If it breaks the rules, its link stops working.'
    )
  );
});

/*
 * Discovery, for a client that wants to sign a person in before calling the MCP endpoint. Both
 * protected-resource paths are served: one is the URL our 401 hands out, the other is the one a
 * client builds for itself from the resource's path (RFC 9728). Two lines, and no way to be the
 * client that constructs the other one.
 */
app.get('/.well-known/oauth-protected-resource', protectedResource);
app.get('/.well-known/oauth-protected-resource/api/mcp', protectedResource);
app.get('/.well-known/oauth-authorization-server', authorizationServer);

app.route('/', mcp);
app.route('/', oauth);
app.route('/', v1);
app.route('/', api);

export default app;
