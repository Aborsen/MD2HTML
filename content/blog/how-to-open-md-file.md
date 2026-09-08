---
title: How to open a .md file on Windows, macOS, Linux, iOS and Android
description: A .md file is plain text, which is why double-clicking opens a code editor or nothing — how to read it as text, read it rendered, and set the default app
date: 2026-09-02
tag: Converting
keywords: how to open md file, what is an md file, md file viewer, markdown viewer online, view md file in browser, md reader, markdown file extension
---

You downloaded a file called `README.md`, double-clicked it, and something unhelpful happened. A code editor opened. Or Windows offered a list of programs you have never heard of. Or you got a plain window full of hash signs and asterisks. Or nothing happened at all, and your phone said no app can open this file.

The file is not broken and it is not corrupt. No operating system ships with an application that displays Markdown as Markdown, and that single fact explains every version of the problem — the wrong app, no app, and the app that opens it and shows you punctuation instead of formatting.

There are two separate things you might want, and most advice online muddles them. You might want to see what is in the file, which every computer you own can already do. Or you might want to read it as a document, with real headings and bold type and tables, which needs something extra. The route is different depending on which one you are after, and it is different again on a phone.

### TL;DR

A `.md` file is plain text, so anything that opens a text file will open it: Notepad on Windows, TextEdit on macOS, `less` on Linux. If you are going to be reading and writing these regularly, [a Markdown editor](/blog/best-markdown-editors) is the better answer. That shows you the source, punctuation included. To read it as a formatted document instead, drop it into a browser-based viewer, install an editor with a preview such as VS Code or Obsidian, or push it to GitHub. If you have to send it to somebody else, stop looking for a viewer and convert it to HTML once — an `.html` file opens by double-click on every device with a browser, which is not true of `.md` anywhere.

## What is an .md file?

Plain text. That is the whole answer.

Open one in Notepad and you see every character it contains. There is no hidden formatting, no binary data, no compression, nothing that a special program has to decode. A `.docx` file is a zip archive full of XML and would be unreadable in a text editor; a `.md` file is exactly what it looks like. The markdown file extension only tells you which convention the text follows: Markdown, a small set of rules for writing formatting with ordinary punctuation.

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

Each `#` marks a heading, and more of them make a smaller one. Asterisks make text bold. Dashes make a list. Pipes make a table. Backticks fence off code. Someone wrote it that way so a program could turn it into a formatted document later, but the raw text stays readable on its own — most of the point of Markdown, and the reason it turns up in READMEs, changelogs, note-taking apps and the output of every AI assistant.

You will see the same content under other extensions. `.markdown`, `.mdown`, `.mkd` and `.mdwn` are the same thing with a longer or older name; they open the same way and mean nothing different. `.mdx` is Markdown with JavaScript components mixed in, so it is still text but it will contain tags that no plain viewer renders. `.rmd` is R Markdown, with executable code chunks. If you have one of those, everything below still applies to reading it — only the extra syntax will look odd.

The one thing that trips people up is the header. Files exported from a static site, a documentation build or a notes app often start with a block fenced by three dashes:

```markdown
---
title: Quarterly plan
author: Priya
date: 2026-08-14
---
```

That is YAML front matter: metadata for the tool that built the page, not part of the document. Some viewers hide it, some render it as a paragraph of `key: value` lines at the top, and a few turn it into a table. None of those is a bug. It is worth recognising, because a document that starts with what looks like nonsense is usually just a file that came out of a generator.

## Why double-clicking does something strange

Every desktop operating system picks the program to open a file from its extension, and each one fails differently when nothing has claimed that extension properly.

**Windows ships with nothing that registers `.md`.** So whatever installed itself last and put its hand up wins. On a work laptop that is usually a code editor, a Git client, or some tool that arrived with the developer toolchain — and if nothing has claimed it, you get the "How do you want to open this file?" dialog with a list of applications and no guidance about which is right. Neither outcome is a statement about your file.

**macOS falls back to TextEdit**, which opens it happily and shows you the source. That looks like a failure and is not: TextEdit is doing precisely its job, which is displaying text. Select the file and press space for Quick Look and you generally get the same thing — the characters, not the formatting.

**Linux depends on your desktop.** The file's MIME type is usually detected as `text/markdown`, and whether anything is registered as the handler for that type varies by distribution. You can check what your system thinks it is holding:

```bash
xdg-mime query filetype notes.md
xdg-mime query default text/markdown
```

The first prints the type, the second prints the desktop entry that will open it, or nothing at all if no application has claimed it.

**Phones are stricter than all of them.** iOS and Android decide what to do with a file from its type as well, and if no installed app declares support for Markdown, the sharing sheet simply offers you nothing useful. Android will often say outright that no app can open the file. This is the most common place people give up, and the easiest place to fix, because on a phone the browser is nearly always the answer.

A code editor opening your meeting notes is not a sign that the file contains code. It means that editor was the last thing to claim the extension. Notes like that usually arrive from an export, and the long id in the filename or the folder of images sitting beside the file is the giveaway: [what Notion, Obsidian and Confluence each produce](/blog/markdown-from-notion-obsidian-and-confluence) decides whether those images still work once the file moves anywhere.

## Reading the source, or reading it rendered

Before you install anything, decide which of these you want. They are different problems with different tools.

**Reading the source** means looking at the characters as written: `## Heading`, `**bold**`, the pipes of a table. For a short file this is completely fine, and often better — you can see exactly what is there, including the link targets, which a rendered view hides behind the link text. Every machine you own can already do this and there is nothing to install.

**Reading it rendered** means seeing the formatting applied: headings in larger type, bold as bold, lists indented, tables as grids, code in a monospaced block. This is what you want for a long document, because past a couple of screens the punctuation starts competing with the words. Nested lists are the clearest case: three levels of indentation with mixed bullets and numbers are hard to hold in your head as raw text and obvious once rendered.

There is a third thing that gets confused with both, and it is the one people actually need surprisingly often: **turning it into a file somebody else can open**. That is conversion, not viewing, and it is covered further down. If your real problem is that a colleague cannot open the `.md` you sent them, no viewer on this page will help — they need a different file, not a different app.

## Quick comparison: every way to open a .md file

| Option | Best for | What you see | Price |
| --- | --- | --- | --- |
| Notepad, TextEdit, any text editor | Checking what the file actually contains | The source, punctuation and all | Free, already installed |
| transformpipe in a browser | Reading it rendered and getting a file out | A formatted document, converted on your own machine | Free |
| Markdown browser extension | Opening local `.md` files in a browser often | A rendered page at a `file://` URL | Free, MIT |
| VS Code | Developers with the file already in the editor | Source and preview side by side | Free |
| Obsidian | Reading a whole folder of Markdown regularly | Rendered notes; files stay plain text on disk | Free for personal, commercial and non-profit use |
| MarkText | A plain desktop reader with no account | Rendered as you type | Free, MIT |
| Typora | Writing and reading Markdown every day | The rendering replaces the source in place | $14.99 without tax, up to 3 devices (checked on typora.io, 8 September 2026) |
| GitHub, GitLab, Gist | Files that already live in a repository | GFM rendered in the web interface | Free |
| `less`, `bat`, `glow` | A terminal, a server, no desktop at all | Text, or a rendering drawn in the terminal | Free, open source |
| Markor, Obsidian, Working Copy | Android and iOS, offline | Rendered preview on the device | Markor and Obsidian free; some iOS editors paid |
| Pandoc | Producing another format from it first | Nothing — it writes a file you then open | Free, GPL |

## Opening a .md file, platform by platform

### Windows

Every Windows machine can show you the text with no install:

| Route | Do this | Result |
| --- | --- | --- |
| Notepad | Right-click the file, Open with, Notepad | The source |
| Command Prompt | `type notes.md` | The source, printed |
| PowerShell | `Get-Content notes.md` | The source, printed |
| Notepad from a prompt | `notepad notes.md` | The source, in a window |

To read it rendered, the shortest path with nothing installed is a browser: open a browser-based viewer and drag the file onto the page. If you read Markdown often enough for the double-click to matter, install an editor with a preview and then set the default application so Windows stops asking.

**Changing the default app on Windows.** Right-click the file, choose Open with, then Choose another app, pick the program and tick the box that makes the choice permanent. If the app you want is not listed, use "Look for another app on this PC" and point Windows at the executable. You can also do it from Settings: Apps, then Default apps, then search for the file type `.md` and set the handler there. The second route is the one to use when the extension has been claimed by something you have since uninstalled, which leaves the association pointing at nothing.

### macOS

TextEdit is already the fallback, so double-clicking usually shows you the source. From a terminal:

| Route | Do this | Result |
| --- | --- | --- |
| TextEdit | Right-click, Open With, TextEdit | The source |
| Terminal | `open -e notes.md` | The source, in TextEdit |
| Terminal | `less notes.md` | The source, paged |
| Quick Look | Select the file, press space | The text, not the formatting |

One macOS-specific trap: TextEdit can be configured to treat files as rich text, and if it has been, it may offer to convert or reformat what it opens. Reading is safe either way, but do not save from TextEdit unless you are sure it is in plain-text mode, because a `.md` file saved as RTF is no longer a `.md` file.

**Changing the default app on macOS.** Select the file, press Command-I for Get Info, open the "Open with" section, choose the application, then click "Change All" to apply it to every `.md` file rather than just this one. The "Change All" click is the part people miss; without it the setting applies to one file and the next download surprises you again.

### Linux

The desktop editor will open it — GNOME Text Editor, Kate, Mousepad, whatever your distribution ships — and so will everything in the terminal:

| Route | Do this | Result |
| --- | --- | --- |
| Pager | `less notes.md` | The source, paged, searchable with `/` |
| Print | `cat notes.md` | The source, all at once |
| Syntax colouring | `bat notes.md` | The source with the Markdown highlighted |
| Rendered in the terminal | `glow notes.md` | Headings, lists and tables drawn as text |

`glow` is the interesting one if you live in a terminal: it renders Markdown into the terminal itself, so you get formatting without a graphical application anywhere. It is free and MIT licensed. `bat` does not render, it colours the source, which is a smaller win but useful on long files.

**Changing the default app on Linux.** Use the file manager's Properties, Open With tab, or set it from the command line:

```bash
xdg-mime default org.gnome.TextEditor.desktop text/markdown
```

Substitute the desktop entry for whichever application you want. If `xdg-mime query filetype` reports something other than `text/markdown` — `text/plain` is common — set the default for that type instead, or your setting will appear to do nothing.

### iOS and iPadOS

There is no filesystem to right-click, so the options are narrower and the order matters. Try them in this sequence:

1. **Tap the file in Files.** Quick Look often shows the text. That answers the question for a short file and costs nothing.
2. **Open it in a browser-based viewer.** Safari and Chrome on iOS can both pick a file from Files through a page's file picker, which means a viewer that runs in the browser works on a phone exactly as it does on a laptop. This is the only route that needs no install at all and still gives you formatting.
3. **Install an app that declares Markdown.** Obsidian is free and reads a folder of `.md` files directly. Working Copy is a Git client that browses repositories and previews Markdown; it installs free with a paid unlock whose price is in the App Store.
4. **Rename it to `.txt`.** Crude, effective, and it makes Quick Look and every text app treat it as text. Keep a copy under the original name if the file is going anywhere else afterwards.

### Android

Android is the platform most likely to refuse outright, and also the easiest to fix:

1. **Try your file manager's built-in text viewer.** Some ship one, some do not.
2. **Install Markor.** It is a text editor for Android, free and Apache 2.0 licensed, available from F-Droid and GitHub. It stores files as plain text on the device, so nothing is converted into a proprietary format behind your back, and it previews Markdown as formatted output.
3. **Use a browser-based viewer.** Chrome on Android can hand a local file to a page's file picker, which gets you a rendered document without installing anything.
4. **Rename it to `.txt`.** Same trick, same caveat.

Google Drive will also display the contents of a text file it is holding, which is worth knowing when the file arrived as a Drive link rather than a download.

## The options, one at a time

### The text editor you already have — best for finding out what you are holding

Notepad, TextEdit, GNOME Text Editor, Kate, `less`, `nano`. Every one of them opens a `.md` file correctly, right now, with nothing downloaded.

| Pros | Cons |
| --- | --- |
| Already installed on every machine | No formatting: you read the punctuation |
| Shows the file exactly as it is, including link targets and front matter | Long documents with nested lists get hard to follow |
| Cannot mangle anything as long as you do not save | No table rendering, so a wide table is a wall of pipes |

**Price:** free, already installed.

**Technical details and features**

- Handles any Markdown flavour, because it is not parsing anything
- Shows YAML front matter, HTML comments and raw HTML that rendered views may hide
- Search within the file: `Ctrl-F` in an editor, `/` in `less`
- Safe to open anything, because nothing in the file is being executed or fetched

**Who should use it?** Everyone, first. Open the file in a text editor before you decide you need a tool. Half the time the file is forty lines long and you have your answer in ten seconds.

### transformpipe in a browser — best for reading it rendered with nothing installed

Drop the `.md` file onto the page and read it as a document. It runs in the browser: signed out, the file is not uploaded anywhere, which matters when the document is a draft contract or an internal runbook rather than a public README.

| Pros | Cons |
| --- | --- |
| No install, no account, works on a phone as well as a laptop | Needs a browser tab, so it is not a double-click handler |
| Nothing is uploaded when you are signed out | One document at a time, or several chained into one |
| Renders GitHub Flavored Markdown, so tables and task lists appear as tables and task lists | Not an editor: it reads and converts, it does not help you write |
| Exports a self-contained HTML file if you need to pass the document on | |

**Price:** free. An account adds history, sharing and an API, also free.

**Technical details and features**

- GFM: tables, task lists, strikethrough, autolinks, fenced code blocks
- The export is a complete HTML document with its styles inline and no external requests
- Raw HTML in the source passes through a sanitiser with a fixed allow-list before it reaches the page
- Downloads as `.html`, `.md` or plain text, or prints to PDF through the browser's own dialog
- Also converts HTML, Word, CSV and JSON back to Markdown, and the same conversion is available from a REST API, a CLI, a GitHub Action and an MCP server

**Who should use it?** Anybody with one file and no wish to install software for it, and anybody whose next step is sending the document to someone else.

### A Markdown browser extension — best for opening local files in the browser repeatedly

Extensions such as Markdown Viewer render `.md` files as you open them in the browser, so a `file:///` URL turns into a formatted page.

| Pros | Cons |
| --- | --- |
| Turns the browser into a `.md` viewer for local files | Requires granting the extension access to file URLs |
| Renders as soon as you open the file, no drag-and-drop | An extension with file access can read local files you open |
| Configurable flavours and themes in the better ones | Extension quality and maintenance vary a lot |

**Price:** free, MIT licensed for Markdown Viewer.

**Technical details and features**

- Available for Chrome, Firefox, Edge, Opera, Brave, Chromium and Vivaldi
- Needs "Allow access to file URLs" enabled explicitly on the extension's details page before local files render
- Renders in the page, so browser find, zoom and print all work normally

**Who should use it?** People who open local Markdown files weekly and want the browser to handle them without a detour. Read the permissions first: the file-URL toggle is the whole point of the extension and also the reason to pick one you would trust with your disk.

### VS Code — best if it is already open

VS Code has a Markdown preview built in, on markdown-it. Open the file and press the preview button, or split the window and get source and rendering side by side.

| Pros | Cons |
| --- | --- |
| Already installed for most developers | A large download if you only want to read one file |
| Preview follows CommonMark closely, with GFM extras | Preview styling is the editor's, not the document's |
| Split view shows source and result together | Not a reader: it is a code editor with a preview pane |

**Price:** free.

**Technical details and features**

- Preview built on markdown-it, so its rendering matches that parser's behaviour
- Extensions add export to HTML and PDF, and additional syntax such as diagrams
- Handles a folder of Markdown files with search across all of them
- Shows front matter as source unless an extension is doing something with it

**Who should use it?** Developers whose file is already in the editor. If you are opening VS Code specifically to read one `.md` attachment, a browser tab is faster.

### Obsidian — best for a folder of Markdown you keep coming back to

Obsidian is a notes application whose entire store is plain Markdown files in an ordinary folder on disk. Point it at a directory and every `.md` file in it becomes a readable, linked note.

| Pros | Cons |
| --- | --- |
| Files stay as plain `.md` on disk, readable by anything else | Wants a folder, called a vault, not a single loose file |
| Runs on Windows, macOS, Linux, iOS and Android | Its own link and embed syntax is not portable to other renderers |
| Reads and renders without an account | A whole application to learn if you only want to read |

**Price:** free for personal, commercial and non-profit use; commercial licences are optional and sold annually as support (checked on obsidian.md, 8 September 2026).

**Technical details and features**

- Local-first: the vault is a directory, and there is no requirement to sign in
- Renders GFM plus its own wiki-style `[[links]]` and embeds
- Mobile applications for iOS and Android read the same files
- Because the store is plain text, anything you write in it stays openable in Notepad afterwards

**Who should use it?** Anybody who has accumulated a folder of Markdown — exported notes, a documentation checkout, a personal wiki — and reads from it regularly rather than once.

### MarkText — best plain desktop reader with no account

MarkText is an open-source desktop Markdown editor that renders as you type, so it doubles as a reader.

| Pros | Cons |
| --- | --- |
| Free and MIT licensed | Development pace is slower than the commercial editors |
| Installs on Windows 10 or 11, macOS 11 or later, and Linux | Fewer features than Typora or Obsidian |
| Available through Homebrew, Chocolatey and Winget | Still an install, for a job a browser tab can do |

**Price:** free, MIT licensed.

**Technical details and features**

- Windows x64 and arm64 installers, macOS arm64 and x64 builds with no universal binary, and Linux binaries from the release page (checked on github.com/marktext/marktext, 8 September 2026)
- Renders in place rather than in a separate preview pane
- Exports HTML and PDF from the file it has open

**Who should use it?** People who want a desktop application to own the `.md` extension, on a machine where installing a paid editor is not on the table.

### Typora — best if you read and write Markdown daily

Typora replaces the Markdown with its rendering as you type, so there is no preview pane and no source view unless you ask for one. It is the most comfortable of these to sit in for hours, and the only one here that costs money.

| Pros | Cons |
| --- | --- |
| The rendering is the document: no split pane to manage | Paid, and desktop only |
| Exports HTML, PDF and Word | Hiding the syntax annoys some writers |
| Local files, nothing uploaded | Not worth buying to open one attachment |

**Price:** $14.99 without tax, covering up to 3 devices, with a 15-day free trial (checked on typora.io, 8 September 2026).

**Technical details and features**

- WYSIWYG editing, with a source mode available when you need to see the marks
- Themes are CSS, so the export can be styled to your own house style
- Exports through Pandoc for the formats it does not write itself

**Who should use it?** People whose work involves Markdown every day. As a one-off `.md` reader it is the wrong purchase.

### GitHub, GitLab and Gist — best when the file already lives in a repository

Both render GitHub Flavored Markdown in the web interface, and both read a file well enough that you do not need anything else. Neither is a viewer for files on your disk.

| Pros | Cons |
| --- | --- |
| Renders GFM reliably, including tables and task lists | The file has to be pushed somewhere first |
| Nothing to install; a link anyone can open | Not appropriate for a confidential document |
| Gist works for a single loose file | No export button: what you save is their page, their markup |

**Price:** free.

**Who should use it?** Anybody whose file belongs on a code host anyway. Paste a single file into a private Gist and you have a rendered view in seconds — but only for content you are content to put there.

### less, bat and glow — best on a server with no desktop

Sometimes the file is on a machine you reached over SSH, and there is no browser and no GUI. The terminal has three tiers of answer.

| Pros | Cons |
| --- | --- |
| Works with no graphical environment at all | Rendering in a terminal has limits: no images, narrow tables wrap |
| `less` is on essentially every Unix machine already | `bat` and `glow` are extra installs |
| `glow` renders headings, lists and tables as formatted text | Not a route anybody would pick on a laptop |

**Price:** free, open source; `glow` is MIT licensed.

**Technical details and features**

- `less notes.md` pages the source and searches it with `/`
- `bat notes.md` prints the source with Markdown syntax colouring
- `glow notes.md` draws a rendering into the terminal, styled for dark or light

**Who should use it?** Anyone reading a README or a runbook on a server, where installing a desktop application is not a sentence that means anything.

### Markor, Obsidian mobile and Working Copy — best on a phone

Mobile is where "just open the file" fails hardest, so it is worth knowing one app per platform.

| Pros | Cons |
| --- | --- |
| Markor is free, Apache 2.0, and keeps files as plain text on the device | Each is a per-platform install for a file you may read once |
| Obsidian runs on both iOS and Android and reads a folder of `.md` | Mobile file handling is fiddlier than a desktop's |
| Working Copy previews Markdown from a Git repository on iOS | Some iOS editors are paid, with the figure set in the App Store |

**Price:** Markor free, Apache 2.0. Obsidian free. Working Copy installs free with a paid unlock priced in the App Store.

**Technical details and features**

- Markor: Android, from F-Droid or GitHub, no ads, files interoperable with any other plain-text tool
- Obsidian mobile: opens the same vault folder as the desktop application
- Working Copy: a Git client, so it is the right answer when the file is in a repository rather than a download

**Who should use it?** People who read Markdown on a phone more than once. For a single attachment, a browser-based viewer needs no install and works on both platforms.

### Pandoc — best when the answer is a different file

Pandoc is a command line document converter written in Haskell. It does not display anything; it writes a new file, which you then open in something that does display things.

| Pros | Cons |
| --- | --- |
| Converts Markdown into HTML, PDF, Word, EPUB and more | Requires an install and a terminal |
| `--standalone` produces a complete document rather than a fragment | Not a viewer at all: no window, no preview |
| Scriptable, so it handles a folder as easily as a file | Its templates and dialects are their own learning curve |

**Price:** free, GPL licensed.

**Technical details and features**

- Reads several Markdown dialects, selected explicitly, and writes around forty output formats
- `--standalone` wraps the output; `--embed-resources` inlines images and CSS into one file
- Runs headless, so it fits a build or a cron job rather than a reading session

**Who should use it?** People who need the document in another format, repeatedly, on a machine they control. For one file and one read, it is more tool than the job needs.

## Somebody emailed you a .md file and you have nothing installed

This is the most common version of the question, and it has a short answer: do not install anything.

Download the attachment, open a browser-based viewer, and drag the file onto the page. That works on a work laptop with a locked-down software policy, on a phone, and on a borrowed machine. Check what the page says it does with the file before you drop a confidential document on it — with a browser-side tool nothing is uploaded, and you can confirm that by opening the network tab and watching nothing happen.

If you cannot use a browser tab either, two fallbacks:

- **Rename it.** Change `notes.md` to `notes.txt` and every text viewer on the machine, including your webmail's own attachment preview, will show you the source. Nothing about the file changes but the name.
- **Open the attachment preview.** Most webmail clients will preview a text attachment inline rather than downloading it, and a `.md` file is a text attachment.

And if this keeps happening — if a colleague sends you `.md` files regularly and you keep hunting for a way to read them — the fix is upstream of you. Ask them to send HTML or a link instead. A `.md` attachment is a file that only opens properly for people who have already solved this problem.

## Reading it and converting it are different jobs

A viewer solves your problem. It does not solve the problem of the next person.

If you have to email the document, print it, attach it to a ticket, put it in front of a client, or still be able to open it in five years, convert it once to HTML. An `.html` file opens by double-click on anything with a browser, formatting intact, with nothing to install and nothing to explain. That is the property `.md` does not have on any platform, which is the whole reason this article exists. [What actually happens when Markdown becomes HTML](/blog/markdown-to-html-converter) is worth understanding before you pick a tool, and if the reader should not have to deal with an attachment at all, you can [publish it as a read-only link](/blog/share-a-markdown-document-as-a-link) instead.

The trade-off runs the other way while you are still writing. An editor with a live preview earns its download then, because you are looking at the document dozens of times a day. A converter is for when you have finished and someone else needs to read it. Choosing between them is really a question about who the next reader is.

## Where the obvious choice fails

The obvious advice is "install VS Code" or "just open it in Notepad", and both are right about half the time. Here is where each one costs you something.

**Raw text hides structure exactly when you need it.** A forty-line file is fine as source. A sixty-page runbook with four levels of nesting, a dozen tables and inline code on every third line is not: you end up parsing the punctuation instead of reading the words, and you will miss things. The failure is quiet — you do not notice the item you skipped.

**Installing an editor for one file is a bad trade, and a hard one to undo.** A code editor is a large download, a tour of settings you did not ask for, and a new default application for an extension you may not want it to own. It also tends to open Markdown with syntax colouring on, which is not the same as rendering it — the hashes are still there, they are just a different colour now.

**Online viewers usually mean uploaded.** "Online" and "in the browser" sound identical and are not. Some tools send your file to a server to convert it; some do the work locally and send nothing. For a public README the difference is irrelevant. For a contract, a patient note, an unreleased plan or an internal incident report it is the only question that matters, and the answer is on the page or verifiable in the network tab.

**Browser extensions want access to your disk.** An extension that renders local `.md` files can only do so with permission to read file URLs, and that permission is not narrow. It is a reasonable trade if you read Markdown constantly and a poor one for a single attachment.

**Viewers disagree about Markdown.** Tables, task lists, strikethrough and autolinks come from GitHub Flavored Markdown rather than the original syntax, so a strict CommonMark viewer shows raw pipes where you expected a table. The file is fine; the viewer implements a smaller flavour. This is the single most common "my Markdown is broken" report and it is almost never the file. [The flavours](/blog/commonmark-gfm-and-the-flavours) are worth knowing if you handle Markdown from more than one source.

**Images will not be in the file.** Markdown references images by path; it does not contain them. Open a `.md` file that was exported with an `images/` folder beside it, in a viewer that only received the `.md`, and every picture is a broken icon. That is not the viewer failing, it is [what relative paths do when a file moves](/blog/images-and-links-that-still-work).

**Changing the default app fixes the double-click and nothing else.** It is worth doing, and it does not make the file portable. Your machine now opens `.md` nicely. The person you send it to is back where you started.

## How to choose

1. **Open it in a text editor first.** It takes ten seconds, needs nothing, and tells you exactly what you are holding — length, front matter, whether there are tables, whether it is even Markdown. Skip this and you may install an application to read forty lines of text.
2. **Count how often this will happen.** Once means a browser tab. Weekly means a browser extension or an editor you already have. Daily means an application you like sitting in, and that is the only case where paying for one makes sense.
3. **Decide whether the content can leave the machine.** If it cannot, rule out anything that uploads before you compare anything else, because that is not a preference you can revisit after the fact.
4. **Check the flavour against the file.** If the document has tables or task lists, the viewer must do GFM. Open one representative file and look at the tables before you commit; a viewer that shows pipes will keep showing pipes.
5. **Ask who reads it next.** If the answer is only you, any viewer here will do. If the answer is a colleague, a client or your future self on a different device, you do not want a viewer at all — you want a converted file, and the choice of viewer stops mattering.

## Conclusion

Open the file in Notepad, TextEdit or `less` first: it is plain text, it will open, and it tells you exactly what you have. If the source answers your question, stop there. If the document is long enough that the punctuation is in the way, read it rendered — a browser tab for one file, an extension or an editor if this is a weekly habit, Markor or Obsidian on a phone. And if the real problem is that the file has to reach somebody who should never have to see a hash sign, convert it once with [transformpipe's Markdown to HTML conversion](/): it runs in your browser, nothing is uploaded when you are signed out, and what you get back is one self-contained HTML file that opens by double-click on every device anybody is likely to hand it to.

## FAQ

### Why does my .md file open in a code editor?

Because Windows and macOS pick the application from the file extension, and nothing ships claiming `.md`. Whichever program registered the extension most recently wins, and on a machine with developer tools installed that is usually a code editor. It says nothing about the contents of your file.

### Can I open a .md file in Word?

Word will open it if you point it at the file directly, and it treats it as a plain text document — you will see the hashes and asterisks, not headings and bold. Word is not a Markdown renderer, so this is only useful for reading the source. If you need the document in Word format properly, convert it rather than opening it.

### What is the difference between .md and .markdown?

Nothing. Both extensions mean the same plain text following the same conventions, and `.mdown`, `.mkd` and `.mdwn` are the same again. The only extensions that genuinely differ are `.mdx`, which mixes in JavaScript components, and `.rmd`, which is R Markdown with executable code chunks.

### Is it safe to open a .md file somebody sent me?

Reading it in a text editor is completely safe: nothing in the file executes and nothing is fetched. Rendering it is a slightly different question, because Markdown permits raw HTML, so a `.md` file can carry `<script>` tags and `javascript:` URLs that a faithful renderer passes to your browser. Use a viewer that sanitises the HTML, and be aware that a plain text editor sidesteps the issue entirely.

### How do I change the program that opens .md files?

On Windows: right-click, Open with, Choose another app, pick the program, tick the box that makes it permanent — or set it under Settings, Apps, Default apps by searching for `.md`. On macOS: Get Info, Open with, choose the app, then click Change All. On Linux: the file manager's Open With tab, or `xdg-mime default <app>.desktop text/markdown`.

### Can I read a .md file on my phone without installing anything?

Yes. Tap it in Files on iOS or your file manager on Android and you will often get the text in a preview. For formatting with no install, open a browser-based viewer in Safari or Chrome and pick the file through the page's file picker — mobile browsers can read a local file that way, which is the one route that works on both platforms.

### Do I have to convert a .md file to read it?

No. Conversion is for when somebody else has to read it, or when you need the document in another format. For your own reading, a text editor or a viewer is enough, and neither changes the file. Convert when the destination is a person, a printer or an archive rather than your own screen.
