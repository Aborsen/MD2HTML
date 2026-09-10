---
title: "HTML in Markdown umwandeln: eine Methode für jeden Ausgangspunkt"
description: "Wie Sie HTML aus einer Datei, einem Tab, einer Zeichenkette im Code oder einer ganzen Website in Markdown umwandeln — und warum das Aufräumen vorher entscheidet"
date: 2026-09-05
tag: Konvertieren
keywords: html in markdown umwandeln, html zu markdown, html datei zu markdown konvertieren, webseite als markdown, html zu markdown kommandozeile, turndown, pandoc html zu markdown, html vor der konvertierung aufräumen
---

Die meisten Anleitungen zum Umwandeln von HTML in Markdown nennen ein Werkzeug und hören dann auf. Deshalb enttäuschen die Ergebnisse. Das Werkzeug ist das austauschbare Teil. Was entscheidet, ob am Ende ein lesbares Dokument oder vierhundert Zeilen Linklisten stehen, ist, woher das HTML kam und was Sie damit gemacht haben, bevor der Konverter lief. Ein handgeschriebenes Fragment wandelt sich mit allem auf dem Markt sauber um. Eine von einer Nachrichtenseite gespeicherte Seite wandelt sich genauso sauber um, und die Ausgabe ist unbrauchbar.

### Kurzfassung

Wählen Sie die Methode danach, wo das HTML ist, nicht danach, welche Bibliothek die beste ist. Für **eine Datei auf der Platte** ziehen Sie sie in einen Konverter im Browser oder führen einen Pandoc-Befehl aus. Für **eine Seite, die Sie gerade ansehen**, nehmen Sie einen Clipper oder kopieren das Artikel-Element aus der Browser-Konsole, denn eine gespeicherte Seite ist überwiegend nicht der Artikel. Für **eine Zeichenkette im Code** nehmen Sie die Bibliothek Ihrer Sprache — Turndown in JavaScript, markdownify oder html2text in Python — und für **eine ganze Website** spiegeln, extrahieren, konvertieren Sie, in dieser Reihenfolge. Überschriften, Links, Listen, Tabellen und Code überstehen die Reise; Layout, Klassen, Inline-Stile und verschachtelte Tabellen nicht, und keine Option stellt sie wieder her.

## Warum die Konvertierung die leichtere Hälfte ist

HTML in Markdown umzuwandeln ist ein Befehl. Markdown zu erzeugen, das Sie jemandem zeigen würden, sind vier Schritte, und der Befehl ist der letzte davon. Zuerst finden Sie heraus, welche Bytes das Dokument sind. Dann bringen Sie diese Bytes dorthin, wo ein Konverter sie lesen kann. Dann entscheiden Sie, was mit den Konstrukten passiert, für die Markdown keine Worte hat. Erst dann konvertieren Sie. Überspringen Sie die ersten drei, gelingt der vierte trotzdem — das ist die Falle. Ein Konverter hat keine Möglichkeit, ein Cookie-Banner von einem Absatz zu unterscheiden, er übersetzt also beides, korrekt, und gibt Ihnen das Ergebnis.

Der zweite Schritt erwischt mehr Leute, als er sollte, denn das HTML auf Ihrem Bildschirm und das HTML in der Datei sind häufig nicht dasselbe Dokument. `curl` und `wget` holen, was der Server gesendet hat. Wenn die Seite sich danach in JavaScript selbst zusammensetzt — eine Doku-Seite mit clientseitigem Router, eine App-Hülle, irgendetwas, das aus einer JSON-Nutzlast heraus darstellt — dann ist das, was der Server gesendet hat, ein leeres `<div>` und ein Skript-Tag. Konvertieren Sie das, und Sie bekommen eine leere Datei und verbringen zwanzig Minuten damit, den Konverter zu verdächtigen. Das dargestellte DOM lebt nur im Browser, weshalb „Seite speichern" und „Seite abrufen" verschiedene Ergebnisse liefern und weshalb der Browser manchmal der einzige Ort ist, an dem die Konvertierung beginnen kann.

Der dritte Schritt ist der, der später scheitert statt sofort. Eine Seite, die mit `<img src="/img/diagram.png">` geschrieben ist, wird zu Markdown, das genau diesen Pfad enthält — und der Pfad löst sich jetzt gegen den Ort auf, an dem das Markdown gelandet ist. Jedes Bild zeigt auf nichts. Dasselbe gilt für jeden relativen Link, jeden Anker auf eine Überschrift, die der Konverter umbenannt hat, und jedes Konstrukt, das seine Bedeutung aus dem Stylesheet bezog. Die Konvertierung sah in der Vorschau des Konverters perfekt aus. Sie brach, als die Datei umzog, und das ist eine Woche später und vor jemand anderem.

## Der schnelle Vergleich

| Ausgangspunkt | Kürzester Weg | Was Sie zuerst tun müssen | Was es Sie kostet |
| --- | --- | --- | --- |
| Eine `.html`-Datei, handgeschrieben oder ein sauberes Fragment | Jeder Konverter, Browser oder CLI | Nichts | Nichts — dieser Fall ist gelöst |
| Eine `.html`-Datei, aus einem Browser gespeichert | Konverter im Browser, oder Pandoc | Navigation, Kopf, Fuß, Skripte entfernen | Zehn Minuten Aufräumen, oder ein Werkzeug, das es für Sie tut |
| Eine im Browser offene Seite, einmalig | Eine Clipper-Erweiterung, oder die Konsole | Einen Extraktor den Artikel finden lassen | Eine Erweiterung installieren, oder eine Zeile JavaScript |
| Eine Seite, die in JavaScript entsteht | Die Browser-Konsole, oder ein Headless-Browser | Auf das DOM warten, dann `outerHTML` nehmen | `curl` funktioniert hier überhaupt nicht |
| Seiten, die Sie jede Woche lesen und behalten | Ein Clipper in Ihre Notizen | Einmal einrichten | Nach der Einrichtung nichts |
| Eine HTML-Zeichenkette in Node | Turndown, oder node-html-markdown | Die Elemente, die Sie nicht wollen, mit `remove()` entfernen | Eine Abhängigkeit und ein paar Regeln |
| Eine HTML-Zeichenkette in Python | markdownify, oder html2text | Die Elemente, die Sie nicht wollen, mit `strip=[...]` entfernen | Eine Abhängigkeit und ein paar Optionen |
| HTML in einer Shell-Pipeline oder in CI | Pandoc, oder ein Konverter mit API | Dialekt entscheiden und ob rohes HTML durchgeht | Eine Installation auf dem Runner, oder ein Netzwerkaufruf |
| HTML aus E-Mails oder Newslettern | Pandoc, dann kräftig überarbeiten | Akzeptieren, dass das Tabellenlayout weg ist | Die meiste Struktur; die Wörter überleben |
| Eine ganze Website, die Ihnen gehört | Aus der Quelle konvertieren, nicht aus der Ausgabe | Die Vorlagen und das Inhaltsverzeichnis finden | Echte Arbeit, und die richtige Antwort |
| Eine ganze Website, die Ihnen nicht gehört | `wget --mirror`, Extraktor, Konverter, in dieser Reihenfolge | Bestätigen, dass Sie es dürfen | Stunden, und ein Selektor pro Seite |
| HTML in einer Datenbankspalte | Die Bibliothek Ihrer Sprache, in einer Schleife | Zwanzig Zeilen prüfen, bevor Sie eine Million konvertieren | Eine falsche Annahme, mit der Zeilenzahl multipliziert |

## HTML in Markdown umwandeln, je Ausgangspunkt

### Eine `.html`-Datei auf der Platte

Das ist der Fall, den jeder hat, und der mit den meisten Optionen. Die Datei liegt schon lokal, es gibt nichts abzurufen, und die einzige echte Frage ist, ob die Datei ein Dokument oder eine Seite ist.

Ein handgeschriebenes Fragment, ein exportiertes Kapitel, eine einzelne Doku-Seite — konvertieren Sie es mit irgendetwas und gehen Sie weiter. Eine aus einem Browser gespeicherte Seite ist etwas anderes. Browser bieten zwei Speichermodi, und sie erzeugen verschiedene Probleme. „Webseite, nur HTML" gibt Ihnen eine Datei mit dem Markup und keinem der Assets, Bilder werden also zu defekten Verweisen. „Webseite, vollständig" gibt Ihnen eine Datei plus einen Ordner mit Assets und schreibt die Pfade so um, dass sie in diesen Ordner zeigen — Ihr Markdown wird also Pfade wie `page_files/diagram.png` tragen: richtig auf Ihrem Rechner, bedeutungslos überall sonst.

| Weg | Installation | Gut für | Achten Sie auf |
| --- | --- | --- | --- |
| Konverter im Browser | Keine | Eine Datei, jetzt, ohne sie hochzuladen | Ein Dokument auf einmal |
| Pandoc | Ja, einmal | Skripte, und Ausgabe jenseits von Markdown | Kein Bereinigen; rohes HTML geht durch, wenn Sie es nicht abschalten |
| `html2text` (Python) | Ja, pip | Gut lesbare, textnahe Ausgabe | GPLv3, und es formatiert standardmäßig aggressiv um |
| Editor-Erweiterung | Ja | Konvertieren, während die Datei schon offen ist | Schwankt stark je Erweiterung |
| In einen Markdown-Editor einfügen | Keine | Kleine Fragmente | Verwirft lautlos, was der Editor nicht versteht |

Mit Pandoc ist die ganze Aufgabe eine Zeile:

```bash
pandoc -f html -t gfm --wrap=none page.html -o page.md
```

`-t gfm` verlangt GitHub Flavored Markdown, den Dialekt mit Tabellen, Aufgabenlisten und Durchgestrichenem darin. `--wrap=none` hält Pandoc davon ab, Ihre Absätze auf eine Spaltenbreite umzubrechen, was wichtig ist, weil ein neu umgebrochener Absatz beim nächsten Bearbeiten in jeder Zeile einen Diff erzeugt. Zwei weitere Flags verdienen hier ihren Platz. `--extract-media=media` zieht Bilder und andere Medien aus der Quelle in ein Verzeichnis und schreibt die Verweise passend um, was die Abhilfe für das Asset-Pfad-Problem von oben ist. Und `-t gfm-raw_html` schaltet die `raw_html`-Erweiterung ab, sodass Konstrukte, die Pandoc in Markdown nicht ausdrücken kann, verworfen statt als HTML-Tags durchgelassen werden. Pandoc nimmt auch eine URL anstelle eines Dateinamens und ruft sie über HTTP ab, und `--sandbox` beschränkt seinen Dateizugriff auf die Dateien, die Sie auf der Kommandozeile genannt haben — was sich bei allem lohnt, das Sie nicht selbst geschrieben haben (geprüft auf pandoc.org, 8. September 2026).

Der Weg über den Browser tauscht die Flags gegen nichts zu installieren. [Die HTML-zu-Markdown-Konvertierung von TransformPipe](/html-to-markdown) liest die Datei in der Seite, entfernt `script`-, `style`-, `noscript`-, `template`-, `svg`-, `iframe`-, `head`-, `nav`- und `footer`-Elemente samt HTML-Kommentaren, konvertiert, was übrig ist, und gibt eine `.md`-Datei zurück. Abgemeldet wird die Datei nirgendwohin gesendet — die Konvertierung passiert auf Ihrem eigenen Rechner, was Sie bestätigen können, indem Sie den Netzwerk-Tab beobachten, während es läuft. Die Konvertierung ist bei 10 MB gedeckelt, was weit mehr HTML ist als jede einzelne Seite.

**Nehmen Sie das, wenn:** Sie die Datei haben, das Markdown wollen und es ein- oder zweimal tun. Wenn Sie es hundertmal tun, springen Sie zum Weg über den Code.

### Eine im Browser offene Seite

Hier existiert das HTML, das Sie wollen, noch nicht als Datei, und die Fassung, die Sie durch Abrufen der URL bekämen, entspricht möglicherweise nicht dem, was Sie lesen. Es gibt drei Wege, und sie passen zu verschiedenen Häufigkeiten.

**Clippen Sie sie.** Eine Browser-Erweiterung, die nach Markdown clippt, lässt einen Extraktor über die dargestellte Seite laufen, wirft das Mobiliar weg und konvertiert, was bleibt. Das ist das beste Ergebnis pro Aufwandseinheit für eine Seite, die Sie lesen, und es ist der einzige Weg, der Inhalte aus JavaScript zuverlässig verkraftet, weil er am lebenden DOM arbeitet. Der [Vergleich der HTML-zu-Markdown-Konverter](/blog/best-html-to-markdown-converters) behandelt, welche Erweiterung was tut; der Punkt hier ist, dass die Extraktion und nicht die Konvertierung das ist, was sie besser anfühlen lässt als ein nacktes Werkzeug.

**Nehmen Sie das gewünschte Element aus der Konsole.** Öffnen Sie die Entwicklerwerkzeuge, finden Sie das Element, das den Artikel enthält, und kopieren Sie sein Markup:

```js
// In der Browser-Konsole. Wählen Sie den Selektor, der den Artikel wirklich umschließt.
copy(document.querySelector('main').outerHTML)
```

`copy()` ist eine Konsolenfunktion der DevTools von Chrome und Edge; sie legt ihr Argument in die Zwischenablage. Fügen Sie das Ergebnis in eine Datei ein und konvertieren Sie diese. Der ganze Wert dieses Wegs liegt im Selektor: Sie haben den Artikel von Hand benannt, was genauer ist als jede Heuristik, und es dauert etwa fünfzehn Sekunden, sobald Sie die Seite kennen. Für eine Seite, die Sie wiederholt konvertieren, schreiben Sie den Selektor auf. `article`, `main`, `[role="main"]` und `.post-content` decken erstaunlich viel des Webs ab.

**Speichern und konvertieren.** Nehmen Sie den Speicherbefehl des Browsers und behandeln Sie das Ergebnis dann als Datei auf der Platte. Das ist der langsamste Weg zu einem guten Ergebnis, denn die gespeicherte Datei enthält alles: den Kopf, die Navigation, die Abo-Aufforderung, die Leiste mit verwandten Artikeln, den Kommentarbereich und einen Fuß mit sechzig Links. Es ist trotzdem der richtige Weg, wenn Sie die Seite genau so brauchen, wie sie war, samt der Teile, die ein Extraktor verwerfen würde.

| Weg | Aufwand pro Seite | Verkraftet JavaScript-Seiten | Behält die ganze Seite |
| --- | --- | --- | --- |
| Clipper-Erweiterung | Zwei Klicks | Ja | Nein, mit Absicht |
| Selektor in der Konsole | Fünfzehn Sekunden | Ja | Nur, was Sie ausgewählt haben |
| Speichern, dann konvertieren | Eine Minute, plus Aufräumen | Hängt vom Speichermodus ab | Ja, alles davon |
| Leseansicht, dann speichern | Zwei Klicks | Ja | Nein |

Die letzte Zeile ist es wert, gekannt zu werden. Die Leseansicht von Firefox baut auf Mozillas Readability-Bibliothek auf, dieselbe Extraktionsmaschine, die die meisten Clipper verwenden. Die Leseansicht einzuschalten und dann zu speichern gibt Ihnen eine bereinigte Seite, ohne irgendetwas zu installieren.

**Nehmen Sie das, wenn:** die Seite vor Ihnen liegt. Wenn Sie es täglich tun, installieren Sie einen Clipper und denken Sie nicht mehr darüber nach.

### Eine HTML-Zeichenkette im Code

Sobald das HTML eine Variable ist, ist die Konvertierung ein Funktionsaufruf, und die interessante Arbeit ist die Konfiguration. Jede Bibliothek dieser Art gibt Ihnen drei Hebel: welche Elemente ganz wegfallen, welche als rohes HTML bleiben und wie der Rest ausgegeben wird.

In JavaScript ist Turndown die Standardwahl und die, an der andere Werkzeuge gemessen werden. Es ist MIT-lizenziert, und seine API ist klein:

```js
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const turndown = new TurndownService({
  headingStyle: 'atx',        // "## Überschrift", nicht die unterstrichene Form
  codeBlockStyle: 'fenced',   // ``` Zäune, keine Einrückung um vier Zeichen
  bulletListMarker: '-',
  linkStyle: 'inlined',
});

turndown.use(gfm);                                  // Tabellen und Durchgestrichenes
turndown.remove(['script', 'style', 'nav', 'footer']); // weg, nicht konvertiert

const markdown = turndown.turndown(html);
```

Drei dieser Zeilen sind die, die zählen. `use(gfm)` fügt die Regeln von `turndown-plugin-gfm` für Tabellen und Durchgestrichenes hinzu — ohne es hat Turndown keine Tabellenunterstützung, und ein `<table>` kommt als rohes HTML oder als Textfluss durch, je nach Ihren anderen Einstellungen. `remove()` löscht Elemente samt Inhalt vor der Konvertierung, und das ist Ihr Aufräumschritt. Und `addRule()`, das nicht gezeigt ist, erlaubt es, ein bestimmtes Muster auf bestimmtes Markdown abzubilden: ein `<div class="warning">` auf ein Blockzitat, ein `<figcaption>` auf Kursives unter dem Bild, eine bekannte Komponente auf einen eingezäunten Block.

Die Alternative in JavaScript ist node-html-markdown, das seinen eigenen HTML-Parser mitbringt statt ein DOM zu verlangen. Das ist wichtig, wenn der Code irgendwo ohne DOM läuft — eine Serverless-Funktion, ein CLI, ein Worker — denn die DOM-abhängige Option würde bedeuten, jsdom an den Build zu nageln. Es ist MIT-lizenziert und verkraftet Tabellen und Durchgestrichenes selbst.

In Python gibt es zwei ausgereifte Optionen mit verschiedenen Zielen. markdownify ist MIT-lizenziert, baut auf BeautifulSoup auf und zielt auf treue Struktur: `md(html, heading_style="ATX", strip=['a'])` konvertiert, wobei `strip` die zu entfernenden Tags nennt und `convert` die einzigen zu behaltenden. Es hat Optionen für Listenzeichen, eine angenommene Code-Sprache für `<pre>`-Blöcke, Absatzumbruch und Kopfzeilen-Erkennung bei Tabellen ohne Kopfzeile. html2text ist GPLv3 und zielt auf lesbaren Text: es installiert ein Kommandozeilenwerkzeug gleichen Namens und nimmt Flags wie `--ignore-links`, `--reference-links`, `--mark-code` und `--escape-all`.

| Bibliothek | Sprache | Lizenz | Aufräum-Hebel | Tabellen |
| --- | --- | --- | --- | --- |
| Turndown | JavaScript | MIT | `remove()`, `keep()`, `addRule()` | Über `turndown-plugin-gfm` |
| node-html-markdown | JavaScript | MIT | Eigene Übersetzer | Eingebaut |
| markdownify | Python | MIT | `strip=[]`, `convert=[]` | Eingebaut |
| html2text | Python | GPLv3 | Flags im Stil von `--ignore-links`, `--ignore-images` | Begrenzt; es zielt auf lesbaren Text |
| Pandoc | Beliebig, über die Shell | GPL | `-t gfm-raw_html`, `--sandbox` | Eingebaut |

Wenn die Konvertierung in einem Job laufen muss statt auf einem Rechner, den Sie verwalten, nimmt ein über HTTP erreichbarer Konverter die Installation vom Runner. HTML an `POST /api/v1/documents?kind=html-to-markdown` zu schicken konvertiert den Rumpf und behält das Ergebnis; der Anfragerumpf ist bei 4 MB gedeckelt, weil eine Vercel-Funktion einen größeren mit einem nackten 413 ablehnt, den kein Anwendungscode je sieht.

**Nehmen Sie das, wenn:** die Konvertierung mehr als einmal passiert, oder ohne dass ein Mensch zusieht. Schreiben Sie die Aufräumregeln einmal, im Code, wo sie überprüfbar sind.

### Eine ganze Website

Das ist der Fall, in dem der ehrliche Rat meist „machen Sie etwas anderes" lautet. Wenn die Website Ihnen gehört, ist das HTML die Build-Ausgabe, und Sie konvertieren das falsche Artefakt. Die Quelle — die Vorlagen plus das, worin der Inhalt liegt — ist näher an Markdown als die dargestellten Seiten, und dargestelltes HTML zurückzuwandeln heißt, Struktur wiederherzustellen, die Ihr eigener Build bereits kennt. Sehen Sie zuerst nach einem Export. Ein CMS mit einem Exportformat, eine Datenbank mit einer Inhaltstabelle, ein Repository mit der Quelle darin: alle drei sind besser, als die eigene Website abzugrasen.

Wenn Sie wirklich nur die dargestellten Seiten haben, ist die Reihenfolge fest, und einen Schritt zu überspringen kostet mehr, als ihn zu tun.

1. **Spiegeln.** Bringen Sie die Seiten auf die Platte, bevor Sie irgendetwas konvertieren, damit die Konvertierung wiederholbar ist und Sie nicht bei jedem Versuch neu abrufen. `wget --mirror --page-requisites --convert-links --adjust-extension --no-parent https://example.com/docs/` geht den Bereich durch, bringt die Assets mit, schreibt Links auf die lokalen Kopien um und bleibt innerhalb des genannten Pfads. Prüfen Sie zuerst die Nutzungsbedingungen der Seite und ihre `robots.txt`; „ich könnte es abrufen" und „ich darf es abrufen" sind verschiedene Fragen.
2. **Bekommen Sie die Liste richtig.** Eine Sitemap ist eine bessere Quelle für URLs als ein Crawl, denn sie ist die Antwort der Seite selbst auf „welche Seiten existieren", und sie führt Sie nicht in einen Kalender mit unendlich vielen Monaten.
3. **Extrahieren.** Isolieren Sie pro Seite den Inhalt. Entweder ein CSS-Selektor, den Sie von Hand ermittelt haben — am besten, wenn die Seite eine Vorlage verwendet — oder ein Extraktor. Mozillas Readability ist Apache-2.0-lizenziert, nimmt ein DOM-Dokument und gibt ein Objekt mit `title`, `content`, `textContent`, `excerpt`, `byline`, `lang` und mehr zurück. Es braucht ein echtes DOM, in Node kombinieren Sie es also mit jsdom. Sein Begleiter `isProbablyReaderable` liefert einen schnellen Wahrheitswert dafür, ob ein Dokument es überhaupt wert ist, ihm übergeben zu werden — so überspringen Sie die Übersichtsseiten automatisch (geprüft auf github.com/mozilla/readability, 8. September 2026).
4. **Konvertieren.** Jetzt läuft der Konverter, und jetzt ist es der langweilige Schritt, der es von Anfang an hätte sein sollen.
5. **Die Links richten.** Jeder interne Link im gespiegelten HTML zeigt auf eine URL-Struktur, die nicht mehr existiert. Entscheiden Sie die Zuordnung von alter URL zu neuem Dateipfad einmal, wenden Sie sie auf jedes Dokument an und prüfen Sie eine Stichprobe.

| Schritt | Was das Überspringen kostet |
| --- | --- |
| Auf die Platte spiegeln | Die ganze Website bei jeder Regeländerung neu abrufen |
| Sitemap statt Crawl | Doppelte Seiten, paginierte Archive, unendliche Kalender |
| Extrahieren | Tausend Dokumente, die alle mit denselben vierzig Zeilen Navigation beginnen |
| Konvertieren | — |
| Links umschreiben | Ein Korpus von Dokumenten, die alle auf nichts verweisen |

**Nehmen Sie das, wenn:** Sie keinen Zugriff auf die Quelle haben und den Inhalt trotzdem brauchen — eine Website, die abgeschaltet wird, die Dokumentation eines Anbieters, die Sie behalten dürfen, ein Archiv. Rechnen Sie mit einem Tag, nicht einer Stunde, und erwarten Sie, dass die Selektorarbeit pro Vorlage anfällt.

## Das Mobiliar vorher heraussortieren

Das ist der Schritt, der über das Ergebnis entscheidet, und der, für den keine Vergleichstabelle eine Spalte hat. Der Befund ist über alle Wege oben hinweg gleich: der Unterschied zwischen einer guten und einer schlechten Konvertierung ist fast nie der Konverter. Er ist, ob die Eingabe das Dokument war.

Denken Sie an eine echte Seite. Der Artikel, den Sie wollen, sind vielleicht 15 % der Elemente. Der Rest ist ein Seitenkopf, eine Hauptnavigation, eine Nebennavigation, ein Cookie-Einwilligungsdialog, ein Newsletter-Formular, eine Teilen-Reihe, eine Leiste mit verwandten Artikeln, ein Kommentarstrang, ein Fuß mit einer Sitemap darin und ein rechtlicher Hinweis. Ein Konverter übersetzt all das treu, in Dokumentreihenfolge, was den Artikel irgendwo in die Mitte einer sehr langen Datei setzt. Die Ausgabe ist korrekt und wertlos, und der Leser beschuldigt das Werkzeug.

Es gibt vier Arten zu schneiden, in absteigender Güte.

**Benennen Sie das Element, das Sie wollen.** Ein Selektor — `main`, `article`, `#content`, `.markdown-body` — ist die genaueste verfügbare Methode, weil Sie die Seite angesehen und entschieden haben. Sie hat eine Einschränkung: sie gilt pro Seite, manchmal pro Vorlage, und sie bricht, wenn die Seite neu gestaltet wird. Für eine Handvoll Seiten, die Sie oft konvertieren, ist das unschlagbar und dauert Sekunden.

**Lassen Sie einen Extraktor laufen.** Readability und seine Verwandten bewerten die Elemente eines Dokuments danach, wie viel prosaähnlichen Text sie im Verhältnis zu Markup und Linkdichte enthalten, und geben den Gewinner zurück. Das verallgemeinert, was der ganze Punkt ist: es funktioniert auf einer Seite, die Sie nie gesehen haben, ohne Konfiguration. Es rät auch gelegentlich falsch, am häufigsten bei Seiten, die überhaupt keine Artikel sind — Übersichtsseiten, Dashboards, Suchergebnisse — wo es keinen einzelnen Prosablock zu finden gibt.

**Entfernen Sie die Elemente, die Sie nicht wollen.** Statt zu benennen, was bleibt, benennen Sie, was wegfällt: `script`, `style`, `nav`, `footer`, `header`, `aside`, `form`, `iframe`, `noscript`, `svg`. Das ist es, was ein Allzweck-Konverter tun kann, ohne irgendetwas über Ihre Seite zu wissen, und es erwischt das meiste Mobiliar auf einer Seite, die mit semantischen Elementen gebaut ist. Es erwischt nichts davon auf einer Seite, die vollständig aus `<div>`-Elementen gebaut ist, und das ist ein großer Teil des Webs.

**Richten Sie es hinterher.** Konvertieren Sie alles und löschen Sie dann das Markdown, das Sie nicht wollten. Das ist für ein Dokument in Ordnung und für hundert nicht zu verteidigen, und es ist die Voreinstellung, weil es vorab keine Entscheidung verlangt. Der Preis ist, dass Sie dieselbe Änderung einmal pro Dokument machen und sie nicht neu ausführen können, wenn Sie Ihre Regeln verbessern.

| Methode | Genauigkeit | Verallgemeinert | Aufwand |
| --- | --- | --- | --- |
| CSS-Selektor, den Sie gewählt haben | Am höchsten | Nein — pro Seite | Sekunden, sobald Sie die Seite kennen |
| Extraktor (Readability und ähnliche) | Gut bei Artikeln, schwach bei allem anderen | Ja | Eine Installation und ein DOM |
| Liste zu entfernender Elemente | Gut bei semantischem HTML, schwach bei `<div>`-Suppe | Ja | Keiner; Konverter tun es für Sie |
| Das Markdown hinterher bearbeiten | Im Prinzip perfekt | Nein | Pro Dokument, für immer |

Eine Warnung davor, zu hart aufzuräumen. `<script>` und `<style>` sollten immer weg — Markdown kann keines von beiden ausdrücken, und ein Skript-Tag in der Eingabe ist ein Skript-Tag, das einen Ort zum Ausführen sucht. Aber `<aside>` enthält manchmal ein Zitat, das zum Artikel gehört, `<header>` innerhalb eines `<article>`-Elements ist oft der Titel und die Verfasserzeile statt des Seitenkopfs, und `<figure>` trägt Bilder mit ihren Beschriftungen. Eine Entfernungsliste ist ein stumpfes Werkzeug. Sehen Sie sich ein konvertiertes Dokument an, bevor Sie sie über tausend laufen lassen.

## Was überlebt, und was nicht kann

Markdown ist eine kleine Sprache, mit Absicht. HTML ist es nicht. Die Konvertierung ist ein Abriss mit einer Liste dessen, was zu behalten ist, und es hilft, die Liste vorher zu kennen statt sie in der Ausgabe zu entdecken.

| Konstrukt | Überlebt? | Was tatsächlich passiert |
| --- | --- | --- |
| Überschriften `h1`–`h6` | Ja | Werden `#` bis `######`, Ebenen bleiben |
| Absätze, Betonung, Fettes | Ja | Überall verlässlich |
| Links | Ja, als Text | Die URL wird wörtlich übernommen, relative Pfade inklusive |
| Bilder | Ja, als Verweis | Das `src` wird wörtlich übernommen; `width`, Ausrichtung und `srcset` sind weg |
| Ungeordnete und geordnete Listen | Ja | Verschachtelung überlebt; eigene Nummerierung und `start`-Attribute meist nicht |
| Blockzitate | Ja | Unkompliziert |
| Codeblöcke | Meist | Eine `language-*`-Klasse wird zur Zaunmarkierung, wenn der Konverter sie liest |
| Inline-Code | Ja | Backticks |
| Einfache Tabellen | Mit GFM | Nur ein flaches Gitter; braucht einen Dialekt oder ein Plugin mit Tabellen |
| Trennlinien | Ja | `---` |
| Durchgestrichenes | Mit GFM | Sonst verworfen oder als rohes HTML behalten |
| Aufgabenlisten | Manchmal | Ein Checkbox-`<input>` in einem Listenelement; viele Konverter ignorieren es |
| Definitionslisten | Selten | Nicht in CommonMark oder GFM; angenähert oder verworfen |
| Fußnoten | Selten | Eine Erweiterung in jedem Dialekt, der sie hat |
| Layout — Spalten, Umflüsse, Breiten | Nein | Wird eine Spalte in Dokumentreihenfolge |
| Klassen, IDs, Inline-Stile | Nein | Verworfen, samt dem, was sie signalisierten |
| Verschachtelte Tabellen, `rowspan`, `colspan` | Nein | Abgeflacht, verworfen oder als rohes HTML gelassen |
| Formulare, Knöpfe, `<details>`, Reiter | Nein | Verworfen oder als rohes HTML ausgegeben |
| Eingebettetes Video, Canvas, SVG | Nein | Ein Link, im besten Fall |
| Kommentare, Skripte, Stylesheets | Nein | Entfernt, und zu Recht |

Vier dieser Zeilen verdienen einen Satz mehr.

**Tabellen sind das lauteste Scheitern.** Sie stehen nicht in der CommonMark-Spezifikation, ein Konverter muss GFM-Tabellen also absichtlich umsetzen. Hat er das nicht, kommt ein `<table>` als Absatzfolge oder als rohes HTML mitten in Ihrem Dokument an. Hat er es, kommt ein einfaches Gitter perfekt durch und ein kompliziertes nicht, denn GFM-Tabellen haben keine übergreifenden Zellen, keinen Blockinhalt und keine Verschachtelung. [Was mit Tabellen beim Übergang passiert](/blog/markdown-tables-that-survive-conversion), ist das Nützlichste, was Sie an einem echten Dokument testen können, bevor Sie sich auf einen Weg festlegen.

**Codeblöcke hängen am Highlighter.** Ein einfacher `<pre><code>`-Block wandelt sich sauber um. Ein Block, den ein Syntax-Highlighter in hunderte `<span>`-Elemente umgeschrieben hat, wird zu einem Zaun, wenn der Konverter mit `<pre>` vernünftig umgeht, und zu einem Durcheinander verirrter Zeichen, wenn nicht. Die Sprache steht normalerweise in einem Klassennamen, und sie zu lesen ist optionales Verhalten. [Die Einzelheiten zu Codeblöcken und ihren Info-Strings](/blog/code-blocks-in-markdown) sind es wert, an einem echten Beispiel geprüft zu werden.

**Links und Bilder überleben als Zeichenketten, nicht als funktionierende Verweise.** Das ist das Scheitern, das wie Erfolg aussieht. Jeder relative Pfad wird zum gleichen relativen Pfad und löst nun von einem anderen Ort aus auf. Wenn das Markdown in ein Repository, ein Wiki oder einen Notizspeicher geht, brauchen Sie einen Umschreibeschritt, und [Links und Bilder, die nach der Konvertierung noch funktionieren](/blog/images-and-links-that-still-work), passieren nicht von selbst.

**Rohes HTML ist eine Entscheidung, die Sie treffen, ob Sie es merken oder nicht.** Manche Konverter geben HTML für alles aus, was sie nicht ausdrücken können. Das behält die Information und macht das Markdown weniger portabel: es überlebt, wenn der nächste Renderer rohes HTML erlaubt, und wird zu sichtbarem Tag-Salat, wenn er es stattdessen maskiert. Schlimmer noch: rohes HTML, das durch eine Konvertierung getragen wird, trägt mit, was darin war. Kam die Quelle von außen, hält das Markdown jetzt Angriffsfläche für den nächsten Renderer bereit — und [das Bereinigen muss dort passieren, wo das HTML dargestellt wird](/blog/sanitising-markdown-safely), nicht dort, wo es konvertiert wurde.

## Wo die offensichtliche Antwort scheitert

Die offensichtliche Antwort ist „installieren Sie Turndown" oder „führen Sie Pandoc aus", und für die Mehrheit der Dateien ist sie richtig. Hier ist, wo sie es nicht ist, und was jedes Scheitern kostet.

**Wenn die Seite nicht das Dokument ist.** Oben behandelt und der Wiederholung wert, denn darauf geht die meiste schlechte Ausgabe zurück. Ein nackter Konverter auf einer gespeicherten Seite erzeugt eine korrekte Übersetzung einer Website. Der Preis ist nicht eine schlechte Datei — sondern dass Sie es erst merken, wenn Sie sie öffnen, und in der Menge werden Sie alles konvertiert haben, bevor Sie es merken.

**Wenn das HTML auf dem Server nie existierte.** Eine clientseitig dargestellte Seite, mit `curl` abgerufen, liefert eine Hülle. Der Preis, das nicht zu wissen, ist ein diagnostischer Umweg: Sie werden drei Konverter testen, drei leere Dateien erhalten und schließen, dass HTML zu Markdown kaputt ist. Das Anzeichen ist, dass die abgerufene Quelle kurz und voller `<script src=...>` ist. Die Abhilfe ist ein Browser, live oder headless.

**Wenn die Semantik im CSS lag.** Eine Seite, deren Hinweiskästen, Warnungen und Veraltungsvermerke nur durch Klassennamen markiert sind, verliert jeden einzelnen davon. Die Absätze sind alle da, und der Leser weiß nicht mehr, welcher davon zählt. Eine Regel pro Klasse behebt das — Turndowns `addRule()`, die Tag-Optionen von markdownify — zum Preis einer Regel pro Klasse pro Seite, von Ihnen geschrieben. Es gibt keine allgemeine Lösung, weil es keine allgemeine Konvention gibt.

**Wenn das Ziel strenger ist als die Quelle.** Konvertieren Sie mit einem Werkzeug, das GFM ausgibt, und stellen Sie dann mit einem strengen CommonMark-Parser dar, und Ihre Tabellen werden zu Absätzen aus Pipe-Zeichen. Der Dialekt der Ausgabe muss zum Dialekt dessen passen, was sie darstellen wird, und das ist eine Entscheidung, keine Voreinstellung. Der Preis dafür, es falsch zu machen, ist ein Dokument, das an einem Ort richtig aussah und am nächsten falsch.

**Wenn das Dokument nie Prosa war.** Eine E-Mail-Vorlage, ein Dashboard, eine als Gitter gesetzte Preisseite, ein Formular. Das sind nicht Artikel in HTML-Kleidern; das Layout ist der Inhalt. Sie zu konvertieren erzeugt eine Liste von Wörtern in der Reihenfolge, in der sie im Markup stehen, und das ist nicht die Reihenfolge, in der irgendwer sie gelesen hat. Das Markdown ist keine verlustbehaftete Kopie — es ist eine falsche, und der ehrliche Schritt ist, neu zu bauen statt zu konvertieren.

**Wenn Sie Ihre eigene Build-Ausgabe konvertieren.** Wenn die Website Ihnen gehört, heißt dargestelltes HTML zurück nach Markdown zu wandeln, Information wegzuwerfen, die Ihr Build schon hatte, und dann dafür zu zahlen, sie zu erraten. Der Preis ist subtil: das Ergebnis ist zu 90 % richtig, es geht also raus, und die fehlenden 10 % entdecken die Leser über die folgenden Monate.

## Wie Sie wählen

1. **Finden Sie das HTML, bevor Sie das Werkzeug finden.** Ob die Bytes aus einer Datei, einem Speichern, einem Abruf oder einem lebenden DOM kommen, entscheidet die ganze Methode — und zuerst eine Bibliothek zu wählen heißt, später zu entdecken, dass sie die gemeinte Seite nicht sehen kann.
2. **Konvertieren Sie ein schwieriges Dokument, bevor Sie irgendwelche anderen konvertieren.** Nicht das einfachste — das mit einer Tabelle, einem Codeblock und einem Hinweiskasten darin. Was diese drei behält, behält fast alles andere, und Sie lernen es in einer Minute statt nach zweihundert Dateien.
3. **Entscheiden Sie den Aufräumschritt ausdrücklich.** Selektor, Extraktor, Entfernungsliste oder Bearbeiten von Hand: wählen Sie jetzt eines. Es hinterher zu wählen heißt, alles zweimal zu konvertieren, und Bearbeiten von Hand skaliert nicht über etwa zehn Dokumente.
4. **Passen Sie den Dialekt zum Ziel.** Wenn das Markdown irgendwohin geht, das nur CommonMark kann, kommen Tabellen und Durchgestrichenes nicht an, so gut der Konverter sie auch ausgegeben hat.
5. **Entscheiden Sie, was mit dem passiert, was Markdown nicht ausdrücken kann.** Verworfen, angenähert oder als rohes HTML behalten. Rohes HTML in einem Dokument zu behalten, das zu einem strengen Renderer geht, ist dasselbe, wie es zu beschädigen.
6. **Prüfen Sie die Links und Bilder, nicht nur den Text.** Öffnen Sie drei davon vom neuen Ort der konvertierten Datei aus. Dass relative Pfade zu relativen Pfaden werden, ist der Mangel, der jede Sichtprüfung übersteht, bis jemand anderes die Datei öffnet.
7. **Rechnen Sie die Konvertierungen gegen die Installationen.** Eine Datei rechtfertigt keinen Paketmanager und keinen Abhängigkeitsbaum. Ein nächtlicher Job rechtfertigt keinen Browser-Tab und keinen Menschen, der darin klickt.

## Fazit

HTML gut in Markdown umzuwandeln ist überwiegend eine Frage davon, eine Sache vor der Konvertierung zu tun — und wenn das, was Sie umwandeln, eine Seite im Web ist statt einer Datei, [lesen Sie zuerst das](/blog/save-a-web-page-as-markdown). Die eine Sache: zu entscheiden, welcher Teil des HTML das Dokument ist, und mit welcher Methode. Benennen Sie ihn mit einem Selektor, wenn Sie die Seite kennen, geben Sie ihn einem Extraktor, wenn nicht, und sortieren Sie in jedem Fall das Mobiliar heraus. Danach übernimmt jedes Werkzeug hier die Übersetzung — Turndown in JavaScript, markdownify oder html2text in Python, Pandoc, wenn die Ausgabe mehr als Markdown sein muss, oder [die HTML-zu-Markdown-Konvertierung von TransformPipe im Browser](/blog/best-html-to-markdown-converters), wenn Sie eine Datei haben und nichts installieren wollen. Was nicht mitkommt, sind das Layout, die Gestaltung und alles, was ein Klassenname leise signalisiert hat. Das ist kein Mangel des Konverters; es ist die Definition von Markdown und der Grund, warum die Datei am anderen Ende lesbar ist.

## FAQ

### Wie wandle ich eine HTML-Datei in Markdown um, ohne etwas zu installieren?

Nehmen Sie einen Konverter, der im Browser läuft: Seite öffnen, die `.html`-Datei ablegen, die `.md` herunterladen. Bei einem Werkzeug im Browser wird die Datei nie hochgeladen, was Sie überprüfen können, indem Sie beim Konvertieren den Netzwerk-Tab beobachten. Ist die Datei eine gespeicherte Webseite statt eines sauberen Fragments, rechnen Sie damit, hinterher etwas Navigation zu löschen — es sei denn, das Werkzeug entfernt sie für Sie.

### Wie lautet der Befehl, um HTML in Markdown umzuwandeln?

`pandoc -f html -t gfm --wrap=none page.html -o page.md` ist die allgemeine Antwort. Ergänzen Sie `--extract-media=media`, um Bilder herauszuziehen und ihre Verweise umzuschreiben, und `-t gfm-raw_html`, um Konstrukte zu verwerfen, die Pandoc nicht ausdrücken kann, statt sie als HTML-Tags durchzulassen. Pandoc nimmt an der Stelle des Dateinamens auch eine URL.

### Warum ist mein konvertiertes Markdown voller Navigation und Cookie-Hinweise?

Weil Sie die Seite konvertiert haben statt des Artikels. Konverter übersetzen jedes Element, das Sie ihnen geben, und eine gespeicherte Seite ist überwiegend nicht der Artikel. Benennen Sie entweder das Inhaltselement mit einem CSS-Selektor, lassen Sie zuerst einen Extraktor wie Readability darüber laufen, oder nehmen Sie einen Konverter, der strukturelle Elemente entfernt, bevor er beginnt.

### Kann ich eine Seite konvertieren, die nur in JavaScript entsteht?

Nicht durch Abrufen. `curl` und `wget` erhalten, was der Server gesendet hat, und das ist bei einer clientseitig dargestellten Seite eine App-Hülle und ein Skript-Tag. Sie brauchen das dargestellte DOM: kopieren Sie das Element aus der Browser-Konsole, nehmen Sie eine Clipper-Erweiterung, oder steuern Sie einen Headless-Browser und nehmen Sie `outerHTML`, sobald die Seite zur Ruhe gekommen ist.

### Behalten HTML-zu-Markdown-Konverter Tabellen?

Einfache, wenn der Konverter GFM-Tabellen umsetzt — manche brauchen ein Plugin, etwa `turndown-plugin-gfm` für Turndown. Eine komplizierte Tabelle behält nichts, denn GFM-Tabellen sind ein flaches Gitter ohne übergreifende Zellen, ohne Blockinhalt und ohne Verschachtelung. Konvertieren Sie eine echte Tabelle und sehen Sie sie an, bevor Sie einem Weg vertrauen.

### Wie wandle ich eine ganze Website in Markdown um?

Spiegeln Sie sie zuerst auf die Platte, etwa mit `wget --mirror --page-requisites --no-parent`, nehmen Sie die URL-Liste aus der Sitemap statt aus einem Crawl, extrahieren Sie den Inhalt jeder Seite, konvertieren Sie, und schreiben Sie dann die internen Links auf die neuen Pfade um. Prüfen Sie vorher die Nutzungsbedingungen der Seite. Wenn die Website Ihnen gehört, konvertieren Sie stattdessen die Quelle — das dargestellte HTML hat Struktur schon weggeworfen, die Sie sonst erraten müssten.

### Was passiert mit CSS, Klassen und Inline-Stilen?

Sie werden verworfen, denn Markdown hat keine Gestaltung. Das ist meist, was Sie wollen, und gelegentlich ein echter Verlust, denn ein Klassenname ist oft das Einzige, was einen Warnkasten, einen Hinweis oder ein hervorgehobenes Zitat markiert. Konverter mit Regeln pro Element können eine bekannte Klasse auf ein Blockzitat oder ein fettes Präfix abbilden, aber diese Regel schreiben Sie selbst, pro Seite.
