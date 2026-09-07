import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(path.join(here, '..', 'db', 'schema.sql'), 'utf8');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (put it in .env.local)');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// The Neon HTTP driver runs one statement per call.
const statements = schema
  .split(';')
  .map((statement) => statement.trim())
  .filter((statement) => statement && !statement.startsWith('--'));

for (const statement of statements) {
  await sql.query(statement);
  console.log(`ok  ${statement.split('\n')[0].slice(0, 70)}`);
}

console.log('\nSchema is up to date.');
