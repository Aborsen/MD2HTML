---
title: Release notes people actually read
description: Decide what belongs in release notes rather than the commit log, group changes by impact, and turn a CHANGELOG.md into a page you can send.
date: 2026-08-14
tag: Workflow
keywords: release notes markdown, changelog markdown, keep a changelog, changelog format, release notes template
---

Most changelogs are a commit log with the hashes stripped off. "Refactored the token handler." "Bump dependency." "Fix edge case in parser." Every line is true, and none of it helps the person deciding whether to upgrade this week. Release notes are a different document with a different job: they say what changed for the reader, what breaks, and what to do about it.

## What belongs in release notes, and what belongs in the commit log

The commit log records how the code got here, for whoever has to bisect a regression in eighteen months. Release notes are for someone who has never seen the code and has ten seconds.

| The change | Commit log | Release notes |
| --- | --- | --- |
| Retry logic rewritten | `refactor(http): replace retry loop with backoff` | Failed requests retry three times, with a growing delay. Nothing to configure. |
| Config key renamed | `feat: rename apiKey to api_key` | `apiKey` is now `api_key`. The old name still works and logs a warning. |
| Table parser fixed | `fix: off-by-one in table row parser` | Single-column tables no longer lose their last row. |

Three tests for a candidate line: the reader's behaviour changes, they could have hit the bug, or they would notice the difference unprompted. A line that fails all three stays in the commit log. Internal refactors and dependency bumps that change nothing observable stay there too.

## Group by impact, not by component

Splitting notes into `auth-service`, `billing-worker` and `web` describes how the work was divided, not how it lands. A reader asking whether this release breaks their integration has to read every section.

Keep a Changelog is the format worth starting from, because its six categories are consequences rather than components:

- **Added** — things you can now use.
- **Changed** — behaviour that is different from last time.
- **Deprecated** — still works, but not for much longer.
- **Removed** — gone. If you used it, you have work to do.
- **Fixed** — behaviour that was wrong and now is not.
- **Security** — patch now, with the severity stated plainly.

Keep a Changelog lists Added first, but nothing fixes that order. Removed and Changed answer the question most readers arrive with, so lead with them.

In a monorepo where teams consume each other's packages, per-component notes are the better answer: each reader owns one service and wants only their section. Two documents usually settle it — component grouping for the people who build it, impact grouping for the people who use it.

## A changelog format you can copy

The structure is plain Markdown, which is the point: it diffs, it reviews and it converts.

```markdown
## [Unreleased]

## [1.4.0] - 2026-08-14

### Removed
- The `/v1/export` endpoint. Use `/v2/exports`; the response is identical
  apart from `id`, now a string.

### Changed
- Session cookies last 30 days instead of 7. Existing sessions are unaffected.

### Fixed
- Uploads over 2 GB no longer fail silently on slow connections.

[Unreleased]: https://example.com/compare/v1.4.0...HEAD
[1.4.0]: https://example.com/compare/v1.3.0...v1.4.0
```

The `Unreleased` heading is what makes the habit stick: there is always somewhere to put a line, so entries get written while the change is fresh instead of reconstructed from git on release night. ISO dates sort correctly and cannot be misread across regions. Link references at the bottom point each version at its own diff.

## Write the entry, not the ticket title

A release notes template only helps if the lines inside are written for a reader:

- Lead with the noun they know — the endpoint, the setting, the menu item — not the module that contains it.
- Say what is true now. "Exports run in the background" beats "Changed exports to run in the background".
- Name things exactly as they appear in the product: `api_key`, not "the API key setting".
- Give every breaking line an action and a deadline. "Switch to `/v2/exports` before 3.0" is a note. "Endpoint deprecated" is a shrug.
- One line per change. If it needs three sentences, link to a page with room for them.

Real figures belong here — sizes, timeouts, retry counts, dates. "Improved performance" is filler, because the reader cannot check it and cannot act on it.

## From CHANGELOG.md to a page you can send

The file in the repository serves people who read the repository. Support, sales and customers need a link, and that is where release notes usually stall.

Dropping `CHANGELOG.md` into M2H gives you one self-contained `.html` file — inline styles, no scripts, no network requests — to attach to an email or publish as a read-only page. Revoking that link later stops one you have already sent, which [sharing a Markdown document as a link](/blog/share-a-markdown-document-as-a-link) covers in full. If the release also ships with a covering note and an upgrade guide, dropping all three at once [chains them into one document](/blog/merging-many-markdown-files) in order.

For a release that is cut by CI, the same thing runs unattended:

```bash
node cli/m2h.mjs push CHANGELOG.md --name "Release 1.4.0" --share link
```

The GitHub Action covers the pull-request half, publishing the Markdown a pull request changed and commenting the links back — see [publishing Markdown from GitHub Actions](/blog/publish-markdown-from-github-actions).

Before any of that, a short check on the top section:

- [ ] Every Removed and Changed line tells the reader what to do.
- [ ] No line names a file, module or ticket number the reader cannot see.
- [ ] The version and date match the tag.
- [ ] Someone outside the team read it and could say what changed.

Open your changelog and read its most recent section as a customer would. Cut the lines that fail the three tests, add the missing action to every breaking change, then convert it and send the link. The M2H CLI, API and Action are documented at [/docs](/docs).
