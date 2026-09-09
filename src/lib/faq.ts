import { faq } from './i18n/messages/en/faq';

/*
 * The questions people arrive with, and which of them each page asks.
 *
 * The list lives here rather than in a page because two pages need it — the converter, where
 * someone is deciding whether to drop a file at all, and the documentation, where they are looking
 * for the same answer in a different mood. Two copies would drift, and the copy that drifts is
 * always the one being read.
 *
 * The words are not here any more. A question and its answer are language, so they sit in the
 * catalogue — `i18n/messages/en/faq.ts` for English, the same array in the same order for every
 * other locale. What is left in this file is the part that is the same in every language: how many
 * questions there are, what order they are asked in, and where each one belongs.
 */

/** What is true of a question in every language: not its words, but its place in the product. */
export interface FaqFlags {
  /**
   * True when this is a detail rather than a doubt.
   *
   * The front page asks somebody to drop a file, and the questions worth answering there are the
   * ones that stop them doing it. A question they would only ask after deciding belongs in the
   * documentation, where the whole list is shown.
   */
  detail?: boolean;
}

/** One question, ready to render: the flags from this file, the words from the catalogue. */
export interface FaqEntry extends FaqFlags {
  question: string;
  answer: string;
}

/*
 * One entry per question, in the order they are asked. Position is what ties a flag to its words:
 * a question has no id of its own, so the list is the id, and `FAQ_FLAGS[n]` belongs to `faq[n]`.
 * A bare `{}` is a doubt — a question the front page has to answer before anyone drops a file.
 */
export const FAQ_FLAGS: FaqFlags[] = [
  {},
  {},
  { detail: true },
  {},
  {},
  {},
  {},
  {},
];

/*
 * English, and deliberately so. The same list is read by the server — the MCP tool that answers
 * "how does transformpipe work" hands these to an assistant — and the connector answers in
 * English, so it imports the English slice directly rather than asking for a locale it does not
 * have. Plain strings, not nodes, for the same reason: there is no React in the server.
 *
 * A page with a reader to speak to zips `FAQ_FLAGS` with the `faq` of the locale it was handed.
 */
export const FAQ_ENTRIES: FaqEntry[] = faq.map((words, index) => ({
  ...words,
  ...FAQ_FLAGS[index],
}));

/** The front page's shorter list: the doubts, without the details. */
export const HOME_FAQ_ENTRIES = FAQ_ENTRIES.filter((one) => !one.detail);
