import type { Content } from '../../content';

/*
 * Jeder Satz, den die Oberfläche selbst sagt, nach dem Ort geschlüsselt, an dem er steht.
 *
 * Das ist der Teil, den die Komponenten über `useT()` lesen. Nicht hier steht alles, was eher ein
 * Ding als ein Wort ist: eine id, ein Pfad, eine Dateiendung, ein Slug, ein Datum, eine URL. Die
 * bleiben im Code, dem sie gehören — `shared/conversions.ts`, `src/lib/pages.ts`,
 * `src/lib/blog.ts` —, damit eine Übersetzung, die einen Satz ändert, keine Route zerstören kann.
 *
 * Die Schlüssel folgen der Konvention aus `./index.ts`: `bereich.ding`, klein geschrieben, mit
 * Punkten getrennt, benannt nach dem Ort, an dem der Text erscheint, nicht nach seinem Inhalt.
 * `page.` ist das eine Präfix, das jene Liste nicht nennt — es sind die fünf Seiten, die nur aus
 * Worten bestehen, `src/features/StaticPage.tsx`, ein Bildschirm wie die anderen.
 *
 * Ein Text, der aus einem Wert gebaut wird, trägt einen `{name}`-Platzhalter und wird an der
 * Aufrufstelle gefüllt. Die Alternative — ein übersetztes Fragment, in JSX an eine Zahl geklebt —
 * lässt sich nicht umstellen, und Deutsch setzt die Teile in eine andere Reihenfolge. Also ist
 * `history.row.stats.many` ein Satz mit zwei Löchern und nicht drei Kinder eines `<span>`.
 *
 * Singular und Plural sind eigene Schlüssel, `.one` und `.many`, die der Aufrufer wählt. Englisch
 * braucht zwei Formen und die vier Sprachen hier ebenso; eine Sprache, die mehr braucht, bekommt
 * mehr Schlüssel — eine Änderung an dieser Datei, nicht an den Komponenten.
 */

export const ui: Content['ui'] = {
  /* Worte, die zu keinem Bildschirm gehören. */
  'common.copy': 'Kopieren',
  'common.copied': 'Kopiert',
  'common.loading': 'Wird geladen…',
  'common.clipboard.error': 'Kein Zugriff auf die Zwischenablage',
  'common.selectall': 'Alle auswählen',
  'common.deselectall': 'Auswahl aufheben',
  'common.selected': '{count} ausgewählt',
  'common.exitselection': 'Auswahl beenden',
  'common.scrolltotop': 'Nach oben',
  /* Sagt der Konverter nach einer Ablage und der Verlauf nach dem Zusammenfügen — derselbe Satz. */
  'common.chained': '{count} Dateien zu einem Dokument verkettet',
  /*
   * Wie mehrere verkettete Dateien zusammen heißen: der erste Name, und wie viele ihm folgten.
   *
   * Ein Name statt einer Beschriftung, und dennoch ein Satz — „weitere“ ist ein Wort. Der Name
   * eines Dokuments mit einer Quelle ist der Name jener Datei, und `merged.md` für keine davon ist
   * ein Dateiname; beide bleiben also in `src/lib/merge.ts`, wo die übrige Benennung liegt.
   */
  'common.merged.name': '{first} + {count} weitere',

  /*
   * Die Anmeldung, die auf mehr Weisen scheitert als sie gelingt und sagen muss, auf welche.
   *
   * Die vier `auth.error`-Sätze nach dem ersten sind die Ergebnisse, die `/api/auth/finish` im
   * Query-String zurückgeben kann — eine geschlossene Menge, denn der Grund kommt in einem Link,
   * und einen Link kann jeder schreiben. `auth.incomplete` ist der Toast, der den jeweiligen trägt.
   */
  'dialog.mcp.lede':
    'TransformPipe in einem Assistenten hinzufügen: er kann dann Dokumente in diesem Konto umwandeln, speichern und teilen.',
  'dialog.mcp.address': 'Konnektor-Adresse',
  'dialog.mcp.nokey':
    'Auf claude.ai: Einstellungen → Konnektoren → Eigenen Konnektor hinzufügen. Kein Schlüssel zum Einfügen — die Anmeldung läuft über Ihr Konto, und die Verbindung lässt sich hier trennen.',
  'dialog.mcp.command': 'Im Terminal',
  'header.connector': 'MCP-Konnektor',

  /* The sign-in dialog: three views — in, up, and asking for a reset link. */
  'auth.dialog.signin.title': 'Anmelden',
  'auth.dialog.signup.title': 'Konto erstellen',
  'auth.dialog.reset.title': 'Passwort zurücksetzen',
  'auth.dialog.reset.lede':
    'Geben Sie die E-Mail-Adresse des Kontos ein; ein Link zum Zurücksetzen wird zugeschickt.',
  'auth.dialog.email': 'E-Mail',
  'auth.dialog.password': 'Passwort',
  'auth.dialog.forgot': 'Passwort vergessen?',
  'auth.dialog.submit.signin': 'Anmelden',
  'auth.dialog.submit.signup': 'Weiter',
  'auth.dialog.submit.reset': 'Link zusenden',
  'auth.dialog.tonew': 'Noch kein Konto?',
  'auth.dialog.tonew.action': 'Registrieren',
  'auth.dialog.toexisting': 'Sie haben schon ein Konto?',
  'auth.dialog.toexisting.action': 'Anmelden',
  'auth.dialog.back': 'Zurück zur Anmeldung',
  'auth.dialog.or': 'oder',
  'auth.dialog.google': 'Mit Google fortfahren',
  'auth.dialog.terms': 'Ich akzeptiere die {terms}',
  'auth.dialog.terms.link': 'Nutzungsbedingungen',
  'auth.dialog.terms.required':
    'Die Nutzungsbedingungen müssen für ein Konto akzeptiert werden.',
  'auth.dialog.verify.title': 'E-Mail bestätigen',
  'auth.dialog.verify.lede':
    'Ein sechsstelliger Code ist an {email} unterwegs. Er läuft in zehn Minuten ab.',
  'auth.dialog.verify.code': 'Sechsstelliger Code',
  'auth.dialog.verify.submit': 'Bestätigen',
  'auth.dialog.verify.resend': 'Neuen Code senden',
  'auth.dialog.verify.resent': 'Ein neuer Code ist unterwegs.',
  'auth.dialog.verify.done': 'Die Adresse ist bestätigt.',
  'auth.dialog.verify.later': 'Später',
  'header.verify': 'E-Mail bestätigen',
  'auth.dialog.reset.sent': 'Falls zu dieser Adresse ein Konto gehört, ist ein Link unterwegs.',
  'auth.verify.sent':
    'Das Konto ist angelegt. Der Link zur Bestätigung der Adresse liegt im Postfach.',

  'auth.incomplete': 'Anmeldung nicht abgeschlossen',
  'auth.error.unfinished':
    'Die Anmeldung wurde nicht beendet. Versuchen Sie es erneut.',
  'auth.error.link':
    'Der Anmeldelink war unvollständig. Versuchen Sie es erneut.',
  'auth.error.unreachable': 'Der Anmeldedienst war nicht erreichbar.',
  'auth.error.rejected': 'Der Anmeldedienst hat die Anfrage abgelehnt.',
  'auth.error.nosession': 'Der Anmeldedienst hat keine Sitzung zurückgegeben.',
  'auth.error.start': 'Die Anmeldung ließ sich nicht starten',
  'auth.error.signout': 'Abmelden fehlgeschlagen',

  /* Die Leiste am Kopf, auf breitem Bildschirm und im Menü des Telefons. */
  'header.home': 'Neue Datei',
  'header.tagline.conversion': '{name}-Konverter',
  'header.tagline.app': 'Dokumentkonverter',
  'header.nav.converter': 'Konverter',
  'header.nav.history': 'Verlauf',
  'header.nav.docs': 'Doku',
  'header.nav.documentation': 'Dokumentation',
  'header.nav.blog': 'Blog',
  'header.menu.open': 'Menü',
  'header.menu.title': 'Menü',
  'header.menu.close': 'Menü schließen',
  'header.menu.convert': 'Umwandeln',
  'header.menu.goto': 'Wechseln zu',
  'header.account': 'Konto',
  'header.signin': 'Anmelden',
  'header.logout': 'Abmelden',
  'header.apikeys': 'API-Schlüssel',
  'header.theme.label': 'Design',
  'header.theme.dark': 'Dunkel',
  'header.theme.light': 'Hell',
  'header.theme.toggle': 'Design wechseln',
  'header.theme.tolight': 'Auf hell umstellen',
  'header.theme.todark': 'Auf dunkel umstellen',

  /* Der Konverter: die Ablagefläche, das Dokument daraus und die Bänder darunter. */
  'converter.dropzone.title': '{extension}-Dateien hier ablegen',
  'converter.dropzone.choose': 'Dateien auswählen',
  'converter.dropzone.limits':
    '{extensions} · bis 10 MB · im Browser verarbeitet',
  /*
   * Dieselbe Tatsache wie `converter.dropzone.limits`, als Satz statt als Reihe von Gliedern:
   * dieser gehört der vorgerenderten Seite, gelesen von einem Crawler und von allen, deren Bundle
   * noch nicht da ist, und dort ist eine Zeile aus Mittelpunkten keine Prosa. `scripts/prerender.ts`
   * füllt sie aus.
   */
  'converter.accepts': 'Nimmt {extensions}, bis 10 MB, umgewandelt im Browser.',
  'converter.picker.label': 'Oder etwas anderes umwandeln',
  'converter.blog.eyebrow': 'Blog',
  'converter.blog.title': 'Markdown im Zaum halten',
  'converter.blog.blurb':
    'Syntax, die bricht, Dokumente, die andere erreichen müssen, und wie das Ganze ohne einen selbst läuft.',
  'converter.blog.all': 'Alle Artikel',
  'converter.faq.eyebrow': 'FAQ',
  'converter.faq.title': 'Fragen, mit denen Leute herkommen',
  'converter.faq.blurb':
    'Was mit der Datei passiert, was im Download steckt und was ein Konto dazugibt.',
  'converter.badge.converted': 'umgewandelt',
  'converter.badge.merged': '{count} Dateien zusammengefügt',
  'converter.newfile': 'Neue Datei',
  'converter.share': 'Teilen',
  'converter.share.hint': 'Einen Link zu diesem Dokument teilen',
  'converter.share.hint.signedout':
    'Zum Teilen anmelden — geteilt wird nur, was im Konto liegt',
  'converter.copy': '{format} kopieren',
  'converter.copy.done': '{format} in die Zwischenablage kopiert',
  'converter.download': '.{format} herunterladen',
  'converter.download.more': 'Andere Formate',
  'converter.download.done': '{format} heruntergeladen',
  'converter.print': 'Drucken oder als PDF speichern',
  'converter.print.error': 'Der Druckdialog ließ sich nicht öffnen',
  'converter.print.error.hint': 'Laden Sie es stattdessen herunter.',
  'converter.tab.preview': 'Vorschau',
  'converter.tab.html': 'HTML-Quelltext',
  'converter.tab.markdown': 'Markdown',
  'converter.fullscreen.enter': 'Im Vollbild lesen',
  'converter.fullscreen.exit': 'Vollbild beenden',
  'converter.fullscreen.error': 'Vollbild ist hier nicht verfügbar',

  /*
   * Wenn eine Datei nicht durchkommt: was abgelegt wurde, was zu groß war, was die Umwandlung
   * selbst zu sagen hatte, und was ein Dokument ist, das umgewandelt wurde, aber nicht hineinpasst.
   *
   * Der Grund ist immer ein zweiter Satz und nie ein an den ersten geschraubtes Nebensatzglied,
   * denn der Toast hat zwei Zeilen und ein Grund ist das, womit jemand etwas anfangen kann.
   * `{conversion}` ist der Name aus `content.conversions`, also sagt der Fehlschlag in jeder
   * Sprache „Word → Markdown hat nicht funktioniert“.
   */
  'converter.reject.title': 'Diese Datei lässt sich hier nicht umwandeln',
  'converter.reject.extension': '{name} — diese Seite nimmt {extensions}.',
  'converter.reject.mixed':
    'Das sind {count} verschiedene Dateiarten. Wandeln Sie immer nur eine Art um.',
  'converter.toolarge.one': 'Datei ist zu groß',
  'converter.toolarge.many': 'Diese Dateien sind zu groß',
  'converter.toolarge.detail':
    '{size} — die Grenze für ein Dokument liegt bei {limit}.',
  'converter.converted': 'In {format} umgewandelt',
  'converter.notkept.title': 'Umgewandelt, aber nicht im Konto gespeichert',
  'converter.notkept.detail':
    'Gespeichert wird ein Dokument bis {limit}; dieses hat {size}. Laden Sie es herunter — es ist fertig.',
  'converter.failed': '{conversion} hat nicht funktioniert',
  'converter.failed.detail': 'Die Datei ließ sich nicht lesen.',
  'converter.error.norows': 'Diese Datei enthält keine Zeilen.',
  /* `{why}` ist die Auskunft des Konverters selbst, bei einer Word-Datei die von mammoth. */
  'converter.error.empty': 'Aus diesem Dokument kam nichts heraus — {why}.',
  'converter.error.empty.why': 'die Datei enthält keinen Text',
  /* Der Rahmen, aus dem ein PDF gedruckt wird: nie zu sehen, von einem Screenreader vorgelesen. */
  'converter.print.frame': '{name} zum Drucken',
  'converter.print.unprepared':
    'Das Dokument ließ sich nicht zum Drucken vorbereiten.',

  /*
   * Woraus das Dokument besteht, ein Substantiv je Anzahl. Die Zahl ist ein eigenes Element in der
   * Zeile — sie steht in schwererem Schnitt —, deshalb wird das Wort für sich übersetzt und nicht
   * als Teil eines Satzes mit einem Loch darin.
   */
  'converter.stats.word': 'Wort',
  'converter.stats.words': 'Wörter',
  'converter.stats.heading': 'Überschrift',
  'converter.stats.headings': 'Überschriften',
  'converter.stats.table': 'Tabelle',
  'converter.stats.tables': 'Tabellen',
  'converter.stats.codeblock': 'Codeblock',
  'converter.stats.codeblocks': 'Codeblöcke',
  'converter.stats.link': 'Link',
  'converter.stats.links': 'Links',
  'converter.stats.image': 'Bild',
  'converter.stats.images': 'Bilder',

  /* Die Liste aller Umwandlungen: ihr Kopf, ihre Filter, ihre Zeilen und ihre Spalten. */
  'history.title': 'Verlauf',
  'history.synced': 'Im Konto gespeichert',
  'history.local': 'Nur in diesem Browser — angemeldet überall erreichbar',
  'history.usage':
    '· {bytes} von {maxBytes} · {documents} von {maxDocuments} Dokumenten',
  'history.empty.title': 'Noch keine Umwandlungen',
  'history.empty.synced':
    'Jede umgewandelte Datei wird im Konto gespeichert — von jedem Gerät aus zu öffnen.',
  'history.empty.local':
    'Jede umgewandelte Datei erscheint hier. Angemeldet bleibt die Liste über Geräte hinweg erhalten.',
  'history.empty.action': 'Datei umwandeln',
  'history.drop.title': 'Dateien ablegen',
  'history.drop.hint':
    'oder klicken zum Auswählen — mehrere Dateien werden zu einem Dokument verkettet',
  'history.search.placeholder': 'Nach Namen suchen',
  'history.search.label': 'Verlauf nach Dateinamen durchsuchen',
  'history.search.clear': 'Suche zurücksetzen',
  'history.chip.all': 'Alle Formate',
  'history.chip.shared': 'Für mich geteilt',
  'history.shared.one': '{count} Dokument für Sie geteilt',
  'history.shared.many': '{count} Dokumente für Sie geteilt',
  'history.count.one': '{count} Datei',
  'history.count.many': '{count} Dateien',
  'history.count.filtered.one': '{found} von {total} Datei',
  'history.count.filtered.many': '{found} von {total} Dateien',
  'history.merge': 'Zusammenfügen',
  'history.merge.hint':
    'Die ausgewählten Dateien zu einem Dokument verketten, älteste zuerst',
  'history.merge.hint.few': 'Mindestens zwei Dateien zum Verketten auswählen',
  'history.download': 'Herunterladen',
  'history.delete': 'Löschen',
  'history.clear': 'Verlauf löschen',
  'history.column.file': 'Datei',
  'history.column.type': 'Typ',
  'history.column.sharedby': 'Geteilt von',
  'history.column.size': 'Quellgröße',
  'history.column.content': 'Inhalt',
  'history.column.converted': 'Umgewandelt',
  'history.column.actions': 'Aktionen',
  'history.row.someone': 'jemand',
  'history.row.select': '{name} auswählen',
  'history.row.open': 'Vorschau öffnen',
  'history.row.open.label': '{name} öffnen',
  'history.row.unavailable': 'Quelle war zu groß, um sie lokal zu behalten',
  'history.row.share': 'Teilen',
  'history.row.share.label': '{name} teilen',
  'history.row.download.label': '{name} herunterladen',
  'history.row.remove': 'Aus dem Verlauf entfernen',
  'history.row.stats.one': '{words} Wörter · {headings} Überschrift',
  'history.row.stats.many': '{words} Wörter · {headings} Überschriften',

  /*
   * Was die Liste sagt, wenn sie etwas getan hat — oder nicht konnte.
   *
   * `history.error.*` gehören `useHistory`: der Hook hat keine eigenen Worte, also gibt ihm der
   * Bildschirm ein `t` und er meldet in der Sprache des Lesers. Die Weigerung eines Servers wird
   * als `{reason}` eines dieser Sätze weitergegeben und nicht für sich gezeigt, denn sie kommt auf
   * Englisch an, was der Leser auch spricht — und `history.error.delete.reason` steht ein, wenn sie
   * nichts sagt.
   */
  'history.error.load': 'Der Verlauf ließ sich nicht laden',
  'history.error.save': 'Die Datei ließ sich nicht speichern',
  'history.error.delete': 'Löschen nicht möglich: {reason}',
  'history.error.delete.reason': 'Server hat abgelehnt',
  'history.error.delete.some':
    '{failed} von {total} Dateien ließen sich nicht löschen',
  'history.error.clear': 'Der Verlauf ließ sich nicht löschen',
  'history.source.missing': 'Die Quelle dieser Datei ist nicht mehr verfügbar',
  'history.download.done': 'Datei heruntergeladen',
  'history.download.none': 'Es ließ sich nichts herunterladen',
  'history.download.one': '{format}-Datei heruntergeladen',
  'history.download.many': '{count} {format}-Dateien heruntergeladen',
  'history.merge.none': 'Nichts zum Zusammenfügen',
  'history.merge.none.detail':
    'Die Quellen dieser Dateien sind nicht mehr verfügbar.',
  'history.removed.one': 'Datei entfernt',
  'history.removed.many': '{count} Dateien entfernt',
  'history.cleared': 'Verlauf gelöscht',

  /*
   * Die Blog-Übersicht. Die Artikel selbst stehen nicht im Katalog — siehe `content.ts` —, also
   * sind Titel, Beschreibung und Schlagwort einer Karte das Englische, in dem der Text geschrieben
   * wurde; nur das Beiwerk darum herum steht hier.
   */
  'blog.eyebrow': 'Blog',
  'blog.title': 'Markdown, und was man damit macht',
  'blog.blurb':
    'Umwandeln, Syntax, die bricht, Veröffentlichen, und wie das Ganze ohne einen selbst läuft.',
  'blog.chip.all': 'Alle',
  'blog.empty': 'Zu diesem Schlagwort gibt es noch nichts.',
  'blog.card.meta': '{date} · {minutes} Min. Lesezeit',

  /* Ein Artikel: das Beiwerk um Prosa, die englisch bleibt. */
  'article.toc': 'In diesem Artikel',
  'article.meta': '{date} · {minutes} Min. Lesezeit',
  'article.meta.updated':
    '{date} · aktualisiert {updated} · {minutes} Min. Lesezeit',
  'article.share': 'Teilen',
  'article.cta.text':
    'Diese Seite wurde in Markdown geschrieben und von dem Konverter gerendert, den sie beschreibt.',
  'article.cta.button': 'Datei umwandeln',
  'article.more.eyebrow': 'Weiter',
  'article.more.title': 'Weiterlesen',
  'article.more.meta': '{minutes} Min. Lesezeit',
  'article.missing.title': 'Diesen Artikel gibt es nicht',
  'article.missing.blurb':
    'Vielleicht wurde er umbenannt. In der Übersicht steht alles, was es gibt.',
  'article.missing.back': 'Zurück zum Blog',

  /*
   * Die fünf Seiten, die nur aus Worten bestehen. Ihr eigener Text steht in `pages.ts`, nach Seite
   * geschlüsselt; diese zwei sind, was der Renderer darum herum sagt.
   *
   * Die Schlusszeile ist geteilt, weil ein Link darin sitzt: `page.questions` ist der Satz bis zum
   * Link und `page.questions.link` sind die Worte, die der Anker trägt. Wer den Link weiter vorn im
   * Satz braucht, bekommt ihn hier nicht — das ist der Preis des Ankers.
   */
  'page.updated': 'Zuletzt aktualisiert {date}',
  'page.questions': 'Fragen dazu gehen an',
  'page.questions.link': 'die Issues des Repositorys',

  /*
   * Ein Dokument, das jemand Ihnen geschickt hat, unter /open/<token>.
   *
   * Der eigene Bildschirm der App, also folgt er der Sprache des Lesers wie jeder andere. Der Text,
   * den der Server unter /s/<token> ausliefert, ist eine andere Seite für einen Leser, über den wir
   * nichts wissen; seine Worte stehen nicht hier — siehe `src/lib/i18n/content.ts`.
   *
   * Ihr Download-Knopf und ihr Anmelde-Knopf sagen, was diese Knöpfe überall sonst sagen, lesen
   * also `converter.download` und `header.signin` statt eigener Schlüssel.
   */
  'shared.loading': 'Dokument wird geöffnet…',
  'shared.meta': 'geteilt · umgewandelt {date}',
  'shared.signin.title': 'Dieses Dokument wurde für bestimmte Personen geteilt',
  'shared.signin.detail':
    'Melden Sie sich mit der Adresse an, für die es geteilt wurde.',
  'shared.missing.title': 'Dieser Link öffnet kein Dokument',
  'shared.missing.action': 'Eigene Datei umwandeln',

  /* Ein Dokument teilen. */
  'dialog.share.title': 'Teilen',
  'dialog.share.mode.private': 'Privat',
  'dialog.share.mode.link': 'Alle mit dem Link',
  'dialog.share.mode.people': 'Bestimmte Personen',
  'dialog.share.private.note':
    'Nur Sie können dieses Dokument öffnen. Wählen Sie oben einen Modus, um es zu teilen.',
  'dialog.share.link': 'Link',
  'dialog.share.link.field': 'Freigabelink',
  'dialog.share.link.note':
    'Alle mit diesem Link können das Dokument lesen.',
  'dialog.share.people.note':
    'Nur die unten genannten Personen können es öffnen, nach der Anmeldung mit dieser Adresse. Jede erhält den Link per E-Mail, sobald Sie sie hinzufügen.',
  'dialog.share.people.empty':
    'Noch niemand — der Link öffnet sich nur für Sie.',
  'dialog.share.email.label': 'E-Mail des Empfängers',
  'dialog.share.add': 'Hinzufügen',
  'dialog.share.remove.label': '{email} entfernen',
  'dialog.share.error': 'Teilen fehlgeschlagen',

  /* API-Schlüssel und die Assistenten, die hereingelassen wurden. */
  'dialog.keys.title': 'API-Schlüssel',
  'dialog.keys.blurb':
    'Dokumente aus einem Skript, einem Terminal oder aus CI umwandeln und teilen — und die verbundenen Assistenten.',
  'dialog.keys.name.placeholder': 'Wofür er ist — „CI“, „mein Laptop“',
  'dialog.keys.name.label': 'Schlüsselname',
  'dialog.keys.create': 'Erstellen',
  'dialog.keys.create.error': 'Der Schlüssel ließ sich nicht erstellen',
  'dialog.keys.fresh': 'Jetzt kopieren — er wird nicht wieder angezeigt',
  'dialog.keys.empty':
    'Noch keine Schlüssel. Ein Schlüssel kann Ihre Dokumente lesen, schreiben und teilen — an das Konto und an diese Schlüssel kommt er nicht.',
  'dialog.keys.revoked': '{name} · widerrufen',
  'dialog.keys.meta': '{prefix}… · {used}',
  'dialog.keys.used': 'verwendet {when}',
  'dialog.keys.never': 'nie verwendet',
  'dialog.keys.forget': 'Aus der Liste entfernen',
  'dialog.keys.forget.label': '{name} entfernen',
  'dialog.keys.revoke': 'Widerrufen — wirkt sofort',
  'dialog.keys.revoke.label': '{name} widerrufen',
  'dialog.keys.grants': 'Verbundene Assistenten',
  'dialog.keys.grant.meta': 'verbunden {since} · {used}',
  'dialog.keys.disconnect':
    'Trennen — handelt sofort nicht mehr in Ihrem Namen',
  'dialog.keys.disconnect.label': '{name} trennen',

  /* Der Fuß der Seite. Die Spalte der Umwandlungen und die Rechtslinks holen ihre Worte anderswo. */
  'footer.tagline':
    'Markdown-, HTML-, Word-, CSV- und JSON-Dokumente, umgewandelt im Browser.',
  /*
   * The changelog page, at /changelog and linked from the footer's Resources.
   *
   * Only the chrome is here. The entries are `src/lib/changelog.ts`, in English, for the reason
   * `ChangelogPage` gives: a changelog grows by an entry per release, and five translations per
   * entry is a cost that gets skipped after the second one.
   */
  'changelog.eyebrow': 'Changelog',
  'changelog.title': 'Was ausgeliefert wurde',
  'changelog.lede':
    'Jede Version und die Änderungen darunter, die jemandem auffallen würden. Neueste zuerst; die Versionen sind die Tags im Repository.',
  'changelog.years': 'Nach Jahr',
  'changelog.seo.title': 'Changelog',
  'changelog.seo.description':
    'Jede Version von TransformPipe und die Änderungen darunter, neueste zuerst.',
  'footer.changelog': 'Changelog',

  /*
   * The page for an address that is not a page.
   *
   * `notfound.note` is the one line here that is not navigation: a reader who mistyped something
   * knows they did, and a reader who followed a link from these pages has found a defect and is
   * the only person who can say so.
   */
  'notfound.eyebrow': '404',
  'notfound.title': 'Diese Adresse ist keine Seite',
  'notfound.lede':
    'Auf dieser Website antwortet nichts darauf. Entweder ist ein Zeichen falsch, oder ein Link woanders zeigt auf etwas, das umgezogen ist.',
  'notfound.converter': 'Eine Datei konvertieren',
  'notfound.docs': 'Die Dokumentation lesen',
  'notfound.blog': 'Im Blog stöbern',
  'notfound.note':
    'Wenn ein Link auf dieser Website Sie hierher geschickt hat, ist das ein Fehler und kein Tippfehler.',
  'notfound.seo.title': 'Seite nicht gefunden',
  'notfound.seo.description':
    'Diese Adresse passt zu keiner Seite dieser Website. Der Konverter, die Dokumentation und der Blog sind einen Klick entfernt.',

  'footer.builtby': 'Gebaut von Raudar Labs.',
  'footer.note': '© Raudar Labs {year}',
  'footer.converter': 'Konverter',
  'footer.resources': 'Ressourcen',
  'footer.company': 'Unternehmen',
  'footer.legal': 'Rechtliches',
  'footer.docs': 'Dokumentation',
  'footer.blog': 'Blog',
  'footer.git': 'Git',
  /* Wird nach dem eigenen Namen des Links vorgelesen, beginnt also mit dem trennenden Leerzeichen. */
  'footer.external': ' (öffnet in einem neuen Tab)',
};
