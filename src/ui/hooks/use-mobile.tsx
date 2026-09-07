import { useEffect, useState } from 'react';

/**
 * Max-width breakpoints (px) aligned with Tailwind's default `screens`.
 * Use these instead of hardcoding pixel values so JS media queries stay in
 * sync with `sm:`/`md:`/`lg:`/`xl:` utility classes.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Tracks whether the viewport is narrower than `maxWidth` (px), updating on
 * resize. Generic building block for responsive behavior — pair with a
 * {@link BREAKPOINTS} value to match a Tailwind screen.
 */
export function useMaxWidth(maxWidth: number) {
  const [isBelow, setIsBelow] = useState(() => window.innerWidth < maxWidth);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth - 1}px)`);
    const onChange = () => setIsBelow(window.innerWidth < maxWidth);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [maxWidth]);

  return isBelow;
}

/** True below the Tailwind `md` breakpoint (768px). */
export function useIsMobile() {
  return useMaxWidth(BREAKPOINTS.md);
}
