import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CodeBlockProps {
  children: ReactNode;
  /** Overrides the surface, the radius or the height where a place needs its own. */
  className?: string;
  /** Names the language for a reader and for anyone styling by it later. */
  language?: string;
}

/**
 * A block of code or output, scrolling inside its own box.
 *
 * The scroll is the point: a curl command, a YAML file and an exported document are all wider than
 * the column they sit in, and without a container of their own the page itself scrolls sideways —
 * which on a phone breaks every other part of the layout at once.
 */
export function CodeBlock({ children, className, language }: CodeBlockProps) {
  return (
    <pre
      data-language={language}
      className={cn(
        'overflow-auto rounded-md border border-stroke bg-surface-card2 p-4',
        'font-mono text-ink-body text-xs leading-relaxed',
        className
      )}
    >
      <code>{children}</code>
    </pre>
  );
}

/** A literal in a sentence — a flag, a header, a path, an endpoint. */
export function InlineCode({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <code
      className={cn(
        'rounded bg-surface-card2 px-1 py-0.5 font-mono text-ink-primary text-xs',
        className
      )}
    >
      {children}
    </code>
  );
}
