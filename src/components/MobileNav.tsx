import {
  BookOpen,
  Check,
  History,
  Menu,
  Newspaper,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import {
  CONVERSIONS,
  type ConversionId,
} from '@shared/conversions';
import { STATIC_PAGES, type StaticPageId } from '@/lib/pages';
import type { AppView } from '@/lib/route';
import { IconButton } from '@/ui/components/IconButton';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/components/Sheet';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

interface MobileNavProps {
  view: AppView;
  conversionId: ConversionId;
  historyCount: number;
  onViewChange: (view: AppView) => void;
  onConversionChange: (id: ConversionId) => void;
  onOpenPage: (id: StaticPageId) => void;
}

const DESTINATIONS: Array<{
  id: Extract<AppView, 'history' | 'docs' | 'blog'>;
  label: string;
  icon: LucideIcon;
}> = [
  { id: 'history', label: 'History', icon: History },
  { id: 'docs', label: 'Documentation', icon: BookOpen },
  { id: 'blog', label: 'Blog', icon: Newspaper },
];

/**
 * The whole of the navigation, on a phone.
 *
 * Not the desktop row made smaller. Squeezing it produced a header 459px wide inside a 390px
 * screen — the page scrolled sideways on every route — and the cure for that had been to drop the
 * labels, which left a row of four unnamed icons and a menu that had to be opened to find out
 * where you already were.
 *
 * A sheet has room to say all of it: the four conversions with the file types each takes and a tick
 * on the current one, then the three destinations, then the pages people look for at the bottom of
 * a site. Full-width rows, 44px tall, which is a thumb rather than a cursor.
 */
export function MobileNav({
  view,
  conversionId,
  historyCount,
  onViewChange,
  onConversionChange,
  onOpenPage,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  /* Going somewhere closes the sheet: it is a menu, not a second screen to dismiss. */
  const go = (act: () => void) => () => {
    setIsOpen(false);
    act();
  };

  const row = cn(
    'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left',
    'transition-colors hover:bg-state-hover',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand'
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <IconButton
          variant="tertiary"
          size="sm"
          aria-label="Menu"
          className="md:hidden"
        >
          <Menu />
        </IconButton>
      </SheetTrigger>

      {/*
        * The component's own close button is 24px, which is a cursor's target rather than a
        * thumb's, so this sheet brings its own at the size the rest of the rows are.
        */}
      <SheetContent
        side="right"
        className="w-[19rem] max-w-[85vw] p-0"
        isCloseButtonVisible={false}
      >
        <SheetHeader className="flex-row items-center justify-between px-4 pt-4 pb-2">
          <SheetTitle>Menu</SheetTitle>
          <SheetClose asChild>
            <IconButton variant="tertiary" size="sm" aria-label="Close menu">
              <X />
            </IconButton>
          </SheetClose>
        </SheetHeader>

        <SheetBody className="flex flex-col gap-6 px-3 pb-8">
          <section className="flex flex-col gap-1">
            <Typography
              variant="span"
              weight="semibold"
              textColor="light"
              className="px-3 text-xxs uppercase tracking-wide"
            >
              Convert
            </Typography>

            {CONVERSIONS.map((one) => {
              const isCurrent = view === 'converter' && conversionId === one.id;

              return (
                <button
                  key={one.id}
                  type="button"
                  onClick={go(() => onConversionChange(one.id))}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(row, isCurrent && 'bg-surface-accent')}
                >
                  <Check
                    className={cn(
                      'size-4 shrink-0',
                      isCurrent ? 'text-brand-tertiary' : 'invisible'
                    )}
                  />
                  <span className="flex min-w-0 flex-col">
                    <Typography
                      variant="span"
                      weight="medium"
                      textColor={isCurrent ? 'accent' : 'primary'}
                      className="text-sm"
                    >
                      {one.label}
                    </Typography>
                    <Typography
                      variant="span"
                      textColor="secondary"
                      className="truncate text-xs"
                    >
                      {one.extensions.join(', ')}
                    </Typography>
                  </span>
                </button>
              );
            })}
          </section>

          <section className="flex flex-col gap-1">
            <Typography
              variant="span"
              weight="semibold"
              textColor="light"
              className="px-3 text-xxs uppercase tracking-wide"
            >
              Go to
            </Typography>

            {DESTINATIONS.map(({ id, label, icon: Icon }) => {
              const isActive = view === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={go(() => onViewChange(id))}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(row, isActive && 'bg-surface-accent')}
                >
                  <Icon
                    className={cn(
                      'size-4 shrink-0',
                      isActive ? 'text-brand-tertiary' : 'text-ink-secondary'
                    )}
                  />
                  <Typography
                    variant="span"
                    weight="medium"
                    textColor={isActive ? 'accent' : 'primary'}
                    className="text-sm"
                  >
                    {label}
                  </Typography>
                  {id === 'history' && historyCount > 0 && (
                    <span className="ml-auto rounded-full bg-surface-card2 px-2 py-0.5 text-ink-secondary text-xxs">
                      {historyCount}
                    </span>
                  )}
                </button>
              );
            })}
          </section>

          {/* The footer's columns are a long scroll away on a phone; these are the ones asked for. */}
          <section className="flex flex-col gap-1 border-stroke border-t pt-4">
            {STATIC_PAGES.map((one) => (
              <button
                key={one.id}
                type="button"
                onClick={go(() => onOpenPage(one.id))}
                className={cn(row, 'py-2')}
              >
                <Typography
                  variant="span"
                  textColor="secondary"
                  className="text-sm"
                >
                  {one.label}
                </Typography>
              </button>
            ))}
          </section>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
