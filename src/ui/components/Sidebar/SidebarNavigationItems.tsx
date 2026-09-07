import { ChevronRight } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../Collapsible';
import { TruncatedTitleTooltip } from '../TruncatedTitleTooltip';
import { SidebarGroup } from './SidebarGroup';
import { SidebarMenu } from './SidebarMenu';
import { SidebarMenuButton } from './SidebarMenuButton';
import { SidebarMenuItem } from './SidebarMenuItem';
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './SidebarMenuSub';
import { useSidebar } from './SidebarProvider';
import {
  type DefaultLink,
  isNavigationGroup,
  isNavigationItem,
  type NavigationElement,
  type NavigationItem,
  type RenderLinkOptions,
} from './types';

interface SidebarNavigationItemsProps<T extends DefaultLink> {
  items: NavigationElement<T>[];
  renderLink?: (item: NavigationItem, options?: RenderLinkOptions) => ReactNode;
}

const stopMenuButtonPropagation = (event: MouseEvent) => {
  event.stopPropagation();
};

const menuButtonClassName = cn(
  'gap-1.5 px-1.5 py-1.5',
  'text-ink-secondary [&_svg]:size-5',

  'group-data-[state=expanded]:min-h-9',
  'group-data-[state=expanded]:rounded-none',
  'group-data-[state=expanded]:px-4'
);

/**
 * Component that maps a collection of navigation elements into sidebar UI.
 * It automatically handles the differentiation between single links and collapsible groups,
 * applying the appropriate Sidebar and Collapsible primitives.
 */
function SidebarNavigationItems<T extends DefaultLink>({
  items,
  renderLink,
}: SidebarNavigationItemsProps<T>) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed' && !isMobile;

  const renderItemLink = (
    item: NavigationItem<T>,
    options?: RenderLinkOptions
  ) => {
    if (renderLink) {
      return renderLink(item, options);
    }
    return (
      <a href={item.url}>
        {item.icon && <item.icon />}
        <span className="font-medium">{item.title}</span>
      </a>
    );
  };

  const renderViewAllLink = (item: NavigationItem<T>) => {
    if (renderLink) {
      return renderLink(item, {
        className: 'flex items-center gap-0.5',
        onClick: stopMenuButtonPropagation,
        trailingChildren: <ChevronRight className="size-4 shrink-0" />,
      });
    }

    return (
      <a
        href={item.url}
        className="flex items-center gap-0.5"
        onClick={stopMenuButtonPropagation}
      >
        <span className="font-medium">{item.title}</span>
        <ChevronRight className="size-4 shrink-0" />
      </a>
    );
  };

  const renderItem = (item: NavigationElement<T>) => {
    if (isNavigationItem(item)) {
      return (
        <SidebarMenuItem key={item.id ?? item.title}>
          <SidebarMenuButton asChild className={menuButtonClassName}>
            {renderItemLink(item)}
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    if (isNavigationGroup(item)) {
      const Icon = item.icon;
      const isEmpty = item.items.length === 0;

      if (isCollapsed) {
        const collapsedKey = `${item.id ?? item.title}-collapsed`;
        if (item.viewAll) {
          const viewAllAsItem = {
            ...item.viewAll,
            icon: item.icon,
            title: item.title,
          } as NavigationItem<T>;

          return (
            <SidebarMenuItem key={collapsedKey}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                className={menuButtonClassName}
              >
                {renderItemLink(viewAllAsItem, { controlledActive: true })}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }

        return (
          <SidebarMenuItem key={collapsedKey}>
            <SidebarMenuButton
              isActive={item.isActive}
              className={menuButtonClassName}
            >
              {Icon && <Icon />}
              <span className="font-medium">{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }

      return (
        // Key includes isEmpty so Collapsible remounts when items first arrive,
        // resetting defaultOpen to true. Without this the group starts collapsed
        // even after conversations are fetched.
        <Collapsible
          key={`${item.id ?? item.title}-${isEmpty ? 'empty' : 'filled'}`}
          asChild
          defaultOpen={item.defaultOpen ?? !isEmpty}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <div className="group/trigger-row relative">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={item.isActive}
                  className={cn(
                    'group/collapsible-trigger !pe-0',
                    menuButtonClassName
                  )}
                >
                  {Icon && <Icon />}

                  <span className="font-medium">{item.title}</span>

                  <ChevronRight className="opacity-0 transition-transform duration-200 group-hover/trigger-row:opacity-100 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {item.viewAll && (
                <SidebarMenuButton
                  asChild
                  data-sidebar="menu-action"
                  className={cn(
                    '!bg-transparent',
                    'absolute end-0 top-1/2 -translate-y-1/2',
                    'h-4 w-fit gap-0.5 p-0 text-sm',
                    '!text-ink-secondary hover:!text-ink-body',
                    'opacity-0 transition-opacity duration-200',
                    'group-hover/trigger-row:opacity-100'
                  )}
                >
                  {renderViewAllLink(item.viewAll)}
                </SidebarMenuButton>
              )}
            </div>
            <CollapsibleContent>
              <SidebarMenuSub>
                {isEmpty && item.emptyMessage ? (
                  <SidebarMenuSubItem className="flex items-center py-1">
                    <span className="ps-2 text-ink-secondary text-xs">
                      {item.emptyMessage}
                    </span>
                  </SidebarMenuSubItem>
                ) : (
                  item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.id ?? subItem.title}>
                      <TruncatedTitleTooltip title={subItem.title}>
                        <SidebarMenuSubButton asChild className="px-1.5">
                          {renderItemLink(subItem)}
                        </SidebarMenuSubButton>
                      </TruncatedTitleTooltip>
                    </SidebarMenuSubItem>
                  ))
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>{items.map((item) => renderItem(item))}</SidebarMenu>
    </SidebarGroup>
  );
}

export { SidebarNavigationItems, type SidebarNavigationItemsProps };
