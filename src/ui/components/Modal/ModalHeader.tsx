'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const modalHeaderVariants = cva('mb-3 flex flex-shrink-0 flex-col gap-1.5', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

interface ModalHeaderProps
  extends ComponentProps<'div'>,
    VariantProps<typeof modalHeaderVariants> {}

export function ModalHeader({ className, align, ...props }: ModalHeaderProps) {
  return (
    <div className={cn(modalHeaderVariants({ align }), className)} {...props} />
  );
}

ModalHeader.displayName = 'ModalHeader';
