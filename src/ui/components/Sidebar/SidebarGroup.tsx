import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A container used to logically separate sections of navigation or actions within the sidebar content.
 * It provides a vertical flex layout and handles spacing for group labels and menus.
 */
function SidebarGroup({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col', className)}
      {...props}
    />
  );
}

export { SidebarGroup };
