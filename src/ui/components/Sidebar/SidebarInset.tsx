import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The wrapper for the main content area when using the 'inset' sidebar variant.
 * It uses peer-data attributes to automatically adjust margins, border-radius,
 * and shadows based on the sidebar's state (expanded/collapsed).
 */
function SidebarInset({ className, ref, ...props }: ComponentProps<'main'>) {
  return (
    <main
      ref={ref}
      className={cn(
        'relative flex h-full flex-1 flex-col',

        'bg-surface-page',

        'overflow-hidden',

        'lg:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2',
        'lg:peer-data-[variant=inset]:m-2',
        'lg:peer-data-[variant=inset]:ml-0',
        'lg:peer-data-[variant=inset]:rounded-xl',
        'lg:peer-data-[variant=inset]:shadow',
        className
      )}
      {...props}
    />
  );
}

export { SidebarInset };
