const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: Record<string, string | number>
      ) => void;
      prompt: () => void;
      disableAutoSelect: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

let scriptPromise: Promise<GoogleIdentity> | null = null;

/** Loads Google Identity Services once and resolves with its global. */
export function loadGoogleIdentity(): Promise<GoogleIdentity> {
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`
      );
      const script = existing ?? document.createElement('script');

      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => {
        if (window.google?.accounts?.id) {
          resolve(window.google);
        } else {
          reject(new Error('Google Identity Services failed to initialise'));
        }
      });
      script.addEventListener('error', () =>
        reject(new Error('Could not load Google Identity Services'))
      );

      if (!existing) {
        document.head.appendChild(script);
      }
    });
  }

  return scriptPromise;
}
