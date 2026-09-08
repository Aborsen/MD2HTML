import { marked, type Token, type Tokens } from 'marked';

/*
 * Markdown as plain text — for pasting into an email, a ticket or a chat that renders nothing.
 *
 * Written from the token stream rather than by stripping tags out of the rendered HTML, because the
 * structure is the part worth keeping: a list that arrives as one run-on paragraph is not plain
 * text, it is a mess. Links keep their address in brackets, since a link with the URL thrown away
 * is a sentence that used to mean something.
 */

const inline = (tokens: Token[] | undefined, fallback = ''): string => {
  if (!tokens) {
    return fallback;
  }

  return tokens
    .map((token) => {
      switch (token.type) {
        case 'text':
        case 'codespan':
        case 'html':
          return (token as Tokens.Text).text ?? '';
        case 'escape':
          return (token as Tokens.Escape).text ?? '';
        case 'strong':
        case 'em':
        case 'del':
          return inline((token as Tokens.Strong).tokens);
        case 'link': {
          const link = token as Tokens.Link;
          const label = inline(link.tokens, link.href);

          // The address is the half a reader cannot reconstruct.
          return label === link.href ? link.href : `${label} (${link.href})`;
        }
        case 'image': {
          const image = token as Tokens.Image;

          return image.text ? `[image: ${image.text}]` : '[image]';
        }
        case 'br':
          return '\n';
        case 'space':
          return '';
        default:
          return (token as Tokens.Text).raw ?? '';
      }
    })
    .join('');
};

function listToText(list: Tokens.List, depth: number): string {
  const pad = '  '.repeat(depth);

  return list.items
    .map((item, index) => {
      const marker = list.ordered
        ? `${Number(list.start || 1) + index}.`
        : '-';
      const tick =
        item.task === true ? (item.checked ? '[x] ' : '[ ] ') : '';
      const body = blocksToText(item.tokens ?? [], depth + 1).trim();
      const [first, ...rest] = body.split('\n');

      return [
        `${pad}${marker} ${tick}${first ?? ''}`,
        ...rest.map((line) => `${pad}  ${line}`),
      ].join('\n');
    })
    .join('\n');
}

function blocksToText(tokens: Token[], depth = 0): string {
  const out: string[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'heading': {
        const heading = token as Tokens.Heading;
        const text = inline(heading.tokens, heading.text);

        // The first two levels get a rule under them; deeper ones are just a line of their own.
        out.push(
          heading.depth <= 2
            ? `${text}\n${(heading.depth === 1 ? '=' : '-').repeat(Math.min(text.length, 60))}`
            : text
        );
        break;
      }

      case 'paragraph':
        out.push(inline((token as Tokens.Paragraph).tokens));
        break;

      case 'text':
        out.push(inline((token as Tokens.Text).tokens, (token as Tokens.Text).text));
        break;

      case 'list':
        out.push(listToText(token as Tokens.List, depth));
        break;

      case 'code':
        out.push((token as Tokens.Code).text);
        break;

      case 'blockquote':
        out.push(
          blocksToText((token as Tokens.Blockquote).tokens ?? [], depth)
            .split('\n')
            .map((line) => (line ? `> ${line}` : '>'))
            .join('\n')
        );
        break;

      case 'table': {
        const table = token as Tokens.Table;
        const head = table.header.map((one) => inline(one.tokens, one.text));
        const body = table.rows.map((row) =>
          row.map((one) => inline(one.tokens, one.text))
        );

        // Columns padded to their widest value: a table is read down as well as across.
        const widths = head.map((_, column) =>
          Math.max(
            head[column].length,
            ...body.map((row) => (row[column] ?? '').length)
          )
        );
        const line = (cells: string[]) =>
          cells
            .map((value, column) => value.padEnd(widths[column]))
            .join('  ')
            .trimEnd();

        out.push(
          [
            line(head),
            widths.map((width) => '-'.repeat(width)).join('  '),
            ...body.map(line),
          ].join('\n')
        );
        break;
      }

      case 'hr':
        out.push('-'.repeat(40));
        break;

      case 'html':
        // Whatever it was, its text is the only part plain text can carry.
        out.push(
          (token as Tokens.HTML).text.replace(/<[^>]+>/g, '').trim()
        );
        break;

      case 'space':
        break;

      default:
        out.push(inline([token]));
    }
  }

  return out.filter((block) => block !== '').join('\n\n');
}

export function markdownToText(markdown: string): string {
  return `${blocksToText(marked.lexer(markdown)).replace(/\n{3,}/g, '\n\n').trim()}\n`;
}
