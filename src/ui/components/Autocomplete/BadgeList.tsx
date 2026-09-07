import { type MouseEvent, memo, type ReactNode } from 'react';
import type { GetBadgeProps } from '../../hooks/use-autocomplete/types';
import { Badge, type BadgeProps } from '../Badge';
import type { InputGroupProps } from '../InputGroup';

const BADGE_SIZE_MAP: Record<
  NonNullable<InputGroupProps['size']>,
  BadgeProps['size']
> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

interface BadgeListProps<T extends { id: string }> {
  tags: T[];
  variant?: BadgeProps['variant'];
  inputGroupSize?: InputGroupProps['size'];
  getOptionLabel: (option: T) => string;
  getBadgeProps: GetBadgeProps;
  renderBadge?: (
    option: T,
    onDelete: (e: MouseEvent<HTMLButtonElement>) => void
  ) => ReactNode;
}

const BadgeListComponent = <T extends { id: string }>({
  tags,
  variant = 'secondary',
  inputGroupSize = 'lg',
  getOptionLabel,
  getBadgeProps,
  renderBadge,
}: BadgeListProps<T>) => {
  if (tags.length === 0) return null;

  return (
    <>
      {tags.map((tag, index) => {
        const badgeProps = getBadgeProps({ index });
        const label = getOptionLabel(tag);

        const onDelete = (e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          badgeProps.onDelete(e);
        };

        if (renderBadge) {
          return <span key={tag.id}>{renderBadge(tag, onDelete)}</span>;
        }

        return (
          <Badge
            key={tag.id}
            variant={variant}
            size={BADGE_SIZE_MAP[inputGroupSize ?? 'lg']}
            data-focused={badgeProps['data-focused']}
            onDelete={onDelete}
          >
            {label}
          </Badge>
        );
      })}
    </>
  );
};

export const BadgeList = memo(BadgeListComponent) as typeof BadgeListComponent;
