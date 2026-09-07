'use client';

import { ChevronDownIcon } from 'lucide-react';
import { type ComponentProps, useCallback } from 'react';
import type { Dropdown } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu';

/**
 * Custom dropdown component for month/year selection in the calendar.
 * Uses the DropdownMenu component instead of native select elements.
 */
export function CalendarDropdown({
  value,
  options,
  onChange,
  'aria-label': ariaLabel,
}: ComponentProps<typeof Dropdown>) {
  const selectedOption = options?.find((option) => option.value === value);

  const handleSelect = useCallback(
    (optionValue: number) => {
      const syntheticEvent = {
        target: { value: String(optionValue) },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange?.(syntheticEvent);
    },
    [onChange]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          aria-label={ariaLabel}
          fullWidth
          rounded="rounded"
          className="justify-between text-ink-primary"
          rightSlot={<ChevronDownIcon className="size-4 text-ink-body" />}
        >
          {selectedOption?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="max-h-60">
        {options?.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => handleSelect(option.value)}
            className={cn(
              'cursor-pointer',
              option.value === value && 'bg-brand-secondary/10 font-medium'
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
