import type { Content } from '../../content';

/*
 * The FAQ in Italian: one question and its answer per entry.
 *
 * The order is the order `FAQ_ENTRIES` in `src/lib/faq.ts` declares, and position is what ties an
 * entry here to its flag there — so nothing may be added, dropped or moved.
 *
 * Plain strings, not nodes: the same array is read by the server, which has no React in it.
 */
export const faq: Content['faq'] = [
  {
    question: 'Cosa può convertire?',
    answer:
      'Cinque cose, ognuna con la sua pagina sotto Convertitore nell’intestazione: da Markdown a HTML, e da HTML, Word (.docx), CSV o TSV e JSON a Markdown. Tutto tranne la prima finisce come Markdown, che è la forma in cui qui un documento viene conservato, mostrato in anteprima e condiviso — così un file Word, un foglio di calcolo e una risposta di API diventano la stessa cosa una volta entrati.',
  },
  {
    question: 'Il mio file viene caricato da qualche parte?',
    answer:
      'Senza accesso, no. Il file viene letto da questo browser, convertito qui e mai inviato a un server: chiudendo la scheda non ne resta niente da nessuna parte, se non sulla tua macchina. Con l’accesso, il sorgente Markdown viene conservato nel tuo account così il documento può seguirti su un altro dispositivo, e resta privato fino a quando non lo condividi.',
  },
  {
    question: 'Quale Markdown capisce?',
    answer:
      'GitHub Flavored Markdown, in entrambe le direzioni: tabelle, elenchi di attività, testo barrato, link automatici e blocchi di codice recintati, oltre a tutto quello che definisce CommonMark. L’HTML grezzo dentro il documento passa prima da un sanificatore, così un tag script in un file che qualcuno ti ha mandato non può essere eseguito.',
  },
  {
    question: 'Cosa si ottiene esattamente scaricando?',
    answer:
      'Prima di tutto quello che la conversione ha prodotto: un file .html se la conversione era verso HTML, un file .md se era verso Markdown. La freccia accanto al pulsante tiene gli altri — Markdown, HTML, testo semplice, o la finestra di stampa per un PDF. L’HTML è un file solo con gli stili in linea: nessuno script, nessun carattere da scaricare, nessuna richiesta di alcun tipo, così si apre allo stesso modo su una macchina senza rete. Sulla carta passa sempre alla tavolozza chiara, perché una pagina scura in stampa è un muro d’inchiostro.',
  },
  {
    question: 'Posso inviare un documento convertito a qualcuno?',
    answer:
      'Accedi e condividilo, come link che chiunque può aprire oppure indirizzato a persone precise, che poi accedono con quell’indirizzo. Una pagina condivisa è in sola lettura: il documento e un download, nient’altro. La revoca elimina il link, così uno già inviato smette di funzionare.',
  },
  {
    question: 'C’è un limite di dimensione?',
    answer:
      '10 MB per file da convertire — circa un milione e mezzo di parole — perché la conversione avviene sulla tua macchina. Conservarne uno in un account è limitato a 4 MB, e non è un numero nostro: la piattaforma rifiuta senza appello una richiesta più grande. Un file più grande si converte, si vede in anteprima e si scarica comunque; resta soltanto fuori dalla cronologia, e l’app lo dice invece di far finta di aver salvato. Un account tiene 500 documenti o 100 MB, il primo dei due che arriva. Raggiungere un limite rifiuta la scrittura e lo dice; niente di quello che hai salvato viene mai eliminato in silenzio per fare spazio.',
  },
  {
    question: 'Posso convertire file da uno script?',
    answer:
      'Sì. Crea una chiave API dal menu dell’account e invia il Markdown a /api/v1/documents; ci sono anche un client da riga di comando e una GitHub Action che pubblica il Markdown che una pull request ha modificato e ne commenta i link. La documentazione ha gli endpoint e i flag.',
  },
  {
    question: 'Quanto costa?',
    answer:
      'Niente. Convertire e scaricare funzionano senza alcun account; un account aggiunge la cronologia, la condivisione e l’API, entro i limiti qui sopra.',
  },
];
