---
title: "Excel to Markdown Table: Every Route, and What Each One Loses"
description: How to turn an Excel range into a Markdown table, and what happens to dates, leading zeros, merged cells and the file's encoding on the way across
date: 2026-09-03
tag: Converting
keywords: excel to markdown table, convert excel to markdown, xlsx to markdown table, excel csv to markdown, paste excel into markdown, spreadsheet to markdown table, excel markdown table generator, excel csv encoding utf-8
---

A spreadsheet and a Markdown table look like the same thing drawn twice. They are not. One is a grid of cells with types, formats, formulas and regions that span several columns; the other is a line-based text format where a row is a line, a cell ends at a pipe character, and everything is a string. Getting from the first to the second is not a rendering problem. It is a decision about what to throw away.

### TL;DR

Save the sheet as **CSV UTF-8** and convert the CSV — that is the route that works every time, and it costs you formulas, formatting and every sheet except the active one. For a selected range, **copy and paste** is faster: Excel's clipboard carries a tab-separated version of the cells, which is easier to split than CSV because tabs almost never appear inside a value. Expect trouble in three specific places: **leading zeros and 16-digit numbers**, which Excel already destroyed when the value was typed; **merged cells**, which have no Markdown equivalent at all; and **encoding**, because plain `CSV (Comma delimited)` writes your system's ANSI codepage rather than UTF-8. Check one row with an accented character, one with a long number and one with a comma in it before you trust the other nine hundred.

The friction is rarely the conversion. It is that the table you get back is subtly wrong in a way nobody notices until it is published. A part number that read `00417` in the sheet reads `417` on the page. A date that read `03/09/2026` in London reads as the third of September to half your readers and the ninth of March to the other half. A header that spanned three columns has collapsed into one cell and two blanks, so the columns underneath it are now labelled with nothing.

None of that is the converter's fault, and that is the point worth understanding early. Most of the damage happens inside the spreadsheet — at the moment a value was typed, or at the moment Excel wrote a text file — and no tool downstream can reverse it. What a good conversion route does is make the damage visible while you can still fix it.

There is also the question of where the file goes. Spreadsheets are the most sensitive documents most people convert: salary bands, customer lists, unpublished figures, an export from a billing system. A converter that uploads is a converter that now holds those rows, and that matters more here than it does for a README.

## What a spreadsheet holds that a Markdown table cannot

Markdown tables come from GitHub Flavored Markdown, not from the CommonMark core, and the syntax is deliberately small: pipes between cells, one row per line, a row of dashes under the header to mark the whole thing as a table, and optional colons in that row for alignment. That is the entire feature set. Everything a spreadsheet does beyond it has to be dropped, flattened or moved somewhere else.

| In the workbook | In a Markdown table | What actually happens |
| --- | --- | --- |
| Formulas | Nothing | The value is kept, the formula is gone. The table stops updating |
| Number formats | Nothing | You get the displayed string, or the raw number, depending on the route |
| Bold, colour, fills | Inline emphasis only, no colour | A red cell that meant "overdue" arrives as an ordinary number |
| Conditional formatting | Nothing | The rule and the meaning both disappear |
| Merged cells | Nothing — no colspan, no rowspan | Value in the first cell, blanks in the rest |
| Several sheets | One table per sheet | A CSV export saves the active sheet only |
| A line break inside a cell | Nothing | Must become `<br>` or a space, or the table breaks |
| Hyperlinks | `[text](url)` | Kept only on routes that read the rich clipboard, not plain text |
| Comments and notes | Nothing | Silently dropped |
| Charts, images, pivot tables | Nothing | Not tabular, not convertible |
| Column widths, frozen panes | Nothing | Layout is the reader's, not yours |
| Alignment | `:---`, `:---:`, `---:` | The only formatting that survives, and you usually set it by hand |

Two rows in that table are worth pulling out, because they are the ones that produce a broken document rather than a plainer one. A line break inside a cell has no representation in the syntax — the table is line-based, so a real newline ends the row — and a merged region has no representation either. Everything else degrades. Those two corrupt.

The rectangular rule is the other thing to know. GitHub's specification says the header row sets the column count: a later row with fewer cells gets empty ones added, and a row with more cells has the extra ones ignored. That is a merciful behaviour and a dangerous one, because a row that lost a cell to a stray pipe does not produce an error. It produces a table with a value quietly missing from the end of one line. [Tables are the single most common thing to break on the way across](/blog/markdown-tables-that-survive-conversion), and this is why: the failure mode is a valid table with the wrong contents.

## Quick comparison: the routes from a sheet to a table

| Route | Best for | Keeps | Loses | Install |
| --- | --- | --- | --- | --- |
| Save as CSV UTF-8, then convert | A whole sheet, reliably | Values, accented characters | Formulas, formats, other sheets | None |
| Copy the range, paste into a converter | A selection you can see | Values, in tab-separated form | Formatting, hyperlinks | None |
| Copy the range, paste as HTML | Bold, links, merged structure | Emphasis, `<a href>`, colspan | Depends on the HTML converter | None |
| A formula in a helper column | A table you regenerate often | Whatever you write into it | Number formats, unless you use `TEXT` | None |
| An Office Add-in | Doing it inside Excel, repeatedly | Whatever the add-in implements | Varies; may send the range to a vendor | Add-in, sometimes admin approval |
| A VBA macro | A workbook you control | Exactly what you code | Nothing you did not choose | None, but the file becomes `.xlsm` |
| Office Scripts | Excel on the web, shared automation | Exactly what you code | Needs an eligible Microsoft 365 account | None |
| Google Sheets download | Avoiding Excel's encoding choices | UTF-8 without argument | Same spreadsheet features as any CSV | None |
| LibreOffice Calc export | Explicit control of the text file | Your choice of charset and quoting | Same as any CSV | LibreOffice |
| Retyping it | Five rows and four columns | Your attention | Twenty minutes, at scale | None |

## The routes, one at a time

### Save as CSV, then convert — the route that works

Use `File > Save As`, pick `CSV UTF-8 (Comma delimited) (*.csv)`, accept the two warnings Excel shows, then convert the resulting text file. It is the dullest option and the only one that behaves identically on every machine, every locale and every file size.

| Pros | Cons |
| --- | --- |
| Produces a plain text file any converter can read | Only the active sheet is saved |
| CSV UTF-8 keeps accented and non-Latin characters | Formulas become values, formats become strings |
| The intermediate file is inspectable — open it and look | The BOM at the start trips careless readers |
| Works the same in every version of Excel that offers the format | A locale with a decimal comma changes the delimiter |

**Price:** free. Excel is not, but the export is part of it, and every converter worth using on the far side is free.

**Technical details**

- Excel's save-as list holds several text formats: `CSV`, `UTF8 CSV`, `Macintosh CSV`, `Windows CSV`, `MSDOS CSV` and `Unicode Text`, exposed to macros as `xlCSV`, `xlCSVUTF8`, `xlCSVMac`, `xlCSVWindows`, `xlCSVMSDOS` and `xlUnicodeText` (checked on learn.microsoft.com, 9 September 2026).
- Saving to CSV shows a dialogue "reminding you that only the current worksheet will be saved to the new file", and a second warning that the sheet may contain features the text format does not support (checked on support.microsoft.com, 9 September 2026).
- The field delimiter follows the system list separator, which is changeable in Windows Region settings and in Excel's own separator options (checked on support.microsoft.com, 9 September 2026).
- What lands in the file for a formatted cell is generally the string the cell displays, not the underlying value. That means a cell holding `2.3456` shown to two decimals writes `2.35`, and a date writes in whatever order the cell's format uses. Open the CSV in a text editor once and you will know exactly what your copy of Excel does.

Then convert the CSV. A browser converter's [CSV to Markdown table conversion](/csv-to-markdown) parses the file properly rather than splitting on commas, which matters the moment a cell contains one, and does it locally so the rows are not uploaded — a kept document is capped at 4 MB and conversion itself at 10 MB, which is far more than a table anybody will read. The wider field of command line and library options is covered in [the CSV converter comparison](/blog/best-csv-to-markdown-converters); Pandoc, Miller and `pandas.to_markdown` all read CSV correctly and are the right answer inside a build.

**Who is this for?** Anybody converting a whole sheet, and anybody who will have to do it again next month. The intermediate CSV is the feature: it is a file you can read, diff and check before it becomes a table.

### Copy the range and paste — the fast route

Select the cells, copy, and paste into a converter that accepts pasted text. This is the right route for a range rather than a sheet, and it is quicker than a save-as by about a minute. What makes it work is that Excel does not put CSV on the clipboard.

| Pros | Cons |
| --- | --- |
| No file, no dialogue, no encoding choice | A cell with a line break in it breaks the paste |
| Tab-separated text is easier to split than CSV | Number formats arrive as display strings |
| Handles a selection, not a whole sheet | Formulas and hyperlinks are not in the plain text |
| No install, and nothing written to disk | Only what was selected, so the header is your problem |

**Technical details — what the clipboard actually carries**

| Flavour | Shape | Use it for |
| --- | --- | --- |
| Plain text | Tab-separated, `CRLF` between rows, quoting only where a value contains a tab, newline or quote | Almost every conversion |
| HTML | A real `<table>` with rows, cells, inline styles, `colspan` and `rowspan`, and `<a href>` for links | Keeping emphasis and links |
| Excel's own formats | Binary, for pasting back into a spreadsheet | Nothing, outside Excel |

The plain text flavour is effectively TSV with CSV-style quoting, and that is better news than it sounds. A comma inside a value is harmless because the delimiter is a tab, and tabs are rare inside spreadsheet cells because pressing Tab moves to the next cell. So the pathological case that ruins naive CSV parsing — `Smith, John` in one field — costs nothing here.

The case that does ruin it is a cell containing a line break, typed with Alt+Enter. Excel wraps that value in double quotes and the newline goes onto the clipboard intact, so a tool that splits the pasted text on newlines sees one row become two, and every row after it shifts. Search the sheet for those before you copy: they are usually addresses, notes and product descriptions.

**Who is this for?** Anybody with the workbook open and a specific range in mind. It is the route to reach for when the answer only needs twelve rows out of nine hundred.

### Paste as HTML and convert the HTML — when the formatting matters

If the emphasis and the links matter, do not paste as text. Paste into something that takes the HTML flavour of the clipboard — a rich text field, or an editor that pastes formatted content — and convert that HTML to Markdown instead.

| Pros | Cons |
| --- | --- |
| Bold, italic and hyperlinks survive as Markdown | Excel's clipboard HTML is verbose and full of `mso-` styles |
| Merged cells arrive as real `colspan` and `rowspan` | Which the Markdown table then cannot express anyway |
| Cell borders and alignment are visible to the converter | Most converters ignore both |
| No install if the converter runs in a browser | Two conversions means two chances to lose something |

The trade is honest: you keep the inline formatting and you still lose the structure, because a Markdown table has no way to say that one cell covers three columns. A converter given a `colspan` either drops it and produces a ragged row, or repeats the value, or falls back to emitting a raw HTML table. [Which of those your HTML to Markdown converter does](/blog/best-html-to-markdown-converters) is worth knowing before you paste a merged header into one.

**Who is this for?** Tables where a column holds links, or where emphasis carries meaning — a status column, a list of references.

### Build the row in a formula — the route that stays in the sheet

You can make Excel write the Markdown itself. Put this in a helper column beside a five-column table and fill it down:

```
="| " & TEXTJOIN(" | ", FALSE, A2:E2) & " |"
```

`TEXTJOIN` takes a delimiter, an `ignore_empty` flag and up to 252 text arguments or ranges (checked on support.microsoft.com, 9 September 2026). Pass `FALSE` for `ignore_empty` and mean it: with `TRUE`, a blank cell is skipped rather than emitted, the row comes out one pipe short, and the values after the gap slide one column to the left. That is the single most common way this trick goes wrong.

Two more details. Concatenation ignores the cell's number format, so a date arrives as its serial number and a currency value loses its symbol; wrap those cells in `TEXT(A2, "yyyy-mm-dd")` to control the string yourself. And a value containing a pipe will end a cell early, so run it through `SUBSTITUTE(A2, "|", "\|")` in a preparation column if your data holds file paths or option lists.

The separator row you type by hand, once:

```
| Part | Description | Qty | Price | Status |
| --- | --- | --- | ---: | --- |
```

Then copy the helper column and paste it under those two lines. The clipboard hands the rows over unquoted, because a built row contains no tabs and no newlines.

| Pros | Cons |
| --- | --- |
| The table regenerates when the data changes | You are writing a converter in formulas |
| No install, no upload, no second tool | Escaping and number formats are entirely your problem |
| Works on a filtered or sorted view | Fiddly beyond about six columns |
| `TEXT` gives exact control over dates | Nothing checks your output |

**Who is this for?** A table published from the same sheet every week. The helper column is a build step that lives in the workbook.

### Add-ins, macros and Office Scripts — converting inside Excel

There are three ways to make the conversion a button in Excel rather than a trip to another tool, and they differ mostly in who wrote the code and where it runs.

An **Office Add-in** installed from AppSource runs in a web view inside Excel and reads the workbook through the Office JavaScript API. Judge one on two questions before installing: whether the range is processed locally or sent to the vendor's service, which its privacy statement should say plainly, and whether your tenant permits add-ins at all — in managed Microsoft 365 environments an administrator often has to approve them. Do not assume the marketplace listing implies either.

A **VBA macro** is the version where you own the code. It has no dependency, no network access unless you write one, and no vendor. The costs are real: the workbook has to be saved as `.xlsm` to keep the macro, macros in files that arrived from the internet are blocked by default and have to be unblocked deliberately, and you now maintain an escaping routine that somebody wrote once and nobody tests. Given that a save-as costs ten seconds, a macro is worth it only when the conversion happens on a schedule.

**Office Scripts** is the TypeScript automation built into Excel on the web for eligible Microsoft 365 accounts. It is a better place than VBA for shared, versioned automation and it is not available to every licence, so check before planning around it. **Python in Excel** is a fourth possibility and carries a specific caveat: the Python runs in Microsoft's cloud rather than on your machine, so the data leaves the building even though the file did not.

| Pros | Cons |
| --- | --- |
| One button, inside the application | Somebody has to own the code |
| No file handling, no clipboard | Add-ins may transmit the range; scripts may need a licence |
| Repeatable across a team | The most setup of any route here |

**Who is this for?** Teams converting sheets often enough that the ten seconds matter, and willing to maintain something for it.

### Google Sheets and LibreOffice Calc — the same job with better defaults

If the workbook is not tied to Excel, two other spreadsheets make the text-file step less argumentative.

Google Sheets exports the current sheet with `File > Download > Comma-separated values`, in UTF-8, with no dialogue and no codepage question. The spreadsheet limitations are identical — one sheet, values not formulas, merged cells flattened — but the encoding question does not arise.

LibreOffice Calc goes the other way and asks you everything. Saving as Text CSV opens a dialogue with the character set, the field delimiter, the string delimiter, "Quote all text cells" and "Save cell content as shown" — that last checkbox being the explicit control Excel does not offer, since clearing it writes the underlying values instead of the displayed strings. If you have ever wanted a date exported as `2026-09-03` regardless of the cell's format, that is the switch.

| Pros | Cons |
| --- | --- |
| Sheets: UTF-8 with no decisions to make | Sheets: the file goes through your Google account |
| Calc: explicit charset, quoting and delimiter | Calc: an install, and a dialogue to understand |
| Calc: displayed value or underlying value, your choice | Both: same spreadsheet losses as any CSV route |

**Who is this for?** Anybody already in Sheets, and anybody who has been bitten once by Excel's encoding defaults and wants the choice made visible.

## What Excel does to your values when it writes CSV

This is the section to read twice, because most of it is not reversible and none of it is announced.

| The value | What comes out | Why |
| --- | --- | --- |
| `00417` typed into a General cell | `417` | Coerced to a number when it was typed. The zeros were never in the file |
| A 16-digit card or account number | Digits past the 15th become zeros | Excel has "a maximum precision of 15 significant digits" and "any numbers past the 15th digit are rounded down to zero" (checked on support.microsoft.com, 9 September 2026) |
| A very large number | `1.23E+15` | Scientific notation in the display becomes scientific notation in the text |
| `2.3456` shown to two decimals | `2.35` | The displayed string, not the stored value |
| A date | The cell's display format, in the locale's order | Which is why `03/09/2026` is ambiguous outside the sheet |
| `=B2*C2` | The result | CSV has no formulas |
| A percentage | Usually with the `%` sign | The display again — check your file |
| A value with a thousands separator | Often `1,234.50`, quoted | The comma is in the string, so the field has to be quoted |
| A cell with Alt+Enter in it | A quoted field containing a real newline | Which a line-based reader will mishandle unless it parses CSV properly |
| Text starting with `=`, `+`, `-` or `@` | The same text | Harmless as Markdown; a spreadsheet reopening the CSV may treat it as a formula |

The first two rows are the ones that cost real money. Leading zeros and long identifiers are destroyed at entry, before any export, and the fix is prevention: format the column as Text before pasting the data in, or prefix each value with an apostrophe. Microsoft's own guidance is explicit that these steps "only affect numbers entered after formatting is applied" and will not restore what has already been truncated (checked on support.microsoft.com, 9 September 2026). If a part number column already reads `417`, the sheet no longer knows it was `00417`, and neither will the Markdown.

The date row is the one that causes arguments rather than losses. A CSV carries the string the cell showed, so a British sheet exports `03/09/2026` and an American reader parses it as March. If the table is going anywhere near another country, force ISO dates before you export — a helper column of `TEXT(A2, "yyyy-mm-dd")`, or Calc's "Save cell content as shown" turned off.

## Merged cells have no Markdown equivalent

There is no colspan in a Markdown table. There is no rowspan. The pipe grid is strictly rectangular, one line per row, and the header row fixes the number of columns for the whole table. A merged region cannot be expressed, approximated or hinted at.

What happens on the way out is predictable: the value sits in the top-left cell of the merged region and the other cells in it are empty. So a header spanning `Q1`, `Q2` and `Q3` exports as `2026` followed by two blanks, and the Markdown table gets a first row with one label and two nameless columns.

Four ways out, in the order I would try them:

1. **Unmerge and fill.** Turn off Merge & Centre, then repeat the label across or down. The table becomes uglier in the sheet and correct everywhere else.
2. **Promote the merged label out of the table.** A merged cell spanning a whole table is nearly always a title. Make it a heading above the table, or the table's caption sentence, and delete the row.
3. **Split into two tables.** Two merged groups of columns are usually two tables that were glued together for printing. Publishing them separately is often clearer than the original.
4. **Emit a raw HTML `<table>` instead.** HTML inside Markdown can carry `colspan`, and it renders wherever raw HTML is permitted. It shows as literal markup where it is not, a sanitiser with a tight allow-list may strip it, and you have given up the readable plain-text source that was the reason for Markdown. It is the last resort, not the clever answer.

Note that tables are not in plain CommonMark at all, so the ordinary pipe table is already an extension — one that GitHub Flavored Markdown and most converters implement, and that a strict CommonMark parser renders as a paragraph full of pipes. [Which flavour is doing the rendering](/blog/commonmark-gfm-and-the-flavours) decides whether your table is a table before any of this matters.

## The encoding question: a BOM, an ANSI codepage and a semicolon

Excel's text export has three separate ways to hand you a file that is technically correct and reads as gibberish.

**The BOM.** `CSV UTF-8` writes a byte order mark — the three bytes `EF BB BF` — before the first character. Most readers strip it. The ones that do not put an invisible character on the front of your first header cell, so the column is named `﻿Part` rather than `Part`. It looks right on screen and fails every comparison you make against it. You can see it in a second:

```
head -c 3 orders.csv | xxd
```

If that prints `efbbbf`, there is a BOM. On Windows without a POSIX shell, an editor that shows the encoding in its status bar tells you the same thing.

**The codepage.** Plain `CSV (Comma delimited)` does not write UTF-8. It writes your system's ANSI codepage — Windows-1252 in Western Europe — and any character outside it is replaced, permanently, usually with a question mark. A column of Greek or Japanese names does not survive that save, and no downstream converter can recover it. Even inside the codepage, the file is mojibake to a UTF-8 reader: `£` arrives as `Â£`, a curly apostrophe as `â€™`, an en dash as `â€“`. If you have ever seen `Â` scattered through a converted table, this was the cause.

**The delimiter.** The separator follows the system list separator, so in locales where the decimal separator is a comma, Excel writes semicolons instead. A comma-only reader then sees one enormous single-column table: every row becomes one cell containing all the values. It is an obvious failure once you know it, and baffling the first time. Either change the list separator in Region settings before exporting, or use a converter with an explicit delimiter option.

One more trap worth naming: `Unicode Text (*.txt)` is tab-delimited UTF-16, with its own BOM. A converter expecting UTF-8 sees a null byte between every letter and usually reports the file as binary.

The practical rule is short. Choose `CSV UTF-8`, check the first three bytes once for the machine you export from, and if the delimiter is a semicolon, know that it is a locale setting rather than a bug.

## Where the reliable route fails, and what it costs

Save-as-CSV is the right default and it has five costs worth stating plainly.

**One sheet at a time.** Excel saves the active worksheet and warns you it is doing so. A twelve-tab workbook is twelve exports, twelve conversions and twelve tables, and there is no combined output because CSV has no concept of a second sheet. If the tabs are one dataset split by month, consolidate inside Excel before exporting.

**The formulas are gone, and so is the source of truth.** A published table of values is fine until somebody asks where a number came from. The workbook still knows; the Markdown does not. For a table you regenerate, keep the sheet as the source and the Markdown as an artefact — never edit the table and expect the sheet to agree.

**The meaning that lived in the formatting.** Conditional formatting, fills and font colours carry information in a great many real spreadsheets: red for overdue, grey for superseded, bold for a total. All of it is dropped, and the reader of the Markdown cannot tell. The fix is to move the meaning into data — add a `Status` column, mark totals with a word rather than a weight — which is work the converter cannot do for you.

**What the filter was hiding.** If you left an autofilter or hidden columns in place, check the exported file against what you saw on screen rather than assuming; the safe habit is to copy the visible range instead of exporting the whole sheet when a filter is in play.

**The width nobody will read.** A forty-column table is legal Markdown and unreadable output: it either scrolls sideways or wraps into pulp, and the raw text becomes impossible to edit by hand. This is a design failure rather than a conversion failure, and the answers are to cut columns, transpose a small table so the fields run down the side, or accept that some data wants to stay a spreadsheet and link to the file instead.

There is a sixth cost that is not about data. Somebody has to check the result. Convert the sheet, then read the first row, the last row, one row with an accented character and one row with a long number. That is four checks and about thirty seconds, and it catches nearly everything on this page.

## How to choose

1. **Start from how often you will do this.** Once, and save-as-CSV is finished before you have finished reading an add-in's privacy statement. Weekly, and a helper column or a script pays for itself in a month.
2. **Decide whether you need a range or a sheet.** A selection wants the clipboard; a sheet wants a file. Using the file route for twelve rows means exporting nine hundred and deleting most of them.
3. **Look for merged cells and Alt+Enter line breaks before converting, not after.** They are the only two spreadsheet features that produce a broken table rather than a plainer one, and both take a minute to fix in the sheet and much longer to debug in the output.
4. **Pick the encoding deliberately if the data is not plain ASCII.** `CSV UTF-8` for anything with an accent, a currency symbol or a non-Latin script. The plain CSV option loses those characters at the moment of saving, and nothing later can put them back.
5. **Ask where the rows go.** For a table of open-source licences it does not matter. For payroll, patient data or unreleased numbers it is the whole question, and a converter that runs in your browser lets you verify the answer by watching the network panel do nothing.

## Conclusion

The honest summary of Excel to Markdown is that the conversion is easy and the spreadsheet is hard. Save the sheet as CSV UTF-8, convert the CSV, and spend the saved time checking the three things that break: identifiers whose leading zeros went missing when they were typed, dates whose order depends on the reader, and merged cells that Markdown cannot express and will quietly flatten. For a selected range, paste it instead — the clipboard's tab-separated flavour is genuinely easier to parse than any CSV, and transformpipe converts pasted rows the same way it converts a file, in the browser, with nothing uploaded when you are signed out. Either way, read the first and last rows of the result before you publish it. The tool cannot know that `417` used to be `00417`, and you can.

## FAQ

### How do I convert an Excel file to a Markdown table?

Save the sheet as `CSV UTF-8 (Comma delimited)` and convert that CSV with any converter that parses CSV properly rather than splitting on commas. For part of a sheet rather than all of it, copy the range and paste it into a converter that accepts pasted text — Excel puts a tab-separated version of the cells on the clipboard, which is easier to parse than CSV.

### Can I paste from Excel straight into a Markdown file?

Not usefully. What lands in a plain text editor is tab-separated values with no pipes and no separator row, so it renders as a block of text rather than a table. Paste it into a converter, or build the rows in the sheet with `TEXTJOIN` and paste the finished Markdown.

### Why did my leading zeros disappear?

Because Excel converted the value to a number when it was typed, long before any export — `00417` became the number 417 and the file never contained the zeros. Format the column as Text before entering or pasting the data, or prefix each value with an apostrophe; neither will restore values that were already coerced.

### Why does my exported CSV use semicolons instead of commas?

Because the delimiter follows your system's list separator, and in locales that use a comma as the decimal separator that setting is a semicolon. Change the list separator in Windows Region settings before exporting, or use a converter that lets you specify the delimiter. A comma-only reader turns the whole file into a single column.

### What happens to merged cells?

They are flattened: the value goes to the top-left cell of the merged region and the rest come out empty. Markdown tables have no colspan or rowspan, so the only fixes are to unmerge and repeat the label, promote a merged header out of the table into a heading, split the table in two, or fall back to a raw HTML table.

### Does converting a spreadsheet mean uploading it?

Only if the tool works that way, and many do. A converter that runs in the browser reads the file on your own machine, which you can confirm by opening the network panel and watching nothing leave — worth doing once for any tool you plan to feed real data to, since spreadsheets tend to hold the most sensitive rows anybody converts.

### Can I keep bold text and hyperlinks from the sheet?

Only via the clipboard's HTML flavour, which carries `<a href>` links and inline styles, and then only if you convert that HTML to Markdown rather than pasting as plain text. The plain text flavour has values and nothing else, and a CSV export has no formatting at all.
