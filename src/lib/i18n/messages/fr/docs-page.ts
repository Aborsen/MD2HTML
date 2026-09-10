/*
 * La prose du manuel — chaque mot que la page /docs dit pour son propre compte, en français.
 *
 * Un fichier à part plutôt qu’un coin de `ui.ts`, comme en anglais : c’est de loin le plus grand
 * écran du produit, et soixante-quinze entrées dans `ui.ts` enterreraient tous les autres. Le
 * contenu est étalé dans `ui` par `index.ts`, donc `useT()` atteint ces clés comme n’importe quelle
 * autre chaîne d’interface.
 *
 * Une phrase qui enveloppe un bout de code, un libellé en gras ou un mot mis en valeur est UNE
 * entrée avec un `{placeholder}` là où l’élément se place, jamais trois fragments — c’est ce qui
 * permet au français de mettre le chemin, le verbe et l’en-tête dans son propre ordre. Les éléments
 * eux-mêmes — chemins, options, en-têtes, extensions, points d’entrée — restent dans le JSX de la
 * page, parce qu’aucun d’eux n’est un mot que l’on traduit.
 */

export const docsPage = {
  /* Le haut de la page. */
  'docs.eyebrow': 'Documentation',
  /* The contents column beside the manual. Not 'In this article' — this is not one. */
  'docs.toc': 'Sur cette page',

  'docs.title': 'Tout ce que fait TransformPipe',
  'docs.lede':
    'Markdown, HTML, Word, CSV ou JSON en entrée — un document en sortie, en HTML, en Markdown, en texte brut ou à l’impression. Depuis cette page, depuis un terminal, depuis une pull request ou depuis un assistant. C’est tout ce qu’il y a ; rien ici n’est derrière un abonnement.',

  /* Sous chaque capture, après la légende. */
  'docs.shot.enlarge': '— cliquer pour agrandir',

  /* Le filtre qui apparaît dans deux sections, Historique et Partage, et doit se lire pareil. */
  'docs.chip.shared': 'Partagés avec moi',

  'docs.start.signedOut':
    'Déposez un fichier sur le convertisseur et vous avez le document converti et un téléchargement. Déconnecté, rien n’est conservé et rien n’est envoyé où que ce soit — la conversion tourne dans ce navigateur, sur votre propre machine.',
  'docs.start.signedIn':
    'Connectez-vous avec Google et les mêmes documents vous suivent d’un appareil à l’autre, peuvent être partagés par lien ou par adresse, et sont accessibles à un script muni d’une clé API. Ce que vous avez converti avant de vous connecter passe dans le compte au passage.',

  /** `{menu}` est l’entrée Convertisseur de l’en-tête, en gras. */
  'docs.converting.intro':
    '{menu} dans l’en-tête énumère ce que cette application convertit. Chacune a sa page, sa zone de dépôt et son adresse, de sorte qu’une conversion se met en lien et en favori au lieu d’être reconfigurée :',
  'docs.converting.menu': 'Convertisseur',
  /** `{docx}` est l’extension elle-même. */
  'docs.converting.sizes':
    'Jusqu’à 10 MB par fichier. Déposez plusieurs fichiers Markdown à la fois et ils sont enchaînés en un seul document, dans l’ordre où ils arrivent, séparés par un filet. Déposez un fichier que la page ne prend pas — un {docx} sur la page Markdown, par exemple — et il part vers la conversion qui le prend au lieu d’être refusé ; un mélange de genres est refusé, parce qu’enchaîner un tableur à la suite d’un document Word n’est l’intention de personne.',
  'docs.converting.oneShape':
    'Tout finit en Markdown, et c’est délibéré : c’est la forme sous laquelle un document est conservé, prévisualisé, partagé et atteint par un script, si bien que toute l’application tient sur une seule forme au lieu de quatre.',
  'docs.converting.shot.converter.alt':
    'Le convertisseur TransformPipe avec une zone de dépôt vide',
  'docs.converting.shot.converter.caption':
    'Le convertisseur. Le logo sert aussi de « tout reprendre ».',
  'docs.converting.flavour':
    'Ce qui sort est du GitHub Flavored Markdown : tableaux, listes de tâches, texte barré, liens automatiques, code délimité. L’aperçu est le document lui-même, mis en forme avec les mêmes jetons que l’application, si bien qu’une application sombre livre une page sombre — et l’impression bascule toujours en clair, parce qu’une page sombre sur papier est un mur d’encre.',
  'docs.converting.shot.preview.alt':
    'Un document converti affiché dans l’onglet aperçu',
  'docs.converting.shot.preview.caption':
    'L’aperçu, avec les décomptes que le document a réellement.',
  /** `{to}` est le mot ci-dessous, mis en valeur au milieu de la phrase. */
  'docs.converting.source':
    'L’onglet source n’est pas un résumé de la sortie. C’est exactement ce que le téléchargement livre — le HTML autonome quand vous avez converti {to} HTML, le Markdown quand vous avez converti vers Markdown : un seul document, styles à l’intérieur, aucun script, aucun réseau.',
  'docs.converting.source.emphasis': 'vers',
  /** `{html}` et `{md}` sont les deux extensions. */
  'docs.converting.download':
    'Le bouton de téléchargement porte le format que la conversion a produit — {html} sur la page Markdown, {md} sur les autres — et la flèche à côté contient le reste : Markdown, HTML, texte brut, et l’impression. L’impression construit le fichier exporté dans un cadre à part et ouvre la boîte de dialogue du navigateur, si bien qu’un PDF est le document et non une capture de l’application autour ; sur papier, l’export bascule vers une palette claire quel que soit le réglage de l’application.',
  'docs.converting.shot.source.alt':
    'L’onglet source HTML montrant le document autonome',
  'docs.converting.shot.source.caption':
    'L’onglet source HTML : ce que vous obtenez, avant de l’obtenir.',
  'docs.converting.reading':
    'Pour lire plutôt que pour vérifier, l’aperçu passe en plein écran et garde une largeur lisible ; Échap revient en arrière. Un long document se dote d’un bouton de retour en haut, dans les deux vues.',

  'docs.history.intro':
    'Chaque conversion atterrit dans l’historique — dans votre compte quand vous êtes connecté, dans ce navigateur sinon. La recherche porte sur les noms de fichiers, les colonnes se trient, et une ligne ouvre le document.',
  'docs.history.shot.history.alt':
    'La liste de l’historique avec la recherche, les filtres et les colonnes triables',
  'docs.history.shot.history.caption':
    'HTML ou Markdown, recherche, colonnes triables.',
  /**
   * `{all}` et `{shared}` sont les deux filtres toujours présents, `{badge}` le badge de format
   * d’une ligne — les codes de format restent dans la page.
   */
  'docs.history.chips':
    'Les filtres trient par provenance du document : {all} pour commencer, puis un filtre par conversion qui a réellement des lignes, et {shared} pour les fichiers que quelqu’un vous a envoyés. Le badge d’une ligne dit la même chose — {badge} sur un fichier Word — de sorte qu’une liste de trente documents indique encore lequel est lequel.',
  'docs.history.chip.all': 'Tous les formats',
  'docs.history.downloading':
    'Le téléchargement est un menu plutôt qu’un filtre : seul le Markdown est conservé, et le HTML et le texte brut sont construits sur le moment, de sorte qu’une même ligne peut livrer l’un des trois sans en garder trois copies.',
  'docs.history.selection':
    'Cochez des lignes et la barre de sélection apparaît : les fusionner en un seul document, les télécharger, ou les supprimer. La fusion garde l’ordre de la liste.',
  'docs.history.shot.selection.alt':
    'Deux lignes sélectionnées, avec la barre d’actions groupées',
  'docs.history.shot.selection.caption':
    'Fusion, téléchargement et suppression groupés.',

  /** `{anyone}` et `{only}` sont les deux modes, en gras ; `{path}` l’adresse d’un partage. */
  'docs.sharing.modes':
    '{anyone} publie le document à {path} — une page en lecture seule avec le document et un téléchargement, rien d’autre. {only} demande au lecteur de se connecter avec une adresse que vous avez listée.',
  'docs.sharing.mode.link': 'Toute personne ayant le lien',
  'docs.sharing.mode.people': 'Seulement ces adresses',
  'docs.sharing.revoking':
    'La révocation abandonne le jeton, de sorte qu’un lien déjà envoyé cesse de fonctionner ; partager à nouveau en frappe un autre. Aucun e-mail n’est jamais envoyé — vous transmettez le lien vous-même.',
  /** `{shared}` est le filtre nommé dans `docs.chip.shared`. */
  'docs.sharing.incoming':
    'Les documents que d’autres vous ont adressés apparaissent sous le filtre {shared}, avec le nom de qui a partagé chacun. Ils sont en lecture seule : ouvrir et télécharger, pas de suppression, pas de repartage. Un partage par lien appartient à qui détient le lien, il n’apparaît donc sur la liste de personne.',
  /** `{csp}` est la directive Content-Security-Policy elle-même. */
  'docs.sharing.safety':
    'Une page partagée porte le contenu de quelqu’un sur notre domaine, elle est donc servie avec {csp} et ne peut pas être mise dans un cadre, et chacune renvoie vers un formulaire de signalement qui ne demande aucun JavaScript. Rien n’est révoqué automatiquement : un signalement est l’affirmation d’un inconnu sur le document d’un autre, et les deux erreurs — laisser une mauvaise page en ligne, tuer un lien innocent — méritent qu’une personne le lise d’abord.',

  'docs.account.signIn':
    'La connexion passe par Google, via Neon Auth. Le menu du compte contient le thème (sombre par défaut, mémorisé par navigateur), les clés API, et la sortie.',
  'docs.account.keys':
    'Une clé est affichée une seule fois et n’est conservée que sous forme de hachage. Elle atteint les documents et les partages — jamais le compte ni les clés elles-mêmes, de sorte qu’une clé qui a fui ne peut ni frapper son propre remplacement ni vous mettre dehors. Une révocation prend effet à la requête suivante.',

  /** `{auth}` est l’en-tête Authorization, tel qu’il est envoyé. */
  'docs.api.intro':
    'Tout ce que fait l’application, un script peut le faire. Envoyez la clé dans {auth} ; une session de navigateur fonctionne aussi, de sorte que les mêmes points d’entrée s’essaient en étant connecté.',
  /*
   * Le tableau des points d’entrée. Les termes sont les points d’entrée, qui restent dans la page ;
   * voici les explications à côté. Les espaces réservés sont des paramètres et des formes JSON.
   */
  'docs.api.post':
    'Le Markdown en corps de requête ({name}) ou en JSON {json}. {share} le publie dans le même appel. {kindHtml}, {kindCsv}, {kindJson} ou {word} convertit d’abord le corps, de sorte qu’une page, un tableur, une réponse d’API ou un {docx} se poste tel quel.',
  'docs.api.list':
    'Les 500 plus récents, avec les tailles, les décomptes et l’état de partage.',
  'docs.api.one': 'Les métadonnées et la source Markdown.',
  'docs.api.html': 'Le document autonome. {theme} en option.',
  'docs.api.delete': 'Retire la ligne et sa source conservée.',
  'docs.api.share': '{modes}. {private} abandonne le jeton.',
  'docs.api.usage': 'Ce que le compte utilise, face aux limites.',
  /** `{shape}` est le corps d’erreur lui-même. */
  'docs.api.errors':
    'Les erreurs sont {shape} avec un statut qui dit ce qu’il veut dire : 401 clé inconnue, 404 pas à vous, 413 le document dépasse 4 MB, 403 le compte n’a plus de place, 429 trop vite, 410 la source a disparu.',

  /** `{cli}` est le chemin du client dans le dépôt. */
  'docs.cli.intro':
    '{cli} dans le dépôt est la même API avec un visage plus aimable, et sans dépendances — un outil qui tourne en CI ne devrait pas traîner un arbre de paquets derrière lui.',
  /** Les espaces réservés sont les quatre extensions converties, celle qui est refusée, et l’option. */
  'docs.cli.extensions':
    'Un {html}, {csv}, {tsv} ou {json} poussé est converti par le point d’entrée au lieu d’être conservé comme s’il était déjà du Markdown ; un {docx} est refusé, avec l’adresse de la page qui sait le lire. {merge} n’enchaîne que du Markdown.',
  /** Les espaces réservés sont l’option, la variable, le fichier de config, la variable d’hôte et l’option. */
  'docs.cli.key':
    'La clé vient de {key}, puis de {env}, puis de {config}. {host} le pointe vers un autre déploiement, et {json} affiche la réponse même de l’API.',

  'docs.action.intro':
    'Sans liste de fichiers, l’action publie le Markdown qu’une pull request a modifié et en commente les liens — pour qu’un relecteur ouvre le document rendu au lieu de lire un diff d’astérisques.',
  /** `{example}` est le fichier de workflow ; `{depth}` et `{permission}` les deux réglages YAML. */
  'docs.action.workflow':
    '{example} est un workflow complet à copier. Le checkout a besoin de {depth} pour le commit de base auquel la liste de fichiers est comparée, et le commentaire a besoin de {permission}.',
  /* Le tableau des entrées. Les termes sont les noms des entrées, qui restent dans la page. */
  'docs.action.input.apiKey': 'Obligatoire. À garder dans un secret du dépôt.',
  'docs.action.input.files':
    'Chemins séparés par des espaces. Par défaut, ce qu’a modifié la pull request.',
  /** Les espaces réservés sont les trois valeurs que prend l’entrée. */
  'docs.action.input.share':
    '{link} (par défaut), {people}, ou {none} pour publier en privé.',
  'docs.action.input.merge':
    'Enchaîner les fichiers en un seul document au lieu d’un par fichier.',
  'docs.action.input.comment': 'Commenter les liens sur la pull request.',
  'docs.action.input.host': 'Un autre déploiement de transformpipe.',
  'docs.action.pushes':
    'Un push publie de nouveaux documents au lieu d’écraser les anciens, de sorte qu’un lien dans un commentaire plus ancien continue de montrer ce que disait ce commit.',

  /** `{path}` est l’adresse du connecteur, qui vient de `mcp-facts.ts`. */
  'docs.assistant.intro':
    'TransformPipe est un serveur MCP, il peut donc être ajouté à Claude comme connecteur. L’adresse est ce déploiement suivi de {path} :',
  'docs.assistant.adding':
    'Sur claude.ai, cela se met dans Réglages → Connecteurs → Ajouter un connecteur personnalisé. Depuis un terminal :',
  'docs.assistant.auth':
    'Il n’y a aucune clé à coller. Le premier appel revient non autorisé, votre assistant suit cela jusqu’à une page ici, et vous vous connectez avec le compte que vous utilisez déjà et approuvez un client nommé — c’est pourquoi la page vous dit au nom de quelle adresse il s’apprête à agir. Ce qu’il obtient est un jeton de notre part, valable pour vos documents et rien d’autre : pas votre compte, pas votre connexion, et pas vos clés API. Déconnectez-le depuis le menu du compte, sous Connecteur MCP, et il cesse de fonctionner au prochain appel.',
  'docs.assistant.tools':
    'Les outils sont le même code que l’API ci-dessus, appelé dans le processus, de sorte qu’une conversation et un script obtiennent la même réponse. Deux d’entre eux sont taillés pour les dégâts qu’ils peuvent faire : le partage publie une page sur le web public, et la suppression exige une confirmation explicite et retire exactement un document.',

  /* Le tableau des limites : chaque terme et le chiffre à côté. */
  'docs.embed.intro':
    'Un iframe. Aucun script à charger, rien à installer et aucun compte : l’intégration est volontairement anonyme, car une page sur un autre domaine capable d’atteindre les documents de quelqu’un serait un mauvais échange.',
  'docs.embed.params':
    '{conversion} choisit laquelle des cinq, {theme} laisse la page hôte choisir la palette au lieu de suivre le système du visiteur, et un préfixe de langue fonctionne comme partout ailleurs — {locale}.',
  'docs.embed.messages':
    'Le résultat sort par {post} : {ready} au chargement, puis {converted} avec le nom, le Markdown, le HTML et les décomptes, ou {error}. Chaque message porte {source}, car une page à l’écoute de {window} entend chacun de ses cadres et ses propres scripts — et vérifiez {origin} contre ce site, ce que personne ne peut faire à votre place.',
  'docs.embed.frames':
    'Seul {embed} peut être placé dans un cadre. Toutes les autres pages de ce site répondent {ancestors}, afin que rien ici ne puisse être déguisé en page d’autrui.',

  'docs.limits.account.term': 'Par compte',
  'docs.limits.account.text': '100 MB de Markdown, 500 documents',
  'docs.limits.convert.term': 'Par conversion',
  'docs.limits.convert.text':
    '10 MB — environ 1,5 million de mots. Plusieurs fichiers déposés ensemble comptent pour le seul document qu’ils deviennent',
  'docs.limits.document.term': 'Par document conservé',
  'docs.limits.document.text':
    '4 MB, et pas de notre fait : une Vercel Function refuse une requête ou un corps de réponse de plus de 4,5 MB avant que rien de ce code ne tourne, de sorte qu’un document plus gros ne pourrait être ni enregistré ni relu. Il se convertit, s’affiche et se télécharge quand même — il reste hors de l’historique, et l’application le dit au lieu d’annoncer un enregistrement qui n’a pas eu lieu',
  'docs.limits.caller.term': 'Par appelant',
  'docs.limits.caller.text':
    '60 requêtes par minute, comptées par clé ou par session',
  'docs.limits.refusal':
    'Atteindre une limite est un refus, pas une éviction silencieuse. Cette application supprimait autrefois le document le plus ancien pour rester sous son plafond, ce qui détruisait en silence quelque chose que son propriétaire avait choisi de garder ; maintenant elle dit quoi supprimer à la place.',

  'docs.faq.intro':
    'Les mêmes réponses que le convertisseur affiche sous sa zone de dépôt — un seul jeu, pour que les deux pages ne puissent pas diverger.',

  'docs.footer.source': 'Sources et tickets :',
};
