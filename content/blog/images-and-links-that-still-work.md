---
title: Images and links that still work after you send the file
description: How Markdown images, relative paths and heading anchors behave once the converted HTML leaves the folder it was written in, and how to fix each one
date: 2026-08-01
tag: Syntax
keywords: markdown image, markdown image not showing, markdown relative link, markdown anchor link, markdown link to heading, markdown base64 image, self contained html, single file html
---

A Markdown file is written inside a folder, and half of it quietly depends on that folder. `![Flow](img/flow.png)` looks right in the editor, looks right in the repository, and shows a broken-image icon the moment a colleague opens the converted HTML from their Downloads folder. Nothing in the file changed. Its neighbours did.

## Relative links, and what they are relative to

A URL in Markdown comes in a few shapes, each assuming something different about where the document lands.

| Written as | Resolved against | Survives being sent? |
| --- | --- | --- |
| `img/flow.png` | the folder the page is served from | only if that folder travels too |
| `../assets/flow.png` | the folder above it | same, and one level more fragile |
| `/assets/flow.png` | the root of the current site | only within that same site |
| `https://example.com/flow.png` | nothing, it is already complete | yes, as long as the host serves it |

The detail that catches people out: a markdown relative link resolves against the URL of the *rendered page*, not against the folder the `.md` file lived in. Convert `docs/guide.md`, open the HTML from your desktop, and `img/flow.png` now means an `img` folder on your desktop. The path was never wrong; it was answering a question nobody asks any more.

## Why a Markdown image is not showing

When a markdown image does not appear, the cause is almost always one of five things.

- **The path points at the old location.** Move the file, move the pictures, or switch to absolute URLs.
- **The case does not match.** `Diagram.PNG` and `diagram.png` are one file on a Mac or Windows disk, which ignores case by default, and two on the Linux machine serving your site.
- **There is a space in the filename.** Wrap the target in angle brackets, `![Flow](<my diagram.png>)`, or percent-encode it as `my%20diagram.png`.
- **The image is behind a login.** URLs pasted from a chat tool, a private repository or a wiki usually need the reader's session; a stranger gets nothing.
- **The size is set with raw HTML.** Plain Markdown has no width syntax. Converters disagree about raw `<img width="400">`, and a sanitiser may drop the attribute. Resize the file itself instead.

Alt text is not a caption. It is what a screen reader announces and what shows when the file is missing, so write what the picture says.

## Base64: the image inside the file

A data URI puts the bytes in the document: a markdown base64 image is an ordinary image with the encoded file where the path would go.

```markdown
![Company logo](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...)
```

The honest trade-off: base64 encodes three bytes as four characters, so the image grows by about a third before you count the rest of the document. A 2 MB screenshot arrives as roughly 2.7 MB of text sitting in the middle of your prose, impossible to diff, and re-sent with every copy. Browsers cannot cache it separately either.

That makes data URIs right for a narrow set of cases: an icon, a logo or a small diagram in a document that must travel alone. For screenshot-heavy documents, host the images and use absolute URLs.

## Reference-style links keep the prose readable

Inline links clutter the sentence. Reference style moves every URL to the bottom and leaves a short label behind.

```markdown
The [style guide][guide] changed, and so did the [API reference][api].
Read the [style guide][guide] again before you file anything.

[guide]: https://example.com/style
[api]: https://example.com/api/v1
```

The label is reused as often as you like, the URL written once, so a moved domain is one edit rather than a hunt through paragraphs. It also gives you one block to audit before sending: every destination the document points at. A long base64 blob belongs down there too.

## Anchor links, and how the slug is made

A markdown anchor link is a link to a heading in the same document: `[see below](#installing-the-cli)`. The id it points at is generated from the heading text, and the recipe is roughly the same everywhere. Lowercase the text, drop punctuation, turn runs of whitespace into hyphens, and add a number when two headings collide.

Roughly the same is not the same. A markdown link to heading written for one renderer can miss on another, and nothing warns you: an anchor that matches nothing does nothing. M2H prefixes every heading id with `doc-`, so `## Installing the CLI` becomes `id="doc-installing-the-cli"` and the link has to be `#doc-installing-the-cli`. The prefix exists to keep ids out of DOM-clobbering territory, which is the same reasoning behind [sanitising the output at all](/blog/sanitising-markdown-safely).

So convert first and read the ids the converter produced instead of guessing. Renaming a heading silently breaks every anchor aimed at it, which is a reason to keep the contents list short in [documentation that lives in the repository](/blog/documentation-that-lives-in-the-repo).

## What self-contained HTML actually contains

Self-contained HTML is a claim about presentation, rarely about content. In a single-file HTML document the styles are inline, there are no scripts and nothing is fetched to make the page look right — the M2H download works that way. What that never covers is a picture you pointed somewhere else. `<img src="diagram.png">` still means `diagram.png`, next to wherever the reader put the file.

Check the document before you send it.

- [ ] Every image is either an absolute public URL or embedded as a data URI
- [ ] No `../` path escapes the folder you are sending
- [ ] Anchors match the ids the converter produced, prefix included
- [ ] The file opens correctly from a different folder, in a different browser

Convert your file, open the HTML source tab, and search it for `src="` and `href="`. Read every value and ask where it resolves from the reader's machine, not yours. Fix the ones that answer wrongly, then send the file — or skip the attachment and [share it as a link](/blog/share-a-markdown-document-as-a-link), which saves the reader a download but not a relative path: that still resolves against the page it is served from, where the images were never put.
