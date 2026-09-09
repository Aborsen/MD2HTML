---
title: Your AI assistant writes Markdown. Your colleagues do not read it.
description: Why chat assistants answer in Markdown, what survives the paste into email, Slack, Word, Notion or a ticket, and the duller route that holds: save, convert, send
date: 2026-09-09
tag: Workflow
keywords: chatgpt markdown, chatgpt output to html, claude markdown export, llm markdown output, ai generated documentation, copy markdown from chat, paste markdown into word, ai output asterisks, markdown dollar signs latex
---

The answer in the chat window looks like a document. Headings, a short table, a numbered list, bold in the right places. You copy it into an email and get a wall of asterisks and hash signs. Or you get half a document: the headings came out, the table arrived as a row of pipes, and your reader has to guess which characters were meant literally.

Nothing went wrong. The assistant wrote Markdown, because that is what these tools write.

The gap is not a matter of taste. What is on your screen and what is in your clipboard are two different documents, and every place you paste into makes its own guess about which one it received. Some destinations guess well. Most guess differently from each other, which is why the same answer looks fine in one window and broken in the next.

### TL;DR

Chat assistants answer in Markdown because it is the cheapest way to mark a heading inside a stream of plain text, and the chat window renders that source back at you. The clipboard gets the source. Email, Slack, Word, Google Docs, Notion, trackers and content systems each interpret it differently, so tables, fenced code, nested lists, footnote markers and anything mathematical break in a different place in each one. The route that survives is dull: save the answer as a `.md` file, read it against a checklist before your name goes on it, convert it once into a self-contained HTML page, and send the page instead of the paste.

## Why the answer arrives as Markdown

A model emits text one piece at a time. To mark a heading it has to use characters in the same stream as the words, and Markdown is the cheapest way to do that: plain text, a few punctuation marks, no format to negotiate. The chat interface renders it back at your end. That rendering is the illusion — what you hold is the source.

This is not a quirk of one product. ChatGPT, Claude, Gemini and Copilot all answer this way, and so do the assistants inside editors and trackers. Asking for plain text sometimes works, but then you are negotiating with a model instead of converting a file.

## What copying it out actually does

Most chat windows hold two copies of the answer. The copy button hands you the source, asterisks and all. A mouse selection hands you the rendered version as rich text, which the destination then reinterprets. Neither is reliable, and they fail in different places.

| Where you paste it | Copy button (source) | Mouse selection (rich text) |
| --- | --- | --- |
| Plain-text email | Every hash, asterisk and pipe | Flattened back to plain text |
| Word or Google Docs | Raw syntax, nothing rendered | Headings, bold and usually tables survive; fenced code loses its block |
| Slack or Teams | Some syntax renders, some stays literal | Varies by client; lists and code fences suffer most |
| A wiki that speaks Markdown | Close to right, if its flavour matches | Rich text, so the Markdown is gone |

The half-rendered case is the expensive one. A reader who sees clean headings above a mess of pipes assumes you sent it carelessly, not that two tools disagreed about tables. Tables are the reliable casualty either way, for [reasons worth knowing](/blog/markdown-tables-that-survive-conversion) if you paste them often.

What the copy button hands over is worth being precise about, because it is the same everywhere even though the interfaces are not: a string of Markdown text. Not a document, not a format with a name, not something a mail client could open — a run of characters in which `##` means heading only to a reader who already knows that. Nothing in the clipboard says so.

A mouse selection is different in kind. Browsers put two representations on the clipboard at once: a plain-text version and an HTML version of the same selection, and the receiving application picks whichever it prefers. Paste into a plain-text field and you get the flattened text. Paste into a rich-text field and you get the chat window's own markup — its `<h2>` tags, its list structure, and sometimes its CSS classes and colours, which is why pasted answers occasionally arrive in a font nobody chose. Neither route is a bug, and neither can be fixed at the destination.

### Where it lands, destination by destination

This is the cheat sheet. It describes what happens to the Markdown text from the copy button, because that is the copy people take, and the last column is what to do instead. Behaviour drifts between clients and releases, so read the table as the shape of the problem rather than as a guarantee about the version in front of you.

| Destination | What survives the paste | What does not | What to do instead |
| --- | --- | --- | --- |
| Plain-text email | Nothing is interpreted; the text is displayed exactly as typed | Every heading, every list marker, every table row reads as punctuation | Attach or link a converted page |
| HTML email | Line breaks and paragraphs, roughly | Headings, bold, tables, code — all literal syntax | Send a link, or a self-contained `.html` attachment |
| Slack | Inline bold, italic and inline code, once the composer has parsed them | Headings and tables have no equivalent in a message at all | Link the page; post a two-line summary above it |
| Word | Paragraphs, and whatever autocorrect decides to change | Headings stay as hashes; fences stay as backticks; tables stay as pipes | Convert, or paste a rich-text selection and repair it |
| Google Docs | Paragraphs, and behaviour that depends on a document setting | The same set, unless the setting says otherwise | Test the setting once, or convert and link |
| Notion | Most of it: Notion reads pasted Markdown as Markdown | Deep nesting, and anything Notion has no block for | Paste it, then check lists and code blocks |
| A ticket or issue | Everything, if the tracker's comment box speaks Markdown | Everything, if it speaks its own markup instead | Find out which camp your tracker is in, once |
| A CMS | Paragraphs, as paragraphs | Structure, unless the editor imports Markdown deliberately | Import as Markdown if offered; otherwise convert |
| A wiki that speaks Markdown | Close to all of it, if the flavour matches | Extensions the wiki never implemented | Paste and read the result before publishing |

### Email

Email is two products wearing one name. A plain-text message has no parser at all, so the hashes and asterisks are shown to the reader as characters, which is the wall-of-punctuation result everybody has seen. A rich-text or HTML message has a parser, but it is an HTML parser, and Markdown is not HTML. It sees a paragraph beginning with two hash marks and renders a paragraph beginning with two hash marks.

The mouse-selection route does better here and introduces its own problem: the pasted block arrives carrying the chat application's styling, so your message has two typefaces in it and the quoted reply chain below it has a third. Long term, the fix is not to paste at all. Email a link or a single self-contained file, and let the document be a document.

### Slack and Teams

A message composer is not a document editor, and it does not pretend to be. There is inline emphasis and inline code, and that is close to the whole vocabulary. There is no heading, so `## Findings` is the literal text "## Findings". There is no table, so a table becomes a stack of pipe-separated lines that wrap at the window edge and lose their column alignment on the first narrow screen.

This is the destination where people most often decide the answer is fine because it looked fine in the composer, and it is the destination where the reader's client is most likely to differ from the sender's. The safe shape for chat is a short summary in the message and a link to the document underneath it. Two lines of prose beat a mangled table, and they survive being read on a phone.

### Word

Word does two unhelpful things at once. It takes the Markdown text literally, and then it edits it. Autocorrect turns straight quotes into curly ones, turns a double hyphen into a dash, capitalises after what it takes to be a full stop, and converts a line starting with a hyphen into a Word list with Word's own numbering. Each of those is reasonable on its own and collectively they mean the text you paste is not the text you copied.

For code this is fatal rather than untidy: a command with a curly quote in it does not run, and the person who tries it gets an error that has nothing to do with the command. If somebody genuinely needs a Word file at the end of this, that is a conversion job rather than a paste job, and the tools that do it properly are the document converters rather than the clipboard.

### Google Docs

Docs behaves much as Word does, with one extra variable: there is a document-level preference that governs how Markdown syntax is treated, and the same paste therefore behaves differently in two documents belonging to the same person. That is worse than a consistent failure, because it teaches you a rule in one document that is false in the next.

Check the setting once on a scratch document, paste a representative answer with a table and a code block in it, and write down what happened. Then either rely on it or ignore it deliberately. What you should not do is assume the behaviour you saw last month is the behaviour you will get today.

### Notion

Notion is the outlier, and the good one: pasted Markdown is generally read as Markdown and converted into blocks, so headings become headings and a table becomes a table. If the destination is Notion, the paste is often the right answer and the rest of this article is unnecessary.

Two things still need a look. Notion is block-based rather than text-based, so nesting deeper than its own structure allows gets flattened, and a fenced block's language hint may or may not survive as the block's language. Paste it, then read the code blocks and the deepest list, which are the two places the conversion loses information.

### A ticket

Trackers divide into two camps and the division is not obvious from the outside. One camp treats the comment box as Markdown, in which case the paste is close to correct and only the extensions your text uses will fail. The other camp has its own markup language that predates Markdown's dominance, and in that camp your asterisks and hashes mean nothing, or worse, mean something else.

Find out which camp yours is in once, with a test comment on a ticket nobody is watching. Include a table, a fenced block and a nested list, because those are the three that separate the camps. After that you will know whether pasting a model's answer into a ticket is a two-second job or a ten-minute rewrite.

### A CMS

A content system is where a bad paste does the most public damage, because the failure is published rather than sent. Block editors usually make one paragraph per line and leave the syntax visible, which is at least obvious. The worse case is an editor that half-parses: some inline emphasis is converted, the headings are not, and the article goes live with three hash marks above the second section.

Most systems that publish Markdown have an import route that is separate from the paste route, and it is nearly always better. If yours does not, convert to HTML and paste the HTML into the editor's source view, where the structure is explicit and you can see exactly what will render.

## What breaks, construct by construct

The destination decides how a failure looks. The construct decides whether there will be one. These are the eight that break, in rough order of how often they appear in a chat answer. Each gets a short section below, except mathematics, which has enough going on to need a section of its own after them.

| Construct | What the model wrote | What arrives | Why |
| --- | --- | --- | --- |
| Table | Pipe-separated rows | Rows of pipes, or a stack of unaligned lines | Tables are a GFM extension, not core Markdown |
| Fenced code | Three backticks and a language hint | Backticks as text, indentation collapsed, quotes curled | The destination has no block-level code style to map onto |
| Nested list | Indented `-` and `1.` items | One flat list, or literal markers | Indentation is meaningful in Markdown and decorative in rich text |
| Emphasis mid-word | `my_variable_name` | *my variable name*, italicised in the middle | Older parsers emphasise on underscores inside words |
| Maths | `$x^2$` | Two dollar signs and a caret | Maths is in no Markdown specification |
| Footnote marker | `[^1]` and its definition | Literal brackets, twice | Footnotes are in neither CommonMark nor GFM core |
| Citation marker | `[3]` or `[source]` | Literal brackets with nothing behind them | The reference definition was never emitted |
| Emoji and smart quotes | Codepoints, curly quotes, dashes | Boxes, or characters that break commands | Font coverage and autocorrect, not Markdown at all |

### Tables

A Markdown table is a header row, a separator row of dashes and colons, and body rows, all held together by pipes. It is not part of the original specification and it is not part of CommonMark; it arrived with GitHub Flavored Markdown, which means a parser can be entirely correct and still render your table as a paragraph full of pipe characters.

The cost is worse than a missing table, because the fallback is not blank. It is your data, unaligned, in reading order, with punctuation between the cells. Readers try to parse it and get it wrong, and columns with empty cells silently shift meaning by one. If the answer has a table in it, no paste will hold it everywhere, and the conversion step stops being optional.

### Fenced code

A fenced block is three backticks, an optional language hint, the code, and three backticks again. Three separate things happen to it on the way out. The fence characters become visible text. The leading indentation is normalised by the destination's paragraph rules, so Python stops being valid. And autocorrect gets to the quotation marks, so even code that kept its shape may no longer run.

The last of those is the one that costs somebody an afternoon, because the code looks right. A curly quotation mark and a straight one are indistinguishable at a glance in a proportional font, and the error message names a syntax problem rather than a character problem. If you are sending code, send a page or a file, never a paste.

### Nested lists

Markdown builds nesting from indentation, and the number of spaces matters. A rich-text destination has no concept of "two spaces of indent means a child item" — it has list levels, and it re-derives them from whatever structure it thinks it received. A three-level plan often arrives as one flat list with the hierarchy gone, which is a change of meaning rather than a change of appearance.

The plain-text route fails more visibly and less dangerously: the markers stay as `-` and `1.` and the reader can see what was intended. The half-successful case is the trap again, and it is worth reading the deepest list in any answer before you send it anywhere.

### Emphasis inside a word

Models write `**Note:**` at the start of a line constantly, and that one is usually fine. The failure is the opposite case: text that was never meant to be emphasised and becomes so. Identifiers written in snake case are the classic — `my_variable_name` has two underscores around a word, and older parsers happily italicise the middle of it.

CommonMark tightened this with flanking rules, so `_` inside a word no longer opens emphasis in a compliant parser. Not every destination is compliant, and the ones that half-parse a paste are the least likely to be. The symptom is a technical document in which some identifiers are silently missing characters, which is a difficult defect to spot and an expensive one to ship.

### Footnote and citation markers

Footnotes are in neither CommonMark nor GFM's core, so `[^1]` is an extension that a given renderer either implements or prints. When it prints, you get the marker in the body and the definition stranded at the bottom, both in brackets, and the link between them exists only in the reader's head. [What each implementation actually does with footnotes](/blog/markdown-footnotes-support) is worth knowing before you rely on one.

Citation markers are a different problem with the same appearance. A model asked for sources will often emit `[1]`, `[2]`, `[source]` inline without ever emitting the reference definitions those brackets need. That is not a conversion failure — it is an incomplete document, and it renders as literal brackets in every tool including the ones that support footnotes properly. Check that every bracket has something behind it before you decide the converter is at fault.

### Emoji

Emoji arrive as real characters, so they survive the clipboard intact. What they do not survive is the destination's font. A machine without the glyph shows a box, an older mail client may show a question mark, and a monochrome font renders a bullet where the writer intended a status. Converting to HTML does not fix this: a self-contained file can carry its styles, but it cannot carry the reader's system emoji font.

Where the character is decoration, this costs nothing. Where it carries meaning — a tick against one row of a table and a cross against another — a box in place of the glyph loses the only information in the column. Replace those with words. "Yes" and "No" render in every font that has ever existed.

### Smart quotes and dashes

Models emit typographic characters: curly quotation marks, apostrophes, en dashes, ellipsis characters. In prose these are correct and slightly nicer than the alternatives. In anything a machine will read they are a defect, and the two meet whenever an answer contains a shell command, a JSON snippet or a file path.

Autocorrect at the destination adds a second layer of the same problem, so text that left the model straight can arrive curled. The rule that keeps you out of trouble is simple: prose can have typographic characters, code cannot, and the only reliable way to keep them apart is to move the code through a converter that preserves a fenced block as a `<pre>` element rather than through a text field that thinks it is helping.

## Maths is its own problem

Nothing in Markdown defines mathematics. Not the original syntax, not CommonMark, not GFM. Dollar-delimited maths is a convention borrowed from TeX that individual renderers added on top, one at a time, with slightly different rules. That is the whole explanation for why `$x^2$` looks like an equation in the chat window and like two dollar signs and a caret everywhere else.

The chat window renders it because a maths library is loaded in the page next to the Markdown renderer. KaTeX, one of the common choices, describes itself as the fastest maths typesetting library for the web and is MIT licensed (checked on katex.org, 9 September 2026). GitHub renders it because GitHub added the feature deliberately: it accepts `$…$` and `$$…$$` as well as a `math` code fence, and its documentation says the rendering is done by MathJax (checked on docs.github.com, 9 September 2026).

A plain Markdown-to-HTML converter has no reason to know about any of that. Its job is to turn Markdown into HTML, and dollar signs are not Markdown. So it does the only correct thing available to it and passes them through as text. This is not a shortcoming to be worked around by finding a better general-purpose converter; it is a different job that needs a tool that does it.

There is a second-order trap in the same feature. In a renderer that *does* support dollar maths, an ordinary dollar sign in prose can open an expression that never closes, or worse, close one. A paragraph mentioning `$PATH` and a price in the same few lines can silently swallow everything between them. The same file therefore renders differently in the chat window, on GitHub and in your converter, and only one of those three is what you meant.

| If you need | Do this | What it costs |
| --- | --- | --- |
| One or two simple expressions | Ask for them in words, or in plain notation such as `x^2` | Nothing, and it reads fine in every destination |
| Real notation in a document | Convert with Pandoc, which has `--math-method=mathml` and `--math-method=katex` among its options (checked on pandoc.org, 9 September 2026) | An install and a command line |
| Real notation in a self-contained file | Pre-render the expressions to HTML with KaTeX in Node, then convert the result | A build step, and no maths library needed at the reader's end |
| Maths in a page that must not fetch anything | MathML, or images | MathML support varies; images do not reflow or scale with the text |
| To ship it today | Put the expressions in a fenced block and label them | Honest, ugly, and unambiguous — nobody mistakes it for a rendering failure |

The pragmatic answer for most business documents is the first row. If the maths is a formula the reader has to apply rather than a derivation they have to follow, plain notation in a code span communicates it perfectly and travels everywhere. Save the typesetting for documents where the notation is the point.

## Read it before your name goes on it

AI generated documentation is documentation. It goes out under your name, and the reader will hold you to it, not the model.

Do this before you convert, not after. A rendered page looks finished, and things that look finished get read as though somebody checked them.

- [ ] Every number: can you name where it came from?
- [ ] Every link: open it. Plausible URLs that lead nowhere are a common failure.
- [ ] Every quote, citation and product name: confirm it exists and is spelled correctly.
- [ ] Any code: run it, or say plainly that it is untested.
- [ ] The confident passages: the tone is identical whether the model knows or is guessing.
- [ ] Anything you pasted into the prompt: check none of it has been repeated back into the answer.

That list is the summary. The five checks below are the ones that actually go wrong, in the order they go wrong, and they are worth doing individually rather than as a single skim.

| What to check | How it reads when it is wrong | What it costs to skip |
| --- | --- | --- |
| Claims you cannot source | Confident, general, and unattributable | Somebody plans around it |
| Links | A plausible URL that goes nowhere | Your credibility, at the first click |
| Quotes attributed to people | A real name beside words they never said | A named person, misrepresented in writing |
| Numbers with no origin | A precise figure with no year and no source | A decision made on a fabricated number |
| Statements about a living company | A price, a feature, a limit, stated flatly | A public claim about somebody else's product |

### Claims you cannot source

The rule is not "is this plausible" — model output is uniformly plausible, which is exactly the problem. The rule is: can you say where it came from? If the answer is a document, a page or a person, keep it. If the answer is "it sounds right", either verify it or cut the sentence.

Pay attention to the confident middle of a paragraph rather than the ends. Openings and conclusions get read carefully because they carry the argument. The load-bearing invention is usually a subordinate clause halfway down, stated as background, that nobody thinks to question because it is not the point of the sentence.

### Links that do not resolve

Open every one. Not hover, open. A model that has learned what documentation URLs look like can produce a URL-shaped string for a page that has never existed, and the shape is convincing: the right domain, a plausible path, sometimes a plausible anchor.

Two failures hide here. The dead link is the obvious one and it fails loudly, which is the good case. The worse case is a live link to the wrong page — the right domain, a real document, and not the one that supports the claim beside it. Check that the page you land on says what the sentence says it says.

### Quotes attributed to people

Treat every quotation mark around a named person's words as a defect until proven otherwise. A misattributed quote is the single most damaging thing in this list, because it is a written statement about what an identifiable person said, it travels well, and it is trivially disprovable by the person concerned.

Find the original. If you cannot find the original, remove the quotation marks and the name together, and write the point in your own words. A paraphrase you can stand behind is worth more than a quote you cannot.

### Numbers with no origin

Every figure needs three things: a value, a unit and a date. Model output routinely supplies the first and drops the other two, and a percentage with no year attached is not information. Watch particularly for numbers that feel too round, and for numbers that feel too precise — both are patterns rather than measurements.

Where the number matters and you cannot source it, say so in the document. "Roughly a third, from the Q2 export, not independently checked" is useful to a reader. A bare "34%" that nobody can trace is worse than nothing, because it will be quoted onwards without the caveat you never wrote down.

### Anything about a living company

Prices, plan limits, feature availability, licence terms, whether a product still exists — all of these change, all of these are stated confidently, and all of these are claims about somebody else's business that go out with your name on them. A wrong price in a document that circulates internally becomes a wrong price in a budget.

The check is to open the vendor's own page and read it. Not a comparison site, not a summary, not what you remember from last year — the page the company publishes. If you keep the claim, keep the date beside it, so the next reader knows how old it is.

### Filler, and the shape models default to

Cut the filler too. Models pad: an opening that restates the question, a closing paragraph that summarises what the reader just read. Delete both.

The same instinct applies to structure. A three-point answer does not need three headings, a bulleted list and a summary table saying the same three things in three shapes. That layering is what makes short content look substantial, and stripping it back is usually the difference between a page that reads as considered and one that reads as generated.

## Save it, convert it, send the page

The route that holds up is dull and takes a minute.

**Save the answer as a file.** Press copy, paste into any text editor, save as `handover.md`. A .md file is plain text: nothing to install, nothing to go wrong. What you cannot do is send it — on a colleague's machine it opens in whatever program claims the extension, or in nothing at all.

**Convert it to HTML.** [Markdown to HTML conversion](/) does this in the browser: drop the file in and the work happens on your own machine. Signed out, the file never leaves it, which matters when the answer contains something internal. You get a preview, the exact HTML source, and a download — one self-contained .html file with inline styles, no scripts and no network requests. Several answers, several files: drop them all at once and they are chained into one document, in order, separated by a rule. A chat answer is a few kilobytes of text, so nothing here comes near the 10 MB conversion limit; that cap exists for scanned documents, not for prose.

**Send the page, not the file.** The .html opens by double-click on any machine. If an attachment is still the wrong shape, sign in and publish a read-only link instead: readable by anyone with the address, or only by the addresses you name. Revoke it and a link already sent stops working. [The four ways to send a document](/blog/share-a-markdown-document-as-a-link) covers which one suits which reader.

```bash
# with a key already remembered by `tp login`, publishing is one line
node cli/tp.mjs push handover.md --share link
```

The three steps take about a minute between them, and the minute buys something specific: one artefact with one address, rather than one paste per recipient and no way to correct any of them. When you find a mistake in a page, you fix the page. When you find a mistake in six pastes, you send six apologies.

### The privacy question nobody asks

There is a step in the middle of all this that people take without thinking about it, and it deserves a sentence of thought. Pasting a draft into an online converter is an upload. Most converters are server-side, which means the text leaves your machine, crosses the network, and is parsed on hardware you do not control, by a company whose retention policy you have not read.

The content makes it worse rather than better. The document you are converting is a chat answer, and a chat answer contains whatever you put in the prompt: the customer's name, the unreleased date, the salary band, the paragraph you pasted out of an internal document to have it summarised. That is precisely the class of text that should not be handed to an extra vendor as a by-product of formatting it.

The counter-argument is that the assistant already has the text, so what does one more copy matter. It matters because it is a different company, a different retention period, a different jurisdiction and a different breach surface, and because your organisation approved the first one and knows nothing about the second. One vendor is a decision. Two is an accident.

The check takes ten seconds and is not a matter of trust. Open the browser's network tab, convert a file, and watch. A converter that runs in the browser makes no request when you drop the file in — you can see the absence. A converter that uploads shows you the request, with the file in it. That is a fact about the tool rather than a claim in its marketing, and [the wider question of what an online converter does with your file](/blog/is-an-online-converter-safe) is worth reading once and then knowing forever.

Browser-side conversion is the reason transformpipe can say that nothing is uploaded when you are signed out: there is no upload to describe. Signing in changes that deliberately, because storing a document and publishing a link both require a server to hold it — which is a trade you make knowingly, per document, rather than by default.

### Skipping the copy altogether

The clipboard is the weak link in all of this, and it can be removed. An assistant with a connector to a conversion service does the whole sequence inside the conversation: it takes the text it just wrote, converts it, and gives you back a file or a link without any of it passing through a text field. Nothing gets a chance to autocorrect, because nothing was ever pasted.

The mechanism is an MCP server, or an API call, or a CLI invocation from whatever the assistant is allowed to run — the same conversion in each case, reached from a different direction. [Converting documents from inside an assistant](/blog/converting-documents-from-an-assistant) covers what each route can and cannot do. It is the right answer when this happens often enough to be a habit rather than an errand, and it does not change the review step above, which is still yours.

## Where a page that looks finished fails, and what that costs

Here is the uncomfortable part, and it is the reason the review section sits before the conversion section rather than after it.

Formatting is a credibility signal, and it is one readers apply without noticing. A wall of unformatted text gets read sceptically; the reader assumes it is a draft and treats the claims as provisional. The same content with headings, a table and consistent spacing gets read as a document — something that went through a process, that somebody checked, that has a level of care behind it. None of that is true of a converted chat answer, and the conversion is exactly what supplies the impression.

So model output is at its most dangerous when it is well formatted. Not when it is wrong — it is wrong at the same rate either way — but when the presentation borrows authority the content has not earned. The fabricated citation that would have been questioned in a rough paste gets forwarded twice in a styled page. This is a real cost of the workflow this article recommends, and the only thing that offsets it is the checklist above, done properly, every time.

Two habits help. Say what the document is: a line at the top reading "drafted with an assistant, figures checked against the Q2 export, links verified" costs nothing and travels with the file. And keep the source `.md` alongside the page, so the next person can see what changed between the model's answer and the thing you sent.

Converting is also not always worth it. Sometimes another tool wins outright.

If the recipient has to edit the text, send something editable: paste it into a document, accept that the code block will suffer, and let them work. If you need a real .docx, Pandoc converts between formats a browser converter does not touch, and [it is the better tool for that job](/blog/pandoc-alternatives-for-markdown-to-html).

If the answer is three sentences, type them into the message. A conversion step for a paragraph is ceremony.

If the content belongs in the team wiki, put it there. Notion, Confluence and most trackers accept Markdown on import or paste, each with its own quirks. A shared page is for documents with no home, not for content that already has one.

And if the answer will be wrong in a fortnight — a status, a set of numbers that move weekly — a page is the wrong container regardless of how well it converts. Documents outlive their accuracy, and a well-made page outlives it longer, because it keeps looking authoritative after it has stopped being true.

## How to choose what to send

1. **Start from what the reader will do with it.** Reading calls for a page, editing calls for an editable file, and approving calls for the numbers to be sourced before anything else happens. Choosing the format before you know the verb is how a document ends up in the wrong shape for everybody.
2. **Count the constructs before you count the words.** One table, one fenced block or one expression in dollar signs is enough to guarantee that some destination will mangle it, and at that point converting stops being a preference and becomes the only route that holds.
3. **Decide whether the text may leave your machine.** If it may not, the converter has to run in the browser or on hardware you control, and the shortest route — paste into the first tool a search returns — becomes the one you cannot take.
4. **Budget the review before the conversion.** Converting takes a minute; sourcing five numbers and opening nine links takes twenty. Booking only the minute is how unchecked output acquires a stylesheet and starts looking like work somebody did.
5. **Produce one artefact rather than one paste per person.** The recipient list grows after you send — somebody forwards it, somebody asks for it a week later — and a page can be handed on unchanged. Pastes cannot: each one is a separate copy that ages on its own.
6. **Test each destination once, then stop guessing.** Paste one representative answer — table, code fence, nested list — into the tool you use most, keep the result, and rely on it. The behaviour is stable per destination even though it differs wildly between them.

## Conclusion

The answer in the chat window is a rendering, and what you copy is the source that produced it. Every destination you paste into re-decides what that source means, which is why the same text is clean in one window and full of pipes and asterisks in the next, and why arguing with the assistant about formatting never fixes it. Next time an answer is worth keeping, save it as `.md` before you do anything else. Read it against the checklist, fix what the model guessed at, cut the padding, then convert it once and send the page — one file, one address, and the same document for everybody who opens it.

## FAQ

### Why does ChatGPT output show asterisks and hash signs when I paste it?

Because the assistant wrote Markdown and the chat window rendered it for display. The copy button gives you the underlying source, and a destination with no Markdown parser shows those characters exactly as they are. Nothing is broken; you are looking at the text that produced the formatting you saw.

### How do I paste an AI answer into Word without losing the table?

Select the rendered answer with the mouse rather than using the copy button, and the browser puts a rich-text version on the clipboard that Word will usually accept, tables included. Check the code blocks and the quotation marks afterwards, because Word's autocorrect edits what you paste. For anything you need to be exactly right, convert the file instead of pasting it.

### What is the best way to send an AI-generated document to somebody?

Save it as a `.md` file, review it, and convert it to a single self-contained HTML file or a read-only link. Both open by double-click or by clicking, on any machine, with no install and no Markdown knowledge required of the reader. The paste is only reliable when the destination is a Markdown-native tool such as Notion or a Markdown comment box.

### Why do the dollar signs around my equations not turn into maths?

Because dollar-delimited maths is not part of any Markdown specification. It is a convention that some renderers added on top, so the chat window and GitHub display it while a general-purpose converter passes the characters straight through. Use a converter with a maths mode, pre-render the expressions, or write simple formulas in plain notation.

### Is it safe to paste an AI draft into an online converter?

Only if you know where the conversion happens. A server-side converter is receiving an upload of a document that probably contains whatever you put in the prompt, which is often the most sensitive text you handle all week. Open the network tab and watch: a browser-side converter makes no request at all.

### Should I tell people a document was drafted by a model?

Yes, in one line, along with what you checked. It costs nothing, it sets the reader's scepticism at the right level, and it protects you when a figure you verified turns out to have been wrong at source. Undisclosed model output that later fails is a much worse conversation than disclosed output that later fails.

### Can I get the answer out without copying it at all?

Yes, if the assistant can reach a conversion service directly through a connector, an API or a command it is allowed to run. The text goes from the model to the converter without touching the clipboard, which removes autocorrect and half-parsed pastes from the process entirely. The review step stays exactly where it was.
