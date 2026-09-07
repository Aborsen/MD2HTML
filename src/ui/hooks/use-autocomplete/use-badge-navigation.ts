import { type SyntheticEvent, useCallback, useState } from 'react';
import { NO_FOCUSED_BADGE } from './constants';
import type { AutocompleteValue, ChangeDetails } from './types';

interface UseBadgeNavigationArgs<T, Multiple extends boolean | undefined> {
  value: AutocompleteValue<T, Multiple>;
  isMultipleSelect: Multiple;
  readOnly?: boolean;
  inputValue: string;
  setValue: (
    value: AutocompleteValue<T, Multiple>,
    reason: 'removeOption',
    event: SyntheticEvent | null,
    details: ChangeDetails<T>
  ) => void;
}

export function useBadgeNavigation<T, Multiple extends boolean | undefined>(
  args: UseBadgeNavigationArgs<T, Multiple>
) {
  const {
    value,
    isMultipleSelect,
    readOnly = false,
    inputValue,
    setValue,
  } = args;

  const [focusedBadge, setFocusedBadge] = useState(NO_FOCUSED_BADGE);

  const badges = isMultipleSelect ? (value as T[]) : [];
  const hasBadges = badges.length > 0;
  const canNavigate = hasBadges && inputValue === '';

  const remove = useCallback(
    (index: number, event: SyntheticEvent): void => {
      if (!isMultipleSelect || readOnly) return;

      const currentOptions = value as T[];
      const optionToRemove = currentOptions[index];
      const newOptions = currentOptions.filter((_, i) => i !== index);

      setValue(
        newOptions as AutocompleteValue<T, Multiple>,
        'removeOption',
        event,
        { option: optionToRemove }
      );

      setFocusedBadge(NO_FOCUSED_BADGE);
    },
    [isMultipleSelect, readOnly, value, setValue]
  );

  const navigateLeft = useCallback(() => {
    if (!canNavigate) return;

    const lastIndex = badges.length - 1;
    setFocusedBadge((prev) => (prev <= 0 ? lastIndex : prev - 1));
  }, [canNavigate, badges.length]);

  const navigateRight = useCallback((): boolean => {
    if (!isMultipleSelect || focusedBadge === NO_FOCUSED_BADGE) return false;

    const lastIndex = badges.length - 1;
    const nextIndex =
      focusedBadge >= lastIndex ? NO_FOCUSED_BADGE : focusedBadge + 1;

    setFocusedBadge(nextIndex);
    return nextIndex === NO_FOCUSED_BADGE;
  }, [isMultipleSelect, focusedBadge, badges.length]);

  const removeLastOrFocused = useCallback(
    (event: SyntheticEvent): void => {
      if (!canNavigate) return;

      const indexToRemove =
        focusedBadge >= 0 ? focusedBadge : badges.length - 1;
      remove(indexToRemove, event);
    },
    [canNavigate, focusedBadge, badges.length, remove]
  );

  const clearFocus = useCallback(() => {
    setFocusedBadge(NO_FOCUSED_BADGE);
  }, []);

  return {
    focusedBadge,
    hasBadges,
    canNavigate,
    setFocusedBadge,
    remove,
    navigateLeft,
    navigateRight,
    removeLastOrFocused,
    clearFocus,
  };
}
