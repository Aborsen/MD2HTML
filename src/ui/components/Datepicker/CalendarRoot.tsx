'use client';

import type { ComponentProps } from 'react';
import type { Root } from 'react-day-picker';
import { cn } from '../../lib/utils';

/**
 * The root container element for the calendar.
 * Adds the data-slot attribute for styling context.
 */
export const CalendarRoot = ({
  className,
  rootRef,
  ...props
}: ComponentProps<typeof Root>) => (
  <div
    data-slot="calendar"
    ref={rootRef}
    className={cn(className)}
    {...props}
  />
);
