/**
 * The app's addresses, kept in the URL rather than in memory.
 *
 * The converter, the history (with the chip it is showing), the documentation, the blog and one of
 * its articles, and a shared document. Putting them in the path is what makes a reload land where
 * you were and the back button mean something — a router would be a lot of machinery for this, and
 * pages people link into need real addresses anyway.
 */

export type AppView = 'converter' | 'history' | 'docs' | 'blog';

export interface Route {
  view: AppView;
  /** The history's active chip, carried so a refresh keeps looking at the same list. */
  filter: string | null;
  /** Set when the address is a shared document. */
  sharedToken: string | null;
  /** Set when the address is one article rather than the blog's index. */
  articleSlug: string | null;
}

export function readRoute(): Route {
  /*
   * /s/<token> is rendered by the server; the app only sees /open/<token>, where the server sent
   * a reader whose access depends on being signed in.
   */
  const shared = window.location.pathname.match(/^\/(?:open|s)\/([^/]+)\/?$/);
  const article = window.location.pathname.match(/^\/blog\/([^/]+)\/?$/);
  const path = window.location.pathname;

  return {
    view: /^\/history\/?$/.test(path)
      ? 'history'
      : /^\/docs\/?$/.test(path)
        ? 'docs'
        : /^\/blog(\/|$)/.test(path)
          ? 'blog'
          : 'converter',
    filter: new URLSearchParams(window.location.search).get('filter'),
    sharedToken: shared ? decodeURIComponent(shared[1]) : null,
    articleSlug: article ? decodeURIComponent(article[1]) : null,
  };
}

const PATHS: Record<AppView, string> = {
  converter: '/',
  history: '/history',
  docs: '/docs',
  blog: '/blog',
};

/** Moves to a view, adding a history entry so Back returns to the previous one. */
export function goTo(view: AppView, filter?: string | null) {
  const path = PATHS[view];
  const search = view === 'history' && filter ? `?filter=${filter}` : '';

  if (window.location.pathname + window.location.search !== path + search) {
    window.history.pushState(null, '', path + search);
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
