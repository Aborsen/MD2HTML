---
title: How to judge a Markdown converter in five minutes
description: A short test document and five checks that tell you what a Markdown to HTML converter's landing page will not: flavour, sanitiser, output, privacy, API
date: 2026-06-23
tag: Converting
keywords: best markdown to html converter, markdown converter comparison, markdown editor online, free markdown tool, markdown converter no signup, markdown converter with api, open source markdown converter
---

Converter landing pages promise much the same things: fast, free, clean HTML. None of it is checkable from the page, and the differences that cost you an afternoon stay invisible until you paste something in. So paste something in. One document and five checks separate the tools that hold up from the ones that surprise you a week later.

## The test document

This is deliberately awkward. It carries GitHub Flavored Markdown that plain CommonMark does not recognise, three separate ways of getting a script into a page, and an image that is not there.

````markdown
# Converter test

| Feature    | Status | Notes    |
| ---------- | :----: | -------- |
| Tables     |   ok   | GFM only |
| Task lists |   ok   | GFM only |

- [x] Ticked box
- [ ] Empty box

~~Struck through~~, and a bare URL: https://example.com

```js
const clean = sanitise(rendered);
```

<script>alert('script tag')</script>

[A link](javascript:alert('href'))

<img src=x onerror="alert('handler')">

![Broken image](does-not-exist.png)
````

Paste it, convert, and read the result — then read the HTML source, not just the preview. A preview can look right while the file behind it is a mess.

## Which flavour it speaks

Look at the table and the two checkboxes first. If the table came out as a paragraph of pipe characters and the boxes as literal square brackets, the converter is running plain CommonMark or close to it. That is not a bug: tables and task lists are GitHub Flavored Markdown extensions, and [the flavours genuinely differ](/blog/commonmark-gfm-and-the-flavours) in what they recognise.

It only matters if your documents use those features. A README with a comparison table and a roadmap checklist uses both. Strikethrough and the bare URL are GFM extensions too, so check all four in one pass.

## What it does with the script tag

Markdown allows raw HTML, and most parsers hand it straight to the output; markdown-it is a notable exception, escaping it unless its `html` option is on. Either way, sanitising is a separate decision the tool made, with three possible outcomes.

| Outcome in the HTML source | What it means |
| --- | --- |
| `&lt;script&gt;` and the tag visible in the page | Raw HTML is escaped. Safe, and fine for your own files |
| No trace of the script, `onerror`, or the `javascript:` href | A sanitiser ran against an allow-list |
| `<script>` intact, or `onerror=` still on the image | Nothing filtered it |

The third outcome only bites when the Markdown came from somewhere other than your own machine — a pull request description, a support ticket, a language model's output. In the test the alert box is harmless; with a stranger's Markdown it is not, and it runs on whatever page you paste the result into. The [details of doing this properly](/blog/sanitising-markdown-safely) matter even if you never write a sanitiser yourself.

## Whether the output stands alone

Download the file, turn off your network, and open it. Then search the source for `<link`, `<script` and `http`.

A bare fragment gives you `<h1>` and `<p>` and nothing else: correct HTML, opens as unstyled text. A full document that pulls its stylesheet or its highlighter from a CDN looks right today and breaks on a plane, on an intranet, or when the CDN moves. A self-contained file has its styles inline, no scripts and no requests. That is the one you can email to somebody.

The missing image is in the test for the same reason. A converter copies an image `src` through as written unless you ask it to embed the file, so a relative path resolves against wherever the HTML lands, not where the Markdown lived.

Print it too, or open the print preview. A dark theme that stays dark on paper wastes a cartridge. transformpipe writes one self-contained file with inline styles and no scripts, and flips to light values when printed.

## Where your file goes, and whether it stays

Open the browser's network tab before you convert. Either the file is uploaded or it is not, and the request list settles it. Conversion in the browser means the document never leaves your machine; it also means there is nothing to come back to tomorrow.

That is the real trade-off, not privacy against convenience. A tool with no account cannot keep a history, cannot give you a link to send someone, and cannot offer an API. A tool with an account does all three and now holds your documents. If the answer is "neither, I want this in a script", stop evaluating websites and use a library or [a command-line tool](/blog/markdown-to-html-from-the-command-line); and if you need PDF, DOCX or LaTeX out the other end, Pandoc is the right answer and no browser tool will match it.

## The API, the keys and the limits

If a converter offers an API, four questions settle it, and the documentation should answer all four before you sign up:

- [ ] Can a key be revoked, and does revoking it take effect immediately?
- [ ] Is the key stored hashed, or could support read it back to you?
- [ ] What is the rate limit, and what does the response look like when you cross it?
- [ ] What happens when the account is full — a refused write, or a quiet deletion of something older?

The last one is the one people skip. A tool that drops your oldest document to make room for the new one has decided something about your data, and you find out at the worst moment. Refusing the write is the honest behaviour. transformpipe caps an account at 100 MB and 500 documents, a conversion at 10 MB, a kept document at 4 MB and a caller at 60 requests a minute; reaching a limit refuses the write rather than deleting anything. The endpoints and the key format are in [the documentation](/docs).

## Run it twice

Pick the tool you use now and the one you are considering, and put the test document through both in one sitting: same input, two sources to diff. Then keep the file. It is short, it belongs next to your documentation, and re-running it takes a minute when a tool changes its sanitiser or its stylesheet.
