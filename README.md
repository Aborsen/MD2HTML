# M2H — Markdown to HTML

Upload a Markdown file, see exactly how it renders as HTML, and download a
ready-to-use `.html` document. Conversion happens in the browser; sign in with
Google to keep your documents in the account and reach them from any device.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see Configuration)
npm run db:init              # creates the tables in Neon
npm run dev
```

The app starts on http://127.0.0.1:5180 — `/api/*` is served by the same Hono
app that runs as a Vercel function in production, so no extra process is needed.

Other scripts: `npm run build`, `npm run preview`, `npm run check-types`,
`npm run db:init`.

Without `VITE_GOOGLE_CLIENT_ID` the app still works: sign-in is hidden and the
history falls back to this browser's `localStorage`.

## Configuration

| Variable | Where it is used | Notes |
| --- | --- | --- |
| `DATABASE_URL` | server | Neon pooled connection string |
| `GOOGLE_CLIENT_ID` | server | audience for verifying Google ID tokens |
| `VITE_GOOGLE_CLIENT_ID` | browser | same value, renders the sign-in button |
| `AUTH_SECRET` | server | 32+ random chars, signs the session cookie |

**Google Cloud console** → APIs & Services → Credentials → OAuth client ID
(type *Web application*). Authorized JavaScript origins:

- `http://localhost:5180` and `http://127.0.0.1:5180` for local work
- the production origin, e.g. `https://m2h.vercel.app`

No client secret is needed: the browser gets an ID token from Google Identity
Services, the server verifies it and issues its own httpOnly session cookie.

**Neon** → create a project → copy the pooled connection string → run
`npm run db:init` (idempotent; schema lives in `db/schema.sql`).

**Vercel** → project settings → Environment Variables: add all four variables,
then redeploy. The build is auto-detected (Vite → `dist`), `/api/*` is routed to
the Hono function by `vercel.json`.

## What it does

- **Upload** — drag & drop or file picker, `.md / .markdown / .mdown / .mkd / .txt`, up to 10 MB.
- **Preview** — GitHub Flavored Markdown (tables, task lists, strikethrough,
  autolinks), sanitized with DOMPurify, styled with the design-system tokens.
- **HTML source** tab — the exact standalone document that gets downloaded.
- **Download / Copy** — self-contained `.html` with inline styles, print-ready.
- **History** — signed in: stored in Neon (up to 200 documents, 1 MB of source
  each), available on every device; signed out: the last 25 conversions in
  `localStorage`. Whatever was collected locally is moved into the account on
  first sign-in.

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
api/index.ts            Vercel entry point (wraps the Hono app)
server/                 API: routes, Neon client, session cookie, dev middleware
db/schema.sql           tables (users, documents)
scripts/init-db.mjs     applies the schema
src/
  App.tsx               app shell and state
  components/           header, user menu, dropzone, preview, stats
  features/             ConverterPage, HistoryPage
  lib/                  conversion, doc styles, auth, api client, history
  ui/                   design system (vendored)
```
