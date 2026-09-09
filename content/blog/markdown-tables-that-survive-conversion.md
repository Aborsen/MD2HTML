---
title: "Markdown Tables That Survive Conversion: Every Way One Breaks"
description: Why a Markdown table is not rendering: the separator row, alignment colons, blank lines, escaped pipes and GFM against CommonMark, with a symptom table
date: 2026-08-29
tag: Syntax
keywords: markdown table, markdown table syntax, markdown table to html, markdown table alignment, markdown table not rendering, markdown table line break, wide markdown table
---

### TL;DR

A Markdown table is a header row, a separator row of dashes, and any number of body rows — and the separator row is the whole trick. Remove it, or let its cell count disagree with the header, and there is no table at all: you get a paragraph full of vertical bars, silently. Tables are also not part of CommonMark; they arrived with GitHub Flavored Markdown, so a strictly compliant parser is behaving correctly when it refuses yours. Leave a blank line above and below the block, escape any literal pipe as `\|`, and reach for `<br>` when a cell needs a second line, because a row ends where the line ends.

A table is the part of a document most likely to arrive broken. Headings are hard to get wrong. A bold word either has its asterisks or it does not. A table is a grid held together by punctuation, and one wrong character anywhere in the block does not produce a slightly wrong table — it produces no table, because the parser stops recognising the shape and treats the whole thing as prose.

That failure mode is what makes tables frustrating. There is no error, no warning, no half-rendered grid. You get five lines of text with pipe characters in them, sitting where your table used to be, and nothing in the output tells you which of the five lines was the problem. The file still looks fine in your editor, because your editor is showing you the source.

The good news is that the failures are finite. Almost every broken Markdown table has one of about ten causes, each with a recognisable symptom. This page goes through all of them: what the syntax is, what each part is actually for, what happens when it is wrong, and what the fix costs you. If you have a broken table in front of you right now, start with the symptom table two sections down.

## What a Markdown table actually is

Three parts, in this order, on consecutive lines:

```markdown
| Flag | Long form | Takes a value |
| --- | --- | --- |
| `-o` | `--output` | yes |
| `-q` | `--quiet` | no |
```

The first line is the header row. The second is the separator row — sometimes called the delimiter row — and it is what makes this block a table rather than a paragraph. The rest are body rows. The block ends at the first blank line, or at the first line that starts some other block-level construct such as a heading or a fence.

Converted to HTML, that becomes roughly this:

```html
<table>
<thead>
<tr><th>Flag</th><th>Long form</th><th>Takes a value</th></tr>
</thead>
<tbody>
<tr><td><code>-o</code></td><td><code>--output</code></td><td>yes</td></tr>
<tr><td><code>-q</code></td><td><code>--quiet</code></td><td>no</td></tr>
</tbody>
</table>
```

Two things follow from that output, and both explain a lot of later trouble. First, there is always exactly one header row, wrapped in `<thead>`. Markdown has no syntax for a table without a header, and none for two header rows. Second, every cell is a `<th>` or a `<td>` holding inline content. There is no mechanism in the syntax for a cell that spans two columns, a cell that spans two rows, a nested table, or a cell containing a paragraph and a list.

Worth knowing before you read further: the parser is looking for a shape, not repairing one. If the first two lines do not agree on how many cells they hold, the block never becomes a table, and every line in it is emitted as text. That single rule accounts for more broken tables than everything else on this page put together.

## Markdown table not rendering: symptom to cause

Find the symptom, then read the section it points you at.

| Symptom in the output | Almost always because | Fix |
| --- | --- | --- |
| The whole table is one paragraph of pipes | No separator row, or a separator row with a different number of cells from the header | Count the cells in both lines; they must match exactly |
| The whole table is one paragraph, and the dashes look odd | An editor turned `---` into an em dash, or the pipes are full-width `｜` from an input method | Retype the separator row with plain hyphens and ASCII pipes |
| The header row is glued to the paragraph above it | No blank line between the prose and the table | A blank line before the table, and one after |
| The table renders, but a column is missing | The separator row has fewer cells than the header's content suggests | Count the dashes, not the headers |
| One row has a cell split in two, and its last value is gone | An unescaped `\|` inside a cell value | Write it as `\|`, backticks included |
| A cell is empty when the source clearly has text | That row had more cells than the header, so the extras were discarded | Match the cell count, or escape the stray pipe |
| The table renders as a code block | The block is indented four spaces or more | Reduce to zero, or to the list item's content column |
| The table renders everywhere except in one tool | That tool is running CommonMark without the tables extension | Choose a GFM parser, or accept the fallback |
| Two sentences in a cell ran together | A `<br>` was stripped by a sanitiser, or was never there | Check the sanitiser's allow-list; there is no other way to break a line |
| A bullet list inside a cell came out as literal dashes | Cells hold inline content only | Restructure: the table is the summary, the detail goes below |
| Alignment is ignored | Colons on the wrong side of the dashes, or a stylesheet overriding it | `:---`, `:---:`, `---:` — colons inside the cell, against the dashes |

Two of those deserve emphasis because they are the ones people stare past. A miscounted separator row and an unescaped pipe both produce output that looks like a formatting problem and is really a counting problem.

## The cheat sheet: every part of a table, and what it costs

| Part | What it is for | What it does | Price |
| --- | --- | --- | --- |
| Header row | Naming the columns | Becomes `<thead>`, one row of `<th>` | Mandatory; there is no headerless table |
| Separator row | Telling the parser this is a table | Fixes the column count for the whole block | One line, and counting columns twice |
| Dashes | Filling the separator cells | One `-` per cell is valid; `---` is convention | Nothing; the length is cosmetic |
| Alignment colons | Aligning a column left, centre or right | Emits an `align` attribute or a `text-align` style per cell | One character per column, and per column only |
| Outer pipes | Framing the row | Optional on every row except in a one-column table | Two characters a line, and much better legibility |
| `\|` | Putting a literal pipe in a cell | Escapes the delimiter, code spans included | A backslash, and slightly noisier source |
| `<br>` | Breaking a line inside a cell | Inline HTML, which GFM passes through | A dependency on whatever sanitises your HTML |
| Blank line before and after | Marking the block's boundaries | Keeps the header out of the preceding paragraph | Two blank lines, in exchange for portability |
| Indentation | Placing a table inside a list item | Zero to three spaces is fine; four is a code block | Care, whenever the table is nested |
| Body row cell count | Filling the grid | Short rows are padded, long rows are truncated | Silence when it is wrong |
| Inline content only | Keeping cells parseable | Text, emphasis, code spans, links, images | No lists, paragraphs, fences or nesting |
| Scroll wrapper | Surviving a narrow page | A `<div>` your stylesheet can give `overflow-x: auto` | Blank lines inside the wrapper, and control of the CSS |

Everything below expands one row of that table.

## The parts, one at a time

### The separator row — the line that makes it a table

This is the load-bearing line. `| --- | --- | --- |` is not decoration between the header and the body; it is the declaration that turns three lines of pipes into a grid. Delete it and the parser has no reason to treat any of those lines as anything but a paragraph, which is exactly what comes out the other end.

| Pros | Cons |
| --- | --- |
| One line is the entire difference between prose and a table | Its cell count must match the header row exactly |
| A single dash per cell is enough; nobody counts them | Nothing warns you when the counts disagree |
| It carries the alignment, so formatting needs no extra syntax | An editor's smart punctuation can destroy it invisibly |
| It is the fastest thing to check when a table breaks | It has to be the second line — not the third, and not after a comment |

**Price:** one line, and the habit of counting columns twice before you blame the renderer.

**Technical details and features**

- Each separator cell may hold dashes, an optional leading colon, an optional trailing colon, and spaces. Nothing else. A stray letter or full stop and the block is a paragraph.
- The number of cells in the separator row must equal the number in the header row. This is the one strict rule in the whole construct.
- Once those two agree, that column count is fixed for every body row that follows.
- `-`, `--` and `-----------` are identical to the parser. Aligning the dashes with the widest cell is for the human who edits the file next.
- Word processors and some editors convert `---` to an em dash as you type. An em dash is a different character, so the separator row stops being one.

**Who should use it?** Everybody, on every table, on the second line. If a table is not rendering, this is where you look first, and most of the time you can stop there.

### Alignment colons — the only formatting a column gets

Colons in the separator row set the alignment of the whole column, header included:

```markdown
| Left | Centred | Right |
| :--- | :-----: | ----: |
| a | b | 1 |
```

A colon on the left aligns left, on the right aligns right, on both sides centres, and none at all leaves the renderer's default — which is usually left, but is the stylesheet's decision rather than the document's.

| Pros | Cons |
| --- | --- |
| Costs one character and applies to every row in the column | Column-wide only: there is no per-cell alignment |
| Right-aligned numbers line up their digits, which is the point | What it emits differs between renderers |
| Works with a single dash, so `:-:` is a valid centred cell | A sanitiser's allow-list can drop the attribute or the style |
| Header and body always agree, because it is one declaration | No vertical alignment, and no way to align a whole table |

**Price:** one character per column, and a dependency on your renderer's choice of output.

**Technical details and features**

- The colon goes inside the cell, against the dashes. `| :--- |` is right; `| : --- |` and `|:|` are not.
- Some renderers emit `<th align="right">`, others `<th style="text-align:right">`. Both look identical in a browser.
- The difference bites in two places: when you write your own CSS against the output, and when the HTML passes through a sanitiser whose allow-list permits one of `align` and `style` but not the other. [Sanitising Markdown safely](/blog/sanitising-markdown-safely) explains why one shared allow-list is worth insisting on.
- Alignment is the only per-column control the syntax has. No widths, no colours, no wrapping rules — those live in CSS or nowhere.

**Who should use it?** Anybody with a column of numbers, versions or file sizes. Right-align those and leave text columns alone; centred body text is harder to read than it looks in the editor.

### Blank lines — the boundary the parser needs

Written directly beneath a line of prose, a table's header row can be swallowed by that paragraph. Parsers disagree about whether a table may interrupt a paragraph at all, so a file that renders on your machine may not render in the next tool along the chain.

| Pros | Cons |
| --- | --- |
| Two blank lines make the block unambiguous everywhere | Easy to lose when files are generated or concatenated |
| Removes a whole class of tool-to-tool difference | It is whitespace, so reviewers do not notice it missing |
| Also fixes tables wrapped in raw HTML | Some editors strip trailing blank lines on save |

**Price:** two blank lines, in exchange for a table that behaves the same in every renderer.

**Technical details and features**

- A blank line before the header row keeps it out of the preceding paragraph. A blank line after the last body row ends the block cleanly.
- The table also ends at any line that begins another block: a heading, a fence, a blockquote, a horizontal rule.
- Inside a raw HTML wrapper the blank lines are not optional — see the wide-table section below.
- Files stitched together by a script are the usual source of a missing blank line. Join documents with a blank line between them, not a bare newline.

**Who should use it?** Everybody, every time. This is the cheapest reliability you will buy today.

### Pipes inside a cell — the escape you will forget

An unescaped pipe ends the cell wherever it appears. That includes inside a code span, because the row is split on pipes before the inline parser ever sees the backticks. Write a shell pipeline, a type union or a regular expression with an alternation in it, and the row quietly gains a cell and loses a value.

| Pros | Cons |
| --- | --- |
| `\|` works everywhere in a cell, code spans included | Nothing about the broken output points at the pipe |
| The escape is one character and needs no configuration | Source with several escapes in it reads worse |
| Percent-encoding as `%7C` works inside a link destination | The same string in a fenced block needs no escape, which confuses people |

**Price:** a backslash per pipe, and source that reads slightly worse than the output.

**Technical details and features**

- Escape a literal pipe as `\|`. In GFM this is honoured inside other inline spans, so `` `a \| b` `` renders as a code span containing `a | b`.
- A pipe in a link destination is safest percent-encoded as `%7C`, since escaping rules inside URLs are less consistent between parsers.
- A pipe inside an HTML attribute in a cell splits the row too. The parser is not reading your HTML.
- Full-width `｜` from a Chinese or Japanese input method is not the delimiter at all, so a row typed with it never becomes cells.
- Fenced code blocks outside a table need no escaping. If a cell is filling up with escapes, that is a hint the content belongs in [a code block instead](/blog/code-blocks-in-markdown).

**Who should use it?** Anybody documenting a command line, a regular expression, an OR condition or a type union — which is to say most people writing technical tables.

### Line breaks inside a cell — impossible, and `<br>` instead

A table row ends where the line ends. There is no Markdown syntax for a newline inside a cell: two trailing spaces do nothing here, whatever they do [elsewhere in a document](/blog/markdown-line-breaks-and-lists), and a trailing backslash does not help either, because the parser has already decided the row is over.

The workaround is inline HTML:

```markdown
| Step | Notes |
| --- | --- |
| Publish | Creates the link.<br>Sending it is your job. |
```

| Pros | Cons |
| --- | --- |
| The only thing that works, and it works in most renderers | It is HTML in your Markdown, which some pipelines forbid |
| GFM allows inline HTML, so the parser passes it through | A sanitiser that strips unknown tags runs the sentences together |
| `<br>` and `<br />` both parse | Several breaks in one cell usually mean the table is wrong |

**Price:** one HTML tag, and a dependency on whatever sanitises your HTML keeping it.

**Technical details and features**

- Put the tag inline, with no space before it, exactly where the break belongs.
- Whether it survives depends on the next step, not the parser. A converter that escapes raw HTML by default shows you a literal `<br>`; one that strips unknown tags drops it and joins the text.
- TransformPipe sanitises the preview and the downloaded file against one shared allow-list, so the break you see in the preview is the break in the file you send.
- If a cell needs two breaks, or a break plus a bullet, you are writing a paragraph inside a grid. Move it out.

**Who should use it?** Anybody with a "notes" column, sparingly. A table where every cell carries a `<br>` is a table fighting its own shape.

### Ragged rows — padded silently, truncated silently

Once the header and separator rows agree on a column count, that count is law. A body row with fewer cells is padded with empty ones. A body row with more cells has the extras thrown away. Neither produces a warning, and both look like data loss when you find them a week later.

| Pros | Cons |
| --- | --- |
| Short rows are legal, so trailing empty cells can be left off | A miscounted row loses its last value with no notice |
| The forgiving behaviour keeps hand-edited tables rendering | An added column has to be added to every single row |
| The column count is easy to verify: count the separator cells | Generated tables inherit whatever the generator miscounted |

**Price:** silence. This is the one part of the syntax that fails without a symptom you can see in the source.

**Technical details and features**

- Cell counts are decided by the header and separator rows only. Body rows are fitted to them.
- A dropped last value in one row is usually an extra pipe earlier in the same row — often an unescaped one inside a value.
- Columns need not line up in the source. Ragged source produces the same HTML as a tidy grid; tidy it anyway, for whoever edits it next.
- If you add a column, add it to the header, the separator and every body row in one edit. Half-migrated tables still render, which is why they survive review.

**Who should use it?** Nobody deliberately. Know the rule so that a missing value sends you to count pipes rather than to blame the converter.

### Leading and trailing pipes — optional, until they are not

These two blocks produce identical HTML:

```markdown
| Name | Size |
| --- | --- |
| logo.svg | 4 KB |

Name | Size
--- | ---
logo.svg | 4 KB
```

| Pros | Cons |
| --- | --- |
| The bare form is quicker to type and to generate | Harder to read, and harder to spot a missing cell in |
| The framed form makes the column count visible at a glance | Two extra characters on every line |
| Both are valid GFM, so neither is a portability risk | A one-column table needs the outer pipes to be recognised at all |

**Price:** two characters a line for the framed form. Pay it.

**Technical details and features**

- Outer pipes are optional on the header, separator and body rows independently. You can mix them, though there is no reason to.
- A one-column table is the exception: with no pipe anywhere on the line there is nothing to tell the parser it is looking at a table, so write `| Header |` and `| --- |`.
- Spaces around cell content are trimmed, so padding cells to line up costs nothing at render time.
- Tabs inside a row are treated as whitespace, not as delimiters. A tab-separated table is not a Markdown table.

**Who should use it?** Use the framed form in files people edit by hand. The bare form is fine for a script's output, where nobody reads the source anyway.

### Indentation — three spaces fine, four spaces fatal

Up to three leading spaces are ignored. Four or more turn the line into an indented code block, and the table renders as monospaced text in a grey box — which at least is a distinctive symptom.

| Pros | Cons |
| --- | --- |
| The three-space tolerance forgives most stray whitespace | Four spaces is a completely different construct |
| Tables nest inside list items, when indented correctly | The required indent depends on the list marker's width |
| The failure is visible: a code block, not a paragraph | Mixed tabs and spaces make the content column ambiguous |

**Price:** attention, whenever the table lives inside a list.

**Technical details and features**

- Inside a list item, every line of the table — header, separator and body — must sit at the item's content column, which is the column where the item's own text starts.
- Inside a blockquote, every line needs its `>` marker, the separator row included.
- A table inside a list inside a blockquote is legal, and nobody will thank you for it.
- If the table renders as a code block, the fix is whitespace, not syntax.

**Who should use it?** Anybody writing procedures, where a step wants a small table under it. Consider a heading and a full-width table instead; nested tables are cramped on a phone.

### The flavour — tables are GFM, not CommonMark

Tables are in neither original Markdown nor plain CommonMark. Several extensions add them, and the GitHub Flavored Markdown version is the one most tools follow. A converter running strict CommonMark with no tables extension renders your table as a paragraph of pipes — and it is right to. Nothing is broken. The feature is not there.

| Pros | Cons |
| --- | --- |
| GFM's table syntax is what almost every modern tool implements | A compliant CommonMark parser refuses it, correctly |
| The fallback is readable text rather than an error | The failure is silent, so it travels far before anyone notices |
| Pandoc, remark, markdown-it and others all offer tables | Extensions differ at the edges: grid tables, captions, multi-line cells |

**Price:** none in GFM. In a mixed pipeline, the cost is checking each parser once.

**Technical details and features**

- GFM defines tables as an extension to CommonMark, alongside task lists, strikethrough and autolinks. A tool can implement CommonMark fully and support none of the four.
- Some ecosystems need the extension switched on explicitly — a plugin, a preset or a flag — and ship with it off.
- Other flavours add table features GFM does not have, such as multi-line cells or captions. Those do not travel: a document relying on them renders as pipes in a GFM renderer.
- [CommonMark, GFM and the flavours](/blog/commonmark-gfm-and-the-flavours) sets out which parser does what, and [the converter comparison](/blog/best-markdown-to-html-converters) covers which tools handle tables without configuration.

**Who should use it?** Anybody whose file passes through more than one renderer. Convert one representative document early and look at the tables before you build anything on top of them.

## Where a Markdown table is the wrong shape, and what that costs

The syntax above covers tables that should work and do not. There is a second category: tables that cannot work, because the data does not fit what a Markdown table is. This is the part a syntax reference leaves out, and it is worth being honest about the alternatives, because each one costs something real.

**Merged cells.** There is no colspan and no rowspan. A financial table with a spanning header, or a matrix with a merged label column, cannot be expressed. Your options are a raw HTML `<table>` inside the Markdown file, or a different presentation. The HTML table works, and it costs you three things: nobody can read it in the source, a diff of one changed value becomes a diff of an HTML row, and the whole block depends on your converter's sanitiser allowing `table`, `tr`, `td`, `colspan` and `rowspan`. Plenty of allow-lists permit the tags and drop the attributes, which produces a table that renders with the spans quietly gone.

**Cells with real content in them.** A cell that wants a paragraph, a bullet list, a fenced code block, a blockquote or a nested table cannot have one. Cells hold inline content, full stop. The usual fix is the right one: keep the table as the summary, one short value per cell, and put the detail in headed sections underneath. It reads better on a phone as well, where a five-column table is hard going however it was written.

**Anything with a checkbox.** Task list checkboxes come from list items, so `- [ ]` inside a cell stays literal text in most renderers. If you need a column of ticks, put a character in it and say in the header what it means.

**Reference-style links defined nearby.** Link reference definitions are block-level, so they cannot live inside a table. References defined elsewhere in the document work fine inside cells; the definition simply has to sit outside the block.

**Tables that are really data.** If the rows come from a spreadsheet, an export or a query, hand-editing pipes is the wrong job — [convert the CSV instead](/blog/best-csv-to-markdown-converters). Every added column means touching every row, and a miscounted row loses a value silently. Keep the CSV or the query as the source of truth and generate the Markdown: [converting CSV to a Markdown table](/csv-to-markdown) takes the counting away from you entirely and gets the escaping right on values that contain pipes, which is the mistake people make by hand.

**Wide tables.** Two problems hide behind one complaint. The first is the source file, where a nine-column table is miserable to edit and impossible to review. The second is the page: an HTML table takes the width its content demands, so a wide one either squeezes its columns into ribbons or drags the page sideways. Fixes, roughly in the order you should like them:

- Cut a column. Wide tables usually contain one with the same value in every row, or two that could be one.
- Shorten the headers. A header that cannot wrap sets the column's minimum width, so "Requires authentication" costs more than "Auth".
- Transpose it. Four columns and three rows often read better the other way round.
- Split it into two tables sharing a key column.
- Let it scroll, by wrapping it in a container your stylesheet gives `overflow-x: auto`.

That last one has a catch worth spelling out, because it is a common way to break a table that was previously fine:

```markdown
<div class="table-scroll">

| Column | Column |
| --- | --- |
| … | … |

</div>
```

The blank lines inside the wrapper are mandatory. Without them the table sits inside a raw HTML block, the parser leaves the whole thing alone, and your pipes reach the page verbatim. And the wrapper only helps where you control the CSS. In a standalone HTML file, whether a wide table scrolls or overflows is decided by the stylesheet your converter ships.

## How to choose the shape of your table

1. **Count the columns before you type the header row.** The count you commit to in the separator row is the count every row must honour from then on, and adding one later means editing every line — so decide once, while the table is still three lines long.
2. **Decide whether the data is written or generated.** Prose belongs in a hand-written table. Rows that came out of a spreadsheet or an API belong in a generated one, because a human retyping forty rows of pipes will miscount at least one, and the miscount is silent.
3. **Ask whether any cell will ever need a second line.** If yes, you are committing to `<br>` and to a sanitiser that keeps it. If more than one cell needs it, the table is the wrong container, and the right answer is a short table plus sections.
4. **Check the parser at the far end before you rely on a table.** A file that renders on GitHub and breaks in a build is usually meeting a stricter parser with tables switched off, and you would rather discover that on one test file than in a published document.
5. **Convert once and read the HTML, not the preview.** A preview built on the same parser as your editor agrees with your editor by construction. The `<table>` element in the output is the only proof, and a missing `<th>` there tells you which line to fix.

## Conclusion

Markdown tables are fragile in one specific way: they fail completely rather than partly, and they fail without saying so, which makes them look unpredictable when they are not. The separator row must match the header's cell count, the block needs a blank line on each side, a literal pipe needs a backslash, a line break needs `<br>`, and the whole feature needs a parser that implements GFM. Get those five right and a table survives every conversion you will put it through. Take the widest, most escaped table you have, run it through [TransformPipe](https://transformpipe.com), and read the HTML source beside the preview: a missing column means the dashes are miscounted, and a cell split in two means a pipe you did not escape.

## FAQ

### Why is my Markdown table not rendering at all?

Nine times in ten the separator row is wrong: missing, on the wrong line, or holding a different number of cells from the header row. Count the cells in the first line and the cells in the second and make them equal. If they already match, check for a blank line above the table, and for an em dash where you typed three hyphens.

### Do I need a blank line before a Markdown table?

Yes, in practice. Parsers disagree about whether a table can interrupt a paragraph, so a table written directly under a line of prose renders in some tools and is absorbed into the paragraph in others. A blank line before the header row and one after the last body row removes the disagreement.

### How do I put a line break inside a Markdown table cell?

With `<br>`, written inline where the break belongs. There is no Markdown syntax for it, because a table row ends at the end of the line, and two trailing spaces do nothing inside a cell. Whether the tag survives depends on your converter's sanitiser rather than its parser.

### How do I escape a pipe character in a Markdown table?

Write `\|`. It works in ordinary cell text and inside code spans, so `` `a \| b` `` gives you a code span containing a pipe. In a link destination, percent-encode it as `%7C` instead, since escaping inside URLs is handled less consistently between parsers.

### How do I align a column in a Markdown table?

Put colons in the separator row: `:---` for left, `:---:` for centre, `---:` for right. Alignment applies to the whole column including the header, and there is no way to align a single cell. What the renderer emits — an `align` attribute or a `text-align` style — varies, and both look the same in a browser.

### Are tables part of standard Markdown?

No. Tables are in neither original Markdown nor CommonMark; they come from extensions, and GitHub Flavored Markdown's version is the one most tools implement. A strict CommonMark parser renders your table as a paragraph of pipe characters, and is behaving correctly in doing so.

### What do I do with a Markdown table that is too wide?

Cut a column, shorten the headers, or transpose it — those fix the source as well as the page. If the data genuinely needs the width, wrap the table in a `<div>` your stylesheet gives `overflow-x: auto`, remembering the blank lines inside the wrapper, and accept that the wrapper only helps where you control the CSS.
