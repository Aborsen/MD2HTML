---
title: "DOCX in Markdown umwandeln: die Wege über Browser, Pandoc und mammoth"
description: "Eine .docx auf drei Wegen in Markdown umwandeln, warum das Archiv entscheidet, was überlebt, und die Prüfliste für alles, was die Konvertierung leise verworfen hat"
date: 2026-09-04
tag: Konvertieren
keywords: docx zu markdown, docx in markdown umwandeln, docx zu md, pandoc docx zu markdown, mammoth docx zu markdown, docx zu markdown kommandozeile, docx zu markdown ohne upload, docx zu markdown nummerierung
---

Sie haben eine Word-Datei und brauchen Markdown. Vernünftiger erster Schritt: die `.docx` in einem Texteditor öffnen und sehen, womit man es zu tun hat. Was Sie bekommen, ist ein Bildschirm voll binären Mülls mit den Buchstaben `PK` am Anfang und ein paar erkennbaren Dateinamen darin begraben. Nichts an diesem Bildschirm deutet auf ein Dokument hin.

Dieser Bildschirm ist das Nützlichste, was Sie den ganzen Tag sehen werden, denn er sagt Ihnen, was die Konvertierung tatsächlich ist. Eine `.docx` ist keine Datei mit Text darin. Sie ist ein Zip-Archiv mit einem Dutzend XML-Dateien, und die Wörter stehen in einer davon, während die Bedeutung der Wörter über die anderen verteilt ist. Sie in Markdown umzuwandeln heißt: das Archiv entpacken, diese Querverweise auflösen und alles wegwerfen, für das Markdown keine Syntax hat.

Deshalb wandelt sich dasselbe Dokument in verschiedenen Werkzeugen verschieden um, und deshalb sind die Fehlfälle so konkret. Die Überschriften kommen an, aber die nummerierte Liste ist als einfache Absätze herausgekommen. Die Tabelle kam ohne Kopfzeile. Die Bilder fehlen entweder oder stehen als eine einzige Zeile Base64 mit vierzigtausend Zeichen da. Die Fußnoten sind einfach nicht vorhanden, und niemand hat es Ihnen gesagt. Jeder dieser Fälle hat eine Ursache, die Sie in etwa zwei Minuten finden, sobald Sie wissen, wo man nachsieht.

Das hier ist die Anleitung: was in der Datei steckt, drei Wege hinaus, und dann der Teil, den die meisten Anleitungen überspringen — wie man das Ergebnis liest und herausfindet, was verloren ging.

### Kurzfassung

Für ein Dokument nehmen Sie einen Konverter, der im Browser läuft: `.docx` ablegen, Markdown lesen, keine Installation und kein Upload. Für mehr als ein Dokument, für Bilder, die Sie auf der Platte brauchen, oder für eine Datei, die durch ein Review gegangen ist, installieren Sie **Pandoc** und nehmen `pandoc -f docx -t gfm --wrap=none --extract-media=./media`. Für die Konvertierung im eigenen Code nehmen Sie **mammoth**, um HTML zu erzeugen, und danach einen getrennten HTML-zu-Markdown-Schritt — das ist, was mammoths eigene Autoren empfehlen. Prüfen Sie dann drei Dinge in der Ausgabe, bevor Sie die `.docx` wegwerfen: ob die nummerierten Listen noch Listen sind, wohin die Bilder gegangen sind, und ob die Fußnoten überhaupt existieren.

## Was eine .docx wirklich ist, und warum ein Texteditor Unsinn zeigt

Eine `.docx` ist ein Zip-Archiv im Format Office Open XML, standardisiert als ECMA-376 und ISO/IEC 29500. Jede Zip-Datei auf der Welt beginnt mit den zwei Bytes `PK`, den Initialen von Phil Katz, der das ursprüngliche Format geschrieben hat — das ist also das Erste, was Ihr Texteditor Ihnen zeigt, gefolgt von komprimierten Daten, die er nicht darstellen kann.

Benennen Sie eine Kopie in `.zip` um, entpacken Sie sie, und das Dokument wird zu einem Verzeichnis:

```
$ cp report.docx report-copy.zip
$ unzip -l report-copy.zip
  [Content_Types].xml
  _rels/.rels
  word/document.xml
  word/styles.xml
  word/numbering.xml
  word/settings.xml
  word/fontTable.xml
  word/footnotes.xml
  word/media/image1.png
  word/media/image2.jpeg
  word/_rels/document.xml.rels
  docProps/core.xml
  docProps/app.xml
```

Die genaue Liste schwankt, und die Schwankung ist der interessante Teil. `word/numbering.xml` ist nur da, wenn das Dokument jemals eine Liste enthalten hat. `word/footnotes.xml` nur, wenn es Fußnoten hat. `word/media/` existiert nur, wenn es Bilder gibt. `word/header1.xml` erscheint, wenn jemand eine laufende Kopfzeile gesetzt hat. Einem Archiv, dem einer dieser Teile fehlt, fehlt die entsprechende Funktion, und kein Konverter kann sie erfinden.

Unter Windows entpackt PowerShell kein Archiv, dessen Endung nicht `.zip` ist, kopieren Sie es also zuerst:

```powershell
Copy-Item report.docx report-copy.zip
Expand-Archive report-copy.zip -DestinationPath .\report-unzipped
```

`word/document.xml` ist meist eine einzige enorme Zeile, denn Word hat keinen Grund, sie lesbar zu machen. Schicken Sie sie durch einen Formatierer, bevor Sie es versuchen:

```
$ xmllint --format report-unzipped/word/document.xml | head -60
```

Jetzt das Wichtige. In diesem XML wird **Bedeutung per Verweis gespeichert**. Eine Überschrift ist nicht als Überschrift markiert. Sie ist ein Absatz, der ein `w:pStyle`-Element trägt, das einen Stil benennt — und die Definition dieses Stils, drüben in `styles.xml`, ist das, was sagt, dass es Überschrift 1 ist. Ein Listenelement ist ein Absatz, der ein `w:numPr`-Element mit einer `w:numId` und einer `w:ilvl` trägt, und ob das ein Punkt oder eine Dezimalzahl ist, lebt in `numbering.xml`. Ein Bild ist ein `r:embed`-Attribut mit einer Beziehungs-ID, und `word/_rels/document.xml.rels` ist das, was diese ID zu `word/media/image1.png` macht.

Ein Konverter von `.docx` zu Markdown ist also ein Programm, das vier Dinge in Reihenfolge tut: das Paket entpacken, `document.xml` ablaufen, die Verweise jedes Elements gegen die anderen Teile auflösen und das Ergebnis als Markdown ausgeben. Jeder Unterschied zwischen Werkzeugen ist ein Unterschied in Schritt drei oder Schritt vier. Wenn Schritt drei etwas nicht auflösen kann, hat der Konverter keine Ahnung, was er da vor sich hatte, und was Sie bekommen, ist ein einfacher Absatz.

| Teil des Archivs | Was er hält | Was ohne ihn bricht |
| --- | --- | --- |
| `word/document.xml` | Die Absätze, Läufe und Tabellen | Es konvertiert überhaupt nichts |
| `word/styles.xml` | Definitionen benannter Stile | Überschriften kommen als fette Absätze an |
| `word/numbering.xml` | Listenformate, Ebenen und Neustarts | Nummerierte und gepunktete Listen kommen als Absätze an |
| `word/_rels/document.xml.rels` | Beziehungs-IDs zu Dateipfaden | Bilder lassen sich nicht auffinden |
| `word/media/` | Die Bilddateien selbst | Bildverweise zeigen auf nichts |
| `word/footnotes.xml` | Die Fußnotentexte | Fußnotenmarken ohne Text, oder keine Fußnoten |
| `word/comments.xml` | Review-Kommentare | Kommentare verworfen, meist lautlos |

## Welcher Weg für welche Aufgabe

| Weg | Am besten für | Installation nötig | Was er mit Bildern macht | Preis |
| --- | --- | --- | --- | --- |
| Konverter im Browser | Ein Dokument, jetzt, ohne es hochzuladen | Keine | Bettet sie ein, oder lässt Verweise | Kostenlos |
| Pandoc | Stapel, Änderungsverfolgung, Bilder auf der Platte | Pandoc | `--extract-media` schreibt sie in einen Ordner | Kostenlos, GPL |
| mammoth (Node oder Browser) | Konvertierung in der eigenen Anwendung | npm | Data-URIs standardmäßig, oder Ihr eigener Callback | Kostenlos, BSD-2-Clause |
| mammoth-CLI | Ein Einzelfall mit Bildern als Dateien | npm | `--output-dir` schreibt sie neben das HTML | Kostenlos, BSD-2-Clause |
| MarkItDown | Text in eine Pipeline speisen, nicht an einen Menschen | Python | Extrahiert, wo das Format es erlaubt | Kostenlos, MIT |
| Word, „Als Webseite speichern" | Ein Dokument, das andere Konverter verstümmeln | Word | In einen Ordner neben dem HTML geschrieben | Mit Word |
| Google-Docs-Export | Ein Dokument, das schon in Drive liegt | Keine | Im Download enthalten | Kostenlos mit Konto |
| Kopieren und Einfügen | Ein paar Absätze, sofort | Keine | Verloren | Kostenlos |
| LibreOffice, headless | Altes `.doc`, `.rtf` und sonderbare Formate | LibreOffice | In die geschriebene `.docx` übernommen | Kostenlos, MPL 2.0 |
| python-docx und ein eigener Writer | Eine Hausregel, die kein Konverter umsetzt | Python | Was Sie schreiben | Kostenlos, MIT |
| Entpacken und das XML lesen | Diagnose, warum eine Konvertierung scheiterte | Keine | Sie sehen sie direkt an | Kostenlos |

Drei dieser Zeilen sind die Wege, die fast alle tatsächlich nehmen, und der Rest dieses Artikels handelt überwiegend von ihnen. Wenn Sie die Wege als Produkte verglichen haben wollen statt als Verfahren — Preise, Lizenzen, für wen jeder passt — behandelt [der vollständige Vergleich der Word-zu-Markdown-Werkzeuge](/blog/best-word-to-markdown-converters) die, die diese Seite nur auflistet.

## Der Weg über den Browser: Datei ablegen, Markdown lesen

Ein Konverter im Browser liest die `.docx` mit JavaScript auf Ihrem eigenen Rechner. Das Archiv wird in der Seite entpackt, das XML in der Seite abgelaufen, und das Markdown erscheint in der Seite. Abgemeldet wird kein Teil der Datei irgendwohin gesendet, und das ist überprüfbar statt versprochen: Netzwerk-Tab öffnen, konvertieren und zusehen, wie nichts passiert.

Das Verfahren sind vier Schritte, und es gibt nichts zu konfigurieren.

1. Die Konvertierungsseite öffnen.
2. Die `.docx` darauf ablegen, oder im Dateidialog auswählen.
3. Das erscheinende Markdown lesen und bei Bedarf an Ort und Stelle bearbeiten.
4. Die `.md` herunterladen, oder herauskopieren.

| Vorteile | Nachteile |
| --- | --- |
| Keine Installation, kein Terminal, kein Konto | Ein Dokument auf einmal, kein Verzeichnis |
| Abgemeldet wird nichts hochgeladen | Der Browser macht die Arbeit, sehr große Dateien begrenzt also der Rechner |
| Überschriften, Listen, Tabellen, Links, Fettes und Kursives kommen mit | Keine Option, Bilder in einen Ordner Ihrer Wahl zu extrahieren |
| Das Ergebnis ist bearbeitbar, bevor Sie es mitnehmen | Verfolgte Änderungen werden zu angenommenem Text; Kommentare kommen nicht mit |

Es gibt eine Größengrenze, die man vorher kennen sollte, denn sie ist das eine, was Sie aufhält. Bei TransformPipe ist die Konvertierung selbst bei 10 MB gedeckelt, und ein Dokument, das Sie im Verlauf behalten, bei 4 MB, weil die speichernde Funktion einen größeren Anfragerumpf ablehnt. Eine `.docx` wird aus einem Grund groß — Fotos — wenn eine Datei also über der Grenze liegt, ist die Antwort meist, in `word/media/` nachzusehen, statt anzunehmen, das Dokument sei enorm.

Darunter ist der Weg über den Browser im Allgemeinen mammoth plus ein HTML-zu-Markdown-Schritt, also genau die Anordnung, die mammoths eigene Dokumentation empfiehlt. Das zählt mehr, als es klingt: es heißt, dass der Weg über den Browser und der Weg über mammoth unten dieselben Stärken und dieselben blinden Flecken haben — und ein Dokument, das in einem schlecht konvertiert, konvertiert im anderen schlecht.

**Für wen er ist.** Jeden mit einem Dokument und einem Grund, es nicht auf den Server eines Fremden zu schicken — einen Vertrag, eine Patientennotiz, einen internen Bericht, einen unveröffentlichten Plan. Auch für jeden, der einfach in den nächsten dreißig Sekunden das Markdown will, ohne ein Flag zu lernen.

## Der Weg über Pandoc: ein Befehl, und die vier Flags, die zählen

Pandoc ist ein Dokumentkonverter für die Kommandozeile, geschrieben in Haskell, der rund vierzig Formate liest und schreibt. Sein `.docx`-Leser ist der konfigurierbarste, den es gibt, und es ist der einzige Weg auf dieser Seite mit einer dokumentierten Antwort auf verfolgte Änderungen.

Der Befehl in seiner kürzesten brauchbaren Form:

```
$ pandoc -f docx -t gfm --wrap=none -o report.md report.docx
```

Das heißt: `docx` lesen, GitHub Flavored Markdown schreiben, Absätze nicht neu umbrechen, Ausgabe nach `report.md`. Lassen Sie `--wrap=none` weg, und Pandoc bricht Ihre Prosa hart bei 72 Spalten um, was eine diff-feindliche Datei ergibt und das Erste ist, was die meisten Leute rückgängig machen wollen.

Mit extrahierten Bildern:

```
$ pandoc -f docx -t gfm --wrap=none \
    --extract-media=./media \
    -o report.md report.docx
```

Und für ein Dokument, das durch ein Review gegangen ist:

```
$ pandoc -f docx -t gfm --wrap=none \
    --track-changes=all \
    -o report.md report.docx
```

Ein ganzes Verzeichnis, in bash:

```
$ for f in *.docx; do
    pandoc -f docx -t gfm --wrap=none -o "${f%.docx}.md" "$f"
  done
```

Dasselbe in PowerShell:

```powershell
Get-ChildItem *.docx | ForEach-Object {
  pandoc -f docx -t gfm --wrap=none -o "$($_.BaseName).md" $_.Name
}
```

| Flag | Was es tut | Warum Sie es wollen |
| --- | --- | --- |
| `-t gfm` | Wählt GitHub Flavored Markdown als Ausgabe | Tabellen und Durchgestrichenes sind GFM, nicht CommonMark. Pandocs Standarddialekt ist sein eigenes erweitertes Markdown, und das ist nicht dasselbe |
| `--wrap=none` | Hört auf, Absätze an einer Spaltengrenze umzubrechen | Ein Absatz pro Zeile heißt lesbare Diffs |
| `--extract-media=DIR` | Schreibt die eingebetteten Bilder in ein Verzeichnis | Sonst bleiben die Bilder in dem Archiv, das Sie gerade aufgeben |
| `--track-changes=accept\|reject\|all` | Entscheidet, was mit Einfügungen, Löschungen und Kommentaren passiert | `accept` ist die Voreinstellung und verwirft das Review stillschweigend; `all` behält alles, in Spans eingepackt |
| `--markdown-headings=atx` | Erzwingt Überschriften im `#`-Stil | Pandocs eigener `markdown`-Writer verwendet sonst unterstrichene Überschriften für die ersten zwei Ebenen |

| Vorteile | Nachteile |
| --- | --- |
| Skriptbar, zweihundert Dateien kosten also so viel Aufwand wie eine | Eine Installation, und ein Terminal |
| Die einzige dokumentierte Kontrolle über verfolgte Änderungen und Kommentare | Sein Standard-Ausgabedialekt ist nicht GFM, wenn Sie nicht danach fragen |
| Bilder mit einem Flag in einen Ordner | Eigene Word-Stile brauchen eine Zuordnung, die Sie selbst schreiben |
| Liest und schreibt `.docx`, Hin- und Rückwege sind also möglich | Das Handbuch ist lang und die Flags sind viele |

**Preis:** kostenlos, GPL-lizenziert.

**Für wen er ist.** Jeden, der mehr als eine Datei konvertiert, jeden, der die Bilder als Dateien braucht, und jeden mit einem Dokument, das durch ein juristisches oder redaktionelles Review gegangen ist. Wenn eine `.docx` verfolgte Änderungen enthält, ist das der einzige Weg auf der Seite, der sie nicht stillschweigend für Sie auflöst.

## Der Weg über mammoth: eine .docx im eigenen Code konvertieren

mammoth ist eine JavaScript-Bibliothek, die `.docx` in HTML umwandelt, mit Builds für Node und für den Browser. Sehr viele „Word zu Markdown"-Werkzeuge entpuppen sich als mammoth mit einem angeschraubten zweiten Schritt, und wenn Sie Ihren eigenen Konverter schreiben, ist es die vernünftige Grundlage.

Seine unterscheidende Idee ist die Stilzuordnung. Statt zu raten, was ein Absatz ist, ordnet mammoth die benannten Stile von Word HTML-Elementen zu, und diese Zuordnung ist Konfiguration, die Sie kontrollieren:

```js
const mammoth = require("mammoth");
const TurndownService = require("turndown");

const { value: html, messages } = await mammoth.convertToHtml(
  { path: "report.docx" },
  {
    styleMap: [
      "p[style-name='Chapter Title'] => h1:fresh",
      "p[style-name='Section Heading'] => h2:fresh",
      "p[style-name='Intense Quote'] => blockquote:fresh",
    ],
  }
);

const markdown = new TurndownService().turndown(html);

for (const message of messages) {
  console.warn(message.message);
}
```

Zwei Dinge in diesem Schnipsel sind der ganze Grund, die Bibliothek zu verwenden.

Das erste ist `styleMap`. Eine Organisation mit Hausstilen — „Chapter Title" statt „Heading 1" — bekommt von jedem anderen Werkzeug auf dieser Seite einfache Absätze, denn es gibt nirgends eine Regel, die sagt, dass ein Stil namens „Chapter Title" eine Überschrift ist. Hier schreiben Sie diese Regel. Das Suffix `:fresh` sagt mammoth, ein neues Element zu beginnen statt in das vorherige zu verschmelzen, was Sie bei Überschriften wollen und bei einem Stil, der einen Absatz fortsetzt, nicht.

Das zweite ist `messages`. Jedes mammoth-Ergebnis trägt ein Array von Warnungen mit den Stilen, die es nicht erkannt hat, und den Elementen, die es nicht behandelt hat. Das ist die einzige maschinenlesbare Auskunft darüber, was ein Konverter verworfen hat, die irgendein Weg auf dieser Seite liefert. Drucken Sie sie, protokollieren Sie sie, zeigen Sie sie Ihren Nutzern. Eine Warnung über einen unerkannten Stil ist genau der Moment, eine Zeile zur Stilzuordnung hinzuzufügen.

Die README von mammoth markiert seinen eigenen Markdown-Writer als veraltet und empfiehlt, HTML zu erzeugen und das nach Markdown zu wandeln. Nehmen Sie den Rat an — HTML hat ein Element für das meiste, was in einer `.docx` steckt, Markdown nicht, und der Weg über HTML gibt dem zweiten Schritt etwas, womit er arbeiten kann. Die Wahl dieser zweiten Bibliothek ist eine eigene kleine Entscheidung, und [die HTML-zu-Markdown-Konverter, die in Frage kommen](/blog/best-html-to-markdown-converters), unterscheiden sich vor allem darin, was sie mit Markup machen, das Markdown nicht ausdrücken kann.

Im Browser ist die Eingabe ein `ArrayBuffer` statt eines Pfads:

```js
const buffer = await file.arrayBuffer();
const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
```

Und von der Kommandozeile, für einen Einzelfall, bringt das Paket ein CLI mit, das die Bilder als eigene Dateien schreibt statt sie einzubetten:

```
$ npx mammoth report.docx --output-dir=out
```

| Vorteile | Nachteile |
| --- | --- |
| Läuft in Node und im Browser | Erzeugt HTML; der Markdown-Schritt ist Ihrer |
| Stilzuordnungen verkraften eigene Word-Stile richtig | Sein eigener Markdown-Writer ist von seinen Autoren als veraltet markiert |
| Meldet in `messages`, was es nicht zuordnen konnte | Nur JavaScript |
| Ein CLI ist für Einzelfälle dabei | Kein Seitenlayout, denn HTML hat keine Seite |

**Preis:** kostenlos, BSD-2-Clause-lizenziert.

**Für wen er ist.** Entwickler, die Konvertierung in eine Anwendung einbauen, und jeden, dessen Dokumente Hausstile statt der eingebauten von Word verwenden. Im Browser ist es praktisch die einzige echte Option.

## Wo die Konvertierung scheitert, und was das kostet

Alles oben funktioniert. Was folgt, ist, was trotzdem passiert, denn eine `.docx` hat hunderte Konstrukte und Markdown etwa ein Dutzend. Die Verluste sind strukturell, keine Fehler, und die nützliche Frage ist, welchen davon Sie zustimmen.

### Nummerierung überlebt nur, wenn numbering.xml die Liste auflöst

Das ist die häufigste Beschwerde über `.docx`-Konvertierung, und sie hat eine präzise Ursache.

Eine nummerierte Liste in Word ist eine Menge von Absätzen, jeder mit einem `w:numPr` mit einer `w:numId` und einer `w:ilvl`. Das ist alles. Der Absatz weiß nicht, dass er nummeriert ist, weiß nicht, welche Nummer er ist, und weiß nicht, ob er ein Punkt oder eine Dezimalzahl ist. All das lebt in `numbering.xml`, wo ein `w:num`-Element die `w:numId` auf eine abstrakte Definition abbildet, und diese Definition hält ein `w:lvl` pro Einrückungsebene mit einem `w:numFmt`, das `bullet`, `decimal`, `lowerRoman` und so weiter sagt.

Ein Konverter, der einem Listenabsatz begegnet, muss also zwei Sprünge machen: `w:numId` zur Nummerierungsdefinition, dann `w:ilvl` zur Ebene darin. Scheitert einer der Sprünge — der Teil fehlt, oder er ist da, enthält aber nicht die referenzierte Definition — hat der Konverter nichts, worauf er sich stützen kann. Er weiß nicht, dass der Absatz überhaupt ein Listenelement war. Was er ausgibt, ist ein gewöhnlicher Absatz, und er gibt ihn ohne Klage aus, denn aus seiner Sicht ist nichts schiefgegangen.

Lesen Sie mammoths Quelltext, und der Mechanismus ist direkt sichtbar: eine Ebene gilt als nummeriert, wenn ihr Zahlenformat irgendetwas anderes als `bullet` ist, und wenn der Nummerierungsteil nicht gefunden wird, fällt die Bibliothek auf eine leere Menge von Definitionen zurück. Mit einer leeren Menge liefert die Suche nach der Nummerierung eines Absatzes nichts, der Absatz passt nicht mehr auf die Regel, die ihn zum Listenelement gemacht hätte, und heraus geht er als Prosa.

Deshalb konvertieren die Listen eines Dokuments perfekt und die des nächsten fallen zusammen. Es ist nicht das Werkzeug, das inkonsistent ist. Ein Archiv hatte einen brauchbaren Nummerierungsteil und das andere nicht — was Dateien passiert, die von Skripten zusammengesetzt, aus anderen Anwendungen exportiert, von Berichtswerkzeugen erzeugt oder von Word nach einem Absturz repariert wurden. Bevor Sie den Konverter beschuldigen, entpacken Sie die Datei und sehen nach:

```
$ unzip -l report-copy.zip | grep numbering
```

Kein `word/numbering.xml` in der Auflistung heißt, dass kein Weg auf dieser Seite Ihnen Listen geben wird, und die Abhilfe liegt weiter oben: Dokument in Word oder LibreOffice öffnen, echte Listenformatierung anwenden, speichern und die gespeicherte Kopie konvertieren. Und prüfen Sie die Verschachtelung an dem, was überlebt, denn dass Unterebenen in die oberste Ebene abflachen, ist ein eigenes Scheitern mit eigenen Ursachen — [Listeneinrückung und Zeilenumbrüche](/blog/markdown-line-breaks-and-lists) benehmen sich in Markdown aus Gründen daneben, die mit Word nichts zu tun haben.

### Bilder landen als eigene Dateien, als Base64 oder nirgends

Markdown enthält nie ein Bild. Es enthält einen Verweis auf eines — `![Beschriftung](pfad/zum/bild.png)` — und die Datei muss an diesem Pfad existieren, wenn irgendetwas das Markdown darstellt. Eine `.docx` dagegen enthält die tatsächlichen Bildbytes in `word/media/`. Diese Lücke zu überbrücken ist eine Entscheidung, und jeder Weg trifft eine andere.

| Weg | Was Sie bekommen | Was Sie dann tun müssen |
| --- | --- | --- |
| Pandoc mit `--extract-media=./media` | Bilddateien in `./media`, Verweise darauf | Den Ordner neben dem Markdown behalten und beides einchecken |
| Pandoc ohne es | Verweise in einen Pfad, der auf der Platte nicht existiert | Mit dem Flag neu ausführen |
| mammoth, Voreinstellung | `<img src="data:image/png;base64,...">` im HTML | Entscheiden, ob Sie eine riesige Datei oder eigene wollen |
| mammoth mit einem `convertImage`-Callback | Was Sie schreiben | Die Dateien schreiben und das gewünschte `src` zurückgeben |
| mammoth-CLI mit `--output-dir` | Bilder als Dateien neben dem HTML | Das HTML nach Markdown wandeln, Pfade bleiben |
| Kopieren und Einfügen | Nichts | Jedes Bild von Hand aus Word speichern |

Der Base64-Fall überrascht Leute am meisten. Ein Data-URI ist erlaubt, eigenständig und wird korrekt dargestellt — und ein einzelnes Foto wird zu einer Markdown-Zeile mit zehntausenden Zeichen, was die Datei in einem Editor unlesbar, in einem Diff unprüfbar und in allem, was Syntax hervorhebt, langsam macht. Es ist die richtige Antwort, wenn das Markdown allein reisen muss, ohne Ordner daneben, und die falsche in einem Repository.

mammoths Voreinstellung ist der Data-URI, und ihn zu überschreiben ist eine dokumentierte Option statt eines Behelfs:

```js
const options = {
  convertImage: mammoth.images.imgElement(function (image) {
    return image.read("base64").then(function (data) {
      return { src: "data:" + image.contentType + ";base64," + data };
    });
  }),
};
```

Dieses Beispiel bildet die Voreinstellung nach; tauschen Sie den Rumpf gegen Code, der die Bytes in eine Datei schreibt und ein relatives `src` zurückgibt, und Sie haben Bilder auf der Platte mit den Pfaden, die Sie gewählt haben. Welchen Weg Sie auch nehmen: die Bilder sind der Teil der Konvertierung, der am ehesten später kaputt ist statt jetzt, nämlich wenn das Markdown umzieht und der Ordner nicht — [was einen Bildverweis tatsächlich funktionsfähig hält](/blog/images-and-links-that-still-work), ist es wert, gelesen zu werden, bevor Sie hundert konvertierte Dateien einchecken.

### Überschriften, die nie Überschriften waren

Wenn jemand seine Überschriften gebaut hat, indem er eine Zeile markiert, auf 18 pt gesetzt und fett gedrückt hat, gibt es kein `w:pStyle` aufzulösen, und kein Konverter kann diese Zeile von einem nachdrücklichen Satz unterscheiden. Sie bekommen `**Kapitel zwei**` als Absatz, oder einfachen Text, je nach Werkzeug.

Das ist nicht im Konverter zu beheben, nur weiter oben. Dokument öffnen, echte Überschriftenstile aus der Stilgalerie anwenden, speichern, erneut konvertieren. Verwendet das Dokument stattdessen eigene benannte Stile, ist mammoths `styleMap` die Antwort, und Pandoc braucht eine Stilzuordnung, die Sie selbst schreiben. Der Preis, es nicht zu beheben, ist, dass Ihr Markdown überhaupt keine Dokumentstruktur hat — kein Inhaltsverzeichnis, keine Anker, keine Gliederung — und Struktur ist das meiste, wofür Markdown da ist.

### Tabellen, die ihre Kopfzeile oder ihre Form verlieren

Die Tabellensyntax von Markdown ist ein Gitter aus einzelnen Zellen, mit einer Kopfzeile, ohne übergreifende Zellen und ohne Blockinhalt. Eine `.docx`-Tabelle ist eine verschachtelte Struktur aus Zeilen und Zellen mit Verbindungen, vertikaler Ausrichtung, verschachtelten Tabellen und Absätzen in den Zellen.

Ein einfaches Gitter konvertiert gut. Alles andere verfällt: eine verbundene Kopfzelle wird eine Zelle und die Spalten verschieben sich, eine Zelle mit einer Punktliste wird eine Zelle mit dem zusammenlaufenden Text der Liste, eine verschachtelte Tabelle wird abgeflacht oder verworfen. Schlimmer: das Ergebnis sieht meist plausibel aus. Das Scheitern ist kein Durcheinander auf der Seite, es ist eine Tabelle, die sich korrekt liest und die falschen Daten in der falschen Spalte hat. Zählen Sie die Spalten in der Ausgabe gegen die Spalten in Word, an der breitesten Tabelle des Dokuments, bevor Sie irgendeiner davon vertrauen — [Tabellen brechen in beide Richtungen am häufigsten](/blog/markdown-tables-that-survive-conversion).

Kopfzeilen verschwinden aus einem bestimmten Grund, den man kennen sollte: Word markiert eine Kopfzeile mit einer Tabellenzeilen-Eigenschaft, und ein Konverter, der sie ignoriert, erzeugt eine Tabelle, deren erste Zeile eine gewöhnliche Datenzeile ist. Markdown verlangt eine Kopfzeile, was Sie also bekommen, ist entweder eine Tabelle, in der die erste Datenzeile zur Kopfzeile befördert wurde, oder eine Tabelle mit leerer Kopfzeile und allem um eine Zeile nach unten verschoben.

### Fußnoten, Kommentare und Textfelder

**Fußnoten** leben in `word/footnotes.xml` und werden aus dem Text über ein `w:footnoteReference` referenziert. Sie haben nur in manchen Dialekten einen Ort zum Landen: Fußnoten stehen weder in der CommonMark- noch in der GFM-Spezifikation, sie existieren also als Erweiterungen. Pandocs eigener Markdown-Dialekt hat Fußnotensyntax; ein Konverter, der auf strenges CommonMark zielt, muss sie in den Text ziehen, sie am Ende als gewöhnliche Absätze anhängen oder sie verwerfen. Scrollen Sie an das Ende der Ausgabe und sehen Sie nach, bevor Sie etwas annehmen.

**Kommentare** sind ein Gespräch, das an einen Textbereich gehängt ist, und Markdown hat keinen Anker, an den man eines hängen könnte. Pandocs Handbuch stellt fest, dass `accept` und `reject` Kommentare beide ignorieren und nur `--track-changes=all` sie einschließt. mammoth lässt sie weg, wenn Sie nicht selbst eine Zuordnung für Kommentarverweise hinzufügen. Alles andere verwirft sie ohne es zu sagen. Der Review-Strang ist oft das Wertvollste in einem Dokument und das Erste, was verschwindet.

**Textfelder und Formen** sind Zeichenobjekte, nicht Teil des Dokumentflusses. Der Text in einem davon kann im XML fast überall stehen, relativ zu dort, wo er auf der Seite erscheint, und er verschwindet häufig. Das ist der Verlust, den Leute am schwersten glauben, denn das hervorgehobene Zitat war doch direkt auf dem Bildschirm. Suchen Sie in der Ausgabe nach einer Formulierung, von der Sie wissen, dass sie in einem Textfeld stand; fehlt sie, war sie nie im Fluss.

Und dann die Dinge ohne jede Markdown-Entsprechung: Schriften, Schriftgrößen, Farben, Ränder, Seitengröße, Seitenumbrüche, Kopf- und Fußzeilen und Seitenzahlen. Nicht „schlecht unterstützt" — in der Syntax nicht vorhanden. Ein Werkzeug, das sie scheinbar behält, gibt rohes HTML mit `style`-Attributen aus, und das ist ein anderes Dokument in der Kleidung einer Markdown-Erweiterung.

## Die Prüfliste: was in der konvertierten Datei zu lesen ist

Tun Sie das einmal, an einem repräsentativen Dokument, bevor Sie zweihundert konvertieren. Es dauert etwa zehn Minuten und ist mehr wert als jede Vergleichstabelle, die obige eingeschlossen, denn Ihre Dokumente sind nicht die von irgendwem anders.

1. **Lesen Sie die Überschriften als Liste.** `grep -n "^#" report.md` gibt Ihnen die Gliederung des Dokuments auf einem Bildschirm. Ist sie kurz, sind Überschriften zu Absätzen geworden — sehen Sie nach `**Fette Zeile**` allein auf einer Zeile, denn das wird aus einer von Hand formatierten Überschrift.
2. **Finden Sie die Listen.** Suchen Sie nach Zeilen, die mit `1.`, `-` oder `*` beginnen. Hatte das Dokument nummerierte Abläufe und die Ausgabe hat keine, prüfen Sie zuerst `word/numbering.xml`, bevor Sie irgendetwas anderes tun.
3. **Prüfen Sie die Listenverschachtelung.** Unterpunkte sollten unter ihren Eltern eingerückt sein. Abgeflachte Unterebenen sind häufig und verändern die Bedeutung eines Ablaufs.
4. **Zählen Sie die Spalten der breitesten Tabelle.** Vergleichen Sie mit Word. Prüfen Sie dann, ob die Kopfzeile die Kopfzeile ist und nicht die zur Kopfzeile beförderte erste Datenzeile.
5. **Sehen Sie nach den Bildverweisen.** `grep -n "!\[" report.md` listet sie. Bestätigen Sie dann, dass die Dateien an diesen Pfaden existieren, oder dass die Data-URIs da sind — ein Verweis auf eine Datei, die nie extrahiert wurde, erscheint als kaputtes Bild, und nichts warnt Sie.
6. **Scrollen Sie ans Ende.** Fußnoten und Endnoten erscheinen entweder hier, erscheinen im Text oder erscheinen nicht. Jedes davon kann akzeptabel sein; nicht zu wissen, was Sie bekommen haben, ist es nicht.
7. **Suchen Sie nach einer Formulierung, von der Sie wissen, dass sie in einem Textfeld, einer Beschriftung oder einem Hinweiskasten stand.** Das ist der Test für die Verluste, die nichts meldet.
8. **Suchen Sie nach einer Formulierung, von der Sie wissen, dass sie im Review gelöscht wurde.** Ist sie da, wurden verfolgte Änderungen als Text behalten. Ist eine gelöschte Formulierung weg und Sie brauchten die Historie, haben Sie mit der falschen Einstellung konvertiert.
9. **Sehen Sie sich den Anfang der Datei an.** Ein feldbasiertes Inhaltsverzeichnis von Word wird zu dem Text, der bei der letzten Aktualisierung von Word zwischengespeichert war, samt Seitenzahlen, die auf Seiten zeigen, die es nicht mehr gibt. Löschen Sie es und lassen Sie Ihren Renderer ein neues bauen.
10. **Öffnen Sie das Markdown in einem Renderer, nicht in einem Editor.** Der Editor zeigt Ihnen die Syntax; der Renderer zeigt, was ein Leser bekommt. Sie widersprechen sich häufiger, als man erwartet.

In PowerShell sind der erste, zweite und fünfte Punkt:

```powershell
Select-String -Path report.md -Pattern '^#'
Select-String -Path report.md -Pattern '^\s*(\d+\.|[-*])\s'
Select-String -Path report.md -Pattern '!\['
```

| Symptom in der Ausgabe | Was tatsächlich passiert ist | Was zu tun ist |
| --- | --- | --- |
| Überschriften sind fette Absätze | Das Dokument hatte keine Überschriftenstile, oder eigene | Echte Stile in Word anwenden, oder eine Stilzuordnung schreiben |
| Nummerierte Listen sind einfache Absätze | `numbering.xml` fehlt oder ist nicht auflösbar | Das Archiv prüfen; aus einem Textprogramm neu speichern |
| Unterpunkte stehen auf der obersten Ebene | Einrückungsebenen verloren oder abgeflacht | Von Hand richten; es gibt kein Flag dafür |
| Die Kopfzeile der Tabelle ist eine Datenzeile | Die Kopfzeilen-Eigenschaft wurde ignoriert | Von Hand richten, oder stattdessen über HTML konvertieren |
| Spalten passen nicht zusammen | Verbundene oder verschachtelte Zellen abgeflacht | Die Tabelle umbauen; Markdown kann keine Verbindungen ausdrücken |
| Kaputte Bildsymbole | Verweise extrahiert, Dateien nicht | Mit `--extract-media` oder einem Ausgabeverzeichnis neu ausführen |
| Eine Zeile der Datei hat 40 000 Zeichen | Bilder als Data-URIs eingebettet | Auf einen Weg wechseln, der Dateien schreibt |
| Fußnotentext fehlt | Der Zieldialekt hat keine Fußnotensyntax | Einen Dialekt nehmen, der sie hat, oder das Einziehen akzeptieren |
| Kommentare weg | Jeder Weg außer einem verwirft sie | `--track-changes=all`, und das Original behalten |
| Ein hervorgehobenes Zitat fehlt vollständig | Es stand in einem Textfeld | Von Hand hinüberkopieren |

## Wie Sie einen Weg wählen

1. **Entscheiden Sie, wohin die Datei gehen darf, bevor Sie ein Werkzeug wählen.** Eine README kann überall hochgeladen werden. Ein unterschriebener Vertrag, ein unveröffentlichtes Ergebnis oder irgendetwas mit medizinischen Angaben einer Person nicht — und für eines davon einen gehosteten Konverter zu wählen ist eine Offenlegung statt einer Konvertierung. Konvertierung im Browser behält die Datei auf dem Rechner, und das können Sie im Netzwerk-Tab überprüfen.
2. **Zählen Sie die Dokumente, dann die Klicks.** Eine Datei rechtfertigt nicht, ein Haskell-Programm zu installieren. Zweihundert Dateien rechtfertigen keinen Browser-Tab und keinen Menschen, der darin klickt. Die Installation wird einmal bezahlt; das Klicken jedes Mal, was die Antwort irgendwo zwischen fünf und fünfzig Dateien kippen lässt.
3. **Stellen Sie fest, ob das Dokument ein Review hinter sich hat.** Verfolgte Änderungen und Kommentare werden fast überall standardmäßig verworfen. Zählt das Review, ist `--track-changes=all` der dokumentierte Weg, es zu behalten — und wenn Sie nicht Pandoc verwenden, akzeptieren Sie, dass es weg ist, statt es später zu entdecken.
4. **Entscheiden Sie vor der Konvertierung, was mit den Bildern passieren soll, nicht danach.** Dateien in einem Ordner, oder Base64 im Markdown. Beides ist vertretbar; keines bekommt man versehentlich, und das Versehen sind meist Verweise, die auf nichts zeigen.
5. **Finden Sie heraus, ob das Dokument echte Stile verwendet.** Öffnen Sie es in Word und klicken Sie eine Überschrift an: sagt das Stilfeld „Überschrift 1", funktioniert jeder Weg. Sagt es „Standard", funktioniert keiner, und die Abhilfe liegt im Dokument statt im Werkzeug.
6. **Behalten Sie die `.docx`.** Alles im Abschnitt oben ist einseitig. Archivieren Sie das Original, wo Sie es finden können, denn der Tag, an dem jemand fragt, was im gelöschten Absatz stand, ist der Tag, an dem Sie lernen, dass die Antwort nur in der Datei stand, die Sie gelöscht haben.

## Fazit

Eine `.docx` in Markdown umzuwandeln ist keine Übersetzung, es ist Triage. Wenn das Dokument in Google Docs lebt statt auf der Platte, [hat dieser Export seine eigene Antwort](/blog/convert-google-docs-to-markdown). Die Arbeit ist Triage: das Archiv entpacken, auflösen, was auflösbar ist, und den Verlust all dessen akzeptieren, für das Markdown keine Syntax hat. Zu wissen, dass die Antworten im Archiv liegen, macht aus fast jedem mysteriösen Scheitern eine Zwei-Minuten-Prüfung — kein `numbering.xml`, keine Listen; keine Überschriftenstile, keine Überschriften; kein `--extract-media`, keine Bilder. Für ein einzelnes Dokument ist der kürzeste ehrliche Weg ein Konverter, der in Ihrem Browser läuft, und das ist, was [die Word-zu-Markdown-Konvertierung von TransformPipe](/word-to-markdown) tut, kostenlos, ohne Installation und ohne Upload, solange Sie abgemeldet sind. Für ein Verzeichnis, für Bilder auf der Platte oder für ein Dokument mit Review installieren Sie Pandoc. Für die Konvertierung im eigenen Code nehmen Sie mammoth, lesen seine `messages` und wandeln sein HTML statt seines Markdown. Und gehen Sie dann die Prüfliste durch, denn die Verluste, die zählen, sind die leisen — und [eine Bestandsaufnahme jedes einzelnen davon, mit einem Urteil darüber, welchen man nachtrauern und über welchen man froh sein sollte](/blog/what-not-to-keep-from-a-docx), ist das, was man liest, bevor man entscheidet, dass irgendetwas davon behaltenswert war.

## FAQ

### Wie wandle ich eine .docx in Markdown um, ohne etwas zu installieren?

Nehmen Sie einen Konverter, der im Browser läuft: er entpackt und liest das Archiv mit JavaScript auf Ihrem eigenen Rechner, es gibt also nichts zu installieren und, abgemeldet, nichts hochzuladen. Bestätigen Sie das Letzte, indem Sie beim Konvertieren den Netzwerk-Tab öffnen. Der andere Weg ohne Installation ist Kopieren und Einfügen, das Überschriften, Listen und Links über die HTML-Zwischenablage mitnimmt und jedes Bild verliert.

### Warum sind meine nummerierten Listen als einfache Absätze herausgekommen?

Weil die zweifache Suche in `numbering.xml` gescheitert ist. Ein Listenabsatz in Word trägt nur eine Nummerierungs-ID und eine Einrückungsebene; das Format lebt in diesem getrennten Teil des Archivs, und wenn er fehlt oder Definitionen referenziert, die er nicht enthält, kann der Konverter nicht erkennen, dass der Absatz jemals ein Listenelement war. Entpacken Sie die `.docx` und prüfen Sie auf `word/numbering.xml`, bevor Sie das Werkzeug beschuldigen.

### Was ist der beste Befehl, um docx in Markdown umzuwandeln?

`pandoc -f docx -t gfm --wrap=none --extract-media=./media -o out.md in.docx` deckt die meisten Fälle ab: GitHub Flavored Markdown, damit Tabellen überleben, kein Neuumbruch der Absätze, damit Diffs lesbar bleiben, und Bilder in einen Ordner geschrieben statt im Archiv gelassen. Ergänzen Sie `--track-changes=all`, wenn das Dokument ein Review hinter sich hat.

### Kann ich eine .doc statt einer .docx konvertieren?

Nicht direkt mit einem dieser Wege — das alte binäre `.doc` ist ein völlig anderes Format ohne Zip und ohne XML. Wandeln Sie es zuerst mit LibreOffice im Headless-Modus um, `soffice --headless --convert-to docx old.doc`, und konvertieren Sie dann die entstandene `.docx`. Rechnen Sie damit, dass der erste Schritt der mit den Überraschungen ist, denn er ist eine vollständige Konvertierung für sich.

### Kommen die Bilder automatisch mit?

Nein, denn Markdown verweist immer nur auf eine Bilddatei statt eine zu enthalten. Pandocs `--extract-media` schreibt sie in ein Verzeichnis, mammoth bettet sie standardmäßig als Data-URIs ein oder übergibt sie einem Callback, den Sie schreiben, und Kopieren und Einfügen verliert sie vollständig. Prüfen Sie die Bilder, bevor Sie das Ausgangsdokument löschen.

### Warum funktionieren die Überschriften in einem Dokument und im anderen nicht?

Weil Überschrift-Sein als Stilverweis gespeichert ist, nicht als Eigenschaft des Textes. Ein Dokument, dessen Überschriften aus der Stilgalerie kamen, konvertiert sauber; ein Dokument, dessen Überschriften 18 pt fetter Text sind, hat keinen Stilverweis aufzulösen, es gibt also nichts, was ein Konverter finden könnte. Das Werkzeug verhält sich in beiden Fällen gleich — die Dokumente sind verschieden.

### Ist der Weg über HTML besser als direkt nach Markdown zu konvertieren?

Meist ja, und es ist, was mammoths Autoren empfehlen. HTML hat ein Element für fast alles, was in einer `.docx` steckt, der erste Schritt verliert also fast nichts, und der zweite Schritt trifft dann eine klare Entscheidung darüber, was Markdown nicht ausdrücken kann. In einem einzigen Sprung zu konvertieren heißt, dass diese Entscheidungen lautlos getroffen werden, tief im Leser, wo Sie sie nicht sehen und nicht ändern können.
