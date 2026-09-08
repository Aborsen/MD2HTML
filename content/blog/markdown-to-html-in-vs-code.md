---
title: "Markdown to HTML in VS Code: Preview, Export and Convert on Save"
description: The VS Code preview runs markdown-it, but the preview stylesheet is never the exported stylesheet. What each export route puts around the fragment.
date: 2026-08-25
tag: Converting
keywords: markdown to html vs code, vscode markdown preview, export markdown to html vscode, markdown.styles, vscode markdown export extension, convert markdown on save, markdown all in one print to html
---

The file is already open. You press Ctrl+Shift+V, the preview appears, and it looks like the page you wanted — headings sized sensibly, code in a monospace block with a tinted background, tables with borders. So you go looking for the export command, and there is not one. VS Code renders Markdown; it does not hand you a `.html` file.

That gap is where most of the trouble in this article lives. The preview is a webview with its own stylesheet, built for reading a file inside the editor. Every route that produces an actual HTML file — an extension, a terminal command, a task — makes its own decisions about what goes around the rendered fragment, and none of them inherits the preview's appearance by default.

### TL;DR

VS Code has no built-in Markdown to HTML export. The preview runs **markdown-it**, so what you see is CommonMark plus what VS Code adds on top, and its appearance comes from the editor's own preview stylesheet — which is **not** what any exporter puts in your file. For a `.html` file, either install an extension (Markdown All in One prints to HTML; Markdown PDF writes HTML, PDF, PNG or JPEG; Markdown Preview Enhanced offers an offline HTML export that inlines its assets) or run a converter from the integrated terminal and wire it to a task. If the file is going to a person rather than into a repository, a converter that produces a complete, self-contained document is a shorter path than making the editor behave.

## What the built-in preview actually is

VS Code's Markdown preview is a webview that runs markdown-it, the same CommonMark-compliant parser several other tools use. That single fact explains most of what the preview does and does not render.

CommonMark gives you headings, emphasis, lists, blockquotes, fenced code blocks, links and images. markdown-it's default configuration adds tables and strikethrough, so those render too. VS Code adds task-list checkboxes on top, which is why `- [x] done` shows a ticked box in the preview and not a literal pair of brackets. Footnotes are in neither CommonMark nor markdown-it's defaults, so `[^1]` renders as literal text until you install an extension that contributes a plugin for it. Mermaid diagrams, PlantUML and maths are the same story, except that maths has a switch of its own: `markdown.math.enabled`.

The behaviour you can change without an extension is a short list, and it is worth knowing because two of these settings change the HTML rather than the appearance:

| Setting | Default | What it changes |
| --- | --- | --- |
| `markdown.preview.breaks` | `false` | Whether a single newline becomes a `<br>` |
| `markdown.preview.linkify` | `true` | Whether bare URLs become links |
| `markdown.preview.typographer` | `false` | Smart quotes, dashes and ellipses |
| `markdown.math.enabled` | `true` | Maths rendering in the preview |
| `markdown.styles` | `[]` | Extra stylesheets loaded into the preview |
| `markdown.preview.fontFamily` | editor default | Preview body font |
| `markdown.preview.scrollPreviewWithEditor` | `true` | Scroll sync, editor to preview |
| `markdown.preview.scrollEditorWithPreview` | `true` | Scroll sync, preview to editor |

`breaks` and `linkify` are the two that matter beyond looks. Turn `breaks` on and every soft line break in your source becomes a `<br>` in the rendered output, which changes the document's structure and not just its rendering — the same source, two different trees. If you have ever wondered why one tool honours your hard-wrapped paragraphs and another joins them into a block, that setting is the whole argument, and its default differs between tools.

Two more settings belong in this list even though they change nothing about the output, because they catch the defects that conversion makes permanent. `markdown.validate.enabled` turns on link checking inside the editor: a relative link to a file that does not exist, or a heading anchor that does not match any heading, is underlined where you can still fix it. `markdown.updateLinksOnFileMove.enabled` offers to rewrite links when you move or rename a Markdown file in the explorer. Both are worth having on in a documentation repository, because a broken relative link in the source is a broken link in every format you convert it to, and conversion does not report it.

The commands are `Markdown: Open Preview` (Ctrl+Shift+V, Cmd+Shift+V on macOS) and `Markdown: Open Preview to the Side` (Ctrl+K V). There is a third command worth remembering: `Markdown: Change preview security settings`, which controls whether the preview loads remote images and whether it executes scripts. The preview is a webview with a content security policy, so a `.md` file containing a `<script>` tag does not get to run it by default. That is a property of the webview. It is not a property of anything you export, and confusing the two is how people end up publishing a page they never inspected.

## Quick comparison: the cheat sheet

| Route | What it produces | Styles in the output | Where it runs | Licence |
| --- | --- | --- | --- | --- |
| Built-in preview | Nothing — a rendered view only | Editor preview stylesheet, not exportable | Webview in the editor | Free, MIT (VS Code source) |
| Copy from the preview | Rich text on the clipboard | Whatever the destination app decides | Editor | Free |
| Markdown All in One | `.html` beside the `.md` | Optionally VS Code's own preview stylesheets | Editor command | Free, MIT |
| Markdown PDF | `.html`, `.pdf`, `.png`, `.jpeg` | Its own default plus `markdown-pdf.styles` | Editor, needs a Chromium browser | Free, MIT |
| Markdown Preview Enhanced | `.html` offline or CDN-hosted | Its own renderer's theme | Editor command, own preview | Free, NCSA licence |
| Pandoc in the integrated terminal | Whatever you ask for | Template's, or none | Terminal, needs an install | Free, GPL |
| A converter behind `tasks.json` | Whatever the converter produces | The converter's | Task runner | Depends on the converter |
| Run on Save extension | Triggers any of the above | Not its concern | On every matching save | Free, Apache 2.0 |
| A browser-side converter | One self-contained `.html` | Inline, in the file | A browser tab | Free |

Read that table by the third column. The route you pick is mostly a decision about what CSS ends up in the file, and it is the column nobody checks until the file is already in somebody's inbox. Every licence named in this article, in that column and below it, is a free, open-source one read from the project's own manifest (checked on each project's repository, 8 September 2026).

## The preview stylesheet is not the exported stylesheet

This is the part that surprises people, so it is worth stating flatly: the appearance of the VS Code Markdown preview is produced by stylesheets that belong to the editor's webview. They are not attached to your document. They are not written into anything you export. An exporter that does not deliberately copy them produces a file that renders at the browser's defaults — Times New Roman at full window width, headings that are merely bigger, code blocks distinguished only by being monospace.

The layering inside the preview makes the separation clearer. Three sources of CSS reach the webview, in this order: VS Code's built-in preview styles first, then any stylesheets extensions have contributed through the `markdown.previewStyles` contribution point, then your own `markdown.styles`. The documented order is built-in, then contributed, then user — which is why your `markdown.styles` rule wins over an extension's, and why an extension that wants to be overridable contributes rather than injects.

None of those three layers is part of the conversion. They style a view of the document. The conversion — Markdown text in, HTML tags out — happens before any of them and knows nothing about them.

There is a second, quieter version of the same surprise, and it catches developers rather than writers. Extensions can add syntax to the preview through the `markdown.markdownItPlugins` contribution point: the extension returns an `extendMarkdownIt` function, VS Code hands it the markdown-it instance, and the plugin is in effect. This affects the preview only. It does not affect how the document is exported or processed anywhere else. So you can install a footnote plugin, watch your footnotes render beautifully, run an export, and get literal `[^1]` in the output — because the exporter has its own parser, its own plugin set, and no knowledge of what the preview was told to do.

The practical rule that follows: **the preview is a reading tool, and the export is a separate program.** Verify the export by opening the exported file, in a browser, not in the editor. Anything you conclude from the preview about the file you are about to send is a guess.

## The extensions that actually export

Three extensions cover almost all of this, and they differ in exactly the way the cheat sheet's third column suggests — in what they put around the fragment.

### Copying out of the preview — the route people try first

Before installing anything, most people select everything in the preview, copy, and paste it into whatever needs the content. This works, in the narrow sense that the clipboard carries rich text and the destination renders it. It is worth knowing precisely what happens, because the result is neither the preview nor an HTML file.

The clipboard receives an HTML flavour of the selection, and the receiving application then applies its own rules to it. An email client keeps the bold and the lists and substitutes its own font. A word processor maps the headings onto its own heading styles, which is often exactly what you wanted. A content management system strips most of it and keeps the structure. In every case the styling is the destination's, not VS Code's, and images referenced by relative path usually do not come along at all.

| Pros | Cons |
| --- | --- |
| No install, no configuration, no file to manage | You get rich text, not a file you can send or serve |
| Headings and lists survive into most destinations | Relative images generally do not survive |
| Good enough for pasting a section into an email | Code blocks lose their highlighting and sometimes their monospace |

**Who is it for?** Anybody moving a few paragraphs into another application. It is not a conversion, and treating it as one is how a table arrives at the other end as five lines of pipes.

### Markdown All in One — the shortest path to a `.html` file

Markdown All in One is a general Markdown extension: keyboard shortcuts, list continuation, a table of contents, and an HTML export. The export command is `Markdown: Print current document to HTML`, with `Markdown: Print documents to HTML` for a batch. It writes the file next to the source.

| Pros | Cons |
| --- | --- |
| One command, no browser, no install beyond the extension | The output leans on VS Code's own preview stylesheets |
| Can reproduce the editor's preview appearance on purpose | Images are linked, not embedded, unless you turn that on |
| Batch command for a folder of files | Not a converter you can call from a build |
| Export on save is a single setting | The HTML is styled for a webview, not for print or email |

**Price:** free, MIT licensed.

The settings are the interesting part, because they are the decisions the exporter is making for you:

| Setting | Default | Effect |
| --- | --- | --- |
| `markdown.extension.print.includeVscodeStylesheets` | `true` | Whether VS Code's own preview CSS goes into the file |
| `markdown.extension.print.imgToBase64` | `false` | Whether images are inlined as data URIs |
| `markdown.extension.print.absoluteImgPath` | `true` | Whether relative image paths are rewritten to absolute ones |
| `markdown.extension.print.theme` | `light` | Colour scheme of the exported HTML |
| `markdown.extension.print.onFileSave` | `false` | Re-export every time you save the `.md` |
| `markdown.extension.print.validateUrls` | `true` | Check links during export |

Two of those decide whether the file travels. `absoluteImgPath` at its default rewrites your relative image references to absolute paths on your machine, which is correct while the file stays where it was written and broken the moment you send it to somebody — their computer has no `C:\Users\you\docs\diagram.png`. Setting `imgToBase64` to `true` inlines the images instead, which makes the file bigger and makes it work anywhere. Which of those you want depends on where the file is going, and the default assumes it is not going anywhere.

**Who is it for?** Somebody who wants the file they are looking at, as HTML, now, and does not much care what the CSS is as long as it is not nothing.

### Markdown PDF — one extension, four output formats

Markdown PDF converts the open document to PDF, HTML, PNG or JPEG. It does this by driving a Chromium-based browser through Puppeteer, using either a browser you point it at, one already installed, or one it downloads and manages.

| Pros | Cons |
| --- | --- |
| HTML and PDF from one configuration | Needs a Chromium browser, downloaded if not found |
| `markdown-pdf.styles` takes your own stylesheets | The browser dependency is heavy for an HTML-only job |
| Convert on save is built in | Slower than a parser, because it renders a page |
| Multiple formats in one run via `markdown-pdf.type` | Output styling is the extension's until you replace it |

**Price:** free, MIT licensed.

The settings worth knowing: `markdown-pdf.type` takes the output format or a list of them; `markdown-pdf.convertOnSave` re-runs the conversion whenever the file is saved; `markdown-pdf.styles` takes a list of local stylesheet paths to apply. Because a real browser is doing the rendering, the PDF path is the strongest thing here — page size, margins and headers are things a browser knows how to do and a Markdown parser does not. If PDF is the actual goal rather than a side effect, the trade-offs are their own subject.

**Who is it for?** Anybody who needs PDF as well as HTML from the same source, and who does not mind a browser being downloaded to do it.

### Markdown Preview Enhanced — the one with an offline export

Markdown Preview Enhanced replaces the built-in preview with its own, which renders maths, mermaid and PlantUML, and exports to several formats. Its HTML export is the only one of the three that names the distinction this article keeps returning to: you choose between **HTML (offline)** and **HTML (cdn hosted)**.

| Pros | Cons |
| --- | --- |
| Offline export inlines assets instead of linking a CDN | It is a second preview, with its own behaviour and its own theme |
| Diagrams and maths render without extra plugins | What you see is no longer what the built-in preview shows |
| Front matter controls the export per document | Script execution has to be enabled for some features |
| Export on save is set in the document, not the settings | The largest extension of the three, by scope |

**Price:** free, under the University of Illinois/NCSA Open Source Licence.

The export is configured in the document's own front matter rather than in settings, which is a genuinely good idea — the document carries its own instructions. The keys include `offline`, `embed_local_images`, `embed_svg`, `print_background` and `toc`, and export on save is declared as:

```yaml
---
export_on_save:
  html: true
---
```

`embed_local_images` converts local images to base64, which is the same decision `imgToBase64` makes in Markdown All in One, and it matters for the same reason. Note that the table of contents feature requires `enableScriptExecution` to be turned on in the extension's settings, because it needs to run a script in the preview.

**Who is it for?** People writing documents with diagrams and equations, who want the export to be described in the file rather than in a machine's settings.

### Pandoc from the integrated terminal — not an extension at all

The integrated terminal is part of the editor, so running a converter in it is still converting from inside VS Code. Pandoc is the usual choice and it produces a complete document when you ask for one:

```sh
pandoc README.md --standalone --embed-resources --output README.html
```

`--standalone` wraps the fragment in a real document with a doctype and a head. `--embed-resources` pulls images and stylesheets into the file so it opens with the network off. Without those two flags Pandoc hands you a fragment, which is the correct behaviour for a library and the wrong file to email. There is more to say about what this costs per run and where it belongs in a pipeline, and [the command-line story is its own article](/blog/markdown-to-html-from-the-command-line).

**Who is it for?** Anybody who already has Pandoc, or who wants the conversion to be a command that a build, a colleague or a CI runner can also execute.

## Custom CSS: markdown.styles, and what it reaches

`markdown.styles` is an array of stylesheet URLs loaded into the preview. In a workspace, put the file in the repository and reference it from `.vscode/settings.json`:

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown.preview.breaks": false,
  "markdown.preview.typographer": true
}
```

Two constraints trip people up. First, the paths are resolved relative to the workspace folder; absolute filesystem paths are not supported, and `file://` URIs are not the workaround — there are open requests in the VS Code repository asking for absolute paths precisely because they do not work. Second, this is a workspace setting for a reason: a stylesheet that lives in the repository travels with the repository, so everybody's preview looks the same. Setting it in your user settings styles every Markdown file you ever open, including other people's, which is rarely what you meant.

Then the important part. `markdown.styles` reaches the preview and nothing else. It does not reach `Markdown: Print current document to HTML`, it does not reach `markdown-pdf.styles`, and it does not reach Markdown Preview Enhanced's export. Each of those has its own stylesheet setting, and if you want one appearance across the preview and the export, you have to point both settings at the same file:

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown-pdf.styles": ["docs/preview.css"]
}
```

That works, with one caveat worth checking before you rely on it: the preview's built-in stylesheet is still underneath yours in the webview and absent from the export, so a stylesheet written as a set of overrides on top of VS Code's defaults produces a much plainer file when those defaults are not there. If you want the two to match, write the stylesheet as a complete stylesheet — body font, spacing, table borders, code block background — rather than as a patch.

The same logic applies to syntax highlighting. The preview highlights code blocks using the editor's own machinery, and the export does not inherit it. An exporter that highlights does so with its own theme and its own class names, and one that does not gives you a plain `<pre><code>` with a language class and nothing colouring it. What highlighting actually needs on the page is a stylesheet, and sometimes a script, neither of which appears by magic.

## Converting on save with a tasks.json entry

If the conversion is going to happen more than twice, put it in the repository rather than in your fingers. A task makes the command a property of the project:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "md to html",
      "type": "shell",
      "command": "pandoc",
      "args": [
        "${file}",
        "--standalone",
        "--embed-resources",
        "--output",
        "${fileDirname}/${fileBasenameNoExtension}.html"
      ],
      "problemMatcher": [],
      "presentation": { "reveal": "silent" },
      "group": { "kind": "build", "isDefault": true }
    }
  ]
}
```

Marking it as the default build task, as the `group` property above does, means Ctrl+Shift+B runs it without a picker — a small thing that decides whether the task gets used. `presentation.reveal` set to `silent` keeps the terminal panel from taking focus on every run, which matters when the run happens dozens of times a day.

`${file}` is the file in the active editor, `${fileDirname}` its folder and `${fileBasenameNoExtension}` its name without the extension, so the task converts whatever you are looking at and writes the result beside it. `"problemMatcher": []` tells VS Code not to scan the output for compiler errors, which otherwise produces a prompt every time you run it.

Now the honest bit, because this is where the tutorials stop and the users start searching. **`tasks.json` cannot run a task when you save a file.** The `runOptions.runOn` property accepts two values: `default`, meaning the task runs when you invoke it, and `folderOpen`, meaning it runs when the containing folder is opened. There is no `onSave`. Three workarounds exist, and they are genuinely different in cost.

**Bind the task to a key.** The cheapest option, and it keeps the trigger explicit. In `keybindings.json`:

```json
{
  "key": "ctrl+alt+h",
  "command": "workbench.action.tasks.runTask",
  "args": "md to html"
}
```

One keystroke, no extra extension, and the conversion happens when you decide it should. For a file you export a few times a day this is the right answer, and the fact that it is manual is a feature — you are not writing HTML files every time you save a half-finished sentence.

**Use the exporter's own on-save setting.** Markdown All in One has `markdown.extension.print.onFileSave`, Markdown PDF has `markdown-pdf.convertOnSave`, and Markdown Preview Enhanced reads `export_on_save` from the document's front matter. Of the three, the front matter version is the best behaved: it is per document, it is in version control, and a file that should not be exported simply does not ask to be.

**Use a file-watcher extension.** The Run on Save extension is the usual choice. Its configuration is a list of regular expressions paired with commands, under `emeraldwalk.runonsave` in settings:

```json
{
  "emeraldwalk.runonsave": {
    "commands": [
      {
        "match": "\\.md$",
        "cmd": "pandoc \"${file}\" --standalone --embed-resources --output \"${fileDirname}/${fileBasenameNoExt}.html\""
      }
    ]
  }
}
```

It is Apache 2.0 licensed and it substitutes its own placeholders — `${file}`, `${fileDirname}`, `${fileBasenameNoExt}`, `${workspaceFolder}` and a few more — which are close enough to VS Code's task variables to be confusing. `${fileBasenameNoExt}` here, `${fileBasenameNoExtension}` in `tasks.json`. Copying one into the other silently produces a file called `${fileBasenameNoExtension}.html`.

The fourth option is to skip the editor's trigger entirely and let the repository own it: a watch script in `package.json`, or a workflow that converts on push so the artefact is built by the same command for everybody. Publishing from a pull request removes the question of whose machine has the right extension installed, which is the failure mode of every setting in this article.

## Where the in-editor route fails, and what it costs

Converting in the editor is fast and local, and it has four costs that only appear later.

### The configuration is per machine, not per repository

Every extension setting in this article lives in a settings file, and only the workspace ones travel. `.vscode/settings.json` is committable, so `markdown.styles`, `markdown-pdf.styles` and `markdown.extension.print.imgToBase64` can be repository properties. The extensions themselves cannot. You can list them in `.vscode/extensions.json` as recommendations, and a recommendation is a prompt somebody can decline. A colleague who runs the same export with a different extension installed produces a different file, and nothing in the repository records which one was right.

This is the difference between a conversion and a habit. A command in a script is reviewable, diffable and repeatable; a sequence of keystrokes in somebody's editor is none of those, and the first sign of trouble is usually a document that looks wrong to one person and fine to another. If the output matters to more than one person, the conversion has to be written down somewhere that is not a settings file on a laptop.

### One file at a time, mostly

Markdown All in One has a batch print command; the rest are built around the active editor. If the job is a folder of documents, or a document assembled from many, the editor is the wrong shape for it — merging first and converting once is a different operation with a different result, and no export command in a text editor is going to do it.

### Nothing in this pipeline sanitises

Markdown permits raw HTML, so a `.md` file can contain `<script>`, `onerror=` and `javascript:` URLs. The built-in preview renders raw HTML and relies on the webview's content security policy to stop scripts running, which protects you while reading. An exported HTML file has no webview and no such policy: whatever raw HTML was in the source is now in a file that a browser will execute. For your own notes this is irrelevant. For a README you pulled from a repository, or a document a client sent, [it is the whole question](/blog/sanitising-markdown-safely), and none of these extensions advertises sanitising as a step.

### The Chromium dependency is real

Markdown PDF's browser download is a one-off inconvenience on a laptop and a genuine problem in CI, where a headless runner has to fetch and cache a browser to produce a file a parser could have produced in milliseconds. If HTML is all you need, a browser is a heavy way to get it.

### When the file has a reader

The costs above are all tolerable when the output goes into a repository, a build or a preview pane. They stop being tolerable when the output goes to a person, because then the file has to survive leaving your machine — it has to carry its styles, resolve its images, and open correctly on a computer that has none of your settings and no idea what a webview is.

That is a specific technical property: a complete, self-contained HTML file, styles inline, no external requests. Some exporters can be configured into producing one; most produce something between a fragment and a document, and you find out which by emailing it to yourself. A converter built for that outcome starts there instead. transformpipe converts Markdown to a single self-contained HTML file in the browser, with nothing uploaded when you are signed out, which means the check that matters — open it elsewhere, with the network off — passes by construction rather than by configuration. [What a document you hand somebody has to do](/blog/share-a-markdown-document-as-a-link) is a shorter list than what a repository's build has to do, and the editor is optimised for the second.

## How to choose, in five questions

1. **Is the output for a reader or for a repository?** A reader needs one self-contained file, so the styles and images have to be inside it; a repository needs a reproducible command, so it has to live in version control rather than in somebody's extension settings.
2. **Does the exporter carry styles into the file?** If it does not, you get browser defaults, and a document at the browser's default width with no table borders reads as broken even though the HTML is correct.
3. **Are there images?** Relative paths break when the file moves and absolute paths break the moment it leaves your machine, so unless the images are inlined as data URIs, the file only works where it was written.
4. **Does anything need to run this without you?** If the answer is yes, the conversion belongs in a command a task, a script or a CI job can call, because an editor command is a person pressing a key and a person is not available at 3am.
5. **Did you write everything in the file?** If not, something has to sanitise the raw HTML before the output reaches a browser, because no part of the in-editor route does it for you.

## Conclusion

Converting Markdown to HTML in VS Code works well for exactly the case it was built for: a file you are already editing, an export you are about to look at yourself, on a machine you have configured. Beyond that, the two things people expect the editor to do — reproduce the preview's appearance in the exported file, and run the conversion automatically on save — are both things it does not do, and both fixable only by picking an extension and reading its settings carefully. If what you need is one HTML file that opens correctly on somebody else's computer, converting [Markdown to HTML with a browser-side converter](/) is fewer decisions than making three extensions agree, and [the wider comparison of converters](/blog/best-markdown-to-html-converters) covers the libraries and command-line tools worth wiring into a build instead.

## FAQ

### Does VS Code have a built-in Markdown to HTML export?

No. VS Code ships a Markdown preview and no export command, so producing a `.html` file needs either an extension or a converter run from the integrated terminal. The preview's purpose is reading the file in the editor, not producing a deliverable.

### Why does my exported HTML look nothing like the preview?

Because the preview's appearance comes from VS Code's own webview stylesheets, which are not part of your document and are not written into any export. Unless the exporter deliberately copies them — Markdown All in One has a setting for exactly that — the exported file renders at the browser's defaults.

### How do I use my own CSS in the VS Code Markdown preview?

Add the stylesheet to `markdown.styles` in `.vscode/settings.json`, with a path relative to the workspace folder. Absolute filesystem paths are not supported, and the setting affects only the preview — for the export you also have to set the exporting extension's own styles option.

### Can VS Code convert Markdown to HTML every time I save?

Not through `tasks.json`, whose `runOptions.runOn` accepts only `default` and `folderOpen`. Use an exporter's own on-save setting, such as `markdown.extension.print.onFileSave` or `markdown-pdf.convertOnSave`, or a file-watcher extension that runs a command on matching saves.

### Why do my footnotes render in the preview but not in the export?

Because markdown-it plugins contributed by extensions apply to the preview only and have no effect on how the document is exported. The exporter has its own parser and its own plugin set, so a syntax the preview understands can come out as literal text in the file.

### Does the preview render GitHub Flavored Markdown?

Mostly, in practice: markdown-it handles tables and strikethrough, VS Code adds task-list checkboxes, and bare URLs become links because `markdown.preview.linkify` defaults to on. It is not a guarantee of GitHub's exact output, and [the differences between flavours are worth knowing](/blog/commonmark-gfm-and-the-flavours) before you assume a file renders the same in both places.

### Which route gives me a single file with no external requests?

Markdown Preview Enhanced's `HTML (offline)` export and Pandoc's `--standalone --embed-resources` both aim at this, as does any converter whose stated output is a self-contained document. Test it the only way that proves anything: open the file on a different machine with the network disabled.
