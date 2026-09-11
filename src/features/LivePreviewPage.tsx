import { Check, Copy, Download, FilePlus2, Maximize2, Minimize2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { DocumentPreview } from '@/components/DocumentPreview';
import { Hint } from '@/components/Hint';
import { livePreviewCrumbs } from '@/lib/breadcrumbs';
import { downloadDoc } from '@/lib/download';
import { useI18n, useT } from '@/lib/i18n/context';
import { markdownToHtml } from '@/lib/markdown';
import { useTheme } from '@/lib/theme';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

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
  markdown: given,
  onMarkdownChange,
  onConvert,
  onGoToConverter,
}: {
  /**
   * What to show. `null` means nobody has typed anything yet, which is what the example is for.
   *
   * It lives above this component so that two things work: text pasted on the converter arrives
   * here already rendered, and going to the documentation and back does not throw away what was
   * being written.
   */
  markdown: string | null;
  onMarkdownChange: (markdown: string) => void;
  /**
   * Hands the text to the converter, which is where keeping it lives.
   *
   * This page deliberately has no account, no history and no network — that is what lets it say
   * the text stays in the tab. But somebody who has just written something wants to keep it, and
   * the answer to that already exists one screen away: the same conversion a dropped file gets,
   * with the history, the share link and the other formats around it.
   */
  onConvert: (markdown: string) => void;
  onGoToConverter: () => void;
}) {
  const t = useT();
  const { content, locale } = useI18n();
  const { theme } = useTheme();

  /*
   * It opens with an example rather than an empty box. A blank page shows nothing of what the page
   * does — to a first-time reader or to a search result's screenshot — and the example is the
   * shortest honest demonstration: a heading, emphasis, a list, a table, a fence.
   *
   * The example is what a reader who arrives with nothing gets; a reader who arrives with their
   * own text gets their own text, and never sees it.
   */
  const markdown = given ?? t('live.sample');
  const [settled, setSettled] = useState(markdown);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  // Escape and the browser's own chrome can leave fullscreen without us, so follow the event.
  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement !== null);

    document.addEventListener('fullscreenchange', sync);

    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  /*
   * Both panes go fullscreen, not just the preview. On this page the editor is half the work, and
   * a reader who wanted only the document would be on the converter.
   */
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void frame.current?.requestFullscreen().catch(() => {
      toast.error(t('converter.fullscreen.error'));
    });
  };

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
    /* No width of its own: the shell sets it, the same 80rem every other page gets. */
    <div className="flex w-full flex-col gap-6">
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
       *
       * The height is the viewport's, not a number of rems: this is a page somebody works in, and
       * a pane that ends two thirds of the way down a tall screen wastes the screen it was given.
       * A floor in rems keeps it usable on a short laptop, and fullscreen hands the whole thing
       * over — which is the same gesture the converter's preview already has.
       */}
      <div
        ref={frame}
        className={cn(
          'grid gap-4 lg:grid-cols-2',
          isFullscreen
            ? 'h-screen bg-surface-page p-4'
            : 'lg:h-[74vh] lg:min-h-[34rem]'
        )}
      >
        <div
          className={cn(
            'flex min-w-0 flex-col gap-2',
            isFullscreen ? 'h-full' : 'h-[62vh] min-h-[26rem] lg:h-auto'
          )}
        >
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

          {/*
           * `resize-none`, because the pane is sized by the layout now and a corner that fights it
           * is a corner that leaves the two panes different heights again. Fullscreen is the size
           * control.
           */}
          <textarea
            ref={field}
            value={markdown}
            onChange={(event) => onMarkdownChange(event.target.value)}
            spellCheck={false}
            aria-label={t('live.editor')}
            className="min-h-0 w-full flex-1 resize-none rounded-xl border border-stroke bg-surface-card p-4 font-mono text-sm leading-relaxed text-ink-body outline-none focus-visible:border-brand-primary"
          />
        </div>

        <div
          className={cn(
            'flex min-w-0 flex-col gap-2',
            isFullscreen ? 'h-full' : 'h-[62vh] min-h-[26rem] lg:h-auto'
          )}
        >
          <div className="flex h-8 items-center justify-between gap-2">
            <Typography
              variant="span"
              textColor="light"
              className="text-xxs uppercase tracking-wide"
            >
              {t('live.preview')}
            </Typography>

            <div className="flex items-center gap-2">
              <Hint content={t('live.save.hint')}>
                <Button
                  variant="primary"
                  size="sm"
                  leftSlot={<FilePlus2 />}
                  disabled={!settled.trim()}
                  onClick={() => onConvert(markdown)}
                >
                  {t('live.save')}
                </Button>
              </Hint>

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

              <Hint
                content={
                  isFullscreen
                    ? t('converter.fullscreen.exit')
                    : t('converter.fullscreen.enter')
                }
              >
                <IconButton
                  variant="tertiary"
                  size="sm"
                  aria-label={
                    isFullscreen
                      ? t('converter.fullscreen.exit')
                      : t('converter.fullscreen.enter')
                  }
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                </IconButton>
              </Hint>
            </div>
          </div>

          {/*
           * The document sheet the converter shows, scrolling inside its own pane so the page does
           * not grow with what is being typed.
           */}
          <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-stroke bg-surface-card">
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
