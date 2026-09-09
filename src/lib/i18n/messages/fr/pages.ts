import type { Content } from '../../content';

/*
 * Les mots des cinq pages qui ne sont que des mots : à propos, contact, et les trois pages légales.
 *
 * `src/lib/pages.ts` garde ce qu’une page *est* — son identifiant, son adresse, et la date que les
 * trois pages légales annoncent — et ce fichier garde ce qu’une page *dit*.
 *
 * Les trois pages légales sont une politique. Elles sont traduites, pas réécrites : même nombre de
 * paragraphes, même portée, aucune exception ajoutée ni retirée.
 */

export const pages: Content['pages'] = {
  about: {
    label: 'À propos',
    title: 'À propos de TransformPipe',
    lede: 'Un convertisseur qui fait le travail dans votre navigateur et ne se met pas en travers.',
    sections: [
      {
        heading: 'Ce que c’est',
        body: [
          'TransformPipe transforme des documents en d’autres documents. Du Markdown en page HTML finie, et du HTML, des fichiers Word, des tableurs et du JSON en Markdown. Déposez un fichier, voyez ce qu’il est devenu, emportez-le en Markdown, en HTML, en texte brut ou en PDF.',
          'Tout se ramène au Markdown, parce que le Markdown est un format qui se lit, qui se compare ligne à ligne, et qui se garde vingt ans sans posséder l’outil qui l’a produit.',
        ],
      },
      {
        heading: 'Pourquoi de cette manière',
        body: [
          'La conversion tourne dans votre navigateur. Déconnecté, aucun fichier n’est envoyé où que ce soit — il n’y a pas de téléversement à qui faire confiance, parce qu’il n’y a pas de téléversement. Connectez-vous et le Markdown est conservé dans votre compte pour qu’un document vous suive sur une autre machine, et il reste privé jusqu’à ce que vous le partagiez.',
          'Le HTML exporté est un seul fichier, ses styles à l’intérieur. Il ne demande rien au réseau, ce qui veut dire qu’il s’ouvrira dans cinq ans sur un portable sans connexion exactement comme aujourd’hui.',
        ],
      },
      {
        heading: 'Au-delà de l’application',
        body: [
          'Les mêmes conversions sont accessibles depuis un terminal, depuis une pull request et depuis un assistant : il y a une API publique, un client en ligne de commande sans dépendances, une GitHub Action qui publie le Markdown qu’une pull request a modifié, et un serveur MCP pour qu’un modèle puisse convertir et partager des documents en votre nom. La documentation couvre tout cela.',
        ],
      },
      {
        heading: 'Qui le construit',
        body: [
          'TransformPipe est réalisé par Raudar Labs.',
        ],
      },
    ],
    seo: {
      title: 'À propos de TransformPipe',
      description:
        'TransformPipe convertit Markdown, HTML, Word, CSV et JSON dans votre navigateur, avec une API, une CLI, une GitHub Action et un serveur MCP. Par Raudar Labs.',
    },
  },
  contact: {
    label: 'Nous contacter',
    title: 'Nous contacter',
    lede: 'Un bug, un format qui manque, ou quelque chose qui ne devrait pas être publié.',
    sections: [
      {
        heading: 'Bugs et demandes',
        body: [
          'Ouvrez un ticket sur le dépôt. Un fichier mal converti est ce que vous pouvez envoyer de plus utile — joignez-le si vous pouvez le partager, et dites ce que vous attendiez à la place.',
          'Un format que nous ne convertissons pas encore est une demande qui vaut la peine d’être faite. Plusieurs de ceux qui sont là ont commencé ainsi.',
        ],
      },
      {
        heading: 'Un partage qui ne devrait pas exister',
        body: [
          'Chaque document partagé porte un lien « Signaler ce document » au bas de la page qu’il ouvre. C’est la voie la plus rapide : il identifie le document sans que vous ayez à le décrire.',
        ],
      },
      {
        heading: 'Confidentialité et questions légales',
        body: [
          'Les questions sur ce qui est conservé, ou une demande de suppression d’un compte et de tout ce qu’il contient, vont au même endroit. Connecté, vous pouvez aussi supprimer vous-même n’importe quel document — cela retire la ligne et la source conservée ensemble.',
        ],
      },
    ],
    seo: {
      title: 'Contacter TransformPipe',
      description:
        'Signaler un bug, demander un format, signaler un document partagé, ou demander ce qui est conservé et le faire supprimer.',
    },
  },
  privacy: {
    label: 'Confidentialité',
    title: 'Confidentialité',
    lede: 'Ce qui est conservé, où, et ce qui n’est jamais collecté du tout.',
    sections: [
      {
        heading: 'Déconnecté, rien ne nous parvient',
        body: [
          'La conversion se fait dans votre navigateur. Le fichier est lu, converti et rendu sur votre propre machine, et rien n’en est envoyé à un serveur. L’historique que vous voyez est le stockage de votre navigateur, pas un compte.',
        ],
      },
      {
        heading: 'Connecté, ceci et rien de plus',
        body: [
          'Un compte existe pour que les documents puissent vous suivre d’un appareil à l’autre et être partagés. Il contient :',
        ],
        items: [
          'Votre identité venue de Google, par l’intermédiaire de notre prestataire d’authentification : une adresse e-mail, un nom et un identifiant de compte. Nous ne voyons ni ne conservons jamais de mot de passe.',
          'Pour chaque document conservé : son nom, la conversion qui l’a produit, sa taille, le nombre de mots, de titres, de liens, de blocs de code, de tableaux et d’images, et sa date de création.',
          'Le Markdown lui-même, dans un stockage d’objets privé — privé signifiant qu’il n’a pas d’URL publique et n’est lu qu’au travers d’une requête que nous autorisons.',
          'Les clés API sous forme de hachages, jamais la clé. Une clé n’est affichée qu’une fois, à sa création, et ne peut plus être retrouvée ensuite — ni par vous, ni par nous.',
          'Les réglages de partage : si un document est privé, ouvert par lien, ou adressé à des adresses e-mail précises, et le jeton que porte un lien.',
        ],
      },
      {
        heading: 'Ce que nous ne faisons pas',
        body: [
          'Il n’y a sur ce site ni mesure d’audience, ni publicité, ni pixel de suivi, ni script tiers — pas un jeu réduit : aucun. Rien n’est vendu, et rien n’est communiqué à personne en dehors de l’infrastructure qui fait tourner le service : la base de données, le stockage d’objets, le prestataire d’authentification et l’hébergeur.',
          'Vos documents ne sont pas lus par nous, et ils ne servent pas à entraîner quoi que ce soit.',
        ],
      },
      {
        heading: 'Cookies et stockage du navigateur',
        body: [
          'Un seul cookie de session, posé par notre prestataire d’authentification quand vous vous connectez, propriétaire et HttpOnly. Un cookie de courte durée existe pendant l’aller-retour de connexion et expire au bout de dix minutes. C’est tout — il n’y a rien d’optionnel à désactiver. La page cookies donne le détail.',
          'Votre thème et, quand vous êtes déconnecté, votre historique vivent dans le stockage local de votre navigateur. Ils n’en sortent jamais.',
        ],
      },
      {
        heading: 'Supprimer des choses',
        body: [
          'Supprimer un document supprime la ligne et le Markdown conservé ensemble, tout de suite, pas selon un calendrier. Révoquer un partage abandonne le jeton, de sorte qu’un lien déjà envoyé cesse de fonctionner.',
          'Pour retirer un compte et tout ce qu’il contient, demandez-le — voir la page de contact. Atteindre une limite de stockage refuse l’écriture ; cela ne supprime jamais quelque chose que vous avez choisi de garder pour faire de la place.',
        ],
      },
      {
        heading: 'Enfants',
        body: [
          'C’est un outil de travail, pas un service pour les enfants, et il ne s’adresse à personne de moins de 16 ans.',
        ],
      },
      {
        heading: 'Modifications',
        body: [
          'Si cette page change d’une manière qui touche à ce qui est collecté, la date ci-dessus change avec elle.',
        ],
      },
    ],
    seo: {
      title: 'Confidentialité — TransformPipe',
      description:
        'Déconnecté, rien ne quitte le navigateur. Connecté, nous conservons le document, ses métadonnées et votre identité Google — ni audience, ni suivi, ni script tiers.',
    },
  },
  terms: {
    label: 'Conditions',
    title: 'Conditions d’utilisation',
    lede: 'La version courte, parce qu’une longue ne serait pas lue.',
    sections: [
      {
        heading: 'Utiliser le service',
        body: [
          'TransformPipe est proposé gratuitement, tel quel. Utilisez-le pour tout ce que vous avez le droit de convertir, depuis l’application, l’API, la ligne de commande ou un assistant.',
          'Un compte est à vous, à garder ou à supprimer. Vous êtes responsable de ce que vous faites avec une clé API, alors traitez-la comme un mot de passe : quiconque la détient peut lire et écrire vos documents.',
        ],
      },
      {
        heading: 'Vos documents restent les vôtres',
        body: [
          'Vous conservez tous les droits que vous aviez sur un document avant de le convertir. Nous ne revendiquons aucune propriété et aucune licence au-delà de ce qu’exige le fonctionnement du service : le conserver pour que vous puissiez le rouvrir, et le servir à qui vous l’avez délibérément partagé.',
        ],
      },
      {
        heading: 'Ce qu’il ne faut pas mettre ici',
        body: [
          'N’utilisez pas le service pour un contenu illégal, que vous n’avez pas le droit de diffuser, ou qui existe pour nuire à quelqu’un — logiciel malveillant, matériel d’exploitation sexuelle d’enfants, harcèlement ciblé. N’utilisez pas un lien de partage pour faire tourner une page d’hameçonnage.',
          'Les documents partagés peuvent être signalés par quiconque les ouvre. Un document qui enfreint cette section peut être dépublié ou supprimé, et un compte récidiviste fermé.',
        ],
      },
      {
        heading: 'Limites et disponibilité',
        body: [
          'Des limites de débit et de stockage s’appliquent et sont publiées dans la documentation. Elles existent pour garder le service debout, et peuvent changer.',
          'Il n’y a aucune promesse de disponibilité. Le service peut être interrompu, et des fonctions peuvent changer ou être retirées. Gardez votre propre copie de tout ce que vous ne pouvez pas perdre — le téléchargement existe exactement pour cela, et il n’a besoin de rien de notre part pour s’ouvrir.',
        ],
      },
      {
        heading: 'Aucune garantie, et la limite de ce que nous devons',
        body: [
          'Le service est fourni sans garantie d’aucune sorte, expresse ou implicite. Dans toute la mesure permise par la loi, Raudar Labs n’est pas responsable des pertes de données, des pertes de bénéfices, ni d’aucun préjudice indirect ou consécutif résultant de son utilisation.',
          'Rien ici ne limite un droit dont vous disposez et qui ne peut pas être limité par convention.',
        ],
      },
      {
        heading: 'Modifications et fin',
        body: [
          'Ces conditions peuvent changer ; la date ci-dessus dit quand elles l’ont fait pour la dernière fois, et continuer à utiliser le service est la manière de les accepter. Vous pouvez arrêter à tout moment en supprimant vos documents et votre compte.',
        ],
      },
    ],
    seo: {
      title: 'Conditions d’utilisation — TransformPipe',
      description:
        'TransformPipe est gratuit et fourni tel quel. Vos documents restent les vôtres, les limites sont publiées, et il n’y a aucune garantie.',
    },
  },
  cookies: {
    label: 'Cookies',
    title: 'Cookies',
    lede: 'Il y en a deux, tous deux nécessaires pour se connecter, et rien à configurer.',
    sections: [
      {
        heading: 'Rien à désactiver',
        body: [
          'La plupart des pages cookies existent pour vous laisser refuser la mesure d’audience et la publicité. Ce site n’a ni l’une ni l’autre, donc cette page n’a aucun interrupteur — refuser est le seul réglage, et c’est déjà ainsi que le site fonctionne.',
          'Déconnecté, ce site ne pose aucun cookie.',
        ],
      },
      {
        heading: 'Les deux qui existent',
        body: [
          'Tous deux sont posés par notre prestataire d’authentification, sont propriétaires, et sont marqués HttpOnly et Secure — le script de la page ne peut pas les lire :',
        ],
        items: [
          '__Secure-neon-auth.session_token — vous garde connecté. Sans lui, chaque chargement de page redemanderait la connexion. Il disparaît quand vous vous déconnectez.',
          '__Secure-neon-auth.session_challenge — existe pendant les dix minutes de l’aller-retour de connexion, pour que la réponse de Google puisse être rapprochée de la requête qui l’a lancée. C’est ce qui empêche la connexion de quelqu’un d’autre d’atterrir dans votre session.',
        ],
      },
      {
        heading: 'Le stockage du navigateur, qui n’est pas un cookie',
        body: [
          'Deux choses vivent dans le stockage local de votre navigateur et ne sont jamais envoyées où que ce soit : le thème que vous avez choisi et — quand vous êtes déconnecté — vos conversions récentes, pour que l’historique ait quelque chose dedans. Effacer les données du site dans votre navigateur retire les deux, et l’application continue sans elles.',
        ],
      },
      {
        heading: 'Si cela change',
        body: [
          'Si quelque chose d’optionnel est un jour ajouté, cette page reçoit un vrai réglage avant qu’il soit posé, pas après. La date ci-dessus dira quand.',
        ],
      },
    ],
    seo: {
      title: 'Cookies — TransformPipe',
      description:
        'Deux cookies de session propriétaires, tous deux nécessaires pour se connecter. Aucune mesure d’audience, aucune publicité, rien d’optionnel à configurer.',
    },
  },
};
