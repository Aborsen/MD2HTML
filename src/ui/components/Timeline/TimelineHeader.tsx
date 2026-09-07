import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface TimelineHeaderProps
  extends ComponentProps<typeof CollapsiblePrimitive.Trigger> {
  icon?: ReactNode;
}

const TimelineHeader = ({
  icon,
  className,
  children,
  ref,
  ...props
}: TimelineHeaderProps) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    data-slot="timeline-header"
    className={cn(
      'group/timeline-header',
      'flex w-full items-center gap-2 py-2',
      'text-ink-secondary text-sm',
      'font-medium',
      'outline-none',
      'transition-colors',
      'hover:text-ink-primary',
      'focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-state-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
      className
    )}
    {...props}
  >
    {icon && (
      <span className="flex shrink-0 items-center [&_svg]:size-4">{icon}</span>
    )}

    <span className="truncate text-left">{children}</span>

    <ChevronDown className="pointer-events-none size-4 shrink-0 -rotate-90 transition-transform duration-200 group-data-[state=open]/timeline-header:rotate-0" />
  </CollapsiblePrimitive.Trigger>
);

TimelineHeader.displayName = 'TimelineHeader';

export { TimelineHeader };
