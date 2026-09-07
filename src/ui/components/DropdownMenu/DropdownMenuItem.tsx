import { Item } from '@radix-ui/react-dropdown-menu';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

// Single `.mi` recipe shared by every menu in the system. Roomier hit target
// (6/12px, ~32px tall), neutral hover/pressed; danger keeps a red-tinted hover.
const dropdownMenuItemVariants = cva(
  cn(
    'relative flex items-center gap-2 rounded-md px-3 py-1.5',
    'text-sm',
    'outline-none',
    'transition-colors',
    'cursor-pointer select-none',

    // Performance optimization: use transform for GPU acceleration
    '[transform:translateZ(0)]',

    // Disabled state — unified opacity recipe
    'data-[disabled]:pointer-events-none',
    'data-[disabled]:opacity-disabled',

    // Icon specific styles — one step lighter stroke for a more modern feel
    '[&_svg]:pointer-events-none',
    '[&_svg]:size-4',
    '[&_svg]:shrink-0',
    '[&_svg]:stroke-[1.75]',

    //Focused state
    'focus-visible:outline-none',
    'focus-visible:ring-1',
    'focus-visible:ring-focus-ring-brand',
    'focus-visible:ring-offset-0',
    'focus-visible:ring-offset-surface-card'
  ),
  {
    variants: {
      variant: {
        default: cn(
          'text-ink-primary',
          // Highlighted (hover + keyboard) → neutral State/Hover; pressed → State/Pressed
          'focus:bg-state-hover data-[highlighted]:bg-state-hover',
          'active:bg-state-pressed'
        ),
        danger: cn(
          'text-fb-red-text',
          'focus:bg-fb-red/[0.08] data-[highlighted]:bg-fb-red/[0.08]',
          'active:bg-fb-red/[0.12]'
        ),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * A standard interactive item within a dropdown menu, used for actions or links.
 * Pass `variant="danger"` for destructive actions (e.g. delete).
 */
const DropdownMenuItem = ({
  className,
  inset,
  variant,
  ref,
  ...props
}: ComponentProps<typeof Item> &
  VariantProps<typeof dropdownMenuItemVariants> & {
    inset?: boolean;
  }) => (
  <Item
    ref={ref}
    className={cn(
      dropdownMenuItemVariants({ variant }),
      inset && 'pl-8',
      className
    )}
    {...props}
  />
);

DropdownMenuItem.displayName = Item.displayName;

export { DropdownMenuItem, dropdownMenuItemVariants };
