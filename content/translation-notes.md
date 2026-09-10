# Translating the blog

Not a style guide for the writing — that is `blog-plan.md`. This is the small set of decisions that
have to be the same in all fifty-six files of a language, because they are what a reader compares
across pages and what the filter chips are built from.

## Where a translation lives

`content/blog/<locale>/<slug>.md`, under the English file's name. The slug never changes: internal
links are written `](/blog/markdown-escaping)` in the prose and inherited by every translation, so a
translated slug would make a cross-reference depend on which language the reader is in. The URL
prefix carries the language — `/de/blog/markdown-escaping`.

Leave those links exactly as the English file has them. The prerenderer rewrites each one to the
current language when that language has the target, and leaves it pointing at English when it does
not, so a half-finished translation has no dead links in it.

## The frontmatter

Everything in it is translated, and two fields are not translations but decisions:

- **description** — 100 to 165 characters, checked by `npm run blog:check`. German runs longer than
  English, so a literal translation of a 160-character line will fail. Write the sentence for the
  language, not for the original.
- **keywords** — what people type in that language, not the English terms translated. "md in html
  umwandeln" is a real German query; "convert md to html" translated word for word is not.

`date` and `updated` stay as the English file has them. They say when the piece was written, and a
translation is not a new article.

## The tags

One word per language, the same word every time, because the chips on the index are built from
whatever the articles say and two spellings make two chips.

| English | Deutsch | Français | Español | Italiano |
| --- | --- | --- | --- | --- |
| Converting | Konvertieren | Conversion | Conversión | Conversione |
| Workflow | Workflow | Organisation | Flujo de trabajo | Flusso di lavoro |
| Syntax | Syntax | Syntaxe | Sintaxis | Sintassi |
| Publishing | Veröffentlichen | Publication | Publicación | Pubblicazione |
| Code | Code | Code | Código | Codice |
| Automation | Automatisierung | Automatisation | Automatización | Automazione |
| Safety | Sicherheit | Sécurité | Seguridad | Sicurezza |

`Workflow` stays as it is in German: it is the word German developers use, and `Arbeitsablauf` reads
like a translation of a word nobody needed translated.

## The German terms, once each

Fourteen articles now use these. A synonym is not wrong German, it is a second word for a thing the
reader already learned two articles ago, so keep to the column.

| English | Deutsch |
| --- | --- |
| flavour (of Markdown) | Dialekt |
| fenced code block | eingezäunter Codeblock |
| code span | Code-Spanne |
| info string | Info-String |
| to escape / escaping | maskieren / Maskierung |
| allow-list | Positivliste |
| block-list | Sperrliste |
| to sanitise | bereinigen |
| sanitiser | Bereiniger |
| separator row (in a table) | Trennzeile |
| header row | Kopfzeile |
| body row | Datenzeile |
| pipe | Pipe |
| backslash | Backslash |
| task list | Aufgabenliste |
| strikethrough | Durchgestrichenes |
| self-contained (file) | eigenständig |
| page furniture | Seitenmobiliar |
| extractor | Extraktor |
| tracked changes | verfolgte Änderungen |
| style map | Stilzuordnung |
| hard line break | harter Zeilenumbruch |
| soft line break | sanfter Zeilenumbruch |
| tight / loose list | dichte / locker gesetzte Liste |
| front matter | Frontmatter |
| admonition | Hinweisblock |
| delimiter run | Trennzeichenlauf |
| lazy continuation | nachlässige Fortsetzung |
| thematic break | thematische Trennlinie |
| superset | Obermenge |
| entity reference | Zeichenreferenz |
| syntax highlighting | Syntaxhervorhebung |
| alt text | Alt-Text |
| root-relative (path) | wurzelrelativ |
| reference label (a link's) | Kürzel |
| link checker | Link-Prüfer |
| tracking pixel | Zählpixel |
| single file HTML | HTML in einer Datei |
| web font | Webschrift |
| assets (a folder of) | Beiwerk |
| copy button | Kopierschaltfläche |
| rich text | formatierter Text |
| destination (where you paste) | Zielort |
| cheat sheet | Merkblatt |
| checklist | Prüfliste |
| read-only link | Nur-Lese-Link |
| citation marker | Zitatmarke |
| block reference | Blockreferenz |
| emphasis | Betonung |
| globbing | Glob |
| exit code | Exit-Code |
| wrapper | Verpackung |
| toolchain | Werkzeugkette |
| default (a setting's) | Voreinstellung |

`Betonung` for emphasis, not `Hervorhebung`: that one is reserved for `Syntaxhervorhebung`,
where it means colouring code rather than marking a word.

Formal address throughout: "Sie", never "du".

## What is not translated

Code samples, command lines, flags and file names. A German reader runs `pandoc --standalone`, not
`pandoc --eigenständig`. Comments inside a sample are prose and are translated; the code around them
is not.

A docstring is prose too, and is translated — it is the sample's documentation, addressed to the
reader, not something the program parses. Any path or identifier inside it stays as it is. That is
the line between the two: a string the program acts on is code, a string that only explains is prose.

Product names, error messages quoted from a tool, and anything in a table of licences.

## The brand

**TransformPipe**, capitalised, and no more than four times in a piece — `blog:check` fails at five,
because an article that names the product five times reads as an advertisement. The English file is
already at or under that limit, so the count is a thing to preserve rather than to work out again.

## The covers

`npm run og` draws one share image and one card image per article per language, with the translated
headline in the picture. Run it after adding files or `blog:check` fails on the missing images.
