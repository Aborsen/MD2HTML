import { cn } from '../../lib/utils';

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'h-9 whitespace-nowrap p-2 align-middle text-ink-body text-xs [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}

export { TableCell };
