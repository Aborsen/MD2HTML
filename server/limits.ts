import { DOCUMENT_BYTES } from '../shared/limits.js';
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
   * A single document — the same number the dropzone enforces, from `shared/limits.ts`. 10 MB of
   * Markdown is around 1.5 million words, which is more than anybody converts by accident.
   */
  documentBytes: DOCUMENT_BYTES,
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
