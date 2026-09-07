import { randomBytes } from 'node:crypto';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { authProxy, currentUser, type SessionUser } from './auth.js';
import { sql, type DocumentRow } from './db.js';

/** Server-side caps: a stored document is meant to be re-openable, not archival. */
const MAX_MARKDOWN_BYTES = 1024 * 1024;
const MAX_DOCUMENTS_PER_USER = 200;

type Env = { Variables: { user: SessionUser } };

const app = new Hono<Env>().basePath('/api');

app.get('/health', (c) => c.json({ ok: true }));

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
app.get('/shared/:token', async (c) => {
  const rows = (await sql()`
    select id, user_id, name, markdown, created_at, share_mode, share_token
    from m2h_document
    where share_token = ${c.req.param('token')}
  `) as Array<ShareRow & { user_id: string }>;

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
      markdown: document.markdown,
      created_at: document.created_at,
    },
  });
});

// Sign-in, sign-out and the session read all live at the auth service; this app only forwards
// them so its cookie is first-party. See server/auth.ts.
app.all('/auth/*', authProxy);

/** Everything below needs a session. */
const requireUser = createMiddleware<Env>(async (c, next) => {
  const user = await currentUser(c);

  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  c.set('user', user);

  return next();
});

app.use('/documents', requireUser);
app.use('/documents/*', requireUser);
app.use('/shared-with-me', requireUser);

/**
 * Documents other people shared with this address.
 *
 * Only 'people' shares appear: a link share is addressed to whoever holds the link, not to anyone
 * in particular, so it has no business showing up in someone's list. The content is not returned
 * here — the row carries the token and reads it through /shared/:token, which is the one place
 * access is decided.
 */
app.get('/shared-with-me', async (c) => {
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
    limit ${MAX_DOCUMENTS_PER_USER}
  `) as Array<DocumentRow & { share_token: string; owner_email: string }>;

  return c.json({ documents: rows });
});

app.get('/documents', async (c) => {
  const rows = (await sql()`
    select id, name, size, stats, created_at
    from m2h_document
    where user_id = ${c.get('user').id}
    order by created_at desc
    limit ${MAX_DOCUMENTS_PER_USER}
  `) as DocumentRow[];

  return c.json({ documents: rows });
});

app.post('/documents', async (c) => {
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

  if (new TextEncoder().encode(body.markdown).length > MAX_MARKDOWN_BYTES) {
    return c.json({ error: 'Document is too large to store (1 MB limit)' }, 413);
  }

  const rows = (await sql()`
    insert into m2h_document (user_id, name, size, markdown, stats)
    values (
      ${userId},
      ${body.name},
      ${body.size ?? body.markdown.length},
      ${body.markdown},
      ${JSON.stringify(body.stats ?? {})}::jsonb
    )
    returning id, name, size, stats, created_at
  `) as DocumentRow[];

  // Keep the list bounded: drop anything past the newest N.
  await sql()`
    delete from m2h_document
    where user_id = ${userId}
      and id not in (
        select id from m2h_document
        where user_id = ${userId}
        order by created_at desc
        limit ${MAX_DOCUMENTS_PER_USER}
      )
  `;

  return c.json({ document: rows[0] }, 201);
});

app.get('/documents/:id', async (c) => {
  const rows = (await sql()`
    select id, name, size, stats, created_at, markdown
    from m2h_document
    where user_id = ${c.get('user').id} and id = ${c.req.param('id')}
  `) as DocumentRow[];

  if (rows.length === 0) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json({ document: rows[0] });
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

app.get('/documents/:id/share', async (c) => {
  const state = await shareState(c.get('user').id, c.req.param('id'));

  return state ? c.json(state) : c.json({ error: 'Not found' }, 404);
});

app.put('/documents/:id/share', async (c) => {
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

app.post('/documents/:id/share/people', async (c) => {
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

app.delete('/documents/:id/share/people', async (c) => {
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

app.delete('/documents/:id', async (c) => {
  await sql()`
    delete from m2h_document
    where user_id = ${c.get('user').id} and id = ${c.req.param('id')}
  `;

  return c.json({ ok: true });
});

app.delete('/documents', async (c) => {
  await sql()`delete from m2h_document where user_id = ${c.get('user').id}`;

  return c.json({ ok: true });
});

export default app;
