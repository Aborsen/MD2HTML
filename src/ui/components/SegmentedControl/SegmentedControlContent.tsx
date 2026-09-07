import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useSegmentedControl } from './SegmentedControlContext';

const segmentedControlContentVariants = cva(
  cn(
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card'
  ),
  {
    variants: {
      size: {
        sm: 'mt-2',
        md: 'mt-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const SegmentedControlContent = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) => {
  const { size } = useSegmentedControl();
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(segmentedControlContentVariants({ size }), className)}
      {...props}
    />
  );
};

SegmentedControlContent.displayName = TabsPrimitive.Content.displayName;

export { SegmentedControlContent, segmentedControlContentVariants };
