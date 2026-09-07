import { Cloud, Download, Eye, FileText, MonitorSmartphone, Trash2 } from 'lucide-react';
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
  /** True when the list comes from the signed-in account rather than this browser. */
  isSynced: boolean;
  onOpen: (entry: HistoryEntry) => void;
  onDownload: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onGoToConverter: () => void;
}

export function HistoryPage({
  entries,
  isSynced,
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
        description={
          isSynced
            ? 'Every file you convert is saved to your account — open it from any device.'
            : 'Every file you convert shows up here. Sign in to keep the list across devices.'
        }
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
          <Typography
            variant="p"
            textColor="secondary"
            className="flex items-center gap-1.5"
          >
            {isSynced ? (
              <Cloud className="size-4 text-brand-tertiary" />
            ) : (
              <MonitorSmartphone className="size-4" />
            )}
            {entries.length} {entries.length === 1 ? 'file' : 'files'}
            {isSynced ? ' in your account' : ' converted on this device'}
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
            <TableHead className="w-44 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry) => {
            const isReopenable = entry.markdown !== undefined || entry.remote === true;

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

                <TableCell className="hidden text-ink-secondary md:table-cell">
                  {entry.stats.words} words ·{' '}
                  {entry.stats.headings === 1
                    ? '1 heading'
                    : `${entry.stats.headings} headings`}
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

                    <Button
                      variant="secondary"
                      size="xs"
                      leftSlot={<Download />}
                      disabled={!isReopenable}
                      onClick={() => onDownload(entry)}
                    >
                      Download
                    </Button>

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
