import { ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { IconButton } from '@/ui/components/IconButton';
import { cn } from '@/ui/lib/utils';

/** How far down the reader has to be before the button is worth offering. */
const THRESHOLD = 320;

/** Whatever is scrolling right now: the fullscreen sheet, or the page behind it. */
function scroller(): HTMLElement | null {
  const fullscreen = document.fullscreenElement as HTMLElement | null;

  return fullscreen &&
    fullscreen.scrollHeight > fullscreen.clientHeight + THRESHOLD / 4
    ? fullscreen
    : null;
}

/**
 * Smooth if the browser will animate it, instant if it will not.
 *
 * A smooth scroll is a request, not a guarantee — it is ignored under `prefers-reduced-motion`,
 * and there are contexts where it silently does nothing at all. A button that sometimes fails to
 * do the one thing it promises is worse than one that jumps, so the position is checked and the
 * jump is made if nothing moved.
 */
function scrollToTop(element: HTMLElement | null) {
  const target = element ?? window;
  const read = () => (element ? element.scrollTop : window.scrollY);
  const from = read();

  target.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    if (read() === from && from > 0) {
      target.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, 250);
}

/**
 * Back to the top of a long document.
 *
 * Rendered inside the preview frame on purpose: in fullscreen the browser paints only that
 * subtree, so a button living anywhere else would simply vanish exactly when a document is long
 * enough to need it.
 */
export function ScrollToTop({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  const measure = useCallback(() => {
    const element = scroller();

    setIsVisible((element ? element.scrollTop : window.scrollY) > THRESHOLD);
  }, []);

  useEffect(() => {
    // Capture, because a scroll on an inner element does not bubble.
    window.addEventListener('scroll', measure, true);
    document.addEventListener('fullscreenchange', measure);
    measure();

    return () => {
      window.removeEventListener('scroll', measure, true);
      document.removeEventListener('fullscreenchange', measure);
    };
  }, [measure]);

  if (!isVisible) {
    return null;
  }

  return (
    <IconButton
      variant="secondary"
      size="lg"
      rounded="full"
      aria-label="Scroll to top"
      className={cn(
        'fixed right-6 bottom-6 z-40 shadow-dropdown',
        'transition-opacity hover:opacity-100',
        className
      )}
      onClick={() => scrollToTop(scroller())}
    >
      <ArrowUp />
    </IconButton>
  );
}
