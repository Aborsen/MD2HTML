import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface DefinitionRow {
  /** Stable identity for the row; the term is often a formatted node rather than text. */
  key: string;
  term: ReactNode;
  text: ReactNode;
}

interface DefinitionTableProps {
  rows: DefinitionRow[];
  className?: string;
}

/**
 * Term on the left, explanation on the right: endpoints, inputs, limits.
 *
 * A real table with row headers rather than a grid of divs, because that is what it is — a screen
 * reader announces the term with the explanation, and the pairing survives being copied out.
 */
export function DefinitionTable({ rows, className }: DefinitionTableProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'overflow-x-auto rounded-md border border-stroke',
        className
      )}
    >
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.key}
              className={cn('align-top', index > 0 && 'border-stroke border-t')}
            >
              <th
                scope="row"
                className="w-2/5 bg-surface-card2/60 px-4 py-2.5 text-left font-medium text-ink-primary"
              >
                {row.term}
              </th>
              <td className="px-4 py-2.5 text-ink-body">{row.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
