import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { mdDocTheme, MD_DOC_STYLE, MD_SPREAD_STYLE } from '@/lib/md-doc-css';
import { useTheme } from '@/lib/theme';
import { IconButton } from '@/ui/components/IconButton';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

export type PreviewMode = 'page' | 'spread';

interface DocumentPreviewProps {
  html: string;
  mode?: PreviewMode;
  className?: string;
}

/**
 * Renders the converted fragment with exactly the stylesheet that ships inside the exported file,
 * so "preview" and "downloaded .html" always match — right down to the sheet's own background,
 * which follows the app theme in both places.
 *
 * In `spread` mode the same markup is poured into two columns of fixed height and paged sideways,
 * which is the one thing a scrolling page cannot show: how much document is left.
 */
export function DocumentPreview({
  html,
  mode = 'page',
  className,
}: DocumentPreviewProps) {
  const { theme } = useTheme();
  const viewport = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(1);

  /*
   * The page index is kept in state rather than derived from scrollLeft on every read: Chrome
   * moves a multi-column box without always firing a scroll event, so a counter that trusts the
   * event alone sits at page one while the pages turn under it. The scroll handler still runs, for
   * the trackpad.
   */
  const measure = useCallback(() => {
    const element = viewport.current;

    if (!element || element.clientWidth === 0) {
      return;
    }

    setTotal(Math.max(1, Math.round(element.scrollWidth / element.clientWidth)));
    setPage(Math.round(element.scrollLeft / element.clientWidth));
  }, []);

  // The column count depends on the box, so re-measure whenever either can have changed.
  useEffect(() => {
    if (mode !== 'spread') {
      return;
    }

    const element = viewport.current;

    if (!element) {
      return;
    }

    element.scrollLeft = 0;
    setPage(0);

    /*
     * Columns are laid out after paint, and the web font lands later still — measuring once, in
     * this frame, reads a box that has not happened yet. So: next frame, again once the fonts are
     * in, and from then on whenever the box changes.
     */
    const frame = requestAnimationFrame(measure);
    const settled = setTimeout(measure, 250);
    const observer = new ResizeObserver(measure);

    observer.observe(element);
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settled);
      observer.disconnect();
    };
  }, [mode, html, measure]);

  const turn = useCallback(
    (direction: -1 | 1) => {
      const element = viewport.current;

      if (!element) {
        return;
      }

      const next = Math.min(total - 1, Math.max(0, page + direction));

      /*
       * Instant, not smooth: Chrome ignores a smooth scroll on a multi-column box — the position
       * simply never moves — so a page turn animates by not animating.
       */
      element.scrollTo({ left: next * element.clientWidth, behavior: 'auto' });
      setPage(next);
    },
    [page, total]
  );

  useEffect(() => {
    if (mode !== 'spread') {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        turn(1);
      }

      if (event.key === 'ArrowLeft') {
        turn(-1);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [mode, turn]);

  const styles = (
    <style>{`${mdDocTheme(theme, '.md-doc, .md-spread-frame')}\n${MD_DOC_STYLE}\n${MD_SPREAD_STYLE}`}</style>
  );

  if (mode === 'page') {
    return (
      <>
        {styles}
        <div className={className}>
          <div
            className="md-doc"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized with DOMPurify in markdownToHtml
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {styles}

      <div className="flex flex-col gap-3">
        <div className={cn('md-spread-frame', className)}>
          <div
            ref={viewport}
            onScroll={measure}
            className="md-doc md-spread no-scrollbar h-[min(70vh,44rem)]"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized with DOMPurify in markdownToHtml
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div className="flex items-center justify-center gap-3">
          <IconButton
            variant="tertiary"
            size="sm"
            aria-label="Previous pages"
            disabled={page <= 0}
            onClick={() => turn(-1)}
          >
            <ChevronLeft />
          </IconButton>

          <Typography variant="span" textColor="secondary" className="text-xs">
            {page + 1} / {total}
          </Typography>

          <IconButton
            variant="tertiary"
            size="sm"
            aria-label="Next pages"
            disabled={page >= total - 1}
            onClick={() => turn(1)}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>
    </>
  );
}
