# M2H — Markdown to HTML

Upload a Markdown file, see exactly how it renders as HTML, and download a
ready-to-use `.html` document. Conversion happens in the browser; sign in with
Google to keep your documents in the account and reach them from any device.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values (see Configuration)
npm run db:init              # creates the table in Neon
npm run dev
```

The app starts on http://127.0.0.1:5180 — `/api/*` is served by the same Hono
app that runs as a Vercel function in production, so no extra process is needed.

Other scripts: `npm run build`, `npm run preview`, `npm run check-types`,
`npm run db:init`.

Without `NEON_AUTH_BASE_URL` the app still converts files: sign-in answers 503 and the history
falls back to this browser's `localStorage`.

## Configuration

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string |
| `NEON_AUTH_BASE_URL` | the project's Neon Auth endpoint |

Both are server-side only; the browser talks to `/api/*` and never to Neon directly.

**Sign-in** is Neon Auth (Better Auth behind a Neon endpoint), which already carries Google — no
separate Google OAuth client and no client secret here. `/api/auth/*` forwards to the auth service
and rewrites `Set-Cookie` so the session cookie is first-party for this site; `/api/auth/finish`
exchanges the one-time verifier for that cookie. See `server/auth.ts`.

Neon Auth only starts a sign-in for an origin it trusts, so each origin has to be added once:

```bash
npm run auth:origin                                # list what is trusted
npm run auth:origin -- https://md-2-html.vercel.app
npm run auth:origin -- http://127.0.0.1:5180       # for local work
```

**Neon** → copy the pooled connection string → `npm run db:init` (idempotent; the schema lives in
`db/schema.sql` and creates one table, `m2h_document`; users come from `neon_auth."user"`).

**Vercel** → project settings → Environment Variables: add both variables, then redeploy. The build
is auto-detected (Vite → `dist`) and `/api/*` is routed to the Hono function by `vercel.json`.

If the values already live in another Vercel project that uses the same Neon database, they can be
moved across without being pasted anywhere:

```bash
vercel link --project <the-other-project> --yes
vercel env pull .env.local --environment=production
vercel link --project md-2-html --yes
npm run env:setup -- --vercel      # keeps only this app's keys, pushes them, prints no values
```

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
- **Sign-in** — Google, through Neon Auth.

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
server/                 API: routes, Neon Auth proxy, Neon client, dev middleware
db/schema.sql           the m2h_document table
scripts/init-db.mjs     applies the schema
scripts/auth-origin.mjs manages Neon Auth's trusted origins
src/
  App.tsx               app shell and state
  components/           header, user menu, dropzone, preview, stats
  features/             ConverterPage, HistoryPage
  lib/                  conversion, doc styles, auth, api client, history
  ui/                   design system (vendored)
```
