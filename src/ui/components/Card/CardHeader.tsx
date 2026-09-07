import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';

const cardHeaderVariants = cva('', {
  variants: {
    layout: {
      vertical: cn('flex flex-col space-y-1.5'),
      horizontal: cn('flex items-center gap-3.5'),
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
});

interface CardHeaderProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardHeaderVariants> {
  leftSlot?: ReactNode;
}

const CardHeader = ({
  className,
  layout,
  leftSlot,
  children,
  ref,
  ...props
}: CardHeaderProps) => (
  <div
    ref={ref}
    className={cn(cardHeaderVariants({ layout }), className)}
    {...props}
  >
    {leftSlot}
    {layout === 'horizontal' ? (
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        {children}
      </div>
    ) : (
      children
    )}
  </div>
);

CardHeader.displayName = 'CardHeader';

export { CardHeader, cardHeaderVariants };
