import type { Content } from '../../content';

/*
 * Die Abschnitte der Dokumentation auf Deutsch: ein Titel und der eine Satz, der sagt, was der
 * Abschnitt beantwortet, geschlüsselt nach der id des Abschnitts.
 *
 * Die ids und die Reihenfolge stehen in `src/lib/docs-sections.ts`, denn eine id ist der Anker in
 * der Adresse — `/docs#converting` — und eine Adresse ist in jeder Sprache dieselbe. Jede id in
 * jener Liste braucht hier einen Schlüssel, und in jedem anderen Locale.
 *
 * Die Zusammenfassung wird in der vorgerenderten Seite für sich gelesen, sie muss also ohne den
 * Abschnitt darunter tragen.
 */
export const docs: Content['docs'] = {
  start: {
    title: 'Hier anfangen',
    summary:
      'Eine Datei ablegen, und das umgewandelte Dokument und ein Download liegen bereit; anmelden, und dieselben Dokumente folgen einem von Gerät zu Gerät, lassen sich teilen und sind aus einem Skript erreichbar.',
  },
  converting: {
    title: 'Umwandeln',
    summary:
      'Die fünf Umwandlungen — Markdown in HTML, und HTML, Word, CSV und JSON in Markdown —, was jede annimmt, das Verketten mehrerer Dateien zu einem Dokument, der Quelltext-Reiter und die Formate, die ein Download herausgeben kann: Markdown, HTML, reiner Text oder ein gedrucktes PDF.',
  },
  history: {
    title: 'Verlauf',
    summary:
      'Suche, sortierbare Spalten und ein Chip je Umwandlung, damit eine gemischte Liste auf eine Art eingeengt werden kann. Zeilen lassen sich zusammenfügen, in jedem Format herunterladen oder in einem Zug löschen.',
  },
  sharing: {
    title: 'Teilen',
    summary:
      'Ein Link, den jeder öffnen kann, oder benannte Adressen, die vom Leser eine Anmeldung verlangen. Ein Widerruf verwirft das Token, ein schon verschickter Link hört also auf zu funktionieren.',
  },
  account: {
    title: 'Konto',
    summary:
      'Anmeldung mit Google, das Design und API-Schlüssel — einmal gezeigt, als Hash gespeichert und außerstande, das Konto oder die Schlüssel selbst zu erreichen.',
  },
  api: {
    title: 'API',
    summary:
      'Jeder Endpunkt unter /api/v1, was jeder zurückgibt und was die Fehlerstatus bedeuten.',
  },
  cli: {
    title: 'Kommandozeile',
    summary:
      'Ein abhängigkeitsfreier Client: login, push, list, rm und usage, mit --share, --merge und --json.',
  },
  action: {
    title: 'GitHub Action',
    summary:
      'Veröffentlicht das von einem Pull Request geänderte Markdown und kommentiert die Links darunter. Jede Eingabe und die zwei Berechtigungen, die sie braucht.',
  },
  assistant: {
    title: 'MCP',
    summary:
      'TransformPipe als Connector zu Claude hinzufügen, und er kann Dokumente in diesem Konto umwandeln, speichern, teilen und löschen — angemeldet als Sie, ohne einen Schlüssel zum Einfügen.',
  },
  embed: {
    title: 'Eingebettete Lösung',
    summary:
      'Den Konverter mit /embed in die eigene Oberfläche einbetten. Die Datei wird im Browser des Besuchers umgewandelt und erreicht keinen Server, weder Ihren noch unseren; das Ergebnis kommt per postMessage heraus.',
  },
  limits: {
    title: 'Grenzen',
    summary:
      'Zum Umwandeln 10 MB je Datei und zum Behalten im Konto 4 MB, 100 MB und 500 Dokumente je Konto, 60 Anfragen je Minute. Eine erreichte Grenze weist den Schreibvorgang ab, statt etwas zu löschen.',
  },
  faq: {
    title: 'Fragen',
    summary:
      'Dieselben Antworten, die der Konverter unter seiner Ablagefläche zeigt, an einer Stelle gehalten, damit die zwei nicht auseinanderlaufen können.',
  },
};
