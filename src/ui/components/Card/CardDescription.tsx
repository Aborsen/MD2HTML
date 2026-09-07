import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A sub-component for the Card used to display secondary or supporting text.
 * It provides reduced visual weight to distinguish it from the CardTitle.
 */
const CardDescription = ({
  className,
  ref,
  ...props
}: ComponentProps<'div'>) => (
  <div
    ref={ref}
    className={cn('text-sm', 'text-ink-secondary', className)}
    {...props}
  />
);

CardDescription.displayName = 'CardDescription';

export { CardDescription };
