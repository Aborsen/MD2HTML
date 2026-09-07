---
title: Turning a folder of Markdown files into one document
description: Ordering, heading levels, duplicate anchor ids, separators and stray frontmatter — what breaks when you chain a folder of Markdown files into one document
date: 2026-07-16
tag: Converting
keywords: merge markdown files, combine markdown files, concatenate markdown, multiple markdown files to one html, markdown book from files, table of contents markdown, markdown heading anchors
---

A handbook rarely lives in one file. It is a folder: an introduction, six chapters, an appendix, each in its own `.md` so two people can edit different parts at once. Then somebody asks for the whole thing as one page, to print or to send on. Joining the files is one `cat` away, and the result is wrong in the same few ways every time.

## Order comes from filenames, not from luck

`cat *.md` gives you whatever the glob produces, and a glob sorts strings, not numbers: `chapter10.md` comes before `chapter2.md`, because `1` sorts before `2` and the comparison stops there. `ls` sorts the same way, so a tidy listing proves nothing. Nor do folders rescue an unpadded name — `handbook/*/*.md` compares whole paths as strings, so `part-10/` still lands before `part-2/`. It is a naming problem. Zero-pad the numeric prefix and the sort becomes the reading order:

```
handbook/
  00-introduction.md
  10-installing.md
  20-configuration.md
  30-running-jobs.md
  90-appendix-glossary.md
```

Steps of ten leave room to insert a part later without renaming the rest. If other documents link to these paths and renaming is out, keep a manifest and read that instead:

```bash
# order.txt: one path per line, blank lines and # comments ignored
grep -vE '^\s*(#|$)' order.txt | xargs cat > handbook.md
```

## Heading levels have to be demoted

Each part was written to stand alone, so each starts with a single `#` title. Chain ten and the document has ten `<h1>` elements and no outline at all.

There are two answers. Treat each `#` as a chapter title and put nothing above it, which works while the file is only ever a stack of chapters. Or demote every heading by one level and add a single `#` title. `sed 's/^#/##/'` almost does the demotion, then corrupts your code: a `# install the agent` comment inside a fenced block gets demoted too. Track the fences.

```bash
#!/usr/bin/env bash
set -euo pipefail

out=handbook.md
: > "$out"

for file in handbook/[0-9][0-9]-*.md; do
  if [ -s "$out" ]; then printf '\n***\n\n' >> "$out"; fi
  awk '/^```/         { fence = !fence }
       !fence && /^#/ { sub(/^/, "#") }
                      { print }' "$file" >> "$out"
  printf '\n' >> "$out"
done
```

`fence` flips on every fence line, so headings are rewritten only outside a code block. A part that already reaches `####` ends up at `#####`, where structure stops carrying meaning — split it instead. When the merge runs on every commit, [converting Markdown from a terminal](/blog/markdown-to-html-from-the-command-line) covers the CI side.

## Two files, one anchor id

Heading ids come from heading text, so a `## Configuration` in the installing chapter and one in the jobs chapter both want the id `configuration`. Converters differ on what happens next: some append a counter, some emit the id twice and let the browser jump to the first. Either way, `[see](#configuration)` lands somewhere its author did not intend.

Two things help. Make the headings distinct — `## Configuring the agent` and `## Configuring a job` are better documentation anyway. And read the ids the converter produced rather than guessing the slug rule, which [varies between renderers](/blog/images-and-links-that-still-work). M2H prefixes every heading id with `doc-`, and its HTML source tab shows what you actually got.

Cross-file links need the same pass: `[retries](30-running-jobs.md#retries)` was right inside the folder, but in the merged file the target is local, so the filename goes:

```bash
sed -E 's/\]\([0-9A-Za-z._-]+\.md#/](#/g' handbook.md > tmp && mv tmp handbook.md
```

A link to a whole file needs that file's title anchor instead, which no regular expression can work out.

## Everything three dashes can mean

A visible break tells the reader one part ended and another began. `---` alone on a line becomes an `<hr>`, but `---` directly under a line of text is setext syntax, turning the line above into an `<h2>`. Separate the parts with `***`: the same `<hr>`, and never a heading underline.

For print, a rule is the wrong break: it falls where it falls, sometimes two lines below the top of a page. Give each part its own sheet — `<div class="part-break"></div>` between parts, with `break-before: page` on that class in the print stylesheet. Nothing between the parts is defensible too: with the headings demoted, the chapter title is already the break.

The same dashes cause the last problem. Parts written for a static site each open with a frontmatter block; from the second file on, nothing looks for one. The opening `---` becomes a rule, the keys become a paragraph, and the closing `---` sits directly under that paragraph — setext again, so `title: Running jobs` and the lines beside it arrive as an `<h2>` mid-document, which a contents list built from `## ` lines never sees. Strip the blocks as each part is read, ahead of the demotion:

```bash
awk 'NR == 1 && /^---$/ { fm = 1; next }
     fm && /^---$/       { fm = 0; next }
     !fm                 { print }' "$file"
```

## Building a table of contents

With the parts demoted, every `##` is a chapter, which is a contents list waiting to be generated:

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

The slug rule here — lowercase, drop punctuation, spaces to hyphens — is close enough for English headings and diverges on accents and duplicates. Paste the output under the document title and check the links once.

Generating the list beats writing one by hand for a single reason: entries and headings come from the same text, so a renamed chapter renames its entry on the next run. A hand-written list survives one rename, then points at an id that is gone — and nothing reports it, because a dead anchor does not error. Before converting, walk the merged file once:

- [ ] No `#` inside a code block got demoted
- [ ] No `.md)` left in any link
- [ ] Every contents entry actually jumps somewhere

## When a book tool is the better answer

Merging is right when the output is one page. It stops being right once you want numbered chapters, cross-references that survive reordering, a search box, or a PDF beside it.

pandoc merges several input files in one call, with `--toc` for the contents list and `--shift-heading-level-by=1` to demote as it reads — two of the problems above, handled by flags; [pandoc alternatives](/blog/pandoc-alternatives-for-markdown-to-html) covers the smaller options. mdBook and MkDocs go further: a folder and a summary file become a small site with navigation between chapters. A handbook kept for years is better as a site; one that goes out once is better merged, and either way the source belongs beside the code, as [documentation that lives in the repo](/blog/documentation-that-lives-in-the-repo) argues.

Start with the filenames, before there are twenty of them: ordering is the only one of these problems that gets worse with time. Then merge, read the result, and fix the anchors it breaks. For the HTML, drop the folder onto [M2H](https://md-2-html.vercel.app), which chains the files into one document in order, separated by a rule, or run `m2h push handbook/*.md --merge --name Handbook`.
