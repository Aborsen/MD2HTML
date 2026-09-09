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
 * One composition, drawn twice at different sizes.
 *
 * 1200 by 630 is what a share expects — every scraper is built for 1.91:1 — and the card in the
 * blog index is the same picture at two thirds the size, so the layout is identical and only the
 * pixels differ. That is `deviceScaleFactor`, not a second template: the earlier version had two
 * templates, one of which omitted the title, and they drifted every time the design changed.
 *
 * The card being smaller matters. It is shown about 390px wide in a three-column grid, so a
 * 1200px source was four times the pixels the browser needed on every card on the page.
 */
const VARIANTS = {
  og: { scale: 1, type: 'jpeg', quality: 94, ext: 'jpg' },
  card: { scale: 2 / 3, type: 'webp', quality: 90, ext: 'webp' },
};

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

function shape(accent) {
  return `
    <div class="shape">
      <div class="stack">${bars([100, 74, 88, 62], '#34344a', 11, 13)}</div>
      <div class="arrow">&gt;</div>
      <div class="stack">
        <div style="width:64%;height:15px;border-radius:999px;background:${accent}"></div>
        <div style="margin-top:13px">${bars([100, 82], '#474760', 11, 13)}</div>
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
 * The headline is in the picture, in both sizes. The card variant used to leave it out, on the
 * argument that a title inside a 390px image sitting three inches from the real title is
 * unreadable text pretending to be a picture. Set small, in the top-left of a frame with room in
 * it, it is legible and it is what stops a grid of covers reading as coloured rectangles — which is
 * what a grid of shapes without words turned out to be.
 *
 * The layout: an accent rule, the tag above the headline, the headline over about three lines, the
 * motif entering from the right edge rather than sitting inside a column, and the mark and the
 * domain together at the bottom. The motif bleeds off the frame on purpose — a shape that stops
 * before the edge is a diagram, and one that runs off it is a background.
 */
function card({ title, eyebrow, accent }) {
  /*
   * Three sizes rather than a computed one, and all smaller than they were: the headline now shares
   * the frame with a motif that reaches into it, and at the old 70px a nine-word title ran into the
   * arcs. Every value is one somebody chose.
   */
  const size = title.length > 78 ? 40 : title.length > 48 ? 46 : 54;

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
    position: relative;
    overflow: hidden;
    /*
     * Two lifts rather than one. The accent glow sits behind the motif on the right, where the
     * colour belongs; a colder one behind the headline on the left keeps the text off a flat
     * rectangle without tinting the words.
     */
    background:
      radial-gradient(90% 120% at 96% 8%, ${accent}20 0%, ${accent}00 62%),
      radial-gradient(70% 90% at 6% 40%, #1c1c28 0%, #1c1c2800 70%),
      linear-gradient(160deg, #14141d 0%, #0f0e14 64%);
    font-family: "DM Sans", system-ui, sans-serif;
    color: #f9fafb;
  }

  /*
   * The motif, entering from the right edge.
   *
   * Positioned rather than laid out in a column, and pushed past the frame so it is cropped by it.
   * Behind the text in the stacking order and dimmed, because the headline is the picture's job and
   * the shape is what the frame is made of.
   */
  .art {
    position: absolute;
    top: 50%;
    right: -96px;
    width: 640px;
    transform: translateY(-50%);
    opacity: 0.88;
  }

  .frame {
    position: absolute;
    inset: 0;
    padding: 64px 72px 58px;
    display: flex;
    flex-direction: column;
  }

  /*
   * The words never run under the motif: a hard ceiling, not a hope about title length.
   *
   * Auto margins top and bottom rather than a top alignment, so a two-line title and a four-line
   * one both sit on the frame's middle. Top-aligned, a short title left a hand's width of empty
   * ground above the footer, which reads as something that failed to load.
   */
  .words {
    max-width: 62%;
    margin-top: auto;
    margin-bottom: auto;
  }

  /* The accent, as a rule above the tag. */
  .rule {
    width: 44px;
    height: 3px;
    border-radius: 999px;
    background: ${accent};
  }

  .eyebrow {
    margin-top: 20px;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${accent};
  }

  h1 {
    margin-top: 18px;
    font-size: ${size}px;
    font-weight: 600;
    line-height: 1.16;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  /* Both marks together, bottom left, the way a masthead sits. */
  .foot {
    display: flex;
    align-items: baseline;
    gap: 14px;
    font-size: 19px;
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

  /* The shape: two stacks of bars and the caret between them. */
  .shape {
    display: flex;
    align-items: center;
    gap: 34px;
  }

  .stack { flex: 1 1 0; min-width: 0; }

  .arrow {
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-size: 62px;
    font-weight: 600;
    line-height: 1;
    color: ${accent};
  }

  .grid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }

  .grid span {
    height: 20px;
    border: 2px solid #474760;
    border-radius: 4px;
  }
</style>
</head>
<body>
  <div class="art">${shape(accent)}</div>

  <div class="frame">
    <div class="words">
      <div class="rule"></div>
      <div class="eyebrow">${escape(eyebrow)}</div>
      <h1>${escape(title)}</h1>
    </div>

    <div class="foot">
      <div class="brand">T<span>&gt;</span>pipe</div>
      <div>transformpipe.com</div>
    </div>
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

  // The same picture twice: full size for a share, two thirds for the card that shows it.
  cards.push({ ...one, dir: 'blog', variant: 'og' });
  cards.push({ ...one, dir: 'card', variant: 'card' });
}

/*
 * The rest of the site. Hand-written rather than read from `shared/conversions.ts`, because this
 * script is plain Node with no bundler in front of it and importing a .ts file would need one.
 * `npm run og` prints the count, so a page added without a card is visible.
 */
const PAGES = [
  ['home', 'A document converter that runs in your browser', 'Converter', ACCENTS.Converting],
  ['blog', 'Markdown, and what to do with it', 'Blog', ACCENTS.Syntax],
  ['docs', 'Everything TransformPipe does', 'Documentation', ACCENTS.Code],
  ['markdown-to-html', 'Markdown to HTML', 'Convert', ACCENTS.Converting],
  ['html-to-markdown', 'HTML to Markdown', 'Convert', ACCENTS.Converting],
  ['word-to-markdown', 'Word to Markdown', 'Convert', ACCENTS.Publishing],
  ['csv-to-markdown', 'CSV to a Markdown table', 'Convert', ACCENTS.Automation],
  ['json-to-markdown', 'JSON to Markdown', 'Convert', ACCENTS.Code],
  ['about', 'About TransformPipe', 'Company', ACCENTS.Workflow],
  ['contact', 'Contact us', 'Company', ACCENTS.Workflow],
  ['privacy', 'Privacy', 'Legal', ACCENTS.Safety],
  ['terms', 'Terms of use', 'Legal', ACCENTS.Safety],
  ['cookies', 'Cookies', 'Legal', ACCENTS.Safety],
];

for (const [name, title, eyebrow, accent] of PAGES) {
  cards.push({ slug: name, title, eyebrow, accent, variant: 'og' });
}

/* ------------------------------------------------------------------ draw them */

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});

const page = await browser.newPage();

for (const one of cards) {
  const { scale, type, quality, ext } = VARIANTS[one.variant];
  const file = join(OUT, ...(one.dir ? [one.dir] : []), `${one.slug}.${ext}`);

  mkdirSync(dirname(file), { recursive: true });
  /*
   * The layout is always drawn at 1200 by 630; the scale factor decides how many pixels come out.
   * So the card is the same composition, not a second one that has to be kept in step.
   */
  await page.setViewport({
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: scale,
  });
  await page.setContent(card(one), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  writeFileSync(file, await page.screenshot({ type, quality }));
}

await browser.close();

const articles = (cards.length - PAGES.length) / 2;

console.log(
  `drew ${cards.length} covers into public/og: ${articles} articles (a share image and a card image each) and ${PAGES.length} pages`
);
