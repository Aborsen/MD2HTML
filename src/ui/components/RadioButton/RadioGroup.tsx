import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/utils';

export type RadioGroupProps = ComponentPropsWithRef<
  typeof RadioGroupPrimitive.Root
>;

export const RadioGroup = ({ className, ...props }: RadioGroupProps) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
    />
  );
};

RadioGroup.displayName = 'RadioGroup';
