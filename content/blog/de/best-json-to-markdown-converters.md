---
title: "Die besten JSON-zu-Markdown-Konverter 2026: verglichen und getestet"
description: "Die Wege, JSON in lesbares Markdown zu verwandeln — jq, jtbl, Miller, pandas und der Browser — nach den Formen, die jeder verkraftet, und den Entscheidungen dahinter"
date: 2026-09-08
tag: Konvertieren
keywords: json zu markdown konverter, json in markdown tabelle umwandeln, json zu markdown tabelle online, jq json zu markdown, json lines zu markdown, verschachteltes json zu markdown, json zu markdown python, json zu markdown cli
---

JSON hat keine Überschriften. Es hat auch keine Absätze, kein Fettes, keine Tabellen und keine Listen in dem Sinn, in dem Markdown das Wort meint. Es hat Objekte, Arrays, Zeichenketten, Zahlen, Wahrheitswerte und null, und das ist das ganze Vokabular. Markdown hat Überschriften, Absätze, Listen, Tabellen und Codeblöcke. Nichts in einer der beiden Spezifikationen sagt, welches aus der ersten Menge zu welchem aus der zweiten wird — jeder JSON-zu-Markdown-Konverter hat sich also eine Antwort ausgedacht, und die Antworten unterscheiden sich. Das ist der eigentliche Unterschied zwischen den Werkzeugen auf dieser Seite: nicht Geschwindigkeit, nicht Lizenz, sondern was jedes entschieden hat, wie Ihre Daten aussehen sollen.

### Kurzfassung

Wählen Sie nach der Form Ihrer Datei, nicht nach der Funktionsliste des Werkzeugs. Ein **Array flacher Objekte** — die Form, die die meisten API-Antworten und Exporte haben — ist die einzige Form, über die eine Markdown-Tabelle ehrlich ist, und fast alles hier tabelliert sie. **Verschachtelte Objekte** sind, wo die Werkzeuge auseinandergehen: manche flachen Schlüssel zu punktierten Spaltennamen ab, manche machen aus jeder Ebene eine Überschrift, bis ihnen die Überschriftenebenen ausgehen, manche geben auf und drucken JSON. **JSON Lines** — ein Datensatz pro Zeile, und das ist, was ein Log-Export meist ist — ist kein gültiges JSON, die Hälfte dieser Werkzeuge lehnt die Datei also von vornherein ab. Ein Konverter im Browser trifft die Formentscheidungen für Sie und sagt Ihnen, welche es sind; jq, Miller und jtbl lassen Sie sie selbst auf der Kommandozeile treffen; pandas ist die Antwort in einem Python-Skript.

## Warum „es konvertiert JSON" fast nichts aussagt

Markdown in HTML zu verwandeln ist eine Übersetzung zwischen zwei Dokumentformaten, die sich weitgehend darüber einig sind, was ein Dokument ist. JSON in Markdown zu verwandeln ist überhaupt keine Übersetzung. Es ist eine Deutung, und das Werkzeug rät die Absicht. `{"name": "Ada", "roles": ["admin", "billing"]}` könnte vernünftigerweise eine Überschrift namens Name mit einem Absatz darunter sein, ein fettes Label mit einem Wert, eine zweizeilige Tabelle, eine Punktliste oder eine Definitionsliste. Ein vernünftiger Mensch würde unterschiedlich wählen, je nachdem, ob dieses Objekt ein Datensatz unter Tausenden oder die ganze Datei ist.

Das Erste, was man über jedes Werkzeug hier feststellen muss, ist also, welche Formen es erkennt und was es mit jeder macht. Es gibt nur vier Fragen, die zählen. Was passiert mit einem Array von Objekten? Was passiert mit einem Array einfacher Werte? Was passiert mit Verschachtelung, und wie tief folgt das Werkzeug ihr, bevor es aufhört? Und was passiert mit einer Datei, die überhaupt nicht ein JSON-Wert ist?

Die Antworten stehen selten auf der Startseite des Werkzeugs, und sie sind das ganze Produkt. Ein Konverter, der jedes Objekt in eine zweispaltige Schlüssel-Wert-Tabelle verwandelt, stellt einen Export mit 900 Datensätzen als 900 winzige Tabellen dar. Ein Konverter, der nur das äußerste Array tabelliert, macht lautlos eine Zeichenkette aus einem verschachtelten Objekt, sodass eine Spalte Ihrer sonst lesbaren Tabelle `{"city":"Leeds","postcode":"LS1 1AA"}` in einer nicht festbreiten Proportionalschrift enthält. Beide Werkzeuge „konvertieren JSON zu Markdown". Keines der Ergebnisse ist, wonach Sie gefragt haben.

Das Zweite, was festzustellen ist, ist, wohin die Datei geht. JSON-Exporte enthalten überproportional häufig Dinge, die Sie nicht in das Textfeld eines Fremden einfügen würden: Nutzerdatensätze, Bestellverläufe, API-Antworten mit Tokens darin, ein Datenbankauszug, den jemand Ihnen zum Ansehen geschickt hat. Ein Konverter, der in Ihrem Browser oder auf Ihrem eigenen Rechner läuft, lässt diese Frage nicht aufkommen. Ein gehosteter tut es, und die ehrliche Fassung dieses Tauschgeschäfts ist, dass es ganz an der Datei hängt.

## Der schnelle Vergleich

| Werkzeug | Am besten für | Entscheidende Fähigkeit | Preis |
| --- | --- | --- | --- |
| TransformPipe | Eine JSON-Datei als Dokument lesen | Tabellen, Abschnitte und Listen nach Form gewählt, im Browser, kein Upload | Kostenlos |
| jq | Die Form selbst entscheiden | Filtert und formt JSON um; das Markdown bauen Sie | Kostenlos, MIT |
| jtbl | Eine Tabelle im Terminal, JSON Lines eingeschlossen | Liest stdin, `-m` druckt eine Markdown-Tabelle | Kostenlos, MIT |
| Miller (`mlr`) | Große Dateien und Formatwechsel | Liest JSON und JSON Lines, `--omd` schreibt Markdown | Kostenlos, BSD 2-Clause |
| json2md | Ein Dokument bauen, keines konvertieren | Ein Anweisungsformat, das Überschriften, Listen, Tabellen, Code ausgibt | Kostenlos, MIT |
| pandas + tabulate | In einem Python-Skript | `read_json`, `json_normalize`, `to_markdown` | Kostenlos, BSD 3-Clause |
| VS-Code-Erweiterungen | Die Datei ist schon offen | Lokale Konvertierung im Editor; Qualität schwankt je Erweiterung | Kostenlos |
| TableConvert | Eine eingefügte Tabelle in einem Browser-Tab | JSON-Array zu Markdown-Tabelle mit Live-Vorschau | Kostenlos (geprüft auf tableconvert.com, 8. September 2026) |
| Ein selbst geschriebenes Skript | Eine Form, die Ihnen gehört und stabil ist | Genau die Abbildung, die Sie wollen, und keine andere | Kostenlos |
| Ein Assistent | Ein Einzelfall, den Sie lesen werden | Versteht Absicht; verwirft auch leise Zeilen | Unterschiedlich |
| Pandoc | Nicht diese Aufgabe | Sein `json`-Leser ist Pandocs eigener AST, nicht Ihre Daten | Kostenlos, GPL |

## Die besten JSON-zu-Markdown-Konverter 2026

### TransformPipe — am besten, um eine JSON-Datei als Dokument zu lesen

Es wandelt eine `.json`-Datei in Ihrem Browser in Markdown und wählt eine Darstellung pro Form, statt eine Regel auf alles anzuwenden. Es gibt keine Installation und kein Konto ist nötig, und abgemeldet wird die Datei nirgendwohin gesendet: sie wird auf Ihrem eigenen Rechner gelesen, geparst und dargestellt.

| Vorteile | Nachteile |
| --- | --- |
| Die Formregeln sind festgelegt und benannt, die Ausgabe ist also vorhersagbar | Die Regeln sind die des Werkzeugs, nicht Ihre: keine Vorlagensprache |
| Liest JSON Lines genauso wie JSON, ohne gefragt zu werden | Ein Dokument auf einmal statt eines Verzeichnisses |
| Abgemeldet wird nichts hochgeladen | Der Browser macht die Arbeit, sehr große Dateien begrenzt also der Rechner |
| Wandelt außerdem Markdown zu HTML, und HTML, Word und CSV zurück nach Markdown | |

**Preis:** kostenlos. Ein Konto bringt Verlauf, Freigaben und eine API, ebenfalls kostenlos.

**Technische Details und Funktionen**

- Ein Array von Objekten, deren Werte alle Skalare sind, wird eine Tabelle, mit den Schlüsseln als Spalten — über jede Zeile hinweg in der Reihenfolge des ersten Auftretens gesammelt, sodass ein Feld, das erst im vierzigsten Datensatz erscheint, trotzdem eine Spalte bekommt
- Ein Array einfacher Werte wird eine Punktliste; ein Array ungleicher Dinge wird je ein nummerierter Abschnitt
- Ein Objekt setzt seine skalaren Schlüssel zuerst als fette Labels, dann gibt es jedem verschachtelten Schlüssel eine eigene Überschrift, sodass die flachen Fakten lesbar sind, bevor die tiefen beginnen
- Jenseits von drei Ebenen wird ein Wert als eingezäunter `json`-Block gedruckt statt als Überschrift, denn eine Überschrift auf Tiefe sieben ist keine Überschrift
- `null` wird als kursives `null` geschrieben statt übersprungen, und ein leeres Array sagt es, denn abwesend und leer sind Fakten über die Daten
- Schlüssel werden für die Anzeige umbenannt: `created_at` und `createdAt` kommen beide als „Created at" heraus
- Dieselbe Konvertierung gibt es über eine REST-API, ein CLI ohne Abhängigkeiten, eine GitHub Action und einen MCP-Server

**Wer sollte es verwenden?** Jeden, dessen nächster Schritt „das lesen" oder „das jemandem schicken" ist. Eine API-Antwort, ein Export aus einem Admin-Bereich, eine Log-Datei, die jemand an ein Ticket gehängt hat — die Fälle, in denen Sie die Daten in einer Minute lesbar haben wollen und kein Skript schreiben und über die Form gar nicht nachdenken wollen.

### jq — am besten, um die Form selbst zu entscheiden

jq ist ein JSON-Prozessor für die Kommandozeile in portablem C ohne Laufzeitabhängigkeiten. Er hat keine Markdown-Ausgabe und ist trotzdem das Werkzeug, bei dem die meisten Leute landen, denn der schwere Teil dieser Aufgabe ist nicht, Pipes zu drucken — sondern zuerst die richtigen Datensätze auszuwählen und sie zu Zeilen abzuflachen.

| Vorteile | Nachteile |
| --- | --- |
| Formt jedes JSON in jedes andere JSON um, und das ist das eigentliche Problem | Keine Markdown-Ausgabe: die Zeilen bauen Sie selbst |
| Überall installiert, keine Laufzeitumgebung, ein Programm | Eine eigene Sprache, und eine echte Lernkurve |
| Verbindet sich über eine Pipe mit jedem anderen Werkzeug | Ein langer Filter in einem Shell-Skript ist Nur-Schreib-Code |
| Verkraftet JSON Lines natürlich, einen Wert auf einmal | Kopfzeile und Trennzeile richtig zu bekommen ist Handarbeit |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Eine Filtersprache über JSON: Auswahl, Abbildung, Gruppierung, Sortierung und Arithmetik
- `@tsv` und `@csv` erzeugen getrennte Ausgabe, die Sie dann einem CSV-zu-Markdown-Schritt geben können, statt eine Tabelle von Hand zusammenzusetzen
- Zeichenketten-Interpolation erlaubt, Markdown direkt auszugeben — `"| \(.name) | \(.email) |"` pro Datensatz — wobei Kopf- und Trennzeile von Ihnen geschrieben werden
- `--slurp` sammelt einen Strom von Werten in ein Array, und so lässt man eine JSON-Lines-Datei wie eine JSON-Datei wirken
- `-r` druckt rohe Zeichenketten statt quotierten JSONs, und das ist das Flag, das Leute vergessen und sich dann wundern, warum jede Zelle Anführungszeichen hat

**Wer sollte es verwenden?** Jeden, der jq schon kennt, und jeden, dessen Datei gefiltert werden muss, bevor sie formatiert wird. Wenn die Antwort „nur die fehlgeschlagenen Anfragen, nach Tag gruppiert" enthält, brauchen Sie jq oder etwas Ähnliches, bevor irgendein Konverter relevant ist. Es passt an dieselbe Stelle einer Pipeline wie [ein Markdown-zu-HTML-Schritt auf der Kommandozeile](/blog/markdown-to-html-from-the-command-line): eine Stufe, die eine Sache mit Text macht.

### jtbl — am besten für eine Tabelle im Terminal, JSON Lines eingeschlossen

jtbl ist ein kleines Kommandozeilenwerkzeug in Python, das JSON von der Standardeingabe liest und als Tabelle druckt. Seine Standardausgabe ist eine Terminal-Tabelle, und `-m` macht diese Tabelle zu Markdown.

| Vorteile | Nachteile |
| --- | --- |
| Liest ein JSON-Array von Objekten oder JSON Lines, kein Flag nötig | Nur Tabellen: es hat keine andere Darstellung |
| `-m` für Markdown, `-c` für CSV, `-H` für HTML | Verschachtelte Werte müssen abgeflacht werden, bevor es sie sieht |
| Für Pipes gebaut, jq gehört also davor | Eine Python-Installation, also nicht immer auf einem Server verfügbar |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Die Eingabe ist geleitetes JSON auf stdin: entweder ein JSON-Array von Objekten oder JSON Lines
- Die Ausgabeformate werden per Flag gewählt: standardmäßig eine Texttabelle, dazu Markdown, CSV, HTML oder eine schickere gezeichnete Tabelle
- Gedacht, um am Ende einer `jq`-Pipeline zu sitzen, und genau dort ergibt die Arbeitsteilung Sinn — jq entscheidet die Zeilen, jtbl druckt sie

**Wer sollte es verwenden?** Leute, die im Terminal arbeiten und die Tabelle jetzt wollen. Es ist der kürzeste ehrliche Weg von einem JSON-Lines-Log zu einer Markdown-Tabelle, die Sie in ein Ticket einfügen können.

### Miller (`mlr`) — am besten für große Dateien und Formatwechsel

Miller ist ein Datenprozessor für die Kommandozeile in Go, ohne Laufzeitabhängigkeiten. Er liest CSV, TSV, JSON und JSON Lines, und er schreibt Markdown — was ihn zum seltenen Werkzeug macht, bei dem diese Konvertierung ein eingebautes Ausgabeformat ist statt etwas, das man zusammensetzt.

| Vorteile | Nachteile |
| --- | --- |
| Markdown ist ein erstklassiges Ausgabeformat (`--omd`) | Ein eigenes Vokabular aus Verben und Flags zu lernen |
| Liest JSON Lines direkt (`--ijsonl`), ohne Slurpen | Datensatzorientiert: tief verschachteltes JSON muss zuerst abgeflacht werden |
| Streamt, Dateigröße ist also kein Speicherproblem | Eine Installation, und ein Terminal |
| Ein Werkzeug für Filtern, Sortieren, Ausschneiden und Drucken | Nicht interaktiv: keine Vorschau, kein Rückgängig |

**Preis:** kostenlos, BSD-2-Clause-lizenziert.

**Technische Details und Funktionen**

- Zu den Eingabeformaten gehören JSON, JSON Lines, CSV, TSV und positionsindizierte Daten; `--ijson` und `--ijsonl` benennen, was Sie haben
- `--omd` schreibt Markdown-Ausgabe; `--omd-aligned` füllt die Spalten auf eine einheitliche Breite auf, damit die rohe Datei auch lesbar ist
- Seit Miller 6.11.0 wird Markdown auch als Eingabeformat unterstützt, nicht nur als Ausgabe (geprüft auf miller.readthedocs.io, 8. September 2026)
- Verben wie `cut`, `filter`, `sort` und `head` laufen vor dem Writer, Sie können einen großen Export also im selben Befehl auf die tabellenwürdigen Spalten verengen

**Wer sollte es verwenden?** Jeden mit einer Datei, die zu groß zum Öffnen ist, einem JSON-Lines-Export oder der Gewohnheit, ohnehin zwischen CSV und JSON zu wandeln. Wenn Sie für diese Aufgabe ein Kommandozeilenwerkzeug installieren, installieren Sie dieses.

### json2md — am besten, um ein Dokument zu bauen, nicht eines zu konvertieren

json2md ist eine JavaScript-Bibliothek, die eine bestimmte JSON-Struktur in Markdown verwandelt. Diese Unterscheidung zählt mehr als alles andere auf dieser Seite: es liest nicht Ihr JSON. Es liest eine JSON-Beschreibung eines Markdown-Dokuments, in seiner eigenen Form, und druckt dieses Dokument.

| Vorteile | Nachteile |
| --- | --- |
| Gibt echte Dokumentstruktur aus: Überschriften, Absätze, Listen, Tabellen, Code, Links | Ihre Daten müssen zuerst in seine Eingabeform gebracht werden |
| Eine kleine Abhängigkeit in einem Node-Projekt | Trotz des Namens kein Konverter für beliebiges JSON |
| Erweiterbar mit eigenen Konvertern für neue Blocktypen | Nur JavaScript |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Aus npm installiert und als Funktion in Node oder einem Bundle verwendet
- Seine dokumentierten Blocktypen decken `h1` bis `h6` ab, dazu Absätze, Blockzitate, Bilder, geordnete und ungeordnete Listen, Codeblöcke, Tabellen, Links und Trennlinien
- Die Eingabe ist ein Array von Objekten mit je einem Schlüssel — eine Überschrift, dann ein Absatz, dann eine Tabelle — die Abbildung von Ihren Daten auf ein Dokument ist also Code, den Sie schreiben, und die Bibliothek übernimmt Maskierung und Layout

**Wer sollte es verwenden?** Entwickler, die ein Markdown-Dokument aus Daten in einem Node-Dienst erzeugen: einen nächtlichen Bericht, ein Änderungsprotokoll, eine an ein Team gemailte Zusammenfassung. Es ist das falsche Werkzeug, um eine JSON-Datei anzusehen, die Ihnen geschickt wurde, und das richtige, um ein Dokument aus Datensätzen zu erzeugen, die Sie verstehen.

### pandas plus tabulate — am besten in einem Python-Skript

pandas liest JSON in einen DataFrame und schreibt Markdown aus einem heraus. `read_json` übernimmt das Parsen, `json_normalize` flacht Verschachtelung in Spalten ab, und `to_markdown` druckt die Tabelle.

| Vorteile | Nachteile |
| --- | --- |
| Abflachen, Filtern, Sortieren und Typisieren alles in einer Bibliothek | Eine schwere Abhängigkeit für eine Tabelle |
| `json_normalize` verkraftet Verschachtelung vorhersagbar | Abflachen vervielfacht Spalten schnell |
| In den meisten Datenarbeiten schon installiert | Nur Tabellen: ein DataFrame ist kein Dokument |

**Preis:** kostenlos. pandas ist BSD-3-Clause-lizenziert; `tabulate`, das `to_markdown` benötigt, ist MIT.

**Technische Details und Funktionen**

- `pandas.read_json` für ein JSON-Array von Datensätzen; `lines=True` für JSON Lines
- `pandas.json_normalize` flacht verschachtelte Schlüssel in punktierte Spaltennamen ab, ein Datensatz mit einem `address`-Objekt wird also zu Spalten `address.city` und `address.postcode`
- `DataFrame.to_markdown()` benötigt das Paket `tabulate` und gibt die Tabelle als Zeichenkette zurück
- Der Index ist standardmäßig enthalten, weshalb die erste Spalte Ihrer Tabelle ein unbenannter Lauf aus `0`, `1`, `2` ist, bis Sie `index=False` übergeben
- `tablefmt` wird an tabulate durchgereicht, wo `github` die Pipe-Tabelle im GFM-Stil ist und `pipe` Ausrichtungs-Doppelpunkte ergänzt

**Wer sollte es verwenden?** Jeden, der schon in einem Python-Skript oder einem Notebook ist. Wenn das JSON echte Analyse braucht, bevor es eine Tabelle wird, wollten Sie ohnehin hierhin — und dieselbe Überlegung, die [Python zu einem vernünftigen Ort für den Markdown-zu-HTML-Schritt macht](/blog/markdown-to-html-in-python), gilt auch hier.

### VS-Code-Erweiterungen — am besten, wenn die Datei schon offen ist

Im Marketplace gibt es Erweiterungen, die eine JSON-Auswahl in eine Markdown-Tabelle verwandeln, und wenn die Datei schon in Ihrem Editor liegt, ist das der kürzeste Weg, den es gibt. Es ist auch die Option, bei der Sie sich die Erweiterung ansehen müssen statt die Kategorie.

| Vorteile | Nachteile |
| --- | --- |
| Kein neues Werkzeug, kein Terminal, kein Upload | Qualität und Pflege schwanken enorm |
| Arbeitet auf einer Auswahl, Sie können also einen Teil einer Datei konvertieren | Die meisten verkraften ein flaches Array und nichts weiter |
| Die Konvertierung passiert lokal im Editor | Eine aufgegebene Erweiterung ist ein lautloses Risiko |

**Preis:** kostenlos.

**Technische Details und Funktionen**

- Erweiterungen laufen im Editor-Prozess, eine lokale Erweiterung konvertiert also lokal — aber prüfen Sie es, denn manche rufen einen gehosteten Dienst
- Die meisten Umsetzungen nehmen ein Array von Objekten und erzeugen eine Pipe-Tabelle; Verschachtelung, `null`-Behandlung und Pipe-Maskierung sind, wo sie sich unterscheiden
- Die eigene JSON-Unterstützung von VS Code — Formatieren, Falten, Schema-Prüfung — ist etwas anderes und erzeugt kein Markdown

**Wer sollte sie verwenden?** Entwickler, die im Vorbeigehen ein Fragment konvertieren. Prüfen Sie, was die Erweiterung mit einem verschachtelten Objekt und einem Wert mit einem Pipe-Zeichen macht, bevor Sie ihr etwas anvertrauen, das Sie weiterschicken.

### TableConvert — am besten für eine eingefügte Tabelle in einem Browser-Tab

TableConvert ist ein Online-Tabellenkonverter mit einer Seite für JSON zu Markdown: JSON-Array einfügen, Markdown-Tabelle bekommen, sie in einem Gitter bearbeiten, wenn Sie wollen.

| Vorteile | Nachteile |
| --- | --- |
| Einfügen und los, mit Live-Vorschau | Nur Tabellen, aus einem Array von Objekten |
| Die Seite gibt an, dass die Konvertierung lokal im Browser passiert | Verschachtelung und JSON Lines sind nicht ihre Aufgabe |
| Ein bearbeitbares Gitter zwischen Eingabe und Ausgabe | Eine von vielen ähnlichen Seiten, die sich darin unterscheiden, was sie mit Ihren Daten machen |

**Preis:** kostenlos, ohne Registrierung (geprüft auf tableconvert.com, 8. September 2026).

**Technische Details und Funktionen**

- Die Eingabe ist ein eingefügtes JSON-Array, eine hochgeladene Datei oder eine aus einer Seite extrahierte Tabelle
- Zu den Ausgabeformaten gehört Markdown neben den anderen Tabellenformaten, die die Seite verkraftet
- Das dazwischenliegende Gitter erlaubt, eine Spalte umzubenennen oder eine Zeile zu löschen, bevor Sie das Markdown nehmen

**Wer sollte es verwenden?** Jeden mit einem flachen Array in der Zwischenablage und einem tabellenförmigen Loch zu füllen. Für eine ganze Datei, oder eine Datei mit Struktur, erspart Ihnen ein Konverter, der andere Formen als „Array von Objekten" liest, das Umformen.

### Ein selbst geschriebenes Skript — am besten, wenn die Form Ihnen gehört und sich nicht ändern wird

Dreißig Zeilen in der Sprache, die Sie ohnehin verwenden, die Ihr JSON auf Ihr Markdown abbilden. Alle, die diese Konvertierung mehr als zweimal machen, landen hier, und für eine stabile interne Form ist es die richtige Antwort.

| Vorteile | Nachteile |
| --- | --- |
| Genau die Abbildung, die Sie wollen, und nichts weiter | Die Grenzfälle gehören jetzt Ihnen |
| Keine Abhängigkeit, in den meisten Sprachen | Neu geschrieben, wenn sich die Form ändert |
| Passt zu Ihrem Build, Ihrem CI, Ihrer Benennung | Niemand sonst im Team kennt die Regeln |

**Preis:** kostenlos, und kostet einen Nachmittag.

**Technische Details und Funktionen**

- Jede verbreitete Sprache parst JSON in ihrer Standardbibliothek, das Parsen ist also nicht die Arbeit
- Die Arbeit sind die vier Entscheidungen: Tabelle, Liste, Abschnitt oder eingezäunter Rückfall — plus Maskierung
- Maskieren Sie Pipes und Backslashes in Zellen und ersetzen Sie Zeilenumbrüche in einer Zelle durch `<br>`, denn eine Markdown-Tabellenzeile kann keinen Zeilenumbruch enthalten
- Entscheiden Sie, wie `null`, `""`, `0`, `false` und ein fehlender Schlüssel jeweils aussehen, und schreiben Sie es auf, denn ein Leser kann sie von einer leeren Zelle nicht unterscheiden

**Wer sollte das verwenden?** Teams mit einem wiederkehrenden Export und einer festen Meinung darüber, wie er sich lesen soll. Nicht die Person, die heute eine Datei hat.

### Ein Assistent — am besten für einen Einzelfall, den Sie lesen werden

JSON in einen Assistenten einzufügen und um eine Markdown-Tabelle zu bitten funktioniert, versteht Absicht besser als jede Regel und ist die am wenigsten vertrauenswürdige Option hier für alles, was Sie nicht prüfen werden.

| Vorteile | Nachteile |
| --- | --- |
| Erschließt, was die Daten bedeuten, nicht nur ihre Form | Zeilen verschwinden, und niemand sagt es Ihnen |
| Verkraftet unordentliche und uneinheitliche Datensätze mit Anstand | Werte werden aufgeräumt, umsortiert und umformatiert |
| Keine Installation, kein Code | Ihre Daten gehen an einen Dienst, es sei denn, das Modell ist lokal |

**Preis:** je Dienst und Plan unterschiedlich; sehen Sie auf der Seite des Anbieters nach.

**Technische Details und Funktionen**

- Am besten für Daten, die Sie überblicken können: wenn Sie die Zeilen in der Ausgabe nicht zählen können, können Sie sie nicht prüfen
- Ein deterministischer Konverter und ein Assistent widersprechen sich auf nützliche Weise — lassen Sie beide über dieselbe Datei laufen, und der Diff zeigt Ihnen, welche Zellen „hilfsbereit" verändert wurden
- Ein MCP-Server setzt eine deterministische Konvertierung in den Assistenten, und das ist die Fassung, die es wert ist: das Modell entscheidet, was zu konvertieren ist, der Konverter entscheidet, was die Ausgabe ist
- Die Ausgabe ist Markdown, und das muss noch etwas werden, das ein Mensch öffnen kann — [die Ausgabe eines Assistenten auf eine teilbare Seite zu bringen](/blog/ai-output-to-a-shareable-page) ist ein eigener Schritt

**Wer sollte das verwenden?** Jeden mit einem unbequemen Einzelfall und der Geduld, ihn zu prüfen. Niemand mit einem Bericht, der an einen Kunden geht.

### Pandoc — das Werkzeug, das das nicht tut

Pandoc wandelt zwischen rund vierzig Dokumentformaten, und dieses ist keines davon. Sein `json`-Eingabeformat ist „JSON-Fassung des nativen AST" — Pandocs eigener Dokumentbaum als JSON serialisiert, nicht Ihre Daten. Ihm eine API-Antwort zu geben erzeugt einen Fehler, kein Dokument.

**Wer sollte es verwenden?** Niemand, für diese Konvertierung. Pandoc ist die richtige Antwort für [Markdown zu HTML und die Formate darum](/blog/best-markdown-to-html-converters) und der falsche Ort, um nach JSON zu suchen.

## Was in den Vergleichstabellen fehlt

Jedes Werkzeug oben erzeugt Markdown aus JSON. Was darüber entscheidet, ob das Ergebnis lesbar ist, ist eine Menge von Entscheidungen, die keines davon bewirbt.

**Das Array flacher Objekte ist die einzige Form, über die eine Tabelle ehrlich ist.** Eine Tabelle hat eine Zeile pro Datensatz und eine Spalte pro Feld, sie braucht also Datensätze mit denselben Feldern und Werte, die einzelne Dinge sind. So sehen eine API-Antwort, ein nach JSON konvertiertes CSV und ein Datenbankexport meist aus, weshalb jedes Werkzeug hier das verkraftet und so viele dort aufhören. In dem Moment, in dem ein Wert selbst ein Objekt oder ein Array ist, muss die Tabelle lügen: entweder enthält die Zelle ein JSON-Fragment als Zeichenkette, oder die Spaltenzahl explodiert, oder die verschachtelten Daten fallen weg. Es gibt keine vierte Möglichkeit. Ein Werkzeug, das abflacht — pandas mit `json_normalize`, die meisten CLI-Werkzeuge mit einem ausdrücklichen Abflachungsschritt — wählt die Spaltenexplosion, und ein Datensatz mit drei verschachtelten Objekten kann zu einer dreißigspaltigen Tabelle werden, die niemand lesen kann. Ein Werkzeug, das sich weigert, einen Datensatz mit verschachtelten Werten zu tabellieren, wählt stattdessen Abschnitte, und das ist länger und lesbar.

**Arrays einfacher Werte sind Listen, und sie als Tabellen zu behandeln ist der klassische Fehler.** `["admin", "billing", "read-only"]` ist eine Punktliste. Als Tabelle dargestellt wird sie eine einspaltige Tabelle mit einer bedeutungslosen Kopfzeile, und das ist schlimmer als das rohe JSON. Als kommagetrennte Zeichenkette in der Zelle von jemand anderem dargestellt ist sie in Ordnung — bis zu dem Punkt, an dem einer der Werte ein Komma enthält.

**Verschachtelung muss irgendwo aufhören, Überschriften zu werden, und das Werkzeug wählt wo.** Markdown hat sechs Überschriftenebenen. JSON hat so viele, wie es mag. Ein Konverter, der Tiefe auf Überschriftenebene abbildet, geht bei sechs aus und klemmt danach entweder alles Tiefere auf `######`, was echte Struktur zu scheinbaren Geschwistern abflacht, oder erzeugt weiter tieferes Markup, das kein Renderer anders darstellt. Die Alternative ist, früher aufzuhören und den restlichen Teilbaum als eingezäunten Codeblock zu drucken, was die Niederlage ehrlich zugibt: die Struktur ist sichtbar, eingerückt und klar ein Datenauszug statt Prosa. Der Konverter im Browser oben hört aus genau diesem Grund bei drei Ebenen auf. Was auch immer Ihr Werkzeug tut, finden Sie es heraus, denn ein Dokument, dessen Überschriften bei Tiefe sechs auslaufen, hat ein Inhaltsverzeichnis, das nichts bedeutet.

**Null, leer, fehlend und false sind vier verschiedene Fakten und eine leere Zelle.** Ein Konverter, der `null` überspringt, erzeugt eine Zelle, die von einem fehlenden Schlüssel nicht zu unterscheiden ist, der von einer leeren Zeichenkette nicht zu unterscheiden ist. In einem Bestellexport sind „kein Rabatt angewendet" und „Rabattfeld in diesem Datensatz nicht vorhanden" verschiedene Dinge, und ein Leser, der zwei leere Zellen ansieht, kann nicht wiederherstellen, welche welche ist. Das ist der Fehlfall, der eine konvertierte Tabelle subtil falsch macht statt offensichtlich kaputt, und es ist es wert, ihn an einer Datei zu prüfen, die Sie kennen, bevor Sie einer vertrauen, die Sie nicht kennen.

**JSON Lines ist kein gültiges JSON, und es ist, was ein Log-Export meist ist.** Das Format JSON Lines ist ein JSON-Wert pro Zeile, UTF-8, mit Zeilenumbruch abgeschlossen. Jede Zeile parst; die Datei als Ganzes nicht, denn eine Folge von Werten ohne umschließendes Array ist kein JSON-Dokument. `JSON.parse` und `json.loads` scheitern also beide an einer völlig einwandfreien `.jsonl`-Datei, und jeder Konverter, der eines davon ohne Rückfall aufruft, lehnt die Datei mit einem Syntaxfehler ab, der auf Zeile 2 zeigt. Werkzeuge unterscheiden sich hier deutlich: Miller und jtbl lesen JSON Lines von Haus aus, pandas braucht `lines=True`, jq will `--slurp`, um daraus ein Array zu machen, und ein Konverter im Browser, der auf zeilenweises Parsen zurückfällt, liest die Datei, ohne gefragt zu werden. Wenn Ihre Daten aus einer Log-Pipeline, einer Nachrichtenwarteschlange oder `docker logs` kommen, ist das das Erste zum Testen und das, was Sie am ehesten aufhält.

**Pipes, Backslashes und Zeilenumbrüche in Werten brechen die Tabelle, die Sie gerade bekommen haben.** Ein Pipe-Zeichen beendet eine Zelle in einer Markdown-Tabelle, wo auch immer es auftaucht, ein Wert wie `error | retrying` teilt also eine Zelle in zwei und verschiebt den Rest der Zeile. Ein Zeilenumbruch in einem Wert lässt sich in einer Tabellenzeile überhaupt nicht ausdrücken — der einzige Weg hindurch ist `<br>`, und das ist HTML in Ihrem Markdown. Jeder Konverter, der Tabellen durch Zeichenkettenverkettung ohne Maskierung baut, erzeugt eine Tabelle, die genau für jene Zeilen falsch erscheint, die die interessanten Daten enthalten — ein besonderer Fall des allgemeinen Problems damit, dass [Tabellen eine Konvertierung überstehen](/blog/markdown-tables-that-survive-conversion).

**Die Schlüsselreihenfolge ist die einzige Reihenfolge, die Sie haben, und sie ist nicht bedeutsam.** JSON-Objekte haben in der Spezifikation keine definierte Schlüsselreihenfolge, auch wenn jede praktische Umsetzung die Reihenfolge in der Datei erhält. Konverter geben Spalten daher in der Reihenfolge aus, in der sie die Schlüssel zuerst sehen — die Spaltenreihenfolge Ihrer Tabelle ist also ein Zufall dessen, wer den Serialisierer geschrieben hat. Schlimmer noch: wenn spätere Datensätze ein Feld tragen, das dem ersten fehlt, verwirft ein Konverter, der nur das erste Objekt für seine Kopfzeile liest, diese Spalte lautlos für jede Zeile. Schlüssel über alle Datensätze hinweg zu sammeln ist das korrekte Verhalten und nicht das allgemeine.

**Zahlen, Datumsangaben und Bezeichner hören auf, sie selbst zu sein.** Markdown hat keine Typen. Eine lange Ganzzahl bleibt lesbar; eine Gleitkommazahl wie `0.30000000000000004` kommt genau so an, wie JSON sie gespeichert hat; ein ISO-Zeitstempel bleibt ein ISO-Zeitstempel, es sei denn, das Werkzeug beschließt, ihn zu verschönern. Eine führende Null in einem Produktcode überlebt, wenn sie eine Zeichenkette war, und ist weg, wenn sie eine Zahl war. Nichts davon ist die Schuld des Konverters, und alles davon landet in Ihrem Dokument — eine konvertierte Tabelle ist also eine Momentaufnahme zum Lesen, kein Datenaustauschformat. Wenn jemand darauf rechnen wird, schicken Sie ihm das JSON.

## Wie Sie wählen

1. **Sehen Sie sich Ihre Datei an, bevor Sie sich Werkzeuge ansehen.** Öffnen Sie sie und beantworten Sie eine Frage: ist das ein Array flacher Datensätze, oder ist es ein verschachteltes Dokument? Ist es das Erste, funktioniert hier fast alles und Sie sollten nach Bequemlichkeit wählen. Ist es das Zweite, erzeugen die meisten dieser Werkzeuge etwas Unlesbares, und Sie brauchen eines, das Abschnitte darstellt statt eines, das Tabellen darstellt.
2. **Testen Sie den JSON-Lines-Fall, wenn es irgendeine Möglichkeit dafür gibt.** Eine `.json`-Datei aus einer Anwendung ist meist ein Wert; eine `.json`- oder `.jsonl`-Datei aus einem Log, einer Warteschlange oder einem Massenexport ist meist ein Wert pro Zeile. Die falsche Annahme zu konvertieren gibt Ihnen im besten Fall einen Parse-Fehler und im schlechtesten nur den ersten Datensatz.
3. **Entscheiden Sie, ob die Ausgabe zum Lesen oder zum Verarbeiten ist.** Eine Markdown-Tabelle ist ein Dokument. Wenn der nächste Schritt eine Tabellenkalkulation oder ein Skript ist, konvertieren Sie stattdessen nach CSV und sparen Sie sich den Umweg — Typen verlieren Sie so oder so, und CSV gibt das wenigstens zu.
4. **Rechnen Sie die Installationen gegen die Zahl der Male, die Sie das tun werden.** Eine Datei heute rechtfertigt keinen Paketmanager. Ein nächtlicher Bericht rechtfertigt keinen Browser-Tab und keinen Menschen darin. Das falsch herum zu machen ist, wie ein Team zu einem undokumentierten Konvertierungsschritt kommt, der nur auf einem Laptop läuft.
5. **Prüfen Sie, was mit den unbequemen Zeilen passiert ist, nicht mit den ersten drei.** Finden Sie einen Datensatz mit einem null, einem verschachtelten Objekt, einem Wert mit einer Pipe und einem Feld, das die anderen Datensätze nicht haben. Konvertieren Sie ihn und lesen Sie die Ausgabe. Jeder auf dieser Seite beschriebene Fehlfall zeigt sich in diesem einen Test, und er kostet zwei Minuten.

## Fazit

Es gibt keine korrekte Art, JSON in Markdown zu verwandeln, was heißt, dass der beste JSON-zu-Markdown-Konverter der ist, dessen Entscheidungen zu der Datei vor Ihnen passen. Wenn die Form, die Sie haben, eine Liste von Datensätzen ist, ist [der Weg über die Tabelle der zu lesende](/blog/convert-json-to-markdown-table). Für ein Array flacher Datensätze wählen Sie nach Bequemlichkeit: ein Browser-Tab, eine Terminal-Pipe oder drei Zeilen pandas. Für ein verschachteltes Dokument, das Sie wirklich lesen müssen, wählen Sie ein Werkzeug, das Abschnitte und Listen darstellt statt alles in eine Tabelle zu zwingen, und prüfen Sie, wo es aufhört, Tiefe in Überschriften zu verwandeln. Das ist, was [die JSON-zu-Markdown-Konvertierung von TransformPipe](/json-to-markdown) im Browser tut, kostenlos, mit festgelegten Regeln und ohne Upload, solange Sie abgemeldet sind. Für alles Wiederkehrende werden Miller oder eine jq-Pipeline in einem Skript alles überleben, was Sie von Hand bauen.

## FAQ

### Was ist der beste kostenlose JSON-zu-Markdown-Konverter?

Für eine Datei, die Sie jetzt lesen wollen, ist ein Konverter im Browser die beste kostenlose Wahl: keine Installation, kein Upload, und er verkraftet andere Formen als ein flaches Array. Auf der Kommandozeile sind Miller und jtbl beide kostenlos und Open Source und schreiben beide Markdown-Tabellen direkt.

### Wie wandle ich JSON in eine Markdown-Tabelle um?

Ist Ihr JSON ein Array von Objekten mit skalaren Werten, macht es jedes Werkzeug hier: in einen Browser-Konverter einfügen, durch `jtbl -m` leiten, `mlr --ijson --omd cat` laufen lassen oder `to_markdown()` auf einem pandas-DataFrame aufrufen. Enthalten die Objekte verschachtelte Objekte oder Arrays, flachen Sie sie zuerst ab oder akzeptieren Sie, dass die Tabelle in manchen Zellen JSON als Zeichenkette enthält.

### Kann ich verschachteltes JSON in Markdown umwandeln?

Ja, aber nicht in eine Tabelle. Verschachteltes JSON wandelt sich sinnvoll in Überschriften und Abschnitte, wobei jede Verschachtelungsebene eine Überschriftenebene wird, bis dem Konverter die Ebenen ausgehen — sechs ist die Grenze, die Markdown ihm gibt, und die meisten Werkzeuge hören früher auf und drucken die restliche Tiefe als eingezäunten Codeblock. Prüfen Sie, wo Ihr Konverter diese Linie zieht, bevor Sie eine tief verschachtelte Datei konvertieren.

### Warum lässt sich meine JSON-Datei nicht konvertieren?

Meistens, weil sie JSON Lines ist statt JSON: ein gültiger JSON-Wert pro Zeile, was die Datei als Ganzes nicht ist. Ein Parser, dem diese Datei gegeben wird, scheitert an der zweiten Zeile. Sagen Sie Ihrem Werkzeug entweder, dass sie zeilengetrennt ist — `lines=True` in pandas, `--ijsonl` in Miller, `--slurp` in jq — oder nehmen Sie einen Konverter, der von selbst auf zeilenweises Parsen zurückfällt.

### Verliert die Umwandlung von JSON in Markdown Daten?

Sie verliert Typen, und sie kann Unterscheidungen verlieren. Markdown hat keinen Begriff von einer Zahl, einem Datum oder einem null, alles wird also Text — und ein Konverter, der `null` als leere Zelle darstellt, hat sie von einem fehlenden Feld oder einer leeren Zeichenkette nicht mehr unterscheidbar gemacht. Behandeln Sie das Markdown als etwas zum Lesen und behalten Sie das JSON als den Datensatz.

### Kann Pandoc JSON in Markdown umwandeln?

Nein, Ihr JSON nicht. Pandocs `json`-Eingabeformat ist sein eigener Dokument-AST als JSON serialisiert, es liest also nur Dateien, die Pandoc selbst erzeugt hat. Es ist das richtige Werkzeug, um zwischen Dokumentformaten zu wandeln, und das falsche für Daten.

### Sollte ich jq oder einen Konverter nehmen?

Meist beides. jq ist dafür, die Datensätze zu wählen und umzuformen — filtern, gruppieren, abflachen, Spalten auswählen — und ein Konverter ist dafür, sie zu drucken. Ein jq-Filter, der außerdem Markdown von Hand zusammensetzt, funktioniert und wird schnell unpflegbar; überlassen Sie die Pipes und die Maskierung also etwas, dessen Aufgabe das ist.
