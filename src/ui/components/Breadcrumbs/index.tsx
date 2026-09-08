import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Crumb {
  label: string;
  /** The address. Omitted on the last crumb, which is the page you are on. */
  href?: string;
  /** Handled in the app when the destination is a view this app already has. */
  onNavigate?: () => void;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Where this page sits, and the way back up.
 *
 * Two jobs, and both matter. A reader who arrived from a search result has no history to go back
 * through and no idea what else is here; a crawler reads the trail as the site's shape, which is
 * why the prerendered pages carry the same trail as `BreadcrumbList` structured data and why a
 * search result can show it instead of a bare URL.
 *
 * The last crumb is the current page: not a link, and marked as current, because a link to where
 * you already are is a link that does nothing.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-ink-secondary text-xs">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  aria-hidden
                  className="size-3 shrink-0 text-ink-inactive"
                />
              )}

              {isLast || !crumb.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="min-w-0 truncate text-ink-body"
                >
                  {crumb.label}
                </span>
              ) : (
                <a
                  href={crumb.href}
                  onClick={(event) => {
                    /* The browser keeps the clicks it was asked for. */
                    if (
                      !crumb.onNavigate ||
                      event.defaultPrevented ||
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    ) {
                      return;
                    }

                    event.preventDefault();
                    crumb.onNavigate();
                  }}
                  className={cn(
                    'rounded no-underline transition-colors hover:text-brand-tertiary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2'
                  )}
                >
                  {crumb.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
