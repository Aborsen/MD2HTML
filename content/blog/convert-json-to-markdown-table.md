---
title: "JSON to Markdown Table: What Converts Cleanly and What Does Not"
description: Turning JSON into a Markdown table: the one shape that works, what to do with nesting, missing keys and JSON Lines, and when sections beat a table
date: 2026-09-02
tag: Converting
keywords: json to markdown table, convert json to markdown table, json array to markdown table, nested json to markdown table, json lines to markdown table, jq flatten json, json to table online
---

### TL;DR

A Markdown table is honest about exactly one JSON shape: an array of objects whose values are all scalars, with the same keys in every record. Feed it that and any converter will do the right thing. Feed it anything else — a nested object, an array inside a field, records with different keys — and the tool has to choose between stringifying JSON into a cell, exploding the column count, or dropping data, and it will not tell you which it picked. Flatten deliberately before you convert, usually with `jq` or `mlr`, or accept that the honest rendering is sections rather than a table.

You have a JSON file and you want a table. The instinct is right: a table is the densest readable form for records, and a Markdown table survives being pasted into a pull request, a ticket, a wiki page and an email in a way that a code block of JSON does not. Somebody can scan a table. Nobody scans four hundred lines of pretty-printed JSON.

The problem is that JSON's data model and a table's data model are not the same shape, and only sometimes overlap. A table is a rectangle: fixed columns, one row per record, one value per cell. JSON is a tree, of any depth, with no requirement that sibling objects agree about anything. Whenever the tree is not already a rectangle, converting it into one throws something away — and which thing gets thrown away is a decision your converter makes silently, in the two seconds between you dropping the file and reading the output.

So the useful question is not "which tool converts JSON to a Markdown table". Almost all of them do, and [the comparison between them is a separate piece](/blog/best-json-to-markdown-converters). The useful question is what shape your file is, what a table does to that shape, and what you should do to the file first. That is what follows, case by case, with the commands.

## Why a Markdown table is a promise about the data

When you hand somebody a table, you are asserting three things without saying them out loud. Every row is the same kind of thing. Every column means the same thing in every row. And every cell holds one value.

JSON guarantees none of the three. An array can hold a string, an object and another array side by side. Two objects in the same array can share no keys at all. A single field can hold an object with twelve keys under it. When any of that is true and you render a table anyway, the table is still a table — it lines up, it has a header row, it looks finished — and it is now making assertions the data does not support. That is worse than an obviously broken output, because nobody checks a table that renders.

Here is the shape of the failure in one example. Take a record like this:

```json
{
  "id": 4102,
  "customer": { "name": "Ada Okonjo", "email": "ada@example.com" },
  "items": ["SKU-11", "SKU-40"],
  "discount": null,
  "note": "call before delivery | after 4pm"
}
```

Every naive tabling of that record is wrong in a different way. Put `customer` in a cell and the cell contains `{"name":"Ada Okonjo","email":"ada@example.com"}`, which is JSON pretending to be prose. Flatten it and you gain two columns, `customer.name` and `customer.email`, which is correct and starts the column count climbing. Put `items` in a cell and you have joined a list with commas, which is fine until an item contains a comma. Leave `discount` blank and the reader cannot tell "no discount" from "field absent". And `note` contains a pipe, which in a Markdown table ends the cell — so that row now has one more column than the header, and the renderer will either drop the overflow or shift everything after it.

One record. Five distinct ways for a table to be quietly untrue. Multiply by the number of records and you have a document that looks authoritative and is not.

## Quick reference: which JSON shape becomes which Markdown

This is the cheat sheet. Find your file's top-level shape in the first column and the rendering that does not lie in the fourth.

| JSON shape | Looks like | Tables cleanly? | Honest rendering | Do this first |
| --- | --- | --- | --- | --- |
| Array of flat objects, same keys | `[{"id":1,"name":"a"},{"id":2,"name":"b"}]` | Yes | Table: keys as columns, one row per object | Nothing |
| Array of flat objects, differing keys | `[{"id":1},{"id":2,"tier":"pro"}]` | Yes, with gaps | Table with a union of all keys, blanks marked | Collect keys across every record, not just the first |
| Array of objects with a nested object | `[{"id":1,"user":{"name":"a"}}]` | No | Table over flattened `user.name` columns | Flatten with `jq`, `mlr flatten`, or `json_normalize` |
| Array of objects with an array field | `[{"id":1,"tags":["x","y"]}]` | No | Table plus a joined cell, or one row per tag | Decide: join into a cell, or explode into rows |
| Array of plain values | `["admin","billing"]` | No | Bullet list | Nothing — do not table it |
| Array of arrays | `[["a",1],["b",2]]` | Yes, headerless | Table with invented or first-row headers | Decide whether row one is data or a header |
| Array of unlike things | `[1,"two",{"three":3}]` | No | A numbered section each | Split by type, or render as sections |
| Single flat object | `{"name":"a","tier":"pro"}` | Only as key/value | Two-column table, or bold labels | Nothing, but consider a definition list instead |
| Single deeply nested object | a config file, an API envelope | No | Headings per level, code block past depth three | Find the array inside it and table that |
| Object of objects, keyed by id | `{"u1":{...},"u2":{...}}` | Yes, after a step | Table with the key as its own first column | `to_entries` to turn keys into a field |
| JSON Lines | one JSON value per line | Yes, if parsed as lines | Table, once the file is read correctly | Tell the tool it is line-delimited |
| Number, string, boolean at the top level | `42` | No | A sentence | Nothing to convert |

Two things to notice. Only three rows in that table say "yes" without qualification, and the two most common real-world shapes — nested objects and array fields — are not among them. And the last column is where the work is: the difference between a good and a bad Markdown table is almost always something you did to the JSON before conversion, not the converter you picked.

## The shape a table is honest about

An array of objects, every value a scalar, the same keys in every record. This is the shape a paginated API endpoint returns, the shape a CSV becomes when somebody converts it to JSON, and the shape a `SELECT` with no joins produces.

```json
[
  { "sku": "SKU-11", "name": "Wide flange", "price": 12.5, "stock": 40 },
  { "sku": "SKU-40", "name": "Narrow flange", "price": 9.0, "stock": 0 },
  { "sku": "SKU-72", "name": "Bracket", "price": 3.25, "stock": 118 }
]
```

That converts to this, and every tool agrees:

```markdown
| sku | name | price | stock |
| --- | --- | --- | --- |
| SKU-11 | Wide flange | 12.5 | 40 |
| SKU-40 | Narrow flange | 9 | 0 |
| SKU-72 | Bracket | 3.25 | 118 |
```

Note `9.0` came out as `9`. JSON numbers have no notion of significant figures, so a serialiser that reads the file into a number type and writes it back out gives you the shortest representation. If those are prices in a document somebody will read, that is a cosmetic annoyance; if it is a version string or a product code that happened to be numeric, the leading or trailing zero is gone for good. A field that must keep its exact printed form has to be a string in the JSON, and there is nothing the converter can do about it after the fact.

Here are the ways to do this conversion, with the exact command:

| Route | Command or step | Needs |
| --- | --- | --- |
| Browser | Drop the `.json` file on a converter page and read the table | A browser |
| Miller | `mlr --ijson --omd cat data.json` | `mlr` installed |
| jtbl | `cat data.json \| jtbl -m` | Python, `pip install jtbl` |
| pandas | `pd.read_json("data.json").to_markdown(index=False)` | pandas and tabulate |
| jq, by hand | build the header and rows yourself with `@tsv` and `sed` | `jq` and patience |
| Spreadsheet | JSON to CSV, open, copy, paste into a Markdown-aware editor | A spreadsheet |

**Who this is for:** anybody with an export from an admin panel, a list endpoint, or a query result. If your file is this shape, stop reading the rest of this page and pick whichever row above involves the fewest installs. There is no interesting decision to make.

**What to check anyway:** the last three rows, not the first three. Pagination means the interesting records are often at the end, and a converter that reads the first object for its header will have dropped any field that only appears later.

## The awkward shapes, case by case

Everything below is a shape where the table has to give something up. For each one there is a rendering that is defensible, a rendering that is not, and a command that gets you from one to the other.

### A nested object inside a field

```json
[
  { "id": 1, "user": { "name": "Ada", "city": "Leeds" }, "total": 42.0 },
  { "id": 2, "user": { "name": "Ben", "city": "Hull" }, "total": 18.5 }
]
```

There are exactly three things a converter can do with `user`, and it is worth knowing which yours does.

| Approach | Result | Cost |
| --- | --- | --- |
| Stringify the object into the cell | `{"name":"Ada","city":"Leeds"}` in one cell | Unreadable, and a `"` or a `\|` inside it breaks the row |
| Flatten to dotted columns | `user.name`, `user.city` | Column count grows with every nested key |
| Drop the field | Table with `id` and `total` only | Silent data loss, and no warning |

Flattening is the right default and the reason is arithmetic. A record with three nested objects of four keys each becomes a fifteen-column table, which is legible on a wide screen and unreadable in a pull request comment. So flatten, then select: decide which of the flattened columns you actually want, and drop the rest on purpose rather than letting the tool drop them by accident.

```bash
mlr --ijson --omd flatten data.json
```

Miller's `flatten` verb turns `user.name` into a field of that name, and `--omd` writes a Markdown table. To choose columns afterwards, add a `cut`:

```bash
mlr --ijson --omd flatten then cut -o -f id,user.name,total data.json
```

**Who this is for:** API responses, which almost always wrap the interesting fields in an envelope or attach a related record. This is the most common real shape, and the one where a converter's default matters most.

### An array inside a field

```json
[
  { "id": 1, "tags": ["urgent", "billing"] },
  { "id": 2, "tags": [] }
]
```

An array in a field is a one-to-many relationship, and a table is a rectangle. Something has to bend.

| Approach | Result | Cost |
| --- | --- | --- |
| Join into one cell | `urgent, billing` | A value containing the separator becomes ambiguous |
| One column per position | `tags.0`, `tags.1`, `tags.2` | Column count set by the longest array; mostly empty |
| One row per element | `id` repeated, one `tag` each | Row count multiplies; `id` is no longer unique |
| Count only | `tags` becomes `2` | Loses the values, keeps the shape |

Joining is what most converters do and it is usually correct for reading, provided the separator is one your values cannot contain. `; ` is safer than `, `. Exploding into one row per element is correct if the table is going to be sorted or filtered by tag, and it is what you want if the next step is a spreadsheet rather than a document. Positional columns are almost never right: they turn the position of an element into a column heading, and position in a JSON array carries no meaning unless somebody promised it did.

To join, in jq:

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json
```

To explode, one row per tag:

```bash
jq '[.[] | . as $row | .tags[] | { id: $row.id, tag: . }]' data.json
```

That second filter loses the empty-array record entirely, because `.tags[]` on `[]` produces nothing. If a record with no tags still needs a row, keep it explicitly:

```bash
jq '[.[] | . as $row | (if (.tags | length) == 0 then [null] else .tags end)[] | { id: $row.id, tag: . }]' data.json
```

That is the shape of most flattening work: three lines of jq to preserve a case the one-liner drops.

**Who this is for:** anything with labels, roles, permissions, categories or line items. If you are converting an orders export, the line items are an array inside a field and you have this decision to make whether you notice it or not.

### Records whose keys differ

```json
[
  { "id": 1, "email": "a@example.com" },
  { "id": 2, "phone": "+44 20 7000 0000" },
  { "id": 3, "email": "c@example.com", "phone": "+44 20 7000 0001" }
]
```

A table needs one header. These records have three different key sets between them, so the header has to be the union — `id`, `email`, `phone` — with blanks where a record does not carry a field.

The failure here is specific and common: a converter that builds its header from the first object only. That produces a two-column table, and record 2's phone number is not in the document at all. No error, no warning, no gap in the table to notice. This is the single most damaging default in this whole area, because the output looks complete.

Check it in one command. Ask jq for the union of keys and count the columns in your output:

```bash
jq -r '[.[] | keys[]] | unique | join(",")' data.json
```

If that list is longer than your table's header row, your converter read the first record and stopped. Either switch tools or force the shape yourself, giving every record every key:

```bash
jq --argjson cols '["id","email","phone"]' \
   '[.[] | . as $r | reduce $cols[] as $c ({}; .[$c] = ($r[$c] // null))]' data.json
```

Note `//` in that filter is jq's alternative operator, not a comment: it substitutes the right side when the left is `null` or `false`. That is a hazard of its own — a field whose real value is `false` will be replaced by `null`. If your data has booleans, use an explicit `has` check instead.

| Approach | Result | Cost |
| --- | --- | --- |
| Union of all keys | Every field present, blanks where absent | Wide table, sparse |
| Keys from the first record | Narrow, tidy, missing columns | Silent loss of every later field |
| Keys present in every record | Only the common fields | Loses the differences, which are often the point |
| Group by key set, one table each | Several honest tables | The reader has to reconcile them |

**Who this is for:** exports from anything with optional fields — a CRM, a forms product, an event stream where the payload varies by event type. If the records came from different code paths, assume the key sets differ until you have checked.

### An array of plain values

```json
["admin", "billing", "read-only"]
```

This is a list. Rendered as a table it becomes a single column with an invented header, which is more markup than content and less readable than the JSON was. Rendered as a bullet list it is finished:

```markdown
- admin
- billing
- read-only
```

The only case for a table is when the values are pairs of something, and then they are not plain values. If the list is long and ordered, a numbered list carries the ordering that a bullet list throws away — [the difference between an ordered and an unordered list is a claim about the data too](/blog/markdown-line-breaks-and-lists).

**Who this is for:** enumerations, permission sets, allow-lists. Almost never worth a converter at all: a search-and-replace turns it into a list in less time than opening a tool.

### An array of arrays

```json
[
  ["sku", "name", "price"],
  ["SKU-11", "Wide flange", 12.5],
  ["SKU-40", "Narrow flange", 9.0]
]
```

This is a CSV that has been through a JSON serialiser, and it tables perfectly — with one ambiguity nothing in the file resolves. Is the first row a header, or is it data that happens to look like one? JSON has no way to say. A converter has to guess, and the two guesses produce different documents: one with `sku | name | price` as the header, one with `Column 1 | Column 2 | Column 3` as the header and `sku` as a value in the first row.

Look at the file and decide, then tell the tool. If it will not be told, add the header yourself. Because this shape is really tabular data in JSON clothing, the [CSV route is often shorter](/blog/best-csv-to-markdown-converters): convert the array of arrays to CSV, and use a CSV to Markdown tool that has an explicit header flag.

**Who this is for:** BigQuery and similar query results, spreadsheet exports through a JSON API, anything where a `values` field holds rows.

### An array of unlike things

```json
[42, "pending", { "id": 7 }, [1, 2]]
```

A heterogeneous array is not a set of records and no table describes it. The honest rendering is a numbered section per element, each rendered according to its own type — a number as a sentence, an object as a small key/value table, a nested array as a list.

If a file gives you this at the top level, it is usually a mixed log or a hand-assembled fixture, and the right first move is to filter for the type you care about:

```bash
jq '[.[] | select(type == "object")]' data.json
```

Now you have an array of objects and one of the earlier cases applies.

**Who this is for:** almost nobody on purpose. It happens in test fixtures, in hand-edited files, and in event streams where the producer changed shape between releases.

### A single object that is not a list at all

A configuration file, an API envelope, one record fetched by id. There is no array to make rows from, so a table can only be a two-column key/value listing:

```markdown
| Field | Value |
| --- | --- |
| name | Wide flange |
| price | 12.5 |
```

That is readable for a handful of scalar fields and pointless past about a dozen, and it collapses entirely the moment a value is nested. For a single record, bold labels with the values beside them read better than table furniture, and nesting becomes headings. If the object is an envelope — `{"meta": {...}, "data": [...]}` — the table you actually want is over `.data`, and the first step is to say so:

```bash
jq '.data' response.json
```

**Who this is for:** anybody who has fetched one thing rather than a list. Check for an inner array before you accept a key/value table; nine times out of ten the interesting shape is one level down.

## Flattening first: jq, and files that are not one JSON value

Two problems sit in front of everything above. The file may not be one JSON value, and the shape may not be a rectangle yet. Both are fixed before any converter sees the data, and both are fixed with the same handful of commands.

**The file is JSON Lines.** One JSON value per line, newline-terminated, no wrapping array. Each line is valid; the file is not, because a bare sequence of values is not a JSON document. `JSON.parse` and `json.loads` both fail on line 2, and the error message says "unexpected token" rather than "this is JSON Lines", so people conclude the file is corrupt. It is not. It is the normal output of a log pipeline, `docker logs`, a message queue consumer, and most bulk-export endpoints.

The fix is one flag, and it is a different flag in every tool:

| Tool | Reading JSON Lines | Writing JSON Lines |
| --- | --- | --- |
| jq | default: reads a stream of values | `jq -c` — compact, one value per line |
| jq, as an array | `jq -s` or `jq --slurp` | `jq -c '.[]'` |
| Miller | `mlr --ijsonl` | `mlr --ojsonl` |
| pandas | `pd.read_json(path, lines=True)` | `df.to_json(path, orient="records", lines=True)` |
| jtbl | reads line-delimited input as it comes | not applicable |
| Python stdlib | `json.loads` per line in a loop | `json.dumps` per line |

So the canonical first move on a `.jsonl` file is to make it an array:

```bash
jq -s '.' events.jsonl > events.json
```

and the canonical last move, if the next tool wants lines, is to take the array apart again with `jq -c '.[]'`. Worth knowing: `jq -s` reads the whole file into memory. On a multi-gigabyte log this is the wrong tool, and Miller streams instead — though a table with a million rows is not a document anyone will read, so the real answer for a file that size is to filter first.

**The shape needs flattening.** jq's `flatten` function flattens nested *arrays*, not objects, which surprises people who reach for it by name. Flattening objects into dotted keys is done with paths:

```bash
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]' data.json
```

That reads as: for each record, find every path that ends in a scalar, turn the path into a dotted string, pair it with the value at that path, and rebuild the record from those pairs. `leaf_paths` is `paths(scalars)`; `getpath` fetches a value by path; `from_entries` turns key/value pairs back into an object. The output is an array of flat objects, which is the one shape that tables honestly, and you can hand it to any converter on the cheat sheet.

Two caveats on that filter. Array indices become part of the key, so `tags` with two elements produces `tags.0` and `tags.1` — the positional-columns problem from earlier, arriving by the back door. And an empty object or empty array has no leaf paths at all, so those fields vanish from the flattened record entirely. If either matters, handle arrays separately before flattening:

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json | \
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]'
```

**The records are keyed by id rather than listed.** A common shape is an object whose keys are identifiers:

```json
{ "u1": { "name": "Ada" }, "u2": { "name": "Ben" } }
```

There is no array here, but there is one hiding. `to_entries` produces `[{"key":"u1","value":{...}}, ...]`, and one more step promotes the key into a field of the record:

```bash
jq '[to_entries[] | { id: .key } + .value]' users.json
```

Now it is an array of flat objects with `id` as its first column, and the identifier that was doing double duty as a key is a value like any other.

**In Python, `json_normalize` does most of this in one call.** `pd.json_normalize(records, sep=".")` flattens nested objects into dotted columns; `max_level` stops it at a depth; `record_path` and `meta` handle the explode case, taking a nested array as the row source and carrying the parent fields along. Then `to_markdown(index=False)` writes the table, which needs the `tabulate` package installed alongside pandas. Both are free and open source, pandas under BSD 3-clause and tabulate under MIT.

**Who this section is for:** anyone converting the same shape more than once. A jq filter in a shell script is a conversion step you can read, review and fix. A sequence of clicks is not.

## Where the table lies, and what it costs

Assume the shape is right and the flattening is done. There is still a set of ways a Markdown table misrepresents the JSON it came from, and none of them produces an error.

**A pipe in a value splits the cell.** In GitHub Flavored Markdown, `|` delimits cells everywhere in a table row, including inside what you meant as text. `call before 4pm | or leave with neighbour` becomes two cells, the row gains a column, and the renderer drops the surplus or misaligns the rest. The escape is a backslash — `\|` — and it is the converter's job to apply it. Test it: put a pipe in one value, convert, and look. This is one instance of a wider problem worth understanding in full, because [tables break on the way between formats more than anything else in Markdown](/blog/markdown-tables-that-survive-conversion).

**A newline in a value cannot be expressed at all.** A Markdown table row is one line. A JSON string can contain `\n`, and often does — a description field, a log message, an address. There is no Markdown for a line break inside a cell; the only route is a literal `<br>`, which is raw HTML inside your Markdown, and which will be stripped by any renderer that sanitises. Converters variously emit `<br>`, replace the newline with a space, or emit the raw newline and break the table. All three are defensible and only one of them is what you want, so find out which yours does.

**Blank cells conflate four different facts.** `null`, an empty string, a missing key and `false` all become an empty cell in most converters. In an orders table, "no discount" and "the discount field is not present in this record" are different claims, and a reader cannot recover which from a blank. Writing an italic *null* for null, an em dash for absent and leaving empty strings genuinely empty costs three lines in a converter and saves the reader from guessing. Check what yours does on a record you constructed yourself.

**Long values destroy the layout without breaking it.** A base64 blob, a stack trace, a UUID-per-row column: a Markdown table has no column widths, so one long value makes its column as wide as itself and squeezes every other column into a strip. The table is valid and unreadable. The fix is not in the converter — it is to drop the column, or truncate it on purpose with a marker, before converting. `jq 'map(.token |= .[0:12] + "…")'` is uglier than the alternative of pretending the problem is presentational.

**Types are gone, and the document does not say so.** Markdown has no types. Once converted, `"12.50"` and `12.5` are both the text `12.5`, `true` is the word true, and `2026-09-02T00:00:00Z` is a string that looks like a date to a person and like nothing in particular to a machine. This is fine for a document and disqualifying for anything downstream. If the recipient is going to compute on the numbers, send the JSON or a CSV and let them parse it; the Markdown table is for reading.

**Row order is whatever the file had.** JSON arrays are ordered and the order is meaningful, so a converter must preserve it — but nothing sorts it for you, and a table nobody sorted is a table in insertion order, which is rarely the order a reader wants. Sort before converting: `jq 'sort_by(.total) | reverse'` costs nothing and makes the table answer a question.

**Column order is an accident.** JSON objects have no defined key order in the specification, though every practical implementation preserves the order it read. So your columns come out in whatever order the serialiser on the other end happened to emit, which means the identifier might be column six. Put the columns in the order a reader needs with an explicit select — `mlr cut -o -f id,name,total` keeps the order you listed, and jq's object construction does the same.

The cost of all of this, added up, is not that the table is wrong. It is that the table looks right. A JSON parse error stops you; a misaligned row from an unescaped pipe gets shipped, read, quoted in a decision, and found six weeks later.

## When a table is the wrong rendering

Sometimes the honest answer is that the data is not tabular and no amount of flattening will make it so. Three signs, and what to do instead.

**The columns outnumber the rows.** A single API response flattened to sixty dotted keys and one record is not a table; it is a record, and a record reads better as labelled values than as a sixty-column rectangle nobody can scroll. Render the scalar fields as bold labels with values beside them, and give each nested section its own heading.

**Every row needs a paragraph.** If one field is a description, a comment body, a diff or a log message, and the reader has to actually read it, a table cell is the wrong container. The rendering that works is a section per record: a heading carrying the identifier, the short fields as a compact list, and the long field as its own paragraph or fenced block. It is several times longer than a table and it is the version somebody can read.

**The structure is the information.** In a configuration file, a permissions tree or a dependency graph, the nesting is what you are trying to communicate. Flattening it to dotted keys turns the structure into string prefixes and asks the reader to reassemble the tree in their head. Headings for the levels, indented lists for the leaves, and a fenced `json` block for anything past about three levels down — deep enough to see the shape, shallow enough that the headings still mean something. A fenced block with a `json` info string also gets syntax highlighting in most renderers, which does real work for legibility; [what an info string is and what renderers do with it](/blog/code-blocks-in-markdown) is worth knowing before you rely on it.

That mixed rendering — tables where the data is rectangular, lists where it is a sequence, headings where it is a tree, code blocks where it is deeper than a document should go — is what a JSON to Markdown converter is really choosing when it converts. It is the reason [TransformPipe's JSON to Markdown conversion](/json-to-markdown) picks a rendering per shape rather than forcing one, in the browser, with nothing uploaded when you are signed out.

| Signal in the data | Table? | Better rendering |
| --- | --- | --- |
| Many records, few scalar fields | Yes | Table |
| One record, many fields | No | Bold labels, headings for nested parts |
| A field holding prose | No | Section per record, prose as a paragraph |
| Deep nesting that matters | No | Headings per level, fenced block past three |
| A list of plain values | No | Bullet or numbered list |
| Records of two or three fields, dozens of them | Yes | Table, sorted |

## How to choose the rendering

1. **Read the first ten lines of the file before you open any tool.** The top-level shape decides everything downstream, and it takes ten seconds: `head -c 400 data.json` tells you whether you have an array of records or a nested envelope, and a nested envelope means your table is over some field inside it rather than over the file.
2. **Ask whether the file is one JSON value or one per line.** Get this wrong and you get a parse error at best and only the first record at worst. `head -n 3` and a glance at whether each line is a complete object settles it, and the fix is one flag per tool.
3. **Flatten on purpose, then select columns on purpose.** Automatic flattening produces every column the data can yield, which for real API records is more columns than a document can hold. Choose the columns and their order explicitly, or the reader gets the serialiser's opinion instead of yours.
4. **Construct the awkward record and convert it before you trust the tool.** One record with a null, a missing key, a nested object, an array field, a pipe in a string and a newline in a string. Every failure on this page shows up in that one conversion, and finding them there costs two minutes instead of a retraction.
5. **Decide whether the output is to be read or to be processed.** A Markdown table is a document: types are gone and nothing can safely parse it back. If the next step is a spreadsheet or a script, convert to CSV and skip the round trip.
6. **If the columns outnumber the rows, stop making a table.** That ratio is the clearest signal that the data is a record rather than a list, and a record renders as labelled values. Forcing a rectangle at that point costs you the only thing the conversion was for, which is that somebody can read it.

## Conclusion

An array of flat objects with consistent keys converts to a Markdown table with no decisions and no losses, and if that is your file the choice of tool barely matters. Everything else is a decision somebody has to make: flatten the nesting or render it as sections, join the array field or explode it into rows, take the union of keys or accept the gaps, and escape the pipes before a value with one in it shifts a row nobody re-reads. Make those decisions yourself with `jq` or `mlr` while the data is still JSON, or use a converter whose rules are written down so you know what it did. The one thing not to do is hand a tree to a rectangle and assume the output is true because it lines up.

## FAQ

### How do I convert a JSON array to a Markdown table?

If every object in the array has the same keys and all the values are scalars, any converter handles it: drop the file on a browser converter, run `mlr --ijson --omd cat data.json`, pipe it through `jtbl -m`, or call `to_markdown(index=False)` on a pandas DataFrame. If the objects contain nested objects or arrays, flatten them first, because otherwise some cells will contain stringified JSON.

### What happens to nested JSON in a Markdown table?

One of three things, depending on the tool: the nested value is stringified into a single cell, it is flattened into dotted columns like `user.name`, or it is dropped. Flattening is the only one of the three that keeps the data readable, and it grows the column count, so flatten and then select the columns you want rather than accepting all of them.

### How do I handle records with different keys?

Build the header from the union of keys across every record, not from the first record. Check what your converter did with `jq -r '[.[] | keys[]] | unique | join(",")'` and compare that list against the header row in your output — if the output is shorter, fields from later records have been dropped silently.

### Can I make a Markdown table from JSON Lines?

Yes, once the tool knows the file is line-delimited. Miller reads it with `--ijsonl`, pandas with `lines=True`, and jq treats a stream of values as its normal input, so `jq -s '.' events.jsonl` turns the file into an array any other tool will accept. A converter given no hint will fail on line 2 with a syntax error, which reads like file corruption and is not.

### What breaks a Markdown table generated from JSON?

Pipe characters and newlines inside string values. A pipe ends a cell wherever it appears, so an unescaped one adds a column to that row, and a newline cannot be represented in a table row at all. A good converter escapes pipes as `\|` and replaces newlines with `<br>` or a space; test both cases on a value you control before trusting the output.

### Should I convert JSON to CSV instead?

If the next step is a spreadsheet, a script or anything that will parse the data, yes — CSV loses types too but at least it is designed to be read back, whereas a Markdown table is a document with no reliable parser. Convert to Markdown when a person is going to read it in a ticket, a pull request or a page.

### Why does my number look different after conversion?

Because it went through a JSON number type on the way. `9.0` becomes `9`, `007` becomes `7` if it was a number rather than a string, and a float that cannot be represented exactly in binary arrives with the digits JSON stored. Any field whose printed form matters — a product code, a version, a fixed-decimal price — has to be a string in the source data; no converter can restore a zero it never received.
