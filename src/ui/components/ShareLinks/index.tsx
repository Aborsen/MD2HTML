import { Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

/*
 * Share this page, as three links and nothing else.
 *
 * No embedded buttons and no SDK. Every one of these networks offers a script that renders its own
 * button, and every one of those scripts is a third party watching the reader — on a site whose
 * whole claim is that a document you convert is not sent anywhere. A plain anchor to a compose
 * screen does the same job: nothing loads until the reader clicks, and the only thing that reaches
 * the network is the click they asked for.
 *
 * Named rather than badged, too. `lucide-react` carries a LinkedIn glyph and the old Twitter bird,
 * but no X mark and no Reddit one, and a bird beside a real LinkedIn logo beside a hand-drawn
 * approximation of Snoo looks like three different decisions. The service names are unambiguous and
 * they render correctly everywhere.
 */

export interface ShareLinksProps {
  /** The absolute URL to share. A relative one gives the reader a broken post. */
  url: string;
  title: string;
  /**
   * The word beside the icon. A prop with a default, because this component is part of the design
   * system and must not reach into an application's message table for a translation; the network
   * names below are not translatable either way — they are the names of the services.
   */
  label?: string;
  className?: string;
}

interface Target {
  label: string;
  /** Built per target, because none of the three agrees on the parameter names. */
  href: (url: string, title: string) => string;
}

const TARGETS: Target[] = [
  {
    label: 'X',
    /*
     * `x.com/intent/post` is the current one: `twitter.com/intent/tweet` answers 301 to
     * `x.com/intent/tweet`, and a redirect is a thing to follow, not a thing to hard-code.
     */
    href: (url, title) =>
      `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: 'LinkedIn',
    /* Takes the URL alone — it reads the title and picture from the page's own og: tags. */
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: 'Reddit',
    href: (url, title) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
];

export function ShareLinks({
  url,
  title,
  label = 'Share',
  className,
}: ShareLinksProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Typography
        variant="span"
        textColor="light"
        className="flex items-center gap-1.5 text-xs"
      >
        <Share2 aria-hidden className="size-3.5" />
        {label}
      </Typography>

      {TARGETS.map((target) => (
        <a
          key={target.label}
          href={target.href(url, title)}
          /*
           * A new tab, because a reader part-way through an article should not lose it to a compose
           * screen. `noopener` because the opened page must not reach back into this one, and
           * `nofollow` because a share link is not a recommendation of the network.
           */
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={cn(
            'rounded-md border border-stroke px-2.5 py-1 font-medium text-ink-secondary text-xs',
            'transition-colors hover:border-stroke-hover hover:bg-state-hover hover:text-ink-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page'
          )}
        >
          {target.label}
        </a>
      ))}
    </div>
  );
}
