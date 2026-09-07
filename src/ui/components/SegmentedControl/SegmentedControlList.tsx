import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useSegmentedControl } from './SegmentedControlContext';

// Recessed "slot" container — sits on a Surface/Card so the selected pill
// (Surface/Card light / Chips dark) elevates out of the Card 2 track.
const segmentedControlListVariants = cva(
  cn('inline-flex items-center gap-1 p-0.5'),
  {
    variants: {
      variant: {
        default: 'border border-stroke bg-surface-card2',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      rounded: 'md',
    },
  }
);

const SegmentedControlList = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) => {
  const { variant, rounded } = useSegmentedControl();
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        segmentedControlListVariants({ variant, rounded }),
        className
      )}
      {...props}
    />
  );
};

SegmentedControlList.displayName = TabsPrimitive.List.displayName;

export { SegmentedControlList, segmentedControlListVariants };
