import type { Content } from '../../content';

/*
 * What each conversion is called, and what its page says.
 *
 * Which conversions exist is still `shared/conversions.ts`, and has to be: the server imports that
 * file for the API's `kind` parameter, and the server has no locale, so a list it reads cannot
 * carry a language. What is left there is only what is the same in every language — the id, the
 * target, the address, the extensions. Everything a reader actually sees is here, keyed by the same
 * `ConversionId`, so a fifth language is a sixth file and not a sixth copy of the list.
 *
 * `seo` is what the prerendered page says to a crawler and in a search result, which is why it is
 * words and not identity: the address it sits at is fixed, the sentence at that address is not.
 */

export const conversions: Content['conversions'] = {
  'markdown-to-html': {
    label: 'Markdown → HTML',
    short: 'MD → HTML',
    title: 'Markdown to HTML',
    blurb:
      'Upload a Markdown file — see the rendered HTML instantly and download it as a ready-to-use document.',
    hint: 'Upload an .md file and see exactly how it will look in HTML. Drop several and they are chained into one document, in the order you pick them.',
    seo: {
      title: 'TransformPipe — Markdown to HTML converter',
      description:
        'Drop a Markdown file and get the rendered document and a self-contained .html to download. Converts in your browser; sign in to keep, share and publish documents.',
    },
  },
  'html-to-markdown': {
    label: 'HTML → Markdown',
    short: 'HTML → MD',
    title: 'HTML to Markdown',
    blurb:
      'Upload an HTML file — or a page you saved — and get Markdown back, with the headings, links, lists and tables intact.',
    hint: 'Upload an .html file and get Markdown. Tables, task lists and code blocks survive; the styling does not, because Markdown has none.',
    seo: {
      title: 'HTML to Markdown converter — TransformPipe',
      description:
        'Turn an HTML file or a saved page into clean Markdown, tables and code blocks included. Converts in your browser: the file is never sent anywhere.',
    },
  },
  'word-to-markdown': {
    label: 'Word → Markdown',
    short: 'DOCX → MD',
    title: 'Word to Markdown',
    blurb:
      'Upload a .docx and get Markdown: the headings, lists, links and tables come across, the fonts and margins do not.',
    hint: 'Upload a .docx from Word, Google Docs or LibreOffice. What comes back is the document’s structure as Markdown — not its layout.',
    seo: {
      title: 'Word (.docx) to Markdown converter — TransformPipe',
      description:
        'Convert a Word document to Markdown in the browser: headings, lists, links and tables kept, formatting dropped. Nothing is uploaded.',
    },
  },
  'csv-to-markdown': {
    label: 'CSV → Markdown table',
    short: 'CSV → MD',
    title: 'CSV to a Markdown table',
    blurb:
      'Upload a CSV or a TSV and get a Markdown table, with the first row as its header and the columns aligned.',
    hint: 'Upload a .csv or .tsv. Quoted fields, commas inside them and line breaks inside cells are all handled.',
    seo: {
      title: 'CSV to Markdown table converter — TransformPipe',
      description:
        'Turn a CSV or TSV file into a Markdown table, quoted fields and embedded commas handled. Converts in your browser; nothing is uploaded.',
    },
  },
  'json-to-markdown': {
    label: 'JSON → Markdown',
    short: 'JSON → MD',
    title: 'JSON to Markdown',
    blurb:
      'Upload a JSON file and read it as a document: a list of records becomes a table, an object becomes sections with its fields above them.',
    hint: 'Upload a .json file. A list of records becomes a table; nested objects become headings. One value per line — a log export — is understood too.',
    seo: {
      title: 'JSON to Markdown converter — TransformPipe',
      description:
        'Turn a JSON file into readable Markdown: arrays of records become tables, objects become sections. Converts in your browser; nothing is uploaded.',
    },
  },
};
