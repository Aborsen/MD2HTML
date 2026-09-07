import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  cn(
    'inline-flex items-center gap-2 border',
    'font-medium',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-focus-ring-brand',
    'focus:ring-offset-2'
  ),
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-badge-primary-bg text-badge-primary-text',
        secondary:
          'border-transparent bg-badge-secondary-bg text-badge-secondary-text',
        attention: 'border-transparent bg-fb-attention/15 text-fb-attention',
        success: 'border-transparent bg-fb-green/15 text-fb-green',
        error: 'border-transparent bg-fb-red/15 text-fb-red-text',
        accent: 'border-transparent bg-accent/15 text-accent',
      },
      size: {
        xs: 'h-5 px-2 text-xs [&_svg]:size-3',
        sm: 'h-5 px-[0.375rem] text-xs [&_svg]:size-4',
        md: 'h-7 px-2.5 text-xs [&_svg]:size-4',
        lg: 'h-8 px-2.5 text-sm [&_svg]:size-4',
        xl: 'h-9 px-2.5 text-sm [&_svg]:size-4',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        rounded: 'rounded',
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

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
  removeLabel?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
}

function Badge({
  withDot,
  removeLabel = 'Remove',
  variant,
  size,
  rounded,
  leftSlot,
  rightSlot,
  onDelete,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, rounded, size }), className)}
      {...props}
    >
      {withDot && (
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}

      {leftSlot}

      <span className="inline-block align-text-top leading-none">
        {children}
      </span>

      {rightSlot}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-sm',
            'opacity-70 transition-opacity',
            'hover:opacity-100',
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card'
          )}
        >
          <X />
          <span className="sr-only">{removeLabel}</span>
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
