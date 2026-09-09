---
title: "How to Convert a CSV to a Markdown Table Without Breaking the Data"
description: Turn a CSV into a Markdown table, and handle the traps: quoted commas, doubled quotes, in-cell line breaks, pipes, semicolons, BOMs and a missing header row
date: 2026-09-03
tag: Converting
keywords: csv to markdown table, convert csv to markdown, csv to markdown table converter, tsv to markdown table, csv quoted field markdown, markdown table from spreadsheet, semicolon delimited csv to markdown
---

### TL;DR

Converting a CSV to a Markdown table is two lines of work — a header row, a separator row of dashes, and one row per line — and about nine ways of getting it silently wrong. The failures all come from the same place: a CSV is not a file with commas in it, it is a quoted format with rules, and a converter that splits on commas produces a table that looks fine and says something different from the file. Use a tool with a real CSV parser, escape pipes as `\|` on the way out, replace in-cell line breaks with `<br>` because a Markdown table cannot hold a newline, and add a header row before converting if your file has none. Then check one difficult row in the output rather than the first three.

The mechanics are trivial. That is what makes this job dangerous: because the output is always a plausible-looking table, nothing tells you when a value has moved a column to the left, when a name has lost its comma, or when a row has quietly lost its last field. The table renders. The data is wrong. Nobody notices until somebody reads a number out loud in a meeting.

Most of the trouble arrives from spreadsheets. A CSV that was written by a program and read by a program tends to be clean, because both ends implemented the same rules. A CSV that a person exported from Excel or Numbers or a CRM contains addresses with line breaks in them, notes with quotation marks, a first column heading with an invisible byte attached, and — depending on where the machine thinks it is — semicolons where you expected commas.

This piece is the procedure and the traps. The procedure takes a minute. The traps are the article, and they are in the order in which they bite: quoting first, because it changes what a row even means, then escaping on the way out, then the file-level problems that stop the conversion looking like a table at all.

## How to convert a CSV to a Markdown table

The target format is fixed and small. A GitHub Flavored Markdown table is a header line, a delimiter line of dashes, and one line per row, with cells separated by pipes:

```markdown
| id | name | role |
| --- | --- | --- |
| 1 | Ann Rowe | Ops |
| 2 | Li Wei | Sales |
```

The leading and trailing pipes are optional in the specification and worth writing anyway, because they make a cell containing a leading space unambiguous and they read better in a diff. The delimiter line is not decorative: it is the line that tells the parser the block above it is a header rather than a paragraph, and it must have the same number of cells as the header. Get that wrong and you have a paragraph full of pipe characters. The rest of what the format can and cannot do is covered in [the piece on Markdown tables themselves](/blog/markdown-tables-that-survive-conversion); this article is about getting your rows into that shape without losing any of them.

Here is the whole procedure.

1. **Open the file in a text editor first, not a spreadsheet.** A spreadsheet will show you its own interpretation of the file, which is exactly what you are trying to check. A text editor shows you the bytes: whether the delimiter is a comma, whether fields are quoted, whether there is a header line, and whether any record spans more than one line. Thirty seconds here saves the rest.
2. **Confirm the delimiter.** Commas are the default and not the rule. If the first line reads `id;name;role`, you have a semicolon file and any comma-based tool will hand you one cell per row.
3. **Confirm there is a header row.** If the first line is data, add a header line before you convert. A Markdown table cannot exist without one, and every automatic answer to a missing header loses something.
4. **Convert with something that parses rather than splits.** That means a CSV reader — a browser-side converter, a library, or a command-line tool built for tabular data. A `cut -d,` or a `split(',')` is the wrong instrument and the damage it does is invisible in the output.
5. **Check the escaping on the way out.** Pipes in values must become `\|`. In-cell line breaks must become `<br>` or a space. Doubled quotes must have collapsed to single ones.
6. **Look at the hardest row, not the first row.** Find the row with a quoted comma, an apostrophe, a quotation mark or a path in it, and read that row in the output against the same row in the source.

To make step six concrete, here is a small file that carries five of the traps at once. Keep something like it; it is the only test that matters.

```csv
id,name,role,notes
1,"Smith, John",Sales,"Joined 2019
Moved from Support"
2,"O""Brien, Ann",Ops,"Owns the a|b routing rule"
3,Li Wei,Support,"Said ""no"" twice"
```

Four records, not five, because record 1 contains a newline inside a quoted field. A correct conversion produces this:

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | Smith, John | Sales | Joined 2019<br>Moved from Support |
| 2 | O"Brien, Ann | Ops | Owns the a\|b routing rule |
| 3 | Li Wei | Support | Said "no" twice |
```

Every difference between that output and the source is deliberate: the quotes around fields are gone because they were syntax, the doubled quotes have collapsed to single ones, the newline has become `<br>`, and the pipe has been escaped. Nothing has moved column.

A naive split on commas produces this instead, and this is the part worth staring at:

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | "Smith | John" | Sales |
| Moved from Support" | | | |
| 2 | "O""Brien | Ann" | Ops |
| 3 | Li Wei | Support | "Said ""no"" twice" |
```

John's role is now his surname. The notes field has vanished entirely from row 1, because Markdown discards cells beyond the header count and `"Joined 2019` was the fifth. The continuation line has become a row of its own. Ann has the same problem plus visible doubled quotes. Only row 3 survived, and it survived because it was boring. The table renders perfectly.

## The cheat sheet: every trap in one table

| Trap | In the CSV | What a naive split does | What a correct conversion does |
| --- | --- | --- | --- |
| Quoted field | `"Sales"` | Keeps the quote marks as characters | Strips them; they were syntax |
| Comma inside quotes | `"Smith, John"` | Two cells; row grows a column; last value discarded | One cell containing the comma |
| Doubled quote | `"Said ""no"""` | Leaves `""no""` visible in the cell | Collapses to `"no"` |
| Line break inside a cell | a quoted field spanning two lines | Splits the record into two malformed rows | Replaces the break with `<br>` or a space |
| Pipe in a value | a bare pipe inside a field | Adds a phantom column to that row | Escapes it as `a\|b` |
| No header row | first line is data | Promotes data to headings, silently | You add a header line before converting |
| Semicolon delimiter | `id;name;role` | One cell per row, whole line inside it | Reads the file with `;` as the delimiter |
| Tab delimiter | `id<TAB>name` | One cell per row | Reads it as TSV |
| BOM from Excel | invisible `EF BB BF` before `id` | Attaches to the first heading; comparisons fail | Strips it, or reads as `utf-8-sig` |
| CRLF line endings | every line ends `\r\n` | Leaves a stray `\r` on the last field of every row | Handled by the reader; nothing visible |
| Ragged rows | one row shorter than the header | Short row silently padded, long row truncated | Same, but you were told, or you checked |
| Alignment | nothing in the file expresses it | Every column left-aligned | Colons in the delimiter row, chosen by you |

The pattern across that table is worth naming. Roughly half of these failures are loud — a semicolon file converts into one column and you see it immediately. The other half are quiet, and every quiet one involves quoting. That is why the check is a difficult row rather than a glance at the output.

## Symptom to cause: what you see and what caused it

Work down this table when a conversion has already gone wrong. The symptom is what you noticed; the cause is what to fix in the source or the tool.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Every row is one cell containing the whole line | The delimiter is a semicolon or a tab, and the tool assumed a comma | Set the delimiter, or use a tool that sniffs it |
| One value has moved into the next column, later values shifted left | A comma inside a quoted field was treated as a separator | Use a real CSV parser |
| The last value of a row is missing | Same cause: the row grew wider than the header, and GFM discards the extra cells | Use a real CSV parser |
| Quote marks appear around values in the table | Quotes were treated as characters rather than syntax | Use a real CSV parser |
| `""` appears inside a cell | The doubled-quote escape was not collapsed | Use a real CSV parser |
| A row appears twice, the second one malformed and short | A quoted field contained a newline and the record was split at it | Convert with a parser that reads multi-line records |
| Two sentences have run together with no space | An in-cell line break was dropped rather than replaced | Replace with `<br>`, or with a space |
| `<br>` appears as literal text in the output | The Markdown is being read as plain text, not rendered as HTML | Use a space instead, or render the Markdown |
| A row has one column more than the others | An unescaped pipe inside a value | Escape as `\|` |
| The first column heading does not match anything you compare it to | A byte order mark is attached to it | Read the file as `utf-8-sig`, or strip the BOM |
| Accented characters are mojibake | The file is not the encoding the reader assumed — often Windows-1252 read as UTF-8 | Convert the encoding before parsing |
| The whole block renders as a paragraph of pipes | The delimiter row is missing, malformed, or has the wrong cell count | Fix the delimiter row |
| The table renders but the header is your first data row | The file had no header and the tool promoted row one | Add a header line to the source |
| A trailing `\r` appears at the end of the last cell in each row | CRLF line endings split on `\n` only | Use a reader that handles CRLF |
| Numbers show as `0.4567` where the sheet showed `45.67%` | The export wrote the value, not the display format | Fix the export, or the column, before converting |

## Quoting: commas, doubled quotes and line breaks

Everything in this section comes from one rule in RFC 4180: a field may be enclosed in double quotes, and inside those quotes a comma is data, a line break is data, and a double quote is written as two double quotes. Three sentences. Every quiet failure in a CSV conversion is a tool that did not implement one of them.

### A comma inside a quoted field

`"Smith, John",Sales,2026` is three fields. A parser reads the opening quote, consumes everything to the closing quote, and hands you `Smith, John` as one value. A split on commas hands you four, and now the row is one cell wider than its header.

This is the failure that costs data rather than looks. GFM's table rule is that a row with more cells than the header has the extra cells discarded, so the widened row does not error, does not warn, and does not overflow — it drops its final value and shifts everything after the offending field one column to the left. Names, addresses, job titles and free-text notes are where this lives. If a column can contain a comma, this trap applies to it.

### A doubled quote means one quote

Inside a quoted field, `""` is a literal `"`. So `"She said ""no""."` is one field reading: She said "no". A tool that strips quotes by pattern rather than by parsing leaves the pairs behind and you get `She said ""no""` in the cell.

This one is cosmetic right up until it is not. In a column of prose, doubled quotes are ugly. In a column of measurements in inches, of code samples, or of JSON fragments, they change the value. A cell reading `{"id": 1}` that arrives as `{""id"": 1}` is no longer valid JSON, and if somebody later copies it out of your document they will spend ten minutes on it.

### A line break inside a cell

This is the trap with no clean answer, and it is worth understanding rather than working around.

RFC 4180 allows a newline inside a quoted field, and spreadsheets produce them constantly, because Alt+Enter inside a cell is how people write address blocks and notes. A Markdown table has no way to represent that. The format is line-based: one row per line, no continuation syntax, no escape for a newline. Whatever the converter does here, it is choosing between two lies.

```csv
id,address
1,"12 Mill Lane
Bristol
BS1 4AA"
```

The three ways that can land in a Markdown table:

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane<br>Bristol<br>BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane Bristol BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane |
| Bristol | |
| BS1 4AA" | |
```

The first keeps the structure and puts an HTML tag in your Markdown. The second keeps the Markdown clean and loses the structure, and if the tool joins without a space you get `12 Mill LaneBristol`. The third is what a splitter does and it is simply broken. Prefer the first when the Markdown will be rendered as HTML, which is the usual case, and the second when it will not — a plain-text README read in a terminal, a commit message, a chat message in a client that does not render HTML inside tables. Why Markdown has no better option available inside a table is a consequence of [how line breaks work in Markdown generally](/blog/markdown-line-breaks-and-lists): the two-space break and the backslash break are inline constructs, and a table row ends at the newline regardless.

If your data has line breaks in a column and the structure matters, the honest answer is sometimes that the column should not be in the table. Move it below as a definition list, or link out to the source.

## Escaping on the way out: pipes, backslashes and alignment

Parsing the CSV correctly gets the values right. Writing the Markdown correctly keeps them right. Three things need doing on the way out, and one of them is the single most common bug in home-made converters.

### The pipe

CSV does not care about pipes. Markdown cares enormously: an unescaped `|` ends the cell wherever it appears. It must be written `\|`.

The detail people miss is that backticks do not protect it. A pipe inside an inline code span inside a table cell still ends the cell — the table is parsed into cells before inline syntax is looked at, so `` `a|b` `` becomes two cells, the first containing an unterminated code span. The GFM specification is explicit that the escape is required even inside other inline spans. There is no other mechanism.

```csv
pattern,meaning
"^(a|b)$","a or b, anchored"
```

```markdown
| pattern | meaning |
| --- | --- |
| `^(a\|b)$` | a or b, anchored |
```

Where this shows up: file paths on shell examples, regular expressions, shell pipelines, enumerated options in a documentation column, and any column holding `yes|no|maybe`. Converters written and tested against names and numbers never hit it. If you are evaluating a tool, put a pipe in a test cell deliberately.

### The backslash

Less common and worth knowing. A value ending in a backslash, or containing a sequence such as `\n` as literal text, can interact with Markdown's own escaping — `\|` is an escaped pipe, so a value that legitimately ends `...\` followed by a pipe delimiter produces something ambiguous. A careful writer escapes backslashes as `\\` in cell content. Most converters do not, and most data never triggers it. Check it only if your columns hold Windows paths or code.

### Alignment colons

Nothing in a CSV expresses alignment. A spreadsheet's right-aligned number column is a display property of the spreadsheet, and it does not survive the export, let alone the conversion. Markdown gives you three options per column, set by colons in the delimiter row, and applying them is a decision you make after the conversion:

```markdown
| Item | Qty | Price |
| :--- | ---: | ---: |
| Widget | 12 | 4.50 |
| Flange | 3 | 12.00 |
```

`:---` is left, `---:` is right, `:---:` is centre, and a bare `---` leaves it to the renderer, which in practice means left. Right-align numeric columns; it is the one piece of manual editing that reliably improves a converted table, because a column of right-aligned figures can be compared by eye and a left-aligned one cannot. Note that many converters emit bare dashes and leave this to you, and that the colons are the only column formatting the format has — no widths, no colours, no per-cell alignment.

### Padding, and why it does not matter

Some tools pad every cell so the pipes line up in the source. It has no effect whatsoever on the rendered output; it is purely for whoever reads the Markdown as text. Padding makes a wide table pleasant to read in an editor and horrible to diff, because changing one value rewrites every line in the block. For a table that lives in a repository and gets edited, unpadded is the better choice. For a table somebody will read in plain text, pad it.

## The header row, the delimiter and the bytes you cannot see

These three are file-level problems. They are usually loud, and they are all fixed before the conversion rather than after it.

### A file with no header row

Machine-generated CSVs frequently have no header: a log export, a database dump, a sensor feed, an API paging response written straight to disk. A Markdown table cannot exist without a header, because the delimiter row underneath it is what identifies the block as a table at all.

So every converter does one of three things, and none of them is good:

| Behaviour | Result |
| --- | --- |
| Promote the first data row | You lose that row's data, and the headings are meaningless |
| Generate placeholder names | `a, b, c` or `Column 1, Column 2` — the table is readable but says nothing |
| Refuse to convert | Honest, and rare |

Most tools take the first option quietly, which is why a converted log file so often has a timestamp sitting where the column names should be. The fix is one line in a text editor: add a header. You know what the columns are, and no automatic answer to this ever produces a table somebody can read six months later.

### Semicolons, tabs and other delimiters

A `.csv` file is not necessarily comma-separated. In locales where the comma is the decimal separator, a spreadsheet exporting CSV uses the list separator from the system's regional settings, which is commonly a semicolon — and the file still has a `.csv` extension. This is the most frequent cause of "the converter produced one column".

```csv
id;name;price
1;Widget;4,50
```

Note the second problem in that file: `4,50` is four point five, written in a locale that uses the comma as a decimal point. Converting the delimiter does not convert the numbers. If those values are going into a table people will read, decide whether they should be normalised first, because a mixed table of `4,50` and `12.00` is worse than either.

Tab-separated values are the same format with a different separator, and they are easier to handle safely for one reason: tabs almost never appear inside values, so the quoting problems mostly evaporate. This is also why copying a range out of a spreadsheet and pasting it often works better than exporting a CSV — the clipboard carries tab-separated text.

| Delimiter | Where it comes from | What to do |
| --- | --- | --- |
| Comma | The default, and most programmatic exports | Nothing |
| Semicolon | Spreadsheet exports in comma-decimal locales | Set the delimiter; check the decimal separator too |
| Tab | `.tsv`, `.tab`, and anything pasted from a spreadsheet | Read as TSV |
| Pipe | Some database and mainframe exports | Set the delimiter, and remember every value now needs escaping in the output |
| Fixed width | Legacy reports | Not CSV at all; needs a column-position parser first |

A pipe-delimited source deserves a moment's thought, because the delimiter and the output syntax are now the same character. Parse it as pipe-delimited, then escape any pipes that were inside the values. A tool that reads it as CSV will produce a table that looks correct and is wrong in every row that contained a pipe in its data.

### The bytes before the first field

Two invisible things travel with files written on Windows or exported from Excel.

A **byte order mark** — the bytes `EF BB BF` — may sit at the very start of a UTF-8 file. Excel writes one when you choose its `CSV UTF-8` save format, and it is there for the benefit of programs that would otherwise guess the encoding. Your CSV reader may or may not strip it. If it does not, the mark attaches itself to your first column heading, where it is invisible in every editor and breaks every comparison against that heading. You get a heading that looks like `id`, is not equal to `id`, and cannot be explained by looking at it.

```python
# Reads the BOM and discards it if present.
with open('data.csv', newline='', encoding='utf-8-sig') as handle:
    rows = list(csv.reader(handle))
```

```bash
# Strips a UTF-8 BOM from the first line only.
sed '1s/^\xEF\xBB\xBF//' data.csv > clean.csv
```

**CRLF line endings** are the other. RFC 4180 actually specifies CRLF as the record separator, so a well-formed CSV has them and a reader must cope. A tool that splits on `\n` alone leaves a carriage return glued to the last field of every row, which is invisible until you compare a value or paste it somewhere that shows control characters.

Encoding is the third file-level problem and the loudest of the three. A CSV carries no declaration of its own encoding. A file saved as Windows-1252 and read as UTF-8 gives you mojibake in every accented name; read as UTF-8 when it is actually UTF-16 it may not parse at all. Convert the file before you convert the table:

```bash
iconv -f WINDOWS-1252 -t UTF-8 data.csv > data-utf8.csv
```

None of these three is difficult. All three are invisible, and all three are handled by a proper reader and by none of the one-liners people reach for first.

## Where a Markdown table is the wrong answer

The honest section. Some of what a spreadsheet holds has no Markdown equivalent, and no converter fixes that, because the limitation is in the format rather than the tooling. Knowing which parts saves you from looking for a better tool.

**Merged cells.** There is no colspan or rowspan. A header that spans three columns in the sheet has to become one heading with two empty neighbours, or three repeated headings. If the source relies on merged cells to express its structure, the table needs redesigning before it needs converting.

**Nested or grouped headers.** Two header rows — a group above, sub-columns below — is a common spreadsheet shape and impossible in Markdown, which has exactly one header row. Flatten it into compound names such as `2025 Q1` and `2025 Q2`, or use raw HTML, at which point you are not writing a Markdown table any more.

**Anything wide.** Markdown tables do not wrap and do not scroll on their own. Twelve columns of prose becomes a table wider than the page, and what happens next belongs to whatever renders it: overflow, a squeeze, or a scrollbar if the surrounding HTML supplies one. Cut columns before converting, or transpose so the rows become the columns, or accept that it will be read on a wide screen.

**Anything long.** A thousand-row table in a document is not a table, it is a data dump with borders. There is no pagination and no sort. Above roughly fifty rows, the useful output is a summary table plus a link to the CSV.

**Anything interactive.** No sorting, no filtering, no totals row that recalculates, no conditional formatting. If a reader needs to interrogate the numbers rather than read them, the table is the wrong artefact.

**Formulas and formats.** These are already gone before the converter sees the file. A CSV export contains values, and currency symbols, thousands separators, percentages and date formats are display properties that the exporter either wrote out or did not. If the table shows `0.4567` where the sheet showed `45.67%`, the export did that.

There are also costs specific to the routes themselves. A browser-side converter does the work on your own machine, which is why nothing is uploaded, and that same fact means a very large file is limited by the machine and the tab: TransformPipe caps a conversion at 10 MB, and a document kept to a shareable link at 4 MB, because the function that stores it refuses a larger request body. A command-line tool has no such ceiling and does require an install and a person who remembers the flags. A spreadsheet plugin is convenient and ties the job to the application. None of these is a defect; they are the shape of each route, and the comparison of the routes themselves is the subject of [the CSV to Markdown converter round-up](/blog/best-csv-to-markdown-converters).

One more cost worth naming: the flavour. Tables are not in CommonMark. They are a GitHub Flavored Markdown extension, so a strictly CommonMark-compliant renderer shows your converted table as a paragraph full of pipes. Before you convert a hundred rows, confirm that whatever will render the result does tables at all — [the flavours differ in exactly this way](/blog/commonmark-gfm-and-the-flavours), and it is the first thing to check rather than the last.

## How to choose a route

1. **Start from whether the rows can leave your machine.** Public data makes this a non-question. Names, salaries, patient identifiers or unreleased figures make it the only question, and it eliminates every hosted converter that uploads. Browser-side conversion and local command-line tools are the two answers, and the difference between them is not visible in any feature list.
2. **Count how many times you will do this.** Once is a file drop and a paste. Every week is a script, and a script means a command-line tool or a library call — because the part of a weekly process that gets forgotten is always the person who was supposed to open a browser tab.
3. **Check whether you need to reshape as well as convert.** If the answer includes selecting columns, filtering rows or sorting, pick a tool that does data work and emits Markdown at the end. Deleting rows from a finished Markdown table by hand is the slowest possible route and the one that introduces transcription errors.
4. **Test with your worst row, not a sample.** Take the row with the quoted comma, the quotation mark and the pipe in it, convert it, and read the output against the source. A tool that survives that row will survive the file; a tool that fails it fails silently and everything else about it is irrelevant.
5. **Decide about in-cell line breaks before you convert, not after.** If the output will be rendered as HTML, `<br>` is right. If it will be read as plain text, a space is right. The tool has already chosen for you, so find out which and pick a tool that agrees, because fixing it afterwards means editing every affected cell.
6. **Look at the file for a header row before the tool decides.** Ten seconds in a text editor, one line typed if it is missing. This is the only item on the list that is free.

## Conclusion

The conversion itself is a header, a row of dashes and one line per record, and you could do it by hand. If the rows are still in a spreadsheet rather than a file, [start there instead](/blog/convert-excel-to-markdown-table). What you cannot do by hand — reliably, at any volume — is honour the quoting rules, and that is where every silent failure comes from. Anything that reads the file as a CSV rather than as text with commas in it will get the commas, the doubled quotes and the multi-line records right; then it only has to escape the pipes and decide what to do about newlines in cells. If you want that done in the browser with nothing uploaded, [TransformPipe's CSV to Markdown table conversion](/csv-to-markdown) does the RFC 4180 parse, escapes pipes, turns in-cell line breaks into `<br>` and handles the BOM, free and with no install. If you want it in a script, use a tool built for tabular data. Either way, keep a four-row test file with a quoted comma, a doubled quote, an embedded newline and a pipe in it, and run anything new through that before you trust it with real rows.

## FAQ

### How do I convert a CSV to a Markdown table?

Write the column names as a pipe-separated header line, add a delimiter line of `| --- |` cells with one cell per column, then write one line per record with the values pipe-separated. Do it with a tool that parses CSV properly rather than splitting on commas, and escape any pipes in the values as `\|`.

### Why did my CSV convert into a single column?

Because the file is not comma-delimited. Spreadsheet exports in locales that use a comma as the decimal separator are commonly semicolon-delimited and still named `.csv`, and TSV files are tab-delimited. Open the first line in a text editor, see what separates the headings, and tell the converter.

### Can a Markdown table cell contain a line break?

No. The format is one row per line with no continuation syntax, so a real newline ends the row. A CSV field containing a line break has to become `<br>`, which renders as a break once the Markdown becomes HTML, or be flattened to a space. The converter chooses one of those, so find out which.

### What happens to a comma inside a quoted field?

With a real parser, nothing: the quotes are consumed as syntax and the comma stays inside the cell. With a comma split, the field becomes two cells, the row grows wider than the header, and because Markdown discards cells beyond the header count, the value at the end of that row disappears with no warning at all.

### How do I put a pipe character in a Markdown table cell?

Escape it as `\|`. That is the only mechanism, and it applies inside inline code spans too — backticks do not protect a pipe, because the row is split into cells before inline syntax is parsed. A converter that does not escape pipes will add a phantom column to every row that contains one.

### My CSV has no header row. What now?

Add one before converting. A Markdown table cannot exist without a header, so a converter will either promote your first data row — losing it — or invent placeholder names such as `a, b, c`. You know what the columns hold; typing one line is the only version of this that produces a table somebody can read later.

### Why is there a strange character before my first column heading?

A byte order mark, written at the start of the file by Excel's `CSV UTF-8` export and by some other Windows tools. It is invisible in editors and attaches itself to the first heading, so comparisons against that heading fail for no visible reason. Read the file with an encoding that strips it, such as Python's `utf-8-sig`, or remove the first three bytes.

### Does the source of a Markdown table need the pipes lined up?

No. Padding cells so the pipes align is purely for whoever reads the Markdown as text; the rendered output is identical either way. Padding helps readability and hurts diffs, since editing one value rewrites every line in the block, so unpadded is usually better for a table that lives in a repository.
