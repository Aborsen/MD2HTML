---
title: "Google Docs in Markdown umwandeln: alle Wege und was sie kosten"
description: "Google Docs exportiert Markdown inzwischen selbst. Was der native Export behält, wann der Weg über .docx besser ist und was Markdown nicht halten kann"
date: 2026-09-04
tag: Konvertieren
keywords: google docs in markdown umwandeln, google docs zu markdown, google doc als markdown exportieren, google docs markdown export, docs to markdown add-on, google doc als md herunterladen, google docs markdown mit bildern
---

Ein Google Doc ist keine Datei. Es ist ein Dokumentmodell, das auf Googles Servern lebt, und jeder Weg, es auf Ihre Platte zu bekommen, ist ein Export — eine verlustbehaftete Übertragung dieses Modells in eine andere Form. Markdown ist die kleinste Form auf der Karte. Es hat sechs Überschriftenebenen, Hervorhebung, Listen, Links, Code und, wenn Sie mit dem Dialekt Glück haben, Tabellen. Alles andere in Ihrem Dokument muss verworfen, abgeflacht oder nachgeahmt werden.

Meistens ist genau das, was Sie wollen. Sie haben den Entwurf dort geschrieben, wo die Kommentare und die Mitautoren waren, und jetzt muss er in einem Repository, auf einer statischen Website oder in einem Wiki leben, als Text, den ein Diff lesen kann. Die Reibung liegt darin, dass die Verluste lautlos sind. Sie laden die `.md` herunter, überfliegen den ersten Bildschirm, sehen Ihre Überschriften — und merken erst drei Wochen später, dass die Tabelle im Anhang ihre verbundene Kopfzeile verloren hat, dass die Bilder fehlen und dass die vierzehn offenen Kommentare, der Grund, warum sich überhaupt jemand für dieses Dokument interessiert hat, im Export nie existiert haben.

Es gibt fünf Wege hinaus, und sie verlieren Verschiedenes. Der native Markdown-Export, der `.docx`-Download mit nachgelagerter Konvertierung, der gezippte HTML-Download, ein Add-on, das in Docs selbst läuft, und die Zwischenablage. Dieser Text handelt davon, welchen davon Sie nehmen sollten, und von den konkreten Google-Docs-Funktionen, die kein Weg mitnehmen kann, weil Markdown keine Syntax für sie hat.

### Kurzfassung

Ist das Dokument Text — Überschriften, Absätze, Listen, Links, etwas Hervorhebung —, nehmen Sie den nativen Export: **Datei → Herunterladen → Markdown (.md)**, den Google zusammen mit dem Markdown-Import, Copy as Markdown und Paste from Markdown eingeführt hat (geprüft auf workspaceupdates.googleblog.com, 8. September 2026). Enthält es Bilder, Tabellen mit verbundenen Zellen oder Fußnoten, die erhalten bleiben müssen, laden Sie es als **`.docx` herunter und konvertieren das**, oder als **gezipptes HTML**, denn beide tragen Struktur, für die der `.md`-Export keinen Platz hat. Kommentare, Vorschläge, Seitenumbrüche, Kopf- und Fußzeilen und Zeichnungen gehen nicht durch einen schlechten Konverter verloren — Markdown hat für all das einfach keine Syntax. Lösen Sie die Kommentare also auf und nehmen Sie die Vorschläge an, bevor Sie irgendetwas exportieren.

## Warum Markdown aus einem Google Doc herauszuholen kniffliger ist, als es aussieht

Die Umständlichkeit beginnt damit, wo der Inhalt tatsächlich liegt. Der Text eines Google Docs steht an einer Stelle, seine Kommentare an einer zweiten und seine Änderungsvorschläge an einer dritten. Das ist keine Metapher: Kommentare und Antworten sind eigene Ressourcen in der Drive API und nicht Teil des Dokumentkörpers, und jeder Kommentar ist entweder an einen Bereich einer bestimmten Revision verankert oder unverankert und an die Datei als Ganzes gehängt (geprüft auf developers.google.com, 8. September 2026). Vorschläge liegen im Dokument, aber als parallele Schicht — deshalb müssen Sie beim programmatischen Lesen einen Ansichtsmodus wählen: `SUGGESTIONS_INLINE` ist der einzige Modus, dessen Indizes Sie für eine anschließende Bearbeitung verwenden können, und `PREVIEW_SUGGESTIONS_ACCEPTED` gibt Ihnen den Text so, wie er zu lesen wäre, wenn jeder Vorschlag angenommen würde (geprüft auf developers.google.com, 8. September 2026).

Ein Export muss sich für eine Schicht entscheiden und die anderen wegwerfen. Er entscheidet sich für den Körpertext. Das Review-Gespräch — der Teil eines Google Docs, mit dem Word und Markdown und alles andere am schlechtesten umgehen — ist also weg, noch bevor die Konvertierung beginnt. Kein Werkzeug auf dieser Seite kann das ändern, und jedes Werkzeug, das behauptet, Ihre Kommentare zu behalten, legt sie in eine getrennte Datei oder beschreibt etwas anderes.

Das zweite Problem ist, dass Markdown nicht ein einziges Ziel ist. Reines CommonMark hat keine Tabellen, kein Durchstreichen und keine Aufgabenlisten; GitHub Flavored Markdown ergänzt alle drei; Fußnoten stehen in keiner der beiden Spezifikationen und existieren nur als Erweiterung. „Behält es Tabellen?" ist also zum Teil eine Frage über den Exporter und zum Teil eine Frage darüber, welchen Dialekt er schreibt, und in jedem Vergleich, den Sie lesen werden, werden die beiden vermischt. Googles eigene Hilfeseite beschreibt die Syntax, die Docs beherrscht, als Überschriften auf sechs Ebenen, Kursiv, Fett, Fett-Kursiv, Durchgestrichen und Links (geprüft auf support.google.com, 8. September 2026) — eine kurze Liste und eine treffende Beschreibung der Ambitionen des nativen Exports.

Das dritte Problem sind die Bilder. Eine `.md`-Datei ist eine Textdatei. Daneben liegt kein Ordner, darum liegt kein Archiv, und Markdowns Bildsyntax ist ein Pfad oder eine URL — sie hält einen Verweis, niemals die Bytes. Jeder Markdown-Export in eine einzige Datei muss also entweder auf einen Ort zeigen, an dem das Bild noch liegt, es als kodierten Block einbetten oder eine Lücke lassen. Keines der drei ist, was Sie wollten, und darum ist das bildreiche Dokument der Fall, in dem der native Export aufhört, die richtige Antwort zu sein. [Relative Pfade und was bricht, wenn die Datei umzieht](/blog/images-and-links-that-still-work) ist die allgemeine Fassung dieses Problems, und sie gilt mit voller Kraft, sobald aus einem Google Doc eine `.md` in einem Repository wird.

## Der schnelle Vergleich: das Merkblatt

| Weg | Am besten für | Was er behält | Was er verliert | Preis |
| --- | --- | --- | --- | --- |
| Datei → Herunterladen → Markdown (.md) | Ein Textdokument, sofort | Überschriften, Listen, Links, Hervorhebung, Durchgestrichenes, einfache Tabellen | Bilder als Dateien, Kommentare, Vorschläge, Seitenlayout | Kostenlos mit einem Google-Konto |
| Datei → Herunterladen → Word (.docx), dann konvertieren | Bilder, komplexe Tabellen, Stapel, alles Skriptbare | Was der zweite Konverter behält; Bilder als echte Dateien | Kommentare und Vorschläge sind weiterhin weg | Kostenlos; der Konverter braucht eventuell eine Installation |
| Datei → Herunterladen → Webseite (.html, gezippt) | Dokumente, in denen die Bilder am meisten zählen | Die volle HTML-Struktur plus einen Bilderordner | Nichts, was Markdown wollte, aber Sie konvertieren zweimal | Kostenlos mit einem Google-Konto |
| Add-on Docs to Markdown | Einen Teil eines Dokuments konvertieren | Fußnoten, verbundene Tabellenzellen, Überschriftenstruktur | Bilder werden zu Pfad-Platzhaltern, die Sie füllen müssen | Kostenlos, Apache 2.0 |
| Copy as Markdown (Rechtsklick) | Ein paar Absätze | Inline-Formatierung und Links | Alles, was nicht markiert ist; Bilder | Kostenlos, standardmäßig aus |
| Kopieren und in einen Markdown-Editor einfügen | Einen Abschnitt, in ein Werkzeug, das Sie schon nutzen | Was der Einfüge-Handler des Ziels versteht | Schwankt stark je Editor | Kostenlos |
| Docs API und Apps Script | Viele Dokumente, nach Zeitplan | Alles, wofür Sie Code schreiben | Alles, wofür Sie keinen Code schreiben | Kostenlos; Sie schreiben es |
| Drive-API-Export nach `text/markdown` | Den nativen Export automatisieren | Dasselbe wie Datei → Herunterladen | Dasselbe wie Datei → Herunterladen | Kostenlos; API-Kontingent gilt |

## Der native Markdown-Export, und was er tatsächlich behält

Google Docs exportiert Markdown selbst. Der Weg ist Datei → Herunterladen → Markdown (.md), und er kommt mit drei Begleitern: dem Markdown-Import, sodass eine über Datei → Öffnen geöffnete `.md` zu einem Doc wird; Copy as Markdown im Rechtsklickmenü für eine Auswahl; und Paste from Markdown für die Rückreise (geprüft auf support.google.com, 8. September 2026). Import und Export sind standardmäßig an. Das Paar aus Kopieren und Einfügen ist standardmäßig aus und liegt hinter Tools → Einstellungen → Enable Markdown (geprüft auf workspaceupdates.googleblog.com, 8. September 2026). Steht Copy as Markdown nicht in Ihrem Kontextmenü, ist diese Einstellung der Grund.

Derselbe Export steht auch dem Code zur Verfügung. Google-Docs-Dateien lassen sich über die Drive API in neun MIME-Typen exportieren — `.docx`, `.odt`, `.rtf`, `.pdf`, `text/plain`, `text/html`, gezipptes HTML, EPUB und `text/markdown` (geprüft auf developers.google.com, 8. September 2026). Der letzte ist der native Export durch eine andere Tür, und das zählt, wenn Sie dasselbe Ergebnis ohne einen Menschen am Menü haben wollen.

| Vorteile | Nachteile |
| --- | --- |
| Keine Installation, kein Add-on, kein Dritter dazwischen | Bilder sind die Schwachstelle: eine einzelne `.md` hat keinen Ordner für sie |
| Das ganze Dokument in einem Schritt | Nichts ist auswählbar — es ist das Dokument oder nichts |
| Rückweg: importieren Sie eine `.md` zurück in Docs, und sie wird wieder ein Doc | Kommentare und Vorschläge fehlen, ohne einen Hinweis, dass es sie gab |
| Über die Drive API mit dem Exporttyp `text/markdown` skriptbar | Überhaupt keine Optionen: keine Dialektwahl, kein Bildverzeichnis, kein Front Matter |
| Kostenlos mit dem Konto, das Sie schon haben | Seitenlayout, Kopf- und Fußzeilen und Abschnittsumbrüche haben keinen Platz |

**Preis:** kostenlos mit einem Google-Konto.

**Technische Details und Funktionen**

- Datei → Herunterladen → Markdown (.md) für das ganze Dokument; die Datei ist einfacher UTF-8-Text
- Rechtsklick → Copy as Markdown für eine Auswahl, sobald Tools → Einstellungen → Enable Markdown angehakt ist
- Rechtsklick → Paste from Markdown wandelt Markdown aus der Zwischenablage in Docs-Formatierung um
- Datei → Öffnen → Hochladen oder Drive → Öffnen mit → Google Docs importiert eine `.md`-Datei als Doc
- Die Drive API stellt dieselbe Konvertierung als Export-MIME-Typ `text/markdown` bereit

**Für wen ist das?** Jeden, dessen Dokument wirklich Text ist. Eine Besprechungsnotiz, eine Spezifikation, ein Blogentwurf, eine README, die in Docs geschrieben wurde, weil die Prüfer dort waren. Wenn Sie das ganze Dokument durchscrollen können und nichts sehen als Überschriften, Absätze, Listen, Links und die eine oder andere Tabelle, ist das der Weg, und alles darunter ist unnötige Arbeit.

## Als .docx herunterladen und dann die .docx konvertieren

Der andere Weg ist, Google eine `.docx` erzeugen zu lassen und die einem Konverter zu geben, der für die Aufgabe gebaut ist. Es klingt nach dem Umweg, und es ist häufig besser, aus einem Grund: eine `.docx` ist ein Zip-Archiv mit einem `media`-Ordner darin, die Bilder überleben die erste Etappe der Reise also als echte Dateien. Die zweite Etappe hat dann einen Ort, an den sie die Bilder legen kann.

Damit öffnet sich außerdem die Tür zu jeder Option, die der native Export nicht hat. Pandocs `.docx`-Leser nimmt `--extract-media`, um die eingebetteten Bilder in ein Verzeichnis zu schreiben und die Verweise passend umzuschreiben, und `--track-changes` mit `accept`, `reject` oder `all`, um zu entscheiden, was mit Revisionsmarken passiert — die einzige dokumentierte Antwort auf verfolgte Änderungen auf dieser Seite. Es ist kostenlos und GPL-lizenziert, in Haskell geschrieben, und es muss installiert werden. Ein Konverter im Browser macht denselben ersten Schritt ohne Installation: die `.docx` auf Ihrem eigenen Rechner lesen und Markdown zurückgeben — das ist, was [TransformPipes Konvertierung von Word zu Markdown](/word-to-markdown) tut, und was das [weitere Feld der `.docx`-Konverter](/blog/best-word-to-markdown-converters) mit unterschiedlicher Sorgfalt tut.

| Vorteile | Nachteile |
| --- | --- |
| Bilder kommen als echte Dateien im Archiv an, ein Konverter kann sie also herausziehen | Zwei Konvertierungen statt einer, und zwei Gelegenheiten, etwas zu verlieren |
| Echte Optionen: Bildextraktion, Dialektwahl, Tabellenbehandlung | Die `.docx` ist eine Zwischendatei, die Sie im Auge behalten müssen |
| Skriptbar und stapelbar — ein Verzeichnis voller `.docx`-Dateien ist eine Shell-Schleife | Googles `.docx`-Schreiber hat eigene Eigenheiten, die Sie erben |
| Funktioniert mit den Werkzeugen, die Ihr Build schon hat | Kommentare und Vorschläge sind trotzdem weg: Google hat sie beim Download fallen gelassen |
| Sie wählen Ihren Konverter selbst und damit auch seine Kompromisse | Mehr Schritte, die man jemandem erklären muss, der einfach nur den Text will |

**Preis:** kostenlos. Pandoc ist kostenlos und GPL-lizenziert; ein Konverter, der im Browser läuft, kostet nichts und braucht keine Installation.

**Technische Details und Funktionen**

- Datei → Herunterladen → Microsoft Word (.docx) erzeugt ein normales Office-Open-XML-Archiv
- Überschriften überleben als Absätze, die einen `w:pStyle`-Verweis tragen, und genau darauf sehen Konverter
- `pandoc --from docx --to gfm --extract-media=./media report.docx -o report.md` schreibt die Bilder neben den Text
- `--track-changes=accept` löst Revisionsmarken zum angenommenen Text auf, statt Markup in der Prosa zu lassen
- Eine `.docx` öffnet sich auch in Word, LibreOffice und allem anderen, was sie zu einem nützlichen Kontrollpunkt macht

**Für wen ist das?** Jeden mit Bildern, jeden, der mehr als ein Dokument konvertiert, und jeden, dessen Ausgabe ein bestimmtes Ziel erfüllen muss — eine Doku-Website mit einem strikten Bildverzeichnis, ein Repository mit einem Linter, ein Wiki, das nur CommonMark annimmt. Außerdem jeden, der das Zwischenergebnis prüfen will: ist das Markdown falsch, können Sie die `.docx` öffnen und sehen, ob das Problem an Googles Export oder an Ihrem Konverter lag.

## Als gezipptes HTML herunterladen, wenn die Bilder am meisten zählen

Datei → Herunterladen → Webseite (.html, gezippt) gibt Ihnen ein Archiv, das das Dokument als HTML und seine Bilder als getrennte Dateien in einem Ordner enthält. Das ist der Export des sichtbaren Dokuments mit der höchsten Treue, den Google anbietet, und der, nach dem Sie greifen sollten, wenn die Bilder der Punkt sind — ein Design-Review, ein Runbook voller Screenshots, ein Bericht mit eingefügten Diagrammen.

Danach haben Sie ein HTML-zu-Markdown-Problem, und das ist ein gut gelöstes. Die [HTML-zu-Markdown-Konverter](/blog/best-html-to-markdown-converters) beherrschen alle die strukturellen Elemente; die Arbeit liegt darin, Googles Inline-Stile wegzuwerfen, die reichlich vorhanden sind, und die Bildpfade so zu richten, dass sie auf den Ort zeigen, an dem die Bilder gelandet sind.

| Vorteile | Nachteile |
| --- | --- |
| Bilder kommen als Dateien in einem Ordner heraus, benannt und vollständig | Googles HTML ist schwer von Inline-Stilen und generierten Klassennamen |
| HTML hat für fast alles ein Element, was Docs ausdrücken kann | Zwei Konvertierungen, und die zweite muss konfiguriert werden |
| Tabellen kommen als echtes `<table>`-Markup an, verbundene Zellen inklusive | Die Bilddateinamen sind Googles, nicht Ihre, und die Pfade müssen umgeschrieben werden |
| Leicht zu prüfen: das HTML im Browser öffnen und genau sehen, was Sie haben | Das Zip ist ein Behälter zum Auspacken, also ein Schritt mehr in einem Skript |

**Preis:** kostenlos mit einem Google-Konto.

**Technische Details und Funktionen**

- Das Archiv enthält eine `.html`-Datei und ein Bilderverzeichnis
- Über die Drive API ebenso als Exporttyp für gezipptes HTML verfügbar wie aus dem Menü
- Überschriftenelemente sind echte `<h1>`- bis `<h6>`-Tags, die Überschriftenstruktur wandelt sich also sauber um
- Tabellen sind HTML-Tabellen, das heißt `colspan` und `rowspan` überleben bis ins HTML — [was danach mit ihnen passiert](/blog/markdown-tables-that-survive-conversion), hängt vollständig von dem Markdown-Dialekt ab, in den Sie schreiben
- Stil-Attribute stehen inline an fast jedem Element und lassen sich gefahrlos vollständig verwerfen

**Für wen ist das?** Screenshot-lastige Dokumente und jeden, der sehen will, was Google für den Inhalt des Dokuments hält, bevor er entscheidet, was davon bleibt. Das HTML ist weitschweifig, und es ist ehrlich: was in der Datei steht, stand im Dokument.

## Die Wege, die nicht Datei → Herunterladen sind

Drei Wege hinaus, die das Download-Menü nie berühren. Sie existieren, weil Sie manchmal einen Teil eines Dokuments wollen, oder es jetzt wollen, oder es für zweihundert Dokumente ohne einen Menschen dazwischen wollen.

### Docs to Markdown, das Add-on

Docs to Markdown, unter seinem Repository-Namen gd2md-html bekannt, ist ein Google-Docs-Add-on, das sich als Seitenleiste öffnet und das Dokument — oder nur die Auswahl — in Markdown oder HTML umwandelt. Es ist kostenlos und Apache-2.0-lizenziert, wird aus dem Google Workspace Marketplace installiert und verlangt nur zwei Berechtigungen: Zugriff auf das aktuelle Dokument und die Erlaubnis, eine Seitenleiste zu erzeugen (geprüft auf github.com/evbacher/gd2md-html, 8. September 2026).

Es geht mit der Dokumentstruktur sorgfältiger um als der native Export und ist ungewöhnlich ehrlich über seine Grenzen. Fußnoten werden zu normalen Markdown-Fußnoten. Tabellen werden auch in der Markdown-Ausgabe zu HTML-Tabellen, und so behält es verbundene Zeilen und Spalten; eine Tabelle mit einer einzigen Zelle wird zu einem Codeblock. Bilder werden zu Platzhalterpfaden der Form `images/image1.png`, und die Dokumentation sagt Ihnen unverblümt, dass Sie die Bilder auf Ihren Server verschieben und die Pfade ändern müssen — und warnt, dass die Reihenfolge der Bilder im Zip nicht immer die Reihenfolge ist, in der sie im Dokument erscheinen, prüfen Sie also jedes einzelne. Formeln lösen eine rote Warnung aus, die MathJax oder LaTeX vorschlägt, falls Ihre Publikationsplattform das unterstützt. Und wie bei jedem `.docx`- und Docs-Konverter werden Überschriften nur konvertiert, wenn es echte Überschriftenstile sind: Text, der lediglich fett und groß ist, wandelt sich als gewöhnlicher Absatz um.

| Vorteile | Nachteile |
| --- | --- |
| Konvertiert eine Auswahl, was Datei → Herunterladen nicht kann | Nur Google Docs, und Sie müssen es installieren |
| Fußnoten und verbundene Tabellenzellen überleben | Verbundene Zellen überleben als HTML in Ihrem Markdown, was nicht jeder Renderer annimmt |
| Warnt Sie davor, was es nicht konvertieren konnte, statt lautlos zu scheitern | Bilder sind Platzhalter: die Dateien müssen Sie weiterhin selbst liefern |
| Kostenlos und Open Source, mit einem engen Berechtigungsumfang | Ein Dokument auf einmal, in einer Seitenleiste |

**Preis:** kostenlos, Apache-2.0-lizenziert.

**Für wen ist das?** Leute, die regelmäßig aus Docs heraus veröffentlichen, besonders in eine Plattform, die Fußnoten will. Außerdem jeden, der einen Abschnitt eines langen Dokuments braucht statt des Ganzen — das allein ist ein Grund, es zu installieren.

### Kopieren und Einfügen über die HTML-Zwischenablage

Wer aus einem Google Doc kopiert, legt zwei Dinge in die Zwischenablage: einfachen Text und eine HTML-Variante. Die HTML-Variante trägt die Struktur — Überschriften als Überschriftenelemente, Listen als Listen, Links als Anker, Fett als `<b>` oder als Stil. Ein Editor mit einem Einfüge-Handler, der diese Variante liest und umwandelt, kann eine eingefügte Auswahl zu Markdown machen, ohne dass irgendwo eine Datei entsteht.

Das funktioniert weit besser, als es sollte, und es ist für ein paar Absätze der schnellste Weg, der existiert. Wo es bricht, ist vorhersehbar. Editoren unterscheiden sich enorm darin, was ihre Einfüge-Handler verstehen: manche wandeln Überschriften, Listen und Links um und verwerfen alles andere; manche fügen die Textvariante ein und verlieren jede Struktur; manche fügen rohes HTML in Ihre Markdown-Datei ein. Bilder kommen nie als Dateien mit — im besten Fall bekommen Sie einen Verweis auf eine Google-URL, die nur funktioniert, solange Sie angemeldet sind, im schlechtesten Fall nichts. Und Googles HTML setzt Inline-Stile an fast alles, ein naiver Handler erzeugt also Markdown, das mit `<span>`-Tags übersät ist.

| Vorteile | Nachteile |
| --- | --- |
| Sofort, ohne Download und ohne Installation | Das Verhalten hängt vollständig vom Ziel-Editor ab |
| Behält Inline-Formatierung und Links überraschend gut | Bilder kommen niemals als Dateien mit |
| Funktioniert auf einer Auswahl jeder Größe, auch auf einem einzigen Absatz | Lange Dokumente sind mühsam und leicht falsch zu machen |
| Copy as Markdown macht die Konvertierung in Docs selbst, wenn es aktiviert ist | Googles Inline-Stile sickern durch schwache Einfüge-Handler |

**Preis:** kostenlos. Copy as Markdown verlangt, dass zuvor Tools → Einstellungen → Enable Markdown angehakt ist.

**Für wen ist das?** Jeden, der einen Abschnitt verschiebt, nicht ein Dokument. Wenn Sie mehr als ein paar Bildschirme voll einfügen, machen Sie von Hand, was Datei → Herunterladen in einem Schritt tut.

### Die Docs- und Drive-APIs, für viele Dokumente

Wenn die Antwort ohne einen Menschen laufen muss, gibt es zwei Ebenen. Die aufwandsarme ist der Export-Endpunkt der Drive API mit dem MIME-Typ `text/markdown`: Sie bekommen genau den nativen Export, für jedes Dokument, das Sie lesen dürfen, in einem Skript. Das reicht für die meiste Automatisierung, und es erbt jede Einschränkung des nativen Exports.

Die aufwandsreiche ist die Docs API, die Ihnen das Dokument als strukturiertes JSON gibt — einen Körper aus strukturellen Elementen, Absätze mit benannten Stilen, Tabellen als Reihen von Zellen, Listen gegen Listeneigenschaften aufgelöst. Das Markdown schreiben Sie dann selbst, das heißt: Sie entscheiden, was aus einem Seitenumbruch wird, was mit einem Smart Chip passiert, ob ein Vorschlag angenommen oder abgelehnt wird und wohin die Bilder gehen. Das ist echte Arbeit, und es ist der einzige Weg, auf dem die Verluste Ihre Entscheidungen sind und nicht die Voreinstellungen von jemand anderem.

| Vorteile | Nachteile |
| --- | --- |
| Läuft nach Zeitplan, über beliebig viele Dokumente | Sie schreiben und pflegen einen Konverter |
| Die Docs API legt den Vorschlagszustand offen, Sie können also annehmen oder ablehnen | OAuth-Bereiche, Kontingente und Zugangsdaten zu verwalten |
| Sie steuern die Bildstrategie vollständig | Jede Docs-Funktion, an die Sie nicht denken, ist ein lautloser Fehler |
| Kommentare sind über die Drive API erreichbar, in eine getrennte Datei | Nichts daran geht schnell |

**Preis:** kostenlos; API-Kontingente gelten.

**Für wen ist das?** Teams, deren Dokumentation wirklich in Docs lebt und laufend in einem Repository oder auf einer Website erscheinen muss. Ist es eine einmalige Migration von dreißig Dokumenten, schlagen der `.docx`-Weg und eine Shell-Schleife das Selbstschreiben mit großem Abstand.

## Was Google Docs hat und wofür Markdown keine Syntax hat

Das ist der Teil, den kein Export beheben kann, und der Teil, der es wert ist, gelesen zu werden, bevor Sie einen Konverter beschuldigen. Die Punkte unten sind keine Konvertierungsfehler. Es sind Funktionen ohne Markdown-Entsprechung, also verwirft sie jedes Werkzeug, flacht sie in etwas anderes ab oder gibt HTML aus und hofft, dass Ihr Renderer es erlaubt.

| Google-Docs-Funktion | Nächste Markdown-Entsprechung | Was tatsächlich passiert |
| --- | --- | --- |
| Kommentare und Antworten | Keine | Verworfen. Sie sind eigene Drive-Ressourcen, nicht Dokumentinhalt |
| Änderungsvorschläge | Keine | Auf eine Version des Textes abgeflacht, meist mit angenommenen Vorschlägen |
| Seitenumbrüche | Ein Trennstrich, `---` | Eine waagerechte Linie auf einer Seite, die keine Seiten hat, oder gar nichts |
| Kopf- und Fußzeilen | Keine | Verworfen, Seitenzahlen inklusive |
| Abschnittsumbrüche und Spalten | Keine | Verworfen; mehrspaltiger Text wird eine Spalte in Leserichtung |
| Zeichnungen und eingefügte Diagramme | Ein Bildverweis | Bestenfalls ein Bild, schlimmstenfalls eine Lücke; nie wieder bearbeitbar |
| Smart Chips (Personen, Daten, Dateien) | Einfacher Text oder ein Link | Auf ihre Beschriftung reduziert, oder auf einen Link, den nur Kollegen öffnen können |
| Formeln | Keine, weder in CommonMark noch in GFM | Verworfen, oder als LaTeX ausgegeben, wenn Ihre Plattform es darstellt |
| Inhaltsverzeichnis | Eine handgeschriebene Liste von Links | Eine statische Momentaufnahme, die nicht mehr passt, sobald Sie eine Überschrift ändern |
| Lesezeichen und interne Links | Überschriftenanker | Kaputt, außer die Slug-Regeln Ihres Renderers passen zu den Ankern im Export |
| Fußnoten | Eine Erweiterung, in keiner Spezifikation | Hängt vollständig vom Werkzeug und vom Renderer am anderen Ende ab |
| Schriften, Farben, Abstände, Ränder | Keine | Verworfen, was meist der Grund ist, warum Sie Markdown wollten |

Drei davon sollten laut gesagt werden.

**Kommentare sind der größte Verlust und der am wenigsten sichtbare.** Ein Google Doc, das durch ein echtes Review gegangen ist, besteht zur Hälfte aus Körpertext und zur Hälfte aus dem Gespräch am Rand, und am Rand wurden die Entscheidungen getroffen. Exportieren Sie es, und Sie behalten die Hälfte, die eine Maschine diffen kann. Zählen diese Stränge, lösen Sie sie vorher auf, oder kopieren Sie die wichtigen als Text in das Dokument, bevor Sie exportieren. Es gibt auf dieser Seite keinen Weg, der sie behält, und es gibt keine Warnung, wenn sie verschwinden.

**Vorschläge müssen vor dem Export erledigt werden, nicht danach.** Ein Dokument im Vorschlagsmodus enthält zwei Lesarten von sich selbst. Ein Export nimmt eine davon — normalerweise die angenommene — und Sie werden dem Markdown nicht ansehen können, welche Sätze der Vorschlag von jemandem waren und welche vereinbart. Nehmen Sie alles an oder lehnen Sie alles ab, dann exportieren Sie. Geht das nicht, nehmen Sie den `.docx`-Weg mit Pandocs `--track-changes=all`, das die Revisionsinformation zumindest so in die Ausgabe legt, dass Sie sie sehen können.

**Interne Links brechen auf eine Weise, die Sie nicht bemerken werden.** Überschriftenanker in Markdown werden von dem erzeugt, was die Datei darstellt, nach seinen eigenen Slug-Regeln, und diese Regeln unterscheiden sich zwischen GitHub, einem statischen Website-Generator und einem Konverter im Browser. Ein Querverweis, der in Docs funktioniert hat, wird zu einem Link auf einen Anker, der nicht existiert, und ein kaputter Link innerhalb der Seite scheitert lautlos: die Seite springt einfach nicht. Prüfen Sie nach einer Konvertierung jeden internen Link, oder lassen Sie sie weg und nennen Sie stattdessen die Abschnittstitel in der Prosa.

## Wie Sie wählen

1. **Sehen Sie sich das Dokument an, bevor Sie einen Weg wählen.** Scrollen Sie es von Anfang bis Ende und zählen Sie Bilder, Tabellen mit verbundenen Zellen, Fußnoten und alles, was gezeichnet statt getippt ist. Null von allen vieren heißt, der native Export ist richtig und alles andere ist verschwendete Mühe; eines oder mehr davon heißt der Weg über `.docx` oder über gezipptes HTML, weil der native Export keinen Platz dafür hat.
2. **Erledigen Sie zuerst die Review-Schicht.** Lösen Sie die Kommentare auf, nehmen Sie die Vorschläge an oder lehnen Sie sie ab, und nehmen Sie das Dokument aus dem Vorschlagsmodus. Tun Sie es nach dem Export, und Sie führen zwei Dokumente von Hand zusammen; tun Sie es vorher, und der Export ist einfach richtig.
3. **Entscheiden Sie vor der Konvertierung, wo die Bilder liegen werden.** Eine Markdown-Datei hält Verweise, keine Bilder, Sie brauchen also ein Verzeichnis und eine Pfadkonvention. Pandocs `--extract-media` wählt eine für Sie; das Add-on gibt Ihnen `images/image1.png`-Platzhalter zum Füllen; der native Export gibt Ihnen keines von beidem, und darum geht das bildreiche Dokument als `.docx` oder als gezipptes HTML hinaus.
4. **Passen Sie den Dialekt an das Ziel an.** Stellt das Ziel CommonMark und nichts anderes dar, erscheinen Ihre Tabellen und Ihr Durchgestrichenes nicht, so gut sie auch konvertiert worden sein mögen. Stellen Sie fest, was die empfangende Plattform unterstützt, und konvertieren Sie dorthin, nicht in das, was das Werkzeug voreingestellt schreibt.
5. **Konvertieren Sie ein repräsentatives Dokument und lesen Sie es vollständig.** Nicht den ersten Bildschirm — den Anhang, die Tabellen, die Fußnoten, die internen Links. Zehn Minuten mit dem schlimmsten Dokument, das Sie haben, sagen Ihnen mehr als jeder Vergleich, dieser eingeschlossen, und es ist die einzige Möglichkeit, die Dinge zu erwischen, die lautlos gescheitert sind.
6. **Fragen Sie, ob das Dokument in Docs bleiben sollte.** Wird es von Leuten geprüft, die nie einen Pull Request öffnen werden, ist es eine Tretmühle, es einmal im Monat nach Markdown zu exportieren. Konvertieren Sie, was im Repository leben muss, und lassen Sie den Rest dort, wo die Prüfer sind.

## Fazit

Markdown aus Google Docs herauszuholen ist für Text inzwischen ein gelöstes Problem und für alles andere ein ungelöstes. Datei → Herunterladen → Markdown (.md) ist kostenlos, nativ und richtig für ein Dokument aus Überschriften, Absätzen, Listen und Links; für Bilder, verbundene Tabellen und Fußnoten laden Sie die `.docx` oder das gezippte HTML herunter und konvertieren das mit einem Werkzeug, das Optionen hat — Pandoc, wenn Sie ein Skript wollen, eine [Konvertierung von Word zu Markdown](/word-to-markdown) im Browser, wenn Sie es jetzt erledigt haben wollen, ohne dass die Datei Ihren Rechner verlässt. Und behandeln Sie die Kommentare, Vorschläge, Seitenumbrüche, Kopf- und Fußzeilen und Zeichnungen als Dinge, die Sie in Docs erledigen, bevor Sie exportieren, denn kein Konverter kann sie mitnehmen, und die, die es behaupten, beschreiben etwas anderes. Dieselbe Warnung gilt für jeden gehosteten Editor: [was ein Export aus Notion, Obsidian oder Confluence behält](/blog/markdown-from-notion-obsidian-and-confluence), ist dieselbe Frage mit anderen Antworten.

## FAQ

### Kann Google Docs Markdown nativ exportieren?

Ja. Datei → Herunterladen → Markdown (.md) schreibt eine `.md`-Datei, und Datei → Öffnen importiert eine solche wieder als Doc; beides ist standardmäßig an (geprüft auf workspaceupdates.googleblog.com, 8. September 2026). Copy as Markdown und Paste from Markdown stehen ebenfalls im Rechtsklickmenü, sind aber aus, bis Sie Tools → Einstellungen → Enable Markdown anhaken.

### Warum fehlen die Bilder in meinem exportierten Markdown?

Weil eine `.md`-Datei eine einzelne Textdatei ohne Ordner daneben ist und Markdowns Bildsyntax einen Pfad hält, nicht das Bild. Um die Bilder als echte Dateien zu bekommen, laden Sie das Dokument als `.docx` herunter und konvertieren es mit etwas, das Medien extrahiert, oder laden Sie es als gezipptes HTML herunter, das mit einem Bilderverzeichnis im Archiv ankommt.

### Kommen Kommentare und Vorschläge mit?

Nein, auf keinem Weg. Kommentare und Antworten sind als getrennte Drive-Ressourcen gespeichert und nicht als Dokumentinhalt, ein Export des Körpertextes kann sie also nicht enthalten; Vorschläge sind eine parallele Schicht, die der Export auf eine Lesart abflacht. Lösen Sie die Kommentare auf und nehmen Sie die Vorschläge an oder lehnen Sie sie ab, bevor Sie exportieren.

### Ist es besser, als .docx herunterzuladen und zu konvertieren, oder den Markdown-Export zu nehmen?

Nehmen Sie den Markdown-Export für ein Textdokument — es ist ein Schritt, und es gibt kein zweites Werkzeug, das etwas falsch machen kann. Nehmen Sie den Weg über `.docx`, wenn Sie Bilder in einen Ordner extrahiert brauchen, Kontrolle über den Ausgabedialekt, verfolgte Änderungen ausdrücklich behandelt, oder dieselbe Konvertierung in einem Skript über viele Dateien wiederholt.

### Wie konvertiere ich nur einen Teil eines Google Docs?

Zwei Wege. Markieren Sie den Text und nehmen Sie Copy as Markdown, nachdem Sie Markdown unter Tools → Einstellungen aktiviert haben, und fügen Sie es dann dort ein, wo es hin soll. Oder installieren Sie das Add-on Docs to Markdown, das eine Auswahl aus einer Seitenleiste heraus konvertiert — und beachten Sie seine eigene Warnung, dass eine Tabelle vollständig markiert sein muss, sonst sieht das Add-on das umgebende Tabellenelement nicht.

### Warum sind meine Überschriften als einfache Absätze herausgekommen?

Weil sie nie Überschriften waren. Hat jemand eine Zeile fett und 18 pt gemacht, statt den Stil Überschrift 1 anzuwenden, gibt es im Dokument keine Überschrift, die ein Konverter finden könnte, und das Add-on Docs to Markdown sagt genau das in seiner eigenen Dokumentation. Wenden Sie in Docs echte Überschriftenstile an und exportieren Sie dann erneut.

### Kann ich Google Docs zu Markdown für viele Dokumente automatisieren?

Ja, auf zwei Aufwandsebenen. Die Drive API kann jedes Doc direkt in den Typ `text/markdown` exportieren, was Ihnen den nativen Export in einem Skript gibt (geprüft auf developers.google.com, 8. September 2026). Für Kontrolle über Bilder, Vorschläge und Docs-spezifische Funktionen lesen Sie das Dokument über die Docs API als strukturiertes JSON und erzeugen das Markdown selbst — erheblich mehr Arbeit und der einzige Weg, auf dem Sie die Verluste selbst wählen.
