---
title: "The Best Markdown Editor in 2026: Eleven Compared by What They Do to Your Files"
description: Eleven Markdown editors compared in 2026 — VS Code, Obsidian, Typora, iA Writer, Zettlr, Notion and Vim — judged by where they keep your text and what they export.
date: 2026-09-07
tag: Workflow
keywords: best markdown editor, best free markdown editor, markdown editor with live preview, markdown editor that exports html, obsidian vs typora, notion markdown export, markdown editor for windows, best markdown editor for mac
---

Most comparisons of Markdown editors compare the typing. Which one has the nicest font, which one dims the paragraph you are not working on, which one hides the asterisks. That is the part you notice on day one and the part that matters least by month six.

What matters later is duller. Where does the editor keep your text — in files you can see in a file manager, or in a service you have to ask for a copy? What syntax does it add that no other tool understands? And what comes out when somebody says "can you send me that as a web page", which is the request that exposes every shortcut the editor took while you were enjoying the font.

Eleven editors are compared below, on those terms. Some of them are text editors with Markdown support, some are writing applications, one of them is not a Markdown editor at all and is on the list because half the people reading this are using it as one.

### TL;DR

If you already have VS Code open, it is the best Markdown editor you will find without installing anything, because your files stay files and git already knows about them. If you want a comfortable writing application over a folder of plain `.md` files, Typora and iA Writer are the two worth paying for. Typora is $14.99 without tax, one-time, for up to three devices, with a 15-day trial (checked on typora.io, 8 September 2026). iA Writer is pay once per platform, with a 7-day trial and no card required (checked on ia.net/writer, 8 September 2026). Obsidian is the free one with the largest plugin ecosystem. If your documents live in Notion, you do not have a Markdown editor, you have a database with Markdown-shaped keyboard shortcuts, and getting the document out is a conversion job rather than a save.

## The three questions that separate Markdown editors

**Does it edit files, or documents?** This is the fault line, and every other difference follows from it. An editor that edits files opens a folder, shows you the `.md` documents in it, writes your keystrokes into those documents, and leaves them where a backup, a git commit or another programme can find them. An application that edits documents keeps them in its own store — a database, a browser's local storage, a synced workspace — and gives you an export button instead. Both can feel identical while you are typing. They stop feeling identical the day you want your text somewhere else.

**What syntax does it add?** Markdown is a small language, and every editor that has lived for a few years has grown things the specification does not have. Wikilinks in double square brackets. Callout blocks. Transclusion, where one document includes another. Highlighting with double equals signs. None of these are in CommonMark, most are not in GitHub Flavored Markdown, and a converter that follows the specification will render them as the literal characters you typed. That is not the converter being wrong. It is your editor having written something only your editor reads, in a file that looks portable.

**What does it produce when the document has to leave?** Editors answer this in four different ways. Some export HTML directly. Some export PDF and nothing else. Some shell out to Pandoc, which you have to install separately. Some have no export at all and expect you to run the file through something else, which is a reasonable position for a text editor to take and a surprising one to discover on a deadline. The [converters that do this job properly](/blog/best-markdown-to-html-converters) are a separate category of tool, and knowing which category you are in saves an afternoon.

There is a fourth question that only matters to some people, and matters enormously to those it does: whether the document is ever sent anywhere. An online editor holds your text on a server. For a blog post, who cares. For a client's contract, a performance review or an unreleased plan, that is the entire decision, made before any of the writing experience is relevant.

## Quick comparison: the cheat sheet

| Editor | Best for | Key capability | Price |
| --- | --- | --- | --- |
| VS Code | Writing Markdown that lives in a repository | Built-in preview, folder-level editing, git awareness | Free |
| Obsidian | A large personal set of linked notes | Local folder of `.md` files, plugin ecosystem, PDF export | Free for all purposes, including commercial |
| Typora | A writing application over plain files | Single-pane editing that renders as you type; HTML, PDF and Word export | $14.99 one-time, up to 3 devices |
| iA Writer | Long prose on a desktop and a phone | Focus modes, HTML and PDF export with templates | One-time purchase per platform |
| Zettlr | Academic writing with citations | Citations from Zotero and others; export through Pandoc | Free, GPL v3 |
| StackEdit | Writing in a browser tab, including offline | Works offline once loaded; syncs to Drive, Dropbox, GitHub | Free, Apache 2.0 |
| Dillinger | A quick document with a live preview | Browser editor with HTML and PDF export | Free, MIT |
| Notion | Team pages, not Markdown documents | Markdown-style shortcuts as input; export to Markdown, HTML, PDF | Free plan; paid plans priced per user |
| Vim / Neovim | People who already live in a terminal | Plugin-driven syntax, folding, preview; conversion by shell command | Free, open source |
| Nota | macOS writers willing to use a beta | Editor over local Markdown files; macOS only | Beta; no price stated on the site |
| Mark Text | A free desktop editor that renders as you type | Single-pane editing; HTML and PDF output | Free, MIT |

## The best Markdown editors in 2026

### VS Code — best if it is already open

VS Code is a code editor with Markdown support good enough that most developers never install anything else. It opens a folder rather than a file, which means your documents, your images and your `.gitignore` are all in one window, and the preview is one keystroke away from the text.

| Pros | Cons |
| --- | --- |
| Already installed for most developers, and free | Not designed for prose: no focus mode, no word-count furniture by default |
| Files stay ordinary files in an ordinary folder | Export to HTML needs an extension, and extensions vary in quality |
| Preview follows the CommonMark-compliant markdown-it parser | Preview styling is not the export styling |
| Extensions add linting, table formatting and image pasting | The window is a developer's window, with a sidebar full of code |

**Price:** free.

**Technical details and features**

- Side-by-side preview that scrolls with the source, plus folding by heading level
- Path completion for links and image references, so a broken relative path is visible while you type it
- Extensions cover linting (markdownlint), table alignment, and export to HTML and PDF
- Multi-cursor editing and regular-expression find and replace, which matters more for prose than people expect
- Snippets, so a table skeleton or a front matter block is three characters

**Who should use it?** Anybody whose Markdown lives next to code — READMEs, changelogs, documentation in the repository. It is also the best editor on this list for [fenced code blocks](/blog/code-blocks-in-markdown), because the editor already knows every language you are going to put in one.

### Obsidian — best free application over a folder of files

Obsidian opens a folder of `.md` files and treats the links between them as the point. Nothing is stored in a proprietary container: the folder it opens is a folder you can also open in VS Code, back up with anything, or delete without asking permission.

| Pros | Cons |
| --- | --- |
| Your documents are plain files in a folder you chose | Its wikilink syntax is not CommonMark or GFM, so it travels badly |
| Free for personal and commercial use | The plugin ecosystem is community-maintained, with the variance that implies |
| A large plugin ecosystem, including export plugins | HTML export is a plugin, not a built-in feature |
| Front matter is first-class, as document properties | The graph and the plugins invite tinkering instead of writing |

**Price:** free for all purposes, including personal, commercial and non-profit use; optional paid Sync and Publish services and a supporter licence are sold separately (checked on obsidian.md/license, 8 September 2026).

**Technical details and features**

- Opens a local directory; every note is a `.md` file, every attachment a file beside it
- `[[Note name]]` links and `![[image.png]]` embeds are Obsidian's own syntax, not part of any Markdown specification; there is a setting to write standard Markdown links instead
- YAML front matter is read as structured properties and shown as fields
- PDF export is built in; HTML export comes from community plugins
- Live preview hides the syntax as you type, with a source mode that shows the raw text

**Who should use it?** Anybody accumulating a few hundred notes that refer to each other, who wants those notes to still be readable in ten years. Turn the wikilink setting off on day one if the notes will ever be published, because the [difference between an app's syntax and portable Markdown](/blog/markdown-from-notion-obsidian-and-confluence) is cheap to avoid and expensive to fix later.

### Typora — best paid editor for people who dislike seeing the syntax

Typora is a desktop editor with one pane. There is no source on the left and preview on the right: you type `## Heading` and the line becomes a heading in place. For writers who find raw Markdown noisy, this is the difference between using Markdown and tolerating it.

| Pros | Cons |
| --- | --- |
| The calmest writing surface here, with no split-pane bookkeeping | Paid, and desktop only |
| Exports HTML, PDF and Word from the file you are looking at | Hiding the syntax makes some structural mistakes harder to see |
| Themes are plain CSS files, so the HTML export inherits them | Not a batch tool: one document at a time |
| Files stay local `.md` files | No plugin ecosystem to speak of |

**Price:** $14.99 without tax, a one-time purchase covering up to three devices, with a 15-day free trial (checked on typora.io, 8 September 2026).

**Technical details and features**

- Single-pane editing: the Markdown is replaced by its rendering as you type, with the source visible again when the cursor enters the line
- Export to HTML, PDF and Word; the HTML takes the CSS of whichever theme is active
- Themes are CSS files in a folder, so a house style is a stylesheet rather than a setting
- An option to copy pasted images into a relative folder next to the document, which is the difference between a portable file and one with links to your desktop
- Runs on macOS, Windows and Linux

**Who should use it?** People who write Markdown every day, want an application rather than a browser tab, and are happy to pay once. It is the shortest path from a finished document to a styled HTML file that somebody else can open.

### iA Writer — best for long prose across a desktop and a phone

iA Writer is a writing application first and a Markdown editor second. It has opinions about typography, a focus mode that greys out everything but the current sentence, and highlighting that marks up parts of speech so you can see how many adjectives you have been using.

| Pros | Cons |
| --- | --- |
| Built for prose, not documentation or notes | You pay per platform, so a Mac and an iPad are two purchases |
| Mac, Windows, iPhone and iPad, with plain files underneath | No plugins, no extensibility, by design |
| HTML and PDF export, with templates for the wrapper | Not a good fit for code-heavy documents |
| A 7-day trial with no card required | Deliberately few features, which some writers read as missing |

**Price:** one-time purchase per platform — "pay once per platform, own it forever" — with a 7-day free trial and no credit card required (checked on ia.net/writer, 8 September 2026).

**Technical details and features**

- Works on ordinary `.md` files in ordinary folders, including iCloud and Dropbox directories
- Focus mode and syntax highlighting of parts of speech, aimed at editing rather than drafting
- Content blocks: one document can include another by referencing it, which is how a book-length manuscript stays in separate chapter files
- Export to HTML and PDF, with templates controlling the wrapper
- Available for macOS 10.15 or later and Windows 10 or later (checked on ia.net/writer, 8 September 2026)

**Who should use it?** Writers producing essays, chapters and articles rather than documentation, who want the same document open on a laptop and a phone and do not want a plugin ecosystem to maintain.

### Zettlr — best free editor for academic writing

Zettlr is an Electron application built with Vue and TypeScript, aimed at people writing with references. It handles citations from a reference manager, full-text search across a folder, and export through Pandoc rather than reimplementing conversion itself.

| Pros | Cons |
| --- | --- |
| Citations from Zotero, JabRef and others, in the editor | Export depends on Pandoc, and often LaTeX, installed separately |
| Free and open source under the GNU GPL v3 | Heavier than a plain editor, being Electron |
| Full-text search across the whole folder | Interface is denser than the writing applications above |
| Custom CSS, themes and dark mode | The Zettelkasten framing is not for everybody |

**Price:** free, GNU GPL v3 licensed (checked on github.com/Zettlr/Zettlr, 8 September 2026).

**Technical details and features**

- Electron, Node.js and Vue 3 for the front end, with TypeScript in the codebase (checked on github.com/Zettlr/Zettlr, 8 September 2026)
- Export via Pandoc, LaTeX and Textbundle, which is why the format list is long and the install is not just the app
- Code highlighting for many languages inside fenced blocks
- Citation integration with the common reference managers
- Themes, dark modes and custom CSS for both editing and export

**Who should use it?** Anyone writing a thesis, a paper or a book with a bibliography, who wants Pandoc's output without assembling the command line by hand. If you were going to install Pandoc anyway, Zettlr is a free front end for it.

### StackEdit — best browser editor that keeps working offline

StackEdit is a Markdown editor that runs in a browser tab and keeps working when the connection does not. It syncs to the usual cloud storage when it has a network, and it can publish straight to a few blogging platforms.

| Pros | Cons |
| --- | --- |
| Nothing to install, and it works offline once loaded | Documents live in the browser's own storage until you connect a sync provider |
| Syncs with Google Drive, Dropbox and GitHub | Clearing site data is a real way to lose work |
| Publishes to Blogger, WordPress and Zendesk | Its extended syntax does not always survive elsewhere |
| Export as Markdown, HTML, or through a Handlebars template | A browser tab is easy to close by accident |

**Price:** free, Apache 2.0 licensed (checked on stackedit.io, 8 September 2026).

**Technical details and features**

- Runs entirely in the browser and states that you can write offline like a desktop application
- Sync destinations: Google Drive, Dropbox and GitHub
- Publishing destinations: Blogger, WordPress and Zendesk
- Output as Markdown, as HTML, or formatted through the Handlebars template engine
- Handles long documents with a table of contents and a scrollable outline

**Who should use it?** People on a machine where they cannot install software, and people whose next step after writing is a blog platform rather than a file.

### Dillinger — best for one document, right now

Dillinger runs in a browser tab: source on one side, preview on the other, and a save menu that will hand you back HTML or PDF or push the file to Dropbox, Google Drive, OneDrive or GitHub. It is the tool you open when you have a document to write in the next twenty minutes and nothing installed.

| Pros | Cons |
| --- | --- |
| Open a tab, write, export, close the tab | Your document passes through a hosted service |
| HTML and PDF export without an account | Export styling is the tool's, not yours |
| Free and open source under the MIT licence | Not an editor to keep a body of work in |
| Cloud sync to the usual four destinations | No offline story to speak of |

**Price:** free, MIT licensed.

**Technical details and features**

- Two-pane editor: Markdown on the left, rendered preview on the right
- Import from and save to Dropbox, Google Drive, OneDrive and GitHub
- Export the source as `.md` or the rendered document as HTML or PDF
- No install and no account needed for the basic flow

**Who should use it?** Somebody writing one document today. For anything with a recipient attached, treat the export as a first draft of the file and check what it actually produced — a preview and [a file that opens correctly elsewhere](/blog/share-a-markdown-document-as-a-link) are different things.

### Notion — the one that is not a Markdown editor

Notion accepts Markdown shortcuts. Type `## ` and you get a heading; type `- ` and you get a bullet. That is input assistance, not storage: what Notion keeps is a tree of blocks in its own database, and Markdown is one of the formats it will convert that tree into on the way out.

| Pros | Cons |
| --- | --- |
| Good at what it is for: shared pages, databases, team structure | Not a Markdown editor — export is a conversion, with losses |
| Export to Markdown and CSV, HTML, or PDF | Databases come out as CSV, not as Markdown tables |
| Familiar to every team that already uses it | Callout blocks export as HTML, because Markdown has no equivalent |
| Assets are included in the export archive | Nested folder paths can break extraction on Windows |

**Price:** free plan available; paid plans are priced per user — check notion.com/pricing for current figures.

**Technical details and features**

- Four export routes: PDF, HTML, "Markdown & CSV", and printing through the browser
- The Markdown export arrives as a compressed archive: `.md` files for non-database pages and subpages, a `.csv` file for each full-page database, and separate folders for images and other assets
- Notion's own help documentation states that callout blocks are exported as HTML "as there is no Markdown equivalent", and that a database's Form view cannot be exported at all
- Custom emoji do not appear in PDF exports
- On Windows, extraction can fail when the nested folder paths in the archive exceed 260 characters; the documented workarounds are to turn off folder creation for subpages, or to use a different extraction tool

(All of the above checked on notion.com/help/export-your-content, 8 September 2026.)

**Who should use it?** Teams who want a shared workspace and are honest with themselves that it is not a Markdown tool. If your documents have to end up as portable Markdown or as web pages, plan for a cleanup step after every export rather than hoping this one comes out clean.

### Vim and Neovim — best if you already live in a terminal

Vim and Neovim are not Markdown editors and become good ones with three or four plugins. The appeal is not the Markdown support; it is that the text editing is the fastest available anywhere and you already know it.

| Pros | Cons |
| --- | --- |
| Editing speed nothing on this list matches, if you have the muscle memory | Everything is a plugin, and you assemble and maintain it |
| Free and open source; runs over SSH, on anything | No document model: a table is text you align yourself |
| Preview and conversion are just other programmes you call | The learning curve is the well-known one |
| Configuration is a file you can commit and reuse | Nothing renders as you type |

**Price:** free and open source. Vim ships under its own charityware licence; Neovim is Apache 2.0.

**Technical details and features**

- Plugins such as vim-markdown add syntax highlighting, folding by heading and concealment of the markup
- Preview plugins such as markdown-preview.nvim render the document in a browser window as you type, using a Node process
- Table plugins such as vim-table-mode keep pipe tables aligned while you edit them
- Conversion is a shell command away: `:%!` and a pipeline, or a mapping that calls a converter on the current file
- The whole configuration is text, so the same setup follows you to every machine

**Who should use it?** People who already use it for code. Nobody should learn Vim in order to write Markdown, and anybody who knows Vim should not learn a second editor to write it.

### Nota — the interesting bet

Nota is a macOS Markdown editor aimed at writing and publishing from a local folder of files. It is worth knowing about and worth being clear-eyed about: the site describes a macOS beta, offers a waitlist and a pre-order, and does not state a price on the page.

| Pros | Cons |
| --- | --- |
| Built around local Markdown files, not a service | macOS only |
| Aimed at publishing, not just note-taking | Beta software, with the stability that implies |
| Small and focused rather than a plugin platform | No price stated on the site, so budget for the unknown |

**Price:** not stated on nota.md, which offers a waitlist and a pre-order rather than a listed price (checked 8 September 2026).

**Technical details and features**

- macOS only, per the site; there is no Windows or Linux build advertised
- Distributed as a beta to people who join the waitlist, with a pre-order option
- Works on ordinary Markdown files on disk rather than documents in a service
- Positioned around writing and publishing rather than note-taking

**Who should use it?** Mac writers who enjoy trying new applications and keep their files somewhere the application does not control. Because the documents are ordinary `.md` files, the cost of the bet not paying off is low — you switch editors and the folder is unchanged. That property is the whole reason to prefer file-owning editors, and it is worth more than any single feature.

### Mark Text — best free single-pane desktop editor

Mark Text is an open-source desktop editor with the render-as-you-type approach that Typora made popular, released under the MIT licence and built with Electron and Vue.

| Pros | Cons |
| --- | --- |
| Free, MIT licensed, and installable on all three desktops | Community project: check the recent commit history before you commit to it |
| Renders as you type, in one pane | Fewer export formats than the paid editors |
| Outputs HTML and PDF | Electron, so the memory footprint is what you expect |
| Local files, nothing uploaded | Smaller theme and extension story |

**Price:** free, MIT licensed.

**Technical details and features**

- Builds for Linux, macOS and Windows, on x64 and arm64
- Single-pane editing with the syntax replaced by its rendering
- Output to HTML and PDF
- Electron and Vue, so the source is approachable if you want to change something

**Who should use it?** Anybody who wants Typora's editing model without paying for it, and who is comfortable depending on a community project. If a maintained roadmap matters to you more than the price of a Typora licence, buy Typora instead.

## The split the comparison pages do not draw

Every list of Markdown editors ranks them on one axis. The axis that decides how much trouble you are in three years from now is a binary, and almost nobody puts it in the table.

**Editors that own files.** VS Code, Obsidian, Typora, iA Writer, Zettlr, Mark Text, Vim and Nota all point at a directory on a disk. The consequence is that the editor is replaceable. You can open the same folder in a second editor tomorrow, run a converter over it in a build, search it with `grep`, commit it to git, and back it up with the same tool that backs up everything else. When one of these applications is abandoned, you lose the application. You do not lose the writing.

**Applications that own documents.** Notion owns its documents in a database. StackEdit, until you connect a sync provider, owns them in your browser's storage. A hosted editor owns them on a server. The consequence is that getting your text out is an operation the vendor implements, at the fidelity the vendor chose, in the formats the vendor offers. That operation is usually fine and occasionally the worst afternoon of the quarter. The tell is that it is called "export" rather than "open".

**Proprietary syntax is a slow leak.** Wikilinks, callouts, highlight marks, embedded queries, transclusion — each one is convenient inside the application and inert outside it. You do not notice, because you only ever read those files in the application that wrote them. You notice on the day the documentation moves into the repository, or a colleague opens a note in a different editor, or a converter renders `[[Onboarding]]` as four literal brackets and a word. Nothing is corrupted. It just is not Markdown any more, and it has not been for a year.

**The preview is not the export.** Every editor here has a preview, and in every one of them the preview is styled by the editor. What lands in the exported HTML is a different stylesheet, sometimes a different parser, and occasionally a different flavour of Markdown. Tables are where this shows up first, because tables are not in CommonMark at all: an editor can render one correctly in its own pane and emit a paragraph of pipe characters on the way out. [Testing one table before you trust the pipeline](/blog/markdown-tables-that-survive-conversion) takes a minute and saves a re-send.

**What each one does when you need HTML.** This is the request that sorts them. Typora, iA Writer, Mark Text, StackEdit and Dillinger export HTML directly, styled their way. Obsidian exports PDF built in and HTML through a plugin. VS Code and Vim delegate to an extension or a command. Zettlr delegates to Pandoc, which you install. Notion offers HTML export of a block tree that was never Markdown in the first place. None of them is wrong; they are answering different questions. What they share is that the HTML they produce is HTML they chose, and if you need a specific kind of output — one complete file, styles inline, nothing fetched from a network — that is a converter's job rather than an editor's.

**The exit cost is the real price.** A one-time $14.99 is not the cost of an editor. The cost is what it takes to stop using it. For a file-owning editor, that cost is zero: you close it and open another one on the same folder. For a document-owning application, it is an export, an inspection, a cleanup pass over syntax that has no Markdown equivalent, and a set of asset paths to fix. Weigh that before the font.

## How to choose

1. **Decide whether your text has to outlive the editor.** If the answer is yes — and for notes, documentation and anything with your name on it, it is — pick something that opens a folder of files, because a folder of files can be opened by whatever exists in 2035.
2. **Match the editor to the kind of writing, not to the reviews.** Prose wants iA Writer or Typora; documentation next to code wants VS Code; a linked set of notes wants Obsidian; a bibliography wants Zettlr. Choosing the wrong category means fighting the interface every day over something a different application does by default.
3. **Turn off the proprietary syntax on day one.** If the editor offers standard Markdown links instead of its own, take the offer. Retrofitting hundreds of wikilinks later is a scripting job, and scripting jobs over your own notes have a way of eating a weekend.
4. **Check the export before you have a deadline.** Write one representative document — a table, a fenced code block, an image, a footnote — export it, and open the result in a different browser with the network off. Whatever is broken there will be broken then, when you have less time.
5. **Count the installs the export needs.** An editor that exports through Pandoc is excellent and is two installs. On your own machine that is fine; on a locked-down work laptop it is the reason the export never happens.
6. **Be honest about where the document goes.** If it is confidential, an editor that stores it on somebody's server is out, regardless of how much you like it. That decision comes first, because no writing experience is worth relitigating it later.

## Conclusion

The best Markdown editor is the one that edits your files rather than owning your documents, in a shape that suits the writing you actually do: VS Code if it is already open, Typora or iA Writer if you want to pay once for a calmer surface, Obsidian if the notes link to each other, Zettlr if there is a bibliography, Vim if you already live there. Notion is the exception worth naming twice, because it is a good product and a poor Markdown editor, and the gap only becomes visible on export. Whichever one you write in, keep the conversion separate from the editing: when the document has to become a web page somebody else can open, [convert the Markdown to a self-contained HTML file](/) in your browser, where the file stays on your machine and the output is one file that asks the network for nothing.

## FAQ

### What is the best Markdown editor for beginners?

Typora, if you are happy to pay $14.99 once, because it hides the syntax and there is nothing to configure. If you want free, Mark Text gives you the same editing model under the MIT licence, and StackEdit needs no install at all. Avoid starting with Vim or a heavily plugged-in setup; learn the syntax first and the tooling later.

### Is Obsidian a Markdown editor or a note-taking app?

Both, and the distinction matters. It edits ordinary `.md` files in a folder you choose, which makes it a real Markdown editor, but its wikilink and embed syntax is Obsidian's own rather than CommonMark or GFM. Switch the link setting to standard Markdown links if those notes will ever be converted or read elsewhere.

### Is VS Code good for writing Markdown?

Yes, particularly for anything that lives in a repository. The built-in preview follows a CommonMark-compliant parser, path completion catches broken image links as you type them, and git already tracks the file. It is a poor fit for long prose, because none of the writing-focused furniture — focus modes, typography, distraction-free layouts — is there without extensions.

### Does Notion export real Markdown?

It exports Markdown, with documented gaps. Databases become CSV files rather than Markdown tables, callout blocks come out as HTML because Markdown has no equivalent, a Form view cannot be exported, and on Windows the archive's nested folder paths can exceed the 260-character limit and fail to extract (checked on notion.com/help/export-your-content, 8 September 2026). Budget a cleanup pass every time.

### What is the best free Markdown editor?

VS Code if you write near code, Obsidian if you are building a set of linked notes — it is free for personal and commercial use — and Zettlr if you need citations. All three keep your text in plain files. For a browser tab with nothing installed, StackEdit is free under Apache 2.0 and works offline once loaded.

### Do I need a paid Markdown editor?

No. Every job on this page can be done with free software, and the free options are not compromises. You pay for a nicer writing surface and someone's continued attention to it, which is worth $14.99 to some people and nothing to others. Decide after a fortnight in a free editor, not before.

### Which Markdown editor gives me HTML I can send to somebody?

Typora, iA Writer, Mark Text, StackEdit and Dillinger all export HTML directly, each styled its own way. If what you need is a single self-contained file — styles inline, no external stylesheets or fonts, opens identically on a machine with no connection — that is a conversion step rather than an editor feature, and it is worth doing separately from wherever you wrote the text.
