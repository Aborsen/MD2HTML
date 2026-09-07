'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useTabs } from './TabsContext';

// Active = brand underline (::after, full button width) + --ink-highlight text.
const tabsTriggerVariants = cva(
  cn(
    'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap',
    '-mb-px cursor-pointer rounded-t border-0 bg-transparent font-medium text-ink-secondary',
    'transition-colors',
    '[&_svg]:shrink-0',

    // Underline track — transparent until active.
    "after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:rounded-[1px] after:bg-transparent after:transition-colors after:content-['']",

    // Hover (inactive only): body text shift only — no background change.
    'data-[state=inactive]:hover:text-ink-body',

    // Active: highlight text + brand underline.
    'data-[state=active]:text-ink-highlight',
    'data-[state=active]:after:bg-ink-highlight',

    // Focus — brand-tinted ring (tabs are navigation, not form).
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    // Disabled — unified opacity recipe.
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-disabled'
  ),
  {
    variants: {
      size: {
        sm: 'px-2.5 pt-1.5 pb-2 text-xs',
        md: 'px-3 pt-2 pb-3 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const TabsTrigger = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  const { size } = useTabs();
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ size }), className)}
      {...props}
    />
  );
};

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { TabsTrigger, tabsTriggerVariants };
