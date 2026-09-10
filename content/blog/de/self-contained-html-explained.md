---
title: "Eigenständiges HTML erklärt: was ein HTML-Dokument in einer Datei wirklich ist"
description: "Was ein HTML-Dokument in einer Datei enthält, was eingebettete Stile und Bilder an Bytes kosten, wie Sie beweisen, dass es nichts anfragt, und wann es falsch ist"
date: 2026-08-14
tag: Veröffentlichen
keywords: html in einer datei, eigenständiges html, css in html einbetten, bilder als data uri, html datei offline öffnen, html anhang per e-mail, webseite archivieren
---

Ein Kollege schickt Ihnen eine HTML-Datei. Sie öffnen sie im Zug oder auf einem Laptop, der seit Freitag nicht mehr im Netz war, und eines von zwei Dingen passiert. Entweder Sie bekommen das Dokument — Überschriften, Tabellen, Bilder, alles — oder Sie bekommen schwarze Times New Roman in der vollen Breite des Fensters, mit drei Symbolen für defekte Bilder an der Stelle, wo die Diagramme waren. Beide Dateien sind gültiges HTML. Nur eine von ihnen ist ein Dokument.

Der Unterschied ist, ob die Datei noch etwas anderes braucht, um sie selbst zu sein. Eine Seite im Web ist normalerweise ein Verzeichnis: sie benennt ein Stylesheet, ein paar Schriften, eine Handvoll Bilder, und der Browser holt jedes davon der Reihe nach. Das funktioniert wunderbar, wenn die Seite an einer Adresse wohnt und der Leser eine Verbindung hat. Es scheitert vollständig, wenn die Seite ein Anhang in einem Postfach, eine Datei in einem Archiv oder ein Beweisstück in einem Ordner ist, den jemand in vier Jahren öffnen wird.

### Kurzfassung

Ein HTML-Dokument in einer Datei ist eine einzige `.html`-Datei, die korrekt dargestellt wird, wenn das Netzwerkkabel gezogen ist, weil alles, was sie braucht, in ihr steckt: das Stylesheet ist ein eingebetteter `<style>`-Block statt eines `<link>`, die Bilder sind Data-URIs statt Pfade, und keine Schrift, kein Skript und kein Zählpixel wird von irgendwoher geholt. Überprüfen Sie es, indem Sie die Verbindung trennen, die Datei öffnen und zusehen, wie der Netzwerk-Tab nichts aufzeichnet — eine Anfrage für die Datei selbst, wenn sie ausgeliefert wird, und null danach. Es ist das richtige Format für das Archivieren, für den Versand per E-Mail und dafür, jemandem außerhalb Ihrer Organisation ein Dokument in die Hand zu geben, denn es übersteht die Reise und erzählt dieser Person nichts darüber, wo es gewesen ist. Die Kosten sind echt und gehören ausgesprochen: die Datei ist rund ein Drittel größer als ihre Bilder, nichts in ihr kann zwischengespeichert werden, und Sie können keinen Tippfehler korrigieren, ohne das Ganze erneut zu verschicken.

## Was „HTML in einer Datei“ genau bedeutet

Der Ausdruck wird locker verwendet, es lohnt sich also, ihn festzunageln. Ein HTML-Dokument in einer Datei gibt ein Versprechen: von einer lokalen Platte geöffnet, ohne Netz irgendeiner Art, wird es so dargestellt, wie sein Autor es beabsichtigt hat. Dieses Versprechen hat drei Folgen, und sie sind die ganze Definition.

Jede Stilregel steht im Dokument. Es gibt kein `<link rel="stylesheet">`, das auf ein `styles.css` von nebenan zeigt, und keines, das auf ein CDN zeigt. Die Regeln sitzen in einem `<style>`-Element im Head, oder als `style=`-Attribute an den Elementen, oder beides.

Jedes Bild steht im Dokument. Nicht `src="diagram.png"`, was ein Pfad ist, der sich gegen den Ort auflöst, an dem der Leser die Datei zufällig abgelegt hat, und nicht `src="https://…/diagram.png"`, was eine Anfrage ist. Die Bytes selbst sind als Data-URI in das `src`-Attribut kodiert, oder das Bild ist eingebettetes SVG, was Markup ist statt einer Anfrage.

Nichts weiter wird überhaupt angefragt. Keine Webschrift, kein Analytics-Beacon, kein Icon-Satz, kein jQuery von einem CDN „nur für das Inhaltsverzeichnis“. Das ist die Klausel, die Leute versehentlich brechen, und es ist die, auf die es am meisten ankommt, denn ein einzelnes Link-Tag genügt, um aus einem eigenständigen Dokument eine Seite zu machen, die still jedes Öffnen meldet.

Was ein HTML-Dokument in einer Datei *nicht* verspricht, ist, dass seine Links funktionieren. `<a href="https://example.com/spec">` ist weiterhin eine Adresse im Internet, und das soll es auch sein — ein Dokument, das seine eigenen Belege abschneidet, ist schlechter, nicht besser. Eigenständigkeit ist eine Aussage über die Darstellung, nicht über die Außenwelt, auf die sich Ihre Prosa bezieht.

## Der schnelle Vergleich: der Überblick

| Format | Was es ist | Braucht das Netz | Leser kann bearbeiten | Wichtigste Kosten |
| --- | --- | --- | --- | --- |
| HTML in einer Datei | Eine `.html`-Datei, Stile eingebettet, Bilder als Data-URIs | Nein | Nur durch Bearbeiten des Markups | Größere Datei, nichts zwischenspeicherbar |
| HTML plus ein Ordner mit Beiwerk | Eine `.html`-Datei neben `styles.css` und einem `images/`-Verzeichnis | Nein, wenn der Ordner mitreist | Nur durch Bearbeiten des Markups | Bricht in dem Moment, in dem eine Datei umzieht oder allein gemailt wird |
| HTML, das ein CDN einbindet | Eine `.html`-Datei, die beim Öffnen Schriften und CSS holt | Ja | Nur durch Bearbeiten des Markups | Wird offline falsch dargestellt; verrät jedes Öffnen |
| MHTML (`.mhtml`) | Eine Seite und ihr Beiwerk in einem MIME-Container | Nein | Nein | Chrome und Edge schreiben es; Firefox öffnet es ohne Add-on nicht |
| Safari-Webarchiv (`.webarchive`) | Apples entsprechender Container | Nein | Nein | Praktisch nur Safari |
| PDF | Ein festes Seitenlayout mit eingebetteten Schriften | Nein | Nein, ohne PDF-Editor | Fließt auf dem Telefon schlecht um; Textextraktion schwankt |
| Word (`.docx`) | Ein Zip aus XML, Stile enthalten | Nein | Ja, vollständig | Wird über Word-Versionen und Betrachter hinweg unterschiedlich dargestellt |
| Markdown-Quelle (`.md`) | Reiner Text mit Zeichensetzung | Nein | Ja, in jedem Editor | Die meisten Leser sehen Quelltext statt eines Dokuments |
| Gehosteter Link | Eine Seite, die von einer Adresse ausgeliefert wird | Ja, immer | Nein | Braucht Hosting, und die Adresse kann verrotten oder widerrufen werden |
| Screenshot (`.png`) | Ein Bild des Dokuments | Nein | Nein | Kein markierbarer Text, keine Links, keine Suche |

Die zwei Zeilen, die einen genauen Vergleich verdienen, sind die erste und die zweite, denn sie sehen gleichwertig aus und sind es nicht. Eine HTML-Datei mit einem `styles.css` als Nachbar wird von `file://` aus perfekt dargestellt — CSS lädt anstandslos von einer lokalen Platte. Sie wird perfekt dargestellt, bis zu dem Moment, in dem jemand die `.html` aus dem Ordner zieht und sie an eine E-Mail hängt, was genau das ist, was ein Leser tun wird, der über Beiwerk nie nachgedacht hat. Eigenständigkeit ist nicht in erster Linie eine technische Eigenschaft. Sie ist eine Eigenschaft, die es übersteht, von Menschen angefasst zu werden.

## Stile eingebettet, und die Schriften, die es still nicht sind

### Warum das verlinkte Stylesheet weg muss

Ein `<link rel="stylesheet" href="…">` ist eine zweite Anfrage, und jede zweite Anfrage ist ein Weg für das Dokument, unvollständig anzukommen. Lokal muss das Stylesheet an der richtigen relativen Stelle liegen. Aus der Ferne muss der Host noch existieren, diesen Pfad noch ausliefern und aus dem Netz des Lesers noch erreichbar sein — was er innerhalb einer Bank oder eines Krankenhauses sehr oft nicht ist.

Einbetten ist die Lösung, und sie ist nicht subtil: nehmen Sie das CSS, das in der Datei von nebenan gestanden hätte, und legen Sie es in einen `<style>`-Block im Head. Die Typografie, die Tabellenrahmen, die Hintergründe von Codeblöcken und die Druckregeln eines Dokuments sind ein paar Kilobyte Text, was gut komprimiert und nichts kostet, das sich zu messen lohnt.

Es gibt einen Nutzen zweiter Ordnung, den Leute erst bemerken, nachdem sie einmal hineingetreten sind. Ein eingebettetes Stylesheet kann unter dem Dokument nicht verändert werden. Wenn Ihr Haus-CSS unter einer URL versioniert liegt und jemand im nächsten Quartal die Überschriftenskala umschreibt, wird jedes alte Dokument, das es verlinkt hat, mit der neuen Skala neu dargestellt — einschließlich desjenigen, das an einem Vertrag hängt. Ein Dokument mit seinen Stilen in sich wird im Dezember genau so dargestellt wie im August, weil die Regeln und die Prosa dasselbe Artefakt sind.

### Das `style=`-Attribut ist nicht dasselbe

Zwei Techniken werden „eingebettete Stile“ genannt, und sie verhalten sich unterschiedlich. Ein `<style>`-Element im Head enthält echtes CSS: Selektoren, Media Queries, `@media print`, Pseudoklassen, alles. Ein `style=`-Attribut an einem Element enthält nur Deklarationen — keine Selektoren, keine Media Queries, kein `:hover`, und keine Möglichkeit zu sagen „jede Tabellenzelle in diesem Dokument“.

Für ein Dokument, das Sie archivieren oder mailen, ist der `<style>`-Block das, was Sie wollen. Attributstile zählen in genau einem Zusammenhang, und das ist HTML-E-Mail: Mail-Programme haben `<style>`-Blöcke historisch entfernt, und der Tausch dort besteht darin, Deklarationen auf die Elemente zu schieben. Das ist ein Grund, die zwei Fälle im Kopf getrennt zu halten. Ein *Anhang* als HTML in einer Datei und ein HTML-*E-Mail-Text* sind verschiedene Produkte mit verschiedenen Einschränkungen, und ein Werkzeug, das das eine erzeugt, erzeugt nicht zwangsläufig das andere.

### Schriften: das Versprechen, das ein Link-Tag bricht

Hier ist die Klausel, die am häufigsten gebrochen wird, meist in guter Absicht.

Sie betten das CSS sorgfältig ein. Sie betten jedes Bild ein. Dann, weil das Dokument wie der Rest Ihres Materials aussehen soll, fügen Sie eine Zeile hinzu:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
```

Die Datei ist nicht mehr eigenständig. Öffnen Sie sie mit abgeschaltetem Netz, und die Schrift fällt auf das zurück, was der Stack als nächstes nennt, was die Zeilenlängen, die Seitenumbrüche und möglicherweise die Tabellenbreiten verändert. Öffnen Sie sie mit eingeschaltetem Netz, und das Dokument stellt im Moment des Lesens eine Anfrage an einen Dritten — von der IP-Adresse des Lesers, in seinem Firmennetz, mit seinem User-Agent, jedes einzelne Mal, wenn die Datei geöffnet wird. Für eine interne Notiz ist das bloß unordentlich. Für ein Dokument, das Sie einem Kunden, einer Aufsichtsbehörde oder der Gegenseite ausgehändigt haben, ist es eine Tatsache über Ihre Datei, die Sie nicht schaffen wollten.

Es gibt drei ehrliche Auswege, und der erste ist meist der richtige.

**Verwenden Sie einen Stack aus Systemschriften.** `font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` wird in einer Schriftart dargestellt, die der Leser schon hat, was heißt: sofort, offline, auf jeder Plattform, bei null Bytes. Das Dokument sieht nicht nach Ihrer Marke aus. Es sieht nach einem Dokument aus, was für ein Memo, eine Spezifikation oder einen Satz Release Notes das richtige Ergebnis ist.

**Betten Sie die Schrift als Data-URI in eine `@font-face`-Regel ein.** Das funktioniert, und es ist teuer. Ein einzelner Schnitt eines WOFF2 nur für Latein liegt typischerweise bei einigen zehn Kilobyte vor der Kodierung; eine Familie mit Regular, Bold und beiden Kursiven sind vier Schnitte, und Base64 legt auf jeden davon ein Drittel obendrauf. Sie tauschen einen festen, beträchtlichen Teil der Datei gegen Markentypografie in einem Dokument, das niemand nach seiner Typografie beurteilen wird. Prüfen Sie außerdem vorher die Lizenz — reichlich kommerzielle Schriftlizenzen erlauben das Ausliefern im Web von einer Domain, die Sie kontrollieren, und sagen nichts Hilfreiches darüber, die Binärdatei innerhalb einer Datei weiterzugeben, die Sie einem Fremden mailen.

**Legen Sie die Schriftdatei neben das HTML.** Das ist das Muster mit dem Ordner voll Beiwerk unter einem schöneren Namen, und es scheitert an derselben Stelle: beim ersten Mal, wenn jemand die `.html` allein weiterleitet.

## Bilder als Data-URIs, und was das an Bytes kostet

Ein Data-URI legt die Bytes dorthin, wo der Pfad stehen würde. Die Syntax ist ein Schema, ein Medientyp, eine Kodierung und die Nutzlast:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..." alt="Deployment topology">
```

Base64 kodiert drei Bytes Eingabe als vier Zeichen Ausgabe. Das ist eine **Zunahme um 33 %**, bevor Sie die Präambel `data:image/png;base64,` mitzählen, und sie ist durch Geschicklichkeit nicht zurückzugewinnen. Aus einem PNG von 1,5 MB werden etwa 2 MB Text mitten in Ihrem Markup. Sechs Screenshots dieser Größe, und das Dokument ist eine Textdatei von 12 MB.

Kompression holt weniger zurück, als Leute hoffen. Gzip und Brotli leisten anständige Arbeit an Base64 von bereits komprimierten Daten — aber nur anständige, denn ein PNG oder ein JPEG ist schon entropiedicht; gepresst wird die Kodierung, nicht das Bild. Und Kompression gilt nur über HTTP. Eine Datei, die auf einer Platte liegt oder an einer E-Mail hängt, hat die volle unkomprimierte Größe, und das ist die Größe, die gegen Grenzen läuft.

Diese Grenzen gehören benannt, denn dort hört der Tausch auf, theoretisch zu sein:

| Wohin die Datei geht | Was zuerst beißt |
| --- | --- |
| E-Mail-Anhang | Die strengste Anhangsgrenze in der Kette, und die ist nicht Ihre |
| Firmen-Mail-Gateway | Scanner, die große HTML-Anhänge in Quarantäne stellen oder umschreiben |
| Ein Konverter oder eine API | Eine Obergrenze für die Anfragegröße — TransformPipe begrenzt eine Konvertierung auf 10 MB und ein im Konto gehaltenes Dokument auf 4 MB, weil eine Vercel Function eine Anfrage oder einen Antwortkörper über 4,5 MB ablehnt |
| Ein Browser auf dem Telefon | Speicher, und die Zeit, die das Dekodieren mehrerer Megabyte Base64 vor dem ersten Bildaufbau kostet |
| Ein Code-Review | Gar nichts, und das ist das Problem: der Diff ist unlesbar |

Zwei Techniken machen die Kosten beherrschbar.

**Verkleinern Sie, bevor Sie kodieren.** Die meisten eingebetteten Screenshots sind zwei- oder dreimal größer als die Breite, in der sie angezeigt werden. Die Pixelmaße eines Screenshots zu halbieren schneidet die Datei auf etwa ein Viertel, und der Kodierungsaufschlag von 33 % gilt dann für eine viel kleinere Zahl. Dieser einzelne Schritt bringt mehr als jedes Argument über Formate.

**Verwenden Sie SVG als Markup, nicht als Base64.** Ein Diagramm, ein Logo, ein Schaubild oder ein Icon, das als SVG gezeichnet ist, kann als `<svg>`-Element in das Dokument eingefügt werden. Es gibt überhaupt keinen Kodierungsaufschlag, das Ergebnis ist Text, der außerordentlich gut komprimiert, und es bleibt bei jedem Zoom scharf. Ist ein Bild in Ihrem Dokument eine Strichzeichnung, sollte es fast nie ein Base64-PNG sein.

Was Data-URIs nicht reparieren können, ist ein Bild, das Sie irgendwo anders hin gezeigt haben. `<img src="diagram.png">` bedeutet weiterhin `diagram.png` relativ zum Ordner des Lesers, und ein Konverter, der Stile einbettet, wird das nicht zwangsläufig ebenfalls eingebettet haben. Die vollständige Menge der Dinge, die brechen, wenn eine Datei umzieht, ist ein Thema für sich — [relative Pfade, Anker-IDs und Referenzlinks scheitern jeweils anders](/blog/images-and-links-that-still-work) — und die praktische Gewohnheit ist, den HTML-Quelltext zu öffnen und jeden `src=`-Wert zu lesen, bevor Sie irgendetwas verschicken.

## Wie Sie überprüfen, dass die Datei wirklich eigenständig ist

Trauen Sie der Behauptung nicht, auch nicht unserer. Die Überprüfung dauert etwa eine Minute, und sie ist eindeutig.

**1. Trennen Sie den Rechner vom Netz.** Schalten Sie WLAN ab, ziehen Sie das Kabel, versetzen Sie den Laptop in den Flugmodus. Tun Sie das zuerst, denn es ist der einzige Schritt, den ein warmer Cache nicht täuschen kann. Eine Datei, die Sie schon einmal geöffnet haben, hat vielleicht jede Schrift und jedes Stylesheet im HTTP-Cache des Browsers liegen, und sie wird perfekt dargestellt, während sie vollständig vom Netz abhängt.

**2. Öffnen Sie die Datei von `file://`.** Doppelklicken Sie sie, oder ziehen Sie sie in ein Browser-Fenster. Sehen Sie sich die Schrift, die Tabellenrahmen, die Hintergründe der Codeblöcke und jedes Bild an. Eine Ersatzschrift ist das übliche Anzeichen: wenn die Überschriften schmaler oder breiter aussehen, als Sie sie erinnern, wurde etwas geholt.

**3. Öffnen Sie die Entwicklerwerkzeuge, gehen Sie auf den Netzwerk-Tab und laden Sie mit ihm offen neu.** Das ist der eigentliche Test. Bei einem `file://`-Dokument ist das richtige Ergebnis eine Anfrageliste, die das Dokument enthält und nichts weiter — kein CSS, keine Schriften, keine Bilder, keine Beacons. Erscheint eine Zeile, klicken Sie sie an und lesen Sie die URL; das ist Ihr Leck, benannt und lokalisiert.

**4. Durchsuchen Sie den Quelltext nach den vier Dingen, die anfragen.** Öffnen Sie die Datei in einem Texteditor und suchen Sie nach `<link`, `<script src`, `url(` und `src="http`. Jeder Treffer ist entweder etwas, das Sie absichtlich eingebettet haben, oder eine Abhängigkeit, von der Sie nicht wussten, dass Sie sie haben. `url(` fängt die Fälle mit Schriften und Hintergrundbildern, die der Netzwerk-Tab verpasst, wenn die Regel nie auf etwas auf dem Bildschirm gepasst hat.

**5. Probieren Sie es in einem zweiten Browser, auf einem zweiten Rechner, aus einem anderen Ordner.** Kopieren Sie die Datei auf einen USB-Stick, stecken Sie ihn in einen Rechner, der sie noch nie gesehen hat, und öffnen Sie sie dort. Das fängt relative Pfade, zwischengespeichertes Beiwerk und Schriftunterschiede zwischen Plattformen in einem Durchgang. Es ist außerdem, nicht nebenbei, eine Probe dessen, was Ihr Leser gleich tun wird.

**6. Drucken Sie es gleich noch als PDF.** Die Druckvorschau zeigt, ob das Dokument überhaupt Druckregeln hat und ob etwas am Seitenrand abgeschnitten wird. Ist ein PDF das eigentliche Ergebnis, ist [der Druckdialog des Browsers selbst ein vernünftiger Weg dorthin](/blog/markdown-to-pdf), und ein HTML-Dokument in einer Datei ist die Eingabe, die er sich wünscht.

Eine Anmerkung zu Skripten. Eine eigenständige Datei darf legitim eingebettetes JavaScript enthalten — einen Schalter für das Inhaltsverzeichnis, einen Umschalter für den Dunkelmodus — und eingebettetes Skript ist keine Netzwerkabhängigkeit. Es ist allerdings ausführbarer Code in einem Dokument, das jemand per Doppelklick öffnen wird, was ein anderes Risiko ist. War die Quelle des Dokuments Markdown, das von außerhalb Ihrer Organisation kam, kann rohes HTML in der Quelle `<script>`, `onerror=` und `javascript:`-URLs direkt in die Ausgabe tragen, und [das Bereinigen gegen eine feste Positivliste ist es, was das stoppt](/blog/sanitising-markdown-safely). Suchen Sie in jeder Datei, die Sie nicht selbst erzeugt haben, nach `<script`, bevor Sie sie öffnen.

## Was eine einzelne Datei wert ist

Das Format verdient sein Geld in drei Situationen. Sie sind nicht dieselbe Situation, und jede schätzt eine andere Eigenschaft.

### Archivieren

Ein archiviertes Dokument hat eine Anforderung: es muss noch dargestellt werden, wenn alles um es herum sich verändert hat. Dazu gehören das CDN, das seine Schriften auslieferte, der S3-Bucket, der seine Bilder hielt, die Firma, die beide hostete, und die Browser-Version, die aktuell war, als es geschrieben wurde.

| Eigenschaft | Warum es beim Archivieren zählt |
| --- | --- |
| Keine externen Anfragen | Die Hosts, die gefragt würden, werden nicht alle noch antworten |
| Stile in der Datei eingefroren | Das Dokument kann nicht durch das spätere CSS von jemand anderem neu dargestellt werden |
| Reiner Text auf der Platte | Mit grep durchsuchbar, im Prinzip diffbar und lesbar von Werkzeugen, die noch nicht existieren |
| Eine Datei, ein Objekt | Nichts zu verlieren; kein Ordner, der zusammengehalten werden muss |

HTML ist aus einem Grund ein gutes Archivformat, der nichts mit Mode zu tun hat: es ist Text, seine Spezifikation ist öffentlich, und Browser stellen alte Dokumente weiterhin dar. Ein HTML-Dokument in einer Datei ist ein selbstbeschreibendes Textobjekt, und das ist die Eigenschaft, die Formate überlebt, die eine bestimmte Anwendung brauchen.

Es ist kein *Langzeiterhaltungs*format im institutionellen Sinn — dafür gibt es WARC-Container und ihr Werkzeug, und eine Bibliothek oder ein Nationalarchiv wird die verwenden. Für ein Team, das den Stand einer Entscheidung, ein Runbook, wie es bei einem Störfall aussah, oder einen Bericht, wie er abgezeichnet wurde, festhält, ist eine einzelne Datei die pragmatische Fassung derselben Idee.

**Für wen das ist:** für jeden, der „was stand hier damals?“ beantworten muss und sich nicht auf einen Link verlassen kann.

### Per E-Mail verschicken

E-Mail ist die härteste Umgebung, auf die ein Dokument trifft, denn nichts daran liegt in Ihrer Hand. Das Programm, das Gateway, die Verbindung und das Gerät des Lesers sind alle Entscheidungen von jemand anderem.

Ein HTML-Anhang in einer Datei verhält sich in dieser Umgebung aus einem einfachen Grund gut: es gibt nichts, was verloren gehen kann. Rechnen Sie damit, dass der Leser ihn herunterlädt statt ihn in einer Vorschau zu sehen, und rechnen Sie damit, dass manche Mail-Systeme `.html`-Anhängen generell misstrauen — ein Zip, oder ein Link auf die Datei, ist der übliche Umweg, wenn ein Gateway sich sperrt. Was Sie vermeiden, ist der weit häufigere Fehlschlag, eine `.html` zu schicken und ihren `images/`-Ordner zurückzulassen, was ein Dokument voller Symbole für defekte Bilder und eine zweite E-Mail erzeugt.

| Eigenschaft | Warum es beim Mailen zählt |
| --- | --- |
| Ein Anhang | Kein Ordner zu zippen, nichts, was der Leser wieder zusammensetzen muss |
| Wird offline dargestellt | Der Leser öffnet es vielleicht im Flugzeug, im Zug oder auf einem abgeriegelten Laptop |
| Keine Anfragen | Das Dokument meldet nicht, wann, wo oder wie oft es gelesen wurde |
| Text, kein Container | Es öffnet in einem Browser, den der Leser schon hat |

**Für wen das ist:** für jeden, der ein fertiges Dokument an eine benannte Person schickt, besonders an eine außerhalb der eigenen Systeme. Die Alternativen — und wo jede von ihnen scheitert — sind [lesenswert, bevor Sie eine wählen](/blog/share-a-markdown-document-as-a-link).

### Es jemandem außerhalb Ihrer Firma geben

Das ist der Fall, in dem Eigenständigkeit aufhört, eine Bequemlichkeit zu sein, und zu einer Frage der Hygiene wird. Wenn ein Dokument Ihre Organisation verlässt, wird es von Menschen und Systemen geprüft, die Ihnen nichts schulden.

Eine Datei, die von einem CDN holt, ist eine Datei, die Anfragen aus dem Netz des Empfängers heraus stellt. Dessen Sicherheitsteam bemerkt es vielleicht; dessen Proxy blockiert es vielleicht; dessen Prüfer fragt vielleicht, wofür die Anfrage war. Eine Datei, die nichts holt, löst keine dieser Fragen aus, und sie kann durch Lesen geprüft werden — was genau das ist, was ein vorsichtiger Empfänger tun wird.

Es gibt einen Umkehrschluss, der ausgesprochen gehört, denn er gilt für Sie als Leser. Ein eigenständiges HTML-Dokument, das Sie empfangen, ist leichter zu prüfen als eine Seite, aber es ist nicht automatisch sicher: eingebettetes Skript läuft, wenn Sie es öffnen, und `file://` ist ein großzügiger Kontext. Lesen Sie den Quelltext, oder öffnen Sie es mit abgeschaltetem JavaScript, wenn Sie irgendeinen Grund haben, beim Absender vorsichtig zu sein.

| Eigenschaft | Warum es bei einer Übergabe nach außen zählt |
| --- | --- |
| Keine Anfragen an Dritte | Nichts, was ein Proxy blockieren oder eine Sicherheitsprüfung hinterfragen könnte |
| Keine Nachverfolgung | Das Dokument kann Ihnen nicht mitteilen, dass es geöffnet wurde, und das ist der Punkt |
| Prüfbar | Das Ganze kann in einem Texteditor gelesen werden |
| Kein Konto, keine Installation | Der Empfänger öffnet es in dem Browser, den er schon hat |

**Für wen das ist:** für jeden, der ein Dokument über eine Firmengrenze schickt — Angebote, Spezifikationen, Störfallberichte, Lieferergebnisse, alles, was ein Anwalt später hochhalten könnte.

## Wo eine einzelne Datei die falsche Antwort ist, und was sie kostet

Das Format hat echte Nachteile. Eine Seite, die nur die Vorzüge aufzählt, verkauft etwas.

**Die Datei ist größer, und die Zunahme ist nicht geringfügig.** Base64 legt auf jedes eingebettete Bild ein Drittel obendrauf, und gemeinsames Beiwerk einzubetten heißt, dass jedes Dokument seine eigene Kopie davon trägt. Zehn Berichte, die alle dasselbe Logo und dieselben zwei Diagramme einbetten, tragen zehn Kopien von jedem. Wenn Sie Dokumente in Menge erzeugen, sind die Gesamtkosten echt, und die Entdopplung, die Sie durch gemeinsames Beiwerk bekämen, ist genau das, was Sie aufgegeben haben.

**Nichts in ihr kann zwischengespeichert werden.** Eine gehostete Seite holt ihr Stylesheet einmal und verwendet es auf jeder Seite der Website wieder; die zweite Seite ist fast kostenlos. Eine einzelne Datei hat keine zweite Seite. Jedes Dokument bezahlt seine eigenen Stile, seine eigenen Schriften und seine eigenen Bilder, jedes Mal, wenn es übertragen wird. Das ist der richtige Tausch für ein Dokument, das allein reist, und der falsche für eine Website mit Navigation.

**Bearbeiten heißt, alles erneut zu verschicken.** Ein Tippfehler in einer gehosteten Seite ist eine einzeilige Korrektur, die jeder Leser beim nächsten Besuch sieht. Ein Tippfehler in einem Anhang ist ein neuer Anhang, eine entschuldigende E-Mail und zwei Fassungen des Dokuments im Postfach des Empfängers ohne Hinweis darauf, welche die aktuelle ist. Einzelne Dateien haben keinen Aktualisierungspfad; das ist wesenseigen und keine fehlende Funktion.

**Es gibt konstruktionsbedingt keine Statistik.** Wenn Sie wissen müssen, ob das Angebot gelesen wurde, brauchen Sie einen Link, und ein Link ist das Gegenteil einer eigenständigen Datei. Beide Eigenschaften können Sie in einem Artefakt nicht haben.

**Sehr große Dateien verhalten sich schlecht.** Mehrere Megabyte Base64 müssen dekodiert werden, bevor der Browser die Bilder zeichnen kann, und auf einem Telefon mit bescheidenem Speicher ist das eine sichtbare Pause oder Schlimmeres. Es gibt eine Größe, hinter der eine einzelne Datei ein schlechtes Erlebnis ist, obwohl sie technisch korrekt ist, und Dokumente voller Screenshots erreichen sie schnell.

**Es ist keine Website.** Keine Navigation zwischen Dokumenten, keine Suche, keine Feeds, keine Querverweise, die sich auflösen. Ein Satz Dokumente, die aufeinander verweisen, will Hosting, und etwas anderes vorzugeben erzeugt einen Ordner voller Dateien mit toten Links dazwischen.

**Manche Betrachter werden nicht mitspielen.** Mail-Gateways, die HTML-Anhänge in Quarantäne stellen, Dokumentenverwaltungssysteme, die HTML nicht indexieren, Prüfwerkzeuge, die nichts darstellen — das sind Richtlinienprobleme, keine technischen, und sie beenden die Diskussion in manchen Organisationen unabhängig von den Argumenten. Wenn das passiert, ist ein PDF das Format, das die Institution annimmt, und ein HTML-Dokument in einer Datei ist die bestmögliche Eingabe, um eines zu erzeugen.

## Wie Sie sich entscheiden

1. **Fangen Sie dort an, wo die Datei geöffnet wird, nicht bei dem, was bequem zu erzeugen ist.** Ein Dokument, das aus einem Postfach auf einem getrennten Laptop geöffnet wird, muss eigenständig sein; eine Seite, die von einer URL mit warmem Cache geöffnet wird, sollte es nicht sein, denn Sie werfen die Zwischenspeicherung für nichts weg.
2. **Zählen Sie die Anfragen, nicht die Funktionen.** Öffnen Sie den Netzwerk-Tab auf der Ausgabe und sehen Sie sich die Zahl der Zeilen an. Jede Zahl über eins heißt, dass die Datei Abhängigkeiten hat, und jede Abhängigkeit ist eine Stelle, an der das Dokument unvollständig ankommen kann.
3. **Verkleinern Sie Bilder, bevor Sie sie einbetten, denn der Kodierungsaufschlag von 33 % vervielfacht alles, was Sie ihm vorsetzen.** Ein Screenshot in der doppelten Breite seiner Anzeige kostet viermal die Bytes, die er bräuchte, und diese Verschwendung ist der mit Abstand größte Beitrag zu einer aufgeblähten einzelnen Datei.
4. **Entscheiden Sie einmal über Webschriften, schriftlich.** Entweder das Dokument verwendet einen Stack aus Systemschriften und bleibt ehrlich, oder es bettet Schnitte ein, für die Sie die Lizenz geprüft haben; eine verlinkte Schrift ist die Entscheidung, eine Anfrage vom Rechner des Lesers aus zu stellen, und sie sollte nicht versehentlich passieren.
5. **Wenn sich das Dokument ändern wird, schicken Sie keine Datei.** Anhänge haben keinen Aktualisierungspfad, alles noch im Entwurf will also einen Link, und alles Endgültige will eine Datei. Für etwas Unfertiges eine Datei zu schicken garantiert eine zweite Fassung im Umlauf.
6. **Testen Sie es so, wie Ihr Leser es öffnen wird: auf einem Rechner, der es noch nie gesehen hat, offline.** Jeder Fehlschlag, der auf dieser Seite beschrieben ist — die Ersatzschrift, das defekte Bild, das fehlende Stylesheet, die überraschende Anfrage — zeigt sich in diesem einen Test, und keiner von ihnen zeigt sich in der Vorschau des Werkzeugs selbst.

## Fazit

Ein HTML-Dokument in einer Datei ist eine kleine Idee mit einem bestimmten Nutzen: es wird überall gleich dargestellt, weil es um nichts bittet, was es zum richtigen Format für Archive, Anhänge und alles macht, was eine Firmengrenze überquert. Die Kosten sind genauso bestimmt — ein Drittel mehr Bytes auf jedem Bild, keine Zwischenspeicherung und keine Möglichkeit, einen Fehler zu korrigieren, ohne erneut zu verschicken — es ist also das falsche Format für eine Website, für einen Entwurf oder für alles, wozu Sie Lesebestätigungen brauchen. Wenn Sie eine Markdown-Datei haben und eine Person auf ein Dokument wartet, erzeugt [die Konvertierung im Browser](/) genau das: eine HTML-Datei mit ihren Stilen eingebettet, nichts geholt und, abgemeldet, nichts irgendwohin hochgeladen dabei. Trennen Sie dann den Rechner vom Netz und öffnen Sie sie, denn eine Behauptung über Eigenständigkeit, die Sie nicht getestet haben, ist bloß eine Behauptung.

## FAQ

### Was ist ein HTML-Dokument in einer Datei?

Es ist eine einzige `.html`-Datei, die ohne Netzwerkverbindung korrekt dargestellt wird, weil ihr Stylesheet ein eingebetteter `<style>`-Block ist, ihre Bilder als Data-URIs oder als eingebettetes SVG enthalten sind und sie keine Schriften, Skripte oder Zählpixel holt. Von einer lokalen Platte geöffnet stellt sie überhaupt keine Anfragen. Links in der Prosa zeigen weiterhin ins Internet, und das ist beabsichtigt — Eigenständigkeit betrifft die Darstellung, nicht die Belege.

### Wie prüfe ich, ob eine HTML-Datei wirklich eigenständig ist?

Trennen Sie zuerst den Rechner vom Netz, damit kein zwischengespeichertes Beiwerk das Ergebnis schmeichelhaft macht, öffnen Sie dann die Datei und laden Sie sie mit offenem Netzwerk-Tab der Entwicklerwerkzeuge neu. Das richtige Ergebnis ist eine Anfrageliste mit dem Dokument darin und nichts weiter. Den Quelltext nach `<link`, `<script src`, `url(` und `src="http` zu durchsuchen fängt alles, was der Netzwerk-Tab verpasst hat, weil die Regel nie gepasst hat.

### Wie viel größer wird die Datei durch eingebettete Bilder?

Base64 kodiert drei Bytes als vier Zeichen, jedes eingebettete Bild wächst also um etwa 33 %, bevor die Präambel mit dem Medientyp gezählt wird, und Kompression holt nur einen Teil davon zurück, weil fotografische und PNG-Daten schon dicht sind. Einen Screenshot auf die Breite zu verkleinern, in der er tatsächlich angezeigt wird, spart meist weit mehr als jede Entscheidung über die Kodierung. Strichzeichnungen sollten eingebettetes SVG sein, das überhaupt keinen Kodierungsaufschlag hat.

### Kann ich in einer eigenständigen Datei eine Webschrift verwenden?

Nicht von einem CDN — das ist eine Netzwerkanfrage, sie verändert die Schrift, wenn der Leser offline ist, und sie meldet jedes Öffnen an einen Dritten. Sie können einen Schnitt als Base64 in einer `@font-face`-Regel einbetten, wenn die Lizenz die Weitergabe erlaubt, zum Preis von einigen zehn Kilobyte pro Schnitt. Für die meisten Dokumente ist ein Stack aus Systemschriften der bessere Tausch: sofort, kostenlos und auf jeder Plattform vorhanden.

### Ist HTML in einer Datei besser als ein PDF, um ein Dokument zu verschicken?

Sie optimieren auf verschiedene Dinge. HTML fließt auf den Bildschirm des Lesers um, hält den Text markierbar und durchsuchbar und kann in jedem Browser ohne zusätzliche Anwendung gelesen werden; ein PDF legt das Seitenlayout fest, was zählt, wenn die Paginierung Teil des Inhalts ist oder wenn eine Institution nur PDFs annimmt. Eine praktische Antwort ist, zuerst das HTML zu erzeugen und es als PDF zu drucken, wenn ausdrücklich ein PDF verlangt wird.

### Ist es sicher, eine eigenständige HTML-Datei zu öffnen, die mir jemand geschickt hat?

In einer Hinsicht sicherer als eine gehostete Seite und in einer anderen nicht. Sie holt nichts, kann also nicht nach Hause telefonieren und keinen entfernten Code laden, aber eingebettetes JavaScript darin wird trotzdem ausgeführt, wenn Sie sie öffnen. Wenn Sie Grund haben, beim Absender vorsichtig zu sein, durchsuchen Sie zuerst den Quelltext nach `<script`, oder öffnen Sie die Datei mit abgeschaltetem JavaScript.

### Warum sieht eine HTML-Datei, die ich bekommen habe, unformatiert aus?

Fast immer, weil sie nicht eigenständig war: sie hat ein Stylesheet verlinkt, das nicht mehr neben ihr liegt, oder eines auf einem Host, den Ihr Netz nicht erreichen kann. Ein Browser, dem man HTML ohne anwendbares CSS gibt, stellt es in seiner voreingestellten Serifenschrift in der vollen Fensterbreite dar, weshalb die Datei wie ein Entwurf in reinem Text statt wie ein Dokument aussieht. Bitten Sie den Absender um eine Fassung mit eingebetteten Stilen.
