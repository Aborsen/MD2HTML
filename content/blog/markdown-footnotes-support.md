---
title: "Markdown footnotes: the syntax, and who actually renders it"
description: Footnotes are in no Markdown specification. The syntax GitHub and Pandoc accept, which parsers render it, the HTML it becomes, and what to do when one does not
date: 2026-08-19
tag: Syntax
keywords: markdown footnotes, markdown footnote syntax, markdown footnote not working, github markdown footnotes, pandoc footnotes, markdown-it-footnote, inline footnotes markdown
---

### TL;DR

Footnotes are not in CommonMark and not in the GitHub Flavored Markdown specification, so every tool that renders `[^1]` does it as an extension and every tool that does not renders your brackets as literal text. GitHub renders them on its site, Pandoc renders them, Hugo renders them, and markdown-it, remark, Python-Markdown and Goldmark render them once you add the plugin or extension by name. marked does not, without a third-party extension, and a strict CommonMark parser never will. If a footnote has to cross a chain of tools you do not control, either write the aside inline or build the reference and the anchor by hand, because a footnote that silently becomes `[^1]` in your published page is the most common way this feature fails.

You wrote `[^1]` in a paragraph and `[^1]: the note` at the bottom of the file. On GitHub it looks perfect: a small superscript number, a rule near the bottom, the note underneath, a little arrow that takes you back. You convert the same file with something else and the page contains, in the middle of a sentence, the four characters `[^1]`.

Nothing is broken. The converter parsed your file correctly and rendered exactly what the specification it implements says to render. Footnotes are not in that specification. They are not in any specification — not CommonMark, not the GFM spec, not the original Markdown.pl syntax page. They exist because PHP Markdown Extra invented a syntax for them in the mid-2000s, everybody copied that syntax, and GitHub eventually shipped it on its own site without adding it to the spec it publishes. That history is the whole reason this article needs to exist.

So there are two questions worth answering, and they are different. The first is what the syntax is, since almost every implementation copied the same one and the differences are in the corners. The second is which tools understand it, because that is what decides whether your document survives the trip. This piece answers both, and then covers the part nobody writes down: what to do when the answer to the second question is "not this one".

## The syntax, as GitHub and Pandoc accept it

A footnote is two pieces of text in two places. The reference goes where the number should appear. The definition goes wherever you like, and the renderer moves it to the bottom.

```markdown
The estimate assumed a fixed exchange rate.[^1]

[^1]: Which it was not, for most of the period in question.
```

The reference is a caret inside square brackets. The definition is the same token, followed by a colon, at the start of a line. That is the form GitHub documents, the form Pandoc documents, the form Python-Markdown documents, and the form every plugin below implements. Learn it once.

**Identifiers do not have to be numbers.** `[^longnote]`, `[^exchange-rate]` and `[^a]` are all valid, and using words instead of digits is usually the better idea, because the number a reader sees is generated from the order of the references, not from what you typed. Pandoc states the constraint plainly: identifiers may not contain spaces, tabs, newlines, or the characters `^`, `[` or `]`. Everything else is fair.

**The number you see is not the identifier you wrote.** This surprises people who label their notes `[^7]` and `[^2]` and expect the output to say 7 and 2. Renderers number footnotes in the order the references appear in the text, then renumber the list at the bottom to match. Label them `[^price]` and `[^source]` and the confusion disappears, because you stop expecting your labels to survive.

**Definitions can live anywhere in the file.** GitHub's own documentation is explicit that the footnote content appears at the bottom of the rendered document regardless of where in the source the definition sits. Most implementations behave the same way. Putting each definition immediately after the paragraph that references it keeps the source readable; collecting them all at the end keeps the prose clean. Both render identically.

**A footnote can hold more than one paragraph, if you indent it.** This is where the syntaxes diverge slightly, and where most malformed footnotes come from. Pandoc's rule is that subsequent blocks are indented to show they belong to the note, and that you may indent the whole paragraph or just its first line. Python-Markdown asks for four spaces or one tab on the continuation lines. Indenting by four spaces satisfies both.

```markdown
[^longnote]: Here is the first paragraph of the note.

    And here is a second, indented by four spaces so it stays
    attached to the footnote rather than ending it.

        A code block, indented eight, still inside the note.

    - A list item, also inside the note.
```

That sample is worth typing into whatever renders your documents, because the failure mode is instructive: a continuation paragraph that lost its indentation does not produce an error. It produces a footnote with one paragraph in it and a stray paragraph of prose sitting immediately below the definition line, which the renderer then places in the body of the document at whatever point the definition happened to appear. You get a sentence about exchange rates in the middle of section four.

**Line breaks inside a footnote follow the usual rules.** GitHub's documentation notes that adding two spaces at the end of a line breaks the line within a footnote, exactly as it does anywhere else. The rules inside a note are the same as the rules outside one.

**A definition nobody references is not an error either.** Delete the sentence containing `[^3]` and leave `[^3]: …` at the bottom, and implementations differ: some drop the orphaned definition, some render it as a footnote with no reference pointing at it, and some print the definition line as literal text because it is no longer part of a footnote group. None of them tells you. This is the single most common cause of a note that "disappeared" — the reference was edited away with the sentence around it.

## Quick comparison: who renders a footnote and who prints it

| Tool or spec | Footnotes | How you get them | Inline `^[…]` | Licence |
| --- | --- | --- | --- | --- |
| CommonMark specification | No | Not available; the brackets render as text | No | Free, spec |
| GFM specification | No | Not in the spec, despite the site | No | Free, spec |
| GitHub's own renderer | Yes | On by default, except in wikis | No | Hosted |
| commonmark.js | No | Reference implementation; core syntax only | No | Free, BSD |
| markdown-it | Plugin | `markdown-it-footnote` | Yes | Free, MIT |
| marked | No | A third-party extension, or nothing | No | Free, MIT |
| remark / unified | Plugin | `remark-gfm`, alongside tables and task lists | No | Free, MIT |
| Python-Markdown | Extension | The official `footnotes` extension | No | Free, BSD |
| Goldmark | Extension | `extension.Footnote` | No | Free, MIT |
| Hugo | Yes | Goldmark's footnote extension, enabled by default | No | Free, Apache 2.0 |
| Pandoc | Yes | The `footnotes` extension, on in its own dialect | Yes, `inline_notes` | Free, GPL |

Two rows in that table deserve emphasis, because they are the ones that catch people. The GFM specification does not contain footnotes; the word appears in it once, historically, describing what other implementations added to the original syntax. And GitHub's site renders them anyway. A parser that advertises full GFM compliance and ignores `[^1]` is not broken and not lying — [the gap between the specification and the site](/blog/commonmark-gfm-and-the-flavours) is exactly this kind of feature.

## The HTML a footnote becomes

Every implementation produces the same three structural things, with different names on them. Knowing the shape tells you what to style, what to sanitise for, and what has gone wrong when a footnote link lands in the wrong place.

The reference becomes a superscript containing a link, and the link carries an id of its own so something can point back at it. markdown-it-footnote emits this:

```html
<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>
```

The definitions become a container at the end of the document, holding an ordered list, one item per note, each item carrying the id the reference points at:

```html
<hr class="footnotes-sep">
<section class="footnotes">
  <ol class="footnotes-list">
    <li id="fn1" class="footnote-item">
      <p>Which it was not, for most of the period in question.
        <a href="#fnref1" class="footnote-backref">&#8617;</a></p>
    </li>
  </ol>
</section>
```

And the third thing is that last anchor: the backlink. It is the part most hand-rolled footnote schemes forget, and the part that makes footnotes usable rather than decorative. Without it, a reader who clicks note 4 in a long document has no way back to the sentence they were reading except the browser's back button — which works, until the page was reached by scrolling rather than by a link, at which point back leaves the document entirely.

Implementations expose the backlink as a configurable string, which is a good indication of how much it matters to them. Hugo's Goldmark configuration has a `backlinkHTML` setting for the markup shown at the end of a footnote, defaulting to a return-arrow entity. Python-Markdown has `BACKLINK_TEXT`, defaulting to `&#8617;`, and `BACKLINK_TITLE`, defaulting to `Jump back to footnote {} in the text` — a `title` attribute exists precisely because an arrow on its own tells a screen reader nothing. markdown-it-footnote does not use options for this; you override its renderer rules, which is the same capability with more typing.

The pair of ids is the mechanism, and it is also the fragile part. `#fnref1` and `#fn1` are page-global. Two rendered documents on one page, or one document rendered twice, and the second set of references points at the first set of notes. Every serious implementation has a knob for this, discussed further down, and every implementation ships with it switched off.

## Implementation by implementation

### markdown-it — a plugin, and the classes come with it

markdown-it does not render footnotes on its own. The official plugin, `markdown-it-footnote`, is MIT licensed and installs from npm as one dependency:

```bash
npm install markdown-it-footnote
```

```javascript
const md = require('markdown-it')().use(require('markdown-it-footnote'));
md.render(source);
```

**What you get:** the HTML shown above, with `footnote-ref`, `footnotes-sep`, `footnotes`, `footnotes-list`, `footnote-item` and `footnote-backref` class names, all of which you will need to write CSS against because none of them is styled by anything. It also accepts inline footnotes, covered in its own section below, which few implementations do.

**Who it is for:** anyone already on markdown-it, which includes a great many applications and static site setups. If you are choosing a JavaScript parser and footnotes are a requirement, this is the shortest path — [the wider comparison of JavaScript parsers](/blog/markdown-to-html-in-javascript) covers the rest of the decision, but on this one feature markdown-it wins by having an official plugin at all.

### remark and unified — footnotes arrive with remark-gfm

remark treats footnotes as part of GitHub Flavored Markdown, which is a defensible reading of what GitHub actually renders even though it is not what the GFM specification says. `remark-gfm` adds five things together: autolink literals, footnotes, strikethrough, tables and task lists. It is MIT licensed.

**What you get:** footnote nodes in the mdast tree, which means you can do things to them before they become HTML — count them, move them, check that every reference resolves, extract them into a separate document. That is the point of remark, and footnotes are one of the few constructs where having the tree is worth the weight of the pipeline.

**Who it is for:** projects already running unified, and anyone who needs to validate footnotes rather than merely render them. A pipeline that fails the build when a reference has no definition is about fifteen lines of code with remark and impossible with anything else on this list.

### marked — GFM, minus footnotes

marked implements CommonMark and GFM and stops there. Its documented options are `async`, `breaks`, `gfm`, `pedantic`, `renderer`, `silent`, `tokenizer` and `walkTokens`; there is no footnote option, because footnotes are not in either specification it targets. Anything beyond that surface goes through its extension mechanism, and a third-party `marked-footnote` package exists for exactly this.

**What happens without one:** the reference renders as the literal text `[^1]` inside your paragraph, and the definition line renders as a paragraph of literal text saying `[^1]: Which it was not…`. No warning, no error, no missing-feature message. Two lines of text where you expected a note.

**Who it is for:** applications that need speed and do not need footnotes — comment boxes, chat messages, preview panes. It is a good parser with a narrow, honest scope. The scope is the problem here: converters built on marked inherit the gap, and there are many of them, including the one that runs this site's own Markdown to HTML conversion. Worth knowing before you paste a footnoted document into any browser-based converter and trust the result.

### Python-Markdown — an official extension with options

Python-Markdown ships footnotes as one of its standard extensions, BSD licensed, enabled by name:

```python
import markdown
html = markdown.markdown(source, extensions=['footnotes'])
```

**What you get:** superscript references, a footnote block, backlinks, and more configuration than anybody else offers. `PLACE_MARKER` (default `///Footnotes Go Here///`) lets you decide where in the document the notes land rather than accepting the bottom. `BACKLINK_TEXT` and `BACKLINK_TITLE` control the return link. `SEPARATOR`, defaulting to `:`, sets the string between the prefix and the name in the ids it generates, which is why its footnote ids do not look like anyone else's. `UNIQUE_IDS`, defaulting to `False`, avoids collisions across multiple calls to `reset()` — the fix for rendering several documents into one page. `USE_DEFINITION_ORDER` decides whether the list at the bottom follows the order of the definitions or the order of the references.

**Who it is for:** Python build scripts, and MkDocs sites, where this is already the engine. The extension is in maintenance mode by its own documentation, which for a feature this stable is a description rather than a warning. If Python is where your conversion happens, [the Python options in full](/blog/markdown-to-html-in-python) cover which parser to start from.

### Goldmark and Hugo — off by default in one, on in the other

Goldmark is the CommonMark parser most Go programmes use, MIT licensed, and it ships a footnote extension described in its own documentation as the PHP Markdown Extra syntax. You enable it explicitly, as `extension.Footnote`, when you construct the parser.

Hugo, which uses Goldmark, enables it for you. Its markup configuration has a footnote section with `enable` set to `true` by default, a `backlinkHTML` string, and `enableAutoIDPrefix` set to `false`. That last option is the id-collision fix, and its default is the reason two Hugo pages rendered into one list page can have footnote links that point at each other's notes.

**Who it is for:** Go programmes, and every Hugo site, whose authors mostly do not realise footnotes are an extension because they have never seen them fail.

### CommonMark and commonmark.js — the brackets, exactly as typed

CommonMark stops at a core that everybody already had in common, and footnotes were never in it. commonmark.js, the reference implementation written by the specification's authors, has no footnote support and no extension point for adding one, by design. It is BSD licensed.

**What happens:** `[^1]` is a paragraph containing a caret in brackets. The specification says so, the reference implementation does it, and any argument about whether that is correct behaviour is settled by reading the spec.

**Who it is for:** settling exactly that argument. When a rendering difference has you wondering whether a tool is buggy or merely strict, this is the parser that tells you.

### Pandoc — the widest support, and the only placement flag

Pandoc's own Markdown dialect has the `footnotes` extension on, and it is the most complete implementation of the syntax available. Multi-block notes, word identifiers, inline notes, and the constraint on identifier characters are all documented rather than discovered.

**What you get beyond the syntax:** two flags nothing else on this list has. `--reference-location` decides whether footnotes go at the end of the current top-level block, the end of the current section, or the end of the document — the option affects the html, epub, markdown, muse and several slide writers. And `--id-prefix` adds a prefix to every identifier and internal link in HTML output, which is the documented answer to duplicate ids when you are generating fragments to be included in other pages. If you are assembling one page out of many converted documents, that flag is the difference between working links and links that all point at the first document's notes.

**Who it is for:** documents rather than pages — anything with notes, citations or an output format other than HTML. It is also the tool to reach for when a footnoted Markdown file has to become a Word file or a PDF, because footnotes are a native construct in both of those formats and Pandoc knows how to map them. Pandoc is free and GPL licensed, and the install is the only real argument against it for small jobs.

### GitHub — the reason people write footnotes at all

GitHub renders footnote syntax in Markdown files, issues, pull requests and discussions, numbering the references in order and collecting the notes at the bottom of the rendered document. Its documentation states one exception outright: footnotes are not supported in wikis. Write a footnote in a wiki page and you get the brackets.

**Why it matters more than the other rows:** GitHub is where most people first see a footnote render, and its behaviour is what they assume Markdown does. Nothing about the site tells you that this is one renderer's extension rather than part of the language. The result is a steady supply of files that work in the one place they were written and nowhere else.

## Inline footnotes: Pandoc's `^[…]`

Pandoc adds a second syntax that avoids the two-places problem entirely. It is a separate extension, `inline_notes`, and the note goes where the reference would have been:

```markdown
Here is an inline note.^[Inline notes are easier to write, since you
don't have to pick an identifier and move down to type the note.]
```

The manual says inline and regular footnotes may be mixed freely in one document, and that an inline note cannot contain multiple paragraphs — which is the trade-off. You give up long notes and gain not having to invent an identifier or scroll to the bottom of the file. For a note that is one sentence long, that is a good deal.

Because it is a named extension, you can switch it on and off explicitly: `--from markdown+inline_notes` or `--from markdown-inline_notes`. That matters if you are consuming files from elsewhere and want a predictable dialect rather than whatever Pandoc's defaults happen to be.

`markdown-it-footnote` implements the same syntax, which makes it the one JavaScript route that accepts both forms. Nothing else on this list does. GitHub does not: `^[a note]` on GitHub is a caret followed by what looks like a broken link, which is a particularly unhelpful failure because it does not even look like footnote syntax to somebody reading the source.

The practical rule is that inline notes are for documents whose whole chain you control. The moment the file might be read by GitHub, or by a parser you have not checked, the bracketed form is the safer of the two, and the two-places inconvenience is the price of portability.

## Where footnotes fail, and what it costs

The obvious answer — write footnotes, they work fine — fails in five specific ways, and all five are quiet.

**The silent literal.** A parser without the extension renders your reference and your definition as text. There is no console warning and no visual cue except the brackets themselves, which readers skim past as a typo. The cost is a published document with `[^1]` in it, discovered by somebody else, usually after it has been sent to people. This is the failure to plan for, because it is the only one you cannot see in a preview that uses the same parser as the export.

**Id collisions.** Footnote ids are `fn1`, `fnref1` and friends, generated per document and unique within it. Put two rendered documents on one page — a blog index with full posts, a documentation page assembling several fragments, a print view of a whole section — and the second document's `#fn1` resolves to the first document's note. The links work. They go to the wrong place. Hugo ships `enableAutoIDPrefix` off, Python-Markdown ships `UNIQUE_IDS` off, and Pandoc's `--id-prefix` is something you have to pass, so the default in every case is the broken one. The cost is a page where every footnote link after the first document is wrong, and nothing in any build log mentions it.

**The sanitiser eats the block.** Footnote output uses tags that a Markdown-shaped allow-list often does not include. `<section>` is the usual casualty: a sanitiser built to permit exactly what a GFM renderer produces has headings, paragraphs, lists, tables, `<sup>` and `<a>` on the list, and no `<section>`, because plain GFM never emits one. Run footnote HTML through it and the references survive as superscript links while the entire block of notes vanishes, leaving a document full of numbers pointing at nothing. The cost is worse than losing the notes, because the page still looks finished. If you are sanitising converted output — and for anything you did not write yourself, [you should be](/blog/sanitising-markdown-safely) — add the footnote container to the allow-list at the same time you add the extension to the parser, and test with a footnoted file.

**Round trips lose them.** A footnoted Markdown file converted to HTML and back, or to Word and back, may come out with the notes as ordinary paragraphs at the end and the references as plain superscript numbers. Pandoc maps notes to native constructs in the formats that have them, which is why it is the right tool for that trip. A generic HTML-to-Markdown converter has no way to recognise that a `<section class="footnotes">` was ever footnote syntax, so it faithfully produces a list of paragraphs. The cost is a file that renders acceptably and can never be edited as footnotes again.

**Ordering surprises.** The number a reader sees comes from reference order, and the list at the bottom is ordered by either reference order or definition order depending on the implementation — Python-Markdown makes that an option, `USE_DEFINITION_ORDER`, which tells you the two behaviours both exist in the wild. Move a paragraph and the numbers renumber, which is correct and also means a note referred to in prose as "see note 4" is a maintenance liability. The cost is small and constant: never refer to a footnote by its number in the text.

There is one more cost, and it is the reason to think about this before writing a hundred footnotes rather than after. A document with footnotes is no longer portable Markdown. It depends on a specific tool's extension list, and every step you add to its chain is a step that might not have that extension. Tables have the same property and get more attention, because [a broken table is loud](/blog/markdown-tables-that-survive-conversion) — a row of pipes is obviously wrong. A broken footnote is quiet, which is what makes it more dangerous.

## Making a footnote survive a converter that does not know them

Sometimes the chain is fixed and the parser in it does not do footnotes. There are four ways out, in order of how much they cost you.

**Write the aside inline.** The honest option, and the one worth trying first. Most footnotes in most documents are a parenthesis that got ambitious. If the note is one clause long, put it in the sentence, in brackets, and delete the mechanism. It renders in every parser ever written, it survives every conversion, and the reader does not have to leave the paragraph. The cost is a slightly longer sentence, which is usually not a cost.

**Build the reference and the anchor by hand.** Footnotes are two links and an ordered list. You can write them, and the result works in a plain CommonMark parser because it uses nothing but links and raw HTML:

```markdown
The estimate assumed a fixed exchange rate.<sup id="ref-1"><a href="#note-1">1</a></sup>

## Notes

1. <a id="note-1"></a>Which it was not, for most of the period in question.
   <a href="#ref-1">Back</a>
```

That is real footnote behaviour: a superscript number, a jump to the note, a jump back. It costs you manual numbering, which means renumbering by hand when you insert a note in the middle, and it depends on raw HTML surviving. Two caveats worth knowing before you commit to it. First, a parser configured to escape raw HTML — markdown-it's default is `html: false` — will print your `<sup>` tags as text, which is a different failure in the same place. Second, a sanitiser has to allow both the tags and the `id` and `href` attributes, or the anchors go and the links dangle. Test it in the actual chain, with the actual sanitiser, on one note, before you write forty.

**Use the tool that has the extension, once.** If the chain is fixed but you control one step of it, convert with a parser that understands footnotes and hand the next step the HTML rather than the Markdown. Pandoc reading `markdown` and writing HTML, or a small Node script with markdown-it and its footnote plugin, is a five-minute job that removes the problem permanently. The cost is that the HTML becomes the artefact you maintain, so this only works when the Markdown is a source you convert rather than a document people keep editing.

**Probe before you write.** Whichever route you pick, find out what the chain does before you have a hundred notes in a document. Put this in a file and convert it:

```markdown
A reference.[^probe]

An inline note.^[Inline.]

[^probe]: The note, with a second paragraph below.

    Indented four spaces.
```

Four answers from one paste. A superscript number means the extension is present. The rendered note at the bottom means it collected correctly. A second paragraph inside the note means the indentation rule matches what you type. And a visible `^[Inline.]` means inline notes are not available, which is nearly always the case. Then view the HTML source and check that the `href` on the reference matches the `id` on the note, because that pair is what silently breaks when two documents share a page.

## How to choose: criteria before you commit to footnotes

1. **Decide whether the note is a footnote or a parenthesis.** If it is one clause, put it in the sentence and skip every problem in this article; a mechanism you do not use cannot break in a converter you have not tested.
2. **Name the whole chain the file will travel, then check the weakest link in it.** Author's editor, repository host, converter, sanitiser, publisher — footnotes need the extension at every step that parses Markdown, and one step without it turns your notes into brackets in the published page.
3. **Use word identifiers, not numbers.** `[^exchange-rate]` survives insertion, deletion and reordering, whereas a document labelled `[^1]` through `[^12]` will eventually be renumbered by hand by somebody who did not know the renderer does that anyway.
4. **Turn the id-prefix option on if more than one document can share a page.** Hugo's `enableAutoIDPrefix`, Python-Markdown's `UNIQUE_IDS` and Pandoc's `--id-prefix` all ship inactive, so a listing page or an assembled fragment will have footnote links that resolve to the wrong note and no build step will tell you.
5. **Add the footnote container to your sanitiser's allow-list at the same time as the extension.** A list built for GFM output has no `<section>` in it, and the result is a page where every reference survives and every note is gone, which looks finished and is not.
6. **Keep inline notes for chains you own entirely.** `^[…]` is a real convenience in Pandoc and markdown-it, and it fails on GitHub in a way that does not even look like a footnote, so a file that might be read there should use the bracketed form.
7. **Convert one footnoted file and read the bottom of the output.** Not the top, and not the preview: the rendered HTML, in a browser, with a click on a reference and a click on the backlink. Ten seconds there catches the literal brackets, the missing block and the wrong-target link, which are the only three things that go wrong.

## Conclusion

Footnotes are a widely implemented convention with no specification behind them, and everything awkward about them follows from that one fact. The syntax is stable enough to learn once — `[^name]` in the text, `[^name]:` at the bottom, four spaces to continue a note — and the question that decides whether it works is never about the syntax. It is whether the specific tool in front of your file has the extension, and whether the tool after that one has it too. Check the weakest link in the chain, keep the identifiers as words, switch on the id prefix if two documents will ever share a page, and add the footnote container to the sanitiser at the same time as the parser plugin. If you want to see what a given construct became rather than guess, [converting the file to HTML](/) with the source visible next to the preview answers it immediately: a `<sup>` and a matching `id` means the footnote is real, and a paragraph containing `[^1]` means you have found the weakest link.

## FAQ

### Are footnotes part of Markdown?

No. They are in neither the CommonMark specification nor the GitHub Flavored Markdown specification, and the original Markdown syntax never had them. The syntax everybody uses came from PHP Markdown Extra and spread as an extension, which is why support varies by tool rather than by version.

### Why does my footnote show as `[^1]` in the output?

Because the parser that converted your file does not implement footnotes. It rendered the brackets faithfully, as its specification requires. Either add the footnote extension or plugin to that parser, or use a different one — and check every step of the chain, because the failure comes from the weakest link, not the first one.

### Do footnotes work on GitHub?

Yes, in Markdown files, issues, pull requests and discussions. GitHub's documentation notes one exception: footnotes are not supported in wikis. Bear in mind that GitHub rendering them is not the same as the GFM specification containing them, so a parser that claims GFM compliance and ignores your footnotes is behaving correctly.

### Can a footnote contain a list or a code block?

Yes, if you indent it. Four spaces on the continuation lines keeps a paragraph, a list or an indented code block attached to the note in both Pandoc and Python-Markdown. Lose the indentation and the block becomes ordinary body text at whatever point in the document the definition happened to sit.

### How do I convert a Markdown file with footnotes to HTML?

Use a parser with the extension enabled: Pandoc, which has it on in its own dialect, or markdown-it with `markdown-it-footnote`, or Python-Markdown with `extensions=['footnotes']`, or remark with `remark-gfm`. Then open the result and click one reference and one backlink, because the extension being present does not guarantee the ids match once the page contains anything else.

### Why do my footnote links jump to the wrong note?

Because the ids collide. Footnote ids are generated per document and are unique only within it, so two rendered documents on the same page both contain `fn1`, and the browser goes to the first one. Switch on the id-prefix option for your tool — `enableAutoIDPrefix` in Hugo, `UNIQUE_IDS` in Python-Markdown, `--id-prefix` in Pandoc — all of which are inactive by default.

### What is the difference between a footnote and an endnote here?

In Markdown, nothing at the syntax level: you write the same `[^1]` either way and the renderer decides where the notes land. Pandoc is the one tool that makes the placement explicit, with `--reference-location` choosing the end of the block, the end of the section or the end of the document. Python-Markdown's `PLACE_MARKER` does something similar by letting you put the block where you want it.
