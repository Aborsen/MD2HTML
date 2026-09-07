'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '../../lib/utils';

const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-surface-chips',
  {
    variants: {
      variant: {
        primary: '',
        tertiary: '',
        green: '',
        attention: '',
        destructive: '',
      },
      size: {
        md: 'h-1',
        lg: 'h-1.5',
      },
      rounded: {
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'lg',
    },
  }
);

const progressIndicatorVariants = cva('h-full transition-all', {
  variants: {
    variant: {
      primary: 'bg-primary-gradient',
      tertiary: 'bg-brand-tertiary',
      green: 'bg-fb-green',
      attention: 'bg-fb-attention',
      destructive: 'bg-fb-red-text',
    },
    rounded: {
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    rounded: 'lg',
  },
});

export interface ProgressBarProps
  extends React.ComponentPropsWithRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

const ProgressBar = ({
  className,
  value,
  variant,
  size,
  rounded,
  ref,
  max = 100,
  ...props
}: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value ?? 0, 0), max);
  const percentage = Math.round((clampedValue / max) * 100);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant, size, rounded }), className)}
      value={clampedValue}
      max={max}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={progressIndicatorVariants({ variant, rounded })}
        style={{ width: `${percentage}%` }}
      />
    </ProgressPrimitive.Root>
  );
};

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
