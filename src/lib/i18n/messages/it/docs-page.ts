/*
 * The manual's own prose in Italian — every word the /docs page says in its own right.
 *
 * Same keys, same order, same placeholders as `messages/en/docs-page.ts`. The elements the
 * placeholders stand for — paths, flags, headers, extensions, endpoints — stay in the page's JSX,
 * so none of them is translated here; only the sentence around them is, and Italian puts several of
 * them somewhere else in that sentence than English does.
 */

export const docsPage = {
  /* The head of the page. */
  'docs.eyebrow': 'Documentazione',
  /* The contents column beside the manual. Not 'In this article' — this is not one. */
  'docs.toc': 'In questa pagina',

  'docs.title': 'Tutto quello che fa TransformPipe',
  'docs.lede':
    'Markdown, HTML, Word, CSV o JSON in entrata — un documento in uscita come HTML, Markdown, testo semplice o stampa. Da questa pagina, da un terminale, da una pull request o da un assistente. È tutto qui; niente di tutto questo sta dietro a un piano a pagamento.',

  /* Under every screenshot, after the caption. */
  'docs.shot.enlarge': '— fai clic per ingrandire',

  /* The chip that appears in two sections, History and Sharing, and must read the same in both. */
  'docs.chip.shared': 'Condivisi con me',

  'docs.start.signedOut':
    'Trascina un file sul convertitore e hai il documento convertito e il download. Senza accesso non viene conservato niente e non viene inviato niente da nessuna parte: la conversione avviene in questo browser, sulla tua macchina.',
  'docs.start.signedIn':
    'Con l’accesso tramite Google gli stessi documenti ti seguono tra i dispositivi, si possono condividere per link o per indirizzo e si possono raggiungere da uno script con una chiave API. Quello che hai convertito prima di accedere passa nell’account per strada.',

  /** `{menu}` is the header's own Converter entry, in bold. */
  'docs.converting.intro':
    '{menu} nell’intestazione elenca ciò che questa app converte. Ognuna ha la sua pagina, la sua area di trascinamento e il suo indirizzo, così una conversione si può linkare e mettere tra i preferiti invece di riconfigurarla ogni volta:',
  'docs.converting.menu': 'Convertitore',
  /** `{docx}` is the extension itself. */
  'docs.converting.sizes':
    'Fino a 10 MB per file. Trascinando più file Markdown insieme, vengono concatenati in un unico documento, nell’ordine in cui arrivano, separati da una riga. Un file che la pagina non accetta — un {docx} sulla pagina del Markdown, per esempio — viene passato alla conversione che lo accetta invece di essere rifiutato; un misto di tipi diversi viene rifiutato, perché attaccare un foglio di calcolo a un documento Word non è quello che qualcuno intendeva fare.',
  'docs.converting.oneShape':
    'Tutto finisce come Markdown, e non per caso: è la forma in cui un documento viene conservato, mostrato in anteprima, condiviso e raggiunto da uno script, così l’intera app si regge su una forma sola invece che su quattro.',
  'docs.converting.shot.converter.alt':
    'Il convertitore TransformPipe con l’area di trascinamento vuota',
  'docs.converting.shot.converter.caption':
    'Il convertitore. Il logo fa anche da «ricomincia».',
  'docs.converting.flavour':
    'Quello che esce è GitHub Flavored Markdown: tabelle, elenchi di attività, testo barrato, link automatici, codice recintato. L’anteprima è il documento stesso, con gli stessi token grafici dell’app, così un’app scura consegna una pagina scura — e la stampa passa sempre al chiaro, perché una pagina scura su carta è un muro d’inchiostro.',
  'docs.converting.shot.preview.alt':
    'Un documento convertito mostrato nella scheda dell’anteprima',
  'docs.converting.shot.preview.caption':
    'Anteprima, con i conteggi che il documento ha davvero.',
  /** `{to}` is the word below, emphasised in the middle of the sentence. */
  'docs.converting.source':
    'La scheda del sorgente non è un riassunto del risultato. È esattamente ciò che il download consegna: l’HTML autosufficiente quando la conversione era {to} HTML, il Markdown quando era verso il Markdown — un solo documento, stili in linea, nessuno script, nessuna rete.',
  'docs.converting.source.emphasis': 'verso',
  /** `{html}` and `{md}` are the two extensions. */
  'docs.converting.download':
    'Il pulsante di download porta il formato che la conversione ha prodotto — {html} sulla pagina del Markdown, {md} sulle altre — e la freccia accanto tiene il resto: Markdown, HTML, testo semplice e la stampa. La stampa costruisce il file esportato in un frame a sé e apre la finestra del browser, così un PDF è il documento e non una fotografia dell’app che gli sta intorno; sulla carta l’esportazione passa a una tavolozza chiara qualunque sia l’impostazione dell’app.',
  'docs.converting.shot.source.alt':
    'La scheda del sorgente HTML con il documento autosufficiente',
  'docs.converting.shot.source.caption':
    'La scheda del sorgente HTML: quello che si ottiene, prima di ottenerlo.',
  'docs.converting.reading':
    'Per leggere, e non per controllare, l’anteprima va a schermo intero e mantiene una larghezza leggibile; Esc torna indietro. Un documento lungo fa comparire un pulsante per tornare in cima, in entrambe le viste.',

  'docs.history.intro':
    'Ogni conversione finisce nella cronologia: nel tuo account con l’accesso, in questo browser senza. La ricerca lavora sui nomi dei file, le colonne si ordinano e una riga apre il documento.',
  'docs.history.shot.history.alt':
    'L’elenco della cronologia con ricerca, filtri e colonne ordinabili',
  'docs.history.shot.history.caption':
    'HTML o Markdown, ricerca, colonne ordinabili.',
  /**
   * `{all}` and `{shared}` are the two chips that are always there, `{badge}` a row's own format
   * badge — the format codes stay in the page.
   */
  'docs.history.chips':
    'I filtri selezionano la provenienza di un documento: {all} all’inizio, poi un filtro per ogni conversione che ha davvero delle righe, e {shared} per i file che qualcuno ti ha mandato. Il contrassegno di una riga dice la stessa cosa — {badge} su un file Word — così un elenco di trenta documenti dice ancora quale è quale.',
  'docs.history.chip.all': 'Tutti i formati',
  'docs.history.downloading':
    'Scaricare è un menu e non un pulsante secco: viene conservato solo il Markdown, mentre l’HTML e il testo semplice si costruiscono sul momento, così una riga può consegnare uno qualsiasi dei tre senza tenere tre copie.',
  'docs.history.selection':
    'Spuntando delle righe compare la barra della selezione: unirle in un solo documento, scaricarle o eliminarle. L’unione rispetta l’ordine dell’elenco.',
  'docs.history.shot.selection.alt':
    'Due righe selezionate, con la barra delle azioni di gruppo',
  'docs.history.shot.selection.caption': 'Unione, download ed eliminazione di gruppo.',

  /** `{anyone}` and `{only}` are the two modes, in bold; `{path}` is the address a share gets. */
  'docs.sharing.modes':
    '{anyone} pubblica il documento all’indirizzo {path}: una pagina in sola lettura con il documento e un download, nient’altro. {only} chiede al lettore di accedere con un indirizzo che hai elencato.',
  'docs.sharing.mode.link': 'Chiunque abbia il link',
  'docs.sharing.mode.people': 'Solo questi indirizzi',
  'docs.sharing.revoking':
    'La revoca elimina il token, così un link già inviato smette di funzionare; condividendo di nuovo se ne genera uno diverso. Non viene mai inviata alcuna email: il link lo passi tu.',
  /** `{shared}` is the chip named in `docs.chip.shared`. */
  'docs.sharing.incoming':
    'I documenti che altre persone hanno indirizzato a te compaiono sotto il filtro {shared}, con il nome di chi li ha condivisi. Sono in sola lettura: si aprono e si scaricano, non si eliminano e non si ricondividono. Una condivisione per link appartiene a chi ha il link, quindi non compare nell’elenco di nessuno.',
  /** `{csp}` is the Content-Security-Policy directive itself. */
  'docs.sharing.safety':
    'Una pagina condivisa porta il contenuto di qualcuno sul nostro dominio, quindi viene servita con {csp} e non può essere messa in un frame, e ognuna di esse rimanda a un modulo di segnalazione che non ha bisogno di JavaScript. Niente viene revocato automaticamente: una segnalazione è l’affermazione di un estraneo sul documento di un altro, ed entrambi gli errori — lasciare in piedi una pagina dannosa, uccidere un link innocente — meritano che prima una persona la legga.',

  'docs.account.signIn':
    'L’accesso è con Google, tramite Neon Auth. Il menu dell’account tiene il tema (scuro per impostazione predefinita, ricordato per browser), le chiavi API e la via d’uscita.',
  'docs.account.keys':
    'Una chiave viene mostrata una volta sola e conservata solo come hash. Raggiunge i documenti e le condivisioni, mai l’account né le chiavi stesse, così una chiave sfuggita non può generarsi una sostituta né chiuderti fuori. La revoca ha effetto dalla richiesta successiva.',

  /** `{auth}` is the Authorization header, shown as it is sent. */
  'docs.api.intro':
    'Tutto quello che fa l’app lo può fare uno script. La chiave si invia come {auth}; funziona anche una sessione del browser, così gli stessi endpoint si possono provare da autenticati.',
  /*
   * The endpoint table. The terms are the endpoints, which stay in the page; these are the
   * explanations beside them. The placeholders are query parameters and JSON shapes.
   */
  'docs.api.post':
    'Markdown nel corpo ({name}) oppure JSON {json}. {share} lo pubblica nella stessa chiamata. {kindHtml}, {kindCsv} o {kindJson} convertono prima il corpo, così una pagina, un foglio di calcolo o una risposta di API si possono inviare così come sono; {word} qui viene rifiutato, perché la lettura di un {docx} avviene nel browser.',
  'docs.api.list': 'I 500 più recenti, con dimensioni, statistiche e stato della condivisione.',
  'docs.api.one': 'I metadati e il sorgente Markdown.',
  'docs.api.html': 'Il documento autosufficiente. {theme} è opzionale.',
  'docs.api.delete': 'Elimina la riga e il sorgente conservato.',
  'docs.api.share': '{modes}. {private} elimina il token.',
  'docs.api.usage': 'Quanto sta usando l’account, rispetto ai limiti.',
  /** `{shape}` is the error body itself. */
  'docs.api.errors':
    'Gli errori sono {shape} con uno stato che dice quello che significa: 401 chiave sconosciuta, 404 non è tuo, 413 il documento supera i 4 MB, 403 l’account ha esaurito lo spazio, 429 troppo veloce, 410 il sorgente non c’è più.',

  /** `{cli}` is the path to the client in the repository. */
  'docs.cli.intro':
    '{cli} nel repository è la stessa API con una faccia più amichevole, e senza dipendenze: uno strumento che gira nella CI non deve trascinarsi dietro un albero di pacchetti.',
  /** The placeholders are the four extensions it converts, the one it refuses, and the flag. */
  'docs.cli.extensions':
    'Un {html}, {csv}, {tsv} o {json} inviato viene convertito dall’endpoint invece di essere conservato come se fosse già Markdown; un {docx} viene rifiutato, con l’indicazione della pagina che lo sa leggere. {merge} concatena solo il Markdown.',
  /** The placeholders are the flag, the variable, the config path, the host variable and the flag. */
  'docs.cli.key':
    'La chiave viene da {key}, poi da {env}, poi da {config}. {host} lo punta su un altro deployment e {json} stampa la risposta dell’API così com’è.',

  'docs.action.intro':
    'Senza un elenco di file, l’action pubblica il Markdown che una pull request ha modificato e ne commenta i link — così un revisore apre il documento reso invece di leggere un diff di asterischi.',
  /** `{example}` is the workflow file; `{depth}` and `{permission}` are the two YAML settings. */
  'docs.action.workflow':
    '{example} è un workflow completo da copiare. Al checkout serve {depth} per il commit di base con cui viene confrontato l’elenco dei file, e al commento serve {permission}.',
  /* The input table. The terms are the input names, which stay in the page. */
  'docs.action.input.apiKey': 'Obbligatoria. Va tenuta in un secret del repository.',
  'docs.action.input.files':
    'Percorsi separati da spazi. Per impostazione predefinita, quelli che la pull request ha modificato.',
  /** The placeholders are the three values the input takes. */
  'docs.action.input.share':
    '{link} (predefinito), {people} oppure {none} per pubblicare in privato.',
  'docs.action.input.merge':
    'Concatena i file in un solo documento invece di uno per file.',
  'docs.action.input.comment': 'Commenta i link sulla pull request.',
  'docs.action.input.host': 'Un altro deployment di transformpipe.',
  'docs.action.pushes':
    'Un push pubblica documenti nuovi invece di sovrascrivere quelli vecchi, così un link in un commento più vecchio continua a mostrare quello che diceva quel commit.',

  /** `{path}` is the connector's address, which comes from `mcp-facts.ts`. */
  'docs.assistant.intro':
    'TransformPipe è un server MCP, quindi si può aggiungere a Claude come connettore. L’indirizzo è questo deployment più {path}:',
  'docs.assistant.adding':
    'Su claude.ai va in Impostazioni → Connettori → Aggiungi connettore personalizzato. Da un terminale:',
  'docs.assistant.auth':
    'Non c’è nessuna chiave da incollare. La prima chiamata torna come non autorizzata, il tuo assistente segue quella risposta fino a una pagina qui, e tu accedi con lo stesso account che usi già e approvi un client con un nome — ed è per questo che la pagina dice con quale indirizzo sta per agire al posto tuo. Quello che ottiene è un token nostro, valido per i tuoi documenti e per nient’altro: non per l’account, non per l’accesso, non per le chiavi API. Scollegalo dal menu dell’account, sotto Connettore MCP, e smette di funzionare alla chiamata successiva.',
  'docs.assistant.tools':
    'Gli strumenti sono lo stesso codice dell’API qui sopra, chiamato nello stesso processo, così una conversazione e uno script ottengono la stessa risposta. Due di essi sono fatti su misura per i guai che possono combinare: la condivisione pubblica una pagina sul web aperto, e l’eliminazione richiede una conferma esplicita e rimuove esattamente un documento.',

  /* The limits table: each term and the figure beside it. */
  'docs.embed.intro':
    'Un iframe. Nessuno script da caricare, niente da installare e nessun account: l’incorporamento è anonimo per scelta, perché una pagina su un altro dominio in grado di raggiungere i documenti di qualcuno sarebbe uno scambio peggiore di quanto valga la comodità.',
  'docs.embed.params':
    '{conversion} scegle quale delle cinque, {theme} lascia alla pagina che incorpora la scelta della palette invece di seguire il sistema del visitatore, e il prefisso della lingua funziona come altrove — {locale}.',
  'docs.embed.messages':
    'Il risultato esce con {post}: {ready} al caricamento, poi {converted} con nome, Markdown, HTML e conteggi, oppure {error}. Ogni messaggio porta {source}, perché una pagina in ascolto su {window} sente ogni suo frame e i propri script — e verifica {origin} contro questo sito, che è la parte che nessun altro può fare per te.',
  'docs.embed.frames':
    'Solo {embed} può essere incorporato. Ogni altra pagina di questo sito risponde {ancestors}, così che nulla qui possa essere spacciato per altro.',

  'docs.limits.account.term': 'Per account',
  'docs.limits.account.text': '100 MB di Markdown, 500 documenti',
  'docs.limits.convert.term': 'Per conversione',
  'docs.limits.convert.text':
    '10 MB — circa un milione e mezzo di parole. Più file trascinati insieme contano per l’unico documento che diventano',
  'docs.limits.document.term': 'Per documento conservato',
  'docs.limits.document.text':
    '4 MB, e non per nostra scelta: una Vercel Function rifiuta una richiesta o un corpo di risposta oltre i 4,5 MB prima che una riga di questo codice venga eseguita, quindi un documento più grande non potrebbe essere né salvato né riletto. Si converte, si vede in anteprima e si scarica comunque: resta fuori dalla cronologia, e l’app lo dice invece di annunciare un salvataggio che non è avvenuto',
  'docs.limits.caller.term': 'Per chiamante',
  'docs.limits.caller.text':
    '60 richieste al minuto, contate per chiave o per sessione',
  'docs.limits.refusal':
    'Raggiungere un limite è un rifiuto, non uno sfratto silenzioso. Questa app eliminava il documento più vecchio per restare sotto il suo tetto, e così distruggeva in silenzio qualcosa che il proprietario aveva scelto di conservare; adesso dice invece cosa eliminare.',

  'docs.faq.intro':
    'Le stesse risposte che il convertitore mostra sotto la sua area di trascinamento — una serie sola, così le due pagine non possono divergere.',

  'docs.footer.source': 'Codice e segnalazioni:',
};
