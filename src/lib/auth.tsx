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
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

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

  const why = url.searchParams.get('why');

  url.searchParams.delete('auth');
  url.searchParams.delete('why');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);

  return outcome === 'ok' ? null : why ? `${outcome} — ${why}` : outcome;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(() => takeSignInOutcome());

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      const returnTo = window.location.pathname + window.location.search;

      window.location.href = await api.startGoogleSignIn(returnTo);
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
