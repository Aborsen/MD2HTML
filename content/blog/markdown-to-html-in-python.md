---
title: Rendering Markdown to HTML in Python
description: The four Python Markdown libraries, the extension flags that catch everyone out, sanitising the HTML with nh3, and a script that converts a directory
date: 2026-07-07
tag: Code
keywords: markdown to html python, python markdown, markdown2 python, mistune, markdown parser, convert markdown programmatically
---

`markdown.markdown(text)` is the first line almost everyone writes, and it works. Then a table goes into the README, the HTML comes back with pipes sitting in a paragraph, and the search starts. Python has four Markdown libraries worth knowing about. The differences between them are mostly about what is switched on by default and how far you can change the output.

## The markdown package, and the extensions it leaves off

Python-Markdown — `pip install markdown`, imported as `markdown` — is the oldest of the four. On its own it implements the original Markdown syntax and nothing more. No tables. No fenced code blocks. No footnotes. Those are extensions, and they stay off until you name them.

```python
import markdown

html = markdown.markdown(
    text,
    extensions=["tables", "fenced_code", "toc", "sane_lists"],
    extension_configs={"toc": {"anchorlink": True}},
)
```

The flags people miss are almost always these:

| What you expected | Extension | Note |
| --- | --- | --- |
| GitHub-style tables | `tables` | |
| Triple-backtick code fences | `fenced_code` | |
| Ids and anchors on headings | `toc` | also fills `md.toc` |
| Highlighted code | `codehilite` | needs Pygments installed |
| Footnotes | `footnotes` | |
| `{: .note}` attributes on elements | `attr_list` | |
| A single newline becoming a line break | `nl2br` | |

`extra` switches on a bundle — `abbr`, `attr_list`, `def_list`, `fenced_code`, `footnotes`, `md_in_html`, `tables` — and gets you close to what you probably assumed you had. Note what is still missing from it: `nl2br` and `codehilite`.

For more than one document, build the converter once with `markdown.Markdown(extensions=[...])` and call `.reset()` between files. Footnotes and the table of contents carry state, so without the reset the second page inherits the first page's footnotes.

## markdown2 and its extras

markdown2 is a single module with the same shape and a different vocabulary: features are *extras*, and they are also off by default.

```python
import markdown2

html = markdown2.markdown(
    text,
    extras=["tables", "fenced-code-blocks", "strike", "header-ids", "footnotes"],
)
```

The trade-off is fewer moving parts against a smaller ecosystem: if you need something neither library ships, Python-Markdown has a documented extension API and third-party extensions to draw on.

Mind the spelling. The two libraries name the same feature differently — `fenced_code` against `fenced-code-blocks` — so keep the list in one constant rather than retyping it at each call site. Mixing the two up is the usual reason one page renders a table and another prints pipes.

## mistune, when you want to change the output

mistune is a pure-Python Markdown parser built around plugins and renderers. `mistune.html(text)` is the convenience call; `create_markdown` is where the decisions live.

```python
import mistune

render = mistune.create_markdown(
    escape=True,
    plugins=["table", "strikethrough", "task_lists", "url"],
)
html = render(text)
```

`escape=True` escapes raw HTML in the source instead of passing it through, which is what you want when the Markdown came from someone else. Pass `escape=False` when the source is yours and it contains deliberate HTML.

The real reason to reach for mistune is the renderer. Subclass `HTMLRenderer`, override the method for one node type, and images or links come out the shape you want — carrying `loading="lazy"`, say — with no regular expression run over the finished string.

## markdown-it-py for CommonMark

When the requirement is "matches the spec", markdown-it-py is the direct answer. It is a Python port of the JavaScript markdown-it and tracks CommonMark closely. Presets choose a starting point and rules are enabled by name.

```python
from markdown_it import MarkdownIt

md = MarkdownIt("commonmark")
md.enable(["table", "strikethrough"])
html = md.render(text)
```

Because it is the same parser family as the JS original, a Python backend and a Node front end can be made to agree on the output. Which flavour you are targeting matters more than which library you pick; [CommonMark, GFM and the flavours](/blog/commonmark-gfm-and-the-flavours) sets out the differences, and the same libraries have counterparts covered in [rendering Markdown in JavaScript](/blog/markdown-to-html-in-javascript).

## Sanitising the HTML

None of these four is a sanitiser. Markdown permits raw HTML by design, so a `<script>` tag in the source is a `<script>` tag in the output unless something escapes or removes it. Python-Markdown says as much in its own documentation; its old `safe_mode` was removed rather than repaired.

bleach was the standard answer for years. It is now deprecated and unmaintained; the usual replacement is nh3, a Python binding to the Rust ammonia library.

```python
import nh3

safe = nh3.clean(
    html,
    tags={"p", "a", "code", "pre", "h1", "h2", "h3", "ul", "ol", "li", "table",
          "thead", "tbody", "tr", "th", "td", "em", "strong", "blockquote"},
    attributes={"a": {"href", "title"}, "code": {"class"}},
)
```

Clean the HTML, not the Markdown. Filtering the source text is guesswork, because the parser is what decides which characters become a tag. [Sanitising Markdown safely](/blog/sanitising-markdown-safely) works through the failure cases. transformpipe is built the same way: marked renders, then DOMPurify in the browser and the `xss` package on the server clean the result against one shared allow-list, so both sides produce the same document. Its heading ids carry a `doc-` prefix, which keeps them out of DOM-clobbering territory.

## A script that converts a directory

Put the pieces together and a whole folder is about fifteen lines.

```python
from pathlib import Path
import markdown, nh3

TEMPLATE = "<!doctype html><meta charset=utf-8><title>{title}</title>{body}"

md = markdown.Markdown(extensions=["tables", "fenced_code", "toc"])
src, out = Path("docs"), Path("build")

for path in sorted(src.rglob("*.md")):
    body = nh3.clean(md.convert(path.read_text(encoding="utf-8")))
    md.reset()
    target = out / path.relative_to(src).with_suffix(".html")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(TEMPLATE.format(title=path.stem, body=body), encoding="utf-8")
    print(f"{path} -> {target}")
```

Three details do the work. `encoding="utf-8"` on both the read and the write, because the platform default is not UTF-8 everywhere and an em dash is enough to break the job. `sorted()`, so the build order is the same on every machine. `md.reset()` inside the loop, for the reason above.

One trap the script above walks into: `nh3.clean` with no arguments uses ammonia's default allow-list, and `id` is not on it, so the heading anchors `toc` just added are stripped straight back out. Allow the attribute per tag — `attributes={"h1": {"id"}, "h2": {"id"}}` — and prefix the values yourself, because a bare `id` on a heading can shadow a DOM property of the same name.

Choose by requirement: Python-Markdown for extensions and plugins, markdown2 when one call with a list of extras is the whole job, mistune when the HTML has to come out a particular shape, markdown-it-py when it must match the spec. Then write the script and pin the library in your requirements file. If all you need is a page a colleague can open, skip the build — drop the file into [transformpipe](https://transformpipe.com), or have the script POST it to `/api/v1/documents?share=link`, which stores the document and returns the read-only link in one call; the endpoints are in [/docs](/docs).
