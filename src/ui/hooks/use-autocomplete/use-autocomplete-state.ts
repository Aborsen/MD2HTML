// use-autocomplete-state.ts
import { type SyntheticEvent, useCallback, useState } from 'react';
import type {
  AutocompleteValue,
  ChangeDetails,
  ChangeReason,
  CloseReason,
  InputChangeReason,
} from './types';

export interface UseAutocompleteStateArgs<
  T,
  Multiple extends boolean | undefined = false,
> {
  value?: AutocompleteValue<T, Multiple>;
  inputValue?: string;
  open?: boolean;
  defaultValue?: AutocompleteValue<T, Multiple>;
  defaultInputValue?: string;
  isMultipleSelect: Multiple;
  readOnly?: boolean;
  onChange?: (
    event: SyntheticEvent | null,
    value: AutocompleteValue<T, Multiple>,
    reason: ChangeReason,
    details?: ChangeDetails<T>
  ) => void;
  onInputChange?: (
    event: SyntheticEvent | null,
    value: string,
    reason: InputChangeReason
  ) => void;
  onOpen?: (event: SyntheticEvent) => void;
  onClose?: (event: SyntheticEvent, reason: CloseReason) => void;
}

export interface UseAutocompleteStateReturn<
  T,
  Multiple extends boolean | undefined,
> {
  value: AutocompleteValue<T, Multiple>;
  inputValue: string;
  open: boolean;
  popupOpen: boolean;
  setValue: (
    value: AutocompleteValue<T, Multiple>,
    reason: ChangeReason,
    event?: SyntheticEvent | null,
    details?: ChangeDetails<T>
  ) => void;
  setInputValue: (
    value: string,
    reason: InputChangeReason,
    event?: SyntheticEvent | null
  ) => void;
  setOpen: (
    open: boolean,
    event?: SyntheticEvent | null,
    reason?: CloseReason
  ) => void;
}

export function useAutocompleteState<
  T,
  Multiple extends boolean | undefined = false,
>(
  args: UseAutocompleteStateArgs<T, Multiple>
): UseAutocompleteStateReturn<T, Multiple> {
  const {
    value: valueProp,
    inputValue: inputValueProp,
    open: openProp,
    defaultValue,
    defaultInputValue = '',
    isMultipleSelect,
    readOnly = false,
    onChange,
    onInputChange,
    onOpen,
    onClose,
  } = args;

  const isValueControlled = valueProp !== undefined;
  const isInputControlled = inputValueProp !== undefined;
  const isOpenControlled = openProp !== undefined;

  const [valueState, setValueState] = useState<AutocompleteValue<T, Multiple>>(
    () =>
      defaultValue ??
      ((isMultipleSelect ? [] : null) as AutocompleteValue<T, Multiple>)
  );
  const [inputValueState, setInputValueState] = useState(defaultInputValue);
  const [openState, setOpenState] = useState(false);

  const value = (
    isValueControlled ? valueProp : valueState
  ) as AutocompleteValue<T, Multiple>;
  const inputValue = isInputControlled ? inputValueProp : inputValueState;
  const open = isOpenControlled ? openProp : openState;
  const popupOpen = open && !readOnly;

  const setValue = useCallback(
    (
      newValue: AutocompleteValue<T, Multiple>,
      reason: ChangeReason,
      event: SyntheticEvent | null = null,
      details?: ChangeDetails<T>
    ): void => {
      if (!isValueControlled) {
        setValueState(newValue);
      }
      onChange?.(event, newValue, reason, details);
    },
    [isValueControlled, onChange]
  );

  const setInputValue = useCallback(
    (
      newValue: string,
      reason: InputChangeReason,
      event: SyntheticEvent | null = null
    ): void => {
      if (!isInputControlled) {
        setInputValueState(newValue);
      }
      onInputChange?.(event, newValue, reason);
    },
    [isInputControlled, onInputChange]
  );

  const setOpen = useCallback(
    (
      newOpen: boolean,
      event?: SyntheticEvent | null,
      reason?: CloseReason
    ): void => {
      if (newOpen === open) return;

      if (!isOpenControlled) {
        setOpenState(newOpen);
      }

      if (newOpen && event) {
        onOpen?.(event);
      } else if (reason && event) {
        onClose?.(event, reason);
      }
    },
    [open, isOpenControlled, onOpen, onClose]
  );

  return {
    value,
    inputValue,
    open,
    popupOpen,
    setValue,
    setInputValue,
    setOpen,
  };
}
