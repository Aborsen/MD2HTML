import { SubContent } from '@radix-ui/react-dropdown-menu';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The container for a nested submenu that appears when hovering or selecting a sub-trigger item.
 */
const DropdownMenuSubContent = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof SubContent>) => (
  <SubContent
    ref={ref}
    className={cn(
      'z-50 w-max min-w-[140px] max-w-[320px]',
      'rounded-lg border p-1',
      'bg-surface-card text-ink-primary',
      'overflow-hidden',
      'shadow-dropdown',

      'origin-[--radix-dropdown-menu-content-transform-origin]',

      //Opened state
      'data-[state=open]:fade-in-0',
      'data-[state=open]:zoom-in-95',
      'data-[state=open]:animate-in',

      //Closed state
      'data-[state=closed]:fade-out-0',
      'data-[state=closed]:zoom-out-95',
      'data-[state=closed]:animate-out',

      //Side based animation
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',

      className
    )}
    {...props}
  />
);

DropdownMenuSubContent.displayName = SubContent.displayName;

export { DropdownMenuSubContent };
