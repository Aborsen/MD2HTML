import {
  Cloud,
  Combine,
  Download,
  Eye,
  FileText,
  MonitorSmartphone,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Hint } from '@/components/Hint';
import { ListSelectionBar } from '@/components/ListSelectionBar';
import { formatBytes, formatDateTime, formatRelative } from '@/lib/format';
import type { HistoryEntry } from '@/lib/history';
import { Button } from '@/ui/components/Button';
import { Checkbox } from '@/ui/components/Checkbox';
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
import { Typography } from '@/ui/components/Typography';

interface HistoryPageProps {
  entries: HistoryEntry[];
  /** True when the list comes from the signed-in account rather than this browser. */
  isSynced: boolean;
  onOpen: (entry: HistoryEntry) => void;
  onDownload: (entry: HistoryEntry) => void;
  onDownloadMany: (entries: HistoryEntry[]) => void;
  onMerge: (entries: HistoryEntry[]) => void;
  onRemove: (id: string) => void;
  onRemoveMany: (ids: string[]) => void;
  onClear: () => void;
  onGoToConverter: () => void;
}

export function HistoryPage({
  entries,
  isSynced,
  onOpen,
  onDownload,
  onDownloadMany,
  onMerge,
  onRemove,
  onRemoveMany,
  onClear,
  onGoToConverter,
}: HistoryPageProps) {
  const [selected, setSelected] = useState<string[]>([]);

  // A row that has gone — deleted here or on another device — must not stay selected.
  useEffect(() => {
    setSelected((current) =>
      current.filter((id) => entries.some((entry) => entry.id === id))
    );
  }, [entries]);

  // Only rows whose source is still available can be merged or downloaded.
  const selectableIds = useMemo(
    () =>
      entries
        .filter((entry) => entry.markdown !== undefined || entry.remote)
        .map((entry) => entry.id),
    [entries]
  );

  const selectedEntries = useMemo(
    // Oldest first, so a merge reads as a chain in the order the files were made.
    () =>
      entries
        .filter((entry) => selected.includes(entry.id))
        .sort((a, b) => a.createdAt - b.createdAt),
    [entries, selected]
  );

  const allSelected =
    selectableIds.length > 0 && selected.length === selectableIds.length;

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );

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
          {isSynced
            ? 'Saved to your account'
            : 'Kept in this browser — sign in to reach them anywhere'}
        </Typography>
      </div>

      <ListSelectionBar
        sticky
        title={`${entries.length} ${entries.length === 1 ? 'file' : 'files'}`}
        selectedCount={selected.length}
        allSelected={allSelected}
        isEmpty={selectableIds.length === 0}
        onSelectAll={() => setSelected(selectableIds)}
        onClearSelection={() => setSelected([])}
        rightSlot={
          selected.length > 0 ? (
            <div className="flex items-center gap-2">
              <Hint
                content={
                  selected.length < 2
                    ? 'Pick at least two files to chain'
                    : 'Chain the selected files into one document, oldest first'
                }
              >
                <span>
                  <Button
                    variant="primaryTertiary"
                    size="xs"
                    className="!px-1.5 !py-1"
                    leftSlot={<Combine />}
                    disabled={selected.length < 2}
                    onClick={() => onMerge(selectedEntries)}
                  >
                    Merge
                  </Button>
                </span>
              </Hint>

              <Button
                variant="primaryTertiary"
                size="xs"
                className="!px-1.5 !py-1"
                leftSlot={<Download />}
                onClick={() => onDownloadMany(selectedEntries)}
              >
                Download
              </Button>

              <Button
                variant="destructiveTertiary"
                size="xs"
                className="!px-1.5 !py-1"
                leftSlot={<Trash2 />}
                onClick={() => onRemoveMany(selected)}
              >
                Delete
              </Button>
            </div>
          ) : (
            <Button
              variant="destructiveTertiary"
              size="xs"
              className="!px-1.5 !py-1"
              leftSlot={<Trash2 />}
              onClick={onClear}
            >
              Clear history
            </Button>
          )
        }
      />

      <Table wrapperClassName="shadow-rest">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label={allSelected ? 'Deselect all' : 'Select all'}
                checked={
                  allSelected
                    ? true
                    : selected.length > 0
                      ? 'indeterminate'
                      : false
                }
                disabled={selectableIds.length === 0}
                onCheckedChange={() =>
                  setSelected(selected.length > 0 ? [] : selectableIds)
                }
              />
            </TableHead>
            <TableHead>File</TableHead>
            <TableHead className="hidden sm:table-cell">Size</TableHead>
            <TableHead className="hidden md:table-cell">Content</TableHead>
            <TableHead>Converted</TableHead>
            <TableHead className="w-44 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry) => {
            const isReopenable =
              entry.markdown !== undefined || entry.remote === true;
            const isSelected = selected.includes(entry.id);

            return (
              <TableRow
                key={entry.id}
                className={isSelected ? 'is-selected' : undefined}
              >
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${entry.name}`}
                    checked={isSelected}
                    disabled={!isReopenable}
                    onCheckedChange={() => toggle(entry.id)}
                  />
                </TableCell>

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
