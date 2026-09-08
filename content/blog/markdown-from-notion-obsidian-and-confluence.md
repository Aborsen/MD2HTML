---
title: Getting Markdown out of the tool it is trapped in
description: Export paths out of Notion, Obsidian, Confluence, Google Docs and Word — what each one produces, what it quietly mangles, and what to check after
date: 2026-07-02
tag: Workflow
keywords: notion export markdown, obsidian export html, confluence markdown, confluence to markdown, google docs to markdown, word to markdown, html to markdown
---

The document exists already: headings, a table, three screenshots, a coloured callout box — inside an application that will not hand you a file. Getting it out is rarely one click, and the click you find loses something you notice a week later.

| Tool | What you get | What tends to break |
| --- | --- | --- |
| Notion | a zip of Markdown files and folders | ids in filenames, flat callouts, CSV databases |
| Obsidian | Markdown already, on disk | wikilinks, embeds, callouts |
| Confluence | PDF or Word per page, HTML per space | macros, attachments behind a login |
| Google Docs | Markdown, or a zip of HTML | comments, suggestions, images |
| Word | a `.docx` | formatting done by hand, not by style |

## Notion: a zip where every filename grows an id

Choose "Markdown & CSV" and Notion builds a zip: one `.md` per page, a folder per page that had children or images, a `.csv` per database. Every name carries a long hexadecimal id: Notion identifies pages by id, and the title is only a label.

Three things to expect:

- **The ids stay.** Rename the files if people will read the names, then fix the links to the old ones.
- **Callouts flatten.** Markdown has no block with an icon and a background colour, so a callout returns as a paragraph with the emoji stranded at the front. Toggles lose their toggling.
- **Databases leave as CSV.** A table view is a separate file, not a Markdown table: rebuilding it is a spreadsheet job, then [a question of whether the pipes survive](/blog/markdown-tables-that-survive-conversion).

Images sit in the page's folder under generated names, reached by percent-encoded relative paths that hold only while the folder travels with the file — the assumption [relative paths make and break](/blog/images-and-links-that-still-work).

## Obsidian: Markdown already, but not the standard dialect

An Obsidian vault is a folder of `.md` files, so there is nothing to extract: getting one to HTML is a conversion job, not an export. The catch is that several things Obsidian understands are its own.

```markdown
[[Meeting notes]]            <!-- wikilink, not standard Markdown -->
![[architecture.png]]        <!-- embed, also not standard -->

> [!warning] Careful
> This is an Obsidian callout.
```

A standard converter prints the wikilink and the embed as literal text, brackets included, and renders the callout as a blockquote with `[!warning]` at the top. Either switch the vault setting so new links are ordinary Markdown links, or find-and-replace before converting.

The properties block at the top is YAML frontmatter: a converter that does not recognise it renders the opening `---` as a horizontal rule and turns the closing one into a heading made from your last metadata line.

Once a note is ordinary Markdown the conversion is dull work: drop it on [transformpipe](https://transformpipe.com) for a preview, an HTML source tab and one self-contained `.html` with inline styles. Several dropped together chain into one document.

## Confluence and Google Docs: storage formats with a converter bolted on

Confluence does not store Markdown: a page is held in Confluence storage format, XHTML-based markup in which macros are `<ac:structured-macro>` elements. A page exports to PDF or Word, a space to HTML; Markdown is not on the menu, so the route to it is one you assemble:

- Export as HTML, then run an HTML-to-Markdown step — pandoc, or a library such as turndown. Macros arrive as whatever HTML they rendered to: an info panel becomes a plain `div`, a page tree or an excerpt leaves links to the live site. [The pandoc comparison](/blog/pandoc-alternatives-for-markdown-to-html) covers when the heavier tool earns its install.
- A Marketplace app that emits Markdown directly: better with macros, one more thing to get approved.

Attachments are the recurring trap: they sit behind `/download/attachments/` URLs that expect a session. A space export packs them into the zip, a copied page does not, so an image that looks right while you are signed in is a broken box to everyone else.

Google Docs to Markdown mostly works: File → Download offers Markdown, and headings, lists, tables, links and emphasis survive. Comments and suggested edits do not, so resolve them first. Nor do images — a single `.md` file has nowhere to put them, so a screenshot-heavy document is better taken out as zipped HTML.

## Word, and everything else through HTML

A `.docx` is a zip of XML, and Word to Markdown through pandoc works about as well as the document deserves. Headings written with Word's heading styles become `#` headings; headings faked with 16pt bold become paragraphs of bold text. Numbered lists split the same way, so fixing the styles in Word beats fixing the Markdown afterwards.

For anything with no converter of its own — an ageing wiki, a CMS, an email — take the tool's HTML output and run an HTML-to-Markdown step; HTML is the format nearly every tool can emit.

## The check before you migrate the rest

- [ ] **Links.** Internal ones first: they still point at the old URLs or at filenames that are gone.
- [ ] **Images.** Open the converted file from somewhere other than the export folder.
- [ ] **Tables.** Merged cells and nested content have no Markdown form; they arrive flattened or missing.
- [ ] **Callouts and panels.** Pick one replacement, a blockquote with a bold lead-in, and use it everywhere.
- [ ] **Code blocks.** Check the language hints came through, and that autocorrect has not put smart quotes in code.

Take the document people ask for most through the whole path, to finished HTML, before moving the rest: it tells you whether the fix is a setting, a find-and-replace or a converter. When the Markdown is clean, [transformpipe](https://transformpipe.com) turns it into a page you can share, and its CLI takes a batch of files in one command, `--merge` chaining them into one.
