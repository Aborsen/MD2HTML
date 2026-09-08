import { useCallback, useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { MAX_FILE_SIZE } from './components/Dropzone';
import { KEEP_BYTES } from '@shared/limits';
import {
  conversion,
  type ConversionId,
  DEFAULT_CONVERSION,
} from '@shared/conversions';
import { convertFile, conversionForFiles } from './lib/convert';
import { ConverterPage } from './features/ConverterPage';
import { ArticlePage } from './features/ArticlePage';
import { BlogPage } from './features/BlogPage';
import { DocsPage } from './features/DocsPage';
import { HistoryPage } from './features/HistoryPage';
import { SharedDocumentPage } from './features/SharedDocumentPage';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { type DocFormat, formatBytes, toFileName } from './lib/format';
import { downloadDoc } from './lib/download';
import type { HistoryEntry } from './lib/history';
import { getDocStats, markdownToHtml } from './lib/markdown';
import { mergedName, mergeMarkdown } from './lib/merge';
import {
  type AppView,
  goTo,
  goToArticle,
  goToConversion,
  readRoute,
} from './lib/route';
import type { ConvertedDoc } from './lib/types';
import { useHistory } from './lib/use-history';
import { toast, Toaster } from './ui/components/Toast';
import { TooltipProvider } from './ui/components/Tooltip';
import { Typography } from './ui/components/Typography';

function convert(
  kind: ConversionId,
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
    kind,
    size,
    createdAt,
    markdown,
    html,
    sources,
    stats: getDocStats(markdown, html),
  };
}

function Shell() {
  const { user, error: authError } = useAuth();
  const { theme } = useTheme();
  const [view, setViewState] = useState<AppView>(() => readRoute().view);
  const [conversionId, setConversionId] = useState<ConversionId>(
    () => readRoute().conversionId
  );
  const [articleSlug, setArticleSlug] = useState<string | null>(
    () => readRoute().articleSlug
  );

  /* The view lives in the address, so a reload lands where you were and Back means something. */
  const setView = useCallback((next: AppView) => {
    setViewState(next);
    setArticleSlug(null);
    goTo(next, readRoute().filter);
  }, []);

  /*
   * Choosing a conversion is a move to its page, and it clears whatever was open: the document on
   * screen belongs to the conversion that made it, and leaving it there under a different heading
   * is how somebody comes to think the new conversion produced it.
   */
  const chooseConversion = useCallback((next: ConversionId) => {
    setConversionId(next);
    setViewState('converter');
    setArticleSlug(null);
    setDoc(null);
    goToConversion(next);
  }, []);

  const openArticle = useCallback((slug: string) => {
    setViewState('blog');
    setArticleSlug(slug);
    goToArticle(slug);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const sync = () => {
      const route = readRoute();

      setViewState(route.view);
      setConversionId(route.conversionId);
      setArticleSlug(route.articleSlug);
    };

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

  /**
   * One file converts; several are chained into a single document, in the order they arrive.
   *
   * Which conversion runs is decided by what was dropped, not only by the page it was dropped on: a
   * .docx on the Markdown screen means "convert this", and answering "wrong page" to a file the app
   * plainly knows how to read is a refusal nobody would thank us for.
   */
  const handleFiles = useCallback(
    async (files: File[]) => {
      const { id, rejected } = conversionForFiles(conversionId, files);

      if (rejected) {
        toast.error('Not a file this can convert', { description: rejected });
        return;
      }

      /*
       * The total, not each file: several dropped files become one document, and one document is
       * what the limit is about. Checking them one at a time let three 4 MB files through to a
       * save that then refused the 12 MB they made.
       */
      const dropped = files.reduce((total, file) => total + file.size, 0);

      if (dropped > MAX_FILE_SIZE) {
        toast.error(files.length > 1 ? 'Those files are too large' : 'File is too large', {
          description: `${formatBytes(dropped)} — the limit for one document is ${formatBytes(MAX_FILE_SIZE)}.`,
        });
        return;
      }

      setIsBusy(true);

      try {
        const parts = await Promise.all(
          files.map(async (file) => {
            const done = await convertFile(id, file);

            return { name: done.name, markdown: done.markdown };
          })
        );

        const markdown = mergeMarkdown(parts);
        const names = parts.map((part) => part.name);
        const converted = convert(
          id,
          mergedName(names),
          dropped,
          markdown,
          Date.now(),
          files.length > 1 ? names : undefined
        );

        setDoc(converted);
        setConversionId(id);
        setViewState('converter');
        goToConversion(id);

        /*
         * Too big to keep is not too big to convert. The document is on screen and downloadable
         * either way; what changes is whether the account can hold it, and saying so here beats
         * a success toast over a save that never happened.
         */
        const tooBigToKeep =
          user !== null &&
          new TextEncoder().encode(converted.markdown).length > KEEP_BYTES;

        const stored = tooBigToKeep
          ? null
          : await history.add({
              name: converted.name,
              kind: converted.kind,
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

        if (tooBigToKeep) {
          toast.warning('Converted, but not saved to your account', {
            description: `A kept document can be ${formatBytes(KEEP_BYTES)}; this one is ${formatBytes(
              new TextEncoder().encode(converted.markdown).length
            )}. Download it — it is ready.`,
          });
        } else {
          toast.success(
            files.length > 1
              ? `Chained ${files.length} files into one document`
              : `Converted to ${conversion(id).short.split(' → ')[1] ?? 'Markdown'}`,
            { description: converted.name }
          );
        }
      } catch (cause) {
        /*
         * Say what went wrong. This used to be one sentence for every failure — "Could not read the
         * files" — which covered a file that was not what it claimed, a converter that failed to
         * load, and a document with nothing in it, and told the person none of them.
         */
        toast.error(`${conversion(id).label} did not work`, {
          description:
            cause instanceof Error ? cause.message : 'The file could not be read.',
        });
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

      const reopened = convert(
        entry.kind,
        entry.name,
        entry.size,
        markdown,
        entry.createdAt
      );

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

      downloadDoc(entry.name, markdown, entry.createdAt, theme, format);
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
        /*
          * A merge of rows that came from different conversions is still one document, and what
          * made it now is the merge — so it is filed under the conversion the first row came from,
          * which is the one whose page the reader is looking at.
          */
        const converted = convert(
          entries[0]?.kind ?? DEFAULT_CONVERSION,
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
          kind: converted.kind,
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

        downloadDoc(entry.name, markdown, entry.createdAt, theme, format);
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
        conversionId={conversionId}
        historyCount={history.entries.length}
        onViewChange={setView}
        onConversionChange={chooseConversion}
        onHome={startOver}
      />

      <main className="mx-auto w-full max-w-container-content flex-1 px-6 py-8">
        {view === 'docs' ? (
          <DocsPage />
        ) : view === 'blog' ? (
          articleSlug ? (
            <ArticlePage
              slug={articleSlug}
              onBack={() => setView('blog')}
              onOpenArticle={openArticle}
              onGoTo={setView}
              onGoToConverter={startOver}
            />
          ) : (
            <BlogPage onOpenArticle={openArticle} />
          )
        ) : view === 'converter' ? (
          <ConverterPage
            conversion={conversion(conversionId)}
            doc={doc}
            isBusy={isBusy}
            onFiles={handleFiles}
            onReset={startOver}
            onGoToBlog={() => setView('blog')}
            onOpenArticle={openArticle}
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
            Markdown, HTML, plain text or print
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
