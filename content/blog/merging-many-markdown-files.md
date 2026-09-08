---
title: Turning a folder of Markdown files into one document
description: Ordering, heading levels, duplicate anchor ids, separators and stray frontmatter — what breaks when you chain a folder of Markdown files into one document
date: 2026-07-16
tag: Converting
keywords: merge markdown files, combine markdown files, concatenate markdown, multiple markdown files to one html, markdown book from files, table of contents markdown, markdown heading anchors
---

A handbook rarely lives in one file. It is a folder — an introduction, six chapters, an appendix — so two people can edit different parts at once. Then somebody asks for the whole thing as one page. Joining the files is one `cat` away, and the result is wrong in the same few ways every time.

## Order comes from filenames, not from luck

`cat *.md` gives you whatever the glob produces, and a glob sorts strings, not numbers: `chapter10.md` comes before `chapter2.md`, because `1` sorts before `2` and the comparison stops there. Nesting the parts in folders changes nothing. Zero-pad the numeric prefix and the sort becomes the reading order:

```
handbook/
  00-introduction.md
  10-installing.md
  20-configuration.md
  30-running-jobs.md
  90-appendix-glossary.md
```

Steps of ten leave room to insert a part later. If renaming is out because other documents link to these paths, keep a manifest and read that instead:

```bash
grep -vE '^[[:space:]]*(#|$)' order.txt | xargs cat > handbook.md
```

One path per line; blank lines and `#` comments drop out.

## Heading levels have to be demoted

Each part was written to stand alone, so each starts with a single `#` title. Chain ten and the document has ten `<h1>` elements and no outline.

There are two answers. Treat each `#` as a chapter title and put nothing above it, which works while the file is only ever a stack of chapters. Or demote every heading by one level and add a single `#` title. `sed 's/^#/##/'` corrupts your code doing it: a `# install the agent` comment inside a fenced block gets demoted too. Track the fences.

```bash
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

`fence` flips on every backtick fence, so headings are rewritten only outside a code block; parts fenced with tildes need that pattern too. When the merge runs on every commit, [converting Markdown from a terminal](/blog/markdown-to-html-from-the-command-line) covers the CI side.

## Two files, one anchor id

Heading ids come from heading text, so a `## Configuration` in the installing chapter and one in the jobs chapter both want the id `configuration`. Converters differ: some append a counter, some emit the id twice. Either way, `[see](#configuration)` lands somewhere its author did not intend.

Two things help. Make the headings distinct — `## Configuring the agent` and `## Configuring a job` are better documentation anyway. And read the ids the converter produced rather than guessing the slug rule: M2H prefixes every heading id with `doc-`, and its HTML source tab shows the exact file.

Cross-file links need the same pass: `[retries](30-running-jobs.md#retries)` was right in the folder, but the merged file's target is local, so the filename goes:

```bash
sed -E 's|\]\([0-9A-Za-z._/-]+\.md#|](#|g' handbook.md > tmp && mv tmp handbook.md
```

A link to a whole file needs that file's title anchor, which no regular expression can work out.

## Everything three dashes can mean

A visible break tells the reader one part ended and another began. `---` alone on a line becomes an `<hr>`, but directly under a line of text it is setext syntax, turning that line into an `<h2>`. Separate the parts with `***`: the same `<hr>`, never a heading underline.

The same dashes cause the last problem. Parts written for a static site open with a frontmatter block, and after the first file nothing looks for one: the opening `---` becomes a rule, the keys become a paragraph, and the closing `---` underlines it — setext again, so `title: Running jobs` arrives as an `<h2>` mid-document. Strip the blocks as each part is read:

```bash
awk 'NR == 1 && /^---$/ { fm = 1; next }
     fm && /^---$/       { fm = 0; next }
     !fm                 { print }' "$file"
```

## Building a table of contents

With the parts demoted, every `##` is a chapter — a contents list waiting to be generated:

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

Paste it under the document title, then walk the merged file once before converting:

- [ ] No `#` inside a code block got demoted
- [ ] No `.md)` left in any link
- [ ] Every contents entry jumps somewhere

## When a book tool is the better answer

Merging is right when the output is one page. It stops being right once you want numbered chapters, cross-references that survive reordering, or a search box.

pandoc merges several input files in one call, with `--toc` for the contents list and `--shift-heading-level-by=1` to demote as it reads — two of these problems, handled by flags; [pandoc alternatives](/blog/pandoc-alternatives-for-markdown-to-html) covers the smaller options. mdBook and MkDocs go further, turning a folder and a chapter list — `SUMMARY.md` for mdBook, the nav in MkDocs' config — into a small site. A handbook kept for years is better as a site; one that goes out once is better merged.

Start with the filenames, before there are twenty of them: ordering is the only one of these problems that gets worse with time. For the HTML, drop the parts onto [M2H](https://transformpipe.com) together: several files at once are chained into one document, in order, separated by a rule. From a terminal, `m2h push handbook/*.md --merge --share link` prints a link to pass on.
