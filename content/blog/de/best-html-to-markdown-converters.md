---
title: "Die besten HTML-zu-Markdown-Konverter 2026: verglichen und getestet"
description: "HTML-zu-Markdown-Konverter 2026 im Vergleich — Online-Werkzeuge, Bibliotheken, Extraktoren und Clipper — was sie behalten, verwerfen und wo der Artikel bleibt"
date: 2026-09-08
tag: Konvertieren
keywords: bester html zu markdown konverter, html zu markdown konverter online, html datei in markdown umwandeln, webseite als markdown, turndown alternative, html zu markdown kommandozeile, webseite als markdown speichern, html zu markdown ohne upload
---

HTML in Markdown umzuwandeln ist keine Übersetzung. Es ist ein Abriss mit einer Liste dessen, was zu behalten ist. HTML kann ein dreispaltiges Layout ausdrücken, eine Tabelle in einer Tabellenzelle, eine Farbe auf einem einzelnen Wort und eine Komponente, die erst existiert, wenn JavaScript gelaufen ist. Markdown kann Überschriften, Absätze, Betonung, Listen, Links, Bilder, Code und — wenn der Dialekt es erlaubt — eine flache Tabelle ausdrücken. Jeder Konverter auf dieser Seite entscheidet, was wegzuwerfen ist, und sie sind sich uneinig.

### Kurzfassung

Wählen Sie danach, was Ihr HTML ist. Für ein **sauberes Fragment oder eine handgeschriebene Seite** funktioniert fast jeder Konverter, und die Unterschiede sind kosmetisch. Für eine **ganze gespeicherte Seite** ist die Konvertierung die leichtere Hälfte — die schwerere ist, den Artikel zwischen Navigation, Cookie-Banner und Fußbereich zu finden, und das ist, was ein Extraktor wie Readability tut, bevor überhaupt ein Konverter läuft. Für **eine Datei, die Sie auf der Platte haben, und eine einzige Konvertierung** ist ein Werkzeug im Browser der kürzeste Weg, und es wird nichts hochgeladen; die kostenlosen sind unten behandelt. Für **einen Build oder ein Skript** nehmen Sie die Bibliothek Ihrer Sprache: Turndown in JavaScript, markdownify oder html2text in Python, Pandoc, wenn die Ausgabe mehr als Markdown sein muss.

## Warum „es konvertiert HTML" fast nichts aussagt

HTML zu Markdown hat zwei Stufen, und die meisten Werkzeuge geben nur eine zu. Die erste ist die Extraktion: zu entscheiden, welcher Teil des Dokuments das Dokument ist. Die zweite ist die Übersetzung: die behaltenen Elemente in Markdown-Syntax zu verwandeln. Eine Bibliothek, die die zweite perfekt macht und die erste auslässt, gibt Ihnen eine wunderbare Markdown-Fassung eines Navigationsmenüs, einer Newsletter-Anmeldung und einer Liste verwandter Artikel — mit dem Artikel irgendwo in der Mitte.

Diese Teilung erklärt die meiste Enttäuschung. Jemand speichert eine Seite aus einem Browser, legt die `.html`-Datei in einen Konverter und bekommt vierhundert Zeilen Linklisten vor dem ersten Absatz. Der Konverter hat seine Arbeit getan. Die andere hatte niemand getan. Extraktoren existieren dafür — Readability ist der bekannteste, und er ist die Maschinerie hinter der Leseansicht von Firefox — und die Browser-Erweiterungen, die Seiten nach Markdown clippen, sind Extraktor und Konverter aneinandergeschraubt, weshalb sie sich auf einer echten Webseite so viel besser anfühlen als eine nackte Bibliothek.

Dann ist da die Frage, was die Übersetzung übersteht, und hier unterscheiden sich Konverter wirklich. Tabellen sind das lauteste Beispiel: sie stehen nicht in der CommonMark-Spezifikation, ein Konverter muss GFM-Tabellen also absichtlich umsetzen — und die, die es nicht tun, flachen ein `<table>` zu einer Absatzfolge ab oder lassen das rohe HTML unangetastet durch. Aufgabenlisten, Durchgestrichenes, Definitionslisten, Fußnoten, `<figure>` und `<figcaption>`, `<sup>` und `<sub>` und Codeblöcke mit einer Sprache daran fallen alle in dieselbe Kategorie: von manchen umgesetzt, von anderen ignoriert und auf keiner Vergleichsseite erwähnt.

Zuletzt gibt es das, was mit allem passiert, für das Markdown keine Worte hat. Ein Konverter hat drei Möglichkeiten, und jede ist vertretbar. Er kann das Konstrukt verwerfen, was Information lautlos verliert. Er kann rohes HTML inline ausgeben, was die Information behält und das Markdown weniger portabel macht, denn das nächste Werkzeug in der Kette maskiert es möglicherweise. Oder er kann annähern — eine verschachtelte Tabelle wird eine flache, ein formatiertes `<span>` wird einfacher Text. Zu wissen, welche der drei Ihr Werkzeug wählt, ist nützlicher als jede Funktionsliste, denn es ist der Unterschied zwischen einer Datei, die man lesen kann, und einer, die man reparieren muss.

## Der schnelle Vergleich

| Werkzeug | Am besten für | Entscheidende Fähigkeit | Preis |
| --- | --- | --- | --- |
| TransformPipe | Eine Datei oder eine gespeicherte Seite, jetzt konvertiert | Konvertierung im Browser, entfernt Seitenmobiliar, behält Tabellen und Aufgabenlisten | Kostenlos |
| Turndown | JavaScript-Anwendungen und Browser-Erweiterungen | Der Standard-JS-Konverter; überschreibbare Regeln; GFM-Plugin für Tabellen | Kostenlos, MIT |
| Pandoc | HTML, das mehrere Formate werden muss | Liest HTML, schreibt ~40 Formate, behält oder verweigert rohes HTML auf Wunsch | Kostenlos, GPL |
| html2text | Python-Skripte, die lesbaren reinen Text wollen | CLI plus Bibliothek, Links als Referenzen, Links entfernen | Kostenlos, GPLv3 |
| markdownify | Python-Skripte, die treue Struktur wollen | Auf BeautifulSoup, Optionen pro Tag, Tabellenbehandlung | Kostenlos, MIT |
| node-html-markdown | Sehr viel HTML konvertieren | Bringt einen HTML-Parser mit, braucht also kein DOM | Kostenlos, MIT |
| html-to-md | Eine kleine Abhängigkeit in einem JS-Bundle | Klein, ohne Abhängigkeiten, verkraftet Tabellenelemente | Kostenlos, MIT |
| html-to-markdown (Go) | Ein CLI und eine Go-Bibliothek aus einem Projekt | Installierbares Programm, Tabellen-Plugin mit Ausrichtung und Verbindungen | Kostenlos, MIT |
| Mozilla Readability | Den Artikel in einer Seite finden | Extraktion, keine Konvertierung — gibt bereinigtes HTML aus | Kostenlos, Apache 2.0 |
| Postlight Parser | Extraktion mit eingebauter Markdown-Ausgabe | `contentType` als html, markdown oder text | Kostenlos, Apache 2.0 / MIT |
| MarkDownload | Die Seite clippen, die Sie ansehen | Readability, dann Turndown, aus der Browser-Leiste | Kostenlos, Apache 2.0 |
| Obsidian Web Clipper | Direkt in einen Vault clippen | Extraktion und Konvertierung über defuddle, Vorlagen, Bereinigung | Kostenlos, MIT |
| Notion Web Clipper | Seiten nach Notion speichern | Speichert in Notion-Blöcke; Markdown nur über einen späteren Export | Kostenloser Plan verfügbar |
| „Seite speichern unter" im Browser | Überhaupt an das HTML kommen | Kein Konverter — die Quelle der meisten schlechten Eingaben | Kostenlos |

## Die besten HTML-zu-Markdown-Konverter 2026

### TransformPipe — am besten für eine Datei oder eine gespeicherte Seite, die Sie jetzt konvertiert haben wollen

TransformPipe nimmt eine `.html`-, `.htm`- oder `.xhtml`-Datei und gibt in Ihrem Browser Markdown zurück. Es gibt keine Installation und kein Konto ist nötig, und abgemeldet wird die Datei nirgendwohin gesendet: sie wird auf Ihrem eigenen Rechner gelesen, konvertiert und dargestellt.

| Vorteile | Nachteile |
| --- | --- |
| Abgemeldet wird nichts hochgeladen | Ein Dokument auf einmal, kein Crawler |
| Entfernt das Seitenmobiliar vor der Konvertierung, nicht danach | Kein Extraktor: es schneidet nach Element, nicht durch Lesen der Seite |
| Tabellen, Durchgestrichenes, Codeblöcke und Aufgabenlisten überleben | Der Browser macht die Arbeit, sehr große Dateien begrenzt also der Rechner |
| Dieselbe Konvertierung läuft in API, CLI, GitHub Action und MCP-Server | Keine Konfiguration pro Tag |

**Preis:** kostenlos. Ein Konto bringt Verlauf, Freigaben und eine API, ebenfalls kostenlos.

**Technische Details und Funktionen**

- Baut auf node-html-markdown, das mit node-html-parser statt mit einem DOM parst — die identische Konvertierung läuft also in einem Browser-Tab, in einem CI-Job und hinter der API, statt einer Umsetzung für jeden Ort
- `<script>`, `<style>`, `<noscript>`, `<template>`, `<svg>`, `<iframe>`, `<head>`, `<nav>` und `<footer>` werden vor der Übersetzung entfernt, samt HTML-Kommentaren
- Tabellen und Durchgestrichenes verkraftet der Parser; Checkbox-Eingaben in Listenelementen werden zurück in `- [x]` und `- [ ]` übersetzt, eine Aufgabenliste kommt also als Aufgabenliste an
- Läufe von Leerzeilen werden zusammengefasst, wovon eine konvertierte Seite sonst voll ist
- Wandelt außerdem Word, CSV, TSV und JSON nach Markdown, und Markdown zurück in eine eigenständige HTML-Datei

**Wer sollte es verwenden?** Jeder mit einer Datei und einem Grund, sie nicht einem Server zu übergeben — ein gespeicherter Export, eine Seite aus einem internen Wiki, das Dokument eines Kunden. Wenn Sie danach die Rückreise wollen, ist [die Markdown-zu-HTML-Seite ein völlig anderer Vergleich](/blog/best-markdown-to-html-converters), mit anderen Fehlfällen.

### Turndown — die beste JavaScript-Bibliothek, und die, an der alles andere gemessen wird

Turndown ist ein HTML-zu-Markdown-Konverter in JavaScript und mit großem Abstand die Standardwahl in der JS-Welt. Er läuft im Browser und in Node, und sein Regelsystem ist der Grund, warum er in so vielen anderen Werkzeugen auftaucht: Sie können den Handler für jedes Element ersetzen, ohne irgendetwas zu forken.

| Vorteile | Nachteile |
| --- | --- |
| Regeln sind pro Element ersetzbar, was sonderbares HTML handhabbar macht | Tabellen brauchen das GFM-Plugin; der Kern kann sie nicht |
| Läuft im Browser und in Node | Arbeitet über ein DOM statt über einen eigenen Parser |
| Weit verbreitet, sein Verhalten ist also durch die Fehlerberichte anderer gut dokumentiert | Keine Extraktion: er konvertiert, was Sie ihm geben, Mobiliar inklusive |
| `keep`, `remove` und die Option `blankReplacement` geben Ihnen drei Wege für Unerwünschtes | Konfiguration ist Code, keine Flags |

**Preis:** kostenlos, MIT-lizenziert (geprüft auf github.com, 8. September 2026).

**Technische Details und Funktionen**

- `addRule` registriert einen Handler gegen einen Tag-Namen, eine Liste von Tag-Namen oder eine Filterfunktion; `keep` lässt ein Element als rohes HTML stehen; `remove` löscht es samt Inhalt
- Optionen für Überschriftenstil (ATX oder Setext), Listenzeichen, Zaunzeichen für Code, Betonungs- und Fett-Trenner und Linkstil — Referenz-Links eingeschlossen
- `turndown-plugin-gfm` ergänzt Tabellen, Durchgestrichenes und weitere GitHub-Flavored-Markdown-Konstrukte
- Weil er DOM-basiert ist, ist das Dokument, das Sie ihm geben, das Dokument, das ein Browser bauen würde — fehlerhaftes HTML wird vom Parser repariert, bevor Turndown es sieht

**Wer sollte es verwenden?** JavaScript-Entwickler, und jeden, der eine Browser-Erweiterung oder einen Einfüge-Handler für einen Editor schreibt. Seine Allgegenwart ist eine Funktion: wenn eine Seite schlecht konvertiert, hat meist schon jemand die Regel geschrieben.

### Pandoc — am besten, wenn das HTML mehr als Markdown werden muss

Pandoc ist ein Dokumentkonverter für die Kommandozeile in Haskell, der rund vierzig Formate liest und schreibt. HTML hinein und Markdown hinaus ist eine seiner kleineren Aufgaben, und der Grund, es zu verwenden, ist meist, dass Markdown nicht die letzte Station ist.

| Vorteile | Nachteile |
| --- | --- |
| Ein Werkzeug für HTML zu Markdown und von Markdown zu fast allem | Braucht eine Installation und ein Terminal |
| Sein Markdown-Writer kann rohes HTML ausgeben oder verweigern, auf Wunsch | Sein erweiterter Markdown-Dialekt ist nicht GFM, wenn Sie nicht GFM verlangen |
| Lua-Filter erlauben, das Dokument mitten in der Konvertierung umzuschreiben | Keine Extraktion: eine ganze Seite konvertiert als ganze Seite |
| Verkraftet sehr große Dokumente ohne Browser im Weg | Die Menge der Optionen ist eine eigene Lernkurve |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- `pandoc -f html -t gfm` wählt GitHub Flavored Markdown als Ausgabe, und das wollen Sie, wenn Tabellen und Aufgabenlisten zählen
- Alles, was Markdown nicht ausdrücken kann, fällt in der Ausgabe auf rohes HTML zurück; die `raw_html`-Erweiterung am Writer abzuschalten ist der Weg, das zu verweigern und stattdessen den Verlust zu nehmen
- `--wrap=none` hält es davon ab, Absätze hart umzubrechen, was Diffs in einem Repository sonst unlesbar macht
- Lua-Filter und Vorlagen arbeiten auf seinem internen Dokumentmodell, Sie können also ganze Elementklassen verwerfen oder umschreiben, bevor das Markdown geschrieben wird

**Wer sollte es verwenden?** Jeden, der planmäßig konvertiert, viele Dateien konvertiert oder HTML in etwas konvertiert, das überhaupt kein Markdown ist. Es ist auch die richtige Antwort, wenn das Markdown in ein Repository eingecheckt wird und diff-fähig bleiben soll.

### html2text — am besten für Python, wenn es lesbar sein soll

html2text ist ein Python-Skript und eine Bibliothek, die HTML in lesbaren, einfachen, ASCII-nahen Text verwandelt, der zufällig auch gültiges Markdown ist. Die Betonung liegt auf lesbar: es wurde geschrieben, damit Webseiten als Text angenehm zu lesen sind, und seine Voreinstellungen spiegeln das.

| Vorteile | Nachteile |
| --- | --- |
| Ein Kommandozeilenwerkzeug und eine Bibliothek aus einer Installation | GPLv3, was manche Projekte nicht nehmen können |
| Optionen für Referenz-Links, Links ignorieren, Bilder ignorieren | Die Ausgabe ist aufs Lesen abgestimmt, nicht auf Hin- und Rückwege |
| Lange etabliert und stabil | Tabellenbehandlung ist schwächer als bei den strukturorientierten Bibliotheken |
| Vernünftiger Zeilenumbruch für Textausgabe | Passt nicht zu HTML mit starker Verschachtelung |

**Preis:** kostenlos, GPLv3-lizenziert (geprüft auf github.com, 8. September 2026).

**Technische Details und Funktionen**

- Läuft als `html2text [filename [encoding]]` oder als Bibliothek aus Python
- `--ignore-links` und `--ignore-images` entfernen die Teile, die Textausgabe laut machen; `--reference-links` verschiebt URLs nach unten statt inline
- `--escape-all` maskiert Sonderzeichen aggressiv, was zählt, wenn der Quelltext Markdown-Zeichensetzung enthält
- `--mark-code` markiert Codeblöcke mit `[code]` und `[/code]`; `--backquote-code-style` ist die Option, die Dreifach-Backtick-Zäune ausgibt

**Wer sollte es verwenden?** Python-Skripte, die Text für Menschen oder für einen Suchindex erzeugen — E-Mail-Rümpfe, Zusammenfassungen, Benachrichtigungstexte. Wenn Sie eine treue strukturelle Kopie des HTML brauchen, passt der nächste Eintrag besser.

### markdownify — die beste Python-Bibliothek, um die Struktur zu behalten

markdownify wandelt HTML in Markdown und verwendet BeautifulSoup als Parser, mit Optionen pro Tag. Wo html2text auf lesbaren Text optimiert, optimiert markdownify auf eine treue Abbildung der Elemente, die es erkennt.

| Vorteile | Nachteile |
| --- | --- |
| MIT-lizenziert, was leichter zu übernehmen ist als GPLv3 | Zieht BeautifulSoup mit, ist also nicht abhängigkeitsfrei |
| Optionen pro Tag, auch für Tabellen ohne Kopfzeile | Langsamer als die kompilierten und Parser-eigenen Optionen |
| Bestimmte Tags nach Namen konvertieren oder entfernen | Keine Extraktionsstufe |
| Vertraut für alle, die BeautifulSoup schon verwenden | Weniger Kommandozeilen-Bequemlichkeiten als html2text |

**Preis:** kostenlos, MIT-lizenziert (geprüft auf github.com, 8. September 2026).

**Technische Details und Funktionen**

- Baut auf BeautifulSoup, und seine Parser-Optionen werden durchgereicht, Sie wählen also den zugrunde liegenden HTML-Parser
- Die Listen `strip` und `convert` benennen die zu entfernenden Tags oder die einzigen zu behaltenden
- `table_infer_header` entscheidet, was mit einer Tabelle ohne Kopfzeile passiert, und das ist das häufigste Tabellenproblem in echtem HTML
- Überschriftenstil, Listenzeichen und Behandlung der Code-Sprache sind alle konfigurierbar

**Wer sollte es verwenden?** Python-Code, der Dokumentstruktur erhalten muss — ein altes CMS importieren, einen Dokumentationsexport konvertieren, Markdown an ein Modell speisen, das eine Textwand verwirren würde.

### node-html-markdown — am besten, um viel HTML zu konvertieren

node-html-markdown ist ein HTML-zu-Markdown-Konverter in TypeScript, dessen erklärter Zweck Durchsatz ist. Er parst mit node-html-parser statt sich auf ein DOM zu stützen, was sowohl der Grund für seine Geschwindigkeit ist als auch dafür, dass er an Orten läuft, an denen eine DOM-basierte Bibliothek es nicht kann.

| Vorteile | Nachteile |
| --- | --- |
| Kein DOM nötig, er läuft also überall, wo JavaScript läuft | Eine kleinere Gemeinschaft als die von Turndown |
| Von Grund auf für Menge gebaut | Eigene Übersetzer sind seine eigene API, nicht die von Turndown |
| Verkraftet Tabellen und Durchgestrichenes ohne Plugin | Manche Elementbehandlung ist eigenwillig und muss überschrieben werden |
| Eigene Übersetzer pro Element | Keine Extraktion |

**Preis:** kostenlos, MIT-lizenziert (geprüft auf github.com, 8. September 2026).

**Technische Details und Funktionen**

- Den Parser als Abhängigkeit mitzutragen heißt derselbe Codeweg in einem Browser, in Node, in einem Worker und in einer Serverless-Funktion — kein DOM-Ersatz zu installieren
- Übersetzer werden pro Elementnamen registriert und können einen Knoten ersetzen, ignorieren oder das Absteigen in ihn verweigern
- Optionen für Listenzeichen, Code-Zaun, Betonungs- und Fett-Trenner und dafür, ob Data-URI-Bilder behalten werden
- Die README des Projekts sagt, es sei geschrieben worden, um sehr große Mengen HTML zu konvertieren; behandeln Sie veröffentlichte Durchsatzzahlen als Behauptung des Projekts, nicht als unabhängige Messung

**Wer sollte es verwenden?** Jeden, der HTML in Menge oder in einer Umgebung ohne DOM konvertiert. Es ist aus genau diesem Grund auch die Maschine unter dem Konverter dieser Seite: eine Konvertierung, die sich in einem Browser-Tab und auf einem Server gleich verhält.

### html-to-md — die beste kleine Abhängigkeit

html-to-md ist ein kleiner JavaScript-Konverter ohne Abhängigkeiten, in Node und über einen Bundler im Browser verwendbar. Es ist die Option, nach der man greift, wenn der Konverter ein Detail in einem größeren Bundle ist statt der Sinn des Projekts.

| Vorteile | Nachteile |
| --- | --- |
| Klein und ohne Abhängigkeiten | Weniger Erweiterungspunkte als Turndown |
| Dokumentierte Liste unterstützter Tags, Tabellen inklusive | Kleineres Ökosystem, also weniger ausgearbeitete Beispiele |
| Funktioniert in Node und im Browser | Nicht auf ungewöhnliches oder schlecht verschachteltes HTML ausgelegt |

**Preis:** kostenlos, MIT-lizenziert (geprüft auf github.com, 8. September 2026).

**Technische Details und Funktionen**

- Die unterstützten Tags sind ausdrücklich dokumentiert und umfassen `table`, `thead`, `tbody`, `tr`, `th` und `td`
- Keine Abhängigkeiten, es fügt also ein Modul hinzu statt eines Baums
- `skipTags`, `emptyTags` und `ignoreTags` entscheiden, was wegfällt und ob der Inhalt mitgeht; `aliasTags` bildet ein ungewöhnliches Tag auf einen vorhandenen Handler ab; `tagListener` übergibt Ihnen ein einzelnes Tag zur eigenen Behandlung

**Wer sollte es verwenden?** Frontend-Projekte, in denen die Bundle-Größe eine echte Einschränkung ist und das zu konvertierende HTML sich einigermaßen benimmt.

### html-to-markdown (Go) — am besten, wenn Sie ein Programm und eine Bibliothek wollen

html-to-markdown von JohannesKaufmann ist eine Go-Bibliothek mit einem daraus gebauten Kommandozeilenwerkzeug. Diese Kombination ist der Reiz: dieselbe Konvertierung in einer Shell-Pipeline und in einem Go-Dienst.

| Vorteile | Nachteile |
| --- | --- |
| Ein echtes CLI, als Programm installierbar, ohne Laufzeitumgebung zu verwalten | Nur Go, für die Bibliotheksnutzung |
| Das Tabellen-Plugin setzt GFM-Tabellen um, samt Ausrichtung und Verbindungen | Kleinerer Plugin-Satz als bei den JS-Bibliotheken |
| Liest aus einer Datei oder von der Standardeingabe | Weniger darüber geschrieben als über Turndown, also weniger Beispiele |
| Schnell, und kein Node oder Python auf dem Rechner nötig | Keine Extraktion |

**Preis:** kostenlos, MIT-lizenziert (geprüft auf github.com, 8. September 2026).

**Technische Details und Funktionen**

- `html2markdown --input file.html --output file.md`, oder HTML per Standardeingabe hineingeleitet
- Verteilt als Homebrew-Formel, Debian-Paket, vorkompilierte Programme und über `go install`
- Ein Tabellen-Plugin, das GitHub-Flavored-Markdown-Tabellen mit Ausrichtung sowie `rowspan`- und `colspan`-Behandlung umsetzt
- Regeln lassen sich in Go für Elemente ergänzen, die die Voreinstellungen falsch behandeln

**Wer sollte es verwenden?** Go-Dienste, und jeden, der HTML zu Markdown in einem Shell-Skript auf einem Rechner will, auf dem Node oder Python zu installieren eine Zumutung ist.

### Mozilla Readability und Postlight Parser — am besten, um den Artikel zu finden

Diese zwei sind keine Konverter, und das ist der Grund, sie zu kennen. Readability nimmt eine Seite und gibt den Artikel zurück: Titel, Verfasserzeile und den Inhalt als bereinigtes HTML, ohne Navigation, Seitenleisten und Standardtext. Postlight Parser macht dieselbe Arbeit und gibt das Ergebnis direkt als Markdown zurück.

| Vorteile | Nachteile |
| --- | --- |
| Lösen das Problem, das die Konverter nicht anfassen | Readability gibt HTML aus, Sie brauchen also danach noch einen Konverter |
| Readability ist die Maschinerie hinter Firefox' Leseansicht, also stark erprobt | Beide brauchen ein DOM, was JSDOM oder einen Browser in Node bedeutet |
| Postlight Parser kann html, markdown oder text zurückgeben | Extraktion ist heuristisch: manchmal nimmt sie zu viel oder zu wenig |
| Beide sind freizügig lizenziert | Keines ist ein Dokumentkonverter im allgemeinen Sinn |

**Preis:** kostenlos. Readability ist Apache 2.0; Postlight Parser ist doppelt lizenziert unter Apache 2.0 und MIT (geprüft auf github.com, 8. September 2026).

**Technische Details und Funktionen**

- Readabilitys `parse()` gibt ein Objekt mit dem Artikelinhalt als HTML-Zeichenkette zurück, plus `textContent` ohne die Tags
- Readability braucht ein DOM-Dokument, in Node wird es also mit JSDOM kombiniert; in einer Browser-Erweiterung ist das lebende Dokument schon da
- Postlight Parser nimmt eine `contentType`-Option von `html`, `markdown` oder `text` und extrahiert außerdem Metadaten wie Autor und Datum
- Beide arbeiten auf einer einzelnen Seite: keines crawlt, und keines weiß etwas über das besondere Markup Ihrer Seite, wenn Sie es nicht erweitern

**Wer sollte es verwenden?** Jeden, der Webseiten konvertiert statt HTML-Dateien. Extraktion zuerst, Konvertierung danach, ist die Pipeline, die jeder gute Clipper verwendet, und sie selbst zu bauen kostet einen Nachmittag.

### MarkDownload — die beste Browser-Erweiterung für die Seite vor Ihnen

MarkDownload ist eine Browser-Erweiterung, die die aktuelle Seite als Markdown clippt. Ihre Umsetzung ist die empfohlene Pipeline in einem Paket: Readability vereinfacht die Seite, dann konvertiert Turndown, was bleibt.

| Vorteile | Nachteile |
| --- | --- |
| Extraktion und Konvertierung in einem Klick | Konvertiert nur, was im Browser ist, eine Seite auf einmal |
| Für Firefox, Chrome, Edge und Safari verfügbar | Hängt davon ab, dass der Extraktor richtig rät |
| Frontmatter und Vorlagen für die gespeicherte Datei | Die Berechtigungen der Erweiterung sind notwendigerweise weit |
| Open Source, die Konvertierungsregeln sind also einsehbar | Keine skriptbare Pipeline |

**Preis:** kostenlos, Apache-2.0-lizenziert (geprüft auf github.com, 8. September 2026).

**Technische Details und Funktionen**

- Verwendet Readability.js, um die Seite zu vereinfachen, und Turndown, um das vereinfachte HTML zu konvertieren
- Optionen für Bildbehandlung, Frontmatter-Vorlagen und das Dateinamenmuster
- Funktioniert aus der Leiste oder über ein Kontextmenü auf einer Auswahl, Sie können also einen Teil einer Seite clippen
- Weil sie läuft, nachdem der Browser die Seite dargestellt hat, ist von JavaScript hinzugefügter Inhalt enthalten — was einer gespeicherten `.html`-Datei häufig fehlt

**Wer sollte es verwenden?** Jeden, der im Web liest und Notizen in Dateien führt. Die dargestellte Seite zu clippen ist außerdem die einzige praktikable Art, eine Seite zu erfassen, deren Inhalt erst existiert, nachdem Skripte gelaufen sind.

### Obsidian Web Clipper — am besten, wenn das Markdown in einen Vault geht

Obsidians eigener Clipper speichert Webseiten als Markdown-Notizen, mit Vorlagen, die den Dateinamen, die Eigenschaften und den behaltenen Teil der Seite bestimmen. Er verwendet defuddle für Extraktion und Konvertierung statt der Paarung Readability plus Turndown, und er bereinigt das HTML auf dem Weg.

| Vorteile | Nachteile |
| --- | --- |
| Vorlagen pro Seite, ein Rezept und ein Aufsatz lassen sich also verschieden clippen | Auf Obsidian ausgerichtet; weniger nützlich, wenn Ihre Notizen woanders leben |
| Extraktion, Konvertierung und Bereinigung in einer Erweiterung | Das Extraktionsverhalten weicht von Readabilitys ab, zum Guten und zum Schlechten |
| Chrome, Firefox, Safari und Edge, plus Chromium-basierte Browser | Vorlagen sind eine kleine eigene Sprache zum Lernen |
| Eigenschaften als Frontmatter erfasst, nicht verloren | Eine Seite auf einmal |

**Preis:** kostenlos, MIT-lizenziert, wobei Marken und Marketing-Material von der Lizenz ausgenommen sind. Obsidian selbst ist kostenlos nutzbar ohne Anmeldung; eine kommerzielle Lizenz kostet 50 $ pro Nutzer und Jahr (geprüft auf obsidian.md, 8. September 2026).

**Technische Details und Funktionen**

- Verwendet defuddle für Inhaltsextraktion und Markdown-Konvertierung und DOMPurify zum Bereinigen
- Vorlagen können Titel, Ordner, Eigenschaften und Inhalt der Notiz setzen, mit Regeln pro Seite
- Hervorhebungen und Auswahlen lassen sich clippen statt der ganzen Seite
- Die Ausgabe ist eine einfache `.md`-Datei in einem Vault-Ordner, und der ist ein Verzeichnis mit Dateien wie jedes andere

**Wer sollte es verwenden?** Obsidian-Nutzer, offensichtlich — aber auch jeden, der einen Clipper will, der einfache Dateien in einen Ordner schreibt. Wenn Ihre Notizen woanders liegen und Sie versuchen, sie herauszuholen statt hinein, ist [die Exportseite von Notion, Obsidian und Confluence ein eigenes Problem](/blog/markdown-from-notion-obsidian-and-confluence).

### Notion Web Clipper — der, der Ihnen kein Markdown gibt

Notions Clipper speichert eine Webseite in eine Notion-Seite. Das ist es wert, aufgeführt zu werden, genau weil Leute danach greifen und Markdown erwarten und Notion-Blöcke bekommen, und das ist etwas anderes, das in der Datenbank von jemand anderem lebt.

| Vorteile | Nachteile |
| --- | --- |
| Passt gut, wenn Notion ohnehin der Ort Ihrer Notizen ist | Das Ergebnis sind Notion-Blöcke, keine Markdown-Datei |
| Sofort in Notion durchsuchbar und teilbar | An Markdown zu kommen heißt ein zweiter Schritt: Notions eigener Export |
| Keine Dateien zu verwalten | Das exportierte Markdown ist Notions Deutung, nicht die der Seite |
| Kostenloser Plan verfügbar | Sie haben nun zwei Konvertierungen zwischen der Seite und Ihrer Datei |

**Preis:** Notion hat einen kostenlosen Plan für 0 $ pro Mitglied und Monat (geprüft auf notion.com, 8. September 2026); der Clipper kommt mit dem Konto.

**Wer sollte es verwenden?** Notion-Nutzer, die Lesematerial erfassen. Wenn das Ziel eine Markdown-Datei ist, clippen Sie mit etwas, das eine erzeugt, oder konvertieren Sie das gespeicherte HTML direkt — der Weg über Notion bedeutet zwei Konvertierungen und zwei Gelegenheiten, die Tabellen zu verlieren.

### „Seite speichern unter" im Browser — die Quelle der meisten schlechten Eingaben

Eine Seite aus einem Browser zu speichern ist die Art, wie die meisten HTML-Dateien entstehen, die konvertiert werden müssen, und es ist es wert zu verstehen, was Sie bekommen. „Webseite, vollständig" gibt Ihnen das Markup plus einen Ordner mit Assets. „Webseite, nur HTML" gibt Ihnen das Markup, wie es ausgeliefert wurde, und das kann bei einer modernen Seite ein fast leeres Dokument plus ein Skript bedeuten, das die Seite gebaut hätte. Keines von beiden ist der Artikel.

| Vorteile | Nachteile |
| --- | --- |
| Immer verfügbar, keine Installation, keine Erweiterung | Speichert die ganze Seite, Mobiliar und alles |
| Erfasst die Seite, wie sie war, samt Zeitstempel | „Nur HTML" kann von JavaScript hinzugefügten Inhalt verpassen |
| Funktioniert für Seiten hinter einem Login, in dem Sie schon sind | Asset-Ordner lassen relative Links auf Ihre Platte zeigen |

**Preis:** kostenlos.

**Wer sollte es verwenden?** Jeden, der das HTML aus anderen Gründen auf der Platte braucht. Als erster Schritt einer Konvertierung funktioniert es, solange Sie wissen, dass der Konverter alles konvertieren wird, was Sie gespeichert haben — und das ist das Thema des nächsten Abschnitts.

## Was HTML als Markdown nicht überleben kann

Jedes Werkzeug oben erzeugt Markdown aus Ihrem HTML. Keines kann Markdown erzeugen, das dasselbe bedeutet, denn Markdown hat nicht das Vokabular. Hier ist, was verschwindet, und was es kostet.

**Layout.** Markdown hat keine Spalten, keine Umflüsse, keine Breiten und keine Reihenfolge außer der Reihenfolge des Textes. Ein zweispaltiger Vergleich, mit einem Gitter gesetzt, wird eine Spalte nach der anderen: alles von links, dann alles von rechts. Die Wörter sind alle da, und die Beziehung zwischen ihnen ist weg. Trug das Layout die Bedeutung — ein Vorher-Nachher, zwei Optionen nebeneinander — dann ist das Markdown keine verlustbehaftete Kopie, sondern eine falsche, und keine Konverter-Option behebt das.

**Klassen, IDs und Inline-Stile.** Diese verschwinden, und das sollen sie: Markdown hat keine Gestaltung. Aber sie sind häufig das Einzige, was einen Hinweiskasten, eine Warnung, einen Veraltungsvermerk oder ein hervorgehobenes Zitat markiert. HTML, das `<div class="warning">` sagt, wird ein gewöhnlicher Absatz, und der Leser verliert das Signal, dass dieser Absatz der ist, der zählt. Einem Konverter mit Regeln pro Element — Turndown, markdownify, die Go-Bibliothek — kann man sagen, eine bekannte Klasse in ein Blockzitat oder ein fettes Präfix zu verwandeln. Das ist eine Regel pro Klasse, von Ihnen geschrieben, pro Seite.

**Verschachtelte Tabellen und übergreifende Zellen.** GFM-Tabellen sind ein Gitter einfacher Zellen: kein `rowspan`, kein `colspan`, kein Blockinhalt und schon gar keine Tabelle in einer Zelle. Das Tabellen-Plugin der Go-Bibliothek behandelt Verbindungen durch Auffalten, und das ist die beste verfügbare Antwort und immer noch nicht das Original. Eine in einer Zelle verschachtelte Tabelle hat überhaupt keine Darstellung, und Konverter flachen sie ab, verwerfen sie oder lassen rohes `<table>`-HTML mitten in Ihrem Markdown. Tabellen sind das, was in beide Richtungen am häufigsten verloren geht, und [wie Tabellen bei einer Konvertierung brechen](/blog/markdown-tables-that-survive-conversion) ist es wert, gekannt zu werden, bevor Sie ein Dokument konvertieren, das von einer abhängt.

**Alles Interaktive.** Formulare, Knöpfe, `<details>`-Elemente, Reiter, Akkordeons, eingebettete Player, Canvas, SVG. Markdown kann einen Link auf eine Sache halten, aber nicht die Sache. Konverter sind uneinig darüber, ob sie diese verwerfen oder rohes HTML ausgeben, und rohes HTML im Markdown ist eine Entscheidung mit Folgen: es überlebt, wenn der nächste Renderer rohes HTML erlaubt, und wird zu sichtbarem Tag-Salat maskiert, wenn nicht.

**Relative URLs.** Diese Sache ist leise und bricht Dinge Wochen später. Eine Seite, die mit `src="/img/diagram.png"` geschrieben ist, wird zu Markdown mit genau diesem Pfad, und dieser Pfad löst nun gegen den Ort auf, an dem das Markdown endet, und das ist nicht die ursprüngliche Website. Jedes Bild und die Hälfte der Links zeigen auf nichts. Manche Werkzeuge schreiben relative URLs anhand der Seitenadresse in absolute um; eine nackte Bibliothek, die eine Datei auf der Platte konvertiert, hat keine Adresse, von der sie ausgehen könnte. Prüfen Sie die ersten drei Links jeder konvertierten Seite, denn [Links und Bilder, die nach der Konvertierung noch funktionieren](/blog/images-and-links-that-still-work), passieren nicht zufällig.

**Code, manchmal.** Ein `<pre><code>`-Block konvertiert meist sauber. Ein Codeblock, dessen Hervorhebung aus `<span>`-Elementen pro Token besteht — und das ist, was jeder Syntax-Highlighter ausgibt — wird zu einem eingezäunten Block, wenn der Konverter vernünftig ist, und zu einem Durcheinander verirrter Zeichen, wenn nicht. Die Sprache steht normalerweise in einem Klassennamen wie `language-python`, und ein Konverter, der ihn liest, gibt Ihnen einen beschrifteten Zaun, während einer, der es nicht tut, einen nackten Zaun gibt und die Hervorhebung auf der anderen Seite verliert. [Was in einem Codeblock tatsächlich überlebt](/blog/code-blocks-in-markdown) ist der prüfbare Teil: konvertieren Sie einen und sehen Sie ihn an.

**Und der Unterschied zwischen einer Seite und einem Artikel.** Das ist der eigentliche Preis, und es ist kein Syntaxproblem. Einen sauberen Artikel zu konvertieren — eine Doku-Seite, ein exportiertes Kapitel, ein handgeschriebenes Fragment — ist ein gelöstes Problem, und jedes Werkzeug hier macht es gut. Eine ganze Seite zu konvertieren ist eine andere Aufgabe. Eine gespeicherte Nachrichtenseite enthält einen Seitenkopf, eine Navigationsleiste, ein Cookie-Banner, eine Abo-Aufforderung, eine Liste verwandter Artikel, einen Kommentarbereich, einen Fuß mit sechzig Links und einen rechtlichen Hinweis. Schicken Sie sie durch einen nackten Konverter, und Sie bekommen all das als Markdown, in Leserichtung, mit dem Artikel irgendwo in der Mitte. Die Konvertierung ist korrekt und die Ausgabe unbrauchbar.

Die Kosten, das falsch zu machen, sind konkret. Konvertieren Sie, damit ein Mensch liest, wird er es nicht lesen — und er wird das Werkzeug beschuldigen statt den fehlenden Extraktionsschritt. Konvertieren Sie für einen Suchindex oder ein Modell, haben Sie gerade dasselbe Navigationsmenü einmal pro Seite indexiert, was den Inhalt verdrängt, den Sie speichern wollten. Und konvertieren Sie viele Seiten, entdecken Sie das Problem in der Menge: tausend Dokumente, jedes mit denselben vierzig Zeilen am Anfang. Die Abhilfe ist immer dieselbe und immer vorher — entweder ein Extraktor vor dem Konverter, oder ein Werkzeug, das das strukturelle Mobiliar entfernt, oder ein Selektor, der das tatsächlich gewünschte Element benennt. Das hinterher zu entscheiden heißt, alles zweimal zu konvertieren.

## Wie Sie wählen

1. **Fragen Sie, ob Ihre Eingabe eine Seite oder ein Fragment ist.** Ein Fragment braucht einen Konverter. Eine ganze Seite braucht zuerst Extraktion, sonst übersetzt der Konverter treu das Cookie-Banner und Sie bearbeiten eine Stunde von Hand.
2. **Konvertieren Sie eine repräsentative Datei, bevor Sie sich festlegen.** Nicht die einfachste — die mit der Tabelle, dem Codeblock und dem Hinweiskasten. Welches Werkzeug diese drei behält, behält fast alles andere, und Sie wissen es in einer Minute statt nach zweihundert Dokumenten.
3. **Entscheiden Sie, was mit dem passiert, was Markdown nicht ausdrücken kann.** Verworfen, als rohes HTML behalten oder angenähert: wählen Sie bewusst. Geht das Markdown irgendwohin, das rohes HTML maskiert, ist es zu behalten dasselbe, wie es zu beschädigen.
4. **Rechnen Sie die Installationen gegen die Zahl der Konvertierungen.** Eine Datei rechtfertigt keinen Paketmanager, keine Laufzeitumgebung und keinen Abhängigkeitsbaum. Ein nächtlicher Job rechtfertigt keinen Browser-Tab und keinen Menschen, der darin klickt.
5. **Prüfen Sie, wohin die Datei geht.** Ein Online-Konverter, der hochlädt, hat Ihr Dokument, was bei einer öffentlichen Seite belanglos und bei einer internen die ganze Frage ist. Konvertierung im Browser ist überprüfbar: Netzwerk-Tab öffnen und zusehen, wie nichts passiert.
6. **Sehen Sie sich die Links und Bilder in der Ausgabe an, nicht nur den Text.** Dass relative URLs zu relativen URLs werden, ist das Scheitern, das wie Erfolg aussieht, und es zeigt sich erst, wenn jemand anderes die Datei woanders öffnet.

## Fazit

Der beste HTML-zu-Markdown-Konverter ist der, der die Extraktion richtig macht — [die Anleitung geht jeden Ausgangspunkt durch](/blog/convert-html-to-markdown) — denn die Übersetzung ist nahezu Massenware und die Extraktion ist, woher jedes enttäuschende Ergebnis kommt. Für eine Seite, die Sie ansehen, clippen Sie sie mit einer Erweiterung, die zuerst einen Extraktor laufen lässt. Für eine Datei, die Sie schon haben, entfernt [die HTML-zu-Markdown-Konvertierung von TransformPipe](/html-to-markdown) das Seitenmobiliar, behält die Tabellen, Codeblöcke und Aufgabenlisten und tut das in Ihrem Browser, ohne Upload und ohne Installation. Für einen Build oder ein Skript nehmen Sie die Bibliothek Ihrer Sprache — Turndown, markdownify, node-html-markdown, das Go-CLI, [nebeneinander verglichen nach Regeln, Tabellen, Codeblöcken und Leerraum](/blog/turndown-and-html-to-markdown-libraries) — und akzeptieren, dass Layout, Gestaltung und verschachtelte Tabellen nicht mitkommen. Dieser Verlust ist kein Fehler im Werkzeug. Er ist die Definition von Markdown und der Grund, warum die Datei am anderen Ende lesbar ist.

## FAQ

### Was ist der beste kostenlose HTML-zu-Markdown-Konverter?

Für eine einzelne Datei ist ein Konverter im Browser die beste kostenlose Wahl: keine Installation, kein Upload, und Markdown in einer Sekunde zurück, ohne Kosten. Für Code sind Turndown in JavaScript, markdownify in Python und das Go-CLI html-to-markdown alle kostenlos und MIT-lizenziert, und Pandoc ist kostenlos unter der GPL.

### Wie wandle ich eine ganze Webseite in Markdown um?

Nehmen Sie einen Clipper, keinen Konverter. Eine Browser-Erweiterung wie MarkDownload oder der Obsidian Web Clipper lässt zuerst einen Extraktor über die dargestellte Seite laufen, der Navigation und Banner verwirft, und konvertiert erst dann, was bleibt. Die Seite als `.html` zu speichern und die Datei zu konvertieren gibt Ihnen die ganze Seite samt Mobiliar.

### Warum ist mein konvertiertes Markdown voller Navigationslinks?

Weil Sie die Seite konvertiert haben statt des Artikels. Nackte Konverter übersetzen jedes Element, das Sie ihnen geben, und eine gespeicherte Seite ist überwiegend nicht der Artikel. Extrahieren Sie den Inhalt entweder zuerst mit etwas wie Readability, oder nehmen Sie ein Werkzeug, das strukturelle Elemente — Kopfbereiche, Navigation, Fußbereiche, Skripte — vor der Konvertierung entfernt.

### Behalten HTML-zu-Markdown-Konverter Tabellen?

Manche ja, manche brauchen ein Plugin, und keiner behält eine komplizierte. Turndown braucht `turndown-plugin-gfm` für Tabellen; node-html-markdown, html-to-md und die Go-Bibliothek verkraften sie direkt. Kein Konverter kann eine verschachtelte Tabelle oder eine übergreifende Zelle treu behalten, denn GFM-Tabellen sind ein flaches Gitter einfacher Zellen.

### Kann ich HTML von der Kommandozeile in Markdown umwandeln?

Ja. Pandoc liest HTML und schreibt GFM, html2text ist ein Python-CLI, und das Go-Projekt html-to-markdown liefert ein installierbares `html2markdown`-Programm, das die Standardeingabe liest. Für eine Aufgabe in CI nimmt ein Konverter mit REST-API oder GitHub Action die Installation ganz von Ihrem Runner.

### Was passiert mit CSS und Inline-Stilen?

Sie werden verworfen, denn Markdown hat keine Gestaltung. Das ist meist, was Sie wollen, und gelegentlich ein echter Verlust: ein Klassenname ist oft das Einzige, was einen Warnkasten, einen Hinweis oder ein hervorgehobenes Zitat von einem gewöhnlichen Absatz unterscheidet. Konverter mit Regeln pro Element können eine bekannte Klasse auf ein Blockzitat oder ein fettes Präfix abbilden, aber diese Regel schreiben Sie selbst.

### Ist es sicher, eine HTML-Datei zu konvertieren, die mir jemand geschickt hat?

Konvertieren ist in dem Sinne sicher, dass die Ausgabe Markdown ist, und das ist Text. Die Risiken liegen anderswo: das HTML zuerst in einem Browser zu öffnen führt aus, was darin steht, und Markdown kann rohes HTML zum nächsten Renderer weitertragen, wenn der Konverter es durchlässt. Konvertieren Sie ohne zu öffnen, und prüfen Sie, ob Ihr Konverter `<script>` entfernt oder behält.
