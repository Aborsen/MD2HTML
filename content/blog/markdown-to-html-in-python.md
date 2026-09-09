---
title: Rendering Markdown to HTML in Python
description: Python-Markdown, markdown2, mistune and markdown-it-py compared: the extensions each leaves off, sanitising with nh3, and a directory script that fails a build
updated: 2026-09-09
date: 2026-07-07
tag: Code
keywords: markdown to html python, python markdown, markdown2 python, mistune, markdown parser, convert markdown programmatically, python markdown extensions, markdown-it-py, pymdown-extensions, nh3 sanitise html, pypandoc
---

`markdown.markdown(text)` is the first line almost everyone writes, and it works. Then a table goes into the README, the HTML comes back with pipes sitting in a paragraph, and the search starts. Python has four Markdown libraries worth knowing about. The differences between them are mostly about what is switched on by default and how far you can change the output.

### TL;DR

Four libraries, and the choice is narrower than it looks. **Python-Markdown** is the one most Python tooling is built on, and it ships almost nothing switched on — tables, fenced code, footnotes and heading ids are all extensions you have to name. **markdown2** is a single module where the same features are called extras and the spelling is different. **mistune** is the one to reach for when the HTML has to come out a particular shape, because you subclass a renderer instead of running a regular expression over the finished string. **markdown-it-py** is the one to reach for when the same document has to render identically in a browser, because it is a port of the JavaScript markdown-it and follows the CommonMark specification. None of the four sanitises, so whichever you pick, nh3 goes after it.

The friction is always the same shape. A script that worked on a README stops working the week somebody adds a table, or a footnote, or a fenced block with a language on it. Nothing errors. The parser reads the pipe characters as ordinary text, wraps them in a paragraph, and hands back HTML that is perfectly valid and visibly wrong. Silent degradation is the default behaviour of every Markdown parser, because there is no such thing as invalid Markdown — everything the parser does not recognise is prose.

The second thing that bites is that the library's job ends earlier than you think it does. All four return a fragment: `<h1>Title</h1><p>Text</p>` with no doctype, no `<head>`, no styles. Written to a `.html` file and opened, that is black Times New Roman running the full width of the window. The library did its job. The rest — the wrapper, the stylesheet, the sanitiser — is yours, and this piece covers all of it.

## The four libraries at a glance

| Library | Install | Flavour and spec | How it extends | Licence | Best at |
| --- | --- | --- | --- | --- | --- |
| Python-Markdown | `pip install markdown` | Original Markdown syntax by default; not CommonMark-compliant in every detail | Named extensions with an entry-point API, plus large third-party packs | Free, BSD-3-Clause | Documentation builds, and anything already using MkDocs |
| markdown2 | `pip install markdown2` | Its own dialect; not CommonMark | A list of string "extras" passed to one call | Free, MIT | One call, one list, no configuration file |
| mistune | `pip install mistune` | "Compatible with sane CommonMark rules" in its own words | Plugins by name, plus renderer classes you subclass | Free, BSD-3-Clause | Changing the emitted HTML without post-processing it |
| markdown-it-py | `pip install markdown-it-py` | Follows the CommonMark specification for baseline parsing | Presets, individually named rules, and mdit-py-plugins | Free, MIT | Matching a JavaScript front end exactly |

Licences and specification claims checked on pypi.org, python-markdown.github.io, mistune.lepture.com and markdown-it-py.readthedocs.io, 9 September 2026. There are no speed numbers in that table on purpose: every published Markdown benchmark measures a different corpus with a different extension set, and the only number that means anything is the one you get from your own documents.

## The four libraries in depth

### Python-Markdown, and the extensions it leaves off

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

`extra` switches on a bundle — `abbr`, `attr_list`, `def_list`, `fenced_code`, `footnotes`, `md_in_html`, `tables` — and gets you close to what you probably assumed you had (checked on python-markdown.github.io, 9 September 2026). Note what is still missing from it: `nl2br`, `codehilite`, `toc`, `smarty`, `sane_lists` and `meta`. `extra` is a convenience, not a superset, and the two things people most often think it includes — heading ids and syntax highlighting — are exactly the two it leaves out.

The complete official list is short enough to read once and stop guessing:

| Extension | What it does | Worth knowing |
| --- | --- | --- |
| `tables` | GFM-style pipe tables | In `extra` |
| `fenced_code` | Triple-backtick and tilde fences | In `extra`; the info string becomes a language class |
| `footnotes` | `[^1]` references and a footnote list | In `extra`; carries state between documents |
| `attr_list` | `{: .note #id }` after an element sets class, id and attributes | In `extra`; the syntax is invisible to every other parser |
| `def_list` | Definition lists | In `extra` |
| `abbr` | `*[HTML]: HyperText Markup Language` becomes `<abbr>` | In `extra` |
| `md_in_html` | Parses Markdown inside a raw HTML block marked `markdown="1"` | In `extra`; the reason a `<div>` wrapper stops swallowing your text |
| `codehilite` | Syntax highlighting through Pygments | Not in `extra`; needs Pygments installed and a stylesheet |
| `toc` | Ids on headings, a `[TOC]` marker, and `md.toc` | Not in `extra`; carries state |
| `smarty` | Curly quotes, en and em dashes, ellipses | Not in `extra`; changes characters, so diff your output |
| `meta` | Reads a `key: value` header block into `md.Meta` | Not in `extra`; not a YAML parser |
| `nl2br` | A single newline becomes `<br>` | Not in `extra`; this is the GitHub comment behaviour |
| `sane_lists` | Stricter list parsing: a list needs a blank line before it | Not in `extra` |
| `admonition` | `!!! note` blocks | Not in `extra`; the MkDocs callout syntax |
| `wikilinks` | `[[Page]]` becomes a link | Not in `extra` |
| `legacy_attrs`, `legacy_em` | Compatibility with pre-3.0 behaviour | Only for old documents |

Four of those deserve more than a table row.

**`codehilite`** does not highlight anything by itself. It hands the code to Pygments, which emits `<span>` elements carrying class names, and those class names mean nothing until a stylesheet defines them. The extension's own documentation gives you the command that produces one — `pygmentize -S default -f html -a .codehilite > styles.css` — and its options include `linenums`, `guess_lang`, `css_class`, `pygments_style`, `noclasses` and `use_pygments` (checked on python-markdown.github.io, 9 September 2026). `noclasses=True` writes the colours as inline `style` attributes instead, which is bigger and uglier and exactly what you want if the HTML has to survive being pasted into an email. `use_pygments=False` skips Pygments altogether and leaves a language class on the `<code>` element for a client-side highlighter to pick up later — which is the right choice if the page already loads one. [What syntax highlighting actually needs on the page](/blog/code-blocks-in-markdown) is a longer story than "add a fence".

**`toc`** does two jobs and people usually want the second one. It replaces a `[TOC]` marker in the source with a nested list, and it puts an `id` on every heading. Its options include `anchorlink`, `permalink`, `baselevel`, `separator`, `slugify` and `toc_depth`, and after a conversion the instance carries both `md.toc`, the table of contents as an HTML string, and `md.toc_tokens`, the same thing as nested dictionaries (checked on python-markdown.github.io, 9 September 2026). `md.toc` is available whether or not the marker appeared in the document, which is what lets a template put the contents in a sidebar rather than at the top of the text. `baselevel` matters when the template already renders an `<h1>`: set it to 2 and the document's `#` headings come out as `<h2>` instead of fighting the page.

**`meta`** looks like front matter support and is not. It reads a block of `key: value` lines at the top of the file into `md.Meta`, it tolerates `---` delimiters, and its own documentation is explicit that the content is not parsed as YAML. Every value arrives as a list of strings, one entry per line, so `md.Meta["title"][0]` is the title and `md.Meta["title"]` is a list of one (checked on python-markdown.github.io, 9 September 2026). If your files carry real YAML — nested keys, lists, booleans, dates — read the header with `python-frontmatter` or `yaml.safe_load` before the text reaches the parser.

**`attr_list`** is the one that costs you portability. `{: .warning }` after a paragraph is a Python-Markdown convention; on GitHub, in a browser preview, or in any of the other three libraries here, it is five literal characters at the end of your sentence.

For more than one document, build the converter once with `markdown.Markdown(extensions=[...])` and call `.reset()` between files. Footnotes and the table of contents carry state, so without the reset the second page inherits the first page's footnotes. The documentation says the same thing in more words: the parser may need its state reset between each call to `convert` (checked on python-markdown.github.io, 9 September 2026). The corollary matters for the concurrency section below — a `Markdown` instance is a stateful object, so it belongs to one worker, not to a pool.

Two smaller knobs, both documented in the library reference (checked on python-markdown.github.io, 9 September 2026). `output_format` takes `"xhtml"` or `"html"`, and decides whether a line break comes out as `<br />` or `<br>`; the default is `"xhtml"`, which surprises people writing HTML5. And `tab_length` defaults to 4 — if your documents indent nested lists with two spaces, this is why the nesting collapses.

**pymdown-extensions** is what most people actually install on top. It is an MIT-licensed pack under the `pymdownx` namespace, and it carries Arithmatex, B64, BetterEm, Blocks, Caret, Critic, Details, Emoji, EscapeAll, Extra, FancyLists, Highlight, InlineHilite, Keys, MagicLink, Mark, PathConverter, ProgressBar, Quotes, SaneHeaders, SmartSymbols, Snippets, StripHTML, SuperFences, Tabbed, Tasklist and Tilde (checked on facelessuser.github.io, 9 September 2026). Three of those do most of the work: `pymdownx.superfences` replaces `fenced_code` and lets fences nest inside list items and admonitions, `pymdownx.highlight` centralises the Pygments configuration that `codehilite` would otherwise hold, and `pymdownx.tasklist` gives you the GitHub checkbox syntax that Python-Markdown has no official extension for. If you have ever wondered why a MkDocs Material site can do tabbed content and your script cannot, this pack is the answer.

**Who it is for.** Python build scripts, and anyone whose documentation already runs through MkDocs, where Python-Markdown is the engine and the extension list is a configuration file you are editing anyway.

### markdown2 and its extras

markdown2 is a single module with the same shape and a different vocabulary: features are *extras*, and they are also off by default.

```python
import markdown2

html = markdown2.markdown(
    text,
    extras=["tables", "fenced-code-blocks", "strike", "header-ids", "footnotes"],
)
```

There are more extras than anybody remembers, so it helps to see them grouped by what they are for (names checked on github.com, 9 September 2026):

| What you want | Extras |
| --- | --- |
| The GFM features you assumed you had | `tables`, `fenced-code-blocks`, `strike`, `task_list`, `header-ids`, `footnotes` |
| Metadata and structure | `metadata`, `toc`, `numbering`, `cuddled-lists`, `breaks` |
| Code and maths | `code-friendly`, `highlightjs-lang`, `pyshell`, `latex`, `wavedrom`, `mermaid` |
| Typography | `smarty-pants`, `middle-word-em`, `tag-friendly` |
| Links and output shaping | `link-patterns`, `nofollow`, `target-blank-links`, `html-classes`, `xml` |
| HTML interop | `markdown-in-html`, `wiki-tables`, `spoiler`, `tg-spoiler`, `admonitions` |

Three of those are worth singling out. `code-friendly` turns off `_` and `__` as emphasis markers, which is the fix for a document full of `some_variable_name` sprouting italics halfway through. `link-patterns` takes a list of regular expression and replacement pairs and autolinks anything matching — `#1234` into an issue URL, `CVE-2026-…` into an advisory — which is a feature none of the other three libraries ships as a one-liner. And `header-ids` is markdown2's name for what Python-Markdown calls `toc`; if you switch libraries and your anchors break, this is the reason.

The trade-off is fewer moving parts against a smaller ecosystem: if you need something neither library ships, Python-Markdown has a documented extension API and third-party extensions to draw on.

Mind the spelling. The two libraries name the same feature differently — `fenced_code` against `fenced-code-blocks` — so keep the list in one constant rather than retyping it at each call site. Mixing the two up is the usual reason one page renders a table and another prints pipes.

**Who it is for.** A script that needs one import, one call and a list of strings, with no extension registry, no configuration object and no second package. markdown2 is MIT licensed (checked on pypi.org, 9 September 2026).

### mistune, when you want to change the output

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

The plugins that ship with it are `strikethrough`, `footnotes`, `table`, `url`, `task_lists`, `def_list`, `abbr`, `mark`, `insert`, `superscript`, `subscript`, `math`, `ruby` and `spoiler` (checked on mistune.lepture.com, 9 September 2026). Pass them as strings, or import the functions and pass those — the string form is a lookup into `mistune.plugins`.

The real reason to reach for mistune is the renderer. Subclass `HTMLRenderer`, override the method for one node type, and images or links come out the shape you want — carrying `loading="lazy"`, say — with no regular expression run over the finished string.

```python
from html import escape

import mistune
from mistune import HTMLRenderer


class DocRenderer(HTMLRenderer):
    def image(self, alt, url, title=None):
        attrs = f' title="{escape(title, quote=True)}"' if title else ""
        return (
            f'<img src="{escape(url, quote=True)}" alt="{escape(alt, quote=True)}"'
            f'{attrs} loading="lazy" decoding="async">'
        )

    def heading(self, text, level, **attrs):
        slug = attrs.get("id") or text.lower().replace(" ", "-")
        return f'<h{level} id="doc-{slug}">{text}</h{level}>'


render = mistune.create_markdown(renderer=DocRenderer(), plugins=["table", "footnotes"])
```

The method names are the node types, and the signatures are documented: `link(self, text, url, title=None)`, `image(self, alt, url, title=None)`, `heading(self, text, level, **attrs)`, `block_code(self, code, info=None)`, `paragraph(self, text)`, `list(self, text, ordered, **attrs)`, `codespan(self, text)`, `inline_html(self, html)` and the rest (checked on mistune.lepture.com, 9 September 2026). Plugins add their own: `strikethrough(self, text)`, `table_cell(self, text, align=None, head=False)`.

That distinction — override the renderer rather than patch the string — is the whole argument for mistune, and it is worth being concrete about why it matters. Post-processing HTML with a regular expression works until an `<img>` appears inside a code block, or an attribute value contains the character you were matching on, or somebody writes `<img>` in a sentence about HTML. The renderer runs on parsed nodes, so a code fence containing the text `<img src=x>` never reaches `image()` at all; it reaches `block_code()`, as text. There is no case where the two approaches disagree in your favour.

`block_code(self, code, info=None)` is the hook for syntax highlighting: `info` is the string after the opening backticks, so you get the language name and can hand the body to Pygments yourself, with your own class names, without an extension in the middle. mistune also ships `RSTRenderer` and `MarkdownRenderer` alongside `HTMLRenderer`, which is how you use it to normalise Markdown rather than to leave Markdown at all.

**Who it is for.** Anyone whose output has to satisfy a constraint the library does not know about — a content security policy that forbids inline styles, an image pipeline that rewrites `src`, a design system whose tables need a wrapper `<div>` for horizontal scrolling. mistune is BSD-3-Clause licensed (checked on pypi.org, 9 September 2026).

### markdown-it-py, and why CommonMark compliance matters

When the requirement is "matches the spec", markdown-it-py is the direct answer. It is a Python port of the JavaScript markdown-it and tracks CommonMark closely. Presets choose a starting point and rules are enabled by name.

```python
from markdown_it import MarkdownIt

md = MarkdownIt("commonmark")
md.enable(["table", "strikethrough"])
html = md.render(text)
```

The presets are the fastest way to say what you mean (checked on markdown-it-py.readthedocs.io, 9 September 2026):

| Preset | What you get |
| --- | --- |
| `zero` | Paragraphs and text, nothing else — a starting point you build up rule by rule |
| `commonmark` | Strict CommonMark: fenced code, no tables, no strikethrough, no autolinks |
| `js-default` | Raw HTML disabled, tables and strikethrough enabled |
| `gfm-like` | Tables, strikethrough and linkify — needs the `linkify-it-py` package |
| `gfm-like2` | `gfm-like` plus task lists, GitHub-style alerts and single-tilde strikethrough; also needs `linkify-it-py` |

Rules are enabled and disabled by name at the core, block and inline level, permanently through `enable()` and `disable()` or temporarily through a context manager. That granularity is unusual and occasionally the whole point: if your platform must not render images, `md.disable("image")` is a parser-level guarantee, not a filter applied afterwards.

`mdit-py-plugins` is the companion package — `pip install mdit-py-plugins`, alongside `pip install markdown-it-py[linkify]` if you want the linkify presets — and it carries the syntax extensions that are not in the specification: front matter, footnotes, definition lists, containers, anchors, task lists. They are applied with `md.use(plugin)`:

```python
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin
from mdit_py_plugins.footnote import footnote_plugin

md = MarkdownIt("gfm-like").use(front_matter_plugin).use(footnote_plugin)
html = md.render(text)
```

Now the reason compliance matters, stated plainly. A Markdown document rendered twice — once by your Python backend for the emailed copy, once by JavaScript in the browser for the live preview — has to come out the same, and "the same" is not a thing two independently written parsers ever are. Reference-style links, lazy blockquote continuation, how many backticks close a fence, whether a list is loose or tight, what an underscore inside a word does: these are exactly the cases where implementations diverge, and every one of them is pinned down by the CommonMark specification and its test suite. Two parsers that both pass that suite agree. Two parsers that do not both pass it agree until a writer does something slightly unusual, and then the preview and the exported file disagree — which is the bug that takes a day to find, because the document looks fine in the tool where you are looking at it.

markdown-it-py is a port of the JavaScript markdown-it, so the two share not just a specification but an implementation lineage and a plugin vocabulary. That is as close to a guarantee of agreement as you get. Which flavour you are targeting matters more than which library you pick; [CommonMark, GFM and the flavours](/blog/commonmark-gfm-and-the-flavours) sets out the differences, and the same libraries have counterparts covered in [rendering Markdown in JavaScript](/blog/markdown-to-html-in-javascript).

**Who it is for.** Anything with a browser on the other side of it, anything where a rendering difference is a support ticket, and anyone who would rather read a specification than a changelog. It is MIT licensed (checked on pypi.org, 9 September 2026).

## Sanitising the HTML, and the only order that works

None of these four is a sanitiser. Markdown permits raw HTML by design, so a `<script>` tag in the source is a `<script>` tag in the output unless something escapes or removes it. Python-Markdown says as much in its own words: the library does not sanitise its HTML output, and if the input came from an untrusted source, sanitising it is your responsibility (checked on python-markdown.github.io, 9 September 2026).

bleach was the standard answer for years, and it is worth checking its status rather than repeating what you last heard. Its own PyPI page now states that bleach is no longer maintained and that there will be no future releases, including for security issues; the final release was 6.4.0 on 5 June 2026, under Apache 2.0 (checked on pypi.org, 9 September 2026). An unmaintained sanitiser is a worse position than no sanitiser, because it looks like protection in a code review.

The current answer is nh3, an MIT-licensed Python binding to ammonia, the HTML sanitiser written in Rust (checked on pypi.org, 9 September 2026). It is a single function over a well-exercised parser, and it fails closed: anything not on the allow-list is removed.

```python
import nh3

safe = nh3.clean(
    html,
    tags={"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "table",
          "thead", "tbody", "tr", "th", "td", "em", "strong", "blockquote", "hr",
          "img", "sup", "sub", "del"},
    attributes={
        "a": {"href", "title"},
        "img": {"src", "alt", "title", "loading"},
        "code": {"class"},
        "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"},
    },
    url_schemes={"http", "https", "mailto"},
    id_prefix="doc-",
    link_rel="noopener noreferrer nofollow",
)
```

Every argument there is doing something specific, and the keyword names are the library's own (checked on nh3.readthedocs.io, 9 September 2026):

| Argument | What it decides |
| --- | --- |
| `tags` | The element allow-list. Omit it and you get ammonia's default set |
| `attributes` | Which attributes survive, per tag. `"*"` as a key applies to every tag. The default set does not include `id` |
| `url_schemes` | What `href` and `src` may start with. This is where `javascript:` dies |
| `id_prefix` | Prepends a string to every allowed `id`, which is the fix for DOM clobbering |
| `link_rel` | The `rel` value added to links; defaults to `noopener noreferrer` |
| `clean_content_tags` | Tags whose *contents* are removed too — the right treatment for `script` and `style` |
| `strip_comments` | On by default, so conditional-comment tricks do not survive |
| `attribute_filter` | A callback that can rewrite a value instead of dropping the attribute |

`clean_content_tags` is the one people miss. Removing a `<script>` tag while keeping its text leaves the JavaScript sitting in the document as visible prose, which is harmless and looks like a bug. Removing the tag and its contents is what you meant.

Now the order, because this is the part that gets done backwards. Sanitise after rendering, never before. Filtering the Markdown source is guesswork, because the parser is what decides which characters become a tag: a `<` inside a code fence is text, the same `<` in a paragraph starts an element, and a percent-encoded scheme in a link destination is decoded by the parser and not by your regular expression. Any filter that runs on the source has to reimplement the parser to know which is which, and if it could do that it would be the parser. Render first, then clean the HTML — that is the only stage at which the string you are inspecting is the string the browser will receive. [Sanitising Markdown safely](/blog/sanitising-markdown-safely) works through the failure cases in detail.

There is one legitimate exception, and it is not really an exception: refusing raw HTML at parse time. `mistune.create_markdown(escape=True)` and `MarkdownIt("commonmark")` with HTML disabled both mean the parser never emits a raw tag in the first place. That is a stronger guarantee than sanitising, and it is available only because it happens inside the parser rather than in front of it. Use it when the source is untrusted and you do not need any HTML through. Use nh3 when you need some.

TransformPipe is built the same way: marked renders, then DOMPurify in the browser and the `xss` package on the server clean the result against one shared allow-list, so both sides produce the same document. Its heading ids carry a `doc-` prefix, which keeps them out of DOM-clobbering territory — the same job `id_prefix` does above.

## Turning a fragment into a page

All four libraries hand back a fragment, and a fragment is not a document. Three things have to happen to it before anybody else can open the file: a wrapper, styles, and a decision about what the file is allowed to ask the network for.

The wrapper is a template, and Jinja2 is the obvious one because it is already in most Python projects:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title }}</title>
    <style>{{ css }}</style>
  </head>
  <body>
    <main>{{ body|safe }}</main>
  </body>
</html>
```

```python
from jinja2 import Environment, FileSystemLoader, select_autoescape

env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
)
page = env.get_template("page.html").render(title=title, body=safe_html, css=css)
```

Two traps in six lines. The first is `|safe`. With autoescaping on — and it should be on — `{{ body }}` renders your HTML as literal text, and you get a page displaying `<p>Hello</p>` as words. `|safe` is what says "this string is already HTML". The second follows immediately: `|safe` is a promise you are making, so the only string you ever mark safe is one that has already been through nh3. Sanitise, then mark safe, in that order. A template that marks unsanitised parser output as safe has quietly reintroduced every problem the previous section solved.

The styles are the part people skip and then regret. A stylesheet in a `<link>` tag makes the HTML file dependent on a second file; move one and not the other and the page is unstyled. A stylesheet from a CDN makes the file dependent on a network, and tells whoever opens it something about where the file has been. Reading the CSS off disk and passing it into `{{ css }}` inlines it, which is bigger and behaves the same everywhere:

```python
from pathlib import Path

css = Path("assets/page.css").read_text(encoding="utf-8")
if use_pygments:
    css += Path("assets/pygments.css").read_text(encoding="utf-8")
```

That second line is why `codehilite` is not finished when it emits classes — the Pygments stylesheet has to travel with the page or the highlighting is invisible.

Images are the last dependency. `<img src="diagram.png">` in a self-contained file is a broken image on somebody else's machine. Either ship the folder, or read the bytes and inline them as a `data:` URI, which is what a genuinely standalone file needs:

```python
import base64, mimetypes
from pathlib import Path


def inline(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"
```

The test for whether you have finished is simple and takes a minute: copy the `.html` file to a different machine, turn the network off, and open it. Anything that looks wrong is a dependency you did not notice you had.

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

One trap the script above walks into: `nh3.clean` with no arguments uses ammonia's default allow-list, and `id` is not on it, so the heading anchors `toc` just added are stripped straight back out. Allow the attribute per tag — `attributes={"h1": {"id"}, "h2": {"id"}}` — and set `id_prefix="doc-"`, because a bare `id` on a heading can shadow a DOM property of the same name.

Fifteen lines is the demonstration. What it grows into once it runs on a schedule is a script that skips work it has already done, converts files in parallel, and tells a CI job when something went wrong. That is three additions, and each one is worth understanding rather than copying.

```python
#!/usr/bin/env python3
"""Convert docs/**/*.md to build/**/*.html. Exit non-zero if any file fails."""
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import markdown
import nh3
from jinja2 import Environment, FileSystemLoader, select_autoescape

SRC, OUT = Path("docs"), Path("build")
PAGE = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
).get_template("page.html")
EXTENSIONS = ["tables", "fenced_code", "footnotes", "attr_list", "toc", "sane_lists"]
TAGS = {"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "em",
        "strong", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td"}
ATTRS = {"a": {"href", "title"}, "code": {"class"},
         "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"}}


def convert(path: Path) -> tuple[Path, str | None]:
    target = OUT / path.relative_to(SRC).with_suffix(".html")

    if target.exists() and target.stat().st_mtime >= path.stat().st_mtime:
        return path, None

    try:
        md = markdown.Markdown(extensions=EXTENSIONS)
        body = nh3.clean(
            md.convert(path.read_text(encoding="utf-8")),
            tags=TAGS, attributes=ATTRS, id_prefix="doc-",
            url_schemes={"http", "https", "mailto"},
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(PAGE.render(title=path.stem, body=body, toc=md.toc),
                          encoding="utf-8")
    except Exception as error:                      # noqa: BLE001 - report, do not stop
        return path, f"{type(error).__name__}: {error}"

    return path, None


def main() -> int:
    paths = sorted(SRC.rglob("*.md"))

    with ProcessPoolExecutor() as pool:
        results = list(pool.map(convert, paths))

    failures = [(path, error) for path, error in results if error]

    for path, error in failures:
        print(f"{path}: {error}", file=sys.stderr)

    print(f"{len(paths) - len(failures)} of {len(paths)} converted", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
```

**`pathlib` rather than `os.path`.** `rglob("*.md")` walks the tree, `relative_to` gives you the part of the path that should be mirrored into the output directory, `with_suffix(".html")` renames it, and `mkdir(parents=True, exist_ok=True)` creates whatever is missing. The whole path calculation is one expression, and it is the same expression on Windows and on Linux — which matters, because a script that joins paths with `"/"` produces output nobody notices is wrong until it runs on a build agent.

**Skipping by mtime.** `target.stat().st_mtime >= path.stat().st_mtime` is the cheapest useful staleness check there is, and it is exactly what `make` does. It has two known failure modes and you should know both. A change to the template or to the extension list does not change any source file's mtime, so the outputs do not rebuild — the fix is to compare against the template's mtime as well, or to keep a hash of the configuration next to the output. And a checkout is not a copy: some CI systems give every file the checkout time, which makes everything look new and rebuilds the world. That is slow rather than wrong, which is the right way round for a cache to fail.

**A concurrent map.** `pool.map` over a `ProcessPoolExecutor` keeps the code shape of the loop and uses every core. Processes rather than threads, because parsing Markdown is pure Python and CPython's global interpreter lock means threads will not overlap the work; the cost is that arguments and return values are pickled, which is why `convert` returns a small tuple rather than the HTML. It also builds its own `Markdown` instance per call — the instance is stateful, which is the same reason `.reset()` exists, and sharing one across workers is how you get a footnote from one page appearing at the bottom of another.

**An exit code.** `return 1 if failures else 0` is what makes this a build step rather than a script somebody runs. `raise SystemExit(main())` propagates it. Errors go to stderr and the process keeps converting the other files, so one bad document gives you one error message and a complete report rather than a stack trace and no idea how many others were affected. In a GitHub Actions job, a non-zero exit fails the step, and the log already contains the list of files that broke. [Converting many files at once](/blog/batch-convert-markdown-files) covers the variations — flat output, one merged document, watching for changes.

## pypandoc, and when shelling out to Pandoc is the right call

None of the four libraries above reads anything except Markdown, and none of them writes anything except HTML. The moment the job description contains a second format — a Word document that has to become Markdown first, a PDF at the end, a LaTeX manuscript, an EPUB — the honest answer is to stop writing a parser pipeline and call Pandoc.

pypandoc is the thin wrapper. It is MIT licensed, it requires Pandoc itself, and it ships in two flavours: `pypandoc`, which expects Pandoc on the system, and `pypandoc_binary`, which bundles it. There is also `download_pandoc()` for fetching it at runtime (checked on pypi.org, 9 September 2026).

```python
import pypandoc

html = pypandoc.convert_text(
    text, to="html5", format="gfm",
    extra_args=["--standalone", "--embed-resources", "--toc"],
)

pypandoc.convert_file("docs/report.md", to="pdf", outputfile="report.pdf")
```

`convert_text` needs the input format named explicitly; `convert_file` infers it from the extension. Both take `extra_args` for Pandoc's own flags and `filters` for its filter programs. The three flags above are the ones that turn a fragment into a file somebody else can open: `--standalone` produces output with a header and footer rather than a fragment, `--embed-resources` inlines linked scripts, stylesheets and images as `data:` URIs, and `--toc` generates a table of contents (checked on pandoc.org, 9 September 2026).

Reach for it when the pipeline is wider than Markdown to HTML. Do not reach for it when it is not, and be clear about what you are taking on: an external binary in every environment the code runs in, a version of that binary that has to be pinned because output changes between releases, a subprocess per document with the start-up cost that implies, and a converter that passes raw HTML straight through — Pandoc is not a sanitiser either. Against that, it does templates, it embeds assets, it reads and writes formats nothing else touches, and it will outlast your script. [The alternatives, and when each is the better tool](/blog/pandoc-alternatives-for-markdown-to-html) is the fuller comparison.

## What extensions cost you: nothing here is portable

This is the part the library documentation does not put on the front page. Every feature past plain CommonMark is an extension, extensions are per-library, and a document written against one library's extensions is a document that renders correctly in exactly one place.

Work through what that means concretely:

| The syntax | Where it renders | Where it does not |
| --- | --- | --- |
| `{: .warning #note }` | Python-Markdown with `attr_list`, MkDocs | GitHub, markdown-it-py, mistune, markdown2 — shown as literal text |
| `!!! note` blocks | Python-Markdown with `admonition`, MkDocs Material | Everywhere else — a paragraph starting with three exclamation marks |
| `[TOC]` | Python-Markdown with `toc` | Everywhere else — a paragraph containing the word TOC |
| `~~~` fences with attributes | `pymdownx.superfences` | Plain `fenced_code` handles the fence, drops the attributes |
| `- [ ]` task lists | GitHub, `pymdownx.tasklist`, mistune's `task_lists`, `gfm-like2` | Python-Markdown with no extension — a list item starting with brackets |
| `[^1]` footnotes | Python-Markdown, markdown2, mistune, mdit-py-plugins — all four, differently | Plain CommonMark; and the generated ids differ between all four |
| `$x^2$` maths | `pymdownx.arithmatex`, markdown2's `latex`, mistune's `math` | Everything else — and each of the three emits different markup |

The failure is silent in every row. Nothing raises. The document simply contains a sentence that used to be a callout.

So a document that renders in MkDocs is not a document that renders anywhere. It is a document that renders in MkDocs. If your Markdown lives in a repository that people also read on GitHub, or gets pasted into a chat client, or is exported to Word by somebody in another team, then the extensions you switch on are a cost paid by every reader who is not using your build. The way to keep that cost visible is to write down which extensions your documents may use, keep the list in one constant in the code, and test one representative document — with a table, a footnote, a nested list and a code fence — through every renderer that will ever see it.

Footnotes deserve a specific warning, because they are the extension most likely to be enabled by two different libraries in the same organisation. All four support them, none of them generates the same ids, and the back-links differ. Merge two rendered documents into one page and the anchors collide. Convert one document with two different tools and the URLs in the footnote links change, which breaks anything that deep-linked to them.

And there is a cost inside your own build too. Every extension is code running over every document. `codehilite` pulls in Pygments and a stylesheet. `smarty` rewrites characters, so a diff of your output after enabling it is full of changes you did not intend — including inside anything that was not meant to be prose. `nl2br` changes what a soft wrap means, which changes how a paragraph reflows in every document written before you enabled it. Extensions are not free and they are not reversible without a re-render.

## How to choose

1. **Start from what has to see the output.** If a browser renders the same source with a JavaScript library, pick markdown-it-py and match the preset; anything else means the preview and the export will eventually disagree, and you will find out from a reader rather than from a test.
2. **Count the extensions you actually need before you pick the library.** If the list is tables and fenced code, all four do it. If it is admonitions, tabbed content and maths, you are choosing Python-Markdown plus pymdown-extensions whether you meant to or not, and you are accepting that the source only renders there.
3. **Decide who wrote the Markdown.** For your own repository, sanitising is hygiene. For anything that arrived from a user, an API or a client, it is the requirement the rest of the design has to fit around — and it means nh3 after the render, or a parser configured to refuse raw HTML entirely.
4. **Ask whether you need to change the output or only produce it.** If the HTML has to carry particular attributes, wrappers or class names, mistune's renderer saves you a post-processing step that will misfire on the day somebody writes about HTML in a code block.
5. **Check the destination is a document, not a fragment.** A library returns a fragment; if the file is going to a person, something has to add the doctype, the head and the inline styles, and that something is your template. Test it with the network off before you send it.
6. **Pin the library and the extension list together.** A minor release that changes a default, or a colleague who adds one extension to fix one page, changes every page. Both belong in the same commit as the requirements file.
7. **Stop and use Pandoc if the format list is longer than one.** A Markdown-to-HTML library that grows a Word branch and a PDF branch is a worse Pandoc with a smaller test suite.

## Conclusion

Choose by requirement: Python-Markdown for extensions and the documentation ecosystem built on them, markdown2 when one call with a list of extras is the whole job, mistune when the HTML has to come out a particular shape, markdown-it-py when it must match the specification and a browser. Then add nh3 after the render, put the fragment in a template that inlines its own styles, and give the script an exit code so a broken document fails a build instead of shipping. If all you need is a page a colleague can open, skip the build entirely — [convert the file in the browser](/) and download the self-contained HTML, or have the script POST it to the API and get a read-only link back in one call.

## FAQ

### Which Python library should I use to convert Markdown to HTML?

Python-Markdown if you are in a documentation toolchain that already uses it, markdown-it-py if a browser has to render the same source identically, mistune if you need to change the emitted HTML, and markdown2 if you want one import and one call. All four are free and open source, and none of them sanitises.

### Why does my Python-Markdown output show pipe characters instead of a table?

Because `tables` is an extension and it is off unless you name it: `markdown.markdown(text, extensions=["tables"])`. The same applies to fenced code blocks, footnotes and heading ids. The `extra` bundle switches on seven extensions including `tables`, but not `toc` or `codehilite`.

### Is bleach still the right way to sanitise HTML in Python?

No. Bleach's own PyPI page states that it is no longer maintained and that there will be no future releases, including for security issues, with a final 6.4.0 release on 5 June 2026 (checked on pypi.org, 9 September 2026). nh3, a binding to the Rust ammonia library, is the current replacement and takes an explicit tag and attribute allow-list.

### Should I sanitise the Markdown or the HTML?

The HTML, always, and after rendering. The parser is what decides which characters in the source become tags, so a filter running on the Markdown has to guess, and it guesses wrong on code fences, link destinations and escaped characters. The alternative is to configure the parser to refuse raw HTML in the first place, which is stronger still.

### How do I get syntax highlighting in Python-Markdown?

Enable `codehilite`, install Pygments, and generate the stylesheet — the extension's documentation gives the command as `pygmentize -S default -f html -a .codehilite > styles.css` (checked on python-markdown.github.io, 9 September 2026). Without that stylesheet the classes are there and the colours are not. `noclasses=True` writes inline styles instead, which survives being pasted somewhere without the CSS.

### What is pymdown-extensions and do I need it?

It is an MIT-licensed pack of extensions for Python-Markdown under the `pymdownx` namespace, including SuperFences, Highlight, Tabbed, Tasklist, Details and Arithmatex (checked on facelessuser.github.io, 9 September 2026). You need it if you want tabbed content, nested fences, task lists or maths, none of which Python-Markdown ships officially. You do not need it for tables, footnotes or code fences.

### Can I make Python and JavaScript render the same Markdown identically?

Close to it, by using markdown-it-py in Python and markdown-it in JavaScript — the former is a port of the latter, both follow the CommonMark specification, and the plugin names largely match. Keep the preset and the enabled rules in one shared configuration, because a difference in that list produces a difference in the output that neither side reports.
