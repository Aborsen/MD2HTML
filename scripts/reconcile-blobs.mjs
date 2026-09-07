/* Finds where the store and the database disagree.
 *
 *   node scripts/reconcile-blobs.mjs           report
 *   node scripts/reconcile-blobs.mjs --write   delete the orphaned files
 *
 * Two things can drift, and they are not equally bad:
 *
 *   orphaned file    a blob with no row — a create that failed after the upload, or a delete that
 *                    removed the row and then could not reach the store. Costs storage, nothing
 *                    else. Safe to remove.
 *   missing source   a row whose blob is gone. That is a document that cannot be opened, and it is
 *                    reported but never "fixed" here: only its owner can decide what to do.
 */
import { neon } from '@neondatabase/serverless';
import { del, list } from '@vercel/blob';
import { config } from 'dotenv';

config({ path: ['.env.local', '.env'], quiet: true });

const write = process.argv.includes('--write');

/* Either a read-write token or the OIDC identity a connected store hands out. */
const blobAuth = process.env.BLOB_READ_WRITE_TOKEN
  ? { token: process.env.BLOB_READ_WRITE_TOKEN }
  : {};

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (put it in .env.local)');
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
  console.error(
    'No Blob store configured — connect it to the project, then `vercel env pull .env.local`'
  );
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`
  select id, name, blob_path from m2h_document where blob_path is not null
`;
const known = new Set(rows.map((row) => row.blob_path));

const stored = new Set();
let cursor;

do {
  const page = await list({ ...blobAuth, cursor, limit: 1000, prefix: 'sources/' });

  for (const blob of page.blobs) stored.add(blob.pathname);
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

const orphans = [...stored].filter((path) => !known.has(path));
const missing = rows.filter((row) => !stored.has(row.blob_path));

console.log(`rows with a source: ${rows.length}`);
console.log(`files in the store:  ${stored.size}`);
console.log(`orphaned files:      ${orphans.length}`);
console.log(`missing sources:     ${missing.length}`);

for (const row of missing) {
  console.log(`  ! ${row.name} (${row.id}) has no file at ${row.blob_path}`);
}

if (orphans.length > 0) {
  for (const path of orphans) console.log(`  - ${path}`);

  if (write) {
    await del(orphans, blobAuth);
    console.log(`\nDeleted ${orphans.length} orphaned file(s).`);
  } else {
    console.log('\nRun again with --write to delete them.');
  }
}
