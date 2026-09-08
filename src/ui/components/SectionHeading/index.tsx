import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { SectionBadge } from '../SectionBadge';
import { Typography } from '../Typography';

interface SectionHeadingProps {
  /** Small label above the title. Rendered as a pill when `badge` is set, as plain text otherwise. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** A link or button that belongs to the section, kept beside the title when left-aligned. */
  action?: ReactNode;
  /** `center` is for a band that opens a new part of the page; `left` for a section inside one. */
  align?: 'left' | 'center';
  /** Put the eyebrow in a pill. Reads as the start of a band rather than a caption. */
  badge?: boolean;
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
  badge = false,
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
        {eyebrow &&
          (badge ? (
            <SectionBadge>{eyebrow}</SectionBadge>
          ) : (
            <Typography
              variant="span"
              textColor="light"
              className="block text-xxs uppercase tracking-wide"
            >
              {eyebrow}
            </Typography>
          ))}

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
            className={cn('text-sm', centred && 'max-w-xl text-pretty')}
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
