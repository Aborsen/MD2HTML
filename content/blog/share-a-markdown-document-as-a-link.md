---
title: Share a Markdown file with someone who does not use Markdown
description: Four honest ways to share a .md file with someone who will not install anything, and what a read-only link should and should not ask of them
date: 2026-09-05
tag: Publishing
keywords: share markdown file, publish markdown online, markdown to shareable link, host markdown file, read only document link, send markdown to a client
---

You have a .md file. You wrote it, or you saved [an answer a chat assistant gave you in Markdown](/blog/ai-output-to-a-shareable-page); from here it makes no difference. Someone needs to read it: a client, a manager, a lawyer. They will not install a Markdown editor, they will not clone a repository, and they should not have to. There are four ways to get the document in front of them, and each one fails in a different place.

## Paste the text into the message

The fastest option, and the one that works everywhere. Copy the file into the email, the chat message or the ticket.

What breaks is the syntax. Your reader sees `## Scope` where a heading should be and a row of pipes where a table should be. Half-rendering is worse than none. Slack has no heading or table syntax, so both arrive as literal characters, while `*Scope*` comes out bold — a single asterisk is bold there, not italic. [Tables fare worst](/blog/markdown-tables-that-survive-conversion): the dashed alignment row means nothing to a tool that does not parse it.

Paste when the document is short, mostly prose, and has no tables, images or code. Anything longer than a screen wants one of the options below.

## Attach the .md file

Honest and lossless: the recipient gets exactly the bytes you have, which matters if they will edit it and send it back.

What breaks is opening it. Nothing on a standard machine is registered for .md, so a double-click gets a code editor, a list of apps to choose from, or nothing; on a phone it is usually nothing. The reader who does open it is reading source, not a document. Say what it is when you send it — [opening an .md file](/blog/how-to-open-md-file) covers what works on a machine with nothing special installed.

## Commit it to a repository

If the document belongs to a project, put it next to the code. GitHub, GitLab and Bitbucket render Markdown in the file view, so the URL of the file is already a readable page.

What breaks is everything around the document. A private repository asks for a sign-in the reader does not have. A public one shows the file inside an interface built for developers, with branches, commit history and a blame button beside your text. The link also points at a branch, so what they read today may not be what they read next week. Pressing `y` on GitHub rewrites the address to pin the commit, which fixes the moving target but not the interface around it. That suits [documentation that lives in the repo](/blog/documentation-that-lives-in-the-repo) and not a quote you sent a client last Tuesday.

## Publish it as a page

Convert the Markdown to HTML and give the reader something a browser can open. This is what most people mean by sharing a markdown file: one address, no install, and it reads as a document.

It comes in two shapes. The first is a file: convert the Markdown to a single self-contained .html and send that. It opens by double-click on any machine, works offline and prints. It is still an attachment, with the attachment problems, but the reader sees a finished document, not source.

The second is a link. The Markdown is rendered once and hosted, and you pass on the URL. Nothing to download, nothing to install, and you can change or withdraw it later.

transformpipe does both. Drop the .md file at [transformpipe.com](https://transformpipe.com) and take the download for a self-contained file; sign in and publish it for a read-only page at `/s/<token>`. Revoking drops the token, so a link you already sent stops working. From a terminal it is one command:

```bash
node cli/tp.mjs login tp_live_…        # once, with an API key
node cli/tp.mjs push proposal.md --share link
```

## What a read-only link should and should not do

Most disappointment with sharing comes from links that ask the reader for something.

A read-only link should:

- [x] open in any browser, with no account, no app and no extension
- [x] show the rendered document, not the Markdown source
- [x] be revocable by you alone, at any time, without the reader's help
- [x] be readable on a phone

It should not:

- [ ] put a sign-in wall in front of a document you meant anyone to read
- [ ] collect an email address before showing anything
- [ ] run scripts, or pull fonts and analytics from other hosts

There is a middle case worth naming. When a document really is confidential, an address list is the right control: only the named readers can open it, and they sign in to prove who they are. That is a different mechanism, not a stricter link. A link anyone can open suits a proposal, a spec or meeting notes; an address list suits anything you would be unhappy to see forwarded.

## Choosing between them

| Option | Reader needs | Reads as a document | You can withdraw it |
| --- | --- | --- | --- |
| Paste the text | nothing | no | no |
| Attach the .md | something that opens .md | no | no |
| Repository file | a browser, sometimes an account | mostly | only by deleting it, and history keeps it |
| Self-contained .html | a browser | yes | no |
| Published link | a browser | yes | yes |

Publishing takes two rows: the file and the link. The last two columns usually decide it.

Work out what happens to the file after it arrives. Short and final: paste it. Meant to be edited: attach the source. Part of a project: commit it. Meant to be read on a phone, in a meeting, by someone who has never heard of Markdown: convert it and send a link, then open that link in a private window, which is the only way to see what your reader sees. transformpipe's [/docs](/docs) covers the rest: publishing modes, revoking, and doing it from a script.
