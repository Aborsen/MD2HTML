import type { Content } from '../../content';
import { conversions } from './conversions';
import { docs } from './docs';
import { docsPage } from './docs-page';
import { faq } from './faq';
import { pages } from './pages';
import { ui } from './ui';

/*
 * Italian, composed exactly the way English is: the same seven files, the same keys in the same
 * order, the same array lengths. `assertCatalogueShapes` in `../../catalogues.ts` walks this tree
 * against English on every build and says so if it drifts.
 *
 * The manual's prose joins the interface table here, as it does in English: `useT()` reads one flat
 * map, and every `docs-page.ts` key begins `docs.`, so the two cannot collide.
 */
export const it: Content = {
  ui: { ...ui, ...docsPage },
  conversions,
  pages,
  faq,
  docs,
};
