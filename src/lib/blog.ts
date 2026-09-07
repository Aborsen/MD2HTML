/*
 * The blog, read straight out of `content/blog/*.md` at build time.
 *
 * Articles about converting Markdown are written in Markdown and rendered by the converter this app
 * ships — there is no second pipeline to keep in step, and a bug in the renderer shows up on our own
 * pages before it shows up on anyone else's document.
 */

export interface Article {
  slug: string;
  title: string;
  description: string;
  /** ISO date, as written in the file. */
  date: string;
  tag: string;
  /** What the piece is aimed at, from content/keywords.md. Not rendered; kept for the writer. */
  keywords: string[];
  markdown: string;
  readingMinutes: number;
}

const FILES = import.meta.glob('../../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * Splits `---` frontmatter off the top of a file.
 *
 * A hand-rolled parser rather than a YAML dependency: the header is a flat list of `key: value`,
 * and a library that can express anchors and nested maps invites a header that needs one.
 */
function parse(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    return { data: {}, body: raw };
  }

  const data: Record<string, string> = {};

  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':');

    if (at > 0) {
      data[line.slice(0, at).trim()] = line
        .slice(at + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  }

  return { data, body: raw.slice(match[0].length) };
}

/** 220 words a minute, rounded up — a number to set expectations, not to be right. */
function readingMinutes(markdown: string): number {
  return Math.max(1, Math.round(markdown.trim().split(/\s+/).length / 220));
}

export const ARTICLES: Article[] = Object.entries(FILES)
  .map(([path, raw]) => {
    const { data, body } = parse(raw);

    return {
      slug: path.split('/').pop()?.replace(/\.md$/, '') ?? path,
      title: data.title ?? 'Untitled',
      description: data.description ?? '',
      date: data.date ?? '',
      tag: data.tag ?? 'Markdown',
      keywords: data.keywords ? data.keywords.split(',').map((k) => k.trim()) : [],
      markdown: body,
      readingMinutes: readingMinutes(body),
    };
  })
  // Newest first; the file name decides ties, so the order never depends on the filesystem.
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** The tags actually in use, in the order the articles introduce them. */
export function articleTags(): string[] {
  return [...new Set(ARTICLES.map((article) => article.tag))];
}

export function articlePath(slug: string): string {
  return `/blog/${slug}`;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "8 September 2026" — dates on an article are read, not sorted. */
export function formatArticleDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return `${parsed.getDate()} ${MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`;
}
