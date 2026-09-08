/*
 * The questions people arrive with, answered once.
 *
 * They live here rather than in a page because two pages need them — the converter, where someone
 * is deciding whether to drop a file at all, and the documentation, where they are looking for the
 * same answer in a different mood. Two copies would drift, and the copy that drifts is always the
 * one being read.
 */
export interface FaqEntry {
  question: string;
  answer: string;
  /**
   * True when this is a detail rather than a doubt.
   *
   * The front page asks somebody to drop a file, and the questions worth answering there are the
   * ones that stop them doing it. A question they would only ask after deciding belongs in the
   * documentation, where the whole list is shown.
   */
  detail?: boolean;
}

/*
 * Plain strings, not nodes: the same list is read by the server — the MCP tool that answers "how
 * does transformpipe work" hands these to an assistant — and the server has no React in it.
 */
export const FAQ_ENTRIES: FaqEntry[] = [
  {
    question: 'What can it convert?',
    answer:
      'Four things, each with its own page under Converter in the header: Markdown to HTML, HTML to Markdown, Word (.docx) to Markdown, and CSV or TSV to a Markdown table. Everything but the first ends as Markdown, which is what a document is stored, previewed and shared as here — so a Word file and a spreadsheet become the same kind of thing once they are in.',
  },
  {
    question: 'Does my file get uploaded anywhere?',
    answer:
      'Signed out, no. The file is read by this browser, converted here, and never sent to a server — close the tab and nothing of it remains anywhere but your own machine. Signed in, the Markdown source is stored in your account so the document can follow you to another device, and it stays private until you share it.',
  },
  {
    question: 'Which Markdown does it understand?',
    detail: true,
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
      'A file dropped on the converter can be up to 10 MB. A document kept in an account can hold 1 MB of Markdown — around 150,000 words — and an account holds 500 documents or 100 MB, whichever comes first. Reaching a limit refuses the write and says so; nothing you saved is ever quietly deleted to make room.',
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

/** The front page's shorter list: the doubts, without the details. */
export const HOME_FAQ_ENTRIES = FAQ_ENTRIES.filter((one) => !one.detail);
