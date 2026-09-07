import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { Circle } from 'lucide-react';
import { type ComponentPropsWithRef, type ReactNode, useId } from 'react';
import { cn } from '../../lib/utils';

const radioVariants = cva(
  [
    'peer',
    'grid',
    'shrink-0',
    'place-content-center',
    'border',
    'rounded-full',
    'ring-offset-surface-page',

    // Focus state
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',

    // Disabled state
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',

    // Transition
    'transition-colors',
    'duration-150',
    'ease-in-out',
  ],
  {
    variants: {
      variant: {
        primary: cn(
          'bg-surface-card',
          'border-stroke',
          'data-[state=checked]:bg-brand-primary',
          'data-[state=checked]:text-content-on-solid',
          'data-[state=checked]:border-transparent'
        ),
      },
      size: {
        md: 'size-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const radioIndicatorVariants = cva(
  [
    'grid',
    'place-content-center',
    'text-current',
    'fade-in-0',
    'zoom-in-95',
    'animate-in',
    'duration-150',
  ],
  {
    variants: {
      size: {
        md: '[&>svg]:size-2.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const radioContainerVariants = cva('flex w-fit items-center', {
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

export interface RadioButtonProps
  extends ComponentPropsWithRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioVariants>,
    VariantProps<typeof radioContainerVariants> {
  label?: ReactNode;
  labelClassName?: string;
}

const RadioButton = ({
  id,
  className,
  variant,
  size,
  label,
  labelPosition,
  gap,
  labelClassName,
  disabled,
  ...props
}: RadioButtonProps) => {
  const generatedId = useId();
  const radioId = id ?? generatedId;

  const radioElement = (
    <RadioGroupPrimitive.Item
      id={radioId}
      disabled={disabled}
      className={cn(radioVariants({ variant, size }), !label && className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(radioIndicatorVariants({ size }))}
      >
        <Circle className="fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );

  if (!label) {
    return radioElement;
  }

  return (
    <div
      className={cn(radioContainerVariants({ labelPosition, gap }), className)}
    >
      {radioElement}
      <label
        htmlFor={radioId}
        className={cn(
          'font-medium text-sm',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          labelClassName
        )}
      >
        {label}
      </label>
    </div>
  );
};

RadioButton.displayName = 'RadioButton';

export { RadioButton, radioVariants };
export type { RadioGroupProps } from './RadioGroup';
export { RadioGroup } from './RadioGroup';
