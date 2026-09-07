import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/**
 * A helper component that displays keyboard shortcuts (e.g., 'Ctrl + S') associated with a menu item.
 */
const DropdownMenuShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export { DropdownMenuShortcut };
