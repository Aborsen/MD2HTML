import { X } from 'lucide-react';
import { IconButton } from '../IconButton';

interface FileDismissProps {
  onDismiss: () => void;
}

export const FileDismiss = ({ onDismiss }: FileDismissProps) => {
  return (
    <IconButton variant="transparent" size="sm" onClick={onDismiss}>
      <X className="size-4 text-ink-secondary" />
    </IconButton>
  );
};
