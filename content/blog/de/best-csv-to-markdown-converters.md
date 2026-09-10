---
title: "Der beste CSV-zu-Markdown-Tabellen-Konverter 2026: alle Optionen im Vergleich"
description: "CSV- und TSV-zu-Markdown-Konverter im Vergleich: wie jeder mit Feldern in Anführungszeichen, Kommas im Feld und Zeilenumbrüchen in einer Zelle umgeht"
date: 2026-09-08
tag: Konvertieren
keywords: csv zu markdown konverter, csv in markdown tabelle umwandeln, tsv in markdown tabelle umwandeln, csv zu markdown kommandozeile, csv zu markdown tabelle online, excel in markdown tabelle umwandeln, markdown tabelle aus csv erzeugen, csv zu markdown ohne upload
---

Eine CSV in eine Markdown-Tabelle zu verwandeln sieht nach einer Suchen-und-Ersetzen-Aufgabe aus. Setzen Sie überall dorthin, wo ein Komma steht, ein Pipe-Zeichen, fügen Sie unter der ersten Zeile eine Reihe Bindestriche ein, fertig. Das funktioniert, bis es nicht mehr funktioniert, und die Datei, die daran scheitert, hat ein Komma innerhalb eines Feldes in Anführungszeichen, oder eine Produktbeschreibung mit einem Zeilenumbruch mitten darin, oder eine Spalte mit Dateipfaden, in denen ein Pipe-Zeichen steht — und die Tabelle, die dabei herauskommt, hat in einer Zeile die falsche Anzahl Spalten, was Sie erst bemerken, wenn jemand anderes es bemerkt.

### Kurzfassung

Der Unterschied zwischen CSV-zu-Markdown-Konvertern liegt nicht in den Funktionen, sondern darin, ob sie CSV parsen oder an Kommas trennen. Ein Werkzeug, das **RFC 4180** folgt, verkraftet Felder in Anführungszeichen, Kommas innerhalb von Anführungszeichen, ein doppeltes Anführungszeichen als literales Anführungszeichen und Zeilenumbrüche innerhalb einer Zelle; ein Werkzeug, das an Kommas trennt, verstümmelt alle vier und sagt Ihnen nichts davon. Die Seite **/csv-to-markdown** eines Browser-Konverters parst in Ihrem Browser, ohne etwas hochzuladen, und macht aus einem Zeilenumbruch in einer Zelle ein `<br>`, weil eine Markdown-Tabelle keinen echten aufnehmen kann. **Pandoc** und **Miller** lesen CSV und TSV auf der Kommandozeile beide korrekt; **pandas.to_markdown** ist richtig, wenn die Tabelle die letzte Zeile einer Analyse ist. Was Sie auch nehmen: Prüfen Sie eine Zeile mit einem Anführungszeichen darin, bevor Sie dem Rest vertrauen.

## Warum eine CSV nicht einfach zu einer Tabelle wird

Eine CSV-Datei ist ein Textformat mit einer Spezifikation, und die Spezifikation ist kurz genug, um sie in zehn Minuten zu lesen. RFC 4180 sagt, dass Felder durch Kommas getrennt werden, Datensätze durch CRLF, und dass jedes Feld in doppelte Anführungszeichen gesetzt werden darf. Sobald ein Feld in Anführungszeichen steht, darf es Kommas enthalten, es darf Zeilenumbrüche enthalten, und ein doppeltes Anführungszeichen darin wird zweimal geschrieben. Das ist beinahe das ganze Dokument, und jede Regel darin existiert, weil die Daten von irgendjemandem das Trennzeichen enthielten.

Die erste Frage an jeden CSV-zu-Markdown-Tabellen-Konverter ist also, ob er diese Regeln umsetzt oder sie annähert. Die Annäherung ist ein `split(',')`, und sie ist überall: in Shell-Einzeilern, in der Hälfte der Schnipsel im Netz und in mehr Werkzeugen, als man sich wünschen würde. Sie liefert für saubere Daten das richtige Ergebnis, und genau das macht sie so schwer zu entdecken. `Smith, John` in einem Feld in Anführungszeichen wird zu zwei Zellen, die Zeile ist damit eine Zelle breiter als der Kopf, und je nach dem Schreiber am anderen Ende wird diese zusätzliche Zelle entweder stillschweigend verworfen, oder sie schiebt eine Tabelle aus der Form.

Die zweite Frage ist, was auf dem Weg hinaus passiert, denn Markdown-Tabellen haben eigene Regeln, und die sind strenger als die von CSV. Ein Pipe-Zeichen beendet eine Zelle, wo immer es auftritt, ein Wert, der eines enthält, muss also maskiert werden. Eine Zelle kann überhaupt keinen Zeilenumbruch enthalten — die Tabelle ist zeilenbasiert, eine Zeile pro Datensatz, ohne Fortsetzungssyntax —, ein CSV-Feld mit einem Absatz darin muss also plattgemacht werden, oder die Tabelle hört auf, eine Tabelle zu sein. Und es gibt keine Markdown-Tabelle ohne Kopfzeile, denn die Reihe Bindestriche unter dem Kopf ist das, was einen Parser eine Tabelle überhaupt erst erkennen lässt. Tabellen stehen außerdem nicht im schlichten CommonMark, was eine eigene Falle ist, behandelt in [dem Artikel über die Dialekte](/blog/commonmark-gfm-and-the-flavours).

Drittens ist da die Frage, wohin die Datei geht. Tabellenblätter sind die empfindlichsten Dokumente, die die meisten Menschen konvertieren: Lohnauszüge, Kundenlisten, Rechnungsexporte, Ergebnisse, die noch nicht veröffentlicht sind. Ein Online-Konverter, der hochlädt, ist ein Online-Konverter, der jetzt Ihre Zeilen hält. Für eine Tabelle von Open-Source-Lizenzen ist das in Ordnung, und für alles andere ist es eine Datenübermittlung — weshalb die Frage es wert ist, gestellt zu werden, bevor Sie die Datei auf die Seite ziehen.

## Der schnelle Vergleich

| Werkzeug | Am besten für | Entscheidende Fähigkeit | Preis |
| --- | --- | --- | --- |
| TransformPipe | Eine Datei, die Sie haben, und eine Tabelle, die Sie jetzt brauchen | RFC-4180-Parse im Browser, kein Upload, `<br>` für Umbrüche in einer Zelle | Kostenlos |
| Pandoc | Eine CSV, die ein Schritt in einem längeren Dokument-Build ist | `csv`- und `tsv`-Leser in jedes Ausgabeformat, das Pandoc schreibt | Kostenlos, GPL |
| Miller | Die Daten unterwegs filtern oder umformen | `--c2m` konvertiert CSV mit einem einzigen Flag zu Markdown | Kostenlos, BSD 2-Clause |
| csvkit (`csvlook`) | Eine CSV im Terminal lesen, bevor man sie konvertiert | Stellt eine CSV als Markdown-kompatible Tabelle mit fester Breite dar | Kostenlos, MIT |
| csv2md | Ein Befehl in einem Skript | Mehrere voneinander unabhängige Werkzeuge dieses Namens; Flags für Trennzeichen und Kopfzeile | Kostenlos, MIT (die beiden unten) |
| tablesgenerator.com | Die Tabelle nach dem Import bearbeiten | Gitter wie in einer Tabellenkalkulation, CSV-Upload, Einfügen aus Excel | Kostenlos (kein Konto erwähnt) |
| VS-Code-Erweiterungen | Die Datei ist schon in Ihrem Editor offen | Einfügen aus der Zwischenablage als Markdown-Tabelle; Spaltenhervorhebung für CSV | Kostenlos |
| `pandas.to_markdown` | Die Tabelle ist das Ende einer Analyse | Eine Methode auf einem DataFrame, über `tabulate` | Kostenlos, BSD 3-Clause |
| `tabulate` | Zeilen in Python, die kein DataFrame sind | Die Tabellenformate `github` und `pipe` | Kostenlos, MIT |
| Kopieren und Einfügen aus einer Tabellenkalkulation | Ein markierter Bereich, keine ganze Datei | TSV in der Zwischenablage, das sich leichter trennen lässt als CSV | Kostenlos |
| Ein Shell-Einzeiler | Eine Datei, die Sie schon gelesen haben und als sauber kennen | `awk` auf einem Trennzeichen, keine Installation | Kostenlos |
| Ein Assistenten-Chatfenster | Eine Handvoll Zeilen, die Sie mit dem Auge prüfen können | Liest eingefügten Text, formatiert eine Tabelle | Unterschiedlich |

## Die CSV- und TSV-zu-Markdown-Optionen, eine nach der anderen

### TransformPipe — am besten für eine Datei, die Sie haben, und eine Tabelle, die Sie jetzt brauchen

TransformPipe liest eine `.csv`- oder `.tsv`-Datei in Ihrem Browser und gibt eine Markdown-Tabelle zurück, mit der ersten Zeile als Kopf. Es gibt keine Installation, ein Konto ist nicht nötig, und abgemeldet wird die Datei nirgendwohin gesendet — sie wird von der Seite von Ihrer Festplatte gelesen, geparst und als Text zurückgeschrieben.

| Vorteile | Nachteile |
| --- | --- |
| Ein echter RFC-4180-Parse: Felder in Anführungszeichen, eingebettete Kommas, doppelte Anführungszeichen, mehrzeilige Zellen | Eine Datei zur Zeit; kein Stapelbetrieb über ein Verzeichnis |
| Ein Zeilenumbruch in einer Zelle wird zu `<br>`, statt die Tabelle zu zerbrechen | Die erste Zeile wird als Kopf behandelt, eine Datei ohne Kopfzeile braucht also eine hinzugefügte |
| Pipe-Zeichen und Backslashes in Werten werden maskiert, ein Pfad oder eine Regex spaltet also keine Zeile | Keine Ausrichtungs-Doppelpunkte: jede Spalte kommt linksbündig heraus, solange Sie die Trennzeile nicht bearbeiten |
| Das Trennzeichen wird aus der ersten Zeile erschnüffelt, ein Export mit Semikolon funktioniert also ohne Flag | Der Browser macht die Arbeit, ein sehr großer Export ist also von der Maschine begrenzt |

**Preis:** kostenlos. Ein Konto bringt Verlauf, Freigaben und eine API, ebenfalls kostenlos.

**Technische Details und Funktionen**

- Der Parser sind die RFC-4180-Regeln und nichts weiter: ein Anführungszeichen öffnet ein Feld, ein doppeltes Anführungszeichen darin ist ein literales Anführungszeichen, und ein Zeilenumbruch innerhalb von Anführungszeichen gehört zur Zelle, statt die Zeile zu beenden
- Das Trennzeichen wird in der ersten Zeile außerhalb von Anführungszeichen über Komma, Tabulator, Semikolon und Pipe gezählt, und das häufigste gewinnt; eine Endung `.tsv` erzwingt den Tabulator
- Eine Byte-Order-Mark wird entfernt und CRLF-Zeilenenden werden vor dem Parsen normalisiert, eine unter Windows aus Excel exportierte Datei verhält sich also wie jede andere
- Kurze Zeilen werden mit leeren Zellen auf die Breite der breitesten Zeile aufgefüllt, eine ausgefranste Datei ergibt also trotzdem eine rechteckige Tabelle
- Der Dateiname wird zu einer H1 über der Tabelle, denn eine Tabelle ohne Titel ist eine Tabelle, die eine Woche später niemand mehr einordnen kann
- Dieselbe Konvertierung läuft über eine REST-API, eine abhängigkeitsfreie CLI, die die Konvertierung an der Dateiendung erkennt, eine GitHub Action und einen MCP-Server

**Wer sollte es verwenden?** Jeden mit einem Tabellenexport und einem Dokument, in das er hinein soll, besonders wenn die Zeilen nicht öffentlich sind. Die ganze Konvertierung passiert auf Ihrer Maschine, was Sie bestätigen können, indem Sie dem Netzwerk-Tab dabei zusehen, wie er während des Laufs nichts tut.

### Pandoc — am besten, wenn die CSV ein Schritt in einem längeren Dokument ist

Pandoc ist ein Dokumentkonverter für die Kommandozeile, geschrieben in Haskell, und seine Liste der Eingabeformate enthält `csv` (was das Handbuch als eine RFC-4180-Tabelle beschreibt) und `tsv`. Damit ist es das einzige Werkzeug hier, das eine CSV nimmt und Ihnen mit demselben Befehl und einem anderen `-t` Markdown, HTML, LaTeX, DOCX oder EPUB gibt.

| Vorteile | Nachteile |
| --- | --- |
| Liest CSV und TSV von Haus aus, ohne Hilfsskript | Eine Installation, und eine große |
| Schreibt aus derselben Eingabe in jedes Ausgabeformat, das Pandoc unterstützt | Der Markdown-Tabellendialekt hängt davon ab, welche Writer-Erweiterung aktiv ist |
| `--standalone` erzeugt ein vollständiges Dokument statt eines Fragments | Keine Kontrolle über das Trennzeichen: Komma für `csv`, Tabulator für `tsv` |
| Auf sehr vielen Build-Maschinen für Dokumentation schon installiert | Mehr Werkzeug, als eine einzelne Tabelle braucht |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- `pandoc -f csv -t markdown data.csv` schreibt eine Pipe-Tabelle; `-f tsv` für tabulatorgetrennte Eingabe (geprüft auf pandoc.org, 8. September 2026)
- Der erste Datensatz der Datei wird als Kopfzeile gelesen, was dieselbe Annahme ist, die jedes andere Werkzeug hier trifft
- Welche Markdown-Tabellensyntax herauskommt, hängt von den Tabellen-Erweiterungen des Writers ab — `pipe_tables` ist die, die zu GitHub passt, und eine Grid- oder Simple-Tabelle wird in einem GFM-Parser nicht dargestellt
- Dieselbe Datei kann direkt zu HTML gehen, und `--standalone` verpackt sie in ein Dokument mit Kopf und Stilen, statt Ihnen ein Fragment zu hinterlassen

**Wer sollte es verwenden?** Jeden, dessen CSV eine Eingabe unter mehreren in einem Build ist, der ohnehin Pandoc ausführt. Wenn das Ziel eine Webseite statt Markdown ist, ist der direkte Weg meist der kürzere — [der Konvertervergleich](/blog/best-markdown-to-html-converters) behandelt, was für diese Etappe zu nehmen ist.

### Miller — am besten, um die Daten unterwegs umzuformen

Miller ist ein Kommandozeilenprozessor für CSV, TSV, JSON und JSON Lines, geschrieben in Go, ohne Laufzeitabhängigkeiten. Markdown ist eines seiner Ausgabeformate, eine Konvertierung ist also ein Flag statt eines Skripts.

| Vorteile | Nachteile |
| --- | --- |
| `--c2m` konvertiert CSV mit einem einzigen Flag zu einer Markdown-Tabelle | Noch eine Installation, und eine Befehlssprache zum Lernen |
| Spalten filtern, sortieren, ausschneiden und umbenennen, im selben Befehl, der konvertiert | Die Ausgabe ist standardmäßig ungefüllt, was in der Rohdatei schwerer zu lesen ist |
| Liest Markdown-Tabellen auch wieder ein, nicht nur schreibt sie | Verben und Flags sind eine echte Syntax, keine einzelne Option |
| Eine einzige statische Binärdatei, keine Laufzeitumgebung | Überdimensioniert, wenn Sie eine Datei einmal konvertieren |

**Preis:** kostenlos, Open Source, BSD-Lizenz mit zwei Klauseln (geprüft auf github.com/johnkerl/miller, 8. September 2026).

**Technische Details und Funktionen**

- `--omd` wählt Markdown-Ausgabe, `--imd` Markdown-Eingabe, und die Tippsparer `--c2m` und `--m2c` machen CSV zu Markdown und zurück
- `--omd-aligned` füllt die Spalten auf, damit der Quelltext der Tabelle für einen Menschen lesbar ist, der sie hinterher bearbeitet
- `--right-align-numeric` gibt für numerische Spalten `---:` in der Trennzeile aus, was die Ausrichtungssyntax ist, die GFM versteht
- Weil die Konvertierung ein Ausgabeformat statt eines Modus ist, filtert und konvertiert `mlr --c2m sort -f region cut -f region,total data.csv` in einem Durchgang

**Wer sollte es verwenden?** Jeden, der eine Teilmenge der Datei will statt der ganzen — das letzte Quartal, drei von elf Spalten, Zeilen über einem Schwellenwert. Das im Konverter zu tun ist besser, als alles zu konvertieren und hinterher Zeilen im Markdown zu löschen.

### csvlook aus csvkit — am besten, um die Datei zu lesen, bevor Sie sie konvertieren

csvkit ist eine Sammlung von Kommandozeilenwerkzeugen für CSV, geschrieben in Python. `csvlook` stellt eine CSV im Terminal in einem Format dar, das die eigene Dokumentation Markdown-kompatibel und von fester Breite nennt — eine Tabelle, die Sie lesen und einfügen können.

| Vorteile | Nachteile |
| --- | --- |
| Die Ausgabe ist als Markdown-kompatibel dokumentiert, sie lässt sich also meist direkt einfügen | Gebaut, um Daten anzusehen, nicht um Dateien zu erzeugen |
| Erschnüffelt den CSV-Dialekt, seltsame Trennzeichen werden also oft ohne Flag verkraftet | Die Auffüllung auf feste Breite macht den Quelltext weitschweifig |
| Der Rest von csvkit — `csvcut`, `csvgrep`, `csvsql` — lässt sich damit kombinieren | Braucht Python und pip |
| Typerkennung lässt numerische Spalten ausgerichtet stehen | Optionen zum Abschneiden können breite Zellen stillschweigend verkürzen |

**Preis:** kostenlos, MIT-lizenziert (geprüft auf github.com/wireservice/csvkit, 8. September 2026).

**Technische Details und Funktionen**

- `csvlook data.csv` druckt die Tabelle; Pipes funktionieren, `csvcut -c 1,3 data.csv | csvlook` verschmälert sie also vorher
- `--max-rows`, `--max-columns` und `--max-column-width` begrenzen, was angezeigt wird, und jedes davon ändert die Tabelle, nicht nur die Ansicht
- `--no-inference` schaltet die Typerkennung ab, was für Spalten mit Kennungen zählt, die wie Zahlen aussehen
- `--snifflimit 0` schaltet die Dialekterkennung ab, wenn die Vermutung falsch ist

**Wer sollte es verwenden?** Leute, die im Terminal leben und die Datei sehen wollen, bevor sie irgendetwas über sie entscheiden. Nehmen Sie die Markdown-Ausgabe als Bequemlichkeit und nicht als den Zweck, und prüfen Sie die Flags zum Abschneiden, bevor Sie eine breite Tabelle einfügen.

### csv2md — am besten für eine Zeile in einem Skript, sobald Sie sich für eines entschieden haben

Es gibt kein einzelnes csv2md. Es gibt mehrere voneinander unabhängige Werkzeuge mit diesem Namen, in verschiedenen Sprachen, mit verschiedenen Flags, und die Suche nach einem liefert die anderen. Zwei sind leicht zu überprüfen: ein Python-Werkzeug, das mit pip installiert wird, und ein Ruby-Werkzeug, das als Gem installiert wird.

| Vorteile | Nachteile |
| --- | --- |
| Macht genau eine Sache, es gibt also nichts zu konfigurieren | Die Namenskollision ist eine echte Gefahr beim Schreiben von Installationsanleitungen |
| Die Python-Fassung nimmt Flags für Trennzeichen, Anführungszeichen und Ausrichtung | Kleine Einzweckwerkzeuge kommen und gehen |
| Die Ruby-Fassung kehrt die Konvertierung um, Markdown-Tabelle zurück zu CSV | Noch ein Paketmanager in Ihrem Build |
| Liest stdin, fügt sich also in eine Pipeline ein | Das Verhalten unterscheidet sich zwischen den Werkzeugen, die den Namen teilen |

**Preis:** kostenlos, MIT-lizenziert — sowohl die Python- als auch die Ruby-Implementierung (geprüft auf github.com/lzakharov/csv2md und github.com/jonmagic/csv2md, 8. September 2026).

**Technische Details und Funktionen**

- Das Python-Werkzeug (`pip install csv2md`) dokumentiert `-d` für das Trennzeichen, `-q` für das Anführungszeichen, `-C` zur Auswahl von Spalten, `-c` und `-r` für zentrierte und rechte Ausrichtung und `-H`, um zu sagen, dass die Datei keine Kopfzeile hat — in welchem Fall es Kopfzeilen im Stil einer Tabellenkalkulation erzeugt, a, b, c
- Dieses Flag `-H` ist eine Erwähnung wert: es ist das einzige Werkzeug hier, das die Frage nach der Datei ohne Kopfzeile mit etwas anderem beantwortet als „Ihre erste Datenzeile ist jetzt der Kopf“
- Das Ruby-Werkzeug (`gem install csv2md`) konvertiert CSV zu einer Tabelle in GitHub Flavored Markdown und nimmt `-r`, um in die andere Richtung zu gehen

**Wer sollte es verwenden?** Skripte, die immer wieder eine bekannte Dateiform konvertieren. Legen Sie das genaue Paket in Ihrer Anleitung fest, denn „installieren Sie csv2md“ ist ein mehrdeutiger Ratschlag.

### tablesgenerator.com — am besten, um die Tabelle nach dem Import zu bearbeiten

Tables Generator ist ein Browser-Werkzeug, das Ihnen ein Gitter wie in einer Tabellenkalkulation gibt und daraus Markup erzeugt, Markdown unter mehreren Formaten. Sein Wert liegt nicht in der Konvertierung, er liegt in den zwanzig Minuten danach, in denen Sie die Tabelle richten.

| Vorteile | Nachteile |
| --- | --- |
| Eine CSV-Datei importieren oder einen Bereich aus Excel, Google Sheets oder LibreOffice einfügen | Ihre Zeilen gehen durch eine gehostete Seite |
| Zellen bearbeiten, Zeilen und Spalten einfügen und verschieben, die ganze Tabelle transponieren | Ein Gitter hat praktische Größengrenzen: die Seite nennt einen gültigen Bereich von 1 bis 500 Zeilen und 1 bis 20 Spalten (geprüft auf tablesgenerator.com, 8. September 2026) |
| Ausrichtungssteuerung je Spalte, und Rückgängig | Von Hand bearbeiten skaliert nicht über eine Bildschirmfüllung hinaus |
| Erzeugt aus demselben Gitter LaTeX, HTML und MediaWiki | Nicht skriptfähig |

**Preis:** kostenlos; auf der Seite wird kein Konto und keine Bezahlung erwähnt (geprüft auf tablesgenerator.com, 8. September 2026).

**Technische Details und Funktionen**

- Import aus einem CSV-Upload, aus eingefügtem Markdown oder HTML oder aus einem kopierten Bereich einer Tabellenkalkulation
- Suchen und Ersetzen, Zahlenformatierung, Einfügen und Entfernen von Zeilen und Spalten, Transposition, lokales automatisches Speichern
- Die Seite nennt Unterstützung für die Tabellensyntax von GitHub Flavored Markdown, was der Dialekt ist, über den sich die meisten Parser einig sind
- In die Zwischenablage kopieren oder das Ergebnis als CSV herunterladen

**Wer sollte es verwenden?** Jeden, der eine Tabelle von Hand aus mehr als einer Quelle zusammenstellt, oder die Überschriften und die Ausrichtung einer konvertierten Tabelle vor der Veröffentlichung richtet. Nicht das Werkzeug für vertrauliche Zeilen, und nicht das Werkzeug für eine Datei mit zehntausend davon.

### VS-Code-Erweiterungen — am besten, wenn die Datei schon in Ihrem Editor offen ist

Wenn die CSV in Ihrem Repository liegt, ist der kürzeste Weg der Editor, in dem sie schon offen ist. Zwei Erweiterungen decken die beiden Hälften der Aufgabe ab: eine fügt einen kopierten Bereich einer Tabellenkalkulation als Markdown-Tabelle ein, die andere macht die CSV selbst lesbar.

| Vorteile | Nachteile |
| --- | --- |
| Keine neue Anwendung: die Konvertierung passiert dort, wo die Datei liegt | Qualität und Pflege der Erweiterungen schwanken |
| Über die Zwischenablage, funktioniert also aus Excel und Sheets ebenso wie aus Dateien | Jede Erweiterung macht einen Teil der Aufgabe |
| Kostenlos | Nur im Editor: nichts davon läuft in der CI |
| Spaltenhervorhebung macht ein zerbrochenes Anführungszeichen sichtbar, bevor Sie konvertieren | Das Verhalten bei seltsamen Trennzeichen hängt von der Erweiterung ab |

**Preis:** kostenlos (geprüft auf marketplace.visualstudio.com, 8. September 2026).

**Technische Details und Funktionen**

- Excel to Markdown table (csholmq) verwandelt einen kopierten Bereich einer Tabellenkalkulation in der Zwischenablage in eine Markdown-Tabelle, über die Befehlspalette oder mit Shift+Alt+V, und liest ein Präfix `^l`, `^c` oder `^r` an einer Kopfzelle, um die Ausrichtung dieser Spalte zu setzen
- Rainbow CSV (mechatroner) färbt die Spalten einer CSV oder TSV, sodass ein falsch gesetztes Anführungszeichen als Farbwechsel sichtbar wird, bietet Spaltenausrichtung und enthält einen Befehl zum Kopieren im Markdown-Format
- Die Dokumentation von Rainbow CSV nennt, dass ihr Dateityp Dynamic CSV mehrzeilige Felder verkraftet, die in doppelte Anführungszeichen gesetzt sind, was der RFC-4180-Fall ist, den die meisten Hervorheber falsch machen
- Beide arbeiten an der Datei, wie sie ist: keine von beiden fügt einen Build-Schritt hinzu

**Wer sollte sie verwenden?** Entwickler, die Dokumentation neben den Daten schreiben. Nehmen Sie beide zusammen — eine, um die Datei zu prüfen, eine, um die Tabelle zu erzeugen.

### pandas.to_markdown — am besten, wenn die Tabelle das Ende einer Analyse ist

Wenn die Zeilen schon durch pandas gelaufen sind, ist die Markdown-Tabelle einen Methodenaufruf entfernt. `DataFrame.to_markdown()` existiert, und es setzt voraus, dass das Paket `tabulate` installiert ist.

| Vorteile | Nachteile |
| --- | --- |
| Eine Methode, am Ende einer Arbeit, die Sie ohnehin gemacht haben | Der Index ist standardmäßig enthalten, was eine unbenannte erste Spalte erzeugt |
| Der CSV-Leser von pandas verkraftet Anführungszeichen, Kodierungen und Trennzeichen korrekt | Eine schwere Abhängigkeit, nur für eine Tabelle |
| Vor dem Konvertieren filtern, gruppieren und sortieren, was der übliche Grund ist, hier zu sein | Braucht Python und ein Skript, kein Ablegen einer Datei |
| `tablefmt` wird an tabulate durchgereicht, der Tabellenstil ist also wählbar | Kein Konverter: ein Bibliotheksaufruf in Ihrem eigenen Code |

**Preis:** kostenlos. pandas ist BSD-3-Clause-lizenziert; tabulate, das es voraussetzt, ist MIT.

**Technische Details und Funktionen**

- `pd.read_csv('data.csv').to_markdown(index=False)` ist die ganze Konvertierung, und `index=False` ist der Teil, den Leute vergessen (geprüft auf pandas.pydata.org, 8. September 2026)
- Der Parameter `index` steht standardmäßig auf `True`, die Standardausgabe trägt also die Zeilennummern in einer Spalte ohne Kopf
- `tablefmt` wird an tabulate übergeben, und der dokumentierte Standard gibt Ausrichtungs-Doppelpunkte in der Trennzeile aus
- Alles, was pandas auf dem Weg hinein mit einer CSV macht — Typerkennung, `na_values`, `thousands`, ein ausdrückliches `encoding` —, passiert, bevor die Tabelle geschrieben wird, zum Guten wie zum Schlechten

**Wer sollte es verwenden?** Jeden, der eine Tabelle aus Daten erzeugt, die er ohnehin berechnet: einen Wochenbericht, ein Notebook-Ergebnis, eine Zusammenfassung, die ein Skript an eine Markdown-Datei anhängt.

### tabulate — am besten, wenn Sie Zeilen haben, aber kein DataFrame

tabulate ist die Bibliothek, die pandas aufruft, und sie nimmt eine schlichte Liste von Listen. Wenn Ihre Zeilen aus einem Datenbank-Cursor, einer JSON-Antwort oder `csv.reader` kommen, ist das die kleinere Abhängigkeit.

| Vorteile | Nachteile |
| --- | --- |
| Funktioniert auf jedem iterierbaren Bestand von Zeilen; kein DataFrame nötig | Das CSV-Parsen machen Sie selbst |
| Die Formate `github` und `pipe` erzeugen beide Markdown-Tabellen | Nichts zum Ausführen: es ist eine Bibliothek, kein Befehl |
| Klein, ohne eine Kette von Abhängigkeiten dahinter | Keine Meinung über Ihre Datentypen |

**Preis:** kostenlos, MIT-lizenziert (geprüft auf pypi.org, 8. September 2026).

**Technische Details und Funktionen**

- `tabulate(rows, headers=header, tablefmt='github')` erzeugt eine Tabelle im GFM-Stil; `tablefmt='pipe'` fügt Ausrichtungs-Doppelpunkte in der Trennzeile hinzu (geprüft auf pypi.org, 8. September 2026)
- Kombinieren Sie es mit dem Modul `csv` der Standardbibliothek, das die Regeln für Anführungszeichen umsetzt, und nicht mit `line.split(',')`
- Die Behandlung des Kopfes ist ausdrücklich: Sie übergeben `headers` selbst, eine Datei ohne Kopfzeile ist also Ihre Entscheidung und nicht die des Werkzeugs

**Wer sollte es verwenden?** Python-Skripte, die die Zeilen schon im Speicher halten und am Ende eine Tabelle brauchen. Nehmen Sie `csv.reader` für die Eingabe und tabulate für die Ausgabe, und Sie haben beide Fehler übersprungen, die die naive Fassung hat.

### Kopieren und Einfügen aus einer Tabellenkalkulation — am besten für einen Bereich, nicht für eine Datei

Zellen aus Excel, Numbers oder Google Sheets zu kopieren legt tabulatorgetrennten Text in die Zwischenablage, kein CSV. Das zählt: Tabulatoren erscheinen fast nie innerhalb eines Wertes, an ihnen zu trennen ist also weit sicherer, als an Kommas zu trennen. Deshalb funktioniert der Weg über die Zwischenablage so oft, wie er es tut.

| Vorteile | Nachteile |
| --- | --- |
| Keine Datei zu exportieren, kein Werkzeug zu installieren | Konvertiert eine Auswahl, keine Quelle der Wahrheit |
| TSV in der Zwischenablage vermeidet das Problem des eingebetteten Kommas ganz | Formeln kommen als Werte an; Formatierung kommt gar nicht an |
| Funktioniert aus einem Bereich, was oft alles ist, was Sie wollten | Eine Zelle mit einem Zeilenumbruch wird trotzdem als mehrere Zeilen eingefügt |
| Jeder TSV-fähige Konverter nimmt es direkt an | Verbundene Zellen fallen auf Weisen zusammen, die Sie prüfen müssen |

**Preis:** kostenlos.

**Technische Details und Funktionen**

- Ein kopierter Bereich ist TSV, ein `.tsv`-Konvertierungsweg oder eine Einfüge-Erweiterung verkraftet ihn also ohne Einstellung eines Trennzeichens
- Zellen, die Tabulatoren oder Zeilenumbrüche enthalten, werden von der Tabellenkalkulation in der Zwischenablage in Anführungszeichen gesetzt, was bedeutet, dass die Regeln für Anführungszeichen weiterhin gelten
- Zahlenformatierung ist eine Anzeigeeigenschaft: eine Zelle, die 1.234,00 € zeigt, legt möglicherweise `1234` in die Zwischenablage, und eine Zelle, die einen gerundeten Wert zeigt, legt dort möglicherweise die volle Genauigkeit ab

**Wer sollte das verwenden?** Jeden, der einmal einen Teil eines Blattes konvertiert. Wenn derselbe Bereich jede Woche konvertiert werden muss, exportieren Sie die Datei und schreiben Sie stattdessen ein Skript.

### Ein Shell-Einzeiler — am besten für eine Datei, die Sie schon gelesen haben

`awk -F, '{...}'` ist der CSV-zu-Markdown-Tabellen-Konverter, der sich am schnellsten schreiben lässt, und der, bei dem am leichtesten etwas schiefgeht. Er ist für genau eine Lage eine legitime Wahl: eine Datei, die Sie geöffnet und angesehen haben und von der Sie wissen, dass sie keine Anführungszeichen, keine eingebetteten Trennzeichen und keine Zeilenumbrüche in Zellen enthält.

| Vorteile | Nachteile |
| --- | --- |
| Nichts zu installieren; funktioniert auf jeder Maschine mit einer Shell | `-F,` ist eine Trennung, kein CSV-Parse |
| Gut für maschinell erzeugte Dateien mit fester Form | Scheitert stillschweigend an Feldern in Anführungszeichen, was die schlimmste Art des Scheiterns überhaupt ist |
| Leicht zu lesen und anzupassen | Pipe-Zeichen zu maskieren und Zeilenumbrüche plattzumachen liegt ganz bei Ihnen |

**Preis:** kostenlos.

**Wer sollte das verwenden?** Jemanden, der Ausgaben konvertiert, die er selbst erzeugt hat, in einem Skript, das hinterher gelöscht wird. Für alles, was aus einer Tabellenkalkulation, einem Datenbankexport oder von einer anderen Person kam, nehmen Sie ein Werkzeug mit einem Parser. Der Preis des Einzeilers ist nicht, dass er zerbricht; er ist, dass er eine Zeile mitten unter hundert zerbricht.

### Ein Assistenten-Chatfenster — am besten für eine Handvoll Zeilen, die Sie prüfen können

Zeilen in einen Assistenten einzufügen und nach einer Markdown-Tabelle zu fragen funktioniert, und es ist die einzige Option hier, die auch Ihre Überschriften aufräumt. Der Haken ist, dass sie Text erzeugt statt ihn umzuwandeln, die Ausgabe hält also nicht garantiert dieselben Werte wie die Eingabe.

| Vorteile | Nachteile |
| --- | --- |
| Verkraftet unordentliche, halb strukturierte Eingaben, die ein Parser ablehnt | Werte können umformatiert, gerundet oder umgestellt werden |
| Benennt Überschriften um und stellt Spalten um, wenn man danach fragt | Keine Garantie, dass jede Zeile überlebt, besonders bei langen Eingaben |
| Nichts zu installieren | Einfügen bedeutet, dass die Daten Ihre Maschine verlassen |
| Nützlich für die letzte unbequeme Ecke einer Tabelle | Nicht reproduzierbar: dasselbe zweimal eingefügt kann sich unterscheiden |

**Preis:** unterschiedlich je Assistent.

**Wer sollte das verwenden?** Jeden mit zwanzig Zeilen und dem Blick auf allen. Für einen Lohnexport nehmen Sie einen Parser; für eine hingekritzelte Liste mit drei Spalten ist das schneller als alles oben. [Ein geprüftes Ergebnis aus einem Assistenten in eine Seite zu bringen](/blog/ai-output-to-a-shareable-page) ist eine eigene kurze Übung.

## Was RFC 4180 mit einem Konverter macht

Das ist der Abschnitt, den die eigene Seite eines Werkzeugs auslässt, denn jeder Punkt darauf ist eine Art, still zu scheitern. Nehmen Sie eine repräsentative Datei — eine echte, mit den unbequemen Zeilen noch darin — und prüfen Sie jeden dieser Punkte, bevor Sie sich auf irgendetwas festlegen.

**Ein Komma in einem Feld in Anführungszeichen.** `"Smith, John",Sales,2026` sind drei Felder, nicht vier. Ein Parser liest die Anführungszeichen und behält das Komma; eine Trennung erzeugt vier Zellen und eine Zeile, die eine Zelle breiter ist als der Kopf. Die Regel von GFM lautet, dass zusätzliche Zellen jenseits der Anzahl im Kopf verworfen werden, `Sales` und `2026` rutschen also nach links, und der letzte Wert verschwindet. Nichts warnt Sie davor. Die Zeile sagt einfach etwas anderes als die Datei.

**Ein doppeltes Anführungszeichen ist ein einzelnes Anführungszeichen.** Innerhalb eines Feldes in Anführungszeichen bedeutet `""` ein literales `"`. `"She said ""no""."` ist also ein Feld, das lautet: She said "no". Ein Werkzeug, das Anführungszeichen mit einer Regex entfernt, lässt die doppelten stehen, und Sie erhalten `She said ""no""` in Ihrer Tabelle. Das ist kosmetisch, bis der Wert ein Codebeispiel oder eine Maßangabe in Zoll ist, und an diesem Punkt ist es falsch.

**Ein Zeilenumbruch in einer Zelle.** Das ist der Fall ohne saubere Antwort. RFC 4180 erlaubt einen Zeilenumbruch innerhalb eines Feldes in Anführungszeichen, und Tabellenkalkulationen erzeugen sie ständig — Adressblöcke, Notizspalten, alles, wo ein Mensch Alt+Enter getippt hat. Eine Markdown-Tabelle hat keine Möglichkeit, ihn darzustellen: die Tabelle ist eine Zeile pro Datensatz, und ein Zeilenumbruch in einer Zelle beendet die Zeile. Jedes Werkzeug muss sich für eine Lüge entscheiden. Den Umbruch fallen zu lassen schiebt zwei Sätze ineinander. Die Zeile aufzuteilen erzeugt eine zweite, fehlerhafte Zeile. Den Umbruch durch `<br>` zu ersetzen erhält den sichtbaren Zeilenumbruch, wenn das Markdown als HTML dargestellt wird, und hinterlässt ein HTML-Tag in einer Datei, die vielleicht nicht als HTML dargestellt wird. TransformPipe ersetzt durch `<br>`, mit der Begründung, dass ein sichtbares Tag besser ist als eine stillschweigend zerbrochene Tabelle — aber es ist ein Tauschgeschäft, und [was Markdown allgemein mit Zeilenumbrüchen macht](/blog/markdown-line-breaks-and-lists) erklärt, warum es innerhalb einer Tabelle keine bessere Möglichkeit gibt.

**Ein Pipe-Zeichen in einem Wert.** CSV interessieren Pipe-Zeichen nicht; Markdown interessieren sie sehr. Ein nicht maskiertes `|` beendet die Zelle, wo immer es auftritt, auch innerhalb von Backticks, ein einziger Wert, der `a|b` enthält, fügt dieser Zeile also eine Phantomspalte hinzu. Es muss auf dem Weg hinaus als `\|` maskiert werden. Das ist das Scheitern, über das Konverter stolpern, die von Leuten geschrieben wurden, die mit Namen und Zahlen getestet haben: es zeigt sich in Dateipfaden, regulären Ausdrücken, Shell-Befehlen und jeder Spalte, die eine Liste von Optionen hält. Wenn Sie solche Daten konvertieren, setzen Sie absichtlich ein Pipe-Zeichen in eine Testzelle und sehen Sie, was herauskommt. [Der Artikel über Tabellen](/blog/markdown-tables-that-survive-conversion) behandelt, was die Maskierung auf der anderen Seite bewirkt.

**Eine Datei ohne Kopfzeile.** Maschinell erzeugte CSVs haben häufig keine — ein Log-Export, ein Datenbankauszug, ein Sensor-Feed. Eine Markdown-Tabelle kann ohne Kopf nicht existieren, denn die Trennzeile darunter ist das, was die Tabelle für den Parser kennzeichnet. Jeder Konverter macht also eines von drei Dingen: er befördert Ihre erste Datenzeile zum Kopf, was die Bedeutung dieser Zeile verliert; er erzeugt Platzhalter-Überschriften wie a, b, c oder Spalte 1; oder er verweigert. Die meisten nehmen stillschweigend die erste Möglichkeit, weshalb eine konvertierte Log-Datei so oft einen Zeitstempel dort hat, wo die Spaltennamen stehen sollten. Wenn Ihre Datei keinen Kopf hat, fügen Sie einen hinzu, bevor Sie konvertieren. Es ist eine Zeile, und es ist die einzige Fassung davon, die gut ausgeht.

**Das Trennzeichen ist nicht immer ein Komma.** Eine CSV, die in einer Region exportiert wurde, in der das Komma das Dezimaltrennzeichen ist, ist sehr oft mit Semikolon getrennt, und sie endet trotzdem auf `.csv`. Tabulatorgetrennte Dateien sind dasselbe Dateiformat mit einem anderen Trennzeichen. Ein Konverter, der ein Komma annimmt, verwandelt jede Zeile in eine einzige Zelle, die alles enthält — ein offensichtliches Scheitern immerhin, was mehr ist, als die anderen bieten. Suchen Sie nach einer Option für das Trennzeichen oder nach einem Werkzeug, das die erste Zeile erschnüffelt.

**Die Bytes vor dem ersten Feld.** Eine Datei, die unter Windows aus Excel gespeichert wurde, kann mit einer Byte-Order-Mark beginnen und CRLF-Zeilenenden verwenden. Die BOM hängt sich an Ihre erste Spaltenüberschrift, wo sie im Editor unsichtbar ist und jeden Vergleich gegen diese Überschrift zerbricht. Das CRLF hinterlässt am Ende jedes letzten Feldes einen verirrten Wagenrücklauf. Beides ist für einen Konverter trivial zu behandeln, und keines von beiden wird von einer naiven Trennung behandelt.

**Zeilen, die nicht alle gleich lang sind.** Echte Exporte haben ausgefranste Zeilen. Die Breite einer Markdown-Tabelle wird vom Kopf gesetzt, und Körperzeilen werden ohne einen Kommentar aufgefüllt oder abgeschnitten, damit sie passen. Eine kurze Zeile aufzufüllen ist fast immer richtig. Eine lange abzuschneiden wirft Daten weg, und die Zeile, die abgeschnitten wird, ist meist die mit dem Problem bei den Anführungszeichen — eine ausgefranste Zeile ist es also wert, untersucht zu werden, statt aufgefüllt zu werden.

## Wohin eine Markdown-Tabelle einfach nicht kommt

Ein Teil dessen, was eine Tabellenkalkulation hält, hat überhaupt keine Entsprechung in Markdown, und zu wissen, welche Teile das sind, erspart Ihnen die Suche nach einem Konverter, der sie behandelt. Keiner tut es.

**Verbundene Zellen.** Es gibt in einer Markdown-Tabelle kein colspan und kein rowspan. Ein verbundener Kopf über drei Spalten muss zu einer Überschrift in einer Spalte werden, mit zwei leeren daneben, oder zu drei wiederholten Überschriften. Wenn die Quelle sich für ihre Struktur auf verbundene Zellen stützt, muss die Tabelle neu entworfen und nicht konvertiert werden.

**Formeln und Zahlenformate.** Ein CSV-Export enthält Werte, keine Formeln — dieser Verlust passiert, bevor der Konverter die Datei sieht. Der Zahlenformatierung geht es genauso: Währungssymbole, Tausendertrennzeichen, Prozentangaben und Datumsformate sind Anzeigeeigenschaften der Tabellenkalkulation, und was in der CSV landet, ist das, was der Exporteur zu schreiben gewählt hat. Wenn die konvertierte Tabelle `0,4567` zeigt, wo das Blatt 45,67 % zeigte, hat der Export das getan, nicht die Konvertierung.

**Sehr breite Tabellen.** Markdown-Tabellen brechen nicht um und scrollen nicht von sich aus. Zwölf Spalten Prosa werden als Tabelle dargestellt, die breiter ist als die Seite, und was dann passiert, liegt bei dem, was sie darstellt — horizontales Überlaufen, ein Zusammenquetschen oder eine Scrollleiste, wenn das umgebende HTML eine bereitstellt. Schneiden Sie Spalten vor der Konvertierung heraus, oder nehmen Sie hin, dass die Tabelle nur auf einem breiten Bildschirm gelesen wird.

**Sortieren, Filtern und Summen.** Eine Markdown-Tabelle ist Text. Sie hat keine Sortierung, keinen Filter, keine Summenzeile, die neu rechnet. Wenn der Leser die Zahlen befragen muss, ist die Tabelle die falsche Ausgabe und ein Link auf die CSV die richtige. Markdown-Tabellen sind für Daten, die klein genug und abgeschlossen genug sind, um gelesen zu werden.

## Wie Sie wählen

1. **Prüfen Sie vor allem anderen eine schwierige Zeile.** Suchen Sie in Ihrer Datei einen Wert mit einem Anführungszeichen, einem Komma innerhalb von Anführungszeichen oder einem Zeilenumbruch darin, konvertieren Sie diese Datei und sehen Sie sich diese Zeile in der Ausgabe an. Wenn sie überlebt, hat das Werkzeug einen Parser; wenn nicht, zählt keine andere Funktion, denn das Scheitern ist stumm und die Datei ist jetzt auf feine Weise falsch.
2. **Entscheiden Sie, ob die Zeilen die Maschine verlassen dürfen.** Für eine Tabelle öffentlicher Daten ist das keine Erwägung. Für alles mit Namen, Gehältern oder unveröffentlichten Zahlen darin sind eine Konvertierung im Browser oder ein lokales Kommandozeilenwerkzeug die einzigen zwei Möglichkeiten, und der Unterschied ist in einem Funktionsvergleich nicht sichtbar.
3. **Zählen Sie, wie oft Sie das tun werden.** Einmal ist ein Ablegen einer Datei. Jede Woche ist ein Skript, und ein Skript spricht für Pandoc, Miller oder einen Bibliotheksaufruf, denn ein Mensch, der einen Browser-Tab bedient, ist der Teil eines wöchentlichen Vorgangs, der irgendwann vergessen wird.
4. **Fragen Sie sich, ob Sie alle Zeilen wollen.** Wenn die Antwort nein ist, konvertieren Sie mit etwas, das auch filtern kann. Zeilen von Hand aus einer Markdown-Tabelle zu löschen ist die langsamste denkbare Art, es zu tun, und sie ist der Ort, aus dem Übertragungsfehler kommen.
5. **Sehen Sie nach, ob Ihre Datei einen Kopf hat, bevor das Werkzeug für Sie entscheidet.** Wenn nicht, fügen Sie einen hinzu. Jede Antwort eines Konverters auf eine Datei ohne Kopfzeile verliert etwas, und die Fassung, in der Sie die Spaltennamen liefern, ist die einzige, die eine Tabelle erzeugt, die später noch jemand lesen kann.

## Fazit

Der beste CSV-zu-Markdown-Tabellen-Konverter ist der, der die Datei als CSV liest und nicht als Text mit Kommas darin — [die Anleitung listet jede Falle nach Symptom auf](/blog/convert-csv-to-markdown-table) —, denn alles andere an dieser Aufgabe ist leicht, und dieser Teil ist der einzige, der scheitert, ohne es Ihnen zu sagen. Für eine Datei auf Ihrer Festplatte und ein Dokument, in das sie hinein soll, macht [die CSV-zu-Markdown-Tabellen-Konvertierung des oben genannten Browser-Konverters](/csv-to-markdown) den RFC-4180-Parse in Ihrem Browser, maskiert die Pipe-Zeichen, verwandelt Zeilenumbrüche in Zellen in `<br>` und lädt nichts hoch — kostenlos, ohne Installation. Für eine wiederkehrende Aufgabe setzen Sie Miller oder Pandoc in das Skript. Für eine Tabelle am Ende einer Analyse, die Sie ohnehin in Python laufen lassen, war `to_markdown` die ganze Zeit da. Was Sie auch nehmen: Behalten Sie eine Datei mit einem Komma in Anführungszeichen und einem eingebetteten Zeilenumbruch darin als Ihren Test, und lassen Sie sie durch alles Neue laufen, bevor Sie ihm echte Zeilen anvertrauen.

## FAQ

### Wie konvertiere ich eine CSV in eine Markdown-Tabelle, ohne die Datei hochzuladen?

Nehmen Sie einen Konverter, der im Browser läuft, oder einen, der auf Ihrer eigenen Maschine läuft. Ein Werkzeug auf der Browser-Seite liest die Datei mit der Datei-API der Seite selbst und sendet sie nie, was Sie überprüfen können, indem Sie den Netzwerk-Tab öffnen und zusehen, wie nichts passiert; ein Kommandozeilenwerkzeug wie Miller oder Pandoc berührt das Netz überhaupt nicht.

### Was passiert mit Kommas in Feldern in Anführungszeichen?

In einem Werkzeug mit einem echten CSV-Parser nichts — die Anführungszeichen werden gelesen, das Komma bleibt in der Zelle, und die Zeile behält ihre Spaltenanzahl. In einem Werkzeug, das an Kommas trennt, wird aus dem Feld zwei Zellen und die Zeile bekommt eine Spalte mehr, und weil Markdown Zellen jenseits der Anzahl im Kopf verwirft, verschwindet der Wert am Ende dieser Zeile ohne eine Warnung.

### Kann eine Zelle einer Markdown-Tabelle einen Zeilenumbruch enthalten?

Nein. Eine Markdown-Tabelle ist zeilenbasiert, eine Zeile pro Datensatz, ohne Fortsetzungssyntax, ein echter Zeilenumbruch in einer Zelle beendet also die Zeile. Konverter behandeln ein CSV-Feld mit einem Zeilenumbruch darin, indem sie ihn durch `<br>` ersetzen, was als Umbruch dargestellt wird, sobald aus dem Markdown HTML wird, oder indem sie ihn zu einem Leerzeichen plattmachen — und die Wahl liegt beim Konverter, prüfen Sie also, welche der Ihre getroffen hat.

### Was machen Konverter mit einer CSV, die keine Kopfzeile hat?

Die meisten befördern die erste Datenzeile zum Kopf, denn eine Markdown-Tabelle kann ohne einen nicht existieren. Manche Werkzeuge bieten ein Flag, das stattdessen Platzhalternamen erzeugt — das Python-`csv2md` dokumentiert `-H` für genau das. Die verlässliche Antwort ist, der Datei vor dem Konvertieren selbst eine Kopfzeile hinzuzufügen.

### Wie konvertiere ich eine TSV-Datei statt einer CSV?

Jedes Werkzeug mit einer Option für das Trennzeichen nimmt einen Tabulator; mehrere erkennen ihn an der Dateiendung. Pandoc hat einen eigenen `tsv`-Leser, Miller liest TSV von Haus aus, und ein Konverter, der das Trennzeichen aus der ersten Zeile erschnüffelt, verkraftet es, ohne es gesagt zu bekommen. Daten, die aus einer Tabellenkalkulation in die Zwischenablage kopiert wurden, sind schon tabulatorgetrennt, weshalb Einfügen oft besser funktioniert als Exportieren.

### Behält eine Markdown-Tabelle die Spaltenausrichtung aus der Tabellenkalkulation?

Nein, und sie hat kein Konzept von Ausrichtung über drei Möglichkeiten pro Spalte hinaus, gesetzt durch Doppelpunkte in der Trennzeile. Manche Werkzeuge geben diese Doppelpunkte aus — das `pipe`-Format von tabulate tut es, sein `github`-Format nicht — und manche lassen jede Spalte linksbündig, damit Sie sie bearbeiten. Ausrichtung auf Zellenebene, verbundene Zellen und Zahlenformatierung gibt es in Markdown überhaupt nicht.

### Ist Excel zu Markdown dieselbe Aufgabe wie CSV zu Markdown?

Beinahe. Speichern Sie das Blatt als CSV, und es ist dieselbe Aufgabe, mit denselben Regeln für Anführungszeichen. Kopieren Sie stattdessen einen Bereich in die Zwischenablage, und Sie erhalten tabulatorgetrennten Text, der sich sicherer trennen lässt, weil Tabulatoren selten innerhalb von Werten auftreten — aber Formeln sind schon zu Werten geworden und die Zellformatierung ist schon verworfen, wenn eines der beiden Formate erzeugt wird.
