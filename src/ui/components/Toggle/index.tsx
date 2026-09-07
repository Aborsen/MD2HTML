import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, Ref } from 'react';
import { cn } from '../../lib/utils';

const TOGGLE_ON_CHIP = cn(
  'data-[state=on]:cursor-default',
  'data-[state=on]:border-ink-highlight data-[state=on]:bg-state-pressed',
  'data-[state=on]:text-ink-highlight',
  'data-[state=on]:hover:border-ink-highlight',
  'data-[state=on]:hover:bg-state-pressed data-[state=on]:hover:text-ink-highlight',
  'data-[state=on]:active:border-ink-highlight',
  'data-[state=on]:active:bg-state-pressed data-[state=on]:active:text-ink-highlight'
);

const toggleVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-1.5',
    'whitespace-nowrap font-medium',
    'cursor-pointer border',
    'transition-all duration-100',

    // Focus — brand-tinted ring with a Surface/Card gap.
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
    'focus-visible:ring-focus-ring-brand',

    // Disabled — unified opacity recipe.
    'disabled:pointer-events-none disabled:cursor-not-allowed',

    '[&_svg]:pointer-events-none [&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        outline: cn(
          'border-brand-secondary bg-transparent text-ink-body',
          'hover:border-brand-hover hover:bg-brand-primary/[0.06]',
          'active:border-brand-hover active:bg-brand-primary/[0.08]',
          'disabled:border-ink-inactive disabled:bg-transparent',
          'disabled:text-ink-inactive',
          TOGGLE_ON_CHIP
        ),
        stroke: cn(
          'border-stroke bg-surface-card text-ink-body',
          'hover:bg-state-hover',
          'active:border-stroke active:bg-state-pressed',
          'disabled:border-stroke disabled:bg-state-disabled',
          'disabled:text-ink-inactive',
          TOGGLE_ON_CHIP
        ),
        ghost: cn(
          'border-transparent bg-transparent text-ink-body',
          'hover:bg-state-hover active:bg-state-pressed',
          'disabled:bg-transparent disabled:text-ink-inactive',
          TOGGLE_ON_CHIP
        ),
      },
      size: {
        xs: 'h-7 px-2.5 text-xs [&_svg]:size-3',
        sm: 'h-8 px-2.5 text-sm [&_svg]:size-4',
        md: 'h-9 px-2.5 text-sm [&_svg]:size-4',
        lg: 'h-10 px-2.5 text-sm [&_svg]:size-4',
        xl: 'h-11 px-2.5 text-sm [&_svg]:size-4',
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
      variant: 'outline',
      size: 'sm',
      rounded: 'md',
    },
  }
);

type ToggleVariant = NonNullable<
  VariantProps<typeof toggleVariants>['variant']
>;
type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>['size']>;
type ToggleRounded = NonNullable<
  VariantProps<typeof toggleVariants>['rounded']
>;

interface ToggleProps
  extends ComponentProps<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  ref?: Ref<HTMLButtonElement>;
}

const Toggle = ({
  className,
  variant,
  size,
  rounded,
  ref,
  ...props
}: ToggleProps) => {
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, rounded, className }))}
      {...props}
    />
  );
};

Toggle.displayName = TogglePrimitive.Root.displayName;

export {
  Toggle,
  type ToggleVariant,
  type ToggleSize,
  type ToggleRounded,
  toggleVariants,
};
