/*
 * Numbers, sizes and times, said the way the reader's language says them.
 *
 * None of this is translation and none of it belongs in the catalogue. "1.5 KB" hand-built from a
 * number and two letters is wrong in four of the five languages at once — German writes the decimal
 * with a comma, French calls a byte an octet, and "12 min ago" is not a sentence anybody translates
 * word for word. `Intl` already knows all of it, ships with the browser and with Node, and gets the
 * separator, the unit, the word order and the month names right without a key per language.
 *
 * So every function here takes the locale. It takes the tag `Intl` wants rather than the one in the
 * address — `en` means British English in this product, see `INTL_LOCALES` — and the caller does
 * that lookup, which is the same thing `src/lib/blog.ts` asks of its callers.
 *
 * The formatters are built once per locale and kept. Constructing one is the expensive part, and a
 * history of fifty rows asks for the same three formatters fifty times.
 */

/** A byte count is `byte` under 1 kB, `kilobyte` under 1 MB, `megabyte` above it. */
type SizeUnit = 'byte' | 'kilobyte' | 'megabyte';

const SIZES = new Map<string, Intl.NumberFormat>();

function sizeFormatter(locale: string, unit: SizeUnit): Intl.NumberFormat {
  const key = `${locale}/${unit}`;
  const held = SIZES.get(key);

  if (held) {
    return held;
  }

  /*
   * The short unit for `byte` is the singular whatever the count — "512 byte" — so bytes get the
   * long form, which is the only one that says "512 bytes" and "1 byte". Kilobytes and megabytes
   * take the short form, because "1.5 kilobytes" in a table column is not a size, it is a sentence.
   */
  const made = new Intl.NumberFormat(
    locale,
    unit === 'byte'
      ? {
          style: 'unit',
          unit,
          unitDisplay: 'long',
          maximumFractionDigits: 0,
        }
      : {
          style: 'unit',
          unit,
          unitDisplay: 'short',
          // The digits the hand-built version showed: one for kB, two for MB.
          minimumFractionDigits: unit === 'kilobyte' ? 1 : 2,
          maximumFractionDigits: unit === 'kilobyte' ? 1 : 2,
        }
  );

  SIZES.set(key, made);

  return made;
}

/**
 * A file size. The steps are 1024, as they always were; the words and the decimal mark are `Intl`'s.
 */
export function formatBytes(bytes: number, locale: string): string {
  if (bytes < 1024) {
    return sizeFormatter(locale, 'byte').format(bytes);
  }

  if (bytes < 1024 * 1024) {
    return sizeFormatter(locale, 'kilobyte').format(bytes / 1024);
  }

  return sizeFormatter(locale, 'megabyte').format(bytes / (1024 * 1024));
}

const DATE_TIMES = new Map<string, Intl.DateTimeFormat>();

function dateTimeFormatter(locale: string): Intl.DateTimeFormat {
  const held = DATE_TIMES.get(locale);

  if (held) {
    return held;
  }

  const made = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  DATE_TIMES.set(locale, made);

  return made;
}

/** When a document was converted, to the minute: "08 Sept 2026, 17:05". */
export function formatDateTime(timestamp: number, locale: string): string {
  return dateTimeFormatter(locale).format(timestamp);
}

const DATES = new Map<string, Intl.DateTimeFormat>();

function dateFormatter(locale: string): Intl.DateTimeFormat {
  const held = DATES.get(locale);

  if (held) {
    return held;
  }

  const made = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  DATES.set(locale, made);

  return made;
}

/**
 * A day, from the ISO date it is stored as: "8 September 2026", "8. September 2026".
 *
 * The stored form is the machine's — `2026-09-08` sorts, compares and goes into a sitemap's
 * `lastmod` — and this is the reader's. An unparseable value is handed back untouched rather than
 * rendered as "Invalid Date".
 */
export function formatDate(iso: string, locale: string): string {
  const parsed = new Date(`${iso}T00:00:00`);

  return Number.isNaN(parsed.getTime())
    ? iso
    : dateFormatter(locale).format(parsed);
}

const MONTHS = new Map<string, Intl.DateTimeFormat>();

function monthFormatter(locale: string): Intl.DateTimeFormat {
  const held = MONTHS.get(locale);

  if (held) {
    return held;
  }

  const made = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  });

  MONTHS.set(locale, made);

  return made;
}

/**
 * A month, from the `YYYY-MM` it is grouped by: "September 2026", "septembre 2026".
 *
 * The day is deliberately absent — this names a group of entries, not one of them — and the year
 * is deliberately present, because a month heading a reader has scrolled to has no year above it
 * any more.
 */
export function formatMonth(key: string, locale: string): string {
  const parsed = new Date(`${key}-01T00:00:00`);

  return Number.isNaN(parsed.getTime())
    ? key
    : monthFormatter(locale).format(parsed);
}

const RELATIVES = new Map<string, Intl.RelativeTimeFormat>();

function relativeFormatter(locale: string): Intl.RelativeTimeFormat {
  const held = RELATIVES.get(locale);

  if (held) {
    return held;
  }

  /*
   * `numeric: 'auto'` is what turns -1 day into "yesterday" and 0 minutes into "this minute", in
   * each language's own words, which is what the two hand-written English phrases here used to do
   * for one language.
   */
  const made = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  RELATIVES.set(locale, made);

  return made;
}

/** How long ago, in the coarsest unit that still says something: "5 minutes ago", "yesterday". */
export function formatRelative(timestamp: number, locale: string): string {
  const format = relativeFormatter(locale);
  const minutes = Math.round((Date.now() - timestamp) / 60_000);

  if (minutes < 1) {
    return format.format(0, 'minute');
  }

  if (minutes < 60) {
    return format.format(-minutes, 'minute');
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return format.format(-hours, 'hour');
  }

  return format.format(-Math.round(hours / 24), 'day');
}

export function toHtmlFileName(markdownName: string): string {
  return `${markdownName.replace(/\.(md|markdown|mdown|mkd|txt)$/i, '')}.html`;
}

/** The document's own format: what the row shows, and what a download hands over. */
/** What a stored document can be handed over as. Markdown is what it is; the rest are made. */
export type DocFormat = 'md' | 'html' | 'txt';

export const FORMAT_LABELS: Record<DocFormat, string> = {
  html: 'HTML',
  md: 'Markdown',
  txt: 'Plain text',
};

export function toMarkdownFileName(name: string): string {
  return /\.(md|markdown|mdown|mkd|txt)$/i.test(name) ? name : `${name}.md`;
}

export function toTextFileName(name: string): string {
  return `${name.replace(/\.[^.]+$/, '')}.txt`;
}

export function toFileName(name: string, format: DocFormat): string {
  if (format === 'html') {
    return toHtmlFileName(name);
  }

  return format === 'txt' ? toTextFileName(name) : toMarkdownFileName(name);
}
