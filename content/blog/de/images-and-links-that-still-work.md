---
title: "Bilder und Links, die noch funktionieren, nachdem Sie die Datei verschickt haben"
description: "Relative Pfade, GitHub-Raw-URLs, Data-URIs, Alt-Text, SVG und Überschriften-Anker: warum ein Bild oder Link bricht, wenn die Datei umzieht, und wie Sie es beheben"
updated: 2026-09-09
date: 2026-08-01
tag: Syntax
keywords: markdown bild, markdown bild wird nicht angezeigt, markdown relativer link, markdown anker link, markdown link auf überschrift, markdown bild base64, eigenständiges html, html in einer datei, markdown bildgröße, markdown alt text, github raw bild url, markdown svg bild, markdown links prüfen
---

Eine Markdown-Datei wird in einem Ordner geschrieben, und die Hälfte von ihr hängt still von diesem Ordner ab. `![Flow](img/flow.png)` sieht im Editor richtig aus, sieht im Repository richtig aus, und zeigt ein Symbol für ein kaputtes Bild, sobald ein Kollege das konvertierte HTML aus seinem Downloads-Ordner öffnet. Nichts in der Datei hat sich geändert. Ihre Nachbarn haben sich geändert.

### Kurzfassung

Bilder und Querverweise werden gegen den Ort aufgelöst, an dem die dargestellte Seite landet, nicht gegen den Ordner, in dem Sie geschrieben haben — die Datei zu verschieben verschiebt also die Antwort. Absolute öffentliche URLs und Data-URIs überstehen die Reise; relative und wurzelrelative Pfade überstehen sie nur, wenn der Ordner oder die Website mitreist. Überschriften-Anker brechen aus einem anderen Grund — GitHub, Pandoc, markdown-it und marked machen aus einer Überschrift jeweils anders eine ID, ein Link, der im Repository funktioniert, kann im Export also daneben zeigen. Konvertieren Sie einmal, lesen Sie die `src`- und `href`-Werte, die der Konverter tatsächlich erzeugt hat, und beheben Sie die, die nur von Ihrem eigenen Schreibtisch aus auflösen.

Der Fehler hat eine Signatur: der Autor sieht ihn nie. Auf dem Rechner, auf dem das Dokument geschrieben wurde, löst jeder Pfad auf, denn dieser Rechner ist der, für den die Pfade geschrieben wurden. Der Leser bekommt graue Kästen mit Symbolen mit eingerissener Ecke, hält das Dokument für halb fertig und sagt meist nichts dazu.

Zwei getrennte Systeme sind beteiligt, und sie scheitern aus Gründen, die nichts miteinander zu tun haben. Ein Bild ist ein Verweis auf Bytes, die irgendwo anders liegen, und es bricht, wenn dieses Irgendwo-anders umzieht. Ein Anker ist ein Verweis auf eine ID, die der Renderer beim Konvertieren erfunden hat, und er bricht, wenn ein anderer Renderer eine andere ID erfindet. Beide sind Versprechen über einen Ort, und beide werden in dem Moment geprüft, in dem jemand anderes die Datei öffnet — was der schlechtestmögliche Moment ist, um es zu erfahren.

## Die drei Arten von Pfad, und was jede übersteht

Eine URL in Markdown kommt in einigen Formen, und jede nimmt etwas anderes darüber an, wo das Dokument landet.

| Geschrieben als | Art | Aufgelöst gegen | Übersteht das Verschicken? |
| --- | --- | --- | --- |
| `img/flow.png` | relativ | den Ordner, aus dem die Seite ausgeliefert wird | nur wenn dieser Ordner mitreist |
| `../assets/flow.png` | relativ | den Ordner darüber | dasselbe, und eine Stufe fragiler |
| `/assets/flow.png` | wurzelrelativ | die Wurzel der aktuellen Website | nur innerhalb derselben Website |
| `https://example.com/flow.png` | absolut | nichts, sie ist schon vollständig | ja, solange der Host sie ausliefert |
| `data:image/png;base64,…` | keine — die Bytes sind hier | überhaupt nichts | ja, zum Preis der Größe |

Das Detail, das Leute erwischt: ein relativer Markdown-Link löst gegen die URL der *dargestellten Seite* auf, nicht gegen den Ordner, in dem die `.md`-Datei lag. Konvertieren Sie `docs/guide.md`, öffnen Sie das HTML von Ihrem Desktop, und `img/flow.png` bedeutet jetzt einen Ordner `img` auf Ihrem Desktop. Der Pfad war nie falsch; er beantwortete eine Frage, die niemand mehr stellt.

Wurzelrelativ ist die Form, die am häufigsten falsch eingeschätzt wird. Ein führender Schrägstrich bedeutet nicht „die Spitze meines Projekts“ — er bedeutet die Wurzel des Ursprungs, der die Seite gerade ausliefert. Stellen Sie dieselbe Datei auf eine Website, deren Assets unter `/assets/` liegen, und es ist die stabilste der relativen Formen. Öffnen Sie sie als lokale Datei, und der Browser liest den Schrägstrich als Wurzel der Festplatte: `/assets/flow.png` wird unter Windows zu `C:\assets\flow.png` und auf einem Mac zu `/assets/flow.png`, und keines von beiden existiert. Wurzelrelative Pfade sind für Websites gemacht. Für eine Datei, die jemand herunterlädt, sind sie aktiv schlechter als einfache relative Pfade.

Absolute URLs überstehen alles außer dem Host. Sie sind die einzige Form, die in einem Repository, einem Export, einem Wiki und einer E-Mail gleich funktioniert — vorausgesetzt, der Host ist öffentlich, bleibt erreichbar und hat nichts dagegen, von anderswo verlinkt zu werden. Dieser letzte Nebensatz leistet mehr Arbeit, als er aussieht: Bilder aus einem privaten Bucket, aus dem CDN eines Chat-Werkzeugs, aus einem Confluence-Anhang oder hinter einer signierten URL geben alle eine absolut aussehende Adresse zurück, die nur funktioniert, solange der Leser Ihre Sitzung mit sich trägt oder solange die Signatur nicht abgelaufen ist.

### Wo die Datei landet, und welche Pfade dann noch auflösen

Dasselbe Dokument geht im Laufe seines Lebens an fünf Orte. Hier ist, was mit jeder Art von Pfad an jeder Station passiert.

| Ziel | `img/flow.png` | `../assets/flow.png` | `/assets/flow.png` | `https://…/flow.png` | Data-URI |
| --- | --- | --- | --- | --- | --- |
| Die `.md`-Datei, dargestellt auf einer Repository-Seite | funktioniert | funktioniert, wenn der übergeordnete Ordner im Repository liegt | scheitert — löst gegen die Wurzel des Code-Hosts auf | funktioniert | funktioniert |
| Eine konvertierte HTML-Datei in jemandes Downloads | scheitert, außer Sie haben `img/` mitkopiert | scheitert | zeigt auf die Wurzel seiner Festplatte | funktioniert, mit Verbindung | funktioniert |
| Ein E-Mail-Text | scheitert | scheitert | scheitert | nur wenn das Programm zustimmt, entfernte Bilder zu holen | funktioniert |
| Eine statische Website mit den Assets daneben ausgeliefert | funktioniert | funktioniert, bis Sie die Seite verschieben | funktioniert | funktioniert | funktioniert |
| Ein aus dem Browser gedrucktes PDF | eingebacken nur, wenn er zur Druckzeit aufgelöst hat | dasselbe | dasselbe | dasselbe | funktioniert |
| In ein Wiki oder ein Ticket eingefügt | scheitert | scheitert | scheitert | funktioniert, wenn der Host öffentlich ist | meist vom Bereiniger des Wikis entfernt |

Die PDF-Zeile ist die, die einen langen Blick wert ist. Drucken behebt keinen kaputten Pfad, es fotografiert ihn: was der Browser in diesem Moment hatte, ist das, was in der Datei landet — ein auf dem Rechner des Autors gedrucktes Dokument sieht also perfekt aus, und ein vom Empfänger gedrucktes hat Löcher an genau denselben Stellen, an denen sein Bildschirm sie hatte. Wenn ein PDF das Ziel ist, bringen Sie zuerst die Bilder in Ordnung: Drucken setzt voraus, dass die Seite bereits darstellt.

### GitHub: eine Blob-URL ist eine Seite, kein Bild

Öffnen Sie ein Bild in einem Repository, kopieren Sie, was in der Adresszeile steht, und Sie bekommen etwas wie `https://github.com/acme/docs/blob/main/assets/flow.png`. Fügen Sie das in `![Flow](…)` ein, und der Leser bekommt ein kaputtes Bild, denn diese URL gibt kein PNG zurück. Sie gibt eine HTML-Seite zurück — den Dateibetrachter, mit der Kopfleiste, dem Brotkrumenpfad, der Seitenleiste und dem Bild darin. Der Browser hat um ein Bild gebeten und eine Webseite bekommen, also hat er das Symbol für ein kaputtes Bild gezeichnet.

| URL-Form | Was der Server zurückgibt | Nutzbar in `![]()`? |
| --- | --- | --- |
| `https://github.com/o/r/blob/main/a/flow.png` | eine HTML-Seite, die das Bild anzeigt | nein |
| `https://github.com/o/r/blob/main/a/flow.png?raw=true` | eine Weiterleitung auf die Dateibytes | ja |
| `https://raw.githubusercontent.com/o/r/main/a/flow.png` | die Dateibytes | ja |
| `assets/flow.png`, relativ, innerhalb einer `.md` im Repository | gegen den eigenen Ordner der Datei aufgelöst | ja, auf der Repository-Seite |

GitHubs eigene Empfehlung lautet, für Bilder, die im Repository liegen, relative Links zu bevorzugen, und es nennt `../blob/main/assets/images/electrocat.png?raw=true` als die Form, die man innerhalb von Issues, Pull Requests und Kommentaren verwenden soll — mit dem Hinweis, dass diese Formen in einem privaten Repository nur für einen Betrachter funktionieren, der bereits Leserechte darauf hat (geprüft auf docs.github.com, 9. September 2026).

Zwei weitere Fallen leben in diesen URLs. Der Name des Zweigs ist Teil der Adresse, `…/blob/main/…` folgt also `main` und bewegt sich, wenn `main` sich bewegt, während `…/blob/a1b2c3d/…` auf einen Commit festgenagelt ist und sich nie ändert — wählen Sie absichtlich, denn ein Diagramm, das sich lautlos aktualisiert, ist entweder genau das, was Sie wollten, oder ein Dokument, das ein Bild zitiert, das nicht mehr zu seiner Prosa passt. Und eine Raw-URL aus einem privaten Repository ist keine öffentliche URL; sie braucht die Sitzung des Lesers auf dieselbe Weise wie ein Chat-Anhang, weshalb ein aus Slack eingefügter Screenshot für Sie darstellt und für niemanden sonst.

## Warum ein Markdown-Bild nicht angezeigt wird

Wenn ein Markdown-Bild nicht erscheint, ist die Ursache fast immer eine von diesen.

- **Der Pfad zeigt auf den alten Ort.** Verschieben Sie die Datei, verschieben Sie die Bilder, oder wechseln Sie zu absoluten URLs.
- **Die Groß- und Kleinschreibung passt nicht.** `Diagram.PNG` und `diagram.png` sind eine Datei auf einer Mac- oder Windows-Festplatte, die die Schreibung standardmäßig ignoriert, und zwei Dateien auf der Linux-Maschine, die Ihre Website ausliefert.
- **Im Dateinamen ist ein Leerzeichen.** Fassen Sie das Ziel in spitze Klammern, `![Flow](<my diagram.png>)`, oder kodieren Sie es prozentweise als `my%20diagram.png`.
- **Das Bild liegt hinter einer Anmeldung.** URLs, die aus einem Chat-Werkzeug, einem privaten Repository oder einem Wiki eingefügt wurden, brauchen meist die Sitzung des Lesers; ein Fremder bekommt nichts.
- **Sie haben eine Seite statt einer Datei verlinkt.** Der Blob-URL-Fall von oben, und derselbe Fehler passiert mit Cloud-Laufwerken, die eine Betrachter-URL statt der Bytes herausgeben.
- **Die Seite ist HTTPS und das Bild ist HTTP.** Browser blockieren gemischte Inhalte, lautlos, und die Konsole ist der einzige Ort, an dem davon die Rede ist.
- **Ein Bereiniger hat das Tag entfernt.** Eine Positivliste, die `img` erlaubt, kann eine `data:`-Quelle oder ein `svg`-Element trotzdem ablehnen, und was sie ablehnt, löscht sie.
- **Das Tag war nie ein Tag.** Ein maskiertes `\!`, ein Bild in einem eingezäunten Codeblock oder ein verirrter Backtick, und der Renderer hat Text ausgegeben, der wie ein Bild-Tag aussieht, weil er eines ist.

Der schnellste Weg, das auseinanderzuhalten, ist, mit dem Raten aufzuhören und den Browser zu fragen. Seite öffnen, Netzwerk-Tab öffnen, neu laden, und den Statuscode für das Bild lesen, das gescheitert ist.

| Was Sie sehen | Was der Netzwerk-Tab sagt | Bedeutet meist |
| --- | --- | --- |
| Kaputtes Symbol, Alt-Text sichtbar | 404 | der Pfad ist falsch für den Ort, von dem die Seite ausgeliefert wird |
| Kaputtes Symbol | 403 | privates Repository, abgelaufene signierte URL oder Hotlink-Schutz |
| Kaputtes Symbol | 200 mit `text/html` | Sie haben eine Seite verlinkt, keine Datei |
| Nichts, überhaupt keine Anfrage | kein Eintrag | maskiert, wegbereinigt oder in einem eingezäunten Codeblock |
| Für Sie in Ordnung, für die anderen kaputt | 200 für Sie | das Bild liegt hinter Ihrer Sitzung |

Diese Tabelle ist auch der Grund, die *konvertierte* Datei zu prüfen statt der Vorschau im Editor. Eine Vorschau löst Pfade gegen den Ordner auf, in dem die Quelle liegt, und genau diese Annahme hört in dem Moment auf zu gelten, in dem das Dokument reist.

## Data-URIs, und die Arithmetik dahinter

Ein Data-URI legt die Bytes in das Dokument: ein Markdown-Bild in base64 ist ein gewöhnliches Bild mit der kodierten Datei an der Stelle, an der der Pfad stünde.

```markdown
![Company logo](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...)
```

Der ehrliche Kompromiss: base64 kodiert drei Bytes als vier Zeichen, das Bild wächst also um etwa ein Drittel, bevor Sie den Rest des Dokuments zählen. Ein 2-MB-Screenshot kommt als etwa 2,7 MB Text mitten in Ihrer Prosa an, unmöglich zu diffen, und mit jeder Kopie erneut verschickt. Browser können ihn auch nicht getrennt zwischenspeichern.

Rechnen Sie, bevor Sie entscheiden, denn der Faktor ist fest und die Zahlen werden schnell unangenehm. Base64 liest drei Bytes und schreibt vier Zeichen, 4/3 ist also die Untergrenze — etwa 33 % Zuwachs — und die Auffüllung plus ein etwaiger Zeilenumbruch drücken es ein wenig darüber.

| Das Bild auf der Festplatte | Als base64 kodiert | Was das in der Praxis bedeutet |
| --- | --- | --- |
| 12-KB-Symbol | etwa 16 KB | gratis; Dutzende einbetten, ohne es zu merken |
| 120-KB-Diagramm | etwa 160 KB | bequem |
| 800-KB-Screenshot | etwa 1,1 MB | drei davon beherrschen das Dokument |
| 2-MB-Foto | etwa 2,7 MB | ein Bild ist jetzt der größte Teil der Datei |
| 4-MB-Foto | etwa 5,4 MB | schon allein jenseits der meisten sinnvollen Grenzen |

Diese Grenzen sind real und nicht theoretisch. Der Konverter hinter dieser Website begrenzt eine einzelne Konvertierung auf 10 MB und ein in einem Konto aufbewahrtes Dokument auf 4 MB, weil die Vercel-Funktion darunter jeden Anfrage- oder Antwortkörper über 4,5 MB mit einem 413 ablehnt (geprüft auf vercel.com, 9. September 2026). Jede Hosting-Konstellation hat irgendwo eine solche Zahl, und base64 ist der schnellste Weg, sie zu finden.

Die anderen Kosten werden nicht in Bytes gemessen. Ein eingebettetes Bild kann nicht getrennt zwischengespeichert werden, ein Leser, der das Dokument zweimal öffnet, lädt es also zweimal herunter. Es kann nicht gediffed werden: ändern Sie ein Pixel, und die Versionsverwaltung verzeichnet eine tausendzeilige Änderung ohne lesbaren Inhalt. Es kann nicht ersetzt werden, ohne die Prosa-Datei zu bearbeiten. Und jede Weiterleitung, jede Antwort, jede Kopie trägt das Ganze erneut mit sich.

Das macht Data-URIs für eine schmale Menge von Fällen richtig: ein Symbol, ein Logo, ein kleines Diagramm, eine Signatur, ein Schaubild in einem Dokument, das allein reisen und vollständig ankommen muss. Für Screenshot-lastige Dokumente hosten Sie die Bilder und verwenden absolute URLs — oder akzeptieren, dass das Dokument jetzt eine 15-MB-Datei ist, und verschicken es absichtlich statt aus Versehen.

Der Tausch lohnt sich trotzdem öfter, als Leute erwarten, denn was Sie dafür bekommen, ist eine Datei ohne Abhängigkeiten. [Was „eigenständig“ eigentlich verspricht](/blog/self-contained-html-explained), ist eine Seite, deren Stile schon in ihr stecken; legen Sie die Bilder auch hinein, und Sie haben ein Dokument, das identisch darstellt — auf einem Laptop in einem Hotel ohne Verbindung, auf einem abgeriegelten Firmenrechner, der unbekannte Hosts blockiert, und in drei Jahren, wenn der Bucket, in dem die Bilder lagen, gelöscht ist. Nichts anderes auf dieser Seite kauft Ihnen das.

## Alt-Text, Größe, SVG und Farbschema: die Attribute, die Markdown nicht hat

Markdowns Bildsyntax hat genau drei Plätze — eine URL, Alt-Text und einen optionalen Titel — und alles andere, was Leute von einem Bild wollen, liegt außerhalb davon. Diese Lücke ist der Ort, an dem rohes HTML in eine Markdown-Datei kommt, und rohes HTML ist der Ort, an dem Konverter beginnen, einander zu widersprechen.

### Alt-Text ist, was ein Screenreader liest

Alt-Text ist keine Bildunterschrift. Eine Bildunterschrift ist für alle sichtbar und steht neben dem Bild; Alt-Text ersetzt das Bild für einen Leser, der keines bekommt. MDN sagt es schlicht: das Attribut hält einen textlichen Ersatz für das Bild, und Screenreader lesen den Wert vor, damit ihre Nutzer wissen, was das Bild bedeutet (geprüft auf developer.mozilla.org, 9. September 2026). Es ist außerdem das, was der Browser in die Lücke zeichnet, wenn der Pfad falsch ist, was es zum nützlichsten einzelnen Ding in einem Dokument macht, dessen Bilder gebrochen sind.

Schreiben Sie also, was das Bild *sagt*, nicht, was es *ist*. „Architekturdiagramm“ sagt einem Zuhörer nichts. „Anfragen treffen die Warteschlange, ein Worker schreibt in den Speicher, die API liest daraus“ ist dieselbe Information, die der sehende Leser dem Diagramm in zwei Sekunden entnimmt.

Die Ausnahme ist ein Bild, das nichts sagt: ein Trenner, ein Platzhalter, eine dekorative Verzierung. Für die ist eine leere Zeichenkette richtig und beabsichtigt. MDN: `alt=""` zu setzen zeigt an, dass dieses Bild kein wesentlicher Teil des Inhalts ist — Dekoration oder ein Zählpixel — und dass nichtvisuelle Browser es auslassen dürfen; und visuelle Browser verstecken außerdem das Symbol für ein kaputtes Bild, wenn alt leer ist und das Bild nicht angezeigt werden konnte (geprüft auf developer.mozilla.org, 9. September 2026). Ein leeres alt sind zwei Gewinne auf einmal: der Screenreader bleibt still, und ein kaputtes Dekorationsbild lässt keine Narbe auf der Seite.

Markdowns dritter Platz ist der Titel. `![Flow](img/flow.png "Figure 3: the ingest path")` legt diese zitierte Zeichenkette in ein `title`-Attribut, und die meisten Konverter geben es treu aus. Danach passiert fast nichts Nützliches. Ein `title` erscheint als Tooltip beim Überfahren mit der Maus, ist also auf jedem Touch-Gerät unsichtbar, mit assistiver Technik unzuverlässig und ganz verschwunden, wenn die Positivliste des Bereinigers das Attribut nicht enthält. Behandeln Sie es als Dekoration. Wenn die Worte zählen, schreiben Sie sie in die Prosa darunter, wo jeder Leser sie bekommt.

| Sie schreiben | Was herauskommt | Wer es tatsächlich bekommt |
| --- | --- | --- |
| `![Ingest path](flow.png)` | `alt="Ingest path"` | Screenreader-Nutzer und alle, deren Bild gescheitert ist |
| `![](rule.png)` | `alt=""` | niemand, absichtlich — keine Ansage, kein kaputtes Symbol |
| `![Ingest path](flow.png "Figure 3")` | `alt="Ingest path" title="Figure 3"` | ein Überfahren mit der Maus, wenn das Attribut überlebt hat |
| Eine Zeile Kursivschrift unter dem Bild | ein gewöhnlicher Absatz | jeder, immer |

### Größe: es gibt keine Syntax, deshalb greifen Leute nach HTML

Weder CommonMark noch GitHub Flavored Markdown hat eine Breite. Es gibt kein `![Flow](flow.png){width=400}`, keine Prozentangabe, kein `=400x`. Manche Editoren bauen eine eigene Größen-Erweiterung ein, und eine Erweiterung ist keine Spezifikation: wo sie nicht implementiert ist, sieht der Leser die wörtlichen Zeichen mitten im Satz.

Der übliche Griff ist also rohes HTML, `<img src="flow.png" width="400" alt="Ingest path">`, und das hat drei mögliche Enden, je nach Konverter.

| Der Konverter | Was mit `<img … width="400">` passiert |
| --- | --- |
| Lässt rohes HTML durch | es funktioniert, und alles andere in der Datei auch |
| Maskiert rohes HTML standardmäßig | der Leser sieht das Tag als sichtbaren Text |
| Bereinigt gegen eine Positivliste | das `img` überlebt, das `width` vielleicht nicht, und das Bild stellt in voller Größe dar |

Das dritte ist das verwirrende, denn es funktioniert halb. Das Bild erscheint, in der Größe, in der es gespeichert wurde, und nirgends sagt etwas, dass ein Attribut entfallen ist. Eine Positivliste ist eine Liste dessen, was erlaubt ist, ein Attribut, das niemand hinzuzufügen dachte, fehlt also einfach — was für eine Sicherheitsmaßnahme das richtige Verhalten und für einen Autor ein verblüffendes ist. Es ist der klarste Fall dafür, [das Fragment von Anfang an in HTML zu schreiben](/blog/markdown-vs-html), wenn ein Dokument wirklich vom Layout abhängt.

Die dauerhafte Antwort ist, die Datei zu verkleinern. Ein Diagramm, das mit 400 Pixeln angezeigt wird und mit 400 Pixeln gespeichert ist, braucht kein Attribut, kann keines verlieren, ist kleiner zu verschicken und ist schärfer als dasselbe Bild, das ein Browser herunterskaliert. Es im Bild zu beheben, ist eine Behebung, die jeden Konverter übersteht.

### SVG: inline gegen verlinkt, und wo das Skript hereinkommt

Ein SVG ist keine Bilddatei in dem Sinn, in dem die anderen es sind. Es ist XML, und das Format enthält ein eigenes `<script>`-Element — MDN beschreibt es als das SVG-Gegenstück zu dem von HTML, das `href` statt `src` benutzt (geprüft auf developer.mozilla.org, 9. September 2026) — dazu Ereignisattribute und die Fähigkeit, externe Ressourcen zu referenzieren.

Ob das eine Rolle spielt, hängt ganz davon ab, wie die Datei in das Dokument kommt.

Als Bild referenziert ist es ein Bild, und der Browser behandelt es als eines. MDNs eigene Liste der Einschränkungen für ein SVG, das als Bild verwendet wird, ist eindeutig: JavaScript ist abgeschaltet, externe Ressourcen wie Bilder und Stylesheets können nicht geladen werden, `:visited`-Linkstile werden nicht dargestellt, und die plattformeigene Widget-Gestaltung ist aus. Diese Einschränkungen gelten, wenn das SVG über `<img>`, ein CSS-`background-image`, ein `drawImage()` auf einem Canvas und ähnliche Zusammenhänge geladen wird — und sie gelten nicht, wenn die Datei direkt geöffnet oder über `<iframe>`, `<object>` oder `<embed>` eingebettet wird (geprüft auf developer.mozilla.org, 9. September 2026).

Inline ist es überhaupt kein Bild. `<svg>…</svg>`-Markup in Ihr Markdown zu kleben, legt diese Elemente in das DOM der Seite selbst, wo seine Skripte die Skripte der Seite sind und seine IDs mit den IDs der Seite kollidieren können. Und inline ist genau das, was Leute tun, denn es ist der einzige Weg, ein Diagramm mit dem CSS der Seite zu gestalten, damit es dem Farbschema folgt.

| | Inline `<svg>…</svg>` | `<img src="chart.svg">` |
| --- | --- | --- |
| Reist innerhalb der Datei | ja | nein, außer die Quelle ist ein Data-URI |
| Vom CSS der Seite gestaltbar | ja | nein |
| Skripte darin können laufen | ja | nein — für SVG-als-Bild abgeschaltet |
| Übersteht einen Bereiniger | hängt von der Positivliste ab | meist, es ist ein gewöhnliches `img` |
| Von einem Fremden gefahrlos anzunehmen | nein | behandeln Sie es als Bild |

Die Regel, die daraus fällt, ist kurz: ein SVG, das Sie selbst gezeichnet haben, ist so oder so in Ordnung; ein SVG von woanders — ein Abzeichen, ein Symbolsatz, ein von einem Werkzeug erzeugtes Schaubild, ein Diagramm, das ein Kunde geschickt hat — sollte referenziert und nicht inline gesetzt werden. Wenn Sie es inline setzen müssen, öffnen Sie es zuerst in einem Texteditor und lesen Sie es. Es ist XML. Sie können alles sehen, was es tut.

### Bilder, die dem Farbschema des Lesers folgen

Ein Diagramm mit schwarzen Linien auf durchsichtigem Grund verschwindet auf einer dunklen Seite, und etwa die Hälfte Ihrer Leser hat inzwischen eine dunkle Seite. Die Antwort der Standards ist das `<picture>`-Element: null oder mehr `<source>`-Elemente, gefolgt von genau einem `<img>`, wobei jede Quelle eine `media`-Bedingung trägt, der Browser die erste nimmt, die passt, und das `<img>` der Rückfall ist, wenn keine passt. Der Alt-Text gehört an das `<img>`, nicht an das `<picture>` (geprüft auf developer.mozilla.org, 9. September 2026).

```html
<picture>
  <source srcset="flow-dark.png" media="(prefers-color-scheme: dark)">
  <source srcset="flow-light.png" media="(prefers-color-scheme: light)">
  <img src="flow-light.png" alt="Requests hit the queue, a worker writes to the store">
</picture>
```

GitHub unterstützt diese Form für farbschemaspezifische Bilder und hat seinen früheren Ansatz, `#gh-dark-mode-only` oder `#gh-light-mode-only` an die Bild-URL zu hängen, zu ihren Gunsten abgekündigt (geprüft auf github.blog, 9. September 2026). Wenn Sie diese Fragment-Syntax in einer alten README haben, ist ihre Zeit geliehen.

Zwei Einschränkungen, beide von früher in diesem Abschnitt. Es ist rohes HTML, es trifft also dieselben drei Schicksale wie ein `width`-Attribut: durchgelassen, maskiert oder teilweise bereinigt. Und ein Bereiniger, der `img` erlaubt, erlaubt vielleicht nicht `picture` und `source`, und dann bekommt Ihr Leser den Rückfall — was ein gutes Argument dafür ist, den Rückfall zur Version mit hellem Hintergrund zu machen, der auf Weiß lesbaren, und den Alt-Text dorthin zu setzen, wo er hingehört.

Es gibt auch eine Behebung, die überhaupt kein HTML braucht: geben Sie dem Diagramm einen ausdrücklichen Hintergrund und mitteltonige Tinte, damit es auf Weiß und auf Anthrazit gleichermaßen lesbar ist. Ein Bild, das das Farbschema nicht kennen muss, kann das Farbschema nicht falsch verstehen, und es übersteht jeden Konverter, jeden Bereiniger und jedes E-Mail-Programm auf dieser Seite.

## Anker-Links, und wie der Slug gemacht wird

Ein Markdown-Anker-Link ist ein Link auf eine Überschrift im selben Dokument: `[see below](#installing-the-cli)`. Die ID, auf die er zeigt, wird aus dem Überschriftentext erzeugt, und das Rezept ist überall ungefähr dasselbe. Den Text kleinschreiben, Zeichensetzung entfernen, Folgen von Leerraum in Bindestriche verwandeln und eine Zahl anhängen, wenn zwei Überschriften kollidieren.

Ungefähr dasselbe ist nicht dasselbe, und das ist der Grund, warum ein Inhaltsverzeichnis, das im Repository perfekt funktioniert, beim Leser mit der Hälfte seiner Einträge untätig ankommt. Jeder Renderer implementiert seine eigene Slug-Funktion, und die Unterschiede sind klein genug, dass die meisten Links überleben, und groß genug, dass manche es nicht tun.

GitHub dokumentiert seine Regel in einem Satz: Buchstaben werden in Kleinschreibung umgewandelt, Leerzeichen durch Bindestriche ersetzt, und jeder andere Leerraum und alle Satzzeichen werden entfernt (geprüft auf docs.github.com, 9. September 2026). Pandoc dokumentiert ein längeres Rezept, und einer seiner Schritte findet sich bei keinem anderen — es entfernt alles bis zum ersten Buchstaben, denn ein Identifikator darf nicht mit einer Zahl oder einem Satzzeichen beginnen, aus `## 3. Applications` wird also `applications` und nicht `3-applications`. Doppelte Überschriften bekommen `-1`, dann `-2`, und wenn nach dem Abstreifen nichts übrig bleibt, lautet der Identifikator `section` (geprüft auf pandoc.org, 9. September 2026). `gfm_auto_identifiers` einzuschalten stellt Pandoc stattdessen auf GitHubs Methode um: Leerzeichen zu Bindestrichen, Großschreibung zu Kleinschreibung, Satzzeichen außer `-` und `_` entfernt, Emoji durch ihre Namen ersetzt.

Die JavaScript-Bibliotheken sind seltsamer, denn zwei der am weitesten verbreiteten erzeugen überhaupt keine IDs, wenn Sie nicht darum bitten. marked hat seine Optionen `headerIds` und `headerPrefix` in v8.0.0 entfernt und verweist alle, die sie wollen, auf das separate Paket `marked-gfm-heading-id` (geprüft auf marked.js.org, 9. September 2026). markdown-it gibt von sich aus auch keine Überschriften-IDs aus; die übliche Antwort ist markdown-it-anchor, das sich selbst als Plugin beschreibt, das Überschriften ein `id`-Attribut und auf Wunsch Permalinks hinzufügt, das Doppelungen mit einem numerischen Suffix ab 1 auseinanderhält und das die Slug-Funktion vollständig ersetzen lässt; es ist kostenlos, veröffentlicht unter der Unlicense (geprüft auf github.com, 9. September 2026).

| Überschrift in der Quelle | GitHub | Pandoc, Standard | Pandoc + `gfm_auto_identifiers` | markdown-it + markdown-it-anchor | marked, ohne Erweiterung |
| --- | --- | --- | --- | --- | --- |
| `## Installing the CLI` | `installing-the-cli` | `installing-the-cli` | `installing-the-cli` | `installing-the-cli` | keine ID ausgegeben |
| `## 3. Applications` | `3-applications` | `applications` | `3-applications` | was die Slug-Funktion eben tut | keine ID ausgegeben |
| `## Maître d'hôtel` | `maître-dhôtel` | `maître-dhôtel`, oder `maitre-dhotel` mit `ascii_identifiers` | `maître-dhôtel` | hängt von der Slug-Funktion ab | keine ID ausgegeben |
| `## Notes`, zweimal vorkommend | ein numerisches Suffix | `notes`, dann `notes-1` | ein numerisches Suffix | `notes`, dann `notes-1` | keine ID ausgegeben |
| Zeichensetzung, allgemein | entfernt außer Bindestrichen | entfernt außer `_`, `-` und `.` | entfernt außer `-` und `_` | konfigurierbar | — |

Die Zeile, die Leute am meisten kostet, ist die mit der Zahl. Dokumentation ist voll von `## 1. Prerequisites` und `## 2. Installing`, und ein für GitHub gebautes Inhaltsverzeichnis zielt auf `#1-prerequisites`, während ein Pandoc-Bau `#prerequisites` erzeugt. Jeder Link in der Liste geht daneben. Nichts meldet einen Fehler: ein Fragment, das auf keine ID passt, ist in HTML kein Scheitern, es ist die Bitte, zu nichts zu scrollen, und der Browser erfüllt sie, indem er genau dort bleibt, wo er ist. Der Leser klickt, nichts bewegt sich, und er schließt daraus, dass die Seite auf eine vage Weise kaputt ist, die er nicht beschreiben kann.

Die andere stille Abweichung ist das Präfix. TransformPipe stellt jeder Überschriften-ID `doc-` voran, aus `## Installing the CLI` wird also `id="doc-installing-the-cli"` und der Link muss `#doc-installing-the-cli` lauten. Das Präfix existiert, um IDs aus dem Gebiet des DOM-Clobbering zu halten, was dieselbe Begründung ist wie hinter dem [Bereinigen der Ausgabe überhaupt](/blog/sanitising-markdown-safely). Andere Werkzeuge setzen aus eigenen Gründen ein Präfix, und ein Präfix setzt jeden handgeschriebenen Anker auf einen Streich außer Kraft.

Konvertieren Sie also zuerst und lesen Sie die IDs, die der Konverter erzeugt hat, statt zu raten. Öffnen Sie die Ausgabe, suchen Sie darin nach `id="`, suchen Sie nach `href="#`, und vergleichen Sie die zwei Listen — alles in der zweiten, was in der ersten fehlt, ist ein toter Link, und die Prüfung dauert kürzer als das Schreiben des Inhaltsverzeichnisses gedauert hat. Es gibt auch eine strukturelle Behebung: geben Sie der Überschrift eine ausdrückliche ID, wo der Renderer das unterstützt, oder verlinken Sie auf eine stabile Überschrift statt auf eine nummerierte. Eine Überschrift umzubenennen bricht lautlos jeden Anker, der auf sie zielt, was ein Grund ist, das Inhaltsverzeichnis kurz zu halten in [Dokumentation, die im Repository lebt](/blog/documentation-that-lives-in-the-repo).

## Referenzstil-Links, und jedes Ziel automatisch prüfen

Inline-Links überladen den Satz. Der Referenzstil verschiebt jede URL nach unten und lässt ein kurzes Kürzel zurück.

```markdown
Der [Styleguide][guide] hat sich geändert, und die [API-Referenz][api] auch.
Lesen Sie den [Styleguide][guide] noch einmal, bevor Sie etwas einreichen.

[guide]: https://example.com/style
[api]: https://example.com/api/v1
```

Das Kürzel wird so oft wiederverwendet, wie Sie mögen, die URL einmal geschrieben, eine umgezogene Domain ist also eine Änderung und keine Jagd durch Absätze. Es gibt Ihnen außerdem einen Block, den man vor dem Absenden prüfen kann: jedes Ziel, auf das das Dokument zeigt. Ein langer base64-Klumpen gehört ebenfalls dort hinunter, und Bilder auch — `![Flow][flow]` mit `[flow]: assets/flow.png` am Fuß der Datei hält ein 40 KB großes Data-URI aus der Mitte eines Satzes heraus.

Dieser Block ist auch das, was eine Maschine lesen kann. Sobald jedes Ziel an einer Stelle steht, ist seine Prüfung keine Arbeit für einen Menschen mehr.

### Ein Prüfer, den Sie wirklich nachprüfen können

lychee ist ein in Rust geschriebener Link-Prüfer, den sein eigenes Repository als schnellen, asynchronen, stream-basierten Link-Prüfer beschreibt, der kaputte URLs und Mail-Adressen in Markdown, HTML, reStructuredText, Websites und mehr findet. Er ist kostenlos und doppelt lizenziert unter Apache 2.0 oder MIT, und es gibt eine offizielle GitHub Action, `lycheeverse/lychee-action` (geprüft auf github.com, 9. September 2026). Richten Sie ihn auf Ihre `.md`-Dateien, und er berichtet, was nicht mehr auflöst.

Wohin er gehört, sind zwei Orte, nicht einer.

| Wann er läuft | Was er fängt | Was er bei einem Fehlschlag tun soll |
| --- | --- | --- |
| Bei jedem Pull Request, der `.md` berührt | den Link, den Sie vor zehn Minuten falsch getippt haben | die Prüfung scheitern lassen — der Autor ist ja da |
| Nach Zeitplan, wöchentlich oder nächtlich | den Link, der letzten Monat verrottet ist | ein Issue eröffnen, keinen Bau scheitern lassen |

Die Teilung zählt, weil die zwei Fehlschläge verschiedene Eigentümer haben. Ein Lauf auf einem Pull Request sieht sich nur an, was der Pull Request geändert hat, er wird also nie merken, dass ein Anbieter seine Dokumentation im Juni umsortiert hat. Ein geplanter Lauf merkt es, aber eine Auslieferung zu blockieren, weil die Website von jemand anderem zehn Minuten lang nicht erreichbar ist, bestraft die falsche Person. Verdrahten Sie den geplanten Lauf so, dass er stattdessen ein Issue anlegt, neben allem anderen, was Sie schon [aus einem Workflow veröffentlichen](/blog/publish-markdown-from-github-actions).

Und seien Sie klar darüber, was kein Prüfer für Sie tun kann. Er löst relative Pfade gegen das Repository auf, denn das Repository ist der Ort, an dem er steht — `img/flow.png` besteht also, jedes Mal, einschließlich des Laufs unmittelbar bevor Sie den Export an jemanden schicken, dessen Downloads-Ordner kein `img` enthält. Genau das Scheitern, um das es in diesem Artikel geht, ist für das Werkzeug unsichtbar, das die Quelle prüft. Prüfen Sie die Ausgabe.

## Der ehrliche Teil: ein per E-Mail verschicktes Dokument trägt seine Bilder oder hat keine

Alles oben nimmt an, dass die Software des Lesers ein Bild holt, wenn man es ihr sagt. E-Mail ist der Ort, an dem diese Annahme einfach falsch ist, und sie ist absichtlich falsch.

Outlook ist standardmäßig so eingerichtet, dass es das automatische Herunterladen von Bildern aus dem Internet blockiert, und Microsoft gibt vier Gründe an: möglicherweise anstößige verlinkte Inhalte, bösartigen Code, die Bandbreitenkosten für Bilder, die der Leser nicht angefordert hat, und Zählpixel — unsichtbare Bilder, die einem Absender sagen, dass die Nachricht gelesen wurde (geprüft auf support.microsoft.com, 9. September 2026). Jedes andere Mail-Programm verhält sich im Großen und Ganzen gleich, denn das Problem der Zählpixel ist für alle dasselbe.

Ein in einen E-Mail-Text eingefügtes HTML-Dokument, mit über URL referenzierten Bildern, kommt also als Prosa und graue Rechtecke an, mit einem Balken quer über den Kopf, der anbietet, Bilder herunterzuladen. Manche Leser klicken darauf. Viele nicht, und einige arbeiten an einem Ort, der die Möglichkeit ganz entfernt hat. Das ist kein Fehler auf Ihrer Seite, und es gibt keinen Header, kein Attribut und keinen Trick, der es behebt: das Programm schützt seinen Nutzer vor genau dem Mechanismus, auf den Sie sich verlassen.

Das lässt zwei ehrliche Möglichkeiten und keine dritte.

**Das Dokument trägt seine Bilder.** Jedes Bild wird ein Data-URI, und die Nachricht enthält die Bytes statt einer Anfrage nach ihnen. Nichts wird blockiert, weil nichts geholt wird. Die Kosten sind die Arithmetik von vorhin: ein Dokument mit sechs Screenshots ist eine mehrere Megabyte breite Nachricht, jedes Mal vollständig weitergeleitet, die in Postfächern mit Quoten liegt und durch Gateways läuft, die HTML-Mail unterwegs manchmal umschreiben. Manche Firmenfilter entfernen `data:`-Quellen aus demselben Grund, aus dem der Bereiniger eines Wikis es tut.

**Das Dokument hat keine Bilder.** Das Diagramm wird ein Satz, der Screenshot wird eine Tabelle, das Schaubild wird drei Zahlen, und die Nachricht ist klein, schnell und überall lesbar, auch auf dem Telefon im Zug. Die Kosten sind, dass Sie die Übertragung leisten müssen, und manches lässt sich wirklich nicht übertragen — ein Flame-Graph ist kein Satz.

Es gibt einen Mittelweg, der ein Scheitern gegen das andere tauscht. Hängen Sie die konvertierte HTML-Datei an, statt sie in den Text einzufügen: der Leser lädt sie herunter und öffnet sie in einem Browser, der Bilder normal holt, entfernte URLs funktionieren also wieder. Im Tausch löst jetzt jeder relative Pfad gegen seinen Downloads-Ordner auf, und dort hat dieser Artikel angefangen. Es gibt keine Anordnung, die keines der beiden Probleme hat. Es gibt nur die Wahl, welches Sie lieber erklären.

## Was Sie prüfen sollten, bevor Sie die Datei verschicken

Eigenständiges HTML ist eine Behauptung über die Darstellung, selten über den Inhalt. In einem HTML-Dokument aus einer einzigen Datei sind die Stile inline, es gibt keine Skripte und nichts wird geholt, damit die Seite richtig aussieht — der TransformPipe-Download arbeitet so. Was das nie umfasst, ist ein Bild, auf das Sie woanders gezeigt haben. `<img src="diagram.png">` bedeutet weiterhin `diagram.png`, neben dem Ort, an dem der Leser die Datei abgelegt hat.

Die Kriterien unten sind das, was zu entscheiden ist, in dieser Reihenfolge, bevor die Datei Ihren Rechner verlässt.

1. **Entscheiden Sie das Ziel, bevor Sie den Pfad schreiben.** Ein Dokument, das aus einem Downloads-Ordner geöffnet wird, kann weder einen relativen noch einen wurzelrelativen Pfad benutzen: `../assets/flow.png` verlässt den Ordner, den Sie verschicken, und ein führender Schrägstrich zeigt auf die Wurzel der Festplatte des Lesers. Entscheiden Sie zuerst, und Sie schreiben jeden Pfad einmal, statt sie später alle wiederzufinden.
2. **Betten Sie ein, was klein ist, hosten Sie, was groß ist.** Base64 legt etwa ein Drittel auf die Bytes, ein Symbol kostet also nichts und ein Screenshot kostet ein Megabyte unlesbaren Text, in die Prosa gekeilt, mit jeder Kopie erneut verschickt und für jedes Diff unsichtbar.
3. **Geben Sie jedem bedeutungstragenden Bild Alt-Text und jedem dekorativen ein leeres `alt`.** Das erste ist, was ein Screenreader ansagt und was die Lücke füllt, wenn das Bild scheitert; das zweite hält einen Platzhalter davon ab, vorgelesen zu werden, und versteckt das Symbol für ein kaputtes Bild, wenn es nicht lädt.
4. **Setzen Sie nie ein SVG inline, das Sie nicht selbst gezeichnet haben.** Inline tritt es dem DOM der Seite bei und seine Skripte werden die Skripte der Seite; aus einem `img` referenziert, schaltet der Browser sein Skripting ab und behandelt es als das Bild, das Sie zu bekommen glaubten.
5. **Nehmen Sie an, dass jedes rohe HTML-Attribut optional ist.** Breite, Höhe, `picture`, `source`, `title` und `class` leben alle auf Gnade einer Positivliste, jedes Layout, das nur funktioniert, wenn das Attribut überlebt, wird also irgendwann ohne es gesehen.
6. **Lesen Sie die IDs, die der Konverter erzeugt hat, nicht die, die Sie erwartet haben.** Slug-Algorithmen unterscheiden sich zwischen Renderern, und ein Anker, der auf nichts passt, scheitert lautlos — kein Fehler, keine Warnung in der Konsole, nur eine Seite, die sich weigert zu scrollen.
7. **Lassen Sie einen Link-Prüfer auf Pull Requests und nach Zeitplan laufen.** Der erste fängt den Link, den Sie heute falsch gemacht haben; nur der zweite fängt den, der verrottet ist, während niemand diese Datei bearbeitet hat.
8. **Öffnen Sie den Export aus einem anderen Ordner, auf einem anderen Rechner, mit abgeschaltetem Netz.** Dieser eine Test fängt fehlende Dateien, wurzelrelative Pfade, CDN-Abhängigkeiten und Hotlink-Sperren zusammen, und er dauert etwa eine Minute.

Machen Sie dann den Durchgang, der eine Minute kostet. Konvertieren Sie Ihre Datei, öffnen Sie den Reiter mit dem HTML-Quelltext, und suchen Sie darin nach `src="` und `href="`. Lesen Sie jeden Wert und fragen Sie, wo er vom Rechner des Lesers aus auflöst, nicht von Ihrem. Beheben Sie die, die falsch antworten, und verschicken Sie dann die Datei — oder lassen Sie den Anhang weg und [teilen Sie sie als Link](/blog/share-a-markdown-document-as-a-link), was dem Leser einen Download erspart, aber keinen relativen Pfad: der löst weiterhin gegen die Seite auf, von der er ausgeliefert wird, und dorthin wurden die Bilder nie gelegt.

## Fazit

Jedes kaputte Bild und jeder tote Anker in einem konvertierten Dokument kommt vom selben Fehler, zweimal gemacht: ein Verweis wurde aufgeschrieben, während man an einem Ort stand, und gelesen, während man an einem anderen stand. Absolute URLs und Data-URIs sind die zwei Formen, denen es gleich ist, wo der Leser steht, Alt-Text ist, was bleibt, wenn das Bild nicht ankommt, und Überschriften-IDs sind es wert, gelesen und nicht vorhergesagt zu werden, denn vier Renderer geben Ihnen vier Antworten. Nichts davon ist schwierig; alles davon ist von dem Rechner aus unsichtbar, auf dem das Dokument geschrieben wurde. [Konvertieren Sie also die Datei](/), öffnen Sie die Ausgabe, lesen Sie jedes `src` und jedes `href`, das sie erzeugt hat, und fragen Sie jedes einzelne, wohin es von einem fremden Schreibtisch aus zeigt — dieser eine Durchgang ist der Unterschied zwischen einem Dokument, das das Verschicken übersteht, und einem, das voller grauer Kästen ankommt.

## FAQ

### Warum wird mein Markdown-Bild nicht angezeigt?

In neun von zehn Fällen ist der Pfad relativ und die Datei ist umgezogen, er löst also jetzt gegen einen Ordner auf, in dem kein Bild liegt. Öffnen Sie den Netzwerk-Tab des Browsers und lesen Sie den Status: 404 ist ein falscher Pfad, 403 sind Rechte oder Hotlink-Schutz, und ein 200, das HTML zurückgibt, heißt, Sie haben eine Seite statt einer Datei verlinkt.

### Wie verlinke ich ein Bild, das in einem GitHub-Repository liegt?

Nehmen Sie einen relativen Pfad, wenn das Markdown auf der Repository-Seite gelesen wird, was GitHub selbst empfiehlt. Wenn Sie eine absolute URL brauchen, nehmen Sie `raw.githubusercontent.com` oder hängen Sie `?raw=true` an die Blob-URL — die einfache `…/blob/…`-Adresse gibt eine HTML-Seite zurück, kein Bild, und stellt immer kaputt dar.

### Sollte ich Bilder in Markdown base64-kodieren?

Für Symbole, Logos und kleine Diagramme in einem Dokument, das allein reisen muss, ja. Base64 macht die Daten etwa ein Drittel größer als die Datei, aus einem 2-MB-Screenshot werden also etwa 2,7 MB Text mitten in Ihrer Prosa, der nicht getrennt zwischengespeichert, gediffed oder ersetzt werden kann — oberhalb von einigen hundert Kilobyte hosten Sie das Bild lieber.

### Kann ich in Markdown eine Bildbreite setzen?

Nicht in CommonMark oder GitHub Flavored Markdown, die Ihnen eine URL, Alt-Text und einen optionalen Titel geben und nichts weiter. Leute greifen nach rohem `<img width="400">`, aber ein Konverter kann das rohe HTML maskieren oder das Attribut wegbereinigen, das Verkleinern der eigentlichen Bilddatei ist also die einzige Behebung, die überall funktioniert.

### Warum funktioniert mein Link auf eine Überschrift auf GitHub, bricht aber im exportierten HTML?

Weil die zwei Renderer Überschriften verschieden in Slugs verwandeln. GitHub schreibt klein, setzt Bindestriche für Leerzeichen und streift Zeichensetzung ab; Pandoc entfernt zusätzlich alles bis zum ersten Buchstaben, aus `## 3. Applications` wird also `#applications` und nicht `#3-applications`; marked und markdown-it geben ohne Plugin überhaupt keine IDs aus. Lesen Sie die IDs in der Ausgabe, statt sie anzunehmen.

### Werden meine Bilder angezeigt, wenn ich das konvertierte HTML per E-Mail schicke?

Nur wenn sie eingebettet sind. Outlook blockiert standardmäßig das automatische Herunterladen von Bildern aus dem Internet, vor allem um Zählpixel zu vereiteln, und andere Programme tun dasselbe, ein per E-Mail verschicktes Dokument mit entfernten Bild-URLs kommt also als Prosa und graue Kästen an, bis der Leser sich entscheidet, sie zu laden.

### Was ist der Unterschied zwischen Alt-Text und einer Bildunterschrift?

Eine Bildunterschrift ist für jeden sichtbar, steht nahe beim Bild und fügt etwas hinzu, was das Bild von sich aus nicht sagt. Alt-Text ersetzt das Bild für einen Leser, der keines bekommt — einen Screenreader-Nutzer oder jeden, dessen Bild nicht geladen hat — er sollte also sagen, was das Bild mitteilt, und leer sein, wenn das Bild nichts mitteilt.
