import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { CardContent } from './CardContent';
import { CardDescription } from './CardDescription';
import { CardDivider } from './CardDivider';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';
import { CardIcon } from './CardIcon';
import { CardSectionLabel } from './CardSectionLabel';
import { CardTitle } from './CardTitle';

const cardVariants = cva(
  cn('group/card', 'transition-[border,shadow]', 'duration-300'),
  {
    variants: {
      variant: {
        secondary: cn(
          'flex flex-col gap-3 p-4',
          'bg-surface-card',
          'border border-stroke',
          'transition-colors',
          '[&_span]:transition-colors',

          // Hover states
          'group-hover/card:bg-state-hover',
          'group-hover/card:text-ink-secondary'
        ),
        outline: cn(
          'flex flex-col gap-3 p-4',
          'border border-stroke hover:border-card-border-hover',
          'shadow-sm',
          'text-ink-body'
        ),
        // Compact single-row layout for list items (chats, files, insights row view)
        row: cn(
          'group/row',
          'flex flex-row items-center gap-3',
          'h-11 px-3',
          'cursor-pointer select-none',
          'bg-surface-card font-medium text-ink-body text-sm',
          'border border-stroke/45 shadow-rest',
          // animate colors, shadow, and press-scale together
          'transition duration-200 ease-out',
          // hover + open-dropdown persistent state
          'hover:border-card-border-hover hover:bg-state-hover hover:shadow-card-hover',
          '[&:has([data-state=open])]:border-card-border-hover [&:has([data-state=open])]:bg-state-hover [&:has([data-state=open])]:shadow-card-hover',
          // focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page',
          '[&:active:not(:has(button:active)):not(:has([data-state=open]))]:scale-[.99]'
        ),
        elevated: cn(
          'bg-surface-card',
          'border border-stroke',
          'shadow-rest',
          'text-content-body',
          'transition-all duration-slow',
          'hover:-translate-y-0.5 hover:border-card-lift-border hover:shadow-lift-hover'
        ),
        ghost: cn(
          'cursor-pointer items-center justify-center',
          'border border-ink-secondary/35 border-dashed',
          'bg-bg text-center',
          'hover:border-ink-secondary/55 hover:bg-state-hover'
        ),
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'inline-flex w-auto',
      },
    },
    defaultVariants: {
      variant: 'outline',
      rounded: 'lg',
      fullWidth: false,
    },
  }
);

export interface CardProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardVariants> {}

/*
 * A foundational surface component used to group related content and actions.
 * It provides a consistent container with configurable rounding, width, and borders.
 * Used in conjunction with CardHeader, CardTitle, CardContent, and CardFooter.
 */
const Card = ({
  className,
  ref,
  variant,
  fullWidth,
  rounded,
  ...props
}: CardProps) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, fullWidth, rounded }), className)}
    {...props}
  />
);

Card.displayName = 'Card';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardDivider,
  CardIcon,
  CardSectionLabel,
  cardVariants,
};
