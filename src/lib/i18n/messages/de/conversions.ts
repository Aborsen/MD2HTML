import type { Content } from '../../content';

/*
 * Wie jede Umwandlung heißt und was ihre Seite sagt.
 *
 * Welche Umwandlungen es gibt, steht weiterhin in `shared/conversions.ts` und muss dort stehen:
 * der Server importiert diese Datei für den Parameter `kind` der API, und der Server hat kein
 * Locale, eine Liste, die er liest, kann also keine Sprache tragen. Dort bleibt nur, was in jeder
 * Sprache gleich ist — die id, das Ziel, die Adresse, die Endungen. Alles, was ein Leser wirklich
 * sieht, steht hier, geschlüsselt nach derselben `ConversionId`, sodass eine fünfte Sprache eine
 * sechste Datei ist und nicht eine sechste Kopie der Liste.
 *
 * `seo` ist, was die vorgerenderte Seite einem Crawler und in einem Suchergebnis sagt — darum
 * Worte und nicht Identität: die Adresse, an der es steht, ist fest, der Satz an dieser Adresse
 * nicht.
 */

export const conversions: Content['conversions'] = {
  'markdown-to-html': {
    label: 'Markdown → HTML',
    short: 'MD → HTML',
    title: 'Markdown in HTML',
    blurb:
      'Eine Markdown-Datei hochladen — das gerenderte HTML sofort sehen und als fertiges Dokument herunterladen.',
    hint: 'Eine .md-Datei hochladen und genau sehen, wie sie in HTML aussehen wird. Mehrere zugleich ablegen, und sie werden in der gewählten Reihenfolge zu einem Dokument verkettet.',
    seo: {
      title: 'TransformPipe — Markdown in HTML umwandeln',
      description:
        'Markdown in HTML umwandeln: gerendertes Dokument und eigenständige .html zum Download. Läuft im Browser; angemeldet speichern, teilen, veröffentlichen.',
    },
  },
  'html-to-markdown': {
    label: 'HTML → Markdown',
    short: 'HTML → MD',
    title: 'HTML in Markdown',
    blurb:
      'Eine HTML-Datei hochladen — oder eine gespeicherte Seite — und Markdown zurückbekommen, mit Überschriften, Links, Listen und Tabellen intakt.',
    hint: 'Eine .html-Datei hochladen und Markdown bekommen. Tabellen, Aufgabenlisten und Codeblöcke überleben; die Gestaltung nicht, denn Markdown hat keine.',
    seo: {
      title: 'HTML in Markdown umwandeln — TransformPipe',
      description:
        'HTML in Markdown umwandeln: aus einer HTML-Datei oder gespeicherten Seite wird sauberes Markdown, mit Tabellen und Codeblöcken. Im Browser, nichts wird gesendet.',
    },
  },
  'word-to-markdown': {
    label: 'Word → Markdown',
    short: 'DOCX → MD',
    title: 'Word in Markdown',
    blurb:
      'Eine .docx hochladen und Markdown bekommen: Überschriften, Listen, Links und Tabellen kommen mit, Schriften und Ränder nicht.',
    hint: 'Eine .docx aus Word, Google Docs oder LibreOffice hochladen. Zurück kommt die Struktur des Dokuments als Markdown — nicht sein Layout.',
    seo: {
      title: 'Word (.docx) in Markdown umwandeln — TransformPipe',
      description:
        'Word in Markdown umwandeln, direkt im Browser: Überschriften, Listen, Links und Tabellen bleiben, die Formatierung nicht. Es wird nichts hochgeladen.',
    },
  },
  'csv-to-markdown': {
    label: 'CSV → Markdown-Tabelle',
    short: 'CSV → MD',
    title: 'CSV in eine Markdown-Tabelle',
    blurb:
      'Eine CSV oder TSV hochladen und eine Markdown-Tabelle bekommen, mit der ersten Zeile als Kopf und ausgerichteten Spalten.',
    hint: 'Eine .csv oder .tsv hochladen. Felder in Anführungszeichen, Kommas darin und Zeilenumbrüche in Zellen werden alle beherrscht.',
    seo: {
      title: 'CSV in Markdown-Tabelle umwandeln — TransformPipe',
      description:
        'Eine CSV- oder TSV-Datei in eine Markdown-Tabelle umwandeln, mit Feldern in Anführungszeichen und Kommas darin. Läuft im Browser; nichts wird hochgeladen.',
    },
  },
  'json-to-markdown': {
    label: 'JSON → Markdown',
    short: 'JSON → MD',
    title: 'JSON in Markdown',
    blurb:
      'Eine JSON-Datei hochladen und als Dokument lesen: eine Liste von Datensätzen wird eine Tabelle, ein Objekt wird zu Abschnitten mit seinen Feldern darüber.',
    hint: 'Eine .json-Datei hochladen. Eine Liste von Datensätzen wird eine Tabelle, verschachtelte Objekte werden Überschriften. Ein Wert je Zeile — ein Log-Export — wird ebenfalls verstanden.',
    seo: {
      title: 'JSON in Markdown umwandeln — TransformPipe',
      description:
        'JSON in lesbares Markdown umwandeln: Arrays von Datensätzen werden Tabellen, Objekte werden Abschnitte. Läuft im Browser; nichts wird hochgeladen.',
    },
  },
};
