/*
 * Where a page's cover lives.
 *
 * `npm run og` draws them into public/og, so these are static files the browser fetches like any
 * other image. Named in one place because three things ask for the same path: the card in the blog
 * index, the card on the front page, and the prerenderer, which needs an absolute URL for
 * `og:image` — a relative one is ignored by every scraper that matters.
 */

/**
 * A blog article's share image — the one with the headline in it.
 *
 * This is what `og:image` points at, because a share with no headline is a coloured rectangle.
 */
export function articleCover(slug: string): string {
  return `/og/blog/${slug}.png`;
}

/**
 * The same picture without the headline, for a card that prints the headline itself.
 *
 * A card in a three-column grid is about 330px wide, and a title rendered inside the image at that
 * size is unreadable text pretending to be a picture — beside the real title, twice over.
 */
export function articleCardImage(slug: string): string {
  return `/og/card/${slug}.png`;
}

/**
 * Any other page's cover, by route.
 *
 * The front page is `home.png` rather than `index.png`, and a conversion page uses its own path
 * with the leading slash dropped. A route with no cover gets the front page's, which is better than
 * a share with no picture at all.
 */
export function pageCover(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');

  if (clean === '') {
    return '/og/home.png';
  }

  if (clean === 'markdown-to-html') {
    return '/og/markdown-to-html.png';
  }

  return `/og/${clean}.png`;
}

/** 1200 by 630, which is what the generator draws and what every scraper expects to be told. */
export const COVER_SIZE = { width: 1200, height: 630 };
