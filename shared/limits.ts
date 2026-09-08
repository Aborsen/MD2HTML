/*
 * How big one document may be — two numbers, because two different things impose them.
 *
 * They used to be one number in two places, which is how a 2 MB file came to convert perfectly,
 * appear on screen, and then fail to save: the dropzone said 10 MB and the account said 1 MB. The
 * fix is not a single number — it is naming each ceiling and saying which is which, so the app can
 * tell somebody what will happen before they wait for it.
 */

/**
 * What the converter accepts.
 *
 * Converting happens in the browser, so this is a judgement about the machine in front of the
 * person rather than a platform limit. 10 MB of Markdown is around 1.5 million words.
 */
export const DOCUMENT_BYTES = 10 * 1024 * 1024;

/**
 * What can be kept in an account, and it is not our choice.
 *
 * A Vercel Function refuses a request or a response body over 4.5 MB with a bare 413 that our code
 * never sees — so a document larger than this could neither be saved nor read back, and the person
 * would get the platform's error page instead of a sentence from us. 4 MB leaves room for the name
 * and the JSON around the Markdown.
 *
 * Raising it means keeping the Markdown out of the request entirely: the browser uploading to blob
 * storage directly and reads redirecting to a signed URL. That is a real change to how documents
 * move, not a bigger number, so until it is made this is the honest ceiling.
 */
export const KEEP_BYTES = 4 * 1024 * 1024;
