---
title: "How to Convert DOCX to Markdown: The Browser, Pandoc and mammoth Routes"
description: Convert a .docx to Markdown three ways, learn why the archive decides what survives, and get the checklist for finding what the conversion quietly dropped
date: 2026-09-04
tag: Converting
keywords: docx to markdown, convert docx to markdown, docx to md, pandoc docx to markdown, mammoth docx to markdown, docx to markdown command line, docx to markdown without upload, docx to markdown numbering
---

You have a Word file and you need Markdown. Reasonable first move: open the `.docx` in a text editor and see what you are dealing with. What you get is a screenful of binary rubbish with the letters `PK` at the front and a few recognisable filenames buried in it. Nothing about that screen suggests a document.

That screen is the most useful thing you will see all day, because it tells you what the conversion actually is. A `.docx` is not a file with text in it. It is a zip archive containing a dozen XML files, and the words are in one of them while the meaning of the words is spread across the others. Converting it to Markdown means unzipping the archive, resolving those cross-references, and throwing away everything Markdown has no syntax for.

Which is why the same document converts differently in different tools, and why the failures are so specific. The headings arrive but the numbered list came out as plain paragraphs. The table arrived without its header row. The images are either missing, or present as a single line of base64 forty thousand characters long. The footnotes are simply not there, and nothing told you. Every one of those has a cause you can find in about two minutes once you know where to look.

This is the how-to: what is inside the file, three routes out of it, and then the part most guides skip — how to read the result and work out what it lost.

### TL;DR

For one document, use a converter that runs in the browser: drop the `.docx` in, read the Markdown, no install and nothing uploaded. For more than one document, for images you need on disk, or for a file that has been through review, install **Pandoc** and use `pandoc -f docx -t gfm --wrap=none --extract-media=./media`. For conversion inside your own code, use **mammoth** to produce HTML and a separate HTML to Markdown step after it — that is what mammoth's own authors recommend. Then check three things in the output before you throw the `.docx` away: whether the numbered lists are still lists, where the images went, and whether the footnotes exist at all.

## What a .docx actually is, and why a text editor shows nonsense

A `.docx` is a zip archive in the Office Open XML format, standardised as ECMA-376 and ISO/IEC 29500. Every zip file on earth begins with the two bytes `PK`, the initials of Phil Katz, who wrote the original format — so that is the first thing your text editor shows you, followed by compressed data it has no way to display.

Rename a copy to `.zip`, unzip it, and the document turns into a directory:

```
$ cp report.docx report-copy.zip
$ unzip -l report-copy.zip
  [Content_Types].xml
  _rels/.rels
  word/document.xml
  word/styles.xml
  word/numbering.xml
  word/settings.xml
  word/fontTable.xml
  word/footnotes.xml
  word/media/image1.png
  word/media/image2.jpeg
  word/_rels/document.xml.rels
  docProps/core.xml
  docProps/app.xml
```

The exact list varies, and the variation is the interesting part. `word/numbering.xml` is only there if the document has ever had a list in it. `word/footnotes.xml` is only there if it has footnotes. `word/media/` only exists if there are images. `word/header1.xml` appears if somebody set a running header. An archive missing one of those parts is missing the corresponding feature, and no converter can invent it.

On Windows, PowerShell will not expand an archive whose extension is not `.zip`, so copy it first:

```powershell
Copy-Item report.docx report-copy.zip
Expand-Archive report-copy.zip -DestinationPath .\report-unzipped
```

`word/document.xml` is usually one enormous line, because Word has no reason to make it readable. Pipe it through a formatter before you try:

```
$ xmllint --format report-unzipped/word/document.xml | head -60
```

Now the important bit. In that XML, **meaning is stored by reference**. A heading is not tagged as a heading. It is a paragraph carrying a `w:pStyle` element that names a style, and the definition of that style — over in `styles.xml` — is what says it is Heading 1. A list item is a paragraph carrying a `w:numPr` element with a `w:numId` and a `w:ilvl`, and whether that is a bullet or a decimal number lives in `numbering.xml`. An image is an `r:embed` attribute holding a relationship id, and `word/_rels/document.xml.rels` is what turns that id into `word/media/image1.png`.

So a `.docx` to Markdown converter is a program that does four things in order: unzip the package, walk `document.xml`, resolve each element's references against the other parts, and serialise the result as Markdown. Every difference between tools is a difference in step three or step four. When step three cannot resolve something, the converter has no idea what it was looking at, and what you get is a plain paragraph.

| Part of the archive | What it holds | What breaks without it |
| --- | --- | --- |
| `word/document.xml` | The paragraphs, runs and tables | Nothing converts at all |
| `word/styles.xml` | Named style definitions | Headings arrive as bold paragraphs |
| `word/numbering.xml` | List formats, levels and restarts | Numbered and bulleted lists arrive as paragraphs |
| `word/_rels/document.xml.rels` | Relationship ids to file paths | Images cannot be located |
| `word/media/` | The image files themselves | Image references point at nothing |
| `word/footnotes.xml` | Footnote bodies | Footnote markers with no text, or no footnotes |
| `word/comments.xml` | Review comments | Comments dropped, usually silently |

## Which route for which job

| Route | Best for | Install needed | What it does with images | Price |
| --- | --- | --- | --- | --- |
| Browser converter | One document, now, without uploading it | None | Inlines them, or leaves references | Free |
| Pandoc | Batches, tracked changes, images on disk | Pandoc | `--extract-media` writes them to a folder | Free, GPL |
| mammoth (Node or browser) | Conversion inside your own application | npm | Data URIs by default, or your own callback | Free, BSD-2-Clause |
| mammoth CLI | A one-off with images as files | npm | `--output-dir` writes them beside the HTML | Free, BSD-2-Clause |
| MarkItDown | Feeding text to a pipeline, not a person | Python | Extracted where the format allows | Free, MIT |
| Word, Save as Web Page | A document other converters mangle | Word | Written to a folder beside the HTML | With Word |
| Google Docs export | A document already in Drive | None | Included in the download | Free with an account |
| Copy and paste | A few paragraphs, immediately | None | Lost | Free |
| LibreOffice, headless | Old `.doc`, `.rtf` and odd formats | LibreOffice | Carried into the `.docx` it writes | Free, MPL 2.0 |
| python-docx and your own writer | A house rule no converter implements | Python | Whatever you write | Free, MIT |
| unzip and read the XML | Diagnosing why a conversion failed | None | You are looking at them directly | Free |

Three of those rows are the routes almost everybody actually uses, and the rest of this article is mostly about them. If you want the routes compared as products rather than as procedures — pricing, licences, who each one suits — [the full comparison of Word to Markdown tools](/blog/best-word-to-markdown-converters) covers the ones this page only lists.

## The browser route: drop the file in, read the Markdown

A browser converter reads the `.docx` with JavaScript on your own machine. The archive is unzipped in the page, the XML is walked in the page, and the Markdown appears in the page. Signed out, no part of the file is sent anywhere, and that is checkable rather than a promise: open the network tab, convert, and watch nothing happen.

The procedure is four steps and there is nothing to configure.

1. Open the conversion page.
2. Drop the `.docx` onto it, or pick it from the file dialog.
3. Read the Markdown that appears, and edit it in place if you need to.
4. Download the `.md`, or copy it out.

| Pros | Cons |
| --- | --- |
| No install, no terminal, no account | One document at a time, not a directory |
| Nothing uploaded when you are signed out | The browser does the work, so a very large file is limited by the machine |
| Headings, lists, tables, links, bold and italic come across | No option to extract images to a folder of your choosing |
| The result is editable before you take it away | Tracked changes resolve to accepted text; comments do not come across |

There is a size ceiling worth knowing about in advance, because it is the one thing that will stop you. On transformpipe, conversion itself is capped at 10 MB, and a document you keep in your history is capped at 4 MB, because the function that stores it refuses a larger request body. A `.docx` gets large for one reason — photographs — so if a file is over the line, the answer is usually to check what is in `word/media/` rather than to assume the document is enormous.

Underneath, the browser route is generally mammoth plus an HTML to Markdown step, which is exactly the arrangement mammoth's own documentation recommends. That matters more than it sounds: it means the browser route and the mammoth route below have the same strengths and the same blind spots, and a document that converts badly in one will convert badly in the other.

**Who it is for.** Anybody with one document and a reason not to post it to a stranger's server — a contract, a patient note, an internal report, an unreleased plan. Also anybody who simply wants the Markdown in the next thirty seconds without learning a flag.

## The Pandoc route: one command, and the four flags that matter

Pandoc is a command line document converter written in Haskell that reads and writes around forty formats. Its `.docx` reader is the most configurable one in existence, and it is the only route on this page with a documented answer for tracked changes.

The command in its shortest useful form:

```
$ pandoc -f docx -t gfm --wrap=none -o report.md report.docx
```

That is: read `docx`, write GitHub Flavored Markdown, do not reflow paragraphs, output to `report.md`. Leave `--wrap=none` off and Pandoc will hard-wrap your prose at 72 columns, which produces a diff-hostile file and is the first thing most people want to undo.

With the images extracted:

```
$ pandoc -f docx -t gfm --wrap=none \
    --extract-media=./media \
    -o report.md report.docx
```

And for a document that has been through review:

```
$ pandoc -f docx -t gfm --wrap=none \
    --track-changes=all \
    -o report.md report.docx
```

A whole directory, in bash:

```
$ for f in *.docx; do
    pandoc -f docx -t gfm --wrap=none -o "${f%.docx}.md" "$f"
  done
```

The same thing in PowerShell:

```powershell
Get-ChildItem *.docx | ForEach-Object {
  pandoc -f docx -t gfm --wrap=none -o "$($_.BaseName).md" $_.Name
}
```

| Flag | What it does | Why you want it |
| --- | --- | --- |
| `-t gfm` | Selects GitHub Flavored Markdown as the output | Tables and strikethrough are GFM, not CommonMark. Pandoc's default dialect is its own extended Markdown, which is not the same thing |
| `--wrap=none` | Stops reflowing paragraphs at a column limit | One paragraph per line means readable diffs |
| `--extract-media=DIR` | Writes the embedded images out to a directory | Otherwise the images stay in the archive you are about to stop using |
| `--track-changes=accept\|reject\|all` | Decides what happens to insertions, deletions and comments | `accept` is the default and quietly discards the review; `all` keeps everything wrapped in spans |
| `--markdown-headings=atx` | Forces `#`-style headings | Pandoc's own `markdown` writer uses underlined headings for the first two levels otherwise |

| Pros | Cons |
| --- | --- |
| Scriptable, so two hundred files cost the same effort as one | An install, and a terminal |
| The only documented control over tracked changes and comments | Its default output dialect is not GFM unless you ask |
| Images out to a folder with one flag | Custom Word styles need a mapping you write yourself |
| Reads and writes `.docx`, so round trips are possible | The manual is long and the flags are many |

**Price:** free, GPL licensed.

**Who it is for.** Anybody converting more than one file, anybody who needs the images as files, and anybody holding a document that has been through legal or editorial review. If a `.docx` has tracked changes in it, this is the only route on the page that will not silently resolve them for you.

## The mammoth route: converting a .docx inside your own code

mammoth is a JavaScript library that converts `.docx` to HTML, with builds for Node and for the browser. A great many "Word to Markdown" tools turn out to be mammoth with a second step bolted on, and if you are writing your own converter it is the sensible foundation.

Its distinguishing idea is the style map. Instead of guessing what a paragraph is, mammoth matches Word's named styles to HTML elements, and the mapping is configuration you control:

```js
const mammoth = require("mammoth");
const TurndownService = require("turndown");

const { value: html, messages } = await mammoth.convertToHtml(
  { path: "report.docx" },
  {
    styleMap: [
      "p[style-name='Chapter Title'] => h1:fresh",
      "p[style-name='Section Heading'] => h2:fresh",
      "p[style-name='Intense Quote'] => blockquote:fresh",
    ],
  }
);

const markdown = new TurndownService().turndown(html);

for (const message of messages) {
  console.warn(message.message);
}
```

Two things in that snippet are the whole reason to use the library.

The first is `styleMap`. An organisation with house styles — "Chapter Title" rather than "Heading 1" — will get plain paragraphs from every other tool on this page, because there is no rule anywhere that says a style called "Chapter Title" is a heading. Here you write that rule. The `:fresh` suffix tells mammoth to start a new element rather than merge into the previous one, which is what you want for headings and what you do not want for a style that continues a paragraph.

The second is `messages`. Every mammoth result carries an array of warnings listing the styles it did not recognise and the elements it did not handle. This is the only machine-readable account of what a converter dropped that any route on this page provides. Print it, log it, show it to your users. An unrecognised-style warning is the exact moment to add a line to the style map.

mammoth's README marks its own Markdown writer as deprecated and recommends generating HTML and converting that to Markdown instead. Take the advice — HTML has an element for most things a `.docx` contains, Markdown does not, and going through HTML gives the second step something to work with. The choice of that second library is its own small decision, and [the HTML to Markdown converters worth considering](/blog/best-html-to-markdown-converters) differ mainly in what they do with markup Markdown cannot express.

In the browser, the input is an `ArrayBuffer` rather than a path:

```js
const buffer = await file.arrayBuffer();
const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
```

And from the command line, for a one-off, the package ships a CLI that writes the images out as separate files rather than inlining them:

```
$ npx mammoth report.docx --output-dir=out
```

| Pros | Cons |
| --- | --- |
| Runs in Node and in the browser | Produces HTML; the Markdown step is yours |
| Style maps handle custom Word styles properly | Its own Markdown writer is deprecated by its authors |
| Reports what it could not map, in `messages` | JavaScript only |
| A CLI is included for one-off jobs | No page layout, because HTML has no page |

**Price:** free, BSD-2-Clause licensed.

**Who it is for.** Developers building conversion into an application, and anybody whose documents use house styles rather than Word's built-in ones. In the browser it is effectively the only real option.

## Where the conversion fails, and what it costs

Everything above works. What follows is what happens anyway, because a `.docx` has hundreds of constructs and Markdown has about a dozen. The losses are structural, not bugs, and the useful question is which ones you are agreeing to.

### Numbering only survives when numbering.xml resolves the list

This is the single most common complaint about `.docx` conversion, and it has a precise cause.

A numbered list in Word is a set of paragraphs, each carrying a `w:numPr` with a `w:numId` and a `w:ilvl`. That is all. The paragraph does not know it is numbered, does not know what number it is, and does not know whether it is a bullet or a decimal. All of that lives in `numbering.xml`, where a `w:num` element maps the `w:numId` to an abstract definition, and that definition holds one `w:lvl` per indent level with a `w:numFmt` saying `bullet`, `decimal`, `lowerRoman` and so on.

So a converter meeting a list paragraph has to follow two hops: `w:numId` to the numbering definition, then `w:ilvl` to the level inside it. If either hop fails — the part is absent, or it is present but does not contain the definition being referenced — the converter has nothing to go on. It does not know the paragraph was a list item at all. What it emits is an ordinary paragraph, and it emits it without complaint, because from its point of view nothing went wrong.

Read mammoth's source and the mechanism is visible directly: a level counts as ordered when its number format is anything other than `bullet`, and when the numbering part cannot be found the library falls back to an empty set of definitions. With an empty set, the lookup for a paragraph's numbering returns nothing, the paragraph stops matching the rule that would have made it a list item, and out it goes as prose.

That is why one document's lists convert perfectly and the next document's collapse. It is not the tool being inconsistent. One archive had a usable numbering part and the other did not — which happens to files assembled by scripts, exported from other applications, generated by report tools, or repaired by Word after a crash. Before you blame the converter, unzip the file and look:

```
$ unzip -l report-copy.zip | grep numbering
```

No `word/numbering.xml` in the listing means no route on this page will give you lists, and the fix is upstream: open the document in Word or LibreOffice, apply real list formatting, save, and convert the saved copy. And check the nesting on whatever does survive, because sub-levels flattening into the top level is a separate failure with its own causes — [list indentation and line breaks](/blog/markdown-line-breaks-and-lists) misbehave in Markdown for reasons that have nothing to do with Word.

### Images land as separate files, as base64, or nowhere

Markdown never contains an image. It contains a reference to one — `![caption](path/to/image.png)` — and the file has to exist at that path when something renders the Markdown. A `.docx`, by contrast, contains the actual image bytes inside `word/media/`. Bridging that gap is a decision, and each route makes a different one.

| Route | What you get | What you then have to do |
| --- | --- | --- |
| Pandoc with `--extract-media=./media` | Image files in `./media`, references pointing at them | Keep the folder next to the Markdown, and commit both |
| Pandoc without it | References into a path that does not exist on disk | Re-run with the flag |
| mammoth, default | `<img src="data:image/png;base64,...">` in the HTML | Decide whether you want one huge file or separate ones |
| mammoth with a `convertImage` callback | Whatever you write out | Write the files and return the `src` you want |
| mammoth CLI with `--output-dir` | Images as files beside the HTML | Convert the HTML to Markdown, paths intact |
| Copy and paste | Nothing | Save each image out of Word by hand |

The base64 case surprises people the most. A data URI is legal, self-contained, and renders correctly — and a single photograph becomes a line of Markdown tens of thousands of characters long, which makes the file unreadable in an editor, unreviewable in a diff, and slow in anything that highlights syntax. It is the right answer when the Markdown has to travel alone with no folder beside it, and the wrong answer in a repository.

mammoth's default is the data URI, and overriding it is a documented option rather than a workaround:

```js
const options = {
  convertImage: mammoth.images.imgElement(function (image) {
    return image.read("base64").then(function (data) {
      return { src: "data:" + image.contentType + ";base64," + data };
    });
  }),
};
```

That example reproduces the default; swap the body for code that writes the bytes to a file and returns a relative `src`, and you have images on disk with the paths you chose. Whichever route you take, the images are the part of the conversion most likely to be broken later rather than now, when the Markdown moves and the folder does not — [what actually keeps an image reference working](/blog/images-and-links-that-still-work) is worth reading before you commit a hundred converted files.

### Headings that were never headings

If somebody built their headings by selecting a line, setting it to 18pt and pressing bold, there is no `w:pStyle` to resolve, and no converter can tell that line apart from an emphatic sentence. You will get `**Chapter Two**` as a paragraph, or plain text, depending on the tool.

This is not fixable in the converter, only upstream. Open the document, apply real heading styles from the styles gallery, save, convert again. If the document uses custom named styles instead, mammoth's `styleMap` is the answer and Pandoc needs a style mapping you write yourself. The cost of not fixing it is that your Markdown has no document structure at all — no table of contents, no anchors, no outline — and structure is most of what Markdown is for.

### Tables that lose their header, or their shape

Markdown's table syntax is a grid of single cells, with a header row, no spanning, and no block content. A `.docx` table is a nested structure of rows and cells with merges, vertical alignment, nested tables and paragraphs inside cells.

A plain grid converts fine. Anything else degrades: a merged header cell becomes one cell and the columns shift, a cell containing a bulleted list becomes a cell containing the list's text run together, a nested table is flattened or dropped. Worse, the result usually looks plausible. The failure is not a mess on the page, it is a table that reads correctly and has the wrong data in the wrong column. Count the columns in the output against the columns in Word, on the widest table in the document, before you trust any of them — [tables are the most common thing to break in either direction](/blog/markdown-tables-that-survive-conversion).

Header rows go missing for a specific reason worth knowing: Word marks a header row with a table-row property, and a converter that ignores it produces a table whose first row is an ordinary data row. Markdown requires a header row, so what you get is either a table with the first data row promoted into the header, or a table with an empty header and everything shifted down one.

### Footnotes, comments and text boxes

**Footnotes** live in `word/footnotes.xml` and are referenced from the text by a `w:footnoteReference`. They have somewhere to land only in some flavours: footnotes are in neither the CommonMark nor the GFM specification, so they exist as extensions. Pandoc's own Markdown dialect has footnote syntax; a converter targeting strict CommonMark has to inline them, append them as ordinary paragraphs at the end, or drop them. Scroll to the bottom of the output and look before you assume.

**Comments** are a conversation attached to a range of text, and Markdown has no anchor to attach one to. Pandoc's manual states that `accept` and `reject` both ignore comments and only `--track-changes=all` includes them. mammoth leaves them out unless you add a comment-reference mapping yourself. Everything else drops them without saying so. The review thread is often the most valuable thing in a document and it is the first thing to go.

**Text boxes and shapes** are drawing objects, not part of the document flow. The text inside one can sit almost anywhere in the XML relative to where it appears on the page, and it commonly vanishes. This is the loss people find hardest to believe, because the pull quote was right there on screen. Search the output for a phrase you know was in a text box; if it is missing, it was never in the flow.

And then the things with no Markdown equivalent whatsoever: fonts, point sizes, colours, margins, page size, page breaks, headers, footers and page numbers. Not "poorly supported" — absent from the syntax. A tool that appears to keep them is emitting raw HTML with `style` attributes, which is a different document wearing a Markdown extension.

## The checklist: what to read in the converted file

Do this once, on one representative document, before you convert two hundred. It takes about ten minutes and it is worth more than every comparison table including the one above, because your documents are not the same as anybody else's.

1. **Read the headings as a list.** `grep -n "^#" report.md` gives you the document's outline in one screen. If it is short, headings became paragraphs — look for `**Bold Line**` on its own line, which is what a manually formatted heading turns into.
2. **Find the lists.** Search for lines starting with `1.`, `-` or `*`. If the document had numbered procedures and the output has none, go and check for `word/numbering.xml` before doing anything else.
3. **Check list nesting.** Sub-items should be indented under their parents. Flattened sub-levels are common and change the meaning of a procedure.
4. **Count the columns in the widest table.** Compare against Word. Then check whether the header row is the header row, and not the first data row promoted into it.
5. **Look for the image references.** `grep -n "!\[" report.md` lists them. Then confirm the files exist at those paths, or confirm the data URIs are there — a reference to a file that was never extracted renders as a broken image and nothing warns you.
6. **Scroll to the bottom.** Footnotes and endnotes either appear here, appear inline, or do not appear. Any of those may be acceptable; not knowing which one you got is not.
7. **Search for a phrase you know was in a text box, a caption or a callout.** This is the test for the losses nothing reports.
8. **Search for a phrase you know was deleted during review.** If it is present, tracked changes were kept as text. If a deleted phrase is gone and you needed the history, you converted with the wrong setting.
9. **Look at the top of the file.** Word's field-based table of contents converts to whatever text was cached the last time Word updated it, complete with page numbers pointing at pages that no longer exist. Delete it and let your renderer build a new one.
10. **Open the Markdown in a renderer, not an editor.** The editor shows you the syntax; the renderer shows you what a reader gets. They disagree more often than you would expect.

In PowerShell, the first, second and fifth of those are:

```powershell
Select-String -Path report.md -Pattern '^#'
Select-String -Path report.md -Pattern '^\s*(\d+\.|[-*])\s'
Select-String -Path report.md -Pattern '!\['
```

| Symptom in the output | What actually happened | What to do |
| --- | --- | --- |
| Headings are bold paragraphs | The document had no heading styles, or custom ones | Apply real styles in Word, or write a style map |
| Numbered lists are plain paragraphs | `numbering.xml` missing or unresolvable | Check the archive; re-save from a word processor |
| Sub-items sit at the top level | Indent levels lost or flattened | Fix by hand; there is no flag for it |
| Table header row is a data row | The header-row property was ignored | Fix by hand, or convert via HTML instead |
| Columns do not line up | Merged or nested cells flattened | Restructure the table; Markdown cannot express merges |
| Broken image icons | References extracted, files not | Re-run with `--extract-media` or an output directory |
| One line of the file is 40,000 characters | Images inlined as data URIs | Switch to a route that writes files |
| Footnote text missing | Target flavour has no footnote syntax | Use a flavour that does, or accept inlining |
| Comments gone | Every route except one drops them | `--track-changes=all`, and keep the original |
| A pull quote is missing entirely | It was in a text box | Copy it across by hand |

## How to choose a route

1. **Decide where the file is allowed to go before you pick a tool.** A README can be uploaded to anything. A signed contract, an unreleased result or anything with a person's medical details in it cannot, and choosing a hosted converter for one of those is a disclosure rather than a conversion. Browser-side conversion keeps the file on the machine and you can verify that in the network tab.
2. **Count the documents, then count the clicks.** One file does not justify installing a Haskell binary. Two hundred files do not justify a browser tab and a person clicking in it. The install is paid once; the clicking is paid every time, which flips the answer somewhere between five files and fifty.
3. **Establish whether the document has been reviewed.** Tracked changes and comments are discarded by default almost everywhere. If the review matters, `--track-changes=all` is the documented way to keep it, and if you are not using Pandoc then accept that it is gone rather than discovering it later.
4. **Decide what you want to happen to the images before you convert, not after.** Files in a folder, or base64 inside the Markdown. Both are defensible; neither is what you get by accident, and the accident is usually references pointing at nothing.
5. **Find out whether the document uses real styles.** Open it in Word and click a heading: if the style box says Heading 1, every route will work. If it says Normal, no route will, and the fix is in the document rather than in the tool.
6. **Keep the `.docx`.** Everything in the section above is one-way. Archive the original where you can find it, because the day somebody asks what the deleted paragraph said is the day you learn the answer was only ever in the file you deleted.

## Conclusion

Converting a `.docx` to Markdown is not translation, it is triage. If the document lives in Google Docs rather than on disk, [that export has its own answer](/blog/convert-google-docs-to-markdown). The work is triage: unzip the archive, resolve what can be resolved, and accept the loss of everything Markdown has no syntax for. Knowing that the archive is where the answers live turns almost every mysterious failure into a two-minute check — no `numbering.xml`, no lists; no heading styles, no headings; no `--extract-media`, no images. For a single document, the shortest honest path is a converter that runs in your browser, which is what [transformpipe's Word to Markdown conversion](/word-to-markdown) does, free, with no install and nothing uploaded when you are signed out. For a directory, for images on disk or for a reviewed document, install Pandoc. For conversion inside your own code, use mammoth, read its `messages`, and convert its HTML rather than its Markdown. Then run the checklist, because the losses that matter are the quiet ones — and [an inventory of every one of them, with a verdict on which to mourn and which to be glad of](/blog/what-not-to-keep-from-a-docx) is the thing to read before you decide any of it was worth keeping.

## FAQ

### How do I convert a .docx to Markdown without installing anything?

Use a converter that runs in the browser: it unzips and reads the archive with JavaScript on your own machine, so there is nothing to install and, signed out, nothing to upload. Confirm that last part by opening the network tab while it converts. The other no-install route is copy and paste, which carries headings, lists and links through the HTML clipboard but loses every image.

### Why did my numbered lists come out as plain paragraphs?

Because the two-hop lookup into `numbering.xml` failed. A list paragraph in Word only carries a numbering id and an indent level; the format lives in that separate part of the archive, and if it is missing or references definitions it does not contain, the converter cannot tell the paragraph was ever a list item. Unzip the `.docx` and check for `word/numbering.xml` before blaming the tool.

### What is the best command for converting docx to Markdown?

`pandoc -f docx -t gfm --wrap=none --extract-media=./media -o out.md in.docx` covers most cases: GitHub Flavored Markdown so tables survive, no paragraph reflowing so diffs stay readable, and images written to a folder rather than left in the archive. Add `--track-changes=all` if the document has been through review.

### Can I convert a .doc rather than a .docx?

Not directly with any of these routes — the old binary `.doc` is a completely different format with no zip and no XML. Convert it first with LibreOffice in headless mode, `soffice --headless --convert-to docx old.doc`, then convert the `.docx` that produces. Expect the first step to be where the surprises are, since it is a full conversion of its own.

### Will the images come across automatically?

No, because Markdown only ever references an image file rather than containing one. Pandoc's `--extract-media` writes them to a directory, mammoth inlines them as data URIs by default or hands them to a callback you write, and copy and paste loses them entirely. Check the images before you delete the source document.

### Why do the headings work in one document and not another?

Because heading-ness is stored as a style reference, not as a property of the text. A document whose headings came from the styles gallery converts cleanly; a document whose headings are 18pt bold text has no style reference to resolve, so there is nothing for a converter to find. The tool is behaving identically in both cases — the documents are different.

### Is going through HTML better than converting straight to Markdown?

Usually, yes, and it is what mammoth's authors recommend. HTML has an element for nearly everything a `.docx` contains, so the first step loses almost nothing, and the second step then makes one clear decision about what Markdown cannot express. Converting in a single hop means those decisions are taken silently, deep inside the reader, where you cannot see or change them.
