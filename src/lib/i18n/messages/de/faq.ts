import type { Content } from '../../content';

/*
 * Die FAQ auf Deutsch: eine Frage und ihre Antwort je Eintrag.
 *
 * Die Reihenfolge ist die, die `FAQ_ENTRIES` in `src/lib/faq.ts` festlegt, und die Position ist es,
 * was einen Eintrag hier an seine Flag dort bindet — eine Frage hat keine id, also ist die Liste
 * die id. Ein Eintrag, der hier hinzukommt oder verschoben wird, muss dort und in jedem anderen
 * Locale an derselben Position hinzukommen oder verschoben werden.
 *
 * Reine Strings, keine Nodes: dasselbe Array liest der Server, in dem kein React steckt.
 */
export const faq: Content['faq'] = [
  {
    question: 'Was kann umgewandelt werden?',
    answer:
      'Fünf Dinge, jedes mit seiner eigenen Seite unter Konverter in der Kopfzeile: Markdown in HTML, und HTML, Word (.docx), CSV oder TSV und JSON in Markdown. Alles außer dem Ersten endet als Markdown, und als Markdown wird ein Dokument hier gespeichert, in der Vorschau gezeigt und geteilt — eine Word-Datei, eine Tabelle und eine API-Antwort werden also dieselbe Art von Ding, sobald sie drin sind.',
  },
  {
    question: 'Wird meine Datei irgendwohin hochgeladen?',
    answer:
      'Abgemeldet nein. Die Datei wird von diesem Browser gelesen, hier umgewandelt und nie an einen Server gesendet — den Tab schließen, und von ihr bleibt nirgends etwas außer auf dem eigenen Rechner. Angemeldet wird der Markdown-Quelltext im Konto gespeichert, damit das Dokument einem auf ein anderes Gerät folgen kann, und es bleibt privat, bis es geteilt wird.',
  },
  {
    question: 'Welches Markdown wird verstanden?',
    answer:
      'GitHub Flavored Markdown, in beide Richtungen: Tabellen, Aufgabenlisten, Durchstreichung, Autolinks und umzäunte Codeblöcke, zusätzlich zu allem, was CommonMark festlegt. Rohes HTML im Dokument läuft zuerst durch einen Sanitizer, sodass ein script-Tag in einer zugeschickten Datei nicht laufen kann.',
  },
  {
    question: 'Was genau bekomme ich beim Herunterladen?',
    answer:
      'Zuerst das, was die Umwandlung erzeugt hat: eine .html-Datei, wenn nach HTML umgewandelt wurde, eine .md-Datei, wenn nach Markdown. Der Pfeil neben der Schaltfläche hält die anderen — Markdown, HTML, reinen Text oder den Druckdialog für ein PDF. Das HTML ist eine Datei mit ihren Stilen inline: keine Skripte, keine Schriften zu holen, keine Anfragen irgendeiner Art, sodass es sich auf einem Rechner ohne Netz genauso öffnet. Auf Papier schaltet es immer auf die helle Palette, denn eine dunkle Seite im Druck ist eine Wand aus Tinte.',
  },
  {
    question: 'Kann ich ein umgewandeltes Dokument jemandem schicken?',
    answer:
      'Anmelden und teilen, entweder als Link, den jeder öffnen kann, oder an bestimmte Personen gerichtet, die sich dann mit dieser Adresse anmelden. Eine geteilte Seite ist nur zum Lesen: das Dokument und ein Download, sonst nichts. Ein Widerruf verwirft den Link, ein schon verschickter hört also auf zu funktionieren.',
  },
  {
    question: 'Gibt es eine Größengrenze?',
    answer:
      'Zum Umwandeln 10 MB je Datei — rund 1.5 Millionen Wörter —, weil die Umwandlung auf dem eigenen Rechner geschieht. Eines im Konto zu behalten ist auf 4 MB begrenzt, und das ist nicht unsere Zahl: die Plattform weist eine größere Anfrage von vornherein ab. Eine größere Datei wandelt trotzdem um, zeigt eine Vorschau und lädt herunter; sie bleibt nur aus dem Verlauf heraus, und die App sagt das, statt eine Speicherung vorzutäuschen. Ein Konto hält 500 Dokumente oder 100 MB, je nachdem, was zuerst kommt. Eine erreichte Grenze weist den Schreibvorgang ab und sagt es; nichts Gespeichertes wird je still gelöscht, um Platz zu machen.',
  },
  {
    question: 'Kann ich Dateien aus einem Skript umwandeln?',
    answer:
      'Ja. Im Kontomenü einen API-Schlüssel erstellen und Markdown an /api/v1/documents senden; es gibt außerdem einen Kommandozeilen-Client und eine GitHub Action, die das von einem Pull Request geänderte Markdown veröffentlicht und die Links darunter kommentiert. Die Dokumentation hat die Endpunkte und die Flags.',
  },
  {
    question: 'Was kostet es?',
    answer:
      'Nichts. Umwandeln und Herunterladen gehen ganz ohne Konto; ein Konto ergänzt Verlauf, Teilen und die API, innerhalb der Grenzen oben.',
  },
];
