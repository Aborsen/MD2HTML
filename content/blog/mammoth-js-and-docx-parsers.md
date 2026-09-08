---
title: "DOCX to HTML in JavaScript: mammoth, docx4js and the Other Parsers"
description: Read a .docx in code with mammoth's style maps and messages array, handle images as base64 or files, and learn where docx4js, docxtemplater and Pandoc fit
date: 2026-08-20
tag: Code
keywords: docx to html javascript, mammoth js, mammoth docx to html, read docx in node, docx parser javascript, docx4js, docxtemplater, docx to html browser, python-docx
---

You have a `.docx` and code that needs HTML. On npm there are perhaps a dozen packages whose names contain "docx", and three of the most popular do a completely different job from the one you want. One generates Word files from scratch. One fills placeholders in a template. One renders a document to look like a printed page. Only some of them read an existing file and give you markup.

The search term is "docx to html javascript" and the honest answer is short: in JavaScript, that job is mammoth's. What takes longer to explain is why mammoth's output is so much cleaner than you expect, why it silently omits things you were sure were in the document, and why those two facts are the same fact.

The friction is not installing a library. It is that a `.docx` stores meaning by reference across a dozen XML files, and every parser has to decide which of those references it will follow and which it will ignore. A parser that follows all of them produces HTML full of inline spans that reproduces the page and tells you nothing. A parser that follows a few produces clean semantic HTML and quietly drops the rest. There is no third option, and knowing which one you have chosen is most of the work.

### TL;DR

For reading a `.docx` and getting HTML in JavaScript, use **mammoth** — BSD-2-Clause, runs in Node and in the browser via the `mammoth.browser.js` build, and driven by a **style map** that translates Word's named styles into HTML elements rather than trying to reproduce formatting. Read the `messages` array on every result: it is the only machine-readable list of what the converter could not map. Decide about images explicitly, because the default is inline base64 data URIs and `convertImage` is how you change that. And if the lists come out as paragraphs, the cause is almost always `numbering.xml` — the file that defines them either is not in the archive or does not resolve.

## What a .docx is to a program that has to read one

A `.docx` is a zip archive of XML parts in the Office Open XML format. [How to get inside one and what each part holds](/blog/convert-docx-to-markdown) is worth reading if you have never unzipped one, and the rest of this article assumes you have. What matters here is the shape of the data once you are past the zip, because that shape is what every library on this page is reacting to.

The document body is a sequence of `w:p` paragraph elements. Each paragraph contains `w:r` run elements. Each run contains a `w:t` text element. So the sentence "the quarterly report is late" is not stored as a string. It is stored as some number of runs, and how many depends on facts about the document you cannot predict.

That is the first thing that surprises people who try to parse the XML themselves. Word splits runs at every change of formatting, which is reasonable, and also at revision boundaries, spell-check state and various internal bookkeeping, which is not. A single word can be three runs. The word "quarterly" can be `qua` + `rter` + `ly` because somebody edited the middle of it in 2019. Any approach based on searching `document.xml` for a phrase fails on real documents, and it fails intermittently, which is worse.

The second surprise is that whitespace is conditional. A `w:t` element drops leading and trailing whitespace unless it carries `xml:space="preserve"`. Join runs naively and you get "thequarterlyreport". Join them with spaces and you get "qua rter ly".

The third surprise, and the one that decides everything downstream, is indirection. Almost nothing in `document.xml` says what it is:

| What you see in `document.xml` | Where the meaning lives | What you need to follow |
| --- | --- | --- |
| `w:pStyle` naming a style | `styles.xml` | The style definition, plus its `w:basedOn` chain |
| `w:numPr` with `w:numId` and `w:ilvl` | `numbering.xml` | `w:num` to `w:abstractNumId` to `w:abstractNum` to the right `w:lvl` |
| `w:drawing` with an `r:embed` id | `word/_rels/document.xml.rels` | Relationship id to a path under `word/media/` |
| `w:hyperlink` with an `r:id` | the same rels part | Relationship id to a URL |
| `w:footnoteReference` with an id | `footnotes.xml` | The footnote body by id |
| `w:commentRangeStart` and a reference | `comments.xml` | The comment text, author and date |

A heading is a paragraph whose style resolves, two files away, to something called Heading 1. A bullet is a paragraph whose `w:numId` resolves, through two levels of indirection, to an abstract numbering definition whose level zero has a `w:numFmt` of `bullet`. An image is a relationship id. Nothing is self-describing.

And there is a layer above all of that. Content controls — `w:sdt` elements — wrap arbitrary content, so paragraphs are not always direct children of `w:body`. Tables nest, and cells merge through `w:gridSpan` and `w:vMerge` rather than through anything resembling `colspan`. Images come as `w:drawing` in DrawingML if they were inserted this decade and as `w:pict` in legacy VML if they came from an older file or a paste. Tracked insertions are ordinary runs wrapped in `w:ins`; tracked deletions hide their text in `w:delText` instead of `w:t`, which means a reader that only looks at `w:t` silently accepts every pending edit as final.

So writing your own parser is not a weekend. Unzipping with fflate and walking XML is the easy quarter of the job. The other three quarters are the reference resolution, and that is what you are choosing a library for.

## Quick comparison: the cheat sheet

| Library | Language | Reads or writes | Output | Licence |
| --- | --- | --- | --- | --- |
| mammoth | JavaScript (Node + browser) | Reads `.docx` | Semantic HTML, driven by a style map | Free, BSD-2-Clause |
| docx-preview | JavaScript (browser) | Reads `.docx` | HTML that imitates the printed page | Free, Apache-2.0 |
| docx4js | JavaScript | Reads `.docx`, `.pptx` | Whatever your visitor functions build | Free, MIT |
| docxtemplater | JavaScript | Writes from a `.docx` template | A new `.docx` with placeholders filled | Free, MIT or GPL-3.0; paid modules |
| docx (dolanmiu) | JavaScript / TypeScript | Generates `.docx` | A Word file from a declarative tree | Free, MIT |
| python-docx | Python | Reads and writes | An object model you traverse yourself | Free, MIT |
| Pandoc as a subprocess | Any (shells out) | Reads `.docx` | HTML, Markdown, dozens of other formats | Free, GPL |
| LibreOffice headless | Any (shells out) | Reads `.doc`, `.docx`, more | HTML, or a cleaner `.docx` | Free, MPL-2.0 |
| Roll your own on fflate or JSZip | Any | Reads whatever you implement | Exactly what you write | Your time |

The column that matters most is the third one. Half the confusion in this area comes from reaching for a writing library to do a reading job, because the package name did not distinguish them.

## mammoth and the style-map philosophy

mammoth converts `.docx` to HTML. It is not trying to reproduce your document. Its stated aim is to produce simple, clean HTML by using the semantic information in the file — the named styles — and ignoring the rest.

That single decision explains everything people like and everything people complain about.

Consider a paragraph in Word that is 16pt, bold, dark blue and centred, with 12pt of space above it. A fidelity-first converter emits a `div` with six inline styles. mammoth asks a different question: what style is this paragraph? If the answer is Heading 2, it emits `<h2>`. If the answer is Normal, it emits `<p>` and throws away the bold, the blue, the centring and the spacing, because none of those things are what the paragraph *is*. They are how it looked.

```js
const mammoth = require("mammoth");

const result = await mammoth.convertToHtml(
  { path: "quarterly.docx" },
  {
    styleMap: [
      "p[style-name='Report Title'] => h1:fresh",
      "p[style-name='Report Subhead'] => h2:fresh",
      "p[style-name='Callout'] => aside.callout:fresh",
      "p[style-name='Code Sample'] => pre:separator('\\n')",
      "highlight[color='yellow'] => mark",
      "u => em",
      "comment-reference => sup",
    ],
    includeDefaultStyleMap: true,
  }
);

console.log(result.value);
```

Six things in that snippet are worth spelling out.

**The matcher is a style name, in quotes.** `p[style-name='Report Title']` matches paragraphs whose style is named exactly that. Style names are what the user sees in Word's styles gallery. mammoth also lets you match on the style **id** with dot syntax — `p.ReportTitle` — which is more stable, because ids do not change when the document is opened in a different language version of Word while names sometimes do.

**`:fresh` is not decoration.** Without it, mammoth will merge consecutive matching paragraphs into one element. That is correct for a `pre` block and wrong for a heading. `:fresh` means start a new element every time. Forgetting it on a heading mapping produces one enormous `h2` containing three headings, and it is the single most common style-map mistake.

**`:separator()` handles the opposite case.** When you *do* want consecutive paragraphs collapsed into one element, `pre:separator('\n')` puts a newline between them instead of gluing the text together. This is how a multi-paragraph code sample in Word becomes one usable `pre`.

**Run-level matchers exist too.** The documented ones include `b`, `i`, `u`, `strike`, `all-caps`, `small-caps` and `highlight`, and `highlight` takes an optional colour: `highlight[color='yellow'] => mark`. That is how a document where the reviewer highlighted the open questions turns into markup you can actually query.

**`comment-reference` is a matcher.** Comments are supported, and mapping `comment-reference => sup` is how the reference marks reach the output. Without a mapping for it, review comments are among the things that quietly do not appear.

**`includeDefaultStyleMap` decides whether you are extending or replacing.** It defaults to true, so your rules are added to mammoth's built-in map rather than replacing it, and yours take priority. Set it to false only when you want total control and are prepared to map Heading 1 yourself.

There is a further option, `includeEmbeddedStyleMap`, and a corresponding `mammoth.embedStyleMap(input, styleMap)` function that writes a style map **into** a copy of the `.docx`. When mammoth later reads that file, it uses the embedded map. For a team that hands you documents built on house styles, that is a genuinely good idea: the mapping travels with the template rather than living in your code, and the person who renames a style is the person holding the file that describes it.

### The browser build

mammoth ships a standalone browser build, `mammoth.browser.js`, with its dependencies included, and the repository has a working example in `browser-demo/index.html`. The only API difference is the input: instead of a path, you hand it an `arrayBuffer`.

```html
<input type="file" id="docx" accept=".docx">
<div id="out"></div>
<script src="mammoth.browser.js"></script>
<script>
  document.getElementById("docx").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    document.getElementById("out").innerHTML = result.value;
    result.messages.forEach((m) => console.warn(m.type + ": " + m.message));
  });
</script>
```

That is the entire mechanism behind every in-browser Word converter you have used, including the one on this site. The file is read by the page, converted on the machine, and never posted anywhere — which is a property you can verify with the network tab open rather than a promise you have to accept.

One caveat on that snippet, and it is not a small one: `innerHTML` with markup derived from a file somebody sent you is a decision, not a default. mammoth's output is generated from the document's structure, so it is far narrower than arbitrary HTML, but a `.docx` can carry a hyperlink whose target is a `javascript:` URL, and a converter that faithfully reproduces the link will faithfully reproduce that. If the file did not come from you, [sanitise before it reaches the DOM](/blog/sanitising-markdown-safely).

Related, and worth knowing before you deploy: mammoth documents an `externalFileAccess` option, and access to external files is **disabled by default**, to be enabled only for documents you trust. A `.docx` can reference content outside itself. The library's default is the safe one; leave it there unless you have a specific reason.

### mammoth in one table

| Pros | Cons |
| --- | --- |
| Output is semantic HTML you would have written by hand | Discards direct formatting on purpose, including colour, size and alignment |
| Style maps handle house styles that no other tool knows about | You have to write those maps; nothing infers them |
| Runs unchanged in Node and in the browser | JavaScript only |
| Reports unmapped styles in a `messages` array | Its own Markdown writer is deprecated by its author |
| Images are configurable, not fixed | No page geometry, because HTML has no pages |
| A CLI is included for one-off jobs | Text boxes, fields and layout constructs land unevenly |

**Price:** free, BSD-2-Clause licensed.

**Who it is for.** Anyone whose next step is HTML on a page or in an editor, and anyone converting documents produced from a known template. It is the right default in the browser because there is no serious competition there for semantic output.

## Images and messages: the two parts of the result you must handle

Every mammoth call returns an object with two properties, and most tutorials use one of them.

### Images: inline base64, a callback, or files on disk

By default, images are included inline in the output HTML. Concretely, that means `mammoth.images.dataUri` runs and each image becomes an `<img>` whose `src` is a base64 data URI. For a document with two logos this is invisible and convenient. For a document with forty screenshots it produces an HTML file several times the size of the original `.docx`, and base64 encoding adds roughly a third on top of the raw bytes before any of that is stored or transmitted.

The `convertImage` option is how you change it, and `mammoth.images.imgElement` is the helper that wraps your function:

```js
const path = require("node:path");
const fs = require("node:fs/promises");

let index = 0;

const result = await mammoth.convertToHtml(
  { path: "quarterly.docx" },
  {
    convertImage: mammoth.images.imgElement(async (image) => {
      const extension = image.contentType.split("/")[1];
      const name = `image-${index++}.${extension}`;
      const buffer = await image.readAsBuffer();
      await fs.writeFile(path.join("media", name), buffer);
      return { src: `/media/${name}`, alt: image.altText ?? "" };
    }),
  }
);
```

The image object mammoth hands you exposes `contentType` — `image/png`, `image/jpeg` and so on — and read methods for each environment: `readAsArrayBuffer()`, `readAsBuffer()` and `readAsBase64String()`. There is also an older `read([encoding])` method that the documentation marks deprecated; use the explicit three.

Which route you want follows from where the HTML is going:

| Destination | Route | Why |
| --- | --- | --- |
| One self-contained file to email | Default data URIs | The file opens with the network off |
| A page on a site | `convertImage` writing files | The browser caches images separately from markup |
| A CMS or an editor | `convertImage` uploading, returning the CDN URL | The images belong to the CMS, not the markup |
| A one-off from the terminal | The CLI with `--output-dir` | It writes the images out as separate files for you |

Two details bite people. The first is that `image.contentType` is not a file extension, and splitting on the slash is a shortcut that produces `.jpeg` and `.svg+xml`; map it properly if the filenames matter. The second is that alt text in Word lives in a description field most authors never fill in, so `alt` is frequently empty and the accessibility problem in your output is inherited, not introduced.

### The messages array: the only record of what was dropped

The second property on the result is `messages`, an array of objects with `type` — "warning" or "error" — a `message` string, and an optional `error` holding the thrown exception when there was one.

This is the most under-used API in the entire category. No other converter in common use tells you what it could not handle. Pandoc does not enumerate what it silently normalised. A copy-and-paste conversion tells you nothing by definition. mammoth hands you a list.

```js
const { value, messages } = await mammoth.convertToHtml({ path: file });

const unmapped = messages.filter((m) => m.type === "warning");

if (unmapped.length) {
  console.warn(`${unmapped.length} things were not mapped:`);
  for (const m of unmapped) console.warn("  " + m.message);
}
```

An unrecognised-style warning is an instruction, not a complaint. It is naming a style that exists in the document and has no rule in your map, which means those paragraphs came out as plain `p` elements. Add a line to the style map and the warning disappears along with the defect. Run it across a corpus of real documents and the warnings become a to-do list ordered by frequency.

The operational advice is blunt: surface them. Log them in a build, show them in a UI, fail a CI job when a new one appears. A conversion pipeline that throws away `messages` is a pipeline that cannot tell a clean conversion from a broken one, and neither can you.

## numbering.xml decides whether the lists survive at all

The most reported failure in this category is a numbered list arriving as a run of plain paragraphs, and the diagnosis is nearly always the same.

A list item in `document.xml` looks like this — a paragraph with numbering properties and no other clue about its nature:

```xml
<w:p>
  <w:pPr>
    <w:numPr>
      <w:ilvl w:val="0"/>
      <w:numId w:val="4"/>
    </w:numPr>
  </w:pPr>
  <w:r><w:t>Approve the budget</w:t></w:r>
</w:p>
```

`w:ilvl` is the indent level. `w:numId` points at a `w:num` element in `numbering.xml`, which points at a `w:abstractNumId`, which identifies a `w:abstractNum` element, which contains a `w:lvl` for each level, and *that* is where `w:numFmt` finally says `bullet`, or `decimal`, or `lowerLetter`, or `upperRoman`. Only at the end of that chain does anyone know whether the paragraph belongs in a `ul` or an `ol`.

Every link in the chain is a place it can break:

| Failure | Cause | What you see |
| --- | --- | --- |
| `numbering.xml` is absent | The document never contained a real list | Paragraphs beginning with typed "1." characters |
| `numId` resolves to nothing | The part was stripped, or the document is malformed | Paragraphs, no list markup |
| The author typed the numbers | Manual "1.", "2.", "3." with no `w:numPr` at all | Paragraphs whose text starts with digits |
| The list is a style, not numbering | A "List Paragraph" style with indentation but no `numPr` | Indented paragraphs |
| Level restarts and `lvlOverride` | Word can restart numbering mid-document | Correct list markup, wrong visible numbers |
| Custom `lvlText` | Formats like "Article 1.2 —" | An `ol` that renumbers from 1 in the browser |

The last two are the honest limit rather than a bug. HTML's `ol` has a `start` attribute and nothing else. It cannot express "restart at 1 for each level-two group but continue the level-one sequence", and it has no equivalent of a custom level format string. A converter that gets the structure right will still lose the visible numbers when the document used Word's numbering as a legal-citation system. If your document does that, the numbers are content and you should consider putting them in the text.

Note also what the style map does and does not reach. mammoth's documented matchers cover paragraphs and their styles, runs and their properties, tables and comment references. List handling is built into the converter rather than something you configure with a rule, so the fix for a broken list is a fix to the document — apply a real list style — not a line in your map. That distinction saves an afternoon.

The same chain explains why [tables and lists behave so differently on the way out](/blog/markdown-tables-that-survive-conversion): a table's structure is right there in `document.xml` as nested elements, while a list's structure is a foreign key.

## The other libraries, and the different jobs they do

### docx-preview — fidelity instead of semantics

docx-preview, from the docxjs repository, is the opposite bet to mammoth. Its aim is to render a `.docx` into HTML that looks like the document, keeping the HTML as semantic as it can while accepting that the priority is appearance. The main entry point is `renderAsync()`, which takes the document as a blob and a target element and resolves when rendering is finished. `parseAsync()` and `renderDocument()` are available for the two halves separately.

Its options are the tell: `breakPages`, `ignoreWidth`, `ignoreHeight`, `renderHeaders`, `renderFooters`, `renderComments`, `useBase64URL`, `debug`. Those are the concerns of something drawing a page — headers, footers, page breaks, physical dimensions — none of which mammoth has an opinion about, because a heading has no height.

| Pros | Cons |
| --- | --- |
| The output resembles the document, headers and page breaks included | The markup is presentational; it is not content you would store |
| Renders comments, headers and footers | Browser-oriented; not a Node conversion step |
| Options to ignore page geometry when you want it to reflow | The library warns its internals may change; only `renderAsync` is treated as stable |
| No server round trip for a preview | Not a route to Markdown or to clean HTML |

**Price:** free, Apache-2.0 licensed.

**Who it is for.** A viewer. If the user needs to *see* the Word file in your app before deciding something, this is the library. If you need to *store* what the file says, it is the wrong one — the markup is a rendering, not a document.

### docx4js — a parser you drive yourself

docx4js parses Office files — `.docx` primarily, `.pptx` since version 3.1.30, with `.xlsx` still limited (both noted in its README, checked on github.com/lalalic/docx4js, 8 September 2026) — and hands the traversal to you. Rather than building a full tree in memory, it walks the document, recognises Office XML models and calls your visitors, which keeps memory use down on large files. Rendering happens through a `createElement` function you supply, so the output format is entirely your decision.

Its identified models cover a wide surface: sections, headers, footers, paragraphs, tables, shapes, images, hyperlinks, content controls including checkboxes and dropdowns, fields, equations, bookmarks and charts.

| Pros | Cons |
| --- | --- |
| Recognises constructs mammoth ignores — fields, equations, charts, form controls | You write the output layer; there is no HTML converter included |
| Streaming-style visitors rather than a full parsed tree | Steeper start than a one-line `convertToHtml` |
| Also reads `.pptx` | Documentation is thin next to mammoth's |
| MIT licensed | The 2.x and 3.x lines carry breaking changes |

**Price:** free, MIT licensed.

**Who it is for.** Anyone whose requirement is not HTML. Extracting every content control's value, pulling the charts out of a hundred reports, building a custom renderer for a specific template — these are docx4js jobs, and using mammoth for them means fighting a library designed to throw that material away.

### docxtemplater — a different job entirely

docxtemplater comes up in every search for docx libraries and it does not read documents in the sense you mean. It is a template engine that **generates** `.docx`, `.pptx` and `.xlsx` by taking a Word file containing placeholders such as `{first_name}` and replacing them with your data. The flow is: read the template file, load it into PizZip, construct a `Docxtemplater`, `render()` with your data, and write the buffer out.

Its own documentation is explicit that both docxtemplater and PizZip come from the same team, and that additional capability arrives through paid modules — an image module for `{%image}`, an HTML module for inserting formatted text into a `.docx`, plus chart, XLSX, styling, footnotes, table, QR code and error-location modules among others.

| Pros | Cons |
| --- | --- |
| The right tool for producing Word files from data and a designed template | Does not convert an existing document to anything |
| Preserves the template's styling exactly, because the template *is* a `.docx` | Core is free; several capabilities live behind paid modules |
| Dual-licensed MIT or GPL-3.0 | The template has to be authored for it |
| Long-maintained, with the author describing it as his main work | Placeholders inside Word can be split across runs, which is its own class of bug |

**Price:** free, dual-licensed under MIT or GPL version 3. Paid modules are priced separately by the vendor; check their own page for current figures.

**Who it is for.** Contracts, invoices, certificates, offer letters — anything where a human designed the layout in Word and a program supplies the values. Nobody converting a document to HTML needs it, and a surprising number of people install it before realising that.

That run-splitting footnote is not a dig. It is the same fact from the first section, seen from the writing side: `{first_name}` can be stored as `{first_` + `name}` across two runs because of an edit made months ago, and every docx template engine has to deal with it.

### docx by dolanmiu — generation, declaratively

The npm package literally named `docx` generates and modifies `.docx` files from a declarative TypeScript API — `Document`, `Paragraph`, `TextRun`, `Table`, headers, footers, images — and runs in Node and in the browser. It is MIT licensed.

**Who it is for.** Code that needs to hand a user a Word file. It sits on the other side of the conversion from mammoth, and the two are frequently used in the same application: mammoth in, `docx` out.

### python-docx — the reference object model

If your pipeline is Python, python-docx is the equivalent starting point, and it is a genuinely different kind of tool: rather than converting, it gives you an object model to traverse and edit. `Document`, `Paragraph`, `Run`, `Table` with `Row`, `Column` and `Cell`, `Section`, `Font` and `ParagraphFormat`, plus styles, comments and shapes. Its documentation carries dedicated sections for headers and footers and for comments (checked on python-docx.readthedocs.io, 8 September 2026), and it is MIT licensed.

| Pros | Cons |
| --- | --- |
| Reads and writes with one object model | No HTML output; you write the serialiser |
| Documented API for styles, sections, headers, footers and comments | Tracked changes are not part of the documented API |
| Natural in a Python build or a data pipeline | Python only |
| MIT licensed | More code than a converter for a conversion job |

**Who it is for.** Extraction and transformation rather than conversion — pulling every table out of a set of reports into a dataframe, rewriting a clause across two hundred contracts, auditing which documents use a deprecated style. When the requirement is "docx to HTML" and the language is Python, shelling out to Pandoc is usually less code than building a serialiser on top of this.

### Pandoc as a subprocess — the pragmatic cheat

The option people forget: do not parse the document at all. Run Pandoc and read its output.

```js
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const run = promisify(execFile);

const { stdout } = await run("pandoc", [
  "-f", "docx",
  "-t", "html",
  "--extract-media=./media",
  "--track-changes=all",
  "--sandbox",
  "quarterly.docx",
]);
```

Pandoc's `.docx` reader handles footnotes, tables, tracked changes and much else that a JavaScript library will not, and `--extract-media` writes the images out for you. `--track-changes` is the flag whose absence causes the most confusion: a reviewed document has insertions and deletions in it, and you should choose deliberately whether you want them accepted, rejected or annotated rather than taking whatever the default is. `--sandbox` restricts filesystem access when the document is not yours.

| Pros | Cons |
| --- | --- |
| Handles footnotes, tracked changes and constructs no JS library reaches | An external binary on every machine that runs your code |
| One command, no parser to maintain | Impossible in the browser, and awkward in most serverless runtimes |
| Converts onward to dozens of other formats from the same call | No `messages` equivalent: it does not tell you what it normalised |
| GPL licensed and long-lived | HTML is Pandoc-flavoured; you will still post-process |

**Who it is for.** Server-side batch work where you control the environment. It is the right answer far more often than library loyalty suggests, and the wrong answer the moment the code has to run in a browser or a container you did not build.

LibreOffice headless deserves the same footnote: `soffice --headless --convert-to html` will read files nothing else will, including old binary `.doc`, and is also useful purely as a preprocessor — convert the odd file to a clean `.docx` first, then hand that to mammoth.

## Where mammoth is the wrong answer, and what that costs

The recommendation at the top of this article has real limits, and they are worth stating plainly because they are the ones that produce complaints after deployment.

**Direct formatting is gone, and that is the design.** A document where the author never used styles — everything is Normal, with bold and 18pt applied by hand — converts to a wall of `p` elements. mammoth is behaving correctly: there is no semantic information in that file to use. The cost is that the fix is not in your code. Somebody has to apply real styles to the document, or you have to write style-map rules against run properties and accept the guesswork. Budget for the conversation.

**Layout does not exist in the output.** No page size, no margins, no columns, no headers, no footers, no page breaks. If the requirement involves the word "print", mammoth is not the tool; docx-preview or a PDF route is.

**Text boxes, shapes and SmartArt land unevenly.** Content in a floating text box is not in the document's flow, and any HTML converter has to decide where to put it. Check a document that uses them before you promise anything.

**Fields are values, not formulas.** A page number field, a cross-reference, a table of contents field, a calculated field — all of these are instructions in the file, plus a cached last-known result. HTML has no fields. What you get is at best the cached text, and a table of contents converts to a list of links only if the document was built well enough for the anchors to exist.

**The Markdown writer is deprecated.** mammoth has a `convertToMarkdown` and its documentation says plainly that "Markdown support is deprecated", recommending HTML plus a separate HTML-to-Markdown library instead as likely to produce better results. Take the advice. Convert to HTML, then run a dedicated converter — the choice among [the HTML to Markdown libraries](/blog/best-html-to-markdown-converters) matters more than it sounds, because that is where you decide what happens to markup Markdown cannot express.

**Very large files are a memory question, especially in the browser.** The whole archive is read, images and all. A 30 MB document with high-resolution screenshots inflates further as base64 in the output, and a tab has less headroom than a server. This is why hosted converters cap upload size; transformpipe caps a conversion at 10 MB and a stored document at 4 MB, the latter because a Vercel Function refuses a request or response body over 4.5 MB. Whatever you build will need a limit too, and picking it deliberately is better than discovering it.

**One document is not a library problem.** If somebody needs a single `.docx` turned into HTML or Markdown today, installing a parser and writing a style map is the expensive route. [The converters that already exist](/blog/best-word-to-markdown-converters) do it in a browser tab. Reach for a library when the conversion is a feature, not an errand.

## How to choose a docx library

1. **Decide whether you want the meaning or the appearance, before you compare anything.** Wanting both is the single most expensive mistake here, because it sends you to a fidelity renderer for content storage, and the presentational markup you get back will be in your database for years.
2. **Check where the code runs.** A browser rules out every subprocess and leaves you with mammoth or docx-preview; a controlled server makes Pandoc a serious contender that costs you almost no code.
3. **Look at ten real documents before you write the style map, and count the styles.** If the authors used real named styles, mammoth will produce good HTML on the first run; if they formatted by hand, no library will, and knowing that early turns a code problem into a template problem.
4. **Confirm the library reads rather than writes.** docxtemplater and `docx` are both excellent and neither will convert your file, so reading the first paragraph of a README saves an afternoon of confusion.
5. **Wire up the warnings on day one.** With mammoth that is the `messages` array; with anything else it is your own checks on the output, because silence from a converter is not evidence that anything worked.
6. **Test one document with a numbered list, one with images, and one that has been through review.** Those three cover the three chains that break — `numbering.xml`, the relationships part, and revision marks — and if all three come out right, the ordinary documents will too.

## Conclusion

In JavaScript, reading a `.docx` and getting usable HTML means mammoth, and using it well means accepting its bargain: you get clean semantic markup because it maps named styles and discards presentation, so the quality of your output is set by the quality of the document's styles and by the style map you write against them. Read `messages` and the library will tell you exactly where that map is short. Choose `convertImage` deliberately rather than shipping a page full of base64. If the job is to view a document rather than to store what it says, use docx-preview; if it is to extract fields or charts, use docx4js; if it is to produce a Word file, use `docx` or docxtemplater; and if the code runs on a server you control, Pandoc as a subprocess is less work than any of them. For a single file, no library is required at all — [dropping it into a browser converter](/word-to-markdown) takes about ten seconds and uploads nothing.

## FAQ

### How do I convert a .docx to HTML in JavaScript?

Use mammoth: `mammoth.convertToHtml({path: "file.docx"})` in Node, or `mammoth.convertToHtml({arrayBuffer: buffer})` in the browser with the `mammoth.browser.js` build. The result has a `value` property holding the HTML and a `messages` array listing what could not be mapped. Add a `styleMap` for any custom Word styles your documents use.

### Why is mammoth's output missing my formatting?

Because it is designed to be. mammoth maps semantic information — named styles — to HTML elements and discards direct formatting such as colour, font size and alignment. If the document's authors applied bold and 18pt by hand rather than using a Heading style, there is nothing for mammoth to map, and the fix is to style the document properly or write style-map rules against run properties instead.

### Why did my numbered lists convert to plain paragraphs?

Nearly always because the list was never a real list. Word stores list membership as a `w:numId` that resolves through `numbering.xml`, so if that part is missing, the id does not resolve, or the author typed "1." and "2." by hand, the converter sees ordinary paragraphs. Apply a genuine list style in Word and convert again.

### Can I read a .docx in the browser without uploading it?

Yes. `mammoth.browser.js` reads a `File` object's `arrayBuffer()` and converts entirely in the page, so nothing is sent to a server. That is how browser-based Word converters work, and you can confirm it on any of them by watching the network tab while a file converts.

### Should I use mammoth's convertToMarkdown?

No. Its own documentation marks Markdown support as deprecated and recommends generating HTML and passing that to a dedicated HTML-to-Markdown library instead. HTML has an element for most things a `.docx` contains and Markdown does not, so the two-step route gives the second library more to work with.

### What is the difference between mammoth and docx-preview?

They optimise for opposite things. mammoth produces clean semantic HTML from named styles and ignores appearance; docx-preview renders the document to resemble the printed page, with options for page breaks, headers and footers. Use mammoth when you want content to keep, and docx-preview when a user needs to look at the file.

### Can I just unzip the .docx and parse the XML myself?

You can, and the unzipping is easy. The hard part is that meaning is stored by reference: styles in `styles.xml`, lists in `numbering.xml`, images and links in the relationships part, and text split arbitrarily across runs so a single word can be three elements. That reference resolution is most of what a library is, and reimplementing it is a project rather than a task.
