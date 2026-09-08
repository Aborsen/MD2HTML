---
title: "Best JSON to Markdown Converters in 2026: Compared and Tested"
description: Compare the ways to turn JSON into readable Markdown — jq, jtbl, Miller, pandas and the browser — by the shapes each handles and the decisions it makes for you
date: 2026-09-08
tag: Converting
keywords: json to markdown converter, convert json to markdown table, json to markdown table online, jq json to markdown, json lines to markdown, nested json to markdown, json to markdown python, json to markdown cli
---

JSON has no headings. It has no paragraphs either, no bold, no tables and no lists in the sense Markdown means the word. It has objects, arrays, strings, numbers, booleans and null, and that is the whole vocabulary. Markdown has headings, paragraphs, lists, tables and code blocks. Nothing in either specification says which of the first set becomes which of the second, so every JSON to Markdown converter has invented an answer, and the answers differ. That is the real difference between the tools on this page — not speed, not licence, but what each one decided your data should look like.

### TL;DR

Pick by the shape of your file, not by the tool's feature list. An **array of flat objects** — the shape most API responses and exports have — is the only shape a Markdown table is honest about, and almost everything here will table it. **Nested objects** are where tools diverge: some flatten keys into dotted column names, some turn each level into a heading until they run out of heading levels, some give up and print JSON. **JSON Lines** — one record per line, which is what a log export usually is — is not valid JSON, so half these tools reject the file outright. A browser converter makes the shape decisions for you and tells you what they are; jq, Miller and jtbl let you make them yourself on the command line; pandas is the answer inside a Python script.

## Why "it converts JSON" tells you almost nothing

Converting Markdown to HTML is a translation between two document formats that broadly agree about what a document is. Converting JSON to Markdown is not a translation at all. It is an interpretation, and the tool is guessing at intent. `{"name": "Ada", "roles": ["admin", "billing"]}` could reasonably be a heading called Name with a paragraph under it, a bold label and a value, a two-row table, a bullet list, or a definition list. A reasonable person would pick differently depending on whether that object is one record among thousands or the whole file.

So the first thing to establish about any tool here is which shapes it recognises and what it does with each one. There are only four questions that matter. What happens to an array of objects? What happens to an array of plain values? What happens to nesting, and how deep does the tool follow it before it stops? And what happens to a file that is not one JSON value at all?

The answers are rarely on the tool's front page, and they are the entire product. A converter that turns every object into a two-column key-value table will render a 900-record export as 900 tiny tables. A converter that only tables the top-level array will silently stringify a nested object into a cell, so one column of your otherwise readable table contains `{"city":"Leeds","postcode":"LS1 1AA"}` in a monospace-free proportional font. Both tools "convert JSON to Markdown". Neither result is what you asked for.

The second thing to establish is where the file goes. JSON exports are disproportionately likely to contain things you would not paste into a stranger's text box: user records, order histories, API responses with tokens in them, a database dump somebody sent you to look at. A converter that runs in your browser or on your own machine keeps that question from arising. A hosted one does not, and the honest version of that trade-off is that it depends entirely on the file.

## Quick comparison: the cheat sheet

| Tool | Best for | Key capability | Price |
| --- | --- | --- | --- |
| transformpipe | Reading a JSON file as a document | Tables, sections and lists chosen by shape, in the browser, nothing uploaded | Free |
| jq | Deciding the shape yourself | Filters and reshapes JSON; you write the Markdown | Free, MIT |
| jtbl | A table in a terminal, JSON Lines included | Reads stdin, `-m` prints a Markdown table | Free, MIT |
| Miller (`mlr`) | Large files and format shuffling | Reads JSON and JSON Lines, `--omd` writes Markdown | Free, BSD 2-clause |
| json2md | Building a document, not converting one | An instruction format that emits headings, lists, tables, code | Free, MIT |
| pandas + tabulate | Inside a Python script | `read_json`, `json_normalize`, `to_markdown` | Free, BSD 3-clause |
| VS Code extensions | The file already being open | Local conversion in the editor; quality varies by extension | Free |
| TableConvert | A paste-in table in a browser tab | JSON array to Markdown table with a live preview | Free (checked on tableconvert.com, 8 September 2026) |
| A hand-written script | A shape that is yours and stable | Exactly the mapping you want, and no other | Free |
| An assistant | A one-off you are going to read | Understands intent; will also quietly drop rows | Varies |
| Pandoc | Not this job | Its `json` reader is pandoc's own AST, not your data | Free, GPL |

## The best JSON to Markdown converters in 2026

### transformpipe — best for reading a JSON file as a document

It converts a `.json` file to Markdown in your browser and picks a rendering per shape rather than applying one rule to everything. There is no install and no account required, and signed out the file is never sent anywhere: it is read, parsed and rendered on your own machine.

| Pros | Cons |
| --- | --- |
| The shape rules are fixed and stated, so the output is predictable | The rules are the tool's, not yours: no template language |
| Reads JSON Lines as well as JSON, without being asked | One document at a time rather than a directory |
| Nothing is uploaded when you are signed out | The browser does the work, so a very large file is limited by the machine |
| Also converts Markdown to HTML, and HTML, Word and CSV back to Markdown | |

**Price:** free. An account adds history, sharing and an API, also free.

**Technical details and features**

- An array of objects whose values are all scalars becomes a table, with the keys as columns — collected across every row in first-seen order, so a field that only appears in the fortieth record still gets a column
- An array of plain values becomes a bullet list; an array of unlike things becomes a numbered section each
- An object puts its scalar keys first as bold labels, then gives each nested key its own heading, so the shallow facts are readable before the deep ones start
- Past three levels down, a value is printed as a fenced `json` block rather than a heading, because a heading at depth seven is not a heading
- `null` is written as an italic `null` rather than skipped, and an empty array says so, because absent and empty are facts about the data
- Keys are titled for display: `created_at` and `createdAt` both come out as "Created at"
- The same conversion is available from a REST API, a dependency-free CLI, a GitHub Action and an MCP server

**Who should use it?** Anybody whose next step is "read this" or "send this to somebody". An API response, an export from an admin panel, a log file somebody attached to a ticket — the cases where you want the data legible in a minute and do not want to write a script or think about the shape at all.

### jq — best for deciding the shape yourself

jq is a command line JSON processor written in portable C with no runtime dependencies. It has no Markdown output and is still the tool most people end up using, because the hard part of this job is not printing pipes — it is selecting the right records and flattening them into rows first.

| Pros | Cons |
| --- | --- |
| Reshapes any JSON into any other JSON, which is the actual problem | No Markdown output: you build the rows yourself |
| Installed everywhere, no runtime, one binary | Its own language, and a real learning curve |
| Composes with every other tool through a pipe | A long filter in a shell script is write-only code |
| Handles JSON Lines naturally, one value at a time | Getting the header row and separator right is manual |

**Price:** free, MIT licensed.

**Technical details and features**

- A filter language over JSON: selection, mapping, grouping, sorting and arithmetic
- `@tsv` and `@csv` produce delimited output, which you can then feed to a CSV to Markdown step rather than assembling a table by hand
- String interpolation lets you emit Markdown directly — `"| \(.name) | \(.email) |"` per record — with the header and separator lines written by you
- `--slurp` collects a stream of values into one array, which is how you make a JSON Lines file act like a JSON one
- `-r` prints raw strings instead of quoted JSON, which is the flag people forget and then wonder why every cell has quotes around it

**Who should use it?** Anybody who already knows jq, and anybody whose file needs filtering before it needs formatting. If the answer involves "only the failed requests, grouped by day", you need jq or something like it before any converter is relevant. It fits the same place in a pipeline as [a Markdown to HTML step on the command line](/blog/markdown-to-html-from-the-command-line): one stage that does one thing to text.

### jtbl — best for a table in a terminal, JSON Lines included

jtbl is a small Python command line tool that reads JSON from standard input and prints it as a table. Its default output is a terminal table, and `-m` makes that table Markdown.

| Pros | Cons |
| --- | --- |
| Reads a JSON array of objects or JSON Lines, no flag needed | Tables only: it has no other rendering |
| `-m` for Markdown, `-c` for CSV, `-H` for HTML | Nested values have to be flattened before it sees them |
| Designed for pipes, so jq goes in front of it | A Python install, so not always available on a server |

**Price:** free, MIT licensed.

**Technical details and features**

- Input is piped JSON on stdin: either a JSON array of objects or JSON Lines
- Output formats are selected by flag: text table by default, Markdown, CSV, HTML or a fancier box-drawn table
- Intended to sit at the end of a `jq` pipeline, which is exactly where the division of labour makes sense — jq decides the rows, jtbl prints them

**Who should use it?** People who work in a terminal and want the table now. It is the shortest honest path from a JSON Lines log to a Markdown table you can paste into a ticket.

### Miller (`mlr`) — best for large files and format shuffling

Miller is a command line data processor written in Go with no runtime dependencies. It reads CSV, TSV, JSON and JSON Lines, and it writes Markdown, which makes it the rare tool where this conversion is a built-in output format rather than something you assemble.

| Pros | Cons |
| --- | --- |
| Markdown is a first-class output format (`--omd`) | Its own verb-and-flag vocabulary to learn |
| Reads JSON Lines directly (`--ijsonl`), no slurping | Record-oriented: deeply nested JSON needs flattening first |
| Streams, so file size is not a memory problem | An install, and a terminal |
| One tool for filtering, sorting, cutting and printing | Not interactive: no preview, no undo |

**Price:** free, BSD 2-clause licensed.

**Technical details and features**

- Input formats include JSON, JSON Lines, CSV, TSV and positionally-indexed data; `--ijson` and `--ijsonl` name which you have
- `--omd` writes Markdown output; `--omd-aligned` pads the columns to a uniform width so the raw file is readable too
- Since Miller 6.11.0, Markdown is supported as an input format as well as an output one (checked on miller.readthedocs.io, 8 September 2026)
- Verbs like `cut`, `filter`, `sort` and `head` run before the writer, so you can narrow a large export to the columns worth tabling in the same command

**Who should use it?** Anybody with a file too big to open, a JSON Lines export, or a habit of converting between CSV and JSON already. If you are going to install one command line tool for this, install this one.

### json2md — best for building a document, not converting one

json2md is a JavaScript library that turns a specific JSON structure into Markdown. The distinction matters more than anything else on this page: it does not read your JSON. It reads a JSON description of a Markdown document, in its own shape, and prints that document.

| Pros | Cons |
| --- | --- |
| Emits real document structure: headings, paragraphs, lists, tables, code, links | Your data has to be transformed into its input shape first |
| A small dependency in a Node project | Not a converter for arbitrary JSON, despite the name |
| Extensible with your own converters for new block types | JavaScript only |

**Price:** free, MIT licensed.

**Technical details and features**

- Installed from npm and used as a function in Node or a bundle
- Its documented block types cover `h1` through `h6`, paragraphs, blockquotes, images, ordered and unordered lists, code blocks, tables, links and horizontal rules
- The input is an array of one-key objects — a heading, then a paragraph, then a table — so the mapping from your data to a document is code you write, and the library handles the escaping and layout

**Who should use it?** Developers generating a Markdown document from data in a Node service: a nightly report, a changelog, a summary emailed to a team. It is the wrong tool for looking at a JSON file you were sent, and the right one for producing a document from records you understand.

### pandas plus tabulate — best inside a Python script

pandas reads JSON into a DataFrame and writes Markdown out of one. `read_json` handles the parse, `json_normalize` flattens nesting into columns, and `to_markdown` prints the table.

| Pros | Cons |
| --- | --- |
| Flattening, filtering, sorting and typing all in one library | A heavy dependency for one table |
| `json_normalize` handles nesting predictably | Flattening multiplies columns fast |
| Already installed in most data work | Tables only: a DataFrame is not a document |

**Price:** free. pandas is BSD 3-clause licensed; `tabulate`, which `to_markdown` requires, is MIT.

**Technical details and features**

- `pandas.read_json` for a JSON array of records; `lines=True` for JSON Lines
- `pandas.json_normalize` flattens nested keys into dotted column names, so a record with an `address` object becomes `address.city` and `address.postcode` columns
- `DataFrame.to_markdown()` requires the `tabulate` package and returns the table as a string
- The index is included by default, which is why the first column of your table is an unnamed run of `0`, `1`, `2` until you pass `index=False`
- `tablefmt` is passed through to tabulate, where `github` is the GFM-style pipe table and `pipe` adds alignment colons

**Who should use it?** Anybody already in a Python script or a notebook. If the JSON needs any real analysis before it becomes a table, this is where you were going anyway — and the same reasoning that makes [Python a sensible place to do the Markdown to HTML step](/blog/markdown-to-html-in-python) applies here.

### VS Code extensions — best if the file is already open

The Marketplace has extensions that convert a JSON selection to a Markdown table, and if the file is already in your editor this is the shortest path there is. It is also the option where you have to look at the extension rather than the category.

| Pros | Cons |
| --- | --- |
| No new tool, no terminal, no upload | Quality and maintenance vary enormously |
| Works on a selection, so you can convert part of a file | Most handle a flat array and nothing else |
| Conversion happens locally in the editor | An abandoned extension is a silent liability |

**Price:** free.

**Technical details and features**

- Extensions run in the editor process, so a local extension converts locally — but check, because some call a hosted service
- Most implementations take an array of objects and produce a pipe table; nesting, `null` handling and pipe escaping are where they differ
- VS Code's own JSON support — formatting, folding, schema validation — is separate and does not produce Markdown

**Who should use it?** Developers converting a fragment in passing. Check what the extension does with a nested object and a value containing a pipe character before you trust it with anything you will send onward.

### TableConvert — best for a paste-in table in a browser tab

TableConvert is an online table converter with a page for JSON to Markdown: paste a JSON array, get a Markdown table, edit it in a grid if you want to.

| Pros | Cons |
| --- | --- |
| Paste and go, with a live preview | Tables only, from an array of objects |
| Its page states conversion happens locally in the browser | Nesting and JSON Lines are not its job |
| An editable grid between input and output | One of many similar sites, which vary in what they do with your data |

**Price:** free, with no registration required (checked on tableconvert.com, 8 September 2026).

**Technical details and features**

- Input is a pasted JSON array, an uploaded file, or a table extracted from a page
- Output formats include Markdown alongside the other table formats the site handles
- The intermediate grid lets you rename a column or delete a row before you take the Markdown

**Who should use it?** Anybody with a flat array in the clipboard and a table-shaped hole to fill. For a whole file, or a file with structure, a converter that reads shapes other than "array of objects" will save you the reshaping.

### A hand-written script — best when the shape is yours and will not change

Thirty lines in the language you already use, mapping your JSON to your Markdown. Everybody who does this conversion more than twice ends up here, and for a stable internal shape it is the right answer.

| Pros | Cons |
| --- | --- |
| Exactly the mapping you want, and nothing else | You now own the edge cases |
| No dependency, in most languages | Rewritten when the shape changes |
| Fits your build, your CI, your naming | Nobody else on the team knows the rules |

**Price:** free, and costs an afternoon.

**Technical details and features**

- Every mainstream language parses JSON in its standard library, so the parse is not the work
- The work is the four decisions: table, list, section, or fenced fallback — plus escaping
- Escape pipes and backslashes in cells, and replace newlines inside a cell with `<br>`, because a Markdown table row cannot contain a line break
- Decide what `null`, `""`, `0`, `false` and a missing key each look like, and write it down, because a reader cannot tell them apart from an empty cell

**Who should use it?** Teams with one recurring export and a strong opinion about how it should read. Not the person who has one file today.

### An assistant — best for a one-off you are going to read

Pasting JSON into an assistant and asking for a Markdown table works, understands intent better than any rule does, and is the least trustworthy option here for anything you will not check.

| Pros | Cons |
| --- | --- |
| Infers what the data means, not just its shape | Rows go missing and nobody tells you |
| Handles messy and inconsistent records gracefully | Values get tidied, reordered and reformatted |
| No install, no code | Your data goes to a service unless the model is local |

**Price:** varies by service and plan; check the vendor's own page.

**Technical details and features**

- Best used on data you can eyeball: if you cannot count the rows in the output, you cannot verify it
- A deterministic converter and an assistant disagree in a useful way — run both on the same file and the diff shows you which cells were "helpfully" changed
- An MCP server puts a deterministic conversion inside the assistant, which is the version worth having: the model decides what to convert, the converter decides what the output is
- The output is Markdown, which still has to become something a person can open — [getting assistant output onto a shareable page](/blog/ai-output-to-a-shareable-page) is its own step

**Who should use it?** Anybody with an awkward one-off and the patience to check it. Nobody with a report that goes to a customer.

### Pandoc — the tool that does not do this

Pandoc converts between around forty document formats and this is not one of them. Its `json` input format is "JSON version of native AST" — pandoc's own document tree serialised as JSON, not your data. Feeding it an API response produces an error, not a document.

**Who should use it?** Nobody, for this conversion. Pandoc is the right answer for [Markdown to HTML and the formats around it](/blog/best-markdown-to-html-converters), and the wrong place to look for JSON.

## What the comparison tables leave out

Every tool above will produce Markdown from JSON. What decides whether the result is readable is a set of decisions none of them advertises.

**The array of flat objects is the only shape a table is honest about.** A table has one row per record and one column per field, so it needs records with the same fields and values that are single things. That is what an API response, a CSV converted to JSON and a database export usually look like, which is why every tool here handles it and why so many stop there. The moment a value is itself an object or an array, the table has to lie: either the cell contains a stringified fragment of JSON, or the column count explodes, or the nested data is dropped. There is no fourth option. A tool that flattens — pandas with `json_normalize`, most of the CLI tools with an explicit flatten step — chooses column explosion, and a record with three nested objects can turn into a thirty-column table nobody can read. A tool that refuses to table a record with nested values chooses sections instead, which is longer and legible.

**Arrays of plain values are lists, and treating them as tables is the classic mistake.** `["admin", "billing", "read-only"]` is a bullet list. Rendered as a table it becomes a one-column table with a meaningless header, which is worse than the raw JSON. Rendered as a comma-joined string inside somebody else's cell, it is fine right up to the point where one of the values contains a comma.

**Nesting has to stop becoming headings somewhere, and the tool picks where.** Markdown has six heading levels. JSON has as many as it likes. A converter that maps depth to heading level runs out at six and then either clamps everything deeper to `######`, which flattens real structure into apparent siblings, or keeps generating deeper markup that no renderer displays differently. The alternative is to stop earlier and print the remaining subtree as a fenced code block, which admits defeat honestly: the structure is visible, indented, and clearly a data dump rather than prose. The browser converter above stops at three levels for exactly this reason. Whatever your tool does, find out, because a document whose headings bottom out at depth six has a table of contents that means nothing.

**Null, empty, missing and false are four different facts and one empty cell.** A converter that skips `null` produces a cell indistinguishable from a missing key, which is indistinguishable from an empty string. In an export of orders, "no discount applied" and "discount field not present in this record" are different things, and a reader looking at two blank cells cannot recover which is which. This is the failure mode that makes a converted table subtly wrong rather than obviously broken, and it is worth checking on a file you know before you trust one you do not.

**JSON Lines is not valid JSON, and it is what a log export usually is.** The JSON Lines format is one JSON value per line, UTF-8, newline-terminated. Each line parses; the file as a whole does not, because a sequence of values without a wrapping array is not a JSON document. So `JSON.parse` and `json.loads` both fail on a perfectly good `.jsonl` file, and any converter that calls one of them without a fallback rejects the file with a syntax error that points at line 2. Tools differ sharply here: Miller and jtbl read JSON Lines natively, pandas needs `lines=True`, jq wants `--slurp` to make it an array, and a browser converter that falls back to line-by-line parsing reads the file without being told. If your data comes out of a log pipeline, a message queue or `docker logs`, this is the first thing to test and the one most likely to stop you.

**Pipes, backslashes and newlines inside values break the table you just got.** A pipe character ends a cell in a Markdown table wherever it appears, so a value like `error | retrying` splits one cell into two and shifts the rest of the row. A newline inside a value cannot be expressed in a table row at all — the only way through is `<br>`, which is HTML in your Markdown. Any converter that builds tables by joining strings without escaping will produce a table that renders wrong for exactly the rows containing the interesting data, which is a specific case of the general problem with [tables surviving a conversion](/blog/markdown-tables-that-survive-conversion).

**Key order is the only order you have, and it is not meaningful.** JSON objects have no defined key order in the specification, though every practical implementation preserves the order in the file. Converters therefore emit columns in the order they first see the keys, which means your table's column order is an accident of whoever wrote the serialiser. Worse, if later records carry a field the first record lacked, a converter that reads only the first object for its header silently drops that column for every row. Collecting keys across all records is the correct behaviour and not the universal one.

**Numbers, dates and identifiers stop being themselves.** Markdown has no types. A long integer stays legible; a float like `0.30000000000000004` arrives exactly as JSON stored it; an ISO timestamp stays an ISO timestamp unless the tool decides to prettify it. A leading zero in a product code survives if it was a string and is gone if it was a number. None of this is the converter's fault and all of it lands in your document, so a converted table is a snapshot for reading, not a data interchange format. If somebody is going to compute on it, send them the JSON.

## How to choose

1. **Look at your file before you look at tools.** Open it and answer one question: is this an array of flat records, or is it a nested document? If it is the first, almost anything here works and you should pick on convenience. If it is the second, most of these tools will produce something unreadable and you need one that renders sections rather than one that renders tables.
2. **Test the JSON Lines case if there is any chance of it.** A `.json` file from an application is usually one value; a `.json` or `.jsonl` file from a log, a queue or a bulk export is usually one value per line. Converting the wrong assumption gives you a parse error at best and the first record only at worst.
3. **Decide whether the output is for reading or for processing.** A Markdown table is a document. If the next step is a spreadsheet or a script, convert to CSV instead and skip the round trip — you will lose types either way, and CSV at least admits it.
4. **Count the installs against the number of times you will do this.** One file today does not justify a package manager. A nightly report does not justify a browser tab and a person in it. Getting this backwards is how a team ends up with an undocumented conversion step that only runs on one laptop.
5. **Check what happened to the awkward rows, not the first three.** Find a record with a null, a nested object, a value containing a pipe, and a field the other records do not have. Convert it and read the output. Every failure described on this page shows up in that one test, and it takes two minutes.

## Conclusion

There is no correct way to turn JSON into Markdown, which means the best JSON to Markdown converter is the one whose decisions match the file in front of you. For an array of flat records, pick on convenience: a browser tab, a terminal pipe, or three lines of pandas. For a nested document you actually need to read, pick a tool that renders sections and lists rather than forcing everything into a table, and check where it stops turning depth into headings. That is what [transformpipe's JSON to Markdown conversion](/json-to-markdown) does in the browser, free, with the rules fixed and nothing uploaded when you are signed out. For anything recurring, Miller or a jq pipeline in a script will outlive whatever you build by hand.

## FAQ

### What is the best free JSON to Markdown converter?

For a file you want to read now, a browser-side converter is the best free option: no install, no upload, and it handles shapes other than a flat array. On the command line, Miller and jtbl are both free and open source and both write Markdown tables directly.

### How do I convert JSON to a Markdown table?

If your JSON is an array of objects with scalar values, any tool here will do it: paste it into a browser converter, pipe it through `jtbl -m`, run `mlr --ijson --omd cat`, or call `to_markdown()` on a pandas DataFrame. If the objects contain nested objects or arrays, flatten them first or accept that the table will contain stringified JSON in some cells.

### Can I convert nested JSON to Markdown?

Yes, but not into a table. Nested JSON converts sensibly into headings and sections, with each level of nesting becoming a level of heading until the converter runs out — six is the limit Markdown gives it, and most tools stop earlier and print the remaining depth as a fenced code block. Check where your converter draws that line before you convert a deeply nested file.

### Why does my JSON file fail to convert?

Most often because it is JSON Lines rather than JSON: one valid JSON value per line, which the file as a whole is not. A parser given that file fails on the second line. Either tell your tool it is line-delimited — `lines=True` in pandas, `--ijsonl` in Miller, `--slurp` in jq — or use a converter that falls back to line-by-line parsing on its own.

### Does converting JSON to Markdown lose data?

It loses types, and it can lose distinctions. Markdown has no notion of a number, a date or a null, so everything becomes text, and a converter that renders `null` as an empty cell has made it indistinguishable from a missing field or an empty string. Treat the Markdown as something to read and keep the JSON as the record.

### Can Pandoc convert JSON to Markdown?

No, not your JSON. Pandoc's `json` input format is its own document AST serialised as JSON, so it reads only files pandoc itself produced. It is the right tool for converting between document formats and the wrong one for data.

### Should I use jq or a converter?

Both, usually. jq is for choosing and reshaping the records — filtering, grouping, flattening, selecting columns — and a converter is for printing them. A jq filter that also assembles Markdown by hand works and becomes unmaintainable quickly, so leave the pipes and the escaping to something whose job that is.
