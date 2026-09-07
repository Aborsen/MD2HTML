import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The bottom section of the sidebar, typically used for user profiles,
 * settings, or secondary actions.
 */
function SidebarFooter({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

export { SidebarFooter };
