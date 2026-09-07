import type { HistoryEntry } from './history';

/** The signed-in user, as Neon Auth describes them. */
export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
}

interface ServerDocument {
  id: string;
  name: string;
  size: number;
  stats: HistoryEntry['stats'];
  created_at: string;
  markdown?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: init?.body ? { 'content-type': 'application/json' } : undefined,
    ...init,
  });

  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as {
      error?: string;
      message?: string;
    } | null;

    throw new Error(
      detail?.error ?? detail?.message ?? `Request failed (${response.status})`
    );
  }

  return (await response.json()) as T;
}

function toEntry(doc: ServerDocument): HistoryEntry {
  return {
    id: doc.id,
    name: doc.name,
    size: doc.size,
    createdAt: new Date(doc.created_at).getTime(),
    markdown: doc.markdown,
    stats: doc.stats,
    /** Server-backed rows can always be fetched in full on demand. */
    remote: true,
  };
}

export interface Usage {
  bytes: number;
  documents: number;
  limits: { bytes: number; documents: number; documentBytes: number };
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

export type ShareMode = 'private' | 'link' | 'people';

export interface ShareState {
  mode: ShareMode;
  token: string | null;
  emails: string[];
}

export interface SharedDocument {
  name: string;
  markdown: string;
  createdAt: number;
}

export const api = {
  /** Null when nobody is signed in — Better Auth answers null rather than erroring, and so does this. */
  me: async (): Promise<AuthUser | null> => {
    try {
      const body = await request<{ user?: AuthUser } | null>(
        '/api/auth/get-session'
      );

      return body?.user ?? null;
    } catch {
      return null;
    }
  },

  /**
   * Starts Google sign-in and returns the URL to send the browser to. The callback lands on
   * /api/auth/finish, which exchanges the one-time verifier for a session cookie — only a server
   * can do that — and sends the browser back where it started.
   */
  startGoogleSignIn: async (returnTo: string): Promise<string> => {
    const body = await request<{ url?: string; message?: string }>(
      '/api/auth/sign-in/social',
      {
        method: 'POST',
        body: JSON.stringify({
          provider: 'google',
          callbackURL: `${location.origin}/api/auth/finish?to=${encodeURIComponent(returnTo)}`,
        }),
      }
    );

    if (!body.url) {
      throw new Error(body.message ?? 'Sign-in could not be started');
    }

    return body.url;
  },

  signOut: () =>
    request<{ success?: boolean }>('/api/auth/sign-out', {
      method: 'POST',
      body: '{}',
    }),

  listDocuments: async () => {
    const { documents } = await request<{ documents: ServerDocument[] }>(
      '/api/documents'
    );

    return documents.map(toEntry);
  },

  getDocument: async (id: string) => {
    const { document } = await request<{ document: ServerDocument }>(
      `/api/documents/${id}`
    );

    return toEntry(document);
  },

  createDocument: async (input: {
    name: string;
    size: number;
    markdown: string;
    stats: HistoryEntry['stats'];
  }) => {
    const { document } = await request<{ document: ServerDocument }>(
      '/api/documents',
      { method: 'POST', body: JSON.stringify(input) }
    );

    return toEntry(document);
  },

  deleteDocument: (id: string) =>
    request<{ ok: true }>(`/api/documents/${id}`, { method: 'DELETE' }),

  clearDocuments: () =>
    request<{ ok: true }>('/api/documents', { method: 'DELETE' }),

  /** Documents other people shared with this address, newest share first. */
  listSharedWithMe: async (): Promise<HistoryEntry[]> => {
    const { documents } = await request<{
      documents: Array<
        ServerDocument & { share_token: string; owner_email: string }
      >;
    }>('/api/shared-with-me');

    return documents.map((doc) => ({
      ...toEntry(doc),
      sharedBy: doc.owner_email,
      shareToken: doc.share_token,
    }));
  },

  usage: () => request<Usage>('/api/usage'),

  listKeys: async () => (await request<{ keys: ApiKey[] }>('/api/keys')).keys,

  createKey: (name: string) =>
    request<{ key: string; created: ApiKey }>('/api/keys', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  revokeKey: (id: string) =>
    request<{ ok: true }>(`/api/keys/${id}`, { method: 'DELETE' }),

  getShare: (id: string) => request<ShareState>(`/api/documents/${id}/share`),

  setShareMode: (id: string, mode: ShareMode) =>
    request<ShareState>(`/api/documents/${id}/share`, {
      method: 'PUT',
      body: JSON.stringify({ mode }),
    }),

  addShareRecipient: (id: string, email: string) =>
    request<ShareState>(`/api/documents/${id}/share/people`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  removeShareRecipient: (id: string, email: string) =>
    request<ShareState>(
      `/api/documents/${id}/share/people?email=${encodeURIComponent(email)}`,
      { method: 'DELETE' }
    ),

  /** The public read: 404 when it was never shared, 401/403 when it was not shared with you. */
  getShared: async (token: string): Promise<SharedDocument> => {
    const { document } = await request<{
      document: { name: string; markdown: string; created_at: string };
    }>(`/api/shared/${encodeURIComponent(token)}`);

    return {
      name: document.name,
      markdown: document.markdown,
      createdAt: new Date(document.created_at).getTime(),
    };
  },
};
