'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const TabsList = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      // Shared bottom edge the active tab's underline overlaps (-mb-px on trigger).
      className={cn(
        'inline-flex items-center gap-2 border-stroke border-b',
        className
      )}
      {...props}
    />
  );
};

TabsList.displayName = TabsPrimitive.List.displayName;

export { TabsList };
