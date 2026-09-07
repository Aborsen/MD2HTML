'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

interface AccordionContentProps
  extends ComponentProps<typeof AccordionPrimitive.Content> {}

const AccordionContent = ({
  className,
  children,
  ref,
  ...props
}: AccordionContentProps) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden',
      'data-[state=closed]:animate-accordion-up',
      'data-[state=open]:animate-accordion-down'
    )}
    {...props}
  >
    <div className={cn('px-3 pt-0 pb-3 text-ink-body', className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { AccordionContent };
