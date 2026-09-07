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

**Neon** — M2H has its **own** Neon project (`m2h`): its own database and its own Neon Auth, with
no accounts or tables shared with any other app. It was provisioned through the Vercel Marketplace,
which also connects it and writes `DATABASE_URL` / `NEON_AUTH_BASE_URL` into the project:

```bash
vercel integration add neon --name m2h
vercel env pull .env.local --environment=production
npm run env:setup          # prunes .env.local down to this app's two keys
npm run db:init            # creates m2h_document
```

**Vercel** — the variables above are set for production, preview and development by that connect
step; a deployment made before them needs a redeploy to see them. The build is auto-detected
(Vite → `dist`) and `/api/*` is routed to the Hono function by `vercel.json`.

## What it does

- **Upload** — drag & drop or file picker, `.md / .markdown / .mdown / .mkd / .txt`, up to 10 MB.
- **Chain several files** — drop more than one and they become a single document, in the order they
  arrive, separated by a rule; the same works on any selection in the history.
- **Preview** — GitHub Flavored Markdown (tables, task lists, strikethrough,
  autolinks), sanitized with DOMPurify, styled with the design-system tokens.
- **Share** — a document in your account can be opened by anyone with the link, or only by the
  addresses you list (they sign in with that address). `/s/<token>` is a read-only page: the
  document and a download, nothing else. Revoking drops the token, so a link already sent stops
  working. No email is sent — you pass the link on yourself.
- **Shared with me** — a chip in the history lists documents other people addressed to you, with
  who shared each one. They are read-only: open and download, no delete, no re-share. Only
  addressed shares appear; a link share belongs to whoever holds the link, not to a list.
- **Fullscreen reading** — the preview takes the whole screen, the sheet keeps a readable measure
  and scrolls; Escape comes back. A long document gets a back-to-top button, in both the normal and
  the fullscreen view.
- **HTML source** tab — the exact standalone document that gets downloaded.
- **Download / Copy** — self-contained `.html` with inline styles, print-ready.
- **History** — signed in: stored in Neon (up to 200 documents, 1 MB of source
  each), available on every device; signed out: the last 25 conversions in
  `localStorage`. Whatever was collected locally is moved into the account on
  first sign-in. The page has its own dropzone, a search box over file names,
  Markdown/HTML chips and sortable headers; a row opens the document, and rows can
  be selected in bulk to merge, download or delete them (the selection bar and the
  chips come from the design system).

  The chips choose which face of a document the list shows: the Markdown source it
  was made from, or the HTML it converts to — the row's name, its type badge and
  what a download hands over all follow. Only the source is stored; the HTML is
  built on the spot, which is why the size column names what it measures.
- **Sign-in** — Google, through Neon Auth.

## UI

The interface is built on our internal design system: design tokens (light and
dark), DM Sans, and the React component library are vendored under `src/ui`,
extended by `tailwind.ui.config.ts` / `tailwind.config.ts` and loaded through
`src/index.css`. The app defaults to the dark theme (`<html class="dark">`);
switching to light is a matter of dropping that class.

Markdown document styling (`src/lib/md-doc-css.ts`) is written once against
`--md-*` variables and used both in the preview and in the exported file, so the two always match,
down to the sheet's own background — the document follows whichever theme the app is in, and the
downloaded file carries that palette with it. Printing always flips to the light values, because a
dark page on paper is a wall of ink.

The theme (dark by default) lives behind the account menu, remembered per browser in
`localStorage`; signed out, a sun/moon button in the header does the same job.

## Addresses

`/` is the converter, `/history` the list (with `?filter=html|md|shared` for the chip it is
showing), `/s/<token>` a shared document. They are read straight from `location` rather than
through a router — three routes do not need one — which is what makes a reload land where you
were and the Back button work. Each needs a rewrite to `index.html` in `vercel.json`.

## Where a document lives

Postgres keeps what the app queries — name, size, stats, share token, recipients. Those rows stay
small however many documents there are. The Markdown source is never filtered on or sorted by, only
fetched whole, and it is the only part that grows, so it goes to a Vercel Blob store instead:
`sources/<user>/<document>.md`.

The store is **private**. A source is read on the server with the store's token and its URL never
reaches a browser — a shared document is served by our own route, which is where access is decided.

Connecting the store to the project hands the function an OIDC identity and a `BLOB_STORE_ID`
rather than a long-lived key, and that is the normal path; a `BLOB_READ_WRITE_TOKEN` is still
honoured where one exists. With neither, the source is written to the `markdown` column exactly as
before — so a checkout without store access still works, and rows written earlier still open.

Those older rows do not need a flag day: each moves into the store the first time it is read
somewhere the store is reachable, and the reader gets its text either way. `npm run blob:migrate`
does the same in one pass where that is preferred, and `npm run blob:reconcile` reports where store
and database disagree — an orphaned file is safe to delete, a row whose file is gone is only
reported.

The store's connection has to include the **Development** environment (Storage → the store →
Configure → Environments), or a locally pulled OIDC token is refused and `npm run dev` writes
sources to the column while production writes them to the store.

## Rendering

The parse, the renderer overrides and the allow-list live in `shared/` and run in both places: the
browser renders the preview, the function renders the page a share link opens. One document, whoever
asks for it.

Only the sanitiser differs, because only one of the two runtimes has a DOM: `src/lib/markdown.ts`
uses DOMPurify over the browser's own, `server/render.ts` uses `sanitize-html`, which parses the
HTML itself. Emulating a DOM was tried first and is a trap worth writing down — jsdom broke the Node
runtime outright (a CJS dependency requiring an ESM module), and the lighter stand-ins were worse:
DOMPurify reported success and returned its input untouched, `<script>` and all. Heading ids carry a
`doc-` prefix so both sanitisers keep them; a bare `id="title"` is DOM-clobbering, which the browser
strips and a parser does not.

`GET /s/<token>` is served by the function, not by the app:

- **link share** — built HTML with `s-maxage=60, stale-while-revalidate=600`, so repeat visitors
  are answered by the CDN and the database sees about one read a minute per document. The window is
  short on purpose: revoking a share has to take effect in about a minute.
- **addressed share** — never cached. A reader who is signed in and on the list gets the same page
  privately; anyone else is redirected to `/open/<token>`, the app's own page, which knows how to
  ask them to sign in.
- **`?download`** — the same document as an attachment.

## Structure

```
api/index.ts            Vercel entry point (wraps the Hono app)
shared/                 the converter and document styles, used by both runtimes
server/                 API: routes, Neon Auth proxy, Neon client, dev middleware
db/schema.sql           m2h_document and its sharing tables
scripts/init-db.mjs     applies the schema
scripts/auth-origin.mjs manages Neon Auth's trusted origins
src/
  App.tsx               app shell and state
  components/           header, user menu, dropzone, preview, stats
  features/             ConverterPage, HistoryPage
  lib/                  conversion, doc styles, auth, api client, history
  ui/                   design system (vendored)
```
