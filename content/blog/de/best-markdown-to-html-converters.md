---
title: "Die besten Markdown-zu-HTML-Konverter 2026: verglichen und getestet"
description: "Markdown-zu-HTML-Konverter im Vergleich: welchen Dialekt sie beherrschen, ob sie bereinigen und ob die Datei am Ende allein öffnet oder nur ein Fragment bleibt"
date: 2026-09-08
tag: Konvertieren
keywords: bester markdown zu html konverter, markdown zu html online, md in html umwandeln, markdown zu html bibliothek, markdown zu html kommandozeile, eigenständige html datei aus markdown, markdown in html ohne installation
---

Jeder Markdown-zu-HTML-Konverter erzeugt HTML. Damit endet die Ähnlichkeit. Einer gibt ein Fragment zurück, um das kein `<html>` steht, ein anderer behält das `<script>`-Tag, das jemand in der Datei hinterlassen hat, ein dritter verliert Ihre Tabellen, weil er sie nie umgesetzt hat. Die Datei, die Sie zurückbekommen, ist das Produkt — und die Unterschiede zeigen sich erst, wenn Sie sie irgendwo anders öffnen als in dem Werkzeug, das sie erzeugt hat.

### Kurzfassung

Wählen Sie danach, was mit der Datei passieren soll, nicht nach der Länge der Funktionsliste. Für ein Dokument, das Sie jemandem schicken, brauchen Sie eine **vollständige, eigenständige HTML-Datei** mit eingebetteten Stilen — kein Fragment. Für ein Dokument, das irgendetwas enthält, das Sie nicht selbst geschrieben haben, muss der Konverter **bereinigen**, denn Markdown erlaubt rohes HTML und rohes HTML erlaubt Skripte. Für einen Build nehmen Sie die **Bibliothek, die Ihr Generator ohnehin verwendet**, und hören dort auf. Ein Konverter im Browser deckt den ersten Fall ab, ohne Upload und ohne Installation; Pandoc deckt die größte Formatvielfalt ab, wenn Sie es installieren wollen; marked, markdown-it und remark sind die Bibliotheken, auf denen alles andere aufbaut.

## Warum „konvertiert Markdown" fast nichts aussagt

Eine Markdown-Datei in HTML zu verwandeln sind vier Arbeitsschritte hintereinander, und ein Werkzeug kann bei einem sorgfältig und beim nächsten nachlässig sein. Es zerlegt den Text in einen Baum, gibt diesen Baum als HTML-Tags aus, bereinigt das Ergebnis und verpackt es in ein Dokument. [Was mit Ihrer Datei tatsächlich passiert](/blog/markdown-to-html-converter) lohnt sich in ganzer Länge, aber die Kurzfassung ist: Konverter unterscheiden sich in jedem dieser vier Schritte, und die Unterschiede sind unsichtbar, bis sie zubeißen.

Der erste Schritt entscheidet über den Dialekt. Reines CommonMark hat eingezäunte Codeblöcke, aber keine Tabellen, keine Aufgabenlisten, kein Durchgestrichenes und keine Autolinks. GitHub Flavored Markdown fügt alle vier hinzu. Fußnoten stehen in keiner der beiden Spezifikationen, ein Konverter, der sie unterstützt, tut das also als Erweiterung. Eine Datei, die auf GitHub korrekt erscheint und woanders falsch herauskommt, ist meist auf einen Parser mit kleinerem Dialekt getroffen — und der Fehler ist lautlos, denn eine Tabelle, die der Parser nicht erkennt, ist einfach ein Absatz voller Pipe-Zeichen.

Der dritte Schritt entscheidet, ob Ihr Dokument seinen Leser angreifen kann. Markdown wurde bewusst so entworfen, dass rohes HTML durchgelassen wird — eine `.md`-Datei kann also `<script>`, `onerror=` und `javascript:`-URLs enthalten, und ein Konverter, der treu wiedergibt, übergibt sie alle dem Browser. Das wird in dem Moment wichtig, in dem Sie eine Datei konvertieren, die Sie nicht selbst geschrieben haben — eine README aus einem Repository, ein Dokument von einem Kunden, irgendetwas aus dem Netz. [Bereinigen ist bei solchen Dateien nicht optional](/blog/sanitising-markdown-safely), und überraschend viele Werkzeuge überlassen es Ihnen.

Der vierte Schritt entscheidet, ob die Datei sich öffnen lässt. Ein Konverter, der ein Fragment zurückgibt — `<h1>Titel</h1><p>Text</p>` und nichts darum herum — hat seine Aufgabe als Bibliothek erfüllt und als Werkzeug verfehlt. Im Browser geöffnet erscheint dieses Fragment als schwarzer Text ohne Formatierung auf Weiß, in der Standardschrift des Browsers und über die ganze Fensterbreite. Es ist technisch korrektes HTML, und für jeden, der es bekommt, sieht es kaputt aus.

## Der schnelle Vergleich

| Werkzeug | Am besten für | Entscheidende Fähigkeit | Preis |
| --- | --- | --- | --- |
| TransformPipe | Jemandem ein fertiges Dokument schicken | Eigenständiges HTML, Stile eingebettet, Konvertierung im Browser | Kostenlos |
| Pandoc | Zwischen vielen Formaten konvertieren | ~40 Formate, Vorlagen, `--standalone` und eingebettete Assets | Kostenlos, GPL |
| marked | Schnelle Konvertierung in einer JS-Anwendung | Klein, schnell, GFM von Haus aus | Kostenlos, MIT |
| markdown-it | Korrektheit und Plugins | CommonMark-konform, maskiert rohes HTML standardmäßig | Kostenlos, MIT |
| remark / unified | Das Dokument umbauen, nicht nur ausgeben | Ein AST, den Sie durchlaufen und umschreiben können | Kostenlos, MIT |
| commonmark.js | Nachsehen, was die Spezifikation wirklich sagt | Die Referenzimplementierung | Kostenlos, BSD |
| Showdown | Ältere JS-Projekte, die es schon nutzen | Lange etabliert, aus der Zeit vor CommonMark | Kostenlos, MIT |
| Python-Markdown | Python-Build-Skripte | Erweiterungs-API, treibt MkDocs an | Kostenlos, BSD |
| Goldmark | Go-Programme und Hugo-Seiten | CommonMark-konform, schnell, erweiterbar | Kostenlos, MIT |
| Dillinger | Schreiben und Exportieren in einem Tab | Editor mit HTML- und PDF-Export, Cloud-Sync | Kostenlos, MIT |
| StackEdit | Offline im Browser schreiben | Editor im Browser, Sync mit Drive, Dropbox, GitHub | Kostenlos, Apache 2.0 |
| Typora | Ein Desktop-Editor, in dem Sie wohnen | WYSIWYG-Bearbeitung, Export als HTML, PDF, Word | 14,99 $ einmalig |
| VS Code | Konvertieren, während Sie ohnehin programmieren | Eingebaute Vorschau (markdown-it), Export über Erweiterungen | Kostenlos |
| Statische Seitengeneratoren | Eine Website, kein Dokument | Hugo, Eleventy, Docusaurus, MkDocs, Jekyll | Kostenlos |
| GitHub / GitLab | Lesen, nicht exportieren | Stellen GFM dar; kein Export-Knopf | Kostenlos |

## Die besten Markdown-zu-HTML-Konverter 2026

### TransformPipe — am besten für ein Dokument, das Sie jemandem schicken

TransformPipe verwandelt eine Markdown-Datei im Browser in ein vollständiges HTML-Dokument und gibt sie als eine Datei mit eingebetteten Stilen zurück. Es gibt keine Installation, kein Konto ist nötig, und abgemeldet wird die Datei nirgendwohin gesendet — sie wird auf Ihrem eigenen Rechner gelesen, konvertiert und dargestellt.

| Vorteile | Nachteile |
| --- | --- |
| Der Export ist eine Datei, die vom Netz nichts verlangt | Kein Seitengenerator: ein Dokument auf einmal, oder mehrere zu einem verkettet |
| Abgemeldet wird nichts hochgeladen | Der Browser macht die Arbeit, sehr große Dateien begrenzt also der Rechner |
| Bereinigt gegen eine feste Positivliste, im Browser wie auf dem Server | Keine Vorlagensprache für eigene Layouts |
| Wandelt auch [HTML](/blog/best-html-to-markdown-converters), [Word](/blog/best-word-to-markdown-converters), CSV und [JSON](/blog/best-json-to-markdown-converters) zurück nach Markdown | |

**Preis:** kostenlos. Ein Konto bringt Verlauf, Freigaben und eine API, ebenfalls kostenlos.

**Technische Details und Funktionen**

- GitHub Flavored Markdown: Tabellen, Aufgabenlisten, Durchgestrichenes, Autolinks, eingezäunter Code
- Die Ausgabe ist ein vollständiges Dokument — Doctype, Head, eingebettetes `<style>`, keinerlei externe Anfragen
- Rohes HTML in der Quelle läuft durch einen Bereiniger mit fester Positivliste, bevor es die Seite erreicht
- Herunterladen als `.html`, `.md` oder reiner Text, oder als PDF über den Druckdialog des Browsers
- Die gleiche Konvertierung gibt es über eine REST-API, ein CLI ohne Abhängigkeiten, eine GitHub Action und einen MCP-Server

**Wer sollte es verwenden?** Jeder, dessen nächster Schritt „das an eine Person schicken" ist. Der eigenständige Export ist der Punkt: er öffnet auf einem Laptop ohne Verbindung genauso wie bei Ihnen, [was eine bestimmte Eigenschaft ist, die man verstehen sollte](/blog/share-a-markdown-document-as-a-link), bevor man jemandem eine `.md`-Datei mailt und hofft.

### Pandoc — am besten für die Konvertierung zwischen vielen Formaten

Pandoc ist ein Dokumentkonverter für die Kommandozeile, geschrieben in Haskell, der rund vierzig Formate liest und schreibt, Markdown und HTML darunter. Es ist mit großem Abstand das mächtigste Werkzeug dieser Liste — und dasjenige, das Sie installieren müssen.

| Vorteile | Nachteile |
| --- | --- |
| Konvertiert zwischen Formaten, die sonst niemand anfasst, darunter LaTeX und EPUB | Braucht eine Installation und ein Terminal |
| `--standalone` erzeugt ein vollständiges Dokument, kein Fragment | Vorlagen und Filter sind eine eigene Lernkurve |
| Vorlagen geben genaue Kontrolle über die Verpackung | Kein Bereinigen: rohes HTML geht unverändert durch |
| Assets lassen sich einbetten, sodass eine einzige Datei entsteht | Die Dialektunterschiede seiner Markdown-Varianten überraschen Leute |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- Ein eigener erweiterter Markdown-Dialekt, dazu CommonMark- und GFM-Leser, die Sie ausdrücklich auswählen
- `--standalone` verpackt die Ausgabe in ein vollständiges Dokument; `--embed-resources` bettet Bilder und CSS ein
- `--template` und Lua-Filter, um das Dokument mitten in der Konvertierung umzuschreiben
- `--sandbox` beschränkt den Dateizugriff, wenn Sie Dateien konvertieren, denen Sie nicht trauen

**Wer sollte es verwenden?** Jeder, der planmäßig konvertiert oder in andere Formate als HTML — eine Manuskript-Pipeline, ein Dokumentations-Build, ein Repository, das aus derselben Quelle EPUB und PDF veröffentlichen muss. [Wie es sich bei einmaligen Markdown-zu-HTML-Aufgaben schlägt](/blog/markdown-to-html-from-the-command-line) ist eine engere Frage, und die Antwort lautet oft, dass es mehr Werkzeug ist, als die Aufgabe braucht.

### marked — am besten für Geschwindigkeit in einer JavaScript-Anwendung

marked ist ein kleiner, schneller Markdown-Parser und -Compiler für JavaScript, im Browser und in Node verwendbar. Es ist eine der beiden Bibliotheken, nach denen die meisten JS-Projekte greifen.

| Vorteile | Nachteile |
| --- | --- |
| Sehr schnell und sehr klein | Gibt ein Fragment zurück; das Verpacken ist Ihre Aufgabe |
| GitHub Flavored Markdown von Haus aus unterstützt | Bereinigen ist ausdrücklich nicht seine Zuständigkeit |
| Eine einfache API: eine Funktion, ein Optionsobjekt | Erweiterungspunkte sind weniger strukturiert als bei markdown-it |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- GFM standardmäßig, mit Optionen für Zeilenumbrüche, Überschriften-IDs und intelligente Listen
- Ein Lexer, den Sie separat aufrufen können, um Token statt HTML zu erhalten
- Eigene Renderer, um die Ausgabe jedes Knotentyps zu überschreiben
- Kein eingebauter Bereiniger: die dokumentierte Antwort ist, die Ausgabe durch DOMPurify zu schicken

**Wer sollte es verwenden?** Entwickler, die Markdown in einer Anwendung darstellen, in der Geschwindigkeit zählt und das umgebende Dokument schon existiert — ein Kommentarfeld, eine Vorschau, eine Chat-Nachricht.

### markdown-it — am besten für Korrektheit und Plugins

markdown-it ist ein CommonMark-konformer Parser mit einem strukturierten Plugin-System. Es ist das, was die Markdown-Vorschau von VS Code selbst verwendet, was für seine Konformität durchaus spricht.

| Vorteile | Nachteile |
| --- | --- |
| Besteht die Testsuite der CommonMark-Spezifikation | Etwas größer und langsamer als marked |
| Maskiert rohes HTML standardmäßig, `html: false` ist also die sichere Voreinstellung | Gibt trotzdem ein Fragment zurück |
| Ein echtes Plugin-Ökosystem: Fußnoten, Container, Attribute, Anker | Die Qualität der Plugins schwankt |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- CommonMark standardmäßig, GFM-Funktionen über Presets und Plugins verfügbar
- `html: false` als Voreinstellung — rohes HTML in der Quelle wird maskiert statt durchgelassen
- Regeln lassen sich auf Block- und Inline-Ebene hinzufügen, ersetzen und umsortieren
- Linkify- und Typographer-Optionen für Autolinks und typografische Zeichen

**Wer sollte es verwenden?** Alle, die wollen, dass die Spezifikation eingehalten und die Erweiterungspunkte dokumentiert sind, und alle, denen die sichere Voreinstellung mehr wert ist als ein paar Millisekunden.

### remark und unified — am besten, um das Dokument zu verändern, nicht nur auszugeben

remark zerlegt Markdown in einen abstrakten Syntaxbaum und übergibt ihn Ihnen. Das Ausgeben ist ein Plugin am Ende einer Kette; der Sinn ist alles, was Sie davor tun können.

| Vorteile | Nachteile |
| --- | --- |
| Ein echter AST, den Sie durchlaufen, abfragen und umschreiben können | Die mit Abstand schwerste Option hier |
| Ein enormes Plugin-Ökosystem, rehype für HTML-Ausgabe inklusive | Die unified-Pipeline will wirklich gelernt werden |
| Treibt MDX und Docusaurus an, ist also gut erprobt | Überdimensioniert, um eine Datei in eine Seite zu verwandeln |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- mdast für Markdown, hast für HTML, mit Plugins für den Weg dazwischen
- remark-gfm für Tabellen und Aufgabenlisten, remark-frontmatter für den Kopf
- rehype-sanitize als vollwertiger Schritt in der Pipeline statt als nachträglicher Einfall
- Wird für Linter, Formatierer und Codemods über Prosa gebaut, nicht nur für Renderer

**Wer sollte es verwenden?** Teams, die auf dem Weg etwas mit dem Dokument tun — Links umschreiben, Überschriften extrahieren, Hausregeln erzwingen, MDX-Komponenten erzeugen.

### commonmark.js — am besten, um einen Streit über die Spezifikation zu beenden

commonmark.js ist die Referenzimplementierung von CommonMark, geschrieben von den Autoren der Spezifikation. Ihr Zweck ist Konformität, nicht Funktionsumfang.

| Vorteile | Nachteile |
| --- | --- |
| Die endgültige Antwort auf „was sagt die Spezifikation?" | Keine Tabellen, Aufgabenlisten oder Durchgestrichenes — das ist GFM |
| Klein und vorhersagbar | Wenige Erweiterungspunkte, bewusst |
| Enthält einen AST | Nicht als Renderer einer Anwendung gedacht |

**Preis:** kostenlos, BSD-lizenziert.

**Wer sollte es verwenden?** Alle, die Parser vergleichen, selbst einen schreiben oder herausfinden wollen, ob ein Darstellungsunterschied ein Fehler oder ein Dialekt ist. Greifen Sie danach, wenn Sie wissen müssen, was reines CommonMark tut — was [häufiger vorkommt, als man denkt](/blog/commonmark-gfm-and-the-flavours).

### Showdown — am besten nur, wenn Sie es schon einsetzen

Showdown ist ein JavaScript-Markdown-Konverter, der älter als CommonMark ist und weiterhin gepflegt wird. Er funktioniert, und es gibt keinen starken Grund, ihn für etwas Neues zu wählen.

| Vorteile | Nachteile |
| --- | --- |
| Lange etabliert und stabil | Bewusst nicht CommonMark-konform |
| Läuft im Browser und in Node | Dialektunterschiede zu GFM in Grenzfällen |
| Optionsflaggen für die meisten Verhaltensweisen | Kleineres Ökosystem als marked oder markdown-it |

**Preis:** kostenlos, MIT-lizenziert.

**Wer sollte es verwenden?** Projekte, die schon darauf gebaut sind. Neue Arbeit ist mit markdown-it besser bedient.

### Python-Markdown — am besten für Python-Build-Skripte

Python-Markdown ist die lange etablierte Markdown-Implementierung für Python, mit einer Erweiterungs-API, auf der sehr viel Dokumentationswerkzeug aufbaut, MkDocs eingeschlossen.

| Vorteile | Nachteile |
| --- | --- |
| Ausgereifte Erweiterungs-API mit vielen verfügbaren Erweiterungen | Nicht in jedem Detail CommonMark-konform |
| Natürliche Wahl für eine Python-Build-Pipeline | Langsamer als die JS- und Go-Optionen |
| Tabellen, Fußnoten und Attributlisten als offizielle Erweiterungen | Fragment-Ausgabe; das Verpacken ist Ihres |

**Preis:** kostenlos, BSD-lizenziert.

**Wer sollte es verwenden?** Python-Projekte, und alle, die MkDocs erweitern, wo es ohnehin die Maschine ist.

### Goldmark — am besten für Go und für Hugo-Seiten

Goldmark ist ein CommonMark-konformer Markdown-Parser in Go, bemerkenswert vor allem, weil er die Maschine in Hugo ist, seit er Blackfriday ersetzt hat.

| Vorteile | Nachteile |
| --- | --- |
| CommonMark-konform und schnell | Nur Go |
| Erweiterbar mit einem klaren AST | Fragment-Ausgabe |
| Steckt schon in Ihrem Stack, wenn Sie Hugo verwenden | Weniger fertige Erweiterungen als in der JS-Welt |

**Preis:** kostenlos, MIT-lizenziert.

**Wer sollte es verwenden?** Go-Programme, und Hugo-Nutzer, die verstehen wollen, was ihre Inhalte darstellt.

### Dillinger — am besten, um in einem Tab zu schreiben und zu exportieren

Dillinger ist ein Markdown-Editor im Netz mit Live-Vorschau und Export als HTML und PDF, dazu Sync mit Dropbox, Google Drive, OneDrive und GitHub.

| Vorteile | Nachteile |
| --- | --- |
| Schreiben und Exportieren, ohne den Browser zu verlassen | Ihr Dokument läuft über einen gehosteten Dienst |
| Cloud-Sync zu den üblichen Orten | Die Export-Formatierung ist die des Werkzeugs, nicht Ihre |
| Kostenlos und Open Source | Editor zuerst: nicht gebaut, um vorhandene Dateien zu konvertieren |

**Preis:** kostenlos, MIT-lizenziert.

**Wer sollte es verwenden?** Leute, die das Dokument gerade schreiben und am Ende einen Link oder eine Datei wollen.

### StackEdit — der beste Browser-Editor, der offline funktioniert

StackEdit ist ein Markdown-Editor im Browser, der ohne Verbindung weiterarbeitet und mit Google Drive, Dropbox und GitHub synchronisiert, sobald er eine hat.

| Vorteile | Nachteile |
| --- | --- |
| Funktioniert offline, sobald er geladen ist | Editor zuerst, wie Dillinger |
| Synchronisiert und veröffentlicht an mehrere Ziele | Die eigene erweiterte Syntax reist schlecht |
| Verkraftet lange Dokumente ohne Mühe | Der Export ist auf seine Art formatiert |

**Preis:** kostenlos, Apache-2.0-lizenziert.

**Wer sollte es verwenden?** Schreibende, die einen ernsthaften Editor im Browser-Tab wollen und daraus veröffentlichen.

### Typora — der beste Desktop-Editor mit Export

Typora ist ein Markdown-Editor für den Desktop mit WYSIWYG-Modus — das Markdown wird beim Tippen durch seine Darstellung ersetzt — und Export als HTML, PDF, Word und mehr.

| Vorteile | Nachteile |
| --- | --- |
| Das angenehmste Schreiberlebnis dieser Liste | Kostenpflichtig, und nur Desktop |
| Exportiert nach HTML, PDF und Word mit Themes | WYSIWYG verbirgt die Syntax, was manche Schreibende nicht mögen |
| Lokale Dateien, nichts wird hochgeladen | Kein Werkzeug für Stapel oder Builds |

**Preis:** 14,99 $, ein einmaliger Kauf für bis zu drei Geräte, mit 15 Tagen kostenloser Testphase (geprüft auf typora.io, 8. September 2026).

**Wer sollte es verwenden?** Leute, die täglich Markdown schreiben und eine Anwendung wollen statt eines Tabs.

### VS Code — am besten, wenn Sie ohnehin darin sind

VS Code bringt eine Markdown-Vorschau auf Basis von markdown-it mit, Erweiterungen ergänzen den Export. Wenn die Datei bereits im Editor offen ist, ist das der kürzeste Weg von Text zu Seite.

| Vorteile | Nachteile |
| --- | --- |
| Für die meisten Entwickler schon installiert | Export braucht eine Erweiterung, und die Erweiterungen unterscheiden sich |
| Die Vorschau entspricht dem CommonMark-Verhalten von markdown-it | Keine Pipeline: es konvertiert, was offen ist |
| Erweiterungen decken HTML-, PDF- und Folien-Export ab | Die Vorschau-Formatierung ist nicht die exportierte |

**Preis:** kostenlos.

**Wer sollte es verwenden?** Entwickler, die im Vorbeigehen eine README oder eine Notiz konvertieren. [Was es ausmacht, das in VS Code gut zu tun](/blog/markdown-to-html-converter), hängt daran, welche Erweiterung Sie wählen und was sie um das Fragment herum setzt.

### Statische Seitengeneratoren — die Antwort, wenn Sie eine Website wollen

Hugo, Eleventy, Docusaurus, MkDocs und Jekyll verwandeln alle Markdown in HTML, und keiner davon ist ein Konverter. Sie sind Build-Systeme: sie erwarten ein Verzeichnis, eine Konfigurationsdatei, Vorlagen und ein Deployment-Ziel, und sie geben Ihnen dafür Navigation, Feeds und Querverweise.

| Vorteile | Nachteile |
| --- | --- |
| Navigation, Suche und Vorlagen über viele Dokumente hinweg | Enormer Aufwand für eine einzige Datei |
| Schnell, gut dokumentiert, weit verbreitet | Eine Konfigurationsdatei und ein Build-Schritt zum Pflegen |
| Themes und Plugin-Ökosysteme | Das Ergebnis ist eine Website, kein Dokument zum Mailen |

**Preis:** kostenlos.

**Wer sollte es verwenden?** Alle, die eine Sammlung von Dokumenten veröffentlichen, die aufeinander verweisen. Wenn Sie eine Datei und eine Person haben, an die sie gehen soll, [brauchen Sie keinen Generator](/blog/share-a-markdown-document-as-a-link) — Sie brauchen eine Datei.

### GitHub und GitLab — Darstellung, keine Konvertierung

Beide stellen GFM hervorragend dar, und keines gibt Ihnen einen Export-Knopf. Sie können HTML aus der Markdown-API von GitHub holen, und Sie können die dargestellte Seite im Browser speichern, aber was Sie dann speichern, kommt in das Markup und die Stylesheets ihrer Anwendung eingewickelt.

**Wer sollte es verwenden?** Niemand, zum Konvertieren. Beide sind ausgezeichnete Orte, um Markdown zu lesen, und die falschen, um es zu konvertieren.

## Was in den Vergleichstabellen fehlt

Herstellerseiten konkurrieren über Funktionen. Was tatsächlich darüber entscheidet, ob eine konvertierte Datei funktioniert, steht selten auf der Liste.

**Ob die Ausgabe ein Dokument ist.** Das ist die häufigste Enttäuschung. Bibliotheken geben Fragmente zurück, korrekt und mit Absicht; mehrere Online-Werkzeuge tun dasselbe. Sie fügen das Ergebnis in eine Datei ein, öffnen sie und erhalten unformatierten Text über die Standardbreite des Browsers. Ein Werkzeug, das Ihnen ein vollständiges Dokument gibt — Doctype, Head, Stile — hat eine Entscheidung für Sie getroffen, die eine Bibliothek nicht treffen kann.

**Ob die Datei das Netz braucht.** Ein Export, der ein Stylesheet oder eine Schrift von einem CDN einbindet, sieht nicht mehr richtig aus, sobald er offline geöffnet wird, und er erzählt demjenigen, der ihn öffnet, etwas darüber, wo die Datei gewesen ist. Eine eigenständige Datei trägt ihre Stile in sich und fragt nichts an. Sie ist größer, und sie ist die einzige Fassung, die sich überall gleich verhält.

**Ob rohes HTML überlebt.** Treue Wiedergabe und sichere Wiedergabe sind verschiedene Ziele, und jedes Werkzeug hier entscheidet sich für eines. markdown-it maskiert rohes HTML, solange man nichts anderes sagt. marked lässt es durch und sagt das auch. Pandoc lässt es durch. Wenn die Datei von jemand anderem kam, müssen Sie wissen, welches der beiden Sie verwenden, bevor Sie das Ergebnis im Browser öffnen.

**Wohin die Datei geht.** Ein Online-Konverter, der hochlädt, ist ein Online-Konverter, der Ihr Dokument hat. Für eine öffentliche README ist das belanglos; für einen Vertrag, eine Patientennotiz oder einen unveröffentlichten Plan ist es die ganze Frage. Konvertierung im Browser bedeutet, dass die Datei den Rechner nie verlässt, und das ist überprüfbar — öffnen Sie den Netzwerk-Tab und sehen Sie zu, wie nichts passiert.

**Was es mit dem Kopf macht.** Eine Markdown-Datei aus einem statischen Seitengenerator oder einer Notiz-App beginnt meist mit YAML-Frontmatter. Manche Konverter entfernen es, manche stellen es als Absatz aus `key: value`-Zeilen an den Anfang Ihres Dokuments, und einige machen eine Tabelle daraus. Keines davon ist falsch, und nur eines davon ist, was Sie wollten.

## Wie Sie wählen

Die Kriterien unten sind die Kurzfassung; [die Anforderungen, die man aufschreiben sollte, bevor man irgendetwas vergleicht](/blog/choosing-a-markdown-to-html-converter), gehen weiter.

1. **Fangen Sie beim Ziel an.** Es an eine Person zu schicken braucht ein eigenständiges Dokument. Eine Sammlung von Seiten zu veröffentlichen braucht einen Generator. Innerhalb einer Anwendung darzustellen braucht eine Bibliothek. Das sind drei verschiedene Werkzeuge, und das falsche ist im Rückblick offensichtlich.
2. **Passen Sie den Dialekt zur Datei.** Wenn das Dokument Tabellen oder Aufgabenlisten hat, muss der Konverter GFM können, nicht nur reines CommonMark. Konvertieren Sie eine repräsentative Datei und sehen Sie sich die Tabellen an, bevor Sie sich festlegen.
3. **Entscheiden Sie über das Bereinigen, bevor Sie die Datei eines anderen konvertieren.** Für eigene Notizen ist es unerheblich. Für alles, was von außen kam, bereinigt entweder der Konverter oder Sie.
4. **Zählen Sie die Installationen.** Eine einmalige Konvertierung sollte keinen Paketmanager verlangen. Ein nächtlicher Build sollte keinen Browser-Tab und keinen Menschen darin verlangen.
5. **Öffnen Sie das Ergebnis woanders.** Nicht in der Vorschau des Werkzeugs — in einem anderen Browser, auf einem anderen Rechner, mit abgeschaltetem Netz. Das ist der Test, der Fragmente, fehlende Stile und CDN-Links auf einmal erwischt, und er kostet eine Minute.

## Fazit

Der beste Markdown-zu-HTML-Konverter ist derjenige, dessen Ausgabe die Reise übersteht. Wenn Sie eine Datei haben und sie in der nächsten Minute konvertiert haben wollen, [stehen die Schritte hier](/blog/convert-markdown-to-html-online). Für ein Dokument mit einem Empfänger heißt das: eine vollständige Datei mit eingebetteten Stilen, bereinigt, erzeugt ohne die Quelle irgendwohin hochzuladen — was [die Markdown-zu-HTML-Konvertierung von TransformPipe](/) in Ihrem Browser tut, kostenlos, ohne Installation und ohne Anmeldung. Für einen Build nehmen Sie die Bibliothek, von der Ihr Generator ohnehin abhängt. Für alles jenseits von HTML installieren Sie Pandoc und lernen seine Vorlagen; es wird jedes andere Werkzeug auf dieser Seite überleben.

## FAQ

### Was ist der beste kostenlose Markdown-zu-HTML-Konverter?

Für ein fertiges Dokument ist ein Konverter im Browser, der eigenständiges HTML erzeugt, die beste kostenlose Wahl: keine Installation, kein Upload, und eine Datei, die überall öffnet. Ein Konverter im Browser leistet das ohne Kosten. Für die Konvertierung im eigenen Code sind marked und markdown-it beide kostenlos und MIT-lizenziert, und Pandoc ist für die Kommandozeile kostenlos.

### Wie wandle ich Markdown in HTML um, ohne etwas zu installieren?

Nehmen Sie einen Konverter, der im Browser läuft. Ziehen Sie die `.md`-Datei auf die Seite und laden Sie das HTML herunter — kein Paketmanager, kein Terminal, und bei einem Werkzeug im Browser wird die Datei nie hochgeladen, was Sie bestätigen können, indem Sie beim Konvertieren den Netzwerk-Tab beobachten.

### Warum sieht mein konvertiertes HTML unformatiert aus?

Weil Sie ein Fragment statt eines Dokuments bekommen haben. Bibliotheken geben `<h1>…</h1><p>…</p>` zurück, ohne `<html>`, `<head>` oder Stile darum, und ein Browser stellt das in seiner Standardschrift über die ganze Fensterbreite dar. Sie brauchen einen Konverter, der die Ausgabe in ein vollständiges Dokument verpackt — oder Sie müssen diese Verpackung selbst schreiben.

### Behalten Markdown-zu-HTML-Konverter Tabellen?

Nur wenn sie GitHub Flavored Markdown umsetzen. Tabellen sind nicht Teil der CommonMark-Spezifikation, ein streng konformer Parser stellt eine Tabelle also als Absatz mit Pipe-Zeichen dar. Wenn Ihre Dokumente Tabellen haben, testen Sie eine, bevor Sie sich für einen Konverter entscheiden — [Tabellen brechen auf dem Weg hinüber am häufigsten](/blog/markdown-tables-that-survive-conversion).

### Ist es sicher, eine Markdown-Datei zu konvertieren, die mir jemand geschickt hat?

Nur mit einem Konverter, der bereinigt. Markdown erlaubt rohes HTML, eine `.md`-Datei kann also `<script>`-Tags, `onerror`-Handler und `javascript:`-URLs mitbringen, und ein treuer Renderer übergibt jeden davon Ihrem Browser. Prüfen Sie, ob das Werkzeug standardmäßig bereinigt, bevor Sie die Ausgabe öffnen.

### Kann ich Markdown von der Kommandozeile oder in einem CI-Job in HTML umwandeln?

Ja. Pandoc ist die allgemeine Antwort, und die meisten Sprachen haben eine Bibliothek mit CLI-Aufsatz. Wenn die Aufgabe Teil eines Pull Requests oder eines nächtlichen Builds ist, nimmt ein Konverter mit API oder GitHub Action die Installation ganz aus Ihrem Runner heraus.

### Was ist der Unterschied zwischen marked und Marked 2?

Es sind unabhängige Produkte mit verwirrend ähnlichen Namen. `marked` ist die oben beschriebene Open-Source-JavaScript-Bibliothek. Marked 2 ist eine kostenpflichtige Markdown-Vorschau-Anwendung für macOS. Die Suche nach dem einen liefert zuverlässig das andere.
