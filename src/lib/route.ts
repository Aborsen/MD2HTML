import {
  type ConversionId,
  conversionForPath,
  DEFAULT_CONVERSION,
  conversion,
} from '@shared/conversions';
import {
  staticPage,
  staticPageForPath,
  type StaticPageId,
} from './pages';
import { localePath, splitLocale, type Locale } from './i18n/locales';

/**
 * The app's addresses, kept in the URL rather than in memory.
 *
 * Each conversion has its own path, the history has one (with the chip it is showing), and so do the
 * documentation, the blog, an article and a shared document. Putting them in the path is what makes
 * a reload land where you were and the Back button mean something — and a conversion with an address
 * of its own is a page somebody can be sent to, bookmark, or find in a search result, which a
 * dropdown that only changes state is not.
 */

export type AppView =
  | 'converter'
  | 'history'
  | 'docs'
  | 'blog'
  | 'page'
  | 'embed';

export interface Route {
  view: AppView;
  /**
   * The language the address asks for.
   *
   * A leading `/de`, `/fr`, `/es` or `/it` is a prefix, not a page: `/de/docs` is the documentation
   * in German. English has no prefix of its own, because sixty-eight pages are indexed at the bare
   * addresses.
   */
  locale: Locale;
  /** Which conversion the converter is showing. Meaningless for the other views. */
  conversionId: ConversionId;
  /** The history's active chip, carried so a refresh keeps looking at the same list. */
  filter: string | null;
  /** Set when the address is a shared document. */
  sharedToken: string | null;
  /** Set when the address is one article rather than the blog's index. */
  articleSlug: string | null;
  /** Which page of words the address is, when it is one of those. */
  pageId: StaticPageId | null;
}

export function readRoute(): Route {
  /*
   * /s/<token> is rendered by the server; the app only sees /open/<token>, where the server sent
   * a reader whose access depends on being signed in.
   *
   * The locale comes off the front before anything else looks at the path, so every pattern below
   * matches the same way it did when there was only one language.
   */
  const { locale, rest: path } = splitLocale(window.location.pathname);
  const shared = path.match(/^\/(?:open|s)\/([^/]+)\/?$/);
  const article = path.match(/^\/blog\/([^/]+)\/?$/);
  const page = staticPageForPath(path);

  return {
    locale,
    view: page
      ? 'page'
      : /^\/embed\/?$/.test(path)
        ? 'embed'
        : /^\/history\/?$/.test(path)
          ? 'history'
          : /^\/docs\/?$/.test(path)
            ? 'docs'
            : /^\/blog(\/|$)/.test(path)
              ? 'blog'
              : 'converter',
    conversionId: (conversionForPath(path)?.id ?? DEFAULT_CONVERSION),
    filter: new URLSearchParams(window.location.search).get('filter'),
    sharedToken: shared ? decodeURIComponent(shared[1]) : null,
    articleSlug: article ? decodeURIComponent(article[1]) : null,
    pageId: page?.id ?? null,
  };
}

const PATHS: Record<Exclude<AppView, 'converter' | 'page'>, string> = {
  history: '/history',
  docs: '/docs',
  blog: '/blog',
  /* Reachable only by being framed; nothing in the app navigates to it. */
  embed: '/embed',
};

/*
 * The blog has no translations, so it has no prefixed addresses either.
 *
 * The articles are written against English search terms; five locales of the same English prose
 * would be five near-duplicate sections competing with each other. So /blog stays one address, the
 * chrome around it follows whatever language the reader has chosen, and the prose is English.
 *
 * This is also what `hasTranslation` is for: a first-time visitor reading an English article is not
 * sent anywhere, because there is nowhere to send them.
 */
const UNTRANSLATED = /^\/(blog|open|s)(\/|$)/;

/** Whether a path — locale already stripped — is one of the pages that exists in every language. */
export function hasTranslation(path: string): boolean {
  return !UNTRANSLATED.test(path);
}

/** Keeps the address in the language the reader is already reading. */
function inCurrentLocale(path: string): string {
  const { locale } = splitLocale(window.location.pathname);

  return hasTranslation(path) ? localePath(locale, path) : path;
}

function move(path: string, search = '') {
  if (window.location.pathname + window.location.search !== path + search) {
    window.history.pushState(null, '', path + search);
  }
}

/** Moves to a view, adding a history entry so Back returns to the previous one. */
export function goTo(view: AppView, filter?: string | null) {
  // A page of words has its own address; `goToPage` is how you get to one.
  const path = view === 'converter' || view === 'page' ? '/' : PATHS[view];

  move(inCurrentLocale(path), view === 'history' && filter ? `?filter=${filter}` : '');
}

/** Moves to one conversion's own page. */
export function goToConversion(id: ConversionId) {
  move(inCurrentLocale(conversion(id).path));
}

/** Moves to one of the pages of words. */
export function goToPage(id: StaticPageId) {
  move(inCurrentLocale(staticPage(id).path));
}

/** Opens one article. Its own entry in the history, so Back returns to the list. */
export function goToArticle(slug: string) {
  window.history.pushState(null, '', `/blog/${slug}`);
}

/** Moves to an address worked out elsewhere — the language switcher's way in. */
export function goToPath(path: string) {
  move(path);
}

/** Records a change within the current view — a chip, not a destination. */
export function replaceFilter(filter: string) {
  const { locale, rest } = splitLocale(window.location.pathname);

  if (!/^\/history\/?$/.test(rest)) {
    return;
  }

  window.history.replaceState(
    null,
    '',
    `${localePath(locale, '/history')}?filter=${filter}`
  );
}
