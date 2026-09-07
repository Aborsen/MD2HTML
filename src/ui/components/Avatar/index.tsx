'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/utils';
import { AvatarContext, useAvatarContext } from './AvatarProvider';

const avatarVariants = cva('relative flex shrink-0 overflow-hidden', {
  variants: {
    size: {
      xxs: 'size-5',
      xs: 'size-7',
      sm: 'size-8',
      md: 'size-9',
      lg: 'size-10',
      xl: 'size-11',
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
    size: 'md',
    rounded: 'full',
  },
});

const avatarFallbackVariants = cva(
  cn(
    'flex h-full w-full items-center justify-center',
    'bg-brand-primary text-content-on-solid'
  ),
  {
    variants: {
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
      rounded: 'md',
    },
  }
);

export interface AvatarProps
  extends ComponentPropsWithRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = ({ className, rounded, size, ref, ...props }: AvatarProps) => (
  <AvatarContext.Provider value={{ rounded, size }}>
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarVariants({ rounded, size }), className)}
      {...props}
    />
  </AvatarContext.Provider>
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = ({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = ({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof AvatarPrimitive.Fallback>) => {
  const { rounded } = useAvatarContext();

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(avatarFallbackVariants({ rounded }), className)}
      {...props}
    />
  );
};
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
