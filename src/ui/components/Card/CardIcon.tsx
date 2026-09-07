import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';

const cardIconVariants = cva(
  cn(
    'flex shrink-0 items-center justify-center overflow-hidden',
    '[&_img]:object-contain'
  ),
  {
    variants: {
      variant: {
        default: cn(
          'size-11 rounded-[0.625rem]',
          'border border-stroke bg-icon-wrapper-bg',
          'shadow-rest',
          '[&_img]:size-[1.625rem]'
        ),
        ghost: cn(
          'mx-auto mb-3 size-10 rounded-full',
          'border border-ink-secondary/45 border-dashed',
          'text-ink-secondary',
          '[&_svg]:size-[1.125rem]'
        ),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface CardIconProps
  extends Omit<ComponentProps<'div'>, 'children'>,
    VariantProps<typeof cardIconVariants> {
  children?: ReactNode;
}

const CardIcon = ({
  className,
  variant,
  children,
  ref,
  ...props
}: CardIconProps) => (
  <div
    ref={ref}
    className={cn(cardIconVariants({ variant }), className)}
    {...props}
  >
    {children}
  </div>
);

CardIcon.displayName = 'CardIcon';

export { CardIcon, cardIconVariants };
