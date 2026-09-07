'use client';

import { ChevronDown, X } from 'lucide-react';
import type { MouseEvent, ReactNode, Ref } from 'react';
import { useCallback, useMemo } from 'react';
import { useAutocomplete } from '../../hooks/use-autocomplete';
import type { UseAutocompleteArgs } from '../../hooks/use-autocomplete/types';
import { cn } from '../../lib/utils';
import type { BadgeProps } from '../Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { IconButton } from '../IconButton';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  type InputGroupProps,
} from '../InputGroup';
import { Spinner } from '../Spinner';
import { Typography } from '../Typography';
import { BadgeList } from './BadgeList';
import { OptionItem } from './OptionItem';

const BADGE_LIST_PADDING_MAP: Record<
  NonNullable<InputGroupProps['size']>,
  string
> = {
  xs: 'py-[3px] ps-[3px] gap-[3px]',
  sm: 'py-[5px] ps-[5px] gap-1.5',
  md: 'py-[5px] ps-[5px] gap-1.5',
  lg: 'py-[5px] ps-[5px] gap-1.5',
  xl: 'py-[5px] ps-[5px] gap-1.5',
};

export interface AutocompleteProps<
  T extends { id: string },
  Multiple extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> extends UseAutocompleteArgs<T, Multiple, FreeSolo> {
  ref?: Ref<HTMLInputElement>;
  size?: InputGroupProps['size'];
  badgeVariant?: BadgeProps['variant'];
  placeholder?: string;
  label?: ReactNode;
  className?: string;
  inputClassName?: string;
  listboxClassName?: string;
  noOptionsText?: ReactNode;
  loadingText?: ReactNode;
  isLoading?: boolean;
  startAddon?: ReactNode;
  endAddon?: ReactNode;
  disableFiltering?: boolean;
  renderOption?: (option: T, props: { selected: boolean }) => ReactNode;
  renderBadge?: (
    option: T,
    onDelete: (e: MouseEvent<HTMLButtonElement>) => void
  ) => ReactNode;
}

export function Autocomplete<
  T extends { id: string },
  Multiple extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(props: AutocompleteProps<T, Multiple, FreeSolo>) {
  const {
    placeholder = 'Search...',
    noOptionsText = 'No options',
    loadingText = 'Loading...',
    isLoading = false,
    size = 'lg',
    badgeVariant = 'secondary',
    label,
    className,
    inputClassName,
    listboxClassName,
    options = [],
    isMultipleSelect = false,
    disableClearable = false,
    disableFiltering = false,
    renderOption,
    renderBadge,
    getOptionLabel: getOptionLabelProp,
    filterOptions: filterOptionsProp,
    ...restProps
  } = props;

  const filterOptions = useMemo(() => {
    if (disableFiltering) return (options: T[]) => options;
    return filterOptionsProp || undefined;
  }, [disableFiltering, filterOptionsProp]);

  const {
    value,
    open,
    isDirty,
    disabled,
    readOnly,
    filteredOptions,
    setOpen,
    getOptionLabel,
    getRootProps,
    getInputProps,
    getInputLabelProps,
    getListboxProps,
    getOptionProps,
    getBadgeProps,
    getClearProps,
    getPopupIndicatorProps,
  } = useAutocomplete<T, Multiple, FreeSolo>({
    options: options as T[],
    isMultipleSelect: isMultipleSelect as Multiple,
    disableClearable,
    getOptionLabel: getOptionLabelProp,
    filterOptions,
    ...restProps,
  });

  const inputProps = getInputProps();

  const tags = useMemo(
    () => (isMultipleSelect ? ((value || []) as T[]) : []),
    [isMultipleSelect, value]
  );

  const memoizedOptions = useMemo(() => {
    if (filteredOptions.length === 0) {
      return (
        <div className="px-3.5 py-5 text-center text-ink-secondary text-sm">
          {noOptionsText}
        </div>
      );
    }

    return filteredOptions.map((option, index) => (
      <OptionItem
        key={option.id}
        option={option}
        index={index}
        getOptionProps={getOptionProps}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
      />
    ));
  }, [
    filteredOptions,
    noOptionsText,
    getOptionProps,
    getOptionLabel,
    renderOption,
  ]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.stopPropagation();
      }
      inputProps.onKeyDown?.(e);
    },
    [inputProps.onKeyDown]
  );

  const hasTags = tags.length > 0;
  const showClear = !disableClearable && !disabled && !readOnly && isDirty;

  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <Typography
          element="label"
          variant="span"
          textColor="secondary"
          weight="medium"
          className="mb-1.5 block"
          {...getInputLabelProps()}
        >
          {label}
        </Typography>
      )}

      <DropdownMenu open={open} modal={false} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <div {...getRootProps()}>
            <InputGroup
              size={size}
              variant="outline"
              className={cn('group h-auto', hasTags && 'flex-wrap')}
            >
              <div
                className={cn(
                  'flex flex-1 flex-wrap items-center',
                  BADGE_LIST_PADDING_MAP[size ?? 'lg']
                )}
              >
                <BadgeList<T>
                  tags={tags}
                  inputGroupSize={size}
                  variant={badgeVariant}
                  getOptionLabel={getOptionLabel}
                  getBadgeProps={getBadgeProps}
                  renderBadge={renderBadge}
                />

                <InputGroupInput
                  {...inputProps}
                  placeholder={placeholder}
                  className={cn(
                    'min-w-8 flex-1 bg-transparent',
                    hasTags && 'px-0',
                    inputClassName
                  )}
                  onKeyDown={handleInputKeyDown}
                />
              </div>

              <InputGroupAddon align="inline-end" className="gap-0.5">
                {showClear && (
                  <IconButton
                    {...getClearProps()}
                    variant="transparent"
                    asChild
                    className={cn(
                      'opacity-0',
                      'transition-opacity',
                      'group-focus-within:opacity-100',
                      'group-hover:opacity-100',
                      open && 'opacity-100'
                    )}
                  >
                    <X />
                  </IconButton>
                )}

                <IconButton
                  {...getPopupIndicatorProps()}
                  variant="transparent"
                  asChild
                >
                  <ChevronDown
                    className={cn(
                      'transition-transform',
                      'duration-200',
                      open && 'rotate-180'
                    )}
                  />
                </IconButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </DropdownMenuTrigger>

        {open && (
          <DropdownMenuContent
            {...getListboxProps()}
            className={cn(
              'w-[--radix-dropdown-menu-trigger-width] max-w-none',
              // z-[110]: is used so the dropdown menu is rendered on top of Modal (z-100)
              'z-[110] overflow-y-auto p-2',
              listboxClassName
            )}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onFocusOutside={(e) => e.preventDefault()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-3.5 py-5 text-center text-ink-secondary text-sm">
                <Spinner size="sm" color="inherit" aria-hidden />
                {loadingText}
              </div>
            ) : (
              memoizedOptions
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
