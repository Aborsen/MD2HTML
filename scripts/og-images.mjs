/* Draws a cover for every page, once, into public/og.
 *
 *   npm run og
 *
 * They do two jobs. They are the `og:image` a link gets when somebody shares it — without one, a
 * post about this site is a grey rectangle with a URL in it — and they are the picture on the cards
 * in the blog index and on the front page, which is what stops fifty articles reading as a wall of
 * identical text.
 *
 * Rendered in a real browser rather than composed as SVG, because the titles are set in DM Sans
 * with the app's own weights and a text layout engine is the only thing that knows where the lines
 * break. The font is loaded from public/fonts, so this runs offline and produces the same file
 * twice.
 *
 * The motif is the product: three lines of Markdown, the brand caret, the same three as HTML. The
 * accent comes from the tag, so the blog index reads as seven colours rather than one.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROOT = resolve('.');
const OUT = join(ROOT, 'public', 'og');
const WIDTH = 1200;
const HEIGHT = 630;

/*
 * One accent per tag, all of them chosen against #0f0e14 rather than taken from a ramp. Teal is the
 * brand's own; the rest sit far enough apart in hue to tell a Safety piece from a Syntax one at
 * card size, and close enough in chroma that a page of them is not a fruit bowl.
 */
const ACCENTS = {
  Converting: '#14a8af',
  Syntax: '#7c8cf8',
  Publishing: '#e0a34a',
  Automation: '#4ec9a0',
  Safety: '#e0685f',
  Workflow: '#b07cf8',
  Code: '#5aa9e6',
};

const DEFAULT_ACCENT = ACCENTS.Converting;

const escape = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** The same flat frontmatter the app's loader reads. */
function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return {};
  }

  const data = {};

  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':');

    if (at > 0) {
      data[line.slice(0, at).trim()] = line
        .slice(at + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  }

  return data;
}

const fontUrl = pathToFileURL(
  join(ROOT, 'public', 'fonts', 'dm-sans-latin-normal.woff2')
).href;

/*
 * Three sets of lines, so a grid of card images is not one picture repeated.
 *
 * Which set a slug gets is decided by its own characters, so it is the same on every build and a
 * new article does not reshuffle the ones beside it.
 */
const MOTIFS = [
  [['# Heading', '- item', '| a | b |'], ['&lt;h1&gt;Heading&lt;/h1&gt;', '&lt;li&gt;item&lt;/li&gt;', '&lt;table&gt;…&lt;/table&gt;']],
  [['## Section', '**bold**', '`code`'], ['&lt;h2&gt;Section&lt;/h2&gt;', '&lt;strong&gt;bold&lt;/strong&gt;', '&lt;code&gt;code&lt;/code&gt;']],
  [['[link](url)', '> quote', '- [x] done'], ['&lt;a href="url"&gt;link&lt;/a&gt;', '&lt;blockquote&gt;…', '&lt;input checked&gt;']],
];

const pick = (slug) => {
  let total = 0;

  for (const character of slug) {
    total += character.codePointAt(0);
  }

  return MOTIFS[total % MOTIFS.length];
};

/**
 * The card, as a page.
 *
 * Two variants, because the picture has two jobs. `og` carries the title: it is what a share shows,
 * and a share with no headline is a coloured rectangle. `card` leaves the title out: the card in the
 * blog index prints the headline right beside the image, and a second copy of it rendered at 330px
 * wide is unreadable text pretending to be a picture.
 */
function card({ title, eyebrow, accent, slug = '', variant = 'og' }) {
  /*
   * Three sizes rather than a computed one: enough to keep a nine-word title inside the frame and a
   * three-word one from looking lost, and every value is one somebody chose.
   */
  const size = title.length > 78 ? 46 : title.length > 48 ? 56 : 68;
  const [source, output] = pick(slug || title);
  const bare = variant === 'card';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "DM Sans";
    src: url("${fontUrl}") format("woff2");
    font-weight: 100 1000;
    font-display: block;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    position: relative;
    background: #0f0e14;
    font-family: "DM Sans", system-ui, sans-serif;
    color: #f9fafb;
  }

  /* One soft light behind the motif, so the ground is not a flat rectangle. */
  .glow {
    position: absolute;
    top: -260px;
    right: -180px;
    width: 760px;
    height: 620px;
    background: radial-gradient(circle at center, ${accent}2e 0%, ${accent}00 68%);
  }

  .frame {
    position: absolute;
    inset: 0;
    padding: ${bare ? '48px 56px' : '56px 64px 52px'};
    display: flex;
    flex-direction: column;
    ${bare ? 'justify-content: center; gap: 40px;' : ''}
  }

  /* The product, drawn: Markdown on the left, the caret, the same lines as HTML. */
  .motif {
    display: flex;
    align-items: center;
    gap: ${bare ? 64 : 30}px;
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-size: ${bare ? 46 : 19}px;
    line-height: 1.7;
    color: ${bare ? '#8a8a9c' : '#6b6b7b'};
  }

  .motif .caret {
    color: ${accent};
    font-size: ${bare ? 76 : 34}px;
    font-weight: 600;
  }

  .motif .out { color: #9a9aad; }

  .eyebrow {
    ${bare ? 'order: -1;' : 'margin-top: auto;'}
    font-size: ${bare ? 30 : 19}px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${accent};
  }

  h1 {
    margin-top: 18px;
    max-width: 15.5em;
    font-size: ${size}px;
    font-weight: 600;
    line-height: 1.14;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  .foot {
    margin-top: 40px;
    padding-top: 26px;
    border-top: 1px solid #2a2834;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    font-size: 21px;
    color: #6b6b7b;
  }

  .brand {
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-weight: 600;
    font-size: 23px;
    letter-spacing: -0.02em;
    color: #f9fafb;
  }

  .brand span { color: ${accent}; }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="frame">
    <div class="motif">
      <div>${source.map((line) => `<div>${line}</div>`).join('')}</div>
      <div class="caret">&gt;</div>
      <div class="out">${output.map((line) => `<div>${line}</div>`).join('')}</div>
    </div>

    <div class="eyebrow">${escape(eyebrow)}</div>
    ${bare ? '' : `<h1>${escape(title)}</h1>`}

    ${
      bare
        ? ''
        : `<div class="foot">
      <div class="brand">transform<span>&gt;</span>pipe</div>
      <div>transformpipe.com</div>
    </div>`
    }
  </div>
</body>
</html>`;
}

/* ------------------------------------------------------------------ what to draw */

const cards = [];

for (const name of readdirSync(join(ROOT, 'content', 'blog')).sort()) {
  if (!name.endsWith('.md')) {
    continue;
  }

  const slug = name.replace(/\.md$/, '');
  const data = frontmatter(
    readFileSync(join(ROOT, 'content', 'blog', name), 'utf8')
  );

  const one = {
    slug,
    title: data.title ?? slug,
    eyebrow: data.tag ?? 'Blog',
    accent: ACCENTS[data.tag] ?? DEFAULT_ACCENT,
  };

  // The share image carries the headline; the one on the card does not.
  cards.push({ ...one, file: join(OUT, 'blog', `${slug}.png`), variant: 'og' });
  cards.push({ ...one, file: join(OUT, 'card', `${slug}.png`), variant: 'card' });
}

/*
 * The rest of the site. Hand-written rather than read from `shared/conversions.ts`, because this
 * script is plain Node with no bundler in front of it and importing a .ts file would need one.
 * `npm run og` prints the count, so a page added without a card is visible.
 */
const PAGES = [
  ['home', 'A document converter that runs in your browser', 'Converter', ACCENTS.Converting],
  ['blog', 'Markdown, and what to do with it', 'Blog', ACCENTS.Syntax],
  ['docs', 'Everything transformpipe does', 'Documentation', ACCENTS.Code],
  ['markdown-to-html', 'Markdown to HTML', 'Convert', ACCENTS.Converting],
  ['html-to-markdown', 'HTML to Markdown', 'Convert', ACCENTS.Converting],
  ['word-to-markdown', 'Word to Markdown', 'Convert', ACCENTS.Publishing],
  ['csv-to-markdown', 'CSV to a Markdown table', 'Convert', ACCENTS.Automation],
  ['json-to-markdown', 'JSON to Markdown', 'Convert', ACCENTS.Code],
  ['about', 'About transformpipe', 'Company', ACCENTS.Workflow],
  ['contact', 'Contact us', 'Company', ACCENTS.Workflow],
  ['privacy', 'Privacy', 'Legal', ACCENTS.Safety],
  ['terms', 'Terms of use', 'Legal', ACCENTS.Safety],
  ['cookies', 'Cookies', 'Legal', ACCENTS.Safety],
];

for (const [name, title, eyebrow, accent] of PAGES) {
  cards.push({ file: join(OUT, `${name}.png`), title, eyebrow, accent });
}

/* ------------------------------------------------------------------ draw them */

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

for (const one of cards) {
  mkdirSync(dirname(one.file), { recursive: true });
  await page.setContent(card(one), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const shot = await page.screenshot({ type: 'png' });
  writeFileSync(one.file, shot);
}

await browser.close();

const articles = (cards.length - PAGES.length) / 2;

console.log(
  `drew ${cards.length} covers into public/og: ${articles} articles (a share image and a card image each) and ${PAGES.length} pages`
);
