import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Content } from './content';
import { en } from './messages/en';
import {
  DEFAULT_LOCALE,
  LOCALES,
  localePath,
  preferredLocale,
  splitLocale,
  type Locale,
} from './locales';

/*
 * The active language, and the words that go with it.
 *
 * English is bundled: it is the default, it is the fallback, and a page that has to fetch its own
 * interface before it can draw one is a page that flashes. The other four are chunks — a dynamic
 * import per locale — so a reader who never switches never downloads Italian.
 *
 * Until the chunk arrives, English shows. That is a few hundred milliseconds on a first visit in
 * German, and the alternative is a blank frame; on a prerendered page the static HTML is already
 * in the right language, so this only affects the app's own rendering.
 */

const LOADERS: Record<Locale, () => Promise<Content>> = {
  en: async () => en,
  de: () => import('./messages/de').then((module) => module.de),
  fr: () => import('./messages/fr').then((module) => module.fr),
  es: () => import('./messages/es').then((module) => module.es),
  it: () => import('./messages/it').then((module) => module.it),
};

/** Where an explicit choice is remembered. An explicit choice must never be overridden. */
const STORED = 'transformpipe.locale';

function readStored(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORED);

    return (LOCALES as readonly string[]).includes(value ?? '')
      ? (value as Locale)
      : null;
  } catch {
    /* A private window, or site data switched off. Not knowing is fine; guessing again is not. */
    return null;
  }
}

function writeStored(locale: Locale): void {
  try {
    window.localStorage.setItem(STORED, locale);
  } catch {
    /* Then the choice lasts for this visit. Better than refusing to switch. */
  }
}

interface I18n {
  locale: Locale;
  content: Content;
  /** True while a locale's chunk is in flight and English is standing in. */
  loading: boolean;
  /** Switches language and rewrites the address, remembering the choice. */
  setLocale: (locale: Locale) => void;
}

const Context = createContext<I18n | null>(null);

interface ProviderProps {
  children: ReactNode;
  /** The locale the current address asks for. The router reads it; this trusts it. */
  locale: Locale;
  /** How the app changes address, so switching language is one navigation, not two. */
  onNavigate: (path: string) => void;
}

export function I18nProvider({ children, locale, onNavigate }: ProviderProps) {
  const [content, setContent] = useState<Content>(en);
  const [loading, setLoading] = useState(locale !== DEFAULT_LOCALE);

  useEffect(() => {
    if (locale === DEFAULT_LOCALE) {
      setContent(en);
      setLoading(false);

      return;
    }

    let live = true;

    setLoading(true);

    LOADERS[locale]()
      .then((next) => {
        /* A reader who switched twice quickly gets the language they asked for last. */
        if (live) {
          setContent(next);
          setLoading(false);
        }
      })
      .catch(() => {
        /* A chunk that will not load leaves English on the screen, which is readable. */
        if (live) {
          setLoading(false);
        }
      });

    return () => {
      live = false;
    };
  }, [locale]);

  /*
   * `<html lang>` follows the language, and it has to be set here rather than left to the shell.
   *
   * The prerendered files each carry the right one, so a reader who lands on /de/docs gets
   * `lang="de"` in the static HTML. But `index.html` says `en`, which is what the dev server and
   * every in-app navigation serve, and nothing was updating it — so switching to German left the
   * document claiming to be English.
   *
   * It is not cosmetic. `lang` is what a screen reader picks a voice and a pronunciation from, and
   * what the browser hyphenates by; German prose announced by an English voice is unusable, and
   * that is the reader least able to work around it.
   */
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      writeStored(next);

      const { rest } = splitLocale(window.location.pathname);

      onNavigate(localePath(next, rest) + window.location.search);
    },
    [onNavigate]
  );

  const value = useMemo(
    () => ({ locale, content, loading, setLocale }),
    [locale, content, loading, setLocale]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useI18n(): I18n {
  const value = useContext(Context);

  if (!value) {
    throw new Error('useI18n outside I18nProvider');
  }

  return value;
}

/**
 * The function `useT()` hands back: one interface string by key, with its holes filled.
 *
 * Named because it travels. A hook cannot be called from a plain module or from inside a callback,
 * so anything that needs words down there — `convert.ts`, `download.ts`, `merge.ts`, `useHistory`
 * — takes one of these from the component that has one rather than importing the catalogue and
 * escaping the provider.
 */
export type Translate = (
  key: string,
  values?: Record<string, string | number>
) => string;

/**
 * One interface string, by key.
 *
 * Falls back to English rather than to the key itself: a missing German sentence should read as
 * English, not as `history.empty.title`. `assertCatalogueShapes` is what stops it happening at all.
 *
 * `{name}` placeholders are filled from `values`.
 */
export function useT(): Translate {
  const { content } = useI18n();

  return useCallback(
    (key: string, values?: Record<string, string | number>): string => {
      const template = content.ui[key] ?? en.ui[key] ?? key;

      if (!values) {
        return template;
      }

      return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
        name in values ? String(values[name]) : whole
      );
    },
    [content]
  );
}

/**
 * The locale to send a first-time visitor to, or null to leave them where they are.
 *
 * Only ever called for an address with no locale in it and no remembered choice, and only where
 * the page has a translation to go to. A reader who has chosen a language, a reader deep in the
 * English blog, and a crawler fetching static HTML are all left alone — this runs in the browser
 * after the bundle, so a crawler reading the prerendered page never sees it.
 */
export function autoLocale(hasTranslation: boolean): Locale | null {
  if (!hasTranslation || readStored()) {
    return null;
  }

  const { locale } = splitLocale(window.location.pathname);

  if (locale !== DEFAULT_LOCALE) {
    return null;
  }

  const guess = preferredLocale(
    navigator.languages ?? [navigator.language ?? 'en']
  );

  return guess === DEFAULT_LOCALE ? null : guess;
}

export { readStored as storedLocale, writeStored as rememberLocale };
