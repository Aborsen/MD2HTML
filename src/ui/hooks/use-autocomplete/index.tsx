import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NO_HIGHLIGHT } from './constants';
import { createPropGetters } from './prop-getters';
import type {
  AutocompleteValue,
  ChangeDetails,
  ChangeReason,
  CloseReason,
  FilterOptionsState,
  UseAutocompleteArgs,
} from './types';
import { useAutocompleteKeyboard } from './use-autocomplete-keyboard';
import { useAutocompleteSelection } from './use-autocomplete-selection';
import { useAutocompleteState } from './use-autocomplete-state';
import { useBadgeNavigation } from './use-badge-navigation';
import { useFilteredOptions } from './use-filtered-options';
import { useGroupedOptions } from './use-grouped-options';
import { useHighlightIndex } from './use-highlight-index';
import { defaultFilterOptions, defaultGetOptionLabel } from './utils';

export function useAutocomplete<
  T extends { id: string },
  Multiple extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(props: UseAutocompleteArgs<T, Multiple, FreeSolo>) {
  const {
    id: idProp,
    value: valueProp,
    inputValue: inputValueProp,
    open: openProp,
    defaultValue,
    defaultInputValue,
    options,
    isMultipleSelect = false as Multiple,
    isFreeSoloSelect = false as FreeSolo,
    openOnFocus = false,
    autoHighlight = false,
    autoSelect = false,
    autoComplete = false,
    clearOnBlur = !isFreeSoloSelect,
    clearOnEscape = false,
    selectOnFocus = !isFreeSoloSelect,
    blurOnSelect = false,
    disableClearable = false,
    disableCloseOnSelect = false,
    disableListWrap = false,
    includeInputInList = false,
    handleHomeEndKeys = !isFreeSoloSelect,
    disabled = false,
    readOnly = false,
    filterSelectedOptions = false,
    onChange,
    onInputChange,
    onOpen,
    onClose,
    onHighlightChange,
    getOptionKey,
    getOptionLabel: getOptionLabelProp,
    isOptionEqualToValue = (opt: T, val: T) => opt === val,
    filterOptions = defaultFilterOptions as (
      options: T[],
      state: FilterOptionsState<T>
    ) => T[],
    getOptionDisabled,
    groupBy,
  } = props;

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const getOptionLabel = getOptionLabelProp ?? defaultGetOptionLabel;

  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const ignoreFocusRef = useRef(false);
  const firstFocusRef = useRef(true);

  const [focused, setFocused] = useState(false);

  const {
    value,
    inputValue,
    open,
    popupOpen,
    setValue,
    setInputValue,
    setOpen,
  } = useAutocompleteState<T, Multiple>({
    value: valueProp,
    inputValue: inputValueProp,
    open: openProp,
    defaultValue,
    defaultInputValue,
    isMultipleSelect: isMultipleSelect as Multiple,
    readOnly,
    onChange,
    onInputChange,
    onOpen,
    onClose,
  });

  const { filteredOptions } = useFilteredOptions<T>({
    options: options as T[],
    value,
    inputValue,
    popupOpen,
    isMultipleSelect: isMultipleSelect as Multiple,
    filterSelectedOptions,
    getOptionLabel,
    filterOptions,
  });

  const { groupedOptions } = useGroupedOptions<T>({ filteredOptions, groupBy });

  const highlight = useHighlightIndex<T>({
    id,
    filteredOptions,
    inputRef,
    listboxRef,
    popupOpen,
    autoHighlight,
    disableListWrap,
    includeInputInList,
    getOptionDisabled,
    groupBy,
    onHighlightChange,
  });

  const badges = useBadgeNavigation<T, Multiple>({
    value,
    isMultipleSelect: isMultipleSelect as Multiple,
    readOnly,
    inputValue,
    setValue: (
      newValue: AutocompleteValue<T, Multiple>,
      reason: 'removeOption',
      event: SyntheticEvent | null,
      details: ChangeDetails<T>
    ) => setValue(newValue, reason, event, details),
  });

  const handleOpen = useCallback(
    (event: SyntheticEvent): void => {
      if (open || disabled || readOnly) return;
      setOpen(true, event);
    },
    [open, disabled, readOnly, setOpen]
  );

  const handleClose = useCallback(
    (event: SyntheticEvent | null, reason: CloseReason): void => {
      if (!open) return;
      setOpen(false, event, reason);
    },
    [open, setOpen]
  );

  const selection = useAutocompleteSelection<T, Multiple>({
    value,
    isMultipleSelect: isMultipleSelect as Multiple,
    disableCloseOnSelect,
    blurOnSelect,
    isOptionEqualToValue,
    getOptionLabel,
    setValue,
    setInputValue,
    handleClose,
    inputRef,
  });

  const isDirty = useMemo(() => {
    if (isFreeSoloSelect && inputValue.length > 0) return true;
    return isMultipleSelect ? (value as T[]).length > 0 : value !== null;
  }, [isFreeSoloSelect, inputValue, isMultipleSelect, value]);

  const handleClear = useCallback(
    (event: SyntheticEvent): void => {
      ignoreFocusRef.current = true;
      const emptyValue = (isMultipleSelect ? [] : null) as AutocompleteValue<
        T,
        Multiple
      >;
      setInputValue('', 'clear', event);
      setValue(emptyValue, 'clear', event);
    },
    [isMultipleSelect, setInputValue, setValue]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const newValue = event.target.value;

      if (inputValue !== newValue) {
        setInputValue(newValue, 'input', event);
      }

      if (newValue === '') {
        if (!disableClearable && !isMultipleSelect) {
          setValue(null as AutocompleteValue<T, Multiple>, 'clear', event);
        }
      } else {
        handleOpen(event);
      }
    },
    [
      inputValue,
      disableClearable,
      isMultipleSelect,
      setInputValue,
      setValue,
      handleOpen,
    ]
  );

  const handleInputFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>): void => {
      setFocused(true);
      badges.clearFocus();

      if (openOnFocus && !ignoreFocusRef.current) {
        handleOpen(event);
      }

      if (selectOnFocus && firstFocusRef.current) {
        inputRef.current?.select();
      }

      firstFocusRef.current = false;
    },
    [openOnFocus, selectOnFocus, handleOpen, badges]
  );

  const handleInputBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>): void => {
      if (
        event.relatedTarget &&
        (listboxRef.current?.contains(event.relatedTarget as Node) ||
          inputRef.current?.contains(event.relatedTarget as Node))
      ) {
        inputRef.current?.focus();
        return;
      }

      setFocused(false);
      firstFocusRef.current = true;
      ignoreFocusRef.current = false;

      const highlightedOption = filteredOptions[highlight.indexRef.current];

      if (autoSelect && popupOpen && highlightedOption) {
        selection.selectOption(
          event,
          highlightedOption,
          'blur' as ChangeReason
        );
      } else if (isFreeSoloSelect && inputValue !== '' && !isMultipleSelect) {
        selection.selectOption(
          event,
          inputValue as unknown as T,
          'createOption'
        );
      } else if (clearOnBlur) {
        const resetValue =
          !isMultipleSelect && value ? getOptionLabel(value as T) : '';
        setInputValue(resetValue, 'reset', event);
      }

      handleClose(event, 'blur');
    },
    [
      autoSelect,
      popupOpen,
      filteredOptions,
      isFreeSoloSelect,
      inputValue,
      isMultipleSelect,
      clearOnBlur,
      value,
      getOptionLabel,
      highlight.indexRef,
      selection,
      setInputValue,
      handleClose,
    ]
  );

  const { handleKeyDown } = useAutocompleteKeyboard<T>({
    popupOpen,
    inputValue,
    filteredOptions,
    highlightedIndexRef: highlight.indexRef,
    handleHomeEndKeys,
    clearOnEscape,
    autoComplete,
    isFreeSoloSelect: isFreeSoloSelect as boolean,
    isMultipleSelect: isMultipleSelect as boolean,
    handleOpen: (event: KeyboardEvent<HTMLInputElement>) => handleOpen(event),
    handleClose: (
      event: KeyboardEvent<HTMLInputElement>,
      reason: 'escape' | 'toggleInput'
    ) => handleClose(event, reason),
    handleClear: (event: KeyboardEvent<HTMLInputElement>) => handleClear(event),
    selectOption: (
      event: KeyboardEvent<HTMLInputElement>,
      option: T,
      reason?: ChangeReason
    ) => selection.selectOption(event, option, reason),
    getOptionDisabled,
    moveHighlight: highlight.move,
    hasBadges: badges.hasBadges,
    canNavigateBadges: badges.canNavigate,
    navigateBadgeLeft: badges.navigateLeft,
    navigateBadgeRight: badges.navigateRight,
    removeLastOrFocusedBadge: (event: KeyboardEvent<HTMLInputElement>) =>
      badges.removeLastOrFocused(event),
    inputRef,
  });

  const setListboxNode = useCallback((node: HTMLDivElement | null) => {
    listboxRef.current = node;
    if (!node) return;

    const stopPropagation = (event: Event) => event.stopPropagation();
    node.addEventListener('wheel', stopPropagation);
    node.addEventListener('touchmove', stopPropagation);

    return () => {
      listboxRef.current = null;
      node.removeEventListener('wheel', stopPropagation);
      node.removeEventListener('touchmove', stopPropagation);
    };
  }, []);

  // Prop getters
  const propGetters = useMemo(
    () =>
      createPropGetters<T>({
        id,
        inputValue,
        open,
        popupOpen,
        disabled,
        readOnly,
        autoComplete,
        focusedBadge: badges.focusedBadge,
        highlightedIndexRef: highlight.indexRef,
        inputRef,
        listboxRef,
        setListboxNode,
        handleOpen: (event: MouseEvent) => handleOpen(event),
        handleClose: (event: MouseEvent, reason: 'toggleInput') =>
          handleClose(event, reason),
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        handleKeyDown,
        handleClear: (event: MouseEvent) => handleClear(event),
        selectOption: (event: MouseEvent, option: T) =>
          selection.selectOption(event, option),
        setHighlightedIndex: highlight.set,
        removeBadge: (index: number, event: SyntheticEvent) =>
          badges.remove(index, event),
        getOptionKey,
        getOptionLabel,
        getOptionDisabled,
        isOptionSelected: selection.isOptionSelected,
      }),
    [
      id,
      inputValue,
      open,
      popupOpen,
      disabled,
      readOnly,
      autoComplete,
      badges.focusedBadge,
      badges.remove,
      highlight.indexRef,
      highlight.set,
      setListboxNode,
      handleOpen,
      handleClose,
      handleInputChange,
      handleInputFocus,
      handleInputBlur,
      handleKeyDown,
      handleClear,
      selection.selectOption,
      selection.isOptionSelected,
      getOptionKey,
      getOptionLabel,
      getOptionDisabled,
    ]
  );

  // Effects
  useEffect(() => {
    if (filteredOptions.length === 0) {
      if (highlight.indexRef.current !== NO_HIGHLIGHT) {
        highlight.reset();
      }
      return;
    }

    if (popupOpen) {
      highlight.initializeHighlight();

      if (highlight.indexRef.current >= filteredOptions.length) {
        highlight.set(filteredOptions.length - 1);
      }
    }
  }, [popupOpen, filteredOptions.length, highlight]);

  useEffect(() => {
    if (focused) return;

    if (!isMultipleSelect && value != null && !isFreeSoloSelect) {
      setInputValue(getOptionLabel(value as T), 'reset');
    }
  }, [
    value,
    focused,
    isMultipleSelect,
    isFreeSoloSelect,
    getOptionLabel,
    setInputValue,
  ]);

  return {
    // Identifiers
    id,

    // State
    value,
    inputValue,
    open: popupOpen,
    focused,
    focusedBadge: badges.focusedBadge,
    isDirty,
    disabled,
    readOnly,

    // Options
    filteredOptions,
    groupedOptions,

    // Refs
    inputRef,
    listboxRef,

    // Prop getters
    ...propGetters,
    getOptionLabel,

    // Actions
    setOpen,
    setInputValue,
    setValue,
    selectOption: selection.selectOption,
    removeBadge: badges.remove,
    handleClear,
  };
}
