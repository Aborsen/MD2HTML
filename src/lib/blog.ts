/*
 * The blog, read out of `content/blog/*.md` at build time — in two halves.
 *
 * Articles about converting Markdown are written in Markdown and rendered by the converter this app
 * ships. There is no second pipeline to keep in step, and a bug in the renderer shows up on our own
 * pages before it shows up on anyone else's document.
 *
 * The halves matter. `virtual:blog-index` (see `vite-plugin-blog.ts`) carries what a list needs —
 * title, description, date, tag, keywords, reading time — and is in the main bundle because the
 * front page and the index both show it. The prose is not: an eager glob put all of it there too,
 * which with thirty-six long articles was 952 kB of Markdown shipped to every visitor who opened
 * the converter and never touched the blog. Each body is its own chunk now, fetched when somebody
 * opens that article.
 */
import { INDEX } from 'virtual:blog-index';
import { formatDate } from './format';
import { DEFAULT_LOCALE, localePath, type Locale } from './i18n/locales';

export interface Article {
  slug: string;
  title: string;
  description: string;
  /** ISO date, as written in the file: when the piece was published. */
  date: string;
  /**
   * When it last changed in a way a reader would notice, if it has.
   *
   * Separate from `date` because they answer different questions and the sitemap needs the second
   * one: `lastmod` claiming an article was modified the day it was published is a claim a crawler
   * can check against the page and stop believing. Absent on an article that has not been revised.
   */
  updated?: string;
  tag: string;
  /** What the piece is aimed at, from content/keywords.md. Not rendered; kept for the writer. */
  keywords: string[];
  readingMinutes: number;
}

/*
 * The bodies, one importer each rather than one big object.
 *
 * No `eager`, so Vite gives back a function per file and builds a chunk per file. The keys are the
 * paths as written here, which is why `bodyFor` matches on the file name rather than the whole path.
 */
const BODIES = import.meta.glob('../../content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

/**
 * The English articles, newest first — the plugin has already sorted them.
 *
 * Kept as a plain export because English is the language the blog is written in and the one the
 * prerenderer treats as the source. Anything rendering for a reader should ask `articlesFor`.
 */
export const ARTICLES: Article[] = INDEX[DEFAULT_LOCALE] ?? [];

/**
 * What one language has, which is not what another has.
 *
 * Only the articles translated into that language: a German index listing English pieces would be
 * a list of links a German reader cannot use, and an `hreflang="de"` on an article with no German
 * text is a claim a crawler checks. So the blog is complete in English and as complete as it is
 * in everything else, and both states are visible rather than papered over.
 */
export function articlesFor(locale: Locale): Article[] {
  return INDEX[locale] ?? [];
}

/**
 * Whether this piece exists in that language at all.
 *
 * Not called `hasTranslation`, because `src/lib/route.ts` has one of those and it answers a
 * different question: whether a path is one of the pages that exists in all five languages.
 */
export function hasArticleIn(slug: string, locale: Locale): boolean {
  return articlesFor(locale).some((article) => article.slug === slug);
}

/**
 * Splits `---` frontmatter off the top of a file.
 *
 * A hand-rolled parser rather than a YAML dependency: the header is a flat list of `key: value`,
 * and a library that can express anchors and nested maps invites a header that needs one. The same
 * eight lines live in `vite-plugin-blog.ts`, which reads the header at build time.
 */
function stripFrontmatter(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);

  return match ? raw.slice(match[0].length) : raw;
}

/**
 * One article's Markdown, fetched on demand.
 *
 * Returns null for a slug with no file, which is what an old link to a renamed article looks like.
 */
export async function articleBody(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<string | null> {
  /*
   * English is `content/blog/<slug>.md` and a translation is `content/blog/<locale>/<slug>.md`, so
   * the locale segment is part of what identifies a file. Matching on `/<slug>.md` alone would
   * have returned whichever language the glob happened to list first.
   */
  const tail =
    locale === DEFAULT_LOCALE ? `/blog/${slug}.md` : `/blog/${locale}/${slug}.md`;

  const entry = Object.entries(BODIES).find(([path]) => path.endsWith(tail));

  if (!entry) {
    return null;
  }

  return stripFrontmatter(await entry[1]());
}

export function findArticle(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): Article | undefined {
  return articlesFor(locale).find((article) => article.slug === slug);
}

/** The tags actually in use in one language, in the order its articles introduce them. */
export function articleTags(locale: Locale = DEFAULT_LOCALE): string[] {
  return [...new Set(articlesFor(locale).map((article) => article.tag))];
}

/** Where an article lives, in the language asked for: `/blog/x`, `/de/blog/x`. */
export function articlePath(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): string {
  return localePath(locale, `/blog/${slug}`);
}

/** The blog's own index, in the language asked for. */
export function blogPath(locale: Locale = DEFAULT_LOCALE): string {
  return localePath(locale, '/blog');
}

/*
 * A date, in the reader's language.
 *
 * This used to hold a list of twelve English month names, which was fine while there was one
 * language and wrong the moment there were five: "8 September 2026" is not what a German reader
 * expects to see, and translating twelve nouns would still leave the order and the punctuation
 * wrong — German puts a full stop after the day, American English puts the month first.
 *
 * `Intl.DateTimeFormat` knows all of that, ships with the browser and with Node, and is the only
 * thing that should ever be asked. It lives in `src/lib/format.ts` with the other three formatters
 * and its cache, because the legal pages state a date too and two copies of one `Intl` options
 * object is one copy too many. This function is the name the blog and the prerenderer call it by.
 */

/** "8 September 2026", "8. September 2026", "8 settembre 2026" — read, not sorted. */
export function formatArticleDate(date: string, locale = 'en-GB'): string {
  return formatDate(date, locale);
}
