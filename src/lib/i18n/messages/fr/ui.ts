import type { Content } from '../../content';

/*
 * La version française de `messages/en/ui.ts` : mêmes clés, même ordre, mêmes espaces réservés.
 *
 * Registre : vouvoiement, et des tournures impersonnelles partout où l’interface n’a pas besoin
 * de s’adresser à quelqu’un. Les libellés de boutons restent courts, quitte à dire un peu moins
 * que l’anglais — un bouton tronqué renseigne moins qu’un mot approchant.
 *
 * Les espaces avant « : », « ; » et « ? » sont insécables, et les guillemets sont les français.
 */

export const ui: Content['ui'] = {
  /* Mots qui n’appartiennent à aucun écran. */
  'common.copy': 'Copier',
  'common.copied': 'Copié',
  'common.loading': 'Chargement…',
  'common.clipboard.error': 'Accès au presse-papiers impossible',
  'common.selectall': 'Tout sélectionner',
  'common.deselectall': 'Tout désélectionner',
  'common.selected': '{count} sélectionnés',
  'common.exitselection': 'Quitter la sélection',
  'common.scrolltotop': 'Haut de la page',
  /* Dite par le convertisseur après un dépôt et par l’historique après une fusion — même phrase. */
  'common.chained': '{count} fichiers enchaînés en un seul document',
  /*
   * Le nom que porte un document fait de plusieurs fichiers : le premier nom, puis combien ont
   * suivi.
   *
   * Un nom plutôt qu’un libellé, et toujours une phrase — « autres » est un mot. Le nom d’un
   * document à source unique est celui de ce fichier, et `merged.md` pour aucune source est un nom
   * de fichier : les deux restent dans `src/lib/merge.ts`, avec le reste du nommage.
   */
  'common.merged.name': '{first} + {count} autres',

  /*
   * La connexion, qui échoue de plus de façons qu’elle ne réussit et doit dire laquelle.
   *
   * Les quatre phrases `auth.error` qui suivent la première sont les issues que `/api/auth/finish`
   * peut renvoyer dans la chaîne de requête — un ensemble fermé, parce que la raison arrive dans
   * un lien et qu’un lien, n’importe qui peut l’écrire. `auth.incomplete` est le toast qui porte
   * celle qui est arrivée.
   */
  'dialog.mcp.lede':
    'Ajoutez transformpipe dans un assistant : il pourra convertir, enregistrer et partager des documents de ce compte.',
  'dialog.mcp.address': 'Adresse du connecteur',
  'dialog.mcp.nokey':
    'Sur claude.ai : Paramètres → Connecteurs → Ajouter un connecteur personnalisé. Aucune clé à coller : la connexion se fait sous votre compte et peut être coupée ici.',
  'dialog.mcp.command': 'Depuis un terminal',
  'header.connector': 'Connecteur MCP',

  /* The sign-in dialog: three views — in, up, and asking for a reset link. */
  'auth.dialog.signin.title': 'Connexion',
  'auth.dialog.signup.title': 'Créer votre compte',
  'auth.dialog.reset.title': 'Réinitialiser votre mot de passe',
  'auth.dialog.reset.lede':
    'Saisissez l’adresse e-mail du compte et un lien de réinitialisation vous sera envoyé.',
  'auth.dialog.email': 'E-mail',
  'auth.dialog.password': 'Mot de passe',
  'auth.dialog.forgot': 'Mot de passe oublié ?',
  'auth.dialog.submit.signin': 'Se connecter',
  'auth.dialog.submit.signup': 'Continuer',
  'auth.dialog.submit.reset': 'Envoyer le lien',
  'auth.dialog.tonew': 'Vous n’avez pas de compte ?',
  'auth.dialog.tonew.action': 'S’inscrire',
  'auth.dialog.toexisting': 'Vous avez déjà un compte ?',
  'auth.dialog.toexisting.action': 'Se connecter',
  'auth.dialog.back': 'Retour à la connexion',
  'auth.dialog.or': 'ou',
  'auth.dialog.google': 'Continuer avec Google',
  'auth.dialog.terms': 'J’accepte les {terms}',
  'auth.dialog.terms.link': 'conditions d’utilisation',
  'auth.dialog.terms.required': 'Les conditions doivent être acceptées pour créer un compte.',
  'auth.dialog.verify.title': 'Confirmer votre e-mail',
  'auth.dialog.verify.lede':
    'Un code à six chiffres a été envoyé à {email}. Il expire dans dix minutes.',
  'auth.dialog.verify.code': 'Code à six chiffres',
  'auth.dialog.verify.submit': 'Confirmer',
  'auth.dialog.verify.resend': 'Envoyer un autre code',
  'auth.dialog.verify.resent': 'Un nouveau code est en route.',
  'auth.dialog.verify.done': 'L’adresse est confirmée.',
  'auth.dialog.verify.later': 'Plus tard',
  'header.verify': 'Confirmer votre e-mail',
  'auth.dialog.reset.sent': 'Si un compte existe pour cette adresse, un lien est en route.',
  'auth.verify.sent':
    'Le compte est créé. Le lien de confirmation de l’adresse est dans votre boîte.',

  'auth.incomplete': 'La connexion n’a pas abouti',
  'auth.error.unfinished': 'La connexion ne s’est pas terminée. Réessayez.',
  'auth.error.link': 'Le lien de connexion était incomplet. Réessayez.',
  'auth.error.unreachable': 'Le service de connexion est inaccessible.',
  'auth.error.rejected': 'Le service de connexion a refusé la demande.',
  'auth.error.nosession': 'Le service de connexion n’a renvoyé aucune session.',
  'auth.error.start': 'Lancement de la connexion impossible',
  'auth.error.signout': 'La déconnexion a échoué',

  /* La barre du haut, sur grand écran et dans le panneau du téléphone. */
  'header.home': 'Nouveau fichier',
  'header.tagline.conversion': 'convertisseur {name}',
  'header.tagline.app': 'convertisseur de documents',
  'header.nav.converter': 'Convertisseur',
  'header.nav.history': 'Historique',
  'header.nav.docs': 'Docs',
  'header.nav.documentation': 'Documentation',
  'header.nav.blog': 'Blog',
  'header.menu.open': 'Menu',
  'header.menu.title': 'Menu',
  'header.menu.close': 'Fermer le menu',
  'header.menu.convert': 'Convertir',
  'header.menu.goto': 'Aller à',
  'header.account': 'Compte',
  'header.signin': 'Se connecter',
  'header.logout': 'Se déconnecter',
  'header.apikeys': 'Clés API',
  'header.theme.label': 'Thème',
  'header.theme.dark': 'Sombre',
  'header.theme.light': 'Clair',
  'header.theme.toggle': 'Changer de thème',
  'header.theme.tolight': 'Passer en clair',
  'header.theme.todark': 'Passer en sombre',

  /* L’écran du convertisseur : la zone de dépôt, le document produit, et les bandes du dessous. */
  'converter.dropzone.title': 'Déposer les fichiers {extension} ici',
  'converter.dropzone.choose': 'Choisir des fichiers',
  'converter.dropzone.limits':
    '{extensions} · jusqu’à 10 MB · traité dans le navigateur',
  /*
   * Le même fait que `converter.dropzone.limits`, en phrase plutôt qu’en série de fragments :
   * celle-ci est destinée à la page pré-rendue, lue par un robot et par qui n’a pas encore reçu
   * le bundle, là où une file de points médians n’est pas de la prose.
   */
  'converter.accepts':
    'Accepte {extensions}, jusqu’à 10 MB, converti dans votre navigateur.',
  'converter.picker.label': 'Ou convertir autre chose',
  'converter.blog.eyebrow': 'Blog',
  'converter.blog.title': 'Discipliner le Markdown',
  'converter.blog.blurb':
    'De la syntaxe qui casse, des documents qui doivent arriver chez quelqu’un d’autre, et tout cela qui tourne sans vous.',
  'converter.blog.all': 'Tous les articles',
  'converter.faq.eyebrow': 'FAQ',
  'converter.faq.title': 'Les questions que l’on se pose en arrivant',
  'converter.faq.blurb':
    'Ce qu’il advient du fichier, ce que contient le téléchargement, et ce qu’apporte un compte.',
  'converter.badge.converted': 'converti',
  'converter.badge.merged': '{count} fichiers fusionnés',
  'converter.newfile': 'Nouveau fichier',
  'converter.share': 'Partager',
  'converter.share.hint': 'Partager un lien vers ce document',
  'converter.share.hint.signedout':
    'Connectez-vous pour partager — le partage suppose le document dans votre compte',
  'converter.copy': 'Copier {format}',
  'converter.copy.done': '{format} copié dans le presse-papiers',
  'converter.download': 'Télécharger .{format}',
  'converter.download.more': 'Autres formats',
  'converter.download.done': '{format} téléchargé',
  'converter.print': 'Imprimer ou enregistrer en PDF',
  'converter.print.error': 'Ouverture de la boîte d’impression impossible',
  'converter.print.error.hint': 'Essayez plutôt de le télécharger.',
  'converter.tab.preview': 'Aperçu',
  'converter.tab.html': 'Source HTML',
  'converter.tab.markdown': 'Markdown',
  'converter.fullscreen.enter': 'Lire en plein écran',
  'converter.fullscreen.exit': 'Quitter le plein écran',
  'converter.fullscreen.error': 'Le plein écran n’est pas disponible ici',

  /*
   * Quand un fichier ne passe pas : ce qui a été déposé, ce qui était trop volumineux, ce que la
   * conversion elle-même avait à dire, et ce qu’est un document converti mais trop gros pour être
   * conservé.
   *
   * La raison est toujours une deuxième phrase plutôt qu’une proposition accrochée à la première,
   * parce que le toast a deux lignes et qu’une raison est ce sur quoi on peut agir. `{conversion}`
   * est le nom venu de `content.conversions`, donc l’échec dit « Word → Markdown n’a pas
   * fonctionné » dans toutes les langues.
   */
  'converter.reject.title': 'Ce fichier ne peut pas être converti ici',
  'converter.reject.extension': '{name} — cette page accepte {extensions}.',
  'converter.reject.mixed':
    'Ce sont {count} types de fichiers différents. Convertissez un type à la fois.',
  'converter.toolarge.one': 'Fichier trop volumineux',
  'converter.toolarge.many': 'Ces fichiers sont trop volumineux',
  'converter.toolarge.detail': '{size} — la limite est de {limit} par document.',
  'converter.converted': 'Converti en {format}',
  'converter.notkept.title': 'Converti, mais non enregistré dans votre compte',
  'converter.notkept.detail':
    'Un document conservé peut atteindre {limit} ; celui-ci fait {size}. Téléchargez-le — il est prêt.',
  'converter.failed': '{conversion} n’a pas fonctionné',
  'converter.failed.detail': 'Le fichier n’a pas pu être lu.',
  'converter.error.norows': 'Ce fichier ne contient aucune ligne.',
  /* `{why}` est ce que le convertisseur en dit lui-même, celui de mammoth pour un fichier Word. */
  'converter.error.empty': 'Ce document n’a rien produit — {why}.',
  'converter.error.empty.why': 'le fichier ne contient aucun texte',
  /* Le cadre depuis lequel un PDF est imprimé : jamais vu, lu par un lecteur d’écran. */
  'converter.print.frame': '{name}, pour l’impression',
  'converter.print.unprepared':
    'Préparation du document pour l’impression impossible.',

  /*
   * Ce dont le document est fait, un nom par décompte. Le nombre est un élément à part sur la
   * ligne — il est en gras — donc le mot se traduit seul et non dans une phrase à trou.
   */
  'converter.stats.word': 'mot',
  'converter.stats.words': 'mots',
  'converter.stats.heading': 'titre',
  'converter.stats.headings': 'titres',
  'converter.stats.table': 'tableau',
  'converter.stats.tables': 'tableaux',
  'converter.stats.codeblock': 'bloc de code',
  'converter.stats.codeblocks': 'blocs de code',
  'converter.stats.link': 'lien',
  'converter.stats.links': 'liens',
  'converter.stats.image': 'image',
  'converter.stats.images': 'images',

  /* La liste de tout ce qui a été converti : son en-tête, ses filtres, ses lignes, ses colonnes. */
  'history.title': 'Historique',
  'history.synced': 'Enregistré dans votre compte',
  'history.local':
    'Conservé dans ce navigateur — connectez-vous pour y accéder partout',
  'history.usage':
    '· {bytes} sur {maxBytes} · {documents} sur {maxDocuments} documents',
  'history.empty.title': 'Aucune conversion pour l’instant',
  'history.empty.synced':
    'Chaque fichier converti est enregistré dans votre compte — ouvrez-le depuis n’importe quel appareil.',
  'history.empty.local':
    'Chaque fichier converti apparaît ici. Connectez-vous pour garder la liste d’un appareil à l’autre.',
  'history.empty.action': 'Convertir un fichier',
  'history.drop.title': 'Déposer des fichiers',
  'history.drop.hint':
    'ou cliquez pour parcourir — plusieurs fichiers sont enchaînés en un seul document',
  'history.search.placeholder': 'Rechercher par nom',
  'history.search.label': 'Rechercher dans l’historique par nom de fichier',
  'history.search.clear': 'Effacer la recherche',
  'history.chip.all': 'Tous les formats',
  'history.chip.shared': 'Partagés avec moi',
  'history.shared.one': '{count} document partagé avec vous',
  'history.shared.many': '{count} documents partagés avec vous',
  'history.count.one': '{count} fichier',
  'history.count.many': '{count} fichiers',
  'history.count.filtered.one': '{found} fichier sur {total}',
  'history.count.filtered.many': '{found} fichiers sur {total}',
  'history.merge': 'Fusionner',
  'history.merge.hint':
    'Enchaîner les fichiers sélectionnés en un seul document, du plus ancien au plus récent',
  'history.merge.hint.few': 'Choisissez au moins deux fichiers à enchaîner',
  'history.download': 'Télécharger',
  'history.delete': 'Supprimer',
  'history.clear': 'Vider l’historique',
  'history.column.file': 'Fichier',
  'history.column.type': 'Type',
  'history.column.sharedby': 'Partagé par',
  'history.column.size': 'Taille source',
  'history.column.content': 'Contenu',
  'history.column.converted': 'Converti',
  'history.column.actions': 'Actions',
  'history.row.someone': 'quelqu’un',
  'history.row.select': 'Sélectionner {name}',
  'history.row.open': 'Ouvrir l’aperçu',
  'history.row.open.label': 'Ouvrir {name}',
  'history.row.unavailable':
    'Source trop volumineuse pour être conservée localement',
  'history.row.share': 'Partager',
  'history.row.share.label': 'Partager {name}',
  'history.row.download.label': 'Télécharger {name}',
  'history.row.remove': 'Retirer de l’historique',
  'history.row.stats.one': '{words} mots · {headings} titre',
  'history.row.stats.many': '{words} mots · {headings} titres',

  /*
   * Ce que la liste dit quand elle a fait quelque chose, ou n’a pas pu.
   *
   * `history.error.*` appartiennent à `useHistory` : le hook n’a pas de mots à lui, l’écran lui
   * passe un `t` et il rend compte dans la langue du lecteur. Le refus d’un serveur est repris
   * comme le `{reason}` de l’une de ces phrases plutôt qu’affiché seul, puisqu’il arrive en
   * anglais quelle que soit la langue du lecteur — et `history.error.delete.reason` tient la place
   * quand il ne dit rien.
   */
  'history.error.load': 'Chargement de l’historique impossible',
  'history.error.save': 'Enregistrement du fichier impossible',
  'history.error.delete': 'Suppression impossible : {reason}',
  'history.error.delete.reason': 'refus du serveur',
  'history.error.delete.some':
    '{failed} fichiers sur {total} n’ont pas pu être supprimés',
  'history.error.clear': 'Vidage de l’historique impossible',
  'history.source.missing': 'La source de ce fichier n’est plus disponible',
  'history.download.done': 'Fichier téléchargé',
  'history.download.none': 'Aucun téléchargement possible',
  'history.download.one': 'Fichier {format} téléchargé',
  'history.download.many': '{count} fichiers {format} téléchargés',
  'history.merge.none': 'Rien à fusionner',
  'history.merge.none.detail':
    'Les sources de ces fichiers ne sont plus disponibles.',
  'history.removed.one': 'Fichier retiré',
  'history.removed.many': '{count} fichiers retirés',
  'history.cleared': 'Historique vidé',

  /*
   * L’index du blog. Les articles eux-mêmes ne sont pas dans le catalogue — voir `content.ts` —
   * donc le titre, la description et l’étiquette d’une carte restent l’anglais dans lequel le
   * texte a été écrit, et seul le mobilier autour est ici.
   */
  'blog.eyebrow': 'Blog',
  'blog.title': 'Le Markdown, et quoi en faire',
  'blog.blurb':
    'Conversion, syntaxe qui casse, publication, et tout cela qui tourne sans vous.',
  'blog.chip.all': 'Tout',
  'blog.empty': 'Rien sous cette étiquette pour l’instant.',
  'blog.card.meta': '{date} · {minutes} min de lecture',

  /* Un article : le mobilier autour d’un texte qui reste en anglais. */
  'article.toc': 'Dans cet article',
  'article.meta': '{date} · {minutes} min de lecture',
  'article.meta.updated':
    '{date} · mis à jour le {updated} · {minutes} min de lecture',
  'article.share': 'Partager',
  'article.cta.text':
    'Cette page a été écrite en Markdown et rendue par le convertisseur qu’elle décrit.',
  'article.cta.button': 'Convertir un fichier',
  'article.more.eyebrow': 'Suite',
  'article.more.title': 'Continuer la lecture',
  'article.more.meta': '{minutes} min de lecture',
  'article.missing.title': 'Article introuvable',
  'article.missing.blurb':
    'Il a peut-être été renommé. L’index contient tout ce qui existe.',
  'article.missing.back': 'Retour au blog',

  /*
   * Les cinq pages qui ne sont que des mots. Leur texte est dans `pages.ts`, par page ; ces deux
   * clés sont ce que le rendu dit autour.
   *
   * La phrase de clôture est coupée parce qu’un lien se trouve dedans : `page.questions` est la
   * phrase jusqu’au lien et `page.questions.link` les mots que porte l’ancre.
   */
  'page.updated': 'Dernière mise à jour le {date}',
  'page.questions': 'Toute question à ce sujet est à adresser à',
  'page.questions.link': 'les tickets du dépôt',

  /*
   * Un document que quelqu’un vous a envoyé, à /open/<token>.
   *
   * C’est un écran de l’application, donc il suit la langue du lecteur comme tous les autres. Le
   * texte que le serveur rend à /s/<token> est une autre page, pour un lecteur dont on ne sait
   * rien, et ses mots ne sont pas ici — voir `src/lib/i18n/content.ts`.
   *
   * Son bouton de téléchargement et son bouton de connexion disent ce que ces boutons disent
   * partout ailleurs : ils lisent `converter.download` et `header.signin` plutôt que des clés à
   * eux.
   */
  'shared.loading': 'Ouverture du document…',
  'shared.meta': 'partagé · converti le {date}',
  'shared.signin.title': 'Ce document est partagé avec des personnes précises',
  'shared.signin.detail':
    'Connectez-vous avec l’adresse à laquelle il a été partagé.',
  'shared.missing.title': 'Ce lien n’ouvre aucun document',
  'shared.missing.action': 'Convertir votre propre fichier',

  /* Le partage d’un document. */
  'dialog.share.title': 'Partager',
  'dialog.share.mode.private': 'Privé',
  'dialog.share.mode.link': 'Toute personne ayant le lien',
  'dialog.share.mode.people': 'Personnes précises',
  'dialog.share.private.note':
    'Vous seul pouvez ouvrir ce document. Choisissez un mode ci-dessus pour le partager.',
  'dialog.share.link': 'Lien',
  'dialog.share.link.field': 'Lien de partage',
  'dialog.share.link.note':
    'Toute personne ayant ce lien peut lire le document.',
  'dialog.share.people.note':
    'Seules les personnes ci-dessous peuvent l’ouvrir, après s’être connectées avec cette adresse. Envoyez-leur le lien vous-même — l’application n’écrit à personne.',
  'dialog.share.people.empty':
    'Personne pour l’instant — le lien ne s’ouvre que pour vous.',
  'dialog.share.email.label': 'Adresse du destinataire',
  'dialog.share.add': 'Ajouter',
  'dialog.share.remove.label': 'Retirer {email}',
  'dialog.share.error': 'Le partage a échoué',

  /* Les clés API, et les assistants qui ont été admis. */
  'dialog.keys.title': 'Clés API',
  'dialog.keys.blurb':
    'Convertir et partager des documents depuis un script, un terminal ou la CI — et les assistants que vous avez connectés.',
  'dialog.keys.name.placeholder': 'Ce qui l’utilisera — « CI », « mon portable »',
  'dialog.keys.name.label': 'Nom de la clé',
  'dialog.keys.create': 'Créer',
  'dialog.keys.create.error': 'Création de la clé impossible',
  'dialog.keys.fresh': 'Copiez-la maintenant — elle ne sera plus affichée',
  'dialog.keys.empty':
    'Aucune clé pour l’instant. Une clé peut lire, écrire et partager vos documents — elle ne peut toucher ni à votre compte ni à ces clés.',
  'dialog.keys.revoked': '{name} · révoquée',
  'dialog.keys.meta': '{prefix}… · {used}',
  'dialog.keys.used': 'utilisée {when}',
  'dialog.keys.never': 'jamais utilisée',
  'dialog.keys.forget': 'Retirer de la liste',
  'dialog.keys.forget.label': 'Retirer {name}',
  'dialog.keys.revoke': 'Révoquer — cesse de fonctionner immédiatement',
  'dialog.keys.revoke.label': 'Révoquer {name}',
  'dialog.keys.grants': 'Assistants connectés',
  'dialog.keys.grant.meta': 'connecté {since} · {used}',
  'dialog.keys.disconnect': 'Déconnecter — cesse aussitôt d’agir en votre nom',
  'dialog.keys.disconnect.label': 'Déconnecter {name}',

  /* Le pied du site. La colonne des conversions et les liens légaux tirent leurs mots d’ailleurs. */
  'footer.tagline':
    'Documents Markdown, HTML, Word, CSV et JSON, convertis dans votre navigateur.',
  'footer.builtby': 'Réalisé par Raudar Labs.',
  'footer.note': '© Raudar Labs {year}',
  'footer.converter': 'Convertisseur',
  'footer.resources': 'Ressources',
  'footer.company': 'Société',
  'footer.legal': 'Mentions légales',
  'footer.docs': 'Documentation',
  'footer.blog': 'Blog',
  'footer.git': 'Git',
  /* Lu après le nom du lien, donc commence par l’espace qui les sépare. */
  'footer.external': ' (s’ouvre dans un nouvel onglet)',
};
