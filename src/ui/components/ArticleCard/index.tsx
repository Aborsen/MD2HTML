import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../Badge';
import { Typography } from '../Typography';

export interface ArticleCardProps {
  title: string;
  description: string;
  /** Where it goes. Rendered as a real href so the link can be opened in a new tab. */
  href: string;
  onOpen?: () => void;
  tag?: string;
  meta?: string;
  /** Gives the first card of a list more room, for a lead article. */
  featured?: boolean;
  className?: string;
}

/**
 * One article, as a card.
 *
 * An anchor rather than a div with a click handler: a reader who wants the article in a second tab
 * should get it, and a card that swallows the middle button is a card people stop trusting. The
 * handler is what keeps an in-app click from reloading the whole application.
 */
export function ArticleCard({
  title,
  description,
  href,
  onOpen,
  tag,
  meta,
  featured = false,
  className,
}: ArticleCardProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        // Let the browser handle anything that means "somewhere else, please".
        if (
          !onOpen ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.button !== 0
        ) {
          return;
        }

        event.preventDefault();
        onOpen();
      }}
      className={cn(
        'group flex h-full flex-col gap-2 rounded-lg border border-stroke bg-surface-card p-4',
        'transition-colors hover:border-stroke-hover hover:bg-state-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page',
        className
      )}
    >
      {(tag || meta) && (
        <div className="flex items-center gap-2">
          {tag && (
            <Badge variant="secondary" size="sm">
              {tag}
            </Badge>
          )}
          {meta && (
            <Typography variant="span" textColor="light" className="text-xs">
              {meta}
            </Typography>
          )}
        </div>
      )}

      <Typography
        variant="h3"
        className={cn(
          'text-ink-primary',
          featured ? 'text-lg md:text-xl' : 'text-base md:text-base'
        )}
      >
        {title}
      </Typography>

      <Typography
        variant="p"
        textColor="secondary"
        className={cn('text-sm', featured ? 'line-clamp-4' : 'line-clamp-3')}
      >
        {description}
      </Typography>

      <span className="mt-auto flex items-center gap-1 pt-2 font-medium text-brand-tertiary text-sm">
        Read
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
