import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

interface TimelineProps
  extends ComponentProps<typeof CollapsiblePrimitive.Root> {}

const Timeline = ({ className, ref, ...props }: TimelineProps) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    data-slot="timeline"
    className={cn('flex w-full flex-col', className)}
    {...props}
  />
);

Timeline.displayName = 'Timeline';

export { Timeline };
