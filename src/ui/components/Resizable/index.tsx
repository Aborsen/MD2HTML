'use client';

import { GripVertical } from 'lucide-react';
import {
  Group,
  type GroupProps,
  Panel,
  type PanelImperativeHandle,
  Separator,
  type SeparatorProps,
} from 'react-resizable-panels';
import { cn } from '../../lib/utils';

/** Horizontal or vertical group of resizable panels. */
const ResizablePanelGroup = ({ className, ...props }: GroupProps) => (
  <Group className={cn('flex h-full w-full', className)} {...props} />
);

/** A single resizable panel inside a ResizablePanelGroup. */
const ResizablePanel = Panel;

/** Drag handle between two ResizablePanels. */
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: SeparatorProps & {
  withHandle?: boolean;
}) => (
  <Separator
    className={cn(
      'relative flex w-px items-center justify-center bg-stroke',
      'after:absolute after:inset-y-0 after:-right-1 after:-left-1',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-1',
      '[&[data-resize-handle-state=drag]]:bg-brand-secondary/50',
      '[&[data-resize-handle-state=hover]]:bg-brand-secondary/30',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-stroke bg-stroke">
        <GripVertical className="size-2.5" />
      </div>
    )}
  </Separator>
);

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  type PanelImperativeHandle,
};
