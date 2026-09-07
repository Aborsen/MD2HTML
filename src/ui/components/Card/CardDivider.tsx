import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const CardDivider = ({ className, ref, ...props }: ComponentProps<'hr'>) => (
  <hr
    ref={ref}
    className={cn('hidden border-0 border-stroke border-t', className)}
    {...props}
  />
);

CardDivider.displayName = 'CardDivider';

export { CardDivider };
