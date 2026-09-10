---
title: Wie Sie eine Webseite als Markdown speichern, das Ihnen wirklich gehört
description: Vier Wege, eine Webseite in Markdown zu verwandeln — Leseansicht, gespeichertes HTML, Clipper und Kommandozeile — was jeder behält und was aus den Bildern wird
date: 2026-09-05
tag: Konvertieren
keywords: webseite als markdown speichern, webseite in markdown umwandeln, url zu markdown, artikel als markdown speichern, web clipper markdown, webseite als text speichern, readability leseansicht, html seite in markdown konvertieren
---

Eine Seite, die Sie behalten wollen, ist eine Seite, die jemand anderes ändern kann. Der Artikel, den Sie im März gelesen haben, steckt jetzt hinter einer Registrierungsschranke, oder die Website wurde neu gebaut und die URL ist ein 404, oder der Absatz, an den Sie sich erinnern, wurde still bearbeitet und es gibt keine Möglichkeit, das zu erkennen. Ein Lesezeichen ist ein Versprechen, das ein Fremder gibt. Markdown auf Ihrer eigenen Platte ist eine Datei.

Die Konvertierung selbst ist der leichte Teil. Jeder Weg unten endet damit, dass HTML zu Markdown wird, und dieser Schritt ist von einem halben Dutzend Werkzeugen gut gelöst. Was die Wege unterscheidet, ist alles darum herum: welcher Teil der Seite bei Ihnen ankommt, ob die Bilder mitkommen, ob die Datei in fünf Jahren noch aufgeht und wie viel von Ihrem Nachmittag ein einzelner Artikel kostet.

### Kurzfassung

Für einen Artikel, den Sie gerade jetzt lesen, schalten Sie die Leseansicht des Browsers ein, speichern oder kopieren die bereinigte Seite und konvertieren diese — die Leseansicht ist ein Extraktionsschritt, den Sie kostenlos bekommen, und sie entfernt die Navigation, den Newsletter-Kasten und die Leiste mit verwandten Artikeln, bevor irgendein Konverter sie zu sehen bekommt. Für eine Seite, von der Sie das Ganze wollen, speichern Sie sie zuerst als HTML und konvertieren die Datei, denn eine gespeicherte Datei lässt sich neu konvertieren, wenn Sie es sich anders überlegen, und ein Kopieren und Einfügen nicht. Für alles Routinemäßige legt eine Clipper-Erweiterung das Markdown mit einem Klick direkt in Ihre Notizen und verbirgt beide Schritte. Und welchen Weg Sie auch nehmen: Entscheiden Sie bewusst über die Bilder — eine Markdown-Datei, die auf die Bild-URLs anderer Leute zeigt, ist eine Datei, die langsam leer wird.

## Die Wege im Vergleich

Jede Zeile ist ein anderer Tausch zwischen Aufwand und Treue. Keiner davon ist falsch; sie scheitern an verschiedenen Stellen.

| Weg | Am besten für | Was er behält | Was er kostet | Preis |
| --- | --- | --- | --- | --- |
| Leseansicht, dann konvertieren | Ein Artikel, jetzt gelesen, als Prosa behalten | Überschriften, Absätze, Links im Text, meist die Tabellen | Alles, was der Extraktor für Mobiliar hielt, echte Abbildungen eingeschlossen | Kostenlos |
| Als HTML speichern, dann die Datei konvertieren | Eine Seite, von der Sie alles wollen, oder die Sie zweimal wollen | Alles, was die Seite enthielt, Mobiliar inklusive | Sie entfernen das Mobiliar selbst | Kostenlos |
| Konverter im Browser | Eine Datei konvertieren, ohne sie hochzuladen | Tabellen, Aufgabenlisten, Code, Überschriften | Ein Dokument auf einmal | Kostenlos |
| MarkDownload-Erweiterung | Die Seite clippen, die vor Ihnen liegt | Extrahierter Artikel, plus Front Matter mit der URL | Eine Erweiterung mit der Berechtigung, Seiten zu lesen | Kostenlos, Apache 2.0 |
| Obsidian Web Clipper | Markdown, das in einem Vault landet | Extraktion, Vorlagen, Seiteneigenschaften | An Obsidians Ordner gebunden | Kostenlos, MIT |
| Notion Web Clipper | Später in Notion lesen | Die Seite als Notion-Blöcke | Kein Markdown — ein zweiter Export führt dorthin | Kostenlos |
| SingleFile | Die Seite so behalten, wie sie aussah | Bilder, CSS und Schriften in eine HTML-Datei eingebettet | Eine große Datei, und die Konvertierung steht noch aus | Kostenlos, Open Source |
| monolith | Seiten aus einem Skript archivieren | Assets als Data-URIs eingebettet, kein Ordner | Eine Rust-Installation; keine Artikelextraktion | Kostenlos, Open Source |
| Pandoc | Konvertierung in einem Build oder einem Skript | Struktur, und Bilder über `--extract-media` | Keine Extraktion: geben Sie ihm sauberes HTML, oder Sie bekommen das Menü | Kostenlos, GPL |
| Turndown | Ein Werkzeug oder eine Erweiterung, die Sie schreiben | Genau die Regeln, die Sie festlegen | Sie liefern das DOM, die Extraktion und die Hülle | Kostenlos, MIT |
| Mozilla Readability | Den Artikel in einer Seite finden | Titel, Autorenzeile, bereinigtes Artikel-HTML | Gibt HTML aus, nicht Markdown | Kostenlos, Apache 2.0 |
| `wget` / `curl` | Viele Seiten, ohne Login, aus einem Terminal | Die Bytes, wie der Server sie geschickt hat | Keine Extraktion, und die Pflicht, dabei höflich zu sein | Kostenlos |
| Ein öffentliches Webarchiv | Belegen, was die Seite sagte | Ein zitierbarer, datierter Schnappschuss | Nicht Ihre Datei, und nicht Markdown | Kostenlos |
| Als PDF drucken | Ein Layout, das sich nicht verschieben darf | Die Seite als Bild von sich selbst | Strukturierter Text ist weg; das Zurückkonvertieren ist eine neue Aufgabe | Kostenlos |

## Weg eins: das HTML speichern, dann die Datei konvertieren

Das ist der Weg, den man zuerst lernen sollte, weil er das Erfassen von der Konvertierung trennt. Sobald das HTML auf der Platte liegt, können Sie es auf vier verschiedene Arten konvertieren, die Ergebnisse vergleichen und das Ganze im nächsten Jahr mit einem besseren Werkzeug noch einmal laufen lassen. Kopieren und Einfügen gibt Ihnen einen einzigen Versuch.

| Vorteile | Nachteile |
| --- | --- |
| Die Erfassung ist dauerhaft und erneut konvertierbar | Zwei Schritte statt einem |
| Funktioniert auf jeder Seite, auch auf solchen, mit denen kein Extraktor gut umgeht | Sie bekommen die Navigation und den Fußbereich mitsamt dem Artikel |
| Die gespeicherte Datei ist ein Beweis: sie ist, was die Seite an jenem Tag sagte | Die Formate, die Browser anbieten, sind nicht alle gleich nützlich |
| Zum späteren Konvertieren muss nichts hochgeladen werden | Assets landen in einem Nachbarordner, der leicht verloren geht |

**Für wen es ist.** Für jeden, der eine Seite als Referenz und nicht zum Lesen behält — Dokumentation, die abgeschaltet werden könnte, eine Spezifikation, ein Support-Thread, aus dem Sie zitieren müssen, die Preisseite eines Mitbewerbers an dem Tag, an dem Sie hingesehen haben.

### Das Format im Speicherdialog entscheidet, was Sie bekommen

Das Tastenkürzel zum Speichern zu drücken ist nicht eine einzige Handlung. Das Auswahlmenü im Dialog bietet Formate, die sich sehr unterschiedlich verhalten, und das falsche zu wählen ist der häufigste Grund dafür, dass eine Konvertierung nichts Brauchbares erzeugt.

| Format | Wo Sie es finden | Was auf der Platte landet | Konvertiert gut? |
| --- | --- | --- | --- |
| „Webseite, vollständig" | Chrome, Edge, Firefox (dort etwas anders geschrieben) | Eine `.html`-Datei plus ein `_files`-Ordner mit Bildern, CSS und Skripten | Ja, und die Bilder sind schon lokal |
| „Webseite, nur HTML" | Chrome, Edge, Firefox (dort ebenfalls etwas anders geschrieben) | Eine `.html`-Datei, die Assets bleiben entfernt | Ja, aber die Bilder bleiben entfernte URLs |
| „Webseite, einzelne Datei" | Chrome, Edge | Eine `.mhtml`-Datei: ein MIME-Multipart-Archiv der Seite und ihrer Teile | Selten — die meisten Markdown-Konverter lesen kein MHTML |
| Web Archive | Safari | Eine `.webarchive`-Datei, eine binäre Property List | Nein: es ist Apples Format, nicht HTML |
| Page Source | Safari | Das HTML, das der Server geschickt hat | Ja, aber siehe die Anmerkung zu JavaScript unten |
| Text Files | Firefox | Die Seite als reiner Text | Keine Struktur überlebt, es gibt also nichts zu konvertieren |

MHTML verdient eine eigene Warnung, denn „einzelne Datei" klingt genau nach dem, was Sie wollten. Es ist ein MIME-Container — dieselbe Umschlagform wie eine E-Mail mit Anhängen, standardisiert in RFC 2557 — mit dem HTML und jedem Asset als base64-kodierten Teilen. Browser öffnen ihn. Markdown-Konverter im Allgemeinen nicht, und die Datei gibt keinen Hinweis darauf, dass sie das Problem ist: Sie bekommen einen Fehler, oder eine gewaltige Zeile Base64.

### Wenn die Seite von JavaScript gebaut wird, speichern Sie das dargestellte DOM

Sehr viele Seiten senden ein nahezu leeres Dokument und füllen es per Skript. Speichern Sie den Quelltext einer solchen Seite, und Sie haben einen Ladekreis gespeichert. Die verlässliche Antwort ist, das DOM zu nehmen, das der Browser wirklich gebaut hat: Öffnen Sie die Entwicklerwerkzeuge, suchen Sie oben im Panel „Elemente" das `<html>`-Element, klicken Sie es mit der rechten Maustaste an und wählen Sie „Kopieren" und darin „outerHTML kopieren". Fügen Sie das in eine Datei mit der Endung `.html` ein und konvertieren Sie diese stattdessen. Es ist die dargestellte Seite, Tabellen und alles, in dem Zustand, in dem Sie sie angesehen haben.

Derselbe Trick verengt die Aufgabe. Kopieren Sie statt des `<html>`-Elements das outerHTML des `<article>`-Elements oder des Containers mit dem Hauptinhalt. Sie haben die Extraktion dann von Hand gemacht, ganz genau, in etwa vier Sekunden, und dem Konverter bleibt nichts mehr zu raten.

### Dieselbe Aufgabe in einem Skript

Für mehr als eine Seite ist das Terminal kürzer. `curl -sL <url> -o page.html` holt das Dokument und folgt Weiterleitungen. `wget --page-requisites --convert-links <url>` holt die Seite plus die Bilder und Stylesheets, auf die sie verweist, und schreibt die Verweise auf die lokalen Kopien um, was von einer Kommandozeile aus dem Speichern einer vollständigen Webseite am nächsten kommt.

Pandoc liest HTML und schreibt direkt Markdown, und es nimmt eine URL genauso als Eingabe wie eine Datei, `pandoc -f html -t gfm <url> -o page.md` ist also ein Einzeiler für eine einfache Seite. Es extrahiert überhaupt nichts — Sie bekommen das Menü, den Fußbereich und jeden Link in der Seitenleiste — und gehört daher ans Ende einer Kette, in der etwas anderes den Artikel bereits gefunden hat. Seine Option `--extract-media` ist der nützliche Teil, wenn man eine Seite behalten will: Sie schreibt die Bilder in ein Verzeichnis heraus und passt die Links im Markdown daran an, was eine Datei voller entfernter URLs in einen in sich geschlossenen Ordner verwandelt.

Wenn Sie die Seite selbst und nicht ihren Text wollen, ist `monolith` ein kleines Kommandozeilenwerkzeug in Rust, das eine Seite und ihre Assets in eine einzige HTML-Datei bündelt, in der alles als Data-URI eingebettet ist. Es gibt keinen Server und keinen Ordner, der verloren gehen kann. Es ist kostenlos und Open Source. Konvertieren Sie diese Datei später, wenn Sie Markdown wollen; behalten Sie sie in jedem Fall, falls die Seite verschwindet.

## Weg zwei: Leseansicht und Extraktion im Stil von Readability

Die Leseansicht ist das am wenigsten genutzte Konvertierungswerkzeug im Browser, weil niemand sie für eines hält. Was sie tut, ist genau die schwere Hälfte der Aufgabe: Sie sieht sich das Dokument an, ermittelt, welcher Block darin der Artikel ist, und wirft den Rest weg. Die Leseansicht von Firefox baut auf Mozillas Readability-Bibliothek auf. Safari hat Reader, Chrome hat einen Lesemodus in seiner Seitenleiste, und Edge hat den Immersive Reader. Sie sind nicht identisch, aber sie betreiben alle dieselbe Art von Bewertung — wie viel Text steckt in diesem Element, wie viele Links, wie tief verschachtelt, welche Klassennamen trägt es.

Schalten Sie sie ein, dann speichern oder kopieren Sie aus der bereinigten Ansicht. Weil die Leseansicht selbst ein echtes Dokument im Browser ist, funktioniert der Trick mit den Entwicklerwerkzeugen von oben auch auf ihr: Kopieren Sie das outerHTML des Reader-Containers, und Sie haben den Artikel ganz ohne Mobiliar. Konvertieren Sie das, und das Markdown beginnt bei der Schlagzeile.

| Vorteile | Nachteile |
| --- | --- |
| Die Extraktion ist erledigt, kostenlos, von Software, die Millionen Seiten gesehen hat | Sie entscheidet, was eine „Abbildung" ist, und liegt manchmal falsch |
| Funktioniert auf der Seite, die Sie schon lesen, ohne Installation | Scheitert an Seiten, die keine Artikel sind: Dashboards, Doku mit Seitenleisten, Foren |
| Entfernt als Nebeneffekt Tracking-Pixel, Werbeplätze und Newsletter-Kästen | Hervorgehobene Zitate, Bildunterschriften und Anmerkungen im Text fallen oft weg |
| Gibt Ihnen Titel und Autorenzeile als getrennte, saubere Felder | Keine Kontrolle über die Regeln, außer Sie führen die Bibliothek selbst aus |

**Für wen es ist.** Für Leser, die Artikel behalten: Journalismus, Essays, Blogbeiträge, alles mit einer Spalte Prosa und einer Schlagzeile. Es ist das falsche Werkzeug für Referenzdokumentation, wo die Navigation in der Seitenleiste und die Tabellen am Rand die Hälfte des Werts sind.

Die Bibliothek direkt zu betreiben ist es wert, gekannt zu werden, wenn Sie das in irgendeinem Umfang tun. Mozillas Readability ist JavaScript, unter Apache 2.0 lizenziert, und nimmt ein DOM-Dokument; `new Readability(document).parse()` gibt ein Objekt mit dem Titel, der Autorenzeile, einem Auszug, dem Namen der Website und dem bereinigten Artikel als HTML zurück. Dort hört es auf — Extraktion ist der ganze Umfang, und dieses HTML in Markdown zu verwandeln ist die Aufgabe des nächsten Werkzeugs. Postlight Parser macht dieselbe Art von Extraktion und kann Markdown selbst ausgeben. Der Vergleich zwischen diesen und den nackten Bibliotheken ist [an anderer Stelle je Werkzeug aufgeschlüsselt](/blog/best-html-to-markdown-converters); der Punkt hier ist die Reihenfolge der Schritte. Extrahieren, dann konvertieren. Umgekehrt bekommt man eine ordentliche Markdown-Fassung eines Navigationsmenüs.

## Weg drei: Clipper-Erweiterungen, und was jede davon verstümmelt

Ein Clipper ist Extraktion und Konvertierung, hinter einem Knopf in der Werkzeugleiste aneinandergeschraubt, und für das tägliche Behalten ist das die richtige Form. Der Preis ist eine Browser-Erweiterung mit der Berechtigung, die Seiten zu lesen, die Sie besuchen, und eine Meinung — von jemand anderem eingebacken — darüber, was an einer Seite behaltenswert ist.

| Clipper | Was er erzeugt | Wohin es geht | Was er gern verstümmelt |
| --- | --- | --- | --- |
| MarkDownload | Eine `.md`-Datei, optional mit YAML-Front-Matter, die URL und Titel trägt | Ihr Downloads-Ordner, oder die Zwischenablage | Was auch immer der Extraktor verworfen hat; Bilder bleiben entfernte Links, sofern Sie nichts anderes verlangen |
| Obsidian Web Clipper | Markdown plus Seiteneigenschaften, geformt von einer Vorlage, die Sie schreiben | Direkt in einen Vault-Ordner | Hervorhebungen und Callouts sind Obsidians eigene Konventionen und reisen daher schlecht zu anderen Werkzeugen |
| Notion Web Clipper | Notion-Blöcke, kein Markdown | Eine Notion-Datenbank oder -Seite | Alles, für das Notion keinen Block hat; um Markdown zurückzubekommen, braucht es einen zweiten Export |
| Eine allgemeine Erweiterung zum „Als Markdown speichern" | Schwankt wild | Downloads | Unbekannt, und das ist das Problem: Sie können nicht prüfen, was Sie nicht lesen können |

MarkDownload ist das ehrliche Arbeitspferd: Es lässt Readability über die Seite laufen und dann Turndown über das Ergebnis, was dieselbe zweistufige Kette ist, die oben beschrieben wurde, für Sie zusammengesteckt. Es ist kostenlos und Open Source unter der Apache-2.0-Lizenz, was bedeutet, dass die Kette einsehbar ist — Sie können genau nachlesen, welche Regeln die Datei erzeugt haben, die Sie bekommen haben.

Obsidians Web Clipper ist der, den man nehmen sollte, wenn das Ziel ein Vault ist, denn er schreibt die Notiz dorthin, wo der Vault sie erwartet, mit den Eigenschaften, auf die Ihre Vorlagen sich stützen. Er ist kostenlos und MIT-lizenziert. Zwei Dinge sind im Kopf zu behalten. Erstens sind seine Vorlagen eine echte Funktion und es wert, einmal eingerichtet zu werden: Eine geclippte Notiz mit der Quell-URL, dem Autor und dem Abrufdatum in ihren Eigenschaften ist eine Notiz, die Sie in zwei Jahren noch zitieren können. Zweitens hat Obsidians Dialekt eigene Erweiterungen — Wikilinks, Callouts, Embeds — und eine Notiz voller davon ist keine Notiz, die ein anderes Werkzeug darstellen wird. [Was jede dieser Anwendungen dem Markdown auf dem Weg hinaus antut](/blog/markdown-from-notion-obsidian-and-confluence) ist eine längere Geschichte, und sie gilt für geclippte Seiten genauso wie für geschriebene.

Notions Clipper ist der Ausreißer und der, bei dem Leute hereinfallen. Er speichert kein Markdown. Er speichert die Seite als Notion-Blöcke in Notion, was wirklich nützlich ist, wenn Notion der Ort ist, an dem Sie Dinge lesen, und eine Sackgasse, wenn Sie eine Datei wollten. Um Markdown herauszubekommen, exportieren Sie die Seite danach aus Notion, was ein ZIP erzeugt, in dem an jedem Dateinamen hexadezimale Kennungen hängen und Datenbanken als getrennte CSV-Dateien liegen. Das sind zwei verlustbehaftete Konvertierungen, wo Sie um eine gebeten hatten.

**Für wen Clipper sind.** Für Leute, die jeden Tag Seiten behalten und wollen, dass die Entscheidung für sie getroffen wird. Wenn Sie zweimal im Jahr clippen, ist die Erweiterungsberechtigung es nicht wert und der Weg in zwei Schritten reicht.

### Die Option im Browser, wenn Sie lieber nichts installieren

Zwischen „in eine Website einfügen" und „eine Erweiterung installieren" gibt es eine dritte Position: ein Konverter, der im Browser-Tab läuft, aber nicht Teil des Browsers ist. Ziehen Sie die gespeicherte `.html`-Datei auf die Seite, oder fügen Sie das HTML ein, das Sie aus den Entwicklerwerkzeugen kopiert haben, und die Konvertierung passiert auf Ihrem eigenen Rechner. Abgemeldet lädt die [HTML-zu-Markdown-Konvertierung von TransformPipe](/html-to-markdown) überhaupt nichts hoch — die Datei wird lokal gelesen, geparst und konvertiert, was Sie bestätigen können, indem Sie den Netzwerk-Tab öffnen und dabei zusehen, wie nichts passiert. Die Konvertierung ist bei 10 MB gedeckelt, und ein Dokument, das Sie in einem Konto behalten möchten, bei 4 MB, weil die Funktion, die es speichert, einen größeren Anfragerumpf ablehnt.

| Vorteile | Nachteile |
| --- | --- |
| Keine Installation, keine Erweiterungsberechtigungen, abgemeldet nichts hochgeladen | Sie müssen das HTML weiterhin selbst erfassen |
| Behält GFM-Tabellen, Aufgabenlisten, umzäunten Code und Überschriften | Ein Dokument auf einmal, kein Durchlauf einer Website |
| Konvertiert auch in die andere Richtung und aus Word, CSV und JSON heraus | Der Browser macht die Arbeit, eine riesige Seite hängt also von der Maschine ab |

**Für wen es ist.** Für jemanden mit einer gespeicherten Seite und einer einzigen Konvertierung, auf einem Rechner, auf dem Installieren entweder langsam oder nicht erlaubt ist.

## Bilder: herunterladen, oder den Verfall akzeptieren

Das ist der Teil, den jede Anleitung überspringt, und es ist der Teil, der entscheidet, ob Ihr Archiv in drei Jahren etwas wert ist.

Markdown hat eine Bildsyntax, und sie hält einen Ort: `![alt](url)`. Konvertieren Sie eine Webseite, und diese URL ist die, die die Seite benutzt hat — meist eine absolute Adresse auf dem Ursprungsserver oder einem CDN. Das Markdown ist in dem Moment korrekt, in dem Sie es erzeugen, und es ist keine Kopie von irgendetwas. Es ist eine Kopie des Textes und ein Zeiger auf die Bilder anderer Leute, und Zeiger verfallen auf mindestens fünf Arten:

- Die Website wird neu gestaltet und die Medienpfade ändern sich.
- Das CDN wird gewechselt, der Bucket wird umbenannt, oder das alte Präfix löst nicht mehr auf.
- Die URL trug eine signierte Query-Zeichenkette mit einem Ablauf, und die Signatur ist inzwischen abgelaufen.
- Ein Hotlink-Schutz beginnt, Anfragen abzulehnen, die nicht von den eigenen Seiten der Website kommen.
- Die Website verschwindet ganz, was meist der Grund ist, warum Sie die Seite gespeichert haben.

Es gibt drei ehrliche Möglichkeiten und keine vierte.

| Möglichkeit | Was Sie bekommen | Was zerbricht | Aufwand |
| --- | --- | --- | --- |
| Die entfernten URLs stehen lassen | Eine kleine Textdatei, Bilder so lange, wie sie halten | Jeder Fehlerfall von oben, lautlos und einer nach dem anderen | Keiner |
| Die Bilder neben die Datei herunterladen | Ein Ordner, der wirklich eine Kopie ist | Relative Pfade zerbrechen, wenn die Datei ohne den Ordner umzieht | Ein Flag, oder eine Clipper-Einstellung |
| Die Bilder als Data-URIs einbetten | Eine Datei, die überhaupt kein Netz braucht | Eine viel größere Datei, und manche Werkzeuge verweigern sehr lange URIs | Ein Konvertierungsschritt |

Herunterladen ist, was die meisten tun sollten, und das Werkzeug dafür existiert: Pandocs `--extract-media` schreibt die Medien heraus und passt die Links an, `wget --page-requisites --convert-links` tut das Äquivalent schon beim Erfassen, und SingleFile und monolith betten beide alles in das HTML ein, bevor eine Konvertierung überhaupt in Betracht kommt. Der Haken an einem Ordner ist, dass eine Markdown-Datei und ihr `images/`-Verzeichnis nun eine Einheit sind und die Verbindung zwischen ihnen ein relativer Pfad ist — was genau [die Annahme ist, die beim ersten Mal zerbricht, wenn jemand die Datei verschiebt](/blog/images-and-links-that-still-work) und nicht den Ordner.

Zwei kleinere Bildprobleme sind es wert, bekannt zu sein, bevor Sie den Konverter dafür verantwortlich machen. Lazy Loading bedeutet, dass die echte Bildadresse oft in einem `data-src`- oder `srcset`-Attribut steckt, während `src` einen Platzhalter hält — ein Konverter, der auf dem Quell-HTML arbeitet, erfasst also den Platzhalter: ein graues Kästchen oder ein transparentes GIF von einem Pixel. Das dargestellte DOM zu kopieren, nachdem Sie die Seite gescrollt haben, behebt das meistens, weil der Browser bis dahin die echte Adresse eingesetzt hat. Und `<figure>` mit einem `<figcaption>` hat kein Markdown-Äquivalent, die Bildunterschrift kommt also als loser Absatz unter dem Bild an, vom Fließtext nicht zu unterscheiden.

## Wo das Speichern einer Seite als Markdown scheitert

Die ehrliche Antwort ist, dass Markdown für das Web ein verlustbehaftetes Format ist und dass bei manchen Seiten der Verlust der ganze Sinn der Seite ist.

**Anwendungen, die sich als Dokumente ausgeben.** Ein Dashboard, eine Karte, ein Rechner, eine sortierbare Tabelle mit Filtern — da ist nichts zu speichern. Was Sie behalten können, ist ein Bildschirmfoto oder ein PDF, was das Bild bewahrt und den Text aufgibt.

**Alles, was das Netz braucht, um zu existieren.** Eingebettete Videos, Tweets, CodePen-Rahmen, Kommentar-Threads, die beim Scrollen geladen werden, interaktive Diagramme, die aus einem JSON-Feed gezeichnet werden. Ein Konverter macht aus einem `<iframe>` nichts, oder einen Link auf eine URL, die die Seite möglicherweise nicht überlebt.

**Endloses Scrollen und Seitenaufteilung.** Sie bekommen, was geladen war, als Sie erfasst haben. Ein Thread mit zweihundert Antworten gibt Ihnen die ersten zwanzig, und nichts in der Datei sagt das.

**Inhalte hinter einem Login.** Ein Clipper funktioniert, weil der Browser schon authentifiziert ist; `curl` ist es nicht und holt stattdessen die Anmeldeseite und konvertiert sie tadellos.

**Strukturelles HTML ohne Markdown-Äquivalent.** Tabellen mit `rowspan` oder `colspan`, Definitionslisten, verschachtelte Tabellen, Randnotizen, `<details>`-Blöcke, Mathematik, die von KaTeX oder MathJax dargestellt wird, syntaxhervorgehobener Code, dessen Sprache in einem Klassennamen steckt, den der Konverter nicht liest. Manche Konverter geben dafür rohes HTML aus, was die Information auf Kosten der Portabilität behält; andere nähern an; andere verwerfen sie. Tabellen sind das häufigste Opfer und das sichtbarste, und [was eine Tabelle die Reise überstehen lässt](/blog/markdown-tables-that-survive-conversion) ist lesenswert, wenn Ihre Seiten Dokumentation sind.

**Die Sicherheitsfrage, wenn die Datei irgendwohin geht.** Markdown erlaubt rohes HTML, und aus einer Webseite konvertiertes HTML kann rohes HTML durchtragen — einschließlich `<script>`, `onerror=`-Handlern und `javascript:`-URLs aus der Seite, die Sie gespeichert haben. Das ist in einem Texteditor untätig und lebendig in dem Moment, in dem Sie es zurück in HTML konvertieren und in einem Browser öffnen. Wenn eine gespeicherte Seite wieder eine Seite werden soll, ist [das Bereinigen der Schritt, der nicht übersprungen werden darf](/blog/sanitising-markdown-safely).

**Und die Kosten, die niemand nennt.** Eine Markdown-Kopie ist ein Schnappschuss, dem das Layout, die Gestaltung und die Identität der Quelle abgezogen wurden. Sie ist kleiner, durchsuchbar, grepbar, diffbar und Ihre. Sie ist außerdem kein Beweis mehr für irgendetwas, denn Sie hätten sie auch selbst tippen können. Wenn Sie zeigen müssen, was die Seite sagte, behalten Sie das HTML — oder den Archiv-Schnappschuss — zusätzlich zum Markdown, und schreiben Sie die URL und das Datum des Abrufs in das Front Matter der Datei. Diese Gewohnheit kostet eine Zeile und beendet Streitigkeiten.

## Ihr eigenes Lesen, keine Neuveröffentlichung

Eine Seite für sich selbst zu speichern und das Gespeicherte zu veröffentlichen sind zwei verschiedene Handlungen, und die zweite ist von der ersten nicht abgedeckt.

Der Text und die Bilder auf einer Webseite sind die Arbeit von jemandem, und das Urheberrecht gilt, ob ein Hinweis dasteht oder nicht. Eine persönliche Kopie zum Lesen, Kommentieren, Durchsuchen und Zitieren zu behalten ist gewöhnliche Nutzung, und die Ausnahmen, die die meisten Rechtsordnungen vorsehen — die Schranken für den eigenen wissenschaftlichen Gebrauch und den privaten Gebrauch im deutschsprachigen Raum, fair use in den USA — existieren etwa dafür. Das Markdown, das Sie erzeugt haben, zu nehmen und auf Ihrer eigenen Website zu veröffentlichen, es in ein Produkt einzuspeisen oder es als Dokument mit Ihrem Namen obendrauf herumzuschicken ist eine andere Frage, und die Antwort hängt davon ab, wie viel Sie übernommen haben, was Sie damit gemacht haben und ob Sie dafür Geld nehmen. Nichts davon ist eine Rechtsberatung; die praktische Fassung steht unten.

| Was Sie tun | Wie es üblicherweise gelesen wird | Was dagegen zu tun ist |
| --- | --- | --- |
| Einen Artikel behalten, um ihn offline zu lesen | Persönliche Nutzung | Nichts. Notieren Sie die URL und das Datum |
| Einen Absatz mit Quellenangabe zitieren | Gewöhnliches Zitat | Auf das Original verlinken, den Autor nennen |
| Den ganzen Artikel auf Ihrer Website erneut veröffentlichen | Neuveröffentlichung | Fragen, oder verlinken statt kopieren |
| Ein durchsuchbares Korpus für ein Team aufbauen | Hängt ganz von Umfang und Lizenz ab | Die Bedingungen prüfen; schriftlich um Erlaubnis bitten |
| Seiten in ein kommerzielles Produkt einspeisen | In keiner Lesart persönliche Nutzung | Vorher Rat einholen, nicht hinterher |

Dann gibt es die Hälfte, die die Höflichkeit betrifft, und die ist technisch und nicht optional. `robots.txt` ist eine Bitte und keine Lizenz, und ein Skript, das tausend Seiten abruft, ist ein Crawler, wie Sie auch darüber denken. Rufen Sie langsam ab, eine Seite auf einmal, mit einer Pause zwischen den Anfragen. Senden Sie einen User-Agent, der sagt, wer Sie sind und wie man Sie erreicht. Beachten Sie ein `429` und jeden `Retry-After`-Header, der damit kommt, statt sofort neu zu versuchen. Legen Sie Abgerufenes in einen Cache, damit ein zweiter Durchlauf die Website nicht erneut trifft. Und lesen Sie die Nutzungsbedingungen, bevor Sie irgendetwas gegen eine Website automatisieren, die Ihnen nicht gehört, besonders dort, wo Inhalte hinter einem Login oder einer Bezahlschranke sitzen — eine Zugangskontrolle zu umgehen ist eine vom Urheberrecht getrennte Sache, und eine schlimmere.

Eine Seite, von Hand gespeichert, von einer Website, die Sie lesen: Daran nimmt niemand Anstoß, und dafür haben Browser seit dem Anfang einen Speicherknopf. Ein skriptgesteuerter Durchgang durch eine ganze Publikation: vorher fragen.

## Wie Sie wählen

1. **Gehen Sie von dem aus, was Sie mit der Datei tun werden.** Sie später zu lesen heißt, dass ein Extraktor Ihr Freund ist und das Mobiliar Lärm. Sie in einer Auseinandersetzung zu zitieren heißt, das HTML mit zu behalten, denn das Markdown allein beweist nichts.
2. **Erfassen, bevor Sie konvertieren.** Speichern Sie das HTML, oder kopieren Sie das dargestellte DOM, und behalten Sie es. Konvertierungswerkzeuge werden besser und Ihre Anforderungen ändern sich, und eine Datei auf der Platte kann im nächsten Jahr durch ein besseres Werkzeug laufen — ein Einfügen in ein Textfeld nicht.
3. **Entscheiden Sie über die Bilder beim Erfassen, nicht danach.** Sie herunterzuladen kostet ein Flag, während Sie die Seite vor sich haben, und kostet ein zerbrochenes Archiv, wenn Sie es aufschieben, bis die URLs schon verfallen sind.
4. **Prüfen Sie die Tabellen, bevor Sie dem Werkzeug trauen.** Tabellen stehen nicht in der CommonMark-Spezifikation, ein Konverter muss GFM-Tabellen also absichtlich umsetzen. Konvertieren Sie eine Seite, die eine Tabelle hat, und sehen Sie sie an; dieser einzige Test fängt die meisten schlechten Optionen ab.
5. **Bereinigen Sie alles, was wieder HTML wird.** Eine Seite, die Sie gespeichert haben, kann Skripte tragen, und ein treuer Hin- und Rückweg trägt sie zurück in einen Browser. Wenn das Markdown nur je als Text gelesen wird, spielt das keine Rolle; in dem Moment, in dem es veröffentlicht wird, ist es das Einzige, was eine Rolle spielt.
6. **Rechnen Sie die Installationen gegen die Häufigkeit.** Täglich zu clippen rechtfertigt eine Erweiterung und eine Vorlage. Zwei Seiten im Jahr nicht: Nehmen Sie die Leseansicht, speichern Sie das HTML, konvertieren Sie es in einem Browser-Tab und behalten Sie Ihre Berechtigungen für sich.

## Fazit

Der verlässliche Weg, eine Webseite zu behalten, sind zwei Schritte, die wie einer aussehen: den Artikel aus der Seite holen, dann das Markdown aus dem Artikel. Die Leseansicht oder ein Extraktor macht das Erste, jeder kompetente Konverter das Zweite, und ein Clipper macht beides auf einmal, im Tausch gegen eine Erweiterungsberechtigung. Welchen Weg Sie auch nehmen: Speichern Sie die Bilder, oder akzeptieren Sie wissentlich, dass sie verblassen werden, schreiben Sie die Quell-URL und das Datum in die Datei, und behalten Sie im Kopf, dass die Kopie für Sie ist — die Seite gehört weiterhin dem, der sie geschrieben hat.

## FAQ

### Was ist der schnellste Weg, eine Webseite als Markdown zu speichern?

Schalten Sie die Leseansicht des Browsers ein, kopieren Sie den bereinigten Artikel und fügen Sie ihn in einen Konverter ein — das ist unter einer Minute und ohne Installation. Wenn Sie es oft tun, reduziert eine Clipper-Erweiterung es auf einen Klick, um den Preis, einer Erweiterung Zugriff auf die Seiten zu geben, die Sie besuchen.

### Welches Speicherformat des Browsers soll ich wählen?

„Webseite, vollständig", wenn Sie die Bilder auf der Platte wollen, oder „Webseite, nur HTML", wenn Sie nur der Text interessiert. Meiden Sie „Webseite, einzelne Datei" (`.mhtml`) und Safaris Web Archive, wenn Markdown das Ziel ist, denn die meisten Konverter können keines der beiden Formate lesen.

### Warum konvertiert meine gespeicherte Seite zu fast nichts?

Die Seite stellt ihren Inhalt höchstwahrscheinlich mit JavaScript dar, der gespeicherte Quelltext ist also eine leere Hülle. Öffnen Sie die Entwicklerwerkzeuge, klicken Sie das `<html>`-Element mit der rechten Maustaste an, wählen Sie „Kopieren" und darin „outerHTML kopieren", speichern Sie das als `.html`-Datei und konvertieren Sie diese stattdessen — das ist die Seite, wie der Browser sie gebaut hat.

### Kommen die Bilder mit dem Markdown mit?

Nicht von selbst. Ein Konverter schreibt die Bild-URLs, die er gefunden hat, und die zeigen auf die ursprüngliche Website und funktionieren nur so lange, wie diese es tut. Nehmen Sie Pandocs `--extract-media`, `wget --page-requisites --convert-links` oder ein Werkzeug, das Assets einbettet, wenn Sie eine Kopie und keinen Zeiger wollen.

### Kann ich eine URL direkt in Markdown konvertieren, ohne etwas zu installieren?

Ja, für unkomplizierte Seiten: Pandoc nimmt eine URL als Eingabe, und mehrere Online-Werkzeuge tun das auch. Beide Ansätze überspringen die Extraktion, erwarten Sie also die Navigation und den Fußbereich in der Ausgabe, sofern das Werkzeug nicht vorher einen eigenen Extraktor laufen lässt.

### Ist es legal, eine Webseite als Markdown zu speichern?

Eine persönliche Kopie zum Lesen zu behalten ist gewöhnliche Nutzung, und dafür ist der Speicherknopf eines Browsers da. Das Gespeicherte erneut zu veröffentlichen oder aus vielen Seiten ein kommerzielles Korpus zu bauen ist eine andere Frage, die von Umfang, Lizenz und Nutzungsbedingungen abhängt — fragen Sie, bevor Sie eine Website automatisieren, die Ihnen nicht gehört.

### Kann ich eine ganze Website auf einmal konvertieren?

Technisch ja, mit `wget` und einem Konverter in einer Schleife, und es ist die Anfrage, die am ehesten einen Website-Betreiber verärgert oder Ihre Adresse sperren lässt. Begrenzen Sie die Rate, weisen Sie sich im User-Agent aus, beachten Sie `429`-Antworten, und überlegen Sie, ob ein Archiv-Schnappschuss oder das Angebot, um die Quelle zu bitten, Ihnen besser dienen würde.
