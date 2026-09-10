---
title: "Markdown-Tabellen, die eine Konvertierung überstehen: jede Art, wie eine bricht"
description: "Warum eine Markdown-Tabelle nicht erscheint: Trennzeile, Ausrichtungs-Doppelpunkte, Leerzeilen, maskierte Pipes und GFM gegen CommonMark, mit einer Symptomtabelle"
date: 2026-08-29
tag: Syntax
keywords: markdown tabelle, markdown tabellen syntax, markdown tabelle zu html, markdown tabelle ausrichtung, markdown tabelle erscheint nicht, markdown tabelle zeilenumbruch, breite markdown tabelle
---

### Kurzfassung

Eine Markdown-Tabelle ist eine Kopfzeile, eine Trennzeile aus Bindestrichen und beliebig viele Datenzeilen — und die Trennzeile ist der ganze Trick. Entfernen Sie sie, oder lassen Sie ihre Zellenzahl von der Kopfzeile abweichen, und es gibt überhaupt keine Tabelle: Sie bekommen einen Absatz voller senkrechter Striche, lautlos. Tabellen sind außerdem nicht Teil von CommonMark; sie kamen mit GitHub Flavored Markdown, ein streng konformer Parser verhält sich also korrekt, wenn er Ihre ablehnt. Lassen Sie über und unter dem Block eine Leerzeile, maskieren Sie jede wörtliche Pipe als `\|`, und greifen Sie nach `<br>`, wenn eine Zelle eine zweite Zeile braucht — denn eine Zeile endet dort, wo die Zeile endet.

Eine Tabelle ist der Teil eines Dokuments, der am ehesten kaputt ankommt. Überschriften kann man kaum falsch machen. Ein fettes Wort hat seine Sternchen oder hat sie nicht. Eine Tabelle ist ein Gitter, das von Zeichensetzung zusammengehalten wird, und ein falsches Zeichen irgendwo im Block erzeugt keine leicht falsche Tabelle — es erzeugt keine Tabelle, denn der Parser erkennt die Form nicht mehr und behandelt das Ganze als Prosa.

Diese Art des Scheiterns ist es, was Tabellen so ärgerlich macht. Es gibt keinen Fehler, keine Warnung, kein halb dargestelltes Gitter. Sie bekommen fünf Textzeilen mit Pipe-Zeichen darin, dort, wo Ihre Tabelle war, und nichts in der Ausgabe sagt Ihnen, welche der fünf Zeilen das Problem war. Die Datei sieht in Ihrem Editor weiterhin gut aus, denn Ihr Editor zeigt Ihnen die Quelle.

Die gute Nachricht ist, dass die Fehlfälle endlich sind. Fast jede kaputte Markdown-Tabelle hat eine von etwa zehn Ursachen, jede mit einem erkennbaren Symptom. Diese Seite geht sie alle durch: was die Syntax ist, wofür jeder Teil eigentlich da ist, was passiert, wenn er falsch ist, und was die Abhilfe kostet. Wenn Sie gerade eine kaputte Tabelle vor sich haben, beginnen Sie mit der Symptomtabelle zwei Abschnitte weiter unten.

## Was eine Markdown-Tabelle wirklich ist

Drei Teile, in dieser Reihenfolge, auf aufeinanderfolgenden Zeilen:

```markdown
| Flag | Lange Form | Nimmt einen Wert |
| --- | --- | --- |
| `-o` | `--output` | ja |
| `-q` | `--quiet` | nein |
```

Die erste Zeile ist die Kopfzeile. Die zweite ist die Trennzeile — manchmal Trennzeile oder Delimiter-Zeile genannt — und sie ist es, die aus diesem Block eine Tabelle statt eines Absatzes macht. Der Rest sind Datenzeilen. Der Block endet an der ersten Leerzeile oder an der ersten Zeile, die ein anderes Konstrukt auf Blockebene beginnt, etwa eine Überschrift oder einen Zaun.

Nach HTML konvertiert wird daraus etwa das:

```html
<table>
<thead>
<tr><th>Flag</th><th>Lange Form</th><th>Nimmt einen Wert</th></tr>
</thead>
<tbody>
<tr><td><code>-o</code></td><td><code>--output</code></td><td>ja</td></tr>
<tr><td><code>-q</code></td><td><code>--quiet</code></td><td>nein</td></tr>
</tbody>
</table>
```

Zwei Dinge folgen aus dieser Ausgabe, und beide erklären viel späteren Ärger. Erstens gibt es immer genau eine Kopfzeile, in `<thead>` eingepackt. Markdown hat keine Syntax für eine Tabelle ohne Kopfzeile und keine für zwei Kopfzeilen. Zweitens ist jede Zelle ein `<th>` oder ein `<td>` mit Inline-Inhalt. Es gibt in der Syntax keinen Mechanismus für eine Zelle über zwei Spalten, eine Zelle über zwei Zeilen, eine verschachtelte Tabelle oder eine Zelle mit einem Absatz und einer Liste.

Wissenswert, bevor Sie weiterlesen: der Parser sucht eine Form, er repariert keine. Wenn die ersten zwei Zeilen sich nicht darüber einig sind, wie viele Zellen sie halten, wird der Block nie eine Tabelle, und jede Zeile darin wird als Text ausgegeben. Diese einzelne Regel erklärt mehr kaputte Tabellen als alles andere auf dieser Seite zusammen.

## Markdown-Tabelle erscheint nicht: Symptom zu Ursache

Finden Sie das Symptom, dann lesen Sie den Abschnitt, auf den es zeigt.

| Symptom in der Ausgabe | Fast immer weil | Abhilfe |
| --- | --- | --- |
| Die ganze Tabelle ist ein Absatz aus Pipes | Keine Trennzeile, oder eine Trennzeile mit anderer Zellenzahl als die Kopfzeile | Zählen Sie die Zellen in beiden Zeilen; sie müssen genau übereinstimmen |
| Die ganze Tabelle ist ein Absatz, und die Bindestriche sehen sonderbar aus | Ein Editor hat `---` in einen Geviertstrich verwandelt, oder die Pipes sind vollbreite `｜` aus einer Eingabemethode | Tippen Sie die Trennzeile mit einfachen Bindestrichen und ASCII-Pipes neu |
| Die Kopfzeile klebt am Absatz darüber | Keine Leerzeile zwischen der Prosa und der Tabelle | Eine Leerzeile vor der Tabelle und eine danach |
| Die Tabelle erscheint, aber eine Spalte fehlt | Die Trennzeile hat weniger Zellen, als der Inhalt der Kopfzeile nahelegt | Zählen Sie die Bindestriche, nicht die Überschriften |
| Eine Zeile hat eine in zwei geteilte Zelle, und ihr letzter Wert ist weg | Eine unmaskierte `\|` in einem Zellenwert | Schreiben Sie sie als `\|`, Backticks eingeschlossen |
| Eine Zelle ist leer, obwohl die Quelle deutlich Text hat | Diese Zeile hatte mehr Zellen als die Kopfzeile, die überzähligen wurden verworfen | Zellenzahl angleichen, oder die verirrte Pipe maskieren |
| Die Tabelle erscheint als Codeblock | Der Block ist um vier Leerzeichen oder mehr eingerückt | Auf null reduzieren, oder auf die Inhaltsspalte des Listenelements |
| Die Tabelle erscheint überall außer in einem Werkzeug | Dieses Werkzeug läuft als CommonMark ohne die Tabellen-Erweiterung | Einen GFM-Parser wählen, oder den Rückfall akzeptieren |
| Zwei Sätze in einer Zelle sind zusammengelaufen | Ein `<br>` wurde von einem Bereiniger entfernt, oder war nie da | Prüfen Sie die Positivliste des Bereinigers; es gibt keine andere Art, eine Zeile zu brechen |
| Eine Punktliste in einer Zelle kam als wörtliche Bindestriche heraus | Zellen halten nur Inline-Inhalt | Umbauen: die Tabelle ist die Zusammenfassung, das Detail kommt darunter |
| Die Ausrichtung wird ignoriert | Doppelpunkte auf der falschen Seite der Bindestriche, oder ein Stylesheet überschreibt sie | `:---`, `:---:`, `---:` — Doppelpunkte in der Zelle, an die Bindestriche gedrängt |

Zwei davon verdienen Betonung, weil sie die sind, über die Leute hinwegsehen. Eine falsch gezählte Trennzeile und eine unmaskierte Pipe erzeugen beide eine Ausgabe, die wie ein Formatierungsproblem aussieht und wirklich ein Zählproblem ist.

## Die Kurzübersicht: jeder Teil einer Tabelle, und was er kostet

| Teil | Wofür er da ist | Was er tut | Preis |
| --- | --- | --- | --- |
| Kopfzeile | Die Spalten benennen | Wird `<thead>`, eine Zeile aus `<th>` | Pflicht; es gibt keine Tabelle ohne Kopfzeile |
| Trennzeile | Dem Parser sagen, dass das eine Tabelle ist | Legt die Spaltenzahl für den ganzen Block fest | Eine Zeile, und zweimal Spalten zählen |
| Bindestriche | Die Trennzellen füllen | Ein `-` pro Zelle ist gültig; `---` ist Konvention | Nichts; die Länge ist kosmetisch |
| Ausrichtungs-Doppelpunkte | Eine Spalte links, mittig oder rechts ausrichten | Gibt ein `align`-Attribut oder einen `text-align`-Stil pro Zelle aus | Ein Zeichen pro Spalte, und nur pro Spalte |
| Äußere Pipes | Die Zeile rahmen | Optional in jeder Zeile, außer in einer einspaltigen Tabelle | Zwei Zeichen pro Zeile, und viel bessere Lesbarkeit |
| `\|` | Eine wörtliche Pipe in eine Zelle setzen | Maskiert den Trenner, Code-Spannen eingeschlossen | Ein Backslash, und etwas lautere Quelle |
| `<br>` | Eine Zeile in einer Zelle brechen | Inline-HTML, das GFM durchlässt | Eine Abhängigkeit von dem, was Ihr HTML bereinigt |
| Leerzeile davor und danach | Die Grenzen des Blocks markieren | Hält die Kopfzeile aus dem vorherigen Absatz heraus | Zwei Leerzeilen, im Tausch gegen Portabilität |
| Einrückung | Eine Tabelle in ein Listenelement setzen | Null bis drei Leerzeichen sind gut; vier sind ein Codeblock | Aufmerksamkeit, wann immer die Tabelle verschachtelt ist |
| Zellenzahl der Datenzeile | Das Gitter füllen | Kurze Zeilen werden aufgefüllt, lange abgeschnitten | Stille, wenn sie falsch ist |
| Nur Inline-Inhalt | Zellen parsebar halten | Text, Betonung, Code-Spannen, Links, Bilder | Keine Listen, Absätze, Zäune oder Verschachtelung |
| Scroll-Hülle | Eine schmale Seite überstehen | Ein `<div>`, dem Ihr Stylesheet `overflow-x: auto` gibt | Leerzeilen in der Hülle, und Kontrolle über das CSS |

Alles unten erweitert eine Zeile dieser Tabelle.

## Die Teile, einer nach dem anderen

### Die Trennzeile — die Zeile, die es zur Tabelle macht

Das ist die tragende Zeile. `| --- | --- | --- |` ist keine Verzierung zwischen Kopf und Körper; sie ist die Erklärung, die aus drei Zeilen Pipes ein Gitter macht. Löschen Sie sie, und der Parser hat keinen Grund, irgendeine dieser Zeilen als etwas anderes als einen Absatz zu behandeln — was am anderen Ende genau herauskommt.

| Vorteile | Nachteile |
| --- | --- |
| Eine Zeile ist der ganze Unterschied zwischen Prosa und Tabelle | Ihre Zellenzahl muss genau der Kopfzeile entsprechen |
| Ein einzelner Bindestrich pro Zelle genügt; niemand zählt sie | Nichts warnt Sie, wenn die Zahlen abweichen |
| Sie trägt die Ausrichtung, Formatierung braucht also keine zusätzliche Syntax | Die typografische Autokorrektur eines Editors kann sie unsichtbar zerstören |
| Sie ist das Schnellste, was man prüft, wenn eine Tabelle bricht | Sie muss die zweite Zeile sein — nicht die dritte und nicht nach einem Kommentar |

**Preis:** eine Zeile, und die Angewohnheit, Spalten zweimal zu zählen, bevor man den Renderer beschuldigt.

**Technische Details und Funktionen**

- Jede Trennzelle darf Bindestriche, einen optionalen führenden Doppelpunkt, einen optionalen abschließenden Doppelpunkt und Leerzeichen halten. Nichts sonst. Ein verirrter Buchstabe oder Punkt, und der Block ist ein Absatz.
- Die Zellenzahl der Trennzeile muss der Zellenzahl der Kopfzeile entsprechen. Das ist die eine strenge Regel im ganzen Konstrukt.
- Sobald die beiden übereinstimmen, ist diese Spaltenzahl für jede folgende Datenzeile festgelegt.
- `-`, `--` und `-----------` sind für den Parser identisch. Die Bindestriche an der breitesten Zelle auszurichten ist für den Menschen, der die Datei als nächstes bearbeitet.
- Textprogramme und manche Editoren verwandeln `---` beim Tippen in einen Geviertstrich. Ein Geviertstrich ist ein anderes Zeichen, die Trennzeile hört also auf, eine zu sein.

**Wer sollte sie verwenden?** Alle, bei jeder Tabelle, auf der zweiten Zeile. Wenn eine Tabelle nicht erscheint, sehen Sie hier zuerst nach, und meistens können Sie dort aufhören.

### Ausrichtungs-Doppelpunkte — die einzige Formatierung, die eine Spalte bekommt

Doppelpunkte in der Trennzeile setzen die Ausrichtung der ganzen Spalte, Kopfzeile eingeschlossen:

```markdown
| Links | Mittig | Rechts |
| :--- | :-----: | ----: |
| a | b | 1 |
```

Ein Doppelpunkt links richtet links aus, rechts richtet rechts aus, auf beiden Seiten zentriert, und keiner überlässt es der Voreinstellung des Renderers — die meist links ist, aber die Entscheidung des Stylesheets ist statt die des Dokuments.

| Vorteile | Nachteile |
| --- | --- |
| Kostet ein Zeichen und gilt für jede Zeile der Spalte | Nur spaltenweit: es gibt keine Ausrichtung pro Zelle |
| Rechts ausgerichtete Zahlen lassen ihre Stellen zusammenpassen, und das ist der Punkt | Was ausgegeben wird, unterscheidet sich zwischen Renderern |
| Funktioniert mit einem einzelnen Bindestrich, `:-:` ist also eine gültige zentrierte Zelle | Die Positivliste eines Bereinigers kann das Attribut oder den Stil verwerfen |
| Kopf und Körper stimmen immer überein, denn es ist eine Erklärung | Keine vertikale Ausrichtung, und keine Art, eine ganze Tabelle auszurichten |

**Preis:** ein Zeichen pro Spalte, und eine Abhängigkeit von der Ausgabewahl Ihres Renderers.

**Technische Details und Funktionen**

- Der Doppelpunkt gehört in die Zelle, an die Bindestriche gedrängt. `| :--- |` ist richtig; `| : --- |` und `|:|` sind es nicht.
- Manche Renderer geben `<th align="right">` aus, andere `<th style="text-align:right">`. Beide sehen im Browser gleich aus.
- Der Unterschied beißt an zwei Stellen: wenn Sie eigenes CSS gegen die Ausgabe schreiben, und wenn das HTML durch einen Bereiniger läuft, dessen Positivliste eines von `align` und `style` erlaubt und das andere nicht. [Markdown sicher bereinigen](/blog/sanitising-markdown-safely) erklärt, warum eine gemeinsame Positivliste es wert ist, darauf zu bestehen.
- Ausrichtung ist die einzige Kontrolle pro Spalte, die die Syntax hat. Keine Breiten, keine Farben, keine Umbruchregeln — die leben in CSS oder nirgends.

**Wer sollte sie verwenden?** Jeden mit einer Spalte aus Zahlen, Versionen oder Dateigrößen. Richten Sie die rechts aus und lassen Sie Textspalten in Ruhe; zentrierter Fließtext ist schwerer zu lesen, als es im Editor aussieht.

### Leerzeilen — die Grenze, die der Parser braucht

Direkt unter eine Zeile Prosa geschrieben, kann die Kopfzeile einer Tabelle von diesem Absatz verschluckt werden. Parser sind sich uneinig darüber, ob eine Tabelle einen Absatz überhaupt unterbrechen darf, eine Datei, die auf Ihrem Rechner erscheint, erscheint also im nächsten Werkzeug der Kette möglicherweise nicht.

| Vorteile | Nachteile |
| --- | --- |
| Zwei Leerzeilen machen den Block überall eindeutig | Leicht zu verlieren, wenn Dateien erzeugt oder zusammengefügt werden |
| Beseitigt eine ganze Klasse von Unterschieden zwischen Werkzeugen | Es ist Leerraum, Prüfer merken sein Fehlen also nicht |
| Behebt außerdem Tabellen, die in rohes HTML eingepackt sind | Manche Editoren entfernen beim Speichern abschließende Leerzeilen |

**Preis:** zwei Leerzeilen, im Tausch gegen eine Tabelle, die sich in jedem Renderer gleich verhält.

**Technische Details und Funktionen**

- Eine Leerzeile vor der Kopfzeile hält sie aus dem vorherigen Absatz heraus. Eine Leerzeile nach der letzten Datenzeile beendet den Block sauber.
- Die Tabelle endet außerdem an jeder Zeile, die einen anderen Block beginnt: eine Überschrift, ein Zaun, ein Blockzitat, eine Trennlinie.
- In einer rohen HTML-Hülle sind die Leerzeilen nicht optional — siehe den Abschnitt über breite Tabellen unten.
- Von einem Skript zusammengenähte Dateien sind die üblichste Quelle einer fehlenden Leerzeile. Fügen Sie Dokumente mit einer Leerzeile dazwischen zusammen, nicht mit einem nackten Zeilenumbruch.

**Wer sollte sie verwenden?** Alle, jedes Mal. Das ist die günstigste Zuverlässigkeit, die Sie heute kaufen.

### Pipes in einer Zelle — die Maskierung, die Sie vergessen werden

Eine unmaskierte Pipe beendet die Zelle, wo auch immer sie auftaucht. Das gilt auch innerhalb einer Code-Spanne, denn die Zeile wird an den Pipes geteilt, bevor der Inline-Parser die Backticks überhaupt sieht. Schreiben Sie eine Shell-Pipeline, eine Typ-Union oder einen regulären Ausdruck mit einer Alternative darin, und die Zeile gewinnt leise eine Zelle und verliert einen Wert.

| Vorteile | Nachteile |
| --- | --- |
| `\|` funktioniert überall in einer Zelle, Code-Spannen eingeschlossen | Nichts an der kaputten Ausgabe zeigt auf die Pipe |
| Die Maskierung ist ein Zeichen und braucht keine Konfiguration | Quelle mit mehreren Maskierungen liest sich schlechter |
| Prozentkodierung als `%7C` funktioniert in einem Linkziel | Dieselbe Zeichenkette in einem eingezäunten Block braucht keine Maskierung, was Leute verwirrt |

**Preis:** ein Backslash pro Pipe, und Quelle, die sich etwas schlechter liest als die Ausgabe.

**Technische Details und Funktionen**

- Maskieren Sie eine wörtliche Pipe als `\|`. In GFM wird das innerhalb anderer Inline-Spannen beachtet, `` `a \| b` `` erscheint also als Code-Spanne mit `a | b`.
- Eine Pipe in einem Linkziel ist als `%7C` prozentkodiert am sichersten, denn Maskierungsregeln innerhalb von URLs sind zwischen Parsern weniger einheitlich.
- Eine Pipe in einem HTML-Attribut in einer Zelle teilt die Zeile ebenfalls. Der Parser liest Ihr HTML nicht.
- Eine vollbreite `｜` aus einer chinesischen oder japanischen Eingabemethode ist überhaupt nicht der Trenner, eine damit getippte Zeile wird also nie zu Zellen.
- Eingezäunte Codeblöcke außerhalb einer Tabelle brauchen keine Maskierung. Wenn sich eine Zelle mit Maskierungen füllt, ist das ein Hinweis, dass der Inhalt [besser in einen Codeblock](/blog/code-blocks-in-markdown) gehört.

**Wer sollte sie verwenden?** Jeden, der eine Kommandozeile, einen regulären Ausdruck, eine ODER-Bedingung oder eine Typ-Union dokumentiert — also die meisten, die technische Tabellen schreiben.

### Zeilenumbrüche in einer Zelle — unmöglich, und `<br>` stattdessen

Eine Tabellenzeile endet dort, wo die Zeile endet. Es gibt keine Markdown-Syntax für einen Umbruch in einer Zelle: zwei Leerzeichen am Zeilenende tun hier nichts, was auch immer sie [anderswo in einem Dokument](/blog/markdown-line-breaks-and-lists) tun, und ein abschließender Backslash hilft auch nicht, denn der Parser hat schon entschieden, dass die Zeile vorbei ist.

Der Behelf ist Inline-HTML:

```markdown
| Schritt | Notizen |
| --- | --- |
| Veröffentlichen | Erzeugt den Link.<br>Ihn zu senden ist Ihre Aufgabe. |
```

| Vorteile | Nachteile |
| --- | --- |
| Das Einzige, was funktioniert, und es funktioniert in den meisten Renderern | Es ist HTML in Ihrem Markdown, was manche Pipelines verbieten |
| GFM erlaubt Inline-HTML, der Parser lässt es also durch | Ein Bereiniger, der unbekannte Tags entfernt, lässt die Sätze zusammenlaufen |
| `<br>` und `<br />` parsen beide | Mehrere Umbrüche in einer Zelle heißen meist, dass die Tabelle falsch ist |

**Preis:** ein HTML-Tag, und eine Abhängigkeit davon, dass das, was Ihr HTML bereinigt, es behält.

**Technische Details und Funktionen**

- Setzen Sie das Tag inline, ohne Leerzeichen davor, genau dorthin, wo der Umbruch gehört.
- Ob es überlebt, hängt vom nächsten Schritt ab, nicht vom Parser. Ein Konverter, der rohes HTML standardmäßig maskiert, zeigt Ihnen ein wörtliches `<br>`; einer, der unbekannte Tags entfernt, verwirft es und fügt den Text zusammen.
- TransformPipe bereinigt die Vorschau und die heruntergeladene Datei gegen eine gemeinsame Positivliste, der Umbruch, den Sie in der Vorschau sehen, ist also der Umbruch in der Datei, die Sie verschicken.
- Braucht eine Zelle zwei Umbrüche, oder einen Umbruch plus eine Punktliste, schreiben Sie einen Absatz in ein Gitter. Holen Sie ihn heraus.

**Wer sollte es verwenden?** Jeden mit einer Notizen-Spalte, sparsam. Eine Tabelle, in der jede Zelle ein `<br>` trägt, ist eine Tabelle, die gegen ihre eigene Form kämpft.

### Ausgefranste Zeilen — lautlos aufgefüllt, lautlos abgeschnitten

Sobald Kopf- und Trennzeile sich auf eine Spaltenzahl geeinigt haben, ist diese Zahl Gesetz. Eine Datenzeile mit weniger Zellen wird mit leeren aufgefüllt. Eine Datenzeile mit mehr Zellen verliert die überzähligen. Keines erzeugt eine Warnung, und beides sieht wie Datenverlust aus, wenn Sie es eine Woche später finden.

| Vorteile | Nachteile |
| --- | --- |
| Kurze Zeilen sind erlaubt, abschließende leere Zellen können also weggelassen werden | Eine falsch gezählte Zeile verliert ihren letzten Wert ohne Hinweis |
| Das nachsichtige Verhalten hält handbearbeitete Tabellen am Erscheinen | Eine ergänzte Spalte muss in jede einzelne Zeile ergänzt werden |
| Die Spaltenzahl ist leicht zu prüfen: zählen Sie die Trennzellen | Erzeugte Tabellen erben, was der Generator falsch gezählt hat |

**Preis:** Stille. Das ist der eine Teil der Syntax, der ohne ein in der Quelle sichtbares Symptom scheitert.

**Technische Details und Funktionen**

- Die Zellenzahlen werden allein von Kopf- und Trennzeile entschieden. Datenzeilen werden ihnen angepasst.
- Ein verlorener letzter Wert in einer Zeile ist meist eine zusätzliche Pipe früher in derselben Zeile — oft eine unmaskierte in einem Wert.
- Spalten müssen in der Quelle nicht ausgerichtet sein. Ausgefranste Quelle erzeugt dasselbe HTML wie ein aufgeräumtes Gitter; räumen Sie es trotzdem auf, für den, der es als nächstes bearbeitet.
- Wenn Sie eine Spalte ergänzen, ergänzen Sie sie in der Kopfzeile, der Trennzeile und jeder Datenzeile in einer Bearbeitung. Halb migrierte Tabellen erscheinen trotzdem, weshalb sie ein Review überleben.

**Wer sollte das verwenden?** Niemand absichtlich. Kennen Sie die Regel, damit ein fehlender Wert Sie zum Pipes-Zählen schickt statt zum Beschuldigen des Konverters.

### Führende und abschließende Pipes — optional, bis sie es nicht sind

Diese zwei Blöcke erzeugen identisches HTML:

```markdown
| Name | Größe |
| --- | --- |
| logo.svg | 4 KB |

Name | Größe
--- | ---
logo.svg | 4 KB
```

| Vorteile | Nachteile |
| --- | --- |
| Die nackte Form ist schneller zu tippen und zu erzeugen | Schwerer zu lesen, und schwerer, eine fehlende Zelle darin zu entdecken |
| Die gerahmte Form macht die Spaltenzahl auf einen Blick sichtbar | Zwei zusätzliche Zeichen in jeder Zeile |
| Beide sind gültiges GFM, keine ist also ein Portabilitätsrisiko | Eine einspaltige Tabelle braucht die äußeren Pipes, um überhaupt erkannt zu werden |

**Preis:** zwei Zeichen pro Zeile für die gerahmte Form. Zahlen Sie ihn.

**Technische Details und Funktionen**

- Äußere Pipes sind in Kopf-, Trenn- und Datenzeilen unabhängig voneinander optional. Sie können sie mischen, auch wenn es keinen Grund dafür gibt.
- Eine einspaltige Tabelle ist die Ausnahme: ohne eine Pipe irgendwo auf der Zeile gibt es nichts, was dem Parser sagt, dass er eine Tabelle vor sich hat — schreiben Sie also `| Kopf |` und `| --- |`.
- Leerzeichen um den Zelleninhalt werden entfernt, Zellen zum Ausrichten aufzufüllen kostet zur Darstellungszeit also nichts.
- Tabulatoren in einer Zeile werden als Leerraum behandelt, nicht als Trenner. Eine tabulatorgetrennte Tabelle ist keine Markdown-Tabelle.

**Wer sollte sie verwenden?** Nehmen Sie die gerahmte Form in Dateien, die Menschen von Hand bearbeiten. Die nackte Form ist für die Ausgabe eines Skripts in Ordnung, wo ohnehin niemand die Quelle liest.

### Einrückung — drei Leerzeichen gut, vier Leerzeichen tödlich

Bis zu drei führende Leerzeichen werden ignoriert. Vier oder mehr verwandeln die Zeile in einen eingerückten Codeblock, und die Tabelle erscheint als Festbreitentext in einem grauen Kasten — was wenigstens ein unverwechselbares Symptom ist.

| Vorteile | Nachteile |
| --- | --- |
| Die Toleranz von drei Leerzeichen verzeiht den meisten verirrten Leerraum | Vier Leerzeichen sind ein völlig anderes Konstrukt |
| Tabellen verschachteln sich in Listenelemente, wenn richtig eingerückt | Die nötige Einrückung hängt von der Breite der Listenmarkierung ab |
| Das Scheitern ist sichtbar: ein Codeblock, kein Absatz | Gemischte Tabulatoren und Leerzeichen machen die Inhaltsspalte uneindeutig |

**Preis:** Aufmerksamkeit, wann immer die Tabelle in einer Liste lebt.

**Technische Details und Funktionen**

- In einem Listenelement muss jede Zeile der Tabelle — Kopf, Trenner und Körper — auf der Inhaltsspalte des Elements sitzen, und das ist die Spalte, in der der eigene Text des Elements beginnt.
- In einem Blockzitat braucht jede Zeile ihre `>`-Markierung, die Trennzeile eingeschlossen.
- Eine Tabelle in einer Liste in einem Blockzitat ist erlaubt, und niemand wird Ihnen dafür danken.
- Wenn die Tabelle als Codeblock erscheint, ist die Abhilfe Leerraum, nicht Syntax.

**Wer sollte das verwenden?** Jeden, der Abläufe schreibt, bei denen ein Schritt eine kleine Tabelle darunter will. Erwägen Sie stattdessen eine Überschrift und eine Tabelle in voller Breite; verschachtelte Tabellen sind auf einem Telefon eng.

### Der Dialekt — Tabellen sind GFM, nicht CommonMark

Tabellen stehen weder im ursprünglichen Markdown noch im reinen CommonMark. Mehrere Erweiterungen ergänzen sie, und die Fassung von GitHub Flavored Markdown ist die, der die meisten Werkzeuge folgen. Ein Konverter, der als strenges CommonMark ohne Tabellen-Erweiterung läuft, stellt Ihre Tabelle als Absatz aus Pipes dar — und er hat recht damit. Nichts ist kaputt. Die Funktion ist nicht da.

| Vorteile | Nachteile |
| --- | --- |
| Die Tabellensyntax von GFM ist es, was fast jedes moderne Werkzeug umsetzt | Ein konformer CommonMark-Parser lehnt sie ab, korrekt |
| Der Rückfall ist lesbarer Text statt eines Fehlers | Das Scheitern ist lautlos, es reist also weit, bevor es jemandem auffällt |
| Pandoc, remark, markdown-it und andere bieten alle Tabellen | Erweiterungen unterscheiden sich an den Rändern: Gittertabellen, Beschriftungen, mehrzeilige Zellen |

**Preis:** keiner in GFM. In einer gemischten Pipeline besteht er darin, jeden Parser einmal zu prüfen.

**Technische Details und Funktionen**

- GFM definiert Tabellen als Erweiterung zu CommonMark, neben Aufgabenlisten, Durchgestrichenem und Autolinks. Ein Werkzeug kann CommonMark vollständig umsetzen und keine der vier unterstützen.
- Manche Ökosysteme brauchen die Erweiterung ausdrücklich eingeschaltet — ein Plugin, ein Preset oder ein Flag — und liefern sie ausgeschaltet aus.
- Andere Dialekte ergänzen Tabellenfunktionen, die GFM nicht hat, etwa mehrzeilige Zellen oder Beschriftungen. Die reisen nicht: ein Dokument, das sich darauf stützt, erscheint in einem GFM-Renderer als Pipes.
- [CommonMark, GFM und die Dialekte](/blog/commonmark-gfm-and-the-flavours) legt dar, welcher Parser was tut, und [der Konvertervergleich](/blog/best-markdown-to-html-converters) behandelt, welche Werkzeuge Tabellen ohne Konfiguration verkraften.

**Wer sollte das verwenden?** Jeden, dessen Datei durch mehr als einen Renderer läuft. Konvertieren Sie früh ein repräsentatives Dokument und sehen Sie sich die Tabellen an, bevor Sie darauf etwas aufbauen.

## Wo eine Markdown-Tabelle die falsche Form ist, und was das kostet

Die Syntax oben behandelt Tabellen, die funktionieren sollten und es nicht tun. Es gibt eine zweite Kategorie: Tabellen, die nicht funktionieren können, weil die Daten nicht in das passen, was eine Markdown-Tabelle ist. Das ist der Teil, den eine Syntaxreferenz auslässt, und es ist es wert, über die Alternativen ehrlich zu sein, denn jede kostet etwas Echtes.

**Verbundene Zellen.** Es gibt kein colspan und kein rowspan. Eine Finanztabelle mit einer übergreifenden Kopfzeile, oder eine Matrix mit einer verbundenen Beschriftungsspalte, lässt sich nicht ausdrücken. Ihre Möglichkeiten sind eine rohe HTML-`<table>` in der Markdown-Datei oder eine andere Darstellung. Die HTML-Tabelle funktioniert, und sie kostet Sie drei Dinge: niemand kann sie in der Quelle lesen, ein Diff eines geänderten Werts wird ein Diff einer HTML-Zeile, und der ganze Block hängt davon ab, dass der Bereiniger Ihres Konverters `table`, `tr`, `td`, `colspan` und `rowspan` erlaubt. Reichlich Positivlisten erlauben die Tags und verwerfen die Attribute, was eine Tabelle erzeugt, die erscheint und deren Verbindungen leise weg sind.

**Zellen mit echtem Inhalt.** Eine Zelle, die einen Absatz, eine Punktliste, einen eingezäunten Codeblock, ein Blockzitat oder eine verschachtelte Tabelle will, kann keines haben. Zellen halten Inline-Inhalt, Punkt. Die übliche Abhilfe ist die richtige: behalten Sie die Tabelle als Zusammenfassung, einen kurzen Wert pro Zelle, und setzen Sie das Detail in Abschnitte mit Überschriften darunter. Es liest sich auf einem Telefon außerdem besser, wo eine fünfspaltige Tabelle mühsam ist, wie auch immer sie geschrieben wurde.

**Alles mit einer Checkbox.** Aufgabenlisten-Checkboxen kommen von Listenelementen, `- [ ]` in einer Zelle bleibt in den meisten Renderern also wörtlicher Text. Wenn Sie eine Spalte mit Häkchen brauchen, setzen Sie ein Zeichen hinein und sagen Sie in der Kopfzeile, was es bedeutet.

**Referenz-Links, die in der Nähe definiert sind.** Link-Referenzdefinitionen sind auf Blockebene, sie können also nicht in einer Tabelle leben. Referenzen, die anderswo im Dokument definiert sind, funktionieren in Zellen gut; die Definition muss lediglich außerhalb des Blocks stehen.

**Tabellen, die eigentlich Daten sind.** Wenn die Zeilen aus einer Tabellenkalkulation, einem Export oder einer Abfrage kommen, ist Pipes von Hand zu bearbeiten die falsche Aufgabe — [konvertieren Sie stattdessen die CSV](/blog/best-csv-to-markdown-converters). Jede ergänzte Spalte heißt jede Zeile anfassen, und eine falsch gezählte Zeile verliert lautlos einen Wert. Behalten Sie die CSV oder die Abfrage als Quelle der Wahrheit und erzeugen Sie das Markdown: [CSV in eine Markdown-Tabelle zu konvertieren](/csv-to-markdown) nimmt Ihnen das Zählen vollständig ab und macht die Maskierung bei Werten richtig, die Pipes enthalten — und das ist der Fehler, den Leute von Hand machen.

**Breite Tabellen.** Hinter einer Beschwerde verstecken sich zwei Probleme. Das erste ist die Quelldatei, in der eine neunspaltige Tabelle jämmerlich zu bearbeiten und unmöglich zu prüfen ist. Das zweite ist die Seite: eine HTML-Tabelle nimmt die Breite, die ihr Inhalt verlangt, eine breite quetscht ihre Spalten also entweder zu Bändern oder zieht die Seite seitwärts. Abhilfen, etwa in der Reihenfolge, in der sie Ihnen gefallen sollten:

- Streichen Sie eine Spalte. Breite Tabellen enthalten meist eine mit demselben Wert in jeder Zeile, oder zwei, die eine sein könnten.
- Kürzen Sie die Überschriften. Eine Überschrift, die nicht umbrechen kann, setzt die Mindestbreite der Spalte — „Authentifizierung erforderlich" kostet also mehr als „Auth".
- Drehen Sie sie. Vier Spalten und drei Zeilen lesen sich oft andersherum besser.
- Teilen Sie sie in zwei Tabellen mit einer gemeinsamen Schlüsselspalte.
- Lassen Sie sie scrollen, indem Sie sie in einen Container packen, dem Ihr Stylesheet `overflow-x: auto` gibt.

Die letzte hat einen Haken, der es wert ist, ausgeschrieben zu werden, denn sie ist eine verbreitete Art, eine bisher heile Tabelle zu brechen:

```markdown
<div class="table-scroll">

| Spalte | Spalte |
| --- | --- |
| … | … |

</div>
```

Die Leerzeilen in der Hülle sind Pflicht. Ohne sie sitzt die Tabelle in einem rohen HTML-Block, der Parser lässt das Ganze in Ruhe, und Ihre Pipes erreichen die Seite wortwörtlich. Und die Hülle hilft nur dort, wo Sie das CSS kontrollieren. In einer eigenständigen HTML-Datei entscheidet das Stylesheet, das Ihr Konverter mitliefert, ob eine breite Tabelle scrollt oder überläuft.

## Wie Sie die Form Ihrer Tabelle wählen

1. **Zählen Sie die Spalten, bevor Sie die Kopfzeile tippen.** Die Zahl, auf die Sie sich in der Trennzeile festlegen, ist die Zahl, die von da an jede Zeile einhalten muss — und eine später zu ergänzen heißt, jede Zeile zu bearbeiten. Entscheiden Sie also einmal, während die Tabelle noch drei Zeilen lang ist.
2. **Entscheiden Sie, ob die Daten geschrieben oder erzeugt sind.** Prosa gehört in eine handgeschriebene Tabelle. Zeilen, die aus einer Tabellenkalkulation oder einer API kamen, gehören in eine erzeugte, denn ein Mensch, der vierzig Zeilen Pipes abtippt, wird sich mindestens einmal verzählen, und das Verzählen ist lautlos.
3. **Fragen Sie, ob irgendeine Zelle jemals eine zweite Zeile brauchen wird.** Wenn ja, legen Sie sich auf `<br>` fest und auf einen Bereiniger, der es behält. Wenn mehr als eine Zelle es braucht, ist die Tabelle der falsche Behälter, und die richtige Antwort ist eine kurze Tabelle plus Abschnitte.
4. **Prüfen Sie den Parser am anderen Ende, bevor Sie sich auf eine Tabelle stützen.** Eine Datei, die auf GitHub erscheint und in einem Build bricht, trifft meist auf einen strengeren Parser mit abgeschalteten Tabellen — und das entdecken Sie lieber an einer Testdatei als in einem veröffentlichten Dokument.
5. **Konvertieren Sie einmal und lesen Sie das HTML, nicht die Vorschau.** Eine Vorschau, die auf demselben Parser wie Ihr Editor aufbaut, stimmt Ihrem Editor per Konstruktion zu. Das `<table>`-Element in der Ausgabe ist der einzige Beweis, und ein dort fehlendes `<th>` sagt Ihnen, welche Zeile zu richten ist.

## Fazit

Markdown-Tabellen sind auf eine bestimmte Art zerbrechlich: sie scheitern vollständig statt teilweise, und sie scheitern, ohne es zu sagen, was sie unvorhersehbar aussehen lässt, obwohl sie es nicht sind. Die Trennzeile muss der Zellenzahl der Kopfzeile entsprechen, der Block braucht auf jeder Seite eine Leerzeile, eine wörtliche Pipe braucht einen Backslash, ein Zeilenumbruch braucht `<br>`, und die ganze Funktion braucht einen Parser, der GFM umsetzt. Machen Sie diese fünf richtig, und eine Tabelle übersteht jede Konvertierung, durch die Sie sie schicken werden. Nehmen Sie die breiteste, am stärksten maskierte Tabelle, die Sie haben, schicken Sie sie durch [TransformPipe](https://transformpipe.com) und lesen Sie den HTML-Quelltext neben der Vorschau: eine fehlende Spalte heißt, die Bindestriche sind falsch gezählt, und eine in zwei geteilte Zelle heißt, da ist eine Pipe, die Sie nicht maskiert haben.

## FAQ

### Warum erscheint meine Markdown-Tabelle überhaupt nicht?

In neun von zehn Fällen ist die Trennzeile falsch: sie fehlt, steht auf der falschen Zeile oder hält eine andere Zellenzahl als die Kopfzeile. Zählen Sie die Zellen der ersten Zeile und die der zweiten und machen Sie sie gleich. Stimmen sie schon, prüfen Sie auf eine Leerzeile über der Tabelle und auf einen Geviertstrich dort, wo Sie drei Bindestriche getippt haben.

### Brauche ich eine Leerzeile vor einer Markdown-Tabelle?

Ja, in der Praxis. Parser sind sich uneinig darüber, ob eine Tabelle einen Absatz unterbrechen darf, eine direkt unter eine Zeile Prosa geschriebene Tabelle erscheint also in manchen Werkzeugen und wird in anderen vom Absatz aufgesaugt. Eine Leerzeile vor der Kopfzeile und eine nach der letzten Datenzeile beseitigt die Uneinigkeit.

### Wie setze ich einen Zeilenumbruch in eine Markdown-Tabellenzelle?

Mit `<br>`, inline dort geschrieben, wo der Umbruch gehört. Es gibt keine Markdown-Syntax dafür, denn eine Tabellenzeile endet am Zeilenende, und zwei Leerzeichen am Zeilenende tun in einer Zelle nichts. Ob das Tag überlebt, hängt am Bereiniger Ihres Konverters, nicht an seinem Parser.

### Wie maskiere ich ein Pipe-Zeichen in einer Markdown-Tabelle?

Schreiben Sie `\|`. Es funktioniert in gewöhnlichem Zellentext und innerhalb von Code-Spannen, `` `a \| b` `` gibt Ihnen also eine Code-Spanne mit einer Pipe. In einem Linkziel prozentkodieren Sie es stattdessen als `%7C`, denn Maskieren innerhalb von URLs wird zwischen Parsern weniger einheitlich behandelt.

### Wie richte ich eine Spalte in einer Markdown-Tabelle aus?

Setzen Sie Doppelpunkte in die Trennzeile: `:---` für links, `:---:` für mittig, `---:` für rechts. Die Ausrichtung gilt für die ganze Spalte samt Kopfzeile, und es gibt keine Art, eine einzelne Zelle auszurichten. Was der Renderer ausgibt — ein `align`-Attribut oder einen `text-align`-Stil — schwankt, und beides sieht im Browser gleich aus.

### Sind Tabellen Teil des Standard-Markdown?

Nein. Tabellen stehen weder im ursprünglichen Markdown noch in CommonMark; sie kommen aus Erweiterungen, und die Fassung von GitHub Flavored Markdown ist die, die die meisten Werkzeuge umsetzen. Ein strenger CommonMark-Parser stellt Ihre Tabelle als Absatz aus Pipe-Zeichen dar und verhält sich damit korrekt.

### Was mache ich mit einer Markdown-Tabelle, die zu breit ist?

Streichen Sie eine Spalte, kürzen Sie die Überschriften, oder drehen Sie sie — das richtet die Quelle so gut wie die Seite. Braucht die Tabelle die Breite wirklich, packen Sie sie in ein `<div>`, dem Ihr Stylesheet `overflow-x: auto` gibt, denken Sie an die Leerzeilen in der Hülle, und akzeptieren Sie, dass die Hülle nur dort hilft, wo Sie das CSS kontrollieren.
