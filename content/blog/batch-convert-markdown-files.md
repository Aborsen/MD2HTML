---
title: How to convert multiple Markdown files at once, without lying to your build
description: Converting a folder of Markdown files: how far a glob reaches, where the output should land, xargs and ordering, skipping unchanged files, and honest exit codes
date: 2026-08-12
tag: Automation
keywords: convert multiple markdown files, batch convert markdown, convert folder of markdown files, markdown batch conversion, xargs markdown, makefile markdown to html, incremental markdown build, convert markdown in ci
---

Converting one Markdown file is a solved problem. Drop it on a page, or type one command, and you have HTML. Converting a hundred and forty of them, arranged in eleven directories, four of which nobody has opened since the migration, is a different job — and it is not the same job done a hundred and forty times.

The converter is almost never the part that breaks. What breaks is the glob that quietly skipped a subdirectory, the two `index.md` files that became one `index.html`, the parallel run whose log is four files interleaved, the build that reported success because only the last conversion was checked, and the seventeen-minute job that reconverted every file to change one paragraph.

Every one of those failures is silent. A Markdown table that failed to parse still produces HTML. A file the glob never reached produces nothing at all, and nothing looks exactly like nothing wrong.

### TL;DR

Let the shell find the files and let one small script convert one file, because a loop you can test on a single path is a loop you can debug. Use `find … -print0 | sort -z` rather than a bare `*.md` glob: a glob does not recurse unless you turn `globstar` on, it skips dotted directories, it hands the literal pattern to your converter when nothing matches, and it will hit the argument-length limit before a large repository does. Map the output path with parameter expansion so the tree keeps its shape — `basename` collapses `docs/api/index.md` and `docs/guide/index.md` onto the same file and the build still exits zero. Then decide two things deliberately: whether a failure on file forty stops the run or is collected and reported at the end, and whether you actually want many pages or one document, because merging is a different job with a different answer.

## Converting a folder is a different job

A single conversion has one input, one output and one result. A folder conversion has five decisions that do not exist for one file, and the default answer to each is wrong often enough to matter.

**Which files.** "All the Markdown in the repository" sounds unambiguous until you write it down. Does it include `node_modules`? The `.github` directory? `CHANGELOG.md` at the root? A vendored copy of somebody else's docs? The symlinked directory that points at a sibling checkout? Every one of those is a real answer to a real question and your glob is going to answer it for you, without saying so.

**In what order.** File order does not matter when each file becomes its own page. It matters completely when the files become one document, and it matters for reproducibility either way: a build whose log lists files in a different order on every run is a build you cannot diff.

**Where the output goes.** Beside the input, or in a separate tree. This is the decision people regret, because both work on the first run and only one of them survives a deletion, a rename or a relative link.

**What happens when one fails.** Two hundred files, one of them malformed. Stop, or carry on and report? Both are defensible. The default — carry on and exit zero — is not.

**How often.** A folder that changes once a week does not need reconverting nightly, and a folder converted in a pull request should probably only convert what the branch touched.

Note that none of this is about the converter. Which one you use is a separate question with [its own comparison](/blog/best-markdown-to-html-converters), and every approach below works with any of them, so long as the command takes an input path and an output path and tells the truth about its exit status.

## Quick comparison: the cheat sheet

| Approach | Best for | Runs in parallel | Can fail the build | Skips unchanged files |
| --- | --- | --- | --- | --- |
| `for` loop over a glob | A short script a person will edit next year | No | Yes, with `set -e`, at the first bad file | No |
| `find … -exec … +` | A tree of unknown depth and awkward names | No | Not reliably — the status is not the command's | No |
| `find -print0 \| xargs -0 -P` | Hundreds of files, and wall-clock time | Yes | Yes — exit 123 if any file failed | No |
| GNU parallel | Parallel work whose output must stay ordered | Yes | Yes, with `--halt now,fail=1` | No |
| `make` with a pattern rule | A folder where most files did not change | Yes, with `make -j` | Yes, stops at the first failed recipe | Yes, by modification time |
| A Node or Python script | Output you control, wrapper and all | Yes, with a concurrency limit | Only if you set the exit code yourself | Only if you implement it |
| One API or CLI call per file | A runner with no toolchain and no install | Yes, until the rate limit | Yes, per call | No |
| A static site generator | Navigation, search and cross-document links | Internally | Yes | Usually, through its own cache |

All of them are free. The shell tools are already on the machine; the rest carry the licences noted in each section below.

## Every way to run a conversion over a folder

### A `for` loop over a glob — best for a script somebody will read again

The shortest thing that works, and the version to write first, because you can read it out loud.

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"
  output="${output%.md}.html"
  mkdir -p "$(dirname "$output")"
  bin/one.sh "$file" "$output"
done
```

| Pros | Cons |
| --- | --- |
| Readable, and obvious what it will do | Sequential: the wall-clock time is the sum of every file |
| `set -e` makes the first failure the last thing that happens | `globstar` is a bash option, so `sh script.sh` changes the behaviour |
| No dependency beyond the shell | Skips dotted directories unless you also set `dotglob` |
| Quoting is under your control, in one place | A glob big enough to exceed the argument limit fails here too |

**Price:** free; bash is GPL licensed and already installed.

**Technical details**

- `shopt -s globstar` makes `**` match across directory separators; without it `**` behaves exactly like `*` and your subdirectories are skipped in silence
- `shopt -s nullglob` makes an empty match expand to nothing, instead of handing the literal string `docs/**/*.md` to the converter as a filename
- `${file#docs/}` strips the source root; `${output%.md}.html` swaps the extension without touching directory names
- Run the script with `bash script.sh`, never `sh script.sh` — `shopt` is not portable and a dash-provided `sh` will refuse it

**Who is it for?** Repositories with tens of files, and anybody whose first requirement is that the next person can change the script without reading a manual page.

### `find … -exec … +` — best for a tree of unknown depth

`find` needs no shell option to recurse, behaves the same in every shell, and does not care what is in the filenames.

```bash
find docs -type f -name '*.md' -exec bin/one.sh {} +
```

| Pros | Cons |
| --- | --- |
| Recursion, filtering and pruning in one expression | The exit status question is genuinely murky |
| Passes names as arguments, so spaces and quotes survive | `-printf` and other useful primaries are GNU-only |
| `+` batches arguments, so it will not exceed the length limit | Directory order, not sorted order |
| `-prune` excludes a whole subtree cheaply | The script has to derive the output path itself |

**Price:** free; GNU findutils is GPL licensed, and a BSD `find` ships with macOS.

**Technical details**

- `-type f` excludes directories that happen to end in `.md`, which is rarer than a symlink to one but not rare enough to ignore
- `-exec cmd {} +` passes as many paths per invocation as fit; `-exec cmd {} \;` runs one process per file, which is slower and easier to reason about
- With `-exec … \;` a failing command does not change `find`'s own exit status at all, so a job built that way cannot report a conversion failure. GNU `find` documents a non-zero status when a command run with `+` fails, and implementations differ — which is the reason to move the status question to `xargs`, where it is written down
- `find docs -name node_modules -prune -o -type f -name '*.md' -print` is the idiom for excluding a subtree; `-not -path '*/node_modules/*'` gets the same result but still walks the whole thing
- `find` does not follow symlinks unless you pass `-L`, and passing `-L` on a tree with a link to its own parent will loop until it hits the depth limit

**Who is it for?** Any tree deeper than one level, and any repository where you do not personally control the filenames.

### `find -print0 | xargs -0 -P` — best when the count runs to hundreds

The standard way to make a folder conversion finish in a fraction of the time, and the point at which you stop being able to read the log top to bottom.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 8 -n 1 bin/one.sh
```

| Pros | Cons |
| --- | --- |
| Real parallelism from one flag | Output from concurrent jobs interleaves, line by line |
| A documented aggregate exit status: 123 if any file failed | `xargs` execs directly, so no redirection or globbing in the command |
| NUL separation, so every legal filename survives | Ordering guarantees are gone unless you sort first and print later |
| `-n` controls the batch size, which matters for small files | The failure list has to be collected out-of-band |

**Price:** free, GPL licensed, part of findutils.

**Technical details**

- `-print0` and `-0` use NUL as the separator, the one byte a filename cannot contain — a newline in a filename is legal and will otherwise split one path into two
- `sort -z` sorts NUL-separated records; `find`'s own order is directory order, which is not sorted and is not stable between machines. Add `LC_ALL=C` if you want the same order on a runner as on your laptop
- `xargs` exits 123 if any invocation exited between 1 and 125, 124 if one exited 125, 125 if one was killed by a signal, 126 if the command could not be run and 127 if it was not found. Those five codes are the whole error-reporting protocol, so make your script exit non-zero and let the aggregate speak
- `-P 0` runs as many processes as it can; `-P "$(nproc)"` is the usual choice on Linux, and macOS wants `sysctl -n hw.ncpu` instead
- `xargs` does not run a shell. `xargs -0 cmd > out.html` redirects the whole run into one file, not one file per input; if you need a redirect, put it in the script
- `-n 1` starts one process per file. For a thousand small documents, process startup dominates the actual conversion, and `-n 20` with a script that loops over `"$@"` is measurably better — measure your own tree rather than trusting a ratio

**Who is it for?** Documentation sets in the hundreds, and any build where the conversion has become the slow step.

### GNU parallel — best when parallel output still has to be ordered

`parallel` is `xargs` with the ergonomics filled in: ordered output, a failure policy, a dry run, and a progress display.

```bash
find docs -type f -name '*.md' -print0 \
  | parallel -0 -k --halt now,fail=1 bin/one.sh {}
```

| Pros | Cons |
| --- | --- |
| `-k` buffers each job and prints in input order | Another install, and it is not present by default |
| `--halt now,fail=1` stops the run at the first failure | Its quoting and replacement syntax is a language of its own |
| `--dry-run` prints the commands without running them | Buffering to keep order costs memory and disk |
| `--joblog` records the status and duration of every job | Overkill when nothing reads the standard output |

**Price:** free, GPL licensed.

**Technical details**

- `-k` (`--keep-order`) is the flag that separates it from `xargs`: jobs still run concurrently, output is still readable
- `--halt` takes a policy — stop now or when the current jobs finish, on a count or a percentage of failures
- `--joblog FILE` is the honest answer to "which file failed": a table with the exit status of each job, which you can grep after the run instead of reading the log
- `{.}` strips the extension from the replacement string, `{//}` gives the directory — useful, and one more dialect to remember
- It prints a request to cite it in academic work, which is not a licence restriction but does surprise people the first time it appears in a build log

**Who is it for?** Builds where the conversion prints something a human reads, and anybody who wants a per-job status table without writing one.

### `make` with a pattern rule — best when most files have not changed

The only tool on this list that was designed for exactly this problem: a set of outputs derived from a set of inputs, rebuilt when the input is newer.

```make
MD  := $(shell find docs -type f -name '*.md')
OUT := $(patsubst docs/%.md,build/%.html,$(MD))

build/%.html: docs/%.md tools/wrapper.html
	@mkdir -p $(@D)
	bin/one.sh $< $@

.PHONY: all clean
all: $(OUT)

clean:
	rm -rf build
```

| Pros | Cons |
| --- | --- |
| Converts only what changed, with no cache of your own | Recipes must be indented with a tab, forever |
| `make -j8` parallelises for free, respecting dependencies | Filenames with spaces are effectively unsupported |
| A changed template invalidates every output, correctly | Modification times are wrong in a fresh clone |
| `make clean` and `make one/file.html` come free | The syntax is unlike anything else in the repository |

**Price:** free; GNU make is GPL licensed.

**Technical details**

- `tools/wrapper.html` on the right of the colon is the part people leave out. Without it, editing the template changes nothing, because every output is still newer than its own Markdown
- `$(@D)` is the output's directory, so `mkdir -p $(@D)` creates the tree as it goes
- `$(shell find …)` runs each time make is invoked, so a newly added file is picked up without touching the Makefile
- `make -j` with no number runs unlimited jobs, which on a large tree will start hundreds of processes at once; give it a number
- Adding the converter itself as a prerequisite — a lockfile, a pinned binary, a version stamp file — makes an upgrade rebuild everything, which is what you want and what nobody does

**Who is it for?** Repositories where the docs tree is large and mostly static, and where a full conversion takes long enough that somebody has noticed.

### A Node or Python script — best when you want the wrapper too

At some point the shell stops being the right place: you want the output document's `<title>` to come from the file's frontmatter, or a table of contents, or a link rewritten from `.md` to `.html`. That is a programme, not a pipeline.

```js
// convert-all.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import fg from 'fast-glob';
import pLimit from 'p-limit';

const files = await fg('**/*.md', { cwd: 'docs', dot: false, absolute: true });
const limit = pLimit(8);
const failures = [];

await Promise.all(
  files.map((file) =>
    limit(async () => {
      try {
        const output = resolve('build', relative(resolve('docs'), file)).replace(/\.md$/, '.html');
        await mkdir(dirname(output), { recursive: true });
        await writeFile(output, render(await readFile(file, 'utf8')));
      } catch (error) {
        failures.push(`${file}: ${error.message}`);
      }
    })
  )
);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
```

| Pros | Cons |
| --- | --- |
| The output is a document you designed, not a fragment | You own it, bugs included |
| Frontmatter, titles and link rewriting are all reachable | A dependency tree to pin and audit |
| Failures collect into one list rather than one line of log | Concurrency is yours to bound |
| Runs the same on every platform, which the shell does not | Slower to start than a C or Rust binary |

**Price:** free; `fast-glob` and `p-limit` are MIT licensed.

**Technical details**

- `pLimit` is not optional. `Promise.all` over three thousand files opens three thousand file handles and the process dies with `EMFILE`, which reads as a corrupted filesystem and is not one
- `process.exitCode = 1` rather than `process.exit(1)`, so pending writes finish before the process leaves
- `dot: false` is the default in most glob libraries, which means `.github/CONTRIBUTING.md` is invisible until you say otherwise — the same trap the shell sets, in a different place
- Collecting failures and reporting at the end is a choice: it converts everything and still fails the job. The alternative, throwing on the first error, leaves the output tree half written

**Who is it for?** Any repository where the HTML has to look finished, and any conversion that needs to know something about the document rather than just its bytes.

### One API or CLI call per file — best when nothing is installed

If the runner has no converter and you are not going to give it one, the loop is the same shape and the body is a network call. TransformPipe's dependency-free CLI is one example; a `curl` post to any conversion API is the same idea with more flags.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 4 -n 1 -I {} tp push {} --share --json
```

| Pros | Cons |
| --- | --- |
| No converter to install, pin or cache | Needs the network, so it cannot be your offline build |
| Each file comes back as a link somebody can open | Needs a secret in the environment |
| Conversion behaviour cannot drift with a local install | Rate and size limits apply per key |
| The same conversion in CI as on a laptop | One document per file adds up against the account limit |

**Price:** free; converting and downloading need no account at all, and an account adds history, sharing and the API within the limits below (checked on transformpipe.com, 8 September 2026).

**Technical details**

- The published limits are the ones to plan against: 10 MB for a file to convert, 4 MB for a document kept in an account, 100 MB and 500 documents per account, and 60 requests a minute counted per key (checked on transformpipe.com/docs, 8 September 2026)
- That rate limit is the reason `-P 4` and not `-P 32`. Eight parallel workers on a fast connection will clear sixty requests in well under a minute and start collecting 429s, and a 429 is a failure your script has to treat as one
- `--retry 3 --retry-connrefused` on `curl`, or a sleep between batches, covers the transient failure that would otherwise break one build a month
- If you are posting with `curl` rather than a CLI, `-f` is load-bearing: without it `curl` exits zero on a 401 or a 429 and writes the error body into your output file
- A hundred files means a hundred documents and a hundred links. That is usually not what anybody wanted, which is the subject of a later section

**Who is it for?** Locked-down runners, and pipelines whose output is a set of links rather than a set of files. For a pull request specifically, [an action does the same thing with no install on the runner](/blog/publish-markdown-from-github-actions).

### A static site generator — the answer when "many files" means "a site"

Hugo, Eleventy, MkDocs, Docusaurus and Jekyll all convert directories of Markdown to HTML, and none of them is a batch converter. They are build systems, and the difference shows up in what they give you back.

| Pros | Cons |
| --- | --- |
| Navigation, search, cross-links and an index page | A configuration file, a theme and a build step to maintain |
| Their own incremental builds and watch modes | The output is a site, not a set of documents you can email |
| Link checking and taxonomy across the whole set | Enormous overhead for forty files nobody browses |
| Deployment is a solved problem for all of them | The theme decides what your pages look like |

**Price:** free, all of them open source.

**Who is it for?** Anybody publishing documents that link to each other and need to be found. If your reader arrives with a URL you gave them and leaves after one page, you do not need a generator.

## The six things that break on a folder and not on a file

Every failure below has been diagnosed as a converter bug by somebody. None of them is one.

### How deep a glob goes, and what it drops

`docs/*.md` does not recurse. This is the single most common batch conversion bug, and it is invisible: the job converts the nine files at the top of the tree, exits zero, and the forty in subdirectories are simply not mentioned. Nothing warns you, because nothing knows what you meant.

Bash needs `shopt -s globstar` before `**` crosses a directory separator; without it, `docs/**/*.md` is exactly `docs/*/*.md` — one level down, no more and no less. zsh has recursive `**` without an option, which is why a line copied from a colleague's zsh history behaves differently in your bash script and neither of you can see why.

Then there are the files a glob will not match on principle:

| What is skipped | Why | The fix |
| --- | --- | --- |
| `.github/CONTRIBUTING.md` | Globs do not match a leading dot | `shopt -s dotglob`, or name the path |
| `docs/api/reference.md` | `*` does not cross `/` | `globstar` and `**`, or `find` |
| `README.MD` | Case-sensitive match on Linux, not on macOS | `find … -iname '*.md'` |
| `notes.markdown` | A different extension is a different pattern | `-name '*.md' -o -name '*.markdown'` |
| Everything, when nothing matches | Bash passes the pattern through as a literal | `shopt -s nullglob` or `failglob` |
| Nothing at all, in `node_modules` | The glob was too generous | `-prune`, before the walk gets there |

The last row is the opposite failure and it is worse than it looks. A `**/*.md` at the repository root reaches every vendored README in every installed package, and a batch conversion that starts producing HTML for a dependency's changelog is one that will be quietly deleted a week later.

There is also a hard limit. Every path a glob expands to becomes an argument, and the total size of the argument list is capped by the kernel — `getconf ARG_MAX` prints the number. A repository large enough to exceed it fails with `Argument list too long`, which is a real error message that sounds like a bug in your script. `find … -exec … +` and `xargs` both batch arguments to stay under the limit, and neither expands anything in the shell, which is why every example above pipes rather than globs once the count is unknown.

Symlinks deserve one sentence of deliberate thought rather than a default. Whether a shell's `**` descends through a symlinked directory has varied between releases and differs between shells, so if your tree contains links — a `docs/shared` pointing at a sibling checkout is a common arrangement — use `find` and decide explicitly, with `-L` or without it. Guessing means the same repository converts a different set of files on two machines.

### The order the files arrive in

`find` returns entries in directory order. Directory order is whatever the filesystem hands back, it is not sorted, and it is not the same on two machines with the same files. For a conversion where each file becomes its own page, that is harmless. It stops being harmless in three places.

Logs stop being diffable. When a build's file list is in a different order every run, you cannot compare two runs to see what changed, and the first thing you want when a nightly job breaks is exactly that comparison.

Parallel scheduling becomes non-reproducible. With eight workers and no sorting, which files share a worker changes between runs, and so does which one hits the rate limit.

And concatenation becomes wrong rather than merely untidy. The moment several files become one document, order is content. Even sorted, `10-api.md` comes before `2-setup.md`, because a lexical sort is not a numeric one. Pad the numbers — `02-setup.md`, `10-api.md` — and every tool that ever reads that directory gets the order right for free.

```bash
find docs -type f -name '*.md' -print0 | LC_ALL=C sort -z
```

`LC_ALL=C` matters more than it looks. Sort order depends on the locale, so a name with an accent or a leading underscore can sort differently on a runner than on your laptop, and the whole point of pinning the order was to stop that happening.

### Beside the input, or in its own tree

There are two answers and they are not equivalent.

| | Output beside the input | Output in a separate tree |
| --- | --- | --- |
| Relative links between documents | Keep working unchanged | Work only if the tree shape is preserved |
| Images with relative paths | Resolve as they did before | Need copying or embedding |
| Cleaning up | Delete files matching a pattern, carefully | `rm -rf build` |
| A deleted `.md` | Leaves an orphan `.html` behind, indefinitely | Vanishes on the next clean build |
| Version control | `.gitignore` entries that fight the source files | One ignored directory |
| Reviewing the change | Generated HTML in every diff | Nothing generated in the diff |
| Deploying | Ship the whole repository, or filter it | Point the host at one directory |

Beside the input wins on links and images, and loses on everything else. The orphan row is the one that decides it for most people: nothing in a beside-the-input scheme notices that `docs/old-api.md` was deleted, so `docs/old-api.html` stays on disk, gets committed, gets deployed, and is still being served to somebody a year later. A separate tree that is deleted and rebuilt cannot have that problem, because the answer to "which outputs are stale" is "all of them, every time".

If you do use a separate tree, keep its shape, and use parameter expansion rather than `basename` to do it. `basename` is the wrong tool here and it fails in the worst possible way: `docs/api/index.md` and `docs/guide/index.md` both become `index.html`, the second silently overwrites the first, the build exits zero, and which page survives depends on the order the files arrived in — which, per the section above, is not fixed.

The link rewriting is the part that has no shell solution. A link to `../guide/index.md` in your Markdown survives conversion only if the output tree mirrors the input tree and the `.md` in the target is rewritten to `.html`. Converters do not do that by default; most leave the link exactly as written, pointing at a file that is no longer next to the page. That is a programme, not a pipeline — and [what breaks when a document moves](/blog/images-and-links-that-still-work) applies to every image path in the folder as well.

### Parallelism, and the ordering you give up

Conversion is a small amount of work per file and a process launch per file. That makes it close to the ideal parallel workload, and the speed-up from `-P` is real. What you trade for it is every ordering guarantee you had.

Standard output interleaves. Not per job — per write. Two converters printing a three-line warning at the same moment produce six lines in an order neither of them chose, and a log like that cannot be read. If the jobs print anything, either use `parallel -k`, or have each job write its own log file and concatenate them afterwards in sorted order.

Shared state does not work the way it looks like it does. Each `xargs` invocation is a separate process, so a counter incremented inside the loop is incremented in a subshell and is gone. Appending failures to a shared file works but needs care about interleaving; the version with nothing to think about is one small file per failure in a directory, counted at the end:

```bash
# in bin/one.sh
if ! convert "$1" "$2"; then
  mkdir -p build/.failed
  printf '%s\n' "$1" > "build/.failed/$(printf '%s' "$1" | tr / _)"
  exit 1
fi
```

More workers is not monotonically better. Past the point where the CPUs are busy, extra processes add contention and nothing else; and if the body of your loop is a network call, extra workers add 429s. Four concurrent requests against a limit of sixty a minute is comfortable. Thirty-two is a rate-limit test with a build attached.

The batch size is the parameter people forget. `-n 1` starts one process per file, and for small documents the process launch can cost more than the conversion. A script that loops over `"$@"` and is invoked with `-n 20` starts a twentieth as many processes. Whether that helps depends on your files and your converter, so time both — and time them twice, because the first run reads cold and the second reads from the page cache, which is a difference big enough to reverse a conclusion.

### The files that have not changed

Reconverting a hundred and forty files to fix one typo is defensible on a laptop and indefensible in a job that runs on every push. There are three ways to skip the unchanged ones, and they fail differently.

**Modification time.** This is what `make` does, and inside a working copy it is exactly right: edit a file, its mtime moves, the rule fires. The trap is that git does not record modification times. A fresh clone or a cache-miss checkout stamps every file with the time of the checkout, so on a CI runner every file looks newer than every output and the whole tree rebuilds. Mtime-based incremental builds work locally and do nothing at all in CI unless the output directory is also restored from a cache, and the restored outputs then carry their own timestamps — which is a second thing to get right.

**Content hash.** Slower to compute and correct everywhere, including a fresh clone. Store the input's hash beside the output and compare before converting:

```bash
# in bin/one.sh — $1 is the .md, $2 is the .html
stamp="$2.sha256"
now="$(sha256sum "$1" | cut -d' ' -f1)"

if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$now" ] && [ -s "$2" ]; then
  exit 0
fi

convert "$1" "$2" && printf '%s\n' "$now" > "$stamp"
```

`sha256sum` is GNU coreutils; macOS wants `shasum -a 256`. The `[ -s "$2" ]` test is there because a hash that matches an output file of zero bytes is a cache entry for a failed run, and a cache that remembers failures is worse than no cache.

**Ask git what changed.** The cheapest of the three when the answer is small, and the only one that scales to a large monorepo:

```bash
git diff --name-only --diff-filter=ACMR origin/main...HEAD -- '*.md'
```

`--diff-filter=ACMR` excludes deletions, so a removed file does not become a path your converter is asked to open. It needs history — a shallow clone has no base commit to diff against — which is the trade: `fetch-depth: 0` costs checkout time on a repository with years of commits.

Whichever you pick, one rule applies to all three: the cache key has to include everything the output depends on, not just the Markdown. Change your HTML wrapper, your stylesheet, or the converter's version, and every output is stale while every input is unchanged. Hash the template into the stamp, add it as a prerequisite in the Makefile, or accept that the first person to edit the stylesheet will spend an afternoon wondering why the page has not changed.

### Exit codes, and what "it worked" means for two hundred files

For one file, success is unambiguous. For two hundred, "did it work" has three possible answers and you have to choose one before the script is written.

**Stop at the first failure.** `set -euo pipefail` and a plain loop. The output tree is left half converted, which is fine if it is a build directory you delete anyway, and the log ends at the file that broke — which is the fastest possible diagnosis.

**Convert everything, fail at the end.** More useful when a person is waiting, because one run tells you about all six broken files instead of the first one. It needs an explicit accumulator, because `set -e` will otherwise end the run:

```bash
failed=0
for file in docs/**/*.md; do
  bin/one.sh "$file" "$(output_for "$file")" || failed=$((failed + 1))
done

if [ "$failed" -gt 0 ]; then
  echo "$failed files failed" >&2
  exit 1
fi
```

Note the `|| failed=$(…)`. Without it, `set -e` fires on the first bad file and the accumulator never runs. With it, the loop cannot fail — so the explicit `exit 1` at the end is the only thing making the job honest, and deleting that block by accident produces a build that always passes.

**Let the parallel runner aggregate.** `xargs` gives you 123 when any job failed, `parallel --joblog` gives you a table of which. Both are fine, and both depend on your per-file script actually exiting non-zero, which is the part that goes wrong: a converter that writes an error to standard error and exits zero, a `curl` without `-f`, or a script that catches an exception, logs it and returns normally.

Three checks are worth adding regardless of which shape you chose:

- [ ] Every output exists and is non-empty — `[ -s "$output" ]`, because several failure modes produce a zero-byte file rather than none
- [ ] The output count matches the input count, printed at the end of the run, because a glob that quietly skipped a directory shows up here and nowhere else
- [ ] The whole run is under `set -euo pipefail`, and any converter behind a pipe is either redirected instead or covered by `pipefail`

That second one is the cheapest useful assertion in the whole pipeline. `find docs -name '*.md' | wc -l` against `find build -name '*.html' | wc -l` is one line, and it catches the failure that no exit code will ever report: the file that was never converted because nothing ever looked at it.

## Doing it in CI without converting the whole tree

The install cost of a converter is [a question the command line piece takes properly](/blog/markdown-to-html-from-the-command-line). The batch-specific question is different: which files, and how the outputs get out.

Convert the whole tree on the default branch, and only the changed files on a pull request. The full run is your guarantee that the tree is convertible; the branch run is the fast feedback, and it needs `fetch-depth: 0` so the diff has a base to compare against. Add a `paths` filter on `**.md` so the job does not run at all for a pull request that only touched code.

If the outputs are worth keeping, upload them as an artefact rather than committing them. Generated HTML in a pull request makes every review twice as long and every merge a conflict, and the artefact expires on its own.

If you do commit generated HTML — some repositories serve it directly, and that is a legitimate arrangement — add the check that makes it safe:

```bash
npm run build:docs
git diff --exit-code -- build/
```

`--exit-code` makes an uncommitted regeneration fail the job. Without it, the committed HTML drifts from the Markdown one hurried merge at a time, and nobody finds out until a reader notices the page contradicts the source.

Cache on a key derived from the inputs — GitHub Actions has `hashFiles('**/*.md')` for exactly this — and remember to include your template and your lockfile in the key. A cache keyed only on the Markdown will serve you stale HTML after a stylesheet change, which is the most confusing possible outcome and the hardest to attribute.

Two smaller things. Shard with a matrix only when the conversion is genuinely the slow step: eight parallel jobs each with its own checkout and install often takes longer in total than one job with `xargs -P 8`. And keep the runner's shell explicit — GitHub Actions runs `bash -e {0}` for a `run` block, which is not the same as your login shell, and `shopt` settings do not carry between steps.

## One document out of many, or many out of many

Halfway through building a folder converter, most people discover they wanted something else. "Convert these forty files" splits into two requirements that look alike and are not.

| | Forty pages | One document |
| --- | --- | --- |
| What you send someone | Forty links, or a directory | One link, or one file |
| Navigation | Whatever links the documents already had | A table of contents you generate |
| Heading levels | Each file's own `#` is the page title | Every heading has to be demoted a level |
| Anchor ids | Duplicates across files are harmless | `#installation` in four files collides |
| Ordering | Cosmetic | Content — the wrong order is a wrong document |
| Search | The reader's site search, if there is one | The browser's find, which is often enough |
| Size | Each page is small | One file, and a size cap to think about |
| Stale content | One page per source file, deleted with it | Regenerate the whole thing or it is wrong |

If the reader is going to read the set, you want one document, and the conversion is the easy half. Concatenating Markdown is not `cat`: plain `cat` glues the last line of one file to the first of the next, headings need demoting so the second file's `#` does not become another page title, and anchors need disambiguating. [Turning a folder into one document](/blog/merging-many-markdown-files) covers the order, the heading levels and the anchor collisions, and it is worth reading before you write the loop rather than after.

There is one practical cap on the merged answer: a document large enough is a document nobody can open. Browsers cope with a few megabytes of HTML and stop being pleasant well before the limits any converter imposes — the converter behind this site refuses a file over 10 MB to convert and a stored document over 4 MB (checked on transformpipe.com/docs, 8 September 2026), which in Markdown is a very long book. If your merged output is near either number, the honest answer is not a bigger file, it is a set of pages with navigation, which is a generator.

## Where a folder loop stops being the answer

The loop is the right tool for a bounded set of documents whose only relationship is that they live in the same directory. Four things break that, and each has a cost worth naming before you spend a week on a build script.

**Documents that link to each other.** The moment `docs/api.md` links to `docs/guide.md`, a plain converter produces a page whose links point at `.md` files that are not there. Rewriting them means parsing the Markdown, resolving the target, checking it exists, and rewriting the extension — and checking it exists is where you discover the four links that were already broken. That is not a flag on any converter. It is a real programme, and a site generator has already written it.

**A reader who arrives without a URL.** A folder of pages has no index, no search and no navigation. If somebody has to find the right document rather than being sent it, you are building a site, and doing it with a shell script means reimplementing a generator badly, one requirement at a time. The cost of admitting that early is a configuration file. The cost of admitting it late is a build script only one person understands and nobody will touch after they leave.

**Files whose output should not exist.** Drafts, templates, partials, the `_includes` directory, the archived section somebody kept "for reference". A glob has no opinion about any of them, so they all become pages, and some of those pages will be found by a search engine before they are found by you. Excluding them means a list of exceptions, in the script, maintained by hand, which is exactly the configuration file you were avoiding.

**A tree that changes shape.** The loop encodes the shape of the tree in its path expressions. Reorganise the directories and every output URL changes, every link somebody saved breaks, and there is nothing to redirect from because nothing recorded what the old paths were. A converter cannot fix this and a generator only helps a little; the actual answer is to decide the output paths deliberately and keep them stable even when the source moves.

None of that argues against the loop for the case it fits: a set of documents, converted for people who will be given the links. It argues against growing one into a publishing system by accident, which is the usual way a fifteen-line script becomes four hundred lines nobody can delete.

## How to choose

1. **Count the files, then count them again in a year.** Under twenty, a `for` loop with `set -euo pipefail` is the whole answer and anything more is a hobby. Over a few hundred, you need `find`, NUL separation and `-P`, because the argument limit and the wall-clock time both become real rather than theoretical.
2. **Decide beside-or-separate before you write a line.** A separate tree costs you relative links and image paths and gives you a clean build, a deletable output and a diff without generated files in it. Choosing it later means moving every output and fixing every link at once, under time pressure.
3. **Write the single-file conversion as its own script first.** If `bin/one.sh input.md output.html` is correct and exits non-zero when it fails, every approach on this page is a one-line change and you can test the hard part without a folder. If the conversion logic lives inside the loop, you cannot test it at all.
4. **Pick your failure policy explicitly, and make the job prove it.** Stop at the first bad file, or convert everything and exit non-zero at the end — either is fine, and the default of "carry on and report success" is what puts a half-built docs tree into production. Then add the output count assertion, because no exit code will ever tell you about the directory the glob never entered.
5. **Only add incremental conversion when the full run is genuinely too slow, and key it on content.** Mtime works on a laptop and silently does nothing in CI, so a hash stamp is the version that survives a fresh clone. Include the template and the converter version in the key, or an upgrade will leave you serving output from the old one.
6. **Ask whether the answer is one document.** If the recipient is going to read the whole set, forty links is a worse deliverable than one page, and the work moves from the loop to the merge. That is a different problem with different failure modes, and finding out afterwards means writing the script twice.

## Conclusion

A batch conversion is a small amount of converting wrapped in a large amount of bookkeeping, and the bookkeeping is where the defects live: the glob that reached nine files out of forty-nine, the output path that collapsed two pages into one, the parallel run whose failures went to a subshell, the cache that remembered a stylesheet it had never seen. Write the one-file conversion as a script that exits honestly, drive it with `find` and NUL separation so the file set is knowable and stable, keep the output in a tree you can delete, and assert the output count at the end so a missing directory is a failed build rather than a page nobody notices is gone. Then, when the set turns out to be one document rather than forty, you will have kept the two jobs separate — and when it is genuinely a single file that has to look finished, [converting one in the browser](/) is free, needs no install, and uploads nothing while you are signed out.

## FAQ

### How do I convert multiple Markdown files at once from a terminal?

Let the shell enumerate and let one script convert one file: `find docs -type f -name '*.md' -print0 | sort -z | xargs -0 -P 8 -n 1 bin/one.sh`. Build the output path inside the script with `${file%.md}.html` so the directory tree keeps its shape, and `mkdir -p` the destination before writing. Put `set -euo pipefail` at the top of the script and let `xargs` return 123 if any file failed.

### Why did my batch conversion skip files in subdirectories?

Because `docs/*.md` does not recurse and `**` only crosses directory separators when bash's `globstar` option is on. Without `shopt -s globstar` the pattern `docs/**/*.md` matches exactly one level down, and every deeper file is skipped without any error at all. Use `find` instead, or set the option, and compare the input and output counts at the end of the run.

### Can I convert a folder of Markdown files in parallel?

Yes — `xargs -0 -P 8`, GNU `parallel`, or `make -j8` all do it, and the speed-up is real because most of the cost is process startup rather than parsing. What you lose is ordering: concurrent jobs interleave their output line by line, and a counter incremented in the loop lives in a subshell and disappears. Use `parallel -k` if the output must stay ordered, and write one small file per failure instead of appending to a variable.

### How do I skip Markdown files that have not changed?

`make` with a pattern rule does it by modification time and needs no cache of your own, but git does not store mtimes, so in a fresh CI checkout everything looks new and the whole tree rebuilds. A content hash stored beside each output works everywhere, including a fresh clone. Whichever you use, include the HTML template and the converter version in the key, or a stylesheet change will leave every page stale.

### Should the HTML go next to the Markdown or into a separate folder?

A separate tree, in almost every case: you can delete it, it keeps out of your diffs, and a deleted Markdown file cannot leave an orphan page behind. Output beside the input is only clearly better when relative links and image paths between documents have to keep working untouched. If you do use a separate tree, mirror the directory structure — `basename` will collapse two `index.md` files into one output and exit zero while doing it.

### Why does my build pass when some conversions failed?

Because nothing checked. A shell loop keeps going after a failure and exits with the status of the last command, a pipeline reports the last stage rather than the converter, and several tools treat an error as a warning — `curl` exits zero on a 429 without `-f`. Use `set -euo pipefail`, redirect rather than pipe, and add an explicit `exit 1` after counting failures.

### Is it better to convert forty files or merge them into one?

It depends entirely on the reader. Forty pages suit someone who arrives with a link to one of them; one document suits someone who is going to read the set, and it is one link rather than forty. Merging is not concatenation, though — heading levels need demoting and duplicate anchors need disambiguating — so treat it as a separate job rather than a flag on the loop.
