---
title: "Einen Markdown-Konverter für die Kommandozeile wählen und ohne Überraschungen betreiben"
description: "Markdown im Terminal in HTML umwandeln: Pandoc, cmark-gfm, comrak, Node, Python, ein API-Aufruf, und die Anführungszeichen und Globs, die in CI scheitern"
date: 2026-08-26
tag: Workflow
keywords: markdown konverter kommandozeile, markdown zu html kommandozeile, markdown in html umwandeln terminal, markdown zu html skript, markdown zu html node, markdown stapelweise konvertieren, ordner mit markdown dateien konvertieren, pandoc eigenständiges html
---

Ein Konverter im Browser ist das richtige Werkzeug für eine Datei. Er hört in dem Moment auf, das richtige Werkzeug zu sein, in dem die Konvertierung bei jedem Commit passieren muss, oder wenn ein Ordner vierzig Dateien enthält und niemand vierzig Tabs möchte. Ab da wollen Sie einen Befehl — etwas, das ein Makefile, ein Shell-Skript oder ein CI-Job aufrufen kann, ohne dass jemand irgendwo klickt.

Das Problem ist, dass ein funktionierender Befehl und ein Befehl, der weiter funktioniert, zwei verschiedene Dinge sind. Die Zeile, die Sie einmal eintippen, erfolgreich laufen sehen und in ein Skript einfügen, ist dieselbe Zeile, die tausendmal unbeaufsichtigt laufen wird, gegen Dateinamen, die Sie nicht ausgesucht haben, auf einem Runner mit einer anderen Shell, einer anderen Locale und ohne installiertes Pandoc. Fast jede Konvertierung im Terminal, die in der Produktion scheitert, scheitert aus einem Grund, der mit Markdown nichts zu tun hat.

Dieser Text hat deshalb zwei Hälften. Zuerst die Konverter: was jeder einzelne ist, was er tatsächlich ausgibt und welche Flags den Unterschied zwischen einem Fragment und einem Dokument machen. Dann die Teile, die Leute falsch machen — Anführungszeichen, Globs, wo die Ausgabe landet, was Ihr Exit-Code wirklich bedeutet und was die Installation eines Konverters bei jedem einzelnen CI-Lauf kostet.

### Kurzfassung

Wenn ein Konverter schon auf der Maschine liegt, genügt eine Zeile: `pandoc -f gfm -t html -s --embed-resources README.md -o README.html` erzeugt ein vollständiges Dokument in einer Datei statt eines Fragments, und `--sandbox` macht es sicherer, ihn auf eine Datei zu richten, die Sie nicht selbst geschrieben haben. Wenn nichts installiert ist und das so bleiben soll, schlagen ein fünfzeiliges Node-Skript über `marked`, ein Aufruf von `python -m markdown` oder ein `curl`-Post an eine HTTP-API alle die Installation eines Dokumentkonverters, den Sie einmal verwenden werden. Die Fehler stecken fast nie im Parser: Es sind Dateinamen ohne Anführungszeichen, ein Glob, der `10-api.md` vor `2-setup.md` sortiert hat, Ausgabe, die in den falschen Baum geschrieben wurde, und eine Pipeline, die Erfolg meldete, weil `tee` erfolgreich war. In CI sind die ehrlichen Kosten von Pandoc die Installation bei jedem Lauf, weshalb ein statisches Binary, ein zwischengespeichertes Image oder ein API-Aufruf schon nach reiner Laufzeit oft gewinnt.

## Warum das Terminal die Frage verändert

In einem Browser trifft ein Markdown-Konverter vier Entscheidungen für Sie und zeigt Ihnen das Ergebnis sofort. Im Terminal trifft er dieselben vier Entscheidungen stillschweigend, und Sie erfahren es Wochen später.

**Welchen Dialekt er parst.** Reines CommonMark hat keine Tabellen, keine Aufgabenlisten, kein Durchgestrichenes und keine Autolinks. GitHub Flavored Markdown hat alle vier. Nahezu jedes Werkzeug für die Kommandozeile hat hier eine Voreinstellung, und diese Voreinstellung ist selten GFM: Pandocs Standardleser ist sein eigener erweiterter Dialekt, cmark-gfm kommt mit allen Erweiterungen abgeschaltet, comrak schaltet sie nur mit `--gfm` oder einem ausdrücklichen `--extension` ein. Eine Tabelle, die der Parser nicht erkennt, erzeugt keinen Fehler. Sie wird zu einem Absatz voller Pipe-Zeichen, und der Job endet mit Null.

**Ob er ein Dokument oder ein Fragment ausgibt.** Die meisten dieser Werkzeuge sind Bibliotheken mit einer dünn angeschraubten ausführbaren Datei, und eine Bibliothek gibt korrekt `<h1>Titel</h1><p>Text</p>` zurück, ohne irgendetwas darum herum. Im Browser geöffnet ist das unformatierter schwarzer Text in der Standardschrift des Browsers über die ganze Fensterbreite. Es ist gültiges HTML, und für jeden, der es bekommt, sieht es kaputt aus. Nur einige dieser Werkzeuge haben ein Flag, das es verpackt.

**Was er mit rohem HTML macht.** Markdown wurde entworfen, um HTML durchzulassen, eine `.md`-Datei kann also `<script>`, `onerror=` und `javascript:`-Links tragen. Pandoc lässt alles davon durch. marked lässt alles davon durch und sagt das in seiner eigenen Dokumentation. cmark-gfm und comrak unterdrücken es, sofern Sie nicht `--unsafe` übergeben. markdown-it maskiert es, sofern Sie nicht seine Option `html` einschalten. Kam die Datei von außerhalb Ihres Repositorys, ist diese Entscheidung das ganze Sicherheitsmodell — [Bereinigen ist eine eigene Aufgabe mit eigenen Regeln](/blog/sanitising-markdown-safely).

**Was er der Shell sagt, wenn er scheitert.** Ein Konverter, der mitten in einer Datei stirbt, lässt trotzdem eine unvollständige Datei auf der Platte, und wenn Sie ihn in eine Pipe gesteckt haben, gehört der Exit-Status der Pipeline dem letzten Befehl statt dem, der gestorben ist. Das ist der häufigste Weg, auf dem ein kaputter Build grün meldet.

Keine der vier ist exotisch. Alle vier sind unsichtbar, bis jemand die Ausgabe öffnet.

## Der schnelle Vergleich: das Merkblatt

| Werkzeug | Am besten für | Entscheidende Fähigkeit | Preis |
| --- | --- | --- | --- |
| Pandoc | Alles jenseits von HTML, und genaue Kontrolle über die Verpackung | `--standalone`, `--embed-resources`, `--template`, `--sandbox` | Kostenlos, GPL |
| cmark-gfm | Ein kleiner, schneller, vorhersagbarer GFM-Renderer | C ohne Abhängigkeiten, Erweiterungen einzeln mit `-e` | Kostenlos, BSD 2-clause |
| comrak | Ein statisches Binary mit GFM hinter einem Flag | Rust, `--gfm`, rohes HTML aus, sofern nicht `--unsafe` | Kostenlos, BSD 2-clause |
| marked CLI | Eine Konvertierung in einem Repository, das schon Node hat | `marked -o out.html` liest von der Standardeingabe | Kostenlos, MIT |
| markdown-it CLI | CommonMark-Konformität aus einer Shell | Bringt eine ausführbare Datei `markdown-it` mit; maskiert rohes HTML von Haus aus | Kostenlos, MIT |
| Ein Node-Skript | Ausgabe, die Sie bestimmen, Verpackung inklusive | Fünf Zeilen über marked oder markdown-it, kein neues Werkzeug | Kostenlos |
| Python `markdown_py` | Ein Python-Build, der schon existiert | `python -m markdown -x tables`, Erweiterungs-API | Kostenlos, BSD 3-clause |
| Go und goldmark | Ein einzelnes kreuzkompiliertes Binary für einen Runner | Nur Bibliothek; eine `main.go` mit zwanzig Zeilen wird das Werkzeug | Kostenlos, MIT |
| `curl` und eine HTTP-API | Keine lokale Werkzeugkette, und ein Link am Ende | Eine Anfrage, keine Installation, die Ausgabe kann eine lebende Seite sein | Kostenlos |
| Ein abhängigkeitsfreies CLI (`tp`) | CI-Schritte, die keinen Paketbaum mitschleppen dürfen | `login`, `push`, `list`, `rm`, `usage`, `--json` | Kostenlos |

## Jeder Markdown-Konverter für die Kommandozeile, der es wert ist

### Pandoc — am besten, wenn die Verpackung so wichtig ist wie das HTML

Pandoc ist ein Dokumentkonverter in Haskell, der rund vierzig Formate liest und schreibt. Als Markdown-Konverter für die Kommandozeile ist es mehr Werkzeug, als die Aufgabe braucht, und es ist gleichzeitig das einzige hier, das ein vollständiges, eigenständiges, mit einer Vorlage gebautes Dokument erzeugt, ohne dass Sie die Vorlagenmechanik selbst schreiben.

| Vorteile | Nachteile |
| --- | --- |
| `--standalone` und `--embed-resources` ergeben ein echtes Dokument in einer Datei | Eine große Installation, die gepinnt bleiben muss, auf jeder Maschine, die den Job ausführt |
| Vorlagen und Lua-Filter steuern die Ausgabe genau | Vorlagen sind eine zweite Sprache, die man lernen muss |
| `--sandbox` beschränkt den Dateisystemzugriff, wenn die Eingabe nicht vertrauenswürdig ist | Kein Bereinigen: rohes HTML geht unverändert bis auf die Seite durch |
| Liest GFM, CommonMark und seinen eigenen Dialekt, ausdrücklich gewählt | Seine Dialekte weichen auf Weisen voneinander ab, die Leute mitten in einer Migration überraschen |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- `-f gfm` wählt den Leser für GitHub Flavored Markdown, damit Tabellen, Aufgabenlisten, Durchgestrichenes und Autolinks geparst werden; `-f commonmark` wählt den strikten
- `-s` (`--standalone`) erzeugt „Ausgabe mit passendem Kopf und Fuß … kein Fragment", in den Worten des Handbuchs
- `--embed-resources` bettet verlinkte Stylesheets, Skripte und Bilder als `data:`-URIs ein; das ältere `--self-contained` ist inzwischen ein veraltetes Synonym für `--embed-resources --standalone`
- `--template FILE` verwendet Ihre eigene Verpackung und impliziert `--standalone`
- `-M key=value` setzt ein Metadatenfeld, `--metadata-file` liest eine ganze YAML- oder JSON-Datei davon, und ein auf der Kommandozeile übergebener Wert überschreibt einen im Dokument
- `--defaults FILE` verlagert einen langen Aufruf in eine YAML-Datei, die Sie einchecken können
- `--toc`, `-N` für nummerierte Abschnitte und `--shift-heading-level-by` erledigen die strukturellen Pflichten
- `--resource-path` sagt, wo nach Bildern gesucht wird, getrennt durch `:` unter Unix und `;` unter Windows
- `--syntax-highlighting=STYLE` wählt das Thema für die Syntaxhervorhebung — es ersetzt das inzwischen veraltete `--highlight-style` — und `--list-highlight-styles` gibt aus, was Ihr Build unterstützt
- `--file-scope` parst jede Datei einzeln, bevor sie zusammengefügt werden, was das Verhalten von Fußnoten und Links bei mehreren Eingabedateien verändert
- `--sandbox` führt die Konvertierung so aus, dass „IO-Operationen in Lesern und Schreibern auf das Lesen der auf der Kommandozeile angegebenen Dateien beschränkt" werden
- `--fail-if-warnings` verwandelt eine Warnung in einen Exit-Status ungleich Null, und das ist das Flag, das Pandoc innerhalb eines Skripts ehrlich macht

Ein vollständiges Dokument, in einem Befehl:

```bash
pandoc -f gfm -t html -s \
  --embed-resources \
  --metadata title="API reference" \
  --toc --fail-if-warnings \
  docs/api.md -o build/api.html
```

`--metadata title=` ist in der Praxis nicht optional. Ohne Titel warnt Pandoc und gibt Ihnen ein eigenständiges Dokument, in dessen `<title>` nichts Brauchbares steht, und mit `--fail-if-warnings` wird aus dieser Warnung ein Fehler — was man das erste Mal will und beim fünften Vergessen zum Rasendwerden findet. Packen Sie den ganzen Aufruf in eine `--defaults`-Datei, und das Argument hört auf, etwas zu sein, das man vergessen kann.

**Wer sollte es verwenden?** Alle, deren Ausgabe nicht nur HTML ist, alle, die die Verpackung an eine Hausvorlage anpassen müssen, und alle, die Dateien konvertieren, die sie nicht selbst geschrieben haben, denn `--sandbox` hat auf dieser Liste kein Gegenstück. Wenn HTML das einzige Ziel ist und die Verpackung keine Rolle spielt, [sind die kleineren Optionen wirklich kleiner](/blog/pandoc-alternatives-for-markdown-to-html).

### cmark-gfm — der beste kleine, vorhersagbare GFM-Renderer

cmark-gfm ist GitHubs Fork der CommonMark-Referenzimplementierung, geschrieben in normgerechtem C99 ohne externe Abhängigkeiten. Es macht eine Sache in hohem Tempo und gibt Ihnen ein Fragment ohne jede Formatierung.

| Vorteile | Nachteile |
| --- | --- |
| Keine Abhängigkeiten, es baut und cacht also fast sofort | Fragment-Ausgabe: kein Doctype, kein Head, keine Stile, nie |
| Erweiterungen sind ausdrücklich, das Verhalten ist am Befehl also ablesbar | Sie müssen sich jedes `-e`-Flag jedes Mal merken |
| Rohes HTML wird unterdrückt, sofern Sie es nicht mit `--unsafe` anfordern | Über die Distributionen hinweg uneinheitlich gepackt |
| Folgt der GFM-Spezifikation genau | Nichts jenseits von HTML und seinen eigenen AST-förmigen Formaten |

**Preis:** kostenlos, BSD-2-clause-lizenziert.

**Technische Details und Funktionen**

- `-t` / `--to FORMAT` wählt das Ausgabeformat; HTML ist das, was Sie hier wollen
- `-e` / `--extension NAME` schaltet eine Erweiterung auf einmal ein, und `--list-extensions` gibt aus, was Ihr Build tatsächlich hat
- `--unsafe` ist das, was rohes HTML und riskante Links erlaubt; ohne es werden sie entfernt, was für eine Datei von außen die richtige Voreinstellung ist
- `--hardbreaks` verwandelt einzelne Zeilenumbrüche in `<br>`, und `--smart` erzeugt typografische Anführungszeichen und Gedankenstriche
- `--width` steuert den Umbruch für die textförmigen Ausgabeformate

```bash
cmark-gfm -e table -e strikethrough -e autolink -e tasklist \
  README.md > build/README.html
```

Führen Sie `cmark-gfm --list-extensions` aus, bevor Sie diese Zeile einchecken. Erweiterungsnamen kommen aus dem Build, und ein Name, den Ihre Maschine annimmt, existiert nicht garantiert in der Version, die Ihre Distribution auf dem Runner ausliefert — was immerhin laut scheitert, statt die Tabellen stillschweigend fallen zu lassen.

**Wer sollte es verwenden?** Builds, die viele Dateien konvertieren und auf die Sekunden achten, und alle, die rohes HTML von Haus aus unterdrückt haben wollen, ohne einen eigenen Bereiniger hinzuzufügen. Nichts für jemanden, dessen Ausgabe sich so, wie sie ist, öffnen lassen muss.

### comrak — das beste einzelne statische Binary

comrak ist eine CommonMark- und GFM-Implementierung in Rust, die im Unterschied zu goldmark ein echtes Binary für die Kommandozeile mitbringt. Es ist von Haus aus konform mit CommonMark 0.31.2 und besteht die GFM-Suite vollständig (geprüft auf github.com/kivikakk/comrak, 8. September 2026), und es installiert sich mit `cargo install comrak`, aus Homebrew, pacman, dnf oder Scoop, oder als Release-Binary, das Sie einmal herunterladen.

| Vorteile | Nachteile |
| --- | --- |
| Ein statisches Binary: auf der Zielmaschine ist nichts aufzulösen | Fragment-Ausgabe, wie bei cmark-gfm |
| `--gfm` schaltet den ganzen GFM-Satz mit einem einzigen Flag ein | `cargo install` kompiliert, was beim ersten Mal langsam ist |
| Rohes HTML und riskante Links sind aus, sofern Sie nicht `--unsafe` übergeben | Aus der Quelle zu bauen braucht eine aktuelle Rust-Werkzeugkette |
| Schreibt außerdem XML und CommonMark, was für den Weg zurück nützlich ist | Kleineres Ökosystem als die Parser in JavaScript |

**Preis:** kostenlos, BSD-2-clause-lizenziert.

**Technische Details und Funktionen**

- `--gfm` schaltet Durchgestrichenes, Tabellen, Autolinks und Aufgabenlisten zusammen ein
- `--extension NAME` schaltet einzelne Erweiterungen ein, auch solche außerhalb von GFM wie Fußnoten und Hochgestelltes
- `--unsafe` erlaubt rohes HTML und gefährliche Links; beides ist von Haus aus abgeschaltet
- `--to` wählt die Ausgabe als HTML, XML oder CommonMark

```bash
comrak --gfm README.md > build/README.html
```

**Wer sollte es verwenden?** Alle, die wollen, dass die Konvertierung eine Datei ist, die man auf einen Runner, in einen Container oder auf den Laptop einer Kollegin kopieren kann, ohne einen Paketmanager einzubeziehen. Ein Release-Binary herunterzuladen und es im eigenen Werkzeugverzeichnis zu behalten ist eine legitime Strategie, und es ist das Billigste auf dieser Seite, was das Zwischenspeichern angeht.

### marked CLI — am besten, wenn das Repository schon Node hat

marked ist der kleine, schnelle Markdown-Parser in JavaScript, und wer ihn installiert, installiert auch eine ausführbare Datei `marked`. Seine eigene dokumentierte Verwendung liest von der Standardeingabe und schreibt dorthin, wo `-o` es sagt.

| Vorteile | Nachteile |
| --- | --- |
| In sehr vielen JavaScript-Projekten schon eine Abhängigkeit | Fragment-Ausgabe; die Verpackung ist Ihr Problem |
| GFM ist von Haus aus an, Tabellen funktionieren also ohne Flags | Kein Bereinigen, mit ausdrücklicher Absicht |
| `marked --help` listet die Optionen, und es sind wenige | Braucht Node auf jeder Maschine, die den Job ausführt |

**Preis:** kostenlos, MIT-lizenziert.

```bash
npx --yes marked -o build/README.html < README.md
```

Das `--yes` zählt mehr, als es aussieht. Ohne es hält `npx` auf einer Maschine ohne lokale Kopie an, um die Erlaubnis zum Holen des Pakets zu erfragen, und ein CI-Schritt, der für eine Frage anhält, hängt, bis der Job in einen Timeout läuft.

**Wer sollte es verwenden?** Projekte, die für die Darstellung innerhalb der Anwendung schon von marked abhängen und wollen, dass der Build denselben Parser verwendet, damit die Seite und die Anwendung sich über dieselbe Datei nicht widersprechen können.

### markdown-it CLI — die beste Konformität aus einer Shell

markdown-it ist der CommonMark-konforme Parser hinter der Markdown-Vorschau von VS Code, und sein Paket deklariert eine ausführbare Datei `markdown-it`, ein einfacher `npx`-Aufruf funktioniert also, ohne dass sonst etwas installiert ist.

| Vorteile | Nachteile |
| --- | --- |
| Folgt der CommonMark-Spezifikation genau | Etwas langsamer als marked |
| Maskiert rohes HTML, sofern Sie nicht die Option `html` einschalten | Fragment-Ausgabe |
| Ein echtes Plugin-Ökosystem — Fußnoten, Anker, Container | Plugins sind über die API erreichbar, nicht über die Kommandozeile |

**Preis:** kostenlos, MIT-lizenziert.

```bash
npx --yes markdown-it README.md > build/README.html
```

Das Werkzeug für die Kommandozeile ist mit Absicht schlicht. In dem Moment, in dem Sie ein Plugin wollen — Überschriften-Anker, Fußnoten, eine Container-Syntax —, haben Sie aufgehört, es zu verwenden, und angefangen, das Skript aus dem nächsten Abschnitt zu schreiben, was in Ordnung ist und fünf Zeilen kostet.

**Wer sollte es verwenden?** Alle, die rohes HTML von Haus aus maskiert und die Spezifikation befolgt haben wollen, und alle, die gerade vom Einzeiler zum Skript aufsteigen.

### Ein Node-Skript — am besten, wenn Sie die Verpackung auch wollen

Jedes Fragment-Problem auf dieser Seite verschwindet in dem Moment, in dem Sie die fünf Zeilen selbst schreiben, denn die Vorlage ist ein Template-Literal und HTML kennen Sie schon.

```js
// md2html.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const [input, output] = process.argv.slice(2);
const body = marked.parse(readFileSync(input, 'utf8'));

writeFileSync(
  output,
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${input}</title>
<style>
body{max-width:44rem;margin:2rem auto;padding:0 1rem;font:16px/1.6 system-ui,sans-serif}
table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.4rem .6rem}
pre{overflow-x:auto;background:#f6f8fa;padding:1rem;border-radius:6px}
</style>
</head>
<body>
${body}
</body>
</html>
`
);
```

| Vorteile | Nachteile |
| --- | --- |
| Die Ausgabe ist ein echtes Dokument, formatiert, wie Sie es entschieden haben | Sie besitzen es, samt seiner Fehler |
| Jeder Parser, jedes Plugin, jeder Nachbearbeitungsschritt, den Sie mögen | Braucht Node und eine Lockfile, um reproduzierbar zu bleiben |
| Kein neues Binary auf der Maschine über das hinaus, was das Repository schon hat | Bereinigen müssen Sie immer noch selbst hinzufügen |

**Preis:** kostenlos. Die Lizenz des Parsers ist in beiden Fällen MIT.

**Technische Details und Funktionen**

- Tauschen Sie `marked` gegen `markdown-it`, und Sie bekommen maskiertes rohes HTML plus Plugins, für zwei Zeilen mehr
- Fügen Sie vor dem Schreiben einen Bereiniger ein, wenn die Eingabe nicht Ihre ist; die dokumentierte Antwort für marked ist, seine Ausgabe durch DOMPurify zu schicken
- `process.exitCode = 1` innerhalb eines `catch` ist das, was das Skript in einer Pipeline brauchbar macht; ein Skript, das wirft, endet ungleich Null, aber ein Skript, das protokolliert und weitermacht, tut das nicht
- Installieren mit `npm ci`, nicht mit `npm install`, damit die Version des Parsers aus der Lockfile kommt und nicht aus dem Kalender

Widerstehen Sie dem Drang, das zu einem echten Einzeiler zusammenzupressen. `node -e` in einer einzigen Zeile heißt, dass das ganze Programm die Regeln Ihrer Shell für Anführungszeichen überleben muss, was Gegenstand eines Abschnitts weiter unten ist, und es ist die unbelohnendste Stelle auf dieser Seite, um raffiniert zu sein.

**Wer sollte es verwenden?** Alle, deren Ausgabe sich allein öffnen können muss und die dafür keinen Dokumentkonverter installieren wollen. Für die meisten Repositorys ist das, die meiste Zeit, die Antwort.

### Python und `markdown_py` — am besten innerhalb eines Python-Builds

Python-Markdown ist die seit langem etablierte Markdown-Implementierung für Python und die Maschine unter MkDocs. Wer es installiert, bekommt ein Skript `markdown_py`, und `python -m markdown` macht dasselbe, ohne dass man sich sorgen muss, ob das Skriptverzeichnis in Ihrem `PATH` steht.

| Vorteile | Nachteile |
| --- | --- |
| In den meisten Python-Dokumentationsketten schon vorhanden | Nicht in jedem Detail CommonMark-konform |
| Eine ausgereifte Erweiterungs-API, mit Erweiterungen für Tabellen und Fußnoten | Erweiterungen sind einzeln zuzuschalten, die einfache Ausgabe hat also keine Tabellen |
| Mit `-c` aus einer YAML- oder JSON-Datei konfigurierbar | Langsamer als die Implementierungen in C, Rust und Go |

**Preis:** kostenlos, BSD-3-clause-lizenziert.

**Technische Details und Funktionen**

- Die Verwendung ist `python -m markdown [options] [args]`, und das HTML geht auf die Standardausgabe
- `-x` / `--extension NAME` lädt eine Erweiterung; wiederholen Sie das Flag für jede weitere
- `-c` / `--extension_configs FILE` liest Erweiterungseinstellungen aus YAML oder JSON, und dort gehört alles hin, was Optionen hat

```bash
python -m markdown -x tables -x fenced_code -x toc \
  README.md > build/README.html
```

Ohne `-x tables` sind Ihre Tabellen Absätze voller Pipes. Das ist die häufigste Beschwerde über Python-Markdown, und es ist kein Fehler: Tabellen standen nie im ursprünglichen Markdown und nie in CommonMark, eine Implementierung, die sie hinter einem Erweiterungs-Flag hält, ist also genau statt schwierig.

**Wer sollte es verwenden?** Python-Projekte, MkDocs-Nutzer und alle, deren CI-Image schon Python hat und die für eine einzige Konvertierung nicht gern eine zweite Laufzeitumgebung hinzufügen.

### Go und goldmark — das beste Binary, um es einem Runner in die Hand zu drücken

goldmark ist ein Markdown-Parser in Go, konform mit CommonMark 0.31.2 und der Renderer, den Hugo in seiner Standardkonfiguration verwendet (geprüft auf github.com/yuin/goldmark und gohugo.io, 8. September 2026). Es ist reine Bibliothek: Es gibt keinen Befehl `goldmark` zu installieren. Was Sie stattdessen tun, ist, etwa zwanzig Zeilen zu schreiben und sie zu kompilieren, was Ihnen ein einzelnes statisches Binary gibt, für das nirgendwo eine Laufzeitumgebung installiert werden muss.

| Vorteile | Nachteile |
| --- | --- |
| Kompiliert zu einem statischen Binary, von überall kreuzkompilierbar | Überhaupt keine Kommandozeile, bis Sie eine schreiben |
| GFM in einer Erweiterung: Tabellen, Durchgestrichenes, Linkify, Aufgabenlisten | Sie pflegen das kleine Programm für immer |
| Schnell, und schon in Ihrem Stapel, wenn Sie Hugo verwenden | Weniger fertige Erweiterungen als in der Welt von JavaScript |

**Preis:** kostenlos, MIT-lizenziert.

```go
// md2html.go
package main

import (
	"bytes"
	"fmt"
	"os"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
)

func main() {
	source, err := os.ReadFile(os.Args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	md := goldmark.New(goldmark.WithExtensions(extension.GFM))

	var out bytes.Buffer
	if err := md.Convert(source, &out); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	os.Stdout.Write(out.Bytes())
}
```

**Technische Details und Funktionen**

- `extension.GFM` bündelt Tabellen, Durchgestrichenes, Linkify und Aufgabenlisten; Fußnoten, Definitionslisten und der Typograf sind eigene Erweiterungen, die Sie derselben Liste hinzufügen
- `go build` erzeugt eine Datei, und `GOOS` mit `GOARCH` kreuzkompiliert sie für den Runner, ohne Container
- Bei einem Fehlschlag einen Exit-Status ungleich Null zurückzugeben ist hier ausdrücklich, und das ist leichter richtig zu machen als in einer Shell

**Wer sollte es verwenden?** Go-Läden, Hugo-Nutzer, die wissen wollen, was ihre Inhalte darstellt, und alle, die lieber ein kompiliertes Binary einchecken als einen Paketinstallationsschritt in CI zu pflegen.

### `curl` und eine HTTP-API — am besten, wenn es keine Werkzeugkette gibt

Manchmal ist die Ausgabe überhaupt keine Datei auf der Platte. Sie ist eine Seite, die eine Kollegin öffnen kann, erzeugt auf einer Maschine ohne Node, ohne Python und ohne Erlaubnis, irgendetwas zu installieren.

| Vorteile | Nachteile |
| --- | --- |
| Über `curl` hinaus nichts zu installieren | Braucht das Netz, kann also nicht Ihr Offline-Build sein |
| Die Ausgabe kann ein lebender Link statt einer Datei zum Anhängen sein | Braucht ein Geheimnis in der Umgebung |
| Das Konvertierungsverhalten kann nicht mit einer lokalen Installation auseinanderdriften | Es gelten Raten- und Größenbegrenzungen |

**Preis:** kostenlos, einschließlich der API in einem kostenlosen Konto.

TransformPipe stellt unter `/api/v1` eine API mit widerrufbaren Schlüsseln bereit. Schicken Sie das Markdown als Body:

```bash
curl -fsS \
  -H "Authorization: Bearer $TP_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-binary @README.md \
  "https://transformpipe.com/api/v1/documents?name=README.md&share=link"
```

**Technische Details und Funktionen**

- Die Antwort ist JSON mit der Dokument-ID und, wegen `?share=link`, einer schreibgeschützten URL, die schon live ist
- `GET /api/v1/documents/:id.html` gibt außerdem die HTML-Datei zurück, wenn Sie die auf der Platte wollen
- Die Grenzen sind veröffentlicht statt geraten: 10 MB für eine Datei zum Konvertieren, 4 MB, um eine in einem Konto zu behalten, 100 MB und 500 Dokumente pro Konto und 60 Anfragen pro Minute, gezählt pro Schlüssel
- `-f` ist tragend. Ohne es endet `curl` bei einer 401 oder einer 429 mit Null und schreibt den Fehler-Body in Ihre Ausgabedatei
- `-sS` hält den Fortschrittsbalken aus Ihren Logs heraus, lässt echte Fehler aber auf stderr
- `--retry 3 --retry-connrefused` deckt den vorübergehenden Netzfehler ab, der sonst einmal im Monat einen Build ohne jeden Grund zerlegt

Vierzig Dateien bleiben mühelos unter 60 Anfragen pro Minute. Tausende brauchen ein Sleep zwischen den Aufrufen, oder stattdessen ein zusammengefügtes Dokument — und [das Zusammenfügen ist ein eigenes kleines Problem](/blog/merging-many-markdown-files), mit Überschriftenebenen und Ankerkollisionen, über die zuerst nachzudenken ist.

**Wer sollte es verwenden?** Build-Schritte, die am Ende einen teilbaren Link wollen, und jede Umgebung, in der die Installation eines Konverters entweder verboten ist oder die Minute nicht wert ist, die sie pro Lauf kostet.

### Ein abhängigkeitsfreies CLI — am besten für einen CI-Schritt, der klein bleiben muss

Die andere Form derselben Idee ist ein Werkzeug für die Kommandozeile, das die API umschließt, so geschrieben, dass seine Installation nichts weiter installiert. TransformPipes `tp` ist eine Datei Node ohne Abhängigkeiten, mit Absicht: Ein Werkzeug, das Leute in CI ausführen, sollte keinen Baum von Paketen hinter sich herziehen.

| Vorteile | Nachteile |
| --- | --- |
| Keine transitiven Abhängigkeiten zu prüfen, zu pinnen oder zwischenzuspeichern | Immer noch ein Netzaufruf und immer noch ein Geheimnis |
| Liest einen Schlüssel aus `tp login`, `TP_API_KEY` oder `--key` | Braucht ein vorhandenes Node, sonst aber nichts |
| `--json` bei jedem Befehl, damit ein Skript das Ergebnis lesen kann | Veröffentlicht ein Dokument; es ist kein lokaler Dateikonverter |

**Preis:** kostenlos.

**Technische Details und Funktionen**

- `tp push README.md --share` konvertiert und veröffentlicht und gibt den Link aus
- `tp push docs/*.md --merge --share` verkettet mehrere Dateien zu einem Dokument statt zu je einem
- `tp list`, `tp rm <id>` und `tp usage` decken den Rest ab, und `--json` bei jedem davon ist für Skripte
- `tp login` legt den Schlüssel unter `~/.config/tp/config.json` mit Modus `0600` ab; in CI setzen Sie stattdessen `TP_API_KEY`, denn ein Runner wirft sein Home-Verzeichnis weg
- Fehlschläge geben die eigenen Worte der API aus und enden ungleich Null, `set -e` fängt sie also, ohne dass Sie etwas darum herum bauen müssen

**Wer sollte es verwenden?** Alle, die die Konvertierung in eine Pipeline stecken und eine Zeile wollen statt eines `curl`-Aufrufs mit fünf Flags. Für einen Pull Request im Besonderen ist eine Action noch weniger Arbeit — [Markdown aus GitHub Actions veröffentlichen](/blog/publish-markdown-from-github-actions) nimmt die Installation ganz vom Runner.

## Wo Pandoc sich nicht mehr auszahlt

Pandoc ist die Standardempfehlung, um Markdown im Terminal zu konvertieren, und für das meiste, was Leute von ihm verlangen, ist diese Empfehlung richtig. Es lohnt sich, über die vier Stellen deutlich zu sein, an denen sie es nicht ist, denn keine davon erscheint in einem Funktionsvergleich.

**Die Installation kostet bei jedem Lauf, nicht einmalig.** Auf Ihrem Laptop installieren Sie Pandoc einmal und vergessen es. In CI installieren Sie es bei jedem Lauf, und was das kostet, hängt vollständig davon ab, wie: ein Paketmanager der Distribution, der ein Paket und seine Abhängigkeiten zieht, eine Homebrew-Installation auf einem macOS-Runner, ein Pull eines Docker-Images, oder ein zwischengespeichertes Paket, das aus dem Cache des Runners wiederhergestellt wird. Nur die letzten zwei sind schnell, und beide sind zusätzliche Konfiguration, die gepflegt werden muss. Stellen Sie das einem Schritt in einem Job gegenüber, der schon Node hat, oder einem einzelnen statischen Binary, das Sie eingecheckt haben, oder einem HTTP-Aufruf, und die Rechnung geht für eine Arbeit, deren ganzes Ergebnis eine in eine Seite verwandelte README ist, oft anders aus. Nehmen Sie keine Zahl von mir — messen Sie Ihre eigene Pipeline mit der Installation und ohne sie, je zweimal, und verwenden Sie, was Sie gemessen haben.

**Es bereinigt nicht.** Pandoc gibt treu wieder, was heißt, dass rohes HTML in der Quelle in der Ausgabe ankommt. Für Ihre eigene Dokumentation ist das eine Funktion; so bettet man ein Video oder ein `<details>`-Element ein. Für eine Datei, die aus einem Fork, von einem Kunden oder aus einem Issue-Tracker kam, ist es ein Vektor, und es gibt kein Flag `--sanitise`, nach dem man greifen könnte. `--sandbox` schützt die Maschine, die konvertiert, nicht den Browser, der das Ergebnis öffnet. Das sind verschiedene Probleme mit verschiedenen Antworten, und sie zu verwechseln ist der Weg, auf dem eine nicht vertrauenswürdige README mit intaktem Skript-Tag dargestellt endet.

**Sein Markdown ist nicht das Markdown, in dem Ihre Datei geschrieben wurde.** Pandocs Standardleser ist `markdown`, sein eigener erweiterter Dialekt, nicht GFM und nicht CommonMark. Konvertieren Sie eine README von GitHub mit dem Standardleser, und Sie bekommen Unterschiede — bei Autolinks, bei der Art, wie ein harter Zeilenumbruch erzeugt wird, bei der Frage, ob eine nackte URL zu einem Link wird —, die keine Fehler sind und nicht das, was Sie verlangt haben. `-f gfm` ist keine Optimierung. Es ist ein Flag für die Korrektheit, und es weglassen ist der häufigste Weg, auf dem eine Pandoc-Konvertierung auf subtile Weise schiefgeht. Umgekehrt gilt dasselbe: Ein für Pandoc geschriebenes Dokument, mit seinen eingezäunten Divs und seiner Zitationssyntax, verliert diese Konstrukte stillschweigend, wenn ein strikter CommonMark-Parser darauf trifft.

**Vorlagen sind eine Sprache.** In dem Moment, in dem `--standalone` nicht ganz das Richtige ist, schreiben Sie eine Pandoc-Vorlage, lernen ihre Variablensyntax und ihre Bedingungen und testen sie, indem Sie Dokumente darstellen und sie ansehen. Das ist ein fairer Tausch, wenn Sie hundert Dokumente erzeugen, die alle gleich aussehen müssen. Es ist ein schlechter Tausch gegen die zwanzig Zeilen HTML im Node-Skript oben, wenn Sie eigentlich ein Stylesheet und eine vernünftige Satzbreite brauchten. Seien Sie ehrlich darüber, welches der beiden Sie tun, bevor Sie anfangen, denn der Weg über die Vorlage ist schwer zu verlassen, sobald ein Build von ihm abhängt.

Wenn irgendetwas davon trifft, sind die kleineren Werkzeuge auf dieser Seite kein Kompromiss; sie sind der richtige Zuschnitt. Und wenn Sie den weiteren Blick wollen, samt der Optionen im Browser und in Bibliotheken, die nie ein Terminal berühren, [deckt der vollständige Konvertervergleich sie ab](/blog/best-markdown-to-html-converters).

## Die fünf Dinge, die im Terminal brechen, nicht im Konverter

Jeder Fehlschlag unten ist mindestens einmal von jemandem als Konverterfehler diagnostiziert worden, und keiner ist einer.

### Anführungszeichen, und warum die Datei mit dem Leerzeichen den Build zerlegt hat

`for file in docs/*.md; do cmark-gfm $file > out.html; done` funktioniert, bis jemand `release notes.md` hinzufügt. Dann teilt die Shell die Variable ohne Anführungszeichen am Leerzeichen und übergibt dem Konverter zwei Dateinamen, die es nicht gibt. Setzen Sie jede Expansion in Anführungszeichen, jedes Mal:

```bash
cmark-gfm "$file" > "$output"
```

Dieselbe Regel gilt innerhalb von `$(dirname "$file")` und `$(basename "$file" .md)`, die beide ihre inneren Anführungszeichen genauso brauchen wie ihre äußeren. Dateinamen aus einem Repository sind nicht Ihre Dateinamen: Sie kommen mit Leerzeichen, Apostrophen, Ampersands, Zeichen außerhalb von ASCII und, an einem schlechten Tag, mit einem führenden Bindestrich, den der Konverter als Flag liest. Ein nacktes `--` vor dem Dateinamen stoppt den letzten Fall.

Für alles Rekursive lassen Sie die Schleife über einen Glob weg und lassen `find` die Namen als Daten übergeben:

```bash
find docs -name '*.md' -print0 | while IFS= read -r -d '' file; do
  cmark-gfm -e table "$file" > "${file%.md}.html"
done
```

`-print0` und `-d ''` verwenden NUL als Trennzeichen, und das ist das eine Byte, das ein Dateiname nicht enthalten kann. `IFS=` verhindert, dass führende und nachfolgende Leerzeichen vom Namen abgeschnitten werden. Es ist hässlich, und es ist die einzige Fassung, die für jeden Dateinamen korrekt ist, den man Ihnen je in die Hand drückt.

Unter Windows ist der Fehlermodus anders und leiser. PowerShells Regeln für Anführungszeichen sind nicht die der Shell — einfache Anführungszeichen sind literal, doppelte interpolieren `$` — und seine Umleitung gibt Ihnen nicht zuverlässig UTF-8; `Out-File` in Windows PowerShell 5.1 verwendet standardmäßig UTF-16 Little-Endian (geprüft auf learn.microsoft.com, 8. September 2026). Eine konvertierte Datei, die in einer Kodierung geschrieben ist, die der Browser nicht erwartet, kommt als Kauderwelsch an, das genau wie ein Fehler des Konverters aussieht, schreiben Sie sie also absichtlich mit `| Set-Content -Encoding utf8 out.html` und hören Sie auf zu raten.

### Einen Ordner per Glob erfassen, und die Reihenfolge, die niemand wollte

`docs/*.md` tut drei Dinge, die Leute nicht erwarten. Es steigt nicht in Unterverzeichnisse hinab, `docs/api/reference.md` wird also stillschweigend übersprungen. Passt nichts, übergibt bash die wörtliche Zeichenkette `docs/*.md` als Dateinamen an den Konverter, was einen verwirrenden Fehler über eine Datei mit einem Sternchen darin erzeugt; `shopt -s nullglob` lässt einen leeren Glob stattdessen zu nichts expandieren. Und es sortiert lexikalisch, `10-api.md` kommt also jedes einzelne Mal vor `2-setup.md`.

Der letzte Punkt ist bloß kosmetisch, wenn Sie Datei für Datei konvertieren, und er ist ein echter Fehler, wenn Sie vor dem Konvertieren verketten. Füllen Sie die Zahlen mit Nullen auf — `02-setup.md`, `10-api.md` — und die Sortierung ist umsonst korrekt, in der Shell und in jedem anderen Werkzeug, das dieses Verzeichnis je liest. Für Rekursion entweder `shopt -s globstar` und dann `docs/**/*.md`, oder `find`, das keine Shell-Option braucht und sich überall gleich verhält.

Wenn Sie verketten, genügt `cat` nicht. Reines `cat` lässt zwischen den Dateien keine Leerzeile, die letzte Zeile der einen verbindet sich also mit der ersten Zeile der nächsten zu einem einzigen Absatz, und eine Überschrift kann am Text darüber festkleben:

```bash
awk 'FNR==1 && NR>1 {print ""} 1' docs/*.md > all.md
```

Eine Leerzeile, eingefügt am Anfang jeder Datei außer der ersten. Das ist die ganze Abhilfe, und es lohnt sich zu wissen, denn das Symptom — eine fehlende Überschrift mitten in einem langen Dokument — sieht seiner Ursache überhaupt nicht ähnlich.

### Die Ausgabe neben der Eingabe halten, ohne den Baum abzuflachen

`basename` ist das falsche Werkzeug für ein Verzeichnis voller Verzeichnisse, und es scheitert auf die schlimmstmögliche Weise. `docs/api/index.md` und `docs/guide/index.md` werden beide zu `index.html`, das eine überschreibt das andere stillschweigend, und der Build gelingt mit einer fehlenden Seite. Nichts warnt Sie, und die Datei, die überlebt, ist die, welche der Glob zuletzt erreicht hat.

Verwenden Sie Parameterexpansion, die den Pfad behält:

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"      # das führende docs/ entfernen
  output="${output%.md}.html"       # die Endung tauschen
  mkdir -p "$(dirname "$output")"   # den Baum gibt es noch nicht
  cmark-gfm -e table -e strikethrough "$file" > "$output"
done
```

`${file%.md}.html` tauscht die Endung, ohne irgendeinen Verzeichnisnamen anzurühren. `${file#docs/}` entfernt die Quellwurzel, der Ausgabebaum spiegelt also den Eingabebaum, statt in einer Kopie davon zu verschachteln. `mkdir -p "$(dirname "$output")"` ist die Zeile, die alle vergessen, und ihr Fehlen ist eine Umleitung, die an einem Verzeichnis scheitert, das nicht existiert — was immerhin laut scheitert.

Noch eine Sache zu den Ausgabepfaden. Relative Links zwischen Ihren Markdown-Dateien sind relativ zur Datei, ein Link auf `../guide/index.md` überlebt also nur, wenn der Ausgabebaum dieselbe Form hat wie der Eingabebaum, und nur, wenn Sie die Endung `.md` im Linkziel ebenfalls umschreiben. Flachen Sie den Baum ab, und jeder interne Link bricht auf einmal, auf eine Weise, die hinterher kein Flag eines Konverters reparieren kann.

### Exit-Codes, und die Pipeline, die gelogen hat

Das Standardverhalten eines Shell-Skripts ist, nach einem Fehlschlag weiterzumachen und dann Erfolg zu melden. Eine Zeile behebt das meiste davon:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

`-e` hält beim ersten fehlschlagenden Befehl an. `-u` verwandelt eine nicht gesetzte Variable in einen Fehler statt in eine leere Zeichenkette, und das ist es, was Sie an dem Tag vor `rm -rf "$BUILD_DIR/"` bewahrt, an dem `BUILD_DIR` nie gesetzt wurde. `-o pipefail` ist das, worauf es hier ankommt, denn der Exit-Status einer Pipeline ist von Haus aus der des letzten Befehls:

```bash
cmark-gfm README.md | tee build/README.html   # meldet, was tee getan hat
```

Der Konverter kann in Zeile eins sterben und `tee` wird trotzdem mit Null enden, der Job ist also grün und die Datei leer. Mit `pipefail` scheitert die Pipeline. Besser noch: gar nicht in eine Pipe schreiben — eine einfache Umleitung behält den Status des Konverters selbst, und das ist die Fassung, nach der von Haus aus zu greifen ist.

Dann gibt es die Werkzeuge, deren Vorstellung von Fehlschlag von Ihrer abweicht. `curl` endet bei einem HTTP 404 oder 429 mit Null, sofern Sie nicht `-f` übergeben. Pandoc endet bei Warnungen mit Null, sofern Sie nicht `--fail-if-warnings` übergeben. `npx` ohne `--yes` scheitert überhaupt nicht — es wartet auf eine Antwort, die nie kommen wird. Und ein Node-Skript, das einen Fehler fängt, ihn protokolliert und normal zurückkehrt, endet mit Null, setzen Sie also `process.exitCode = 1` im `catch`, oder das Skript belügt Ihr CI.

Prüfen Sie schließlich auf die leere Datei, denn mehrere dieser Fehlschläge erzeugen eine statt keiner:

```bash
[ -s "$output" ] || { echo "empty output: $output" >&2; exit 1; }
```

### Das Ganze in CI, wo die Installation der teure Teil ist

Alles oben nimmt an, dass der Konverter vorhanden ist. In CI ist er es nicht, und ihn dorthin zu bekommen ist meist das Langsamste im Job.

Drei Regeln decken es ab.

**Pinnen Sie die Version, oder die Ausgabe ändert sich ohne Commit.** `npx marked` nimmt eine lokale Installation, wenn es eine gibt, und holt sonst, was an diesem Morgen das Neueste ist, das HTML, das Ihr Job erzeugt, kann sich also ändern, während Ihr Repository sich nicht ändert. Installieren Sie aus einer Lockfile mit `npm ci`. Pinnen Sie eine Version von apt oder brew, wo die Paketierung es erlaubt. Verwenden Sie ein Docker-Tag statt `latest`. Reproduzierbarkeit ist der einzige Grund, eine Konvertierung überhaupt in CI zu stecken, und ein nicht gepinnter Konverter wirft sie weg, während es aussieht, als funktioniere es.

**Cachen Sie, was Sie können, und bevorzugen Sie das, was keinen Cache braucht.** Ein statisches Binary — comrak oder Ihr kompiliertes Go-Programm — ist eine Datei zum Wiederherstellen und überhaupt keine Auflösung von Abhängigkeiten. Ein Docker-Image ist ein Pull. Eine Installation über einen Paketmanager ist ein Abhängigkeitsgraph, der bei jedem Lauf frisch aufgelöst wird. Ordnen Sie Ihre Optionen in dieser Reihenfolge, und die Antwort ist selten die, die die Dokumentation nahelegt.

**Halten Sie das Geheimnis in der Umgebung und aus dem Repository heraus.** Wenn die Konvertierung ein API-Aufruf ist, kommt der Schlüssel aus dem Geheimnisspeicher des CI in eine Umgebungsvariable, nie aus einer Konfigurationsdatei, die jemand eingecheckt hat. `tp login` schreibt in ein Home-Verzeichnis, das der Runner verwirft, und genau deshalb existiert `TP_API_KEY`.

Die Prüfliste also für einen Konvertierungsschritt, der unbeaufsichtigt läuft:

- [ ] Versionen in einer Lockfile gepinnt und mit `npm ci` installiert, nicht mit `npm install`
- [ ] `npx` mit `--yes` versehen, damit es nie anhält, um die Erlaubnis zum Holen eines Pakets zu erfragen
- [ ] `set -euo pipefail` am Anfang jedes Shell-Schritts
- [ ] `curl` mit `-f` versehen; Pandoc mit `--fail-if-warnings`
- [ ] Ein Exit-Status ungleich Null als fehlgeschlagener Job behandelt, nicht als Warnung im Log
- [ ] Die Ausgabe auf Existenz und eine Größe ungleich Null geprüft, bevor irgendetwas Nachgelagertes ihr vertraut
- [ ] Der API-Schlüssel aus einer Umgebungsvariablen gelesen, nie aus einer eingecheckten Datei

## Wie Sie wählen

1. **Beginnen Sie mit dem, was schon installiert ist.** Wenn Pandoc auf der Maschine und im Image ist, verwenden Sie es und hören Sie auf zu lesen, denn die Installationskosten, um die Sie sich sorgten, sind schon bezahlt. Wenn das Repository Node hat und sonst nichts, dann ist es eine Wartungslast, die Sie in zwei Jahren noch tragen werden, einen Dokumentkonverter für vierzig Formate hinzuzufügen, um einen fünfzeiligen Job zu bedienen.
2. **Entscheiden Sie, ob die Ausgabe sich allein öffnen muss.** Wenn ein Mensch die Datei doppelklicken wird, brauchen Sie ein vollständiges Dokument mit eingebetteten Stilen, was Pandoc mit `--standalone --embed-resources` heißt, oder Ihre eigene Vorlage. Jedes andere Werkzeug hier gibt Ihnen ein Fragment, und ein an eine Kollegin gemailtes Fragment erscheint als unformatierter Text über die ganze Fensterbreite.
3. **Passen Sie den Dialekt zur Datei, bevor Sie das Werkzeug zum Dialekt passen.** Wenn die Dokumente Tabellen oder Aufgabenlisten haben, muss der Befehl GFM ausdrücklich verlangen: `-f gfm` für Pandoc, `-e table` und Verwandte für cmark-gfm, `--gfm` für comrak, `-x tables` für Python-Markdown. Konvertieren Sie eine repräsentative Datei und sehen Sie sich die Tabellen an, bevor Sie das Skript einchecken, denn eine Tabelle, die nicht geparst wurde, erzeugt keinen Fehler.
4. **Entscheiden Sie über rohes HTML, bevor Sie die Datei eines anderen konvertieren.** Für Ihre eigenen Notizen ist es unwichtig. Für eine README aus einem Fork unterdrückt entweder der Konverter rohes HTML von Haus aus — cmark-gfm und comrak tun das, und markdown-it maskiert es —, oder Sie fügen einen Bereiniger hinzu, oder Sie akzeptieren, dass alles, was in dieser Datei stand, im Browser dessen laufen wird, der die Ausgabe öffnet.
5. **Zählen Sie die Exit-Codes, nicht die Funktionen.** Was Sie auch nehmen: Sein Fehlschlag muss den Status des Jobs erreichen. Das heißt `pipefail`, eine Umleitung statt einer Pipe, `-f` bei `curl`, `--fail-if-warnings` bei Pandoc und eine Größenprüfung der Ausgabe. Ein Konvertierungsschritt, der nicht scheitern kann, ist ein Konvertierungsschritt, dem Sie irgendwann nicht mehr vertrauen und den Sie dann nicht mehr lesen.
6. **Messen Sie die Installation einmal, ehrlich.** Lassen Sie den Job mit der Installation des Konverters laufen und noch einmal mit ihr im Cache oder ohne sie. Wenn die Installation dominiert, ersetzen Sie sie durch ein statisches Binary, ein Image oder einen API-Aufruf, und schreiben Sie die gemessenen Zahlen in den Pull Request, damit die nächste Person das nicht wieder von Grund auf ausdiskutieren muss.

## Fazit

Nehmen Sie die kleinste Form, die das Problem beantwortet, und verwenden Sie Ihre Sorgfalt dann auf die Shell statt auf den Parser. Für HTML auf der Platte, das fertig aussehen muss, ist Pandoc mit `-f gfm -s --embed-resources` eine Zeile und die richtige Zeile; für HTML auf der Platte in einem Repository, das schon Node hat, schreiben Sie das fünfzeilige Skript mit seiner eigenen Vorlage und besitzen die Verpackung. Für einen Ordner setzen Sie Ihre Expansionen in Anführungszeichen, behalten den Baum und setzen `-euo pipefail`, damit der Job die Wahrheit darüber sagt, was passiert ist. Und für einen Link, den jemand ohne eigene Werkzeugkette öffnen kann — nichts zu installieren, nichts zu pinnen, nichts zu cachen — genügt eine einzige Anfrage — sobald Sie geklärt haben, [wie diese Anfrage aussehen sollte und was eine Konvertierungs-API einem Skript schuldet, wenn die Datei kaputt ist](/blog/converting-documents-with-an-api) — und dieselbe Konvertierung läuft [im Browser bei TransformPipe](/) kostenlos, wobei die Datei Ihren Rechner nie verlässt, solange Sie abgemeldet sind.

## FAQ

### Was ist der Markdown-Konverter für die Kommandozeile, der sich am einfachsten installiert?

comrak, wenn Sie das Herunterladen eines statischen Binarys als Installieren zählen, denn es gibt nichts weiter aufzulösen und nichts, was danach auf der Maschine zurückbleibt. Ist Node schon vorhanden, installieren `npx --yes marked` oder `npx --yes markdown-it` überhaupt nichts Dauerhaftes. Pandoc ist das mächtigste und das größte, und es verdient seine Größe nur, wenn Sie Formate jenseits von HTML oder genaue Kontrolle über die Verpackung brauchen.

### Wie konvertiere ich einen ganzen Ordner Markdown-Dateien auf einmal?

Lassen Sie die Shell die Schleife machen — keines dieser Werkzeuge braucht einen Stapelmodus. Verwenden Sie `find … -print0`, in eine Schleife `while IFS= read -r -d ''` geleitet, damit ungünstige Dateinamen überleben, bauen Sie den Ausgabepfad mit `${file%.md}.html`, damit der Verzeichnisbaum erhalten bleibt, und legen Sie das Ziel mit `mkdir -p` an, bevor Sie hineinleiten. Setzen Sie `set -euo pipefail` an den Anfang, oder ein Fehlschlag auf halbem Weg meldet trotzdem Erfolg.

### Warum ist mein konvertiertes HTML unformatiert?

Weil das Werkzeug Ihnen ein Fragment gegeben hat, und genau dafür sind die meisten davon gebaut. cmark-gfm, comrak, marked, markdown-it und `python -m markdown` geben alle Body-Inhalt ohne Doctype, ohne Head und ohne Stile aus, und ein Browser stellt das in seiner Standardschrift über die ganze Fensterbreite dar. Verwenden Sie entweder Pandocs `--standalone --embed-resources`, oder schreiben Sie die Verpackung einmal in einem Skript und verwenden Sie sie überall wieder.

### Bereinigen diese Konverter das HTML?

Manche tun es und manche mit Absicht nicht, und Sie müssen wissen, was Sie haben, bevor Sie eine Datei von außen konvertieren. cmark-gfm und comrak unterdrücken rohes HTML, sofern Sie nicht `--unsafe` übergeben; markdown-it maskiert es, sofern Sie nicht seine Option `html` einschalten; marked lässt es durch und dokumentiert, dass Bereinigen nicht seine Aufgabe ist; Pandoc lässt es ebenfalls durch. Pandocs `--sandbox` schützt die konvertierende Maschine, nicht den Browser des Lesers.

### Warum gelingt meine Konvertierung in CI, erzeugt aber nichts?

Fast immer eine Pipeline, die den Fehlschlag verborgen hat, oder ein Konverter, der einen Fehlschlag als Warnung behandelt. `cmark-gfm file.md | tee out.html` meldet den Exit-Status von `tee`, ein toter Konverter liest sich also als Erfolg — verwenden Sie `set -o pipefail`, oder leiten Sie um, statt in eine Pipe zu schreiben. Fügen Sie dann `-f` bei `curl` und `--fail-if-warnings` bei Pandoc hinzu, und prüfen Sie das Ergebnis mit `[ -s "$output" ]`, bevor irgendetwas Nachgelagertes davon abhängt.

### Ist Pandoc für CI zu langsam?

Pandocs Konvertierung ist schnell; die Installation ist das, was kostet, und sie kostet bei jedem Lauf statt einmal. Wie viel, hängt vollständig von der Methode ab — ein Pull eines Docker-Images oder ein wiederhergestellter Cache ist schnell, ein Paketmanager, der Abhängigkeiten von Grund auf auflöst, nicht —, messen Sie also Ihre eigene Pipeline, statt irgendjemandes veröffentlichter Zahl zu vertrauen. Wenn die Installation den Job dominiert, entfernt ein einzelnes statisches Binary oder ein HTTP-Aufruf sie ganz.

### Kann ich Markdown ganz ohne lokale Installation in HTML umwandeln?

Ja, auf zwei Wegen. Schicken Sie die Datei mit `curl` an eine HTTP-API und erhalten Sie JSON, eine HTML-Datei oder einen lebenden Link zurück; oder verwenden Sie bei einem Pull Request eine GitHub Action, damit der Runner überhaupt nie einen Konverter installiert. Beide brauchen ein Netz und ein Geheimnis, behalten Sie also auch einen lokalen Konverter im Build, wenn er ebenfalls offline funktionieren muss.
