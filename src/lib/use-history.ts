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

  /*
   * The list is updated before the server answers, so a delete feels instant. When the server
   * refuses, the rows come back AND the failure is reported: a delete that only appeared to work
   * is the one bug that cannot be noticed from the inside.
   */
  const removeRemote = useCallback(
    async (ids: string[]) => {
      setEntries((current) =>
        current.filter((entry) => !ids.includes(entry.id))
      );

      const results = await Promise.allSettled(
        ids.map((id) => api.deleteDocument(id))
      );
      const failed = results.filter((result) => result.status === 'rejected');

      if (failed.length === 0) {
        return true;
      }

      const [first] = failed as PromiseRejectedResult[];

      setError(
        failed.length === ids.length
          ? `Could not delete: ${first.reason instanceof Error ? first.reason.message : 'server refused'}`
          : `${failed.length} of ${ids.length} files could not be deleted`
      );
      await refresh();

      return false;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!isSignedIn) {
        setEntries(removeHistoryEntry(id).sort(byNewest));
        return true;
      }

      return removeRemote([id]);
    },
    [isSignedIn, removeRemote]
  );

  const removeMany = useCallback(
    async (ids: string[]) => {
      if (!isSignedIn) {
        let next: HistoryEntry[] = [];

        for (const id of ids) {
          next = removeHistoryEntry(id);
        }

        setEntries(next.sort(byNewest));
        return true;
      }

      return removeRemote(ids);
    },
    [isSignedIn, removeRemote]
  );

  const clear = useCallback(async () => {
    if (!isSignedIn) {
      setEntries(clearHistory());
      return true;
    }

    setEntries([]);

    try {
      await api.clearDocuments();
      return true;
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Could not clear the history'
      );
      await refresh();
      return false;
    }
  }, [isSignedIn, refresh]);

  return { entries, error, add, remove, removeMany, clear, getSource, refresh };
}
