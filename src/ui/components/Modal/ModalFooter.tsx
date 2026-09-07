'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const modalFooterVariants = cva('mt-3 flex flex-shrink-0 items-center gap-3', {
  variants: {
    align: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    },
    flexDirection: {
      row: 'flex-row',
      col: 'flex-col',
      'col-reverse': 'flex-col-reverse',
      'row-reverse': 'flex-row-reverse',
    },
  },
  defaultVariants: {
    align: 'right',
    flexDirection: 'row',
  },
});

interface ModalFooterProps
  extends ComponentProps<'div'>,
    VariantProps<typeof modalFooterVariants> {}

export function ModalFooter({ className, align, ...props }: ModalFooterProps) {
  return (
    <div className={cn(modalFooterVariants({ align }), className)} {...props} />
  );
}

ModalFooter.displayName = 'ModalFooter';
