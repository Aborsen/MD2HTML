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

/**
 * The app's addresses, kept in the URL rather than in memory.
 *
 * Each conversion has its own path, the history has one (with the chip it is showing), and so do the
 * documentation, the blog, an article and a shared document. Putting them in the path is what makes
 * a reload land where you were and the Back button mean something — and a conversion with an address
 * of its own is a page somebody can be sent to, bookmark, or find in a search result, which a
 * dropdown that only changes state is not.
 */

export type AppView = 'converter' | 'history' | 'docs' | 'blog' | 'page';

export interface Route {
  view: AppView;
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
   */
  const path = window.location.pathname;
  const shared = path.match(/^\/(?:open|s)\/([^/]+)\/?$/);
  const article = path.match(/^\/blog\/([^/]+)\/?$/);
  const page = staticPageForPath(path);

  return {
    view: page
      ? 'page'
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
};

/** Moves to a view, adding a history entry so Back returns to the previous one. */
export function goTo(view: AppView, filter?: string | null) {
  // A page of words has its own address; `goToPage` is how you get to one.
  const path = view === 'converter' || view === 'page' ? '/' : PATHS[view];
  const search = view === 'history' && filter ? `?filter=${filter}` : '';

  if (window.location.pathname + window.location.search !== path + search) {
    window.history.pushState(null, '', path + search);
  }
}

/** Moves to one conversion's own page. */
export function goToConversion(id: ConversionId) {
  const path = conversion(id).path;

  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
  }
}

/** Moves to one of the pages of words. */
export function goToPage(id: StaticPageId) {
  const path = staticPage(id).path;

  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
  }
}

/** Opens one article. Its own entry in the history, so Back returns to the list. */
export function goToArticle(slug: string) {
  window.history.pushState(null, '', `/blog/${slug}`);
}

/** Records a change within the current view — a chip, not a destination. */
export function replaceFilter(filter: string) {
  if (!/^\/history\/?$/.test(window.location.pathname)) {
    return;
  }

  window.history.replaceState(null, '', `/history?filter=${filter}`);
}
