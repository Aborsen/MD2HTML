import type { Content } from './content';
import { de } from './messages/de';
import { en } from './messages/en';
import { es } from './messages/es';
import { fr } from './messages/fr';
import { it } from './messages/it';
import { LOCALES, type Locale } from './locales';

/*
 * All five catalogues at once, for the build.
 *
 * The app must not import this file. `context.tsx` loads a locale with a dynamic import so that a
 * reader in English never downloads Italian; a static import of all five from anywhere in the
 * application would put every language in the main bundle and quietly undo that. The prerenderer is
 * the one caller: it writes a page per language in one Node process, so it needs them together.
 */

export const CATALOGUES: Record<Locale, Content> = { en, de, fr, es, it };

/*
 * Every locale has the same shape as English.
 *
 * TypeScript gets most of the way: a missing key does not compile. What it cannot see is an array —
 * `PageSectionWords[]` is satisfied by three sections where English has five, so a translator who
 * dropped a paragraph would ship a page missing it, in one language, silently. This walks both
 * trees and compares.
 *
 * Called by the prerenderer, which runs inside `npm run build`, so a locale that does not line up
 * stops a deploy rather than reaching a reader.
 */
export function assertCatalogueShapes(): void {
  const problems: string[] = [];

  const walk = (path: string, english: unknown, other: unknown, locale: Locale) => {
    if (Array.isArray(english)) {
      if (!Array.isArray(other)) {
        problems.push(`${locale}: ${path} should be a list`);

        return;
      }

      if (other.length !== english.length) {
        problems.push(
          `${locale}: ${path} has ${other.length} entries, English has ${english.length}`
        );

        return;
      }

      english.forEach((item, index) =>
        walk(`${path}[${index}]`, item, other[index], locale)
      );

      return;
    }

    if (typeof english === 'object' && english !== null) {
      if (typeof other !== 'object' || other === null) {
        problems.push(`${locale}: ${path} is missing`);

        return;
      }

      const left = english as Record<string, unknown>;
      const right = other as Record<string, unknown>;

      for (const key of Object.keys(left)) {
        if (!(key in right)) {
          problems.push(`${locale}: ${path}.${key} is missing`);
          continue;
        }

        walk(`${path}.${key}`, left[key], right[key], locale);
      }

      /* A key nobody in English has is a key nothing reads — usually a typo in the translation. */
      for (const key of Object.keys(right)) {
        if (!(key in left)) {
          problems.push(`${locale}: ${path}.${key} is not in English`);
        }
      }

      return;
    }

    if (typeof english === 'string') {
      if (typeof other !== 'string') {
        problems.push(`${locale}: ${path} should be a string`);
      } else if (other.trim() === '') {
        problems.push(`${locale}: ${path} is empty`);
      } else if (
        /*
         * A placeholder dropped in translation leaves a sentence with a hole in it: "up to MB".
         * Both sides must name the same ones, in any order — German reorders, and that is fine.
         */
        [...english.matchAll(/\{(\w+)\}/g)]
          .map((match) => match[1])
          .sort()
          .join(',') !==
        [...other.matchAll(/\{(\w+)\}/g)]
          .map((match) => match[1])
          .sort()
          .join(',')
      ) {
        problems.push(
          `${locale}: ${path} does not carry the same placeholders as English`
        );
      }
    }
  };

  for (const locale of LOCALES) {
    if (locale === 'en') {
      continue;
    }

    walk('content', en, CATALOGUES[locale], locale);
  }

  if (problems.length > 0) {
    throw new Error(
      `The translations do not line up with English:\n  ${problems.join('\n  ')}`
    );
  }
}
