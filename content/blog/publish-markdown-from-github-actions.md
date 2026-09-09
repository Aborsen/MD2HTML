---
title: Publishing Markdown from a pull request with GitHub Actions
description: Render the Markdown a pull request changed and comment one link: the workflow line by line, why a fork gets no secrets, and what each alternative costs
updated: 2026-09-09
date: 2026-08-26
tag: Automation
keywords: github action markdown, github actions render markdown, markdown preview pull request, pull request documentation preview, ci markdown, convert markdown in ci, pull_request_target security, sticky pull request comment, github actions concurrency, publish markdown from ci
---

A pull request that rewrites a paragraph shows a red line, a green line, and a lot of moved wrapping. You can see which words changed. You cannot see whether the section still reads well, whether the table lines up, or whether the numbered list restarts at one halfway down. Reviewing prose in a diff is guesswork.

The people whose approval the document actually needs are often the ones least equipped to read a diff. A lawyer checking terms, a support lead checking a runbook, a designer checking the words in a flow: they open the Files changed tab, meet a wall of red and green with the wrapping moved, and reply that it looks fine. That is not a review, and nobody involved is at fault.

The fix is small. On every pull request, render the Markdown it changed, publish each file, and post the links in a comment. The reviewer clicks and reads the document. Nothing in the repository changes.

### TL;DR

Trigger on `pull_request` with a `paths` filter, give the job a concurrency group so two pushes a minute apart do not race, declare `contents: read` and `pull-requests: write` and nothing else, and guard the publishing step with an `if` so a pull request that changed no Markdown does nothing at all. Finding what changed means diffing against the base commit, which means the full history — `fetch-depth: 0` — or an action that asks GitHub's API for the list instead. Post one comment and update it in place rather than adding one per push. And know the one limit you cannot configure away before you build on it: a pull request from a fork gets a read-only token and no secrets, deliberately, so fork previews either do not happen or happen without your key — and `pull_request_target`, the trigger that lifts the restriction, is the one that gets repositories compromised.

## Check what GitHub already does

Before adding a workflow, see whether you need one. Commits and pull requests that include prose documents can be shown in a source view or a rendered view, and the button that toggles between them sits in the header of the file — so the Files changed tab will render a changed Markdown file instead of diffing its text (checked on docs.github.com, 9 September 2026). The rich-diff toggle, in the name most people use for it. For one small file, reviewed by people who already have the pull request open, that is enough.

It stops being enough when the change spans several files, when the reader has no GitHub account — a lawyer checking terms, a customer reading release notes — or when you want a link that still shows what the branch said last Tuesday.

## The workflow, line by line

Copy this into `.github/workflows/markdown-preview.yml`:

```yaml
name: Markdown preview

on:
  pull_request:
    paths:
      - '**.md'

concurrency:
  group: markdown-preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - id: publish
        uses: Aborsen/MD2HTML@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}

      - if: steps.publish.outputs.urls != ''
        run: echo "${{ steps.publish.outputs.urls }}"
```

That is the whole thing. The key is a transformpipe API key, stored as a repository secret; the action ships with the converter, and `action.yml` lists its inputs. Given no file list, it asks git which Markdown files the pull request touched, publishes each one, and comments a table of file name, word count and link. Files the branch deleted are skipped, so a removed document does not fail the run.

Most of that file is not the conversion. It is the handful of lines that keep the job cheap, scoped, ordered and quiet, and each of them is answering a failure somebody has already had.

### The trigger, and what `paths` does

`on: pull_request` runs the workflow when a pull request is opened, reopened, or pushed to. Those three activity types — `opened`, `synchronize` and `reopened` — are the default set, and everything else a pull request can do, a label or a title edit or a review, needs naming explicitly with `types` (checked on docs.github.com, 9 September 2026). Pushing a commit to the branch is `synchronize`, which is the case that matters here: every round of edits gets a fresh preview without anybody asking for one.

`paths: '**.md'` is the cheapest guard available, because it runs before anything else does. A pull request that only changes code never queues the workflow at all: no runner, no checkout, no billed minute. `'**.md'` matches at any depth. `'docs/**.md'` narrows it to one tree, which is usually what you want in a repository where Markdown also lives in test fixtures, a `node_modules` cache, or a vendored copy of somebody else's documentation.

One consequence is worth knowing before you make this a required status check. GitHub's own wording is that a workflow skipped by path filtering leaves its checks in a pending state, and a pull request that requires those checks to be successful is blocked from merging (checked on docs.github.com, 9 September 2026) — on exactly the pull requests that had nothing to preview. Either leave the check optional, or move the filter out of `on:` and into an `if` on the job, where the run happens, reports, and does nothing.

### A concurrency group, so two pushes do not race

Two commits pushed a minute apart start two runs. Both check out, both publish, both comment, and nothing errors. The result is still wrong: the runs can finish out of order, so the last comment in the thread — the one a reviewer reads — can be the one describing the older commit.

`concurrency` fixes the ordering by refusing to have two. The group is any string, and keying it on the pull request number gives one lane per pull request rather than one lane per repository, which would make ten open pull requests queue behind each other for no reason. With `cancel-in-progress: true` a new run cancels the one already going; without it, the new run waits. GitHub's own description of the default behaviour is that a pending job or workflow in the same group is cancelled and the newly queued one takes its place (checked on docs.github.com, 9 September 2026).

For a preview, cancelling is the right choice: the half-finished publish of a commit that has already been superseded is work nobody wants the output of. If the repository has several workflows that could collide, put the workflow name in the group as well — `${{ github.workflow }}-${{ github.event.pull_request.number }}` — so two unrelated jobs do not end up sharing a lane by accident.

### `permissions`, and the 403 you get without them

The `permissions` block scopes the token a workflow runs with. `contents: read` lets checkout read the repository. Posting a comment is a different scope, and needs `pull-requests: write`.

Leave it out and the work gets done and wasted: the documents publish, the comment call comes back 403, and the run goes red on its last step with the links left in the log. Declare both scopes rather than relying on the default, which varies with repository and organisation settings.

Declaring the block at all is what makes it least privilege, because naming two scopes sets every other scope to none. A step added to this job later — a dependency of an action, a script somebody pastes in — then cannot push a commit, open an issue, publish a package or read another repository, whatever it tries. If one job in a larger workflow genuinely needs more, give that job its own `permissions` block instead of widening the file's.

### The secret, and what it can reach

`secrets.TP_API_KEY` is a repository secret holding an API key. The action takes it as an input and hands it to the converter as an environment variable rather than as an argument, which keeps it out of the runner's process list and out of the command line echoed into the log. GitHub redacts registered secret values from log output, and its own guidance is that anything sensitive which is not a GitHub secret has to be masked by hand with `::add-mask::` (checked on docs.github.com, 9 September 2026). Redaction is a safety net over a mistake rather than a place to make one: a step that encodes a secret, splits it, or sends it somewhere defeats the mask entirely, and any step in this job can do that.

The key itself reaches documents, their share settings and a usage figure, and nothing else — not the sign-in, not the list of keys — so a leaked key can publish and delete documents but cannot mint its replacement or lock the owner out. It is shown once and stored only as a hash, which makes rotation a fixed order: mint, paste into the secret, revoke the old one.

If the repository has contributors you would not hand the key to in person, put it in an environment secret and give the job an `environment:`, so using it is gated by whatever protection rule that environment carries. That is a real boundary. A plain repository secret is not: every workflow in the repository can read it, including one added on a branch by anybody with write access.

### The `if` guard, so nothing happens when nothing changed

The `paths` filter stops the workflow when no Markdown changed at all. The `if` guard covers the case one level down, where the workflow ran because something matched and the step after the publish has nothing to work with.

The action handles its own empty case honestly: given no files it prints `No Markdown to publish.`, sets `urls` to an empty string and `documents` to `[]`, and exits zero. What it cannot do is stop the steps you write after it. `if: steps.publish.outputs.urls != ''` is the whole guard, and a skipped step is green rather than red — which matters more than it sounds. A workflow that goes red for a reason nobody can act on is a workflow people learn to ignore, and then it goes red for a real reason and gets ignored again.

The same guard with a different condition is how to handle a fork on purpose rather than by accident:

```yaml
      - if: github.event.pull_request.head.repo.fork == false
        id: publish
        uses: Aborsen/MD2HTML@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

That line needs explaining, because the restriction behind it is the one thing in this workflow you cannot configure away.

## Finding what changed

Given no `files` input, the action asks git, in one line:

```bash
git diff --name-only --diff-filter=d "$BASE_SHA"...HEAD -- '*.md'
```

Every part of that is load-bearing. `--name-only` asks for paths rather than a patch. `--diff-filter=d` drops deletions, so a document the branch removed is never handed to a converter that would fail on a file that is not there. The pathspec `'*.md'` filters inside git rather than afterwards, which keeps the list short on a pull request that also moved four hundred images. And the three dots are not a typo: `A...B` diffs from the merge base of the two commits rather than from `A` itself, so commits that landed on the base branch after the pull request opened do not turn up as this branch's work.

`$BASE_SHA` comes from `github.event.pull_request.base.sha`, which the event payload carries for free. That commit is the whole question, and it is the reason for the next line in the workflow.

### Why `fetch-depth: 0`

`actions/checkout` fetches a single commit by default — `fetch-depth` is documented as the number of commits to fetch, with a default of `1` and `0` meaning all history for all branches and tags (checked on github.com, 9 September 2026). That is fast, and enough to build code. It is not enough to answer "what changed": the action diffs the pull request's base against its head, and in a shallow clone that base commit is missing, so the diff fails or reports nothing.

`fetch-depth: 0` fetches the full history, which costs real time on a repository with years of commits. If checkout is already the slow step, name the files yourself and keep the shallow clone:

```yaml
      - uses: Aborsen/MD2HTML@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook/intro.md docs/handbook/style.md
          merge: true
          name: Handbook preview
```

`files` is a space-separated list of paths, passed through as written: a pattern such as `docs/*.md` arrives literally and matches nothing, so build the list in an earlier step if you need one — which is the same problem as [converting a whole folder of Markdown files](/blog/batch-convert-markdown-files), where enumerating with `find` and sorting before you pass the list on is what keeps the set knowable. An explicit list needs no history, but it loses the part that makes this worth having — treat it as the fallback, not the default.

### The action people reach for instead

Most workflows do not write that diff themselves. `tj-actions/changed-files` is the widely used alternative: MIT licensed, and it computes the list either from GitHub's REST API or from git's own `diff`, which is why it works on a pull request at the default `fetch-depth: 1` and still wants `fetch-depth: 0` or `2` on a `push` event. Its outputs come in several shapes — `all_changed_files`, `added_files`, `modified_files`, `deleted_files` — plus `any_changed`, which is the boolean an `if` wants (checked on github.com, 9 September 2026).

```yaml
      - id: changed
        uses: tj-actions/changed-files@<commit-sha>
        with:
          files: '**.md'

      - if: steps.changed.outputs.any_changed == 'true'
        id: publish
        uses: Aborsen/MD2HTML@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: ${{ steps.changed.outputs.all_changed_files }}
```

Two things about that snippet. The version is a commit SHA on purpose: pin a third-party action to a full SHA rather than a tag, because a tag is a movable pointer that the action's owner, or whoever takes over that account, can repoint at different code — and your workflow will fetch it on the next run with no diff for you to read. The second is quoting. A list of paths interpolated into a `with:` value is one string, so a file name containing a space arrives as two files. That is a property of every space-separated list, this action's `files` input included, rather than a bug in either; if such names exist in your repository, write the list to a file and read it back instead of passing it through a shell.

## The fork problem, and the trigger that lifts it

One limit is worth knowing up front. A `pull_request` event raised from a fork gets no secrets and a read-only token, so a fork's pull request gets no preview — and a red check where the publish step stopped for want of a key. That is GitHub keeping your API key away from code you have not read — the right default.

GitHub's wording leaves no room: with the exception of `GITHUB_TOKEN`, secrets are not passed to the runner when a workflow is triggered from a forked repository, and `GITHUB_TOKEN` itself has read-only permissions in pull requests from forks (checked on docs.github.com, 9 September 2026). Both halves of this workflow are therefore dead on a fork. The publish step has no key and fails at the API; the comment step has no write scope and fails at the comment. Declaring `pull-requests: write` in the file changes nothing, because the block is a ceiling rather than a grant.

### `pull_request_target`, and why it is how repositories get compromised

Search for a way around this and the first answer is always the same trigger. `pull_request_target` fires on the same events as `pull_request`, but it runs in the context of the default branch of the base repository rather than the merge commit — so the workflow file is yours, the token is writable, and the secrets are there (checked on docs.github.com, 9 September 2026).

That sounds like the fix, and it is a well-documented way to lose a repository. The workflow file being yours is the safe half. The unsafe half arrives the moment the job touches the pull request's own contents. Check out the head commit, and everything after that line is a stranger's code running in a job that holds your secrets and a write token: a build script, a test command, a dependency's install hook, a Makefile target, a linter's configuration file, a git hook committed into the branch. GitHub's warning on the trigger names the outcomes plainly — cache poisoning, and unintended access to write privileges or secrets (checked on docs.github.com, 9 September 2026).

Converting a Markdown file looks harmless, and the danger is not in the conversion. It is in everything a job grows around it: the checkout, the `npm ci` somebody adds six months later so a lint step works, the "just run the project's own script" that seems obvious at the time. GitHub's security guidance treats this as a named pattern, and the recommended shape when you truly need privileged work on untrusted content is two workflows: a `pull_request` workflow that handles the contributor's files with no secrets and uploads the result as an artefact, then a `workflow_run` workflow with permissions that downloads the artefact and does the privileged part (checked on securitylab.github.com, 9 September 2026).

### What to do instead

That split is correct, and for a documentation preview it is the wrong amount of machinery: two workflow files, an artefact hand-off, and one class of mistake — checking out the head in the privileged half — whose failure mode is your key in somebody else's hands. Two plainer options cover almost every repository.

**Publish on push to the default branch.** After the merge the job runs on your own branch with your own token and your own secrets, and the fork question disappears because there is no fork in the picture:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'docs/**.md'

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 2

      - uses: Aborsen/MD2HTML@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook.md
          share: link
```

Two differences from the pull request version. `fetch-depth: 2` is enough, because a push compares against the commit before it rather than a merge base. And `files` is named explicitly, because a push event carries no pull request and therefore no base SHA for the action to diff against — without a list it finds nothing and exits zero, which is a silent success rather than an error. What you lose is the preview before the merge; what you keep is a published page for every version that actually shipped, which for release notes and a handbook is the thing people wanted anyway.

**Or accept that fork pull requests get no preview.** Guard the step with `if: github.event.pull_request.head.repo.fork == false` so the run goes green with a skipped step rather than red with a 401, and say so in the contributing guide. A reviewer on a fork's pull request still has the rich-diff toggle, and a maintainer who needs the full treatment can push the branch to the repository, where the workflow has a key again.

One more habit, unrelated to forks and cheap to get right: never interpolate a value a contributor controls — a pull request title, a branch name, a commit message — directly into a `run:` script. `${{ }}` substitutes text before the shell ever sees it, so a title containing a backtick or `$( )` becomes a command that runs with whatever that job holds. Put the value in `env:` and reference it as `$VAR`, which the shell treats as data.

## The comment, and what its link shows

### One comment, updated in place

As shipped, the action posts a new comment each time it runs. On a branch that gets fifteen pushes over three days, that is fifteen comments, fourteen of them pointing at commits nobody is reviewing any more, with the actual discussion buried somewhere in the middle of them.

The fix is a sticky comment: one comment, rewritten in place. `marocchino/sticky-pull-request-comment` is the usual choice — MIT licensed, keyed on a `header` input so several workflows can each own a comment without fighting over the same one, and it wants the same `pull-requests: write` this workflow already declares (checked on github.com, 9 September 2026). Turn the action's own comment off and hand it the output:

```yaml
      - id: publish
        uses: Aborsen/MD2HTML@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          comment: false

      - if: steps.publish.outputs.urls != ''
        uses: marocchino/sticky-pull-request-comment@<commit-sha>
        with:
          header: markdown-preview
          message: |
            Rendered preview of the Markdown this pull request changes:

            ${{ steps.publish.outputs.urls }}
```

The trade is real, and worth making deliberately rather than by default. A sticky comment overwrites its own history, so the thread stops being a record of what the branch said at each round of review. Where review runs over days and somebody may want to check what they approved on Tuesday, the action's `append` input — which takes `true` and nothing else — adds each new message to the previous one rather than replacing it (checked on github.com, 9 September 2026), so the older links stay underneath the newer ones and the thread stays a record. Where the comment is a status line rather than a record, replace it and keep the page quiet.

Where the link goes matters as much as how many of them there are. Put it in the comment body, not only in a check's summary — a reviewer who has to click through to Details to find a link will not find it — and give each link a name, so a pull request touching four documents does not present four bare URLs. The action's own comment is a table of file name, word count and link, which is about the minimum that lets somebody decide what to open first.

### A new document per push, not one that gets overwritten

The action publishes a fresh document each time it runs. Overwriting a single page would be tidier to look at and worse to use, because an overwrite makes every old link a liar. Someone reads the comment on Monday, follows the link on Thursday, and gets Thursday's text under Monday's approval.

A new document per push keeps each link pinned to the commit that produced it, which is what makes the appending comment above worth its extra noise: pinned links are only useful while something is still holding on to them. The cost is documents: each push spends one against the 500-document account limit, and reaching a limit refuses the write instead of quietly deleting anything. Clear old previews in bulk from the history, or with `tp rm` from the [command line](/blog/markdown-to-html-from-the-command-line).

### Who can open the link

`share` decides who can open the result.

| Value | Who can read it |
| --- | --- |
| `link` | Anyone with the link |
| `people` | Only addresses you list, after signing in |
| `none` | Nobody but you — the document lands in your history |

Public repository, public preview: `link` is fine. For a private handbook, `people` is honest, with one catch: the action publishes in that mode with no address list, so the first link opens for nobody until you name the readers — in the share dialog, or with `PUT /api/v1/documents/:id/share`. Revoking a share drops the token, so a link already pasted into a comment stops working. Set `comment: false` for the `urls` output and no comment at all.

This pattern suits repositories where the Markdown is the deliverable — [documentation that lives beside the code](/blog/documentation-that-lives-in-the-repo), [release notes written for a reader, not a commit log](/blog/release-notes-from-markdown), RFCs, runbooks. If your Markdown feeds a static site with its own theme and navigation, a preview deployment from your host renders it properly and this does not.

## The alternatives, and what each costs

A hosted page is one answer to the question of where the rendered document lives. It is not the only one, and for some repositories it is not the right one. Four alternatives cover what people actually do, and each of them buys something different.

| Where the page lives | What it costs to set up | Who can see it | How long it lasts |
| --- | --- | --- | --- |
| An artefact on the run (`actions/upload-artifact`) | one step, no key, no account | anyone who can read the repository, signed in to GitHub — the download URL needs a login | 90 days by default, 1 to 90 with `retention-days` |
| GitHub Pages (`actions/upload-pages-artifact` then `actions/deploy-pages`) | `pages: write` and `id-token: write`, a `github-pages` environment, and a site you are willing to overwrite | the internet, on a public Pages site | until the next deployment replaces it |
| The converted HTML committed back to the branch | `contents: write`, a bot commit, and generated HTML in every future diff | anyone who can read the repository | for ever, in the history |
| A hosted page from an API or an action | a key in a secret, an account, and that account's limits | whoever the share mode allows, GitHub account or not | until somebody deletes it |
| Nothing: the rich-diff toggle | no workflow at all | anyone who can open the pull request | it is a tab, not a link |

(Artefact retention, the Pages permissions and the download requirement checked on github.com, 9 September 2026.)

**The artefact is the cheapest and the least readable.** One step, no key, no account, and the output is attached to the run where it cannot leak. Then somebody has to find the run, scroll to the artefacts, download a zip, unzip it, and open an HTML file from their own disk — which is also the moment a page that fetches its stylesheet from a CDN stops looking like anything, so a self-contained export matters more here than anywhere else. And the download URL needs a GitHub login, which rules out the reader this whole exercise was for.

**GitHub Pages is the right answer when the output is a site.** `actions/deploy-pages` publishes a previously uploaded artefact to Pages, and it needs `pages: write` for the deployment and `id-token: write` so the deployment can be verified, with the job pointed at the `github-pages` environment. What it is not is a per-branch preview: a repository has one Pages site, so previewing a pull request means either overwriting what is live or inventing a path convention and cleaning it up later, and nothing expires on its own.

**Committing the HTML back works, and poisons the diff.** It needs `contents: write` — the permission the rest of this article has been avoiding — and a bot commit that will retrigger the workflow unless you guard against it. The lasting cost is the review: every pull request now carries a thousand lines of generated markup that nobody reads and everybody scrolls past, plus merge conflicts in a file no human edits. Generated output belongs somewhere other than the source tree, and this is the clearest case of it.

**A hosted page buys exactly one thing: a reader without an account.** That is the whole justification, and if nobody in the review needs it, the artefact is cheaper and the rich diff is cheaper still. It costs a key in a secret and an account with limits — 500 documents, 100 MB, and 4 MB for any single document. Those limits are the reason to clear old previews rather than let a year of pull requests accumulate.

**And one that does not work: pasting the HTML into the comment.** GitHub renders a comment body as its own Markdown and strips the tags a converted document depends on, `style` first among them. A comment can carry a link. It cannot carry a document.

## Twenty files, two rate limits, and the ways it fails

A restructuring pull request touches twenty Markdown files, and the shape of the job stops being a detail.

### A loop beats a matrix here

The action's default is one document per file, converted and published one after another inside a single job. Twenty files is twenty requests in one process on one runner, and it finishes in about as long as one file plus nineteen round trips.

The instinct is to fan out with a matrix — build the file list in one job, `fromJSON` it into `strategy.matrix` in the next, and run twenty jobs in parallel. For work that takes minutes per item that is exactly right. For a conversion that takes a moment it is twenty runner allocations, twenty checkouts, twenty action downloads and twenty comments unless you suppress them, to save a few seconds of API round trips. The loop wins on every axis that matters.

If you do fan out for some other reason, three settings stop it hurting: `fail-fast: false`, so one malformed file does not cancel the other nineteen; `max-parallel`, so the burst is a trickle; and one final job that collects the outputs and writes a single comment, because twenty comments is worse than none.

The better answer for twenty related files is usually not parallelism at all. `merge: true` chains them into one document with one link, and a reviewer reads a handbook in order instead of opening twenty tabs and losing their place. Ordering then becomes the thing to get right, which is the same problem a folder-wide conversion has.

### Sixty calls a minute, and a thousand an hour

Two rate limits sit at the end of this job, and they belong to different systems.

The API counts calls per caller per minute and refuses the sixty-first with a 429 and a `Retry-After`, on the reasoning that a key going faster than that is looping rather than working. Twenty files in a loop is twenty calls and nowhere near it. Twenty parallel jobs, each retrying on a timeout, on a repository where three pull requests are open at once, is how a limit that sounded generous gets found.

GitHub's own limit sits on the comment: `GITHUB_TOKEN` gets 1,000 requests per hour per repository, shared across every workflow in that repository (checked on docs.github.com, 9 September 2026). One comment per run is nothing. One comment per file, on a busy monorepo, alongside every other workflow spending from the same budget, is a 403 on a Tuesday afternoon that nobody connects to the change made on Monday. One sticky comment per run is the cheap answer to both limits at once.

### When the job goes red, and when it goes green and lies

Four failures account for nearly all of them. Three announce themselves. The fourth is the one to worry about.

**A body the platform refuses.** Conversion accepts up to 10 MB, but a document kept in an account is capped at 4 MB, and the reason is not a policy: a Vercel Function refuses a request or a response body over 4.5 MB before any of our code runs, so a larger document could be neither saved nor read back, and the caller would get the platform's bare 413 instead of a sentence explaining itself. In CI the tell is which error you get — a JSON body with a readable message means the request reached the API and was refused by it; a bare 413 with no body means it never arrived. Either way the fix is the same, and it is rarely "split the document": a 4 MB Markdown file is usually generated output that should never have been in the preview, which is what the `paths` filter and an explicit `files` list are for.

**A token that expired.** Two different tokens can be meant by that. `GITHUB_TOKEN` is minted for the job and stops working when the job ends, which only bites if you try to hand it to something outside the run. The API key is the one that expires in practice — revoked by whoever rotated it, or deleted with the account. The symptom is a 401 on every run including reruns of runs that passed last week, and that is the diagnostic: nothing in the repository changed, so nothing in the repository is the cause. Keys are stored as a hash and shown once, so there is nothing to inspect; mint a new one, update the secret, rerun.

**A secret that was never there.** A secret referenced by the wrong name is not an error. It interpolates to an empty string, the step runs with no key, and the failure surfaces at the API as a 401 that reads like a bad key rather than a missing one. You cannot test for it directly, because the `secrets` context is not available in an `if` at either the job or the step level (checked on docs.github.com, 9 September 2026). Copy it into `env` at the job level and test the variable instead:

```yaml
jobs:
  preview:
    runs-on: ubuntu-latest
    env:
      HAS_KEY: ${{ secrets.TP_API_KEY != '' }}
    steps:
      - if: env.HAS_KEY == 'true'
        uses: Aborsen/MD2HTML@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

**A document that converts and is empty.** This is the dangerous one, because everything is green. A file that is nothing but YAML front matter converts to a document with no body. So does a file whose content is one HTML comment, or a page whose text lives inside a template tag the converter does not execute. The workflow succeeds, the comment posts, the link opens a blank page, and the reviewer assumes the blank page is the document. Guard it with the word count the action already reports:

```yaml
      - if: steps.publish.outputs.documents != ''
        env:
          DOCUMENTS: ${{ steps.publish.outputs.documents }}
        run: |
          node -e '
            const docs = JSON.parse(process.env.DOCUMENTS || "[]");
            const empty = docs.filter((d) => d.words < 20);
            if (empty.length > 0) {
              console.error(`Empty after conversion: ${empty.map((d) => d.name).join(", ")}`);
              process.exit(1);
            }
          '
```

Twenty words is arbitrary and that is fine — the point is not the threshold but that a document nobody can read now fails the run instead of passing it.

## The same job on GitLab, and on a runner you own

Nothing above is really about GitHub. The job is: work out what changed, convert it, publish it, and put the link where the reviewer is. Only the last two lines of that are host-specific.

On GitLab, the pieces line up almost one for one. `rules:changes` is the `paths` filter. `interruptible: true` is what makes a job cancellable when a newer pipeline supersedes it, and `resource_group` limits concurrency where jobs must not overlap. `CI_MERGE_REQUEST_DIFF_BASE_SHA` is described in the documentation as the base SHA of the merge request diff, which is the commit to diff against, and `CI_MERGE_REQUEST_IID` is the number in the merge request's URL, which is what a comment is posted against. The shallow-clone problem is the same problem with a different knob: the runner clones shallow by default and `GIT_DEPTH` is what changes it (all checked on docs.gitlab.com, 9 September 2026).

```yaml
markdown-preview:
  image: node:lts-alpine
  interruptible: true
  variables:
    GIT_DEPTH: 0
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes:
        - '**/*.md'
  script:
    - files=$(git diff --name-only --diff-filter=d
        "$CI_MERGE_REQUEST_DIFF_BASE_SHA"...HEAD -- '*.md')
    - node tp.mjs push $files --share link --json > documents.json
```

On a runner that belongs to you — Jenkins, Buildkite, a cron job on a box in a cupboard — two of the four pieces simply are not there. There is no event payload, so you work out the base yourself with `git merge-base origin/main HEAD`, and there is no pull request to comment on, so the link goes wherever your team actually reads: a chat message, a build annotation, an email. What travels unchanged is the diff and the request, and the request is the part worth designing carefully, because [a conversion API is only as usable as its error messages and its published limits](/blog/converting-documents-with-an-api). If the job is converting a whole tree rather than a changed handful, [enumerating and ordering the files is the harder half](/blog/batch-convert-markdown-files).

## How to choose what to publish

1. **Work out who the reader is before you pick a destination.** If everybody whose approval matters has a GitHub account, the rich diff and an artefact are free and you can stop reading; the workflow only earns its keep when one of the readers does not, because a link is then the only artefact that works.
2. **Publish on push to the default branch unless you specifically need the preview before the merge.** It removes the fork question, the token question and half the failure modes in one move, and the cost is that review still happens on the diff.
3. **Never reach for `pull_request_target` to make fork previews work.** It hands your secrets to a job that is about to check out somebody else's code, and the failure mode is not a red run you can fix, it is a key you have to rotate and a history you have to audit.
4. **Guard the publishing step so the awkward cases skip instead of failing.** No Markdown changed, or the pull request came from a fork: a green run with a skipped step keeps the check trustworthy, and a check nobody trusts is a check nobody reads when it finally matters.
5. **Keep one comment per pull request and one document per push.** One comment because a thread of fifteen is a thread nobody scrolls to the bottom of; a new document per push because overwriting a page makes every link in the thread a liar about which commit it describes.
6. **Count the requests before you fan out.** Twenty files in one job is twenty calls; twenty jobs is twenty runners, twenty checkouts and two rate limits, and a limit refuses rather than queues.
7. **Check what the reviewer sees, not what the run says.** Open the link from the comment, signed out, on a phone, and see whether it is the document. A workflow can be green all the way through and still be publishing an empty page.

Reviewing prose in a diff is guesswork, and the whole fix is one file: a trigger with a `paths` filter, a concurrency group, two permissions, one secret, and a step that publishes what the branch changed and leaves a link where a reviewer will actually see it. Start with the repository whose Markdown is read by somebody who does not write code, open a pull request against a file that needs a real edit, and see whether the first comment that comes back is about the text rather than the formatting. To see what the output looks like before minting a key for it, convert the file by hand first — [transformpipe's Markdown to HTML conversion](/) runs in your browser, free, and signed out the file is not uploaded anywhere.

## FAQ

### Can I preview Markdown from a pull request opened on a fork?

Not with a secret, and that is deliberate. A `pull_request` event from a fork gets a read-only `GITHUB_TOKEN` and no repository secrets, so the publish step has no key and the comment step has no write scope. Publish on push to the default branch instead, or guard the step so a fork's pull request skips it cleanly.

### Is `pull_request_target` ever safe?

Only when the job never touches the pull request's contents — no checkout of the head, no running of anything from the branch, no dependency install that could execute a script from it. For labelling and triage that is achievable. For anything that reads the contributor's files, use the two-workflow pattern with `workflow_run`, or do not do it at all.

### Why does my workflow do nothing when I push?

Usually the `paths` filter: it is evaluated against the files the pull request changed, so a push that touched no matching file never queues a run. The related trap is making a `paths`-filtered workflow a required status check — it never reports on the pull requests it skips, so the merge waits for a check that will never arrive.

### Do I really need `fetch-depth: 0`?

Only if something in the job diffs against the base commit, which is how the changed-file list is built. A shallow clone does not contain that commit, so the diff either fails or reports nothing. Naming the files explicitly avoids it, and so does an action that asks GitHub's API for the list rather than git.

### How do I stop the bot commenting on every push?

Turn the action's own comment off with `comment: false` and post a sticky comment instead, keyed on a header so the same comment is rewritten in place each run. Keep the links themselves distinct per push, though — reusing one document for every commit makes older links in the thread describe text that no longer exists.

### What happens when a pull request touches twenty files?

The action publishes twenty documents from one job and comments one table of twenty rows, which is fine. Chaining them into one document with `merge: true` is usually better for a reader. A matrix of twenty parallel jobs is the option to avoid: more setup cost than conversion cost, and two rate limits waiting at the end of it.

### Can I do this without an account or an API key?

Yes, with less. Convert the file in a browser and paste the link yourself, or have the workflow attach the rendered HTML as an artefact, which needs no key and no account — the reader just needs to be signed in to GitHub to download it. The key buys one thing: a link that opens for somebody who has no GitHub account at all.
