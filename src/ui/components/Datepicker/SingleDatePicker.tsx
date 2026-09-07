'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { Calendar } from './Calendar';

interface SingleDatePickerProps {
  selected?: Date;
  className?: string;
  confirmLabel?: string;
  startMonth?: Date;
  endMonth?: Date;
  onSelect?: (date: Date | undefined) => void;
  onConfirm?: (date: Date | undefined) => void;
}

/**
 * A complete single date picker with calendar, text input, and confirm button.
 *
 * Features month/year dropdown selectors and a manual date input field.
 * Ideal for forms where users need to select and confirm a specific date.
 *
 * @prop selected - The currently selected date.
 * @prop onSelect - Called when a date is clicked in the calendar.
 * @prop onConfirm - Called when the confirm button is clicked.
 * @prop confirmLabel - Label for the confirm button (default: 'Set Date').
 */
export function SingleDatePicker({
  selected,
  className,
  confirmLabel = 'Set Date',
  startMonth = new Date(2025, 0),
  endMonth = new Date(2026, 11),
  onSelect,
  onConfirm,
}: SingleDatePickerProps) {
  const [internalDate, setInternalDate] = useState<Date | undefined>(selected);

  useEffect(() => {
    setInternalDate(selected);
  }, [selected]);

  const handleDaySelect = (date: Date | undefined) => {
    setInternalDate(date);
    onSelect?.(date);
  };

  const handleConfirm = () => {
    onConfirm?.(internalDate);
  };

  const formatMonthDropdown = useCallback((date: Date) => {
    return date.toLocaleString('en-US', { month: 'long' });
  }, []);

  return (
    <div
      className={cn(
        // Layout
        'flex flex-col gap-2',
        // Appearance
        'rounded-md border border-stroke bg-surface-card',
        className
      )}
    >
      <Calendar
        mode="single"
        captionLayout="label"
        selected={internalDate}
        defaultMonth={internalDate}
        onSelect={handleDaySelect}
        startMonth={startMonth}
        endMonth={endMonth}
        formatters={{
          formatMonthDropdown,
        }}
        classNames={{
          // Container & Layout
          root: 'w-full',
          months: 'relative border-b border-stroke pb-3',
          month: 'flex w-full flex-col gap-2',
          weeks: 'flex flex-col gap-2',
          week: 'mt-0 flex w-full',

          // Caption (aligned with DateRangePicker)
          month_caption: 'flex h-8 items-center justify-center',
          // Navigation (aligned with DateRangePicker)
          nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
          button_previous:
            'flex size-8 items-center justify-center text-ink-secondary hover:text-ink-primary',
          button_next:
            'flex size-8 items-center justify-center text-ink-secondary hover:text-ink-primary',
          dropdowns: 'flex w-full items-center gap-2',
          dropdown_root: 'flex-1',

          // Day Cells
          day: 'flex items-center justify-center h-8 w-10 max-h-fit p-0 text-sm font-medium',
          day_button: 'size-full min-w-full py-1.5 rounded-full',
          weekdays: 'flex gap-0',
          weekday: 'w-10 py-1.5 text-sm font-medium text-ink-secondary',

          // Range States
          range_middle: 'bg-surface-card2',

          // Other
          outside: 'text-ink-secondary',
        }}
      />
      <div className="flex items-center gap-2 px-3 pb-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirm}
          rounded="full"
          className="flex-1"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
