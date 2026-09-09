---
title: How to judge a Markdown converter in five minutes
description: Write down what your situation demands, then run one awkward test document through the candidates. Seven checks and a scoring sheet you can copy.
updated: 2026-09-09
date: 2026-06-23
tag: Converting
keywords: best markdown to html converter, markdown converter comparison, markdown editor online, free markdown tool, markdown converter no signup, markdown converter with api, open source markdown converter, how to choose a markdown converter, markdown converter requirements, test a markdown converter
---

Converter landing pages promise much the same things: fast, free, clean HTML. None of it is checkable from the page, and the differences that cost you an afternoon stay invisible until you paste something in. So paste something in. One document and five checks separate the tools that hold up from the ones that surprise you a week later.

### TL;DR

Write down what your situation demands before you open a single tool: a document you are sending a person, a documentation site, user input rendered inside an application, a CI step and a long-term archive want different things, and the tool that is right for one is wrong for the next. Then run one deliberately awkward test document through every candidate in the same sitting, and read the HTML source rather than the preview. Five checks — which flavour it speaks, what it does with a script tag, whether the file stands alone, where your file went, and what the API and the limits actually say — settle most of it in about five minutes. Two more, printing and heading ids, take thirty seconds each and catch the complaints that arrive a month later.

The reason feature lists do not help is that every converter's list is the same list. Tables, code highlighting, live preview, export. What separates them is behaviour under pressure: a file containing something the parser has never seen, a file somebody else wrote, a file that has to open on a machine with no network. None of that is on the page, and none of it is expensive to find out.

This piece is about the criteria and the testing. If what you want is the tools themselves lined up against each other, [the comparison is a separate article](/blog/best-markdown-to-html-converters); what follows is the method you would use to check anything on that list, including the ones added after it was written.

## Requirements first: what your situation actually demands

The most common mistake is not picking the wrong tool. It is picking a tool before deciding what has to be true. Five situations cover nearly everything people convert Markdown for, and each one demands something the others can ignore entirely.

| The situation | What you must demand | What you can safely ignore | The check that settles it |
| --- | --- | --- | --- |
| One document to send a person | A complete HTML file with styles inline and images embedded, no external requests, and the flavour your file already uses | Sanitising, since you wrote the file; an API; batch conversion; heading anchors | Download it, turn the network off, open it on a different machine |
| A documentation site | Stable heading ids, a flavour matching what your writers type, a build that runs unattended and fails loudly | Self-contained output — the site ships its own stylesheet — and privacy of the source, which is public anyway | Build twice from the same input and diff the two HTML outputs |
| Rendering user input inside an application | A sanitiser with an allow-list, applied where the user cannot reach it, and a documented default for raw HTML | Standalone documents, print styling, download buttons, themes | Paste the five attack vectors below and inspect the rendered DOM |
| A CI step | No install, or an install you pin; an exit code that means something; published rate limits; an error body a script can parse | A user interface, history, sharing, editor comfort | Feed it a malformed file and read the exit code and the stderr |
| An archive you must open in ten years | One file per document, no external assets, an open format, and a licence that lets you keep running the tool | An API, sharing, speed, cloud sync | Open last year's export today, offline, in a browser you did not use then |

Read down the second column and the third and the conflict is obvious. The tool that wins the first row — a converter that inlines everything into one heavy file — is a poor fit for the second, where inlining the same stylesheet into four hundred pages is waste. The tool that wins the third row is a library, not a website, and it has no export button at all because it was never meant to hand you a file.

So the first five minutes are not spent on a tool. They are spent writing three lines: what the output has to be, who wrote the input, and where the conversion has to run. Everything after that is verification.

One more distinction is worth making before you start. A converter turns a document into a document. A generator turns a directory into a site. If your answer to "where does the output go" is a URL with navigation, search and cross-links, you are shopping in the wrong category, and no amount of testing converters will fix it.

## The test document

This is deliberately awkward. It carries GitHub Flavored Markdown that plain CommonMark does not recognise, five separate ways of getting script into a page, an image that is not there, and a handful of constructs that quietly separate a careful parser from a careless one.

````markdown
---
title: Converter test
draft: true
---

# Converter test

| Feature    | Status | Notes    |
| ---------- | :----: | -------- |
| Tables     |   ok   | GFM only |
| Task lists |   ok   | GFM only |

- [x] Ticked box
- [ ] Empty box
  - Nested item
    continued on a lazy line

~~Struck through~~, and a bare URL: https://example.com

A line that ends in two spaces,  
and the line that follows it.

A footnote reference.[^1]

[^1]: The footnote body.

```js
const clean = sanitise(rendered);
```

## A heading with punctuation & a "quote"

<script>alert('script tag')</script>

[A link](javascript:alert('href'))

<img src=x onerror="alert('handler')">

<iframe src="https://example.com"></iframe>

<svg onload="alert('svg')"><circle r="10" /></svg>

![Broken image](does-not-exist.png)

Unicode: an em dash — and a ligature: ﬁ
````

Paste it, convert, and read the result — then read the HTML source, not just the preview. A preview can look right while the file behind it is a mess, because the preview is rendered by the tool's own page, with the tool's own stylesheet, in a browser that has already loaded whatever the tool loads.

Every line in that document is there for a reason. This is what each one asks, and what a pass looks like.

| The line | What it probes | A pass looks like |
| --- | --- | --- |
| The `---` block at the top | Front matter handling | It disappears, or it becomes a table. A paragraph of `key: value` lines at the top of your document is a fail |
| `# Converter test` | Whether the tool assumes a title | Either an `<h1>` or the title lifted into `<title>`. Both are defensible; silently dropping it is not |
| The pipe table | GFM tables | A real `<table>` with `<th>` cells and the centre column aligned |
| `- [x]` and `- [ ]` | GFM task lists | `<input type="checkbox" disabled>` inside list items, not literal brackets |
| The nested, lazily continued item | List parsing under pressure | One nested `<li>` whose text runs on. Two separate list items is a fail |
| `~~Struck through~~` | GFM strikethrough | A `<del>` or `<s>` element, not visible tildes |
| The bare URL | GFM autolinks | An `<a href>`. Plain text is CommonMark behaviour, not a bug |
| Two trailing spaces | Hard line breaks | A `<br>` between the two lines |
| `[^1]` and its body | Footnotes, which are in neither specification | A superscript link and a list at the foot, or the raw `[^1]` left visible. Silent removal loses your text |
| The `js` fence | Fenced code and info strings | `<pre><code class="language-js">`, with the code escaped |
| The heading with `&` and quotes | Escaping, and heading ids | `&amp;` in the output, and ideally an `id` you can link to |
| `<script>` | Raw HTML passthrough | Escaped, or removed. Present and intact is a fail |
| The `javascript:` href | URL scheme filtering | The `href` gone, or rewritten. A live `javascript:` link is a fail |
| `onerror=` on an image | Attribute filtering | The attribute stripped. The image may stay; the handler may not |
| `<iframe>` | Embedded documents | Removed, or escaped. An iframe in a document you email is somebody else's page inside yours |
| `<svg onload>` | The vector people forget | The element removed or the handler stripped. SVG is markup, and markup carries handlers |
| The broken image | Path handling | The `src` copied through as written, or the file embedded. Either is fine as long as you know which |
| The em dash and the ligature | Encoding | Both characters intact, with a `<meta charset>` in the head. Mojibake here means mojibake everywhere |

Eighteen lines, one paste. Keep the file: it is short, it belongs next to your documentation, and re-running it takes a minute when a tool changes its sanitiser or its stylesheet.

## Check one: which flavour it speaks

Look at the table and the two checkboxes first. If the table came out as a paragraph of pipe characters and the boxes as literal square brackets, the converter is running plain CommonMark or close to it. That is not a bug: tables and task lists are GitHub Flavored Markdown extensions, and [the flavours genuinely differ](/blog/commonmark-gfm-and-the-flavours) in what they recognise.

It only matters if your documents use those features. A README with a comparison table and a roadmap checklist uses both. Strikethrough and the bare URL are GFM extensions too, so check all four in one pass.

These are the constructs that separate the two dialects, and what each failure looks like on the page rather than in the specification.

| Construct | Written as | CommonMark | GFM | What you see when it is missing |
| --- | --- | --- | --- | --- |
| Tables | Pipes and a delimiter row | No | Yes | A paragraph of pipes and hyphens, wrapped by the browser |
| Task lists | `- [x]` at the start of an item | No | Yes | Literal `[x]` and `[ ]` as the first characters of each bullet |
| Strikethrough | `~~text~~` | No | Yes | Visible tildes around the words |
| Autolinks | A bare `https://` URL | No | Yes | The URL as plain text, unclickable |
| Fenced code | Triple backticks | Yes | Yes | Nothing — both handle it |
| Info strings | A language name after the fence | Yes | Yes | The class may differ; check for `language-js` |
| Footnotes | `[^1]` and a definition | No | No | Raw `[^1]` in the text, or a silently missing paragraph |
| Heading ids | Nothing — they are inferred | No | Added by the renderer, not the parser | Headings with no `id`, and therefore no anchor |
| Raw HTML | An HTML tag in the source | Passed through | Passed through, filtered by GitHub | Depends entirely on the tool; see the next check |
| Line breaks | Two trailing spaces | Yes | Yes | Both lines run together if the tool trims whitespace first |

Two things fall out of that table. Footnotes are in neither specification, so any tool supporting them does so as an extension, and any tool that does not may drop the text rather than leave the marker — check the reference and the body separately. And heading ids are not a parsing feature at all: GitHub adds them when it renders, which is why a heading anchor that works on github.com may simply not exist in the HTML your converter produces.

If your documents live on GitHub and render correctly there, GFM is your requirement and a CommonMark-only tool will lose four things silently. If your documents are prose with headings and links, plain CommonMark is enough and the flavour question is settled in ten seconds.

## Check two: what it does with the script tag

Markdown allows raw HTML, and most parsers hand it straight to the output; a few escape it by default and pass it through only when asked to. Either way, sanitising is a separate decision the tool made, with three possible outcomes.

| Outcome in the HTML source | What it means |
| --- | --- |
| `&lt;script&gt;` and the tag visible in the page | Raw HTML is escaped. Safe, and fine for your own files |
| No trace of the script, `onerror`, or the `javascript:` href | A sanitiser ran against an allow-list |
| `<script>` intact, or `onerror=` still on the image | Nothing filtered it |

The third outcome only bites when the Markdown came from somewhere other than your own machine — a pull request description, a support ticket, a language model's output. In the test the alert box is harmless; with a stranger's Markdown it is not, and it runs on whatever page you paste the result into.

Do not settle for testing one vector. A tool can strip `<script>` and miss everything else, because removing a tag by name is easy and reasoning about attributes and URL schemes is not. Search the output for each of these in turn.

| Vector | What it does if it survives | What a safe tool returns |
| --- | --- | --- |
| `<script>alert('script tag')</script>` | Runs arbitrary code the moment the page loads | The element gone entirely, or the whole thing escaped to `&lt;script&gt;` text |
| `<img src=x onerror="alert('handler')">` | Runs code when the deliberately broken image fails to load, which is immediately | The `<img>` may remain; `onerror` is stripped from it. Any `on*` attribute is a handler |
| `[A link](javascript:alert('href'))` | Runs code when the reader clicks something that looks like an ordinary link | The `href` removed, emptied or rewritten. Allow-listed schemes are usually `http`, `https`, `mailto` and `#` |
| `<iframe src="https://example.com"></iframe>` | Loads a third party's page inside yours, with their scripts and their cookies | The element removed. An iframe is rarely something a Markdown document needs |
| `<svg onload="alert('svg')">…</svg>` | Runs code through markup people forget is markup. SVG can also carry its own `<script>` | The element removed, or the handler and any nested script stripped from it |

A tool that removes all five is running an allow-list: it keeps the elements and attributes it knows about and discards everything else. A tool that removes some and not others is running a deny-list, which is a losing position — the list of dangerous things grows and the list of safe things does not. The [details of doing this properly](/blog/sanitising-markdown-safely) matter even if you never write a sanitiser yourself, because they tell you which of the two you are looking at.

One more thing to check while you are here: where the sanitising happens. A converter that sanitises in the browser and not on the server has protected its own preview and nothing else, because a script can post straight to the endpoint and skip the page. If the tool has an API, run the same vectors through it and compare the two outputs.

## Check three: whether the output stands alone

Download the file, turn off your network, and open it. Then search the source for `<link`, `<script` and `http`.

A bare fragment gives you `<h1>` and `<p>` and nothing else: correct HTML, opens as unstyled text. A full document that pulls its stylesheet or its highlighter from a CDN looks right today and breaks on a plane, on an intranet, or when the CDN moves. A self-contained file has its styles inline, no scripts and no requests. That is the one you can email to somebody.

The searches are worth doing one at a time, because each answers a different question.

| Search the source for | If you find it | What it costs you |
| --- | --- | --- |
| `<!DOCTYPE` | Good — this is a document, not a fragment | Without it you have `<h1>…</h1><p>…</p>` and a browser rendering at its default width |
| `<meta charset` | Good — the encoding is declared | Without it, the em dash and the ligature become mojibake on somebody else's machine |
| `<link rel="stylesheet"` | The styles live somewhere else | The file is unstyled the moment that somewhere else is unreachable |
| `<style>` | Good — the styles are in the file | Nothing; this is what you want for a document you send |
| `<script` | Something wants to run | At best a highlighter, at worst a tracker. Either way the file is no longer inert |
| `http://` or `https://` in a `src` or `href` | An asset is fetched when the file is opened | Fonts, images and highlighters that vanish offline, and a record of the file being opened |
| `data:image` | An image is embedded in the file | A bigger file, and one that opens anywhere. This is usually the trade you want |

[What "self-contained" actually means](/blog/self-contained-html-explained) is worth reading before you demand it, because tools use the phrase loosely: some mean "a full document" and some mean "asks the network for nothing", and only the second survives the aeroplane.

The missing image is in the test for the same reason. A converter copies an image `src` through as written unless you ask it to embed the file, so a relative path resolves against wherever the HTML lands, not where the Markdown lived. Move the HTML one directory up and every relative image breaks — without an error, without a warning, and usually without anybody noticing until the recipient mentions it.

## Check four: where your file goes, and whether it stays

Open the browser's network tab before you convert. Either the file is uploaded or it is not, and the request list settles it. Conversion in the browser means the document never leaves your machine; it also means there is nothing to come back to tomorrow.

This is the check most worth doing rather than trusting, because it is the one every tool makes the same claim about. Four steps, in order, none longer than a minute.

1. **Watch the network tab.** Open it, clear it, convert the test document, and read the list. A conversion that happens on your machine shows no request carrying your file. A conversion that uploads shows a `POST` with your content in it, and you can open that request and read exactly what was sent.
2. **Convert with the network off.** Load the page, then disconnect, then convert. A browser-side tool keeps working. A server-side tool fails, which is not a criticism — it is an answer, and a definitive one.
3. **Find the retention sentence.** Not the marketing line about privacy: the sentence that says how long an uploaded file is kept and what deletes it. If the privacy policy contains no duration, the honest reading is that there is no policy.
4. **Read the terms for the licence clause.** Many hosted tools take a licence to store and process what you upload, which they need in order to function at all. What matters is the scope: whether it ends when you delete the file, and whether it extends to anything beyond running the service.

[Whether an online converter is safe](/blog/is-an-online-converter-safe) has an actual answer for any given tool, and it is usually visible in fifteen minutes of reading plus the two tests above.

That is the real trade-off, not privacy against convenience. A tool with no account cannot keep a history, cannot give you a link to send someone, and cannot offer an API. A tool with an account does all three and now holds your documents. If the answer is "neither, I want this in a script", stop evaluating websites and use a library or a command-line converter; and if you need PDF, DOCX or LaTeX out the other end, Pandoc converts to all three and is free software under the GPL (checked on pandoc.org, 9 September 2026); a browser converter that hands you one HTML file is not competing for that job.

There is a middle position worth knowing about: a tool that converts in the browser while you are signed out and stores documents only once you ask it to. It gives you the network-tab answer by default, and history and sharing when you decide the trade is worth making. The point is that the decision is yours and it is visible, rather than made for you in a paragraph you did not read.

## Check five: the API, the keys and the limits

If a converter offers an API, four questions settle it, and the documentation should answer all four before you sign up:

- [ ] Can a key be revoked, and does revoking it take effect immediately?
- [ ] Is the key stored hashed, or could support read it back to you?
- [ ] What is the rate limit, and what does the response look like when you cross it?
- [ ] What happens when the account is full — a refused write, or a quiet deletion of something older?

The last one is the one people skip. A tool that drops your oldest document to make room for the new one has decided something about your data, and you find out at the worst moment. Refusing the write is the honest behaviour.

Before any of that, look at the request shape. An API you can build on is one you can call with `curl` and understand from the response alone, without an SDK to translate for you.

```bash
# The shape to look for: one endpoint, a bearer key, the document as the body
curl -sS -X POST "https://api.example.com/v1/documents?name=README.md" \
     -H "Authorization: Bearer <key>" \
     --data-binary @README.md

# And the refusal you can act on: a status that means something, and a body a script can parse
# HTTP/1.1 413
# { "error": "document is over 4 MB" }
```

Three things in that exchange are worth insisting on. The key travels in a header rather than a query string, so it does not end up in server logs and browser history. The body is the document itself rather than a JSON envelope with the file base64-encoded inside it, which keeps the size down and removes an encoding step from your script. And the failure is a status code plus a parseable body, so a CI job can tell "too big" from "too fast" from "not yours" without reading English.

Then push past the happy path deliberately. Send a file over the limit and read the status. Send twenty requests in a second and read the status. Send a bad key, and a key belonging to a different account. A well-built API answers `413`, `429`, `401` and `404` in those four cases, with a body explaining which; a poorly built one answers `500` four times, or `200` with an error message hidden in the HTML.

Published limits are the other half of the same question. A limit you can read is a limit you can design around; a limit discovered in production is an outage. TransformPipe caps an account at 100 MB and 500 documents, a conversion at 10 MB, a kept document at 4 MB and a caller at 60 requests a minute; reaching a limit refuses the write rather than deleting anything, and the endpoints, the statuses and the key format are in [the documentation](/docs). The 4 MB figure is a platform constraint rather than a preference — the function underneath refuses a request or a response body larger than 4.5 MB — which is the kind of thing worth stating rather than hiding, because it tells you the shape of what you are standing on.

If you are wiring conversion into a build or a bot rather than clicking a button, [what to demand from a document conversion API](/blog/converting-documents-with-an-api) goes further into request shapes, retry behaviour and the failure modes that only matter in a pipeline.

## Two more checks, and a sheet to score all seven on

Five checks cover the ways a converter fails loudly. Two more cover the ways it fails quietly, and neither takes longer than thirty seconds.

**What the output does when printed.** Open the print preview. A dark theme that stays dark on paper wastes a cartridge and makes the document unreadable in the one format people still hand to each other in meetings. Check three things: whether the colours flip to light values, whether code blocks wrap instead of being cut off at the page edge, and whether link URLs are printed alongside the link text or lost entirely. A document with fourteen links that prints as fourteen underlined phrases has thrown away most of its content. TransformPipe writes one self-contained file with inline styles and no scripts, and flips to light values when printed; whatever tool you use, look at the preview once before trusting it with something you will print.

**Whether the headings carry ids you can link to.** Search the output for `id="` next to an `<h2>`. If the ids are missing, you cannot link to a section, you cannot build a contents list without writing JavaScript, and a colleague quoting your document has to say "the bit about limits" instead of sending a URL. If the ids exist, check that they are derived from the heading text rather than being `heading-3` — a positional id changes the moment somebody inserts a section above it, which breaks every link that was ever sent. The heading with punctuation in the test document is there to show how the id is built: a good one slugs the text, drops the punctuation, and produces the same id every time that heading is converted.

Both of those matter more for documentation than for a one-off document, which is the theme of the whole exercise. The checks do not have universal weights, and a fail in a row you do not care about is not a fail.

Here is the sheet. Copy it, fill in one column per candidate, and mark each cell pass, fail or not applicable.

| # | Check | Pass looks like | Tool A | Tool B |
| --- | --- | --- | --- | --- |
| 1 | Flavour | Table renders, boxes are checkboxes, strikethrough struck, bare URL linked | | |
| 2 | Sanitising | All five vectors neutralised, on the server as well as in the browser | | |
| 3 | Standalone | Doctype, charset, inline `<style>`, no `http` in any `src` or `href` | | |
| 4 | Privacy | The network tab confirms the claim, and a retention duration exists in writing | | |
| 5 | API and limits | Bearer key, parseable errors, `413` and `429` where expected, published limits | | |
| 6 | Print | Light colours on paper, code wrapped, links legible | | |
| 7 | Heading ids | An `id` on every heading, derived from the text, stable between runs | | |
| — | Front matter | Removed or rendered as a table, not as a paragraph of `key: value` | | |
| — | Encoding | Em dash and ligature intact, `<meta charset>` present | | |
| — | Footnotes | Rendered, or left as a visible marker. Not silently dropped | | |

The three unnumbered rows catch people who convert files from other systems: notes exported from a documentation tool, documents written on a different operating system, academic prose. Score them if your files come from anywhere other than your own editor.

Weight the rows before you total them. For a document you are sending someone, rows three and six are worth more than the rest put together, and row two is irrelevant. For user input inside an application, row two is the whole test and rows three and six do not apply. A sheet with equal weights produces a tidy number and the wrong tool.

## What five minutes cannot tell you

A test document is a good instrument and a narrow one. It tells you what a tool does today, with one file, in your browser. Three things it cannot tell you are the three most likely to matter later.

**A score cannot tell you that you are scoring the wrong category of tool.** A static site generator fails almost every check above — it does not hand you a file, it does not sanitise, it has no API, and it wants a configuration file and a build step — and it is still the correct answer if you are publishing forty pages that link to each other. The sheet measures how well a tool does the job you tested it on, and says nothing about whether that was the job you needed doing.

**A five-minute test cannot tell you what a tool will be like in a year.** It cannot see a change of ownership, a pricing page appearing, an API gaining a required parameter, or a maintainer who stops answering. What it can see are the properties that predict those things. Licence is one: an MIT or BSD library cannot be taken away from you, because the copy you have stays licensed to you whatever happens next. Ownership is another: an independent open-source project, a company with a paid product, and a free hosted service with no visible business model all fail in different ways and on different timescales, and the third is the one that disappears without notice. Whether it can run offline is the third: a tool that runs on your machine keeps working when the company does not, and a tool that runs on somebody's server is exactly as durable as that server.

**A test document cannot tell you what your own documents contain.** The file above is a sampler; your real files have their own habits — a table with a hundred rows, a gallery of screenshots, a code block in a language nobody highlights, a heading level jumping from two to four. Run one real document through as well, ideally the largest and ugliest you have. Half the problems people report with converters are not converter problems at all; they are one unusual file the tool was never shown.

### The criteria, in order

1. **Decide the destination before you open a tool.** A person, a site, an application, a pipeline or an archive — the answer eliminates most of the market immediately, and skipping this step is how people end up evaluating a site generator against a converter and concluding that both are disappointing.
2. **Match the flavour to the files you actually have.** If your documents contain tables or task lists, a CommonMark-only parser loses them silently, and you find out when a colleague asks why the comparison table is a wall of pipe characters.
3. **Decide about sanitising by asking who wrote the file.** For your own notes it does not matter at all; for anything that arrived from outside, either the converter sanitises against an allow-list or you do, and there is no third option that ends well.
4. **Insist on a document, not a fragment.** A converter that returns `<h1>…</h1><p>…</p>` has behaved correctly as a library and failed as a tool, and the difference is visible the moment somebody other than you opens the file.
5. **Verify the privacy claim instead of reading it.** The network tab answers in ten seconds what a privacy policy takes a page to imply, and the answer is either "nothing was sent" or "here is precisely what was sent".
6. **Check the failures, not the successes.** Anything converts a paragraph. What separates tools is the response to a file over the limit, a malformed table, a bad key and twenty requests in a second — and those responses are what your automation will spend its life handling.
7. **Prefer the property that outlasts the test.** A permissive licence, code you can run offline, an open output format and published limits are all checkable today and all still true in three years, which is more than a feature list can claim.

Run the test document through the tool you use now and the one you are considering, in one sitting: same input, two sources to diff. Most of the time the incumbent wins on one row and loses on another, and the sheet turns a vague preference into a decision you can explain to somebody else. If the row you lose on is the self-contained export, [converting Markdown to HTML in the browser](/) is the shortest way to fix it, free and with nothing to install; if the row you lose on is flavour or sanitising, the fix is usually a different library rather than a different website. Either way, keep the file. The next tool you evaluate takes five minutes instead of an afternoon.

## FAQ

### What should I test a Markdown converter with?

One deliberately awkward document rather than a paragraph of prose: a GFM table, task lists, strikethrough, a bare URL, a fenced code block, front matter, a footnote and the five raw-HTML attack vectors. Add one real file of your own, ideally the longest and strangest you have, because your documents contain habits no sampler covers.

### How do I know whether a converter sanitises?

Convert a document containing `<script>`, an `onerror` attribute, a `javascript:` link, an `<iframe>` and an `<svg onload>`, then read the HTML source rather than the preview. If all five are gone or escaped, an allow-list ran; if some survive, the tool is filtering by name and will miss the next vector too.

### Does it matter if the converter only supports CommonMark?

Only if your files use the four things CommonMark leaves out: tables, task lists, strikethrough and bare-URL autolinks. Prose with headings, lists, links and code blocks renders identically either way, so check your own documents before treating flavour as a deciding factor.

### Is a converter that runs in the browser always more private?

It is more private in the sense that matters most — the file is not transmitted, and you can confirm that in the network tab in ten seconds. It is not automatically safer in every sense, because a browser-side tool still renders whatever HTML the document contains, so the sanitising question is separate and applies just as much.

### How do I check a converter without installing anything?

Open the tool, open the browser's developer tools, paste the test document and convert. The network tab answers the privacy question, the elements panel answers the sanitising question, and the downloaded file answers the standalone question — three of the seven checks, with no install and no account.

### What should I look for in a converter's API before I build on it?

A key sent as a bearer header rather than a query parameter, revocation that takes effect immediately, keys stored hashed, published rate and size limits, and error responses that are a meaningful status code plus a parseable body. Then test the refusals deliberately, because a pipeline spends most of its life on the unhappy path.

### How often should I re-run the test?

Whenever a tool announces a change to its renderer, its sanitiser or its stylesheet, and once a year regardless. It takes a minute once the file exists, and a converter's behaviour changing under you is a normal event rather than a scandal — you simply want to be the one who notices.
