import { Label } from '@radix-ui/react-dropdown-menu';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A text label used to organize and caption groups of items within a dropdown menu.
 */
const DropdownMenuLabel = ({
  className,
  inset,
  ref,
  ...props
}: ComponentProps<typeof Label> & {
  inset?: boolean;
}) => (
  <Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 font-semibold text-sm',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
);

DropdownMenuLabel.displayName = Label.displayName;

export { DropdownMenuLabel };
