'use client';

import type { ComponentProps, PropsWithChildren } from 'react';

import { cn } from '../../lib/utils';
import { ScrollShadow, type ScrollShadowProps } from '../ScrollShadow';

interface ModalBodyProps extends PropsWithChildren<ComponentProps<'div'>> {
  shadowSize?: ScrollShadowProps['size'];
}

export function ModalBody({
  className,
  shadowSize = 40,
  children,
  ...props
}: ModalBodyProps) {
  return (
    <ScrollShadow
      size={shadowSize}
      className={cn('-mr-4 flex min-h-0 flex-1 flex-col gap-3 pr-2', className)}
      {...props}
    >
      {children}
    </ScrollShadow>
  );
}
