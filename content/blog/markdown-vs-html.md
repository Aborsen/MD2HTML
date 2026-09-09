---
title: "Markdown vs HTML: Which to Write In, and When to Switch"
description: Markdown or HTML? Decide by what happens to the document next — review, conversion, exact layout, interactive parts — and which limits are features
date: 2026-08-15
tag: Workflow
keywords: markdown vs html, markdown or html, difference between markdown and html, when to use markdown, raw html in markdown, markdown limitations, html vs markdown documentation
---

Nobody asks "Markdown or HTML?" in the abstract. The question arrives attached to a file: a runbook somebody has to keep current, a page that has to look exactly like the printed version, a template that has to survive Outlook. The two formats are not competing at the same job, and the argument only gets settled by asking what happens to the document after you finish writing it.

### TL;DR

Write Markdown when the document will be read, reviewed, edited by other people and probably converted; write HTML when the layout, the interactivity or the delivery channel is the content. Markdown's limits are the reason it is reviewable — a file that cannot express a two-column layout also cannot hide a change from a diff. Raw HTML inside Markdown is the correct escape hatch for one figure, one iframe, one `<details>`, and a warning sign when it appears in every third paragraph. The exceptions where you should start in HTML and stay there are narrow and identifiable: email templates, anything needing exact page layout, and anything with moving parts.

Most of the friction people blame on the format is actually a mismatch. Somebody writes a policy document in HTML because the final artefact is a web page, and eighteen months later nobody can review a change to it, because the diff is forty lines of altered markup around three altered words. Somebody else writes a print-ready invoice in Markdown, discovers there is no way to force a page break, and ends up pasting `<div style="page-break-after: always">` into the middle of a paragraph.

Both directions cost the same thing: the format stopped matching the document's future. Markdown is a writing format that converts into a publishing format. HTML is the publishing format. Choosing means deciding which of those two jobs dominates the file's life.

The rest of this piece is the decision, case by case, plus the parts of it people get wrong — what Markdown genuinely cannot do and why that is a feature rather than a gap, where the raw-HTML escape hatch is legitimate, and what it costs when the usual answer of "write Markdown and convert" turns out to be wrong.

## What the choice actually decides

The visible difference is syntax: `## Heading` against `<h2>Heading</h2>`. That is the least interesting difference, and it is the only one most comparisons cover.

What you are really choosing is where the presentation lives. In HTML, structure and presentation sit in the same file, or at least in the same repository, wired together by classes and a stylesheet. Change the heading and you may need to change the wrapper, the class, and the CSS rule that targets it. In Markdown, presentation lives entirely outside the document. The file says "this is a level two heading" and refuses to say anything about what a level two heading looks like. That single constraint is what makes a Markdown file portable, diffable and safe to hand to somebody who does not write code.

You are also choosing the size of the editable surface. An HTML document has thousands of legal states, and most of them are broken in some subtle way — an unclosed `<li>`, a `<div>` nested inside a `<p>`, a stray attribute that a browser silently repairs and a validator flags. A Markdown document has a small number of constructs and almost no way to break the parse. The worst that usually happens is that a list renders as a paragraph, which is visible immediately.

And you are choosing who the second author is. This is the part that decides most real cases. If the answer is "a support engineer at 2am", "a lawyer", "a product manager" or "somebody in six months who has never seen this repository", the format needs a low floor. If the answer is "the same front-end developer who wrote it", the floor does not matter and the ceiling does.

Three questions settle nearly every case:

- **What is the final artefact?** A web page, a PDF, an email, an in-app help panel, or a file in a repository that people read as text.
- **Who edits it after you?** One developer, a mixed team, or the public.
- **Does anything about it have to be exact?** Exact page breaks, exact column widths, exact rendering in a named client. Exactness is the strongest argument for HTML there is.

## Markdown vs HTML: the cheat sheet

One table, read across. The third column is the option people forget they have — write Markdown, convert it, and treat the HTML as a build product rather than a source file.

| Question | Markdown | Hand-written HTML | Markdown, converted to HTML |
| --- | --- | --- | --- |
| Cost of writing a page of prose | Lowest: the syntax is out of the way | Highest: tags, nesting, wrappers | Lowest, plus one build step |
| What a code review shows | Changed words | Changed words buried in changed markup | Changed words in the source; output regenerated |
| Who can edit it safely | Anybody who can type | People comfortable with markup | Anybody, on the Markdown side |
| Exact layout — columns, page breaks | Not expressible | Full control | Only what the template provides |
| Interactive parts — forms, scripts, widgets | Not expressible | Native | Only through raw HTML passthrough |
| Reliable rendering in email clients | No | Yes, with email-specific markup | No, not without an email-specific template |
| Tables | Simple grids only, no spans or nesting | Any table | As good as the flavour allows |
| Accessibility attributes — `lang`, `scope`, ARIA | Mostly absent | Complete | From the template, not the prose |
| Risk of shipping a script by accident | Low, until raw HTML is allowed | It is your script | Depends entirely on sanitising |
| Readable in ten years without tooling | Yes, it is prose | Yes, but it reads as markup | Source stays readable |
| Where the styling lives | Nowhere in the file | In the file or its stylesheet | In the converter or the template |
| What you can send somebody | A `.md` file they may not be able to open | A file that opens, if self-contained | A complete HTML document |

The pattern in that table is consistent. Markdown wins every row about people and time. HTML wins every row about control and delivery. The third column is Markdown's people-and-time wins with HTML's delivery, at the price of a conversion step you now own.

## The cases, decided by destination

Nothing below is a matter of taste. Each case has a destination, and the destination picks the format.

### Documentation that lives beside the code — Markdown

If the document sits in a repository next to the thing it describes, it should be Markdown. It gets reviewed in the same pull request as the change it documents, which is the only mechanism that reliably keeps documentation current. GitHub, GitLab and every code host render it without a build. New joiners edit it without learning a toolchain.

The HTML alternative fails here in a specific way: the docs stop being reviewed. A reviewer who sees a 60-line markup diff for a two-sentence correction approves it without reading, and after that the documents drift. [Keeping documentation in the repository](/blog/documentation-that-lives-in-the-repo) is a workflow decision more than a formatting one, and Markdown is the format that makes the workflow cheap enough to hold.

**Who it is for:** engineering teams, anybody whose document has a version number attached to a codebase.

### README files, changelogs, contribution guides — Markdown

These are read as text as often as they are read as pages. A changelog is grepped, diffed, pasted into a release note and occasionally read on a phone in a terminal. HTML makes every one of those worse and improves none of them.

**Who it is for:** every repository, without exception worth arguing about.

### Notes, drafts and anything you are still thinking about — Markdown

Writing HTML while composing prose splits attention between the sentence and its container. The people who write the most Markdown are not developers publishing sites; they are people taking notes, and the format survives because it stays out of the way. A large number of editors exist purely for this, and the good ones make the syntax nearly invisible.

**Who it is for:** anyone whose first draft is not the artefact.

### A document you have to send to a named person — Markdown, converted

Here the answer is neither format on its own. You want to write Markdown and hand over HTML, because a `.md` file is a request that the recipient install or open something, and a complete HTML file is a document that opens in whatever they already have.

The important property of the output is that it is self-contained: doctype, `<head>`, styles inline, no request to a CDN for a font or a stylesheet. A fragment — `<h1>Title</h1><p>Text</p>` with nothing around it — is legal HTML and renders as unstyled black text at the browser's default width, which reads as broken to everybody who receives it.

**Who it is for:** a proposal, a report, a handover document, a spec going to a client.

### A site, a docs portal, a blog — Markdown, converted by a generator

Multiple documents that link to each other need navigation, feeds, search and a shared template. That is a static site generator's job, and every one of them takes Markdown as input for the same reason: nobody wants to hand-author a hundred pages of markup. The HTML in that arrangement is generated, and no human should edit it.

**Who it is for:** anybody publishing a set of pages rather than a page.

### Email templates — HTML, and a specific dialect of it

This is the clearest case where Markdown is the wrong starting point, and it is worth being precise about why. HTML email is not the HTML you write for browsers. Clients differ in which CSS they support, some strip a `<style>` block entirely so that styles must be inlined onto each element, and layout is still commonly built with nested tables rather than flexbox or grid. Outlook on Windows has for many years rendered HTML mail through Microsoft Word's rendering engine rather than a browser engine, which is why so much email markup looks like it was written in 2003 — it has to be.

No Markdown converter targets that. A converter emits standards-compliant HTML for a browser, and standards-compliant HTML for a browser is precisely what a hostile mail client mangles. You can write the body copy in Markdown and paste the converted output into a template, but the template itself is hand-built HTML, or built by a framework designed for email such as MJML, which compiles its own component syntax into the nested-table markup clients tolerate. MJML is free and open source.

**Who it is for:** anyone sending mail that has to look the same in more than three clients. Write the template in HTML once; do not try to generate it.

### Anything where the layout is the content — HTML with CSS

Invoices, certificates, contracts with numbered clauses that must not break across pages, posters, forms, anything with a fixed column grid or a footer that must sit at the bottom of every printed page. Markdown cannot express any of that, and no reasonable extension will, because these are presentation instructions and Markdown's whole design is to exclude presentation instructions.

The tools here are CSS paged media — `@page` for margins, `break-inside: avoid` to keep a table row whole, `break-after` to force a new page — and they operate on HTML. If the destination is a printed artefact with rules about how it must sit on the page, start in HTML. If it is a document that merely happens to end up as a PDF, Markdown converted to HTML and printed from the browser is usually enough; [what you gain and lose on that route](/blog/markdown-to-pdf) is worth knowing before you commit.

**Who it is for:** finance documents, legal documents, anything going to a printer.

### Anything with moving parts — HTML

Forms that submit, tabs, filters, charts that respond to input, a calculator, a search box, a table you can sort, a video player with custom controls. These are not documents with decoration; they are small applications. Markdown has no syntax for them and should not acquire one.

The tell is whether the reader does anything other than read. If they click something that changes what they see, you are building HTML, and the prose inside it is a small part of the file.

**Who it is for:** application UI, marketing pages with interaction, dashboards.

### Content in a database, edited by non-technical staff — usually neither, directly

Worth naming because it is common and gets miscategorised. If marketing edits the copy through a CMS, the stored format is whatever the CMS produces — often HTML from a rich-text editor, sometimes a JSON block structure. Choosing Markdown there means asking non-technical editors to learn syntax and to preview their work in a second window. Some teams do this happily; more of them quietly stop using the CMS.

**Who it is for:** teams where the editor is the audience, not the developer.

## What Markdown deliberately cannot do

The list below reads as a list of missing features. It is closer to a specification. Every item was left out so that the format would stay small enough to read as plain text, and each omission buys something.

**No styling of any kind.** There is no syntax for colour, font, size, alignment or spacing. What you get is a claim about structure — heading, list, emphasis — and the decision about appearance is deferred to whatever renders the file. The purchase: one document renders correctly in a code host, an editor's preview, a terminal, a static site and a converted HTML file, because none of them has to agree with the others about appearance.

**No layout.** No columns, no floats, no page breaks, no control over where anything sits. A Markdown document is a single column of blocks in source order. The purchase: it reflows on a phone with no work, and it converts to any layout the template wants rather than fighting one.

**No attributes on elements.** Vanilla Markdown gives you no way to add a class, an id, a `lang`, a `title` or an ARIA role. Several implementations add this as an extension — attribute lists in Python-Markdown, `markdown-it-attrs`, fenced divs in Pandoc — and the moment you use one, your file is tied to that implementation. The purchase: a file with no attributes cannot carry implementation-specific presentation, so it stays portable.

**Tables are grids and nothing more.** GitHub Flavored Markdown gives you a header row, alignment per column, and cells containing inline content. There is no `colspan`, no `rowspan`, no nested table, no cell containing a list or a paragraph break, no caption. If your table needs any of that, you need HTML for the table. The purchase: the table is readable in the source file, which an HTML table is not. Tables are also the single most common thing to break in transit, and [keeping them intact across conversion](/blog/markdown-tables-that-survive-conversion) has its own rules.

**No footnotes, definition lists or maths in the base specification.** CommonMark has none of them. GFM adds tables, task lists, strikethrough and autolinks, and stops there. Footnotes, definition lists, `$…$` maths and admonition blocks are all extensions, supported by some parsers and silently rendered as literal text by others. The purchase: a small specification that many implementations actually implement correctly. It also means "Markdown supports X" is nearly always a claim about one parser rather than about Markdown; [the differences between the flavours](/blog/commonmark-gfm-and-the-flavours) are where most cross-tool surprises come from.

**No conditional content, no includes, no variables.** You cannot say "show this paragraph only for the enterprise edition" or "insert the licence block here". Static site generators bolt this on with front matter and template syntax, which is exactly the point at which your Markdown stops being portable Markdown. The purchase: what you read is what is there.

**No semantics beyond a dozen constructs.** No `<figure>` with a `<figcaption>`, no `<abbr>`, no `<time>`, no `<aside>`, no `<section>` with a labelled heading. For documents that must meet an accessibility standard, this is a real gap, and it is filled either by the conversion template or by raw HTML in the file.

The pattern: Markdown declines to describe appearance, and declines to be extensible in ways that would tie a document to one tool. Both refusals are why a `.md` file from 2011 still works everywhere today. A format that had accepted every reasonable feature request would by now be a worse HTML with a smaller ecosystem.

## Raw HTML inside Markdown: the escape hatch and the smell

Markdown has always allowed raw HTML in the middle of a document. Original Markdown permitted it by design, and CommonMark specifies how block-level and inline HTML behave. So the strict either/or in the title is slightly false: you can write Markdown and drop into HTML for one element.

Whether that is right depends on how often you do it and what you are reaching for.

### Where it is the right answer

| Case | Why HTML is correct here |
| --- | --- |
| One collapsible block — `<details><summary>` | No Markdown syntax exists, it degrades to visible text, and it is a single tag pair |
| An embedded video or map iframe | Markdown has no embed syntax; the alternative is a plugin that ties the file to one renderer |
| A figure with a real caption | `<figure>` and `<figcaption>` carry semantics that `![alt](src)` cannot |
| A table with a merged cell | The grid syntax genuinely cannot express it; one HTML table is honest |
| An anchor to link to mid-document | `<a id="section-3"></a>` where the renderer does not generate heading ids |
| A `lang` attribute on a quoted passage | Required for correct screen-reader pronunciation, impossible otherwise |
| A single badge or inline image with a fixed width | Rare, contained, and obvious to the next reader |

The common thread: the element is small, self-contained, and there is no Markdown construct for it. It appears once or twice in a file, a reader can see what it does, and removing it would lose meaning rather than decoration.

### Where it is a smell

Raw HTML is telling you something when it shows up like this:

- **Wrappers around ordinary prose.** `<div class="callout">` with three normal paragraphs inside. You are reimplementing a template inside the content, and now every document that wants a callout depends on a CSS class that lives somewhere else.
- **Inline styles.** `<span style="color: #c00">` in a paragraph. You have put presentation into a file whose whole value was excluding presentation, and it will be wrong the moment the page has a dark theme.
- **`<br>` used to control spacing.** Usually a sign that the real problem is how line breaks and lists behave rather than a missing feature.
- **Whole sections in HTML.** If two thirds of the file is markup, it is an HTML file with some Markdown in it. Rename it and stop pretending.
- **Tables in HTML for no structural reason.** If the table is a plain grid and somebody wrote it in HTML for the styling, the styling belongs in the template.
- **Anything that runs.** `<script>`, `onclick`, `javascript:` URLs. A document that executes is not a document.

Two practical consequences follow.

The first is portability. Raw HTML passes through cleanly to HTML output and nowhere else. Convert that file to a PDF, a Word document, plain text or a terminal view, and the HTML either disappears, appears as literal angle brackets, or breaks the converter. The more raw HTML in a file, the more the file has quietly committed to one output format.

The second is safety, and it is not theoretical. Because Markdown permits raw HTML, a `.md` file can carry a `<script>` tag, an `onerror` handler or a `javascript:` link, and a faithful converter hands all three to the browser. For your own notes this does not matter. For a README from a repository you did not write, a document a client sent, or user-submitted content, it decides whether your page attacks its reader — which is why [sanitising is a separate step with its own rules](/blog/sanitising-markdown-safely) rather than something you can assume a converter does. Some parsers escape raw HTML by default and some pass it through; you have to know which one you are using.

A workable house rule: raw HTML is allowed for elements Markdown cannot express, and not allowed for appearance. If somebody has to add a CSS class to make it look right, it belongs in the template.

## Review, collaborators and longevity

These three arguments get less attention than syntax and decide more real cases.

### Diffing prose

Version control diffs lines. This is the single most consequential fact about writing documents in a repository, and it explains most of Markdown's advantage.

In Markdown, changing a sentence changes the words in that sentence. A reviewer sees the old wording and the new wording next to each other and can judge whether it is an improvement. In HTML, the same edit can arrive wrapped in changed attributes, a reindented block or a moved `</p>`, and the reviewer's job becomes archaeology. Worse, HTML tempts people to reformat, and a reformatting commit that also changes three words is a commit nobody reviews properly.

Two techniques make Markdown diffs better still, and neither is available in a heavily marked-up file:

- **One sentence per line.** Hard-wrap at sentence boundaries rather than at a column. A changed sentence is then a one-line diff, and moving a sentence is a move rather than a rewrite of a paragraph. It looks odd in the raw file for about a day.
- **Word-level diffs.** `git diff --word-diff` shows changed words rather than changed lines, which turns a rewrapped paragraph from a wall of red and green into a handful of substitutions.

Neither trick rescues HTML, because in HTML the noise is not whitespace, it is structure.

### Who else has to edit the file

Ask honestly who touches the file after you, then match the format to the least technical person on that list. This is a design constraint, not a courtesy.

| Second author | What they can be asked to do |
| --- | --- |
| The same developer | Anything. Format is a preference |
| Another developer, later | Markdown. They will not learn your class names to fix a typo |
| A product manager or support engineer | Markdown, with a preview available. HTML edits will be avoided or broken |
| A lawyer or a finance team | Neither: they will work in Word, and somebody converts |
| A translator | Markdown, and they will thank you for it — markup around the text is where translation errors live |
| The public, via pull request | Markdown, sanitised. Contributions in HTML are a review burden and a security surface |

The failure mode with HTML is not that people edit it badly. It is that they do not edit it at all. They send you a message asking you to change a word, or they change nothing and let the document go stale. Every documentation set that died of staleness died partly of a format that made small corrections feel risky.

### Longevity

A Markdown file is a text file that reads correctly with no software at all. Open it in Notepad in fifteen years and the headings are still visibly headings. That is an unusual property, and it comes from the format's refusal to encode appearance.

HTML is also durable — browsers keep rendering old markup, and a self-contained HTML file with its styles inline is one of the better long-term document formats there is. The problems come from what modern HTML tends to depend on rather than from HTML itself: a stylesheet on a CDN that stops resolving, a font from a service that changed its terms, a script from a package that no longer exists, class names that mean nothing without the framework that defined them. A page that fetches four things over the network is four future failures away from unreadable.

So the longevity ranking is: Markdown source first, self-contained HTML second, HTML with external dependencies a distant third, and anything that needs a build system to render at all last. That is another argument for keeping Markdown as the source of truth and treating HTML as output — the durable thing is the file you can still read, and the disposable thing is the file you can regenerate.

## Where "write Markdown and convert" fails, and what it costs

The usual advice on this page is the right advice most of the time. It is worth being specific about when it is not, because the failure is rarely dramatic — it is a slow accumulation of workarounds until somebody notices the pipeline costs more than the documents are worth.

**When the output gets hand-edited.** The moment somebody opens the generated HTML and fixes something in it, the Markdown stops being the source of truth and you have two divergent files. The next conversion silently discards their fix. This is the most common way a Markdown-to-HTML workflow rots, and the only defence is a rule that generated files are never edited, enforced by putting them somewhere obviously disposable.

**When the design needs per-element control.** If the brief includes "this pull quote is 60% width, right-aligned, with the client's brand colour behind it", Markdown will fight you for every element. You can express it with raw HTML and inline styles, at which point you have an HTML file with extra steps. Cost: hours of workarounds, and a file nobody can maintain.

**When exactness is contractual.** Anything with a specified layout — a regulatory filing, an invoice format a client's system parses, a certificate with a signature block that must sit in a fixed position. Cost: the whole rendering path has to be controlled, and Markdown control of a rendering path is control of a template, one step removed.

**When the channel has its own dialect.** Email, covered above. Also in-app rich text stored as HTML, and anything consumed by a system that expects specific markup. Cost: a converter's clean, standards-compliant output is exactly the wrong output.

**When the document is interactive.** No amount of conversion produces behaviour. Cost: none, if you notice early. Considerable, if you write forty pages of Markdown before discovering that section 9 needs a working form.

**When the flavour drifts.** Your Markdown renders correctly on your code host and incorrectly in your build, because the two run different parsers. Footnotes, task lists, nested list indentation and autolinks are the usual suspects. Cost: a class of bug that only appears in published output, which is the worst place to find one.

**When the file is genuinely huge.** A single document of many megabytes is a poor fit for a browser-side conversion, and past a point it is a poor fit for being one document. Cost: split it, or move the conversion to a build step where memory is not a tab.

**When the pipeline itself becomes the work.** One converter, one template and one script are fine. Four converters, a plugin chain, a custom Lua filter and a container to run it in are a project, and the project needs an owner. Cost: whoever owns it cannot leave without a handover, and documentation pipelines have a way of ending up owned by the one person who understood the template.

None of these is an argument against Markdown for prose. They are an argument for noticing, before you start, which of the two jobs — writing or presenting — dominates the file.

## How to choose

Five criteria, each with the consequence attached.

1. **Name the final artefact before the first line.** If it is a web page, a PDF or a file in a repository, write Markdown; if it is an email, a printed document with fixed layout or an interface, write HTML. Getting this wrong costs a rewrite, and the rewrite always happens later than it should.
2. **Match the format to the least technical person who will edit it.** If a support engineer or a translator has to correct a sentence at short notice, HTML means they will ask you instead, and the document will drift out of date between requests.
3. **Assume every change will be reviewed by somebody in a hurry.** Markdown makes a changed sentence look like a changed sentence; HTML makes it look like a changed file, and reviewers approve what they cannot read.
4. **Count the interactive parts.** One `<details>` block is an escape hatch; a form, a tab strip or a chart means the document is an application and Markdown is the wrong source format for it.
5. **Decide who owns the styling, and write it down.** If it is the template, keep presentation out of the content entirely; if it is the author, you have chosen HTML whether or not the file extension says so — and the next person to edit that file inherits your CSS along with your prose.

## Conclusion

Write Markdown by default, convert it, and keep the HTML as a build product you never edit — that arrangement gives you reviewable prose, editors who are not afraid of the file, and output that opens anywhere, which is most of what people want from a document workflow. Switch to HTML deliberately and completely when the destination demands it: email templates that must survive a mail client's own rendering engine, documents whose page layout is part of the specification, and anything the reader interacts with rather than reads. When the step you need is the ordinary one — Markdown in, a complete self-contained page out, nothing uploaded — [transformpipe does it in the browser](/), free and with no install; when it is one of the exceptions, spend the time in HTML and stop apologising for it.

## FAQ

### Is Markdown better than HTML?

Neither is better; they answer different questions. Markdown is a writing format optimised for people editing text and reviewing changes, and HTML is a delivery format optimised for control over what a browser or a client renders. The common arrangement — write Markdown, convert to HTML — uses each for the job it is good at.

### Can I use HTML inside a Markdown file?

Yes. Original Markdown allowed raw HTML by design and CommonMark specifies how it behaves, so a `<details>` block, an iframe or a table with merged cells can sit in the middle of a Markdown document. Use it for elements Markdown cannot express, not for appearance, and be aware that raw HTML only survives conversion to HTML — other output formats will drop or mangle it.

### Is Markdown safe if it can contain HTML?

Only if something sanitises it. Because raw HTML is permitted, a `.md` file can carry `<script>`, `onerror=` or a `javascript:` URL, and a faithful renderer will pass all of them to the browser. Some parsers escape raw HTML by default and others pass it through, so check which behaviour yours has before converting a file you did not write.

### Should I write my website in Markdown or HTML?

Write the content in Markdown and the template in HTML. Every static site generator works this way for a reason: hand-authoring markup for a hundred pages is unpleasant and inconsistent, while hand-authoring one template is a normal amount of work. Pages that are mostly interface rather than prose — a pricing table with a toggle, a signup flow — are the exception and belong in HTML.

### Why can't I control layout in Markdown?

Because layout is presentation, and Markdown was designed to exclude presentation so that one file could render sensibly in a terminal, an editor, a code host and a converted page. There is no syntax for columns, page breaks or widths, and adding it through inline HTML ties the document to a single output format. If layout is part of the requirement, that is the signal to write HTML.

### Does converting Markdown to HTML lose anything?

Structure survives; anything the flavour does not support does not. Tables, task lists, strikethrough and autolinks need GitHub Flavored Markdown rather than plain CommonMark, and footnotes, definition lists and maths are extensions that many parsers ignore. Convert one representative file and check the tables and lists before committing to a tool.

### Which format should documentation use if the team is not technical?

Markdown, but only with a preview in front of it — a Markdown editor, a wiki that renders as you type, or a pull request preview. Asking non-technical authors to write syntax they cannot see rendered is the reason some teams conclude Markdown does not work for them, when the real problem was the missing preview — and if the answer is that the team would rather stay in Word altogether, [which of the two formats should own the source](/blog/markdown-vs-docx-for-documentation) is the decision to settle before any tooling.
