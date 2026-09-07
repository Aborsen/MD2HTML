import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

export type TableSortDirection = 'asc' | 'desc' | undefined;

interface TableHeadProps extends ComponentProps<'th'> {
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
}

function SortIcon({ direction }: { direction: TableSortDirection }) {
  if (!direction) {
    return <ChevronsUpDown className="size-3.5 text-ink-inactive" />;
  }

  return (
    <ChevronDown
      className={cn(
        'size-3.5 text-ink-body transition-transform duration-200',
        direction === 'asc' && 'rotate-180'
      )}
    />
  );
}

function TableHead({
  className,
  children,
  sortable,
  sortDirection = undefined,
  onSort,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      aria-sort={
        sortable
          ? sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
              ? 'descending'
              : 'none'
          : undefined
      }
      className={cn(
        'h-9 whitespace-nowrap ps-3 pe-2 text-left align-middle font-medium text-ink-secondary text-xs [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            'inline-flex items-center gap-1.5 rounded',
            'transition-colors hover:text-ink-body',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
            sortDirection && 'text-ink-body'
          )}
        >
          {children}
          <SortIcon direction={sortDirection} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export { TableHead };
