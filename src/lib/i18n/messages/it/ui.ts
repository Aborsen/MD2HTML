import type { Content } from '../../content';

/*
 * Italian. Same keys, same order, same placeholders as `messages/en/ui.ts`.
 *
 * Register: impersonal wherever the sentence allows it, and the informal imperative — the form
 * Italian software actually uses — where the interface has to address the reader to name an action
 * ("Trascina qui i file", "Accedi"). No "Lei": a converter that says it sounds like a bank letter.
 *
 * Placeholders are literal and untranslated; several of them sit in a different position than in
 * English, which is what they are for.
 */

export const ui: Content['ui'] = {
  /* Words that belong to no one screen. */
  'common.copy': 'Copia',
  'common.copied': 'Copiato',
  'common.loading': 'Caricamento…',
  'common.clipboard.error': 'Impossibile accedere agli appunti',
  'common.selectall': 'Seleziona tutto',
  'common.deselectall': 'Deseleziona tutto',
  'common.selected': '{count} selezionati',
  'common.exitselection': 'Esci dalla selezione',
  'common.scrolltotop': 'Torna in cima',
  /* Said by the converter after a drop and by the history after a merge — the same sentence. */
  'common.chained': 'Uniti {count} file in un unico documento',
  /*
   * What several files chained together are called: the first name, and how many followed it.
   *
   * A name rather than a label, and still a sentence — "more" is a word. The name of a document
   * with one source is that file's own name, and `merged.md` for none of them is a file name, so
   * both of those stay in `src/lib/merge.ts` where the rest of the naming lives.
   */
  'common.merged.name': '{first} + altri {count}',

  /*
   * Sign-in, which fails in more ways than it succeeds and has to say which.
   *
   * The four `auth.error` sentences after the first are the outcomes `/api/auth/finish` can hand
   * back in the query string — a closed set, because the reason arrives in a link and a link is
   * something anybody can write. `auth.incomplete` is the toast that carries whichever it was.
   */
  'header.connector': 'Connettore MCP',
  'dialog.keys.connector.address':
    'L’indirizzo da aggiungere in un assistente. Nessuna chiave da incollare: accede con il tuo account.',

  /* The sign-in dialog: three views — in, up, and asking for a reset link. */
  'auth.dialog.signin.title': 'Accedi',
  'auth.dialog.signup.title': 'Crea il tuo account',
  'auth.dialog.reset.title': 'Reimposta la password',
  'auth.dialog.reset.lede':
    'Inserisci l’e-mail del tuo account e ti invieremo un link per reimpostarla.',
  'auth.dialog.email': 'E-mail',
  'auth.dialog.password': 'Password',
  'auth.dialog.forgot': 'Password dimenticata?',
  'auth.dialog.submit.signin': 'Accedi',
  'auth.dialog.submit.signup': 'Continua',
  'auth.dialog.submit.reset': 'Invia il link',
  'auth.dialog.tonew': 'Non hai un account?',
  'auth.dialog.tonew.action': 'Registrati',
  'auth.dialog.toexisting': 'Hai già un account?',
  'auth.dialog.toexisting.action': 'Accedi',
  'auth.dialog.back': 'Torna all’accesso',
  'auth.dialog.or': 'oppure',
  'auth.dialog.google': 'Continua con Google',
  'auth.dialog.terms': 'Accetto i {terms}',
  'auth.dialog.terms.link': 'termini di utilizzo',
  'auth.dialog.terms.required': 'Per creare un account bisogna accettare i termini.',
  'auth.dialog.reset.sent': 'Se a quell’indirizzo corrisponde un account, il link è in arrivo.',
  'auth.verify.sent': 'L’account è creato. Nella posta c’è il link che conferma l’indirizzo.',

  'auth.incomplete': 'Accesso non completato',
  'auth.error.unfinished': 'L’accesso non è andato a termine. Riprova.',
  'auth.error.link': 'Il link di accesso era incompleto. Riprova.',
  'auth.error.unreachable': 'Il servizio di accesso non è raggiungibile.',
  'auth.error.rejected': 'Il servizio di accesso ha rifiutato la richiesta.',
  'auth.error.nosession': 'Il servizio di accesso non ha restituito nessuna sessione.',
  'auth.error.start': 'Impossibile avviare l’accesso',
  'auth.error.signout': 'Uscita non riuscita',

  /* The bar at the top, on a wide screen and in the phone's sheet. */
  'header.home': 'Nuovo file',
  'header.tagline.conversion': 'convertitore {name}',
  'header.tagline.app': 'convertitore di documenti',
  'header.nav.converter': 'Convertitore',
  'header.nav.history': 'Cronologia',
  'header.nav.docs': 'Guida',
  'header.nav.documentation': 'Documentazione',
  'header.nav.blog': 'Blog',
  'header.menu.open': 'Menu',
  'header.menu.title': 'Menu',
  'header.menu.close': 'Chiudi il menu',
  'header.menu.convert': 'Converti',
  'header.menu.goto': 'Vai a',
  'header.account': 'Account',
  'header.signin': 'Accedi',
  'header.logout': 'Esci',
  'header.apikeys': 'Chiavi API',
  'header.theme.label': 'Tema',
  'header.theme.dark': 'Scuro',
  'header.theme.light': 'Chiaro',
  'header.theme.toggle': 'Cambia tema',
  'header.theme.tolight': 'Passa al chiaro',
  'header.theme.todark': 'Passa allo scuro',

  /* The converter screen: the dropzone, the document it produces, and the bands below it. */
  'converter.dropzone.title': 'Trascina qui i file {extension}',
  'converter.dropzone.choose': 'Scegli i file',
  'converter.dropzone.limits':
    '{extensions} · fino a 10 MB · elaborati nel browser',
  /*
   * The same fact as `converter.dropzone.limits`, as a sentence rather than a row of clauses:
   * this one is the prerendered page's, read by a crawler and by anybody whose bundle has not
   * arrived yet, where a line of middle dots is not prose. `scripts/prerender.ts` fills it in.
   */
  'converter.accepts': 'Accetta {extensions}, fino a 10 MB, convertiti nel browser.',
  'converter.picker.label': 'Oppure converti qualcos’altro',
  'converter.blog.eyebrow': 'Blog',
  'converter.blog.title': 'Tenere a bada il Markdown',
  'converter.blog.blurb':
    'Sintassi che si rompe, documenti che devono arrivare ad altre persone e come far girare tutto da sé.',
  'converter.blog.all': 'Tutti gli articoli',
  'converter.faq.eyebrow': 'FAQ',
  'converter.faq.title': 'Le domande di chi arriva qui',
  'converter.faq.blurb':
    'Che fine fa il file, cosa contiene il download e cosa aggiunge un account.',
  'converter.badge.converted': 'convertito',
  'converter.badge.merged': '{count} file uniti',
  'converter.newfile': 'Nuovo file',
  'converter.share': 'Condividi',
  'converter.share.hint': 'Condividi un link a questo documento',
  'converter.share.hint.signedout':
    'Accedi per condividere — la condivisione richiede il documento nel tuo account',
  'converter.copy': 'Copia {format}',
  'converter.copy.done': '{format} copiato negli appunti',
  'converter.download': 'Scarica .{format}',
  'converter.download.more': 'Altri formati',
  'converter.download.done': '{format} scaricato',
  'converter.print': 'Stampa o salva come PDF',
  'converter.print.error': 'Impossibile aprire la finestra di stampa',
  'converter.print.error.hint': 'Prova a scaricarlo.',
  'converter.tab.preview': 'Anteprima',
  'converter.tab.html': 'Sorgente HTML',
  'converter.tab.markdown': 'Markdown',
  'converter.fullscreen.enter': 'Leggi a schermo intero',
  'converter.fullscreen.exit': 'Esci da schermo intero',
  'converter.fullscreen.error': 'Lo schermo intero non è disponibile qui',

  /*
   * When a file does not come through: what was dropped, what was too big, what the conversion
   * itself had to say, and what a document that converted but would not fit is.
   *
   * The reason is always a second sentence rather than a clause bolted onto the first, because the
   * toast has two lines and a reason is what somebody can act on. `{conversion}` is the name from
   * `content.conversions`, so the failure says "Word → Markdown did not work" in every language.
   */
  'converter.reject.title': 'Non è un file convertibile',
  'converter.reject.extension': '{name} — questa pagina accetta {extensions}.',
  'converter.reject.mixed':
    'Sono {count} tipi di file diversi. Convertine un tipo alla volta.',
  'converter.toolarge.one': 'Il file è troppo grande',
  'converter.toolarge.many': 'Questi file sono troppo grandi',
  'converter.toolarge.detail': '{size} — il limite per un documento è {limit}.',
  'converter.converted': 'Convertito in {format}',
  'converter.notkept.title': 'Convertito, ma non salvato nel tuo account',
  'converter.notkept.detail':
    'Un documento conservato può arrivare a {limit}; questo è {size}. Scaricalo: è pronto.',
  'converter.failed': '{conversion} non ha funzionato',
  'converter.failed.detail': 'Impossibile leggere il file.',
  'converter.error.norows': 'Questo file non contiene righe.',
  /* `{why}` is the converter's own account of it, which for a Word file is mammoth's. */
  'converter.error.empty': 'Da questo documento non è uscito niente — {why}.',
  'converter.error.empty.why': 'il file non contiene testo',
  /* The frame a PDF is printed from: never seen, read out by a screen reader. */
  'converter.print.frame': '{name} per la stampa',
  'converter.print.unprepared':
    'Impossibile preparare il documento per la stampa.',

  /*
   * What the document is made of, one noun per count. The number is its own element on the line —
   * it is set in a heavier weight — so the word is translated on its own rather than as part of a
   * sentence with a hole in it.
   */
  'converter.stats.word': 'parola',
  'converter.stats.words': 'parole',
  'converter.stats.heading': 'titolo',
  'converter.stats.headings': 'titoli',
  'converter.stats.table': 'tabella',
  'converter.stats.tables': 'tabelle',
  'converter.stats.codeblock': 'blocco di codice',
  'converter.stats.codeblocks': 'blocchi di codice',
  'converter.stats.link': 'link',
  'converter.stats.links': 'link',
  'converter.stats.image': 'immagine',
  'converter.stats.images': 'immagini',

  /* The list of everything converted: its header, its filters, its rows and its columns. */
  'history.title': 'Cronologia',
  'history.synced': 'Salvato nel tuo account',
  'history.local': 'Conservati in questo browser — accedi per averli dappertutto',
  'history.usage':
    '· {bytes} di {maxBytes} · {documents} di {maxDocuments} documenti',
  'history.empty.title': 'Ancora nessuna conversione',
  'history.empty.synced':
    'Ogni file convertito viene salvato nel tuo account: si apre da qualsiasi dispositivo.',
  'history.empty.local':
    'Ogni file convertito compare qui. Accedi per conservare l’elenco su tutti i dispositivi.',
  'history.empty.action': 'Converti un file',
  'history.drop.title': 'Trascina i file',
  'history.drop.hint':
    'oppure fai clic per sceglierli — più file diventano un unico documento',
  'history.search.placeholder': 'Cerca per nome',
  'history.search.label': 'Cerca nella cronologia per nome del file',
  'history.search.clear': 'Cancella la ricerca',
  'history.chip.all': 'Tutti i formati',
  'history.chip.shared': 'Condivisi con me',
  'history.shared.one': '{count} documento condiviso con te',
  'history.shared.many': '{count} documenti condivisi con te',
  'history.count.one': '{count} file',
  'history.count.many': '{count} file',
  'history.count.filtered.one': '{found} di {total} file',
  'history.count.filtered.many': '{found} di {total} file',
  'history.merge': 'Unisci',
  'history.merge.hint':
    'Unisci i file selezionati in un solo documento, dal più vecchio',
  'history.merge.hint.few': 'Scegli almeno due file da unire',
  'history.download': 'Scarica',
  'history.delete': 'Elimina',
  'history.clear': 'Svuota la cronologia',
  'history.column.file': 'File',
  'history.column.type': 'Tipo',
  'history.column.sharedby': 'Condiviso da',
  'history.column.size': 'Dimensione originale',
  'history.column.content': 'Contenuto',
  'history.column.converted': 'Convertito',
  'history.column.actions': 'Azioni',
  'history.row.someone': 'qualcuno',
  'history.row.select': 'Seleziona {name}',
  'history.row.open': 'Apri l’anteprima',
  'history.row.open.label': 'Apri {name}',
  'history.row.unavailable': 'L’originale era troppo grande per restare in locale',
  'history.row.share': 'Condividi',
  'history.row.share.label': 'Condividi {name}',
  'history.row.download.label': 'Scarica {name}',
  'history.row.remove': 'Togli dalla cronologia',
  'history.row.stats.one': '{words} parole · {headings} titolo',
  'history.row.stats.many': '{words} parole · {headings} titoli',

  /*
   * What the list says when it has done something, or could not.
   *
   * `history.error.*` are `useHistory`'s: the hook has no words of its own, so the screen hands it
   * a `t` and it reports in the reader's language. A server's own refusal is passed on as the
   * `{reason}` of one of these rather than shown on its own, since it arrives in English whatever
   * the reader speaks — and `history.error.delete.reason` is what stands in when it says nothing.
   */
  'history.error.load': 'Impossibile caricare la cronologia',
  'history.error.save': 'Impossibile salvare il file',
  'history.error.delete': 'Impossibile eliminare: {reason}',
  'history.error.delete.reason': 'il server ha rifiutato',
  'history.error.delete.some':
    'Impossibile eliminare {failed} file su {total}',
  'history.error.clear': 'Impossibile svuotare la cronologia',
  'history.source.missing': 'L’originale di questo file non è più disponibile',
  'history.download.done': 'File scaricato',
  'history.download.none': 'Non è stato scaricato niente',
  'history.download.one': 'File {format} scaricato',
  'history.download.many': '{count} file {format} scaricati',
  'history.merge.none': 'Niente da unire',
  'history.merge.none.detail':
    'Gli originali di questi file non sono più disponibili.',
  'history.removed.one': 'File rimosso',
  'history.removed.many': '{count} file rimossi',
  'history.cleared': 'Cronologia svuotata',

  /*
   * The blog index. The articles themselves are not in the catalogue — see `content.ts` — so a
   * card's title, description and tag are the English the piece was written in, and only the
   * furniture around them is here.
   */
  'blog.eyebrow': 'Blog',
  'blog.title': 'Markdown, e cosa farne',
  'blog.blurb':
    'Conversione, sintassi che si rompe, pubblicazione e come far girare tutto da sé.',
  'blog.chip.all': 'Tutti',
  'blog.empty': 'Ancora niente sotto questo tag.',
  'blog.card.meta': '{date} · {minutes} min di lettura',

  /* One article: the furniture around a piece of prose that stays in English. */
  'article.toc': 'In questo articolo',
  'article.meta': '{date} · {minutes} min di lettura',
  'article.meta.updated': '{date} · aggiornato il {updated} · {minutes} min di lettura',
  'article.share': 'Condividi',
  'article.cta.text':
    'Questa pagina è stata scritta in Markdown e resa dal convertitore che descrive.',
  'article.cta.button': 'Converti un file',
  'article.more.eyebrow': 'Avanti',
  'article.more.title': 'Continua a leggere',
  'article.more.meta': '{minutes} min di lettura',
  'article.missing.title': 'Articolo inesistente',
  'article.missing.blurb':
    'Forse è stato rinominato. Nell’indice c’è tutto quello che esiste.',
  'article.missing.back': 'Torna al blog',

  /*
   * The five pages that are only words. Their own text is in `pages.ts`, keyed by page; these two
   * are what the renderer says around it.
   *
   * The closing line is split because a link sits inside it: `page.questions` is the sentence up
   * to the link and `page.questions.link` is the words the anchor carries. A translator who needs
   * the link earlier in the sentence cannot get it from here, which is the price of the anchor.
   */
  'page.updated': 'Ultimo aggiornamento {date}',
  'page.questions': 'Le domande su tutto questo vanno a',
  'page.questions.link': 'gli issue del repository',

  /*
   * A document somebody sent you, at /open/<token>.
   *
   * The app's own screen, so it follows the reader's language like every other one. The copy the
   * server renders at /s/<token> is a different page for a reader we know nothing about, and its
   * words are not in here — see `src/lib/i18n/content.ts`.
   *
   * Its Download button and its Sign in button say what those buttons say everywhere else, so they
   * read `converter.download` and `header.signin` rather than keys of their own.
   */
  'shared.loading': 'Apertura del documento…',
  'shared.meta': 'condiviso · convertito il {date}',
  'shared.signin.title': 'Questo documento è stato condiviso con persone specifiche',
  'shared.signin.detail': 'Accedi con l’indirizzo con cui è stato condiviso.',
  'shared.missing.title': 'Questo link non apre nessun documento',
  'shared.missing.action': 'Converti un tuo file',

  /* Sharing a document. */
  'dialog.share.title': 'Condividi',
  'dialog.share.mode.private': 'Privato',
  'dialog.share.mode.link': 'Chiunque abbia il link',
  'dialog.share.mode.people': 'Persone specifiche',
  'dialog.share.private.note':
    'Solo tu puoi aprire questo documento. Scegli una modalità qui sopra per condividerlo.',
  'dialog.share.link': 'Link',
  'dialog.share.link.field': 'Link di condivisione',
  'dialog.share.link.note': 'Chiunque abbia questo link può leggere il documento.',
  'dialog.share.people.note':
    'Possono aprirlo solo le persone qui sotto, dopo aver effettuato l’accesso con quell’indirizzo. Il link va inviato da te: l’app non manda email a nessuno.',
  'dialog.share.people.empty': 'Ancora nessuno — il link si apre solo per te.',
  'dialog.share.email.label': 'Email del destinatario',
  'dialog.share.add': 'Aggiungi',
  'dialog.share.remove.label': 'Rimuovi {email}',
  'dialog.share.error': 'Condivisione non riuscita',

  /* API keys, and the assistants that have been let in. */
  'dialog.keys.title': 'Chiavi API',
  'dialog.keys.blurb':
    'Converti e condividi documenti da uno script, da un terminale o dalla CI — e gli assistenti che hai collegato.',
  'dialog.keys.name.placeholder': 'Chi la userà — «CI», «il mio portatile»',
  'dialog.keys.name.label': 'Nome della chiave',
  'dialog.keys.create': 'Crea',
  'dialog.keys.create.error': 'Impossibile creare la chiave',
  'dialog.keys.fresh': 'Copiala adesso: non verrà più mostrata',
  'dialog.keys.empty':
    'Ancora nessuna chiave. Una chiave può leggere, scrivere e condividere i tuoi documenti; non può toccare l’account né queste chiavi.',
  'dialog.keys.revoked': '{name} · revocata',
  'dialog.keys.meta': '{prefix}… · {used}',
  'dialog.keys.used': 'usata {when}',
  'dialog.keys.never': 'mai usata',
  'dialog.keys.forget': 'Togli dall’elenco',
  'dialog.keys.forget.label': 'Togli {name}',
  'dialog.keys.revoke': 'Revoca — smette subito di funzionare',
  'dialog.keys.revoke.label': 'Revoca {name}',
  'dialog.keys.grants': 'Assistenti collegati',
  'dialog.keys.grant.meta': 'collegato {since} · {used}',
  'dialog.keys.disconnect': 'Scollega — smette subito di agire al tuo posto',
  'dialog.keys.disconnect.label': 'Scollega {name}',

  /* The foot of the site. The column of conversions and the legal links get their words elsewhere. */
  'footer.tagline':
    'Documenti Markdown, HTML, Word, CSV e JSON, convertiti nel browser.',
  'footer.builtby': 'Realizzato da Raudar Labs.',
  'footer.note': '© Raudar Labs {year}',
  'footer.converter': 'Convertitore',
  'footer.resources': 'Risorse',
  'footer.company': 'Azienda',
  'footer.legal': 'Note legali',
  'footer.docs': 'Documentazione',
  'footer.blog': 'Blog',
  'footer.git': 'Git',
  /* Read out after the link's own name, so it opens with the space that separates them. */
  'footer.external': ' (si apre in una nuova scheda)',
};
