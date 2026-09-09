import type { ConversionId } from '@shared/conversions';
import type { StaticPageId } from '@/lib/pages';

/*
 * The shape of everything the product says, in one type.
 *
 * English is the source: `messages/en/*` is written first, its `ui` object defines the key set, and
 * every other locale has to satisfy the same type. A key added in English and forgotten in German
 * stops the build rather than showing a German reader an English sentence — which is the failure
 * mode of every string table that is checked by hand.
 *
 * Types cannot check everything here. An array of five sections and an array of three both satisfy
 * `Section[]`, so `assertCatalogueShapes` in `catalogues.ts` walks each locale against English —
 * same keys, same array lengths, nothing empty, the same placeholders — and the prerenderer calls
 * it, which puts it inside `npm run build`.
 *
 * What is NOT in here, on purpose:
 *
 *   - the blog's articles. Fifty-six pieces of about 5,900 words each, written against English
 *     search terms; translating them would produce five near-identical sites and rank in none of
 *     the five languages. Per-language articles are their own job.
 *   - the server's copy of the shared-document page, and the OAuth consent page. Both are rendered
 *     by the server for a reader we know nothing about, at an address with no locale in it, so there
 *     is nothing to choose a language from but `Accept-Language` — and guessing wrong on a consent
 *     page is worse than English. The app's own view of a shared document is a different thing: it
 *     is reached at `/open/<token>` by somebody the server sent here to sign in, it is drawn by the
 *     bundle, and its words are in `ui` under `shared.` like every other screen's.
 *   - the API's and the connector's messages. An API answers in one language; ours is English.
 */

/** One `key: sentence` table. The keys come from English; see `messages/en/ui.ts`. */
export type UiMessages = Record<string, string>;

export interface ConversionWords {
  /** In the header menu. */
  label: string;
  /** On a row in the history, where there is no room for the long form. */
  short: string;
  /** The heading of its screen. */
  title: string;
  blurb: string;
  /** The line under the dropzone's title. */
  hint: string;
  seo: { title: string; description: string };
}

export interface PageSectionWords {
  heading: string;
  body: string[];
  items?: string[];
}

export interface PageWords {
  label: string;
  title: string;
  lede: string;
  sections: PageSectionWords[];
  seo: { title: string; description: string };
}

export interface FaqWords {
  question: string;
  answer: string;
}

export interface DocsSectionWords {
  title: string;
  summary: string;
}

export interface Content {
  ui: UiMessages;
  conversions: Record<ConversionId, ConversionWords>;
  pages: Record<StaticPageId, PageWords>;
  /** In the order `FAQ_ENTRIES` declares — the flags stay in the code, the words come from here. */
  faq: FaqWords[];
  docs: Record<string, DocsSectionWords>;
}
