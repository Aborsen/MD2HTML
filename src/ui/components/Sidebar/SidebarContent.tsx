import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The primary scrollable container for sidebar interactive elements or navigation links.
 * It automatically handles overflow behavior, switching to hidden when the sidebar is
 * in 'icon' collapse mode to prevent layout shifting.
 */
function SidebarContent({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2',

        'overflow-auto',
        'group-data-[collapsible=icon]:overflow-hidden',

        className
      )}
      {...props}
    />
  );
}

export { SidebarContent };
