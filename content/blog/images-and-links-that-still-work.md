---
title: Images and links that still work after you send the file
description: Relative paths, GitHub raw URLs, data URIs, alt text, SVG and heading anchors: why a Markdown image or link breaks when the file moves, and how to fix each one
updated: 2026-09-09
date: 2026-08-01
tag: Syntax
keywords: markdown image, markdown image not showing, markdown relative link, markdown anchor link, markdown link to heading, markdown base64 image, self contained html, single file html, markdown image size, markdown alt text, github raw image url, markdown svg image, markdown broken link checker
---

A Markdown file is written inside a folder, and half of it quietly depends on that folder. `![Flow](img/flow.png)` looks right in the editor, looks right in the repository, and shows a broken-image icon the moment a colleague opens the converted HTML from their Downloads folder. Nothing in the file changed. Its neighbours did.

### TL;DR

Pictures and cross-links resolve against wherever the rendered page ends up, not against the folder you wrote in, so moving the file moves the answer. Absolute public URLs and data URIs survive the trip; relative and root-relative paths survive only if the folder or the site travels with them. Heading anchors break for a different reason — GitHub, Pandoc, markdown-it and marked each turn a heading into an id differently, so a link that works in the repository can miss in the export. Convert once, read the `src` and `href` values the converter actually produced, and fix the ones that only resolve from your own desk.

The failure has a signature: the author never sees it. On the machine where the document was written every path resolves, because that machine is the one the paths were written for. The reader gets grey boxes with torn-corner icons, decides the document is half-finished, and usually says nothing about it.

Two separate systems are involved and they fail for unrelated reasons. An image is a reference to bytes stored somewhere else, and it breaks when the somewhere else moves. An anchor is a reference to an id the renderer invented while converting, and it breaks when a different renderer invents a different id. Both are promises about a place, and both are checked at the moment somebody else opens the file — which is the worst possible moment to find out.

## The three kinds of path, and what each survives

A URL in Markdown comes in a few shapes, each assuming something different about where the document lands.

| Written as | Kind | Resolved against | Survives being sent? |
| --- | --- | --- | --- |
| `img/flow.png` | relative | the folder the page is served from | only if that folder travels too |
| `../assets/flow.png` | relative | the folder above it | same, and one level more fragile |
| `/assets/flow.png` | root-relative | the root of the current site | only within that same site |
| `https://example.com/flow.png` | absolute | nothing, it is already complete | yes, as long as the host serves it |
| `data:image/png;base64,…` | none — the bytes are here | nothing at all | yes, at a size cost |

The detail that catches people out: a markdown relative link resolves against the URL of the *rendered page*, not against the folder the `.md` file lived in. Convert `docs/guide.md`, open the HTML from your desktop, and `img/flow.png` now means an `img` folder on your desktop. The path was never wrong; it was answering a question nobody asks any more.

Root-relative is the shape people misjudge most. A leading slash does not mean "the top of my project" — it means the root of whatever origin is serving the page. Deploy the same file to a site where the assets live at `/assets/`, and it is the most stable of the relative forms. Open it as a local file, and the browser reads the slash as the root of the disk: `/assets/flow.png` becomes `C:\assets\flow.png` on Windows and `/assets/flow.png` on a Mac, neither of which exists. Root-relative paths are for sites. They are actively worse than plain relative paths for a file somebody downloads.

Absolute URLs survive everything except the host. They are the only form that works identically in a repository, an export, a wiki and an email — provided the host is public, stays up, and does not object to being linked from elsewhere. That last clause is doing more work than it looks: images served from a private bucket, a chat tool's CDN, a Confluence attachment or a signed URL all return an absolute-looking address that only works while the reader carries your session or before the signature expires.

### Where the file ends up, and which paths still resolve

The same document goes to five places over its life. Here is what happens to each kind of path at each stop.

| Destination | `img/flow.png` | `../assets/flow.png` | `/assets/flow.png` | `https://…/flow.png` | Data URI |
| --- | --- | --- | --- | --- | --- |
| The `.md` rendered on a repository page | works | works, if the parent folder is in the repository | fails — resolves against the code host's root | works | works |
| A converted HTML file in someone's Downloads | fails unless you copied `img/` too | fails | points at the root of their disk | works, with a connection | works |
| An email body | fails | fails | fails | only if the client agrees to fetch remote images | works |
| A static site with the assets deployed alongside | works | works, until you move the page | works | works | works |
| A PDF printed from the browser | baked in only if it resolved at print time | same | same | same | works |
| Pasted into a wiki or a ticket | fails | fails | fails | works if the host is public | usually stripped by the wiki's sanitiser |

The PDF row is the one worth staring at. Printing does not fix a broken path, it photographs it: whatever the browser had at that moment is what lands in the file, so a document printed on the author's machine looks perfect and a document printed by the recipient has holes in exactly the same places their screen did. If a PDF is the destination, get the images right first: printing assumes the page already renders.

### GitHub: a blob URL is a page, not an image

Open an image in a repository, copy what is in the address bar, and you get something like `https://github.com/acme/docs/blob/main/assets/flow.png`. Paste that into `![Flow](…)` and the reader gets a broken image, because that URL does not return a PNG. It returns an HTML page — the file viewer, with the header, the breadcrumb, the sidebar and the picture inside it. The browser asked for an image and was handed a web page, so it drew the broken-image icon.

| URL shape | What the server returns | Usable in `![]()`? |
| --- | --- | --- |
| `https://github.com/o/r/blob/main/a/flow.png` | an HTML page displaying the image | no |
| `https://github.com/o/r/blob/main/a/flow.png?raw=true` | a redirect to the file bytes | yes |
| `https://raw.githubusercontent.com/o/r/main/a/flow.png` | the file bytes | yes |
| `assets/flow.png`, relative, inside a `.md` in the repository | resolved against the file's own folder | yes, on the repository page |

GitHub's own guidance is to prefer relative links for images that live in the repository, and it gives `../blob/main/assets/images/electrocat.png?raw=true` as the shape to use inside issues, pull requests and comments — with the warning that those forms only work in a private repository for a viewer who already has read access to it (checked on docs.github.com, 9 September 2026).

Two further traps live in those URLs. The branch name is part of the address, so `…/blob/main/…` follows `main` and moves when `main` moves, while `…/blob/a1b2c3d/…` pins to a commit and never changes — pick deliberately, because a diagram that silently updates is either exactly what you wanted or a document quoting a picture that no longer matches its prose. And a raw URL from a private repository is not a public URL; it needs the reader's session in the same way a chat attachment does, which is why a screenshot pasted from Slack renders for you and for nobody else.

## Why a Markdown image is not showing

When a markdown image does not appear, the cause is almost always one of these.

- **The path points at the old location.** Move the file, move the pictures, or switch to absolute URLs.
- **The case does not match.** `Diagram.PNG` and `diagram.png` are one file on a Mac or Windows disk, which ignores case by default, and two on the Linux machine serving your site.
- **There is a space in the filename.** Wrap the target in angle brackets, `![Flow](<my diagram.png>)`, or percent-encode it as `my%20diagram.png`.
- **The image is behind a login.** URLs pasted from a chat tool, a private repository or a wiki usually need the reader's session; a stranger gets nothing.
- **You linked a page rather than a file.** The blob URL case above, and the same mistake happens with cloud drives, which hand out a viewer URL rather than the bytes.
- **The page is HTTPS and the image is HTTP.** Browsers block mixed content, silently, and the console is the only place it says so.
- **A sanitiser removed the tag.** An allow-list that permits `img` may still refuse a `data:` source or an `svg` element, and what it refuses it deletes.
- **The tag never was a tag.** An escaped `\!`, an image inside a fenced code block, or a stray backtick, and the renderer emitted text that looks like an image tag because it is one.

The fastest way to tell these apart is to stop guessing and ask the browser. Open the page, open the network tab, reload, and read the status code for the image that failed.

| What you see | What the network tab says | Usually means |
| --- | --- | --- |
| Broken icon, alt text visible | 404 | the path is wrong for where the page is being served from |
| Broken icon | 403 | private repository, expired signed URL, or hotlink protection |
| Broken icon | 200 with `text/html` | you linked a page, not a file |
| Nothing, no request at all | no entry | escaped, sanitised away, or inside a code fence |
| Fine for you, broken for them | 200 for you | the image is behind your session |

That table is also the reason to check the *converted* file rather than the editor preview. A preview resolves paths against the folder the source sits in, which is precisely the assumption that stops holding the moment the document travels.

## Data URIs, and the arithmetic behind them

A data URI puts the bytes in the document: a markdown base64 image is an ordinary image with the encoded file where the path would go.

```markdown
![Company logo](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...)
```

The honest trade-off: base64 encodes three bytes as four characters, so the image grows by about a third before you count the rest of the document. A 2 MB screenshot arrives as roughly 2.7 MB of text sitting in the middle of your prose, impossible to diff, and re-sent with every copy. Browsers cannot cache it separately either.

Do the arithmetic before you decide, because the multiplier is fixed and the numbers get uncomfortable quickly. Base64 reads three bytes and writes four characters, so 4/3 is the floor — roughly a 33% increase — and padding plus any line wrapping pushes it a little past that.

| The image on disk | Encoded as base64 | What that means in practice |
| --- | --- | --- |
| 12 KB icon | about 16 KB | free; embed dozens without noticing |
| 120 KB diagram | about 160 KB | comfortable |
| 800 KB screenshot | about 1.1 MB | three of these dominate the document |
| 2 MB photograph | about 2.7 MB | one picture is now most of the file |
| 4 MB photograph | about 5.4 MB | past most sensible limits on its own |

Those limits are real rather than theoretical. The converter behind this site caps a single conversion at 10 MB and a document kept in an account at 4 MB, because the Vercel function underneath rejects any request or response body over 4.5 MB with a 413 (checked on vercel.com, 9 September 2026). Every hosting arrangement has a number like that somewhere, and base64 is the fastest way to find it.

The other costs are not measured in bytes. An embedded image cannot be cached separately, so a reader who opens the document twice downloads it twice. It cannot be diffed: change one pixel and the version control history records a thousand-line change with no readable content. It cannot be replaced without editing the prose file. And every forward, every reply, every copy carries the whole thing again.

That makes data URIs right for a narrow set of cases: an icon, a logo, a small diagram, a signature, a chart in a document that must travel alone and arrive complete. For screenshot-heavy documents, host the images and use absolute URLs — or accept that the document is now a 15 MB file and send it deliberately rather than by accident.

The trade is still worth making more often than people expect, because the thing you get back is a file with no dependencies. [What "self-contained" actually promises](/blog/self-contained-html-explained) is a page whose styles are already inside it; put the pictures inside it too and you have a document that renders identically on a laptop in a hotel with no connection, on a locked-down corporate machine that blocks unknown hosts, and in three years when the bucket the images lived in has been deleted. Nothing else on this page buys you that.

## Alt text, sizing, SVG and theme: the attributes Markdown does not have

Markdown's image syntax has exactly three slots — a URL, alt text, and an optional title — and everything else people want from an image lives outside them. That gap is where raw HTML enters a Markdown file, and raw HTML is where converters start disagreeing with each other.

### Alt text is what a screen reader reads

Alt text is not a caption. A caption is visible to everybody and sits beside the picture; alt text replaces the picture for a reader who is not getting one. MDN puts it plainly: the attribute "holds a textual replacement for the image", and screen readers read the value out so their users know what the image means (checked on developer.mozilla.org, 9 September 2026). It is also what the browser draws in the gap when the path is wrong, which makes it the single most useful thing in a document whose images have broken.

So write what the picture *says*, not what it *is*. "Architecture diagram" tells a listener nothing. "Requests hit the queue, a worker writes to the store, the API reads from it" is the same information the sighted reader takes from the diagram in two seconds.

The exception is a picture that says nothing: a divider, a spacer, a decorative flourish. For those, an empty string is correct and deliberate. MDN: setting `alt=""` "indicates that this image is not a key part of the content (it's decoration or a tracking pixel), and that non-visual browsers may omit it" — and visual browsers also hide the broken-image icon when alt is empty and the image failed to display (checked on developer.mozilla.org, 9 September 2026). An empty alt is two wins at once: the screen reader stays quiet, and a broken decorative image leaves no scar on the page.

Markdown's third slot is the title. `![Flow](img/flow.png "Figure 3: the ingest path")` puts that quoted string into a `title` attribute, and most converters emit it faithfully. Almost nothing useful happens next. A `title` shows as a tooltip on hover, so it is invisible on any touch device, unreliable with assistive technology, and gone entirely if the sanitiser's allow-list does not include the attribute. Treat it as decoration. If the words matter, put them in the prose underneath, where every reader gets them.

| You write | What comes out | Who actually receives it |
| --- | --- | --- |
| `![Ingest path](flow.png)` | `alt="Ingest path"` | screen reader users, and anyone whose image failed |
| `![](rule.png)` | `alt=""` | nobody, by design — no announcement, no broken icon |
| `![Ingest path](flow.png "Figure 3")` | `alt="Ingest path" title="Figure 3"` | a mouse hover, if the attribute survived |
| A line of italics under the image | an ordinary paragraph | everybody, always |

### Sizing: there is no syntax, so people reach for HTML

Neither CommonMark nor GitHub Flavored Markdown has a width. There is no `![Flow](flow.png){width=400}`, no percentage, no `=400x`. Some editors implement a size extension of their own, and an extension is not a specification: wherever it is not implemented, the reader sees the literal characters in the middle of the sentence.

So the usual move is raw HTML, `<img src="flow.png" width="400" alt="Ingest path">`, and that has three possible endings depending on the converter.

| The converter | What happens to `<img … width="400">` |
| --- | --- |
| Passes raw HTML through | it works, and so does anything else in the file |
| Escapes raw HTML by default | the reader sees the tag as visible text |
| Sanitises against an allow-list | the `img` survives, the `width` may not, and the image renders full size |

The third is the confusing one, because it half-works. The picture appears, at whatever size it was saved, and nothing anywhere says an attribute was dropped. An allow-list is a list of what is permitted, so an attribute nobody thought to add is simply absent — which is the correct behaviour for a security control and a baffling one for an author. It is the clearest case for [writing the fragment in HTML in the first place](/blog/markdown-vs-html) when a document genuinely depends on layout.

The durable answer is to resize the file. A diagram that will be displayed at 400 pixels, saved at 400 pixels, needs no attribute, cannot lose one, is smaller to send, and is sharper than the same image scaled down by a browser. Fixing it in the image is a fix that survives every converter.

### SVG: inline against linked, and where the script gets in

An SVG is not a picture file in the sense the others are. It is XML, and the format includes a `<script>` element of its own — MDN describes it as the SVG equivalent of HTML's, using `href` rather than `src` (checked on developer.mozilla.org, 9 September 2026) — along with event attributes and the ability to reference external resources.

Whether that matters depends entirely on how the file enters the document.

Referenced as an image, it is a picture and the browser treats it as one. MDN's own list of restrictions on SVG used as an image is explicit: JavaScript is disabled, external resources such as images and stylesheets cannot be loaded, `:visited` link styles are not rendered, and platform-native widget styling is off. Those restrictions apply when the SVG is loaded through `<img>`, a CSS `background-image`, a canvas `drawImage()` and similar contexts — and they do not apply when the file is opened directly or embedded through `<iframe>`, `<object>` or `<embed>` (checked on developer.mozilla.org, 9 September 2026).

Inlined, it is not an image at all. Pasting `<svg>…</svg>` markup into your Markdown puts those elements in the page's own DOM, where its scripts are the page's scripts and its ids can collide with the page's ids. And inlining is exactly what people do, because it is the only way to style a diagram with the page's CSS so it follows the theme.

| | Inline `<svg>…</svg>` | `<img src="chart.svg">` |
| --- | --- | --- |
| Travels inside the file | yes | no, unless the source is a data URI |
| Styleable by the page's CSS | yes | no |
| Scripts inside it can run | yes | no — disabled for SVG-as-image |
| Survives a sanitiser | depends on the allow-list | usually, it is an ordinary `img` |
| Safe to accept from a stranger | no | treat it as a picture |

The rule that falls out of this is short: an SVG you drew is fine either way; an SVG from somewhere else — a badge, an icon set, a chart a tool generated, a diagram a client sent — should be referenced, not inlined. If you must inline it, open it in a text editor first and read it. It is XML. You can see everything it does.

### Images that follow the reader's theme

A diagram with black lines on a transparent background vanishes on a dark page, and roughly half your readers now have a dark page. The standards answer is the `<picture>` element: zero or more `<source>` elements followed by exactly one `<img>`, where each source carries a `media` condition, the browser takes the first that matches, and the `<img>` is the fallback when none do. Alt text goes on the `<img>`, not on the `<picture>` (checked on developer.mozilla.org, 9 September 2026).

```html
<picture>
  <source srcset="flow-dark.png" media="(prefers-color-scheme: dark)">
  <source srcset="flow-light.png" media="(prefers-color-scheme: light)">
  <img src="flow-light.png" alt="Requests hit the queue, a worker writes to the store">
</picture>
```

GitHub supports this form for theme-specific images, and has deprecated its earlier approach of appending `#gh-dark-mode-only` or `#gh-light-mode-only` to the image URL in favour of it (checked on github.blog, 9 September 2026). If you have that fragment syntax in an old README, it is on borrowed time.

Two caveats, both from earlier in this section. It is raw HTML, so it meets the same three fates as a `width` attribute: passed through, escaped, or partly sanitised. And a sanitiser that allows `img` may not allow `picture` and `source`, in which case what your reader gets is the fallback — which is a good argument for making the fallback the light-background version, the one that is legible on white, and for putting the alt text where it belongs.

There is also a fix that needs no HTML at all: give the diagram an explicit background and mid-tone ink, so it reads on white and on charcoal alike. A picture that does not need to know the theme cannot get the theme wrong, and it survives every converter, every sanitiser and every email client on this page.

## Anchor links, and how the slug is made

A markdown anchor link is a link to a heading in the same document: `[see below](#installing-the-cli)`. The id it points at is generated from the heading text, and the recipe is roughly the same everywhere. Lowercase the text, drop punctuation, turn runs of whitespace into hyphens, and add a number when two headings collide.

Roughly the same is not the same, and this is the reason a contents list that works perfectly in the repository arrives at the reader with half its entries doing nothing. Each renderer implements its own slug function, and the differences are small enough that most links survive and large enough that some do not.

GitHub documents its rule in one sentence: letters are converted to lower case, spaces are replaced by hyphens, and any other whitespace or punctuation characters are removed (checked on docs.github.com, 9 September 2026). Pandoc documents a longer recipe, and one of its steps is unlike anybody else's — it removes everything up to the first letter, because an identifier may not begin with a number or a punctuation mark, so `## 3. Applications` becomes `applications` rather than `3-applications`. Duplicate headings get `-1`, then `-2`, and if nothing is left after the stripping the identifier is `section` (checked on pandoc.org, 9 September 2026). Turning on `gfm_auto_identifiers` switches Pandoc to GitHub's method instead: spaces to dashes, upper case to lower, punctuation other than `-` and `_` removed, emoji replaced by their names.

The JavaScript libraries are stranger, because two of the most widely used ones do not produce ids at all unless you ask. marked removed its `headerIds` and `headerPrefix` options in v8.0.0 and points at the separate `marked-gfm-heading-id` package for anyone who wants them (checked on marked.js.org, 9 September 2026). markdown-it does not emit heading ids on its own either; the usual answer is markdown-it-anchor, which describes itself as a plugin that "adds an `id` attribute to headings and optionally permalinks", disambiguates duplicates with a numeric suffix starting at 1, and lets you replace the slug function entirely; it is free, released under the Unlicense (checked on github.com, 9 September 2026).

| Heading in the source | GitHub | Pandoc, default | Pandoc + `gfm_auto_identifiers` | markdown-it + markdown-it-anchor | marked, unextended |
| --- | --- | --- | --- | --- | --- |
| `## Installing the CLI` | `installing-the-cli` | `installing-the-cli` | `installing-the-cli` | `installing-the-cli` | no id emitted |
| `## 3. Applications` | `3-applications` | `applications` | `3-applications` | whatever the slug function does | no id emitted |
| `## Maître d'hôtel` | `maître-dhôtel` | `maître-dhôtel`, or `maitre-dhotel` with `ascii_identifiers` | `maître-dhôtel` | depends on the slug function | no id emitted |
| `## Notes` appearing twice | a numeric suffix | `notes`, then `notes-1` | a numeric suffix | `notes`, then `notes-1` | no id emitted |
| Punctuation, generally | removed except hyphens | removed except `_`, `-` and `.` | removed except `-` and `_` | configurable | — |

The row that costs people the most is the numbered one. Documentation is full of `## 1. Prerequisites` and `## 2. Installing`, and a contents list built for GitHub aims at `#1-prerequisites` while a Pandoc build produces `#prerequisites`. Every link in the list misses. Nothing errors: a fragment that matches no id is not a failure in HTML, it is a request to scroll to nothing, and the browser obliges by staying exactly where it is. The reader clicks, nothing moves, and concludes the page is broken in some vague way they cannot describe.

The other quiet divergence is the prefix. transformpipe prefixes every heading id with `doc-`, so `## Installing the CLI` becomes `id="doc-installing-the-cli"` and the link has to be `#doc-installing-the-cli`. The prefix exists to keep ids out of DOM-clobbering territory, which is the same reasoning behind [sanitising the output at all](/blog/sanitising-markdown-safely). Other tools prefix for their own reasons, and a prefix defeats every hand-written anchor at once.

So convert first and read the ids the converter produced instead of guessing. Open the output, search it for `id="`, search it for `href="#`, and compare the two lists — anything in the second that is missing from the first is a dead link, and the check takes less time than writing the contents list did. There is a structural fix too: give the heading an explicit id where the renderer supports it, or link to a stable heading rather than a numbered one. Renaming a heading silently breaks every anchor aimed at it, which is a reason to keep the contents list short in [documentation that lives in the repository](/blog/documentation-that-lives-in-the-repo).

## Reference-style links, and checking every destination automatically

Inline links clutter the sentence. Reference style moves every URL to the bottom and leaves a short label behind.

```markdown
The [style guide][guide] changed, and so did the [API reference][api].
Read the [style guide][guide] again before you file anything.

[guide]: https://example.com/style
[api]: https://example.com/api/v1
```

The label is reused as often as you like, the URL written once, so a moved domain is one edit rather than a hunt through paragraphs. It also gives you one block to audit before sending: every destination the document points at. A long base64 blob belongs down there too, and so do images — `![Flow][flow]` with `[flow]: assets/flow.png` at the foot of the file keeps a 40 KB data URI out of the middle of a sentence.

That block is also the thing a machine can read. Once every destination is in one place, checking them stops being a job for a person.

### A checker you can actually verify

lychee is a link checker written in Rust, described by its own repository as a "fast, async, stream-based link checker" that "finds broken URLs and mail addresses inside Markdown, HTML, reStructuredText, websites and more". It is free and dual-licensed under Apache 2.0 or MIT, and there is an official GitHub Action, `lycheeverse/lychee-action` (checked on github.com, 9 September 2026). Point it at your `.md` files and it reports what no longer resolves.

Where it belongs is two places, not one.

| When it runs | What it catches | What it should do on failure |
| --- | --- | --- |
| On every pull request touching `.md` | the link you typed wrong ten minutes ago | fail the check — the author is right there |
| On a schedule, weekly or nightly | the link that rotted last month | open an issue, do not fail a build |

The split matters because the two failures have different owners. A pull-request run only looks at what the pull request changed, so it will never notice that a vendor reorganised their documentation in June. A scheduled run notices, but blocking a deploy because somebody else's website is down for ten minutes punishes the wrong person. Wire the scheduled run to file an issue instead, alongside whatever else you already [publish from a workflow](/blog/publish-markdown-from-github-actions).

And be clear about what no checker can do for you. It resolves relative paths against the repository, because the repository is where it is standing — so `img/flow.png` passes, every time, including the run immediately before you send the export to somebody whose Downloads folder has no `img` in it. The exact failure this article is about is invisible to the tool that checks the source. Check the output.

## The honest part: an emailed document either carries its pictures or has none

Everything above assumes the reader's software will fetch a picture when told to. Email is the place where that assumption is simply false, and it is false on purpose.

Outlook "is configured by default to block automatic picture downloads from the Internet", and Microsoft gives four reasons: potentially offensive linked content, malicious code, the bandwidth cost of downloading images the reader did not ask for, and tracking pixels — invisible images that tell a sender the message has been read (checked on support.microsoft.com, 9 September 2026). Every other mail client behaves broadly the same way, because the tracking-pixel problem is the same for all of them.

So an HTML document pasted into an email body, with images referenced by URL, arrives as prose and grey rectangles with a bar across the top offering to download pictures. Some readers click it. Many do not, and a few work somewhere that has removed the option entirely. This is not a bug on your side and there is no header, attribute or trick that fixes it: the client is protecting its user from exactly the mechanism you are relying on.

That leaves two honest options and no third.

**The document carries its pictures.** Every image becomes a data URI, and the message contains the bytes rather than a request for them. Nothing is blocked because nothing is fetched. The cost is the arithmetic from earlier: a document with six screenshots is a message several megabytes wide, forwarded in full every time, sitting in mailboxes with quotas, and passing through gateways that sometimes rewrite HTML mail on the way. Some corporate filters strip `data:` sources for the same reason a wiki's sanitiser does.

**The document has no pictures.** The diagram becomes a sentence, the screenshot becomes a table, the chart becomes three numbers, and the message is small, fast and legible everywhere including the phone on the train. The cost is that you have to do the translation, and some things genuinely do not translate — a flame graph is not a sentence.

There is a middle road that trades one failure for the other. Attach the converted HTML file rather than pasting it into the body: the reader downloads it and opens it in a browser, which fetches images normally, so remote URLs work again. In exchange, every relative path is now resolving against their Downloads folder, which is where this article started. There is no arrangement with neither problem. There is only choosing which one you would rather explain.

## What to check before you send the file

Self-contained HTML is a claim about presentation, rarely about content. In a single-file HTML document the styles are inline, there are no scripts and nothing is fetched to make the page look right — the transformpipe download works that way. What that never covers is a picture you pointed somewhere else. `<img src="diagram.png">` still means `diagram.png`, next to wherever the reader put the file.

The criteria below are what to decide, in order, before the file leaves your machine.

1. **Decide the destination before you write the path.** A document that will be opened from a Downloads folder can use neither a relative path nor a root-relative one: `../assets/flow.png` escapes the folder you are sending, and a leading slash points at the root of the reader's disk. Decide first and you write each path once instead of finding them all again later.
2. **Embed what is small, host what is large.** Base64 adds about a third to the bytes, so an icon costs nothing and a screenshot costs a megabyte of unreadable text wedged into the prose, re-sent with every copy and invisible to every diff.
3. **Give every meaningful image alt text and every decorative one an empty `alt`.** The first is what a screen reader announces and what fills the gap when the image fails; the second keeps a spacer from being read aloud and hides the broken-image icon when it does not load.
4. **Never inline an SVG you did not draw.** Inlined, it joins the page's DOM and its scripts become the page's scripts; referenced from an `img`, the browser disables its scripting and treats it as the picture you thought you were getting.
5. **Assume every raw HTML attribute is optional.** Width, height, `picture`, `source`, `title` and `class` all live at the mercy of an allow-list, so any layout that only works when the attribute survives will eventually be seen without it.
6. **Read the ids the converter produced, not the ones you expected.** Slug algorithms differ between renderers, and an anchor that matches nothing fails silently — no error, no console warning, just a page that refuses to scroll.
7. **Run a link checker on pull requests and on a schedule.** The first catches the link you got wrong today; only the second catches the one that rotted while nobody was editing that file.
8. **Open the export from a different folder, on a different machine, with the network off.** That one test catches missing files, root-relative paths, CDN dependencies and hotlink blocks together, and it takes about a minute.

Then do the pass that costs a minute. Convert your file, open the HTML source tab, and search it for `src="` and `href="`. Read every value and ask where it resolves from the reader's machine, not yours. Fix the ones that answer wrongly, then send the file — or skip the attachment and [share it as a link](/blog/share-a-markdown-document-as-a-link), which saves the reader a download but not a relative path: that still resolves against the page it is served from, where the images were never put.

## Conclusion

Every broken picture and dead anchor in a converted document comes from the same mistake, made twice: a reference was written down while standing in one place and read while standing in another. Absolute URLs and data URIs are the two shapes that do not care where the reader stands, alt text is what remains when the picture does not arrive, and heading ids are worth reading rather than predicting because four renderers will give you four answers. None of it is difficult; all of it is invisible from the machine the document was written on. So [convert the file](/), open the output, read every `src` and `href` it produced, and ask each one where it points from somebody else's desk — that single pass is the difference between a document that survives being sent and one that arrives full of grey boxes.

## FAQ

### Why is my Markdown image not showing?

Nine times out of ten the path is relative and the file has moved, so it now resolves against a folder that has no picture in it. Open the browser's network tab and read the status: 404 is a wrong path, 403 is permissions or hotlink protection, and a 200 that returns HTML means you linked a page rather than a file.

### How do I link an image stored in a GitHub repository?

Use a relative path if the Markdown is being read on the repository page, which is what GitHub itself recommends. If you need an absolute URL, use `raw.githubusercontent.com` or append `?raw=true` to the blob URL — the plain `…/blob/…` address returns an HTML page, not an image, and will always render broken.

### Should I base64-encode images in Markdown?

For icons, logos and small diagrams in a document that must travel alone, yes. Base64 makes the data about a third larger than the file, so a 2 MB screenshot becomes roughly 2.7 MB of text in the middle of your prose that cannot be cached, diffed or replaced separately — above a few hundred kilobytes, host the image instead.

### Can I set an image width in Markdown?

Not in CommonMark or GitHub Flavored Markdown, which give you a URL, alt text and an optional title and nothing else. People reach for raw `<img width="400">`, but a converter may escape the raw HTML or sanitise the attribute away, so resizing the actual image file is the only fix that works everywhere.

### Why does my link to a heading work on GitHub but break in the exported HTML?

Because the two renderers slug headings differently. GitHub lower-cases, hyphenates spaces and strips punctuation; Pandoc additionally removes everything up to the first letter, so `## 3. Applications` becomes `#applications` rather than `#3-applications`; marked and markdown-it emit no ids at all without a plugin. Read the ids in the output rather than assuming them.

### Will my images show up if I email the converted HTML?

Only if they are embedded. Outlook blocks automatic picture downloads from the internet by default, largely to defeat tracking pixels, and other clients do the same, so an emailed document with remote image URLs arrives as prose and grey boxes until the reader chooses to load them.

### What is the difference between alt text and a caption?

A caption is visible to everyone and sits near the image, adding something the picture does not say by itself. Alt text replaces the image for a reader who is not receiving one — a screen reader user, or anyone whose image failed to load — so it should say what the picture communicates, and be empty when the picture communicates nothing.
