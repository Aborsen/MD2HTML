import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode, Ref } from 'react';
import { useCallback, useId, useLayoutEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

export const textAreaVariants = cva(
  cn(
    'block w-full min-w-0 resize-none',
    'outline-none',

    //Disabled — real fill instead of opacity dimming
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:border-stroke disabled:bg-state-disabled',
    'disabled:text-ink-inactive disabled:placeholder:text-ink-inactive'
  ),
  {
    variants: {
      variant: {
        outline: cn(
          'border border-stroke bg-surface-card',
          'text-ink-primary placeholder:text-ink-inactive',

          //Transition
          'transition-[border-color,color,box-shadow]',

          //Hover state
          'hover:border-stroke-field-hover',

          //Focus state — neutral border, no outer ring
          'focus-visible:border-input-focus'
        ),
      },
      rounded: {
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '3xl': 'rounded-3xl',
      },
      size: {
        xs: cn('px-1.5 py-2', 'text-xs placeholder:text-xs'),
        sm: cn('px-1.5 py-2', 'text-xs placeholder:text-xs'),
        md: cn('px-2 py-2', 'text-sm placeholder:text-sm'),
        lg: cn('px-2 py-2.5', 'text-sm placeholder:text-sm'),
        xl: cn('px-2 py-3', 'text-sm placeholder:text-sm'),
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      rounded: 'md',
    },
  }
);

export interface TextAreaProps
  extends ComponentProps<'textarea'>,
    VariantProps<typeof textAreaVariants> {
  maxRowsBeforeScroll?: number;
  ref?: Ref<HTMLTextAreaElement>;
  label?: ReactNode;
  isInvalid?: boolean;
  errorText?: string;
}

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (!ref) {
    return;
  }

  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  ref.current = value;
};

const sanitizePositiveRowCount = (
  value: number | undefined,
  fallback: number
): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  const normalizedValue = Math.floor(value);

  return normalizedValue > 0 ? normalizedValue : fallback;
};

export const TextArea = ({
  ref,
  variant,
  size,
  rounded,
  maxRowsBeforeScroll = 15,
  rows = 8,
  value,
  defaultValue,
  className,
  onInput,
  id,
  label,
  isInvalid = false,
  errorText,
  ...props
}: TextAreaProps) => {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const generatedId = useId();
  const resolvedId = id ?? (label ? generatedId : undefined);

  const safeMaxRowsBeforeScroll = sanitizePositiveRowCount(
    maxRowsBeforeScroll,
    15
  );

  const errorId = isInvalid && errorText ? `${resolvedId}-error` : undefined;

  const handleRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      setRef(ref, node);
    },
    [ref]
  );

  const resizeToContent = useCallback(() => {
    const element = innerRef.current;

    if (!element) {
      return;
    }

    element.style.height = 'auto';

    const computedStyle = window.getComputedStyle(element);
    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 24;
    const paddingTop = Number.parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(computedStyle.paddingBottom) || 0;
    const borderTopWidth = Number.parseFloat(computedStyle.borderTopWidth) || 0;
    const borderBottomWidth =
      Number.parseFloat(computedStyle.borderBottomWidth) || 0;

    const maxHeight =
      lineHeight * safeMaxRowsBeforeScroll +
      paddingTop +
      paddingBottom +
      borderTopWidth +
      borderBottomWidth;

    const nextHeight = Math.min(element.scrollHeight, maxHeight);

    element.style.height = `${nextHeight}px`;
    element.style.overflowY =
      element.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [safeMaxRowsBeforeScroll]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to resize the textarea when the value changes programatically
  useLayoutEffect(() => {
    resizeToContent();
  }, [resizeToContent, value]);

  const textareaElement = (
    <textarea
      ref={handleRef}
      id={resolvedId}
      rows={rows}
      value={value}
      defaultValue={defaultValue}
      aria-invalid={isInvalid || undefined}
      aria-describedby={errorId}
      onInput={(event) => {
        resizeToContent();
        onInput?.(event);
      }}
      className={cn(
        textAreaVariants({ variant, size, rounded }),
        //Error — red border in every state, no bg tint, no outer ring
        isInvalid &&
          'border-input-error hover:border-input-error focus-visible:border-input-error',
        className
      )}
      {...props}
    />
  );

  if (!label && !errorText) {
    return textareaElement;
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <Typography
          id={errorId}
          element="label"
          variant="span"
          textColor="secondary"
          weight="medium"
          htmlFor={resolvedId}
          aria-live="polite"
          className="text-sm"
        >
          {label}
        </Typography>
      ) : null}

      {textareaElement}

      {isInvalid && errorText ? (
        <Typography
          variant="span"
          textColor="destructive"
          className="text-fb-red-text text-sm"
        >
          {errorText}
        </Typography>
      ) : null}
    </div>
  );
};
