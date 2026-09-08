---
title: "Markdown to Text: Strip the Syntax, Keep the Words"
description: Convert Markdown to plain text without wrecking it - why a regex breaks on fences, escapes, tables and reference links, and what Pandoc, remark and lynx do
date: 2026-08-23
tag: Converting
keywords: markdown to text, markdown to plain text, strip markdown, remove markdown formatting, markdown to txt, pandoc plain text, markdown word count
---

### TL;DR

Use a parser, never a regular expression: fenced code, backslash escapes, tables, reference links and raw HTML blocks all break pattern matching, and they break it silently. For a whole document, `pandoc -t plain` is the shortest correct route, with `--wrap=none` when the output is going into a diff or a grep. Inside a JavaScript or Python build, walk the token stream you already parse — `strip-markdown` for remark, `md.parse()` for markdown-it — because every element needs a decision and the decisions should be visible in your code. Rendering to HTML and then flattening it with `lynx -dump` or the `html-to-text` package is the other honest route, and the only one that handles raw HTML properly.

Markdown is designed to be readable as text, which is exactly why people underestimate this conversion. The file already looks like prose. Strip a few asterisks, drop the pound signs, and it is plain text — that is the intuition, and it survives contact with about four files.

Then you hit one with a fenced Python block full of `*args`, a table whose numbers only mean something next to their column headers, a set of reference links defined at the bottom, and a `<details>` element wrapped around half the content. Now every asterisk you remove is a decision. Some of them are formatting. Some of them are somebody's code. One of them is escaped, and means a literal asterisk on the page.

The real question is not how to delete the markup. It is what you do with the information the markup was carrying. A heading is a heading because of its size; in a `.txt` file there is no size. A list item is an item because of its bullet; remove the bullet and three items run together into one sentence that says something nobody wrote. That is the job: not deletion, but a set of choices about what carries the structure once there is no markup left to carry it.

## Quick comparison: the cheat sheet

| Route | Best for | What it needs | What happens to tables | Licence and price |
| --- | --- | --- | --- | --- |
| `pandoc -t plain` | A whole document, faithfully | A Pandoc install | Kept as a text table, padded with spaces | Free, GPL |
| `pandoc -t plain --wrap=none` | Diffing prose, grepping, one line per paragraph | The same | The same | Free, GPL |
| remark + `strip-markdown` | A step in a Node build | Node, three packages | Removed entirely by default | Free, MIT |
| `mdast-util-to-string` | One string for a search index field | Node, a Markdown parser | Cell text concatenated with no separator | Free, MIT |
| markdown-it tokens | You already render with markdown-it | Node | Whatever you write, token by token | Free, MIT |
| markdown-it-py tokens | The same, in Python | Python | Whatever you write | Free, MIT |
| `remove-markdown` | A preview line or a snippet | Node, one small package | Pipes left behind on edge cases | Free, MIT |
| Render to HTML, then `lynx -dump` | Reading a document in a terminal | Lynx installed | Drawn as a text table at `-width` columns | Free, GPL |
| Render to HTML, then `w3m -dump` | The same, a different renderer | w3m installed | Drawn as a text table at `-cols` columns | Free, open source |
| `html-to-text` (npm) | The text part of an email | Node | A per-selector formatter, `dataTable` for real tables | Free, MIT |
| BeautifulSoup `get_text()` | A quick extraction in Python | Python, bs4 | Flattened, boundaries lost without a separator | Free, MIT |
| `html2text` (Python) | You actually wanted Markdown | Python | Markdown pipe tables — it emits Markdown | Free, GPLv3 |
| A browser converter's text download | One file, now, no install | A browser | The converter's decision, not yours | Free |
| `sed`, `awk`, a regex you wrote | Nothing you intend to keep | Nothing | Destroyed quietly | Free |

Licences and options as documented on pandoc.org, github.com and linux.die.net (checked on 8 September 2026).

## Stripping markup is a set of decisions, not a deletion

Before any tool, the list of decisions. Every one of these has a defensible answer and a wrong-for-your-case answer, and a converter that does not let you see its choices has made them anyway.

| Element | What the markup carried | What plain text can do about it |
| --- | --- | --- |
| Heading | Rank, and a visual break | A line of its own with blank lines around it, capitals, or a dashed underline |
| List item | "This is one of several" | Keep a `- ` marker, or lose the boundary between items |
| Ordered item | A number that is content | Keep the number; it is referred to elsewhere |
| Link | Text plus a destination | Text only, text with the URL inline, or a numbered reference list |
| Image | Alt text and a file | The alt text, or nothing |
| Table | Row and column association | Padded columns, one line per row, or a field-per-line block |
| Code block | "Do not touch any of this" | Verbatim, never wrapped, never stripped |
| Block quote | Somebody else said it | Keep `> ` or an indent; drop it and it becomes your sentence |
| Emphasis | Stress, or a defined term | Nothing, or capitals, or underscores back again |
| Footnote | A marker and a note elsewhere | A `[1]` marker and a list at the end |

### Headings

A heading in plain text has no rank available to it. The usual answers are: put it on its own line with a blank line above and below and let position do the work; set it in capitals; or underline it with dashes. Note that the third answer has quietly reintroduced markup — a line of text with `---` under it is a setext heading, valid Markdown, and your `.txt` file now round-trips into a document again.

Position alone is the safest choice and the weakest one. A document with six levels of nesting flattens to a stream where an H2 and an H4 look identical, and a reader four screens down cannot tell which section they are in. If the hierarchy is the content — a specification, a contract, a runbook — number the headings before you flatten, because the numbers survive where the sizes do not.

### Lists

Keep the bullet. This surprises people who want "no markup at all", but `- ` and `* ` were plain-text list conventions in email long before Markdown existed, and they read as lists to a person and to most tokenisers. Remove them and consecutive items concatenate: three items reading "check the disk", "restart the service", "file a ticket" become one line that reads like a single instruction.

Ordered lists are stricter. The number is content, not decoration, because something else in the document says "if step 3 fails". A converter that renumbers, or that drops numbers in favour of bullets, has changed the document. Nesting needs its indentation preserved too, which costs you columns off the right-hand margin — and if you are also wrapping at 72 characters, the indent has to come out of that budget. The [loose and tight list distinction](/blog/markdown-line-breaks-and-lists) decides whether items get blank lines between them, and it is worth settling deliberately rather than inheriting.

### Links

Three options, no fourth. Drop the URL and keep the text, which is short and leaves the reader unable to follow anything. Keep both inline as `the deployment guide (https://example.com/docs/deploy)`, which is complete and turns any sentence containing a tracking URL into a mess. Or collect them as numbered references at the end, which is what Lynx does by default and what its `-nolist` flag turns off.

Pick by consumer. For an email a person reads, the reference list at the end is the polite version. For a search index, drop the URLs entirely — indexing `utm_source=newsletter` helps nobody, and the tokens it adds compete with the words that matter. For a word count, drop them, or your count includes a 120-character URL as one word and a shortened one as five.

### Tables

This is the decision that cannot be deferred and the one most tools get wrong for your case. Padded columns look right, and only in a monospace font at a width no narrower than the longest row; forwarded into a mail client using a proportional font, the alignment collapses and the numbers scramble. One line per row with a separator survives any width and loses the header association after the first row scrolls past. A field-per-line block — `Region: EMEA`, `Cost: 40`, one blank line between records — is verbose, reads correctly at any width, and is the only version that makes sense read aloud.

Whichever you choose, check what your tool did before trusting it, because [tables are the first thing to break in any conversion](/blog/markdown-tables-that-survive-conversion) and the failure looks like success. And remember that pipe tables are not in the CommonMark specification at all — they arrived with [GitHub Flavored Markdown and the other flavours](/blog/commonmark-gfm-and-the-flavours) — so a parser running strict CommonMark never saw a table in the first place. It saw a paragraph full of pipe characters, and it will hand you exactly that.

### Code, quotes and the rest

Code blocks come out verbatim or they come out wrong. No wrapping — a wrapped shell command is a broken shell command. No stripping inside them, ever, for reasons the next section covers at length. For some destinations the right answer is to drop code entirely: a 400-token code sample on a 600-word page will dominate a search index and make the page match queries it has nothing to say about. [What a fenced block actually is](/blog/code-blocks-in-markdown) matters here, because there are more ways to write one than most strippers know.

Block quotes need their `> ` or an indent kept. Dropping the marker turns a quotation into your own assertion, which is a change of meaning rather than a change of formatting. Images reduce to their alt text or to nothing, and if the alt text is empty — decorative image, correctly marked — the honest output is nothing at all.

## Why the regex you were about to write is wrong

The pattern is always the same. Someone writes six substitutions, tests them on a README, ships it, and eleven months later a customer's invoice has a missing row. Regular expressions cannot parse Markdown because Markdown is context-sensitive: what a character means depends on what block it is inside, and a pattern has no idea what block it is inside.

Here are the five cases that break it, in the order they will bite you.

### Fenced code

A fence is not a paragraph, and nothing inside it is markup. Python's `*args` and `**kwargs`, C's `#include`, a shell glob `*.log`, a diff whose lines start with `-`, a snake_case identifier full of underscores, a shell pipeline made of `|` characters — a stripper that removes emphasis markers globally corrupts every one of them. This is worse than leaving the markup in, because the output still claims to be code and is now wrong. Nobody notices until they run it.

The fence itself is more varied than the naive pattern expects:

```text
~~~js
const total = a | b;
~~~
```

CommonMark allows three or more backticks or three or more tildes, an info string after the opening run, and up to three spaces of indentation before it. A fence can contain shorter runs of its own character without closing. Inside a list item it is indented to the item's content column. And separately from all of that, four spaces of leading indentation is itself a code block, with no fence anywhere. A regex tuned for triple backticks at the start of a line misses tilde fences, indented fences and indented code blocks — three ways to leak markup handling into somebody's source code.

### Escaped characters

In CommonMark a backslash before an ASCII punctuation character makes that character literal. `\*not emphasis\*` is prose about asterisks. A stripper that removes backslashes leaves `*not emphasis*`, which the next tool in the chain will read as emphasis. A stripper that removes asterisks leaves `\not emphasis\`. Both are wrong, in opposite directions, and neither error is visible in a diff of the output unless you are looking for it.

HTML entities are the same problem wearing a different hat. A parser decodes `&amp;` to `&`, `&copy;` to the copyright sign and `&#42;` to an asterisk. A regex leaves the entity text sitting in your plain text file, so the reader gets `Smith &amp; Sons` in an email body, and the word count counts `&amp;` as a word. `\\` — an escaped backslash — is the case that catches the clever fix, because now you need to know whether the backslash you are looking at was itself escaped by the one before it.

### Tables

A row of pipes is only a table if the delimiter row is there. Without `| --- | --- |` under the header, it is a paragraph. With it, the pipes are structure. A pattern that deletes `|` characters on sight destroys both: the paragraph loses its punctuation, and the table becomes a run of words with no boundaries. `EMEA 40 3 weeks` was once four cells with headers, and there is no way to recover which number was which.

Cells complicate it further. A pipe inside a cell is escaped as `\|`. A pipe inside inline code is not a delimiter at all. Alignment colons — `:---`, `---:`, `:---:` — are structure that carries no words and must vanish. And cells contain inline markup of their own, so whatever you decided about links and emphasis applies inside every cell too.

### Reference links

Everyone's regex handles `[text](url)`. Markdown has four other link forms and they are all common in files written by people who edit them by hand:

```text
See the [deployment guide][deploy] and the [runbook].

[deploy]: https://example.com/docs/deploy "Deploy"
[runbook]: https://example.com/docs/runbook
```

The full reference form `[text][id]`, the collapsed form `[text][]` and the shortcut form `[text]` all point at a definition that may be hundreds of lines away, usually at the bottom of the file. A pattern that only knows inline links leaves the square brackets in the prose and leaves the definition block as a final paragraph of bare URLs — which is exactly the shape of output that looks fine in a spot check and is obviously broken to whoever receives it. Add angle-bracket autolinks `<https://example.com>`, GFM's bare-URL autolinking, and image syntax that the naive pattern turns into `!alt text`, and the number of forms to handle is not five, it is closer to a dozen.

### HTML blocks

Markdown permits raw HTML, so a `.md` file can contain anything HTML can. In practice it contains `<details>` and `<summary>` around collapsible sections, `<img>` with a width attribute, `<br>` for line breaks the syntax will not give, `<sub>` and `<sup>`, whole hand-written `<table>` elements, and `<!-- comments -->` that were never meant to be published.

Tag-stripping with a pattern fails on all of it. `<!-- TODO: check these numbers with legal -->` is a comment whose text a regex will happily promote to prose, in a document you are about to send someone. A `<script>` element is worse: strip the tags and the JavaScript body becomes a paragraph. Attribute values leak the same way — a stripper that removes `<` to `>` spans still has to decide whether an `alt` attribute's text is content, and a pattern cannot tell an attribute from a text node. Anything involving raw HTML in a file you did not write yourself belongs to a real HTML parser, which is one of the strongest arguments for the render-then-flatten route below.

There is one honest use for a regex-based stripper: a preview line. If you need the first 140 characters of a document for a card or a search result, a wrong asterisk is cosmetic and the failure is visible. Anywhere the text has to be right, use a parser.

## Where plain text is genuinely the right output

Plain text is not a downgrade of HTML. For several jobs it is the format the receiving system actually accepts, and handing those systems Markdown instead is the mistake.

**Plain-text email.** A well-formed HTML email is a `multipart/alternative` message whose parts are ordered least-faithful first (RFC 2046), which means the `text/plain` part comes before the HTML one. If you build that part by pasting the Markdown source in, your recipient reads `**Important**` and `[the invoice](https://…)` with the punctuation showing. RFC 5322 recommends lines of no more than 78 characters, so wrap at 72 and leave room for the `> ` quote markers a reply will add; if you want the client to reflow the paragraphs itself, that is what `format=flowed` (RFC 3676) is for.

**Word counts.** `wc -w` on a raw `.md` file counts table pipes, fence lines, reference definitions and every URL as words. A file that reports 900 words might be 700 words of prose and 200 words of syntax and code. `pandoc -t plain file.md | wc -w` gives the number a person would agree with, and dropping code blocks before counting changes it again — which is why a word count is only meaningful alongside the flags that produced it.

**Search indexing.** Tokenising raw Markdown puts `**`, `](` and `https` into your index, matches queries inside code samples, and produces snippets with the syntax visible to the user. Static-site search tools sidestep this by indexing the built HTML rather than the source, which is the same insight from the other end: index what the reader sees. If you are building the index yourself, flatten first, and decide explicitly whether code blocks are searchable content or noise.

**Speech and read-aloud.** A text-to-speech engine takes a string. Give it Markdown and you get punctuation read out, or markers glued silently to the words around them. Worth being precise here, though: on the web, semantic HTML beats flattened text every time — a screen reader wants real headings, lists and table cells as elements, and stripping them to text removes the navigation the reader relies on. The plain-text case is for pipelines that accept a string, not for pages a person opens.

**Terminal output.** A commit message, a `--help` text, a CI log line, a notification body. None of them render markup, and all of them get Markdown pasted into them anyway. Note that `glow` and `mdcat` do the opposite job — they render Markdown for a terminal using ANSI escapes and box drawing — which is lovely to read and is not a `.txt` file.

**Diffing prose.** This is the case people arrive at last and value most. When two versions of a document differ only because someone reflowed the paragraphs, a line diff reports the whole paragraph as changed and tells you nothing. Convert both versions with `--wrap=none` so that one paragraph is one line, then diff with `git diff --word-diff`, and what you see is the words that changed. The same trick makes a converted `.docx` comparable against the Markdown that was supposed to match it.

## The tools, one at a time

### Pandoc — the shortest correct route

Pandoc has `plain` as an output format, so the whole job is one command:

```bash
pandoc -t plain notes.md -o notes.txt
```

| Pros | Cons |
| --- | --- |
| A real parser, so every case in the previous section is handled | A Haskell binary to install |
| Wrapping, columns and comment handling are flags, not code | Its plain writer's choices are its own, and only partly configurable |
| Tables survive as text tables rather than vanishing | Padded tables need a monospace font to read correctly |
| Reads many input formats, so the same command serves `.docx` and HTML | Markdown dialect differences mean you should name the reader |

**Price:** free, GPL licensed.

**Technical details and features**

- `--wrap=auto` is the default and wraps to `--columns`, which defaults to 72; `--wrap=none` puts each paragraph on one line, and `--wrap=preserve` keeps the source's own line breaks (checked on pandoc.org, 8 September 2026)
- `--strip-comments` removes HTML comments from the source rather than passing them through
- Links come out as their label with the URL dropped; images come out as their alt text in square brackets; inline code comes out as the bare string; footnotes become `[1]`-style markers with a list at the end (checked in the writer's source on github.com, 8 September 2026)
- Emphasis and strong text come out as bare text, unless you enable the `gutenberg` extension, which brings back `_underscores_` for emphasis and sets strong text in capitals (checked on github.com, 8 September 2026)
- Name the reader when the input is GitHub Flavored — `-f gfm` — so task lists and autolinks are read the way they were written

**Who should use it?** Anybody converting whole documents who can install one binary. It is the default answer, and the only reason not to take it is that you need the decisions to live in your own code.

### remark and `strip-markdown` — a step in a Node build

The unified pipeline parses Markdown to an mdast tree, and `strip-markdown` is the plugin that flattens it: parse, strip, stringify.

| Pros | Cons |
| --- | --- |
| A real tree, so nothing depends on pattern matching | Three packages and an ESM pipeline to set up |
| `keep` and `remove` options make the decisions explicit | The defaults delete more than people expect |
| Sits inside a build you already have | Slower than a single binary for one file |

**Price:** free, MIT licensed.

**Technical details and features**

- Its own description is that it removes everything but paragraphs and text
- By default it removes code blocks, HTML, thematic breaks, tables and YAML or TOML front matter, and it preserves image alt text (checked on github.com, 8 September 2026)
- `keep` takes a list of node types to leave unchanged; `remove` takes node types to remove or replace with a handler
- Because it runs before `remark-stringify`, "keeping" a table means the stringifier writes it back out as a Markdown table — keeping the data and removing the markup are two different requests, and the middle ground needs a handler you write

**Who should use it?** JavaScript projects that already parse Markdown with remark, and anyone who wants the element-by-element decisions written down in configuration rather than inferred from output.

### `mdast-util-to-string` — one string, for machines

Sometimes you want a single string for a search index field or an excerpt, and structure is irrelevant. This utility gets the text content of a node, preferring plain-text fields and otherwise serialising children.

| Pros | Cons |
| --- | --- |
| One call, one string | Children are joined with an empty separator |
| Optional image alt text via `includeImageAlt` | Block boundaries disappear entirely |
| Tiny, and already in the tree if you use remark | Not for anything a person reads |

**Price:** free, MIT licensed.

The empty separator is the thing to know. Because the joining call uses `''`, a heading runs straight into the paragraph that follows it: "Pricing" plus "We charge per seat" becomes `PricingWe charge per seat`. For an index field that is usually harmless, since the tokeniser splits on the boundary anyway — but for a snippet a user sees, or a count of words, it produces nonsense. The fix is to walk the tree yourself and join block-level nodes with a blank line.

**Who should use it?** Anyone filling a machine-read field, who has checked that the concatenation does not matter.

### markdown-it and markdown-it-py — walking the token stream

If your application already renders Markdown with markdown-it, you already have the lexer. `md.parse(source, {})` returns a flat array of tokens with types like `heading_open`, `inline`, `fence` and `table_open`, and you emit text for the types you want.

| Pros | Cons |
| --- | --- |
| Every decision is one branch of a switch statement you can read | You now own every decision, including the ones you forget |
| No second dependency, and no second parser to disagree with the first | More code than a flag |
| The same token model exists in Python as markdown-it-py | Table layout is entirely yours to compute |

**Price:** free, MIT licensed.

**Who should use it?** Applications where the output has to match a house format — a specific email template, a fixed-width report, a log line — and teams who would rather maintain fifty lines of explicit choices than argue with a converter's defaults.

### `remove-markdown` — the honest regex

A small, regex-based package that strips Markdown formatting from a string. It is what a careful version of the pattern you were going to write looks like, and it fails on the same cases for the same reasons.

**Price:** free, MIT licensed.

**Who should use it?** Nobody, for a document. It is a reasonable choice for a preview line, a card subtitle or a notification body, where the text is short, the source is yours, and a stray character is cosmetic.

### Render to HTML, then flatten it

Two hops instead of one: Markdown to HTML with a real Markdown parser, then HTML to text with a real HTML consumer. It sounds wasteful and it settles two problems at once. The flavour question is answered by the Markdown parser, and the raw HTML in the source is handled by a tool whose whole job is HTML — which no Markdown-level stripper can claim.

| Tool | What it is | Notable behaviour |
| --- | --- | --- |
| `lynx -dump` | A text browser, dumping formatted output to stdout | Wraps to `-width`, default 80; appends a link list unless you pass `-nolist`; `-stdin` reads from a pipe on UNIX |
| `w3m -dump` | Another text browser | `-cols` sets the width; draws tables |
| `html-to-text` (npm) | A library built for this | `wordwrap`, per-CSS-selector `selectors` and `formatters`, `preserveNewlines`, `ignoreHref`, `hideLinkHrefIfSameAsText`, `dataTable` |
| BeautifulSoup `get_text()` | A Python HTML parser's text accessor | Concatenates strings; pass a separator or lose the boundaries |

**Price:** Lynx is free and GPL licensed; `html-to-text` is free and MIT licensed; BeautifulSoup is free and MIT licensed. Options quoted from linux.die.net and github.com (checked on 8 September 2026).

The library route is the one to pick for email, because `html-to-text` exposes its formatting decisions per selector: you say what an `a` element does, what a `table` does, and where the wrap falls, and the answers live in your configuration rather than in a browser's rendering conventions. The browser route is the one to pick for reading, because a text browser has spent thirty years deciding how a document looks in 80 columns and it is better at it than you will be this afternoon.

Both hops cost you something. You are maintaining two conversions rather than one, and the HTML stage brings its own conventions — Lynx numbers your links and appends a reference list, w3m lays out tables its way. Neither is wrong; both are surprises if you did not expect them.

### `html2text` — the name that misleads

Worth naming precisely, because it is the first search result and the wrong tool for this job. The Python `html2text` describes itself as converting HTML into clean, easy-to-read plain ASCII text that also happens to be valid Markdown. That is the point of it: the output is Markdown. `--ignore-links` and `--reference-links` change how much of it there is, and `--mark-code` wraps code in tags of its own, but you are converting [HTML to Markdown](/blog/convert-html-to-markdown), which is a different job with a different set of tools. It is free and GPLv3 licensed.

**Who should use it?** Anyone who wanted Markdown. Anyone who wanted text should be looking at the row above.

### A browser converter, when the install is the problem

transformpipe converts a Markdown file in the browser and offers the result as a plain text download alongside HTML and Markdown, with nothing uploaded while you are signed out and a 10 MB cap on a conversion. The decisions about headings, links and tables are the tool's rather than yours, which is the trade: no install, no flags, and no control.

**Price:** free.

**Who should use it?** Somebody with one file and no wish to install a Haskell toolchain to flatten it — a document to paste into a ticket, an email body, a note.

## Where stripping the syntax fails, and what it costs

Every route above is a compromise, and it is worth being blunt about which compromises are unavoidable.

**Structure has nowhere to live.** Plain text has one channel — the sequence of characters — and it has to carry the words, the hierarchy, the emphasis and the tabular relationships all at once. A checklist of thirty items across three levels of nesting flattens into a wall that a reader cannot navigate. Numbering the headings helps and is not free: you have added text that was not in the document.

**Tables lose the association, not the data.** Every value survives; what disappears is which column it belonged to. Padding preserves it, at the cost of requiring a monospace font and a window at least as wide as the widest row, and there is no way to guarantee either in an email client. Field-per-line preserves it and triples the length. Choose in advance, because the failure mode of choosing late is a table that looked right in your terminal and arrived as scrambled numbers.

**Links cannot be both short and complete.** Inline URLs wreck the line; dropped URLs remove the destination; a reference list at the end asks the reader to go and look. There is no option that avoids all three costs, so pick the cost that suits the reader you actually have.

**Emphasis is sometimes meaning.** A term that is bold on first use because it is being defined, a warning in bold in a runbook, a negation in italics — flattening removes the only signal that those words differ from the ones around them. Capitals are the usual substitute and they read as shouting. In a document where emphasis carries obligation, that is a change to the document.

**It does not round-trip.** Text out is not Markdown in. Once the tree is gone you cannot rebuild the headings, and anything downstream that wants structure will have to guess. Keep the `.md` as the source of truth and treat the `.txt` as an artefact, regenerated rather than edited.

**The number moves with the flags.** Word counts, character counts and reading times all depend on whether code blocks were dropped, whether URLs were kept and whether headings were counted. A count is only comparable with another count produced by the same command, which matters the moment somebody writes a word limit into an agreement.

And the largest one: if the reason you want plain text is that the markup is in the way, check whether the answer is HTML instead. A rendered document keeps the headings, the lists and the table cells, opens everywhere, and needs no decisions from you about what carries the structure. Plain text is the right output when something downstream takes a string. It is the wrong output when the reader is a person with a browser.

## How to choose

1. **Name the consumer before the tool.** A person in a mail client, a tokeniser, a diff, a speech engine and a terminal each want a different set of decisions, and a converter tuned for one produces output that is faintly wrong everywhere else.
2. **Settle the table question first.** It is the only decision that cannot be deferred: padded columns commit you to a monospace font and a minimum width, and field-per-line commits you to three times the vertical space. Deciding after you have shipped means re-deciding in front of a customer.
3. **Use a parser, not a pattern.** Any file with a fence, an escape, a reference link or a raw HTML block will break a regular expression, and it breaks silently — you get text that reads fine and is missing a row, which is the most expensive kind of wrong.
4. **Fix the wrap width once, at the boundary.** `--wrap=none` for diffs and greps, 72 columns for email, the terminal's own width for a CLI. Wrapping twice — once in the converter and once in the client — is how a document ends up with three-word lines.
5. **Test on your ugliest file.** The one with the nested list, the `<details>` block, the table with an escaped pipe in a cell and the reference links defined at the bottom. That file decides whether a tool works; a clean README decides nothing.

## Conclusion

Markdown to text is a small conversion with a long list of judgement calls, and the tooling divides cleanly along one line: parsers get it right and patterns get it silently wrong. Reach for `pandoc -t plain` when you want the whole document and can install a binary, walk the token stream when the decisions have to live in your code and match a format somebody else specified, and render to HTML before flattening when the source contains raw HTML you did not write. When the job is one file and the install is the obstacle, [a browser-side converter](/) will hand you a text download without uploading anything. Whichever route you pick, keep the Markdown as the source and treat the text as output — and run your worst file through it before you trust the good ones.

## FAQ

### How do I convert Markdown to plain text on the command line?

`pandoc -t plain input.md -o output.txt` is the shortest correct answer, and it wraps to 72 columns by default. Add `--wrap=none` if the output is going into a diff or a grep, and `--strip-comments` if the source contains HTML comments you do not want promoted to prose.

### Can I just use a regular expression to strip Markdown?

Only where a mistake is cosmetic, such as a preview line or a card subtitle. Fenced code, backslash escapes, tables, reference links and raw HTML blocks each break pattern matching in a different way, and the output looks plausible while being wrong, which is why the bug is usually found by a reader rather than by a test.

### Why does my stripped text still contain brackets or bare URLs?

Almost always reference links. `[text][id]` and `[text]` forms point at definitions that usually sit at the bottom of the file, so a stripper that only handles `[text](url)` leaves the brackets in the prose and the definitions as a trailing block of URLs. A parser resolves the reference and gives you the label, the destination, or both, depending on what you asked for.

### Does a Markdown word count differ from a plain text word count?

Yes, and usually by more than people expect. Counting the raw file includes table pipes, fence lines, reference definitions and every URL as words, so a file reporting 900 words can be 700 words of prose. Flatten first, decide whether code blocks count, and record the command alongside the number.

### What happens to tables when Markdown becomes plain text?

It depends entirely on the tool, and the three answers are: keep them as padded text tables, which need a monospace font; flatten each row to a line, which loses the header association; or delete them, which several strippers do by default. Check what yours did on a real table before trusting it, because every one of those outcomes looks like a success in a spot check.

### Is `html2text` a Markdown to text tool?

No, twice over. It converts HTML rather than Markdown, and its output is deliberately valid Markdown rather than plain text — its own documentation says so. If you have HTML and want text, `lynx -dump` or the `html-to-text` package are the tools; if you have HTML and want Markdown, `html2text` is exactly right.

### Is plain text more accessible than HTML?

Not for anything a person opens in a browser. A screen reader uses the HTML structure — headings to navigate, lists to count items, table cells to relate a value to its column — and flattening the document removes all of it. Plain text is the right output for a pipeline that takes a string, such as a speech synthesiser or a search index, not a substitute for semantic markup.
