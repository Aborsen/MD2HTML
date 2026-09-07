'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useSegmentedControl } from './SegmentedControlContext';

// Base holds only cross-variant primitives (layout, focus, disabled). The pill
// track's fill/shadow lives in the `default` variant so `underline` — a flat,
// content-width tab — doesn't inherit the raised-pill background or stretch.
const segmentedControlTriggerVariants = cva(
  cn(
    'inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap',
    'rounded font-medium text-ink-secondary',
    'transition-[background-color,color,box-shadow] duration-100',
    // Icon follows currentColor — no per-state icon override.
    '[&_svg]:shrink-0',

    // Hover (inactive only): half-step lift + neutral rim + primary text.
    'data-[state=inactive]:hover:bg-segctrl-hover-bg',
    'data-[state=inactive]:hover:text-ink-primary',
    'data-[state=inactive]:hover:shadow-segctrl-hover',

    // Active / selected: raised pill (Surface/Card light, Chips dark) + rim.
    'data-[state=active]:bg-surface-card',
    'dark:data-[state=active]:bg-surface-chips',
    'data-[state=active]:text-ink-primary',
    'data-[state=active]:shadow-segctrl-active',

    // Focus — brand-tinted ring with a Surface/Card gap.
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    // Disabled — unified opacity recipe.
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-disabled'
  ),
  {
    variants: {
      size: {
        sm: 'h-5 px-1 text-[11px] [&_svg]:size-3',
        md: 'h-8 px-3 text-[13px] [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const SegmentedControlTrigger = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  const { size } = useSegmentedControl();
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(segmentedControlTriggerVariants({ size }), className)}
      {...props}
    />
  );
};

SegmentedControlTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { SegmentedControlTrigger, segmentedControlTriggerVariants };
