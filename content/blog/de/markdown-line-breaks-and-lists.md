---
title: "Zeilenumbrüche und Listen in Markdown: die Regeln und die kleinen Tücken"
description: "Warum ein Zeilenumbruch ein Leerzeichen ist, was zwei Leerzeichen und ein Backslash tun, wie weit eine verschachtelte Liste einrückt und dicht gegen locker"
updated: 2026-09-09
date: 2026-07-11
tag: Syntax
keywords: markdown zeilenumbruch, markdown neue zeile, markdown zwei leerzeichen, markdown verschachtelte liste, markdown nummerierte liste, markdown checkbox, markdown aufgabenliste, markdown escape zeichen, markdown liste einrücken, dichte und locker gesetzte listen, commonmark harter zeilenumbruch, markdown br tag, markdown sanfter zeilenumbruch, markdown backslash zeilenumbruch, markdown liste verschachtelt nicht, markdown breaks option, markdown listen nummerierung
---

Markdown ist klein genug, dass die meisten Menschen es durch Nachahmung lernen und die Regeln nie lesen. Das trägt, bis eine Zeile sich weigert zu brechen, eine Liste als ein einziger langer Absatz ankommt oder ein Sternchen, das Sie wörtlich gemeint haben, die halbe Zeile verschluckt. Nichts davon ist ein Fehler. Jeder Fall ist eine Regel, die tut, was sie sagt, an einer Stelle, an der die Quelldatei mit keinem sichtbaren Zeichen andeutet, dass überhaupt etwas passiert.

### Kurzfassung

Ein einzelner Zeilenumbruch ist ein Leerzeichen und kein Umbruch: CommonMark nennt ihn einen sanften Zeilenumbruch und lässt Renderern frei, ihn als Leerraum zu drucken, was eine `.md`-Datei fast überall tut. Um eine Zeile innerhalb eines Absatzes zu brechen, beenden Sie sie mit **zwei Leerzeichen** oder einem **Backslash**; um eine neue zu beginnen, lassen Sie eine **Leerzeile**. Eine verschachtelte Liste rückt um die Breite der Markierung des Elternelements plus die Leerzeichen danach ein — **zwei unter `- `, drei unter `1. `** — und eine einzige Leerzeile irgendwo innerhalb einer Liste macht jedes Element locker und packt seinen Text in `<p>`. Alles andere auf dieser Seite ist eine dieser zwei Regeln, angewandt an einer Stelle, an der Sie nicht hingesehen haben.

Die Regeln stehen geschrieben. CommonMark ist die Spezifikation, die sie festlegt, und Version 0.31.2 ist die aktuelle (geprüft auf spec.commonmark.org, 9. September 2026). Jeder Fall unten ist eine nummerierte Regel darin und nicht die Eigenart eines bestimmten Werkzeugs. Womit eine Spezifikation nicht helfen kann: keine dieser Regeln hinterlässt eine Spur in der Quelle. Ein Leerzeichen am Zeilenende sieht wie nichts aus. Zwei Leerzeichen Einrückung sehen wie drei aus. Eine Leerzeile in einer Liste sieht nach Ordnung aus.

Zeilenumbrüche und Listen gehören in einen Text, weil sie eine Arithmetik teilen. Ob eine Zeile bricht, hängt davon ab, was an ihrem Ende steht; ob ein verschachteltes Element verschachtelt, hängt davon ab, wie weit seine Zeile von der Inhaltsspalte des Elternelements entfernt beginnt. Beides wird in Zeichen gezählt, die Sie nicht sehen können, und beides scheitert lautlos — kein Fehler, keine Warnung, nur eine Ausgabe, die nicht die gemeinte ist, meist von jemand anderem bemerkt.

## Die Übersicht: das Symptom und die Regel dahinter

| Symptom | Die Regel, die es tut | Was stattdessen zu schreiben ist |
| --- | --- | --- |
| Zwei Zeilen kamen als eine heraus | Ein einzelner Zeilenumbruch ist ein sanfter Zeilenumbruch, gedruckt als Leerzeichen | Zwei Leerzeichen am Zeilenende, ein Backslash oder eine Leerzeile |
| Es bricht in einem Kommentarfeld und nicht in einer Datei | Manche Renderer machen aus jedem Zeilenumbruch ein `<br>`; eine `.md`-Datei nicht | Schreiben Sie den Umbruch ausdrücklich, dann übersteht er beides |
| Das erste Listenelement landete im Absatz darüber | Eine nummerierte Liste darf einen Absatz nur unterbrechen, wenn sie bei `1` beginnt | Lassen Sie eine Leerzeile über der Liste |
| Die ganze Liste kam in Festbreitenschrift heraus | Vier Leerzeichen auf oberster Ebene sind ein eingerückter Codeblock | Beginnen Sie die Liste innerhalb von drei Leerzeichen zum Rand |
| Das verschachtelte Element wurde ein Geschwister | Die Einrückung des Inhalts ist die Breite der Markierung plus die Leerzeichen danach | Zwei Leerzeichen unter `- `, drei unter `1. ` |
| Das verschachtelte Element wurde ein Codeblock | Der Inhalt liegt vier oder mehr Spalten hinter der Inhaltsspalte des Elternelements | Zählen Sie von der Inhaltsspalte, nicht vom Rand |
| Die Liste bekam senkrechten Abstand, um den niemand gebeten hat | Eine Leerzeile irgendwo darin macht die ganze Liste locker | Entfernen Sie sie, oder nehmen Sie ein `<p>` in jedem Element hin |
| Die Zahlen haben sich selbst neu nummeriert | Nur die erste Markierung wird gelesen; den Rest zählt der Browser | Schreiben Sie absichtlich `1.` für jedes Element |
| Eine Liste wurde lautlos zu zwei | Ein anderes Punktzeichen oder ein anderer Trenner beginnt eine neue Liste | Ein Punktzeichen und ein Trenner pro Datei |
| Eine Jahreszahl am Zeilenanfang wurde zu Element eins | `1986. ` ist eine gültige Markierung für eine nummerierte Liste | `1986\. ` |
| Die Sternchen verschwanden und die Wörter wurden kursiv | `*` öffnet Betonung überall, auch innerhalb eines Wortes | `\*Stern\*`, oder eine Code-Spanne |
| Die Checkbox erschien als `[ ]` | Aufgabenlisten sind eine GFM-Erweiterung, nicht CommonMark | Ein Konverter, der GFM spricht |
| Am Zeilenende wurde ein Backslash gedruckt | Keine der beiden Umbruch-Syntaxen wirkt am Ende eines Blocks | Setzen Sie den Umbruch zwischen zwei Zeilen, nie hinter die letzte |
| Der zweite Absatz des Elements fiel aus der Liste | Eine Fortsetzungszeile muss die Inhaltsspalte des Elements erreichen | Rücken Sie sie dorthin ein, wo der Text des Elements selbst beginnt |
| Die Unterliste unter Element zehn verlor ihre Einrückung | `10. ` ist eine Spalte breiter als `9. ` | Zählen Sie die Markierung bei zehn neu, oder rücken Sie alles um vier ein |
| Die Markierung des verschachtelten Elements erschien als Bindestrich mitten im Satz | Zu weit eingerückter Text ohne Leerzeile darüber ist Absatzfortsetzung | Rücken Sie bis zur Inhaltsspalte ein, nicht darüber hinaus |

Jede Zeile ist eine Regel aus der CommonMark-Spezifikation und nicht die Meinung eines Werkzeugs, und der
Rest dieser Seite sind diese Regeln mit ausgeschriebener Arithmetik.

## Drei Wege, eine Zeile zu beenden

Beginnen Sie beim Absatz, denn jede Frage nach einem Zeilenumbruch ist eine verkleidete Frage nach Absätzen. Ein Absatz ist eine Folge aufeinanderfolgender nicht leerer Zeilen. Er endet an einer Leerzeile und nirgends sonst. Die Zeilenenden darin sind kein Inhalt: CommonMark nennt ein Zeilenende innerhalb eines Absatzes einen sanften Zeilenumbruch und sagt, ein Renderer dürfe es auf verschiedene Weisen darstellen. Der überwältigende Standard, und was eine `.md`-Datei tut, wo auch immer sie dargestellt wird, ist ein einzelnes Leerzeichen.

Also das hier:

```markdown
Rosen sind rot
Veilchen sind blau
```

ist ein Absatz, zwei Zeilen Quelle und eine Zeile Ausgabe. Der Zeilenumbruch übersteht es als Leerraum ins HTML, und der Browser faltet ihn zusammen, wie er jede Folge von Leerraum zusammenfaltet. Nichts ging verloren und nichts brach. Die Datei ist mit Ihnen nur nicht einer Meinung darüber, wo eine Zeile endet.

Zwei Details dieser Definition zählen später. Die Zeilen eines Absatzes dürfen jeweils mit bis zu drei
Leerzeichen Einrückung beginnen, ohne dass sich etwas ändert, weshalb eine leicht eingerückte Zeile sich
weiterhin dem Absatz darüber anschließt, statt etwas Neues zu werden. Und der Leerraum auf beiden Seiten
eines inneren Zeilenendes wird verworfen: die Spezifikation sagt, dass Leerzeichen am Ende einer Zeile
und am Anfang der nächsten entfernt werden (geprüft auf spec.commonmark.org, 9. September 2026). Die
zweite Zeile eines Absatzes auszurichten bewirkt an der Ausgabe nichts, und sie nicht auszurichten auch nicht.

Drei Dinge ändern das, und ein viertes umgeht die Frage.

| Was Sie schreiben | Was der Parser damit macht | Was Sie bekommen |
| :--- | :--- | :--- |
| Eine Leerzeile | Beendet den Absatz | Einen neuen Absatz, `<p>` |
| Zwei oder mehr Leerzeichen am Zeilenende | Ein harter Zeilenumbruch | `<br>` innerhalb desselben Absatzes |
| Ein Backslash am Zeilenende | Ein harter Zeilenumbruch | `<br>` innerhalb desselben Absatzes |
| Ein wörtliches `<br>` | Rohes HTML, durchgelassen oder maskiert | `<br>`, wenn der Konverter rohes HTML erlaubt |

### Zwei Leerzeichen am Zeilenende, der Umbruch, den niemand sehen kann

Die Zwei-Leerzeichen-Regel ist der ursprüngliche harte Zeilenumbruch und der zerbrechliche. Leerraum am Zeilenende ist unsichtbar, viele Editoren entfernen ihn beim Speichern, Linter markieren ihn, und ein Prüfer, der einen Diff liest, kann nicht sehen, was sich geändert hat.

Zwei Details, die die Spezifikation ergänzt und die meisten Anleitungen weglassen. Die Regel lautet zwei Leerzeichen *oder mehr*, eine Zeile, die auf fünf Leerzeichen endet, bricht also genauso wie eine, die auf zwei endet — was zum Teil der Grund ist, warum niemand es durch Hinsehen erkennen kann, und warum „noch ein Leerzeichen dazu" nie die Lösung ist. Und keine der beiden Formen bewirkt am Ende eines Blocks etwas: ein harter Zeilenumbruch braucht eine Zeile nach sich innerhalb desselben Absatzes, Leerzeichen am Ende der letzten Zeile eines Absatzes sind also nur Leerzeichen am Zeilenende.

Ein drittes Detail entscheidet einen Streit, den Leute mit ihren eigenen Dateien haben. Ein harter
Zeilenumbruch kann nicht innerhalb einer Code-Spanne und nicht innerhalb eines HTML-Tags passieren.
Packen Sie zwei Zeilen in Backticks, mit zwei Leerzeichen am Ende der ersten, und der Renderer gibt Ihnen
ein einzelnes `<code>`-Element zurück, das diese Leerzeichen als Inhalt und den Zeilenumbruch als Leerraum
trägt — nirgends ein Umbruch. Wenn das, was Sie brechen wollen, innerhalb einer Code-Spanne liegt, ist die
Syntax, die Sie brauchen, ein eingezäunter Codeblock und kein Zeilenumbruch.

### Der Backslash, und die eine Stelle, an der er sich selbst druckt

Die Backslash-Form tut dieselbe Arbeit in aller Sichtbarkeit. Die Spezifikation führt sie als die
sichtbarere Alternative zu zwei oder mehr Leerzeichen ein. Sie ist eine Ergänzung von CommonMark: das
ursprüngliche Markdown-Syntaxdokument beschreibt nur die Zwei-Leerzeichen-Form und behandelt einen
Backslash ausschließlich als Weg, ein wörtliches Zeichen zu drucken (geprüft auf daringfireball.net,
9. September 2026), ein Parser, der vor CommonMark geschrieben wurde, druckt also den Backslash, statt die
Zeile zu brechen.

Seine Art zu scheitern ist das Gegenteil der Zwei-Leerzeichen-Variante, und der Unterschied ist es wert,
absichtlich gewählt zu werden. Beide sind am Ende eines Blocks wirkungslos, aber nur der Backslash sagt es
Ihnen. Ein Absatz, dessen letzte Zeile `foo\` ist, wird als `<p>foo\</p>` dargestellt, Backslash und
alles; eine Überschrift, geschrieben als `### foo\`, wird als `<h3>foo\</h3>` dargestellt. Dieselben
Positionen mit zwei Leerzeichen am Zeilenende geschrieben ergeben `<p>foo</p>` und `<h3>foo</h3>` — nichts
brach, und nichts sagte es. Die eine Syntax scheitert laut auf der Seite; die andere scheitert lautlos und
wartet darauf, dass ein Leser eine durchgelaufene Zeile bemerkt.

### `<br>`, und was der Konverter davon hält

Die vierte Möglichkeit ist, für diese eine Zeile aufzuhören, Markdown zu benutzen, und `<br>` selbst zu schreiben. Markdown erlaubt rohes HTML von Entwurf her, ein wörtliches `<br>` in der Quelle kommt also in der Ausgabe als `<br>` an. Es ist die einzige der vier Formen, die in einem Diff sichtbar ist, einen Formatierer übersteht und von keiner Editoreinstellung gelöscht werden kann. Es hängt allerdings davon ab, dass der Konverter rohes HTML durchlässt, und das ist nicht selbstverständlich: markdown-it liefert `html: false` in seiner Standardvoreinstellung, kommentiert mit „Enable HTML tags in source" (geprüft auf cdn.jsdelivr.net, 9. September 2026), rohe Tags werden also maskiert, und Ihr `<br>` kommt als sichtbarer Text auf der Seite an, sofern nicht jemand diese Option eingeschaltet hat. Ein Konverter, der eine Datei bereinigt, die er nicht geschrieben hat, kann außerdem Tags verwerfen, die er nicht kennt. `<br>` steht auf jeder vernünftigen Positivliste, in der Praxis kommt es also an — aber das ist die Entscheidung des Konverters und nicht Ihre.

### Was ein einzelner Zeilenumbruch tut, Renderer für Renderer

Bevor man zwischen den vier Formen wählt, ist es wert zu sehen, was die Renderer tatsächlich tun, denn der Grund, warum sich die Frage nie erledigt, ist, dass dieselben zwei Zeilen Markdown verschiedene Dokumente erzeugen, je nachdem, wo sie dargestellt werden, und jeder einzelne dieser Renderer verhält sich korrekt. Die Erlaubnis der Spezifikation, sich zu unterscheiden, ist ausdrücklich — ein sanfter Zeilenumbruch darf auf verschiedene Weisen dargestellt werden, und ihn in ein `<br>` zu verwandeln ist eine davon. Was folgt, ist dieselbe Eingabe gegen die Renderer, denen Menschen tatsächlich begegnen, jede Zeile gegen die eigene Dokumentation des Projekts geprüft.

| Wo der Text dargestellt wird | Ein einzelner Zeilenumbruch wird | Wie es dokumentiert ist |
| --- | --- | --- |
| Eine `.md`-Datei, jeder CommonMark- oder GFM-Renderer | Ein Leerzeichen | Die Standardbehandlung eines sanften Zeilenumbruchs in der Spezifikation |
| Eine `.md`-Datei auf GitHub | Ein Leerzeichen | GitHubs Schreibanleitung sagt, ein Umbruch in einer `.md`-Datei braucht zwei Leerzeichen am Zeilenende, einen Backslash oder ein `<br/>` (geprüft auf docs.github.com, 9. September 2026) |
| Ein GitHub-Kommentar, ein Issue, ein Pull Request oder eine Review | `<br>` | Dieselbe Anleitung sagt, Kommentarfelder stellen den Zeilenumbruch für Sie dar (geprüft auf docs.github.com, 9. September 2026) |
| marked, wie ausgeliefert | Ein Leerzeichen | Seine Option `breaks` ist standardmäßig `false` (geprüft auf marked.js.org, 9. September 2026) |
| marked mit `gfm: true` und `breaks: true` | `<br>` | Dokumentiert als Nachbildung von GitHubs Verhalten in Kommentaren, ausdrücklich nicht seines Verhaltens bei dargestellten Markdown-Dateien; `breaks` setzt `gfm` voraus (geprüft auf marked.js.org, 9. September 2026) |
| markdown-it, wie ausgeliefert | Ein Leerzeichen | Seine Standardvoreinstellung setzt `breaks: false`, kommentiert mit „Convert '\n' in paragraphs into `<br>`" (geprüft auf cdn.jsdelivr.net, 9. September 2026) |
| markdown-it mit `breaks: true` | `<br>` | Derselbe Optionsname, dieselbe Arbeit |
| Python-Markdown, wie ausgeliefert | Ein Leerzeichen | Zeilenumbrüche innerhalb eines Absatzes sind Leerraum, sofern keine Erweiterung etwas anderes sagt |
| Python-Markdown mit der Erweiterung `nl2br` | `<br />` | Die Erweiterung behandelt jeden Zeilenumbruch als harten Umbruch; eingeschaltet mit `extensions=['nl2br']` (geprüft auf python-markdown.github.io, 9. September 2026) |
| Pandoc, das `markdown`, `gfm` oder `commonmark` liest | Ein Leerzeichen | Seine Erweiterung `hard_line_breaks` ist für alle drei standardmäßig abgeschaltet (geprüft auf pandoc.org, 9. September 2026) |
| Pandoc mit `+hard_line_breaks` | `<br />` | Die Erweiterung liest jeden Zeilenumbruch innerhalb eines Absatzes als harten Umbruch statt als Leerzeichen (geprüft auf pandoc.org, 9. September 2026) |

Zwei Folgen ergeben sich, und beide betreffen die Übergabe. Text, der in einem Kommentarfeld entworfen und in eine Datei eingefügt wird, fällt zusammen; Text, der in einer Datei entworfen und in ein Kommentarfeld eingefügt wird, gewinnt Umbrüche, die er nie hatte. Keiner der Renderer liegt falsch, denn das Dokument hat die Information in keiner der beiden Richtungen getragen.

Die zweite Folge ist schärfer. `breaks: true` ist eine Einstellung am Renderer und keine Eigenschaft des Dokuments, eine Datei, die davon abhängt, wird also an genau einer Stelle korrekt dargestellt — Ihrer. Schicken Sie sie in ein Repository, an ein E-Mail-Programm, in einen Build für eine statische Seite oder an den Konverter von irgendwem sonst, und die Umbrüche sind weg. Wenn der Umbruch zählt, legen Sie ihn in das Dokument: zwei Leerzeichen, ein Backslash oder ein `<br>` überstehen jede Zeile dieser Tabelle. [Die Optionen, die das Verhalten eines JavaScript-Renderers ändern](/blog/markdown-to-html-in-javascript), gehen weit über diese eine hinaus, und `breaks` ist die, die Leute umschalten, ohne daran zu denken, wer die Ausgabe liest.

Es gibt eine ehrenwerte Verwendung für die Option, und sie ist es wert, benannt zu werden, denn sie ist
der Fall, in dem Leute meist sind, wenn sie sie finden. Wenn Ihre Anwendung beide Enden besitzt — das
Feld, in das jemand tippt, und die Seite, auf der sein Text erscheint, und der Text verlässt sie nie als
`.md`-Datei — dann passt `breaks: true` zu dem, was ein Mensch, der in ein Feld tippt, erwartet, und
nichts weiter unten wird geschädigt. Ein Kommentarfeld, eine Chatnachricht, ein Notizbereich. In dem
Moment, in dem dieser Text exportiert, eingecheckt oder in ein Repository kopiert werden kann, hört die
Option auf, eine Annehmlichkeit zu sein, und wird ein Dokument, das nur zu Hause korrekt dargestellt wird.

### Welche der vier Formen man nimmt, und wo

Für laufende Prosa ist die Leerzeile fast immer das, was Sie wollten. Behalten Sie den harten Zeilenumbruch für die Stellen, an denen die neue Zeile Teil des Inhalts ist: eine Adresse, eine Strophe, eine zweizeilige Signatur.

| Das Dokument geht an | Nehmen Sie | Weil |
| :--- | :--- | :--- |
| Ein Repository, gelesen auf GitHub und in einem Editor | Einen Backslash | In einem Diff sichtbar, übersteht einen Leerraum-Trimm, und druckt sich selbst, wenn Sie ihn an eine nutzlose Stelle setzen |
| Einen Konverter, den Sie nicht kontrollieren | `<br>` | Rohes HTML, nur dem Bereinigen unterworfen, nicht den Zeilenumbruch-Optionen |
| Eine Datei, die ein Linter oder Formatierer beim Speichern anfasst | Einen Backslash oder `<br>` | Zwei Leerzeichen sind die eine Form, die eine Werkzeugkette löscht, ohne es Ihnen zu sagen |
| Ein Kommentarfeld, ein Issue, eine Chatnachricht | Überhaupt nichts | Diese Renderer brechen ohnehin bei jedem Zeilenumbruch |
| Prosa, in der der Umbruch nur optisch ist | Eine Leerzeile | Es ist ein neuer Absatz, und für Absätze werden Stylesheets geschrieben |

Keine der fünf Antworten ist eine Renderer-Einstellung, und das ist der Punkt: ein Dokument, das seine eigenen Umbrüche trägt, wird überall gleich dargestellt, wo es geöffnet wird. Listen haben dieselbe Form von Problem, gemessen in einer anderen Einheit — was eine Zeile dort tut, hängt davon ab, wie weit vom Rand entfernt sie beginnt.

## Warum die Liste keine Liste ist

Eine Liste braucht eine Leerzeile über sich. Direkt unter eine Zeile Prosa geschrieben, kann das erste Element in diesen Absatz aufgesogen werden und als ein verirrter Bindestrich mitten im Satz herauskommen.

Die Regeln unterscheiden sich hier zwischen Parsern. CommonMark lässt eine Punktliste einen Absatz unterbrechen, eine nummerierte nur, wenn sie bei `1` beginnt. Ältere Parser erlauben keines von beidem. Lassen Sie die Leerzeile, und es hört auf, eine Rolle zu spielen, welchen Konverter Sie benutzen — dieselbe Absicherung, die eine [Tabelle unversehrt hält](/blog/markdown-tables-that-survive-conversion), und ein Unterschied, den [der Text über die Dialekte](/blog/commonmark-gfm-and-the-flavours) vollständig behandelt.

### Einen Absatz unterbrechen, und der Satz, der die Regel gemacht hat

CommonMarks Position ist, dass eine Liste einen Absatz unterbrechen darf, mit zwei Ausnahmen, die am
ersten Element hängen: wenn sie auf einer Zeile beginnt, die sonst Absatzfortsetzungstext wäre, darf das
Element nicht mit einer Leerzeile beginnen, und wenn es nummeriert ist, muss seine Startzahl `1` sein
(geprüft auf spec.commonmark.org, 9. September 2026). Die Spezifikation erklärt das auf die einfachste
verfügbare Weise — indem sie den Satz druckt, der sonst zerbrechen würde:

```markdown
Die Zahl der Fenster in meinem Haus ist
14.  Die Zahl der Türen ist 6.
```

Das bleibt ein Absatz. Unter einer Regel, die jeder Zahl erlaubte zu unterbrechen, würde `14.` eine
nummerierte Liste öffnen, die bei vierzehn beginnt, und ein hart umbrochener Satz würde auseinanderfallen,
weil die Zeile zufällig an dieser Stelle umbrach. Das Unterbrechen auf `1` zu beschränken kauft nahezu
jede hart umbrochene Zahl in gewöhnlicher Prosa zurück, und es ist der Grund, warum die Regel
unsymmetrisch statt ordentlich ist.

Die praktische Lesart ist kurz. Eine Punktliste kann ohne Leerzeile auf einen Absatz folgen, und es
funktioniert. Eine nummerierte kann das auch, aber nur beginnend bei `1`, und nur unter CommonMark. Alles
Ältere will die Leerzeile. Schreiben Sie die Leerzeile, und nichts davon ist Ihr Problem.

### Vier Leerzeichen vom Rand sind keine Liste

Das entgegengesetzte Scheitern ist eine eingerückte Liste. Bis zu drei Leerzeichen Einrückung vor der Markierung ändern überhaupt nichts — die Liste wird dargestellt, als wären die Leerzeichen nicht da. Das vierte Leerzeichen ist das, das den Block ändert: ein Listenpunkt vier Leerzeichen vom linken Rand ist keine Liste, denn auf oberster Ebene bedeuten vier Leerzeichen weiterhin einen eingerückten Codeblock, die Liste kommt also als Text in Festbreitenschrift an, mit ihren Bindestrichen intakt.

Das ist ein billig zu diagnostizierendes Scheitern und ein leicht zu verursachendes. Eine aus einem
verschachtelten Zusammenhang herauskopierte Liste, ein Editor, der bei Enter einrückt, oder eine Kopie
aus einem Kommentarfeld, das schon eingerückt war, erzeugen es alle. Das Erkennungszeichen ist, dass an
der Quelle nichts falsch aussieht; die Ausgabe ist ein grauer Kasten.

### Die Zahlen, die Sie schreiben, werden meist ignoriert

In einer nummerierten Liste wird nur die erste Zahl gelesen. Die Startzahl der Liste wird von ihrem ersten Element genommen, und die Zahlen an jedem späteren Element werden verworfen — der Renderer gibt `<ol>` aus, oder `<ol start="5">`, und der Browser zählt von dort. Markierungen dürfen höchstens neun Ziffern haben: `123456789.` öffnet eine Liste, `1234567890.` ist ein Absatz, der mit einer sehr großen Zahl beginnt (geprüft auf spec.commonmark.org, 9. September 2026). `1)` funktioniert in CommonMark genauso gut wie `1.`.

| Was Sie schreiben | Was dargestellt wird | Die Regel |
| :--- | :--- | :--- |
| `1.` `2.` `3.` | 1, 2, 3 | Die erste Markierung setzt den Start; der Rest wird verworfen |
| `1.` `1.` `1.` | 1, 2, 3 | Dieselbe Regel, mit einer Datei, die aufhört, sich selbst zu widersprechen |
| `1.` `7.` `3.` | 1, 2, 3 | Wieder dieselbe Regel — die falschen Zahlen kosten nichts |
| `5.` `6.` `7.` | 5, 6, 7 | `<ol start="5">`, und der Browser zählt von fünf weiter |
| `5.` `1.` `1.` | 5, 6, 7 | Nur die `5` wurde gelesen |
| `0.` `0.` `0.` | 0, 1, 2 | Null ist eine erlaubte Startzahl |
| `1234567890.` | Ein Absatz | Zehn Ziffern sind eine zu viel für eine Markierung |

Jedes Element als `1.` zu schreiben hält Diffs klein: das Neunummerieren passiert zur Darstellungszeit statt über zwanzig Zeilen der Datei, ein Element in der Mitte einzufügen berührt also eine Zeile statt aller. Das Gegenargument ist, dass die Quelle nicht mehr in der richtigen Reihenfolge zu lesen ist, was zählt, wenn Menschen die `.md`-Datei direkt lesen. Beides ist vertretbar; nicht vertretbar ist eine Datei, in der manche Listen das eine und manche das andere tun, denn dann sieht ein verirrtes `7.` wie ein Fehler aus, den jemand beheben sollte.

### Ändern Sie die Markierung, und Sie haben zwei Listen

Das Punktzeichen oder den Trenner einer nummerierten Liste zu wechseln beginnt eine neue Liste. Das ist
eine Regel und keine Nachlässigkeit, und auf der dargestellten Seite ist es unsichtbar:

```markdown
- foo
- bar
+ baz
```

ist ein `<ul>` mit zwei Elementen, gefolgt von einem `<ul>` mit einem Element, und keine Liste mit dreien.
Dasselbe passiert zwischen `1.` und `1)`, und der nummerierte Fall ist lauter dabei, weil die zweite Liste
ihre eigene Zählung beginnt. Die üblichen Ursachen sind eine Datei, die zwei Menschen mit verschiedenen
Angewohnheiten bearbeitet haben, oder ein Block, der von irgendwo eingefügt wurde, wo `*` benutzt wurde,
während Ihre Datei `-` benutzt.

Im Browser sehen zwei benachbarte Punktlisten fast genauso aus wie eine, das geht also häufig in
Produktion. Was es verrät, ist der Abstand: enthält eine der beiden Listen eine Leerzeile, wird sie
locker, während ihre Nachbarin dicht bleibt, und plötzlich hat die halbe Liste mehr Luft um sich als die
andere Hälfte. Ein Punktzeichen und ein Trenner pro Dokument entfernt die ganze Kategorie.

## Wie weit man eine verschachtelte Markdown-Liste einrückt

Die Einrückung wird von der Inhaltsspalte des Elternelements gemessen, nicht vom linken Rand. Das ist die ganze Regel, und sie erklärt jede Liste, die sich weigert zu verschachteln.

```markdown
- Punktliste: der Inhalt beginnt in Spalte 2
  - also verschachteln zwei Leerzeichen darunter
1. Nummeriert: `1. ` ist drei Zeichen breit
   - also verschachteln drei Leerzeichen darunter
10. Bei zehn ist die Markierung vier breit
    - und vier Leerzeichen sind es, die verschachteln
```

Vier Leerzeichen sind die Angewohnheit, die die meisten Menschen mitbringen, und zusätzliche Einrückung ist erlaubt, es funktioniert also meistens. Es scheitert in beide Richtungen: zu wenig, und die verschachtelte Liste wird ein Geschwister ihres Elternelements; vier oder mehr Spalten hinter der Inhaltsspalte, und es ist wieder Code.

### Die Arithmetik, ausgeschrieben

Die Spezifikation baut ein Listenelement aus einer Markierung der Breite W, gefolgt von N Leerzeichen, wo
N zwischen eins und vier liegt, und rückt dann jede spätere Zeile dieses Elements um W + N ein (geprüft
auf spec.commonmark.org, 9. September 2026). W + N ist die Inhaltsspalte, und sie ist die einzige Zahl im
Spiel. GitHubs eigene Schreibanleitung gibt dieselbe Regel ohne die Algebra: tippen Sie so viele
Leerzeichen vor das verschachtelte Element, bis seine Markierung direkt unter dem ersten Zeichen des
Textes darüber sitzt, und zählen Sie in einer Proportionalschrift die Zeichen, die vor dem Inhalt des
Elements erscheinen (geprüft auf docs.github.com, 9. September 2026).

Die Breite der Markierung ist also die Breite der Markierung, wie sie geschrieben steht, und jeder Teil davon zählt:

| Markierung des Elternelements | Breite der Markierung | Leerzeichen danach | Inhaltsspalte | Kind einrücken auf |
| :--- | :--- | :--- | :--- | :--- |
| `- ` | 1 | 1 | 2 | 2 Leerzeichen |
| `* ` | 1 | 1 | 2 | 2 Leerzeichen |
| `-   ` | 1 | 3 | 4 | 4 Leerzeichen |
| `1. ` | 2 | 1 | 3 | 3 Leerzeichen |
| `1) ` | 2 | 1 | 3 | 3 Leerzeichen |
| `10. ` | 3 | 1 | 4 | 4 Leerzeichen |
| `100. ` | 4 | 1 | 5 | 5 Leerzeichen |

Die Zeile, die Leute erwischt, ist `10. `. Eine Liste, die für neun Elemente korrekt verschachtelte, hört
beim zehnten auf, korrekt zu verschachteln, weil die Markierung um ein Zeichen gewachsen ist und die
Inhaltsspalte mit ihr gewandert ist. Niemand sucht danach, denn die Datei, die kaputtgegangen ist, ist die
Datei, die gestern mit einem Element weniger funktionierte.

### Zwei Leerzeichen unter einem Listenpunkt, und was die anderen Einrückungen erzeugen

Nehmen Sie ein Elternelement mit einem Punktzeichen, Inhaltsspalte 2. Richtig:

```markdown
- Elternelement
  - Verschachtelt, weil zwei Leerzeichen die Inhaltsspalte erreichen
```

Ein Leerzeichen zu kurz, und das Kind ist überhaupt kein Kind — es ist ein weiteres Element derselben
Liste, denn eine Listenmarkierung darf bis zu drei Leerzeichen eigene Einrückung haben:

```markdown
- Elternelement
 - Ein Leerzeichen: ein Geschwister, bündig mit dem Elternelement dargestellt
```

Vier Spalten hinter der Inhaltsspalte, mit einer Leerzeile darüber, und der Parser liest einen eingerückten
Codeblock innerhalb des Elternelements:

```markdown
- Elternelement

      - Sechs Leerzeichen: das ist jetzt Code
```

was als `<li><p>Elternelement</p><pre><code>- Sechs Leerzeichen: das ist jetzt Code</code></pre></li>`
dargestellt wird — ein grauer Kasten unter dem Punkt, Bindestrich und alles. Nehmen Sie die Leerzeile weg,
und dieselben sechs Leerzeichen erzeugen wieder etwas anderes: ohne Leerzeile ist der zu weit eingerückte
Text Absatzfortsetzung, er schließt sich also dem eigenen Absatz des Elternelements an, und die Markierung
wird als wörtlicher Bindestrich mitten im Satz gedruckt.

### Drei Leerzeichen unter einem nummerierten Element

Ein nummeriertes Elternelement verschiebt die Spalte um eins, und die Zwei-Leerzeichen-Angewohnheit
scheitert auf eine Weise, die wie ein Fehler des Konverters aussieht:

```markdown
1. Elternelement
  - Zwei Leerzeichen: nicht verschachtelt, und nicht einmal in der Liste
```

Zwei Leerzeichen liegen vor der Inhaltsspalte bei 3, das Kind ist also nicht Teil des Elements; und weil
seine Markierung ein Punktzeichen und keine Zahl ist, kann es auch kein Geschwister sein. Die nummerierte
Liste schließt, und eine neue Punktliste öffnet daneben. Die dargestellte Seite zeigt ein `<ol>` mit einem
Element, gefolgt von einem `<ul>` mit einem Element — was in den meisten Stylesheets wie eine
verschachtelte Liste aussieht, die ihre Einrückung verloren hat.

Drei Leerzeichen sind die Lösung:

```markdown
1. Elternelement
   - Drei Leerzeichen: verschachtelt, wie beabsichtigt
```

| Einrückung unter einem `- `-Elternelement | Einrückung unter einem `1. `-Elternelement | Was der Parser daraus macht |
| :--- | :--- | :--- |
| 0–1 Leerzeichen | 0–2 Leerzeichen | Nicht Teil des Elements: ein Geschwister, wenn der Markierungstyp passt, eine ganz neue Liste, wenn nicht |
| 2–5 Leerzeichen | 3–6 Leerzeichen | Eine verschachtelte Liste — die Inhaltsspalte plus bis zu drei Leerzeichen Spielraum |
| 6+ Leerzeichen nach einer Leerzeile | 7+ Leerzeichen nach einer Leerzeile | Ein eingerückter Codeblock innerhalb des Elternelements |
| 6+ Leerzeichen ohne Leerzeile | 7+ Leerzeichen ohne Leerzeile | Absatzfortsetzung: die Markierung wird als Text gedruckt |

Der Spielraum in der mittleren Zeile ist der Grund, warum vier Leerzeichen meistens funktionieren und
trotzdem die falsche Angewohnheit sind. Vier liegt heute für beide Markierungen im Bereich. Es hört auf,
im Bereich zu liegen, sobald eine Markierung breiter wird, und es verbirgt die Arithmetik vor dem, der die
Datei als Nächster bearbeitet.

### Was in ein Listenelement hineinpasst

Alles, was Sie auf oberster Ebene schreiben können, kann in ein Listenelement, solange es in der
Inhaltsspalte des Elements beginnt. Das ist die ganze Ausdehnung der Regel, und sie deckt vier Dinge ab,
nach denen Leute getrennt fragen:

- **Ein zweiter Absatz.** Leerzeile, dann der Absatz, eingerückt auf die Inhaltsspalte. Unter `- Element`
  sind das zwei Leerzeichen. Rücken Sie ihn stattdessen um ein Leerzeichen ein, und er fällt ganz aus der
  Liste: die Liste schließt, und der Text wird ein eigener Absatz, der unter einer Liste sitzt, in der er
  stehen sollte.
- **Ein Codeblock.** Ein Zaun, der in der Inhaltsspalte beginnt, gehört zum Element; vier Spalten dahinter
  hört der Zaun auf, ein Zaun zu sein, und wird zu wörtlichen Backticks in einem eingerückten Codeblock.
  Dieser Fall hat [seine eigene Arithmetik und seine eigenen ausgearbeiteten Beispiele](/blog/code-blocks-in-markdown),
  einschließlich dessen, was passiert, wenn die Liste Element zehn überschreitet.
- **Ein Blockzitat.** Ein `> ` in der Inhaltsspalte, auf jeder Zeile des Zitats, Leerzeilen eingeschlossen.
  Lassen Sie die Markierung auf einer Zeile weg, und das Zitat endet dort.
- **Eine weitere Liste.** Was die Verschachtelungsregel von oben ist, noch einmal von der neuen
  Inhaltsspalte aus angewandt.

Zwei Folgen ergeben sich daraus, es so zu schreiben. Ein Listenelement ist ein Blockbehälter und keine
Textzeile, alles daran — Abstand, Code, Zitate — ist also eine Frage nach Spalten und keine Frage nach
Listen. Und je tiefer Sie verschachteln, desto mehr Spalten zählen Sie, was das praktische Argument gegen
drei Verschachtelungsebenen in einem Dokument ist, das andere Menschen bearbeiten werden.

## Dichte Listen, locker gesetzte Listen und die Leerzeile, die zwischen ihnen umschaltet

Dann ist da der Abstand, der aus dem Nichts erscheint. Eine Liste ist dicht, wenn ihre Elemente aneinander liegen und ihr Text direkt in jedes `<li>` geht. Setzen Sie eine Leerzeile zwischen zwei Elemente, oder geben Sie einem Element zwei Absätze, und die ganze Liste wird locker: jedes Element, auch die, die Sie nicht angefasst haben, bekommt seinen Text in einen Absatz gepackt, was im Browser als zusätzlicher senkrechter Abstand erscheint. Eine leere Zeile hat den Typ der Liste geändert.

Die Spezifikation nennt Bedingung und Folge an einer Stelle: eine Liste ist locker gesetzt, wenn
irgendwelche ihrer Elemente durch Leerzeilen getrennt sind, oder wenn irgendein Element unmittelbar zwei
Elemente auf Blockebene mit einer Leerzeile dazwischen enthält; sonst ist sie dicht. Der Unterschied im
HTML ist, dass Absätze in einer locker gesetzten Liste in `<p>`-Tags gepackt werden und Absätze in einer
dichten Liste nicht (geprüft auf spec.commonmark.org, 9. September 2026).

Das ist der ganze Mechanismus. Hier ist das Paar, nebeneinander. Dicht:

```markdown
- a
- b
- c
```

```html
<ul>
<li>a</li>
<li>b</li>
<li>c</li>
</ul>
```

Locker gesetzt, durch eine einzige Leerzeile vor dem letzten Element:

```markdown
- a
- b

- c
```

```html
<ul>
<li><p>a</p></li>
<li><p>b</p></li>
<li><p>c</p></li>
</ul>
```

Drei Dinge an dieser Ausgabe sind es wert, klar gesagt zu werden, denn jedes davon ist eine Supportfrage,
die jemand gestellt hat.

**Die Änderung betrifft die Liste, nicht das Element.** Die Elemente `a` und `b` wurden nicht angefasst
und haben beide ein `<p>` bekommen. Locker gesetzt zu sein ist eine Eigenschaft der Liste als Ganzes, eine
Leerzeile irgendwo darin stellt also jedes Element neu dar.

**Der Abstand kommt von Ihrem Stylesheet, nicht von Markdown.** Ein `<p>` innerhalb eines `<li>` nimmt
den oberen und unteren Rand mit, den die Seite Absätzen gibt. Deshalb sieht dieselbe Datei auf GitHub gut
aus und auf einer Dokumentationsseite luftig, oder umgekehrt: die Menge des zusätzlichen Abstands ist eine
CSS-Entscheidung, die das Markdown lediglich ausgelöst hat.

**Eine verschachtelte Liste nach einer Leerzeile macht auch die äußere Liste locker.** Das ist die Regel,
die Menschen erwischt, die nichts falsch gemacht haben:

```markdown
- a

  - ein verschachteltes Element
- b
```

Das erste Element enthält jetzt unmittelbar einen Absatz und eine Liste mit einer Leerzeile dazwischen,
die ganze äußere Liste ist also locker gesetzt, und Element `b` bekommt ein `<p>`, um das es nicht gebeten
hat. Entfernen Sie die Leerzeile, und die Liste wird wieder dicht.

Nichts davon ist ein Defekt, den man beheben muss. Locker gesetzte Listen sind die richtige Form, wenn die
Elemente Sätze sind oder mehrere Blöcke enthalten; dichte Listen sind richtig für kurze Bezeichnungen.
Ärger macht, beides in einem Dokument versehentlich zu tun, sodass manche Listen atmen und andere nicht,
aus Gründen, die niemand in der Quelle sehen kann. Entscheiden Sie pro Liste, absichtlich, und halten Sie
die Leerzeilen innerhalb jeder einzelnen einheitlich.

## Checkboxen und Aufgabenlisten

Eine Checkbox ist ein Listenelement, dessen Text mit Klammern beginnt:

- [x] Markierung, Leerzeichen, Klammern, Leerzeichen, dann der Text
- [ ] Die Klammern kommen zuerst — steht Text davor, ist es ein gewöhnliches Element
- [ ] `x` oder `X` setzt das Häkchen, ein einzelnes Leerzeichen lässt sie leer, und dieses Leerzeichen ist Pflicht

Eine Aufgabenliste ist eine Erweiterung von GitHub Flavored Markdown und nicht reines CommonMark, ein streng konformer CommonMark-Konverter gibt Ihnen also wörtliche eckige Klammern. TransformPipe spricht GFM, Aufgabenlisten, Tabellen, Durchgestrichenes und Autolinks kommen also als sie selbst durch. Die Checkbox in der Ausgabe ist ein Bild des Zustands in Ihrer Datei und kein Bedienelement: GFM stellt sie als deaktiviertes Eingabefeld dar, es gibt also nichts zu klicken.

Die GFM-Spezifikation ist genau darin, was zählt. Ein Aufgabenlistenelement ist ein Listenelement, dessen
erster Block ein Absatz ist, der mit einer Aufgabenlisten-Markierung beginnt, gefolgt von mindestens einem
Leerraumzeichen vor jedem anderen Inhalt, und die Markierung selbst ist eine linke Klammer, dann entweder
ein Leerraumzeichen oder der Buchstabe `x` in beliebiger Schreibweise, dann eine rechte Klammer.
Dargestellt wird die Markierung durch ein Checkbox-Element ersetzt, mit Häkchen, wenn das Zeichen zwischen
den Klammern etwas anderes als Leerraum ist (geprüft auf github.github.com, 9. September 2026).

Gegen eine echte Datei gelesen ergibt das vier Regeln und eine Überraschung:

| Was Sie schreiben | Was Sie bekommen | Warum |
| :--- | :--- | :--- |
| `- [ ] Aufgabe` | Eine Checkbox ohne Häkchen | Leerraum zwischen den Klammern |
| `- [x] Aufgabe` oder `- [X] Aufgabe` | Eine Checkbox mit Häkchen | Beide Schreibweisen von `x` setzen das Häkchen |
| `- []Aufgabe` | Ein einfaches Listenelement, Klammern sichtbar | Kein Leerraum darin, und keiner danach |
| `- Aufgabe [ ] später` | Ein einfaches Listenelement, Klammern sichtbar | Die Markierung muss den ersten Absatz des Elements beginnen |
| `- [ ] Eltern` mit einem eingerückten `- [ ] Kind` | Verschachtelte Checkboxen | Aufgabenlisten verschachteln wie jede andere Liste |

Die Überraschung ist die Ausgabe selbst. Die Referenzdarstellung ist `<input disabled="" type="checkbox">`
— ein Eingabeelement, schon deaktiviert, das innerhalb des `<li>` sitzt. GitHub legt darüber innerhalb von
Issues und Pull Requests sein eigenes Verhalten, wo die Kästchen aus- und abgewählt werden können, während
die Arbeit erledigt wird (geprüft auf docs.github.com, 9. September 2026); ein konvertiertes
HTML-Dokument hat nichts, worin es einen Klick festhalten könnte, die Checkbox ist also ein statisches Bild des Zustands in der Quelle. Wenn Sie eine Checkbox brauchen, die jemand anhaken kann und die
sich das merkt, brauchen Sie eine Anwendung und kein Dokument.

Die Art zu scheitern mit einem Konverter, der GFM nicht spricht, ist leiser, als es klingt. Sie bekommen
keinen Fehler; Sie bekommen `<li>[ ] Aufgabe</li>`, was eine Liste von Elementen ist, die mit zwei eckigen
Klammern beginnen. Auf einer Seite mit ordentlicher Gestaltung liest sich das als Formatierungsfehler und
nicht als fehlende Funktion, weshalb „meine Checkboxen funktionieren nicht mehr" meist ein Dialektproblem
ist — dasselbe, das dahintersteckt, wenn Tabellen und Durchgestrichenes zur gleichen Zeit verschwinden.

## Ein Zeichen maskieren, das etwas bedeutet

Das Maskierungszeichen ist der Backslash. In CommonMark wirkt er vor jedem ASCII-Satzzeichen und nirgends sonst, ein Backslash vor einem Buchstaben bleibt also als Backslash auf der Seite.

```markdown
1986\. Die Jahreszahl, nicht das erste Element einer Liste.
Die Form ist ein \*Stern\*, und ich meine die Sternchen.
Ein wörtlicher Backslash wird \\ geschrieben.
```

Das Datum ist der klassische Fall: eine Zeile, die mit einer Zahl, einem Punkt und einem Leerzeichen beginnt, ist eine nummerierte Liste, ein Absatz, der mit einer Jahreszahl beginnt, wird also lautlos zu Element eins. Überschriften (`#`), Blockzitate (`>`) und Listenpunkte (`-`) tun am Zeilenanfang dasselbe, und Pipes müssen innerhalb einer Tabelle maskiert werden.

Zwei Dinge, die Ihnen Backslashes sparen. Unterstriche innerhalb eines Wortes werden in Ruhe gelassen, `snake_case_name` übersteht es also unversehrt; Sternchen nicht, `a*b*c` betont also weiterhin. Und ein Backslash bewirkt innerhalb einer Code-Spanne nichts, was für einen Dateinamen, ein Flag oder ein Glob-Muster ohnehin die bessere Antwort ist — der Fall, mit dem [die vollständige Referenz zum Maskieren](/blog/markdown-escaping) beginnt, die weiter durch die Zeichenreferenzen führt, die ein Backslash nicht ersetzen kann, und durch die Fälle mit Vorlagen, Windows-Pfaden und `__init__`, die die meisten Beschwerden erzeugen.

### Jedes Zeichen, das eines braucht, und wo

Die Menge ist fest. CommonMark erlaubt einen Backslash vor jedem ASCII-Satzzeichen und nirgends sonst, und
das sind diese zweiunddreißig: ``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`` (geprüft auf
spec.commonmark.org, 9. September 2026). Ein Backslash vor einem Buchstaben, einer Ziffer oder einem
Leerzeichen ist ein wörtlicher Backslash, gedruckt.

Die meisten dieser zweiunddreißig tun nie etwas und brauchen nie eine Maskierung. Dies sind die, die es tun:

| Zeichen | Was es unmaskiert bedeutet | Wo es zubeißt | Stattdessen schreiben |
| :--- | :--- | :--- | :--- |
| `\` | Das Maskierungszeichen selbst | Überall im Text | `\\` |
| `` ` `` | Öffnet eine Code-Spanne | Überall inline | ``\` ``, oder den Text in einen längeren Lauf von Backticks packen |
| `*` | Betonung, und ein Listenpunkt | Überall inline, auch im Wort; am Zeilenanfang | `\*` |
| `_` | Betonung | Nur an einer Wortgrenze — Unterstriche im Wort sind sicher | `\_` |
| `#` | Eine ATX-Überschrift | Nur am Zeilenanfang | `\#` |
| `>` | Ein Blockzitat | Nur am Zeilenanfang | `\>` |
| `-` | Ein Listenpunkt, eine Setext-Unterstreichung, eine Trennlinie | Nur am Zeilenanfang | `\-` |
| `+` | Ein Listenpunkt | Nur am Zeilenanfang | `\+` |
| `.` | Eine Markierung für nummerierte Listen, nach Ziffern | Nur am Zeilenanfang | `1986\.` |
| `)` | Eine Markierung für nummerierte Listen, nach Ziffern | Nur am Zeilenanfang | `1986\)` |
| `[` `]` | Ein Link, ein Bild, eine Fußnote, eine Aufgaben-Markierung | Überall inline | `\[` `\]` |
| `!` | Ein Bild, wenn `[` folgt | Überall inline | `\!` |
| `<` | Rohes HTML, oder ein Autolink | Überall inline | `\<`, oder die Entität `&lt;` |
| `&` | Der Anfang einer Zeichenreferenz | Überall inline | `&amp;` |
| Eine Pipe | Eine Zellengrenze in einer GFM-Tabelle | Nur innerhalb einer Tabellenzeile | Ein Backslash davor, auch innerhalb einer Code-Spanne |
| `~` | Durchgestrichenes, in GFM | Überall inline, paarweise | `\~` |
| `=` | Eine Setext-Überschriftenunterstreichung, die die Zeile darüber zu einem `<h1>` macht | Am Zeilenanfang, direkt unter einem Absatz | `\=` |

Die Spalte, die die meiste Arbeit spart, ist die dritte. `#`, `>`, `-`, `+`, `.` und `)` tragen ihre
Bedeutung nur am Zeilenanfang, ein Doppelkreuz mitten im Satz ist also ein Doppelkreuz und braucht nichts.
Sie überall zu maskieren ist eine Angewohnheit, die man von Werkzeugen übernimmt, die vorsorglich
maskieren, und sie hinterlässt Backslashes über die ganze Prosa verteilt, die ein Leser irgendwann sehen
wird, denn ein Backslash vor einem Zeichen, das nichts bedeutete, verschwindet trotzdem aus der Ausgabe
und bleibt in der Datei, damit sich der Nächste darüber wundern kann.

### Wo ein Backslash überhaupt nichts bewirkt

Maskierungen funktionieren nicht innerhalb von Code-Spannen, Codeblöcken, Autolinks oder rohem HTML
(geprüft auf spec.commonmark.org, 9. September 2026). Innerhalb von Backticks ist `\*` ein Backslash und
ein Sternchen, beide gedruckt — was genau das ist, was Sie für ein Glob-Muster oder einen Windows-Pfad
wollen, und genau das, was diejenigen überrascht, die zuerst maskiert und die Backticks danach hinzugefügt haben.

Sie funktionieren an drei Stellen, an denen Sie es nicht erwarten würden: in Linkzielen, in Linktiteln und
im Info-String nach einem Zaun. Eine Klammer innerhalb einer URL kann maskiert statt prozentkodiert
werden, und ein Titel, der ein Anführungszeichen enthält, kann es tragen.

### Die Maskierungen, die ein Konverter für Sie schreibt

In die andere Richtung — HTML, eine `.docx` oder eine Tabelle nach Markdown — ist jedes dieser Zeichen das
Problem des Konverters und nicht Ihres, und es ist eine vernünftige Art, einen zu beurteilen. Ein
Word-Absatz, der mit „1986. Die Jahreszahl" beginnt, muss als `1986\. Die Jahreszahl` ankommen, oder das
Dokument bekommt eine Liste, die niemand geschrieben hat. Eine Überschrift, deren Text ein `#` enthält,
ein Satz mit einem Unterstrich oder einem Sternchen, eine Tabellenzelle mit einer Pipe: jedes braucht
während der Konvertierung einen eingefügten Backslash, und ein Konverter, der das überspringt, erzeugt
eine Markdown-Datei, die als etwas anderes dargestellt wird als das Dokument, aus dem sie kam. Es lohnt
sich, das mit einem absichtlich sperrigen Absatz zu testen, bevor man einem Konverter hundert Seiten anvertraut.

In der anderen Richtung ist das Maskieren das Problem des Browsers, und der Konverter erledigt es
stillschweigend: `<` und `&` in Ihrem Text kommen im HTML als `&lt;` und `&amp;` an, weshalb ein
wörtliches `<div>`, in Prosa geschrieben, als Text auf der Seite erscheint, statt im Markup zu verschwinden.

## Der ehrliche Teil: die Syntax, die Ihre Werkzeugkette löscht

Alles oben setzt voraus, dass die Datei, die Sie gespeichert haben, die Datei ist, die der Konverter
liest. Für den harten Zeilenumbruch aus zwei Leerzeichen ist diese Annahme meist falsch, und sie ist auf
eine Weise falsch, die niemand sehen kann.

Leerraum am Zeilenende ist das eine, was jeder Teil einer modernen Werkzeugkette zu entfernen konfiguriert
ist. Es ist eine Standard-EditorConfig-Eigenschaft: `trim_trailing_whitespace` auf `true` gesetzt entfernt
Leerraumzeichen vor dem Zeilenumbruch, und es wird über Editoren hinweg unterstützt (geprüft auf
editorconfig.org, 9. September 2026). Ein Repository mit einer `.editorconfig`, die das für `[*]` setzt,
löscht Ihre Zeilenumbrüche beim nächsten Speichern, in jeder Datei, für alle. Nichts warnt Sie, denn aus
Sicht des Editors hat er nichts von Wert entfernt, und [der Editor, in dem Sie schreiben](/blog/best-markdown-editors),
ist meist derjenige, der es durchsetzt — eine Einstellung, die jemand vor Jahren für eine Sprache
eingeschaltet hat, in der Leerraum am Zeilenende wirklich Rauschen ist.

Der Linter stimmt dem Editor zu und widerspricht der Spezifikation. markdownlints MD009, mit dem Alias
`no-trailing-spaces`, markiert Zeilen, die auf unerwarteten Leerraum enden, mit einem Parameter
`br_spaces`, der eine Ausnahme für eine bestimmte Anzahl von Leerzeichen am Zeilenende erlaubt, die als
ausdrücklicher Umbruch dienen; sein Standardwert ist `2` (geprüft auf github.com, 9. September 2026). Ein
Umbruch aus zwei Leerzeichen geht also durch, und einer aus drei wird markiert — obwohl beide identisch
dargestellt werden, weil die Regel „zwei oder mehr" lautet. Die Syntax ist bei jeder Breite über eins
erlaubt und bei genau einer Breite lint-rein.

Nehmen Sie die letzten zwei Tatsachen hinzu, und das Bild ist vollständig. Eine Code-Review zeigt nichts:
Leerzeichen am Zeilenende erscheinen in einem Diff nicht als Inhalt, der Commit, der Ihre Zeilenumbrüche
entfernt hat, sieht also wie der Commit aus, der eine Einrückung behoben hat. Und der Mensch, der es
herausfindet, ist der Leser, Wochen später, der auf eine Adresse blickt, die in eine Zeile gelaufen ist.

Das ist das scharfe Ende des ganzen Themas. Der dokumentierte, ursprüngliche, überall unterstützte Weg,
eine Zeile zu brechen, ist eine Folge unsichtbarer Zeichen, die die Werkzeuge um Ihre Datei herum zu
löschen konfiguriert sind, die Ihr Linter bei genau einer Breite erlaubt und deren Verschwinden in der
Review unsichtbar ist. Es ist kein Defekt von Markdown und kein Defekt der Werkzeuge; es sind zwei
vernünftige Positionen, die sich in einer Datei treffen.

## Fazit: die Regeln, die eine Rundreise überstehen

Zehn Regeln decken jedes Scheitern auf dieser Seite ab, und sie sind darunter alle dieselbe Regel: legen
Sie die Bedeutung in das Dokument und nicht in das Werkzeug, das es darstellt.

1. **Schreiben Sie harte Zeilenumbrüche als Backslash, nicht als zwei Leerzeichen.** Ein Leerraum-Trimm
   kann ihn nicht löschen, ein Diff zeigt ihn, und wenn Sie ihn an eine nutzlose Stelle setzen, druckt er
   sich selbst, statt lautlos zu scheitern.
2. **Nehmen Sie ein wörtliches `<br>`, wenn der Konverter nicht Ihrer ist.** Das Einzige, was es entfernen
   kann, ist die Positivliste eines Bereinigers, und das ist eine kürzere Liste von Möglichkeiten als die
   Zeilenumbruch-Option jedes Renderers.
3. **Greifen Sie vor beidem zu einer Leerzeile.** Ein neuer Absatz ist ein Block, den ein Stylesheet mit
   Abstand versehen kann, und ein `<br>` ist es nicht — die meisten Umbrüche, um die Leute kämpfen, hätten
   also Absätze sein sollen.
4. **Lassen Sie über jeder Liste eine Leerzeile.** Sie kostet eine Zeile und entfernt jeden Unterschied
   zwischen Dialekten beim Unterbrechen eines Absatzes, einschließlich der Regel, dass eine nummerierte
   Liste bei 1 beginnen muss.
5. **Zählen Sie die Markierung statt der Angewohnheit: zwei unter `- `, drei unter `1. `, vier ab Element
   zehn.** Vier Leerzeichen funktionieren, bis eine Markierung breiter wird, und die Liste, die
   kaputtgeht, ist die, die Sie nicht bearbeitet haben.
6. **Entscheiden Sie dicht oder locker pro Liste, und halten Sie die Leerzeilen darin einheitlich.** Sonst
   ändert sich der Abstand in Ihrem Dokument aus Gründen, die in der Quelle unsichtbar und in der Review
   niemandem zuzuordnen sind.
7. **Behalten Sie ein Punktzeichen und einen Trenner für nummerierte Listen pro Dokument.** Ein einzelnes
   verirrtes `+` oder `1)` teilt eine Liste lautlos in zwei, und zwei benachbarte Listen sehen fast
   genauso aus wie eine.
8. **Maskieren Sie ein Zeichen nur dort, wo es Bedeutung trägt.** `#`, `>`, `-` und `.` bedeuten am
   Zeilenanfang etwas und nirgends sonst, überall zu maskieren hinterlässt also Backslashes in Prosa, die
   irgendwann jemand in der Quelle lesen wird.
9. **Behandeln Sie die Option `breaks` eines Renderers als Eigenschaft Ihrer Anwendung, nie als
   Eigenschaft Ihrer Dokumente.** An dem Tag, an dem der Text exportiert, eingecheckt oder woandershin
   eingefügt wird, ist jeder Umbruch verschwunden, auf den er sich verlassen hat.
10. **Lesen Sie das HTML, nicht die Vorschau.** Ein `<p>`, wo Sie ein `<br>` erwartet haben, ein `<pre>`,
    wo Sie ein verschachteltes Element erwartet haben, ein zweites `<ul>`, wo Sie eine Liste erwartet
    haben: die Ausgabe nennt die Regel, die gefeuert hat.

Nichts davon braucht ein Werkzeug zur Durchsetzung. Es braucht eine Quelldatei, die sagt, was Sie gemeint
haben, damit die Datei es noch meint, nachdem ein Formatierer, ein Prüfer und der Konverter von jemand
anderem alle an der Reihe waren. Wenn ein Dokument weiterhin falsch dargestellt wird und Sie nicht sehen
können, warum, konvertieren Sie es und lesen Sie das HTML neben der Vorschau —
[TransformPipe tut das im Browser](/), mit der Quelle und der Ausgabe nebeneinander — denn die Tags
beantworten die Frage, die die Quelle nicht beantworten kann: ein `<p>` heißt, der Umbruch ist nie
passiert, ein `<pre>` heißt, Sie haben zu weit eingerückt, und eine Liste, die Absätze bekommen hat,
heißt, irgendwo, wo Sie nicht hingesehen haben, hat sich eine Leerzeile eingeschlichen. Jedes Symptom auf
dieser Seite löst sich in eines dieser drei auf, und jedes davon ist eine Regel, die genau das tut, was
sie sagt.

## FAQ

### Wie mache ich in Markdown einen Zeilenumbruch?

Beenden Sie die Zeile mit zwei Leerzeichen oder einem Backslash, und der Umbruch passiert innerhalb
desselben Absatzes, als `<br>`. Lassen Sie stattdessen eine Leerzeile, und Sie bekommen einen neuen
Absatz, was für Prosa das ist, was Sie wollen. Der Backslash ist der bessere der beiden harten
Zeilenumbrüche, denn Leerzeichen am Zeilenende sind unsichtbar und die meisten Werkzeugketten löschen sie.

### Warum funktioniert mein Zeilenumbruch auf GitHub nicht?

Weil eine `.md`-Datei und ein Kommentarfeld zwei verschiedene Renderer sind. GitHubs Anleitung sagt, ein
Kommentarfeld stellt den Umbruch für Sie dar, während ein Umbruch in einer `.md`-Datei zwei Leerzeichen am
Zeilenende, einen Backslash oder ein `<br/>` braucht (geprüft auf docs.github.com, 9. September 2026).
Text, der in einem Kommentar entworfen und in eine Datei eingefügt wird, fällt genau aus diesem Grund zusammen.

### Um wie viele Leerzeichen rücke ich eine verschachtelte Markdown-Liste ein?

Zwei unter `- `, drei unter `1. `, und vier, sobald die Nummerierung `10. ` erreicht — die Breite der
Markierung plus die Leerzeichen danach. Zu wenige, und das Element wird ein Geschwister statt eines
Kindes; vier oder mehr Spalten hinter diesem Punkt, und es wird ein Codeblock oder schließt sich dem
Absatz des Elternelements an.

### Warum hat meine Liste plötzlich zusätzlichen Abstand zwischen den Elementen?

Eine Leerzeile irgendwo darin hat die ganze Liste locker gemacht, der Text jedes Elements ist jetzt also
in ein `<p>` gepackt und nimmt die Absatzränder Ihres Stylesheets mit. Die Leerzeile muss nicht zwischen
zwei Elementen stehen — eine vor einer verschachtelten Liste hat dieselbe Wirkung. Entfernen Sie sie, und
die Liste wird wieder dicht.

### Warum nummerieren sich meine Listenzahlen selbst neu?

Nur die erste Markierung wird gelesen; die Zahlen an den folgenden Elementen werden verworfen, und der
Browser zählt von der Startzahl. Deshalb wird `1. 7. 3.` als 1, 2, 3 dargestellt, und deshalb ist es ein
legitimer Stil und kein Fehler, jedes Element als `1.` zu schreiben.

### Warum wird meine Checkbox als `[ ]` dargestellt?

Aufgabenlisten sind eine Erweiterung von GitHub Flavored Markdown und nicht Teil von CommonMark, ein
streng konformer CommonMark-Konverter stellt die Klammern also als gewöhnlichen Text dar. Sie brauchen
einen Konverter, der GFM spricht — denselben, den Sie für Tabellen, Durchgestrichenes und Autolinks
brauchen, weshalb sie meist zusammen kaputtgehen.

### Wie verhindere ich, dass eine Jahreszahl am Zeilenanfang zu einer Liste wird?

Maskieren Sie den Punkt: `1986\. Die Jahreszahl`. Eine Ziffer, gefolgt von `.` oder `)` und einem
Leerzeichen, ist am Zeilenanfang eine gültige Markierung für eine nummerierte Liste, der Absatz wird also
Element eins einer Liste, die bei 1986 beginnt. Der Backslash ist in der Ausgabe unsichtbar und kostet nichts.
