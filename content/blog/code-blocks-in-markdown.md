---
title: "Code blocks: fences, languages and the backtick problem"
description: Fenced versus indented code, what the language hint really does, how to print a backtick, and why a list item swallows a block
date: 2026-08-18
tag: Syntax
keywords: markdown code block, fenced code block, markdown syntax highlighting, markdown code block language, markdown inline code, triple backticks, markdown escape backtick
---

Three backticks, a newline, your code, three more backticks. That is a fenced code block, and it is
the piece of Markdown that most often comes out of a converter looking nothing like what you typed:
a language hint that produced no colour, a backtick you cannot print, a block that lost its fence
markers inside a list. Each has a cause you can see.

## Fences beat indentation

Markdown has two ways to mark code as code. The older one indents every line by four spaces. The
newer one wraps the lines in a fence — three or more backticks, or three or more tildes, on their
own line above and below.

```js
const total = items.reduce((sum, item) => sum + item.price, 0);
```

Indented blocks still work, but they have no slot for a language and they fight with list
indentation constantly. The original Markdown had only that form, which is why a very old renderer
may print your triple backticks literally instead of a `<pre>` —
[which flavour a tool speaks](/blog/commonmark-gfm-and-the-flavours) decides more than this one
feature.

## What the language hint actually does

The word after the opening fence is the info string. A converter does exactly one thing with it: it
puts it on the `<code>` tag as a class.

```html
<pre><code class="language-js">const total = items.reduce(...)
</code></pre>
```

That is the whole feature. Nothing parses your JavaScript, and nothing checks that the word is a
real language — write `jvascript` and you get `class="language-jvascript"`, which no highlighter
recognises, so the block renders plain.

| What you write | What the converter emits |
| --- | --- |
| A bare fence | `<pre><code>` |
| A fence marked `json` | `<pre><code class="language-json">` |
| Four spaces of indent | `<pre><code>` |
| A tilde fence marked `bash` | `<pre><code class="language-bash">` |

Colour is a second step, and a separate program. A highlighter — highlight.js, Prism and Shiki are
the common three — reads that class, splits the code into tokens, wraps each token in a span and
lets a stylesheet colour them. That step runs either in the reader's browser after the page loads,
or ahead of time while the HTML is built. Markdown syntax highlighting, in other words, is not a
Markdown feature: it is a class name plus something else you arrange.

That distinction decides which tool you want. [M2H](https://transformpipe.com) converts fenced
code as part of GitHub Flavored Markdown, and the `.html` it hands back is self-contained: inline
styles, no scripts, no network requests. Code arrives as styled monospaced text in a `<pre>` rather
than coloured tokens, because nothing is left in the file to do the colouring. If colour is the
point, reach for a site generator that runs Shiki at build time, or for
[Pandoc](/blog/pandoc-alternatives-for-markdown-to-html), which highlights as it converts. If the
point is a portable file you can hand to someone, the plain block is the better trade.

## Inline code, and how to print a backtick

One backtick each side gives you inline code: `npm run dev`. The trouble starts when the code
itself contains a backtick.

A backslash does not help. Outside a code span, `` \` `` escapes a backtick; inside one, backslash
escapes are switched off, so you would get a literal backslash in your output. The real rule is
about length: the delimiter has to be a run of backticks longer than any run inside the content.

~~~markdown
`code`        one backtick each side
``a ` b``     two, because the content holds one
`` ` ``       a lone backtick, padded with spaces
~~~

Those spaces are not decoration. CommonMark strips one leading and one trailing space from a code
span when both are there, so they hold the content apart from the delimiters and then disappear.
That is the answer to escaping a backtick in Markdown: you do not escape it, you out-count it.

## Putting a fence inside a fence

Same rule, one level up. A closing fence has to be at least as long as the one that opened the
block, and a shorter run is just content. So to show triple backticks — a Markdown snippet inside
documentation about Markdown, for instance — open with four.

~~~markdown
````markdown
```bash
npm install
```
````
~~~

The counting gets silly quickly. A tilde fence sidesteps it: `~~~` opens and closes a block, and no
number of backticks inside can close it. Every example here that contains a fence is wrapped in one.

## Why a list item eats your code block

This is the failure that sends people looking for a converter bug. Inside a list item the content
column is set by the marker: `- ` puts it at three, `1. ` at four. A fence has to start at that
column, or within three spaces of it. Four spaces past it and the fence stops being a fence — it
turns into an indented code block, and your backticks show up as literal text. Start it at column
one and you end the list item, splitting one list into two with a code block wedged between.

Broken, then fixed:

~~~markdown
1. Run the install:

```bash
npm install
```

2. Then start it.
~~~

~~~markdown
1. Run the install:

   ```bash
   npm install
   ```

2. Then start it.
~~~

Three spaces for `1. `, two for `- `, and the block belongs to the item. The same arithmetic governs
nested lists and hard line breaks, which is [its own small subject](/blog/markdown-line-breaks-and-lists).

## Read the HTML, not the preview

Every editor previews Markdown with its own settings, so a block that looks right in yours proves
little about the file someone else opens. The HTML settles it. Drop the file into M2H and open the
"HTML source" tab: a fence that worked shows `<pre><code>`, and one that did not shows a paragraph
with backticks in it — that is your indentation or your fence length. Fix the source, convert
again, and read [the docs](/docs) when you want the same conversion from the API, the CLI or a
GitHub Action.
