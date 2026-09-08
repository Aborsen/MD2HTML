---
title: Publishing Markdown from a pull request
description: Render the Markdown a pull request changed, publish each file as a page, and comment the links, so reviewers read the document instead of the diff
date: 2026-08-26
tag: Automation
keywords: github action markdown, github actions render markdown, markdown preview pull request, pull request documentation preview, ci markdown, convert markdown in ci
---

A pull request that rewrites a paragraph shows a red line, a green line, and a lot of moved wrapping. You can see which words changed. You cannot see whether the section still reads well, whether the table lines up, or whether the numbered list restarts at one halfway down. Reviewing prose in a diff is guesswork.

The fix is small. On every pull request, render the Markdown it changed, publish each file, and post the links in a comment. The reviewer clicks and reads the document. Nothing in the repository changes.

## Check what GitHub already does

Before adding a workflow, see whether you need one. The Files changed tab has a rich-diff toggle that renders a changed Markdown file instead of its diff. For one small file, reviewed by people who already have the pull request open, that is enough.

It stops being enough when the change spans several files, when the reader has no GitHub account — a lawyer checking terms, a customer reading release notes — or when you want a link that still shows what the branch said last Tuesday.

## The workflow

Copy this into `.github/workflows/markdown-preview.yml`:

```yaml
name: Markdown preview

on:
  pull_request:
    paths:
      - '**.md'

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: Aborsen/MD2HTML@v1
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

That is the whole thing. The key is an transformpipe API key, stored as a repository secret; the action ships with the converter, and `action.yml` and `/docs` list its inputs. Given no file list, it asks git which Markdown files the pull request touched, publishes each one, and comments a table of file name, word count and link. Files the branch deleted are skipped, so a removed document does not fail the run.

The `paths` filter keeps the job off pull requests that only change code.

## Why `fetch-depth: 0`

`actions/checkout` clones a single commit by default. That is fast, and enough to build code. It is not enough to answer "what changed": the action diffs the pull request's base against its head, and in a shallow clone that base commit is missing, so the diff fails or reports nothing.

`fetch-depth: 0` fetches the full history, which costs real time on a repository with years of commits. If checkout is already the slow step, name the files yourself and keep the shallow clone:

```yaml
      - uses: Aborsen/MD2HTML@v1
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook/intro.md docs/handbook/style.md
          merge: true
          name: Handbook preview
```

`files` is a space-separated list of paths, passed through as written: a pattern such as `docs/*.md` arrives literally and matches nothing, so build the list in an earlier step if you need one. An explicit list needs no history, but it loses the part that makes this worth having — treat it as the fallback, not the default.

## Why `pull-requests: write`

The `permissions` block scopes the token a workflow runs with. `contents: read` lets checkout read the repository. Posting a comment is a different scope, and needs `pull-requests: write`.

Leave it out and the work gets done and wasted: the documents publish, the comment call comes back 403, and the run goes red on its last step with the links left in the log. Declare both scopes rather than relying on the default, which varies with repository and organisation settings.

One limit is worth knowing up front. A `pull_request` event raised from a fork gets no secrets and a read-only token, so a fork's pull request gets no preview — and a red check where the publish step stopped for want of a key. That is GitHub keeping your API key away from code you have not read — the right default.

## A new document per push, not one that gets overwritten

The action publishes a fresh document each time it runs. Overwriting a single page would be tidier to look at and worse to use, because an overwrite makes every old link a liar. Someone reads the comment on Monday, follows the link on Thursday, and gets Thursday's text under Monday's approval.

A new document per push keeps each link pinned to the commit that produced it. The comment thread becomes a record of what the branch said at each round of review. The cost is documents: each push spends one against the 500-document account limit, and reaching a limit refuses the write instead of quietly deleting anything. Clear old previews in bulk from the history, or with `tp rm` from the [command line](/blog/markdown-to-html-from-the-command-line).

## Choosing what the links show

`share` decides who can open the result.

| Value | Who can read it |
| --- | --- |
| `link` | Anyone with the link |
| `people` | Only addresses you list, after signing in |
| `none` | Nobody but you — the document lands in your history |

Public repository, public preview: `link` is fine. For a private handbook, `people` is honest, with one catch: the action publishes in that mode with no address list, so the first link opens for nobody until you name the readers — in the share dialog, or with `PUT /api/v1/documents/:id/share`. Revoking a share drops the token, so a link already pasted into a comment stops working. Set `comment: false` for the `urls` output and no comment at all.

This pattern suits repositories where the Markdown is the deliverable — [documentation that lives beside the code](/blog/documentation-that-lives-in-the-repo), [release notes written for a reader, not a commit log](/blog/release-notes-from-markdown), RFCs, runbooks. If your Markdown feeds a static site with its own theme and navigation, a preview deployment from your host renders it properly and this does not.

Start with a repository where the writing gets reviewed by someone who is not a developer. Add the workflow, open a pull request against a file that needs a real edit, and see whether the first comment is about the text rather than the formatting. To see the output before wiring up a key, drop the file on transformpipe first.
