---
title: "Turndown and the Alternatives: Choosing an HTML to Markdown Library"
description: Turndown's rules API, node-html-markdown, html-to-md, html2text and Pandoc, compared on tables, code blocks, nested lists, whitespace and browser support
date: 2026-08-21
tag: Code
keywords: html to markdown library, turndown, turndown addrule, node-html-markdown, html-to-md, html2text python, pandoc html to markdown
---

The HTML you have to convert is never the HTML in the README. It has a `<div class="callout">` that means something, a code block made of two hundred `<span>` elements, a table with a merged header cell, and an empty paragraph every third element because a CMS put it there. Every library on this page will convert that page into Markdown. They will produce five different files, and the differences are not cosmetic.

### TL;DR

Pick by the shape of the input and where the code runs. **Turndown** is the default for JavaScript because its rules are replaceable per element, which is the only thing that makes unusual HTML tractable — but tables need `turndown-plugin-gfm`. **node-html-markdown** carries its own parser (`node-html-parser`), so it runs where there is no DOM and handles tables without a plugin. **html-to-md** is the small, dependency-free option, and its `skipTags` default already drops page furniture. **html2text** is the Python answer when the output is for reading rather than round-tripping. **Pandoc** as a subprocess is the answer when Markdown is not the last format the document has to become.

The failure that catches people is not a missing feature. It is the assumption that these libraries are interchangeable, so the choice can be made late and changed cheaply. It cannot: configuration in this space is code, not flags, and the code is different per library. A rule that maps `<div class="warning">` onto a blockquote is thirty lines against Turndown's API and thirty different lines against node-html-markdown's.

The second thing worth knowing before you install anything is which of these libraries needs a DOM. Turndown works through one — in Node it brings `@mixmark-io/domino` as a dependency to supply it. That is convenient and it is also a constraint on where the code can run and how much memory a large document costs. The parser-owning libraries make the opposite trade. If you are choosing between tools rather than libraries, [the wider comparison of HTML to Markdown converters](/blog/best-html-to-markdown-converters) covers the extensions, the CLIs and the hosted options; this piece is about the code you import.

## Six libraries, and what each one is

Four of these are libraries you call, one is a Python package with a CLI attached, and one is a binary you shell out to. That distinction matters more than any feature in the table, because it decides what happens when the conversion fails: a library throws, and a subprocess returns an exit code and a line on standard error that somebody has to read.

| Library | Language | Best for | Key capability | Licence |
| --- | --- | --- | --- | --- |
| Turndown | JavaScript | Per-element control over odd HTML | `addRule`, `keep`, `remove`, and three replacement options | Free, MIT |
| turndown-plugin-gfm | JavaScript | Tables, strikethrough and task lists in Turndown | `gfm`, `tables`, `strikethrough`, `taskListItems` | Free, MIT |
| node-html-markdown | TypeScript | Volume, and environments with no DOM | Bundles `node-html-parser`; a translator per element | Free, MIT |
| html-to-md | JavaScript | A converter that is a detail in a bundle | Zero dependencies; `skipTags` and `aliasTags` | Free, MIT |
| html2text | Python | Readable text output from a script or a shell | CLI and library; `--backquote-code-style`, `--body-width` | Free, GPLv3 |
| Pandoc | Haskell binary | HTML that has to become more than Markdown | `-f html -t gfm`, reads standard input | Free, GPL |

Two of the six are not really competing. `turndown-plugin-gfm` is part of Turndown for any realistic input, because HTML without tables is rare enough that treating table support as optional is a decision you will reverse. Pandoc is not a library at all in this context; it is a process, and the cost of using it is measured in process launches rather than in bundle bytes.

## Turndown in depth: rules, keep, remove and the special replacements

Turndown converts an HTML string or a DOM node — an element, a document, or a document fragment — into Markdown. That input flexibility is the first practical detail: in a browser extension you can hand it a live element rather than serialising the page and reparsing it, which saves a copy of the document and preserves whatever the page's own scripts have already changed.

Everything else about Turndown is the rule system, so it is worth understanding how a rule is chosen before writing one.

### How Turndown picks a rule

Rules are tried in a fixed order, and the order explains most surprising output:

1. The **blank rule**, which overrides everything else.
2. **Added rules**, in the order you added them.
3. The built-in **CommonMark rules**.
4. **Keep rules**.
5. **Remove rules**.
6. The **default rule**.

Two consequences follow immediately. First, your own rules beat the built-in ones, so you never have to fork anything to change how `<a>` or `<pre>` is emitted — you add a rule with the same filter and it wins. Second, the blank rule beats yours. A node is blank if it contains only whitespace and is not an `<a>`, `<td>`, `<th>` or a void element. So if your rule targets `<div class="spacer">` and the div is empty, your rule never runs, and the reason is not in your code.

### addRule with a tag name, a list, or a filter function

`addRule(key, rule)` takes a name — used only so a later call can replace it — and an object with a `filter` and a `replacement`. It returns the service, so calls chain.

The filter has three forms. A string matches a tag name. An array matches any of several tag names. A function receives the node and the options and returns a boolean, which is where the real work happens.

```js
import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
  strongDelimiter: '**',
  linkStyle: 'inlined',
});

// A string filter: one tag.
turndown.addRule('figcaption', {
  filter: 'figcaption',
  replacement: (content) => `\n\n_${content.trim()}_\n\n`,
});

// An array filter: several tags, one handler.
turndown.addRule('smallprint', {
  filter: ['small', 'cite'],
  replacement: (content) => content,
});

// A function filter: the only form that can see attributes.
turndown.addRule('warning', {
  filter: (node) =>
    node.nodeName === 'DIV' &&
    (node.getAttribute('class') || '').includes('warning'),
  replacement: (content) =>
    `\n\n> **Warning**\n>\n> ${content.trim().replace(/\n/g, '\n> ')}\n\n`,
});
```

The `replacement` signature is `(content, node, options)`. `content` is the already-converted Markdown of the children, which is the part people get wrong: you are not handed the inner HTML, you are handed the result of converting it, so you cannot re-inspect the structure inside your own replacement. If you need the structure, look at `node`; if you need the text, look at `content`.

The function filter is also the answer to the single most common real requirement, which is that a class name carries meaning Markdown has no vocabulary for. A `<div class="warning">` becomes an ordinary paragraph under every default in this article, and the reader loses the only signal that this paragraph is the one that matters. Turndown can be told to map it onto a blockquote. That is one rule per class, written by you, per site — and it is still the cheapest available fix.

### The options, and the two that actually change output

The options object covers `headingStyle` (`setext` or `atx`), `hr`, `bulletListMarker` (`-`, `+` or `*`), `codeBlockStyle` (`indented` or `fenced`), `fence` (triple backticks or `~~~`), `emDelimiter` (`_` or `*`), `strongDelimiter` (`**` or `__`), `linkStyle` (`inlined` or `referenced`), `linkReferenceStyle` (`full`, `collapsed` or `shortcut`) and `preformattedCode`.

Most of these are house style and nothing breaks either way. Two are not:

- `codeBlockStyle: 'fenced'` is the one to set deliberately. Indented code blocks cannot carry a language, so an indented block loses highlighting at the far end and cannot be distinguished from a deeply indented list item by a careless parser.
- `linkStyle: 'referenced'` moves every URL to the bottom of the document. For a page with forty inline links that is the difference between readable prose and a wall of brackets — and for a file going into version control it is the difference between a diff you can read and one you cannot.

`preformattedCode` is the quiet one. It governs whether whitespace inside `code` elements is preserved rather than collapsed, and if you are converting HTML where indentation inside inline code is meaningful, the default will surprise you.

### keep, remove, and why they are not opposites

`keep(filter)` and `remove(filter)` both take the same three filter forms as a rule, and they do very different things.

```js
// Emit these as raw HTML, because Markdown has no equivalent.
turndown.keep(['iframe', 'sup', 'sub', 'kbd']);

// Delete these and everything inside them.
turndown.remove(['script', 'style', 'noscript', 'nav', 'footer']);
```

`keep` means "put the original HTML in the Markdown". Block-level kept elements are separated from the surrounding content by blank lines, so the output is still valid Markdown structurally. What it is not is portable: raw HTML in a Markdown file survives only if the next renderer allows raw HTML, and is escaped into visible tag soup if it does not. Keeping an `<iframe>` is a bet on the destination.

`remove` means the element and its contents are gone. Nothing is removed by default — that is the part worth writing on a sticky note. Turndown does not strip `<script>` for you. Feed it a saved web page and the script contents arrive in your Markdown as text, which is not a security problem in itself but is certainly an output problem, and it is the reason a lot of "why is there JavaScript in my Markdown" bug reports exist. If the HTML came from somewhere you do not control, removing script and style is the minimum, and [what sanitising actually has to cover](/blog/sanitising-markdown-safely) is worth reading before you trust the result of a conversion either way.

The customisation hook for `keep` is `keepReplacement`, a replacement function like any other, so you can decide that a kept element is wrapped, indented or annotated rather than emitted verbatim.

### blankReplacement, and the empty paragraph problem

`blankReplacement` is the option that solves the most annoying category of bad HTML: the empty element that a content management system inserts for spacing. The blank rule catches those nodes before any other rule, and its replacement decides what they become.

The default keeps block separation — a blank block-level node still produces a paragraph break, a blank inline node produces nothing. That is usually right and occasionally the exact cause of a document full of gaps.

```js
const turndown = new TurndownService({
  // Drop empty blocks entirely instead of leaving a paragraph break.
  blankReplacement: () => '',
});
```

The cost is real and you should know it before setting this: you have just removed the mechanism that separates two blocks whose only separator was an empty node. On HTML with tidy structure that changes nothing. On HTML where a `<p>&nbsp;</p>` was doing the work of a paragraph break, you get two paragraphs run together. Convert one representative document both ways and read the result rather than reasoning about it.

`defaultReplacement` is the third of the special options and the least used. It fires for elements no rule matched, and the default emits the node's text content, separated by blank lines if the node is block-level. Overriding it is how you find out what your HTML actually contains: return a marker string instead of the content, convert, and grep for the marker. Every hit is an element none of your rules handled.

### The GFM plugin: tables, strikethrough, task lists

Turndown's core implements CommonMark, and CommonMark has no tables. `turndown-plugin-gfm` supplies the rest.

```js
import TurndownService from 'turndown';
import { gfm, tables, strikethrough, taskListItems } from 'turndown-plugin-gfm';

const turndown = new TurndownService();

// Everything the plugin provides:
turndown.use(gfm);

// Or only what you want:
// turndown.use([tables, strikethrough, taskListItems]);
```

`use` accepts a plugin or an array of them, and returns the service, so it chains with `addRule`. The selective form matters more than it looks: `tables` is the expensive rule in the set, and if you know the input has no tables — chat messages, comment bodies, editor paste handlers — leaving it out removes a whole class of edge case from the output.

What the plugin cannot do is invent expressiveness Markdown lacks. GFM tables are a flat grid of plain cells: no `rowspan`, no `colspan`, no block content, no table inside a cell. [What actually survives when a table crosses formats](/blog/markdown-tables-that-survive-conversion) is the shape of the problem, and it applies to every library here equally.

### Escaping, and the one override to be careful with

Turndown escapes Markdown syntax characters in text with backslashes, so that a literal asterisk in the source does not become emphasis in the output. Text inside `code` elements is exempt, which is correct and also the boundary where most complaints live: a filename like `my_file_name.txt` in ordinary prose comes out as `my\_file\_name.txt`, which renders correctly and looks wrong in the raw file.

`escape` is a documented, replaceable method, so the temptation is obvious:

```js
// Do this only if you own both ends of the pipeline.
turndown.escape = (text) => text;
```

That produces clean-looking Markdown that means something different from the HTML you started with. Underscores become emphasis, leading hyphens become list items, a line starting with `#` becomes a heading. If the Markdown is going straight into a diff for a human to read and never back through a renderer, it can be defensible. If it is going to be rendered, it is data corruption with a tidy appearance. The narrower fix — subtracting one character class from the default escaping rather than all of them — is almost always the right size of change.

**Who Turndown is for.** JavaScript developers who need to control the output per element: editor paste handlers, browser extensions, importers reading a legacy CMS. Its ubiquity is a genuine feature, because when a page converts badly somebody has usually already published the rule.

## node-html-markdown: no DOM, one translator per element

node-html-markdown is a TypeScript converter whose stated purpose is throughput. It depends on `node-html-parser` and uses the native `DOMParser` when one is available, controlled by the `preferNativeParser` option. That is the whole architectural difference from Turndown, and it decides three things: it runs in a worker or a serverless function with no DOM shim, its memory profile on a large document is a parse tree rather than a full DOM, and its extension API is its own rather than Turndown's.

```js
import { NodeHtmlMarkdown } from 'node-html-markdown';

// One-off:
const md = NodeHtmlMarkdown.translate(html);

// Reused — build the instance once, translate many times:
const nhm = new NodeHtmlMarkdown(
  {
    bulletMarker: '-',
    codeBlockStyle: 'fenced',
    strongDelimiter: '**',
    emDelimiter: '_',
    strikeDelimiter: '~~',
    maxConsecutiveNewlines: 2,
    keepDataImages: false,
    useInlineLinks: true,
  },
  {
    aside: { prefix: '> ', surroundingNewlines: 2 },
    button: { ignore: true },
    figcaption: { prefix: '_', postfix: '_' },
  }
);

const markdown = nhm.translate(html);
```

The static `translate(html, options?, customTranslators?, customCodeBlockTranslators?)` is convenient and builds everything each call. If you are converting more than a handful of documents, construct the instance once — that is the difference the library exists for.

The translator object is where node-html-markdown diverges most usefully from Turndown. Instead of a filter and a replacement, a translator is a declaration of fields, each doing one job: `prefix` and `postfix` sit either side of the content, `content` sets fixed output, `surroundingNewlines` adds newlines before and after (a boolean, or a number per side), `recurse: false` stops child elements being scanned at all, `ignore` skips the node entirely, `noEscape` turns off escaping for that element, `preserveWhitespace` keeps whitespace as it is, `preserveIfEmpty` visits the translator even when the element is empty, `spaceIfRepeatingChar` inserts a space when the first character would collide with the last one written, `childTranslators` swaps in a different translator collection for children, and `postprocess` runs after the inner nodes have been rendered.

That last pair is where the API earns its keep. `postprocess` can return `PostProcessResult.RemoveNode` to drop a node after seeing what it rendered to — which is the answer to "delete this element if it turned out to be empty", a decision you cannot make with a filter that runs before conversion. `childTranslators` lets a `<table>` treat its descendants under different rules from the rest of the document, without touching global configuration.

The two options worth setting deliberately are `maxConsecutiveNewlines`, which is the whitespace control the other JavaScript libraries do not expose directly, and `keepDataImages`. A page with inlined base64 images will otherwise produce a Markdown file where a single image line is longer than the rest of the document combined.

**Who it is for.** Bulk conversion, and any runtime without a DOM: a worker, an edge function, a queue consumer chewing through a crawl. It is also what this site's own converter runs on, for exactly that reason — the same code path in a browser tab and on a server.

## html-to-md: the small one, and the options that do the work

html-to-md is a zero-dependency JavaScript converter with a single exported function. Its API is three arguments and no instance:

```js
import html2md from 'html-to-md';

const markdown = html2md(html, {
  skipTags: ['div', 'section', 'nav', 'footer', 'aside', 'header', 'main'],
  ignoreTags: ['script', 'style', 'svg', 'noscript', 'head', 'meta', 'form'],
  aliasTags: { figure: 'p', figcaption: 'p', dl: 'p', dt: 'p', dd: 'p' },
});
```

The two options to understand are `skipTags` and `ignoreTags`, because they sound alike and do opposite things to your content. `skipTags` omits the tag from the conversion and keeps what is inside it — which is what you want for `<div>` and `<section>`, elements that carry layout and no meaning. `ignoreTags` discards the tag and all of its inner content, which is what you want for `<script>`, `<style>` and `<svg>`. Get them the wrong way round and you either delete the article or paste a stylesheet into it.

The defaults are unusually opinionated in a way that saves work: `skipTags` already contains the structural elements — `div`, `html`, `body`, `nav`, `section`, `footer`, `main`, `aside`, `article`, `header` — and `ignoreTags` already contains `style`, `head`, `script`, `meta`, `svg`, `noscript` and `form`. Out of the box it is closer to a saved page being readable than the other JavaScript libraries are, which is the opposite of the usual trade for a small dependency.

`aliasTags` maps a tag onto a handler that already exists, and it is the escape hatch for a supported-tag list rather than a rule system. The library documents what it handles: `a`, `b`, `blockquote`, `code`, `del`, `em`, `h1` to `h6`, `hr`, `i`, `img`, `input`, `li`, `ol`, `p`, `pre`, `s`, `strong`, `table`, `tbody`, `td`, `th`, `thead`, `tr`, `ul`. Anything outside that list needs an alias, a skip, or `renderCustomTags` to decide what happens to unknown elements. `tagListener` hands you a single tag to handle yourself, and the option precedence is documented as `skipTags` before `emptyTags` before `ignoreTags` before `aliasTags`, which is the order to reason in when two of your lists mention the same element.

The third argument to `html2md` decides whether your arrays replace the built-in defaults outright rather than being merged with them. That is a bigger switch than it looks: pass `skipTags: ['div']` without it and you may still be relying on nine other defaults you never read.

**Who it is for.** Front-end code where bundle size is a real constraint, and HTML that is reasonably well behaved. It is explicitly not the tool for badly nested or malformed markup — the library's own guidance is that it expects valid HTML, and it does not have a DOM parser standing behind it to repair the mess.

## Outside JavaScript: html2text and Pandoc

### html2text, for Python and for output people read

html2text is a Python library with a command line front end. Its purpose is readable text that happens to be valid Markdown, and its defaults reflect that priority rather than fidelity.

```bash
html2text --backquote-code-style --body-width=0 --pad-tables page.html > page.md
```

```python
import html2text

h = html2text.HTML2Text()
h.body_width = 0             # no hard wrapping
h.backquote_code_style = True  # fenced code blocks
h.ignore_images = True
h.escape_snob = False

markdown = h.handle(html)
```

Three flags carry most of the difference between output you can use and output you cannot.

`--backquote-code-style` is the important one for anybody converting technical documents: it produces multi-line code blocks in triple-backquote style. Without it you are relying on indented blocks, or on `--mark-code`, which marks program code blocks with literal `[code]` and `[/code]` delimiters — useful if you are post-processing, wrong if a human is going to read the file.

`--body-width` sets the number of characters per output line and takes `0` for no wrap. This is the flag that decides whether the Markdown is diffable. Hard-wrapped prose means a one-word edit rewraps a paragraph and the diff shows five changed lines. Set it to zero for anything going into version control.

For tables there are three separate positions: `--pad-tables` pads cells to equal column width, `--bypass-tables` formats tables in HTML rather than Markdown syntax, and `--ignore-tables` ignores the table-related tags while keeping the rows. The last one is worth knowing about because it is the honest answer for tables that are being used for layout rather than data — you keep the content and abandon the grid.

Two more are worth a line. `--reference-links` uses reference-style links instead of inline ones, and `--protect-links` surrounds links with angle brackets so line wrapping cannot break them. `--escape-all` escapes all special characters: less readable, and it avoids the corner-case formatting failures.

The licence is the thing to check first, not last. html2text is GPLv3, which some projects cannot take.

**Who it is for.** Python code producing text for people or for an index: digests, notification bodies, email plain-text parts, a corpus for a search engine. If you need a faithful structural copy rather than a readable one, it is the wrong end of the trade.

### Pandoc as a subprocess

Pandoc is not a library you import; it is a binary you launch. In the HTML-to-Markdown direction the invocation is short:

```bash
pandoc -f html -t gfm --wrap=none input.html -o output.md

# or read standard input, which is what you want from code
cat input.html | pandoc -f html -t gfm --wrap=none
```

From Node, pass the arguments as an array so no shell is involved and the HTML never has to be quoted:

```js
import { execFileSync } from 'node:child_process';

const markdown = execFileSync(
  'pandoc',
  ['-f', 'html', '-t', 'gfm', '--wrap=none'],
  { input: html, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
);
```

From Python:

```python
import subprocess

markdown = subprocess.run(
    ["pandoc", "-f", "html", "-t", "gfm", "--wrap=none"],
    input=html,
    capture_output=True,
    text=True,
    check=True,
).stdout
```

Four things about this pattern are worth being deliberate about.

**The process is the cost.** One conversion is free. Ten thousand conversions is ten thousand process launches, each with its own startup, and that is the point at which an in-process library wins regardless of how good Pandoc's output is. Batch the work into fewer calls or use a library.

**`maxBuffer` and the pipe are real limits.** A large document returned through a pipe has to fit in the buffer you allowed. The default in Node is not generous, and the failure mode is a truncated document rather than an exception you would notice in testing.

**Never build the command as a string.** Passing an array, as above, means the HTML travels on standard input and no shell interprets any of it. Building `pandoc ... "${html}"` with interpolation is a command injection waiting for the first document containing a backtick.

**Check the exit code.** `check=True` in Python and the throw-on-nonzero behaviour of `execFileSync` are doing necessary work. A subprocess that fails quietly gives you an empty file, and an empty file looks like a document with no content rather than like an error.

The reason to accept all that is `-t gfm` and everything downstream of it. Pandoc reads HTML and writes to a long list of other formats, so the same pipeline that produces Markdown can produce DOCX, LaTeX or EPUB from the identical source, and `--sandbox` restricts filesystem access when the input is not yours. `--wrap=none` matters for the same reason `--body-width=0` does in html2text.

**Who it is for.** Build pipelines, scheduled jobs, and any project where Markdown is one output among several. Not for a per-request conversion in a web service.

## Tables, code blocks, nested lists and whitespace

This is the comparison that decides real projects, and it is not the one library READMEs lead with.

| Concern | Turndown | node-html-markdown | html-to-md | html2text | Pandoc |
| --- | --- | --- | --- | --- | --- |
| Tables | Plugin required (`tables` or `gfm`) | Handled by the default translators | `table`, `thead`, `tbody`, `tr`, `th`, `td` supported | Markdown tables, plus `--pad-tables`, `--bypass-tables`, `--ignore-tables` | Pipe tables with `-t gfm` |
| Code blocks | `codeBlockStyle: 'fenced'`, language read from a `language-*` class | `codeBlockStyle`, plus code-block-specific translators | `pre` and `code` in the supported-tag list | Indented by default; `--backquote-code-style` for fences | Fenced, with the language when the class says so |
| Nested lists | Indents nested content, including the marker offset | Handled by the list translators | `ul`, `ol`, `li` supported | Handled, with wrapping controlled by `--wrap-list-items` | Handled |
| Whitespace | Collapsed; `preformattedCode` for `code` | `maxConsecutiveNewlines`, `preserveWhitespace` per translator | Not directly exposed | `--body-width`, `--single-line-break` | `--wrap=none` |
| Runs in a browser | Yes, and accepts a live DOM node | Yes, native `DOMParser` when available | Yes, through a bundler | No | No |
| Parser | A DOM (`@mixmark-io/domino` in Node) | `node-html-parser` | Its own, dependency-free | Python's own | Pandoc's HTML reader |

Four notes on reading that table.

**Tables are a plugin decision, not a feature checkbox.** Turndown without `turndown-plugin-gfm` does not silently degrade a table into something readable — you get the cell text run together with the surrounding prose, which looks like the converter losing your data because that is what it is. This is the single most common Turndown surprise and it is entirely avoidable in one line.

**Code blocks depend on the class name, not the tag.** Every syntax highlighter emits a code block as `<pre><code class="language-python">` wrapped around a nest of per-token `<span>` elements. A converter that reads the class gives you an annotated fence and highlighting at the other end; one that does not gives you a bare fence and a loss you will only notice when the page is published. [What a code block needs to survive conversion](/blog/code-blocks-in-markdown) is a short list, and the language class is the top of it.

**Nested list indentation is where files stop being portable.** Markdown parsers disagree about how much indentation makes a child list rather than a code block, and a converter that indents nested content by a different amount than your renderer expects produces a document that looks right in one place and wrong in another. Convert a three-level list and open the result in the renderer that will actually publish it.

**Whitespace is a diff problem before it is an appearance problem.** All five will produce something a browser renders identically. Only some of them produce something where a one-sentence edit shows up as a one-line diff. If the Markdown is going into a repository, whitespace control — `--wrap=none`, `--body-width=0`, `maxConsecutiveNewlines` — is not cosmetic configuration.

## Where the obvious library answer fails

The obvious answer in JavaScript is Turndown, and it is the right default. Here is where it, and the whole category, stops being enough.

**A library converts what you give it, and a saved page is mostly not the article.** None of these tools has an extraction stage. Hand any of them a saved news page and you get the masthead, the navigation, the cookie notice, the subscription prompt, the related-articles list and a footer of sixty links, faithfully translated into Markdown, with the article somewhere in the middle. `remove` and `skipTags` help; they are not a content extractor. If the input is whole pages, you need something that finds the article first, and [saving a web page as Markdown](/blog/save-a-web-page-as-markdown) is a different job with different tools.

**Configuration is code, and code is a maintenance cost.** Thirty rules mapping a site's class names onto Markdown constructs is a small program. It works until the site is redesigned, at which point the class names change and your converter silently stops recognising callouts. Nobody notices, because the output is still valid Markdown. Rule sets tied to somebody else's markup have an expiry date that is not written down anywhere.

**The DOM is a memory cost you did not budget for.** Turndown's parse of a large document is a full DOM, which means a node object for every element and every run of text rather than the bytes you handed it. That is fine on a laptop and it is exactly the sort of thing that fails in a constrained function runtime — and it fails on the largest documents in the corpus rather than the first ones, so an import can run happily for a long time before it breaks. Measure with your biggest real input rather than a representative one.

**Escaping makes output that is correct and looks wrong.** Every library escapes Markdown punctuation in text, because it has to. The result is `my\_file\_name.txt` and `1\. Introduction`, which render correctly and read badly to anybody who opens the raw file. If a human is going to review the Markdown, they will file this as a bug against your converter, repeatedly. It is not one, and telling them so does not help.

**Nothing here sanitises.** Turndown removes no elements by default. A converter's job is translation, not safety, and Markdown that carries raw HTML through — because you used `keep`, or because the library emits raw HTML for what Markdown cannot express — is Markdown that can carry a `<script>` tag to the next renderer. The cost of getting this wrong is not a bad-looking file.

**And the round trip is not a round trip.** Converting HTML to Markdown and back does not return the HTML you started with, in any of these libraries, ever. Layout, classes, ids, inline styles, spanning cells, forms and embeds have no Markdown representation. If somebody is expecting HTML in and equivalent HTML out, correct that expectation before writing code, because no configuration reaches it.

## How to choose a library

1. **Start with where the code runs, because that eliminates options before any feature does.** A worker or an edge function with no DOM rules out the DOM-based path; a browser bundle with a size budget rules out anything that pulls a parser tree behind it; a build script rules nothing out and can shell to Pandoc.
2. **Decide whether you need per-element rules, and be honest about it.** If the HTML is generated by one system you control, the defaults are probably enough and Turndown's rules API is complexity you will not use. If the HTML comes from many sources with meaningful class names, that API is the entire reason to choose it.
3. **Convert your worst document before you commit, not your simplest.** Pick the page with a table, a highlighted code block, a three-level list and a callout. Whatever keeps those four keeps nearly everything else, and you will know in ten minutes rather than after two hundred documents.
4. **Set the wrapping and whitespace options on day one.** `--wrap=none`, `--body-width=0`, `maxConsecutiveNewlines`: choosing these after the corpus is converted means converting it twice, because rewrapping changes every line of every file and buries the real changes.
5. **Check the licence against your project before you check the features.** html2text is GPLv3 and Pandoc is GPL; Turndown, node-html-markdown and html-to-md are MIT. For a library you are shipping inside a product, that difference decides the shortlist regardless of output quality.
6. **Write down what happens to what Markdown cannot express.** Dropped, kept as raw HTML, or approximated by a rule you wrote — pick deliberately per element class. Left undecided, the library picks for you, and it picks differently in each of the five.

## Conclusion

There is no best HTML to Markdown library, only a shortest distance between your input and the file you need. In JavaScript, start with Turndown and the GFM plugin, and reach for its rules API only when a class name is carrying meaning; move to node-html-markdown when there is no DOM or the volume is real; choose html-to-md when the converter is a detail in a bundle. In Python, html2text if the output is for reading and its GPLv3 licence is acceptable. Shell to Pandoc when Markdown is not the last format the document becomes. And when the job is one file rather than a pipeline, a library is the wrong shape of answer entirely — [transformpipe's HTML to Markdown conversion](/html-to-markdown) runs in the browser with nothing uploaded and nothing installed, which is a faster route to the same Markdown than any `npm install`.

## FAQ

### What is the best HTML to Markdown library for JavaScript?

Turndown, for most projects: it runs in the browser and in Node, and its rules API lets you override the handler for any element without forking the library. Add `turndown-plugin-gfm` unless you are certain the input has no tables. Choose node-html-markdown instead when there is no DOM available or you are converting in bulk.

### Does Turndown support tables?

Not in the core, which implements CommonMark, and CommonMark has no tables. `turndown-plugin-gfm` adds them, along with strikethrough and task list items; `turndownService.use(gfm)` enables all three, or you can import `tables` on its own. Without the plugin, a table's cell text is run together with the surrounding prose.

### How do I make Turndown ignore an element?

`remove(filter)` deletes the element and its contents, and takes a tag name, an array of tag names or a filter function. Nothing is removed by default, so `remove(['script', 'style', 'noscript'])` is worth adding to any converter that handles HTML you did not write. Use `keep(filter)` instead when you want the original HTML in the output rather than nothing.

### What does blankReplacement do in Turndown?

It decides what happens to nodes that contain only whitespace — the empty paragraphs a content management system leaves behind. The blank rule runs before every other rule, including yours, so an empty element never reaches a rule you wrote. Setting `blankReplacement: () => ''` removes those gaps, at the cost of losing block separation where an empty node was the only thing providing it.

### Which HTML to Markdown libraries run in a browser?

Turndown, node-html-markdown and html-to-md all do. Turndown will accept a live DOM element rather than a string, which is why browser extensions use it. html2text is Python and Pandoc is a binary, so neither runs client-side; converting in the browser without a build step means one of the JavaScript three, or [a converter page that already bundles one](/blog/best-html-to-markdown-converters).

### What does --backquote-code-style do in html2text?

It makes multi-line code blocks use triple-backquote fences instead of indentation. Without it you get indented blocks, which cannot carry a language annotation, or `[code]` markers if you passed `--mark-code`. Pair it with `--body-width=0` so the code is not hard-wrapped at the default line length.

### Is it worth calling Pandoc from code instead of using a library?

Yes when Markdown is not the only output — the same call can produce DOCX, LaTeX or EPUB from the same HTML — and no when you are converting per request. Each conversion is a process launch, so throughput is poor compared with an in-process library. Pass arguments as an array and the HTML on standard input, never as an interpolated shell string.
