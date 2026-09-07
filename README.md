# M2H — Markdown to HTML

Small web app: upload a Markdown file, see exactly how it renders as HTML, and
download a ready-to-use `.html` document. Everything runs in the browser — no
backend, no uploads to a server.

## Run locally

```bash
npm install
npm run dev
```

The app starts on http://127.0.0.1:5180

Other scripts: `npm run build`, `npm run preview`, `npm run check-types`.

## What it does

- **Upload** — drag & drop or file picker, `.md / .markdown / .mdown / .mkd / .txt`, up to 10 MB.
- **Preview** — GitHub Flavored Markdown (tables, task lists, strikethrough,
  autolinks), sanitized with DOMPurify, styled with the design-system tokens.
- **HTML source** tab — the exact standalone document that gets downloaded.
- **Download / Copy** — self-contained `.html` with inline styles, print-ready.
- **History** — the last 25 conversions, stored in `localStorage`; reopen the
  preview or download the file again. Sources over 400 KB are not kept (the
  entry stays in the list, marked as not re-openable).

## UI

The interface is built on our internal design system: design tokens (light and
dark), DM Sans, and the React component library are vendored under `src/ui`,
extended by `tailwind.ui.config.ts` / `tailwind.config.ts` and loaded through
`src/index.css`. The app defaults to the dark theme (`<html class="dark">`);
switching to light is a matter of dropping that class.

Markdown document styling (`src/lib/md-doc-css.ts`) is written once against
`--md-*` variables and used both in the preview and in the exported file, so
the two always match. The document sheet keeps its light "paper" look in both
themes — it is meant to be shared and printed.

## Structure

```
src/
  App.tsx               app shell, state, file handling
  components/           header, dropzone, preview, stats, tooltip helper
  features/             ConverterPage, HistoryPage
  lib/                  markdown conversion, doc styles, history, formatting
  ui/                   design system (vendored)
```
