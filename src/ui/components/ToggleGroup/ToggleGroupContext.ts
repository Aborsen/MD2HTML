import { createContext, useContext } from 'react';
import type { ToggleRounded, ToggleSize, ToggleVariant } from '../Toggle';

type ToggleGroupContextValue = {
  variant: ToggleVariant;
  size: ToggleSize;
  rounded: ToggleRounded;
  scrollIntoGroup: boolean;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

const useToggleGroup = () => {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('ToggleGroupItem must be used within a ToggleGroup root');
  }
  return context;
};

export { ToggleGroupContext, useToggleGroup };
