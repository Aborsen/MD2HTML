import { createContext, useContext } from 'react';

export type SegmentedControlSize = 'sm' | 'md';
export type SegmentedControlVariant = 'default';
export type SegmentedControlRounded =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

type SegmentedControlContextValue = {
  size: SegmentedControlSize;
  variant: SegmentedControlVariant;
  rounded: SegmentedControlRounded;
};

const SegmentedControlContext =
  createContext<SegmentedControlContextValue | null>(null);

const useSegmentedControl = () => {
  const context = useContext(SegmentedControlContext);
  if (!context) {
    throw new Error(
      'SegmentedControl components must be used within a SegmentedControl root'
    );
  }
  return context;
};

export { SegmentedControlContext, useSegmentedControl };
