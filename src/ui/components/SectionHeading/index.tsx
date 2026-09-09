import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

interface SectionHeadingProps {
  /** Small label above the title — a category, not a sentence. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** A link or button that belongs to the section, kept beside the title when left-aligned. */
  action?: ReactNode;
  /** `center` is for a band that opens a new part of the page; `left` for a section inside one. */
  align?: 'left' | 'center';
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * The heading of a page section: eyebrow, title, one line of description, and whatever the section
 * lets you do about it.
 *
 * Written once because the places that need it — a marketing band, a list of articles, a question
 * and answer set, a documentation section — were each about to grow their own, and four headings
 * that are nearly the same read as four different products.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  size = 'md',
  className,
}: SectionHeadingProps) {
  const centred = align === 'center';

  return (
    <div
      className={cn(
        centred
          ? 'flex flex-col items-center gap-3 text-center'
          : 'flex items-end justify-between gap-4',
        className
      )}
    >
      <div className={cn(centred ? 'flex flex-col items-center gap-3' : 'space-y-1')}>
        {eyebrow && (
          <Typography
            variant="span"
            textColor="light"
            className="block text-xxs uppercase tracking-wide"
          >
            {eyebrow}
          </Typography>
        )}

        <Typography
          variant="h2"
          className={cn(
            size === 'lg' ? 'text-2xl md:text-3xl' : 'text-lg md:text-lg',
            'text-balance'
          )}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="p"
            textColor="secondary"
            /*
             * Centred means centred, including this line.
             *
             * It had `max-w-xl` and nothing else, so a two-line description sat left-aligned inside
             * a narrow column under a centred title — which reads as a mistake rather than a
             * choice. `mx-auto` centres the column itself, since the width is what made it visible.
             */
            className={cn(
              'text-sm',
              centred && 'mx-auto max-w-xl text-pretty text-center'
            )}
          >
            {description}
          </Typography>
        )}
      </div>

      {action && (
        <div className={cn('shrink-0', centred ? 'pt-1' : 'pb-0.5')}>{action}</div>
      )}
    </div>
  );
}
