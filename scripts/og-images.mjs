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

/*
 * Two heights, because the two variants go in differently shaped holes.
 *
 * 630 is what a share expects — every scraper is built for 1.91:1. A card in the blog index is a
 * band above two lines of text, and at 630 it was taller than the words: cropping the tall picture
 * into it lost the composition's top and bottom, so the card variant is drawn at the shape it is
 * shown in instead.
 */
const HEIGHTS = { og: 630, card: 420 };

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
 * The document, drawn as shape rather than printed as code.
 *
 * The first version of these cards put three literal lines of Markdown and three of HTML on the
 * picture in a monospace face. At 1200px it read as a screenshot of a terminal; on a 330px card it
 * read as grey noise. This is the same idea in geometry: a stack of bars on the left with nothing
 * to tell them apart, the caret, and the same stack on the right with a heading, an indent and a
 * grid in it. It says "structure came out of flat text" at any size, and it has no text to misread.
 */
const bars = (widths, colour, thickness, gap) =>
  widths
    .map(
      (width, index) =>
        `<div style="width:${width}%;height:${thickness}px;border-radius:999px;background:${colour};${index ? `margin-top:${gap}px;` : ''}"></div>`
    )
    .join('');

function shape(accent, bare) {
  const thickness = bare ? 13 : 9;
  const gap = bare ? 14 : 11;

  return `
    <div class="shape">
      <div class="stack">${bars([100, 74, 88, 62], '#2b2b39', thickness, gap)}</div>
      <div class="arrow">&gt;</div>
      <div class="stack">
        <div style="width:64%;height:${thickness + 4}px;border-radius:999px;background:${accent}"></div>
        <div style="margin-top:${gap}px">${bars([100, 82], '#3d3d50', thickness, gap)}</div>
        <div class="grid">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>`;
}

/**
 * The card, as a page.
 *
 * Two variants, because the picture has two jobs. `og` is what a share shows, so it carries the
 * headline: a share without one says nothing. `card` is the picture on a card that prints the
 * headline itself, three inches away, so a second copy inside the image would be unreadable text
 * pretending to be a picture — that variant is the shape and the tag, and no title at all.
 */
function card({ title, eyebrow, accent, slug = '', variant = 'og' }) {
  const height = HEIGHTS[variant];
  /*
   * Three sizes rather than a computed one: enough to keep a nine-word title inside the frame and a
   * three-word one from looking lost, and every value is one somebody chose.
   */
  const size = title.length > 78 ? 48 : title.length > 48 ? 58 : 70;
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
    height: ${height}px;
    position: relative;
    overflow: hidden;
    /* Lifted towards the accent at the top, so the ground is not a flat rectangle. */
    background:
      radial-gradient(120% 80% at 88% -10%, ${accent}24 0%, ${accent}00 58%),
      linear-gradient(160deg, #15151f 0%, #0f0e14 62%);
    font-family: "DM Sans", system-ui, sans-serif;
    color: #f9fafb;
  }

  /* The pipe, entering: a rail down the left edge in the tag's own colour. */
  .rail {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 8px;
    background: linear-gradient(180deg, ${accent} 0%, ${accent}44 100%);
  }

  .frame {
    position: absolute;
    inset: 0;
    padding: ${bare ? '52px 68px' : '68px 80px 60px'};
    display: flex;
    flex-direction: column;
    ${bare ? 'justify-content: center; gap: 34px;' : ''}
  }

  /*
   * The share card is two columns: the headline on the left, the shape beside it.
   *
   * With the title alone there was a hand's width of empty ground between it and the footer, and
   * empty ground in the middle of a picture reads as something that failed to load.
   */
  .split {
    display: flex;
    align-items: center;
    gap: 56px;
  }

  .split .words { flex: 1 1 auto; min-width: 0; }
  .split .art { flex: 0 0 40%; }

  .eyebrow {
    font-size: ${bare ? 26 : 21}px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${accent};
  }

  h1 {
    margin-top: 22px;
    max-width: 15em;
    font-size: ${size}px;
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: -0.022em;
    text-wrap: balance;
  }

  .foot {
    margin-top: auto;
    padding-top: 30px;
    border-top: 1px solid #262633;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    font-size: 21px;
    color: #6b6b7b;
  }

  .brand {
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-weight: 600;
    font-size: 24px;
    letter-spacing: -0.02em;
    color: #f9fafb;
  }

  .brand span { color: ${accent}; }

  /* The shape: two stacks of bars and the caret between them. */
  .shape {
    display: flex;
    align-items: center;
    gap: ${bare ? 64 : 30}px;
  }

  .stack { flex: 1 1 0; min-width: 0; }

  .arrow {
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-size: ${bare ? 76 : 54}px;
    font-weight: 600;
    line-height: 1;
    color: ${accent};
  }

  .grid {
    margin-top: ${bare ? 18 : 14}px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${bare ? 6 : 4}px;
  }

  .grid span {
    height: ${bare ? 22 : 17}px;
    border: 2px solid #3d3d50;
    border-radius: 4px;
  }
</style>
</head>
<body>
  <div class="rail"></div>

  <div class="frame">
    ${
      bare
        ? `<div class="eyebrow">${escape(eyebrow)}</div>${shape(accent, bare)}`
        : `<div class="split">
      <div class="words">
        <div class="eyebrow">${escape(eyebrow)}</div>
        <h1>${escape(title)}</h1>
      </div>
      <div class="art">${shape(accent, bare)}</div>
    </div>

    <div class="foot">
      <div class="brand">T<span>&gt;</span>pipe</div>
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

for (const one of cards) {
  const height = HEIGHTS[one.variant ?? 'og'];

  mkdirSync(dirname(one.file), { recursive: true });
  await page.setViewport({ width: WIDTH, height, deviceScaleFactor: 1 });
  await page.setContent(card(one), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  writeFileSync(one.file, await page.screenshot({ type: 'png' }));
}

await browser.close();

const articles = (cards.length - PAGES.length) / 2;

console.log(
  `drew ${cards.length} covers into public/og: ${articles} articles (a share image and a card image each) and ${PAGES.length} pages`
);
