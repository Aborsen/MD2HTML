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
