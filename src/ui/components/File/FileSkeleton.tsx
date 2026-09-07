import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/utils';
import { Skeleton } from '../Skeleton';

interface FileSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Placeholder for the leading icon slot (e.g. matches {@link File}). */
  showLeading?: boolean;
  /** Second line (e.g. file size). */
  showMetadataLine?: boolean;
  /** Placeholder for the trailing slot (e.g. spinner). */
  showTrailing?: boolean;
}

function FileSkeleton({
  className,
  showLeading,
  showMetadataLine,
  showTrailing,
  ...props
}: FileSkeletonProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center justify-between gap-2',
        'rounded-sm',
        'border border-stroke',
        'px-2 py-1',
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showLeading ? (
          <Skeleton className="size-6 shrink-0" rounded="md" />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
          <Skeleton className="h-4 w-full" rounded="sm" />
          {showMetadataLine ? (
            <Skeleton className="h-3 w-full" rounded="sm" />
          ) : null}
        </div>
      </div>

      {showTrailing ? (
        <Skeleton className="size-4 shrink-0" rounded="full" />
      ) : null}
    </div>
  );
}

FileSkeleton.displayName = 'FileSkeleton';

export { FileSkeleton, type FileSkeletonProps };
