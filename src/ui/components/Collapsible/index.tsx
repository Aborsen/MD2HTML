'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

/**
 * The root container that manages the open/closed state.
 */
const Collapsible = CollapsiblePrimitive.Root;

/**
 * The interactive element (usually a button) that toggles the content visibility.
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

/**
 * The expandable panel that contains the content to be shown or hidden.
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
