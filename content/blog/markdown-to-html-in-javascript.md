---
title: Rendering Markdown in JavaScript without shipping a hole
description: marked, markdown-it and the unified pipeline compared, plus the render-then-sanitise pattern that keeps XSS out of the HTML you ship
date: 2026-07-24
tag: Code
keywords: markdown to html javascript, marked js, markdown it, remark, rehype, unified markdown, react markdown, markdown parser comparison
---

Three libraries do most of the Markdown-to-HTML work in JavaScript, and they answer the same
question: give me Markdown, hand back HTML. What separates them is shape — what the parse exposes
and where you hook in. Then the part most tutorials skip: what comes back is HTML, and putting it
in a page is not safe.

## Three shapes, one job

| | marked | markdown-it | unified (remark + rehype) |
| --- | --- | --- | --- |
| Output | an HTML string | an HTML string, via tokens | an AST, stringified at the end |
| Raw HTML | passed through | off by default (`html: false`) | dropped without `rehype-raw` |
| Sanitising | none | none | `rehype-sanitize`, if added |
| Use it when | one function, few parts | plugins, strict CommonMark | the document must be transformed |

marked is the smallest thing that works. Call `marked.parse()`, get HTML. Customising means
replacing renderer methods — the one that emits a heading, the one that emits a link — or
registering an extension for new syntax. Most jobs never reach that ceiling.

markdown-it parses to a flat token stream and renders that. The tokens are documented, so the
plugin ecosystem is large and the plugins compose: anchors, footnotes, attributes, containers. To
change the output rather than the syntax, override the rule for one token type.

The unified pipeline is different in kind. `remark-parse` produces mdast, a Markdown syntax tree;
`remark-rehype` converts it to hast, an HTML tree; `rehype-stringify` prints it. Every step between
is a plugin walking a real tree — the only one of the three where you can collect every heading, or
rewrite relative image paths, without a regex.

## Which one is the better answer

For trusted Markdown rendered into a page and nothing else, marked or markdown-it is enough; the
pipeline is setup code you read forever for no gain. If you need the document as data — a table of
contents, link checking, transforms that depend on structure — remark and rehype are the right
answer, and the other two turn into string surgery. Speed rarely decides it.

Their defaults differ in dialect, which shows up as missing output, not an error. marked has
GitHub Flavored Markdown behind a `gfm` option, on by default. markdown-it enables tables and
strikethrough in its default preset but leaves task lists to a plugin. unified takes the lot from
`remark-gfm`. If a table renders as a row of pipes, check that first — see
[CommonMark, GFM and the flavours](/blog/commonmark-gfm-and-the-flavours).

In React, `react-markdown` sits on the unified pipeline and renders components rather than an HTML
string, so no `dangerouslySetInnerHTML` is involved. It ignores raw HTML unless you add
`rehype-raw` — a sensible default, and the moment the safety story changes.

## The hole: parsing is not sanitising

Markdown allows raw HTML by design, so any parser honouring the spec passes
`<img src=x onerror=alert(1)>` straight through to your page. marked used to carry a `sanitize`
option; it was deprecated and then removed in favour of a dedicated sanitiser. markdown-it defaults
to `html: false`, which closes the widest door, but a link destination is still an attacker's
input.

So: render, then sanitise with a tool whose only job is sanitising, always in that order.

## Render, then sanitise, in the browser

DOMPurify is the standard choice. Give it an explicit allow-list rather than the default: the
allow-list is the document format you have decided to support.

```js
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'em', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'a', 'img', 'input',
];

export const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'id', 'class', 'target', 'rel',
  'type', 'checked', 'disabled', 'colspan', 'rowspan',
];

export function render(markdown) {
  const html = marked.parse(markdown, { gfm: true });
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
```

Keep both arrays in one module and export them. The moment the same document is rendered somewhere
else, they have to match exactly.

## The same allow-list on the server

DOMPurify needs a real DOM and the server has none. A poor stand-in is worse than nothing: with no
usable DOM, DOMPurify returns the input unchanged instead of throwing, script tag included. Either
give it jsdom, or use a sanitiser that parses the HTML itself, like `xss`.

```js
import { marked } from 'marked';
import { FilterXSS } from 'xss';
import { ALLOWED_ATTR, ALLOWED_TAGS } from './allow-list.js';

const filter = new FilterXSS({
  whiteList: Object.fromEntries(ALLOWED_TAGS.map((tag) => [tag, [...ALLOWED_ATTR]])),
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
});

export const render = (markdown) =>
  filter.process(marked.parse(markdown, { gfm: true }));
```

`stripIgnoreTag` removes an unknown tag rather than escaping it; `stripIgnoreTagBody` takes its
contents too, so a removed `<script>` leaves no source behind.

This is how transformpipe is built: marked for the parse, DOMPurify in the browser, the `xss` package on the
server, one allow-list imported by both, so a document reads the same in the app and on a shared
page. One detail worth stealing: heading ids get a `doc-` prefix. An id becomes a named property on
`window`, and DOMPurify strips ids that look like clobbering risks while a parser-based sanitiser
keeps them — the prefix ends both problems. The case for allow-lists is in
[sanitising Markdown safely](/blog/sanitising-markdown-safely); the same two steps in Python are in
[Markdown to HTML in Python](/blog/markdown-to-html-in-python).

## What to do with this

Write the allow-list before the renderer, and call the sanitiser in the same function as the parse,
so nobody can reach one without the other. Serve user-supplied output under a content security
policy as well: `script-src 'none'` costs nothing on a page that is only ever a document. If you
needed the HTML once rather than a library in your bundle,
[transformpipe](https://transformpipe.com) runs this pipeline in the browser and hands back a
self-contained file.
