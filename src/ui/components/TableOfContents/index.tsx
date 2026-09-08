import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

export interface TocItem {
  /** The id of the heading it jumps to. */
  id: string;
  title: string;
  /** 2 sits flush, 3 is indented under it. Anything deeper is noise in a list this size. */
  level?: 2 | 3;
  /** The documentation's sections carry one; an article's headings do not. */
  icon?: LucideIcon;
}

interface TableOfContentsProps {
  items: TocItem[];
  /** The id the reader is currently on — see `useActiveHeading`. */
  activeId?: string;
  label?: string;
  className?: string;
}

/**
 * The contents of a long page, down its left side.
 *
 * Written once because two pages need it and they had better behave the same: the documentation,
 * which has eleven named sections, and an article, which now has thirty headings because the pieces
 * are four thousand words rather than one. At that length a reader who wants the section on tables
 * should not have to scroll for it.
 *
 * It scrolls inside itself rather than growing past the window, which is what a thirty-item list
 * does to a sticky element otherwise: the last entries end up below the fold and unreachable.
 */
export function TableOfContents({
  items,
  activeId,
  label = 'On this page',
  className,
}: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={label}
      className={cn(
        'sticky top-20 hidden h-fit max-h-[calc(100dvh-7rem)] w-44 shrink-0 overflow-y-auto lg:block',
        className
      )}
    >
      <Typography
        variant="span"
        textColor="light"
        className="mb-2 block text-xxs uppercase tracking-wide"
      >
        {label}
      </Typography>

      <ul className="space-y-0.5 pr-1">
        {items.map(({ id, title, level = 2, icon: Icon }) => {
          const isActive = activeId === id;

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md py-1.5 pr-2 text-sm transition-colors',
                  level === 3 ? 'pl-5 text-xs' : 'pl-2',
                  isActive
                    ? 'bg-surface-accent text-ink-highlight'
                    : 'text-ink-secondary hover:bg-state-hover hover:text-ink-body'
                )}
              >
                {Icon && <Icon className="size-3.5 shrink-0" />}
                <span className="min-w-0 truncate">{title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
