---
title: Line breaks, lists and the other small betrayals
description: Two spaces, a backslash or a blank line; the indent a nested list needs; loose and tight lists; and how to escape a character that means something
date: 2026-07-11
tag: Syntax
keywords: markdown line break, markdown new line, markdown two spaces, markdown nested list, markdown ordered list, markdown checkbox, markdown task list, markdown escape character
---

Markdown is small enough that most people learn it by imitation and never read the rules. That works until a line refuses to break, a list arrives as one long paragraph, or an asterisk you meant literally swallows half a sentence. None of it is a bug. Each case is a rule doing what it says, where the source file gives no visual clue that anything is happening.

## Three ways to end a line

A single newline is not a line break. Two lines of text with nothing between them are one paragraph, and the newline becomes a space. The source looks broken into lines; the HTML does not.

Three things change that.

| What you write | What you get |
| :--- | :--- |
| A blank line | A new paragraph, `<p>` |
| Two spaces at the end of a line | A break inside the paragraph, `<br>` |
| A backslash at the end of a line | The same break |

The two-space rule is the original hard break and the fragile one. Trailing whitespace is invisible, many editors strip it on save, linters flag it, and a reviewer reading a diff cannot see what changed. The backslash does the same job in plain sight, though it is CommonMark's addition rather than original Markdown's, so a very old parser prints the backslash instead of breaking the line.

For running prose the blank line is almost always what you wanted. Keep the hard break for where the new line is part of the content: an address, a verse, a two-line signature.

Many chat and issue boxes turn every newline into a break, which is why text that looked right in a comment field collapses into one paragraph inside a file. The text did not change; the renderer did.

## Why the list is not a list

A list needs a blank line above it. Written directly under a line of prose, the first item can be absorbed into that paragraph and come out as a stray hyphen mid-sentence.

The rules here differ between parsers. CommonMark lets a bullet list interrupt a paragraph, and an ordered list only when it starts at `1`. Older parsers allow neither. Leave the blank line and it stops mattering which one your converter uses — the same defence that keeps a [table intact](/blog/markdown-tables-that-survive-conversion), and a difference the [flavours article](/blog/commonmark-gfm-and-the-flavours) covers in full.

The opposite failure is indenting the list. A bullet four spaces from the left margin is not a list at all: at the top level four spaces still means [an indented code block](/blog/code-blocks-in-markdown), so the list arrives as monospaced text.

## How far to indent a markdown nested list

Indentation is measured from the parent item's content column, not from the left margin. That is the whole rule, and it explains every list that refuses to nest.

```markdown
- Bullet: content starts at column 2
  - so two spaces nests under it
1. Ordered: `1. ` is three characters wide
   - so three spaces nests under it
10. At ten the marker is four wide
    - and four spaces is what nests
```

Four spaces is the habit most people carry over, and extra indentation is allowed, so it usually works. It fails in both directions: too little and the nested list becomes a sibling of its parent; four or more columns past the content column and it is code again.

## Ordered lists, and the loose ones

In an ordered list only the first number is read. `1. 1. 1.` and `1. 7. 3.` both produce 1, 2, 3. Writing every item as `1.` keeps diffs small: the renumbering happens at render time, not across twenty lines of the file. Start at another number and the list starts there. `1)` works as well as `1.` in CommonMark.

Then there is the spacing that appears from nowhere. A list is tight when its items sit against each other, and their text goes straight into each `<li>`. Put a blank line between any two items, or give one item two paragraphs, and the whole list turns loose: every item, including the ones you did not touch, gets its text wrapped in a paragraph, which shows up in the browser as extra vertical space. One empty line changed the list's type.

## Checkboxes and task lists

A checkbox is a list item whose text begins with brackets:

- [x] Marker, space, brackets, space, then the text
- [ ] The brackets come first — text before them and it is an ordinary item
- [ ] `x` or `X` ticks it, a single space leaves it empty, and that space is required

A task list is a GitHub Flavored Markdown extension, not plain CommonMark, so a strict CommonMark converter hands you literal square brackets. M2H speaks GFM, so task lists, tables, strikethrough and autolinks come through as themselves. The checkbox in the output is a picture of the state in your file, not a control: GFM renders it as a disabled input, so there is nothing to click.

## Escaping a character that means something

The escape character is a backslash. In CommonMark it works before any ASCII punctuation mark and nowhere else, so a backslash before a letter stays on the page as a backslash.

```markdown
1986\. The year, not the first item of a list.
The shape is a \*star\*, and I mean the asterisks.
A literal backslash is written \\.
```

The date is the classic case: a line starting with a number, a full stop and a space is an ordered list, so a paragraph opening with a year quietly becomes item one. Headings (`#`), blockquotes (`>`) and bullets (`-`) do the same at the start of a line, and pipes need escaping inside a table.

Two things that save you backslashes. Underscores inside a word are left alone, so `snake_case_name` survives untouched; asterisks are not, so `a*b*c` still emphasises. And a backslash does nothing inside a code span, which is the better answer anyway for a filename, a flag or a glob pattern.

When a file still renders wrong, put it through [M2H](https://transformpipe.com) and read the HTML source tab beside the preview. A `<p>` where you expected a `<br>` means the break never happened, a `<pre>` means you indented too far, and a list that grew paragraphs means a blank line crept in. The [documentation](/docs) covers the rest of the pipeline.
