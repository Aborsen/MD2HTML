/*
 * The pages that are only words: about, contact, and the legal three — the half of them that is
 * not words.
 *
 * What each page *is* lives here: its id, its address, and, for the legal three, the date a reader
 * is entitled to see. What each page *says* lives in `src/lib/i18n/messages/en/pages.ts` and its
 * translations, keyed by the `StaticPageId` this file declares. An id and a path are the same in
 * five languages; a paragraph is not.
 *
 * Still one list, for the same reason the conversions are one list — the footer links to them, the
 * router resolves them, and the prerenderer builds the static page a crawler and a search result
 * get. All three ask this file which pages exist and where they live, and the catalogue for the
 * words. A second copy of either would be the copy that goes stale, and stale text on a privacy
 * page is worse than no page at all.
 */

export type StaticPageId =
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies';

export interface StaticPage {
  id: StaticPageId;
  path: string;
  /**
   * When it was last changed, for the pages where a reader is entitled to know. ISO, `2026-09-08`.
   *
   * A machine date, not a written one. It used to be the English "8 September 2026", which was the
   * one sentence on these pages that no translation could reach and which the sitemap then had to
   * parse back into a date to state `lastmod`. Stored as the day itself, it goes into the sitemap
   * as it stands and is written out by `Intl` — see `formatDate` — in whatever language is reading.
   */
  updated?: string;
}

/** The repository, named once: the header links to it, the footer links to it, and so do the pages. */
export const REPO_URL = 'https://github.com/Aborsen/MD2HTML';

/** Where a question goes. There is no support inbox yet; the repository is the honest answer. */
export const ISSUES_URL = `${REPO_URL}/issues`;

const UPDATED = '2026-09-08';

export const STATIC_PAGES: StaticPage[] = [
  { id: 'about', path: '/about' },
  { id: 'contact', path: '/contact' },
  { id: 'privacy', path: '/privacy', updated: UPDATED },
  { id: 'terms', path: '/terms', updated: UPDATED },
  { id: 'cookies', path: '/cookies', updated: UPDATED },
];

const BY_ID = new Map(STATIC_PAGES.map((one) => [one.id, one]));

export function staticPage(id: StaticPageId): StaticPage {
  return BY_ID.get(id)!;
}

export function staticPageForPath(path: string): StaticPage | null {
  const clean = path.replace(/\/$/, '') || '/';

  return STATIC_PAGES.find((one) => one.path === clean) ?? null;
}
