import { cn } from '../../lib/utils';
import { Typography, type TypographyProps } from '../Typography';

/**
 * The main heading for a Card component.
 * It builds upon the Typography primitive to provide standardized bold,
 * primary-colored text with tight letter spacing.
 */
const CardTitle = ({ className, ref, ...props }: TypographyProps) => (
  <Typography
    ref={ref}
    className={cn(
      'font-semibold text-base text-ink-primary tracking-tight',
      className
    )}
    {...props}
  />
);

CardTitle.displayName = 'CardTitle';

export { CardTitle };
