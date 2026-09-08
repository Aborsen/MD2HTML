/*
 * How big one document may be.
 *
 * One number, read by both ends, because they used to be two: the dropzone accepted 10 MB while the
 * account refused anything over 1 MB, so a 2 MB file converted perfectly, appeared on screen, and
 * then failed to save — the worst place to learn about a limit, since the work is already done.
 *
 * The browser needs it to refuse a file before reading it, and the server needs it to refuse a
 * request whoever sent it. Neither is the authority; this is.
 */
export const DOCUMENT_BYTES = 10 * 1024 * 1024;
