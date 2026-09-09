/*
 * Die Prosa des Handbuchs — jedes Wort, das die Seite /docs aus eigenem Recht sagt.
 *
 * Eine eigene Datei statt einer Ecke von `ui.ts`, weil das der mit Abstand größte einzelne
 * Bildschirm des Produkts ist: rund 1.700 Wörter in fünfundsiebzig Einträgen, mehr als der ganze
 * Rest der Oberfläche zusammen, was in `ui.ts` jeden anderen Bildschirm begraben würde. Sie wird
 * in `index.ts` trotzdem in `ui` ausgebreitet, damit `useT()` diese Schlüssel wie jeden anderen
 * Oberflächentext erreicht und der Schlüsselsatz eine flache Tabelle bleibt, die
 * `scripts/check-i18n.mjs` vergleichen kann.
 *
 * Die Schlüssel folgen der Konvention aus `index.ts` — `docs.<abschnitt>.<ding>`, wobei
 * `<abschnitt>` die id des Abschnitts ist, in dem der Satz steht; ein Schlüssel sagt also, wo auf
 * der Seite er erscheint, und eine Umformulierung bedeutet nie eine Umbenennung.
 *
 * Ein Satz, der Code, eine fette Beschriftung oder ein hervorgehobenes Wort umfasst, ist EIN
 * Eintrag mit einem `{platzhalter}` an der Stelle des Elements, nie drei Fragmente. Fragmente
 * lassen sich nicht umstellen: ein deutscher Satz ordnet Kopfzeilenname, Verb und Pfad anders als
 * ein englischer, und drei getrennte Texte würden ihn in die englische Wortstellung zwingen. Die
 * Elemente selbst — die Pfade, Flags, Kopfzeilen, Endungen und Endpunkte — bleiben im JSX der
 * Seite, denn keines davon ist ein Wort, das jemand übersetzt.
 *
 * Nicht hier: die elf Abschnittstitel, die im selben Verzeichnis in `docs` stehen — die
 * Überschriften der Seite und ihr Inhaltsverzeichnis lesen den einen Eintrag dort, damit eine
 * Überschrift und die Zeile, die auf sie verweist, nicht zwei verschiedene Dinge sagen können.
 * Ebenso nicht die Fragen am Fuß der Seite (`faq`) und nicht die MCP-Werkzeugbeschreibungen in
 * `src/lib/mcp-facts.ts` — der Connector antwortet auf Englisch, und seine Werkzeugnamen und
 * -beschreibungen sind Teil eines Protokolls, nicht Prosa.
 */

export const docsPage = {
  /* Der Kopf der Seite. */
  'docs.eyebrow': 'Dokumentation',
  /* The contents column beside the manual. Not 'In this article' — this is not one. */
  'docs.toc': 'Auf dieser Seite',

  'docs.title': 'Alles, was transformpipe tut',
  'docs.lede':
    'Markdown, HTML, Word, CSV oder JSON hinein — ein Dokument heraus, als HTML, Markdown, reiner Text oder Druck. Von dieser Seite aus, aus einem Terminal, aus einem Pull Request oder aus einem Assistenten. Das ist alles; nichts davon steckt hinter einem Tarif.',

  /* Unter jedem Screenshot, hinter der Bildunterschrift. */
  'docs.shot.enlarge': '— zum Vergrößern klicken',

  /* Der Chip, der in zwei Abschnitten auftaucht, Verlauf und Teilen, und in beiden gleich lauten muss. */
  'docs.chip.shared': 'Für mich geteilt',

  'docs.start.signedOut':
    'Eine Datei auf den Konverter ziehen, und schon liegen das umgewandelte Dokument und ein Download bereit. Abgemeldet wird nichts gespeichert und nichts irgendwohin gesendet — die Umwandlung läuft in diesem Browser, auf dem eigenen Rechner.',
  'docs.start.signedIn':
    'Mit Google angemeldet folgen dieselben Dokumente einem von Gerät zu Gerät, lassen sich per Link oder per Adresse teilen und sind mit einem API-Schlüssel aus einem Skript erreichbar. Was vor der Anmeldung umgewandelt wurde, zieht dabei mit ins Konto.',

  /** `{menu}` ist der Eintrag Konverter in der Kopfzeile, fett. */
  'docs.converting.intro':
    '{menu} in der Kopfzeile listet auf, was diese App umwandelt. Jede Umwandlung hat ihre eigene Seite, ihre eigene Ablagefläche und ihre eigene Adresse, sodass sie sich verlinken und als Lesezeichen ablegen lässt, statt jedes Mal neu eingestellt zu werden:',
  'docs.converting.menu': 'Konverter',
  /** `{docx}` ist die Endung selbst. */
  'docs.converting.sizes':
    'Bis 10 MB je Datei. Mehrere Markdown-Dateien zugleich ablegen, und sie werden in der Reihenfolge ihres Eintreffens zu einem einzigen Dokument verkettet, getrennt durch eine Linie. Eine Datei, die die Seite nicht nimmt — etwa ein {docx} auf der Markdown-Seite —, wandert zu der Umwandlung, die sie nimmt, statt abgewiesen zu werden; eine Mischung verschiedener Arten wird abgewiesen, denn eine Tabelle an ein Word-Dokument zu ketten hat niemand gemeint.',
  'docs.converting.oneShape':
    'Alles endet als Markdown, und das mit Absicht: als Markdown wird ein Dokument gespeichert, in der Vorschau gezeigt, geteilt und von einem Skript erreicht, sodass die ganze App auf einer Form statt auf vier steht.',
  'docs.converting.shot.converter.alt':
    'Der transformpipe-Konverter mit leerer Ablagefläche',
  'docs.converting.shot.converter.caption':
    'Der Konverter. Das Logo ist zugleich „von vorn anfangen“.',
  'docs.converting.flavour':
    'Heraus kommt GitHub Flavored Markdown: Tabellen, Aufgabenlisten, Durchstreichung, Autolinks, umzäunter Code. Die Vorschau ist das Dokument selbst, gestaltet mit denselben Tokens wie die App — eine dunkle App gibt also eine dunkle Seite heraus, und beim Drucken wird immer auf hell umgeschaltet, denn eine dunkle Seite auf Papier ist eine Wand aus Tinte.',
  'docs.converting.shot.preview.alt':
    'Ein umgewandeltes Dokument im Reiter Vorschau',
  'docs.converting.shot.preview.caption':
    'Vorschau, mit den Zahlen, die das Dokument wirklich hat.',
  /** `{to}` ist das Wort unten, in der Mitte des Satzes hervorgehoben. */
  'docs.converting.source':
    'Der Quelltext-Reiter ist keine Zusammenfassung der Ausgabe. Er ist genau das, was der Download herausgibt — das eigenständige HTML, wenn {to} HTML umgewandelt wurde, das Markdown, wenn nach Markdown umgewandelt wurde: ein Dokument, Stile inline, keine Skripte, kein Netz.',
  'docs.converting.source.emphasis': 'nach',
  /** `{html}` und `{md}` sind die zwei Endungen. */
  'docs.converting.download':
    'Die Schaltfläche zum Herunterladen trägt das Format, das die Umwandlung erzeugt hat — {html} auf der Markdown-Seite, {md} auf den anderen —, und der Pfeil daneben hält den Rest: Markdown, HTML, reinen Text und den Druck. Der Druck baut die exportierte Datei in einem eigenen Rahmen und öffnet den Dialog des Browsers, sodass ein PDF das Dokument ist und kein Bildschirmfoto der App darum herum; der Export schaltet auf Papier auf eine helle Palette, egal was in der App eingestellt ist.',
  'docs.converting.shot.source.alt':
    'Der Reiter HTML-Quelltext mit dem eigenständigen Dokument',
  'docs.converting.shot.source.caption':
    'Der Reiter HTML-Quelltext: was man bekommt, bevor man es bekommt.',
  'docs.converting.reading':
    'Zum Lesen statt zum Prüfen geht die Vorschau ins Vollbild und behält eine lesbare Zeilenbreite; Escape kommt zurück. Ein langes Dokument bekommt in beiden Ansichten eine Schaltfläche nach oben.',

  'docs.history.intro':
    'Jede Umwandlung landet im Verlauf — angemeldet im Konto, sonst in diesem Browser. Die Suche läuft über Dateinamen, die Spalten sortieren, und eine Zeile öffnet das Dokument.',
  'docs.history.shot.history.alt':
    'Die Verlaufsliste mit Suche, Chips und sortierbaren Spalten',
  'docs.history.shot.history.caption':
    'HTML oder Markdown, Suche, sortierbare Spalten.',
  /**
   * `{all}` und `{shared}` sind die zwei Chips, die immer da sind, `{badge}` das Formatabzeichen
   * einer Zeile — die Formatkürzel bleiben in der Seite.
   */
  'docs.history.chips':
    'Die Chips filtern danach, woher ein Dokument kam: zuerst {all}, dann ein Chip je Umwandlung, die tatsächlich Zeilen hat, und {shared} für Dateien, die jemand geschickt hat. Das Abzeichen einer Zeile sagt dasselbe — {badge} auf einer Word-Datei —, sodass eine Liste von dreißig Dokumenten noch erkennen lässt, was was ist.',
  'docs.history.chip.all': 'Alle Formate',
  'docs.history.downloading':
    'Das Herunterladen ist ein Menü und kein Chip: gespeichert wird immer nur das Markdown, HTML und reiner Text entstehen an der Stelle, sodass eine Zeile alle drei herausgeben kann, ohne drei Kopien zu halten.',
  'docs.history.selection':
    'Zeilen anhaken, und die Auswahlleiste erscheint: sie zu einem Dokument zusammenfügen, herunterladen oder löschen. Das Zusammenfügen behält die Reihenfolge der Liste.',
  'docs.history.shot.selection.alt':
    'Zwei ausgewählte Zeilen, mit der Leiste für Mehrfachaktionen',
  'docs.history.shot.selection.caption':
    'Zusammenfügen, Herunterladen und Löschen in einem Zug.',

  /** `{anyone}` und `{only}` sind die zwei Modi, fett; `{path}` ist die Adresse, die eine Freigabe bekommt. */
  'docs.sharing.modes':
    '{anyone} veröffentlicht das Dokument unter {path} — eine Seite nur zum Lesen, mit dem Dokument und einem Download, sonst nichts. {only} verlangt vom Leser die Anmeldung mit einer der aufgeführten Adressen.',
  'docs.sharing.mode.link': 'Alle mit dem Link',
  'docs.sharing.mode.people': 'Nur diese Adressen',
  'docs.sharing.revoking':
    'Ein Widerruf verwirft das Token, ein schon verschickter Link hört also auf zu funktionieren; erneutes Teilen prägt ein anderes. Es wird nie eine E-Mail versandt — den Link geben Sie selbst weiter.',
  /** `{shared}` ist der Chip, den `docs.chip.shared` benennt. */
  'docs.sharing.incoming':
    'Dokumente, die andere an eine Adresse gerichtet haben, erscheinen unter dem Chip {shared}, samt der Angabe, wer sie geteilt hat. Sie sind nur zum Lesen: öffnen und herunterladen, kein Löschen, kein Weiterteilen. Eine Link-Freigabe gehört dem, der den Link hat, und erscheint darum auf niemandes Liste.',
  /** `{csp}` ist die Content-Security-Policy-Direktive selbst. */
  'docs.sharing.safety':
    'Eine geteilte Seite trägt den Inhalt eines anderen auf unserer Domain, also wird sie mit {csp} ausgeliefert und lässt sich nicht in einen Rahmen setzen, und jede von ihnen verweist auf ein Meldeformular, das kein JavaScript braucht. Nichts wird automatisch widerrufen: eine Meldung ist die Behauptung eines Fremden über das Dokument eines anderen, und beide Fehler — eine schlechte Seite stehen zu lassen, einen unschuldigen Link zu töten — verdienen erst den Blick eines Menschen.',

  'docs.account.signIn':
    'Angemeldet wird mit Google, über Neon Auth. Im Kontomenü stecken das Design (dunkel als Voreinstellung, je Browser gemerkt), die API-Schlüssel und der Weg hinaus.',
  'docs.account.keys':
    'Ein Schlüssel wird einmal gezeigt und nur als Hash gespeichert. Er erreicht Dokumente und Freigaben — nie das Konto und nie die Schlüssel selbst, sodass ein abgeflossener Schlüssel weder seinen Nachfolger prägen noch jemanden aussperren kann. Ein Widerruf greift bei der nächsten Anfrage.',

  /** `{auth}` ist der Authorization-Header, so gezeigt, wie er gesendet wird. */
  'docs.api.intro':
    'Alles, was die App tut, kann auch ein Skript tun. Den Schlüssel als {auth} senden; eine Browser-Sitzung geht ebenso, sodass sich dieselben Endpunkte angemeldet ausprobieren lassen.',
  /*
   * Die Tabelle der Endpunkte. Die Begriffe sind die Endpunkte, die in der Seite bleiben; hier
   * stehen die Erklärungen daneben. Die Platzhalter sind Query-Parameter und JSON-Formen.
   */
  'docs.api.post':
    'Markdown als Body ({name}) oder JSON {json}. {share} veröffentlicht es im selben Aufruf. {kindHtml}, {kindCsv} oder {kindJson} wandelt den Body zuerst um, sodass eine Seite, eine Tabelle oder eine API-Antwort so gesendet werden kann, wie sie ist; {word} wird hier abgewiesen, denn ein {docx} wird im Browser gelesen.',
  'docs.api.list':
    'Die neuesten 500, mit Größen, Zahlen und Freigabestand.',
  'docs.api.one': 'Metadaten und der Markdown-Quelltext.',
  'docs.api.html': 'Das eigenständige Dokument. {theme} optional.',
  'docs.api.delete': 'Entfernt die Zeile und die gespeicherte Quelle.',
  'docs.api.share': '{modes}. {private} verwirft das Token.',
  'docs.api.usage': 'Was das Konto belegt, gemessen an den Grenzen.',
  /** `{shape}` ist der Fehler-Body selbst. */
  'docs.api.errors':
    'Fehler sind {shape}, mit einem Status, der sagt, was er meint: 401 unbekannter Schlüssel, 404 nicht Ihres, 413 das Dokument liegt über 4 MB, 403 das Konto hat keinen Platz mehr, 429 zu schnell, 410 die Quelle ist fort.',

  /** `{cli}` ist der Pfad zum Client im Repository. */
  'docs.cli.intro':
    '{cli} im Repository ist dieselbe API mit freundlicherem Gesicht, und ohne Abhängigkeiten — ein Werkzeug, das in CI läuft, sollte keinen Paketbaum hinter sich herziehen.',
  /** Die Platzhalter sind die vier Endungen, die es umwandelt, die eine, die es abweist, und die Flag. */
  'docs.cli.extensions':
    'Ein gepushtes {html}, {csv}, {tsv} oder {json} wird vom Endpunkt umgewandelt, statt gespeichert zu werden, als wäre es schon Markdown; ein {docx} wird abgewiesen, mit Hinweis auf die Seite, die es lesen kann. {merge} verkettet nur Markdown.',
  /** Die Platzhalter sind die Flag, die Variable, der Konfigurationspfad, die Host-Variable und die Flag. */
  'docs.cli.key':
    'Der Schlüssel kommt aus {key}, dann {env}, dann {config}. {host} richtet es auf ein anderes Deployment, und {json} gibt die Antwort der API selbst aus.',

  'docs.action.intro':
    'Ohne Dateiliste veröffentlicht die Action das Markdown, das ein Pull Request geändert hat, und kommentiert die Links darunter — sodass eine Prüferin das gerenderte Dokument öffnet, statt ein Diff aus Sternchen zu lesen.',
  /** `{example}` ist die Workflow-Datei; `{depth}` und `{permission}` sind die zwei YAML-Einstellungen. */
  'docs.action.workflow':
    '{example} ist ein vollständiger Workflow zum Kopieren. Der Checkout braucht {depth} für den Basis-Commit, mit dem die Dateiliste verglichen wird, und der Kommentar braucht {permission}.',
  /* Die Tabelle der Eingaben. Die Begriffe sind die Namen der Eingaben, die in der Seite bleiben. */
  'docs.action.input.apiKey':
    'Pflicht. Gehört in ein Repository-Secret.',
  'docs.action.input.files':
    'Pfade, durch Leerzeichen getrennt. Voreingestellt ist, was der Pull Request geändert hat.',
  /** Die Platzhalter sind die drei Werte, die die Eingabe annimmt. */
  'docs.action.input.share':
    '{link} (Voreinstellung), {people} oder {none} für eine private Veröffentlichung.',
  'docs.action.input.merge':
    'Die Dateien zu einem Dokument verketten, statt zu je einem.',
  'docs.action.input.comment':
    'Die Links am Pull Request kommentieren.',
  'docs.action.input.host': 'Ein anderes Deployment von transformpipe.',
  'docs.action.pushes':
    'Ein Push veröffentlicht neue Dokumente, statt die alten zu überschreiben, sodass ein Link in einem älteren Kommentar weiter zeigt, was jener Commit sagte.',

  /** `{path}` ist die Adresse des Connectors, die aus `mcp-facts.ts` kommt. */
  'docs.assistant.intro':
    'transformpipe ist ein MCP-Server und lässt sich darum als Connector zu Claude hinzufügen. Die Adresse ist dieses Deployment plus {path}:',
  'docs.assistant.adding':
    'Auf claude.ai gehört das unter Einstellungen → Connectors → Eigenen Connector hinzufügen. Aus einem Terminal:',
  'docs.assistant.auth':
    'Es gibt keinen Schlüssel zum Einfügen. Der erste Aufruf kommt unautorisiert zurück, Ihr Assistent folgt dem auf eine Seite hier, und Sie melden sich mit demselben Konto an, das Sie ohnehin nutzen, und genehmigen einen benannten Client — deshalb nennt die Seite die Adresse, als die er handeln will. Was er bekommt, ist ein Token von uns, gut für Ihre Dokumente und für nichts sonst: nicht für Ihr Konto, nicht für Ihre Anmeldung und nicht für Ihre API-Schlüssel. Im Kontomenü, unter MCP-Konnektor, wieder trennen, und beim nächsten Aufruf ist Schluss.',
  'docs.assistant.tools':
    'Die Werkzeuge sind derselbe Code wie die API oben, im Prozess aufgerufen, sodass ein Gespräch und ein Skript dieselbe Antwort bekommen. Zwei davon sind nach dem Schaden geformt, den sie anrichten können: Teilen veröffentlicht eine Seite im offenen Netz, und Löschen verlangt eine ausdrückliche Bestätigung und entfernt genau ein Dokument.',

  /* Die Tabelle der Grenzen: jeder Begriff und die Zahl daneben. */
  'docs.limits.account.term': 'Je Konto',
  'docs.limits.account.text': '100 MB Markdown, 500 Dokumente',
  'docs.limits.convert.term': 'Je Umwandlung',
  'docs.limits.convert.text':
    '10 MB — etwa 1.5 Millionen Wörter. Mehrere zusammen abgelegte Dateien zählen als das eine Dokument, das sie werden',
  'docs.limits.document.term': 'Je behaltenes Dokument',
  'docs.limits.document.text':
    '4 MB, und nicht aus eigener Wahl: eine Vercel Function weist eine Anfrage oder einen Antwort-Body über 4.5 MB ab, bevor irgendetwas von diesem Code läuft, ein größeres Dokument könnte also weder gespeichert noch zurückgelesen werden. Es wandelt trotzdem um, zeigt eine Vorschau und lädt herunter — es bleibt nur aus dem Verlauf heraus, und die App sagt das, statt eine Speicherung zu melden, die nicht geschehen ist',
  'docs.limits.caller.term': 'Je Aufrufer',
  'docs.limits.caller.text':
    '60 Anfragen je Minute, gezählt nach Schlüssel oder nach Sitzung',
  'docs.limits.refusal':
    'Eine erreichte Grenze ist eine Abweisung, keine stille Verdrängung. Diese App hat früher das älteste Dokument verworfen, um unter ihrer Obergrenze zu bleiben, und damit still etwas zerstört, das sein Besitzer bewusst behalten hatte; jetzt sagt sie stattdessen, was zu löschen ist.',

  'docs.faq.intro':
    'Dieselben Antworten, die der Konverter unter seiner Ablagefläche zeigt — ein Satz davon, damit die zwei Seiten nicht auseinanderlaufen können.',

  'docs.footer.source': 'Quellcode und Issues:',
};
