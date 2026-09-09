/*
 * Which languages the product speaks, and how one gets chosen.
 *
 * English lives at the root and the others sit under a prefix — `/de/docs`, `/fr/csv-to-markdown`.
 * English deliberately has no `/en/` of its own: sixty-eight pages are already indexed at these
 * addresses and the old domain redirects into them, so moving English would throw away everything
 * a search engine knows about this site in exchange for a tidier scheme.
 */

export const LOCALES = ['en', 'de', 'fr', 'es', 'it'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** What the switcher shows: each language named in itself, which is the only name a reader knows. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
};

/*
 * The tag to hand `Intl`, which is not always the tag in the URL.
 *
 * `en` on its own means American English to `Intl`, and this product writes British: "8 September
 * 2026", not "September 8, 2026". The rest are regionless in practice but written out anyway, so
 * the next person can see that the choice was made rather than inherited.
 */
export const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
};

/*
 * Slavic languages go to English, by request and by arithmetic: there is no Russian, Ukrainian or
 * Polish translation to send anybody to, and a reader whose browser says `pl` is better served by
 * a page they can read than by a redirect to a language we do not have.
 *
 * Listed rather than inferred. There is no reliable way to ask a browser "is this tag Slavic", and
 * a list somebody can read and correct is worth more than a clever guess. Anything not in LOCALES
 * lands on English anyway — this exists so the intent is written down where the next person will
 * look, and so a Slavic tag never matches a partial rule by accident.
 */
export const TO_ENGLISH = [
  'ru', 'uk', 'be', 'pl', 'cs', 'sk', 'sl', 'hr', 'sr', 'bs', 'bg', 'mk',
] as const;

const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/**
 * The locale a path is asking for, and the path with the prefix taken off.
 *
 * `/de/docs` is German asking for `/docs`; `/docs` is English asking for the same thing. A path
 * whose first segment is not a locale we have is English asking for that whole path, which is what
 * keeps `/blog/markdown-escaping` working.
 */
export function splitLocale(path: string): { locale: Locale; rest: string } {
  const match = path.match(/^\/([a-z]{2})(?=\/|$)(.*)$/);

  if (match && isLocale(match[1]) && match[1] !== DEFAULT_LOCALE) {
    return { locale: match[1], rest: match[2] || '/' };
  }

  return { locale: DEFAULT_LOCALE, rest: path };
}

/** The address of `path` in `locale`. English keeps the bare path. */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) {
    return path;
  }

  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/**
 * The best locale for a browser's stated preferences.
 *
 * `navigator.languages` is in the reader's own order of preference, so the first supported entry
 * wins. A tag is matched on its language subtag alone — `de-AT` is German — because a regional
 * variant we do not have is still better served by the language we do.
 */
export function preferredLocale(tags: readonly string[]): Locale {
  for (const tag of tags) {
    const language = tag.toLowerCase().split('-')[0];

    if (isLocale(language)) {
      return language;
    }

    if ((TO_ENGLISH as readonly string[]).includes(language)) {
      return DEFAULT_LOCALE;
    }
  }

  return DEFAULT_LOCALE;
}
