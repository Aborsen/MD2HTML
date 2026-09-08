---
title: Documentation that lives next to the code
description: Why documentation in the repository stays closer to true, where docs as code breaks down for non-engineers, and what a good README contains
date: 2026-07-29
tag: Workflow
keywords: documentation in markdown, docs as code, readme template, readme best practices, write a good readme, internal documentation tool, docs in git
---

The wiki page says the service listens on 8080. It moved to 8443 last spring. Nobody lied: the engineer who moved the port edited a config file, a test and a deployment manifest, none of them near the sentence that is now wrong.

That is the argument for docs as code. Markdown in the repository does not make a document correct. It puts the wrong sentence in front of the person about to make it wrong, while the file is still open.

## What the repository actually gives you

**The same review.** A pull request that changes behaviour and touches no documentation is a visible omission. A reviewer asks for the paragraph before approving, where asking is cheap. Fixing the wiki afterwards is a separate task, and separate tasks lose to whatever is on fire.

**The same history.** `git log -S'8080' -- docs/` finds the commit that added or removed a string, which dates a sentence that went wrong. `git blame` gives you the commit behind a paragraph, and from there the pull request and the reasoning the prose never got. Wiki histories store revisions, rarely decisions.

**The same tooling.** Docs in git are text files: grep finds them, and a link checker can fail the build on a dead relative path. Documentation for an unreleased feature sits in the branch with the code and ships when it merges — not a week early, not a month late.

The honest limit: none of this makes anyone write the document. It makes not writing it visible, which is a smaller claim than docs-as-code advocacy usually makes.

## Where it falls down

The support lead needs the escalation path. A new designer needs the onboarding guide before their accounts exist. GitHub renders Markdown well, but reaching that rendering costs an account, repository access and an SSO round trip. A file tree asks a non-engineer to operate somebody else's internal documentation tool.

Search is the second gap. Company search indexes the wiki. Code search does span an organisation's repositories, but it ranks code, and the reader has to guess which one holds the answer.

The third is review load. A typo fix becomes a branch, a pull request and a wait. Engineers barely notice; someone who writes twice a year gives up, and their knowledge stays in their head.

So split by what can falsify a document, not by who wrote it.

| Document | Where it belongs | What makes it wrong |
| --- | --- | --- |
| Setup, configuration, API behaviour, deployment | The repository | A commit |
| Runbooks | The repository, published as a page | A rename in the code they call |
| HR policy, meeting notes, decision logs | The wiki | A decision, not a commit |

Moving that row into git buys only friction.

## What a good README contains, and in what order

Order by the question the reader has soonest, not by how important a section feels to its author — most readme best practices reduce to that. The newest reader needs the most help; the architecture can wait three screens.

A readme template worth copying:

```markdown
# project-name

One sentence, for someone who has never heard of it.

## What it does
Three to five bullets, including what it deliberately does not do.

## Quick start
The shortest path from clone to running, as commands you can paste.

## Configuration
A table: variable, what it is for, whether it is required.

## Common tasks
Tests, linting, the database reset everyone forgets.

## Deploying
A pointer to the runbook.

## Where the rest of the docs live
One line per document, saying when to read it.

## Who owns this
A team, a channel, a name.
```

Two details decide whether people use it. Put the command above the paragraph explaining it: the reader pastes first and reads only if it fails. And keep the file to about two screens — a README is an index, not the manual; sections that outgrow it get their own file.

## Publish the rendered pages

The source of truth does not have to be the reading surface. Render the Markdown and hand people a page. That can be as small as dropping the file on transformpipe and sending the self-contained HTML, or [publishing a read-only link](/blog/share-a-markdown-document-as-a-link): "anyone with the link" for a public runbook, "only these addresses" for anything internal. Revoking drops the token, so a link already sent stops working. It scales up to [a GitHub Action that publishes the Markdown a pull request changed](/blog/publish-markdown-from-github-actions), or an `tp push` step [in the release script](/blog/markdown-to-html-from-the-command-line).

Know when this is the wrong shape. A large documentation set that needs navigation, versioning and full-text search wants a static site generator — MkDocs, Docusaurus, Hugo — and you should build one. A page per document suits the other case: runbooks, RFCs, release notes, a README going to a client.

## Habits that keep it honest

- [ ] Documentation changes ride in the same pull request as the behaviour they describe.
- [ ] Every document names an owner; `CODEOWNERS` does this without a meeting.
- [ ] Rewrite the wrong paragraph rather than appending a correction under it.
- [ ] Anything that goes stale on a schedule carries the date it was last checked.
- [ ] Documents nobody will maintain get deleted, not labelled "may be out of date".

The last one causes the most argument and matters most. A deleted page sends the reader to ask a person; a stale page sends them confidently to the wrong port.

Pick the document that is most wrong today — usually the setup instructions, because only new joiners run them, and they assume the fault is theirs. Fix it in a branch, review it like code, then send the link to whoever needed it last week. transformpipe does that last part in the browser, free; the full options are in [the docs](/docs).
