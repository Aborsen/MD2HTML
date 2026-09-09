import type { Content } from '../../content';

/*
 * The documentation's sections in Italian: a title and the one sentence that says what the section
 * answers, keyed by the section's id.
 *
 * The ids and the order live in `src/lib/docs-sections.ts` — an id is the anchor in the address, so
 * it is the same in every language. The summary is read on its own in the prerendered page, so it
 * has to stand up without the section under it.
 */
export const docs: Content['docs'] = {
  start: {
    title: 'Per iniziare',
    summary:
      'Trascina un file e hai il documento convertito e il download; con l’accesso gli stessi documenti ti seguono tra i dispositivi, si possono condividere e si possono raggiungere da uno script.',
  },
  converting: {
    title: 'Conversione',
    summary:
      'Le cinque conversioni — da Markdown a HTML, e da HTML, Word, CSV e JSON a Markdown — cosa accetta ciascuna, la concatenazione di più file in un solo documento, la scheda del sorgente e i formati che il download può consegnare: Markdown, HTML, testo semplice o un PDF stampato.',
  },
  history: {
    title: 'Cronologia',
    summary:
      'Ricerca, colonne ordinabili e un filtro per ogni conversione, così un elenco misto si può ridurre a un tipo solo. Le righe si possono unire, scaricare in qualsiasi formato o eliminare in blocco.',
  },
  sharing: {
    title: 'Condivisione',
    summary:
      'Un link che chiunque può aprire, oppure indirizzi indicati per nome che chiedono al lettore di accedere. La revoca elimina il token, così un link già inviato smette di funzionare.',
  },
  account: {
    title: 'Account',
    summary:
      'Accesso con Google, il tema e le chiavi API: mostrate una volta sola, conservate come hash e incapaci di raggiungere l’account o le chiavi stesse.',
  },
  api: {
    title: 'API',
    summary:
      'Ogni endpoint sotto /api/v1, cosa restituisce ciascuno e cosa significano gli stati di errore.',
  },
  cli: {
    title: 'Riga di comando',
    summary:
      'Un client senza dipendenze: login, push, list, rm e usage, con --share, --merge e --json.',
  },
  action: {
    title: 'GitHub Action',
    summary:
      'Pubblica il Markdown che una pull request ha modificato e ne commenta i link. Ogni input, e i due permessi che le servono.',
  },
  assistant: {
    title: 'MCP',
    summary:
      'Aggiungi TransformPipe a Claude come connettore e potrà convertire, salvare, condividere ed eliminare documenti in questo account — autenticato come te, senza nessuna chiave da incollare.',
  },
  embed: {
    title: 'Soluzione integrata',
    summary:
      'Incorpora il convertitore nella tua interfaccia con /embed. Il file viene convertito nel browser del visitatore e non raggiunge nessun server, né il tuo né il nostro; il risultato esce con postMessage.',
  },
  limits: {
    title: 'Limiti',
    summary:
      '10 MB per file da convertire e 4 MB per conservarne uno in un account, 100 MB e 500 documenti per account, 60 richieste al minuto. Raggiungerne uno rifiuta la scrittura invece di eliminare qualcosa.',
  },
  faq: {
    title: 'Domande',
    summary:
      'Le stesse risposte che il convertitore mostra sotto la sua area di trascinamento, tenute in un posto solo così le due non possono divergere.',
  },
};
