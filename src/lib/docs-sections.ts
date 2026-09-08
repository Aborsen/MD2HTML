/*
 * The shape of the documentation page, in one list.
 *
 * The page itself builds its contents list from this, and the prerenderer builds the static page a
 * crawler receives from it — otherwise /docs ships as a title and a sentence, and the ten sections
 * that make it worth reading exist only after the bundle has run.
 */

export interface DocsSection {
  id: string;
  title: string;
  /** One sentence: what this section answers. Read on its own in the prerendered page. */
  summary: string;
}

export const DOCS_SECTIONS: DocsSection[] = [
  {
    id: 'start',
    title: 'Start here',
    summary:
      'Drop a file and you have the converted document and a download; sign in and the same documents follow you between devices, can be shared, and can be reached by a script.',
  },
  {
    id: 'converting',
    title: 'Converting',
    summary:
      'The four conversions — Markdown to HTML, HTML, Word and CSV to Markdown — what each accepts, chaining several files into one document, the source tab, and the formats a download can hand over: Markdown, HTML, plain text or a printed PDF.',
  },
  {
    id: 'history',
    title: 'History',
    summary:
      'Search, sortable columns, and a chip per conversion so a mixed list can be narrowed to one kind. Rows can be merged, downloaded in any format, or deleted in bulk.',
  },
  {
    id: 'sharing',
    title: 'Sharing',
    summary:
      'A link anyone can open, or named addresses that ask the reader to sign in. Revoking drops the token, so a link already sent stops working.',
  },
  {
    id: 'account',
    title: 'Account',
    summary:
      'Google sign-in, the theme, and API keys — shown once, stored as a hash, and unable to reach the account or the keys themselves.',
  },
  {
    id: 'api',
    title: 'API',
    summary:
      'Every endpoint under /api/v1, what each returns, and what the error statuses mean.',
  },
  {
    id: 'cli',
    title: 'Command line',
    summary:
      'A dependency-free client: login, push, list, rm and usage, with --share, --merge and --json.',
  },
  {
    id: 'action',
    title: 'GitHub Action',
    summary:
      'Publishes the Markdown a pull request changed and comments the links on it. Every input, and the two permissions it needs.',
  },
  {
    id: 'assistant',
    title: 'In an assistant',
    summary:
      'Add transformpipe to Claude as a connector and it can convert, save, share and delete documents in this account — signed in as you, with no key to paste.',
  },
  {
    id: 'limits',
    title: 'Limits',
    summary:
      '100 MB and 500 documents an account, 1 MB a document, 60 requests a minute. Reaching one refuses the write rather than deleting anything.',
  },
  {
    id: 'faq',
    title: 'Questions',
    summary:
      'The same answers the converter shows under its dropzone, kept in one place so the two cannot drift apart.',
  },
];
