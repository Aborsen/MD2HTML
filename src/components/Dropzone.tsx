import { CloudUpload, FileText } from 'lucide-react';
import { type DragEvent, type ChangeEvent, useRef, useState } from 'react';
import { Button } from '@/ui/components/Button';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

export const ACCEPTED_EXTENSIONS = ['.md', '.markdown', '.mdown', '.mkd', '.txt'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface DropzoneProps {
  isBusy?: boolean;
  /** Several files are chained into one document, in the order they arrive. */
  onFiles: (files: File[]) => void;
}

export function Dropzone({ isBusy = false, onFiles }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []);

    if (files.length > 0) {
      onFiles(files);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      onFiles(files);
    }

    // allow re-picking the same file
    event.target.value = '';
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-dropzone-border border-dashed px-6 py-14 text-center',
        'bg-surface-card transition-colors duration-base',
        isDragging && 'border-dropzone-border-active bg-dropzone-bg-active',
        isBusy && 'pointer-events-none opacity-disabled'
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
        <CloudUpload className="size-7" />
      </span>

      <div className="flex flex-col items-center gap-1.5">
        <Typography variant="lead" weight="bold" textColor="primary">
          Drop Markdown files here
        </Typography>
        <Typography variant="p" textColor="secondary" align="center">
          Upload an <span className="font-medium">.md</span> file and see
          exactly how it will look in HTML. Drop several and they are chained
          into one document, in the order you pick them.
        </Typography>
      </div>

      <Button
        variant="primary"
        size="md"
        leftSlot={<FileText />}
        onClick={() => inputRef.current?.click()}
      >
        Choose files
      </Button>

      <Typography variant="span" textColor="light" className="text-xs">
        {ACCEPTED_EXTENSIONS.join(', ')} · up to 10 MB · processed in your
        browser
      </Typography>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
