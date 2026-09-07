'use client';

import { Title } from '@radix-ui/react-dialog';
import type { ComponentPropsWithRef } from 'react';

import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

interface ModalTitleProps extends ComponentPropsWithRef<typeof Typography> {}

export function ModalTitle({
  className,
  ref,
  align,
  ...props
}: ModalTitleProps) {
  return (
    <Title asChild>
      <Typography
        ref={ref}
        variant="span"
        weight="semibold"
        textColor="primary"
        align={align}
        className={cn('text-xl', className)}
        {...props}
      />
    </Title>
  );
}

ModalTitle.displayName = 'ModalTitle';
