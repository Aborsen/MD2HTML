---
title: "Markdown vs Word for Documentation: Which Format Should Own the Source"
description: Markdown or Word for documentation, decided by what the docs have to do - review, who can edit, history, page layout, search, publishing and signing
date: 2026-09-05
tag: Workflow
keywords: markdown vs word documentation, markdown vs docx, documentation format, docs as code, word or markdown for documentation, docx vs markdown, technical documentation format
---

Ask an organisation where its documentation lives and you usually get three answers at once: a folder of `.docx` files on a shared drive, a wiki nobody has edited since the last reorganisation, and a `docs/` directory in a repository that only engineers read. All three are partly current. None of them is the source of truth, and the reason is never that somebody picked the wrong file format on purpose. It is that nobody ever decided which format was allowed to be the original.

The argument then gets conducted as taste. Engineers say Word is a mess; the rest of the company says Markdown is a hazing ritual. Both sides are describing real experience and neither is describing the actual decision, which is not about preference at all. It is about what a specific document has to do — get reviewed, get changed by twelve people, get searched, get printed, get signed, get published, get audited in three years when somebody asks why a clause says thirty days.

This piece decides that per job. It is a different question from [Markdown against hand-written HTML](/blog/markdown-vs-html), which is about writing format against publishing format; here both candidates are writing formats, and the question is which one should be the original that everything else is generated from.

### TL;DR

Decide by the document's job, not by the team's taste. If the document changes often, is reviewed by more than a handful of people, has to be searched and edited in bulk, and ends up on a web page, Markdown in version control wins on nearly every axis. If it has to be printed to a template, signed, filed with somebody who specifies a layout, or read line by line by a person whose whole job is contracts, Word wins and no amount of tooling changes that. Most organisations need both — and the only arrangement that survives is one format as the source and the other as a generated export, never both as sources.

## What a .docx is, what a .md file is, and what that produces downstream

A `.docx` is a zip archive. Rename it and unzip it and you get a directory of XML parts: one holding the text of the document, another holding the named styles, another holding the list definitions that make numbered lists renumber themselves, and a relationships part that maps internal identifiers to images, hyperlinks, headers and footers. The format is documented and standardised — it is Office Open XML, published as ECMA-376, and all four parts of the specification can be downloaded for nothing (checked on ecma-international.org, 9 September 2026) — which matters for longevity, but none of it is meant to be read by a person. Open the archive's main part in a text editor and you get several thousand characters of markup before the first sentence of your document. The [anatomy of that archive and what each part decides](/blog/convert-docx-to-markdown) is worth reading if you ever have to convert one.

A `.md` file is text. It is the sentences you wrote, in UTF-8, with a small set of conventions layered on top: hashes for headings, asterisks for emphasis, hyphens for list items, pipes for tables, backticks for code. There is no container, no separate style part, no relationship table. The structure is encoded as characters at the start of lines, which means the structure is visible to anything that can read a line of text.

That single difference produces almost everything else on this page:

- **What a diff can show.** A change to a text file is a change to a line. A change to a zip archive is a change to a binary blob, so the tools that compare versions have nothing to work with except the whole file.
- **What tooling can touch it.** Anything can read a text file — grep, a linter, a build script, a spell checker, an editor on a phone. Reading a `.docx` needs a library that understands the format, and writing one back safely needs more than that.
- **What the format can express.** Word can store a comment anchored to a character range, a numbering scheme that renumbers when you insert an item, a header that repeats on every page and a table of contents that updates itself. Markdown stores none of those, because it stores nothing but the text.
- **Whether the bytes describe themselves.** A Markdown file read with no software at all still shows headings as headings. A `.docx` read with no software shows XML.
- **Who has to be trusted with it.** A text file can be edited safely by somebody with no training, because there are very few ways to break the parse. A Word document can be broken in ways that are invisible until it is printed.

The archive is not a design flaw. It is the price of the things it can do, and those things are real. The mistake is assuming the price is worth paying for every document, and the opposite mistake is assuming it is never worth paying.

## Markdown vs Word documentation: the cheat sheet

One table, read across. The last column is the honest verdict rather than a winner, because several of these rows genuinely go the other way.

| Dimension | Markdown in version control | Word (.docx) | Who wins, and when |
| --- | --- | --- | --- |
| Reviewing a change | Line diff: changed words appear as changed words | Tracked changes: each edit attributed, accepted or rejected individually | Markdown for many small changes; Word when each sentence needs a decision |
| Commenting on one sentence | Review comment on a line, in a pull request | Comment anchored to a character range, with a reply thread | Word, clearly, for non-technical reviewers |
| Two people editing at once | Branch and merge, conflicts flagged by line | Co-authoring in the cloud, or emailed copies merged by hand | Markdown for a set of files; cloud Word for one file, one hour |
| Who can edit without training | Anyone who can type, once they are past the workflow | Anyone who has used a computer | Word, and pretending otherwise is how docs go stale |
| History | Every change, with a message, an author and a reason | Snapshots by time and author, on the platform that stores the file | Markdown: the unit is a change, not a copy |
| Why a sentence says what it says | Blame the line, read the commit, read the pull request | Read the version list and guess | Markdown, and it is not close |
| Search across the whole set | Exact and regular-expression search, in a second, from anywhere | Platform search that finds documents rather than lines | Markdown |
| Changing one phrase in 200 files | One command, one diff, one review | Open 200 files, or write a script against the XML | Markdown |
| Page layout, headers, footers, page breaks | Not expressible | Native, and the reason the format exists | Word |
| House template and named styles | Lives in the converter or the site theme | Lives in the document, applied by the person writing | Word for a one-off; Markdown for consistency across hundreds |
| Automatic numbering and cross-references | Not in the format; some generators add anchors | Fields that renumber and re-point themselves | Word |
| Printing and signing | Needs a conversion step to PDF | The document is already paginated | Word |
| Publishing to a web page | One conversion, or a generator | Save-as-web-page markup, or a conversion through Markdown anyway | Markdown |
| Code samples | Fenced blocks, language tagged, never autocorrected | Autocorrect will change your quotes and hyphens | Markdown, and this is a correctness issue |
| Accessibility | Semantic by construction, audited once in the theme | Rich attributes available, audited per document | Draw: Markdown is cheaper, Word is more capable |
| Longevity of the bytes | Text: readable with no software | Standardised and widely readable, but needs an application | Markdown |
| Lock-in | None worth naming | Not the format; the template, the macros and the habits | Markdown |
| Images | Referenced as separate files, which can go missing | Carried inside the archive, which cannot | Word for a single travelling file |
| Tooling cost | A host, a review habit, a build step somebody owns | Already installed on every desk | Word for a small team with no engineers |

The pattern is consistent enough to state plainly: Markdown wins every row about change, scale and time, and Word wins every row about pages, review comments and the least technical person in the building. Any decision that ignores either half of that is going to be reversed later by whoever inherits it.

## Review, history, and who can edit it

These three arguments settle more real cases than anything about syntax, and the first of them is routinely argued unfairly by both sides.

### A diff and tracked changes are not the same tool

A diff shows you the difference between two states. Tracked changes show you the acts of changing: this person struck out that clause, this person inserted those five words, and each one can be accepted or rejected on its own. Those are different products, and the arguments people have about them are usually two people describing different jobs.

For a lawyer reading a contract, tracked changes with margin comments is the better instrument, and it is not close. The unit of work is the individual proposal — who suggested this wording, what did they say about it in the margin, do I accept it or counter it — and Word models exactly that. A pull request models something else: a coherent set of changes, proposed together, accepted or rejected together. You can approve a diff line by line in most review tools, but you cannot hand somebody a document with fourteen independent proposals in it and let them take nine.

For twelve people editing a staff handbook, tracked changes is the worse instrument, and that is not close either. Twelve reviewers produce twelve copies. Somebody merges them by hand, which means somebody reads the same paragraph twelve times and decides which of four rewordings to keep, with no record afterwards of what was rejected or why. The file called `handbook_final_v3_JS_comments_updated.docx` is not a joke about naming; it is the visible symptom of a format with no merge operation. Cloud co-authoring removes the copies, which is a genuine improvement, but it removes the record along with them: everyone edits the live document, and the history becomes a list of times rather than a list of decisions.

| Review model | Unit of review | Attribution | Concurrency | Record afterwards |
| --- | --- | --- | --- | --- |
| Tracked changes in emailed files | One insertion or deletion | Per change, by author | One person at a time per copy | Whatever the merger remembered |
| Tracked changes in a co-authored cloud file | One insertion or deletion | Per change, while it is pending | Many people at once | Timed snapshots of the document |
| Pull request on Markdown | A set of related changes | Per commit and per comment | Many people, on branches | Permanent: diff, discussion, decision |
| Comments only, no edits | A suggestion in prose | Per comment | Many people at once | The comment thread, until it is resolved |

The practical read: tracked changes is better at negotiating a document and worse at maintaining one. Documentation is maintained, which is why the format that is bad at negotiation keeps winning for docs, and why contracts keep living in Word no matter how the engineering team feels about it.

### Blame, and why a sentence says what it says

This is the argument that converts sceptics, and it never appears on a feature comparison because Word has nothing to put in the column.

A documentation set that has been alive for a few years contains sentences nobody can explain. "Access tokens expire after thirty days." Why thirty? Was it a decision, a compromise with the security team, or a typo somebody has since built a client library around? In a repository, you ask the file: blame the line, get the commit, read the commit message, follow it to the pull request, read the argument that happened there and the issue that prompted it. That chain takes about ninety seconds and it either produces the reason or proves there never was one, which is itself useful.

In a Word estate the same question is unanswerable in practice. The storage platform's version history gives you snapshots by author and timestamp — real history, and better than nothing — but the unit is the document, not the sentence. You can find that Priya saved a new version on a Tuesday in March. You cannot find which of the forty changes in that save was the thirty days, or what she was responding to. So the sentence stays, because nobody can justify removing something they cannot explain, and documentation accumulates claims that no longer match the system.

The consequence is worth stating with a cost attached: in Word, the provenance of a sentence has to live in somebody's memory or in a separate change log that a human maintains, and both of those leave the organisation when the person does.

### Who can edit it, and the sentence that ends the conversation

"Just raise a pull request against the docs." Said to a colleague in sales who has spotted that the pricing page describes a plan that was retired in spring, that sentence ends the conversation. They will not raise a pull request. They will send a message, or they will do nothing, and the page will still be wrong in six months.

This is a real constraint, not a training problem, and treating it as a training problem is the single most common way a docs-as-code programme fails. The workflow around Markdown — a host, a fork or a branch, a commit message, a review, a merge, a deploy — is five concepts that have nothing to do with writing a sentence. Word's floor is genuinely lower: open the file, change the words, save. Anybody who has used a computer clears that bar.

There are three honest responses, and the wrong one is to insist people learn.

- **Use the code host's own web editor.** Editing a file in a browser, with a preview, and letting the host create the branch and the pull request behind the scenes turns five concepts into two: change the words, write one line about why. This works, it is what most successful arrangements actually use, and it still requires an account and one walkthrough.
- **Put an editing surface on top.** A content system that writes Markdown back to the repository gives non-technical editors a normal editing experience and keeps the source in version control. It is more moving parts to own, and somebody has to own them.
- **Accept the edit as a message, and cost it.** Somebody technical makes the change. This is fine for occasional corrections and terrible as a standing arrangement, because the queue becomes a bottleneck and the bottleneck becomes staleness.

Whichever you pick, the decision belongs to the least technical person who has to change a sentence at short notice — the same principle that makes a repository the right home for docs that engineers maintain also makes it the wrong home for docs that only the finance team touches. [What actually belongs in the repository, and how the directory is arranged](/blog/documentation-that-lives-in-the-repo) is the longer version of that argument.

## What Word can express and Markdown cannot

Markdown has about a dozen constructs. Word has a page model. The gap between them is not a matter of missing features that a converter might add later; it is the difference between a format that describes structure and a format that describes a printed artefact.

The things a `.docx` carries that have no Markdown equivalent at all:

- A template with named styles, so that "Heading 2" means one specific typeface, size, spacing and colour across every document in the organisation.
- Headers and footers, page numbers, a cover page, section breaks, changed margins and orientation part-way through, watermarks.
- A table of contents field that updates itself, captions that number themselves, and cross-references that re-point when you move a section.
- Page breaks and keep-with-next, which is to say control over what lands at the top of a page.
- Footnotes rendered at the foot of the page they belong to, rather than collected at the end of the document.
- Text boxes, floating shapes, tables with merged cells, and anything positioned relative to the page rather than the flow of text.
- The review layer itself: pending insertions and deletions, and comment threads anchored to ranges of characters.

The full inventory — item by item, with a verdict on which losses actually matter and which are habits worth dropping — is in [what not to keep from a .docx](/blog/what-not-to-keep-from-a-docx), and there is no point repeating it here. What matters for this decision is that none of those absences is a gap unless the document's job needs them. A runbook does not need a cover page. A staff handbook that gets printed and handed to new starters does. A statement of work with a signature block that must sit above a fixed footer needs the page model, permanently and non-negotiably.

The reverse list is shorter and gets left out of these comparisons entirely, so here it is. Markdown expresses several things a Word document handles badly:

- **Code, safely.** A fenced block tagged with a language survives copy and paste, and it does not get autocorrected. Word replaces as you type, and one of the documented options is named `"Straight quotes" with "smart quotes"` (checked on support.microsoft.com, 9 September 2026); the same mechanism turns typed hyphens into dashes. Either substitution inside a command sample means the reader who copies it gets an error. This is a correctness defect, not a formatting preference.
- **Links a machine can check.** Text links can be validated in a build, so a documentation set can fail its own checks when a link dies. Checking the hyperlink relationships inside two hundred archives is a project.
- **Diagrams as text.** A diagram written as fenced text lives in the diff, gets reviewed like prose, and does not require anybody to find the original drawing file. A shape group pasted into Word is an image with no source.
- **Front matter.** A machine-readable header carrying an owner, a review date and a status, which a build can read and act on. Word has document properties, and nobody fills them in.

## At scale: search, scripting, publishing, longevity, accessibility

Everything above is about one document. The dimensions below only appear once there are two hundred of them, which is exactly when a format decision becomes expensive to reverse.

### Search, and what "search" means in each case

Text search over a directory of Markdown files is exact, fast and available to anything: a regular expression, a case-sensitive phrase, a search restricted to headings, a search that lists file and line number. It runs on a laptop with no index and no service, and it runs in a build, which means a documentation set can answer questions about itself. Find every page that mentions a deprecated endpoint, and you get a list of lines you can act on.

Search across a Word estate is search across an index maintained by whatever stores the files. At its best it finds documents, not lines, and it ranks them by relevance rather than listing them exhaustively — which is the right design for finding a document and the wrong one for auditing a claim. It finds nothing inside a screenshot, and it will not tell you that the phrase appears in a footer on page eleven of six files.

### Scripting a change across two hundred files

A product gets renamed. A support address changes. A URL moves from one domain to another. In Markdown this is one command, a diff you read before committing, and a review by somebody who checks the edge cases — the ones inside code samples, the ones inside link text, the possessive form. The whole change is one reviewable unit and it either happened everywhere or it is visible in the diff that it did not.

In a Word estate the same change has three options: open every file, script against the XML parts, or write a macro. All three work. What actually happens is that somebody does the important twenty files, intends to finish, and does not — and the half that was not done is invisible, because there is no diff to look at and no failing check. Six months later the old product name is still in four proposals that get sent to customers. The cost of not being able to script a change is not the labour; it is that partial changes leave no trace.

### Publishing to a web page

From Markdown, publishing is the ordinary case: one conversion to a complete HTML page, or a generator if there is a set of pages that link to each other. The output is semantic markup that inherits its styling from a template, which means the whole set looks consistent because the styling was never in the documents.

From Word, publishing is a detour. The application's own save-as-web-page output carries a large amount of markup that exists to reproduce Word's rendering rather than to describe the document, and the result is difficult to restyle and unpleasant to maintain. The route that works is the indirect one: convert the `.docx` to Markdown, review what the conversion kept, then publish from the Markdown. If you are publishing from Word regularly, that detour is the argument for changing which format is the source.

### Longevity and lock-in

Markdown's longevity claim is the strongest one it has. The file is text; it reads correctly in any editor, on any operating system, with no software that has to still exist. In twenty years the headings will still be visibly headings.

Word's position is better than its reputation. The format is an open, standardised one — ECMA-376, equivalent to ISO/IEC 29500 (checked on ecma-international.org, 9 September 2026) — other applications read and write it, and files from a decade ago open today. It is not lock-in in the legal or technical sense. The lock-in is behavioural, and it is real: the corporate template, the macros somebody wrote, the review habits, the fact that every document assumes an application with a page model. That is what makes a Word estate expensive to leave, not the file format.

So the ranking for a document you want readable in twenty years is: Markdown first, `.docx` second, and any proprietary cloud document that exists only inside one vendor's editor a distant third. If longevity is a stated requirement, keep a Markdown source and an exported PDF, and treat the editable Word file as the disposable one.

### Accessibility

Word is more capable here than most engineers assume. Heading styles produce a real document outline that a screen reader navigates, images have an alt text field, tables can have a designated header row, and the application ships an accessibility checker whose published rules include alternative text on all non-text content and sufficient contrast between text and background (checked on support.microsoft.com, 9 September 2026). The catch is that all of it is per document and depends on the author using styles rather than making text big and bold — which is exactly the habit that also breaks conversion.

Markdown is semantic by construction. A heading is a heading with no way to fake it, alt text is part of the image syntax, and lists are lists. What Markdown cannot express is the rest of the accessibility surface: a language attribute, table scope, a caption tied to a table, ARIA where it is needed. Those come from the template or the theme that renders the Markdown, which is the important structural point — you audit a Markdown documentation set once, in its theme, and every page inherits the result. You audit a Word estate one document at a time, forever.

## Where Markdown loses, and what that costs

Markdown wins on almost every axis a technical team cares about, and it loses completely whenever the document's job is to be printed, signed, or reviewed by somebody who works in Word. That is worth saying plainly rather than arguing around, because the failures are predictable and each one has a cost you can put a number against.

**When the artefact is a printed page.** Anything handed to a person on paper has a layout, and a layout means pages, margins, headers and control over what falls where. Markdown cannot express any of it; a conversion to PDF gives you whatever the template decides. Cost: either you accept the template's pagination or you spend the time building a template that does what you want, which is a real project with an owner.

**When something has to be signed.** A statement of work, a contract, a policy acknowledgement. Signing workflows expect a paginated document with fixed positions, and the signed artefact is the record. Cost: none if you convert at the end, considerable if you tried to make Markdown the signed thing.

**When the reviewer works in Word and will not move.** A lawyer, a regulator, an auditor, a client's procurement team. They will return a file with tracked changes, and reading those changes back into a Markdown source is manual work no converter does well. Cost: one person's afternoon per review round, and the risk of a change being missed.

**When the document is designed.** A proposal, a brochure, a report with a client's brand on it. Cost: hours of workarounds, and eventually an admission that the document was always a design artefact.

**When non-technical reviewers need to comment.** Not edit — comment. Word's anchored comment threads are the right tool and there is no Markdown equivalent that a non-technical reviewer will use. Cost: comments arrive by email instead, unanchored, and get lost.

**When there are forms and fillable fields.** Nothing in Markdown does this. Cost: the wrong tool entirely.

**When nobody owns the pipeline.** Docs as code needs a repository, a review habit, a build and somebody who maintains all three. A small team with no engineers should not be asked to run one. Cost: the pipeline breaks, nobody fixes it, and the docs move back to the shared drive with an extra step of resentment attached.

**When the flavour drifts.** Markdown is a family of dialects. A table renders on your code host and comes out as pipe characters in your build, footnotes work in one parser and not the next. Cost: bugs that only appear in published output.

**When the tables are complicated.** Merged cells, nested tables, a cell containing a list. Markdown tables are simple grids. Cost: either the table gets simplified, which is often an improvement, or it becomes raw HTML in the middle of your prose.

## The hybrid most organisations end up with, and how to stop it rotting

Almost nobody runs one format. The end state is a hybrid, and the hybrid is fine — what rots is the version of it where two formats are both treated as originals. That is the arrangement where somebody fixes a typo in the Word copy on Tuesday, the Markdown source is regenerated on Wednesday, and Tuesday's fix disappears without anybody noticing for a year.

One rule prevents it: **one format is the source, the other is an export, and the export is never edited.** Everything else is implementation.

| Document | Source | Export | Who edits the source |
| --- | --- | --- | --- |
| API reference, runbooks, architecture notes | Markdown in the repository | HTML page, or a PDF for an audit | Engineers, in pull requests |
| Staff handbook, policies | Markdown in the repository | A `.docx` or PDF for printing and acknowledgement | HR, through the host's web editor |
| Contracts, statements of work | Word | PDF for signature; Markdown only if it has to be published | Legal, in tracked changes |
| Proposals and designed reports | Word, from the house template | PDF | Whoever owns the deal |
| Meeting notes, decision records | Markdown | None | Anybody |
| Regulatory filings and anything with a specified layout | Word | PDF | The person who owns the filing |

Three practices keep the arrangement honest, and all three are cheap:

1. **Stamp every export.** A generated file says so, on its first page: generated from this source, on this date, from this commit. Somebody who opens the export and wants to change a word then knows where to go. Without the stamp, the export is indistinguishable from an original and will be edited as one.
2. **Regenerate rather than repair.** When an export is wrong, the fix goes into the source and the export is rebuilt. If a fix ever goes into the export directly, you now have two sources and the clock has started.
3. **Name an owner per document type, not per document.** "All policies are Markdown, HR owns them" is a rule people can follow. "This one is Word because Priya prefers it" is how you get back to three answers about where the documentation lives.

### Migrating a Word estate to Markdown

Do not start by converting. Start by listing what you have and deciding, per document, whether it should exist at all — a conversion project that begins with a bulk convert produces two hundred Markdown files of which sixty are obsolete and forty were never documents, and nobody will ever triage them afterwards.

Then convert the ones that survive, in small batches, and read each result against the original. Headings that were made big and bold rather than styled arrive as paragraphs; numbered lists arrive as plain text when the numbering definitions do not resolve; images land as separate files or vanish; captions become ordinary sentences that no longer belong to anything. The conversion routes and the checklist for spotting exactly those failures are in [how to convert a .docx to Markdown](/blog/convert-docx-to-markdown), and for a single document with nothing to install, [TransformPipe's Word to Markdown conversion](/word-to-markdown) runs in the browser — signed out, the file is not uploaded anywhere, which matters when the document is a draft policy rather than a public README.

Two rules for the migration itself. Leave the designed documents alone: a brochure converted to Markdown is a brochure destroyed, and the correct answer for it is to keep the Word file and stop pretending it is documentation. And keep the original `.docx` files somewhere read-only until the migration is old enough that nobody is asking what the conversion dropped.

### Going the other way, for a review round

The opposite direction is a routine, not a migration. A reviewer needs a Word file; the source stays in Markdown. Convert to `.docx` with a reference document so that the output arrives in the house template, send it, and read the returned tracked changes back into the Markdown by hand. That last step is manual and it does not get automated: the review layer lives in parts of the archive that converters either drop or flatten into ordinary text, so what you get back is either the document with all changes accepted or a mess. [Getting a .docx somebody can actually edit](/blog/markdown-to-word) covers the template mechanics.

Budget for the manual read-back and it is a couple of hours per round. Assume it will convert cleanly both ways and you will eventually publish a version with a reviewer's rejected wording still in it.

## How to decide

Six criteria, each with the consequence attached, in the order that settles the most cases first.

1. **Name the artefact the document has to become.** A web page, a page in a repository, a printed booklet, a signed PDF, a filing. If it is printed or signed, the source is Word and the argument is over; if it is a web page or a file people read as text, the source is Markdown and the same applies.
2. **Name the least technical person who must change a sentence at short notice.** If that person is in sales, HR or legal, either the format is Word or you owe them an editing surface they will actually use — and if you provide neither, the document goes stale between requests and the format decision was made by default.
3. **Count how often it changes, and by how many people.** Under a handful of edits a year by one owner, Word costs nothing. Weekly edits by a dozen people need merges, and Word has no merge operation, so the cost lands on whoever consolidates the copies.
4. **Ask whether you will ever have to change one phrase everywhere.** If the answer is yes — product names, endpoints, addresses, legal wording — Markdown is the only one of the two where the change is a reviewable unit rather than an act of diligence you have to trust.
5. **Ask whether anybody will need to know why a sentence says what it says.** For security controls, service commitments and anything an auditor reads, provenance is part of the document's job, and only version control records it at the level of the sentence.
6. **Decide who owns the pipeline before you build one.** A repository, a review habit and a build need a named owner; if you cannot name one, choose the format that needs no pipeline and revisit it when you can.

## Conclusion

Documentation should live in the format that matches what it has to do, and for most of the documentation a technical organisation maintains that format is Markdown in version control — because the things that keep documentation true are review, history, search and the ability to change a phrase everywhere at once, and those are the four things text in a repository is best at. Word remains the right answer, permanently and without apology, for documents whose job is to be laid out, printed, signed, or negotiated clause by clause with somebody whose tool is tracked changes. Run both, decide per document type which one is the source, generate the other, and stamp the generated file so nobody edits it by mistake — then the only remaining work is the conversion at the boundary, which is a one-step job in either direction and the only part of this that a tool can solve for you.

## FAQ

### Is Markdown better than Word for documentation?

For documentation that changes often, is maintained by several people and ends up on a web page, yes — because of review, history, search and bulk editing rather than anything about syntax. For a document that has to be printed to a template, signed, or reviewed clause by clause, Word is better and the difference is not close.

### Can non-technical colleagues really write documentation in Markdown?

The syntax is not the obstacle; most people learn hashes and hyphens in ten minutes. The obstacle is the workflow around it — branches, commits, reviews — so give them the code host's web editor with a preview, or a content system that writes Markdown back to the repository. Asking them to use a terminal is how a docs-as-code programme quietly fails.

### What happens to tracked changes and comments when I convert a Word document to Markdown?

They are the first thing lost. Pending insertions and deletions are either accepted silently or dropped, and comment threads have no Markdown equivalent at all, so they usually disappear without a warning. Resolve the review layer in Word before converting, and read anything you need to keep out by hand.

### How do I print a Markdown document or get a PDF from it?

Convert it to HTML and print that from a browser, which uses the page's own styles, or convert to `.docx` with a house template and print from there. Either way the pagination is decided by the template rather than the document, so if page layout matters, the template is the thing you have to build.

### Should we keep the original .docx after converting it?

Keep it read-only until the Markdown has been read, reviewed and used for a while. Conversions drop things quietly — captions, numbering, floating content — and the original is the only way to find out what went missing, which is a question somebody always asks about three months later.

### Does Word lock our documentation in?

Not at the format level: `.docx` is Office Open XML, a documented standard published as ECMA-376 and as ISO/IEC 29500, which several applications read and write. The lock-in is behavioural — the template, the macros, the review habits, and the assumption that every document has pages — and that is what makes an estate of Word documents expensive to move rather than the files themselves.

### Which format is better for accessibility?

Word can express more, including a language attribute, table header rows and an accessibility checker, but every document has to be authored correctly and audited individually. Markdown is semantic by construction and inherits the rest from its template, so you audit the theme once and every page benefits — which is usually the cheaper path to a set of documents that are all accessible rather than some.
