# Changelog

Newest first. Versions are the tags in the repository; the notes under each are the commits that
changed something a reader would notice, not the whole log.

## Unreleased

Forty commits since 2.0.0, and no tag yet.

### The blog in German

The blog can now be translated one article at a time, which needed the machinery before it needed
the prose. A translation lives beside the English file under the same name — the slug never changes,
because a link is written `](/blog/markdown-escaping)` in the prose and inherited by every
translation, so the URL prefix carries the language instead.

The rule throughout is that a locale has what it has. Its index lists only its own articles, the
front page shows its own six or the strip is absent, and an article names in `hreflang` only the
languages that actually have text. A language with nothing translated gets no `/de/blog` at all
rather than a heading over an empty list. Covers are drawn per language, because the headline is
part of the picture.

Twenty-nine of the fifty-six articles are in German. `content/translation-notes.md` keeps the terms
the set has settled on, with the reasons where a term is a reservation rather than a preference.

### A page for an address that is not a page

There was none: an unmatched address got the host's own error page, with nothing to click. There is
now a 404 with the site's chrome, three ways out and `noindex`, written once and re-rendered in the
reader's language.

Two soft 404s came out with it. `/blog/<no-such-slug>` answered 200 and the app's own "no such
article" screen, which a crawler indexes as a real page; it is a 404 now, and the contextual screen
still shows. And `/de/history` was a plain 404 in four languages — English had a rewrite and the
others did not, so the screen worked until somebody reloaded it.

### Email that arrives

A welcome message, sent once when an account is first used, and a notice to somebody a document has
been shared with. Both took three attempts, and each failure was a different lesson: the notice was
wired to an endpoint the app never calls, then fired with `void` after the response so the request
never left the function, then blocked by a key that was genuinely absent from the first builds.

Deliverability needed DMARC, not just SPF and DKIM. The welcome now records the send rather than the
attempt, so a failure leaves the account still owed a greeting.

### Five languages

The interface, the documentation and the pages of words are in English, German, French, Spanish and
Italian, with the words in one typed catalogue and a build step that walks every locale against
English: same keys, same array lengths, nothing empty, the same placeholders. It caught 192 missing
keys on its first run.

The language is in the address — `/de/docs`, `/fr/csv-to-markdown` — and English keeps the bare
paths, because sixty-eight pages were already indexed at them. A first-time visitor is sent to the
language their browser asks for; a Slavic tag goes to English, since there is no Russian, Ukrainian
or Polish translation to send anybody to.

### Signing in with an email address

Google was the only way in. There is now a dialogue with sign-in, sign-up, a password reset and a
one-time code, and an unconfirmed account is held back: no publishing by link, and ten documents
rather than five hundred, until the address is confirmed.

One thing was built and reverted. Refusing an address whose domain has no MX record sounded prudent
and was wrong twice over: `dns.resolveMx` never returns in the serverless sandbox, so sign-up hung,
and a domain with no MX can still receive mail through an A record. The check is gone.

### An embed, and the frame policy the app never had

`/embed` is the converter with no chrome, for a page that wants to host it, and it talks to its
host with `postMessage`. Adding it meant writing the rule that was missing: every other route now
refuses to be framed at all, which nothing had said before.

### The connector has its own dialogue

Adding TransformPipe to an assistant used to open the API keys dialogue, which is a page headed
"API keys" with a key generator at the top — a person who chose "MCP connector" had to work out
they were in the right place. It is its own dialogue now, with the address, the one-line command and
the list of connected assistants.

### Smaller things

- A guard that catches the two failures that only happen on the platform: an extensionless import
  that a bundler hides and Node refuses, and a `vercel.json` pattern that produces no deployment at
  all. Both had taken production down.
- The header's gaps are even in every language, by not setting a width on anything.
- Share buttons for X, LinkedIn and Reddit on an article.
- The privacy page says what email the service sends, which it had never mentioned.
- A table row in the escaping reference was broken by an unescaped pipe — in the row documenting
  how to escape a pipe.

## 2.0.0 — 9 September 2026

The rename, and the four conversions.

- **TransformPipe**, at transformpipe.com. The old domain redirects.
- **Four formats in, Markdown out**: HTML, Word, CSV and TSV, and JSON. Each conversion has its own
  address, because "word to markdown" is a thing people type into a search box.
- **JSON to Markdown** picks a rendering per shape rather than one rule for everything: an array of
  flat objects becomes a table, an array of scalars a list, an object a heading per nested key, and
  anything past three levels a fenced block, because a heading at depth seven is not a heading.
- **An assistant can act on an account**, with the app as its own OAuth server and a connector that
  needs no API key pasted anywhere.
- **Fifty-six articles**, up from twenty, each with a cover drawn at build time — and the covers are
  now a gate, so an article cannot ship without one.
- The document limit is 10 MB, from a single number rather than four that disagreed.
- One table writer serves every source of rows, so CSV, TSV and JSON produce the same table.
- The contents of a long article sit down the left, and the content column is bounded at last.
- The blog stopped being shipped to everybody who opened the converter: each article's prose is its
  own chunk, fetched when somebody opens it. It had been 952 kB of Markdown in the main bundle.
- A real footer, five pages of words, and a mobile layout that is not a squeeze.

## 1.1.0 — 8 September 2026

- A blog: twenty articles at `/blog`, written against the keyword clusters in
  `content/keywords.md` and rendered by the converter they describe.
- An FAQ under the converter's dropzone and again in the documentation, from one list.
- Real HTML for every page a stranger arrives on: a file per route with its own title, description,
  canonical link and structured data, plus `sitemap.xml` and `robots.txt`.
- The downloaded `.html` is now genuinely self-contained — it used to link DM Sans from Google
  Fonts.
- ArticleCard, SectionHeading, Faq, CodeBlock and DefinitionTable added to the design system.
- The header fits a phone; every route used to scroll sideways below 768px.

## 1.0.0 — 8 September 2026

Markdown in, a self-contained HTML document out — from the app, from a terminal, or from a pull
request.

- Converter with preview, HTML source and a self-contained download.
- Accounts, history across devices, search, chips, bulk merge and delete.
- Sharing by link or by address, with a read-only page and a report form.
- A public API with revocable keys, quotas of 100 MB and 500 documents, and rate limiting.
- A dependency-free CLI and a GitHub Action that comments rendered links on a pull request.
- Documentation at `/docs`, with screenshots captured from the running app.
