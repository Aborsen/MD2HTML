import * as PopoverPrimitive from '@radix-ui/react-popover';
import { PopoverContent } from './PopoverContent';

/**
 * The root component that manages the open/closed state of the popover.
 */
const Popover = PopoverPrimitive.Root;

/**
 * An optional element used as the positioning reference for the popover.
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * The element (usually a button) that toggles the popover when clicked.
 */
const PopoverTrigger = PopoverPrimitive.Trigger;

export { Popover, PopoverAnchor, PopoverTrigger, PopoverContent };
