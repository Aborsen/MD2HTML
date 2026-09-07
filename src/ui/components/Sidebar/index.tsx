'use client';

import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/utils';
import { Sheet, SheetContent } from '../Sheet';
import { SIDEBAR_WIDTH_MOBILE } from './constants';
import { SidebarContent } from './SidebarContent';
import { SidebarFooter } from './SidebarFooter';
import { SidebarGroup } from './SidebarGroup';
import { SidebarHeader } from './SidebarHeader';
import { SidebarInset } from './SidebarInset';
import { SidebarMenu } from './SidebarMenu';
import { SidebarMenuButton } from './SidebarMenuButton';
import { SidebarMenuItem } from './SidebarMenuItem';
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './SidebarMenuSub';
import { SidebarNavigationItems } from './SidebarNavigationItems';
import { SidebarProvider, useSidebar } from './SidebarProvider';
import { SidebarRail } from './SidebarRail';
import { SidebarTrigger } from './SidebarTrigger';
import {
  isNavigationGroup,
  isNavigationItem,
  type NavigationElement,
  type NavigationGroup,
  type NavigationItem,
} from './types';

/**
 * The main container for the application's sidebar.
 *
 * It automatically handles responsive behavior:
 * - **Mobile**: Renders as a Sheet (drawer) that slides in.
 * - **Desktop**: Renders as a collapsible side panel that pushes sibling content.
 *
 * @prop side - Determines if the sidebar appears on the 'left' or 'right' of the screen.
 * @prop variant - 'sidebar' (standard bordered), 'floating' (detached card-like), or 'inset'.
 * @prop collapsible - Controls behavior when closed: 'offcanvas' (hidden completely) or 'icon' (minimized to icon width).
 */
function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  sheetClassname,
  ref,
  ...props
}: ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  sheetClassname?: string;
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'flex h-full w-[--sidebar-width] flex-col bg-surface-card text-ink-primary',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          side="left"
          className={cn(
            'w-[--sidebar-width] bg-surface-card p-0 [&>button]:hidden',
            'data-[state=closed]:duration-500',
            'data-[state=open]:duration-500',
            sheetClassname
          )}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as CSSProperties
          }
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      className="group peer hidden lg:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      <div
        className={cn(
          'relative w-[--sidebar-width]',
          'bg-transparent',
          'transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]'
        )}
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10',
          'hidden lg:flex',
          'h-svh w-[--sidebar-width]',
          'transition-[left,right,width] duration-200 ease-linear',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : 'border-stroke group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
            'flex h-full w-full flex-col',
            'bg-surface-card',
            'group-data-[variant=floating]:rounded-md',
            'group-data-[variant=floating]:border',
            'group-data-[variant=floating]:border-stroke',
            'group-data-[variant=floating]:shadow'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarProvider,
  type NavigationElement,
  type NavigationItem,
  type NavigationGroup,
  isNavigationGroup,
  isNavigationItem,
  SidebarNavigationItems,
  useSidebar,
  SidebarRail,
};
