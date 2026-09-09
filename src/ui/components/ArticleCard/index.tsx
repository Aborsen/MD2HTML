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
        featured && image ? 'flex-col sm:flex-row sm:items-center' : 'flex-col',
        'transition-colors hover:border-stroke-hover hover:bg-state-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page',
        className
      )}
    >
      {/*
        * The cover is drawn at 1.905:1 and shown at 1.905:1, so nothing is cropped.
        *
        * It carries the headline now, which is why the ratio matters more than it did: a crop that
        * takes the sides off takes the words with it. An earlier version covered a 2.86:1 picture
        * into a 1.9:1 box beside the lead's headline and "CONVERTING" arrived as "TING".
        */}
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          className={cn(
            'w-full object-cover',
            'aspect-[1200/630]',
            featured
              ? 'border-stroke border-b sm:w-[44%] sm:shrink-0 sm:self-center sm:border-r-0 sm:border-b-0'
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
      {tag && (
        <div>
          <Badge variant="secondary" size="sm">
            {tag}
          </Badge>
        </div>
      )}

      {/*
        * Two lines, clamped.
        *
        * Unclamped, one nine-word headline in a row of three made every card in that row as tall as
        * itself, and a grid of cards whose height is set by the longest title in each row reads as
        * a broken layout rather than a list.
        */}
      <Typography
        variant="h3"
        className={cn(
          'line-clamp-2 text-ink-primary',
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

      {/*
        * The date and the reading time, at the bottom, in the mono face.
        *
        * This replaced a "Read →" affordance. The whole card is already a link, so the row said
        * nothing the cursor did not, and it sat where a reader looks for the date.
        */}
      {meta && (
        <Typography
          variant="span"
          textColor="light"
          className="mt-auto pt-2 font-mono text-[11px]"
        >
          {meta}
        </Typography>
      )}
      </div>
    </a>
  );
}
