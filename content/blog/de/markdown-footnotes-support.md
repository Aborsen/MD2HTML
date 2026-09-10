---
title: "Markdown-Fußnoten: die Syntax, und wer sie tatsächlich darstellt"
description: "Fußnoten stehen in keiner Markdown-Spezifikation: die Syntax von GitHub und Pandoc, welche Parser sie darstellen und was zu tun ist, wenn einer es nicht tut"
date: 2026-08-19
tag: Syntax
keywords: markdown fußnoten, markdown fußnoten syntax, markdown fußnote funktioniert nicht, github markdown fußnoten, pandoc fußnoten, markdown-it-footnote, fußnoten in markdown erstellen
---

### Kurzfassung

Fußnoten stehen nicht in CommonMark und nicht in der Spezifikation von GitHub Flavored Markdown. Jedes Werkzeug, das `[^1]` darstellt, tut es also als Erweiterung, und jedes Werkzeug, das es nicht tut, stellt Ihre Klammern als wörtlichen Text dar. GitHub stellt sie auf seiner Seite dar, Pandoc stellt sie dar, Hugo stellt sie dar, und markdown-it, remark, Python-Markdown und Goldmark stellen sie dar, sobald Sie das Plugin oder die Erweiterung namentlich hinzufügen. marked tut es nicht, ohne eine Drittanbieter-Erweiterung, und ein strenger CommonMark-Parser wird es nie tun. Wenn eine Fußnote eine Kette von Werkzeugen durchlaufen muss, die Sie nicht kontrollieren, schreiben Sie die Nebenbemerkung entweder in den Satz oder bauen Sie Referenz und Anker von Hand, denn eine Fußnote, die in Ihrer veröffentlichten Seite leise zu `[^1]` wird, ist die häufigste Art, auf die diese Funktion scheitert.

Sie haben `[^1]` in einen Absatz geschrieben und `[^1]: die Anmerkung` an das Ende der Datei. Auf GitHub sieht es perfekt aus: eine kleine hochgestellte Zahl, eine Linie nahe dem Ende, die Anmerkung darunter, ein kleiner Pfeil, der Sie zurückbringt. Sie konvertieren dieselbe Datei mit etwas anderem, und die Seite enthält mitten in einem Satz die vier Zeichen `[^1]`.

Nichts ist kaputt. Der Konverter hat Ihre Datei korrekt geparst und genau das dargestellt, was die Spezifikation, die er umsetzt, darzustellen vorschreibt. Fußnoten stehen nicht in dieser Spezifikation. Sie stehen in keiner Spezifikation — nicht in CommonMark, nicht in der GFM-Spezifikation, nicht auf der Syntaxseite des ursprünglichen Markdown.pl. Sie existieren, weil PHP Markdown Extra Mitte der 2000er eine Syntax für sie erfunden hat, alle diese Syntax kopiert haben und GitHub sie schließlich auf seiner eigenen Seite ausgeliefert hat, ohne sie der Spezifikation hinzuzufügen, die es selbst veröffentlicht. Diese Geschichte ist der ganze Grund, warum es diesen Text geben muss.

Es gibt also zwei Fragen, die eine Antwort verdienen, und sie sind verschieden. Die erste ist, wie die Syntax lautet, denn fast jede Implementierung hat dieselbe kopiert, und die Unterschiede liegen in den Ecken. Die zweite ist, welche Werkzeuge sie verstehen, denn das entscheidet, ob Ihr Dokument die Reise übersteht. Dieser Text beantwortet beide und behandelt dann den Teil, den niemand aufschreibt: was zu tun ist, wenn die Antwort auf die zweite Frage „dieses hier nicht" lautet.

## Die Syntax, so wie GitHub und Pandoc sie akzeptieren

Eine Fußnote besteht aus zwei Textstücken an zwei Stellen. Die Referenz steht dort, wo die Zahl erscheinen soll. Die Definition steht, wo Sie möchten, und der Renderer verschiebt sie an das Ende.

```markdown
Die Schätzung ging von einem festen Wechselkurs aus.[^1]

[^1]: Was er für den größten Teil des betrachteten Zeitraums nicht war.
```

Die Referenz ist ein Zirkumflex innerhalb eckiger Klammern. Die Definition ist dasselbe Gebilde, gefolgt von einem Doppelpunkt, am Anfang einer Zeile. Das ist die Form, die GitHub dokumentiert, die Form, die Pandoc dokumentiert, die Form, die Python-Markdown dokumentiert, und die Form, die jedes Plugin weiter unten umsetzt. Lernen Sie sie einmal.

**Identifikatoren müssen keine Zahlen sein.** `[^longnote]`, `[^exchange-rate]` und `[^a]` sind alle gültig, und Wörter statt Ziffern zu verwenden ist meist die bessere Idee, denn die Zahl, die ein Leser sieht, wird aus der Reihenfolge der Referenzen erzeugt und nicht aus dem, was Sie getippt haben. Pandoc benennt die Einschränkung unumwunden: Identifikatoren dürfen keine Leerzeichen, Tabulatoren, Zeilenumbrüche und keines der Zeichen `^`, `[` oder `]` enthalten. Alles andere ist erlaubt.

**Die Zahl, die Sie sehen, ist nicht der Identifikator, den Sie geschrieben haben.** Das überrascht Leute, die ihre Anmerkungen `[^7]` und `[^2]` nennen und erwarten, dass die Ausgabe 7 und 2 sagt. Renderer nummerieren Fußnoten in der Reihenfolge, in der die Referenzen im Text auftreten, und nummerieren dann die Liste am Ende passend um. Nennen Sie sie `[^price]` und `[^source]`, und die Verwirrung verschwindet, weil Sie aufhören, das Überleben Ihrer Namen zu erwarten.

**Definitionen dürfen überall in der Datei stehen.** GitHubs eigene Dokumentation sagt ausdrücklich, dass der Inhalt einer Fußnote am Ende des dargestellten Dokuments erscheint, unabhängig davon, wo in der Quelle die Definition sitzt. Die meisten Implementierungen verhalten sich genauso. Jede Definition direkt hinter den Absatz zu setzen, der sie referenziert, hält die Quelle lesbar; alle am Ende zu sammeln hält die Prosa sauber. Beides wird identisch dargestellt.

**Eine Fußnote kann mehr als einen Absatz tragen, wenn Sie sie einrücken.** Hier gehen die Syntaxen leicht auseinander, und hier entstehen die meisten fehlerhaften Fußnoten. Pandocs Regel lautet, dass die folgenden Blöcke eingerückt werden, um zu zeigen, dass sie zur Anmerkung gehören, und dass Sie den ganzen Absatz oder nur dessen erste Zeile einrücken dürfen. Python-Markdown verlangt vier Leerzeichen oder einen Tabulator auf den Fortsetzungszeilen. Eine Einrückung um vier Leerzeichen genügt beiden.

```markdown
[^longnote]: Hier ist der erste Absatz der Anmerkung.

    Und hier ist ein zweiter, um vier Leerzeichen eingerückt, damit er
    an der Fußnote hängen bleibt statt sie zu beenden.

        Ein Codeblock, um acht eingerückt, noch innerhalb der Anmerkung.

    - Ein Listenpunkt, ebenfalls innerhalb der Anmerkung.
```

Es lohnt sich, dieses Beispiel in das zu tippen, was Ihre Dokumente darstellt, denn die Art des Scheiterns ist lehrreich: ein Fortsetzungsabsatz, der seine Einrückung verloren hat, erzeugt keinen Fehler. Er erzeugt eine Fußnote mit einem Absatz darin und einen verirrten Absatz Prosa, der direkt unter der Definitionszeile sitzt und den der Renderer dann in den Textkörper des Dokuments setzt, an genau der Stelle, an der die Definition zufällig stand. Sie bekommen einen Satz über Wechselkurse mitten in Abschnitt vier.

**Zeilenumbrüche innerhalb einer Fußnote folgen den üblichen Regeln.** GitHubs Dokumentation hält fest, dass zwei Leerzeichen am Zeilenende die Zeile innerhalb einer Fußnote brechen, genau wie überall sonst. Die Regeln innerhalb einer Anmerkung sind dieselben wie die Regeln außerhalb.

**Eine Definition, die niemand referenziert, ist ebenfalls kein Fehler.** Löschen Sie den Satz, der `[^3]` enthält, und lassen Sie `[^3]: …` am Ende stehen, dann gehen die Implementierungen auseinander: einige lassen die verwaiste Definition fallen, einige stellen sie als Fußnote dar, auf die keine Referenz zeigt, und einige drucken die Definitionszeile als wörtlichen Text, weil sie nicht länger Teil einer Fußnotengruppe ist. Keine davon sagt es Ihnen. Das ist die häufigste Ursache für eine Anmerkung, die „verschwunden" ist — die Referenz wurde mit dem Satz um sie herum wegbearbeitet.

## Kurzer Vergleich: wer eine Fußnote darstellt und wer sie ausdruckt

| Werkzeug oder Spezifikation | Fußnoten | Wie Sie sie bekommen | Inline `^[…]` | Lizenz |
| --- | --- | --- | --- | --- |
| CommonMark-Spezifikation | Nein | Nicht verfügbar; die Klammern erscheinen als Text | Nein | Kostenlos, Spezifikation |
| GFM-Spezifikation | Nein | Nicht in der Spezifikation, trotz der Seite | Nein | Kostenlos, Spezifikation |
| GitHubs eigener Renderer | Ja | Standardmäßig an, außer in Wikis | Nein | Gehostet |
| commonmark.js | Nein | Referenzimplementierung; nur die Kernsyntax | Nein | Kostenlos, BSD |
| markdown-it | Plugin | `markdown-it-footnote` | Ja | Kostenlos, MIT |
| marked | Nein | Eine Drittanbieter-Erweiterung, oder nichts | Nein | Kostenlos, MIT |
| remark / unified | Plugin | `remark-gfm`, neben Tabellen und Aufgabenlisten | Nein | Kostenlos, MIT |
| Python-Markdown | Erweiterung | Die offizielle Erweiterung `footnotes` | Nein | Kostenlos, BSD |
| Goldmark | Erweiterung | `extension.Footnote` | Nein | Kostenlos, MIT |
| Hugo | Ja | Goldmarks Fußnoten-Erweiterung, standardmäßig an | Nein | Kostenlos, Apache 2.0 |
| Pandoc | Ja | Die Erweiterung `footnotes`, im eigenen Dialekt an | Ja, `inline_notes` | Kostenlos, GPL |

Zwei Zeilen dieser Tabelle verdienen Nachdruck, denn sie sind die, über die Leute stolpern. Die GFM-Spezifikation enthält keine Fußnoten; das Wort kommt darin einmal vor, historisch, als Beschreibung dessen, was andere Implementierungen der ursprünglichen Syntax hinzugefügt haben. Und GitHubs Seite stellt sie trotzdem dar. Ein Parser, der volle GFM-Konformität bewirbt und `[^1]` ignoriert, ist nicht kaputt und lügt nicht — [die Lücke zwischen der Spezifikation und der Seite](/blog/commonmark-gfm-and-the-flavours) ist genau diese Art von Funktion.

## Das HTML, zu dem eine Fußnote wird

Jede Implementierung erzeugt dieselben drei strukturellen Dinge, mit unterschiedlichen Namen darauf. Die Gestalt zu kennen sagt Ihnen, was Sie gestalten müssen, gegen was Sie bereinigen müssen und was schiefgegangen ist, wenn ein Fußnotenlink an der falschen Stelle landet.

Die Referenz wird zu einem hochgestellten Element, das einen Link enthält, und der Link trägt eine eigene ID, damit etwas auf ihn zurückzeigen kann. markdown-it-footnote gibt dies aus:

```html
<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>
```

Die Definitionen werden zu einem Behälter am Ende des Dokuments, der eine geordnete Liste enthält, ein Element pro Anmerkung, und jedes Element trägt die ID, auf die die Referenz zeigt:

```html
<hr class="footnotes-sep">
<section class="footnotes">
  <ol class="footnotes-list">
    <li id="fn1" class="footnote-item">
      <p>Was er für den größten Teil des betrachteten Zeitraums nicht war.
        <a href="#fnref1" class="footnote-backref">&#8617;</a></p>
    </li>
  </ol>
</section>
```

Und das dritte Ding ist dieser letzte Anker: der Rückverweis. Er ist der Teil, den die meisten selbstgebauten Fußnotenlösungen vergessen, und der Teil, der Fußnoten benutzbar statt dekorativ macht. Ohne ihn hat ein Leser, der in einem langen Dokument auf Anmerkung 4 klickt, keinen Weg zurück zu dem Satz, den er gerade gelesen hat, außer der Zurück-Schaltfläche des Browsers — die funktioniert, bis die Seite durch Scrollen statt über einen Link erreicht wurde, und dann führt „zurück" aus dem Dokument heraus.

Implementierungen legen den Rückverweis als konfigurierbare Zeichenkette offen, was ein guter Hinweis darauf ist, wie wichtig er ihnen ist. Hugos Goldmark-Konfiguration hat eine Einstellung `backlinkHTML` für das Markup, das am Ende einer Fußnote gezeigt wird, mit einer Rückkehrpfeil-Zeichenreferenz als Voreinstellung. Python-Markdown hat `BACKLINK_TEXT`, voreingestellt auf `&#8617;`, und `BACKLINK_TITLE`, voreingestellt auf `Jump back to footnote {} in the text` — ein `title`-Attribut existiert genau deshalb, weil ein Pfeil für sich einem Screenreader nichts sagt. markdown-it-footnote verwendet dafür keine Optionen; Sie überschreiben seine Renderer-Regeln, was dieselbe Fähigkeit mit mehr Tipparbeit ist.

Das Paar aus zwei IDs ist der Mechanismus, und es ist auch der zerbrechliche Teil. `#fnref1` und `#fn1` gelten für die ganze Seite. Zwei dargestellte Dokumente auf einer Seite, oder ein Dokument zweimal dargestellt, und die zweite Menge von Referenzen zeigt auf die erste Menge von Anmerkungen. Jede ernstzunehmende Implementierung hat einen Schalter dafür, weiter unten besprochen, und jede Implementierung liefert ihn ausgeschaltet aus.

## Implementierung für Implementierung

### markdown-it — ein Plugin, und die Klassen kommen mit

markdown-it stellt Fußnoten nicht von sich aus dar. Das offizielle Plugin, `markdown-it-footnote`, ist MIT-lizenziert und installiert sich aus npm als eine einzige Abhängigkeit:

```bash
npm install markdown-it-footnote
```

```javascript
const md = require('markdown-it')().use(require('markdown-it-footnote'));
md.render(source);
```

**Was Sie bekommen:** das oben gezeigte HTML, mit den Klassennamen `footnote-ref`, `footnotes-sep`, `footnotes`, `footnotes-list`, `footnote-item` und `footnote-backref`, gegen die Sie alle CSS schreiben müssen, weil keiner davon von irgendetwas gestaltet wird. Es akzeptiert außerdem Inline-Fußnoten, die weiter unten ihren eigenen Abschnitt haben und die wenige Implementierungen beherrschen.

**Für wen es ist:** für alle, die schon auf markdown-it sitzen, was sehr viele Anwendungen und Aufbauten für statische Seiten einschließt. Wenn Sie einen JavaScript-Parser wählen und Fußnoten eine Anforderung sind, ist dies der kürzeste Weg — [der breitere Vergleich der JavaScript-Parser](/blog/markdown-to-html-in-javascript) behandelt den Rest der Entscheidung, aber bei dieser einen Funktion gewinnt markdown-it schon damit, dass es überhaupt ein offizielles Plugin gibt.

### remark und unified — Fußnoten kommen mit remark-gfm

remark behandelt Fußnoten als Teil von GitHub Flavored Markdown, was eine vertretbare Lesart dessen ist, was GitHub tatsächlich darstellt, auch wenn es nicht das ist, was die GFM-Spezifikation sagt. `remark-gfm` fügt fünf Dinge gemeinsam hinzu: Autolinks für nackte URLs, Fußnoten, Durchgestrichenes, Tabellen und Aufgabenlisten. Es ist MIT-lizenziert.

**Was Sie bekommen:** Fußnotenknoten im mdast-Baum, was heißt, dass Sie Dinge mit ihnen tun können, bevor sie HTML werden — sie zählen, sie verschieben, prüfen, ob jede Referenz auflöst, sie in ein eigenes Dokument extrahieren. Das ist der Sinn von remark, und Fußnoten sind eines der wenigen Gebilde, bei denen der Baum das Gewicht der Verarbeitungskette wert ist.

**Für wen es ist:** für Projekte, die schon unified betreiben, und für alle, die Fußnoten prüfen müssen statt sie bloß darzustellen. Eine Kette, die den Build scheitern lässt, wenn eine Referenz keine Definition hat, ist mit remark etwa fünfzehn Zeilen Code und mit allem anderen auf dieser Liste unmöglich.

### marked — GFM, minus Fußnoten

marked setzt CommonMark und GFM um und hört dort auf. Seine dokumentierten Optionen sind `async`, `breaks`, `gfm`, `pedantic`, `renderer`, `silent`, `tokenizer` und `walkTokens`; es gibt keine Fußnoten-Option, weil Fußnoten in keiner der beiden Spezifikationen stehen, auf die es zielt. Alles jenseits dieser Oberfläche läuft über den Erweiterungsmechanismus, und ein Drittanbieter-Paket `marked-footnote` existiert genau dafür.

**Was ohne sie passiert:** die Referenz erscheint als wörtlicher Text `[^1]` innerhalb Ihres Absatzes, und die Definitionszeile erscheint als Absatz wörtlichen Textes, der `[^1]: Was er für den größten Teil…` sagt. Keine Warnung, kein Fehler, keine Meldung über eine fehlende Funktion. Zwei Zeilen Text, wo Sie eine Anmerkung erwartet haben.

**Für wen es ist:** für Anwendungen, die Geschwindigkeit brauchen und keine Fußnoten — Kommentarfelder, Chatnachrichten, Vorschaubereiche. Es ist ein guter Parser mit engem, ehrlichem Zuschnitt. Der Zuschnitt ist hier das Problem: Konverter, die auf marked aufbauen, erben die Lücke, und es gibt viele davon, einschließlich desjenigen, der auf dieser Seite die Konvertierung von Markdown zu HTML erledigt. Gut zu wissen, bevor Sie ein Dokument mit Fußnoten in einen browserbasierten Konverter einfügen und dem Ergebnis vertrauen.

### Python-Markdown — eine offizielle Erweiterung mit Optionen

Python-Markdown liefert Fußnoten als eine seiner Standarderweiterungen aus, BSD-lizenziert, namentlich eingeschaltet:

```python
import markdown
html = markdown.markdown(source, extensions=['footnotes'])
```

**Was Sie bekommen:** hochgestellte Referenzen, einen Fußnotenblock, Rückverweise und mehr Konfiguration, als sonst jemand anbietet. `PLACE_MARKER` (voreingestellt auf `///Footnotes Go Here///`) lässt Sie entscheiden, wo im Dokument die Anmerkungen landen, statt das Ende hinzunehmen. `BACKLINK_TEXT` und `BACKLINK_TITLE` steuern den Rückkehrlink. `SEPARATOR`, voreingestellt auf `:`, setzt die Zeichenkette zwischen dem Präfix und dem Namen in den IDs, die es erzeugt, weshalb seine Fußnoten-IDs nicht wie die von irgendjemand anderem aussehen. `UNIQUE_IDS`, voreingestellt auf `False`, vermeidet Kollisionen über mehrere Aufrufe von `reset()` hinweg — die Abhilfe dafür, mehrere Dokumente in eine Seite zu stellen. `USE_DEFINITION_ORDER` entscheidet, ob die Liste am Ende der Reihenfolge der Definitionen oder der Reihenfolge der Referenzen folgt.

**Für wen es ist:** für Python-Build-Skripte und für MkDocs-Seiten, wo dies schon die Maschine ist. Die Erweiterung ist laut ihrer eigenen Dokumentation im Wartungsmodus, was für eine so stabile Funktion eine Beschreibung und keine Warnung ist. Wenn Ihre Konvertierung in Python passiert, behandeln [die Python-Optionen in ganzer Breite](/blog/markdown-to-html-in-python), mit welchem Parser Sie anfangen sollten.

### Goldmark und Hugo — standardmäßig aus im einen, an im anderen

Goldmark ist der CommonMark-Parser, den die meisten Go-Programme verwenden, MIT-lizenziert, und es liefert eine Fußnoten-Erweiterung mit, die in seiner eigenen Dokumentation als die Syntax von PHP Markdown Extra beschrieben wird. Sie schalten sie ausdrücklich ein, als `extension.Footnote`, wenn Sie den Parser konstruieren.

Hugo, das Goldmark verwendet, schaltet sie für Sie ein. Seine Markup-Konfiguration hat einen Fußnotenabschnitt mit `enable`, das standardmäßig auf `true` steht, einer Zeichenkette `backlinkHTML` und `enableAutoIDPrefix`, das auf `false` steht. Diese letzte Option ist die Abhilfe gegen ID-Kollisionen, und ihre Voreinstellung ist der Grund, warum zwei Hugo-Seiten, die auf einer Listenseite zusammen dargestellt werden, Fußnotenlinks haben können, die auf die Anmerkungen der jeweils anderen zeigen.

**Für wen es ist:** für Go-Programme und für jede Hugo-Seite, deren Autoren meist nicht bemerken, dass Fußnoten eine Erweiterung sind, weil sie sie noch nie scheitern gesehen haben.

### CommonMark und commonmark.js — die Klammern, genau wie getippt

CommonMark hört bei einem Kern auf, den alle schon gemeinsam hatten, und Fußnoten waren nie darin. commonmark.js, die von den Autoren der Spezifikation geschriebene Referenzimplementierung, hat keine Fußnotenunterstützung und absichtlich keinen Erweiterungspunkt, um eine hinzuzufügen. Es ist BSD-lizenziert.

**Was passiert:** `[^1]` ist ein Absatz, der ein Zirkumflex in Klammern enthält. Die Spezifikation sagt es so, die Referenzimplementierung tut es, und jeder Streit darüber, ob das korrektes Verhalten ist, wird durch das Lesen der Spezifikation entschieden.

**Für wen es ist:** dafür, genau diesen Streit zu entscheiden. Wenn ein Unterschied in der Darstellung Sie fragen lässt, ob ein Werkzeug fehlerhaft oder bloß streng ist, dann ist dies der Parser, der es Ihnen sagt.

### Pandoc — die breiteste Unterstützung, und das einzige Platzierungs-Flag

Pandocs eigener Markdown-Dialekt hat die Erweiterung `footnotes` an, und es ist die vollständigste verfügbare Umsetzung der Syntax. Anmerkungen aus mehreren Blöcken, Identifikatoren aus Wörtern, Inline-Anmerkungen und die Einschränkung bei den Zeichen eines Identifikators sind alle dokumentiert statt entdeckt.

**Was Sie über die Syntax hinaus bekommen:** zwei Flags, die sonst nichts auf dieser Liste hat. `--reference-location` entscheidet, ob Fußnoten am Ende des aktuellen Blocks der obersten Ebene, am Ende des aktuellen Abschnitts oder am Ende des Dokuments stehen — die Option wirkt auf die Ausgabeformate html, epub, markdown, muse und mehrere Folien-Writer. Und `--id-prefix` setzt jedem Identifikator und jedem internen Link in der HTML-Ausgabe ein Präfix voran, was die dokumentierte Antwort auf doppelte IDs ist, wenn Sie Fragmente zur Einbettung in andere Seiten erzeugen. Wenn Sie eine Seite aus vielen konvertierten Dokumenten zusammensetzen, ist dieses Flag der Unterschied zwischen funktionierenden Links und Links, die alle auf die Anmerkungen des ersten Dokuments zeigen.

**Für wen es ist:** für Dokumente statt für Seiten — alles mit Anmerkungen, Literaturangaben oder einem Ausgabeformat außer HTML. Es ist außerdem das Werkzeug, nach dem man greift, wenn eine Markdown-Datei mit Fußnoten eine Word-Datei oder ein PDF werden muss, denn Fußnoten sind in beiden Formaten ein eigenes Gebilde, und Pandoc weiß, wie es sie abbildet. Pandoc ist kostenlos und GPL-lizenziert, und die Installation ist das einzige echte Gegenargument für kleine Aufgaben.

### GitHub — der Grund, warum Leute überhaupt Fußnoten schreiben

GitHub stellt Fußnotensyntax in Markdown-Dateien, Issues, Pull Requests und Discussions dar, nummeriert die Referenzen der Reihe nach und sammelt die Anmerkungen am Ende des dargestellten Dokuments. Seine Dokumentation nennt eine Ausnahme unumwunden: in Wikis werden Fußnoten nicht unterstützt. Schreiben Sie eine Fußnote in eine Wiki-Seite, und Sie bekommen die Klammern.

**Warum diese Zeile mehr zählt als die anderen:** auf GitHub sehen die meisten Leute zum ersten Mal eine Fußnote dargestellt, und sein Verhalten ist das, was sie für Markdown halten. Nichts an der Seite sagt Ihnen, dass dies die Erweiterung eines einzelnen Renderers ist statt Teil der Sprache. Das Ergebnis ist ein steter Nachschub an Dateien, die an der einen Stelle funktionieren, an der sie geschrieben wurden, und nirgends sonst.

## Inline-Fußnoten: Pandocs `^[…]`

Pandoc fügt eine zweite Syntax hinzu, die das Problem der zwei Stellen ganz vermeidet. Sie ist eine eigene Erweiterung, `inline_notes`, und die Anmerkung steht dort, wo die Referenz gestanden hätte:

```markdown
Hier ist eine Inline-Anmerkung.^[Inline-Anmerkungen sind leichter zu schreiben,
weil Sie keinen Identifikator wählen und nicht nach unten wandern müssen.]
```

Das Handbuch sagt, dass Inline- und gewöhnliche Fußnoten in einem Dokument frei gemischt werden dürfen und dass eine Inline-Anmerkung nicht mehrere Absätze enthalten kann — das ist der Handel. Sie geben lange Anmerkungen auf und gewinnen, keinen Identifikator erfinden und nicht an das Ende der Datei scrollen zu müssen. Für eine Anmerkung von einem Satz Länge ist das ein gutes Geschäft.

Weil es eine benannte Erweiterung ist, können Sie sie ausdrücklich ein- und ausschalten: `--from markdown+inline_notes` oder `--from markdown-inline_notes`. Das zählt, wenn Sie Dateien von anderswo verarbeiten und einen vorhersagbaren Dialekt wollen statt dessen, was Pandocs Voreinstellungen zufällig hergeben.

`markdown-it-footnote` setzt dieselbe Syntax um, was es zum einen JavaScript-Weg macht, der beide Formen akzeptiert. Nichts anderes auf dieser Liste tut das. GitHub tut es nicht: `^[eine Anmerkung]` ist auf GitHub ein Zirkumflex, gefolgt von etwas, das wie ein kaputter Link aussieht, was ein besonders unhilfreiches Scheitern ist, weil es für jemanden, der die Quelle liest, nicht einmal wie Fußnotensyntax aussieht.

Die praktische Regel lautet, dass Inline-Anmerkungen für Dokumente sind, deren ganze Kette Sie kontrollieren. Sobald die Datei von GitHub oder von einem Parser gelesen werden könnte, den Sie nicht geprüft haben, ist die Form mit den Klammern die sicherere der beiden, und die Unbequemlichkeit der zwei Stellen ist der Preis der Portabilität.

## Wo Fußnoten scheitern, und was das kostet

Die naheliegende Antwort — schreiben Sie Fußnoten, die funktionieren schon — scheitert auf fünf bestimmte Weisen, und alle fünf sind leise.

**Das leise Wörtliche.** Ein Parser ohne die Erweiterung stellt Ihre Referenz und Ihre Definition als Text dar. Es gibt keine Warnung in der Konsole und keinen sichtbaren Hinweis außer den Klammern selbst, die Leser als Tippfehler überlesen. Der Preis ist ein veröffentlichtes Dokument mit `[^1]` darin, entdeckt von jemand anderem, meist nachdem es an Leute geschickt wurde. Das ist das Scheitern, für das man planen muss, denn es ist das einzige, das Sie in einer Vorschau nicht sehen können, die denselben Parser verwendet wie der Export.

**ID-Kollisionen.** Fußnoten-IDs sind `fn1`, `fnref1` und ihre Verwandten, pro Dokument erzeugt und darin eindeutig. Stellen Sie zwei dargestellte Dokumente auf eine Seite — eine Blog-Übersicht mit vollen Beiträgen, eine Dokumentationsseite, die mehrere Fragmente zusammensetzt, eine Druckansicht eines ganzen Abschnitts — und das `#fn1` des zweiten Dokuments löst auf die Anmerkung des ersten auf. Die Links funktionieren. Sie gehen an die falsche Stelle. Hugo liefert `enableAutoIDPrefix` ausgeschaltet aus, Python-Markdown liefert `UNIQUE_IDS` ausgeschaltet aus, und Pandocs `--id-prefix` ist etwas, das Sie übergeben müssen, die Voreinstellung ist also in jedem Fall die kaputte. Der Preis ist eine Seite, auf der jeder Fußnotenlink nach dem ersten Dokument falsch ist, und nichts in irgendeinem Build-Protokoll erwähnt es.

**Der Bereiniger frisst den Block.** Fußnoten-Ausgabe verwendet Tags, die eine Markdown-förmige Positivliste oft nicht enthält. `<section>` ist der übliche Verlust: eine Positivliste, gebaut um genau das zu erlauben, was ein GFM-Renderer erzeugt, hat Überschriften, Absätze, Listen, Tabellen, `<sup>` und `<a>` auf der Liste und kein `<section>`, weil reines GFM nie eines ausgibt. Lassen Sie Fußnoten-HTML dadurch laufen, und die Referenzen überleben als hochgestellte Links, während der ganze Block der Anmerkungen verschwindet und ein Dokument voller Zahlen zurücklässt, die auf nichts zeigen. Der Preis ist schlimmer als der Verlust der Anmerkungen, denn die Seite sieht weiterhin fertig aus. Wenn Sie konvertierte Ausgabe bereinigen — und für alles, was Sie nicht selbst geschrieben haben, [sollten Sie das](/blog/sanitising-markdown-safely) — dann setzen Sie den Fußnotenbehälter auf die Positivliste, sobald Sie die Erweiterung dem Parser hinzufügen, und testen Sie mit einer Datei, die Fußnoten hat.

**Hin- und Rückwege verlieren sie.** Eine Markdown-Datei mit Fußnoten, zu HTML und zurück konvertiert, oder zu Word und zurück, kann mit den Anmerkungen als gewöhnliche Absätze am Ende und den Referenzen als einfachen hochgestellten Zahlen wieder herauskommen. Pandoc bildet Anmerkungen auf die eigenen Gebilde der Formate ab, die sie haben, weshalb es das richtige Werkzeug für diese Reise ist. Ein allgemeiner HTML-zu-Markdown-Konverter hat keine Möglichkeit zu erkennen, dass ein `<section class="footnotes">` jemals Fußnotensyntax war, also erzeugt er treu eine Liste von Absätzen. Der Preis ist eine Datei, die akzeptabel dargestellt wird und nie wieder als Fußnoten bearbeitet werden kann.

**Überraschungen in der Reihenfolge.** Die Zahl, die ein Leser sieht, kommt aus der Reihenfolge der Referenzen, und die Liste am Ende ist je nach Implementierung entweder nach Referenzreihenfolge oder nach Definitionsreihenfolge geordnet — Python-Markdown macht daraus eine Option, `USE_DEFINITION_ORDER`, was Ihnen sagt, dass es beide Verhaltensweisen in der Praxis gibt. Verschieben Sie einen Absatz, und die Zahlen werden umnummeriert, was korrekt ist und auch heißt, dass eine in der Prosa als „siehe Anmerkung 4" angesprochene Anmerkung eine Wartungslast ist. Der Preis ist klein und beständig: verweisen Sie im Text niemals über ihre Zahl auf eine Fußnote.

Es gibt noch einen Preis, und er ist der Grund, darüber nachzudenken, bevor man hundert Fußnoten schreibt statt danach. Ein Dokument mit Fußnoten ist kein portables Markdown mehr. Es hängt an der Erweiterungsliste eines bestimmten Werkzeugs, und jeder Schritt, den Sie seiner Kette hinzufügen, ist ein Schritt, der diese Erweiterung möglicherweise nicht hat. Tabellen haben dieselbe Eigenschaft und bekommen mehr Aufmerksamkeit, weil [eine kaputte Tabelle laut ist](/blog/markdown-tables-that-survive-conversion) — eine Reihe von Pipes ist offensichtlich falsch. Eine kaputte Fußnote ist leise, und das macht sie gefährlicher.

## Eine Fußnote durch einen Konverter bringen, der sie nicht kennt

Manchmal ist die Kette festgelegt, und der Parser darin macht keine Fußnoten. Es gibt vier Auswege, geordnet danach, wie viel sie Sie kosten.

**Schreiben Sie die Nebenbemerkung in den Satz.** Die ehrliche Möglichkeit, und die, die man zuerst versuchen sollte. Die meisten Fußnoten in den meisten Dokumenten sind eine Klammerbemerkung, die zu ehrgeizig geworden ist. Wenn die Anmerkung einen Teilsatz lang ist, setzen Sie sie in den Satz, in Klammern, und löschen Sie den Mechanismus. Sie wird in jedem je geschriebenen Parser dargestellt, sie übersteht jede Konvertierung, und der Leser muss den Absatz nicht verlassen. Der Preis ist ein etwas längerer Satz, was meist kein Preis ist.

**Bauen Sie Referenz und Anker von Hand.** Fußnoten sind zwei Links und eine geordnete Liste. Sie können sie schreiben, und das Ergebnis funktioniert in einem einfachen CommonMark-Parser, weil es nichts als Links und rohes HTML verwendet:

```markdown
Die Schätzung ging von einem festen Wechselkurs aus.<sup id="ref-1"><a href="#note-1">1</a></sup>

## Anmerkungen

1. <a id="note-1"></a>Was er für den größten Teil des betrachteten Zeitraums nicht war.
   <a href="#ref-1">Zurück</a>
```

Das ist echtes Fußnotenverhalten: eine hochgestellte Zahl, ein Sprung zur Anmerkung, ein Sprung zurück. Es kostet Sie die Nummerierung von Hand, was heißt, von Hand umzunummerieren, wenn Sie eine Anmerkung in der Mitte einfügen, und es hängt daran, dass rohes HTML überlebt. Zwei Vorbehalte, die man kennen sollte, bevor man sich darauf festlegt. Erstens wird ein Parser, der so eingestellt ist, rohes HTML zu maskieren — markdown-its Voreinstellung ist `html: false` —, Ihre `<sup>`-Tags als Text ausdrucken, was ein anderes Scheitern an derselben Stelle ist. Zweitens muss ein Bereiniger sowohl die Tags als auch die Attribute `id` und `href` erlauben, sonst gehen die Anker und die Links hängen in der Luft. Testen Sie es in der wirklichen Kette, mit dem wirklichen Bereiniger, an einer Anmerkung, bevor Sie vierzig schreiben.

**Verwenden Sie einmal das Werkzeug, das die Erweiterung hat.** Wenn die Kette festgelegt ist, Sie aber einen Schritt darin kontrollieren, konvertieren Sie mit einem Parser, der Fußnoten versteht, und geben Sie dem nächsten Schritt das HTML statt des Markdowns. Pandoc, das `markdown` liest und HTML schreibt, oder ein kleines Node-Skript mit markdown-it und seinem Fußnoten-Plugin, ist eine Fünf-Minuten-Aufgabe, die das Problem dauerhaft beseitigt. Der Preis ist, dass das HTML zu dem Erzeugnis wird, das Sie pflegen, das funktioniert also nur, wenn das Markdown eine Quelle ist, die Sie konvertieren, und kein Dokument, das Leute weiter bearbeiten.

**Sondieren Sie, bevor Sie schreiben.** Welchen Weg Sie auch wählen, finden Sie heraus, was die Kette tut, bevor Sie hundert Anmerkungen in einem Dokument haben. Legen Sie dies in eine Datei und konvertieren Sie sie:

```markdown
Eine Referenz.[^probe]

Eine Inline-Anmerkung.^[Inline.]

[^probe]: Die Anmerkung, mit einem zweiten Absatz darunter.

    Um vier Leerzeichen eingerückt.
```

Vier Antworten aus einem Einfügen. Eine hochgestellte Zahl heißt, die Erweiterung ist da. Die dargestellte Anmerkung am Ende heißt, sie wurde richtig gesammelt. Ein zweiter Absatz innerhalb der Anmerkung heißt, die Einrückungsregel passt zu dem, was Sie tippen. Und ein sichtbares `^[Inline.]` heißt, Inline-Anmerkungen sind nicht verfügbar, was fast immer der Fall ist. Sehen Sie sich dann den HTML-Quelltext an und prüfen Sie, ob das `href` an der Referenz zur `id` an der Anmerkung passt, denn dieses Paar ist das, was leise bricht, wenn zwei Dokumente eine Seite teilen.

## Wie man wählt: Kriterien, bevor Sie sich auf Fußnoten festlegen

1. **Entscheiden Sie, ob die Anmerkung eine Fußnote oder eine Klammerbemerkung ist.** Wenn sie ein Teilsatz ist, setzen Sie sie in den Satz und überspringen Sie jedes Problem in diesem Text; ein Mechanismus, den Sie nicht verwenden, kann in einem Konverter, den Sie nicht getestet haben, nicht brechen.
2. **Benennen Sie die ganze Kette, die die Datei durchreist, und prüfen Sie dann das schwächste Glied darin.** Editor des Autors, Repository-Host, Konverter, Bereiniger, Veröffentlichung — Fußnoten brauchen die Erweiterung an jedem Schritt, der Markdown parst, und ein Schritt ohne sie verwandelt Ihre Anmerkungen in Klammern auf der veröffentlichten Seite.
3. **Verwenden Sie Identifikatoren aus Wörtern, keine Zahlen.** `[^exchange-rate]` übersteht Einfügen, Löschen und Umsortieren, während ein Dokument, das von `[^1]` bis `[^12]` beschriftet ist, irgendwann von Hand umnummeriert wird, von jemandem, der nicht wusste, dass der Renderer das ohnehin tut.
4. **Schalten Sie die ID-Präfix-Option ein, wenn mehr als ein Dokument eine Seite teilen kann.** Hugos `enableAutoIDPrefix`, Python-Markdowns `UNIQUE_IDS` und Pandocs `--id-prefix` sind alle ab Werk ausgeschaltet, eine Übersichtsseite oder ein zusammengesetztes Fragment wird also Fußnotenlinks haben, die auf die falsche Anmerkung auflösen, und kein Build-Schritt wird es Ihnen sagen.
5. **Setzen Sie den Fußnotenbehälter auf die Positivliste Ihres Bereinigers, zugleich mit der Erweiterung.** Eine für GFM-Ausgabe gebaute Liste hat kein `<section>` darin, und das Ergebnis ist eine Seite, auf der jede Referenz überlebt und jede Anmerkung fehlt, was fertig aussieht und es nicht ist.
6. **Behalten Sie Inline-Anmerkungen für Ketten, die ganz Ihnen gehören.** `^[…]` ist in Pandoc und markdown-it eine echte Bequemlichkeit, und es scheitert auf GitHub auf eine Weise, die nicht einmal wie eine Fußnote aussieht, eine Datei, die dort gelesen werden könnte, sollte also die Form mit den Klammern verwenden.
7. **Konvertieren Sie eine Datei mit Fußnoten und lesen Sie das Ende der Ausgabe.** Nicht den Anfang und nicht die Vorschau: das dargestellte HTML, in einem Browser, mit einem Klick auf eine Referenz und einem Klick auf den Rückverweis. Zehn Sekunden dort fangen die wörtlichen Klammern, den fehlenden Block und den Link mit falschem Ziel — die einzigen drei Dinge, die schiefgehen.

## Fazit

Fußnoten sind eine weit umgesetzte Konvention ohne Spezifikation dahinter, und alles Unbequeme an ihnen folgt aus dieser einen Tatsache. Die Syntax ist stabil genug, um sie einmal zu lernen — `[^name]` im Text, `[^name]:` am Ende, vier Leerzeichen, um eine Anmerkung fortzusetzen — und die Frage, die über das Funktionieren entscheidet, geht nie um die Syntax. Sie lautet, ob das bestimmte Werkzeug vor Ihrer Datei die Erweiterung hat und ob das Werkzeug danach sie auch hat. Prüfen Sie das schwächste Glied der Kette, halten Sie die Identifikatoren als Wörter, schalten Sie das ID-Präfix ein, wenn zwei Dokumente je eine Seite teilen werden, und setzen Sie den Fußnotenbehälter zugleich mit dem Parser-Plugin auf die Positivliste des Bereinigers. Wenn Sie sehen wollen, wozu ein bestimmtes Gebilde geworden ist, statt zu raten, dann beantwortet [die Konvertierung der Datei zu HTML](/) mit der Quelle sichtbar neben der Vorschau es sofort: ein `<sup>` und eine passende `id` heißen, die Fußnote ist echt, und ein Absatz, der `[^1]` enthält, heißt, Sie haben das schwächste Glied gefunden.

## FAQ

### Sind Fußnoten Teil von Markdown?

Nein. Sie stehen weder in der CommonMark-Spezifikation noch in der Spezifikation von GitHub Flavored Markdown, und die ursprüngliche Markdown-Syntax hatte sie nie. Die Syntax, die alle verwenden, kam von PHP Markdown Extra und verbreitete sich als Erweiterung, weshalb die Unterstützung nach Werkzeug schwankt und nicht nach Version.

### Warum erscheint meine Fußnote in der Ausgabe als `[^1]`?

Weil der Parser, der Ihre Datei konvertiert hat, keine Fußnoten umsetzt. Er hat die Klammern treu dargestellt, wie seine Spezifikation es verlangt. Fügen Sie diesem Parser entweder die Fußnoten-Erweiterung oder das Plugin hinzu, oder verwenden Sie einen anderen — und prüfen Sie jeden Schritt der Kette, denn das Scheitern kommt vom schwächsten Glied, nicht vom ersten.

### Funktionieren Fußnoten auf GitHub?

Ja, in Markdown-Dateien, Issues, Pull Requests und Discussions. GitHubs Dokumentation hält eine Ausnahme fest: in Wikis werden Fußnoten nicht unterstützt. Bedenken Sie, dass GitHub sie darzustellen nicht dasselbe ist, wie dass die GFM-Spezifikation sie enthält, ein Parser also, der GFM-Konformität behauptet und Ihre Fußnoten ignoriert, verhält sich korrekt.

### Kann eine Fußnote eine Liste oder einen Codeblock enthalten?

Ja, wenn Sie sie einrücken. Vier Leerzeichen auf den Fortsetzungszeilen halten einen Absatz, eine Liste oder einen eingerückten Codeblock sowohl in Pandoc als auch in Python-Markdown an der Anmerkung. Verlieren Sie die Einrückung, und der Block wird gewöhnlicher Textkörper, an der Stelle im Dokument, an der die Definition zufällig stand.

### Wie konvertiere ich eine Markdown-Datei mit Fußnoten zu HTML?

Verwenden Sie einen Parser mit eingeschalteter Erweiterung: Pandoc, das sie im eigenen Dialekt an hat, oder markdown-it mit `markdown-it-footnote`, oder Python-Markdown mit `extensions=['footnotes']`, oder remark mit `remark-gfm`. Öffnen Sie dann das Ergebnis und klicken Sie eine Referenz und einen Rückverweis an, denn dass die Erweiterung da ist, garantiert nicht, dass die IDs passen, sobald die Seite noch irgendetwas anderes enthält.

### Warum springen meine Fußnotenlinks zur falschen Anmerkung?

Weil die IDs kollidieren. Fußnoten-IDs werden pro Dokument erzeugt und sind nur darin eindeutig, zwei dargestellte Dokumente auf derselben Seite enthalten also beide `fn1`, und der Browser geht zum ersten. Schalten Sie die ID-Präfix-Option Ihres Werkzeugs ein — `enableAutoIDPrefix` in Hugo, `UNIQUE_IDS` in Python-Markdown, `--id-prefix` in Pandoc — die alle standardmäßig ausgeschaltet sind.

### Was ist hier der Unterschied zwischen einer Fußnote und einer Endnote?

In Markdown auf der Ebene der Syntax nichts: Sie schreiben in beiden Fällen dasselbe `[^1]`, und der Renderer entscheidet, wo die Anmerkungen landen. Pandoc ist das eine Werkzeug, das die Platzierung ausdrücklich macht, mit `--reference-location`, das das Ende des Blocks, das Ende des Abschnitts oder das Ende des Dokuments wählt. Python-Markdowns `PLACE_MARKER` tut etwas Ähnliches, indem es Sie den Block dorthin setzen lässt, wo Sie ihn wollen.
