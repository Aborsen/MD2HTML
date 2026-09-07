/* Moves document sources out of Postgres and into the Blob store.
 *
 *   node scripts/sources-to-blob.mjs           show what would move
 *   node scripts/sources-to-blob.mjs --write   move it
 *
 * Idempotent: a row that already has a `blob_path` is skipped. The text column is only cleared
 * after the upload for that row has succeeded, so an interrupted run leaves every document
 * readable — some from Blob, the rest still from the row, which is exactly what the reader
 * handles anyway.
 */
import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';
import { config } from 'dotenv';

config({ path: ['.env.local', '.env'], quiet: true });

const write = process.argv.includes('--write');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (put it in .env.local)');
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    'BLOB_READ_WRITE_TOKEN is not set — connect the Blob store to the project, then `vercel env pull .env.local`'
  );
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const pending = await sql`
  select id, user_id, name, length(markdown) as chars
  from m2h_document
  where markdown is not null and blob_path is null
  order by created_at
`;

if (pending.length === 0) {
  console.log('Nothing to move — every source is already in the store.');
  process.exit(0);
}

const total = pending.reduce((sum, row) => sum + Number(row.chars), 0);

console.log(
  `${pending.length} document${pending.length === 1 ? '' : 's'}, ${Math.round(total / 1024)} kB of Markdown`
);

if (!write) {
  for (const row of pending) console.log('  would move', row.name);
  console.log('\nRun again with --write to move them.');
  process.exit(0);
}

let moved = 0;

for (const row of pending) {
  const [{ markdown }] = await sql`
    select markdown from m2h_document where id = ${row.id}
  `;
  const path = `sources/${row.user_id}/${row.id}.md`;

  await put(path, markdown, {
    access: 'private',
    contentType: 'text/markdown; charset=utf-8',
    addRandomSuffix: false,
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  await sql`
    update m2h_document
    set blob_path = ${path}, markdown = null
    where id = ${row.id}
  `;

  moved += 1;
  console.log('  moved', row.name);
}

const after = await sql`
  select
    count(*) filter (where blob_path is not null)::int as in_blob,
    count(*) filter (where markdown is not null)::int as in_row
  from m2h_document
`;

console.log(
  `\nMoved ${moved}. Now ${after[0].in_blob} in the store, ${after[0].in_row} still in their rows.`
);
