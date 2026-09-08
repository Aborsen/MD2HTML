/*
 * The conversions this app offers, in one list.
 *
 * Everything reads it: the menu in the header, the screen each conversion gets, the chips in the
 * history, the badge on a row, the API's `from` parameter, and the prerenderer that gives each one
 * a real page a stranger can arrive on. A second list would mean a menu offering a conversion the
 * dropzone will not accept, which is the kind of thing nobody notices until a person tries it.
 *
 * Every conversion normalises to Markdown or to HTML from Markdown, because Markdown is what a
 * document is stored as — the rendering, the sharing, the API and the assistant tools all stand on
 * that one shape, and a second stored form would be a second version of all of it.
 */

export type ConversionId =
  | 'markdown-to-html'
  | 'html-to-markdown'
  | 'word-to-markdown'
  | 'csv-to-markdown';

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
  /** In the header menu. */
  label: string;
  /** On a row in the history, where there is no room for the long form. */
  short: string;
  /** The heading of its screen. */
  title: string;
  blurb: string;
  /** What the dropzone accepts, lower case, with the dot. */
  extensions: string[];
  /** The line under the dropzone's title. */
  hint: string;
  /** What the prerendered page says to a crawler and in a search result. */
  seo: { title: string; description: string };
}

export const CONVERSIONS: Conversion[] = [
  {
    id: 'markdown-to-html',
    to: 'html',
    path: '/',
    label: 'Markdown → HTML',
    short: 'MD → HTML',
    title: 'Markdown to HTML',
    blurb:
      'Upload a Markdown file — see the rendered HTML instantly and download it as a ready-to-use document.',
    extensions: ['.md', '.markdown', '.mdown', '.mkd', '.txt'],
    hint: 'Upload an .md file and see exactly how it will look in HTML. Drop several and they are chained into one document, in the order you pick them.',
    seo: {
      title: 'transformpipe — Markdown to HTML converter',
      description:
        'Drop a Markdown file and get the rendered document and a self-contained .html to download. Converts in your browser; sign in to keep, share and publish documents.',
    },
  },
  {
    id: 'html-to-markdown',
    to: 'markdown',
    path: '/html-to-markdown',
    label: 'HTML → Markdown',
    short: 'HTML → MD',
    title: 'HTML to Markdown',
    blurb:
      'Upload an HTML file — or a page you saved — and get Markdown back, with the headings, links, lists and tables intact.',
    extensions: ['.html', '.htm', '.xhtml'],
    hint: 'Upload an .html file and get Markdown. Tables, task lists and code blocks survive; the styling does not, because Markdown has none.',
    seo: {
      title: 'HTML to Markdown converter — transformpipe',
      description:
        'Turn an HTML file or a saved page into clean Markdown, tables and code blocks included. Converts in your browser: the file is never sent anywhere.',
    },
  },
  {
    id: 'word-to-markdown',
    to: 'markdown',
    path: '/word-to-markdown',
    label: 'Word → Markdown',
    short: 'DOCX → MD',
    title: 'Word to Markdown',
    blurb:
      'Upload a .docx and get Markdown: the headings, lists, links and tables come across, the fonts and margins do not.',
    extensions: ['.docx'],
    hint: 'Upload a .docx from Word, Google Docs or LibreOffice. What comes back is the document’s structure as Markdown — not its layout.',
    seo: {
      title: 'Word (.docx) to Markdown converter — transformpipe',
      description:
        'Convert a Word document to Markdown in the browser: headings, lists, links and tables kept, formatting dropped. Nothing is uploaded.',
    },
  },
  {
    id: 'csv-to-markdown',
    to: 'markdown',
    path: '/csv-to-markdown',
    label: 'CSV → Markdown table',
    short: 'CSV → MD',
    title: 'CSV to a Markdown table',
    blurb:
      'Upload a CSV or a TSV and get a Markdown table, with the first row as its header and the columns aligned.',
    extensions: ['.csv', '.tsv'],
    hint: 'Upload a .csv or .tsv. Quoted fields, commas inside them and line breaks inside cells are all handled.',
    seo: {
      title: 'CSV to Markdown table converter — transformpipe',
      description:
        'Turn a CSV or TSV file into a Markdown table, quoted fields and embedded commas handled. Converts in your browser; nothing is uploaded.',
    },
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
