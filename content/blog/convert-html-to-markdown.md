---
title: "How to Convert HTML to Markdown: A Method for Each Starting Point"
description: How to convert HTML to Markdown from a file, a browser tab, a string in code or a whole site, and why cleaning the page furniture first decides the result.
date: 2026-09-05
tag: Converting
keywords: how to convert html to markdown, html to markdown, convert html file to markdown, web page to markdown, html to markdown command line, turndown, pandoc html to markdown, clean html before converting
---

Most instructions for converting HTML to Markdown name a tool and stop. That is why the results disappoint. The tool is the interchangeable part. What decides whether you end up with a readable document or four hundred lines of link lists is where the HTML came from and what you did to it before the converter ran. A hand-written fragment converts cleanly with anything on the market. A page saved from a news site converts just as cleanly, and the output is unusable.

### TL;DR

Choose the method by where the HTML is, not by which library is best. For **a file on disk**, drop it into a browser-side converter or run one Pandoc command. For **a page you are looking at**, use a clipper or copy the article element out of the browser console, because a saved page is mostly not the article. For **a string in code**, use your language's library — Turndown in JavaScript, markdownify or html2text in Python — and for **a whole site**, mirror it, extract the content, then convert, in that order. Headings, links, lists, tables and code survive the trip; layout, classes, inline styles and nested tables do not, and no option restores them.

## Why the conversion is the easy half

Converting HTML to Markdown is one command. Producing Markdown you would show somebody is four steps, and the command is the last of them. First you work out which bytes are the document. Then you get those bytes somewhere a converter can read them. Then you decide what happens to the constructs Markdown has no words for. Only then do you convert. Skip the first three and the fourth still succeeds — that is the trap. A converter has no way to tell a cookie banner from a paragraph, so it translates both, correctly, and hands you the result.

The second step catches more people than it should, because the HTML on your screen and the HTML in the file are frequently not the same document. `curl` and `wget` fetch what the server sent. If the page assembles itself in JavaScript after that — a documentation site built on a client-side router, an app shell, anything rendering from a JSON payload — what the server sent is an empty `<div>` and a script tag. Convert that and you get a blank file, then spend twenty minutes suspecting the converter. The rendered DOM lives only in the browser, which is why "save the page" and "fetch the page" produce different results and why the browser is sometimes the only place the conversion can start.

The third step is the one that fails later rather than immediately. A page written with `<img src="/img/diagram.png">` converts to Markdown containing exactly that path, and the path now resolves against wherever the Markdown ended up. Every image points at nothing. The same applies to every relative link, every anchor to a heading the converter renamed, and every stylesheet-dependent construct that was carrying meaning. The conversion looked perfect in the converter's own preview. It broke when the file moved, which is a week later and in front of somebody else.

## Quick comparison: the cheat sheet

| Starting point | Shortest route | What you must do first | What it costs you |
| --- | --- | --- | --- |
| One `.html` file, hand-written or a clean fragment | Any converter, browser or CLI | Nothing | Nothing — this case is solved |
| One `.html` file saved from a browser | Browser-side converter, or Pandoc | Strip navigation, header, footer, scripts | Ten minutes of tidying, or a tool that strips them for you |
| A page open in a browser, once | A clipper extension, or the console | Let an extractor find the article | Installing an extension, or one line of JavaScript |
| A page that renders in JavaScript | The browser console, or a headless browser | Wait for the DOM, then take `outerHTML` | `curl` will not work here at all |
| Pages you read and keep every week | A clipper into your notes | Configure it once | Nothing after setup |
| An HTML string in Node | Turndown, or node-html-markdown | `remove()` the elements you do not want | A dependency and a few rules |
| An HTML string in Python | markdownify, or html2text | `strip=[...]` the elements you do not want | A dependency and a few options |
| HTML in a shell pipeline or CI | Pandoc, or a converter with an API | Decide the flavour and whether raw HTML passes | An install on the runner, or a network call |
| Email or newsletter HTML | Pandoc, then heavy editing | Accept that the table layout is gone | Most of the structure; the words survive |
| A whole site you control | Convert from the source, not the output | Find the templates and the content directory | Real work, and the right answer |
| A whole site you do not control | `wget --mirror`, extractor, converter, in that order | Confirm you are allowed to | Hours, and a per-site selector |
| HTML stored in a database column | Your language's library, in a loop | Sample twenty rows before converting a million | One bad assumption multiplied by the row count |

## How to convert HTML to Markdown, per starting point

### An `.html` file on disk

This is the case everybody has and the one with the most options. The file is already local, there is nothing to fetch, and the only real question is whether the file is a document or a page.

A hand-written fragment, an exported chapter, a single documentation page — convert it with anything and move on. A page saved out of a browser is different. Browsers offer two save modes and they produce different problems. "Web page, HTML only" gives you one file with the markup and none of the assets, so images become broken references. "Web page, Complete" gives you one file plus a folder of assets and rewrites the paths to point into that folder, which means your Markdown will carry paths like `page_files/diagram.png` — correct on your machine, meaningless anywhere else.

| Route | Install | Good for | Watch out for |
| --- | --- | --- | --- |
| Browser-side converter | None | One file, now, without uploading it | One document at a time |
| Pandoc | Yes, once | Scripting, and output beyond Markdown | No sanitising; raw HTML passes through unless you disable it |
| `html2text` (Python) | Yes, pip | Readable plain-ish text output | GPLv3, and it reformats aggressively by default |
| Editor extension | Yes | Converting while the file is already open | Varies wildly by extension |
| Paste into a Markdown editor | None | Small fragments | Silently drops what the editor does not understand |

With Pandoc, the whole job is one line:

```bash
pandoc -f html -t gfm --wrap=none page.html -o page.md
```

`-t gfm` asks for GitHub Flavored Markdown, which is the flavour with tables, task lists and strikethrough in it. `--wrap=none` stops Pandoc reflowing your paragraphs to a column width, which matters because a re-wrapped paragraph produces a diff on every line the next time anybody edits it. Two more flags earn their place here. `--extract-media=media` pulls images and other media out of the source into a directory and rewrites the references to match, which is the fix for the asset-path problem above. And `-t gfm-raw_html` disables the `raw_html` extension, so constructs Pandoc cannot express in Markdown are dropped instead of passed through as HTML tags. Pandoc also accepts a URL in place of a filename and will fetch it over HTTP, and `--sandbox` limits its file access to the files you named on the command line, which is worth using on anything you did not write (checked on pandoc.org, 8 September 2026).

The browser-side route trades the flags for having nothing to install. [transformpipe's HTML to Markdown conversion](/html-to-markdown) reads the file in the page, removes `script`, `style`, `noscript`, `template`, `svg`, `iframe`, `head`, `nav` and `footer` elements along with HTML comments, converts what is left, and hands back a `.md` file. Signed out, the file is never sent anywhere — the conversion happens on your own machine, which you can confirm by watching the network tab while it runs. Conversion is capped at 10 MB, which is far more HTML than any single page.

**Use this when:** you have the file, you want the Markdown, and you are doing it once or twice. If you are doing it a hundred times, skip to the code route.

### A page open in a browser

Here the HTML you want does not exist as a file yet, and the version you would get by fetching the URL may not match what you are reading. There are three routes and they suit different frequencies.

**Clip it.** A browser extension that clips to Markdown runs an extractor over the rendered page, throws away the furniture, and converts what remains. This is the best result per unit of effort for a page you are reading, and it is the only route that reliably handles JavaScript-rendered content, because it works on the live DOM. The [comparison of HTML to Markdown converters](/blog/best-html-to-markdown-converters) covers which extensions do what; the point here is that the extraction, not the conversion, is what makes them feel better than a bare tool.

**Take the element you want out of the console.** Open the developer tools, find the element that contains the article, and copy its markup:

```js
// In the browser console. Pick the selector that actually wraps the article.
copy(document.querySelector('main').outerHTML)
```

`copy()` is a Chrome and Edge DevTools console function; it puts its argument on the clipboard. Paste the result into a file and convert that. The whole value of this route is the selector: you have named the article by hand, which is more accurate than any heuristic, and it takes about fifteen seconds once you know the site. For a site you convert repeatedly, write the selector down. `article`, `main`, `[role="main"]` and `.post-content` cover a surprising share of the web.

**Save and convert.** Use the browser's save command, then treat the result as a file on disk. This is the slowest route to a good result, because the saved file contains everything: the masthead, the navigation, the subscription prompt, the related-articles rail, the comment section and a footer of sixty links. It is still the right route when you need the page exactly as it was, including the parts an extractor would discard.

| Route | Effort per page | Handles JavaScript pages | Keeps the whole page |
| --- | --- | --- | --- |
| Clipper extension | Two clicks | Yes | No, by design |
| Console selector | Fifteen seconds | Yes | Only what you selected |
| Save then convert | A minute, plus tidying | Depends on the save mode | Yes, all of it |
| Reader View, then save | Two clicks | Yes | No |

That last row is worth knowing. Firefox's Reader View is built on Mozilla's Readability library, which is the same extraction engine most clippers use. Turning Reader View on and then saving gives you a stripped page without installing anything.

**Use this when:** the page is in front of you. If you find yourself doing it every day, install a clipper and stop thinking about it.

### An HTML string in code

Once the HTML is a variable, the conversion is a function call and the interesting work is configuration. Every library in this category gives you three levers: which elements to drop entirely, which to keep as raw HTML, and how to render the rest.

In JavaScript, Turndown is the default choice and the one other tools are measured against. It is MIT licensed and its API is small:

```js
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const turndown = new TurndownService({
  headingStyle: 'atx',        // "## Heading", not the underlined form
  codeBlockStyle: 'fenced',   // ``` fences, not four-space indents
  bulletListMarker: '-',
  linkStyle: 'inlined',
});

turndown.use(gfm);                                  // tables and strikethrough
turndown.remove(['script', 'style', 'nav', 'footer']); // gone, not converted

const markdown = turndown.turndown(html);
```

Three of those lines are the ones that matter. `use(gfm)` adds the `turndown-plugin-gfm` rules for tables and strikethrough — without it, Turndown has no table support and a `<table>` comes through as raw HTML or as a run of text depending on your other settings. `remove()` deletes elements and their contents before conversion, which is your cleaning step. And `addRule()`, which is not shown, lets you map a specific pattern onto specific Markdown: a `<div class="warning">` onto a blockquote, a `<figcaption>` onto italics beneath the image, a known component onto a fenced block.

The alternative in JavaScript is node-html-markdown, which carries its own HTML parser rather than requiring a DOM. That matters if the code runs somewhere without one — a serverless function, a CLI, a worker — because the DOM-dependent option would leave you stapling jsdom onto the build. It is MIT licensed and handles tables and strikethrough itself.

In Python there are two mature options with different goals. markdownify is MIT licensed, built on BeautifulSoup, and aims at faithful structure: `md(html, heading_style="ATX", strip=['a'])` converts, with `strip` naming tags to remove and `convert` naming the only tags to keep. It has options for bullet characters, an assumed code language for `<pre>` blocks, paragraph wrapping and header inference on tables that lack a header row. html2text is GPLv3 and aims at readable text: it installs a command-line tool of the same name and takes flags like `--ignore-links`, `--reference-links`, `--mark-code` and `--escape-all`.

| Library | Language | Licence | Cleaning lever | Tables |
| --- | --- | --- | --- | --- |
| Turndown | JavaScript | MIT | `remove()`, `keep()`, `addRule()` | Via `turndown-plugin-gfm` |
| node-html-markdown | JavaScript | MIT | Custom translators | Built in |
| markdownify | Python | MIT | `strip=[]`, `convert=[]` | Built in |
| html2text | Python | GPLv3 | `--ignore-links`, `--ignore-images` style flags | Limited; it targets readable text |
| Pandoc | Any, via shell | GPL | `-t gfm-raw_html`, `--sandbox` | Built in |

If the conversion has to run inside a job rather than on a machine you administer, a converter reachable over HTTP removes the install from the runner. Posting HTML to `POST /api/v1/documents?kind=html-to-markdown` converts the body and keeps the result; the request body is capped at 4 MB, because a Vercel Function refuses a larger one with a bare 413 that no application code ever sees.

**Use this when:** the conversion happens more than once, or happens without a person watching. Write the cleaning rules once, in code, where they are reviewable.

### A whole site

This is the case where the honest advice is usually "do something else". If you control the site, the HTML is the build output and you are converting the wrong artefact. The source — the templates plus whatever the content lives in — is closer to Markdown than the rendered pages are, and converting rendered HTML back means recovering structure that your own build already knows. Check for an export first. A CMS with an export format, a database with a content table, a repository with the source in it: all three beat scraping your own site.

If you genuinely have only the rendered pages, the order is fixed and skipping a step costs more than doing it.

1. **Mirror.** Get the pages onto disk before you convert anything, so the conversion is repeatable and you are not re-fetching on every attempt. `wget --mirror --page-requisites --convert-links --adjust-extension --no-parent https://example.com/docs/` walks the section, brings the assets, rewrites links to point at the local copies and stays inside the path you named. Check the site's terms and its `robots.txt` first; "I could fetch it" and "I may fetch it" are different questions.
2. **Get the list right.** A sitemap is a better source of URLs than a crawl, because it is the site's own answer to "what pages exist" and it will not walk you into a calendar with infinite months in it.
3. **Extract.** Per page, isolate the content. Either a CSS selector you worked out by hand — best, if the site uses one template — or an extractor. Mozilla's Readability is Apache 2.0 licensed, takes a DOM document and returns an object with `title`, `content`, `textContent`, `excerpt`, `byline`, `lang` and more. It needs a real DOM, so in Node you pair it with jsdom. Its companion `isProbablyReaderable` gives you a quick boolean for whether a document is worth handing to it at all, which is how you skip the index pages automatically (checked on github.com/mozilla/readability, 8 September 2026).
4. **Convert.** Now the converter runs, and now it is the boring step it should have been all along.
5. **Fix the links.** Every internal link in the mirrored HTML points at a URL structure that no longer exists. Decide the mapping from old URL to new file path once, apply it to every document, and check a sample.

| Step | Skipping it costs |
| --- | --- |
| Mirror to disk | Re-fetching the whole site every time you change a rule |
| Sitemap over crawl | Duplicate pages, paginated archives, infinite calendars |
| Extract | A thousand documents each opening with the same forty lines of navigation |
| Convert | — |
| Rewrite links | A corpus of documents that all cross-link to nothing |

**Use this when:** you have no access to the source and you need the content anyway — a site being retired, a vendor's documentation you are allowed to keep, an archive. Budget a day, not an hour, and expect the selector work to be per template.

## Cleaning the chrome out first

This is the step that decides the result, and it is the one no comparison table has a column for. The finding is consistent across every route above: the difference between a good conversion and a bad one is almost never the converter. It is whether the input was the document.

Think of a real page. The article you want might be 15% of the elements. The rest is a masthead, a primary navigation bar, a secondary navigation bar, a cookie consent dialogue, a newsletter form, a share row, a related-articles rail, a comment thread, a footer with a sitemap in it and a legal notice. A converter translates all of it faithfully, in document order, which puts the article somewhere in the middle of a very long file. The output is correct and worthless, and the reader blames the tool.

There are four ways to cut, in descending order of how well they work.

**Name the element you want.** A selector — `main`, `article`, `#content`, `.markdown-body` — is the most accurate method available because you looked at the page and decided. It has one limitation: it is per site, sometimes per template, and it breaks when the site is redesigned. For a handful of sites you convert often, this is unbeatable and takes seconds.

**Run an extractor.** Readability and its relatives score the elements of a document by how much prose-like text they contain relative to markup and link density, then return the winner. This generalises, which is the whole point: it works on a site you have never seen, without configuration. It also occasionally guesses wrong, most often on pages that are not articles at all — index pages, dashboards, search results — where there is no single block of prose to find.

**Remove the elements you do not want.** Instead of naming what to keep, name what to drop: `script`, `style`, `nav`, `footer`, `header`, `aside`, `form`, `iframe`, `noscript`, `svg`. This is what a general-purpose converter can do without knowing anything about your page, and it gets most of the furniture on a page built with semantic elements. It gets none of it on a page built entirely from `<div>` elements, which is a great deal of the web.

**Fix it afterwards.** Convert everything, then delete the Markdown you did not want. This is fine for one document and indefensible for a hundred, and it is the default because it requires no decision up front. The cost is that you make the same edit once per document, and you cannot re-run it when you improve your rules.

| Method | Accuracy | Generalises | Effort |
| --- | --- | --- | --- |
| CSS selector you chose | Highest | No — per site | Seconds, once you know the site |
| Extractor (Readability and similar) | Good on articles, poor on everything else | Yes | An install and a DOM |
| Element removal list | Good on semantic HTML, poor on `<div>` soup | Yes | None; converters do it for you |
| Editing the Markdown after | Perfect, in principle | No | Per document, forever |

One caution about cleaning too hard. `<script>` and `<style>` should always go — Markdown cannot express either, and a script tag in the input is a script tag looking for somewhere to run. But `<aside>` sometimes holds a pull quote that belongs to the article, `<header>` inside an `<article>` element is often the title and byline rather than the site masthead, and `<figure>` carries images with their captions. A removal list is a blunt instrument. Look at one converted document before you run it over a thousand.

## What survives, and what cannot

Markdown is a small language, deliberately. HTML is not. The conversion is a demolition with a list of things to keep, and it helps to know the list before you start rather than discovering it in the output.

| Construct | Survives? | What actually happens |
| --- | --- | --- |
| Headings `h1`–`h6` | Yes | Become `#` through `######`, levels intact |
| Paragraphs, emphasis, strong | Yes | Reliable everywhere |
| Links | Yes, as text | The URL is copied verbatim, relative paths included |
| Images | Yes, as a reference | The `src` is copied verbatim; `width`, `alignment` and `srcset` are gone |
| Unordered and ordered lists | Yes | Nesting survives; custom numbering and `start` attributes usually do not |
| Blockquotes | Yes | Straightforward |
| Code blocks | Usually | A `language-*` class becomes a fence label if the converter reads it |
| Inline code | Yes | Backticks |
| Simple tables | With GFM | Flat grid only; needs a flavour or plugin that implements tables |
| Horizontal rules | Yes | `---` |
| Strikethrough | With GFM | Otherwise dropped or kept as raw HTML |
| Task lists | Sometimes | A checkbox `<input>` inside a list item; many converters ignore it |
| Definition lists | Rarely | Not in CommonMark or GFM; approximated or dropped |
| Footnotes | Rarely | An extension in every flavour that has them |
| Layout — columns, floats, widths | No | Becomes one column in document order |
| Classes, ids, inline styles | No | Discarded, along with whatever they were signalling |
| Nested tables, `rowspan`, `colspan` | No | Flattened, dropped, or left as raw HTML |
| Forms, buttons, `<details>`, tabs | No | Dropped or emitted as raw HTML |
| Embedded video, canvas, SVG | No | A link at best |
| Comments, scripts, stylesheets | No | Removed, and correctly so |

Four of those rows deserve a sentence more.

**Tables are the loudest failure.** They are not in the CommonMark specification, so a converter has to implement GFM tables on purpose. When it has not, a `<table>` arrives as a run of paragraphs or as raw HTML in the middle of your document. When it has, a simple grid comes through perfectly and a complicated one does not, because GFM tables have no spanning cells, no block content and no nesting. [What happens to tables on the way across](/blog/markdown-tables-that-survive-conversion) is the single most useful thing to test on a real document before you commit to a route.

**Code blocks depend on the highlighter.** A plain `<pre><code>` block converts cleanly. A block that a syntax highlighter has rewritten into hundreds of `<span>` elements converts to a fence if the converter is sensible about `<pre>` and to a mess of stray characters if it is not. The language is normally in a class name, and reading it is optional behaviour. [The specifics of code blocks and their info strings](/blog/code-blocks-in-markdown) are worth checking against one real sample.

**Links and images survive as strings, not as working references.** This is the failure that looks like success. Every relative path converts to the same relative path, and now resolves from somewhere else. If the Markdown is going into a repository, a wiki or a notes vault, you need a rewrite step, and [links and images that still work after conversion](/blog/images-and-links-that-still-work) do not happen by themselves.

**Raw HTML is a choice you are making whether or not you notice.** Some converters emit HTML for anything they cannot express. That keeps the information and makes the Markdown less portable: it survives if the next renderer allows raw HTML and turns into visible tag soup if it escapes it instead. Worse, raw HTML carried through a conversion carries whatever was in it. If the source came from outside, the Markdown now holds attack surface for the next renderer, and [sanitising has to happen where the HTML is rendered](/blog/sanitising-markdown-safely), not where it was converted.

## Where the obvious answer fails

The obvious answer is "install Turndown" or "run Pandoc", and for the majority of files it is right. Here is where it is not, and what each failure costs.

**When the page is not the document.** Covered above and worth repeating, because it accounts for most bad output. A bare converter on a saved page produces a correct translation of a website. The cost is not one bad file — it is that you will not notice until you open it, and at scale you will have converted everything before you notice.

**When the HTML never existed on the server.** A client-rendered page fetched with `curl` yields a shell. The cost of not knowing this is a diagnostic detour: you will test three converters, get three empty files, and conclude that HTML to Markdown is broken. The tell is that the source you fetch is short and full of `<script src=...>`. The fix is a browser, live or headless.

**When the semantics were in the CSS.** A page whose callouts, warnings and deprecation notices are marked only by class names loses every one of them. The paragraphs are all present and the reader no longer knows which one matters. A per-class rule fixes it — Turndown's `addRule()`, markdownify's per-tag options — at the price of one rule per class per site, written by you. There is no general solution, because there is no general convention.

**When the destination is stricter than the source.** Convert with a tool that emits GFM, then render with a strict CommonMark parser, and your tables become paragraphs of pipe characters. The flavour of the output has to match the flavour of whatever will render it, and that is a decision, not a default. The cost of getting it wrong is a document that looked right in one place and wrong in the next.

**When the document was never prose.** An email template, a dashboard, a pricing page laid out as a grid, a form. These are not articles wearing HTML; the layout is the content. Converting them produces a list of words in the order they appear in the markup, which is not the order anybody read them in. The Markdown is not a lossy copy — it is a wrong one, and the honest move is to rebuild rather than convert.

**When you are converting your own build output.** If you control the site, converting the rendered HTML back to Markdown is throwing away information your build already had, then paying to guess at it. The cost is subtle: the result is 90% right, so it ships, and the missing 10% is discovered by readers over the following months.

## How to choose

1. **Find the HTML before you find the tool.** Whether the bytes come from a file, a save, a fetch or a live DOM decides the whole method, and choosing a library first means discovering later that it cannot see the page you meant.
2. **Convert one hard document before you convert any others.** Not the simplest — the one with a table, a code block and a callout in it. Whatever keeps those three keeps nearly everything else, and you learn it in a minute instead of after two hundred files.
3. **Decide the cleaning step explicitly.** Selector, extractor, removal list or manual editing: pick one now. Picking it afterwards means converting everything twice, and manual editing does not scale past about ten documents.
4. **Match the flavour to the destination.** If the Markdown is going somewhere that only does CommonMark, tables and strikethrough will not arrive, no matter how well the converter emitted them.
5. **Decide what happens to what Markdown cannot express.** Dropped, approximated, or kept as raw HTML. Keeping raw HTML in a document headed for a strict renderer is the same as corrupting it.
6. **Check the links and images, not just the text.** Open three of them from the converted file's new location. Relative paths converting to relative paths is the defect that passes every eyeball test until somebody else opens the file.
7. **Count the conversions against the installs.** One file does not justify a package manager and a dependency tree. A nightly job does not justify a browser tab and a person to click in it.

## Conclusion

Converting HTML to Markdown well is mostly a matter of doing one thing before the conversion — and if what you are converting is a page on the web rather than a file, [read this first](/blog/save-a-web-page-as-markdown). The one thing: deciding which part of the HTML is the document, and by what method. Name it with a selector if you know the site, hand it to an extractor if you do not, and strip the furniture either way. After that, any of the tools here will do the translation — Turndown in JavaScript, markdownify or html2text in Python, Pandoc when the output has to be more than Markdown, or [transformpipe's browser-side HTML to Markdown conversion](/blog/best-html-to-markdown-converters) when you have one file and nothing to install. What will not come with you is the layout, the styling and anything a class name was quietly signalling. That is not a shortcoming of the converter; it is the definition of Markdown, and the reason the file is readable at the other end.

## FAQ

### How do I convert an HTML file to Markdown without installing anything?

Use a converter that runs in the browser: open the page, drop the `.html` file in, download the `.md`. With a browser-side tool the file is never uploaded, which you can verify by watching the network tab while it converts. If the file is a saved web page rather than a clean fragment, expect to delete some navigation afterwards unless the tool strips it for you.

### What is the command to convert HTML to Markdown?

`pandoc -f html -t gfm --wrap=none page.html -o page.md` is the general answer. Add `--extract-media=media` to pull images out and rewrite their references, and `-t gfm-raw_html` to drop constructs Pandoc cannot express instead of passing them through as HTML tags. Pandoc also accepts a URL where the filename goes.

### Why is my converted Markdown full of navigation and cookie notices?

Because you converted the page rather than the article. Converters translate every element you give them, and a saved page is mostly not the article. Either name the content element with a CSS selector, run an extractor such as Readability over it first, or use a converter that removes structural elements before it starts.

### Can I convert a page that only renders in JavaScript?

Not by fetching it. `curl` and `wget` receive what the server sent, which for a client-rendered page is an app shell and a script tag. You need the rendered DOM: copy the element out of the browser console, use a clipper extension, or drive a headless browser and take `outerHTML` once the page has settled.

### Do HTML to Markdown converters keep tables?

Simple ones, if the converter implements GFM tables — some need a plugin, such as `turndown-plugin-gfm` for Turndown. Nothing keeps a complicated table, because GFM tables are a flat grid with no spanning cells, no block content and no nesting. Convert one real table and look at it before you trust a route.

### How do I convert a whole website to Markdown?

Mirror it to disk first with something like `wget --mirror --page-requisites --no-parent`, take the URL list from the sitemap rather than a crawl, extract the content from each page, convert, then rewrite the internal links to the new paths. Check the site's terms before you start. If you control the site, convert the source instead — the rendered HTML has already thrown away structure you would be guessing at.

### What happens to CSS, classes and inline styles?

They are discarded, because Markdown has no styling. That is usually what you want and occasionally a real loss, since a class name is often the only thing marking a warning box, a callout or a pull quote. Converters with per-element rules can map a known class onto a blockquote or a bold prefix, but you write that rule yourself, per site.
