import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { GoogleGlyph } from './GoogleGlyph';
import { Hint } from './Hint';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import { Skeleton } from '@/ui/components/Skeleton';
import { Typography } from '@/ui/components/Typography';

/** Sign-in button when signed out, avatar + sign-out when signed in. */
export function UserMenu() {
  const { user, isLoading, isSigningIn, signIn, signOut } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-8 w-28 rounded-full" />;
  }

  if (!user) {
    return (
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
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
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
      </span>

      <Hint content="Sign out">
        <IconButton
          variant="tertiary"
          size="sm"
          aria-label="Sign out"
          onClick={() => void signOut()}
        >
          <LogOut />
        </IconButton>
      </Hint>
    </div>
  );
}
