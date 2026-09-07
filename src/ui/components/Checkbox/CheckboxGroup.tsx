'use client';

import { type ReactNode, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';
import { Checkbox } from './index';

export interface CheckboxOption {
  id: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  label?: ReactNode;
  description?: ReactNode;
  options: CheckboxOption[];
  value: string[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  disabled?: boolean;
  onValueChange: (value: string[]) => void;
}

function CheckboxGroup({
  label,
  description,
  options,
  value,
  orientation = 'vertical',
  className,
  disabled = false,
  onValueChange,
}: CheckboxGroupProps) {
  const valueSet = useMemo(() => new Set([...value]), [value]);

  const handleCheckedChange = useCallback(
    (optionId: string, checked: boolean) => {
      if (checked) {
        valueSet.add(optionId);
        onValueChange([...valueSet]);
      } else {
        valueSet.delete(optionId);
        onValueChange([...valueSet]);
      }
    },
    [valueSet, onValueChange]
  );

  return (
    <div className={cn('flex flex-col gap-3 border-none p-0', className)}>
      {(label || description) && (
        <div className="flex flex-col gap-1">
          {label && (
            <Typography variant="span" element="legend" leading="none">
              {label}
            </Typography>
          )}
          {description && (
            <Typography variant="p" textColor="secondary">
              {description}
            </Typography>
          )}
        </div>
      )}

      <div
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((option) => {
          const isChecked = valueSet.has(option.id);
          const isDisabled = disabled || option.disabled;

          return (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                id={option.id}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleCheckedChange(option.id, checked === true)
                }
                disabled={isDisabled}
              />
              <label
                htmlFor={option.id}
                className={cn(
                  isDisabled
                    ? 'cursor-not-allowed opacity-disabled'
                    : 'cursor-pointer'
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

CheckboxGroup.displayName = 'CheckboxGroup';

export { CheckboxGroup };
