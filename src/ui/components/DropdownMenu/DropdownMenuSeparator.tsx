import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { Separator } from '../Separator';

/**
 * A visual divider used to separate groups of related items within a dropdown menu.
 */
const DropdownMenuSeparator = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof Separator>) => (
  <Separator
    ref={ref}
    variant="border"
    orientation="horizontal"
    className={cn('-mx-1 my-1', className)}
    {...props}
  />
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export { DropdownMenuSeparator };
