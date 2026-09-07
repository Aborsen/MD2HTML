import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/utils';

interface TooltipContentProps
  extends ComponentPropsWithRef<typeof TooltipPrimitive.Content> {
  showArrow?: boolean;
  arrowClassName?: string;
}

/**
 * The floating panel that contains the tooltip content.
 * Features automated entry/exit animations based on the current side and state.
 */
function TooltipContent({
  className,
  sideOffset = 8,
  showArrow = true,
  arrowClassName,
  children,
  ref,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50',
          'px-2 py-1',
          'rounded-md bg-ink-primary',
          'text-surface-card text-xs',

          // Animation
          'fade-in-0 zoom-in-95 animate-in',
          'data-[state=closed]:fade-out-0',
          'data-[state=closed]:zoom-out-95',
          'data-[state=closed]:animate-out',

          // Slide based on side
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',

          'origin-[--radix-tooltip-content-transform-origin]',
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <TooltipPrimitive.Arrow
            className={cn(arrowClassName, 'fill-ink-primary')}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { TooltipContent };
