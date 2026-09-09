import { docs } from './i18n/messages/en/docs.js';

/*
 * The shape of the documentation page, in one list.
 *
 * The page itself builds its contents list from this, and the prerenderer builds the static page a
 * crawler receives from it — otherwise /docs ships as a title and a sentence, and the ten sections
 * that make it worth reading exist only after the bundle has run.
 *
 * The wording is not here any more: a title and a summary are language, so they live in the
 * catalogue under the section's id — `i18n/messages/en/docs.ts` for English, the same keys for
 * every other locale. What stays is the part no translation may touch: which sections exist, in
 * what order, and under which id. The id is the anchor in the address a reader can link to and the
 * key the icons on the page are chosen by, so it is the same word in every language.
 */

export interface DocsSection {
  id: string;
  title: string;
  /** One sentence: what this section answers. Read on its own in the prerendered page. */
  summary: string;
}

/** The order of the page, and the id of each section. Every id needs an entry in `docs`. */
export const DOCS_SECTION_IDS = [
  'start',
  'converting',
  'history',
  'sharing',
  'account',
  'api',
  'cli',
  'action',
  'assistant',
  'embed',
  'limits',
  'faq',
] as const;

/*
 * English, by importing the English slice rather than asking for a locale. Two of the readers of
 * this list can only want English: the prerenderer, which writes the static `/docs` a crawler and
 * a search result see, and the server, whose connector answers in English. A page with a reader to
 * speak to walks `DOCS_SECTION_IDS` against the `docs` of the locale it was handed instead.
 */
export const DOCS_SECTIONS: DocsSection[] = DOCS_SECTION_IDS.map((id) => ({
  id,
  ...docs[id],
}));
