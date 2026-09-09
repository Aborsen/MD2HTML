import type { Content } from '../../content';

/*
 * Every sentence the interface itself says, keyed by where it says it.
 *
 * This is the slice the components read through `useT()`. What is NOT here is anything that is a
 * thing rather than a word: an id, a path, a file extension, a slug, a date, a URL. Those stay in
 * the code that owns them — `shared/conversions.ts`, `src/lib/pages.ts`, `src/lib/blog.ts` — so a
 * translator editing a sentence cannot break a route.
 *
 * Keys follow the convention in `./index.ts`: `area.thing`, lower case, dots between, named for
 * where the string appears rather than for what it says. `page.` is the one prefix that file's list
 * does not name — it is the five pages that are only words, `src/features/StaticPage.tsx`, which
 * is a screen like the rest.
 *
 * A string built from a value carries a `{name}` placeholder and is filled in at the call site.
 * The alternative — a translated fragment glued to a number in JSX — cannot be reordered, and
 * German puts the pieces in a different order. So `history.row.stats.many` is one sentence with
 * two holes in it and not three children of a `<span>`.
 *
 * Singular and plural are separate keys, `.one` and `.many`, chosen by the caller. English needs
 * two forms and so do the four languages here; a language that needs more gets more keys, which is
 * a change to this file rather than to the components.
 */

export const ui: Content['ui'] = {
  /* Words that belong to no one screen. */
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.loading': 'Loading…',
  'common.clipboard.error': 'Could not access the clipboard',
  'common.selectall': 'Select all',
  'common.deselectall': 'Deselect all',
  'common.selected': '{count} selected',
  'common.exitselection': 'Exit selection',
  'common.scrolltotop': 'Scroll to top',
  /* Said by the converter after a drop and by the history after a merge — the same sentence. */
  'common.chained': 'Chained {count} files into one document',
  /*
   * What several files chained together are called: the first name, and how many followed it.
   *
   * A name rather than a label, and still a sentence — "more" is a word. The name of a document
   * with one source is that file's own name, and `merged.md` for none of them is a file name, so
   * both of those stay in `src/lib/merge.ts` where the rest of the naming lives.
   */
  'common.merged.name': '{first} + {count} more',

  /*
   * Sign-in, which fails in more ways than it succeeds and has to say which.
   *
   * The four `auth.error` sentences after the first are the outcomes `/api/auth/finish` can hand
   * back in the query string — a closed set, because the reason arrives in a link and a link is
   * something anybody can write. `auth.incomplete` is the toast that carries whichever it was.
   */
  'auth.incomplete': 'Sign-in did not complete',
  'auth.error.unfinished': 'Sign-in did not finish. Try again.',
  'auth.error.link': 'The sign-in link was incomplete. Try again.',
  'auth.error.unreachable': 'The sign-in service could not be reached.',
  'auth.error.rejected': 'The sign-in service refused the request.',
  'auth.error.nosession': 'The sign-in service returned no session.',
  'auth.error.start': 'Sign-in could not be started',
  'auth.error.signout': 'Sign-out failed',

  /* The bar at the top, on a wide screen and in the phone's sheet. */
  'header.home': 'New file',
  'header.tagline.conversion': '{name} converter',
  'header.tagline.app': 'document converter',
  'header.nav.converter': 'Converter',
  'header.nav.history': 'History',
  'header.nav.docs': 'Docs',
  'header.nav.documentation': 'Documentation',
  'header.nav.blog': 'Blog',
  'header.menu.open': 'Menu',
  'header.menu.title': 'Menu',
  'header.menu.close': 'Close menu',
  'header.menu.convert': 'Convert',
  'header.menu.goto': 'Go to',
  'header.account': 'Account',
  'header.signin': 'Sign in',
  'header.logout': 'Log out',
  'header.apikeys': 'API keys',
  'header.theme.label': 'Theme',
  'header.theme.dark': 'Dark',
  'header.theme.light': 'Light',
  'header.theme.toggle': 'Switch theme',
  'header.theme.tolight': 'Switch to light',
  'header.theme.todark': 'Switch to dark',

  /* The converter screen: the dropzone, the document it produces, and the bands below it. */
  'converter.dropzone.title': 'Drop {extension} files here',
  'converter.dropzone.choose': 'Choose files',
  'converter.dropzone.limits':
    '{extensions} · up to 10 MB · processed in your browser',
  /*
   * The same fact as `converter.dropzone.limits`, as a sentence rather than a row of clauses:
   * this one is the prerendered page's, read by a crawler and by anybody whose bundle has not
   * arrived yet, where a line of middle dots is not prose. `scripts/prerender.ts` fills it in.
   */
  'converter.accepts': 'Takes {extensions}, up to 10 MB, converted in your browser.',
  'converter.picker.label': 'Or convert something else',
  'converter.blog.eyebrow': 'Blog',
  'converter.blog.title': 'Making Markdown behave',
  'converter.blog.blurb':
    'Syntax that breaks, documents that have to reach other people, and getting the whole thing to run without you.',
  'converter.blog.all': 'All articles',
  'converter.faq.eyebrow': 'FAQ',
  'converter.faq.title': 'Questions people arrive with',
  'converter.faq.blurb':
    'What happens to the file, what the download contains, and what an account adds.',
  'converter.badge.converted': 'converted',
  'converter.badge.merged': '{count} files merged',
  'converter.newfile': 'New file',
  'converter.share': 'Share',
  'converter.share.hint': 'Share a link to this document',
  'converter.share.hint.signedout':
    'Sign in to share — sharing needs the document in your account',
  'converter.copy': 'Copy {format}',
  'converter.copy.done': '{format} copied to clipboard',
  'converter.download': 'Download .{format}',
  'converter.download.more': 'Other formats',
  'converter.download.done': '{format} downloaded',
  'converter.print': 'Print or save as PDF',
  'converter.print.error': 'Could not open the print dialog',
  'converter.print.error.hint': 'Try downloading it instead.',
  'converter.tab.preview': 'Preview',
  'converter.tab.html': 'HTML source',
  'converter.tab.markdown': 'Markdown',
  'converter.fullscreen.enter': 'Read fullscreen',
  'converter.fullscreen.exit': 'Exit fullscreen',
  'converter.fullscreen.error': 'Fullscreen is not available here',

  /*
   * When a file does not come through: what was dropped, what was too big, what the conversion
   * itself had to say, and what a document that converted but would not fit is.
   *
   * The reason is always a second sentence rather than a clause bolted onto the first, because the
   * toast has two lines and a reason is what somebody can act on. `{conversion}` is the name from
   * `content.conversions`, so the failure says "Word → Markdown did not work" in every language.
   */
  'converter.reject.title': 'Not a file this can convert',
  'converter.reject.extension': '{name} — {extensions} is what this page takes.',
  'converter.reject.mixed':
    'Those are {count} different kinds of file. Convert one kind at a time.',
  'converter.toolarge.one': 'File is too large',
  'converter.toolarge.many': 'Those files are too large',
  'converter.toolarge.detail': '{size} — the limit for one document is {limit}.',
  'converter.converted': 'Converted to {format}',
  'converter.notkept.title': 'Converted, but not saved to your account',
  'converter.notkept.detail':
    'A kept document can be {limit}; this one is {size}. Download it — it is ready.',
  'converter.failed': '{conversion} did not work',
  'converter.failed.detail': 'The file could not be read.',
  'converter.error.norows': 'That file has no rows in it.',
  /* `{why}` is the converter's own account of it, which for a Word file is mammoth's. */
  'converter.error.empty': 'Nothing came out of that document — {why}.',
  'converter.error.empty.why': 'the file has no text in it',
  /* The frame a PDF is printed from: never seen, read out by a screen reader. */
  'converter.print.frame': '{name} for printing',
  'converter.print.unprepared':
    'The document could not be prepared for printing.',

  /*
   * What the document is made of, one noun per count. The number is its own element on the line —
   * it is set in a heavier weight — so the word is translated on its own rather than as part of a
   * sentence with a hole in it.
   */
  'converter.stats.word': 'word',
  'converter.stats.words': 'words',
  'converter.stats.heading': 'heading',
  'converter.stats.headings': 'headings',
  'converter.stats.table': 'table',
  'converter.stats.tables': 'tables',
  'converter.stats.codeblock': 'code block',
  'converter.stats.codeblocks': 'code blocks',
  'converter.stats.link': 'link',
  'converter.stats.links': 'links',
  'converter.stats.image': 'image',
  'converter.stats.images': 'images',

  /* The list of everything converted: its header, its filters, its rows and its columns. */
  'history.title': 'History',
  'history.synced': 'Saved to your account',
  'history.local': 'Kept in this browser — sign in to reach them anywhere',
  'history.usage':
    '· {bytes} of {maxBytes} · {documents} of {maxDocuments} documents',
  'history.empty.title': 'No conversions yet',
  'history.empty.synced':
    'Every file you convert is saved to your account — open it from any device.',
  'history.empty.local':
    'Every file you convert shows up here. Sign in to keep the list across devices.',
  'history.empty.action': 'Convert a file',
  'history.drop.title': 'Drop files',
  'history.drop.hint':
    'or click to browse — several files are chained into one document',
  'history.search.placeholder': 'Search by name',
  'history.search.label': 'Search history by file name',
  'history.search.clear': 'Clear search',
  'history.chip.all': 'All formats',
  'history.chip.shared': 'Shared with me',
  'history.shared.one': '{count} document shared with you',
  'history.shared.many': '{count} documents shared with you',
  'history.count.one': '{count} file',
  'history.count.many': '{count} files',
  'history.count.filtered.one': '{found} of {total} file',
  'history.count.filtered.many': '{found} of {total} files',
  'history.merge': 'Merge',
  'history.merge.hint':
    'Chain the selected files into one document, oldest first',
  'history.merge.hint.few': 'Pick at least two files to chain',
  'history.download': 'Download',
  'history.delete': 'Delete',
  'history.clear': 'Clear history',
  'history.column.file': 'File',
  'history.column.type': 'Type',
  'history.column.sharedby': 'Shared by',
  'history.column.size': 'Source size',
  'history.column.content': 'Content',
  'history.column.converted': 'Converted',
  'history.column.actions': 'Actions',
  'history.row.someone': 'someone',
  'history.row.select': 'Select {name}',
  'history.row.open': 'Open preview',
  'history.row.open.label': 'Open {name}',
  'history.row.unavailable': 'Source was too large to keep locally',
  'history.row.share': 'Share',
  'history.row.share.label': 'Share {name}',
  'history.row.download.label': 'Download {name}',
  'history.row.remove': 'Remove from history',
  'history.row.stats.one': '{words} words · {headings} heading',
  'history.row.stats.many': '{words} words · {headings} headings',

  /*
   * What the list says when it has done something, or could not.
   *
   * `history.error.*` are `useHistory`'s: the hook has no words of its own, so the screen hands it
   * a `t` and it reports in the reader's language. A server's own refusal is passed on as the
   * `{reason}` of one of these rather than shown on its own, since it arrives in English whatever
   * the reader speaks — and `history.error.delete.reason` is what stands in when it says nothing.
   */
  'history.error.load': 'Could not load history',
  'history.error.save': 'Could not save file',
  'history.error.delete': 'Could not delete: {reason}',
  'history.error.delete.reason': 'server refused',
  'history.error.delete.some':
    '{failed} of {total} files could not be deleted',
  'history.error.clear': 'Could not clear the history',
  'history.source.missing': 'The source of this file is no longer available',
  'history.download.done': 'File downloaded',
  'history.download.none': 'Nothing could be downloaded',
  'history.download.one': '{format} file downloaded',
  'history.download.many': '{count} {format} files downloaded',
  'history.merge.none': 'Nothing to merge',
  'history.merge.none.detail':
    'The sources of these files are no longer available.',
  'history.removed.one': 'File removed',
  'history.removed.many': '{count} files removed',
  'history.cleared': 'History cleared',

  /*
   * The blog index. The articles themselves are not in the catalogue — see `content.ts` — so a
   * card's title, description and tag are the English the piece was written in, and only the
   * furniture around them is here.
   */
  'blog.eyebrow': 'Blog',
  'blog.title': 'Markdown, and what to do with it',
  'blog.blurb':
    'Conversion, syntax that breaks, publishing, and getting the whole thing to run without you.',
  'blog.chip.all': 'All',
  'blog.empty': 'Nothing under that tag yet.',
  'blog.card.meta': '{date} · {minutes} min read',

  /* One article: the furniture around a piece of prose that stays in English. */
  'article.toc': 'In this article',
  'article.meta': '{date} · {minutes} min read',
  'article.meta.updated': '{date} · updated {updated} · {minutes} min read',
  'article.share': 'Share',
  'article.cta.text':
    'This page was written in Markdown and rendered by the converter it describes.',
  'article.cta.button': 'Convert a file',
  'article.more.eyebrow': 'Next',
  'article.more.title': 'Keep reading',
  'article.more.meta': '{minutes} min read',
  'article.missing.title': 'No such article',
  'article.missing.blurb':
    'It may have been renamed. The index has everything that exists.',
  'article.missing.back': 'Back to the blog',

  /*
   * The five pages that are only words. Their own text is in `pages.ts`, keyed by page; these two
   * are what the renderer says around it.
   *
   * The closing line is split because a link sits inside it: `page.questions` is the sentence up
   * to the link and `page.questions.link` is the words the anchor carries. A translator who needs
   * the link earlier in the sentence cannot get it from here, which is the price of the anchor.
   */
  'page.updated': 'Last updated {date}',
  'page.questions': 'Questions about any of this go to',
  'page.questions.link': 'the repository’s issues',

  /*
   * A document somebody sent you, at /open/<token>.
   *
   * The app's own screen, so it follows the reader's language like every other one. The copy the
   * server renders at /s/<token> is a different page for a reader we know nothing about, and its
   * words are not in here — see `src/lib/i18n/content.ts`.
   *
   * Its Download button and its Sign in button say what those buttons say everywhere else, so they
   * read `converter.download` and `header.signin` rather than keys of their own.
   */
  'shared.loading': 'Opening the document…',
  'shared.meta': 'shared · converted {date}',
  'shared.signin.title': 'This document was shared with specific people',
  'shared.signin.detail': 'Sign in with the address it was shared with.',
  'shared.missing.title': 'This link does not open a document',
  'shared.missing.action': 'Convert your own file',

  /* Sharing a document. */
  'dialog.share.title': 'Share',
  'dialog.share.mode.private': 'Private',
  'dialog.share.mode.link': 'Anyone with the link',
  'dialog.share.mode.people': 'Specific people',
  'dialog.share.private.note':
    'Only you can open this document. Pick a mode above to share it.',
  'dialog.share.link': 'Link',
  'dialog.share.link.field': 'Share link',
  'dialog.share.link.note': 'Anyone with this link can read the document.',
  'dialog.share.people.note':
    'Only the people below can open it, after signing in with that address. Send them the link yourself — the app does not email anyone.',
  'dialog.share.people.empty': 'Nobody yet — the link opens for you only.',
  'dialog.share.email.label': 'Recipient email',
  'dialog.share.add': 'Add',
  'dialog.share.remove.label': 'Remove {email}',
  'dialog.share.error': 'Sharing failed',

  /* API keys, and the assistants that have been let in. */
  'dialog.keys.title': 'API keys',
  'dialog.keys.blurb':
    'Convert and share documents from a script, a terminal or CI — and the assistants you have connected.',
  'dialog.keys.name.placeholder': 'What will use it — “CI”, “my laptop”',
  'dialog.keys.name.label': 'Key name',
  'dialog.keys.create': 'Create',
  'dialog.keys.create.error': 'Could not create the key',
  'dialog.keys.fresh': 'Copy it now — it is not shown again',
  'dialog.keys.empty':
    'No keys yet. A key can read, write and share your documents — it cannot touch your account or these keys.',
  'dialog.keys.revoked': '{name} · revoked',
  'dialog.keys.meta': '{prefix}… · {used}',
  'dialog.keys.used': 'used {when}',
  'dialog.keys.never': 'never used',
  'dialog.keys.forget': 'Remove from the list',
  'dialog.keys.forget.label': 'Remove {name}',
  'dialog.keys.revoke': 'Revoke — stops it working immediately',
  'dialog.keys.revoke.label': 'Revoke {name}',
  'dialog.keys.grants': 'Connected assistants',
  'dialog.keys.grant.meta': 'connected {since} · {used}',
  'dialog.keys.disconnect': 'Disconnect — it stops acting as you immediately',
  'dialog.keys.disconnect.label': 'Disconnect {name}',

  /* The foot of the site. The column of conversions and the legal links get their words elsewhere. */
  'footer.tagline':
    'Markdown, HTML, Word, CSV and JSON documents, converted in your browser.',
  'footer.builtby': 'Built by Raudar Labs.',
  'footer.note': '© Raudar Labs {year}',
  'footer.converter': 'Converter',
  'footer.resources': 'Resources',
  'footer.company': 'Company',
  'footer.legal': 'Legal',
  'footer.docs': 'Documentation',
  'footer.blog': 'Blog',
  'footer.git': 'Git',
  /* Read out after the link's own name, so it opens with the space that separates them. */
  'footer.external': ' (opens in a new tab)',
};
