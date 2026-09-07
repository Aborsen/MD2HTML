import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A vertical list container for sidebar navigation items.
 * It serves as the primary wrapper for `SidebarMenuItem` components,
 * providing consistent spacing and alignment.
 */
function SidebarMenu({ className, ref, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
}

export { SidebarMenu };
