'use client';

import * as ModalPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentProps, ComponentPropsWithRef } from 'react';

import { cn } from '../../lib/utils';
import { DialogTitleFallback } from '../DialogTitleFallback';
import { IconButton } from '../IconButton';
import { ModalClose } from './ModalClose';
import { ModalOverlay } from './ModalOverlay';
import { ModalPortal } from './ModalPortal';

interface ModalContentProps
  extends ComponentPropsWithRef<typeof ModalPrimitive.Content> {
  isCloseButtonVisible?: boolean;
  closeButtonProps?: ComponentProps<typeof IconButton>;
}

export function ModalContent({
  ref,
  className,
  children,
  isCloseButtonVisible = true,
  closeButtonProps,
  ...props
}: ModalContentProps) {
  return (
    <ModalPortal>
      <ModalOverlay />
      <ModalPrimitive.Content
        ref={ref}
        aria-describedby={undefined}
        className={cn(
          'flex max-h-[90dvh] max-w-lg flex-col',
          'fixed top-1/2 left-1/2 z-[100] w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2',
          'rounded-lg',
          'border border-stroke',
          'bg-surface-card p-4 shadow-lg duration-200',

          // Closed state
          'data-[state=closed]:fade-out-0',
          'data-[state=closed]:slide-out-to-left-1/2',
          'data-[state=closed]:zoom-out-95',
          'data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=closed]:animate-out',

          // Opened state
          'data-[state=open]:fade-in-0',
          'data-[state=open]:zoom-in-95',
          'data-[state=open]:slide-in-from-left-1/2',
          'data-[state=open]:slide-in-from-top-[48%]',
          'data-[state=open]:animate-in',
          className
        )}
        {...props}
      >
        {children}
        <DialogTitleFallback>{props['aria-label']}</DialogTitleFallback>
        {isCloseButtonVisible && (
          <ModalClose asChild>
            <IconButton
              variant="transparent"
              size="md"
              rounded="full"
              className={cn('absolute top-4 right-4 max-h-fit max-w-fit')}
              {...closeButtonProps}
            >
              <X className="text-ink-body" />
              <span className="sr-only">Close</span>
            </IconButton>
          </ModalClose>
        )}
      </ModalPrimitive.Content>
    </ModalPortal>
  );
}

ModalContent.displayName = 'ModalContent';
