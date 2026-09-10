---
title: "So öffnen Sie eine .md-Datei unter Windows, macOS, Linux, iOS und Android"
description: "Eine .md-Datei ist reiner Text — darum öffnet ein Doppelklick einen Code-Editor oder nichts: wie Sie sie als Text oder dargestellt lesen und die Standard-App setzen"
date: 2026-09-02
tag: Konvertieren
keywords: md datei öffnen, was ist eine md datei, md datei öffnen windows, markdown datei öffnen, md datei anzeigen, md viewer online, md datei im browser öffnen, markdown datei lesen, md datei öffnen handy
---

Sie haben eine Datei namens `README.md` heruntergeladen, doppelt angeklickt, und es passierte etwas Unbrauchbares. Ein Code-Editor ging auf. Oder Windows bot eine Liste von Programmen an, von denen Sie nie gehört haben. Oder Sie bekamen ein nüchternes Fenster voller Rautezeichen und Sternchen. Oder es passierte überhaupt nichts, und Ihr Telefon sagte, keine App könne diese Datei öffnen.

Die Datei ist nicht kaputt und sie ist nicht beschädigt. Kein Betriebssystem bringt eine Anwendung mit, die Markdown als Markdown darstellt, und diese eine Tatsache erklärt jede Variante des Problems — die falsche Anwendung, keine Anwendung und die Anwendung, die sie öffnet und Ihnen Satzzeichen statt Formatierung zeigt.

Es gibt zwei verschiedene Dinge, die Sie wollen könnten, und die meisten Ratschläge im Netz vermischen sie. Sie wollen vielleicht sehen, was in der Datei steht — das kann jeder Rechner, den Sie besitzen, bereits. Oder Sie wollen sie als Dokument lesen, mit echten Überschriften, Fettschrift und Tabellen, und dafür braucht es etwas zusätzlich. Der Weg unterscheidet sich danach, was von beidem Sie suchen, und auf einem Telefon unterscheidet er sich noch einmal.

### Kurzfassung

Eine `.md`-Datei ist reiner Text, also öffnet sie alles, was eine Textdatei öffnet: der Editor unter Windows, TextEdit unter macOS, `less` unter Linux. Wenn Sie solche Dateien regelmäßig lesen und schreiben, ist [ein Markdown-Editor](/blog/best-markdown-editors) die bessere Antwort. Dieser Weg zeigt Ihnen die Quelle, Satzzeichen inklusive. Um sie stattdessen als formatiertes Dokument zu lesen, ziehen Sie sie in einen Betrachter im Browser, installieren einen Editor mit Vorschau wie VS Code oder Obsidian, oder schieben sie zu GitHub. Wenn Sie sie jemand anderem schicken müssen, hören Sie auf, einen Betrachter zu suchen, und wandeln Sie sie einmal in HTML um — eine `.html`-Datei öffnet auf jedem Gerät mit einem Browser per Doppelklick, was für `.md` nirgends gilt.

## Was ist eine .md-Datei?

Reiner Text. Das ist die ganze Antwort.

Öffnen Sie eine im Editor, und Sie sehen jedes Zeichen, das sie enthält. Es gibt keine verborgene Formatierung, keine Binärdaten, keine Kompression, nichts, was ein besonderes Programm erst entschlüsseln müsste. Eine `.docx`-Datei ist ein Zip-Archiv voller XML und wäre in einem Texteditor unlesbar; eine `.md`-Datei ist genau das, wonach sie aussieht. Die Dateiendung `.md` sagt nur, welcher Konvention der Text folgt: Markdown, ein kleiner Satz Regeln, um Formatierung mit gewöhnlichen Satzzeichen zu schreiben.

```markdown
## Versionshinweise

**Version 2** behebt das Anmelde-Timeout.

- Schnellerer Start
- Neue Export-Schaltfläche

| Plattform | Status |
| --- | --- |
| Windows | Ausgeliefert |
| macOS | In Prüfung |
```

Jedes `#` markiert eine Überschrift, und mehr davon machen eine kleinere. Sternchen machen Text fett. Bindestriche machen eine Liste. Pipes machen eine Tabelle. Backticks zäunen Code ein. Jemand hat es so geschrieben, damit ein Programm daraus später ein formatiertes Dokument machen kann, aber der rohe Text bleibt für sich lesbar — das ist der größte Teil des Sinns von Markdown und der Grund, warum es in READMEs, Änderungsprotokollen, Notizanwendungen und der Ausgabe jedes KI-Assistenten auftaucht.

Denselben Inhalt sehen Sie unter anderen Endungen. `.markdown`, `.mdown`, `.mkd` und `.mdwn` sind dasselbe mit einem längeren oder älteren Namen; sie öffnen genauso und bedeuten nichts anderes. `.mdx` ist Markdown mit eingemischten JavaScript-Komponenten, also weiterhin Text, aber es wird Tags enthalten, die kein einfacher Betrachter darstellt. `.rmd` ist R Markdown, mit ausführbaren Code-Abschnitten. Wenn Sie eine davon haben, gilt alles Folgende zum Lesen weiterhin — nur die zusätzliche Syntax wird sonderbar aussehen.

Worüber Leute am ehesten stolpern, ist der Kopf. Dateien, die aus einem statischen Seitengenerator, einem Dokumentations-Build oder einer Notizanwendung exportiert wurden, beginnen oft mit einem Block, der von drei Bindestrichen eingezäunt ist:

```markdown
---
title: Quartalsplan
author: Priya
date: 2026-08-14
---
```

Das ist YAML-Frontmatter: Metadaten für das Werkzeug, das die Seite gebaut hat, kein Teil des Dokuments. Manche Betrachter verbergen es, manche stellen es oben als Absatz aus `key: value`-Zeilen dar, und ein paar machen eine Tabelle daraus. Keines davon ist ein Fehler. Es lohnt sich, das zu erkennen, denn ein Dokument, das mit scheinbarem Unsinn beginnt, ist meist einfach eine Datei aus einem Generator.

## Warum ein Doppelklick etwas Sonderbares tut

Jedes Desktop-Betriebssystem wählt das Programm zum Öffnen einer Datei anhand der Dateiendung, und jedes scheitert anders, wenn diese Endung von nichts richtig beansprucht wird.

**Windows bringt nichts mit, das `.md` registriert.** Also gewinnt, was sich zuletzt installiert und die Hand gehoben hat. Auf einem Arbeitsgerät ist das meist ein Code-Editor, ein Git-Client oder irgendein Werkzeug, das mit der Werkzeugkette für Entwickler mitkam — und wenn nichts die Endung beansprucht hat, bekommen Sie den Dialog „Wie möchten Sie diese Datei öffnen?" mit einer Liste von Anwendungen und ohne jeden Hinweis, welche die richtige ist. Keines der beiden Ergebnisse sagt etwas über Ihre Datei.

**macOS fällt auf TextEdit zurück**, das sie bereitwillig öffnet und Ihnen die Quelle zeigt. Das sieht wie ein Fehlschlag aus und ist keiner: TextEdit tut genau seine Aufgabe, nämlich Text anzuzeigen. Wählen Sie die Datei aus und drücken Sie die Leertaste für Quick Look, dann bekommen Sie im Allgemeinen dasselbe — die Zeichen, nicht die Formatierung.

**Linux hängt von Ihrem Desktop ab.** Der MIME-Typ der Datei wird meist als `text/markdown` erkannt, und ob überhaupt etwas als Handler für diesen Typ registriert ist, unterscheidet sich je Distribution. Sie können prüfen, was Ihr System zu haben glaubt:

```bash
xdg-mime query filetype notes.md
xdg-mime query default text/markdown
```

Das erste gibt den Typ aus, das zweite den Desktop-Eintrag, der sie öffnen wird — oder gar nichts, wenn keine Anwendung sie beansprucht hat.

**Telefone sind strenger als alle davon.** iOS und Android entscheiden ebenfalls anhand des Typs, was mit einer Datei zu tun ist, und wenn keine installierte App Unterstützung für Markdown erklärt, bietet das Menü zum Teilen einfach nichts Nützliches an. Android sagt oft geradeheraus, keine App könne die Datei öffnen. Hier geben die meisten Leute auf, und hier lässt sich das am leichtesten beheben, denn auf einem Telefon ist der Browser fast immer die Antwort.

Ein Code-Editor, der Ihre Besprechungsnotizen öffnet, ist kein Zeichen dafür, dass die Datei Code enthält. Es heißt, dieser Editor war das Letzte, was die Dateiendung beansprucht hat. Solche Notizen kommen meist aus einem Export, und die lange ID im Dateinamen oder der Ordner mit Bildern neben der Datei ist der Hinweis: [was Notion, Obsidian und Confluence jeweils erzeugen](/blog/markdown-from-notion-obsidian-and-confluence) entscheidet, ob diese Bilder noch funktionieren, sobald die Datei irgendwohin umzieht.

## Die Quelle lesen oder die Darstellung lesen

Bevor Sie etwas installieren, entscheiden Sie, was von beidem Sie wollen. Das sind verschiedene Probleme mit verschiedenen Werkzeugen.

**Die Quelle lesen** heißt, die Zeichen so anzusehen, wie sie geschrieben sind: `## Überschrift`, `**fett**`, die Pipes einer Tabelle. Für eine kurze Datei ist das völlig in Ordnung und oft besser — Sie sehen genau, was da steht, einschließlich der Linkziele, die eine dargestellte Ansicht hinter dem Linktext verbirgt. Jeder Rechner, den Sie besitzen, kann das bereits, und es ist nichts zu installieren.

**Die Darstellung lesen** heißt, die Formatierung angewandt zu sehen: Überschriften in größerer Schrift, Fettes als fett, Listen eingerückt, Tabellen als Gitter, Code in einem Block mit gleicher Zeichenbreite. Das wollen Sie für ein langes Dokument, denn jenseits von zwei Bildschirmen beginnen die Satzzeichen mit den Wörtern zu konkurrieren. Verschachtelte Listen sind der klarste Fall: drei Ebenen Einrückung mit gemischten Aufzählungszeichen und Nummern sind als roher Text schwer im Kopf zu behalten und dargestellt sofort offensichtlich.

Es gibt ein drittes Ding, das mit beiden verwechselt wird, und es ist das, was Leute überraschend oft tatsächlich brauchen: **daraus eine Datei machen, die jemand anderes öffnen kann**. Das ist Konvertierung, nicht Betrachtung, und es kommt weiter unten. Wenn Ihr eigentliches Problem darin besteht, dass ein Kollege die `.md`-Datei nicht öffnen kann, die Sie ihm geschickt haben, hilft kein Betrachter auf dieser Seite — er braucht eine andere Datei, keine andere Anwendung.

## Der schnelle Vergleich: alle Wege, eine .md-Datei zu öffnen

| Möglichkeit | Am besten für | Was Sie sehen | Preis |
| --- | --- | --- | --- |
| Editor, TextEdit, jeder Texteditor | Prüfen, was die Datei tatsächlich enthält | Die Quelle, mit allen Satzzeichen | Kostenlos, schon installiert |
| TransformPipe im Browser | Die Darstellung lesen und eine Datei herausbekommen | Ein formatiertes Dokument, auf Ihrem eigenen Rechner umgewandelt | Kostenlos |
| Markdown-Browser-Erweiterung | Lokale `.md`-Dateien häufig im Browser öffnen | Eine dargestellte Seite unter einer `file://`-URL | Kostenlos, MIT |
| VS Code | Entwickler, deren Datei schon im Editor liegt | Quelle und Vorschau nebeneinander | Kostenlos |
| Obsidian | Regelmäßig einen ganzen Ordner Markdown lesen | Dargestellte Notizen; die Dateien bleiben auf der Platte reiner Text | Kostenlos für private, kommerzielle und gemeinnützige Nutzung |
| MarkText | Ein einfacher Desktop-Leser ohne Konto | Dargestellt beim Tippen | Kostenlos, MIT |
| Typora | Täglich Markdown schreiben und lesen | Die Darstellung ersetzt die Quelle an ihrer Stelle | 14,99 $ ohne Steuer, für bis zu 3 Geräte (geprüft auf typora.io, 8. September 2026) |
| GitHub, GitLab, Gist | Dateien, die schon in einem Repository liegen | GFM dargestellt in der Weboberfläche | Kostenlos |
| `less`, `bat`, `glow` | Ein Terminal, ein Server, gar kein Desktop | Text, oder eine im Terminal gezeichnete Darstellung | Kostenlos, Open Source |
| Markor, Obsidian, Working Copy | Android und iOS, offline | Dargestellte Vorschau auf dem Gerät | Markor und Obsidian kostenlos; manche iOS-Editoren kostenpflichtig |
| Pandoc | Zuerst ein anderes Format daraus erzeugen | Nichts — es schreibt eine Datei, die Sie dann öffnen | Kostenlos, GPL |

## Eine .md-Datei öffnen, Plattform für Plattform

### Windows

Jeder Windows-Rechner kann Ihnen den Text ohne Installation zeigen:

| Weg | Das tun | Ergebnis |
| --- | --- | --- |
| Editor | Rechtsklick auf die Datei, Öffnen mit, Editor | Die Quelle |
| Eingabeaufforderung | `type notes.md` | Die Quelle, ausgegeben |
| PowerShell | `Get-Content notes.md` | Die Quelle, ausgegeben |
| Editor von der Kommandozeile | `notepad notes.md` | Die Quelle, in einem Fenster |

Um die Darstellung zu lesen, ist der kürzeste Weg ohne Installation ein Browser: einen Betrachter im Browser öffnen und die Datei auf die Seite ziehen. Wenn Sie oft genug Markdown lesen, dass der Doppelklick zählt, installieren Sie einen Editor mit Vorschau und setzen dann die Standardanwendung, damit Windows aufhört zu fragen.

**Die Standardanwendung unter Windows ändern.** Rechtsklick auf die Datei, Öffnen mit wählen, dann Andere App auswählen, das Programm wählen und das Kästchen ankreuzen, das die Wahl dauerhaft macht. Wenn die gewünschte Anwendung nicht aufgeführt ist, nehmen Sie „Andere App auf diesem PC suchen" und zeigen Windows die ausführbare Datei. Es geht auch über die Einstellungen: Apps, dann Standard-Apps, dann nach dem Dateityp `.md` suchen und dort den Handler setzen. Der zweite Weg ist der, den man nimmt, wenn die Endung von etwas beansprucht wurde, das Sie seither deinstalliert haben, sodass die Verknüpfung ins Nichts zeigt.

### macOS

TextEdit ist ohnehin der Rückfall, ein Doppelklick zeigt Ihnen also meist die Quelle. Aus einem Terminal:

| Weg | Das tun | Ergebnis |
| --- | --- | --- |
| TextEdit | Rechtsklick, Öffnen mit, TextEdit | Die Quelle |
| Terminal | `open -e notes.md` | Die Quelle, in TextEdit |
| Terminal | `less notes.md` | Die Quelle, seitenweise |
| Quick Look | Datei auswählen, Leertaste drücken | Der Text, nicht die Formatierung |

Eine macOS-eigene Falle: TextEdit lässt sich so einstellen, dass es Dateien als formatierten Text behandelt, und wenn das so eingestellt ist, kann es anbieten, das Geöffnete umzuwandeln oder neu zu formatieren. Lesen ist so oder so gefahrlos, aber speichern Sie nicht aus TextEdit, solange Sie nicht sicher sind, dass es im Modus für reinen Text läuft, denn eine als RTF gespeicherte `.md`-Datei ist keine `.md`-Datei mehr.

**Die Standardanwendung unter macOS ändern.** Wählen Sie die Datei aus, drücken Sie Command-I für Informationen, öffnen Sie den Abschnitt „Öffnen mit", wählen Sie die Anwendung und klicken Sie dann auf „Alle ändern", damit die Einstellung für jede `.md`-Datei gilt und nicht nur für diese eine. Der Klick auf „Alle ändern" ist der Teil, den Leute übersehen; ohne ihn gilt die Einstellung für eine Datei, und der nächste Download überrascht Sie erneut.

### Linux

Der Editor Ihres Desktops öffnet sie — GNOME Text Editor, Kate, Mousepad, was Ihre Distribution eben mitbringt — und alles im Terminal ebenfalls:

| Weg | Das tun | Ergebnis |
| --- | --- | --- |
| Seitenweise | `less notes.md` | Die Quelle, seitenweise, mit `/` durchsuchbar |
| Ausgeben | `cat notes.md` | Die Quelle, alles auf einmal |
| Syntaxhervorhebung | `bat notes.md` | Die Quelle mit hervorgehobenem Markdown |
| Darstellung im Terminal | `glow notes.md` | Überschriften, Listen und Tabellen als Text gezeichnet |

`glow` ist das Interessante, wenn Sie im Terminal wohnen: es stellt Markdown im Terminal selbst dar, Sie bekommen also Formatierung ohne irgendeine grafische Anwendung. Es ist kostenlos und MIT-lizenziert. `bat` stellt nicht dar, es färbt die Quelle, was ein kleinerer Gewinn ist, bei langen Dateien aber nützlich.

**Die Standardanwendung unter Linux ändern.** Nehmen Sie im Dateimanager Eigenschaften, Reiter Öffnen mit, oder setzen Sie es von der Kommandozeile:

```bash
xdg-mime default org.gnome.TextEditor.desktop text/markdown
```

Setzen Sie den Desktop-Eintrag der Anwendung ein, die Sie haben wollen. Wenn `xdg-mime query filetype` etwas anderes als `text/markdown` meldet — `text/plain` ist häufig —, setzen Sie die Voreinstellung stattdessen für diesen Typ, sonst wird Ihre Einstellung scheinbar nichts tun.

### iOS und iPadOS

Es gibt kein Dateisystem, auf das man rechtsklicken kann, die Möglichkeiten sind also enger und die Reihenfolge zählt. Probieren Sie sie in dieser Folge:

1. **Tippen Sie die Datei in Dateien an.** Quick Look zeigt oft den Text. Das beantwortet die Frage für eine kurze Datei und kostet nichts.
2. **Öffnen Sie sie in einem Betrachter im Browser.** Safari und Chrome unter iOS können beide über die Dateiauswahl einer Seite eine Datei aus Dateien holen, ein Betrachter, der im Browser läuft, funktioniert auf einem Telefon also genauso wie auf einem Laptop. Das ist der einzige Weg, der überhaupt keine Installation braucht und Ihnen trotzdem Formatierung gibt.
3. **Installieren Sie eine App, die Markdown erklärt.** Obsidian ist kostenlos und liest einen Ordner mit `.md`-Dateien direkt. Working Copy ist ein Git-Client, der Repositories durchblättert und Markdown in der Vorschau zeigt; die Installation ist kostenlos, mit einer kostenpflichtigen Freischaltung, deren Preis im App Store steht.
4. **Benennen Sie sie in `.txt` um.** Grob, wirksam, und es lässt Quick Look und jede Textanwendung sie als Text behandeln. Behalten Sie eine Kopie unter dem ursprünglichen Namen, falls die Datei danach noch irgendwohin geht.

### Android

Android ist die Plattform, die am ehesten geradeheraus ablehnt, und auch die, die sich am leichtesten beheben lässt:

1. **Probieren Sie das eingebaute Textanzeigeprogramm Ihres Dateimanagers.** Manche bringen eines mit, manche nicht.
2. **Installieren Sie Markor.** Es ist ein Texteditor für Android, kostenlos und Apache-2.0-lizenziert, verfügbar über F-Droid und GitHub. Es speichert Dateien auf dem Gerät als reinen Text, es wird also nichts hinter Ihrem Rücken in ein proprietäres Format umgewandelt, und es zeigt Markdown als formatierte Ausgabe in der Vorschau.
3. **Nehmen Sie einen Betrachter im Browser.** Chrome unter Android kann der Dateiauswahl einer Seite eine lokale Datei übergeben, das gibt Ihnen ein dargestelltes Dokument, ohne etwas zu installieren.
4. **Benennen Sie sie in `.txt` um.** Derselbe Trick, derselbe Vorbehalt.

Google Drive zeigt außerdem den Inhalt einer Textdatei an, die dort liegt, was zu wissen sich lohnt, wenn die Datei als Drive-Link statt als Download kam.

## Die Möglichkeiten, eine nach der anderen

### Der Texteditor, den Sie schon haben — am besten, um herauszufinden, was Sie da haben

Editor, TextEdit, GNOME Text Editor, Kate, `less`, `nano`. Jedes davon öffnet eine `.md`-Datei korrekt, sofort, ohne dass etwas heruntergeladen wird.

| Vorteile | Nachteile |
| --- | --- |
| Auf jedem Rechner schon installiert | Keine Formatierung: Sie lesen die Satzzeichen |
| Zeigt die Datei genau so, wie sie ist, samt Linkzielen und Frontmatter | Lange Dokumente mit verschachtelten Listen werden schwer zu verfolgen |
| Kann nichts verstümmeln, solange Sie nicht speichern | Keine Tabellendarstellung, eine breite Tabelle ist also eine Wand aus Pipes |

**Preis:** kostenlos, schon installiert.

**Technische Details und Funktionen**

- Verkraftet jeden Markdown-Dialekt, weil er nichts parst
- Zeigt YAML-Frontmatter, HTML-Kommentare und rohes HTML, die dargestellte Ansichten verbergen können
- Suche in der Datei: `Ctrl-F` in einem Editor, `/` in `less`
- Gefahrlos für alles, weil nichts in der Datei ausgeführt oder abgerufen wird

**Wer sollte es verwenden?** Alle, zuerst. Öffnen Sie die Datei in einem Texteditor, bevor Sie entscheiden, dass Sie ein Werkzeug brauchen. Die Hälfte der Zeit ist die Datei vierzig Zeilen lang und Sie haben Ihre Antwort in zehn Sekunden.

### TransformPipe im Browser — am besten, um die Darstellung ohne Installation zu lesen

Ziehen Sie die `.md`-Datei auf die Seite und lesen Sie sie als Dokument. Es läuft im Browser: abgemeldet wird die Datei nirgendwohin hochgeladen, was zählt, wenn das Dokument ein Vertragsentwurf oder ein internes Betriebshandbuch ist und nicht eine öffentliche README.

| Vorteile | Nachteile |
| --- | --- |
| Keine Installation, kein Konto, funktioniert auf dem Telefon wie auf dem Laptop | Braucht einen Browser-Tab, ist also kein Handler für den Doppelklick |
| Abgemeldet wird nichts hochgeladen | Ein Dokument auf einmal, oder mehrere zu einem verkettet |
| Stellt GitHub Flavored Markdown dar, Tabellen und Aufgabenlisten erscheinen also als Tabellen und Aufgabenlisten | Kein Editor: es liest und wandelt um, es hilft Ihnen nicht beim Schreiben |
| Exportiert eine eigenständige HTML-Datei, wenn Sie das Dokument weitergeben müssen | |

**Preis:** kostenlos. Ein Konto bringt Verlauf, Freigaben und eine API, ebenfalls kostenlos.

**Technische Details und Funktionen**

- GFM: Tabellen, Aufgabenlisten, Durchgestrichenes, Autolinks, eingezäunte Codeblöcke
- Der Export ist ein vollständiges HTML-Dokument mit eingebetteten Stilen und ohne externe Anfragen
- Rohes HTML in der Quelle läuft durch einen Bereiniger mit fester Positivliste, bevor es die Seite erreicht
- Lädt als `.html`, `.md` oder reiner Text herunter, oder druckt über den eigenen Dialog des Browsers nach PDF
- Wandelt außerdem HTML, Word, CSV und JSON zurück nach Markdown, und dieselbe Konvertierung gibt es über eine REST-API, ein CLI, eine GitHub Action und einen MCP-Server

**Wer sollte es verwenden?** Alle mit einer Datei und ohne Lust, dafür Software zu installieren, und alle, deren nächster Schritt ist, das Dokument jemandem zu schicken.

### Eine Markdown-Browser-Erweiterung — am besten, um lokale Dateien wiederholt im Browser zu öffnen

Erweiterungen wie Markdown Viewer stellen `.md`-Dateien dar, sobald Sie sie im Browser öffnen, eine `file:///`-URL wird also zu einer formatierten Seite.

| Vorteile | Nachteile |
| --- | --- |
| Macht den Browser zum `.md`-Betrachter für lokale Dateien | Verlangt, der Erweiterung Zugriff auf Datei-URLs zu geben |
| Stellt dar, sobald Sie die Datei öffnen, ohne Ziehen und Ablegen | Eine Erweiterung mit Dateizugriff kann lokale Dateien lesen, die Sie öffnen |
| In den besseren einstellbare Dialekte und Themes | Qualität und Pflege der Erweiterungen schwanken stark |

**Preis:** kostenlos, für Markdown Viewer MIT-lizenziert.

**Technische Details und Funktionen**

- Verfügbar für Chrome, Firefox, Edge, Opera, Brave, Chromium und Vivaldi
- Braucht „Zugriff auf Datei-URLs zulassen" ausdrücklich aktiviert auf der Detailseite der Erweiterung, bevor lokale Dateien dargestellt werden
- Stellt in der Seite dar, Suche, Zoom und Druck des Browsers funktionieren also normal

**Wer sollte es verwenden?** Leute, die wöchentlich lokale Markdown-Dateien öffnen und wollen, dass der Browser sie ohne Umweg übernimmt. Lesen Sie zuerst die Berechtigungen: der Schalter für Datei-URLs ist der ganze Sinn der Erweiterung und gleichzeitig der Grund, eine zu wählen, der Sie Ihre Festplatte zutrauen würden.

### VS Code — am besten, wenn es schon offen ist

VS Code bringt eine Markdown-Vorschau mit, auf Basis von markdown-it. Öffnen Sie die Datei und drücken Sie die Vorschau-Schaltfläche, oder teilen Sie das Fenster und haben Quelle und Darstellung nebeneinander.

| Vorteile | Nachteile |
| --- | --- |
| Bei den meisten Entwicklern schon installiert | Ein großer Download, wenn Sie nur eine Datei lesen wollen |
| Die Vorschau folgt CommonMark genau, mit GFM-Zusätzen | Die Vorschau ist im Stil des Editors, nicht des Dokuments |
| Die geteilte Ansicht zeigt Quelle und Ergebnis zusammen | Kein Leseprogramm: es ist ein Code-Editor mit Vorschaubereich |

**Preis:** kostenlos.

**Technische Details und Funktionen**

- Vorschau auf markdown-it gebaut, ihre Darstellung entspricht also dem Verhalten dieses Parsers
- Erweiterungen ergänzen den Export nach HTML und PDF sowie zusätzliche Syntax wie Diagramme
- Verkraftet einen Ordner voller Markdown-Dateien mit Suche über alle
- Zeigt Frontmatter als Quelle, sofern nicht eine Erweiterung etwas damit tut

**Wer sollte es verwenden?** Entwickler, deren Datei schon im Editor liegt. Wenn Sie VS Code eigens öffnen, um einen einzelnen `.md`-Anhang zu lesen, ist ein Browser-Tab schneller.

### Obsidian — am besten für einen Ordner Markdown, zu dem Sie immer wieder zurückkehren

Obsidian ist eine Notizanwendung, deren gesamter Speicher aus reinen Markdown-Dateien in einem gewöhnlichen Ordner auf der Platte besteht. Zeigen Sie ihr ein Verzeichnis, und jede `.md`-Datei darin wird eine lesbare, verlinkte Notiz.

| Vorteile | Nachteile |
| --- | --- |
| Dateien bleiben auf der Platte reines `.md` und für alles andere lesbar | Will einen Ordner, genannt Vault, keine einzelne lose Datei |
| Läuft unter Windows, macOS, Linux, iOS und Android | Die eigene Link- und Einbettungssyntax ist nicht auf andere Renderer übertragbar |
| Liest und stellt dar, ohne Konto | Eine ganze Anwendung zu lernen, wenn Sie nur lesen wollen |

**Preis:** kostenlos für private, kommerzielle und gemeinnützige Nutzung; kommerzielle Lizenzen sind freiwillig und werden jährlich als Unterstützung verkauft (geprüft auf obsidian.md, 8. September 2026).

**Technische Details und Funktionen**

- Local-first: der Vault ist ein Verzeichnis, und eine Anmeldung ist nicht erforderlich
- Stellt GFM dar, dazu eigene `[[links]]` im Wiki-Stil und Einbettungen
- Mobile Anwendungen für iOS und Android lesen dieselben Dateien
- Weil der Speicher reiner Text ist, lässt sich alles, was Sie darin schreiben, danach auch im Editor öffnen

**Wer sollte es verwenden?** Alle, die einen Ordner Markdown angesammelt haben — exportierte Notizen, ein Dokumentations-Checkout, ein persönliches Wiki — und regelmäßig daraus lesen statt einmalig.

### MarkText — der beste einfache Desktop-Leser ohne Konto

MarkText ist ein Open-Source-Markdown-Editor für den Desktop, der beim Tippen darstellt und damit auch als Leseprogramm dient.

| Vorteile | Nachteile |
| --- | --- |
| Kostenlos und MIT-lizenziert | Die Entwicklung geht langsamer voran als bei den kommerziellen Editoren |
| Installiert unter Windows 10 oder 11, macOS 11 oder neuer und Linux | Weniger Funktionen als Typora oder Obsidian |
| Verfügbar über Homebrew, Chocolatey und Winget | Trotzdem eine Installation, für eine Aufgabe, die ein Browser-Tab erledigt |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Installer für Windows x64 und arm64, macOS-Builds für arm64 und x64 ohne Universal Binary, und Linux-Binärdateien von der Release-Seite (geprüft auf github.com/marktext/marktext, 8. September 2026)
- Stellt an Ort und Stelle dar statt in einem eigenen Vorschaubereich
- Exportiert HTML und PDF aus der geöffneten Datei

**Wer sollte es verwenden?** Leute, die wollen, dass eine Desktop-Anwendung die Endung `.md` besitzt, auf einem Rechner, auf dem ein kostenpflichtiger Editor nicht in Frage kommt.

### Typora — am besten, wenn Sie täglich Markdown lesen und schreiben

Typora ersetzt das Markdown beim Tippen durch seine Darstellung, es gibt also keinen Vorschaubereich und keine Quellansicht, solange Sie nicht darum bitten. Es ist von diesen das angenehmste, um stundenlang darin zu sitzen, und das einzige hier, das Geld kostet.

| Vorteile | Nachteile |
| --- | --- |
| Die Darstellung ist das Dokument: kein geteilter Bereich zu verwalten | Kostenpflichtig, und nur für den Desktop |
| Exportiert HTML, PDF und Word | Die versteckte Syntax stört manche Schreibende |
| Lokale Dateien, nichts wird hochgeladen | Nicht wert, für einen einzigen Anhang gekauft zu werden |

**Preis:** 14,99 $ ohne Steuer, für bis zu 3 Geräte, mit 15 Tagen kostenloser Testphase (geprüft auf typora.io, 8. September 2026).

**Technische Details und Funktionen**

- WYSIWYG-Bearbeitung, mit einem Quellmodus, wenn Sie die Zeichen sehen müssen
- Themes sind CSS, der Export lässt sich also im eigenen Hausstil gestalten
- Exportiert über Pandoc für die Formate, die es nicht selbst schreibt

**Wer sollte es verwenden?** Leute, deren Arbeit täglich Markdown umfasst. Als einmaliges Leseprogramm für eine `.md`-Datei ist es der falsche Kauf.

### GitHub, GitLab und Gist — am besten, wenn die Datei schon in einem Repository liegt

Beide stellen GitHub Flavored Markdown in der Weboberfläche dar, und beide lesen eine Datei gut genug, dass Sie nichts anderes brauchen. Keines von beiden ist ein Betrachter für Dateien auf Ihrer Platte.

| Vorteile | Nachteile |
| --- | --- |
| Stellt GFM verlässlich dar, samt Tabellen und Aufgabenlisten | Die Datei muss erst irgendwohin geschoben werden |
| Nichts zu installieren; ein Link, den jeder öffnen kann | Für ein vertrauliches Dokument nicht angemessen |
| Gist funktioniert für eine einzelne lose Datei | Keine Export-Schaltfläche: was Sie speichern, ist deren Seite, deren Markup |

**Preis:** kostenlos.

**Wer sollte es verwenden?** Alle, deren Datei ohnehin auf einen Code-Hoster gehört. Fügen Sie eine einzelne Datei in ein privates Gist ein, und Sie haben in Sekunden eine dargestellte Ansicht — aber nur für Inhalte, die Sie dort ablegen wollen.

### less, bat und glow — am besten auf einem Server ohne Desktop

Manchmal liegt die Datei auf einem Rechner, den Sie über SSH erreicht haben, und es gibt keinen Browser und keine grafische Oberfläche. Das Terminal hat drei Stufen der Antwort.

| Vorteile | Nachteile |
| --- | --- |
| Funktioniert ganz ohne grafische Umgebung | Darstellung in einem Terminal hat Grenzen: keine Bilder, schmale Tabellen brechen um |
| `less` liegt praktisch auf jedem Unix-Rechner schon vor | `bat` und `glow` sind zusätzliche Installationen |
| `glow` stellt Überschriften, Listen und Tabellen als formatierten Text dar | Kein Weg, den jemand auf einem Laptop wählen würde |

**Preis:** kostenlos, Open Source; `glow` ist MIT-lizenziert.

**Technische Details und Funktionen**

- `less notes.md` blättert die Quelle seitenweise und durchsucht sie mit `/`
- `bat notes.md` gibt die Quelle mit Syntaxhervorhebung für Markdown aus
- `glow notes.md` zeichnet eine Darstellung ins Terminal, gestaltet für dunkel oder hell

**Wer sollte es verwenden?** Alle, die eine README oder ein Betriebshandbuch auf einem Server lesen, wo „eine Desktop-Anwendung installieren" kein Satz ist, der etwas bedeutet.

### Markor, Obsidian mobil und Working Copy — am besten auf einem Telefon

Mobil scheitert „einfach die Datei öffnen" am härtesten, es lohnt sich also, eine App pro Plattform zu kennen.

| Vorteile | Nachteile |
| --- | --- |
| Markor ist kostenlos, Apache 2.0, und hält Dateien auf dem Gerät als reinen Text | Jede ist eine Installation pro Plattform, für eine Datei, die Sie vielleicht einmal lesen |
| Obsidian läuft unter iOS und Android und liest einen Ordner voller `.md` | Der Umgang mit Dateien ist mobil fummeliger als auf einem Desktop |
| Working Copy zeigt Markdown aus einem Git-Repository unter iOS in der Vorschau | Manche iOS-Editoren sind kostenpflichtig, mit dem Betrag im App Store |

**Preis:** Markor kostenlos, Apache 2.0. Obsidian kostenlos. Working Copy installiert kostenlos, mit einer kostenpflichtigen Freischaltung, deren Preis im App Store steht.

**Technische Details und Funktionen**

- Markor: Android, über F-Droid oder GitHub, ohne Werbung, Dateien mit jedem anderen Werkzeug für reinen Text austauschbar
- Obsidian mobil: öffnet denselben Vault-Ordner wie die Desktop-Anwendung
- Working Copy: ein Git-Client, also die richtige Antwort, wenn die Datei in einem Repository liegt statt als Download vorliegt

**Wer sollte es verwenden?** Leute, die mehr als einmal Markdown auf einem Telefon lesen. Für einen einzelnen Anhang braucht ein Betrachter im Browser keine Installation und funktioniert auf beiden Plattformen.

### Pandoc — am besten, wenn die Antwort eine andere Datei ist

Pandoc ist ein Dokumentkonverter für die Kommandozeile, geschrieben in Haskell. Es zeigt nichts an; es schreibt eine neue Datei, die Sie dann in etwas öffnen, das Dinge anzeigt.

| Vorteile | Nachteile |
| --- | --- |
| Wandelt Markdown in HTML, PDF, Word, EPUB und mehr | Braucht eine Installation und ein Terminal |
| `--standalone` erzeugt ein vollständiges Dokument statt eines Fragments | Überhaupt kein Betrachter: kein Fenster, keine Vorschau |
| Skriptfähig, verkraftet also einen Ordner so leicht wie eine Datei | Seine Vorlagen und Dialekte sind eine eigene Lernkurve |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- Liest mehrere Markdown-Dialekte, ausdrücklich ausgewählt, und schreibt rund vierzig Ausgabeformate
- `--standalone` verpackt die Ausgabe; `--embed-resources` bettet Bilder und CSS in eine Datei ein
- Läuft ohne Oberfläche, passt also in einen Build oder einen Cron-Job und nicht in eine Lesesitzung

**Wer sollte es verwenden?** Leute, die das Dokument wiederholt in einem anderen Format brauchen, auf einem Rechner, den sie kontrollieren. Für eine Datei und einen Lesevorgang ist es mehr Werkzeug, als die Aufgabe braucht.

## Jemand hat Ihnen eine .md-Datei gemailt und Sie haben nichts installiert

Das ist die häufigste Variante der Frage, und sie hat eine kurze Antwort: installieren Sie nichts.

Laden Sie den Anhang herunter, öffnen Sie einen Betrachter im Browser und ziehen Sie die Datei auf die Seite. Das funktioniert auf einem Arbeitslaptop mit abgeriegelter Softwarerichtlinie, auf einem Telefon und auf einem geliehenen Rechner. Prüfen Sie, was die Seite über ihren Umgang mit der Datei sagt, bevor Sie ein vertrauliches Dokument darauf ablegen — bei einem Werkzeug, das im Browser arbeitet, wird nichts hochgeladen, und Sie können das bestätigen, indem Sie den Netzwerk-Tab öffnen und zusehen, wie nichts passiert.

Wenn Sie auch keinen Browser-Tab nutzen können, zwei Rückfallwege:

- **Umbenennen.** Ändern Sie `notes.md` in `notes.txt`, und jedes Programm auf dem Rechner, das Text anzeigt, einschließlich der Anhangsvorschau Ihres Webmailers, zeigt Ihnen die Quelle. An der Datei ändert sich nichts außer dem Namen.
- **Die Anhangsvorschau öffnen.** Die meisten Webmail-Clients zeigen einen Textanhang inline in der Vorschau, statt ihn herunterzuladen, und eine `.md`-Datei ist ein Textanhang.

Und wenn das andauernd passiert — wenn ein Kollege Ihnen regelmäßig `.md`-Dateien schickt und Sie jedes Mal nach einem Weg suchen, sie zu lesen —, liegt die Abhilfe beim Absender und nicht bei Ihnen. Bitten Sie ihn, stattdessen HTML oder einen Link zu schicken. Ein `.md`-Anhang ist eine Datei, die sich nur für Leute richtig öffnet, die dieses Problem schon gelöst haben.

## Lesen und Umwandeln sind verschiedene Aufgaben

Ein Betrachter löst Ihr Problem. Er löst nicht das Problem der nächsten Person.

Wenn Sie das Dokument mailen, drucken, an ein Ticket hängen, einem Kunden vorlegen oder in fünf Jahren noch öffnen können müssen, wandeln Sie es einmal in HTML um. Eine `.html`-Datei öffnet auf allem mit einem Browser per Doppelklick, mit erhaltener Formatierung, ohne Installation und ohne Erklärung. Das ist die Eigenschaft, die `.md` auf keiner Plattform hat, und genau deshalb existiert dieser Artikel. [Was tatsächlich passiert, wenn aus Markdown HTML wird](/blog/markdown-to-html-converter), lohnt sich zu verstehen, bevor Sie ein Werkzeug wählen, und wenn der Leser sich überhaupt nicht mit einem Anhang befassen soll, können Sie es stattdessen [als Nur-Lese-Link veröffentlichen](/blog/share-a-markdown-document-as-a-link).

Solange Sie noch schreiben, läuft die Abwägung umgekehrt. Ein Editor mit Live-Vorschau verdient seinen Download dann, denn Sie sehen das Dokument dutzende Male am Tag an. Ein Konverter ist für den Moment, in dem Sie fertig sind und jemand anderes lesen muss. Zwischen beiden zu wählen ist eigentlich eine Frage danach, wer der nächste Leser ist — und wenn diese Frage immer vor dem Schreiben der Datei auftaucht statt danach, ist die Entscheidung darunter, [ob das Dokument überhaupt Markdown oder HTML hätte sein sollen](/blog/markdown-vs-html).

## Wo die naheliegende Wahl scheitert

Der naheliegende Rat lautet „installieren Sie VS Code" oder „öffnen Sie es einfach im Editor", und beide sind etwa die Hälfte der Zeit richtig. Hier ist, was jeder von beiden Sie kostet.

**Roher Text verbirgt Struktur genau dann, wenn Sie sie brauchen.** Eine Datei mit vierzig Zeilen ist als Quelle in Ordnung. Ein Betriebshandbuch mit sechzig Seiten, vier Verschachtelungsebenen, einem Dutzend Tabellen und Inline-Code in jeder dritten Zeile ist es nicht: Sie parsen am Ende die Satzzeichen, statt die Wörter zu lesen, und Sie werden Dinge übersehen. Das Scheitern ist lautlos — Sie merken nicht, welchen Punkt Sie übersprungen haben.

**Einen Editor für eine einzige Datei zu installieren ist ein schlechtes Geschäft und schwer zurückzunehmen.** Ein Code-Editor ist ein großer Download, eine Führung durch Einstellungen, um die Sie nicht gebeten haben, und eine neue Standardanwendung für eine Endung, die er vielleicht nicht besitzen soll. Er neigt außerdem dazu, Markdown mit eingeschalteter Syntaxhervorhebung zu öffnen, was nicht dasselbe ist wie es darzustellen — die Rautezeichen sind weiterhin da, sie haben jetzt nur eine andere Farbe.

**„Online"-Betrachter bedeuten meist hochgeladen.** „Online" und „im Browser" klingen gleich und sind es nicht. Manche Werkzeuge schicken Ihre Datei zum Umwandeln an einen Server; manche machen die Arbeit lokal und senden nichts. Für eine öffentliche README ist der Unterschied belanglos. Für einen Vertrag, eine Patientennotiz, einen unveröffentlichten Plan oder einen internen Vorfallsbericht ist es die einzige Frage, die zählt, und die Antwort steht auf der Seite oder ist im Netzwerk-Tab überprüfbar.

**Browser-Erweiterungen wollen Zugriff auf Ihre Festplatte.** Eine Erweiterung, die lokale `.md`-Dateien darstellt, kann das nur mit der Berechtigung, Datei-URLs zu lesen, und diese Berechtigung ist nicht eng gefasst. Es ist ein vernünftiges Geschäft, wenn Sie ständig Markdown lesen, und ein schlechtes für einen einzelnen Anhang.

**Betrachter sind sich über Markdown nicht einig.** Tabellen, Aufgabenlisten, Durchgestrichenes und Autolinks kommen aus GitHub Flavored Markdown und nicht aus der ursprünglichen Syntax, ein strenger CommonMark-Betrachter zeigt also rohe Pipes, wo Sie eine Tabelle erwartet haben. Die Datei ist in Ordnung; der Betrachter setzt einen kleineren Dialekt um. Das ist die mit Abstand häufigste Meldung „mein Markdown ist kaputt", und es ist fast nie die Datei. Es lohnt sich, [die Dialekte](/blog/commonmark-gfm-and-the-flavours) zu kennen, wenn Sie Markdown aus mehr als einer Quelle bekommen.

**Bilder stehen nicht in der Datei.** Markdown verweist auf Bilder über einen Pfad; es enthält sie nicht. Öffnen Sie eine `.md`-Datei, die mit einem Ordner `images/` daneben exportiert wurde, in einem Betrachter, der nur die `.md` bekommen hat, und jedes Bild ist ein kaputtes Symbol. Das ist nicht der Betrachter, der scheitert, das ist [was relative Pfade tun, wenn eine Datei umzieht](/blog/images-and-links-that-still-work).

**Die Standardanwendung zu ändern behebt den Doppelklick und nichts weiter.** Es lohnt sich, und es macht die Datei nicht übertragbar. Ihr Rechner öffnet `.md` jetzt sauber. Die Person, der Sie sie schicken, steht dort, wo Sie angefangen haben.

## Wie Sie wählen

1. **Öffnen Sie sie zuerst in einem Texteditor.** Das dauert zehn Sekunden, braucht nichts und sagt Ihnen genau, was Sie da haben — Länge, Frontmatter, ob es Tabellen gibt, ob es überhaupt Markdown ist. Überspringen Sie das, und Sie installieren womöglich eine Anwendung, um vierzig Zeilen Text zu lesen.
2. **Zählen Sie, wie oft das vorkommen wird.** Einmal heißt ein Browser-Tab. Wöchentlich heißt eine Browser-Erweiterung oder ein Editor, den Sie schon haben. Täglich heißt eine Anwendung, in der Sie gern sitzen, und das ist der einzige Fall, in dem es sinnvoll ist, für eine zu bezahlen.
3. **Entscheiden Sie, ob der Inhalt den Rechner verlassen darf.** Wenn nicht, schließen Sie alles aus, was hochlädt, bevor Sie irgendetwas anderes vergleichen, denn das ist keine Vorliebe, die Sie im Nachhinein noch einmal überdenken können.
4. **Prüfen Sie den Dialekt gegen die Datei.** Wenn das Dokument Tabellen oder Aufgabenlisten hat, muss der Betrachter GFM beherrschen. Öffnen Sie eine repräsentative Datei und sehen Sie sich die Tabellen an, bevor Sie sich festlegen; ein Betrachter, der Pipes zeigt, wird weiter Pipes zeigen.
5. **Fragen Sie, wer sie als Nächstes liest.** Wenn die Antwort nur Sie sind, genügt jeder Betrachter hier. Wenn die Antwort ein Kollege, ein Kunde oder Ihr künftiges Ich auf einem anderen Gerät ist, wollen Sie überhaupt keinen Betrachter — Sie wollen eine umgewandelte Datei, und die Wahl des Betrachters hört auf, eine Rolle zu spielen.

## Fazit

Öffnen Sie die Datei zuerst im Editor, in TextEdit oder mit `less`: sie ist reiner Text, sie wird sich öffnen, und sie sagt Ihnen genau, was Sie haben. Wenn die Quelle Ihre Frage beantwortet, hören Sie dort auf. Wenn das Dokument lang genug ist, dass die Satzzeichen im Weg stehen, lesen Sie die Darstellung — ein Browser-Tab für eine Datei, eine Erweiterung oder ein Editor, wenn es eine wöchentliche Gewohnheit ist, Markor oder Obsidian auf dem Telefon. Und wenn das eigentliche Problem darin besteht, dass die Datei jemanden erreichen muss, der nie ein Rautezeichen sehen sollte, wandeln Sie sie einmal mit [der Markdown-zu-HTML-Konvertierung von TransformPipe](/) um: sie läuft in Ihrem Browser, abgemeldet wird nichts hochgeladen, und was Sie zurückbekommen, ist eine eigenständige HTML-Datei, die auf jedem Gerät per Doppelklick öffnet, das jemand Ihnen wahrscheinlich in die Hand drücken wird.

## FAQ

### Warum öffnet sich meine .md-Datei in einem Code-Editor?

Weil Windows und macOS die Anwendung anhand der Dateiendung wählen und nichts mitgeliefert wird, das `.md` beansprucht. Es gewinnt das Programm, das die Endung zuletzt registriert hat, und auf einem Rechner mit installierten Entwicklerwerkzeugen ist das meist ein Code-Editor. Über den Inhalt Ihrer Datei sagt das nichts.

### Kann ich eine .md-Datei in Word öffnen?

Word öffnet sie, wenn Sie es direkt auf die Datei zeigen, und behandelt sie als reines Textdokument — Sie sehen die Rautezeichen und Sternchen, nicht Überschriften und Fettes. Word ist kein Markdown-Renderer, das ist also nur zum Lesen der Quelle nützlich. Wenn Sie das Dokument richtig im Word-Format brauchen, wandeln Sie es um, statt es zu öffnen.

### Was ist der Unterschied zwischen .md und .markdown?

Keiner. Beide Endungen bedeuten denselben reinen Text nach denselben Konventionen, und `.mdown`, `.mkd` und `.mdwn` sind dasselbe noch einmal. Die einzigen Endungen, die sich wirklich unterscheiden, sind `.mdx`, das JavaScript-Komponenten einmischt, und `.rmd`, also R Markdown mit ausführbaren Code-Abschnitten.

### Ist es sicher, eine .md-Datei zu öffnen, die mir jemand geschickt hat?

Sie in einem Texteditor zu lesen ist völlig sicher: nichts in der Datei wird ausgeführt und nichts wird abgerufen. Sie darzustellen ist eine etwas andere Frage, denn Markdown erlaubt rohes HTML, eine `.md`-Datei kann also `<script>`-Tags und `javascript:`-URLs tragen, die ein treuer Renderer Ihrem Browser übergibt. Nehmen Sie einen Betrachter, der das HTML bereinigt, und bedenken Sie, dass ein Editor für reinen Text die Frage vollständig umgeht.

### Wie ändere ich das Programm, das .md-Dateien öffnet?

Unter Windows: Rechtsklick, Öffnen mit, Andere App auswählen, das Programm wählen, das Kästchen ankreuzen, das es dauerhaft macht — oder es unter Einstellungen, Apps, Standard-Apps über die Suche nach `.md` setzen. Unter macOS: Informationen, Öffnen mit, die Anwendung wählen, dann auf Alle ändern klicken. Unter Linux: der Reiter Öffnen mit im Dateimanager, oder `xdg-mime default <app>.desktop text/markdown`.

### Kann ich eine .md-Datei auf dem Telefon lesen, ohne etwas zu installieren?

Ja. Tippen Sie sie unter iOS in Dateien oder unter Android in Ihrem Dateimanager an, und Sie bekommen den Text oft in einer Vorschau. Für Formatierung ohne Installation öffnen Sie einen Betrachter im Browser in Safari oder Chrome und wählen die Datei über die Dateiauswahl der Seite — mobile Browser können eine lokale Datei so lesen, und das ist der eine Weg, der auf beiden Plattformen funktioniert.

### Muss ich eine .md-Datei umwandeln, um sie zu lesen?

Nein. Umwandeln ist für den Fall, dass jemand anderes sie lesen muss, oder dass Sie das Dokument in einem anderen Format brauchen. Für Ihr eigenes Lesen genügt ein Texteditor oder ein Betrachter, und keines von beiden verändert die Datei. Wandeln Sie um, wenn der Zielort eine Person, ein Drucker oder ein Archiv ist und nicht Ihr eigener Bildschirm.
