import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A wrapper for individual items within a SidebarMenu.
 * It establishes a 'group/menu-item' context, allowing child elements like
 * SidebarMenuButton and SidebarMenuAction to coordinate their hover and active styles.
 */
function SidebarMenuItem({ className, ref, ...props }: ComponentProps<'li'>) {
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}

export { SidebarMenuItem };
