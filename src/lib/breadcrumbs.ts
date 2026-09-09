import type { Conversion } from '@shared/conversions';
import type { Article } from './blog';
import { articlePath } from './blog';
import type { StaticPage } from './pages';

/*
 * The trail for every page, in one place.
 *
 * Two things read it and they must not disagree: the app, which draws it, and the prerenderer,
 * which emits it as `BreadcrumbList` structured data for a search result to show instead of a bare
 * URL. A trail that says one thing to a reader and another to a crawler is worse than none, because
 * the mismatch is the kind of thing that gets structured data ignored site-wide.
 */

export interface CrumbSpec {
  label: string;
  /** Absent on the last crumb — the page you are already on. */
  path?: string;
}

const HOME: CrumbSpec = { label: 'Converter', path: '/' };

export const BLOG_CRUMBS: CrumbSpec[] = [HOME, { label: 'Blog' }];

export const DOCS_CRUMBS: CrumbSpec[] = [HOME, { label: 'Documentation' }];

export const HISTORY_CRUMBS: CrumbSpec[] = [HOME, { label: 'History' }];

export function crumbsForArticle(article: Article): CrumbSpec[] {
  return [
    HOME,
    { label: 'Blog', path: '/blog' },
    { label: article.title },
  ];
}

/**
 * A conversion's trail.
 *
 * The default conversion *is* the home page, which used to mean no trail at all — and that left the
 * front page as the one conversion page with nothing above its heading, so it read as a different
 * kind of page from its own siblings. It gets the trail now, with "Converter" as plain text rather
 * than a link, because the link would point at the page you are already on.
 *
 * Nothing in that trail carries a path, which is what stops the prerenderer emitting it as
 * `BreadcrumbList`: two names and no addresses is not a hierarchy, and the root of a site has no
 * position in one to declare.
 */
export function crumbsForConversion(one: Conversion): CrumbSpec[] {
  return one.path === '/'
    ? [{ label: HOME.label }, { label: one.label }]
    : [HOME, { label: one.label }];
}

export function crumbsForStaticPage(page: StaticPage): CrumbSpec[] {
  return [HOME, { label: page.label }];
}

/** The article path, for the prerenderer's structured data. */
export function articleCrumbPath(article: Article): string {
  return articlePath(article.slug);
}
