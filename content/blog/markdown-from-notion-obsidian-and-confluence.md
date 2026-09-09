---
title: Getting Markdown out of Notion, Obsidian, Confluence and the rest
description: Every export path out of Notion, Obsidian, Confluence, Google Docs and Word — what each one produces, what it quietly mangles, and how to repair it
date: 2026-07-02
tag: Workflow
keywords: notion export markdown, obsidian export html, confluence markdown, confluence to markdown, google docs to markdown, word to markdown, html to markdown, notion to markdown, export confluence page to markdown, evernote export markdown, apple notes export markdown, migrate wiki to markdown
---

The document exists already: headings, a table, three screenshots, a coloured callout box — inside an application that will not hand you a file. Getting it out is rarely one click, and the click you find loses something you notice a week later.

What makes this harder than it looks is that none of these applications store Markdown. They store a tree of typed blocks, or XHTML with macros in it, or a proprietary document model, and the export button is a converter somebody wrote to get from that model to a file format. Every converter drops what its target cannot express. The question is never whether something is lost; it is which thing, and whether you find out now or after you have thrown the source away.

### TL;DR

Notion exports a zip of Markdown and CSV in which every filename and every internal link carries a page id, and callouts, toggles and columns arrive flattened. Obsidian is already Markdown but in its own dialect, so wikilinks, embeds and block references need converting before anything else will read them. Confluence has no Markdown export at all — you take the space HTML export and convert it, losing whatever the macros were doing. Google Docs downloads Markdown directly but cannot carry images or comments in a single file, and Word and everything else route through HTML. At ten pages you repair by hand; at a thousand it becomes a scripted rewriting job, and the rewriting is of filenames, links, attachment paths and anchors, in that order.

| Source | Export path | What you get | What it mangles |
| --- | --- | --- | --- |
| Notion | Export, format "Markdown & CSV" | zip: one `.md` per page, folders, `.csv` per database | ids in every filename and link, callouts, toggles, columns, comments |
| Obsidian | none needed — files on disk | a folder of `.md` and attachments | wikilinks, embeds, block references, callouts, Dataview blocks |
| Confluence Cloud | space export to HTML (space admin) | zip of rendered HTML plus attachments | macros, page hierarchy, comments, heading anchors |
| Confluence page | Export to Word or PDF | one file per page | everything structural; PDF is a dead end |
| Google Docs | File, Download, Markdown | one `.md` file | images, comments, suggestions |
| Google Docs | File, Download, Web Page | zip of HTML plus an images folder | style attributes to strip afterwards |
| Word | the `.docx` itself | a zip of XML you convert | headings faked with bold, list numbering, tracked changes |
| Evernote | export as ENEX or HTML | XML container, or HTML plus a resources folder | note metadata, tasks, formatting done by hand |
| Bear | export as Markdown or Textbundle | Markdown, with assets in the Textbundle case | Bear's own tag syntax reads as headings elsewhere |
| Apple Notes | File, Export as, Markdown | one file per note | attachments, tables, and it is per-note only |
| Roam | export from inside the graph | read the format list in your own graph before planning | block references and queries have no equivalent |

## Notion: a zip where every filename grows an id

Choose "Markdown & CSV" and Notion builds a zip: one `.md` per page, a folder per page that had children or images, a `.csv` per database. Every name carries a long hexadecimal id: Notion identifies pages by id, and the title is only a label.

The export dialog is worth reading rather than clicking past. It offers a format choice — PDF, HTML, or Markdown & CSV — an "Include content" dropdown that can exclude files and images, an "Include subpages" toggle, and a "Create folders for subpages" toggle (checked on notion.com, 9 September 2026). Two more limits from the same page matter before you plan a migration around it: only the current or default view of a database is exported, all views at once is not supported, and a form view cannot be exported at all — you export the table view instead. For a large export Notion may email a download link rather than starting the download, the link expires after seven days, and processing can take up to thirty hours (checked on notion.com, 9 September 2026). That is a scheduling fact, not a footnote: if the plan was "export on Friday afternoon and convert on Friday evening", it may not be the plan.

Three things to expect:

- **The ids stay.** Rename the files if people will read the names, then fix the links to the old ones.
- **Callouts flatten.** Markdown has no block with an icon and a background colour, so a callout returns as a paragraph with the emoji stranded at the front. Toggles lose their toggling.
- **Databases leave as CSV.** A table view is a separate file, not a Markdown table: rebuilding it is a spreadsheet job, then [a question of whether the pipes survive](/blog/markdown-tables-that-survive-conversion).

Images sit in the page's folder under generated names, reached by percent-encoded relative paths that hold only while the folder travels with the file — the assumption [relative paths make and break](/blog/images-and-links-that-still-work).

### What each block type becomes

| In Notion | In the export | Repair |
| --- | --- | --- |
| Callout | paragraph, icon character at the front | one blockquote convention with a bold lead-in |
| Toggle | the summary as a line, the contents as the blocks after it | a `<details>` element, or a heading and plain text |
| Toggle heading | a heading, contents inlined below it | usually correct as it stands |
| Column layout | the columns one after another, in document order | accept the reflow, or rebuild as a table |
| Synced block | its contents, copied into every page that showed it | pick one home for the text and link to it |
| Database, full page | a `.csv` file, plus a `.md` per row that had a page body | rebuild the table, keep the row pages as files |
| Linked database view | nothing useful — the view is a query, not content | recreate it wherever the pages land |
| Inline equation | the LaTeX, delimited | depends entirely on what renders it later |
| Comment | absent | copy anything unresolved into the body first |
| Backlinks panel | absent | it was derived, not stored |

The comment row is the one that catches teams out. Discussion threads are not part of the page content, so an export is the page without the argument that produced it. If decisions live in comments, they go the moment the workspace is archived.

### The id suffix, and why it is not merely ugly

A page called "Meeting notes" comes out as `Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md`, and a link to it from another page is written against that exact filename, percent-encoded for the spaces. The id is the same one that appears in the page's URL in the app, which is the useful part: it gives you a key to map old links to new ones.

```text
Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md    the file
Meeting%20notes%2021f4c8a1b2c34d5e8f90123456789abc.md    the link
meeting-notes.md    what you want
```

Rename the files without rewriting the links and you have a folder of documents that all point at each other and none of which resolve. That is the whole migration problem in miniature, and it is why the rename and the link rewrite have to be one operation over one map, not two passes done on different afternoons.

## Obsidian: Markdown already, but not the standard dialect

An Obsidian vault is a folder of `.md` files, so there is nothing to extract: getting one to HTML is a conversion job, not an export. The catch is that several things Obsidian understands are its own.

```markdown
[[Meeting notes]]            <!-- wikilink, not standard Markdown -->
![[architecture.png]]        <!-- embed, also not standard -->

> [!warning] Careful
> This is an Obsidian callout.
```

A standard converter prints the wikilink and the embed as literal text, brackets included, and renders the callout as a blockquote with `[!warning]` at the top. Either switch the vault setting so new links are ordinary Markdown links, or find-and-replace before converting.

The setting is the "Use [[Wikilinks]]" toggle under Files and links; turning it off makes Obsidian generate standard Markdown links instead (checked on obsidian.md, 9 September 2026). It applies to new links only. Everything already written stays as it was, so a vault that has been going for two years needs the rewrite regardless — the setting stops the problem growing, it does not fix it.

### The dialect, item by item

| Obsidian writes | A standard converter sees | What to do |
| --- | --- | --- |
| `[[Note]]` | the literal text, brackets and all | rewrite to `[Note](note.md)` against a title-to-path map |
| `[[Note\|label]]` | literal text | rewrite to `[label](note.md)` |
| `![[image.png]]` | literal text | rewrite to `![](image.png)` |
| `![[Note]]` | literal text | inline the note, or link it — transclusion has no equivalent |
| `[[Note#Heading]]` | literal text | rewrite to `note.md#heading`, then check the slug rule matches your renderer |
| `[[Note#^block-id]]` | literal text | there is no target to link to; inline the quoted text |
| `^block-id` at the end of a line | a stray caret and word in the output | delete it once nothing references it |
| `> [!note]` callout | a blockquote with `[!note]` in the first line | strip the marker, keep the blockquote |
| a ```` ```dataview ```` block | a code block showing the query | the table it rendered was never in the file |
| `%%comment%%` | the text, visible to the reader | delete before converting |

Block references deserve the emphasis Obsidian's own documentation gives them: they are specific to Obsidian and not part of standard Markdown, so they do not transfer (checked on obsidian.md, 9 September 2026). The same is true of embeds. Both are pointers into a graph, and a folder of files is not a graph.

The Dataview row is the one people misread. A Dataview query is a fenced code block with `dataview` as its info string, and the table you were looking at in Obsidian was generated at display time by a plugin. None of it is in the file. Convert the vault and you get the query text in a code block, correctly, and the reader gets no table at all.

The properties block at the top is YAML frontmatter: a converter that does not recognise it renders the opening `---` as a horizontal rule and turns the closing one into a heading made from your last metadata line.

Once a note is ordinary Markdown the conversion is dull work: drop it on [transformpipe](https://transformpipe.com) for a preview, an HTML source tab and one self-contained `.html` with inline styles. Several dropped together chain into one document.

### Making a vault portable before you need it to be

Four habits keep a vault convertible without changing how you write in it. Turn off wikilinks, so new links are standard. Keep attachments in a folder inside the vault rather than outside it, so the relative paths hold when the folder is copied. Avoid an embed where a link would do, because a link degrades into a link and an embed degrades into brackets. And treat block references as a personal navigation aid rather than as a way of building an argument out of pieces, since they are the one construct with no downgrade path at all.

## Confluence: the storage format is XHTML, so an export is a conversion

Confluence does not store Markdown. A page is held in Confluence storage format, which is XHTML-based — technically XML, since it does not fully comply with XHTML — and Confluence's own constructs live in two namespaces: `ac:` for its elements and `ri:` for resource identifiers. A macro is an `ac:structured-macro`, an image is an `ac:image` wrapping an `ri:attachment`, and a page link is an `ac:link` wrapping an `ri:page` (checked on confluence.atlassian.com, 9 September 2026).

Nothing in that list has a Markdown form. So the route out is one you assemble, and the first decision is which export you are allowed to run.

| Export | Scope | Who can run it | What comes out |
| --- | --- | --- | --- |
| Export to Word | one page | anyone with access | a file Word opens and other editors often do not |
| Export to PDF | one page | anyone with access | a rendered page; comments never included |
| Space export, HTML | whole space | space admin | zip of rendered HTML plus attachments |
| Space export, XML | whole space | space admin | storage format, for restoring into Confluence |
| Space export, CSV | whole space | space admin | content you can view, attachments and comments included by default |
| Space export, PDF | whole space | space admin | one file, no blog posts, no comments |

Every row of that table is from Atlassian's own documentation, exclusions included: page comments are not currently exported during an HTML export, comments are never included in a PDF export, blog posts are left out of a space PDF export as well, and the CSV export takes everything you can view, attachments and comments among it (checked on support.atlassian.com, 9 September 2026). The single-page Word export is also documented as producing a file that only Microsoft Word opens reliably, which rules it out as a scripted input.

That leaves HTML as the only sensible source for a bulk conversion, which makes the job [an HTML to Markdown conversion](/html-to-markdown) with a directory walk in front of it. Two ways to do the conversion step:

- A converter or library over the exported HTML — pandoc, or something like turndown in a script. Macros arrive as whatever HTML they rendered to: an info panel becomes a plain `div`, a page tree or an excerpt leaves links to the live site. [The pandoc comparison](/blog/pandoc-alternatives-for-markdown-to-html) covers when the heavier tool earns its install.
- A Marketplace app that emits Markdown directly: better with macros, one more thing to get approved.

### What the macros become

The rule is simple once you see it. A macro that rendered to static HTML survives as that HTML. A macro that was a live query survives as a snapshot of whatever it happened to show, or as nothing.

| Macro | In the HTML export | After conversion |
| --- | --- | --- |
| Info, note, warning, tip panel | a `div` with a class and an icon | a paragraph; give it a blockquote convention |
| Code block | a `pre` with highlighting markup | a fenced block, usually with the language lost |
| Table of contents | a rendered list of anchor links | a list of links to anchors that no longer exist |
| Page tree, children display | a rendered list of links to the live site | absolute links back into Confluence |
| Excerpt, include | the transcluded text, inlined | text duplicated in every page that included it |
| Jira issue or filter | a snapshot table, or a link | a table frozen on the day you exported |
| Expand | the contents, expanded | plain content, no toggle |
| Attachments macro | a list of links to `/download/attachments/...` | links that need a session |

Attachments are the recurring trap: they sit behind `/download/attachments/` URLs that expect a session. A space export packs them into the zip, a copied page does not, so an image that looks right while you are signed in is a broken box to everyone else.

Two more things the HTML export does not preserve in a form you can use. The page tree is expressed in an index file rather than in the directory layout — the exported filenames are flat and machine-generated, so the hierarchy has to be reconstructed from the index if you want folders. And heading anchors change: Confluence generates ids that include the page title, so every in-page link written against `#PageTitle-Heading` stops resolving the moment your new renderer generates `#heading` instead. Labels are metadata with no Markdown equivalent, and are worth writing into frontmatter during the conversion, because nothing else will carry them.

## Google Docs: two routes out, neither carrying the conversation

Google Docs to Markdown mostly works. File, then Download, offers Markdown (.md) directly, and headings, lists, tables, links and emphasis survive (checked on workspaceupdates.googleblog.com, 9 September 2026). The same update added a preference under Tools, Preferences, Enable Markdown, which turns on Copy as Markdown and Paste from Markdown — useful for a section, not for a document.

Comments and suggested edits do not survive. Nor does an image, because a single `.md` file has nowhere to put one. That gives you a route decision rather than a single answer.

| Route | Keeps | Loses | Use when |
| --- | --- | --- | --- |
| Download as Markdown | headings, lists, tables, links, emphasis | images, comments, suggestions | the document is text, and you want one file |
| Download as Web Page, zipped | images, in a folder beside the HTML | comments, suggestions; adds inline styles to strip | the document has screenshots in it |
| Download as Word, then convert | images, styles, tracked changes as markup | comments, suggestions | you are already converting `.docx` in bulk |

The HTML route is the one to reach for by default when there are pictures. The zip gives you an images folder and an HTML file, and the conversion step drops the class soup and the inline `style` attributes Google puts on every paragraph — which is the point, since none of it means anything in Markdown. [The full walk-through for that conversion](/blog/convert-google-docs-to-markdown) covers the details worth knowing before a batch.

Suggestions are the failure mode with teeth. A document in suggesting mode contains two versions of itself, and the export contains one of them, chosen for you. Accept or reject everything before you export, so the file you convert is the document you think it is. The same goes for comments: if a decision is recorded only in a resolved thread, copy it into the body first or lose it.

## Word: a converter can read structure, not intent

A `.docx` is a zip of XML, and Word to Markdown works about as well as the document deserves. Headings written with Word's heading styles become `#` headings; headings faked with 16pt bold become paragraphs of bold text. Numbered lists split the same way, so fixing the styles in Word beats fixing the Markdown afterwards.

That is worth stating as a rule, because it decides where the work happens. A converter can read structure that was expressed structurally. It cannot read intent. If the document was formatted by eye — bold instead of headings, tabs instead of lists, a blank paragraph instead of a spacing rule — the conversion produces a flat wall of text that is technically faithful and useless, and the cheapest fix is half an hour in Word applying styles before converting anything. [What a `.docx` conversion keeps and what it drops](/blog/convert-docx-to-markdown) goes through the rest: tracked changes, comments, text boxes, footnotes, embedded objects, and the images that come out into a folder beside the file.

## Evernote, Bear, Apple Notes, Roam and everything else

These four come up often enough to name, and each has one route worth knowing. The last entry is the fallback for everything not named anywhere above.

**Evernote.** Select notes or a notebook and export as ENEX, single-page HTML, or multi-page HTML; the export is capped at 100 notes at a time, though a whole notebook can go at once (checked on help.evernote.com, 9 September 2026). ENEX is an XML container that only Evernote and its importers read, so unless you are moving to something that imports ENEX, take the multi-page HTML export: it gives one HTML file per note, a folder of resources shared between them, and an index that links them together. From there it is the same HTML to Markdown step as everything else.

**Bear.** A single note exports as `.txt`, `.md`, `.textbundle`, `.bearnote` or `.rtf`, with HTML, DOCX, PDF, JPG and ePub available to Bear Pro; several notes at once go through File, Export notes on the Mac (checked on bear.app, 9 September 2026). Take Textbundle rather than plain Markdown when the notes have images — a Textbundle is the Markdown and its assets in one package, which is exactly the problem a bare `.md` cannot solve. Bear's tags are written as `#tag` in the body, and a standard converter reads a line beginning with `#` as a heading, so a line of tags needs dealing with before conversion rather than after.

**Apple Notes.** On the Mac, File, Export as offers PDF and Markdown, and the import side accepts TXT, RTF, RTFD, HTML and Evernote's ENEX, with a separate File, Import Markdown (checked on support.apple.com, 9 September 2026). It is per-note: there is no whole-library export, so anything past a few dozen notes means selecting in batches. Attachments are not part of the Markdown export.

**Roam.** Roam is outline-first: every bullet is a block with an id, and both block references and queries are pointers into the graph rather than text in a page. Whatever export format you choose, those two constructs have no Markdown equivalent — a reference must be inlined as its text or dropped, and a query has no result to carry. Read the export menu in your own graph before planning around a format, and plan the reference rewrite either way.

**Everything else.** For a tool with no converter of its own — an ageing wiki, a CMS, a help centre, an email — take whatever HTML it emits and run an HTML to Markdown step, because HTML is the one format nearly everything can produce. When there is no export at all, the browser is the export: save the rendered page, or copy the article region out of it. What you get is the page's whole chrome as well as its content, so the conversion is followed by a pruning step, and the pruning is usually one selector.

## Migrating a thousand pages, where the one-click answer fails

Everything above describes one document. A migration is a different problem, and the honest version of it goes like this.

| Scale | What it actually costs | What to do |
| --- | --- | --- |
| Under 10 pages | an hour, maybe two | fix by hand, in the order a reader will notice |
| 10 to 50 | an afternoon | fix by hand, but keep a list of the repeated defects |
| 50 to 200 | a day of hands, or half a day of script | script the two or three defects that repeat, hand-fix the rest |
| 200 and up | days either way | write the script, and budget for the second run |

The threshold is not lower because the script is not a converter. The conversion is the easy part — one library call per file. The script is a rewriting problem, and it contains four separate rewrites, each of which can be finished and correct while the other three are broken.

**Filenames.** Strip the id suffix, slugify what is left, and resolve the collisions: two pages called "Meeting notes" under different parents are one filename after slugification. Build a map from the old path to the new one and write it to disk, because you will need it three more times, and again in six months when somebody asks where a page went.

**Links.** Every internal link in the export is written against the old filename, percent-encoded. Rewrite each one through the map. Links that pointed at the live application instead — an absolute URL into the workspace or the wiki — are a second set, matched by id or page key rather than by filename, and they are the ones still silently working the day you turn the old system off and silently broken the day after.

**Attachments.** Move them into one assets directory, rewrite the `src` of every image, and deduplicate: the same logo exported into forty page folders is forty files. Names with spaces, accents or emoji characters get normalised here, once, rather than in whichever renderer complains about them first.

**Anchors.** Heading ids are generated by whatever renders the Markdown, and the new rule will not match the old one. In-page links and any table-of-contents block have to be regenerated, not rewritten.

Do all four in one pass over a parsed document rather than with a chain of regular expressions over the raw text. A regex that rewrites `](...)` also rewrites the inside of a fenced code block, and the page where you notice that is the one in the batch that documents the link syntax. Parse, walk the tree, write it back out. Once the tree is right, [running the conversion over the whole directory](/blog/batch-convert-markdown-files) is the short part.

### What to sample before you commit to a script

Pick six pages, not one, and pick them deliberately: the longest page, the most-linked page, the one with the most images, one database or table-heavy page, one that leans on the tool's own constructs — callouts, macros, embeds — and one written by whoever in the team uses the application most unusually. That last one finds more defects than the other five together.

Take all six through the whole path, to finished HTML, and check each against the list below. Whatever fails on the sample is what the script has to handle; whatever the script cannot handle is what somebody fixes by hand, and you now know how many pages that is.

- [ ] **Links.** Internal ones first: they still point at the old URLs or at filenames that are gone.
- [ ] **Images.** Open the converted file from somewhere other than the export folder.
- [ ] **Tables.** Merged cells and nested content have no Markdown form; they arrive flattened or missing.
- [ ] **Callouts and panels.** Pick one replacement, a blockquote with a bold lead-in, and use it everywhere.
- [ ] **Code blocks.** Check the language hints came through, and that autocorrect has not put smart quotes in code.
- [ ] **Anchors.** Click every in-page link, including the ones a contents block generated.
- [ ] **Frontmatter.** Decide what metadata you are keeping before the script runs, not after.
- [ ] **Encoding.** Non-breaking spaces, soft hyphens and smart quotes travel invisibly and break searches and diffs.
- [ ] **Collisions.** Two pages that became one filename are a silent data loss, and the only symptom is a file with the wrong contents in it.

### The order of operations

Run the script into a fresh output directory every time, so a bad run is deleted rather than untangled, and never into the export folder itself. Diff the second run against the first: that diff is the only thing that tells you what your fix changed and what it changed by accident. And decide in advance whether the old system is frozen while the migration runs or whether you accept a delta and re-export the pages that moved — both are workable, and discovering after the fact which one you chose is not.

## How to pick the route out

1. **Export once, and keep the archive.** If you convert in place you cannot re-run the script, and you will re-run the script — probably three times.
2. **Choose the route by what you must keep, not by what is fewest clicks.** If the document has screenshots, the single-file Markdown route was wrong before you started, and no amount of repair afterwards puts the images back.
3. **Prefer the export that packs assets over the one that links them.** A path that needs a session is a working image for you and a broken box for every reader, and you will not notice, because you are signed in.
4. **Decide what replaces each construct before you convert, not after.** One blockquote convention chosen up front beats fifty improvised ones discovered in review, and the second is far more expensive to unpick.
5. **Convert one representative document end to end before the rest.** Taking it all the way to finished HTML tells you whether the fix is a setting, a find-and-replace or a converter — three answers with very different costs.
6. **Count the pages before you write code.** Under about twenty, hands beat a script; over about two hundred, hands are a week you do not get back.
7. **Keep the old-to-new map whatever the scale.** Without it you cannot write a redirect list, and a wiki with no redirects is a wiki in which every bookmark anybody saved is now a 404.

## Conclusion

Every one of these applications will give you something. The skill is knowing which something, and checking it before the source is gone: a Notion zip whose links all point at ids, a vault whose wikilinks nothing else reads, a Confluence space where the macros were the useful part, a Google Doc whose images were never in the file. Take one real document through the whole path first, repair what breaks, and only then decide whether the rest is an afternoon of hands or a script with four rewrites in it. When the Markdown is finally clean, [transformpipe](https://transformpipe.com) turns it into a page you can share, and its CLI takes a batch of files in one command, `--merge` chaining them into one.

## FAQ

### Can I export a Notion page directly as Markdown?

Yes — the export dialog offers Markdown & CSV as a format, and a single page comes out as one `.md` file with its images in a folder beside it. Databases in that export become CSV files rather than Markdown tables, and every filename and internal link carries the page id.

### Why do my Notion filenames have long codes in them?

Because Notion identifies pages by id and the title is only a label, so the export appends the page id to keep names unique. That id is the same one in the page's URL, which makes it a usable key: build a map from id to new filename, then rewrite the links and the filenames in one pass.

### How do I get a Confluence page into Markdown?

There is no Markdown export, so you export HTML and convert it. A whole space exports to zipped HTML if you are a space admin, which is also the only route that packs the attachments; a single page offers only Word and PDF, and PDF is a dead end. Macros come through as whatever HTML they rendered to.

### Do Obsidian notes work in other Markdown tools?

The plain Markdown does. Wikilinks, embeds, block references and callouts do not, because they are Obsidian's own syntax and a standard parser prints them as literal text. Turn off the wikilinks setting so new links are standard, and rewrite the existing ones before you convert.

### Does exporting from Google Docs keep my images and comments?

Images survive the Web Page download, which gives you a zip with an images folder, and do not survive the Markdown download, which is a single file with nowhere to put them. Comments and suggested edits survive neither route, so resolve them and accept or reject every suggestion before exporting.

### What is the fastest way to move a whole wiki to Markdown?

Export once, convert one representative page all the way to finished HTML, and let what breaks on that page tell you whether you need a script. If you do, treat it as a rewriting job over filenames, links, attachment paths and anchors rather than a conversion job, and keep the old-to-new map so you can write redirects.

### Which exports keep comments and discussion?

Almost none. Notion comments are not in the export, Confluence page comments are absent from the HTML export and never in a PDF, and Google Docs comments come out in no download format. If a decision exists only in a comment thread, copy it into the body of the document before you export anything.
