---
title: Release notes people actually read
description: Write release notes instead of a commit log: the six Keep a Changelog types, what a breaking change means, which generators help, and what they cannot write.
date: 2026-08-14
tag: Workflow
keywords: release notes markdown, changelog markdown, keep a changelog, changelog format, release notes template, semantic versioning breaking change, conventional commits changelog, changelog generator
---

Most changelogs are a commit log with the hashes stripped off. "Refactored the token handler." "Bump dependency." "Fix edge case in parser." Every line is true, and none of it helps the person deciding whether to upgrade this week. Release notes are a different document with a different job: they say what changed for the reader, what breaks, and what to do about it.

### TL;DR

Keep a Changelog gives you six change types — Added, Changed, Deprecated, Removed, Fixed, Security — and an `Unreleased` heading that makes the habit stick, because there is always somewhere to put the line while the change is fresh (checked on keepachangelog.com, 9 September 2026). Semantic versioning tells the reader how much attention to pay, but only if the project has written down what a breaking change means for it. Generators — GitHub's own release notes, release-please, semantic-release, git-cliff, changesets, auto-changelog — will assemble the list from commits or from changeset files, and none of them can write the two sentences saying why this release exists and who can skip it. Keep the file in the repository as Markdown, write the human part by hand, and convert it when somebody outside the repository needs a link.

The friction is not that changelogs are hard to write. It is that nobody has decided who they are for. A file that has to serve the maintainer bisecting a regression, the customer deciding whether to upgrade over a weekend, and the integrator whose parser is about to break will serve none of them, because those three readers want different things from the same twelve lines.

The second friction is timing. Release notes written on release night are reconstructed from `git log`, and reconstruction is where the reasons go missing: the person writing the line can see that a default changed and cannot remember which support ticket made it necessary. By then the only cheap thing left is a list, so a list is what gets shipped.

## What belongs in release notes, and what belongs in the commit log

The commit log records how the code got here, for whoever has to bisect a regression in eighteen months. Release notes are for someone who has never seen the code and has ten seconds.

| The change | Commit log | Release notes |
| --- | --- | --- |
| Retry logic rewritten | `refactor(http): replace retry loop with backoff` | Failed requests retry three times, with a growing delay. Nothing to configure. |
| Config key renamed | `feat: rename apiKey to api_key` | `apiKey` is now `api_key`. The old name still works and logs a warning. |
| Table parser fixed | `fix: off-by-one in table row parser` | Single-column tables no longer lose their last row. |

Three tests for a candidate line: the reader's behaviour changes, they could have hit the bug, or they would notice the difference unprompted. A line that fails all three stays in the commit log. Internal refactors and dependency bumps that change nothing observable stay there too.

Keep a Changelog makes the same argument from the other direction, and warns against using a commit log diff as a changelog at all: it is full of merge commits, obscure titles and documentation changes that bury whatever the reader came for (checked on keepachangelog.com, 9 September 2026). That is not a complaint about commit hygiene. A commit message written well is still written for a reviewer with the diff open beside it, and the reader of release notes has no diff and no intention of finding one.

There is a third document worth separating out, because it is the one most often smuggled into a changelog: the upgrade guide. A changelog entry is one line and a link. An upgrade guide is a page with code samples, an order of operations, and the bit about draining the queue first. Mixing them means the person skimming for breakage has to read the tutorial, and the person doing the migration has to find the tutorial inside a list.

## The six change types, and what belongs under each

Keep a Changelog 1.1.0 defines six types, and the reason to start there rather than inventing your own is not aesthetic: the categories are consequences, so a reader who cares about one of them can read one heading and leave. The specification is MIT licensed, and its guiding principles are short — changelogs are for humans, every version gets an entry, changes are grouped by type, versions and sections are linkable, newest first, release dates shown, and semantic versioning followed (checked on keepachangelog.com, 9 September 2026).

| Type | What belongs under it | What does not | What the reader does with it |
| --- | --- | --- | --- |
| Added | New endpoints, settings, commands, screens, formats accepted, permissions | A new internal class; a new test; a new build step | Reads it if they were waiting for it, skips it otherwise |
| Changed | Defaults, limits, timings, sort order, wording, output shape, error codes | A rewrite with identical observable behaviour | Checks whether an assumption they made still holds |
| Deprecated | Anything that still works and has a stated end | Something you dislike but have no plan to remove | Schedules work before the date you gave |
| Removed | Endpoints, flags, config keys, formats, platform and runtime support | Dead internal code nobody could call | Stops, reads the migration line, plans the upgrade |
| Fixed | Wrong behaviour a reader could plausibly have hit | A bug introduced and fixed inside the same release | Works out whether they were affected, and since when |
| Security | Vulnerabilities patched, with severity and what was exposed | Hardening nobody was exposed by — that is Changed | Patches now, or explains to somebody why not |

### Added

New capability, described as a thing the reader can now do rather than a thing you built. "Exports can be filtered by date range" is an entry; "added date range filter support to the export service" is a status report. Added is the section people skim last and the easiest to overfill, because every ticket closed feels like an addition. If nobody outside the team can reach it, it is not an addition yet.

### Changed

The most under-used and most expensive section. Changed is where defaults move, limits tighten, timeouts shrink, error codes get more specific and sort order flips — none of which is a bug fix and all of which can break somebody who wrote code against the old behaviour. Every Changed line should carry the old value and the new one, because "improved rate limiting" tells a reader nothing they can act on and "the burst allowance is 60 requests, down from 120" tells them exactly whether to care.

### Deprecated

A deprecation with no date is not a deprecation, it is an opinion. The entry needs three things: what is deprecated, what to use instead, and when it stops working — a version, a date, or both. Deprecated is also the only section describing something that has not happened yet, which is why it is the one readers skip and the one that costs them most when they do.

### Removed

The section that decides whether an upgrade is safe, so it goes near the top of the entry whatever the specification's ordering suggests. Each line needs the replacement and the shape of the work: not just that `/v1/export` is gone, but that `/v2/exports` returns the same body with `id` as a string. A Removed line with no replacement is fine when there genuinely is none, and then say so plainly rather than leaving the reader to search for one.

### Fixed

Fixed is read by people working out whether a problem they had was this problem. That makes the affected condition more useful than the mechanism: "uploads over 2 GB failed silently on connections slower than 1 Mbps" lets a reader match their own symptom, while "fixed a race in the chunked upload handler" does not. If a fix changes behaviour some people had come to rely on, it belongs in Changed as well, or instead.

### Security

State the severity, what an attacker could do, and whether exploitation needed authentication. If you use CVE identifiers or a severity scale, use them consistently, because a reader deciding whether to patch out of hours is doing risk arithmetic and needs the inputs. Security entries are also the ones most often read by somebody who is not a customer — an auditor, a procurement questionnaire, a security team — so they outlive the release by years.

### The Unreleased section as a working habit

Keep a Changelog puts an `Unreleased` heading at the top so readers can see what is coming and so releasing becomes a matter of moving content rather than writing it (checked on keepachangelog.com, 9 September 2026). The habit matters more than the heading. When `Unreleased` exists, the pull request that changes a default can add the line describing it, reviewed by the same person reviewing the change, at the moment when both of them still remember why.

That turns one hard question — what changed in the last six weeks — into fifty easy ones. It also gives review something to catch: a pull request that changes observable behaviour and touches no changelog line is a visible omission, which is the cheapest possible enforcement. The cost is merge conflicts, since everybody edits the same lines at the top of the same file. Two things reduce them: keep the newest entry at the top of each subsection so additions land in one place, or move to one file per change, which is the problem changesets exists to solve.

### Group by impact, not by component

Splitting notes into `auth-service`, `billing-worker` and `web` describes how the work was divided, not how it lands. A reader asking whether this release breaks their integration has to read every section, and will read none of them.

Keep a Changelog lists Added first, but nothing fixes that order. Removed and Changed answer the question most readers arrive with, so lead with them, then Security, then Fixed, then Added. The specification is a structure, not a stylesheet.

In a monorepo where teams consume each other's packages, per-component notes are the better answer: each reader owns one service and wants only their section. Two documents usually settle it — component grouping for the people who build it, impact grouping for the people who use it — and the second is derived from the first often enough that it is worth arranging the source that way.

### A changelog format you can copy

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

ISO 8601 dates sort correctly and cannot be misread across regions, which is why the specification asks for them (checked on keepachangelog.com, 9 September 2026). Link references at the bottom point each version at its own diff, and keeping them as reference-style links rather than inline URLs keeps the entries readable in the raw file — which is where most people will read them.

Two details save arguments later. Use `## [1.4.0]` rather than a top-level heading per version, so the file has one title and every version sits at the same level; a documentation site that renders the file will otherwise produce a page with several competing titles. And keep the whole history in one file until it is genuinely unwieldy, at which point archive by year rather than by major version, because readers search for dates.

## Versions, breaking changes, and the commits underneath

A version number is a promise about how carefully to read. Semantic Versioning 2.0.0 states it in one line each: MAJOR for incompatible API changes, MINOR for functionality added in a backward compatible manner, PATCH for backward compatible bug fixes (checked on semver.org, 9 September 2026).

| Bump | What it promises the reader | What they should do |
| --- | --- | --- |
| PATCH | Nothing they depend on has changed shape | Upgrade, read Fixed and Security only |
| MINOR | New things exist; old things behave as before | Upgrade, skim Added for what they were waiting for |
| MAJOR | Something they may depend on is gone or different | Read Removed and Changed in full, plan the work |

The promise only holds if the project has said what its public surface is. The specification is explicit that software using semantic versioning must declare a public API, in the code or in documentation, and that the declaration should be precise and comprehensive (checked on semver.org, 9 September 2026). Most projects skip this, and then every argument about whether a change was breaking becomes an argument about intentions.

### What counts as a breaking change for this project

This is the only version question a reader actually has, and no specification can answer it, because "incompatible" depends on what you promised. Write the answer down once, in the contributing guide, and the release conversation becomes short. A reasonable starting list of what counts:

- Removing or renaming anything callable: an endpoint, a flag, a config key, an exported function, an event name.
- Removing a field from a response, or changing its type. Adding one is usually safe; making an optional field required is not.
- Tightening validation, so input that used to be accepted is now rejected.
- Changing a default, when the old default was doing work for people who never set the value.
- Changing an error code, an exit status, or the shape of an error body that callers branch on.
- Dropping support for a runtime, an operating system or a database version.
- Changing output ordering, when nothing promised the ordering but everybody relied on it.
- Fixing a bug in a way that removes behaviour people built on. This one is genuinely contested, and the honest handling is to name it in Changed as well as Fixed, and to say who is affected.

Then the things that reliably start arguments and are worth deciding in advance: log format, metrics names, HTML class names, the database schema for anybody who queries it directly, and anything reachable through reflection or a plugin interface. If those are not part of the public surface, say so before somebody depends on them.

### Version zero, and the pre-release escape hatch

Major version zero is for initial development: anything may change at any time, and the public API should not be considered stable (checked on semver.org, 9 September 2026). That is a real licence to move, and it expires the moment somebody puts the thing in production. If you are on `0.x` and the changelog has stopped mentioning breaking changes because they are permitted, the version number is now hiding information from the reader rather than giving it to them.

Pre-release identifiers — the part after a hyphen — are for shipping to people who accepted the risk, and build metadata after a plus sign is ignored entirely when comparing versions (checked on semver.org, 9 September 2026). Neither replaces a changelog entry. Somebody upgrading to `2.0.0-rc.1` still needs the list, and arguably needs it more than anybody else.

### Conventional Commits as the input side

If a generator is going to write the list, something has to tell it which commits matter. Conventional Commits 1.0.0 is the usual answer: a message shaped as `<type>[optional scope]: <description>`, with an optional body and footers. It names `feat` and `fix` and permits others, suggesting `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` and `test`. Breaking changes are signalled either by a `BREAKING CHANGE:` footer or by a `!` before the colon, and the mapping to versions is direct: `fix` is a PATCH, `feat` is a MINOR, and a breaking change of any type is a MAJOR (checked on conventionalcommits.org, 9 September 2026).

This is worth adopting, and it is worth being honest about what it buys. It makes generation possible: a tool can sort commits into sections and work out the next version with nobody in the loop. It does not make the notes good. The convention constrains the prefix, not the sentence after it, and `feat(export): add dateFrom param to POST /exports` is a correct conventional commit and a poor changelog line.

### What the convention does not fix

Four gaps, all of which show up in generated output:

- **The audience of the sentence.** A commit description is written for whoever reads the diff. Nothing in the convention asks the author to write for a customer, so nobody does.
- **One change, several commits.** A user-visible change often arrives as four commits across two weeks. A generator emits four lines; the reader needed one.
- **Severity and urgency.** There is no `security:` type in the specification, and no way to say "critical, patch tonight" in a prefix. That judgement is added by a person afterwards or not at all.
- **Squash-merge titles.** On a repository that squashes, the pull request title becomes the commit message and therefore becomes the changelog line. That is either an argument for reviewing pull request titles as published text, or an argument for not generating the notes from them.

## The changelog generators, compared

All of these are free. The interesting difference is what each one reads, because that fixes what it can possibly know.

| Tool | Reads | Emits | Cannot know | Licence |
| --- | --- | --- | --- | --- |
| GitHub automatic release notes | Merged pull requests, their labels, and contributors | A release body on the GitHub release, categorised by label | Anything absent from a pull request title or label; whether a change breaks you | Part of GitHub |
| release-please | Git history, looking for Conventional Commit messages | A release pull request, an updated changelog, version bumps in language files, tags and GitHub releases | Anything not in a commit message; it does not publish to registries | Apache 2.0 |
| semantic-release | Commit messages (Angular conventions by default) and git tags | The next version, release notes, a git tag, a registry publish and a GitHub release | Anything not in a commit message; it writes no changelog file unless you add the plugin | MIT |
| git-cliff | Git history, via conventional commits or your own regex parsers | A changelog file in whatever shape the template says | Anything not in a commit message | Apache 2.0 or MIT |
| changesets | Markdown changeset files a contributor writes by hand | Version bumps, changelogs and publishing across a monorepo | Anything nobody wrote a changeset for | MIT |
| auto-changelog | Git tags, commit history, merge commits and issue-closing keywords | A changelog file in compact, Keep a Changelog or JSON form | Anything not in a commit, a merge or a linked issue | MIT |

### GitHub's automatically generated release notes

Built into GitHub's release page as an automated alternative to writing the body by hand: it produces an overview of merged pull requests, a contributor list and a changelog link. A `.github/release.yml` file controls it — you declare categories and the pull request labels that fall into each, and you can exclude pull requests by label or by author, globally or per category (checked on docs.github.com, 9 September 2026).

**What it cannot know:** anything that is not in a title or a label. That makes it exactly as good as your pull request titles, and it has no concept of a breaking change unless you create a label for one and remember to apply it. **Use it when** the audience is developers already reading the repository, and the alternative is no notes at all.

### release-please

Parses git history for Conventional Commit messages and opens a release pull request that it keeps updated as work merges; on merge it updates the changelog, bumps versions in language-specific files, tags, and creates the GitHub release. It does not publish to package managers and does not handle complex branch management, and there is a recommended action, `googleapis/release-please-action`. Apache 2.0 licensed (checked on github.com/googleapis/release-please, 9 September 2026).

**What it cannot know:** anything absent from the commit messages. **Use it when** you want the changelog reviewed before it ships. The release pull request is the review surface, and it is the one tool here that invites a person to edit the generated text before anybody reads it — which is exactly the property that suits a team who care about the prose.

### semantic-release

Determines the next version number, generates the release notes and publishes the package, driven by commit messages under a formalised convention (Angular by default) and by git tags to find the last release. It is configured through plugins, and the four enabled by default are `commit-analyzer`, `release-notes-generator`, `npm` and `github`; writing a `CHANGELOG.md` into the repository needs `@semantic-release/changelog`, which is not one of them. MIT licensed (checked on github.com/semantic-release/semantic-release and semantic-release.gitbook.io, 9 September 2026).

**What it cannot know:** anything absent from the commit messages — and by design there is no human step, so nothing gets edited on the way past. **Use it when** the release should be a consequence of merging and nobody should have to decide anything. That is a genuine benefit and it is also the trade: fully automated releases and hand-written release notes pull against each other, and most teams settle it by publishing the generated notes for developers and writing a separate human page for everybody else.

### git-cliff

A changelog generator written in Rust that follows Conventional Commits and adds custom regex parsers for histories that do not. Configuration lives in `cliff.toml`, where you define commit parsers and groups, and the output shape is a template: it uses Tera, whose syntax is based on Jinja2 and Django templates. Available from crates.io, npm, PyPI and Docker, and dual licensed Apache 2.0 or MIT (checked on github.com/orhun/git-cliff and git-cliff.org, 9 September 2026).

**What it cannot know:** anything absent from the commit messages. **Use it when** you have an existing history that follows no convention, or when the output has to match a format somebody else specified — the regex parsers and the template together will hit almost any shape, which none of the others really promise.

### changesets

The odd one out, and the reason to look at it. Instead of reading commits, it reads Markdown files that contributors write deliberately: a changeset declares which packages changed, how much to bump each, and what to say about it. From those it bumps versions, writes changelogs and publishes, with monorepos and interdependent packages as the explicit focus. MIT licensed (checked on github.com/changesets/changesets, 9 September 2026).

**What it cannot know:** anything nobody wrote a changeset for. **Use it when** the notes matter more than the automation. Asking the author to write the sentence at the moment they make the change is the whole idea, and it sidesteps both the merge conflicts of a shared `Unreleased` block and the audience problem of commit messages. The cost is a step people forget, which is why teams who adopt it usually add a check that fails a pull request carrying no changeset.

### auto-changelog

A command line tool that generates a changelog from git tags and commit history, including merge commits and issues closed by keyword, with output as compact, Keep a Changelog or JSON. It needs no commit convention, templates with Handlebars, supports GitHub, GitLab, BitBucket and Azure DevOps, and will mark breaking changes if you hand it a `--breaking-pattern` matching however your messages flag them. MIT licensed (checked on github.com/cookpete/auto-changelog, 9 September 2026).

**What it cannot know:** anything not in a commit, a merge or a linked issue. **Use it when** you have inherited a repository with years of untidy history and want something reasonable out of it today, without rewriting anybody's commits or adopting a convention first.

## What a generated changelog leaves out

Generation is the obvious answer, and for the list of changes it is the right one. Where it fails is everything that is not a list, and the failures are consistent enough to name.

**The reason the release exists.** Twelve entries do not tell a reader that this is the release fixing the export timeouts everybody has been complaining about. Two sentences at the top of the entry do. No tool can write them, because the reason lives in support tickets and conversations rather than in commits.

**Who should skip it.** "If you do not use the SAML integration, there is nothing here for you" saves more reader time than any other sentence in a changelog, and it is the sentence a generator will never produce, because producing it requires knowing what a reader might not use.

**Severity, in either direction.** Generated output flattens everything to one line per commit. A security patch and a tooltip fix look identical, and the reader has to work out which is which from the wording. Marking the two entries that matter is a person's job.

**Known issues.** The bug you shipped with, deliberately, because the alternative was slipping the release. It appears in no commit, because it was not fixed. Leaving it out means the first person to hit it opens a ticket, and the second one, and the eleventh.

**The apology, where one is owed.** If the last release broke something in production for customers, the next release's notes are where that is acknowledged. Silence reads as not having noticed.

**What it costs.** Budget the human part at under an hour per release for one named person, plus the review of the changelog line inside each pull request, which is a glance rather than a task. That is the whole bill, and it is why the argument for full automation usually wins by default rather than on merit. The cost of not paying it is spread out and harder to see: support tickets that are really changelog questions, customers stalled three versions back because nobody could tell them whether upgrading was safe, and integrators who learn about a removed field from an error rather than from you.

The workable arrangement is both. Let a generator assemble the list from commits or changesets, then have one person add the summary, mark the severities, add the known issues and check that every Removed line has somewhere to send the reader. Generated first draft, human final pass. Neither half is optional, and the second half is the one that gets dropped.

## Who reads a release, and what each of them needs

One release page serves several people arriving with different questions. Naming them makes the omissions obvious, because most changelogs answer the first question and ignore the other two.

| Reader | Arrives asking | Needs on the page | Leaves without it |
| --- | --- | --- | --- |
| The upgrader | Should I take this now? | Whether anything breaks, the size of the change, and a reason to bother | Stays on the old version indefinitely |
| The integrator | Will my code still work? | Every removal and behaviour change, named exactly as their code names it | Finds out from a 4xx in production |
| The operator | What happens when I deploy it? | Migrations, restarts, config changes, resource shifts, rollback | Meets the schema migration during the deploy |

### The upgrader

Somebody on version 1.2 deciding whether to spend an afternoon on 1.4. What they need first is a yes or no on breakage, then a one-sentence reason the release exists. If they are skipping versions they need the entries for everything in between, which is an argument for one file with the whole history rather than a page per release. Notes that lead with new features are answering the question this reader asked second.

### The integrator

Somebody whose code calls yours. They do not care what the release is about; they care whether any of the six or seven names they depend on appear in Removed or Changed. This reader is why entries must use the exact identifier — `api_key`, `POST /v2/exports`, `EXPORT_TIMEOUT_MS` — because they will search the page for the string their own code contains. Prose that says "the export configuration setting" is unsearchable and therefore useless to them.

### The operator

Somebody deploying it. Their questions are barely about the software: does this need a migration, does it need a restart, does it change memory or connection use, can it be rolled back after the migration has run, and does the old version keep working while both are live. Almost no changelog answers these, and it is the omission that turns a routine upgrade into an incident. A short "Deploying this release" block at the top of any entry that needs one is enough.

## Write the entry, not the ticket title

A release notes template only helps if the lines inside are written for a reader:

- Lead with the noun they know — the endpoint, the setting, the menu item — not the module that contains it.
- Say what is true now. "Exports run in the background" beats "Changed exports to run in the background".
- Name things exactly as they appear in the product: `api_key`, not "the API key setting".
- Give every breaking line an action and a deadline. "Switch to `/v2/exports` before 3.0" is a note. "Endpoint deprecated" is a shrug.
- One line per change. If it needs three sentences, link to a page with room for them.

Real figures belong here — sizes, timeouts, retry counts, dates. "Improved performance" is filler, because the reader cannot check it and cannot act on it.

### Migration instructions as part of the entry

A Removed or Changed line that describes the destination but not the journey has moved the work to the reader, who has less context than you do. The fix is small: two or three extra lines, indented under the entry, saying what to change and what happens if they do not.

```markdown
### Removed
- `GET /v1/export`. Use `GET /v2/exports`. The response body is identical
  apart from `id`, now a string rather than an integer. Requests to the old
  path return 410 with a `Link` header pointing at the replacement.

  **Migrating:** change the path, and stop parsing `id` as an integer.
  The official clients do both for you from 2.2 onwards, so upgrading the
  client first is the shorter route.

### Deprecated
- `apiKey` in `config.yaml`, in favour of `api_key`. Both are read in all
  1.x releases; the old name logs a warning at startup. It is removed in
  2.0, not before 1 March 2027.
```

Three things make that work. It names the failure mode, so a reader can recognise it in their own logs. It gives a date rather than a version alone, because "before 2.0" is unschedulable when nobody knows when 2.0 is. And it offers the cheaper path first, which is what a reader with one afternoon actually wants.

### Deprecation notices that survive being ignored

A deprecation is a message sent to somebody who is busy, so assume it is missed. The version that works arrives three times: in the release notes when it starts, in the software itself as a warning naming the replacement, and in the release notes again when the removal lands. Repeat the entry in Deprecated in every intervening release. Somebody upgrading from 1.1 to 1.9 in one jump reads one entry, and it needs to be the one still standing.

Two failure modes are worth avoiding. A warning with no replacement named — "this setting is deprecated" — sends the reader to search, and they will find a forum post rather than your documentation. And a removal that lands earlier than announced destroys the value of every future deprecation you write, because the dates stop being information.

## How to run a release-notes process that keeps working

1. **Name an owner per release.** A rota is fine and a shared responsibility is not, because a changelog with no owner is written by whoever notices last, on the evening of the release, from `git log`.
2. **Write the entry in the pull request that makes the change**, either as a line under `Unreleased` or as a changeset file, so the description is written by the person who knows why and reviewed by the person reviewing the change.
3. **Write down what counts as a breaking change for your project, and where the public surface ends.** Without it, every release repeats the same argument and the answer varies with whoever is most tired.
4. **Make the omission visible in review.** A check that fails a pull request touching public behaviour with no changelog line costs an afternoon to build and removes the enforcement conversation permanently.
5. **Give every Removed and Deprecated line an action and a date.** Both halves are load-bearing: the action tells the reader what to change, the date tells them when it has to be done by, and only the pair of them is something a team can put into a sprint.
6. **Keep the file in the repository, in Markdown, and derive everything else from it** — one source that diffs and reviews, [the way the rest of the documentation should live there](/blog/documentation-that-lives-in-the-repo), with the website version, the email and the release page as renderings rather than copies.
7. **Have somebody outside the team read the top section before it ships.** Support is the ideal reader: if they cannot tell what changed, the customers they answer to will not either, and you will find that out through tickets.

## From CHANGELOG.md to a page you can send

The file in the repository serves people who read the repository. Support, sales and customers need a link, and that is where release notes usually stall.

Dropping `CHANGELOG.md` into transformpipe gives you one self-contained `.html` file — inline styles, no scripts, no network requests — to attach to an email or publish as a read-only page. That property is worth understanding before you send anything: a [single file that asks the network for nothing](/blog/self-contained-html-explained) opens the same on a laptop with no connection as it does on yours, and it will still open in five years. Revoking that link later stops one you have already sent, which [sharing a Markdown document as a link](/blog/share-a-markdown-document-as-a-link) covers in full. If the release also ships with a covering note and an upgrade guide, dropping all three at once [chains them into one document](/blog/merging-many-markdown-files) in order.

For a release that is cut by CI, the same thing runs unattended:

```bash
node cli/tp.mjs push CHANGELOG.md --name "Release 1.4.0" --share link
```

The GitHub Action covers the pull-request half, publishing the Markdown a pull request changed and commenting the links back — see [publishing Markdown from GitHub Actions](/blog/publish-markdown-from-github-actions). A generator that opens a release pull request pairs well with this: the notes get reviewed as text while the diff is still open, and the published page comes from the file that was approved rather than from a copy somebody pasted.

Before any of that, a short check on the top section:

- [ ] Every Removed and Changed line tells the reader what to do.
- [ ] No line names a file, module or ticket number the reader cannot see.
- [ ] The version and date match the tag.
- [ ] Breaking changes and security fixes are marked as such, not left level with the rest.
- [ ] Someone outside the team read it and could say what changed.

Open your changelog and read its most recent section as a customer would. Cut the lines that fail the three tests, add the missing action to every breaking change, write the two sentences no generator can write, then convert it and send the link — [turning that Markdown into a self-contained HTML file](/) takes about as long as reading this paragraph, free, in the browser, with nothing uploaded when you are signed out.

## FAQ

### What is the difference between a changelog and release notes?

A changelog is the cumulative file, newest version first, recording every release. Release notes are one version's worth of it, written for a particular audience and often carrying a summary and migration guidance the file does not. In practice the changelog is the source and the release notes are a rendering of one section of it.

### Do I have to use Keep a Changelog?

No, but its six categories are a better starting point than anything you will invent under time pressure, and readers who have seen them elsewhere already know where to look. The specification is short and MIT licensed (checked on keepachangelog.com, 9 September 2026). The parts worth keeping regardless are grouping by consequence, an `Unreleased` heading, and ISO dates.

### Should I generate my changelog from commit messages?

Generate the list, write the summary. Tools like release-please, git-cliff and semantic-release will sort conventional commits into sections and calculate the version, which removes the tedious half of the job. They cannot say why the release exists, which entries are urgent, or who can skip it, and those are the lines readers remember.

### What counts as a breaking change?

Semantic versioning defines MAJOR as an incompatible API change and requires that you declare your public API precisely (checked on semver.org, 9 September 2026), so the answer depends on what you promised. Removing or renaming anything callable, changing a field's type, tightening validation and dropping runtime support are breaking almost everywhere. Write your own list down before the argument rather than during it.

### Where should the changelog live, the repository or the website?

The repository, as `CHANGELOG.md`, because that is where it diffs and gets reviewed alongside the change that caused it. Publish from it to wherever readers are — a website, a release page, an emailed file — rather than maintaining a second copy, which will drift within two releases.

### How long should a single entry be?

One line for most changes, plus two or three indented lines for anything needing migration. If an entry needs a paragraph it needs a page: link to that page from the entry and keep the list scannable, because the list's job is to help someone decide whether to read further.

### Do internal services need release notes?

Yes, and they are cheaper to write, because you know exactly who your readers are and what they call things. The teams consuming your service need the same three answers — what broke, what changed, what to do about it — and a message in a channel that scrolls away is not a changelog.
