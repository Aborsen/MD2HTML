import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Hint } from './Hint';
import { useT } from '@/lib/i18n/context';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

interface ListSelectionBarProps {
  /** Shown when nothing is selected — usually "N files". */
  title: ReactNode;
  selectedCount: number;
  allSelected: boolean;
  isEmpty?: boolean;
  sticky?: boolean;
  rightSlot?: ReactNode;
  onClearSelection: () => void;
  onSelectAll?: () => void;
}

/**
 * The list header that doubles as a selection bar: the count on the left turns into "N selected",
 * the link toggles select-all, and the actions for the selection live in `rightSlot`. Ported from
 * the design system's ListSelectionBar so bulk selection looks the same as everywhere else.
 */
export function ListSelectionBar({
  title,
  selectedCount,
  allSelected,
  isEmpty = false,
  sticky = false,
  rightSlot,
  onClearSelection,
  onSelectAll,
}: ListSelectionBarProps) {
  const t = useT();
  const isSelecting = selectedCount > 0;
  const toggleSelectAll = isSelecting && allSelected;

  return (
    <div
      className={cn(
        'flex min-h-[37px] items-center gap-3',
        sticky && 'sticky top-14 z-10 bg-surface-page'
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Typography variant="span" textColor="secondary" weight="normal" noWrap>
          {isSelecting ? t('common.selected', { count: selectedCount }) : title}
        </Typography>

        <Button
          variant="transparent"
          size="sm"
          className={cn(
            'font-medium text-ink-highlight',
            'decoration-1 underline-offset-2 hover:underline',
            'disabled:text-ink-inactive disabled:no-underline'
          )}
          disabled={!isSelecting && isEmpty}
          onClick={toggleSelectAll ? onClearSelection : onSelectAll}
        >
          {toggleSelectAll ? t('common.deselectall') : t('common.selectall')}
        </Button>
      </div>

      {(rightSlot || isSelecting) && (
        <div className="ml-auto flex items-center gap-3">
          {rightSlot}

          {isSelecting && (
            <Hint content={t('common.exitselection')}>
              <IconButton
                variant="tertiary"
                size="xs"
                rounded="rounded"
                className="text-ink-secondary hover:bg-brand-primary/[0.06] hover:text-ink-body [&_svg]:size-3.5"
                aria-label={t('common.exitselection')}
                onClick={onClearSelection}
              >
                <X />
              </IconButton>
            </Hint>
          )}
        </div>
      )}
    </div>
  );
}
