import { type KeyboardEvent, type RefObject, useCallback } from 'react';

interface UseAutocompleteKeyboardArgs<T> {
  popupOpen: boolean;
  inputValue: string;
  filteredOptions: T[];
  highlightedIndexRef: RefObject<number>;

  handleHomeEndKeys?: boolean;
  clearOnEscape?: boolean;
  autoComplete?: boolean;
  isFreeSoloSelect?: boolean;
  isMultipleSelect?: boolean;

  handleOpen: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleClose: (
    event: KeyboardEvent<HTMLInputElement>,
    reason: 'escape' | 'toggleInput'
  ) => void;
  handleClear: (event: KeyboardEvent<HTMLInputElement>) => void;
  selectOption: (
    event: KeyboardEvent<HTMLInputElement>,
    option: T,
    reason?: 'selectOption' | 'createOption'
  ) => void;
  getOptionDisabled?: (option: T) => boolean;

  moveHighlight: (
    direction: 'next' | 'previous',
    step?: number | 'start' | 'end' | 'page',
    reason?: 'keyboard',
    event?: KeyboardEvent<HTMLInputElement> | null
  ) => void;

  hasBadges: boolean;
  canNavigateBadges: boolean;
  navigateBadgeLeft: () => void;
  navigateBadgeRight: () => boolean;
  removeLastOrFocusedBadge: (event: KeyboardEvent<HTMLInputElement>) => void;

  inputRef: RefObject<HTMLInputElement | null>;
}

interface KeyHandlerContext<T> {
  event: KeyboardEvent<HTMLInputElement>;
  args: UseAutocompleteKeyboardArgs<T>;
}

type KeyHandler<T> = (context: KeyHandlerContext<T>) => void;

function createKeyHandlers<T>(): Record<
  KeyboardEvent<HTMLInputElement>['key'],
  KeyHandler<T>
> {
  return {
    Home: ({
      event,
      args: { popupOpen, handleHomeEndKeys, moveHighlight },
    }) => {
      if (popupOpen && handleHomeEndKeys) {
        event.preventDefault();
        moveHighlight('next', 'start', 'keyboard', event);
      }
    },

    End: ({ event, args: { popupOpen, handleHomeEndKeys, moveHighlight } }) => {
      if (popupOpen && handleHomeEndKeys) {
        event.preventDefault();
        moveHighlight('previous', 'end', 'keyboard', event);
      }
    },

    PageUp: ({ event, args: { moveHighlight, handleOpen } }) => {
      event.preventDefault();
      moveHighlight('previous', 'page', 'keyboard', event);
      handleOpen(event);
    },

    PageDown: ({ event, args: { moveHighlight, handleOpen } }) => {
      event.preventDefault();
      moveHighlight('next', 'page', 'keyboard', event);
      handleOpen(event);
    },

    ArrowDown: ({ event, args: { moveHighlight, handleOpen } }) => {
      event.preventDefault();
      moveHighlight('next', 1, 'keyboard', event);
      handleOpen(event);
    },

    ArrowUp: ({ event, args: { moveHighlight, handleOpen } }) => {
      event.preventDefault();
      moveHighlight('previous', 1, 'keyboard', event);
      handleOpen(event);
    },

    Enter: ({
      event,
      args: {
        filteredOptions,
        popupOpen,
        autoComplete,
        inputValue,
        inputRef,
        isFreeSoloSelect,
        isMultipleSelect,
        highlightedIndexRef,
        getOptionDisabled,
        selectOption,
      },
    }) => {
      const highlightedOption =
        filteredOptions[highlightedIndexRef.current ?? -1];

      if (popupOpen && highlightedOption) {
        event.preventDefault();
        if (!getOptionDisabled?.(highlightedOption)) {
          selectOption(event, highlightedOption);

          if (autoComplete && inputRef.current) {
            const len = inputRef.current.value.length;
            inputRef.current.setSelectionRange(len, len);
          }
        }
      } else if (isFreeSoloSelect && inputValue !== '' && !isMultipleSelect) {
        selectOption(event, inputValue as unknown as T, 'createOption');
      }
    },

    Escape: ({
      event,
      args: {
        handleClose,
        popupOpen,
        clearOnEscape,
        inputValue,
        hasBadges,
        handleClear,
      },
    }) => {
      if (popupOpen) {
        event.preventDefault();
        event.stopPropagation();
        handleClose(event, 'escape');
      } else if (clearOnEscape && (inputValue !== '' || hasBadges)) {
        event.preventDefault();
        event.stopPropagation();
        handleClear(event);
      }
    },

    Backspace: ({
      event,
      args: { canNavigateBadges, removeLastOrFocusedBadge },
    }) => {
      if (canNavigateBadges) {
        removeLastOrFocusedBadge(event);
      }
    },

    ArrowLeft: ({
      args: { inputRef, canNavigateBadges, navigateBadgeLeft },
    }) => {
      const input = inputRef.current;
      const atInputStart =
        input?.selectionStart === 0 && input?.selectionEnd === 0;

      if (canNavigateBadges && atInputStart) {
        navigateBadgeLeft();
      }
    },

    ArrowRight: ({ args: { inputRef, navigateBadgeRight } }) => {
      const shouldFocusInput = navigateBadgeRight();
      if (shouldFocusInput) {
        inputRef.current?.focus();
      }
    },
  };
}

export function useAutocompleteKeyboard<T>(
  args: UseAutocompleteKeyboardArgs<T>
) {
  const keyHandlers = createKeyHandlers<T>();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => {
      if (event.defaultPrevented) return;

      const handler = keyHandlers[event.key];
      handler?.({ event, args });
    },
    [args, keyHandlers]
  );

  return { handleKeyDown };
}
