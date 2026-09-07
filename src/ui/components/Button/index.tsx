import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode, Ref } from 'react';
import { cn } from '../../lib/utils';

import { Spinner } from '../Spinner';

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-1.5',
    'whitespace-nowrap font-medium',
    'cursor-pointer border',
    'transition-all duration-100',

    // Focus: 2px ring + 2px surface-card gap; ring colour is set per variant
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    // Disabled
    'disabled:cursor-not-allowed',

    // Child icon styles
    '[&_svg]:pointer-events-none [&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        // Solid brand fill, theme-independent.
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
        // Card-tone fill with a thin neutral border.
        secondary: cn(
          'border-btn-secondary-border bg-surface-card text-ink-body',
          'hover:border-btn-secondary-border-hover hover:bg-state-hover',
          'pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-btn-secondary-border-hover disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        // Brand-bordered, transparent fill (previous Secondary look).
        outline: cn(
          'border-brand-secondary bg-transparent text-ink-body',
          'hover:border-brand-hover hover:bg-brand-primary/[0.06]',
          'pressed:border-brand-hover pressed:bg-brand-primary/[0.08]',
          'focus-visible:ring-focus-ring-brand',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Lowest-emphasis ghost: Outlined minus the border — same brand-tinted
        // hover/press overlays.
        tertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-state-hover',
          'pressed:bg-state-pressed',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Neutral ghost: transparent like tertiary
        ghost: cn(
          'border-transparent bg-transparent text-ink-body',
          'pressed:bg-state-pressed hover:bg-state-hover',
          'transition-colors duration-100',
          'focus-visible:ring-focus-ring-brand',
          'disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Destructive: theme-independent red fill, neutral focus ring.
        destructive: cn(
          'border-transparent bg-fb-red text-content-on-solid',
          'hover:bg-fb-error-hover',
          'pressed:bg-fb-error-press',
          'focus-visible:ring-state-focus-ring',
          'disabled:bg-state-disabled disabled:text-ink-inactive'
        ),
        // Destructive outline: red-bordered, transparent fill with red-tinted
        destructiveOutline: cn(
          'border-outlineDestructive-border bg-transparent text-ink-body',
          'hover:border-outlineDestructive-border-hover hover:bg-outlineDestructive-bg-hover',
          'pressed:border-outlineDestructive-border-hover pressed:bg-outlineDestructive-bg-press',
          'focus-visible:ring-state-focus-ring',
          'disabled:border-ink-inactive disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Low-emphasis destructive ghost: red label, transparent fill, red-tinted
        // hover/press. Tertiary sibling of destructiveOutline (no border).
        destructiveTertiary: cn(
          'border-transparent bg-transparent text-fb-red-text',
          'hover:bg-fb-red/[0.08]',
          'active:bg-fb-red/[0.12]',
          'focus-visible:ring-state-focus-ring',
          'disabled:bg-transparent disabled:text-ink-inactive'
        ),
        // Bare utility (no box, fit-content) for inline/icon triggers.
        transparent: cn(
          '!p-0 m-0 max-h-fit max-w-fit border-none bg-transparent text-ink-body',
          'focus-visible:ring-focus-ring-brand'
        ),
        transparentUnderline: cn(
          'border-none bg-transparent text-ink-body underline underline-offset-4',
          'focus-visible:ring-focus-ring-brand'
        ),
        accent: cn(
          'border border-transparent bg-accent/15 text-accent',
          '[&_svg]:text-accent',

          // Hover
          'hover:bg-accent/25',

          // Active
          'active:bg-accent/30 active:shadow-button-press',

          // Disabled
          'disabled:border-transparent disabled:bg-chip disabled:text-content-light',
          '[&_svg]:disabled:text-content-light'
        ),
      },
      size: {
        xs: 'h-7 px-2.5 text-xs [&_svg]:size-3',
        sm: 'h-8 px-2.5 text-sm [&_svg]:size-4',
        md: 'h-9 px-2.5 text-sm [&_svg]:size-4',
        lg: 'h-10 px-2.5 text-sm [&_svg]:size-4',
        xl: 'h-11 px-2.5 text-sm [&_svg]:size-4',
      },
      align: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
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
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  /**
   * Shows a spinner and blocks pointer interaction while keeping the variant
   * fill (the label is retained). Sets `aria-busy`; does not toggle `disabled`.
   */
  isLoading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

const Button = ({
  className,
  variant,
  size,
  rounded,
  fullWidth,
  align,
  asChild = false,
  isLoading = false,
  ref,
  leftSlot = null,
  rightSlot = null,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, rounded, fullWidth, align, className }),
        isLoading && 'pointer-events-none opacity-disabled'
      )}
      ref={ref}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <Spinner
          aria-hidden
          color="inherit"
          size={size === 'xs' ? 'xs' : 'sm'}
        />
      ) : (
        leftSlot
      )}

      <span
        className={cn(
          'align-text-top',
          fullWidth
            ? cn(
                'min-w-0 flex-1 truncate text-center',
                align === 'left' && 'text-left',
                align === 'right' && 'text-right'
              )
            : 'inline-block'
        )}
      >
        {children}
      </span>

      {rightSlot}
    </Comp>
  );
};

Button.displayName = 'Button';

export { Button, buttonVariants };
