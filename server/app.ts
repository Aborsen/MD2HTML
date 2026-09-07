import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { sql, type DocumentRow } from './db';
import { clearSession, issueSession, readSession } from './session';

/** Server-side cap: a stored document is meant to be re-openable, not archival. */
const MAX_MARKDOWN_BYTES = 1024 * 1024;
const MAX_DOCUMENTS_PER_USER = 200;

type Env = { Variables: { userId: string } };

const app = new Hono<Env>().basePath('/api');

app.get('/health', (c) => c.json({ ok: true }));

/**
 * Google Identity Services hands the browser an ID token; we verify it against
 * our client id and exchange it for our own httpOnly session cookie.
 */
app.post('/auth/google', async (c) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return c.json({ error: 'GOOGLE_CLIENT_ID is not configured' }, 500);
  }

  const body = await c.req
    .json<{ credential?: string }>()
    .catch(() => ({}) as { credential?: string });

  if (!body.credential) {
    return c.json({ error: 'credential is required' }, 400);
  }

  let payload: TokenPayload | undefined;

  try {
    const ticket = await new OAuth2Client(clientId).verifyIdToken({
      idToken: body.credential,
      audience: clientId,
    });

    payload = ticket.getPayload();
  } catch {
    return c.json({ error: 'Invalid Google credential' }, 401);
  }

  if (!payload?.sub || !payload.email) {
    return c.json({ error: 'Google account has no usable profile' }, 401);
  }

  const rows = (await sql()`
    insert into users (google_sub, email, name, picture)
    values (${payload.sub}, ${payload.email}, ${payload.name ?? null}, ${payload.picture ?? null})
    on conflict (google_sub) do update
      set email = excluded.email,
          name = excluded.name,
          picture = excluded.picture,
          last_seen_at = now()
    returning id, email, name, picture
  `) as Array<{
    id: string;
    email: string;
    name: string | null;
    picture: string | null;
  }>;

  const user = rows[0];

  await issueSession(c, {
    userId: user.id,
    email: user.email,
    name: user.name ?? undefined,
    picture: user.picture ?? undefined,
  });

  return c.json({
    user: {
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  });
});

app.get('/auth/me', async (c) => {
  const session = await readSession(c);

  if (!session) {
    return c.json({ user: null });
  }

  return c.json({
    user: {
      email: session.email,
      name: session.name ?? null,
      picture: session.picture ?? null,
    },
  });
});

app.post('/auth/logout', (c) => {
  clearSession(c);

  return c.json({ ok: true });
});

/** Everything below needs a session. */
const requireUser = createMiddleware<Env>(async (c, next) => {
  const session = await readSession(c);

  if (!session) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  c.set('userId', session.userId);

  return next();
});

app.use('/documents', requireUser);
app.use('/documents/*', requireUser);

app.get('/documents', async (c) => {
  const userId = c.get('userId');

  const rows = (await sql()`
    select id, name, size, stats, created_at
    from documents
    where user_id = ${userId}
    order by created_at desc
    limit ${MAX_DOCUMENTS_PER_USER}
  `) as DocumentRow[];

  return c.json({ documents: rows });
});

app.post('/documents', async (c) => {
  const userId = c.get('userId');
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
    insert into documents (user_id, name, size, markdown, stats)
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
    delete from documents
    where user_id = ${userId}
      and id not in (
        select id from documents
        where user_id = ${userId}
        order by created_at desc
        limit ${MAX_DOCUMENTS_PER_USER}
      )
  `;

  return c.json({ document: rows[0] }, 201);
});

app.get('/documents/:id', async (c) => {
  const userId = c.get('userId');

  const rows = (await sql()`
    select id, name, size, stats, created_at, markdown
    from documents
    where user_id = ${userId} and id = ${c.req.param('id')}
  `) as DocumentRow[];

  if (rows.length === 0) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json({ document: rows[0] });
});

app.delete('/documents/:id', async (c) => {
  const userId = c.get('userId');

  await sql()`
    delete from documents
    where user_id = ${userId} and id = ${c.req.param('id')}
  `;

  return c.json({ ok: true });
});

app.delete('/documents', async (c) => {
  const userId = c.get('userId');

  await sql()`delete from documents where user_id = ${userId}`;

  return c.json({ ok: true });
});

export default app;
