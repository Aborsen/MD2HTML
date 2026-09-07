import { del, get, put } from '@vercel/blob';

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
 * Without a token — a checkout that has not pulled one — the source falls back to the column it
 * used to live in, so local work and older rows keep working unchanged.
 */
const token = () => process.env.BLOB_READ_WRITE_TOKEN;

export const blobEnabled = () => Boolean(token());

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
  const rw = token();

  if (!rw) {
    return { blobPath: null, markdown };
  }

  const path = pathFor(userId, documentId);

  await put(path, markdown, {
    access: 'private',
    contentType: 'text/markdown; charset=utf-8',
    addRandomSuffix: false,
    allowOverwrite: true,
    token: rw,
  });

  return { blobPath: path, markdown: null };
}

/** Reads a source back, from wherever the row says it is. */
export async function readSource(row: {
  blob_path?: string | null;
  markdown?: string | null;
}): Promise<string | null> {
  if (row.markdown != null) {
    return row.markdown;
  }

  const rw = token();

  if (!row.blob_path || !rw) {
    return null;
  }

  const found = await get(row.blob_path, { access: 'private', token: rw });

  if (!found || found.statusCode !== 200) {
    return null;
  }

  return await new Response(found.stream).text();
}

/**
 * Removes sources for documents that are going away.
 *
 * Best effort by design: the row is already gone, and a file left behind is a cleanup job, not a
 * broken document. Failing the delete because a file could not be removed would be the wrong way
 * round.
 */
export async function deleteSources(paths: (string | null)[]): Promise<void> {
  const rw = token();
  const present = paths.filter((path): path is string => Boolean(path));

  if (!rw || present.length === 0) {
    return;
  }

  await del(present, { token: rw }).catch(() => undefined);
}
