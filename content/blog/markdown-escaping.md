---
title: "Markdown escape characters: the full reference"
description: Which characters a backslash escapes, where escaping does nothing, when a character reference is the better answer, and the cases that quietly rewrite your text
date: 2026-09-06
tag: Syntax
keywords: markdown escape characters, markdown backslash, escape asterisk in markdown, markdown underscore emphasis, escape pipe in markdown table, markdown character references, markdown special characters, markdown escape underscore, snake_case markdown, markdown escape backtick
---

An asterisk you meant literally turns half a sentence italic. A year at the start of a line becomes item 1,986 of a list. A Windows path loses one of its backslashes on the way to the page, and nobody notices until somebody copies it into a terminal. Every one of those is a character doing its documented job in a place you were not thinking about it.

### TL;DR

A backslash escapes any of the **thirty-two ASCII punctuation characters**, and nothing else — before a letter, a digit, a space or a non-ASCII character it is just a backslash, printed. Escaping does **nothing at all** inside a code span, a fenced or indented code block, an autolink or raw HTML, which is the rule almost every escaping problem turns out to be. **Character references** (`&amp;`, `&lt;`, `&#42;`, `&copy;`) are the other route, and the only one that works where a backslash is inert or where the character is not ASCII punctuation. Most characters need escaping in one position only — a hash at the start of a line, a pipe inside a table cell — and a code span is the portable answer to all of it, at the cost of monospaced text.

The rules come from one place. CommonMark is the specification that settles them, and version 0.31.2, dated 28 January 2024, is the current one (checked on spec.commonmark.org, 9 September 2026). It says two sentences about backslashes that between them decide every case on this page: any ASCII punctuation character may be backslash-escaped, and backslashes before other characters are treated as literal backslashes.

What a specification cannot fix is that escaping fails in both directions and neither failure announces itself. Under-escape and the character is interpreted: your prose gains emphasis, a heading, a list, a link. Over-escape and the backslash vanishes from the output anyway — `\:` renders as a plain colon — so the file fills up with backslashes that do nothing and the next person to edit it cannot tell which ones matter. Both look fine in a preview pane that agrees with your parser and wrong everywhere else.

There is a shorter version of this material in [the piece on line breaks and lists](/blog/markdown-line-breaks-and-lists), which covers the characters that collide with list markers and the two ways to break a line. This page is the rest: the whole escapable set, the four contexts where a backslash is dead, character references, what a converter escapes for you, and the handful of real-world cases — template syntax, Windows paths, dollar signs, `snake_case` — that generate almost all of the complaints.

## What a backslash escape does, and the thirty-two characters it works on

A backslash before an ASCII punctuation character removes that character's meaning and removes itself from the output. The escapable set is fixed and it is these thirty-two: ``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`` (checked on spec.commonmark.org, 9 September 2026). That is every printable ASCII character that is neither a letter, a digit nor a space.

Everything else is a literal backslash. `\q` renders as `\q`, backslash included. So does `\3`, and so does a backslash before an em dash or a curly quotation mark, because those are punctuation but not ASCII punctuation. This is the half of the rule people forget, and it is the reason a Windows path usually survives untouched and then loses exactly one separator in one place.

Two consequences worth holding on to before the table. First, escaping is per-character, not per-region: there is no "start literal text here" marker in Markdown, so `\*\*not bold\*\*` is four backslashes for one effect. Second, an escape is inert but not invisible — it disappears from the rendered page and stays in the file, which means over-escaped Markdown reads as noise to a human and converts identically for a machine.

| Character | What it means unescaped | Where it means it | How to write it literally |
| :--- | :--- | :--- | :--- |
| `\` | The escape character itself | Anywhere in text | `\\` |
| `` ` `` | Opens a code span | Anywhere inline | ``\` ``, or wrap the run in more backticks |
| `*` | Emphasis and strong emphasis; a bullet; a thematic break | Anywhere inline, mid-word included; start of a line | `\*` |
| `_` | Emphasis and strong emphasis; a thematic break | Word boundaries only; start of a line | `\_` — mid-word underscores need nothing |
| `#` | An ATX heading; a closing heading sequence | Start of a line, within three spaces of the margin; end of a heading | `\#` |
| `>` | A block quote | Start of a line | `\>` |
| `-` | A bullet; a setext `<h2>` underline; a thematic break; a front-matter fence | Start of a line | `\-` |
| `+` | A bullet | Start of a line | `\+` |
| `=` | A setext `<h1>` underline | A line directly under a paragraph | `\=` |
| `.` | An ordered list delimiter, after digits | Start of a line | `1986\.` |
| `)` | An ordered list delimiter, after digits; the end of a link destination | Start of a line; inside `(…)` | `1986\)`, `\)` |
| `(` | The start of a link destination | Inside a link | `\(` |
| `[` `]` | A link, image, reference or footnote label; a task-list marker | Anywhere inline | `\[` `\]` |
| `!` | An image, when followed by `[` | Anywhere inline | `\!` |
| `<` | An autolink, a raw HTML tag, or an HTML block | Anywhere inline; start of a line | `\<`, or `&lt;` |
| `>` | The end of an autolink or a raw HTML tag | Inside `<…>`, where a backslash is inert | `&gt;` in prose; percent-encoding inside a URL |
| `&` | The start of a character reference | Anywhere inline | `&amp;` |
| `|` | A cell boundary in a GFM table | Inside a table row only — including inside a code span | `\|` |
| `~` | Strikethrough in GFM, in pairs; an alternative code fence | Anywhere inline; start of a line | `\~` |
| `"` `'` | Nothing, unless smart punctuation is on; delimit a link title | Inside `(… "…")` | `\"`, or `&quot;` |
| `$` | Nothing in CommonMark or GFM; a maths delimiter where that extension is on | Only with a maths extension | `\$`, or a code span |
| `{` `}` | Nothing in CommonMark; attribute blocks and template syntax in other tools | Only in those tools | `\{` `\}`, or a fenced block |
| `:` | Nothing in CommonMark; footnote definitions and emoji shortcodes elsewhere | Only in those tools | `\:` |
| `%` `,` `/` `;` `?` `@` `^` | Nothing, anywhere, in any common flavour | Nowhere | Escapable, never necessary |

The fourth column is where the work is. Six of these characters — `#`, `>`, `-`, `+`, `.` and `)` — carry meaning only at the start of a line, so a hash in the middle of a sentence is a hash and a hyphen between two words is a hyphen. Escaping them everywhere is a habit picked up from tools that escape defensively, and it costs you a file full of backslashes for no change in output.

## Where escaping does nothing at all

This is the rule that produces most of the confusion, and it is a single sentence in the specification: backslash escapes do not work in code blocks, code spans, autolinks or raw HTML (checked on spec.commonmark.org, 9 September 2026). In all four, a backslash is content. It prints.

The order in which people discover this is always the same. They escape a character, it still comes out wrong, so they wrap it in backticks as well — and now the backslash is on the page.

```markdown
a `\*` span
```

renders as the word "a", then a code span reading `\*`, then the word "span" — the backslash visible on the page, because inside the code span it lost its power and kept its width. The fix is to delete the escape, not to add another.

**Code spans and code blocks.** Everything between the backticks, or inside a fence, or indented by four spaces, is literal text. `\\` stays two backslashes; `\_` stays a backslash and an underscore. This is a feature, and it is why a code span is the right container for a glob pattern, a regular expression, a `printf` format string or a Windows path — see [what else fenced blocks do and do not interpret](/blog/code-blocks-in-markdown) for the info-string end of that.

**Autolinks.** An autolink is a URL between angle brackets, and its contents are a URL, not Markdown. Escape something inside one and the backslash becomes part of the address: `<https://example.com/a\_b>` produces a link whose `href` contains `%5C`, the percent-encoding of a backslash. The link text looks nearly right and the destination is wrong, which is the worst combination available.

**Raw HTML.** Inside a tag, a backslash is a backslash. Try to escape a quotation mark in an attribute — `<div title="a\"b">` — and the attribute ends at the second quotation mark with a stray backslash inside it, exactly as it would in a browser. HTML attributes are escaped with character references, `&quot;`, and never with backslashes.

**HTML blocks.** A block of raw HTML is passed through whole, with no inline parsing inside it, so nothing in it needs escaping in the first place. An asterisk in an HTML block is an asterisk. A backslash you add out of caution will be printed.

| Context | What a backslash does there | What to use instead |
| :--- | :--- | :--- |
| Code span, `` `…` `` | Prints, as content | Nothing — the span already protects the text |
| Fenced block | Prints, as content | Nothing |
| Indented block, four spaces | Prints, as content | Nothing |
| Autolink, `<…>` | Becomes part of the URL, percent-encoded | Percent-encode the character properly |
| Raw HTML tag or attribute | Prints, and breaks the attribute | A character reference: `&quot;`, `&amp;` |
| HTML block | Prints | Nothing — inline syntax is not parsed there |
| Link destination, `(…)` | Works: `\(` and `\)` are honoured | A backslash, or percent-encoding |
| Link title, `"…"` | Works: `\"` is honoured | A backslash |
| A fence's info string | Works | A backslash |

The last three rows are the mirror image of the first six, and they surprise people the other way: escapes do work in link destinations, link titles and info strings. A parenthesis inside a URL can be escaped rather than percent-encoded, and a title containing a quotation mark can carry one.

There is exactly one documented exception to the code-span rule, and it belongs to GitHub Flavored Markdown rather than CommonMark. The tables extension says to include a pipe in a cell's content by escaping it, including inside other inline spans (checked on github.github.com, 9 September 2026, specification version 0.29-gfm dated 6 April 2019). The reason is mechanical: the table parser splits a row on pipes before any inline parsing happens, so `\|` has to be handled at that earlier stage, and it therefore works in the one place escapes otherwise cannot reach. Write `` `x \| y` `` in a cell and you get a code span containing `x | y`. Write `` `x | y` `` and you get two cells.

## Character references, and when they are the better answer

The second way to write a literal character is to name its code point. CommonMark recognises three forms: `&` plus a valid HTML5 entity name plus `;`, `&#` plus one to seven decimal digits plus `;`, and `&#` plus `x` or `X` plus one to six hexadecimal digits plus `;`. An invalid code point is replaced by U+FFFD, the replacement character, and an unrecognised name is left as literal text (checked on spec.commonmark.org, 9 September 2026).

The property that makes them useful is one line of the same section: references are not recognised in code blocks and code spans, and they cannot stand in for structural characters. `&#42;` is a literal asterisk in the output and never the start of emphasis; `&#35;` at the start of a line is a hash, not a heading. Where a backslash removes a meaning, a reference never had one to remove — the character arrives after the parser has finished deciding what the line is.

| Reference | Character | Why you would reach for it |
| :--- | :--- | :--- |
| `&amp;` | `&` | The one you cannot avoid: a bare `&` may start a reference |
| `&lt;` `&gt;` | `<` `>` | Prose about HTML, and anywhere raw HTML is allowed through |
| `&quot;` | `"` | Inside an HTML attribute, where a backslash breaks the value |
| `&#42;` | `*` | A literal asterisk that no parser can read as emphasis |
| `&#95;` | `_` | Same, for an underscore, in a flavour with intraword emphasis |
| `&#124;` | `|` | A pipe in a table cell, in a renderer whose `\|` handling you distrust |
| `&copy;` `&reg;` | `©` `®` | Not ASCII punctuation, so a backslash cannot escape them anyway |
| `&nbsp;` | A non-breaking space | Keeping "10 MB" or "Figure 3" on one line |
| `&#x2014;` | An em dash | A character your editor's font or keyboard makes awkward |

A reference is the better answer in four situations. Where a backslash is inert — inside raw HTML, or in an attribute value. Where the character is not ASCII punctuation, so there is nothing to escape: `©`, `®`, `†`, a non-breaking space, a typographic dash. Where the file will pass through a tool that strips or doubles backslashes, because `&amp;` survives a naive string replacement that `\&` does not. And where you want the character to be immune to flavour differences, since `&#42;` behaves identically in every renderer that implements references at all.

The costs are real and worth stating. A reference is HTML, so it only makes sense on a path that ends in HTML: convert the same file [to plain text](/blog/markdown-to-plain-text) or into a word processor and a converter that does not resolve references will print `&nbsp;` as six visible characters. References are unreadable in the source — nobody scanning a paragraph recognises `&#8212;` at a glance. And they are a shorter list than they look: only characters with an HTML5 name work in the named form, so invented names such as `&asterisk;` fall through as text.

## The characters that only matter in one position

Most of the escaping people do is unnecessary, because most of these characters are only special somewhere specific. Learning the positions is cheaper than learning the table.

**Start of a line.** This is where block structure is decided, and where a character that has been harmless all document suddenly is not. A `#` becomes a heading. A `>` becomes a block quote. A `-` or a `+` becomes a bullet — and a `-` on the line under a paragraph becomes a setext `<h2>` underline, turning the sentence above it into a heading. A `=` on that line makes it an `<h1>`. Digits followed by `.` or `)` become an ordered list marker, and the number is used: a paragraph beginning "1986. The year the standard changed" renders as an ordered list whose first item is numbered 1,986, because the marker sets the list's start attribute. All of these need one backslash, placed on the character rather than at the start of the line: `1986\.`, not `\1986.`.

Indentation counts as position too. A block-level marker still works with up to three spaces in front of it, and four spaces makes an indented code block instead — so nudging a line right does not disarm a hash, and nudging it further changes it into something else entirely.

**End of a heading.** A trailing run of hashes on an ATX heading is a closing sequence and is removed: `### Notes ###` renders as "Notes". If the hashes are part of the text, escape the run — `### Notes \###` — and they stay.

**Inside a table cell.** The pipe is the only character whose special meaning is confined to one construct, and it is absolute there: an unescaped pipe ends the cell, whatever it is wrapped in. Everything about [keeping a table intact through a conversion](/blog/markdown-tables-that-survive-conversion) starts with that one character.

**In link text and link destinations.** Square brackets nest badly, so a bracket inside link text needs escaping: `[a \[b\] c](https://example.com)`. Inside the destination, balanced parentheses are usually fine and an unbalanced one needs `\(` or `\)`. A space in a destination is not an escaping problem at all — a backslash will not save it, and the whole link degrades to plain text; percent-encode it.

**Inside a link title.** A quotation mark inside a `"…"` title needs `\"`, one of the few places a backslash works that people assume it does not.

### The backslash at the end of a line

There is one position where a backslash is not an escape at all, and it is the collision worth knowing about. The specification says it plainly: a backslash at the end of the line is a hard line break (checked on spec.commonmark.org, 9 September 2026). So a paragraph line that ends in a single backslash does not print one — it emits a `<br>` and joins the next line to itself.

This matters in exactly one common case and it is a Windows one. A directory path written as prose and ending in a separator, `C:\logs\`, sits at the end of a line and turns into a line break, taking the backslash with it. Two backslashes, `C:\logs\\`, give you one literal backslash and no break. A code span gives you the path and nothing else, which is the right answer.

At the end of a block — the last line of a paragraph, the end of a heading — neither break syntax has a line to break, and the backslash prints instead. That asymmetry is the useful half of the comparison between the two hard-break forms: a stray backslash is visible on the page, whereas stray trailing spaces are not.

## What a converter escapes for you on the way out

Escaping is not only something you do to a source file. Every conversion in either direction inserts escapes, and knowing which ones tells you how to read a broken output.

**Markdown to HTML.** Three characters in your text cannot travel as themselves, because HTML would read them as markup. A converter replaces them, silently and always.

| In your Markdown | In the HTML | Why |
| :--- | :--- | :--- |
| `<` in text | `&lt;` | Otherwise the browser starts parsing a tag |
| `&` in text | `&amp;` | Otherwise the browser starts parsing a reference |
| `>` in text | `&gt;` | Symmetry, and safety in older parsers |
| `"` in an attribute | `&quot;` | Otherwise the attribute value ends early |
| `'` in an attribute | `&#39;` | The same, for single-quoted attributes |

This is why a literal `<div>` typed into a sentence shows up as text on the page instead of disappearing into the markup, and it is old behaviour rather than a modern nicety: the original Markdown syntax document notes that inside code spans and blocks, angle brackets and ampersands are always encoded automatically (checked on daringfireball.net, 9 September 2026). A character reference you wrote yourself is left alone — a converter that re-escaped `&amp;` into `&amp;amp;` would break every document containing one.

**HTML, Word, CSV or JSON to Markdown.** Here the converter has to insert backslashes, and this is a reasonable way to judge one. A paragraph that begins "1986. The year" must arrive as `1986\. The year` or the document gains a list nobody wrote. A sentence containing an asterisk, a table cell containing a pipe, a heading whose text contains a hash, a product name containing an underscore at a word boundary: each needs a backslash inserted mid-conversion, and a converter that skips the step hands back a file that renders as a different document from the one it was given. [Testing a conversion with one deliberately awkward paragraph](/blog/convert-html-to-markdown) before trusting it with a hundred pages costs a minute.

**Why `&amp;lt;` appears on a page.** Because something was escaped twice. `<` became `&lt;`, and then a second pass treated that string as plain text and escaped its ampersand into `&amp;`, giving `&amp;lt;` — which the browser faithfully renders as the visible text `&lt;`. Three ampersands deep, `&amp;amp;lt;`, means three passes. The cause is almost always a pipeline where two stages both believe they are the one responsible for escaping: a converter that emits HTML, feeding a template engine that auto-escapes its inputs; or a sanitiser run after escaping rather than before. The diagnosis is arithmetic — count the layers of `amp;` and you know how many stages escaped it — and the fix is to remove an escaping step, never to add an unescaping one.

The mirror symptom is a backslash on the rendered page where you expected a clean character. That means Markdown-escaped text reached something that is not a Markdown renderer: a plain-text field, a `title` attribute, a code span added after the escapes. Either the escapes should not be there or the text should not be in that container.

## The cases that actually come up

Five situations account for nearly every real complaint about escaping. None of them is exotic and only one is really about Markdown.

### Writing about Markdown in Markdown

The hardest document to write in Markdown is a document about Markdown, because every example is a live construct. Escaping character by character works and reads terribly: `\*\*bold\*\*` in the source is worse than the thing it describes.

Use code spans instead, and use the padding rule when the sample contains backticks. A code span can be opened with any number of backticks and is closed by the same number, and a single leading and trailing space is stripped, so a two-backtick span with spaces inside it holds a literal backtick. To show a fenced block, open the outer fence with four backticks and put the three-backtick example inside it:

    ````
    ```js
    const x = 1;
    ```
    ````

For anything short — a syntax fragment, a flag, a marker — a code span is both correct and shorter than escaping. **Who this is for:** anyone writing documentation, a style guide or a README that quotes syntax.

### Snippets with template syntax

`{{ }}`, `{% %}` and `${…}` generate a steady stream of escaping questions and none of them is a Markdown problem. Braces are escapable but meaningless in CommonMark: `{{ name }}` in a paragraph renders as `{{ name }}`. What eats it is a second processor working on the same file — a static site generator's template engine, a documentation build, a component framework — running either before Markdown or after it.

So a backslash cannot help, because the engine that consumes the braces has never heard of Markdown escapes. Each engine has its own mechanism, and Liquid's is the clearest example: its `raw` tag temporarily disables tag processing, and the documentation gives Handlebars syntax as the reason you would want it (checked on shopify.github.io, 9 September 2026). A fenced code block is not protection here either — a template engine that runs over the raw `.md` file has no idea the fence exists.

`${…}` is a third variant of the same shape: inside a JavaScript template literal it is interpolation, and the escaping that stops it is JavaScript's backslash, in the code, not Markdown's. Escaping it in the Markdown gives you a document containing `\${…}`, which is wrong twice.

**Who this is for:** anyone documenting a templating language, a shell script or a CI configuration inside a site that is itself built from templates. Find the outer engine's raw directive first; the Markdown layer is not where the fix goes.

### Windows paths

A path such as `C:\Users\name\Documents` usually survives a Markdown renderer, and that is the trap. Each backslash is followed by a letter, so each one is a literal backslash and prints. Then one path in the document happens to be followed by ASCII punctuation and loses a separator without a word of warning: `C:\temp\_new` renders as `C:\temp_new`, and `C:\logs\` at the end of a line becomes a line break.

Nothing in the output flags it. The path is still a plausible path, which is why this bug reaches a support article and gets copied into somebody's terminal before anybody notices. Doubling every backslash works and makes the source unreadable. A code span works, is shorter, and protects the whole run at once — inside backticks a backslash is content, always, and there is nothing left to get wrong.

**Who this is for:** anyone writing install instructions, log locations or configuration paths for Windows. Put every path in a code span as a matter of habit and the class of bug disappears.

### Currency and maths with dollar signs

In plain CommonMark and in GFM, `$` means nothing. "It costs $5 to $10" renders exactly as written, and no escaping is needed. The trouble starts where a maths extension is switched on, because then `$…$` is a delimiter and two dollar signs in one line become a maths expression containing your sentence.

GitHub is the place most people meet this. Its documentation says an inline expression is surrounded by dollar symbols, that within a math expression you add a backslash before an explicit `$`, and — the part worth remembering — that outside a math expression but on the same line you should use span tags around the explicit `$` (checked on docs.github.com, 9 September 2026). That is an instruction to reach for raw HTML rather than a backslash, which tells you how firmly the dollar sign has been claimed on that platform.

The portable answer is the usual one: put the amount in a code span, or write the currency as words. **Who this is for:** anyone writing about prices, financial figures or units in a repository whose README is rendered by a platform with maths enabled.

### Underscores inside identifiers

This is the single most common real complaint, and the good news is that CommonMark already solved most of it. An underscore can only open or close emphasis at a word boundary, so `snake_case_name` renders as itself, untouched, and needs no backslashes at all. The same is not true of asterisks: `a*b*c` emphasises the `b`, because `*` carries no such restriction.

Three shapes still break, and they are the ones that generate the reports.

| What you write | What you get | Why |
| :--- | :--- | :--- |
| `snake_case_name` | `snake_case_name` | Both underscores are inside a word: no emphasis |
| `__init__` | Bold "init" | Both runs are at a word boundary, so both can act as delimiters |
| `_private and id_` | Italic "private and id" | A leading underscore opens; a trailing one, sentences later, closes |
| `MAX_VALUE and MIN_VALUE` | Unchanged | Both are intraword |
| `a*b*c` | `a<em>b</em>c` | Asterisks have no word-boundary rule |

`__init__` is the case that costs the most time, because Python's dunder names are exactly the pattern the emphasis rule is designed to catch, and the output — bold text where a method name should be — looks like a styling accident rather than a syntax one. `\_\_init\_\_` fixes it in four backslashes. A code span fixes it in two backticks, and also stops the name from being reflowed, spell-checked or turned into a smart-quoted mess.

The word-boundary rule is CommonMark's, which is the other half of the answer: a renderer that predates it, or one that implements a different emphasis rule, may emphasise intraword underscores after all. **Who this is for:** anyone writing about code in prose — identifiers, environment variables, database columns, flag names. A code span is correct in every flavour and communicates "this is a symbol" as a bonus.

## The honest part: escaping is per-flavour at the edges

Everything above is true of CommonMark, and CommonMark is not the only thing rendering your file. The set of escapable characters is itself a flavour decision, and the difference is not small.

The original Markdown syntax document lists exactly fifteen characters you can escape: backslash, backtick, asterisk, underscore, the curly braces, the square brackets, the parentheses, hash, plus, minus, dot and exclamation mark (checked on daringfireball.net, 9 September 2026). CommonMark widened that to all thirty-two ASCII punctuation characters. So `\|`, `\~`, `\$`, `\:` and `\=` are escapes in a CommonMark renderer and printed backslashes in a pre-CommonMark one. A file that escapes defensively for one is a file with visible backslashes in the other, and both renderers are doing what their documentation says.

The edges move in the other direction too. GFM gives `|` and `~` meanings that CommonMark does not have — a cell boundary and, in pairs, strikethrough — and adds the in-code-span pipe escape to cope with the first of them (checked on github.github.com, 9 September 2026). A maths extension claims `$`. Attribute-block syntax claims `{` and `}`. Emoji shortcodes and some footnote syntaxes claim `:`. Each of those turns a character from the "never needs escaping" column into one that does, and none of them is in a specification you can point at as the definitive one. [How far the flavours diverge and which features belong to which](/blog/commonmark-gfm-and-the-flavours) is the background to all of it.

Which leaves one portable answer, and it has a cost that is easy to skip past. A code span works everywhere: no flavour interprets its contents, no extension claims a character inside it, and the escaping question does not arise. But a code span is not a neutral wrapper — it changes the text. It renders monospaced, usually with a tinted background and a slightly different size, and it carries the semantics of "this is code". That is right for a path, a flag or an identifier. It is wrong for a company name containing an ampersand, a price, a sentence about an asterisk, or a heading. Wrapping prose in backticks to dodge an escaping problem trades a syntax bug for a typographic one, and the typographic one is the sort a designer notices and a writer defends.

So there is no single answer, only a short ranking. Inside a code span if the text is code. A backslash if it is prose and one flavour has to render it. A character reference if a backslash cannot reach or the character is not ASCII punctuation. And rewriting the sentence — moving the year off the start of the line, spelling out the currency — more often than people try, because a sentence that needs no escaping renders correctly in every flavour that will ever exist.

## Choosing an escape, in five criteria

1. **Decide whether the text is code, because that answers most of it.** A path, a flag, an identifier or a pattern belongs in a code span, where no escaping is needed and none will be interpreted; if the text is prose, a code span is the wrong instrument and you are back to backslashes.
2. **Check the position before adding anything.** Six of the characters that matter only matter at the start of a line, so a backslash in the middle of a sentence is almost always a backslash you will have to explain to somebody later.
3. **Escape once, and know which stage does it.** A pipeline where two stages both escape produces `&amp;lt;` on the page, and the only fix is to remove one of them — adding an unescaping step to compensate hides the fault and breaks the next document instead.
4. **Use a character reference when the backslash cannot reach.** Inside raw HTML, in an attribute value, or for a character that is not ASCII punctuation, `&quot;` and `&copy;` work where `\"` and `\©` do nothing at all.
5. **Render the file where it will actually live before you commit to a scheme.** The escapable set, the emphasis rules and the meaning of `$`, `|` and `:` all vary by flavour, so a document that looks right in your editor's preview can carry visible backslashes on the platform that publishes it.

## Conclusion

Escaping in Markdown is one rule with a long tail: a backslash disarms any ASCII punctuation character, does nothing before anything else, and does nothing at all inside a code span, a code block, an autolink or raw HTML. Almost every problem is the second half of that sentence meeting a character that was only ever special in one position. Character references cover what the backslash cannot reach, code spans cover what you would rather not think about, and a rewritten sentence covers the rest. If you want to see what a given file actually produces — which escapes survived, which characters were interpreted, and what the HTML says — [converting it in TransformPipe and reading the output](/) is faster than reasoning about it, and it is the only way to find the escape that disappeared without leaving a mark.

## FAQ

### How do I escape a special character in Markdown?

Put a backslash in front of it, as long as it is one of the thirty-two ASCII punctuation characters: `\*` for a literal asterisk, `\#` for a hash at the start of a line, `\|` for a pipe in a table cell. Before a letter, a digit or a non-ASCII character the backslash is not an escape and prints on the page.

### Why is my backslash showing up in the output?

Most likely because the text is inside a code span, a code block, an autolink or raw HTML, where escapes do not work and a backslash is ordinary content. The other possibility is that you escaped something that is not ASCII punctuation — a letter, a digit, an em dash — which the specification defines as a literal backslash.

### How do I write a literal asterisk or underscore in Markdown?

Write `\*` or `\_`, or use `&#42;` and `&#95;` if you want a character no parser can read as emphasis. Underscores inside a word need nothing in CommonMark and GFM, so `snake_case_name` is already safe; `__init__` is not, because both runs sit at word boundaries.

### Why does my table break when a cell contains a pipe?

Because the pipe is a cell boundary and the table parser splits the row on it before anything else happens, including before code spans are recognised. Escape it as `\|`, which is the one escape that works inside a code span, or use `&#124;`.

### When should I use `&amp;` instead of a backslash?

When a backslash cannot reach the character or has nothing to remove: inside raw HTML, inside an attribute value, and for characters that are not ASCII punctuation, such as `©` and a non-breaking space. Character references also survive pipelines that strip or double backslashes, at the cost of being unreadable in the source.

### Why do I see `&amp;lt;` in my converted output?

Something escaped the text twice: `<` became `&lt;`, then a second stage escaped that ampersand into `&amp;`. Count the layers of `amp;` to count the stages, then remove one of them — usually a template engine auto-escaping output that a converter had already escaped.

### Does escaping work the same in every Markdown tool?

Not at the edges. The escapable set is thirty-two characters in CommonMark and fifteen in the original Markdown, and extensions for tables, maths, attributes and emoji claim characters that plain CommonMark ignores. A code span behaves identically everywhere, which is why it is the portable answer, and why it is worth knowing that it also changes how the text looks.
