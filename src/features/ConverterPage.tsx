import {
  Check,
  Copy,
  Download,
  Eye,
  FileCode2,
  FileText,
  Maximize2,
  Minimize2,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DocStats } from '@/components/DocStats';
import { DocumentPreview } from '@/components/DocumentPreview';
import { Hint } from '@/components/Hint';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ShareDialog } from '@/components/ShareDialog';
import { Dropzone } from '@/components/Dropzone';
import { ARTICLES, articlePath, formatArticleDate } from '@/lib/blog';
import { FAQ_ENTRIES } from '@/lib/faq';
import { ArticleCard } from '@/ui/components/ArticleCard';
import { CodeBlock } from '@/ui/components/Code';
import { Faq } from '@/ui/components/Faq';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { useTheme } from '@/lib/theme';
import type { ConvertedDoc } from '@/lib/types';
import { buildStandaloneHtml } from '@/lib/markdown';
import { formatBytes, formatDateTime, toHtmlFileName } from '@/lib/format';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ui/components/Tabs';
import { IconButton } from '@/ui/components/IconButton';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';
import { toast } from '@/ui/components/Toast';

interface ConverterPageProps {
  doc: ConvertedDoc | null;
  isBusy: boolean;
  onFiles: (files: File[]) => void;
  onReset: () => void;
  onGoToBlog: () => void;
  onOpenArticle: (slug: string) => void;
}

export function ConverterPage({
  doc,
  isBusy,
  onFiles,
  onReset,
  onGoToBlog,
  onOpenArticle,
}: ConverterPageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [tab, setTab] = useState<'preview' | 'source'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const previewFrame = useRef<HTMLDivElement>(null);

  // Escape and the browser's own chrome can leave fullscreen without us, so follow the event.
  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement !== null);

    document.addEventListener('fullscreenchange', sync);

    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void previewFrame.current?.requestFullscreen().catch(() => {
      toast.error('Fullscreen is not available here');
    });
  };
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

        {/* Below the fold: what to read while deciding, and the questions people arrive with. */}
        {ARTICLES.length > 0 && (
        <section className="flex flex-col gap-4 pt-4">
          <SectionHeading
            eyebrow="From the blog"
            title="Making Markdown behave"
            description="Syntax that breaks, documents that have to reach other people, and getting the whole thing to run without you."
            action={
              <Button variant="tertiary" size="sm" onClick={onGoToBlog}>
                All articles
              </Button>
            }
          />

          <div className="grid gap-4 md:grid-cols-3">
            {ARTICLES.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                description={article.description}
                href={articlePath(article.slug)}
                onOpen={() => onOpenArticle(article.slug)}
                tag={article.tag}
                meta={formatArticleDate(article.date)}
              />
            ))}
          </div>
        </section>
        )}

        <section className="flex flex-col gap-4 pt-2 pb-4">
          <SectionHeading
            eyebrow="FAQ"
            title="Before you drop a file"
          />
          <Faq items={FAQ_ENTRIES} />
        </section>
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
          <Hint
            content={
              doc.remoteId
                ? 'Share a link to this document'
                : 'Sign in to share — sharing needs the document in your account'
            }
          >
            <span>
              <Button
                variant="secondary"
                size="sm"
                leftSlot={<Share2 />}
                disabled={!doc.remoteId}
                onClick={() => setIsShareOpen(true)}
              >
                Share
              </Button>
            </span>
          </Hint>

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
            <Hint content={isFullscreen ? 'Exit fullscreen' : 'Read fullscreen'}>
              <IconButton
                variant="tertiary"
                size="sm"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Read fullscreen'}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
              </IconButton>
            </Hint>
          )}
        </div>

        <TabsContent value="preview" className="outline-none">
          <div
            ref={previewFrame}
            className="md-preview-frame rounded-xl border border-stroke bg-surface-page p-3 sm:p-6"
          >
            <DocumentPreview
              html={doc.html}
              className="mx-auto max-w-3xl rounded-lg border border-stroke p-6 shadow-rest sm:p-10"
            />

            <ScrollToTop />
          </div>
        </TabsContent>

        <TabsContent value="source" className="outline-none">
          <CodeBlock
            language="html"
            className="max-h-[70vh] rounded-xl bg-surface-page"
          >
            {standalone}
          </CodeBlock>
        </TabsContent>
      </Tabs>

      <ShareDialog
        documentId={doc.remoteId ?? null}
        name={doc.name}
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
    </div>
  );
}
