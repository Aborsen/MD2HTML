import { Content, Portal } from '@radix-ui/react-dropdown-menu';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The popover container that holds all dropdown items, handling animations and positioning.
 */
const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  ref,
  ...props
}: ComponentProps<typeof Content>) => (
  <Portal>
    <Content
      ref={ref}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className={cn(
        'z-50 rounded-lg border p-1',
        'max-h-[var(--radix-dropdown-menu-content-available-height)]',
        // Fluid width — menu hugs its longest item label within bounds.
        'w-max min-w-[140px] max-w-[320px]',
        'border-stroke bg-surface-card text-ink-primary',
        'shadow-dropdown',
        'overflow-y-auto overflow-x-hidden',

        // Performance optimizations to reduce forced reflows
        'will-change-[transform,opacity]',
        '[transform:translateZ(0)]',
        '[backface-visibility:hidden]',

        //Closed state
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=closed]:zoom-out-95',

        //Opened state
        'data-[state=open]:animate-in',
        'data-[state=open]:fade-in-0',
        'data-[state=open]:zoom-in-95',

        //Side based animations
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',

        'origin-[--radix-dropdown-menu-content-transform-origin]',
        className
      )}
      {...props}
    />
  </Portal>
);

DropdownMenuContent.displayName = Content.displayName;

export { DropdownMenuContent };
