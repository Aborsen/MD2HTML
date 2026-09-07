'use client';

import type { ComponentProps } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export interface ToasterProps extends ComponentProps<typeof SonnerToaster> {}

export function Toaster({
  position = 'top-right',
  gap = 8,
  ...props
}: ToasterProps) {
  return <SonnerToaster position={position} gap={gap} {...props} />;
}

Toaster.displayName = 'Toaster';
