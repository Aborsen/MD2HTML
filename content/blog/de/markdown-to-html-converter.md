---
title: "Markdown zu HTML: was mit Ihrer Datei tatsächlich passiert"
description: "Was ein Markdown-zu-HTML-Konverter mit Ihrer Datei macht — parsen, ausgeben, bereinigen, verpacken — und wie ein Fehler in jeder der vier Stufen aussieht"
date: 2026-09-08
tag: Konvertieren
keywords: markdown zu html, md zu html, markdown in html umwandeln, markdown zu html konverter online, markdown zu html generator, markdown als html darstellen
---

Eine Markdown-Datei in HTML umzuwandeln klingt nach einer einzigen Handlung. Es sind vier Arbeitsschritte, die hintereinander laufen, und ein Werkzeug kann bei einem sorgfältig und beim nächsten nachlässig sein. Zu wissen, welcher welcher ist, erklärt, warum zwei Konverter aus derselben Datei unterschiedliches HTML machen, warum eine Tabelle manchmal als Absatz voller Pipe-Zeichen ankommt und warum das Ergebnis gelegentlich als Wand unformatierten Textes öffnet, in dem die Gedankenstriche zu Kauderwelsch geworden sind.

Die vier Stufen sind Parsen, Ausgeben, Bereinigen und Verpacken. Jede wirft Information weg oder erfindet Information, die in Ihrer Quelle nie stand, und jede scheitert auf eine Weise, die Sie auf dem Bildschirm erkennen können, sobald Sie wissen, worauf zu achten ist. Keine der vier ist verzichtbar, wenn die Datei irgendwo anders öffnen muss als in dem Werkzeug, das sie erzeugt hat.

Das hier ist die mechanische Darstellung: was der Parser tatsächlich baut, was der Renderer an Ihrer Stelle entscheidet, was auf der Positivliste eines Bereinigers steht und was er löscht, und was ein Browser im `<head>` braucht, bevor er Ihr Dokument so darstellt, wie Sie es in der Vorschau gesehen haben.

### Kurzfassung

Ein Markdown-zu-HTML-Konverter zerlegt Ihren Text in einen **Syntaxbaum** aus typisierten Knoten, läuft diesen Baum ab, um Tags **auszugeben**, **bereinigt** das entstandene Fragment gegen eine Positivliste aus Tags, Attributen und URL-Schemata und **verpackt** das Fragment dann in ein vollständiges Dokument mit Doctype, Zeichensatz und Stilen. Der Dialekt entscheidet sich in Stufe eins, ein reiner CommonMark-Parser macht aus Ihren GitHub-Tabellen also Absätze — und es gibt keine Fehlermeldung. Das Bereinigen entscheidet sich in Stufe drei, und es wird in dem Moment wichtig, in dem das Markdown von irgendwo herkam, wo Sie es nicht selbst geschrieben haben. Ob die Datei bei dem Menschen, dem Sie sie schicken, korrekt öffnet, entscheidet sich fast vollständig in Stufe vier — durch vier Zeilen im Head, die die meisten Bibliotheken nie schreiben, weil das Schreiben nicht die Aufgabe einer Bibliothek ist.

## Die vier Stufen im Überblick

| Stufe | Eingabe | Ausgabe | Hier entschieden |
| --- | --- | --- | --- |
| Parsen | Zeichen | Ein Baum typisierter Knoten | Dialekt: Tabellen, Aufgabenlisten, Fußnoten, Zeilenumbruchregeln |
| Ausgeben | Der Baum | Ein HTML-Fragment | Überschriften-IDs, Klassen an Codeblöcken, Checkbox-Markup, URL-Kodierung |
| Bereinigen | Das Fragment | Ein Fragment ohne die gefährlichen Teile | Welche Tags, Attribute und URL-Schemata überleben |
| Verpacken | Das Fragment | Ein vollständiges Dokument | Doctype, Zeichensatz, Titel, Viewport, Stile, ob es das Netz braucht |

Lesen Sie diese Tabelle als Kette. Eine Datei, die falsch herauskam, kam an genau einem dieser vier Punkte falsch heraus, und das Symptom sagt Ihnen, an welchem. Fehlende Tabellen sind ein Parser-Problem, und kein Umformatieren wird sie zurückbringen. Unformatierter Text ist ein Verpackungsproblem und hat mit dem Parser nichts zu tun. Ein überlebendes `<script>`-Tag ist ein Bereinigungsproblem — und das einzige der vier, das jemandem schaden kann.

## Stufe eins: Parsen, und was in einem Syntaxbaum wirklich steht

Ein Parser liest die Zeichen und baut einen Baum. Nicht HTML — einen Baum typisierter Knoten, jeder mit einer Handvoll Felder, und nirgends ein Tag. Nehmen wir vier Zeilen Markdown:

```markdown
## Release 2.1

- [x] Tighten the allow-list
- [ ] Document the API

See the [changelog](CHANGELOG.md) for the rest.
```

Was der Parser erzeugt, sieht eher so aus, als Gliederung geschrieben:

```text
document
  heading (level: 2)
    text "Release 2.1"
  list (ordered: false, tight: true, marker: "-")
    item (checked: true)
      paragraph
        text "Tighten the allow-list"
    item (checked: false)
      paragraph
        text "Document the API"
  paragraph
    text "See the "
    link (destination: "CHANGELOG.md", title: null)
      text "changelog"
    text " for the rest."
```

Mehreres in dieser Gliederung ist es wert, benannt zu werden, denn jedes davon wird später zu einem sichtbaren Unterschied im HTML.

**Knoten sind entweder Block oder Inline.** Blöcke sind die Gestalt des Dokuments: `document`, `heading`, `paragraph`, `list`, `item`, `block_quote`, `code_block`, `thematic_break`, `html_block`. Inlines sind der Inhalt eines Blocks: `text`, `emphasis`, `strong`, `code`, `link`, `image`, `softbreak`, `linebreak`, `html_inline`. Die Blockstruktur wird zuerst bestimmt, in einem Durchgang über die Zeilen; der Inline-Inhalt wird danach geparst, innerhalb jedes Blocks. Dieser zweiphasige Aufbau ist der Grund, warum ein verirrtes `*` am Ende eines Absatzes die folgende Überschrift nicht kursiv machen kann, und warum eine Tabellenzeile keine Liste enthalten kann.

**Jeder Knoten trägt Quellpositionen.** Anfangs- und Endzeile, Anfangs- und Endspalte. Niemand sieht sie in der Ausgabe, aber sie sind es, was die Vorschau eines Editors synchron mit dem Text scrollen lässt, was einen Linter „Zeile 47, Spalte 3" sagen lässt und was ein Werkzeug in die Lage versetzt, zu melden, in welcher Zeile ein defekter Link stand. Ein Konverter, der Positionen verwirft, kann Ihnen nicht sagen, wo etwas schiefgegangen ist.

**Manche Knoten tragen strukturelle Attribute, die die Ausgabe verändern.** Ein `list`-Knoten hält fest, ob er nummeriert ist, bei welcher Zahl er beginnt, und ob er *tight* oder *loose* ist. Über die Dichte entscheiden Leerzeilen in Ihrer Quelle: Punkte ohne Leerzeile dazwischen ergeben eine dichte Liste, und die Elemente einer dichten Liste werden ohne `<p>`-Hüllen ausgegeben. Setzen Sie eine Leerzeile zwischen zwei Punkte, und jedes Element der Liste wird locker, bekommt einen Absatz, und die ganze Liste wird höher. Das ist das mit Abstand häufigste „warum hat sich der Abstand geändert" in Markdown, und es passiert im Baum, bevor irgendein HTML existiert.

Ein `code_block`-Knoten hält das Zaunzeichen, die Zaunlänge und den *Info-String* fest — das `js` in ` ```js `. Der Info-String ist freier Text; der Parser weiß nicht, dass es ein Sprachname ist. Ein `item`-Knoten in einem GitHub-Dialekt-Parser hält fest, ob seine Checkbox angekreuzt war. Ein `link`-Knoten hält ein Ziel und einen optionalen Titel, bereits entmaskiert.

**Link-Referenzdefinitionen überleben nicht als Knoten.** Schreiben Sie `[changelog][cl]` in einen Absatz und `[cl]: https://example.com/log` ans Ende der Datei, dann verbraucht der Parser die Definitionszeile vollständig und löst das Ziel in den `link`-Knoten auf. Nichts im Baum erinnert sich daran, dass der Link in Referenzform geschrieben war. Zwei Folgen ergeben sich daraus: eine Definition, die niemand referenziert, verschwindet spurlos, und eine Referenz mit einem Tippfehler im Label ist kein Fehler — sie ist wörtlicher Text, und `[changelog][cl2]` erscheint als genau diese Zeichen, Klammern inklusive.

**Rohes HTML ist eine opake Zeichenkette.** Ein `<div>` oder ein `<script>` in Ihrem Markdown wird ein `html_block`-Knoten, dessen Inhalt der rohe Text ist. Der Markdown-Parser zerlegt ihn nicht in Elemente, prüft nicht, ob die Tags ausbalanciert sind, und weiß nicht, was darin steht. Es ist eine verschlossene Kiste, die in die Ausgabe hinübergetragen wird — genau deshalb muss der Bereiniger in Stufe drei sein eigenes HTML-Parsen erledigen statt den Baum zu befragen.

## Wo die Markdown-Dialekte auseinandergehen

Der Dialekt ist eine Eigenschaft des Parsers, und er entscheidet sich hier. Jeder Unterschied unten ist eine reale, aufzählbare Abweichung zwischen benannten Spezifikationen und Implementierungen.

**Reines CommonMark hat keine Tabellen.** Keine Aufgabenlisten, kein Durchgestrichenes, kein automatisches Verlinken nackter URLs. Es hat ATX-Überschriften, Setext-Überschriften, eingezäunten und eingerückten Code, Listen, Blockzitate, Trennlinien, Betonung, Links, Bilder und rohes HTML. Das ist die Spezifikation. Geben Sie einem streng konformen Parser eine Pipe-Tabelle, und Sie erhalten einen Absatz mit Pipe-Zeichen, als ein Textfluss gesetzt, ohne jede Warnung.

**GitHub Flavored Markdown fügt CommonMark fünf Erweiterungen hinzu:** Tabellen, Aufgabenlisten-Elemente, Durchgestrichenes mit `~~`, Autolink-Literale und unzulässiges rohes HTML, was eine kurze Liste von Tags in der Parse-Stufe herausfiltert. Es ist eine Spezifikation für sich, veröffentlicht als Differenz zu CommonMark — deshalb ist „unterstützt es GFM" eine sinnvolle Frage mit einer Ja-oder-Nein-Antwort. Beachten Sie: die fünfte Erweiterung ist kein Ersatz für Stufe drei. Sie benennt eine Handvoll Tags, keine Positivliste.

**Fußnoten stehen in keiner der beiden Spezifikationen.** Ein Konverter, der `[^1]` unterstützt, tut das als Erweiterung, und die Erweiterungen sind untereinander nicht einig darüber, wo der Notentext stehen darf, ob eine Note eine Liste enthalten darf und wie der Rücksprung-Link aussieht. Fußnoten sind das Merkmal, das eine Konvertierung am ehesten übersteht und in der nächsten verschwindet.

**Betonung innerhalb eines Wortes wird unterschiedlich behandelt.** CommonMark behandelt `_` innerhalb eines Wortes bewusst nicht als Betonung, `snake_case_name` bleibt also unversehrt. Ältere Konverter, darunter JavaScript-Konverter aus der Zeit vor CommonMark, setzen die Mitte dieses Bezeichners kursiv. Wenn Ihr Dokument voller Variablennamen ist, ist der gewählte Parser der Unterschied zwischen lesbar und zerstört.

**Sanfte Zeilenumbrüche sind eine Option, keine Regel.** Ein einzelner Zeilenumbruch innerhalb eines Absatzes ist ein `softbreak`-Knoten. CommonMark gibt ihn als Zeilenumbruch im HTML aus, den der Browser zu einem Leerzeichen zusammenfaltet. marked und markdown-it bieten beide eine `breaks`-Option, die ihn stattdessen als `<br>` ausgibt; Python-Markdown macht dasselbe über seine `nl2br`-Erweiterung. Dieselbe Datei, zwei Einstellungen, zwei Dokumente — eines, in dem Ihr Adressblock drei Zeilen hat, und eines, in dem er eine hat.

**Erweiterte Dialekte gehen noch weiter.** Pandocs eigenes Markdown ergänzt Definitionslisten, eingezäunte Divs, Zitate und Inline-Mathematik. Die `attr_list`-Erweiterung von Python-Markdown erlaubt es, Klassen und IDs aus der Quelle an Elemente zu hängen. PHP Markdown Extra und MultiMarkdown haben jeweils ihre eigenen Tabellensyntax-Varianten. All das parst in dem Werkzeug, das es definiert, und verfällt überall sonst zu wörtlicher Zeichensetzung — das ist gemeint, wenn Leute sagen, eine Markdown-Datei sei nicht portabel. Die Dialektfrage lohnt es, richtig zu verstehen, denn [die Dialekte unterscheiden sich in bestimmten, aufzählbaren Punkten](/blog/commonmark-gfm-and-the-flavours), und die Unterschiede sind alle lautlos.

## Stufe zwei: Ausgeben, und die Entscheidungen, nach denen niemand gefragt hat

Der Renderer läuft den Baum ab und schreibt Tags. Hier beginnt der Konverter zu erfinden, denn HTML braucht Details, die Markdown nie ausgedrückt hat. Aus dem Baum von oben könnte ein GitHub-Dialekt-Renderer das schreiben:

```html
<h2 id="doc-release-21">Release 2.1</h2>
<ul class="contains-task-list">
  <li class="task-list-item"><input type="checkbox" checked disabled> Tighten the allow-list</li>
  <li class="task-list-item"><input type="checkbox" disabled> Document the API</li>
</ul>
<p>See the <a href="CHANGELOG.md">changelog</a> for the rest.</p>
```

Nicht eine der IDs, Klassen oder Input-Elemente stand in Ihrer Quelle. Es sind Hausentscheidungen — deshalb können zwei Konverter beide korrekt sein und sich trotzdem widersprechen.

**Überschriften-IDs sind die schärfste Kante.** Keine Spezifikation sagt, dass Überschriften eine `id` bekommen, und keine definiert, wie der Text zum Slug wird. Implementierungen setzen den Text klein, lassen Zeichensetzung weg, ersetzen Leerzeichen durch Bindestriche und hängen bei Dubletten einen Zähler an — aber sie sind sich uneinig, welche Zeichensetzung wegfällt und wie der Zähler aussieht. Ein Renderer entfernt den Punkt und erzeugt `release-21`; ein anderer behält ihn und erzeugt `release-2.1`; ein dritter setzt allem ein Präfix voran, wie `doc-release-21` oben, damit die ID nicht mit dem Markup der Seite selbst kollidiert. Anker-Links, die von Hand gegen ein Schema geschrieben wurden, brechen lautlos gegen ein anderes — und „lautlos" heißt hier, dass der Browser nirgendwohin scrollt und keinen Fehler zeigt.

**Codeblöcke bekommen eine Klasse, und die Konvention ist nicht allgemein.** Die üblliche Ausgabe ist `<pre><code class="language-js">`, mit dem ersten Wort des Info-Strings. Manche Renderer schreiben `class="js"`, manche ergänzen ein `data-lang`-Attribut, manche geben ein umhüllendes `<div>` mit der Sprache darin aus. Die Hervorhebung ist wieder eine eigene Entscheidung: entweder der Konverter lässt zur Konvertierungszeit einen Highlighter laufen und gibt Spans mit Klassennamen aus, oder er gibt ein einfaches Code-Element aus und erwartet, dass ein Skript es im Browser einfärbt. Das erste erzeugt eine Datei, die offline funktioniert; das zweite eine Datei, die das Netz und ein Skript-Tag braucht. Diese Wahl, und der [Umgang mit Codeblöcken überhaupt](/blog/code-blocks-in-markdown), entscheidet darüber, ob Ihre Beispiel-Listings das Mailen überstehen.

**Text und URLs werden maskiert, und die Maskierung unterscheidet sich.** In Textknoten werden `&`, `<` und `>` durch Entitäten ersetzt. In Attributwerten werden Anführungszeichen ersetzt. Link-Ziele werden prozentkodiert, und die Implementierungen sind uneinig darüber, ob ein Ziel, das schon ein `%` enthält, in Ruhe gelassen oder erneut kodiert wird — das zweite verwandelt eine funktionierende URL in einen 404. Renderer sind sich auch uneinig darüber, ob sie die Groß- und Kleinschreibung von Hex-Escapes normalisieren und ob sie Zeichen kodieren, die in einer URL erlaubt, aber hässlich sind.

**Typografie ist optional.** Die `typographer`-Option von markdown-it und Pandocs `smart`-Erweiterung machen aus geraden Anführungszeichen typografische, aus `--` einen Halbgeviertstrich und aus `...` Auslassungspunkte. Angenehm in Prosa, falsch in einem Dokument voller Kommandozeilen, wo ein typografisches Anführungszeichen, ins Terminal eingefügt, mit einer Meldung scheitert, die von Anführungszeichen nichts sagt.

**Aufgabenlisten-Markup schwankt.** Manche Renderer geben ein echtes `<input type="checkbox" disabled>` aus, manche ein formatiertes `<span>`, manche lassen den wörtlichen `[x]`-Text stehen, weil sie die Erweiterung nie umgesetzt haben. Das ist zweimal wichtig: einmal für das Aussehen, und noch einmal in Stufe drei, denn ein Input-Element ist genau die Art von Sache, die die Positivliste eines Bereinigers gern löscht.

**Tabellen bekommen Ausrichtungsattribute oder Klassen.** Die Doppelpunkte in der Trennzeile einer GFM-Tabelle werden entweder zu `align="left"`-Attributen an den Zellen, oder zu einer Klasse pro Spalte, oder zu Inline-Stilen — drei Wege, dieselbe Absicht auszudrücken, und ein Bereiniger behandelt jeden davon anders. Tabellen tragen davon pro Zeile mehr als alles andere in Markdown, weshalb [Tabellen auf dem Weg hinüber am häufigsten brechen](/blog/markdown-tables-that-survive-conversion).

Was der Renderer zurückgibt, ist ein Fragment. Überschriften, Absätze und Listen, ohne Doctype, ohne Head, ohne Stile — und ohne jede Zusicherung, dass irgendetwas davon sicher ist.

## Stufe drei: Bereinigen, die Aufgabe, die Leute vergessen

Markdown lässt rohes HTML bewusst durch. Ein `<script>`-Tag in einer .md-Datei ist kein Fehler; es ist Inhalt, und ein treuer Renderer kopiert es in die Ausgabe. Genauso ein `onerror`-Attribut an einem Bild, genauso eine `javascript:`-URL in einem Link. Wenn das Markdown von irgendwo herkam, das Sie nicht kontrollieren — ein Pull Request, ein Issue, ein Kunde, die Ausgabe eines Modells — dann ist das Fragment, das Sie gerade erzeugt haben, nicht vertrauenswürdiges HTML, und es im Browser zu öffnen heißt, es auszuführen.

Das Bereinigen schickt dieses Fragment durch eine Positivliste und verwirft alles andere. Es muss eine Positivliste sein. Eine Sperrliste bekannter böser Tags verliert gegen den nächsten Kodierungstrick, die nächste Großschreibungsvariante, den nächsten Namensraum, in dem ein Attribut etwas anderes bedeutet.

## Wie die Positivliste eines Bereinigers wirklich aussieht

Eine Positivliste sind drei Listen und eine Regel, nicht eine Liste von Tags.

**Die Tag-Liste.** Alles, was Markdown rechtmäßig erzeugen kann, und nichts weiter: `p`, `h1` bis `h6`, `ul`, `ol`, `li`, `blockquote`, `pre`, `code`, `em`, `strong`, `del`, `a`, `img`, `hr`, `br`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `sup`, `sub`. Dazu `input`, wenn Sie Aufgabenlisten-Checkboxen wollen, `details` und `summary`, wenn Ihre Dokumente sie verwenden, `span` und `div`, wenn Sie rohe HTML-Container überhaupt erlauben.

**Die Attributliste, pro Tag.** Das ist der Teil, den Leute falsch machen, indem sie eine globale Liste schreiben. `a` bekommt `href`, `title`, `rel` und möglicherweise `target`. `img` bekommt `src`, `alt`, `title`, `width` und `height`. `th` und `td` bekommen `colspan`, `rowspan` und `align`. `code` bekommt `class`, beschränkt auf das Präfix `language-`, wenn Sie sorgfältig sind. `input` bekommt `type`, `checked` und `disabled`, und `type` ist auf `checkbox` festgenagelt. Überschriften bekommen `id`. Nichts anderes bekommt irgendetwas.

**Die Liste der URL-Schemata.** `http`, `https` und `mailto` für Links; dazu `data:` nur für Bilder, wenn Sie eingebettete Bilder wirklich wollen, und dann beschränkt auf Bild-Medientypen. Alles andere fällt weg: `javascript:`, `vbscript:`, `file:` und `data:text/html`, was ein ganzes Dokument ist, das sich als URL ausgibt. Schemata müssen nach dem Entmaskieren und nach dem Entfernen von Leerraum und Steuerzeichen geprüft werden, denn `java&#09;script:` ist eine URL, der ein Browser bereitwillig folgt.

**Die Regel für alles andere.** Ein unbekanntes Tag wird entweder ganz verworfen oder ausgepackt — das Tag entfernt, die Kinder behalten. Auspacken behält mehr von Ihrem Text; Verwerfen ist sicherer bei Containern, deren Inhalt nie als Prosa gelesen werden sollte. Wählen Sie bewusst eines davon, denn der Unterschied zeigt sich als entweder doppelter oder fehlender Inhalt, sobald das Dokument von jemandem ein `<template>` enthält.

## Was ein Bereiniger verwirft, und warum jeweils

| Verworfen | Warum |
| --- | --- |
| `<script>` | Führt beim Öffnen aus. Der ganze Grund, warum diese Stufe existiert |
| `on*`-Attribute | `onerror`, `onload`, `onmouseover` führen aus, ohne dass irgendwo ein Skript-Tag steht |
| `javascript:`- und `data:text/html`-URLs | Ein Link oder eine Bildquelle, die Code ausführt statt eine Ressource zu holen |
| `<iframe>`, `<object>`, `<embed>` | Laden und führen Inhalte Dritter innerhalb Ihres Dokuments aus |
| `srcdoc` | Ein ganzes HTML-Dokument, in ein Attribut geschmuggelt |
| `<style>` und `style`-Attribute | Können Elemente verschieben und verkleiden; oft entfernt, manchmal mit einer Eigenschaften-Positivliste erlaubt |
| `<form>`, `<button>`, `formaction` | Fragen den Leser nach Eingaben und schicken sie irgendwohin |
| `<base>` | Ein Tag, das lautlos jede relative URL im Dokument umschreibt |
| `<meta http-equiv="refresh">` | Leitet den Leser von Ihrem Dokument weg |
| `<svg>` und `<math>` | Die Parse-Regeln für Fremdinhalte weichen von denen für HTML ab, und beide können Skripte und ihre eigene Link-Syntax tragen |
| `id` und `name` ohne Präfix | DOM-Clobbering: `id="attributes"` überdeckt eine echte DOM-Eigenschaft und bricht Skripte, die sie lesen |

Zwei Details entscheiden, ob ein Bereiniger in der Praxis hält.

**Wo er läuft.** Ein Bereiniger im Browser stützt sich auf den Parser des Browsers — denselben Parser, der das Dokument später darstellen wird. Das ist ein echter Vorteil, denn er sieht das Markup so, wie der Browser es sehen wird. Einer auf einem Server muss das HTML selbst parsen, mit seiner eigenen Vorstellung davon, wie fehlerhafte Tags sich verschachteln. Wenn ein Werkzeug an beiden Orten konvertiert, müssen die beiden übereinstimmen, sonst wird dasselbe Dokument unterschiedlich dargestellt, je nachdem, wer gefragt hat. Hier wohnen auch die Mutationsprobleme: wenn das Parsen des Bereinigers und das Parsen des Browsers sich über einen Verschachtelungsgrenzfall uneins sind, kann das Säubern des Markups etwas erzeugen, das im Browser als anderes Markup neu geparst wird als das, was freigegeben wurde.

**Überschriften-IDs, noch einmal.** Ein nacktes `id="title"` überdeckt eine DOM-Eigenschaft, ein Browser-Bereiniger entfernt es also, während ein serverseitiger Parser es behält: ein Dokument, zwei Formen, und Anker-Links, die in der einen funktionieren und in der anderen nicht. Ein Präfix an den IDs beantwortet beide Probleme auf einmal. TransformPipe bereinigt mit DOMPurify im Browser und mit dem `xss`-Paket auf dem Server gegen eine gemeinsame Positivliste, und seine Überschriften-IDs tragen ein `doc-`-Präfix. Es gibt [mehr über das sichere Bereinigen von Markdown](/blog/sanitising-markdown-safely), als in eine Stufe einer Pipeline passt.

Noch eines zu dieser Stufe: Bereinigen ist sichtbar. Es entfernt Dinge. Checkboxen verschwinden, wenn `input` nicht auf der Liste steht, ein `<details>`-Block flacht zu seinem Inhalt ab, ein eingebettetes Diagramm wird zu gar nichts. Das ist kein Fehler — es ist die Positivliste bei der Arbeit — aber es heißt, dass die Ausgabe gelesen und nicht angenommen werden muss.

## Stufe vier: Verpacken, denn ein Fragment ist keine Seite

Was Renderer und Bereiniger zurückgeben, ist ein Fragment: `<h1>Titel</h1><p>Text</p>` und nichts darum. Fügen Sie es in eine bestehende Seite ein, und es funktioniert perfekt. Speichern Sie es als .html, schicken Sie es jemandem, und der Browser tut sein Bestes mit einem Dokument, das sich nie erklärt hat.

Ein vollständiges Dokument braucht eine kleine, feste Menge an Dingen, und an jedem hängt ein bestimmter Fehler.

**`<!doctype html>`, erste Zeile.** Ohne es geht der Browser in den Quirks-Modus, und das ist eine andere Rendering-Maschine mit einem anderen Boxmodell, anderer Vererbung in Tabellenzellen und anderer Behandlung der Zeilenhöhe. Ihr Dokument wird nicht genau kaputt sein — es wird auf subtile, unerklärliche Weise anders gesetzt sein als die Vorschau, die Sie freigegeben haben.

**`<html lang="de">`.** Das Sprachattribut ist es, woran ein Screenreader Stimme und Aussprache wählt, und woran der Browser Silbentrennung und Anführungszeichen ausrichtet. Lassen Sie es weg, und ein deutsches Dokument wird vielleicht mit der Phonetik dessen vorgelesen, was beim Leser voreingestellt ist.

**`<meta charset="utf-8">`, innerhalb der ersten 1024 Bytes.** Das ist das, was das klassische Symptom erzeugt. Ihre Datei ist UTF-8; ohne Deklaration rät ein Browser, und ein falscher Rat stellt jeden Gedankenstrich als `â€"` dar, jeden typografischen Apostroph als `â€™` und jeden Umlaut als zwei Zeichen Rauschen. Die Deklaration muss früh kommen, vor jedem größeren Inhalt, denn der Browser hört mit dem Schnüffeln auf, sobald er angefangen hat.

**`<title>`.** Er benennt den Browser-Tab, er ist es, was ein „Speichern unter"-Dialog als Dateinamen vorschlägt, und er ist es, was eine Link-Vorschau in einem Chat-Programm zeigt. Ein Dokument ohne Titel kommt im Download-Ordner von jemandem als sein eigener Pfad an.

**`<meta name="viewport" content="width=device-width, initial-scale=1">`.** Ohne dieses Tag setzt ein Telefon die Seite etwa in Desktop-Breite und zoomt dann heraus, damit sie hineinpasst — Ihr Dokument öffnet also als lesbar-wenn-man-aufzieht. Die Hälfte der Leute, denen Sie ein Dokument schicken, öffnet es zuerst auf dem Telefon.

**Ein Stylesheet.** Das ist der Unterschied zwischen konvertiert und konvertiert aussehend. Was es braucht, ist unglamourös: ein lesbares Satzmaß, damit die Zeilen nicht über die volle Monitorbreite laufen, eine Zeilenhöhe, Rahmen und Innenabstand an Tabellenzellen, `overflow-x: auto` an `pre`, damit eine lange Codezeile scrollt statt die Seite zu spreizen, `max-width: 100%` an Bildern, damit ein Screenshot das Layout nicht seitwärts schiebt, und einen `@media print`-Block, wenn irgendwer es drucken wird.

**Betten Sie die Stile ein, wenn die Datei reisen muss.** Ein `<link>` auf ein Stylesheet oder eine Schrift bei einem CDN bedeutet, dass das Dokument nur dort richtig aussieht, wo es eine Verbindung hat, und es bedeutet, dass das Öffnen der Datei einem Dritten mitteilt, dass sie geöffnet wurde. Eine eigenständige Datei trägt ihre Stile in einem `<style>`-Element und fragt nichts an. Sie ist eine größere Datei, und sie ist die einzige Fassung, die offline, auf einem gesperrten Laptop und in fünf Jahren, wenn die CDN-URL umgezogen ist, identisch erscheint.

**Relative Pfade lösen sich gegen den neuen Ort der Datei auf.** Ein Bild, das als `images/diagram.png` geschrieben ist, löst sich relativ zu dort auf, wo die .html jetzt liegt — es bricht also in dem Moment, in dem die Datei umzieht oder an eine E-Mail gehängt wird. Nur eine absolute URL oder ein Data-URI reist mit dem Dokument. Dasselbe gilt für `[changelog](CHANGELOG.md)`: es wird zu einem `href` auf eine .md-Datei, und ein Browser, dem man eine .md-Datei gibt, lädt sie meist herunter statt sie darzustellen — es sei denn, Sie haben diese Datei ebenfalls konvertiert und die Endung umgeschrieben.

## Wie ein Fehler in jeder Stufe auf dem Bildschirm aussieht

Das Symptom benennt die Stufe. Das ist die Tabelle zum Behalten.

| Stufe | Was Sie sehen | Was tatsächlich passiert ist | Wie Sie prüfen |
| --- | --- | --- | --- |
| Parsen | Ein Absatz voller `\|`-Zeichen, wo eine Tabelle sein sollte | Der Parser läuft als CommonMark, nicht als GFM; Tabellen wurden nie erkannt | Sehen Sie im HTML-Quelltext nach `<table>`. Steht dort kein Tabellenelement, hilft keine Formatierung |
| Parsen | Wörtliche `[x]` und `[ ]` am Anfang von Listenelementen | Aufgabenlisten-Erweiterung nicht eingeschaltet | Suchen Sie in der Ausgabe nach `type="checkbox"` |
| Parsen | Wörtliches `[^1]` im Text und keine Noten unten | Fußnoten sind eine Erweiterung, und dieser Parser hat sie nicht | Prüfen Sie die Dialekt- oder Erweiterungsliste des Werkzeugs |
| Parsen | Ein dreizeiliger Adressblock zu einer Zeile zusammengefallen | Einzelne Zeilenumbrüche sind sanfte Umbrüche; die `breaks`-Option ist aus | Suchen Sie im Quelltext nach `<br>`; es wird keines geben |
| Parsen | Eine verschachtelte Liste flach dargestellt, oder als Codeblock | Die Fortsetzungs-Einrückung entsprach nicht dem, was der Parser erwartet | Zählen Sie die Leerzeichen; falsch ist der Baum, nicht das CSS |
| Ausgeben | Anker-Links scrollen nirgendwohin | Die Slugs der Überschriften-IDs weichen von denen ab, gegen die Ihre Links geschrieben wurden | Vergleichen Sie ein `href="#…"` mit der `id` an der Überschrift |
| Ausgeben | Codeblöcke vorhanden, aber nicht eingefärbt | Der Renderer gab eine Klasse aus und ließ die Hervorhebung einem Skript, das nicht in der Datei ist | Sehen Sie nach `class="language-…"` und nach einem Skript-Tag |
| Ausgeben | Typografische Anführungszeichen in einer Kommandozeile, die jetzt nicht mehr läuft | Die typografische Ersetzung war eingeschaltet | Suchen Sie in der Ausgabe nach `’` und `“` |
| Ausgeben | Eine URL, die 404 liefert, obwohl sie in der Quelle funktionierte | Das Ziel wurde zweimal prozentkodiert | Vergleichen Sie das `href` zeichenweise mit dem Markdown-Ziel |
| Bereinigen | Ein Meldungsfenster, oder überhaupt irgendetwas, das ausführt | Nichts hat das Fragment bereinigt. Das Dokument führt Code seines Autors aus | Suchen Sie im Quelltext nach `<script` und `on`-Handlern, bevor Sie es öffnen |
| Bereinigen | Checkboxen weg, `<details>`-Blöcke abgeflacht, ein Embed fehlt | Die Positivliste hat ihre Arbeit getan, und diese Tags standen nicht darauf | Vergleichen Sie das Fragment vor und nach dem Bereinigen, wenn das Werkzeug beides zeigt |
| Bereinigen | Dasselbe Dokument wird auf zwei Rechnern unterschiedlich dargestellt | Der Bereiniger im Browser und der auf dem Server laufen gegen unterschiedliche Positivlisten | Konvertieren Sie dieselbe Datei an beiden Orten und vergleichen Sie das HTML |
| Verpacken | Eine Wand Serifentext über die volle Fensterbreite | Sie haben ein Fragment bekommen, kein Dokument. Kein Doctype, kein Head, keine Stile | Sehen Sie in die erste Zeile der Datei nach `<!doctype html>` |
| Verpacken | `â€"` und `â€™` überall in der Prosa verstreut | Keine Zeichensatzdeklaration, der Browser hat also falsch geraten | Prüfen Sie den Head auf `<meta charset="utf-8">` |
| Verpacken | Auf dem Telefon nur nach Aufziehen lesbar | Kein Viewport-Meta-Tag | Prüfen Sie den Head; dann öffnen Sie es auf einem Telefon, nicht in einem Geräte-Emulator |
| Verpacken | Kaputte Bildsymbole, nachdem die Datei gemailt wurde | Relative Bildpfade, die nicht mehr auflösen | Sehen Sie die `src`-Werte an; alles, was nicht absolut oder ein Data-URI ist, wird brechen |
| Verpacken | Richtig mit Netz, schmucklos ohne | Stile oder Schriften sind von einem CDN verlinkt statt eingebettet | Schalten Sie das Netz ab und öffnen Sie die Datei erneut |

## Der schnelle Vergleich: wo die vier Stufen laufen können

Die vier Stufen passieren dort, wo Sie sie hinlegen. Was sich ändert, ist, welche der vier das Werkzeug für Sie erledigt und welche es auf Ihrem Schreibtisch liegen lässt.

| Wo Sie konvertieren | Am besten für | Welche Stufen es erledigt | Preis |
| --- | --- | --- | --- |
| Konverter im Browser | Eine Datei, jetzt, mit einem Menschen als Empfänger | Alle vier, samt eigenständiger Verpackung | Kostenlos |
| Eine Bibliothek im eigenen Code | Darstellung innerhalb einer Anwendung, die Sie bauen | Parsen und Ausgeben; Bereinigen und Verpacken bleiben Ihre | Kostenlos, MIT oder BSD je nach Bibliothek |
| Konverter für die Kommandozeile | Geskriptete, wiederholbare Konvertierung von Dateien auf der Platte | Parsen, Ausgeben und wahlweise Verpacken; Bereinigen selten | Kostenlos, Open Source; Pandoc ist GPL |
| Statischer Seitengenerator | Eine Sammlung von Dokumenten, die aufeinander verweisen | Alle vier, dazu Navigation, über ein ganzes Verzeichnis | Kostenlos, Open Source |
| API, CLI oder CI-Action | Konvertierung in einem Build ohne Browser | Alle vier, wenn der Dienst es tut; der Punkt ist, keine Installation auf dem Runner | Mit TransformPipe kostenlos; anderswo unterschiedlich |
| Der Export eines Editors | Die Datei, die Sie ohnehin offen haben | Parsen und Ausgeben, das Verpacken hängt ganz an der Erweiterung | Kostenlos für VS Code; Desktop-Editoren unterschiedlich, beim Hersteller nachsehen |

## Wo Sie die Konvertierung laufen lassen

### Ein Konverter im Browser — alle vier Stufen, eine Datei, kein Upload

Ein Konverter, der im Browser läuft, macht das Parsen, das Ausgeben, das Bereinigen und das Verpacken auf Ihrem eigenen Rechner und gibt Ihnen eine fertige .html-Datei. Abgemeldet wird die Datei nirgendwohin gesendet: sie wird lokal gelesen, konvertiert und dargestellt, was Sie überprüfen können, indem Sie dem Netzwerk-Tab beim Nichtstun zusehen, während es arbeitet.

| Vorteile | Nachteile |
| --- | --- |
| Erzeugt ein vollständiges Dokument, kein Fragment | Ein Dokument auf einmal, oder mehrere zu einem verkettet |
| Nichts wird hochgeladen, die Quelle bleibt also auf Ihrem Rechner | Eine sehr große Datei ist an den Speicher des Rechners gebunden |
| Bereinigt gegen eine feste Positivliste, bevor Sie die Ausgabe überhaupt öffnen | Keine Vorlagensprache, die Verpackung ist also die des Werkzeugs, nicht Ihre |
| Keine Installation und nichts zu konfigurieren | Kein Build-Schritt: es muss jemand davorsitzen |

**Preis:** kostenlos. Ein Konto bringt Verlauf, Freigaben und eine API, ebenfalls kostenlos.

**Technische Details und Funktionen**

- GitHub Flavored Markdown in der Parse-Stufe: Tabellen, Aufgabenlisten, Durchgestrichenes, Autolinks, eingezäunter Code
- Überschriften-IDs tragen ein `doc-`-Präfix, sie überleben also browserseitiges wie serverseitiges Bereinigen
- Der Export ist eigenständig: Doctype, Head, Zeichensatz, Viewport, eingebettetes `<style>`, keine externen Anfragen
- Eine Ansicht „HTML-Quelltext", damit Sie die Verpackung lesen und sehen können, was aus rohem HTML geworden ist, bevor Sie es verschicken
- Herunterladen als `.html`, `.md` oder reiner Text, oder als PDF über den Druckdialog des Browsers — und der Text-Download trifft seine eigenen Entscheidungen über Überschriften, Links und Tabellen, was [Markdown auf reinen Text abzuflachen kostet](/blog/markdown-to-plain-text)

**Wer sollte es verwenden?** Jeder, dessen nächster Schritt „das an eine Person schicken" ist, und jeder, der ein Dokument konvertiert, das er lieber nicht hochlädt — einen Vertrag, eine Patientennotiz, einen unveröffentlichten Plan.

### Eine Bibliothek im eigenen Code — zwei Stufen, und zwei bleiben Ihnen

marked und markdown-it in JavaScript, Python-Markdown und markdown-it-py in Python, Goldmark in Go, commonmark.js, wenn Sie das Referenzverhalten brauchen. Diese erledigen Parsen und Ausgeben ordentlich und hören dort auf, mit Absicht: eine Bibliothek weiß nicht, ob ihre Ausgabe in eine bestehende Seite oder in eine eigenständige Datei geht, sie kann Ihre Verpackung also nicht schreiben — und sie weiß nicht, ob die Eingabe vertrauenswürdig ist, die meisten bereinigen also nicht stillschweigend.

| Vorteile | Nachteile |
| --- | --- |
| Vollständige Kontrolle über die Optionen: Dialekt, Umbrüche, Typografie, Überschriften-IDs | Bereinigen ist Ihre Aufgabe, und das Auslassen ist lautlos |
| Schnell genug, um pro Anfrage zu laufen | Verpacken ist Ihre Aufgabe, und ohne sie sieht das Fragment kaputt aus |
| Erweiterungspunkte für eigene Knotenausgabe | Zwei Bibliotheken, zwei Dialekt-Voreinstellungen, zwei Sätze Fehler |
| In der eigenen Testsuite prüfbar | Die Sicherheitsentscheidung gehört jetzt Ihnen |

**Preis:** kostenlos, Open Source. marked und markdown-it sind MIT-lizenziert; Python-Markdown und commonmark.js sind BSD-lizenziert.

**Technische Details und Funktionen**

- markdown-it maskiert rohes HTML standardmäßig, was die sichere Voreinstellung ist; marked lässt es durch und dokumentiert, dass man es mit DOMPurify kombinieren soll
- Beide bieten eine `breaks`-Option für sanfte Zeilenumbrüche und Optionen für Überschriften-IDs
- markdown-it gibt Ihnen einen Token-Strom und marked einen Lexer, Sie können den Baum also vor der Ausgabe untersuchen
- Die Erweiterungen von Python-Markdown decken Tabellen, Fußnoten und Attributlisten ab

**Wer sollte es verwenden?** Entwickler, die Markdown innerhalb einer Anwendung darstellen, in der das umgebende Dokument schon existiert — ein Kommentarfeld, eine Vorschau, ein Dokumentations-Build mit eigener Vorlage.

### Die Kommandozeile — wiederholbar, skriptbar und schweigsam zur Sicherheit

Pandoc ist die allgemeine Antwort, und die meisten Sprachen bringen einen CLI-Aufsatz um ihre Bibliothek mit. Ein Konverter für die Kommandozeile ist das richtige Werkzeug, wenn dieselbe Konvertierung nächste Woche wieder passieren muss, über Dateien, die auf der Platte liegen, ohne einen Menschen in einem Browser-Tab.

| Vorteile | Nachteile |
| --- | --- |
| Wiederholbar und skriptbar über viele Dateien | Braucht eine Installation und ein Terminal |
| Pandocs `--standalone` schreibt ein echtes Dokument, und `--embed-resources` bettet Assets ein | Rohes HTML geht durch: Bereinigen ist nicht Teil der Aufgabe |
| Vorlagen geben genaue Kontrolle über die Verpackung | Seine Markdown-Dialekte weichen von GFM auf Weisen ab, die Leute überraschen |
| Läuft, wo es überhaupt keinen Browser gibt | Mehr Werkzeug, als eine einzelne Datei meist braucht |

**Preis:** kostenlos, Open Source. Pandoc ist GPL-lizenziert.

**Technische Details und Funktionen**

- Ausdrückliche Wahl des Lesers, Sie können also `commonmark`, `gfm` oder Pandocs eigenen Dialekt verlangen statt zu raten
- `--standalone` für die Verpackung, `--template` für Ihre eigene, `--embed-resources` für eine Ausgabe in einer Datei
- `--sandbox` beschränkt den Dateizugriff, wenn Sie Dateien konvertieren, denen Sie nicht trauen
- Schreibt aus derselben Quelle andere Formate als HTML, was der eigentliche Grund ist, es zu installieren

**Wer sollte es verwenden?** Jeder, der planmäßig, in großer Zahl oder in Formate jenseits von HTML konvertiert.

### Ein statischer Seitengenerator — alle vier Stufen, über ein Verzeichnis

Hugo, Eleventy, MkDocs, Docusaurus und Jekyll verwandeln alle Markdown in HTML, und keiner davon ist ein Konverter. Sie sind Build-Systeme: sie erwarten ein Verzeichnis, eine Konfigurationsdatei, Vorlagen und ein Deployment-Ziel, und sie geben Navigation, Suche und Querverweise zurück.

| Vorteile | Nachteile |
| --- | --- |
| Eine einheitliche Verpackung über jede Seite | Enormer Aufwand für eine einzige Datei |
| Navigation, Feeds und Verweise zwischen Dokumenten | Eine Konfigurationsdatei und ein Build-Schritt, für immer zu pflegen |
| Themes, damit die Stylesheet-Frage beantwortet ist | Das Ergebnis ist eine Website zum Ausrollen, kein Dokument zum Mailen |
| Der Parser ist festgenagelt und bekannt | Der Markdown-Dialekt ist die Wahl des Generators, nicht Ihre |

**Preis:** kostenlos, Open Source.

**Technische Details und Funktionen**

- Der Generator besitzt Stufe vier vollständig, weshalb jede Seite gleich aussieht
- Frontmatter ist hier Daten, nicht Inhalt: es speist die Vorlage statt im Text zu erscheinen
- Die meisten nageln einen bestimmten Parser fest — Hugo verwendet Goldmark, MkDocs Python-Markdown — der Dialekt ist also eine Eigenschaft des Generators

**Wer sollte es verwenden?** Jeder, der eine Sammlung von Dokumenten veröffentlicht, die aufeinander verweisen. Für eine Datei und einen Empfänger ist es die völlig falsche Form.

### Eine API, ein CLI oder eine CI-Action — Konvertierung ohne Browser im Spiel

Wenn die Konvertierung in einem Pull Request, einem nächtlichen Build oder im Werkzeugaufruf eines Assistenten passieren muss, ist niemand da, der klicken könnte. Was Sie brauchen, sind dieselben vier Stufen, erreichbar über eine Leitung oder als Programm, dem der Runner schon vertraut.

| Vorteile | Nachteile |
| --- | --- |
| Keine Installation auf dem Build-Runner | Ein Netzwerksprung, es sei denn, Sie nehmen das CLI |
| Dieselbe Positivliste und Verpackung wie im interaktiven Werkzeug, die Ausgabe stimmt also überein | Sie hängen davon ab, dass ein Dienst läuft |
| Passt in eine Pull-Request-Prüfung oder einen Release-Job | Nicht interaktiv: Sie lesen die Ausgabe im Nachhinein, in einem Artefakt |

**Preis:** kostenlos mit der API, dem CLI, der GitHub Action und dem MCP-Server von TransformPipe; anderswo unterschiedlich.

**Technische Details und Funktionen**

- Das CLI ist frei von Abhängigkeiten, ein Runner braucht also keinen Installationsschritt
- Dieselbe Konvertierung ist über einen REST-Aufruf, eine Shell, einen Workflow-Schritt oder einen Assistenten erreichbar
- Weil alle vier Stufen serverseitig laufen, ist die Ausgabe das verpackte, bereinigte Dokument statt eines Fragments

**Wer sollte es verwenden?** Teams, die als Teil eines Builds konvertieren — Release Notes, generierte Dokumentation, eine dargestellte Vorschau an einem Pull Request.

### Der Export eines Editors — bequem, und die Verpackung ist ein Glücksspiel

VS Code bringt eine Markdown-Vorschau auf Basis von markdown-it mit, Erweiterungen ergänzen den Export. Desktop-Editoren exportieren ebenfalls HTML. Wenn die Datei schon vor Ihnen offen ist, ist das der kürzeste Weg von Text zu Seite.

| Vorteile | Nachteile |
| --- | --- |
| Schon installiert und schon auf die Datei gerichtet | Die Formatierung der Vorschau ist meist nicht die exportierte |
| Der Dialekt der Vorschau ist bekannt, weil der Parser benannt ist | Die Exportqualität hängt ganz an der gewählten Erweiterung |
| Kein Upload | Bereinigen gehört im Allgemeinen nicht dazu |
| Passt für eine README oder eine Notiz | Keine Pipeline: es konvertiert, was offen ist |

**Preis:** kostenlos für VS Code und seine Erweiterungen; Desktop-Editoren werden von ihren Herstellern bepreist, sehen Sie also auf der Seite des Herstellers nach.

**Technische Details und Funktionen**

- Die Vorschau von VS Code verwendet markdown-it, folgt also CommonMark mit den eigenen Erweiterungen des Editors darüber
- Export-Erweiterungen sind uneinig darüber, ob sie Stile einbetten, verlinken oder ein Fragment schreiben
- Was die Vorschau zeigt, ist vom Theme des Editors formatiert, und das wird nicht mit der Datei ausgeliefert

**Wer sollte es verwenden?** Entwickler, die im Vorbeigehen eine Datei konvertieren und das Ergebnis woanders öffnen, bevor sie es verschicken.

## Wo die offensichtliche Wahl scheitert, und was das kostet

Die offensichtliche Wahl für eine Datei ist ein Konverter im Browser, und sie ist oft genug die richtige, dass es die Fehlfälle wert sind, benannt zu werden.

**Er konvertiert ein Dokument, kein Projekt.** Verketten Sie mehrere Dateien zu einer, und Sie erhalten ein langes Dokument; Sie erhalten keine Website mit Seitenleiste. Wenn die Antwort Navigation braucht, ist der Konverter nur die erste Stufe eines statischen Seitengenerators, und etwas anderes zu behaupten kostet Sie später einen Neubau.

**Der Rechner ist die Grenze.** Konvertierung im Browser heißt, dass Parsen, Ausgeben und Bereinigen alle in einem Tab passieren. Eine buchlange Datei mit hunderten Bildern ist an den Speicher dieses Tabs gebunden, und der Fehler ist ein Ladekringel, keine Fehlermeldung. Serverseitige oder Kommandozeilen-Konvertierung hat diese Decke nicht.

**Es gibt nichts zu vergleichen.** Eine Konvertierung, die jemand von Hand ausführt, liegt nicht in der Versionsverwaltung, kann nächsten Monat nicht identisch wiederholt werden und kann keinen Build scheitern lassen. Wenn dasselbe Dokument wiederholt veröffentlicht wird, ist der Klick ein Risiko, und API, CLI oder Action sind die Abhilfe.

**Eine eigenständige Datei ist eine große Datei.** Stile einzubetten, und Bilder als Data-URIs, kann die Größe vervielfachen. Im Gegenzug erscheint sie offline identisch und fragt nichts an. Das ist ein Tauschgeschäft, und für eine Seite, die von einer Website ausgeliefert wird — wo ein gemeinsam gecachtes Stylesheet der ganze Punkt ist — ist es die falsche Seite davon.

**Das Bereinigen nimmt Dinge, die Sie wollten.** Eine feste Positivliste kann nicht wissen, dass das Embed in Ihrem Dokument Ihres war. Diagramme, eingebettete Player und handgeschriebene HTML-Container kommen als Lücken heraus. Der ehrliche Arbeitsablauf ist: konvertieren, die Ausgabe lesen und bewusst wieder einsetzen, was die Positivliste entfernt hat.

**Die Verpackung ist der Geschmack von jemand anderem.** Keine Vorlagensprache heißt keine Hausschrift, kein Logo, kein Deckblatt. Für ein Dokument, das unter einer Marke an einen Kunden geht, ist das eine echte Einschränkung, und ein Generator mit Vorlagen ist die Antwort, sogar für eine Seite.

**Frontmatter ist eine Parser-Entscheidung, die niemand dokumentiert.** Eine Datei aus einem statischen Seitengenerator oder einer Notiz-App beginnt meist mit einem YAML-Kopf, und keine Markdown-Spezifikation sagt, was ein Kopf ist. Er wird also in Stufe eins behandelt, von dem, was der Parser zufällig tut: ihn verbrauchen oder ihn als gewöhnlichen Text behandeln. Das zweite Ergebnis ist das, das Sie sehen, denn der Kopf kommt im dargestellten Dokument als Inhalt an — deshalb sollten Sie eine Datei aus einem Verzeichnis konvertieren, bevor Sie das Verzeichnis konvertieren.

**Überschriften-IDs stimmen vielleicht nicht mit denen überein, die Ihre Links annehmen.** Ein Präfix an den IDs ist die richtige Antwort für die Sicherheit und die falsche für Anker-Links, die aus GitHub kopiert wurden. Konvertieren Sie ein Dokument und klicken Sie Ihre eigenen internen Links, bevor Sie hundert vertrauen.

## Wie Sie wählen

1. **Fangen Sie beim Ziel an, nicht beim Format.** Ein Dokument für einen Menschen braucht alle vier Stufen samt Verpackung; eine Vorschau in Ihrer Anwendung braucht nur zwei, weil die Seite schon existiert. Wählen Sie für das falsche Ziel, und am Ende schreiben Sie einen `<head>` von Hand.
2. **Passen Sie den Dialekt zur Datei, vor allem anderen.** Wenn das Dokument Tabellen, Aufgabenlisten oder Fußnoten hat, bestätigen Sie, dass der Parser sie umsetzt — denn eine fehlende Erweiterung erzeugt plausibel aussehende Prosa statt eines Fehlers, und Sie werden es nicht bemerken, bis ein Leser es tut.
3. **Entscheiden Sie über das Bereinigen, bevor Sie eine Datei konvertieren, die Sie nicht geschrieben haben.** Für eigene Notizen ist es kein Thema. Für eine README aus dem Netz, das Dokument eines Kunden oder die Ausgabe eines Modells bereinigt entweder der Konverter oder Sie — und wenn keiner es tut, heißt das Ergebnis zu öffnen, es auszuführen.
4. **Bestehen Sie auf einer Verpackung, die Sie lesen können.** Öffnen Sie den HTML-Quelltext und sehen Sie nach dem Doctype, dem Zeichensatz, dem Viewport-Tag und dem Ort der Stile. Diese vier Zeilen sagen fast jede „bei dir sah es doch gut aus"-Beschwerde voraus, die Sie sonst später bekommen.
5. **Entscheiden Sie, ob die Datei das Netz brauchen darf.** Wenn sie gemailt, archiviert oder auf einem gesperrten Laptop geöffnet wird, betten Sie alles ein; eine einzige verlinkte Schrift von einem CDN genügt, damit sie bei dem Menschen, dem Sie sie geschickt haben, anders erscheint.
6. **Rechnen Sie die Installationen gegen die Häufigkeit.** Eine einmalige Konvertierung sollte keinen Paketmanager verlangen; ein nächtlicher Build sollte keinen Browser-Tab und keinen Menschen darin verlangen. Das falsch herum zu machen kostet entweder einen Nachmittag oder eine wiederkehrende Pflicht.
7. **Testen Sie, indem Sie die Ausgabe woanders öffnen.** Nicht in der Vorschau des Werkzeugs — ein anderer Browser, ein anderer Rechner, das Netz aus, einmal auf einem Telefon. Dieser eine Test erwischt Fragmente, fehlende Zeichensätze, CDN-Links und kaputte Bildpfade gleichzeitig, und er kostet eine Minute. Wenn Sie noch zwischen Werkzeugen wählen, [steht der ehrliche Vergleich in einem eigenen Text](/blog/best-markdown-to-html-converters).

## Fazit

Ein Markdown-zu-HTML-Konverter ist eine Pipeline aus vier Stufen, und jede enttäuschende Konvertierung ist eine benennbare Stufe, die etwas Vernünftiges tut, das Sie nicht wollten: ein Parser mit kleinerem Dialekt, ein Renderer, der IDs erfindet, die nicht zu Ihren Links passen, ein Bereiniger, der ein Embed entfernt, oder eine Verpackung, die nie geschrieben wurde, weil eine Bibliothek es zu Recht abgelehnt hat zu raten. Lesen Sie die Ausgabe statt der Funktionsliste, und lesen Sie sie in der HTML-Quelltextansicht, wo Doctype, Zeichensatz und überlebendes rohes HTML alle auf einmal sichtbar sind. Wenn Sie alle vier Stufen in einem Durchgang wollen, auf Ihrem eigenen Rechner, mit einer eigenständigen Datei am Ende, ist [die Markdown-zu-HTML-Konvertierung von TransformPipe](/) kostenlos, braucht keine Installation und lädt nichts hoch, solange Sie abgemeldet sind.

## FAQ

### Was macht ein Markdown-zu-HTML-Konverter tatsächlich mit meiner Datei?

Er zerlegt den Text in einen Baum typisierter Knoten, läuft diesen Baum ab, um HTML-Tags zu schreiben, filtert das Ergebnis gegen eine Positivliste aus Tags und Attributen und verpackt das Fragment in ein vollständiges Dokument. Die erste Stufe entscheidet, welche Syntax überhaupt existiert, und die letzte entscheidet, ob die Datei bei jemand anderem korrekt öffnet. Ein Werkzeug kann jede Teilmenge der vier erledigen und sich trotzdem Konverter nennen.

### Warum erzeugt dieselbe Markdown-Datei in zwei Werkzeugen unterschiedliches HTML?

Weil zwei der Stufen Entscheidungen enthalten, die keine Spezifikation trifft. Die Parser laufen möglicherweise in verschiedenen Dialekten, einer sieht also eine Tabelle, wo der andere einen Absatz sieht — und die Renderer erfinden Überschriften-IDs, Codeblock-Klassen und Checkbox-Markup nach ihren eigenen Konventionen. Beide Ausgaben können korrektes HTML sein und sich Zeile für Zeile widersprechen.

### Muss ich Markdown bereinigen, das ich selbst geschrieben habe?

Für eine Datei, die Sie verfasst haben und nur selbst öffnen werden, nein — es steht nichts darin, was Sie nicht hineingeschrieben haben. Bereinigen Sie in dem Moment, in dem das Dokument von jemand anderem kommt, aus mehreren Quellen zusammengesetzt ist oder anderen Leuten ausgeliefert wird, denn Markdown erlaubt rohes HTML und rohes HTML erlaubt Skripte. Eine sichere Datei zu bereinigen kostet nichts; eine unsichere nicht zu bereinigen kostet, den Code ihres Autors auszuführen.

### Warum sind meine Aufgabenlisten-Checkboxen nach der Konvertierung verschwunden?

Fast immer, weil die Positivliste des Bereinigers `input` nicht enthält. GFM gibt ein angekreuztes Element als `<input type="checkbox" checked disabled>` aus, und eine vorsichtige Positivliste verwirft Formularelemente pauschal. Ein Konverter, der Aufgabenlisten richtig unterstützt, erlaubt `input` mit `type` auf `checkbox` festgenagelt und nichts weiter daran.

### Was muss im Head stehen, bevor eine HTML-Datei korrekt öffnet?

Ein Doctype in der ersten Zeile, damit der Browser nicht in den Quirks-Modus fällt; `<meta charset="utf-8">` früh genug, um gesehen zu werden, damit Umlaute und Striche nicht zu Rauschen werden; ein Titel, denn der benennt den Tab und die gespeicherte Datei; ein Viewport-Meta-Tag, damit sie auf einem Telefon lesbar ist; und Stile, eingebettet, wenn die Datei reisen muss. Fehlt eines davon, öffnet die Datei trotzdem — nur nicht so, wie Sie sie gesehen haben.

### Warum funktionieren meine Anker-Links nach der Konvertierung nicht mehr?

Weil Überschriften-IDs die Erfindung des Renderers sind, nicht Ihre, und die Slug-Regeln sich unterscheiden. Ein Werkzeug macht aus „Release 2.1" `release-21`, ein anderes `release-2.1`, und ein Werkzeug, das IDs zur Sicherheit mit einem Präfix versieht, erzeugt wieder etwas anderes. Konvertieren Sie ein Dokument und klicken Sie jeden internen Link, bevor Sie dem Schema vertrauen.

### Verändert die Umwandlung von Markdown in HTML die Wörter?

Sie kann es. Typografische Optionen schreiben gerade Anführungszeichen als typografische und `--` als Halbgeviertstrich um, eine `breaks`-Option macht aus einzelnen Zeilenumbrüchen `<br>`, und nicht referenzierte Link-Definitionen verschwinden vollständig. Der Text ist für einen Leser derselbe und für ein Terminal nicht derselbe — weshalb Kommandozeilen in einem konvertierten Dokument es wert sind, zeichenweise geprüft zu werden.
