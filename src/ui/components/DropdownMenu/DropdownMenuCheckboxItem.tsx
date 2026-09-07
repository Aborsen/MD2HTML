import { CheckboxItem, ItemIndicator } from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * A dropdown item that operates like a checkbox, allowing users to toggle a selection on or off.
 */
const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ref,
  onPointerDown,
  ...props
}: ComponentProps<typeof CheckboxItem>) => (
  <CheckboxItem
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
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Check className="h-4 w-4" />
      </ItemIndicator>
    </span>
    {children}
  </CheckboxItem>
);

DropdownMenuCheckboxItem.displayName = CheckboxItem.displayName;

export { DropdownMenuCheckboxItem };
