'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { TooltipContent } from './TooltipContent';

/**
 * Global wrapper that manages the delay and skip-delay for all tooltips in the application.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * The root component that manages the state and logic for an individual tooltip.
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * The wrapper for element that triggers the tooltip on hover or focus.
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

export { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent };
