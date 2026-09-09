/*
 * Writes a real HTML file for every page a stranger might arrive on.
 *
 * The app is a single page that reads its own address, which is fine for someone already here and
 * useless for a crawler: every route would answer with the same empty shell and the same title, and
 * an article nobody can see is an article nobody can find. So after the bundle is built, this runs
 * in Node — no browser — renders each article with the same converter the app ships, and writes
 * dist/blog/<slug>/index.html with its own title, description, canonical link and structured data.
 *
 * Vercel serves a matching file before it consults the rewrites, so those pages are static; the
 * bundle still loads and takes over, and in-app navigation never touches them.
 *
 * Run through Vite (`vite build --ssr`) rather than plain node, so `import.meta.glob`, the path
 * aliases and the .js-to-.ts specifiers all mean here what they mean in the app.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { markdownToHtml } from '../server/render.js';
import { MD_DOC_STYLE, mdDocTheme } from '../shared/md-doc-css.js';
import {
  ARTICLES,
  articlePath,
  articlesFor,
  blogPath,
  formatArticleDate,
  hasArticleIn,
} from '../src/lib/blog.js';
import { formatDate } from '../src/lib/format.js';
import {
  CONVERSIONS,
  conversion,
  DEFAULT_CONVERSION,
} from '../shared/conversions.js';
import { DOCS_SECTION_IDS } from '../src/lib/docs-sections.js';
import { FAQ_FLAGS } from '../src/lib/faq.js';
import { STATIC_PAGES } from '../src/lib/pages.js';
import { articleCover, COVER_SIZE, pageCover } from '../src/lib/covers.js';
import { hasTranslation } from '../src/lib/route.js';
import {
  DEFAULT_LOCALE,
  LOCALES,
  INTL_LOCALES,
  localePath,
  splitLocale,
  type Locale,
} from '../src/lib/i18n/locales.js';
import {
  assertCatalogueShapes,
  CATALOGUES,
} from '../src/lib/i18n/catalogues.js';
import {
  blogCrumbs,
  crumbsForArticle,
  crumbsForConversion,
  crumbsForStaticPage,
  type CrumbSpec,
  docsCrumbs,
} from '../src/lib/breadcrumbs.js';

const SITE = process.env.SITE_URL ?? 'https://transformpipe.com';
const DIST = resolve('dist');

/*
 * The shell is dist/index.html — which is also a page this script rewrites, so on a second run it
 * would be read back with the home page's own head and body already in it, and every article would
 * inherit them. The markers make the injection removable, so the shell is always the shell.
 */
const HEAD_OPEN = '<!--prerender:head-->';
const HEAD_CLOSE = '<!--/prerender:head-->';
const BODY_OPEN = '<div id="root"><!--prerender:body-->';
const BODY_CLOSE = '<!--/prerender:body--></div>';

const SHELL = readFileSync(join(DIST, 'index.html'), 'utf8')
  // The indentation and the newline go too, or the shell grows a blank line per run.
  .replace(
    new RegExp(`[ \\t]*${HEAD_OPEN}[\\s\\S]*?${HEAD_CLOSE}\\n?`),
    ''
  )
  .replace(
    new RegExp(`${BODY_OPEN}[\\s\\S]*?${BODY_CLOSE}`),
    '<div id="root"></div>'
  );

/*
 * Before anything is written: the five catalogues line up.
 *
 * Here rather than in a check script of its own, because this is the one build step that already
 * imports every locale — and a translation that has lost a paragraph should stop a deploy, not
 * reach a reader in one language out of five. Throws with the list of what does not match.
 */
assertCatalogueShapes();

if (!SHELL.includes('<div id="root"></div>')) {
  throw new Error(
    'dist/index.html has no empty <div id="root"></div> to render into — run `vite build` first.'
  );
}

/**
 * One article's prose, read straight off disk.
 *
 * The app fetches bodies on demand so they stay out of its bundle, which leaves the list it exports
 * without any. This runs in Node with the repository in front of it, so it reads the file — and the
 * prerendered page has to carry the whole article anyway, since that copy is the one a crawler gets.
 */
function articleMarkdown(slug: string, locale: Locale = DEFAULT_LOCALE): string {
  const file =
    locale === DEFAULT_LOCALE
      ? resolve('content/blog', `${slug}.md`)
      : resolve('content/blog', locale, `${slug}.md`);

  const raw = readFileSync(file, 'utf8');
  const header = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);

  return header ? raw.slice(header[0].length) : raw;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** JSON-LD goes in a script tag, so `</script>` inside a string has to stop meaning that. */
const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/**
 * The page's trail, as structured data.
 *
 * The same list the app draws, from `src/lib/breadcrumbs.ts`, so the two cannot disagree — a trail
 * that says one thing to a reader and another to a crawler is worse than none, because that is the
 * mismatch that gets a site's structured data ignored altogether. A single entry is not a trail, so
 * it produces nothing — and neither does a list where no entry has an address, which is how the
 * home page shows a trail to a reader without claiming a position in a hierarchy it is the root of.
 */
const breadcrumbs = (items: CrumbSpec[]) =>
  items.length > 1 && items.some((crumb) => crumb.path)
    ? jsonLd({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.label,
          ...(crumb.path
            ? { item: `${SITE}${crumb.path === '/' ? '/' : crumb.path}` }
            : {}),
        })),
      })
    : '';

/*
 * The app's reset removes the default heading and paragraph styles, so without this the fallback is
 * a column of same-sized text. index.html hides that copy outright while scripts are working; this
 * is for the reader whose bundle never arrives, and it costs a few hundred bytes.
 */
const FALLBACK_STYLE = `<style>
      #prerender { max-width: 44rem; margin: 0 auto; padding: 2.5rem 1.5rem; line-height: 1.65; }
      #prerender h1 { font-size: 1.75rem; font-weight: 600; margin: 0 0 0.75rem; }
      #prerender h2 { font-size: 1.15rem; font-weight: 600; margin: 1.75rem 0 0.4rem; }
      #prerender p { margin: 0 0 0.85rem; }
      #prerender ul { margin: 0 0 1rem 1.25rem; list-style: disc; }
      #prerender li { margin: 0 0 0.4rem; }
      #prerender a { color: inherit; text-decoration: underline; }
      #prerender .md-doc { max-width: none; padding: 0; }
    </style>`;

interface Page {
  /** Route path, leading slash, no trailing one except the root. */
  path: string;
  title: string;
  description: string;
  /** The cover, from public/og. Absolute in the tag: a relative one is ignored by every scraper. */
  image?: string;
  /** What a crawler — and a reader on a slow connection — sees before the bundle runs. */
  body: string;
  head?: string;
  /** Left out of the sitemap when false. */
  listed?: boolean;
  lastmod?: string;
  /** Which language this file is. English when absent, which is most of them. */
  locale?: Locale;
  /**
   * The languages this particular page exists in, when that is not all five.
   *
   * For the blog, which is translated one article at a time: a piece with German and Italian text
   * names those two and English, and nothing else — an `hreflang` pointing at a page that was
   * never written is a claim a crawler follows and finds missing.
   */
  languages?: Locale[];
}

/*
 * Every language's address for one page, as `hreflang`.
 *
 * Emitted on all five, and each set names all five plus the English one as `x-default` — a search
 * engine reads a group of alternates as a group only when every member points at every other, and
 * a page that lists the others without being listed by them is read as a duplicate instead.
 *
 * Only for pages that exist in five languages. The blog is English, so it gets none: claiming an
 * alternate that does not exist is worse than claiming nothing.
 */
function alternates(rest: string, languages?: Locale[]): string {
  /*
   * A page that exists in one language only is not part of a group, and a lone self-referencing
   * alternate says nothing. That is most of the blog while a translation is in progress.
   */
  if (languages) {
    if (languages.length < 2) {
      return '';
    }
  } else if (!hasTranslation(rest)) {
    return '';
  }

  const href = (locale: Locale) =>
    `${SITE}${localePath(locale, rest) === '/' ? '' : localePath(locale, rest)}`;

  const group = languages ?? [...LOCALES];

  return [
    ...group.map(
      (locale) =>
        `<link rel="alternate" hreflang="${locale}" href="${href(locale)}" />`
    ),
    /* English is the source in both cases, and it is always in the group when there is one. */
    `<link rel="alternate" hreflang="x-default" href="${href(DEFAULT_LOCALE)}" />`,
  ].join('\n    ');
}

/*
 * An internal link, pointed at the language the page is in.
 *
 * A link in the prose is written once — `](/docs)`, `](/blog/markdown-escaping)` — and every
 * translation inherits it, so a German article would otherwise send its reader to English pages.
 * The app rewrites these on click; a prerendered file is what a crawler reads, and it follows the
 * href as written.
 *
 * Two cases are left alone: a shared document, which has one address in one language, and an
 * article that has no text in this language, where English is the only thing to point at.
 */
function localiseLinks(html: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) {
    return html;
  }

  return html.replace(/href="(\/[^"]*)"/g, (whole, path: string) => {
    const article = path.match(/^\/blog\/([^/#?]+)$/);

    if (article) {
      return hasArticleIn(article[1], locale)
        ? `href="${articlePath(article[1], locale)}"`
        : whole;
    }

    if (/^\/blog\/?$/.test(path)) {
      return `href="${blogPath(locale)}"`;
    }

    return hasTranslation(path) ? `href="${localePath(locale, path)}"` : whole;
  });
}

function render(page: Page): string {
  const url = `${SITE}${page.path === '/' ? '' : page.path}`;
  const locale = page.locale ?? DEFAULT_LOCALE;

  const head = [
    `<link rel="canonical" href="${url}" />`,
    alternates(splitLocale(page.path).rest, page.languages),
    `<meta property="og:type" content="${page.path.startsWith('/blog/') ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="TransformPipe" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    /*
     * A share with no picture is a grey rectangle with a URL in it, which is what every one of
     * these pages was until `npm run og` drew the covers. `summary_large_image` is the card that
     * actually shows a 1200 by 630 image; plain `summary` crops it to a thumbnail.
     */
    /*
     * The cover of the English page, whatever the language.
     *
     * The covers carry their title as drawn text, and `npm run og` is plain Node with no bundler in
     * front of it, so it cannot read a TypeScript catalogue to draw a German one. Four more sets of
     * thirteen page covers is a small job and a later one; an English picture on a German share is
     * a picture, and no picture is a grey rectangle.
     */
    `<meta property="og:image" content="${SITE}${page.image ?? pageCover(splitLocale(page.path).rest)}" />`,
    `<meta property="og:image:width" content="${COVER_SIZE.width}" />`,
    `<meta property="og:image:height" content="${COVER_SIZE.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${SITE}${page.image ?? pageCover(splitLocale(page.path).rest)}" />`,
    FALLBACK_STYLE,
    page.head ?? '',
  ].join('\n    ');

  return SHELL.replace(
    /<html lang="[a-z-]+"/,
    `<html lang="${locale}"`
  )
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escapeHtml(page.title)}</title>`
    )
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeHtml(page.description)}" />`
    )
    .replace('</head>', `  ${HEAD_OPEN}\n    ${head}\n    ${HEAD_CLOSE}\n  </head>`)
    .replace(
      '<div id="root"></div>',
      `${BODY_OPEN}<div id="prerender">${page.body}</div>${BODY_CLOSE}`
    );
}

function write(page: Page) {
  const file =
    page.path === '/'
      ? join(DIST, 'index.html')
      : join(DIST, page.path.slice(1), 'index.html');

  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page), 'utf8');
}

/*
 * The prerendered body carries the document stylesheet with it. The bundle replaces this markup the
 * moment it runs, but until then the page should be readable rather than a column of unstyled text.
 */
const DOC_STYLE = `<style>${mdDocTheme('dark')}\n${MD_DOC_STYLE}</style>`;

const pages: Page[] = [];

// ---------------------------------------------------------------- articles
for (const locale of LOCALES) {
  const catalogue = CATALOGUES[locale];
  const dates = INTL_LOCALES[locale];

  for (const article of articlesFor(locale)) {
    /* The line under the headline, in this language: "8. September 2026 · 7 min Lesezeit". */
    const meta = (
      article.updated
        ? catalogue.ui['article.meta.updated'].replace(
            '{updated}',
            formatArticleDate(article.updated, dates)
          )
        : catalogue.ui['article.meta']
    )
      .replace('{date}', formatArticleDate(article.date, dates))
      .replace('{minutes}', String(article.readingMinutes));

    pages.push({
      path: articlePath(article.slug, locale),
      locale,
      languages: LOCALES.filter((one) => hasArticleIn(article.slug, one)),
      title: `${article.title} — TransformPipe`,
      description: article.description,
      image: articleCover(article.slug, locale),
      lastmod: article.updated ?? article.date,
      listed: true,
      head: [
        `<meta property="article:published_time" content="${article.date}" />`,
        ...(article.updated
          ? [`<meta property="article:modified_time" content="${article.updated}" />`]
          : []),
        `<meta property="article:tag" content="${escapeHtml(article.tag)}" />`,
        breadcrumbs(crumbsForArticle(article, catalogue, locale)),
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          dateModified: article.updated ?? article.date,
          keywords: article.keywords.join(', '),
          articleSection: article.tag,
          inLanguage: locale,
          mainEntityOfPage: `${SITE}${articlePath(article.slug, locale)}`,
          publisher: { '@type': 'Organization', name: 'TransformPipe', url: SITE },
          author: { '@type': 'Organization', name: 'TransformPipe', url: SITE },
        }),
        DOC_STYLE,
      ].join('\n    '),
      body: `<article class="md-doc"><h1>${escapeHtml(
        article.title
      )}</h1><p>${escapeHtml(meta)}</p>${localiseLinks(
        markdownToHtml(articleMarkdown(article.slug, locale)),
        locale
      )}</article>`,
    });
  }
}

/*
 * ---------------------------------------------------------------- the blog index
 *
 * One per language that has articles, and it lists only that language's. A locale with nothing
 * translated gets no index at all rather than an empty page: /de/blog would be a heading over
 * nothing, and it would be in the sitemap saying so.
 *
 * The English description is written out because it is aimed at what people search for; the others
 * take the blurb the page itself shows, which is the same sentence a reader gets.
 */
const BLOG_DESCRIPTION =
  'Converting Markdown, the syntax that breaks on the way to HTML, publishing documents for people who do not use Markdown, and automating the whole thing.';

const withArticles = LOCALES.filter((one) => articlesFor(one).length > 0);

for (const locale of withArticles) {
  const catalogue = CATALOGUES[locale];
  const articles = articlesFor(locale);

  pages.push({
    path: blogPath(locale),
    locale,
    languages: withArticles,
    title: `${catalogue.ui['blog.eyebrow']} — ${catalogue.ui['blog.title']} — TransformPipe`,
    description:
      locale === DEFAULT_LOCALE
        ? BLOG_DESCRIPTION
        : catalogue.ui['blog.blurb'],
    listed: true,
    /*
     * The newest thing on the index, published or revised.
     *
     * Not `articles[0].date`: the list is sorted by publication, so an old article rewritten today
     * sits far down it, and the index did change on the day that happened.
     */
    lastmod: articles
      .map((article) => article.updated ?? article.date)
      .sort()
      .at(-1),
    head:
      breadcrumbs(blogCrumbs(catalogue, locale)) +
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'TransformPipe Blog',
        url: `${SITE}${blogPath(locale)}`,
        inLanguage: locale,
        blogPost: articles.map((article) => ({
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          url: `${SITE}${articlePath(article.slug, locale)}`,
        })),
      }),
    body: `<h1>${escapeHtml(catalogue.ui['blog.title'])}</h1><ul>${articles
      .map(
        (article) =>
          `<li><a href="${articlePath(
            article.slug,
            locale
          )}">${escapeHtml(article.title)}</a> — ${escapeHtml(
            article.description
          )}</li>`
      )
      .join('')}</ul>`,
  });
}

/*
 * ---------------------------------------------------------------- the conversions
 *
 * Each one is a page of its own, and that is the point of giving them addresses: "html to markdown"
 * and "word to markdown" are things people type into a search box, and a dropdown that only changes
 * state is not something a search engine can send anybody to.
 */
for (const locale of LOCALES) {
  const words = CATALOGUES[locale];

  for (const one of CONVERSIONS.filter((each) => each.path !== '/')) {
    const said = words.conversions[one.id];

    pages.push({
      locale,
      path: localePath(locale, one.path),
      title: said.seo.title,
      description: said.seo.description,
      listed: true,
      head: jsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: said.label,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        description: said.seo.description,
        url: `${SITE}${localePath(locale, one.path)}`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }) + breadcrumbs(crumbsForConversion(one, words, locale)),
      body: `<h1>${escapeHtml(said.title)}</h1><p>${escapeHtml(said.blurb)}</p><p>${escapeHtml(
        said.hint
      )}</p><p>${escapeHtml(
        words.ui['converter.dropzone.limits'].replace('{extensions}', one.extensions.join(', '))
      )}</p>`,
    });
  }
}

/*
 * The front page.
 *
 * Its questions are the ones the running app shows, not the whole list: an FAQPage marked up with
 * answers a visitor cannot see on the page is the kind of structured data that gets a site's
 * markup ignored, and it would drift the moment somebody added a question for the manual only.
 */
for (const locale of LOCALES) {
  const words = CATALOGUES[locale];
  const home = words.conversions[DEFAULT_CONVERSION];

  /*
   * The questions the running app shows, in this language.
   *
   * `FAQ_FLAGS` says which entries the front page carries and the catalogue says what they say —
   * position is the only id a question has, which is why the two are zipped rather than joined.
   */
  const asked = words.faq.filter((_, index) => !FAQ_FLAGS[index]?.detail);

  pages.push({
  locale,
  path: localePath(locale, '/'),
  title: home.seo.title,
  description: home.seo.description,
  listed: true,
  head:
    /*
     * The site and its publisher, declared once on the front page with stable ids. Everything else
     * — the articles, the conversion pages — can reference those ids instead of restating a name
     * and a URL that would then have two places to go stale.
     */
    /*
     * Declared on the English front page alone.
     *
     * These two nodes are the site and its publisher, and they carry fixed `@id`s that everything
     * else refers to. Repeating them on five language homes would state the same identity five
     * times over, which is not extra information — it is five places for one name to go stale.
     */
    (locale === DEFAULT_LOCALE
      ? jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE}/#website`,
          url: SITE,
          name: 'TransformPipe',
          description: home.seo.description,
          inLanguage: locale,
          publisher: { '@id': `${SITE}/#organization` },
        },
        {
          '@type': 'Organization',
          '@id': `${SITE}/#organization`,
          name: 'Raudar Labs',
          url: SITE,
          brand: { '@type': 'Brand', name: 'TransformPipe' },
        },
      ],
        })
      : '') +
    jsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: asked.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: String(entry.answer) },
    })),
  }) + breadcrumbs(crumbsForConversion(conversion(DEFAULT_CONVERSION), words, locale)),
  /*
   * The other conversions, named and linked in this language.
   *
   * Built from the list rather than written out, because a hand-written sentence naming three of
   * the four was already wrong once — JSON was added and the sentence was not.
   */
  body: `<h1>${escapeHtml(home.title)}</h1><p>${escapeHtml(home.blurb)}</p><p>${CONVERSIONS.filter(
    (each) => each.path !== '/'
  )
    .map(
      (each) =>
        `<a href="${localePath(locale, each.path)}">${escapeHtml(
          words.conversions[each.id].title
        )}</a>`
    )
    .join(', ')}</p>${asked
    .map(
      (entry) =>
        `<section><h2>${escapeHtml(entry.question)}</h2><p>${escapeHtml(String(entry.answer))}</p></section>`
    )
    .join('')}`,
  });
}

/*
 * ---------------------------------------------------------------- about, contact and the legal
 *
 * These are the pages somebody checks before trusting a tool with a document, and a crawler is
 * usually the first visitor. Rendered in full rather than as a title and a promise, from the same
 * list the app renders, so what a search result shows is what the page says.
 */
for (const locale of LOCALES) {
  const catalogue = CATALOGUES[locale];

  for (const one of STATIC_PAGES) {
  const said = catalogue.pages[one.id];

  pages.push({
    locale,
    path: localePath(locale, one.path),
    title: said.seo.title,
    description: said.seo.description,
    listed: true,
    /*
     * `lastmod` only where the page itself states a date. A build stamp would change on every
     * deploy whether the words did or not, and a sitemap whose dates cannot be trusted is a
     * sitemap whose dates get ignored.
     *
     * The date is stored as `2026-09-08`, which is what `lastmod` takes, so it goes in as it is —
     * there is nothing left to parse back out of an English sentence. What the page shows a reader
     * is that same day written out, which is `formatDate`'s job and not this file's.
     */
    lastmod: one.updated,
    head: breadcrumbs(crumbsForStaticPage(one, catalogue, locale)),
    body: `<h1>${escapeHtml(said.title)}</h1><p>${escapeHtml(said.lede)}</p>${
      one.updated
        ? `<p>${escapeHtml(
            catalogue.ui['page.updated'].replace(
              '{date}',
              formatDate(one.updated, INTL_LOCALES[locale])
            )
          )}</p>`
        : ''
    }${said.sections
      .map(
        (section) =>
          `<section><h2>${escapeHtml(section.heading)}</h2>${section.body
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join('')}${
            section.items
              ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
              : ''
          }</section>`
      )
      .join('')}`,
  });
  }
}

// ---------------------------------------------------------------- the documentation
for (const locale of LOCALES) {
  const catalogue = CATALOGUES[locale];

  /*
   * The title and the description come from the page's own words rather than a pair of SEO strings
   * of their own. The manual already says what it is in `docs.title` and `docs.lede`, and a second
   * pair to translate would be two more strings that mean the same thing and drift apart.
   */
  pages.push({
  locale,
  path: localePath(locale, '/docs'),
  title: `${catalogue.ui['header.nav.documentation']} — TransformPipe`,
  /*
   * The lede's first sentence, not the whole of it: the full paragraph is over two hundred
   * characters and a search result shows about a hundred and sixty, so the rest is spent on an
   * ellipsis. Every language ends a sentence with a full stop, so the split holds in all five.
   */
  description: `${catalogue.ui['docs.lede'].split('. ')[0]}.`,
  listed: true,
  head: breadcrumbs(docsCrumbs(catalogue, locale)),
  body: `<h1>${escapeHtml(catalogue.ui['docs.title'])}</h1><p>${escapeHtml(
    catalogue.ui['docs.lede']
  )}</p>${DOCS_SECTION_IDS.map(
    (id) =>
      `<section><h2>${escapeHtml(catalogue.docs[id].title)}</h2><p>${escapeHtml(
        catalogue.docs[id].summary
      )}</p></section>`
  ).join('')}`,
  });
}

for (const page of pages) {
  write(page);
}

// ---------------------------------------------------------------- sitemap and robots
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((page) => page.listed)
  // Sorted, so a diff of the sitemap between two builds is readable.
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(
    (page) =>
      `  <url><loc>${SITE}${page.path === '/' ? '/' : page.path}</loc>${
        page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''
      }</url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

writeFileSync(
  join(DIST, 'robots.txt'),
  /*
   * What a crawler has no business in: somebody else's shared document, which is linked to
   * deliberately rather than crawled; the endpoints, which answer JSON and would be indexed as
   * pages; and the history, which is a signed-in view that renders nothing for a stranger.
   */
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /s/',
    'Disallow: /open/',
    'Disallow: /report/',
    'Disallow: /api/',
    'Disallow: /history',
    /* Framed into other pages, and the same converter as `/`. Not a search result. */
    'Disallow: /embed',
    'Disallow: /.well-known/',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n'),
  'utf8'
);

console.log(
  `prerendered ${pages.length} pages (${ARTICLES.length} articles), sitemap and robots.txt`
);
