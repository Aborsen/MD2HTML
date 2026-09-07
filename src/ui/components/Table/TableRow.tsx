import { cn } from '../../lib/utils';

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn('border-stroke border-b transition-colors', className)}
      {...props}
    />
  );
}

export { TableRow };
