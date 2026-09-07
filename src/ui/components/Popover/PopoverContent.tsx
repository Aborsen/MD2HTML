import { Content, Portal } from '@radix-ui/react-popover';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The popover container that holds the popover content, handling animations and positioning.
 */
const PopoverContent = ({
  className,
  align = 'center',
  sideOffset = 4,
  ref,
  ...props
}: ComponentProps<typeof Content>) => (
  <Portal>
    <Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border p-4 outline-none',
        'border-stroke bg-surface-page text-ink-primary',
        'shadow-md',

        // Closed state
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=closed]:zoom-out-95',

        // Opened state
        'data-[state=open]:animate-in',
        'data-[state=open]:fade-in-0',
        'data-[state=open]:zoom-in-95',

        // Side based animations
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',

        'origin-[--radix-popover-content-transform-origin]',
        className
      )}
      {...props}
    />
  </Portal>
);

PopoverContent.displayName = Content.displayName;

export { PopoverContent };
