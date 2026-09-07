import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The primary container for the body text or main elements within a Card.
 * It applies standard body text styling and serves as the main layout area for card data.
 */
const CardContent = ({ className, ref, ...props }: ComponentProps<'div'>) => (
  <div ref={ref} className={cn('text-ink-body', className)} {...props} />
);

CardContent.displayName = 'CardContent';

export { CardContent };
