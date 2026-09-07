import type { FilterOptionsState, HighlightReason } from './types';

type MatchType = 'includes' | 'start';

const MATCH_STRATEGIES: Record<
  MatchType,
  (str: string, strToMatch: string) => boolean
> = {
  includes: (str, strToMatch) => str.includes(strToMatch),
  start: (str, strToMatch) => str.startsWith(strToMatch),
};

/**
 * Removes diacritical marks (accents) from a string for accent-insensitive comparison.
 *
 * Uses Unicode NFD (Canonical Decomposition) to separate base characters from their
 * combining diacritical marks, then removes the marks (Unicode range U+0300 to U+036F).
 *
 * @example
 * stripDiacritics('café')     // 'cafe'
 * stripDiacritics('naïve')    // 'naive'
 * stripDiacritics('São Paulo') // 'Sao Paulo'
 * stripDiacritics('Müller')   // 'Muller'
 */
export const stripDiacritics = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Factory function that creates a customizable filter function for autocomplete options.
 *
 * Returns a filter function that can be passed to `useAutocomplete`'s `filterOptions` prop.
 * The filter compares the user's input against option labels using configurable matching rules.
 *
 * @template T - The type of options being filtered
 *
 * @param config - Configuration object for filter behavior
 * @param config.ignoreAccents - Remove diacritical marks before comparing (e.g., 'café' matches 'cafe')
 * @default true
 * @param config.ignoreCase - Perform case-insensitive comparison
 * @default true
 * @param config.limit - Maximum number of options to return (useful for performance with large lists)
 * @default undefined (no limit)
 * @param config.matchType - Match strategy: 'any' matches anywhere in string, 'start' matches from beginning only
 * @default 'any'
 * @param config.trim - Remove leading/trailing whitespace from input before filtering
 * @default false
 * @param config.stringify - Custom function to convert option to searchable string (overrides getOptionLabel)
 * @default undefined (uses getOptionLabel)
 *
 * @returns A filter function compatible with useAutocomplete's filterOptions prop
 *
 * @example
 * // Default behavior (case-insensitive, accent-insensitive, matches anywhere)
 * const filterOptions = createFilterOptions<Country>();
 *
 * @example
 * // Match from start only, limit to 10 results
 * const filterOptions = createFilterOptions<Country>({
 *   matchFrom: 'start',
 *   limit: 10,
 * });
 *
 * @example
 * // Custom stringify to search multiple fields
 * const filterOptions = createFilterOptions<Country>({
 *   stringify: (option) => `${option.label} ${option.code}`,
 * });
 */
export const createFilterOptions = <T>(
  config: {
    limit?: number;
    matchType?: MatchType;
    ignoreAccents?: boolean;
    ignoreCase?: boolean;
    trim?: boolean;
    stringifyOption?: (option: T) => string;
  } = {}
) => {
  const {
    ignoreAccents = true,
    ignoreCase = true,
    limit,
    matchType = 'includes',
    stringifyOption,
    trim = false,
  } = config;

  const matcher = MATCH_STRATEGIES[matchType] || MATCH_STRATEGIES.includes;

  const normalize = (str: string): string => {
    let normalized = str;

    if (ignoreCase) {
      normalized = normalized.toLowerCase();
    }

    if (ignoreAccents) {
      normalized = stripDiacritics(normalized);
    }

    return normalized;
  };

  const limitOptions = (options: T[]) => {
    return typeof limit === 'number' ? options.slice(0, limit) : options;
  };

  return (
    options: T[],
    { inputValue, getOptionLabel }: FilterOptionsState<T>
  ): T[] => {
    const input = normalize(trim ? inputValue.trim() : inputValue);

    if (!input) {
      return limitOptions(options);
    }

    const filteredOptions = options.filter((option) => {
      const candidateRaw = (stringifyOption ?? getOptionLabel)(option);
      const candidateNormalized = normalize(candidateRaw);

      return matcher(candidateNormalized, input);
    });

    return limitOptions(filteredOptions);
  };
};

/**
 * Pre-configured filter function with default settings for general use.
 *
 * Uses `unknown` as the generic type to be compatible with any option type.
 * For type-safe filtering, create a typed filter with `createFilterOptions<YourType>()`.
 *
 * Default behavior:
 * - Case-insensitive matching
 * - Accent-insensitive matching (diacritics ignored)
 * - Matches anywhere in the string
 * - No result limit
 * - No input trimming
 */
export const defaultFilterOptions = createFilterOptions<unknown>();

/**
 * Resolves a displayable label from an option.
 * Returns the option if it's a string, its `label` property if present, or falls back to `String(option)`.
 */
export const defaultGetOptionLabel = <T>(option: T): string => {
  if (typeof option === 'string') return option;
  return (
    ((option as Record<string, unknown>)?.label as string) ?? String(option)
  );
};

/**
 * Manages class manipulation for highlighted items to avoid React re-renders.
 */
export const updateHighlightClass = (listbox: HTMLElement, index: number) => {
  const prev = listbox.querySelector('[data-highlighted="true"]');

  if (prev) prev.removeAttribute('data-highlighted');

  if (index !== -1) {
    const next = listbox.querySelector(`[data-option-index="${index}"]`);
    if (next) next.setAttribute('data-highlighted', 'true');
  }
};

/**
 * Handles scrolling the listbox to ensure the highlighted option is visible.
 */
export const scrollOptionIntoView = <T>(
  listbox: HTMLElement,
  index: number,
  reason: HighlightReason,
  groupBy?: (option: T) => string
) => {
  if (index === -1) {
    listbox.scrollTop = 0;
    return;
  }

  if (
    listbox.scrollHeight <= listbox.clientHeight ||
    reason === 'mouse' ||
    reason === 'touch'
  )
    return;

  const option = listbox.querySelector(
    `[data-option-index="${index}"]`
  ) as HTMLElement;

  if (!option) return;

  const elementBottom = option.offsetTop + option.offsetHeight;
  const scrollBottom = listbox.clientHeight + listbox.scrollTop;
  const groupOffset = groupBy ? 1.3 : 0;

  if (elementBottom > scrollBottom) {
    listbox.scrollTop = elementBottom - listbox.clientHeight;
  } else if (
    option.offsetTop - option.offsetHeight * groupOffset <
    listbox.scrollTop
  ) {
    listbox.scrollTop = option.offsetTop - option.offsetHeight * groupOffset;
  }
};

/**
 * Calculates the next index based on keyboard input (Arrow keys, Home, End).
 */
export const calculateNextIndex = ({
  diff,
  currentIndex,
  total,
  autoHighlight,
  disableListWrap,
  includeInputInList,
}: {
  diff: number | 'reset' | 'start' | 'end';
  currentIndex: number;
  total: number;
  autoHighlight: boolean;
  disableListWrap: boolean;
  includeInputInList: boolean;
}) => {
  if (diff === 'reset') return autoHighlight ? 0 : -1;
  if (diff === 'start') return 0;
  if (diff === 'end') return total - 1;

  const maxIndex = total - 1;
  const newIndex = currentIndex + diff;

  if (newIndex < 0) {
    if (newIndex === -1 && includeInputInList) return -1;
    if ((disableListWrap && currentIndex !== -1) || Math.abs(diff) > 1)
      return 0;
    return maxIndex;
  }

  if (newIndex > maxIndex) {
    if (newIndex === maxIndex + 1 && includeInputInList) return -1;
    if (disableListWrap || Math.abs(diff) > 1) return maxIndex;
    return 0;
  }

  return newIndex;
};

/**
 * Iterates through options to find the next valid (non-disabled) index.
 */
export const findNextValidIndex = <T>({
  index,
  direction,
  filteredOptions,
  getOptionDisabled,
}: {
  index: number;
  direction: 'next' | 'previous';
  filteredOptions: T[];
  getOptionDisabled?: (option: T) => boolean;
}) => {
  if (index === -1) return -1;

  let nextFocus = index;
  const total = filteredOptions.length;

  while (true) {
    if (direction === 'next' && nextFocus === total) nextFocus = 0;
    if (direction === 'previous' && nextFocus === -1) nextFocus = total - 1;

    const option = filteredOptions[nextFocus];

    if (!option) return -1;

    if (!getOptionDisabled?.(option)) return nextFocus;

    nextFocus += direction === 'next' ? 1 : -1;

    if (nextFocus === index) return -1;
  }
};
