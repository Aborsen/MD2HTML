import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';

const skeletonVariants = cva(
  cn(
    'skeleton',
    'pointer-events-none',
    'relative',
    'overflow-hidden',
    'bg-surface-chips'
  ),
  {
    variants: {
      animation: {
        shimmer: cn(
          'after:absolute',
          'after:inset-0',
          'after:animate-skeleton-shimmer',
          'after:bg-skeleton-shimmer',
          'after:content-[""]'
        ),
        pulse: 'animate-pulse',
        none: '',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      animation: 'shimmer',
      rounded: 'md',
    },
  }
);

interface SkeletonProps
  extends ComponentProps<'div'>,
    VariantProps<typeof skeletonVariants> {
  children?: ReactNode;
  isLoaded?: boolean;
}

function Skeleton({
  className,
  animation,
  rounded,
  children,
  isLoaded = false,
  ...props
}: SkeletonProps) {
  const containerClasses = cn(
    skeletonVariants({
      animation,
      rounded,
    }),
    children && !isLoaded && 'inline-block max-w-fit',
    className
  );

  if (isLoaded) {
    return children;
  }

  return (
    <div className={containerClasses} data-loaded={isLoaded} {...props}>
      <div aria-hidden="true" className="absolute inset-0" />
      {children && (
        <div className="pointer-events-none invisible max-h-fit max-w-fit">
          {children}
        </div>
      )}
    </div>
  );
}

export { Skeleton, skeletonVariants };
export type { SkeletonProps };
