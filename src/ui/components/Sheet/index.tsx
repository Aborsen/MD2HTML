'use client';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { ComponentPropsWithRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { DialogTitleFallback } from '../DialogTitleFallback';

/**
 * The root container for the Sheet.
 * Manages the open/closed state and provides context to its children.
 */
const Sheet = SheetPrimitive.Root;

/**
 * The button or element that opens the Sheet.
 * Must be a child of the Sheet component.
 */
const SheetTrigger = SheetPrimitive.Trigger;

/**
 * A button that closes the Sheet.
 * Can be placed anywhere within the SheetContent.
 */
const SheetClose = SheetPrimitive.Close;

/**
 * Portals the Sheet content into the body (or a specific container)
 * to ensure it appears above other UI elements regardless of the DOM hierarchy.
 */
const SheetPortal = SheetPrimitive.Portal;

/**
 * The semi-transparent backdrop that appears behind the Sheet content.
 * Clicking it usually closes the Sheet.
 */
function SheetOverlay({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50',
        'bg-black/80',

        // Closed state
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',

        // Opened state
        'data-[state=open]:fade-in-0',
        'data-[state=open]:animate-in',
        className
      )}
      {...props}
      ref={ref}
    />
  );
}

const sheetVariants = cva(
  cn(
    'fixed z-50 gap-4 p-6',
    'bg-surface-page',

    'shadow-lg',
    'transition ease-in-out',

    // Closed state
    'data-[state=closed]:animate-out',
    'data-[state=closed]:duration-300',

    // Opened state
    'data-[state=open]:animate-in',
    'data-[state=open]:duration-500'
  ),
  {
    variants: {
      side: {
        top: cn(
          'inset-x-0 top-0',
          'border-b',

          // Closed state
          'data-[state=closed]:slide-out-to-top',

          // Opened state
          'data-[state=open]:slide-in-from-top'
        ),
        bottom: cn(
          'inset-x-0 bottom-0',
          'border-t',

          // Closed state
          'data-[state=closed]:slide-out-to-bottom',

          // Opened state
          'data-[state=open]:slide-in-from-bottom'
        ),
        left: cn(
          'inset-y-0 left-0',
          'h-full w-3/4 sm:max-w-sm',
          'border-r',

          // Closed state
          'data-[state=closed]:slide-out-to-left',

          // Opened state
          'data-[state=open]:slide-in-from-left'
        ),
        right: cn(
          'inset-y-0 right-0',
          'h-full w-3/4 sm:max-w-sm',

          // Closed state
          'data-[state=closed]:slide-out-to-right',

          // Opened state
          'data-[state=open]:slide-in-from-right'
        ),
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export interface SheetContentProps
  extends ComponentPropsWithRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  isCloseButtonVisible?: boolean;
  sheetOverlayClassName?: string;
}

/**
 * The primary container for the Sheet's content.
 * It handles the entry/exit animations and positioning based on the `side` prop.
 */
function SheetContent({
  side = 'right',
  className,
  children,
  ref,
  isCloseButtonVisible = true,
  sheetOverlayClassName,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay className={sheetOverlayClassName} />
      <SheetPrimitive.Content
        ref={ref}
        aria-describedby={undefined}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <DialogTitleFallback>{props['aria-label']}</DialogTitleFallback>
        {isCloseButtonVisible && (
          <SheetPrimitive.Close
            className={cn(
              'absolute top-5 right-4',
              'rounded-md opacity-70',
              'transition-opacity',

              'hover:opacity-100',
              'hover:bg-state-hover hover:text-ink-body',

              'ring-offset-surface-page',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-focus-ring-brand',
              'focus:ring-offset-2',

              'disabled:pointer-events-none',

              'data-[state=open]:bg-brand-tertiary'
            )}
          >
            <X className="h-6.5 w-6.5 p-1" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

/**
 * A layout helper for the top section of the sheet.
 * Usually contains the Title and Description.
 */
function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-2 text-center sm:text-left',
        className
      )}
      {...props}
    />
  );
}

/**
 * The accessible title of the Sheet.
 * Required for accessibility unless hidden via `VisuallyHidden`.
 */
function SheetTitle({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      ref={ref}
      className={cn('font-semibold text-ink-primary text-lg', className)}
      {...props}
    />
  );
}

/**
 * The accessible description of the Sheet.
 * Provides context about the sheet's purpose to screen readers.
 */
function SheetDescription({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      ref={ref}
      className={cn('text-ink-secondary text-sm', className)}
      {...props}
    />
  );
}

/**
 * A layout helper for the scrollable middle section of the sheet.
 * Usually contains the main content between header and footer.
 */
function SheetBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto', className)}
      {...props}
    />
  );
}

/**
 * A layout helper for the bottom section of the sheet.
 * Usually contains action buttons (Save, Cancel, etc.).
 */
function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetPortal,
  SheetTrigger,
  SheetClose,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
