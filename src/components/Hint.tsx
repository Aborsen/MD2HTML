import type { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/components/Tooltip';

interface HintProps {
  content: ReactNode;
  children: ReactNode;
}

/** Thin composition helper over the kit's Radix tooltip primitives. */
export function Hint({ content, children }: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
