import type { HistoryEntry } from './history';

export interface AuthUser {
  email: string;
  name: string | null;
  picture: string | null;
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
    const detail = await response.json().catch(() => null);

    throw new Error(
      (detail as { error?: string } | null)?.error ??
        `Request failed (${response.status})`
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

export const api = {
  me: () => request<{ user: AuthUser | null }>('/api/auth/me'),

  signInWithGoogle: (credential: string) =>
    request<{ user: AuthUser }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

  signOut: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),

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
};
