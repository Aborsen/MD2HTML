---
title: "Markdown to PDF: Every Route and What Each One Costs"
description: Every route from Markdown to PDF compared - printing from the browser, Pandoc with LaTeX, wkhtmltopdf, WeasyPrint, headless Chrome - and the parts that break
date: 2026-09-01
tag: Publishing
keywords: markdown to pdf, convert md to pdf, markdown to pdf converter, pandoc markdown to pdf, markdown to pdf command line, print markdown to pdf, md to pdf without install
---

### TL;DR

There is no direct Markdown to PDF conversion; every tool goes through an intermediate format, and the one it picks decides what your PDF looks like. For a single document you need now, convert to a complete HTML file and print it from the browser: that is the best typography available for free, and the print dialogue is where you set paper size and margins. For a long document with numbered sections, running headers and a table of contents with page numbers, install Pandoc and a LaTeX engine and accept the size of the install. For a build that runs without a person in it, use headless Chrome or WeasyPrint, and set the page rules in CSS rather than in a dialogue nobody will be there to click.

Markdown has no pages. It has headings, paragraphs, lists and code, and it says nothing about where one sheet of paper ends and the next begins. PDF is the opposite: a fixed page size, a fixed margin, a break between page four and page five, and every font it uses carried inside the file. Converting between the two is not a translation, it is an invention. Something has to decide the paper size, the margins, where the table splits and which font gets embedded, and if you do not decide, the tool decides for you.

That is why the same `.md` file produces four different PDFs from four different tools, and why the differences are not cosmetic. One puts your code blocks on a grey background, another prints them on white with the long lines cut off at the margin. One numbers the pages, another prints the file's URL and yesterday's date across the top. One embeds the font you chose, another substitutes a fallback and does not tell you.

There are four routes, and only four. Convert to HTML and print it from a browser. Convert to LaTeX and typeset it. Convert to HTML and hand it to a dedicated HTML-to-PDF engine. Or open the file in an editor that has an export menu. Everything else is one of those four with a different wrapper around it, including every online converter that promises a PDF in one click.

## Quick comparison: the cheat sheet

| Route | Best for | What it needs | Control over the page | Licence and price |
| --- | --- | --- | --- | --- |
| HTML, then print from the browser | One document, right now | A browser you already have | Paper, margins, scale, backgrounds - from a dialogue | Free |
| Pandoc + pdflatex | Plain prose, no unusual glyphs | Pandoc plus a TeX installation | Total, through template variables | Free, GPL; TeX Live free |
| Pandoc + xelatex or lualatex | System fonts, non-Latin scripts, maths | The same, plus the fonts | Total | Free, GPL |
| Pandoc + Typst | A LaTeX-quality page without a TeX install | Pandoc plus the Typst binary | Total, through Typst's own syntax | Free; Typst is Apache 2.0 |
| Pandoc + WeasyPrint | CSS you already know, with real page rules | Python plus WeasyPrint | Total, through CSS paged media | Free, BSD |
| WeasyPrint on your own HTML | Running headers, page counters, PDF bookmarks | Python plus WeasyPrint | Total, through CSS | Free, BSD |
| wkhtmltopdf | A script that already calls it | A single binary | Good, through command-line flags | Free, LGPLv3; repository archived |
| Headless Chrome | A build step, or many files at once | Chrome or Chromium installed | Through print CSS in the document | Free |
| Puppeteer | The same, scripted, with margins in code | Node plus a Chromium download | Total, through the API | Free, Apache 2.0 |
| Typora | Writing and exporting in one application | A desktop install, paid | The theme's, plus a page setup | $14.99 one-time, up to 3 devices |
| Obsidian | A vault you already write in | A desktop install | The theme's | Free; optional commercial licence |
| VS Code extension | The file is already open in your editor | An extension, often a Chromium | Whatever the extension exposes | Free, extension-dependent |
| Markdown to `.docx`, then Word or LibreOffice | Somebody has to edit it after you | Pandoc plus an office suite | The office suite's page setup | Free with LibreOffice |

Prices checked on typora.io and obsidian.md, 8 September 2026. The wkhtmltopdf repository notice was checked on github.com, 8 September 2026.

## Convert to HTML, then print from the browser

This is the route most people should take for a single document, and the one they distrust because it feels too simple. Convert the Markdown to a complete HTML file - not a fragment, a document with a doctype, a head and its styles inline - open it, and press the print shortcut. Choose "Save as PDF" as the destination.

The typography is the reason to do it this way. A browser's print output comes from the same layout engine that renders every page you look at: real kerning, ligatures, proper line breaking, vector text at any zoom, and font subsets embedded in the resulting PDF. Nothing free does better, and several things that cost money do worse. If the document sets `lang` on the root element and `hyphens: auto` in its stylesheet, you get hyphenation as well, which is the difference between a justified paragraph that reads well and one full of rivers.

The trade is that all your control lives in a dialogue box, and the dialogue box is worth understanding, because four of its controls silently change your document.

| Control | What it actually does | Why it matters |
| --- | --- | --- |
| Destination | Chooses a physical printer or "Save as PDF" | Only "Save as PDF" produces a file; a printer driver's PDF may rasterise the text |
| Paper size | A4, Letter, Legal and the rest | A4 is 210 by 297mm, Letter is 8.5 by 11in; a layout tuned for one reflows on the other |
| Margins | Default, None, Minimum, Custom | "None" runs content to the paper edge, which most physical printers cannot reproduce |
| Scale | "Fit to printable area", or a percentage | Fitting shrinks everything, so one over-wide table makes the body text smaller than you set |
| Background graphics | Off by default | This is the control that removes your code block shading and table striping |
| Headers and footers | Off or on | On prints the page title, the file's location, the date and a page number, in the browser's own type |

Two of those defaults cause most of the complaints about browser-printed PDFs. Background graphics is off because printer ink is expensive, and the effect on a technical document is that every shaded code block, every coloured callout and every striped table comes out flat white. Turn it on. Headers and footers is a convenience for printing a web page and a defect for anything you send to somebody else: it stamps a `file:///Users/you/Downloads/…` path across the top of the first page. Turn it off.

The document's own CSS can take some of this back. A stylesheet that declares `@page { size: A4; margin: 20mm; }` gives the dialogue a sensible starting point, and `@media print` rules let you drop navigation, expand collapsed sections and force colours that survive a monochrome printer. That is also where you put `break-inside: avoid` so a table or a figure stops splitting across a page boundary.

| Pros | Cons |
| --- | --- |
| The best typography available at no cost | A person has to click through a dialogue, so it is not a build step |
| No install, and no upload if the conversion runs in the browser | No running headers or footers of your own design |
| The PDF is produced from a file you can keep and re-print | No table of contents with page numbers, and no cross-references |
| Two controls away from correct once you know which two | One document at a time |

**Who should use it?** Anybody with one document and a recipient. A converter that hands you self-contained HTML with its styles inline makes this a two-step job, and [what happens to your file on the way through](/blog/markdown-to-html-converter) is worth reading before you trust the output of any of them. TransformPipe does the conversion in your browser and prints through the same dialogue, which is why it is on this list rather than in it: the PDF is the browser's work, not the converter's.

## Pandoc with a LaTeX engine

`pandoc report.md -o report.pdf` is the command everybody quotes, and it is misleading in a specific way: Pandoc does not make PDFs. It converts your Markdown to LaTeX and then runs an external typesetting engine, which is the thing that actually produces the file. If that engine is not installed, the command fails, and the error names a binary you have never heard of.

That indirection is also the source of the quality. TeX has been typesetting mathematics and long-form prose since the 1980s, and its line-breaking algorithm optimises whole paragraphs rather than one line at a time. For a thesis, a manual, a contract or anything with numbered sections and equations, it remains the best output on this page.

### Which engine, and what it costs to install

| Engine | Selected with | Use it when | Cost |
| --- | --- | --- | --- |
| pdflatex | The default | Plain English prose, no unusual glyphs | A TeX installation |
| xelatex | `--pdf-engine=xelatex` | You want system fonts, or non-Latin scripts | The same, plus the fonts |
| lualatex | `--pdf-engine=lualatex` | The same, with Lua scripting in the template | The same |
| Typst | `--pdf-engine=typst` in recent Pandoc | You want a fast, small install instead of TeX | One binary, Apache 2.0 |
| WeasyPrint | `--pdf-engine=weasyprint` | You would rather write CSS than LaTeX | Python and a pip install |
| wkhtmltopdf | `--pdf-engine=wkhtmltopdf` | A legacy pipeline expects it | One binary, unmaintained |

The install is the real cost, and it is worth being blunt about it. A full TeX distribution is by far the largest dependency in any document toolchain most people assemble; it is measured in gigabytes and it takes a while. The small distributions - BasicTeX, TinyTeX - install in a fraction of the space and then fail the first time your document needs a package they left out. The failure is at least legible: LaTeX stops and names the missing `.sty` file, and `tlmgr install <package>` fetches it. You will do that four or five times before a first document builds, and then never again on that machine.

### The flags that do the work

| Flag | Effect |
| --- | --- |
| `-V geometry:margin=25mm` | Sets the page margin through the geometry package |
| `-V mainfont="Source Serif 4"` | Chooses a system font; requires xelatex or lualatex |
| `-V fontsize=11pt` | Body size, which the default 10pt rarely suits |
| `-V documentclass=report` | Chapters and a title page instead of an article |
| `--toc` | A table of contents, with page numbers, generated from your headings |
| `--number-sections` | Numbers the headings to match |
| `-V colorlinks=true` | Coloured links instead of the default framed boxes |
| `--highlight-style=tango` | Chooses the code highlighting theme |
| `--include-in-header=head.tex` | Injects raw LaTeX, which is how you get real running headers |

`--toc` and `--number-sections` together are the honest reason to leave the browser behind. A table of contents that lists "Migration steps ... 14" cannot be produced by a browser at all, because a browser does not know what page anything lands on until it has already printed it.

### What breaks

Long code lines are the first thing to go. LaTeX does not wrap verbatim text, so a shell command wider than the text block runs off the right edge of the paper and is simply gone. The fix is a highlighting setup that breaks lines, or shorter lines in the source; either way you have to notice, because nothing warns you. [How code blocks travel between formats](/blog/code-blocks-in-markdown) covers the wider version of this problem.

Wide tables fail the same way and more visibly. Unicode is the second trap: pdflatex predates it, so a document with a curly quote from a word processor, a Greek letter, a Chinese name or an emoji stops with an error about an undefined character. Switching to xelatex fixes most of it; emoji still will not appear, because there is no monochrome outline for them in a normal text font.

| Pros | Cons |
| --- | --- |
| The best long-document output available free | The largest install of any route here |
| A table of contents with page numbers, and cross-references | LaTeX errors are famously hard to read |
| Repeatable: the same command gives the same file | Template customisation means learning LaTeX |
| One command converts to HTML, DOCX and EPUB too | Raw HTML in the Markdown is ignored, not rendered |

**Who should use it?** Anybody producing a document that will be read on paper, bound, or submitted somewhere with formatting rules. Also anybody building the same PDF every week, because the command is the specification and it does not drift.

## HTML-to-PDF engines: wkhtmltopdf, headless Chrome and WeasyPrint

These sit between the two routes above. You still convert to HTML, but a program prints it instead of a person, which means it can run in a build. They differ in which layout engine they use, and that single fact determines what your CSS is allowed to contain.

| Engine | Layout engine | Headers and footers | Modern CSS | Maintained |
| --- | --- | --- | --- | --- |
| wkhtmltopdf | Qt WebKit, an old fork | Yes, through flags, with page variables | Unreliable | Repository archived, January 2023 |
| Headless Chrome | Current Chromium | Only the browser's own band, or via Puppeteer templates | Everything a browser does | Yes |
| WeasyPrint | Its own, written in Python for pagination | Yes, through CSS margin boxes | Partial: flexbox and grid are limited | Yes |

### wkhtmltopdf

wkhtmltopdf is a command-line tool that renders HTML with the Qt WebKit rendering engine and is released under LGPLv3 (checked on wkhtmltopdf.org, 8 September 2026). Its GitHub repository carries the notice "This repository was archived by the owner on Jan 2, 2023. It is now read-only" (checked on github.com, 8 September 2026).

Its command-line surface is genuinely good, and better than a browser's for this job: `--margin-top` and its siblings set margins in real units, `--header-html` and `--footer-html` take HTML files, `--footer-center "[page]/[topage]"` gives you "3/12" at the bottom of every page, `--print-media-type` makes it honour your `@media print` rules, and `--enable-local-file-access` is required before it will read images and stylesheets from disk. If you have a script that already produces acceptable PDFs with those flags, there is no urgency to replace it.

The problem is the engine underneath. It is a fork of a WebKit that stopped moving years ago, so a stylesheet written this decade - custom properties, grid, modern flexbox behaviour - may render as something you did not design, with no error. Do not start new work here.

### Headless Chrome

`chrome --headless --print-to-pdf=out.pdf report.html` uses exactly the engine the print dialogue uses, so the output matches what you saw on screen. That is its whole argument, and it is a strong one.

The catch is that the dialogue's checkboxes are not on the command line. Chrome applies its own default margins, and whether it stamps the URL and page-number band depends on a flag whose name has changed between versions - run `chrome --help` on the version you have rather than copying a flag from a blog post. Everything else you want has to be in the document's own print CSS, which is the right place for it anyway.

Puppeteer removes the guesswork. Its `page.pdf()` call takes `format`, `margin`, `printBackground`, `displayHeaderFooter`, `headerTemplate` and `footerTemplate`, so paper size, margins and a running footer live in code next to everything else in your build. `printBackground: true` is the fix for the missing code-block shading that catches everybody the first time. Puppeteer is free and Apache 2.0 licensed; it downloads its own Chromium, which is a large one-time cost in a CI cache.

### WeasyPrint

WeasyPrint is a Python library and command-line tool, BSD licensed, and it is not a browser. Its documentation says it is "based on various libraries but not on a full rendering engine like WebKit or Gecko", with a CSS layout engine written in Python and designed for pagination (checked on doc.courtbouillon.org, 8 September 2026).

That design choice is the point. It supports the `@page` rule with the `:left`, `:right`, `:first` and `:blank` selectors, page margin boxes, page-based counters, and the `bookmark-level`, `bookmark-label` and `bookmark-state` properties that build the PDF's outline - headings become bookmarks by default. Internal anchors and external URLs both come out as clickable links (all checked on doc.courtbouillon.org, 8 September 2026). Browsers implement none of the margin-box machinery, so this is the only route on this page that gives you a proper running header in CSS rather than in LaTeX.

The cost is the other half of the same choice. Its own documentation describes flexbox as working "for simple use cases but not deeply tested" and grid as working "for simple cases, but has some limitations" (checked on doc.courtbouillon.org, 8 September 2026). Hand it a document, not an application layout, and it is excellent.

**Who should use these?** Anybody whose PDF has to be produced by a machine on a schedule: a nightly report, a generated invoice, a PDF attached to every release. Choose Chrome or Puppeteer if the document is already a web page you like; choose WeasyPrint if you need running headers, page counters and bookmarks and would rather write CSS than LaTeX.

## Editors that export a PDF directly

The shortest route of all, when the file is already open in front of you. Every one of these is one of the routes above with a menu item on top - most of them are a bundled browser engine - so the question is only whether the export is good enough and whether you can repeat it.

| Editor | How it exports | Price and licence |
| --- | --- | --- |
| Typora | "Export to PDF with bookmarks", plus docx, LaTeX, EPUB and others | $14.99 without tax, one licence covering up to 3 devices, 15-day free trial (checked on typora.io, 8 September 2026) |
| Obsidian | Built-in Export to PDF from the note | Free for every purpose including commercial use; a commercial licence is optional at $50 per user per year (checked on obsidian.md/pricing, 8 September 2026) |
| VS Code | An extension; most bundle or download a Chromium and print with it | Free, but the extension's quality is the extension's |
| Word or LibreOffice | Convert Markdown to `.docx` with Pandoc, then export from the suite | Free with LibreOffice |

Prices and terms checked on typora.io and obsidian.md, 8 September 2026.

| Pros | Cons |
| --- | --- |
| One menu item, no terminal, no dialogue archaeology | The styling is the editor's theme, not your document's |
| The theme is usually designed for reading, so the default looks fine | Not scriptable, so it cannot be part of a build |
| Bookmarks and a clickable outline in the better ones | Locked to that application, on that machine |
| The `.docx` detour leaves a file somebody can edit | Every hop through another format loses something |

The `.docx` detour deserves its own note, because it solves a problem no other route does. If the person receiving the document will want to change it, a PDF is a dead end and a Word file is not. `pandoc report.md -o report.docx --reference-doc=house-style.docx` applies your own styles, and LibreOffice will convert the result on a server with `soffice --headless --convert-to pdf report.docx`. Two conversions is one more than ideal, and it is the price of handing somebody something they can edit — and if the `.docx` is the deliverable rather than a waypoint, [getting Markdown into a Word file somebody can edit](/blog/markdown-to-word) is where the reference document, the styles Pandoc looks for and the cost of the trip back are worked through properly. [Which editors handle Markdown well](/blog/best-markdown-editors) is a longer conversation than the export menu.

**Who should use it?** Writers, for drafts and for anything where "looks reasonable" is the bar. Not builds, and not documents with a house style to honour.

## The parts people get wrong

Five things break in PDFs made from Markdown, and they break the same way regardless of which route you took.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Code blocks and tables lost their shading | "Background graphics" is off by default in the print dialogue | Turn it on, or pass `printBackground: true` in Puppeteer |
| A heading sits alone at the bottom of a page | Nothing told the engine to keep it with its text | `break-after: avoid` on headings, `break-inside: avoid` on tables and figures |
| Body text came out smaller than expected | "Fit to printable area" shrank the whole document to fit one wide element | Find the over-wide table or code line and fix it, then print at 100% |
| The first page has a file path across the top | "Headers and footers" is on | Turn it off, or use an engine where you control the footer |
| Long code lines are cut off at the margin | LaTeX does not wrap verbatim text | Break the lines in the source, or use a route with soft wrapping |
| Images are missing entirely | Relative paths that no longer resolve from where the HTML sits | Embed the images, or convert with the file in place |
| A character came out as a box, or not at all | The embedded font has no glyph for it | Change the font, or the engine, and stop using emoji in print |
| Every page is A4 on your machine and Letter on theirs | No page size in the document, so the engine used a locale default | Declare `@page { size: A4 }` or pass the size explicitly |

### Page breaks

Markdown has no page break. There is no syntax for it, no extension that adds one portably, and no amount of blank lines will do it. You force a break by putting raw HTML in the Markdown file:

```markdown
Text before the break.

<div style="break-after: page"></div>

Text on the next page.
```

`break-after: page` is the current CSS property; `page-break-after: always` is the older alias that older engines still want, and including both is harmless. Two things then go wrong. The first is that a converter that ignores raw HTML - Pandoc's LaTeX route among them - drops your `div` and the break with it; under LaTeX you want `\newpage` in a raw block instead. The second is that a converter that sanitises will strip the `style` attribute, because inline styles are exactly the sort of thing an allow-list removes, and your break disappears with no warning. [Why sanitising strips more than scripts](/blog/sanitising-markdown-safely) explains what usually survives and what does not.

### Margins

Three parties set your margins and only one of them wins: the print dialogue, the document's `@page` rule, and the physical printer's unprintable border. Decide which one is authoritative and leave the others alone. For a PDF that will be read on screen, put the margin in the CSS and set the dialogue to Default. For a PDF that will be printed on a specific device, leave at least 10mm and test on that device, because "Margins: None" produces a file whose edges a laser printer will clip.

### Headers and footers

This is the clearest dividing line between the routes. The browser gives you one band, with its content and its typeface chosen for you, on or off. Anything else - a document title on the left, a page number on the right, nothing at all on the first page - needs CSS margin boxes, which browsers do not implement, or LaTeX, which does it through a package. If your document must carry a running header, you have chosen WeasyPrint or LaTeX whether you wanted to or not.

### Links surviving

Clickable links in a PDF are annotations laid over the text, and whether they get written depends on the engine, so the only reliable check is to open the finished PDF and click one. Internal links - a table of contents to a heading - depend on the HTML having ids on the headings, which a converter may or may not generate. For a document that will be printed on paper, links are invisible, and one print rule fixes it:

```css
@media print {
  a[href^="http"]::after {
    content: " (" attr(href) ")";
  }
}
```

That prints the URL in brackets after the link text, which is ugly on screen and the only readable option on paper. Relative links and images have their own failure mode, since a PDF cannot resolve `../images/diagram.png` after the fact: [paths that keep working when the file moves](/blog/images-and-links-that-still-work) is the version of this problem you meet first.

### Fonts embedding

A PDF carries a subset of every font it actually uses, which is what makes it look the same everywhere - and it can only carry a font that was available when the file was made. Two failure modes follow. A document that requests a web font over the network, converted with the network unavailable, silently falls back to something else and embeds that instead; the PDF is not broken, it is just not your design. A document that names a font stack of system faces embeds whatever that particular machine had, so you and a colleague produce visually different PDFs from the same Markdown and the same command.

The fix is to be explicit. Name one font, ship it alongside the document or install it on the build machine, and let the stack fall back to a generic serif that will be substituted predictably. Check the result: any PDF reader will list the embedded fonts in its document properties, and a font listed as "Type 3" or as not embedded is a font your reader will not see.

## Where the browser route fails, and what it costs to leave it

Printing from the browser is the right default and it has a hard ceiling. It is worth naming the ceiling precisely, because most people do not need to go past it and the ones who do should know what they are buying.

| What you cannot do in a browser | Why | What it costs to fix |
| --- | --- | --- |
| A running header or footer of your own design | Browsers do not implement CSS margin boxes | WeasyPrint, or LaTeX through Pandoc |
| A table of contents with page numbers | The page a heading lands on is not known until layout is done | Pandoc's `--toc`, or an engine with page counters |
| A cross-reference like "see page 14" | The same reason | LaTeX, or WeasyPrint's counters |
| Produce the file unattended | A dialogue needs a person | Headless Chrome, Puppeteer, or WeasyPrint |
| One PDF from twelve chapter files | The browser prints one document | Merge the Markdown first, or merge the PDFs after |
| Guarantee no widowed heading anywhere | Break control across engines is approximate | Manual breaks, and a reader who checks |

Each fix has a price, and the prices are not equivalent. LaTeX buys you the best page on this list for the cost of the biggest install and a template language to learn; the template is a one-off, but it is a real one-off and somebody has to own it. WeasyPrint buys you page rules in CSS for the cost of a Python dependency and a layout engine that is not a browser, so a stylesheet built around grid will need rewriting. Headless Chrome buys you repeatability for the cost of a browser in your build image, which is not small and needs updating for the same security reasons your laptop's does. wkhtmltopdf buys you convenient flags and hands you an archived dependency, which is a debt with a due date.

The multi-file case is the one people hit soonest and least expect. A twelve-chapter manual is twelve `.md` files, and a PDF is one document, so something has to join them - in the right order, with the heading levels shifted so chapter two's `#` does not compete with the document title. [Turning many Markdown files into one document](/blog/merging-many-markdown-files) is a separate job from converting it, and doing it in the wrong order is how a table of contents ends up with three "Introduction" entries.

## How to choose

1. **Start from who produces the file.** If a person makes the PDF when it is needed, print from the browser and stop reading; if a machine makes it on a schedule, you need headless Chrome, Puppeteer or WeasyPrint, because a dialogue box cannot be automated.
2. **Ask whether the document needs page furniture.** Running headers, numbered chapters and a table of contents with page numbers rule out the browser entirely, and that single requirement is what justifies installing LaTeX or WeasyPrint.
3. **Count the glyphs before you count the features.** A document with Chinese, Greek, Cyrillic or mathematical notation will fail under pdflatex and work under xelatex, and finding that out at the first build is cheaper than finding it out at the deadline.
4. **Match the engine to the CSS you have already written.** If your stylesheet uses grid, only a browser engine will lay it out correctly; if it is a document stylesheet with `@page` rules, WeasyPrint will do more with it than a browser can.
5. **Decide whether anybody has to edit it afterwards.** A PDF is final, and if the answer is yes you want `.docx` in the middle of the pipeline, which changes the tool and the effort.
6. **Print one real page and look at it.** Not the preview - the finished PDF, opened in a different reader, with the fonts panel checked and one link clicked. That single test catches missing backgrounds, substituted fonts, dead links and clipped code lines at once, and it takes two minutes.

## Conclusion

PDF from Markdown is always a two-step job, and the honest question is which intermediate format you want to argue with. For one document with a recipient, convert the Markdown to a complete, self-contained HTML file and print it from your browser with backgrounds on and headers off - which is what [TransformPipe's Markdown to HTML conversion](/) is for, free, in the browser, with nothing uploaded when you are signed out. For a long document with page furniture, install Pandoc and xelatex, write the template once and never think about it again. For a PDF that has to appear without anybody present, put the page rules in CSS and let headless Chrome or WeasyPrint do the printing. All three are free; the difference is entirely in what you are willing to install and maintain.

## FAQ

### How do I convert Markdown to PDF without installing anything?

Convert the Markdown to a complete HTML file in a browser-based converter, open the file, and print it to PDF with your browser's own print dialogue. No package manager, no terminal, and with a converter that works client-side the document is never uploaded. Remember to switch background graphics on and headers and footers off before you save.

### Why does my PDF lose the code block backgrounds?

Because "Background graphics" is off by default in the print dialogue, to save ink on physical printers. It also removes table striping and coloured callouts, so a technical document looks flat and washed out. Turn it on in the dialogue, or pass `printBackground: true` if you are printing through Puppeteer.

### How do I force a page break in Markdown?

There is no Markdown syntax for it. You insert raw HTML - `<div style="break-after: page"></div>` - and hope the converter passes it through, or you add `\newpage` in a raw LaTeX block if you are converting through Pandoc. Converters that sanitise will strip the inline style, so test the break rather than assuming it survived.

### Is Pandoc the best way to convert Markdown to PDF?

It produces the best long documents, and it is the heaviest option: `pandoc file.md -o file.pdf` needs a LaTeX engine installed, and a full TeX distribution is the largest dependency in most document toolchains. For a report with numbered sections and a table of contents it is worth every gigabyte. For a one-page memo it is more tool than the job needs.

### Do hyperlinks still work in a Markdown-generated PDF?

Usually, but it depends on the engine, so open the finished file and click one. Internal links to headings only work if the intermediate HTML gave those headings ids, which not every converter does. For a document that will be printed, add a print rule that appends the URL in brackets after each link, because a clickable link on paper is just underlined text.

### Why do the fonts look different in the PDF than on screen?

A PDF embeds only the fonts available at the moment it was made. If the document requested a font over the network and the network was not there, or named a system font your machine has and the build server does not, the engine substituted something and did not tell you. Check the embedded fonts in your PDF reader's document properties and name a font you actually ship.

### Can I generate a PDF from Markdown in a CI job?

Yes, and there are three sensible ways: Pandoc with a TeX image, headless Chrome or Puppeteer against your converted HTML, or WeasyPrint. Chrome gives output identical to a browser and needs a browser in the image; WeasyPrint is a small Python dependency and gives you real page rules in CSS. Whichever you pick, put the paper size and margins in the document rather than in flags, so the same file prints the same way by hand.
