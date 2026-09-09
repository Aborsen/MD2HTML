import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { LOCALES } from './src/lib/i18n/locales';

/*
 * The blog's index, without the blog's text.
 *
 * `src/lib/blog.ts` used to read every article with `import.meta.glob(..., { eager: true })`, which
 * put all of them — frontmatter, prose, tables and code samples — inside the main bundle. With
 * thirty-six long articles that was 952 kB of Markdown shipped to every visitor of the front page,
 * most of whom never open the blog, and it grew with every article written.
 *
 * So the two halves are separated. This plugin reads the files at build time and exposes only what
 * a list needs — title, description, date, tag, keywords, reading time — through a virtual module.
 * The bodies stay behind a lazy `import.meta.glob`, so each becomes a chunk fetched when somebody
 * actually opens that article.
 *
 * The frontmatter parser here has to agree with the one in `src/lib/blog.ts`, and it is the same
 * eight lines: a flat list of `key: value`, no YAML.
 */

const VIRTUAL = 'virtual:blog-index';
const RESOLVED = `\0${VIRTUAL}`;

interface Entry {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Only present when the file carries it — see `Article` in `src/lib/blog.ts`. */
  updated?: string;
  tag: string;
  keywords: string[];
  readingMinutes: number;
}

function frontmatter(raw: string): {
  data: Record<string, string>;
  body: string;
} {
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

function read(dir: string): Entry[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const { data, body } = frontmatter(readFileSync(join(dir, name), 'utf8'));

      return {
        slug: name.replace(/\.md$/, ''),
        title: data.title ?? 'Untitled',
        description: data.description ?? '',
        date: data.date ?? '',
        /* Omitted rather than empty, so `updated ?? date` works everywhere downstream. */
        ...(data.updated ? { updated: data.updated } : {}),
        tag: data.tag ?? 'Markdown',
        keywords: data.keywords
          ? data.keywords.split(',').map((one) => one.trim())
          : [],
        /* 220 words a minute, rounded — a number to set expectations, not to be right. */
        readingMinutes: Math.max(
          1,
          Math.round(body.trim().split(/\s+/).length / 220)
        ),
      };
    })
    // Newest first; the file name decides ties, so the order never depends on the filesystem.
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/*
 * One list per language, and each holds only what that language actually has.
 *
 * English sits in content/blog and a translation in content/blog/<locale>, under the same file
 * name — the slug is the English one in every language. Translating slugs would read better in a
 * German URL and would break every internal link between articles, because a link is written
 * `](/blog/markdown-escaping)` in the prose and the target's name would then depend on which
 * language the reader happens to be in. The prefix is what carries the language.
 *
 * A language with no directory yet gets an empty list rather than English, which is what makes an
 * unfinished translation honest: /de/blog shows the German articles that exist, the index does not
 * advertise pages that are not there, and no page claims a German alternate it does not have.
 */
function readAll(root: string): Record<string, Entry[]> {
  const byLocale: Record<string, Entry[]> = {};

  for (const locale of LOCALES) {
    const dir = locale === 'en' ? root : join(root, locale);

    byLocale[locale] = existsSync(dir) ? read(dir) : [];
  }

  return byLocale;
}

export function blogIndex(): Plugin {
  const dir = resolve('content/blog');

  return {
    name: 'blog-index',

    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : null;
    },

    load(id) {
      if (id !== RESOLVED) {
        return null;
      }

      return `export const INDEX = ${JSON.stringify(readAll(dir))};`;
    },

    /* Writing an article should refresh the list without restarting the server. */
    configureServer(server) {
      server.watcher.add(dir);

      const invalidate = (path: string) => {
        if (!path.endsWith('.md') || !path.includes('content')) {
          return;
        }

        const module = server.moduleGraph.getModuleById(RESOLVED);

        if (module) {
          server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: 'full-reload' });
        }
      };

      server.watcher.on('add', invalidate);
      server.watcher.on('change', invalidate);
      server.watcher.on('unlink', invalidate);
    },
  };
}
