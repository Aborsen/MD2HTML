import { markdownTable } from './from-table.js';

/*
 * JSON, as Markdown a person can read.
 *
 * No dependency: the parser is the runtime's, and the rest is deciding what each shape should
 * become. That decision is the whole job, because JSON has no notion of a heading or a paragraph —
 * it has objects, arrays and scalars, and every one of them could sensibly be several things.
 *
 * The rules, in the order they are tried:
 *
 *   - an array of flat objects becomes a table, keys as columns. This is what most exports and API
 *     responses are, and it is the shape where Markdown gains the most over the raw file;
 *   - an array of scalars becomes a bullet list;
 *   - an object becomes a heading per nested key, with its scalar keys as bold labels above them,
 *     so the shallow facts are readable before the deep ones start;
 *   - anything past a few levels down becomes a fenced json block, because a heading at depth
 *     seven is not a heading, and losing the data would be worse than showing it as it was.
 *
 * Nothing is ever dropped. A shape with no better rendering falls back to the JSON it came from.
 */

/** Past this, headings stop being structure and start being noise. */
const MAX_DEPTH = 3;

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/**
 * Parses the file, tolerantly.
 *
 * A `.json` file is usually one JSON value, but the thing people export from a log or a database
 * is often JSON Lines — one value per line, which `JSON.parse` refuses as a whole. Trying that
 * second costs nothing and saves the person from a parse error on a file that is perfectly good.
 */
export function parseJson(text: string): Json {
  const clean = text.replace(/^﻿/, '').trim();

  if (!clean) {
    throw new Error('That file is empty.');
  }

  try {
    return JSON.parse(clean) as Json;
  } catch (cause) {
    const lines = clean.split(/\r?\n/).filter((line) => line.trim() !== '');

    if (lines.length > 1) {
      try {
        return lines.map((line) => JSON.parse(line) as Json);
      } catch {
        // Not JSON Lines either; the original error is the more useful one to report.
      }
    }

    throw new Error(
      cause instanceof Error
        ? `That is not valid JSON — ${cause.message}`
        : 'That is not valid JSON.'
    );
  }
}

const isObject = (value: Json): value is { [key: string]: Json } =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isScalar = (value: Json): value is null | boolean | number | string =>
  value === null || typeof value !== 'object';

/** What a scalar looks like in running text. `null` is written, not skipped: absent is a fact. */
function scalar(value: null | boolean | number | string): string {
  if (value === null) {
    return '_null_';
  }

  return typeof value === 'string' ? value : String(value);
}

const fence = (value: Json) =>
  `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\`\n`;

/** A key as a heading: `created_at` and `createdAt` both read better as words. */
function title(key: string): string {
  const words = key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .trim();

  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** True when every row is an object of scalars — the one shape a table is honest about. */
function isTable(value: Json): value is Array<{ [key: string]: Json }> {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((row) => isObject(row) && Object.values(row).every(isScalar))
  );
}

function tableOf(rows: Array<{ [key: string]: Json }>): string {
  /*
   * Columns in the order they are first seen, across every row rather than just the first: an
   * export whose later records carry a field the first one lacked would otherwise lose it.
   */
  const columns: string[] = [];

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    }
  }

  return markdownTable(
    columns.map(title),
    rows.map((row) =>
      columns.map((key) => (key in row ? scalar(row[key] as never) : ''))
    )
  );
}

function render(value: Json, depth: number): string {
  if (isScalar(value)) {
    return `${scalar(value)}\n`;
  }

  if (isTable(value)) {
    return tableOf(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '_Empty list._\n';
    }

    if (value.every(isScalar)) {
      return `${value.map((one) => `- ${scalar(one as never)}`).join('\n')}\n`;
    }

    if (depth >= MAX_DEPTH) {
      return fence(value);
    }

    // A list of unlike things: each one gets its own numbered section.
    return value
      .map(
        (one, index) =>
          `${'#'.repeat(Math.min(depth + 2, 6))} ${index + 1}\n\n${render(one, depth + 1)}`
      )
      .join('\n');
  }

  const keys = Object.keys(value);

  if (keys.length === 0) {
    return '_Empty object._\n';
  }

  if (depth >= MAX_DEPTH) {
    return fence(value);
  }

  const flat = keys.filter((key) => isScalar(value[key]));
  const deep = keys.filter((key) => !isScalar(value[key]));
  const parts: string[] = [];

  if (flat.length > 0) {
    parts.push(
      `${flat
        .map((key) => `**${title(key)}:** ${scalar(value[key] as never)}`)
        .join('\n\n')}\n`
    );
  }

  for (const key of deep) {
    parts.push(
      `${'#'.repeat(Math.min(depth + 2, 6))} ${title(key)}\n\n${render(value[key], depth + 1)}`
    );
  }

  return parts.join('\n');
}

export interface JsonOptions {
  /** Becomes the document's own heading, so a table has something above it. */
  title?: string;
}

export function jsonToMarkdown(text: string, options: JsonOptions = {}): string {
  const value = parseJson(text);
  const body = render(value, 0);
  const heading = options.title ? `# ${options.title}\n\n` : '';

  return `${heading}${body}`.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
