---
title: Documentation that lives next to the code
description: Why documentation in the repository stays closer to true - the four kinds of docs, a directory that scales, review that catches drift, and where it fails
updated: 2026-09-09
date: 2026-07-29
tag: Workflow
keywords: documentation in markdown, docs as code, readme template, readme best practices, write a good readme, internal documentation tool, docs in git, diataxis, architecture decision record, docs directory structure, contributing file, markdownlint, vale prose linter
---

The wiki page says the service listens on 8080. It moved to 8443 last spring. Nobody lied: the engineer who moved the port edited a config file, a test and a deployment manifest, none of them near the sentence that is now wrong.

That is the argument for docs as code. Markdown in the repository does not make a document correct. It puts the wrong sentence in front of the person about to make it wrong, while the file is still open.

It is not a free win, and most teams that try it end up with a `docs/` folder nobody opens. The difference between the two outcomes is not the tooling. It is whether the documents are sorted by what the reader came to do, whether somebody is named on each one, and whether the review that catches a wrong port is the same review that catches a wrong function name.

### TL;DR

Put anything a commit can falsify into the repository, and review the paragraph in the same pull request as the behaviour it describes — that is the whole mechanism, and everything else is support for it. Sort the files by the four kinds of documentation so a reader knows which file answers their question, keep decisions as dated records rather than design documents, and let `CODEOWNERS`, a Markdown linter, a prose linter and a link checker fail the build on the cheap mistakes. Then publish the rendered pages, because the people who most need the documentation cannot clone a repository and should not be asked to.

## What the repository actually gives you

**The same review.** A pull request that changes behaviour and touches no documentation is a visible omission — the reviewer can see the gap while the change is still in front of them. Fixing the wiki afterwards is a separate task, and separate tasks lose to whatever is on fire.

**The same history.** `git log -S'8080' -- docs/` finds the commit that added or removed a string, which dates a sentence that went wrong. `git blame` gives you the commit behind a paragraph, and from there the pull request and the reasoning the prose never got. Wiki histories store revisions, rarely decisions.

**The same tooling.** Docs in git are text files: grep finds them, and a link checker can fail the build on a dead relative path. Documentation for an unreleased feature sits in the branch with the code and ships when it merges — not a week early, not a month late.

**The same addresses.** A relative link from one file to another is a path a tool can resolve and a build can fail on. A wiki link is a URL, and a wiki page that gets renamed leaves every link to it pointing at nothing, discovered months later by a reader who assumes the document was deleted on purpose.

**The same release.** Documentation that merges with the code cannot describe a version that is not out yet, and cannot lag one that is. On a wiki, the page and the deployment are two events somebody has to remember to line up, and the gap between them is exactly where the wrong port number lives.

The honest limit: none of this makes anyone write the document. It makes not writing it visible, which is a smaller claim than docs-as-code advocacy usually makes.

## The four kinds of documentation, and why mixing them hides all four

Most internal documentation is unsearchable for a reason that has nothing to do with search. A page called "Getting started" opens as a lesson, turns into a list of configuration keys three screens down, and ends with two paragraphs on why the team chose Postgres. Every part of it is accurate. None of it is findable, because the reader looking for the configuration key does not open a page called "Getting started", and the reader learning the system stops reading at the table.

Diátaxis is the framework that names the problem. It is the work of Daniele Procida, and it identifies four kinds of documentation that serve four different user needs: tutorials, how-to guides, technical reference and explanation (checked on diataxis.fr, 9 September 2026). The claim that makes it useful is not that four categories exist. It is that a single document can only serve one of them well, and that a document trying to serve two serves neither.

| Kind | Oriented towards | The reader's question | What it looks like | How it goes wrong |
| --- | --- | --- | --- | --- |
| Tutorial | Learning | "Teach me this" | A practical activity from nothing to a result that works | It assumes a step the beginner has not taken, and they lose confidence |
| How-to guide | A goal | "How do I do X?" | Directions through a problem, for someone already competent | It stops to explain, and the competent reader loses the thread |
| Reference | Information | "What are the options?" | Neutral description of the machinery, mirroring the code's structure | It advises, speculates or sells, and stops being trustworthy |
| Explanation | Understanding | "Why is it like this?" | Discursive treatment that permits reflection, read away from the work | It turns into instructions nobody follows |

The distinctions are sharper than they look. Diátaxis is explicit that how-to guides are wholly distinct from tutorials and that the two are constantly confused: a tutorial serves a learner who does not yet know what they want, while a how-to guide serves the work of the already-competent user who does. Reference is meant to be austere — its job is certainty, and the site's line for it is that one hardly reads reference material, one consults it, with a structure that mirrors the structure of the product (checked on diataxis.fr, 9 September 2026). Explanation is the one with no natural boundary, which is why it sprawls into everything else if you let it.

**What this changes in a repository.** Sorting by kind is nearly free when the documents are files. A directory per kind is the obvious move:

```
docs/
  tutorials/       first-deploy.md
  how-to/          rotate-the-signing-key.md, restore-from-backup.md
  reference/       configuration.md, http-api.md, error-codes.md
  explanation/     why-we-left-the-monolith.md
  decisions/       0007-postgres-over-dynamodb.md
```

If four directories is more ceremony than your repository deserves, the cheaper version works: name each file by its kind and keep the kinds unmixed inside it. `restore-from-backup.md` is a how-to and should contain no paragraph explaining the backup format; the explanation gets its own file and a link. The test is a single sentence — if you cannot say which of the four a document is, it is two documents.

**Why this is the section that pays.** The other failures in this piece are recoverable. A stale sentence gets fixed once someone notices; a missing linter gets added in an afternoon. A documentation set sorted by team, by service or by the order things were written stays unfindable forever, because nothing about it tells a reader where to look, and the usual response — adding a page that indexes the other pages — creates a fifth document that also goes stale.

## A docs directory that scales

Repositories fail at documentation in two directions. One puts everything in the README until it is four thousand words and nobody reads past the install command. The other creates `docs/` on day one, fills it with three stubs and an `architecture.md` that describes a design abandoned in the second month. What works is a small number of files with distinct jobs, each of which somebody can tell is wrong.

| File | What it is | Who writes it | What makes it wrong |
| --- | --- | --- | --- |
| `README.md` | The index and the shortest path to a running copy | Whoever changes the setup | A command that no longer works |
| `docs/` | Everything that outgrew the README, sorted by kind | The person changing the behaviour | A commit to the code it describes |
| `docs/decisions/` | One dated record per architectural decision | The person who made the call | Nothing — a superseded record stays true about its own moment |
| `CONTRIBUTING.md` | How to propose a change and what will be checked | The maintainers | A change to the review process or the toolchain |
| `CHANGELOG.md` | What changed for a reader, per release | Whoever ships | A release that goes out without an entry |
| `CODEOWNERS` | Who gets asked to review which paths | The team leads | A team rename, a person leaving |

**The README is an index, not a manual.** Its job is to get a stranger to a working copy and then point at everything else. Every section that grows past a screen becomes a file in `docs/` with a one-line pointer left behind. This is the single most reliable structural rule here, because a README that stays short stays read, and a README nobody reads is where wrong setup instructions hide longest.

**`docs/` holds what a commit can falsify.** Configuration keys, API behaviour, deployment steps, error codes, the runbook for the alert that pages at three in the morning. These are the documents whose wrongness is caused by a change to the code, which is precisely why they belong beside it. Anything whose wrongness is caused by a decision rather than a commit gains nothing from git.

### Decision records, and why they beat a design document

A design document describes a system as somebody hoped it would be, on a date the document rarely carries, and it becomes wrong the first time the plan changes. Nobody updates it, because updating it means rewriting a narrative, and nobody deletes it, because it might still be right somewhere.

An architectural decision record is a different shape. It captures a single decision and its rationale — a justified design choice addressing a requirement that is architecturally significant — along with the trade-offs and consequences that came with it. The practice was popularised by Michael Nygard in a 2011 post, "Documenting Architecture Decisions", and the format builds on earlier work by Zdun and others on sustainable architectural decisions (checked on adr.github.io, 9 September 2026). Nygard's template is the one most teams start from; MADR — Markdown Architectural Decision Records — is a streamlined template for the same job, dual licensed MIT or CC0 (checked on adr.github.io, 9 September 2026).

```markdown
# 7. Postgres over DynamoDB for the ledger

- Status: accepted
- Date: 2026-03-04
- Deciders: payments team

## Context

We need transactional writes across the ledger and the balance
cache. The rest of the estate is DynamoDB.

## Decision

Postgres, on the managed instance the billing service already uses.

## Consequences

One more datastore to operate, and a second connection pool in the
worker. In exchange, the double-write bug that closed BILL-412
becomes structurally impossible rather than tested for.
```

The reason a record outlives a design document is that it is never wrong. It is a statement about what a team knew and chose on a date. When the decision is reversed, you do not edit record 7 — you write record 12, set 7 to superseded, and link the two. The result is a directory that reads as a history of reasoning, which is the thing a new engineer actually needs and the thing `git log` never quite gives, because a commit records what changed and not what was rejected.

Numbering the files (`0007-postgres-over-dynamodb.md`) keeps them ordered and gives each one a stable name to cite in a pull request. Keep them short. A record that takes an hour to write will not get written, and the four headings above are enough to answer the question a year from now, which is always some version of "why on earth is it like this".

### CONTRIBUTING, and the checks it should name

`CONTRIBUTING.md` can live in the repository root, in `docs/`, or in `.github/`, and GitHub surfaces a link to it when somebody opens a pull request or an issue, as well as in the repository sidebar (checked on docs.github.com, 9 September 2026). That placement is the whole value: it is the one document a first-time contributor sees at the moment they need it.

Keep it to what a contributor has to do, not what the project believes. The steps to run the tests, the commit message convention if there is one, what CI will check and therefore what will fail, how long review usually takes, and where to ask. If your documentation lives in `docs/`, this is also where you say so — a contributor who does not know the docs are in the repository will not go looking for them.

### CHANGELOG, and why it is not the commit log

The changelog is the one file in the directory written for someone outside the repository. Keep a Changelog is the convention worth adopting, partly for its six categories — Added, Changed, Deprecated, Removed, Fixed, Security — and mostly for its argument that a commit log makes a bad changelog because it is full of noise: merge commits, obscure titles, documentation churn (checked on keepachangelog.com, 9 September 2026). A commit documents a step in the evolution of the source. A changelog entry documents a noteworthy difference, often spanning several commits, for a reader who has never seen the code. [Turning that file into notes people actually read](/blog/release-notes-from-markdown) is a separate craft, and the failure mode is always the same: shipping the diff instead of the consequence.

## The tooling, compared

You can run a documentation set out of a repository with no generator at all: Markdown files, a converter when somebody needs a page, and nothing to maintain. That stops working at the point where readers need navigation, search across documents, and a stable URL per page. The tools below are the ones worth knowing before you pick.

| Tool | What it needs | What it builds | Licence | Who it suits |
| --- | --- | --- | --- | --- |
| Plain Markdown plus a converter | Nothing, if the converter runs in a browser | One self-contained HTML file per document | Varies by converter | A handful of runbooks and READMEs; documents with a named recipient |
| MkDocs | Python | A static HTML site from Markdown and one YAML config file | BSD 2-Clause | Python projects that want a docs site the same afternoon |
| Material for MkDocs | Python, as an MkDocs theme | The same site, with built-in search, navigation and social cards | MIT, with early access to new features for sponsors | Teams who want it to look right without writing CSS |
| Docusaurus | Node.js, React | A static site with MDX pages and versioned documentation | MIT (its own docs are Creative Commons) | Product docs that must serve several released versions at once |
| Sphinx with MyST | Python | HTML, LaTeX for PDF, ePub and Texinfo from one source | BSD 2-Clause; MyST-Parser is MIT | API reference generated from source, and anything needing PDF |
| Hugo | Nothing beyond the binary; written in Go | A static site of any shape, not only docs | Apache 2.0 | Documentation that shares a site with marketing pages |
| mdBook | Nothing beyond the binary; written in Rust | An online book with chapters and a table of contents | MPL 2.0 | Linear material — handbooks, guides, training |
| Docsify | A web server; it loads from a CDN | No static files at all: it renders the Markdown in the browser | MIT | A `docs/` folder you want served without adding a build step |

Checked on mkdocs.org and github.com/mkdocs/mkdocs, squidfunk.github.io/mkdocs-material, docusaurus.io and github.com/facebook/docusaurus, sphinx-doc.org and github.com/sphinx-doc/sphinx, github.com/executablebooks/MyST-Parser, gohugo.io, github.com/rust-lang/mdBook and github.com/docsifyjs/docsify, 9 September 2026.

**MkDocs** is the shortest distance between a directory of Markdown and a documentation site: one YAML file, one command, static HTML out (checked on mkdocs.org, 9 September 2026). It is written in Python and BSD 2-Clause licensed. If your project is already Python, there is nothing to argue about.

**Material for MkDocs** is a theme rather than a generator, and it is the reason most people meet MkDocs at all. It supplies search, responsive navigation and social card generation without any CSS from you, under the MIT licence, with an Insiders programme that gives sponsors early access to new features (checked on squidfunk.github.io, 9 September 2026). The trade is that your site will look like a great many other sites, which for internal documentation is a feature.

**Docusaurus** is built on React and MDX and produces static HTML files, with document versioning as a first-class feature (checked on docusaurus.io, 9 September 2026). Versioning is the reason to choose it: if you support three releases and each needs its own documentation tree, nothing else here does that as cleanly. The cost is a Node toolchain and the possibility that your documentation acquires React components, which are code, which means the documentation now has a build that can break.

**Sphinx** is the oldest and the most capable, generating HTML, LaTeX for PDF, ePub and Texinfo from one source, and it is BSD 2-Clause and written in Python (checked on sphinx-doc.org and github.com/sphinx-doc/sphinx, 9 September 2026). Its native markup is reStructuredText, which is a real barrier for contributors who only know Markdown; MyST-Parser removes it by adding an extended CommonMark parser to Sphinx, MIT licensed, built on markdown-it-py (checked on github.com/executablebooks/MyST-Parser, 9 September 2026). Pick this when you need generated API reference and a PDF from the same source.

**Hugo** is a single Go binary under the Apache 2.0 licence that builds static sites of any shape, documentation among them (checked on gohugo.io, 9 September 2026). Choose it when the docs are one section of a larger site, or when nobody wants to manage a Python or Node environment on the build runner.

**mdBook** is a Rust utility, MPL 2.0 licensed, that turns Markdown into an online book (checked on github.com/rust-lang/mdBook, 9 September 2026). Books are linear, which is exactly wrong for reference and exactly right for a handbook or a training course you expect to be read front to back.

**Docsify** is the odd one: it builds nothing. It loads from a CDN, renders your Markdown in the browser at request time, and produces no statically built HTML at all, under the MIT licence (checked on github.com/docsifyjs/docsify, 9 September 2026). That removes the build step entirely, at the price of a site whose content is invisible to anything that does not run JavaScript.

**And no generator at all** remains a real answer, more often than the list above suggests. If what you have is eleven Markdown files and an occasional need to hand one to a person who does not use git, a converter and a link beat a build pipeline you have to keep green. The threshold is navigation: the moment a reader needs to move between documents without knowing their filenames, you want a generator, and [the three questions that decide whether you have crossed it](/blog/static-site-generator-or-converter) are worth answering before you install one.

## Review is what keeps a document true

Every mechanism in this piece resolves to one habit: the paragraph changes in the same pull request as the behaviour. Everything else exists to make that habit hold when the person is tired and the release is Friday.

**The docs change rides with the code change.** Not a follow-up issue, not a ticket in the next sprint. A reviewer who sees a renamed configuration key and no change under `docs/reference/` asks for one, and asking costs a comment. The same request a week later costs a meeting, and the week after that it costs nothing because nobody remembers.

**`CODEOWNERS` puts a name on the directory.** The file lives in `.github/`, the repository root or `docs/` — GitHub searches in that order and uses the first one it finds — and code owners are automatically requested for review when a pull request touches paths they own, though not on draft pull requests. It only becomes a gate when an administrator enables required reviews and requires code owner approval. The syntax resembles gitignore, and the last matching pattern wins, which catches people out (checked on docs.github.com, 9 September 2026).

```
/docs/reference/http-api.md   @acme/platform
/docs/how-to/                 @acme/sre
/docs/decisions/              @acme/architecture
```

Two rules make it useful rather than decorative. Own directories, not the whole tree, because a single owner on `docs/` means every documentation change waits on the same three people and the queue teaches everyone to route around it. And keep the last-match rule in mind: a broad pattern at the bottom of the file quietly overrides every specific one above it.

**Linting catches the things review is bad at.** Reviewers read for meaning and miss structure. Machines do the reverse.

| Check | Tool | What it catches | Licence |
| --- | --- | --- | --- |
| Markdown structure | markdownlint | Heading levels that skip, inconsistent list markers, trailing whitespace, unclosed fences | MIT |
| Prose | Vale | Terminology drift, banned words, style rules from your own guide | MIT |
| Links | lychee | Dead relative paths, broken anchors, external URLs that stopped resolving | Apache 2.0 or MIT |

markdownlint is a Node.js style checker for Markdown and CommonMark with more than sixty built-in rules, MIT licensed, run through `markdownlint-cli2` or a GitHub Action (checked on github.com/DavidAnson/markdownlint, 9 September 2026). Turn on a small set and leave the rest off — a documentation set that fails CI on line length trains contributors to add `<!-- markdownlint-disable -->` and stop reading the output.

Vale is a markup-aware prose linter, MIT licensed, that understands document structure rather than pattern-matching the raw text, and reads its rules from a `.vale.ini` in the repository. You can start from published styles — Microsoft's and Google's among them — or write your own in YAML (checked on vale.sh, 9 September 2026). The rules worth having first are terminology, not style: one spelling of your own product name, one word for the thing you keep calling three things.

lychee is a fast async link checker written in Rust, dual licensed Apache 2.0 or MIT, with an official `lycheeverse/lychee-action` for workflows (checked on github.com/lycheeverse/lychee, 9 September 2026). Run internal links on every pull request and external links on a schedule — external checks fail for reasons that have nothing to do with your change, and a flaky required check gets ignored, then removed.

**Fail the build, but only on what a reader would notice.** A broken relative link is a reader hitting a 404, so it should block a merge. A missing full stop in a bullet list is not, so it should not. The list of blocking checks is a promise about what will never reach a reader, and every item on it that does not meet that bar makes the whole list less credible.

## Staleness, and why "last updated" beats a version number

A document does not announce that it has gone wrong. It sits there being confident. The countermeasure is not discipline — it is metadata that makes age visible, and a cadence that acts on it.

Put a small block of front matter at the top of anything that goes stale on a schedule:

```markdown
---
title: Restoring the ledger from backup
owner: payments
last-checked: 2026-09-09
review: quarterly
---
```

Three fields, each doing one job. `owner` is a team, not a person, because people change teams and a name that has left is worse than no name. `last-checked` is the date somebody read the document and confirmed it still worked — not the date of the last commit, which changes when you fix a typo and tells the reader nothing. `review` is how long the sentence is trusted for.

**Why "last checked" beats a version number.** A version number tells the reader which release the document described. It does not tell them whether anyone has looked at it since, and it goes stale in the most misleading way possible: a document stamped `v4.2` next to a `v4.9` product looks obsolete even when every word still holds, while a document with no stamp at all looks current forever. A date is unambiguous. "Last checked 14 months ago" is a fact the reader can act on without knowing anything about your release cadence, and it is the same fact whether you ship weekly or twice a year. Converters and static site generators treat front matter differently — some strip it, some render it as a paragraph of `key: value` lines at the top of the page — so it is worth knowing [what your toolchain does with the header](/blog/front-matter-and-what-converters-do-with-it) before you rely on it being displayed.

**The cadence has to be small enough to happen.** A quarterly review of forty documents is a day nobody has. A quarterly review of the six documents that page someone at night is an hour, and those six are where wrongness costs the most. Sort by consequence: runbooks and setup instructions first, reference next, explanation last — explanation ages slowly because the reasons a system is shaped a certain way rarely change without a decision record to mark it.

**Habits that keep it honest.**

- [ ] Documentation changes ride in the same pull request as the behaviour they describe.
- [ ] Every document names an owner; `CODEOWNERS` does this without a meeting.
- [ ] Rewrite the wrong paragraph rather than appending a correction under it.
- [ ] Anything that goes stale on a schedule carries the date it was last checked.
- [ ] Documents nobody will maintain get deleted, not labelled "may be out of date".

The last one causes the most argument and matters most. A deleted page sends the reader to ask a person; a stale page sends them confidently to the wrong port. The intermediate move — a banner reading "this page may be out of date" — is the worst of the three, because it transfers the risk to a reader with no way to evaluate it and lets the team feel the problem has been handled.

**One more failure worth naming.** Setup instructions rot faster than anything else and are discovered last, because only new joiners run them and a new joiner assumes the fault is theirs. They will spend two hours before asking. The fix is cheap and nobody does it: whoever joins next fixes the README as their first pull request, while the pain is fresh and before they have learned the workarounds that make the wrongness invisible.

## Where docs as code falls down, and what actually works instead

Here is the part the advocacy leaves out. The people who most need internal documentation are frequently the people who cannot get to it.

The support lead needs the escalation path at the moment a customer is shouting. A new designer needs the onboarding guide before their accounts exist. A salesperson needs the answer to "does it do SSO" in the middle of a call. GitHub renders Markdown well, but reaching that rendering costs an account, repository access and an SSO round trip, and a file tree asks a non-engineer to operate somebody else's internal documentation tool. "Raise a pull request against the docs" is a sentence that ends the conversation. It is heard as *this is not for you*, and it is heard correctly, because the person saying it has just described a workflow with a branch, a fork, a review and a merge queue in it to somebody whose job is answering tickets.

Search is the second gap, and it is worse than it looks. Company search indexes the wiki, the shared drive and the ticket system. Code search does span an organisation's repositories, but it ranks code, and it asks the reader to guess which repository holds the answer — a guess an engineer makes correctly and nobody else does. The result is a documentation set that is complete, correct, and invisible to most of the company.

The third is review load. A typo fix becomes a branch, a pull request and a wait. Engineers barely notice; someone who writes twice a year gives up, and their knowledge stays in their head. This is a real loss, not a small one — the support engineer who has answered the same question forty times knows something no engineer knows, and the contribution path you have built guarantees they will never write it down.

**What actually works.** Three things, in order of how much they buy.

First, split by what can falsify a document, not by who wrote it.

| Document | Where it belongs | What makes it wrong |
| --- | --- | --- |
| Setup, configuration, API behaviour, deployment | The repository | A commit |
| Runbooks | The repository, published as a page | A rename in the code they call |
| Escalation paths, onboarding, "how do I ask for X" | The wiki, or wherever support already lives | A process change, not a commit |
| HR policy, meeting notes, decision logs | The wiki | A decision, not a commit |

Moving that last group into git buys only friction. Moving the first group out of it buys drift.

Second, publish the rendered pages, so the source of truth and the reading surface are different things. The reader gets a URL; the repository keeps the file. Nobody outside the team ever learns what a branch is.

Third, make the contribution path match the contributor. An engineer sends a pull request. A support engineer sends a message to the channel named in `CODEOWNERS`, or files an issue from a template, and somebody who is already in the repository writes the paragraph. The knowledge is what you want, not the git commit — insisting on the second is how you lose the first.

**Publishing, concretely.** The source of truth does not have to be the reading surface. Render the Markdown and hand people a page. That can be as small as dropping the file on transformpipe and sending the self-contained HTML, or [publishing a read-only link](/blog/share-a-markdown-document-as-a-link): "anyone with the link" for a public runbook, "only these addresses" for anything internal. Revoking drops the token, so a link already sent stops working. It scales up to [a GitHub Action that publishes the Markdown a pull request changed](/blog/publish-markdown-from-github-actions), or a `tp push` step [in the release script](/blog/markdown-to-html-from-the-command-line).

A self-contained file matters more here than it sounds. A page that pulls its stylesheet from a CDN stops looking right the moment somebody opens it on a plane, and it tells whoever opens it something about where the file has been. One file with its styles inline opens the same everywhere, including from an email attachment on a laptop with no connection, which is the situation an escalation runbook is most likely to meet.

Know when this is the wrong shape. A page per document suits a document with a recipient: a runbook, a decision record, release notes, a README going to a client. A set that has crossed the navigation threshold described earlier wants a generator instead, and the page is a supplement to it rather than a replacement.

## How to decide what lives where

1. **Ask what would make the document wrong.** If the answer is a commit, it belongs in the repository, because that is the only place the change and the sentence meet. If the answer is a decision or a conversation, git buys you friction and costs you the audience.
2. **Name which of the four kinds it is before you write a line.** A document you cannot classify is two documents, and shipping it as one guarantees that neither of its readers finds it.
3. **Give every document an owner and a date.** An unowned document is one nobody is asked about, and an undated one is one nobody can judge; both survive review indefinitely because there is nothing concrete to object to.
4. **Put the review where the change happens.** Docs in the same pull request as the behaviour cost a comment; docs in a follow-up ticket cost a sprint and usually never arrive.
5. **Automate only what a reader would notice.** A dead link and a wrong product name are worth failing a build over. Line length is not, and a build that fails on it trains people to disable the check that also catches the dead link.
6. **Choose a generator by what breaks without it.** If nobody is lost without navigation and search, a converter and a link are less to maintain than a build; if readers cannot find the second document, you needed a generator two months ago.
7. **Give non-engineers a reading surface and a contribution path that is not git.** Otherwise the documentation is correct, current, and read by the eight people who wrote it.

## Conclusion

The wiki drifts because it is not where the change happens; the repository holds because it is. That is the whole argument, and it survives contact with reality only if the people who cannot use git still get a page they can open. Pick the document that is most wrong today — usually the setup instructions — fix it in a branch, review it like code, and then send whoever needed it last week a link rather than a repository path. [Converting the Markdown to a self-contained HTML file](/) takes about as long as attaching it, happens in your browser with nothing uploaded, and the full set of options is in [the docs](/docs).

## FAQ

### What is Diátaxis, and do I have to adopt all of it?

Diátaxis is a documentation framework by Daniele Procida that sorts documentation into tutorials, how-to guides, reference and explanation according to the reader's need (checked on diataxis.fr, 9 September 2026). You do not have to adopt the directory structure or the vocabulary. The useful part is the test: name which of the four a document is before you write it, and split it if you cannot.

### Should documentation live in the same repository as the code it describes?

For anything a commit can make wrong, yes — that is the entire mechanism, and a separate docs repository reintroduces the gap you were trying to close. For documentation spanning many services, a separate repository is defensible, but expect the same drift the wiki had, because the change and the sentence are once again in different pull requests.

### What is the difference between an ADR and a design document?

A design document describes an intended system and goes wrong when the plan changes. An architectural decision record captures one decision, its context and its consequences on a date, and stays true forever because it is a statement about a moment (checked on adr.github.io, 9 September 2026). You supersede a record with a new one rather than editing it.

### Do I need a static site generator for internal docs?

Not until readers need to move between documents without knowing filenames. Below that threshold, Markdown files plus a converter is less to maintain and never breaks the build. Above it, pick from the table above by what your team already runs — Python teams reach for MkDocs, Node teams for Docusaurus, and anyone wanting one binary for Hugo or mdBook.

### How do I stop documentation going stale without a full-time writer?

Make age visible and make the review small. A `last-checked` date in the front matter tells a reader what a version number cannot, and a quarterly pass over only the documents whose wrongness pages someone at night is an hour rather than a day. Delete anything nobody will maintain instead of labelling it doubtful.

### How do non-engineers read documentation kept in a repository?

Give them a rendered page, not a repository path. Publishing the Markdown as a self-contained HTML file or a read-only link means they get a URL that opens anywhere, with no account, no repository access and nothing to install — and for contributions, route them through the channel named in `CODEOWNERS` rather than through a pull request.

### Which linters are worth putting in CI for documentation?

Three, and only on rules a reader would notice: markdownlint for structure, Vale for terminology, and a link checker such as lychee for dead paths (checked on github.com/DavidAnson/markdownlint, vale.sh and github.com/lycheeverse/lychee, 9 September 2026). Run internal link checks on every pull request and external ones on a schedule, because an external URL failing on a Tuesday has nothing to do with your change.
