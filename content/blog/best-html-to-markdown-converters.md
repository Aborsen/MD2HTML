---
title: "Best HTML to Markdown Converters in 2026: Compared and Tested"
description: HTML to Markdown converters in 2026 compared — online tools, libraries, extractors and clippers — by what they keep, what they drop, and where the article goes.
date: 2026-09-08
tag: Converting
keywords: best html to markdown converter, html to markdown converter online, convert html file to markdown, web page to markdown, turndown alternative, html to markdown command line, save a web page as markdown, convert html to markdown without upload
---

Converting HTML to Markdown is not a translation. It is a demolition with a list of things to keep. HTML can express a three-column layout, a table nested inside a table cell, a colour on one word and a component that only exists once JavaScript has run. Markdown can express headings, paragraphs, emphasis, lists, links, images, code and — if the flavour allows it — a flat table. Every converter on this page is deciding what to throw away, and they disagree.

### TL;DR

Pick by what your HTML is. For a **clean fragment or a hand-written page**, almost any converter works and the differences are cosmetic. For a **whole saved page**, the conversion is the easy half — the hard half is finding the article inside the navigation, the cookie banner and the footer, which is what an extractor like Readability does before a converter ever runs. For **a file you have on disk and one conversion to do**, a browser-side tool is the shortest path and nothing is uploaded, and the free ones are covered below. For **a build or a script**, use the library for your language: Turndown in JavaScript, markdownify or html2text in Python, Pandoc when the output has to be more than Markdown.

## Why "it converts HTML" tells you almost nothing

HTML to Markdown has two stages and most tools only admit to one. The first is extraction: deciding which part of the document is the document. The second is translation: turning the elements you kept into Markdown syntax. A library that does the second perfectly and skips the first will hand you a beautiful Markdown rendering of a navigation menu, a newsletter signup and a list of related articles, with the article somewhere in the middle.

That split explains most of the disappointment. Somebody saves a page from a browser, drops the `.html` file into a converter, and gets four hundred lines of link lists before the first paragraph. The converter did its job. Nobody had done the other one. Extractors exist for this — Readability is the best-known, and it is the machinery behind Firefox's Reader View — and the browser extensions that clip pages to Markdown are extractor and converter stapled together, which is why they feel so much better on a real web page than a bare library does.

Then there is the question of what survives translation, and this is where converters actually differ. Tables are the loudest example: they are not in the CommonMark specification, so a converter has to implement GitHub Flavored Markdown tables on purpose, and the ones that do not will flatten a `<table>` into a run of paragraphs or pass the raw HTML through untouched. Task lists, strikethrough, definition lists, footnotes, `<figure>` and `<figcaption>`, `<sup>` and `<sub>`, and code blocks with a language on them are all in the same category: implemented by some, ignored by others, and never mentioned on a comparison page.

Last, there is what happens to everything Markdown has no words for. A converter has three options and each is defensible. It can drop the construct, which loses information silently. It can emit raw HTML inline, which keeps the information and makes the Markdown less portable, since the next tool down the line may escape it. Or it can approximate — a nested table becomes a flattened one, a styled `<span>` becomes plain text. Knowing which of the three your tool picks is more useful than any feature list, because it is the difference between a file you can read and a file you have to repair.

## Quick comparison: the cheat sheet

| Tool | Best for | Key capability | Price |
| --- | --- | --- | --- |
| transformpipe | One file or one saved page, converted now | Browser-side conversion, strips page furniture, keeps tables and task lists | Free |
| Turndown | JavaScript apps and browser extensions | The default JS converter; rules you can override; GFM plugin for tables | Free, MIT |
| Pandoc | HTML that must become several formats | Reads HTML, writes ~40 formats, keeps or refuses raw HTML on request | Free, GPL |
| html2text | Python scripts wanting readable plain text | CLI plus library, reference-style links, link stripping | Free, GPLv3 |
| markdownify | Python scripts wanting faithful structure | BeautifulSoup-based, per-tag options, table handling | Free, MIT |
| node-html-markdown | Converting a great deal of HTML | Bundles an HTML parser, so no DOM is needed | Free, MIT |
| html-to-md | A small dependency in a JS bundle | Small, dependency-free, handles table elements | Free, MIT |
| html-to-markdown (Go) | A CLI and a Go library from one project | Installable binary, table plugin with alignment and spans | Free, MIT |
| Mozilla Readability | Finding the article inside a page | Extraction, not conversion — outputs cleaned HTML | Free, Apache 2.0 |
| Postlight Parser | Extraction with Markdown output built in | `contentType` of html, markdown or text | Free, Apache 2.0 / MIT |
| MarkDownload | Clipping the page you are looking at | Readability then Turndown, in the browser toolbar | Free, Apache 2.0 |
| Obsidian Web Clipper | Clipping straight into a vault | Extraction and conversion via defuddle, templates, sanitising | Free, MIT |
| Notion Web Clipper | Saving pages into Notion | Saves to Notion blocks; Markdown only via a later export | Free plan available |
| Browser "Save page as" | Getting the HTML in the first place | Not a converter — the source of most bad input | Free |

## The best HTML to Markdown converters in 2026

### transformpipe — best for a file or a saved page you want converted now

transformpipe takes an `.html`, `.htm` or `.xhtml` file and returns Markdown in your browser. There is no install and no account required, and signed out the file is never sent anywhere: it is read, converted and rendered on your own machine.

| Pros | Cons |
| --- | --- |
| Nothing is uploaded when you are signed out | One document at a time, not a crawler |
| Removes the page furniture before converting, not after | Not an extractor: it cuts by element, not by reading the page |
| Tables, strikethrough, code blocks and task lists survive | The browser does the work, so a very large file is limited by the machine |
| The same conversion runs in the API, the CLI, the GitHub Action and the MCP server | No per-tag configuration |

**Price:** free. An account adds history, sharing and an API, also free.

**Technical details and features**

- Built on node-html-markdown, which parses with node-html-parser rather than a DOM — so the identical conversion runs in a browser tab, in a CI job and behind the API, rather than one implementation for each
- `<script>`, `<style>`, `<noscript>`, `<template>`, `<svg>`, `<iframe>`, `<head>`, `<nav>` and `<footer>` are removed before translation, along with HTML comments
- Tables and strikethrough are handled by the parser; checkbox inputs inside list items are translated back into `- [x]` and `- [ ]`, so a task list arrives as a task list
- Runs of blank lines are collapsed, which is what a converted page otherwise arrives full of
- Also converts Word, CSV, TSV and JSON to Markdown, and Markdown back to a self-contained HTML file

**Who should use it?** Anybody with a file and a reason not to hand it to a server — a saved export, a page from an internal wiki, a client's document. If you want the reverse trip afterwards, [the Markdown to HTML side is a different comparison entirely](/blog/best-markdown-to-html-converters), with different failure modes.

### Turndown — best JavaScript library, and the one everything else is measured against

Turndown is an HTML to Markdown converter written in JavaScript, and it is the default choice in the JS world by a wide margin. It works in the browser and in Node, and its rule system is the reason it turns up inside so many other tools: you can replace the handler for any element without forking anything.

| Pros | Cons |
| --- | --- |
| Rules are replaceable per element, which makes odd HTML tractable | Tables need the GFM plugin; the core does not do them |
| Runs in the browser and in Node | Works through a DOM rather than its own parser |
| Widely used, so its behaviour is well documented by other people's bug reports | No extraction: it converts whatever you give it, furniture included |
| `keep`, `remove` and the `blankReplacement` option give you three ways to handle what you do not want | Configuration is code, not flags |

**Price:** free, MIT licensed (checked on github.com, 8 September 2026).

**Technical details and features**

- `addRule` registers a handler against a tag name, a list of tag names or a filter function; `keep` leaves an element as raw HTML; `remove` deletes it and its contents
- Options for heading style (ATX or setext), bullet marker, code fence character, emphasis and strong delimiters, and link style — including reference-style links
- `turndown-plugin-gfm` adds tables, strikethrough and other GitHub Flavored Markdown constructs
- Because it is a DOM-based converter, the document you feed it is the document a browser would build — malformed HTML is repaired by the parser before Turndown sees it

**Who should use it?** JavaScript developers, and anybody writing a browser extension or an editor paste handler. Its ubiquity is a feature: when a page converts badly, somebody has usually already written the rule.

### Pandoc — best when the HTML has to become more than Markdown

Pandoc is a command line document converter written in Haskell that reads and writes around forty formats. HTML in and Markdown out is one of its smaller jobs, and the reason to use it is usually that Markdown is not the last stop.

| Pros | Cons |
| --- | --- |
| One tool for HTML to Markdown, and from Markdown to almost anything | Requires an install and a terminal |
| Its Markdown writer can emit or refuse raw HTML, on request | Its extended Markdown dialect is not GFM unless you ask for GFM |
| Lua filters let you rewrite the document mid-conversion | No extraction: a whole page converts as a whole page |
| Handles very large documents without a browser in the way | The number of options is its own learning curve |

**Price:** free, GPL licensed.

**Technical details and features**

- `pandoc -f html -t gfm` selects GitHub Flavored Markdown as the output, which is what you want if tables and task lists matter
- Anything Markdown cannot express falls back to raw HTML in the output; disabling the `raw_html` extension on the writer is how you refuse that and take the loss instead
- `--wrap=none` stops it hard-wrapping paragraphs, which otherwise makes diffs unreadable in a repository
- Lua filters and templates operate on its internal document model, so you can drop or rewrite whole classes of element before the Markdown is written

**Who should use it?** Anybody converting on a schedule, converting many files, or converting HTML into something that is not Markdown at all. It is also the right answer when the Markdown has to be checked into a repository and stay diffable.

### html2text — best for Python when you want it readable

html2text is a Python script and library that converts HTML into readable, plain, ASCII-ish text that also happens to be valid Markdown. The emphasis is on readable: it was written to make web pages pleasant to read as text, and its defaults reflect that.

| Pros | Cons |
| --- | --- |
| A command line tool and a library from one install | GPLv3, which some projects cannot take |
| Options for reference-style links, ignoring links, ignoring images | Output is tuned for reading, not for round-tripping |
| Long-standing and stable | Table handling is weaker than the structure-first libraries |
| Sensible line wrapping for text output | Not a fit for HTML with heavy nesting |

**Price:** free, GPLv3 licensed (checked on github.com, 8 September 2026).

**Technical details and features**

- Runs as `html2text [filename [encoding]]` or as a library from Python
- `--ignore-links` and `--ignore-images` strip the parts that make text output noisy; `--reference-links` moves URLs to the bottom instead of inline
- `--escape-all` escapes special characters aggressively, which matters when the source text contains Markdown punctuation
- `--mark-code` marks program code blocks with `[code]` and `[/code]`; `--backquote-code-style` is the one that emits triple-backquote fences

**Who should use it?** Python scripts producing text for humans or for a search index — email bodies, digests, notification text. If what you need is a faithful structural copy of the HTML, the next entry is the better fit.

### markdownify — best Python library for keeping the structure

markdownify converts HTML to Markdown using BeautifulSoup as its parser, with per-tag options. Where html2text optimises for readable text, markdownify optimises for a faithful mapping of the elements it recognises.

| Pros | Cons |
| --- | --- |
| MIT licensed, which is easier to adopt than GPLv3 | Pulls in BeautifulSoup, so it is not dependency-free |
| Options per tag, including how to handle tables with no header row | Slower than the compiled and parser-owning options |
| Convert or strip specific tags by name | No extraction stage |
| Familiar to anybody already using BeautifulSoup | Fewer command line conveniences than html2text |

**Price:** free, MIT licensed (checked on github.com, 8 September 2026).

**Technical details and features**

- Built on BeautifulSoup, and its parser options are passed through, so you choose the underlying HTML parser
- `strip` and `convert` lists let you name the tags to remove or the only tags to keep
- `table_infer_header` decides what happens to a table with no header row, which is the single most common table problem in real HTML
- Heading style, bullet characters and code language handling are all configurable

**Who should use it?** Python code that has to preserve document structure — importing a legacy CMS, converting a documentation export, feeding Markdown to a model that will be confused by a wall of text.

### node-html-markdown — best for converting a lot of HTML

node-html-markdown is a TypeScript HTML to Markdown converter whose stated purpose is throughput. It parses with node-html-parser instead of relying on a DOM, which is both why it is quick and why it runs in places a DOM-based library cannot.

| Pros | Cons |
| --- | --- |
| No DOM required, so it runs anywhere JavaScript does | A smaller community than Turndown's |
| Built for volume by design | Custom translators are its own API, not Turndown's |
| Handles tables and strikethrough without a plugin | Some element handling is opinionated and has to be overridden |
| Custom translators per element | No extraction |

**Price:** free, MIT licensed (checked on github.com, 8 September 2026).

**Technical details and features**

- Carrying its parser as a dependency means the same code path in a browser, in Node, in a worker and in a serverless function — no DOM shim to install
- Translators are registered per element name and can replace, ignore, or refuse to recurse into a node
- Options for bullet marker, code fence, emphasis and strong delimiters, and whether to keep data-URI images
- The project's README states it was written to convert very large volumes of HTML; treat published throughput figures as the project's own claim, not an independent benchmark

**Who should use it?** Anybody converting HTML in bulk or in an environment without a DOM. It is also the engine underneath this site's own converter, for exactly that reason: one conversion that behaves the same in a browser tab and on a server.

### html-to-md — best small dependency

html-to-md is a small JavaScript converter with no dependencies, usable in Node and in the browser through a bundler. It is the option to reach for when the converter is a detail in a larger bundle rather than the point of the project.

| Pros | Cons |
| --- | --- |
| Small and dependency-free | Fewer extension points than Turndown |
| Documented list of supported tags, tables included | Smaller ecosystem, so fewer worked examples |
| Works in Node and in the browser | Not aimed at unusual or badly nested HTML |

**Price:** free, MIT licensed (checked on github.com, 8 September 2026).

**Technical details and features**

- Supported tags are documented explicitly, and include `table`, `thead`, `tbody`, `tr`, `th` and `td`
- No dependencies, so it adds one module rather than a tree
- `skipTags`, `emptyTags` and `ignoreTags` decide what is dropped and whether its contents go with it; `aliasTags` maps an unusual tag onto a handler that exists; `tagListener` hands you a single tag to handle yourself

**Who should use it?** Front-end projects where bundle size is a real constraint and the HTML being converted is reasonably well behaved.

### html-to-markdown (Go) — best if you want a binary and a library

JohannesKaufmann's html-to-markdown is a Go library with a command line tool built from it. That combination is the appeal: the same conversion in a shell pipeline and inside a Go service.

| Pros | Cons |
| --- | --- |
| A real CLI, installable as a binary with no runtime to manage | Go only, for library use |
| Table plugin implements GFM tables, including alignment and spans | Plugin set is smaller than the JS libraries' |
| Reads from a file or from standard input | Less written about than Turndown, so fewer examples |
| Fast, and no Node or Python needed on the machine | No extraction |

**Price:** free, MIT licensed (checked on github.com, 8 September 2026).

**Technical details and features**

- `html2markdown --input file.html --output file.md`, or HTML piped in on standard input
- Distributed as a Homebrew formula, a Debian package, pre-compiled binaries and a `go install`
- A table plugin implementing GitHub Flavored Markdown tables with alignment, `rowspan` and `colspan` handling
- Rules can be added in Go for elements the defaults get wrong

**Who should use it?** Go services, and anybody who wants HTML to Markdown in a shell script on a machine where installing Node or Python is a nuisance.

### Mozilla Readability and Postlight Parser — best for finding the article

These two are not converters, and that is the reason to know about them. Readability takes a page and returns the article: title, byline, and the content as cleaned HTML with the navigation, sidebars and boilerplate gone. Postlight Parser does the same job and will hand the result back as Markdown directly.

| Pros | Cons |
| --- | --- |
| Solve the problem the converters do not touch | Readability outputs HTML, so you still need a converter after it |
| Readability is the machinery behind Firefox's Reader View, so it is heavily exercised | Both need a DOM, which means JSDOM or a browser in Node |
| Postlight Parser can return html, markdown or text | Extraction is heuristic: it sometimes takes too much or too little |
| Both are permissively licensed | Neither is a document converter in the general sense |

**Price:** free. Readability is Apache 2.0; Postlight Parser is dual-licensed Apache 2.0 and MIT (checked on github.com, 8 September 2026).

**Technical details and features**

- Readability's `parse()` returns an object with the article content as an HTML string, plus `textContent` with the tags removed
- Readability needs a DOM document, so in Node it is paired with JSDOM; in a browser extension the live document is already there
- Postlight Parser takes a `contentType` option of `html`, `markdown` or `text`, and also extracts metadata like author and date
- Both work on a single page: neither crawls, and neither knows about your site's particular markup unless you extend it

**Who should use it?** Anybody converting web pages rather than HTML files. Extraction first, conversion second, is the pipeline every good clipper uses, and building it yourself takes an afternoon.

### MarkDownload — best browser extension for the page in front of you

MarkDownload is a browser extension that clips the current page as Markdown. Its implementation is the recommended pipeline in a package: Readability simplifies the page, then Turndown converts what is left.

| Pros | Cons |
| --- | --- |
| Extraction and conversion in one click | Only converts what is in the browser, one page at a time |
| Available for Firefox, Chrome, Edge and Safari | Depends on the extractor guessing right |
| Front matter and templating for the saved file | Extension permissions are broad by necessity |
| Open source, so the conversion rules are inspectable | Not a scriptable pipeline |

**Price:** free, Apache 2.0 licensed (checked on github.com, 8 September 2026).

**Technical details and features**

- Uses Readability.js to simplify the page and Turndown to convert the simplified HTML
- Options for image handling, front matter templates, and the filename pattern
- Works from the toolbar or a context menu on a selection, so you can clip part of a page
- Because it runs after the browser has rendered the page, content added by JavaScript is included — which a saved `.html` file often misses

**Who should use it?** Anybody who reads on the web and keeps notes in files. Clipping the rendered page is also the only practical way to capture a page whose content does not exist until scripts have run.

### Obsidian Web Clipper — best if the Markdown is going into a vault

Obsidian's own clipper saves web pages as Markdown notes, with templates that decide the filename, the properties and which part of the page is kept. It uses defuddle for extraction and conversion rather than the Readability-plus-Turndown pairing, and it sanitises the HTML on the way through.

| Pros | Cons |
| --- | --- |
| Templates per site, so a recipe and a paper can be clipped differently | Aimed at Obsidian; less useful if your notes live elsewhere |
| Extraction, conversion and sanitising in one extension | Extraction behaviour differs from Readability's, for better and worse |
| Chrome, Firefox, Safari and Edge, plus Chromium-based browsers | Templates are a small language of their own to learn |
| Properties captured as front matter, not lost | One page at a time |

**Price:** free, MIT licensed, with trademarks and marketing assets excluded from the licence. Obsidian itself is free to use with no sign-up; a commercial licence is $50 per user per year (checked on obsidian.md, 8 September 2026).

**Technical details and features**

- Uses defuddle for content extraction and Markdown conversion, and DOMPurify to sanitise
- Templates can set the note title, the folder, the properties and the content, with per-site rules
- Highlights and selections can be clipped rather than the whole page
- Output is a plain `.md` file in a vault folder, which is a directory of files like any other

**Who should use it?** Obsidian users, obviously — but also anybody who wants a clipper that writes plain files into a folder. If your notes are somewhere else and you are trying to get them out rather than in, [the export side of Notion, Obsidian and Confluence is its own problem](/blog/markdown-from-notion-obsidian-and-confluence).

### Notion Web Clipper — the one that does not give you Markdown

Notion's clipper saves a web page into a Notion page. This is worth listing precisely because people reach for it expecting Markdown and get Notion blocks, which are a different thing living in somebody else's database.

| Pros | Cons |
| --- | --- |
| Fits neatly if Notion is already where your notes live | The result is Notion blocks, not a Markdown file |
| Searchable and shareable inside Notion immediately | Getting Markdown out means a second step: Notion's own export |
| No files to manage | The exported Markdown is Notion's interpretation, not the page's |
| Free plan available | You now have two conversions between the page and your file |

**Price:** Notion has a Free plan at $0 per member per month (checked on notion.com, 8 September 2026); the clipper comes with the account.

**Who should use it?** Notion users capturing reading material. If the goal is a Markdown file, clip with something that produces one, or convert the saved HTML directly — going via Notion means two conversions and two chances to lose the tables.

### Browser "Save page as" — the source of most bad input

Saving a page from a browser is how most HTML files that need converting come into existence, and it is worth understanding what you get. "Webpage, complete" gives you the markup plus a folder of assets. "Webpage, HTML only" gives you the markup as it was delivered, which for a modern site can mean an almost empty document plus a script that would have built the page. Neither is the article.

| Pros | Cons |
| --- | --- |
| Always available, no install, no extension | Saves the whole page, furniture and all |
| Captures the page as it was, timestamp and all | "HTML only" can miss content added by JavaScript |
| Works for pages behind a login you are already in | Asset folders make relative links point at your disk |

**Price:** free.

**Who should use it?** Anybody who needs the HTML on disk for other reasons. As a first step in a conversion it works, as long as you know that the converter is going to convert everything you saved — which is the subject of the next section.

## What HTML cannot survive as Markdown

Every tool above will produce Markdown from your HTML. None of them can produce Markdown that means the same thing, because Markdown does not have the vocabulary. Here is what goes, and what it costs.

**Layout.** Markdown has no columns, no floats, no widths and no order other than the order of the text. A two-column comparison laid out with a grid becomes one column after another: everything from the left, then everything from the right. The words are all there and the relationship between them is gone. If the layout was carrying the meaning — a before-and-after, a side-by-side of two options — the Markdown is not a lossy copy, it is a wrong one, and no converter option fixes it.

**Classes, ids and inline styles.** These vanish, and they should: Markdown has no styling. But they are frequently the only thing marking a callout, a warning, a deprecated note or a pull quote. HTML that says `<div class="warning">` becomes an ordinary paragraph, and the reader loses the signal that this paragraph is the one that matters. A converter with per-element rules — Turndown, markdownify, the Go library — can be told to turn a known class into a blockquote or a bold prefix. That is a rule per class, written by you, per site.

**Nested tables and spanning cells.** GFM tables are a grid of plain cells: no `rowspan`, no `colspan`, no block content, and certainly no table inside a cell. The Go library's table plugin handles spans by expanding them, which is the best available answer and still not the original. A table nested in a cell has no representation at all, and converters variously flatten it, drop it, or leave raw `<table>` HTML in the middle of your Markdown. Tables are the most common thing to lose in either direction, and [the way tables break on conversion](/blog/markdown-tables-that-survive-conversion) is worth knowing before you convert a document that depends on one.

**Anything interactive.** Forms, buttons, `<details>` elements, tabs, accordions, embedded players, canvas, SVG. Markdown can hold a link to a thing but cannot hold the thing. Converters differ on whether they drop these or emit raw HTML, and raw HTML in Markdown is a decision with consequences: it survives if the next renderer allows raw HTML, it is escaped into visible tag soup if the next renderer does not.

**Relative URLs.** This one is quiet and it breaks things weeks later. A page written with `src="/img/diagram.png"` converts to Markdown with exactly that path, and that path now resolves against wherever the Markdown ends up, which is not the original site. Every image and half the links point at nothing. Some tools rewrite relative URLs to absolute ones using the page's address; a bare library converting a file on disk has no address to work from. Check the first three links in any converted page, because [links and images that still work after conversion](/blog/images-and-links-that-still-work) do not happen by accident.

**Code, sometimes.** A `<pre><code>` block usually converts cleanly. A code block whose highlighting is per-token `<span>` elements — which is what every syntax highlighter emits — converts to a fenced block if the converter is sensible, and to a mess of stray characters if it is not. The language is normally in a class name like `language-python`, and a converter that reads it gives you an annotated fence, while one that does not gives you a bare fence and loses the highlighting on the other side. [What actually survives in a code block](/blog/code-blocks-in-markdown) is the checkable part: convert one and look at it.

**And the difference between a page and an article.** This is the real cost, and it is not a syntax problem. Converting a clean article — a documentation page, an exported chapter, a hand-written fragment — is a solved problem, and every tool here does it well. Converting a whole page is a different job. A saved news page contains a masthead, a navigation bar, a cookie banner, a subscription prompt, a related-articles list, a comment section, a footer with sixty links and a legal notice. Run it through a bare converter and you get all of that as Markdown, in reading order, with the article somewhere in the middle. The conversion is correct and the output is useless.

The costs of getting that wrong are specific. If you are converting for a human to read, they will not read it, and they will blame the tool rather than the missing extraction step. If you are converting for a search index or a model, you have just indexed the same navigation menu once per page, which crowds out the content you meant to store. And if you are converting many pages, you will discover the problem at scale: a thousand documents, each starting with the same forty lines. The fix is always the same and always up front — either an extractor before the converter, or a tool that removes the structural furniture, or a selector that names the element you actually want. Deciding that afterwards means converting everything twice.

## How to choose

1. **Ask whether your input is a page or a fragment.** A fragment needs a converter. A whole page needs extraction first, or the converter will faithfully translate the cookie banner and you will be editing by hand for an hour.
2. **Convert one representative file before you commit.** Not the simplest one — the one with the table, the code block and the callout. Whichever tool keeps those three keeps almost everything else, and you will know within a minute rather than after two hundred documents.
3. **Decide what happens to what Markdown cannot express.** Dropped, kept as raw HTML, or approximated: pick deliberately. If the Markdown is going somewhere that escapes raw HTML, keeping it is the same as corrupting it.
4. **Count the installs against the number of conversions.** One file does not justify a package manager, a runtime and a dependency tree. A nightly job does not justify a browser tab and a person to click in it.
5. **Check where the file goes.** An online converter that uploads has your document, which is irrelevant for a public page and the entire question for an internal one. Browser-side conversion is verifiable: open the network tab and watch nothing happen.
6. **Look at the links and images in the output, not just the text.** Relative URLs converting to relative URLs is the failure that looks like success, and it only shows up when somebody else opens the file somewhere else.

## Conclusion

The best HTML to Markdown converter is the one that gets the extraction right — [the how-to walks each starting point](/blog/convert-html-to-markdown) — because the translation is nearly a commodity and the extraction is where every disappointing result comes from. For a page you are looking at, clip it with an extension that runs an extractor first. For a file you already have, [transformpipe's HTML to Markdown conversion](/html-to-markdown) strips the page furniture, keeps the tables, code blocks and task lists, and does it in your browser with nothing uploaded and nothing to install. For a build or a script, take the library for your language — Turndown, markdownify, node-html-markdown, the Go CLI, [compared side by side on rules, tables, code blocks and whitespace](/blog/turndown-and-html-to-markdown-libraries) — and accept that layout, styling and nested tables are not coming with you. That loss is not a bug in the tool. It is the definition of Markdown, and the reason the file is readable at the other end.

## FAQ

### What is the best free HTML to Markdown converter?

For a single file, a browser-side converter is the best free option: no install, no upload, and Markdown back in a second, at no cost. For code, Turndown in JavaScript, markdownify in Python and the Go html-to-markdown CLI are all free and MIT licensed, and Pandoc is free under the GPL.

### How do I convert a whole web page to Markdown?

Use a clipper, not a converter. A browser extension like MarkDownload or the Obsidian Web Clipper runs an extractor over the rendered page first, which drops the navigation and the banners, and only then converts what is left. Saving the page as `.html` and converting the file gives you the whole page including the furniture.

### Why is my converted Markdown full of navigation links?

Because you converted the page rather than the article. Bare converters translate every element you hand them, and a saved page is mostly not the article. Either extract the content first with something like Readability, or use a tool that removes structural elements — headers, navigation, footers, scripts — before converting.

### Do HTML to Markdown converters keep tables?

Some do, some need a plugin, and none keeps a complicated one. Turndown needs `turndown-plugin-gfm` for tables; node-html-markdown, html-to-md and the Go library handle them directly. No converter can keep a nested table or a spanning cell faithfully, because GFM tables are a flat grid of plain cells.

### Can I convert HTML to Markdown from the command line?

Yes. Pandoc reads HTML and writes GFM, html2text is a Python CLI, and the Go html-to-markdown ships an installable `html2markdown` binary that reads standard input. For a job inside CI, a converter with a REST API or a GitHub Action removes the install from your runner altogether.

### What happens to CSS and inline styles?

They are discarded, because Markdown has no styling. That is usually what you want, and occasionally a real loss: a class name is often the only marker distinguishing a warning box, a callout or a pull quote from an ordinary paragraph. Converters with per-element rules can map a known class onto a blockquote or a bold prefix, but you write that rule yourself.

### Is it safe to convert an HTML file somebody sent me?

Converting is safe in the sense that the output is Markdown, which is text. The risks are elsewhere: opening the HTML in a browser first runs whatever is in it, and Markdown can carry raw HTML through to the next renderer if the converter passes it along. Convert without opening, and check whether your converter strips `<script>` or keeps it.
