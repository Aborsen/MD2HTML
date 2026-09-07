'use client';

import type { ComponentProps, Ref } from 'react';
import { useRef } from 'react';

import { useScrollShadow } from '../../hooks/use-scroll-shadow';
import type { ScrollShadowVisibility } from '../../hooks/use-scroll-shadow/types';
import { cn } from '../../lib/utils';

export interface ScrollShadowProps extends Omit<ComponentProps<'div'>, 'size'> {
  ref?: Ref<HTMLDivElement>;
  size?: number;
  offset?: number;
  orientation?: 'vertical' | 'horizontal';
  visibility?: ScrollShadowVisibility;
  isEnabled?: boolean;
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void;
}

/**
 * A scrollable container component that automatically displays fade-in/fade-out shadows
 * at the edges when content overflows, providing visual feedback for scrollable content.
 */
export function ScrollShadow({
  ref,
  children,
  className,
  size = 40,
  offset = 0,
  orientation = 'vertical',
  visibility = 'auto',
  isEnabled = true,
  style,
  onVisibilityChange,
  ...props
}: ScrollShadowProps) {
  const internalRef = useRef<HTMLDivElement | null>(null);

  useScrollShadow({
    containerRef: internalRef,
    orientation,
    size,
    offset,
    visibility,
    isEnabled,
    onVisibilityChange,
  });

  const scrollPaddingStyle =
    orientation === 'vertical'
      ? { scrollPaddingBlock: `${size}px` }
      : { scrollPaddingInline: `${size}px` };

  return (
    <div
      ref={(node) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        orientation === 'vertical' ? 'overflow-y-auto' : 'overflow-x-auto',
        className
      )}
      style={{ ...scrollPaddingStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

ScrollShadow.displayName = 'ScrollShadow';
