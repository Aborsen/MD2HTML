import {
  BookOpen,
  Check,
  Copy,
  Download,
  Eye,
  FileCode2,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DocStats } from '@/components/DocStats';
import { DocumentPreview, type PreviewMode } from '@/components/DocumentPreview';
import { Dropzone } from '@/components/Dropzone';
import { useTheme } from '@/lib/theme';
import type { ConvertedDoc } from '@/lib/types';
import { buildStandaloneHtml } from '@/lib/markdown';
import { formatBytes, formatDateTime, toHtmlFileName } from '@/lib/format';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger,
} from '@/ui/components/SegmentedControl';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ui/components/Tabs';
import { Typography } from '@/ui/components/Typography';
import { toast } from '@/ui/components/Toast';

interface ConverterPageProps {
  doc: ConvertedDoc | null;
  isBusy: boolean;
  onFiles: (files: File[]) => void;
  onReset: () => void;
}

export function ConverterPage({
  doc,
  isBusy,
  onFiles,
  onReset,
}: ConverterPageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('page');
  const [tab, setTab] = useState<'preview' | 'source'>('preview');
  const { theme } = useTheme();

  const standalone = useMemo(
    () =>
      doc
        ? buildStandaloneHtml({
            title: doc.name,
            body: doc.html,
            createdAt: doc.createdAt,
            theme,
          })
        : '',
    [doc, theme]
  );

  if (!doc) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Typography variant="h4" weight="semibold" textColor="primary">
            Markdown to HTML
          </Typography>
          <Typography variant="p" textColor="secondary">
            Upload a Markdown file — see the rendered HTML instantly and
            download it as a ready-to-use document.
          </Typography>
        </div>

        <Dropzone isBusy={isBusy} onFiles={onFiles} />

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Nothing leaves your machine',
              text: 'Parsing and sanitizing happen fully in the browser.',
            },
            {
              title: 'Several files, one document',
              text: 'Drop a few at once, or merge them later from the history.',
            },
            {
              title: 'Self-contained export',
              text: 'The downloaded .html carries its styles inline.',
            },
          ].map((item) => (
            <Card
              key={item.title}
              variant="outline"
              fullWidth
              rounded="lg"
              className="bg-surface-card"
            >
              <Typography variant="span" weight="semibold" textColor="primary">
                {item.title}
              </Typography>
              <Typography variant="p" textColor="secondary" className="text-xs">
                {item.text}
              </Typography>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const blob = new Blob([standalone], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = toHtmlFileName(doc.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success('HTML file downloaded', {
      description: toHtmlFileName(doc.name),
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(standalone);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('HTML copied to clipboard');
    } catch {
      toast.error('Could not access the clipboard');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card
        variant="outline"
        fullWidth
        rounded="lg"
        className="flex-row flex-wrap items-center justify-between gap-4 bg-surface-card"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-tertiary">
            <FileText className="size-5" />
          </span>

          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <Typography
                variant="span"
                weight="semibold"
                textColor="primary"
                className="truncate"
              >
                {doc.name}
              </Typography>
              <Badge variant="success" size="sm" rounded="full">
                converted
              </Badge>

              {doc.sources && (
                <Badge variant="secondary" size="sm" rounded="full">
                  {doc.sources.length} files merged
                </Badge>
              )}
            </div>
            <Typography variant="span" textColor="secondary" className="text-xs">
              {formatBytes(doc.size)} · {formatDateTime(doc.createdAt)}
            </Typography>
            <div className="mt-1">
              <DocStats stats={doc.stats} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="tertiary"
            size="sm"
            leftSlot={<RotateCcw />}
            onClick={onReset}
          >
            New file
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftSlot={isCopied ? <Check /> : <Copy />}
            onClick={handleCopy}
          >
            {isCopied ? 'Copied' : 'Copy HTML'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftSlot={<Download />}
            onClick={handleDownload}
          >
            Download .html
          </Button>
        </div>
      </Card>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as 'preview' | 'source')}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <TabsList>
            <TabsTrigger value="preview">
              <Eye className="size-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="source">
              <FileCode2 className="size-4" />
              HTML source
            </TabsTrigger>
          </TabsList>

          {tab === 'preview' && (
            <SegmentedControl
              size="sm"
              value={previewMode}
              onValueChange={(value) => setPreviewMode(value as PreviewMode)}
            >
              <SegmentedControlList>
                <SegmentedControlTrigger value="page">
                  <FileText />
                  Page
                </SegmentedControlTrigger>
                <SegmentedControlTrigger value="spread">
                  <BookOpen />
                  Spread
                </SegmentedControlTrigger>
              </SegmentedControlList>
            </SegmentedControl>
          )}
        </div>

        <TabsContent value="preview" className="outline-none">
          <div className="rounded-xl border border-stroke bg-surface-page p-3 sm:p-6">
            <DocumentPreview
              html={doc.html}
              mode={previewMode}
              className={
                previewMode === 'spread'
                  ? 'mx-auto max-w-5xl rounded-lg border border-stroke px-6 py-8 shadow-rest sm:px-10'
                  : 'mx-auto max-w-3xl rounded-lg border border-stroke p-6 shadow-rest sm:p-10'
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="source" className="outline-none">
          <pre className="max-h-[70vh] overflow-auto rounded-xl border border-stroke bg-surface-page p-4 font-mono text-ink-body text-xs leading-relaxed">
            <code>{standalone}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
