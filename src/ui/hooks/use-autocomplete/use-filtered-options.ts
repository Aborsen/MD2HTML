import { useMemo } from 'react';

interface UseFilteredOptionsArgs<T> {
  options: T[];
  value: T | T[] | null;
  inputValue: string;
  popupOpen: boolean;
  isMultipleSelect?: boolean;
  filterSelectedOptions?: boolean;
  getOptionLabel: (option: T) => string;
  filterOptions: (
    options: T[],
    state: { inputValue: string; getOptionLabel: (option: T) => string }
  ) => T[];
}

export const useFilteredOptions = <T extends { id: string }>({
  options,
  value,
  inputValue,
  popupOpen,
  isMultipleSelect = false,
  filterSelectedOptions = false,
  getOptionLabel,
  filterOptions,
}: UseFilteredOptionsArgs<T>) => {
  const filteredOptions = useMemo(() => {
    if (!popupOpen) return [];

    let availableOptions = options;

    if (filterSelectedOptions) {
      const selectedItems = (
        isMultipleSelect ? value : value ? [value] : []
      ) as T[];

      const selectedIds = new Set(selectedItems.map((item) => item.id));

      availableOptions = availableOptions.filter(
        (option) => !selectedIds.has(option.id)
      );
    }

    const isInputMatchingSelectedLabel =
      !isMultipleSelect &&
      value != null &&
      inputValue === getOptionLabel(value as T);

    const query = isInputMatchingSelectedLabel ? '' : inputValue;

    return filterOptions(availableOptions, {
      inputValue: query,
      getOptionLabel,
    });
  }, [
    popupOpen,
    options,
    filterSelectedOptions,
    isMultipleSelect,
    value,
    inputValue,
    filterOptions,
    getOptionLabel,
  ]);

  return {
    filteredOptions,
  };
};
