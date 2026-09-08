import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, type AuthUser } from './api';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  /** Set while the browser is on its way to Google. */
  isSigningIn: boolean;
  /** Why the last sign-in attempt did not finish, in the auth service's own words. */
  error: string | null;
  /** `to` is where to come back to; the connector hand-off needs somewhere other than here. */
  signIn: (to?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * What the server can tell this page about a sign-in, and how it is said.
 *
 * A closed set, because the message is rendered as the app's own words in a toast, and both the
 * outcome and its reason arrive in a link — which is something anybody can write. Anything not on
 * this list is one sentence rather than an echo of the query string.
 */
const OUTCOMES: Record<string, string> = {
  'missing-verifier': 'The sign-in link was incomplete. Try again.',
  unreachable: 'The sign-in service could not be reached.',
  rejected: 'The sign-in service refused the request.',
  'no-session-cookie': 'The sign-in service returned no session.',
};

/**
 * Reads the outcome /api/auth/finish left in the query string and clears it, so a reload does not
 * show a stale message.
 */
function takeSignInOutcome(): string | null {
  const url = new URL(window.location.href);
  const outcome = url.searchParams.get('auth');

  if (!outcome) {
    return null;
  }

  url.searchParams.delete('auth');
  url.searchParams.delete('why');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);

  if (outcome === 'ok') {
    return null;
  }

  return OUTCOMES[outcome] ?? 'Sign-in did not finish. Try again.';
}

/** The one-time value Neon Auth hands back when an OAuth round trip completes. */
const VERIFIER = 'neon_auth_session_verifier';

function takeVerifier(): string | null {
  return new URL(window.location.href).searchParams.get(VERIFIER);
}

function stripVerifier() {
  const url = new URL(window.location.href);

  url.searchParams.delete(VERIFIER);
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

/**
 * Starts the Google round trip and leaves the page.
 *
 * Outside the component because the connector hand-off needs it before `signIn` is declared, and a
 * function that only navigates has no business holding state.
 */
async function handOffToGoogle(to: string): Promise<void> {
  window.location.href = await api.startGoogleSignIn(to);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(() => takeSignInOutcome());

  useEffect(() => {
    const verifier = takeVerifier();

    api.me().then((account) => {
      /*
       * A verifier in the address bar means an OAuth round trip came back to the page instead of
       * to /api/auth/finish — which happens, and leaves both an unfinished sign-in and a URL full
       * of machinery. Finish it here: only a server can trade the verifier for the session cookie,
       * so hand it over and come back clean.
       */
      if (verifier && !account) {
        const to = window.location.pathname + window.location.search.replace(
          new RegExp(`[?&]${VERIFIER}=[^&]*`),
          ''
        );

        window.location.replace(
          `/api/auth/finish?to=${encodeURIComponent(to || '/')}&${VERIFIER}=${encodeURIComponent(verifier)}`
        );
        return;
      }

      if (verifier) {
        stripVerifier();
      }

      /*
       * An assistant sent the person here to authorise a connection. The authorization request is
       * parked on the server under this opaque id; all this page does is make sure there is a
       * session and hand them back to it — which is why the id is the only thing in the address.
       */
      const connect = new URL(window.location.href).searchParams.get('connect');

      if (connect) {
        const back = `/api/oauth/authorize?p=${encodeURIComponent(connect)}`;

        if (account) {
          window.location.replace(back);
        } else {
          setUser(null);
          setIsLoading(false);
          void handOffToGoogle(back).catch((cause: Error) => setError(cause.message));
        }

        return;
      }

      setUser(account);
      setIsLoading(false);
    });
  }, []);

  const signIn = useCallback(async (to?: string) => {
    setIsSigningIn(true);
    setError(null);

    try {
      await handOffToGoogle(
        to ?? window.location.pathname + window.location.search
      );
    } catch (cause) {
      setIsSigningIn(false);
      setError(
        cause instanceof Error ? cause.message : 'Sign-in could not be started'
      );
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.signOut();
      setUser(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign-out failed');
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, isLoading, isSigningIn, error, signIn, signOut }),
    [user, isLoading, isSigningIn, error, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
