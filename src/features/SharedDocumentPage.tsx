import { Download, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DocumentPreview } from '@/components/DocumentPreview';
import { Logo } from '@/components/Logo';
import { ScrollToTop } from '@/components/ScrollToTop';
import { api, type SharedDocument } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDateTime, toFileName } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { buildStandaloneHtml, markdownToHtml } from '@/lib/markdown';
import { useTheme } from '@/lib/theme';
import { Button } from '@/ui/components/Button';
import { GoogleGlyph } from '@/components/GoogleGlyph';
import { Spinner } from '@/ui/components/Spinner';
import { StatusView } from '@/ui/components/StatusView';
import { Typography } from '@/ui/components/Typography';

/**
 * A document someone shared, read-only.
 *
 * Reached at /open/<token> and nowhere else in the app: it has no history, no upload and no account
 * of its own — a link handed to somebody should open the document, not the product.
 *
 * Not to be confused with the page at /s/<token>, which the server renders for a reader it knows
 * nothing about — see `GET /s/:token` in `server/app.ts`, and the exclusions in
 * `src/lib/i18n/content.ts`. That one has only `Accept-Language` to guess a language from and its
 * words are not in the catalogue. This is the app, arrived at by somebody the server sent here to
 * sign in, so it reads the catalogue and follows the language they chose like every other screen.
 */
export function SharedDocumentPage({ token }: { token: string }) {
  const t = useT();
  const { locale } = useI18n();
  const { theme } = useTheme();
  const { user, signIn, isSigningIn } = useAuth();
  const [document, setDocument] = useState<SharedDocument | null>(null);
  const [error, setError] = useState<{ message: string; needsSignIn: boolean } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    api
      .getShared(token)
      .then((shared) => {
        setDocument(shared);
        setError(null);
      })
      .catch((cause: Error) =>
        setError({
          message: cause.message,
          needsSignIn: /sign in/i.test(cause.message),
        })
      )
      .finally(() => setIsLoading(false));
    // Signing in changes who is asking, so the answer can change too.
  }, [token, user]);

  const download = () => {
    if (!document) {
      return;
    }

    const html = buildStandaloneHtml({
      title: document.name,
      body: markdownToHtml(document.markdown),
      createdAt: document.createdAt,
      theme,
    });
    const url = URL.createObjectURL(
      new Blob([html], { type: 'text/html;charset=utf-8' })
    );
    const link = window.document.createElement('a');

    link.href = url;
    link.download = toFileName(document.name, 'html');
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-full flex-col bg-surface-page">
      <header className="sticky top-0 z-20 border-stroke border-b bg-surface-card/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-content items-center gap-4 px-6">
          <a href="/" aria-label="transformpipe">
            <Logo />
          </a>

          {document && (
            <>
              <Typography
                variant="span"
                weight="medium"
                textColor="secondary"
                className="hidden min-w-0 truncate sm:block"
              >
                {document.name}
              </Typography>

              <Button
                className="ml-auto"
                variant="secondary"
                size="sm"
                leftSlot={<Download />}
                onClick={download}
              >
                {t('converter.download', { format: 'html' })}
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-content flex-1 px-6 py-8">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16">
            <Spinner />
            <Typography variant="span" textColor="secondary">
              {t('shared.loading')}
            </Typography>
          </div>
        )}

        {!isLoading && error && (
          <StatusView
            tone={error.needsSignIn ? 'info' : 'muted'}
            title={
              error.needsSignIn
                ? t('shared.signin.title')
                : t('shared.missing.title')
            }
            description={
              error.needsSignIn
                ? t('shared.signin.detail')
                : error.message
            }
            actions={
              error.needsSignIn ? (
                <Button
                  variant="secondary"
                  size="sm"
                  rounded="full"
                  isLoading={isSigningIn}
                  leftSlot={<GoogleGlyph />}
                  onClick={() => void signIn()}
                >
                  {t('header.signin')}
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => {
                  window.location.href = '/';
                }}>
                  {t('shared.missing.action')}
                </Button>
              )
            }
          />
        )}

        {!isLoading && document && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <FileText className="size-4 text-brand-tertiary" />
              <Typography variant="span" weight="semibold" textColor="primary">
                {document.name}
              </Typography>
              <Typography
                variant="span"
                textColor="secondary"
                className="text-xs"
              >
                {t('shared.meta', {
                  date: formatDateTime(
                    document.createdAt,
                    INTL_LOCALES[locale]
                  ),
                })}
              </Typography>
            </div>

            <div className="md-preview-frame rounded-xl border border-stroke bg-surface-page p-3 sm:p-6">
              <DocumentPreview
                html={markdownToHtml(document.markdown)}
                className="mx-auto max-w-3xl rounded-lg border border-stroke p-6 shadow-rest sm:p-10"
              />

              <ScrollToTop />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
