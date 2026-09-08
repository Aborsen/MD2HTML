import { createHash, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
const env = readFileSync('./.env.local','utf8');
const url = env.split(/\r?\n/).find(l=>l.startsWith('DATABASE_URL=')).slice('DATABASE_URL='.length).replace(/^["']|["']$/g,'');
const sql = neon(url);
const hash = t => createHash('sha256').update(t).digest('hex');
const users = await sql`select id, email from neon_auth."user" limit 3`;
const uid = users[0].id;
const clientId = 'm2hc_pathinj' + randomBytes(4).toString('hex');
await sql`insert into m2h_oauth_client (id, name, redirect_uris)
          values (${clientId}, 'pathinj-probe', '["http://127.0.0.1:9999/cb"]'::jsonb)`;
const rw = 'PATHINJ_' + randomBytes(24).toString('base64url');
await sql`insert into m2h_oauth_token (token_hash, kind, client_id, user_id, scope, resource, expires_at)
          values (${hash(rw)}, 'access', ${clientId}, ${uid}, 'documents:read documents:write',
                  'http://127.0.0.1:5180/api/mcp', now() + interval '1 hour')`;
const docs = await sql`insert into m2h_document (user_id, name, size, markdown, stats, share_mode, share_token)
  values (${uid},'pathinj-probe.md', 9, '# probe X', '{"words":2}'::jsonb, 'private', null)
  returning id, name`;
console.log(JSON.stringify({ uid, users: users.map(u=>u.id), clientId, rw, docs }, null, 1));
