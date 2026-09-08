---
title: "How to Convert Google Docs to Markdown: Every Route and What It Costs"
description: Google Docs exports Markdown itself now. What File to Download to Markdown keeps, when the .docx route is better, and the Docs features Markdown cannot hold
date: 2026-09-04
tag: Converting
keywords: google docs to markdown, convert google doc to markdown, export google docs as markdown, google docs markdown export, docs to markdown add-on, download google doc as md, google doc to markdown with images
---

A Google Doc is not a file. It is a document model living on Google's servers, and every way of getting it onto your disk is an export — a lossy rendering of that model into some other shape. Markdown is the smallest shape on the menu. It has six heading levels, emphasis, lists, links, code and, if you are lucky with the flavour, tables. Everything else in your document has to be dropped, flattened or faked.

Most of the time this is exactly what you want. You wrote the draft where the comments and the collaborators were, and now it needs to live in a repository, a static site or a wiki, as text a diff can read. The friction is that the losses are silent. You download the `.md`, glance at the first screen, see your headings, and only notice three weeks later that the appendix table lost its merged header, that the images are gone, and that the fourteen unresolved comments — the reason anybody cared about this document — never existed in the export at all.

There are five routes out, and they lose different things. The native Markdown export, the `.docx` download converted afterwards, the zipped HTML download, an add-on running inside Docs, and the clipboard. This piece is about which one to use, and about the specific Google Docs features that no route can carry, because Markdown has no syntax for them.

### TL;DR

If the document is text — headings, paragraphs, lists, links, some emphasis — use the native export: **File → Download → Markdown (.md)**, which Google added along with Markdown import, Copy as Markdown and Paste from Markdown (checked on workspaceupdates.googleblog.com, 9 September 2026). If it has images, tables with merged cells, or footnotes you need to keep, download it as **`.docx` and convert that**, or as **zipped HTML**, because both of those carry structure the `.md` export has nowhere to put. Comments, suggestions, page breaks, headers, footers and drawings are not lost by a bad converter — Markdown simply has no syntax for any of them, so resolve the comments and accept the suggestions before you export anything.

## Why getting Markdown out of a Google Doc is fiddlier than it looks

The awkwardness starts with where the content actually lives. A Google Doc's text sits in one place, its comments sit in another, and its suggested edits sit in a third. That is not a metaphor: comments and replies are separate resources in the Drive API, not part of the document body, and each comment is either anchored to a region of a particular revision or unanchored and attached to the file as a whole (checked on developers.google.com, 9 September 2026). Suggestions are stored inside the document but as a parallel layer, which is why reading a document programmatically makes you choose a view mode — the API's `SUGGESTIONS_INLINE` mode is the only one whose indexes you can use for a subsequent edit, and `PREVIEW_SUGGESTIONS_ACCEPTED` hands you the text as it would read if every suggestion were taken (checked on developers.google.com, 9 September 2026).

An export has to pick one layer and throw the others away. It picks the body text. So the review conversation — which is the part of a Google Doc that Word and Markdown and everything else are worst at — is gone before the conversion even begins. No tool on this page can change that, and any tool claiming to keep your comments is either putting them in a separate file or describing something else.

The second problem is that Markdown is not one target. Plain CommonMark has no tables, no strikethrough and no task lists; GitHub Flavored Markdown adds all three; footnotes are in neither specification and exist only as an extension. So "does it keep tables?" is partly a question about the exporter and partly a question about which flavour it writes, and the two get conflated in every comparison you will read. Google's own help page describes the syntax it handles in Docs as headings at six levels, italics, bold, bold-and-italic, strikethrough and links (checked on support.google.com, 9 September 2026) — a short list, and a fair description of the ambitions of the native export.

The third problem is images. A `.md` file is one text file. There is no folder beside it, no archive around it, and Markdown's image syntax is a path or a URL — it holds a reference, never the bytes. Any single-file Markdown export therefore has to either point at somewhere the image still lives, inline it as an encoded blob, or leave a gap. None of those three is what you wanted, which is why the image-heavy document is the case where the native export stops being the right answer. [Relative paths and what breaks when the file moves](/blog/images-and-links-that-still-work) is the general version of this problem, and it applies with full force the moment a Google Doc becomes a `.md` in a repository.

## Quick comparison: the cheat sheet

| Route | Best for | What it keeps | What it drops | Price |
| --- | --- | --- | --- | --- |
| File → Download → Markdown (.md) | A text document, right now | Headings, lists, links, emphasis, strikethrough, simple tables | Images as files, comments, suggestions, page layout | Free with a Google account |
| File → Download → Word (.docx), then convert | Images, complex tables, batches, anything scripted | Whatever the second converter keeps; images as real files | Comments and suggestions still gone | Free; converter may need an install |
| File → Download → Web page (.html, zipped) | Documents where the images matter most | Full HTML structure plus an images folder | Nothing Markdown wanted, but you convert twice | Free with a Google account |
| Docs to Markdown add-on | Converting part of a document | Footnotes, merged table cells, heading structure | Images become path placeholders you must fill | Free, Apache 2.0 |
| Copy as Markdown (right-click) | A few paragraphs | Inline formatting and links | Everything not selected; images | Free, off by default |
| Copy and paste into a Markdown editor | A section, into a tool you already use | Whatever the target editor's paste handler understands | Varies wildly by editor | Free |
| Docs API + Apps Script | Many documents, on a schedule | Anything you write code to keep | Whatever you do not write code to keep | Free; you write it |
| Drive API export to `text/markdown` | Automating the native export | The same as File → Download | The same as File → Download | Free; API quota applies |

## The native Markdown export, and what it actually keeps

Google Docs exports Markdown itself. The path is File → Download → Markdown (.md), and it arrives with three companions: Markdown import, so a `.md` opened through File → Open becomes a Doc; Copy as Markdown on the right-click menu for a selection; and Paste from Markdown for the return trip (checked on support.google.com, 9 September 2026). Import and export are on by default. The copy and paste pair are off by default, and live behind Tools → Preferences → Enable Markdown (checked on workspaceupdates.googleblog.com, 9 September 2026). If Copy as Markdown is not on your context menu, that setting is why.

The same export is available to code. Google Docs files can be exported through the Drive API to nine MIME types — `.docx`, `.odt`, `.rtf`, `.pdf`, `text/plain`, `text/html`, zipped HTML, EPUB and `text/markdown` (checked on developers.google.com, 9 September 2026). That last one is the native export under a different door, which matters if you want the same result without a person clicking a menu.

| Pros | Cons |
| --- | --- |
| No install, no add-on, no third party in the middle | Images are the weak point: a single `.md` has no folder to put them in |
| The whole document in one action | Nothing is selectable — it is the document or nothing |
| Round-trips: import a `.md` back into Docs and it becomes a Doc again | Comments and suggestions are absent, with no warning that they were there |
| Scriptable through the Drive API with the `text/markdown` export type | No options at all: no flavour choice, no image directory, no front matter |
| Free with the account you already have | Page layout, headers, footers and section breaks have nowhere to go |

**Price:** free with a Google account.

**Technical details and features**

- File → Download → Markdown (.md) for the whole document; the file is plain UTF-8 text
- Right-click → Copy as Markdown for a selection, once Tools → Preferences → Enable Markdown is ticked
- Right-click → Paste from Markdown converts Markdown on the clipboard into Docs formatting
- File → Open → Upload, or Drive → Open with → Google Docs, imports a `.md` file as a Doc
- The Drive API exposes the same conversion as the `text/markdown` export MIME type

**Who is it for?** Anybody whose document is genuinely text. A meeting note, a spec, a blog draft, a README that was written in Docs because that is where the reviewers were. If you can scroll the whole document and see nothing but headings, paragraphs, lists, links and the occasional table, this is the route and everything below it is unnecessary work.

## Download as .docx, then convert the .docx

The other route is to let Google produce a `.docx` and hand that to a converter built for the job. It sounds like the long way round and it is frequently better, for one reason: a `.docx` is a zip archive with a `media` folder in it, so the images survive the first leg of the journey as actual files. The second leg then has somewhere to put them.

It also opens the door to every option the native export does not have. Pandoc's `.docx` reader takes `--extract-media` to write the embedded images out to a directory and rewrite the links to match, and `--track-changes` with `accept`, `reject` or `all` to decide what happens to revision marks — the only documented answer to tracked changes on this page. It is free and GPL licensed, written in Haskell, and it needs installing. A browser converter does the same first step with no install: read the `.docx` on your own machine and hand back Markdown, which is what [transformpipe's Word to Markdown conversion](/word-to-markdown) does, and what the [wider field of `.docx` converters](/blog/best-word-to-markdown-converters) does with varying care.

| Pros | Cons |
| --- | --- |
| Images arrive as real files inside the archive, so a converter can extract them | Two conversions instead of one, and two chances to lose something |
| Real options: image extraction, flavour selection, table handling | The `.docx` is an intermediate file you have to keep track of |
| Scriptable and batchable — a directory of `.docx` files is a shell loop | Google's `.docx` writer has its own quirks to inherit |
| Works with the tools your build already has | Comments and suggestions are still gone: Google dropped them at the download |
| Choose your own converter, so you choose its trade-offs | More steps to explain to somebody who just wants the text |

**Price:** free. Pandoc is free and GPL licensed; a browser-side converter costs nothing and needs no install.

**Technical details and features**

- File → Download → Microsoft Word (.docx) produces a standard Office Open XML archive
- Headings survive as paragraphs carrying a `w:pStyle` reference, which is what converters look for
- `pandoc --from docx --to gfm --extract-media=./media report.docx -o report.md` writes the images out beside the text
- `--track-changes=accept` resolves revision marks to the accepted text rather than leaving markup in the prose
- A `.docx` also opens in Word, LibreOffice and anything else, which makes it a useful checkpoint

**Who is it for?** Anybody with images, anybody converting more than one document, and anybody who needs the output to satisfy a specific target — a docs site with a strict image directory, a repository with a linter, a wiki that only takes CommonMark. Also anybody who wants to inspect the intermediate: if the Markdown is wrong, you can open the `.docx` and see whether the problem was Google's export or your converter.

## Download as zipped HTML when the images matter most

File → Download → Web page (.html, zipped) gives you an archive containing the document as HTML and its images as separate files in a folder. This is the highest-fidelity export Google offers of the visible document, and it is the one to reach for when the pictures are the point — a design review, a runbook full of screenshots, a report with charts pasted in.

You then have an HTML to Markdown problem, which is a well-solved one. The [HTML to Markdown converters](/blog/best-html-to-markdown-converters) all handle the structural elements; the work is in throwing away Google's inline styles, which are extensive, and in fixing up the image paths so they point at wherever the images ended up.

| Pros | Cons |
| --- | --- |
| Images come out as files in a folder, named and complete | Google's HTML is heavy with inline styles and generated class names |
| HTML has an element for nearly everything Docs can express | Two conversions, and the second one needs configuring |
| Tables arrive as real `<table>` markup, merged cells included | Image filenames are Google's, not yours, and the paths need rewriting |
| Easy to inspect: open the HTML in a browser and see exactly what you have | The zip is a container to unpack, which is one more step in a script |

**Price:** free with a Google account.

**Technical details and features**

- The archive contains one `.html` file and an images directory
- Available through the Drive API as the zipped-HTML export type as well as from the menu
- Heading elements are real `<h1>`–`<h6>` tags, so heading structure converts cleanly
- Tables are HTML tables, which means `colspan` and `rowspan` survive as far as the HTML — [what happens to them next](/blog/markdown-tables-that-survive-conversion) depends entirely on the Markdown flavour you are writing into
- Style attributes are inline on nearly every element and are safe to discard wholesale

**Who is it for?** Screenshot-heavy documents, and anybody who wants to see what Google thinks the document contains before deciding what to keep. The HTML is verbose and it is honest: what is in the file is what was in the document.

## The routes that are not File → Download

Three ways out that never touch the download menu. They exist because sometimes you want part of a document, or you want it now, or you want it for two hundred documents without a person in the loop.

### Docs to Markdown, the add-on

Docs to Markdown, known by its repository name gd2md-html, is a Google Docs add-on that opens as a sidebar and converts the document — or just the selection — to Markdown or HTML. It is free and Apache 2.0 licensed, installed from the Google Workspace Marketplace, and it asks for two permissions only: access to the current document, and permission to create a sidebar (checked on github.com/evbacher/gd2md-html, 9 September 2026).

It is more careful about document structure than the native export, and unusually honest about its limits. Footnotes convert to standard Markdown footnotes. Tables convert to HTML tables even in the Markdown output, which is how it keeps merged rows and columns; a single-cell table becomes a code block. Images become placeholder paths of the form `images/image1.png`, and the documentation tells you plainly that you must move the images to your server and change the paths — and warns that the order of images in the zip is not always the order they appear in the document, so check every one. Equations raise a red warning suggesting MathJax or LaTeX if your publishing platform supports it. And, as with every `.docx` and Docs converter, headings only convert if they are real heading styles: text that is merely bold and large converts as a normal paragraph.

| Pros | Cons |
| --- | --- |
| Converts a selection, which File → Download cannot | Google Docs only, and you have to install it |
| Footnotes and merged table cells survive | Merged cells survive as HTML inside your Markdown, which not every renderer accepts |
| Warns you about what it could not convert instead of failing quietly | Images are placeholders: you still have to supply the files |
| Free and open source, with a narrow permission scope | One document at a time, in a sidebar |

**Price:** free, Apache 2.0 licensed.

**Who is it for?** People publishing out of Docs regularly, especially into a platform that wants footnotes. Also anybody who needs one section of a long document rather than the whole thing — that alone is a reason to install it.

### Copy and paste, through the HTML clipboard

Copying from a Google Doc puts two things on the clipboard: plain text and an HTML flavour. The HTML flavour carries the structure — headings as heading elements, lists as lists, links as anchors, bold as `<b>` or a style. An editor with a paste handler that reads that flavour and converts it can turn a pasted selection into Markdown without any file leaving anywhere.

This works far better than it should, and it is the fastest route in existence for a few paragraphs. Where it breaks is predictable. Editors differ enormously in what their paste handlers understand: some convert headings, lists and links and drop everything else; some paste the plain-text flavour and lose all structure; some paste raw HTML into your Markdown file. Images never come across as files — at best you get a reference to a Google URL that only works while you are signed in, and at worst nothing. And Google's HTML puts inline styles on almost everything, so a naive handler produces Markdown littered with `<span>` tags.

| Pros | Cons |
| --- | --- |
| Instant, with no download and no install | Behaviour depends entirely on the target editor |
| Keeps inline formatting and links surprisingly well | Images do not come across as files, ever |
| Works on a selection of any size, including one paragraph | Long documents are tedious and easy to get wrong |
| Copy as Markdown does the conversion in Docs itself, if enabled | Google's inline styles leak through weak paste handlers |

**Price:** free. Copy as Markdown needs Tools → Preferences → Enable Markdown ticked first.

**Who is it for?** Anybody moving a section, not a document. If you are pasting more than a few screens' worth, you are doing by hand what File → Download does in one action.

### The Docs and Drive APIs, for many documents

If the answer has to run without a person, there are two levels. The low-effort one is the Drive API's export endpoint with the `text/markdown` MIME type: you get exactly the native export, for any document you can read, in a script. That is enough for most automation, and it inherits every limitation of the native export.

The high-effort one is the Docs API, which hands you the document as structured JSON — a body of structural elements, paragraphs carrying named styles, tables as rows of cells, lists resolved against list properties. You then write the Markdown yourself, which means you decide what a page break becomes, what happens to a smart chip, whether a suggestion is accepted or rejected, and where the images go. It is real work, and it is the only route where the losses are your choices rather than somebody else's defaults.

| Pros | Cons |
| --- | --- |
| Runs on a schedule, over any number of documents | You are writing and maintaining a converter |
| The Docs API exposes suggestion state, so you can choose accept or reject | OAuth scopes, quotas and credentials to manage |
| You control the image strategy completely | Every Docs feature you forget about is a silent bug |
| Comments are reachable through the Drive API, into a separate file | Nothing about this is quick |

**Price:** free; API quotas apply.

**Who is it for?** Teams whose documentation genuinely lives in Docs and has to appear in a repository or a site continuously. If that is a one-off migration of thirty documents, the `.docx` route and a shell loop will beat writing this by a wide margin.

## What Google Docs has and Markdown has no syntax for

This is the part no export can fix, and the part worth reading before you blame a converter. The items below are not conversion failures. They are features with no Markdown equivalent, so every tool either drops them, flattens them into something else, or emits HTML and hopes your renderer allows it.

| Google Docs feature | Nearest Markdown equivalent | What actually happens |
| --- | --- | --- |
| Comments and replies | None | Dropped. They are separate Drive resources, not document content |
| Suggested edits | None | Flattened to one version of the text, usually with suggestions accepted |
| Page breaks | A thematic break, `---` | A horizontal rule on a page that has no pages, or nothing at all |
| Headers and footers | None | Dropped, page numbers included |
| Section breaks and columns | None | Dropped; multi-column text becomes one column in reading order |
| Drawings and inserted charts | An image reference | An image at best, a gap at worst; never editable again |
| Smart chips (people, dates, files) | Plain text or a link | Reduced to their label, or to a link only colleagues can open |
| Equations | None in CommonMark or GFM | Dropped, or emitted as LaTeX if your platform renders it |
| Table of contents | A hand-written list of links | A static snapshot that stops matching the moment you edit a heading |
| Bookmarks and internal links | Heading anchors | Broken unless your renderer's slug rules match the anchors in the export |
| Footnotes | An extension, in no specification | Depends entirely on the tool and the renderer at the other end |
| Fonts, colours, spacing, margins | None | Dropped, which is usually the reason you wanted Markdown |

Three of those deserve saying out loud.

**Comments are the biggest loss and the least visible.** A Google Doc that has been through a real review is half body text and half margin conversation, and the margin conversation is where the decisions were made. Export it and you keep the half a machine can diff. If those threads matter, resolve them first, or copy the ones that matter into the document as text before you export. There is no route on this page that keeps them, and there is no warning when they go.

**Suggestions must be dealt with before you export, not after.** A document in suggesting mode contains two readings of itself. An export picks one — normally the accepted one — and you will not be able to tell from the Markdown which sentences were somebody's proposal and which were agreed. Accept or reject everything, then export. If you cannot, use the `.docx` route with Pandoc's `--track-changes=all`, which at least puts the revision information into the output where you can see it.

**Internal links break in a way you will not notice.** Heading anchors in Markdown are generated by whatever renders the file, using its own slug rules, and those rules differ between GitHub, a static site generator and a browser-side converter. A cross-reference that worked in Docs becomes a link to an anchor that does not exist, and a broken in-page link fails silently: the page just does not move. Check every internal link after a conversion, or drop them and use section titles in the prose instead.

## How to choose

1. **Look at the document before you pick a route.** Scroll it end to end and count images, tables with merged cells, footnotes, and anything drawn rather than typed. Zero of all four means the native export is right and anything else is wasted effort; one or more of them means the `.docx` or zipped-HTML route, because the native export has nowhere to put them.
2. **Deal with the review layer first.** Resolve the comments, accept or reject the suggestions, and take the document out of suggesting mode. Do it after the export and you are reconciling two documents by hand; do it before and the export is simply correct.
3. **Decide where the images will live before you convert.** A Markdown file holds references, not pictures, so you need a directory and a path convention. Pandoc's `--extract-media` picks one for you; the add-on gives you `images/image1.png` placeholders to fill; the native export gives you neither, which is why the image-heavy document goes out as `.docx` or zipped HTML.
4. **Match the flavour to the destination.** If the target renders CommonMark and nothing else, your tables and strikethrough will not appear, no matter how well they converted. Establish what the receiving platform supports, then convert into that, not into whatever the tool writes by default.
5. **Convert one representative document and read all of it.** Not the first screen — the appendix, the tables, the footnotes, the internal links. Ten minutes on the worst document you have tells you more than any comparison, this one included, and it is the only way to catch the things that failed quietly.
6. **Ask whether the document should stay in Docs.** If it is reviewed by people who will never open a pull request, exporting it to Markdown once a month is a treadmill. Convert what needs to live in the repository and leave the rest where the reviewers are.

## Conclusion

Getting Markdown out of Google Docs is now a solved problem for text and an unsolved one for everything else. File → Download → Markdown (.md) is free, native and correct for a document made of headings, paragraphs, lists and links; for images, merged tables and footnotes, download the `.docx` or the zipped HTML and convert that with a tool that has options — Pandoc if you want a script, a browser-side [Word to Markdown conversion](/word-to-markdown) if you want it done now without the file leaving your machine. And treat the comments, suggestions, page breaks, headers, footers and drawings as things you deal with in Docs before you export, because no converter can carry them and the ones that claim to are describing something else. The same warning holds for every hosted editor: [what an export from Notion, Obsidian or Confluence keeps](/blog/markdown-from-notion-obsidian-and-confluence) is the same question with different answers.

## FAQ

### Can Google Docs export Markdown natively?

Yes. File → Download → Markdown (.md) writes a `.md` file, and File → Open imports one back as a Doc; both are on by default (checked on workspaceupdates.googleblog.com, 9 September 2026). Copy as Markdown and Paste from Markdown are also available on the right-click menu, but they are off until you tick Tools → Preferences → Enable Markdown.

### Why are my images missing from the exported Markdown?

Because a `.md` file is a single text file with no folder beside it, and Markdown's image syntax holds a path, not the picture. To get the images as real files, download the document as `.docx` and convert it with something that extracts media, or download it as zipped HTML, which arrives with an images directory in the archive.

### Do comments and suggestions come across?

No, on any route. Comments and replies are stored as separate Drive resources rather than as document content, so an export of the body text cannot include them; suggestions are a parallel layer that the export flattens to one reading. Resolve the comments and accept or reject the suggestions before you export.

### Is it better to download as .docx and convert, or use the Markdown export?

Use the Markdown export for a text document — it is one action and there is no second tool to get wrong. Use the `.docx` route when you need images extracted to a folder, control over the output flavour, tracked changes handled explicitly, or the same conversion repeated over many files in a script.

### How do I convert only part of a Google Doc?

Two ways. Select the text and use Copy as Markdown, having enabled Markdown in Tools → Preferences, then paste it wherever it is going. Or install the Docs to Markdown add-on, which converts a selection from a sidebar — and note its own warning that a table must be selected in full or the add-on will not see the containing table element.

### Why did my headings come out as plain paragraphs?

Because they were never headings. If somebody made a line bold and 18pt instead of applying the Heading 1 style, there is no heading in the document for a converter to find, and the Docs to Markdown add-on says exactly this in its own documentation. Apply real heading styles in Docs, then export again.

### Can I automate Google Docs to Markdown for many documents?

Yes, at two levels of effort. The Drive API can export any Doc directly to the `text/markdown` type, which gives you the native export in a script (checked on developers.google.com, 9 September 2026). For control over images, suggestions and Docs-specific features, read the document through the Docs API as structured JSON and generate the Markdown yourself — considerably more work, and the only route where you choose the losses.
