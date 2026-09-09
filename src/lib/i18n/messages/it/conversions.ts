import type { Content } from '../../content';

/*
 * What each conversion is called in Italian, and what its page says.
 *
 * `seo` is not a translation of the English sentence: it is written around the phrase an Italian
 * reader actually types — "convertire markdown in html", "convertire word in markdown", "da csv a
 * tabella markdown" — while making the same promise the English makes and no other.
 */

export const conversions: Content['conversions'] = {
  'markdown-to-html': {
    label: 'Markdown → HTML',
    short: 'MD → HTML',
    title: 'Da Markdown a HTML',
    blurb:
      'Carica un file Markdown: l’HTML reso si vede subito e si scarica come documento pronto all’uso.',
    hint: 'Carica un file .md e vedi esattamente come apparirà in HTML. Trascinandone più di uno, vengono concatenati in un unico documento, nell’ordine in cui li scegli.',
    seo: {
      title: 'Convertire Markdown in HTML — transformpipe',
      description:
        'Converti Markdown in HTML nel browser: il documento reso e un .html autosufficiente da scaricare. Con l’accesso: cronologia, condivisione e pubblicazione.',
    },
  },
  'html-to-markdown': {
    label: 'HTML → Markdown',
    short: 'HTML → MD',
    title: 'Da HTML a Markdown',
    blurb:
      'Carica un file HTML — o una pagina salvata — e riavrai Markdown, con titoli, link, elenchi e tabelle intatti.',
    hint: 'Carica un file .html e ottieni Markdown. Tabelle, elenchi di attività e blocchi di codice sopravvivono; lo stile no, perché il Markdown non ne ha.',
    seo: {
      title: 'Convertire HTML in Markdown — transformpipe',
      description:
        'Trasforma un file HTML o una pagina salvata in Markdown pulito, tabelle e blocchi di codice compresi. Converte nel browser: il file non viene mai inviato.',
    },
  },
  'word-to-markdown': {
    label: 'Word → Markdown',
    short: 'DOCX → MD',
    title: 'Da Word a Markdown',
    blurb:
      'Carica un .docx e ottieni Markdown: titoli, elenchi, link e tabelle arrivano, i caratteri e i margini no.',
    hint: 'Carica un .docx da Word, Google Docs o LibreOffice. Quello che torna è la struttura del documento in Markdown, non il suo impaginato.',
    seo: {
      title: 'Convertire Word (.docx) in Markdown — transformpipe',
      description:
        'Converti un documento Word in Markdown nel browser: titoli, elenchi, link e tabelle restano, la formattazione no. Niente viene caricato online.',
    },
  },
  'csv-to-markdown': {
    label: 'CSV → tabella Markdown',
    short: 'CSV → MD',
    title: 'Da CSV a tabella Markdown',
    blurb:
      'Carica un CSV o un TSV e ottieni una tabella Markdown, con la prima riga come intestazione e le colonne allineate.',
    hint: 'Carica un .csv o un .tsv. Campi tra virgolette, virgole al loro interno e interruzioni di riga dentro le celle sono tutti gestiti.',
    seo: {
      title: 'Da CSV a tabella Markdown — transformpipe',
      description:
        'Trasforma un file CSV o TSV in una tabella Markdown, con campi tra virgolette e virgole gestiti. Converte nel browser: niente viene caricato online.',
    },
  },
  'json-to-markdown': {
    label: 'JSON → Markdown',
    short: 'JSON → MD',
    title: 'Da JSON a Markdown',
    blurb:
      'Carica un file JSON e leggilo come un documento: un elenco di record diventa una tabella, un oggetto diventa sezioni con i suoi campi in testa.',
    hint: 'Carica un file .json. Un elenco di record diventa una tabella; gli oggetti annidati diventano titoli. Anche un valore per riga — l’export di un log — viene capito.',
    seo: {
      title: 'Da JSON a Markdown — transformpipe',
      description:
        'Trasforma un file JSON in Markdown leggibile: gli array di record diventano tabelle, gli oggetti diventano sezioni. Converte nel browser, senza caricare nulla.',
    },
  },
};
