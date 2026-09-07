import { useMemo } from 'react';
import type { GroupedOption } from './types';

interface UseGroupedOptionsProps<T> {
  filteredOptions: T[];
  groupBy?: (option: T) => string;
}

export const useGroupedOptions = <T>({
  filteredOptions,
  groupBy,
}: UseGroupedOptionsProps<T>) => {
  const groupedOptions = useMemo(() => {
    if (!groupBy) return filteredOptions;

    const groups = new Map<string, GroupedOption<T>>();

    filteredOptions.forEach((option, index) => {
      const groupName = groupBy(option);

      if (!groups.has(groupName)) {
        groups.set(groupName, {
          key: groupName,
          index,
          group: groupName,
          options: [],
        });
      }

      groups.get(groupName)?.options.push(option);
    });

    return Array.from(groups.values());
  }, [filteredOptions, groupBy]);

  return {
    groupedOptions,
  };
};
