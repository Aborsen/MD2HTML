import { cva } from 'class-variance-authority';
import { Circle, CircleAlert, CircleCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Spinner } from '../Spinner';

export type TimelineStepStatus = 'pending' | 'active' | 'success' | 'error';

// Disc sized to the icon so it masks the connector exactly over the glyph — the
// spine then reads as one continuous line emerging from each icon (no halo gap).
// Only the icon carries the colour (green check / red alert).
const timelineStepMarkerVariants = cva(
  cn(
    'relative z-10 flex size-4 shrink-0 items-center justify-center rounded-full',
    'bg-surface-card',
    '[&_svg]:size-4'
  ),
  {
    variants: {
      status: {
        pending: 'text-ink-inactive',
        active: 'text-ink-secondary',
        success: 'text-fb-green',
        error: 'text-fb-red-text',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  }
);

const TimelineStepMarker = ({ status }: { status: TimelineStepStatus }) => {
  if (status === 'active') {
    return (
      <span className={cn(timelineStepMarkerVariants({ status }))}>
        <Spinner size="xs" color="secondary" />
      </span>
    );
  }

  return (
    <span className={cn(timelineStepMarkerVariants({ status }))}>
      {status === 'success' && <CircleCheck />}
      {status === 'error' && <CircleAlert />}
      {status === 'pending' && <Circle />}
    </span>
  );
};

TimelineStepMarker.displayName = 'TimelineStepMarker';

export { TimelineStepMarker, timelineStepMarkerVariants };
