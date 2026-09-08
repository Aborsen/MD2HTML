---
title: "Markdown to HTML: what actually happens to your file"
description: What a Markdown to HTML converter does to your file — parse, render, sanitise, wrap — and what a failure at each of the four stages looks like on screen
date: 2026-09-08
tag: Converting
keywords: markdown to html, md to html, convert markdown to html, markdown to html converter online, markdown to html generator, render markdown as html
---

Converting a Markdown file to HTML sounds like one action. It is four jobs run in order, and a tool can be careful about one and careless about the next. Knowing which is which explains why two converters produce different HTML from the same file, why a table sometimes arrives as a paragraph full of pipe characters, and why the result occasionally opens as a wall of unstyled text with the em dashes turned into gibberish.

The four stages are parse, render, sanitise and wrap. Each one throws information away or invents information that was never in your source, and each one fails in a way you can recognise on screen once you know what to look for. None of the four is optional if the file has to open somewhere other than the tool that produced it.

This is the mechanical account: what the parser actually builds, what the renderer decides on your behalf, what a sanitiser's allow-list contains and what it deletes, and what a browser needs in the `<head>` before it will render your document the way you saw it in the preview.

### TL;DR

A Markdown to HTML converter parses your text into a **syntax tree** of typed nodes, walks that tree to **render** tags, **sanitises** the resulting fragment against an allow-list of tags, attributes and URL schemes, and then **wraps** the fragment in a complete document with a doctype, a charset and styles. Flavour is decided at stage one, so a plain CommonMark parser turns your GitHub tables into paragraphs and there is no error message. Sanitising is decided at stage three, and it matters the moment the Markdown came from anywhere you did not write yourself. Whether the file opens correctly for the person you send it to is decided almost entirely at stage four, by four lines in the head that most libraries never write because writing them is not a library's job.

## The four stages, at a glance

| Stage | Input | Output | Decided here |
| --- | --- | --- | --- |
| Parse | Characters | A tree of typed nodes | Flavour: tables, task lists, footnotes, line-break rules |
| Render | The tree | An HTML fragment | Heading ids, code block classes, checkbox markup, URL encoding |
| Sanitise | The fragment | A fragment without the dangerous parts | Which tags, attributes and URL schemes survive |
| Wrap | The fragment | A complete document | Doctype, charset, title, viewport, styles, whether it needs the network |

Read that table as a chain. A file that comes out wrong came out wrong at exactly one of those four points, and the symptom tells you which. Missing tables are a parsing problem and no amount of restyling will fix them. Unstyled text is a wrapping problem and has nothing to do with the parser. A surviving `<script>` tag is a sanitising problem, and it is the only one of the four that can hurt somebody.

## Stage one: parsing, and what a syntax tree actually contains

A parser reads the characters and builds a tree. Not HTML — a tree of typed nodes, each with a handful of fields, and no tags anywhere in it. Take four lines of Markdown:

```markdown
## Release 2.1

- [x] Tighten the allow-list
- [ ] Document the API

See the [changelog](CHANGELOG.md) for the rest.
```

What the parser produces is closer to this, written out as an outline:

```text
document
  heading (level: 2)
    text "Release 2.1"
  list (ordered: false, tight: true, marker: "-")
    item (checked: true)
      paragraph
        text "Tighten the allow-list"
    item (checked: false)
      paragraph
        text "Document the API"
  paragraph
    text "See the "
    link (destination: "CHANGELOG.md", title: null)
      text "changelog"
    text " for the rest."
```

Several things in that outline are worth naming, because each one becomes a visible difference in the HTML later.

**Nodes are either block or inline.** Blocks are the shape of the document: `document`, `heading`, `paragraph`, `list`, `item`, `block_quote`, `code_block`, `thematic_break`, `html_block`. Inlines are the contents of a block: `text`, `emphasis`, `strong`, `code`, `link`, `image`, `softbreak`, `linebreak`, `html_inline`. Block structure is determined first, in one pass over the lines; inline content is parsed afterwards, inside each block. That two-phase design is why a stray `*` at the end of a paragraph cannot turn the following heading into italics, and why a table row cannot contain a list.

**Every node carries source positions.** Start and end line, start and end column. Nobody sees them in the output, but they are what makes an editor's preview scroll in sync with the text, what lets a linter say "line 47, column 3", and what lets a tool report which line a broken link was on. A converter that discards positions cannot tell you where anything went wrong.

**Some nodes carry structural attributes that change rendering.** A `list` node records whether it is ordered, what number it starts at, and whether it is *tight* or *loose*. Tightness is decided by blank lines in your source: bullets with no blank line between them make a tight list, and a tight list's items render without `<p>` wrappers. Put one blank line between two bullets and every item in the list becomes loose, gains a paragraph, and the whole list gets taller. That is the single most common "why did the spacing change" in Markdown, and it happens in the tree, before any HTML exists.

A `code_block` node records the fence character, the fence length and the *info string* — the `js` in ` ```js `. The info string is free text; the parser does not know it is a language name. An `item` node in a GitHub-flavoured parser records whether its checkbox was ticked. A `link` node records a destination and an optional title, already unescaped.

**Link reference definitions do not survive as nodes.** Write `[changelog][cl]` in a paragraph and `[cl]: https://example.com/log` at the bottom of the file, and the parser consumes the definition line entirely and resolves the destination into the `link` node. Nothing in the tree remembers that the link was written in reference style. Two consequences follow: a definition nobody references vanishes without trace, and a reference with a typo in the label is not an error — it is literal text, and `[changelog][cl2]` renders as those exact characters, brackets and all.

**Raw HTML is an opaque string.** A `<div>` or a `<script>` in your Markdown becomes an `html_block` node whose content is the raw text. The Markdown parser does not parse it into elements, does not check that the tags balance, and does not know what it says. It is a sealed box carried through to the output, which is precisely why the sanitiser at stage three has to do its own HTML parsing rather than inspecting the tree.

## Where the Markdown flavours diverge

Flavour is a property of the parser, and it is decided here. Every difference below is a real, listable divergence between named specifications and implementations.

**Plain CommonMark has no tables.** No task lists, no strikethrough, no automatic linking of bare URLs. It has ATX headings, setext headings, fenced and indented code, lists, block quotes, thematic breaks, emphasis, links, images and raw HTML. That is the specification. Hand a pipe table to a strictly compliant parser and you get a paragraph containing pipe characters, laid out as one run of text, with no warning of any kind.

**GitHub Flavored Markdown adds five extensions on top of CommonMark:** tables, task list items, strikethrough with `~~`, autolink literals, and disallowed raw HTML, which filters a short list of tags at the parse stage. It is a specification in its own right, published as a delta against CommonMark, which is why "does it support GFM" is a meaningful question with a yes-or-no answer. Note that the fifth extension is not a substitute for stage three: it names a handful of tags, not an allow-list.

**Footnotes are in neither specification.** A converter that supports `[^1]` does so as an extension, and the extensions do not agree with each other on where the note text may live, whether a note may contain a list, or what the back-link looks like. Footnotes are the feature most likely to survive one conversion and disappear in the next.

**Intra-word emphasis differs.** CommonMark deliberately does not treat `_` inside a word as emphasis, so `snake_case_name` stays intact. Older converters, including pre-CommonMark JavaScript ones, italicise the middle of that identifier. If your document is full of variable names, the parser you choose is the difference between readable and mangled.

**Soft line breaks are an option, not a rule.** A single newline inside a paragraph is a `softbreak` node. CommonMark renders it as a newline in the HTML, which the browser collapses to a space. marked and markdown-it both expose a `breaks` option that renders it as `<br>` instead; Python-Markdown does the same through its `nl2br` extension. The same file, two settings, two documents — one where your address block is three lines and one where it is one.

**Extended dialects go further still.** Pandoc's own Markdown adds definition lists, fenced divs, citations and inline maths. Python-Markdown's `attr_list` extension lets you attach classes and ids to elements from the source. PHP Markdown Extra and MultiMarkdown each have their own table syntax variations. All of these parse in the tool that defines them and degrade to literal punctuation everywhere else, which is what people mean when they say a Markdown file is not portable. The flavour question is worth understanding properly, because [the flavours differ in specific, listable ways](/blog/commonmark-gfm-and-the-flavours) and the differences are all silent.

## Stage two: rendering, and the choices nobody asked you about

The renderer walks the tree and writes tags. This is where the converter starts inventing, because HTML needs details that Markdown never expressed. From the tree above, a GitHub-flavoured renderer might write:

```html
<h2 id="doc-release-21">Release 2.1</h2>
<ul class="contains-task-list">
  <li class="task-list-item"><input type="checkbox" checked disabled> Tighten the allow-list</li>
  <li class="task-list-item"><input type="checkbox" disabled> Document the API</li>
</ul>
<p>See the <a href="CHANGELOG.md">changelog</a> for the rest.</p>
```

Not one of the ids, classes or input elements existed in your source. They are house choices, which is why two converters can both be correct and still disagree.

**Heading ids are the sharpest edge.** No specification says headings get an `id`, and none defines how the text becomes a slug. Implementations lowercase the text, drop punctuation, replace spaces with hyphens and append a counter to duplicates — but they disagree about which punctuation to drop and what the counter looks like. One renderer strips the dot and produces `release-21`; another keeps it and produces `release-2.1`; a third prefixes everything, as `doc-release-21` above, to keep the id from colliding with the page's own markup. Anchor links written by hand against one scheme break silently against another, and "silently" here means the browser scrolls nowhere and shows no error.

**Code blocks get a class, and the convention is not universal.** The usual output is `<pre><code class="language-js">`, taking the first word of the info string. Some renderers write `class="js"`, some add a `data-lang` attribute, some emit a wrapper `<div>` with the language in it. Highlighting is a separate decision again: either the converter runs a highlighter at conversion time and emits spans with class names, or it emits a plain code element and expects a script to colour it in the browser. The first produces a file that works offline; the second produces a file that needs the network and a script tag. That choice, and the [handling of code blocks generally](/blog/code-blocks-in-markdown), decides whether your example listings survive being emailed.

**Text and URLs are escaped, and the escaping differs.** Text nodes get `&`, `<` and `>` replaced with entities. Attribute values get quotes replaced. Link destinations get percent-encoded, and implementations differ over whether a destination that already contains a `%` is left alone or encoded again — the second turns a working URL into a 404. Renderers also differ over whether they normalise the case of hex escapes and whether they encode characters that are legal in a URL but ugly.

**Typography is optional.** markdown-it's `typographer` option and Pandoc's `smart` extension convert straight quotes to curly ones, `--` to an en dash and `...` to an ellipsis. Pleasant in prose, wrong in a document full of command lines, where a curly quote pasted into a terminal fails with a message that does not mention quotes.

**Task list markup varies.** Some renderers emit a real `<input type="checkbox" disabled>`, some emit a styled `<span>`, some leave the literal `[x]` text in place because they never implemented the extension. This matters twice: once for how it looks, and again at stage three, because an input element is exactly the sort of thing a sanitiser's allow-list is inclined to delete.

**Tables get alignment attributes or classes.** The colons in a GFM table's delimiter row become either `align="left"` attributes on the cells, or a class per column, or inline styles — three ways to express the same intent, each of which a sanitiser treats differently. Tables carry more of this per line than anything else in Markdown, which is why [tables are the most common thing to break on the way across](/blog/markdown-tables-that-survive-conversion).

What the renderer returns is a fragment. Headings, paragraphs and lists, with no doctype, no head, no styles, and no promise that any of it is safe.

## Stage three: sanitising, the job people forget

Markdown lets raw HTML through by design. A `<script>` tag in a .md file is not an error; it is content, and a faithful renderer copies it into the output. So does an `onerror` attribute on an image, and so does a `javascript:` URL in a link. If the Markdown came from anywhere you do not control — a pull request, an issue, a client, a model's output — the fragment you just produced is untrusted HTML, and opening it in a browser executes it.

Sanitising runs that fragment through an allow-list and drops everything else. It has to be an allow-list. A blocklist of known-bad tags loses to the next encoding trick, the next uppercase variant, the next namespace where an attribute means something different.

## What a sanitiser allow-list actually looks like

An allow-list is three lists and a rule, not one list of tags.

**The tag list.** Everything Markdown can legitimately produce, and nothing more: `p`, `h1` through `h6`, `ul`, `ol`, `li`, `blockquote`, `pre`, `code`, `em`, `strong`, `del`, `a`, `img`, `hr`, `br`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `sup`, `sub`. Add `input` if you want task list checkboxes, `details` and `summary` if your documents use them, `span` and `div` if you allow raw HTML containers at all.

**The attribute list, per tag.** This is the part people get wrong by writing one global list. `a` gets `href`, `title`, `rel` and possibly `target`. `img` gets `src`, `alt`, `title`, `width` and `height`. `th` and `td` get `colspan`, `rowspan` and `align`. `code` gets `class`, restricted to the `language-` prefix if you are careful. `input` gets `type`, `checked` and `disabled`, and `type` is pinned to `checkbox`. Headings get `id`. Nothing else gets anything.

**The URL scheme list.** `http`, `https` and `mailto` for links; add `data:` for images only if you have decided you want embedded images, and if so restrict it to image media types. Everything else goes: `javascript:`, `vbscript:`, `file:`, and `data:text/html`, which is a whole document pretending to be a URL. Schemes must be checked after unescaping and after stripping whitespace and control characters, because `java&#09;script:` is a URL a browser will happily follow.

**The rule for everything else.** An unknown tag is either dropped whole, or unwrapped — the tag removed and its children kept. Unwrapping keeps more of your text; dropping is safer for containers whose contents were never meant to be read as prose. Pick one deliberately, because the difference shows up as either duplicated content or missing content the first time somebody's document contains a `<template>`.

## What a sanitiser drops, and why each one

| Dropped | Why |
| --- | --- |
| `<script>` | Executes on open. The whole reason the stage exists |
| `on*` attributes | `onerror`, `onload`, `onmouseover` execute without a script tag anywhere |
| `javascript:` and `data:text/html` URLs | A link or an image source that runs code instead of fetching a resource |
| `<iframe>`, `<object>`, `<embed>` | Load and run third-party content inside your document |
| `srcdoc` | An entire HTML document smuggled into an attribute |
| `<style>` and `style` attributes | Can reposition and disguise elements; often stripped, sometimes allowed with a property allow-list |
| `<form>`, `<button>`, `formaction` | Ask the reader for input and post it somewhere |
| `<base>` | One tag that silently rewrites every relative URL in the document |
| `<meta http-equiv="refresh">` | Redirects the reader away from your document |
| `<svg>` and `<math>` | Foreign-content parsing rules differ from HTML's, and both can carry scripts and their own link syntax |
| Unprefixed `id` and `name` | DOM clobbering: `id="attributes"` shadows a real DOM property and breaks scripts that read it |

Two details decide whether a sanitiser holds up in practice.

**Where it runs.** A sanitiser in the browser leans on the browser's own parser, which is the same parser that will later render the document — a real advantage, because it sees the markup as the browser will see it. One on a server has to parse the HTML itself, with its own idea of how malformed tags nest. If a tool converts in both places, the two must agree, or the same document renders differently depending on who asked for it. This is also where mutation problems live: if the sanitiser's parse and the browser's parse disagree about a nesting edge case, cleaning the markup can produce something that re-parses in the browser as different markup than was approved.

**Heading ids again.** A bare `id="title"` shadows a DOM property, so a browser sanitiser strips it while a server-side parser keeps it: one document, two shapes, and anchor links that work in one and not the other. Prefixing the ids answers both problems at once. transformpipe sanitises with DOMPurify in the browser and the `xss` package on the server against one shared allow-list, and its heading ids carry a `doc-` prefix. There is [more to sanitising Markdown safely](/blog/sanitising-markdown-safely) than fits in one stage of a pipeline.

One last thing about this stage: sanitising is visible. It removes things. Checkboxes disappear if `input` is not on the list, a `<details>` block flattens into its contents, an embedded diagram becomes nothing at all. That is not a bug — it is the allow-list doing its job — but it means the output has to be read, not assumed.

## Stage four: wrapping, because a fragment is not a page

What the renderer and sanitiser hand back is a fragment: `<h1>Title</h1><p>Text</p>` and nothing around it. Paste it into an existing page and it works perfectly. Save it as .html, send it to somebody, and the browser does its best with a document that never declared itself.

A complete document needs a small, fixed set of things, and each one has a specific failure attached to it.

**`<!doctype html>`, first line.** Without it the browser enters quirks mode, which is a different rendering engine with a different box model, different table cell inheritance and different line-height handling. Your document will not be broken, exactly — it will be subtly, unexplainably differently spaced from the preview you approved.

**`<html lang="en">`.** The language attribute is what a screen reader uses to pick a voice and pronunciation, and what the browser uses for hyphenation and quotation marks. Omit it and an English document may be read aloud with the phonetics of whatever the reader's default is.

**`<meta charset="utf-8">`, inside the first 1024 bytes.** This is the one that produces the classic symptom. Your file is UTF-8; without a declaration, a browser guesses, and a wrong guess renders every em dash as `â€"`, every curly apostrophe as `â€™` and every accented name as two characters of noise. The declaration has to come early, before any substantial content, because the browser stops sniffing once it has begun.

**`<title>`.** It names the browser tab, it is what a "save as" dialog suggests for a filename, and it is what a link preview shows in a chat client. An untitled document arrives in somebody's downloads folder as its own path.

**`<meta name="viewport" content="width=device-width, initial-scale=1">`.** Without it, a phone lays the page out at roughly desktop width and then zooms out to fit, so your document opens as legible-if-you-pinch. Half the people you send a document to will open it on a phone first.

**A stylesheet.** This is the difference between converted and looking converted. What it needs is unglamorous: a readable measure so lines do not run the full width of a monitor, a line height, borders and padding on table cells, `overflow-x: auto` on `pre` so a long code line scrolls instead of stretching the page, `max-width: 100%` on images so a screenshot does not push the layout sideways, and a `@media print` block if anybody will print it.

**Inline the styles if the file has to travel.** A `<link>` to a stylesheet or a font on a CDN means the document looks right only where it has a connection, and it means opening the file tells a third party that it was opened. A self-contained file carries its styles in a `<style>` element and requests nothing. It is a larger file, and it is the only version that renders identically offline, on a locked-down laptop, and in five years when the CDN URL has moved.

**Relative paths resolve against the file's new location.** An image written as `images/diagram.png` resolves relative to wherever the .html now sits, so it breaks the moment the file moves or is attached to an email. Only an absolute URL or a data URI travels with the document. The same applies to `[changelog](CHANGELOG.md)`: it becomes an `href` to a .md file, and a browser handed a .md file usually downloads it rather than rendering it, unless you converted that file too and rewrote the extension.

## What a failure at each stage looks like on screen

The symptom identifies the stage. This is the table to keep.

| Stage | What you see | What actually happened | How to check |
| --- | --- | --- | --- |
| Parse | A paragraph full of `\|` characters where a table should be | The parser is running CommonMark, not GFM; tables were never recognised | Look at the HTML source for `<table>`. If there is no table element, no styling will help |
| Parse | Literal `[x]` and `[ ]` at the start of list items | Task list extension not enabled | Search the output for `type="checkbox"` |
| Parse | Literal `[^1]` in the text and no notes at the bottom | Footnotes are an extension and this parser does not have it | Check the tool's flavour or extension list |
| Parse | A three-line address collapsed into one line | Single newlines are soft breaks; the `breaks` option is off | Look for `<br>` in the source; there will be none |
| Parse | A nested list rendered flat, or as a code block | Continuation indentation did not match what the parser expects | Count the spaces; the tree, not the CSS, is wrong |
| Render | Anchor links scroll nowhere | Heading id slugs differ from the ones your links were written against | Compare an `href="#..."` against the `id` on the heading |
| Render | Code blocks present but uncoloured | The renderer emitted a class and left highlighting to a script that is not in the file | Look for `class="language-…"` and for a script tag |
| Render | Curly quotes in a command line that now fails to run | Typographic substitution was on | Search the output for `’` and `“` |
| Render | A URL that 404s although it worked in the source | The destination was percent-encoded twice | Compare the `href` with the Markdown destination character by character |
| Sanitise | An alert box, or anything at all executing | Nothing sanitised the fragment. The document is running code from its author | Search the source for `<script` and `on` handlers before opening it |
| Sanitise | Checkboxes gone, `<details>` blocks flattened, an embed missing | The allow-list did its job and those tags were not on it | Diff the pre- and post-sanitise fragments if the tool shows both |
| Sanitise | The same document renders differently on two machines | Browser-side and server-side sanitisers are running different allow-lists | Convert the same file in both places and compare the HTML |
| Wrap | A wall of serif text at full window width | You were given a fragment, not a document. No doctype, no head, no styles | Look at the first line of the file for `<!doctype html>` |
| Wrap | `â€"` and `â€™` scattered through the prose | No charset declaration, so the browser guessed wrong | Check for `<meta charset="utf-8">` in the head |
| Wrap | Legible only after pinch-zooming on a phone | No viewport meta tag | Check the head; then open it on a phone, not in a device emulator |
| Wrap | Broken image icons after the file was emailed | Relative image paths that no longer resolve | Look at the `src` values; anything not absolute or a data URI will break |
| Wrap | Correct with the network on, plain with it off | Styles or fonts are linked from a CDN rather than inlined | Turn the network off and reopen the file |

## Quick comparison: where the four stages can run

The four stages happen wherever you put them. What changes is which of the four the tool does for you, and which it leaves on your desk.

| Where you convert | Best for | Stages it handles | Price |
| --- | --- | --- | --- |
| Browser converter | One file, now, with a person to send it to | All four, including a self-contained wrapper | Free |
| A library in your own code | Rendering inside an application you are building | Parse and render; sanitise and wrap are yours | Free, MIT or BSD depending on the library |
| Command line converter | Scripted and repeatable conversion of files on disk | Parse, render and optionally wrap; sanitising rarely | Free, open source; Pandoc is GPL |
| Static site generator | A set of documents that link to each other | All four, plus navigation, across a whole directory | Free, open source |
| API, CLI or CI action | Conversion inside a build with no browser present | All four, if the service does; the point is no install on the runner | Free with transformpipe; varies elsewhere |
| An editor's export | The file you happen to have open | Parse and render, wrapping depends entirely on the extension | Free for VS Code; desktop editors vary, check the vendor |

## Where to run the conversion

### A browser converter — all four stages, one file, nothing uploaded

A converter that runs in the browser does the parse, the render, the sanitise and the wrap on your own machine and hands you a finished .html file. Signed out, the file is never sent anywhere: it is read, converted and rendered locally, which you can verify by watching the network tab do nothing while it works.

| Pros | Cons |
| --- | --- |
| Produces a complete document, not a fragment | One document at a time, or several chained into one |
| Nothing is uploaded, so the source stays on your machine | A very large file is bound by the machine's memory |
| Sanitises against a fixed allow-list before you ever open the output | No templating language, so the wrapper is the tool's, not yours |
| No install and nothing to configure | Not a build step: somebody has to be sitting there |

**Price:** free. An account adds history, sharing and an API, also free.

**Technical details and features**

- GitHub Flavored Markdown at the parse stage: tables, task lists, strikethrough, autolinks, fenced code
- Heading ids carry a `doc-` prefix, so they survive both browser-side and server-side sanitising
- The export is self-contained: doctype, head, charset, viewport, inline `<style>`, no external requests
- An "HTML source" view, so you can read the wrapper and see what became of any raw HTML before you send it
- Downloads as `.html`, `.md` or plain text, or prints to PDF through the browser's own dialog

**Who should use it?** Anybody whose next step is "send this to a person", and anybody converting a document they would rather not upload — a contract, a patient note, an unreleased plan.

### A library in your own code — two stages, and two left for you

marked and markdown-it in JavaScript, Python-Markdown and markdown-it-py in Python, Goldmark in Go, commonmark.js when you need the reference behaviour. These do the parse and the render properly and stop there, by design: a library does not know whether its output is going into an existing page or a standalone file, so it cannot write your wrapper, and it does not know whether the input is trusted, so most of them will not silently sanitise.

| Pros | Cons |
| --- | --- |
| Full control of options: flavour, breaks, typography, heading ids | Sanitising is your job, and the omission is silent |
| Fast enough to run per request | Wrapping is your job, and the fragment looks broken without it |
| Extension points for custom node rendering | Two libraries, two flavour defaults, two sets of bugs |
| Testable in your own suite | You now own the security decision |

**Price:** free, open source. marked and markdown-it are MIT licensed; Python-Markdown and commonmark.js are BSD licensed.

**Technical details and features**

- markdown-it escapes raw HTML by default, which is the safe default; marked passes it through and documents that you should pair it with DOMPurify
- Both expose a `breaks` option for soft line breaks and options for heading ids
- markdown-it gives you a token stream and marked a lexer, so you can inspect the tree before rendering
- Python-Markdown's extensions cover tables, footnotes and attribute lists

**Who should use it?** Developers rendering Markdown inside an application where the surrounding document already exists — a comment box, a preview pane, a docs build with its own template.

### The command line — repeatable, scriptable, and quiet about safety

Pandoc is the general answer, and most languages ship a CLI wrapper around their library. A command line converter is the right tool when the same conversion has to happen again next week, over files that live on disk, without a person in a browser tab.

| Pros | Cons |
| --- | --- |
| Repeatable and scriptable across many files | Requires an install and a terminal |
| Pandoc's `--standalone` writes a real document, and `--embed-resources` inlines assets | Raw HTML passes through: sanitising is not part of the job |
| Templates give exact control over the wrapper | Its Markdown dialects differ from GFM in ways that surprise people |
| Runs where there is no browser at all | More tool than a single file usually needs |

**Price:** free, open source. Pandoc is GPL licensed.

**Technical details and features**

- Explicit reader selection, so you can ask for `commonmark`, `gfm` or Pandoc's own dialect rather than guessing
- `--standalone` for the wrapper, `--template` for your own, `--embed-resources` for a single-file output
- `--sandbox` restricts filesystem access when converting files you do not trust
- Writes formats other than HTML from the same source, which is the real reason to install it

**Who should use it?** Anybody converting on a schedule, in bulk, or into formats beyond HTML.

### A static site generator — all four stages, over a directory

Hugo, Eleventy, MkDocs, Docusaurus and Jekyll all convert Markdown to HTML, and none of them is a converter. They are build systems: they expect a directory, a configuration file, templates and a deployment target, and they hand back navigation, search and cross-links.

| Pros | Cons |
| --- | --- |
| One consistent wrapper across every page | Enormous overhead for one file |
| Navigation, feeds and cross-document links | A config file and a build step to maintain forever |
| Themes, so the stylesheet question is answered | The output is a site to deploy, not a document to email |
| The parser is pinned and known | Its Markdown flavour is the generator's choice, not yours |

**Price:** free, open source.

**Technical details and features**

- The generator owns stage four completely, which is why every page looks the same
- Front matter is data here, not content: it feeds the template rather than appearing in the text
- Most pin a specific parser — Hugo uses Goldmark, MkDocs uses Python-Markdown — so flavour is a property of the generator

**Who should use it?** Anybody publishing a set of documents that link to each other. For one file and one recipient, it is the wrong shape entirely.

### An API, a CLI or a CI action — conversion with no browser in the loop

When the conversion has to happen inside a pull request, a nightly build or an assistant's tool call, there is nobody to click anything. What you need is the same four stages available over a wire or as a binary the runner already trusts.

| Pros | Cons |
| --- | --- |
| No install on the build runner | A network hop, unless you use the CLI |
| The same allow-list and wrapper as the interactive tool, so output matches | You are depending on a service being up |
| Fits a pull request check or a release job | Not interactive: you read the output after the fact, in an artefact |

**Price:** free with transformpipe's API, CLI, GitHub Action and MCP server; varies elsewhere.

**Technical details and features**

- The CLI is dependency-free, so a runner does not need a package install step
- The same conversion is reachable from a REST call, a shell, a workflow step or an assistant
- Because all four stages run server-side, the output is the wrapped, sanitised document rather than a fragment

**Who should use it?** Teams that convert as part of a build — release notes, generated documentation, a rendered preview attached to a pull request.

### An editor's export — convenient, and the wrapper is a lottery

VS Code ships a Markdown preview built on markdown-it, and extensions add export. Desktop editors export HTML too. If the file is already open in front of you, this is the shortest path from text to page.

| Pros | Cons |
| --- | --- |
| Already installed and already looking at the file | The preview's styling is usually not the exported styling |
| Preview flavour is knowable, because the parser is named | Export quality depends entirely on the extension you picked |
| No upload | Sanitising is generally not part of it |
| Fine for a README or a note | Not a pipeline: it converts what is open |

**Price:** free for VS Code and its extensions; desktop editors are priced by their vendors, so check the vendor's own page.

**Technical details and features**

- VS Code's preview uses markdown-it, so it follows CommonMark with the editor's own extensions layered on
- Export extensions differ over whether they inline styles, link them, or write a fragment
- What the preview shows is styled by the editor's theme, which is not shipped with the file

**Who should use it?** Developers converting a file in passing, who will open the result somewhere else before sending it.

## Where the obvious choice fails, and what it costs

The obvious choice for one file is a browser converter, and it is the right one often enough that the failures are worth naming.

**It converts one document, not a project.** Chain several files into one and you get one long document; you do not get a site with a sidebar. If the answer needs navigation, the converter is only the first stage of a static site generator and pretending otherwise costs you a rebuild later.

**The machine is the limit.** Browser-side conversion means the parse, the render and the sanitise all happen in a tab. A book-length file with hundreds of images is bound by that tab's memory, and the failure is a spinner, not an error message. Server-side or command line conversion has no such ceiling.

**There is nothing to diff.** A conversion somebody performs by hand is not in version control, cannot be re-run identically next month, and cannot fail a build. If the same document is published repeatedly, the click is a liability and the API, CLI or action is the fix.

**A self-contained file is a big file.** Inlining styles, and images as data URIs, can multiply the size several times over. In exchange it renders identically offline and requests nothing. That is a trade, and for a page served from a website — where a shared cached stylesheet is the whole point — it is the wrong side of it.

**Sanitising takes things you wanted.** A fixed allow-list has no way to know that the embed in your document was yours. Diagrams, embedded players and hand-written HTML containers come out as gaps. The honest workflow is to convert, read the output, and put back deliberately whatever the allow-list removed.

**The wrapper is somebody else's taste.** No templating language means no house font, no logo, no cover page. For a document going to a client under a brand, that is a real limitation, and a generator with templates is the answer even for one page.

**Front matter is a parser decision nobody documents.** A file from a static site or a notes app usually starts with a YAML header, and no Markdown specification says what a header is. So it is handled at stage one, by whatever the parser happens to do: consume it, or treat it as ordinary text. The second outcome is the one you see, because the header arrives in the rendered document as content — which is why you should convert one file from a directory before you convert the directory.

**Heading ids may not match the ones your links assume.** Prefixing ids is the right answer for safety and the wrong answer for anchor links copied out of GitHub. Convert one document and click your own internal links before you trust a hundred.

## How to choose

1. **Start from the destination, not the format.** A document for a person needs all four stages including the wrapper; a preview pane inside your app needs only two, because the page already exists. Choose for the wrong destination and you will be hand-writing a `<head>` at the end of it.
2. **Match the flavour to the file before anything else.** If the document has tables, task lists or footnotes, confirm the parser implements them, because a missing extension produces plausible-looking prose rather than an error and you will not notice until a reader does.
3. **Decide about sanitising before you convert a file you did not write.** For your own notes it is a non-issue. For a README off the network, a client's document or a model's output, either the converter sanitises or you do — and if neither does, opening the result is running it.
4. **Insist on a wrapper you can read.** Open the HTML source and look for the doctype, the charset, the viewport tag and where the styles live. Those four lines predict almost every "it looked fine on your machine" complaint you will otherwise receive later.
5. **Decide whether the file may need the network.** If it will be emailed, archived or opened on a locked-down laptop, inline everything; a single linked font from a CDN is enough to make it render differently for the person you sent it to.
6. **Count the installs against the frequency.** A one-off conversion should not require a package manager; a nightly build should not require a browser tab and a person in it. Getting this backwards costs either an afternoon or a recurring chore.
7. **Test by opening the output somewhere else.** Not in the tool's preview — a different browser, a different machine, the network off, once on a phone. That single test catches fragments, missing charsets, CDN links and broken image paths at the same time, and it takes a minute. If you are still choosing between tools, [the honest comparison is a separate piece](/blog/best-markdown-to-html-converters).

## Conclusion

A Markdown to HTML converter is a four-stage pipeline, and every disappointing conversion is one identifiable stage doing something reasonable that you did not want: a parser running a smaller flavour, a renderer inventing ids that do not match your links, a sanitiser removing an embed, or a wrapper that was never written because a library correctly declined to guess. Read the output rather than the feature list, and read it in the HTML source view where the doctype, the charset and the surviving raw HTML are all visible at once. If you want all four stages done in one pass, on your own machine, with a self-contained file at the end of it, [transformpipe's Markdown to HTML conversion](/) is free, needs no install, and uploads nothing while you are signed out.

## FAQ

### What does a Markdown to HTML converter actually do to my file?

It parses the text into a tree of typed nodes, walks that tree to write HTML tags, filters the result against an allow-list of tags and attributes, and wraps the fragment in a complete document. The first stage decides which syntax exists at all, and the last decides whether the file opens correctly for somebody else. A tool can do any subset of the four and still call itself a converter.

### Why does the same Markdown file produce different HTML in two tools?

Because two of the stages involve choices that no specification makes. The parsers may be running different flavours, so one sees a table where the other sees a paragraph, and the renderers invent heading ids, code block classes and checkbox markup according to their own conventions. Both outputs can be correct HTML and still disagree line by line.

### Do I need to sanitise Markdown I wrote myself?

For a file you authored and will only open yourself, no — there is nothing in it you did not put there. Sanitise the moment the document comes from somebody else, is assembled from several sources, or will be served to other people, because Markdown permits raw HTML and raw HTML permits scripts. The cost of sanitising a safe file is nothing; the cost of not sanitising an unsafe one is running its author's code.

### Why did my task list checkboxes disappear after conversion?

Almost always because the sanitiser's allow-list does not include `input`. GFM renders a ticked item as `<input type="checkbox" checked disabled>`, and a conservative allow-list drops form elements wholesale. A converter that supports task lists properly allows `input` with `type` pinned to `checkbox` and nothing else on it.

### What has to be in the head before an HTML file opens correctly?

A doctype on the first line, so the browser does not fall into quirks mode; `<meta charset="utf-8">` early enough to be seen, so accented characters and dashes are not turned into noise; a title, because that names the tab and the saved file; a viewport meta tag, so it is readable on a phone; and styles, inlined if the file has to travel. Miss any one and the file still opens — just not the way you saw it.

### Why do my anchor links stop working after conversion?

Because heading ids are the renderer's invention, not yours, and slug rules differ. One tool turns "Release 2.1" into `release-21`, another into `release-2.1`, and a tool that prefixes ids for safety produces something else again. Convert one document and click every internal link before you trust the scheme.

### Does converting Markdown to HTML change the words?

It can. Typographic options rewrite straight quotes as curly ones and `--` as an en dash, a `breaks` option turns single newlines into `<br>`, and unreferenced link definitions vanish entirely. The text is the same to a reader and not the same to a terminal, which is why command lines in a converted document are worth checking character by character.
