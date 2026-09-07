---
title: Markdown tables that survive conversion
description: Pipe syntax, the separator row, alignment colons, blank lines and line breaks — why a Markdown table breaks on the way to HTML, and how to fix each case
date: 2026-08-29
tag: Syntax
keywords: markdown table, markdown table syntax, markdown table to html, markdown table alignment, markdown table not rendering, markdown table line break, wide markdown table
---

A Markdown table is a few pipe characters and a row of dashes. It looks simple enough that people stop checking it, which is why it so often arrives in HTML as a paragraph full of vertical bars. Almost every failure has one of a handful of causes, each easy to recognise.

## The pipe syntax, and the row that does the work

A table is three parts: a header row, a separator row, and any number of body rows.

```markdown
| Flag | Long form | Takes a value |
| --- | --- | --- |
| `-o` | `--output` | yes |
```

The separator row is what makes this a table rather than prose: remove it and the parser sees a paragraph of pipes, which is exactly what comes out the other end. One dash per column is enough; three is a convention, not a rule.

Leading and trailing pipes are optional, and the columns need not line up: ragged source gives the same HTML as a tidy grid. Tidy it anyway, for whoever edits the file next.

Cell counts matter. If the header row and the separator row disagree about how many cells they hold, GFM does not recognise a table at all. Once they agree, that number is fixed: a shorter body row is padded with empty cells, a longer one has the extras thrown away, without a warning. If a column has vanished from your output, count the dashes.

Tables are in neither original Markdown nor plain CommonMark. Several extensions add them, and the GitHub Flavored Markdown version is the one most tools follow — which is why a converter set to strict CommonMark renders your table as text. [The flavours article](/blog/commonmark-gfm-and-the-flavours) covers which parser does what.

## Why a Markdown table is not rendering

The usual culprit is a missing blank line. Written directly beneath a line of prose, the header row can be absorbed into that paragraph, and parsers disagree about whether a table may interrupt a paragraph at all — so a file that renders on your machine may not render in the next tool. Leave a blank line before the table and one after, and the disagreement stops mattering.

The second culprit is a stray pipe. An unescaped `|` ends the cell wherever it appears, including inside a code span. Write `` `a | b` `` in a cell and the parser splits the row on that bar before it looks at the backticks: a broken code span, plus a phantom cell that is dropped. Escape it as `\|`, which works inside backticks too.

The third is indentation: inside a list item, the whole table has to sit at the item's content column.

## Alignment with colons

Colons in the separator row set the alignment of the whole column, header included:

```markdown
| Left | Centred | Right |
| :--- | :-----: | ----: |
```

Colons on both sides centre the column, a colon on one side aligns to that side, and no colon leaves the renderer's default. There is no per-cell alignment in Markdown. Right-align columns of numbers so the digits line up; leave text alone.

What this becomes in HTML depends on the renderer: some emit an `align` attribute on each cell, some a `text-align` style. Both look the same in a browser. The difference only bites if you style the output yourself, or pass it through a sanitiser whose allow-list drops one of the two.

Here is the whole thing working together, escaped pipe and all:

| Separator cell | Alignment | Watch out for |
| :--- | :--- | ---: |
| `:---` | left | a literal pipe, written `\|` |
| `:---:` | centre | a line break, written `<br>` |
| `---:` | right | anything block-level |

## Line breaks and what a cell cannot hold

A cell holds inline content: text, emphasis, code spans, links, images. It cannot hold a paragraph, a list, a fenced code block, a blockquote or another table. The row also ends where the line ends, so there is no Markdown syntax for a newline inside a cell — two trailing spaces do nothing here, whatever they do [elsewhere](/blog/markdown-line-breaks-and-lists).

For a break inside a cell, use `<br>` directly in the Markdown:

```markdown
| Step | Notes |
| --- | --- |
| Publish | Creates the token.<br>Sending the link is your job. |
```

GFM allows inline HTML, so this survives the parser. Whether it survives the next step depends on your converter's sanitiser: one that strips unknown tags drops the break and runs the two sentences together. M2H sanitises the preview and the downloaded file against one shared allow-list — DOMPurify in the browser, a parser-based sanitiser on the server — so the two agree. [Sanitising Markdown safely](/blog/sanitising-markdown-safely) explains why one list rather than two.

If a cell genuinely needs a list or a code block, the table is the wrong shape. Keep it as the summary and put the detail in short sections underneath.

## A wide Markdown table

Two problems hide behind this. One is the source file, where a nine-column table is miserable to edit. The other is the page: an HTML table takes the width its content demands, so it squeezes the columns into ribbons or drags the page sideways.

Fixes, roughly in the order you should like them:

- Cut a column. Wide tables usually hold one with the same value in every row, or two that could be one.
- Shorten the headers. A header that cannot wrap sets the column's minimum width.
- Transpose it. Four columns and three rows often read better the other way round.
- Split it into two tables sharing a key column.
- Let it scroll, by wrapping it in a container your stylesheet gives `overflow-x: auto`. Leave blank lines inside the wrapper, or the table is not parsed as Markdown at all:

```markdown
<div class="table-scroll">

| Column | Column |
| --- | --- |
| … | … |

</div>
```

That last one only helps where you control the CSS. In a standalone file, whether a wide table scrolls or overflows is decided by the stylesheet your converter ships.

Take the widest table you have, drop the file into [M2H](https://md-2-html.vercel.app), and read the HTML source tab beside the preview. A missing column means the dashes are miscounted; a cell split in two means an unescaped pipe. The [documentation](/docs) covers the rest.
