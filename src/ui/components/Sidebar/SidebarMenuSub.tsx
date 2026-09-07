import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A nested list container for second-level navigation within a SidebarMenu.
 * It provides a visual hierarchy using a left border and indentation.
 * Automatically hides when the parent sidebar is in 'icon' collapsed mode.
 */
function SidebarMenuSub({ className, ref, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        'mt-1 flex min-w-0 flex-col gap-1',
        'ms-6 px-2.5 py-0 ps-2',
        'border-stroke border-l',
        'translate-x-px',

        'group-data-[collapsible=icon]:hidden',

        className
      )}
      {...props}
    />
  );
}

/**
 * A simple wrapper for items within a SidebarMenuSub list.
 */
function SidebarMenuSubItem({ ref, ...props }: ComponentProps<'li'>) {
  return <li ref={ref} {...props} />;
}

/**
 * The interactive trigger or link for a sub-menu item.
 * Supports active states and consistent sizing with the primary menu buttons.
 */
function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive,
  className,
  ref,
  ...props
}: ComponentProps<'a'> & {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'flex h-7 min-w-0 items-center gap-2 rounded-md px-2',
        '-translate-x-px overflow-hidden',

        'text-ink-secondary',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'hover:text-brand-primary active:text-brand-primary',

        // Active state
        'outline-none ring-brand-secondary focus-visible:ring-2',
        'data-[active=true]:bg-surface-page data-[active=true]:text-brand-primary',

        // Disabled state
        'disabled:pointer-events-none disabled:opacity-30',
        'aria-disabled:pointer-events-none aria-disabled:opacity-30',

        '[&>span:last-child]:truncate',
        '[&>svg]:size-3 [&>svg]:shrink-0 [&>svg]:fill-brand-primary [&>svg]:stroke-brand-primary [&>svg]:text-brand-primary',

        'group-data-[collapsible=icon]:hidden',

        className
      )}
      {...props}
    />
  );
}

export { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem };
