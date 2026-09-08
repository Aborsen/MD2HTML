---
title: Your AI assistant writes Markdown. Your colleagues do not read it.
description: Why chat assistants answer in Markdown, what breaks when you paste it into email or a document, and the shorter route: save, convert, share
date: 2026-07-21
tag: Workflow
keywords: chatgpt markdown, chatgpt output to html, claude markdown export, llm markdown output, ai generated documentation, copy markdown from chat
---

The answer in the chat window looks like a document. Headings, a short table, a numbered list, bold in the right places. You copy it into an email and get a wall of asterisks and hash signs. Or you get half a document: the headings came out, the table arrived as a row of pipes, and your reader has to guess which characters were meant literally.

Nothing went wrong. The assistant wrote Markdown, because that is what these tools write.

## Why the answer arrives as Markdown

A model emits text one piece at a time. To mark a heading it has to use characters in the same stream as the words, and Markdown is the cheapest way to do that: plain text, a few punctuation marks, no format to negotiate. The chat interface renders it back at your end. That rendering is the illusion — what you hold is the source.

This is not a quirk of one product. ChatGPT, Claude, Gemini and Copilot all answer this way, and so do the assistants inside editors and trackers. Asking for plain text sometimes works, but then you are negotiating with a model instead of converting a file.

## What copying it out actually does

Most chat windows hold two copies of the answer. The copy button hands you the source, asterisks and all. A mouse selection hands you the rendered version as rich text, which the destination then reinterprets. Neither is reliable, and they fail in different places.

| Where you paste it | Copy button (source) | Mouse selection (rich text) |
| --- | --- | --- |
| Plain-text email | Every hash, asterisk and pipe | Flattened back to plain text |
| Word or Google Docs | Raw syntax, nothing rendered | Headings, bold and usually tables survive; fenced code loses its block |
| Slack or Teams | Some syntax renders, some stays literal | Varies by client; lists and code fences suffer most |
| A wiki that speaks Markdown | Close to right, if its flavour matches | Rich text, so the Markdown is gone |

The half-rendered case is the expensive one. A reader who sees clean headings above a mess of pipes assumes you sent it carelessly, not that two tools disagreed about tables. Tables are the reliable casualty either way, for [reasons worth knowing](/blog/markdown-tables-that-survive-conversion) if you paste them often.

## Save it, convert it, send the page

The route that holds up is dull and takes a minute.

**Save the answer as a file.** Press copy, paste into any text editor, save as `handover.md`. A .md file is plain text: nothing to install, nothing to go wrong. What you cannot do is send it — on a colleague's machine it opens in whatever program claims the extension, or in nothing at all.

**Convert it to HTML.** transformpipe does this at https://transformpipe.com: drop the file in and the conversion runs in the browser. Signed out, the file never leaves your machine, which matters when the answer contains something internal. You get a preview, the exact HTML source, and a download — one self-contained .html file with inline styles, no scripts and no network requests. Several answers, several files: drop them all at once and they are chained into one document, in order, separated by a rule.

**Send the page, not the file.** The .html opens by double-click on any machine. If an attachment is still the wrong shape, sign in and publish a read-only link instead: readable by anyone with the address, or only by the addresses you name. Revoke it and a link already sent stops working. [The four ways to send a document](/blog/share-a-markdown-document-as-a-link) covers which one suits which reader.

```bash
# with a key already remembered by `tp login`, publishing is one line
node cli/tp.mjs push handover.md --share link
```

## Read it before your name goes on it

AI generated documentation is documentation. It goes out under your name, and the reader will hold you to it, not the model.

Do this before you convert, not after. A rendered page looks finished, and things that look finished get read as though somebody checked them.

- [ ] Every number: can you name where it came from?
- [ ] Every link: open it. Plausible URLs that lead nowhere are a common failure.
- [ ] Every quote, citation and product name: confirm it exists and is spelled correctly.
- [ ] Any code: run it, or say plainly that it is untested.
- [ ] The confident passages: the tone is identical whether the model knows or is guessing.
- [ ] Anything you pasted into the prompt: check none of it has been repeated back into the answer.

Cut the filler too. Models pad: an opening that restates the question, a closing paragraph that summarises what the reader just read. Delete both.

## When a page is the wrong answer

Converting is not always worth it. Sometimes another tool wins outright.

If the recipient has to edit the text, send something editable: paste it into a document, accept that the code block will suffer, and let them work. If you need a real .docx, Pandoc converts between formats a browser converter does not touch, and [it is the better tool for that job](/blog/pandoc-alternatives-for-markdown-to-html).

If the answer is three sentences, type them into the message. A conversion step for a paragraph is ceremony.

If the content belongs in the team wiki, put it there. Notion, Confluence and most trackers accept Markdown on import or paste, each with its own quirks. A shared page is for documents with no home, not for content that already has one.

Next time an answer is worth keeping, save it as `.md` before you do anything else. Read it against the checklist, fix what the model guessed at, then convert it once at https://transformpipe.com and send the page.
