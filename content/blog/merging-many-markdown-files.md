---
title: Turning a folder of Markdown files into one document
description: Merging a folder of Markdown files into one - ordering, heading levels, cross-file links, image paths, duplicate anchors and the contents list, with scripts
date: 2026-07-16
tag: Converting
keywords: merge markdown files, combine markdown files, concatenate markdown, multiple markdown files to one html, markdown book from files, table of contents markdown, markdown heading anchors, merge markdown files into one, pandoc merge markdown files, markdown table of contents generator, mdbook summary.md
---

A handbook rarely lives in one file. It is a folder — an introduction, six chapters, an appendix — so two people can edit different parts at once. Then somebody asks for the whole thing as one page. Joining the files is one `cat` away, and the result is wrong in the same few ways every time.

### TL;DR

`cat *.md > handbook.md` gets the order wrong, gives you one `<h1>` per chapter, turns each file's front matter into a stray heading, and leaves every link that pointed at a sibling file pointing at nothing. Fix them in that order: decide where the order lives (a manifest beats numeric prefixes), demote every heading by one level while tracking code fences, strip the front matter as you read each part, and rewrite `03-deploy.md#tls` to `#tls` before anything converts. Pandoc does the first three with `--shift-heading-level-by=1`, `--file-scope` and `--toc`. Past a few dozen parts, stop merging and use a book tool.

The failures are all the same shape: something in each file was written relative to that file, and after the merge there is no "that file" any more. A heading level was relative to a document that started at `#`. A link was relative to a directory. An image path was relative to a folder two levels down. An anchor id was unique inside one chapter and not across ten.

None of it announces itself. A merged document renders. It just renders wrong — the contents list jumps to the wrong chapter, an image is a broken icon, and a link opens a download dialogue for a file that is not there. Every one of those is discovered by a reader, not by the build.

What follows is the whole job: ordering that survives an insertion, a merge script you can read and run, link and image rewriting, anchor collisions, the contents list, what Pandoc already handles, what print needs, and the point at which merging is the wrong tool and a book is the right one.

## What breaks, and in what order

Work through them in this sequence. Ordering first, because every later fix assumes you know which part came from where; links last, because they need the ids the converter finally emits.

| What breaks | What you see | Why | The fix |
| --- | --- | --- | --- |
| Order | Chapter 10 before chapter 2 | A glob sorts strings, not numbers | Zero-padded prefixes, or a manifest |
| Heading levels | Ten `<h1>` elements, no outline | Each part was written to stand alone | Demote every heading by one level |
| Code comments | `# install the agent` becomes a heading | A blind `sed` cannot see a code fence | Track fence state while rewriting |
| Front matter | `title: Running jobs` arrives as an `<h2>` | Nothing looks for a header after the first file | Strip the block as each part is read |
| Separators | A chapter title turns into a heading | `---` under a line of text is setext syntax | Separate with `***` |
| Cross-file links | A link to a file that is no longer there | `03-deploy.md#tls` named a sibling | Rewrite to `#tls` |
| Whole-file links | A link with no fragment to aim at | `[deploying](03-deploy.md)` has no anchor | Map each filename to its title's id |
| Image paths | A broken-image icon | Relative paths resolve from the merged file now | Rebase each part's paths, or inline them |
| Anchor collisions | Two "Overview" headings, one id | Ids come from heading text | Prefix by source file, or rename |
| Footnote ids | A footnote lands on the wrong note | Every part starts its numbering at `[^1]` | Parse per file, or prefix the labels |
| Contents list | Entries that jump nowhere | The slug rule guessed differently from the renderer | Generate from the output, not the input |
| Page breaks | Chapters run on mid-page in the PDF | Markdown has no page-break syntax | A CSS fragmentation rule at each seam |

The rest of this article is that table, one row at a time, with the code.

## Ordering, properly

`cat *.md` gives you whatever the glob produces, and a glob sorts strings, not numbers: `chapter10.md` comes before `chapter2.md`, because `1` sorts before `2` and the comparison stops there. Nesting the parts in folders changes nothing. There are three places the order can live, and they are not equally good.

### Numeric prefixes, and the zero-padding problem

Zero-pad the numeric prefix and the sort becomes the reading order:

```
handbook/
  00-introduction.md
  10-installing.md
  20-configuration.md
  30-running-jobs.md
  90-appendix-glossary.md
```

Steps of ten leave room to insert a part later. Two digits give you a hundred slots, which is more than a handbook needs and fewer than a documentation set has; three digits look bureaucratic and never have to be renumbered.

The padding has to be uniform. Mixing `9-intro.md` with `10-setup.md` reproduces the original bug at a smaller scale, because `1` still sorts before `9`. And re-padding later is a rename of every file, which invalidates every inbound link, every bookmark and the file history that `git log --follow` was tracking. Pick a width on the first day and keep it.

Two more costs are worth naming. Prefixes leak: if the same folder is also published by a generator, `10-installing` shows up in the URL, and stripping it there is another rule in another config file. And string sorting is locale-dependent — the same glob can order accented or mixed-case filenames differently on two machines, which is a difference nobody notices until CI produces a document the author cannot reproduce. GNU coreutils' `sort -V` is a "natural sort of (version) numbers within text" (checked on man7.org, 9 September 2026), which sidesteps the padding question entirely — but it is not on every system your script will run on, so check `sort --version` before a build depends on it.

### A manifest file

If renaming is out because other documents link to these paths, or the order needs to differ from the alphabet for any reason at all, keep the order in a file and read that instead:

```bash
grep -vE '^[[:space:]]*(#|$)' order.txt | xargs cat > handbook.md
```

One path per line; blank lines and `#` comments drop out. That is the whole mechanism, and it is why a manifest wins: the order is a thing you can read, review in a pull request and comment on.

Very often the repository already has one, and adding a second is how the two drift apart:

- **mdBook** uses `SUMMARY.md`. "The summary file is used by mdBook to know what chapters to include, in what order they should appear, what their hierarchy is and where the source files are. Without this file, there is no book." (checked on rust-lang.github.io, 9 September 2026)
- **MkDocs** uses the `nav` key in `mkdocs.yml`, which "is used to determine the format and layout of the global navigation for the site". Leave it out and "`nav` will contain an alphanumerically sorted, nested list of all the Markdown files found within the `docs_dir`" — which is the glob problem again, with a config file in front of it. (checked on mkdocs.org, 9 September 2026)
- **Quarto** lists a book's parts under `book: chapters:` in `_quarto.yml`. (checked on quarto.org, 9 September 2026)

Any of those is already the source of truth. Read it rather than duplicating it. `SUMMARY.md` is a nested list of Markdown links, so the paths come out with one expression:

```bash
grep -oE '\]\(([^)]+\.md)\)' SUMMARY.md | sed -E 's|^\]\((.*)\)$|\1|'
```

The order of the output is the order of the file, which is the order of the book.

### Ordering from front matter

The third option keeps the order inside each part, as a numeric key in its own header:

```yaml
---
title: Running jobs
order: 30
---
```

The order travels with the file: move it, rename it, and it still knows where it belongs. Nothing has to be renumbered, and there is no second file to forget. That is a real advantage, and it is paid for three times over.

You now need a YAML parser to sort, because a `grep` for `order:` breaks the first time somebody quotes the value or indents it under another key. The order is invisible — nobody can see the reading sequence without running the tool. And nothing stops two parts claiming `order: 30`, at which point the tie is broken by whatever your sort does with equal keys, which is usually filename order and is never written down. What a converter does with that header at render time is a separate question, and [there are four possible answers](/blog/front-matter-and-what-converters-do-with-it), only one of which you want.

### Which to prefer

| Where the order lives | Cost | Fails when | Best for |
| --- | --- | --- | --- |
| Zero-padded filename prefixes | A rename to insert or reorder | The padding is inconsistent, or the locale differs | A folder one person owns |
| A manifest file | One line to add per new part | Somebody adds a file and forgets the line | Anything reviewed in a pull request |
| A key in each file's front matter | A YAML parser in the merge script | Two parts claim the same number | Files that move between folders |

Prefer the manifest, and prefer the one the repository already has. It is the only option where the reading order is a reviewable artefact rather than an emergent property, and the only one where "this chapter is missing from the build" shows up as a missing line in a diff instead of a file nobody thought about. The failure mode matters more than the convenience: a forgotten manifest line drops a chapter silently, but so does a typo in a prefix, and only one of the two is visible in a code review.

Use prefixes as well if you like — they make the folder readable in a file listing — but let the manifest decide. Front matter ordering is worth it only when parts genuinely move between directories, which is rarer than it sounds.

## The three edits, and a script that makes them

Every part needs the same three changes on the way in: its headings demoted, its front matter removed, and a visible break put in front of it. Here is each one, and then the script that does all three in one pass.

### Demote the headings

Each part was written to stand alone, so each starts with a single `#` title. Chain ten and the document has ten `<h1>` elements and no outline.

There are two answers. Treat each `#` as a chapter title and put nothing above it, which works while the file is only ever a stack of chapters. Or demote every heading by one level and add a single `#` title. `sed 's/^#/##/'` corrupts your code doing it: a `# install the agent` comment inside a fenced block gets demoted too. Track the fences.

There is a ceiling, too. CommonMark puts an ATX heading's opening sequence at "1–6 unescaped `#` characters", and "more than six `#` characters is not a heading" (checked on spec.commonmark.org, 9 September 2026) — a seventh hash gives you a paragraph that begins with hashes. So a part that already uses `######` for something has nowhere to go, and the demoting pass has to leave those alone rather than quietly turning them into text. In practice a document using six levels of heading is telling you it should have been two documents.

### Separate the parts

A visible break tells the reader one part ended and another began. `---` alone on a line becomes an `<hr>`, but directly under a line of text it is setext syntax, turning that line into an `<h2>`. Separate the parts with `***`: the same `<hr>`, never a heading underline.

Leave a blank line either side of it. A separator glued to the last line of the previous part is the same setext accident by another route.

### Strip the front matter

The same dashes cause the last problem. Parts written for a static site open with a front matter block, and after the first file nothing looks for one: the opening `---` becomes a rule, the keys become a paragraph, and the closing `---` underlines it — setext again, so `title: Running jobs` arrives as an `<h2>` mid-document. That is the rendering outcome, and it is the one you always get once nothing is looking for the block.

Strip it as each part is read, and only at the very top of the file, so a `---` separator further down survives:

```bash
awk 'NR == 1 && /^---$/ { fm = 1; next }
     fm && /^---$/       { fm = 0; next }
     !fm                 { print }' "$file"
```

If the titles in those headers are worth keeping — and they usually are, because they are the chapter names — pull them out before you drop the block and emit each one as a heading. That is the version to write if the parts do not already start with a `#` title of their own.

### The script, in shell

This reads a manifest, strips each part's front matter, demotes its headings outside code fences, and puts a rule between the parts.

```bash
#!/bin/sh
# merge.sh — one document from a manifest of Markdown parts.
set -eu

manifest=${1:-order.txt}
out=${2:-handbook.md}
: > "$out"

grep -vE '^[[:space:]]*(#|$)' "$manifest" | while IFS= read -r part; do
  if [ -s "$out" ]; then printf '\n***\n\n' >> "$out"; fi

  awk '
    # A front matter block, but only at the very top of the file.
    NR == 1 && /^---[[:space:]]*$/ { fm = 1; next }
    fm && /^---[[:space:]]*$/      { fm = 0; next }
    fm                             { next }

    # Track fences, so nothing inside a code block is rewritten.
    /^[[:space:]]*(```|~~~)/ { fence = !fence; print; next }

    # Demote a real heading, unless it is already at the sixth level.
    !fence && /^#+[ \t]/ {
      hashes = $0
      sub(/[^#].*$/, "", hashes)
      if (length(hashes) < 6) { print "#" $0 } else { print }
      next
    }

    { print }
  ' "$part" >> "$out"

  printf '\n' >> "$out"
done
```

One honest caveat: `fence` is a single flag covering both fence characters, so it flips on a line of tildes inside a backtick-fenced block. That is rare, and it is worth knowing about before you blame the script for a chapter whose headings all came out one level too shallow.

### The same thing in Node

The shell version is fine for a fixed pipeline. The moment you need to rewrite links or rebase images you need to know which file each line came from at the point you are rewriting it, and that is much easier in a real program:

```js
// merge.mjs — node merge.mjs order.txt handbook.md
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [manifest = 'order.txt', out = 'handbook.md'] = process.argv.slice(2);
const root = dirname(manifest);

const parts = readFileSync(manifest, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

// No `m` flag: `^` is the start of the string, so only a block at the very
// top of the file is removed.
const stripFrontMatter = (text) =>
  text.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/, '');

const demote = (text) => {
  let fenced = false;

  return text.split(/\r?\n/).map((line) => {
    if (/^\s{0,3}(?:`{3,}|~{3,})/.test(line)) {
      fenced = !fenced;
      return line;
    }

    if (fenced) return line;

    const heading = line.match(/^(#{1,6})[ \t]/);
    return heading && heading[1].length < 6 ? `#${line}` : line;
  }).join('\n');
};

const merged = parts
  .map((part) => demote(stripFrontMatter(readFileSync(join(root, part), 'utf8'))).trim())
  .join('\n\n***\n\n');

writeFileSync(out, `${merged}\n`);
```

The Python equivalent is the same forty lines with `re` and `pathlib`; there is nothing in it that needs a library. Whichever language, keep the three transforms as separate functions taking text and returning text, because the link and image rewriting in the next section slots in between them and you will want to test each one on its own.

When the merge runs on every commit, [converting Markdown from a terminal](/blog/markdown-to-html-from-the-command-line) covers the CI side, and [converting a folder file by file](/blog/batch-convert-markdown-files) is the other half of the same problem — the one where the output stays as many pages.

## Cross-file links, and the ones you will miss

This is the part most guides skip, and it is the part readers notice first, because a broken link is a click that goes nowhere rather than a paragraph that looks slightly off.

Inside the folder, `[retries](30-running-jobs.md#retries)` is correct. After the merge, the target is in the same document and the filename has to go, or the link points at a file that no longer sits beside the reader:

```bash
sed -E 's|\]\([0-9A-Za-z._/-]+\.md#|](#|g' handbook.md > tmp && mv tmp handbook.md
```

That handles the common shape. There are four more, and each one needs saying out loud.

**A link to a whole file.** `[deploying](03-deploy.md)` has no fragment to keep, so there is nothing for a regular expression to rewrite it to. It needs the id of that file's own title, which means building a map while you read the parts — filename to the id of its first heading — and consulting it in a second pass. This is the reason to write the merge in a language with a dictionary in it.

**Reference-style links.** `[retries]: 30-running-jobs.md#retries` sits at the bottom of the file in a definition block, and the inline pattern above never touches it. It needs its own rule, anchored to the start of a line:

```bash
sed -E 's|^(\[[^]]+\]:[[:space:]]*)[0-9A-Za-z._/-]+\.md#|\1#|' handbook.md > tmp && mv tmp handbook.md
```

**Raw HTML links.** `<a href="30-running-jobs.md">` passes through the parser untouched, because Markdown lets raw HTML through by design. No Markdown-aware rewriter will find it. Grep for `href=` in the source as well as in the output.

**Encoded and bracketed destinations.** A path with a space arrives as `](<03 deploy.md#tls>)` or `](03%20deploy.md#tls)`, and neither matches a character class that assumed no spaces and no percent signs. Filenames with spaces are worth banning for this reason alone.

### Finding the ones you missed

Do not trust the rewrite. Check the merged Markdown for anything still pointing at a file:

```bash
grep -nE '\]\([^)#][^)]*\.md' handbook.md
grep -n 'href="' handbook.md
```

Then check the converted HTML, which is where it actually matters. Every internal link should have a target with that id, and the two lists are comparable:

```bash
grep -oE 'href="#[^"]+"' handbook.html | sed -E 's/.*"#(.*)"/\1/' | sort -u > wanted
grep -oE 'id="[^"]+"'    handbook.html | sed -E 's/.*"(.*)"/\1/'  | sort -u > present
comm -23 wanted present
```

`comm -23` prints the lines present only in the first file: every fragment link with nothing to land on. An empty result is the check passing. Put it in the build, because it costs nothing and it is the only one of these checks that cannot be fooled by a document that renders.

### Image paths after the merge

`![Flow](img/flow.png)` in `handbook/chapters/03-deploy.md` resolves against `handbook/chapters/`. Move that line into `handbook.md` at the repository root and the browser looks for `img/flow.png` next to the merged file, finds nothing, and draws the broken-image icon. Nothing in the line changed; what it was relative to did.

So every relative image destination has to be rebased from the part's own directory to the output's. In the Node script, at the point you already know both:

```js
import { relative, sep } from 'node:path';

const rebaseImages = (text, from, to) =>
  text.replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (match, head, target) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(target)) return match;
    return head + relative(to, join(from, target)).split(sep).join('/');
  });
```

The guard leaves absolute paths, fragments and anything with a scheme alone; the `split(sep).join('/')` is there because Windows hands back backslashes and a URL is not a filesystem path. Run it before the link rewriting, and only over image destinations, so it does not fight the pass that is turning `.md#` links into fragments.

Getting the paths right makes the merged Markdown correct. It does not make the HTML portable: the file still only works while those images sit in the right place beside it, which they will not after somebody emails it. The fix is to inline the images as data URIs, or to convert with something that produces a self-contained file — [which of your images and links still work after the file moves](/blog/images-and-links-that-still-work) is the whole question, and it is worth settling before you send anything.

## Anchor collisions, and what each renderer does about them

Heading ids come from heading text, so a `## Overview` in the installing chapter and a `## Overview` in the jobs chapter both want the id `overview`. In ten chapters written by four people, "Overview", "Configuration", "Troubleshooting" and "Examples" are all going to appear more than once. Every one of them is a collision.

What happens next depends entirely on what converts the file.

| What renders it | What the second "Overview" gets | Source |
| --- | --- | --- |
| github-slugger, the rule GitHub's own anchors follow | `overview-1`, then `overview-2` | `slugger.slug('foo')` returns `foo`, then `foo-1`; ISC licence (checked on github.com, 9 September 2026) |
| markdown-it-anchor | `overview-1` | Auto-generated ids "still suffix on collision"; `uniqueSlugStartIndex` defaults to 1; Unlicense (checked on github.com, 9 September 2026) |
| Pandoc with `--file-scope` | An id prefixed from the filename | "prefixes based on the filenames will be added to identifiers in order to disambiguate them, and internal links will be adjusted accordingly" (checked on pandoc.org, 9 September 2026) |
| A converter with no de-duplication | The same id, twice, in one document | The browser jumps to whichever comes first |

Every one of those behaviours is defensible and no two of them agree. A link written as `[see](#overview)` is therefore unpredictable across tools: on one it reaches the first chapter's section, on another it reaches an element that only exists because the tool counted, and on a third it reaches a duplicate id the specification never promised anything about. Worse, the suffix depends on document order, so inserting a chapter renumbers every collision after it and silently repoints links that used to work.

Three fixes, best first.

**Make the headings distinct.** `## Configuring the agent` and `## Configuring a job` are better documentation regardless of the merge, and they remove the problem rather than managing it. A reader scanning a contents list of ten identical "Overview" entries is not helped by any amount of suffixing.

**Prefix by source file at merge time.** If renaming is not on the table, rewrite each heading as you read it so its id carries the part it came from — `deploy-overview`, `installing-overview`. Where the syntax is available, an explicit id on the heading is exact:

```
## Overview {#deploy-overview}
```

That trailing brace is an extension, not CommonMark: Pandoc supports it, and in the JavaScript world it takes a plugin. If your converter does not, prefix the heading text instead, or accept the tool's own de-duplication and generate the contents list from the output so the two agree.

**Read the ids the converter produced.** Do not guess the slug rule. Convert once, look at the HTML, and take the ids from there. transformpipe prefixes every heading id with `doc-`, and its HTML source tab shows the exact file — which is a specific example of the general point, that the only reliable slug rule is the one you can read in the output.

The same collision hits footnotes, which people notice much later. Every part that has footnotes starts them at `[^1]`, so a merged document has four `[^1]` definitions and four references that all resolve to whichever the parser kept. Either parse each file separately, which is exactly what Pandoc's `--file-scope` is for, or prefix the labels as you read each part.

## The table of contents

With the parts demoted, every `##` is a chapter — a contents list waiting to be generated. There are four ways to get one, and the deciding question is the same in each case: does the entry's target match the id the renderer will actually emit?

| Route | What it costs | When it is right |
| --- | --- | --- |
| By hand | It goes stale silently, and nobody notices for months | Five chapters that will not change |
| Generated at merge time | You own the slug rule, and it must match the converter's | The merge is already a script |
| doctoc | A Node install; it writes into the file between markers | A README in a git repository, refreshed on commit |
| markdown-toc | A Node install; a `<!-- toc -->` marker | The same job, if you prefer that marker style |
| From the converter | Nothing, and the ids are guaranteed to match | You are converting to HTML anyway |

**Generated at merge time.** Walk the merged file once, outside fences, and print an entry per heading:

```bash
awk '/^```/ { fence = !fence; next }
     !fence && /^## / {
       title = substr($0, 4)
       slug  = tolower(title)
       gsub(/[^a-z0-9 -]/, "", slug)
       gsub(/ /, "-", slug)
       printf "- [%s](#%s)\n", title, slug
     }' handbook.md
```

That slug rule — lowercase, drop punctuation, spaces to hyphens — holds for English headings and diverges on accents and duplicates. It also assumes the id is the bare slug: a converter that prefixes ids wants that prefix in the link. Generated entries and headings come from the same text, so a renamed chapter renames its entry.

**doctoc** "generates table of contents for markdown files inside local git repository. Links are compatible with anchors generated by github or other sites". Install it with `npm install -g doctoc`, mark the spot with `<!-- START doctoc -->` and `<!-- END doctoc -->`, and run `doctoc handbook.md`; `--github`, `--maxlevel` and `--title` control the anchor style, the depth and the heading it writes above the list. MIT licensed (checked on github.com, 9 September 2026).

**markdown-toc** does the same job with a shorter marker: put `<!-- toc -->` where you want the list and run `markdown-toc -i handbook.md` to write it in place, between `<!-- toc -->` and `<!-- tocstop -->`. Install with `npm install -g markdown-toc`. MIT licensed (checked on github.com, 9 September 2026).

Both are aimed at GitHub's anchors, which is exactly right when the merged file is going to be read on GitHub and exactly wrong when it is going through a converter with a different id rule. That is the trap: a contents list generated against one slug rule and rendered by another produces a page where every entry is a link and none of them moves the page.

**From the converter** avoids the mismatch by construction, because the tool that numbers the headings is the tool that writes the list. If HTML is the destination anyway, this is the cheapest correct answer.

Whichever route, walk the merged file once before you ship it:

- [ ] No `#` inside a code block got demoted
- [ ] No `.md)` left in any link
- [ ] Every contents entry jumps somewhere
- [ ] Every image loads with the folder moved
- [ ] The `comm -23` check above prints nothing

## Pandoc's own answers, and the print case

Pandoc handles several of these problems with flags, which is a good reason to reach for it before writing a script — and a good reason to know exactly which problems it leaves you.

Given several inputs, "pandoc will concatenate them all (with blank lines between them) before parsing", so the order is still yours to supply: list the files in the order you want, or expand a manifest into the command line. The useful flags:

| Flag | What the manual says |
| --- | --- |
| `--shift-heading-level-by` | "Shift heading levels by a positive or negative integer. For example, with `--shift-heading-level-by=-1`, level 2 headings become level 1 headings, and level 3 headings become level 2 headings." |
| `--file-scope` | "Parse each file individually before combining for multifile documents. This will allow footnotes in different files with the same identifiers to work as expected." |
| `--toc` | "Include an automatically generated table of contents … in the output document." |
| `--toc-depth` | "Specify the number of section levels to include in the table of contents. The default is 3." |
| `--number-sections` | "Number section headings in LaTeX, ConTeXt, HTML, Docx, ms, or EPUB output. By default, sections are not numbered." |

(All checked on pandoc.org, 9 September 2026.)

`--shift-heading-level-by=1` is the demoting pass, done properly: it runs on the parsed document, so a `#` inside a fenced block is a comment in a code sample and is left alone. That is the whole reason the awk above needed a fence flag and this does not. `--file-scope` is the anchor and footnote fix, and it goes further than de-duplication — it prefixes ids from the filenames and adjusts internal links to match, which is the merge-time prefixing described earlier, for free.

So a serviceable merge is one command:

```bash
pandoc --standalone --toc --toc-depth=2 --file-scope \
  --shift-heading-level-by=1 \
  --metadata title="Handbook" \
  $(grep -vE '^[[:space:]]*(#|$)' order.txt) \
  -o handbook.html
```

What it does not do: rebase your image paths, or rewrite a `03-deploy.md#tls` link outside `--file-scope`'s adjustment. And front matter is a question of reader: Pandoc's own Markdown dialect reads a YAML metadata block as metadata rather than as text, which makes the setext accident go away, but the extension set depends on the reader you select — check it before you rely on it. If Pandoc is more tool than this job needs, [the smaller options are here](/blog/pandoc-alternatives-for-markdown-to-html).

### If the destination is a PDF

A merged handbook is very often on its way to print, and print has one requirement the screen does not: chapters start on a new page. Markdown has no page-break syntax, so the break has to come from the HTML or from the PDF engine.

Through a browser or any HTML-to-PDF renderer, it is a CSS fragmentation rule. Put a marker at each seam instead of the `***`:

```html
<div class="chapter-break"></div>
```

and set the rules in the stylesheet:

```css
@page { size: A4; margin: 20mm; }

.chapter-break { break-before: page; }
h1, h2, h3 { break-after: avoid-page; }
p { orphans: 3; widows: 3; }
```

`break-before: page` starts the next chapter on a fresh sheet. `break-after: avoid-page` on the headings stops a chapter title stranded at the foot of a page with its first paragraph overleaf, which is the single most common ugly result of printing a merged document. `orphans` and `widows` do the same for paragraphs. Older engines want the legacy `page-break-before: always` spelling as well; setting both is harmless.

A raw `\newpage` reaches only a LaTeX-based PDF, so it is the right answer through Pandoc's LaTeX writer and does nothing at all through a browser. [Every route from Markdown to PDF, and what each one costs](/blog/markdown-to-pdf) is the longer version of this decision.

## When it is a book, not a document

Merging is right when the output is one page. It stops being right once you want numbered chapters, cross-references that survive reordering, or a search box — and the honest version of that sentence is that a merged handbook has one navigation mechanism, the contents list at the top, and a reader eleven screens down has no idea where they are.

Past a certain size the merged file is a book pretending to be a document. The symptoms are specific: the merge script has grown a link-rewriting pass and an id-prefixing pass and a contents generator, which is to say it has become a static site generator with no tests; reordering two chapters means re-running everything and re-checking every anchor; and the output is large enough that opening it takes a visible moment.

A book tool solves ordering, anchors and navigation for you, and charges a build step for it.

| Tool | Order comes from | Output | Licence |
| --- | --- | --- | --- |
| mdBook | `SUMMARY.md` | A static site, written in Rust | MPL 2.0 |
| MkDocs | `nav` in `mkdocs.yml` | A static site, written in Python | BSD 2-Clause |
| Quarto | `chapters:` in `_quarto.yml` | HTML, PDF, Typst, Word, EPUB, AsciiDoc | MIT |
| Honkit | A GitBook-style source tree | A website or an ebook: PDF, EPUB, MOBI | Apache 2.0 |
| Pandoc | The order you list the files | Whatever is on its own format list: HTML, PDF, EPUB, Word and more | GPL |

(Licences and outputs checked on rust-lang.github.io, mkdocs.org, quarto.org, pandoc.org and github.com, 9 September 2026. Honkit is a fork of GitBook Legacy.)

What that costs is worth stating plainly, because "just use mdBook" is advice that ignores half the problem. You acquire a toolchain: a runtime to install on every machine that builds the docs, a config file to keep valid, a theme to keep updated, and a CI job that can now fail for reasons unrelated to anything anybody wrote. You acquire a deployment target, because the output is a directory of files that has to be hosted somewhere. And you lose the artefact you started out wanting — a book tool gives you a site, not a file you can attach to an email, and if somebody asks for the whole handbook as one page you are back to merging, or to whatever print view the tool happens to offer.

The dividing line is not the number of files. It is whether the document is read once or lived in. A handbook kept for years is better as a site; one that goes out once — to a client, a regulator, a new starter — is better merged. Where the source lives is a separate question from either, and the answer to that one is almost always the repository.

## How to choose which merge to build

1. **Decide where the order lives before you write a line of the script.** In filenames, every insertion is a rename; in a manifest, every new part is a line somebody must remember to add — and the consequence of forgetting is a chapter that silently does not ship, which no test will catch unless you write one that compares the manifest against the directory.
2. **Demote after parsing, not before.** A regular expression over raw text cannot tell a heading from a comment in a shell sample, so either track fence state yourself or hand the job to a parser; the cost of getting it wrong is a code block that becomes an outline entry, and it will be in the contents list at the top of the page.
3. **Rewrite links and image paths in the same pass that reads each file.** That is the only moment you know which part a line came from, which is exactly what you need to turn `03-deploy.md#tls` into `#tls` and `img/flow.png` into `chapters/img/flow.png` — do it later and you are guessing.
4. **Make heading ids unique at the source rather than relying on the renderer.** Every tool de-duplicates differently and some do not at all, so a document that depends on the counter is a document whose links change meaning when somebody inserts a chapter.
5. **Generate the contents list from the output, not the input.** A list built with your slug rule and rendered by a converter with a different one is a page of links that all fail quietly, and quiet failure is the expensive kind.
6. **Open the merged file somewhere else before you send it.** A different machine, a different browser, the network off, the images folder left behind — that one test catches broken relative paths, missing anchors and CDN-linked styles at once, and it takes a minute.
7. **Write down the size at which you stop merging.** Twenty parts, or the day a second output format is needed, or the first request for search: pick the trigger in advance, because the alternative is discovering it as a maintenance problem eighteen months in.

Start with the filenames, before there are twenty of them: ordering is the only one of these problems that gets worse with time, and the only one whose fix — renaming — gets more expensive every month you leave it. For the HTML itself, drop the parts onto [transformpipe](/) together: several files at once are chained into one document, in order, separated by a rule, with the heading ids visible in the source tab so the contents list can be checked against them rather than guessed. From a terminal, `tp push handbook/*.md --merge --share link` prints a link to pass on. Either way, the merge is the easy part; the three passes over links, images and anchors are the work, and they are what separates a document that renders from a document that reads.

## FAQ

### How do I combine multiple Markdown files into one?

Concatenate them in a deliberate order, then make three edits as you go: strip each part's front matter, demote its headings by one level while skipping code fences, and put a `***` rule between the parts. `cat *.md > out.md` does the concatenation and none of the edits, which is why its output looks right and behaves wrong.

### Why is chapter 10 before chapter 2 in my merged file?

Because a shell glob sorts filenames as strings, and in a string comparison `1` comes before `2` and the comparison stops there. Zero-pad the numeric prefixes so every filename has the same width, or keep the reading order in a manifest file and read that instead of globbing.

### How do I stop every chapter becoming an H1?

Demote every heading by one level and give the merged document a single title of its own. Do not do it with `sed 's/^#/##/'`, which will also rewrite `#` comments inside fenced code blocks; track the fences, or use Pandoc's `--shift-heading-level-by=1`, which shifts the parsed document and therefore cannot touch a code sample.

### What happens to links between the files after I merge them?

They point at files that are no longer beside the reader. A link with a fragment — `03-deploy.md#tls` — becomes `#tls`; a link to a whole file needs the id of that file's title, which means building a filename-to-id map while you read the parts. Afterwards, grep the merged file for `.md)` and the converted HTML for fragment links with no matching id.

### Two chapters have the same heading — which anchor wins?

It depends on the renderer, which is the problem. GitHub's slug rule appends `-1` and `-2` to repeats, markdown-it-anchor suffixes on collision as well, Pandoc under `--file-scope` prefixes ids from the filename, and a converter with no de-duplication emits the same id twice and lets the browser jump to the first one. Rename the headings, or prefix them by source file at merge time.

### Do I need a static site generator or a book tool?

Only if the output is a set of pages rather than one. A book tool gives you ordering, unique anchors, navigation and search in exchange for a toolchain, a config file and a build step, and what it produces is a directory to host — not a file you can attach to an email. If somebody asked for one document, merging is still the right answer.

### Can I merge Markdown files without installing anything?

Yes. A browser-side converter that accepts several files at once will chain them into one document in order and hand back the HTML, with nothing installed and nothing uploaded. The trade is that the link, image and anchor rewriting described above is not done for you, so do those passes over the Markdown first and convert last.
