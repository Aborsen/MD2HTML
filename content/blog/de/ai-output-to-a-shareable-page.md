---
title: "Ihr KI-Assistent schreibt Markdown. Ihre Kollegen lesen es nicht."
description: "Warum Chat-Assistenten in Markdown antworten, was das Einfügen in E-Mail, Slack, Word oder ein Ticket übersteht, und der langweilige Weg, der hält"
updated: 2026-09-09
date: 2026-07-21
tag: Workflow
keywords: chatgpt markdown, chatgpt ausgabe in html umwandeln, claude markdown exportieren, ki antwort formatieren, markdown aus chat kopieren, markdown in word einfügen, ki ausgabe sternchen, dollarzeichen markdown formel
---

Die Antwort im Chat-Fenster sieht aus wie ein Dokument. Überschriften, eine kurze Tabelle, eine nummerierte Liste, Fettschrift an den richtigen Stellen. Sie kopieren sie in eine E-Mail und bekommen eine Wand aus Sternchen und Rautezeichen. Oder Sie bekommen ein halbes Dokument: die Überschriften sind durchgekommen, die Tabelle traf als Reihe von Pipes ein, und Ihr Leser muss raten, welche Zeichen wörtlich gemeint waren.

Es ist nichts schiefgegangen. Der Assistent hat Markdown geschrieben, denn das ist es, was diese Werkzeuge schreiben.

Die Lücke ist keine Frage des Geschmacks. Was auf Ihrem Bildschirm steht und was in Ihrer Zwischenablage liegt, sind zwei verschiedene Dokumente, und jede Stelle, in die Sie einfügen, stellt ihre eigene Vermutung darüber an, welches der beiden sie erhalten hat. Manche Zielorte raten gut. Die meisten raten anders als die anderen, und darum sieht dieselbe Antwort in einem Fenster in Ordnung aus und im nächsten zerbrochen.

### Kurzfassung

Chat-Assistenten antworten in Markdown, weil es der billigste Weg ist, eine Überschrift in einem Strom reinen Textes zu markieren, und das Chat-Fenster stellt diese Quelle für Sie wieder dar. Die Zwischenablage bekommt die Quelle. E-Mail, Slack, Word, Google Docs, Notion, Ticketsysteme und Content-Systeme deuten sie jeweils anders, sodass Tabellen, eingezäunter Code, verschachtelte Listen, Fußnotenmarken und alles Mathematische in jedem an einer anderen Stelle brechen. Der Weg, der das übersteht, ist langweilig: die Antwort als `.md`-Datei sichern, sie gegen eine Prüfliste lesen, bevor Ihr Name darunter steht, sie einmal in eine eigenständige HTML-Seite umwandeln und die Seite senden statt des Eingefügten.

## Warum die Antwort als Markdown ankommt

Ein Modell gibt Text Stück für Stück aus. Um eine Überschrift zu markieren, muss es Zeichen im selben Strom wie die Wörter benutzen, und Markdown ist dafür das billigste Mittel: reiner Text, ein paar Satzzeichen, kein Format, über das zu verhandeln wäre. Die Chat-Oberfläche stellt es an Ihrem Ende wieder dar. Diese Darstellung ist die Täuschung — was Sie in der Hand halten, ist die Quelle.

Das ist keine Eigenheit eines einzelnen Produkts. ChatGPT, Claude, Gemini und Copilot antworten alle so, und die Assistenten in Editoren und Ticketsystemen ebenso. Um reinen Text zu bitten funktioniert manchmal, aber dann verhandeln Sie mit einem Modell, statt eine Datei umzuwandeln.

## Was das Herauskopieren tatsächlich tut

Die meisten Chat-Fenster halten zwei Kopien der Antwort. Die Kopierschaltfläche gibt Ihnen die Quelle, mit Sternchen und allem. Eine Mausauswahl gibt Ihnen die dargestellte Fassung als formatierten Text, den der Zielort dann neu deutet. Keine von beiden ist verlässlich, und sie scheitern an verschiedenen Stellen.

| Wohin Sie einfügen | Kopierschaltfläche (Quelle) | Mausauswahl (formatierter Text) |
| --- | --- | --- |
| Reintext-E-Mail | Jede Raute, jedes Sternchen, jede Pipe | Zurück auf reinen Text geplättet |
| Word oder Google Docs | Rohe Syntax, nichts dargestellt | Überschriften, Fettschrift und meist Tabellen überleben; eingezäunter Code verliert seinen Block |
| Slack oder Teams | Ein Teil der Syntax wird dargestellt, ein Teil bleibt wörtlich | Je Client verschieden; Listen und Code-Zäune leiden am meisten |
| Ein Wiki, das Markdown spricht | Nahe am Richtigen, wenn der Dialekt passt | Formatierter Text, das Markdown ist also weg |

Der halb dargestellte Fall ist der teure. Ein Leser, der saubere Überschriften über einem Durcheinander von Pipes sieht, nimmt an, Sie hätten es nachlässig verschickt, und nicht, dass zwei Werkzeuge über Tabellen verschiedener Meinung waren. Tabellen sind so oder so das verlässliche Opfer, aus [Gründen, die man kennen sollte](/blog/markdown-tables-that-survive-conversion), wenn Sie sie oft einfügen.

Was die Kopierschaltfläche übergibt, lohnt eine genaue Beschreibung, denn es ist überall dasselbe, auch wenn die Oberflächen es nicht sind: eine Zeichenkette aus Markdown-Text. Kein Dokument, kein Format mit einem Namen, nichts, was ein Mail-Programm öffnen könnte — eine Folge von Zeichen, in der `##` nur für einen Leser Überschrift bedeutet, der das schon weiß. Nichts in der Zwischenablage sagt es.

Eine Mausauswahl ist etwas anderer Art. Browser legen zwei Darstellungen gleichzeitig in die Zwischenablage: eine Reintext-Fassung und eine HTML-Fassung derselben Auswahl, und die empfangende Anwendung nimmt sich die, die sie bevorzugt. Fügen Sie in ein Reintext-Feld ein, bekommen Sie den geplätteten Text. Fügen Sie in ein Feld für formatierten Text ein, bekommen Sie die Auszeichnung des Chat-Fensters selbst — seine `<h2>`-Tags, seine Listenstruktur und manchmal seine CSS-Klassen und Farben, weshalb eingefügte Antworten gelegentlich in einer Schrift eintreffen, die niemand gewählt hat. Keiner der beiden Wege ist ein Fehler, und keiner lässt sich am Zielort reparieren.

### Wo es landet, Zielort für Zielort

Das ist das Merkblatt. Es beschreibt, was mit dem Markdown-Text aus der Kopierschaltfläche passiert, denn das ist die Kopie, die Leute nehmen, und die letzte Spalte sagt, was stattdessen zu tun ist. Das Verhalten treibt zwischen Clients und Versionen, lesen Sie die Tabelle also als die Form des Problems und nicht als Zusage über die Version vor Ihnen.

| Zielort | Was das Einfügen übersteht | Was nicht | Was Sie stattdessen tun |
| --- | --- | --- | --- |
| Reintext-E-Mail | Nichts wird gedeutet; der Text erscheint genau so, wie er getippt wurde | Jede Überschrift, jede Listenmarke, jede Tabellenzeile liest sich als Zeichensetzung | Eine umgewandelte Seite anhängen oder verlinken |
| HTML-E-Mail | Zeilenumbrüche und Absätze, ungefähr | Überschriften, Fettschrift, Tabellen, Code — alles wörtliche Syntax | Einen Link senden, oder eine eigenständige `.html`-Datei als Anhang |
| Slack | Fettschrift, Kursives und Inline-Code, sobald der Editor sie geparst hat | Überschriften und Tabellen haben in einer Nachricht überhaupt kein Gegenstück | Die Seite verlinken; zwei Zeilen Zusammenfassung darüber setzen |
| Word | Absätze, und was die Autokorrektur zu ändern beschließt | Überschriften bleiben Rauten; Zäune bleiben Backticks; Tabellen bleiben Pipes | Umwandeln, oder eine formatierte Auswahl einfügen und nachbessern |
| Google Docs | Absätze, und ein Verhalten, das von einer Dokumenteinstellung abhängt | Dieselbe Menge, sofern die Einstellung nichts anderes sagt | Die Einstellung einmal testen, oder umwandeln und verlinken |
| Notion | Das meiste: Notion liest eingefügtes Markdown als Markdown | Tiefe Verschachtelung, und alles, für das Notion keinen Block hat | Einfügen, dann Listen und Codeblöcke prüfen |
| Ein Ticket oder Issue | Alles, wenn das Kommentarfeld des Trackers Markdown spricht | Alles, wenn es stattdessen seine eigene Auszeichnung spricht | Einmal herausfinden, in welchem Lager Ihr Tracker steht |
| Ein CMS | Absätze, als Absätze | Struktur, sofern der Editor Markdown nicht absichtlich importiert | Als Markdown importieren, wenn angeboten; sonst umwandeln |
| Ein Wiki, das Markdown spricht | Nahezu alles, wenn der Dialekt passt | Erweiterungen, die das Wiki nie umgesetzt hat | Einfügen und das Ergebnis lesen, bevor Sie veröffentlichen |

### E-Mail

E-Mail sind zwei Produkte unter einem Namen. Eine Reintext-Nachricht hat überhaupt keinen Parser, die Rauten und Sternchen werden dem Leser also als Zeichen gezeigt, und das ist die Wand aus Zeichensetzung, die jeder schon gesehen hat. Eine Nachricht in formatiertem Text oder in HTML hat einen Parser, aber es ist ein HTML-Parser, und Markdown ist nicht HTML. Er sieht einen Absatz, der mit zwei Rautezeichen beginnt, und stellt einen Absatz dar, der mit zwei Rautezeichen beginnt.

Der Weg über die Mausauswahl schlägt sich hier besser und bringt sein eigenes Problem mit: der eingefügte Block trägt die Gestaltung der Chat-Anwendung mit sich, Ihre Nachricht hat also zwei Schriften in sich und die zitierte Antwortkette darunter eine dritte. Auf Dauer besteht die Lösung darin, gar nicht einzufügen. Mailen Sie einen Link oder eine einzige eigenständige Datei, und lassen Sie das Dokument ein Dokument sein.

### Slack und Teams

Ein Nachrichteneditor ist kein Dokumenteditor, und er gibt sich auch nicht dafür aus. Es gibt Betonung im Text und Inline-Code, und das ist nahezu das ganze Vokabular. Es gibt keine Überschrift, `## Ergebnisse` ist also der wörtliche Text „## Ergebnisse“. Es gibt keine Tabelle, eine Tabelle wird also zu einem Stapel Pipe-getrennter Zeilen, die am Fensterrand umbrechen und auf dem ersten schmalen Bildschirm ihre Spaltenausrichtung verlieren.

Das ist der Zielort, an dem Leute am häufigsten beschließen, die Antwort sei in Ordnung, weil sie im Editor in Ordnung aussah, und es ist der Zielort, an dem der Client des Lesers am ehesten von dem des Absenders abweicht. Die sichere Form für Chat ist eine kurze Zusammenfassung in der Nachricht und darunter ein Link auf das Dokument. Zwei Zeilen Prosa schlagen eine verstümmelte Tabelle, und sie überstehen es, auf einem Telefon gelesen zu werden.

### Word

Word tut zwei unfreundliche Dinge zugleich. Es nimmt den Markdown-Text wörtlich, und dann bearbeitet es ihn. Die Autokorrektur macht aus geraden Anführungszeichen runde, aus einem doppelten Bindestrich einen Gedankenstrich, schreibt nach dem, was sie für einen Punkt hält, groß weiter und verwandelt eine Zeile, die mit einem Bindestrich beginnt, in eine Word-Liste mit Words eigener Zählung. Jedes davon ist für sich vernünftig, und zusammen bedeuten sie, dass der Text, den Sie einfügen, nicht der Text ist, den Sie kopiert haben.

Für Code ist das nicht unordentlich, sondern tödlich: ein Befehl mit einem runden Anführungszeichen darin läuft nicht, und die Person, die es versucht, bekommt eine Fehlermeldung, die nichts mit dem Befehl zu tun hat. Wenn am Ende wirklich jemand eine Word-Datei braucht, ist das eine Aufgabe für eine Konvertierung und nicht fürs Einfügen, und die Werkzeuge, die das ordentlich machen, sind die Dokumentkonverter und nicht die Zwischenablage.

### Google Docs

Docs verhält sich weitgehend wie Word, mit einer zusätzlichen Größe: es gibt eine Einstellung auf Dokumentebene, die bestimmt, wie Markdown-Syntax behandelt wird, und dasselbe Einfügen verhält sich darum in zwei Dokumenten derselben Person unterschiedlich. Das ist schlimmer als ein gleichmäßiges Scheitern, denn es bringt Ihnen in einem Dokument eine Regel bei, die im nächsten falsch ist.

Prüfen Sie die Einstellung einmal in einem Wegwerfdokument, fügen Sie eine repräsentative Antwort mit einer Tabelle und einem Codeblock darin ein und schreiben Sie auf, was passiert ist. Verlassen Sie sich dann darauf oder ignorieren Sie es bewusst. Was Sie nicht tun sollten, ist annehmen, das Verhalten vom letzten Monat sei das Verhalten, das Sie heute bekommen.

### Notion

Notion ist der Ausreißer, und zwar der gute: eingefügtes Markdown wird in der Regel als Markdown gelesen und in Blöcke umgesetzt, aus Überschriften werden also Überschriften und aus einer Tabelle eine Tabelle. Ist Notion der Zielort, ist das Einfügen oft die richtige Antwort und der Rest dieses Artikels unnötig.

Zwei Dinge brauchen dennoch einen Blick. Notion ist blockbasiert und nicht textbasiert, eine Verschachtelung tiefer als seine eigene Struktur erlaubt wird also geplättet, und der Sprachhinweis eines eingezäunten Blocks überlebt möglicherweise als Sprache des Blocks — oder auch nicht. Fügen Sie ein, dann lesen Sie die Codeblöcke und die tiefste Liste, denn das sind die zwei Stellen, an denen die Umsetzung Information verliert.

### Ein Ticket

Ticketsysteme teilen sich in zwei Lager, und die Teilung ist von außen nicht offensichtlich. Das eine Lager behandelt das Kommentarfeld als Markdown, dann ist das Eingefügte nahe am Richtigen und nur die Erweiterungen, die Ihr Text benutzt, werden scheitern. Das andere Lager hat seine eigene Auszeichnungssprache, die älter ist als die Vorherrschaft von Markdown, und in diesem Lager bedeuten Ihre Sternchen und Rauten nichts oder, schlimmer, etwas anderes.

Finden Sie einmal heraus, in welchem Lager Ihres steht, mit einem Testkommentar an einem Ticket, das niemand beobachtet. Nehmen Sie eine Tabelle, einen eingezäunten Block und eine verschachtelte Liste hinein, denn das sind die drei, die die Lager trennen. Danach wissen Sie, ob das Einfügen einer Modellantwort in ein Ticket eine Sache von zwei Sekunden oder eine Neufassung von zehn Minuten ist.

### Ein CMS

Ein Content-System ist der Ort, an dem ein schlechtes Einfügen den öffentlichsten Schaden anrichtet, denn das Scheitern wird veröffentlicht und nicht verschickt. Block-Editoren machen meist einen Absatz pro Zeile und lassen die Syntax sichtbar, was zumindest offensichtlich ist. Der schlimmere Fall ist ein Editor, der halb parst: ein Teil der Betonung im Text wird umgesetzt, die Überschriften nicht, und der Artikel geht mit drei Rautezeichen über dem zweiten Abschnitt online.

Die meisten Systeme, die Markdown veröffentlichen, haben einen Importweg, der vom Einfügeweg getrennt ist, und er ist fast immer besser. Wenn Ihres keinen hat, wandeln Sie in HTML um und fügen Sie das HTML in die Quelltextansicht des Editors ein, wo die Struktur ausdrücklich dasteht und Sie genau sehen können, was dargestellt wird.

## Was bricht, Konstrukt für Konstrukt

Der Zielort entscheidet, wie ein Scheitern aussieht. Das Konstrukt entscheidet, ob es eines gibt. Das sind die acht, die brechen, in der ungefähren Reihenfolge, in der sie in einer Chat-Antwort auftreten. Jedes bekommt unten einen kurzen Abschnitt, außer der Mathematik, in der genug vorgeht, um danach einen eigenen Abschnitt zu brauchen.

| Konstrukt | Was das Modell geschrieben hat | Was ankommt | Warum |
| --- | --- | --- | --- |
| Tabelle | Pipe-getrennte Zeilen | Zeilen voller Pipes, oder ein Stapel unausgerichteter Zeilen | Tabellen sind eine GFM-Erweiterung, nicht Kern-Markdown |
| Eingezäunter Code | Drei Backticks und ein Sprachhinweis | Backticks als Text, Einrückung eingefallen, Anführungszeichen gerundet | Der Zielort hat keinen Codestil auf Blockebene, auf den er abbilden könnte |
| Verschachtelte Liste | Eingerückte `-`- und `1.`-Einträge | Eine flache Liste, oder wörtliche Marken | Einrückung trägt in Markdown Bedeutung und ist in formatiertem Text Dekoration |
| Betonung im Wort | `my_variable_name` | *my variable name*, in der Mitte kursiv | Ältere Parser betonen Unterstriche innerhalb von Wörtern |
| Mathematik | `$x^2$` | Zwei Dollarzeichen und ein Zirkumflex | Mathematik steht in keiner Markdown-Spezifikation |
| Fußnotenmarke | `[^1]` und ihre Definition | Wörtliche Klammern, zweimal | Fußnoten stehen weder im Kern von CommonMark noch in dem von GFM |
| Zitatmarke | `[3]` oder `[source]` | Wörtliche Klammern, hinter denen nichts steht | Die Referenzdefinition wurde nie ausgegeben |
| Emoji und typografische Zeichen | Codepunkte, runde Anführungszeichen, Gedankenstriche | Kästchen, oder Zeichen, die Befehle zerbrechen | Schriftabdeckung und Autokorrektur, gar nicht Markdown |

### Tabellen

Eine Markdown-Tabelle ist eine Kopfzeile, eine Trennzeile aus Bindestrichen und Doppelpunkten und Datenzeilen, alle von Pipes zusammengehalten. Sie ist nicht Teil der ursprünglichen Spezifikation und sie ist nicht Teil von CommonMark; sie kam mit GitHub Flavored Markdown, was bedeutet, dass ein Parser vollkommen korrekt sein und Ihre Tabelle trotzdem als Absatz voller Pipe-Zeichen darstellen kann.

Die Kosten sind schlimmer als eine fehlende Tabelle, denn der Rückfall ist nicht leer. Er besteht aus Ihren Daten, unausgerichtet, in Leserichtung, mit Zeichensetzung zwischen den Zellen. Leser versuchen, das zu entschlüsseln, und liegen daneben, und Spalten mit leeren Zellen verschieben die Bedeutung stillschweigend um eins. Hat die Antwort eine Tabelle in sich, wird kein Einfügen sie überall halten, und der Schritt der Konvertierung ist nicht mehr wahlfrei.

### Eingezäunter Code

Ein eingezäunter Block sind drei Backticks, ein optionaler Sprachhinweis, der Code und wieder drei Backticks. Auf dem Weg hinaus passieren ihm drei getrennte Dinge. Die Zaunzeichen werden zu sichtbarem Text. Die führende Einrückung wird von den Absatzregeln des Zielorts normalisiert, Python hört also auf, gültig zu sein. Und die Autokorrektur kommt an die Anführungszeichen, sodass selbst Code, der seine Form behalten hat, möglicherweise nicht mehr läuft.

Das Letzte davon ist das, was jemanden einen Nachmittag kostet, denn der Code sieht richtig aus. Ein rundes und ein gerades Anführungszeichen sind in einer Proportionalschrift auf einen Blick nicht auseinanderzuhalten, und die Fehlermeldung nennt ein Problem der Syntax und kein Problem eines Zeichens. Wenn Sie Code verschicken, verschicken Sie eine Seite oder eine Datei, niemals etwas Eingefügtes.

### Verschachtelte Listen

Markdown baut die Verschachtelung aus der Einrückung, und die Anzahl der Leerzeichen zählt. Ein Zielort für formatierten Text hat keinen Begriff von „zwei Leerzeichen Einrückung bedeuten einen Untereintrag“ — er hat Listenebenen, und er leitet sie neu aus der Struktur her, die er erhalten zu haben glaubt. Ein dreistufiger Plan trifft oft als eine einzige flache Liste ein, in der die Hierarchie fehlt, und das ist eine Änderung der Bedeutung und nicht des Aussehens.

Der Reintext-Weg scheitert sichtbarer und weniger gefährlich: die Marken bleiben `-` und `1.`, und der Leser kann sehen, was gemeint war. Der halb erfolgreiche Fall ist wieder die Falle, und es lohnt sich, in jeder Antwort die tiefste Liste zu lesen, bevor Sie sie irgendwohin senden.

### Betonung innerhalb eines Wortes

Modelle schreiben ständig `**Hinweis:**` am Zeilenanfang, und das ist meist in Ordnung. Das Scheitern ist der umgekehrte Fall: Text, der nie betont sein sollte und es wird. Bezeichner in Snake Case sind der Klassiker — `my_variable_name` hat zwei Unterstriche um ein Wort, und ältere Parser setzen die Mitte davon bereitwillig kursiv.

CommonMark hat das mit Flankenregeln verschärft, `_` innerhalb eines Wortes öffnet in einem regelkonformen Parser also keine Betonung mehr. Nicht jeder Zielort ist regelkonform, und die, die etwas Eingefügtes halb parsen, sind es am wenigsten. Das Symptom ist ein technisches Dokument, in dem einigen Bezeichnern stillschweigend Zeichen fehlen, und das ist ein Defekt, der schwer zu entdecken und teuer ausgeliefert ist.

### Fußnoten- und Zitatmarken

Fußnoten stehen weder im Kern von CommonMark noch in dem von GFM, `[^1]` ist also eine Erweiterung, die ein bestimmter Renderer entweder umsetzt oder ausdruckt. Wenn er sie ausdruckt, bekommen Sie die Marke im Text und die Definition verlassen am Fuß der Seite, beide in Klammern, und die Verbindung zwischen ihnen besteht nur im Kopf des Lesers. [Was jede Umsetzung mit Fußnoten tatsächlich macht](/blog/markdown-footnotes-support), lohnt sich zu wissen, bevor Sie sich auf eine verlassen.

Zitatmarken sind ein anderes Problem mit demselben Aussehen. Ein Modell, das um Quellen gebeten wird, gibt häufig `[1]`, `[2]`, `[source]` im Text aus, ohne jemals die Referenzdefinitionen auszugeben, die diese Klammern brauchen. Das ist kein Fehler der Konvertierung — es ist ein unvollständiges Dokument, und es erscheint als wörtliche Klammern in jedem Werkzeug, auch in denen, die Fußnoten ordentlich unterstützen. Prüfen Sie, dass hinter jeder Klammer etwas steht, bevor Sie beschließen, der Konverter sei schuld.

### Emoji

Emoji kommen als echte Zeichen an, sie überleben die Zwischenablage also unversehrt. Was sie nicht überleben, ist die Schrift des Zielorts. Ein Rechner ohne die Glyphe zeigt ein Kästchen, ein älteres Mail-Programm zeigt möglicherweise ein Fragezeichen, und eine einfarbige Schrift stellt einen Punkt dar, wo der Autor einen Status gemeint hat. Die Umwandlung in HTML behebt das nicht: eine eigenständige Datei kann ihre Stile mitbringen, aber nicht die Emoji-Schrift des Systems, auf dem gelesen wird.

Wo das Zeichen Dekoration ist, kostet das nichts. Wo es Bedeutung trägt — ein Haken an einer Tabellenzeile und ein Kreuz an einer anderen —, nimmt ein Kästchen an der Stelle der Glyphe die einzige Information aus der Spalte. Ersetzen Sie diese durch Worte. „Ja“ und „Nein“ erscheinen in jeder Schrift, die es jemals gegeben hat.

### Typografische Anführungszeichen und Gedankenstriche

Modelle geben typografische Zeichen aus: runde Anführungszeichen, Apostrophe, Halbgeviertstriche, Auslassungszeichen. In Prosa sind die korrekt und etwas schöner als die Alternativen. In allem, was eine Maschine lesen wird, sind sie ein Defekt, und die beiden treffen sich, sobald eine Antwort einen Shell-Befehl, ein JSON-Schnipsel oder einen Dateipfad enthält.

Die Autokorrektur am Zielort legt eine zweite Schicht desselben Problems darauf, Text, der das Modell gerade verlassen hat, kann also rund eintreffen. Die Regel, die Sie aus Schwierigkeiten heraushält, ist einfach: Prosa darf typografische Zeichen haben, Code nicht, und der einzige verlässliche Weg, sie auseinanderzuhalten, führt den Code durch einen Konverter, der einen eingezäunten Block als `<pre>`-Element erhält, statt durch ein Textfeld, das glaubt, es helfe.

## Mathematik ist ein Problem für sich

Nichts in Markdown definiert Mathematik. Nicht die ursprüngliche Syntax, nicht CommonMark, nicht GFM. Mathematik in Dollarzeichen ist eine von TeX geborgte Konvention, die einzelne Renderer nachträglich hinzugefügt haben, einer nach dem anderen, mit leicht verschiedenen Regeln. Das ist die ganze Erklärung dafür, warum `$x^2$` im Chat-Fenster wie eine Gleichung aussieht und überall sonst wie zwei Dollarzeichen und ein Zirkumflex.

Das Chat-Fenster stellt es dar, weil neben dem Markdown-Renderer eine Mathematik-Bibliothek in der Seite geladen ist. KaTeX, eine der verbreiteten Wahlmöglichkeiten, beschreibt sich als schnellste Bibliothek für Mathematiksatz im Web und ist MIT-lizenziert (geprüft auf katex.org, 9. September 2026). GitHub stellt es dar, weil GitHub die Funktion absichtlich eingebaut hat: es nimmt `$…$` und `$$…$$` sowie einen `math`-Codezaun an, und seine Dokumentation sagt, dass die Darstellung von MathJax erledigt wird (geprüft auf docs.github.com, 9. September 2026).

Ein einfacher Markdown-zu-HTML-Konverter hat keinen Grund, von all dem zu wissen. Seine Aufgabe ist es, Markdown in HTML zu verwandeln, und Dollarzeichen sind kein Markdown. Also tut er das einzig Richtige, das ihm zur Verfügung steht, und gibt sie als Text durch. Das ist kein Mangel, den man umgeht, indem man einen besseren Allzweckkonverter sucht; es ist eine andere Aufgabe, die ein Werkzeug braucht, das sie erledigt.

In derselben Funktion steckt eine Falle zweiter Ordnung. In einem Renderer, der Dollar-Mathematik *tatsächlich* unterstützt, kann ein gewöhnliches Dollarzeichen in der Prosa einen Ausdruck eröffnen, der nie schließt, oder, schlimmer, einen schließen. Ein Absatz, der `$PATH` und einen Preis in denselben paar Zeilen erwähnt, kann stillschweigend alles dazwischen verschlucken. Dieselbe Datei erscheint darum im Chat-Fenster, auf GitHub und in Ihrem Konverter unterschiedlich, und nur eines dieser drei ist das, was Sie gemeint haben.

| Wenn Sie brauchen | Tun Sie das | Was es kostet |
| --- | --- | --- |
| Einen oder zwei einfache Ausdrücke | Bitten Sie um Worte, oder um schlichte Notation wie `x^2` | Nichts, und es liest sich an jedem Zielort gut |
| Echte Notation in einem Dokument | Wandeln Sie mit Pandoc um, das unter seinen Optionen `--math-method=mathml` und `--math-method=katex` hat (geprüft auf pandoc.org, 9. September 2026) | Eine Installation und eine Befehlszeile |
| Echte Notation in einer eigenständigen Datei | Die Ausdrücke mit KaTeX in Node zu HTML vorrendern, dann das Ergebnis umwandeln | Ein Build-Schritt, und keine Mathematik-Bibliothek beim Leser |
| Mathematik in einer Seite, die nichts nachladen darf | MathML, oder Bilder | Die MathML-Unterstützung schwankt; Bilder fließen nicht um und wachsen nicht mit dem Text |
| Es heute auszuliefern | Setzen Sie die Ausdrücke in einen eingezäunten Block und beschriften Sie ihn | Ehrlich, hässlich und unmissverständlich — niemand hält es für einen Darstellungsfehler |

Die pragmatische Antwort für die meisten Geschäftsdokumente ist die erste Zeile. Ist die Mathematik eine Formel, die der Leser anwenden muss, und keine Herleitung, der er folgen muss, teilt schlichte Notation in einer Code-Spanne sie einwandfrei mit und reist überall hin. Sparen Sie den Satz für Dokumente, in denen die Notation der Punkt ist.

## Lesen Sie es, bevor Ihr Name darunter steht

KI-erzeugte Dokumentation ist Dokumentation. Sie geht unter Ihrem Namen hinaus, und der Leser wird Sie daran festhalten, nicht das Modell.

Tun Sie das vor dem Umwandeln, nicht danach. Eine dargestellte Seite sieht fertig aus, und was fertig aussieht, wird gelesen, als hätte es jemand geprüft.

- [ ] Jede Zahl: Können Sie sagen, woher sie kommt?
- [ ] Jeder Link: Öffnen Sie ihn. Plausible URLs, die nirgendwohin führen, sind ein häufiges Scheitern.
- [ ] Jedes Zitat, jede Quellenangabe und jeder Produktname: Bestätigen Sie, dass es existiert und richtig geschrieben ist.
- [ ] Jeder Code: Führen Sie ihn aus, oder sagen Sie deutlich, dass er ungetestet ist.
- [ ] Die selbstsicheren Passagen: Der Ton ist derselbe, ob das Modell es weiß oder ob es rät.
- [ ] Alles, was Sie in den Prompt eingefügt haben: Prüfen Sie, dass nichts davon in die Antwort zurückgespiegelt wurde.

Diese Liste ist die Zusammenfassung. Die fünf Prüfungen darunter sind die, die tatsächlich schiefgehen, in der Reihenfolge, in der sie schiefgehen, und sie lohnen sich einzeln und nicht als ein einziges Überfliegen.

| Was zu prüfen ist | Wie es sich liest, wenn es falsch ist | Was das Auslassen kostet |
| --- | --- | --- |
| Behauptungen, die Sie nicht belegen können | Selbstsicher, allgemein und niemandem zuzuschreiben | Jemand plant damit |
| Links | Eine plausible URL, die nirgendwohin führt | Ihre Glaubwürdigkeit, beim ersten Klick |
| Zitate, die Personen zugeschrieben werden | Ein echter Name neben Worten, die diese Person nie gesagt hat | Eine benannte Person, schriftlich falsch dargestellt |
| Zahlen ohne Herkunft | Eine genaue Angabe ohne Jahr und ohne Quelle | Eine Entscheidung auf Grundlage einer erfundenen Zahl |
| Aussagen über ein bestehendes Unternehmen | Ein Preis, eine Funktion, ein Limit, glatt behauptet | Eine öffentliche Behauptung über das Produkt eines anderen |

### Behauptungen, die Sie nicht belegen können

Die Regel ist nicht „ist das plausibel“ — Modellausgabe ist durchgehend plausibel, und genau das ist das Problem. Die Regel ist: Können Sie sagen, woher es kommt? Ist die Antwort ein Dokument, eine Seite oder eine Person, behalten Sie es. Ist die Antwort „es klingt richtig“, belegen Sie es oder streichen Sie den Satz.

Achten Sie auf die selbstsichere Mitte eines Absatzes und nicht auf die Enden. Anfang und Schluss werden aufmerksam gelesen, weil sie das Argument tragen. Die tragende Erfindung ist meist ein Nebensatz auf halber Höhe, als Hintergrund hingestellt, den niemand hinterfragt, weil er nicht der Punkt des Satzes ist.

### Links, die nicht auflösen

Öffnen Sie jeden einzelnen. Nicht überfahren, öffnen. Ein Modell, das gelernt hat, wie Dokumentations-URLs aussehen, kann eine URL-förmige Zeichenkette für eine Seite erzeugen, die nie existiert hat, und die Form ist überzeugend: die richtige Domain, ein plausibler Pfad, manchmal ein plausibler Anker.

Hier verstecken sich zwei Arten des Scheiterns. Der tote Link ist die offensichtliche und er scheitert laut, was der gute Fall ist. Der schlimmere Fall ist ein lebender Link auf die falsche Seite — die richtige Domain, ein echtes Dokument, und nicht das, welches die Behauptung daneben stützt. Prüfen Sie, dass die Seite, auf der Sie landen, das sagt, was der Satz von ihr behauptet.

### Zitate, die Personen zugeschrieben werden

Behandeln Sie jedes Anführungszeichen um die Worte einer benannten Person als Defekt, bis das Gegenteil bewiesen ist. Ein falsch zugeschriebenes Zitat ist das Schädlichste in dieser Liste, denn es ist eine schriftliche Aussage darüber, was eine identifizierbare Person gesagt hat, es reist gut, und es lässt sich von der betroffenen Person mühelos widerlegen.

Finden Sie das Original. Wenn Sie das Original nicht finden, entfernen Sie die Anführungszeichen und den Namen gemeinsam und schreiben Sie den Punkt in Ihren eigenen Worten. Eine Umschreibung, für die Sie einstehen können, ist mehr wert als ein Zitat, für das Sie es nicht können.

### Zahlen ohne Herkunft

Jede Angabe braucht drei Dinge: einen Wert, eine Einheit und ein Datum. Modellausgabe liefert regelmäßig das Erste und lässt die anderen zwei weg, und ein Prozentwert ohne Jahr daneben ist keine Information. Achten Sie besonders auf Zahlen, die sich zu rund anfühlen, und auf Zahlen, die sich zu genau anfühlen — beide sind Muster und keine Messungen.

Wo die Zahl wichtig ist und Sie sie nicht belegen können, sagen Sie das im Dokument. „Etwa ein Drittel, aus dem Export des zweiten Quartals, nicht unabhängig geprüft“ ist für einen Leser nützlich. Ein nacktes „34 %“, das niemand zurückverfolgen kann, ist schlimmer als nichts, denn es wird weiterzitiert werden, ohne den Vorbehalt, den Sie nie aufgeschrieben haben.

### Alles über ein bestehendes Unternehmen

Preise, Grenzen von Tarifen, verfügbare Funktionen, Lizenzbedingungen, ob ein Produkt noch existiert — all das ändert sich, all das wird selbstsicher behauptet, und all das sind Aussagen über das Geschäft eines anderen, die mit Ihrem Namen darauf hinausgehen. Ein falscher Preis in einem Dokument, das intern kreist, wird zu einem falschen Preis in einem Budget.

Die Prüfung besteht darin, die Seite des Anbieters selbst zu öffnen und zu lesen. Keine Vergleichsseite, keine Zusammenfassung, nicht das, was Sie vom letzten Jahr erinnern — die Seite, die das Unternehmen veröffentlicht. Wenn Sie die Behauptung behalten, behalten Sie das Datum daneben, damit der nächste Leser weiß, wie alt sie ist.

### Füllmaterial, und die Form, in die Modelle verfallen

Streichen Sie auch das Füllmaterial. Modelle polstern: eine Eröffnung, die die Frage wiederholt, ein Schlussabsatz, der zusammenfasst, was der Leser gerade gelesen hat. Löschen Sie beides.

Derselbe Instinkt gilt für die Struktur. Eine Antwort mit drei Punkten braucht nicht drei Überschriften, eine Aufzählung und eine zusammenfassende Tabelle, die dieselben drei Punkte in drei Formen sagen. Diese Schichtung ist es, die kurze Inhalte gewichtig aussehen lässt, und sie wieder abzutragen ist meist der Unterschied zwischen einer Seite, die sich durchdacht liest, und einer, die sich erzeugt liest.

## Sichern, umwandeln, die Seite senden

Der Weg, der hält, ist langweilig und dauert eine Minute.

**Sichern Sie die Antwort als Datei.** Kopieren drücken, in einen beliebigen Texteditor einfügen, als `handover.md` speichern. Eine .md-Datei ist reiner Text: nichts zu installieren, nichts, was schiefgehen kann. Was Sie nicht können, ist sie zu senden — auf dem Rechner einer Kollegin öffnet sie sich in dem Programm, das die Endung für sich beansprucht, oder in gar keinem.

**Wandeln Sie sie in HTML um.** [Die Markdown-zu-HTML-Konvertierung](/) tut das im Browser: Datei hineinziehen, und die Arbeit passiert auf Ihrem eigenen Rechner. Abgemeldet verlässt die Datei ihn nie, was zählt, wenn die Antwort etwas Internes enthält. Sie bekommen eine Vorschau, den genauen HTML-Quelltext und einen Download — eine eigenständige .html-Datei mit eingebetteten Stilen, ohne Skripte und ohne Netzwerkanfragen. Mehrere Antworten, mehrere Dateien: Ziehen Sie alle zugleich hinein, und sie werden der Reihe nach zu einem Dokument verkettet, durch eine Linie getrennt. Eine Chat-Antwort sind ein paar Kilobyte Text, hier kommt also nichts in die Nähe der Grenze von 10 MB für die Konvertierung; diese Obergrenze existiert für eingescannte Dokumente, nicht für Prosa.

**Senden Sie die Seite, nicht die Datei.** Die .html öffnet sich auf jedem Rechner per Doppelklick. Ist ein Anhang trotzdem die falsche Form, melden Sie sich an und veröffentlichen Sie stattdessen einen Nur-Lese-Link: lesbar für jeden, der die Adresse hat, oder nur für die Adressen, die Sie nennen. Widerrufen Sie ihn, und ein schon versandter Link hört auf zu funktionieren. [Die vier Wege, ein Dokument zu senden](/blog/share-a-markdown-document-as-a-link) behandelt, welcher zu welchem Leser passt.

```bash
# mit einem Schlüssel, den `tp login` schon gespeichert hat, ist Veröffentlichen eine Zeile
node cli/tp.mjs push handover.md --share link
```

Die drei Schritte dauern zusammen etwa eine Minute, und die Minute kauft etwas Bestimmtes: ein Artefakt mit einer Adresse, statt eines Eingefügten pro Empfänger und keiner Möglichkeit, eines davon zu korrigieren. Wenn Sie einen Fehler in einer Seite finden, reparieren Sie die Seite. Wenn Sie einen Fehler in sechs Eingefügten finden, schreiben Sie sechs Entschuldigungen.

### Die Frage nach der Vertraulichkeit, die niemand stellt

Mitten in all dem steckt ein Schritt, den Leute tun, ohne darüber nachzudenken, und er verdient einen Satz Nachdenken. Einen Entwurf in einen Online-Konverter einzufügen ist ein Upload. Die meisten Konverter arbeiten serverseitig, was bedeutet, dass der Text Ihren Rechner verlässt, das Netz überquert und auf Hardware geparst wird, die Sie nicht kontrollieren, von einem Unternehmen, dessen Aufbewahrungsrichtlinie Sie nicht gelesen haben.

Der Inhalt macht es schlimmer und nicht besser. Das Dokument, das Sie umwandeln, ist eine Chat-Antwort, und eine Chat-Antwort enthält, was Sie in den Prompt gegeben haben: den Namen des Kunden, das unveröffentlichte Datum, die Gehaltsspanne, den Absatz, den Sie aus einem internen Dokument eingefügt haben, um ihn zusammenfassen zu lassen. Das ist genau die Klasse von Text, die man nicht als Nebenprodukt des Formatierens an einen zusätzlichen Anbieter geben sollte.

Das Gegenargument lautet, der Assistent habe den Text ja schon, was mache da eine weitere Kopie. Es macht etwas, weil es ein anderes Unternehmen, eine andere Aufbewahrungsfrist, eine andere Rechtsordnung und eine andere Angriffsfläche ist, und weil Ihre Organisation dem ersten zugestimmt hat und von dem zweiten nichts weiß. Ein Anbieter ist eine Entscheidung. Zwei sind ein Versehen.

Die Prüfung dauert zehn Sekunden und ist keine Frage des Vertrauens. Öffnen Sie den Netzwerk-Tab des Browsers, wandeln Sie eine Datei um und schauen Sie zu. Ein Konverter, der im Browser läuft, stellt beim Hineinziehen der Datei keine Anfrage — Sie können die Abwesenheit sehen. Ein Konverter, der hochlädt, zeigt Ihnen die Anfrage, mit der Datei darin. Das ist eine Tatsache über das Werkzeug und keine Behauptung in seiner Werbung, und [die weitere Frage, was ein Online-Konverter mit Ihrer Datei macht](/blog/is-an-online-converter-safe), lohnt es, einmal zu lesen und dann für immer zu wissen.

Die Konvertierung im Browser ist der Grund, warum TransformPipe sagen kann, dass nichts hochgeladen wird, solange Sie abgemeldet sind: es gibt keinen Upload zu beschreiben. Das Anmelden ändert das absichtlich, denn ein Dokument zu speichern und einen Link zu veröffentlichen setzt beides einen Server voraus, der es hält — und das ist ein Handel, den Sie bewusst eingehen, pro Dokument, statt standardmäßig.

### Das Kopieren ganz auslassen

Die Zwischenablage ist das schwache Glied in all dem, und man kann sie entfernen. Ein Assistent mit einem Konnektor zu einem Konvertierungsdienst erledigt die ganze Folge innerhalb des Gesprächs: er nimmt den Text, den er gerade geschrieben hat, wandelt ihn um und gibt Ihnen eine Datei oder einen Link zurück, ohne dass etwas davon durch ein Textfeld läuft. Nichts bekommt die Gelegenheit zur Autokorrektur, weil nie etwas eingefügt wurde.

Der Mechanismus ist ein MCP-Server, oder ein API-Aufruf, oder ein CLI-Aufruf aus dem, was der Assistent ausführen darf — dieselbe Konvertierung in jedem Fall, von einer anderen Seite her erreicht. [Dokumente aus einem Assistenten heraus umwandeln](/blog/converting-documents-from-an-assistant) behandelt, was jeder Weg kann und was nicht. Es ist die richtige Antwort, wenn das oft genug vorkommt, um eine Gewohnheit statt einer Besorgung zu sein, und es ändert nichts an dem Schritt der Prüfung darüber, der weiterhin Ihrer ist.

## Wo eine Seite, die fertig aussieht, scheitert, und was das kostet

Hier kommt der unangenehme Teil, und er ist der Grund, warum der Abschnitt über die Prüfung vor dem Abschnitt über die Konvertierung steht und nicht danach.

Formatierung ist ein Signal für Glaubwürdigkeit, und es ist eines, das Leser anwenden, ohne es zu merken. Eine Wand unformatierten Textes wird skeptisch gelesen; der Leser nimmt an, es sei ein Entwurf, und behandelt die Behauptungen als vorläufig. Derselbe Inhalt mit Überschriften, einer Tabelle und gleichmäßigen Abständen wird als Dokument gelesen — als etwas, das durch einen Prozess ging, das jemand geprüft hat, hinter dem ein Maß an Sorgfalt steht. Nichts davon gilt für eine umgewandelte Chat-Antwort, und die Konvertierung ist genau das, was den Eindruck liefert.

Modellausgabe ist also dann am gefährlichsten, wenn sie gut formatiert ist. Nicht, wenn sie falsch ist — sie ist so oder so gleich häufig falsch —, sondern wenn die Aufmachung eine Autorität borgt, die der Inhalt nicht verdient hat. Die erfundene Quellenangabe, die in einem rohen Eingefügten hinterfragt worden wäre, wird in einer gestalteten Seite zweimal weitergeleitet. Das sind echte Kosten des Arbeitsablaufs, den dieser Artikel empfiehlt, und das Einzige, was sie aufwiegt, ist die Prüfliste oben, ordentlich abgearbeitet, jedes Mal.

Zwei Gewohnheiten helfen. Sagen Sie, was das Dokument ist: eine Zeile oben, die „mit einem Assistenten entworfen, Zahlen gegen den Export des zweiten Quartals geprüft, Links verifiziert“ lautet, kostet nichts und reist mit der Datei. Und behalten Sie die `.md`-Quelle neben der Seite, damit die nächste Person sehen kann, was sich zwischen der Antwort des Modells und dem, was Sie gesendet haben, geändert hat.

Umwandeln lohnt sich auch nicht immer. Manchmal gewinnt ein anderes Werkzeug klar.

Muss der Empfänger den Text bearbeiten, senden Sie etwas Bearbeitbares: fügen Sie ihn in ein Dokument ein, nehmen Sie hin, dass der Codeblock leiden wird, und lassen Sie ihn arbeiten. Brauchen Sie eine echte .docx, konvertiert Pandoc zwischen Formaten, die ein Konverter im Browser nicht anfasst, und [es ist das bessere Werkzeug für diese Aufgabe](/blog/pandoc-alternatives-for-markdown-to-html).

Sind es drei Sätze, tippen Sie sie in die Nachricht. Ein Schritt der Konvertierung für einen Absatz ist Zeremonie.

Gehört der Inhalt ins Wiki des Teams, legen Sie ihn dorthin. Notion, Confluence und die meisten Ticketsysteme nehmen Markdown beim Import oder beim Einfügen an, jedes mit seinen eigenen Eigenheiten. Eine geteilte Seite ist für Dokumente ohne Zuhause, nicht für Inhalte, die schon eines haben.

Und wenn die Antwort in zwei Wochen falsch sein wird — ein Status, ein Satz Zahlen, die sich wöchentlich bewegen —, ist eine Seite der falsche Behälter, ganz unabhängig davon, wie gut sie sich umwandeln lässt. Dokumente überleben ihre Richtigkeit, und eine gut gemachte Seite überlebt sie länger, denn sie sieht weiterhin autoritativ aus, nachdem sie aufgehört hat, wahr zu sein.

## Wie Sie wählen, was Sie senden

1. **Gehen Sie davon aus, was der Leser damit tun wird.** Lesen verlangt eine Seite, Bearbeiten verlangt eine bearbeitbare Datei, und Genehmigen verlangt, dass die Zahlen belegt sind, bevor irgendetwas anderes passiert. Das Format zu wählen, bevor Sie das Verb kennen, ist der Weg, auf dem ein Dokument für alle in der falschen Form endet.
2. **Zählen Sie die Konstrukte, bevor Sie die Wörter zählen.** Eine Tabelle, ein eingezäunter Block oder ein Ausdruck in Dollarzeichen genügt als Garantie, dass irgendein Zielort ihn verstümmelt, und ab da ist Umwandeln keine Vorliebe mehr, sondern der einzige Weg, der hält.
3. **Entscheiden Sie, ob der Text Ihren Rechner verlassen darf.** Darf er es nicht, muss der Konverter im Browser laufen oder auf Hardware, die Sie kontrollieren, und der kürzeste Weg — in das erste Werkzeug einfügen, das eine Suche ausspuckt — wird der, den Sie nicht nehmen können.
4. **Planen Sie die Prüfung ein, nicht nur die Konvertierung.** Umwandeln dauert eine Minute; fünf Zahlen zu belegen und neun Links zu öffnen dauert zwanzig. Nur die Minute einzuplanen ist der Weg, auf dem ungeprüfte Ausgabe ein Stylesheet bekommt und beginnt, wie geleistete Arbeit auszusehen.
5. **Erzeugen Sie ein Artefakt statt eines Eingefügten pro Person.** Die Empfängerliste wächst, nachdem Sie gesendet haben — jemand leitet es weiter, jemand fragt eine Woche später danach —, und eine Seite lässt sich unverändert weitergeben. Eingefügtes nicht: jedes davon ist eine eigene Kopie, die für sich altert.
6. **Testen Sie jeden Zielort einmal, dann hören Sie auf zu raten.** Fügen Sie eine repräsentative Antwort — Tabelle, Code-Zaun, verschachtelte Liste — in das Werkzeug ein, das Sie am häufigsten benutzen, behalten Sie das Ergebnis und verlassen Sie sich darauf. Das Verhalten ist je Zielort stabil, auch wenn es zwischen ihnen wild schwankt.

## Fazit

Die Antwort im Chat-Fenster ist eine Darstellung, und was Sie kopieren, ist die Quelle, die sie erzeugt hat. Jeder Zielort, in den Sie einfügen, entscheidet neu, was diese Quelle bedeutet, und darum ist derselbe Text in einem Fenster saubere Prosa und im nächsten voller Pipes und Sternchen, und darum behebt es nie etwas, mit dem Assistenten über Formatierung zu streiten. Wenn eine Antwort das nächste Mal wert ist, behalten zu werden, sichern Sie sie als `.md`, bevor Sie irgendetwas anderes tun. Lesen Sie sie gegen die Prüfliste, korrigieren Sie, was das Modell geraten hat, streichen Sie die Polsterung, wandeln Sie sie dann einmal um und senden Sie die Seite — eine Datei, eine Adresse und dasselbe Dokument für jeden, der sie öffnet.

## FAQ

### Warum zeigt die ChatGPT-Ausgabe Sternchen und Rautezeichen, wenn ich sie einfüge?

Weil der Assistent Markdown geschrieben hat und das Chat-Fenster es zur Anzeige dargestellt hat. Die Kopierschaltfläche gibt Ihnen die darunterliegende Quelle, und ein Zielort ohne Markdown-Parser zeigt diese Zeichen genau so, wie sie sind. Es ist nichts kaputt; Sie sehen den Text, der die Formatierung erzeugt hat, die Sie gesehen haben.

### Wie füge ich eine KI-Antwort in Word ein, ohne die Tabelle zu verlieren?

Wählen Sie die dargestellte Antwort mit der Maus aus, statt die Kopierschaltfläche zu benutzen, und der Browser legt eine Fassung als formatierten Text in die Zwischenablage, die Word meist annimmt, Tabellen inbegriffen. Prüfen Sie danach die Codeblöcke und die Anführungszeichen, denn Words Autokorrektur bearbeitet, was Sie einfügen. Für alles, was genau stimmen muss, wandeln Sie die Datei um, statt sie einzufügen.

### Was ist der beste Weg, jemandem ein KI-erzeugtes Dokument zu senden?

Sichern Sie es als `.md`-Datei, prüfen Sie es und wandeln Sie es in eine einzige eigenständige HTML-Datei oder einen Nur-Lese-Link um. Beide öffnen sich per Doppelklick oder per Klick, auf jedem Rechner, ohne Installation und ohne dass der Leser Markdown kennen muss. Das Einfügen ist nur dann verlässlich, wenn der Zielort ein Markdown-eigenes Werkzeug ist, etwa Notion oder ein Markdown-Kommentarfeld.

### Warum werden die Dollarzeichen um meine Gleichungen nicht zu Mathematik?

Weil Mathematik in Dollarzeichen in keiner Markdown-Spezifikation steht. Es ist eine Konvention, die manche Renderer nachträglich hinzugefügt haben, weshalb das Chat-Fenster und GitHub sie darstellen, während ein Allzweckkonverter die Zeichen unverändert durchgibt. Nehmen Sie einen Konverter mit einem Modus für Mathematik, rendern Sie die Ausdrücke vor, oder schreiben Sie einfache Formeln in schlichter Notation.

### Ist es sicher, einen KI-Entwurf in einen Online-Konverter einzufügen?

Nur wenn Sie wissen, wo die Konvertierung passiert. Ein serverseitiger Konverter empfängt einen Upload eines Dokuments, das wahrscheinlich alles enthält, was Sie in den Prompt gegeben haben, und das ist oft der vertraulichste Text, den Sie die ganze Woche anfassen. Öffnen Sie den Netzwerk-Tab und schauen Sie zu: ein Konverter, der im Browser läuft, stellt überhaupt keine Anfrage.

### Sollte ich Leuten sagen, dass ein Dokument von einem Modell entworfen wurde?

Ja, in einer Zeile, zusammen damit, was Sie geprüft haben. Es kostet nichts, es stellt die Skepsis des Lesers auf die richtige Höhe, und es schützt Sie, wenn eine Zahl, die Sie verifiziert haben, sich als schon an der Quelle falsch erweist. Nicht offengelegte Modellausgabe, die später scheitert, ist ein viel unangenehmeres Gespräch als offengelegte Ausgabe, die später scheitert.

### Kann ich die Antwort herausbekommen, ohne sie überhaupt zu kopieren?

Ja, wenn der Assistent einen Konvertierungsdienst direkt erreichen kann, über einen Konnektor, eine API oder einen Befehl, den er ausführen darf. Der Text geht vom Modell zum Konverter, ohne die Zwischenablage zu berühren, und das nimmt die Autokorrektur und halb geparste Einfügungen ganz aus dem Vorgang heraus. Der Schritt der Prüfung bleibt genau da, wo er war.
