import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionBadgeProps {
  children: ReactNode;
  /** Replaces the default sparkle; pass `null` for a pill with no icon. */
  icon?: ReactNode;
  className?: string;
}

/**
 * The small pill that names a band of the page — FROM THE BLOG, FAQ, DOCUMENTATION.
 *
 * It exists so a long page reads as a sequence of sections rather than one sheet: an eyebrow in
 * plain text disappears into the paragraph above it, and a pill does not.
 */
export function SectionBadge({ children, icon, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-surface-accent px-3 py-1',
        'font-medium text-brand-tertiary text-xs uppercase tracking-wide',
        className
      )}
    >
      {icon === undefined ? <Sparkles className="size-3" /> : icon}
      {children}
    </span>
  );
}
