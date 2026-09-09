import type { Content } from '../../content';

/*
 * Die Worte der fünf Seiten, die nur aus Worten bestehen: Über, Kontakt und die drei rechtlichen.
 *
 * `src/lib/pages.ts` hält, was eine Seite *ist* — ihre id, ihre Adresse und das Datum, das die
 * drei rechtlichen nennen —, und diese Datei hält, was eine Seite *sagt*. Aus demselben Grund, aus
 * dem die Trennung hier überall besteht: ein Pfad ist in fünf Sprachen derselbe, ein Absatz nicht,
 * also kann eine Übersetzung, die einen Satz ändert, keine Route zerstören.
 *
 * Geschlüsselt nach `StaticPageId`, sodass eine Seite, die der Union ohne ihre Worte hinzugefügt
 * wird, den Build stoppt, statt einen leeren Bildschirm zu rendern. Reine Strings statt React: der
 * Prerenderer läuft in Node ohne React, und diese Seiten sind die, die ein Crawler vollständig
 * liest.
 *
 * Die drei rechtlichen sind Richtlinien. Sie hierher zu verschieben hat kein Wort an ihnen
 * geändert, und sie zu übersetzen ist Arbeit für jemanden, der sagen kann, was sie in der anderen
 * Sprache bedeuten — keine Umschreibung.
 */

export const pages: Content['pages'] = {
  about: {
    label: 'Über',
    title: 'Über transformpipe',
    lede: 'Ein Konverter, der die Arbeit im Browser tut und sonst nicht im Weg steht.',
    sections: [
      {
        heading: 'Was es ist',
        body: [
          'transformpipe macht aus Dokumenten andere Dokumente. Markdown zu einer fertigen HTML-Seite, und HTML, Word-Dateien, Tabellen und JSON zu Markdown. Eine Datei ablegen, sehen, was daraus wurde, und sie als Markdown, HTML, reinen Text oder PDF mitnehmen.',
          'Alles wird auf Markdown normalisiert, denn Markdown ist ein Format, das man lesen, im Diff vergleichen und zwanzig Jahre aufbewahren kann, ohne das Werkzeug zu besitzen, das es gemacht hat.',
        ],
      },
      {
        heading: 'Warum es so funktioniert',
        body: [
          'Die Umwandlung läuft im Browser. Abgemeldet wird keine Datei irgendwohin gesendet — es gibt keinen Upload, dem man vertrauen müsste, weil es keinen Upload gibt. Angemeldet liegt das Markdown im Konto, sodass ein Dokument einem auf einen anderen Rechner folgt, und es bleibt privat, bis es geteilt wird.',
          'Das exportierte HTML ist eine Datei mit ihren Stilen inline. Sie verlangt nichts vom Netz, was heißt: sie öffnet sich in fünf Jahren auf einem Laptop ohne Verbindung genauso wie heute.',
        ],
      },
      {
        heading: 'Jenseits der App',
        body: [
          'Dieselben Umwandlungen sind aus einem Terminal, aus einem Pull Request und aus einem Assistenten erreichbar: es gibt eine öffentliche API, einen abhängigkeitsfreien Kommandozeilen-Client, eine GitHub Action, die das von einem Pull Request geänderte Markdown veröffentlicht, und einen MCP-Server, damit ein Modell Dokumente in Ihrem Namen umwandeln und teilen kann. Die Dokumentation deckt das alles ab.',
        ],
      },
      {
        heading: 'Wer es baut',
        body: [
          'transformpipe wird von Raudar Labs gebaut.',
        ],
      },
    ],
    seo: {
      title: 'Über transformpipe',
      description:
        'transformpipe wandelt Markdown-, HTML-, Word-, CSV- und JSON-Dokumente im Browser um — mit API, CLI, GitHub Action und MCP-Server. Gebaut von Raudar Labs.',
    },
  },
  contact: {
    label: 'Kontakt',
    title: 'Kontakt',
    lede: 'Ein Fehler, ein Format, das fehlt, oder etwas, das nicht veröffentlicht sein sollte.',
    sections: [
      {
        heading: 'Fehler und Wünsche',
        body: [
          'Ein Issue im Repository eröffnen. Eine Datei, die falsch umgewandelt wurde, ist das Nützlichste, was man schicken kann — anhängen, wenn sie weitergegeben werden darf, und dazusagen, was stattdessen erwartet wurde.',
          'Ein Format, das noch nicht umgewandelt wird, ist ein Wunsch, der sich lohnt. Mehrere der hier vorhandenen haben so angefangen.',
        ],
      },
      {
        heading: 'Etwas Geteiltes, das es nicht sein sollte',
        body: [
          'Jedes geteilte Dokument trägt am Fuß der Seite, die es öffnet, einen Link „Dieses Dokument melden“. Dieser Link ist der schnellste Weg: er benennt das Dokument, ohne dass man es beschreiben muss.',
        ],
      },
      {
        heading: 'Datenschutz und Rechtliches',
        body: [
          'Fragen dazu, was gespeichert wird, oder die Bitte, ein Konto samt allem darin zu löschen, gehen an dieselbe Stelle. Angemeldet lässt sich auch jedes Dokument selbst löschen — das entfernt die Zeile und die gespeicherte Quelle zusammen.',
        ],
      },
    ],
    seo: {
      title: 'transformpipe kontaktieren',
      description:
        'Einen Fehler melden, ein Format wünschen, ein geteiltes Dokument melden oder fragen, was gespeichert wird — und es löschen lassen.',
    },
  },
  privacy: {
    label: 'Datenschutz',
    title: 'Datenschutz',
    lede: 'Was gespeichert wird, wo, und was überhaupt nie erhoben wird.',
    sections: [
      {
        heading: 'Abgemeldet erreicht uns nichts',
        body: [
          'Die Umwandlung geschieht im Browser. Die Datei wird auf dem eigenen Rechner gelesen, umgewandelt und gerendert, und kein Teil davon wird an einen Server gesendet. Der Verlauf, der zu sehen ist, ist der Speicher des Browsers, kein Konto.',
        ],
      },
      {
        heading: 'Angemeldet so viel und nicht mehr',
        body: [
          'Ein Konto besteht, damit Dokumente einem von Gerät zu Gerät folgen und geteilt werden können. Es enthält:',
        ],
        items: [
          'Ihre Identität von Google, über unseren Authentifizierungsanbieter: eine E-Mail-Adresse, einen Namen und eine Konto-id. Ein Passwort sehen und speichern wir nie.',
          'Zu jedem behaltenen Dokument: seinen Namen, welche Umwandlung es gemacht hat, seine Größe, die Zahl der Wörter, Überschriften, Links, Codeblöcke, Tabellen und Bilder und den Zeitpunkt seiner Erstellung.',
          'Das Markdown selbst, in einem privaten Blob-Speicher — privat heißt: er hat keine öffentliche URL und wird nur über eine Anfrage gelesen, die wir autorisieren.',
          'API-Schlüssel als Hashes, nie den Schlüssel. Ein Schlüssel wird einmal gezeigt, bei der Erstellung, und ist danach nicht wiederherstellbar — nicht durch Sie und nicht durch uns.',
          'Freigabe-Einstellungen: ob ein Dokument privat, per Link offen oder an bestimmte E-Mail-Adressen gerichtet ist, und das Token, das ein Link trägt.',
        ],
      },
      {
        heading: 'Was wir nicht tun',
        body: [
          'Es gibt auf dieser Seite keine Analyse, keine Werbung, kein Tracking-Pixel und kein Skript von Dritten — nicht einen reduzierten Satz, keines. Nichts wird verkauft, und nichts wird mit irgendjemandem geteilt außer mit der Infrastruktur, die den Dienst betreibt: der Datenbank, dem Blob-Speicher, dem Authentifizierungsanbieter und dem Hoster.',
          'Ihre Dokumente werden von uns nicht gelesen, und sie werden nicht dazu benutzt, irgendetwas zu trainieren.',
        ],
      },
      {
        heading: 'Cookies und Browser-Speicher',
        body: [
          'Ein Sitzungscookie, gesetzt von unserem Authentifizierungsanbieter bei der Anmeldung, First-Party und HttpOnly. Ein kurzlebiges Cookie besteht während des Hin und Her der Anmeldung und läuft nach zehn Minuten ab. Das sind alle — es gibt nichts Optionales zum Abschalten. Die Cookie-Seite hat die Einzelheiten.',
          'Ihr Design und, abgemeldet, Ihr Verlauf liegen im lokalen Speicher Ihres Browsers. Sie verlassen ihn nie.',
        ],
      },
      {
        heading: 'Dinge löschen',
        body: [
          'Ein Dokument zu löschen löscht die Zeile und das gespeicherte Markdown zusammen, sofort, nicht nach einem Zeitplan. Ein Widerruf einer Freigabe verwirft das Token, ein schon verschickter Link hört also auf zu funktionieren.',
          'Um ein Konto samt allem darin zu entfernen, fragen Sie nach — siehe die Kontaktseite. Eine erreichte Speichergrenze weist den Schreibvorgang ab; sie löscht nie etwas, das Sie behalten wollten, um Platz zu machen.',
        ],
      },
      {
        heading: 'Kinder',
        body: [
          'Das ist ein Werkzeug für die Arbeit, kein Dienst für Kinder, und es richtet sich an niemanden unter 16.',
        ],
      },
      {
        heading: 'Änderungen',
        body: [
          'Ändert sich diese Seite in einer Weise, die betrifft, was erhoben wird, ändert sich das Datum darüber mit.',
        ],
      },
    ],
    seo: {
      title: 'Datenschutz — transformpipe',
      description:
        'Abgemeldet verlässt keine Datei den Browser. Angemeldet speichern wir Dokument, Metadaten und Google-Identität — keine Analyse, kein Tracking, keine Fremdskripte.',
    },
  },
  terms: {
    label: 'Bedingungen',
    title: 'Nutzungsbedingungen',
    lede: 'Die kurze Fassung, weil eine lange nicht gelesen würde.',
    sections: [
      {
        heading: 'Den Dienst nutzen',
        body: [
          'transformpipe wird kostenlos angeboten, so wie es ist. Nutzen Sie es für alles, was Sie umzuwandeln berechtigt sind, aus der App, der API, der Kommandozeile oder einem Assistenten.',
          'Ein Konto gehört Ihnen, zum Behalten oder Löschen. Sie sind verantwortlich für das, was Sie mit einem API-Schlüssel tun, behandeln Sie einen also wie ein Passwort: wer ihn hat, kann Ihre Dokumente lesen und schreiben.',
        ],
      },
      {
        heading: 'Ihre Dokumente bleiben Ihre',
        body: [
          'Sie behalten an einem Dokument jedes Recht, das Sie vor der Umwandlung daran hatten. Wir beanspruchen kein Eigentum und keine Lizenz über das hinaus, was der Betrieb des Dienstes verlangt: es zu speichern, damit Sie es wieder öffnen können, und es dem auszuliefern, mit dem Sie es bewusst geteilt haben.',
        ],
      },
      {
        heading: 'Was hier nicht hingehört',
        body: [
          'Nutzen Sie den Dienst nicht für Inhalte, die rechtswidrig sind, zu deren Verbreitung Sie nicht berechtigt sind oder die dazu da sind, jemandem zu schaden — Schadsoftware, Material, das Kinder sexuell ausbeutet, gezielte Belästigung. Nutzen Sie keinen Freigabelink, um eine Phishing-Seite zu betreiben.',
          'Geteilte Dokumente können von jedem gemeldet werden, der sie öffnet. Ein Dokument, das gegen diesen Abschnitt verstößt, kann zurückgezogen oder gelöscht werden, und ein wiederholt auffälliges Konto geschlossen.',
        ],
      },
      {
        heading: 'Grenzen und Verfügbarkeit',
        body: [
          'Es gelten Grenzen für Rate und Speicher, und sie sind in der Dokumentation veröffentlicht. Sie bestehen, um den Dienst am Laufen zu halten, und können sich ändern.',
          'Es gibt kein Verfügbarkeitsversprechen. Der Dienst kann unterbrochen werden, und Funktionen können sich ändern oder wegfallen. Behalten Sie von allem, was Sie nicht verlieren dürfen, eine eigene Kopie — genau dafür gibt es den Download, und zum Öffnen braucht er nichts von uns.',
        ],
      },
      {
        heading: 'Keine Garantie, und die Grenze unserer Haftung',
        body: [
          'Der Dienst wird ohne jede Gewährleistung bereitgestellt, ausdrücklich oder stillschweigend. Soweit das Gesetz es zulässt, haftet Raudar Labs nicht für verlorene Daten, entgangenen Gewinn oder mittelbare Schäden und Folgeschäden aus der Nutzung.',
          'Nichts hier begrenzt ein Recht, das Sie haben und das durch Vereinbarung nicht begrenzt werden kann.',
        ],
      },
      {
        heading: 'Änderungen und Beenden',
        body: [
          'Diese Bedingungen können sich ändern; das Datum darüber sagt, wann sie es zuletzt getan haben, und die weitere Nutzung des Dienstes ist ihre Annahme. Sie können jederzeit aufhören, indem Sie Ihre Dokumente und Ihr Konto löschen.',
        ],
      },
    ],
    seo: {
      title: 'Nutzungsbedingungen — transformpipe',
      description:
        'transformpipe ist kostenlos und wird so bereitgestellt, wie es ist. Die Dokumente bleiben Ihre, die Grenzen sind veröffentlicht, eine Garantie gibt es nicht.',
    },
  },
  cookies: {
    label: 'Cookies',
    title: 'Cookies',
    lede: 'Es sind zwei, beide zum Anmelden nötig, und es gibt nichts einzustellen.',
    sections: [
      {
        heading: 'Nichts zum Abschalten',
        body: [
          'Die meisten Cookie-Seiten bestehen, damit man Analyse und Werbung ablehnen kann. Diese Seite hat weder das eine noch das andere, also hat sie keine Schalter — Ablehnen ist die einzige Einstellung, und so arbeitet die Seite bereits.',
          'Abgemeldet setzt diese Seite überhaupt keine Cookies.',
        ],
      },
      {
        heading: 'Die zwei, die es gibt',
        body: [
          'Beide werden von unserem Authentifizierungsanbieter gesetzt, sind First-Party und als HttpOnly und Secure markiert — ein Skript auf der Seite kann sie nicht lesen:',
        ],
        items: [
          '__Secure-neon-auth.session_token — hält Sie angemeldet. Ohne es würde jeder Seitenaufruf erneut eine Anmeldung verlangen. Es geht, wenn Sie sich abmelden.',
          '__Secure-neon-auth.session_challenge — besteht für die zehn Minuten des Hin und Her einer Anmeldung, damit die Antwort von Google der Anfrage zugeordnet werden kann, die sie ausgelöst hat. Es ist das, was verhindert, dass die Anmeldung eines anderen in Ihrer Sitzung landet.',
        ],
      },
      {
        heading: 'Browser-Speicher, der kein Cookie ist',
        body: [
          'Zwei Dinge liegen im lokalen Speicher Ihres Browsers und werden nie irgendwohin gesendet: das gewählte Design und — solange Sie abgemeldet sind — Ihre letzten Umwandlungen, damit im Verlauf etwas steht. Das Löschen der Websitedaten im Browser entfernt beides, und die App läuft ohne sie weiter.',
        ],
      },
      {
        heading: 'Wenn sich das ändert',
        body: [
          'Sollte je etwas Optionales hinzukommen, bekommt diese Seite eine echte Steuerung, bevor es gesetzt wird, nicht danach. Das Datum darüber wird sagen, wann.',
        ],
      },
    ],
    seo: {
      title: 'Cookies — transformpipe',
      description:
        'Zwei First-Party-Sitzungscookies, beide zum Anmelden nötig. Keine Analyse, keine Werbung, nichts Optionales zum Einstellen.',
    },
  },
};
