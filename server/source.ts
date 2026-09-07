import { del, get, put } from '@vercel/blob';
import { sql } from './db.js';

/*
 * Where a document's Markdown lives.
 *
 * Postgres keeps what the app queries — name, size, stats, share token, recipients — and those
 * rows stay small no matter how many documents there are. The source itself is a file: it is
 * never filtered on, never sorted by, only fetched whole, and it is the only thing that grows.
 * So it goes to Blob, and the 512 MB ceiling on the database stops being the product's ceiling.
 *
 * The store is private. A source is read here, with the store's token, and its URL never reaches
 * a browser — a shared document is served by our own route, which is where access is decided.
 *
 * Connecting the store to the project hands the function an OIDC identity and a `BLOB_STORE_ID`
 * rather than a long-lived key, so that is the normal path; a read-write token is still honoured
 * where one exists (a script run outside Vercel, say).
 *
 * With neither, the source falls back to the column it used to live in, so a checkout without a
 * store and every row written before it keep working unchanged.
 */
const token = () => process.env.BLOB_READ_WRITE_TOKEN;

/** Only pass a token when we hold one; otherwise the SDK uses the ambient OIDC identity. */
const auth = () => (token() ? { token: token() as string } : {});

export const blobEnabled = () =>
  Boolean(token() || process.env.BLOB_STORE_ID);

/** One path per document, so a source is findable from its row alone. */
const pathFor = (userId: string, documentId: string) =>
  `sources/${userId}/${documentId}.md`;

export interface StoredSource {
  /** Set when the source went to Blob; null means it is still in the row. */
  blobPath: string | null;
  markdown: string | null;
}

/**
 * Writes the source and returns what to put in the row.
 *
 * The blob is written before the row exists, so a failure here leaves nothing behind but an
 * orphaned file — which `scripts/reconcile-blobs.mjs` sweeps up. The other order would leave a
 * document that cannot be opened, which is worse.
 */
export async function putSource(
  userId: string,
  documentId: string,
  markdown: string
): Promise<StoredSource> {
  if (!blobEnabled()) {
    return { blobPath: null, markdown };
  }

  const path = pathFor(userId, documentId);

  await put(path, markdown, {
    access: 'private',
    contentType: 'text/markdown; charset=utf-8',
    addRandomSuffix: false,
    allowOverwrite: true,
    ...auth(),
  });

  return { blobPath: path, markdown: null };
}

/**
 * Reads a source back, from wherever the row says it is — and moves it if it is still in the row.
 *
 * Documents written before the store existed keep their text in the column, and so do any written
 * from a checkout without store access. Rather than a migration someone has to remember to run,
 * each one moves the first time it is read somewhere the store is reachable. Best effort: if the
 * upload fails the text is still returned, and the row simply gets another chance next time.
 *
 * The move is awaited rather than left running. A serverless instance is frozen the moment its
 * response is sent, and the first attempt at this uploaded the file but never got to write the
 * row — a document counted twice, in the store and in the column. Once per document, so the cost
 * lands on one reader and nobody after.
 */
export async function readSource(row: {
  id?: string;
  user_id?: string;
  blob_path?: string | null;
  markdown?: string | null;
}): Promise<string | null> {
  if (row.markdown != null) {
    if (blobEnabled() && row.id && row.user_id) {
      await moveIntoStore(row.user_id, row.id, row.markdown);
    }

    return row.markdown;
  }

  if (!row.blob_path || !blobEnabled()) {
    return null;
  }

  const found = await get(row.blob_path, { access: 'private', ...auth() });

  if (!found || found.statusCode !== 200) {
    return null;
  }

  return await new Response(found.stream).text();
}

async function moveIntoStore(userId: string, documentId: string, markdown: string) {
  try {
    const stored = await putSource(userId, documentId, markdown);

    if (stored.blobPath) {
      await sql()`
        update m2h_document
        set blob_path = ${stored.blobPath}, markdown = null
        where id = ${documentId} and blob_path is null
      `;
    }
  } catch {
    // The reader already has the text; the row keeps it and tries again another day.
  }
}

/**
 * Removes sources for documents that are going away.
 *
 * Best effort by design: the row is already gone, and a file left behind is a cleanup job, not a
 * broken document. Failing the delete because a file could not be removed would be the wrong way
 * round.
 */
export async function deleteSources(paths: (string | null)[]): Promise<void> {
  const present = paths.filter((path): path is string => Boolean(path));

  if (!blobEnabled() || present.length === 0) {
    return;
  }

  await del(present, auth()).catch(() => undefined);
}
