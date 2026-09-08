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
  /** The cover, drawn by `npm run og`. Without one the card is a title and two lines of grey. */
  image?: string;
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
  image,
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
          // Alt-click is "save this link", which is the browser's job, not ours.
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }

        event.preventDefault();
        onOpen();
      }}
      className={cn(
        'group flex h-full overflow-hidden rounded-lg border border-stroke bg-surface-card',
        image ? 'gap-0' : 'gap-2 p-4',
        /*
         * The lead card splits sideways from `sm`, everything else stacks.
         *
         * Stacked, the lead's cover is the full width of the page at 1200 by 630 — 537px tall on a
         * 1440px screen, which pushed the headline it belongs to below the fold. Beside the text it
         * is a picture; above the text it is an obstacle.
         */
        featured && image ? 'flex-col sm:flex-row' : 'flex-col',
        'transition-colors hover:border-stroke-hover hover:bg-state-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page',
        className
      )}
    >
      {/*
        * The cover, at the ratio it was drawn: 1200 by 630. `aspect-[1200/630]` rather than a
        * height, so a card in a three-column grid and the full-width lead both keep the picture
        * whole instead of cropping the title out of it.
        */}
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          className={cn(
            'aspect-[1200/630] w-full object-cover',
            featured
              ? 'border-stroke border-b sm:w-[46%] sm:shrink-0 sm:border-r sm:border-b-0'
              : 'border-stroke border-b'
          )}
        />
      )}

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col gap-2',
          image && 'p-4',
          featured && image && 'sm:justify-center sm:p-6'
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
      </div>
    </a>
  );
}
