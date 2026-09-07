'use client';

import type { ComponentProps } from 'react';
import { useEffect, useRef } from 'react';
import type { DayButton } from 'react-day-picker';
import { getDefaultClassNames } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { Button } from '../Button';

/**
 * The interactive button for each day cell in the calendar.
 *
 * Handles visual states for selection, range highlighting, and focus.
 * Automatically manages focus when keyboard navigation is used.
 */
export const CalendarDayButton = ({
  className,
  day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) => {
  const defaultClassNames = getDefaultClassNames();

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="transparent"
      size="xs"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // Base layout
        'relative isolate z-10',
        'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1',
        'border-0 font-normal leading-none',

        // Range rounding
        'data-[range-start=true]:rounded-r-none data-[range-start=true]:rounded-l-(--cell-radius)',
        'data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:rounded-l-none',
        'data-[range-middle=true]:rounded-none',

        // Range backgrounds
        'data-[range-start=true]:bg-brand-secondary',
        'data-[range-middle=true]:bg-state-hover',
        'data-[range-end=true]:bg-brand-secondary',
        'data-[selected-single=true]:bg-brand-secondary',

        // Range text colors
        'data-[range-start=true]:text-surface-page',
        'data-[range-middle=true]:text-ink-primary',
        'data-[range-end=true]:text-surface-page',
        'data-[selected-single=true]:text-surface-page',

        // Focus state
        'group-data-[focused=true]/day:relative',
        'group-data-[focused=true]/day:z-10',
        'group-data-[focused=true]/day:border-focus-ring-brand',
        'group-data-[focused=true]/day:ring-[3px]',
        'group-data-[focused=true]/day:ring-focus-ring-brand/50',

        // Misc
        'dark:hover:text-ink-primary',
        '[&>span]:text-sm',

        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
};
