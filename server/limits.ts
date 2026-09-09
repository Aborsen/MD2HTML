import { KEEP_BYTES } from '../shared/limits.js';
import { sql } from './db.js';

/*
 * What an account may hold, and how fast anyone may ask.
 *
 * Both live here rather than in the handlers, because the numbers are a policy and policies should
 * be readable in one place — and because the same limits have to hold whether a document arrives
 * from the app or from a script.
 */

/** Per account. Documents are capped as well as bytes: a thousand tiny files cost real rows. */
export const QUOTA = {
  bytes: 100 * 1024 * 1024,
  documents: 500,
  /**
   * A single document, from `shared/limits.ts`, where the reason it is this number and not the
   * converter's 10 MB is written down: the platform refuses a bigger body before this code runs.
   */
  documentBytes: KEEP_BYTES,
};

/** Per caller per minute. A key that trips this is looping, not working. */
export const RATE = {
  perMinute: 60,
};

export interface Usage {
  bytes: number;
  documents: number;
  limits: typeof QUOTA;
}

export async function usageOf(userId: string): Promise<Usage> {
  const rows = (await sql()`
    select coalesce(sum(size), 0)::bigint as bytes, count(*)::int as documents
    from m2h_document
    where user_id = ${userId}
  `) as Array<{ bytes: string; documents: number }>;

  return {
    bytes: Number(rows[0].bytes),
    documents: rows[0].documents,
    limits: QUOTA,
  };
}

export type QuotaVerdict =
  | { ok: true; usage: Usage }
  | { ok: false; status: 403 | 413; error: string; usage: Usage };

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * Decides whether one more document fits.
 *
 * A refusal, not a silent eviction: this app used to drop the oldest document to stay under its
 * cap, which quietly destroyed something the owner had chosen to keep. Reaching a limit is a
 * conversation with the owner, and the answer says what to do about it.
 */
/*
 * What an account can do before its address has been confirmed.
 *
 * Ten documents, and no publishing to the open web. Not a trial and not a paywall: an address
 * nobody has proved is an address that cannot be recovered, cannot be told anything, and costs
 * nothing to make a hundred of — so the two things it is held back from are the two that matter,
 * accumulating storage and putting a page on the public internet under our domain.
 *
 * Confirming lifts both, immediately, with nothing to do but enter the code.
 */
export const UNVERIFIED = { documents: 10 } as const;

/*
 * Read at the moment of the decision rather than carried on the caller.
 *
 * Three ways of arriving resolve to a caller — a key, an assistant's token, a browser session —
 * and each reads a different table, so a flag threaded through all three would be three places to
 * forget. One query here also means somebody who confirms their address is unblocked on their very
 * next request rather than on their next sign-in, which is the behaviour anybody would expect
 * after typing a code.
 *
 * `emailVerified` is Neon Auth's column, and true without asking for anybody who arrived through
 * Google: the provider asserts the address, so there was never anything for us to confirm.
 */
/**
 * Claims the right to greet this account, once.
 *
 * Two statements and both are deliberate. The insert records that the account exists; the update is
 * the claim, and it is atomic — `where welcomed_at is null ... returning` hands the row to exactly
 * one caller, so two requests in the same instant cannot both decide to send.
 *
 * The stamp goes on before the send rather than after, because the alternative is worse: a window
 * where two requests both see a null and both write. What makes that safe is `releaseWelcome`,
 * which puts it back when the send fails — so a failure is a retry on the next save, and a success
 * is permanent.
 *
 * The first version stamped `welcomed_at` in the insert, which recorded the attempt rather than the
 * send. The accounts whose attempt happened before the mail key reached the deployment were marked
 * greeted and never were; the migration in db/schema.sql clears them.
 *
 * Called where somebody uses their account rather than where they sign in. Neon Auth owns
 * registration and tells this application nothing about it, and a session check fires on every page
 * load; saving a document is both a better moment to say hello and a far colder path.
 */
export async function claimWelcome(userId: string): Promise<boolean> {
  await sql()`
    insert into m2h_user (user_id)
    values (${userId})
    on conflict (user_id) do nothing
  `;

  const rows = (await sql()`
    update m2h_user
    set welcomed_at = now()
    where user_id = ${userId} and welcomed_at is null
    returning user_id
  `) as Array<{ user_id: string }>;

  return rows.length === 1;
}

/** Puts the claim back, so a send that failed is tried again rather than lost. */
export async function releaseWelcome(userId: string): Promise<void> {
  await sql()`
    update m2h_user set welcomed_at = null where user_id = ${userId}
  `;
}

export async function isVerified(userId: string): Promise<boolean> {
  const rows = (await sql()`
    select "emailVerified" as verified
    from neon_auth."user"
    where id = ${userId}
  `) as Array<{ verified: boolean | null }>;

  return rows[0]?.verified === true;
}

export async function checkQuota(
  userId: string,
  incomingBytes: number
): Promise<QuotaVerdict> {
  if (incomingBytes > QUOTA.documentBytes) {
    return {
      ok: false,
      status: 413,
      error: `That document is ${mb(incomingBytes)}; the limit for one document is ${mb(QUOTA.documentBytes)}.`,
      usage: await usageOf(userId),
    };
  }

  const usage = await usageOf(userId);

  /*
   * The tighter cap first, so the message names the reason a person can act on: being told to
   * delete documents when the actual fix is to type a code from an email is the wrong advice.
   */
  if (
    usage.documents >= UNVERIFIED.documents &&
    !(await isVerified(userId))
  ) {
    return {
      ok: false,
      status: 403,
      error: `An unconfirmed account can keep ${UNVERIFIED.documents} documents. Confirm your email address from the account menu and this limit goes away.`,
      usage,
    };
  }

  if (usage.documents >= QUOTA.documents) {
    return {
      ok: false,
      status: 403,
      error: `You have ${usage.documents} documents, which is the limit. Delete some to make room.`,
      usage,
    };
  }

  if (usage.bytes + incomingBytes > QUOTA.bytes) {
    return {
      ok: false,
      status: 403,
      error: `That would take you past ${mb(QUOTA.bytes)} of storage (you are using ${mb(usage.bytes)}). Delete some documents to make room.`,
      usage,
    };
  }

  return { ok: true, usage };
}

export interface RateVerdict {
  ok: boolean;
  calls: number;
  retryAfter: number;
}

/**
 * Counts this call and says whether it was one too many.
 *
 * A row per caller per minute in Postgres, rather than a cache to run beside it: the write is one
 * upsert on a two-column key, the numbers double as usage reporting, and there is no second system
 * to be down. It is not a precise limiter under heavy concurrency — two calls can read the same
 * count — and at this size that is the right trade.
 */
export async function countCall(caller: string): Promise<RateVerdict> {
  const rows = (await sql()`
    insert into m2h_call (caller, minute, calls)
    values (${caller}, date_trunc('minute', now()), 1)
    on conflict (caller, minute) do update set calls = m2h_call.calls + 1
    returning calls
  `) as Array<{ calls: number }>;

  const calls = rows[0]?.calls ?? 1;

  // Sweep occasionally rather than on a schedule: the table only holds recent minutes anyway.
  if (calls === 1 && Math.random() < 0.02) {
    await sql()`
      delete from m2h_call where minute < now() - interval '1 day'
    `.catch(() => undefined);
  }

  return {
    ok: calls <= RATE.perMinute,
    calls,
    retryAfter: 60 - new Date().getSeconds(),
  };
}
