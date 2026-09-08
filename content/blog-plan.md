# The blog, planned: 51 articles at depth

A ledger, not a wish list. Every row is either an article that exists and needs deepening, or one
that does not exist yet and has a search intent nobody else here is answering. The point of writing
it down is that fifty articles without a map become one article rewritten fifty times, which is the
usual way a programme like this fails.

## The shape, measured from the reference pieces

The examples in `~/Downloads/generated_articles` average **4,115 words**. Ours averaged **1,095**
before this began. Matching them means every article carries:

| Part | What it is |
| --- | --- |
| Frontmatter | Exactly `title`, `description`, `date`, `tag`, `keywords`, each a flat `key: value` line — the loader in `src/lib/blog.ts` is a hand-rolled parser, so arrays and nesting break it. Their `tags: [...]` becomes our comma-separated `keywords`; their `category` becomes our `tag` |
| H1 | The primary keyword, in a sentence a person would say |
| TL;DR | Three or four sentences that answer the question for somebody who reads nothing else |
| Intro | Two to four short paragraphs naming the friction, not the product |
| Cheat sheet | One wide table: every tool or option, best for, key capability, price |
| Per-option sections | H3 each, with a pros/cons table, a price line, a features list, and who it is for |
| The honest section | Where the obvious choice fails, and what it costs — the part a vendor's own page leaves out |
| How to choose | Numbered criteria, three to five, each a sentence with a consequence in it |
| Conclusion | One paragraph, linking the conversion the article is about |
| FAQ | Five to seven H3 questions, each answered in two or three sentences, carrying the long tail |

Minimum 4,000 words. Under 3,800 is a failure, not a short piece.

## The rule on facts

The reference pieces quote prices and feature claims for named competitors. Ours do not invent
either, for a plain reason: fifty articles of invented pricing is fifty wrong statements about
living companies, and it is the kind of mistake that outlives the traffic it earns.

- A price appears only where it was checked against the vendor's own page, with the date — Typora
  is $14.99, a one-time purchase, up to three devices, 15-day trial (checked on typora.io,
  8 September 2026).
- Everything else says "free, open source" with the licence, which is verifiable and stable.
- Feature claims stay structural: the language a tool is written in, CLI or GUI, whether it needs
  an install, whether it handles tables, what licence it carries.
- No benchmarks we have not run. No user counts. No version numbers we have not looked up.

## Tags in use

`Converting`, `Syntax`, `Publishing`, `Automation`, `Safety`, `Workflow`, `Code`. A new tag means a
new chip on the blog index, so it needs a reason.

## The 21 that exist and need depth

Slugs stay as they are — they are linked from other articles and indexed by now, and a slug change
is a redirect nobody will remember to write.

| Slug | Primary keyword | Note |
| --- | --- | --- |
| best-markdown-to-html-converters | best markdown to html converter | **Done** — the reference piece, 4,262 words |
| markdown-to-html-converter | markdown to html | The four stages. Deepen; do not turn it into a tool comparison |
| choosing-a-markdown-to-html-converter | how to choose a markdown converter | Overlaps the reference piece. Repoint at criteria and requirements rather than tools, or fold into it |
| pandoc-alternatives-for-markdown-to-html | pandoc alternative | Highest-intent piece here |
| markdown-to-html-from-the-command-line | markdown cli converter | Terminal, CI, and what Pandoc costs per run |
| markdown-to-html-in-javascript | markdown to html javascript | Becomes the marked / markdown-it / remark comparison |
| markdown-to-html-in-python | markdown to html python | Python-Markdown, markdown2, mistune, and MkDocs' engine |
| how-to-open-md-file | how to open md file | Per platform, including phones |
| markdown-tables-that-survive-conversion | markdown table not rendering | The definitive tables piece |
| commonmark-gfm-and-the-flavours | commonmark vs gfm | The flavour reference, with a feature-by-implementation table |
| markdown-line-breaks-and-lists | markdown line break | Two spaces, backslash, nested lists, loose and tight |
| code-blocks-in-markdown | markdown syntax highlighting html | Fences, info strings, and what highlighting needs on the page |
| images-and-links-that-still-work | markdown image not showing | Relative paths, and what breaks when the file moves |
| sanitising-markdown-safely | markdown xss | Vectors, allow-lists, where sanitising must happen |
| share-a-markdown-document-as-a-link | share markdown file | Four ways, and what a link must not ask of the reader |
| publish-markdown-from-github-actions | markdown github action | Publishing from a pull request |
| documentation-that-lives-in-the-repo | docs in the repository | Docs-as-code without a generator |
| merging-many-markdown-files | combine markdown files | Merge order, headings, and one document out of many |
| release-notes-from-markdown | release notes markdown | A changelog that becomes a page |
| markdown-from-notion-obsidian-and-confluence | notion export markdown | Three exports and what each mangles |
| ai-output-to-a-shareable-page | share chatgpt output | Model output to a document somebody can read |

## The 30 that do not exist yet

### Head terms, one per conversion

The pages that carry the volume. Comparison-shaped, because that is what "best … converter" wants.

| Slug | Primary keyword |
| --- | --- |
| best-html-to-markdown-converters | best html to markdown converter |
| best-word-to-markdown-converters | convert word to markdown |
| best-csv-to-markdown-converters | csv to markdown table converter |
| best-json-to-markdown-converters | json to markdown converter |
| best-online-document-converters | online document converter |
| best-markdown-editors | best markdown editor |

### How to, per conversion and per place the reader is standing

| Slug | Primary keyword |
| --- | --- |
| convert-markdown-to-html-online | how to convert markdown to html |
| markdown-to-html-in-vs-code | markdown to html vs code |
| convert-html-to-markdown | how to convert html to markdown |
| save-a-web-page-as-markdown | web page to markdown |
| convert-docx-to-markdown | docx to markdown |
| convert-google-docs-to-markdown | google docs to markdown |
| convert-csv-to-markdown-table | csv to markdown table |
| convert-excel-to-markdown-table | excel to markdown table |
| convert-json-to-markdown-table | json to markdown table |
| markdown-to-pdf | markdown to pdf |
| markdown-to-plain-text | markdown to text |
| markdown-to-word | markdown to word |
| batch-convert-markdown-files | convert multiple markdown files |

### Alternatives to the named tools

The highest-intent traffic there is: somebody already using a thing, looking for another.

| Slug | Primary keyword |
| --- | --- |
| dillinger-alternatives | dillinger alternative |
| stackedit-alternatives | stackedit alternative |
| typora-alternatives | typora alternative |
| turndown-and-html-to-markdown-libraries | html to markdown library |
| mammoth-js-and-docx-parsers | docx to html javascript |

### Syntax and safety gaps

| Slug | Primary keyword |
| --- | --- |
| markdown-footnotes-support | markdown footnotes |
| markdown-escaping | markdown escape characters |
| front-matter-and-what-converters-do-with-it | markdown front matter |
| what-not-to-keep-from-a-docx | docx to markdown formatting lost |
| is-an-online-converter-safe | is markdown converter safe |

### Decision pieces

Lower volume, higher intent, and the ones that link to everything else.

| Slug | Primary keyword |
| --- | --- |
| markdown-vs-html | markdown vs html |
| markdown-vs-docx-for-documentation | markdown vs word documentation |
| self-contained-html-explained | single file html |
| static-site-generator-or-converter | do i need a static site generator |
| converting-documents-with-an-api | document conversion api |

## Internal linking

Every article links to the conversion page it is about — `/`, `/html-to-markdown`,
`/word-to-markdown`, `/csv-to-markdown`, `/json-to-markdown` — and to three to five siblings: a
how-to links to its comparison, a comparison links to its how-tos, a syntax piece links to the
conversion that breaks on it. No article is an orphan, and none links to more than five, which is
where a page starts reading as a link farm. A link to a slug that does not exist is a defect, not a
placeholder.
