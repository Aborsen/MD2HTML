import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function Input({ className, type, ref, ...props }: ComponentProps<'input'>) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'h-full w-full min-w-0 px-1.5',
        'bg-transparent outline-none',
        'transition-[color,box-shadow]',

        //Disabled
        'disabled:pointer-events-none',
        'disabled:cursor-not-allowed',
        'disabled:text-ink-inactive',
        'disabled:placeholder:text-ink-inactive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
