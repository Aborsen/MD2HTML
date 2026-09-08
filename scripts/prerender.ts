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
import { ARTICLES, articlePath, formatArticleDate } from '../src/lib/blog.js';
import { DOCS_SECTIONS } from '../src/lib/docs-sections.js';
import { FAQ_ENTRIES } from '../src/lib/faq.js';

const SITE = process.env.SITE_URL ?? 'https://md-2-html.vercel.app';
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

if (!SHELL.includes('<div id="root"></div>')) {
  throw new Error(
    'dist/index.html has no empty <div id="root"></div> to render into — run `vite build` first.'
  );
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
  /** What a crawler — and a reader on a slow connection — sees before the bundle runs. */
  body: string;
  head?: string;
  /** Left out of the sitemap when false. */
  listed?: boolean;
  lastmod?: string;
}

function render(page: Page): string {
  const url = `${SITE}${page.path === '/' ? '' : page.path}`;

  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.path.startsWith('/blog/') ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="M2H" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
    FALLBACK_STYLE,
    page.head ?? '',
  ].join('\n    ');

  return SHELL.replace(
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
for (const article of ARTICLES) {
  pages.push({
    path: articlePath(article.slug),
    title: `${article.title} — M2H`,
    description: article.description,
    lastmod: article.date,
    listed: true,
    head: [
      `<meta property="article:published_time" content="${article.date}" />`,
      `<meta property="article:tag" content="${escapeHtml(article.tag)}" />`,
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.date,
        keywords: article.keywords.join(', '),
        articleSection: article.tag,
        inLanguage: 'en',
        mainEntityOfPage: `${SITE}${articlePath(article.slug)}`,
        publisher: { '@type': 'Organization', name: 'M2H', url: SITE },
        author: { '@type': 'Organization', name: 'M2H', url: SITE },
      }),
      DOC_STYLE,
    ].join('\n    '),
    body: `<article class="md-doc"><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(
      formatArticleDate(article.date)
    )} · ${article.readingMinutes} min read</p>${markdownToHtml(article.markdown)}</article>`,
  });
}

// ---------------------------------------------------------------- the blog index
pages.push({
  path: '/blog',
  title: 'Blog — Markdown, and what to do with it — M2H',
  description:
    'Converting Markdown, the syntax that breaks on the way to HTML, publishing documents for people who do not use Markdown, and automating the whole thing.',
  listed: true,
  lastmod: ARTICLES[0]?.date,
  head: jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'M2H Blog',
    url: `${SITE}/blog`,
    blogPost: ARTICLES.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      url: `${SITE}${articlePath(article.slug)}`,
    })),
  }),
  body: `<h1>Markdown, and what to do with it</h1><ul>${ARTICLES.map(
    (article) =>
      `<li><a href="${articlePath(article.slug)}">${escapeHtml(article.title)}</a> — ${escapeHtml(
        article.description
      )}</li>`
  ).join('')}</ul>`,
});

// ---------------------------------------------------------------- the converter
pages.push({
  path: '/',
  title: 'M2H — Markdown to HTML converter',
  description:
    'Drop a Markdown file and get the rendered document and a self-contained .html to download. Converts in your browser; sign in to keep, share and publish documents.',
  listed: true,
  head: jsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ENTRIES.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: String(entry.answer) },
    })),
  }),
  body: `<h1>Markdown to HTML</h1><p>Upload a Markdown file — see the rendered HTML instantly and download it as a ready-to-use document.</p>${FAQ_ENTRIES.map(
    (entry) =>
      `<section><h2>${escapeHtml(entry.question)}</h2><p>${escapeHtml(String(entry.answer))}</p></section>`
  ).join('')}`,
});

// ---------------------------------------------------------------- the documentation
pages.push({
  path: '/docs',
  title: 'Documentation — M2H',
  description:
    'What M2H does, in full: converting, the history, sharing by link or by address, the API, the command line client, the GitHub Action and the limits.',
  listed: true,
  body: `<h1>Everything M2H does</h1><p>Markdown in, a self-contained HTML document out — from the app, from a terminal, or from a pull request.</p>${DOCS_SECTIONS.map(
    (section) =>
      `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.summary)}</p></section>`
  ).join('')}`,
});

for (const page of pages) {
  write(page);
}

// ---------------------------------------------------------------- sitemap and robots
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((page) => page.listed)
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
  // Shared documents are other people's; they are linked to deliberately, not crawled.
  `User-agent: *\nAllow: /\nDisallow: /s/\nDisallow: /open/\nDisallow: /report/\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8'
);

console.log(
  `prerendered ${pages.length} pages (${ARTICLES.length} articles), sitemap and robots.txt`
);
