---
title: "Best Online Document Converters in 2026: Where Your File Actually Goes"
description: Online document converters compared by what happens to your file: browser-side tools that upload nothing, hosted services and their retention
date: 2026-09-07
tag: Converting
keywords: online document converter, best online document converter, convert documents online without uploading, browser based document converter, free file converter online, document conversion api, offline document converter, how long do converters keep my files
---

Choosing an online document converter looks like a feature comparison and is really a question about geography. Your file either stays on your machine or it goes to somebody else's. Everything else — the format list, the drag-and-drop area, the tidy progress bar — sits on top of that one difference, and no pricing page puts it in the table.

### TL;DR

Pick by where the file goes, not by how many formats are listed. A converter that runs in your browser processes the file on your own machine, uploads nothing, and lets you prove it by watching an empty network tab — that is the right default for anything you did not write for the public. A server-side service like CloudConvert, Convertio, Zamzar or FreeConvert handles formats a browser cannot, at the cost of uploading the document and accepting a retention policy. Pandoc is the offline answer when the conversion has to repeat, run in a pipeline, or touch formats nobody's web page supports.

## The question nobody puts on the pricing page

Every converter's home page competes on the same three claims: it is fast, it is free, and it supports hundreds of formats. None of those three tells you whether the document you are about to convert leaves the building. That is the only claim with a consequence attached, and it is usually four clicks away in a privacy page, phrased as reassurance rather than fact.

There are three honest positions a converter can hold. It can do the work in your browser, in which case nothing is uploaded and there is nothing to retain. It can upload the file to a server, convert it there and delete it on a schedule, in which case the schedule is the product. Or it can run on your own machine outside the browser, in which case the network is not involved at all and you carry the cost of an install. Most tools are in the second group. Most people assume they are in the first.

The second thing nobody advertises is what you get back. "Converted" is not a single outcome. A converter can hand you a complete file that opens on its own, a fragment that needs a wrapper you have to write, or a zip containing the document plus a folder of images and a stylesheet it expects to find next to it. All three are described the same way on the button. Only the first one survives being emailed to somebody.

And the third is subtler: a converter can produce output that looks right on the page you converted it on, and wrong everywhere else, because the result quietly depends on a font or a stylesheet fetched from a network the recipient may not have. A file that needs the network to look like itself is not self-contained, whatever the download button implied.

## Quick comparison: the cheat sheet

| Tool | Best for | Key capability | Price |
| --- | --- | --- | --- |
| transformpipe | Converting a document without uploading it | Browser-side conversion, self-contained HTML export, API and CLI | Free |
| Pandoc | Repeatable conversion between many formats | Markup, HTML, office, TeX and ebook formats, templates, `--standalone`, `--embed-resources` | Free, GPL |
| LibreOffice (headless) | Office formats offline, in bulk | `--convert-to` for Word, Excel, PowerPoint, ODF, PDF | Free, MPL 2.0 |
| CloudConvert | An API you can build on | Format breadth, region selection, files deleted after processing | Free tier: 10 conversions/day |
| Convertio | One-off conversion of an unusual format | Very wide format list, web and API | Free tier, then from $11.99/month |
| Zamzar | Occasional desktop-style conversion | Long-running service, web and API | Free: 2 files/24h, then from $12/month |
| FreeConvert | Media and document conversion by the minute | Metered in conversion minutes rather than files | Free: 20 minutes/day, then from $12.99/month |
| Adobe Acrobat online | Anything where PDF is the source or target | PDF export and import that matches Acrobat's own engine | Free tools with limits; rest bundled in a subscription |
| Google Docs / Microsoft 365 | A conversion you already pay for | Import `.docx`, export HTML, PDF, plain text | Included with the account |
| Gotenberg | Server-side conversion you host yourself | Stateless Docker API wrapping LibreOffice and Chromium | Free, MIT |
| Libraries in your own code | A conversion inside an application | marked, Turndown, mammoth, Papa Parse and their equivalents | Free, open source |
| Browser Save As / Print to PDF | The conversion you already have installed | Saves a page as PDF or as HTML plus a resources folder | Free |

## The best online document converters in 2026

### transformpipe — best for converting a document without uploading it

transformpipe converts Markdown to HTML, and HTML, Word `.docx`, CSV, TSV and JSON to Markdown, in the browser. Signed out, the file is read, parsed and rendered on your own machine and never sent anywhere. The HTML export is one complete file with its styles inline, which means it opens the same way on a laptop with no connection as it does on yours.

| Pros | Cons |
| --- | --- |
| Nothing is uploaded when you are signed out, and the network tab proves it | The browser does the work, so a very large file is limited by the machine |
| The HTML export is a single file that requests nothing from the network | Not a universal converter: no video, audio, images or PDF-to-Word |
| Raw HTML passes through a sanitiser with a fixed allow-list | One document at a time, or several merged into one — not a site build |
| The same conversion is available as a REST API, a CLI, a GitHub Action and an MCP server | No template language for bespoke layouts |

**Price:** free. An account adds history, sharing and API access, also free.

**Technical details and features**

- Markdown to HTML with GitHub Flavored Markdown: tables, task lists, strikethrough, autolinks, fenced code
- HTML, `.docx`, CSV, TSV and JSON to Markdown in the same page, no install and no account
- Output is a complete document — doctype, head, inline `<style>` — or plain `.md`, or print to PDF through the browser's own dialogue
- Raw HTML in the input is filtered against one allow-list, in the browser and on the server alike
- A dependency-free CLI and a GitHub Action for the same conversion in a pipeline

**Who should use it?** Anybody converting a document that is not already public — a contract, a client's draft, an internal plan, an export from a note-taking app. It is also the shorter path for the specific job of turning Markdown into a page you can send, which is [compared against the libraries and desktop tools in detail elsewhere](/blog/best-markdown-to-html-converters).

### Pandoc — best for repeatable conversion between many formats

Pandoc is a command line document converter written in Haskell that reads and writes around forty formats, including Markdown, HTML, LaTeX, EPUB, Word and OpenDocument. It runs on your machine, so no file leaves it, and it is the only tool here whose format matrix genuinely competes with the hosted services.

| Pros | Cons |
| --- | --- |
| Converts between formats no web service bothers with | Requires an install and a terminal |
| Runs entirely offline, so the network is not part of the trust question | Templates, filters and dialect flags are a real learning curve |
| `--standalone` and `--embed-resources` produce one complete file | No sanitising: raw HTML passes straight through |
| Scriptable, so the same conversion repeats identically next month | Its Markdown dialects differ from GFM in ways that surprise people |

**Price:** free, GPL licensed.

**Technical details and features**

- Readers and writers selected explicitly, including `commonmark`, `gfm`, `html`, `docx` and `latex`
- `--standalone` wraps output in a full document; `--embed-resources` inlines images and CSS
- `--template` and Lua filters for rewriting the document mid-conversion
- `--sandbox` restricts filesystem access when converting a file you do not trust
- `--reference-doc` carries Word styling into `.docx` output

**Who should use it?** Anybody whose conversion happens more than once: a documentation build, a manuscript pipeline, a release process. For a single file and a person waiting for it, Pandoc is more tool than the job needs, and [the lighter options are worth knowing](/blog/pandoc-alternatives-for-markdown-to-html) before you install a Haskell binary.

### LibreOffice headless — best for office formats offline

LibreOffice is a desktop office suite, and its command line mode is a document converter most people already have installed without realising it. `soffice --headless --convert-to` reads and writes Word, Excel, PowerPoint and OpenDocument files, and exports PDF, on your own machine.

| Pros | Cons |
| --- | --- |
| Handles the Microsoft formats natively, offline, in bulk | A very large install for a conversion tool |
| Free and open source, with no account and no upload | Complex Word layout does not always survive the round trip |
| Scriptable over a directory of files | Its HTML export is dated and not a document you would send |
| The same engine many hosted services run behind their API | One process at a time unless you manage user profiles carefully |

**Price:** free, MPL 2.0 licensed.

**Technical details and features**

- `--convert-to` with a target filter, and `--outdir` for the destination
- Reads and writes `.docx`, `.xlsx`, `.pptx`, ODF formats and CSV
- PDF export with its own options, including PDF/A
- Runs on Windows, macOS and Linux, and in a container

**Who should use it?** Teams converting office documents in volume where the documents must not leave the network. If you have ever pasted a `.docx` into a web converter because you needed the text out of it, this is the version of that with nothing uploaded.

### CloudConvert — best server-side converter to build on

CloudConvert is a hosted conversion service with an API as its centre of gravity rather than an afterthought. Your file is uploaded, converted in a container and returned. It is the server-side option that is clearest about what happens to the file while it is there.

| Pros | Cons |
| --- | --- |
| A documented API, with the web interface as a client of it | The file is uploaded — that is the model, not a setting |
| States that files are kept only for processing and deleted immediately afterwards | Free tier is small enough to be a trial rather than a plan |
| Processing region can be selected | Credits are a unit you have to translate into your own workload |
| Each task runs in a separate isolated container | No offline mode, by definition |

**Price:** the free tier is 10 conversions a day. It caps the file at 1 GB, the processing at five minutes and the concurrent tasks at five. Paid use is sold as credit packages or a subscription, priced by volume on a slider, with custom enterprise pricing above that (checked on cloudconvert.com/pricing, 8 September 2026).

**Technical details and features**

- REST API with jobs composed of import, convert and export tasks
- Documents, spreadsheets, presentations, images, audio, video and archives
- Region selection for where the conversion runs (checked on cloudconvert.com/security, 8 September 2026)
- SSL for transfers, and a stated policy of no permanent storage

**Who should use it?** Developers who need one conversion endpoint covering formats a browser cannot touch, and who can accept an upload for the documents in question. The clarity of the retention statement is the reason to prefer it over the ad-supported end of the market.

### Convertio — best for one-off conversion of an unusual format

Convertio is a browser-based service with one of the widest format lists anywhere. You drop a file, it uploads, it converts on the server, you download the result. It is the tool that most reliably has heard of whatever extension you are holding.

| Pros | Cons |
| --- | --- |
| Format coverage that goes well past documents | Every conversion is an upload, including the private ones |
| No install, works on a phone as well as a laptop | Converted files sit on the service for 24 hours by its own policy |
| Same conversions available over an API | Free use is capped by file size rather than clearly by count |
| Output styling and structure are the tool's choices, not yours | Paid tiers are priced for volume you may not have |

**Price:** unregistered use is capped at a 1 GB maximum file size. Paid plans start at $11.99 a month for Lite, $22.99 for Basic and $44.99 for Pro when billed monthly. Annual rates are lower, and there is a custom tier above that (checked on convertio.co/pricing, 8 September 2026).

**Technical details and features**

- Document, image, audio, video, archive, ebook, font and presentation conversions
- Browser interface plus a REST API with the same catalogue
- States: uploaded files deleted instantly, converted files after 24 hours (checked on convertio.co, 8 September 2026)
- Conversions queue server-side, so a large file is not limited by your machine

**Who should use it?** Anybody with a file in a format nothing else reads, and no confidentiality problem — a public dataset, a font, a video, a document already on the internet. It is the wrong tool for a document that has not been published yet.

### Zamzar — best for occasional conversion with a clear free limit

Zamzar is one of the longest-running online converters and one of the few that states its free allowance as a number rather than a feeling. The model is the same as Convertio's: upload, convert on the server, download.

| Pros | Cons |
| --- | --- |
| The free limit is a stated file count, not a vague fair-use line | Two files a day is a genuinely small allowance |
| Retention is documented in plain sentences | A failed conversion means your original is held for longer |
| API available alongside the web interface | Upload is unavoidable |
| Simple, stable and predictable | Free file size cap rules out many real documents |

**Price:** the free service converts up to 2 files in any 24-hour period, with a 50 MB upload limit. Paid plans are $12 a month for Basic (50 desktop conversions a day, 200 MB files), $19 for Pro (100 a day, 400 MB) and $39 for Business (500 a day, 2 GB). Checked on zamzar.com and secure.zamzar.com, 8 September 2026.

**Technical details and features**

- Documents, images, audio, video, ebooks and archives
- A converted file is stored for a maximum of 24 hours so you can download it; if a conversion fails, the original is held for up to seven days for support (checked on zamzar.com/faq, 8 September 2026)
- Conversion API with the same format catalogue
- Per-plan file size ceilings rather than one global limit

**Who should use it?** People converting the odd file and wanting to know exactly what the free tier allows. The seven-day hold on failed conversions is the detail to weigh before you upload anything sensitive.

### FreeConvert — best when your work is metered in minutes

FreeConvert covers the same territory as Convertio and Zamzar, and meters differently: the unit is conversion minutes rather than files. That suits large media and penalises long single conversions.

| Pros | Cons |
| --- | --- |
| A daily free allowance measured in minutes, not files | A per-file time cap on free use will stop a big conversion mid-way |
| Web and API use draw on the same allowance | Server-side, so the file is uploaded |
| Higher tiers raise the file size ceiling substantially | Minutes are hard to estimate before you start |
| No install, no desktop dependency | Retention terms take reading to find |

**Price:** free use is 20 conversion minutes a day across web and API, with a limit of 5 conversion minutes per file. Paid plans are $12.99 a month for Basic, $24.99 for Standard and $29.99 for Pro, with on-demand pricing above that (checked on freeconvert.com/pricing, 8 September 2026).

**Technical details and features**

- Documents, images, audio, video, archives and ebooks
- Per-plan maximum file sizes from 1.5 GB on Basic up to 20 GB on the on-demand tier (checked on freeconvert.com/pricing, 8 September 2026)
- One API for the whole catalogue
- Conversion time, not file count, as the billing unit

**Who should use it?** Anybody whose conversions are long rather than numerous — video, audio, big spreadsheets — and who is comfortable with the upload.

### Adobe Acrobat online — best when PDF is one end of the job

Adobe's online tools convert to and from PDF using the same engine as Acrobat itself, which matters because PDF is the format most likely to be mangled by a third party's reimplementation. The tools run in a browser and process the file on Adobe's servers.

| Pros | Cons |
| --- | --- |
| The most faithful PDF conversion, because it is Adobe's own | Sign-in appears quickly once you use the free tools more than lightly |
| Handles PDF to Word, Word to PDF and the usual pairings | Uploads the document to Adobe |
| Consistent with the desktop application's output | Not a general document converter — PDF is always one end |
| No install for the online tools | Priced as part of a subscription, not per conversion |

**Price:** several online tools are free with usage limits, and fuller access is bundled into an Acrobat subscription whose price depends on the plan, region and term — check adobe.com for the figure that applies to you rather than trusting a number in an article.

**Technical details and features**

- Browser-based PDF creation, export, merging and compression
- Conversion to and from Word, Excel, PowerPoint and images
- Sign-in required for anything beyond a light amount of free use
- The same conversions available in the desktop application and its APIs

**Who should use it?** Anybody for whom PDF fidelity is the whole point — a form, a signed document, a print-ready file. Not the tool for getting text out of a document you would rather Adobe did not have.

### Google Docs and Microsoft 365 — the converter you already pay for

If you have either account, you already own a document converter. Upload a `.docx`, open it, and export it as HTML, PDF or plain text. Nobody markets these as converters, and for a great many one-off jobs they are the shortest route.

| Pros | Cons |
| --- | --- |
| Already available, already trusted with your documents | The file is uploaded by definition — that is what the account is |
| Handles Word formatting better than most third parties | Google Docs' HTML export arrives as a zip, with images as separate files |
| No new vendor to assess | The exported HTML carries the editor's own markup and class names |
| Free with the account you have | Awkward for more than a handful of files |

**Price:** included with the Google or Microsoft account you already have.

**Technical details and features**

- Import and export of `.docx`, `.xlsx`, `.pptx`, PDF, plain text and HTML
- Export choices made per document through a menu, not scripted
- The document remains in the account's storage after conversion unless you remove it
- Available on mobile as well as desktop

**Who should use it?** Anybody converting a document that already lives in that account. If it does not live there yet, uploading it to get HTML out is a large step for a small job.

### Gotenberg — best server-side conversion you host yourself

Gotenberg is a stateless conversion API distributed as a Docker image, wrapping LibreOffice and Chromium behind HTTP endpoints. It is the middle ground between a hosted service and a local install: an API shaped like CloudConvert's, running on hardware you control.

| Pros | Cons |
| --- | --- |
| An HTTP API with none of the documents leaving your infrastructure | You run it, monitor it and patch it |
| Stateless by design, so there is no retention policy to read | Narrower format list than the hosted services |
| Free and open source | Requires Docker and somewhere to put it |
| Predictable cost: your own compute | Not a tool for a person with one file |

**Price:** free, MIT licensed.

**Technical details and features**

- HTTP endpoints for office document conversion, HTML to PDF and PDF operations
- LibreOffice for office formats, Chromium for HTML rendering
- Distributed as a container, configured with flags and environment variables
- No persistence between requests

**Who should use it?** Engineering teams that need conversion as a service inside a product or an intranet, with a compliance answer that does not depend on somebody else's deletion schedule.

### Libraries in your own code — when the conversion is a feature

If the conversion happens inside software you are writing, the honest answer is usually a library rather than any converter on this page: marked or markdown-it for Markdown to HTML, Turndown for HTML to Markdown, mammoth for `.docx` to HTML, a CSV parser for tabular data.

| Pros | Cons |
| --- | --- |
| Nothing leaves the process, let alone the machine | You write the wrapper, the error handling and the styling |
| No per-conversion cost and no rate limit | Sanitising is your responsibility in most of them |
| Versioned in your lockfile, so behaviour does not change under you | One library per direction, so a matrix becomes several dependencies |
| Free and open source | No help at all with PDF, video or exotic formats |

**Price:** free, open source — marked and Turndown are MIT licensed.

**Technical details and features**

- Markdown to HTML: marked, markdown-it, remark in JavaScript; equivalents in every other language
- HTML to Markdown: Turndown, with rules you can override per element
- `.docx` to HTML: mammoth, which deliberately maps styles rather than reproducing Word's markup
- Sanitising is a separate step you add, not a default you inherit

**Who should use it?** Developers whose product converts documents as part of what it does. Do read [what raw HTML can carry through a conversion](/blog/sanitising-markdown-safely) before you render the result of one of these in somebody's browser.

### Browser Save As and Print to PDF — the converter already installed

Every browser converts documents. `Ctrl+P` to a PDF, or Save Page As, will get you a readable artefact of almost anything you can open. It costs nothing, uploads nothing and requires no decision.

| Pros | Cons |
| --- | --- |
| Free, installed, offline and instant | PDF loses the structure — headings become visual, not semantic |
| Nothing is uploaded | "Save Page As, complete" produces a file plus a resources folder |
| Works for anything the browser can render | Page breaks land wherever they land |
| No account, no limits | Not scriptable as part of a build |

**Price:** free.

**Who should use it?** Anybody who needs a fixed copy of something readable, right now, and does not need the output to be editable or structured afterwards.

## What the pricing pages leave out

Comparison tables are built from the fields vendors agree to publish. The things that decide whether a conversion was a good idea are mostly not among them.

**Whether the file is uploaded at all.** This is the first question and it is almost never in the table. "Online" has come to mean "on somebody's server", but a browser is a runtime, and a converter written to run in it does the work on your machine. The difference is not a promise you have to take on faith: open the developer tools, watch the network tab, convert the file, and see whether anything goes out. A browser-side converter shows you nothing but the page it already loaded. A server-side one shows you your document leaving, and the same habit of observing rather than believing is [how you settle whether an online converter is safe for the document in front of you](/blog/is-an-online-converter-safe) instead of reading the padlock as an answer.

**How long it is kept once it has been uploaded.** Retention is a policy, which means it is a sentence somebody wrote and can rewrite. The good services state it plainly. CloudConvert says files are kept only for processing and deleted immediately afterwards. Convertio says uploaded files are deleted instantly and converted ones after 24 hours. Zamzar stores a converted file for a maximum of 24 hours, and holds the original for up to seven days when a conversion fails so support can look at it. Every one of those is reasonable and none of them is zero. Browser-side conversion has no retention policy because there is nothing to retain, which is a different category of answer.

**Whether what you get back is a complete file.** Three things arrive under the same download button. A complete document opens on its own and looks like itself. A fragment — headings and paragraphs with no `<html>`, `<head>` or styles around them — renders as black text at the browser's default width and reads as broken to whoever you sent it to. A zip containing an HTML file, a stylesheet and an images folder is a website in a bag: move the HTML on its own and the pictures vanish. If the output has to travel by email or a chat message, only the first of the three works.

**Whether the result needs the network to look right.** A converter that links a font or a stylesheet from a content delivery network has produced a file that renders correctly on your desk and degrades on a train. It also tells whoever opens it something about where the file has been. A self-contained export carries its styles inline and requests nothing. It is a larger file and it is the only version that behaves identically everywhere. A converter whose output needs the network to open properly is not offering a self-contained file, regardless of what the export dialogue is called — this is exactly [why a link and a file are not the same deliverable](/blog/share-a-markdown-document-as-a-link).

**What the free tier actually meters.** The free tiers here count four different things. Zamzar counts files: 2 in 24 hours. CloudConvert counts conversions: 10 a day, with five concurrent tasks. FreeConvert counts minutes: 20 a day, and no more than 5 on any single file. Convertio caps the file size for unregistered use. None of those is comparable to any other, and the one that matters is whichever your actual workload trips over. Twenty daily minutes is generous for documents and thin for video; two files a day is fine for a person and useless for a team.

**What the format cannot carry across.** Every conversion is lossy in a direction. Word comments, tracked changes and text boxes have no equivalent in Markdown. A spreadsheet's merged cells and formulas do not survive becoming a table. PDF gives up its structure entirely and has to have it guessed back. A converter cannot fix this and the good ones do not pretend to; they make a defensible choice and let you see it. Tables are where it shows first and most visibly, and [what survives a table conversion](/blog/markdown-tables-that-survive-conversion) is worth checking on one representative file before you commit a hundred.

**Who else is in the pipeline.** A hosted converter runs on infrastructure it rents, in a region it chooses, with subprocessors it lists somewhere. That is normal and it is also a longer list of parties than "me and a web page". For a public README it does not matter. For an unsigned contract, a patient note or an unannounced product plan, it is the entire decision, and it is not a decision a feature table can help you make.

## How to choose

1. **Start with how the document would read in a leak.** If it would be embarrassing, contractual or regulated, the conversion has to happen on your machine — browser-side or offline — and the format list is irrelevant until that is settled. Sorting this first eliminates most of the market in one step and saves you comparing tiers you will not use.
2. **Read the retention sentence, not the privacy headline.** "We take your privacy seriously" is not a policy; "converted files are deleted after 24 hours" is. If you cannot find a sentence with a duration in it, assume the duration is unknown and treat the upload accordingly.
3. **Check what the free tier counts before you rely on it.** Files, conversions, minutes and megabytes are four different meters, and the plan that looks generous on one is restrictive on yours. Convert your largest realistic file on the free tier first; that is where the per-file time caps and size ceilings surface.
4. **Open the output on a machine that has never seen the tool.** Different browser, different computer, network off. That single test catches fragments, missing images, CDN-linked stylesheets and zip-shaped exports at once, and it takes a minute — whereas discovering it after you have sent the file to a client costs an apology.
5. **Count the installs and the accounts.** A one-off conversion should not need a package manager; a nightly job should not need a browser tab with a person in it. Choose against the frequency, because the mismatch is what makes people abandon a good tool after a fortnight.
6. **Assume you will do this again.** If the conversion repeats, you want an API, a CLI or a scriptable binary, not a page you visit. Picking a manual tool for a recurring job is the most common version of this mistake, and it costs a little time every week rather than a lot once — which is why it survives so long.

## Conclusion

The best online document converter is the one whose answer to "where did my file go?" is "nowhere". For documents that are not already public, that means browser-side conversion. That is what [transformpipe does](/): Markdown to a self-contained HTML file, and HTML, Word, CSV, TSV and JSON back to Markdown, on your own machine, free. Nothing is uploaded when you are signed out, and the network tab shows it. When the format is beyond what a browser can parse, a server-side service is the right tool and the retention policy is what you are actually choosing between: CloudConvert, Convertio, Zamzar and FreeConvert all state theirs, and the differences are real. And when the conversion has to repeat, install Pandoc or host Gotenberg, and stop thinking about it.

## FAQ

### What is the best free online document converter?

For documents you would rather not upload, a browser-side converter is the best free option, because there is no tier to exceed and no file to delete afterwards. The browser-side converter above is free for Markdown, HTML, Word, CSV, TSV and JSON. For formats a browser cannot read, the free tiers of CloudConvert, Zamzar and FreeConvert all work for occasional use, as long as you have read what each one counts.

### Is it safe to upload documents to an online converter?

It depends entirely on the document and the policy. For anything already public, the risk is negligible. For a contract, medical note or unreleased plan, the safe position is a converter that does not upload at all — either one that runs in your browser or a tool installed on your machine. A retention policy is a promise about a copy that exists, not the absence of a copy.

### How can I convert a document without uploading it?

Use a converter that runs in the browser, or one that runs offline. A browser-side tool loads its code once and then does the parsing locally, so you can open the developer tools, convert the file and watch the network tab stay empty. Offline, Pandoc and LibreOffice's `--convert-to` mode never touch the network at all.

### How long do online converters keep my files?

The published answers vary from minutes to a week. CloudConvert states that files are kept only for processing and deleted immediately afterwards; Convertio deletes uploads instantly and converted files after 24 hours; Zamzar keeps a converted file for up to 24 hours, and an original for up to seven days if the conversion failed. Check the current wording on the vendor's own page, because these are policies and policies change.

### Can I convert documents offline?

Yes, and it is usually the better answer for anything repeated or sensitive. Pandoc converts between around forty formats from the command line, LibreOffice converts office documents and PDFs with `--headless --convert-to`, and a browser-side converter keeps working once the page is loaded. All three leave the network out of it.

### Does an online document converter work on a phone?

Server-side converters do, since the phone only has to upload and download. Browser-side converters work too, but the conversion runs on the phone's own processor and memory, so a very large document will be slower there than on a laptop. For a normal document — a report, a README, a spreadsheet export — either is fine.

### What is the difference between a document converter and a document editor?

A converter takes a file in one format and gives you the same content in another; an editor is where you write it. Editors often have an export menu, which makes them converters by accident, and the export is styled the editor's way rather than yours. If you already have the file and only need a different format, a converter is fewer steps and fewer surprises.
