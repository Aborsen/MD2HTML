import type { Content } from '../../content';

/*
 * The documentation's sections in English: a title and the one sentence that says what the section
 * answers, keyed by the section's id.
 *
 * The ids and the order live in `src/lib/docs-sections.ts`, because an id is the anchor in the
 * address — `/docs#converting` — and an address is the same in every language. Every id in that
 * list needs a key here, and in every other locale.
 *
 * The summary is read on its own in the prerendered page, so it has to stand up without the
 * section under it.
 */
export const docs: Content['docs'] = {
  start: {
    title: 'Start here',
    summary:
      'Drop a file and you have the converted document and a download; sign in and the same documents follow you between devices, can be shared, and can be reached by a script.',
  },
  converting: {
    title: 'Converting',
    summary:
      'The five conversions — Markdown to HTML, and HTML, Word, CSV and JSON to Markdown — what each accepts, chaining several files into one document, the source tab, and the formats a download can hand over: Markdown, HTML, plain text or a printed PDF.',
  },
  history: {
    title: 'History',
    summary:
      'Search, sortable columns, and a chip per conversion so a mixed list can be narrowed to one kind. Rows can be merged, downloaded in any format, or deleted in bulk.',
  },
  sharing: {
    title: 'Sharing',
    summary:
      'A link anyone can open, or named addresses that ask the reader to sign in. Revoking drops the token, so a link already sent stops working.',
  },
  account: {
    title: 'Account',
    summary:
      'Google sign-in, the theme, and API keys — shown once, stored as a hash, and unable to reach the account or the keys themselves.',
  },
  api: {
    title: 'API',
    summary:
      'Every endpoint under /api/v1, what each returns, and what the error statuses mean.',
  },
  cli: {
    title: 'Command line',
    summary:
      'A dependency-free client: login, push, list, rm and usage, with --share, --merge and --json.',
  },
  action: {
    title: 'GitHub Action',
    summary:
      'Publishes the Markdown a pull request changed and comments the links on it. Every input, and the two permissions it needs.',
  },
  assistant: {
    title: 'MCP',
    summary:
      'Add transformpipe to Claude as a connector and it can convert, save, share and delete documents in this account — signed in as you, with no key to paste.',
  },
  embed: {
    title: 'Embedded solution',
    summary:
      'Frame the converter into your own interface with /embed. The file is converted in your visitor’s browser and reaches no server, yours or ours; the result comes out by postMessage.',
  },
  limits: {
    title: 'Limits',
    summary:
      '10 MB a file to convert and 4 MB to keep one in an account, 100 MB and 500 documents an account, 60 requests a minute. Reaching one refuses the write rather than deleting anything.',
  },
  faq: {
    title: 'Questions',
    summary:
      'The same answers the converter shows under its dropzone, kept in one place so the two cannot drift apart.',
  },
};
