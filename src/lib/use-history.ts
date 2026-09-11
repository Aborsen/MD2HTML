import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';
import type { Translate } from './i18n/context';
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
  kind: HistoryEntry['kind'];
  size: number;
  markdown: string;
  stats: HistoryEntry['stats'];
}

/**
 * One history API over two stores, and they mean different things.
 *
 * This browser's localStorage holds what has been converted here: everything, signed in or not,
 * twenty-five rows deep. The account holds what somebody chose to keep — and nothing arrives there
 * on its own. A conversion is a thing you looked at; a document in the account is a thing you
 * decided to have, and until this change the app made that decision for you the moment a file was
 * dropped.
 *
 * So `keep` writes locally and `save` writes to the account, and a signed-in reader's list is both
 * at once: the saved documents, and the local rows that are not saved yet.
 *
 * What it says when something fails is the screen's language, so the screen hands it a `t`. It is
 * kept in a ref and not read from the closure: `t` is a new function every time the catalogue
 * changes, and putting it in these dependency lists would make switching language reload the list
 * from the server — a request nobody asked for, for words that are only read when something breaks.
 */
export function useHistory(isSignedIn: boolean, t: Translate) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const words = useRef(t);
  /*
   * The list as the callbacks see it. `remove` has to know which store a row is in, and reading
   * that from the closure would rebuild every handler on every keystroke of the list.
   */
  const entriesRef = useRef<HistoryEntry[]>(entries);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    words.current = t;
  }, [t]);

  const refresh = useCallback(async () => {
    const local = loadHistory();

    if (!isSignedIn) {
      setEntries(local);
      return;
    }

    try {
      /*
       * Both lists, newest first, and each row still says which store it came from. A local row
       * whose text was also saved would appear twice, so `save` drops the local one as it goes.
       */
      setEntries([...(await api.listDocuments()), ...local].sort(byNewest));
      setError(null);
    } catch (cause) {
      setEntries(local);
      setError(
        cause instanceof Error
          ? cause.message
          : words.current('history.error.load')
      );
    }
  }, [isSignedIn]);

  /*
   * Signing in used to empty this browser's history into the account, one document per row. It was
   * the same decision made twice over: twenty-five things somebody had converted to look at became
   * twenty-five documents they had never asked to keep. They stay here now, listed beside the
   * saved ones and marked, and the person saves the ones they want.
   */

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** Returns the stored entry, so the caller can hang account-only actions off its id. */
  /** What was converted here, in this browser. Called for every conversion, signed in or not. */
  const keep = useCallback((entry: NewEntry): HistoryEntry => {
    const { entry: stored, history } = addHistoryEntry(entry);

    setEntries((current) => {
      const remote = current.filter((one) => one.remote);

      return [...remote, ...history].sort(byNewest);
    });

    return stored;
  }, []);

  /**
   * Into the account, because somebody asked.
   *
   * The local row it came from is dropped in the same breath: it is the same document, and a list
   * showing it twice would invite deleting the saved one to tidy up.
   */
  const save = useCallback(
    async (entry: NewEntry, localId?: string): Promise<HistoryEntry | null> => {
      try {
        const created = await api.createDocument(entry);

        if (localId) {
          removeHistoryEntry(localId);
        }

        setEntries((current) =>
          [created, ...current.filter((one) => one.id !== localId)].sort(byNewest)
        );

        return created;
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : words.current('history.error.save')
        );

        return null;
      }
    },
    []
  );

  const getSource = useCallback(
    async (entry: HistoryEntry): Promise<string | null> => {
      if (entry.markdown) {
        return entry.markdown;
      }

      try {
        // Someone else's document is read through its share token — the one place that decides
        // whether this account may have it.
        if (entry.shareToken) {
          return (await api.getShared(entry.shareToken)).markdown;
        }

        return entry.remote
          ? ((await api.getDocument(entry.id)).markdown ?? null)
          : null;
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
          ? words.current('history.error.delete', {
              reason:
                first.reason instanceof Error
                  ? first.reason.message
                  : words.current('history.error.delete.reason'),
            })
          : words.current('history.error.delete.some', {
              failed: failed.length,
              total: ids.length,
            })
      );
      await refresh();

      return false;
    },
    [refresh]
  );

  /*
   * Which store a row lives in is a property of the row, not of the session: a signed-in person's
   * list holds both, and deleting has to go to the right one or it silently does nothing.
   */
  const removeLocal = useCallback((ids: string[]) => {
    let next: HistoryEntry[] = loadHistory();

    for (const id of ids) {
      next = removeHistoryEntry(id);
    }

    setEntries((current) => {
      const remote = current.filter(
        (one) => one.remote && !ids.includes(one.id)
      );

      return [...remote, ...next].sort(byNewest);
    });
  }, []);

  const remove = useCallback(
    async (id: string) => {
      const row = entriesRef.current.find((one) => one.id === id);

      if (!row?.remote) {
        removeLocal([id]);
        return true;
      }

      return removeRemote([id]);
    },
    [removeLocal, removeRemote]
  );

  const removeMany = useCallback(
    async (ids: string[]) => {
      const rows = entriesRef.current.filter((one) => ids.includes(one.id));
      const local = rows.filter((one) => !one.remote).map((one) => one.id);
      const remote = rows.filter((one) => one.remote).map((one) => one.id);

      if (local.length > 0) {
        removeLocal(local);
      }

      return remote.length > 0 ? removeRemote(remote) : true;
    },
    [removeLocal, removeRemote]
  );

  const clear = useCallback(async () => {
    clearHistory();

    if (!isSignedIn) {
      setEntries([]);
      return true;
    }

    // Both stores: the list said "clear", and the list is both.
    setEntries([]);

    try {
      await api.clearDocuments();
      return true;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : words.current('history.error.clear')
      );
      await refresh();
      return false;
    }
  }, [isSignedIn, refresh]);

  return {
    entries,
    error,
    keep,
    save,
    remove,
    removeMany,
    clear,
    getSource,
    refresh,
  };
}
