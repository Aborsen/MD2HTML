import type { CrumbSpec } from '@/lib/breadcrumbs';
import type { AppView } from '@/lib/route';
import { Breadcrumbs } from '@/ui/components/Breadcrumbs';

interface AppBreadcrumbsProps {
  items: CrumbSpec[];
  /** Moving inside the app rather than reloading it, when the destination is a view we have. */
  onNavigate: (view: AppView) => void;
  className?: string;
}

/** The trail from `src/lib/breadcrumbs.ts`, wired to this app's navigation. */
export function AppBreadcrumbs({
  items,
  onNavigate,
  className,
}: AppBreadcrumbsProps) {
  return (
    <Breadcrumbs
      className={className}
      items={items.map((crumb) => ({
        label: crumb.label,
        href: crumb.path,
        onNavigate: crumb.path
          ? () => onNavigate(crumb.path === '/blog' ? 'blog' : 'converter')
          : undefined,
      }))}
    />
  );
}
