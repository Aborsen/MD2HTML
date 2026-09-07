import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The top section of the sidebar, usually reserved for logos,
 * workspace switchers, or branding elements.
 */
function SidebarHeader({ className, ref, ...props }: ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn('flex gap-2 p-4', className)}
      {...props}
    />
  );
}

export { SidebarHeader };
