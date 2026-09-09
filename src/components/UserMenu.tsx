import { KeyRound, LogIn, LogOut, Moon, Plug, Sun, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme';
import { ApiKeysDialog } from './ApiKeysDialog';
import { AuthDialog } from './AuthDialog';
import { McpDialog } from './McpDialog';
import { GoogleGlyph } from './GoogleGlyph';
import { Hint } from './Hint';
import { Button } from '@/ui/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/components/DropdownMenu';
import { IconButton } from '@/ui/components/IconButton';
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger,
} from '@/ui/components/SegmentedControl';
import { Skeleton } from '@/ui/components/Skeleton';
import { Typography } from '@/ui/components/Typography';

function ThemeChoice() {
  const t = useT();
  const { theme, setTheme } = useTheme();

  return (
    <SegmentedControl
      size="sm"
      value={theme}
      onValueChange={(value) => setTheme(value === 'light' ? 'light' : 'dark')}
      // The menu closes on click by default; theme is a setting, not a command.
      onClick={(event) => event.preventDefault()}
    >
      <SegmentedControlList className="w-full">
        <SegmentedControlTrigger value="dark">
          <Moon />
          {t('header.theme.dark')}
        </SegmentedControlTrigger>
        <SegmentedControlTrigger value="light">
          <Sun />
          {t('header.theme.light')}
        </SegmentedControlTrigger>
      </SegmentedControlList>
    </SegmentedControl>
  );
}

/** Account menu when signed in — theme and sign-out live behind the avatar. */
export function UserMenu() {
  const t = useT();
  const { user, isLoading, isSigningIn, signIn, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [isKeysOpen, setIsKeysOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMcpOpen, setIsMcpOpen] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-8 w-28 rounded-full" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <Hint
          content={
            theme === 'dark'
              ? t('header.theme.tolight')
              : t('header.theme.todark')
          }
        >
          <IconButton
            variant="tertiary"
            size="sm"
            aria-label={t('header.theme.toggle')}
            onClick={toggle}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </IconButton>
        </Hint>

        {/*
          * The label goes below `sm`, and the Google mark carries it.
          *
          * The header holds a wordmark, a menu, three destinations, a theme switch and this. At
          * 390px they add up to 459px, so the page scrolled sideways on every route on a phone —
          * and a page that scrolls sideways reads as broken before anybody reaches the content.
          * The mark is the most recognisable 20px in the row, so it is the one that can lose its
          * caption; the accessible name stays.
          */}
        <Button
          variant="secondary"
          size="sm"
          rounded="full"
          aria-label={t('header.signin')}
          isLoading={isSigningIn}
          leftSlot={<LogIn />}
          /*
           * A width that does not move when the language does.
           *
           * "Sign in" is 91px and "Se connecter" is 136px, and because this button is the last
           * thing in a right-anchored row, those 45px came off the left — so the theme and
           * language buttons beside it jumped every time somebody switched language. The minimum
           * is the widest of the five, measured, so all five render the same bar. Below `sm` the
           * label is hidden and the button is the mark alone, so the minimum lifts there only.
           */
          className="!px-2 sm:!px-3 sm:min-w-[8.5rem] sm:justify-center"
          onClick={() => setIsAuthOpen(true)}
        >
          <span className="hidden sm:inline">{t('header.signin')}</span>
        </Button>

        <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      </div>
    );
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('header.account')}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-transparent py-0.5 pr-2 pl-0.5 transition-colors hover:bg-state-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card pressed:bg-state-hover"
        >
          {user.image ? (
            <img
              src={user.image}
              alt=""
              referrerPolicy="no-referrer"
              className="size-7 rounded-full border border-stroke object-cover"
            />
          ) : (
            <span className="flex size-7 items-center justify-center rounded-full bg-surface-card2 text-ink-secondary">
              <User className="size-4" />
            </span>
          )}

          <Typography
            variant="span"
            textColor="secondary"
            className="hidden max-w-[12rem] truncate text-xs md:block"
          >
            {user.name}
          </Typography>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 min-w-[15rem] p-2">
        <div className="flex flex-col gap-0.5 px-1 pt-1 pb-2">
          <Typography variant="span" weight="semibold" textColor="primary">
            {user.name}
          </Typography>
          {user.email && (
            <Typography
              variant="span"
              textColor="secondary"
              className="truncate text-xs"
            >
              {user.email}
            </Typography>
          )}
        </div>

        <DropdownMenuSeparator className="my-1" />

        <div className="flex flex-col gap-1.5 px-1 py-1.5">
          <Typography variant="span" textColor="secondary" className="text-xs">
            {t('header.theme.label')}
          </Typography>
          <ThemeChoice />
        </div>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem onSelect={() => setIsKeysOpen(true)}>
          <KeyRound />
          {t('header.apikeys')}
        </DropdownMenuItem>

        {/* Its own dialog: somebody opening this came for the address, not for a key. */}
        <DropdownMenuItem onSelect={() => setIsMcpOpen(true)}>
          <Plug />
          {t('header.connector')}
        </DropdownMenuItem>

        <DropdownMenuItem variant="danger" onSelect={() => void signOut()}>
          <LogOut />
          {t('header.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <ApiKeysDialog open={isKeysOpen} onOpenChange={setIsKeysOpen} />
    <McpDialog open={isMcpOpen} onOpenChange={setIsMcpOpen} />
    </>
  );
}
