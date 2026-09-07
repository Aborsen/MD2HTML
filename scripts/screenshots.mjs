/* Captures the screenshots the /docs page shows, from the app itself.
 *
 *   npm run docs:shots                    against http://127.0.0.1:5180
 *   npm run docs:shots -- --host https://md-2-html.vercel.app
 *
 * Every shot is taken twice, light and dark, because a dark screenshot on a light page reads as
 * somebody else's product. The files land in public/docs/<name>-<theme>.png and the page picks the
 * one matching the reader's theme.
 *
 * It drives an installed Chrome (puppeteer-core, no bundled browser) through the real app: it
 * uploads the fixtures in scripts/fixtures, opens the tabs, and ticks the boxes. Nothing here is a
 * mock-up — if a screenshot looks wrong, the app looks wrong.
 */
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);

  return index === -1 ? fallback : args[index + 1];
};

const HOST = flag('host', 'http://127.0.0.1:5180');
const OUT = resolve('public/docs');
const FIXTURES = resolve('scripts/fixtures');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((path) => existsSync(path));

if (!chrome) {
  console.error(
    'No Chrome found. Set CHROME_PATH to the executable and run this again.'
  );
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const fixtures = readdirSync(FIXTURES)
  .filter((name) => name.endsWith('.md'))
  .map((name) => join(FIXTURES, name));

/** Waits for whatever the click set off to settle, without guessing at a selector. */
const settle = (page, ms = 450) =>
  new Promise((done) => setTimeout(done, ms));

async function clickText(page, selector, text) {
  const handles = await page.$$(selector);

  for (const handle of handles) {
    const label = await handle.evaluate((node) => node.textContent?.trim());

    if (label?.includes(text)) {
      await handle.click();
      return true;
    }
  }

  throw new Error(`No ${selector} reading "${text}"`);
}

/*
 * Toasts sit over the header, which is where the navigation is. They close themselves after a few
 * seconds; clicking them closed is faster and does not depend on how long that is.
 */
async function hushToasts(page) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const toasts = await page.$$('[data-sonner-toast]');

    if (toasts.length === 0) {
      return;
    }

    for (const toast of toasts) {
      await toast.evaluate((node) => {
        const close =
          node.querySelector('button[aria-label="Close"]') ??
          node.querySelector('button[data-close-button]');

        close?.click();
      });
    }

    await settle(page, 200);
  }
}

/**
 * One shot. `until` names an element the picture should end just below, so a short list does not
 * ship with half a screen of empty page under it.
 */
async function shoot(page, name, theme, until) {
  const file = join(OUT, `${name}-${theme}.png`);

  await hushToasts(page);

  const height = until
    ? await page.$eval(until, (node) => node.getBoundingClientRect().bottom)
    : null;

  await page.screenshot({
    path: file,
    ...(height
      ? { clip: { x: 0, y: 0, width: 1280, height: Math.ceil(height) + 28 } }
      : {}),
  });

  console.log(`  ${name}-${theme}.png`);
}

async function capture(browser, theme) {
  console.log(`${theme}:`);

  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  // Land on the app once so the origin exists, then say which theme and which history to start from.
  await page.goto(HOST, { waitUntil: 'networkidle2' });
  await page.evaluate((value) => {
    localStorage.setItem('m2h.theme', value);
    localStorage.removeItem('md2html.history.v1');
  }, theme);
  await page.reload({ waitUntil: 'networkidle2' });
  await settle(page);

  await shoot(page, 'converter', theme);

  // Upload the fixtures one at a time so the history has rows; the last one stays open.
  for (const fixture of fixtures) {
    const input = await page.$('input[type="file"]');

    await input.uploadFile(fixture);
    await settle(page, 700);

    if (fixture !== fixtures.at(-1)) {
      await page.click('button[aria-label="New file"]');
      await settle(page);
    }
  }

  await shoot(page, 'preview', theme);

  await clickText(page, 'button[role="tab"]', 'HTML source');
  await settle(page);
  await shoot(page, 'source', theme);

  await clickText(page, 'nav button', 'History');
  await settle(page, 700);
  await shoot(page, 'history', theme, 'table');

  const boxes = await page.$$('td button[role="checkbox"], td [role="checkbox"]');

  for (const box of boxes.slice(0, 2)) {
    await box.click();
    await settle(page, 150);
  }

  await settle(page, 400);
  await shoot(page, 'selection', theme, 'table');

  await page.close();
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--force-color-profile=srgb', '--hide-scrollbars'],
});

try {
  for (const theme of ['dark', 'light']) {
    await capture(browser, theme);
  }
} finally {
  await browser.close();
}

console.log(`\nWritten to ${OUT}`);
