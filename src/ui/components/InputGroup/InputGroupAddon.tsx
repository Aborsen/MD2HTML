import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useInputGroup } from './InputGroupContext';

const inputGroupAddonVariants = cva(
  cn(
    'flex h-full items-center justify-center gap-2',
    'cursor-text select-none',

    // Disabled
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:text-ink-inactive',

    // Kbd shortcut styling
    '[&>kbd]:rounded-[calc(var(--radius)-5px)]'
  ),
  {
    variants: {
      variant: {
        outline: 'text-ink-secondary',
      },
      size: {
        xs: '[&_svg]:size-4',
        sm: '[&_svg]:size-5',
        md: '[&_svg]:size-5',
        lg: '[&_svg]:size-5',
        xl: '[&_svg]:size-5',
      },
      align: {
        'inline-start': cn(
          'order-first pl-2.5',
          // kbds aligning
          'has-[>kbd]:ml-[-0.35rem]'
        ),
        'inline-end': cn(
          'order-last pr-2.5',
          // kbds aligning
          'has-[>kbd]:mr-[-0.35rem]'
        ),
        'block-start': cn(
          'order-first w-full justify-start px-2.5 pt-3',
          // Padding adjustments
          'group-has-[>input]/input-group:pt-2.5',
          '[.border-b]:pb-3'
        ),
        'block-end': cn(
          'order-last w-full justify-start px-3 pb-3',
          // Padding adjustments
          'group-has-[>input]/input-group:pb-2.5',
          '[.border-t]:pt-3'
        ),
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
);

/**
 * Container for icons, text labels, or action buttons within an InputGroup.
 * It automatically delegates clicks to focus the parent input, unless the user clicks an interactive child (like a button).
 */
function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  const { size, variant, inputRef } = useInputGroup();

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: we can have onClick in this case without according key handle
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        inputGroupAddonVariants({ align, variant, size }),
        className
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        inputRef?.current?.focus();
      }}
      {...props}
    />
  );
}

export { InputGroupAddon, inputGroupAddonVariants };
