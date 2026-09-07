import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import {
  TimelineStepMarker,
  type TimelineStepStatus,
} from './TimelineStepMarker';

interface TimelineStepProps
  extends Omit<
    ComponentProps<typeof CollapsiblePrimitive.Root>,
    'title' | 'children'
  > {
  status: TimelineStepStatus;
  title: ReactNode;
  icon?: ReactNode;
  toggleLabel?: string;
  contentClassName?: string;
  children?: ReactNode;
}

const TimelineStep = ({
  status,
  title,
  icon,
  open,
  defaultOpen = false,
  toggleLabel,
  className,
  contentClassName,
  children,
  ref,
  onOpenChange,
  ...props
}: TimelineStepProps) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    data-slot="timeline-step"
    className={cn('relative flex flex-col', className)}
    {...props}
  >
    <span
      aria-hidden
      data-slot="timeline-connector"
      className="absolute top-3 -bottom-3 left-2 w-px -translate-x-1/2 bg-stroke"
    />
    <CollapsiblePrimitive.Trigger
      aria-label={toggleLabel}
      data-slot="timeline-step-trigger"
      className={cn(
        'group/timeline-step',
        'relative flex w-full items-center gap-2 py-2',
        'outline-none',
        'focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-state-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card'
      )}
    >
      <TimelineStepMarker status={status} />

      {icon && (
        <span className="flex shrink-0 items-center text-ink-secondary [&_svg]:size-4">
          {icon}
        </span>
      )}

      <span className="min-w-0 flex-initial truncate text-left font-mono text-compact text-ink-body transition-colors group-hover/timeline-step:text-ink-primary">
        {title}
      </span>

      <ChevronDown className="pointer-events-none -ml-0.5 size-3 shrink-0 -rotate-90 text-ink-secondary transition-transform duration-200 group-hover/timeline-step:text-ink-primary group-data-[state=open]/timeline-step:rotate-0" />
    </CollapsiblePrimitive.Trigger>

    <CollapsiblePrimitive.Content
      data-slot="timeline-step-content"
      className={cn(
        'overflow-hidden',
        'motion-reduce:animate-none',
        'data-[state=closed]:motion-safe:animate-collapsible-up',
        'data-[state=open]:motion-safe:animate-collapsible-down'
      )}
    >
      <div
        className={cn('flex flex-col gap-3 pt-1 pb-2 pl-6', contentClassName)}
      >
        {children}
      </div>
    </CollapsiblePrimitive.Content>
  </CollapsiblePrimitive.Root>
);

TimelineStep.displayName = 'TimelineStep';

export { TimelineStep };
