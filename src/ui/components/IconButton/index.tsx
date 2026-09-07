import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from '../Spinner';

const iconButtonVariants = cva(
  cn(
    'inline-flex items-center justify-center',
    'cursor-pointer border',
    'transition-all duration-100',

    // Focus: 2px ring + 2px surface-card gap; ring colour is set per variant
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    'disabled:cursor-not-allowed',

    '[&_svg]:pointer-events-none [&_svg]:shrink-0'
  ),
  {
    variants: {
      // Shares the Button variant scale (Button.md: IconButton uses the same variants).
      variant: {
        primary: cn(
          'border-transparent bg-btn-primary-bg text-btn-primary-text',
          'hover:bg-btn-primary-bg-hover',
          'pressed:bg-btn-primary-bg-press',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        primaryTertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-brand-primary/[0.06]',
          'pressed:bg-brand-primary/[0.08]',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive'
        ),
        secondary: cn(
          'border-btn-secondary-border bg-surface-card text-ink-body',
          'hover:border-btn-secondary-border-hover hover:bg-state-hover',
          'pressed:border-btn-secondary-border pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-btn-secondary-border disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        outline: cn(
          'border-brand-secondary bg-transparent text-ink-body',
          'hover:border-brand-hover hover:bg-brand-primary/[0.06]',
          'pressed:border-brand-hover pressed:bg-brand-primary/[0.08]',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive'
        ),
        tertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-state-hover',
          'pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive'
        ),
        destructive: cn(
          'border-transparent bg-fb-red text-content-on-solid',
          'hover:bg-fb-error-hover',
          'pressed:bg-fb-error-press',
          'focus-visible:ring-state-focus-ring',
          'disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        destructiveOutline: cn(
          'border-outline-destructive-border bg-transparent text-ink-body',
          'hover:border-outline-destructive-border-hover hover:bg-outline-destructive-bg-hover',
          'pressed:border-outline-destructive-border-hover pressed:bg-outline-destructive-bg-press',
          'focus-visible:ring-state-focus-ring',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Low-emphasis destructive ghost: red icon, transparent fill, red-tinted
        // hover/press. Tertiary sibling of destructiveOutline (no border).
        destructiveTertiary: cn(
          'border-transparent bg-transparent text-fb-red-text',
          'hover:bg-fb-red/[0.08]',
          'active:bg-fb-red/[0.12]',
          'focus-visible:ring-state-focus-ring',
          'disabled:bg-transparent disabled:text-ink-inactive'
        ),
        transparent: cn(
          '!p-0 m-0 max-h-fit max-w-fit border-none bg-transparent text-ink-body',
          'focus-visible:ring-focus-ring-brand'
        ),
      },
      size: {
        '2xs': 'size-6 [&_svg]:size-4',
        xs: 'size-7 [&_svg]:size-3',
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-9 [&_svg]:size-5',
        lg: 'size-10 [&_svg]:size-5',
        xl: 'size-11 [&_svg]:size-5',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        rounded: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
    },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
  /**
   * Replaces the icon with a spinner and blocks pointer interaction while
   * keeping the variant fill. Sets `aria-busy`; does not toggle `disabled`.
   */
  isLoading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  isLoading = false,
  ref,
  children,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const spinnerSize =
    size === '2xs' || size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'md';

  return (
    <Comp
      ref={ref}
      className={cn(
        iconButtonVariants({ variant, size, rounded }),
        className,
        isLoading && 'pointer-events-none opacity-disabled'
      )}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        // Decorative: `aria-busy` on the control conveys the loading state.
        <Spinner aria-hidden color="inherit" size={spinnerSize} />
      ) : (
        children
      )}
    </Comp>
  );
}
