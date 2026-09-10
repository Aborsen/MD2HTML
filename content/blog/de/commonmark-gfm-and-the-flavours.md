---
title: "CommonMark gegen GFM: Welches Markdown schreiben Sie eigentlich?"
description: "Was CommonMark festlegt, was GFM Regel für Regel ergänzt und was nur als Erweiterung reist — plus eine Tabelle Funktion gegen Implementierung, die Brüche vorhersagt"
date: 2026-08-18
tag: Syntax
keywords: commonmark, commonmark gegen markdown, github flavored markdown, gfm, gfm gegen commonmark, markdown dialekte, markdown spezifikation, markdown erweiterungen, unterschied commonmark gfm
---

Fügen Sie eine Datei in drei Werkzeuge ein, und Sie können drei Dokumente bekommen. Eines zeichnet eine Tabelle, ein anderes zeigt eine Reihe von Pipe-Zeichen. Eines verwandelt einen einzelnen Zeilenumbruch in einen harten Zeilenumbruch, ein anderes faltet die Zeilen zu einem Absatz. Nichts ist kaputt und nichts ist falsch eingestellt. Die Werkzeuge sprechen verschiedene Dialekte, „Markdown" benennt die Familie statt eines einzelnen Mitglieds, und zu wissen, welches Mitglied Sie schreiben, ist der größte Teil der Abhilfe.

### Kurzfassung

CommonMark ist eine Spezifikation mit einer Testsuite: sie beendet die Streitigkeiten über die ursprüngliche Syntax und hört absichtlich bei einem Kern auf, ohne Tabellen, ohne Aufgabenlisten, ohne Durchgestrichenes und ohne Autolinks für nackte URLs. GFM ist genau diese Spezifikation plus genau fünf benannte Erweiterungen — Tabellen, Aufgabenlisten-Elemente, Durchgestrichenes, Autolinks und ein Filter, der neun rohe HTML-Tags maskiert — und es ist der Dialekt, den die meisten Leute meinen, wenn sie Markdown sagen. Alles andere, was Sie in einer `.md`-Datei gesehen haben — Fußnoten, Definitionslisten, Attributlisten, Mathematik, Hinweisblöcke, Frontmatter — steht in keiner der beiden Spezifikationen und reist nur so weit wie die Erweiterungsliste des nächsten Werkzeugs. Schreiben Sie für den strengsten Leser in der Kette, und testen Sie mit einer Sondendatei statt mit einer Vermutung.

## Drei Spezifikationen, und die Jahre dazwischen

John Gruber veröffentlichte Markdown 2004: eine Syntaxbeschreibung auf einer Webseite und `Markdown.pl`, ein Perl-Skript, das diese Syntax in HTML verwandelte. Die letzte Veröffentlichung war 1.0.1, datiert auf den 17. Dezember 2004 (geprüft auf daringfireball.net/projects/markdown, 8. September 2026). Seite und Skript waren zusammen die Definition, und wo die Prosa schwieg — was oft vorkam — wurde das, was das Skript zufällig tat, zur Antwort.

Das ist in Ordnung für ein Blog und schmerzhaft für die zweite Implementierung. Die Beschreibung sagt nirgends, um wie viele Leerzeichen eine verschachtelte Liste eingerückt wird, was passiert, wenn eine Betonung innerhalb eines Wortes beginnt, wie eine Liste mit dem Blockzitat zusammenwirkt, in dem sie steckt, oder ob ein harter Zeilenumbruch am Ende eines Absatzes überlebt. Jeder Implementierer riet, und die Vermutungen gingen auseinander. Innerhalb weniger Jahre gab es dutzende Bibliotheken, alle Markdown genannt, keine einig über die unbequemen Fälle und alle einig über die einfachen. Der Vergleich, den Leute als *commonmark vs markdown* suchen, ist also eigentlich ein Vergleich zwischen einer Spezifikation und einer Beschreibung plus einem Skript.

CommonMark, erstmals 2014 veröffentlicht, ist diese fehlende Spezifikation, aufgeschrieben. Es definiert die Parsing-Regeln im Detail und liefert hunderte Testfälle, jeder ein Stück Markdown neben genau dem HTML, das es erzeugen muss. Es gibt kein CommonMark-artig: eine Implementierung besteht die Suite, oder sie besteht sie nicht.

GFM ging das Problem vom anderen Ende an. GitHub hatte einen Renderer, auf den Millionen Dateien zeigten, und eine Liste von Ergänzungen, auf die sich seine Nutzer verließen, also schrieb es die Spezifikation von GitHub Flavored Markdown als strenge Obermenge von CommonMark — dasselbe Dokument, mit fünf hinzugefügten Erweiterungsabschnitten. Deshalb hat *commonmark vs gfm* eine kurze Antwort: derselbe Kern, fünf benannte Ergänzungen, keine weiteren Unterschiede. Alles jenseits dieser fünf ist irgendjemandes Erweiterung, und Erweiterungen sind der Punkt, an dem Dateien aufhören zu reisen.

## Was CommonMark wirklich geklärt hat

Es ist leicht, CommonMark wegen dessen, was es auslässt, als ein kürzeres Markdown zu lesen. Der Wert liegt in dem, was es festnagelt. Jeder dieser Punkte war eine echte Meinungsverschiedenheit zwischen Implementierungen, bevor die Spezifikation existierte, und jeder ist heute beantwortbar, indem man auf ein nummeriertes Beispiel zeigt.

- **Listeneinrückung.** Wie weit eine Kindliste eingerückt sein muss, ist über die Inhaltsspalte des Elternteils definiert, nicht über eine feste Zahl von Leerzeichen. Deshalb verhalten sich die Marker `-` und `1.` unterschiedlich, wenn Sie darunter verschachteln: sie sind unterschiedlich breit.
- **Locker gesetzte und dichte Listen.** Eine Leerzeile zwischen Elementen macht die ganze Liste locker gesetzt, was den Text jedes Elements in `<p>` einpackt. Eine einzige verirrte Leerzeile ändert die Abstände einer Liste, die Sie nicht angefasst haben — die häufigste Überraschung in der ganzen Spezifikation, und eine, die [ihre eigenen lesenswerten Fehlfälle hat](/blog/markdown-line-breaks-and-lists).
- **Betonung.** Die Regeln für links- und rechtsflankierende Trennzeichenläufe ersetzen das alte „es kommt darauf an" für `snake_case_words`, `**bold**inside` und jede Mischung aus Sternchen und Unterstrichen.
- **Eingezäunte Codeblöcke.** Backtick- und Tilde-Zäune, die Regeln für den schließenden Zaun und der Info-String. Das Wort nach dem Zaun ist eine Beschriftung und nichts weiter: [jeder Konverter macht daraus einen Klassennamen und hört dort auf](/blog/code-blocks-in-markdown).
- **Harte Zeilenumbrüche.** Zwei Leerzeichen am Zeilenende oder ein Backslash am Zeilenende. Ein einzelner Zeilenumbruch ist ein Leerzeichen. Das ist eine Regel der Spezifikation, keine Vorliebe, und es ist die Regel, für deren Bruch die meisten Werkzeuge eine Option anbieten.
- **HTML-Blöcke.** Sieben verschiedene Arten, jede mit eigenen Start- und Endbedingungen, weshalb ein `<div>` das Markdown danach manchmal verschluckt und manchmal nicht.
- **Linkreferenzdefinitionen**, Zeichenreferenzen, Tabulator-Expansion auf vier Spalten, thematische Trennlinien, ATX- und Setext-Überschriften und die nachlässige Fortsetzung von Blockzitaten.

CommonMark hört absichtlich bei diesem Kern auf. Keine Tabellen, keine Fußnoten, kein Durchgestrichenes, keine Aufgabenlisten, kein Autolinken nackter URLs. Die Begründung ist vertretbar: der Kern ist, was alle schon gemeinsam hatten, und die Streitigkeiten darüber einzufrieren war die Aufgabe. Die Folge ist, dass ein streng konformer Parser Ihre Tabelle als Absatz voller Pipes darstellt, lautlos und korrekt.

## Was GFM ergänzt, Regel für Regel

Die GFM-Spezifikation benennt fünf Erweiterungen. Vier fügen Syntax hinzu; eine nimmt etwas weg. Jede hat Regeln, die konkret genug sind, um darüber zu stolpern, und die Fehlschläge sind immer lautlos — eine Tabelle, die nicht erkannt wird, ist einfach Text.

**Tabellen.** Eine Kopfzeile, eine Trennzeile, dann null oder mehr Datenzeilen. Die Trennzeile besteht aus Bindestrichen mit optionalen Doppelpunkten: `:---` links, `:---:` zentriert, `---:` rechts. Die Regel, die Leute erwischt, ist, dass die Kopfzeile und die Trennzeile die gleiche Zahl von Zellen enthalten müssen; tun sie es nicht, ist der Block überhaupt keine Tabelle, und Sie bekommen Pipes auf der Seite (geprüft auf github.github.com/gfm, 8. September 2026). Führende und abschließende Pipes sind optional. Datenzeilen mit zu wenigen Zellen werden mit leeren aufgefüllt, und Zeilen mit zu vielen werden abgeschnitten. Zellen tragen nur Inline-Inhalt — keine Listen, keine eingezäunten Blöcke, keinen zweiten Absatz in einer Zelle — und eine wörtliche Pipe muss `\|` geschrieben werden, auch innerhalb einer Code-Spanne. Die Tabelle endet an der ersten Leerzeile oder am Beginn eines anderen Blocks. Das meiste, was bei Tabellen in der Konvertierung schiefgeht, kommt von diesen letzten drei Regeln, und [Tabellen verdienen ihren eigenen Text](/blog/markdown-tables-that-survive-conversion).

**Aufgabenlisten-Elemente.** `[ ]`, `[x]` oder `[X]` als das Erste im ersten Absatz eines Listenelements, gefolgt von einem Leerzeichen. Es muss ein Listenelement sein: dieselben Klammern auf einer eigenen Zeile sind wörtliche Klammern. Die Ausgabe ist ein Checkbox-`<input>`, das als `disabled` markiert ist, weshalb eine konvertierte Checkliste im Browser ausgegraut aussieht — das ist die spezifizierte Darstellung, kein Fehler im Konverter. GitHubs Issue- und Pull-Request-Ansichten machen sie über die eigene Anwendung klickbar, was nicht Teil der Syntax ist.

**Durchgestrichenes.** `~~text~~`. Ein Absatzumbruch beendet die Spanne, genauso wie er eine Betonung beendet. GitHub stellt auch eine einzelne Tilde dar, und nicht jede GFM-Implementierung folgt dem darin, schreiben Sie also zwei, wenn die Datei irgendwo anders hingeht.

**Autolinks.** Eine nackte `http://`-, `https://`- oder `www.`-URL und eine nackte E-Mail-Adresse werden ohne spitze Klammern zu Links. Die Regeln sind engmaschiger, als sie aussehen. Die URL muss am Zeilenanfang beginnen oder auf ein Leerzeichen oder auf eines von `*`, `_`, `~` und `(` folgen. Abschließende Satzzeichen werden vom Ende des Links abgeschnitten statt eingeschlossen. Eine schließende Klammer wird nur eingeschlossen, wenn die Klammern ausgeglichen sind, weshalb eine Wikipedia-URL, die auf `(disambiguation)` endet, meist überlebt und eine URL innerhalb einer Klammerbemerkung meist ihr letztes Zeichen verliert. Ein Unterstrich irgendwo in den letzten zwei Segmenten der Domain hebt den Autolink vollständig auf. Autolinks in spitzen Klammern, `<https://example.com>`, sind Kern-CommonMark und funktionieren immer — die Erweiterung deckt nur die nackte Form ab.

**Unerlaubtes rohes HTML.** Die Subtraktion. GFM maskiert das öffnende `<` von neun Tag-Namen, damit sie als sichtbarer Text und nicht als Markup auf die Seite kommen: `title`, `textarea`, `style`, `xmp`, `iframe`, `noembed`, `noframes`, `script` und `plaintext` (geprüft auf github.com/github/cmark-gfm, 8. September 2026). Das ist eine Regel zur Darstellungssicherheit, die zu GFM gehört und nicht zu Markdown, und es lohnt sich, genau zu sein, was sie nicht ist. Sie ist kein Bereiniger. Sie filtert neun Tag-Namen per Liste; sie tut nichts gegen `onerror=` an einem `<img>`, nichts gegen `javascript:` in einem `<a href>` und nichts gegen ein `<svg>` mit einem Handler daran. Wenn Sie eine Datei konvertieren, die jemand anders geschrieben hat, [brauchen Sie nach dem Parser weiterhin einen echten Bereiniger mit Positivliste](/blog/sanitising-markdown-safely).

Zwei Dinge werden allgemein für Teil von GFM gehalten und sind es nicht. Fußnoten stehen nicht in der Spezifikation, obwohl GitHubs Website sie darstellt. Die `> [!NOTE]`-Hinweise ebenso nicht. Beides sind Verhaltensweisen eines einzelnen Renderers, hinzugefügt nachdem die Spezifikation geschrieben war, und ein Parser, der GFM-Konformität behauptet, macht nichts falsch, wenn er sie ignoriert.

## Was in keiner der beiden Spezifikationen steht

Jenseits dieser fünf Erweiterungen hört der Boden auf, gemeinsam zu sein. Alles Folgende ist verbreitet, nützlich und nicht portabel — jedes davon existiert in mehreren Syntaxen, oder in nur einem Werkzeug.

- **Fußnoten** — `[^1]` im Text, `[^1]:` am Ende. GitHub stellt sie dar, Pandoc stellt sie dar, remark-gfm stellt sie dar, und ein reiner CommonMark-Parser gibt die Klammern genau so aus, wie sie getippt wurden.
- **Definitionslisten** — ein Begriff, dann Zeilen, die mit `:` beginnen. Von PHP Markdown Extra geerbt. Pandoc, Python-Markdown, Goldmark und kramdown haben sie; die JavaScript-Welt größtenteils nicht.
- **Attributlisten** — `{#my-id .warning}` nach einer Überschrift oder einer Spanne, um eine id, eine Klasse oder ein beliebiges Attribut zu setzen. In Pandoc und kramdown eingebaut, eine offizielle Erweiterung in Python-Markdown, ein Plugin in markdown-it, und in marked nicht vorhanden.
- **Mathematik** — `$...$` inline und `$$...$$` abgesetzt, auf der Seite an KaTeX oder MathJax übergeben. Jede Implementierung schreibt das anders, und mehrere brauchen eine Passthrough-Option, damit der Parser das TeX in Ruhe lässt, statt die Unterstriche als Betonung zu fressen.
- **Hinweisblöcke** — `> [!NOTE]` auf GitHub, `:::note` in Docusaurus und mehreren anderen Frameworks, `!!! note` in MkDocs, eine `{: .note}`-Attributliste in Jekyll. Vier Syntaxen für eine Idee, und für keine davon eine Spezifikation.
- **Frontmatter** — ein YAML-Block, der ganz oben in der Datei von `---` eingezäunt ist. Seitengeneratoren entfernen ihn und lesen ihn als Metadaten. Ein Konverter, der nie davon gehört hat, stellt ihn als Inhalt dar, und das Ergebnis ist eine horizontale Linie, gefolgt von Ihren Metadaten als Überschrift, denn `---` unter einer Textzeile ist Setext-Überschriftensyntax.
- **Überschriften-Anker** — die `#section-title`-ids, die ein Inhaltsverzeichnis funktionieren lassen. Zur Darstellungszeit erzeugt von GitHub, von jedem Generator und von einem Plugin oder einer Option in den meisten Bibliotheken. Überhaupt keine Syntax, und der Slug-Algorithmus unterscheidet sich zwischen Werkzeugen, sodass ein handgeschriebener Querverweis brechen kann, wenn der Renderer wechselt.
- **Die kleineren** — Abkürzungen, Hoch- und Tiefstellung, Emoji-Kurzcodes wie `:tada:`, Wiki-Links `[[Page]]`, mermaid als Diagramm statt als Codeblock behandelt, und intelligente Zeichensetzung, die Ihre Anführungszeichen in typografische verwandelt, ob Sie das wollten oder nicht.

## Schnellvergleich: die Dialekte und die Maschinen, die sie sprechen

| Name | Am besten für | Entscheidende Fähigkeit | Preis |
| --- | --- | --- | --- |
| Original Markdown 1.0.1 | Historische Referenz | Die Syntaxseite von 2004 plus `Markdown.pl` | Kostenlos, BSD-artige Lizenz |
| CommonMark | Einen Streit über das Parsen beenden | Eine Spezifikation mit ausführbarer Testsuite | Kostenlos, offene Spezifikation |
| GitHub Flavored Markdown | Das Standardziel für alles Geteilte | CommonMark plus fünf benannte Erweiterungen | Kostenlos, offene Spezifikation |
| markdown-it (JS) | Korrektheit mit Raum zum Erweitern | CommonMark-konform, maskiert rohes HTML standardmäßig | Kostenlos, MIT |
| marked (JS) | GFM ohne Konfiguration | GFM von Haus aus an, ein Funktionsaufruf | Kostenlos, MIT |
| remark / unified (JS) | Das Dokument umschreiben, nicht nur ausgeben | Ein AST plus remark-gfm und ein großer Plugin-Satz | Kostenlos, MIT |
| Pandocs Markdown | Dokumente, die Fußnoten und Mathematik brauchen | Benannte Erweiterungen, die Sie einzeln einschalten | Kostenlos, GPL |
| Python-Markdown | Python-Builds und MkDocs-Seiten | Offizielle Erweiterungs-API: tables, footnotes, attr_list | Kostenlos, BSD |
| Goldmark (Go) | Go-Programme und Hugo-Seiten | CommonMark plus ein gebündelter GFM-Erweiterungssatz | Kostenlos, MIT |
| kramdown (Ruby) | Jekyll und GitHub Pages | Eine Markdown-Obermenge mit Inline-Attributlisten | Kostenlos, MIT |
| MDX | Dokumentationsseiten mit Komponenten | JSX in Markdown, kompiliert statt dargestellt | Kostenlos, MIT |

## Die Dialekte und Implementierungen, eine nach der anderen

Was folgt, betrifft nur den Dialekt — welche Konstrukte jeder erkennt und wie Sie das ändern. Welchen davon man als Konverter wählt, ist [ein anderer Vergleich](/blog/best-markdown-to-html-converters), nach anderen Kriterien.

### Original Markdown 1.0.1 — der Vorfahr, kein Ziel

Grubers Syntaxseite und Perl-Skript. Es ist noch immer der Grund, warum eine `.md`-Datei rohes HTML überhaupt zulässt, und noch immer die Quelle von Verhaltensweisen, die in Werkzeugen überleben, die lange danach geschrieben wurden.

| Vorteile | Nachteile |
| --- | --- |
| Die kürzeste Beschreibung der Syntax, die je geschrieben wurde | Mehrdeutig genau an den Stellen, an denen Implementierungen sich uneinig sind |
| Erklärt, warum rohes HTML standardmäßig durchgeht | Keine Tabellen, keine eingezäunten Codeblöcke, keine Testsuite |
| Noch immer die Grundlinie für `markdown_strict` in Pandoc | Seit 1.0.1 nicht mehr betreut |

**Preis:** kostenlos, BSD-artige Lizenz.

**Technische Details und Funktionen**

- Nur eingerückte Codeblöcke — eingezäunter Code kam mit späteren Dialekten
- Rohe HTML-Tags auf Blockebene gehen unangetastet durch, und Markdown darin wird nicht geparst
- Betonung, Links, Bilder, Blockzitate, ATX- und Setext-Überschriften, Listen, horizontale Linien
- Keine Festlegung der Einrückung verschachtelter Listen, und das ist die Mehrdeutigkeit, die alles Nachfolgende geerbt hat

**Wer sollte es verwenden?** Niemand, als Ziel. Lesen Sie es, um zu verstehen, warum ein Konstrukt sich so verhält, wie es sich verhält, und wählen Sie `markdown_strict` in Pandoc, wenn Sie ausdrücklich wissen müssen, wie eine Datei 2004 dargestellt worden wäre.

### CommonMark — der Kern, an dem alles andere gemessen wird

CommonMark ist die Spezifikation plus `cmark`, ihre Referenzimplementierung in C. Ihr Zweck ist Konformität, nicht Funktionsumfang, und ihre Zurückhaltung ist die Funktion.

| Vorteile | Nachteile |
| --- | --- |
| Jeder unbequeme Fall hat ein nummeriertes Beispiel und eine erwartete Ausgabe | Keine Tabellen, keine Aufgabenlisten, kein Durchgestrichenes und keine nackten Autolinks |
| Hunderte Testfälle, sodass Konformität eine Tatsache und keine Behauptung ist | Eine Tabelle wird als Absatz aus Pipes dargestellt, lautlos |
| Implementierungen gibt es für die meisten Sprachen, und sie zielen auf dieselbe Suite | Absichtlich kein Erweiterungsmechanismus in der Spezifikation selbst |
| Der sicherste Boden, gegen den man schreiben kann | Die meisten echten Dokumente brauchen mindestens eine Erweiterung |

**Preis:** kostenlos, offene Spezifikation; `cmark` ist kostenlos unter einer BSD-2-Clause-Lizenz.

**Technische Details und Funktionen**

- Definiert die Listeneinrückung relativ zur Inhaltsspalte des Elternteils und beendet damit den Streit über Leerzeichen
- Links- und rechtsflankierende Trennzeichenläufe definieren Betonung präzise
- Sieben Arten von HTML-Block, jede mit ausdrücklichen Start- und Endbedingungen
- Harte Zeilenumbrüche sind zwei Leerzeichen am Zeilenende oder ein Backslash am Zeilenende; ein einzelner Zeilenumbruch ist ein Leerzeichen
- Rohes HTML geht standardmäßig durch, was eine Entscheidung der Spezifikation und keine Sicherheitsentscheidung ist
- Zu den Begleitimplementierungen gehört comrak in Rust, und markdown-it und Goldmark zielen auf dieselbe Suite

**Wer sollte es verwenden?** Jeder, der wissen muss, was die Syntax bedeutet, und nicht, was ein Werkzeug tut. Wenn zwei Renderer sich uneinig sind, entscheiden die Beispiele der Spezifikation, welcher den Fehler hat — und danach zu greifen ist häufiger der richtige Schritt, als Leute erwarten.

### GitHub Flavored Markdown — die praktische Voreinstellung

GFM ist CommonMark plus Tabellen, Aufgabenlisten, Durchgestrichenes, Autolinks und den Filter für rohes HTML. Es ist das, als was eine README dargestellt wird, und das, was die meisten Issue-Tracker und Chat-Werkzeuge kopiert haben.

| Vorteile | Nachteile |
| --- | --- |
| Eine geschriebene Spezifikation, nicht bloß das Verhalten eines Renderers | Weiterhin keine Fußnoten, Definitionslisten, Mathematik oder Attribute |
| Deckt die Konstrukte ab, die Dokumente tatsächlich verwenden | Der Tag-Filter wird oft für einen Bereiniger gehalten |
| Weit verbreitet implementiert, eine GFM-Datei reist also meist | GitHubs Website stellt Dinge dar, die die Spezifikation nicht definiert |
| Eine strenge Obermenge von CommonMark, am Kern ändert sich also nichts | Die Regeln für nackte Autolinks sind wählerischer, als sie scheinen |

**Preis:** kostenlos, offene Spezifikation.

**Technische Details und Funktionen**

- Tabellen mit Ausrichtung je Spalte, nur Inline-Inhalt, und eine passende Trennzeile ist Pflicht
- Aufgabenlisten-Elemente werden als `disabled` markierte Checkbox-Eingaben dargestellt
- Durchgestrichenes mit `~~`; GitHub akzeptiert auch eine einzelne Tilde
- Autolinks für nackte URLs und E-Mail-Adressen, mit Regeln für abschließende Satzzeichen und ausgeglichene Klammern
- Neun rohe HTML-Tag-Namen werden maskiert statt durchgelassen
- Fußnoten und `> [!NOTE]`-Hinweise funktionieren auf GitHub und stehen nicht in der Spezifikation

**Wer sollte es verwenden?** Fast jeder, für fast jede geteilte Datei. Wenn ein Dokument auf GitHub, in einer Doku-Seite und als konvertiertes HTML dargestellt werden muss, ist GFM die Schnittmenge, die alle drei verstehen.

### markdown-it — CommonMark zuerst, Erweiterungen auf Anfrage

Ein JavaScript-Parser, der der CommonMark-Spezifikation folgt und ein wenig darauf aufsetzt. Seine eigene Zusammenfassung lautet, es „adds syntax extensions & sugar (URL autolinking, typographer)" (geprüft auf github.com/markdown-it/markdown-it, 8. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Besteht die CommonMark-Suite und liefert ein strenges `commonmark`-Preset | Aufgabenlisten und Fußnoten brauchen Plugins |
| Maskiert rohes HTML standardmäßig, das sichere Verhalten ist also die Voreinstellung | Die Qualität der Plugins schwankt im Ökosystem |
| Regeln lassen sich auf Block- und Inline-Ebene ergänzen, ersetzen oder umordnen | Autolinken ist aus, bis Sie es einschalten |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Drei Presets: `commonmark` für strenge Konformität, `default`, und `zero`, um von nichts aus aufzubauen
- Tabellen und Durchgestrichenes sind im Preset `default` an; `linkify` und `breaks` sind aus
- `html: false` als Voreinstellung — rohes HTML in der Quelle wird maskiert, nicht durchgelassen
- Plugins decken Fußnoten, Container für Hinweisblöcke, Attribute, Anker, Aufgabenlisten und Mathematik ab
- Die Plugin-Oberfläche ist dokumentiert, eine Erweiterung kann also geschrieben statt gefunden werden

**Wer sollte es verwenden?** Teams, die wollen, dass die Spezifikation standardmäßig eingehalten und jede Erweiterung bewusst eingeschaltet wird. Es ist außerdem der Dialekt, den eine große Menge Werkzeuge erbt, darunter die eingebaute Markdown-Vorschau von VS Code.

### marked — GFM, ohne eine Entscheidung zu treffen

Ein kleiner JavaScript-Parser und -Compiler, dessen Standarddialekt schon der ist, den die meisten Leute wollen.

| Vorteile | Nachteile |
| --- | --- |
| GFM ist von Haus aus an: Tabellen, Durchgestrichenes, Aufgabenlisten, Autolinks | Kein nennenswertes Plugin-Ökosystem; Erweiterungen schreiben Sie selbst |
| Eine Funktion, ein Optionsobjekt | Rohes HTML geht durch, so gewollt |
| Läuft im Browser und in Node | Fußnoten, Definitionslisten und Mathematik sind nicht verfügbar |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- `gfm: true` als Voreinstellung; `breaks: false` als Voreinstellung, ein einzelner Zeilenumbruch ist also ein Leerzeichen
- `breaks: true` reproduziert GitHubs Verhalten im Kommentarfeld statt seines README-Verhaltens
- Ein Lexer, den Sie separat aufrufen können, um Tokens statt HTML zu untersuchen
- Eigene Renderer überschreiben, wie jeder Knotentyp ausgegeben wird, und so werden die meisten Erweiterungen umgesetzt
- Kein Bereinigen: die dokumentierte Antwort ist, die Ausgabe durch DOMPurify zu schicken

**Wer sollte es verwenden?** Jeden, dessen Zieldialekt schlichtes GFM ist und der nichts darüber hinaus braucht. Es ist der kürzeste Weg von einer GFM-Datei zu GFM-förmigem HTML, und der Grund, warum sich so viel Software wie GitHub mit falsch gesetztem `breaks` verhält.

### remark und unified — Dialekt als Liste von Plugins

remark parst Markdown in einen abstrakten Syntaxbaum. Der Dialekt ist keine Einstellung; er ist die Menge der Erweiterungen, die Sie der Pipeline hinzugefügt haben.

| Vorteile | Nachteile |
| --- | --- |
| remark-gfm deckt alle fünf GFM-Erweiterungen ab, plus Fußnoten | Die schwerste Option hier, mit weitem Abstand |
| Frontmatter, Mathematik und Direktiven haben jeweils ein erstklassiges Plugin | Die unified-Pipeline erfordert echtes Lernen |
| Rohes HTML wird verworfen, außer Sie erlauben es ausdrücklich | Jede Erweiterung ist eine Abhängigkeit, die aktuell zu halten ist |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- mdast für Markdown, hast für HTML, mit Plugins, um zwischen beiden zu wechseln
- remark-gfm ergänzt Tabellen, Aufgabenlisten, Durchgestrichenes, Autolinks und Fußnoten gemeinsam
- remark-frontmatter parst den YAML-Kopf, statt ihn als Überschrift darzustellen
- remark-directive gibt `:::note`-Container, und so werden die meisten Hinweis-Syntaxen umgesetzt
- Rohes HTML durchzulassen erfordert `allowDangerousHtml`, die unsichere Wahl ist also ausdrücklich

**Wer sollte es verwenden?** Teams, die einen Dialekt brauchen, den niemand ausliefert — GFM plus Fußnoten plus Direktiven plus eine Hausregel über Linktexte — und die bereit sind, ihn zusammenzusetzen und zu verantworten.

### Pandocs Markdown — ein Dialekt mit Schaltpult

Pandoc liest mehrere Markdown-Dialekte und seinen eigenen erweiterten, und jedes Konstrukt ist eine benannte Erweiterung, die Sie einzeln ein- oder ausschalten können.

| Vorteile | Nachteile |
| --- | --- |
| Fußnoten, Definitionslisten, Attribute und Mathematik sind eingebaut | Sein Dialekt ist nicht das, was GitHub darstellt, was Leute überrascht |
| Mehrere Tabellensyntaxen, darunter Gitter-Tabellen mit mehrzeiligen Zellen | Die Erweiterungsnamen sind ein Vokabular zum Lernen |
| Reader- und Writer-Dialekte werden getrennt gewählt | Rohes HTML geht ohne Bereinigen durch |
| `markdown_strict`, `commonmark`, `gfm` und `commonmark_x` sind alle verfügbar | Braucht eine Installation und ein Terminal |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- Dialekte werden über den Namen gewählt: `markdown`, `markdown_strict`, `markdown_phpextra`, `markdown_mmd`, `commonmark`, `commonmark_x`, `gfm`
- Erweiterungen werden mit `+name` und `-name` am Format umgeschaltet, zum Beispiel `gfm+footnotes`
- Attributsyntax `{#id .class key=value}` an Überschriften, Codeblöcken, Links und Bildern
- `tex_math_dollars` für Mathematik, `fenced_divs` für Container im Hinweis-Stil, `definition_lists`, `footnotes`
- Gitter- und mehrzeilige Tabellen tragen Blockinhalt in den Zellen, was Pipe-Tabellen nicht können

**Wer sollte es verwenden?** Jeden, der Dokumente statt Seiten schreibt: etwas mit Fußnoten, Zitaten, Formeln oder einem anderen Ausgabeformat als HTML. Greifen Sie ausdrücklich zu `gfm`, wenn die Datei außerdem auf GitHub dargestellt werden muss, denn Pandocs eigener Dialekt akzeptiert bereitwillig Syntax, die GitHub nicht zeichnen kann.

### Python-Markdown — Erweiterungen als API

Die langjährige Python-Implementierung. Ihr Basisdialekt liegt näher am ursprünglichen Markdown als an CommonMark, und ihre Erweiterungs-API ist das, worauf eine große Menge Dokumentations-Werkzeuge gebaut ist.

| Vorteile | Nachteile |
| --- | --- |
| Offizielle Erweiterungen für Tabellen, Fußnoten, Definitionslisten und Attributlisten | Nicht in jedem Detail CommonMark-konform |
| `md_in_html` parst Markdown innerhalb roher HTML-Blöcke, was die meisten Parser nicht tun | Aufgabenlisten und Durchgestrichenes brauchen Drittanbieter-Erweiterungen |
| Die Erweiterung `admonition` ist die Referenzimplementierung von `!!! note` | Unterschiede zu GFM zeigen sich in Grenzfällen bei Listen und Betonung |

**Preis:** kostenlos, BSD-lizenziert.

**Technische Details und Funktionen**

- Das Bündel `extra` gruppiert Tabellen, Fußnoten, Definitionslisten, Abkürzungen, Attributlisten, eingezäunten Code und `md_in_html`
- `toc` erzeugt Überschriften-ids und ein Inhaltsverzeichnis; `smarty` macht intelligente Zeichensetzung
- `nl2br` verwandelt einzelne Zeilenumbrüche in `<br>`, derselbe Schalter, den andere Werkzeuge `breaks` nennen
- `meta` liest einen Metadaten-Kopf, und MkDocs behandelt YAML-Frontmatter darüber
- Durchgestrichenes, Aufgabenlisten und `$...$`-Mathematik kommen von den PyMdown Extensions eines Drittanbieters

**Wer sollte es verwenden?** Python-Build-Skripte, und alle, die MkDocs erweitern, wo es schon die Maschine ist. Seien Sie bewusst darin, welche Erweiterungen aktiv sind: der Dialekt ist genau die Liste in Ihrer Konfigurationsdatei, und eine Datei, die gegen eine vollständigere Liste geschrieben ist, verliert leise Dinge.

### Goldmark — CommonMark mit einem GFM-Schalter

Ein CommonMark-konformer Parser in Go, und die Maschine in Hugo. Seine Erweiterungen sind Go-Werte, die Sie zusammensetzen, statt Zeichenketten, die Sie konfigurieren.

| Vorteile | Nachteile |
| --- | --- |
| CommonMark-konform, mit einem einzigen `extension.GFM`-Bündel für alle vier GFM-Ergänzungen | Nur Go |
| Definitionslisten, Fußnoten und Typographer sind mit an Bord | Weniger fertige Erweiterungen als im JavaScript-Ökosystem |
| Attribut- und Passthrough-Verhalten ist ausdrücklich statt stillschweigend | Manche Dialektentscheidungen erreichen Sie über Hugos Konfiguration, nicht über Goldmarks |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- `extension.GFM` bündelt Table, Strikethrough, Linkify und TaskList (geprüft auf github.com/yuin/goldmark, 8. September 2026)
- `extension.DefinitionList` und `extension.Footnote` setzen die Syntaxen von PHP Markdown Extra um
- `html.WithHardWraps()` stellt einen Zeilenumbruch als `<br>` dar, dieselbe Option unter einem dritten Namen
- `html.WithUnsafe()` ist erforderlich, bevor rohes HTML durchgeht, Maskieren ist also die Voreinstellung
- Hugo legt Render-Hooks und seine eigene Konfiguration darüber, und dort leben die meisten Hugo-Dialektfragen tatsächlich

**Wer sollte es verwenden?** Go-Programme, und Hugo-Nutzer, die herausfinden, warum ein Konstrukt auf GitHub und nicht auf ihrer Seite dargestellt wird. Die Antwort ist meist eine Erweiterung, die verfügbar und nicht eingeschaltet ist.

### kramdown — eine Obermenge, kein Dialekt von CommonMark

Ein Konverter für eine Markdown-Obermenge in reinem Ruby, und Jekylls Standardmaschine. Er hat für mehrere Dinge eine eigene Syntax, die die anderen Werkzeuge anders machen, was innerhalb von Jekyll ein echter Vorteil und außerhalb ein echtes Problem ist.

| Vorteile | Nachteile |
| --- | --- |
| Inline-Attributlisten — `{: .warning}` — an fast jedem Block | Nicht CommonMark-konform, und behauptet es auch nicht |
| Definitionslisten, Fußnoten, Abkürzungen und Mathematik eingebaut | Keine Aufgabenlisten und kein Durchgestrichenes in der Kernsyntax |
| Tabellen unterstützen eine Kopf- und eine Fußtrennzeile | Die eigene Syntax übersteht es nicht, von einem anderen Werkzeug gelesen zu werden |
| Schon installiert, wenn Sie Jekyll oder GitHub Pages verwenden | Die Behandlung von Zeilenumbrüchen ist konfigurierbar und nicht CommonMarks Voreinstellung |

**Preis:** kostenlos, MIT-lizenziert (geprüft auf github.com/gettalong/kramdown, 8. September 2026).

**Technische Details und Funktionen**

- In Ruby geschrieben, ohne verpflichtende Abhängigkeiten für den Markdown-Parser
- Inline-Attributlisten setzen ids, Klassen und beliebige Attribute, ohne auf HTML herabzusteigen
- `$$...$$`-Mathematik, Fußnoten und Abkürzungsdefinitionen sind Kernsyntax statt Plugins
- Ein separater GFM-Parser ist verfügbar und ist das, was GitHub Pages verwendet, was nicht dasselbe ist wie kramdowns eigener Dialekt
- Konvertiert nach HTML, nach LaTeX und zurück nach kramdown

**Wer sollte es verwenden?** Jekyll-Seiten, und nur für Inhalte, die darin bleiben. Wenn eine in kramdown geschriebene Seite irgendwo anders gelesen werden muss, werden aus ihren Attributlisten sichtbare geschweifte Klammern.

### MDX — eine andere Sprache mit vertrauter Oberfläche

MDX setzt JSX-Komponenten in Markdown. Es wird zu einer Komponente kompiliert statt zu HTML dargestellt, und es ist auf remark gebaut, die Markdown-Hälfte ist also remarks Dialekt.

| Vorteile | Nachteile |
| --- | --- |
| Eine React-Komponente mitten in einem Dokument, mit Props | Kein Markdown: kein reines Markdown-Werkzeug kann es lesen |
| Die Markdown-Hälfte ist CommonMark plus die remark-Plugins, die Sie ergänzen | Braucht einen Build-Schritt und ein JavaScript-Framework |
| Treibt Dokumentationsseiten an, auf denen Prosa und interaktive Beispiele sich mischen | Ein verirrtes `<` oder `{` in der Prosa wird zum Syntaxfehler |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Kompiliert zu JavaScript, die Ausgabe ist also eine Komponente und keine HTML-Datei
- Verwendet remark für Markdown und kann remark-gfm und den übrigen Plugin-Satz aufnehmen
- Geschweifte Klammern sind Ausdrücke, ein wörtliches `{` in der Prosa muss also maskiert werden
- Frontmatter braucht ein Plugin, wie überall sonst auch

**Wer sollte es verwenden?** Dokumentationsseiten, die lebende Beispiele in der Prosa brauchen, und niemand, der die Datei portabel braucht. Eine MDX-Datei ist Quellcode, der einem Dokument gleicht.

## Funktionen gegen Implementierungen

Lesen Sie die Spalte eines Werkzeugs nach unten und die Zeile einer Funktion nach rechts. „Plugin" heißt verfügbar und nicht eingebaut; „Erweiterung" heißt mit dem Projekt ausgeliefert, aber aus, bis sie eingeschaltet wird; „Option" heißt ein Wahrheitswert irgendwo in der Konfiguration.

| Funktion | CommonMark | GFM | markdown-it | marked | remark | Pandoc | Python-Markdown | Goldmark | kramdown |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tabellen | Nein | Ja | Standardmäßig an | Standardmäßig an | remark-gfm | Eingebaut, mehrere Syntaxen | Erweiterung `tables` | `extension.Table` | Eingebaut |
| Aufgabenlisten-Elemente | Nein | Ja | Plugin | Standardmäßig an | remark-gfm | Erweiterung `task_lists` | Drittanbieter-Erweiterung | `extension.TaskList` | Nein |
| Durchgestrichenes | Nein | Ja | Standardmäßig an | Standardmäßig an | remark-gfm | Erweiterung `strikeout` | Drittanbieter-Erweiterung | `extension.Strikethrough` | Nein |
| Autolinks für nackte URLs | Nein | Ja | Option `linkify` | Standardmäßig an | remark-gfm | `autolink_bare_uris` | Drittanbieter-Erweiterung | `extension.Linkify` | Nein |
| Rohes HTML, Voreinstellung | Durchgelassen | Neun Tags maskiert | Maskiert | Durchgelassen | Verworfen, außer erlaubt | Durchgelassen | Durchgelassen | Maskiert, außer unsafe | Durchgelassen |
| Fußnoten | Nein | Nicht in der Spezifikation; GitHub stellt sie dar | Plugin | Nein | remark-gfm | Erweiterung `footnotes` | Erweiterung `footnotes` | `extension.Footnote` | Eingebaut |
| Definitionslisten | Nein | Nein | Plugin | Nein | Plugin | `definition_lists` | Erweiterung `def_list` | `extension.DefinitionList` | Eingebaut |
| Attributlisten | Nein | Nein | Plugin | Nein | Plugin | Eingebaut | Erweiterung `attr_list` | Drittanbieter | Eingebaut |
| Mathematik | Nein | Nein | Plugin | Nein | remark-math | `tex_math_dollars` | Drittanbieter-Erweiterung | Passthrough oder Drittanbieter | Eingebaut |
| Hinweis-Container | Nein | Nein | Plugin | Nein | remark-directive | `fenced_divs` | Erweiterung `admonition` | Drittanbieter | Attributlisten |
| Frontmatter | Nein | Nein | Plugin | Nein | remark-frontmatter | Eingebaut für das eigene Format | Erweiterung `meta` | Von Hugo behandelt | Von Jekyll behandelt |
| Überschriften-ids | Nein | Von GitHub beim Darstellen ergänzt | Plugin | Erweiterung | Plugin | Eingebaut | Erweiterung `toc` | Drittanbieter | Eingebaut |
| Zeilenumbruch als `<br>` | Nein | Nein | Option `breaks` | Option `breaks` | remark-breaks | `hard_line_breaks` | Erweiterung `nl2br` | `WithHardWraps` | Option |

Zwei Muster in dieser Tabelle sind mehr wert als die einzelnen Zellen. Das erste ist, dass die JavaScript-Werkzeuge sich am meisten über Voreinstellungen uneinig sind, nicht über Fähigkeiten: markdown-it und marked können beide eine GFM-Datei darstellen, aber von Haus aus maskiert das eine Ihr rohes HTML und das andere nicht. Das zweite ist, dass die Werkzeuge mit der reichsten Syntax — Pandoc, Python-Markdown, kramdown — jene sind, deren Dateien am schlechtesten reisen, denn der Reichtum liegt vollständig in Erweiterungen, die nichts anderes umsetzt.

## Wie Sie erkennen, welchen Dialekt ein Werkzeug spricht

Lesen Sie nicht die Dokumentation. Halten Sie eine Sondendatei bereit, fügen Sie sie ein, und lesen Sie, was zurückkommt.

```markdown
| Funktion | Wird dargestellt |
| --- | --- |
| Tabellen | ja? |

- [x] eine Checkbox
- [ ] oder wörtliche Klammern

~~Durchgestrichen~~ und eine nackte URL: https://example.com

Begriff
: Eine Definition, oder ein Absatz, der mit einem Doppelpunkt beginnt.

Ein Fußnotenverweis.[^1]

Überschrift mit einem Attribut
{: .probe}

Zeile eins
Zeile zwei

[^1]: Nur manche Werkzeuge stellen das dar.
```

Neun Antworten aus einem Einfügen, in der Reihenfolge, die zählt. Eine gezeichnete Tabelle, Checkboxen, durchgestrichener Text und ein lebender Link decken die vier GFM-Syntaxerweiterungen ab — erscheinen alle vier, haben Sie mindestens GFM. Eine eingerückte Definition bedeutet, dass das Werkzeug über GFM hinaus in das Gebiet von PHP Markdown Extra geht. Eine dargestellte Fußnote bedeutet dasselbe. Sichtbare `{: .probe}`-Klammern bedeuten keine Attributlisten, und das sind die meisten Werkzeuge. Und wenn „Zeile zwei" auf einer eigenen Zeile sitzt, ist `breaks` eingeschaltet, was zu wissen sich lohnt, bevor Sie zehn Seiten gegen die falsche Annahme schreiben.

Fügen Sie ein `$x^2$` und eine `> [!NOTE]`-Zeile hinzu, wenn Sie sich für Mathematik oder Hinweisblöcke interessieren. Der Sinn der Datei ist, dass sie zehn Sekunden dauert und einen Nachmittag des Ratens ersetzt.

## Wo GFM — die naheliegende Wahl — scheitert, und was das kostet

GFM ist die richtige Voreinstellung, und es lohnt sich, ehrlich zu sein über die vier Stellen, an denen es ausgeht.

**Es hat keine Fußnoten, und Sie damit auch nicht.** GitHub stellt Fußnoten dar, also schreiben Leute sie, und sie stehen nicht in der Spezifikation. Ein GFM-Parser, der `[^1]` ignoriert, ist konform. Wenn Ihr Dokument wirklich Fußnoten braucht, haben Sie GFM verlassen, ob Sie es wollten oder nicht, und der Preis ist, dass Ihre Datei jetzt von der Erweiterungsliste eines bestimmten Werkzeugs abhängt statt von einer Spezifikation — [welche Werkzeuge Fußnotensyntax darstellen und welche die Klammern ausgeben](/blog/markdown-footnotes-support) ist die Liste, die zu prüfen ist, bevor Sie hundert Anmerkungen schreiben.

**Es hat keine Attribute, Gestaltung bedeutet also rohes HTML.** In GFM gibt es keine Möglichkeit, einem Absatz eine Klasse zu geben. Entweder steigen Sie auf ein `<div>` herab — was Sie dem ausliefert, was der Renderer mit rohem HTML macht, und dem Tag-Filter, wenn es ein GFM-Renderer ist — oder Sie nehmen die Standardgestaltung hin. Pandoc und kramdown haben das vor Jahren gelöst, und ihre Lösungen reisen nicht.

**Der Tag-Filter ist keine Sicherheit.** Neun maskierte Tag-Namen sind eine Liste, keine Richtlinie. Wer fremdes Markdown konvertiert und meint, GFM-Konformität decke ihn ab, ist ein `<img onerror=>` davon entfernt, das Gegenteil zu erfahren. Bereinigen passiert nach dem Parsen, gegen eine Positivliste, und es ist eine von der Dialektwahl getrennte Aufgabe.

**Die breaks-Frage hat keine richtige Antwort.** GitHubs Kommentarfelder machen aus einem einzelnen Zeilenumbruch ein `<br>`; die Spezifikation sagt, ein einzelner Zeilenumbruch ist ein Leerzeichen; die README-Darstellung folgt der Spezifikation. Derselbe Text kann also auf derselben Website zweierlei dargestellt werden, und jedes Werkzeug weiter unten muss sich für eines entscheiden. TransformPipe konvertiert mit GFM an und `breaks` aus, was der Spezifikation und der README-Darstellung entspricht und nicht dem Kommentarfeld, denn ein Dokument ist einer README näher als einem Kommentar. Was ein Werkzeug auch wählt, irgendjemandes Absätze kommen falsch heraus, und es ist das am häufigsten gemeldete Dialektproblem überhaupt.

Der Preis aller vier zusammen ist, dass „GFM" Ihnen sagt, was dargestellt wird, und nicht, was richtig aussehen wird. Es ist ein Boden, kein Abschluss.

## Wie Sie einen Dialekt wählen

1. **Schreiben Sie für den strengsten Leser in der Kette.** Wenn eine Datei auf GitHub, in einer Doku-Seite und als konvertiertes HTML dargestellt werden muss, verwenden Sie nur, was alle drei unterstützen, denn der schwächste Parser entscheidet, was der Leser sieht, und er warnt Sie nicht.
2. **Wählen Sie den Dialekt vor dem Werkzeug, nicht danach.** Zu entscheiden, dass Sie Fußnoten und Mathematik brauchen, sagt Ihnen, Pandoc zu installieren; zu entscheiden, dass eine README dargestellt werden muss, sagt Ihnen, dass GFM genügt. Umgekehrt entdeckt man die Grenze mitten im Dokument.
3. **Halten Sie jede Erweiterung nahe an dem Werkzeug, dem sie gehört.** Frontmatter gehört in ein Repository, das ein Generator liest, nicht in eine Datei, die Sie einem Konverter geben, der ihn als Überschrift darstellt. Eine Attributliste gehört in die Jekyll-Seite, nicht in die Datei, die Sie mailen.
4. **Behandeln Sie Voreinstellungen als Teil des Dialekts.** Zwei Bibliotheken können beide GFM behaupten und sich bei rohem HTML, beim Autolinken und bei Zeilenumbrüchen unterscheiden, und das sind drei Gelegenheiten, dass eine Datei anders dargestellt wird, ohne dass jemand ein Wort geändert hat.
5. **Konvertieren Sie eine repräsentative Datei, bevor Sie sich festlegen.** Keine Hello-World-Datei: die mit der Tabelle, der Checkliste, der langen URL in Klammern und der Fußnote. Zehn Sekunden Sondieren schlagen eine Neuschreibung, und es ist der einzige Weg, einen lautlosen Fehlschlag zu sehen, solange er noch billig ist.

## Fazit

CommonMark ist der Kern, GFM ist der Kern plus fünf benannte Erweiterungen, und alles andere, was Sie je in eine `.md`-Datei getippt haben, ist irgendjemandes Erweiterung, die am Rand seines Werkzeugs endet. Das ist die ganze Karte, und sie genügt, um fast jeden Darstellungsunterschied vorherzusagen, dem Sie begegnen werden. Schreiben Sie standardmäßig GFM, greifen Sie zu Pandoc, wenn das Dokument Fußnoten oder Formeln braucht, halten Sie Frontmatter und Attributlisten in den Projekten, die sie verstehen, und sondieren Sie, bevor Sie sich festlegen. Wenn GFM der Ort ist, an dem Sie landen, zeigt Ihnen [die Konvertierung nach HTML](/) im Browser genau, was aus jedem Konstrukt geworden ist — der HTML-Quelltext steht direkt neben der Vorschau, Sie können die Tabelle also prüfen, statt auf sie zu hoffen.

## FAQ

### Was ist der Unterschied zwischen CommonMark und GFM?

GFM ist die CommonMark-Spezifikation plus fünf benannte Erweiterungen: Tabellen, Aufgabenlisten-Elemente, Durchgestrichenes, Autolinks für nackte URLs und ein Filter, der neun rohe HTML-Tag-Namen maskiert. Die Kern-Parsing-Regeln sind identisch, denn GFM ist als strenge Obermenge definiert. Alles andere, was sich zwischen zwei Renderern unterscheidet, ist kein Unterschied zwischen CommonMark und GFM — es ist eine Erweiterung, die der eine hat und der andere nicht.

### Ist GFM eine Obermenge von CommonMark?

Ja, und die Spezifikation sagt das ausdrücklich. Jedes gültige CommonMark-Dokument ist ein gültiges GFM-Dokument, das gleich dargestellt wird, mit der einzigen Ausnahme der neun gefilterten rohen HTML-Tags, die GFM maskiert und CommonMark durchlässt. Deshalb ist reines CommonMark zu schreiben der sicherste Weg, eine Datei portabel zu machen.

### Unterstützt CommonMark Tabellen?

Nein. Tabellen stehen nicht in der CommonMark-Spezifikation, und ein streng konformer Parser stellt eine Pipe-Tabelle als gewöhnlichen Absatz dar, der Pipe-Zeichen enthält. Der Fehlschlag ist lautlos, wenn eine Tabelle also als Text herauskam, tut Ihr Parser wahrscheinlich genau das, was ihm gesagt wurde. Tabellen kommen mit GFM oder mit einer werkzeugspezifischen Erweiterung.

### Sind Fußnoten Teil von GitHub Flavored Markdown?

Nicht in der Spezifikation, obwohl GitHubs eigene Website sie darstellt. Fußnoten sind eine Erweiterung, die Pandoc, remark-gfm, Python-Markdown, Goldmark und kramdown alle auf kompatibel aussehende Weise umsetzen und die ein reiner GFM-Parser ignorieren darf. Wenn Ihr Dokument sie braucht, wählen Sie ein Werkzeug nach dieser Anforderung und nicht nach GFM-Konformität.

### Warum wird mein Markdown auf GitHub und in meinem Konverter unterschiedlich dargestellt?

Drei übliche Ursachen, nach Wahrscheinlichkeit geordnet. Die Zeilenumbruch-Einstellung: GitHubs Kommentarfelder behandeln einen einzelnen Zeilenumbruch als `<br>`, die Spezifikation nicht. Eine Erweiterung: Fußnoten, Frontmatter, Hinweise und Mathematik werden alle auf GitHub oder in einem Generator dargestellt und stehen in keiner der beiden Spezifikationen. Oder ein Konstrukt, das nicht ganz gültig ist — eine Tabelle etwa, deren Trennzeile die falsche Zahl von Zellen hat — von dem sich GitHub und Ihr Konverter unterschiedlich erholen können.

### In welchem Markdown-Dialekt sollte ich schreiben?

GFM, außer etwas zwingt Sie davon weg. Es ist spezifiziert, weit verbreitet implementiert, und es deckt Tabellen, Checklisten und Durchgestrichenes ab, und das ist das meiste, was ein echtes Dokument verwendet. Wechseln Sie zu Pandocs Dialekt, wenn Sie Fußnoten, Definitionslisten oder Formeln brauchen, und nehmen Sie hin, dass die Datei dann an Pandoc gebunden ist.

### Was macht ein Markdown-Konverter mit YAML-Frontmatter?

Das hängt vollständig davon ab, ob das Werkzeug davon gehört hat, denn Frontmatter steht in keiner der beiden Spezifikationen. Ein Generator entfernt es und liest es als Metadaten; ein reiner Konverter stellt es als Inhalt dar, was eine horizontale Linie erzeugt, gefolgt von Ihren Metadaten als Setext-Überschrift. Wenn Sie Dateien an einen Konverter geben, entfernen Sie entweder den Kopf vorher oder wählen Sie ein Werkzeug mit einer Frontmatter-Option.
