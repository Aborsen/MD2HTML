import { RefreshCcw } from 'lucide-react';
import { IconButton } from '../IconButton';

interface FileRetryProps {
  onRetry: () => void;
}

export const FileRetry = ({ onRetry }: FileRetryProps) => {
  return (
    <IconButton variant="transparent" size="sm" onClick={onRetry}>
      <RefreshCcw className="size-4 text-ink-secondary" />
    </IconButton>
  );
};
