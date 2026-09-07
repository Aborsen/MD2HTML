'use client';

import type { ComponentProps } from 'react';
import type { WeekNumber } from 'react-day-picker';

/**
 * Displays the week number in the calendar grid.
 * Only visible when showWeekNumber is enabled on the Calendar.
 */
export const CalendarWeekNumber = ({
  children,
  ...props
}: ComponentProps<typeof WeekNumber>) => (
  <td {...props}>
    <div className="flex size-(--cell-size) items-center justify-center text-center">
      {children}
    </div>
  </td>
);
