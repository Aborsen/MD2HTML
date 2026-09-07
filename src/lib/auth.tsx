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
import { GOOGLE_CLIENT_ID, loadGoogleIdentity } from './google';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  /** False when VITE_GOOGLE_CLIENT_ID is missing — the app stays local-only. */
  isConfigured: boolean;
  signOut: () => Promise<void>;
  /** Renders Google's own button into the given element. */
  mountSignInButton: (element: HTMLElement, theme: 'dark' | 'light') => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = Boolean(GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    api
      .me()
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [isConfigured]);

  const handleCredential = useCallback(async (credential: string) => {
    const result = await api.signInWithGoogle(credential);

    setUser(result.user);
  }, []);

  const mountSignInButton = useCallback(
    (element: HTMLElement, theme: 'dark' | 'light') => {
      const clientId = GOOGLE_CLIENT_ID;

      if (!clientId) {
        return;
      }

      loadGoogleIdentity()
        .then((google) => {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response.credential) {
                void handleCredential(response.credential);
              }
            },
            cancel_on_tap_outside: true,
          });

          google.accounts.id.renderButton(element, {
            type: 'standard',
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'medium',
            shape: 'pill',
            text: 'signin_with',
            logo_alignment: 'left',
          });
        })
        .catch(() => undefined);
    },
    [handleCredential]
  );

  const signOut = useCallback(async () => {
    await api.signOut().catch(() => undefined);

    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }

    setUser(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, isLoading, isConfigured, signOut, mountSignInButton }),
    [user, isLoading, isConfigured, signOut, mountSignInButton]
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
