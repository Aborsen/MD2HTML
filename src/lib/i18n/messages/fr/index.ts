import type { Content } from '../../content';
import { conversions } from './conversions';
import { docs } from './docs';
import { docsPage } from './docs-page';
import { faq } from './faq';
import { pages } from './pages';
import { ui } from './ui';

/*
 * Le français, en cinq fichiers, dans le même découpage que l’anglais.
 *
 * `messages/en` est la source : mêmes noms de fichiers, mêmes clés dans le même ordre, mêmes
 * longueurs de tableau. `assertCatalogueShapes` dans `catalogues.ts` le vérifie avant qu’une
 * construction ne sorte.
 *
 * Registre retenu : vouvoiement, tournures impersonnelles dès que l’interface peut se passer
 * d’adresser le lecteur, espaces insécables devant « : », « ; » et « ? », guillemets français.
 */

/*
 * La prose du manuel rejoint la table de l’interface plutôt que de s’asseoir à côté.
 *
 * `useT()` lit une seule table à plat, et les paragraphes de la documentation sont des chaînes
 * d’interface comme les autres — elles ne sont dans leur propre fichier que parce que
 * soixante-quinze d’entre elles dans `ui.ts` enterreraient les cent quatre-vingt-sept qui
 * appartiennent au reste de l’application. Toute clé de `docs-page.ts` commence par `docs.`, donc
 * les deux ne peuvent pas se heurter.
 */
export const fr: Content = {
  ui: { ...ui, ...docsPage },
  conversions,
  pages,
  faq,
  docs,
};
