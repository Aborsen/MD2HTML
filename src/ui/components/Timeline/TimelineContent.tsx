import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

interface TimelineContentProps
  extends ComponentProps<typeof CollapsiblePrimitive.Content> {}

const TimelineContent = ({
  className,
  children,
  ref,
  ...props
}: TimelineContentProps) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    data-slot="timeline-content"
    className={cn(
      'py-1',
      'overflow-hidden',
      'motion-reduce:animate-none',
      'data-[state=closed]:motion-safe:animate-collapsible-up',
      'data-[state=open]:motion-safe:animate-collapsible-down'
    )}
    {...props}
  >
    <div
      className={cn(
        'flex flex-col pb-2',
        '[&>*:last-child_[data-slot=timeline-connector]]:hidden',
        className
      )}
    >
      {children}
    </div>
  </CollapsiblePrimitive.Content>
);

TimelineContent.displayName = 'TimelineContent';

export { TimelineContent };
