import { createHash, randomBytes } from 'node:crypto';
import { sql } from './db.js';

/*
 * API keys.
 *
 * The key is a credential, so what is stored is a hash of it: a leaked table gives an attacker
 * nothing to present. The prefix is kept in the clear because a list of keys has to be readable —
 * "which of these three is on the build server" is a question the owner must be able to answer.
 *
 * The `m2h_live_` prefix is not decoration either: a key pasted into the wrong box fails loudly,
 * and a key committed to a repository is greppable by anyone sweeping for secrets, us included.
 */
const PREFIX = 'm2h_live_';

export interface ApiKeyRow {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

export interface KeyOwner {
  id: string;
  email: string | null;
  name: string;
}

const hash = (token: string) =>
  createHash('sha256').update(token).digest('hex');

export async function listKeys(userId: string): Promise<ApiKeyRow[]> {
  return (await sql()`
    select id, name, prefix, created_at, last_used_at, revoked_at
    from m2h_api_key
    where user_id = ${userId}
    order by created_at desc
  `) as ApiKeyRow[];
}

/** Returns the key itself exactly once; after this call only its hash exists. */
export async function createKey(
  userId: string,
  name: string
): Promise<{ key: string; row: ApiKeyRow }> {
  const token = PREFIX + randomBytes(24).toString('base64url');
  const prefix = token.slice(0, PREFIX.length + 6);

  const rows = (await sql()`
    insert into m2h_api_key (user_id, name, prefix, token_hash)
    values (${userId}, ${name.slice(0, 80)}, ${prefix}, ${hash(token)})
    returning id, name, prefix, created_at, last_used_at, revoked_at
  `) as ApiKeyRow[];

  return { key: token, row: rows[0] };
}

export async function revokeKey(userId: string, id: string): Promise<boolean> {
  const rows = (await sql()`
    update m2h_api_key
    set revoked_at = now()
    where user_id = ${userId} and id = ${id} and revoked_at is null
    returning id
  `) as Array<{ id: string }>;

  return rows.length > 0;
}

/**
 * Who a bearer token belongs to, or null.
 *
 * The lookup is by hash, so a token that is not ours cannot even be compared against the table.
 * `last_used_at` is refreshed at most hourly: it exists to answer "is this key still in use",
 * which does not need a write on every request.
 */
export async function ownerOfKey(token: string): Promise<KeyOwner | null> {
  if (!token.startsWith(PREFIX)) {
    return null;
  }

  const rows = (await sql()`
    select k.id, k.user_id, u.email, coalesce(u.name, u.email, 'Someone') as name
    from m2h_api_key k
    left join neon_auth."user" u on u.id = k.user_id
    where k.token_hash = ${hash(token)} and k.revoked_at is null
  `) as Array<{
    id: string;
    user_id: string;
    email: string | null;
    name: string;
  }>;

  if (rows.length === 0) {
    return null;
  }

  await sql()`
    update m2h_api_key
    set last_used_at = now()
    where id = ${rows[0].id}
      and (last_used_at is null or last_used_at < now() - interval '1 hour')
  `;

  return { id: rows[0].user_id, email: rows[0].email, name: rows[0].name };
}
