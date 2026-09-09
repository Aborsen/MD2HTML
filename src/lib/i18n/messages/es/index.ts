import type { Content } from '../../content';
import { conversions } from './conversions';
import { docs } from './docs';
import { docsPage } from './docs-page';
import { faq } from './faq';
import { pages } from './pages';
import { ui } from './ui';

/*
 * El español, en cinco archivos, con los mismos nombres, las mismas claves y las mismas longitudes
 * de lista que `messages/en`. El inglés es la fuente: `assertCatalogueShapes` recorre este árbol
 * contra el suyo antes de que una compilación llegue a nadie.
 *
 * Registro: impersonal siempre que se puede, y tuteo cuando hay que dirigirse al lector, que es lo
 * que hace el software en español.
 */

/*
 * La prosa del manual se une a la tabla de la interfaz en vez de quedarse al lado, igual que en
 * inglés: `useT()` lee un solo mapa plano y los párrafos de la documentación son frases de
 * interfaz como las demás. Todas las claves de `docs-page.ts` empiezan por `docs.`, así que las
 * dos no pueden chocar.
 */
export const es: Content = {
  ui: { ...ui, ...docsPage },
  conversions,
  pages,
  faq,
  docs,
};
