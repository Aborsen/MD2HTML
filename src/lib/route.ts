/**
 * The app's addresses, kept in the URL rather than in memory.
 *
 * Three places worth naming: the converter, the history (with the chip it is showing), and a
 * shared document. Putting them in the path is what makes a reload land where you were and the
 * back button mean something — a router would be a lot of machinery for three routes.
 */

export type AppView = 'converter' | 'history';

export interface Route {
  view: AppView;
  /** The history's active chip, carried so a refresh keeps looking at the same list. */
  filter: string | null;
  /** Set when the address is a shared document. */
  sharedToken: string | null;
}

export function readRoute(): Route {
  /*
   * /s/<token> is rendered by the server; the app only sees /open/<token>, where the server sent
   * a reader whose access depends on being signed in.
   */
  const shared = window.location.pathname.match(/^\/(?:open|s)\/([^/]+)\/?$/);

  return {
    view: /^\/history\/?$/.test(window.location.pathname)
      ? 'history'
      : 'converter',
    filter: new URLSearchParams(window.location.search).get('filter'),
    sharedToken: shared ? decodeURIComponent(shared[1]) : null,
  };
}

/** Moves to a view, adding a history entry so Back returns to the previous one. */
export function goTo(view: AppView, filter?: string | null) {
  const path = view === 'history' ? '/history' : '/';
  const search = view === 'history' && filter ? `?filter=${filter}` : '';

  if (window.location.pathname + window.location.search !== path + search) {
    window.history.pushState(null, '', path + search);
  }
}

/** Records a change within the current view — a chip, not a destination. */
export function replaceFilter(filter: string) {
  if (!/^\/history\/?$/.test(window.location.pathname)) {
    return;
  }

  window.history.replaceState(null, '', `/history?filter=${filter}`);
}
