import { useCallback, useEffect, useState } from 'react';
import { AppFooter } from './components/AppFooter';
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
import { EmbedPage } from './features/EmbedPage';
import { HistoryPage } from './features/HistoryPage';
import { NotFoundPage } from './features/NotFoundPage';
import { SharedDocumentPage } from './features/SharedDocumentPage';
import { StaticPage } from './features/StaticPage';
import { staticPage, type StaticPageId } from './lib/pages';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { autoLocale, I18nProvider, useI18n, useT } from './lib/i18n/context';
import {
  INTL_LOCALES,
  type Locale,
  localePath,
  splitLocale,
} from './lib/i18n/locales';
import { type DocFormat, formatBytes, toFileName } from './lib/format';
import { downloadDoc } from './lib/download';
import type { HistoryEntry } from './lib/history';
import { getDocStats, markdownToHtml } from './lib/markdown';
import { mergedName, mergeMarkdown } from './lib/merge';
import {
  type AppView,
  type Destination,
  goTo,
  goToArticle,
  goToConversion,
  goToPage,
  goToPath,
  hasTranslation,
  readRoute,
} from './lib/route';
import type { ConvertedDoc } from './lib/types';
import { useHistory } from './lib/use-history';
import { toast, Toaster } from './ui/components/Toast';
import { TooltipProvider } from './ui/components/Tooltip';

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
  const t = useT();
  const { content, locale } = useI18n();
  /* The tag `Intl` wants, which is not the tag in the address — see `INTL_LOCALES`. */
  const sizes = INTL_LOCALES[locale];
  const { user, error: authError } = useAuth();
  const { theme } = useTheme();
  const [view, setViewState] = useState<AppView>(() => readRoute().view);
  const [conversionId, setConversionId] = useState<ConversionId>(
    () => readRoute().conversionId
  );
  const [articleSlug, setArticleSlug] = useState<string | null>(
    () => readRoute().articleSlug
  );
  const [pageId, setPageId] = useState<StaticPageId | null>(
    () => readRoute().pageId
  );

  /*
   * The view lives in the address, so a reload lands where you were and Back means something.
   *
   * And every deliberate move starts at the top of the new page. Without that, reading to the foot
   * of an article and tapping the call to action landed you on the converter scrolled past the
   * dropzone — the one thing that page exists for, off screen. `popstate` is deliberately left
   * alone: going Back should return you to where you were, which the browser already does.
   */
  const setView = useCallback((next: Destination) => {
    setViewState(next);
    setArticleSlug(null);
    setPageId(null);
    goTo(next, readRoute().filter);
    window.scrollTo({ top: 0 });
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
    setPageId(null);
    setDoc(null);
    goToConversion(next);
    window.scrollTo({ top: 0 });
  }, []);

  const openArticle = useCallback((slug: string) => {
    setViewState('blog');
    setArticleSlug(slug);
    setPageId(null);
    goToArticle(slug);
    window.scrollTo({ top: 0 });
  }, []);

  const openPage = useCallback((id: StaticPageId) => {
    setViewState('page');
    setPageId(id);
    setArticleSlug(null);
    goToPage(id);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const sync = () => {
      const route = readRoute();

      setViewState(route.view);
      setConversionId(route.conversionId);
      setArticleSlug(route.articleSlug);
      setPageId(route.pageId);
    };

    window.addEventListener('popstate', sync);

    return () => window.removeEventListener('popstate', sync);
  }, []);
  const [doc, setDoc] = useState<ConvertedDoc | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const history = useHistory(Boolean(user), t);

  useEffect(() => {
    if (history.error) {
      toast.error(history.error);
    }
  }, [history.error]);

  useEffect(() => {
    if (authError) {
      toast.error(t('auth.incomplete'), { description: authError });
    }
  }, [authError, t]);

  /**
   * One file converts; several are chained into a single document, in the order they arrive.
   *
   * Which conversion runs is decided by what was dropped, not only by the page it was dropped on: a
   * .docx on the Markdown screen means "convert this", and answering "wrong page" to a file the app
   * plainly knows how to read is a refusal nobody would thank us for.
   */
  const handleFiles = useCallback(
    async (files: File[]) => {
      const { id, rejected } = conversionForFiles(conversionId, files, t);

      if (rejected) {
        toast.error(t('converter.reject.title'), { description: rejected });
        return;
      }

      /*
       * The total, not each file: several dropped files become one document, and one document is
       * what the limit is about. Checking them one at a time let three 4 MB files through to a
       * save that then refused the 12 MB they made.
       */
      const dropped = files.reduce((total, file) => total + file.size, 0);

      if (dropped > MAX_FILE_SIZE) {
        toast.error(
          t(
            files.length > 1
              ? 'converter.toolarge.many'
              : 'converter.toolarge.one'
          ),
          {
            description: t('converter.toolarge.detail', {
              size: formatBytes(dropped, sizes),
              limit: formatBytes(MAX_FILE_SIZE, sizes),
            }),
          }
        );
        return;
      }

      setIsBusy(true);

      try {
        const parts = await Promise.all(
          files.map(async (file) => {
            const done = await convertFile(id, file, t);

            return { name: done.name, markdown: done.markdown };
          })
        );

        const markdown = mergeMarkdown(parts);
        const names = parts.map((part) => part.name);
        const converted = convert(
          id,
          mergedName(names, t),
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
          toast.warning(t('converter.notkept.title'), {
            description: t('converter.notkept.detail', {
              limit: formatBytes(KEEP_BYTES, sizes),
              size: formatBytes(
                new TextEncoder().encode(converted.markdown).length,
                sizes
              ),
            }),
          });
        } else {
          toast.success(
            files.length > 1
              ? t('common.chained', { count: files.length })
              : t('converter.converted', {
                  /*
                   * The right-hand half of "MD → HTML". The short name is an abbreviation and its
                   * arrow is punctuation, so it reads the same in all five catalogues; a locale
                   * that wrote it some other way gets the fallback rather than a wrong word.
                   */
                  format:
                    content.conversions[id].short.split(' → ')[1] ?? 'Markdown',
                }),
            { description: converted.name }
          );
        }
      } catch (cause) {
        /*
         * Say what went wrong. This used to be one sentence for every failure — "Could not read the
         * files" — which covered a file that was not what it claimed, a converter that failed to
         * load, and a document with nothing in it, and told the person none of them.
         */
        toast.error(
          t('converter.failed', { conversion: content.conversions[id].label }),
          {
            description:
              cause instanceof Error
                ? cause.message
                : t('converter.failed.detail'),
          }
        );
      } finally {
        setIsBusy(false);
      }
    },
    [content, conversionId, history, sizes, t, user]
  );

  const handleOpenFromHistory = useCallback(
    async (entry: HistoryEntry) => {
      const markdown = await history.getSource(entry);

      if (!markdown) {
        toast.error(t('history.source.missing'));
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
    [history, setView, t]
  );

  const handleDownloadFromHistory = useCallback(
    async (entry: HistoryEntry, format: DocFormat) => {
      const markdown = await history.getSource(entry);

      if (!markdown) {
        toast.error(t('history.source.missing'));
        return;
      }

      downloadDoc(entry.name, markdown, entry.createdAt, theme, format);
      toast.success(t('history.download.done'), {
        description: toFileName(entry.name, format),
      });
    },
    [history, t, theme]
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
          toast.error(t('history.merge.none'), {
            description: t('history.merge.none.detail'),
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
          mergedName(names, t),
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

        toast.success(t('common.chained', { count: parts.length }), {
          description: converted.name,
        });
      } finally {
        setIsBusy(false);
      }
    },
    [history, setView, t]
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
        toast.error(t('history.download.none'));
        return;
      }

      const label = format === 'html' ? 'HTML' : 'Markdown';

      toast.success(
        saved === 1
          ? t('history.download.one', { format: label })
          : t('history.download.many', { count: saved, format: label })
      );
    },
    [history, t, theme]
  );

  const handleRemoveMany = useCallback(
    async (ids: string[]) => {
      // Only claim success when the store says the delete actually stuck.
      if (await history.removeMany(ids)) {
        toast.info(
          ids.length === 1
            ? t('history.removed.one')
            : t('history.removed.many', { count: ids.length })
        );
      }
    },
    [history, t]
  );

  const handleClear = useCallback(async () => {
    if (await history.clear()) {
      toast.info(t('history.cleared'));
    }
  }, [history, t]);

  return (
    <div className="flex min-h-full flex-col bg-surface-page">
      <AppHeader
        view={view}
        conversionId={conversionId}
        historyCount={history.entries.length}
        onViewChange={setView}
        onConversionChange={chooseConversion}
        onOpenPage={openPage}
        onHome={startOver}
      />

      <main className="mx-auto w-full max-w-content flex-1 px-6 py-8">
        {view === 'page' && pageId ? (
          <StaticPage page={staticPage(pageId)} onGoToConverter={startOver} />
        ) : view === 'docs' ? (
          <DocsPage onGoToConverter={startOver} />
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
            <BlogPage
              onOpenArticle={openArticle}
              onGoToConverter={startOver}
            />
          )
        ) : view === 'notFound' ? (
          <NotFoundPage
            onGoToConverter={startOver}
            onGoToDocs={() => setView('docs')}
            onGoToBlog={() => setView('blog')}
          />
        ) : view === 'converter' ? (
          <ConverterPage
            conversion={conversion(conversionId)}
            doc={doc}
            isBusy={isBusy}
            onConversionChange={chooseConversion}
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

      <AppFooter
        onConversionChange={chooseConversion}
        onViewChange={setView}
        onOpenPage={openPage}
      />
    </div>
  );
}

/*
 * The providers, and the language everything inside them speaks.
 *
 * `I18nProvider` goes above everything that says anything — the auth provider included, because a
 * sign-in that failed is a sentence somebody reads — and inside the theme, which has no words in it.
 *
 * The locale comes off the address and nowhere else, so a link into `/de/docs` opens in German and
 * a reload stays there. `popstate` covers Back; `onNavigate` covers the switcher, which changes
 * language by changing address — and `pushState` raises no event, so the state is set here.
 */
export default function App() {
  const [locale, setLocale] = useState<Locale>(() => readRoute().locale);
  const token = readRoute().sharedToken;

  useEffect(() => {
    const sync = () => setLocale(readRoute().locale);

    window.addEventListener('popstate', sync);

    return () => window.removeEventListener('popstate', sync);
  }, []);

  /*
   * The language the browser asks for, once, on a first visit.
   *
   * Four conditions, and every one of them is a way this could be annoying instead of helpful.
   * `autoLocale` refuses if a language was ever chosen here, if the address already names one, or
   * if the browser's preference is English or something we do not have — a Slavic tag lands on
   * English by the list in `locales.ts` rather than by accident. This adds the fourth: only where
   * the page has a translation to go to, so a German arriving on an English article from a search
   * result is left on the article they came for rather than thrown at a German front page.
   *
   * `replaceState`, not `pushState`: a redirect the reader did not ask for must not become an entry
   * that Back returns them to, which is the trap that makes language detection feel broken.
   *
   * It runs in the browser after the bundle, so a crawler reading the prerendered HTML never sees
   * it — `hreflang` is what tells a crawler about the other four, and that is in the static file.
   */
  useEffect(() => {
    const { rest } = splitLocale(window.location.pathname);
    const guess = autoLocale(hasTranslation(rest));

    if (!guess) {
      return;
    }

    window.history.replaceState(
      null,
      '',
      localePath(guess, rest) + window.location.search
    );
    setLocale(guess);
  }, []);

  const navigate = useCallback((path: string) => {
    goToPath(path);
    setLocale(readRoute().locale);
  }, []);

  /*
   * The embed is not the app with the chrome hidden — it is rendered instead of it.
   *
   * Above `AuthProvider` on purpose: that provider asks the server who is signed in on mount, and
   * an embed has no account, so a page on somebody else's domain should not be making a credentialed
   * request to us the moment it loads. It keeps the theme and the catalogue, because it has words on
   * it and the host chooses the palette.
   */
  if (readRoute().view === 'embed') {
    return (
      <ThemeProvider>
        <I18nProvider locale={locale} onNavigate={navigate}>
          <EmbedPage />
        </I18nProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <I18nProvider locale={locale} onNavigate={navigate}>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            {token ? <SharedDocumentPage token={token} /> : <Shell />}
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
