import {
  Cloud,
  Combine,
  Download,
  FileText,
  MonitorSmartphone,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Hint } from '@/components/Hint';
import { FilterChips } from '@/components/FilterChips';
import { ListSelectionBar } from '@/components/ListSelectionBar';
import { ACCEPTED_EXTENSIONS } from '@/components/Dropzone';
import {
  type DocFormat,
  formatBytes,
  formatDateTime,
  formatRelative,
  toFileName,
} from '@/lib/format';
import type { HistoryEntry } from '@/lib/history';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Checkbox } from '@/ui/components/Checkbox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ui/components/InputGroup';
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
import { cn } from '@/ui/lib/utils';

interface HistoryPageProps {
  entries: HistoryEntry[];
  /** True when the list comes from the signed-in account rather than this browser. */
  isSynced: boolean;
  onOpen: (entry: HistoryEntry) => void;
  /** Same handler the dropzone uses, so a new document can start from this page. */
  onFiles: (files: File[]) => void;
  onDownload: (entry: HistoryEntry, format: DocFormat) => void;
  onDownloadMany: (entries: HistoryEntry[], format: DocFormat) => void;
  onMerge: (entries: HistoryEntry[]) => void;
  onRemove: (id: string) => void;
  onRemoveMany: (ids: string[]) => void;
  onClear: () => void;
  onGoToConverter: () => void;
}

type SortKey = 'name' | 'size' | 'words' | 'createdAt';

export function HistoryPage({
  entries,
  isSynced,
  onOpen,
  onFiles,
  onDownload,
  onDownloadMany,
  onMerge,
  onRemove,
  onRemoveMany,
  onClear,
  onGoToConverter,
}: HistoryPageProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState<DocFormat>('html');
  const filePicker = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc',
  });

  // A row that has gone — deleted here or on another device — must not stay selected.
  useEffect(() => {
    setSelected((current) =>
      current.filter((id) => entries.some((entry) => entry.id === id))
    );
  }, [entries]);

  const found = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return needle
      ? entries.filter((entry) => entry.name.toLowerCase().includes(needle))
      : entries;
  }, [entries, query]);

  // Only rows whose source is still available — and are on screen — can be picked.
  const selectableIds = useMemo(
    () =>
      found
        .filter((entry) => entry.markdown !== undefined || entry.remote)
        .map((entry) => entry.id),
    [found]
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

  const rows = useMemo(() => {
    const value = (entry: HistoryEntry) => {
      switch (sort.key) {
        case 'name':
          return entry.name.toLowerCase();
        case 'size':
          return entry.size;
        case 'words':
          return entry.stats.words;
        default:
          return entry.createdAt;
      }
    };

    return [...found].sort((a, b) => {
      const left = value(a);
      const right = value(b);
      const order =
        typeof left === 'string' && typeof right === 'string'
          ? left.localeCompare(right)
          : Number(left) - Number(right);

      return sort.direction === 'asc' ? order : -order;
    });
  }, [found, sort]);

  /** Clicking a header sorts by it; clicking the active one flips the direction. */
  const sortBy = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'name' ? 'asc' : 'desc' }
    );

  const directionOf = (key: SortKey) =>
    sort.key === key ? sort.direction : undefined;

  // A click on a control inside the row must not also open the document.
  const stopRowClick = (event: { stopPropagation: () => void }) =>
    event.stopPropagation();

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

      <button
        type="button"
        onClick={() => filePicker.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);

          const files = Array.from(event.dataTransfer.files ?? []);

          if (files.length > 0) {
            onFiles(files);
          }
        }}
        className={cn(
          'flex w-full cursor-pointer flex-col items-center gap-1 rounded-xl border border-dropzone-border border-dashed px-6 py-6 text-center',
          'bg-surface-card transition-colors duration-base',
          'hover:border-dropzone-border-active',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2',
          isDragging && 'border-dropzone-border-active bg-dropzone-bg-active'
        )}
      >
        <span className="flex items-center gap-2 font-semibold text-ink-primary text-sm">
          <Upload className="size-4 text-brand-tertiary" />
          Drag &amp; drop Markdown here
        </span>
        <Typography variant="span" textColor="secondary" className="text-xs">
          or click to browse — several files are chained into one document
        </Typography>
      </button>

      <input
        ref={filePicker}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);

          if (files.length > 0) {
            onFiles(files);
          }

          event.target.value = '';
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <InputGroup size="sm">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            placeholder="Search by name"
            aria-label="Search history by file name"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <InputGroupAddon align="inline-end">
              <IconButton
                variant="tertiary"
                size="xs"
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                <X />
              </IconButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      <FilterChips
        value={format}
        items={[
          { value: 'html', label: 'HTML' },
          { value: 'md', label: 'Markdown' },
        ]}
        onValueChange={(value) => setFormat(value as DocFormat)}
      />

      <ListSelectionBar
        sticky
        title={
          query
            ? `${found.length} of ${entries.length} ${entries.length === 1 ? 'file' : 'files'}`
            : `${entries.length} ${entries.length === 1 ? 'file' : 'files'}`
        }
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
                onClick={() => onDownloadMany(selectedEntries, format)}
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

      <Table className="table-fixed" wrapperClassName="shadow-rest">
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
            <TableHead
              sortable
              sortDirection={directionOf('name')}
              onSort={() => sortBy('name')}
            >
              File
            </TableHead>
            <TableHead className="hidden w-20 sm:table-cell">Type</TableHead>
            <TableHead
              className="hidden w-32 sm:table-cell"
              sortable
              sortDirection={directionOf('size')}
              onSort={() => sortBy('size')}
            >
              Source size
            </TableHead>
            <TableHead
              className="hidden w-52 md:table-cell"
              sortable
              sortDirection={directionOf('words')}
              onSort={() => sortBy('words')}
            >
              Content
            </TableHead>
            <TableHead
              className="w-36"
              sortable
              sortDirection={directionOf('createdAt')}
              onSort={() => sortBy('createdAt')}
            >
              Converted
            </TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((entry) => {
            const isReopenable =
              entry.markdown !== undefined || entry.remote === true;
            const isSelected = selected.includes(entry.id);

            return (
              <TableRow
                key={entry.id}
                // The whole row opens the document; the controls in it do their own thing.
                data-interactive={isReopenable ? '' : undefined}
                role={isReopenable ? 'button' : undefined}
                tabIndex={isReopenable ? 0 : undefined}
                aria-label={isReopenable ? `Open ${entry.name}` : undefined}
                className={cn(
                  isSelected && 'is-selected',
                  isReopenable &&
                    'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-inset'
                )}
                onClick={() => isReopenable && onOpen(entry)}
                onKeyDown={(event) => {
                  if (isReopenable && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onOpen(entry);
                  }
                }}
              >
                <TableCell onClick={stopRowClick} onKeyDown={stopRowClick}>
                  <Checkbox
                    aria-label={`Select ${entry.name}`}
                    checked={isSelected}
                    disabled={!isReopenable}
                    onCheckedChange={() => toggle(entry.id)}
                  />
                </TableCell>

                <TableCell className="max-w-0">
                  <Hint
                    content={
                      isReopenable
                        ? 'Open preview'
                        : 'Source was too large to keep locally'
                    }
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="size-4 shrink-0 text-brand-tertiary" />
                      <span className="truncate font-medium text-ink-primary">
                        {toFileName(entry.name, format)}
                      </span>
                    </span>
                  </Hint>
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant={format === 'html' ? 'primary' : 'secondary'}
                    size="sm"
                    rounded="full"
                    className="w-14 justify-center"
                  >
                    {format === 'html' ? 'HTML' : 'MD'}
                  </Badge>
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

                <TableCell
                  className="text-right"
                  onClick={stopRowClick}
                  onKeyDown={stopRowClick}
                >
                  <span className="flex items-center justify-end gap-1">
                    <Hint content={format === 'html' ? 'Download .html' : 'Download .md'}>
                      <span>
                        <IconButton
                          variant="tertiary"
                          size="sm"
                          aria-label={`Download ${toFileName(entry.name, format)}`}
                          disabled={!isReopenable}
                          onClick={() => onDownload(entry, format)}
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
