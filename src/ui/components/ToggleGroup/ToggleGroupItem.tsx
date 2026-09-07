import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps, MouseEvent, Ref } from 'react';
import { cn } from '../../lib/utils';
import { toggleVariants } from '../Toggle';
import { useToggleGroup } from './ToggleGroupContext';

export interface ToggleGroupItemProps
  extends ComponentProps<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {
  ref?: Ref<HTMLButtonElement>;
}

const ToggleGroupItem = ({
  className,
  variant,
  size,
  rounded,
  ref,
  onClick,
  ...props
}: ToggleGroupItemProps) => {
  const group = useToggleGroup();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (group.scrollIntoGroup) {
      event.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    }
    onClick?.(event);
  };

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: variant ?? group.variant,
          size: size ?? group.size,
          rounded: rounded ?? group.rounded,
          className,
        })
      )}
      onClick={handleClick}
      {...props}
    />
  );
};

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroupItem };
