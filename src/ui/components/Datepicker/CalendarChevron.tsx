'use client';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import type { Chevron } from 'react-day-picker';
import { cn } from '../../lib/utils';

/**
 * Navigation chevron icons for the calendar.
 * Renders left, right, or down arrows based on orientation.
 */
export const CalendarChevron = ({
  className,
  orientation,
  ...props
}: ComponentProps<typeof Chevron>) => {
  if (orientation === 'left') {
    return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
  }

  if (orientation === 'right') {
    return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
  }

  return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
};
