---
title: "What Not to Keep From a .docx: docx to Markdown Formatting Lost"
description: An inventory of what a Word file carries and Markdown cannot express, which losses matter, which are habits worth dropping, and what to do about captions
date: 2026-08-17
tag: Converting
keywords: docx to markdown formatting lost, word to markdown loses formatting, docx conversion loses styles, word captions markdown, word cross references markdown, tracked changes markdown, docx page breaks markdown
---

You convert a Word document to Markdown and something is missing. Sometimes it is the pull quote on page two. Sometimes it is the numbering. Sometimes it is nothing you can name, only a feeling that the document used to look like a document and now looks like a text file.

Both reactions are usually right, and they are about different things. A `.docx` carries hundreds of distinct pieces of information about how its words should appear. Markdown carries about a dozen pieces of information about what its words are. Converting between them is not compression; it is a change of subject. The interesting question is not how much was lost but which of the losses you should care about.

### TL;DR

Most of what a `.docx` loses on the way to Markdown is presentation, and presentation is the part you were going to override anyway: fonts, sizes, colours, margins, page breaks, columns, headers and footers all describe a printed page that no longer exists. Four losses are real and worth work: **tracked changes**, **comments**, **captions**, and **cross-references**, because each of them carries meaning that is not recoverable from the words alone. Text boxes are the loss people miss most often, because the text simply is not there and nothing warns you. Fix captions and cross-references by hand before conversion, keep the review layer with a tool that has a documented flag for it, and archive the original either way.

## What Markdown has, and why the list is so short

It helps to see the whole of the target format at once. Markdown, in the CommonMark specification, gives you: paragraphs, six levels of heading, emphasis, strong emphasis, ordered and unordered lists, block quotes, code spans, fenced and indented code blocks, thematic breaks, links, images, hard line breaks, and raw HTML. GitHub Flavored Markdown adds tables, task list items, strikethrough and autolinks. Footnotes are in neither specification; GitHub renders them and many parsers do not, which is [worth knowing before you rely on any extension](/blog/commonmark-gfm-and-the-flavours).

That is the entire vocabulary. There is no syntax for a typeface, a point size, a colour, a margin, a page, a column, a caption, a cross-reference, a comment, an insertion, a deletion, a text box, a tab stop or a table cell that spans two columns. Not "limited support" — no syntax at all. Any tool that appears to preserve one of those things is emitting raw HTML with a `style` attribute, which is a different document wearing a `.md` extension.

The reason the list is short is a design decision, not an oversight. Markdown describes structure: this is a heading, this is a list, this is a quotation. What a heading looks like is somebody else's problem, decided later, by a stylesheet or a renderer or a theme. Word describes both at once and lets you skip the structure entirely — you can make a heading by selecting a line, choosing 16pt bold, and pressing centre. Word will render it exactly as you asked. Nothing in the file records that it was a heading.

That single difference explains most of what people call formatting loss. A converter reads a `.docx` looking for structure. Where the document has structure, the conversion is clean and slightly boring. Where the document has appearance standing in for structure, the converter has nothing to read, and the appearance is dropped because there is nowhere for it to go. The document did not lose its headings. It never had any.

## The inventory, item by item, with a verdict

Everything a `.docx` can carry, what Markdown can express of it, and whether the loss deserves your attention. "Mourn" means the information is gone and cannot be reconstructed from the words. "Good riddance" means the document is better without it. "Do work" means it matters and there is something specific to do.

| What the Word file carries | Markdown equivalent | Verdict | What to do about it |
| --- | --- | --- | --- |
| Typeface and point size | None | Good riddance | Nothing. The renderer decides |
| Text colour and highlighting | None | Good riddance, unless colour carried meaning | Replace colour-coding with words before converting |
| Bold and italic | `**` and `*` | Survives | Nothing |
| Small caps, outline, shadow, character spacing | None | Good riddance | Nothing |
| Superscript and subscript | Raw HTML only | Minor loss | Accept `<sup>`/`<sub>` in the output, or rewrite |
| Strikethrough | `~~` in GFM only | Mostly survives | Check the flavour of your renderer |
| Page size, margins, orientation | None | Good riddance | Nothing. There are no pages |
| Page breaks | None | Good riddance | Delete leftover blank lines and stray markers |
| Section breaks | None | Good riddance | Nothing, unless headers changed per section |
| Multiple columns | None | Good riddance | Nothing. Reading order is now linear |
| Headers, footers, page numbers | None | Mourn one line of it | Move "Confidential", version or date into the body |
| Watermarks | None | Mourn if it said DRAFT | Put the status in the front matter or first line |
| Tab stops, leader dots, manual alignment | None | Good riddance | Convert dotted contents lists to real links |
| Line spacing, indents, space before and after | None | Good riddance | Nothing |
| Text boxes and pull quotes | None; text usually vanishes | Mourn, and check | Search the output for a phrase you know was in one |
| Shapes, SmartArt, charts, diagrams | None | Mourn | Export as images and reference them |
| Inline images | `![]()` reference only | Survives as a reference | Extract the files; check every path |
| Tracked changes | None | Mourn — this is the expensive one | Convert with a tool that keeps them, or keep the `.docx` |
| Comments | None | Mourn | Export the thread separately before converting |
| Footnotes and endnotes | Extension syntax only | Depends on the renderer | Test one footnoted document end to end |
| Captions | None | Do work | Rewrite as italic lines or HTML `<figcaption>` |
| Cross-references (`REF`, `PAGEREF`) | None; becomes stale text | Do work | Rewrite as anchor links before or after conversion |
| Table of contents field | None | Good riddance | Delete it; let the renderer build a new one |
| Index and index entries | None | Mourn, rarely | Accept the loss or keep a PDF |
| Bookmarks | Heading anchors, indirectly | Partial | Re-anchor anything you were linking to |
| Hyperlinks | `[]()` | Survives | Check relative and intra-document links |
| Numbered and bulleted lists | `1.` and `-` | Usually survives, sometimes collapses | Check `numbering.xml` exists in the archive |
| Simple tables | GFM tables | Survives | Count the columns |
| Merged cells, nested tables, block content in cells | None | Mourn | Reshape by hand or keep as HTML |
| Semantic styles: Heading 1-9, Quote, Caption | Headings, block quotes | Survives if used properly | Fix documents that fake headings with bold |
| Decorative styles: List Paragraph, Body Text, custom | None | Good riddance | Nothing |
| Equations (OMML) | None; sometimes garbled text | Mourn | Rewrite in TeX or export as images |
| Content controls and form fields | None | Mourn if it was a form | The document was an application, not a document |
| Embedded objects: spreadsheets, PDFs, other documents | None | Mourn | Extract and store them alongside |
| Document properties: author, title, company, revision | Front matter, if the tool writes it | Partial | Copy what matters into front matter yourself |
| Language and proofing metadata | None | Good riddance | Nothing |
| Fields that compute: `DATE`, `STYLEREF`, `SEQ` | Frozen cached text | Do work | Find and replace every one with real text |

## Presentation: fonts, sizes, colours, and styles with no meaning

This is the largest category by volume and the smallest by consequence. A `.docx` records, for every run of characters, a set of properties: font family, size in half-points, weight, colour as a hex value, highlight, spacing, kerning, whether it is small caps. Markdown records none of it, and neither does the HTML a good converter produces on the way through. The properties are simply read past.

For almost every document, that is the right outcome. The 11pt Calibri was Word's default, not a decision. The blue headings were the blue of whatever theme was applied in 2019. The one paragraph in Georgia is where somebody pasted from an email. None of it survives, none of it should, and the document reads better once a single stylesheet decides all of it consistently.

There is one exception, and it is worth taking seriously. Sometimes colour is the only place a meaning lives. A specification where red text means "not yet agreed". A price list where green means "confirmed". A translation draft where highlighted passages are the ones needing review. Convert that document and you get a flat list of items with no way to tell which were which, and the words themselves will not tell you, because the whole point of the colour was that the words did not have to.

The fix is not a converter setting. There is no syntax to convert the colour into. The fix is to spend twenty minutes in Word first, adding the word the colour was standing in for — "(unagreed)", "(confirmed)", "(needs review)" — and then convert. It is tedious and it is the only thing that works, and it is much easier before the conversion than after, because before the conversion you can still see which ones were red.

**Styles are the same problem with a different surface.** Word's style mechanism is genuinely good: a paragraph carries a `w:pStyle` naming its style, and the style definition lives in `word/styles.xml`. Converters read the style name and map it. Heading 1 becomes `#`, Heading 2 becomes `##`, Quote becomes a block quote. mammoth ships a default style map that does exactly this and lets you add your own mappings for house styles it cannot know about.

The trouble is that most Word documents do not use styles for structure. They use Normal for everything and reach for the toolbar. A document written that way converts into one long sequence of paragraphs, correctly, because that is what it is. The heading you can see on screen is a paragraph whose run properties happen to say bold and 16pt, and no converter will promote it, because promoting it would mean guessing — and the same document has bold 16pt somewhere in the middle of a sentence where somebody emphasised a product name.

Then there is the other half of the style list: List Paragraph, Body Text, Body Text Indent, No Spacing, plus whatever a template inherited from a template inherited from a firm's 2011 house style. These describe indentation and spacing. They have no semantic content, they map onto nothing, and dropping them is not a loss of any kind. If you converted a document and the output has no trace of "List Paragraph" in it, nothing went wrong.

## Page furniture and content that floats

Everything in this section describes a printed page. Markdown has no pages, and HTML rendered in a browser has no pages either until somebody prints it. So these losses are structural rather than accidental — there is nothing on the other side to receive them.

**Margins, page size, orientation and columns** live in a section properties element, `w:sectPr`, at the end of a section. It records the paper size, the four margins, the gutter, whether pages mirror, and the column layout. All of it goes. Notably, so does the reading order problem that columns create: a two-column layout in Word is one continuous story flowed into two boxes, and converting it produces the story in order. People expect this to break and it usually does not.

**Page breaks** are a run containing `<w:br w:type="page"/>`, or a paragraph property saying page-break-before. There is no Markdown for them because there is no page to break. Most converters drop them silently. If your output has an odd blank line or a stray marker where a chapter used to start, that is the residue. Delete it. If the document genuinely needs to break for print later, the place to say so is in the CSS of whatever renders it — `break-before: page` on a heading class — not in the Markdown.

**Headers, footers and page numbers** are separate parts in the archive: `word/header1.xml`, `word/footer1.xml` and their siblings, referenced from the section properties. Everything drops them, and normally that is correct, because "Page 3 of 12" is meaningless in a document with no pages.

One line of a footer is usually worth rescuing. A document whose footer read "Confidential — internal only — v4.2 — reviewed 12 March" has now been republished, in a format that is easy to share, with none of that on it. The classification, the version and the review date were only ever in the furniture. Before you convert, read the header and footer once, and put whatever matters into the front matter or the first line of the body, where a reader will actually meet it.

**Watermarks** are the same story in a more dramatic form. A DRAFT watermark is a shape in the header, drawn behind the text. It converts to nothing, so a draft becomes indistinguishable from a final document. Say "Draft" in words.

**Text boxes are the loss people find hardest to believe.** A text box is not part of the document's flow; it is a drawing object, and the text inside it sits in a `w:txbxContent` element attached to a shape. Depending on how it was created, that shape may be wrapped in an alternate-content block holding two versions of itself for different Word versions. Converters that walk the document body looking for paragraphs may never reach inside it. So the pull quote you can see on screen, the sidebar with the key definition in it, the coloured box holding the three-sentence summary somebody will ask about later — none of it appears in the output, and no error is raised, because from the converter's point of view nothing was skipped.

The only reliable check is to search. Pick a phrase from every boxed element in the original, one by one, and search for it in the converted file. If it is missing, retype it — as a block quote, a heading, or an ordinary paragraph in the place it belongs. And do that before you archive the `.docx`, because the search is easy while both files are open and impossible once you have only one.

**Shapes, SmartArt, charts and diagrams** go the same way and for the same reason, except that here the loss is unarguable: a process diagram is information, and Markdown has no way to hold it. Export each one as a PNG or an SVG from Word, put the files somewhere stable, and reference them. That turns a total loss into an image dependency, which is a much smaller problem — though not a free one, since [an image reference that works locally can still break when the file moves](/blog/images-and-links-that-still-work).

## The review layer: tracked changes and comments

This is the category where a careless conversion destroys something nobody can rebuild.

A reviewed `.docx` does not contain the final text. It contains both texts at once: insertions wrapped in `w:ins`, deletions wrapped in `w:del`, each carrying an author and a timestamp, and the deleted text preserved in full inside the deletion. That is what makes Word's review pane possible. It is also what makes a Word document a record of a negotiation rather than a statement of a position.

Markdown has nothing for this. There is no syntax for "this clause was inserted by the counterparty on Tuesday" and no syntax for "these eleven words were removed". A converter therefore has to choose, and most choose without telling you. The usual behaviour is to hand you the text as if all changes were accepted — which is one of three plausible answers, silently applied, to a question you were not asked. Somebody's deletions are now gone, and with them the fact that they were ever proposed.

Pandoc is the tool with a documented control here: `--track-changes` takes `accept`, `reject` or `all`, and only `all` keeps both versions in the output, wrapped in spans. mammoth's approach is different — it works from a style map, and the review markup is not something its defaults surface. The practical consequence is the same either way: if a document has been through review and you are not deliberately preserving the review, you are converting the outcome and discarding the argument.

**Comments are worse, because they have nowhere to attach.** A Word comment is anchored to a range of text with `w:commentRangeStart` and `w:commentRangeEnd` markers, and the comment text itself lives in `word/comments.xml` with an author, a date, and possibly a thread of replies. Markdown has no concept of a range annotation. Even if a converter wrote the comment text out, it could only put it near the text, not on it, and the anchoring is half the meaning: "this" in a comment refers to exactly the words it was attached to.

Pandoc's manual is explicit that `accept` and `reject` ignore comments, and only `all` includes them. mammoth can be made to emit comment references if you add a style mapping for them, which its documentation covers and almost nobody does. Everything else drops them and says nothing.

The honest advice is to stop treating this as a conversion problem. If the review thread matters — and on a contract, a specification or a paper it is often the most valuable thing in the file — get it out of Word on its own terms first. Word can print or export the document with comments, and a PDF of the marked-up version is a perfectly good archive. Then convert the clean text to Markdown for the future, and keep the marked-up copy for the past. Two files, each good at one job, is a better outcome than one file pretending to do both.

Footnotes sit at the edge of this category. They at least have a possible home: `word/footnotes.xml` holds them, and Pandoc's own Markdown dialect has footnote syntax to write them into. But footnotes are not in CommonMark, so a converter targeting strict CommonMark has to inline them, append them as ordinary paragraphs at the end, or drop them. Convert one footnoted document, scroll to the bottom, and look, before you assume the behaviour you want is the behaviour you have.

## Captions, cross-references and fields: the losses worth doing work over

These deserve their own section because they are the only losses in this article where a specific, repeatable piece of work reliably converts a bad outcome into a good one.

**A caption in Word is not a line of text under a picture.** It is a paragraph in the Caption style containing a `SEQ` field — something like `SEQ Figure \* ARABIC` — which Word computes to produce the number. That is why inserting a new figure halfway through a document renumbers everything after it. The number is not written down; it is derived from position.

Convert that document and two things happen. The Caption style has no Markdown equivalent, so the paragraph becomes an ordinary paragraph, visually indistinguishable from body text. And the field collapses to whatever number Word last calculated, frozen. You now have a document where "Figure 4" is a plain sentence sitting between two paragraphs, and it will still say 4 after you delete Figure 2.

There are two decent fixes and one bad one. The bad one is to leave them and hope. The first decent one is to accept that the caption is now prose and make it look deliberate: an italic line immediately after the image, with the numbering either removed entirely or renumbered by hand and never touched again. Removing the numbers is usually better, because a caption that says what the figure shows is more useful than one that says which figure it is, and it cannot go stale.

The second is to keep the semantics by dropping into HTML, which Markdown permits: a `<figure>` element wrapping the image with a `<figcaption>` inside it. That gives a renderer something real to style and a screen reader something real to announce. It costs you the readability of Markdown source at that spot, and it is the right trade for documents where figures are load-bearing — a paper, a manual, a report with twenty diagrams in it. Pandoc's Markdown has an `implicit_figures` extension that treats a paragraph containing only an image as a figure with the alt text as its caption, which is worth knowing if you are already converting through Pandoc, because it means writing the caption as alt text gets you the structure for free.

**Cross-references are the same mechanism pointed inward, and they fail more quietly.** "See section 4.2 on page 11" is, in the file, a `REF` field pointing at a bookmark and a `PAGEREF` field pointing at the same bookmark's page. Word recomputes both. Markdown has neither, and the bookmark itself has no equivalent either, so what you get is the cached text: a sentence that says "see section 4.2 on page 11", in a document with no sections numbered that way and no page 11.

This is worse than a missing caption because it is not visibly broken. It reads like a working cross-reference. A reader follows it, finds nothing, and concludes the document is wrong rather than converted.

The work is mechanical and worth doing. Search the converted file for "see", "above", "below", "page", "section", "figure", "table" and "appendix", and deal with every hit:

- A reference to a heading becomes a link to that heading's anchor. Markdown renderers generate anchors from heading text — usually lowercased with spaces replaced by hyphens, though the exact rule varies by renderer, so check one before you write fifty. `[the retention rules](#data-retention)` survives renumbering because it points at the words, not the number.
- A reference to a page number has to go. There is no page. Rewrite it as a reference to the section, or delete the clause.
- A reference to a figure or table follows whatever you decided about captions. If you dropped the numbers, the reference has to name the thing instead: "the deployment diagram" rather than "Figure 4".
- A reference to a numbered clause in a contract or standard stays as text, because the numbering is part of the content and not something the renderer computes.

**The table of contents needs no work at all, only deletion.** A Word TOC is a field, and what converts is the cached text: a list of headings with dot leaders and page numbers, sitting at the top of your document as ordinary paragraphs. It cannot update and it will drift within a week. Delete the whole thing. Every documentation renderer and most static site generators build a contents list from the headings, and it will always be correct because it is derived rather than remembered.

**The other computed fields deserve one pass each.** `DATE` becomes the date it was last refreshed, so a letter converted today may claim to be from whenever somebody last opened it in Word. `STYLEREF` fields, common in running headers, repeat a heading's text and freeze it. Automatic list numbering interacts with all of this. The general rule is simple: anything Word calculated is now a fossil of the last calculation, so read every number in the converted document once and ask where it came from.

## Where "convert it and fix it later" fails

The obvious approach is to run the conversion, look at the output, and repair what is wrong. It is the right approach for most documents and it fails in four specific ways that are worth knowing before you commit to it.

**You cannot repair what you cannot see is missing.** This is the text box problem generalised. Repair works when the output is visibly wrong: a table with the columns shifted, a heading at the wrong level, a broken image. It does not work when the output is silently incomplete, because there is no cue. Nothing in a converted file says "a sidebar used to be here". The only defence is a comparison against the original, and a comparison is only possible while you still have the original open — which means the check has to happen at conversion time, not later when somebody notices.

**The information you need to fix it is in the file you replaced.** Which items were red. What the footer said. Who proposed deleting the third clause and why. Where Figure 4 actually was before the numbering froze. All of that is in the `.docx`, none of it is in the Markdown, and the moment the `.docx` is gone the repair stops being possible and becomes a reconstruction. Keeping the original is not sentiment; it is the only copy of the answers.

**Fixing it later means fixing it in every copy.** A converted document is easy to move. Somebody pastes it into a wiki, commits it to a repository, sends it to a client. Two weeks later you notice the frozen cross-references. Now the repair is in four places, three of which you do not know about. Converting a hundred documents multiplies this by a hundred, which is the real argument for a proper checklist run once per document rather than a fix applied on discovery.

**Some of it costs more to fix than to redo.** A document with merged cells, nested tables and cells containing lists cannot be repaired into Markdown, because Markdown's table syntax has no spanning and no block content in cells; you can only reshape the data or keep it as an HTML table. [Tables are the most common thing to break in either direction](/blog/markdown-tables-that-survive-conversion) and the least amenable to patching after the fact. A document built entirely from text boxes and shapes — a brochure, a poster, a designed one-pager — is not a document with formatting to lose. It is a layout, and the words are incidental to it. Converting it produces a fragment of prose that nobody wants, and the honest answer is that the file should stay a PDF.

What this costs, added up: the time is not in the conversion, which takes seconds, and not in the obvious repairs, which take minutes. It is in the checking, which takes ten to twenty minutes for a document of any substance, and in keeping the original, which takes disk space and a naming convention. Teams that skip the checking do not find out immediately. They find out when somebody asks what the deleted paragraph said.

## What to decide before you convert

1. **Establish whether the document has structure or only appearance.** Open the styles pane and look. If the headings are real Heading styles, the conversion will be clean and your checking is quick; if everything is Normal with manual bold, the output will be a wall of paragraphs and no converter will save you, so the cheaper path is to apply real styles in Word first and then convert once.
2. **Read the header, the footer and any watermark before you touch anything.** Whatever they say — a classification, a version, a review date, the word DRAFT — exists nowhere else in the file and will be gone in one step, and a document republished without its own classification is a disclosure rather than a conversion.
3. **Find out whether the file has been reviewed.** Tracked changes and comments are the losses you cannot undo, so if the review matters, export a marked-up PDF first and convert the clean text second; if you skip this, you are choosing to discard the argument and keep only the outcome.
4. **Inventory the floating content by hand.** Count the text boxes, shapes, SmartArt and charts, write the count down, and check the same count against the output, because these are the only items that disappear with no trace at all and the check takes one minute per item.
5. **Decide the caption rule once, for all your documents.** Either captions become italic lines with no numbers, or they become `<figure>` and `<figcaption>` blocks; picking per document guarantees an inconsistent set of files and a second pass later.
6. **Sweep the cross-references before you publish, not after.** Every "see page 11" and "as shown in Figure 4" is now frozen text that reads as if it works, and once the file has been copied into a wiki and a repository you are fixing the same sentence in three places.
7. **Keep the `.docx`, and put it somewhere findable.** Every loss in this article is one-way, so the original is your only record of what the document used to know, and the cost of keeping it is a few hundred kilobytes against the cost of not keeping it, which is a question you cannot answer at all.

## Conclusion

Most of what a `.docx` loses on the way to Markdown was never worth keeping: the typeface, the point size, the margins, the page breaks, the columns, the leader dots and the two dozen paragraph styles that only ever described spacing. Dropping them is the point of the exercise, because a document that describes its own structure can be styled consistently, searched, diffed and reviewed in a way that a document describing its own appearance cannot. The four things worth work are the review layer, the captions, the cross-references and whatever is sitting in a text box, and all four are easier to handle before the conversion than after. [The step-by-step route and its checklist](/blog/convert-docx-to-markdown) covers how to run the conversion itself, and [the comparison of the tools that do it](/blog/best-word-to-markdown-converters) covers which one to use; for a single file you would rather not upload, [TransformPipe's Word to Markdown conversion](/word-to-markdown) runs in the browser, free, with the `.docx` never leaving your machine when you are signed out. Whichever route you take, archive the original, because the fonts, the footers, the comments and the pull quote you did not notice are not coming back.

## FAQ

### Why does my Word document lose all its formatting when I convert it to Markdown?

Because Markdown has no syntax for most of it. There is no way to express a typeface, a point size, a colour, a margin or a page break in Markdown, so a converter reads past all of them. What survives is structure — headings, lists, links, tables, emphasis — and only where the document recorded it as structure rather than as appearance.

### Why did my headings come out as ordinary paragraphs?

Almost certainly because they were never headings. If a heading was made by selecting a line and applying bold and a larger size, the file records run properties, not a heading, and a converter has nothing to promote. Apply real Heading styles in Word and convert again; the difference is immediate.

### What happens to captions when I convert a .docx to Markdown?

The Caption style has no Markdown equivalent, so the caption becomes a plain paragraph, and the `SEQ` field that produced its number collapses to the last value Word computed. Either rewrite captions as italic lines without numbers, which cannot go stale, or use HTML `<figure>` and `<figcaption>` where figures matter.

### Can cross-references survive a Word to Markdown conversion?

Not as cross-references. A `REF` or `PAGEREF` field becomes the text Word last calculated, so "see section 4.2 on page 11" arrives looking correct and pointing at nothing. Rewrite each one as a Markdown link to the target heading's anchor, and delete anything that refers to a page number.

### Where did my text boxes go?

Probably nowhere — the text was never extracted. A text box is a drawing object rather than part of the document flow, and many converters do not reach inside it, without raising any error. Search the converted file for a phrase you know was in each box, and retype whatever is missing while you still have the original open.

### Should I keep the original .docx after converting?

Yes, always. Every loss described here is one-way, and the original is the only remaining record of what the footer said, which items were highlighted, who proposed which deletion, and what was in the sidebar. It costs a few hundred kilobytes and answers questions the Markdown cannot.

### Is it worth converting a designed document like a brochure at all?

Usually not. A brochure or poster is a layout in which the words are placed rather than a document in which they flow, and converting it produces disconnected fragments of prose with the design gone. If the artefact is the design, keep it as a PDF and write the Markdown version from scratch when you need one.
