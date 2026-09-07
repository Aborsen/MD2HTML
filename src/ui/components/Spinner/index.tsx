import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircleIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
    },
    color: {
      primary: 'text-brand-secondary',
      secondary: 'text-ink-secondary',
      muted: 'text-ink-inactive',
      accent: 'text-brand-primary',
      success: 'text-fb-green',
      destructive: 'text-fb-red-text',
      warning: 'text-fb-attention',
      white: 'text-content-on-solid',
      inherit: 'text-inherit',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'primary',
  },
});

export interface SpinnerProps
  extends Omit<React.ComponentProps<'svg'>, 'color'>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, color, ...props }: SpinnerProps) {
  return (
    <LoaderCircleIcon
      role="status"
      aria-label="Loading"
      strokeLinecap="butt"
      className={cn(spinnerVariants({ size, color }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
