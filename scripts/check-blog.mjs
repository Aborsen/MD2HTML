/* Checks the articles before they ship.
 *
 *   npm run blog:check
 *
 * Frontmatter, dead internal links, house style, length. None of it judges whether an article is any
 * good — that is a person's job — but all of it catches the things a reader notices immediately and
 * a writer never does: a link to a slug that was renamed, a description that Google will truncate, a
 * heading level that fights the page's own H1.
 *
 * Every language, not only English. A translation lives in content/blog/<locale>/<slug>.md under the
 * English file's name, and the checks that apply to prose in any language apply to it too — the
 * frontmatter, the description length, the covers, the missing H1. The ones that do not are named
 * where they are skipped.
 *
 * Exits non-zero when something is wrong, so it can sit in front of a deploy.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const ROOT = 'content/blog';
const KEYS = ['title', 'description', 'date', 'tag', 'keywords'];

/*
 * Written out rather than imported from src/lib/i18n/locales.ts, because this script is plain Node
 * with no bundler in front of it. A language added there and forgotten here is simply not checked,
 * which is why `npm run og` and the prerenderer carry the same list and the same note.
 */
const LOCALES = ['en', 'de', 'fr', 'es', 'it'];

const DEFAULT_LOCALE = 'en';

const dirFor = (locale) =>
  locale === DEFAULT_LOCALE ? ROOT : `${ROOT}/${locale}`;

const filesIn = (locale) => {
  const dir = dirFor(locale);

  return existsSync(dir)
    ? readdirSync(dir).filter((name) => name.endsWith('.md'))
    : [];
};

/*
 * `updated` is allowed and not required: it belongs only on an article that has been revised since
 * it was published, and it is what the sitemap's `lastmod` and the page's `dateModified` are built
 * from. An article that carries it and has not changed is a false claim to a crawler, so it is not
 * a field to add by default.
 */
const OPTIONAL_KEYS = ['updated'];

/*
 * Everything inside a fence is a sample, not prose: a shell comment is not a heading.
 *
 * Anchored to the start of a line, because samples contain backticks of their own — an awk script
 * that matches `/^```/` is one of ours — and an unanchored pattern pairs those with the real fences
 * and swallows the paragraphs in between.
 */
const withoutCode = (markdown) =>
  markdown.replace(/^```[\s\S]*?^```[^\n]*$/gm, '');

const BANNED = [
  'game-chang',
  'seamless',
  'dive in',
  'delve',
  'in conclusion',
  'supercharge',
  'revolutionis',
  'cutting-edge',
  'unlock the',
  'in today',
];

/** The English slug space, which every language shares — the prefix carries the language. */
const slugs = new Set(
  filesIn(DEFAULT_LOCALE).map((name) => name.replace(/\.md$/, ''))
);

const problems = [];
const linkedTo = new Set();
const rows = [];

/** How long the English piece is, so a truncated translation is visible. */
const englishWords = new Map();

for (const locale of LOCALES) {
  for (const file of filesIn(locale)) {
    const slug = file.replace(/\.md$/, '');
    /* What a problem is called: `markdown-escaping` in English, `de/markdown-escaping` beside it. */
    const name = locale === DEFAULT_LOCALE ? slug : `${locale}/${slug}`;
    const raw = readFileSync(`${dirFor(locale)}/${file}`, 'utf8');
    const header = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

    if (!header) {
      problems.push(`${name}: no frontmatter`);
      continue;
    }

    const data = {};

    for (const line of header[1].split(/\r?\n/)) {
      const at = line.indexOf(':');

      if (at > 0) {
        data[line.slice(0, at).trim()] = line
          .slice(at + 1)
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    }

    const body = raw.slice(header[0].length);
    const prose = withoutCode(body);

    for (const key of KEYS) {
      if (!data[key]) {
        problems.push(`${name}: missing ${key}`);
      }
    }

    for (const key of Object.keys(data)) {
      if (!KEYS.includes(key) && !OPTIONAL_KEYS.includes(key)) {
        problems.push(`${name}: unexpected frontmatter key "${key}"`);
      }
    }

    // Google shows roughly 155 characters; shorter than 100 wastes the slot.
    if (data.description && (data.description.length < 100 || data.description.length > 165)) {
      problems.push(`${name}: description is ${data.description.length} characters`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date ?? '')) {
      problems.push(`${name}: date "${data.date}" is not YYYY-MM-DD`);
    }

    if (data.updated) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updated)) {
        problems.push(`${name}: updated "${data.updated}" is not YYYY-MM-DD`);
      } else if (data.updated < data.date) {
        // Revised before it was published is either a typo or a date somebody moved by hand.
        problems.push(
          `${name}: updated ${data.updated} is before date ${data.date}`
        );
      }
    }

    if (/^# /m.test(prose)) {
      problems.push(`${name}: the body has an H1 — the page renders the title itself`);
    }

    const links = [...prose.matchAll(/\]\((\/blog\/[a-z0-9-]+)\)/g)].map((match) =>
      match[1].replace('/blog/', '')
    );

    for (const target of links) {
      if (!slugs.has(target)) {
        problems.push(`${name}: dead link to /blog/${target}`);
      } else if (target === slug) {
        problems.push(`${name}: links to itself`);
      } else if (locale === DEFAULT_LOCALE) {
        linkedTo.add(target);
      }
    }

    if (/[\u{1F300}-\u{1FAFF}]/u.test(prose)) {
      problems.push(`${name}: emoji`);
    }

    // The whole body, code included: a reader reads the commands too, and an article that explains
    // itself in samples is not thin the way an article of four short paragraphs is. Headings and
    // fences are counted with everything else — this is a smoke alarm, not a judge.
    const words = body.split(/\s+/).filter(Boolean).length;
    const headings = (prose.match(/^## /gm) ?? []).length;
    /*
     * Case-insensitive, because the brand is written TransformPipe.
     *
     * It was `/g` against a lowercase pattern, and when the name was capitalised across the articles
     * this quietly started counting zero — so the rule that stops a piece reading as an advertisement
     * was switched off by a rename, without anything failing.
     */
    const mentions = (prose.match(/\btransformpipe\b/gi) ?? []).length;

    if (locale === DEFAULT_LOCALE) {
      englishWords.set(slug, words);

      /*
       * The banned phrases are English marketing words, so they are checked in English only. A
       * translation cannot introduce them without the original having them: it is a translation.
       */
      for (const phrase of BANNED) {
        if (prose.toLowerCase().includes(phrase)) {
          problems.push(`${name}: banned phrase "${phrase}"`);
        }
      }

      if (words < 750) {
        problems.push(`${name}: ${words} words — too thin to rank or to help`);
      }

      if (links.length === 0) {
        problems.push(`${name}: no internal links`);
      }
    } else {
      /*
       * A translation of nothing.
       *
       * The slug is the English file's name in every language, so a name with no English original
       * is a typo or a rename that happened on one side only — and it would be served at an address
       * with no English alternate, which is not a translation of anything.
       */
      if (!slugs.has(slug)) {
        problems.push(`${name}: no English article by that name`);
      } else {
        /*
         * Two thirds of the English length, which catches the failure this actually has: a
         * translation that stops half way, or one where a section was dropped because it was hard.
         * Languages differ in length — German runs long, English short — so the bar is loose on
         * purpose and only a missing chunk trips it.
         */
        const source = englishWords.get(slug) ?? 0;

        if (source > 0 && words < source * 0.66) {
          problems.push(
            `${name}: ${words} words against ${source} in English — something is missing`
          );
        }
      }
    }

    if (headings < 3) {
      problems.push(`${name}: only ${headings} sections`);
    }

    if (mentions > 4) {
      problems.push(`${name}: TransformPipe named ${mentions} times — it reads as an advertisement`);
    }

    rows.push({
      article: name,
      words,
      sections: headings,
      links: links.length,
      mentions,
      tag: data.tag,
    });
  }
}

/*
 * An article nothing links to is reachable only from the index, which is where readers arrive last.
 *
 * English only: a translation inherits the prose's links, so the graph is the same one and checking
 * it again per language would report the same orphan five times.
 */
for (const slug of slugs) {
  if (!linkedTo.has(slug)) {
    problems.push(`${slug}: orphan — no other article links to it`);
  }
}

/*
 * Both covers exist, in every language that has the article.
 *
 * `npm run og` draws them and is not part of the build, so an article written without running it
 * gets a card with a broken image and a share with no picture — and neither shows up until somebody
 * looks at the index or posts a link. Cheap to check, invisible otherwise. The pictures carry the
 * headline as drawn text, which is why a translation needs its own rather than the English one.
 */
for (const locale of LOCALES) {
  const under = locale === DEFAULT_LOCALE ? '' : `/${locale}`;

  for (const file of filesIn(locale)) {
    const slug = file.replace(/\.md$/, '');
    const name = locale === DEFAULT_LOCALE ? slug : `${locale}/${slug}`;

    for (const [kind, path] of [
      ['share image', `public/og/blog${under}/${slug}.jpg`],
      ['card image', `public/og/card${under}/${slug}.webp`],
    ]) {
      if (!existsSync(path)) {
        problems.push(`${name}: no ${kind} — run \`npm run og\``);
      }
    }
  }
}

console.table(rows);

const counts = LOCALES.map((locale) => `${locale} ${filesIn(locale).length}`).join(
  ', '
);

if (problems.length === 0) {
  console.log(`${rows.length} articles (${counts}), nothing to fix.`);
  process.exit(0);
}

console.error(`\n${problems.length} problems:\n${problems.map((p) => `  ${p}`).join('\n')}`);
process.exit(1);
