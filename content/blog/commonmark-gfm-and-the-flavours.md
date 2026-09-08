---
title: "CommonMark vs GFM: which Markdown are you actually writing?"
description: What CommonMark specified, what GFM adds rule by rule, and what travels only as an extension - plus a feature-by-implementation table so you can predict what breaks
date: 2026-08-18
tag: Syntax
keywords: commonmark, commonmark vs markdown, github flavored markdown, gfm, gfm vs commonmark, markdown flavours, markdown spec, markdown extensions
---

Paste one file into three tools and you can get three documents. One draws a table, another shows a row of pipe characters. One turns a single newline into a line break, another folds the lines into a paragraph. Nothing is broken and nothing is misconfigured. The tools speak different dialects, "Markdown" names the family rather than any one member, and knowing which member you are writing is most of the fix.

### TL;DR

CommonMark is a specification with a test suite: it settles the arguments about the original syntax and deliberately stops at a core, with no tables, no task lists, no strikethrough and no bare-URL autolinks. GFM is that specification plus exactly five named extensions — tables, task list items, strikethrough, autolinks, and a filter that escapes nine raw HTML tags — and it is the dialect most people mean when they say Markdown. Everything else you have seen in a `.md` file — footnotes, definition lists, attribute lists, maths, admonitions, front matter — is in neither specification and travels only as far as the next tool's extension list. Write for the strictest reader in the chain, and test with a probe file rather than a guess.

## Three specifications, and the years between them

John Gruber published Markdown in 2004: a syntax description on a web page, and `Markdown.pl`, a Perl script that turned that syntax into HTML. The last release was 1.0.1, dated 17 December 2004 (checked on daringfireball.net/projects/markdown, 8 September 2026). Page and script together were the definition, and wherever the prose was silent — which was often — whatever the script happened to do became the answer.

That is fine for one blog and painful for the second implementation. The description never says how many spaces indent a nested list, what happens when emphasis opens inside a word, how a list interacts with the block quote it sits inside, or whether a hard break survives at the end of a paragraph. Every implementer guessed, and the guesses differed. Within a few years there were dozens of libraries, all called Markdown, none agreeing about the awkward cases and all agreeing about the easy ones. So the comparison people search for as *commonmark vs markdown* is really a comparison between a specification and a description plus a script.

CommonMark, first published in 2014, is that missing specification written down. It defines the parsing rules in detail and ships hundreds of test cases, each a snippet of Markdown beside the exact HTML it must produce. There is no such thing as CommonMark-ish: an implementation passes the suite or it does not.

GFM came at the problem from the other end. GitHub had a renderer with millions of files pointed at it and a list of additions its users depended on, so it wrote the GitHub Flavored Markdown specification as a strict superset of CommonMark — the same document, with five extension sections added. That is why *commonmark vs gfm* has a short answer: same core, five named additions, no other differences. Everything past those five is somebody's extension, and extensions are where files stop travelling.

## What CommonMark actually settled

It is easy to read CommonMark as a shorter Markdown because of what it leaves out. The value is in what it pins down. Each of these was a real disagreement between implementations before the specification existed, and each is now answerable by pointing at a numbered example.

- **List indentation.** How far a child list must be indented is defined in terms of the parent's content column, not a fixed number of spaces. That is why `-` and `1.` markers behave differently when you nest under them: they are different widths.
- **Loose and tight lists.** A blank line between items makes the whole list loose, which wraps every item's text in `<p>`. One stray blank line changes the spacing of a list you did not touch — the most common surprise in the whole specification, and one that has [its own failure modes worth reading about](/blog/markdown-line-breaks-and-lists).
- **Emphasis.** The left-flanking and right-flanking delimiter run rules replace the old "it depends" for `snake_case_words`, `**bold**inside`, and every mixture of asterisks and underscores.
- **Fenced code blocks.** Backtick and tilde fences, the closing-fence rules, and the info string. The word after the fence is a label and nothing more: [every converter turns it into a class name and stops there](/blog/code-blocks-in-markdown).
- **Hard breaks.** Two trailing spaces or a backslash at end of line. A single newline is a space. This is a specification rule, not a preference, and it is the rule most tools offer an option to break.
- **HTML blocks.** Seven distinct kinds, each with its own start and end conditions, which is why a `<div>` sometimes swallows the Markdown after it and sometimes does not.
- **Link reference definitions**, entity references, tab expansion at four columns, thematic breaks, ATX and setext headings, and lazy continuation of block quotes.

CommonMark stops at that core on purpose. No tables, no footnotes, no strikethrough, no task lists, no autolinking of bare URLs. The reasoning is defensible: the core is what everyone already had in common, and freezing the arguments about it was the job. The consequence is that a strictly compliant parser renders your table as a paragraph full of pipes, silently, and correctly.

## What GFM adds, rule by rule

The GFM specification names five extensions. Four add syntax; one takes something away. Each has rules specific enough to trip on, and the failures are always silent — a table that is not recognised is just text.

**Tables.** A header row, a delimiter row, then zero or more body rows. The delimiter row is hyphens with optional colons: `:---` left, `:---:` centre, `---:` right. The rule that catches people is that the header row and the delimiter row must contain the same number of cells; if they do not, the block is not a table at all and you get pipes on the page (checked on github.github.com/gfm, 8 September 2026). Leading and trailing pipes are optional. Body rows with too few cells are padded with empty ones and rows with too many are truncated. Cells carry inline content only — no lists, no fenced blocks, no second paragraph inside a cell — and a literal pipe must be written `\|`, including inside a code span. The table ends at the first blank line or the start of another block. Most of what goes wrong with tables in conversion comes from those last three rules, and [tables deserve their own read](/blog/markdown-tables-that-survive-conversion).

**Task list items.** `[ ]`, `[x]` or `[X]` as the first thing in the first paragraph of a list item, followed by a space. It has to be a list item: the same brackets on a line of their own are literal brackets. The output is a checkbox `<input>` marked `disabled`, which is why a converted checklist looks greyed out in the browser — that is the specified rendering, not a bug in the converter. GitHub's issue and pull request views make them clickable through their own application, which is not part of the syntax.

**Strikethrough.** `~~text~~`. A paragraph break ends the span, the same way it ends emphasis. GitHub also renders a single tilde, and not every GFM implementation follows it there, so write two if the file is going anywhere else.

**Autolinks.** A bare `http://`, `https://` or `www.` URL, and a bare email address, become links with no angle brackets. The rules are narrower than they look. The URL must start at the beginning of a line or follow a space or one of `*`, `_`, `~` and `(`. Trailing punctuation is trimmed off the end of the link rather than included. A closing parenthesis is included only if the parentheses balance, which is why a Wikipedia URL ending in `(disambiguation)` usually survives and a URL inside a parenthetical usually loses its last character. An underscore anywhere in the last two segments of the domain cancels the autolink entirely. Angle-bracket autolinks, `<https://example.com>`, are core CommonMark and always work — the extension only covers the bare form.

**Disallowed raw HTML.** The subtraction. GFM escapes the opening `<` of nine tag names so they reach the page as visible text rather than as markup: `title`, `textarea`, `style`, `xmp`, `iframe`, `noembed`, `noframes`, `script` and `plaintext` (checked on github.com/github/cmark-gfm, 8 September 2026). This is a rendering-safety rule that belongs to GFM rather than to Markdown, and it is worth being precise about what it is not. It is not a sanitiser. It filters nine tag names by list; it does nothing about `onerror=` on an `<img>`, nothing about `javascript:` in an `<a href>`, and nothing about an `<svg>` with a handler on it. If you are converting a file somebody else wrote, [you still need a real allow-list sanitiser](/blog/sanitising-markdown-safely) after the parser.

Two things are commonly believed to be in GFM and are not. Footnotes are not in the specification, though GitHub's site renders them. Neither are the `> [!NOTE]` alerts. Both are behaviours of one renderer, added after the spec was written, and a parser that claims GFM compliance is not wrong to ignore them.

## What is in neither specification

Past those five extensions the ground stops being shared. Everything below is common, useful, and unportable — each one exists in several syntaxes, or in one tool only.

- **Footnotes** — `[^1]` in the text, `[^1]:` at the bottom. GitHub renders them, Pandoc renders them, remark-gfm renders them, and a plain CommonMark parser prints the brackets exactly as typed.
- **Definition lists** — a term, then lines beginning with `:`. Inherited from PHP Markdown Extra. Pandoc, Python-Markdown, Goldmark and kramdown have it; the JavaScript world mostly does not.
- **Attribute lists** — `{#my-id .warning}` after a heading or a span, to set an id, a class or an arbitrary attribute. Built into Pandoc and kramdown, an official extension in Python-Markdown, a plugin in markdown-it, and absent from marked.
- **Maths** — `$...$` inline and `$$...$$` display, handed to KaTeX or MathJax on the page. Every implementation spells this differently, and several need a passthrough option so the parser leaves the TeX alone rather than eating the underscores as emphasis.
- **Admonitions** — `> [!NOTE]` on GitHub, `:::note` in Docusaurus and several other frameworks, `!!! note` in MkDocs, a `{: .note}` attribute list in Jekyll. Four syntaxes for one idea, and no specification for any of them.
- **Front matter** — a YAML block fenced by `---` at the very top of the file. Site generators strip it and read it as metadata. A converter that has never heard of it renders it as content, and the result is a horizontal rule followed by your metadata as a heading, because `---` under a line of text is setext heading syntax.
- **Heading anchors** — the `#section-title` ids that make a table of contents work. Generated at render time by GitHub, by every generator, and by a plugin or option in most libraries. Not syntax at all, and the slug algorithm differs between tools, so a hand-written cross-link can break when the renderer changes.
- **The smaller ones** — abbreviations, superscript and subscript, emoji shortcodes like `:tada:`, wiki links `[[Page]]`, mermaid handled as a diagram rather than a code block, and smart punctuation that turns your quotes into curly ones whether you wanted that or not.

## Quick comparison: the flavours and the engines that speak them

| Name | Best for | Key capability | Price |
| --- | --- | --- | --- |
| Original Markdown 1.0.1 | Historical reference | The 2004 syntax page plus `Markdown.pl` | Free, BSD-style licence |
| CommonMark | Settling an argument about parsing | A specification with a runnable test suite | Free, open specification |
| GitHub Flavored Markdown | The default target for anything shared | CommonMark plus five named extensions | Free, open specification |
| markdown-it (JS) | Correctness with room to extend | CommonMark-compliant, escapes raw HTML by default | Free, MIT |
| marked (JS) | GFM with no configuration | GFM on by default, one function call | Free, MIT |
| remark / unified (JS) | Rewriting the document, not just rendering it | An AST plus remark-gfm and a large plugin set | Free, MIT |
| Pandoc's Markdown | Documents that need footnotes and maths | Named extensions you switch on individually | Free, GPL |
| Python-Markdown | Python builds and MkDocs sites | Official extension API: tables, footnotes, attr_list | Free, BSD |
| Goldmark (Go) | Go programmes and Hugo sites | CommonMark plus a bundled GFM extension set | Free, MIT |
| kramdown (Ruby) | Jekyll and GitHub Pages | A Markdown superset with inline attribute lists | Free, MIT |
| MDX | Documentation sites with components | JSX inside Markdown, compiled rather than rendered | Free, MIT |

## The flavours and implementations, one at a time

What follows is about flavour only — which constructs each one recognises and how you change that. Which of them to pick as a converter is [a different comparison](/blog/best-markdown-to-html-converters), on different criteria.

### Original Markdown 1.0.1 — the ancestor, not a target

Gruber's syntax page and Perl script. It is still the reason a `.md` file allows raw HTML at all, and still the source of behaviours that survive in tools written long after it.

| Pros | Cons |
| --- | --- |
| The shortest description of the syntax ever written | Ambiguous in exactly the places implementations disagree |
| Explains why raw HTML passes through by default | No tables, no fenced code blocks, no test suite |
| Still the baseline for `markdown_strict` in Pandoc | Unmaintained since 1.0.1 |

**Price:** free, BSD-style licence.

**Technical details and features**

- Indented code blocks only — fenced code arrived with later flavours
- Raw HTML block-level tags pass through untouched, and Markdown inside them is not parsed
- Emphasis, links, images, block quotes, ATX and setext headings, lists, horizontal rules
- No specification of nested list indentation, which is the ambiguity everything downstream inherited

**Who should use it?** Nobody, as a target. Read it to understand why a construct behaves the way it does, and select `markdown_strict` in Pandoc if you specifically need to know how a file would have rendered in 2004.

### CommonMark — the core everything else is measured against

CommonMark is the specification plus `cmark`, its reference implementation in C. Its purpose is conformance, not features, and its restraint is the feature.

| Pros | Cons |
| --- | --- |
| Every awkward case has a numbered example and an expected output | No tables, task lists, strikethrough or bare autolinks |
| Hundreds of test cases, so compliance is a fact rather than a claim | A table renders as a paragraph of pipes, silently |
| Implementations exist for most languages and aim at the same suite | Deliberately no extension mechanism in the spec itself |
| The safest floor to write against | Most real documents need at least one extension |

**Price:** free, open specification; `cmark` is free under a BSD-2-Clause licence.

**Technical details and features**

- Defines list indentation relative to the parent's content column, ending the spaces argument
- Left-flanking and right-flanking delimiter runs define emphasis precisely
- Seven kinds of HTML block, each with explicit start and end conditions
- Hard breaks are two trailing spaces or a trailing backslash; a lone newline is a space
- Raw HTML passes through by default, which is a spec decision and not a safety one
- Companion implementations include comrak in Rust, and markdown-it and Goldmark aim at the same suite

**Who should use it?** Anyone who needs to know what the syntax means rather than what a tool does. When two renderers disagree, the specification's examples decide which one has the bug — and reaching for it is more often the right move than people expect.

### GitHub Flavored Markdown — the practical default

GFM is CommonMark plus tables, task lists, strikethrough, autolinks and the raw HTML filter. It is what a README renders as, and what most issue trackers and chat tools copied.

| Pros | Cons |
| --- | --- |
| A written specification, not just a renderer's behaviour | Still no footnotes, definition lists, maths or attributes |
| Covers the constructs most documents actually use | The tag filter is often mistaken for a sanitiser |
| Widely implemented, so a GFM file usually travels | GitHub's site renders things the spec does not define |
| A strict superset of CommonMark, so nothing core changes | Bare autolink rules are fussier than they appear |

**Price:** free, open specification.

**Technical details and features**

- Tables with per-column alignment, inline content only, and a matching delimiter row required
- Task list items rendered as `disabled` checkbox inputs
- Strikethrough with `~~`; GitHub also accepts a single tilde
- Bare URL and email autolinks, with trailing-punctuation and balanced-parenthesis rules
- Nine raw HTML tag names escaped rather than passed through
- Footnotes and `> [!NOTE]` alerts work on GitHub and are not in the specification

**Who should use it?** Almost everybody, for almost every shared file. If a document has to render on GitHub, in a docs site and as converted HTML, GFM is the intersection that all three understand.

### markdown-it — CommonMark first, extensions on request

A JavaScript parser that follows the CommonMark specification and adds a small amount on top. Its own summary is that it "adds syntax extensions & sugar (URL autolinking, typographer)" (checked on github.com/markdown-it/markdown-it, 8 September 2026).

| Pros | Cons |
| --- | --- |
| Passes the CommonMark suite, and ships a strict `commonmark` preset | Task lists and footnotes need plugins |
| Escapes raw HTML by default, so the safe behaviour is the default | Plugin quality varies across the ecosystem |
| Rules can be added, replaced or reordered at block and inline level | Autolinking is off until you enable it |

**Price:** free, MIT licensed.

**Technical details and features**

- Three presets: `commonmark` for strict conformance, `default`, and `zero` for building up from nothing
- Tables and strikethrough are on in the default preset; `linkify` and `breaks` are off
- `html: false` by default — raw HTML in the source is escaped, not passed through
- Plugins cover footnotes, containers for admonitions, attributes, anchors, task lists and maths
- The plugin surface is documented, so an extension can be written rather than found

**Who should use it?** Teams who want the specification followed by default and each extension turned on deliberately. It is also the flavour a great deal of tooling inherits, VS Code's built-in Markdown preview among it.

### marked — GFM without a decision to make

A small JavaScript parser and compiler whose default flavour is already the one most people want.

| Pros | Cons |
| --- | --- |
| GFM is on by default: tables, strikethrough, task lists, autolinks | No plugin ecosystem to speak of; extensions are yours to write |
| One function, one options object | Raw HTML passes through, by design |
| Runs in the browser and in Node | Footnotes, definition lists and maths are not available |

**Price:** free, MIT licensed.

**Technical details and features**

- `gfm: true` by default; `breaks: false` by default, so a single newline is a space
- `breaks: true` reproduces GitHub's comment-box behaviour rather than its README behaviour
- A lexer you can call separately to inspect tokens instead of HTML
- Custom renderers override how any node type is emitted, which is how most extensions get done
- No sanitising: the documented answer is to pass the output through DOMPurify

**Who should use it?** Anyone whose target flavour is plain GFM and who does not need anything past it. It is the shortest path from a GFM file to GFM-shaped HTML, and the reason so much software behaves like GitHub with `breaks` set wrong.

### remark and unified — flavour as a list of plugins

remark parses Markdown into an abstract syntax tree. The flavour is not a setting; it is which extensions you added to the pipeline.

| Pros | Cons |
| --- | --- |
| remark-gfm covers all five GFM extensions, plus footnotes | The heaviest option here by a wide margin |
| Front matter, maths and directives each have a first-class plugin | The unified pipeline takes real learning |
| Raw HTML is dropped unless you explicitly allow it | Every extension is a dependency to keep current |

**Price:** free, MIT licensed.

**Technical details and features**

- mdast for Markdown, hast for HTML, with plugins to move between the two
- remark-gfm adds tables, task lists, strikethrough, autolinks and footnotes together
- remark-frontmatter parses the YAML header instead of rendering it as a heading
- remark-directive gives `:::note` containers, which is how most admonition syntaxes get implemented
- Passing raw HTML through requires `allowDangerousHtml`, so the unsafe choice is explicit

**Who should use it?** Teams who need a flavour nobody ships — GFM plus footnotes plus directives plus a house rule about link text — and who are willing to assemble it and own it.

### Pandoc's Markdown — a flavour with a switchboard

Pandoc reads several Markdown dialects and its own extended one, and every construct is a named extension you can turn on or off individually.

| Pros | Cons |
| --- | --- |
| Footnotes, definition lists, attributes and maths are built in | Its dialect is not what GitHub renders, which surprises people |
| Several table syntaxes, including grid tables with multi-line cells | The extension names are a vocabulary to learn |
| Reader and writer flavours are selected separately | Raw HTML passes through with no sanitising |
| `markdown_strict`, `commonmark`, `gfm` and `commonmark_x` all available | Requires an install and a terminal |

**Price:** free, GPL licensed.

**Technical details and features**

- Flavours selected by name: `markdown`, `markdown_strict`, `markdown_phpextra`, `markdown_mmd`, `commonmark`, `commonmark_x`, `gfm`
- Extensions toggled with `+name` and `-name` on the format, for example `gfm+footnotes`
- Attribute syntax `{#id .class key=value}` on headings, code blocks, links and images
- `tex_math_dollars` for maths, `fenced_divs` for admonition-style containers, `definition_lists`, `footnotes`
- Grid and multi-line tables carry block content inside cells, which pipe tables cannot

**Who should use it?** Anyone writing documents rather than pages: something with footnotes, citations, equations or an output format other than HTML. Reach for `gfm` explicitly when the file also has to render on GitHub, because Pandoc's own dialect will happily accept syntax GitHub cannot draw.

### Python-Markdown — extensions as an API

The long-standing Python implementation. Its base flavour is closer to original Markdown than to CommonMark, and its extension API is what a large amount of documentation tooling is built on.

| Pros | Cons |
| --- | --- |
| Official extensions for tables, footnotes, definition lists and attribute lists | Not CommonMark-compliant in every detail |
| `md_in_html` parses Markdown inside raw HTML blocks, which most parsers will not | Task lists and strikethrough need third-party extensions |
| The `admonition` extension is the reference implementation of `!!! note` | Differences from GFM show up in lists and emphasis edge cases |

**Price:** free, BSD licensed.

**Technical details and features**

- The `extra` bundle groups tables, footnotes, definition lists, abbreviations, attribute lists, fenced code and `md_in_html`
- `toc` generates heading ids and a table of contents; `smarty` does smart punctuation
- `nl2br` turns single newlines into `<br>`, the same switch other tools call `breaks`
- `meta` reads a metadata header, and MkDocs handles YAML front matter above it
- Strikethrough, task lists and `$...$` maths come from the third-party PyMdown Extensions

**Who should use it?** Python build scripts, and anybody extending MkDocs, where it is already the engine. Be deliberate about which extensions are enabled: the flavour is exactly the list in your configuration file, and a file written against a fuller list will lose things quietly.

### Goldmark — CommonMark with a GFM switch

A CommonMark-compliant parser in Go, and the engine inside Hugo. Its extensions are Go values you compose rather than strings you configure.

| Pros | Cons |
| --- | --- |
| CommonMark-compliant, with a single `extension.GFM` bundle for all four GFM additions | Go only |
| Definition lists, footnotes and typographer ship in the box | Fewer ready-made extensions than the JavaScript ecosystem |
| Attribute and passthrough behaviour is explicit rather than implied | Some flavour choices reach you through Hugo's configuration, not Goldmark's |

**Price:** free, MIT licensed.

**Technical details and features**

- `extension.GFM` bundles Table, Strikethrough, Linkify and TaskList (checked on github.com/yuin/goldmark, 8 September 2026)
- `extension.DefinitionList` and `extension.Footnote` implement the PHP Markdown Extra syntaxes
- `html.WithHardWraps()` renders a newline as `<br>`, the same option under a third name
- `html.WithUnsafe()` is required before raw HTML passes through, so escaping is the default
- Hugo layers render hooks and its own configuration on top, which is where most Hugo flavour questions actually live

**Who should use it?** Go programmes, and Hugo users working out why a construct renders on GitHub and not on their site. The answer is usually an extension that is available and not enabled.

### kramdown — a superset, not a flavour of CommonMark

A pure Ruby Markdown superset converter, and Jekyll's default engine. It has its own syntax for several things the other tools do differently, which is a real advantage inside Jekyll and a real problem outside it.

| Pros | Cons |
| --- | --- |
| Inline attribute lists — `{: .warning}` — on almost any block | Not CommonMark-compliant, and does not claim to be |
| Definition lists, footnotes, abbreviations and maths built in | No task lists or strikethrough in the core syntax |
| Tables support a header and a footer separator | Its own syntax does not survive being read by another tool |
| Already installed if you use Jekyll or GitHub Pages | Line-break handling is configurable and not CommonMark's default |

**Price:** free, MIT licensed (checked on github.com/gettalong/kramdown, 8 September 2026).

**Technical details and features**

- Written in Ruby, with no mandatory dependencies for the Markdown parser
- Inline attribute lists set ids, classes and arbitrary attributes without dropping to HTML
- `$$...$$` maths, footnotes and abbreviation definitions are core syntax rather than plugins
- A separate GFM parser is available and is what GitHub Pages uses, which is not the same as kramdown's own dialect
- Converts to HTML, LaTeX and back to kramdown

**Who should use it?** Jekyll sites, and only for content that stays in them. If a page written in kramdown has to be read anywhere else, its attribute lists become visible braces.

### MDX — a different language wearing a familiar surface

MDX puts JSX components inside Markdown. It is compiled to a component rather than rendered to HTML, and it is built on remark, so the Markdown half is remark's flavour.

| Pros | Cons |
| --- | --- |
| A React component in the middle of a document, with props | Not Markdown: no plain Markdown tool can read it |
| The Markdown half is CommonMark plus whatever remark plugins you add | Needs a build step and a JavaScript framework |
| Powers documentation sites where prose and interactive examples mix | A stray `<` or `{` in prose becomes a syntax error |

**Price:** free, MIT licensed.

**Technical details and features**

- Compiles to JavaScript, so the output is a component and not an HTML file
- Uses remark for Markdown and can take remark-gfm and the rest of the plugin set
- Curly braces are expressions, which means literal `{` in prose has to be escaped
- Front matter needs a plugin, as it does everywhere else

**Who should use it?** Documentation sites that need live examples inside prose, and nobody who needs the file to be portable. An MDX file is source code that resembles a document.

## Features against implementations

Read down the column for a tool, and across the row for a feature. "Plugin" means available and not built in; "extension" means shipped with the project but off until enabled; "option" means a boolean somewhere in the configuration.

| Feature | CommonMark | GFM | markdown-it | marked | remark | Pandoc | Python-Markdown | Goldmark | kramdown |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tables | No | Yes | Default on | Default on | remark-gfm | Built in, several syntaxes | `tables` extension | `extension.Table` | Built in |
| Task list items | No | Yes | Plugin | Default on | remark-gfm | `task_lists` extension | Third-party extension | `extension.TaskList` | No |
| Strikethrough | No | Yes | Default on | Default on | remark-gfm | `strikeout` extension | Third-party extension | `extension.Strikethrough` | No |
| Bare-URL autolinks | No | Yes | `linkify` option | Default on | remark-gfm | `autolink_bare_uris` | Third-party extension | `extension.Linkify` | No |
| Raw HTML default | Passed through | Nine tags escaped | Escaped | Passed through | Dropped unless allowed | Passed through | Passed through | Escaped unless unsafe | Passed through |
| Footnotes | No | Not in spec; GitHub renders them | Plugin | No | remark-gfm | `footnotes` extension | `footnotes` extension | `extension.Footnote` | Built in |
| Definition lists | No | No | Plugin | No | Plugin | `definition_lists` | `def_list` extension | `extension.DefinitionList` | Built in |
| Attribute lists | No | No | Plugin | No | Plugin | Built in | `attr_list` extension | Third-party | Built in |
| Maths | No | No | Plugin | No | remark-math | `tex_math_dollars` | Third-party extension | Passthrough or third-party | Built in |
| Admonition containers | No | No | Plugin | No | remark-directive | `fenced_divs` | `admonition` extension | Third-party | Attribute lists |
| Front matter | No | No | Plugin | No | remark-frontmatter | Built in for its own format | `meta` extension | Handled by Hugo | Handled by Jekyll |
| Heading ids | No | Added by GitHub at render time | Plugin | Extension | Plugin | Built in | `toc` extension | Third-party | Built in |
| Newline as `<br>` | No | No | `breaks` option | `breaks` option | remark-breaks | `hard_line_breaks` | `nl2br` extension | `WithHardWraps` | Option |

Two patterns in that table are worth more than the individual cells. The first is that the JavaScript tools disagree most about defaults, not capabilities: markdown-it and marked can both render a GFM file, but out of the box one escapes your raw HTML and the other does not. The second is that the tools with the richest syntax — Pandoc, Python-Markdown, kramdown — are the ones whose files travel worst, because the richness is all in extensions that nothing else implements.

## How to tell which flavour a tool speaks

Do not read the documentation. Keep a probe file, paste it in, and read what comes back.

```markdown
| Feature | Renders |
| --- | --- |
| tables | yes? |

- [x] a checkbox
- [ ] or literal brackets

~~Strikethrough~~ and a bare URL: https://example.com

Term
: A definition, or a paragraph starting with a colon.

A footnote reference.[^1]

Heading with an attribute
{: .probe}

Line one
line two

[^1]: Only some tools render this.
```

Nine answers from one paste, in the order that matters. A drawn table, checkboxes, struck-through text and a live link cover the four GFM syntax extensions — if all four appear, you have at least GFM. An indented definition means the tool goes past GFM into PHP Markdown Extra territory. A rendered footnote means the same. Visible `{: .probe}` braces mean no attribute lists, which is most tools. And if "line two" sits on its own line, `breaks` is switched on, which is worth knowing before you write ten pages against the wrong assumption.

Add a `$x^2$` and a `> [!NOTE]` line if you care about maths or admonitions. The point of the file is that it takes ten seconds and replaces an afternoon of guessing.

## Where GFM — the obvious choice — fails, and what it costs

GFM is the right default, and it is worth being honest about the four places it runs out.

**It has no footnotes, and neither do you.** GitHub renders footnotes, so people write them, and they are not in the specification. A GFM parser that ignores `[^1]` is compliant. If your document genuinely needs footnotes, you have left GFM whether you meant to or not, and the cost is that your file now depends on a specific tool's extension list rather than on a specification — [which tools render footnote syntax and which print the brackets](/blog/markdown-footnotes-support) is the list to check before you write a hundred notes.

**It has no attributes, so styling means raw HTML.** There is no way in GFM to put a class on a paragraph. You either drop to a `<div>` — which puts you at the mercy of whatever the renderer does with raw HTML, and of the tag filter if it is a GFM renderer — or you accept the default styling. Pandoc and kramdown solved this years ago, and their solutions do not travel.

**The tag filter is not safety.** Nine tag names escaped is a list, not a policy. Anybody converting third-party Markdown who thinks GFM compliance covers them is one `<img onerror=>` away from finding out otherwise. Sanitising happens after parsing, against an allow-list, and it is a separate job from choosing a flavour.

**The breaks question has no right answer.** GitHub's comment boxes turn a single newline into a `<br>`; the specification says a single newline is a space; README rendering follows the specification. So the same text can render two ways on the same website, and every tool downstream has to pick one. transformpipe converts with GFM on and `breaks` off, which matches the specification and README rendering rather than the comment box, because a document is closer to a README than to a comment. Whichever a tool picks, somebody's paragraphs come out wrong, and it is the single most reported flavour problem there is.

The cost of all four, taken together, is that "GFM" tells you what will render and not what will look right. It is a floor, not a finish.

## How to choose a flavour

1. **Write for the strictest reader in the chain.** If a file has to render on GitHub, in a docs site and as converted HTML, use only what all three support, because the weakest parser decides what the reader sees and it will not warn you.
2. **Pick the flavour before the tool, not after.** Deciding you need footnotes and maths tells you to install Pandoc; deciding you need a README to render tells you GFM is enough. Doing it the other way round means discovering the limit halfway through a document.
3. **Keep each extension near the tool that owns it.** Front matter belongs in a repository a generator reads, not in a file you hand to a converter that will render it as a heading. An attribute list belongs in the Jekyll site, not in the file you email.
4. **Treat defaults as part of the flavour.** Two libraries can both claim GFM and differ on raw HTML, autolinking and line breaks, which is three chances for a file to render differently with nobody having changed a word of it.
5. **Convert one representative file before you commit.** Not a hello-world file: the one with the table, the checklist, the long URL in parentheses and the footnote. Ten seconds of probing beats a rewrite, and it is the only way to see a silent failure while it is still cheap.

## Conclusion

CommonMark is the core, GFM is the core plus five named extensions, and everything else you have ever typed into a `.md` file is somebody's extension that stops at the edge of their tool. That is the whole map, and it is enough to predict almost every rendering difference you will meet. Write GFM by default, reach for Pandoc when the document needs footnotes or equations, keep front matter and attribute lists in the projects that understand them, and probe before you commit. If GFM is where you land, [converting it to HTML](/) in the browser will show you exactly what each construct became — the HTML source is right there next to the preview, so you can check the table rather than hope for it.

## FAQ

### What is the difference between CommonMark and GFM?

GFM is the CommonMark specification plus five named extensions: tables, task list items, strikethrough, bare-URL autolinks, and a filter that escapes nine raw HTML tag names. The core parsing rules are identical, because GFM is defined as a strict superset. Anything else that differs between two renderers is not a CommonMark-versus-GFM difference — it is an extension one of them has and the other does not.

### Is GFM a superset of CommonMark?

Yes, and the specification says so explicitly. Every valid CommonMark document is a valid GFM document that renders the same way, with the single exception of the nine filtered raw HTML tags, which GFM escapes and CommonMark passes through. That is why writing plain CommonMark is the safest way to make a file portable.

### Does CommonMark support tables?

No. Tables are not in the CommonMark specification, and a strictly compliant parser renders a pipe table as an ordinary paragraph containing pipe characters. The failure is silent, so if a table came out as text your parser is probably doing exactly what it was told to do. Tables arrive with GFM or with a tool-specific extension.

### Are footnotes part of GitHub Flavored Markdown?

Not in the specification, despite GitHub's own site rendering them. Footnotes are an extension that Pandoc, remark-gfm, Python-Markdown, Goldmark and kramdown all implement in compatible-looking ways, and that a plain GFM parser is entitled to ignore. If your document needs them, choose a tool by that requirement rather than by GFM compliance.

### Why does my Markdown render differently on GitHub and in my converter?

Three usual causes, in order of likelihood. The line-break setting: GitHub's comment boxes treat a single newline as a `<br>` and the specification does not. An extension: footnotes, front matter, alerts and maths all render on GitHub or in a generator and are in neither specification. Or a construct that is not quite valid — a table whose delimiter row has the wrong number of cells, for instance — which GitHub and your converter may recover from differently.

### Which Markdown flavour should I write in?

GFM, unless something forces you off it. It is specified, widely implemented, and covers tables, checklists and strikethrough, which is most of what a real document uses. Move to Pandoc's dialect when you need footnotes, definition lists or equations, and accept that the file is then tied to Pandoc.

### What does a Markdown converter do with YAML front matter?

It depends entirely on whether the tool has heard of it, because front matter is in neither specification. A generator strips it and reads it as metadata; a plain converter renders it as content, which produces a horizontal rule followed by your metadata as a setext heading. If you are handing files to a converter, either strip the header first or pick a tool with a front-matter option.
