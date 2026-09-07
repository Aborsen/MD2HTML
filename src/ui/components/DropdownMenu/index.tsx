'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { DropdownMenuCheckboxItem } from './DropdownMenuCheckboxItem';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuRadioItem } from './DropdownMenuRadioItem';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownMenuShortcut } from './DropdownMenuShortcut';
import { DropdownMenuSubContent } from './DropdownMenuSubContent';

/**
 * The root component that manages the open/closed state of the dropdown.
 */
const DropdownMenu = DropdownMenuPrimitive.Root;

/**
 * The element (usually a button) that toggles the dropdown menu when clicked.
 */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

/**
 * A wrapper to group related menu items, often used in conjunction with a label.
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/**
 * Portals the menu content into a different part of the DOM to ensure correct stacking and positioning.
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/**
 * The root component for a nested submenu.
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * A group of radio items where only one item can be selected at a time.
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
};
