import { randomBytes } from 'node:crypto';
import { Hono, type Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { buildStandaloneHtml, getDocStats } from '../shared/markdown.js';
import { selfOrigin } from './auth.js';
import { type Caller, resolveCaller } from './caller.js';
import { sql } from './db.js';
import { checkQuota, countCall, QUOTA, RATE, usageOf } from './limits.js';
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
          : 'Send an API key as `Authorization: Bearer m2h_live_…`',
      },
      401
    );
  }

  c.set('caller', caller);

  return next();
});

v1.use('*', requireCaller);

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

  const share = c.req.query('share');

  if (share !== undefined && share !== 'link' && share !== 'people') {
    return c.json({ error: 'share must be `link` or `people`' }, 400);
  }

  const size = new TextEncoder().encode(markdown).length;
  const room = await checkQuota(userId, size);

  if (!room.ok) {
    return c.json({ error: room.error, usage: room.usage }, room.status);
  }

  const documentName = (name || 'document.md').slice(0, 200);
  const html = markdownToHtml(markdown);
  const stats = getDocStats(markdown, html);

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
