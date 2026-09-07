'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentProps, useMemo } from 'react';
import { TabsContext, type TabsSize } from './TabsContext';

export interface TabsProps extends ComponentProps<typeof TabsPrimitive.Root> {
  size?: TabsSize;
  className?: string;
}

/**
 * Underline tabs — the active tab is marked by a brand-coloured bottom
 * underline and highlight text (not a raised pill; that is SegmentedControl).
 */
const Tabs = ({ size = 'md', className, ...props }: TabsProps) => {
  const contextValue = useMemo(() => ({ size }), [size]);

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root className={className} {...props} />
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

export { Tabs };
