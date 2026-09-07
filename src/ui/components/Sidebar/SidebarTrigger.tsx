import { PanelLeft } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { useSidebar } from './SidebarProvider';

/**
 * A dedicated button component used to toggle the sidebar's open/closed state.
 * It automatically consumes the `toggleSidebar` function from the sidebar context.
 */
function SidebarTrigger({
  className,
  onClick,
  ref,
  ...props
}: ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      className={cn('h-7 w-7', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

export { SidebarTrigger };
