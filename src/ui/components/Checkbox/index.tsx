'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';

import { cn } from '../../lib/utils';

export type CheckedState = CheckboxPrimitive.CheckedState;

const checkboxVariants = cva(
  [
    'peer',
    'grid',
    'shrink-0',
    'place-content-center',
    'border-[1.5px]',
    // Focus state — neutral ring with a Surface/Card gap
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-state-focus-ring',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-surface-card',
    // Disabled state — unified opacity recipe
    'disabled:pointer-events-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-disabled',
    // Transition
    'transition-colors',
    'duration-150',
    'ease-in-out',
  ],
  {
    variants: {
      variant: {
        primary: cn(
          // Unchecked state
          'border-stroke-field-hover bg-surface-card',
          'hover:border-ink-secondary',
          // Checked state
          'data-[state=checked]:border-brand-primary',
          'data-[state=checked]:bg-brand-primary',
          'data-[state=checked]:text-content-on-solid',
          'data-[state=checked]:hover:border-brand-hover',
          'data-[state=checked]:hover:bg-brand-hover',
          // Indeterminate state
          'data-[state=indeterminate]:border-brand-primary',
          'data-[state=indeterminate]:bg-brand-primary',
          'data-[state=indeterminate]:text-content-on-solid',
          'data-[state=indeterminate]:hover:border-brand-hover',
          'data-[state=indeterminate]:hover:bg-brand-hover',
          // Disabled mark fades to inactive ink
          'disabled:data-[state=checked]:text-ink-inactive',
          'disabled:data-[state=indeterminate]:text-ink-inactive',
          // Error state — mirrors Input; error fill wins over checked
          'aria-invalid:border-input-error',
          'aria-invalid:hover:border-input-error',
          'aria-invalid:data-[state=checked]:border-input-error',
          'aria-invalid:data-[state=checked]:bg-input-error',
          'aria-invalid:data-[state=checked]:hover:border-input-error',
          'aria-invalid:data-[state=checked]:hover:bg-input-error',
          'aria-invalid:data-[state=indeterminate]:border-input-error',
          'aria-invalid:data-[state=indeterminate]:bg-input-error',
          'aria-invalid:data-[state=indeterminate]:hover:border-input-error',
          'aria-invalid:data-[state=indeterminate]:hover:bg-input-error'
        ),
      },
      size: {
        md: 'size-[18px]',
      },
      rounded: {
        md: 'rounded',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
    },
  }
);

const checkboxIndicatorVariants = cva(
  [
    'grid',
    'place-content-center',
    'text-current',
    'fade-in-0',
    'slide-in-from-bottom-1',
    'animate-in',
    'duration-150',
  ],
  {
    variants: {
      size: {
        md: '[&>svg]:size-3.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const checkboxContainerVariants = cva('flex w-fit items-center', {
  variants: {
    labelPosition: {
      left: 'flex-row',
      right: 'flex-row-reverse',
      top: 'flex-col-reverse',
      bottom: 'flex-col',
    },
    gap: {
      sm: 'gap-1.5',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    labelPosition: 'right',
    gap: 'md',
  },
});

export interface CheckboxProps
  extends ComponentPropsWithRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants>,
    VariantProps<typeof checkboxContainerVariants> {
  label?: ReactNode;
  labelClassName?: string;
}

function Checkbox({
  className,
  variant,
  size,
  rounded,
  label,
  labelPosition,
  gap,
  labelClassName,
  disabled,
  ...props
}: CheckboxProps) {
  const id = useId();

  const checkboxElement = (
    <CheckboxPrimitive.Root
      id={label ? id : props.id}
      disabled={disabled}
      className={cn(
        checkboxVariants({ variant, size, rounded }),
        !label && className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(checkboxIndicatorVariants({ size }), 'group/indicator')}
      >
        <Check className="group-data-[state=indeterminate]/indicator:hidden" />
        <Minus className="hidden group-data-[state=indeterminate]/indicator:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) {
    return checkboxElement;
  }

  return (
    <div
      className={cn(
        checkboxContainerVariants({ labelPosition, gap }),
        className
      )}
    >
      {checkboxElement}
      <label
        htmlFor={id}
        className={cn(
          'font-medium text-sm',
          disabled ? 'cursor-not-allowed opacity-disabled' : 'cursor-pointer',
          labelClassName
        )}
      >
        {label}
      </label>
    </div>
  );
}

Checkbox.displayName = 'Checkbox';

export { Checkbox, checkboxVariants };
export type { CheckboxGroupProps, CheckboxOption } from './CheckboxGroup';
export { CheckboxGroup } from './CheckboxGroup';
