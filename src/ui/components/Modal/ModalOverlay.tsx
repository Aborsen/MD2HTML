'use client';

import * as ModalPrimitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithRef } from 'react';

import { cn } from '../../lib/utils';

interface ModalOverlayProps
  extends ComponentPropsWithRef<typeof ModalPrimitive.Overlay> {}

export function ModalOverlay({ className, ref, ...props }: ModalOverlayProps) {
  return (
    <ModalPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-[100]',
        'bg-black/80',

        // Closed state
        'data-[state=closed]:fade-out-0',
        'data-[state=closed]:animate-out',

        // Opened state
        'data-[state=open]:fade-in-0',
        'data-[state=open]:animate-in',
        className
      )}
      {...props}
    />
  );
}

ModalOverlay.displayName = 'ModalOverlay';
