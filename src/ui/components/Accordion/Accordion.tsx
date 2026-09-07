'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '../../lib/utils';

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  );
}

Accordion.displayName = AccordionPrimitive.Root.displayName ?? 'Accordion';

export { Accordion };
