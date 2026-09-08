---
title: "Markdown Front Matter, and What Converters Do With It"
description: The block at the top of a Markdown file gets stripped, rendered, turned into a table or read as metadata, and which one happens is decided by the tool
date: 2026-08-18
tag: Syntax
keywords: markdown front matter, yaml front matter, front matter markdown converter, strip front matter, toml front matter, json front matter, hugo front matter, jekyll front matter, markdown metadata
---

A file arrives, you convert it, and the page opens with a horizontal line, then a bold heading reading `title: Q3 review date: 2026-08-04 draft: false`. Nothing is broken. The converter did exactly what the Markdown specification says to do with three dashes, a paragraph, and three more dashes. The block you meant as metadata is, to a parser that has never heard of front matter, just text.

### TL;DR

Front matter is a metadata block at the top of a `.md` file, and it is in no Markdown specification — not CommonMark, not GFM. Because of that, every tool decides for itself, and there are only four possible outcomes: the block is **stripped** and discarded, **rendered** as document content, **turned into a table**, or **read as metadata** and used. Static site generators read it; plain converters and libraries render it, which looks like a bug and is literalism; GitHub tabulates it. If the file is going somewhere that will render it, strip the block first or use a tool with a front matter option, and never write a bare `---` rule at the top of a document.

Front matter got into Markdown sideways. Jekyll wanted per-page variables, chose a YAML block fenced by `---`, and every generator since has copied the convention without anybody writing it into a specification. The result is a construct that a dozen widely used tools support, that no two of them support identically, and that a parser is entitled to ignore completely.

That is the friction. You cannot tell by looking at a file what will happen to its header, and you cannot tell by reading a converter's feature list either, because "supports Markdown" says nothing about a block that is not Markdown. The failure is quiet in both directions: a renderer prints your metadata into the document where readers see it, and a metadata reader silently deletes a `---` rule you meant as a visible divider.

This piece is about which tools do which, why the rendering behaviour is defensible rather than broken, what happens with TOML and JSON headers, and the one genuine trap — that `---` is simultaneously a front matter delimiter, a horizontal rule and a setext heading underline, and which of the three it becomes depends on where it lands.

## A block that no Markdown specification defines

Take the smallest possible example and run it through a parser with no front matter support. This is `marked`, the library behind a great many previews and converters:

```md
---
title: Notes
date: 2026-01-01
---

Body
```

The output is not what a generator would give you:

```html
<hr>
<h2>title: Notes
date: 2026-01-01</h2>
<p>Body</p>
```

Read it as a parser does and it is inevitable. The first `---` has nothing above it, so it is a thematic break — an `<hr>`. The two `key: value` lines are a paragraph. The closing `---` sits directly under a paragraph, and in Markdown a line of dashes under a paragraph is a setext heading underline, which turns the paragraph above it into an `<h2>`. Three dashes, one paragraph, three dashes: rule, heading. The converter is being faithful to the only specification that exists for the characters it was handed.

Put a blank line inside the block, which YAML permits and people do when a header grows, and the shape changes again:

```html
<hr>
<p>title: Notes</p>
<h2>date: 2026-01-01</h2>
```

Now the first key is a paragraph and only the last one becomes a heading, because a setext underline claims only the paragraph immediately above it. Same intent, two different documents, and neither is a bug. This is the same class of problem as [the differences between the Markdown flavours](/blog/commonmark-gfm-and-the-flavours), with one aggravation: flavours at least document what they add. Front matter is a convention rather than an extension, so there is nothing to check a tool against.

The four outcomes below are exhaustive. A tool can throw the block away, print it, format it, or use it. Everything you will meet in the wild is one of those four, and the only question worth asking about a converter is which one it picked.

## Quick comparison: what each tool does with the block

| Tool | What it does with front matter | Delimiters it recognises | What you end up with | Price |
| --- | --- | --- | --- | --- |
| Jekyll | Reads it as metadata; a page needs the block to be processed at all | `---` YAML | Page variables in templates, block gone from the output | Free, MIT |
| Hugo | Reads it as metadata | `---` YAML, `+++` TOML, `{` and `}` JSON | Page parameters, block gone from the output | Free, Apache 2.0 |
| Eleventy | Reads it as metadata through gray-matter | `---` YAML, plus a language suffix such as `---json` | Data cascade entries, block gone from the output | Free, MIT |
| MkDocs | Reads it as page metadata | `---` YAML | `page.meta` in templates, block gone from the output | Free, BSD |
| Docusaurus | Reads it as page metadata | `---` YAML | Sidebar position, slug and tags; block gone | Free, MIT |
| Pandoc | Reads it as metadata, with the extension enabled | `---` to open, `---` or `...` to close | Template variables, and a title block with `--standalone` | Free, GPL |
| marked | Renders it as content | None | An `<hr>` and an `<h2>` of your keys | Free, MIT |
| markdown-it | Renders it as content unless a plugin is added | None built in | An `<hr>` and an `<h2>` of your keys | Free, MIT |
| remark with remark-frontmatter | Recognises it, does not parse it, strips it from HTML | `---` YAML, `+++` TOML, custom fences | A `yaml` node in the tree and nothing in the HTML | Free, MIT |
| Python-Markdown with `meta` | Strips it and exposes it as strings | Optional `---` start, `---` or `...` end, or a blank line | `md.Meta` as lists of strings | Free, BSD |
| gray-matter | Splits it off and parses it for you | `---` by default, configurable, language suffixes | `data`, `content`, and `excerpt` on request | Free, MIT |
| GitHub | Turns it into a table | `---` YAML | A two-row table above your document | Free |
| GitLab | Shows it as-is in a box above the document | `---` YAML, `+++` TOML, `;;;` JSON | The raw block, visibly, at the top | Free |
| VS Code preview | Hides it | `---` YAML | Nothing; the preview starts at your first heading | Free |
| Obsidian | Reads it as properties and shows them in its own panel | `---` YAML | Typed fields, with `tags` and `aliases` reserved | Free |
| A regex in your own build | Strips it, usually correctly | Whatever the pattern says | A shorter string, and an edge case waiting | Free |

GitLab's delimiter list is the widest of any tool here: YAML with `---`, TOML with `+++`, JSON with `;;;`, and a language specifier appended to the delimiter, as in `---php` (checked on docs.gitlab.com, 8 September 2026).

## The four fates, one at a time

### Stripped: the block is removed and forgotten

The simplest behaviour, and the most common one inside a build. The tool matches the block, removes it from the text, and does nothing else with it. Python-Markdown's `meta` extension is explicit about the order — its documentation says all meta-data is stripped from the document before any further processing by Markdown — and `remark-frontmatter` ends in the same place for HTML output, because the node it adds to the tree has no HTML handler and so produces nothing.

| Pros | Cons |
| --- | --- |
| The output is the document, with no metadata leaking into it | The metadata is gone, so a title has to come from somewhere else |
| Nothing to configure once it is switched on | Silent: a `---` rule at the top of a body is stripped just as happily |
| Works for any keys, valid YAML or not, in the crude version | A regex version breaks on a line of dashes inside a quoted value |

**Who it is for.** Anybody converting files that came out of a generator and are going somewhere that does not need the metadata: a README turned into a page, a documentation folder rendered for review, a set of notes exported for a client. If you only need the prose, stripping is the right answer and the cheapest one to arrange.

The `remark-frontmatter` split is worth understanding if you use unified, because it is easy to expect too much of the plugin. It adds a node of type `yaml` — or `toml` — carrying the raw text as a string, and its readme is blunt that it does not parse the data inside them; that is a separate job for something like `vfile-matter`. So installing it buys you the strip, not the metadata. That is a sensible division of labour and a surprise to anyone who installed it hoping for `data.title`.

### Rendered: the converter is literal, not broken

Every general-purpose Markdown library with no front matter feature lands here, and so does every converter built on one whose author never made a decision about headers. You get the `<hr>` and the `<h2>`, and it looks like the tool ate your file.

| Pros | Cons |
| --- | --- |
| Faithful: nothing in the input is silently deleted | Your metadata appears in the document, where readers read it |
| Predictable once you know the rule | It looks like a defect, so people report it as one |
| No plugin, and no doubt about what was dropped | The exact shape depends on blank lines inside the block |

**Who it is for.** Nobody chooses this deliberately, and it is still the correct default for a library. A parser that guessed which paragraphs were metadata would be wrong somewhere, and the wrongness would be unrecoverable, because the text would be gone. Rendering keeps the information in the document and leaves the decision to the caller, which is where it belongs. `marked` has no front matter option, and the usual advice is to run `gray-matter` over the string first. `markdown-it` has no front matter rule either; plugins for it work by matching the block and rendering nothing, handing the raw text to a callback so you can do what you like with it.

The practical consequence is that "the converter mangled my header" and "the converter has no opinion about headers" are the same event. If you are choosing between tools, this is one of the things [a feature comparison will not tell you](/blog/best-markdown-to-html-converters), and it takes one file and ten seconds to find out.

### Turned into a table: rendered, but formatted

GitHub reads the block, recognises it, and renders it as a table above your document — keys along the header row, values in the single row beneath. It is a deliberate accommodation, and it makes sense for a code host: GitHub Pages runs on Jekyll, so front matter in a repository is usually real metadata rather than an accident, and showing it beats printing it as a heading.

| Pros | Cons |
| --- | --- |
| The block is recognisable as metadata, not mistaken for prose | A header with a dozen keys becomes a table a dozen columns wide |
| Nothing is hidden from somebody browsing the repository | Long values, lists and nested YAML read badly in a table cell |
| Consistent across every rendered `.md` file in a repository | You cannot turn it off for one file |

**Who it is for.** Readers, not builds. It is the right decision for a code host and irrelevant to a pipeline, and it is why a file can look tidy on GitHub and arrive as a rule and a heading in your own converter: two tools, two of the four fates, one unchanged file. GitLab makes a related choice and shows the block as-is in a box at the top of the document, which is the same instinct with less formatting.

### Read as metadata: the block does something

The fate the block was invented for. The tool parses the YAML, uses the keys, and removes them from the content.

Jekyll started it: a file that begins with the block gets processed, and a file that does not is copied through untouched, which is why an empty `---` block is a real thing people write on purpose. Hugo determines the format from the delimiters and turns the keys into page parameters, with `title`, `date`, `draft`, `weight`, `description`, `slug` and `layout` among the standard ones. MkDocs exposes the block as `page.meta`. Docusaurus uses `id`, `title`, `sidebar_position` and `slug`. Obsidian reads the block as typed properties and shows them in a panel rather than in the note body, reserving `tags`, `aliases` and `cssclasses` for its own behaviour.

Pandoc is the interesting one, because it is a converter rather than a generator and it still reads the block. The extension is called `yaml_metadata_block`, and it belongs to Pandoc's own Markdown dialect, so when the input format is `commonmark` or `gfm` you name it on the format rather than assuming it:

```bash
pandoc -f gfm+yaml_metadata_block -t html --standalone notes.md -o notes.html
```

Three details from the manual are worth carrying around. The opening delimiter is a line of three hyphens, and the closing one may be `---` or three dots. The block does not have to be at the top of the file — it may occur anywhere in the document, provided a blank line precedes it when it is not at the beginning. And `title`, `author`, `date` and `abstract` are used by the default templates, while any other key becomes a template variable set automatically from the metadata, which is how people get a version string into a footer without touching the document body (checked on pandoc.org, 8 September 2026).

| Pros | Cons |
| --- | --- |
| The metadata does what it was written to do | It only works when both sides agree on the key names |
| The document body stays clean | Invalid YAML becomes a build failure rather than an oddity |
| A title in the file means a title in the output | Keys are per-tool: `weight` means nothing to Jekyll |

**Who it is for.** Anybody whose Markdown lives in a repository and is built by something — a documentation site, a blog, a folder of runbooks. If the files are the source of truth, front matter is where the parts of a page that are not prose belong, and that is most of what makes [documentation that lives in the repo](/blog/documentation-that-lives-in-the-repo) work at all.

If you want the parsing without the generator, `gray-matter` is the library nearly everything in JavaScript uses for it. It returns `data` — the parsed block as an object — `content`, which is the input with the block removed, and `excerpt` when you ask for one. It handles YAML, JSON and JavaScript front matter out of the box; TOML and CoffeeScript are available by adding an engine. Delimiters are configurable through a `delimiters` option, and a language can be named on the opening delimiter as `---toml`. It is MIT licensed. In Python, `python-frontmatter` fills the same slot over PyYAML.

```js
import matter from "gray-matter";
import { marked } from "marked";

const { data, content } = matter(raw);
const html = marked.parse(content);

// data.title is now yours to put in the <title> element.
```

Two lines, and the block moves from the second fate to the fourth.

## TOML, JSON and the delimiters nobody agreed on

YAML with `---` is the default everywhere, but it is not the only convention, and the alternatives fail differently.

TOML front matter is fenced with `+++`, which Hugo has supported for as long as it has existed. Unlike `---`, `+++` means nothing at all in Markdown, so a plain converter produces neither a rule nor a heading. It produces a paragraph of literal text:

```html
<p>+++
title = &quot;Notes&quot;
+++</p>
```

That is arguably better, because it is obviously wrong and nobody mistakes it for a real heading, and arguably worse, because your metadata is now visible prose at the top of a page. Either way, a tool that recognises YAML front matter will not necessarily recognise TOML: `gray-matter` needs an engine added for it, `remark-frontmatter` has a TOML preset you must ask for, and Pandoc's `yaml_metadata_block` is, as the name says, YAML.

JSON front matter is stranger, because in Hugo there are no delimiters at all — the file starts with `{` and the object ends with `}`. Eleventy takes the other approach and lets you write `---json` on the opening delimiter, which is a gray-matter feature rather than an Eleventy one. To a Markdown parser, an undelimited JSON object at the top of a file is a paragraph of braces and quotes, entity-escaped and printed. GitLab recognises `;;;` for JSON, which is a fourth convention for the same idea.

| Format | Delimiters | Recognised by | What a plain parser makes of it |
| --- | --- | --- | --- |
| YAML | `---` to `---`, or `...` to close in Pandoc | Everything that supports front matter at all | An `<hr>` plus an `<h2>` of your keys |
| TOML | `+++` to `+++` | Hugo, GitLab, remark with the TOML preset | A visible paragraph of literal `+++` and keys |
| JSON | `{` to `}`, unfenced | Hugo | A visible paragraph of braces and quotes |
| JSON | `---json` to `---` | Eleventy, and gray-matter underneath it | A visible paragraph, or a heading if the fence is bare |
| JSON | `;;;` to `;;;` | GitLab | A visible paragraph of semicolons and keys |

The lesson is narrow and useful. YAML is the only format with anything approaching universal support, so unless a tool in your chain demands otherwise, write YAML. The exotic delimiters buy nothing except a smaller set of tools that will understand the file in two years.

## The trap: the delimiter is also a horizontal rule

Everything above is a matter of knowing which tool you are holding. This part is a real ambiguity in the syntax, and it cuts in both directions.

`---` on a line of its own has three meanings in Markdown, decided entirely by context. With text directly above it, it is a setext heading underline. With a blank line above it, it is a thematic break — an `<hr>`. And at the very start of a file, it is what every front matter parser is looking for. Nothing in the syntax distinguishes the third case from the second: position is the whole signal.

So consider a document that opens with a divider, which people write for aesthetic reasons more often than you would expect:

```md
---

Notes from the incident review, 4 August.

---

## Timeline
```

A front matter parser reads the first `---`, looks for the next one, finds it four lines down, and takes everything between as metadata. What happens next depends on the tool. A YAML parse of `Notes from the incident review, 4 August.` succeeds — YAML is happy to read a bare sentence as a string — so nothing throws; the parser simply gets a string where it expected an object. Some tools ignore that, some record it, and all of them return content with your opening line removed. The document you get back starts at `## Timeline`, and no error was raised anywhere.

Make that first line something YAML dislikes and you get the opposite failure: a build that stops with a parse error pointing at prose. Both outcomes come from the same cause, which is that the delimiter is not reserved for one job.

The other direction bites when files are combined. Concatenate several files that each begin with a header, and only the first block is in front matter position. The rest land mid-document, where three dashes mean rule and heading — which is why [merging many Markdown files](/blog/merging-many-markdown-files) needs the blocks removed as each file is read rather than cleaned up afterwards.

Inside the block, the same characters hold one more surprise. Python-Markdown's `meta` extension ends the metadata at the first blank line or the first closing delimiter, whichever comes first, so a blank line in the middle of a long header truncates it and the remaining keys become body text. Libraries that render the block split it at the blank line too, as shown earlier, just into a paragraph and a heading instead.

Three habits remove the whole class of problem:

- Write horizontal rules as `***` or `___`, never `---`. They produce an identical `<hr>` and they cannot be mistaken for a delimiter or a heading underline.
- Keep the opening `---` on the very first line of the file, with no blank line and no byte-order mark before it. Most parsers require the delimiter at the start of the string and quietly conclude there is no front matter otherwise.
- Do not leave blank lines inside the block. YAML allows them, several front matter readers do not, and the tools that render the block change shape because of them.

## Where stripping it and moving on fails, and what it costs

Stripping is the obvious answer for conversion, and it is usually right. Here is what it actually costs, because the cost is never on a tool's own page.

**The title goes with it.** The one piece of metadata every output format wants is the title, and stripping deletes it. An HTML file with no `<title>` shows the filename in the browser tab, which is what somebody sees in their tab bar and in their bookmarks. A document called `final-v3.html` sitting in a tab is a small indignity that a two-line change avoids: parse the block, keep `title`, put it in the head. The same goes for the description, which is what a chat client reads when it builds a link preview.

**Dates stop being dates.** A YAML date is not a string in most parsers. A timestamp is a resolved YAML type rather than text, so given `date: 2026-08-18`, js-yaml hands back a JavaScript `Date` and PyYAML hands back a `datetime.date` (checked on yaml.org, 8 September 2026). That is convenient until a timezone is involved and a document dated the 18th renders as the 17th somewhere west of you. Quote the value when you want the characters you typed.

**YAML types are a hazard in themselves.** The classic case is the Norway problem. PyYAML is a complete YAML 1.1 parser, and YAML 1.1 defined `y`, `yes`, `n`, `no`, `on` and `off` as booleans, so `country: NO` comes back as `False` (PyYAML 6.0.3, checked on pypi.org, 8 September 2026). js-yaml stopped converting those words to booleans and reads numbers by YAML 1.2 rules, so the same words come back as strings (js-yaml 5.4.1, checked on github.com/nodeca/js-yaml, 8 September 2026). The same header therefore means different things in a Python build and a Node build, which is a genuinely nasty bug when a documentation site is built by one and checked by the other. And `version: 1.10` is the number 1.1 in both, because it is a float — quote version numbers or lose the trailing zero.

**A colon in a title is a parse error.** This is the most common front matter defect there is. `title: Release 2.1: what changed` is not valid YAML: the second colon starts a new mapping, and the parser reports bad indentation on a line that looks perfectly fine to a person. The fix is quotes, and the reason to know it in advance is that the error message never mentions the colon.

**Tabs are illegal.** YAML forbids tabs in indentation, so an editor configured to insert them breaks a nested list in a header with an error about tab characters, and nothing about the file looks wrong on screen.

**A regex is not a parser.** A hand-rolled strip — match from the first `---` to the next `---` and drop it — is three lines and works on almost every file. It fails on a value containing a line of three dashes, on a file whose first line is a rule, and on a header closed with `...`. Almost every file is fine; the exception costs you a document with its first paragraph missing and no error to explain where it went.

**And sometimes the metadata was the point.** Files exported from note-taking and knowledge tools carry properties in the header — status, owner, review date, tags — and those are frequently the part somebody wanted preserved. Stripping the block throws away the structured half of the export and keeps only the prose, which is a real loss when the structure was the reason for the migration. That is worth checking before a bulk move out of [Notion, Obsidian or Confluence](/blog/markdown-from-notion-obsidian-and-confluence), because those tools disagree about whether properties come out as front matter, as plain `key: value` lines with no delimiters at all, or not at all.

## What to check before you hand the file over

1. **Convert one real file and look at the top of the output.** Ten seconds of looking tells you which of the four fates you are dealing with, and no feature list will: a rule and a heading means the tool renders, a clean first heading means it strips or reads, a table means GitHub.
2. **Decide whether you need the metadata before you choose the tool.** If a title, date or description has to reach the output, you need a tool in the fourth category or a parse step of your own, and putting `gray-matter` in front of a renderer is two lines — cheap to add, expensive to discover you forgot after the pages are published.
3. **Validate the YAML on its own, once.** Run the block through a YAML parser separately and you catch the unquoted colon, the tab, the boolean that used to be a country code and the version number that lost its zero. Skip it and each of those arrives later as a build failure or, worse, as a wrong value that nobody checks.
4. **Search the document for `---` before you convert or concatenate.** Every match is a rule, a heading underline or a delimiter, and which one it is depends entirely on the line above. Replacing the intentional rules with `***` removes the ambiguity permanently, and it is a find-and-replace rather than a project.
5. **Agree the key names with whatever reads them.** `weight` means nothing to Jekyll, `layout` means nothing to Docusaurus, `draft` means nothing to a plain converter, and an unrecognised key is not an error — it is silence. A key nothing reads is a comment with extra steps, and a misspelled key that something does read is a page that publishes when you meant it not to.

## Conclusion

Front matter is a convention that outgrew its origin without ever becoming part of the language, so the block at the top of your file has no defined meaning and four possible fates. Generators read it, Pandoc reads it when asked, libraries render it because rendering is the honest default for text a parser does not recognise, and GitHub tabulates it for readers. Knowing which one applies is the difference between a page that starts with your first heading and a page that starts with a horizontal line and a heading full of colons. To find out what a specific file becomes, [convert it and look at the top](/) — the answer takes less time to get than to argue about. When the metadata matters, split it off with a parser before the renderer sees it, and write your rules as `***` from now on.

## FAQ

### What is front matter in a Markdown file?

It is a block of metadata at the top of the file, conventionally YAML fenced by lines of three dashes, holding things like the title, date, tags and layout. It was popularised by Jekyll and copied by nearly every static site generator since. It is not part of the Markdown syntax, which is the reason tools disagree about it.

### Is front matter part of CommonMark or GitHub Flavored Markdown?

No. Neither specification mentions it, and neither reserves the `---` delimiter for it. Support is a per-tool extension or convention, so a strictly compliant parser is correct to render the block as a thematic break followed by a setext heading.

### Why does my converted HTML start with a line and a heading full of colons?

Because the converter has no front matter support and parsed the block literally. The opening `---` became an `<hr>`, your `key: value` lines became a paragraph, and the closing `---` underlined that paragraph into an `<h2>`. Strip the block before converting, or use a tool that recognises it.

### How do I remove front matter before converting a file?

In JavaScript, pass the text through `gray-matter` and give its `content` to your renderer. In Python, use `python-frontmatter`, or Python-Markdown's `meta` extension, which strips the block before any other processing. With Pandoc, enable `yaml_metadata_block` so the block is treated as metadata rather than as content.

### Does GitHub display YAML front matter?

Yes, as a table above the document, with the keys as the header row and the values in the row beneath. It is a deliberate choice rather than a rendering accident, and it means a file can look correct on GitHub and come out as a rule and a heading in a converter with no front matter support.

### Can I use TOML or JSON front matter instead of YAML?

You can, and you narrow the set of tools that will understand the file. TOML is fenced with `+++`, and JSON is either unfenced braces or a `---json` opening delimiter depending on the tool; support for both is far patchier than for YAML. A plain Markdown parser renders either one as a visible paragraph rather than as a rule and a heading.

### Will a horizontal rule at the top of my document be mistaken for front matter?

It can be. A parser looking for front matter takes the first `---` as an opening delimiter and everything up to the next `---` as metadata, so a document that opens with a rule can lose its first paragraph with no error raised anywhere. Write rules as `***` and keep the ambiguity out of your files.
