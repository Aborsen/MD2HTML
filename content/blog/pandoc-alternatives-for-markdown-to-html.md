---
title: When you need Pandoc, and when you do not
description: Pandoc is the right answer for DOCX, EPUB, citations and typeset PDF, but if all you want is an HTML page, here is what each route costs to set up
date: 2026-06-27
tag: Converting
keywords: pandoc markdown to html, pandoc standalone html, pandoc alternative, pandoc without installing, convert markdown without pandoc, markdown to docx, markdown to pdf
---

Pandoc converts between document formats. That is the whole pitch, and it is a good one: Markdown in, and DOCX, EPUB, LaTeX, reStructuredText, MediaWiki or a PDF out, with the same command shape every time. Nothing smaller covers that range. So the question is never whether pandoc is good. It is whether the job in front of you is a format-matrix job or a one-page job, because those two cost very different amounts to set up.

## What pandoc is actually for

Pandoc reads a document into an internal representation, then writes that back out in another format. The indirection is why it can go from Markdown to DOCX without anyone having written a Markdown-to-DOCX converter: every reader can feed every writer.

Four jobs where nothing else comes close.

**A format matrix.** One source, several outputs, kept in step. HTML for the site, DOCX for the reviewer who redlines in Word, EPUB for the reader.

**Academic writing.** Maths, cross-references, numbered figures, and `--citeproc` with a BibTeX file and a CSL style, so the bibliography formats itself.

**Word output in a house style.** `--reference-doc` takes fonts, headings and spacing from an existing .docx and applies them to yours.

**Filters.** A Lua or JSON filter rewrites the document while it is still a tree — renumber every table, strip a section, rewrite every internal link — which beats a regular expression over the output.

```bash
pandoc -f gfm -t docx notes.md -o notes.docx
pandoc -f gfm -t epub book.md -o book.epub
pandoc -f gfm --citeproc --bibliography=refs.bib paper.md -o paper.pdf
```

The third line carries a caveat. *Markdown to pdf* is not one of pandoc's writers. Pandoc makes a PDF by handing the document to a separate engine, and the default is a TeX engine, so that pipeline usually means installing a TeX distribution as well — a much larger install than pandoc itself. `--pdf-engine` points it at another engine, HTML- or Typst-based, which is a far smaller install and handles maths and page layout differently.

## Pandoc standalone HTML, and what it costs

Converting Markdown to HTML with pandoc is one line, and a standalone document is one flag more:

```bash
pandoc -f gfm -t html -s README.md -o README.html
```

`-s` turns a bare fragment into a whole document — doctype, charset, title, pandoc's default template around your content. Without it you get the body fragment on its own: no doctype, no `<head>`, nothing to open in a browser and call a page.

That template is deliberately plain. Changing it means `--css` for a stylesheet, `-V` to set template variables, or `--template` with a file of your own, written in pandoc's template language — `$body$`, `$for(author)$`, `$if(toc)$`. No other tool reads that file, and it is now part of your build.

There is a second snag. `--css` leaves a document that needs a stylesheet beside it, which is the opposite of what you want if the plan was to email the page to someone. Pandoc can embed resources instead, but the flag for it has been renamed across major releases, so check `pandoc --help` rather than an old forum answer.

None of this is hard. It is a real amount of setup for a page.

## A rule for deciding

Ask one question: does anything other than HTML come out of this pipeline, now or in the next few months?

| What you need | Route | What you set up |
| --- | --- | --- |
| DOCX, EPUB, LaTeX or RTF from one source | pandoc | The binary, plus the flags for each writer |
| A PDF with maths or citations | pandoc and a TeX engine | The binary, plus a TeX distribution |
| HTML with your own layout, built in a repo | markdown-it or marked in a script | One dependency, and HTML you wrote |
| One HTML file to send to a person | A browser converter | Nothing |
| HTML published on every merge | An API or an Action in CI | A key in your repository secrets |

A yes to the first two rows ends the argument. Install pandoc. Below them, an alternative is smaller, not braver.

## Converting Markdown without pandoc

Three shapes, in order of how much they ask of you.

`cmark-gfm` is a C implementation of the GitHub Flavored Markdown spec: small, quick, and it hands you a fragment with no styling and no wrapper. Good inside a build that supplies its own layout.

A script suits a project that already has Node or Python. marked and markdown-it in JavaScript, Python-Markdown and markdown-it-py in Python, are each one dependency, and the HTML around the output is HTML you wrote rather than a template language you inherited. [Converting Markdown from a terminal](/blog/markdown-to-html-from-the-command-line) has the script in full.

A browser converter suits a document that is not part of a build at all. [M2H](https://transformpipe.com) is free and converts in the browser — signed out, the file never leaves the machine — and the download is one self-contained .html with inline styles, no scripts and no network requests. It reads GFM, so tables, task lists and fenced code survive, and the HTML is sanitised against one shared allow-list in the browser and on the server. [Sanitising Markdown safely](/blog/sanitising-markdown-safely) explains why the two have to agree.

## Pandoc without installing it

*Pandoc without installing* usually means one of two things. The first is a web front end that runs pandoc on somebody's server — fine for a public README, wrong for a draft contract, because the file goes to a machine you do not own. The second is a container, which keeps the machine clean and keeps the full format matrix:

```bash
docker run --rm -v "$PWD:/data" pandoc/core -f gfm -t html -s README.md -o README.html
```

That is the honest middle: you skip the install without handing your document to a stranger, and the trade is Docker and a mounted volume for a job a local binary would do in a second.

## What to do next

Write down every output format this document has to produce over its life. If DOCX, EPUB, LaTeX or a typeset PDF is on that list, install pandoc — the template language is a fair price for what it does. If HTML is the only entry, convert the file you already have and read the source before it goes anywhere: M2H does that in a browser tab, and the API, CLI and GitHub Action at [/docs](/docs) do it from a script when the page has to be rebuilt on every commit. If the small options still look interchangeable, [choosing a Markdown to HTML converter](/blog/choosing-a-markdown-to-html-converter) lists what to check.
