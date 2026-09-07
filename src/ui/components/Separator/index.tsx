'use client';

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '../../lib/utils';

const separatorVariants = cva('shrink-0', {
  variants: {
    variant: {
      primary: 'bg-brand-secondary',
      secondary: 'bg-brand-tertiary',
      border: 'bg-stroke',
    },
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    variant: 'border',
    orientation: 'horizontal',
  },
});

export interface SeparatorProps
  extends Omit<
      React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root>,
      'orientation'
    >,
    VariantProps<typeof separatorVariants> {}

const Separator = ({
  className,
  orientation,
  variant,
  decorative = true,
  ref,
  ...props
}: SeparatorProps) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation || 'horizontal'}
    className={cn(separatorVariants({ orientation, variant }), className)}
    {...props}
  />
);
Separator.displayName = 'Separator';

export { Separator };
