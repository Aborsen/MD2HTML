---
title: Markdown in Python zu HTML darstellen
description: "Python-Markdown, markdown2, mistune und markdown-it-py im Vergleich: welche Erweiterungen fehlen, Bereinigen mit nh3 und ein Skript, das Builds scheitern lässt"
updated: 2026-09-09
date: 2026-07-07
tag: Code
keywords: markdown zu html python, python markdown, markdown2 python, mistune, markdown parser python, markdown programmatisch umwandeln, python markdown erweiterungen, markdown-it-py, pymdown-extensions, html bereinigen nh3, pypandoc
---

`markdown.markdown(text)` ist die erste Zeile, die fast jeder schreibt, und sie funktioniert. Dann kommt eine Tabelle in die README, das HTML kommt mit Pipes zurück, die in einem Absatz sitzen, und die Suche beginnt. Python hat vier Markdown-Bibliotheken, die man kennen sollte. Die Unterschiede zwischen ihnen betreffen vor allem, was standardmäßig eingeschaltet ist und wie weit Sie die Ausgabe verändern können.

### Kurzfassung

Vier Bibliotheken, und die Wahl ist enger, als sie aussieht. **Python-Markdown** ist die, auf der die meisten Python-Werkzeuge aufbauen, und sie liefert fast nichts eingeschaltet aus — Tabellen, eingezäunter Code, Fußnoten und Überschriften-IDs sind alle Erweiterungen, die Sie benennen müssen. **markdown2** ist ein einzelnes Modul, in dem dieselben Merkmale Extras heißen und die Schreibweise anders ist. **mistune** ist die, nach der Sie greifen, wenn das HTML eine bestimmte Form haben muss, denn dort leiten Sie einen Renderer ab, statt einen regulären Ausdruck über die fertige Zeichenkette laufen zu lassen. **markdown-it-py** ist die, nach der Sie greifen, wenn dasselbe Dokument in einem Browser identisch dargestellt werden muss, denn sie ist eine Portierung des JavaScript-markdown-it und folgt der CommonMark-Spezifikation. Keine der vier bereinigt, welche Sie also auch wählen: nh3 kommt hinterher.

Die Reibung hat immer dieselbe Form. Ein Skript, das mit einer README funktionierte, hört in der Woche auf zu funktionieren, in der jemand eine Tabelle hinzufügt, oder eine Fußnote, oder einen eingezäunten Block mit einer Sprache daran. Nichts wirft einen Fehler. Der Parser liest die Pipe-Zeichen als gewöhnlichen Text, packt sie in einen Absatz und gibt HTML zurück, das vollkommen gültig und sichtbar falsch ist. Stille Verschlechterung ist das Standardverhalten jedes Markdown-Parsers, denn es gibt kein ungültiges Markdown — alles, was der Parser nicht erkennt, ist Prosa.

Das Zweite, was zubeißt, ist, dass die Aufgabe der Bibliothek früher endet, als man denkt. Alle vier geben ein Fragment zurück: `<h1>Title</h1><p>Text</p>` ohne Doctype, ohne `<head>`, ohne Stile. In eine `.html`-Datei geschrieben und geöffnet, ist das schwarzes Times New Roman über die volle Breite des Fensters. Die Bibliothek hat ihre Aufgabe erledigt. Der Rest — die Hülle, das Stylesheet, der Bereiniger — ist Ihrer, und dieser Text behandelt alles davon.

## Die vier Bibliotheken auf einen Blick

| Bibliothek | Installation | Dialekt und Spezifikation | Wie sie sich erweitern lässt | Lizenz | Am besten für |
| --- | --- | --- | --- | --- | --- |
| Python-Markdown | `pip install markdown` | Standardmäßig die ursprüngliche Markdown-Syntax; nicht in jedem Detail CommonMark-konform | Benannte Erweiterungen mit einer Entry-Point-API, dazu große Pakete von Drittanbietern | Kostenlos, BSD-3-Clause | Dokumentations-Builds und alles, was schon MkDocs verwendet |
| markdown2 | `pip install markdown2` | Ein eigener Dialekt; nicht CommonMark | Eine Liste von Zeichenketten-„Extras", die einem einzigen Aufruf übergeben wird | Kostenlos, MIT | Ein Aufruf, eine Liste, keine Konfigurationsdatei |
| mistune | `pip install mistune` | „Kompatibel mit vernünftigen CommonMark-Regeln", in den eigenen Worten | Plugins nach Namen, dazu Renderer-Klassen, die Sie ableiten | Kostenlos, BSD-3-Clause | Das ausgegebene HTML ändern, ohne es nachzubearbeiten |
| markdown-it-py | `pip install markdown-it-py` | Folgt für das Basis-Parsing der CommonMark-Spezifikation | Presets, einzeln benannte Regeln und mdit-py-plugins | Kostenlos, MIT | Ein JavaScript-Frontend exakt treffen |

Lizenzen und Angaben zur Spezifikation geprüft auf pypi.org, python-markdown.github.io, mistune.lepture.com und markdown-it-py.readthedocs.io, 9. September 2026. In dieser Tabelle stehen absichtlich keine Geschwindigkeitszahlen: Jeder veröffentlichte Markdown-Benchmark misst ein anderes Korpus mit einem anderen Satz an Erweiterungen, und die einzige Zahl, die etwas bedeutet, ist die, die Sie aus Ihren eigenen Dokumenten bekommen.

## Die vier Bibliotheken im Detail

### Python-Markdown, und die Erweiterungen, die es auslässt

Python-Markdown — `pip install markdown`, importiert als `markdown` — ist die älteste der vier. Für sich allein implementiert sie die ursprüngliche Markdown-Syntax und nichts weiter. Keine Tabellen. Keine eingezäunten Codeblöcke. Keine Fußnoten. Das sind Erweiterungen, und sie bleiben aus, bis Sie sie benennen.

```python
import markdown

html = markdown.markdown(
    text,
    extensions=["tables", "fenced_code", "toc", "sane_lists"],
    extension_configs={"toc": {"anchorlink": True}},
)
```

Die Schalter, die Leute übersehen, sind fast immer diese:

| Was Sie erwartet haben | Erweiterung | Hinweis |
| --- | --- | --- |
| Tabellen im GitHub-Stil | `tables` | |
| Code-Zäune aus drei Backticks | `fenced_code` | |
| IDs und Anker an Überschriften | `toc` | füllt auch `md.toc` |
| Hervorgehobener Code | `codehilite` | braucht ein installiertes Pygments |
| Fußnoten | `footnotes` | |
| `{: .note}`-Attribute an Elementen | `attr_list` | |
| Ein einzelner Zeilenumbruch, der zu einem Umbruch wird | `nl2br` | |

`extra` schaltet ein Bündel ein — `abbr`, `attr_list`, `def_list`, `fenced_code`, `footnotes`, `md_in_html`, `tables` — und bringt Sie nahe an das, was Sie ohnehin schon zu haben glaubten (geprüft auf python-markdown.github.io, 9. September 2026). Beachten Sie, was darin noch fehlt: `nl2br`, `codehilite`, `toc`, `smarty`, `sane_lists` und `meta`. `extra` ist eine Bequemlichkeit, keine Obermenge, und die zwei Dinge, von denen die Leute am häufigsten glauben, sie seien enthalten — Überschriften-IDs und Syntaxhervorhebung —, sind genau die zwei, die es auslässt.

Die vollständige offizielle Liste ist kurz genug, um sie einmal zu lesen und mit dem Raten aufzuhören:

| Erweiterung | Was sie tut | Wissenswert |
| --- | --- | --- |
| `tables` | Pipe-Tabellen im GFM-Stil | In `extra` |
| `fenced_code` | Zäune aus drei Backticks und aus Tilden | In `extra`; der Info-String wird zu einer Sprachklasse |
| `footnotes` | `[^1]`-Verweise und eine Fußnotenliste | In `extra`; trägt Zustand zwischen Dokumenten |
| `attr_list` | `{: .note #id }` nach einem Element setzt Klasse, ID und Attribute | In `extra`; die Syntax ist für jeden anderen Parser unsichtbar |
| `def_list` | Definitionslisten | In `extra` |
| `abbr` | `*[HTML]: HyperText Markup Language` wird zu `<abbr>` | In `extra` |
| `md_in_html` | Parst Markdown in einem rohen HTML-Block, der mit `markdown="1"` markiert ist | In `extra`; der Grund, warum eine `<div>`-Hülle aufhört, Ihren Text zu verschlucken |
| `codehilite` | Syntaxhervorhebung über Pygments | Nicht in `extra`; braucht ein installiertes Pygments und ein Stylesheet |
| `toc` | IDs an Überschriften, eine `[TOC]`-Markierung und `md.toc` | Nicht in `extra`; trägt Zustand |
| `smarty` | Typografische Anführungszeichen, Halbgeviert- und Geviertstriche, Auslassungspunkte | Nicht in `extra`; ändert Zeichen, diffen Sie also Ihre Ausgabe |
| `meta` | Liest einen `key: value`-Kopfblock in `md.Meta` | Nicht in `extra`; kein YAML-Parser |
| `nl2br` | Ein einzelner Zeilenumbruch wird zu `<br>` | Nicht in `extra`; das ist das Verhalten der GitHub-Kommentare |
| `sane_lists` | Strengeres Listen-Parsing: Eine Liste braucht eine Leerzeile davor | Nicht in `extra` |
| `admonition` | `!!! note`-Blöcke | Nicht in `extra`; die Callout-Syntax von MkDocs |
| `wikilinks` | `[[Page]]` wird zu einem Link | Nicht in `extra` |
| `legacy_attrs`, `legacy_em` | Kompatibilität mit dem Verhalten vor 3.0 | Nur für alte Dokumente |

Vier davon verdienen mehr als eine Tabellenzeile.

**`codehilite`** hebt von sich aus nichts hervor. Es gibt den Code an Pygments, das `<span>`-Elemente mit Klassennamen ausgibt, und diese Klassennamen bedeuten nichts, solange kein Stylesheet sie definiert. Die eigene Dokumentation der Erweiterung nennt Ihnen den Befehl, der eines erzeugt — `pygmentize -S default -f html -a .codehilite > styles.css` —, und ihre Optionen umfassen `linenums`, `guess_lang`, `css_class`, `pygments_style`, `noclasses` und `use_pygments` (geprüft auf python-markdown.github.io, 9. September 2026). `noclasses=True` schreibt die Farben stattdessen als `style`-Attribute ins Element, was größer und hässlicher ist und genau das, was Sie wollen, wenn das HTML es überleben muss, in eine E-Mail eingefügt zu werden. `use_pygments=False` überspringt Pygments ganz und lässt eine Sprachklasse am `<code>`-Element zurück, damit ein Hervorheber auf der Client-Seite sie später aufgreift — was die richtige Wahl ist, wenn die Seite ohnehin einen lädt. [Was Syntaxhervorhebung auf der Seite tatsächlich braucht](/blog/code-blocks-in-markdown) ist eine längere Geschichte als „einen Zaun hinzufügen".

**`toc`** erledigt zwei Aufgaben, und die Leute wollen meist die zweite. Es ersetzt eine `[TOC]`-Markierung in der Quelle durch eine verschachtelte Liste, und es setzt an jede Überschrift eine `id`. Seine Optionen umfassen `anchorlink`, `permalink`, `baselevel`, `separator`, `slugify` und `toc_depth`, und nach einer Konvertierung trägt die Instanz beides: `md.toc`, das Inhaltsverzeichnis als HTML-Zeichenkette, und `md.toc_tokens`, dasselbe als verschachtelte Dictionaries (geprüft auf python-markdown.github.io, 9. September 2026). `md.toc` ist verfügbar, ob die Markierung im Dokument auftauchte oder nicht, und genau das erlaubt einem Template, das Verzeichnis in eine Seitenleiste zu setzen statt über den Text. `baselevel` zählt, wenn das Template schon ein `<h1>` darstellt: Setzen Sie es auf 2, und die `#`-Überschriften des Dokuments kommen als `<h2>` heraus, statt sich mit der Seite zu streiten.

**`meta`** sieht nach Unterstützung für Frontmatter aus und ist es nicht. Es liest einen Block von `key: value`-Zeilen am Anfang der Datei in `md.Meta`, es duldet `---`-Trennzeichen, und seine eigene Dokumentation sagt ausdrücklich, dass der Inhalt nicht als YAML geparst wird. Jeder Wert kommt als Liste von Zeichenketten an, ein Eintrag pro Zeile, `md.Meta["title"][0]` ist also der Titel und `md.Meta["title"]` eine Liste mit einem Element (geprüft auf python-markdown.github.io, 9. September 2026). Tragen Ihre Dateien echtes YAML — verschachtelte Schlüssel, Listen, Booleans, Daten —, lesen Sie den Kopf mit `python-frontmatter` oder `yaml.safe_load`, bevor der Text den Parser erreicht.

**`attr_list`** ist das, was Sie Portabilität kostet. `{: .warning }` nach einem Absatz ist eine Konvention von Python-Markdown; auf GitHub, in einer Browser-Vorschau oder in jeder der drei anderen Bibliotheken hier sind es fünf wörtliche Zeichen am Ende Ihres Satzes.

Für mehr als ein Dokument bauen Sie den Konverter einmal mit `markdown.Markdown(extensions=[...])` und rufen zwischen den Dateien `.reset()` auf. Fußnoten und das Inhaltsverzeichnis tragen Zustand, ohne das Zurücksetzen erbt die zweite Seite also die Fußnoten der ersten. Die Dokumentation sagt dasselbe in mehr Worten: Der Parser muss seinen Zustand womöglich zwischen jedem Aufruf von `convert` zurücksetzen (geprüft auf python-markdown.github.io, 9. September 2026). Die Folgerung zählt für den Abschnitt über Parallelität weiter unten — eine `Markdown`-Instanz ist ein zustandsbehaftetes Objekt, sie gehört also einem Worker und nicht einem Pool.

Zwei kleinere Stellschrauben, beide in der Bibliotheksreferenz dokumentiert (geprüft auf python-markdown.github.io, 9. September 2026). `output_format` nimmt `"xhtml"` oder `"html"` und entscheidet, ob ein Zeilenumbruch als `<br />` oder als `<br>` herauskommt; die Vorgabe ist `"xhtml"`, was Leute überrascht, die HTML5 schreiben. Und `tab_length` steht standardmäßig auf 4 — rücken Ihre Dokumente verschachtelte Listen mit zwei Leerzeichen ein, ist das der Grund, warum die Verschachtelung zusammenfällt.

**pymdown-extensions** ist das, was die meisten Leute tatsächlich obendrauf installieren. Es ist ein MIT-lizenziertes Paket unter dem Namensraum `pymdownx`, und es bringt Arithmatex, B64, BetterEm, Blocks, Caret, Critic, Details, Emoji, EscapeAll, Extra, FancyLists, Highlight, InlineHilite, Keys, MagicLink, Mark, PathConverter, ProgressBar, Quotes, SaneHeaders, SmartSymbols, Snippets, StripHTML, SuperFences, Tabbed, Tasklist und Tilde mit (geprüft auf facelessuser.github.io, 9. September 2026). Drei davon erledigen die meiste Arbeit: `pymdownx.superfences` ersetzt `fenced_code` und lässt Zäune sich in Listenelementen und Hinweisblöcken verschachteln, `pymdownx.highlight` bündelt die Pygments-Konfiguration, die sonst `codehilite` hielte, und `pymdownx.tasklist` gibt Ihnen die Checkbox-Syntax von GitHub, für die Python-Markdown keine offizielle Erweiterung hat. Wenn Sie sich je gefragt haben, warum eine MkDocs-Material-Seite Inhalte in Tabs kann und Ihr Skript nicht, ist dieses Paket die Antwort.

**Wer sollte es verwenden?** Python-Build-Skripte und alle, deren Dokumentation schon durch MkDocs läuft, wo Python-Markdown die Engine ist und die Erweiterungsliste in einer Konfigurationsdatei steht, die Sie ohnehin bearbeiten.

### markdown2 und seine Extras

markdown2 ist ein einzelnes Modul mit derselben Form und einem anderen Vokabular: Merkmale sind *Extras*, und sie sind ebenfalls standardmäßig aus.

```python
import markdown2

html = markdown2.markdown(
    text,
    extras=["tables", "fenced-code-blocks", "strike", "header-ids", "footnotes"],
)
```

Es gibt mehr Extras, als sich irgendwer merkt, es hilft also, sie danach gruppiert zu sehen, wozu sie da sind (Namen geprüft auf github.com, 9. September 2026):

| Was Sie wollen | Extras |
| --- | --- |
| Die GFM-Merkmale, die Sie schon zu haben glaubten | `tables`, `fenced-code-blocks`, `strike`, `task_list`, `header-ids`, `footnotes` |
| Metadaten und Struktur | `metadata`, `toc`, `numbering`, `cuddled-lists`, `breaks` |
| Code und Mathematik | `code-friendly`, `highlightjs-lang`, `pyshell`, `latex`, `wavedrom`, `mermaid` |
| Typografie | `smarty-pants`, `middle-word-em`, `tag-friendly` |
| Links und das Formen der Ausgabe | `link-patterns`, `nofollow`, `target-blank-links`, `html-classes`, `xml` |
| Zusammenspiel mit HTML | `markdown-in-html`, `wiki-tables`, `spoiler`, `tg-spoiler`, `admonitions` |

Drei davon sind es wert, einzeln genannt zu werden. `code-friendly` schaltet `_` und `__` als Betonungsmarkierungen ab, und das ist die Lösung für ein Dokument voller `some_variable_name`, das auf halber Strecke Kursives ausschlägt. `link-patterns` nimmt eine Liste von Paaren aus regulärem Ausdruck und Ersetzung und verlinkt automatisch alles, was passt — `#1234` in eine Issue-URL, `CVE-2026-…` in eine Sicherheitsmeldung —, was keine der anderen drei Bibliotheken hier als Einzeiler mitbringt. Und `header-ids` ist markdown2s Name für das, was Python-Markdown `toc` nennt; wenn Sie die Bibliothek wechseln und Ihre Anker brechen, ist das der Grund.

Der Kompromiss lautet weniger bewegliche Teile gegen ein kleineres Ökosystem: Brauchen Sie etwas, das keine der beiden Bibliotheken mitbringt, hat Python-Markdown eine dokumentierte Erweiterungs-API und Erweiterungen von Drittanbietern, auf die Sie zurückgreifen können.

Achten Sie auf die Schreibweise. Die zwei Bibliotheken benennen dasselbe Merkmal unterschiedlich — `fenced_code` gegen `fenced-code-blocks` —, halten Sie die Liste also in einer einzigen Konstante, statt sie an jeder Aufrufstelle neu zu tippen. Die beiden zu verwechseln ist der übliche Grund, warum eine Seite eine Tabelle darstellt und eine andere Pipes ausgibt.

**Wer sollte es verwenden?** Ein Skript, das einen Import, einen Aufruf und eine Liste von Zeichenketten braucht, ohne Erweiterungsregister, ohne Konfigurationsobjekt und ohne zweites Paket. markdown2 ist MIT-lizenziert (geprüft auf pypi.org, 9. September 2026).

### mistune, wenn Sie die Ausgabe ändern wollen

mistune ist ein reiner Python-Markdown-Parser, gebaut um Plugins und Renderer. `mistune.html(text)` ist der bequeme Aufruf; in `create_markdown` wohnen die Entscheidungen.

```python
import mistune

render = mistune.create_markdown(
    escape=True,
    plugins=["table", "strikethrough", "task_lists", "url"],
)
html = render(text)
```

`escape=True` maskiert rohes HTML in der Quelle, statt es durchzulassen, und das ist, was Sie wollen, wenn das Markdown von jemand anderem kam. Übergeben Sie `escape=False`, wenn die Quelle Ihre eigene ist und absichtliches HTML enthält.

Die mitgelieferten Plugins sind `strikethrough`, `footnotes`, `table`, `url`, `task_lists`, `def_list`, `abbr`, `mark`, `insert`, `superscript`, `subscript`, `math`, `ruby` und `spoiler` (geprüft auf mistune.lepture.com, 9. September 2026). Übergeben Sie sie als Zeichenketten, oder importieren Sie die Funktionen und übergeben diese — die Zeichenkettenform ist ein Nachschlagen in `mistune.plugins`.

Der eigentliche Grund, zu mistune zu greifen, ist der Renderer. Leiten Sie `HTMLRenderer` ab, überschreiben Sie die Methode für einen Knotentyp, und Bilder oder Links kommen in der Form heraus, die Sie wollen — mit `loading="lazy"`, etwa —, ohne dass ein regulärer Ausdruck über die fertige Zeichenkette läuft.

```python
from html import escape

import mistune
from mistune import HTMLRenderer


class DocRenderer(HTMLRenderer):
    def image(self, alt, url, title=None):
        attrs = f' title="{escape(title, quote=True)}"' if title else ""
        return (
            f'<img src="{escape(url, quote=True)}" alt="{escape(alt, quote=True)}"'
            f'{attrs} loading="lazy" decoding="async">'
        )

    def heading(self, text, level, **attrs):
        slug = attrs.get("id") or text.lower().replace(" ", "-")
        return f'<h{level} id="doc-{slug}">{text}</h{level}>'


render = mistune.create_markdown(renderer=DocRenderer(), plugins=["table", "footnotes"])
```

Die Methodennamen sind die Knotentypen, und die Signaturen sind dokumentiert: `link(self, text, url, title=None)`, `image(self, alt, url, title=None)`, `heading(self, text, level, **attrs)`, `block_code(self, code, info=None)`, `paragraph(self, text)`, `list(self, text, ordered, **attrs)`, `codespan(self, text)`, `inline_html(self, html)` und der Rest (geprüft auf mistune.lepture.com, 9. September 2026). Plugins fügen ihre eigenen hinzu: `strikethrough(self, text)`, `table_cell(self, text, align=None, head=False)`.

Diese Unterscheidung — den Renderer überschreiben statt die Zeichenkette flicken — ist das ganze Argument für mistune, und es lohnt sich, konkret zu sagen, warum sie zählt. HTML mit einem regulären Ausdruck nachzubearbeiten funktioniert, bis ein `<img>` in einem Codeblock auftaucht, oder ein Attributwert das Zeichen enthält, auf das Sie gematcht haben, oder jemand `<img>` in einem Satz über HTML schreibt. Der Renderer läuft auf geparsten Knoten, ein Code-Zaun, der den Text `<img src=x>` enthält, erreicht `image()` also überhaupt nie; er erreicht `block_code()`, als Text. Es gibt keinen Fall, in dem die beiden Ansätze zu Ihren Gunsten auseinandergehen.

`block_code(self, code, info=None)` ist der Haken für die Syntaxhervorhebung: `info` ist die Zeichenkette nach den öffnenden Backticks, Sie bekommen also den Namen der Sprache und können den Körper selbst an Pygments geben, mit Ihren eigenen Klassennamen, ohne eine Erweiterung dazwischen. mistune liefert neben `HTMLRenderer` auch `RSTRenderer` und `MarkdownRenderer` mit, und so verwenden Sie es, um Markdown zu normalisieren, statt Markdown überhaupt zu verlassen.

**Wer sollte es verwenden?** Alle, deren Ausgabe eine Bedingung erfüllen muss, von der die Bibliothek nichts weiß — eine Content Security Policy, die Stile im Element verbietet, eine Bild-Pipeline, die `src` umschreibt, ein Designsystem, dessen Tabellen für das horizontale Scrollen eine `<div>`-Hülle brauchen. mistune ist BSD-3-Clause-lizenziert (geprüft auf pypi.org, 9. September 2026).

### markdown-it-py, und warum CommonMark-Konformität zählt

Wenn die Anforderung „passt zur Spezifikation" lautet, ist markdown-it-py die direkte Antwort. Es ist eine Python-Portierung des JavaScript-markdown-it und folgt CommonMark genau. Presets wählen einen Ausgangspunkt, und Regeln werden namentlich eingeschaltet.

```python
from markdown_it import MarkdownIt

md = MarkdownIt("commonmark")
md.enable(["table", "strikethrough"])
html = md.render(text)
```

Die Presets sind der schnellste Weg, zu sagen, was Sie meinen (geprüft auf markdown-it-py.readthedocs.io, 9. September 2026):

| Preset | Was Sie bekommen |
| --- | --- |
| `zero` | Absätze und Text, nichts weiter — ein Ausgangspunkt, den Sie Regel für Regel aufbauen |
| `commonmark` | Strenges CommonMark: eingezäunter Code, keine Tabellen, kein Durchgestrichenes, keine Autolinks |
| `js-default` | Rohes HTML abgeschaltet, Tabellen und Durchgestrichenes eingeschaltet |
| `gfm-like` | Tabellen, Durchgestrichenes und linkify — braucht das Paket `linkify-it-py` |
| `gfm-like2` | `gfm-like` plus Aufgabenlisten, Hinweisblöcke im GitHub-Stil und Durchgestrichenes mit einzelner Tilde; braucht ebenfalls `linkify-it-py` |

Regeln werden auf der Core-, Block- und Inline-Ebene namentlich ein- und ausgeschaltet, dauerhaft über `enable()` und `disable()` oder vorübergehend über einen Kontextmanager. Diese Feinkörnigkeit ist ungewöhnlich und gelegentlich der ganze Punkt: Wenn Ihre Plattform keine Bilder darstellen darf, ist `md.disable("image")` eine Garantie auf Parser-Ebene und kein Filter, der hinterher angewandt wird.

`mdit-py-plugins` ist das Begleitpaket — `pip install mdit-py-plugins`, daneben `pip install markdown-it-py[linkify]`, wenn Sie die linkify-Presets wollen — und es bringt die Syntaxerweiterungen mit, die nicht in der Spezifikation stehen: Frontmatter, Fußnoten, Definitionslisten, Container, Anker, Aufgabenlisten. Sie werden mit `md.use(plugin)` angewandt:

```python
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin
from mdit_py_plugins.footnote import footnote_plugin

md = MarkdownIt("gfm-like").use(front_matter_plugin).use(footnote_plugin)
html = md.render(text)
```

Nun der Grund, warum Konformität zählt, klar gesagt. Ein Markdown-Dokument, das zweimal dargestellt wird — einmal von Ihrem Python-Backend für die per E-Mail verschickte Fassung, einmal von JavaScript im Browser für die Live-Vorschau —, muss gleich herauskommen, und „gleich" ist nichts, was zwei unabhängig voneinander geschriebene Parser je sind. Links im Referenzstil, nachlässige Fortsetzung in Blockzitaten, wie viele Backticks einen Zaun schließen, ob eine Liste locker gesetzt oder dicht ist, was ein Unterstrich innerhalb eines Wortes tut: Das sind genau die Fälle, in denen Implementierungen auseinandergehen, und jeder einzelne davon ist von der CommonMark-Spezifikation und ihrer Testsuite festgenagelt. Zwei Parser, die diese Suite beide bestehen, stimmen überein. Zwei Parser, die sie nicht beide bestehen, stimmen überein, bis ein Autor etwas leicht Ungewöhnliches tut, und dann widersprechen sich die Vorschau und die exportierte Datei — das ist der Fehler, der einen Tag zum Finden braucht, weil das Dokument in dem Werkzeug, in dem Sie es gerade ansehen, gut aussieht.

markdown-it-py ist eine Portierung des JavaScript-markdown-it, die beiden teilen also nicht nur eine Spezifikation, sondern auch eine Implementierungslinie und ein Plugin-Vokabular. Näher an eine Garantie der Übereinstimmung kommt man nicht. Welchen Dialekt Sie anstreben, zählt mehr als die Wahl der Bibliothek; [CommonMark, GFM und die Dialekte](/blog/commonmark-gfm-and-the-flavours) legt die Unterschiede dar, und dieselben Bibliotheken haben Gegenstücke, die in [Markdown in JavaScript darstellen](/blog/markdown-to-html-in-javascript) behandelt werden.

**Wer sollte es verwenden?** Alles, auf dessen anderer Seite ein Browser steht, alles, wo ein Unterschied in der Darstellung ein Support-Ticket ist, und alle, die lieber eine Spezifikation lesen als ein Änderungsprotokoll. Es ist MIT-lizenziert (geprüft auf pypi.org, 9. September 2026).

## Das HTML bereinigen, und die einzige Reihenfolge, die funktioniert

Keine dieser vier ist ein Bereiniger. Markdown erlaubt rohes HTML von Entwurf an, ein `<script>`-Tag in der Quelle ist also ein `<script>`-Tag in der Ausgabe, sofern nicht etwas es maskiert oder entfernt. Python-Markdown sagt genau das in eigenen Worten: Die Bibliothek bereinigt ihre HTML-Ausgabe nicht, und kam die Eingabe aus einer nicht vertrauenswürdigen Quelle, ist das Bereinigen Ihre Aufgabe (geprüft auf python-markdown.github.io, 9. September 2026).

bleach war jahrelang die Standardantwort, und es lohnt sich, seinen Status nachzusehen, statt zu wiederholen, was man zuletzt gehört hat. Seine eigene PyPI-Seite erklärt inzwischen, dass bleach nicht mehr gepflegt wird und dass es keine künftigen Releases geben wird, auch nicht für Sicherheitsprobleme; das letzte Release war 6.4.0 am 5. Juni 2026, unter Apache 2.0 (geprüft auf pypi.org, 9. September 2026). Ein nicht gepflegter Bereiniger ist eine schlechtere Lage als kein Bereiniger, denn er sieht in einem Code-Review wie Schutz aus.

Die aktuelle Antwort ist nh3, eine MIT-lizenzierte Python-Bindung an ammonia, den in Rust geschriebenen HTML-Bereiniger (geprüft auf pypi.org, 9. September 2026). Es ist eine einzige Funktion über einem gut erprobten Parser, und es scheitert geschlossen: Alles, was nicht auf der Positivliste steht, wird entfernt.

```python
import nh3

safe = nh3.clean(
    html,
    tags={"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "table",
          "thead", "tbody", "tr", "th", "td", "em", "strong", "blockquote", "hr",
          "img", "sup", "sub", "del"},
    attributes={
        "a": {"href", "title"},
        "img": {"src", "alt", "title", "loading"},
        "code": {"class"},
        "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"},
    },
    url_schemes={"http", "https", "mailto"},
    id_prefix="doc-",
    link_rel="noopener noreferrer nofollow",
)
```

Jedes Argument dort tut etwas Bestimmtes, und die Namen der Schlüsselwörter sind die der Bibliothek selbst (geprüft auf nh3.readthedocs.io, 9. September 2026):

| Argument | Was es entscheidet |
| --- | --- |
| `tags` | Die Positivliste der Elemente. Lassen Sie es weg, und Sie bekommen ammonias Standardsatz |
| `attributes` | Welche Attribute überleben, pro Tag. `"*"` als Schlüssel gilt für jedes Tag. Der Standardsatz enthält `id` nicht |
| `url_schemes` | Womit `href` und `src` beginnen dürfen. Hier stirbt `javascript:` |
| `id_prefix` | Setzt jeder erlaubten `id` eine Zeichenkette voran, und das ist die Lösung gegen DOM Clobbering |
| `link_rel` | Der `rel`-Wert, der Links hinzugefügt wird; standardmäßig `noopener noreferrer` |
| `clean_content_tags` | Tags, deren *Inhalt* ebenfalls entfernt wird — die richtige Behandlung für `script` und `style` |
| `strip_comments` | Standardmäßig an, damit Tricks mit bedingten Kommentaren nicht überleben |
| `attribute_filter` | Ein Callback, der einen Wert umschreiben kann, statt das Attribut zu verwerfen |

`clean_content_tags` ist das, was die Leute übersehen. Ein `<script>`-Tag zu entfernen und seinen Text zu behalten lässt das JavaScript als sichtbare Prosa im Dokument stehen, was harmlos ist und wie ein Fehler aussieht. Das Tag samt Inhalt zu entfernen ist, was Sie gemeint haben.

Nun die Reihenfolge, denn das ist der Teil, der verkehrt herum gemacht wird. Bereinigen Sie nach dem Darstellen, niemals davor. Die Markdown-Quelle zu filtern ist Raten, denn der Parser ist es, der entscheidet, welche Zeichen zu einem Tag werden: Ein `<` in einem Code-Zaun ist Text, dasselbe `<` in einem Absatz beginnt ein Element, und ein prozentkodiertes Schema in einem Linkziel wird vom Parser dekodiert und nicht von Ihrem regulären Ausdruck. Jeder Filter, der auf der Quelle läuft, müsste den Parser nachbauen, um zu wissen, welches von beiden vorliegt, und könnte er das, wäre er der Parser. Erst darstellen, dann das HTML bereinigen — das ist die einzige Stufe, auf der die Zeichenkette, die Sie prüfen, die Zeichenkette ist, die der Browser bekommen wird. [Markdown sicher bereinigen](/blog/sanitising-markdown-safely) arbeitet die Fehlerfälle im Detail durch.

Es gibt eine legitime Ausnahme, und sie ist eigentlich keine: rohes HTML schon beim Parsen abzulehnen. `mistune.create_markdown(escape=True)` und `MarkdownIt("commonmark")` mit abgeschaltetem HTML bedeuten beide, dass der Parser gar nie erst ein rohes Tag ausgibt. Das ist eine stärkere Garantie als Bereinigen, und sie ist nur zu haben, weil sie im Parser passiert und nicht vor ihm. Verwenden Sie sie, wenn die Quelle nicht vertrauenswürdig ist und Sie kein HTML durchlassen müssen. Verwenden Sie nh3, wenn Sie etwas davon brauchen.

TransformPipe ist genauso gebaut: marked stellt dar, dann bereinigen DOMPurify im Browser und das `xss`-Paket auf dem Server das Ergebnis gegen eine gemeinsame Positivliste, damit beide Seiten dasselbe Dokument erzeugen. Seine Überschriften-IDs tragen ein `doc-`-Präfix, was sie aus dem Gebiet des DOM Clobbering heraushält — dieselbe Aufgabe, die `id_prefix` oben erledigt.

## Aus einem Fragment eine Seite machen

Alle vier Bibliotheken geben ein Fragment zurück, und ein Fragment ist kein Dokument. Drei Dinge müssen damit geschehen, bevor jemand anders die Datei öffnen kann: eine Hülle, Stile und eine Entscheidung darüber, was die Datei aus dem Netz anfordern darf.

Die Hülle ist ein Template, und Jinja2 ist das naheliegende, weil es in den meisten Python-Projekten schon steckt:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title }}</title>
    <style>{{ css }}</style>
  </head>
  <body>
    <main>{{ body|safe }}</main>
  </body>
</html>
```

```python
from jinja2 import Environment, FileSystemLoader, select_autoescape

env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
)
page = env.get_template("page.html").render(title=title, body=safe_html, css=css)
```

Zwei Fallen in sechs Zeilen. Die erste ist `|safe`. Mit eingeschaltetem Autoescaping — und es sollte eingeschaltet sein — stellt `{{ body }}` Ihr HTML als wörtlichen Text dar, und Sie bekommen eine Seite, die `<p>Hello</p>` als Wörter anzeigt. `|safe` ist das, was sagt: „Diese Zeichenkette ist bereits HTML." Die zweite Falle folgt unmittelbar: `|safe` ist ein Versprechen, das Sie geben, die einzige Zeichenkette, die Sie je als sicher markieren, ist also eine, die schon durch nh3 gelaufen ist. Bereinigen, dann als sicher markieren, in dieser Reihenfolge. Ein Template, das unbereinigte Parser-Ausgabe als sicher markiert, hat still und leise jedes Problem wieder eingeführt, das der vorige Abschnitt gelöst hat.

Die Stile sind der Teil, den die Leute überspringen und dann bereuen. Ein Stylesheet in einem `<link>`-Tag macht die HTML-Datei von einer zweiten Datei abhängig; verschieben Sie eine und nicht die andere, und die Seite ist ohne Stil. Ein Stylesheet von einem CDN macht die Datei von einem Netz abhängig und verrät dem, der sie öffnet, etwas darüber, wo die Datei gewesen ist. Das CSS von der Platte zu lesen und in `{{ css }}` zu übergeben, bettet es ein, was größer ist und sich überall gleich verhält:

```python
from pathlib import Path

css = Path("assets/page.css").read_text(encoding="utf-8")
if use_pygments:
    css += Path("assets/pygments.css").read_text(encoding="utf-8")
```

Diese zweite Zeile ist der Grund, warum `codehilite` nicht fertig ist, wenn es Klassen ausgibt — das Pygments-Stylesheet muss mit der Seite reisen, sonst ist die Hervorhebung unsichtbar.

Bilder sind die letzte Abhängigkeit. `<img src="diagram.png">` in einer eigenständigen Datei ist ein defektes Bild auf der Maschine von jemand anderem. Liefern Sie entweder den Ordner mit, oder lesen Sie die Bytes und betten sie als `data:`-URI ein, was eine wirklich eigenständige Datei braucht:

```python
import base64, mimetypes
from pathlib import Path


def inline(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"
```

Der Test dafür, ob Sie fertig sind, ist einfach und dauert eine Minute: Kopieren Sie die `.html`-Datei auf eine andere Maschine, schalten Sie das Netz ab und öffnen Sie sie. Alles, was falsch aussieht, ist eine Abhängigkeit, von der Sie nicht bemerkt hatten, dass Sie sie haben.

## Ein Skript, das ein Verzeichnis konvertiert

Setzen Sie die Teile zusammen, und ein ganzer Ordner sind etwa fünfzehn Zeilen.

```python
from pathlib import Path
import markdown, nh3

TEMPLATE = "<!doctype html><meta charset=utf-8><title>{title}</title>{body}"

md = markdown.Markdown(extensions=["tables", "fenced_code", "toc"])
src, out = Path("docs"), Path("build")

for path in sorted(src.rglob("*.md")):
    body = nh3.clean(md.convert(path.read_text(encoding="utf-8")))
    md.reset()
    target = out / path.relative_to(src).with_suffix(".html")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(TEMPLATE.format(title=path.stem, body=body), encoding="utf-8")
    print(f"{path} -> {target}")
```

Drei Details erledigen die Arbeit. `encoding="utf-8"` beim Lesen und beim Schreiben, denn die Vorgabe der Plattform ist nicht überall UTF-8, und ein Geviertstrich genügt, um den Lauf zu zerbrechen. `sorted()`, damit die Build-Reihenfolge auf jeder Maschine dieselbe ist. `md.reset()` innerhalb der Schleife, aus dem Grund weiter oben.

Eine Falle, in die das Skript oben hineinläuft: `nh3.clean` ohne Argumente verwendet ammonias Standard-Positivliste, und `id` steht nicht darauf, die Überschriften-Anker, die `toc` gerade hinzugefügt hat, werden also direkt wieder herausgestrichen. Erlauben Sie das Attribut pro Tag — `attributes={"h1": {"id"}, "h2": {"id"}}` — und setzen Sie `id_prefix="doc-"`, denn eine nackte `id` an einer Überschrift kann eine DOM-Eigenschaft desselben Namens überdecken.

Fünfzehn Zeilen sind die Demonstration. Was daraus wird, sobald es nach Zeitplan läuft, ist ein Skript, das Arbeit überspringt, die es schon getan hat, Dateien parallel konvertiert und einem CI-Job sagt, wenn etwas schiefgegangen ist. Das sind drei Ergänzungen, und jede lohnt es, verstanden statt kopiert zu werden.

```python
#!/usr/bin/env python3
"""Wandelt docs/**/*.md nach build/**/*.html um. Beendet sich mit einem Fehlercode, wenn eine Datei scheitert."""
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import markdown
import nh3
from jinja2 import Environment, FileSystemLoader, select_autoescape

SRC, OUT = Path("docs"), Path("build")
PAGE = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
).get_template("page.html")
EXTENSIONS = ["tables", "fenced_code", "footnotes", "attr_list", "toc", "sane_lists"]
TAGS = {"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "em",
        "strong", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td"}
ATTRS = {"a": {"href", "title"}, "code": {"class"},
         "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"}}


def convert(path: Path) -> tuple[Path, str | None]:
    target = OUT / path.relative_to(SRC).with_suffix(".html")

    if target.exists() and target.stat().st_mtime >= path.stat().st_mtime:
        return path, None

    try:
        md = markdown.Markdown(extensions=EXTENSIONS)
        body = nh3.clean(
            md.convert(path.read_text(encoding="utf-8")),
            tags=TAGS, attributes=ATTRS, id_prefix="doc-",
            url_schemes={"http", "https", "mailto"},
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(PAGE.render(title=path.stem, body=body, toc=md.toc),
                          encoding="utf-8")
    except Exception as error:                      # noqa: BLE001 - melden, nicht abbrechen
        return path, f"{type(error).__name__}: {error}"

    return path, None


def main() -> int:
    paths = sorted(SRC.rglob("*.md"))

    with ProcessPoolExecutor() as pool:
        results = list(pool.map(convert, paths))

    failures = [(path, error) for path, error in results if error]

    for path, error in failures:
        print(f"{path}: {error}", file=sys.stderr)

    print(f"{len(paths) - len(failures)} of {len(paths)} converted", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
```

**`pathlib` statt `os.path`.** `rglob("*.md")` läuft den Baum ab, `relative_to` gibt Ihnen den Teil des Pfades, der ins Ausgabeverzeichnis gespiegelt werden soll, `with_suffix(".html")` benennt ihn um, und `mkdir(parents=True, exist_ok=True)` erzeugt, was fehlt. Die ganze Pfadberechnung ist ein einziger Ausdruck, und es ist derselbe Ausdruck unter Windows und unter Linux — was zählt, denn ein Skript, das Pfade mit `"/"` zusammenfügt, erzeugt Ausgabe, die niemand als falsch bemerkt, bis sie auf einem Build-Agenten läuft.

**Überspringen nach mtime.** `target.stat().st_mtime >= path.stat().st_mtime` ist die billigste brauchbare Prüfung auf Veralten, die es gibt, und genau das, was `make` tut. Sie hat zwei bekannte Fehlermodi, und Sie sollten beide kennen. Eine Änderung am Template oder an der Erweiterungsliste ändert die mtime keiner Quelldatei, die Ausgaben werden also nicht neu gebaut — die Lösung ist, auch gegen die mtime des Templates zu vergleichen oder einen Hash der Konfiguration neben der Ausgabe zu halten. Und ein Checkout ist keine Kopie: Manche CI-Systeme geben jeder Datei die Zeit des Checkouts, was alles neu aussehen lässt und die Welt neu baut. Das ist langsam statt falsch, und das ist die richtige Richtung, in der ein Cache scheitern soll.

**Eine parallele Abbildung.** `pool.map` über einen `ProcessPoolExecutor` behält die Codeform der Schleife und nutzt jeden Kern. Prozesse statt Threads, denn Markdown zu parsen ist reines Python, und CPythons globale Interpreter-Sperre bedeutet, dass Threads die Arbeit nicht überlappen; der Preis ist, dass Argumente und Rückgabewerte gepickelt werden, weshalb `convert` ein kleines Tupel zurückgibt und nicht das HTML. Es baut außerdem pro Aufruf seine eigene `Markdown`-Instanz — die Instanz ist zustandsbehaftet, was derselbe Grund ist, aus dem `.reset()` existiert, und eine über Worker hinweg zu teilen ist die Art, wie eine Fußnote der einen Seite am Fuß einer anderen erscheint.

**Ein Exit-Code.** `return 1 if failures else 0` ist das, was daraus einen Build-Schritt macht statt eines Skripts, das jemand von Hand ausführt. `raise SystemExit(main())` gibt ihn weiter. Fehler gehen nach stderr und der Prozess konvertiert die anderen Dateien weiter, ein schlechtes Dokument gibt Ihnen also eine Fehlermeldung und einen vollständigen Bericht statt eines Stacktrace und keiner Ahnung, wie viele andere betroffen waren. In einem GitHub-Actions-Job lässt ein Exit-Code ungleich null den Schritt scheitern, und das Log enthält schon die Liste der Dateien, die gebrochen sind. [Viele Dateien auf einmal konvertieren](/blog/batch-convert-markdown-files) behandelt die Varianten — flache Ausgabe, ein zusammengeführtes Dokument, auf Änderungen warten.

## pypandoc, und wann der Aufruf von Pandoc die richtige Wahl ist

Keine der vier Bibliotheken oben liest etwas außer Markdown, und keine schreibt etwas außer HTML. Sobald die Aufgabenbeschreibung ein zweites Format enthält — ein Word-Dokument, das erst zu Markdown werden muss, ein PDF am Ende, ein LaTeX-Manuskript, ein EPUB —, lautet die ehrliche Antwort, mit dem Bau einer Parser-Pipeline aufzuhören und Pandoc aufzurufen.

pypandoc ist die dünne Hülle. Es ist MIT-lizenziert, es verlangt Pandoc selbst, und es kommt in zwei Ausführungen: `pypandoc`, das Pandoc auf dem System erwartet, und `pypandoc_binary`, das es mitbringt. Es gibt außerdem `download_pandoc()`, um es zur Laufzeit zu holen (geprüft auf pypi.org, 9. September 2026).

```python
import pypandoc

html = pypandoc.convert_text(
    text, to="html5", format="gfm",
    extra_args=["--standalone", "--embed-resources", "--toc"],
)

pypandoc.convert_file("docs/report.md", to="pdf", outputfile="report.pdf")
```

`convert_text` braucht das Eingabeformat ausdrücklich benannt; `convert_file` schließt es aus der Dateiendung. Beide nehmen `extra_args` für Pandocs eigene Flags und `filters` für seine Filterprogramme. Die drei Flags oben sind die, die aus einem Fragment eine Datei machen, die jemand anders öffnen kann: `--standalone` erzeugt Ausgabe mit Kopf und Fuß statt eines Fragments, `--embed-resources` bettet verlinkte Skripte, Stylesheets und Bilder als `data:`-URIs ein, und `--toc` erzeugt ein Inhaltsverzeichnis (geprüft auf pandoc.org, 9. September 2026).

Greifen Sie danach, wenn die Pipeline breiter ist als Markdown zu HTML. Greifen Sie nicht danach, wenn sie es nicht ist, und seien Sie klar darüber, was Sie sich damit einladen: eine externe Binärdatei in jeder Umgebung, in der der Code läuft, eine Version dieser Binärdatei, die festgenagelt werden muss, weil sich die Ausgabe zwischen Releases ändert, einen Unterprozess pro Dokument mit den Startkosten, die das bedeutet, und einen Konverter, der rohes HTML direkt durchlässt — Pandoc ist auch kein Bereiniger. Dagegen steht: Es kann Templates, es bettet Assets ein, es liest und schreibt Formate, die nichts anderes anfasst, und es wird Ihr Skript überleben. [Die Alternativen, und wann jede das bessere Werkzeug ist](/blog/pandoc-alternatives-for-markdown-to-html) ist der vollständigere Vergleich.

## Was Erweiterungen Sie kosten: nichts hiervon ist portabel

Das ist der Teil, den die Dokumentation der Bibliotheken nicht auf die Titelseite setzt. Jedes Merkmal jenseits von reinem CommonMark ist eine Erweiterung, Erweiterungen sind an die Bibliothek gebunden, und ein Dokument, das gegen die Erweiterungen einer Bibliothek geschrieben ist, ist ein Dokument, das an genau einer Stelle korrekt dargestellt wird.

Arbeiten Sie durch, was das konkret bedeutet:

| Die Syntax | Wo sie dargestellt wird | Wo nicht |
| --- | --- | --- |
| `{: .warning #note }` | Python-Markdown mit `attr_list`, MkDocs | GitHub, markdown-it-py, mistune, markdown2 — als wörtlicher Text gezeigt |
| `!!! note`-Blöcke | Python-Markdown mit `admonition`, MkDocs Material | Überall sonst — ein Absatz, der mit drei Ausrufezeichen beginnt |
| `[TOC]` | Python-Markdown mit `toc` | Überall sonst — ein Absatz, der das Wort TOC enthält |
| `~~~`-Zäune mit Attributen | `pymdownx.superfences` | Reines `fenced_code` behandelt den Zaun und verwirft die Attribute |
| `- [ ]`-Aufgabenlisten | GitHub, `pymdownx.tasklist`, mistunes `task_lists`, `gfm-like2` | Python-Markdown ohne Erweiterung — ein Listenelement, das mit Klammern beginnt |
| `[^1]`-Fußnoten | Python-Markdown, markdown2, mistune, mdit-py-plugins — alle vier, unterschiedlich | Reines CommonMark; und die erzeugten IDs unterscheiden sich zwischen allen vier |
| `$x^2$`-Mathematik | `pymdownx.arithmatex`, markdown2s `latex`, mistunes `math` | Alles andere — und jedes der drei gibt anderes Markup aus |

Der Fehlschlag ist in jeder Zeile still. Nichts wirft einen Fehler. Das Dokument enthält einfach einen Satz, der früher ein Callout war.

Ein Dokument, das in MkDocs dargestellt wird, ist also kein Dokument, das irgendwo dargestellt wird. Es ist ein Dokument, das in MkDocs dargestellt wird. Wenn Ihr Markdown in einem Repository liegt, das Leute auch auf GitHub lesen, oder in einen Chat-Client eingefügt wird, oder von jemandem in einem anderen Team nach Word exportiert wird, dann sind die Erweiterungen, die Sie einschalten, ein Preis, den jeder Leser zahlt, der nicht Ihren Build benutzt. Der Weg, diesen Preis sichtbar zu halten, ist, aufzuschreiben, welche Erweiterungen Ihre Dokumente verwenden dürfen, die Liste in einer einzigen Konstante im Code zu halten und ein repräsentatives Dokument — mit einer Tabelle, einer Fußnote, einer verschachtelten Liste und einem Code-Zaun — durch jeden Renderer zu testen, der es je sehen wird.

Fußnoten verdienen eine eigene Warnung, denn sie sind die Erweiterung, die am wahrscheinlichsten von zwei verschiedenen Bibliotheken in derselben Organisation eingeschaltet ist. Alle vier unterstützen sie, keine erzeugt dieselben IDs, und die Rückverweise unterscheiden sich. Führen Sie zwei dargestellte Dokumente auf einer Seite zusammen, und die Anker kollidieren. Konvertieren Sie ein Dokument mit zwei verschiedenen Werkzeugen, und die URLs in den Fußnoten-Links ändern sich, was alles bricht, was tief auf sie verlinkt hat.

Und es gibt auch einen Preis innerhalb Ihres eigenen Builds. Jede Erweiterung ist Code, der über jedes Dokument läuft. `codehilite` zieht Pygments und ein Stylesheet herein. `smarty` schreibt Zeichen um, ein Diff Ihrer Ausgabe nach dem Einschalten ist also voll von Änderungen, die Sie nicht beabsichtigt haben — auch innerhalb von allem, was nicht als Prosa gedacht war. `nl2br` ändert, was ein sanfter Zeilenumbruch bedeutet, und das ändert, wie ein Absatz in jedem Dokument umbricht, das vor dem Einschalten geschrieben wurde. Erweiterungen sind nicht kostenlos, und ohne ein erneutes Darstellen sind sie nicht rückgängig zu machen.

## Wie Sie wählen

1. **Beginnen Sie bei dem, was die Ausgabe sehen muss.** Stellt ein Browser dieselbe Quelle mit einer JavaScript-Bibliothek dar, wählen Sie markdown-it-py und passen das Preset an; alles andere heißt, dass die Vorschau und der Export sich irgendwann widersprechen, und Sie erfahren es von einem Leser statt von einem Test.
2. **Zählen Sie die Erweiterungen, die Sie wirklich brauchen, bevor Sie die Bibliothek wählen.** Ist die Liste Tabellen und eingezäunter Code, können das alle vier. Sind es Hinweisblöcke, Inhalte in Tabs und Mathematik, wählen Sie Python-Markdown plus pymdown-extensions, ob Sie es wollten oder nicht, und Sie nehmen in Kauf, dass die Quelle nur dort dargestellt wird.
3. **Entscheiden Sie, wer das Markdown geschrieben hat.** Für Ihr eigenes Repository ist Bereinigen Hygiene. Für alles, was von einem Nutzer, einer API oder einem Kunden kam, ist es die Anforderung, um die sich der Rest des Entwurfs herumlegen muss — und sie heißt nh3 nach dem Darstellen, oder ein Parser, der so konfiguriert ist, dass er rohes HTML vollständig ablehnt.
4. **Fragen Sie, ob Sie die Ausgabe ändern müssen oder sie nur erzeugen.** Muss das HTML bestimmte Attribute, Hüllen oder Klassennamen tragen, spart Ihnen mistunes Renderer einen Nachbearbeitungsschritt, der an dem Tag fehlgeht, an dem jemand in einem Codeblock über HTML schreibt.
5. **Prüfen Sie, dass das Ziel ein Dokument ist und kein Fragment.** Eine Bibliothek gibt ein Fragment zurück; geht die Datei an einen Menschen, muss etwas den Doctype, den Kopf und die eingebetteten Stile hinzufügen, und dieses Etwas ist Ihr Template. Testen Sie es mit abgeschaltetem Netz, bevor Sie es verschicken.
6. **Nageln Sie die Bibliothek und die Erweiterungsliste zusammen fest.** Ein Minor-Release, das eine Vorgabe ändert, oder ein Kollege, der eine Erweiterung hinzufügt, um eine Seite zu reparieren, ändert jede Seite. Beides gehört in denselben Commit wie die Requirements-Datei.
7. **Halten Sie inne und verwenden Sie Pandoc, wenn die Formatliste länger als eins ist.** Eine Markdown-zu-HTML-Bibliothek, die einen Word-Zweig und einen PDF-Zweig wachsen lässt, ist ein schlechteres Pandoc mit einer kleineren Testsuite.

## Fazit

Wählen Sie nach Anforderung: Python-Markdown für die Erweiterungen und das darauf gebaute Dokumentations-Ökosystem, markdown2, wenn ein Aufruf mit einer Liste von Extras die ganze Aufgabe ist, mistune, wenn das HTML eine bestimmte Form haben muss, markdown-it-py, wenn es der Spezifikation und einem Browser entsprechen muss. Setzen Sie dann nh3 hinter das Darstellen, legen Sie das Fragment in ein Template, das seine eigenen Stile einbettet, und geben Sie dem Skript einen Exit-Code, damit ein defektes Dokument einen Build scheitern lässt, statt ausgeliefert zu werden. Wenn Sie nur eine Seite brauchen, die ein Kollege öffnen kann, überspringen Sie den Build ganz — [konvertieren Sie die Datei im Browser](/) und laden Sie das eigenständige HTML herunter, oder lassen Sie das Skript es per POST an die API schicken und in einem Aufruf einen Nur-Lese-Link zurückbekommen.

## FAQ

### Welche Python-Bibliothek soll ich verwenden, um Markdown in HTML umzuwandeln?

Python-Markdown, wenn Sie in einer Dokumentations-Toolchain arbeiten, die es schon verwendet, markdown-it-py, wenn ein Browser dieselbe Quelle identisch darstellen muss, mistune, wenn Sie das ausgegebene HTML ändern müssen, und markdown2, wenn Sie einen Import und einen Aufruf wollen. Alle vier sind kostenlos und Open Source, und keine davon bereinigt.

### Warum zeigt meine Python-Markdown-Ausgabe Pipe-Zeichen statt einer Tabelle?

Weil `tables` eine Erweiterung ist und aus bleibt, solange Sie sie nicht benennen: `markdown.markdown(text, extensions=["tables"])`. Dasselbe gilt für eingezäunte Codeblöcke, Fußnoten und Überschriften-IDs. Das Bündel `extra` schaltet sieben Erweiterungen ein, darunter `tables`, aber nicht `toc` oder `codehilite`.

### Ist bleach noch der richtige Weg, HTML in Python zu bereinigen?

Nein. Bleachs eigene PyPI-Seite erklärt, dass es nicht mehr gepflegt wird und dass es keine künftigen Releases geben wird, auch nicht für Sicherheitsprobleme, mit einem letzten Release 6.4.0 am 5. Juni 2026 (geprüft auf pypi.org, 9. September 2026). nh3, eine Bindung an die Rust-Bibliothek ammonia, ist der aktuelle Ersatz und nimmt eine ausdrückliche Positivliste für Tags und Attribute.

### Soll ich das Markdown oder das HTML bereinigen?

Das HTML, immer, und nach dem Darstellen. Der Parser ist es, der entscheidet, welche Zeichen der Quelle zu Tags werden, ein Filter, der auf dem Markdown läuft, muss also raten, und er rät bei Code-Zäunen, Linkzielen und maskierten Zeichen falsch. Die Alternative ist, den Parser so zu konfigurieren, dass er rohes HTML von vornherein ablehnt, was noch stärker ist.

### Wie bekomme ich Syntaxhervorhebung in Python-Markdown?

Schalten Sie `codehilite` ein, installieren Sie Pygments und erzeugen Sie das Stylesheet — die Dokumentation der Erweiterung nennt den Befehl `pygmentize -S default -f html -a .codehilite > styles.css` (geprüft auf python-markdown.github.io, 9. September 2026). Ohne dieses Stylesheet sind die Klassen da und die Farben nicht. `noclasses=True` schreibt die Stile stattdessen ins Element, was es überlebt, irgendwohin ohne das CSS eingefügt zu werden.

### Was ist pymdown-extensions, und brauche ich es?

Es ist ein MIT-lizenziertes Paket von Erweiterungen für Python-Markdown unter dem Namensraum `pymdownx`, darunter SuperFences, Highlight, Tabbed, Tasklist, Details und Arithmatex (geprüft auf facelessuser.github.io, 9. September 2026). Sie brauchen es, wenn Sie Inhalte in Tabs, verschachtelte Zäune, Aufgabenlisten oder Mathematik wollen, von denen Python-Markdown nichts offiziell mitbringt. Für Tabellen, Fußnoten oder Code-Zäune brauchen Sie es nicht.

### Können Python und JavaScript dasselbe Markdown identisch darstellen?

Nahe dran, indem Sie markdown-it-py in Python und markdown-it in JavaScript verwenden — das erste ist eine Portierung des zweiten, beide folgen der CommonMark-Spezifikation, und die Namen der Plugins stimmen weitgehend überein. Halten Sie das Preset und die eingeschalteten Regeln in einer gemeinsamen Konfiguration, denn ein Unterschied in dieser Liste erzeugt einen Unterschied in der Ausgabe, den keine der beiden Seiten meldet.
