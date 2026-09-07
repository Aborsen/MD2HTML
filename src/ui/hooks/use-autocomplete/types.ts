import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  LabelHTMLAttributes,
  MouseEvent,
  RefAttributes,
  SyntheticEvent,
} from 'react';

export type AutocompleteValue<
  T,
  Multiple extends boolean | undefined,
> = Multiple extends true ? T[] : T | null;

export type ChangeReason =
  | 'selectOption'
  | 'removeOption'
  | 'clear'
  | 'createOption'
  | 'blur';

export type InputChangeReason = 'input' | 'reset' | 'clear';

export type CloseReason =
  | 'toggleInput'
  | 'escape'
  | 'selectOption'
  | 'removeOption'
  | 'blur';

export type HighlightReason = 'keyboard' | 'mouse' | 'touch' | 'auto';

export type GetRootProps = () => HTMLAttributes<HTMLDivElement>;

export type GetInputProps = () => InputHTMLAttributes<HTMLInputElement> &
  RefAttributes<HTMLInputElement>;

export type GetInputLabelProps = () => LabelHTMLAttributes<HTMLLabelElement>;

export type GetListboxProps = () => HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;

export type GetOptionProps<T> = (params: {
  option: T;
  index: number;
}) => HTMLAttributes<HTMLElement> & {
  'data-option-index': number;
  'data-highlighted'?: true;
};

export type GetBadgeProps = (params: {
  index: number;
}) => HTMLAttributes<HTMLElement> & {
  'data-badge-index': number;
  'data-focused': boolean;
  onDelete: (e: SyntheticEvent) => void;
};

export type GetClearProps = () => ButtonHTMLAttributes<HTMLButtonElement>;

export type GetPopupIndicatorProps =
  () => ButtonHTMLAttributes<HTMLButtonElement>;

export function hasModifierKeys(
  event: SyntheticEvent
): event is MouseEvent<Element> | KeyboardEvent<Element> {
  return 'ctrlKey' in event && 'metaKey' in event;
}

export interface ChangeDetails<T> {
  option?: T;
}

export interface FilterOptionsState<T> {
  inputValue: string;
  getOptionLabel: (option: T) => string;
}

export interface GroupedOption<T> {
  key: string;
  index: number;
  group: string;
  options: T[];
}

export interface AutocompleteState<T, Multiple extends boolean> {
  value: AutocompleteValue<T, Multiple>;
  inputValue: string;
  open: boolean;
  focused: boolean;
  focusedBadge: number;
  highlightedIndex: number;
}

export interface HighlightState {
  index: number;
  set: (
    index: number,
    reason?: HighlightReason,
    event?: SyntheticEvent | null
  ) => void;
  reset: () => void;
  move: (
    direction: 'next' | 'previous',
    step?: number | 'start' | 'end'
  ) => void;
}

export interface UseAutocompleteArgs<
  T extends { id: string },
  /*
    When `true`, enables multi-select mode where `value` becomes `T[]`.
    When `false` or `undefined`, single-select mode is used where `value` is `T | null`.
  */
  Multiple extends boolean | undefined = false,
  /*
    When `true`, allows arbitrary user input not limited to the options list.
    This affects `getOptionLabel` which must then handle both `T` and `string` inputs.
    When `false` or `undefined`, only values from the options list can be selected.
  */
  FreeSolo extends boolean | undefined = false,
> {
  options: readonly T[];
  value?: AutocompleteValue<T, Multiple>;
  defaultValue?: AutocompleteValue<T, Multiple>;
  inputValue?: string;
  defaultInputValue?: string;
  isMultipleSelect?: Multiple;
  isFreeSoloSelect?: FreeSolo;
  open?: boolean;
  openOnFocus?: boolean;
  autoHighlight?: boolean;
  autoSelect?: boolean;
  autoComplete?: boolean;
  clearOnBlur?: boolean;
  clearOnEscape?: boolean;
  selectOnFocus?: boolean;
  blurOnSelect?: boolean | 'touch' | 'mouse';
  disableClearable?: boolean;
  disableCloseOnSelect?: boolean;
  disableListWrap?: boolean;
  includeInputInList?: boolean;
  handleHomeEndKeys?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  filterSelectedOptions?: boolean;
  id?: string;
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
  onClose?: (event: SyntheticEvent | null, reason: CloseReason) => void;
  onHighlightChange?: (
    event: SyntheticEvent | null,
    option: T | null,
    reason: HighlightReason
  ) => void;
  getOptionLabel?: (
    option: T | (FreeSolo extends true ? string : never)
  ) => string;
  getOptionKey?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  filterOptions?: (options: T[], state: FilterOptionsState<T>) => T[];
  getOptionDisabled?: (option?: T) => boolean;
  groupBy?: (option: T) => string;
}
