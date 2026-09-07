import { cn } from '../../lib/utils';

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      // Canonical kit row states (scoped to body rows — header is excluded).
      // Selected/hover-while-selected use `!` so they win over plain hover
      // regardless of Tailwind's variant ordering.
      className={cn(
        '[&_tr:last-child]:border-0',
        '[&_tr:hover]:bg-tbl-row-hover',
        '[&_tr:active]:bg-tbl-row-pressed',
        '[&_tr[data-state=selected]]:!bg-tbl-row-pressed',
        '[&_tr[data-state=selected]:hover]:!bg-tbl-row-selected-hover',
        className
      )}
      {...props}
    />
  );
}

export { TableBody };
