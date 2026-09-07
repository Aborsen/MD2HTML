import { Download, Eye, FileText, Trash2 } from 'lucide-react';
import { formatBytes, formatDateTime, formatRelative } from '@/lib/format';
import type { HistoryEntry } from '@/lib/history';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import { StatusView } from '@/ui/components/StatusView';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/components/Table';
import { Hint } from '@/components/Hint';
import { Typography } from '@/ui/components/Typography';

interface HistoryPageProps {
  entries: HistoryEntry[];
  onOpen: (entry: HistoryEntry) => void;
  onDownload: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onGoToConverter: () => void;
}

export function HistoryPage({
  entries,
  onOpen,
  onDownload,
  onRemove,
  onClear,
  onGoToConverter,
}: HistoryPageProps) {
  if (entries.length === 0) {
    return (
      <StatusView
        tone="muted"
        title="No conversions yet"
        description="Every file you convert shows up here — reopen the preview or download the HTML again in one click."
        actions={
          <Button variant="primary" size="sm" onClick={onGoToConverter}>
            Convert a file
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Typography variant="h4" weight="semibold" textColor="primary">
            History
          </Typography>
          <Typography variant="p" textColor="secondary">
            {entries.length} {entries.length === 1 ? 'file' : 'files'} converted
            on this device.
          </Typography>
        </div>

        <Button
          variant="destructiveTertiary"
          size="sm"
          leftSlot={<Trash2 />}
          onClick={onClear}
        >
          Clear history
        </Button>
      </div>

      <Table wrapperClassName="shadow-rest">
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead className="hidden sm:table-cell">Size</TableHead>
            <TableHead className="hidden md:table-cell">Content</TableHead>
            <TableHead>Converted</TableHead>
            <TableHead className="w-28 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry) => {
            const isReopenable = entry.markdown !== undefined;

            return (
              <TableRow key={entry.id}>
                <TableCell className="max-w-[16rem]">
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText className="size-4 shrink-0 text-brand-tertiary" />
                    <span className="truncate font-medium text-ink-primary">
                      {entry.name}
                    </span>
                  </span>
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  {formatBytes(entry.size)}
                </TableCell>

                <TableCell className="hidden md:table-cell text-ink-secondary">
                  {entry.stats.words} words · {entry.stats.headings} headings
                </TableCell>

                <TableCell>
                  <Hint content={formatDateTime(entry.createdAt)}>
                    <span>{formatRelative(entry.createdAt)}</span>
                  </Hint>
                </TableCell>

                <TableCell className="text-right">
                  <span className="flex items-center justify-end gap-1">
                    <Hint
                      content={
                        isReopenable
                          ? 'Open preview'
                          : 'Source was too large to keep locally'
                      }
                    >
                      <span>
                        <IconButton
                          variant="tertiary"
                          size="sm"
                          aria-label="Open preview"
                          disabled={!isReopenable}
                          onClick={() => onOpen(entry)}
                        >
                          <Eye />
                        </IconButton>
                      </span>
                    </Hint>

                    <Hint content="Download .html">
                      <span>
                        <IconButton
                          variant="tertiary"
                          size="sm"
                          aria-label="Download HTML"
                          disabled={!isReopenable}
                          onClick={() => onDownload(entry)}
                        >
                          <Download />
                        </IconButton>
                      </span>
                    </Hint>

                    <Hint content="Remove from history">
                      <span>
                        <IconButton
                          variant="destructiveTertiary"
                          size="sm"
                          aria-label="Remove from history"
                          onClick={() => onRemove(entry.id)}
                        >
                          <Trash2 />
                        </IconButton>
                      </span>
                    </Hint>
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
