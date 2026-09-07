import { cva } from 'class-variance-authority';
import type { ComponentProps, RefObject } from 'react';
import { useCallback } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../Input';
import { useInputGroup } from './InputGroupContext';

const inputGroupInputVariants = cva(
  cn(
    'flex-1 rounded-none border-0',
    'bg-transparent',
    'shadow-none',
    'focus-visible:ring-0'
  ),
  {
    variants: {
      variant: {
        outline: 'text-ink-primary placeholder:text-ink-inactive',
      },
      size: {
        xs: 'text-xs placeholder:text-xs',
        sm: 'text-xs placeholder:text-sm',
        md: 'text-sm placeholder:text-sm',
        lg: 'text-sm placeholder:text-sm',
        xl: 'text-sm placeholder:text-sm',
      },
    },
  }
);

/**
 * The core input field within an InputGroup.
 * It automatically consumes the parent group's styling (size/variant) and registers itself
 * via a ref so that clicking on the group container or addons can correctly focus this input.
 * Any external `ref` (e.g. react-hook-form) is merged with the group's internal ref.
 */
function InputGroupInput({
  id,
  className,
  ref: refProp,
  ...props
}: ComponentProps<'input'>) {
  const { size, variant, inputRef, isInvalid, inputId } = useInputGroup();

  const mergedRef = useCallback(
    (el: HTMLInputElement | null) => {
      if (inputRef) {
        (inputRef as RefObject<HTMLInputElement | null>).current = el;
      }
      if (typeof refProp === 'function') {
        refProp(el);
      } else if (refProp) {
        (refProp as RefObject<HTMLInputElement | null>).current = el;
      }
    },
    [inputRef, refProp]
  );

  return (
    <Input
      ref={mergedRef}
      data-slot="input-group-control"
      className={cn(inputGroupInputVariants({ size, variant }), className)}
      {...props}
      id={id ?? inputId}
      aria-invalid={isInvalid}
    />
  );
}

export { InputGroupInput };
