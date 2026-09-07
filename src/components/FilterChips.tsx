import { ScrollShadow } from '@/ui/components/ScrollShadow';
import { ToggleGroup, ToggleGroupItem } from '@/ui/components/ToggleGroup';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

export interface FilterChipItem {
  value: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  items: FilterChipItem[];
  value: string;
  className?: string;
  onValueChange: (value: string) => void;
}

/** The design system's filter chips: a single-choice toggle row that scrolls when it runs out of room. */
export const FilterChips = ({
  items,
  value,
  className,
  onValueChange,
}: FilterChipsProps) => (
  <ScrollShadow orientation="horizontal" className="no-scrollbar w-full" size={32}>
    <ToggleGroup
      type="single"
      value={value}
      variant="stroke"
      size="xs"
      rounded="full"
      // Radix clears the value when the active item is pressed again; a format must stay chosen.
      onValueChange={(next: string) => next && onValueChange(next)}
      className={cn('flex w-max flex-nowrap gap-2 lg:w-full lg:flex-wrap', className)}
    >
      {items.map((item) => (
        <ToggleGroupItem key={item.value} value={item.value} className="group px-3">
          {item.label}
          {item.count != null && (
            <Typography
              variant="p"
              textColor="light"
              className="text-xs group-data-[state=on]:text-ink-highlight"
            >
              {item.count}
            </Typography>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  </ScrollShadow>
);
