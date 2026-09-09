---
title: "Dillinger Alternatives in 2026: Grouped by Why You Are Leaving"
description: Dillinger alternatives grouped by the reason you want one: a converter rather than an editor, something offline, something in your editor, or a script.
date: 2026-09-08
tag: Workflow
keywords: dillinger alternative, dillinger alternatives, dillinger io alternative, online markdown editor alternative, markdown editor without cloud, markdown to html without an editor, offline markdown editor
---

Dillinger is a good piece of software and it is free, so nobody goes looking for an alternative out of frustration with the typing. They go looking because something at the edge of the tool did not fit: a dialogue asking to connect a Google Drive, an export that did not open the way it looked on screen, or the slow realisation that they had opened an editor when what they needed was a converter and a file.

### TL;DR

If you wanted one conversion rather than a writing session, the answer is a converter, not another editor — Markdown Live Preview for a look, a browser-side converter for a complete HTML file you can send. If the objection was the cloud connection, note first that Dillinger says documents stay in your browser and that no data sits on its servers (checked on dillinger.io, 9 September 2026); the access request only appears when you link Dropbox, Drive, OneDrive, GitHub or Bitbucket, and you can simply not do that. If you want the tool itself on your machine, StackEdit stays in a tab and works offline, and Typora, Obsidian and Zettlr are applications. If it belongs in a build, none of the above applies and Pandoc does.

"Dillinger alternative" is four searches wearing one phrase. The first is somebody who arrived with a `.md` file, wanted HTML out of it, and found a two-pane editor with a cloud menu — more tool than the errand needed. The second is somebody who hit the integration prompt and stopped, because linking a whole Drive to a website to move one file is a poor trade. The third wants the software installed, on a laptop, working on a train, with the files on a disk they can back up. The fourth is writing a build step and needs a command, not a tab.

Those four want different things and only one of them wants an editor. That is the useful thing to know before reading any list, including this one, because most "Dillinger alternatives" pages answer all four questions with a ranked pile of Markdown editors, and three of the four readers leave with the wrong tool.

There is also a fifth case worth naming, since it turns up in support threads: the export came out and it did not look like the preview. That is not a reason to change editors. It is a property of how the HTML was written, and it is fixable without migrating anything.

## Dillinger on its own terms

Dillinger is a browser-based Markdown editor with a live preview, built on the Monaco editor — the same editing component that VS Code uses. It offers scroll-synced preview, Vim and Emacs keybindings behind a setting, drag and drop of Markdown, HTML and image files, a dark mode and a fullscreen Zen mode. Export is described as "Markdown, styled HTML, or PDF", as a one-click download. Documents auto-save into your browser's storage, and the site states plainly: "No account required, no data on our servers" (checked on dillinger.io, 9 September 2026).

It is open source. The repository states the MIT licence, and lists the stack as Next.js, Monaco, Tailwind CSS and Zustand, with a plain `npm run build` and `npm start` for running it yourself (checked on github.com/joemccann/dillinger, 9 September 2026). MIT means you can host it, fork it and change it, which is more than most free web tools offer and is the honest counterweight to everything below.

The integrations are the part people react to. Five are listed — GitHub, Dropbox, Google Drive, OneDrive and Bitbucket — for importing files and saving back to them, and the site notes that the Dropbox connection is made over OAuth (checked on dillinger.io, 9 September 2026). Nothing about that is unusual or improper. It is simply the point at which a free editor asks for something a converter never has to ask for, and the point where a lot of people close the tab.

| Pros | Cons |
| --- | --- |
| Nothing to install, and no account to make | It is an editor: the shortest path is still write, then export |
| Monaco gives real editing — multiple cursors, find and replace | The page comes from a hosted domain, so the first load needs the network |
| Documents persist in browser storage, with nothing on their servers | Browser storage is per-browser and per-profile, and clearing site data clears it |
| Exports Markdown, styled HTML and PDF in one click | Cloud sync means granting a website access to a drive or a repository |
| MIT licensed, so you can host it yourself | Export styling is the tool's, and "styled" is not the same as self-contained |

**Licence:** free, MIT (checked on github.com/joemccann/dillinger, 9 September 2026).

**Who is it for?** Somebody writing a document now, in a browser, who wants a live preview and a file at the end. On that job it is hard to beat and there is no reason to leave. Every reason below is about a different job.

Two things are worth checking before you decide the tool failed you. First, browser storage is not a backup: it lives in one browser on one machine, and a cleared cache or a private window takes the document with it. Second, a "styled HTML" export and a self-contained HTML document are separate properties. Open the exported file with the network switched off, in a different browser. If it still looks right, the styles came with it. If it turns into black text on white at full window width, the styling was pointing somewhere the file cannot reach — a problem [worth understanding properly](/blog/self-contained-html-explained), because it will follow you to whatever tool you switch to.

## Quick comparison: the cheat sheet

| Tool | Reach for it when | Where the text lives | Runs on | Licence |
| --- | --- | --- | --- | --- |
| Dillinger | You are writing now and want a preview | Browser storage, plus a cloud drive if you link one | Any browser | Free, MIT |
| A browser converter | You have a file and need a finished HTML document | Nothing leaves the machine when signed out | Any browser | Free |
| Markdown Live Preview | You only want to see how it renders | The page you are on | Any browser | Free, MIT |
| StackEdit | You want a browser editor that keeps working offline | Browser storage until you connect sync | Any browser | Free, Apache Licence 2.0 |
| Typora | You write most days and want an application | Local `.md` files | macOS, Windows, Linux | Paid, one-time |
| Obsidian | Many notes that refer to each other | A local folder you choose | Desktops, phones, tablets | Free for all purposes |
| Zettlr | The document has citations and a target template | Local `.md` files | macOS, Windows, Linux | Free, GNU GPL v3 |
| VS Code | The Markdown already sits beside code | Files in the folder you opened | macOS, Windows, Linux | Product licence; Code-OSS is MIT |
| Pandoc | The conversion has to run without a person | Wherever your files already are | Command line | Free, GPL |
| A REST API or CLI | The conversion belongs to a pipeline | Your repository or runner | Server, CI, terminal | Varies |

## Reason one: I want a converter, not an editor

This is the largest group and the one the lists serve worst. You have a `.md` file already — a README, an export from a notes app, something a model wrote for you — and the job is to turn it into a page a person can open. Dillinger can do it: paste the text in, use the export menu. But the shape of the tool is wrong for the errand. It puts a cursor in front of you and asks you to write, when there is nothing left to write.

A converter has a different shape. You give it a file, it gives you a file back, and there is no document to manage in between. Nothing is saved, nothing is synced, and there is no state to lose.

### transformpipe — for a finished HTML document you can send

A browser-side converter takes the Markdown file and returns a complete HTML document, styles inline, in one file. There is no install and no account, and signed out nothing is uploaded — the file is read, converted and rendered on the machine in front of you, which you can confirm by watching the network tab while it works.

| Pros | Cons |
| --- | --- |
| The output is one file that asks the network for nothing | Not a writing environment: no live preview to type into |
| Nothing is uploaded when signed out, and no account is required | The browser does the work, so a very large file depends on the machine |
| Raw HTML in the source goes through a fixed allow-list before it renders | No templating language for a bespoke layout |
| Also converts HTML, Word, CSV and JSON the other way | One document at a time, or several merged into one |

**Licence:** free to use. Conversion is capped at 10 MB, and a document kept in an account at 4 MB, because the function behind it refuses a request or response body over 4.5 MB.

**Technical details and features**

- GitHub Flavored Markdown: tables, task lists, strikethrough, autolinks, fenced code blocks
- Output is a whole document — doctype, head, an inline `<style>` block, no external requests
- Downloads as `.html`, `.md` or plain text, or prints to PDF through the browser's own dialogue
- The same conversion is available from a REST API, a dependency-free CLI, a GitHub Action and an MCP server

**Who is it for?** Anybody whose next step is "send this to somebody". If you came to Dillinger with a file and left with a document you were not sure would open on another machine, this is the swap that fixes it, and it takes about as long as the export did.

### Markdown Live Preview — for looking, not for shipping

Markdown Live Preview is exactly what its repository says it is: "a tiny web tool to preview Markdown formatted text", described there as a "markdown editor with live preview" and released under the MIT licence (checked on github.com/tanabe/markdown-live-preview, 9 September 2026). Its own site refused an automated request on the day this was written, so everything above comes from the repository rather than from the page.

| Pros | Cons |
| --- | --- |
| The repository is small enough to read, and MIT licensed | A preview, not an export pipeline |
| Nothing documented to sign into or sync | Its rendering is not necessarily your target renderer's |
| One job, done in the page | Nothing to keep: it is a scratch surface |

**Licence:** free, MIT (checked on github.com/tanabe/markdown-live-preview, 9 September 2026).

**Who is it for?** Somebody checking whether a table is formed correctly, or whether a nested list is nesting. It is the right size for a five-second question and the wrong size for producing a document. If your only interaction with Dillinger was pasting text in to see if it looked right, this replaces it with less around it.

### What the converter group gets you

The common thread is that there is no document to lose. No browser storage to clear, no sync to configure, no OAuth prompt, and no half-finished draft sitting in a tab you closed last week. The exchange is one file for another and then it is over. For a surprising share of the traffic behind this search, that is the whole requirement, and everything else on the page is an answer to a question the reader did not ask.

It also changes what "safe" means. An online converter that uploads has your document; one that converts in the browser does not. That distinction is [worth checking rather than assuming](/blog/is-an-online-converter-safe) for any tool in this category, including the ones here, because both designs exist and the page rarely leads with which it is.

## Reason two: I want it offline, or somewhere I control

The second group wants the tool on their side of the network. Sometimes that is policy — a work machine, a client's document, an industry where "we pasted it into a website" is not an acceptable sentence. Sometimes it is practical: a train, a plane, a building with bad wifi. And sometimes it is just a preference for software that keeps working when a company loses interest.

Be precise about what Dillinger does and does not do here, because the reflex assumption is usually wrong. Its own page says the editor keeps working without a connection once loaded, and that documents auto-save to browser local storage with no data on its servers (checked on dillinger.io, 9 September 2026). What it cannot do is exist without the first load: the application is served from a domain, so the code arrives over the network each time it is not cached, and the version you get is whichever version is deployed. That is a different property from a signed application sitting on your disk, and for some readers it is the whole difference.

### StackEdit — the browser editor built to work offline

StackEdit is an in-browser Markdown editor with a live preview and scroll sync, and it advertises offline use directly: "Even when you travel, StackEdit is still accessible and lets you write offline just like any desktop application." It syncs files with Google Drive, Dropbox and GitHub, it publishes to Blogger, WordPress and Zendesk, and it is licensed under the Apache Licence 2.0 (all checked on stackedit.io, 9 September 2026).

| Pros | Cons |
| --- | --- |
| Offline use is a stated design goal, not a side effect | Still a browser tab, with the same first-load dependency |
| More writing furniture than Dillinger: WYSIWYG controls, comments | Sync destinations are the same cloud drives you may be avoiding |
| Handles long documents without complaint | Its extended syntax — diagrams, scores — travels badly elsewhere |
| Apache Licence 2.0, so it can be self-hosted | Export styling is its own |

**Licence:** free, Apache Licence 2.0 (checked on stackedit.io, 9 September 2026).

**Technical details and features**

- GitHub Flavored Markdown, plus LaTeX maths, UML diagrams and musical score extensions
- Sync with Google Drive, Dropbox and GitHub; publishing to Blogger, WordPress and Zendesk
- An embeddable component, `stackedit.js`, for putting the editor inside another application
- Comments and collaboration features aimed at review rather than solo drafting

**Who is it for?** Somebody who liked the browser tab and wants a more serious editor in it, especially where installing software is not an option. It is the closest like-for-like swap on this page, and the same reservation applies: if you objected to connecting a drive, StackEdit will offer you the same three.

### Typora — the application, if you write most days

Typora is a desktop editor for macOS, Windows and Linux that removes the preview window, the mode switcher and the syntax markers and renders the document as you type; its themes are described as "fully configurable by CSS" (both checked on typora.io, 9 September 2026). Its documentation says Typora "supports exporting the current document into PDF, HTML, HTML (without styles) and the Image format", and lists Word, OpenOffice, LaTeX, EPUB and the rest as exports that run through an installed Pandoc (checked on support.typora.io, 9 September 2026). Because the theme is CSS, the HTML export inherits whatever stylesheet is active rather than a fixed house look.

| Pros | Cons |
| --- | --- |
| One pane, no split view, no syntax noise | Paid, and desktop only |
| Themes are CSS, so exports can carry your own styling | Three devices per licence |
| Ordinary `.md` files on a disk you control | One document at a time; not a batch tool |
| No integrations to grant, because there are none | Replacing the syntax as you type suits some writers and not others |

**Price:** $14.99 without tax, a one-time purchase covering up to three devices, with a 15-day free trial (checked on typora.io, 9 September 2026).

**Who is it for?** People whose Markdown habit has outgrown a tab. It is the only paid entry here and the only one where the reason to pay is the typing rather than the output. If you are already comparing desktop editors, the [reasons people move off Typora in turn](/blog/typora-alternatives) are worth reading before you buy, since the device cap catches people out later rather than sooner.

### Obsidian — when the documents refer to each other

Obsidian works over a folder of Markdown files on your own disk, with links between notes as the organising idea. It is not a converter and it is not primarily an editor for one document; it is an application for a collection of them. Its own site says it "stores your notes locally as plain text Markdown files", offers builds for Windows, macOS, Linux, iOS and Android, and describes "thousands of plugins" alongside an open API. Its licence page states it can be used free for any purpose, including personal, commercial and non-profit use, with optional paid licences that are not required, and does not describe the application as open source (all checked on obsidian.md, 9 September 2026).

| Pros | Cons |
| --- | --- |
| Files stay in a folder you chose, in plain Markdown | Enormous overhead if you have one document |
| Free for any purpose, commercial included | The licence page does not claim open source, so there is no source to host yourself |
| Runs on desktops, phones and tablets | Its wiki-style links and embeds are not standard Markdown |
| A large plugin ecosystem, including export plugins | Export quality depends on which plugin you install |

**Licence:** free for all purposes; paid Catalyst and Commercial licences are optional (checked on obsidian.md, 9 September 2026).

**Who is it for?** Somebody whose Dillinger use had quietly become a filing system — several documents, each in a tab, none of them findable later. That is a job for a folder and an application over it. It is a large move for a small annoyance, and the [comparison of editors in that category](/blog/best-markdown-editors) is a better starting point than this page.

### Zettlr — when the document has a bibliography and a target format

Zettlr is a writing application for Windows, macOS and Linux that treats export as a first-class step, driven by Pandoc through a profile system: "you can export any paper with a template in just one click". It integrates with reference managers including Zotero and JabRef, and works with LaTeX and Word templates (all checked on zettlr.com, 9 September 2026). It is licensed under the GNU GPL v3 (checked on github.com/Zettlr/Zettlr, 9 September 2026).

| Pros | Cons |
| --- | --- |
| Export profiles powered by Pandoc, with real templates | Pandoc's capability comes with Pandoc's learning curve |
| Citations from Zotero or JabRef, in the document | Heavier than anything else in this group |
| GPL v3, and your files stay where you put them | Aimed at academic writing, which shapes every default |
| Full-text search across a project | Not a quick one-file conversion tool |

**Licence:** free, GNU GPL v3 (checked on github.com/Zettlr/Zettlr, 9 September 2026).

**Who is it for?** People writing something with references and a required output format — a paper, a thesis, a manuscript. If you were exporting from Dillinger and then fixing the result by hand every time, a tool with templates is the structural fix.

## Reason three: I want it in the editor I already have

The third group is developers, and the answer is short: if the file is already open in your editor, that is where the conversion should happen. Switching to a browser tab to render a file that is on disk two feet away is the kind of habit that survives long after the reason for it has gone.

### VS Code — the preview is already installed

VS Code ships a Markdown preview built on markdown-it, which is the same family of renderer Dillinger's preview problem sits in, and it opens beside the file with a keystroke. Export is not built in; extensions provide it, and their quality varies. The source repository, Code - OSS, is MIT licensed, while the branded product Microsoft distributes carries a Microsoft product licence (checked on github.com/microsoft/vscode, 9 September 2026).

| Pros | Cons |
| --- | --- |
| Already installed, for most developers | Export needs an extension, and extensions differ |
| Preview reflects markdown-it's CommonMark behaviour | The preview's styling is not the exported styling |
| The file never leaves the folder it lives in | Not a pipeline: it converts whatever is open |
| Vim keybindings, multiple cursors, everything Monaco gave you | No live cloud sync, which for this group is the point |

**Licence:** the product is under a Microsoft product licence; the Code - OSS source is MIT (checked on github.com/microsoft/vscode, 9 September 2026).

**Technical details and features**

- Side-by-side preview with scroll sync, from a keyboard shortcut
- markdown-it under the preview, so CommonMark behaviour is the baseline and GFM features come from presets
- Extensions for HTML, PDF and slide export, each wrapping the fragment differently
- A folder-based workspace, so the Markdown sits with the code it documents

**Who is it for?** Anybody converting a README or a note in passing while already in the editor. There is an amusing symmetry here: Dillinger's editing component is Monaco, which is VS Code's editor extracted for the browser, so a developer leaving Dillinger for VS Code is not learning a new editor at all. They are removing a browser from between themselves and their files.

If the Markdown lives in a repository, this is also where the rest of the toolchain is — linting, spelling, diffs, review. A document that gets edited through a web tool and pasted back is a document with no history, and history is the main thing a repository was for.

## Reason four: I want it in a script

The fourth group has stopped wanting a tool with a cursor in it. The conversion happens fifty times, or on every commit, or at three in the morning, and any answer involving a browser tab is not an answer. Nothing in the editor category serves this, which is why it is the group most likely to be handed the wrong recommendation.

### Pandoc — the general answer

Pandoc is a command line document converter that reads and writes a large number of markup formats. Its own site states: "Pandoc is free software, released under the GPL." (checked on pandoc.org, 9 September 2026). For this job the relevant flags are documented in its manual: `--standalone` (`-s`) produces "output with an appropriate header and footer (e.g. a standalone HTML, LaTeX, TEI, or RTF file, not a fragment)", and `--embed-resources` produces "a standalone HTML file with no external dependencies, using `data:` URIs to incorporate the contents of linked scripts, stylesheets, images, and videos" (checked on pandoc.org, 9 September 2026).

```sh
pandoc notes.md -s --embed-resources -o notes.html
```

| Pros | Cons |
| --- | --- |
| One command, repeatable, scriptable, no tab | Requires an install and a terminal |
| `--standalone` and `--embed-resources` produce a real single file | Templates and filters are their own subject |
| `--template` gives exact control over the wrapper | No sanitising: raw HTML passes straight through |
| Reads and writes far more than Markdown and HTML | Its Markdown dialects differ from GFM in places |

**Licence:** free, GPL (checked on pandoc.org, 9 September 2026).

**Technical details and features**

- `--standalone` wraps output in a complete document rather than emitting a fragment
- `--embed-resources` inlines stylesheets, scripts and images as `data:` URIs
- `--template` selects a template file or URL, and implies `--standalone`
- `--sandbox` restricts reader and writer file access to the files named on the command line, which matters when the input is not yours

**Who is it for?** Anybody with a repeated conversion, a directory of files, or an output format other than HTML. The trade is an install and some reading in exchange for a conversion that never needs a person again. If the terminal is where this belongs, the [narrower question of doing Markdown to HTML there](/blog/markdown-to-html-from-the-command-line) covers the alternatives to Pandoc as well.

### An API, a CLI or a CI action — when the install is the problem

The other shape of this answer is a hosted conversion with no runtime to install: a REST endpoint your script calls, a dependency-free CLI you run without a package manager, or an action that runs in a pull request. It is the same conversion as the browser one, moved to where the automation lives.

| Pros | Cons |
| --- | --- |
| Nothing to install on the runner | A network call, with everything that implies |
| The same output as the interactive conversion | Size limits apply to what you can send |
| Fits a pull request or a nightly job | Less flexible than a local Pandoc with templates |

**Who is it for?** Teams whose CI runners are locked down, or anybody who does not want a Haskell install in a container to turn one file into one page. It is worth saying plainly that Pandoc is the more capable tool and a hosted call is the more convenient one, and that convenience is a legitimate reason to pick the smaller thing.

## Where the obvious answer fails, and what switching costs

Here is the part that the alternatives lists — and this one, until now — have been dancing around. **An editor and a converter are different tools, and most people who search for "Dillinger alternative" want the second one.** Recommending another editor to somebody holding one file is the wrong answer given confidently, and it is the most common answer on the internet.

The tell is what you were doing when you got annoyed. If you were typing, you wanted an editor and Dillinger was close: the fix is StackEdit, or an application, or nothing at all. If you were pasting, you wanted a converter, and every editor on every list is a detour with a cursor in it. Pasting a finished document into an editor to reach its export menu is a workaround for not having the right tool, and it is invisible as a workaround because it only takes a minute.

The costs of switching are worth stating too, because "switch" is not free.

**Switching editors is a migration, not a click.** Documents in Dillinger's browser storage are in Dillinger's browser storage. They are not in a folder, they are not in a repository, and no other tool will find them. Before you move, open each one and download the Markdown, because the moment you sign into something else the old drafts are one cleared cache away from gone. This is not a criticism of Dillinger — every browser-storage tool has the same property — but it is the step people skip.

**A desktop editor moves the problem to your backups.** Local files are yours, which means the file that no longer exists is also yours. Dillinger's cloud sync existed for a reason, and declining it is a decision to be responsible for the copies.

**Custom syntax does not travel.** StackEdit's diagrams and scores, Obsidian's wiki links and embeds, Zettlr's citation keys: each is useful inside its own tool and none is standard Markdown. A document written with them is portable in the way a document written in a dialect is portable — mostly, until the interesting parts.

**An export is not a document until it opens somewhere else.** This is the failure people blame on the editor. A styled export can still reference styling it does not carry, and the only test that catches it is opening the file in a different browser, on a different machine, with the network off. Do that once with your current export before you conclude the tool was the problem, because if the new tool has the same behaviour you will have migrated for nothing. The property you are testing for has [a name and a definition](/blog/best-markdown-to-html-converters) worth knowing, and it decides whether an emailed file works.

**Declining the integration is usually free.** The single most common reason in this search is the cloud access prompt, and the smallest possible fix is to not connect anything: write in the tab, export, download, done. Dillinger works that way by default and says so. Leaving over a dialogue you can close is the one migration on this page that nobody needs to make.

## How to choose

1. **Decide whether you are writing or converting, and be honest about it.** If there is nothing left to type, an editor is the wrong shape and you will keep paying for it in extra steps every single time.
2. **Check where the file goes before you paste it.** A browser-side tool converts on your machine and a hosted one receives your document; both designs are legitimate, and only one of them is acceptable for something confidential.
3. **Test the export somewhere else, with the network off.** A file that looks right in the tool and wrong in an email is the defect that costs the most reputation for the least effort to catch.
4. **Count the installs against the number of runs.** One conversion should not require a package manager; fifty conversions should not require a person clicking a button, and the crossover point arrives sooner than anyone expects.
5. **Prefer the tool that leaves your files in a folder.** Browser storage is convenient until a cache clear, and a document you cannot find with a file manager is a document you have partially lost already.
6. **Only grant cloud access when the sync is the feature you wanted.** Linking a whole Drive or repository to move one file is a permanent permission traded for a one-off convenience, and the file could have been downloaded instead.

## Conclusion

Dillinger is a free, MIT-licensed, browser-based Markdown editor that keeps your document in your browser and asks for nothing until you ask it to sync — and if the job was writing, it remains a reasonable place to do that. The reason the search exists is that most people arrive at it holding a finished file, and an editor is the wrong tool for a finished file. For that case, [transformpipe's Markdown to HTML conversion](/) returns a complete, self-contained document in the browser with nothing uploaded and no account, which is the errand rather than a new home for your writing. If you want the software on your own disk, StackEdit, Typora, Obsidian and Zettlr are the real alternatives, with their licences above. And if the conversion is going to happen more than a handful of times, stop evaluating editors entirely and install Pandoc.

## FAQ

### Is Dillinger still maintained and is it safe to use?

The repository is public under the MIT licence and the current site describes a Next.js and Monaco stack, so it is being worked on rather than abandoned (checked on github.com/joemccann/dillinger and dillinger.io, 9 September 2026). On safety, its own pages state that documents persist in your browser's storage and that no data sits on its servers, which is a stronger position than most free web editors take.

### What is the best free Dillinger alternative?

It depends which half of Dillinger you were using. For the editor, StackEdit is free under the Apache Licence 2.0 and is built to work offline in a browser tab. For the conversion, a browser-side converter that returns one self-contained HTML file is free and skips the editor entirely.

### Is there a Dillinger alternative that does not connect to Dropbox or Google Drive?

Several, and Dillinger itself is one of them if you decline the integration — nothing about the editor requires a linked drive. If you would rather the option did not exist, Markdown Live Preview's repository describes nothing but a preview tool, so there is no drive to link, and a converter has nothing to connect because there is no document to keep.

### Can I self-host Dillinger?

Yes. The repository is MIT licensed and documents a plain build and start (checked on github.com/joemccann/dillinger, 9 September 2026), so running your own copy is a supported path and the licence permits changing it. That solves the hosted-domain objection without giving up the editor, at the cost of maintaining a deployment.

### Why does my exported HTML look different from the preview?

Because a preview is styled by the application and an export is styled by whatever the exported file carries or references. If the file points at styling it does not include, it renders unstyled anywhere the reference fails. Open your export in another browser with the network off, and you will know within a second which kind of file you have.

### Do I need an editor at all to convert Markdown to HTML?

No, and this is the most useful sentence on the page. A converter takes the file and hands back a document, with no draft to save, no sync to configure and no permission to grant. If you never intended to write anything, the editor was always an extra step.

### Which alternative works for a script or a CI job?

Pandoc, which is free under the GPL and whose `--standalone` and `--embed-resources` options produce a single HTML file with no external dependencies (checked on pandoc.org, 9 September 2026). Where installing Pandoc on a runner is the obstacle, a conversion API, a dependency-free CLI or a GitHub Action does the same job over the network.
