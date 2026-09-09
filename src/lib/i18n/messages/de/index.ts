import type { Content } from '../../content';
import { conversions } from './conversions';
import { docs } from './docs';
import { docsPage } from './docs-page';
import { faq } from './faq';
import { pages } from './pages';
import { ui } from './ui';

/*
 * Deutsch, in fünf Dateien, weil fünf verschiedene Arten von Dingen zu übersetzen sind und eine
 * Datei mit sechstausend Wörtern eine Datei ist, die niemand prüft.
 *
 * Die Quelle ist `messages/en`. Dieses Verzeichnis ist eine Kopie davon mit denselben Dateinamen,
 * denselben Schlüsseln und denselben Array-Längen, und `scripts/check-i18n.mjs` sagt das, bevor ein
 * Build ausgeliefert wird.
 *
 * Register: unpersönlich, wo es geht — eine Oberfläche muss selten „Sie“ sagen. Wo direkte Anrede
 * unvermeidlich ist, wird gesiezt.
 */

/*
 * Die Prosa des Handbuchs tritt der Oberflächentabelle bei, statt neben ihr zu stehen.
 *
 * `useT()` liest eine flache Map, und die Absätze der Dokumentation sind Oberflächentexte wie alle
 * anderen — sie stehen nur in einer eigenen Datei, weil fünfundsiebzig davon in `ui.ts` die
 * hundertsiebenundachtzig begraben würden, die dem Rest der App gehören. Jeder Schlüssel aus
 * `docs-page.ts` beginnt mit `docs.`, die zwei können also nicht kollidieren.
 */
export const de: Content = {
  ui: { ...ui, ...docsPage },
  conversions,
  pages,
  faq,
  docs,
};
