import type { Content } from '../../content';

/*
 * Le nom de chaque conversion et ce que dit sa page, en français.
 *
 * Les identifiants, les adresses et les extensions restent dans `shared/conversions.ts` : le
 * serveur les lit et n’a pas de langue. Ici il n’y a que des mots.
 *
 * Les blocs `seo` ne sont pas une traduction de l’anglais mais la phrase qu’un francophone tape
 * réellement — « convertir markdown en html », « convertir word en markdown » — avec la même
 * promesse que fait l’anglais, ni plus ni moins.
 */

export const conversions: Content['conversions'] = {
  'markdown-to-html': {
    label: 'Markdown → HTML',
    short: 'MD → HTML',
    title: 'Markdown vers HTML',
    blurb:
      'Déposez un fichier Markdown — le HTML rendu apparaît aussitôt et se télécharge comme un document prêt à l’emploi.',
    hint: 'Déposez un fichier .md et voyez exactement le rendu qu’il aura en HTML. Plusieurs fichiers déposés ensemble sont enchaînés en un seul document, dans l’ordre choisi.',
    seo: {
      title: 'Convertir Markdown en HTML — TransformPipe',
      description:
        'Convertir Markdown en HTML dans le navigateur : le document rendu et un .html autonome à télécharger. Connectez-vous pour conserver, partager et publier.',
    },
  },
  'html-to-markdown': {
    label: 'HTML → Markdown',
    short: 'HTML → MD',
    title: 'HTML vers Markdown',
    blurb:
      'Déposez un fichier HTML — ou une page que vous avez enregistrée — et récupérez du Markdown, titres, liens, listes et tableaux intacts.',
    hint: 'Déposez un fichier .html et récupérez du Markdown. Les tableaux, les listes de tâches et les blocs de code survivent ; la mise en forme, non, parce que Markdown n’en a pas.',
    seo: {
      title: 'Convertir HTML en Markdown — TransformPipe',
      description:
        'Convertir un fichier HTML ou une page enregistrée en Markdown, tableaux et blocs de code compris. Conversion dans le navigateur : rien n’est envoyé.',
    },
  },
  'word-to-markdown': {
    label: 'Word → Markdown',
    short: 'DOCX → MD',
    title: 'Word vers Markdown',
    blurb:
      'Déposez un .docx et récupérez du Markdown : les titres, les listes, les liens et les tableaux passent, les polices et les marges non.',
    hint: 'Déposez un .docx venu de Word, de Google Docs ou de LibreOffice. Ce qui revient est la structure du document en Markdown — pas sa mise en page.',
    seo: {
      title: 'Convertir Word en Markdown (.docx) — TransformPipe',
      description:
        'Convertir un document Word en Markdown dans le navigateur : titres, listes, liens et tableaux conservés, mise en forme abandonnée. Rien n’est téléversé.',
    },
  },
  'csv-to-markdown': {
    label: 'CSV → tableau Markdown',
    short: 'CSV → MD',
    title: 'CSV en tableau Markdown',
    blurb:
      'Déposez un CSV ou un TSV et récupérez un tableau Markdown, la première ligne en en-tête et les colonnes alignées.',
    hint: 'Déposez un .csv ou un .tsv. Les champs entre guillemets, les virgules qu’ils contiennent et les retours à la ligne dans les cellules sont tous gérés.',
    seo: {
      title: 'CSV en tableau Markdown — TransformPipe',
      description:
        'Convertir un CSV en tableau Markdown : champs entre guillemets et virgules incluses gérés. Fonctionne aussi avec les TSV. Conversion locale, rien n’est téléversé.',
    },
  },
  'json-to-markdown': {
    label: 'JSON → Markdown',
    short: 'JSON → MD',
    title: 'JSON vers Markdown',
    blurb:
      'Déposez un fichier JSON et lisez-le comme un document : une liste d’enregistrements devient un tableau, un objet devient des sections avec ses champs en tête.',
    hint: 'Déposez un fichier .json. Une liste d’enregistrements devient un tableau ; les objets imbriqués deviennent des titres. Une valeur par ligne — un export de journal — est comprise aussi.',
    seo: {
      title: 'Convertir JSON en Markdown — TransformPipe',
      description:
        'JSON en Markdown lisible : les listes d’enregistrements deviennent des tableaux, les objets des sections. Tout se fait dans le navigateur, rien n’est envoyé.',
    },
  },
};
