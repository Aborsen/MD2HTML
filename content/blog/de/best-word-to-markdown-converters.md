---
title: "Die besten Word-zu-Markdown-Konverter 2026: jeder Weg von Word zu Markdown"
description: "Die Wege von Word zu Markdown 2026 im Vergleich — Browser-Konverter, Pandoc, mammoth, Google Docs und Word-Plugins — und was eine .docx unterwegs verliert"
date: 2026-09-08
tag: Konvertieren
keywords: word in markdown umwandeln, docx in markdown umwandeln, bester word zu markdown konverter, word zu markdown online, docx zu markdown kommandozeile, word datei zu markdown ohne upload, pandoc docx zu markdown, mammoth docx zu markdown
---

Eine `.docx` ist ein Zip-Archiv voller XML. Entpacken Sie eine, und Sie erhalten `document.xml` für den Text, `styles.xml` für die benannten Formatvorlagen, `numbering.xml` für die Listen, einen Ordner `media` für die Bilder und eine Handvoll Teile, die die Beziehungen zwischen ihnen beschreiben. Markdown ist eine Textdatei mit Sternchen darin. Zwischen beiden zu konvertieren ist keine Übersetzung. Es ist eine Entscheidung, getroffen von dem Werkzeug, das Sie ausgewählt haben, darüber, welche Teile dieses Archivs wichtig sind und welche unter den Tisch fallen.

Diese Entscheidung ist meist unsichtbar, bis Sie die Ausgabe lesen. Die Überschriften sind angekommen. Die Absätze sind angekommen. Dann beginnt die nummerierte Liste bei 1, beginnt auf halber Strecke wieder bei 1, und die Unterpunkte sind auf die oberste Ebene abgeflacht. Die Tabelle kam als Pipes herüber, aber die verbundene Kopfzelle hat die Reise nicht überlebt. Das hervorgehobene Zitat im Textfeld fehlt einfach, und nichts hat Ihnen irgendwo gesagt, dass es verschwunden ist.

Jedes Werkzeug auf dieser Seite verliert etwas. Was sie unterscheidet, ist, was sie verlieren, ob sie es sagen und ob die Datei unterwegs Ihren Rechner verlassen hat. Das sind drei verschiedene Fragen, und Herstellerseiten beantworten keine davon.

Dies ist ein Vergleich der Wege, ein Word-Dokument in Markdown zu bekommen: Browser-Konverter, Pandoc, die Bibliothek mammoth und ihr Browser-Build, Google Docs und seine Add-ons, ein Plugin, das in Word selbst wohnt, und der Weg über Kopieren und Einfügen, der besser funktioniert, als er es verdient hat. Dann der ehrliche Teil — die Liste der Dinge in einer `.docx`, für die Markdown keine Syntax hat, und was jedes Werkzeug tut, wenn es einem davon begegnet.

### Kurzfassung

Für ein Dokument, das Sie jetzt brauchen, nehmen Sie einen Browser-Konverter: keine Installation, und mit einem Werkzeug, das im Browser arbeitet, wird die Datei nie hochgeladen — was zählt, wenn das Dokument ein Vertrag und keine README ist. Für ein Repository voller Dokumente, oder für alles, was Änderungsverfolgung und extrahierte Bilder braucht, installieren Sie Pandoc — es ist das einzige Werkzeug hier mit echten Optionen für beides. Für die Konvertierung innerhalb Ihres eigenen Codes ist mammoth die Bibliothek, auf der fast alles andere aufbaut, und ihre eigene Dokumentation sagt Ihnen, HTML zu erzeugen und dieses in Markdown umzuwandeln, statt ihren Markdown-Writer zu verwenden. Und akzeptieren Sie die Verluste von vornherein: Schriften, Ränder, Seitenumbrüche, Textfelder und Kommentare haben keine Entsprechung in Markdown, kein Werkzeug kann sie also behalten, und jedes Werkzeug, das das behauptet, beschreibt etwas anderes.

## Warum das Konvertieren einer .docx nicht eine einzige Aufgabe ist

Wenn Sie eine Word-Datei lesen, tun Sie vier Dinge in Folge. Sie entpacken das Archiv. Sie gehen das XML durch und lösen Formatvorlage und Nummerierung jedes Absatzes gegen andere Teile des Archivs auf. Sie entscheiden, was jedes aufgelöste Element wird — eine Überschrift, ein Listenpunkt, eine Tabellenzeile oder nichts. Dann serialisieren Sie das zu Markdown, und das bedeutet, eine Variante zu wählen, denn reines CommonMark hat keine Tabellen und kein Durchgestrichenes.

Ein Werkzeug kann bei einem dieser Schritte sorgfältig und beim nächsten nachlässig sein. Der zweite Schritt ist der, an dem der meiste Schaden entsteht, und er entsteht aus einem Grund, den es sich zu verstehen lohnt: in einer `.docx` wird Bedeutung als Verweis gespeichert. Eine Überschrift ist nicht als Überschrift markiert. Sie ist ein Absatz, dessen `w:pStyle` eine Formatvorlage benennt, und die Definition dieser Vorlage — drüben in `styles.xml` — ist das, was sagt, dass es Überschrift 1 ist. Ein Listenpunkt ist ein Absatz, der ein `w:numPr`-Element mit einer `w:numId` und einer `w:ilvl` trägt, und ob das ein Aufzählungspunkt oder eine Nummer ist, wohnt in `numbering.xml`, in einer Ebene, deren `w:numFmt` `bullet` sagt oder `decimal` sagt.

Diese Indirektion ist der Grund, warum zwei Dokumente, die auf dem Bildschirm identisch aussehen, unterschiedlich konvertieren. Wenn jemand seine Überschriften gebaut hat, indem er Text markiert und ihn 18 pt fett gemacht hat, gibt es keinen Vorlagenverweis aufzulösen, und jeder Konverter hier wird Ihnen einen Absatz übergeben. Das Google-Docs-Add-on sagt das in seiner eigenen README — Text, der lediglich fett und groß ist, konvertiert als normaler Absatz. Es ist kein Fehler im Konverter. In der Datei war nie eine Überschrift.

Der vierte Schritt entscheidet über die Variante, und es gelten dieselben Regeln wie für [Markdown zu HTML in der anderen Richtung](/blog/best-markdown-to-html-converters). Tabellen, Durchgestrichenes und Aufgabenlisten sind GitHub Flavored Markdown, nicht CommonMark. Fußnoten stehen in keiner der beiden Spezifikationen. Die Tabellenunterstützung eines Konverters ist also eine Aussage über seine Ausgabevariante, nicht darüber, wie gut er Ihr Dokument gelesen hat, und die beiden werden ständig verwechselt.

## Der schnelle Vergleich: die Übersicht

| Werkzeug | Am besten für | Kernfähigkeit | Preis |
| --- | --- | --- | --- |
| TransformPipe | Ein Dokument, jetzt, ohne es hochzuladen | Liest die `.docx` im Browser; Überschriften, Listen, Links und Tabellen kommen als Markdown heraus | Kostenlos |
| Pandoc | Stapel, Pipelines und Änderungsverfolgung | `--track-changes`, `--extract-media`, ~40 Formate | Kostenlos, GPL |
| mammoth | Konvertierung innerhalb Ihres eigenen Codes | Node- und Browser-Builds; Style Map von Word-Vorlagen zu Elementen | Kostenlos, BSD-2-Clause |
| MarkItDown | Viele Dateitypen in eine Textpipeline einspeisen | Python-CLI und -Bibliothek, viele Formate hinein, Markdown heraus | Kostenlos, MIT |
| Google Docs (nativ) | Ein Dokument, das schon in Drive liegt | Datei → Herunterladen → Markdown (.md) und Als Markdown kopieren | Kostenlos mit Google-Konto |
| Add-on Docs to Markdown | Einen Teil eines Google-Dokuments konvertieren | Seitenleiste in Docs; konvertiert eine Auswahl, nicht nur die Datei | Kostenlos, Apache 2.0 |
| Writage | Autoren, die Word nicht verlassen werden | Markdown öffnen und speichern aus Words eigenem Menüband | 29 $ zzgl. MwSt. für Privatpersonen, einmalig |
| Kopieren und Einfügen | Ein paar Absätze, sofort | Die HTML-Zwischenablage trägt Struktur; ein einfügebewusster Editor konvertiert sie | Kostenlos |
| Words „Als Webseite speichern" | HTML aus Word holen, ohne Konverter | Word schreibt das HTML, Sie konvertieren dieses | Bei Word enthalten |
| LibreOffice, headless | Alte `.doc`-Dateien und seltsame Formate | `soffice --convert-to docx` als erster Schritt | Kostenlos, MPL 2.0 |
| python-docx | Das XML selbst lesen | `.docx` aus Python erstellen, lesen und aktualisieren | Kostenlos, MIT |

## Die besten Wege 2026, Word in Markdown umzuwandeln

### TransformPipe — am besten für ein Dokument, das Sie nicht hochladen wollen

TransformPipe liest die `.docx` in Ihrem Browser und gibt Markdown zurück. Abgemeldet wird die Datei nie irgendwohin gesendet: sie wird von der Seite gelesen, auf Ihrem Rechner konvertiert, und das Ergebnis gehört Ihnen. Es gibt keine Installation, und es ist kein Konto nötig.

Unter der Haube tut es genau das, was mammoths eigene Dokumentation empfiehlt — mammoth macht aus dem Archiv HTML, und ein separater Schritt von HTML zu Markdown macht daraus Markdown. Das sind zwei Konvertierungen statt einer, und es ist die Anordnung, die die Autoren der Bibliothek vorschlagen, weil HTML für die meisten Dinge, die eine `.docx` enthält, ein Element hat und Markdown nicht.

| Vorteile | Nachteile |
| --- | --- |
| Abgemeldet wird nichts hochgeladen | Der Browser macht die Arbeit, ein sehr großes Dokument ist also durch den Rechner begrenzt |
| Keine Installation, kein Terminal, kein Konto | Ein Dokument auf einmal, kein Verzeichnis |
| Überschriften, Listen, Links, Tabellen, Fett und Kursiv kommen herüber | Verfolgte Änderungen lösen sich zum angenommenen Text auf; Löschungen und Kommentare kommen nicht herüber |
| Das Markdown ist an Ort und Stelle bearbeitbar, bevor Sie es herunterladen | Keine Option, Bilder in einen Ordner zu extrahieren |

**Preis:** kostenlos. Ein Konto bringt Verlauf, Freigaben und eine API, ebenfalls kostenlos.

**Technische Details und Funktionen**

- Nimmt `.docx`; das ältere binäre `.doc` ist ein anderes Format und muss zuerst konvertiert werden
- mammoth liest das Archiv, dann wird das HTML in GitHub Flavored Markdown umgewandelt — Tabellen und Durchgestrichenes inbegriffen
- Rohes HTML, das die Reise übersteht, läuft durch einen Sanitiser mit fester Erlaubnisliste, bevor es überhaupt dargestellt wird
- Lädt als `.md` herunter, oder als eigenständige HTML-Datei, wenn das Markdown immer nur eine Zwischenstation war
- Dieselbe Konvertierung ist aus einer REST-API, einem CLI, einer GitHub Action und einem MCP-Server verfügbar

**Wer sollte es verwenden?** Jeden mit einem Dokument, das er lieber nicht auf den Server eines Fremden stellt — einen Vertrag, eine Patientennotiz, einen unveröffentlichten Plan, einen internen Bericht. Die Datenschutzaussage ist von der Art, die Sie prüfen können, statt sie zu glauben: öffnen Sie den Netzwerk-Tab und beobachten Sie, wie nichts passiert, während konvertiert wird.

### Pandoc — am besten für Stapel, Bilder und Änderungsverfolgung

Pandoc ist ein Dokumentkonverter für die Kommandozeile, in Haskell geschrieben, der rund vierzig Formate liest und schreibt. Sein `.docx`-Reader ist der konfigurierbarste, den es überhaupt gibt, und es ist das einzige Werkzeug auf dieser Seite mit einer dokumentierten Antwort auf verfolgte Änderungen.

| Vorteile | Nachteile |
| --- | --- |
| `--track-changes` nimmt `accept`, `reject` oder `all` | Braucht eine Installation und ein Terminal |
| `--extract-media` schreibt die Bilder in ein Verzeichnis heraus | Sein Markdown-Dialekt ist nicht GFM, solange Sie nicht GFM verlangen |
| Skriptfähig, hundert Dateien sind also dieselbe Arbeit wie eine | Eigene Formatvorlagen brauchen eine Zuordnung, die Sie selbst schreiben |
| Liest `.docx` und schreibt es auch, Rundreisen sind also möglich | Das Handbuch ist lang und die Flags sind viele |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- `--track-changes=accept` ist die Voreinstellung und verarbeitet Einfügungen und Löschungen; `reject` ignoriert sie; `all` schließt Einfügungen, Löschungen und Kommentare ein, in Spans gewickelt (geprüft auf pandoc.org, 8. September 2026)
- `--extract-media=DIR` zieht Bilder aus dem Archiv in einen Ordner, oder in ein Zip, wenn Sie eines benennen
- Die Ausgabevariante ist explizit: `-t gfm` für GitHub Flavored Markdown, `-t commonmark`, oder Pandocs eigener erweiterter Dialekt mit Fußnotensyntax
- `--wrap=none` hält es davon ab, Absätze bei 72 Spalten umzubrechen — das erste Flag, das die meisten Leute wollen, und das letzte, das sie finden
- Lua-Filter lassen Sie das Dokument mitten in der Konvertierung umschreiben, bevor es serialisiert wird

**Wer sollte es verwenden?** Jeden, der mehr als eine Datei konvertiert, jeden, der die Bilder auf der Platte braucht statt verloren, und jeden, der mit einem Dokument zu tun hat, das durch eine Überprüfung gegangen ist. `--track-changes=all` ist das Nächste an einer echten Antwort für ein kommentiertes Manuskript, und kein Browser-Werkzeug bietet eine Entsprechung.

### mammoth — am besten für die Konvertierung innerhalb Ihres eigenen Codes

mammoth ist eine Bibliothek, die `.docx` in HTML umwandelt, mit Builds für Node und für den Browser. Es ist das, was eine überraschende Anzahl von „Word zu Markdown"-Werkzeugen ist, sobald man hinsieht.

Ihre kennzeichnende Idee ist die Style Map. Statt zu raten, ordnet mammoth Words benannte Formatvorlagen HTML-Elementen zu: `p[style-name='Heading 1'] => h1`, und Sie können die Zuordnung um die Hausvorlagen erweitern, die Ihre Organisation verwendet. Das ist der Mechanismus, der ein Dokument mit einer eigenen Vorlage „Chapter Title" korrekt konvertieren lässt, und das Fehlen dieses Mechanismus ist der Grund, warum andere Werkzeuge es nicht tun.

| Vorteile | Nachteile |
| --- | --- |
| Läuft in Node und im Browser — `mammoth.browser.js` liegt im Paket | Erzeugt HTML; der Markdown-Schritt ist Ihrer |
| Style Maps behandeln eigene Word-Vorlagen richtig | Ihr eigener Markdown-Writer ist von den Autoren als veraltet erklärt |
| Meldet, was sie nicht zuordnen konnte, in einem `messages`-Array | Kein Seitenlayout, weil HTML keine Seite hat |
| Ein CLI ist für einmalige Konvertierungen dabei | Nur JavaScript |

**Preis:** kostenlos, BSD-2-Clause-lizenziert.

**Technische Details und Funktionen**

- `mammoth.convertToHtml({arrayBuffer})` im Browser, `{path}` in Node
- `convertToMarkdown` existiert, und die README markiert die Markdown-Unterstützung als veraltet und empfiehlt stattdessen HTML plus eine separate HTML-zu-Markdown-Bibliothek
- Das `messages`-Array an jedem Ergebnis listet unbekannte Vorlagen und nicht behandelte Elemente auf — der einzige maschinenlesbare Bericht darüber, was ein Konverter verworfen hat, den irgendein Werkzeug hier bietet
- Bilder können als Data-URIs eingebettet oder an einen Callback übergeben werden, damit Sie sie schreiben, wo Sie mögen
- Die Kommandozeilenform ist `mammoth document.docx output.html`

**Wer sollte es verwenden?** Entwickler, die Konvertierung in eine Anwendung einbauen, besonders im Browser, wo es keine andere echte Option gibt. Lesen Sie das `messages`-Array und zeigen Sie es Ihren Nutzern; es ist der Unterschied zwischen einem Konverter und einem Konverter, dem Sie trauen können.

### MarkItDown — am besten, um eine Pipeline zu füttern statt einen Menschen

MarkItDown ist ein Python-Werkzeug von Microsoft, das viele Dateitypen in Markdown umwandelt — Word, PowerPoint, Excel, PDF, HTML, CSV, JSON, EPUB und mehr — mit einem CLI und einer Bibliotheks-API.

Es ist ungewöhnlich ehrlich über seinen Zweck. Die README sagt, es existiert, um Dateien für die Verwendung mit Sprachmodellen und Textanalyse-Pipelines in Markdown umzuwandeln, und dass die Ausgabe zwar oft ansehnlich ist, aber von Werkzeugen konsumiert werden soll und nicht die beste Wahl für eine hochgetreue Konvertierung für menschliche Leser sein mag. Glauben Sie diesen Satz. Er sagt Ihnen genau, wann Sie danach greifen sollten und wann nicht.

| Vorteile | Nachteile |
| --- | --- |
| Ein Befehl für ein Dutzend Eingabeformate | Die Ausgabe zielt nach dem eigenen Bekunden der Autoren auf Maschinen |
| Bibliothek und CLI, es fügt sich also in eine Python-Pipeline | Python und ein Paketmanager erforderlich |
| Aktiv entwickelt und weit verbreitet | Weniger Kontrolle über `.docx`-Eigenheiten als Pandoc |
| Verarbeitet auch Archive und Bilder | Nicht das Werkzeug für ein Dokument, das jemand genau lesen wird |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- `markitdown path-to-file.docx > document.md`, oder `-o`, um die Ausgabe zu benennen
- Zu den in der README aufgeführten Formaten gehören PDF, PowerPoint, Word, Excel, Bilder mit OCR, Audio mit Transkription, HTML, CSV, JSON, XML, ZIP, YouTube-URLs und EPUB
- Verfügbar als Python-Bibliothek für die Verwendung in einem Skript statt aus einer Shell

**Wer sollte es verwenden?** Jeden, der einen Korpus zusammenstellt. Wenn das Markdown in einen Suchindex oder einen Prompt geht, spielt Treue unterhalb von „die Wörter stehen in der richtigen Reihenfolge" keine Rolle, und das ist der schnellste Weg dorthin. Wenn ein Mensch die Ausgabe lesen wird, nehmen Sie etwas anderes.

### Google Docs — am besten, wenn das Dokument schon in Drive liegt

Google Docs hat einen nativen Markdown-Export. Datei → Herunterladen → Markdown (.md) schreibt eine `.md`-Datei, und ein Rechtsklick auf eine Auswahl bietet Als Markdown kopieren an, mit Aus Markdown einfügen für die Rückreise (geprüft auf support.google.com, 8. September 2026).

Der Haken ist der Weg hinein. Eine `.docx` auf Ihrem Laptop muss zu Drive hochgeladen und in Docs geöffnet werden, bevor irgendetwas davon gilt, und der Import von Docs ist selbst eine Konvertierung mit eigenen Verlusten. Sie führen zwei Konvertierungen aus und steuern nur die zweite.

| Vorteile | Nachteile |
| --- | --- |
| Keine Installation, und kein Drittanbieter-Werkzeug beteiligt | Die `.docx` muss zuerst zu Google hochgeladen werden |
| Als Markdown kopieren wirkt auf eine Auswahl, nicht nur auf eine ganze Datei | Der `.docx`-Import von Docs ist eine eigene Konvertierung |
| Aus Markdown einfügen macht die Rundreise möglich | Keine Optionen: Sie bekommen, was es gibt |
| Kostenlos mit einem Konto, das Sie wahrscheinlich haben | Kommentare leben in Docs und kommen im Markdown nicht heraus |

**Preis:** kostenlos mit einem Google-Konto.

**Technische Details und Funktionen**

- Datei → Herunterladen → Markdown (.md) für das ganze Dokument
- Als Markdown kopieren per Rechtsklick, für einen Teil davon
- Aus Markdown einfügen wandelt Markdown auf dem Weg hinein in Docs-Formatierung um

**Wer sollte es verwenden?** Jeden, dessen Dokumente schon in Google Docs liegen. Wenn Ihre `.docx` auf der Platte liegt und vertraulich ist, ist sie zum Konvertieren hochzuladen der falsche Tausch, und dies ist die eine Option auf der Seite, die genau das verlangt. Dieselbe Warnung gilt für Dokumente, die aus irgendeinem gehosteten Editor kommen — [was einen Export aus Notion, Obsidian oder Confluence überlebt](/blog/markdown-from-notion-obsidian-and-confluence) ist eine Fassung derselben Frage.

### Docs to Markdown — am besten, um einen Teil eines Google-Dokuments zu konvertieren

Docs to Markdown, auch unter seinem Repository-Namen gd2md-html bekannt, ist ein Google-Docs-Add-on, geschrieben in Apps Script. Es öffnet sich als Seitenleiste und konvertiert das Dokument, oder nur die Auswahl, zu Markdown oder HTML.

| Vorteile | Nachteile |
| --- | --- |
| Konvertiert eine Auswahl, was der native Export nicht kann | Nur Google Docs |
| Open Source, und verlangt minimale Berechtigungen | Nimmt laut Repository keine Beiträge an |
| Älter als der native Export und kann noch Dinge, die dieser nicht kann | Verlangt denselben Schritt des Hochladens zu Drive |
| Schreibt HTML genauso wie Markdown | Überschriften müssen echte Überschriftenvorlagen sein, kein großer fetter Text |

**Preis:** kostenlos, Apache-2.0-lizenziert.

**Technische Details und Funktionen**

- Wird aus dem Google Workspace Marketplace installiert; läuft als Docs-Seitenleiste
- Verlangt nur Zugriff auf das aktuelle Dokument und die Erlaubnis, eine Seitenleiste anzulegen
- Seine README ist ausdrücklich: Text, der lediglich fett und groß ist, konvertiert als normaler Absatz

**Wer sollte es verwenden?** Leute, die in Docs entwerfen und auf einer Markdown-Plattform veröffentlichen, und jeden, der einen Abschnitt braucht statt einer ganzen Datei.

### Writage — am besten für Leute, die Word nicht verlassen werden

Writage ist ein Plugin, das sich in Microsoft Word installiert und Markdown zu Words eigenen Dialogen Öffnen und Speichern unter hinzufügt, mit einem Writage-Tab im Menüband. Es ist die einzige Option hier, die so funktioniert, wie ein Word-Nutzer es erwartet: Datei, Speichern unter, Markdown.

| Vorteile | Nachteile |
| --- | --- |
| Markdown wird ein Format, das Word selbst liest und schreibt | Kostenpflichtig, und pro Nutzer |
| Keine zweite Anwendung, kein Terminal, kein Upload | Nur Builds für Windows und macOS — kein Word im Web |
| Rundreisen: Markdown in Word öffnen, wieder zurückspeichern | An Word gebunden, also keine Stapelkonvertierung eines Verzeichnisses |
| Test mit vollem Funktionsumfang, bevor Sie zahlen | Noch ein Add-in in einer Anwendung, die oft mehrere hat |

**Preis:** 29 $ zzgl. MwSt. für eine Privatlizenz, einmalig und unbefristet, mit kostenlosen Upgrades für zwölf Monate nach dem Kauf; kommerzielle Lizenzen kosten 145 $ zzgl. MwSt. für fünf Nutzer, ebenfalls einmalig. Ein 14-tägiger kostenloser Test mit vollem Funktionsumfang ist verfügbar (geprüft auf writage.com, 8. September 2026).

**Technische Details und Funktionen**

- Installiert sich als Word-Add-in; der Download wird als `.msi` für Windows und `.pkg` für macOS angeboten
- Fügt Markdown zu Words Dialogen Öffnen und Speichern unter hinzu und einen Writage-Tab zum Menüband
- Die Lizenz wird aus diesem Tab durch Einfügen eines Codes aktiviert

**Wer sollte es verwenden?** Autoren und Redakteure, deren ganzer Arbeitstag in Word stattfindet und die in einem Markdown-System veröffentlichen. Wenn die Alternative darin besteht, einem Team nicht-technischer Autoren ein Terminal beizubringen, sind dreißig Dollar pro Kopf nicht der teure Teil des Projekts.

### Kopieren und Einfügen über die HTML-Zwischenablage — besser, als es klingt

Wenn Sie aus Word kopieren, trägt die Zwischenablage mehrere Darstellungen derselben Auswahl, und eine davon ist HTML. Fügen Sie das in einen Editor ein, der die HTML-Zwischenablage versteht und sie konvertiert — sehr viele Markdown-Editoren tun das, und die Kommentarfelder von GitHub auch — und die Überschriften, Listen, Fettungen, Kursivsetzungen, Links und oft die Tabellen kommen als Markdown an.

| Vorteile | Nachteile |
| --- | --- |
| Sofort, und braucht keine Installation | Bilder kommen nicht mit; sie sind Verweise auf eine Zwischenablage, keine Dateien |
| Bewahrt Inline-Struktur überraschend gut | Hängt vollständig davon ab, wie der Ziel-Editor das Einfügen behandelt |
| Wirkt auf eine Auswahl, Sie können also einen Abschnitt nehmen | Lange Dokumente bedeuten Scrollen, Markieren und Hoffen |
| Keine Datei verlässt Ihren Rechner | Kein Bericht darüber, was verworfen wurde |

**Preis:** kostenlos.

**Wer sollte es verwenden?** Jeden, der ein paar hundert Wörter verschiebt. Es ist der schnellste Weg für einen Abschnitt eines Dokuments und der schlechteste Weg für ein ganzes, und der Fehlerfall ist leise: der Text kommt an, die Bilder nicht, und niemand merkt es, bis die Seite veröffentlicht ist.

### Words „Als Webseite speichern", dann HTML zu Markdown

Word kann HTML selbst schreiben. Speichern unter, und wählen Sie Webseite, gefiltert — die gefilterte Option ist die, die den größten Teil von Words eigenem XML weglässt. Dann konvertieren Sie dieses HTML mit dem Werkzeug Ihrer Wahl zu Markdown.

Dies ist ein zweistufiger Weg und wissenswert, weil Word das einzige Programm ist, das sein eigenes Dokument perfekt versteht. Was es erzeugt, ist umfangreiches HTML mit einer Menge Inline-Styling, das ein anständiger HTML-zu-Markdown-Konverter wegwirft und die Struktur zurücklässt.

| Vorteile | Nachteile |
| --- | --- |
| Word selbst liest, es wird also nichts falsch verstanden | Zwei Schritte, und die Zwischendatei ist groß |
| Bilder werden in einen Ordner neben dem HTML geschrieben | Ungefilterte Ausgabe trägt gewaltige Mengen an Word-Markup |
| Keine Fremdsoftware im ersten Schritt | Braucht Word und ein zweites Werkzeug für den zweiten Schritt |

**Preis:** bei Word enthalten.

**Wer sollte es verwenden?** Jeden, der Word offen hat, ein Dokument, das andere Konverter verstümmelt haben, und einen HTML-zu-Markdown-Schritt schon zur Hand. Es ist auch der Weg, den man versuchen sollte, wenn die eigenen Formatvorlagen eines Dokuments alles andere besiegen, weil Word sie auflöst, bevor es das HTML schreibt. Wenn Sie diesen Weg gehen, bereinigen Sie das HTML, bevor Sie ihm trauen — [rohes HTML aus jeder Quelle verdient dieselbe Behandlung](/blog/sanitising-markdown-safely).

### LibreOffice, headless — der Vorverarbeiter für alte und seltsame Dateien

LibreOffice ist kein Markdown-Konverter und ist dennoch eine Zeile wert, weil es die verlässliche Antwort auf die Datei ist, die kein anderes Werkzeug lesen will. Das alte binäre Format `.doc`, `.rtf`, WordPerfect-Dateien, eine `.odt`, die jemand von einem Linux-Rechner geschickt hat: `soffice --headless --convert-to docx oldfile.doc` erzeugt eine `.docx`, und alles andere auf dieser Seite kann sie dann lesen.

| Vorteile | Nachteile |
| --- | --- |
| Liest Formate, die nichts anderes auf dieser Liste anfasst | Zwei Konvertierungen, also zwei Sätze von Verlusten |
| Skriptfähig und headless, es passt also in eine Pipeline | Eine große Installation für einen Vorverarbeitungsschritt |
| Kostenlos und Open Source | Seine `.docx`-Ausgabe ist seine Interpretation, nicht das Original |

**Preis:** kostenlos, MPL-2.0-lizenziert.

**Wer sollte es verwenden?** Jeden mit einem Archiv von Dateien, die älter sind als das `.docx`-Format selbst. Konvertieren Sie erst zu `.docx`, dann das, und erwarten Sie, dass der erste Schritt der ist, in dem die Überraschungen stecken.

### python-docx — für den Fall, dass Sie die Entscheidungen selbst treffen wollen

python-docx erstellt, liest und aktualisiert `.docx`-Dateien aus Python. Es hat keinen Markdown-Writer und keinen HTML-Writer, und das ist der Punkt: es gibt Ihnen die Absätze, Runs, Formatvorlagen und Tabellen als Objekte, und was Sie ausgeben, ist ganz Ihr Problem.

| Vorteile | Nachteile |
| --- | --- |
| Vollständige Kontrolle darüber, was was wird | Sie schreiben den Konverter |
| Liest und schreibt, es kann Dokumente also auch bearbeiten | Keine Markdown-Ausgabe irgendeiner Art |
| Gut dokumentiert und lange etabliert | Nur lohnend für eine Regel, die kein Werkzeug umsetzt |

**Preis:** kostenlos, MIT-lizenziert.

**Wer sollte es verwenden?** Teams mit einer Hausregel, die kein Konverter kennt — eine bestimmte Formatvorlage, die ein bestimmter Shortcode werden muss, ein Tabellenformat, das umgeformt werden muss, eine Dokumentstruktur, die auf ein Inhaltsmodell abgebildet wird. Wenn Ihre Anforderung gewöhnlich ist, ist das weit mehr Arbeit, als es wert ist.

## Was eine .docx trägt und Markdown nicht ausdrücken kann

Dies ist der Abschnitt, den eine Herstellerseite nicht schreiben wird, weil es keine Art gibt, ihn zu schreiben, die gut klingt. Markdown hat etwa ein Dutzend Konstrukte. Eine `.docx` hat hunderte. Die Konvertierung ist per Definition verlustbehaftet, und die einzige nützliche Frage ist, welchen Verlusten Sie zustimmen. [Die vollständige Aufstellung, mit einem Urteil zu jedem Punkt](/blog/what-not-to-keep-from-a-docx), geht weiter als die Zusammenfassung unten.

**Schriften, Größen und Farben.** Markdown hat keine Syntax für Schriftart, Punktgröße oder Farbe. Nicht „schwache Unterstützung" — keine. Jeder Konverter hier verwirft sie, und die, bei denen es nicht so scheint, geben rohes HTML mit einem `style`-Attribut aus, und das ist ein anderes Dokument in einer Markdown-förmigen Hülle. Wenn die Bedeutung des Dokuments von seiner Typografie abhängt, zerstört die Umwandlung in Markdown die Bedeutung und behält die Wörter.

**Ränder, Seitengröße und Seitenumbrüche.** Markdown hat keine Seiten. Ein Dokument, das für A4 mit gespiegelten Rändern und einem Seitenumbruch vor jedem Kapitel gesetzt ist, wird ein durchgehender Strom. Pandoc kann einen Seitenvorschub oder einen Rohblock für einen Seitenumbruch ausgeben, und das ist eine Markierung, die ein späterer Schritt deuten soll, kein Seitenumbruch. Es gibt nichts umzubrechen.

**Kopfzeilen, Fußzeilen und Seitenzahlen.** Diese wohnen in ihren eigenen Teilen des Archivs und verweisen auf ein Konzept — die Seite —, das auf der anderen Seite nicht existiert. Sie werden von allem stillschweigend verworfen. Niemand vermisst sie, bis ein Dokument mit „Vertraulich — Seite 3 von 12" in der Fußzeile ohne diesen Text neu veröffentlicht wird.

**Verfolgte Änderungen.** Das ist die, die Geld kostet. Ein überprüftes Dokument enthält sowohl das Original als auch die Überarbeitung, ausgezeichnet als Einfügungen und Löschungen. Ein Konverter ohne Meinung dazu wird Ihnen typischerweise den angenommenen Text übergeben, was bedeutet, dass die Löschungen von jemandem verschwunden sind und seine Begründung mit ihnen. Pandocs `--track-changes` ist die einzige dokumentierte Steuerung auf dieser Seite: `accept`, `reject` oder `all`, um alles in Spans gewickelt zu behalten. Wenn ein Dokument durch eine juristische Prüfung gegangen ist, konvertieren Sie es mit `all` und lesen Sie das Ergebnis, bevor Sie die `.docx` wegwerfen.

**Kommentare.** Kommentare sind ein Gespräch, das an Textbereiche geheftet ist, und Markdown hat keinen Anker, an den es sie heften könnte. Pandocs Handbuch stellt fest, dass `accept` und `reject` beide Kommentare ignorieren und nur `all` sie einschließt. mammoth lässt sie weg, solange Sie nicht selbst eine `comment-reference`-Vorlagenzuordnung hinzufügen, was seine README dokumentiert und fast niemand tut. Alles andere verwirft sie, ohne es zu erwähnen. Der Überprüfungsverlauf an einem Dokument ist oft das Wertvollste daran, und er ist das Erste, was geht.

**Fuß- und Endnoten.** Diese haben zumindest einen Ort zum Landen, aber nur in einigen Varianten. Fußnoten stehen nicht in CommonMark und nicht in der GFM-Spezifikation, sie existieren also als Erweiterungen — Pandocs eigener Markdown-Dialekt hat Fußnotensyntax, und ein Konverter, der auf strenges CommonMark zielt, muss sie inline setzen, als gewöhnliche Absätze anhängen oder verwerfen. Konvertieren Sie ein Dokument mit Fußnoten und sehen Sie sich das Ende der Ausgabe an, bevor Sie sie festschreiben.

**Textfelder, Formen und SmartArt.** Ein Textfeld liegt nicht im Fluss des Dokuments; es ist ein Zeichenobjekt mit Text darin. Der Text kann relativ zu seiner Position auf der Seite irgendwo im XML stehen, und er verschwindet häufig vollständig. Das ist der Verlust, den Leute am schwersten glauben können, weil das hervorgehobene Zitat doch gerade auf dem Bildschirm war. Suchen Sie in der Ausgabe nach einer Formulierung, von der Sie wissen, dass sie in einem Textfeld stand. Wenn sie fehlt, stand sie nie im Text.

**Tabellen jenseits eines Rasters.** Eine einfache Tabelle konvertiert. Eine Tabelle mit verbundenen Zellen, verschachtelten Tabellen, einer Zelle mit einer Aufzählung darin oder einer Kopfzeile, die zwei Spalten überspannt, konvertiert nicht, weil Markdowns Tabellensyntax ein Raster aus einzelnen Zellen ist, ohne Überspannen und ohne Blockinhalt. Konverter flachen ab, was sie können, und verwerfen den Rest, und das Ergebnis sieht meist plausibel aus, während es falsch ist. [Tabellen sind das, was in beiden Richtungen am häufigsten bricht](/blog/markdown-tables-that-survive-conversion), und die einzige verlässliche Prüfung ist, die Spalten zu zählen.

**Nummerierung, und warum sie von einer Datei im Archiv abhängt.** Das verdient einen eigenen Absatz, weil es die häufigste Beschwerde über `.docx`-Konvertierung überhaupt erklärt. Eine nummerierte Liste in Word ist eine Menge von Absätzen, von denen jeder eine `w:numId` und eine Einrückungsebene trägt; die eigentliche Nummerierung — ob sie dezimal oder klein-römisch oder ein Aufzählungspunkt ist, wo sie neu beginnt, wie die Ebenen sich verschachteln — ist in `numbering.xml` definiert. Lesen Sie mammoths Quellcode, und Sie sehen die Folge direkt: eine Listenebene wird als geordnet behandelt, wenn ihr `w:numFmt` etwas anderes als `bullet` ist, und wenn der Nummerierungsteil nicht gefunden werden kann, fällt die Bibliothek auf eine leere Voreinstellung zurück. Mit einer leeren Voreinstellung gibt die Suche nach der Nummerierung eines Absatzes nichts zurück, der Absatz passt nicht mehr auf die Regel, die ihn zu einem Listenpunkt gemacht hätte, und er wird als gewöhnlicher Absatz ausgegeben.

Deshalb konvertiert dasselbe Werkzeug die Listen eines Dokuments perfekt und reduziert die eines anderen auf reinen Text. Es ist nicht das Werkzeug, das inkonsistent ist. Ein Archiv hatte einen Nummerierungsteil und das andere nicht, oder es verwies auf Nummerierungsdefinitionen, die es nicht enthielt — was Dokumenten passiert, die von Skripten zusammengesetzt, aus anderen Anwendungen exportiert oder nach einem Absturz von Word repariert wurden. Wenn die Listen eines konvertierten Dokuments als Absätze ankommen, entpacken Sie die `.docx` und suchen Sie nach `word/numbering.xml`, bevor Sie den Konverter beschuldigen. Und prüfen Sie die Verschachtelung an dem, was überlebt, denn [Listeneinrückung und Zeilenumbrüche sind eine eigene, separate Falle](/blog/markdown-line-breaks-and-lists), sobald das Markdown geschrieben ist.

**Felder, Querverweise und ein Inhaltsverzeichnis.** Ein Word-Inhaltsverzeichnis ist ein Feld, das Word berechnet. Konvertiert wird es zu dem Text, der im Feld zwischengespeichert war, als Word es zuletzt aktualisiert hat — eine Momentaufnahme mit Seitenzahlen darin, die auf Seiten zeigen, die es nicht mehr gibt. Querverweisen geht es genauso. Löschen Sie das konvertierte Inhaltsverzeichnis und lassen Sie Ihren Markdown-Renderer ein neues bauen.

## Wie Sie wählen

1. **Entscheiden Sie, wohin die Datei gehen darf, bevor Sie ein Werkzeug wählen.** Eine README kann überall hochgeladen werden. Ein unterzeichneter Vertrag, ein unveröffentlichter Finanzbericht oder irgendetwas mit dem Namen eines Patienten darin kann es nicht, und für eines davon einen Online-Konverter zu wählen ist eine Offenlegung, keine Konvertierung. Konvertierung im Browser ist die einzige Option, die die Datei auf dem Rechner hält, und Sie können es überprüfen, indem Sie den Netzwerk-Tab beobachten.
2. **Zählen Sie die Dokumente.** Eine Datei rechtfertigt nicht, Haskell zu installieren. Zweihundert Dateien rechtfertigen keinen Browser-Tab und eine Person, die darin klickt. Die Installationskosten werden einmal bezahlt und die Klickkosten jedes Mal, was die Antwort irgendwo zwischen fünf und fünfzig Dateien umkehrt.
3. **Stellen Sie fest, ob das Dokument überprüft wurde.** Wenn es verfolgte Änderungen oder Kommentare hat, werden die meisten Werkzeuge sie still auflösen und Sie verlieren die Überprüfung. Pandocs `--track-changes=all` ist der dokumentierte Weg, sie zu behalten, und wenn Sie nicht Pandoc verwenden, müssen Sie akzeptieren, dass die Überprüfung verloren ist.
4. **Prüfen Sie die Bilder, bevor Sie die Quelle löschen.** Markdown verweist auf Bilder; es enthält sie nicht. Ein Konverter, der sie als Data-URIs einbettet, gibt Ihnen eine gewaltige Datei, einer, der sie extrahiert, gibt Ihnen einen Ordner zum Verwalten, und einer, der keines von beiden tut, gibt Ihnen Markdown, das auf nichts zeigt. Finden Sie heraus, was Sie haben, und behalten Sie dann die `.docx`.
5. **Konvertieren Sie ein repräsentatives Dokument und lesen Sie es ganz.** Nicht den ersten Bildschirm. Die Tabellen, die nummerierten Listen, die Fußnoten, die Textfelder, und eine Suche nach einer Formulierung, von der Sie wissen, dass sie in einer Bildunterschrift stand. Zehn Minuten hier sind mehr wert als jede Vergleichstabelle, diese eingeschlossen, weil Ihre Dokumente nicht dieselben sind wie die von irgendjemand anderem.
6. **Nehmen Sie an, dass Sie das Original wieder haben wollen.** Die Konvertierung ist für alles im ehrlichen Abschnitt oben eine Einbahnstraße. Archivieren Sie die `.docx` an einem Ort, den Sie wiederfinden, denn der Tag, an dem jemand fragt, was der gelöschte Absatz sagte, ist der Tag, an dem Sie entdecken, dass die Antwort immer nur in der Datei stand, die Sie weggeworfen haben.

## Fazit

Es gibt keinen verlustfreien Weg, Word in Markdown umzuwandeln, und die guten Werkzeuge sind die, die bei ihren Verlusten konkret werden statt zu schweigen. [Die Anleitung behandelt die Schritte und die Prüfliste](/blog/convert-docx-to-markdown) für das, was man sich im Ergebnis ansehen sollte. Für ein einzelnes Dokument ist der kürzeste ehrliche Weg ein Konverter, der in Ihrem Browser läuft, und genau das tut [die Word-zu-Markdown-Konvertierung von TransformPipe](/word-to-markdown) — kostenlos, keine Installation, und abgemeldet verlässt die `.docx` nie Ihren Rechner. Für ein Verzeichnis voller Dateien, Bilder, die extrahiert werden müssen, oder ein Dokument, das durch eine Überprüfung gegangen ist, installieren Sie Pandoc und lernen `--track-changes` und `--extract-media`; nichts anderes auf dieser Seite kommt in die Nähe. Für die Konvertierung innerhalb Ihrer eigenen Anwendung nehmen Sie mammoth, lesen sein `messages`-Array und folgen seinem Rat, zuerst HTML zu erzeugen — [wie mammoths Style Maps funktionieren und wo docx4js, docxtemplater und Pandoc darum herum passen](/blog/mammoth-js-and-docx-parsers) ist das Nächste zu lesen, wenn das Ihr Weg ist. Und was auch immer Sie wählen: behalten Sie das Original, denn die Schriften, die Seitenumbrüche, die Kommentare und das Textfeld, das Sie nicht bemerkt haben, kommen nicht zurück.

## FAQ

### Wie wandle ich Word kostenlos in Markdown um?

Jede Option auf dieser Seite außer Writage ist kostenlos. Ein Browser-Konverter ist der schnellste Weg für eine Datei und verlangt keine Installation; Pandoc ist kostenlos und GPL-lizenziert für die Kommandozeile; mammoth und MarkItDown sind kostenlose Bibliotheken. Wenn das Dokument schon in Google Docs liegt, kostet Datei → Herunterladen → Markdown (.md) ebenfalls nichts.

### Kann ich eine .docx in Markdown umwandeln, ohne sie hochzuladen?

Ja, und darauf zu bestehen lohnt sich für alles Vertrauliche. Ein Konverter, der im Browser läuft, liest die Datei mit JavaScript auf Ihrem eigenen Rechner und sendet sie nie irgendwohin, was Sie bestätigen können, indem Sie den Netzwerk-Tab öffnen, während konvertiert wird. Pandoc und mammoth laufen per Definition lokal. Google Docs ist die Ausnahme: es verlangt, die Datei zuerst zu Drive hochzuladen.

### Warum sind meine nummerierten Listen als reine Absätze herausgekommen?

Fast sicher, weil der `.docx` `numbering.xml` fehlte oder sie falsch darauf verwies — der Teil des Archivs, der definiert, wie jede Listenebene aussieht. Ohne ihn kann ein Konverter überhaupt nicht erkennen, dass diese Absätze Listenpunkte waren, also gibt er sie als Absätze aus. Entpacken Sie die Datei und suchen Sie nach `word/numbering.xml`, bevor Sie annehmen, dass der Konverter schuld ist.

### Was passiert mit verfolgten Änderungen und Kommentaren?

Die meisten Konverter nehmen die Änderungen stillschweigend an und verwerfen die Kommentare, Sie bekommen also sauberen Text und verlieren die Überprüfung. Pandoc ist die Ausnahme: `--track-changes` nimmt `accept`, `reject` oder `all`, und sein Handbuch stellt fest, dass nur `all` Kommentare einschließt. Wenn der Überprüfungsverlauf eines Dokuments wichtig ist, konvertieren Sie mit `all` und behalten Sie das Original ohnehin.

### Überleben Tabellen eine Konvertierung von Word zu Markdown?

Einfache Raster ja. Verbundene Zellen, verschachtelte Tabellen, überspannende Kopfzeilen und Zellen mit Listen darin nicht, weil Markdowns Tabellensyntax keine Möglichkeit hat, irgendetwas davon auszudrücken. Konvertieren Sie ein Dokument mit Ihrer schlimmsten Tabelle darin und zählen Sie die Spalten in der Ausgabe, bevor Sie entscheiden, dass das Werkzeug funktioniert.

### Kommen Bilder herüber?

Nicht automatisch und nicht als Teil des Markdown, weil Markdown immer nur auf eine Bilddatei verweist. Pandocs `--extract-media` schreibt sie in ein Verzeichnis, mammoth kann sie als Data-URIs einbetten oder Ihrem eigenen Code übergeben, und Kopieren und Einfügen verliert sie vollständig. Was Sie auch verwenden: prüfen Sie die Bilder, bevor Sie die `.docx` löschen.

### Ist Pandoc oder ein Browser-Konverter besser, um Word in Markdown umzuwandeln?

Sie beantworten verschiedene Fragen. Pandoc ist besser, sobald es mehr als eine Datei, Bilder zum Extrahieren oder verfolgte Änderungen zum Erhalten gibt, und es kostet eine Installation und ein Terminal. Ein Browser-Konverter ist besser für ein Dokument, das Sie jetzt konvertiert haben wollen, ohne es hochzuladen, und er hat keine Optionen zu lernen. Die meisten Leute brauchen beides zu verschiedenen Zeiten.
