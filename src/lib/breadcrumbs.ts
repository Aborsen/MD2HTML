import type { Conversion, ConversionId } from '@shared/conversions';
import type { Article } from './blog';
import { articlePath, blogPath } from './blog';
import type { Content } from './i18n/content';
import { DEFAULT_LOCALE, localePath, type Locale } from './i18n/locales';
import type { StaticPage, StaticPageId } from './pages';

/*
 * The trail for every page, in one place.
 *
 * Two things read it and they must not disagree: the app, which draws it, and the prerenderer,
 * which emits it as `BreadcrumbList` structured data for a search result to show instead of a bare
 * URL. A trail that says one thing to a reader and another to a crawler is worse than none, because
 * the mismatch is the kind of thing that gets structured data ignored site-wide.
 *
 * Every function here takes the catalogue and the locale rather than reading them from a hook,
 * because the prerenderer has no hooks: it builds five languages of every page in one Node process,
 * so the words and the language have to be arguments. The app passes what `useI18n()` gave it.
 */

export interface CrumbSpec {
  label: string;
  /** Absent on the last crumb — the page you are already on. */
  path?: string;
}

/** The trail's root: the converter, in whatever language, at whatever that language's home is. */
const home = (content: Content, locale: Locale): CrumbSpec => ({
  label: content.ui['header.nav.converter'],
  path: localePath(locale, '/'),
});

export function blogCrumbs(content: Content, locale: Locale): CrumbSpec[] {
  return [home(content, locale), { label: content.ui['header.nav.blog'] }];
}

export function docsCrumbs(content: Content, locale: Locale): CrumbSpec[] {
  return [
    home(content, locale),
    { label: content.ui['header.nav.documentation'] },
  ];
}

export function livePreviewCrumbs(content: Content, locale: Locale): CrumbSpec[] {
  return [home(content, locale), { label: content.ui['live.title'] }];
}

export function changelogCrumbs(content: Content, locale: Locale): CrumbSpec[] {
  return [home(content, locale), { label: content.ui['changelog.title'] }];
}

export function historyCrumbs(content: Content, locale: Locale): CrumbSpec[] {
  return [home(content, locale), { label: content.ui['header.nav.history'] }];
}

/*
 * An article's trail is always English, because the articles are.
 *
 * The blog has no translated addresses — five locales of the same English prose would be five
 * near-duplicates competing with each other — so the trail above one names the English home and
 * the English blog, whatever language the chrome around it happens to be in. A crumb linking to
 * `/de/blog` would link to a page that does not exist.
 */
export function crumbsForArticle(
  article: Article,
  content: Content,
  locale: Locale = DEFAULT_LOCALE
): CrumbSpec[] {
  return [
    home(content, locale),
    { label: content.ui['header.nav.blog'], path: blogPath(locale) },
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
export function crumbsForConversion(
  one: Conversion | { id: ConversionId; path: string },
  content: Content,
  locale: Locale
): CrumbSpec[] {
  const label = content.conversions[one.id].label;

  return one.path === '/'
    ? [{ label: content.ui['header.nav.converter'] }, { label }]
    : [home(content, locale), { label }];
}

export function crumbsForStaticPage(
  page: StaticPage | { id: StaticPageId },
  content: Content,
  locale: Locale
): CrumbSpec[] {
  return [home(content, locale), { label: content.pages[page.id].label }];
}


