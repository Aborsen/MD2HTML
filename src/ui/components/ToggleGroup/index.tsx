import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { VariantProps } from 'class-variance-authority';
import { type ReactNode, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { toggleVariants } from '../Toggle';
import { ToggleGroupContext } from './ToggleGroupContext';
import { ToggleGroupItem } from './ToggleGroupItem';

export type ToggleGroupProps = (
  | ToggleGroupPrimitive.ToggleGroupSingleProps
  | ToggleGroupPrimitive.ToggleGroupMultipleProps
) &
  VariantProps<typeof toggleVariants> & {
    className?: string;
    children?: ReactNode;
    scrollIntoGroup?: boolean;
  };

const ToggleGroup = ({
  className,
  variant = 'outline',
  size = 'sm',
  rounded = 'md',
  scrollIntoGroup = true,
  children,
  ...props
}: ToggleGroupProps) => {
  const contextValue = useMemo(
    () => ({
      variant: variant ?? 'outline',
      size: size ?? 'sm',
      rounded: rounded ?? 'md',
      scrollIntoGroup,
    }),
    [variant, size, rounded, scrollIntoGroup]
  );

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <ToggleGroupPrimitive.Root
        className={cn('flex flex-wrap items-center gap-2', className)}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  );
};

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export { ToggleGroup, ToggleGroupItem, toggleVariants };
export type { ToggleGroupItemProps } from './ToggleGroupItem';
