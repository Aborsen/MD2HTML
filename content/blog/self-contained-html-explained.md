---
title: "Self-contained HTML explained: what a single file HTML document really is"
description: What a single file HTML document contains, what inlining styles and images costs in bytes, how to prove it fetches nothing, and when it is the wrong format
date: 2026-08-14
tag: Publishing
keywords: single file html, self-contained html, inline css html file, data uri images, offline html document, html email attachment, archive a web page
---

A colleague sends you an HTML file. You open it on a train, or on a laptop that has been off the network since Friday, and one of two things happens. Either you get the document — headings, tables, images, the lot — or you get black Times New Roman at the full width of the window, with three broken image icons where the diagrams were. Both files are valid HTML. Only one of them is a document.

The difference is whether the file needs anything else to be itself. A page on the web is normally an index: it names a stylesheet, some fonts, a handful of images, and the browser fetches each one in turn. That works beautifully when the page lives at an address and the reader has a connection. It fails completely when the page is an attachment in a mailbox, a file in an archive, or an exhibit in a folder somebody will open in four years.

### TL;DR

A single file HTML document is one `.html` file that renders correctly with the network unplugged, because everything it needs is inside it: the stylesheet is an inline `<style>` block rather than a `<link>`, the images are data URIs rather than paths, and no font, script or tracker is fetched from anywhere. Verify it by disconnecting, opening the file, and watching the network tab record nothing — one request for the file itself when served, and zero after that. It is the right format for archiving, for emailing, and for handing a document to somebody outside your organisation, because it survives the trip and tells them nothing about where it has been. The costs are real and worth stating: the file is roughly a third larger than its images, nothing inside it can be cached, and you cannot fix a typo without re-sending the whole thing.

## What "single file HTML" means, exactly

The phrase gets used loosely, so it is worth pinning down. A single file HTML document makes one promise: opened from a local disk, with no network of any kind, it renders as its author intended. That promise has three consequences, and they are the whole definition.

Every style rule is in the document. There is no `<link rel="stylesheet">` pointing at `styles.css` next door, and none pointing at a CDN. The rules sit in a `<style>` element in the head, or as `style=` attributes on elements, or both.

Every image is in the document. Not `src="diagram.png"`, which is a path that resolves against wherever the reader happened to put the file, and not `src="https://…/diagram.png"`, which is a request. The bytes themselves are encoded into the `src` attribute as a data URI, or the picture is inline SVG, which is markup rather than a fetch.

Nothing else is requested at all. No web font, no analytics beacon, no icon set, no jQuery from a CDN "just for the table of contents". This is the clause people break by accident, and it is the one that matters most, because a single link tag is enough to turn a self-contained document into a page that quietly reports every time it is opened.

What a single file HTML document does *not* promise is that its links work. `<a href="https://example.com/spec">` is still an address on the internet, and it should be — a document that strips its own citations is worse, not better. Self-containment is a claim about presentation, not about the outside world your prose refers to.

## Quick comparison: the cheat sheet

| Format | What it is | Needs the network | Reader can edit | Main cost |
| --- | --- | --- | --- | --- |
| Single file HTML | One `.html` file, styles inline, images as data URIs | No | Only by editing markup | Larger file, nothing cacheable |
| HTML plus an assets folder | An `.html` file beside `styles.css` and an `images/` directory | No, if the folder travels with it | Only by editing markup | Breaks the moment one file is moved or mailed alone |
| HTML linking a CDN | An `.html` file that fetches fonts and CSS at open time | Yes | Only by editing markup | Renders wrong offline; leaks each open |
| MHTML (`.mhtml`) | A page and its assets in one MIME container | No | No | Chrome and Edge write it; Firefox does not open it without an add-on |
| Safari web archive (`.webarchive`) | Apple's equivalent container | No | No | Practically Safari-only |
| PDF | A fixed page layout with fonts embedded | No | No, without a PDF editor | Reflows badly on a phone; text extraction varies |
| Word (`.docx`) | A zip of XML, styles included | No | Yes, fully | Renders differently across Word versions and viewers |
| Markdown source (`.md`) | Plain text with punctuation | No | Yes, in any editor | Most readers see source rather than a document |
| Hosted link | A page served from an address | Yes, always | No | Needs hosting, and the address can rot or be revoked |
| Screenshot (`.png`) | A picture of the document | No | No | No selectable text, no links, no search |

The two rows worth comparing carefully are the first and the second, because they look equivalent and are not. An HTML file with a sibling `styles.css` renders perfectly from `file://` — CSS loads from a local disk without complaint. It renders perfectly right up to the moment somebody drags the `.html` out of the folder and attaches it to an email, which is exactly what a reader who has never thought about assets will do. Self-containment is not primarily a technical property. It is a property that survives being handled by people.

## Styles inline, and the fonts that quietly are not

### Why the linked stylesheet has to go

A `<link rel="stylesheet" href="…">` is a second request, and every second request is a way for the document to arrive incomplete. Locally, the stylesheet has to be in the right relative position. Remotely, the host has to still exist, still serve that path, and still be reachable from the reader's network — which, inside a bank or a hospital, it very often is not.

Inlining is the fix, and it is not subtle: take the CSS that would have been in the file next door and put it in a `<style>` block in the head. A document's worth of typography, table borders, code block backgrounds and print rules is a few kilobytes of text, which compresses well and costs nothing worth measuring.

There is a second-order benefit that people notice only after they have been bitten. An inline stylesheet cannot be changed underneath the document. If your house CSS is versioned at a URL and somebody rewrites the heading scale next quarter, every old document that linked it re-renders with the new scale — including the one attached to a contract. A document with its styles inside it renders in December exactly as it rendered in August, because the rules and the prose are the same artefact.

### The `style=` attribute is not the same thing

Two techniques get called "inline styles" and they behave differently. A `<style>` element in the head holds real CSS: selectors, media queries, `@media print`, pseudo-classes, the lot. A `style=` attribute on an element holds declarations only — no selectors, no media queries, no `:hover`, and no way to say "every table cell in this document".

For a document you are archiving or emailing, the `<style>` block is what you want. Attribute styles matter in exactly one context, which is HTML email: mail clients have historically stripped `<style>` blocks, and the trade there is to push declarations onto elements. That is a reason to keep the two cases separate in your head. A single file HTML *attachment* and an HTML *email body* are different products with different constraints, and a tool that produces one is not necessarily producing the other.

### Fonts: the promise one link tag breaks

Here is the clause that gets broken most often, usually with good intentions.

You inline the CSS carefully. You embed every image. Then, because the document should look like the rest of your material, you add one line:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
```

The file is no longer self-contained. Open it with the network off and the type falls back to whatever the stack says next, which changes the line lengths, the page breaks and possibly the table widths. Open it with the network on, and the document makes a request to a third party at the moment of reading — from the reader's IP address, on the reader's corporate network, with the reader's user agent, every single time the file is opened. For an internal note that is merely untidy. For a document you have handed to a client, a regulator or opposing counsel, it is a fact about your file that you did not intend to create.

There are three honest ways out, and the first is usually right.

**Use a system font stack.** `font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` renders in a typeface the reader already has, which means it renders instantly, offline, on every platform, at zero bytes. The document does not look like your brand. It looks like a document, which for a memo, a specification or a set of release notes is the correct outcome.

**Embed the font as a data URI in an `@font-face` rule.** This works and it is expensive. A single weight of a Latin-only WOFF2 is typically tens of kilobytes before encoding; a family with regular, bold and both italics is four faces, and base64 adds a third on top of each. You are trading a fixed, sizeable chunk of file for brand typography in a document nobody will judge on its typography. Check the licence before you do it, too — plenty of commercial font licences permit web serving from a domain you control and say nothing helpful about redistributing the binary inside a file you email to a stranger.

**Ship the font file beside the HTML.** This is the assets-folder pattern with a nicer name, and it fails in the same place: the first time someone forwards the `.html` on its own.

## Images as data URIs, and what that costs in bytes

A data URI puts the bytes where the path would go. The syntax is a scheme, a media type, an encoding, and the payload:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..." alt="Deployment topology">
```

Base64 encodes three bytes of input as four characters of output. That is a **33% increase** before you count the `data:image/png;base64,` preamble, and it is not recoverable by being clever. A 1.5 MB PNG becomes about 2 MB of text sitting in the middle of your markup. Six screenshots of that size, and the document is a 12 MB text file.

Compression takes back less than people hope. Gzip and Brotli do a decent job on base64 of already-compressed data — but only a decent one, because a PNG or a JPEG is entropy-dense already; the encoding is what is being squeezed, not the picture. And compression only applies over HTTP. A file sitting on a disk, or attached to an email, is the full uncompressed size, and that is the size that runs into limits.

Those limits are worth naming, because they are where the trade stops being theoretical:

| Where the file goes | What bites first |
| --- | --- |
| Email attachment | The strictest attachment ceiling in the chain, which is not yours |
| Corporate mail gateway | Scanners that quarantine or rewrite large HTML attachments |
| A converter or an API | A request-size cap — TransformPipe caps a conversion at 10 MB, and a document kept in an account at 4 MB, because a Vercel Function refuses a request or a response body over 4.5 MB |
| A phone browser | Memory, and the time spent decoding several megabytes of base64 before first paint |
| A code review | Nothing at all, and that is the problem: the diff is unreadable |

Two techniques make the cost manageable.

**Resize before you encode.** Most embedded screenshots are two or three times larger than the width they are displayed at. Halving the pixel dimensions of a screenshot cuts the file to roughly a quarter, and the 33% encoding overhead then applies to a much smaller number. This single step does more than any format argument.

**Use SVG as markup, not as base64.** A diagram, a logo, a chart or an icon drawn as SVG can be pasted into the document as an `<svg>` element. There is no encoding overhead at all, the result is text that compresses extremely well, and it stays sharp at any zoom. If a picture in your document is line art, it should almost never be a base64 PNG.

What data URIs cannot fix is a picture you pointed somewhere else. `<img src="diagram.png">` still means `diagram.png` relative to the reader's folder, and a converter that inlines styles will not necessarily have inlined that. The full set of things that break when a file moves is a subject of its own — [relative paths, anchor ids and reference links each fail differently](/blog/images-and-links-that-still-work) — and the practical habit is to open the HTML source and read every `src=` value before you send anything.

## How to verify the file is really self-contained

Do not trust the claim, including ours. Verification takes about a minute and it is conclusive.

**1. Disconnect the machine.** Turn off Wi-Fi, unplug the cable, put the laptop in aeroplane mode. Do this first, because it is the only step that cannot be fooled by a warm cache. A file you have already opened once may have every font and stylesheet sitting in the browser's HTTP cache, and it will render perfectly while being entirely dependent on the network.

**2. Open the file from `file://`.** Double-click it, or drag it into a browser window. Look at the type, the table borders, the code block backgrounds and every image. A fallback font is the usual tell: if the headings look narrower or wider than you remember, something was being fetched.

**3. Open developer tools, go to the network tab, and reload with it open.** This is the actual test. On a `file://` document the correct result is a request list containing the document and nothing else — no CSS, no fonts, no images, no beacons. If a row appears, click it and read the URL; that is your leak, named and located.

**4. Search the source for the four things that fetch.** Open the file in a text editor and search for `<link`, `<script src`, `url(` and `src="http`. Every hit is either something you inlined deliberately, or a dependency you did not know you had. `url(` catches the font and background-image cases that the network tab will miss if the rule never matched anything on screen.

**5. Try it in a second browser, on a second machine, from a different folder.** Copy the file to a USB stick, plug it into a machine that has never seen it, and open it there. This catches relative paths, cached assets and platform font differences in one go. It is also, not incidentally, a rehearsal of what your reader is about to do.

**6. Print it to PDF while you are there.** Print preview reveals whether the document has print rules at all, and whether anything is clipped at the page edge. If a PDF is the eventual deliverable, [the browser's own print dialog is a reasonable route to one](/blog/markdown-to-pdf) and a single file HTML document is the input it wants.

A note on scripts. A self-contained file can legitimately contain inline JavaScript — a table-of-contents toggle, a dark mode switch — and inline script is not a network dependency. It is, however, executable code inside a document somebody will open by double-clicking, which is a different risk. If the source of the document was Markdown that came from outside your organisation, raw HTML in the source can carry `<script>`, `onerror=` and `javascript:` URLs straight into the output, and [sanitising against a fixed allow-list is what stops that](/blog/sanitising-markdown-safely). Search for `<script` in any file you did not produce yourself before you open it.

## What a single file is worth

The format earns its keep in three situations. They are not the same situation, and each one values a different property.

### Archiving

An archived document has one requirement: it must still render when everything around it has changed. That includes the CDN that served its fonts, the S3 bucket that held its images, the company that hosted both, and the browser version that was current when it was written.

| Property | Why archiving cares |
| --- | --- |
| No external requests | The hosts that would be asked will not all still answer |
| Styles frozen in the file | The document cannot be re-rendered by someone else's later CSS |
| Plain text on disk | Greppable, diffable in principle, and readable by tools that do not exist yet |
| One file, one object | Nothing to lose; no folder to keep together |

HTML is a good archival format for a reason that has nothing to do with fashion: it is text, its specification is public, and browsers keep rendering old documents. A single file HTML document is a self-describing text object, which is the property that outlasts formats needing a specific application.

It is not a *preservation* format in the institutional sense — that is what WARC containers and their tooling exist for, and a library or a national archive will use those. For a team keeping the state of a decision, a runbook as it stood at an incident, or a report as it was signed off, a single file is the pragmatic version of the same idea.

**Who this is for:** anybody who has to answer "what did this say at the time?" and cannot rely on a link.

### Emailing

Email is the harshest environment a document meets, because nothing about it is under your control. The reader's client, gateway, connection and device are all somebody else's decisions.

A single file HTML attachment behaves well in that environment for a plain reason: there is nothing to go missing. Expect the reader to download it rather than see it in a preview pane, and expect some mail systems to be suspicious of `.html` attachments in general — a zip, or a link to the file, is the usual workaround when a gateway objects. What you avoid is the far more common failure of sending a `.html` with its `images/` folder left behind, which produces a document full of broken image icons and a follow-up email.

| Property | Why emailing cares |
| --- | --- |
| One attachment | No folder to zip, nothing for the reader to reassemble |
| Renders offline | The reader may open it on a plane, on a train, or on a locked-down laptop |
| No fetches | The document does not report when, where or how often it was read |
| Text, not a container | It opens in a browser the reader already has |

**Who this is for:** anyone sending a finished document to a named person, particularly one outside their own systems. The alternatives — and where each of them fails — are [worth reading before you pick one](/blog/share-a-markdown-document-as-a-link).

### Handing it to somebody outside your company

This is the case where self-containment stops being a convenience and becomes a matter of hygiene. When a document leaves your organisation, it is inspected by people and systems that owe you nothing.

A file that fetches from a CDN is a file that makes requests from inside the recipient's network. Their security team may notice; their proxy may block it; their auditor may ask what the request was for. A file that fetches nothing raises none of those questions, and it can be reviewed by reading it — which is exactly what a cautious recipient will do.

There is a converse worth stating, because it applies to you as a reader. A single file HTML document you receive is easier to review than a page, but it is not automatically safe: inline script runs when you open it, and `file://` is a permissive context. Read the source, or open it with JavaScript disabled, if you have any reason to be careful about the sender.

| Property | Why an external handover cares |
| --- | --- |
| No third-party requests | Nothing for a proxy to block or a security review to query |
| No tracking | The document cannot tell you it was opened, which is the point |
| Auditable | The whole thing can be read in a text editor |
| No account, no install | The recipient opens it in the browser they already have |

**Who this is for:** anybody sending a document across a company boundary — proposals, specifications, incident write-ups, deliverables, anything a lawyer might later hold up.

## Where a single file is the wrong answer, and what it costs

The format has genuine drawbacks. A page that only lists the benefits is selling something.

**The file is bigger, and the increase is not marginal.** Base64 adds a third to every embedded image, and inlining shared assets means every document carries its own copy of them. Ten reports that each embed the same logo and the same two diagrams carry ten copies of each. If you produce documents in volume, the aggregate cost is real and the deduplication you would get from shared assets is exactly what you have given up.

**Nothing inside it can be cached.** A hosted page fetches its stylesheet once and reuses it across every page on the site; the second page is nearly free. A single file has no second page. Each document pays for its own styles, its own fonts and its own images, every time it is transferred. This is the correct trade for a document that travels alone and the wrong trade for a site with navigation.

**Editing means re-sending everything.** A typo in a hosted page is a one-line fix that every reader sees on their next visit. A typo in an attachment is a new attachment, an apologetic email, and two versions of the document in the recipient's mailbox with no indication of which is current. Single files have no update path; that is intrinsic, not a missing feature.

**There is no analytics, by construction.** If you need to know whether the proposal was read, you need a link, and a link is the opposite of a self-contained file. You cannot have both properties in one artefact.

**Very large files behave badly.** Several megabytes of base64 has to be decoded before the browser can paint the images, and on a phone with modest memory that is a visible pause or worse. There is a size past which a single file is a bad experience even though it is technically correct, and screenshot-heavy documents reach it quickly.

**It is not a website.** No navigation across documents, no search, no feeds, no cross-links that resolve. A set of documents that reference each other wants hosting, and pretending otherwise produces a folder of files with dead links between them.

**Some viewers will not cooperate.** Mail gateways that quarantine HTML attachments, document management systems that will not index HTML, review tools that render nothing — these are policy problems, not technical ones, and they end the argument in some organisations regardless of the merits. When that happens, a PDF is the format the institution accepts, and a single file HTML document is the best possible input to producing one.

## How to choose

1. **Start from where the file will be opened, not from what is convenient to produce.** A document opened from a mailbox on a disconnected laptop must be self-contained; a page opened from a URL with a warm cache should not be, because you are throwing away caching for nothing.
2. **Count the requests, not the features.** Open the network tab on the output and look at the row count. Any number above one means the file has dependencies, and each dependency is a place the document can arrive incomplete.
3. **Resize images before you embed them, because the 33% encoding overhead multiplies whatever you feed it.** A screenshot at twice its display width costs four times the bytes it needs to, and that waste is the single largest contributor to a bloated single file.
4. **Decide about web fonts once, in writing.** Either the document uses a system font stack and stays honest, or it embeds faces you have checked the licence for; a linked font is a decision to make a request from the reader's machine, and it should not happen by accident.
5. **If the document will change, do not send a file.** Attachments have no update path, so anything still in draft wants a link, and anything final wants a file. Sending a file for something unfinished guarantees a second version in circulation.
6. **Test it the way your reader will open it, on a machine that has never seen it, offline.** Every failure described on this page — the fallback font, the broken image, the missing stylesheet, the surprise request — shows up in that one test, and none of them show up in the tool's own preview.

## Conclusion

A single file HTML document is a small idea with a specific payoff: it renders the same everywhere because it asks for nothing, which makes it the right format for archives, attachments and anything crossing a company boundary. The costs are equally specific — a third more bytes on every image, no caching, and no way to correct a mistake without re-sending — so it is the wrong format for a site, for a draft, or for anything you need read receipts on. If you have a Markdown file and a person waiting for a document, [converting it in the browser](/) produces exactly this: one HTML file with its styles inline, nothing fetched, and, signed out, nothing uploaded anywhere in the process. Then disconnect the machine and open it, because a self-containment claim you have not tested is just a claim.

## FAQ

### What is a single file HTML document?

It is one `.html` file that renders correctly with no network connection, because its stylesheet is an inline `<style>` block, its images are embedded as data URIs or inline SVG, and it fetches no fonts, scripts or trackers. Opened from a local disk it makes no requests at all. Links in the prose still point at the internet, which is intended — self-containment is about presentation, not citations.

### How do I check whether an HTML file is really self-contained?

Disconnect the machine first, so no cached asset can flatter the result, then open the file and reload it with the network tab of developer tools open. The correct outcome is a request list with the document in it and nothing else. Searching the source for `<link`, `<script src`, `url(` and `src="http` catches anything the network tab missed because the rule never matched.

### How much bigger does embedding images make the file?

Base64 encodes three bytes as four characters, so each embedded image grows by about 33% before the media-type preamble is counted, and compression recovers only part of that because photographic and PNG data are already dense. Resizing a screenshot to the width it is actually displayed at usually saves far more than any encoding choice. Line art should be inline SVG, which has no encoding overhead at all.

### Can I use a web font in a self-contained file?

Not from a CDN — that is a network request, and it both changes the type when the reader is offline and reports each open to a third party. You can embed a face as base64 inside an `@font-face` rule if the licence permits redistribution, at a cost of tens of kilobytes per weight. For most documents a system font stack is the better trade: instant, free, and available on every platform.

### Is single file HTML better than a PDF for sending a document?

They optimise for different things. HTML reflows to the reader's screen, keeps text selectable and searchable, and can be read in any browser without an extra application; a PDF fixes the page layout, which matters when pagination is part of the content or when an institution will only accept PDFs. A practical answer is to produce the HTML first and print it to PDF when a PDF is specifically required.

### Is it safe to open a self-contained HTML file somebody sent me?

Safer than a hosted page in one respect and not in another. It fetches nothing, so it cannot phone home or load remote code, but inline JavaScript inside it still executes when you open it. If you have reason to be cautious about the sender, read the source for `<script` first, or open the file with JavaScript disabled.

### Why does an HTML file I received look unstyled?

Almost always because it was not self-contained: it linked a stylesheet that is not next to it any more, or one on a host your network cannot reach. A browser given HTML with no applicable CSS renders it in its default serif font at the full window width, which is why the file looks like a plain-text draft rather than a document. Ask the sender for a version with the styles inline.
