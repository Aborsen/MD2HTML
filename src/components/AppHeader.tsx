import {
  BookOpen,
  Check,
  ChevronDown,
  FileCode2,
  History,
  Newspaper,
} from 'lucide-react';
import {
  CONVERSIONS,
  conversion,
  type ConversionId,
} from '@shared/conversions';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/DropdownMenu';
import { Separator } from '@/ui/components/Separator';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

import type { AppView } from '@/lib/route';

export type { AppView };

interface AppHeaderProps {
  view: AppView;
  /** Which conversion the converter is on, so the menu can show it as the current one. */
  conversionId: ConversionId;
  historyCount: number;
  onViewChange: (view: AppView) => void;
  onConversionChange: (id: ConversionId) => void;
  /** The logo doubles as "start over": back to the converter with no file open. */
  onHome: () => void;
}

/* The converter is a menu of its own; these are the destinations beside it. */
const NAV_ITEMS = [
  { id: 'history' as const, label: 'History', icon: History },
  { id: 'docs' as const, label: 'Docs', icon: BookOpen },
  { id: 'blog' as const, label: 'Blog', icon: Newspaper },
];

export function AppHeader({
  view,
  conversionId,
  historyCount,
  onViewChange,
  onConversionChange,
  onHome,
}: AppHeaderProps) {
  const isConverter = view === 'converter';
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

        {/*
          * The line beside the wordmark says which conversion you are on, because with four of
          * them a fixed "Markdown to HTML converter" is wrong on three pages out of four. Away
          * from the converter it names the app instead of whatever conversion was last picked.
          */}
        <Typography
          variant="span"
          weight="medium"
          textColor="secondary"
          className="hidden sm:block"
        >
          {view === 'converter'
            ? `${conversion(conversionId).label} converter`
            : 'document converter'}
        </Typography>

        {/*
          * Four destinations, a theme switch and an account, on a phone: the labels are the part
          * that does not fit, so below `md` the icons carry the meaning and the label stays as the
          * accessible name. Without this the whole page scrolls sideways, on every route.
          */}
        <nav className="ml-auto flex items-center gap-0.5 md:gap-1">
          {/*
            * Four conversions behind one item. A row of four in the header would crowd out the rest
            * of the app on a phone and still not say which one you are on; a menu says both.
            */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Converter"
                title="Converter"
                className={cn(
                  'flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-transparent px-2 font-medium text-sm transition-colors md:px-3',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2',
                  isConverter
                    ? 'bg-surface-accent text-ink-highlight'
                    : 'text-ink-secondary hover:bg-state-hover hover:text-ink-body'
                )}
              >
                <FileCode2 className="size-4 shrink-0" />
                <span className="hidden md:inline">Converter</span>
                <ChevronDown className="size-3.5 shrink-0 opacity-70" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
              {CONVERSIONS.map((one) => (
                <DropdownMenuItem
                  key={one.id}
                  onSelect={() => onConversionChange(one.id)}
                  className="flex items-start gap-2"
                >
                  <Check
                    className={cn(
                      'mt-0.5 size-4 shrink-0',
                      isConverter && conversionId === one.id
                        ? 'text-brand-tertiary'
                        : 'invisible'
                    )}
                  />
                  <span className="flex min-w-0 flex-col">
                    <Typography variant="span" weight="medium" textColor="primary">
                      {one.label}
                    </Typography>
                    <Typography variant="span" textColor="secondary" className="text-xs">
                      {one.extensions.join(', ')}
                    </Typography>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
