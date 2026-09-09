---
title: "Markdown line breaks and lists: the rules, and the small betrayals"
description: Why a newline is a space, what two spaces and a backslash do, how far a nested list indents, tight against loose, and every character that needs escaping
updated: 2026-09-09
date: 2026-07-11
tag: Syntax
keywords: markdown line break, markdown new line, markdown two spaces, markdown nested list, markdown ordered list, markdown checkbox, markdown task list, markdown escape character, markdown list indentation, loose and tight lists, commonmark hard line break, markdown br tag, markdown soft line break, markdown backslash line break, markdown list not nesting, markdown breaks option, markdown list numbering
---

Markdown is small enough that most people learn it by imitation and never read the rules. That works until a line refuses to break, a list arrives as one long paragraph, or an asterisk you meant literally swallows half a sentence. None of it is a bug. Each case is a rule doing what it says, where the source file gives no visual clue that anything is happening.

### TL;DR

A single newline is a space, not a line break: CommonMark calls it a soft line break and leaves renderers free to print it as whitespace, which is what a `.md` file does almost everywhere. To break a line inside a paragraph, end it with **two spaces** or a **backslash**; to start a new one, leave a **blank line**. A nested list indents by the width of the parent's marker plus the spaces after it — **two under `- `, three under `1. `** — and one blank line anywhere inside a list turns every item loose and wraps its text in `<p>`. Everything else on this page is one of those two rules applied somewhere you were not looking.

The rules are written down. CommonMark is the specification that settles them, and version 0.31.2 is the current one (checked on spec.commonmark.org, 9 September 2026). Every case below is a numbered rule in it rather than a quirk of a particular tool. What a specification cannot help with is that none of these rules leaves a mark in the source. A trailing space looks like nothing. Two spaces of indentation look like three. A blank line inside a list looks like tidiness.

Line breaks and lists belong in one article because they share an arithmetic. Whether a line breaks depends on what is at the end of it; whether a nested item nests depends on how far its line starts from its parent's content column. Both are counted in characters you cannot see, and both fail quietly — no error, no warning, just output that is not what you meant, usually noticed by somebody else.

## The cheat sheet: the symptom, and the rule behind it

| Symptom | The rule doing it | What to write instead |
| --- | --- | --- |
| Two lines came out as one | A single newline is a soft line break, printed as a space | Two trailing spaces, a backslash, or a blank line |
| It breaks in a comment box and not in a file | Some renderers turn every newline into `<br>`; a `.md` file does not | Write the break explicitly and it survives both |
| The first list item ended up inside the paragraph above | An ordered list may only interrupt a paragraph when it starts at `1` | Leave a blank line above the list |
| The whole list came out monospaced | Four spaces at the top level is an indented code block | Start the list within three spaces of the margin |
| The nested item became a sibling | Content indentation is the marker's width plus the spaces after it | Two spaces under `- `, three under `1. ` |
| The nested item became a code block | Content is four or more columns past the parent's content column | Count from the content column, not from the margin |
| The list grew vertical space nobody asked for | A blank line anywhere inside makes the whole list loose | Remove it, or accept a `<p>` in every item |
| The numbers renumbered themselves | Only the first marker is read; the browser counts the rest | Write `1.` for every item, deliberately |
| One list silently became two | Changing the bullet character or the delimiter starts a new list | Keep one bullet and one delimiter per file |
| A year at the start of a line became item one | `1986. ` is a valid ordered list marker | `1986\. ` |
| The asterisks vanished and the words went italic | `*` opens emphasis anywhere, including inside a word | `\*star\*`, or a code span |
| The checkbox printed as `[ ]` | Task lists are a GFM extension, not CommonMark | A converter that speaks GFM |
| A backslash printed at the end of the line | Neither break syntax works at the end of a block | Put the break between two lines, never after the last one |
| The item's second paragraph fell out of the list | A continuation line has to reach the item's content column | Indent it to where the item's own text starts |
| The sub-list under item ten lost its indent | `10. ` is one column wider than `9. ` | Count the marker again at ten, or indent everything by four |
| The nested item's marker printed as a hyphen mid-sentence | Over-indented text with no blank line above it is paragraph continuation | Indent to the content column, not past it |

Every row is a rule from the CommonMark specification rather than a tool's opinion, and the rest of this
page is those rules with the arithmetic written out.

## Three ways to end a line

Start with the paragraph, because every line-break question is a question about paragraphs wearing a disguise. A paragraph is a run of consecutive non-blank lines. It ends at a blank line and nowhere else. The line endings inside it are not content: CommonMark calls a line ending inside a paragraph a soft line break and says a renderer may present it in various ways. The overwhelming default, and what a `.md` file does wherever it is rendered, is a single space.

So this:

```markdown
Roses are red
Violets are blue
```

is one paragraph, two lines of source and one line of output. The newline survives into the HTML as whitespace, and the browser collapses it the way it collapses any run of whitespace. Nothing was lost and nothing broke. The file simply does not agree with you about where a line ends.

Two details of that definition matter later. A paragraph's lines may each start with up to three spaces
of indentation without changing anything, which is why a slightly indented line still joins the
paragraph above rather than becoming something new. And the whitespace either side of an internal line
ending is thrown away: the specification says spaces at the end of one line and the beginning of the
next are removed (checked on spec.commonmark.org, 9 September 2026). Aligning the second line of a
paragraph does nothing to the output, and neither does un-aligning it.

Three things change that, and a fourth sidesteps the question.

| What you write | What the parser does with it | What you get |
| :--- | :--- | :--- |
| A blank line | Ends the paragraph | A new paragraph, `<p>` |
| Two or more spaces at the end of a line | A hard line break | `<br>` inside the same paragraph |
| A backslash at the end of a line | A hard line break | `<br>` inside the same paragraph |
| A literal `<br>` | Raw HTML, passed through or escaped | `<br>`, if the converter allows raw HTML |

### Two trailing spaces, the break nobody can see

The two-space rule is the original hard break and the fragile one. Trailing whitespace is invisible, many editors strip it on save, linters flag it, and a reviewer reading a diff cannot see what changed.

Two details the specification adds that most guides leave out. The rule is two spaces *or more*, so a line ending in five spaces breaks exactly like a line ending in two — which is part of why nobody can tell by looking, and why "add another space" is never the fix. And neither form does anything at the end of a block: a hard break needs a line after it inside the same paragraph, so trailing spaces on the last line of a paragraph are just trailing spaces.

A third detail settles an argument people have with their own files. A hard break cannot happen inside a
code span or inside an HTML tag. Wrap two lines in backticks, with two trailing spaces on the first, and
the renderer hands back a single `<code>` element carrying those spaces as content and the newline as
whitespace — no break anywhere. If the thing you want to break is inside a code span, the syntax you need
is a fenced block, not a line break.

### The backslash, and the one place it prints itself

The backslash form does the same job in plain sight. The specification introduces it as the more visible
alternative to two or more spaces. It is a CommonMark addition: the original Markdown syntax document
describes only the two-space form and treats a backslash purely as a way to print a literal character
(checked on daringfireball.net, 9 September 2026), so a parser written before CommonMark prints the
backslash instead of breaking the line.

Its failure mode is the opposite of the two-space one, and the difference is worth choosing on
deliberately. Both are inert at the end of a block, but only the backslash tells you so. A paragraph
whose last line is `foo\` renders as `<p>foo\</p>`, backslash and all; a heading written `### foo\`
renders as `<h3>foo\</h3>`. The same positions written with two trailing spaces render as `<p>foo</p>`
and `<h3>foo</h3>` — nothing broke, and nothing said so. One syntax fails loudly on the page; the other
fails silently and waits for a reader to notice a run-on line.

### `<br>`, and the converter's opinion of it

The fourth option is to stop using Markdown for that one line and write `<br>` yourself. Markdown permits raw HTML by design, so a literal `<br>` in the source arrives in the output as a `<br>`. It is the only one of the four that is visible in a diff, survives a formatter, and cannot be deleted by an editor setting. It does depend on the converter passing raw HTML through, which is not automatic: markdown-it ships `html: false` in its default preset, commented "Enable HTML tags in source" (checked on cdn.jsdelivr.net, 9 September 2026), so raw tags are escaped and your `<br>` arrives on the page as visible text unless somebody turned that option on. A converter sanitising a file it did not write may also drop tags it does not recognise. `<br>` is on every sensible allow-list, so in practice it arrives — but that is the converter's decision rather than yours.

### What a single newline does, renderer by renderer

Before choosing between the four, it is worth seeing what the renderers actually do, because the reason the question never settles is that the same two lines of Markdown produce different documents depending on where they are rendered, and every one of those renderers is behaving correctly. The specification's licence to differ is explicit — a soft line break may be presented in various ways, and turning it into a `<br>` is one of them. What follows is the same input against the renderers people actually meet, each row checked against that project's own documentation.

| Where the text is rendered | A single newline becomes | How it is documented |
| --- | --- | --- |
| A `.md` file, any CommonMark or GFM renderer | A space | The specification's default treatment of a soft line break |
| A `.md` file on GitHub | A space | GitHub's writing guide says a break in an `.md` file needs two trailing spaces, a backslash or a `<br/>` (checked on docs.github.com, 9 September 2026) |
| A GitHub comment, issue, pull request or review | `<br>` | The same guide says comment fields render the line break for you (checked on docs.github.com, 9 September 2026) |
| marked, out of the box | A space | Its `breaks` option is `false` by default (checked on marked.js.org, 9 September 2026) |
| marked with `gfm: true` and `breaks: true` | `<br>` | Documented as copying GitHub's behaviour on comments, explicitly not its behaviour on rendered Markdown files; `breaks` requires `gfm` (checked on marked.js.org, 9 September 2026) |
| markdown-it, out of the box | A space | Its default preset sets `breaks: false`, commented "Convert '\n' in paragraphs into `<br>`" (checked on cdn.jsdelivr.net, 9 September 2026) |
| markdown-it with `breaks: true` | `<br>` | The same option name, doing the same job |
| Python-Markdown, out of the box | A space | Newlines inside a paragraph are whitespace unless an extension says otherwise |
| Python-Markdown with the `nl2br` extension | `<br />` | The extension treats every newline as a hard break; enabled with `extensions=['nl2br']` (checked on python-markdown.github.io, 9 September 2026) |
| Pandoc reading `markdown`, `gfm` or `commonmark` | A space | Its `hard_line_breaks` extension is disabled by default for all three (checked on pandoc.org, 9 September 2026) |
| Pandoc with `+hard_line_breaks` | `<br />` | The extension reads every newline inside a paragraph as a hard break instead of a space (checked on pandoc.org, 9 September 2026) |

Two consequences follow, and both are about handover. Text drafted in a comment box and pasted into a file collapses; text drafted in a file and pasted into a comment box gains breaks it never had. Neither renderer is wrong, because the document never carried the information either way.

The second consequence is sharper. `breaks: true` is a setting on the renderer, not a property of the document, so a file that depends on it renders correctly in exactly one place — yours. Send it to a repository, an email client, a static site build or anybody else's converter and the breaks are gone. If the break matters, put it in the document: two spaces, a backslash or a `<br>` all survive every row of that table. [The options that change how a JavaScript renderer behaves](/blog/markdown-to-html-in-javascript) go far beyond this one, and `breaks` is the one people flip without thinking about who reads the output.

There is one honourable use for the option, and it is worth naming because it is the case people are
usually in when they find it. If your application owns both ends — the box somebody types into and the
page their text appears on, and the text never leaves as a `.md` file — then `breaks: true` matches what
a person typing into a box expects, and nothing downstream is harmed. A comment field, a chat message,
a note pane. The moment that text can be exported, committed or copied into a repository, the option
stops being a convenience and becomes a document that only renders correctly at home.

### Which of the four to use, and where

For running prose the blank line is almost always what you wanted. Keep the hard break for where the new line is part of the content: an address, a verse, a two-line signature.

| The document is going to | Use | Because |
| :--- | :--- | :--- |
| A repository, read on GitHub and in an editor | A backslash | Visible in a diff, survives a whitespace trim, and prints itself if you put it somewhere useless |
| A converter you do not control | `<br>` | Raw HTML, subject only to sanitising, not to line-break options |
| A file a linter or formatter touches on save | A backslash or `<br>` | Two spaces are the one form a toolchain deletes without telling you |
| A comment box, an issue, a chat message | Nothing at all | Those renderers break on every newline already |
| Prose where the break is only visual | A blank line | It is a new paragraph, and paragraphs are what stylesheets are written for |

None of the five answers is a renderer setting, and that is the point: a document that carries its own breaks renders the same everywhere it is opened. Lists have the same shape of problem measured in a different unit — what a line does there depends on how far from the margin it starts.

## Why the list is not a list

A list needs a blank line above it. Written directly under a line of prose, the first item can be absorbed into that paragraph and come out as a stray hyphen mid-sentence.

The rules here differ between parsers. CommonMark lets a bullet list interrupt a paragraph, and an ordered list only when it starts at `1`. Older parsers allow neither. Leave the blank line and it stops mattering which one your converter uses — the same defence that keeps a [table intact](/blog/markdown-tables-that-survive-conversion), and a difference the [flavours article](/blog/commonmark-gfm-and-the-flavours) covers in full.

### Interrupting a paragraph, and the sentence that made the rule

CommonMark's position is that a list may interrupt a paragraph, with two exceptions attached to the
first item: when it starts on a line that would otherwise be paragraph continuation text, the item must
not begin with a blank line, and if it is ordered its start number must be `1` (checked on
spec.commonmark.org, 9 September 2026). The specification explains why in the plainest way available —
by printing the sentence that would otherwise break:

```markdown
The number of windows in my house is
14.  The number of doors is 6.
```

That stays one paragraph. Under a rule allowing any number to interrupt, `14.` would open an ordered
list starting at fourteen, and a hard-wrapped sentence would fall apart because of where the line
happened to wrap. Restricting interruption to `1` buys back nearly every hard-wrapped numeral in
ordinary prose, and it is the reason the rule is asymmetric rather than tidy.

The practical reading is short. A bullet list can follow a paragraph with no blank line and it works.
An ordered list can too, but only starting at `1`, and only under CommonMark. Anything older wants the
blank line. Write the blank line and none of the above is your problem.

### Four spaces from the margin is not a list

The opposite failure is indenting the list. Up to three spaces of indentation before the marker changes nothing at all — the list renders as though the spaces were not there. The fourth space is the one that changes the block: a bullet four spaces from the left margin is not a list, because at the top level four spaces still means an indented code block, so the list arrives as monospaced text with its hyphens intact.

That is a cheap failure to diagnose and an easy one to cause. Pasting a list out of a nested context,
an editor that indents on Enter, or a copy from a comment box that was already indented all produce it.
The tell is that nothing about the source looks wrong; the output is a grey box.

### The numbers you write are mostly ignored

In an ordered list only the first number is read. The start number of the list is taken from its first item, and the numbers on every later item are disregarded — the renderer emits `<ol>`, or `<ol start="5">`, and the browser counts from there. Markers must be nine digits or fewer: `123456789.` opens a list, `1234567890.` is a paragraph beginning with a very large number (checked on spec.commonmark.org, 9 September 2026). `1)` works as well as `1.` in CommonMark.

| What you write | What renders | The rule |
| :--- | :--- | :--- |
| `1.` `2.` `3.` | 1, 2, 3 | The first marker sets the start; the rest are disregarded |
| `1.` `1.` `1.` | 1, 2, 3 | The same rule, with a file that stops arguing with itself |
| `1.` `7.` `3.` | 1, 2, 3 | The same rule again — the wrong numbers cost nothing |
| `5.` `6.` `7.` | 5, 6, 7 | `<ol start="5">`, and the browser counts on from five |
| `5.` `1.` `1.` | 5, 6, 7 | Only the `5` was read |
| `0.` `0.` `0.` | 0, 1, 2 | Zero is a legal start number |
| `1234567890.` | A paragraph | Ten digits is one too many to be a marker |

Writing every item as `1.` keeps diffs small: the renumbering happens at render time rather than across twenty lines of the file, so inserting an item in the middle touches one line instead of all of them. The counter-argument is that the source no longer reads in order, which matters if people read the `.md` file directly. Both are defensible; what is not defensible is a file where some lists do one and some do the other, because then a stray `7.` looks like a mistake somebody should fix.

### Change the marker and you have two lists

Changing the bullet character or the ordered delimiter starts a new list. This is a rule, not a
tolerance, and it is invisible in the rendered page:

```markdown
- foo
- bar
+ baz
```

is a two-item `<ul>` followed by a one-item `<ul>`, not a list of three. The same happens between `1.`
and `1)`, and the ordered case is louder about it, because the second list starts its own numbering.
The usual causes are a file edited by two people with different habits, or a block pasted from
somewhere that used `*` while your file uses `-`.

In a browser two adjacent bullet lists look almost exactly like one, so this often ships. What gives it
away is spacing: if one of the two lists contains a blank line it becomes loose while its neighbour
stays tight, and half a list suddenly has more air around it than the other half. One bullet character
and one delimiter per document removes the whole category.

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

### The arithmetic, written out

The specification builds a list item from a marker of width W followed by N spaces, where N is between
one and four, and then indents every later line of that item by W + N (checked on
spec.commonmark.org, 9 September 2026). W + N is the content column, and it is the only number in play.
GitHub's own writing guide gives the same rule without the algebra: type spaces in front of the nested
item until its marker sits directly below the first character of the text above it, and in a proportional
font, count the characters that appear before the item's content (checked on docs.github.com,
9 September 2026).

So the width of the marker is the width of the marker as written, and every part of it counts:

| Parent marker | Marker width | Spaces after it | Content column | Nest a child at |
| :--- | :--- | :--- | :--- | :--- |
| `- ` | 1 | 1 | 2 | 2 spaces |
| `* ` | 1 | 1 | 2 | 2 spaces |
| `-   ` | 1 | 3 | 4 | 4 spaces |
| `1. ` | 2 | 1 | 3 | 3 spaces |
| `1) ` | 2 | 1 | 3 | 3 spaces |
| `10. ` | 3 | 1 | 4 | 4 spaces |
| `100. ` | 4 | 1 | 5 | 5 spaces |

The row that catches people is `10. `. A list that nested correctly for nine items stops nesting
correctly at the tenth, because the marker grew a character and the content column moved with it. Nobody
looks for that, because the file that broke is the file that worked yesterday with one item fewer.

### Two spaces under a bullet, and what the other indents produce

Take a bullet parent, content column 2. Correct:

```markdown
- Parent item
  - Nested, because two spaces reach the content column
```

One space short, and the child is not a child at all — it is another item of the same list, because a
list marker is allowed up to three spaces of its own indentation:

```markdown
- Parent item
 - One space: a sibling, rendered flush with its parent
```

Four columns past the content column, with a blank line above, and the parser reads an indented code
block inside the parent item:

```markdown
- Parent item

      - Six spaces: this is code now
```

which renders as `<li><p>Parent item</p><pre><code>- Six spaces: this is code now</code></pre></li>` —
a grey box under the bullet, hyphen and all. Take the blank line away and the same six spaces produce
something different again: with no blank line, the over-indented text is paragraph continuation, so it
joins the parent's own paragraph and the marker prints as a literal hyphen mid-sentence.

### Three spaces under an ordered item

An ordered parent moves the column by one, and the two-space habit fails in a way that looks like a
converter bug:

```markdown
1. Parent item
  - Two spaces: not nested, and not even in the list
```

Two spaces is short of the content column at 3, so the child is not part of the item; and because its
marker is a bullet rather than a number, it cannot be a sibling either. The ordered list closes and a
new bullet list opens beside it. The rendered page shows an `<ol>` with one item followed by a `<ul>`
with one item — which, in most stylesheets, looks like a nested list that lost its indentation.

Three spaces is the fix:

```markdown
1. Parent item
   - Three spaces: nested, as intended
```

| Indent under a `- ` parent | Indent under a `1. ` parent | What the parser makes of it |
| :--- | :--- | :--- |
| 0–1 spaces | 0–2 spaces | Not part of the item: a sibling if the marker type matches, a brand new list if it does not |
| 2–5 spaces | 3–6 spaces | A nested list — the content column, plus up to three spaces of slack |
| 6+ spaces after a blank line | 7+ spaces after a blank line | An indented code block inside the parent item |
| 6+ spaces with no blank line | 7+ spaces with no blank line | Paragraph continuation: the marker prints as text |

The slack in the middle row is why four spaces mostly works and is still the wrong habit. Four is within
range for both markers today. It stops being within range the moment a marker gets wider, and it hides
the arithmetic from whoever edits the file next.

### What can go inside a list item

Everything you can write at the top level can go inside a list item, as long as it starts at the item's
content column. That is the whole extension of the rule, and it covers four things people ask about
separately:

- **A second paragraph.** Blank line, then the paragraph indented to the content column. Under `- item`
  that is two spaces. Indent it one space instead and it falls out of the list entirely: the list closes
  and the text becomes a paragraph of its own, sitting under a list it was meant to be inside.
- **A code block.** A fence starting at the content column belongs to the item; four columns past it,
  the fence stops being a fence and becomes literal backticks in an indented code block. That case has
  [its own arithmetic and its own worked examples](/blog/code-blocks-in-markdown), including what happens
  when the list passes item ten.
- **A blockquote.** A `> ` at the content column, on every line of the quote, blank lines included. Drop
  the marker on one line and the quote ends there.
- **Another list.** Which is the nesting rule above, applied once more from the new content column.

Two consequences follow from writing it this way. A list item is a block container, not a line of text,
so anything about it — spacing, code, quotes — is a question about columns rather than about lists. And
the deeper you nest, the more columns you are counting, which is the practical argument against three
levels of nesting in a document other people will edit.

## Tight lists, loose lists, and the blank line that switches them

Then there is the spacing that appears from nowhere. A list is tight when its items sit against each other, and their text goes straight into each `<li>`. Put a blank line between any two items, or give one item two paragraphs, and the whole list turns loose: every item, including the ones you did not touch, gets its text wrapped in a paragraph, which shows up in the browser as extra vertical space. One empty line changed the list's type.

The specification states the condition and the consequence in one place: a list is loose if any of its
items are separated by blank lines, or if any item directly contains two block-level elements with a
blank line between them; otherwise it is tight. The difference in the HTML is that paragraphs in a loose
list are wrapped in `<p>` tags and paragraphs in a tight list are not (checked on spec.commonmark.org,
9 September 2026).

That is the entire mechanism. Here is the pair, side by side. Tight:

```markdown
- a
- b
- c
```

```html
<ul>
<li>a</li>
<li>b</li>
<li>c</li>
</ul>
```

Loose, from a single blank line before the last item:

```markdown
- a
- b

- c
```

```html
<ul>
<li><p>a</p></li>
<li><p>b</p></li>
<li><p>c</p></li>
</ul>
```

Three things about that output are worth stating plainly, because each of them is a support question
somebody has asked.

**The change is to the list, not to the item.** Items `a` and `b` were not touched and both grew a
`<p>`. Looseness is a property of the list as a whole, so a blank line anywhere inside it re-renders
every item.

**The spacing comes from your stylesheet, not from Markdown.** A `<p>` inside an `<li>` picks up
whatever top and bottom margin the page gives paragraphs. That is why the same file looks fine on
GitHub and airy on a documentation site, or the other way round: the amount of extra space is a CSS
decision that the Markdown merely triggered.

**A nested list after a blank line makes the outer list loose too.** This is the rule catching people
who did nothing wrong:

```markdown
- a

  - a nested item
- b
```

The first item now directly contains a paragraph and a list with a blank line between them, so the
whole outer list is loose and item `b` gets a `<p>` it did not ask for. Remove the blank line and the
list goes tight again.

None of this is a defect to fix. Loose lists are the right shape when items are sentences or contain
several blocks; tight lists are right for short labels. What causes trouble is doing both by accident in
one document, so that some lists breathe and others do not for reasons no one can see in the source. Pick
per list, deliberately, and keep the blank lines consistent within each one.

## Checkboxes and task lists

A checkbox is a list item whose text begins with brackets:

- [x] Marker, space, brackets, space, then the text
- [ ] The brackets come first — text before them and it is an ordinary item
- [ ] `x` or `X` ticks it, a single space leaves it empty, and that space is required

A task list is a GitHub Flavored Markdown extension, not plain CommonMark, so a strict CommonMark converter hands you literal square brackets. transformpipe speaks GFM, so task lists, tables, strikethrough and autolinks come through as themselves. The checkbox in the output is a picture of the state in your file, not a control: GFM renders it as a disabled input, so there is nothing to click.

The GFM specification is precise about what counts. A task list item is a list item whose first block is
a paragraph beginning with a task list item marker followed by at least one whitespace character before
any other content, and the marker itself is a left bracket, either a whitespace character or the letter
`x` in either case, then a right bracket. Rendered, the marker is replaced by a checkbox element, checked
when the character between the brackets is anything other than whitespace (checked on github.github.com,
9 September 2026).

Read against a real file, that yields four rules and one surprise:

| What you write | What you get | Why |
| :--- | :--- | :--- |
| `- [ ] Task` | An unchecked checkbox | Whitespace between the brackets |
| `- [x] Task` or `- [X] Task` | A checked checkbox | Either case of `x` ticks it |
| `- []Task` | A plain list item, brackets shown | No whitespace inside, and none after |
| `- Task [ ] later` | A plain list item, brackets shown | The marker has to start the item's first paragraph |
| `- [ ] Parent` with an indented `- [ ] Child` | Nested checkboxes | Task lists nest like any other list |

The surprise is the output itself. The reference rendering is `<input disabled="" type="checkbox">` —
an input element, already disabled, sitting inside the `<li>`. GitHub layers its own behaviour on top
inside issues and pull requests, where the boxes can be selected and deselected as the work is done
(checked on docs.github.com, 9 September 2026); a converted HTML document has nowhere to record a
click, so the checkbox is a static picture of the state in the source. If you need a checkbox somebody can tick and
have it remembered, you need an application, not a document.

The failure mode with a converter that does not speak GFM is quieter than it sounds. You do not get an
error; you get `<li>[ ] Task</li>`, which is a list of items that begin with two square brackets. On a
page with a proper style it reads as a formatting mistake rather than a missing feature, which is why
"my checkboxes stopped working" is usually a flavour problem — the same one behind tables and
strikethrough disappearing at the same time.

## Escaping a character that means something

The escape character is a backslash. In CommonMark it works before any ASCII punctuation mark and nowhere else, so a backslash before a letter stays on the page as a backslash.

```markdown
1986\. The year, not the first item of a list.
The shape is a \*star\*, and I mean the asterisks.
A literal backslash is written \\.
```

The date is the classic case: a line starting with a number, a full stop and a space is an ordered list, so a paragraph opening with a year quietly becomes item one. Headings (`#`), blockquotes (`>`) and bullets (`-`) do the same at the start of a line, and pipes need escaping inside a table.

Two things that save you backslashes. Underscores inside a word are left alone, so `snake_case_name` survives untouched; asterisks are not, so `a*b*c` still emphasises. And a backslash does nothing inside a code span, which is the better answer anyway for a filename, a flag or a glob pattern — the case that opens [the full reference on escaping](/blog/markdown-escaping), which carries on through the character references a backslash cannot replace and the template, Windows path and `__init__` cases that produce most of the complaints.

### Every character that needs one, and where

The set is fixed. CommonMark allows a backslash before any ASCII punctuation character and nowhere
else, which is these thirty-two: ``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`` (checked on
spec.commonmark.org, 9 September 2026). A backslash before a letter, a digit or a space is a literal
backslash, printed.

Most of those thirty-two never do anything and never need escaping. These are the ones that do:

| Character | What it means unescaped | Where it bites | Write instead |
| :--- | :--- | :--- | :--- |
| `\` | The escape character itself | Anywhere in text | `\\` |
| `` ` `` | Opens a code span | Anywhere inline | ``\` ``, or wrap the text in a longer run of backticks |
| `*` | Emphasis, and a bullet marker | Anywhere inline, including mid-word; start of line | `\*` |
| `_` | Emphasis | At a word boundary only — mid-word underscores are safe | `\_` |
| `#` | An ATX heading | Start of a line only | `\#` |
| `>` | A blockquote | Start of a line only | `\>` |
| `-` | A bullet, a setext underline, a thematic break | Start of a line only | `\-` |
| `+` | A bullet | Start of a line only | `\+` |
| `.` | An ordered list marker, after digits | Start of a line only | `1986\.` |
| `)` | An ordered list marker, after digits | Start of a line only | `1986\)` |
| `[` `]` | A link, an image, a footnote, a task marker | Anywhere inline | `\[` `\]` |
| `!` | An image, when followed by `[` | Anywhere inline | `\!` |
| `<` | Raw HTML, or an autolink | Anywhere inline | `\<`, or the entity `&lt;` |
| `&` | The start of an entity reference | Anywhere inline | `&amp;` |
| A pipe | A cell boundary in a GFM table | Inside a table row only | A backslash before it, even within a code span |
| `~` | Strikethrough, in GFM | Anywhere inline, in pairs | `\~` |
| `=` | A setext heading underline, turning the line above into an `<h1>` | Start of a line, directly under a paragraph | `\=` |

The column that saves the most work is the third one. `#`, `>`, `-`, `+`, `.` and `)` carry meaning only
at the start of a line, so a hash mid-sentence is a hash and needs nothing. Escaping them everywhere is a
habit picked up from tools that escape defensively, and it leaves backslashes all over prose that a
reader will eventually see, because a backslash before a character that meant nothing still disappears
from the output but stays in the file for the next person to wonder about.

### Where a backslash does nothing at all

Escapes do not work inside code spans, code blocks, autolinks or raw HTML (checked on
spec.commonmark.org, 9 September 2026). Inside backticks, `\*` is a backslash and an asterisk, both
printed — which is exactly what you want for a glob pattern or a Windows path, and exactly what surprises
people who escaped first and added the backticks afterwards.

They do work in three places you might not expect: link destinations, link titles, and the info string
after a fence. A parenthesis inside a URL can be escaped rather than percent-encoded, and a title
containing a quotation mark can carry it.

### The escapes a converter writes for you

Going the other way — HTML, a `.docx` or a spreadsheet into Markdown — every one of these characters is
the converter's problem, not yours, and it is a reasonable way to judge one. A Word paragraph that starts
"1986. The year" must arrive as `1986\. The year` or the document gains a list nobody wrote. A heading
whose text contains a `#`, a sentence containing an underscore or an asterisk, a table cell containing a
pipe: each needs a backslash inserted during conversion, and a converter that skips this produces a
Markdown file that renders as something other than the document it came from. It is worth testing with
one deliberately awkward paragraph before trusting a converter with a hundred pages.

In the other direction the escaping is the browser's problem and the converter handles it silently: `<`
and `&` in your text arrive in the HTML as `&lt;` and `&amp;`, which is why a literal `<div>` written in
prose shows up as text on the page rather than disappearing into the markup.

## The honest part: the syntax your toolchain deletes

Everything above assumes the file you saved is the file the converter reads. For the two-space hard
break, that assumption is usually wrong, and it is wrong in a way nobody can see.

Trailing whitespace is the one thing every part of a modern toolchain is configured to remove. It is a
standard EditorConfig property: `trim_trailing_whitespace` set to `true` removes whitespace characters
before the newline, and it is supported across editors (checked on editorconfig.org, 9 September 2026).
A repository with an `.editorconfig` that sets it for `[*]` deletes your line breaks on the next save,
in every file, for everybody. Nothing warns you, because from the editor's point of view it removed
nothing of value, and [the editor you write in](/blog/best-markdown-editors) is usually the one enforcing
it — a setting somebody turned on years ago for a language where trailing whitespace really is noise.

The linter agrees with the editor and disagrees with the specification. markdownlint's MD009, aliased
`no-trailing-spaces`, flags lines ending in unexpected whitespace, with a `br_spaces` parameter that
allows an exception for a specific number of trailing spaces used as an explicit break; its default
value is `2` (checked on github.com, 9 September 2026). So a two-space break passes and a three-space
break is flagged — even though both render identically, because the rule is "two or more". The syntax is
legal at any width above one and lint-clean at exactly one width.

Add the last two facts and the picture is complete. A code review shows nothing: trailing spaces do not
appear in a diff as content, so the commit that removed your line breaks looks like the commit that
fixed an indent. And the person who finds out is the reader, weeks later, looking at an address that ran
into one line.

This is the sharp end of the whole subject. The documented, original, everywhere-supported way to break a
line is a sequence of invisible characters that the tools around your file are configured to delete, that
your linter permits at exactly one width, and whose disappearance is invisible in review. It is not a
Markdown defect and it is not a tooling defect; it is two reasonable positions meeting in a file.

## Conclusion: the rules that survive a round trip

Ten rules cover every failure on this page, and they are all the same rule underneath: put the meaning
in the document rather than in the tool that renders it.

1. **Write hard breaks as a backslash, not as two spaces.** A whitespace trim cannot delete it, a diff
   shows it, and if you put it somewhere useless it prints itself instead of failing quietly.
2. **Use a literal `<br>` when the converter is not yours.** The only thing that can remove it is a
   sanitiser's allow-list, which is a shorter list of possibilities than every renderer's line-break
   option.
3. **Reach for a blank line before either.** A new paragraph is a block a stylesheet can space, and a
   `<br>` is not — so most of the breaks people fight for should have been paragraphs.
4. **Leave a blank line above every list.** It costs one line and removes every difference between
   flavours about interrupting a paragraph, including the ordered-list-must-start-at-1 rule.
5. **Count the marker rather than the habit: two under `- `, three under `1. `, four from item ten.**
   Four spaces works until a marker gets wider, and the list that breaks is the one you did not edit.
6. **Decide tight or loose per list, and keep the blank lines inside it consistent.** Otherwise the
   spacing in your document changes for reasons that are invisible in the source and unattributable in
   review.
7. **Keep one bullet character and one ordered delimiter per document.** A single stray `+` or `1)`
   silently splits one list into two, and two adjacent lists look almost exactly like one.
8. **Escape a character only where it carries meaning.** `#`, `>`, `-` and `.` mean something at the
   start of a line and nothing anywhere else, so escaping everywhere leaves backslashes in prose that
   somebody will eventually read in the source.
9. **Treat a renderer's `breaks` option as a property of your application, never of your documents.**
   The day the text is exported, committed or pasted somewhere else, every break it relied on is gone.
10. **Read the HTML, not the preview.** `<p>` where you expected `<br>`, `<pre>` where you expected a
    nested item, a second `<ul>` where you expected one list: the output names the rule that fired.

None of this needs a tool to enforce. It needs the source file to say what you meant, so that the file
still means it after a formatter, a reviewer and somebody else's converter have all had a turn. When a
document still renders wrong and you cannot see why, convert it and read the HTML beside the preview —
[transformpipe does that in the browser](/), with the source and the output side by side — because the
tags answer the question the source cannot: a `<p>` means the break never happened, a `<pre>` means you
indented too far, and a list that grew paragraphs means a blank line crept in somewhere you were not
looking. Every symptom on this page resolves to one of those three, and each one is a rule doing exactly
what it says.

## FAQ

### How do I make a line break in Markdown?

End the line with two spaces or a backslash and the break happens inside the same paragraph, as a `<br>`.
Leave a blank line instead and you get a new paragraph, which is what you want for prose. The backslash
is the better of the two hard breaks, because trailing spaces are invisible and most toolchains delete
them.

### Why doesn't my line break work on GitHub?

Because a `.md` file and a comment box are two different renderers. GitHub's guide says a comment field
renders the break for you, while a break in an `.md` file needs two trailing spaces, a backslash or a
`<br/>` (checked on docs.github.com, 9 September 2026). Text drafted in a comment and pasted into a file
collapses for exactly this reason.

### How many spaces should I indent a nested Markdown list?

Two under `- `, three under `1. `, and four once the numbering reaches `10. ` — the marker's width plus
the spaces after it. Too few and the item becomes a sibling instead of a child; four or more columns past
that point and it becomes a code block or joins the parent's paragraph.

### Why did my list suddenly get extra spacing between items?

A blank line somewhere inside it turned the whole list loose, so every item's text is now wrapped in a
`<p>` and picks up your stylesheet's paragraph margins. The blank line does not have to be between
items — one before a nested list has the same effect. Remove it and the list goes tight again.

### Why do my list numbers renumber themselves?

Only the first marker is read; the numbers on the following items are disregarded and the browser counts
from the start number. That is why `1. 7. 3.` renders as 1, 2, 3, and why writing every item as `1.` is a
legitimate style rather than a mistake.

### Why is my checkbox rendering as `[ ]`?

Task lists are a GitHub Flavored Markdown extension rather than part of CommonMark, so a strict
CommonMark converter renders the brackets as ordinary text. You need a converter that speaks GFM — the
same one you need for tables, strikethrough and autolinks, which is why they usually break together.

### How do I stop a year at the start of a line becoming a list?

Escape the full stop: `1986\. The year`. A digit followed by `.` or `)` and a space is a valid ordered
list marker at the start of a line, so the paragraph becomes item one of a list starting at 1986. The
backslash is invisible in the output and costs nothing.
