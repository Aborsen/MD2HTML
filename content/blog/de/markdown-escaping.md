---
title: "Markdown-Escape-Zeichen: die vollständige Referenz"
description: "Welche Zeichen ein Backslash maskiert, wo Maskieren nichts bewirkt, wann eine Zeichenreferenz besser passt, und die Fälle, die Ihren Text leise umschreiben"
date: 2026-09-06
tag: Syntax
keywords: markdown escape zeichen, markdown backslash, sternchen in markdown maskieren, markdown unterstrich betonung, pipe in markdown tabelle maskieren, markdown zeichenreferenzen, markdown sonderzeichen, markdown unterstrich maskieren, snake_case markdown, markdown backtick maskieren
---

Ein Sternchen, das Sie wörtlich gemeint haben, macht die halbe Zeile kursiv. Eine Jahreszahl am Zeilenanfang wird zu Punkt 1.986 einer Liste. Ein Windows-Pfad verliert auf dem Weg zur Seite einen seiner Backslashes, und niemand merkt es, bis jemand ihn in ein Terminal kopiert. Jeder dieser Fälle ist ein Zeichen, das seine dokumentierte Arbeit an einer Stelle tut, an der Sie nicht daran gedacht haben.

### Kurzfassung

Ein Backslash maskiert jedes der **zweiunddreißig ASCII-Satzzeichen** und nichts sonst — vor einem Buchstaben, einer Ziffer, einem Leerzeichen oder einem Zeichen außerhalb von ASCII ist er nur ein Backslash, gedruckt. Maskieren bewirkt **überhaupt nichts** innerhalb einer Code-Spanne, eines eingezäunten oder eingerückten Codeblocks, eines Autolinks oder rohen HTMLs — und das ist die Regel, auf die sich fast jedes Maskierungsproblem am Ende zurückführt. **Zeichenreferenzen** (`&amp;`, `&lt;`, `&#42;`, `&copy;`) sind der andere Weg und der einzige, der dort funktioniert, wo ein Backslash tot ist oder wo das Zeichen kein ASCII-Satzzeichen ist. Die meisten Zeichen müssen nur in einer Position maskiert werden — ein Doppelkreuz am Zeilenanfang, eine Pipe in einer Tabellenzelle — und eine Code-Spanne ist die portable Antwort auf alles davon, zum Preis von Text in Festbreitenschrift.

Die Regeln kommen von einem Ort. CommonMark ist die Spezifikation, die sie festlegt, und Version 0.31.2 vom 28. Januar 2024 ist die aktuelle (geprüft auf spec.commonmark.org, 9. September 2026). Sie sagt zwei Sätze über Backslashes, die zusammen jeden Fall auf dieser Seite entscheiden: jedes ASCII-Satzzeichen darf mit einem Backslash maskiert werden, und Backslashes vor anderen Zeichen werden als wörtliche Backslashes behandelt.

Was eine Spezifikation nicht beheben kann: Maskieren scheitert in beide Richtungen, und keines der beiden Scheitern kündigt sich an. Zu wenig maskiert, und das Zeichen wird ausgelegt: Ihre Prosa bekommt Betonung, eine Überschrift, eine Liste, einen Link. Zu viel maskiert, und der Backslash verschwindet trotzdem aus der Ausgabe — `\:` erscheint als einfacher Doppelpunkt — die Datei füllt sich also mit Backslashes, die nichts tun, und der nächste Mensch, der sie bearbeitet, kann nicht erkennen, welche davon zählen. Beides sieht in einer Vorschau, die Ihrem Parser zustimmt, gut aus und überall sonst falsch.

Es gibt eine kürzere Fassung dieses Materials in [dem Text über Zeilenumbrüche und Listen](/blog/markdown-line-breaks-and-lists), der die Zeichen behandelt, die mit Listenmarkierungen kollidieren, und die zwei Arten, eine Zeile zu brechen. Diese Seite ist der Rest: die ganze maskierbare Menge, die vier Zusammenhänge, in denen ein Backslash tot ist, Zeichenreferenzen, was ein Konverter für Sie maskiert, und die Handvoll praktischer Fälle — Vorlagensyntax, Windows-Pfade, Dollarzeichen, `snake_case` — die fast alle Beschwerden erzeugen.

## Was eine Backslash-Maskierung tut, und die zweiunddreißig Zeichen, bei denen sie wirkt

Ein Backslash vor einem ASCII-Satzzeichen nimmt diesem Zeichen seine Bedeutung und entfernt sich selbst aus der Ausgabe. Die maskierbare Menge ist fest, und sie sind diese zweiunddreißig: ``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`` (geprüft auf spec.commonmark.org, 9. September 2026). Das ist jedes druckbare ASCII-Zeichen, das weder ein Buchstabe noch eine Ziffer noch ein Leerzeichen ist.

Alles andere ist ein wörtlicher Backslash. `\q` erscheint als `\q`, Backslash inklusive. Ebenso `\3`, und ebenso ein Backslash vor einem Geviertstrich oder einem typografischen Anführungszeichen, denn das sind Satzzeichen, aber keine ASCII-Satzzeichen. Das ist die Hälfte der Regel, die Leute vergessen, und der Grund, warum ein Windows-Pfad meist unversehrt überlebt und dann an genau einer Stelle genau einen Trenner verliert.

Zwei Folgen, die man vor der Tabelle festhalten sollte. Erstens ist Maskieren zeichenweise, nicht bereichsweise: es gibt in Markdown keine Markierung „ab hier wörtlicher Text", `\*\*nicht fett\*\*` sind also vier Backslashes für eine Wirkung. Zweitens ist eine Maskierung tot, aber nicht unsichtbar — sie verschwindet von der dargestellten Seite und bleibt in der Datei, was heißt, dass übermaskiertes Markdown für einen Menschen als Rauschen zu lesen ist und für eine Maschine identisch konvertiert.

| Zeichen | Was es unmaskiert bedeutet | Wo es das bedeutet | Wie man es wörtlich schreibt |
| :--- | :--- | :--- | :--- |
| `\` | Das Maskierungszeichen selbst | Überall im Text | `\\` |
| `` ` `` | Öffnet eine Code-Spanne | Überall inline | ``\` ``, oder den Lauf in mehr Backticks packen |
| `*` | Betonung und starke Betonung; ein Listenpunkt; eine Trennlinie | Überall inline, auch im Wort; am Zeilenanfang | `\*` |
| `_` | Betonung und starke Betonung; eine Trennlinie | Nur an Wortgrenzen; am Zeilenanfang | `\_` — Unterstriche im Wort brauchen nichts |
| `#` | Eine ATX-Überschrift; eine schließende Überschriftenfolge | Am Zeilenanfang, bis drei Leerzeichen vom Rand; am Ende einer Überschrift | `\#` |
| `>` | Ein Blockzitat | Am Zeilenanfang | `\>` |
| `-` | Ein Listenpunkt; eine Setext-`<h2>`-Unterstreichung; eine Trennlinie; ein Frontmatter-Zaun | Am Zeilenanfang | `\-` |
| `+` | Ein Listenpunkt | Am Zeilenanfang | `\+` |
| `=` | Eine Setext-`<h1>`-Unterstreichung | Eine Zeile direkt unter einem Absatz | `\=` |
| `.` | Ein Trenner für geordnete Listen, nach Ziffern | Am Zeilenanfang | `1986\.` |
| `)` | Ein Trenner für geordnete Listen, nach Ziffern; das Ende eines Linkziels | Am Zeilenanfang; innerhalb von `(…)` | `1986\)`, `\)` |
| `(` | Der Anfang eines Linkziels | In einem Link | `\(` |
| `[` `]` | Ein Link, Bild, Verweis oder ein Fußnotenlabel; eine Aufgabenlisten-Markierung | Überall inline | `\[` `\]` |
| `!` | Ein Bild, wenn `[` folgt | Überall inline | `\!` |
| `<` | Ein Autolink, ein rohes HTML-Tag oder ein HTML-Block | Überall inline; am Zeilenanfang | `\<`, oder `&lt;` |
| `>` | Das Ende eines Autolinks oder eines rohen HTML-Tags | Innerhalb von `<…>`, wo ein Backslash tot ist | `&gt;` in Prosa; Prozentkodierung innerhalb einer URL |
| `&` | Der Anfang einer Zeichenreferenz | Überall inline | `&amp;` |
| `|` | Eine Zellengrenze in einer GFM-Tabelle | Nur innerhalb einer Tabellenzeile — auch innerhalb einer Code-Spanne | `\|` |
| `~` | Durchgestrichenes in GFM, paarweise; ein alternativer Code-Zaun | Überall inline; am Zeilenanfang | `\~` |
| `"` `'` | Nichts, außer typografische Zeichensetzung ist an; grenzen einen Linktitel ab | Innerhalb von `(… "…")` | `\"`, oder `&quot;` |
| `$` | Nichts in CommonMark oder GFM; ein Mathe-Trenner, wo diese Erweiterung an ist | Nur mit einer Mathe-Erweiterung | `\$`, oder eine Code-Spanne |
| `{` `}` | Nichts in CommonMark; Attributblöcke und Vorlagensyntax in anderen Werkzeugen | Nur in diesen Werkzeugen | `\{` `\}`, oder ein eingezäunter Block |
| `:` | Nichts in CommonMark; Fußnotendefinitionen und Emoji-Kurzcodes anderswo | Nur in diesen Werkzeugen | `\:` |
| `%` `,` `/` `;` `?` `@` `^` | Nichts, nirgends, in keinem verbreiteten Dialekt | Nirgends | Maskierbar, nie nötig |

Die vierte Spalte ist, wo die Arbeit liegt. Sechs dieser Zeichen — `#`, `>`, `-`, `+`, `.` und `)` — tragen ihre Bedeutung nur am Zeilenanfang, ein Doppelkreuz mitten im Satz ist also ein Doppelkreuz und ein Bindestrich zwischen zwei Wörtern ein Bindestrich. Sie überall zu maskieren ist eine Angewohnheit, die man von Werkzeugen übernimmt, die vorsorglich maskieren, und sie kostet Sie eine Datei voller Backslashes ohne jede Änderung an der Ausgabe.

## Wo Maskieren überhaupt nichts bewirkt

Das ist die Regel, die die meiste Verwirrung erzeugt, und sie ist ein einziger Satz in der Spezifikation: Backslash-Maskierungen funktionieren nicht in Codeblöcken, Code-Spannen, Autolinks oder rohem HTML (geprüft auf spec.commonmark.org, 9. September 2026). In allen vieren ist ein Backslash Inhalt. Er wird gedruckt.

Die Reihenfolge, in der Leute das entdecken, ist immer dieselbe. Sie maskieren ein Zeichen, es kommt trotzdem falsch heraus, also packen sie es zusätzlich in Backticks — und nun steht der Backslash auf der Seite.

```markdown
a `\*` span
```

erscheint als das Wort „a", dann eine Code-Spanne mit `\*`, dann das Wort „span" — der Backslash sichtbar auf der Seite, denn innerhalb der Code-Spanne hat er seine Kraft verloren und seine Breite behalten. Die Abhilfe ist, die Maskierung zu löschen, nicht eine weitere hinzuzufügen.

**Code-Spannen und Codeblöcke.** Alles zwischen den Backticks, oder innerhalb eines Zauns, oder um vier Leerzeichen eingerückt, ist wörtlicher Text. `\\` bleibt zwei Backslashes; `\_` bleibt ein Backslash und ein Unterstrich. Das ist eine Funktion, und es ist der Grund, warum eine Code-Spanne der richtige Behälter für ein Glob-Muster, einen regulären Ausdruck, eine `printf`-Formatzeichenkette oder einen Windows-Pfad ist — siehe [was eingezäunte Blöcke sonst auslegen und nicht auslegen](/blog/code-blocks-in-markdown) für die Info-String-Seite davon.

**Autolinks.** Ein Autolink ist eine URL zwischen spitzen Klammern, und sein Inhalt ist eine URL, kein Markdown. Maskieren Sie etwas darin, und der Backslash wird Teil der Adresse: `<https://example.com/a\_b>` erzeugt einen Link, dessen `href` `%5C` enthält, die Prozentkodierung eines Backslashes. Der Linktext sieht fast richtig aus und das Ziel ist falsch, was die schlechteste verfügbare Kombination ist.

**Rohes HTML.** Innerhalb eines Tags ist ein Backslash ein Backslash. Versuchen Sie, ein Anführungszeichen in einem Attribut zu maskieren — `<div title="a\"b">` — und das Attribut endet am zweiten Anführungszeichen mit einem verirrten Backslash darin, genau wie in einem Browser. HTML-Attribute werden mit Zeichenreferenzen maskiert, `&quot;`, und nie mit Backslashes.

**HTML-Blöcke.** Ein Block rohen HTMLs wird als Ganzes durchgelassen, ohne Inline-Parsen darin, es braucht darin also von Anfang an nichts maskiert zu werden. Ein Sternchen in einem HTML-Block ist ein Sternchen. Ein Backslash, den Sie vorsichtshalber hinzufügen, wird gedruckt.

| Zusammenhang | Was ein Backslash dort tut | Was Sie stattdessen nehmen |
| :--- | :--- | :--- |
| Code-Spanne, `` `…` `` | Wird gedruckt, als Inhalt | Nichts — die Spanne schützt den Text schon |
| Eingezäunter Block | Wird gedruckt, als Inhalt | Nichts |
| Eingerückter Block, vier Leerzeichen | Wird gedruckt, als Inhalt | Nichts |
| Autolink, `<…>` | Wird Teil der URL, prozentkodiert | Das Zeichen richtig prozentkodieren |
| Rohes HTML-Tag oder -Attribut | Wird gedruckt und bricht das Attribut | Eine Zeichenreferenz: `&quot;`, `&amp;` |
| HTML-Block | Wird gedruckt | Nichts — Inline-Syntax wird dort nicht geparst |
| Linkziel, `(…)` | Funktioniert: `\(` und `\)` werden beachtet | Ein Backslash, oder Prozentkodierung |
| Linktitel, `"…"` | Funktioniert: `\"` wird beachtet | Ein Backslash |
| Der Info-String eines Zauns | Funktioniert | Ein Backslash |

Die letzten drei Zeilen sind das Spiegelbild der ersten sechs, und sie überraschen Leute in die andere Richtung: Maskierungen funktionieren in Linkzielen, Linktiteln und Info-Strings. Eine Klammer innerhalb einer URL kann maskiert statt prozentkodiert werden, und ein Titel mit einem Anführungszeichen darf eines tragen.

Es gibt genau eine dokumentierte Ausnahme von der Code-Spannen-Regel, und sie gehört GitHub Flavored Markdown statt CommonMark. Die Tabellen-Erweiterung sagt, eine Pipe im Inhalt einer Zelle sei durch Maskieren aufzunehmen, auch innerhalb anderer Inline-Spannen (geprüft auf github.github.com, 9. September 2026, Spezifikationsversion 0.29-gfm vom 6. April 2019). Der Grund ist mechanisch: der Tabellenparser teilt eine Zeile an den Pipes, bevor irgendein Inline-Parsen passiert, `\|` muss also in dieser früheren Stufe behandelt werden — und deshalb funktioniert es an der einen Stelle, die Maskierungen sonst nicht erreichen. Schreiben Sie `` `x \| y` `` in eine Zelle, und Sie erhalten eine Code-Spanne mit `x | y`. Schreiben Sie `` `x | y` ``, und Sie erhalten zwei Zellen.

## Zeichenreferenzen, und wann sie die bessere Antwort sind

Die zweite Art, ein wörtliches Zeichen zu schreiben, ist, seinen Codepunkt zu benennen. CommonMark erkennt drei Formen: `&` plus einen gültigen HTML5-Entitätsnamen plus `;`, `&#` plus eine bis sieben Dezimalstellen plus `;`, und `&#` plus `x` oder `X` plus eine bis sechs Hexadezimalstellen plus `;`. Ein ungültiger Codepunkt wird durch U+FFFD ersetzt, das Ersatzzeichen, und ein unbekannter Name bleibt als wörtlicher Text stehen (geprüft auf spec.commonmark.org, 9. September 2026).

Die Eigenschaft, die sie nützlich macht, ist eine Zeile aus demselben Abschnitt: Referenzen werden in Codeblöcken und Code-Spannen nicht erkannt, und sie können nicht für strukturelle Zeichen einstehen. `&#42;` ist in der Ausgabe ein wörtliches Sternchen und nie der Beginn einer Betonung; `&#35;` am Zeilenanfang ist ein Doppelkreuz, keine Überschrift. Wo ein Backslash eine Bedeutung entfernt, hatte eine Referenz nie eine zu entfernen — das Zeichen kommt an, nachdem der Parser fertig entschieden hat, was die Zeile ist.

| Referenz | Zeichen | Warum Sie danach greifen würden |
| :--- | :--- | :--- |
| `&amp;` | `&` | Die, die man nicht vermeiden kann: ein nacktes `&` könnte eine Referenz beginnen |
| `&lt;` `&gt;` | `<` `>` | Prosa über HTML, und überall, wo rohes HTML durchgelassen wird |
| `&quot;` | `"` | In einem HTML-Attribut, wo ein Backslash den Wert bricht |
| `&#42;` | `*` | Ein wörtliches Sternchen, das kein Parser als Betonung lesen kann |
| `&#95;` | `_` | Dasselbe für einen Unterstrich, in einem Dialekt mit Betonung im Wort |
| `&#124;` | `|` | Eine Pipe in einer Tabellenzelle, in einem Renderer, dessen `\|`-Behandlung Sie misstrauen |
| `&copy;` `&reg;` | `©` `®` | Keine ASCII-Satzzeichen, ein Backslash kann sie also ohnehin nicht maskieren |
| `&nbsp;` | Ein geschütztes Leerzeichen | „10 MB" oder „Abbildung 3" auf einer Zeile halten |
| `&#x2014;` | Ein Geviertstrich | Ein Zeichen, das Ihr Editor oder Ihre Tastatur unbequem macht |

Eine Referenz ist in vier Situationen die bessere Antwort. Wo ein Backslash tot ist — innerhalb rohen HTMLs oder in einem Attributwert. Wo das Zeichen kein ASCII-Satzzeichen ist, es also nichts zu maskieren gibt: `©`, `®`, `†`, ein geschütztes Leerzeichen, ein typografischer Strich. Wo die Datei durch ein Werkzeug läuft, das Backslashes entfernt oder verdoppelt, denn `&amp;` übersteht eine naive Zeichenkettenersetzung, die `\&` nicht übersteht. Und wo Sie wollen, dass das Zeichen gegen Dialektunterschiede immun ist, denn `&#42;` verhält sich in jedem Renderer gleich, der Referenzen überhaupt umsetzt.

Die Kosten sind echt und es wert, genannt zu werden. Eine Referenz ist HTML, sie ergibt also nur auf einem Weg Sinn, der in HTML endet: konvertieren Sie dieselbe Datei [nach reinem Text](/blog/markdown-to-plain-text) oder in ein Textprogramm, und ein Konverter, der Referenzen nicht auflöst, druckt `&nbsp;` als sechs sichtbare Zeichen. Referenzen sind in der Quelle unlesbar — niemand, der einen Absatz überfliegt, erkennt `&#8212;` auf einen Blick. Und sie sind eine kürzere Liste, als sie aussehen: nur Zeichen mit einem HTML5-Namen funktionieren in der benannten Form, erfundene Namen wie `&asterisk;` fallen also als Text durch.

## Die Zeichen, die nur in einer Position zählen

Das meiste Maskieren, das Leute betreiben, ist unnötig, denn die meisten dieser Zeichen sind nur irgendwo Bestimmtem besonders. Die Positionen zu lernen ist günstiger, als die Tabelle zu lernen.

**Am Zeilenanfang.** Hier wird die Blockstruktur entschieden, und hier ist ein Zeichen, das das ganze Dokument harmlos war, plötzlich nicht mehr harmlos. Ein `#` wird eine Überschrift. Ein `>` wird ein Blockzitat. Ein `-` oder ein `+` wird ein Listenpunkt — und ein `-` auf der Zeile unter einem Absatz wird eine Setext-`<h2>`-Unterstreichung und macht den Satz darüber zur Überschrift. Ein `=` auf dieser Zeile macht ihn zu einem `<h1>`. Ziffern gefolgt von `.` oder `)` werden eine Markierung für eine geordnete Liste, und die Zahl wird verwendet: ein Absatz, der mit „1986. Das Jahr, in dem der Standard sich änderte" beginnt, erscheint als geordnete Liste, deren erstes Element die Nummer 1.986 trägt, denn die Markierung setzt das Startattribut der Liste. All das braucht einen Backslash, gesetzt auf das Zeichen statt an den Zeilenanfang: `1986\.`, nicht `\1986.`.

Einrückung zählt auch als Position. Eine Markierung auf Blockebene funktioniert noch mit bis zu drei Leerzeichen davor, und vier Leerzeichen ergeben stattdessen einen eingerückten Codeblock — eine Zeile nach rechts zu schubsen entschärft also ein Doppelkreuz nicht, und sie weiter zu schubsen verwandelt sie in etwas völlig anderes.

**Am Ende einer Überschrift.** Ein abschließender Lauf von Doppelkreuzen an einer ATX-Überschrift ist eine schließende Folge und wird entfernt: `### Notizen ###` erscheint als „Notizen". Sind die Doppelkreuze Teil des Textes, maskieren Sie den Lauf — `### Notizen \###` — und sie bleiben.

**In einer Tabellenzelle.** Die Pipe ist das einzige Zeichen, dessen besondere Bedeutung auf ein Konstrukt beschränkt ist, und dort ist sie absolut: eine unmaskierte Pipe beendet die Zelle, in was auch immer sie eingepackt ist. Alles daran, [eine Tabelle durch eine Konvertierung hindurch heil zu halten](/blog/markdown-tables-that-survive-conversion), beginnt mit diesem einen Zeichen.

**In Linktext und Linkzielen.** Eckige Klammern verschachteln sich schlecht, eine Klammer innerhalb eines Linktextes muss also maskiert werden: `[a \[b\] c](https://example.com)`. Innerhalb des Ziels sind ausbalancierte runde Klammern meist in Ordnung, und eine unausgeglichene braucht `\(` oder `\)`. Ein Leerzeichen in einem Ziel ist überhaupt kein Maskierungsproblem — ein Backslash rettet es nicht, und der ganze Link verfällt zu einfachem Text; prozentkodieren Sie es.

**In einem Linktitel.** Ein Anführungszeichen innerhalb eines `"…"`-Titels braucht `\"`, eine der wenigen Stellen, an denen ein Backslash funktioniert, obwohl Leute annehmen, er tue es nicht.

### Der Backslash am Zeilenende

Es gibt eine Position, in der ein Backslash überhaupt keine Maskierung ist, und das ist die Kollision, die man kennen sollte. Die Spezifikation sagt es unmissverständlich: ein Backslash am Zeilenende ist ein harter Zeilenumbruch (geprüft auf spec.commonmark.org, 9. September 2026). Eine Absatzzeile, die auf einen einzelnen Backslash endet, druckt also keinen — sie gibt ein `<br>` aus und zieht die nächste Zeile an sich.

Das zählt in genau einem häufigen Fall, und der ist ein Windows-Fall. Ein Verzeichnispfad, als Prosa geschrieben und auf einen Trenner endend, `C:\logs\`, steht am Zeilenende und wird zu einem Zeilenumbruch, der den Backslash mitnimmt. Zwei Backslashes, `C:\logs\\`, geben Ihnen einen wörtlichen Backslash und keinen Umbruch. Eine Code-Spanne gibt Ihnen den Pfad und nichts sonst, und das ist die richtige Antwort.

Am Ende eines Blocks — der letzten Zeile eines Absatzes, dem Ende einer Überschrift — hat keine der Umbruchsyntaxen eine Zeile zu brechen, und der Backslash wird stattdessen gedruckt. Diese Asymmetrie ist die nützliche Hälfte des Vergleichs der zwei harten Umbruchformen: ein verirrter Backslash ist auf der Seite sichtbar, verirrte Leerzeichen am Zeilenende sind es nicht.

## Was ein Konverter für Sie auf dem Weg hinaus maskiert

Maskieren ist nicht nur etwas, das Sie mit einer Quelldatei tun. Jede Konvertierung in jede Richtung setzt Maskierungen ein, und zu wissen, welche, sagt Ihnen, wie eine kaputte Ausgabe zu lesen ist.

**Markdown zu HTML.** Drei Zeichen in Ihrem Text können nicht als sie selbst reisen, denn HTML würde sie als Markup lesen. Ein Konverter ersetzt sie, lautlos und immer.

| In Ihrem Markdown | Im HTML | Warum |
| :--- | :--- | :--- |
| `<` im Text | `&lt;` | Sonst beginnt der Browser, ein Tag zu parsen |
| `&` im Text | `&amp;` | Sonst beginnt der Browser, eine Referenz zu parsen |
| `>` im Text | `&gt;` | Symmetrie, und Sicherheit in älteren Parsern |
| `"` in einem Attribut | `&quot;` | Sonst endet der Attributwert zu früh |
| `'` in einem Attribut | `&#39;` | Dasselbe, für einfach quotierte Attribute |

Deshalb erscheint ein wörtliches `<div>`, in einen Satz getippt, als Text auf der Seite statt im Markup zu verschwinden — und das ist altes Verhalten, keine moderne Freundlichkeit: das ursprüngliche Markdown-Syntaxdokument vermerkt, dass innerhalb von Code-Spannen und -Blöcken spitze Klammern und Ampersande immer automatisch kodiert werden (geprüft auf daringfireball.net, 9. September 2026). Eine Zeichenreferenz, die Sie selbst geschrieben haben, wird in Ruhe gelassen — ein Konverter, der `&amp;` in `&amp;amp;` neu maskierte, würde jedes Dokument brechen, das eine enthält.

**HTML, Word, CSV oder JSON zu Markdown.** Hier muss der Konverter Backslashes einsetzen, und daran lässt sich einer vernünftig beurteilen. Ein Absatz, der mit „1986. Das Jahr" beginnt, muss als `1986\. Das Jahr` ankommen, sonst gewinnt das Dokument eine Liste, die niemand geschrieben hat. Ein Satz mit einem Sternchen, eine Tabellenzelle mit einer Pipe, eine Überschrift, deren Text ein Doppelkreuz enthält, ein Produktname mit einem Unterstrich an einer Wortgrenze: jedes braucht mitten in der Konvertierung einen eingesetzten Backslash, und ein Konverter, der den Schritt auslässt, gibt eine Datei zurück, die als anderes Dokument erscheint als das, das er bekommen hat. [Eine Konvertierung mit einem absichtlich unbequemen Absatz zu testen](/blog/convert-html-to-markdown), bevor man ihr hundert Seiten anvertraut, kostet eine Minute.

**Warum `&amp;lt;` auf einer Seite erscheint.** Weil etwas zweimal maskiert wurde. `<` wurde `&lt;`, und dann behandelte ein zweiter Durchgang diese Zeichenkette als einfachen Text und maskierte ihr Ampersand zu `&amp;`, was `&amp;lt;` ergibt — und das stellt der Browser treu als sichtbaren Text `&lt;` dar. Drei Ampersande tief, `&amp;amp;lt;`, heißt drei Durchgänge. Die Ursache ist fast immer eine Pipeline, in der zwei Stufen beide glauben, für das Maskieren zuständig zu sein: ein Konverter, der HTML ausgibt und eine Vorlagenmaschine speist, die ihre Eingaben automatisch maskiert; oder ein Bereiniger, der nach dem Maskieren läuft statt davor. Die Diagnose ist Rechnen — zählen Sie die Schichten `amp;`, und Sie wissen, wie viele Stufen maskiert haben — und die Abhilfe ist, einen Maskierungsschritt zu entfernen, nie einen Entmaskierungsschritt hinzuzufügen.

Das Spiegelsymptom ist ein Backslash auf der dargestellten Seite, wo Sie ein sauberes Zeichen erwartet haben. Das heißt, Markdown-maskierter Text hat etwas erreicht, das kein Markdown-Renderer ist: ein Feld für reinen Text, ein `title`-Attribut, eine nachträglich hinzugefügte Code-Spanne. Entweder sollten die Maskierungen nicht da sein oder der Text nicht in diesem Behälter.

## Die Fälle, die wirklich vorkommen

Fünf Situationen machen fast jede echte Beschwerde über Maskieren aus. Keine davon ist exotisch, und nur eine handelt wirklich von Markdown.

### Über Markdown in Markdown schreiben

Das schwerste Dokument, das man in Markdown schreiben kann, ist ein Dokument über Markdown, denn jedes Beispiel ist ein lebendes Konstrukt. Zeichenweise zu maskieren funktioniert und liest sich schrecklich: `\*\*fett\*\*` in der Quelle ist schlimmer als das, was es beschreibt.

Nehmen Sie stattdessen Code-Spannen, und nehmen Sie die Auffüllregel, wenn das Beispiel Backticks enthält. Eine Code-Spanne kann mit beliebig vielen Backticks geöffnet werden und wird von derselben Anzahl geschlossen, und ein einzelnes Leerzeichen vorn und hinten wird entfernt — eine Spanne aus zwei Backticks mit Leerzeichen darin hält also einen wörtlichen Backtick. Um einen eingezäunten Block zu zeigen, öffnen Sie den äußeren Zaun mit vier Backticks und setzen das Beispiel mit drei Backticks hinein:

    ````
    ```js
    const x = 1;
    ```
    ````

Für alles Kurze — ein Syntaxfragment, ein Flag, eine Markierung — ist eine Code-Spanne sowohl richtig als auch kürzer als Maskieren. **Für wen das ist:** jeden, der Dokumentation, einen Styleguide oder eine README schreibt, die Syntax zitiert.

### Schnipsel mit Vorlagensyntax

`{{ }}`, `{% %}` und `${…}` erzeugen einen steten Strom von Maskierungsfragen, und keine davon ist ein Markdown-Problem. Geschweifte Klammern sind maskierbar, aber in CommonMark bedeutungslos: `{{ name }}` in einem Absatz erscheint als `{{ name }}`. Was es frisst, ist ein zweiter Prozessor an derselben Datei — die Vorlagenmaschine eines statischen Seitengenerators, ein Dokumentations-Build, ein Komponenten-Framework — der entweder vor Markdown oder danach läuft.

Ein Backslash kann also nicht helfen, denn die Maschine, die die Klammern verbraucht, hat von Markdown-Maskierungen nie gehört. Jede Maschine hat ihren eigenen Mechanismus, und Liquids ist das klarste Beispiel: sein `raw`-Tag schaltet die Tag-Verarbeitung zeitweise ab, und die Dokumentation nennt Handlebars-Syntax als den Grund, warum man das wollen würde (geprüft auf shopify.github.io, 9. September 2026). Ein eingezäunter Codeblock ist hier auch kein Schutz — eine Vorlagenmaschine, die über die rohe `.md`-Datei läuft, hat keine Ahnung, dass der Zaun existiert.

`${…}` ist eine dritte Variante derselben Form: innerhalb eines JavaScript-Template-Literals ist es Interpolation, und das Maskieren, das sie stoppt, ist JavaScripts Backslash, im Code, nicht Markdowns. Es im Markdown zu maskieren gibt Ihnen ein Dokument mit `\${…}` darin, was zweifach falsch ist.

**Für wen das ist:** jeden, der eine Vorlagensprache, ein Shell-Skript oder eine CI-Konfiguration innerhalb einer Seite dokumentiert, die selbst aus Vorlagen gebaut ist. Finden Sie zuerst die Roh-Direktive der äußeren Maschine; die Markdown-Ebene ist nicht, wo die Abhilfe hingehört.

### Windows-Pfade

Ein Pfad wie `C:\Users\name\Documents` übersteht einen Markdown-Renderer meist, und das ist die Falle. Auf jeden Backslash folgt ein Buchstabe, jeder ist also ein wörtlicher Backslash und wird gedruckt. Dann folgt zufällig auf einen Pfad im Dokument ein ASCII-Satzzeichen, und er verliert ohne ein Wort der Warnung einen Trenner: `C:\temp\_new` erscheint als `C:\temp_new`, und `C:\logs\` am Zeilenende wird zu einem Zeilenumbruch.

Nichts in der Ausgabe weist darauf hin. Der Pfad ist noch ein plausibler Pfad, weshalb dieser Fehler es in einen Support-Artikel schafft und in jemandes Terminal kopiert wird, bevor es irgendwem auffällt. Jeden Backslash zu verdoppeln funktioniert und macht die Quelle unlesbar. Eine Code-Spanne funktioniert, ist kürzer und schützt den ganzen Lauf auf einmal — innerhalb von Backticks ist ein Backslash immer Inhalt, und es bleibt nichts übrig, was schiefgehen könnte.

**Für wen das ist:** jeden, der Installationsanweisungen, Protokollorte oder Konfigurationspfade für Windows schreibt. Setzen Sie jeden Pfad gewohnheitsmäßig in eine Code-Spanne, und diese Fehlerklasse verschwindet.

### Währung und Mathematik mit Dollarzeichen

In reinem CommonMark und in GFM bedeutet `$` nichts. „Es kostet $5 bis $10" erscheint genau wie geschrieben, und es braucht keine Maskierung. Die Schwierigkeit beginnt dort, wo eine Mathe-Erweiterung eingeschaltet ist, denn dann ist `$…$` ein Trenner, und zwei Dollarzeichen in einer Zeile werden zu einem mathematischen Ausdruck, der Ihren Satz enthält.

GitHub ist der Ort, an dem die meisten Leute dem begegnen. Seine Dokumentation sagt, ein Inline-Ausdruck werde von Dollarzeichen umgeben, dass man innerhalb eines Mathe-Ausdrucks einen Backslash vor ein ausdrückliches `$` setze und — der Teil, den man behalten sollte — dass man außerhalb eines Mathe-Ausdrucks, aber auf derselben Zeile, `span`-Tags um das ausdrückliche `$` setzen solle (geprüft auf docs.github.com, 9. September 2026). Das ist eine Anweisung, nach rohem HTML statt nach einem Backslash zu greifen, was Ihnen sagt, wie entschlossen das Dollarzeichen auf dieser Plattform beansprucht ist.

Die portable Antwort ist die übliche: setzen Sie den Betrag in eine Code-Spanne, oder schreiben Sie die Währung als Wort. **Für wen das ist:** jeden, der über Preise, Finanzzahlen oder Einheiten in einem Repository schreibt, dessen README von einer Plattform mit eingeschalteter Mathematik dargestellt wird.

### Unterstriche in Bezeichnern

Das ist die mit Abstand häufigste echte Beschwerde, und die gute Nachricht ist, dass CommonMark das meiste davon schon gelöst hat. Ein Unterstrich kann Betonung nur an einer Wortgrenze öffnen oder schließen, `snake_case_name` erscheint also als sich selbst, unangetastet, und braucht überhaupt keine Backslashes. Für Sternchen gilt das nicht: `a*b*c` betont das `b`, denn `*` trägt keine solche Einschränkung.

Drei Formen brechen trotzdem, und sie sind die, die die Meldungen erzeugen.

| Was Sie schreiben | Was Sie bekommen | Warum |
| :--- | :--- | :--- |
| `snake_case_name` | `snake_case_name` | Beide Unterstriche stehen im Wort: keine Betonung |
| `__init__` | Fettes „init" | Beide Läufe stehen an einer Wortgrenze, beide können also als Trenner wirken |
| `_private and id_` | Kursives „private and id" | Ein führender Unterstrich öffnet; ein abschließender, Sätze später, schließt |
| `MAX_VALUE and MIN_VALUE` | Unverändert | Beide stehen im Wort |
| `a*b*c` | `a<em>b</em>c` | Sternchen haben keine Wortgrenzen-Regel |

`__init__` ist der Fall, der am meisten Zeit kostet, denn Pythons Dunder-Namen sind genau das Muster, das die Betonungsregel abfangen soll — und die Ausgabe, fetter Text, wo ein Methodenname stehen sollte, sieht nach einem Formatierungsunfall aus statt nach einem Syntaxfall. `\_\_init\_\_` behebt es mit vier Backslashes. Eine Code-Spanne behebt es mit zwei Backticks und verhindert außerdem, dass der Name neu umgebrochen, in der Rechtschreibprüfung angemeckert oder in ein typografisches Durcheinander verwandelt wird.

Die Wortgrenzen-Regel ist die von CommonMark, und das ist die andere Hälfte der Antwort: ein Renderer, der älter ist, oder einer, der eine andere Betonungsregel umsetzt, betont Unterstriche im Wort möglicherweise doch. **Für wen das ist:** jeden, der in Prosa über Code schreibt — Bezeichner, Umgebungsvariablen, Datenbankspalten, Flag-Namen. Eine Code-Spanne ist in jedem Dialekt richtig und teilt als Zugabe mit: „das ist ein Symbol".

## Der ehrliche Teil: Maskieren ist an den Rändern dialektabhängig

Alles oben gilt für CommonMark, und CommonMark ist nicht das Einzige, was Ihre Datei darstellt. Die Menge der maskierbaren Zeichen ist selbst eine Dialektentscheidung, und der Unterschied ist nicht klein.

Das ursprüngliche Markdown-Syntaxdokument listet genau fünfzehn Zeichen auf, die man maskieren kann: Backslash, Backtick, Sternchen, Unterstrich, die geschweiften Klammern, die eckigen Klammern, die runden Klammern, Doppelkreuz, Plus, Minus, Punkt und Ausrufezeichen (geprüft auf daringfireball.net, 9. September 2026). CommonMark hat das auf alle zweiunddreißig ASCII-Satzzeichen erweitert. `\|`, `\~`, `\$`, `\:` und `\=` sind also Maskierungen in einem CommonMark-Renderer und gedruckte Backslashes in einem älteren. Eine Datei, die vorsorglich für den einen maskiert, ist eine Datei mit sichtbaren Backslashes im anderen, und beide Renderer tun, was ihre Dokumentation sagt.

Die Ränder verschieben sich auch in die andere Richtung. GFM gibt `|` und `~` Bedeutungen, die CommonMark nicht hat — eine Zellengrenze und, paarweise, Durchgestrichenes — und ergänzt die Pipe-Maskierung in der Code-Spanne, um mit der ersten davon fertigzuwerden (geprüft auf github.github.com, 9. September 2026). Eine Mathe-Erweiterung beansprucht `$`. Attributblock-Syntax beansprucht `{` und `}`. Emoji-Kurzcodes und manche Fußnotensyntaxen beanspruchen `:`. Jedes davon verschiebt ein Zeichen aus der Spalte „braucht nie Maskierung" in eine, die sie braucht, und keines davon steht in einer Spezifikation, auf die man als die maßgebliche zeigen könnte. [Wie weit die Dialekte auseinandergehen und welche Funktion zu welchem gehört](/blog/commonmark-gfm-and-the-flavours) ist der Hintergrund von all dem.

Bleibt eine portable Antwort, und sie hat einen Preis, den man leicht überliest. Eine Code-Spanne funktioniert überall: kein Dialekt legt ihren Inhalt aus, keine Erweiterung beansprucht ein Zeichen darin, und die Maskierungsfrage stellt sich nicht. Aber eine Code-Spanne ist keine neutrale Hülle — sie verändert den Text. Sie erscheint in Festbreitenschrift, meist mit getöntem Hintergrund und leicht anderer Größe, und sie trägt die Bedeutung „das ist Code". Das ist richtig für einen Pfad, ein Flag oder einen Bezeichner. Es ist falsch für einen Firmennamen mit einem Ampersand, einen Preis, einen Satz über ein Sternchen oder eine Überschrift. Prosa in Backticks zu packen, um einem Maskierungsproblem auszuweichen, tauscht einen Syntaxfehler gegen einen typografischen — und der typografische ist die Art, die eine Gestalterin bemerkt und ein Autor verteidigt.

Es gibt also keine einzige Antwort, nur eine kurze Rangfolge. In einer Code-Spanne, wenn der Text Code ist. Ein Backslash, wenn es Prosa ist und ein Dialekt sie darstellen muss. Eine Zeichenreferenz, wenn ein Backslash nicht hinreicht oder das Zeichen kein ASCII-Satzzeichen ist. Und den Satz umzuschreiben — die Jahreszahl vom Zeilenanfang wegzuholen, die Währung auszuschreiben — häufiger, als Leute es versuchen, denn ein Satz, der keine Maskierung braucht, erscheint korrekt in jedem Dialekt, der jemals existieren wird.

## Eine Maskierung wählen, in fünf Kriterien

1. **Entscheiden Sie, ob der Text Code ist, denn das beantwortet das meiste.** Ein Pfad, ein Flag, ein Bezeichner oder ein Muster gehört in eine Code-Spanne, wo keine Maskierung nötig ist und keine ausgelegt wird; ist der Text Prosa, ist eine Code-Spanne das falsche Instrument, und Sie sind wieder bei Backslashes.
2. **Prüfen Sie die Position, bevor Sie etwas hinzufügen.** Sechs der Zeichen, die zählen, zählen nur am Zeilenanfang — ein Backslash mitten im Satz ist also fast immer ein Backslash, den Sie später jemandem erklären müssen.
3. **Maskieren Sie einmal, und wissen Sie, welche Stufe es tut.** Eine Pipeline, in der zwei Stufen beide maskieren, erzeugt `&amp;lt;` auf der Seite, und die einzige Abhilfe ist, eine davon zu entfernen — einen Entmaskierungsschritt zum Ausgleich hinzuzufügen verbirgt den Fehler und bricht stattdessen das nächste Dokument.
4. **Nehmen Sie eine Zeichenreferenz, wenn der Backslash nicht hinreicht.** Innerhalb rohen HTMLs, in einem Attributwert oder für ein Zeichen, das kein ASCII-Satzzeichen ist, funktionieren `&quot;` und `&copy;` dort, wo `\"` und `\©` überhaupt nichts tun.
5. **Stellen Sie die Datei dort dar, wo sie tatsächlich leben wird, bevor Sie sich auf ein Schema festlegen.** Die maskierbare Menge, die Betonungsregeln und die Bedeutung von `$`, `|` und `:` schwanken alle je Dialekt — ein Dokument, das in der Vorschau Ihres Editors richtig aussieht, kann auf der veröffentlichenden Plattform sichtbare Backslashes tragen.

## Fazit

Maskieren in Markdown ist eine Regel mit einem langen Schwanz: ein Backslash entschärft jedes ASCII-Satzzeichen, tut vor allem anderen nichts, und tut überhaupt nichts innerhalb einer Code-Spanne, eines Codeblocks, eines Autolinks oder rohen HTMLs. Fast jedes Problem ist die zweite Hälfte dieses Satzes, die auf ein Zeichen trifft, das immer nur in einer Position besonders war. Zeichenreferenzen decken ab, was der Backslash nicht erreicht, Code-Spannen decken ab, worüber Sie lieber nicht nachdenken, und ein umgeschriebener Satz deckt den Rest. Wenn Sie sehen wollen, was eine bestimmte Datei tatsächlich erzeugt — welche Maskierungen überlebt haben, welche Zeichen ausgelegt wurden und was das HTML sagt — ist [sie in TransformPipe zu konvertieren und die Ausgabe zu lesen](/) schneller, als darüber nachzudenken, und es ist die einzige Art, die Maskierung zu finden, die spurlos verschwunden ist.

## FAQ

### Wie maskiere ich ein Sonderzeichen in Markdown?

Setzen Sie einen Backslash davor, solange es eines der zweiunddreißig ASCII-Satzzeichen ist: `\*` für ein wörtliches Sternchen, `\#` für ein Doppelkreuz am Zeilenanfang, `\|` für eine Pipe in einer Tabellenzelle. Vor einem Buchstaben, einer Ziffer oder einem Zeichen außerhalb von ASCII ist der Backslash keine Maskierung und wird auf der Seite gedruckt.

### Warum erscheint mein Backslash in der Ausgabe?

Höchstwahrscheinlich, weil der Text in einer Code-Spanne, einem Codeblock, einem Autolink oder rohem HTML steht, wo Maskierungen nicht funktionieren und ein Backslash gewöhnlicher Inhalt ist. Die andere Möglichkeit ist, dass Sie etwas maskiert haben, das kein ASCII-Satzzeichen ist — einen Buchstaben, eine Ziffer, einen Geviertstrich — was die Spezifikation als wörtlichen Backslash definiert.

### Wie schreibe ich ein wörtliches Sternchen oder einen wörtlichen Unterstrich in Markdown?

Schreiben Sie `\*` oder `\_`, oder nehmen Sie `&#42;` und `&#95;`, wenn Sie ein Zeichen wollen, das kein Parser als Betonung lesen kann. Unterstriche innerhalb eines Wortes brauchen in CommonMark und GFM nichts, `snake_case_name` ist also schon sicher; `__init__` ist es nicht, denn beide Läufe stehen an Wortgrenzen.

### Warum bricht meine Tabelle, wenn eine Zelle eine Pipe enthält?

Weil die Pipe eine Zellengrenze ist und der Tabellenparser die Zeile daran teilt, bevor irgendetwas anderes passiert, auch bevor Code-Spannen erkannt werden. Maskieren Sie sie als `\|`, die eine Maskierung, die innerhalb einer Code-Spanne funktioniert, oder nehmen Sie `&#124;`.

### Wann sollte ich `&amp;` statt eines Backslashes nehmen?

Wenn ein Backslash das Zeichen nicht erreicht oder nichts zu entfernen hat: innerhalb rohen HTMLs, innerhalb eines Attributwerts, und für Zeichen, die keine ASCII-Satzzeichen sind, etwa `©` und ein geschütztes Leerzeichen. Zeichenreferenzen überstehen außerdem Pipelines, die Backslashes entfernen oder verdoppeln — zum Preis, in der Quelle unlesbar zu sein.

### Warum sehe ich `&amp;lt;` in meiner konvertierten Ausgabe?

Etwas hat den Text zweimal maskiert: `<` wurde `&lt;`, dann maskierte eine zweite Stufe dieses Ampersand zu `&amp;`. Zählen Sie die Schichten `amp;`, um die Stufen zu zählen, und entfernen Sie dann eine davon — meist eine Vorlagenmaschine, die eine Ausgabe automatisch maskiert, die ein Konverter schon maskiert hatte.

### Funktioniert Maskieren in jedem Markdown-Werkzeug gleich?

Nicht an den Rändern. Die maskierbare Menge sind zweiunddreißig Zeichen in CommonMark und fünfzehn im ursprünglichen Markdown, und Erweiterungen für Tabellen, Mathematik, Attribute und Emoji beanspruchen Zeichen, die reines CommonMark ignoriert. Eine Code-Spanne verhält sich überall gleich, weshalb sie die portable Antwort ist — und weshalb es sich lohnt zu wissen, dass sie auch verändert, wie der Text aussieht.
