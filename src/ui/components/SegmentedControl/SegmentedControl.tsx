import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentProps, useMemo } from 'react';
import {
  SegmentedControlContext,
  type SegmentedControlRounded,
  type SegmentedControlSize,
  type SegmentedControlVariant,
} from './SegmentedControlContext';

export interface SegmentedControlProps
  extends ComponentProps<typeof TabsPrimitive.Root> {
  size?: SegmentedControlSize;
  variant?: SegmentedControlVariant;
  rounded?: SegmentedControlRounded;
  className?: string;
}

const SegmentedControl = ({
  size = 'md',
  variant = 'default',
  rounded = 'md',
  className,
  ...props
}: SegmentedControlProps) => {
  const contextValue = useMemo(
    () => ({ size, variant, rounded }),
    [size, variant, rounded]
  );

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <TabsPrimitive.Root className={className} {...props} />
    </SegmentedControlContext.Provider>
  );
};

SegmentedControl.displayName = 'SegmentedControl';

export { SegmentedControl };
