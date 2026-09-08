---
title: How to save a web page as Markdown you actually own
description: Four ways to turn a web page into Markdown — reader mode, saved HTML, clipper extensions and the command line — what each keeps, and what happens to the images
date: 2026-09-05
tag: Converting
keywords: web page to markdown, save a web page as markdown, url to markdown, convert web page to markdown, save article as markdown, web clipper markdown, readability markdown, download web page as text
---

A page you want to keep is a page somebody else can change. The article you read last March is now behind a registration wall, or the site was redesigned and the URL is a 404, or the paragraph you remember has been quietly edited and there is no way to tell. A bookmark is a promise made by a stranger. Markdown on your own disk is a file.

The conversion itself is the easy part. Every route below ends with HTML becoming Markdown, and that step is well solved by half a dozen tools. What separates the routes is everything around it: which part of the page you end up with, whether the images come along, whether the file still opens in five years, and how much of your afternoon it takes for one article.

### TL;DR

For one article you are reading right now, turn on the browser's reader mode, save or copy the cleaned page, and convert that — reader mode is an extraction step you get for free, and it removes the navigation, the newsletter box and the related-articles rail before any converter sees them. For a page you want the whole of, save it as HTML first and convert the file, because a saved file can be re-converted when you change your mind and a copy-paste cannot. For anything routine, a clipper extension puts the Markdown straight into your notes in one click and hides both steps. And whichever route you take, decide about images deliberately: a Markdown file that points at somebody else's image URLs is a file that will slowly go blank.

## The routes, compared

Each row is a different trade between effort and fidelity. None of them is wrong; they fail in different places.

| Route | Best for | What it keeps | What it costs | Price |
| --- | --- | --- | --- | --- |
| Reader mode, then convert | One article, read now, kept as prose | Headings, paragraphs, body links, usually the tables | Anything the extractor judged furniture, including real figures | Free |
| Save as HTML, then convert the file | A page you want all of, or want twice | Everything the page contained, furniture included | You remove the furniture yourself | Free |
| Browser-side converter | One file converted without uploading it | Tables, task lists, code, headings | One document at a time | Free |
| MarkDownload extension | Clipping the page in front of you | Extracted article, plus front matter with the URL | An extension with permission to read pages | Free, Apache 2.0 |
| Obsidian Web Clipper | Markdown that lands in a vault | Extraction, templates, page properties | Tied to Obsidian's folder | Free, MIT |
| Notion Web Clipper | Reading later inside Notion | The page as Notion blocks | Not Markdown — a second export to get there | Free |
| SingleFile | Keeping the page as it looked | Images, CSS and fonts inlined into one HTML file | A large file, and the conversion still to do | Free, open source |
| monolith | Archiving pages from a script | Assets inlined as data URIs, no folder | A Rust install; no article extraction | Free, open source |
| Pandoc | Conversion inside a build or a script | Structure, and images via `--extract-media` | No extraction: feed it clean HTML or get the menu | Free, GPL |
| Turndown | A tool or extension you are writing | Exactly the rules you define | You supply the DOM, the extraction and the wrapper | Free, MIT |
| Mozilla Readability | Finding the article inside a page | Title, byline, cleaned article HTML | Outputs HTML, not Markdown | Free, Apache 2.0 |
| `wget` / `curl` | Many pages, no login, from a terminal | The bytes as the server sent them | No extraction, and a duty to be polite about it | Free |
| A public web archive | Proving what the page said | A citable, dated snapshot | Not your file, and not Markdown | Free |
| Print to PDF | A layout that must not move | The page as a picture of itself | Structured text is gone; converting back is a new job | Free |

## Route one: save the HTML, then convert the file

This is the route worth learning first, because it separates capture from conversion. Once the HTML is on disk you can convert it four different ways, compare the results, and re-run the whole thing next year with a better tool. Copy-paste gives you one shot.

| Pros | Cons |
| --- | --- |
| The capture is permanent and re-convertible | Two steps instead of one |
| Works on any page, including ones no extractor handles well | You get the navigation and the footer along with the article |
| The saved file is evidence: it is what the page said that day | The formats browsers offer are not all equally useful |
| Nothing has to be uploaded to convert it afterwards | Assets land in a sibling folder that is easy to lose |

**Who it is for.** Anybody keeping a page for reference rather than for reading — documentation that may be taken down, a specification, a support thread you will need to quote, a competitor's pricing page on the day you looked at it.

### The format in the save dialogue decides what you get

Pressing the save shortcut is not one action. The dropdown in the dialogue offers formats that behave very differently, and picking the wrong one is the most common reason a conversion produces nothing useful.

| Format | Where you find it | What lands on disk | Converts well? |
| --- | --- | --- | --- |
| Webpage, Complete | Chrome, Edge, Firefox ("Web Page, complete") | An `.html` file plus a `_files` folder of images, CSS and scripts | Yes, and the images are already local |
| Webpage, HTML Only | Chrome, Edge, Firefox ("Web Page, HTML only") | One `.html` file, assets still remote | Yes, though images stay as remote URLs |
| Webpage, Single File | Chrome, Edge | One `.mhtml` file: a MIME multipart archive of the page and its parts | Rarely — most Markdown converters do not read MHTML |
| Web Archive | Safari | One `.webarchive` file, a binary property list | No: it is Apple's format, not HTML |
| Page Source | Safari | The HTML the server sent | Yes, but see the note on JavaScript below |
| Text Files | Firefox | The page as plain text | No structure survives, so there is nothing to convert |

MHTML deserves a warning of its own, because "Single File" sounds exactly like what you wanted. It is a MIME container — the same envelope format as an email with attachments, standardised in RFC 2557 — with the HTML and every asset as base64-encoded parts. Browsers open it. Markdown converters generally do not, and the file gives no hint that it is the problem: you get an error, or one enormous line of base64.

### When the page is built by JavaScript, save the rendered DOM

A great many pages send a nearly empty document and fill it in with script. Save the source of one of those and you have saved a loading spinner. The reliable answer is to take the DOM the browser actually built: open developer tools, find the `<html>` element at the top of the elements panel, right-click it and choose Copy, then Copy outerHTML. Paste that into a file with an `.html` extension and convert that instead. It is the rendered page, tables and all, in the state you were looking at.

The same trick narrows the job. Instead of the `<html>` element, copy the outerHTML of the `<article>` or the main content container. You have then done the extraction by hand, precisely, in about four seconds, and the converter has nothing left to guess at.

### The same job in a script

For more than one page, the terminal is shorter. `curl -sL <url> -o page.html` fetches the document and follows redirects. `wget --page-requisites --convert-links <url>` fetches the page plus the images and stylesheets it references and rewrites the references to point at the local copies, which is the closest thing to "Webpage, Complete" from a command line.

Pandoc will read HTML and write Markdown directly, and it accepts a URL as input as well as a file, so `pandoc -f html -t gfm <url> -o page.md` is a one-liner for a simple page. It does no extraction whatsoever — you will get the menu, the footer and every link in the sidebar — so it belongs at the end of a pipeline where something else has already found the article. Its `--extract-media` option is the useful part for keeping a page: it writes the images out to a directory and rewrites the links in the Markdown to match, which turns a file full of remote URLs into a self-contained folder.

If what you want is the page rather than its text, `monolith` is a small Rust command line tool that bundles a page and its assets into a single HTML file with everything inlined as data URIs. There is no server and no folder to lose. It is free and open source. Convert that file later if you want Markdown; keep it either way if the page might vanish.

## Route two: reader mode and Readability-style extraction

Reader mode is the most underused conversion tool in the browser, because nobody thinks of it as one. What it does is exactly the hard half of the job: it looks at the document, works out which block of it is the article, and throws the rest away. Firefox's Reader View is built on Mozilla's Readability library. Safari has Reader, Chrome has a reading mode in its side panel, and Edge has Immersive Reader. They are not identical, but they are all doing the same kind of scoring — how much text is in this element, how many links, how deeply nested, what class names does it carry.

Turn it on, then save or copy from the cleaned view. Because the reader view is itself a real document in the browser, the developer tools trick above works on it: copy the outerHTML of the reader container and you have the article with no furniture at all. Convert that and the Markdown starts at the headline.

| Pros | Cons |
| --- | --- |
| The extraction is done, free, by software that has seen millions of pages | It decides what a "figure" is, and it is sometimes wrong |
| Works on the page you are already reading, with no install | Fails on pages that are not articles: dashboards, docs with sidebars, forums |
| Removes tracking pixels, ad slots and newsletter boxes as a side effect | Pull quotes, captions and inline notes are often dropped |
| Gives you the title and byline as separate, clean fields | No control over the rules unless you run the library yourself |

**Who it is for.** Readers keeping articles: journalism, essays, blog posts, anything with one column of prose and a headline. It is the wrong tool for reference documentation, where the sidebar navigation and the tables in the margin are half the value.

Running the library directly is worth knowing about if you are doing this at any volume. Mozilla's Readability is JavaScript, Apache 2.0 licensed, and takes a DOM document; `new Readability(document).parse()` returns an object with the title, byline, an excerpt, the site name and the cleaned article as HTML. It stops there — extraction is the whole scope, and turning that HTML into Markdown is the next tool's job. Postlight Parser does the same kind of extraction and can emit Markdown itself. The comparison between those and the plain libraries is [set out per tool elsewhere](/blog/best-html-to-markdown-converters); the point here is the order of operations. Extract, then convert. Doing it the other way round produces a tidy Markdown rendering of a navigation menu.

## Route three: clipper extensions, and what each one mangles

A clipper is extraction and conversion stapled together behind one toolbar button, and for day-to-day keeping that is the right shape. The cost is a browser extension with permission to read the pages you visit, and an opinion — baked in by somebody else — about what a page is worth keeping.

| Clipper | What it produces | Where it goes | What it tends to mangle |
| --- | --- | --- | --- |
| MarkDownload | A `.md` file, optionally with YAML front matter carrying the URL and title | Your downloads folder, or the clipboard | Whatever the extractor dropped; images stay as remote links unless you ask otherwise |
| Obsidian Web Clipper | Markdown plus page properties, shaped by a template you write | Straight into a vault folder | Highlights and callouts are Obsidian's own conventions, so they travel badly to other tools |
| Notion Web Clipper | Notion blocks, not Markdown | A Notion database or page | Everything Notion has no block for; getting Markdown back needs a second export |
| A generic "save as Markdown" extension | Varies wildly | Downloads | Unknown, which is the problem: you cannot audit what you cannot read |

MarkDownload is the honest workhorse: it runs Readability over the page and then Turndown over the result, which is the same two-stage pipeline described above, wired up for you. It is free and open source under the Apache 2.0 licence, which means the pipeline is inspectable — you can read exactly which rules produced the file you got.

Obsidian's Web Clipper is the one to use if the destination is a vault, because it writes the note where the vault expects it, with the properties your templates rely on. It is free and MIT licensed. Two things to keep in mind. First, its templates are a real feature and worth setting up once: a clipped note with the source URL, the author and the retrieval date in its properties is a note you can still cite in two years. Second, Obsidian's flavour has extensions of its own — wikilinks, callouts, embeds — and a note full of them is not a note another tool will render. [What each of these applications does to Markdown on the way out](/blog/markdown-from-notion-obsidian-and-confluence) is a longer story, and it applies to clipped pages as much as to written ones.

Notion's clipper is the outlier and the one that catches people. It does not save Markdown. It saves the page into Notion as Notion blocks, which is genuinely useful if Notion is where you read things, and a dead end if you wanted a file. To get Markdown out you export the page from Notion afterwards, which produces a zip with hexadecimal ids appended to every filename and databases as separate CSV files. That is two lossy conversions where you asked for one.

**Who clippers are for.** People who keep pages every day and want the decision made for them. If you clip twice a year, the extension permission is not worth it and the two-step route is fine.

### The browser-side option, if you would rather not install anything

Between "paste into a website" and "install an extension" there is a third position: a converter that runs in the browser tab but is not part of the browser. Drop the saved `.html` file onto the page, or paste the HTML you copied from developer tools, and the conversion happens on your own machine. Signed out, transformpipe's [HTML to Markdown conversion](/html-to-markdown) uploads nothing at all — the file is read, parsed and converted locally, which you can verify by opening the network tab and watching nothing happen. Conversion is capped at 10 MB, and a document you choose to keep in an account is capped at 4 MB, because the function that stores it refuses a larger request body.

| Pros | Cons |
| --- | --- |
| No install, no extension permissions, nothing uploaded when signed out | You still have to capture the HTML yourself |
| Keeps GFM tables, task lists, fenced code and headings | One document at a time, not a crawl |
| Also converts the other direction, and out of Word, CSV and JSON | The browser does the work, so a huge page depends on the machine |

**Who it is for.** Somebody with a saved page and one conversion to do, on a machine where installing things is either slow or not allowed.

## Images: download them, or accept the rot

This is the part every guide skips, and it is the part that decides whether your archive is worth having in three years.

Markdown has one image syntax and it holds a location: `![alt](url)`. Convert a web page and that URL is whatever the page used — usually an absolute address on the origin or a CDN. The Markdown is correct the moment you make it and it is not a copy of anything. It is a copy of the text and a pointer at somebody else's images, and pointers rot in at least five ways:

- The site is redesigned and the media paths change.
- The CDN is swapped, the bucket is renamed, or the old prefix stops resolving.
- The URL carried a signed query string with an expiry, and the signature is now stale.
- Hotlink protection starts refusing requests that do not come from the site's own pages.
- The site goes away entirely, which is usually why you saved the page.

There are three honest choices and no fourth.

| Choice | What you get | What breaks | Effort |
| --- | --- | --- | --- |
| Leave the remote URLs | A small text file, images while they last | Every failure above, silently and one at a time | None |
| Download the images beside the file | A folder that is genuinely a copy | Relative paths break if the file moves without the folder | A flag, or a clipper setting |
| Inline the images as data URIs | One file that needs no network at all | A much larger file, and some tools refuse very long URIs | A conversion step |

Downloading is what most people should do, and the tooling for it exists: Pandoc's `--extract-media` writes the media out and rewrites the links, `wget --page-requisites --convert-links` does the equivalent at capture time, and SingleFile and monolith both inline everything into the HTML before conversion is even considered. The catch with a folder is that a Markdown file and its `images/` directory are now one unit, and the link between them is a relative path — which is exactly [the assumption that breaks the first time somebody moves the file](/blog/images-and-links-that-still-work) and not the folder.

Two smaller image problems are worth knowing before you blame the converter. Lazy loading means the real image address often lives in a `data-src` or `srcset` attribute while `src` holds a placeholder, so a converter working on the source HTML captures the placeholder — a grey square or a one-pixel transparent GIF. Copying the rendered DOM after scrolling the page usually fixes it, because by then the browser has swapped the real address in. And `<figure>` with a `<figcaption>` has no Markdown equivalent, so the caption arrives as a loose paragraph under the image, indistinguishable from body text.

## Where saving a page as Markdown fails

The honest answer is that Markdown is a lossy format for the web, and for some pages the loss is the whole point of the page.

**Applications pretending to be documents.** A dashboard, a map, a calculator, a sortable table with filters — there is nothing to save. What you can keep is a screenshot or a PDF, which preserves the picture and abandons the text.

**Anything that needs the network to exist.** Embedded video, tweets, CodePen frames, comment threads loaded on scroll, interactive charts drawn from a JSON feed. A converter turns an `<iframe>` into nothing, or into a link to a URL that may not outlive the page.

**Infinite scroll and pagination.** You get what was loaded when you captured. A thread with two hundred replies gives you the first twenty, and nothing in the file says so.

**Content behind a login.** A clipper works because the browser is already authenticated; `curl` is not, and will fetch the sign-in page instead and convert it perfectly.

**Structural HTML with no Markdown equivalent.** Tables using `rowspan` or `colspan`, definition lists, nested tables, sidenotes, `<details>` blocks, mathematics rendered by KaTeX or MathJax, syntax-highlighted code where the language lives in a class name the converter does not read. Some converters emit raw HTML for these, which keeps the information at the cost of portability; others approximate; others drop them. Tables are the most common casualty and the most visible, and [what makes a table survive the trip](/blog/markdown-tables-that-survive-conversion) is worth reading if your pages are documentation.

**The security question, if the file is going anywhere.** Markdown permits raw HTML, and HTML converted from a web page can carry raw HTML through — including `<script>`, `onerror=` handlers and `javascript:` URLs from the page you saved. That is inert in a text editor and live the moment you convert it back to HTML and open it in a browser. If a saved page is going to become a page again, [sanitising is the step that cannot be skipped](/blog/sanitising-markdown-safely).

**And the cost nobody states.** A Markdown copy is a snapshot with the layout, the styling and the identity of the source stripped off. It is smaller, searchable, greppable, diffable and yours. It is also no longer proof of anything, because you could have typed it. If you need to show what the page said, keep the HTML — or the archive snapshot — as well as the Markdown, and record the URL and the date you fetched it in the file's front matter. That habit costs one line and settles arguments.

## Your own reading, not republication

Saving a page for yourself and publishing what you saved are different acts, and the second one is not covered by the first.

The text and images on a web page are somebody's work, and copyright applies whether or not there is a notice. Keeping a personal copy to read, annotate, search and quote from is ordinary use, and the exceptions most jurisdictions provide — fair dealing for non-commercial research and private study in the UK, fair use in the US — exist for roughly that. Taking the Markdown you produced and posting it on your own site, feeding it into a product, or circulating it as a document with your name on the top is a different question, and the answer depends on how much you took, what you did with it, and whether you are charging for it. None of that is legal advice; the practical version is below.

| What you are doing | How it usually reads | What to do about it |
| --- | --- | --- |
| Keeping an article to read offline | Personal use | Nothing. Record the URL and the date |
| Quoting a paragraph with attribution | Ordinary citation | Link to the original, name the author |
| Reposting the whole article on your site | Republication | Ask, or link instead of copying |
| Building a searchable corpus for a team | Depends entirely on scale and licence | Check the terms; ask for permission in writing |
| Feeding pages into a commercial product | Not personal use in any reading | Get advice before, not after |

Then there is the politeness half, which is technical and not optional. `robots.txt` is a request rather than a licence, and a script that fetches a thousand pages is a crawler however you think of it. Fetch slowly, one page at a time, with a pause between requests. Send a User-Agent that says who you are and how to reach you. Honour a `429` and any `Retry-After` header it comes with rather than retrying immediately. Cache what you have already fetched so a re-run does not hit the site again. And read the terms of service before automating anything against a site you do not own, particularly where content sits behind a login or a paywall — getting around an access control is a separate matter from copyright, and a worse one.

One page, saved by hand, from a site you read: nobody minds, and this is what browsers have had a save button for since the beginning. A scripted sweep of an entire publication: ask first.

## How to choose

1. **Start from what you will do with the file.** Reading it later means an extractor is your friend and the furniture is noise. Quoting it in an argument means keep the HTML too, because the Markdown proves nothing on its own.
2. **Capture before you convert.** Save the HTML, or copy the rendered DOM, and keep it. Conversion tools improve and your requirements change, and a file on disk can be run through a better tool next year — a paste into a text box cannot.
3. **Decide about images at capture time, not afterwards.** Downloading them costs one flag while you have the page in front of you, and costs a broken archive if you put it off until the URLs have already rotted.
4. **Check the tables before you trust the tool.** Tables are not in the CommonMark specification, so a converter must implement GFM tables deliberately. Convert one page that has a table and look at it; that single test catches most of the bad options.
5. **Sanitise anything that will become HTML again.** A page you saved can carry scripts, and a faithful round trip carries them back to a browser. If the Markdown is only ever going to be read as text this does not matter; the moment it is published it is the only thing that matters.
6. **Count the installs against the frequency.** Clipping daily justifies an extension and a template. Two pages a year does not: use reader mode, save the HTML, convert it in a browser tab, and keep your permissions to yourself.

## Conclusion

The reliable way to keep a web page is two steps that look like one: get the article out of the page, then get the Markdown out of the article. Reader mode or an extractor does the first, any competent converter does the second, and a clipper does both at once in exchange for an extension permission. Whichever route you take, save the images or knowingly accept that they will fade, write the source URL and the date into the file, and remember that the copy is for you — the page still belongs to whoever wrote it.

## FAQ

### What is the fastest way to save a web page as Markdown?

Turn on the browser's reader mode, copy the cleaned article, and paste it into a converter — that is under a minute and no install. If you do it often, a clipper extension reduces it to one click at the cost of granting an extension access to the pages you visit.

### Which browser save format should I pick?

"Webpage, Complete" if you want the images on disk, or "Webpage, HTML only" if you only care about the text. Avoid "Webpage, Single File" (`.mhtml`) and Safari's Web Archive when Markdown is the goal, because most converters cannot read either format.

### Why does my saved page convert to almost nothing?

The page most likely renders its content with JavaScript, so the saved source is an empty shell. Open developer tools, right-click the `<html>` element, choose Copy then Copy outerHTML, save that as an `.html` file, and convert it instead — that is the page as the browser built it.

### Do the images come with the Markdown?

Not by default. A converter writes the image URLs it found, which point at the original site and keep working only for as long as that site does. Use Pandoc's `--extract-media`, `wget --page-requisites --convert-links`, or a tool that inlines assets, if you want a copy rather than a pointer.

### Can I convert a URL straight to Markdown without installing anything?

Yes, for straightforward pages: Pandoc accepts a URL as input, and several online tools take one. Both approaches skip extraction, so expect the navigation and the footer in the output unless the tool runs an extractor of its own first.

### Is it legal to save a web page as Markdown?

Keeping a personal copy to read is ordinary use, and it is what a browser's save button is for. Republishing what you saved, or building a commercial corpus out of many pages, is a different question that turns on scale, licence and terms of service — ask before automating a site you do not own.

### Can I convert a whole site at once?

Technically yes, with `wget` and a converter in a loop, and it is the request most likely to annoy a site owner or get your address blocked. Rate-limit it, identify yourself in the User-Agent, honour `429` responses, and consider whether an archive snapshot or an offer to ask for the source would serve you better.
