/* Checks the articles before they ship.
 *
 *   npm run blog:check
 *
 * Frontmatter, dead internal links, house style, length. None of it judges whether an article is any
 * good — that is a person's job — but all of it catches the things a reader notices immediately and
 * a writer never does: a link to a slug that was renamed, a description that Google will truncate, a
 * heading level that fights the page's own H1.
 *
 * Exits non-zero when something is wrong, so it can sit in front of a deploy.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const DIR = 'content/blog';
const KEYS = ['title', 'description', 'date', 'tag', 'keywords'];

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

const files = readdirSync(DIR).filter((name) => name.endsWith('.md'));
const slugs = new Set(files.map((name) => name.replace(/\.md$/, '')));
const problems = [];
const linkedTo = new Set();
const rows = [];

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const raw = readFileSync(`${DIR}/${file}`, 'utf8');
  const header = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!header) {
    problems.push(`${slug}: no frontmatter`);
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
      problems.push(`${slug}: missing ${key}`);
    }
  }

  for (const key of Object.keys(data)) {
    if (!KEYS.includes(key) && !OPTIONAL_KEYS.includes(key)) {
      problems.push(`${slug}: unexpected frontmatter key "${key}"`);
    }
  }

  // Google shows roughly 155 characters; shorter than 100 wastes the slot.
  if (data.description && (data.description.length < 100 || data.description.length > 165)) {
    problems.push(`${slug}: description is ${data.description.length} characters`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date ?? '')) {
    problems.push(`${slug}: date "${data.date}" is not YYYY-MM-DD`);
  }

  if (data.updated) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updated)) {
      problems.push(`${slug}: updated "${data.updated}" is not YYYY-MM-DD`);
    } else if (data.updated < data.date) {
      // Revised before it was published is either a typo or a date somebody moved by hand.
      problems.push(
        `${slug}: updated ${data.updated} is before date ${data.date}`
      );
    }
  }

  if (/^# /m.test(prose)) {
    problems.push(`${slug}: the body has an H1 — the page renders the title itself`);
  }

  const links = [...prose.matchAll(/\]\((\/blog\/[a-z0-9-]+)\)/g)].map((match) =>
    match[1].replace('/blog/', '')
  );

  for (const target of links) {
    if (!slugs.has(target)) {
      problems.push(`${slug}: dead link to /blog/${target}`);
    } else if (target === slug) {
      problems.push(`${slug}: links to itself`);
    } else {
      linkedTo.add(target);
    }
  }

  for (const phrase of BANNED) {
    if (prose.toLowerCase().includes(phrase)) {
      problems.push(`${slug}: banned phrase "${phrase}"`);
    }
  }

  if (/[\u{1F300}-\u{1FAFF}]/u.test(prose)) {
    problems.push(`${slug}: emoji`);
  }

  // The whole body, code included: a reader reads the commands too, and an article that explains
  // itself in samples is not thin the way an article of four short paragraphs is. Headings and
  // fences are counted with everything else — this is a smoke alarm, not a judge.
  const words = body.split(/\s+/).filter(Boolean).length;
  const headings = (prose.match(/^## /gm) ?? []).length;
  const mentions = (prose.match(/\btransformpipe\b/g) ?? []).length;

  if (words < 750) {
    problems.push(`${slug}: ${words} words — too thin to rank or to help`);
  }

  if (headings < 3) {
    problems.push(`${slug}: only ${headings} sections`);
  }

  if (mentions > 4) {
    problems.push(`${slug}: transformpipe named ${mentions} times — it reads as an advertisement`);
  }

  if (links.length === 0) {
    problems.push(`${slug}: no internal links`);
  }

  rows.push({ slug, words, sections: headings, links: links.length, mentions, tag: data.tag });
}

// An article nothing links to is reachable only from the index, which is where readers arrive last.
for (const slug of slugs) {
  if (!linkedTo.has(slug)) {
    problems.push(`${slug}: orphan — no other article links to it`);
  }
}

/*
 * Both covers exist.
 *
 * `npm run og` draws them and is not part of the build, so an article written without running it
 * gets a card with a broken image and a share with no picture — and neither shows up until somebody
 * looks at the index or posts a link. Cheap to check, invisible otherwise.
 */
for (const slug of slugs) {
  for (const [kind, path] of [
    ['share image', `public/og/blog/${slug}.jpg`],
    ['card image', `public/og/card/${slug}.webp`],
  ]) {
    if (!existsSync(path)) {
      problems.push(`${slug}: no ${kind} — run \`npm run og\``);
    }
  }
}

console.table(rows);

if (problems.length === 0) {
  console.log(`${files.length} articles, nothing to fix.`);
  process.exit(0);
}

console.error(`\n${problems.length} problems:\n${problems.map((p) => `  ${p}`).join('\n')}`);
process.exit(1);
