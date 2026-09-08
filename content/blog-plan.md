# The blog, planned: 55 articles

What each piece is for, so fifty of them are fifty answers rather than one answer rewritten fifty
times. Every row has a search intent somebody actually types and a shape that answers it. The order
is priority: the first block earns the most traffic and is written first.

## The shape, from the reference pieces

The examples in `~/Downloads/generated_articles` average **4,115 words**. Ours currently average
**1,095**. Matching them means every article carries:

| Part | What it is |
| --- | --- |
| Frontmatter | `title`, `description`, `date`, `tag`, `keywords` — our loader reads flat `key: value`, so the examples' `tags: [...]` array becomes our comma-separated `keywords` and their `category` becomes our `tag` |
| H1 | The primary keyword, in a sentence a person would say |
| TL;DR | Three or four sentences that answer the question for somebody who reads nothing else |
| Intro | Two to four short paragraphs naming the friction, not the product |
| Cheat sheet | One wide table: every tool or option, best for, key capability, price |
| Per-option sections | H3 each, with a pros/cons table, a price line, a features list, and who it is for |
| The honest section | Where the obvious choice fails, and what it costs — the part a vendor's own page leaves out |
| How to choose | Numbered criteria, three to five, each a sentence of consequence |
| Conclusion | One paragraph and one link to the conversion the article is about |
| FAQ | Five or six H3 questions, each answered in two or three sentences, carrying the long-tail keywords |

**The rule on facts.** The reference pieces quote prices and features for named competitors. Ours
will not invent either. A price appears only where it is checked against the vendor's own page on
the day of writing (Typora's $14.99 one-time, 15-day trial, three devices — checked 8 September
2026), and everything else says "free, open source" with the licence, which is verifiable and
stable. Feature claims stay structural: the language a library is written in, CLI or GUI, whether
it handles tables, whether it needs an install. No benchmarks we have not run.

## Block 1 — the head terms, one per conversion

The pages that carry the search volume. Comparison-shaped, because that is what somebody typing
"best … converter" is looking for.

| Slug | Primary keyword | Shape |
| --- | --- | --- |
| best-markdown-to-html-converters | best markdown to html converter | Comparison |
| best-html-to-markdown-converters | best html to markdown converter | Comparison |
| best-word-to-markdown-converters | convert word to markdown | Comparison |
| best-csv-to-markdown-converters | csv to markdown table converter | Comparison |
| best-json-to-markdown-converters | json to markdown converter | Comparison |
| best-online-document-converters | online document converter | Comparison |
| best-markdown-editors | best markdown editor | Comparison |

## Block 2 — how to, per conversion and per place people are standing

Distinct intent each: the person already knows what they want and is asking how.

| Slug | Primary keyword | Shape |
| --- | --- | --- |
| convert-markdown-to-html-online | how to convert markdown to html | How-to |
| markdown-to-html-in-vs-code | markdown to html vs code | How-to |
| markdown-to-html-with-pandoc | pandoc markdown to html | How-to + when not to |
| convert-html-to-markdown | how to convert html to markdown | How-to |
| save-a-web-page-as-markdown | web page to markdown | How-to |
| convert-docx-to-markdown | docx to markdown | How-to |
| convert-google-docs-to-markdown | google docs to markdown | How-to |
| convert-csv-to-markdown-table | csv to markdown table | How-to |
| convert-excel-to-markdown-table | excel to markdown table | How-to |
| convert-json-to-markdown-table | json to markdown table | How-to |
| markdown-to-pdf | markdown to pdf | How-to |
| markdown-to-plain-text | markdown to text | How-to |
| markdown-to-word | markdown to word | How-to |
| batch-convert-markdown-files | convert multiple markdown files | How-to |

## Block 3 — alternatives to the named tools

Highest-intent traffic there is: somebody already using a thing and looking for another.

| Slug | Primary keyword | Shape |
| --- | --- | --- |
| pandoc-alternatives | pandoc alternative | Alternatives |
| dillinger-alternatives | dillinger alternative | Alternatives |
| stackedit-alternatives | stackedit alternative | Alternatives |
| typora-alternatives | typora alternative | Alternatives |
| turndown-alternatives | html to markdown library | Library comparison |
| mammoth-js-and-docx-parsers | docx to html javascript | Library comparison |
| markdown-it-vs-marked-vs-remark | markdown parser javascript | Library comparison |
| notion-export-to-markdown | notion export markdown | How-to + limits |
| obsidian-export-to-html | obsidian to html | How-to + limits |
| confluence-to-markdown | confluence to markdown | How-to + limits |

## Block 4 — the syntax that breaks on the way across

Written already, or close to it. These are the long tail that converts best, because the reader has
a broken document in front of them.

| Slug | Primary keyword | Status |
| --- | --- | --- |
| markdown-tables-that-survive-conversion | markdown table not rendering | Written, to be expanded |
| commonmark-gfm-and-the-flavours | commonmark vs gfm | Written, to be expanded |
| markdown-line-breaks | markdown line break | New |
| markdown-images-that-do-not-load | markdown image not showing | New |
| markdown-code-blocks-and-highlighting | markdown syntax highlighting html | New |
| markdown-footnotes-support | markdown footnotes | New |
| markdown-link-reference-styles | markdown reference links | New |
| markdown-escaping | markdown escape characters | New |
| front-matter-and-what-converters-do-with-it | markdown front matter | New |
| nested-lists-that-break | markdown nested list not working | New |

## Block 5 — publishing and getting it to run without you

| Slug | Primary keyword | Status |
| --- | --- | --- |
| share-a-markdown-document-as-a-link | share markdown file | Written, to be expanded |
| publish-markdown-from-github-actions | markdown github action | Written, to be expanded |
| markdown-to-html-from-the-command-line | markdown cli converter | Written, to be expanded |
| markdown-to-html-in-ci | convert markdown in ci | New |
| self-contained-html-explained | single file html | New |
| markdown-to-email-html | markdown email html | New |
| static-site-generator-or-converter | do i need a static site generator | New |
| converting-documents-with-an-api | document conversion api | New |
| converting-documents-from-an-assistant | mcp document conversion | New |

## Block 6 — safety and what a converter must not keep

| Slug | Primary keyword | Status |
| --- | --- | --- |
| sanitising-markdown-safely | markdown xss | Written, to be expanded |
| markdown-allows-raw-html | markdown raw html | Written, to be expanded |
| what-not-to-keep-from-a-docx | docx to markdown formatting lost | New |
| is-an-online-converter-safe | is markdown converter safe | New |

## Block 7 — the decision pieces

Lower volume, higher intent, and the ones that link to everything else.

| Slug | Primary keyword | Status |
| --- | --- | --- |
| markdown-vs-html | markdown vs html | New |
| markdown-vs-docx-for-documentation | markdown vs word documentation | New |
| csv-vs-json-for-tables | csv or json | New |
| how-to-open-md-file | how to open md file | Written, to be expanded |
| what-is-a-markdown-file | what is a markdown file | New |

## Internal linking

Every article links to the conversion page it is about (`/`, `/html-to-markdown`,
`/word-to-markdown`, `/csv-to-markdown`, `/json-to-markdown`) and to two or three siblings — a
how-to links to its comparison, a comparison links to its how-tos, a syntax piece links to the
conversion that breaks on it. No article is an orphan and none links to more than five, which is
where a page starts reading as a link farm.
