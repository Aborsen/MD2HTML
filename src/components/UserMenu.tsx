import { LogOut, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { Hint } from './Hint';
import { IconButton } from '@/ui/components/IconButton';
import { Skeleton } from '@/ui/components/Skeleton';
import { Typography } from '@/ui/components/Typography';

/** Google button when signed out, avatar + sign-out when signed in. */
export function UserMenu() {
  const { user, isLoading, isConfigured, signOut, mountSignInButton } =
    useAuth();
  const buttonSlot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user || isLoading || !isConfigured || !buttonSlot.current) {
      return;
    }

    buttonSlot.current.replaceChildren();
    mountSignInButton(buttonSlot.current, 'dark');
  }, [user, isLoading, isConfigured, mountSignInButton]);

  if (!isConfigured) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className="h-8 w-28 rounded-full" />;
  }

  if (!user) {
    return <div ref={buttonSlot} className="flex items-center" />;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        {user.picture ? (
          <img
            src={user.picture}
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
          {user.name ?? user.email}
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
