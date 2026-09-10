import {
  BookOpen,
  Check,
  ChevronDown,
  FileCode2,
  History,
  Newspaper,
} from 'lucide-react';
import { CONVERSIONS, type ConversionId } from '@shared/conversions';
import { useI18n, useT } from '@/lib/i18n/context';
import { Logo } from './Logo';
import { LanguageMenu } from './LanguageMenu';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';
import type { StaticPageId } from '@/lib/pages';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/DropdownMenu';
import { Separator } from '@/ui/components/Separator';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

import type { AppView, Destination } from '@/lib/route';

export type { AppView, Destination };

interface AppHeaderProps {
  view: AppView;
  /** Which conversion the converter is on, so the menu can show it as the current one. */
  conversionId: ConversionId;
  historyCount: number;
  onViewChange: (view: Destination) => void;
  onConversionChange: (id: ConversionId) => void;
  /** Only the phone's menu offers these; on a wide screen they live in the footer. */
  onOpenPage: (id: StaticPageId) => void;
  /** The logo doubles as "start over": back to the converter with no file open. */
  onHome: () => void;
}

/*
 * The converter is a menu of its own; these are the destinations beside it.
 *
 * A key rather than a label: what a destination is called is language, and the words come from the
 * catalogue at render time. What is here is what does not change with the language — which view,
 * and which glyph.
 */
/*
 * The order, the ids and the glyphs. Every label is read from the catalogue at render time.
 */
const NAV_ITEMS = [
  { id: 'history' as const, label: 'header.nav.history', icon: History },
  { id: 'docs' as const, label: 'header.nav.docs', icon: BookOpen },
  { id: 'blog' as const, label: 'header.nav.blog', icon: Newspaper },
];

/*
 * Nothing here has a fixed width, and that is the point.
 *
 * Two attempts went the other way. Per-item minimums sized to the longest translation, then one
 * width for all three — and both made the spacing worse, because what a reader sees is the gap
 * between words, not between invisible boxes. Equal boxes with unequal labels put the leftover room
 * beside the short ones: "Docs" ended up with more air around it than "History", and the Converter
 * trigger beside them had no minimum at all, so the first gap was a different kind from the rest.
 *
 * Content-width with one gap is even by construction. Every one of these controls, the Converter
 * dropdown included, carries the same `md:px-3`, and the nav sets `md:gap-1` — so the distance from
 * any word to the next is 12 + 4 + 12 in every language.
 *
 * The reason a fixed width seemed necessary was the bar moving on a language switch, and it was
 * never this bar: `nav` is pushed right by `ml-auto` and the controls sit after it with `md:ml-0`,
 * so the nav grows leftwards into empty space and the buttons on the right do not move. Measured:
 * the nav went 399px to 446px between English and French while the language button stayed at the
 * same x. What did move was the Sign in button, which is the one thing that still has a minimum.
 */

export function AppHeader({
  view,
  conversionId,
  historyCount,
  onViewChange,
  onConversionChange,
  onOpenPage,
  onHome,
}: AppHeaderProps) {
  const t = useT();
  const { content } = useI18n();
  const isConverter = view === 'converter';
  return (
    <header className="sticky top-0 z-20 border-stroke border-b bg-surface-card/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-content items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={onHome}
          aria-label={t('header.home')}
          className={cn(
            'cursor-pointer rounded-md px-1 py-0.5 transition-opacity',
            'hover:opacity-80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2'
          )}
        >
          <Logo />
        </button>

        <Separator orientation="vertical" className="hidden h-5 lg:block" />

        {/*
          * The line beside the wordmark says which conversion you are on, because with four of
          * them a fixed "Markdown to HTML converter" is wrong on three pages out of four. Away
          * from the converter it names the app instead of whatever conversion was last picked.
          *
          * It waits for `lg`. At 768 the row is wordmark, this line, four labelled destinations
          * and an account — 888px of content in a 768px window — and of those, this line is the
          * one the page's own h1 already says.
          */}
        <Typography
          variant="span"
          weight="medium"
          textColor="secondary"
          className="hidden lg:block"
        >
          {view === 'converter'
            ? t('header.tagline.conversion', {
                name: content.conversions[conversionId].label,
              })
            : t('header.tagline.app')}
        </Typography>

        {/*
          * The row of destinations belongs to a wide screen. Below `md` it is a sheet — see
          * `MobileNav` — because four conversions, three destinations, a theme switch and an
          * account do not fit in 390px, and the version that did fit was a row of unnamed icons.
          */}
        <nav className="ml-auto hidden items-center gap-0.5 md:flex md:gap-1">
          {/*
            * Four conversions behind one item. A row of four in the header would crowd out the rest
            * of the app on a phone and still not say which one you are on; a menu says both.
            */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t('header.nav.converter')}
                title={t('header.nav.converter')}
                className={cn(
                  'flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-transparent px-2 font-medium text-sm transition-colors md:px-3',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2',
                  isConverter
                    ? 'bg-surface-accent text-ink-highlight'
                    : 'text-ink-secondary hover:bg-state-hover hover:text-ink-body'
                )}
              >
                <FileCode2 className="size-4 shrink-0" />
                <span className="hidden md:inline">
                  {t('header.nav.converter')}
                </span>
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
                      {content.conversions[one.id].label}
                    </Typography>
                    <Typography variant="span" textColor="secondary" className="text-xs">
                      {one.extensions.join(', ')}
                    </Typography>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {NAV_ITEMS.map(({ id, label: key, icon: Icon }) => {
            const isActive = view === id;
            const label = t(key);

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

        <Separator orientation="vertical" className="hidden h-5 md:block" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {/*
            * Before the account, and outside it on purpose.
            *
            * A reader who has landed in a language they cannot read has to be able to get out
            * without opening a menu whose label they cannot read either — so the switcher is a
            * button in the bar, not an entry inside the account dropdown, and it is there whether
            * anybody is signed in or not.
            */}
          <LanguageMenu className="hidden sm:inline-flex" />

          <UserMenu />

          <MobileNav
            view={view}
            conversionId={conversionId}
            historyCount={historyCount}
            onViewChange={onViewChange}
            onConversionChange={onConversionChange}
            onOpenPage={onOpenPage}
          />
        </div>
      </div>
    </header>
  );
}
