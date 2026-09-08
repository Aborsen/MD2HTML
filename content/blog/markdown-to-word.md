---
title: "Markdown to Word: How to Get a .docx Somebody Can Edit"
description: Getting Markdown into a .docx a reviewer can edit: Pandoc with a reference document, the HTML route, Google Docs, and what the trip back to Markdown loses
date: 2026-08-24
tag: Publishing
keywords: markdown to word, markdown to docx, convert markdown to word document, pandoc reference docx, md to docx, markdown to word online, pandoc markdown to word template
---

Nobody converts Markdown to Word for their own benefit. It happens because somebody else — a lawyer, a client, a head of department, a regulator — works in Word, tracks changes in Word, and will not read a file that arrives as text with hash marks in it. The conversion is a concession, and the question is which concession costs least.

### TL;DR

Use Pandoc with a reference document: `pandoc report.md --reference-doc=house.docx -o report.docx`. The reference document is an ordinary `.docx` whose styles Pandoc copies into the output, so the file your reviewer opens carries your organisation's headings, margins and body text rather than Pandoc's defaults. The convert-to-HTML-then-open-in-Word route is quicker and produces a document with no usable style set, which is fine for a memo and wrong for anything that will be restyled. And know before you start that the trip back is lossy: tracked changes can be read out of the returned `.docx`, but they arrive as inline annotations you cannot accept or reject, so treat the reviewer's edits as advice to re-apply by hand.

Markdown and `.docx` are not two encodings of the same thing. Markdown is a small set of structural marks — this is a heading, this is a list, this is a link — and nothing else. A `.docx` is a zip archive of XML in which every paragraph points at a named style, the styles live in a stylesheet, numbering lives in its own part, and the whole thing carries page size, margins, headers, footers and a revision history. Going from the first to the second means inventing everything the second has and the first does not.

That invention is the entire job, and it is where the routes differ. Pandoc invents from a template you control. Word, opening an HTML file, invents from CSS and its own web-oriented styles. Google Docs invents from Google's styles. An editor's export button usually invents from Pandoc's defaults, because most of them are Pandoc with a menu item in front of it.

The second thing worth knowing up front: if the reviewer only needs to read the document, none of this applies. A PDF or a self-contained HTML page is a better artefact than a `.docx`, and [converting Markdown to PDF](/blog/markdown-to-pdf) is a shorter road with fewer things to go wrong. Word only earns its complexity when somebody is going to edit.

## Why this comes up at all: the reviewer works in tracked changes

The request is almost never "please send Word format". It is "I need to comment on this", and in most organisations commenting means Word's Review ribbon: insertions in coloured underline, deletions struck through, a margin full of comment balloons with names on them, and an Accept/Reject button for each one. That workflow is decades old, it is what legal and compliance teams are trained on, and it has no equivalent in a Markdown file.

Git has an equivalent, of course. A pull request with line comments does the same job better and keeps the history. But you cannot send a pull request to somebody's general counsel, and the meeting where you explain that they should learn one is a meeting you will lose. So the document leaves the repository as a `.docx` and comes back as a `.docx` with someone else's edits in it, and the interesting engineering question is what you do at that moment.

Getting this wrong in a specific and expensive way is common. A team exports to Word, the reviewer spends two days marking it up, the file comes back, and the team discovers that reconciling forty tracked insertions against a Markdown source is manual work nobody budgeted for — or worse, that somebody has accepted all changes, converted back, and produced a commit that rewrites every line in the file because the converter wraps paragraphs differently. Deciding the return path before you send anything is the difference between a review and an incident.

## Quick comparison: the cheat sheet

| Route | Best for | What it needs | What it costs you |
| --- | --- | --- | --- |
| Pandoc with `--reference-doc` | Any document that must look like your organisation's | Pandoc installed, a `.docx` template you have edited | An afternoon building the template once |
| Pandoc with no reference document | A draft where appearance is irrelevant | Pandoc installed | Pandoc's default styles, which look like nothing in particular |
| Convert to HTML, open in Word | A short memo nobody will restyle | A Markdown to HTML converter and Word | No usable style set; CSS arrives as direct formatting |
| Self-contained HTML, then LibreOffice headless | Automating the above on a server | LibreOffice installed, no Word licence | LibreOffice's interpretation of your CSS |
| Google Docs as intermediary | Teams already in Google Workspace | A Google account | The document sits on Google's servers; you get Google's styles |
| Typora, VS Code and similar editors | One file, from the app you are already in | The editor, plus Pandoc for `.docx` | Usually no way to pass a reference document |
| Writage, inside Word | Reviewers who will never leave Word | A paid Word plugin on their machine | A per-machine install and a licence |
| Paste rendered Markdown into Word | Two paragraphs, right now | A rendered preview and a clipboard | Direct formatting throughout; images may go missing |
| Markdown to PDF instead | A reviewer who reads but does not edit | Any of the PDF routes | No editing, no comments in the file itself |
| python-docx, building the file yourself | A generated document with exact requirements | Python, and a specification | You are now writing a Word writer |

## Pandoc and the reference document, properly explained

Pandoc is the real answer here, and the reference document is the part people skip. Converting without one works — `pandoc report.md -o report.docx` produces a valid Word file — and it produces a document that looks like a Pandoc document: Calibri-ish, generously spaced, headings in a blue nobody chose. Reviewers read that as a draft from outside the organisation, which it is.

### What a .docx keeps that Markdown does not have

Rename a `.docx` to `.zip` and open it. Inside, `word/document.xml` holds the text, and almost every paragraph in it carries a `w:pStyle` element naming a style: `Heading 1`, `Body Text`, `Source Code`. The style itself — font, size, spacing, colour, keep-with-next, outline level — lives in `word/styles.xml`. Numbering definitions for lists live in `word/numbering.xml`. Page size, margins, headers and footers live in the section properties.

This indirection is why Word documents are editable in a way a PDF is not. A reviewer who changes the `Heading 2` style changes every second-level heading at once. A document whose formatting was applied directly — bold here, 14pt there — looks identical and cannot be restyled at all, and every route in this article except Pandoc-with-a-template produces some amount of that direct formatting.

### How --reference-doc works

`--reference-doc=FILE` is documented as: "Use the specified file as a style reference in producing a docx or ODT file." What Pandoc takes from that file is its stylesheets and its document properties, including margins, page size, header and footer (checked on pandoc.org, 8 September 2026). Your content is written into that shell.

The mechanism is blunt and that is its virtue. Pandoc writes a paragraph, tags it `Heading 1`, and Word looks up `Heading 1` in the stylesheet that came from your reference file. There is no mapping layer to configure and no template language to learn. If the style exists in the reference document, your output uses it. If it does not, Word renders a reference to a style it cannot find as plain `Normal` text — which is exactly why code blocks come out looking like body text when somebody uses the company letterhead as a reference document without adding a `Source Code` style to it.

### The style names Pandoc looks for

This is the list worth pinning to the wall, because a reference document is only as good as its coverage of it. The paragraph styles Pandoc uses in the docx writer are `Normal`, `Body Text`, `First Paragraph`, `Compact`, `Title`, `Subtitle`, `Author`, `Date`, `Abstract`, `AbstractTitle`, `Bibliography`, `Heading 1` through `Heading 9`, `Block Text`, `Footnote Block Text`, `Source Code`, `Footnote Text`, `Definition Term`, `Definition`, `Caption`, `Table Caption`, `Image Caption`, `Figure`, `Captioned Figure` and `TOC Heading`. The character styles are `Default Paragraph Font`, `Verbatim Char`, `Footnote Reference`, `Hyperlink` and `Section Number`. There is one table style, called `Table` (checked on pandoc.org, 8 September 2026).

Read that list as a map of what Pandoc can express. `Source Code` and `Verbatim Char` are why fenced blocks and inline code can look like code. `Block Text` is your blockquote. `Image Caption` and `Captioned Figure` are what `![A caption](diagram.png)` becomes. `Definition Term` and `Definition` only matter if you use Pandoc's definition-list syntax. If your house template defines none of these, that is the afternoon's work.

### Building a reference document, step by step

1. **Start from Pandoc's own default rather than a blank file**, with `pandoc -o custom-reference.docx --print-default-data-file reference.docx`. It already contains every style in the list above, correctly wired, including the list numbering definitions — so you are restyling a working document instead of discovering three days later that ordered lists come out as plain paragraphs.
2. **Open it in Word and modify the styles, never the text.** Right-click a style in the Styles gallery, choose Modify, and change font, size, spacing and colour there. Formatting applied directly to the sample text achieves nothing, because your content replaces it.
3. **Do the headings first and check the outline level on each one.** Word's navigation pane, the table of contents and every PDF export you make later all read outline levels, so a `Heading 2` styled to look like a heading but left at body-text level will produce a document that cannot be navigated.
4. **Set page size, margins, header and footer in the reference document, not per-conversion.** These are document properties and Pandoc carries them across, which means the reference document is also where your page furniture lives — a footer with a document number, say, appears on every conversion without being mentioned in any command.
5. **If you must start from a house template instead, add the styles it lacks by name.** Corporate templates almost always have `Heading 1` to `Heading 4` and nothing else on the list; `Source Code`, `Verbatim Char`, `Block Text`, `Image Caption`, `Table Caption` and the `Table` table style are the usual gaps, and each missing style is a category of content that arrives unformatted.
6. **Test with a document that uses everything.** One file with nine heading levels, an ordered list nested inside an unordered one, a blockquote, a fenced code block with a language, inline code, a footnote, a link, an image with a caption and a three-column table. Convert it, open it, and look. That file belongs in the repository next to the template.
7. **Commit the reference document alongside the Markdown.** It is a build input, it will drift when someone rebrands, and a template that lives in one person's Downloads folder is a template that stops existing when they leave.

### The flags that matter for the docx writer

| Flag | What it does |
| --- | --- |
| `--reference-doc=FILE` | Styles and document properties come from `FILE` |
| `--toc` | Inserts a table of contents built from the headings |
| `-N`, `--number-sections` | Numbers section headings; the manual names Docx among the supported outputs |
| `--highlight-style=NAME` | Picks the syntax highlighting theme for code blocks; `--list-highlight-styles` prints the options |
| `--resource-path=DIRS` | Where to look for images referenced by relative path |
| `--dpi=NUMBER` | Pixels-to-inches conversion for image sizing; the default is 96 |
| `--lua-filter=FILE` | Rewrites the document mid-conversion, before the writer sees it |
| `--metadata-file=FILE` | Supplies title, author and date without touching the Markdown |

All of these are current Pandoc options (checked on pandoc.org, 8 September 2026). Two more things are worth knowing about the writer. Images are pulled into the `.docx` package, so the output is one self-contained file rather than a document with links to your filesystem — but only if Pandoc can find them, which is what `--resource-path` is for and why [images and links that still work](/blog/images-and-links-that-still-work) is worth reading before you move a folder. And raw HTML in your Markdown is dropped: a `<div>` or a `<br>` reaches the HTML writer and not the docx writer, so a Markdown file that leans on inline HTML for layout loses that layout silently.

Two Pandoc extras are genuinely useful once the basics work. A fenced div with a `custom-style` attribute applies any Word style you like to its contents — `::: {custom-style="Warning"}` wraps a block in your template's `Warning` paragraph style — and the bracketed-span equivalent does the same for character styles. And [tables](/blog/markdown-tables-that-survive-conversion) get the `Table` table style, which is the only table formatting you get, so define it properly and expect nothing clever about column widths.

**Who it is for:** anybody who will do this conversion more than twice. The template is a fixed cost paid once and amortised across every document afterwards, and it is the only route here that produces a `.docx` a Word user can restyle from the Styles gallery.

## The HTML route: convert to HTML, then open it in Word

Word opens `.html` files. This is not a trick and it is not new; it has worked since Word learned to save web pages. Convert your Markdown to HTML, double-click the result, and Word renders it as a document you can then save as `.docx` from File, Save As.

It is genuinely the fastest route, needs no install beyond a browser-based converter, and for a short document it is fine. It is also the route that produces the least editable file, and it is worth being precise about why.

**Word maps imported HTML onto its own web-oriented built-in styles**, not the ones in your template. Body paragraphs tend to arrive as `Normal (Web)`, preformatted blocks as `HTML Preformatted`. Your organisation's `Body Text` is not involved. The document looks reasonable and belongs to no template.

**CSS becomes direct formatting.** A stylesheet that says `h2 { color: #1a4f7a; font-size: 20px }` does not become a `Heading 2` style definition; it becomes formatting applied to those paragraphs. The reviewer who opens the Styles gallery to change the heading colour finds nothing to change, and the person who inherits the document later cannot restyle it at all.

**Tables arrive without a table style.** Borders and padding come from your CSS as direct cell formatting, so applying the house table look means selecting each table and choosing a style by hand — which also discards whatever your CSS did.

**Images only survive if they are inside the file.** An HTML file that references `diagram.png` next to it works until the file is emailed on its own, at which point the reviewer gets a placeholder. A self-contained HTML export, with images inlined as data URIs and styles in a `<style>` block, is the version of this route that actually travels.

**The file is still HTML until somebody converts it.** If you send the `.html` and the reviewer edits and saves, they are still editing HTML, and Word's HTML output has its own habits. Save As `.docx` yourself before sending, and check the result rather than assuming.

**Page setup comes from nowhere.** No page size, no margins, no header or footer, because the HTML did not have any. For a document that will be printed or paginated, that is a set of decisions somebody now has to make by hand.

For automation, the same route runs without Word at all: produce self-contained HTML, then `soffice --headless --convert-to docx report.html`. LibreOffice does a competent job and its interpretation of your CSS is its own, so test it once rather than trusting it.

**Who it is for:** one-off documents where the reviewer will comment and not restyle — a two-page memo, a spec sent for a single round of remarks. Not for anything that enters a template-governed document set.

## Google Docs as the intermediary

Google Docs reads and writes Markdown natively. In Docs, File, Open, Upload takes a `.md` file and opens it as a document; from Drive, right-click the uploaded file and Open with Google Docs. The reverse is File, Download, Markdown (.md). There is also a Tools, Preferences setting called Enable Markdown that turns on Copy as Markdown and Paste from Markdown for moving fragments around (checked on support.google.com, 8 September 2026).

That makes Docs a two-step route to Word: import the Markdown, then File, Download, Microsoft Word (.docx). It requires nothing installed and no terminal, which is why it keeps getting recommended.

| Pros | Cons |
| --- | --- |
| No install, no command line, works from any machine | The document is uploaded to Google's servers |
| Import and export are both first-party features | You get Google's styles — Title, Heading 1 to 6, Normal text — not your template's |
| The reviewer can comment in Docs and skip `.docx` entirely | No `Source Code` equivalent, so code blocks arrive as monospace direct formatting |
| Suggestion mode is a real review workflow with a real audit trail | Suggestions do not survive the Markdown export; you get the current text |

The genuinely interesting thing about this route is that it can remove the need for Word. If the reviewer's objection is "I need to comment and suggest changes", Docs' suggestion mode does that, with names and dates and an accept/reject control, in a browser, with no file passing back and forth. It is a better answer than a `.docx` round trip whenever the organisation will accept it — and the same reconciliation problem waits at the end, because the Markdown export gives you the resolved text and not the suggestions.

The cost is where the document goes. For a public README it does not matter. For an unreleased plan, a contract or anything under a confidentiality obligation, uploading it to convert it is the whole question, and the fact that the conversion is convenient does not change the answer.

**Who it is for:** teams already inside Google Workspace, converting documents that are not sensitive, where the reviewer is comfortable in Docs.

## Editors that export .docx, and what they are really doing

Several Markdown editors have Word in their export menu. It is worth knowing what sits behind that menu item, because in most cases it is Pandoc.

**Typora** exports to Word, ODT, RTF, EPUB, LaTeX and more — and its own documentation says that for formats other than HTML, PDF and images, Typora uses Pandoc for exporting, which you must install yourself (checked on support.typora.io, 8 September 2026). So Typora's Word export is Pandoc's Word export with a dialog in front of it, and it carries Pandoc's default styles unless the editor lets you pass extra arguments. Typora is $14.99 without tax, a one-time purchase covering up to three devices, with a 15-day free trial (checked on typora.io, 8 September 2026).

**VS Code** has no built-in `.docx` export; extensions add it, and the ones that do generally shell out to Pandoc as well. If you are converting from an editor, knowing that the real engine is Pandoc tells you where to look when the output is wrong: at the reference document, not at the editor.

**Obsidian** exports PDF from the core application. Word export comes from a community plugin that calls Pandoc, with the same consequence — the styles are Pandoc's until you point it at a template.

**Writage** inverts the problem. It is a Markdown plugin for Microsoft Word itself, available for Windows and macOS, that opens and saves `.md` files from inside Word and converts in both directions. It is a paid plugin sold for a one-time fee, with a free trial (checked on writage.com, 8 September 2026). Its point is placement: the conversion happens on the reviewer's machine, in the application they already have open, which sidesteps the whole question of who converts what and when.

**Copy and paste** deserves a mention because people do it regardless. Copy the rendered output from a preview pane or a browser, paste into Word, and the HTML clipboard format carries headings, bold, lists, links and table structure across surprisingly well. Everything arrives as direct formatting, images are hit and miss depending on how they were referenced, and code blocks usually lose their background. For two paragraphs it is the correct amount of effort. For a document, it is a route to a file nobody can maintain.

The broader point about editors: they are the right choice when the conversion is occasional and the appearance does not matter much, and the wrong choice when it is part of a repeatable process, because the thing you most need to control is the thing they most often hide. Which editor suits you is a separate question, and [the editor comparison](/blog/best-markdown-editors) answers it better than an export menu does.

**Who it is for:** writers converting their own documents, one at a time, who already live in the editor.

## Where the round trip back to Markdown fails, and what it costs

Here is the honest part. Getting Markdown into Word is a solved problem — Pandoc plus a template, done. Getting the reviewed Word document back into Markdown is not solved, and pretending otherwise is how teams end up with a repository that no longer matches the document everyone is discussing.

Start with what Pandoc can do, because it is more than most people expect. Reading a `.docx`, `--track-changes` takes three values. `accept` is the default and processes all insertions and deletions. `reject` ignores them. `all` includes insertions, deletions and comments, wrapped in spans with the classes `insertion`, `deletion`, `comment-start` and `comment-end`, and the author and time of each change are included; a whole inserted or deleted paragraph produces a span with class `paragraph-insertion` or `paragraph-deletion` before the affected paragraph break. The option only affects the docx reader (checked on pandoc.org, 8 September 2026).

So the review is recoverable as data:

```
pandoc --track-changes=all -f docx -t markdown review.docx -o review.md
```

Now the costs, in order of how much trouble they cause.

**The changes stop being changes.** In Word, an insertion is a proposal with a button attached. In the converted Markdown it is a bracketed span with an author attribute — text about a change, sitting in the prose, which no Markdown tool can accept or reject. You read it and retype the decision. For a document with a dozen edits that is twenty minutes. For a document marked up line by line it is a day, and it is a day of transcription with no test to tell you when you got it wrong.

**Comments lose their anchors.** A comment in Word attaches to a range. Converted, it becomes a `comment-start` and a `comment-end` span, and while that works for a phrase inside a paragraph, comment ranges that span several paragraphs or that overlap a tracked deletion come back distorted or detached. A comment whose target you cannot identify is a comment somebody has to chase by opening the original `.docx` anyway.

**`accept` and `reject` each throw away half the information.** `accept` gives you clean text and no record of who changed what or why, which is precisely what the review was for. `reject` gives you your own document back. Neither is a bad option — they are just not a review; they are a way of ending one.

**The diff is worthless unless you normalise first.** This is the failure that surprises people. Convert a `.docx` to Markdown and the output is Pandoc's Markdown: its line wrapping, its escaping, its heading style, its table alignment. Every line differs from your original, so `git diff` shows the entire file as changed and the reviewer's actual edits are invisible inside it. The fix is to make both sides speak the same dialect. Convert your own Markdown through the same pipeline once, commit that normalised version as the source, and pin the output settings on the way back:

```
pandoc --track-changes=all -f docx -t gfm \
  --wrap=none --markdown-headings=atx \
  review.docx -o review.md
```

With the same flags on both sides, the diff shows the review and nothing else. Without them, it shows a rewrite.

**Everything Word can express and Markdown cannot is gone regardless of flags.** A reviewer's highlighting, a colour used to mean something, a comment thread with three replies, a restructured table, a suggested figure placement, a rewritten heading hierarchy expressed by restyling rather than retyping — none of that has anywhere to land. The reconciliation problem in the other direction, and the things a `.docx` carries that no Markdown file can hold, are covered properly in [converting a .docx back to Markdown](/blog/convert-docx-to-markdown).

**What it costs, stated plainly:** the round trip is one-way in practice. Markdown out, `.docx` back, comments read by a human, edits re-applied by hand to the Markdown, which remains the single source. Any process that treats the returned `.docx` as an input to be merged automatically will produce either a lost review or a commit nobody can read. Agree that with the reviewer before you send the file — "send me your comments and I will apply them, and the version in the repository is the one that counts" — and the friction becomes a step in a process instead of an argument about which file is current.

## How to choose

1. **Decide whether the reviewer edits or only reads.** If they only read, produce a PDF or a self-contained HTML page and stop; you will avoid the entire round-trip problem, and a document nobody can edit cannot fork into two versions.
2. **Count how many times you will do this.** Once, from an editor's export menu, is rational. Weekly means building a reference document, because the alternative is re-applying the house look by hand every week and getting it slightly different each time.
3. **Ask whether the output will be restyled.** If it enters a template-governed document set, the HTML route is disqualified — its formatting is direct rather than styled, and a document that cannot be restyled will be retyped instead.
4. **Check where the file is allowed to go.** A route through a hosted service means the document is on somebody else's server; for anything confidential that rules out the convenient options and leaves you with Pandoc on your own machine.
5. **Agree the return path before you send anything.** Write down who converts the reviewed file, with which flags, and who applies the changes to the Markdown. The cost of skipping this appears at the worst possible moment, which is when the review comes back and the deadline is Friday.
6. **Test with a document that exercises everything, on the actual reviewer's copy of Word.** Nine heading levels, nested lists, a code block, a footnote, a captioned image and a wide table. Version and platform differences in Word show up on exactly these, and finding out from the reviewer is expensive.

## Conclusion

The route that works is Pandoc with a reference document you built once and committed next to your Markdown, because it is the only one that produces a Word file carrying real styles rather than frozen formatting — and styles are what makes a `.docx` worth sending to somebody who is going to edit it. The HTML route is a reasonable shortcut for a short document, and it improves considerably if the HTML you start from is a complete, self-contained file rather than a fragment, which is what [transformpipe's Markdown to HTML conversion](/) produces in the browser without uploading anything. Google Docs is the pragmatic choice inside Workspace and the wrong choice for anything confidential. Whichever you pick, decide the return path first: the conversion out is a command, and the conversion back is a conversation with a person about who applies their edits and which file is the truth.

## FAQ

### How do I convert Markdown to Word without installing anything?

Upload the `.md` file to Google Docs — File, Open, Upload — then File, Download, Microsoft Word (.docx). It needs no install and no terminal, at the cost of the document passing through Google's servers and arriving with Google's styles rather than your organisation's. The alternative with no install is to convert to HTML in the browser and open the result in Word, which is quicker still and produces a file with no usable style set.

### What is the best Pandoc command for Markdown to Word?

`pandoc report.md --reference-doc=house.docx -o report.docx`, where `house.docx` is a reference document you have edited. Add `--toc` for a table of contents and `--highlight-style=NAME` if you care what code blocks look like. Without `--reference-doc` the command still works and gives you Pandoc's default appearance.

### How do I make Word use my company template?

Build a reference document from Pandoc's default with `pandoc -o custom-reference.docx --print-default-data-file reference.docx`, then restyle it in Word to match the template. Starting from Pandoc's file rather than the company template matters, because Pandoc's copy already defines every style the docx writer references — including `Source Code`, `Block Text` and `Image Caption`, which corporate templates almost never have.

### Why does my code block look like body text in the Word file?

Because the reference document has no `Source Code` paragraph style, so Word is rendering a reference to a style it cannot find. Add `Source Code` for fenced blocks and the `Verbatim Char` character style for inline code, both by exactly those names, and the formatting appears.

### Can I keep tracked changes when converting Word back to Markdown?

You can read them, not keep them. `pandoc --track-changes=all` wraps insertions, deletions and comments in spans with author and time attributes, which is enough to see who proposed what — but they arrive as annotations in the prose, and no Markdown tool can accept or reject them. Plan to apply the changes by hand.

### Why does my diff show the whole file changed after a round trip?

Because the converter's Markdown dialect is not yours: different line wrapping, different escaping, different heading style. Normalise both sides by running your own source through the same pipeline once and pinning the output flags — `--wrap=none --markdown-headings=atx`, for instance — so the only difference the diff shows is the reviewer's edits.

### Should I send Word or PDF for review?

PDF if they are reading, Word if they are editing. A PDF is smaller, looks the same everywhere and cannot fork into a second version of the document; a `.docx` exists so somebody can change it, and every cost in this article is the cost of that capability. Sending Word to somebody who only wanted to read it invites edits you then have to reconcile.
