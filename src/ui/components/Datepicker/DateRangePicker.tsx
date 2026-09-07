'use client';

import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { Calendar } from './Calendar';
import { DEFAULT_END_MONTH_DATE, DEFAULT_START_MONTH_DATE } from './constants';

interface DateRangePickerProps {
  selected?: DateRange;
  className?: string;
  confirmLabel?: string;
  startMonth?: Date;
  endMonth?: Date;
  onSelect?: (range: DateRange | undefined) => void;
  onConfirm?: (range: DateRange | undefined) => void;
}

/**
 * A date range picker with side-by-side month calendars and a confirm button.
 *
 * Uses prev/next navigation, centered month captions,
 * and square day cells with today highlighted.
 */
export function DateRangePicker({
  selected,
  className,
  confirmLabel = 'Set Date',
  startMonth = DEFAULT_START_MONTH_DATE,
  endMonth = DEFAULT_END_MONTH_DATE,
  onSelect,
  onConfirm,
}: DateRangePickerProps) {
  const isMobile = useIsMobile();

  const [internalRange, setInternalRange] = useState<DateRange | undefined>(
    selected
  );

  const handleRangeSelect = (range: DateRange | undefined) => {
    setInternalRange(range);
    onSelect?.(range);
  };

  const handleConfirm = () => {
    onConfirm?.(internalRange);
  };

  const defaultMonth = internalRange?.from || new Date();

  useEffect(() => {
    setInternalRange(selected);
  }, [selected]);

  return (
    <div
      className={cn(
        'max-md:max-w-xs',
        'flex flex-col gap-2',
        'overflow-hidden',
        'rounded-md border border-stroke bg-surface-card',
        className
      )}
    >
      <Calendar
        mode="range"
        selected={internalRange}
        defaultMonth={defaultMonth}
        captionLayout="label"
        numberOfMonths={isMobile ? 1 : 2}
        onSelect={handleRangeSelect}
        startMonth={startMonth}
        endMonth={endMonth}
        classNames={{
          root: 'w-full',
          months: 'relative flex flex-row gap-8 border-b border-stroke pb-3',
          month: 'flex w-full flex-col gap-1',

          nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
          button_previous:
            'flex size-8 items-center justify-center text-ink-secondary hover:text-ink-primary',
          button_next:
            'flex size-8 items-center justify-center text-ink-secondary hover:text-ink-primary',
          month_caption: 'flex h-8 items-center justify-center',

          caption_label: 'text-sm font-semibold',

          weekdays: 'flex gap-0',
          weekday:
            'flex-1 w-10 py-1.5 text-center text-sm font-medium text-ink-secondary',
          weeks: 'flex flex-col gap-0.5',
          week: 'flex w-full',

          day: 'flex flex-1 items-center justify-center h-8 w-10 max-h-fit p-0 text-sm font-medium',
          day_button: 'size-full min-w-full py-1.5 rounded-full',

          range_start: '[&_button]:!rounded-l-full [&_button]:rounded-r-none',
          range_end: '[&_button]:rounded-l-none [&_button]:!rounded-r-full',
          range_middle: 'bg-surface-card2 rounded-none',

          outside: 'pointer-events-none opacity-0',
        }}
      />
      <div className="flex flex-col gap-3 px-3 pb-3 md:flex-row md:items-center">
        <Button
          variant="primary"
          size="lg"
          rounded="full"
          onClick={handleConfirm}
          className="ms-auto"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
