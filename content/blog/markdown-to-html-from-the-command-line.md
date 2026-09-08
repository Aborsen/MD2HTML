---
title: Choosing a Markdown CLI converter, and running it without surprises
description: Converting Markdown to HTML from a terminal: Pandoc, cmark-gfm, comrak, Node, Python, an API call, and the quoting and globbing that fails in CI
date: 2026-08-26
tag: Workflow
keywords: markdown cli converter, markdown to html cli, command line markdown converter, markdown to html script, markdown to html node, batch convert markdown, convert folder of markdown files, pandoc standalone html
---

A browser converter is the right tool for one file. It stops being the right tool the moment the conversion has to happen on every commit, or when a folder holds forty files and nobody wants forty tabs. At that point you want a command — something a Makefile, a shell script or a CI job can call with nobody clicking anything.

The trouble is that a working command and a command that keeps working are two different things. The line you type once, watch succeed and paste into a script is the same line that will run unattended a thousand times, against filenames you did not choose, on a runner with a different shell, a different locale and no Pandoc installed. Almost every terminal conversion that fails in production fails for a reason that has nothing to do with Markdown.

So this piece is in two halves. First the converters: what each one is, what it actually emits, and the exact flags that make the difference between a fragment and a document. Then the parts people get wrong — quoting, globbing, where the output lands, what your exit code really means, and what installing a converter costs on every single CI run.

### TL;DR

If a converter is already on the machine, one line does it: `pandoc -f gfm -t html -s --embed-resources README.md -o README.html` produces a complete, single-file document rather than a fragment, and `--sandbox` makes it safer to point at a file you did not write. If nothing is installed and you want it to stay that way, a five-line Node script over `marked`, a `python -m markdown` call, or a `curl` post to an HTTP API all beat installing a document converter you will use once. The failures are almost never in the parser: they are unquoted filenames, a glob that sorted `10-api.md` before `2-setup.md`, output written into the wrong tree, and a pipeline that reported success because `tee` succeeded. In CI the honest cost of Pandoc is the install on every run, which is why a static binary, a cached image, or an API call often wins on wall-clock time alone.

## Why the terminal changes the question

In a browser a Markdown converter makes four decisions for you and shows you the result immediately. In a terminal it makes the same four decisions silently, and you find out weeks later.

**Which flavour it parses.** Plain CommonMark has no tables, no task lists, no strikethrough and no autolinks. GitHub Flavored Markdown has all four. Nearly every CLI defaults to something, and the something is rarely GFM: Pandoc's default reader is its own extended dialect, cmark-gfm ships with every extension off, comrak turns them on only with `--gfm` or an explicit `--extension`. A table the parser does not recognise does not error. It becomes a paragraph full of pipe characters, and the job exits zero.

**Whether it emits a document or a fragment.** Most of these tools are libraries with a thin executable bolted on, and a library correctly returns `<h1>Title</h1><p>Text</p>` with nothing around it. Opened in a browser, that is unstyled black text at the browser's default font and the full window width. It is valid HTML and it looks broken to everybody who receives it. Only some of these tools have a flag that wraps it.

**What it does with raw HTML.** Markdown was designed to let HTML through, so a `.md` file can carry `<script>`, `onerror=` and `javascript:` links. Pandoc passes all of it through. marked passes all of it through and says so in its own documentation. cmark-gfm and comrak suppress it unless you pass `--unsafe`. markdown-it escapes it unless you turn its `html` option on. If the file came from outside your repository, that choice is the whole security model — [sanitising is a separate job with its own rules](/blog/sanitising-markdown-safely).

**What it tells the shell when it fails.** A converter that dies mid-file still leaves a partial file on disk, and if you piped it, the pipeline's exit status belongs to the last command rather than the one that died. This is the most common way a broken build reports green.

None of the four is exotic. All four are invisible until somebody opens the output.

## Quick comparison: the cheat sheet

| Tool | Best for | Key capability | Price |
| --- | --- | --- | --- |
| Pandoc | Anything beyond HTML, and exact control of the wrapper | `--standalone`, `--embed-resources`, `--template`, `--sandbox` | Free, GPL |
| cmark-gfm | A small, fast, predictable GFM renderer | C with no dependencies, extensions opt-in with `-e` | Free, BSD 2-clause |
| comrak | One static binary with GFM behind a flag | Rust, `--gfm`, raw HTML off unless `--unsafe` | Free, BSD 2-clause |
| marked CLI | A conversion in a repo that already has Node | `marked -o out.html` reading standard input | Free, MIT |
| markdown-it CLI | CommonMark conformance from a shell | Ships a `markdown-it` executable; escapes raw HTML by default | Free, MIT |
| A Node script | Output you control, wrapper included | Five lines over marked or markdown-it, no new tool | Free |
| Python `markdown_py` | A Python build that already exists | `python -m markdown -x tables`, extension API | Free, BSD 3-clause |
| Go and goldmark | A single cross-compiled binary to hand a runner | Library-only; a twenty-line `main.go` becomes the CLI | Free, MIT |
| `curl` and an HTTP API | No local toolchain, and a link at the end | One request, no install, output can be a live page | Free |
| A dependency-free CLI (`tp`) | CI steps that must not drag a package tree | `login`, `push`, `list`, `rm`, `usage`, `--json` | Free |

## Every Markdown CLI converter worth running

### Pandoc — best when the wrapper matters as much as the HTML

Pandoc is a document converter written in Haskell that reads and writes around forty formats. As a Markdown CLI converter it is more tool than the job needs, and it is also the only one here that produces a complete, self-contained, templated document without you writing the template machinery yourself.

| Pros | Cons |
| --- | --- |
| `--standalone` and `--embed-resources` give a real single-file document | A large install to keep pinned, on every machine that runs the job |
| Templates and Lua filters control the output precisely | Templates are a second language to learn |
| `--sandbox` limits filesystem access when the input is untrusted | No sanitising: raw HTML passes straight through to the page |
| Reads GFM, CommonMark and its own dialect, selected explicitly | Its dialects differ in ways that surprise people mid-migration |

**Price:** free, GPL licensed.

**Technical details and features**

- `-f gfm` selects the GitHub Flavored Markdown reader, so tables, task lists, strikethrough and autolinks parse; `-f commonmark` selects the strict one
- `-s` (`--standalone`) produces "output with an appropriate header and footer … not a fragment", in the manual's own words
- `--embed-resources` inlines linked stylesheets, scripts and images as `data:` URIs; the older `--self-contained` is now a deprecated synonym for `--embed-resources --standalone`
- `--template FILE` uses your own wrapper, and implies `--standalone`
- `-M key=value` sets one metadata field, `--metadata-file` reads a whole YAML or JSON file of them, and a value given on the command line overrides one in the document
- `--defaults FILE` moves a long invocation into a YAML file you can commit
- `--toc`, `-N` for numbered sections, and `--shift-heading-level-by` handle the structural chores
- `--resource-path` says where to look for images, separated by `:` on Unix and `;` on Windows
- `--syntax-highlighting=STYLE` chooses the highlighting theme — it replaces the now-deprecated `--highlight-style` — and `--list-highlight-styles` prints what your build supports
- `--file-scope` parses each file separately before combining them, which changes footnote and link behaviour on multi-file input
- `--sandbox` runs the conversion "limiting IO operations in readers and writers to reading the files specified on the command line"
- `--fail-if-warnings` turns a warning into a non-zero exit, which is the flag that makes Pandoc honest inside a script

A complete document, in one command:

```bash
pandoc -f gfm -t html -s \
  --embed-resources \
  --metadata title="API reference" \
  --toc --fail-if-warnings \
  docs/api.md -o build/api.html
```

`--metadata title=` is not optional in practice. Without a title Pandoc warns and gives you a standalone document with nothing useful in its `<title>`, and with `--fail-if-warnings` that warning becomes an error — which is what you want the first time and infuriating the fifth time you forget. Put the whole invocation in a `--defaults` file and the argument stops being something you can forget.

**Who should use it?** Anybody whose output is not only HTML, anybody who needs the wrapper to match a house template, and anybody converting files they did not write, because `--sandbox` has no equivalent elsewhere on this list. If HTML is the only target and the wrapper does not matter, [the smaller options are genuinely smaller](/blog/pandoc-alternatives-for-markdown-to-html).

### cmark-gfm — best small, predictable GFM renderer

cmark-gfm is GitHub's fork of the CommonMark reference implementation, written in standard C99 with no external dependencies. It does one job at speed and hands you a fragment with no styling whatsoever.

| Pros | Cons |
| --- | --- |
| No dependencies, so it builds and caches almost instantly | Fragment output: no doctype, no head, no styles, ever |
| Extensions are explicit, so the behaviour is readable from the command | You must remember every `-e` flag, every time |
| Raw HTML is suppressed unless you ask for it with `--unsafe` | Packaged inconsistently across distributions |
| Tracks the GFM specification closely | Nothing beyond HTML and its own AST-shaped formats |

**Price:** free, BSD 2-clause licensed.

**Technical details and features**

- `-t` / `--to FORMAT` selects the output format; HTML is the one you want here
- `-e` / `--extension NAME` enables one extension at a time, and `--list-extensions` prints what your build actually has
- `--unsafe` is what permits raw HTML and risky links; without it they are stripped, which is the right default for a file from outside
- `--hardbreaks` turns single newlines into `<br>`, and `--smart` produces typographic quotes and dashes
- `--width` controls wrapping for the text-shaped output formats

```bash
cmark-gfm -e table -e strikethrough -e autolink -e tasklist \
  README.md > build/README.html
```

Run `cmark-gfm --list-extensions` before you commit that line. Extension names come from the build, and a name your machine accepts is not guaranteed to exist in the version your distribution ships on the runner — which fails loudly, at least, rather than quietly dropping the tables.

**Who should use it?** Builds that convert a lot of files and care about the seconds, and anybody who wants raw HTML suppressed by default without adding a sanitiser of their own. Not for anybody who needs the output to be openable as it stands.

### comrak — best single static binary

comrak is a CommonMark and GFM implementation in Rust that, unlike goldmark, ships a real command line binary. It is compliant with CommonMark 0.31.2 by default and passes the GFM suite in full (checked on github.com/kivikakk/comrak, 8 September 2026), and it installs with `cargo install comrak`, from Homebrew, pacman, dnf or Scoop, or as a release binary you download once.

| Pros | Cons |
| --- | --- |
| One static binary: nothing to resolve on the target machine | Fragment output, like cmark-gfm |
| `--gfm` turns on the whole GFM set in a single flag | `cargo install` compiles, which is slow the first time |
| Raw HTML and risky links are off unless you pass `--unsafe` | Building from source needs a recent Rust toolchain |
| Also writes XML and CommonMark, which is useful for round-tripping | Smaller ecosystem than the JavaScript parsers |

**Price:** free, BSD 2-clause licensed.

**Technical details and features**

- `--gfm` enables strikethrough, tables, autolinks and task lists together
- `--extension NAME` enables individual extensions, including ones outside GFM such as footnotes and superscript
- `--unsafe` allows raw HTML and dangerous links; both are disabled by default
- `--to` selects HTML, XML or CommonMark output

```bash
comrak --gfm README.md > build/README.html
```

**Who should use it?** Anybody who wants the conversion to be one file they can copy onto a runner, into a container, or onto a colleague's laptop with no package manager involved. Downloading a release binary and keeping it in your tooling directory is a legitimate strategy, and it is the cheapest thing on this page to cache.

### marked CLI — best when the repo already has Node

marked is the small, fast JavaScript Markdown parser, and installing it also installs a `marked` executable. Its own documented usage reads from standard input and writes wherever `-o` says.

| Pros | Cons |
| --- | --- |
| Already a dependency in a great many JavaScript projects | Fragment output; the wrapper is your problem |
| GFM is on by default, so tables work with no flags | No sanitising, by explicit design |
| `marked --help` lists the options, and there are few of them | Needs Node on every machine that runs the job |

**Price:** free, MIT licensed.

```bash
npx --yes marked -o build/README.html < README.md
```

The `--yes` matters more than it looks. Without it, `npx` on a machine with no local copy stops to ask permission to fetch the package, and a CI step that stops to ask a question hangs until the job times out.

**Who should use it?** Projects that already depend on marked for rendering inside the application and want the build to use the same parser, so the page and the app cannot disagree about the same file.

### markdown-it CLI — best conformance from a shell

markdown-it is the CommonMark-compliant parser behind VS Code's Markdown preview, and its package declares a `markdown-it` executable, so a plain `npx` invocation works with nothing else installed.

| Pros | Cons |
| --- | --- |
| Follows the CommonMark specification closely | Slightly slower than marked |
| Escapes raw HTML unless you turn the `html` option on | Fragment output |
| A real plugin ecosystem — footnotes, anchors, containers | Plugins are reachable from the API, not from the CLI |

**Price:** free, MIT licensed.

```bash
npx --yes markdown-it README.md > build/README.html
```

The CLI is deliberately plain. The moment you want a plugin — heading anchors, footnotes, a container syntax — you have stopped using the CLI and started writing the script in the next section, which is fine and takes five lines.

**Who should use it?** Anybody who wants raw HTML escaped by default and the specification followed, and anybody about to graduate from a one-liner to a script.

### A Node script — best when you want the wrapper too

Every fragment problem on this page disappears the moment you write the five lines yourself, because the template is a template literal and you already know HTML.

```js
// md2html.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const [input, output] = process.argv.slice(2);
const body = marked.parse(readFileSync(input, 'utf8'));

writeFileSync(
  output,
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${input}</title>
<style>
body{max-width:44rem;margin:2rem auto;padding:0 1rem;font:16px/1.6 system-ui,sans-serif}
table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.4rem .6rem}
pre{overflow-x:auto;background:#f6f8fa;padding:1rem;border-radius:6px}
</style>
</head>
<body>
${body}
</body>
</html>
`
);
```

| Pros | Cons |
| --- | --- |
| The output is a real document, styled the way you decided | You own it, including the bugs |
| Any parser, any plugin, any post-processing step you like | Needs Node, and a lockfile to stay reproducible |
| No new binary on the machine beyond what the repo already has | Sanitising is still yours to add |

**Price:** free. The parser's licence is MIT either way.

**Technical details and features**

- Swap `marked` for `markdown-it` and you get escaped raw HTML plus plugins, for two more lines
- Add a sanitiser before writing if the input is not yours; the documented answer for marked is to pass its output through DOMPurify
- `process.exitCode = 1` inside a `catch` is what makes the script usable in a pipeline; a script that throws exits non-zero, but a script that logs and carries on does not
- Install with `npm ci`, not `npm install`, so the parser version comes from the lockfile rather than from the calendar

Resist the urge to compress this into a genuine one-liner. `node -e` on a single line means the whole programme has to survive your shell's quoting rules, which is the subject of a section further down, and it is the least rewarding place on this page to be clever.

**Who should use it?** Anybody who needs the output to open on its own and does not want to install a document converter to get it. For most repositories, most of the time, this is the answer.

### Python and `markdown_py` — best inside a Python build

Python-Markdown is the long-standing Markdown implementation for Python and the engine under MkDocs. Installing it gives you a `markdown_py` script, and `python -m markdown` does the same thing without worrying about whether the script directory is on your `PATH`.

| Pros | Cons |
| --- | --- |
| Already present in most Python documentation toolchains | Not CommonMark-compliant in every detail |
| A mature extension API, with extensions for tables and footnotes | Extensions are opt-in, so the plain output has no tables |
| Configurable from a YAML or JSON file with `-c` | Slower than the C, Rust and Go implementations |

**Price:** free, BSD 3-clause licensed.

**Technical details and features**

- Usage is `python -m markdown [options] [args]`, and the HTML goes to standard output
- `-x` / `--extension NAME` loads one extension; repeat the flag for each one
- `-c` / `--extension_configs FILE` reads extension settings from YAML or JSON, which is where anything with options belongs

```bash
python -m markdown -x tables -x fenced_code -x toc \
  README.md > build/README.html
```

Without `-x tables` your tables are paragraphs of pipes. This is the most common Python-Markdown complaint and it is not a bug: tables were never in the original Markdown or in CommonMark, so an implementation that keeps them behind an extension flag is being precise rather than difficult.

**Who should use it?** Python projects, MkDocs users, and anyone whose CI image already has Python and would rather not add a second runtime for the sake of one conversion.

### Go and goldmark — best binary to hand to a runner

goldmark is a Markdown parser in Go, compliant with CommonMark 0.31.2, and the renderer Hugo uses in its default configuration (checked on github.com/yuin/goldmark and gohugo.io, 8 September 2026). It is library-only: there is no `goldmark` command to install. What you do instead is write about twenty lines and compile them, which gets you a single static binary with no runtime to install anywhere.

| Pros | Cons |
| --- | --- |
| Compiles to one static binary, cross-compilable from anywhere | No CLI at all until you write one |
| GFM in one extension: tables, strikethrough, linkify, task lists | You maintain the little programme forever |
| Fast, and already in your stack if you use Hugo | Fewer ready-made extensions than the JavaScript world |

**Price:** free, MIT licensed.

```go
// md2html.go
package main

import (
	"bytes"
	"fmt"
	"os"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
)

func main() {
	source, err := os.ReadFile(os.Args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	md := goldmark.New(goldmark.WithExtensions(extension.GFM))

	var out bytes.Buffer
	if err := md.Convert(source, &out); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	os.Stdout.Write(out.Bytes())
}
```

**Technical details and features**

- `extension.GFM` bundles tables, strikethrough, linkify and task lists; footnotes, definition lists and the typographer are separate extensions you add to the same list
- `go build` produces one file, and `GOOS` with `GOARCH` cross-compiles it for the runner without a container
- Returning a non-zero exit on failure is explicit here, which is easier to get right than it is in a shell

**Who should use it?** Go shops, Hugo users who want to know what is rendering their content, and anybody who would rather commit a compiled binary than maintain a package install step in CI.

### `curl` and an HTTP API — best when there is no toolchain

Sometimes the output is not a file on disk at all. It is a page a colleague can open, produced on a machine with no Node, no Python and no permission to install anything.

| Pros | Cons |
| --- | --- |
| Nothing to install beyond `curl` | Needs the network, so it cannot be your offline build |
| The output can be a live link rather than a file to attach | Needs a secret in the environment |
| Conversion behaviour cannot drift with a local install | Rate and size limits apply |

**Price:** free, including the API on a free account.

transformpipe exposes an API at `/api/v1` with revocable keys. Post the Markdown as the body:

```bash
curl -fsS \
  -H "Authorization: Bearer $TP_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-binary @README.md \
  "https://transformpipe.com/api/v1/documents?name=README.md&share=link"
```

**Technical details and features**

- The response is JSON with the document id and, because of `?share=link`, a read-only URL that is already live
- `GET /api/v1/documents/:id.html` returns the HTML file as well, if you want that on disk
- The limits are published rather than guessed: 10 MB for a file to convert, 4 MB to keep one in an account, 100 MB and 500 documents per account, and 60 requests a minute counted per key
- `-f` is load-bearing. Without it `curl` exits zero on a 401 or a 429 and writes the error body into your output file
- `-sS` keeps the progress meter out of your logs but leaves real errors on stderr
- `--retry 3 --retry-connrefused` covers the transient network failure that would otherwise break one build a month for no reason

Forty files clear 60 requests a minute easily. Thousands need a sleep between calls, or one merged document instead — and [merging is its own small problem](/blog/merging-many-markdown-files), with heading levels and anchor collisions to think about first.

**Who should use it?** Build steps that want a shareable link at the end, and any environment where installing a converter is either forbidden or not worth the minute it costs per run.

### A dependency-free CLI — best for a CI step that must stay small

The other shape of the same idea is a CLI that wraps the API, written so that installing it does not install anything else. transformpipe's `tp` is one file of Node with no dependencies, on purpose: a tool people run in CI should not drag a tree of packages behind it.

| Pros | Cons |
| --- | --- |
| No transitive dependencies to audit, pin or cache | Still a network call and still a secret |
| Reads a key from `tp login`, `TP_API_KEY` or `--key` | Needs Node present, though nothing else |
| `--json` on any command, so a script can read the result | Publishes a document; it is not a local file converter |

**Price:** free.

**Technical details and features**

- `tp push README.md --share` converts and publishes, and prints the link
- `tp push docs/*.md --merge --share` chains several files into one document instead of one document each
- `tp list`, `tp rm <id>` and `tp usage` cover the rest, and `--json` on any of them is for scripts
- `tp login` stores the key at `~/.config/tp/config.json` with mode `0600`; in CI you set `TP_API_KEY` instead, because a runner throws its home directory away
- Failures print the API's own words and exit non-zero, so `set -e` catches them without any wrapper of yours

**Who should use it?** Anybody putting the conversion in a pipeline and wanting one line rather than a `curl` invocation with five flags. For a pull request specifically, an action is less work still — [publishing Markdown from GitHub Actions](/blog/publish-markdown-from-github-actions) removes the install from the runner entirely.

## Where Pandoc stops paying for itself

Pandoc is the default recommendation for converting Markdown from a terminal, and for most of what people ask of it that recommendation is right. It is worth being clear about the four places it is not, because none of them appears on a feature comparison.

**The install is a per-run cost, not a one-off.** On your laptop you install Pandoc once and forget it. In CI you install it on every run, and what that costs depends entirely on how: a distribution package manager pulling a package and its dependencies, a Homebrew install on a macOS runner, a Docker image pull, or a cached package restored from the runner's cache. Only the last two are quick, and both are extra configuration to maintain. Set that against a step in a job that already has Node, or a single static binary you committed, or an HTTP call, and the arithmetic often goes the other way for work whose entire output is one README turned into one page. Do not take a number from me — time your own pipeline with the install and without it, twice each, and use what you measured.

**It does not sanitise.** Pandoc renders faithfully, which means raw HTML in the source arrives in the output. For your own documentation that is a feature; it is how people embed a video or a `<details>` element. For a file that came from a fork, a client or an issue tracker it is a vector, and there is no `--sanitise` flag to reach for. `--sandbox` protects the machine doing the conversion, not the browser that opens the result. Those are different problems with different answers, and conflating them is how an untrusted README ends up rendered with a script tag intact.

**Its Markdown is not the Markdown your file was written in.** Pandoc's default reader is `markdown`, its own extended dialect, not GFM and not CommonMark. Convert a GitHub README with the default reader and you will get differences — in autolinks, in how a hard line break is produced, in whether a bare URL becomes a link — that are not bugs and are not what you asked for. `-f gfm` is not an optimisation. It is a correctness flag, and leaving it out is the most common way a Pandoc conversion goes subtly wrong. The same applies in reverse: a document written for Pandoc, with its fenced divs and its citation syntax, loses those constructs quietly when a strict CommonMark parser meets it.

**Templates are a language.** The moment `--standalone` is not quite right, you are writing a Pandoc template, learning its variable syntax and its conditionals, and testing it by rendering documents and looking at them. That is a fair trade if you are producing a hundred documents that must all look the same. It is a poor trade against the twenty lines of HTML in the Node script above, if what you actually needed was a stylesheet and a sensible measure. Be honest about which of the two you are doing before you start, because the template route is hard to abandon once a build depends on it.

If any of that lands, the smaller tools on this page are not a compromise; they are the correct scope. And if you want the wider view, including the browser and library options that never touch a terminal, [the full converter comparison covers them](/blog/best-markdown-to-html-converters).

## The five things that break in the terminal, not in the converter

Every failure below has been diagnosed as a converter bug by somebody, at least once, and none of them is one.

### Quoting, and why the file with a space in it broke the build

`for file in docs/*.md; do cmark-gfm $file > out.html; done` works until somebody adds `release notes.md`. Then the shell splits the unquoted variable on the space and hands the converter two filenames that do not exist. Quote every expansion, every time:

```bash
cmark-gfm "$file" > "$output"
```

The same rule applies inside `$(dirname "$file")` and `$(basename "$file" .md)`, both of which need their inner quotes as well as their outer ones. Filenames from a repository are not your filenames: they arrive with spaces, apostrophes, ampersands, non-ASCII characters and, on a bad day, a leading dash that the converter reads as a flag. A bare `--` before the filename stops that last one.

For anything recursive, skip the loop over a glob and let `find` pass the names as data:

```bash
find docs -name '*.md' -print0 | while IFS= read -r -d '' file; do
  cmark-gfm -e table "$file" > "${file%.md}.html"
done
```

`-print0` and `-d ''` use NUL as the separator, which is the one byte a filename cannot contain. `IFS=` stops leading and trailing whitespace being trimmed off the name. It is ugly, and it is the only version that is correct for every filename you will ever be handed.

On Windows the failure mode is different and quieter. PowerShell's quoting rules are not the shell's — single quotes are literal, double quotes interpolate `$` — and its redirect does not reliably give you UTF-8; `Out-File` in Windows PowerShell 5.1 defaults to UTF-16 little-endian (checked on learn.microsoft.com, 8 September 2026). A converted file written in an encoding the browser does not expect arrives as gibberish that looks exactly like a converter fault, so write it deliberately with `| Set-Content -Encoding utf8 out.html` and stop guessing.

### Globbing a folder, and the order nobody asked for

`docs/*.md` does three things people do not expect. It does not recurse into subdirectories, so `docs/api/reference.md` is silently skipped. If nothing matches, bash passes the literal string `docs/*.md` to the converter as a filename, which produces a baffling error about a file with an asterisk in it; `shopt -s nullglob` makes an empty glob expand to nothing instead. And it sorts lexically, so `10-api.md` comes before `2-setup.md` every single time.

That last one is merely cosmetic when you convert file by file, and it is a real bug when you concatenate before converting. Pad the numbers — `02-setup.md`, `10-api.md` — and the sort is correct for free, in the shell and in every other tool that will ever read that directory. For recursion, either `shopt -s globstar` and use `docs/**/*.md`, or use `find`, which needs no shell option and behaves the same everywhere.

If you are concatenating, `cat` is not enough. Plain `cat` leaves no blank line between files, so the last line of one joins the first line of the next into a single paragraph and a heading can end up glued to the text above it:

```bash
awk 'FNR==1 && NR>1 {print ""} 1' docs/*.md > all.md
```

One blank line inserted at the start of every file but the first. That is the whole fix, and it is worth knowing because the symptom — one missing heading in the middle of a long document — looks nothing like its cause.

### Keeping output next to input, without flattening the tree

`basename` is the wrong tool for a directory of directories, and it fails in the worst possible way. `docs/api/index.md` and `docs/guide/index.md` both become `index.html`, one silently overwrites the other, and the build succeeds with a page missing. Nothing warns you, and the file that survives is whichever the glob reached last.

Use parameter expansion, which keeps the path:

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"      # strip the leading docs/
  output="${output%.md}.html"       # swap the extension
  mkdir -p "$(dirname "$output")"   # the tree does not exist yet
  cmark-gfm -e table -e strikethrough "$file" > "$output"
done
```

`${file%.md}.html` swaps the extension without touching any directory names. `${file#docs/}` removes the source root, so the output tree mirrors the input tree rather than nesting inside a copy of it. `mkdir -p "$(dirname "$output")"` is the line everybody forgets, and its absence is a redirect failing on a directory that does not exist — which at least fails loudly.

One more thing about output paths. Relative links between your Markdown files are relative to the file, so a link to `../guide/index.md` only survives if the output tree has the same shape as the input tree, and only if you rewrite the `.md` extension in the link target as well. Flatten the tree and every internal link breaks at once, in a way that no converter flag can repair afterwards.

### Exit codes, and the pipeline that lied

A shell script's default behaviour is to keep going after a failure and then report success. One line fixes most of it:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

`-e` stops at the first failing command. `-u` turns an unset variable into an error rather than an empty string, which is what saves you from `rm -rf "$BUILD_DIR/"` on the day `BUILD_DIR` was never set. `-o pipefail` is the one that matters here, because a pipeline's exit status is the last command's by default:

```bash
cmark-gfm README.md | tee build/README.html   # reports what tee did
```

The converter can die on line one and `tee` will still exit zero, so the job is green and the file is empty. With `pipefail` the pipeline fails. Better still, do not pipe at all: a plain redirect keeps the converter's own status, and that is the version to reach for by default.

Then there are the tools whose idea of failure differs from yours. `curl` exits zero on an HTTP 404 or 429 unless you pass `-f`. Pandoc exits zero on warnings unless you pass `--fail-if-warnings`. `npx` without `--yes` does not fail at all — it waits for an answer that will never come. And a Node script that catches an error, logs it and returns normally exits zero, so set `process.exitCode = 1` in the `catch` or the script is lying to your CI.

Finally, check for the empty file, because several of these failures produce one rather than none:

```bash
[ -s "$output" ] || { echo "empty output: $output" >&2; exit 1; }
```

### Doing it in CI, where the install is the expensive part

Everything above assumes the converter is present. In CI it is not, and getting it there is usually the slowest thing in the job.

Three rules cover it.

**Pin the version, or the output changes without a commit.** `npx marked` uses a local install if there is one and otherwise fetches whatever is newest that morning, so the HTML your job produces can change while your repository does not. Install from a lockfile with `npm ci`. Pin an apt or brew version where the packaging allows it. Use a Docker tag rather than `latest`. Reproducibility is the only reason to put a conversion in CI at all, and an unpinned converter throws it away while looking like it works.

**Cache what you can, and prefer the thing that needs no cache.** A static binary — comrak, or your compiled Go programme — is one file to restore and no dependency resolution at all. A Docker image is one pull. A package manager install is a dependency graph resolved fresh on every run. Rank your options in that order and the answer is rarely the one the documentation implies.

**Keep the secret in the environment and out of the repository.** If the conversion is an API call, the key comes from the CI secret store into an environment variable, never from a config file somebody committed. `tp login` writes into a home directory the runner discards, which is exactly why `TP_API_KEY` exists.

The checklist, then, for a conversion step that runs unattended:

- [ ] Versions pinned in a lockfile and installed with `npm ci`, not `npm install`
- [ ] `npx` given `--yes`, so it never stops to ask permission to fetch a package
- [ ] `set -euo pipefail` at the top of every shell step
- [ ] `curl` given `-f`; Pandoc given `--fail-if-warnings`
- [ ] A non-zero exit treated as a failed job, not a warning in the log
- [ ] The output checked for existence and non-zero size before anything downstream trusts it
- [ ] The API key read from an environment variable, never a committed file

## How to choose

1. **Start from what is already installed.** If Pandoc is on the machine and in the image, use it and stop reading, because the install cost you were worried about is already paid. If the repository has Node and nothing else, adding a forty-format document converter to satisfy a five-line job is a maintenance burden you will still be carrying in two years.
2. **Decide whether the output has to open on its own.** If a person will double-click the file, you need a complete document with its styles inline, which means Pandoc with `--standalone --embed-resources`, or your own template. Every other tool here gives you a fragment, and a fragment emailed to a colleague renders as unstyled text at the full window width.
3. **Match the flavour to the file before you match the tool to the flavour.** If the documents have tables or task lists, the command must ask for GFM explicitly: `-f gfm` for Pandoc, `-e table` and friends for cmark-gfm, `--gfm` for comrak, `-x tables` for Python-Markdown. Convert one representative file and look at the tables before you commit the script, because a table that failed to parse does not raise an error.
4. **Decide about raw HTML before you convert somebody else's file.** For your own notes it does not matter. For a README from a fork, either the converter suppresses raw HTML by default — cmark-gfm and comrak do, and markdown-it escapes it — or you add a sanitiser, or you accept that whatever was in that file will run in the browser of whoever opens the output.
5. **Count the exit codes, not the features.** Whatever you pick, its failure has to reach the job's status. That means `pipefail`, a redirect rather than a pipe, `-f` on `curl`, `--fail-if-warnings` on Pandoc, and a size check on the output. A conversion step that cannot fail is a conversion step you will eventually stop trusting, and then stop reading.
6. **Time the install once, honestly.** Run the job with the converter install and again with it cached or removed. If the install dominates, replace it with a static binary, an image, or an API call, and put the measured numbers in the pull request so the next person does not have to argue it out again from first principles.

## Conclusion

Pick the smallest shape that answers the problem, then spend your care on the shell rather than on the parser. For HTML on disk that has to look finished, Pandoc with `-f gfm -s --embed-resources` is one line and the right line; for HTML on disk in a repository that already has Node, write the five-line script with its own template and own the wrapper. For a folder, quote your expansions, keep the tree, and set `-euo pipefail` so the job tells the truth about what happened. And for a link somebody can open with no toolchain of their own — nothing to install, nothing to pin, nothing to cache — a single request does it — once you have settled [what that request should look like, and what a conversion API owes a script when the file is broken](/blog/converting-documents-with-an-api) — and the same conversion runs [in the browser at transformpipe](/) free, with the file never leaving your machine when you are signed out.

## FAQ

### What is the simplest Markdown CLI converter to install?

comrak, if you count downloading one static binary as installing something, because there is nothing else to resolve and nothing left on the machine afterwards. If Node is already present, `npx --yes marked` or `npx --yes markdown-it` installs nothing permanent at all. Pandoc is the most capable and the largest, and it earns its size only when you need formats beyond HTML or exact control of the wrapper.

### How do I convert a whole folder of Markdown files at once?

Let the shell do the looping — none of these tools needs a batch mode. Use `find … -print0` piped into a `while IFS= read -r -d ''` loop so awkward filenames survive, build the output path with `${file%.md}.html` so the directory tree is preserved, and `mkdir -p` the destination before redirecting into it. Put `set -euo pipefail` at the top, or a failure halfway through will still report success.

### Why is my converted HTML unstyled?

Because the tool handed you a fragment, which is what most of these are designed to do. cmark-gfm, comrak, marked, markdown-it and `python -m markdown` all emit body content with no doctype, no head and no styles, and a browser renders that at its default font across the full window width. Either use Pandoc's `--standalone --embed-resources`, or write the wrapper once in a script and reuse it everywhere.

### Do these converters sanitise the HTML?

Some do and some deliberately do not, and you need to know which you have before you convert a file from outside. cmark-gfm and comrak suppress raw HTML unless you pass `--unsafe`; markdown-it escapes it unless you enable its `html` option; marked passes it through and documents that sanitising is not its job; Pandoc passes it through as well. Pandoc's `--sandbox` protects the converting machine, not the reader's browser.

### Why does my conversion succeed in CI but produce nothing?

Almost always a pipeline that hid the failure, or a converter that treats a failure as a warning. `cmark-gfm file.md | tee out.html` reports `tee`'s exit status, so a dead converter reads as success — use `set -o pipefail`, or redirect instead of piping. Then add `-f` to `curl` and `--fail-if-warnings` to Pandoc, and test the result with `[ -s "$output" ]` before anything downstream depends on it.

### Is Pandoc too slow for CI?

Pandoc's conversion is fast; the install is what costs you, and it costs you on every run rather than once. How much depends entirely on the method — a Docker image pull or a restored cache is quick, a package manager resolving dependencies from scratch is not — so measure your own pipeline rather than trusting anybody's published figure. If the install dominates the job, a single static binary or an HTTP call removes it altogether.

### Can I convert Markdown to HTML with no local install at all?

Yes, in two ways. Post the file to an HTTP API with `curl` and get JSON, an HTML file, or a live link back; or, on a pull request, use a GitHub Action so the runner never installs a converter in the first place. Both need a network and a secret, so keep a local converter in the build as well if it must also work offline.
