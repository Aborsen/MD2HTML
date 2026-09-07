import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useSidebar } from './SidebarProvider';

function SidebarRail({ className, ...props }: ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4',
        'transition-all ease-linear',
        'after:absolute after:inset-y-0 after:start-1/2 after:w-[2px]',
        'group-data-[side=left]:-right-4',
        'group-data-[side=right]:left-0',
        'sm:flex',
        'ltr:-translate-x-1/2',
        'rtl:-translate-x-1/2',
        'cursor-e-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0',
        'group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      {...props}
    />
  );
}

export { SidebarRail };
