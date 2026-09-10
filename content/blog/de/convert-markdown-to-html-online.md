---
title: "Markdown online in HTML umwandeln, ohne etwas zu installieren"
description: "Die Schritte, um eine Markdown-Datei im Browser in HTML umzuwandeln, was Sie an der Ausgabe prüfen sollten, bevor Sie sie verschicken, und wann ein Build besser ist"
date: 2026-09-06
tag: Konvertieren
keywords: markdown in html umwandeln, markdown zu html online, md zu html online, markdown zu html ohne installation, markdown zu html im browser, netzwerk-tab kein upload prüfen, markdown dateien zu einer html zusammenfügen
---

### Kurzfassung

Öffnen Sie einen Konverter, der im Browser läuft, ziehen Sie die `.md`-Datei auf die Seite und laden Sie das HTML herunter — das ist die ganze Aufgabe, und sie dauert etwa zwanzig Sekunden. Bevor Sie das Ergebnis irgendwohin schicken, öffnen Sie es in einem zweiten Browser mit abgeschaltetem Netz: dieser eine Test erwischt Fragmente, fehlende Stile und CDN-Links gleichzeitig. Wenn Sie sicher sein wollen, dass nichts hochgeladen wurde, öffnen Sie das Netzwerk-Panel vor dem Konvertieren und sehen ihm beim Leerbleiben zu — oder laden die Seite, trennen die Verbindung und konvertieren offline. Der Browser-Weg hört auf, der richtige zu sein, wenn die Konvertierung sich wiederholen muss, wenn die Eingabe ein Verzeichnis statt einer Datei ist, oder wenn die Ausgabe etwas anderes als HTML sein soll.

Sie haben eine Markdown-Datei und jemanden, der Markdown nicht lesen kann. Vielleicht ist es eine Spezifikation, vielleicht ein Satz Notizen, vielleicht eine Seite Ausgabe von einem Modell. Was Sie brauchen, ist eine Datei, die im Browser öffnet und wie ein Dokument aussieht — und Sie brauchen sie vor dem Termin.

Der Rat, den Sie stattdessen finden, ist ein Build. Paketmanager installieren, Generator installieren, Konfigurationsdatei schreiben, Vorlagensprache lernen, ausrollen. All das ist richtiger Rat für eine Website und absurder Rat für ein Dokument mit einem Empfänger. Die Lücke zwischen diesen beiden Situationen ist der Ort, an dem die meiste verschwendete Zeit beim Konvertieren von Markdown wohnt.

Es gibt einen kürzeren Weg, und an ihm hängt ein echtes Risiko. Ein Konverter, der in einem Browser-Tab läuft, braucht keine Installation und kann konvertieren, ohne Ihre Datei irgendwohin zu senden — aber „Online-Konverter" beschreibt auch einen Dienst, der Ihr Dokument auf einen Server hochlädt, von dem Sie nichts wissen, es dort konvertiert und behält, was seine Aufbewahrungsregel eben sagt. Von außen sehen die beiden gleich aus. Sie zu unterscheiden kostet ein Browser-Panel und etwa eine Minute, und dieser Artikel behandelt das so sorgfältig wie die Konvertierung selbst.

## Was „online" bedeuten muss, bevor Sie ein Dokument hineingeben

„Online-Konverter" beschreibt, wo die Seite ist, nicht wohin Ihre Datei geht. Beide Arten von Werkzeug sind eine URL, die Sie besuchen. Der Unterschied ist, ob die Konvertierung im JavaScript der Seite läuft, die Sie geladen haben, oder in einem Prozess auf dem Rechner von jemand anderem, den Ihre Datei erst erreichen muss.

Ein Konverter im Browser lädt seinen Code einmal herunter, liest die Datei dann über die `File`-API und konvertiert sie im Tab. Nichts verlässt den Rechner, weil es nichts zu senden gibt: der Parser ist schon lokal. Ein serverseitiger Konverter schickt Ihre Datei an einen Endpunkt, konvertiert sie dort und sendet HTML zurück. Beide können völlig sauber betrieben sein. Nur eines von beiden ist von Ihnen überprüfbar, im Moment, ohne einer Datenschutzseite zu glauben.

Diese Unterscheidung ist ungleich wichtig. Für eine öffentliche README ist sie völlig belanglos — die Datei liegt schon im Internet. Für einen Kundenvertrag, eine Vorfallsanalyse mit Kundennamen, einen unveröffentlichten Preisplan, eine Patientennotiz oder irgendetwas, das unter eine Vereinbarung fällt, die Sie unterschrieben haben, ist sie die ganze Frage — und die Antwort „der Anbieter sagt, er löscht es" gehört nicht in dieselbe Klasse wie „die Anfrage hat nie stattgefunden".

Das zweite, was „online" verbirgt, ist, was Sie zurückbekommen. Manche Werkzeuge geben Ihnen ein Fragment — `<h1>Titel</h1><p>Text</p>` ohne Dokument darum — was gültiges HTML ist, als schwarzer Text in der Standardbreite des Browsers erscheint und für jeden, der es bekommt, kaputt aussieht. Andere geben Ihnen ein vollständiges Dokument, das sein Stylesheet von einem CDN holt, was auf Ihrem Rechner richtig aussieht und im Zug falsch. Eine dritte Gruppe gibt Ihnen eine eigenständige Datei: Doctype, Head, Zeichensatz, Stile eingebettet, keine externen Anfragen. Nur die dritte verhält sich gleich, wo immer sie landet.

## Die Wege im Überblick

| Weg | Installation nötig | Wohin Ihre Datei geht | Ausgabe | Am besten für |
| --- | --- | --- | --- | --- |
| Konverter im Browser | Keine | Nirgendwohin, abgemeldet | Eigenständige HTML-Datei | Ein Dokument, jetzt, das an eine Person geht |
| Serverseitiger Online-Konverter | Keine | Zum Anbieter hochgeladen | Unterschiedlich: Fragment oder Dokument | Öffentliche Dateien, bei denen der Upload nichts ausmacht |
| TransformPipe | Keine | Nirgendwohin, abgemeldet | Vollständiges HTML, Stile eingebettet | Dieselbe Aufgabe, mit REST-API, CLI und CI-Action, falls sie sich wiederholt |
| VS-Code-Vorschau plus Erweiterung | Editor haben Sie schon | Nirgendwohin | Hängt an der Erweiterung | Eine README, die Sie ohnehin offen haben |
| Pandoc | Haskell-Programm, Paketmanager | Nirgendwohin | Vollständiges Dokument mit `--standalone` | Wiederholbare Aufgaben, und Formate jenseits von HTML |
| Eine JS- oder Python-Bibliothek | Paketmanager, Code | Nirgendwohin | Fragment; die Verpackung schreiben Sie | Konvertierung innerhalb einer Anwendung |
| Statischer Seitengenerator | Node, Ruby, Go oder Python plus Konfiguration | Nirgendwohin | Eine Website | Ein Verzeichnis verlinkter Dokumente |
| GitHub oder GitLab | Keine | Schon hochgeladen | Kein Export-Knopf | Markdown lesen, nicht konvertieren |
| Der Export eines Editors | Editor-Installation | Nirgendwohin | Vollständiges Dokument, auf seine Art formatiert | Leute, die die Datei gerade schreiben |
| Aus dem Browser als PDF drucken | Keine | Nirgendwohin | PDF, kein HTML | Ein Empfänger, der Seitenumbrüche will |

Die Tabelle ist die Kurzübersicht für den Rest des Textes. Zwei Zeilen sind es wert, laut gesagt zu werden: die kostenlosen Wege ohne Installation sind die ersten drei, und der einzige Unterschied zwischen dem ersten und dem zweiten ist, ob eine Anfrage Ihren Rechner verlässt — während die Zeile mit dem Editor-Export die ist, auf der Leute versehentlich landen, indem sie ein Schreibwerkzeug für eine Datei öffnen, die sie schon fertig hatten, was [der Fehler hinter den meisten Suchen nach einer Dillinger-Alternative ist](/blog/dillinger-alternatives).

## Markdown im Browser in HTML umwandeln, Schritt für Schritt

Das ist der schnelle Weg, ausgeschrieben. Er setzt einen Konverter voraus, der seinen Parser in der Seite laufen lässt. Nichts hier braucht ein Terminal.

**1. Haben Sie die Datei bereit, und wissen Sie, welche Datei es ist.** Markdown kommt als `.md`, `.markdown`, `.mdown` oder `.txt` an, und gelegentlich ganz ohne Endung. Wenn Sie nicht sicher sind, was Sie haben, öffnen Sie es zuerst in einem Texteditor: Markdown sieht aus wie Prosa mit `#`, `*` und `[]()` darin. Wenn die Datei aus einer Notiz-Anwendung kam, lohnt sich ein Blick darauf, [was ein Export tatsächlich enthält](/blog/how-to-open-md-file), bevor Sie ihn konvertieren, denn manche Exporte sind ein Ordner mit den Bildern neben dem Text.

**2. Öffnen Sie den Konverter und prüfen Sie, dass die Seite vollständig geladen hat.** Ein Werkzeug im Browser muss seinen Parser herunterladen, bevor es arbeiten kann. Bei langsamer Verbindung kann die Ablagefläche erscheinen, bevor der Code dahinter angekommen ist. Wenn die Seite eine Vorschau hat, tippen Sie ein `#` hinein und sehen Sie zu, wie eine Überschrift erscheint — das ist der Parser, der antwortet.

**3. Ziehen Sie die Datei auf die Seite, oder fügen Sie den Text ein.** Das Ziehen erhält den Dateinamen, den die meisten Werkzeuge für den Download wiederverwenden. Einfügen ist besser, wenn das Markdown in einem Chat-Fenster oder einer E-Mail steht und nie eine Datei war. So oder so wird die Quelle lokal gelesen; ein Ablegen ist kein Upload, und der nächste Abschnitt zeigt, wie man das beweist.

**4. Lesen Sie die Vorschau, nicht den Quelltext.** Die Vorschau ist der erste Ort, an dem ein Dialektproblem auftaucht. Sehen Sie sich ausdrücklich die Tabellen an, dann etwaige Aufgabenlisten, dann alles mit einem Backtick darin. Eine Tabelle, die als Absatz voller Pipe-Zeichen erscheint, heißt, dass der Parser als reines CommonMark läuft, wo Tabellen nicht Teil der Spezifikation sind.

**5. Wählen Sie den Export, den Sie wirklich wollen.** Eine vollständige, eigenständige HTML-Datei ist die, die an eine Person geht. Ein Fragment ist das, was in eine Seite eingefügt wird, die schon existiert — ein CMS-Feld, eine E-Mail-Vorlage, ein Wiki, das HTML annimmt. Das Falsche zu wählen ist der mit Abstand häufigste Grund, warum eine konvertierte Datei am anderen Ende „unformatiert aussieht".

**6. Laden Sie sie herunter, und öffnen Sie den Download.** Nicht die Vorschau — die Datei auf der Platte, doppelt angeklickt, damit sie über das `file://`-Protokoll öffnet, so wie Ihr Empfänger sie öffnen wird. Das kostet fünf Sekunden und ist der Schritt, den Leute überspringen.

**7. Prüfen Sie sie, bevor Sie sie verschicken.** Der nächste Abschnitt ist die Liste.

Zwei Abwandlungen sind es wert, gekannt zu werden. Wenn das Markdown von jemand anderem ist — aus einem Repository gezogen, von einem Kunden weitergeleitet, von einem Werkzeug erzeugt — muss der Konverter bereinigen, denn Markdown erlaubt bewusst rohes HTML, und rohes HTML erlaubt `<script>`, `onerror=` und `javascript:`-URLs. [Warum das ein echter und kein theoretischer Angriffsweg ist](/blog/sanitising-markdown-safely), steht in einem eigenen Text; die Kurzfassung ist, dass ein treuer Renderer jeden einzelnen davon Ihrem Browser übergibt. Und wenn die Datei groß ist, denken Sie daran, dass der Browser die Arbeit mit dem Speicher macht, den der Tab hat: ein sehr großes Dokument konvertiert auf einem Laptop und ringt auf einem Telefon.

| Schritt | Was schiefgehen kann | Die Abhilfe |
| --- | --- | --- |
| Die Seite laden | Der Parser ist noch nicht da; das Ablegen tut nichts | Neu laden, warten, bis die Vorschau reagiert |
| Die Datei ablegen | Falsche Datei, oder ein Ordner | Endung prüfen; die `.md` ablegen, nicht ihr Verzeichnis |
| Die Vorschau lesen | Tabellen flach, Checkboxen als wörtliche Klammern | Der Parser macht kein GFM; nehmen Sie einen, der es tut |
| Den Export wählen | Fragment gewählt für ein Dokument | Nehmen Sie die vollständige Datei, mit eingebetteten Stilen |
| Herunterladen | Der Browser blockiert den Download lautlos | Download-Leiste und Berechtigungsabfrage prüfen |
| Das Ergebnis öffnen | Nach der Vorschau beurteilt, nie von der Platte | Die heruntergeladene Datei doppelt anklicken |

**Für wen dieser Weg ist:** jeden, dessen nächste Handlung ist, eine Datei anzuhängen oder einen Link in eine Nachricht zu setzen. Ein Dokument, ein Empfänger, keine Wiederholung. Sobald eine dieser Zahlen steigt, lesen Sie den Abschnitt darüber, wo dieser Weg scheitert.

## Was Sie am Ergebnis prüfen sollten, bevor Sie es verschicken

Dass die Konvertierung gelungen ist und dass die Datei verschickbar ist, sind zwei verschiedene Tatsachen. Hier ist die Liste, in der Reihenfolge, die die meisten Probleme am frühesten erwischt.

**Öffnet sie allein?** Klicken Sie die heruntergeladene Datei doppelt an. Wenn Sie formatierten, lesbaren Text in einem vernünftigen Satzmaß bekommen, ist es ein Dokument. Wenn Sie schwarze Times New Roman über die volle Fensterbreite bekommen, haben Sie ein Fragment erhalten. Welches es ist, bestätigen Sie, indem Sie die Datei in einem Texteditor öffnen und die erste Zeile ansehen: ein Dokument beginnt mit `<!doctype html>` und hat einen `<head>` mit einem `<style>`-Block oder einem Stylesheet-Link darin.

**Übersteht sie es, wenn das Netz aus ist?** Schalten Sie WLAN ab und öffnen Sie die Datei erneut in einem frischen Tab. Ein eigenständiger Export sieht identisch aus. Ein Export, der ein Stylesheet oder eine Webschrift von einem CDN verlinkt, verliert seine Typografie und oft sein Layout — und dass es vor einer Minute auf Ihrem Rechner funktioniert hat, sagt nichts über das Flugzeug, in dem Ihr Empfänger sitzt.

**Sind die Tabellen als Tabellen durchgekommen?** Tabellen sind das häufigste Opfer, weil sie ein Merkmal von GitHub Flavored Markdown und keines von CommonMark sind. Prüfen Sie die Kopfzeile, die Ausrichtungs-Doppelpunkte und jede Zelle, die ein Pipe-Zeichen innerhalb von Code enthält. [Die konkreten Weisen, auf die eine Tabelle beim Übergang bricht](/blog/markdown-tables-that-survive-conversion), sind es wert, gekannt zu werden, wenn Ihre Dokumente tabellenlastig sind.

**Sind die Codeblöcke noch Blöcke?** Sehen Sie nach Zaun-Inhalt, der als ein langer Absatz erscheint — das heißt, die Zäune wurden nicht erkannt — und nach dem Sprach-Tag aus dem Info-String, das als wörtlicher Text auftaucht. Die Syntaxfärbung ist wieder eine eigene Frage: ein Konverter kann das richtige `<code class="language-js">` ausgeben und trotzdem keine Farben mitliefern, denn Färben braucht CSS oder JavaScript auf der Seite.

**Erscheinen die Bilder?** Hier scheitert eine konvertierte Datei am anderen Ende am häufigsten. Ein relativer Pfad wie `![](images/diagram.png)` löst sich gegen den Ort auf, an dem die HTML-Datei liegt — in dem Moment, in dem Sie das HTML allein mailen, ist das Bild weg. Entweder die Bilder reisen mit der Datei in derselben Ordnerstruktur, oder sie müssen eingebettet werden, oder sie brauchen absolute URLs, die für den Leser noch erreichbar sind.

**Landen die internen Links noch?** Anker-Links, geschrieben als `[siehe unten](#konfiguration)`, hängen davon ab, dass der Konverter eine ID an der Überschrift erzeugt — und dass er die ID erzeugt, die Sie erwartet haben. Verschiedene Konverter bilden Slugs verschieden: Zeichensetzung, Groß- und Kleinschreibung und Zeichen jenseits von ASCII werden alle uneinheitlich behandelt. Ein Dokument mit einem handgeschriebenen Inhaltsverzeichnis braucht deshalb geklickte Links, keine angenommenen.

**Was ist mit dem Frontmatter passiert?** Wenn die Datei mit einem `---`-Block aus `key: value`-Zeilen beginnt, sind sich die Konverter darüber völlig uneins. Manche entfernen ihn, manche stellen ihn als Absatz mit Metadaten am Anfang Ihres Dokuments dar, und einige machen eine Tabelle daraus. Nur eines davon ist, was Sie wollten, und Sie finden es heraus, indem Sie hinsehen.

**Ist der Text selbst unversehrt?** Prüfen Sie typografische Anführungszeichen, Gedankenstriche, Umlaute und Symbole in Emoji-Nähe. Zeichensalat am Anfang eines Dokuments heißt fast immer, dass im Head kein `<meta charset="utf-8">` steht und der Browser eine Acht-Bit-Kodierung geraten hat.

| Prüfung | Wie genau | Wie das Scheitern aussieht |
| --- | --- | --- |
| Vollständiges Dokument | Datei im Texteditor öffnen; nach `<!doctype html>` sehen | Beginnt mit `<h1>` |
| Eigenständig | WLAN aus, neu öffnen | Schriften und Layout ändern sich |
| Tabellen | Kopfzeile ansehen | Ein Absatz aus Pipes |
| Codeblöcke | Nach dem Info-String als Text sehen | `js` steht über Ihrem Code |
| Bilder | Aus einem anderen Ordner öffnen | Platzhalter für kaputte Bilder |
| Anker | Drei davon anklicken | Nichts bewegt sich |
| Frontmatter | Den Seitenanfang ansehen | Ein Block aus `key: value`-Zeilen |
| Kodierung | Anführungszeichen und Striche ansehen | Fragezeichen oder `Ã¢â‚¬â€œ` |
| Rohes HTML | Im Quelltext nach `<script` suchen | Ein Tag, das Sie nicht geschrieben haben, unversehrt |

**Für wen diese Liste ist:** für jeden, einmal. Gehen Sie sie beim ersten Einsatz eines Konverters vollständig durch, danach wissen Sie, welche zwei Zeilen für Ihre Dokumente zählen, und können nur die prüfen.

## Wie Sie bestätigen, dass nichts hochgeladen wurde

Sie müssen das niemandem glauben. Der Browser sagt es Ihnen, und es gibt drei Arten zu fragen, in steigender Überzeugungskraft.

**Das Netzwerk-Panel, live beobachtet.** Öffnen Sie die Entwicklerwerkzeuge, bevor Sie konvertieren — F12 unter Windows und Linux, oder Command-Option-I auf einem Mac, in Chrome, Edge und Firefox. In Safari muss das Entwickler-Menü erst in den Einstellungen aktiviert werden, bevor der Web-Inspektor überhaupt erscheint. Gehen Sie ins Netzwerk-Panel, setzen Sie die Option, die das Protokoll über Seitenladevorgänge hinweg behält, und laden Sie die Konverter-Seite einmal neu, damit Sie die Anfragen sehen, mit denen sie sich selbst lädt. Leeren Sie jetzt das Protokoll und konvertieren Sie Ihre Datei. Wenn die Konvertierung lokal ist, bleibt diese geleerte Liste leer. Jede Anfrage, die doch erscheint, ist anklickbar: das Panel zeigt Methode, Größe und, bei einem POST, die Nutzlast, die Sie gesendet haben.

**Der Offline-Test.** Das ist die stärkere Fassung, weil sie die Möglichkeit einer übersehenen Anfrage ausschließt. Laden Sie die Konverter-Seite mit Verbindung, trennen Sie dann vollständig — WLAN aus, Kabel ziehen, oder das Drosselungs-Menü im Netzwerk-Panel auf „Offline" stellen. Und dann konvertieren. Wenn es weiterhin funktioniert, läuft der Parser auf Ihrem Rechner, denn es gibt keinen Weg irgendwohin. Wenn es scheitert oder hängt, war die Konvertierung nie lokal.

**Ein zweiter Besuch mit nichts als dem Tab.** Manche Werkzeuge registrieren einen Service Worker, was heißt, dass die Seite selbst beim zweiten Besuch offline lädt. Tun Sie das, und konvertieren Sie dann mit weiterhin abgeschaltetem Netz. Jetzt ist gezeigt, dass sowohl die Seite als auch die Konvertierung nichts brauchen.

Zwei ehrliche Einschränkungen. Erstens beweist ein leeres Netzwerk-Panel, dass *bei dieser Konvertierung* nichts hochgeladen wurde, nicht dass das Werkzeug unter anderen Umständen nie etwas hochlädt — Anmelden, ein Dokument speichern oder eine Freigabefunktion nutzen sind genau die Fälle, in denen eine Anfrage der Punkt ist. Ein Werkzeug, das ein Dokument serverseitig behält, muss es senden; die Frage ist, ob es das tut, wenn Sie nicht gefragt haben. Zweitens werden Sie möglicherweise Anfragen sehen, die mit Ihrer Datei nichts zu tun haben: Analyse-Pings, Schriftdateien, Fehlerberichte. Beurteilen Sie sie, indem Sie sie anklicken. Ein Telemetrie-Signal ist ein paar hundert Byte ohne Dokument darin; ein Upload Ihrer Datei ist ein POST, dessen Größe der Größe der Datei folgt und dessen Nutzlast Sie im Panel lesen können.

| Methode | Was sie beweist | Aufwand | Schwäche |
| --- | --- | --- | --- |
| Netzwerk-Panel, Protokoll vor dem Konvertieren geleert | Diese Konvertierung ging von keiner Anfrage begleitet | Unter einer Minute | Sie müssen die Anfragen lesen, die Sie doch sehen |
| Auf „Offline" drosseln, dann konvertieren | Die Konvertierung braucht überhaupt kein Netz | Sekunden | Die Seite muss schon geladen sein |
| Den Rechner vollständig trennen | Dasselbe, ohne etwas falsch einstellen zu können | Sekunden | Unterbricht alles andere, was Sie gerade tun |
| Zweiter Besuch, offline, Service Worker | Seite und Konvertierung beide lokal | Eine Minute | Funktioniert nur, wenn das Werkzeug sich selbst zwischenspeichert |

Es gibt eine vierte Prüfung, nach der Leute greifen und die nicht funktioniert: die Datenschutzseite lesen. Sie mag völlig zutreffend sein, und sie ist kein Beweis, denn sie beschreibt Absicht statt Verhalten. Das Netzwerk-Panel beschreibt Verhalten.

**Für wen dieser Abschnitt ist:** jeden, der ein Dokument konvertiert, das er nicht gern in einer Meldung über eine Datenpanne sähe. Ist die Datei eine öffentliche README, überspringen Sie ihn. Der Sinn, die Prüfung einmal an einem Werkzeug durchzuführen, das Sie wieder verwenden wollen, ist, dass Sie sie nie wieder durchführen müssen.

## Mehrere Dateien zu einem Dokument zusammenfügen

Die häufige Fassung davon ist ein Satz Kapitel, ein Ordner Besprechungsnotizen oder ein Dokumentationsverzeichnis, das jemand als eine lesbare Seite haben will. Es gibt zwei Wege dorthin im Browser, und einer davon ist deutlich weniger Arbeit.

**Erst zusammenfügen, einmal konvertieren.** Fügen Sie die Markdown-Dateien zu einer einzigen `.md`-Datei zusammen und konvertieren Sie diese auf dem gewöhnlichen Weg. Das Ergebnis ist ein Dokument mit einem Inhaltsverzeichnis, einem Satz Stile und einer Datei zum Verschicken.

```bash
# Alphabetische Reihenfolge, weshalb mit Nullen aufgefüllte Zahlen wichtig sind
cat 01-intro.md 02-setup.md 03-api.md > combined.md

# Alles im Ordner, Leerzeile zwischen den Dateien, damit Überschriften nicht kollidieren
awk 'FNR==1 && NR>1 { print "" } { print }' *.md > combined.md
```

```powershell
# PowerShell, ausdrücklich sortiert statt der Reihenfolge des Providers zu trauen
Get-ChildItem *.md | Sort-Object Name | Get-Content | Set-Content -Encoding utf8 combined.md
```

**Oder fügen Sie sie in der Reihenfolge ein.** Wenn Sie ein Terminal überhaupt nicht anfassen wollen, öffnen Sie jede Datei in einem Texteditor und fügen Sie sie eine nach der anderen in die Eingabe des Konverters ein, mit einer Leerzeile dazwischen. Ab etwa fünf Dateien ist es mühsam und darunter völlig zuverlässig.

So oder so gehen dieselben vier Dinge schief, und sie gehen leise schief:

**Die Reihenfolge.** `chapter-2.md` sortiert in jeder alphabetischen Sortierung nach `chapter-10.md`. Füllen Sie die Zahlen mit Nullen auf — `02`, `10` — oder führen Sie die Dateien ausdrücklich in der gewünschten Reihenfolge auf.

**Die Überschriftenebenen.** Jede Datei beginnt wahrscheinlich bei `#`, denn jede Datei war ihr eigenes Dokument. Zusammengefügt bekommen Sie zehn `<h1>`-Elemente und keine Hierarchie, was das Inhaltsverzeichnis unbrauchbar und das Dokument flach macht. Setzen Sie die Überschriften jeder Datei um eine Ebene herab, bevor Sie zusammenfügen, damit die Dateititel zu `##` unter einem einzigen `#` werden.

**Doppelte Anker-IDs.** Drei Kapitel mit einem Abschnitt „Überblick" erzeugen drei Überschriften, die dieselbe ID wollen. Konverter lösen das verschieden: manche hängen einen Zähler an, manche geben die Dublette aus und lassen den Browser die erste wählen. So oder so landet die Hälfte Ihrer Querverweise im falschen Kapitel.

**Verirrte `---`-Zeilen.** Drei Bindestriche sind in Markdown eine Trennlinie, am Dateianfang ein Frontmatter-Trenner, und direkt unter einer Textzeile eine Setext-Überschriften-Unterstreichung. Dateien zusammenzufügen setzt viele `---` in die Mitte eines Dokuments, und jedes davon wird danach ausgelegt, wo es landet, nicht danach, was Sie gemeint haben.

[Die Mechanik des richtigen Zusammenführens](/blog/merging-many-markdown-files) — Herabsetzen, Anker-Kollisionen und danach ein Inhaltsverzeichnis zu bauen, das funktioniert — geht weit über das hinaus, was hier hineinpasst, und sie ist der Unterschied zwischen einem Dokument und zehn Dokumenten in einem Trenchcoat.

| Anzahl Dateien | Vernünftiges Vorgehen |
| --- | --- |
| Zwei oder drei | In der Reihenfolge in den Konverter einfügen |
| Vier bis zwanzig | Mit `cat` oder `awk` zusammenfügen, dann einmal konvertieren |
| Ein Verzeichnis, einmalig | Zusammenfügen, Überschriften per Skript herabsetzen, einmal konvertieren |
| Ein Verzeichnis, wiederholt | Ein CLI oder ein Build-Schritt, kein Browser-Tab |
| Ein Verzeichnis, das getrennte Seiten bleiben soll | Ein statischer Seitengenerator |

**Für wen das ist:** jeden, der ein einziges Ergebnis aus mehreren Quellen erzeugt. Wenn die Dateien getrennte, untereinander verlinkte Seiten bleiben sollen, fügen Sie nicht zusammen — Sie bauen eine Website, und das ist der nächste Abschnitt.

## Wo der Browser-Weg scheitert, und was das kostet

Der ehrliche Teil. Ein Browser-Tab ist die richtige Antwort auf eine enge Frage, und es gibt fünf Situationen, in denen er die falsche ist. An jeder hängt ein Preis, und den zahlt meist später jemand anderes.

**Die Konvertierung wiederholt sich.** Wenn diese Datei bei jeder Änderung konvertiert wird, ist ein Mensch in einem Browser-Tab jetzt ein Schritt in Ihrem Prozess, und Schritte, die Menschen ausführen, werden übersprungen. Der Preis ist eine veraltete veröffentlichte Seite, die niemandem aufgefallen ist, weil die Person, die sie normalerweise konvertiert, im Urlaub war. Die Abhilfe ist ein Befehl in einem Skript oder ein Job in CI — ein API-Aufruf, ein CLI oder eine GitHub Action, die auf dem Pull Request läuft, der die Datei geändert hat.

**Die Eingabe ist ein Verzeichnis, das ein Verzeichnis bleiben soll.** Zwanzig Dokumente, die aufeinander verweisen, sind eine Website, und eine Website braucht Navigation, einen Suchindex und einheitliche Querverweise. Sie zu einer Seite zu verschmelzen verliert alle drei. Der Preis, es doch durch einen Konverter zu drücken, ist eine vierzigtausend Wörter lange Seite, in der niemand navigieren kann; der Preis der Alternative ist eine Konfigurationsdatei und ein Build-Schritt, für immer zu pflegen.

**Die Ausgabe ist nicht HTML.** Wenn der Empfänger PDF, Word oder EPUB will, ist HTML bestenfalls ein Zwischenschritt. Aus dem Browser als PDF zu drucken funktioniert und gibt Ihnen die Seitenaufteilung des Browsers, also Kopfzeilen, Fußzeilen und Seitenumbrüche, die Sie nicht genau steuern. Für echte Kontrolle über eines davon ist Pandoc das Werkzeug, und es ist eine Installation.

**Die Datei ist zu groß für die Reise.** Der Browser konvertiert mit dem Speicher, den der Tab hat, und jedes Werkzeug, das eine Kopie Ihres Dokuments serverseitig behält, hat auf dem Weg hinein eine Begrenzung der Anfragegröße. Ein hier aufbewahrtes Dokument ist bei 4 MB gedeckelt, weil die empfangende Funktion einen größeren Rumpf ablehnt; die Konvertierung selbst ist bei 10 MB gedeckelt. Das sind die Zahlen, die man prüft, bevor man versucht, ein Buch durch einen Tab zu schieben — und die Art des Scheiterns, eine abgelehnte Anfrage oder ein Tab, der nicht mehr reagiert, ist wenigstens laut.

**Das Dokument braucht ein Layout, das Sie festgelegt haben.** Der Export eines Konverters trägt das Stylesheet des Konverters. Wenn Ihre Organisation eine Vorlage, eine Schrift und eine Farbe hat, bearbeiten Sie entweder jedes Mal das exportierte CSS von Hand, oder Sie nehmen etwas mit einer Vorlagensprache. Pandoc hat Vorlagen; Generatoren haben Themes; ein Konverter hat eine Voreinstellung. Das CSS einmal von Hand zu bearbeiten ist in Ordnung und beim fünften Mal ein Risiko.

| Situation | Was ein Browser-Tab Sie kostet | Nehmen Sie stattdessen |
| --- | --- | --- |
| Konvertiert bei jeder Änderung | Ein manueller Schritt, der übersprungen wird | CLI, REST-API oder eine CI-Action |
| Ein Verzeichnis verlinkter Seiten | Keine Navigation, keine Suche, keine Querverweise | Statischer Seitengenerator |
| Ausgabe muss PDF oder Word sein | Die Seitenaufteilung des Browsers, nicht Ihre | Pandoc |
| Sehr große Dokumente | Eine abgelehnte Anfrage oder ein hängender Tab | Ein lokales CLI |
| Ein festgelegtes Hauslayout | Exportiertes CSS wiederholt von Hand bearbeiten | Vorlagen oder ein Theme |
| Konvertierung in der eigenen Anwendung | Ein Mensch in der Schleife | Eine Bibliothek: marked, markdown-it, remark |

Nichts davon macht einen Konverter im Browser zu einem schlechten Werkzeug. Es macht ihn zu einem Werkzeug mit einer Form. [Was mit Ihrer Datei in jeder der vier Stufen tatsächlich passiert](/blog/markdown-to-html-converter), erklärt, warum die Form so ist, wie sie ist: Parsen, Ausgeben, Bereinigen und Verpacken können jeweils an einem anderen Ort laufen, und ein Browser-Tab ist einfach der Ort, an dem alle vier gleichzeitig laufen können, ohne Installation.

## Wie Sie wählen

1. **Entscheiden Sie, wer die Datei als nächstes öffnet.** Ist es ein Mensch, brauchen Sie ein vollständiges, eigenständiges Dokument, und ein Fragment kostet eine Rückfrage, um sich zu erklären. Ist es eine Vorlage oder ein CMS-Feld, brauchen Sie das Fragment, und ein Dokument wird mit der umgebenden Seite streiten.
2. **Entscheiden Sie, ob das noch einmal passiert.** Einmal ist ein Browser-Tab. Wöchentlich ist ein Befehl, den Sie in ein Skript schreiben können. Bei jedem Commit ist ein CI-Job. Für den dritten Fall den Browser zu wählen heißt, dass die Konvertierung nur so verlässlich ist wie das Gedächtnis von jemandem.
3. **Prüfen Sie, wohin die Datei geht, bevor Sie etwas Vertrauliches konvertieren.** Öffnen Sie das Netzwerk-Panel, oder konvertieren Sie mit abgeschaltetem Netz. Sechzig Sekunden jetzt, gegen später zu erfahren, dass ein Dokument unter einer von Ihnen unterschriebenen Vereinbarung einen Ausflug zu einem Dritten gemacht hat.
4. **Konvertieren Sie eine repräsentative Datei, keinen Testabsatz.** Nehmen Sie das Dokument mit der breitesten Tabelle, dem längsten Codeblock und dem unbequemen Bildpfad darin. Ein Konverter, der „Hallo **Welt**" verkraftet, sagt Ihnen nichts; die echte Datei sagt Ihnen alles auf einmal.
5. **Öffnen Sie das Ergebnis irgendwo außerhalb des Werkzeugs.** Ein anderer Browser, ein anderer Rechner, das Netz aus. Dieser eine Test erwischt Fragmente, fehlende Stile und CDN-Abhängigkeiten zusammen, und er ist die Prüfung, die Sie davon abhält, eine Datei zu verschicken, die nur auf dem Rechner funktioniert, auf dem sie entstand.

## Fazit

Markdown online in HTML umzuwandeln ist tatsächlich eine Sache von zwanzig Sekunden, und alles Schwierige daran liegt entweder vor der Konvertierung — zu wissen, ob Ihre Datei den Rechner verlässt — oder danach, in den vier oder fünf Prüfungen, die ein verschickbares Dokument von einem unterscheiden, das bloß existiert. Datei ablegen, Vorschau lesen, die vollständige Datei statt des Fragments herunterladen, sie von der Platte mit abgeschaltetem Netz öffnen und die Tabellen ansehen. [Die Markdown-zu-HTML-Konvertierung von TransformPipe](/) macht diesen ersten Teil in Ihrem Browser, kostenlos, ohne dass abgemeldet etwas hochgeladen wird und ohne Installation, die man danach zurücknehmen müsste. Wenn die Aufgabe aufhört, eine Datei für eine Person zu sein, und anfängt, ein Verzeichnis, ein Zeitplan oder ein anderes Format als HTML zu sein, greifen Sie nicht mehr nach einem Tab, sondern nach einem Werkzeug, das für Wiederholung gebaut ist — und wenn die Datei schon vor Ihnen offen liegt, ist [Markdown in HTML umwandeln in VS Code](/blog/markdown-to-html-in-vs-code) der nächste Ort zum Nachsehen, denn die Vorschau des Editors und der Export des Editors sind nicht dasselbe Programm.

## FAQ

### Wie lange dauert es tatsächlich, eine Markdown-Datei im Browser zu konvertieren?

Die Konvertierung selbst sind Millisekunden für ein gewöhnliches Dokument — ein Parser, der über ein paar tausend Wörter läuft, ist keine schwere Arbeit. Die Zeit geht in das Laden der Seite, das Ablegen der Datei und die Prüfungen danach, weshalb die ehrliche Antwort lautet: unter einer Minute für die erste Datei und etwa zwanzig Sekunden für jede weitere.

### Wie beweise ich, dass der Konverter meine Datei nicht hochgeladen hat?

Öffnen Sie das Netzwerk-Panel des Browsers, leeren Sie das Protokoll und konvertieren Sie: eine lokale Konvertierung fügt keine Anfragen hinzu. Die stärkere Fassung ist, die Seite zu laden, sich vollständig vom Netz zu trennen und offline zu konvertieren — funktioniert es ohne Verbindung, wurde nichts gesendet, weil es nirgendwohin zu senden gab.

### Kann ich eine `.md`-Datei auf einem Telefon konvertieren?

Ja, wenn der Konverter im Browser läuft und die Datei dort liegt, wo die Dateiauswahl des Browsers hinkommt — ein Download-Ordner, ein Cloud-Laufwerk mit einer App, die Dateien bereitstellt, oder ein Teilen-Menü. Die Grenze ist der Speicher, nicht das Können: ein Telefon konvertiert eine README bequem und ringt dort, wo ein Laptop es nicht täte.

### Was mache ich mit den Bildern in meinem Markdown?

Entscheiden Sie vor dem Konvertieren, ob die Bilder mit dem HTML reisen werden. Relative Pfade funktionieren nur, wenn die Ordnerstruktur mitkommt — für eine Datei, die Sie allein mailen, wollen Sie die Bilder also entweder im Dokument eingebettet oder auf absolute URLs gerichtet, die für den Leser noch auflösen.

### Funktioniert das exportierte HTML auch ohne Internetverbindung?

Nur wenn es eigenständig ist. Eine Datei mit ihren Stilen in einem eingebetteten `<style>`-Block und ihren Bildern eingebettet braucht vom Netz nichts und öffnet auf einem getrennten Rechner identisch; eine, die ein Stylesheet oder eine Webschrift von einem CDN verlinkt, verfällt leise zu unformatiertem Text, sobald sie offline geöffnet wird.

### Kann ich mehrere Markdown-Dateien ohne Terminal zu einer HTML-Seite zusammenfügen?

Ja — fügen Sie die Dateien eine nach der anderen in die Eingabe des Konverters ein, in der gewünschten Reihenfolge, mit einer Leerzeile dazwischen. Ab etwa fünf Dateien hört es auf angenehm zu sein, und dann übernimmt ein `cat`- oder `Get-Content`-Befehl das Zusammenfügen verlässlicher als Kopieren und Einfügen.

### Was passiert mit dem YAML-Frontmatter am Anfang meiner Datei?

Das hängt ganz am Konverter: manche entfernen den Block, manche stellen ihn als Absatz aus `key: value`-Zeilen am Seitenanfang dar, und einige machen eine Tabelle daraus. Konvertieren Sie eine Datei mit Frontmatter und sehen Sie sich den Anfang der Ausgabe an, bevor Sie etwas annehmen, denn keines dieser Verhalten ist falsch und nur eines ist, was Sie wollen.
