import type { Content } from '../../content';

/*
 * The FAQ in English: one question and its answer per entry.
 *
 * The order is the order `FAQ_ENTRIES` in `src/lib/faq.ts` declares, and position is what ties an
 * entry here to its flag there — a question has no id, so the list is the id. An entry added or
 * moved here has to be added or moved there, and in every other locale, at the same position.
 *
 * Plain strings, not nodes: the same array is read by the server, which has no React in it.
 */
export const faq: Content['faq'] = [
  {
    question: 'What can it convert?',
    answer:
      'Five things, each with its own page under Converter in the header: Markdown to HTML, and HTML, Word (.docx), CSV or TSV, and JSON to Markdown. Everything but the first ends as Markdown, which is what a document is stored, previewed and shared as here — so a Word file, a spreadsheet and an API response become the same kind of thing once they are in.',
  },
  {
    question: 'Does my file get uploaded anywhere?',
    answer:
      'Signed out, no. The file is read by this browser, converted here, and never sent to a server — close the tab and nothing of it remains anywhere but your own machine. Signed in, the Markdown source is stored in your account so the document can follow you to another device, and it stays private until you share it.',
  },
  {
    question: 'Which Markdown does it understand?',
    answer:
      'GitHub Flavored Markdown, in both directions: tables, task lists, strikethrough, autolinks and fenced code blocks, on top of everything CommonMark defines. Raw HTML inside the document is passed through a sanitiser first, so a script tag in a file someone sent you cannot run.',
  },
  {
    question: 'What exactly do I get when I download?',
    answer:
      'Whatever the conversion produced, first: an .html file when you converted to HTML, an .md file when you converted to Markdown. The arrow beside the button holds the others — Markdown, HTML, plain text, or the print dialog for a PDF. The HTML is one file with its styles inline: no scripts, no fonts to fetch, no requests of any kind, so it opens the same on a machine with no network. On paper it always flips to the light palette, because a dark page in print is a wall of ink.',
  },
  {
    question: 'Can I send a converted document to someone?',
    answer:
      'Sign in and share it, either as a link anyone can open or addressed to particular people, who then sign in with that address. A shared page is read-only: the document and a download, nothing else. Revoking drops the link, so one you have already sent stops working.',
  },
  {
    question: 'Is there a size limit?',
    answer:
      '10 MB a file to convert — around 1.5 million words — because converting happens on your own machine. Keeping one in an account is capped at 4 MB, which is not our number: the platform refuses a larger request outright. A bigger file still converts, previews and downloads; it just stays out of the history, and the app says so instead of pretending it saved. An account holds 500 documents or 100 MB, whichever comes first. Reaching a limit refuses the write and says so; nothing you saved is ever quietly deleted to make room.',
  },
  {
    question: 'Can I convert files from a script?',
    answer:
      'Yes. Create an API key from the account menu and post Markdown to /api/v1/documents; there is also a command-line client and a GitHub Action that publishes the Markdown a pull request changed and comments the links on it. The documentation has the endpoints and the flags.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Nothing. Converting and downloading work without an account at all; an account adds history, sharing and the API, within the limits above.',
  },
];
