/* Reads what people have reported, and acts on it.
 *
 *   node scripts/reports.mjs                 open reports, newest first
 *   node scripts/reports.mjs --revoke <id>   stop the link working, mark the report handled
 *   node scripts/reports.mjs --dismiss <id>  mark it handled, leave the document alone
 *
 * Nothing here is automatic. A report is a claim by a stranger about someone else's document, and
 * the two mistakes — leaving a phishing page up, and killing an innocent person's link — are both
 * bad enough to be worth a human reading the thing first.
 */
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: ['.env.local', '.env'], quiet: true });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (put it in .env.local)');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const [flag, id] = process.argv.slice(2);

if (flag === '--revoke' || flag === '--dismiss') {
  if (!id) {
    console.error(`Usage: node scripts/reports.mjs ${flag} <report id>`);
    process.exit(1);
  }

  const rows = await sql`
    select share_token from m2h_report where id = ${id}
  `;

  if (rows.length === 0) {
    console.error('No report with that id.');
    process.exit(1);
  }

  if (flag === '--revoke') {
    const killed = await sql`
      update m2h_document
      set share_mode = 'private', share_token = null
      where share_token = ${rows[0].share_token}
      returning name
    `;

    console.log(
      killed.length
        ? `Link revoked — "${killed[0].name}" is private again.`
        : 'That link was already gone.'
    );
  }

  await sql`update m2h_report set handled_at = now() where id = ${id}`;
  console.log('Report marked handled.');
  process.exit(0);
}

const open = await sql`
  select r.id, r.share_token, r.reason, r.reporter, r.created_at,
         d.name, d.share_mode, coalesce(u.email, '') as owner
  from m2h_report r
  left join m2h_document d on d.share_token = r.share_token
  left join neon_auth."user" u on u.id = d.user_id
  where r.handled_at is null
  order by r.created_at desc
`;

if (open.length === 0) {
  console.log('No open reports.');
  process.exit(0);
}

for (const report of open) {
  console.log(`\n${report.created_at}  ${report.id}`);
  console.log(`  document : ${report.name ?? '(already gone)'} — ${report.share_mode ?? 'no longer shared'}`);
  console.log(`  owner    : ${report.owner || 'unknown'}`);
  console.log(`  reporter : ${report.reporter ?? 'anonymous'}`);
  console.log(`  reason   : ${String(report.reason).replace(/\s+/g, ' ').slice(0, 300)}`);
}

console.log(
  `\n${open.length} open. Act with --revoke <id> or --dismiss <id>.`
);
