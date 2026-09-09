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
import { useT } from './i18n/context';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  /** Set while the browser is on its way to Google. */
  isSigningIn: boolean;
  /** Why the last sign-in attempt did not finish, in the reader's language where we know it. */
  error: string | null;
  /** `to` is where to come back to; the connector hand-off needs somewhere other than here. */
  signIn: (to?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * What the server can tell this page about a sign-in, as the key of the sentence that says it.
 *
 * A closed set, because the message is rendered as the app's own words in a toast, and both the
 * outcome and its reason arrive in a link — which is something anybody can write. Anything not on
 * this list is one sentence rather than an echo of the query string.
 */
const OUTCOMES: Record<string, string> = {
  'missing-verifier': 'auth.error.link',
  unreachable: 'auth.error.unreachable',
  rejected: 'auth.error.rejected',
  'no-session-cookie': 'auth.error.nosession',
};

/**
 * Reads the outcome /api/auth/finish left in the query string and clears it, so a reload does not
 * show a stale message.
 *
 * Answers with a catalogue key rather than a sentence: this runs once, before the first render, and
 * a reader who then switches language should see the message switch with everything else.
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

  return OUTCOMES[outcome] ?? 'auth.error.unfinished';
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
 * function that only navigates has no business holding state. `failed` is the sentence for the one
 * failure a person sees, since `api.ts` has no words of its own.
 */
async function handOffToGoogle(to: string, failed: string): Promise<void> {
  window.location.href = await api.startGoogleSignIn(to, failed);
}

/**
 * Why a sign-in did not happen: either a sentence of ours, by key, or words that came back from
 * somewhere else.
 *
 * Two shapes and not one, because the two cannot be treated alike. Ours is translated where it is
 * read, so it follows a reader who switches language; a message from the auth service or from a
 * thrown `Error` arrives in one language and can only be passed on as it is.
 */
type Failure = { key: string } | { text: string } | null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const t = useT();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [failure, setFailure] = useState<Failure>(() => {
    const key = takeSignInOutcome();

    return key ? { key } : null;
  });

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
          void handOffToGoogle(back, t('auth.error.start')).catch(
            (cause: Error) => setFailure({ text: cause.message })
          );
        }

        return;
      }

      setUser(account);
      setIsLoading(false);
    });
  }, []);

  const signIn = useCallback(
    async (to?: string) => {
      setIsSigningIn(true);
      setFailure(null);

      try {
        await handOffToGoogle(
          to ?? window.location.pathname + window.location.search,
          t('auth.error.start')
        );
      } catch (cause) {
        setIsSigningIn(false);
        setFailure(
          cause instanceof Error
            ? { text: cause.message }
            : { key: 'auth.error.start' }
        );
      }
    },
    [t]
  );

  const signOut = useCallback(async () => {
    try {
      await api.signOut();
      setUser(null);
    } catch (cause) {
      setFailure(
        cause instanceof Error
          ? { text: cause.message }
          : { key: 'auth.error.signout' }
      );
    }
  }, []);

  /* Ours is translated here, at the last moment; anybody else's words are passed straight on. */
  const error =
    failure === null ? null : 'key' in failure ? t(failure.key) : failure.text;

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
