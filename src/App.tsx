import { useCallback, useEffect, useState } from 'react';
import { AppHeader, type AppView } from './components/AppHeader';
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from './components/Dropzone';
import { ConverterPage } from './features/ConverterPage';
import { HistoryPage } from './features/HistoryPage';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { toHtmlFileName } from './lib/format';
import type { HistoryEntry } from './lib/history';
import {
  buildStandaloneHtml,
  getDocStats,
  markdownToHtml,
} from './lib/markdown';
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
  createdAt = Date.now()
): ConvertedDoc {
  const html = markdownToHtml(markdown);

  return {
    id: `${createdAt.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    size,
    createdAt,
    markdown,
    html,
    stats: getDocStats(markdown, html),
  };
}

function downloadHtml(
  name: string,
  html: string,
  createdAt: number,
  theme: 'dark' | 'light'
) {
  const blob = new Blob(
    [buildStandaloneHtml({ title: name, body: html, createdAt, theme })],
    { type: 'text/html;charset=utf-8' }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = toHtmlFileName(name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function Shell() {
  const { user, error: authError } = useAuth();
  const { theme } = useTheme();
  const [view, setView] = useState<AppView>('converter');
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

  const handleFile = useCallback(
    async (file: File) => {
      if (!hasAcceptedExtension(file.name)) {
        toast.error('Unsupported file type', {
          description: `Pick one of: ${ACCEPTED_EXTENSIONS.join(', ')}`,
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File is too large', { description: 'The limit is 10 MB.' });
        return;
      }

      setIsBusy(true);

      try {
        const markdown = await file.text();
        const converted = convert(file.name, file.size, markdown);

        setDoc(converted);
        setView('converter');

        await history.add({
          name: converted.name,
          size: converted.size,
          markdown: converted.markdown,
          stats: converted.stats,
        });

        toast.success('Converted to HTML', { description: file.name });
      } catch {
        toast.error('Could not read the file');
      } finally {
        setIsBusy(false);
      }
    },
    [history]
  );

  const handleOpenFromHistory = useCallback(
    async (entry: HistoryEntry) => {
      const markdown = await history.getSource(entry);

      if (!markdown) {
        toast.error('The source of this file is no longer available');
        return;
      }

      setDoc(convert(entry.name, entry.size, markdown, entry.createdAt));
      setView('converter');
    },
    [history]
  );

  const handleDownloadFromHistory = useCallback(
    async (entry: HistoryEntry) => {
      const markdown = await history.getSource(entry);

      if (!markdown) {
        toast.error('The source of this file is no longer available');
        return;
      }

      downloadHtml(entry.name, markdownToHtml(markdown), entry.createdAt, theme);
      toast.success('HTML file downloaded', {
        description: toHtmlFileName(entry.name),
      });
    },
    [history, theme]
  );

  const startOver = useCallback(() => {
    setDoc(null);
    setView('converter');
  }, []);

  const handleClear = useCallback(async () => {
    await history.clear();
    toast.info('History cleared');
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
            onFile={handleFile}
            onReset={startOver}
          />
        ) : (
          <HistoryPage
            entries={history.entries}
            isSynced={Boolean(user)}
            onOpen={handleOpenFromHistory}
            onDownload={handleDownloadFromHistory}
            onRemove={(id) => void history.remove(id)}
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

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider delayDuration={200}>
          <Shell />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
