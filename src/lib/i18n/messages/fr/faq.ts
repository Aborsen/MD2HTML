import type { Content } from '../../content';

/*
 * La FAQ en français : une question et sa réponse par entrée.
 *
 * L’ordre est celui que déclare `FAQ_ENTRIES` dans `src/lib/faq.ts`, et c’est la position qui relie
 * une entrée d’ici à son drapeau là-bas — une question n’a pas d’identifiant, donc la liste est
 * l’identifiant. Une entrée ajoutée ou déplacée ici doit l’être là-bas, et dans toutes les autres
 * langues, à la même position.
 *
 * Des chaînes simples, pas des nœuds : le même tableau est lu par le serveur, où il n’y a pas de
 * React.
 */
export const faq: Content['faq'] = [
  {
    question: 'Que peut-il convertir ?',
    answer:
      'Cinq choses, chacune avec sa page sous Convertisseur dans l’en-tête : Markdown vers HTML, et HTML, Word (.docx), CSV ou TSV, et JSON vers Markdown. Tout sauf la première finit en Markdown, qui est la forme sous laquelle un document est ici conservé, prévisualisé et partagé — un fichier Word, un tableur et une réponse d’API deviennent donc la même sorte de chose une fois entrés.',
  },
  {
    question: 'Mon fichier est-il téléversé quelque part ?',
    answer:
      'Déconnecté, non. Le fichier est lu par ce navigateur, converti ici, et jamais envoyé à un serveur — fermez l’onglet et il n’en reste rien ailleurs que sur votre propre machine. Connecté, la source Markdown est conservée dans votre compte pour que le document puisse vous suivre sur un autre appareil, et elle reste privée jusqu’à ce que vous la partagiez.',
  },
  {
    question: 'Quel Markdown comprend-il ?',
    answer:
      'Le GitHub Flavored Markdown, dans les deux sens : tableaux, listes de tâches, texte barré, liens automatiques et blocs de code délimités, en plus de tout ce que définit CommonMark. Le HTML brut à l’intérieur du document passe d’abord par un nettoyeur, de sorte qu’une balise script dans un fichier que quelqu’un vous a envoyé ne peut pas s’exécuter.',
  },
  {
    question: 'Qu’obtient-on exactement en téléchargeant ?',
    answer:
      'Ce que la conversion a produit, d’abord : un fichier .html quand vous avez converti vers HTML, un fichier .md quand vous avez converti vers Markdown. La flèche à côté du bouton contient les autres — Markdown, HTML, texte brut, ou la boîte d’impression pour un PDF. Le HTML est un seul fichier avec ses styles à l’intérieur : aucun script, aucune police à récupérer, aucune requête d’aucune sorte, si bien qu’il s’ouvre à l’identique sur une machine sans réseau. Sur papier, il bascule toujours vers la palette claire, parce qu’une page sombre à l’impression est un mur d’encre.',
  },
  {
    question: 'Puis-je envoyer un document converti à quelqu’un ?',
    answer:
      'Connectez-vous et partagez-le, soit par un lien que tout le monde peut ouvrir, soit à l’adresse de personnes précises, qui se connectent alors avec cette adresse. Une page partagée est en lecture seule : le document et un téléchargement, rien d’autre. La révocation abandonne le lien, de sorte qu’un lien déjà envoyé cesse de fonctionner.',
  },
  {
    question: 'Y a-t-il une limite de taille ?',
    answer:
      '10 MB par fichier à convertir — environ 1,5 million de mots — parce que la conversion se fait sur votre propre machine. En conserver un dans un compte est plafonné à 4 MB, et ce n’est pas notre chiffre : la plateforme refuse d’emblée une requête plus grosse. Un fichier plus gros se convertit, s’affiche et se télécharge quand même ; il reste simplement hors de l’historique, et l’application le dit au lieu de faire croire qu’elle a enregistré. Un compte contient 500 documents ou 100 MB, selon ce qui arrive en premier. Atteindre une limite refuse l’écriture et le dit ; rien de ce que vous avez enregistré n’est jamais supprimé en silence pour faire de la place.',
  },
  {
    question: 'Puis-je convertir des fichiers depuis un script ?',
    answer:
      'Oui. Créez une clé API depuis le menu du compte et postez du Markdown vers /api/v1/documents ; il existe aussi un client en ligne de commande et une GitHub Action qui publie le Markdown qu’une pull request a modifié et en commente les liens. La documentation donne les points d’entrée et les options.',
  },
  {
    question: 'Combien cela coûte-t-il ?',
    answer:
      'Rien. Convertir et télécharger fonctionnent sans compte du tout ; un compte ajoute l’historique, le partage et l’API, dans les limites ci-dessus.',
  },
];
