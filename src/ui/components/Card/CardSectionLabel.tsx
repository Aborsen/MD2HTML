import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

const CardSectionLabel = ({
  className,
  ref,
  ...props
}: ComponentProps<'p'>) => (
  <Typography
    ref={ref}
    variant="p"
    textColor="secondary"
    weight="medium"
    className={cn('hidden text-xs', className)}
    {...props}
  />
);

CardSectionLabel.displayName = 'CardSectionLabel';

export { CardSectionLabel };
