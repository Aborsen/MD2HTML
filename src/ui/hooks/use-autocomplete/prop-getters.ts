import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  RefCallback,
  RefObject,
} from 'react';
import type {
  GetBadgeProps,
  GetClearProps,
  GetInputLabelProps,
  GetInputProps,
  GetListboxProps,
  GetOptionProps,
  GetPopupIndicatorProps,
  GetRootProps,
} from './types';

interface PropGetterDeps<T> {
  id: string;
  inputValue: string;
  open: boolean;
  popupOpen: boolean;
  disabled: boolean;
  readOnly: boolean;
  autoComplete: boolean;
  focusedBadge: number;
  highlightedIndexRef: RefObject<number>;
  inputRef: RefObject<HTMLInputElement | null>;
  listboxRef: RefObject<HTMLDivElement | null>;
  setListboxNode: RefCallback<HTMLDivElement>;

  handleOpen: (event: MouseEvent) => void;
  handleClose: (event: MouseEvent, reason: 'toggleInput') => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: (event: FocusEvent<HTMLInputElement>) => void;
  handleInputBlur: (event: FocusEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleClear: (event: MouseEvent) => void;
  selectOption: (event: MouseEvent, option: T) => void;
  setHighlightedIndex: (
    index: number,
    reason: 'mouse' | 'touch',
    event: MouseEvent | React.TouchEvent
  ) => void;
  removeBadge: (index: number, event: MouseEvent) => void;

  getOptionKey?: (option: T) => string;
  getOptionLabel: (option: T) => string;
  getOptionDisabled?: (option: T) => boolean;
  isOptionSelected: (option: T) => boolean;
}

export function createPropGetters<T>(deps: PropGetterDeps<T>) {
  const getRootProps: GetRootProps = () => ({
    onClick: () => deps.inputRef.current?.focus(),
    onMouseDown: (e: MouseEvent) => {
      if (e.target !== deps.inputRef.current) {
        e.preventDefault();
      }
    },
  });

  const getInputProps: GetInputProps = () => ({
    id: deps.id,
    ref: deps.inputRef,
    value: deps.inputValue,
    disabled: deps.disabled,
    readOnly: deps.readOnly,
    autoComplete: 'off',
    autoCapitalize: 'none',
    spellCheck: false,
    role: 'combobox',
    'aria-autocomplete': deps.autoComplete ? 'both' : 'list',
    'aria-expanded': deps.popupOpen,
    'aria-controls': deps.popupOpen ? `${deps.id}-listbox` : undefined,
    'aria-haspopup': 'listbox',
    onChange: deps.handleInputChange,
    onFocus: deps.handleInputFocus,
    onBlur: deps.handleInputBlur,
    onKeyDown: deps.handleKeyDown,
    onMouseDown: (e: MouseEvent) => {
      if (!deps.disabled && (deps.inputValue === '' || !deps.open)) {
        if (deps.open) {
          deps.handleClose(e, 'toggleInput');
        } else {
          deps.handleOpen(e);
        }
      }
    },
  });

  const getInputLabelProps: GetInputLabelProps = () => ({
    id: `${deps.id}-label`,
    htmlFor: deps.id,
  });

  const getListboxProps: GetListboxProps = () => ({
    id: `${deps.id}-listbox`,
    ref: deps.setListboxNode,
    role: 'listbox',
    'aria-labelledby': `${deps.id}-label`,
    onMouseDown: (e: MouseEvent) => {
      if (e.target === e.currentTarget) return;
      e.preventDefault();
    },
  });

  const getOptionProps: GetOptionProps<T> = ({ option, index }) => {
    const disabled = deps.getOptionDisabled?.(option) ?? false;
    const selected = deps.isOptionSelected(option);

    return {
      key: deps.getOptionKey?.(option) ?? deps.getOptionLabel(option),
      id: `${deps.id}-option-${index}`,
      role: 'option',
      'data-option-index': index,
      'data-highlighted':
        deps.highlightedIndexRef.current === index || undefined,
      'aria-selected': selected,
      'aria-disabled': disabled,
      onClick: (e: MouseEvent) => {
        if (!disabled) deps.selectOption(e, option);
      },
      onMouseMove: (e: MouseEvent) => {
        if (deps.highlightedIndexRef.current !== index) {
          deps.setHighlightedIndex(index, 'mouse', e);
        }
      },
      onTouchStart: (e: React.TouchEvent) => {
        deps.setHighlightedIndex(index, 'touch', e);
      },
    };
  };

  const getBadgeProps: GetBadgeProps = ({ index }) => ({
    key: index,
    tabIndex: -1,
    'data-badge-index': index,
    'data-focused': deps.focusedBadge === index,
    onDelete: (e) => deps.removeBadge(index, e as MouseEvent),
  });

  const getClearProps: GetClearProps = () => ({
    type: 'button',
    tabIndex: -1,
    'aria-label': 'Clear',
    onPointerDown: (e) => {
      e.stopPropagation();
      e.preventDefault();
      deps.handleClear(e);
    },
  });

  const getPopupIndicatorProps: GetPopupIndicatorProps = () => ({
    type: 'button',
    tabIndex: -1,
    'aria-label': deps.open ? 'Close' : 'Open',
    onPointerDown: (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (deps.open) {
        deps.handleClose(e, 'toggleInput');
      } else {
        deps.handleOpen(e);
      }
    },
  });

  return {
    getRootProps,
    getInputProps,
    getInputLabelProps,
    getListboxProps,
    getOptionProps,
    getBadgeProps,
    getClearProps,
    getPopupIndicatorProps,
  };
}
