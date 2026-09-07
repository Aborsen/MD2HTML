/*
 * Shared by the browser and the serverless function: the same parse, the same renderer overrides
 * and the same sanitiser settings run in both, or a document would look one way in the app and
 * another way to whoever it was sent to.
 *
 * Only the DOM differs. DOMPurify needs one, and the two runtimes get it from different places —
 * so each passes its own `sanitize` in, built from the shared config below.
 */
import { Marked } from 'marked';
import {
  mdDocPrintOverride,
  mdDocResponsiveTheme,
  mdDocTheme,
  MD_DOC_PAGE_STYLE,
  MD_DOC_STYLE,
} from './md-doc-css.js';

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

/**
 * A slug for each heading, so a document stays linkable — prefixed on purpose.
 *
 * A bare `id="title"` is a DOM-clobbering risk (it shadows `document.title`), and the browser's
 * sanitiser drops exactly those while a server-side parser keeps them. The prefix removes the
 * hazard, which is also what keeps both renderers producing the same document.
 */
function slugify(text: string, used: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-') || 'section';

  const seen = used.get(base) ?? 0;
  used.set(base, seen + 1);

  return `doc-${seen === 0 ? base : `${base}-${seen}`}`;
}

/**
 * What survives sanitising: exactly what this converter can produce, and nothing else.
 *
 * The list lives here because the two runtimes sanitise with different tools — DOMPurify against
 * the browser's own DOM, a parser in the function — and the one thing that must not drift between
 * them is what a document is allowed to contain. A DOM-based sanitiser was tried on the server
 * first: without a real DOM, DOMPurify quietly returns its input unchanged, script tag and all.
 */
export const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'div', 'span',
  'strong', 'b', 'em', 'i', 'del', 's', 'mark', 'sub', 'sup', 'small',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code', 'kbd', 'samp',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'a', 'img', 'input',
];

export const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'id', 'class', 'align',
  'target', 'rel', 'type', 'checked', 'disabled', 'colspan', 'rowspan',
];

export type Sanitize = (html: string) => string;

/** Markdown -> sanitized HTML fragment (no <html> wrapper). */
export function renderMarkdown(markdown: string, sanitize: Sanitize): string {
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

  return sanitize(marked.parse(markdown, { async: false }) as string);
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

/** The bar above a shared document: whose product this is, and how to keep the file. */
const SHARED_CHROME_STYLE = `
.md-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 48rem;
  margin: 0 auto 1.25rem;
  font-family: "DM Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 0.8125rem;
  color: var(--md-secondary);
}

.md-bar .brand {
  font-weight: 600;
  color: var(--md-ink);
  text-decoration: none;
  letter-spacing: -0.01em;
}

.md-bar .brand span { color: var(--md-brand-3); }

.md-bar .name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.md-bar .keep {
  margin-left: auto;
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--md-stroke);
  border-radius: 999px;
  color: var(--md-ink);
  text-decoration: none;
  white-space: nowrap;
}

.md-bar .keep:hover { border-color: var(--md-brand-3); color: var(--md-brand-3); }

@media print { .md-bar { display: none; } }
`;

interface SharedPageOptions {
  title: string;
  body: string;
  createdAt?: number;
  /** Where the Download link points; omitted for a page nobody should save from. */
  downloadHref?: string;
  /** Public pages have no reader we know of, so both palettes ship and the browser picks. */
  origin?: string;
}

/**
 * The page a share link opens.
 *
 * Rendered here rather than in the browser: a link is opened by people who have no reason to wait
 * for an app to boot, and a page built on the server can be handed to the CDN, which is what keeps
 * a popular document off the database entirely.
 */
export function buildSharedPage({
  title,
  body,
  createdAt = Date.now(),
  downloadHref,
}: SharedPageOptions): string {
  const stamp = new Date(createdAt).toISOString().slice(0, 10);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
<style>
${mdDocResponsiveTheme(':root, .md-doc')}
${mdDocPrintOverride(':root, .md-doc')}
${MD_DOC_PAGE_STYLE}
${MD_DOC_STYLE}
${SHARED_CHROME_STYLE}
</style>
</head>
<body>
<div class="md-bar">
  <a class="brand" href="/">M<span>2</span>H</a>
  <span class="name">${escapeHtml(title)}</span>
  ${downloadHref ? `<a class="keep" href="${escapeHtml(downloadHref)}">Download .html</a>` : ''}
</div>
<article class="md-page md-doc">
${body}
</article>
<p class="md-footer">Shared document · converted ${escapeHtml(stamp)}</p>
</body>
</html>
`;
}

/** A dead end that still looks like the product rather than a platform error. */
export function buildNoticePage(title: string, message: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600&display=swap" rel="stylesheet">
<style>
${mdDocResponsiveTheme(':root')}
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 0.5rem;
  padding: 2rem;
  text-align: center;
  background: var(--md-page);
  color: var(--md-secondary);
  font-family: "DM Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}
h1 { margin: 0; font-size: 1.25rem; color: var(--md-ink); }
p { margin: 0; max-width: 34ch; }
a { color: var(--md-brand-3); }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<p>${escapeHtml(message)}</p>
<p><a href="/">Convert your own file</a></p>
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
