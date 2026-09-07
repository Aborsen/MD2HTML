---
title: How to open a .md file
description: A .md file is plain text, which is why double-clicking one opens a code editor — here is how to read it properly on Windows, macOS or Linux.
date: 2026-09-02
tag: Converting
keywords: how to open md file, what is an md file, md file viewer, markdown viewer online, view md file in browser, md reader, markdown file extension
---

You downloaded a file called `README.md`, double-clicked it, and something unhelpful happened. A code editor opened. Or Windows offered a list of programs you have never heard of. Or you got a plain window full of hash signs and asterisks. The file is not broken: no operating system ships with an app that displays Markdown as Markdown, and that is the whole problem.

## What is an .md file?

Plain text. That is the whole answer.

Open one in Notepad and you see every character it contains. There is no hidden formatting, no binary data, nothing that a special program has to decode. The markdown file extension only tells you which convention the text follows: Markdown, a small set of rules for writing formatting with ordinary punctuation.

```markdown
## Release notes

**Version 2** fixes the login timeout.

- Faster start-up
- New export button

| Platform | Status |
| --- | --- |
| Windows | Shipped |
| macOS | In review |
```

Each `#` marks a heading, and more of them make a smaller one. Asterisks make text bold. Dashes make a list. Pipes make a table. Someone wrote it that way so a program could turn it into a formatted document later, but the raw text stays readable on its own — most of the point of Markdown.

That leaves two different things you might want: to see the text, or to see it rendered with real headings and bold type. Different tools.

## Why double-clicking does something strange

Both systems pick a program from the file extension, and they fail differently. Windows ships with nothing claiming `.md`, so whatever grabbed the extension wins — a code editor, a Git client, some tool that came with the work laptop — and if nothing did, you get the "How do you want to open this file?" dialog. macOS normally falls back to TextEdit, which shows you the punctuation instead of the formatting.

A code editor opening your meeting notes is not a sign that the file contains code. It means that editor was the last thing to put its hand up. Notes like that usually arrive from an export, and the long id in the filename or the folder of images beside the file is the giveaway: [what Notion, Obsidian and Confluence each produce](/blog/markdown-from-notion-obsidian-and-confluence) decides whether those images still work once the file moves.

## How to open an .md file on Windows, macOS and Linux

Every system ships with something that shows you the text. Nothing to install.

| System | Do this | From a terminal |
| --- | --- | --- |
| Windows | Right-click the file, Open with, Notepad | `notepad file.md` |
| macOS | Right-click, Open With, TextEdit | `open -e file.md` |
| Linux | Open it with the desktop's text editor | `less file.md` |

To stop the double-click surprising you, set the association once. On Windows: Open with, Choose another app, then tick the box that makes it permanent. On macOS: Get Info, Open with, Change All.

## Using an md file viewer instead

Raw text is fine for a short note. For a long document — nested lists, tables, fenced code, links written as `[text](url)` — the punctuation gets in the way of the words, and you want an md reader that shows formatting rather than marks.

Four routes, at different costs:

- **Push it to GitHub or GitLab.** Both render Markdown in the web interface. Fine, if the content belongs on a code host.
- **Install an editor.** Visual Studio Code is free and has a Markdown preview built in. Obsidian is a notes app that keeps its files as plain Markdown on disk. Either earns the download if you read Markdown every week; for one file it is a large install and a tour of settings you did not ask for.
- **Add a browser extension.** Some render local `.md` files as you open them, but only after you grant the extension access to file URLs — so pick one you would trust with your disk.
- **Use a markdown viewer online.** Drop the file onto a web page and read it there.

### Viewing an .md file in the browser

The last route is quickest, with one thing to check first: online usually means uploaded. If the document is a draft contract or an internal runbook, read what the page says it does with your file. M2H runs the conversion in the browser — signed out, the file never leaves your machine — so you can view an md file in the browser without an account and without sending it anywhere.

Viewers also disagree about Markdown. Tables, task lists and strikethrough come from GitHub Flavored Markdown rather than the original syntax, so a strict viewer shows raw pipes instead of a table. The file is fine; the viewer is old-fashioned. [The flavours](/blog/commonmark-gfm-and-the-flavours) are worth knowing if you handle Markdown from several sources.

## When converting to HTML is the better answer

Reading a file yourself and handing it to someone else are separate problems. The second does not need a viewer at all.

If you have to email the document, print it, attach it to a ticket, or still be able to open it in five years, convert it once to HTML. An `.html` file opens by double-click on anything with a browser, formatting intact, nothing to install and nothing to explain. [Converting Markdown to HTML](/blog/markdown-to-html-converter) is quick, and if the reader should not have to deal with an attachment at all, you can [publish it as a read-only link](/blog/share-a-markdown-document-as-a-link) instead.

The trade-off runs the other way while you are still writing: an editor with a live preview earns its download then. A converter is for when you have finished and someone else needs to read it.

Open the file in Notepad or TextEdit first. It tells you exactly what you are holding. If the raw text answers your question, stop there. If it does not, or the document has to reach someone who should never see a hash sign, drop it into M2H at https://md-2-html.vercel.app and take the HTML: one self-contained file, no scripts, opens anywhere.
