import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Vercel writes pulled values to .env.local; dotenv reads .env unless told otherwise.
config({ path: ['.env.local', '.env'], quiet: true });

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(path.join(here, '..', 'db', 'schema.sql'), 'utf8');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (put it in .env.local)');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

/* The Neon HTTP driver runs one statement per call, so the file is split on semicolons — with the
 * line comments stripped first, because a prose semicolon inside one ("...; see above.") otherwise
 * becomes a statement of its own and fails. */
const statements = schema
  .replace(/^\s*--.*$/gm, '')
  .split(';')
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
  console.log(`ok  ${statement.split('\n')[0].slice(0, 70)}`);
}

console.log('\nSchema is up to date.');
