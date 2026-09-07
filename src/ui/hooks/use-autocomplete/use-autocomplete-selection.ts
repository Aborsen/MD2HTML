import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  useCallback,
  useRef,
} from 'react';
import type {
  AutocompleteValue,
  ChangeDetails,
  ChangeReason,
  CloseReason,
} from './types';

interface UseAutocompleteSelectionArgs<
  T,
  Multiple extends boolean | undefined = false,
> {
  value: AutocompleteValue<T, Multiple>;
  isMultipleSelect: Multiple;
  isFreeSoloSelect?: boolean;
  disableCloseOnSelect?: boolean;
  blurOnSelect?: boolean | 'touch' | 'mouse';
  isOptionEqualToValue: (option: T, value: T) => boolean;
  getOptionLabel: (option: T) => string;
  setValue: (
    value: AutocompleteValue<T, Multiple>,
    reason: ChangeReason,
    event: MouseEvent | KeyboardEvent | FocusEvent | null,
    details?: ChangeDetails<T>
  ) => void;
  setInputValue: (
    value: string,
    reason: 'reset',
    event: MouseEvent | KeyboardEvent | FocusEvent | null
  ) => void;
  handleClose: (
    event: MouseEvent | KeyboardEvent | FocusEvent | null,
    reason: CloseReason
  ) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function useAutocompleteSelection<
  T,
  Multiple extends boolean | undefined = false,
>(args: UseAutocompleteSelectionArgs<T, Multiple>) {
  const {
    value,
    isMultipleSelect,
    disableCloseOnSelect = false,
    blurOnSelect = false,
    isOptionEqualToValue,
    getOptionLabel,
    setValue,
    setInputValue,
    handleClose,
    inputRef,
  } = args;

  const isTouchRef = useRef(false);

  const setIsTouch = useCallback((isTouch: boolean) => {
    isTouchRef.current = isTouch;
  }, []);

  const selectOption = useCallback(
    (
      event: MouseEvent | KeyboardEvent | FocusEvent,
      option: T,
      reason: ChangeReason = 'selectOption'
    ): void => {
      let newValue: AutocompleteValue<T, Multiple>;
      let finalReason = reason;

      if (isMultipleSelect) {
        const currentArray = value as T[];
        const existingIndex = currentArray.findIndex((v) =>
          isOptionEqualToValue(option, v)
        );

        if (existingIndex >= 0) {
          newValue = currentArray.filter(
            (_, i) => i !== existingIndex
          ) as AutocompleteValue<T, Multiple>;
          finalReason = 'removeOption';
        } else {
          newValue = [...currentArray, option] as AutocompleteValue<
            T,
            Multiple
          >;
        }
      } else {
        newValue = option as AutocompleteValue<T, Multiple>;
      }

      setValue(newValue, finalReason, event, { option });

      const shouldClearInput =
        isMultipleSelect || finalReason === 'removeOption';
      setInputValue(
        shouldClearInput ? '' : getOptionLabel(option),
        'reset',
        event
      );

      const isNavigationClick =
        (event as MouseEvent).ctrlKey || (event as MouseEvent).metaKey;
      if (!disableCloseOnSelect && !isNavigationClick) {
        const closeReason =
          finalReason === 'removeOption' ? 'removeOption' : 'selectOption';
        handleClose(event, closeReason as CloseReason);
      }

      const shouldBlur =
        blurOnSelect === true ||
        (blurOnSelect === 'touch' && isTouchRef.current) ||
        (blurOnSelect === 'mouse' && !isTouchRef.current);

      if (shouldBlur) {
        inputRef.current?.blur();
      }
    },
    [
      inputRef,
      isMultipleSelect,
      value,
      disableCloseOnSelect,
      blurOnSelect,
      isOptionEqualToValue,
      getOptionLabel,
      setValue,
      setInputValue,
      handleClose,
    ]
  );

  const isOptionSelected = useCallback(
    (option: T): boolean => {
      if (isMultipleSelect) {
        return (value as T[]).some((v) => isOptionEqualToValue(option, v));
      }
      return value != null && isOptionEqualToValue(option, value as T);
    },
    [isMultipleSelect, value, isOptionEqualToValue]
  );

  return {
    selectOption,
    isOptionSelected,
    setIsTouch,
  };
}
