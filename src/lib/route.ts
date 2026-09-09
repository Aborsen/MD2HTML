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
import { articlesFor, hasArticleIn } from './blog';

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
 * A shared document has one address and it is always English: /s/<token> is rendered by the server
 * for a reader it knows nothing about, at an address with no language in it.
 */
const ONE_ADDRESS = /^\/(open|s)(\/|$)/;

/*
 * The blog is translated one article at a time, so it is not one of the pages that exists in all
 * five languages — some of it does and some of it does not, and which is which changes as pieces
 * are translated.
 *
 * `hasTranslation` answers the all-five question, and the only caller that needs it is the
 * automatic language choice for a first-time visitor. Deliberately false for the blog: being
 * bounced into another language part-way down an article you are already reading is worse than
 * being left where you landed, and a reader who wants the other language has the switcher.
 */
const UNTRANSLATED = /^\/(blog|open|s)(\/|$)/;

/** Whether a path — locale already stripped — is one of the pages that exists in every language. */
export function hasTranslation(path: string): boolean {
  return !UNTRANSLATED.test(path);
}

/**
 * Where `path` lives in another language — the language switcher's question.
 *
 * Most pages exist in all five, so the answer is just the prefix. The blog is the exception, and
 * the rule is: the same article when that language has it, otherwise that language's index, which
 * lists what it does have — and the English index when that language has no articles at all.
 * Following the prefix blindly would offer a German address for a piece with no German text, which
 * is a 404 dressed as a translation.
 */
export function pathInLocale(next: Locale, path: string): string {
  if (ONE_ADDRESS.test(path)) {
    return path;
  }

  const article = path.match(/^\/blog\/([^/]+)\/?$/);

  if (article) {
    return hasArticleIn(decodeURIComponent(article[1]), next)
      ? localePath(next, `/blog/${article[1]}`)
      : blogIn(next);
  }

  if (/^\/blog\/?$/.test(path)) {
    return blogIn(next);
  }

  return localePath(next, path);
}

/** That language's index, or English when it has nothing to list. */
function blogIn(locale: Locale): string {
  return articlesFor(locale).length > 0 ? localePath(locale, '/blog') : '/blog';
}

/** Keeps the address in the language the reader is already reading. */
function inCurrentLocale(path: string): string {
  const { locale } = splitLocale(window.location.pathname);

  return pathInLocale(locale, path);
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

/**
 * Opens one article. Its own entry in the history, so Back returns to the list.
 *
 * In the language being read, when the piece exists in it — a German reader clicking a card in the
 * German index stays in German. Every card in that index is a piece that language has, so the only
 * way to reach an untranslated one is a link inside an article's prose, and those are left to the
 * browser: see the click handler in `ArticlePage`.
 */
export function goToArticle(slug: string) {
  const { locale } = splitLocale(window.location.pathname);

  move(pathInLocale(locale, `/blog/${slug}`));
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
