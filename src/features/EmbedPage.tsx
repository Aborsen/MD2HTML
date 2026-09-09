import { Check, Copy, Download, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentPreview } from '@/components/DocumentPreview';
import { Dropzone } from '@/components/Dropzone';
import { conversionForFiles, convertFile } from '@/lib/convert';
import { downloadDoc } from '@/lib/download';
import { useI18n, useT } from '@/lib/i18n/context';
import { buildStandaloneHtml, getDocStats, markdownToHtml } from '@/lib/markdown';
import { mergeMarkdown, mergedName } from '@/lib/merge';
import { useTheme } from '@/lib/theme';
import {
  conversion,
  type ConversionId,
  DEFAULT_CONVERSION,
} from '@shared/conversions';
import { Button } from '@/ui/components/Button';
import { Typography } from '@/ui/components/Typography';

/*
 * transformpipe inside somebody else's page.
 *
 * The whole product minus everything that belongs to this site: no header, no footer, no blog, no
 * account, no history. A dropzone, the document it produced, a download, and a copy button — which
 * is the part of this application a host page actually wants, and nothing that would look like our
 * navigation appearing inside theirs.
 *
 * What makes it worth embedding rather than proxying: the conversion runs in the visitor's browser,
 * exactly as it does here. The host's user drops a file and it reaches neither the host's server nor
 * ours. A host that wanted a server-side converter would call the API; what this offers is the one
 * thing an API cannot, which is not having the file leave the machine it is on.
 *
 * Deliberately anonymous. No session is used and none is offered: an embed that could reach an
 * account would mean a page on any domain acting on the reader's documents because they happened to
 * be signed in here. Keeping, sharing and the history stay on transformpipe.com.
 */

/** What the host page can ask for in the query string. */
function readParams(): { conversionId: ConversionId; theme: 'dark' | 'light' | null } {
  const query = new URLSearchParams(window.location.search);
  const asked = query.get('conversion');
  const found = asked
    ? conversion(asked as ConversionId)
    : null;

  const theme = query.get('theme');

  return {
    conversionId: found?.id ?? DEFAULT_CONVERSION,
    theme: theme === 'dark' || theme === 'light' ? theme : null,
  };
}

/*
 * One shape for everything sent to the parent.
 *
 * `source` is on every message because a host page listening on `window` hears from every frame it
 * has, and from its own scripts: without a name to check, the first thing anybody integrating this
 * writes is a handler that fires on somebody else's message.
 */
function tell(message: Record<string, unknown>): void {
  if (window.parent === window) {
    return;
  }

  /*
   * `'*'` because the host's origin is not something this frame can know, and it does not need to:
   * `parent.postMessage` delivers to the parent window and nowhere else. The host verifies
   * `event.origin` against transformpipe.com at their end, which is documented.
   */
  window.parent.postMessage({ source: 'transformpipe', ...message }, '*');
}

export function EmbedPage() {
  const t = useT();
  const { content } = useI18n();
  const { setTheme } = useTheme();

  const [{ conversionId, theme: asked }] = useState(readParams);
  const one = conversion(conversionId);
  const words = content.conversions[conversionId];

  const [doc, setDoc] = useState<{
    name: string;
    markdown: string;
    html: string;
    bytes: number;
  } | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  /*
   * The host decides the theme, not the visitor's operating system.
   *
   * A widget that follows the reader's OS while the page around it follows the host's design lands
   * as a dark rectangle in a light page for half the audience. `?theme=` is how the host says which.
   */
  useEffect(() => {
    if (asked) {
      setTheme(asked);
    }
  }, [asked, setTheme]);

  const { theme } = useTheme();

  /* One message on load, so a host can wait for the frame instead of guessing at a timeout. */
  useEffect(() => {
    tell({ type: 'ready', conversion: conversionId });
  }, [conversionId]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      setFailed(null);

      const { id, rejected } = conversionForFiles(conversionId, files, t);

      if (rejected) {
        setFailed(rejected);
        tell({ type: 'error', message: rejected });

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
        const name = mergedName(
          parts.map((part) => part.name),
          t
        );
        const html = markdownToHtml(markdown);
        const bytes = files.reduce((total, file) => total + file.size, 0);

        setDoc({ name, markdown, html, bytes });

        /*
         * Both forms, because the host cannot ask for the other one later — this frame keeps no
         * document and answers no requests. Whichever they wanted, they have it.
         */
        tell({
          type: 'converted',
          conversion: id,
          name,
          markdown,
          html,
          bytes,
          ...getDocStats(markdown, html),
        });
      } catch (cause) {
        const why =
          cause instanceof Error ? cause.message : t('converter.failed');

        setFailed(why);
        tell({ type: 'error', message: why });
      } finally {
        setIsBusy(false);
      }
    },
    [conversionId, t]
  );

  const standalone = useMemo(
    () =>
      doc
        ? buildStandaloneHtml({
            title: doc.name,
            body: doc.html,
            createdAt: Date.now(),
            theme,
          })
        : '',
    [doc, theme]
  );

  const copy = async () => {
    if (!doc) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        one.to === 'html' ? standalone : doc.markdown
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setFailed(t('common.clipboard.error'));
    }
  };

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col gap-3 bg-surface-page p-4">
        <Dropzone
          isBusy={isBusy}
          extensions={one.extensions}
          title={t('converter.dropzone.title', { extension: one.extensions[0] })}
          hint={words.hint}
          onFiles={handleFiles}
        />

        {failed && (
          <Typography variant="p" className="text-danger text-xs" role="alert">
            {failed}
          </Typography>
        )}
      </div>
    );
  }

  const format = one.to === 'html' ? 'html' : 'md';

  return (
    <div className="flex min-h-screen flex-col gap-3 bg-surface-page p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Typography
          variant="span"
          weight="medium"
          textColor="primary"
          className="mr-auto min-w-0 truncate text-sm"
        >
          {doc.name}
        </Typography>

        <Button
          size="sm"
          leftSlot={<Download />}
          onClick={() =>
            downloadDoc(doc.name, doc.markdown, Date.now(), theme, format)
          }
        >
          {t('converter.download', { format })}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          leftSlot={isCopied ? <Check /> : <Copy />}
          onClick={() => void copy()}
        >
          {isCopied ? t('common.copied') : t('common.copy')}
        </Button>

        <Button
          variant="tertiary"
          size="sm"
          leftSlot={<RotateCcw />}
          onClick={() => {
            setDoc(null);
            setFailed(null);
            tell({ type: 'reset' });
          }}
        >
          {t('converter.reset')}
        </Button>
      </div>

      <DocumentPreview html={doc.html} className="flex-1" />
    </div>
  );
}
