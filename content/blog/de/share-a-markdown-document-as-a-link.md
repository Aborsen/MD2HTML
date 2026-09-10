---
title: "Wie Sie eine Markdown-Datei mit jemandem teilen, der kein Markdown benutzt"
description: "Die ehrlichen Wege, eine Markdown-Datei an einen Leser zu geben, der nichts installiert: Anhang, Gist, Repository, HTML-Datei, Link — und was Widerrufen kostet"
date: 2026-09-05
tag: Veröffentlichen
keywords: markdown datei teilen, markdown online veröffentlichen, markdown als link teilen, markdown datei hosten, dokument nur lesen link, markdown an kunden schicken
---

Sie haben eine `.md`-Datei. Sie haben sie geschrieben, oder Sie haben [eine Antwort gesichert, die ein Chat-Assistent Ihnen in Markdown gegeben hat](/blog/ai-output-to-a-shareable-page); von hier an macht das keinen Unterschied. Jemand muss sie lesen: eine Kundin, ein Vorgesetzter, ein Anwalt, ein Handwerker, der ein Angebot für Ihre Küche schreibt. Diese Person wird keinen Markdown-Editor installieren, sie wird kein Repository klonen, und sie sollte es auch nicht müssen. Jeder Weg, ihr das Dokument vorzulegen, scheitert an irgendeiner Stelle, und die Kunst besteht darin, vor dem Absenden zu wissen, an welcher.

### Kurzfassung

Wählen Sie danach, was mit der Datei nach ihrer Ankunft passiert, nicht danach, was für Sie am schnellsten ist. Wenn der Leser sie bearbeiten und zurückschicken wird, hängen Sie die Quelle an und sagen Sie, was sie ist. Wenn er sie einmal lesen muss, auf dem Telefon, in einer Besprechung, wandeln Sie sie in eine **eigenständige HTML-Datei** um und hängen Sie diese an, oder veröffentlichen Sie sie als **Nur-Lese-Link** — so oder so bekommt er ein Dokument statt Quelltext. Ein Link ist nur dann etwas wert, wenn er dem Leser nichts abverlangt: kein Konto, keine Installation, kein Skript. Und ein Link ist nur dann widerrufbar, wenn das Widerrufen die Adresse selbst tötet, sofort, ohne Mitwirkung des Lesers — was kein Anhang jemals kann, denn ein Anhang ist eine Kopie.

## Was der Rechner des Lesers mit Ihrer Datei macht

Die Reibung ist nicht Markdown. Markdown ist eine Textdatei mit Zeichensetzung darin, und es wurde so entworfen, dass die Zeichensetzung lesbar bleibt, wenn nichts sie darstellt. Die Reibung ist, dass Betriebssysteme, Mail-Programme und Telefone jeweils eine andere Vermutung über eine Dateiendung anstellen, für die sie keine Anwendung haben, und jede dieser Vermutungen ist auf eine Weise falsch, die Sie von Ihrer Seite aus nicht sehen können.

In „Kannst du das lesen?“ verbergen sich drei getrennte Fragen. Die erste ist, ob die Datei sich überhaupt öffnet. Die zweite, ob sie sich als Dokument oder als Quelltext öffnet. Die dritte, ob das, was sich öffnet, die Version ist, die der Leser sehen sollte — heute und in sechs Monaten. Text einzufügen beantwortet die erste und scheitert an der zweiten. Die Quelle anzuhängen kann schon an der ersten scheitern. Ein Repository-Link beantwortet die ersten zwei und scheitert lautlos an der dritten, denn die Adresse zeigt auf einen Zweig, der sich bewegt.

Die letzte Frage wiegt schwerer, als man erwartet. Die meisten Freigaben gehen nach dem Moment des Absendens schief. Der Kunde leitet es weiter. Die Vorgesetzte kommt ein Quartal später auf den Link zurück. Die Rechtsabteilung fragt nach der Version, die am Elften gültig war. Was Sie auch wählen, es muss überstehen, von jemandem gelesen zu werden, dem Sie es nicht geschickt haben, zu einem Zeitpunkt, den Sie nicht gewählt haben.

## Der schnelle Vergleich: der Überblick

| Möglichkeit | Am besten für | Entscheidende Eigenschaft | Preis |
| --- | --- | --- | --- |
| Den Text in die Nachricht einfügen | Eine kurze Notiz ohne Tabellen und Bilder | Funktioniert in jedem Programm; nichts zu öffnen | Kostenlos |
| Die `.md`-Datei anhängen | Einen Leser, der sie bearbeitet und zurückschickt | Verlustfrei — genau die Bytes, die Sie haben | Kostenlos |
| Ein Gist | Einen Schnipsel oder eine Notiz für technische Leser | Stellt GFM unter einer URL dar, behält Revisionen | Kostenlos, zum Anlegen ist ein GitHub-Konto nötig |
| Eine Datei in einem Repository | Ein Dokument, das neben den Code gehört | Wird an Ort und Stelle dargestellt, versioniert mit dem Projekt | Kostenlos für öffentliche Repositories |
| Ein Link in einem Cloud-Speicher | Eine Datei, die Sie ohnehin in Drive, Dropbox oder OneDrive halten | Ein Link, Zugriff über Konten gesteuert | Kostenlose Stufe; bezahlte Tarife nach Speicherplatz berechnet |
| Ein Anhang als eigenständige HTML-Datei | Ein fertiges Dokument, das offline aufgehen muss | Eine Datei, Stile inline, verlangt vom Netz nichts | Kostenlos |
| Ein veröffentlichter Nur-Lese-Link | Jemanden, der einmal liest, auf dem Telefon, ohne Konto | Eine Adresse, die keine Installation braucht und zurückgezogen werden kann | Kostenlos |
| Ein PDF | Druck, Unterschrift, ein festes Protokoll | Jeder Leser sieht identische Seiten | Kostenlos über den Druckdialog des Browsers |
| Statisches Hosting oder Pages | Einen Satz Dokumente, die aufeinander verweisen | Navigation, eigene Domain, Suche | Kostenlos für öffentliche Repositories; ein Build-Schritt zu pflegen |

## Die Wege, eine Markdown-Datei zu teilen

### Den Text in die Nachricht einfügen

Die schnellste Möglichkeit, und die, die überall funktioniert. Kopieren Sie die Datei in die E-Mail, die Chat-Nachricht oder das Ticket, und der Leser hat sie, ohne irgendetwas zu öffnen.

| Vorteile | Nachteile |
| --- | --- |
| Kein Anhang, kein Link, keine Installation — es liegt schon vor ihm | Die Syntax kommt als Zeichensetzung an, nicht als Formatierung |
| Zitierbar und durchsuchbar in seinem eigenen Mail-Programm | Tabellen, Bilder und Code gehen verloren oder werden verstümmelt |
| Nichts zu widerrufen, weil nichts gehostet wurde | Lange Dokumente sind als Textwand in einer Nachricht unlesbar |
| Funktioniert, wenn ein Mail-Filter Anhänge entfernt | Jedes Programm wendet seine eigenen halben Markdown-Regeln an |

**Preis:** kostenlos.

**Was mit dem Text tatsächlich passiert**

- Überschriften kommen als `## Umfang` an, weil kein Mail-Programm ATX-Überschriften parst
- Slack hat keine Syntax für Überschriften und Tabellen, beide kommen also als wörtliche Zeichen durch, während `*Umfang*` fett herauskommt — ein einzelnes Sternchen ist dort fett, nicht kursiv
- [Tabellen ergeht es am schlechtesten](/blog/markdown-tables-that-survive-conversion): die gestrichelte Ausrichtungszeile bedeutet einem Werkzeug, das sie nicht parst, gar nichts, der Leser bekommt also einen Absatz voller senkrechter Striche
- Bilder sind die rohe Zeile `![alt](pfad)`, und relative Pfade hätten im Programm einer anderen Person ohnehin nie aufgelöst
- Manche Programme formatieren beim Einfügen automatisch, was schlimmer ist als gar nicht: die Hälfte des Dokuments wird dargestellt und die Hälfte nicht, und aus dem Ordner der gesendeten Nachrichten können Sie nicht erkennen, welche Hälfte

**Wer sollte es verwenden?** Jeden, der etwas Kurzes, Endgültiges und überwiegend Prosa schickt — einen Absatz Status, eine Entscheidung, drei Stichpunkte. Alles, was länger als ein Bildschirm ist oder eine Tabelle enthält, will eine der Möglichkeiten weiter unten.

### Die `.md`-Datei anhängen

Ehrlich und verlustfrei. Der Empfänger bekommt genau die Bytes, die Sie haben, und das ist die einzige Möglichkeit auf dieser Seite, die ihn ein Wort ändern und es zurückschicken lässt.

| Vorteile | Nachteile |
| --- | --- |
| Byte für Byte, sie übersteht also den Weg durch eine Bearbeitung | Auf einem gewöhnlichen Rechner ist für `.md` nichts registriert |
| Klein, reiner Text und diff-fähig | Auf einem Telefon öffnet sich meist überhaupt nichts |
| Kein Hosting, kein Konto, kein Dienst dazwischen | Der Leser, der sie doch öffnet, liest Quelltext, kein Dokument |
| Die richtige Wahl, wenn die Datei das Ergebnis ist | Sie können sie niemals zurückziehen |

**Preis:** kostenlos.

**Was auf dem Rechner des Lesers tatsächlich passiert**

- Ein Doppelklick unter Windows oder macOS bringt einen Code-Editor, einen Dialog „Anwendung auswählen“ oder nichts — die Endung hat keinen Standard-Handler
- Mail-Programme zeigen sie häufig inline als reinen Text an, was das beste Ergebnis ist und vollständig außerhalb Ihrer Kontrolle liegt
- Manche Mail-Filter behandeln unbekannte Endungen als verdächtig, der Anhang kann also in Quarantäne landen, ohne dass einer von Ihnen beiden davon erfährt
- Sie in `.txt` umzubenennen behebt das Öffnen und verliert die Verbindung zu Markdown, was zählt, wenn der Leser sie bearbeiten wird
- Wenn er sie doch öffnet, zeigen Bilder und relative Links auf Dateien, die er nicht hat, das Dokument hat also Löcher

Wenn der Leser willig, aber ratlos ist, deckt [eine `.md`-Datei zu öffnen](/blog/how-to-open-md-file) ab, was auf einem Rechner ohne besondere Installationen funktioniert. Sagen Sie beim Senden, was die Datei ist. „Das ist eine Textdatei — öffnen Sie sie in Notepad oder TextEdit, oder lesen Sie sie einfach in der Vorschau“ ist ein Satz, der die meiste Verwirrung verhindert.

**Wer sollte es verwenden?** Jeden, dessen Leser das Dokument bearbeiten wird, und jeden, dessen Leser technisch genug ist, dass Quelltext keine Beleidigung ist. Für eine Kundin, die ein Angebot sehen wollte, ist es die falsche Wahl.

### Ein Gist

Ein Gist ist ein kleines gehostetes Dokument mit einer URL. Es stellt GitHub Flavored Markdown dar, die Adresse des Gist ist also schon eine lesbare Seite, und es behält einen Revisionsverlauf, weil ein Gist darunter ein Git-Repository ist.

| Vorteile | Nachteile |
| --- | --- |
| Stellt GFM korrekt dar — Tabellen, Aufgabenlisten, eingezäunten Code | Der Leser landet in einer Entwickleroberfläche |
| Eine kurze URL, keine Installation für den Leser | Eines anzulegen braucht ein GitHub-Konto, obwohl Lesen keines braucht |
| Revisionen bleiben erhalten, Sie können also auf eine bestimmte Version zeigen | Ein geheimes Gist ist nicht aufgelistet, nicht privat: jeder mit der URL kann es lesen |
| Nachträglich im Browser bearbeitbar | Löschen ist der einzige Rückzug, und es ist endgültig |

**Preis:** kostenlos. Lesen braucht kein Konto; eines anzulegen braucht ein GitHub-Konto, das kostenlos ist.

**Was eine Person ohne Entwicklerhintergrund sieht**

- Eine Seite mit Ihrem Dokument in der Mitte und ringsherum eine Werkzeugleiste aus Raw, Blame, History und einem Fork-Knopf
- Ein Kasten „clone this“ mit einer HTTPS- und einer SSH-Adresse, die ihr beide nichts sagen
- Kommentarfelder darunter, die wie eine Einladung zu einem Gespräch aussehen, das Sie vielleicht nicht wollen
- Ihr GitHub-Avatar und Benutzername als Verfasserzeile, was für eine README in Ordnung ist und auf einem Angebot für Bauarbeiten seltsam
- Auf einem Telefon nimmt das Beiwerk der Oberfläche einen guten Teil des Bildschirms ein, bevor das Dokument beginnt

**Wer sollte es verwenden?** Jemanden, der einen Schnipsel, eine Konfigurationsdatei, einen Fehlerbericht oder eine Notiz an einen anderen Entwickler schickt. Es ist ein gutes Werkzeug, das ständig für das falsche Publikum benutzt wird: die Darstellung ist richtig und die Umgebung ist falsch für jeden, der nicht ohnehin auf GitHub lebt. Und „geheim“ ist das Wort, das Leute hereinlegt — es bedeutet, dass die URL nicht indexiert und nicht aufgelistet ist, nicht, dass der Zugriff gesteuert wird.

### Eine Datei in einem Repository

Wenn das Dokument zu einem Projekt gehört, legen Sie es neben den Code. GitHub, GitLab und Bitbucket stellen Markdown alle in der Dateiansicht dar, die URL der Datei ist also schon eine Seite.

| Vorteile | Nachteile |
| --- | --- |
| Versioniert mit dem Code, den sie beschreibt | Ein privates Repository verlangt vom Leser eine Anmeldung |
| Prüfbar — Änderungen kommen über einen Pull Request | Ein öffentliches zeigt Ihren Text in einer Oberfläche, die für Entwickler gebaut ist |
| Stellt GFM dar, Tabellen und Aufgabenlisten eingeschlossen | Der Link zeigt auf einen Zweig, bewegt sich also |
| Kostenlos und ohnehin Teil des Workflows | Der Verlauf behält jede frühere Version, auch die, die Sie bereuen |

**Preis:** kostenlos für öffentliche Repositories; private Repositories sind in den kostenlosen Stufen aller drei enthalten, mit Grenzen und bezahlten Stufen, die auf ihren eigenen Preisseiten beschrieben sind.

**Die Details, die es entscheiden**

- Der Standard-Link ist `/blob/main/doc.md`, der auf das auflöst, was `main` heute sagt, statt auf das, was es sagte, als Sie den Link geschickt haben
- `y` auf GitHub zu drücken schreibt die Adresse so um, dass sie den Commit festnagelt, was das wandernde Ziel behebt, aber nicht die Oberfläche darum herum
- Die Raw-Ansicht liefert die Datei als reinen Text aus, es ist also ein Download oder eine Wand aus Quelltext, kein Dokument
- Relative Bild- und Linkpfade lösen in der Repository-Ansicht tatsächlich auf, und genau deshalb brechen sie in dem Moment, in dem die Datei irgendwo anders gelesen wird, in einer E-Mail wie in einer konvertierten Seite
- Die Datei zu löschen entfernt sie aus dem aktuellen Baum und nicht aus dem Verlauf, es ist also in keinem Sinn ein Widerruf, den ein Anwalt akzeptieren würde

**Wer sollte es verwenden?** Teams. Das ist die richtige Heimat für [Dokumentation, die im Repository lebt](/blog/documentation-that-lives-in-the-repo), wo das Publikum ohnehin ein Konto hat und der Versionsverlauf der Punkt ist. Es ist die falsche Heimat für ein Angebot, das Sie letzten Dienstag an eine Kundin geschickt haben.

### Ein Link in einem Cloud-Speicher

Sie halten Dateien ohnehin in Drive, Dropbox oder OneDrive, und jeder dieser Dienste gibt Ihnen für alles im Ordner einen Freigabe-Link. Es ist der Weg des geringsten Widerstands, und was der Leser am anderen Ende bekommt, ist weniger vorhersehbar als bei den anderen Möglichkeiten hier.

| Vorteile | Nachteile |
| --- | --- |
| Kein neues Werkzeug: die Datei ist schon dort | Was die Vorschau mit `.md` macht, hängt vom Anbieter ab und ändert sich ohne Ankündigung |
| Zugriffssteuerung über Konten, und das ist echte Zugriffssteuerung | „Jeder mit dem Link“ und „bestimmte Personen“ sind leicht zu verwechseln und leicht zu verklicken |
| Den Link zu widerrufen funktioniert wirklich | Eine Anmeldeaufforderung vor einem Dokument, das jeder lesen sollte |
| Ablaufdatum und Passwörter gibt es in manchen Tarifen | Oft bekommt der Leser einfach einen Download-Knopf |

**Preis:** kostenlose Stufe bei jedem Privatkonto. Bezahlte Tarife werden nach Speicherplatz berechnet, und Link-Steuerungen wie Ablaufdatum und Passwörter sitzen bei manchen Anbietern in bezahlten Stufen — prüfen Sie die Preisseite des Anbieters, bevor Sie einer Kundin einen ablaufenden Link versprechen.

**Was Sie prüfen sollten, bevor Sie einen schicken**

- Öffnen Sie den Link in einem privaten Fenster. Nur so finden Sie heraus, ob Ihr Leser auf eine Anmeldewand trifft, denn Ihr eigener Browser ist schon authentifiziert
- Bestätigen Sie, ob die Vorschau das Markdown darstellt, die Quelle als reinen Text zeigt oder einen Download anbietet — alle drei Verhaltensweisen gibt es, und keine davon wird angekündigt
- Prüfen Sie, ob der Link Bearbeiten erlaubt. Die Voreinstellung ist nicht immer „nur ansehen“, und der Unterschied zählt bei einem Dokument, in dem ein Preis steht
- Denken Sie daran, dass die Datei in Ihrem Ordner weiterlebt. Sie umzubenennen oder zu verschieben kann den Link brechen, den Sie schon geschickt haben

**Wer sollte es verwenden?** Jeden, der mit einer benannten Gruppe innerhalb einer Organisation teilt, die diesen Anbieter ohnehin nutzt, wo die Anmeldung kein Hindernis ist und Zugriffslisten der Punkt sind. Für eine fremde Person, die einmal auf dem Telefon liest, ist es mehr Reibung, als die Aufgabe braucht.

### Eine eigenständige HTML-Datei als Anhang

Wandeln Sie das Markdown in eine einzige HTML-Datei mit inline eingebetteten Stilen um und hängen Sie diese an. Der Leser doppelklickt und bekommt ein fertiges Dokument in dem Browser, den er schon hat, und [was eine Datei enthalten muss, um sich so zu verhalten, was das Einbetten an Bytes kostet und wie Sie beweisen, dass sie nichts nachlädt](/blog/self-contained-html-explained), ist es wert, gewusst zu werden, bevor Sie sich auf das Format verlassen.

| Vorteile | Nachteile |
| --- | --- |
| Öffnet auf jedem Rechner, ohne Installation und ohne Konto | Es ist weiterhin ein Anhang, Mail-Filter gelten also weiterhin |
| Funktioniert mit abgeschaltetem Netz, im Zug, im Keller | Größer als die Quelle, weil die Gestaltung mitreist |
| Druckt und exportiert nach PDF über den eigenen Dialog des Browsers | Sie können sie nicht zurückziehen — der Leser hat eine Kopie |
| Nichts wird gehostet, nichts kann also ausfallen oder ihm unter den Händen widerrufen werden | In keiner Weise bearbeitbar, die ihm Freude macht |

**Preis:** kostenlos.

**Warum „eigenständig“ das tragende Wort ist**

- Ein vollständiges Dokument heißt Doctype, `<head>` und ein inline `<style>`-Block — kein Fragment aus `<h1>`- und `<p>`-Tags, das als ungestalteter schwarzer Text über die volle Fensterbreite dargestellt wird
- Keine externen Anfragen: kein CDN-Stylesheet, keine Web-Schrift, keine Analytik. Eine Datei, die ihre Gestaltung nachlädt, sieht offline kaputt aus und verrät jedem, der sie öffnet, etwas darüber, wo sie gewesen ist
- Bilder müssen eingebettet statt verlinkt sein, sonst kommt das Dokument auf einem Rechner, der Ihren Ordner nicht hat, mit Löchern an
- Rohes HTML ist in Markdown erlaubt, eine konvertierte Datei kann also ein `<script>`-Tag mitführen, das mit der Quelle hereinkam. Wenn das Markdown nicht von Ihnen geschrieben wurde, ist [Bereinigen nicht optional](/blog/sanitising-markdown-safely), bevor Sie das Ergebnis an jemand anderen schicken
- Die Datei ist das ganze Protokoll. Sechs Monate später öffnet sie sich genau so wie an dem Tag, an dem Sie sie geschickt haben, und das ist die Eigenschaft, die kein Link hat

**Wer sollte es verwenden?** Jeden, dessen Leser ein Dokument braucht und keine Seite, und jeden, der will, dass das Absenden endgültig ist. Angebote, Übergabenotizen, Besprechungsprotokolle, alles, was abgelegt wird. Es ist auch die Antwort, wenn die Organisation des Empfängers unbekannte Domains blockiert, Anhänge aber bereitwillig öffnet.

### Ein veröffentlichter Nur-Lese-Link

Stellen Sie das Markdown einmal dar, hosten Sie es und geben Sie die Adresse weiter. Nichts herunterzuladen, nichts zu installieren, und es liest sich als Dokument auf einem Telefon im Aufzug.

| Vorteile | Nachteile |
| --- | --- |
| Null Reibung für den Leser: tippen und lesen | Das Dokument hängt davon ab, dass ein Dienst läuft |
| Sie können einen Tippfehler nach dem Absenden korrigieren | Der Leser hat keine Kopie, nichts überlebt also einen Widerruf |
| Widerrufbar, wenn der Link dafür gebaut ist | Weiterleiten ist trivial und für Sie unsichtbar |
| Wird auf einem kleinen Bildschirm richtig dargestellt | Der Mail-Filter einer Organisation kann die URL umschreiben oder blockieren |

**Preis:** kostenlos.

**Was der Mechanismus leisten muss**

- Das dargestellte Dokument ausliefern, nicht die Markdown-Quelle, und keinen Betrachter, der ein Plug-in braucht
- Ein nicht erratbares Token in der Adresse führen und aus Suchindizes fernbleiben
- Abgemeldet funktionieren, beim ersten Besuch, auf einem Telefon, auf einem Firmen-Laptop mit aggressiver Browser-Richtlinie
- Serverseitig darstellen oder das fertige HTML ausliefern, damit ein Leser mit blockierten Skripten das Dokument dennoch sieht
- Sie die Adresse allein töten lassen, ohne den Leser um etwas zu bitten

TransformPipe kann beide Formen davon. Legen Sie die `.md`-Datei auf transformpipe.com ab und nehmen Sie den Download für eine eigenständige Datei; melden Sie sich an und veröffentlichen Sie sie für eine Nur-Lese-Seite unter `/s/<token>`. Ein Widerruf verwirft das Token, ein Link, den Sie schon geschickt haben, hört also auf zu funktionieren. Vom Terminal aus ist es ein Befehl:

```bash
node cli/tp.mjs login tp_live_…        # einmalig, mit einem API-Schlüssel
node cli/tp.mjs push proposal.md --share link
```

**Wer sollte es verwenden?** Jeden, der ein Dokument an jemanden schickt, der es einmal liest und niemals ablegt. Außerdem jeden, der mit Überarbeitungen rechnet: die Adresse bleibt dieselbe, während der Inhalt besser wird, und das ist das eine, was ein Anhang nicht kann.

### Ein PDF

Nach HTML umwandeln, öffnen, als PDF drucken. Es sind zwei Schritte statt einem, und es erkauft eine Eigenschaft, die keine der anderen Möglichkeiten hat: jeder Leser sieht die gleichen Seiten in der gleichen Reihenfolge.

| Vorteile | Nachteile |
| --- | --- |
| Lässt sich überall öffnen, auch auf Telefonen | Feste Seitenbreite, es liest sich also schlecht auf einem kleinen Bildschirm |
| Seitennummerierung, die für Unterschrift und Zitat zählt | Der freie Umbruch ist weg: lange Tabellen brechen unschön über Seiten |
| Von Prozessen akzeptiert, die keinen Link akzeptieren | Es zu bearbeiten ist ein anderes Werkzeug und ein schlechteres Erlebnis |
| Ein festes Protokoll: Seite 4 ist für alle Seite 4 | Größer als das HTML, aus dem es kam |

**Preis:** kostenlos über den eigenen Druckdialog des Browsers, den jeder moderne Browser mitbringt.

**Details, die es wert sind, gewusst zu werden**

- Das Druck-Stylesheet entscheidet das Ergebnis. Ein Dokument, das auf dem Bildschirm richtig aussieht, kann auf Papier die Rahmen seiner Code-Blöcke und die Linien seiner Tabellen verlieren
- Links überleben in der PDF-Ausgabe der meisten Browser als klickbare Anmerkungen, und Fußzeilen können die Quell-URL ergänzen, was je nach Dokument entweder nützlich oder Lärm ist
- Überschriften werden meist nur dann zu PDF-Lesezeichen, wenn der Konverter sie absichtlich ausgibt; der Druckweg des Browsers tut das in der Regel nicht
- Text bleibt markierbar, das Dokument ist also durchsuchbar und zitierbar — ein Screenshot ist kein Ersatz

**Wer sollte es verwenden?** Jeden, der etwas in einen Prozess schickt: einen Vertrag, eine Rechnung, eine Einreichung, alles, was unterschrieben oder archiviert wird. Nicht die richtige Antwort für ein Dokument, das Sie nächste Woche zweimal überarbeiten werden.

### Statisches Hosting oder Pages

GitHub Pages, GitLab Pages und jeder Generator für statische Seiten wandeln Markdown in HTML um und stellen es mit Navigation und eigener Domain ins Web. Keines davon ist ein Weg, eine einzelne Datei zu teilen.

| Vorteile | Nachteile |
| --- | --- |
| Navigation, Suche und Querverweise über viele Dokumente | Eine Konfigurationsdatei, ein Thema und ein Build-Schritt zu pflegen |
| Eine eigene Domain, die sich als Ihre liest und nicht als die eines Anbieters | Öffentlich als Voreinstellung: Zugriffssteuerung braucht bezahlte Stufen oder einen Proxy davor |
| Schnell, zwischengespeichert und kostenlos auszuliefern | Veröffentlichen ist ein Deploy, ein behobener Tippfehler ist also ein Commit und eine Wartezeit |
| Gut dokumentiert und weit verbreitet | Die Veröffentlichung zurückzunehmen bedeutet ein weiteres Deploy, keinen Schalter |

**Preis:** kostenlos für öffentliche Repositories bei den großen Anbietern; aus einem privaten Repository zu veröffentlichen verlangt einen ihrer bezahlten Tarife, beschrieben auf ihren eigenen Preisseiten.

**Wer sollte es verwenden?** Jeden, der einen Satz Dokumente veröffentlicht, die aufeinander verweisen und gefunden werden sollen. Wenn Sie eine Datei und eine Person haben, an die Sie sie schicken, ist der Aufwand enorm und das Zugriffsmodell falsch — ein statischer Host veröffentlicht an alle, und Sie wollten an einen Leser veröffentlichen.

## Was ein Freigabe-Link vom Leser verlangen sollte und was nicht

Die meiste Enttäuschung beim Teilen kommt von Links, die dem Leser etwas abverlangen. Sie schicken eine Adresse und erwarten, dass ein Dokument erscheint, und was erscheint, ist ein Formular. Von Ihrer Seite aus sah es gut aus, weil Ihr Browser schon angemeldet war.

Ein Nur-Lese-Link sollte:

- [x] sich in jedem Browser öffnen, ohne Konto, ohne App und ohne Erweiterung
- [x] das dargestellte Dokument zeigen, nicht die Markdown-Quelle
- [x] auf einem Telefon lesbar sein, in vernünftiger Zeilenbreite, ohne Zoomen
- [x] mit blockierten Skripten funktionieren, denn viele Firmenbrowser blockieren sie
- [x] von Ihnen allein widerrufbar sein, jederzeit, ohne Hilfe des Lesers
- [x] eine Adresse führen, die nicht erraten werden kann und nicht indexiert ist

Er sollte nicht:

- [ ] eine Anmeldewand vor ein Dokument stellen, das jeder lesen sollte
- [ ] eine E-Mail-Adresse einsammeln, bevor er irgendetwas zeigt
- [ ] einen bestimmten Browser verlangen oder eine App für ein „besseres Erlebnis“
- [ ] Schriften, Stile oder Analytik von anderen Hosts holen, was Dritten verrät, wer was liest
- [ ] brechen, wenn der Leser ihn an eine Kollegin weiterleitet, was er tun wird

Es gibt einen Fall dazwischen, der es wert ist, benannt zu werden. Wenn ein Dokument wirklich vertraulich ist, ist eine Adressliste die richtige Steuerung: nur die benannten Leser können es öffnen, und sie melden sich an, um zu beweisen, wer sie sind. Das ist ein anderer Mechanismus, kein strengerer Link. Ein Link, den jeder öffnen kann, passt zu einem Angebot, einer Spezifikation oder Besprechungsnotizen; eine Adressliste passt zu allem, dessen Weiterleitung Sie unglücklich machen würde. Zu entscheiden, welches von beiden Sie brauchen, dauert zehn Sekunden und verhindert das Scheitern, bei dem sich ein „privater“ Link als öffentlicher entpuppt, den bloß noch niemand gefunden hat.

## Was Widerrufen leisten muss, um Widerrufen genannt zu werden

Jeder Dienst mit einem Freigabe-Knopf sagt, der Link lasse sich widerrufen. Die meisten meinen etwas Schwächeres, als Sie annehmen. Widerrufen ist nur dann Widerrufen, wenn alles Folgende zutrifft.

**Es tötet die Adresse, nicht den Eintrag.** Ein Dokument aus Ihrer eigenen Liste der Freigaben zu entfernen, während die URL weiterhin auflöst, ist Aufräumen, kein Widerruf. Prüfen Sie es, indem Sie die Adresse nach dem Widerruf in einem privaten Fenster öffnen; erscheint das Dokument, ist nichts passiert.

**Es wirkt jetzt.** Eine Kopie, die noch eine Stunde aus dem Cache ausgeliefert wird, ist ein Dokument, das noch eine Stunde lesbar ist. Fragen Sie, wie lang die Cache-Lebensdauer ist, und behandeln Sie „irgendwann“ als eine andere Funktion.

**Es braucht nichts vom Leser.** Jeder Mechanismus, der davon abhängt, dass der Empfänger eine Datei löscht, einen Ordner leert oder auf „Zugriff entfernen“ klickt, ist kein Widerruf — er ist eine Bitte.

**Es kann von niemand anderem aufgehoben werden.** Wenn eine Kollegin mit Zugriff auf denselben Ordner die Datei erneut freigeben kann, kommt die Adresse, die Sie getötet haben, unter einem anderen Namen zurück.

**Es sagt, was es nicht abdeckt.** Ein Widerruf kann keine Kopie zurückholen. Alles, was heruntergeladen, gedruckt, als Screenshot gesichert, als Anhang weitergeleitet oder in einen Suchindex gezogen wurde, ist dauerhaft außer Reichweite. Ein gestern widerrufener Link kann weiterhin in einem Caching-Proxy im Inneren des Arbeitgebers von jemandem existieren.

Dieser letzte Punkt ist die ehrliche Grenze der ganzen Idee. Ein Widerruf steuert künftige Lesevorgänge von Leuten, die den Link behalten haben; er steuert nichts an Leuten, die das Dokument behalten haben. Wenn die Anforderung lautet „das muss aufhören zu existieren“, liefert kein Freigabe-Mechanismus auf dieser Seite das, und Sie sollten einer Kundin nichts anderes erzählen.

## Wo die naheliegende Wahl scheitert und was sie kostet

Die naheliegende Wahl, sobald man weiß, dass ein Link möglich ist, ist, immer einen Link zu schicken. Es ist ein Fingertipp für den Leser, und es lässt sich nach dem Absenden korrigieren. Hier ist, was das kostet.

**Ein Link ist eine Abhängigkeit.** Das Dokument ist so lange lesbar, wie ein Dienst läuft, eine Domain erneuert wird und ein Konto in Ordnung ist. An einem Anhang hängt keine solche Bedingung. Für alles mit langem Leben — einen Vertrag, eine Spezifikation, die jemand in zwei Jahren zitiert — ist die Kopie das sicherere Artefakt und der Link die Bequemlichkeit.

**Ein Link macht das Dokument zu einem wandernden Ziel.** Die Fähigkeit, einen Tippfehler nach dem Absenden zu beheben, ist dieselbe Fähigkeit, eine Zahl nach der Zustimmung zu ändern. Wenn das Dokument ein Protokoll ist, ist das ein Mangel und keine Funktion, und die Abhilfe ist eine festgenagelte Version oder ein Anhang.

**Ein Link scheitert in der Infrastruktur anderer Leute.** Firmen-Mailsysteme schreiben URLs zum Scannen um, Chat-Programme entfalten sie zu Vorschauen, um die Sie nicht gebeten haben, und manche Filter weisen unbekannte Domains einfach ab. Nichts davon ist von der Senderseite aus sichtbar. Anhänge haben ihre eigenen Filterprobleme, aber sie scheitern laut.

**Ein Link verrät das Lesen.** Jedes gehostete Dokument kann seinem Eigentümer sagen, wann es geöffnet wurde. Das ist manchmal genau das, was Sie wollen, und manchmal etwas, von dem Sie nicht wollen würden, dass es mit Ihnen geschieht. Wenn der Dienst außerdem Schriften oder Analytik von anderswo lädt, wird der Besuch des Lesers Parteien offengelegt, die keiner von Ihnen beiden gewählt hat.

**Ein Link ist für den Leser kein Dokument.** Er kann ihn nicht ablegen, nicht mit Anmerkungen versehen und in drei Monaten nicht durch eine Suche in seiner Post finden. Viele Leser versuchen, einen Link sofort als Datei zu speichern — schlecht. Schicken Sie die Datei, wenn sie genau das damit vorhaben.

Das spiegelbildliche Scheitern ist es auch wert, benannt zu werden. Immer eine konvertierte Datei anzuhängen heißt, dass jede Korrektur eine neue E-Mail ist, dass kein Leser jemals sicher ist, welche Version die aktuelle ist, und dass das Dokument in dem Moment aus Ihren Händen ist, in dem es landet. Die zwei Fehlfälle sind symmetrisch, und deshalb lautet die Antwort, auf das Dokument zu schauen, statt einen Favoriten zu wählen.

## Wie Sie wählen

1. **Beginnen Sie damit, was nach der Ankunft passiert.** Wenn der Leser sie bearbeiten wird, hängen Sie die Quelle an; alles andere heißt, dass er eine Darstellung bearbeitet, was er schlecht tun und dann zurückschicken wird. Wenn er sie ablegen wird, schicken Sie eine Datei. Wenn er sie einmal lesen wird, schicken Sie einen Link.
2. **Zählen Sie, was der Leser tun muss.** Jede Installation, jedes Konto und jeder Dialog zwischen der Adresse und dem Dokument kostet Sie einen Teil Ihrer Leser, und dieser Teil ist genau bei den Leuten am größten, die von Anfang an nicht lesen wollten. Null Schritte sind erreichbar, behandeln Sie einen Schritt also als Kosten.
3. **Entscheiden Sie, ob das Dokument sich ändern darf.** Ein Link, der aktuell bleibt, ist richtig für ein lebendes Dokument und falsch für ein Protokoll. Wenn jemand belegen muss, was an einem bestimmten Tag darin stand, schicken Sie einen Anhang oder nageln Sie eine Version fest, denn „ich habe es seitdem aktualisiert“ ist keine Antwort.
4. **Prüfen Sie, ob eine Weiterleitung Sie unglücklich machen würde.** Wenn die Antwort ja ist, ist eine nicht erratbare URL nicht die Steuerung, die Sie brauchen — eine Adressliste ist es. Das am Anfang richtig zu wählen ist weit billiger, als es aus einem Screenshot in einem fremden Gesprächsverlauf zu erfahren.
5. **Öffnen Sie Ihre eigene Freigabe in einem privaten Fenster, bevor Sie sie schicken.** Das fängt die Anmeldewand, die Vorschau, die nur einen Download anbietet, das fehlende Bild und den kaputten relativen Link ab, alles in unter einer Minute, und es ist der einzige Weg zu sehen, was Ihr Leser sieht, statt dessen, was Ihre authentifizierte Sitzung zeigt.

## Fazit

Eine Markdown-Datei zu teilen ist kein Konvertierungsproblem, es ist eine Frage über den Leser. Wenn die Antwort lautet „sie wollen es drucken“, [stehen die PDF-Wege hier](/blog/markdown-to-pdf). Die Frage: was ihr Rechner mit dem tun wird, was Sie schicken, und was sie danach damit tun werden. Kurz und endgültig, fügen Sie es ein. Zum Bearbeiten gedacht, hängen Sie die Quelle an und sagen Sie, was sie ist. Teil eines Projekts, committen Sie es neben den Code. Dazu gedacht, einmal von jemandem gelesen zu werden, der noch nie von Markdown gehört hat, wandeln Sie es in eine eigenständige HTML-Datei um und hängen Sie diese an, oder veröffentlichen Sie es als Nur-Lese-Link und seien Sie mit sich selbst ehrlich darüber, was das Widerrufen dieses Links rückgängig machen kann und was nicht. [TransformPipe wandelt Markdown im Browser in ein vollständiges HTML-Dokument um](/), kostenlos, und lädt nichts hoch, solange Sie abgemeldet sind — und dann, wenn Sie den Link oder die Datei haben, öffnen Sie sie in einem privaten Fenster und lesen Sie sie, wie Ihr Leser sie lesen wird.

## FAQ

### Wie teile ich eine Markdown-Datei mit jemandem, der keinen Markdown-Editor hat?

Schicken Sie ihm kein Markdown. Wandeln Sie es in eine eigenständige HTML-Datei um und hängen Sie diese an, oder veröffentlichen Sie es als Nur-Lese-Link — beides gibt ihm ein dargestelltes Dokument in dem Browser, den er schon hat. Schicken Sie die `.md`-Quelle nur dann, wenn er sie bearbeiten und zurückgeben muss.

### Kann ich eine `.md`-Datei als Link teilen, ohne ein Konto anzulegen?

Umwandeln können Sie ohne Konto, und Hosten braucht in der Regel eines. Eine Konvertierung im Browser erzeugt die HTML-Datei ganz ohne Anmeldung, und diese Datei kann sofort an eine E-Mail angehängt werden. Eine URL zu veröffentlichen heißt, dass irgendetwas sie hosten muss, und dort kommt ein Konto ins Spiel — aber der Leser braucht weiterhin keines.

### Ist ein Gist ein guter Weg, ein Dokument mit einer Person ohne Entwicklerhintergrund zu teilen?

Es stellt das Markdown korrekt dar und umgibt es mit einer Entwickleroberfläche: Raw, Blame, History, einem Klon-Kasten und Kommentarfeldern. Für eine Kollegin, die GitHub täglich benutzt, ist das unsichtbar; für eine Kundin ist es verwirrend. Denken Sie außerdem daran, dass ein geheimes Gist nicht aufgelistet statt privat ist, jeder mit der URL kann es also lesen.

### Ist es sicher, jemandem eine konvertierte HTML-Datei zu schicken?

Ja, sofern die Konvertierung die Quelle bereinigt hat. Markdown erlaubt rohes HTML, eine `.md`-Datei, die Sie nicht geschrieben haben, kann also ein `<script>`-Tag oder einen `onerror`-Handler unverändert in die konvertierte Seite tragen. Für Ihre eigenen Notizen ist das gleichgültig; bei einer Datei, die von woanders kam, prüfen Sie, ob der Konverter bereinigt, bevor Sie das Ergebnis weitergeben.

### Was passiert tatsächlich, wenn ich einen Freigabe-Link widerrufe?

Mindestens sollte die Adresse sofort aufhören aufzulösen, für alle, ohne dass der Leser etwas tut. Kopien holt es nicht zurück: alles, was heruntergeladen, gedruckt, als Screenshot gesichert oder von einem Vermittler zwischengespeichert wurde, bleibt lesbar. Ein Widerruf steuert künftige Besuche von Leuten, die den Link behalten haben, und nichts an Leuten, die das Dokument behalten haben.

### Soll ich ein PDF statt eines Links schicken?

Wenn das Dokument in einen Prozess geht — Unterschrift, Einreichung, Archiv — ja, denn ein PDF ist ein festes Protokoll, das alle identisch sehen. Wenn es einmal auf dem Telefon gelesen und möglicherweise nächste Woche überarbeitet wird, nein: feste Seiten lesen sich auf einem kleinen Bildschirm schlecht, und jede Überarbeitung ist eine neue Datei.

### Überleben meine Tabellen und Bilder das Teilen?

Tabellen überleben, wenn der Renderer GitHub Flavored Markdown beherrscht, und sie überleben es nicht, in eine Nachricht eingefügt zu werden, wo die Ausrichtungszeile zu einer Linie aus Bindestrichen wird. Bilder überleben nur, wenn sie in der Ausgabe eingebettet oder unter einer absoluten Adresse gehostet sind, denn ein relativer Pfad zeigt auf einen Ordner, den Ihr Leser nicht hat.
