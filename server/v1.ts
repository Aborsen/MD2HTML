import { randomBytes } from 'node:crypto';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { buildStandaloneHtml, getDocStats } from '../shared/markdown.js';
import { currentUser } from './auth.js';
import { sql } from './db.js';
import { ownerOfKey } from './keys.js';
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

const MAX_MARKDOWN_BYTES = 1024 * 1024;
const MAX_DOCUMENTS_PER_USER = 200;

type Caller = { id: string; email: string | null; via: 'key' | 'session' };
type Env = { Variables: { caller: Caller } };

const v1 = new Hono<Env>().basePath('/api/v1');

/** A bearer key, or the session cookie the app already carries. */
const requireCaller = createMiddleware<Env>(async (c, next) => {
  const header = c.req.header('authorization') ?? '';

  if (header.startsWith('Bearer ')) {
    const owner = await ownerOfKey(header.slice(7).trim());

    if (!owner) {
      return c.json({ error: 'Unknown or revoked API key' }, 401);
    }

    c.set('caller', { id: owner.id, email: owner.email, via: 'key' });

    return next();
  }

  const user = await currentUser(c);

  if (!user) {
    return c.json(
      { error: 'Send an API key as `Authorization: Bearer m2h_live_…`' },
      401
    );
  }

  c.set('caller', { id: user.id, email: user.email, via: 'session' });

  return next();
});

v1.use('*', requireCaller);

interface DocumentRow {
  id: string;
  name: string;
  size: number;
  stats: Record<string, number>;
  created_at: string;
  share_mode: 'private' | 'link' | 'people';
  share_token: string | null;
}

const shareUrl = (c: { req: { url: string } }, token: string | null) => {
  if (!token) {
    return null;
  }

  const url = new URL(c.req.url);

  return `${url.protocol}//${url.host}/s/${token}`;
};

/** One document, as the API describes it. Kept flat and boring on purpose. */
const asDocument = (
  c: { req: { url: string } },
  row: DocumentRow,
  extra: Record<string, unknown> = {}
) => ({
  id: row.id,
  name: row.name,
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
    select id, name, size, stats, created_at, share_mode, share_token
    from m2h_document
    where user_id = ${c.get('caller').id}
    order by created_at desc
    limit ${MAX_DOCUMENTS_PER_USER}
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

  let name = c.req.query('name') ?? '';
  let markdown = '';

  if (type.includes('application/json')) {
    const body = await c.req
      .json<{ name?: string; markdown?: string }>()
      .catch(() => ({}) as { name?: string; markdown?: string });

    name = body.name ?? name;
    markdown = body.markdown ?? '';
  } else {
    markdown = await c.req.text();
  }

  if (!markdown.trim()) {
    return c.json(
      { error: 'Send Markdown as the request body, or as `markdown` in JSON' },
      400
    );
  }

  if (new TextEncoder().encode(markdown).length > MAX_MARKDOWN_BYTES) {
    return c.json({ error: 'Document is too large (1 MB limit)' }, 413);
  }

  const share = c.req.query('share');

  if (share !== undefined && share !== 'link' && share !== 'people') {
    return c.json({ error: 'share must be `link` or `people`' }, 400);
  }

  const documentName = (name || 'document.md').slice(0, 200);
  const html = markdownToHtml(markdown);
  const stats = getDocStats(markdown, html);
  const size = new TextEncoder().encode(markdown).length;

  const created = (await sql()`
    insert into m2h_document (user_id, name, size, markdown, stats, share_mode, share_token)
    values (
      ${userId},
      ${documentName},
      ${size},
      null,
      ${JSON.stringify(stats)}::jsonb,
      ${share ?? 'private'},
      ${share ? randomBytes(16).toString('base64url') : null}
    )
    returning id, name, size, stats, created_at, share_mode, share_token
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

  const trimmed = (await sql()`
    delete from m2h_document
    where user_id = ${userId}
      and id not in (
        select id from m2h_document
        where user_id = ${userId}
        order by created_at desc
        limit ${MAX_DOCUMENTS_PER_USER}
      )
    returning blob_path
  `) as Array<{ blob_path: string | null }>;

  await deleteSources(trimmed.map((row) => row.blob_path));

  return c.json({ document: asDocument(c, created[0], { words: stats.words }) }, 201);
});

async function findDocument(userId: string, id: string) {
  const rows = (await sql()`
    select id, user_id, name, size, stats, created_at, share_mode, share_token,
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

  const markdown = await readSource(row);

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

  if (body.emails) {
    const clean = body.emails
      .map((email) => String(email).trim().toLowerCase())
      .filter((email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email));

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

  return c.json({
    mode: after?.share_mode,
    url: shareUrl(c, after?.share_token ?? null),
    emails: emails.map((entry) => entry.email),
  });
});

export default v1;
