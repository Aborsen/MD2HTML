---
title: "Markdown aus Notion, Obsidian, Confluence und dem Rest herausholen"
description: "Jeder Exportweg aus Notion, Obsidian, Confluence, Google Docs und Word — was dabei herauskommt, was still verstümmelt wird und wie Sie es reparieren"
updated: 2026-09-09
date: 2026-07-02
tag: Workflow
keywords: notion export markdown, notion nach markdown, obsidian export html, confluence nach markdown, confluence seite als markdown exportieren, google docs nach markdown, word nach markdown, html nach markdown, evernote export markdown, apple notes markdown exportieren, wiki nach markdown migrieren, notion zu markdown konvertieren
---

Das Dokument existiert schon: Überschriften, eine Tabelle, drei Screenshots, ein farbiger Callout-Kasten — in einer Anwendung, die Ihnen keine Datei aushändigen wird. Es herauszuholen ist selten ein Klick, und der Klick, den Sie finden, verliert etwas, das Sie eine Woche später bemerken.

Was das schwerer macht, als es aussieht: Keine dieser Anwendungen speichert Markdown. Sie speichern einen Baum typisierter Blöcke, oder XHTML mit Makros darin, oder ein proprietäres Dokumentmodell, und der Export-Knopf ist ein Konverter, den jemand geschrieben hat, um von diesem Modell zu einem Dateiformat zu kommen. Jeder Konverter lässt fallen, was sein Ziel nicht ausdrücken kann. Die Frage ist nie, ob etwas verloren geht; sie ist, welches Etwas, und ob Sie es jetzt erfahren oder erst, nachdem Sie die Quelle weggeworfen haben.

### Kurzfassung

Notion exportiert ein Zip aus Markdown und CSV, in dem jeder Dateiname und jeder interne Link eine Seiten-ID trägt und Callouts, Toggles und Spalten abgeflacht ankommen. Obsidian ist schon Markdown, aber in seinem eigenen Dialekt, Wikilinks, Embeds und Blockreferenzen müssen also konvertiert werden, bevor irgendetwas anderes sie lesen kann. Confluence hat überhaupt keinen Markdown-Export — Sie nehmen den HTML-Export des Space und konvertieren ihn, wobei verloren geht, was die Makros getan haben. Google Docs lädt Markdown direkt herunter, kann aber Bilder und Kommentare nicht in einer einzelnen Datei tragen, und Word und alles andere gehen über HTML. Bei zehn Seiten reparieren Sie von Hand; bei tausend wird es eine skriptgesteuerte Umschreibearbeit, und umgeschrieben werden Dateinamen, Links, Anhangspfade und Anker, in dieser Reihenfolge.

| Quelle | Exportweg | Was Sie bekommen | Was verstümmelt wird |
| --- | --- | --- | --- |
| Notion | Export, Format „Markdown & CSV" | Zip: eine `.md` pro Seite, Ordner, eine `.csv` pro Datenbank | IDs in jedem Dateinamen und jedem Link, Callouts, Toggles, Spalten, Kommentare |
| Obsidian | keiner nötig — Dateien auf der Platte | ein Ordner mit `.md` und Anhängen | Wikilinks, Embeds, Blockreferenzen, Callouts, Dataview-Blöcke |
| Confluence Cloud | Space-Export nach HTML (Space-Admin) | Zip aus dargestelltem HTML plus Anhängen | Makros, Seitenhierarchie, Kommentare, Überschriftenanker |
| Confluence, eine Seite | Export to Word oder PDF | eine Datei pro Seite | alles Strukturelle; PDF ist eine Sackgasse |
| Google Docs | Datei → Herunterladen → Markdown | eine `.md`-Datei | Bilder, Kommentare, Vorschläge |
| Google Docs | Datei → Herunterladen → Webseite | Zip aus HTML plus einem Bilderordner | Stilattribute, die danach zu entfernen sind |
| Word | die `.docx` selbst | ein Zip aus XML, das Sie konvertieren | mit Fett vorgetäuschte Überschriften, Listennummerierung, verfolgte Änderungen |
| Evernote | Export als ENEX oder HTML | XML-Container, oder HTML plus einen Ressourcenordner | Notiz-Metadaten, Aufgaben, von Hand gemachte Formatierung |
| Bear | Export als Markdown oder Textbundle | Markdown, im Textbundle-Fall mit den Assets | Bears eigene Tag-Syntax liest sich woanders als Überschrift |
| Apple Notes | File → Export as → Markdown | eine Datei pro Notiz | Anhänge, Tabellen, und es geht nur notizweise |
| Roam | Export aus dem Graphen heraus | lesen Sie die Formatliste in Ihrem eigenen Graphen, bevor Sie planen | Blockreferenzen und Queries haben kein Äquivalent |

## Notion: ein Zip, in dem jeder Dateiname eine ID bekommt

Wählen Sie „Markdown & CSV", und Notion baut ein Zip: eine `.md` pro Seite, einen Ordner pro Seite, die Unterseiten oder Bilder hatte, eine `.csv` pro Datenbank. Jeder Name trägt eine lange hexadezimale ID: Notion identifiziert Seiten über IDs, und der Titel ist nur ein Etikett.

Der Export-Dialog ist es wert, gelesen statt weggeklickt zu werden. Er bietet eine Formatwahl — PDF, HTML oder Markdown & CSV —, ein Dropdown „Include content", das Dateien und Bilder ausschließen kann, einen Schalter „Include subpages" und einen Schalter „Create folders for subpages" (angehakt; geprüft auf notion.com, 9. September 2026). Zwei weitere Grenzen von derselben Seite zählen, bevor Sie eine Migration darauf aufbauen: Exportiert wird nur die aktuelle oder die Standardansicht einer Datenbank, alle Ansichten auf einmal wird nicht unterstützt, und eine Formularansicht lässt sich überhaupt nicht exportieren — Sie exportieren stattdessen die Tabellenansicht. Bei einem großen Export schickt Notion womöglich einen Download-Link per E-Mail, anstatt den Download zu starten, der Link verfällt nach sieben Tagen, und die Verarbeitung kann bis zu dreißig Stunden dauern (geprüft auf notion.com, 9. September 2026). Das ist eine Planungstatsache, keine Fußnote: Wenn der Plan „Freitagnachmittag exportieren und Freitagabend konvertieren" war, ist es womöglich nicht der Plan.

Drei Dinge, mit denen zu rechnen ist:

- **Die IDs bleiben.** Benennen Sie die Dateien um, wenn Menschen die Namen lesen werden, und reparieren Sie dann die Links auf die alten Namen.
- **Callouts flachen ab.** Markdown hat keinen Block mit einem Symbol und einer Hintergrundfarbe, ein Callout kommt also als Absatz zurück, mit dem Emoji-Zeichen vorne gestrandet. Toggles verlieren ihr Umschalten.
- **Datenbanken gehen als CSV.** Eine Tabellenansicht ist eine eigene Datei, keine Markdown-Tabelle: Sie neu aufzubauen ist Tabellenkalkulationsarbeit, und danach [eine Frage, ob die Pipes überleben](/blog/markdown-tables-that-survive-conversion).

Bilder liegen im Ordner der Seite unter generierten Namen, erreichbar über prozentkodierte relative Pfade, die nur halten, solange der Ordner mit der Datei reist — genau die Annahme, die [relative Pfade eingehen und brechen](/blog/images-and-links-that-still-work).

### Was aus jedem Blocktyp wird

| In Notion | Im Export | Reparatur |
| --- | --- | --- |
| Callout | Absatz, Symbolzeichen vorne | eine einzige Blockquote-Konvention mit fetter Einleitung |
| Toggle | die Zusammenfassung als Zeile, der Inhalt als die Blöcke danach | ein `<details>`-Element, oder eine Überschrift und einfacher Text |
| Toggle-Überschrift | eine Überschrift, der Inhalt darunter eingefügt | meist so schon richtig |
| Spaltenlayout | die Spalten hintereinander, in Dokumentreihenfolge | den Umbruch akzeptieren, oder als Tabelle neu aufbauen |
| Synced Block | sein Inhalt, kopiert in jede Seite, die ihn zeigte | ein Zuhause für den Text wählen und darauf verlinken |
| Datenbank, ganze Seite | eine `.csv`-Datei, plus eine `.md` pro Zeile, die einen Seitenkörper hatte | die Tabelle neu aufbauen, die Zeilenseiten als Dateien behalten |
| Verknüpfte Datenbankansicht | nichts Brauchbares — die Ansicht ist eine Query, kein Inhalt | dort neu anlegen, wo die Seiten landen |
| Inline-Formel | das LaTeX, mit Trennzeichen | hängt vollständig davon ab, was es später darstellt |
| Kommentar | fehlt | alles Unerledigte vorher in den Text kopieren |
| Backlinks-Bereich | fehlt | er war abgeleitet, nicht gespeichert |

Die Kommentarzeile ist die, die Teams kalt erwischt. Diskussionsfäden sind nicht Teil des Seiteninhalts, ein Export ist also die Seite ohne die Auseinandersetzung, die sie erzeugt hat. Wenn Entscheidungen in Kommentaren leben, sind sie in dem Moment weg, in dem der Workspace archiviert wird.

### Das ID-Suffix, und warum es nicht bloß hässlich ist

Eine Seite namens „Meeting notes" kommt als `Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md` heraus, und ein Link darauf von einer anderen Seite ist gegen genau diesen Dateinamen geschrieben, prozentkodiert für die Leerzeichen. Die ID ist dieselbe, die in der URL der Seite in der Anwendung erscheint, und das ist der nützliche Teil: Sie gibt Ihnen einen Schlüssel, um alte Links auf neue abzubilden.

```text
Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md    die Datei
Meeting%20notes%2021f4c8a1b2c34d5e8f90123456789abc.md    der Link
meeting-notes.md    was Sie wollen
```

Benennen Sie die Dateien um, ohne die Links umzuschreiben, und Sie haben einen Ordner voller Dokumente, die alle aufeinander zeigen und von denen keines auflöst. Das ist das ganze Migrationsproblem im Kleinen, und deshalb müssen die Umbenennung und das Umschreiben der Links eine Operation über eine Abbildung sein, nicht zwei Durchgänge an verschiedenen Nachmittagen.

## Obsidian: schon Markdown, aber nicht der Standarddialekt

Ein Obsidian-Vault ist ein Ordner mit `.md`-Dateien, es gibt also nichts zu extrahieren: eine davon nach HTML zu bringen ist eine Konvertierungsaufgabe, kein Export. Der Haken ist, dass mehrere Dinge, die Obsidian versteht, seine eigenen sind.

```markdown
[[Meeting notes]]            <!-- Wikilink, kein Standard-Markdown -->
![[architecture.png]]        <!-- Embed, ebenfalls kein Standard -->

> [!warning] Vorsicht
> Das ist ein Obsidian-Callout.
```

Ein Standardkonverter gibt den Wikilink und den Embed als wörtlichen Text aus, Klammern inbegriffen, und stellt den Callout als Blockquote mit `[!warning]` in der ersten Zeile dar. Stellen Sie entweder die Vault-Einstellung so um, dass neue Links gewöhnliche Markdown-Links sind, oder suchen und ersetzen Sie vor der Konvertierung.

Die Einstellung ist der Schalter „Use [[Wikilinks]]" unter Files and links; ihn auszuschalten lässt Obsidian stattdessen Standard-Markdown-Links erzeugen (geprüft auf obsidian.md, 9. September 2026). Sie gilt nur für neue Links. Alles bereits Geschriebene bleibt, wie es war, ein Vault, der seit zwei Jahren läuft, braucht das Umschreiben also trotzdem — die Einstellung hält das Problem davon ab zu wachsen, sie behebt es nicht.

### Der Dialekt, Punkt für Punkt

| Obsidian schreibt | Ein Standardkonverter sieht | Was zu tun ist |
| --- | --- | --- |
| `[[Note]]` | den wörtlichen Text, Klammern und alles | umschreiben zu `[Note](note.md)` gegen eine Abbildung von Titel auf Pfad |
| `[[Note\|label]]` | wörtlichen Text | umschreiben zu `[label](note.md)` |
| `![[image.png]]` | wörtlichen Text | umschreiben zu `![](image.png)` |
| `![[Note]]` | wörtlichen Text | die Notiz einfügen, oder verlinken — für Transklusion gibt es kein Äquivalent |
| `[[Note#Heading]]` | wörtlichen Text | umschreiben zu `note.md#heading`, dann prüfen, ob die Slug-Regel zu Ihrem Renderer passt |
| `[[Note#^block-id]]` | wörtlichen Text | es gibt kein Ziel zum Verlinken; den zitierten Text einfügen |
| `^block-id` am Zeilenende | ein verirrtes Caret-Zeichen und ein Wort in der Ausgabe | löschen, sobald nichts es mehr referenziert |
| `> [!note]`-Callout | ein Blockquote mit `[!note]` in der ersten Zeile | den Marker entfernen, das Blockquote behalten |
| ein ```` ```dataview ````-Block | ein Codeblock, der die Query zeigt | die Tabelle, die er darstellte, stand nie in der Datei |
| `%%comment%%` | den Text, für den Leser sichtbar | vor der Konvertierung löschen |

Blockreferenzen verdienen die Betonung, die Obsidians eigene Dokumentation ihnen gibt: Sie sind spezifisch für Obsidian und nicht Teil von Standard-Markdown, sie übertragen sich also nicht (geprüft auf obsidian.md, 9. September 2026). Dasselbe gilt für Embeds. Beide sind Zeiger in einen Graphen, und ein Ordner mit Dateien ist kein Graph.

Die Dataview-Zeile ist die, die man falsch liest. Eine Dataview-Query ist ein eingezäunter Codeblock mit `dataview` als Info-String, und die Tabelle, die Sie in Obsidian angesehen haben, wurde zur Anzeigezeit von einem Plugin erzeugt. Nichts davon steht in der Datei. Konvertieren Sie den Vault, und Sie bekommen den Text der Query in einem Codeblock, korrekt, und der Leser bekommt überhaupt keine Tabelle.

Der Eigenschaftenblock oben ist YAML-Frontmatter: Ein Konverter, der ihn nicht erkennt, stellt die öffnenden `---` als thematische Trennlinie dar und macht aus den schließenden eine Überschrift, gebaut aus Ihrer letzten Metadatenzeile.

Sobald eine Notiz gewöhnliches Markdown ist, ist die Konvertierung stumpfe Arbeit: Legen Sie sie auf [TransformPipe](https://transformpipe.com) für eine Vorschau, einen HTML-Quelltext-Tab und eine eigenständige `.html` mit Inline-Stilen. Mehrere zusammen abgelegt verketten sich zu einem Dokument.

### Einen Vault portabel machen, bevor Sie es brauchen

Vier Gewohnheiten halten einen Vault konvertierbar, ohne zu ändern, wie Sie darin schreiben. Schalten Sie Wikilinks ab, damit neue Links Standard sind. Halten Sie Anhänge in einem Ordner innerhalb des Vault statt außerhalb, damit die relativen Pfade halten, wenn der Ordner kopiert wird. Vermeiden Sie einen Embed, wo ein Link genügt, denn ein Link verfällt zu einem Link und ein Embed verfällt zu Klammern. Und behandeln Sie Blockreferenzen als persönliche Navigationshilfe statt als Weg, aus Teilen eine Argumentation zu bauen, denn sie sind das eine Konstrukt ohne jeden Abstiegspfad.

## Confluence: das Speicherformat ist XHTML, ein Export ist also eine Konvertierung

Confluence speichert kein Markdown. Eine Seite liegt im Confluence-Speicherformat, das XHTML-basiert ist — technisch XML, da es XHTML nicht vollständig entspricht —, und Confluences eigene Konstrukte leben in zwei Namensräumen: `ac:` für seine Elemente und `ri:` für Ressourcenkennungen. Ein Makro ist ein `ac:structured-macro`, ein Bild ist ein `ac:image`, das ein `ri:attachment` umschließt, und ein Seitenlink ist ein `ac:link`, das ein `ri:page` umschließt (geprüft auf confluence.atlassian.com, 9. September 2026).

Nichts auf dieser Liste hat eine Markdown-Form. Der Weg hinaus ist also einer, den Sie selbst zusammensetzen, und die erste Entscheidung ist, welchen Export Sie ausführen dürfen. Die Exportnamen unten stehen so, wie Atlassian sie dokumentiert; die deutsche Oberfläche nennt einen Space einen Bereich.

| Export | Umfang | Wer ihn ausführen darf | Was herauskommt |
| --- | --- | --- | --- |
| Export to Word | eine Seite | jeder mit Zugriff | eine Datei, die Word öffnet und andere Editoren oft nicht |
| Export to PDF | eine Seite | jeder mit Zugriff | eine dargestellte Seite; Kommentare nie enthalten |
| Space-Export, HTML | ganzer Space | Space-Admin | Zip aus dargestelltem HTML plus Anhängen |
| Space-Export, XML | ganzer Space | Space-Admin | Speicherformat, zum Wiederherstellen in Confluence |
| Space-Export, CSV | ganzer Space | Space-Admin | Inhalt, den Sie sehen können, Anhänge und Kommentare standardmäßig dabei |
| Space-Export, PDF | ganzer Space | Space-Admin | eine Datei, keine Blogbeiträge, keine Kommentare |

Jede Zeile dieser Tabelle stammt aus Atlassians eigener Dokumentation, Ausschlüsse inbegriffen: Seitenkommentare werden derzeit bei einem HTML-Export nicht mitexportiert, Kommentare sind in einem PDF-Export nie enthalten, Blogbeiträge werden auch aus einem Space-PDF-Export ausgelassen, und der CSV-Export nimmt alles, was Sie sehen können, Anhänge und Kommentare darunter (geprüft auf support.atlassian.com, 9. September 2026). Der Word-Export einer einzelnen Seite ist ebenfalls als einer dokumentiert, der eine Datei erzeugt, die nur Microsoft Word zuverlässig öffnet, was ihn als skriptbare Eingabe ausschließt.

Damit bleibt HTML als die einzige sinnvolle Quelle für eine Massenkonvertierung, was die Arbeit zu [einer Konvertierung von HTML zu Markdown](/html-to-markdown) mit einem Verzeichnisdurchlauf davor macht. Zwei Wege für den Konvertierungsschritt:

- Ein Konverter oder eine Bibliothek über dem exportierten HTML — pandoc, oder etwas wie turndown in einem Skript. Makros kommen als das HTML an, zu dem sie dargestellt wurden: Ein Info-Panel wird ein einfaches `div`, ein Seitenbaum oder ein Excerpt hinterlässt Links auf die lebende Website. [Der Pandoc-Vergleich](/blog/pandoc-alternatives-for-markdown-to-html) behandelt, wann das schwerere Werkzeug seine Installation verdient.
- Eine Marketplace-App, die Markdown direkt ausgibt: besser mit Makros, eine Sache mehr, die genehmigt werden muss.

### Was aus den Makros wird

Die Regel ist einfach, sobald man sie sieht. Ein Makro, das zu statischem HTML dargestellt wurde, überlebt als dieses HTML. Ein Makro, das eine lebende Query war, überlebt als Momentaufnahme dessen, was es zufällig zeigte, oder als nichts.

| Makro | Im HTML-Export | Nach der Konvertierung |
| --- | --- | --- |
| Info-, Hinweis-, Warn-, Tipp-Panel | ein `div` mit einer Klasse und einem Symbol | ein Absatz; geben Sie ihm eine Blockquote-Konvention |
| Codeblock | ein `pre` mit Markup für Syntaxhervorhebung | ein eingezäunter Block, meist ohne die Sprache |
| Inhaltsverzeichnis | eine dargestellte Liste von Ankerlinks | eine Liste von Links auf Anker, die es nicht mehr gibt |
| Seitenbaum, Unterseiten anzeigen | eine dargestellte Liste von Links auf die lebende Website | absolute Links zurück nach Confluence |
| Excerpt, Include | der transkludierte Text, eingefügt | Text, dupliziert in jeder Seite, die ihn einband |
| Jira-Vorgang oder -Filter | eine Momentaufnahme-Tabelle, oder ein Link | eine Tabelle, eingefroren auf den Tag des Exports |
| Expand | der Inhalt, ausgeklappt | einfacher Inhalt, kein Toggle |
| Attachments-Makro | eine Liste von Links auf `/download/attachments/...` | Links, die eine Sitzung brauchen |

Anhänge sind die wiederkehrende Falle: Sie sitzen hinter `/download/attachments/`-URLs, die eine Sitzung erwarten. Ein Space-Export packt sie ins Zip, eine kopierte Seite nicht, ein Bild, das richtig aussieht, während Sie angemeldet sind, ist also für alle anderen ein kaputter Kasten.

Zwei weitere Dinge, die der HTML-Export nicht in brauchbarer Form erhält. Der Seitenbaum wird in einer Indexdatei ausgedrückt statt im Verzeichnisaufbau — die exportierten Dateinamen sind flach und maschinell erzeugt, die Hierarchie muss also aus dem Index rekonstruiert werden, wenn Sie Ordner wollen. Und Überschriftenanker ändern sich: Confluence erzeugt IDs, die den Seitentitel enthalten, jeder seiteninterne Link, der gegen `#PageTitle-Heading` geschrieben ist, hört also in dem Moment auf aufzulösen, in dem Ihr neuer Renderer stattdessen `#heading` erzeugt. Labels sind Metadaten ohne Markdown-Äquivalent und es wert, während der Konvertierung ins Frontmatter geschrieben zu werden, denn nichts anderes wird sie tragen.

## Google Docs: zwei Wege hinaus, keiner trägt das Gespräch

Google Docs nach Markdown funktioniert meistens. Datei, dann Herunterladen, bietet Markdown (.md) direkt an, und Überschriften, Listen, Tabellen, Links und Hervorhebung überleben (geprüft auf workspaceupdates.googleblog.com, 9. September 2026). Dasselbe Update fügte eine Einstellung unter Tools → Einstellungen → Enable Markdown hinzu, die Copy as Markdown und Paste from Markdown einschaltet — nützlich für einen Abschnitt, nicht für ein Dokument.

Kommentare und Änderungsvorschläge überleben nicht. Ein Bild auch nicht, denn eine einzelne `.md`-Datei hat keinen Platz dafür. Das gibt Ihnen eine Wegentscheidung statt einer einzigen Antwort.

| Weg | Behält | Verliert | Nehmen, wenn |
| --- | --- | --- | --- |
| Als Markdown herunterladen | Überschriften, Listen, Tabellen, Links, Hervorhebung | Bilder, Kommentare, Vorschläge | das Dokument Text ist und Sie eine Datei wollen |
| Als Webseite herunterladen, gezippt | Bilder, in einem Ordner neben dem HTML | Kommentare, Vorschläge; fügt Inline-Stile hinzu, die zu entfernen sind | das Dokument Screenshots enthält |
| Als Word herunterladen, dann konvertieren | Bilder, Stile, verfolgte Änderungen als Markup | Kommentare, Vorschläge | Sie schon `.docx` im Stapel konvertieren |

Der HTML-Weg ist der, nach dem man standardmäßig greift, wenn Bilder im Spiel sind. Das Zip gibt Ihnen einen Bilderordner und eine HTML-Datei, und der Konvertierungsschritt lässt die Klassensuppe und die Inline-`style`-Attribute fallen, die Google an jeden Absatz hängt — was der Punkt ist, denn nichts davon bedeutet in Markdown etwas. [Die vollständige Anleitung für diese Konvertierung](/blog/convert-google-docs-to-markdown) behandelt die Details, die vor einem Stapel zu kennen sind.

Vorschläge sind der Fehlerfall mit Zähnen. Ein Dokument im Vorschlagsmodus enthält zwei Versionen von sich selbst, und der Export enthält eine davon, für Sie ausgewählt. Nehmen Sie alles an oder lehnen Sie alles ab, bevor Sie exportieren, damit die Datei, die Sie konvertieren, das Dokument ist, für das Sie sie halten. Dasselbe gilt für Kommentare: Wenn eine Entscheidung nur in einem aufgelösten Faden festgehalten ist, kopieren Sie sie vorher in den Text oder verlieren Sie sie.

## Word: ein Konverter kann Struktur lesen, keine Absicht

Eine `.docx` ist ein Zip aus XML, und Word nach Markdown funktioniert etwa so gut, wie das Dokument es verdient. Mit Words Überschriftenstilen geschriebene Überschriften werden `#`-Überschriften; mit 16 pt Fett vorgetäuschte Überschriften werden Absätze aus fettem Text. Nummerierte Listen teilen sich genauso auf, die Stile in Word zu reparieren schlägt also, das Markdown danach zu reparieren.

Das ist es wert, als Regel gesagt zu werden, denn es entscheidet, wo die Arbeit passiert. Ein Konverter kann Struktur lesen, die strukturell ausgedrückt wurde. Absicht kann er nicht lesen. Wenn das Dokument nach Augenmaß formatiert wurde — Fett statt Überschriften, Tabulatoren statt Listen, ein leerer Absatz statt einer Abstandsregel —, erzeugt die Konvertierung eine flache Wand aus Text, die technisch treu und nutzlos ist, und die billigste Abhilfe ist eine halbe Stunde in Word, in der Sie Stile anwenden, bevor Sie irgendetwas konvertieren. [Was eine `.docx`-Konvertierung behält und was sie fallen lässt](/blog/convert-docx-to-markdown) geht den Rest durch: verfolgte Änderungen, Kommentare, Textfelder, Fußnoten, eingebettete Objekte und die Bilder, die in einen Ordner neben der Datei herauskommen.

## Evernote, Bear, Apple Notes, Roam und alles andere

Diese vier kommen oft genug vor, um sie zu nennen, und jedes hat einen Weg, der es wert ist, gekannt zu werden. Der letzte Eintrag ist der Rückfall für alles, was nirgends oben genannt ist.

**Evernote.** Wählen Sie Notizen oder ein Notizbuch und exportieren Sie als ENEX, als einseitiges HTML oder als mehrseitiges HTML; der Export ist auf 100 Notizen auf einmal begrenzt, ein ganzes Notizbuch kann allerdings in einem Zug gehen (geprüft auf help.evernote.com, 9. September 2026). ENEX ist ein XML-Container, den nur Evernote und seine Importeure lesen, nehmen Sie also, sofern Sie nicht zu etwas umziehen, das ENEX importiert, den mehrseitigen HTML-Export: Er gibt Ihnen eine HTML-Datei pro Notiz, einen zwischen ihnen geteilten Ressourcenordner und einen Index, der sie verbindet. Von dort ist es derselbe Schritt von HTML zu Markdown wie bei allem anderen.

**Bear.** Eine einzelne Notiz exportiert als `.txt`, `.md`, `.textbundle`, `.bearnote` oder `.rtf`, mit HTML, DOCX, PDF, JPG und ePub für Bear Pro; mehrere Notizen auf einmal gehen auf dem Mac über File → Export notes (geprüft auf bear.app, 9. September 2026). Nehmen Sie Textbundle statt einfachem Markdown, wenn die Notizen Bilder haben — ein Textbundle ist das Markdown und seine Assets in einem Paket, was genau das Problem ist, das eine nackte `.md` nicht lösen kann. Bears Tags werden als `#tag` im Text geschrieben, und ein Standardkonverter liest eine Zeile, die mit `#` beginnt, als Überschrift, eine Zeile voller Tags muss also vor der Konvertierung behandelt werden statt danach.

**Apple Notes.** Auf dem Mac bietet File → Export as PDF und Markdown an, und die Importseite akzeptiert TXT, RTF, RTFD, HTML und Evernotes ENEX, mit einem eigenen File → Import Markdown (geprüft auf support.apple.com, 9. September 2026). Es geht notizweise: Es gibt keinen Export der ganzen Bibliothek, alles jenseits von ein paar Dutzend Notizen heißt also, in Stapeln auszuwählen. Anhänge sind nicht Teil des Markdown-Exports.

**Roam.** Roam ist gliederungsorientiert: Jeder Punkt ist ein Block mit einer ID, und sowohl Blockreferenzen als auch Queries sind Zeiger in den Graphen statt Text auf einer Seite. Welches Exportformat Sie auch wählen, diese zwei Konstrukte haben kein Markdown-Äquivalent — eine Referenz muss als ihr Text eingefügt oder verworfen werden, und eine Query hat kein Ergebnis, das sie tragen könnte. Lesen Sie das Export-Menü in Ihrem eigenen Graphen, bevor Sie um ein Format herum planen, und planen Sie das Umschreiben der Referenzen so oder so ein.

**Alles andere.** Für ein Werkzeug ohne eigenen Konverter — ein alterndes Wiki, ein CMS, ein Hilfecenter, eine E-Mail — nehmen Sie, welches HTML es auch ausgibt, und führen einen Schritt von HTML zu Markdown aus, denn HTML ist das eine Format, das nahezu alles erzeugen kann. Wenn es überhaupt keinen Export gibt, ist der Browser der Export: Speichern Sie die dargestellte Seite, oder kopieren Sie den Artikelbereich heraus. Was Sie bekommen, ist das ganze Seitenmobiliar zusammen mit dem Inhalt, auf die Konvertierung folgt also ein Beschneidungsschritt, und das Beschneiden ist meist ein Selektor.

## Tausend Seiten migrieren, wo die Ein-Klick-Antwort scheitert

Alles oben beschreibt ein Dokument. Eine Migration ist ein anderes Problem, und die ehrliche Version davon geht so.

| Umfang | Was es tatsächlich kostet | Was zu tun ist |
| --- | --- | --- |
| Unter 10 Seiten | eine Stunde, vielleicht zwei | von Hand reparieren, in der Reihenfolge, in der ein Leser es merkt |
| 10 bis 50 | einen Nachmittag | von Hand reparieren, aber eine Liste der wiederkehrenden Defekte führen |
| 50 bis 200 | einen Tag Handarbeit, oder einen halben Tag Skript | die zwei oder drei wiederkehrenden Defekte skripten, den Rest von Hand |
| 200 und mehr | Tage, so oder so | das Skript schreiben, und den zweiten Durchgang einplanen |

Die Schwelle liegt nicht niedriger, weil das Skript kein Konverter ist. Die Konvertierung ist der leichte Teil — ein Bibliotheksaufruf pro Datei. Das Skript ist ein Umschreibeproblem, und es enthält vier getrennte Umschreibungen, von denen jede fertig und korrekt sein kann, während die anderen drei kaputt sind.

**Dateinamen.** Streichen Sie das ID-Suffix, slugifizieren Sie, was übrig ist, und lösen Sie die Kollisionen: Zwei Seiten namens „Meeting notes" unter verschiedenen Eltern sind nach der Slugifizierung ein Dateiname. Bauen Sie eine Abbildung vom alten Pfad auf den neuen und schreiben Sie sie auf die Platte, denn Sie werden sie noch dreimal brauchen, und noch einmal in sechs Monaten, wenn jemand fragt, wo eine Seite hin ist.

**Links.** Jeder interne Link im Export ist gegen den alten Dateinamen geschrieben, prozentkodiert. Schreiben Sie jeden durch die Abbildung um. Links, die stattdessen auf die lebende Anwendung zeigten — eine absolute URL in den Workspace oder das Wiki —, sind ein zweiter Satz, über ID oder Seitenschlüssel gefunden statt über den Dateinamen, und sie sind die, die an dem Tag, an dem Sie das alte System abschalten, noch still funktionieren und am Tag danach still kaputt sind.

**Anhänge.** Verschieben Sie sie in ein einziges Assets-Verzeichnis, schreiben Sie das `src` jedes Bildes um, und entdoppeln Sie: dasselbe Logo, in vierzig Seitenordner exportiert, sind vierzig Dateien. Namen mit Leerzeichen, Akzenten oder Emoji-Zeichen werden hier normalisiert, einmal, statt in irgendeinem Renderer, der sich als erster über sie beschwert.

**Anker.** Überschriften-IDs werden von dem erzeugt, was das Markdown darstellt, und die neue Regel wird nicht zur alten passen. Seiteninterne Links und jeder Inhaltsverzeichnis-Block müssen neu erzeugt werden, nicht umgeschrieben.

Machen Sie alle vier in einem Durchgang über ein geparstes Dokument statt mit einer Kette regulärer Ausdrücke über den Rohtext. Eine Regex, die `](...)` umschreibt, schreibt auch das Innere eines eingezäunten Codeblocks um, und die Seite, auf der Sie das merken, ist die im Stapel, die die Link-Syntax dokumentiert. Parsen, den Baum durchlaufen, wieder herausschreiben. Sobald der Baum richtig ist, ist [die Konvertierung über das ganze Verzeichnis laufen zu lassen](/blog/batch-convert-markdown-files) der kurze Teil.

### Was Sie prüfen sollten, bevor Sie sich auf ein Skript festlegen

Nehmen Sie sechs Seiten, nicht eine, und wählen Sie sie bewusst: die längste Seite, die am häufigsten verlinkte Seite, die mit den meisten Bildern, eine datenbank- oder tabellenlastige Seite, eine, die sich auf die eigenen Konstrukte des Werkzeugs stützt — Callouts, Makros, Embeds — und eine, die von der Person im Team geschrieben wurde, die die Anwendung am ungewöhnlichsten nutzt. Die letzte findet mehr Defekte als die anderen fünf zusammen.

Nehmen Sie alle sechs durch den ganzen Weg, bis zu fertigem HTML, und prüfen Sie jede gegen die Liste unten. Was an der Stichprobe scheitert, ist, was das Skript behandeln muss; was das Skript nicht behandeln kann, ist, was jemand von Hand repariert, und Sie wissen jetzt, wie viele Seiten das sind.

- [ ] **Links.** Die internen zuerst: Sie zeigen noch auf die alten URLs oder auf Dateinamen, die es nicht mehr gibt.
- [ ] **Bilder.** Öffnen Sie die konvertierte Datei von irgendwo anders als aus dem Exportordner.
- [ ] **Tabellen.** Verbundene Zellen und verschachtelter Inhalt haben keine Markdown-Form; sie kommen abgeflacht oder gar nicht an.
- [ ] **Callouts und Panels.** Wählen Sie einen Ersatz, ein Blockquote mit fetter Einleitung, und nehmen Sie ihn überall.
- [ ] **Codeblöcke.** Prüfen Sie, ob die Sprachhinweise durchgekommen sind und ob die Autokorrektur keine typografischen Anführungszeichen in den Code gesetzt hat.
- [ ] **Anker.** Klicken Sie jeden seiteninternen Link an, auch die, die ein Inhaltsverzeichnis-Block erzeugt hat.
- [ ] **Frontmatter.** Entscheiden Sie vor dem Lauf des Skripts, welche Metadaten Sie behalten, nicht danach.
- [ ] **Kodierung.** Geschützte Leerzeichen, weiche Trennstriche und typografische Anführungszeichen reisen unsichtbar mit und brechen Suchen und Diffs.
- [ ] **Kollisionen.** Zwei Seiten, die ein Dateiname geworden sind, sind ein stiller Datenverlust, und das einzige Symptom ist eine Datei mit dem falschen Inhalt darin.

### Die Reihenfolge der Arbeitsschritte

Lassen Sie das Skript jedes Mal in ein frisches Ausgabeverzeichnis laufen, damit ein schlechter Lauf gelöscht statt entwirrt wird, und niemals in den Exportordner selbst. Diffen Sie den zweiten Lauf gegen den ersten: Dieser Diff ist das Einzige, was Ihnen sagt, was Ihre Korrektur geändert hat und was sie versehentlich geändert hat. Und entscheiden Sie vorab, ob das alte System während der Migration eingefroren ist oder ob Sie ein Delta akzeptieren und die Seiten, die sich bewegt haben, neu exportieren — beides ist machbar, und hinterher herauszufinden, welches Sie gewählt haben, ist es nicht.

## Wie Sie den Weg hinaus wählen

1. **Einmal exportieren, und das Archiv behalten.** Wenn Sie an Ort und Stelle konvertieren, können Sie das Skript nicht erneut laufen lassen, und Sie werden es erneut laufen lassen — wahrscheinlich dreimal.
2. **Wählen Sie den Weg nach dem, was Sie behalten müssen, nicht nach den wenigsten Klicks.** Wenn das Dokument Screenshots hat, war der Weg über eine einzelne Markdown-Datei schon falsch, bevor Sie angefangen haben, und keine Reparatur danach setzt die Bilder zurück.
3. **Bevorzugen Sie den Export, der Assets mitpackt, gegenüber dem, der sie verlinkt.** Ein Pfad, der eine Sitzung braucht, ist für Sie ein funktionierendes Bild und für jeden Leser ein kaputter Kasten, und Sie werden es nicht merken, weil Sie angemeldet sind.
4. **Entscheiden Sie vor der Konvertierung, was jedes Konstrukt ersetzt, nicht danach.** Eine im Vorhinein gewählte Blockquote-Konvention schlägt fünfzig improvisierte, die im Review entdeckt werden, und das Zweite ist weit teurer aufzulösen.
5. **Konvertieren Sie ein repräsentatives Dokument von Anfang bis Ende, bevor der Rest kommt.** Es ganz bis zu fertigem HTML zu nehmen sagt Ihnen, ob die Abhilfe eine Einstellung, ein Suchen-und-Ersetzen oder ein Konverter ist — drei Antworten mit sehr unterschiedlichen Kosten.
6. **Zählen Sie die Seiten, bevor Sie Code schreiben.** Unter etwa zwanzig schlagen Hände ein Skript; über etwa zweihundert sind Hände eine Woche, die Sie nicht zurückbekommen.
7. **Behalten Sie die Abbildung von alt auf neu, welcher Umfang es auch ist.** Ohne sie können Sie keine Weiterleitungsliste schreiben, und ein Wiki ohne Weiterleitungen ist ein Wiki, in dem jedes Lesezeichen, das irgendwer gespeichert hat, jetzt ein 404 ist.

## Fazit

Jede dieser Anwendungen wird Ihnen etwas geben. Die Kunst ist zu wissen, welches Etwas, und es zu prüfen, bevor die Quelle weg ist: ein Notion-Zip, dessen Links alle auf IDs zeigen, ein Vault, dessen Wikilinks nichts anderes liest, ein Confluence-Space, in dem die Makros der nützliche Teil waren, ein Google Doc, dessen Bilder nie in der Datei standen. Nehmen Sie zuerst ein echtes Dokument durch den ganzen Weg, reparieren Sie, was bricht, und entscheiden Sie erst dann, ob der Rest ein Nachmittag Handarbeit oder ein Skript mit vier Umschreibungen darin ist. Wenn das Markdown endlich sauber ist, macht [TransformPipe](https://transformpipe.com) daraus eine Seite, die Sie teilen können, und sein CLI nimmt einen Stapel Dateien in einem Befehl, wobei `--merge` sie zu einem verkettet.

## FAQ

### Kann ich eine Notion-Seite direkt als Markdown exportieren?

Ja — der Export-Dialog bietet Markdown & CSV als Format, und eine einzelne Seite kommt als eine `.md`-Datei heraus, mit ihren Bildern in einem Ordner daneben. Datenbanken in diesem Export werden CSV-Dateien statt Markdown-Tabellen, und jeder Dateiname und jeder interne Link trägt die Seiten-ID.

### Warum stehen lange Codes in meinen Notion-Dateinamen?

Weil Notion Seiten über IDs identifiziert und der Titel nur ein Etikett ist, hängt der Export die Seiten-ID an, um Namen eindeutig zu halten. Diese ID ist dieselbe, die in der URL der Seite steht, was sie zu einem brauchbaren Schlüssel macht: Bauen Sie eine Abbildung von ID auf neuen Dateinamen und schreiben Sie dann die Links und die Dateinamen in einem Durchgang um.

### Wie bekomme ich eine Confluence-Seite nach Markdown?

Es gibt keinen Markdown-Export, Sie exportieren also HTML und konvertieren es. Ein ganzer Space exportiert nach gezipptem HTML, wenn Sie Space-Admin sind, was auch der einzige Weg ist, der die Anhänge mitpackt; eine einzelne Seite bietet nur Word und PDF, und PDF ist eine Sackgasse. Makros kommen als das HTML durch, zu dem sie dargestellt wurden.

### Funktionieren Obsidian-Notizen in anderen Markdown-Werkzeugen?

Das einfache Markdown ja. Wikilinks, Embeds, Blockreferenzen und Callouts nicht, denn sie sind Obsidians eigene Syntax und ein Standardparser gibt sie als wörtlichen Text aus. Schalten Sie die Wikilink-Einstellung ab, damit neue Links Standard sind, und schreiben Sie die bestehenden um, bevor Sie konvertieren.

### Behält ein Export aus Google Docs meine Bilder und Kommentare?

Bilder überleben den Download als Webseite, der Ihnen ein Zip mit einem Bilderordner gibt, und sie überleben den Markdown-Download nicht, der eine einzelne Datei ohne Platz dafür ist. Kommentare und Änderungsvorschläge überleben keinen der beiden Wege, lösen Sie sie also auf und nehmen Sie jeden Vorschlag an oder lehnen Sie ihn ab, bevor Sie exportieren.

### Was ist der schnellste Weg, ein ganzes Wiki nach Markdown zu bringen?

Einmal exportieren, eine repräsentative Seite ganz bis zu fertigem HTML konvertieren und sich von dem, was an dieser Seite bricht, sagen lassen, ob Sie ein Skript brauchen. Wenn ja, behandeln Sie es als Umschreibearbeit an Dateinamen, Links, Anhangspfaden und Ankern statt als Konvertierungsarbeit, und behalten Sie die Abbildung von alt auf neu, damit Sie Weiterleitungen schreiben können.

### Welche Exporte behalten Kommentare und Diskussion?

Fast keiner. Notion-Kommentare stehen nicht im Export, Confluence-Seitenkommentare fehlen im HTML-Export und sind nie in einem PDF, und Google-Docs-Kommentare kommen in keinem Downloadformat heraus. Wenn eine Entscheidung nur in einem Kommentarfaden existiert, kopieren Sie sie in den Text des Dokuments, bevor Sie irgendetwas exportieren.
