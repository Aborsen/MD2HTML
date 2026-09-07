import { createContext, type RefObject, useContext } from 'react';

type InputGroupSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type InputGroupVariant = 'outline';

const InputGroupContext = createContext<{
  size: InputGroupSize;
  variant: InputGroupVariant;
  inputRef: RefObject<HTMLInputElement | null> | null;
  isInvalid: boolean;
  errorText?: string;
  inputId?: string;
}>({
  size: 'md',
  variant: 'outline',
  inputRef: null,
  isInvalid: false,
  errorText: undefined,
  inputId: undefined,
});

const useInputGroup = () => {
  const context = useContext(InputGroupContext);
  if (!context) {
    throw new Error('useInputGroup must be used within a InputGroup');
  }
  return context;
};

export { InputGroupContext, useInputGroup };
