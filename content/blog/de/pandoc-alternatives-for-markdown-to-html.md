---
title: "Jede Pandoc-Alternative, die man kennen sollte, sortiert nach dem Grund Ihrer Suche"
description: "Pandoc ist bei DOCX, EPUB, Zitaten und gesetztem PDF unübertroffen. Wenn nur HTML herauskommen soll, hier die Alternativen, sortiert nach Ihrem Grund"
date: 2026-08-14
tag: Konvertieren
keywords: pandoc alternative, pandoc markdown zu html, markdown zu html ohne pandoc, pandoc ohne installation, pandoc eigenständiges html, markdown zu docx umwandeln, markdown zu pdf umwandeln
---

Niemand sucht nach einer Pandoc-Alternative, weil Pandoc schlecht wäre. Gesucht wird, weil jemand eine HTML-Datei wollte und sich plötzlich über Vorlagenvariablen belesen hat, oder weil die PDF-Option eine TeX-Distribution verlangte, oder weil es auf der Maschine, auf der das Dokument liegt, kein Terminal gibt. Das Werkzeug ist nicht das Problem. Der Abstand zwischen dem Werkzeug und der Aufgabe ist es.

### Kurzfassung

Pandoc ist die richtige Antwort, sobald etwas anderes als HTML aus der Pipeline kommt — DOCX, EPUB, LaTeX, ein gesetztes PDF, ein Literaturverzeichnis — und nichts anderes auf dieser Seite kommt darin heran. Wenn HTML die einzige Ausgabe ist, hängt die Alternative vom Grund Ihrer Suche ab: **ein Konverter im Browser**, wenn Sie keine Installation und eine fertige Datei wollen, **marked oder markdown-it**, wenn die Konvertierung in Code passiert, den Sie ohnehin ausführen, **eine gehostete API oder eine GitHub Action**, wenn sie in CI passiert und Sie keinen Installationsschritt im Runner wollen, **ein statischer Seitengenerator**, wenn die Antwort eine Website und kein Dokument ist. Der ehrliche Teil steht unten: vier Aufgaben, bei denen jeder Ersatz von hier scheitert und Sie stattdessen Pandoc installieren sollten.

## Die Reibung, genau benannt

Markdown mit Pandoc in HTML zu verwandeln ist eine Zeile. Dort liegen die Kosten nicht.

Die Kosten liegen in der zweiten Zeile. Ein nacktes `pandoc -t html` gibt ein Fragment zurück — Überschriften und Absätze ohne Doctype, ohne `<head>`, ohne alles, was ein Browser als Seite behandeln würde. `--standalone` behebt das, indem es Ihren Inhalt in Pandocs Standardvorlage verpackt, die absichtlich schlicht ist, und in dem Moment, in dem sie irgendwie aussehen soll, sind Sie bei `--css` für ein Stylesheet, `-V` für Vorlagenvariablen oder `--template` mit einer Datei in Pandocs eigener Vorlagensprache: `$body$`, `$for(author)$`, `$if(toc)$`. Kein anderes Werkzeug liest diese Datei. Sie ist jetzt Teil Ihres Builds, und jemand muss sie pflegen.

Dann ist da das Stylesheet-Problem. `--css` hinterlässt Ihnen eine HTML-Datei, die eine zweite Datei neben sich braucht, was genau falsch ist, wenn der Plan war, die Seite einer Kollegin zu mailen. Pandoc kann die Assets stattdessen einbetten, aber die Option, die das tut, wurde zwischen zwei Hauptversionen umbenannt, sehen Sie also in `pandoc --help` nach und nicht in einer Forumsantwort von vor vier Jahren.

Nichts davon ist schwierig. Es ist ein echtes Maß an Einrichtung für eine Seite, und dieses Maß schrumpft nicht, wenn die Aufgabe klein ist. Diese Asymmetrie ist der ganze Grund, aus dem es diesen Artikel gibt.

## Worin Pandoc unübertroffen ist

Seien wir zuerst fair zu ihm, denn die faire Darstellung ist auch die nützliche — sie sagt Ihnen, wann Sie aufhören können zu lesen.

Pandoc liest ein Dokument in eine interne Repräsentation und schreibt diese Repräsentation in einem anderen Format wieder heraus. Der Umweg ist der Trick: niemand musste einen Markdown-zu-DOCX-Konverter schreiben, denn jeder Leser kann jeden Schreiber beliefern. Diese einzige Entwurfsentscheidung ist der Grund, warum die Formatliste dutzende Einträge lang ist und warum kein kleineres Werkzeug sie je eingeholt hat.

**Eine Formatmatrix.** Eine Quelldatei, mehrere Ausgaben, im Gleichschritt gehalten. HTML für die Website, DOCX für den Prüfer, der in Word rot anstreicht, EPUB für die Leserin im Zug. Jede Alternative unten macht eine Ausgabe gut. Pandoc macht die Matrix.

**Wissenschaftliches Schreiben.** Mathematik, Querverweise, nummerierte Abbildungen und `--citeproc` mit einer BibTeX-Datei und einem CSL-Stil, sodass sich das Literaturverzeichnis in genau dem Hausstil formatiert, den die Zeitschrift verlangt. Nichts anderes in diesem Artikel hat überhaupt einen Zitationsprozessor.

**Word-Ausgabe in einem Hausstil.** `--reference-doc` übernimmt Schriften, Überschriftenstile und Abstände aus einer bestehenden `.docx` und wendet sie auf Ihre an. Wenn eine Vorlage aus einer Rechts- oder Marketingabteilung kam, ist diese Option der ganze Grund, Pandoc zu installieren.

**Filter.** Ein Lua- oder JSON-Filter schreibt das Dokument um, während es noch ein Baum ist — jede Tabelle neu nummerieren, einen Abschnitt entfernen, jeden internen Link umschreiben, jede Überschrift um eine Ebene anheben. Dasselbe mit einem regulären Ausdruck über dem fertigen HTML zu tun funktioniert genau so lange, bis es nicht mehr funktioniert.

```bash
pandoc -f gfm -t docx notes.md -o notes.docx
pandoc -f gfm -t epub book.md -o book.epub
pandoc -f gfm --citeproc --bibliography=refs.bib paper.md -o paper.pdf
```

Die dritte Zeile trägt einen Vorbehalt, den man kennen sollte, bevor man sie eintippt. Markdown zu PDF ist keiner von Pandocs Schreibern. Pandoc erzeugt ein PDF, indem es das Dokument an eine separate Engine übergibt, und die Voreinstellung ist eine TeX-Engine, diese Pipeline bedeutet also meist, auch eine TeX-Distribution zu installieren — eine viel größere Installation als Pandoc selbst und der häufigste Grund, aus dem jemand entscheidet, Pandoc sei mehr, als er wollte. `--pdf-engine` kann stattdessen auf eine HTML- oder Typst-basierte Engine zeigen, die weit kleiner ist und Mathematik und Seitenlayout anders behandelt.

## Der schnelle Vergleich: das Merkblatt

| Werkzeug | Am besten für | Entscheidende Fähigkeit | Preis |
| --- | --- | --- | --- |
| Pandoc | Jede Ausgabe außer HTML | Dutzende Formate, Vorlagen, Lua-Filter, `--citeproc` | Kostenlos, GPL |
| Pandoc in Docker | Die Matrix behalten, ohne sie zu installieren | Das offizielle Image, gegen ein eingebundenes Verzeichnis ausgeführt | Kostenlos, GPL |
| TransformPipe | Eine fertige Datei, keine Installation, kein Upload | Eigenständiges HTML mit eingebetteten Stilen, im Browser konvertiert | Kostenlos |
| Dillinger | Entwerfen, wo nichts installiert ist | Editor im Browser, HTML- und PDF-Export, Sync mit Drive und Dropbox | Kostenlos, MIT |
| StackEdit | Im Browser ohne Verbindung schreiben | Editor im Browser, arbeitet nach dem Laden offline, synchronisiert und veröffentlicht | Kostenlos, Apache 2.0 |
| Typora | Eine Desktop-Anwendung statt eines Befehls | WYSIWYG-Bearbeitung, Export als HTML, PDF und Word | 14,99 $ einmalig |
| Obsidian | Aus Notizen exportieren, die Sie schon führen | Lokaler Vault; PDF-Export in der App, HTML über Plugins | Kostenlos; optionale bezahlte kommerzielle Lizenz |
| VS Code | Die Datei konvertieren, die schon offen ist | Vorschau auf markdown-it-Basis, Export über Erweiterungen | Kostenlos |
| marked | Konvertierung in einer JavaScript-Anwendung | Klein, schnell, GFM von Haus aus | Kostenlos, MIT |
| markdown-it | Spezifikationstreue und Plugins | CommonMark-konform, maskiert rohes HTML standardmäßig | Kostenlos, MIT |
| remark / rehype | Das Dokument ändern, nicht nur ausgeben | Ein AST, den Sie durchlaufen können, dazu ein Bereiniger in der Pipeline | Kostenlos, MIT |
| Python-Markdown | Ein Python-Build-Skript | Ausgereifte Erweiterungs-API, die Engine unter MkDocs | Kostenlos, BSD |
| markdown-it-py | CommonMark in Python | Ein Port von markdown-it, dieselbe Plugin-Form | Kostenlos, MIT |
| mistune | Geschwindigkeit in Python | Reines Python, schnell, Plugin-basiert | Kostenlos, BSD |
| cmark-gfm | Ein winziges Binary in einem Build | GFM in C, Fragment heraus, keine Laufzeit zu installieren | Kostenlos, Open Source |
| Gehostete API, CLI, GitHub Action | CI ohne Installationsschritt | Konvertierung als Anfrage oder als Workflow-Schritt | Kostenloses Kontingent; Konto für Schlüssel nötig |
| Statische Seitengeneratoren | Eine Website statt eines Dokuments | Navigation, Vorlagen, Feeds, viele Seiten auf einmal | Kostenlos |
| GitHub-Markdown-API | GFM genau so darstellen, wie GitHub es tut | HTTP-Endpunkt, der ein HTML-Fragment zurückgibt | Kostenlos, ratenbegrenzt |

## Die Alternativen, nach dem Grund Ihrer Suche

Jeder Abschnitt unten antwortet auf einen anderen Satz. Finden Sie Ihren und überspringen Sie den Rest. Wenn Sie das weitere Feld wollen statt der Pandoc-förmigen Frage, behandelt [der vollständige Konvertervergleich](/blog/best-markdown-to-html-converters) dieselben Werkzeuge mit anderer Gewichtung.

### Pandoc selbst — die Messlatte, an der Sie messen

Ein eigener Abschnitt ist es wert, denn die Hälfte der Leute, die eine Alternative suchen, sucht eigentlich die Erlaubnis, dabei zu bleiben.

| Vorteile | Nachteile |
| --- | --- |
| Konvertiert zwischen Formaten, die sonst niemand anfasst | Ein Binary zum Installieren und ein Terminal zum Tippen |
| `--standalone` erzeugt ein ganzes Dokument, kein Fragment | Vorlagen sind eine Sprache, die nur Pandoc liest |
| Filter schreiben das Dokument als Baum um | Die PDF-Ausgabe braucht eine separate Engine, oft TeX |
| `--sandbox` beschränkt den Dateizugriff für Eingaben, denen Sie nicht trauen | Rohes HTML geht unverändert durch: kein Bereinigen |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- In Haskell geschrieben, als einzelnes Binary für die großen Plattformen verteilt
- Standardmäßig ein eigener erweiterter Dialekt, dazu CommonMark- und GFM-Leser, die eine Option auswählt
- `--standalone` für ein vollständiges Dokument; eine separate Option bettet Bilder und CSS ein
- `--citeproc`, `--bibliography` und CSL-Stile für Literaturangaben
- Lua- und JSON-Filter, um den abstrakten Syntaxbaum mitten in der Konvertierung umzuschreiben

**Wer sollte es verwenden?** Jeder, dessen Dokument etwas anderes werden muss als eine Webseite, jetzt oder in den nächsten Monaten. Die Vorlagensprache ist ein fairer Preis für die Formatmatrix. Für eine einzelne README ist sie ein schlechter Preis.

### TransformPipe — keine Installation, und eine Datei, die überall öffnet

Ein Konverter im Browser passt zu einem Dokument, das überhaupt nicht Teil eines Builds ist. Sie öffnen eine Seite, ziehen die `.md`-Datei darauf und laden HTML herunter. Es lohnt sich zu wissen, [welche Online-Konverter Ihre Datei hochladen und welche nicht](/blog/best-online-document-converters), bevor Sie einen auswählen. Abgemeldet wird nichts hochgeladen: die Datei wird auf Ihrem eigenen Rechner gelesen, geparst und dargestellt, was Sie bestätigen können, indem Sie dem Netzwerk-Tab dabei zusehen, wie er nichts tut, während gearbeitet wird.

| Vorteile | Nachteile |
| --- | --- |
| Nichts zu installieren, und kein Terminal | Ein Dokument auf einmal, oder mehrere zu einem verkettet — keine Website |
| Der Export ist eine eigenständige Datei mit eingebetteten Stilen | Keine Vorlagensprache, die Layouts sind also die angebotenen |
| Abgemeldet verlässt die Datei den Rechner nie | Der Browser macht die Arbeit, eine sehr große Datei begrenzt also der Rechner |
| Bereinigt gegen eine Positivliste, im Browser wie auf dem Server | Nichts außerhalb von HTML: kein DOCX, kein EPUB, kein gesetztes PDF |

**Preis:** kostenlos. Eine Anmeldung bringt Konvertierungsverlauf, Freigabelinks und API-Schlüssel und kostet ebenfalls nichts.

**Technische Details und Funktionen**

- Liest GitHub Flavored Markdown, Tabellen, Aufgabenlisten, Durchgestrichenes und eingezäunter Code überleben also
- Was heruntergeladen wird, ist eine ganze Seite: ein Doctype, ein `<head>`, das CSS in einem `<style>`-Block und keine einzige externe Anfrage
- Jedes rohe HTML in der Quelle wird unterwegs gegen eine feste Positivliste gefiltert
- Speichert als `.html`, `.md` oder reinen Text; ein PDF kommt aus dem Druckdialog des Browsers und nicht aus einer TeX-Engine
- Wandelt außerdem HTML, Word, CSV/TSV und JSON zurück nach Markdown
- Derselbe Konverter ist auf vier weiteren Wegen erreichbar: eine REST-API, ein CLI, eine GitHub Action und ein MCP-Server

**Wer sollte es verwenden?** Jeder, dessen nächster Schritt „das an eine Person schicken“ ist, und jeder auf einem Rechner, auf dem die Installation eines Binaries die Entscheidung von jemand anderem ist. Das ist der nächstliegende Ersatz für `pandoc --standalone --embed-resources`, ohne die Installation und ohne die Vorlage.

### Dillinger und StackEdit — wenn Sie den Text noch schreiben

Beide sind Markdown-Editoren im Browser mit Export, und beide sind die richtige Antwort auf eine andere Frage: nicht „diese Datei konvertieren“, sondern „dieses Dokument schreiben und am Ende HTML bekommen“. Dillinger exportiert HTML und PDF und synchronisiert mit Dropbox, Google Drive, OneDrive und GitHub. StackEdit arbeitet nach dem Laden ohne Verbindung weiter und veröffentlicht an mehrere Zielorte, wenn es eine hat.

| Vorteile | Nachteile |
| --- | --- |
| Schreiben und exportieren, ohne den Browser zu verlassen | Editor zuerst: keiner von beiden ist dafür gebaut, Dateien zu konvertieren, die Sie schon haben |
| Cloud-Sync mit den üblichen Orten | Das Dokument läuft durch einen gehosteten Dienst |
| Kostenlos und Open Source | Die Gestaltung des Exports ist die des Werkzeugs, nicht Ihre |
| StackEdit arbeitet nach dem Laden offline | StackEdits erweiterte Syntax kann schlecht zu anderen Parsern reisen |

**Preis:** kostenlos. Dillinger ist MIT-lizenziert; StackEdit ist Apache 2.0-lizenziert.

**Technische Details und Funktionen**

- Live-Vorschau neben der Quelle, mit den üblichen Annehmlichkeiten eines Editors
- Export als HTML und PDF aus dem Browser, keine lokale Installation
- Sync- und Veröffentlichungsziele, darunter Drive, Dropbox, OneDrive und GitHub
- Dokumente liegen im Browserspeicher oder im verbundenen Konto, standardmäßig nicht in Ihrem Dateisystem

**Wer sollte es verwenden?** Leute, die jetzt schreiben und nicht später konvertieren. Wenn die Datei schon auf der Platte liegt und Sie nur HTML daraus wollen, ist ein Konverter der kürzere Weg als ein Editor.

### Typora — eine Desktop-Anwendung statt eines Befehls

Die Antwort ohne Terminal für jemanden, der täglich Markdown schreibt. Typora ersetzt die Syntax beim Tippen durch ihre Darstellung, behält die Dateien auf Ihrer eigenen Platte und exportiert HTML, PDF und Word aus einem Menü.

| Vorteile | Nachteile |
| --- | --- |
| Angenehm, um darin stundenlang zu schreiben | Kostenpflichtig, und nur Desktop |
| Exportiert HTML, PDF und Word mit Themes | Kein Stapelwerkzeug und kein Build-Schritt |
| Dateien bleiben auf Ihrem Rechner | WYSIWYG verbirgt die Syntax, was manchen Schreibenden missfällt |

**Preis:** 14,99 $ ohne Steuer, ein Einmalkauf für bis zu drei Geräte, mit einer 15-tägigen kostenlosen Testphase (geprüft auf typora.io, 8. September 2026).

**Technische Details und Funktionen**

- WYSIWYG-Bearbeitung über einfachen `.md`-Dateien im lokalen Dateisystem
- Export als HTML, PDF, Word und mehrere weitere Formate über das Anwendungsmenü
- Themes sind CSS, die Gestaltung des Exports ist also ohne Vorlagensprache bearbeitbar
- Behandelt Tabellen, Fußnoten, Mathematik und Diagramme als Editor-Funktionen

**Wer sollte es verwenden?** Jeden, der täglich Markdown schreibt und eine Anwendung statt eines Befehls will. Es deckt Pandocs HTML-, PDF- und Word-Ausgaben für ein Dokument auf einmal ab, mit der Maus, und es deckt keine davon in einem Skript ab.

### Obsidian — aus den Notizen exportieren, die Sie schon führen

Kein Konverter, aber häufig der Grund, dass jemand keinen braucht: das Dokument liegt schon in einem Vault lokaler Markdown-Dateien, und der Export ist einen Menüpunkt entfernt. Der PDF-Export gehört zur Anwendung. Der HTML-Export kommt aus Community-Plugins, was ein echter Unterschied ist — das Kernprodukt verspricht ihn nicht.

| Vorteile | Nachteile |
| --- | --- |
| Lokale Dateien, kein Upload, funktioniert offline | Der HTML-Export hängt an einem Community-Plugin, nicht an der Kern-App |
| PDF-Export eingebaut | Wiki-Links und Einbettungen sind Obsidian-Syntax, nicht GFM |
| Kostenlos für private und kommerzielle Nutzung | Keine Pipeline: Exporte passieren, wenn ein Mensch klickt |

**Preis:** kostenlos für alle Zwecke, einschließlich kommerzieller Nutzung; optionale kommerzielle Lizenzen werden jährlich verkauft (geprüft auf obsidian.md, 8. September 2026).

**Technische Details und Funktionen**

- Vaults sind gewöhnliche Verzeichnisse von `.md`-Dateien, jedes andere Werkzeug kann sie also auch lesen
- `[[wiki links]]`, Einbettungen und Callouts sind Erweiterungen: prüfen Sie, was Ihr Ziel-Parser mit ihnen macht
- Das Plugin-Ökosystem deckt Export, Veröffentlichung und Seitengenerierung ab
- Nichts verlässt den Rechner, solange Sie keinen Sync- oder Veröffentlichungsdienst aktivieren

**Wer sollte es verwenden?** Leute, deren Markdown schon in einem Vault liegt. Die Warnung ist die Syntax: eine Notiz voller `[[wiki links]]`, von einem strengen GFM-Parser konvertiert, ergibt in der Ausgabe wörtliche doppelte Klammern, denn diese Klammern sind kein Markdown.

### VS Code — der kürzeste Weg, wenn die Datei schon offen ist

Der Vorschaubereich in VS Code ist darunter markdown-it, und der Export kommt über Erweiterungen und nicht vom Editor selbst. Für eine README, die schon in einem Tab liegt, schlägt das jede Installation.

| Vorteile | Nachteile |
| --- | --- |
| Für die meisten Entwickler schon installiert | Der Export braucht eine Erweiterung, und Erweiterungen schwanken in der Qualität |
| Das Vorschauverhalten entspricht markdown-its CommonMark-Umsetzung | Die Gestaltung der Vorschau ist nicht die des Exports |
| Erweiterungen decken HTML, PDF und Folien ab | Konvertiert, was offen ist: kein Stapel, kein Build |

**Preis:** kostenlos.

**Technische Details und Funktionen**

- Eingebaute Vorschau, dargestellt von markdown-it, mit für die Vorschau aktivierten GFM-Funktionen
- Export-Erweiterungen verpacken das Fragment in ein Dokument und betten ein Stylesheet ein oder verlinken es — was von beidem, hängt von der Erweiterung ab
- Arbeitsbereichseinstellungen können ein eigenes Vorschau-Stylesheet hinzufügen
- Nichts wird hochgeladen; die Konvertierung passiert im Prozess des Editors

**Wer sollte es verwenden?** Entwickler, die die Datei brauchen, die gerade im Editor liegt, und nichts darüber hinaus. Prüfen Sie, was die Erweiterung um das Fragment herum schreibt, bevor Sie das Ergebnis irgendjemandem schicken, denn „in der Vorschau sah es richtig aus“ ist nicht dieselbe Behauptung wie „es öffnet richtig auf dem Laptop von jemand anderem“.

### marked und markdown-it — der JavaScript-Weg

Wenn die Konvertierung in Code gehört, den Sie ohnehin ausführen, ist eine Bibliothek kleiner als ein Binary und leichter zu überblicken. marked ist klein und schnell, mit GFM standardmäßig an. markdown-it ist CommonMark-konform, hat ein strukturiertes Plugin-System und maskiert rohes HTML, solange Sie nichts anderes sagen — was die sicherere Voreinstellung der beiden ist.

| Vorteile | Nachteile |
| --- | --- |
| Eine Abhängigkeit, keine separate Installation zu dokumentieren | Beide geben ein Fragment zurück: die Verpackung ist Ihre Aufgabe |
| Das HTML um die Ausgabe herum ist HTML, das Sie geschrieben haben, keine geerbte Vorlage | Keine Formatmatrix — nur HTML |
| markdown-it maskiert rohes HTML standardmäßig | Die Qualität der Plugins schwankt über das Ökosystem hinweg |
| Läuft in Node und im Browser gleichermaßen | Syntaxhervorhebung und Bereinigen sind separate Entscheidungen |

**Preis:** kostenlos, beide MIT-lizenziert.

**Technische Details und Funktionen**

- marked: GFM als Voreinstellung, eigene Renderer pro Knotentyp, ein Lexer, den Sie für Token statt HTML aufrufen können
- markdown-it: besteht die CommonMark-Suite, `html: false` als Voreinstellung, Regeln hinzufügbar und umsortierbar
- Keiner von beiden bereinigt für Sie; die dokumentierte Antwort ist ein eigener Bereiniger über der Ausgabe
- Beide sind die Engine in größeren Werkzeugen, Fehlerberichte und Grenzfälle sind also gut bereist

**Wer sollte es verwenden?** Jedes Projekt, das schon einen Node-Build hat. [Der vollständige JavaScript-Vergleich](/blog/markdown-to-html-in-javascript) geht die Unterschiede sauber durch, und [Konvertieren aus dem Terminal](/blog/markdown-to-html-from-the-command-line) enthält das Skript für die Verpackung in ganzer Länge — etwa fünfzehn Zeilen, was das ehrliche Maß dafür ist, was Pandocs `--standalone` Ihnen wert ist.

### remark und rehype — wenn Sie das Dokument ändern müssen

Das unified-Ökosystem parst Markdown zu einem AST, lässt Sie ihn umschreiben und stellt dann dar. Es ist die einzige Alternative hier, die mit Pandocs Lua-Filtern konkurriert, und sie konkurriert gut.

| Vorteile | Nachteile |
| --- | --- |
| Ein echter Syntaxbaum, den Sie durchlaufen, abfragen und umschreiben können | Die schwerste Option auf dieser Seite |
| rehype-sanitize ist ein Schritt der Pipeline, kein nachträglicher Einfall | Die Pipeline erfordert echtes Lernen |
| Plugins für GFM, Frontmatter, Überschriften, Links | Überdimensioniert, um aus einer Datei eine Seite zu machen |
| Treibt MDX und Docusaurus an, ist also gut erprobt | Am Ende trotzdem nur HTML |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Zwei Baumformate — mdast für Markdown, hast für HTML — und ein Plugin, das eines in das andere umwandelt
- remark-gfm für Tabellen und Aufgabenlisten; remark-frontmatter für den YAML-Kopf
- Dieselben Bäume dienen dazu, Linter, Formatierer und Codemods über Prosa zu bauen
- Das Bereinigen passiert am Baum, bevor HTML existiert, was strenger ist als das Filtern von Zeichenketten

**Wer sollte es verwenden?** Teams, die das Dokument unterwegs verändern müssen: jeden relativen Link umschreiben, Überschriften für die Navigation herausziehen, einen Hausstil erzwingen. Wenn Sie zu einem Lua-Filter greifen wollten, ist das der Ersatz.

### Python-Markdown, markdown-it-py und mistune — der Python-Weg

Dieselbe Logik in einer anderen Sprache. Python-Markdown ist die ausgereifte Option mit einem großen Erweiterungskatalog und ist die Engine unter MkDocs. markdown-it-py ist ein Port von markdown-it, bringt also CommonMark-Treue und dieselbe Plugin-Form mit. mistune ist das schnelle.

| Vorteile | Nachteile |
| --- | --- |
| Naheliegend, wenn der Build schon Python ist | Fragment-Ausgabe in allen drei Fällen |
| Die Erweiterungs-API von Python-Markdown ist gut dokumentiert und weit verbreitet | Python-Markdown ist nicht in jeder Einzelheit CommonMark-konform |
| markdown-it-py gibt Ihnen Spezifikationstreue und ein bekanntes Plugin-Modell | Drei Bibliotheken heißt drei Mengen von Grenzfällen |
| mistune ist schnell genug für große Stapel | Syntaxhervorhebung und Bereinigen müssen Sie weiterhin selbst einrichten |

**Preis:** kostenlos. Python-Markdown ist BSD-lizenziert, markdown-it-py ist MIT-lizenziert, mistune ist BSD-lizenziert.

**Technische Details und Funktionen**

- Python-Markdown: offizielle Erweiterungen für Tabellen, Fußnoten, Attributlisten und Inhaltsverzeichnis
- markdown-it-py: ein Port des JavaScript-Parsers, verwendet, wo das CommonMark-Verhalten übereinstimmen muss
- mistune: reines Python mit einem Plugin-System, keine kompilierte Abhängigkeit
- Alle drei geben eine Zeichenkette zurück, die Verpackung des Dokuments ist also eine Vorlage in Ihrem eigenen Code

**Wer sollte es verwenden?** Python-Projekte, Dokumentations-Builds und alles, was ohnehin von PyPI importiert. Testen Sie zuerst ein Dokument mit einer Tabelle darin: die drei Bibliotheken sind sich über Tabellen nicht einig, denn Tabellen sind in allen dreien eine Erweiterung und keine Kernsyntax.

### cmark-gfm — das kleine Binary in einem Build

GitHubs Fork der CommonMark-Referenzimplementierung, in C geschrieben, um die GFM-Erweiterungen ergänzt. Es ist schnell, es hat keine Laufzeit, die daneben installiert werden müsste, und es gibt Ihnen ein Fragment ohne Gestaltung und ohne Verpackung.

| Vorteile | Nachteile |
| --- | --- |
| Winzig und schnell, ohne benötigte Sprachlaufzeit | Nur Fragment: nichts, was `--standalone` gleicht |
| Setzt die GFM-Erweiterungen um, Tabellen inbegriffen | Die Erweiterungen sind die mitgelieferten und keine weiteren |
| Sinnvoll in einem Makefile oder einem Container-Image | Sie kompilieren es oder finden ein Paket für Ihre Plattform |

**Preis:** kostenlos, Open Source — cmark ist BSD-lizenziert, und GitHubs Fork cmark-gfm trägt seinen eigenen Hinweis.

**Technische Details und Funktionen**

- CommonMark plus die GFM-Erweiterungen: Tabellen, Aufgabenlisten, Durchgestrichenes, Autolinks, Fußnoten als Option
- Eine C-Bibliothek und außerdem ein Binary für die Kommandozeile, es lässt sich also in andere Programme einbetten
- Optionen steuern die Behandlung von rohem HTML, was bei Eingaben zählt, denen Sie nicht trauen
- Keine Vorlagen, kein CSS, kein Einbetten von Assets — so gewollt

**Wer sollte es verwenden?** Builds, die ihr Layout schon selbst mitbringen und nur den Rumpf brauchen. Es ist das Nächste an Pandocs Geschwindigkeit und Ein-Binary-Bequemlichkeit, mit nichts von seiner Reichweite.

### Eine gehostete API, ein CLI oder eine GitHub Action — CI ohne Installationsschritt

Der CI-Fall ist ein eigenes Problem. Pandoc in einem Runner zu installieren ist ein Schritt, der bei jedem Job ein Binary herunterlädt, und TeX in einem Runner ist schlimmer. Die Alternativen sind eine Anfrage an eine API, ein CLI ohne Abhängigkeiten oder ein Workflow-Schritt, der die Konvertierung für Sie erledigt.

| Vorteile | Nachteile |
| --- | --- |
| Nichts im Runner installiert, also nichts zu cachen und nichts zu pinnen | Eine API bedeutet, dass das Dokument den Rechner verlässt |
| Ein Workflow-Schritt, und dieselbe Konvertierung wie auf der Webseite | Ein Schlüssel in den Repository-Secrets, der angelegt und rotiert werden muss |
| Die Ausgabe ist eine vollständige, eigenständige Datei, bereit zum Veröffentlichen | Nur HTML: ein Release, das ein PDF braucht, braucht weiterhin eine Engine |
| Das CLI hat keinen Abhängigkeitsbaum zu prüfen | Ein gehosteter Dienst ist eine Abhängigkeit, die Sie nicht kontrollieren |

**Preis:** kostenloses Kontingent; für die Ausgabe von API-Schlüsseln ist ein Konto erforderlich.

**Technische Details und Funktionen**

- REST-Endpunkt, der Markdown annimmt und ein vollständiges HTML-Dokument zurückgibt
- Ein CLI ohne Abhängigkeiten, für einen Runner, der eine Shell hat und sonst nichts
- Eine GitHub Action, um bei Push, bei Merge oder an einem Release-Tag zu konvertieren
- Ein MCP-Server, für den Fall, dass das Konvertierende ein Modell und kein Mensch ist

**Wer sollte es verwenden?** Jeden, der bei jedem Commit eine Seite neu baut. [Veröffentlichen aus einem Workflow](/blog/publish-markdown-from-github-actions) geht die Variante mit Pull Request durch, bei der die Ausgabe an den PR angehängt und nicht ausgerollt wird. Der Tausch bei der Privatsphäre ist echt und gehört klar gesagt: eine Konvertierung im Browser behält die Datei lokal, ein API-Aufruf nicht.

### Pandoc in Docker — die Installation überspringen, die Matrix behalten

*Pandoc ohne Installation* bedeutet meist eines von zwei Dingen. Das erste ist ein Web-Frontend, das Pandoc auf dem Server von jemand anderem ausführt, was für eine öffentliche README in Ordnung und für einen Vertragsentwurf falsch ist. Das zweite ist das offizielle Container-Image, das Ihren Rechner sauber hält und jedes Format behält.

```bash
docker run --rm -v "$PWD:/data" pandoc/core -f gfm -t html -s README.md -o README.html
```

| Vorteile | Nachteile |
| --- | --- |
| Die ganze Formatmatrix, nichts auf dem Host installiert | Sie haben stattdessen Docker installiert, was größer ist |
| Reproduzierbar: das Image pinnt die Version für alle | Eingebundene Volumes und Dateirechte werden Ihr Problem |
| Für die schwereren LaTeX-Pipelines gibt es Varianten-Images | Pro Lauf langsamer als ein lokales Binary |

**Preis:** kostenlos, GPL-lizenziert.

**Wer sollte es verwenden?** Teams, die ein gepinntes Pandoc über mehrere Rechner hinweg wollen, und jeden auf einem abgeriegelten Laptop, der Docker hat, aber keinen Paketmanager. Es ist die ehrliche Mitte: Sie überspringen die Installation, ohne Ihr Dokument einem Fremden zu übergeben.

### Statische Seitengeneratoren — die Antwort, wenn Sie eine Website wollten

Hugo, Eleventy, MkDocs, Docusaurus und Jekyll verwandeln alle Markdown in HTML, und keiner von ihnen ist ein Konverter in dem Sinne, den diese Seite meint. Jeder ist ein Build-System. Es will ein Verzeichnis, eine Konfigurationsdatei, einen Satz Vorlagen und ein Deploy-Ziel; im Austausch gibt es Navigation, Suche, Feeds und Querverweise über jede Seite auf einmal zurück.

| Vorteile | Nachteile |
| --- | --- |
| Navigation und Vorlagen über viele Dokumente hinweg | Viel zu viel Maschinerie für eine einzelne Datei |
| Schnelle Builds, gründliche Dokumentation, überall ausgerollt | Eine Konfigurationsdatei und ein Build-Schritt, die für immer am Leben bleiben müssen |
| Themes, Plugins und eine Geschichte für das Deployment | Die Ausgabe ist ein Verzeichnis von Seiten, keine Datei, die Sie mailen können |

**Preis:** kostenlos. Hugo ist Apache 2.0-lizenziert; Eleventy, Docusaurus und Jekyll sind MIT-lizenziert; MkDocs ist BSD-lizenziert.

**Technische Details und Funktionen**

- Jeder liefert eine Markdown-Engine mit: Goldmark in Hugo, markdown-it in Eleventy als Voreinstellung, Python-Markdown in MkDocs
- Frontmatter treibt Titel, Datumsangaben, Tags und die Reihenfolge der Navigation
- Die Ausgabe ist ein Verzeichnisbaum aus HTML mit gemeinsamem Beiwerk, gedacht zum Ausliefern
- Das Deployment gehört zum Modell: ein Build-Befehl und ein Host

**Wer sollte es verwenden?** Jeden, dessen Ausgabe ein Satz Seiten ist, die sich gegenseitig referenzieren. Eine Datei und ein Empfänger sind für einen Generator die völlig falsche Form — diese Aufgabe will ein Dokument und keine Website.

### GitHubs Markdown-API — GFM genau so dargestellt, wie GitHub es darstellt

Ein HTTP-Endpunkt, der Markdown annimmt und HTML zurückgibt. Es ist der einzige Weg zu GitHubs eigener Darstellung, ohne eine Seite abzuschaben, und die Ausgabe ist ein Fragment, um das nichts steht.

| Vorteile | Nachteile |
| --- | --- |
| Verhalten wie GitHub Flavored Markdown, Byte für Byte | Das Dokument wird zum Darstellen zu GitHub hochgeladen |
| Überhaupt keine Installation: eine HTTP-Anfrage | Ratenbegrenzt, und um die Grenze zu erhöhen ist Authentifizierung erforderlich |
| Nützlich, um zu überprüfen, was GFM wirklich tut | Fragment-Ausgabe, mit GitHubs Klassennamen an einigen Elementen |

**Preis:** kostenlos, ratenbegrenzt.

**Wer sollte es verwenden?** Jeden, der GitHubs Darstellung genau treffen muss, und niemanden, der eine fertige Seite braucht. Behandeln Sie es als eine Referenzimplementierung, die Sie aufrufen können, und nicht als Weg zum Export.

## Die Aufgaben, die wirklich Pandoc verlangen

Das ist der Abschnitt, den eine Vergleichsseite üblicherweise auslässt, hier also ohne die Abschwächungen. Vier Aufgaben sollten mit nichts von allem oben versucht werden.

**Alles mit einem Literaturverzeichnis.** Wenn das Dokument Quellen zitiert und die Zitate nach einem Stil formatiert sein müssen, ist `--citeproc` mit einer BibTeX-Datei und einem CSL-Stil das Werkzeug. Es gibt auf dieser Seite keinen Ersatz. Es von Hand zu tun heißt, eine Referenzliste zu pflegen, die veraltet, sobald ein Mitautor zum ersten Mal einen Abschnitt umstellt.

**Ein gesetztes PDF mit echtem Seitenlayout.** Hurenkinder, Schusterjungen, die Platzierung von Abbildungen, Seitenzahlen, Querverweise, die „siehe Seite 14“ sagen. Drucken-zu-PDF im Browser gibt Ihnen ein lesbares Dokument und kein gesetztes, denn der Browser legt eine Webseite an und schneidet sie dann in Seiten. Wenn die Ausgabe komponiert aussehen muss, ist Pandoc mit Übergabe an eine TeX- oder Typst-Engine der Weg, und die zusätzliche Installation ist der Preis.

**DOCX in der Vorlage von jemand anderem.** Wenn eine `.docx`-Vorlage mit vorgeschriebenen Schriften, Überschriftenstilen und Abständen ankommt, wendet `--reference-doc` sie an. Kein Markdown-zu-Word-Konverter, der diesen Schritt überspringt, erzeugt eine Datei, die der Eigentümer der Vorlage annimmt, und in Word von Hand neu zu formatieren ist eine Arbeit, die Sie im nächsten Quartal wieder machen.

**EPUB, LaTeX, reStructuredText, MediaWiki, Org und der Rest der Matrix.** In dem Moment, in dem zwei davon in derselben Anforderung auftauchen, ist die Diskussion vorbei. Werkzeuge für je einen Zweck zu verketten, um eine Matrix vorzutäuschen, heißt, dass jedes Format einen Grenzfall eines Werkzeugs vom Bruch entfernt ist, und die Brüche kommen einzeln.

Es gibt eine Sache, die Pandoc bewusst nicht tut, und sie schneidet in die andere Richtung: es bereinigt nicht. Rohes HTML in einer Markdown-Datei geht unverändert bis in die Ausgabe durch, `<script>`-Tags inbegriffen, denn treue Konvertierung ist die Aufgabe, für die es sich gemeldet hat. `--sandbox` beschränkt den Dateizugriff während der Konvertierung, was ein anderer Schutz ist. Wenn die Datei von außen kam — von einem Kunden, aus einem Repository, aus einer Formularübermittlung — brauchen Sie einen eigenen Bereinigungsschritt, und [warum das an mehr als einer Stelle passieren muss](/blog/sanitising-markdown-safely) ist zehn Minuten wert, bevor Sie das Ergebnis in einem Browser öffnen.

## Wie Sie wählen

1. **Schreiben Sie jedes Ausgabeformat auf, das dieses Dokument in seinem Leben erzeugen muss.** Wenn DOCX, EPUB, LaTeX oder ein gesetztes PDF auf dieser Liste auftaucht, installieren Sie Pandoc und hören Sie auf zu vergleichen; jede Stunde in einem Ersatz ist eine Stunde in einem Werkzeug, das Sie ersetzen werden.
2. **Entscheiden Sie, ob der Zielort ein Mensch oder ein Server ist.** Ein Mensch braucht eine eigenständige Datei, die mit abgeschaltetem Netz öffnet. Ein Server braucht ein Fragment, das Ihre Vorlagen verpacken. Die falsche Wahl erzeugt entweder unformatierten Text in jemandes Postfach oder ein Dokument mit zwei Kopien des Seitenmobiliars.
3. **Zählen Sie die Installationen, die die Aufgabe tragen kann.** Eine einmalige Konvertierung sollte keinen Paketmanager verlangen; ein nächtlicher Build sollte keinen Browser-Tab und keinen Menschen darin verlangen. Beide Fehler sind häufig und beide sind im Rückblick offensichtlich.
4. **Prüfen Sie, wohin die Datei geht, bevor Sie sie konvertieren.** Konvertierung im Browser behält das Dokument auf Ihrem Rechner, und das können Sie im Netzwerk-Tab überprüfen. Eine API, ein gehosteter Editor und GitHubs Markdown-Endpunkt bedeuten alle, dass das Dokument reist, was bei einer öffentlichen README irrelevant und bei einem Vertrag entscheidend ist.
5. **Konvertieren Sie eine repräsentative Datei und öffnen Sie das Ergebnis woanders.** Nicht in der Vorschau des Werkzeugs — in einem anderen Browser, auf einem anderen Rechner, ohne Verbindung. Dieser eine Test fängt Fragmente, fehlende Stylesheets, CDN-Links auf Webschriften und verlorene Tabellen auf einmal, und er dauert etwa eine Minute.

## Fazit

Der Grund, warum „Pandoc-Alternative“ eine so häufige Suche ist, liegt darin, dass Pandoc eine größere Frage beantwortet als die, die die meisten Leute stellen, und eine größere Frage zu beantworten kostet immer mehr. Wenn das Dokument eine Word-Datei, ein EPUB oder ein gesetztes PDF werden muss, installieren Sie Pandoc und lernen Sie seine Vorlagen — es wird jedes andere hier genannte Werkzeug überdauern. Wenn HTML die einzige Ausgabe ist, wählen Sie nach dem Grund, aus dem Sie gekommen sind: eine Bibliothek, wo der Build schon wohnt, ein Workflow-Schritt, wo CI schon läuft, ein Generator, wenn die Antwort eine Website ist, und ein Konverter im Browser, wenn Sie eine fertige Datei wollen, ohne dass irgendjemandes Installation im Weg steht — was [die Markdown-zu-HTML-Konvertierung von TransformPipe](/) leistet, kostenlos, in Ihrem eigenen Browser, ohne Upload, solange Sie abgemeldet sind.

## FAQ

### Was ist die beste Pandoc-Alternative für Markdown zu HTML?

Es gibt keine einzige, denn Pandoc deckt mehrere Aufgaben gleichzeitig ab. Für eine fertige Seite ohne Installation ein Konverter im Browser, der eigenständiges HTML erzeugt; für die Konvertierung in Code marked oder markdown-it; für CI eine API oder eine GitHub Action; für eine ganze Website ein statischer Seitengenerator. Jedes ersetzt einen Teil dessen, was Pandoc tut, und keines ersetzt die Formatmatrix.

### Kann ich Pandoc ohne Installation verwenden?

Ja, auf zwei Wegen mit unterschiedlichen Kompromissen. Das offizielle Docker-Image führt das echte Pandoc aus, ohne dass außer Docker etwas auf dem Host installiert ist, und behält Ihr Dokument lokal. Ein gehostetes Web-Frontend führt ebenfalls Pandoc aus, aber auf dem Rechner von jemand anderem, die Datei wird also hochgeladen — in Ordnung für eine öffentliche README, falsch für alles Vertrauliche.

### Ist Pandoc überdimensioniert, um eine Markdown-Datei in HTML zu verwandeln?

Meist ja. Eine nackte Konvertierung gibt ein Fragment zurück, Sie brauchen also `--standalone`, und diese Ausgabe irgendwie aussehen zu lassen bedeutet eine Option für ein Stylesheet, Vorlagenvariablen oder eine Vorlagendatei in Pandocs eigener Sprache. Für eine Seite, die jemand lesen muss, überspringt ein Konverter, der ein vollständiges, eigenständiges Dokument zurückgibt, das alles.

### Warum hat mein Pandoc-HTML keine Gestaltung?

Weil Sie `--standalone` nicht übergeben haben, oder weil Sie es getan und die Standardvorlage bekommen haben, die absichtlich schlicht ist. Fügen Sie mit `--css` ein Stylesheet hinzu, und Sie haben jetzt zwei Dateien, die zusammen reisen müssen; betten Sie die Assets stattdessen ein, wenn die Datei allein öffnen muss. Diese Lücke zwischen „konvertiert“ und „vorzeigbar“ ist der häufigste Grund, aus dem Leute anfangen, nach einer Alternative zu suchen.

### Was ersetzt Pandocs Lua-Filter?

remark und das unified-Ökosystem, näher als alles andere. Beide parsen das Dokument in einen Syntaxbaum, den Sie vor dem Darstellen umschreiben können, was dieselbe Form von Lösung ist — den Baum umschreiben, nicht die Zeichenkette der Ausgabe. Der Unterschied ist, dass Pandocs Baum jedes Format umspannt, das es unterstützt, während remarks Baum Markdown und HTML abdeckt.

### Beherrschen die Alternativen Tabellen und Aufgabenlisten?

Nur wenn sie GitHub Flavored Markdown umsetzen, denn Tabellen und Aufgabenlisten stehen nicht in der CommonMark-Spezifikation. marked, cmark-gfm und ein GFM-konfiguriertes markdown-it tun es; ein strenger CommonMark-Parser stellt Ihre Tabelle als Absatz voller Pipe-Zeichen dar und meldet überhaupt keinen Fehler. Konvertieren Sie eine Datei mit einer Tabelle darin, bevor Sie sich auf ein Werkzeug dieser Seite festlegen.

### Ist ein Konverter im Browser für ein vertrauliches Dokument sicher?

Das hängt vollständig davon ab, ob die Konvertierung im Browser oder auf einem Server passiert, und von außen sehen die beiden identisch aus. Ein Konverter auf Browser-Seite liest die Datei mit der File API und sendet sie nie, was Sie überprüfen können, indem Sie den Netzwerk-Tab öffnen und zusehen, wie nichts passiert. Alles, was Ihnen einen Fortschrittsbalken zeigt, während ein Server arbeitet, hat Ihr Dokument.
