---
title: "Markdown to HTML: what actually happens to your file"
description: What a Markdown to HTML converter really does to your file — parse to a tree, render tags, sanitise the result, then wrap it in a document
date: 2026-09-08
tag: Converting
keywords: markdown to html, md to html, convert markdown to html, markdown to html converter online, markdown to html generator, render markdown as html
---

Converting a Markdown file to HTML sounds like one action. It is four jobs run in order, and a tool can be careful about one and careless about the next. Knowing which is which explains why two converters produce different HTML from the same file, and why the result sometimes opens as a wall of unstyled text.

| Stage | Produces | If it goes wrong |
| --- | --- | --- |
| Parse | A tree of nodes | Tables, task lists or footnotes are not recognised |
| Render | An HTML fragment | Valid HTML, wrong details: no heading ids |
| Sanitise | A fragment without the dangerous parts | Scripts and event handlers survive |
| Wrap | A complete document | The file opens unstyled or garbled |

## Parsing: the text becomes a tree

A parser reads the characters and builds a syntax tree: it says "heading, level two" and "list of two task items", and contains no HTML at all. Flavour is decided here. Plain CommonMark has fenced code blocks but no tables or task lists. GitHub Flavored Markdown adds tables, task lists, strikethrough and autolinks on top of it. Footnotes are in neither spec; parsers that support them do so as an extension. A file that looks right on GitHub and wrong elsewhere usually met a parser running a smaller flavour; [the flavours differ in specific, listable ways](/blog/commonmark-gfm-and-the-flavours).

```markdown
## Release 2.1

- [x] Tighten the allow-list
- [ ] Document the API

See the [changelog](CHANGELOG.md).
```

## Rendering: the tree becomes HTML

The renderer walks the tree and writes tags, making decisions the Markdown never specified: whether headings get `id` attributes, what class a fenced code block carries, whether a task item becomes a real checkbox or a styled bullet.

```html
<h2 id="doc-release-21">Release 2.1</h2>
<ul>
  <li><input type="checkbox" checked disabled> Tighten the allow-list</li>
  <li><input type="checkbox" disabled> Document the API</li>
</ul>
<p>See the <a href="CHANGELOG.md">changelog</a>.</p>
```

None of that was in the source; those are house choices, which is why two converters can both be correct and still disagree. Slug rules are the sharp edge: one renderer strips the dot for `release-21`, another keeps it for `release-2.1`, and anchor links written against one break against the other.

## Sanitising: the job people forget

Markdown lets raw HTML through by design. A `<script>` tag in a .md file is not an error; it is content, and the renderer copies it into the output. If the Markdown came from anywhere you do not control — a pull request, an issue, a model's output — the fragment you produced is untrusted HTML.

Sanitising runs the fragment through an allow-list of tags and attributes and drops the rest: script elements, `on*` handlers, `javascript:` URLs, embedded frames. It has to be an allow-list. A blocklist of known-bad tags loses to the next encoding trick.

Two details decide whether a sanitiser holds up. First, where it runs. A sanitiser in the browser leans on the browser's own parser; one on a server has to parse the HTML itself. If a tool converts in both places, the two must agree, or the same document renders differently depending on who asks. Second, heading ids. A bare `id="title"` shadows a real DOM property, so a browser sanitiser strips it while a server-side parser keeps it: one document, two shapes. Prefixing the ids answers both problems. transformpipe sanitises with DOMPurify in the browser and the `xss` package on the server against one shared allow-list, and its heading ids carry a `doc-` prefix. There is [more to sanitising Markdown safely](/blog/sanitising-markdown-safely) than fits here.

## Wrapping: a fragment is not a page

What the renderer returns is a fragment: headings, paragraphs and lists, with no `<!doctype html>`, no `<head>`, no charset, no styles. Paste it into an existing page and it works. Save it as .html and open it, and the browser does its best with a document that never declared itself — a serif default font, full-window line lengths, curly quotes arriving as mojibake.

Wrapping is mechanical: a doctype, `<meta charset="utf-8">`, a title, a stylesheet. The stylesheet is the difference between converted and looking converted. If the file must survive being emailed or dropped on a shared drive, inline the styles and leave scripts out: a document with no network requests renders the same offline and in five years.

## What a converted file is not

It is one document plus a stylesheet, not a website: no navigation, no search, no index, no rebuild when the source changes.

Links behave literally. `[changelog](CHANGELOG.md)` becomes an `href` to CHANGELOG.md, and a browser handed a .md file usually downloads it rather than rendering it, unless you converted that file too and rewrote the extension. Relative image paths break the moment the .html moves; only an absolute URL or a data URI travels with the file. For a site with shared navigation and a theme, a static site generator is the tool; the converter is only its first stage.

## Where the conversion should run

The choice is about when, not quality.

- **Once, now, one file.** A markdown to html converter online is the shortest path, and one that converts in the browser never uploads the file at all.
- **Repeatedly, inside a program.** Use a library: marked or markdown-it in JavaScript, Python-Markdown or markdown-it-py in Python. They do the parse and the render; the sanitise and the wrap are still yours.
- **Into something that is not HTML.** Pandoc converts between many formats and handles citations, cross-references and bibliographies. For a Markdown paper heading to PDF or DOCX it is the better answer, and [worth comparing honestly](/blog/pandoc-alternatives-for-markdown-to-html).

Read the output before it goes anywhere. transformpipe is free at https://transformpipe.com: drop the file in, open the "HTML source" tab and look at the wrapper, the charset and what became of any raw HTML. For the same conversion from a script or a pull request, the API, CLI and GitHub Action are documented at /docs.
