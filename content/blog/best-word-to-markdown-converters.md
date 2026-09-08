---
title: "Best Word to Markdown Converters in 2026: Every Way to Convert Word to Markdown"
description: Compare the ways to convert Word to Markdown in 2026 — browser converters, Pandoc, mammoth, Google Docs and Word plugins — and what a .docx loses on the way
date: 2026-09-09
tag: Converting
keywords: convert word to markdown, docx to markdown converter, word to markdown online, best word to markdown converter, convert docx to markdown command line, word document to markdown without upload, pandoc docx to markdown, mammoth docx to markdown
---

A `.docx` is a zip archive full of XML. Unzip one and you get `document.xml` for the text, `styles.xml` for the named styles, `numbering.xml` for the lists, a `media` folder for the images, and a handful of parts describing relationships between them. Markdown is a text file with asterisks in it. Converting between the two is not translation. It is a decision, taken by whichever tool you picked, about which parts of that archive matter and which get dropped on the floor.

The decision is usually invisible until you read the output. The headings arrived. The paragraphs arrived. Then the numbered list starts at 1, restarts at 1 halfway down, and the sub-items have flattened into the top level. The table came across as pipes but the merged header cell did not survive the trip. The pull quote in the text box is simply absent, and nothing anywhere told you it was gone.

Every tool on this page loses something. What separates them is what they lose, whether they say so, and whether the file left your machine on the way through. Those are three different questions and vendor pages answer none of them.

This is a comparison of the ways to get a Word document into Markdown: browser converters, Pandoc, the mammoth library and its browser build, Google Docs and its add-ons, a plugin that lives inside Word itself, and the copy-paste route that works better than it has any right to. Then the honest part — the list of things in a `.docx` that Markdown has no syntax for, and what each tool does when it meets one.

### TL;DR

For one document you need now, use a browser converter: no install, and with a browser-side tool the file is never uploaded, which matters when the document is a contract rather than a README. For a repository full of documents, or for anything that needs tracked changes and extracted images, install Pandoc — it is the only tool here with real options for both. For conversion inside your own code, mammoth is the library almost everything else is built on, and its own documentation tells you to generate HTML and convert that to Markdown rather than use its Markdown writer. And accept the losses up front: fonts, margins, page breaks, text boxes and comments have no Markdown equivalent, so no tool can keep them and every tool that claims to is describing something else.

## Why converting a .docx is not one job

Read a Word file and you are doing four things in sequence. You unzip the archive. You walk the XML, resolving each paragraph's style and numbering against other parts of the archive. You decide what each resolved element becomes — a heading, a list item, a table row, or nothing. Then you serialise that into Markdown, which means choosing a flavour, because plain CommonMark has no tables and no strikethrough.

A tool can be careful about one of those steps and careless about the next. The second step is where most of the damage happens, and it happens for a reason worth understanding: in a `.docx`, meaning is stored by reference. A heading is not marked as a heading. It is a paragraph whose `w:pStyle` names a style, and the style's own definition — over in `styles.xml` — is what says it is Heading 1. A list item is a paragraph carrying a `w:numPr` element with a `w:numId` and a `w:ilvl`, and whether that is a bullet or a number lives in `numbering.xml`, in a level whose `w:numFmt` says `bullet` or says `decimal`.

That indirection is why two documents that look identical on screen convert differently. If somebody built their headings by selecting text and making it 18pt bold, there is no style reference to resolve, and every converter here will hand you a paragraph. The Google Docs add-on says this in its own README — text that is merely bold and large converts as a normal paragraph. It is not a bug in the converter. There was never any heading in the file.

The fourth step decides flavour, and the same rules apply as for [Markdown to HTML in the other direction](/blog/best-markdown-to-html-converters). Tables, strikethrough and task lists are GitHub Flavored Markdown, not CommonMark. Footnotes are in neither specification. So a converter's table support is a claim about its output flavour, not about how well it read your document, and the two get conflated constantly.

## Quick comparison: the cheat sheet

| Tool | Best for | Key capability | Price |
| --- | --- | --- | --- |
| transformpipe | One document, now, without uploading it | Reads the `.docx` in the browser; headings, lists, links and tables out as Markdown | Free |
| Pandoc | Batches, pipelines and tracked changes | `--track-changes`, `--extract-media`, ~40 formats | Free, GPL |
| mammoth | Conversion inside your own code | Node and browser builds; style map from Word styles to elements | Free, BSD-2-Clause |
| MarkItDown | Feeding many file types to a text pipeline | Python CLI and library, many formats in, Markdown out | Free, MIT |
| Google Docs (native) | A document already in Drive | File → Download → Markdown (.md), and Copy as Markdown | Free with a Google account |
| Docs to Markdown add-on | Converting part of a Google Doc | Sidebar in Docs; converts a selection, not just the file | Free, Apache 2.0 |
| Writage | Writers who will not leave Word | Markdown open and save from inside Word's own ribbon | $29 +VAT personal, one-time |
| Copy and paste | A few paragraphs, right now | The HTML clipboard carries structure; a paste-aware editor converts it | Free |
| Word's Save as Web Page | Getting HTML out of Word without a converter | Word writes the HTML, you convert that | Included with Word |
| LibreOffice, headless | Old `.doc` files and odd formats | `soffice --convert-to docx` as a first step | Free, MPL 2.0 |
| python-docx | Reading the XML yourself | Create, read and update `.docx` from Python | Free, MIT |

## The best ways to convert Word to Markdown in 2026

### transformpipe — best for one document you do not want to upload

transformpipe reads the `.docx` in your browser and hands back Markdown. Signed out, the file is never sent anywhere: it is read by the page, converted on your machine, and the result is yours. There is no install and no account required.

Under the bonnet it does exactly what mammoth's own documentation recommends — mammoth turns the archive into HTML, and a separate HTML to Markdown step turns that into Markdown. That is two conversions rather than one, and it is the arrangement the library's authors suggest, because HTML has an element for most things a `.docx` contains and Markdown does not.

| Pros | Cons |
| --- | --- |
| Nothing is uploaded when you are signed out | The browser does the work, so a very large document is limited by the machine |
| No install, no terminal, no account | One document at a time, not a directory |
| Headings, lists, links, tables, bold and italic come across | Tracked changes resolve to the accepted text; deletions and comments do not come across |
| The Markdown is editable in place before you download it | No option to extract images to a folder |

**Price:** free. An account adds history, sharing and an API, also free.

**Technical details and features**

- Takes `.docx`; the older binary `.doc` is a different format and needs converting first
- mammoth reads the archive, then the HTML is converted to GitHub Flavored Markdown — tables and strikethrough included
- Raw HTML that survives the trip passes through a sanitiser with a fixed allow-list before it is ever rendered
- Downloads as `.md`, or as a self-contained HTML file if the Markdown was only ever a waypoint
- The same conversion is available from a REST API, a CLI, a GitHub Action and an MCP server

**Who should use it?** Anybody with a document they would rather not post to a stranger's server — a contract, a patient note, an unreleased plan, an internal report. The privacy claim is the sort you can check rather than take on trust: open the network tab and watch nothing happen while it converts.

### Pandoc — best for batches, images and tracked changes

Pandoc is a command line document converter written in Haskell that reads and writes around forty formats. Its `.docx` reader is the most configurable one available anywhere, and it is the only tool on this page with a documented answer for tracked changes.

| Pros | Cons |
| --- | --- |
| `--track-changes` takes `accept`, `reject` or `all` | Requires an install and a terminal |
| `--extract-media` writes the images out to a directory | Its Markdown dialect is not GFM unless you ask for GFM |
| Scriptable, so a hundred files is the same work as one | Custom styles need a style mapping you write yourself |
| Reads `.docx` and writes it too, so round trips are possible | The manual is long and the flags are many |

**Price:** free, GPL licensed.

**Technical details and features**

- `--track-changes=accept` is the default and processes insertions and deletions; `reject` ignores them; `all` includes insertions, deletions and comments wrapped in spans (checked on pandoc.org, 8 September 2026)
- `--extract-media=DIR` pulls images out of the archive into a folder, or into a zip if you name one
- Output flavour is explicit: `-t gfm` for GitHub Flavored Markdown, `-t commonmark`, or Pandoc's own extended dialect with footnote syntax
- `--wrap=none` stops it reflowing paragraphs at 72 columns, which is the first flag most people want and the last one they find
- Lua filters let you rewrite the document mid-conversion, before it is serialised

**Who should use it?** Anybody converting more than one file, anybody who needs the images on disk rather than lost, and anybody dealing with a document that has been through review. `--track-changes=all` is the closest thing to a real answer for a marked-up manuscript, and no browser tool offers an equivalent.

### mammoth — best for conversion inside your own code

mammoth is a library that converts `.docx` to HTML, with builds for Node and for the browser. It is the thing a surprising number of "Word to Markdown" tools turn out to be, once you look.

Its distinguishing idea is the style map. Rather than guessing, mammoth matches Word's named styles to HTML elements: `p[style-name='Heading 1'] => h1`, and you can extend the map for whatever house styles your organisation uses. That is the mechanism that makes a document with a custom "Chapter Title" style convert correctly, and the absence of that mechanism is why other tools do not.

| Pros | Cons |
| --- | --- |
| Runs in Node and in the browser — `mammoth.browser.js` ships in the package | Produces HTML; the Markdown step is yours |
| Style maps handle custom Word styles properly | Its own Markdown writer is deprecated by its authors |
| Reports what it could not map, in a `messages` array | No page layout, because HTML has no page |
| A CLI is included for one-off conversions | JavaScript only |

**Price:** free, BSD-2-Clause licensed.

**Technical details and features**

- `mammoth.convertToHtml({arrayBuffer})` in the browser, `{path}` in Node
- `convertToMarkdown` exists and the README marks Markdown support as deprecated, recommending HTML plus a separate HTML to Markdown library instead
- The `messages` array on every result lists unrecognised styles and unhandled elements — the only machine-readable account of what a converter dropped that any tool here provides
- Images can be inlined as data URIs or handed to a callback so you write them where you like
- The command line form is `mammoth document.docx output.html`

**Who should use it?** Developers building conversion into an application, especially in the browser where there is no other real option. Read the `messages` array and surface it to your users; it is the difference between a converter and a converter you can trust.

### MarkItDown — best for feeding a pipeline rather than a person

MarkItDown is a Python tool from Microsoft that converts many file types to Markdown — Word, PowerPoint, Excel, PDF, HTML, CSV, JSON, EPUB and more — with a CLI and a library API.

It is unusually honest about its purpose. The README says it exists for converting files to Markdown for use with language models and text analysis pipelines, and that while the output is often presentable, it is meant to be consumed by tools and may not be the best option for high-fidelity conversion for human consumption. Believe that sentence. It tells you exactly when to reach for it and when not to.

| Pros | Cons |
| --- | --- |
| One command for a dozen input formats | Output is aimed at machines, by its authors' own account |
| Library and CLI, so it drops into a Python pipeline | Python and a package manager required |
| Actively developed and widely used | Less control over `.docx` specifics than Pandoc |
| Handles archives and images too | Not the tool for a document somebody will read closely |

**Price:** free, MIT licensed.

**Technical details and features**

- `markitdown path-to-file.docx > document.md`, or `-o` to name the output
- Formats listed in the README include PDF, PowerPoint, Word, Excel, images with OCR, audio with transcription, HTML, CSV, JSON, XML, ZIP, YouTube URLs and EPUB
- Available as a Python library for use inside a script rather than from a shell

**Who should use it?** Anybody assembling a corpus. If the Markdown is going into a retrieval index or a prompt, fidelity below the level of "the words are in the right order" does not matter and this is the fastest way there. If a human is going to read the output, use something else.

### Google Docs — best when the document is already in Drive

Google Docs has a native Markdown export. File → Download → Markdown (.md) writes a `.md` file, and right-clicking a selection offers Copy as Markdown, with Paste from Markdown for the return journey (checked on support.google.com, 8 September 2026).

The catch is the route in. A `.docx` on your laptop has to be uploaded to Drive and opened in Docs before any of this applies, and Docs' own import is itself a conversion with its own losses. You are running two conversions and only controlling the second.

| Pros | Cons |
| --- | --- |
| No install, and no third-party tool involved | The `.docx` has to be uploaded to Google first |
| Copy as Markdown works on a selection, not just a whole file | Docs' `.docx` import is a conversion of its own |
| Paste from Markdown makes the round trip possible | No options: you get what it gives |
| Free with an account you probably have | Comments live in Docs and do not come out in the Markdown |

**Price:** free with a Google account.

**Technical details and features**

- File → Download → Markdown (.md) for the whole document
- Copy as Markdown on a right-click, for part of one
- Paste from Markdown converts Markdown into Docs formatting on the way in

**Who should use it?** Anybody whose documents already live in Google Docs. If your `.docx` is on disk and confidential, uploading it to convert it is the wrong trade, and this is the one option on the page that requires exactly that. The same warning applies to documents arriving out of any hosted editor — [what survives an export from Notion, Obsidian or Confluence](/blog/markdown-from-notion-obsidian-and-confluence) is a version of the same question.

### Docs to Markdown — best for converting part of a Google Doc

Docs to Markdown, also known by its repository name gd2md-html, is a Google Docs add-on written in Apps Script. It opens as a sidebar and converts the document, or just the selection, to Markdown or HTML.

| Pros | Cons |
| --- | --- |
| Converts a selection, which the native export cannot | Google Docs only |
| Open source, and asks for minimal permissions | Not accepting contributions, per the repository |
| Predates the native export and still does things it does not | Requires the same upload-to-Drive step |
| Writes HTML as well as Markdown | Headings must be real heading styles, not big bold text |

**Price:** free, Apache 2.0 licensed.

**Technical details and features**

- Installed from the Google Workspace Marketplace; runs as a Docs sidebar
- Asks only for access to the current document and permission to create a sidebar
- Its README is explicit that text which is merely bold and large converts as a normal paragraph

**Who should use it?** People drafting in Docs who publish to a Markdown platform, and anybody who needs one section rather than a whole file.

### Writage — best for people who will not leave Word

Writage is a plugin that installs into Microsoft Word and adds Markdown to Word's own Open and Save As dialogs, with a Writage tab in the ribbon. It is the only option here that works the way a Word user expects: File, Save As, Markdown.

| Pros | Cons |
| --- | --- |
| Markdown becomes a format Word itself reads and writes | Paid, and per user |
| No second application, no terminal, no upload | Windows and macOS builds only — no Word on the web |
| Round trips: open Markdown in Word, save it back | Tied to Word, so no batch conversion of a directory |
| Full-functionality trial before you pay | Another add-in in an application that often has several |

**Price:** $29 +VAT for a personal licence, one-time and perpetual, with free upgrades for twelve months after purchase; commercial licences are $145 +VAT for five users, also one-time. A 14-day free trial with full functionality is available (checked on writage.com, 8 September 2026).

**Technical details and features**

- Installs as a Word add-in; the download is offered as an `.msi` for Windows and a `.pkg` for macOS
- Adds Markdown to Word's Open and Save As dialogs, and a Writage tab to the ribbon
- Licence is activated from that tab by pasting a code

**Who should use it?** Writers and editors whose whole working day is in Word and who publish to a Markdown system. If the alternative is teaching a team of non-technical authors to use a terminal, thirty dollars a head is not the expensive part of the project.

### Copy and paste through the HTML clipboard — better than it sounds

When you copy from Word, the clipboard carries several representations of the same selection, and one of them is HTML. Paste that into an editor that understands the HTML clipboard and converts it — a great many Markdown editors do, and so do GitHub's comment boxes — and the headings, lists, bold, italics, links and often the tables arrive as Markdown.

| Pros | Cons |
| --- | --- |
| Instant, and needs nothing installed | Images do not come through; they are references to a clipboard, not files |
| Preserves inline structure surprisingly well | Depends entirely on the destination editor's paste handling |
| Works on a selection, so you can take one section | Long documents mean scrolling, selecting and hoping |
| No file leaves your machine | No account of what was dropped |

**Price:** free.

**Who should use it?** Anybody moving a few hundred words. It is the fastest route for a section of a document and the worst route for a whole one, and the failure mode is quiet: the text arrives, the images do not, and nobody notices until the page is published.

### Word's Save as Web Page, then HTML to Markdown

Word can write HTML itself. Save As, and pick Web Page, Filtered — the filtered option is the one that leaves out most of Word's own XML. Then convert that HTML to Markdown with whatever tool you like.

This is a two-step route and worth knowing because Word is the only program that understands its own document perfectly. What it produces is verbose HTML with a great deal of inline styling, which a decent HTML to Markdown converter throws away, leaving structure behind.

| Pros | Cons |
| --- | --- |
| Word itself does the reading, so nothing is misinterpreted | Two steps, and the intermediate file is large |
| Images are written out to a folder beside the HTML | Unfiltered output carries enormous amounts of Word markup |
| No third-party software at the first step | Needs Word, and a second tool for the second step |

**Price:** included with Word.

**Who should use it?** Anybody who has Word open, a document that other converters have mangled, and an HTML to Markdown step already available. It is also the route to try when a document's custom styles defeat everything else, because Word resolves them before writing the HTML. If you go this way, sanitise the HTML before you trust it — [raw HTML from any source deserves the same treatment](/blog/sanitising-markdown-safely).

### LibreOffice, headless — the preprocessor for old and odd files

LibreOffice is not a Markdown converter and is worth a row anyway, because it is the reliable answer to the file that no other tool will read. The old binary `.doc` format, `.rtf`, WordPerfect files, an `.odt` somebody sent from a Linux machine: `soffice --headless --convert-to docx oldfile.doc` produces a `.docx`, and everything else on this page can then read it.

| Pros | Cons |
| --- | --- |
| Reads formats nothing else on this list touches | Two conversions, so two sets of losses |
| Scriptable and headless, so it fits in a pipeline | A large install for a preprocessing step |
| Free and open source | Its `.docx` output is its interpretation, not the original |

**Price:** free, MPL 2.0 licensed.

**Who should use it?** Anybody with an archive of files older than the `.docx` format itself. Convert to `.docx` first, then convert that, and expect the first step to be where the surprises are.

### python-docx — for when you want to make the decisions yourself

python-docx creates, reads and updates `.docx` files from Python. It has no Markdown writer and no HTML writer, and that is the point: it gives you the paragraphs, runs, styles and tables as objects, and what you emit is entirely your problem.

| Pros | Cons |
| --- | --- |
| Complete control over what becomes what | You are writing the converter |
| Reads and writes, so it can edit documents too | No Markdown output of any kind |
| Well documented and long established | Only worth it for a rule no tool implements |

**Price:** free, MIT licensed.

**Who should use it?** Teams with a house rule that no converter knows — a specific style that must become a specific shortcode, a table format that has to be reshaped, a document structure that maps onto a content model. If your requirement is ordinary, this is far more work than it is worth.

## What a .docx carries that Markdown cannot express

This is the section a vendor page will not write, because there is no way to write it that sounds good. Markdown has about a dozen constructs. A `.docx` has hundreds. The conversion is lossy by definition, and the only useful question is which losses you are agreeing to.

**Fonts, sizes and colours.** Markdown has no syntax for typeface, point size or colour. Not "poor support" — none. Every converter here drops them, and the ones that appear not to are emitting raw HTML with a `style` attribute, which is a different document in a Markdown-shaped wrapper. If the document's meaning depends on its typography, converting it to Markdown destroys the meaning and keeps the words.

**Margins, page size and page breaks.** Markdown has no pages. A document laid out for A4 with mirrored margins and a page break before each chapter becomes one continuous stream. Pandoc can emit a form feed or a raw block for a page break, and it is a marker for a later step to interpret, not a page break. There is nothing to break.

**Headers, footers and page numbers.** These live in their own parts of the archive and refer to a concept — the page — that does not exist on the other side. They are dropped silently by everything. Nobody misses them until a document with "Confidential — page 3 of 12" in its footer is republished without it.

**Tracked changes.** This is the one that costs money. A reviewed document contains both the original and the revision, marked up as insertions and deletions. A converter with no opinion about them will typically hand you the accepted text, which means somebody's deletions are gone and their reasoning with them. Pandoc's `--track-changes` is the only documented control on this page: `accept`, `reject`, or `all` to keep everything wrapped in spans. If a document has been through legal review, convert it with `all` and read the result before you throw the `.docx` away.

**Comments.** Comments are a conversation attached to ranges of text, and Markdown has no anchor to attach them to. Pandoc's manual states that `accept` and `reject` both ignore comments and only `all` includes them. mammoth leaves them out unless you add a `comment-reference` style mapping yourself, which its README documents and almost nobody does. Everything else drops them without mentioning it. The review thread on a document is often the most valuable thing in it, and it is the first thing to go.

**Footnotes and endnotes.** These at least have somewhere to land, but only in some flavours. Footnotes are not in CommonMark and not in the GFM specification, so they exist as extensions — Pandoc's own Markdown dialect has footnote syntax, and a converter targeting strict CommonMark has to inline them, append them as ordinary paragraphs, or drop them. Convert one footnoted document and look at the bottom of the output before you commit.

**Text boxes, shapes and SmartArt.** A text box is not in the flow of the document; it is a drawing object with text inside it. The text can be anywhere in the XML relative to where it appears on the page, and it commonly vanishes entirely. This is the loss people find hardest to believe, because the pull quote was right there on screen. Search the output for a phrase you know was in a text box. If it is missing, it was never in the text.

**Tables beyond a grid.** A simple table converts. A table with merged cells, nested tables, a cell containing a bulleted list, or a header row that spans two columns does not, because Markdown's table syntax is a grid of single cells with no spanning and no block content. Converters flatten what they can and drop the rest, and the result usually looks plausible while being wrong. [Tables are the most common thing to break in either direction](/blog/markdown-tables-that-survive-conversion), and the only reliable check is to count the columns.

**Numbering, and why it depends on one file in the archive.** This deserves its own paragraph because it explains the single most common complaint about `.docx` conversion. A numbered list in Word is a set of paragraphs each carrying a `w:numId` and an indent level; the actual numbering — whether it is decimal or lower-roman or a bullet, where it restarts, how the levels nest — is defined in `numbering.xml`. Read mammoth's source and you can see the consequence directly: a list level is treated as ordered when its `w:numFmt` is anything other than `bullet`, and when the numbering part cannot be found the library falls back to an empty default. With an empty default, the lookup for a paragraph's numbering returns nothing, the paragraph stops matching the rule that would have made it a list item, and it is emitted as an ordinary paragraph.

That is why the same tool converts one document's lists perfectly and reduces another's to plain text. It is not the tool being inconsistent. One archive had a numbering part and the other did not, or referenced numbering definitions it did not contain — which happens to documents assembled by scripts, exported from other applications, or repaired by Word after a crash. If a converted document's lists arrive as paragraphs, unzip the `.docx` and look for `word/numbering.xml` before blaming the converter. And check the nesting on whatever does survive, because [list indentation and line breaks are their own separate trap](/blog/markdown-line-breaks-and-lists) once the Markdown is written.

**Fields, cross-references and a table of contents.** A Word table of contents is a field that Word computes. Converted, it becomes whatever text was cached in the field the last time Word updated it — a snapshot with page numbers in it, pointing at pages that no longer exist. Cross-references go the same way. Delete the converted table of contents and let your Markdown renderer build a new one.

## How to choose

1. **Decide where the file is allowed to go before you pick a tool.** A README can be uploaded to anything. A signed contract, an unreleased financial statement or anything with a patient's name in it cannot, and choosing an online converter for one of those is a disclosure, not a conversion. Browser-side conversion is the only option that keeps the file on the machine, and you can verify it by watching the network tab.
2. **Count the documents.** One file does not justify installing Haskell. Two hundred files do not justify a browser tab and a person clicking in it. The install cost is paid once and the clicking cost is paid every time, which inverts the answer somewhere between five files and fifty.
3. **Establish whether the document has been reviewed.** If it has tracked changes or comments, most tools will quietly resolve them and you will lose the review. Pandoc's `--track-changes=all` is the documented way to keep them, and if you are not using Pandoc you need to accept that the review is gone.
4. **Check the images before you delete the source.** Markdown references images; it does not contain them. A converter that inlines them as data URIs gives you one enormous file, one that extracts them gives you a folder to keep track of, and one that does neither gives you Markdown pointing at nothing. Find out which you have, then keep the `.docx`.
5. **Convert one representative document and read all of it.** Not the first screen. The tables, the numbered lists, the footnotes, the text boxes, and a search for a phrase you know was in a caption. Ten minutes here is worth more than every comparison table including this one, because your documents are not the same as anybody else's.
6. **Assume you will want the original again.** Conversion is one-way for everything in the honest section above. Archive the `.docx` somewhere you can find it, because the day somebody asks what the deleted paragraph said is the day you discover the answer was only ever in the file you threw away.

## Conclusion

There is no lossless way to convert Word to Markdown, and the good tools are the ones that are specific about their losses rather than quiet about them. [The how-to covers the steps and the checklist](/blog/convert-docx-to-markdown) for what to look at in the result. For a single document, the shortest honest path is a converter that runs in your browser, which is what [transformpipe's Word to Markdown conversion](/word-to-markdown) does — free, no install, and signed out the `.docx` never leaves your machine. For a directory of files, images that need extracting or a document that has been through review, install Pandoc and learn `--track-changes` and `--extract-media`; nothing else on this page comes close. For conversion inside your own application, use mammoth, read its `messages` array, and follow its advice about generating HTML first. And whichever you choose, keep the original, because the fonts, the page breaks, the comments and the text box you did not notice are not coming back.

## FAQ

### How do I convert Word to Markdown for free?

Every option on this page except Writage is free. A browser converter is the fastest route for one file and does not require an install; Pandoc is free and GPL licensed for the command line; mammoth and MarkItDown are free libraries. If the document is already in Google Docs, File → Download → Markdown (.md) costs nothing either.

### Can I convert a .docx to Markdown without uploading it?

Yes, and it is worth insisting on for anything confidential. A converter that runs in the browser reads the file with JavaScript on your own machine and never sends it anywhere, which you can confirm by opening the network tab while it converts. Pandoc and mammoth run locally by definition. Google Docs is the exception: it requires uploading the file to Drive first.

### Why did my numbered lists come out as plain paragraphs?

Almost certainly because the `.docx` was missing or misreferencing `numbering.xml`, the part of the archive that defines what each list level looks like. Without it, a converter cannot tell that those paragraphs were list items at all, so it emits them as paragraphs. Unzip the file and look for `word/numbering.xml` before assuming the converter is at fault.

### What happens to tracked changes and comments?

Most converters silently accept the changes and drop the comments, so you get clean text and lose the review. Pandoc is the exception: `--track-changes` takes `accept`, `reject` or `all`, and its manual states that only `all` includes comments. If a document's review history matters, convert with `all` and keep the original regardless.

### Do tables survive a Word to Markdown conversion?

Simple grids do. Merged cells, nested tables, spanning header rows and cells containing lists do not, because Markdown's table syntax has no way to express any of them. Convert a document with your worst table in it and count the columns in the output before deciding the tool works.

### Will images come across?

Not automatically, and not as part of the Markdown, because Markdown only ever references an image file. Pandoc's `--extract-media` writes them to a directory, mammoth can inline them as data URIs or hand them to your own code, and copy-paste loses them entirely. Whatever you use, check the images before deleting the `.docx`.

### Is Pandoc or a browser converter better for converting Word to Markdown?

They answer different questions. Pandoc is better whenever there is more than one file, images to extract, or tracked changes to preserve, and it costs an install and a terminal. A browser converter is better for one document you want converted now without uploading it, and it has no options to learn. Most people need both at different times.
