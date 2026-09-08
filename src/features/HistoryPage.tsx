import {
  Cloud,
  Combine,
  Download,
  FileText,
  MonitorSmartphone,
  Search,
  Share2,
  Users,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Hint } from '@/components/Hint';
import { FilterChips } from '@/components/FilterChips';
import { ListSelectionBar } from '@/components/ListSelectionBar';
import { ShareDialog } from '@/components/ShareDialog';
import {
  ALL_EXTENSIONS,
  CONVERSIONS,
  conversion,
  type ConversionId,
} from '@shared/conversions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/DropdownMenu';
import {
  type DocFormat,
  FORMAT_LABELS,
  formatBytes,
  formatDateTime,
  formatRelative,
  toFileName,
} from '@/lib/format';
import { api, type Usage } from '@/lib/api';
import { readRoute, replaceFilter } from '@/lib/route';
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

/** The order they are offered in: the document, the page it makes, then the words alone. */
const FORMATS: DocFormat[] = ['md', 'html', 'txt'];

interface RowPartProps {
  entry: HistoryEntry;
  isShared: boolean;
}

/** What made this document. The name cannot say whether it came from a page, a Word file or a CSV. */
function KindBadge({ entry, isShared, className }: RowPartProps & { className?: string }) {
  if (isShared) {
    return (
      <span className="truncate text-ink-secondary">
        {entry.sharedBy || 'someone'}
      </span>
    );
  }

  return (
    <Badge
      variant={entry.kind === 'markdown-to-html' ? 'primary' : 'secondary'}
      size="sm"
      rounded="full"
      className={cn('justify-center', className)}
    >
      {conversion(entry.kind).short}
    </Badge>
  );
}

/**
 * Share, download in any format, remove.
 *
 * One component because the same three appear in a table row on a wide screen and in a card on a
 * phone, and three buttons that behave differently depending on which layout you happen to be
 * looking at is a bug waiting for somebody to change one of the two.
 */
function RowActions({
  entry,
  isShared,
  isReopenable,
  onShare,
  onDownload,
  onRemove,
}: RowPartProps & {
  isReopenable: boolean;
  onShare: (entry: HistoryEntry) => void;
  onDownload: (entry: HistoryEntry, format: DocFormat) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <span className="flex items-center justify-end gap-1">
      {entry.remote && !isShared && (
        <Hint content="Share">
          <IconButton
            variant="tertiary"
            size="sm"
            aria-label={`Share ${entry.name}`}
            onClick={() => onShare(entry)}
          >
            <Share2 />
          </IconButton>
        </Hint>
      )}

      {/*
        * A menu rather than one button: the chips used to decide what a download handed over, and
        * now that they say what a document came from, the row has to offer the choice itself.
        */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={!isReopenable}>
          <IconButton
            variant="tertiary"
            size="sm"
            aria-label={`Download ${entry.name}`}
            disabled={!isReopenable}
          >
            <Download />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {FORMATS.map((one) => (
            <DropdownMenuItem key={one} onSelect={() => onDownload(entry, one)}>
              {toFileName(entry.name, one)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {!isShared && (
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
      )}
    </span>
  );
}

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
  /**
   * One row of chips: everything, one conversion, or somebody else's files.
   *
   * Everything is the default, because a list that opens filtered is a list somebody has to notice
   * is filtered — and the reason to come here is usually "where is that file", not "show me the
   * ones that came from Word". It lives in the address too, so a refresh keeps the same view.
   */
  const [chip, setChip] = useState<'all' | ConversionId | 'shared'>(() => {
    const filter = readRoute().filter ?? '';

    if (filter === 'shared') {
      return 'shared';
    }

    return CONVERSIONS.some((one) => one.id === filter)
      ? (filter as ConversionId)
      : 'all';
  });
  const [shared, setShared] = useState<HistoryEntry[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isLoadingShared, setIsLoadingShared] = useState(false);

  const isShared = chip === 'shared';
  const filePicker = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sharing, setSharing] = useState<HistoryEntry | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc',
  });

  const loadShared = useCallback(() => {
    setIsLoadingShared(true);

    api
      .listSharedWithMe()
      .then(setShared)
      .catch(() => setShared([]))
      .finally(() => setIsLoadingShared(false));
  }, []);

  /*
   * Loaded up front, not only when the chip is picked: an account whose own history is empty must
   * still be told that something was shared with it, and the empty state is decided before any
   * chip is touched.
   */
  useEffect(() => {
    if (isSynced) {
      loadShared();
    } else {
      setShared([]);
    }
  }, [isSynced, loadShared]);

  // What is left of the account's allowance — the number people want before they hit the wall.
  useEffect(() => {
    if (!isSynced) {
      setUsage(null);
      return;
    }

    api
      .usage()
      .then(setUsage)
      .catch(() => setUsage(null));
  }, [isSynced, entries.length]);

  // A row that has gone — deleted here or on another device — must not stay selected.
  useEffect(() => {
    setSelected((current) =>
      current.filter((id) => entries.some((entry) => entry.id === id))
    );
  }, [entries]);

  /*
   * Chips for the conversions that actually produced something, and only when there is more than
   * one of them: an account with nothing but Markdown does not need to be offered a filter that
   * selects all of it.
   */
  const kinds = useMemo(() => {
    const counted = new Map<string, number>();

    for (const entry of entries) {
      counted.set(entry.kind, (counted.get(entry.kind) ?? 0) + 1);
    }

    return CONVERSIONS.filter((one) => counted.has(one.id)).map((one) => ({
      value: one.id,
      label: one.label,
      count: counted.get(one.id) ?? 0,
    }));
  }, [entries]);

  const source = isShared
    ? shared
    : chip === 'all'
      ? entries
      : entries.filter((entry) => entry.kind === chip);

  const found = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return needle
      ? source.filter((entry) => entry.name.toLowerCase().includes(needle))
      : source;
  }, [source, query]);

  /*
   * Only rows whose source is still available — and are on screen — can be picked. Somebody
   * else's documents are not selectable at all: merge, delete and clear are owner's verbs.
   */
  const selectableIds = useMemo(
    () =>
      isShared
        ? []
        : found
            .filter((entry) => entry.markdown !== undefined || entry.remote)
            .map((entry) => entry.id),
    [found, isShared]
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

  if (entries.length === 0 && shared.length === 0) {
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
          {usage && (
            <span className="text-ink-inactive">
              · {formatBytes(usage.bytes)} of {formatBytes(usage.limits.bytes)} ·{' '}
              {usage.documents} of {usage.limits.documents} documents
            </span>
          )}
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
        {/*
          * This one takes everything, and the conversion is chosen from the extension — so the
          * label had better not promise Markdown.
          */}
        <span className="flex items-center gap-2 font-semibold text-ink-primary text-sm">
          <Upload className="size-4 text-brand-tertiary" />
          Drop files
        </span>
        <Typography variant="span" textColor="secondary" className="text-xs">
          or click to browse — several files are chained into one document
        </Typography>
      </button>

      <input
        ref={filePicker}
        type="file"
        accept={ALL_EXTENSIONS.join(',')}
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
        value={chip}
        items={[
          { value: 'all', label: 'All formats', count: entries.length },
          ...(kinds.length > 1 ? kinds : []),
          // Nobody can share with a browser: the chip belongs to an account.
          ...(isSynced
            ? [
                {
                  value: 'shared',
                  label: 'Shared with me',
                  count: shared.length,
                },
              ]
            : []),
        ]}
        onValueChange={(value) => {
          setSelected([]);
          setChip(value as 'all' | ConversionId | 'shared');
          replaceFilter(value);
        }}
      />

      {isShared ? (
        <Typography
          variant="p"
          textColor="secondary"
          className="flex min-h-[37px] items-center gap-1.5 text-sm"
        >
          <Users className="size-4" />
          {isLoadingShared
            ? 'Loading…'
            : `${found.length} ${found.length === 1 ? 'document' : 'documents'} shared with you`}
        </Typography>
      ) : (
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="primaryTertiary"
                    size="xs"
                    className="!px-1.5 !py-1"
                    leftSlot={<Download />}
                  >
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {FORMATS.map((one) => (
                    <DropdownMenuItem
                      key={one}
                      onSelect={() => onDownloadMany(selectedEntries, one)}
                    >
                      {FORMAT_LABELS[one]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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
      )}

      {/*
        * On a phone, cards.
        *
        * The table used to stay a table and lose columns, and the column it gave up first was the
        * name — a list of documents showing only "just now", which is the one thing nobody came
        * here to read. A card has room for the name on its own line and everything else under it.
        */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {rows.map((entry) => {
          const isReopenable =
            entry.markdown !== undefined || entry.remote === true;
          const isSelected = selected.includes(entry.id);

          return (
            <li
              key={entry.id}
              className={cn(
                'flex flex-col gap-3 rounded-xl border border-stroke bg-surface-card p-3',
                isSelected && 'border-brand-tertiary'
              )}
            >
              <div className="flex items-start gap-3">
                {!isShared && (
                  <span
                    className="pt-0.5"
                    onClick={stopRowClick}
                    onKeyDown={stopRowClick}
                  >
                    <Checkbox
                      aria-label={`Select ${entry.name}`}
                      checked={isSelected}
                      disabled={!isReopenable}
                      onCheckedChange={() => toggle(entry.id)}
                    />
                  </span>
                )}

                <button
                  type="button"
                  disabled={!isReopenable}
                  onClick={() => isReopenable && onOpen(entry)}
                  className={cn(
                    'flex min-w-0 flex-1 flex-col items-start gap-1 text-left',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2',
                    isReopenable ? 'cursor-pointer' : 'cursor-default'
                  )}
                >
                  <span className="flex w-full min-w-0 items-center gap-2">
                    <FileText className="size-4 shrink-0 text-brand-tertiary" />
                    <span className="truncate font-medium text-ink-primary text-sm">
                      {entry.name}
                    </span>
                  </span>

                  <span className="flex flex-wrap items-center gap-2 text-ink-secondary text-xs">
                    <KindBadge entry={entry} isShared={isShared} />
                    <span>{formatBytes(entry.size)}</span>
                    <span aria-hidden>·</span>
                    <span>{formatRelative(entry.createdAt)}</span>
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 border-stroke border-t pt-2">
                <Typography variant="span" textColor="light" className="text-xs">
                  {entry.stats.words} words ·{' '}
                  {entry.stats.headings === 1
                    ? '1 heading'
                    : `${entry.stats.headings} headings`}
                </Typography>

                <RowActions
                  entry={entry}
                  isShared={isShared}
                  isReopenable={isReopenable}
                  onShare={setSharing}
                  onDownload={onDownload}
                  onRemove={onRemove}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <Table
        className="table-fixed"
        wrapperClassName="hidden shadow-rest sm:block"
      >
        <TableHeader>
          <TableRow>
            {!isShared && (
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
            )}
            <TableHead
              sortable
              sortDirection={directionOf('name')}
              onSort={() => sortBy('name')}
            >
              File
            </TableHead>
            <TableHead className="hidden w-52 sm:table-cell">
              {isShared ? 'Shared by' : 'Type'}
            </TableHead>
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
            <TableHead className="w-32 text-right">Actions</TableHead>
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
                {!isShared && (
                <TableCell onClick={stopRowClick} onKeyDown={stopRowClick}>
                  <Checkbox
                    aria-label={`Select ${entry.name}`}
                    checked={isSelected}
                    disabled={!isReopenable}
                    onCheckedChange={() => toggle(entry.id)}
                  />
                </TableCell>
                )}

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
                        {entry.name}
                      </span>
                    </span>
                  </Hint>
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  <KindBadge entry={entry} isShared={isShared} className="w-24" />
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
                  <RowActions
                    entry={entry}
                    isShared={isShared}
                    isReopenable={isReopenable}
                    onShare={setSharing}
                    onDownload={onDownload}
                    onRemove={onRemove}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ShareDialog
        documentId={sharing?.id ?? null}
        name={sharing?.name ?? ''}
        open={sharing !== null}
        onOpenChange={(open) => !open && setSharing(null)}
      />
    </div>
  );
}
