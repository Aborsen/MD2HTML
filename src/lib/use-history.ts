import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';
import {
  addHistoryEntry,
  clearHistory,
  type HistoryEntry,
  loadHistory,
  removeHistoryEntry,
} from './history';

const byNewest = (a: HistoryEntry, b: HistoryEntry) => b.createdAt - a.createdAt;

interface NewEntry {
  name: string;
  size: number;
  markdown: string;
  stats: HistoryEntry['stats'];
}

/**
 * One history API over two backends: the account (Neon, shared across devices)
 * when signed in, this browser's localStorage otherwise. Local entries are
 * migrated into the account on first sign-in.
 */
export function useHistory(isSignedIn: boolean) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const migratedFor = useRef<boolean | null>(null);

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setEntries(loadHistory());
      return;
    }

    try {
      setEntries((await api.listDocuments()).sort(byNewest));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load history');
    }
  }, [isSignedIn]);

  // Move whatever this browser collected while signed out into the account.
  useEffect(() => {
    if (!isSignedIn || migratedFor.current === true) {
      migratedFor.current = isSignedIn;
      return;
    }

    migratedFor.current = true;

    const local = loadHistory().filter((entry) => entry.markdown);

    (async () => {
      for (const entry of [...local].reverse()) {
        await api
          .createDocument({
            name: entry.name,
            size: entry.size,
            markdown: entry.markdown as string,
            stats: entry.stats,
          })
          .catch(() => undefined);
      }

      if (local.length > 0) {
        clearHistory();
      }

      await refresh();
    })();
  }, [isSignedIn, refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (entry: NewEntry) => {
      if (!isSignedIn) {
        setEntries(addHistoryEntry(entry).history.sort(byNewest));
        return;
      }

      try {
        const created = await api.createDocument(entry);

        setEntries((current) => [created, ...current].sort(byNewest));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Could not save file');
      }
    },
    [isSignedIn]
  );

  const getSource = useCallback(
    async (entry: HistoryEntry): Promise<string | null> => {
      if (entry.markdown) {
        return entry.markdown;
      }

      if (!entry.remote) {
        return null;
      }

      try {
        return (await api.getDocument(entry.id)).markdown ?? null;
      } catch {
        return null;
      }
    },
    []
  );

  const remove = useCallback(
    async (id: string) => {
      if (!isSignedIn) {
        setEntries(removeHistoryEntry(id).sort(byNewest));
        return;
      }

      setEntries((current) => current.filter((entry) => entry.id !== id));
      await api.deleteDocument(id).catch(() => refresh());
    },
    [isSignedIn, refresh]
  );

  const clear = useCallback(async () => {
    if (!isSignedIn) {
      setEntries(clearHistory());
      return;
    }

    setEntries([]);
    await api.clearDocuments().catch(() => refresh());
  }, [isSignedIn, refresh]);

  return { entries, error, add, remove, clear, getSource, refresh };
}
