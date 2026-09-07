import type { LucideIcon } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

export interface DefaultLink {
  url: string;
  params?: Record<string, unknown>;
  search?: Record<string, unknown>;
}

export interface RenderLinkOptions {
  controlledActive?: boolean;
  className?: string;
  trailingChildren?: ReactNode;
  onClick?: (event: MouseEvent) => void;
}

export type NavigationItem<TLink = DefaultLink> = {
  id?: string;
  title: string;
  icon?: LucideIcon;
  className?: string;
} & TLink;

export interface NavigationGroup<TLink = DefaultLink> {
  id?: string;
  title: string;
  items: NavigationItem<TLink>[];
  icon: LucideIcon;
  className?: string;
  isActive?: boolean;
  defaultOpen?: boolean;
  emptyMessage?: string;
  viewAll?: NavigationItem<TLink>;
}

export type NavigationElement<TLink = DefaultLink> =
  | NavigationItem<TLink>
  | NavigationGroup<TLink>;

export function isNavigationGroup(
  item: NavigationElement
): item is NavigationGroup {
  return 'items' in item;
}

export function isNavigationItem(
  item: NavigationElement
): item is NavigationItem {
  return 'url' in item;
}
