---
title: Converting Markdown from a terminal
description: Three ways to convert Markdown to HTML from a terminal — a local converter, a Node script and an HTTP API — and what changes once CI runs it
date: 2026-08-11
tag: Automation
keywords: markdown to html cli, command line markdown converter, markdown to html script, markdown to html node, batch convert markdown, convert folder of markdown files
---

A browser converter is the right tool for one file. It stops being the right tool when the conversion has to happen on every commit, or when a folder holds forty files and nobody wants forty tabs. At that point you want a command — something a Makefile, a shell script or a CI job can call with nobody clicking anything.

Three shapes cover almost every case. They install differently, fail differently, and suit different jobs.

| Shape | What you install | Works offline | Suits |
| --- | --- | --- | --- |
| A converter binary | pandoc, cmark-gfm | Yes | One-off conversions, mixed input formats |
| A Node script | marked or markdown-it | Yes | Repo builds, output you control |
| An HTTP API | nothing beyond curl | No | Publishing a link, no local toolchain |

## A converter binary on the machine

pandoc is a general document converter: Markdown in, HTML, PDF, DOCX and more out. One file is one line:

```bash
pandoc -f gfm -t html -s README.md -o README.html
```

`-f gfm` asks for GitHub Flavored Markdown, so tables and strikethrough survive. `-s` produces a standalone document with a head and a title, not a bare fragment.

cmark-gfm is the other end of the scale: a small C implementation of the GFM spec, extensions off by default.

```bash
cmark-gfm -e table -e strikethrough -e autolink README.md > README.html
```

The trade-off is scope. pandoc converts between formats you may never need and is a larger install to keep pinned; cmark-gfm does one job quickly and hands you a fragment with no styling at all. If your build already depends on pandoc, use it. If not, [pandoc alternatives for Markdown to HTML](/blog/pandoc-alternatives-for-markdown-to-html) covers the smaller options.

## A Markdown to HTML script in Node

If the project already has Node, a command line markdown converter is four lines:

```js
// md2html.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const [input, output] = process.argv.slice(2);
writeFileSync(output, marked.parse(readFileSync(input, 'utf8')));
```

```bash
npm install marked
node md2html.mjs README.md README.html
```

Two things before you ship it. The output is a fragment — no doctype, no stylesheet — so wrap it in a template if a browser will open it directly. And marked does not sanitise: raw HTML in the Markdown passes straight through. Fine for your own README, not fine for anything a stranger wrote — see [sanitising Markdown safely](/blog/sanitising-markdown-safely).

## Converting a folder of Markdown files

To batch convert Markdown, the shell does the looping. No extra tool:

```bash
#!/usr/bin/env bash
set -euo pipefail

mkdir -p build
for file in docs/*.md; do
  name=$(basename "$file" .md)
  node md2html.mjs "$file" "build/$name.html"
done
```

`set -euo pipefail` is the load-bearing line. Without it the loop keeps going after a failure and the job reports success with half the pages missing.

For one page rather than a directory of them, concatenate first and convert once. Two things bite. The glob sorts by name, so `10-api.md` comes before `2-setup.md` unless the numbers are padded. And plain `cat` leaves no blank line between files, so the last line of one joins the first line of the next as one paragraph. Padding fixes the order, awk the spacing:

```bash
awk 'FNR==1 && NR>1 {print ""} 1' docs/*.md > all.md
```

## curl and an HTTP API

Sometimes the output is not a file on disk but a page a colleague can open, on a machine with no Node and no permission to install anything. Then the converter is a request.

M2H exposes an API at `/api/v1` with revocable keys. Post the Markdown as the body:

```bash
curl -H "Authorization: Bearer $M2H_API_KEY" \
     --data-binary @README.md \
     "https://transformpipe.com/api/v1/documents?name=README.md&share=link"
```

The response is JSON with the document id and, because of `?share=link`, a read-only URL that is already live. `GET /api/v1/documents/:id.html` gives you the HTML file if you want that too. A dependency-free CLI wraps the same endpoints: `login`, `push`, `list`, `rm`, `usage`, plus `--json` for scripts.

Two numbers shape how you call it: 1 MB a document, 60 requests a minute per caller. Forty files clear that easily; thousands need a sleep, or one merged document.

The trade-off is honest: a network call and a secret. If the build must work offline, keep the local converter.

## What changes when CI runs it

A command that works on your machine is not yet a command that works unattended.

- [ ] Versions pinned in a lockfile and installed with `npm ci`, not `npm install`
- [ ] `npx` given `--yes`, so it never stops to ask permission to fetch a package
- [ ] The API key read from an environment variable, never a config file committed to the repo
- [ ] `set -euo pipefail` at the top of every shell step
- [ ] A non-zero exit treated as a failed job, not a warning in the log

Pinning matters more than it looks. `npx marked` uses a local install if there is one and otherwise fetches whatever is newest that morning, so the HTML your job produces can change without a commit. A lockfile makes the conversion reproducible, which is the only reason to put it in CI at all.

Exit codes are the other half. A redirect keeps the converter's own status; a pipeline does not. `cmark-gfm README.md | tee build/README.html` reports what `tee` did, so a converter that died still reads as success — hence `pipefail`.

For a pull request rather than a nightly build, an action is less work than a shell step; [publishing Markdown from GitHub Actions](/blog/publish-markdown-from-github-actions) shows that path.

Pick the smallest shape that answers the problem. For HTML on disk, write the four-line Node script, add the loop, and stop there. For a link a colleague can open with no toolchain of their own, put the curl call in the build step and let M2H hold the published page.
