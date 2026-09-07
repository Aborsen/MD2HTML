/**
 * Markdown document styles.
 *
 * The rules are written once against `--md-*` custom properties and used both
 * in the in-app preview and in the exported standalone .html file, so what the
 * preview shows is byte-for-byte what gets downloaded. The document keeps its
 * light "paper" look regardless of the app theme — it is meant to be shared
 * and printed.
 */

/** Palette of the document sheet (design-system light values). */
export const MD_DOC_THEME = `
.md-doc {
  --md-ink: #0f172a;
  --md-body: #334155;
  --md-secondary: #5a6a80;
  --md-brand: #07807e;
  --md-brand-2: #066867;
  --md-brand-3: #0d8e97;
  --md-card: #ffffff;
  --md-page: #f8fafc;
  --md-card-2: #f1f5f9;
  --md-stroke: #e2e8f0;
  --md-table-header: #eaeff5;
}
`;

/** Typography + block rules — identical in preview and export. */
export const MD_DOC_STYLE = `
.md-doc {
  color: var(--md-body);
  font-family: "DM Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 0.9375rem;
  line-height: 1.7;
  word-break: break-word;
}

.md-doc > *:first-child { margin-top: 0; }
.md-doc > *:last-child { margin-bottom: 0; }

.md-doc h1,
.md-doc h2,
.md-doc h3,
.md-doc h4,
.md-doc h5,
.md-doc h6 {
  margin: 1.75em 0 0.6em;
  color: var(--md-ink);
  font-weight: 600;
  line-height: 1.3;
  scroll-margin-top: 5rem;
}

.md-doc h1 { margin-top: 0; font-size: 1.875rem; letter-spacing: -0.01em; }
.md-doc h2 {
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--md-stroke);
  font-size: 1.5rem;
  letter-spacing: -0.01em;
}
.md-doc h3 { font-size: 1.25rem; }
.md-doc h4 { font-size: 1.0625rem; }
.md-doc h5 { font-size: 0.9375rem; }
.md-doc h6 { color: var(--md-secondary); font-size: 0.875rem; }

.md-doc p { margin: 0.85em 0; }

.md-doc strong { color: var(--md-ink); font-weight: 600; }
.md-doc em { font-style: italic; }
.md-doc del { color: var(--md-secondary); text-decoration: line-through; }

.md-doc a {
  color: var(--md-brand-3);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.md-doc a:hover { color: var(--md-brand-2); }

.md-doc ul,
.md-doc ol { margin: 0.85em 0; padding-left: 1.5rem; }
.md-doc ul { list-style: disc; }
.md-doc ol { list-style: decimal; }
.md-doc li { margin: 0.25em 0; }
.md-doc li > ul,
.md-doc li > ol { margin: 0.25em 0; }
.md-doc li::marker { color: var(--md-secondary); }
.md-doc li:has(> input[type="checkbox"]),
.md-doc li:has(> p:first-child > input[type="checkbox"]:first-child),
.md-doc li.task-list-item { list-style: none; margin-left: -1.25rem; }
.md-doc input[type="checkbox"] { margin-right: 0.5rem; accent-color: var(--md-brand); }

.md-doc blockquote {
  margin: 1em 0;
  padding: 0.15em 0 0.15em 1rem;
  border-left: 3px solid var(--md-brand-2);
  color: var(--md-secondary);
}
.md-doc blockquote > *:first-child { margin-top: 0; }
.md-doc blockquote > *:last-child { margin-bottom: 0; }

.md-doc code {
  padding: 0.15em 0.4em;
  border-radius: 0.25rem;
  background: var(--md-card-2);
  color: var(--md-body);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.85em;
}

.md-doc pre {
  margin: 1.15em 0;
  padding: 0.9rem 1rem;
  overflow-x: auto;
  border: 1px solid var(--md-stroke);
  border-radius: 0.75rem;
  background: var(--md-page);
  line-height: 1.55;
}
.md-doc pre code {
  padding: 0;
  border-radius: 0;
  background: transparent;
  font-size: 0.8125rem;
}

.md-doc hr {
  margin: 2em 0;
  border: 0;
  border-top: 1px solid var(--md-stroke);
}

.md-doc table {
  display: block;
  width: max-content;
  max-width: 100%;
  margin: 1.15em 0;
  overflow-x: auto;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.md-doc th,
.md-doc td {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--md-stroke);
  text-align: left;
  vertical-align: top;
}
.md-doc th {
  background: var(--md-table-header);
  color: var(--md-ink);
  font-weight: 600;
  white-space: nowrap;
}
.md-doc tbody tr:nth-child(even) td { background: var(--md-page); }

.md-doc img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.md-doc kbd {
  padding: 0.1em 0.4em;
  border: 1px solid var(--md-stroke);
  border-bottom-width: 2px;
  border-radius: 0.25rem;
  background: var(--md-card);
  font-family: inherit;
  font-size: 0.8em;
}
`;

/** Page chrome for the exported standalone document. */
export const MD_DOC_PAGE_STYLE = `
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  padding: 3rem 1.25rem 4rem;
  background: #f8fafc;
  -webkit-font-smoothing: antialiased;
}

.md-page {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2.5rem 3rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.md-footer {
  max-width: 48rem;
  margin: 1rem auto 0;
  color: #7c8ca2;
  font-family: "DM Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 0.75rem;
  text-align: right;
}

@media (max-width: 640px) {
  body { padding: 1rem 0.75rem 2rem; }
  .md-page { padding: 1.5rem 1.25rem 2rem; }
}

@media print {
  body { padding: 0; background: #ffffff; }
  .md-page { max-width: none; border: 0; border-radius: 0; box-shadow: none; }
  .md-footer { display: none; }
}
`;
