import type { ReactNode } from 'react';
import { Spinner } from '../Spinner';
import { FileDismiss } from './FileDismiss';
import { FileRetry } from './FileRetry';

interface FileRightSlotProps {
  slot?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const FileRightSlot = ({
  slot,
  isLoading,
  isError,
  onRetry,
  onDismiss,
}: FileRightSlotProps) => {
  if (slot) {
    return slot;
  }

  if (isLoading) {
    return <Spinner size="sm" color="accent" />;
  }

  if (isError && onRetry && onDismiss) {
    return (
      <div className="flex items-center gap-1">
        <FileRetry onRetry={onRetry} />
        <FileDismiss onDismiss={onDismiss} />
      </div>
    );
  }

  if (onDismiss) {
    return <FileDismiss onDismiss={onDismiss} />;
  }

  return null;
};
