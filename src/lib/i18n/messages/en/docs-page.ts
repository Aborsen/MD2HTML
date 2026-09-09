/*
 * The manual's own prose — every word the /docs page says in its own right.
 *
 * Its own file rather than a corner of `ui.ts` because it is by far the largest single screen in
 * the product: some 1,700 words in seventy-five entries, more than the rest of the interface put
 * together, which in `ui.ts` would bury every other screen. It is spread into `ui` in `index.ts`
 * all the same, so `useT()` reaches these keys like any other interface string and the key set
 * stays one flat table for `scripts/check-i18n.mjs` to compare.
 *
 * Keys follow the convention in `index.ts` — `docs.<section>.<thing>`, where `<section>` is the id
 * of the section the sentence sits in, so a key says where on the page it appears and rewording it
 * never means renaming the key.
 *
 * A sentence that wraps a piece of code, a bold label or an emphasised word is ONE entry with a
 * `{placeholder}` where the element goes, never three fragments. Fragments cannot be reordered: a
 * German sentence puts the header name, the verb and the path in a different order than English
 * does, and three separate strings would force it into English word order. The elements themselves
 * — the paths, flags, headers, extensions and endpoints — stay in the page's JSX, because none of
 * them is a word anybody translates.
 *
 * What is NOT here: the eleven section titles, which are `docs` in this same directory — the
 * page's headings and its contents list read the one entry there, so a heading and the line that
 * links to it cannot say two different things. Nor the questions at the foot of the page (`faq`),
 * nor the MCP tool descriptions in `src/lib/mcp-facts.ts` — the connector answers in English and
 * its tool names and descriptions are part of a protocol, not prose.
 */

export const docsPage = {
  /* The head of the page. */
  'docs.eyebrow': 'Documentation',
  /* The contents column beside the manual. Not 'In this article' — this is not one. */
  'docs.toc': 'On this page',

  'docs.title': 'Everything transformpipe does',
  'docs.lede':
    'Markdown, HTML, Word, CSV or JSON in — a document out as HTML, Markdown, plain text or print. From this page, from a terminal, from a pull request or from an assistant. This is the whole of it; nothing here sits behind a plan.',

  /* Under every screenshot, after the caption. */
  'docs.shot.enlarge': '— click to enlarge',

  /* The chip that appears in two sections, History and Sharing, and must read the same in both. */
  'docs.chip.shared': 'Shared with me',

  'docs.start.signedOut':
    'Drop a file on the converter and you have the converted document and a download. Signed out, nothing is stored and nothing is sent anywhere — the conversion runs in this browser, on your own machine.',
  'docs.start.signedIn':
    'Sign in with Google and the same documents follow you between devices, can be shared by link or by address, and can be reached by a script with an API key. Whatever you converted before signing in moves into the account on the way.',

  /** `{menu}` is the header's own Converter entry, in bold. */
  'docs.converting.intro':
    '{menu} in the header lists what this app converts. Each one has its own page, its own dropzone and its own address, so a conversion can be linked and bookmarked rather than set up again:',
  'docs.converting.menu': 'Converter',
  /** `{docx}` is the extension itself. */
  'docs.converting.sizes':
    'Up to 10 MB a file. Drop several Markdown files at once and they are chained into a single document, in the order they arrive, separated by a rule. Drop a file the page does not take — a {docx} on the Markdown page, say — and it goes to the conversion that does take it rather than being refused; a mixture of kinds is refused, because chaining a spreadsheet onto a Word document is not something anybody meant.',
  'docs.converting.oneShape':
    'Everything ends as Markdown, and that is deliberate: it is what a document is stored, previewed, shared and reached by a script as, so the whole of the app stands on one shape rather than four.',
  'docs.converting.shot.converter.alt':
    'The transformpipe converter with an empty dropzone',
  'docs.converting.shot.converter.caption':
    'The converter. The logo doubles as “start over”.',
  'docs.converting.flavour':
    'What comes out is GitHub Flavored Markdown: tables, task lists, strikethrough, autolinks, fenced code. The preview is the document itself, styled with the same tokens as the app, so a dark app hands over a dark page — and printing always flips to light, because a dark page on paper is a wall of ink.',
  'docs.converting.shot.preview.alt':
    'A converted document shown in the preview tab',
  'docs.converting.shot.preview.caption':
    'Preview, with the counts the document actually has.',
  /** `{to}` is the word below, emphasised in the middle of the sentence. */
  'docs.converting.source':
    'The source tab is not a summary of the output. It is the exact thing the download hands over — the standalone HTML when you converted {to} HTML, the Markdown when you converted to Markdown: one document, styles inline, no scripts, no network.',
  'docs.converting.source.emphasis': 'to',
  /** `{html}` and `{md}` are the two extensions. */
  'docs.converting.download':
    "The download button carries the format the conversion produced — {html} on the Markdown page, {md} on the others — and the arrow beside it holds the rest: Markdown, HTML, plain text, and printing. Print builds the exported file in a frame of its own and opens the browser's dialog, so a PDF is the document and not a screenshot of the app around it; the export flips to a light palette on paper whatever the app is set to.",
  'docs.converting.shot.source.alt':
    'The HTML source tab showing the standalone document',
  'docs.converting.shot.source.caption':
    'The HTML source tab: what you get, before you get it.',
  'docs.converting.reading':
    'For reading rather than checking, the preview goes fullscreen and keeps a readable measure; Escape comes back. A long document grows a back-to-top button, in both views.',

  'docs.history.intro':
    'Every conversion lands in the history — in your account when signed in, in this browser when not. Search runs over file names, the columns sort, and a row opens the document.',
  'docs.history.shot.history.alt':
    'The history list with search, chips and sortable columns',
  'docs.history.shot.history.caption':
    'HTML or Markdown, search, sortable columns.',
  /**
   * `{all}` and `{shared}` are the two chips that are always there, `{badge}` a row's own format
   * badge — the format codes stay in the page.
   */
  'docs.history.chips':
    "The chips filter by where a document came from: {all} to begin with, then one chip per conversion that actually has rows, and {shared} for files somebody sent you. A row's badge says the same thing — {badge} on a Word file — so a list of thirty documents still tells you which is which.",
  'docs.history.chip.all': 'All formats',
  'docs.history.downloading':
    'Downloading is a menu rather than a chip: only the Markdown is ever stored, and the HTML and the plain text are built on the spot, so one row can hand over any of the three without keeping three copies.',
  'docs.history.selection':
    'Tick rows and the selection bar appears: merge them into one document, download them, or delete them. Merging keeps the order of the list.',
  'docs.history.shot.selection.alt':
    'Two rows selected, with the bulk action bar',
  'docs.history.shot.selection.caption': 'Bulk merge, download and delete.',

  /** `{anyone}` and `{only}` are the two modes, in bold; `{path}` is the address a share gets. */
  'docs.sharing.modes':
    '{anyone} publishes the document at {path} — a read-only page with the document and a download, nothing else. {only} asks the reader to sign in with an address you listed.',
  'docs.sharing.mode.link': 'Anyone with the link',
  'docs.sharing.mode.people': 'Only these addresses',
  'docs.sharing.revoking':
    'Revoking drops the token, so a link you already sent stops working; sharing again mints a different one. No email is ever sent — you pass the link on yourself.',
  /** `{shared}` is the chip named in `docs.chip.shared`. */
  'docs.sharing.incoming':
    "Documents other people addressed to you appear under the {shared} chip, with who shared each one. They are read-only: open and download, no delete, no re-share. A link share belongs to whoever holds the link, so it appears on no one's list.",
  /** `{csp}` is the Content-Security-Policy directive itself. */
  'docs.sharing.safety':
    "A shared page carries someone's content on our domain, so it is served with {csp} and cannot be framed, and every one of them links to a report form that needs no JavaScript. Nothing is revoked automatically: a report is a stranger's claim about someone else's document, and both mistakes — leaving a bad page up, killing an innocent link — deserve a person reading it first.",

  'docs.account.signIn':
    'Sign-in is Google, through Neon Auth. The account menu holds the theme (dark by default, remembered per browser), the API keys, and the way out.',
  'docs.account.keys':
    'A key is shown once and stored only as a hash. It reaches documents and shares — never the account or the keys themselves, so a leaked key cannot mint its replacement or lock you out. Revoking one takes effect on the next request.',

  /** `{auth}` is the Authorization header, shown as it is sent. */
  'docs.api.intro':
    'Everything the app does, a script can do. Send the key as {auth}; a browser session works too, so the same endpoints can be tried while signed in.',
  /*
   * The endpoint table. The terms are the endpoints, which stay in the page; these are the
   * explanations beside them. The placeholders are query parameters and JSON shapes.
   */
  'docs.api.post':
    'Markdown as the body ({name}) or JSON {json}. {share} publishes it in the same call. {kindHtml}, {kindCsv} or {kindJson} converts the body first, so a page, a spreadsheet or an API response can be posted as it is; {word} is refused here, because reading a {docx} happens in the browser.',
  'docs.api.list': 'The newest 500, with sizes, stats and share state.',
  'docs.api.one': 'Metadata and the Markdown source.',
  'docs.api.html': 'The standalone document. {theme} optional.',
  'docs.api.delete': 'Removes the row and its stored source.',
  'docs.api.share': '{modes}. {private} drops the token.',
  'docs.api.usage': 'What the account is using, against the limits.',
  /** `{shape}` is the error body itself. */
  'docs.api.errors':
    'Errors are {shape} with a status that means what it says: 401 unknown key, 404 not yours, 413 the document is over 4 MB, 403 the account is out of room, 429 too fast, 410 the source is gone.',

  /** `{cli}` is the path to the client in the repository. */
  'docs.cli.intro':
    '{cli} in the repository is the same API with a friendlier face, and no dependencies — a tool that runs in CI should not drag a package tree behind it.',
  /** The placeholders are the four extensions it converts, the one it refuses, and the flag. */
  'docs.cli.extensions':
    'A pushed {html}, {csv}, {tsv} or {json} is converted by the endpoint rather than stored as if it were already Markdown; a {docx} is refused, with the page that can read it. {merge} chains Markdown only.',
  /** The placeholders are the flag, the variable, the config path, the host variable and the flag. */
  'docs.cli.key':
    "The key comes from {key}, then {env}, then {config}. {host} points it at another deployment, and {json} prints the API's own answer.",

  'docs.action.intro':
    'Given no file list, the action publishes the Markdown a pull request changed and comments the links on it — so a reviewer opens the rendered document instead of reading a diff of asterisks.',
  /** `{example}` is the workflow file; `{depth}` and `{permission}` are the two YAML settings. */
  'docs.action.workflow':
    '{example} is a complete workflow to copy. Checkout needs {depth} for the base commit the file list is compared against, and the comment needs {permission}.',
  /* The input table. The terms are the input names, which stay in the page. */
  'docs.action.input.apiKey': 'Required. Keep it in a repository secret.',
  'docs.action.input.files':
    'Space-separated paths. Defaults to what the pull request changed.',
  /** The placeholders are the three values the input takes. */
  'docs.action.input.share':
    '{link} (default), {people}, or {none} to publish privately.',
  'docs.action.input.merge':
    'Chain the files into one document instead of one each.',
  'docs.action.input.comment': 'Comment the links on the pull request.',
  'docs.action.input.host': 'Another deployment of transformpipe.',
  'docs.action.pushes':
    'A push publishes new documents rather than overwriting the old ones, so a link in an older comment keeps showing what that commit said.',

  /** `{path}` is the connector's address, which comes from `mcp-facts.ts`. */
  'docs.assistant.intro':
    'transformpipe is an MCP server, so it can be added to Claude as a connector. The address is this deployment plus {path}:',
  'docs.assistant.adding':
    'On claude.ai that goes in Settings → Connectors → Add custom connector. From a terminal:',
  'docs.assistant.auth':
    'There is no key to paste. The first call comes back unauthorised, your assistant follows that to a page here, and you sign in with the same account you already use and approve a named client — which is why the page tells you which address it is about to act as. What it gets is a token of ours, good for your documents and nothing else: not your account, not your sign-in, and not your API keys. Disconnect it from the account menu, under MCP connector, and it stops working on the next call.',
  'docs.assistant.tools':
    'The tools are the same code as the API above, called in process, so a conversation and a script get the same answer. Two of them are shaped for the trouble they can cause: sharing publishes a page on the public web, and deleting takes an explicit confirmation and removes exactly one document.',

  /* The limits table: each term and the figure beside it. */
  'docs.embed.intro':
    'One iframe. No script to load, nothing to install, and no account: the embed is deliberately anonymous, because a page on another domain that could reach somebody’s documents would be a worse trade than the convenience is worth.',
  'docs.embed.params':
    '{conversion} picks which of the five, {theme} lets the host choose the palette rather than following the visitor’s operating system, and a locale prefix works as everywhere else — {locale}.',
  'docs.embed.messages':
    'The result leaves by {post}: {ready} on load, then {converted} with the name, the Markdown, the HTML and the counts, or {error}. Every message carries {source}, because a page listening on {window} hears from every frame it has and from its own scripts — and check {origin} against this site, which is the half nobody else can do for you.',
  'docs.embed.frames':
    'Only {embed} may be framed. Every other page of this site answers {ancestors}, so nothing here can be dressed up as somebody else’s.',

  'docs.limits.account.term': 'Per account',
  'docs.limits.account.text': '100 MB of Markdown, 500 documents',
  'docs.limits.convert.term': 'Per conversion',
  'docs.limits.convert.text':
    '10 MB — roughly 1.5 million words. Several files dropped together count as the one document they become',
  'docs.limits.document.term': 'Per kept document',
  'docs.limits.document.text':
    '4 MB, and not by our choice: a Vercel Function refuses a request or a response body over 4.5 MB before any of this code runs, so a larger document could be neither saved nor read back. It still converts, previews and downloads — it stays out of the history, and the app says so rather than reporting a save that did not happen',
  'docs.limits.caller.term': 'Per caller',
  'docs.limits.caller.text':
    '60 requests a minute, counted by key or by session',
  'docs.limits.refusal':
    'Reaching a limit is a refusal, not a silent eviction. This app used to drop the oldest document to stay under its cap, which quietly destroyed something its owner had chosen to keep; now it says what to delete instead.',

  'docs.faq.intro':
    'The same answers the converter shows under its dropzone — one set of them, so the two pages cannot drift apart.',

  'docs.footer.source': 'Source and issues:',
};
