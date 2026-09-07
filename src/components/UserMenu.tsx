import { LogOut, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
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
          Dark
        </SegmentedControlTrigger>
        <SegmentedControlTrigger value="light">
          <Sun />
          Light
        </SegmentedControlTrigger>
      </SegmentedControlList>
    </SegmentedControl>
  );
}

/** Account menu when signed in — theme and sign-out live behind the avatar. */
export function UserMenu() {
  const { user, isLoading, isSigningIn, signIn, signOut } = useAuth();
  const { theme, toggle } = useTheme();

  if (isLoading) {
    return <Skeleton className="h-8 w-28 rounded-full" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <Hint content={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          <IconButton
            variant="tertiary"
            size="sm"
            aria-label="Switch theme"
            onClick={toggle}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </IconButton>
        </Hint>

        <Button
          variant="secondary"
          size="sm"
          rounded="full"
          isLoading={isSigningIn}
          leftSlot={<GoogleGlyph />}
          onClick={() => void signIn()}
        >
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account"
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
            Theme
          </Typography>
          <ThemeChoice />
        </div>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem variant="danger" onSelect={() => void signOut()}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
