---
title: "Was von einer .docx nicht bleibt: welche Formatierung von docx zu Markdown verloren geht"
description: "Was eine Word-Datei trägt und Markdown nicht ausdrücken kann, welche Verluste zählen, welche Gewohnheiten Sie loswerden und was mit Beschriftungen zu tun ist"
date: 2026-08-17
tag: Konvertieren
keywords: docx zu markdown formatierung verloren, word zu markdown verliert formatierung, docx konvertierung verliert formatvorlagen, word beschriftungen markdown, word querverweise markdown, verfolgte änderungen markdown, docx seitenumbrüche markdown
---

Sie wandeln ein Word-Dokument in Markdown um, und irgendetwas fehlt. Manchmal ist es das hervorgehobene Zitat auf Seite zwei. Manchmal ist es die Nummerierung. Manchmal ist es nichts, was Sie benennen könnten, nur ein Gefühl: Das Dokument sah früher wie ein Dokument aus und sieht jetzt wie eine Textdatei aus.

Beide Reaktionen haben meist recht, und sie handeln von verschiedenen Dingen. Eine `.docx` trägt hunderte einzelne Informationen darüber, wie ihre Wörter erscheinen sollen. Markdown trägt etwa ein Dutzend Informationen darüber, was seine Wörter sind. Zwischen beiden zu konvertieren ist keine Komprimierung, es ist ein Themenwechsel. Die interessante Frage ist nicht, wie viel verloren ging, sondern welche der Verluste Sie kümmern sollten.

### TL;DR

Das meiste, was eine `.docx` auf dem Weg nach Markdown verliert, ist Darstellung, und Darstellung ist der Teil, den Sie ohnehin überschrieben hätten: Schriften, Größen, Farben, Ränder, Seitenumbrüche, Spalten, Kopf- und Fußzeilen beschreiben alle eine gedruckte Seite, die es nicht mehr gibt. Vier Verluste sind echt und die Arbeit wert: **verfolgte Änderungen**, **Kommentare**, **Beschriftungen** und **Querverweise**, denn jeder von ihnen trägt eine Bedeutung, die sich aus den Wörtern allein nicht wiederherstellen lässt. Textfelder sind der Verlust, den man am häufigsten übersieht, denn der Text ist einfach nicht da, und nichts warnt Sie. Reparieren Sie Beschriftungen und Querverweise vor der Konvertierung von Hand, behalten Sie die Review-Schicht mit einem Werkzeug, das ein dokumentiertes Flag dafür hat, und archivieren Sie das Original in jedem Fall.

## Was Markdown hat, und warum die Liste so kurz ist

Es hilft, das ganze Zielformat auf einmal zu sehen. Markdown gibt Ihnen, in der CommonMark-Spezifikation: Absätze, sechs Überschriftenebenen, Betonung, starke Betonung, geordnete und ungeordnete Listen, Blockzitate, Code-Spannen, eingezäunte und eingerückte Codeblöcke, thematische Trennlinien, Links, Bilder, harte Zeilenumbrüche und rohes HTML. GitHub Flavored Markdown ergänzt Tabellen, Einträge von Aufgabenlisten, Durchgestrichenes und Autolinks. Fußnoten stehen in keiner der beiden Spezifikationen; GitHub stellt sie dar und viele Parser nicht, was [zu wissen lohnt, bevor Sie sich auf irgendeine Erweiterung verlassen](/blog/commonmark-gfm-and-the-flavours).

Das ist das gesamte Vokabular. Es gibt keine Syntax für eine Schriftart, einen Schriftgrad, eine Farbe, einen Rand, eine Seite, eine Spalte, eine Beschriftung, einen Querverweis, einen Kommentar, eine Einfügung, eine Löschung, ein Textfeld, einen Tabstopp oder eine Tabellenzelle, die zwei Spalten überspannt. Nicht „eingeschränkt unterstützt" — überhaupt keine Syntax. Jedes Werkzeug, das eines dieser Dinge zu erhalten scheint, gibt rohes HTML mit einem `style`-Attribut aus, und das ist ein anderes Dokument mit einer `.md`-Endung darüber.

Die Liste ist kurz, weil das eine Entwurfsentscheidung war und kein Versehen. Markdown beschreibt Struktur: Das ist eine Überschrift, das ist eine Liste, das ist ein Zitat. Wie eine Überschrift aussieht, ist das Problem eines anderen, später entschieden, von einem Stylesheet, einem Renderer oder einem Theme. Word beschreibt beides auf einmal und lässt Sie die Struktur ganz überspringen — Sie machen eine Überschrift, indem Sie eine Zeile markieren, 16 pt fett wählen und auf zentrieren drücken. Word stellt sie genau so dar, wie Sie es verlangt haben. Nichts in der Datei hält fest, dass es eine Überschrift war.

Dieser einzige Unterschied erklärt das meiste von dem, was Leute Formatierungsverlust nennen. Ein Konverter liest eine `.docx` und sucht nach Struktur. Wo das Dokument Struktur hat, ist die Konvertierung sauber und ein wenig langweilig. Wo im Dokument die Erscheinung für die Struktur einsteht, hat der Konverter nichts zu lesen, und die Erscheinung fällt weg, weil es keinen Ort für sie gibt. Das Dokument hat seine Überschriften nicht verloren. Es hatte nie welche.

## Die Aufstellung, Posten für Posten, mit einem Urteil

Alles, was eine `.docx` tragen kann, was Markdown davon ausdrücken kann und ob der Verlust Ihre Aufmerksamkeit verdient. „Betrauern" heißt: Die Information ist weg und lässt sich aus den Wörtern nicht rekonstruieren. „Gut, dass es weg ist" heißt: Das Dokument ist ohne sie besser. „Arbeit machen" heißt: Es zählt, und es gibt etwas Bestimmtes zu tun.

| Was die Word-Datei trägt | Markdown-Äquivalent | Urteil | Was dagegen zu tun ist |
| --- | --- | --- | --- |
| Schriftart und Schriftgrad | Keines | Gut, dass es weg ist | Nichts. Der Renderer entscheidet |
| Textfarbe und Farbmarkierung | Keines | Gut, dass es weg ist, außer die Farbe trug Bedeutung | Farbcodierung vor der Konvertierung durch Wörter ersetzen |
| Fett und Kursiv | `**` und `*` | Überlebt | Nichts |
| Kapitälchen, Kontur, Schatten, Zeichenabstand | Keines | Gut, dass es weg ist | Nichts |
| Hochgestellt und Tiefgestellt | Nur rohes HTML | Kleiner Verlust | `<sup>`/`<sub>` in der Ausgabe hinnehmen, oder umschreiben |
| Durchgestrichenes | `~~`, nur in GFM | Überlebt meist | Den Dialekt Ihres Renderers prüfen |
| Seitengröße, Ränder, Ausrichtung | Keines | Gut, dass es weg ist | Nichts. Es gibt keine Seiten |
| Seitenumbrüche | Keines | Gut, dass es weg ist | Übrige Leerzeilen und verirrte Marken löschen |
| Abschnittsumbrüche | Keines | Gut, dass es weg ist | Nichts, außer die Kopfzeilen wechselten je Abschnitt |
| Mehrere Spalten | Keines | Gut, dass es weg ist | Nichts. Die Leserichtung ist jetzt linear |
| Kopfzeilen, Fußzeilen, Seitenzahlen | Keines | Eine Zeile davon betrauern | „Vertraulich", Version oder Datum in den Text holen |
| Wasserzeichen | Keines | Betrauern, wenn es DRAFT sagte | Den Status ins Frontmatter oder in die erste Zeile setzen |
| Tabstopps, Füllzeichen, manuelle Ausrichtung | Keines | Gut, dass es weg ist | Gepunktete Inhaltslisten in echte Links umwandeln |
| Zeilenabstand, Einzüge, Abstand vor und nach | Keines | Gut, dass es weg ist | Nichts |
| Textfelder und hervorgehobene Zitate | Keines; der Text verschwindet meist | Betrauern, und prüfen | Die Ausgabe nach einer Wendung durchsuchen, die in einem davon stand |
| Formen, SmartArt, Diagramme, Schaubilder | Keines | Betrauern | Als Bilder exportieren und darauf verweisen |
| Bilder im Textfluss | Nur ein Verweis `![]()` | Überlebt als Verweis | Die Dateien extrahieren; jeden Pfad prüfen |
| Verfolgte Änderungen | Keines | Betrauern — das ist der teure Fall | Mit einem Werkzeug konvertieren, das sie behält, oder die `.docx` behalten |
| Kommentare | Keines | Betrauern | Den Strang vor der Konvertierung separat exportieren |
| Fuß- und Endnoten | Nur Erweiterungssyntax | Hängt vom Renderer ab | Ein Dokument mit Fußnoten von Anfang bis Ende testen |
| Beschriftungen | Keines | Arbeit machen | Als kursive Zeilen oder als HTML-`<figcaption>` umschreiben |
| Querverweise (`REF`, `PAGEREF`) | Keines; wird abgestandener Text | Arbeit machen | Vor oder nach der Konvertierung als Anker-Links umschreiben |
| Feldfunktion für das Inhaltsverzeichnis | Keines | Gut, dass es weg ist | Löschen; den Renderer ein neues bauen lassen |
| Index und Indexeinträge | Keines | Betrauern, selten | Den Verlust hinnehmen oder ein PDF behalten |
| Textmarken | Überschriftenanker, indirekt | Teilweise | Alles neu verankern, worauf Sie verlinkt haben |
| Hyperlinks | `[]()` | Überlebt | Relative und dokumentinterne Links prüfen |
| Nummerierte und gepunktete Listen | `1.` und `-` | Überlebt meist, fällt manchmal zusammen | Prüfen, ob `numbering.xml` im Archiv liegt |
| Einfache Tabellen | GFM-Tabellen | Überlebt | Die Spalten zählen |
| Verbundene Zellen, verschachtelte Tabellen, Blockinhalt in Zellen | Keines | Betrauern | Von Hand umformen oder als HTML behalten |
| Semantische Formatvorlagen: Überschrift 1-9, Zitat, Beschriftung | Überschriften, Blockzitate | Überlebt bei richtiger Verwendung | Dokumente reparieren, die Überschriften mit Fett vortäuschen |
| Dekorative Formatvorlagen: Listenabsatz, Textkörper, eigene | Keines | Gut, dass es weg ist | Nichts |
| Formeln (OMML) | Keines; manchmal verstümmelter Text | Betrauern | In TeX umschreiben oder als Bilder exportieren |
| Inhaltssteuerelemente und Formularfelder | Keines | Betrauern, wenn es ein Formular war | Das Dokument war eine Anwendung, kein Dokument |
| Eingebettete Objekte: Tabellenblätter, PDFs, andere Dokumente | Keines | Betrauern | Extrahieren und daneben ablegen |
| Dokumenteigenschaften: Autor, Titel, Firma, Revision | Frontmatter, wenn das Werkzeug es schreibt | Teilweise | Was zählt, selbst ins Frontmatter kopieren |
| Sprach- und Prüfmetadaten | Keines | Gut, dass es weg ist | Nichts |
| Berechnende Feldfunktionen: `DATE`, `STYLEREF`, `SEQ` | Eingefrorener Text aus dem Zwischenspeicher | Arbeit machen | Jede einzelne durch echten Text ersetzen |

## Darstellung: Schriften, Größen, Farben und Formatvorlagen ohne Bedeutung

Das ist die größte Kategorie nach Menge und die kleinste nach Folgen. Eine `.docx` hält für jeden Zeichenlauf einen Satz Eigenschaften fest: Schriftfamilie, Größe in Halbpunkten, Strichstärke, Farbe als Hex-Wert, Farbmarkierung, Abstand, Unterschneidung, ob es Kapitälchen sind. Markdown hält davon nichts fest, und das HTML, das ein guter Konverter unterwegs erzeugt, auch nicht. Die Eigenschaften werden einfach überlesen.

Für fast jedes Dokument ist das das richtige Ergebnis. Die 11 pt Calibri war Words Voreinstellung, keine Entscheidung. Die blauen Überschriften waren das Blau irgendeines Themes, das 2019 angewandt wurde. Der eine Absatz in Georgia ist die Stelle, an der jemand aus einer E-Mail eingefügt hat. Nichts davon überlebt, nichts davon sollte es, und das Dokument liest sich besser, sobald ein einziges Stylesheet alles davon einheitlich entscheidet.

Es gibt eine Ausnahme, und die ist ernst zu nehmen. Manchmal ist Farbe der einzige Ort, an dem eine Bedeutung wohnt. Eine Spezifikation, in der roter Text „noch nicht vereinbart" heißt. Eine Preisliste, in der Grün „bestätigt" heißt. Ein Übersetzungsentwurf, in dem die farbig markierten Passagen die sind, die geprüft werden müssen. Konvertieren Sie dieses Dokument, und Sie erhalten eine flache Liste von Posten ohne jede Möglichkeit zu erkennen, welche welche waren, und die Wörter selbst sagen es Ihnen nicht, denn der ganze Sinn der Farbe war, dass die Wörter es nicht sagen mussten.

Die Lösung ist keine Einstellung im Konverter. Es gibt keine Syntax, in die sich die Farbe umwandeln ließe. Die Lösung ist, vorher zwanzig Minuten in Word zu verbringen und das Wort hinzuzufügen, für das die Farbe stand — „(nicht vereinbart)", „(bestätigt)", „(zu prüfen)" — und dann zu konvertieren. Es ist mühsam, und es ist das Einzige, was funktioniert, und es ist vor der Konvertierung viel leichter als danach, denn vor der Konvertierung sehen Sie noch, welche rot waren.

**Formatvorlagen sind dasselbe Problem mit einer anderen Oberfläche.** Words Mechanismus der Formatvorlagen ist wirklich gut: Ein Absatz trägt ein `w:pStyle`, das seine Formatvorlage benennt, und die Definition der Formatvorlage liegt in `word/styles.xml`. Konverter lesen den Namen der Formatvorlage und ordnen ihn zu. Überschrift 1 wird `#`, Überschrift 2 wird `##`, Zitat wird ein Blockzitat. mammoth liefert eine Stilzuordnung als Voreinstellung mit, die genau das tut, und lässt Sie eigene Zuordnungen für Hausformate hinzufügen, von denen es nichts wissen kann.

Die Schwierigkeit ist, dass die meisten Word-Dokumente Formatvorlagen nicht für Struktur verwenden. Sie verwenden Standard für alles und greifen zur Werkzeugleiste. Ein so geschriebenes Dokument konvertiert zu einer langen Folge von Absätzen, und zwar korrekt, denn genau das ist es. Die Überschrift, die Sie auf dem Bildschirm sehen, ist ein Absatz, dessen Lauf-Eigenschaften zufällig fett und 16 pt sagen, und kein Konverter wird sie befördern, denn sie zu befördern hieße zu raten — und dasselbe Dokument hat irgendwo mitten in einem Satz fett und 16 pt, wo jemand einen Produktnamen betont hat.

Dann gibt es die andere Hälfte der Liste der Formatvorlagen: Listenabsatz, Textkörper, Textkörper-Einzug, Kein Abstand, und dazu, was auch immer eine Vorlage von einer Vorlage geerbt hat, die vom Hausformat einer Firma aus dem Jahr 2011 stammt. Diese beschreiben Einzug und Abstand. Sie haben keinen semantischen Gehalt, sie ordnen sich auf nichts ab, und sie fallen zu lassen ist kein Verlust irgendeiner Art. Wenn Sie ein Dokument konvertiert haben und die Ausgabe keine Spur von „Listenabsatz" enthält, ist nichts schiefgegangen.

## Seitenmobiliar und Inhalt, der schwebt

Alles in diesem Abschnitt beschreibt eine gedruckte Seite. Markdown hat keine Seiten, und HTML, das in einem Browser dargestellt wird, hat auch keine, bis jemand es druckt. Diese Verluste sind also strukturell und nicht zufällig — es gibt auf der anderen Seite nichts, was sie empfangen könnte.

**Ränder, Seitengröße, Ausrichtung und Spalten** leben in einem Element mit Abschnittseigenschaften, `w:sectPr`, am Ende eines Abschnitts. Es hält die Papiergröße fest, die vier Ränder, den Bundsteg, ob Seiten gespiegelt werden, und das Spaltenlayout. Alles davon geht. Bemerkenswerterweise geht auch das Problem der Leserichtung, das Spalten erzeugen: Ein zweispaltiges Layout in Word ist eine durchgehende Erzählung, in zwei Kästen gegossen, und die Konvertierung erzeugt die Erzählung in der richtigen Reihenfolge. Leute erwarten, dass das bricht, und meist bricht es nicht.

**Seitenumbrüche** sind ein Lauf, der `<w:br w:type="page"/>` enthält, oder eine Absatzeigenschaft, die Seitenumbruch oberhalb sagt. Es gibt kein Markdown dafür, weil es keine Seite zum Umbrechen gibt. Die meisten Konverter verwerfen sie lautlos. Wenn Ihre Ausgabe eine sonderbare Leerzeile oder eine verirrte Marke hat, wo früher ein Kapitel begann, ist das der Rückstand. Löschen Sie ihn. Wenn das Dokument später für den Druck wirklich umbrechen muss, ist der Ort, das zu sagen, das CSS dessen, was es darstellt — `break-before: page` auf einer Überschriftenklasse — und nicht das Markdown.

**Kopfzeilen, Fußzeilen und Seitenzahlen** sind eigene Teile im Archiv: `word/header1.xml`, `word/footer1.xml` und ihre Geschwister, referenziert aus den Abschnittseigenschaften. Alles verwirft sie, und normalerweise ist das richtig, denn „Seite 3 von 12" ist in einem Dokument ohne Seiten bedeutungslos.

Eine Zeile einer Fußzeile ist meist wert, gerettet zu werden. Ein Dokument, dessen Fußzeile „Vertraulich — nur intern — v4.2 — geprüft am 12. März" lautete, ist jetzt neu veröffentlicht, in einem leicht zu teilenden Format, und nichts davon steht darauf. Die Einstufung, die Version und das Prüfdatum standen immer nur im Mobiliar. Lesen Sie vor der Konvertierung Kopf- und Fußzeile einmal, und setzen Sie, was zählt, in das Frontmatter oder in die erste Zeile des Textes, wo ein Leser ihm tatsächlich begegnet.

**Wasserzeichen** sind dieselbe Geschichte in dramatischerer Form. Ein DRAFT-Wasserzeichen ist eine Form in der Kopfzeile, hinter den Text gezeichnet. Es konvertiert zu nichts, ein Entwurf wird also von einem Endstand nicht mehr zu unterscheiden. Sagen Sie „Entwurf" in Worten.

**Textfelder sind der Verlust, den Leute am schwersten glauben können.** Ein Textfeld ist nicht Teil des Dokumentflusses; es ist ein Zeichnungsobjekt, und der Text darin sitzt in einem `w:txbxContent`-Element, das an eine Form gehängt ist. Je nachdem, wie es erzeugt wurde, kann diese Form in einen Block mit Alternativinhalt gepackt sein, der zwei Versionen von sich selbst für verschiedene Word-Versionen hält. Konverter, die den Dokumentkörper nach Absätzen durchlaufen, erreichen sein Inneres vielleicht nie. Das hervorgehobene Zitat, das Sie auf dem Bildschirm sehen, die Randspalte mit der wichtigen Definition darin, der farbige Kasten mit der Zusammenfassung in drei Sätzen, nach der jemand später fragen wird — nichts davon erscheint in der Ausgabe, und kein Fehler wird gemeldet, denn aus Sicht des Konverters wurde nichts übersprungen.

Die einzige verlässliche Prüfung ist die Suche. Nehmen Sie aus jedem eingekastelten Element im Original eine Wendung, eine nach der anderen, und suchen Sie in der konvertierten Datei danach. Fehlt sie, tippen Sie sie neu — als Blockzitat, als Überschrift oder als gewöhnlichen Absatz an der Stelle, an die er gehört. Und tun Sie das, bevor Sie die `.docx` archivieren, denn die Suche ist leicht, solange beide Dateien offen sind, und unmöglich, sobald Sie nur noch eine haben.

**Formen, SmartArt, Diagramme und Schaubilder** gehen denselben Weg und aus demselben Grund, außer dass der Verlust hier unstrittig ist: Ein Prozessdiagramm ist Information, und Markdown hat keine Möglichkeit, sie zu halten. Exportieren Sie jedes einzelne als PNG oder SVG aus Word, legen Sie die Dateien an einen stabilen Ort, und verweisen Sie darauf. Das macht aus einem Totalverlust eine Abhängigkeit von Bildern, was ein viel kleineres Problem ist — allerdings kein kostenloses, denn [ein Bildverweis, der lokal funktioniert, kann beim Verschieben der Datei dennoch brechen](/blog/images-and-links-that-still-work).

## Die Review-Schicht: verfolgte Änderungen und Kommentare

Das ist die Kategorie, in der eine unachtsame Konvertierung etwas zerstört, was niemand wiederaufbauen kann.

Eine geprüfte `.docx` enthält nicht den endgültigen Text. Sie enthält beide Texte auf einmal: Einfügungen in `w:ins` gewickelt, Löschungen in `w:del` gewickelt, jede mit einem Autor und einem Zeitstempel, und der gelöschte Text vollständig in der Löschung bewahrt. Das ist es, was Words Überarbeitungsbereich möglich macht. Es ist auch das, was ein Word-Dokument zum Protokoll einer Verhandlung macht statt zur Aussage einer Position.

Markdown hat dafür nichts. Es gibt keine Syntax für „diese Klausel wurde am Dienstag von der Gegenseite eingefügt" und keine Syntax für „diese elf Wörter wurden entfernt". Ein Konverter muss also entscheiden, und die meisten entscheiden, ohne es Ihnen zu sagen. Das übliche Verhalten ist, Ihnen den Text zu geben, als wären alle Änderungen angenommen — eine von drei plausiblen Antworten, stillschweigend angewandt, auf eine Frage, die Ihnen nicht gestellt wurde. Die Löschungen von irgendjemandem sind jetzt weg, und mit ihnen die Tatsache, dass sie überhaupt vorgeschlagen wurden.

Pandoc ist hier das Werkzeug mit einer dokumentierten Kontrolle: `--track-changes` nimmt `accept`, `reject` oder `all`, und nur `all` behält beide Versionen in der Ausgabe, in Spans eingepackt. mammoths Ansatz ist anders — es arbeitet von einer Stilzuordnung aus, und das Markup des Reviews ist nichts, was seine Voreinstellungen an die Oberfläche bringen. Die praktische Folge ist in beiden Fällen dieselbe: Wenn ein Dokument durch ein Review gegangen ist und Sie das Review nicht absichtlich bewahren, konvertieren Sie das Ergebnis und werfen die Auseinandersetzung weg.

**Kommentare sind schlimmer, weil sie sich an nichts hängen können.** Ein Word-Kommentar ist mit den Marken `w:commentRangeStart` und `w:commentRangeEnd` an einen Textbereich verankert, und der Kommentartext selbst lebt in `word/comments.xml` mit einem Autor, einem Datum und möglicherweise einem Strang von Antworten. Markdown kennt das Konzept einer Bereichsanmerkung nicht. Selbst wenn ein Konverter den Kommentartext ausschreiben würde, könnte er ihn nur neben den Text setzen, nicht auf ihn, und die Verankerung ist die Hälfte der Bedeutung: „dies" in einem Kommentar bezieht sich auf genau die Wörter, an die er gehängt war.

Pandocs Handbuch ist ausdrücklich: `accept` und `reject` ignorieren Kommentare, und nur `all` schließt sie ein. mammoth kann dazu gebracht werden, Kommentarverweise auszugeben, wenn Sie eine Stilzuordnung dafür hinzufügen, was seine Dokumentation abdeckt und fast niemand tut. Alles andere verwirft sie und sagt nichts.

Der ehrliche Rat ist, dies nicht länger als Problem der Konvertierung zu behandeln. Wenn der Kommentarstrang zählt — und bei einem Vertrag, einer Spezifikation oder einem Aufsatz ist er oft das Wertvollste in der Datei —, holen Sie ihn zuerst zu seinen eigenen Bedingungen aus Word heraus. Word kann das Dokument mit Kommentaren drucken oder exportieren, und ein PDF der markierten Fassung ist ein völlig gutes Archiv. Konvertieren Sie dann den sauberen Text nach Markdown für die Zukunft, und behalten Sie die markierte Kopie für die Vergangenheit. Zwei Dateien, jede gut in einer Aufgabe, sind ein besseres Ergebnis als eine Datei, die vorgibt, beides zu tun.

Fußnoten sitzen am Rand dieser Kategorie. Sie haben zumindest ein mögliches Zuhause: `word/footnotes.xml` hält sie, und Pandocs eigener Markdown-Dialekt hat eine Fußnotensyntax, um sie hineinzuschreiben. Aber Fußnoten stehen nicht in CommonMark, ein Konverter, der strenges CommonMark anstrebt, muss sie also einbetten, als gewöhnliche Absätze am Ende anhängen oder verwerfen. Konvertieren Sie ein Dokument mit Fußnoten, scrollen Sie nach unten, und sehen Sie hin, bevor Sie annehmen, das Verhalten, das Sie wollen, sei das Verhalten, das Sie haben.

## Beschriftungen, Querverweise und Feldfunktionen: die Verluste, für die Arbeit sich lohnt

Diese verdienen einen eigenen Abschnitt, denn sie sind die einzigen Verluste in diesem Artikel, bei denen eine bestimmte, wiederholbare Arbeit ein schlechtes Ergebnis verlässlich in ein gutes verwandelt.

**Eine Beschriftung in Word ist keine Textzeile unter einem Bild.** Sie ist ein Absatz in der Formatvorlage Beschriftung, der eine `SEQ`-Feldfunktion enthält — etwas wie `SEQ Figure \* ARABIC` —, die Word berechnet, um die Nummer zu erzeugen. Deshalb nummeriert das Einfügen einer neuen Abbildung mitten in einem Dokument alles danach neu. Die Nummer ist nicht aufgeschrieben; sie ist aus der Position abgeleitet.

Konvertieren Sie dieses Dokument, und zwei Dinge passieren. Die Formatvorlage Beschriftung hat kein Markdown-Äquivalent, der Absatz wird also ein gewöhnlicher Absatz, optisch nicht von Fließtext zu unterscheiden. Und die Feldfunktion fällt zu der Nummer zusammen, die Word zuletzt berechnet hat, eingefroren. Sie haben jetzt ein Dokument, in dem „Abbildung 4" ein einfacher Satz zwischen zwei Absätzen ist, und es wird noch 4 sagen, nachdem Sie Abbildung 2 gelöscht haben.

Es gibt zwei anständige Lösungen und eine schlechte. Die schlechte ist, sie stehen zu lassen und zu hoffen. Die erste anständige ist, zu akzeptieren, dass die Beschriftung jetzt Prosa ist, und sie absichtlich aussehen zu lassen: eine kursive Zeile unmittelbar nach dem Bild, mit der Nummerierung entweder ganz entfernt oder von Hand neu vergeben und dann nie wieder angefasst. Die Nummern zu entfernen ist meist besser, denn eine Beschriftung, die sagt, was die Abbildung zeigt, ist nützlicher als eine, die sagt, welche Abbildung es ist, und sie kann nicht veralten.

Die zweite ist, die Semantik zu behalten, indem Sie in HTML abtauchen, was Markdown erlaubt: ein `<figure>`-Element, das das Bild umschließt, mit einem `<figcaption>` darin. Das gibt einem Renderer etwas Echtes zum Gestalten und einem Screenreader etwas Echtes zum Ansagen. Es kostet Sie an dieser Stelle die Lesbarkeit des Markdown-Quelltextes, und es ist der richtige Handel für Dokumente, in denen Abbildungen tragend sind — ein Aufsatz, ein Handbuch, ein Bericht mit zwanzig Diagrammen darin. Pandocs Markdown hat eine Erweiterung `implicit_figures`, die einen Absatz, der nur ein Bild enthält, als Abbildung mit dem Alt-Text als Beschriftung behandelt; das ist wissenswert, wenn Sie ohnehin über Pandoc konvertieren, denn es heißt, dass die Beschriftung als Alt-Text zu schreiben Ihnen die Struktur gratis gibt.

**Querverweise sind derselbe Mechanismus, nach innen gerichtet, und sie scheitern leiser.** „Siehe Abschnitt 4.2 auf Seite 11" ist in der Datei eine `REF`-Feldfunktion, die auf eine Textmarke zeigt, und eine `PAGEREF`-Feldfunktion, die auf die Seite derselben Textmarke zeigt. Word berechnet beide neu. Markdown hat keines von beiden, und die Textmarke selbst hat auch kein Äquivalent, was Sie also bekommen, ist der zwischengespeicherte Text: ein Satz, der „siehe Abschnitt 4.2 auf Seite 11" sagt, in einem Dokument ohne so nummerierte Abschnitte und ohne Seite 11.

Das ist schlimmer als eine fehlende Beschriftung, weil es nicht sichtbar kaputt ist. Es liest sich wie ein funktionierender Querverweis. Ein Leser folgt ihm, findet nichts und schließt, das Dokument sei falsch statt konvertiert.

Die Arbeit ist mechanisch und lohnt sich. Suchen Sie in der konvertierten Datei nach „siehe", „oben", „unten", „Seite", „Abschnitt", „Abbildung", „Tabelle" und „Anhang", und behandeln Sie jeden Treffer:

- Ein Verweis auf eine Überschrift wird ein Link auf den Anker dieser Überschrift. Markdown-Renderer erzeugen Anker aus dem Überschriftentext — meist kleingeschrieben und mit Bindestrichen statt Leerzeichen, wobei die genaue Regel je Renderer abweicht, prüfen Sie also einen, bevor Sie fünfzig schreiben. `[die Aufbewahrungsregeln](#datenaufbewahrung)` überlebt eine Neunummerierung, weil er auf die Wörter zeigt und nicht auf die Nummer.
- Ein Verweis auf eine Seitenzahl muss weg. Es gibt keine Seite. Schreiben Sie ihn als Verweis auf den Abschnitt um, oder löschen Sie den Satzteil.
- Ein Verweis auf eine Abbildung oder Tabelle folgt dem, was Sie über Beschriftungen entschieden haben. Wenn Sie die Nummern weggelassen haben, muss der Verweis stattdessen die Sache benennen: „das Deployment-Diagramm" statt „Abbildung 4".
- Ein Verweis auf eine nummerierte Klausel in einem Vertrag oder einer Norm bleibt Text, denn die Nummerierung ist Teil des Inhalts und nicht etwas, das der Renderer berechnet.

**Das Inhaltsverzeichnis braucht überhaupt keine Arbeit, nur Löschung.** Ein Word-Inhaltsverzeichnis ist eine Feldfunktion, und was konvertiert, ist der zwischengespeicherte Text: eine Liste von Überschriften mit Füllzeichen und Seitenzahlen, die als gewöhnliche Absätze oben in Ihrem Dokument sitzt. Es kann sich nicht aktualisieren und wird binnen einer Woche abdriften. Löschen Sie das Ganze. Jeder Renderer für Dokumentation und die meisten Generatoren statischer Websites bauen eine Inhaltsliste aus den Überschriften, und die wird immer richtig sein, weil sie abgeleitet und nicht erinnert ist.

**Die anderen berechnenden Feldfunktionen verdienen je einen Durchgang.** `DATE` wird das Datum, an dem es zuletzt aktualisiert wurde, ein heute konvertierter Brief kann also behaupten, von dem Tag zu sein, an dem jemand ihn zuletzt in Word geöffnet hat. `STYLEREF`-Feldfunktionen, verbreitet in laufenden Kopfzeilen, wiederholen den Text einer Überschrift und frieren ihn ein. Die automatische Listennummerierung greift in all das hinein. Die allgemeine Regel ist einfach: Alles, was Word berechnet hat, ist jetzt ein Fossil der letzten Berechnung, lesen Sie also jede Zahl im konvertierten Dokument einmal und fragen Sie, woher sie kam.

## Wo „konvertieren und später reparieren" scheitert

Der offensichtliche Weg ist, die Konvertierung laufen zu lassen, die Ausgabe anzusehen und zu reparieren, was falsch ist. Für die meisten Dokumente ist das der richtige Weg, und er scheitert auf vier bestimmte Weisen, die zu kennen sich lohnt, bevor Sie sich darauf festlegen.

**Sie können nicht reparieren, was Sie nicht als fehlend sehen können.** Das ist das Problem der Textfelder, verallgemeinert. Reparieren funktioniert, wenn die Ausgabe sichtbar falsch ist: eine Tabelle mit verschobenen Spalten, eine Überschrift auf der falschen Ebene, ein kaputtes Bild. Es funktioniert nicht, wenn die Ausgabe lautlos unvollständig ist, denn es gibt keinen Hinweis. Nichts in einer konvertierten Datei sagt „hier war einmal eine Randspalte". Die einzige Verteidigung ist ein Vergleich mit dem Original, und ein Vergleich ist nur möglich, solange Sie das Original noch offen haben — was heißt, dass die Prüfung zur Zeit der Konvertierung stattfinden muss und nicht später, wenn jemand es merkt.

**Die Information, die Sie zur Reparatur brauchen, steht in der Datei, die Sie ersetzt haben.** Welche Posten rot waren. Was die Fußzeile sagte. Wer vorschlug, die dritte Klausel zu löschen, und warum. Wo Abbildung 4 tatsächlich war, bevor die Nummerierung einfror. All das steht in der `.docx`, nichts davon steht im Markdown, und in dem Moment, in dem die `.docx` weg ist, hört die Reparatur auf möglich zu sein und wird eine Rekonstruktion. Das Original zu behalten ist keine Sentimentalität; es ist die einzige Kopie der Antworten.

**Später reparieren heißt in jeder Kopie reparieren.** Ein konvertiertes Dokument lässt sich leicht bewegen. Jemand fügt es in ein Wiki ein, committet es in ein Repository, schickt es an einen Kunden. Zwei Wochen später bemerken Sie die eingefrorenen Querverweise. Jetzt liegt die Reparatur an vier Stellen, von denen Sie drei nicht kennen. Hundert Dokumente zu konvertieren multipliziert das mit hundert, und das ist das eigentliche Argument für eine ordentliche Prüfliste, einmal pro Dokument durchlaufen, statt für eine Korrektur, die bei Entdeckung angewandt wird.

**Manches kostet mehr zu reparieren als neu zu machen.** Ein Dokument mit verbundenen Zellen, verschachtelten Tabellen und Zellen, die Listen enthalten, lässt sich nicht in Markdown hineinreparieren, denn Markdowns Tabellensyntax hat kein Überspannen und keinen Blockinhalt in Zellen; Sie können die Daten nur umformen oder sie als HTML-Tabelle behalten. [Tabellen sind das, was in beiden Richtungen am häufigsten bricht](/blog/markdown-tables-that-survive-conversion) und sich im Nachhinein am wenigsten flicken lässt. Ein Dokument, das ganz aus Textfeldern und Formen gebaut ist — eine Broschüre, ein Plakat, ein gestaltetes Einseitendokument —, ist kein Dokument mit Formatierung, die es verlieren kann. Es ist ein Layout, und die Wörter sind darin nebensächlich. Es zu konvertieren erzeugt ein Prosafragment, das niemand will, und die ehrliche Antwort ist, dass die Datei ein PDF bleiben sollte.

Was das zusammengerechnet kostet: Die Zeit steckt nicht in der Konvertierung, die Sekunden dauert, und nicht in den offensichtlichen Reparaturen, die Minuten dauern. Sie steckt im Prüfen, das für ein Dokument von einigem Umfang zehn bis zwanzig Minuten dauert, und im Behalten des Originals, das Plattenplatz und eine Namenskonvention kostet. Teams, die das Prüfen überspringen, erfahren es nicht sofort. Sie erfahren es, wenn jemand fragt, was in dem gelöschten Absatz stand.

## Was Sie vor der Konvertierung entscheiden sollten

1. **Stellen Sie fest, ob das Dokument Struktur hat oder nur Erscheinung.** Öffnen Sie den Bereich der Formatvorlagen und sehen Sie hin. Sind die Überschriften echte Überschriften-Formatvorlagen, wird die Konvertierung sauber und Ihr Prüfen kurz; ist alles Standard mit manuellem Fett, wird die Ausgabe eine Wand aus Absätzen und kein Konverter wird Sie retten, der billigere Weg ist also, erst in Word echte Formatvorlagen zu vergeben und dann einmal zu konvertieren.
2. **Lesen Sie Kopfzeile, Fußzeile und jedes Wasserzeichen, bevor Sie irgendetwas anfassen.** Was auch immer sie sagen — eine Einstufung, eine Version, ein Prüfdatum, das Wort DRAFT — steht nirgendwo sonst in der Datei und ist in einem Schritt weg, und ein ohne seine eigene Einstufung neu veröffentlichtes Dokument ist eine Offenlegung und keine Konvertierung.
3. **Finden Sie heraus, ob die Datei ein Review durchlaufen hat.** Verfolgte Änderungen und Kommentare sind die Verluste, die Sie nicht rückgängig machen können; zählt das Review also, exportieren Sie zuerst ein markiertes PDF und konvertieren Sie zweitens den sauberen Text; überspringen Sie das, entscheiden Sie sich dafür, die Auseinandersetzung wegzuwerfen und nur das Ergebnis zu behalten.
4. **Nehmen Sie den schwebenden Inhalt von Hand auf.** Zählen Sie die Textfelder, Formen, SmartArt-Grafiken und Diagramme, schreiben Sie die Zahl auf, und prüfen Sie dieselbe Zahl gegen die Ausgabe, denn das sind die einzigen Posten, die ganz spurlos verschwinden, und die Prüfung kostet eine Minute pro Posten.
5. **Entscheiden Sie die Regel für Beschriftungen einmal, für alle Ihre Dokumente.** Entweder werden Beschriftungen kursive Zeilen ohne Nummern, oder sie werden Blöcke aus `<figure>` und `<figcaption>`; pro Dokument zu entscheiden garantiert einen ungleichmäßigen Satz Dateien und einen zweiten Durchgang später.
6. **Fegen Sie die Querverweise durch, bevor Sie veröffentlichen, nicht danach.** Jedes „siehe Seite 11" und „wie in Abbildung 4 gezeigt" ist jetzt eingefrorener Text, der sich liest, als funktioniere er, und sobald die Datei in ein Wiki und ein Repository kopiert wurde, reparieren Sie denselben Satz an drei Stellen.
7. **Behalten Sie die `.docx`, und legen Sie sie an einen findbaren Ort.** Jeder Verlust in diesem Artikel ist einseitig, das Original ist also Ihr einziges Protokoll davon, was das Dokument einmal wusste, und die Kosten, es zu behalten, sind ein paar hundert Kilobyte gegen die Kosten, es nicht zu behalten, was eine Frage ist, die Sie überhaupt nicht beantworten können.

## Fazit

Das meiste, was eine `.docx` auf dem Weg nach Markdown verliert, war nie wert, behalten zu werden: die Schriftart, der Schriftgrad, die Ränder, die Seitenumbrüche, die Spalten, die Füllzeichen und die zwei Dutzend Absatz-Formatvorlagen, die immer nur Abstände beschrieben haben. Sie fallen zu lassen ist der Sinn der Übung, denn ein Dokument, das seine eigene Struktur beschreibt, lässt sich einheitlich gestalten, durchsuchen, diffen und prüfen, wie ein Dokument, das seine eigene Erscheinung beschreibt, es nicht kann. Die vier Dinge, für die Arbeit sich lohnt, sind die Review-Schicht, die Beschriftungen, die Querverweise und was auch immer in einem Textfeld sitzt, und alle vier lassen sich vor der Konvertierung leichter behandeln als danach. [Der Weg Schritt für Schritt und seine Prüfliste](/blog/convert-docx-to-markdown) behandelt, wie man die Konvertierung selbst durchführt, und [der Vergleich der Werkzeuge, die es tun](/blog/best-word-to-markdown-converters) behandelt, welches zu wählen ist; für eine einzelne Datei, die Sie lieber nicht hochladen, läuft [TransformPipes Konvertierung von Word zu Markdown](/word-to-markdown) im Browser, kostenlos, und die `.docx` verlässt Ihren Rechner nie, solange Sie abgemeldet sind. Welchen Weg Sie auch nehmen, archivieren Sie das Original, denn die Schriften, die Fußzeilen, die Kommentare und das hervorgehobene Zitat, das Sie nicht bemerkt haben, kommen nicht zurück.

## FAQ

### Warum verliert mein Word-Dokument seine ganze Formatierung, wenn ich es in Markdown umwandle?

Weil Markdown für das meiste davon keine Syntax hat. Es gibt keine Möglichkeit, eine Schriftart, einen Schriftgrad, eine Farbe, einen Rand oder einen Seitenumbruch in Markdown auszudrücken, ein Konverter liest also über alle hinweg. Was überlebt, ist Struktur — Überschriften, Listen, Links, Tabellen, Betonung — und nur dort, wo das Dokument sie als Struktur und nicht als Erscheinung festgehalten hat.

### Warum kamen meine Überschriften als gewöhnliche Absätze heraus?

Ziemlich sicher, weil sie nie Überschriften waren. Wurde eine Überschrift gemacht, indem eine Zeile markiert und Fett und eine größere Größe angewandt wurden, hält die Datei Lauf-Eigenschaften fest und keine Überschrift, und ein Konverter hat nichts zu befördern. Vergeben Sie in Word echte Überschriften-Formatvorlagen und konvertieren Sie erneut; der Unterschied ist sofort da.

### Was passiert mit Beschriftungen, wenn ich eine .docx in Markdown umwandle?

Die Formatvorlage Beschriftung hat kein Markdown-Äquivalent, die Beschriftung wird also ein einfacher Absatz, und die `SEQ`-Feldfunktion, die ihre Nummer erzeugte, fällt zu dem Wert zusammen, den Word zuletzt berechnet hat. Schreiben Sie Beschriftungen entweder als kursive Zeilen ohne Nummern um, die nicht veralten können, oder verwenden Sie HTML-`<figure>` und `<figcaption>`, wo Abbildungen zählen.

### Können Querverweise eine Konvertierung von Word nach Markdown überleben?

Nicht als Querverweise. Eine `REF`- oder `PAGEREF`-Feldfunktion wird der Text, den Word zuletzt berechnet hat, „siehe Abschnitt 4.2 auf Seite 11" kommt also richtig aussehend an und zeigt auf nichts. Schreiben Sie jeden einzelnen als Markdown-Link auf den Anker der Ziel-Überschrift um, und löschen Sie alles, was sich auf eine Seitenzahl bezieht.

### Wohin sind meine Textfelder verschwunden?

Wahrscheinlich nirgendwohin — der Text wurde nie extrahiert. Ein Textfeld ist ein Zeichnungsobjekt und nicht Teil des Dokumentflusses, und viele Konverter erreichen sein Inneres nicht, ohne irgendeinen Fehler zu melden. Suchen Sie in der konvertierten Datei nach einer Wendung, von der Sie wissen, dass sie in jedem Kasten stand, und tippen Sie neu, was fehlt, solange Sie das Original noch offen haben.

### Sollte ich die ursprüngliche .docx nach der Konvertierung behalten?

Ja, immer. Jeder hier beschriebene Verlust ist einseitig, und das Original ist das einzige verbleibende Protokoll davon, was die Fußzeile sagte, welche Posten farblich markiert waren, wer welche Löschung vorschlug und was in der Randspalte stand. Es kostet ein paar hundert Kilobyte und beantwortet Fragen, die das Markdown nicht beantworten kann.

### Lohnt es sich überhaupt, ein gestaltetes Dokument wie eine Broschüre zu konvertieren?

Meist nicht. Eine Broschüre oder ein Plakat ist ein Layout, in das die Wörter gesetzt sind, und kein Dokument, in dem sie fließen, und es zu konvertieren erzeugt zusammenhanglose Prosafragmente mit verschwundener Gestaltung. Ist das Artefakt die Gestaltung, behalten Sie es als PDF und schreiben Sie die Markdown-Fassung von Grund auf, wenn Sie eine brauchen.
