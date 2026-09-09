/*
 * The conversions this app offers: one list of what they are, and no word of any language.
 *
 * There is still only one list, and everything that needs to know which conversions exist reads
 * it: the menu in the header, the screen each conversion gets, the chips in the history, the badge
 * on a row, the API's `from` parameter, and the prerenderer that gives each one a real page a
 * stranger can arrive on. A second list would mean a menu offering a conversion the dropzone will
 * not accept, which is the kind of thing nobody notices until a person tries it.
 *
 * What each one is *called* is no longer here. It could not stay: the server imports this file for
 * the API's `kind` parameter, and the server has no locale — a list it reads cannot carry a
 * language without picking one for every reader at once. So the split is by what a thing is, not
 * by who reads it. An id, a target, an address and a file extension are the same in German as in
 * English and stay; the label, the heading, the blurb, the dropzone hint and the search-result text
 * moved to `src/lib/i18n/messages/<locale>/conversions.ts`, keyed by the same `ConversionId`, where
 * they are written once per language.
 *
 * Every conversion normalises to Markdown or to HTML from Markdown, because Markdown is what a
 * document is stored as — the rendering, the sharing, the API and the assistant tools all stand on
 * that one shape, and a second stored form would be a second version of all of it.
 */

export type ConversionId =
  | 'markdown-to-html'
  | 'html-to-markdown'
  | 'word-to-markdown'
  | 'csv-to-markdown'
  | 'json-to-markdown';

export interface Conversion {
  id: ConversionId;
  /**
   * What the person came here to get.
   *
   * Every conversion stores Markdown, but that is not the same as what they asked for: somebody
   * converting a Word file wants the Markdown, and somebody converting Markdown wants the page. It
   * decides which source tab is shown and which format the download button hands over first.
   */
  to: 'html' | 'markdown';
  /** Its own address, so it can be linked, reloaded and found. */
  path: string;
  /** What the dropzone accepts, lower case, with the dot. */
  extensions: string[];
}

export const CONVERSIONS: Conversion[] = [
  {
    id: 'markdown-to-html',
    to: 'html',
    path: '/',
    extensions: ['.md', '.markdown', '.mdown', '.mkd', '.txt'],
  },
  {
    id: 'html-to-markdown',
    to: 'markdown',
    path: '/html-to-markdown',
    extensions: ['.html', '.htm', '.xhtml'],
  },
  {
    id: 'word-to-markdown',
    to: 'markdown',
    path: '/word-to-markdown',
    extensions: ['.docx'],
  },
  {
    id: 'csv-to-markdown',
    to: 'markdown',
    path: '/csv-to-markdown',
    extensions: ['.csv', '.tsv'],
  },
  {
    id: 'json-to-markdown',
    to: 'markdown',
    path: '/json-to-markdown',
    extensions: ['.json'],
  },
];

export const DEFAULT_CONVERSION: ConversionId = 'markdown-to-html';

const BY_ID = new Map(CONVERSIONS.map((one) => [one.id, one]));

export function conversion(id: ConversionId | string): Conversion {
  return BY_ID.get(id as ConversionId) ?? BY_ID.get(DEFAULT_CONVERSION)!;
}

export function conversionForPath(path: string): Conversion | null {
  const clean = path.replace(/\/$/, '') || '/';

  return CONVERSIONS.find((one) => one.path === clean) ?? null;
}

/** Every extension any conversion takes, for a dropzone that has not been told which it is. */
export const ALL_EXTENSIONS = [
  ...new Set(CONVERSIONS.flatMap((one) => one.extensions)),
];

/** Which conversion a dropped file belongs to, by its extension. */
export function conversionForFile(name: string): Conversion | null {
  const dot = name.toLowerCase().lastIndexOf('.');
  const extension = dot === -1 ? '' : name.toLowerCase().slice(dot);

  return (
    CONVERSIONS.find((one) => one.extensions.includes(extension)) ?? null
  );
}
