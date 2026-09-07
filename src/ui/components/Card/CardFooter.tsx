import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const cardFooterVariants = cva('flex items-center', {
  variants: {
    variant: {
      default: 'gap-2',
      actions: cn('justify-end gap-2', '[&>*]:w-full'),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardFooterProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = ({ className, variant, ref, ...props }: CardFooterProps) => (
  <div
    ref={ref}
    className={cn(cardFooterVariants({ variant }), className)}
    {...props}
  />
);

CardFooter.displayName = 'CardFooter';

export { CardFooter, cardFooterVariants };
