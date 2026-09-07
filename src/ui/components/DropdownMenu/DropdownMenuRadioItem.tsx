import { ItemIndicator, RadioItem } from '@radix-ui/react-dropdown-menu';
import { Circle } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A dropdown item used for single-choice selection within a group of options.
 */
const DropdownMenuRadioItem = ({
  className,
  children,
  ref,
  onPointerDown,
  ...props
}: ComponentProps<typeof RadioItem>) => (
  <RadioItem
    ref={ref}
    onPointerDown={(event) => {
      event.preventDefault();
      onPointerDown?.(event);
    }}
    className={cn(
      'relative flex items-center rounded-md py-1.5 pr-2 pl-8',
      'text-sm',
      'outline-none',
      'transition-colors',
      'cursor-default select-none',

      //Highlighted (hover + keyboard) state
      'focus:bg-state-hover data-[highlighted]:bg-state-hover',
      'active:bg-state-pressed',

      //Disabled state
      'data-[disabled]:pointer-events-none',
      'data-[disabled]:opacity-disabled',

      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ItemIndicator>
    </span>
    {children}
  </RadioItem>
);

DropdownMenuRadioItem.displayName = RadioItem.displayName;

export { DropdownMenuRadioItem };
