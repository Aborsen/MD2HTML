'use client';

import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { SCROLL_SHADOW_THRESHOLD } from './constants';
import { getMaskImage } from './get-mask-image';
import type { ScrollShadowOrientation, ScrollShadowVisibility } from './types';

export interface UseScrollShadowProps {
  containerRef: RefObject<HTMLElement | null>;
  orientation?: ScrollShadowOrientation;
  size?: number;
  offset?: number;
  visibility?: ScrollShadowVisibility;
  isEnabled?: boolean;
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void;
}

export function useScrollShadow({
  containerRef,
  orientation = 'vertical',
  size = 40,
  offset = 0,
  visibility = 'auto',
  isEnabled = true,
  onVisibilityChange,
}: UseScrollShadowProps) {
  const prevStateRef = useRef<{
    hasScrollBefore: boolean;
    hasScrollAfter: boolean;
  } | null>(null);

  const animationIdRef = useRef<number | null>(null);

  const applyMask = useCallback(
    (
      scrollableElement: HTMLElement,
      hasScrollBefore: boolean,
      hasScrollAfter: boolean
    ) => {
      const mask = getMaskImage(
        orientation,
        size,
        hasScrollBefore,
        hasScrollAfter
      );
      scrollableElement.style.maskImage = mask;
    },
    [orientation, size]
  );

  const checkOverflow = useCallback(() => {
    const scrollableElement = containerRef.current;

    if (!scrollableElement) return;

    const isVertical = orientation === 'vertical';
    const scrollStart = isVertical
      ? scrollableElement.scrollTop
      : scrollableElement.scrollLeft;
    const scrollSize = isVertical
      ? scrollableElement.scrollHeight
      : scrollableElement.scrollWidth;
    const clientSize = isVertical
      ? scrollableElement.clientHeight
      : scrollableElement.clientWidth;

    const hasScrollBefore = scrollStart > offset;
    const scrollEnd = scrollStart + clientSize;
    const remainingScroll = scrollSize - scrollEnd;
    const hasScrollAfter = remainingScroll > SCROLL_SHADOW_THRESHOLD;

    const prevState = prevStateRef.current;

    if (
      prevState &&
      prevState.hasScrollBefore === hasScrollBefore &&
      prevState.hasScrollAfter === hasScrollAfter
    ) {
      return;
    }

    prevStateRef.current = { hasScrollBefore, hasScrollAfter };

    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
    }

    animationIdRef.current = requestAnimationFrame(() => {
      animationIdRef.current = null;

      applyMask(scrollableElement, hasScrollBefore, hasScrollAfter);

      if (onVisibilityChange) {
        if (hasScrollBefore && hasScrollAfter) {
          onVisibilityChange('both');
        } else if (hasScrollBefore) {
          onVisibilityChange(isVertical ? 'top' : 'left');
        } else if (hasScrollAfter) {
          onVisibilityChange(isVertical ? 'bottom' : 'right');
        } else {
          onVisibilityChange('none');
        }
      }
    });
  }, [containerRef, orientation, offset, onVisibilityChange, applyMask]);

  useEffect(() => {
    const scrollableElement = containerRef.current;

    if (!scrollableElement || visibility === 'auto') return;

    switch (visibility) {
      case 'both':
        applyMask(scrollableElement, true, true);
        break;
      case 'top':
      case 'left':
        applyMask(scrollableElement, true, false);
        break;
      case 'bottom':
      case 'right':
        applyMask(scrollableElement, false, true);
        break;
      default:
        applyMask(scrollableElement, false, false);
        break;
    }
  }, [containerRef, visibility, applyMask]);

  useEffect(() => {
    const scrollableElement = containerRef.current;

    if (!scrollableElement || !isEnabled || visibility !== 'auto') return;

    checkOverflow();

    scrollableElement.addEventListener('scroll', checkOverflow, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(scrollableElement);

    const mutationObserver = new MutationObserver(checkOverflow);
    mutationObserver.observe(scrollableElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      scrollableElement.removeEventListener('scroll', checkOverflow);
      resizeObserver.disconnect();
      mutationObserver.disconnect();

      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      prevStateRef.current = null;
    };
  }, [containerRef, visibility, isEnabled, checkOverflow]);
}
