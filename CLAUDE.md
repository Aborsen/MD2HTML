# Working rules

## Every release goes in the changelog

`src/lib/changelog.ts` is the list, and it is the only one — the page at `/changelog`, the
prerendered HTML in five languages and the `lastmod` in the sitemap all come off it. There is no
`CHANGELOG.md` and no release-notes file to keep in step.

**A tagged release is not shipped until its entry is in that list.** Same commit as the version
bump, or the one that tags it — not "later", because later is when the release is out and the page
says nothing shipped.

Between releases, add an entry for anything a person using TransformPipe would notice: a new
conversion, a page, a way to sign in, a limit that moved, a bug that was visibly wrong. Those
entries carry no `version`; most of what has shipped went out between tags.

An entry is:

```ts
{
  date: '2026-09-10',        // ISO. The page sorts and groups on it, so it has to be real.
  version: '2.0.0',          // Only when it shipped in a tagged release. Omit otherwise.
  title: 'Markdown in, a document out',
  body: 'Markdown. A few sentences — a card that needs scrolling is an article.',
}
```

Order in the file does not matter; the page sorts by date, newest first. Grouping into months and
years is `changelogByYear()`, used by both the app and the prerenderer.

### What does not go in

Refactors, dependency bumps, build and infrastructure work, anything invisible from outside. The
panel on the page says as much to the reader (`changelog.scope`), so an entry about a moved file
would make that note untrue.

### Language

Entries are written in English and stay in English, like the blog (`src/lib/i18n/content.ts` draws
the same line). Only the chrome around them is translated — heading, lede, the year panel, and the
dates and month names, which `Intl` renders in the reader's language. Five translations per entry
is a cost that gets skipped after the second release, and a changelog with three languages missing
is worse than one that is honestly English.

### After the entry

- `npm run check-types && npm run build` — the prerenderer reads the same list, and a broken
  entry breaks 147 pages, not one.
- A tagged release also wants the tag pushed and a GitHub release created with the same words.
