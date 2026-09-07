import { createContext, useContext } from 'react';

export type TabsSize = 'sm' | 'md';

type TabsContextValue = {
  size: TabsSize;
};

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs root');
  }
  return context;
};

export { TabsContext, useTabs };
