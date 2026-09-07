import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

interface SectionHeadingProps {
  /** Small label above the title — a category, not a sentence. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** A link or button that belongs to the section, kept on the same line as the title. */
  action?: ReactNode;
  className?: string;
}

/**
 * The heading of a page section: eyebrow, title, one line of description, and whatever the section
 * lets you do about it.
 *
 * Written once because the three places that need it — a marketing block, a list of articles, a
 * question and answer set — were each about to grow their own, and three headings that are nearly
 * the same read as three different products.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="space-y-1">
        {eyebrow && (
          <Typography
            variant="span"
            textColor="light"
            className="block text-xxs uppercase tracking-wide"
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h2" className="text-lg md:text-lg">
          {title}
        </Typography>
        {description && (
          <Typography variant="p" textColor="secondary" className="text-sm">
            {description}
          </Typography>
        )}
      </div>
      {action && <div className="shrink-0 pb-0.5">{action}</div>}
    </div>
  );
}
