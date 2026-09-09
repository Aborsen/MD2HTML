import type { Content } from '../../content';
import { conversions } from './conversions';
import { docs } from './docs';
import { docsPage } from './docs-page';
import { faq } from './faq';
import { pages } from './pages';
import { ui } from './ui';

/*
 * English, in five files because five different kinds of thing need translating and one file of six
 * thousand words is a file nobody reviews.
 *
 * This is the source. Every other locale is a copy of this directory with the same file names, the
 * same keys and the same array lengths, and `assertCatalogueShapes` in `../../catalogues.ts` proves
 * it during `npm run build`.
 *
 * Key naming in `ui.ts`: `area.thing`, lower case, dots between. `header.` for the bar at the top,
 * `converter.`, `history.`, `blog.`, `article.`, `docs.`, `shared.` for the screens, `dialog.` for
 * the modals, `footer.`, `auth.` for what sign-in says wherever it says it, and `common.` for a
 * word used in more than one of those. A key names where the string appears, not what it says, so
 * changing the wording never means renaming the key.
 */

/*
 * The manual's prose joins the interface table rather than sitting beside it.
 *
 * `useT()` reads one flat map, and the documentation's paragraphs are interface strings like any
 * others — they are only in their own file because seventy-five of them in `ui.ts` would bury the
 * two hundred and thirty-five that belong to the rest of the app. Every `docs-page.ts` key begins
 * `docs.`, so the two cannot collide.
 */
export const en: Content = {
  ui: { ...ui, ...docsPage },
  conversions,
  pages,
  faq,
  docs,
};
