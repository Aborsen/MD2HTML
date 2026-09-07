import DOMPurify from 'dompurify';
import { Marked } from 'marked';
import {
  mdDocPrintOverride,
  mdDocTheme,
  MD_DOC_PAGE_STYLE,
  MD_DOC_STYLE,
} from './md-doc-css';

const marked = new Marked({
  gfm: true,
  breaks: false,
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** GitHub-ish slug so headings stay linkable in the exported file. */
function slugify(text: string, used: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-') || 'section';

  const seen = used.get(base) ?? 0;
  used.set(base, seen + 1);

  return seen === 0 ? base : `${base}-${seen}`;
}

/** Markdown -> sanitized HTML fragment (no <html> wrapper). */
export function markdownToHtml(markdown: string): string {
  const used = new Map<string, number>();

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text.replace(/<[^>]*>/g, ''), used);

        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
        const targetAttr = /^https?:\/\//i.test(href)
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';

        return `<a href="${escapeHtml(href)}"${titleAttr}${targetAttr}>${text}</a>`;
      },
    },
  });

  const raw = marked.parse(markdown, { async: false }) as string;

  return DOMPurify.sanitize(raw, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'id', 'align'],
  });
}

interface StandaloneOptions {
  title: string;
  body: string;
  createdAt?: number;
  /** Matches whatever the preview is showing, so the file looks like what was seen. */
  theme?: 'dark' | 'light';
}

/**
 * Wraps the converted fragment into a self-contained .html file: styles are
 * inlined, no build step needed, prints cleanly.
 */
export function buildStandaloneHtml({
  title,
  body,
  createdAt = Date.now(),
  theme = 'dark',
}: StandaloneOptions): string {
  const stamp = new Date(createdAt).toLocaleString();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="${theme}">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
<style>
${mdDocTheme(theme, ':root, .md-doc')}
${mdDocPrintOverride(':root, .md-doc')}
${MD_DOC_PAGE_STYLE}
${MD_DOC_STYLE}
</style>
</head>
<body>
<article class="md-page md-doc">
${body}
</article>
<p class="md-footer">${escapeHtml(title)} · converted ${escapeHtml(stamp)}</p>
</body>
</html>
`;
}

/** Rough document stats shown next to the preview. */
export function getDocStats(markdown: string, html: string) {
  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const headings = (html.match(/<h[1-6][\s>]/g) ?? []).length;
  const links = (html.match(/<a\s/g) ?? []).length;
  const codeBlocks = (html.match(/<pre[\s>]/g) ?? []).length;
  const tables = (html.match(/<table[\s>]/g) ?? []).length;
  const images = (html.match(/<img[\s>]/g) ?? []).length;

  return { words, headings, links, codeBlocks, tables, images };
}
