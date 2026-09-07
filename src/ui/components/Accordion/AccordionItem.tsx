'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const AccordionItem = ({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('not-last:border-stroke not-last:border-b', className)}
      {...props}
    />
  );
};

AccordionItem.displayName = 'AccordionItem';

export { AccordionItem };
