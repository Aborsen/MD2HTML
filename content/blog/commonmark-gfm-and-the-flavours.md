---
title: Which Markdown are you writing?
description: Original Markdown, CommonMark and GitHub Flavored Markdown are three languages, not one - how to tell which your tool speaks, and what to do when two disagree
date: 2026-08-06
tag: Syntax
keywords: commonmark, commonmark vs markdown, github flavored markdown, gfm, gfm vs commonmark, markdown flavours, markdown spec, markdown extensions
---

Paste one file into three tools and you can get three documents. One shows a table, another shows a row of pipes. One turns a single newline into a line break, another folds the lines into a paragraph. Nothing is broken. The tools speak different dialects, and "Markdown" names the family rather than any one member. Knowing which dialect you are writing is most of the fix.

## Original Markdown, and what it left open

John Gruber published Markdown in 2004: a syntax description on a web page and a Perl script that turned it into HTML. The last release was 1.0.1. Page and script together were the definition, and where the prose was silent, whatever the script did became the answer.

That worked for one blog and hurt everyone writing a second implementation. The description never says how many spaces indent a nested list, or what happens when emphasis opens inside a word. Every implementer guessed differently, and within a few years there were dozens of libraries, all called Markdown, none agreeing on the awkward cases. So *commonmark vs markdown* compares a specification with a description plus a script.

## CommonMark: a spec with a test suite

CommonMark is the missing specification, written down. It defines the parsing rules in detail and ships hundreds of test cases, each a snippet of Markdown beside the exact HTML it must produce. No implementation gets to be CommonMark-ish: it passes the suite or it does not.

The reference implementation is `cmark`, a C library; other languages aim at the same suite — markdown-it in JavaScript, comrak in Rust, goldmark in Go.

CommonMark stops at a core on purpose: no tables, no footnotes, no strikethrough. Fenced code blocks are part of that core, but the word after the fence is only a label: [every converter turns it into a class name and stops there](/blog/code-blocks-in-markdown). It settles the arguments about the original syntax and leaves the rest to extensions, so almost every tool built on it adds some of its own.

## GitHub Flavored Markdown

GFM is the CommonMark spec plus a fixed list of extensions — four additions and one subtraction. That is the difference between GFM and CommonMark in full.

| Extension | What it adds |
| --- | --- |
| Tables | pipe-delimited rows, a `---` separator line, per-column alignment |
| Task lists | `- [ ]` and `- [x]` become checkboxes |
| Strikethrough | `~~text~~` |
| Autolinks | a bare URL or email address links itself, no angle brackets |

The subtraction: GFM escapes a short list of raw HTML tags rather than passing them through — `<script>`, `<iframe>` and `<style>` among them — so they reach the page as visible text. A rendering-safety rule rather than a syntax rule, and one that belongs to GFM, not to Markdown.

GFM is the dialect most people mean by Markdown. It is what a README renders as, what many issue trackers and chat tools copied, and what M2H converts: marked with GFM on and `breaks` off, so a single newline joins the paragraph instead of becoming a `<br>`. GitHub's comment boxes do the opposite, and that one setting is behind most reports of [line breaks going missing](/blog/markdown-line-breaks-and-lists).

## The extension zoo

Past GFM the ground stops being shared. These are common; none universal.

- **Footnotes** — `[^1]` in the text, `[^1]:` at the bottom. GitHub renders them; a plain CommonMark parser prints the brackets.
- **Definition lists** — a term, then lines starting with `:`. Pandoc and Python-Markdown, mostly.
- **Front matter** — a YAML block fenced by `---` at the top of the file. Site generators strip it and read it as metadata. A converter that has never heard of it renders it as content: a rule, then your metadata as a heading, because `---` under text is setext heading syntax.
- **Admonitions** — `> [!NOTE]` on GitHub, `:::note` in several documentation frameworks, `!!! note` in MkDocs. Three syntaxes for one idea.
- **Maths and diagrams** — `$...$` for TeX, a `mermaid` fenced block for a diagram. The viewer renders them or ignores them.

Then there is Pandoc's Markdown, a flavour of its own with extensions you switch on by name, and MDX, which puts JSX components inside Markdown — a different language wearing a familiar surface.

## How to tell which one a tool speaks

Keep a probe file, paste it in, and read what comes back.

```markdown
| Feature | Renders |
| --- | --- |
| tables | yes? |

- [x] a checkbox
- [ ] or literal brackets

~~Strikethrough~~ and a bare URL: https://example.com

A footnote reference.[^1]

Line one
line two

[^1]: Only some tools render this.
```

Six answers from one paste. A drawn table, checkboxes, struck-through text and a live link cover the four GFM extensions. A footnote at the bottom means the tool goes past GFM. If "line two" sits on its own line, `breaks` is switched on — worth recognising before you write ten pages on a wrong guess.

## When two tools disagree

Write for the strictest reader in the chain. If a file has to render on GitHub, in a docs site and as converted HTML, use only what all three support. GFM is a safe floor.

Keep each extension near the tool that owns it: front matter belongs in a repository a site generator reads, not in a file you hand to a converter that treats it as content. When a table comes out as pipes, suspect the separator line and the blank line above it — [tables have their own failure modes](/blog/markdown-tables-that-survive-conversion).

If you need footnotes, definition lists and output in several formats, a GFM converter is the wrong tool. That is [what Pandoc is for](/blog/pandoc-alternatives-for-markdown-to-html), and the better answer whenever typesetting matters.

Paste the probe file into whichever tool will render your document before you commit to a syntax it cannot draw. If GFM is where you land, drop the file into [M2H](https://md-2-html.vercel.app): it converts in the browser, and the "HTML source" tab shows what each construct became, so you can check rather than guess. [/docs](/docs) covers the rest.
