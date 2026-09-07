import { useCallback, useEffect, useState } from 'react';
import { AppHeader, type AppView } from './components/AppHeader';
import {
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE,
} from './components/Dropzone';
import { ConverterPage } from './features/ConverterPage';
import { HistoryPage } from './features/HistoryPage';
import { toHtmlFileName } from './lib/format';
import {
  addHistoryEntry,
  clearHistory,
  type HistoryEntry,
  loadHistory,
  removeHistoryEntry,
} from './lib/history';
import { buildStandaloneHtml, getDocStats, markdownToHtml } from './lib/markdown';
import type { ConvertedDoc } from './lib/types';
import { Toaster } from './ui/components/Toast';
import { toast } from './ui/components/Toast';
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

function downloadHtml(name: string, html: string, createdAt: number) {
  const blob = new Blob(
    [buildStandaloneHtml({ title: name, body: html, createdAt })],
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

export default function App() {
  const [view, setView] = useState<AppView>('converter');
  const [doc, setDoc] = useState<ConvertedDoc | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (!hasAcceptedExtension(file.name)) {
      toast.error('Unsupported file type', {
        description: `Pick one of: ${ACCEPTED_EXTENSIONS.join(', ')}`,
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File is too large', {
        description: 'The limit is 10 MB.',
      });
      return;
    }

    setIsBusy(true);

    try {
      const markdown = await file.text();
      const converted = convert(file.name, file.size, markdown);

      setDoc(converted);
      setView('converter');

      const { history: nextHistory } = addHistoryEntry({
        name: converted.name,
        size: converted.size,
        markdown: converted.markdown,
        stats: converted.stats,
      });
      setHistory(nextHistory.sort((a, b) => b.createdAt - a.createdAt));

      toast.success('Converted to HTML', { description: file.name });
    } catch {
      toast.error('Could not read the file');
    } finally {
      setIsBusy(false);
    }
  }, []);

  const handleOpenFromHistory = useCallback((entry: HistoryEntry) => {
    if (!entry.markdown) {
      return;
    }

    setDoc(
      convert(entry.name, entry.size, entry.markdown, entry.createdAt)
    );
    setView('converter');
  }, []);

  const handleDownloadFromHistory = useCallback((entry: HistoryEntry) => {
    if (!entry.markdown) {
      return;
    }

    downloadHtml(entry.name, markdownToHtml(entry.markdown), entry.createdAt);
    toast.success('HTML file downloaded', {
      description: toHtmlFileName(entry.name),
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setHistory(removeHistoryEntry(id).sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const handleClear = useCallback(() => {
    setHistory(clearHistory());
    toast.info('History cleared');
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-full flex-col bg-surface-page">
        <AppHeader
          view={view}
          historyCount={history.length}
          onViewChange={setView}
        />

        <main className="mx-auto w-full max-w-container-content flex-1 px-6 py-8">
          {view === 'converter' ? (
            <ConverterPage
              doc={doc}
              isBusy={isBusy}
              onFile={handleFile}
              onReset={() => setDoc(null)}
            />
          ) : (
            <HistoryPage
              entries={history}
              onOpen={handleOpenFromHistory}
              onDownload={handleDownloadFromHistory}
              onRemove={handleRemove}
              onClear={handleClear}
              onGoToConverter={() => setView('converter')}
            />
          )}
        </main>

        <footer className="border-stroke border-t py-4">
          <div className="mx-auto flex w-full max-w-container-content items-center justify-between px-6">
            <Typography variant="span" textColor="light" className="text-xs">
              Files never leave your browser
            </Typography>
            <Typography variant="span" textColor="light" className="text-xs">
              Self-contained HTML export
            </Typography>
          </div>
        </footer>

        <Toaster />
      </div>
    </TooltipProvider>
  );
}
