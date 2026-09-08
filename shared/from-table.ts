/*
 * A delimited file, as a Markdown table.
 *
 * Written here rather than taken from a library because the whole job is one loop, and because the
 * part that actually goes wrong — a comma inside a quoted field, a line break inside a cell, a
 * doubled quote meaning a literal one — is the part a hand-rolled split gets wrong and a hundred
 * lines of somebody else's parser gets right. So the loop is the parser, and it is the RFC 4180
 * rules and nothing else.
 */

export interface TableOptions {
  /** Comma, tab, semicolon — sniffed from the first line when not given. */
  delimiter?: string;
  /** What to call the columns when the file has no header of its own. */
  header?: boolean;
}

/** The delimiter that appears most on the first line, outside quotes. */
function sniff(text: string): string {
  const line = text.slice(0, text.indexOf('\n') === -1 ? undefined : text.indexOf('\n'));
  const counts = [',', '\t', ';', '|'].map((candidate) => {
    let inQuotes = false;
    let seen = 0;

    for (let i = 0; i < line.length; i += 1) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (!inQuotes && line[i] === candidate) {
        seen += 1;
      }
    }

    return { candidate, seen };
  });

  return counts.sort((a, b) => b.seen - a.seen)[0].seen > 0
    ? counts.sort((a, b) => b.seen - a.seen)[0].candidate
    : ',';
}

/** RFC 4180: quotes wrap a field, a doubled quote inside one is a quote. */
export function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const clean = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];

    if (inQuotes) {
      if (char === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }

      continue;
    }

    if (char === '"' && field === '') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // A trailing newline is not an empty row.
  return rows.filter(
    (one) => one.length > 1 || (one[0] ?? '').trim() !== ''
  );
}

/*
 * A pipe ends a cell wherever it appears, so one inside a value has to be escaped — and a line
 * break inside a cell cannot be written at all in a Markdown table, which is what `<br>` is for.
 */
const cell = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\n+/g, '<br>')
    .trim();

export function delimitedToMarkdown(
  text: string,
  options: TableOptions = {}
): string {
  const delimiter = options.delimiter ?? sniff(text);
  const rows = parseDelimited(text, delimiter);

  if (rows.length === 0) {
    return '';
  }

  const width = Math.max(...rows.map((one) => one.length));
  const padded = rows.map((one) => [
    ...one.map(cell),
    ...Array(width - one.length).fill(''),
  ]);

  /*
   * A table with no header row is not a table as far as Markdown is concerned — the separator is
   * what makes one — so a file whose first row is data gets numbered columns rather than losing it.
   */
  const [head, body] =
    options.header === false
      ? [Array.from({ length: width }, (_, i) => `Column ${i + 1}`), padded]
      : [padded[0], padded.slice(1)];

  const lines = [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...body.map((one) => `| ${one.join(' | ')} |`),
  ];

  return `${lines.join('\n')}\n`;
}
