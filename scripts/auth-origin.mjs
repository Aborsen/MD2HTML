/* Adds a trusted origin to Neon Auth.
 *
 * Neon Auth is Better Auth behind a Neon endpoint, and it will only issue a sign-in redirect for a
 * callback URL whose origin it trusts. An origin that is not on the list answers
 * INVALID_CALLBACKURL, and sign-in simply cannot start.
 *
 * The setting lives in neon_auth.project_config in this project's own database, which is also where
 * the Neon Console writes it. Doing it here is not a shortcut around the console — it is the same
 * row — but it is repeatable and reviewable.
 *
 *   node scripts/auth-origin.mjs                        show what is trusted
 *   node scripts/auth-origin.mjs https://example.com    trust that origin too
 *   node scripts/auth-origin.mjs --remove https://…     stop trusting it
 *
 * Additive and idempotent: adding an origin twice changes nothing.
 *
 * The column is `neon_auth.project_config.trusted_origins`. It holds plain origin strings; older
 * projects wrote objects — [{ "domain": "https://example.com" }] — so both are accepted on read.
 */
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Vercel writes pulled values to .env.local; dotenv reads .env unless told otherwise.
config({ path: ['.env.local', '.env'], quiet: true });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (put it in .env.local)');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const domainOf = (entry) => {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object' && typeof entry.domain === 'string') {
    return entry.domain;
  }
  return null;
};

/* Exactly an origin, or not trusted at all: Better Auth compares the Origin header by string, so
 * "https://example.com/" matches nothing — that trailing slash is the whole difference between
 * sign-in working and INVALID_ORIGIN, and it is invisible in a console text field. */
function looksExact(value) {
  try {
    return new URL(value).origin === value;
  } catch {
    return false;
  }
}

const [first, second] = process.argv.slice(2);
const removing = first === '--remove';
const target = removing ? second : first;

const rows = await sql`
  select id, trusted_origins
  from neon_auth.project_config
  limit 1
`;

if (rows.length === 0) {
  console.error('No neon_auth.project_config row — is Neon Auth enabled for this project?');
  process.exit(1);
}

const current = (rows[0].trusted_origins ?? []).map(domainOf).filter(Boolean);

if (!target) {
  console.log('Trusted origins:');
  for (const origin of current) console.log('  ' + origin);
  process.exit(0);
}

if (!looksExact(target)) {
  console.error(`"${target}" is not an exact origin (scheme + host + optional port, no path or trailing slash)`);
  process.exit(1);
}

const next = removing
  ? current.filter((origin) => origin !== target)
  : current.includes(target)
    ? current
    : [...current, target];

if (next.length === current.length && !removing) {
  console.log(`${target} is already trusted.`);
  process.exit(0);
}

await sql`
  update neon_auth.project_config
  set trusted_origins = ${JSON.stringify(next)}::jsonb,
      updated_at = now()
  where id = ${rows[0].id}
`;

console.log(`${removing ? 'Removed' : 'Added'} ${target}. Now trusted:`);
for (const origin of next) console.log('  ' + origin);
