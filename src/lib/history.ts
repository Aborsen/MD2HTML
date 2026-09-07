const STORAGE_KEY = 'md2html.history.v1';
const MAX_ENTRIES = 25;
/** Keep the source so an entry can be re-opened; skip storing giant files. */
const MAX_STORED_SOURCE = 400 * 1024;

export interface HistoryEntry {
  id: string;
  name: string;
  size: number;
  createdAt: number;
  /** Markdown source; absent when the file was too large to keep locally. */
  markdown?: string;
  stats: {
    words: number;
    headings: number;
    links: number;
    codeBlocks: number;
    tables: number;
    images: number;
  };
}

function read(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]): HistoryEntry[] {
  let candidates = entries.slice(0, MAX_ENTRIES);

  // localStorage is ~5 MB; drop the oldest sources until the write fits.
  for (let attempt = 0; attempt < candidates.length + 1; attempt += 1) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
      return candidates;
    } catch {
      const lastWithSource = [...candidates]
        .reverse()
        .find((entry) => entry.markdown !== undefined);

      if (!lastWithSource) {
        candidates = candidates.slice(0, -1);
        continue;
      }

      candidates = candidates.map((entry) =>
        entry.id === lastWithSource.id
          ? { ...entry, markdown: undefined }
          : entry
      );
    }
  }

  return candidates;
}

export function loadHistory(): HistoryEntry[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function addHistoryEntry(
  entry: Omit<HistoryEntry, 'id' | 'createdAt'> & { markdown: string }
): { entry: HistoryEntry; history: HistoryEntry[] } {
  const stored: HistoryEntry = {
    ...entry,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    markdown:
      entry.markdown.length > MAX_STORED_SOURCE ? undefined : entry.markdown,
  };

  const history = write([stored, ...read()]);

  return { entry: stored, history };
}

export function removeHistoryEntry(id: string): HistoryEntry[] {
  return write(read().filter((entry) => entry.id !== id));
}

export function clearHistory(): HistoryEntry[] {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}
