import { Check, Copy, Download } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { DocumentPreview } from '@/components/DocumentPreview';
import { livePreviewCrumbs } from '@/lib/breadcrumbs';
import { downloadDoc } from '@/lib/download';
import { useI18n, useT } from '@/lib/i18n/context';
import { markdownToHtml } from '@/lib/markdown';
import { useTheme } from '@/lib/theme';
import { Button } from '@/ui/components/Button';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { Typography } from '@/ui/components/Typography';

/*
 * Markdown on the left, the document on the right, as it is typed.
 *
 * The converter takes a file and answers with a finished document, which is the right shape for
 * "I have this .md and I want the HTML" and the wrong one for "what does this look like": a
 * question somebody asks about text they are still writing. This page is the second question, and
 * it is one people type into a search box, which is why it has an address of its own.
 *
 * It is the same converter underneath — `markdownToHtml`, the same sanitiser, the same document
 * styles — so what is rendered here is what the download contains. A preview that disagreed with
 * the file would be worse than no preview.
 *
 * Nothing is saved and nothing is sent. The text stays in the tab: this page has no account, no
 * history and no network, which is also why the whole of it can run while the bundle is the only
 * thing that loaded.
 */

/** Long enough that a fast typist renders once per pause, short enough to feel immediate. */
const SETTLE_MS = 200;

export function LivePreviewPage({
  onGoToConverter,
}: {
  onGoToConverter: () => void;
}) {
  const t = useT();
  const { content, locale } = useI18n();
  const { theme } = useTheme();

  /*
   * It opens with an example rather than an empty box. A blank page shows nothing of what the page
   * does — to a first-time reader or to a search result's screenshot — and the example is the
   * shortest honest demonstration: a heading, emphasis, a list, a table, a fence.
   */
  const [markdown, setMarkdown] = useState(() => t('live.sample'));
  const [settled, setSettled] = useState(markdown);
  const [isCopied, setIsCopied] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);

  /*
   * The render follows the typing by a beat. Converting on every keystroke is fine for a paragraph
   * and visibly not fine for a long document, and the pause is where a person looks up anyway.
   */
  useEffect(() => {
    const timer = setTimeout(() => setSettled(markdown), SETTLE_MS);

    return () => clearTimeout(timer);
  }, [markdown]);

  const html = useMemo(() => markdownToHtml(settled), [settled]);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error(t('common.clipboard.error'));
    }
  };

  /*
   * The converter's own download, not a second one: it builds the self-contained document from the
   * Markdown, which is what makes the file open in a browser with no styles of ours to fetch. What
   * is downloaded here and what is downloaded there are the same bytes for the same text.
   */
  const download = () =>
    downloadDoc(t('live.filename'), settled, Date.now(), theme, 'html');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <AppBreadcrumbs
        items={livePreviewCrumbs(content, locale)}
        onNavigate={onGoToConverter}
      />

      <SectionHeading
        size="lg"
        eyebrow={t('live.eyebrow')}
        title={t('live.title')}
        description={t('live.lede')}
        className="pt-2"
      />

      {/*
       * Two panes side by side above `lg`, stacked below it. On a phone the editor comes first and
       * the preview under it, which is the order the work happens in.
       */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2">
          {/*
           * The label sits in a row as tall as the one opposite, which carries two buttons. Left to
           * themselves the two headers differ by seventeen pixels, and two panes of exactly equal
           * height then start and end at different places — which is the kind of thing a reader
           * notices without being able to say what is wrong.
           */}
          <div className="flex h-8 items-center">
            <Typography
              variant="span"
              textColor="light"
              className="text-xxs uppercase tracking-wide"
            >
              {t('live.editor')}
            </Typography>
          </div>

          <textarea
            ref={field}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            spellCheck={false}
            aria-label={t('live.editor')}
            className="h-[28rem] w-full resize-y rounded-xl border border-stroke bg-surface-card p-4 font-mono text-compact text-ink-body outline-none lg:h-[34rem] focus-visible:border-brand-primary"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex h-8 items-center justify-between gap-2">
            <Typography
              variant="span"
              textColor="light"
              className="text-xxs uppercase tracking-wide"
            >
              {t('live.preview')}
            </Typography>

            <div className="flex items-center gap-2">
              <Button
                variant="tertiary"
                size="sm"
                leftSlot={isCopied ? <Check /> : <Copy />}
                onClick={() => void copyHtml()}
              >
                {isCopied ? t('common.copied') : t('live.copy')}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                leftSlot={<Download />}
                onClick={download}
              >
                {t('live.download')}
              </Button>
            </div>
          </div>

          {/*
           * The document sheet the converter shows, scrolling inside its own pane so the page does
           * not grow with what is being typed.
           */}
          <div className="h-[28rem] overflow-auto rounded-xl border border-stroke bg-surface-card lg:h-[34rem]">
            <DocumentPreview html={html} className="md-article p-4" />
          </div>
        </div>
      </div>

      <Typography variant="p" textColor="light" className="text-xs">
        {t('live.note')}
      </Typography>
    </div>
  );
}
