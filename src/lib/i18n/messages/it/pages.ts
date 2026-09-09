import type { Content } from '../../content';

/*
 * The words of the five pages that are only words, in Italian: about, contact, and the legal three.
 *
 * The legal three are policy, and this is a translation of them and nothing else: same sections in
 * the same order, same number of paragraphs, same number of list items, nothing softened, nothing
 * added. The line about which language version prevails is an interface string the application
 * renders; it is deliberately not here.
 */

export const pages: Content['pages'] = {
  about: {
    label: 'Informazioni',
    title: 'Informazioni su TransformPipe',
    lede: 'Un convertitore che fa il lavoro nel browser e non si mette in mezzo.',
    sections: [
      {
        heading: 'Che cos’è',
        body: [
          'TransformPipe trasforma documenti in altri documenti. Markdown in una pagina HTML finita, e HTML, file Word, fogli di calcolo e JSON in Markdown. Trascina un file, guarda cosa è diventato, portalo via come Markdown, HTML, testo semplice o PDF.',
          'Tutto si normalizza in Markdown, perché il Markdown è un formato che si può leggere, confrontare e conservare per vent’anni senza possedere lo strumento che l’ha prodotto.',
        ],
      },
      {
        heading: 'Perché funziona così',
        body: [
          'La conversione avviene nel browser. Senza accesso nessun file viene inviato da nessuna parte: non c’è nessun caricamento di cui fidarsi, perché non c’è nessun caricamento. Con l’accesso il Markdown viene conservato nel tuo account così un documento ti segue su un’altra macchina, e resta privato fino a quando non lo condividi.',
          'L’HTML esportato è un file solo con gli stili in linea. Non chiede niente alla rete, il che significa che fra cinque anni si aprirà su un portatile senza connessione esattamente come si apre oggi.',
        ],
      },
      {
        heading: 'Oltre l’app',
        body: [
          'Le stesse conversioni si raggiungono da un terminale, da una pull request e da un assistente: ci sono un’API pubblica, un client da riga di comando senza dipendenze, una GitHub Action che pubblica il Markdown che una pull request ha modificato, e un server MCP perché un modello possa convertire e condividere documenti al posto tuo. La documentazione copre tutto.',
        ],
      },
      {
        heading: 'Chi lo realizza',
        body: [
          'TransformPipe è realizzato da Raudar Labs.',
        ],
      },
    ],
    seo: {
      title: 'Informazioni su TransformPipe',
      description:
        'TransformPipe converte documenti Markdown, HTML, Word, CSV e JSON nel browser, con API, CLI, GitHub Action e server MCP. Realizzato da Raudar Labs.',
    },
  },
  contact: {
    label: 'Contatti',
    title: 'Contattaci',
    lede: 'Un bug, un formato che ti serve, o qualcosa che non dovrebbe essere pubblicato.',
    sections: [
      {
        heading: 'Bug e richieste',
        body: [
          'Apri una issue sul repository. Un file convertito male è la cosa più utile che si possa mandare: allegalo se puoi condividerlo, e di’ cosa ti aspettavi invece.',
          'Un formato che ancora non convertiamo è una richiesta che vale la pena fare. Parecchi di quelli che ci sono sono nati così.',
        ],
      },
      {
        heading: 'Qualcosa di condiviso che non dovrebbe esserlo',
        body: [
          'Ogni documento condiviso porta un link «Segnala questo documento» in fondo alla pagina che apre. Quel link è la via più rapida: identifica il documento senza che tu debba descriverlo.',
        ],
      },
      {
        heading: 'Privacy e note legali',
        body: [
          'Le domande su cosa viene conservato, o la richiesta di eliminare un account e tutto quello che contiene, vanno allo stesso posto. Con l’accesso puoi anche eliminare da te qualsiasi documento: questo rimuove insieme la riga e il sorgente conservato.',
        ],
      },
    ],
    seo: {
      title: 'Contattare TransformPipe',
      description:
        'Segnala un bug, chiedi un formato, segnala un documento condiviso, o chiedi cosa viene conservato e fallo eliminare.',
    },
  },
  privacy: {
    label: 'Privacy',
    title: 'Privacy',
    lede: 'Cosa viene conservato, dove, e cosa non viene raccolto affatto.',
    sections: [
      {
        heading: 'Senza accesso, a noi non arriva niente',
        body: [
          'La conversione avviene nel browser. Il file viene letto, convertito e mostrato sulla tua macchina, e nessuna sua parte viene inviata a un server. La cronologia che vedi è la memoria del browser, non un account.',
        ],
      },
      {
        heading: 'Con l’accesso, questo e nient’altro',
        body: [
          'Un account esiste perché i documenti possano seguirti tra i dispositivi ed essere condivisi. Contiene:',
        ],
        items: [
          'La tua identità da Google, tramite il nostro fornitore di autenticazione: un indirizzo email, un nome e un id dell’account. Non vediamo né conserviamo mai una password.',
          'Per ogni documento conservato: il suo nome, quale conversione l’ha prodotto, la sua dimensione, il conteggio di parole, titoli, link, blocchi di codice, tabelle e immagini, e quando è stato creato.',
          'Il Markdown stesso, in un archivio blob privato — privato nel senso che non ha alcun URL pubblico e viene letto solo tramite una richiesta che autorizziamo noi.',
          'Le chiavi API come hash, mai la chiave. Una chiave viene mostrata una volta sola, alla creazione, e in seguito non è più recuperabile: né da te né da noi.',
          'Le impostazioni di condivisione: se un documento è privato, aperto per link o indirizzato a determinati indirizzi email, e il token che un link porta con sé.',
        ],
      },
      {
        heading: 'Cosa non facciamo',
        body: [
          'Su questo sito non c’è nessuna analisi statistica, nessuna pubblicità, nessun pixel di tracciamento e nessuno script di terze parti — non un insieme ridotto: nessuno. Niente viene venduto, e niente viene condiviso con nessuno tranne l’infrastruttura che fa funzionare il servizio: il database, l’archivio blob, il fornitore di autenticazione e l’hosting.',
          'I tuoi documenti non vengono letti da noi, e non vengono usati per addestrare niente.',
        ],
      },
      {
        heading: 'Cookie e memoria del browser',
        body: [
          'Un solo cookie di sessione, impostato dal nostro fornitore di autenticazione al momento dell’accesso, di prima parte e HttpOnly. Durante il giro di andata e ritorno dell’accesso esiste un cookie di breve durata, che scade in dieci minuti. Sono tutti qui — non c’è niente di opzionale da disattivare. La pagina sui cookie ha i dettagli.',
          'Il tema e, senza accesso, la cronologia vivono nella memoria locale del browser. Non la lasciano mai.',
        ],
      },
      {
        heading: 'Eliminare le cose',
        body: [
          'Eliminare un documento elimina insieme la riga e il Markdown conservato, subito, non secondo una pianificazione. Revocare una condivisione elimina il token, così un link già inviato smette di funzionare.',
          'Per rimuovere un account e tutto quello che contiene, basta chiederlo — vedi la pagina dei contatti. Raggiungere un limite di spazio rifiuta la scrittura; non elimina mai qualcosa che hai scelto di conservare per fare spazio.',
        ],
      },
      {
        heading: 'Minori',
        body: [
          'Questo è uno strumento di lavoro, non un servizio per bambini, e non è rivolto a nessuno sotto i 16 anni.',
        ],
      },
      {
        heading: 'Modifiche',
        body: [
          'Se questa pagina cambia in un modo che riguarda ciò che viene raccolto, la data qui sopra cambia con lei.',
        ],
      },
    ],
    seo: {
      title: 'Privacy — TransformPipe',
      description:
        'Senza accesso nessun file lascia il browser. Con l’accesso: documento, metadati e identità Google. Nessuna analisi, nessun tracciamento, né script di terze parti.',
    },
  },
  terms: {
    label: 'Termini',
    title: 'Termini di utilizzo',
    lede: 'La versione breve, perché una lunga non verrebbe letta.',
    sections: [
      {
        heading: 'Uso del servizio',
        body: [
          'TransformPipe è offerto gratuitamente, così com’è. Si può usare per qualunque cosa si abbia il diritto di convertire, dall’app, dall’API, dalla riga di comando o da un assistente.',
          'Un account è tuo da conservare o da eliminare. Sei responsabile di quello che fai con una chiave API, quindi trattala come una password: chiunque la abbia può leggere e scrivere i tuoi documenti.',
        ],
      },
      {
        heading: 'I tuoi documenti restano tuoi',
        body: [
          'Conservi tutti i diritti che avevi su un documento prima di convertirlo. Non rivendichiamo nessuna proprietà e nessuna licenza oltre a quanto serve per far funzionare il servizio: conservarlo perché tu possa riaprirlo, e mostrarlo alle persone con cui hai deliberatamente scelto di condividerlo.',
        ],
      },
      {
        heading: 'Cosa non mettere qui',
        body: [
          'Non usare il servizio per contenuti illegali, che non hai il diritto di distribuire, o che esistono per danneggiare qualcuno: malware, materiale che sfrutta sessualmente i minori, molestie mirate. Non usare un link di condivisione per far girare una pagina di phishing.',
          'I documenti condivisi possono essere segnalati da chiunque li apra. Un documento che viola questa sezione può essere ritirato dalla pubblicazione o eliminato, e un account che ripete può essere chiuso.',
        ],
      },
      {
        heading: 'Limiti e disponibilità',
        body: [
          'Si applicano limiti di frequenza e di spazio, pubblicati nella documentazione. Esistono per tenere in piedi il servizio, e possono cambiare.',
          'Non c’è nessuna promessa di continuità. Il servizio può essere interrotto, e le funzioni possono cambiare o essere ritirate. Tieni una copia tua di tutto quello che non puoi perdere — il download esiste esattamente per questo, e per aprirlo non serve niente da parte nostra.',
        ],
      },
      {
        heading: 'Nessuna garanzia, e il limite di ciò che dobbiamo',
        body: [
          'Il servizio è fornito senza garanzie di alcun tipo, esplicite o implicite. Nella misura massima consentita dalla legge, Raudar Labs non è responsabile per perdita di dati, perdita di profitto, o qualsiasi danno indiretto o consequenziale derivante dal suo utilizzo.',
          'Niente di quanto scritto qui limita un diritto che non può essere limitato per accordo.',
        ],
      },
      {
        heading: 'Modifiche e conclusione',
        body: [
          'Questi termini possono cambiare; la data qui sopra dice quando è avvenuto l’ultima volta, e continuare a usare il servizio è il modo in cui vengono accettati. Puoi smettere in qualsiasi momento eliminando i tuoi documenti e il tuo account.',
        ],
      },
    ],
    seo: {
      title: 'Termini di utilizzo — TransformPipe',
      description:
        'TransformPipe è gratuito e fornito così com’è. I tuoi documenti restano tuoi, i limiti sono pubblicati, e non c’è nessuna garanzia.',
    },
  },
  cookies: {
    label: 'Cookie',
    title: 'Cookie',
    lede: 'Sono due, entrambi necessari per accedere, e non c’è niente da configurare.',
    sections: [
      {
        heading: 'Niente da disattivare',
        body: [
          'La maggior parte delle pagine sui cookie esiste per permettere di rifiutare analisi statistiche e pubblicità. Questo sito non ha né le une né l’altra, quindi questa pagina non ha interruttori: rifiutare è l’unica impostazione, ed è già il modo in cui il sito funziona.',
          'Senza accesso, questo sito non imposta alcun cookie.',
        ],
      },
      {
        heading: 'I due che esistono',
        body: [
          'Entrambi sono impostati dal nostro fornitore di autenticazione, sono di prima parte e sono contrassegnati HttpOnly e Secure — lo script della pagina non può leggerli:',
        ],
        items: [
          '__Secure-neon-auth.session_token — ti mantiene autenticato. Senza di esso, ogni caricamento di pagina chiederebbe di accedere di nuovo. Se ne va quando esci.',
          '__Secure-neon-auth.session_challenge — esiste per i dieci minuti del giro di andata e ritorno dell’accesso, così la risposta di Google può essere abbinata alla richiesta che l’ha avviata. È ciò che impedisce che l’accesso di qualcun altro finisca nella tua sessione.',
        ],
      },
      {
        heading: 'La memoria del browser, che non è un cookie',
        body: [
          'Due cose vivono nella memoria locale del browser e non vengono mai inviate da nessuna parte: il tema che hai scelto e — quando non hai effettuato l’accesso — le tue conversioni recenti, così la cronologia ha qualcosa dentro. Cancellando i dati del sito dal browser si rimuovono entrambe, e l’app va avanti senza di loro.',
        ],
      },
      {
        heading: 'Se questo cambia',
        body: [
          'Se mai venisse aggiunto qualcosa di opzionale, questa pagina avrà un vero controllo prima che venga impostato, non dopo. La data qui sopra dirà quando.',
        ],
      },
    ],
    seo: {
      title: 'Cookie — TransformPipe',
      description:
        'Due cookie di sessione di prima parte, entrambi necessari per accedere. Nessuna analisi, nessuna pubblicità, niente di opzionale da configurare.',
    },
  },
};
