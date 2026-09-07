import { BookOpen, FileCode2, History, Newspaper } from 'lucide-react';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import { Separator } from '@/ui/components/Separator';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

import type { AppView } from '@/lib/route';

export type { AppView };

interface AppHeaderProps {
  view: AppView;
  historyCount: number;
  onViewChange: (view: AppView) => void;
  /** The logo doubles as "start over": back to the converter with no file open. */
  onHome: () => void;
}

const NAV_ITEMS = [
  { id: 'converter' as const, label: 'Converter', icon: FileCode2 },
  { id: 'history' as const, label: 'History', icon: History },
  { id: 'docs' as const, label: 'Docs', icon: BookOpen },
  { id: 'blog' as const, label: 'Blog', icon: Newspaper },
];

export function AppHeader({
  view,
  historyCount,
  onViewChange,
  onHome,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-stroke border-b bg-surface-card/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-container-content items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={onHome}
          aria-label="New file"
          className={cn(
            'cursor-pointer rounded-md px-1 py-0.5 transition-opacity',
            'hover:opacity-80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2'
          )}
        >
          <Logo />
        </button>

        <Separator orientation="vertical" className="hidden h-5 sm:block" />

        <Typography
          variant="span"
          weight="medium"
          textColor="secondary"
          className="hidden sm:block"
        >
          Markdown → HTML converter
        </Typography>

        {/*
          * Four destinations, a theme switch and an account, on a phone: the labels are the part
          * that does not fit, so below `md` the icons carry the meaning and the label stays as the
          * accessible name. Without this the whole page scrolls sideways, on every route.
          */}
        <nav className="ml-auto flex items-center gap-0.5 md:gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = view === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onViewChange(id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
                title={label}
                className={cn(
                  'flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-transparent px-2 font-medium text-sm transition-colors md:px-3',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-surface-accent text-ink-highlight'
                    : 'text-ink-secondary hover:bg-state-hover hover:text-ink-body'
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden md:inline">{label}</span>
                {id === 'history' && historyCount > 0 && (
                  <span className="ml-0.5 rounded-full bg-surface-card2 px-1.5 py-0.5 text-ink-secondary text-xxs">
                    {historyCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <Separator orientation="vertical" className="hidden h-5 sm:block" />

        <UserMenu />
      </div>
    </header>
  );
}
