import {
  type RefObject,
  type SyntheticEvent,
  useCallback,
  useRef,
} from 'react';
import { DEFAULT_PAGE_SIZE, NO_HIGHLIGHT } from './constants';
import type { HighlightReason } from './types';
import { scrollOptionIntoView, updateHighlightClass } from './utils';

export interface UseHighlightIndexArgs<T> {
  id: string;
  filteredOptions: T[];
  inputRef: RefObject<HTMLInputElement | null>;
  listboxRef: RefObject<HTMLDivElement | null>;
  popupOpen: boolean;
  autoHighlight?: boolean;
  disableListWrap?: boolean;
  includeInputInList?: boolean;
  getOptionDisabled?: (option: T) => boolean;
  groupBy?: (option: T) => string;
  onHighlightChange?: (
    event: SyntheticEvent | null,
    option: T | null,
    reason: HighlightReason
  ) => void;
}

export interface UseHighlightIndexReturn {
  index: number;
  indexRef: RefObject<number>;
  set: (
    index: number,
    reason?: HighlightReason,
    event?: SyntheticEvent | null
  ) => void;
  reset: () => void;
  move: (
    direction: 'next' | 'previous',
    step?: number | 'start' | 'end' | 'page',
    reason?: HighlightReason,
    event?: SyntheticEvent | null
  ) => void;
  findValidIndex: (
    startIndex: number,
    direction: 'next' | 'previous'
  ) => number;
  initializeHighlight: () => void;
}

export function useHighlightIndex<T>(
  args: UseHighlightIndexArgs<T>
): UseHighlightIndexReturn {
  const {
    id,
    filteredOptions,
    inputRef,
    listboxRef,
    popupOpen,
    autoHighlight = false,
    disableListWrap = false,
    includeInputInList = false,
    getOptionDisabled,
    groupBy,
    onHighlightChange,
  } = args;

  const indexRef = useRef<number>(NO_HIGHLIGHT);

  const findValidIndex = useCallback(
    (startIndex: number, direction: 'next' | 'previous'): number => {
      if (filteredOptions.length === 0) return NO_HIGHLIGHT;

      const step = direction === 'next' ? 1 : -1;
      let index = startIndex;

      for (let i = 0; i < filteredOptions.length; i++) {
        if (index < 0 || index >= filteredOptions.length) {
          if (disableListWrap) return NO_HIGHLIGHT;
          index = index < 0 ? filteredOptions.length - 1 : 0;
        }

        const option = filteredOptions[index];
        if (option && !getOptionDisabled?.(option)) {
          return index;
        }

        index += step;
      }

      return NO_HIGHLIGHT;
    },
    [filteredOptions, disableListWrap, getOptionDisabled]
  );

  const set = useCallback(
    (
      index: number,
      reason: HighlightReason = 'auto',
      event: SyntheticEvent | null = null
    ): void => {
      indexRef.current = index;

      if (index === NO_HIGHLIGHT) {
        inputRef.current?.removeAttribute('aria-activedescendant');
      } else {
        inputRef.current?.setAttribute(
          'aria-activedescendant',
          `${id}-option-${index}`
        );
      }

      const option =
        index === NO_HIGHLIGHT ? null : (filteredOptions[index] ?? null);
      onHighlightChange?.(event, option, reason);

      if (listboxRef.current) {
        updateHighlightClass(listboxRef.current, index);
        scrollOptionIntoView(listboxRef.current, index, reason, groupBy);
      }
    },
    [id, filteredOptions, inputRef, listboxRef, groupBy, onHighlightChange]
  );

  const reset = useCallback(() => {
    set(NO_HIGHLIGHT);
  }, [set]);

  const move = useCallback(
    (
      direction: 'next' | 'previous',
      step: number | 'start' | 'end' | 'page' = 1,
      reason: HighlightReason = 'keyboard',
      event: SyntheticEvent | null = null
    ): void => {
      if (!popupOpen) return;

      const total = filteredOptions.length;
      if (total === 0) return;

      let nextIndex: number;

      if (step === 'start') {
        nextIndex = 0;
      } else if (step === 'end') {
        nextIndex = total - 1;
      } else if (step === 'page') {
        const pageStep =
          direction === 'next' ? DEFAULT_PAGE_SIZE : -DEFAULT_PAGE_SIZE;
        nextIndex = Math.max(
          0,
          Math.min(total - 1, indexRef.current + pageStep)
        );
      } else {
        const numericStep = direction === 'next' ? step : -step;
        nextIndex = indexRef.current + numericStep;

        if (nextIndex < 0) {
          nextIndex = disableListWrap ? 0 : total - 1;
        } else if (nextIndex >= total) {
          nextIndex = disableListWrap ? total - 1 : 0;
        }
      }

      if (includeInputInList && nextIndex === NO_HIGHLIGHT) {
        set(NO_HIGHLIGHT, reason, event);
        return;
      }

      const validIndex = findValidIndex(nextIndex, direction);
      set(validIndex, reason, event);
    },
    [
      popupOpen,
      filteredOptions.length,
      disableListWrap,
      includeInputInList,
      findValidIndex,
      set,
    ]
  );

  const initializeHighlight = useCallback(() => {
    if (autoHighlight && indexRef.current === NO_HIGHLIGHT) {
      const firstValid = findValidIndex(0, 'next');
      set(firstValid, 'auto');
    }
  }, [autoHighlight, findValidIndex, set]);

  return {
    index: indexRef.current,
    indexRef,
    set,
    reset,
    move,
    findValidIndex,
    initializeHighlight,
  };
}
