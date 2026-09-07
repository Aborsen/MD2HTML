import { useCallback, useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from './components/Dropzone';
import { ConverterPage } from './features/ConverterPage';
import { HistoryPage } from './features/HistoryPage';
import { SharedDocumentPage } from './features/SharedDocumentPage';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { type DocFormat, toFileName } from './lib/format';
import type { HistoryEntry } from './lib/history';
import {
  buildStandaloneHtml,
  getDocStats,
  markdownToHtml,
} from './lib/markdown';
import { mergedName, mergeMarkdown } from './lib/merge';
import { type AppView, goTo, readRoute } from './lib/route';
import type { ConvertedDoc } from './lib/types';
import { useHistory } from './lib/use-history';
import { toast, Toaster } from './ui/components/Toast';
import { TooltipProvider } from './ui/components/Tooltip';
import { Typography } from './ui/components/Typography';

function hasAcceptedExtension(name: string): boolean {
  return ACCEPTED_EXTENSIONS.some((extension) =>
    name.toLowerCase().endsWith(extension)
  );
}

function convert(
  name: string,
  size: number,
  markdown: string,
  createdAt = Date.now(),
  sources?: string[]
): ConvertedDoc {
  const html = markdownToHtml(markdown);

  return {
    id: `${createdAt.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    size,
    createdAt,
    markdown,
    html,
    sources,
    stats: getDocStats(markdown, html),
  };
}

function save(fileName: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Hands over the document in the format the list is showing: the source, or the built page. */
function download(
  name: string,
  markdown: string,
  createdAt: number,
  theme: 'dark' | 'light',
  format: DocFormat
) {
  if (format === 'md') {
    save(toFileName(name, 'md'), markdown, 'text/markdown;charset=utf-8');
    return;
  }

  save(
    toFileName(name, 'html'),
    buildStandaloneHtml({
      title: name,
      body: markdownToHtml(markdown),
      createdAt,
      theme,
    }),
    'text/html;charset=utf-8'
  );
}

function Shell() {
  const { user, error: authError } = useAuth();
  const { theme } = useTheme();
  const [view, setViewState] = useState<AppView>(() => readRoute().view);

  /* The view lives in the address, so a reload lands where you were and Back means something. */
  const setView = useCallback((next: AppView) => {
    setViewState(next);
    goTo(next, readRoute().filter);
  }, []);

  useEffect(() => {
    const sync = () => setViewState(readRoute().view);

    window.addEventListener('popstate', sync);

    return () => window.removeEventListener('popstate', sync);
  }, []);
  const [doc, setDoc] = useState<ConvertedDoc | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const history = useHistory(Boolean(user));

  useEffect(() => {
    if (history.error) {
      toast.error(history.error);
    }
  }, [history.error]);

  useEffect(() => {
    if (authError) {
      toast.error('Sign-in did not complete', { description: authError });
    }
  }, [authError]);

  /** One file converts; several are chained into a single document, in the order they arrive. */
  const handleFiles = useCallback(
    async (files: File[]) => {
      const rejected = files.find((file) => !hasAcceptedExtension(file.name));

      if (rejected) {
        toast.error('Unsupported file type', {
          description: `${rejected.name} — pick one of: ${ACCEPTED_EXTENSIONS.join(', ')}`,
        });
        return;
      }

      if (files.some((file) => file.size > MAX_FILE_SIZE)) {
        toast.error('File is too large', { description: 'The limit is 10 MB.' });
        return;
      }

      setIsBusy(true);

      try {
        const parts = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            markdown: await file.text(),
          }))
        );

        const markdown = mergeMarkdown(parts);
        const names = parts.map((part) => part.name);
        const converted = convert(
          mergedName(names),
          files.reduce((total, file) => total + file.size, 0),
          markdown,
          Date.now(),
          files.length > 1 ? names : undefined
        );

        setDoc(converted);
        setView('converter');

        const stored = await history.add({
          name: converted.name,
          size: converted.size,
          markdown: converted.markdown,
          stats: converted.stats,
        });

        if (stored?.remote) {
          setDoc((current) =>
            current?.id === converted.id
              ? { ...current, remoteId: stored.id }
              : current
          );
        }

        toast.success(
          files.length > 1
            ? `Chained ${files.length} files into one document`
            : 'Converted to HTML',
          { description: converted.name }
        );
      } catch {
        toast.error('Could not read the files');
      } finally {
        setIsBusy(false);
      }
    },
    [history, setView]
  );

  const handleOpenFromHistory = useCallback(
    async (entry: HistoryEntry) => {
      const markdown = await history.getSource(entry);

      if (!markdown) {
        toast.error('The source of this file is no longer available');
        return;
      }

      const reopened = convert(entry.name, entry.size, markdown, entry.createdAt);

      setDoc(entry.remote ? { ...reopened, remoteId: entry.id } : reopened);
      setView('converter');
    },
    [history, setView]
  );

  const handleDownloadFromHistory = useCallback(
    async (entry: HistoryEntry, format: DocFormat) => {
      const markdown = await history.getSource(entry);

      if (!markdown) {
        toast.error('The source of this file is no longer available');
        return;
      }

      download(entry.name, markdown, entry.createdAt, theme, format);
      toast.success('File downloaded', {
        description: toFileName(entry.name, format),
      });
    },
    [history, theme]
  );

  const startOver = useCallback(() => {
    setDoc(null);
    setView('converter');
  }, [setView]);

  const handleMergeFromHistory = useCallback(
    async (entries: HistoryEntry[]) => {
      setIsBusy(true);

      try {
        const parts: { name: string; markdown: string }[] = [];

        for (const entry of entries) {
          const markdown = await history.getSource(entry);

          if (markdown) {
            parts.push({ name: entry.name, markdown });
          }
        }

        if (parts.length < 2) {
          toast.error('Nothing to merge', {
            description: 'The sources of these files are no longer available.',
          });
          return;
        }

        const markdown = mergeMarkdown(parts);
        const names = parts.map((part) => part.name);
        const converted = convert(
          mergedName(names),
          new Blob([markdown]).size,
          markdown,
          Date.now(),
          names
        );

        setDoc(converted);
        setView('converter');

        const stored = await history.add({
          name: converted.name,
          size: converted.size,
          markdown: converted.markdown,
          stats: converted.stats,
        });

        if (stored?.remote) {
          setDoc((current) =>
            current?.id === converted.id
              ? { ...current, remoteId: stored.id }
              : current
          );
        }

        toast.success(`Chained ${parts.length} files into one document`, {
          description: converted.name,
        });
      } finally {
        setIsBusy(false);
      }
    },
    [history]
  );

  const handleDownloadMany = useCallback(
    async (entries: HistoryEntry[], format: DocFormat) => {
      let saved = 0;

      for (const entry of entries) {
        const markdown = await history.getSource(entry);

        if (!markdown) {
          continue;
        }

        download(entry.name, markdown, entry.createdAt, theme, format);
        saved += 1;

        // A browser handed a burst of downloads starts dropping them.
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (saved === 0) {
        toast.error('Nothing could be downloaded');
        return;
      }

      const label = format === 'html' ? 'HTML' : 'Markdown';

      toast.success(
        saved === 1
          ? `${label} file downloaded`
          : `${saved} ${label} files downloaded`
      );
    },
    [history, theme]
  );

  const handleRemoveMany = useCallback(
    async (ids: string[]) => {
      // Only claim success when the store says the delete actually stuck.
      if (await history.removeMany(ids)) {
        toast.info(
          ids.length === 1 ? 'File removed' : `${ids.length} files removed`
        );
      }
    },
    [history]
  );

  const handleClear = useCallback(async () => {
    if (await history.clear()) {
      toast.info('History cleared');
    }
  }, [history]);

  return (
    <div className="flex min-h-full flex-col bg-surface-page">
      <AppHeader
        view={view}
        historyCount={history.entries.length}
        onViewChange={setView}
        onHome={startOver}
      />

      <main className="mx-auto w-full max-w-container-content flex-1 px-6 py-8">
        {view === 'converter' ? (
          <ConverterPage
            doc={doc}
            isBusy={isBusy}
            onFiles={handleFiles}
            onReset={startOver}
          />
        ) : (
          <HistoryPage
            entries={history.entries}
            isSynced={Boolean(user)}
            onOpen={handleOpenFromHistory}
            onFiles={handleFiles}
            onDownload={(entry, format) =>
              void handleDownloadFromHistory(entry, format)
            }
            onDownloadMany={(entries, format) =>
              void handleDownloadMany(entries, format)
            }
            onMerge={(entries) => void handleMergeFromHistory(entries)}
            onRemove={(id) => void history.remove(id)}
            onRemoveMany={(ids) => void handleRemoveMany(ids)}
            onClear={() => void handleClear()}
            onGoToConverter={() => setView('converter')}
          />
        )}
      </main>

      <footer className="border-stroke border-t py-4">
        <div className="mx-auto flex w-full max-w-container-content items-center justify-between px-6">
          <Typography variant="span" textColor="light" className="text-xs">
            {user
              ? 'Your files are saved to your account'
              : 'Files never leave your browser'}
          </Typography>
          <Typography variant="span" textColor="light" className="text-xs">
            Self-contained HTML export
          </Typography>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const token = readRoute().sharedToken;

  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider delayDuration={200}>
          {token ? <SharedDocumentPage token={token} /> : <Shell />}
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
