import { useEffect, useState } from 'react';

/**
 * Which heading the reader is on, so a contents list can say so.
 *
 * The last heading that has passed under the sticky header, rather than whichever one an observer
 * happens to find intersecting. A long section has no heading on screen at all in the middle of it,
 * and an intersection observer answers that by keeping the previous section lit — which is the
 * section the reader has already left.
 *
 * Positions are read on an animation frame, so the scroll handler itself does no layout. That
 * matters on an article with thirty headings, where measuring on every scroll event would be
 * thirty `getBoundingClientRect` calls a frame.
 */
export function useActiveHeading(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  /* The ids as one string: the array is rebuilt on every render, its contents are not. */
  const key = ids.join('|');

  useEffect(() => {
    const all = key ? key.split('|') : [];

    if (all.length === 0) {
      return;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;

      let current = all[0];

      for (const id of all) {
        const element = document.getElementById(id);

        // 88px: the sticky header plus the breathing room `scroll-mt-20` leaves under it.
        if (element && element.getBoundingClientRect().top <= 88) {
          current = id;
        }
      }

      setActive(current);
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [key]);

  return active;
}
