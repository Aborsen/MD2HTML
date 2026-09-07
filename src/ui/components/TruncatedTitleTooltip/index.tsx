import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

interface TruncatedTitleTooltipProps {
  /** Text to show inside the tooltip. */
  title: string;
  /** Trigger element. Tooltip opens only when the resolved target is overflowing. */
  children: ReactNode;
  /**
   * Resolves the element whose overflow should be checked, given the trigger element.
   * Defaults to the last `<span>` child of the trigger, which matches common
   * `<a><Icon /><span>label</span></a>` patterns where the label uses `truncate`.
   * Return `null` to fall back to measuring the trigger element itself.
   */
  getTruncationTarget?: (trigger: Element) => Element | null;
  /** Tooltip side. Defaults to `right`. */
  side?: ComponentProps<typeof TooltipContent>['side'];
  /** Extra classes for the tooltip content. */
  className?: string;
}

const defaultGetTarget = (trigger: Element) =>
  trigger.querySelector<HTMLElement>(':scope > span:last-child');

const isOverflowing = (node: Element | null) =>
  Boolean(node && node.scrollWidth > node.clientWidth);

/**
 * Wraps any trigger element with a tooltip that appears only when the target
 * element is actually overflowing (`scrollWidth > clientWidth`). Truncation is
 * re-measured on each pointer enter / focus so it stays accurate after resizes
 * or text changes. Radix manages the open state — we only hide the content when
 * there is nothing to reveal, which keeps `delayDuration` / `skipDelayDuration`
 * behavior intact and avoids flicker from a controlled `open`.
 */
function TruncatedTitleTooltip({
  title,
  children,
  getTruncationTarget = defaultGetTarget,
  side = 'right',
  className,
}: TruncatedTitleTooltipProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const measure = useCallback(() => {
    const trigger = wrapperRef.current?.firstElementChild;
    if (!trigger) return;
    const target = getTruncationTarget(trigger) ?? trigger;
    setIsTruncated(isOverflowing(target));
  }, [getTruncationTarget]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          ref={wrapperRef}
          className="flex w-full min-w-0"
          onPointerEnter={measure}
          onFocus={measure}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipPrimitive.Portal>
        <TooltipContent
          side={side}
          align="center"
          hidden={!isTruncated}
          className={cn(
            'max-w-52 break-words bg-ink-primary text-surface-card',
            className
          )}
          arrowClassName="fill-ink-primary"
        >
          {title}
        </TooltipContent>
      </TooltipPrimitive.Portal>
    </Tooltip>
  );
}

export { TruncatedTitleTooltip };
