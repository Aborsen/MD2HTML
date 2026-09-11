import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Eye,
  FileCode2,
  FileText,
  Maximize2,
  Minimize2,
  Printer,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DocStats } from '@/components/DocStats';
import { DocumentPreview } from '@/components/DocumentPreview';
import { Hint } from '@/components/Hint';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ShareDialog } from '@/components/ShareDialog';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { ConversionPicker } from '@/components/ConversionPicker';
import { crumbsForConversion } from '@/lib/breadcrumbs';
import { articleCardImage } from '@/lib/covers';
import { Dropzone } from '@/components/Dropzone';
import { PasteBox } from '@/components/PasteBox';
import {
  type Conversion,
  type ConversionId,
  DEFAULT_CONVERSION,
} from '@shared/conversions';
import { articlePath, articlesFor, formatArticleDate } from '@/lib/blog';
import { FAQ_FLAGS } from '@/lib/faq';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { ArticleCard } from '@/ui/components/ArticleCard';
import { CodeBlock } from '@/ui/components/Code';
import { Faq } from '@/ui/components/Faq';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { useTheme } from '@/lib/theme';
import type { ConvertedDoc } from '@/lib/types';
import { buildStandaloneHtml } from '@/lib/markdown';
import { downloadDoc, printDoc } from '@/lib/download';
import {
  type DocFormat,
  FORMAT_LABELS,
  formatBytes,
  formatDateTime,
  toFileName,
} from '@/lib/format';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ui/components/Tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/DropdownMenu';
import { IconButton } from '@/ui/components/IconButton';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';
import { toast } from '@/ui/components/Toast';

interface ConverterPageProps {
  /** Which conversion this screen is: what it accepts and where it lives. Its words come from the catalogue. */
  conversion: Conversion;
  doc: ConvertedDoc | null;
  isBusy: boolean;
  onConversionChange: (id: ConversionId) => void;
  onFiles: (files: File[]) => void;
  onReset: () => void;
  onGoToBlog: () => void;
  onGoToLivePreview: (markdown: string) => void;
  onOpenArticle: (slug: string) => void;
}

export function ConverterPage({
  conversion,
  doc,
  isBusy,
  onConversionChange,
  onFiles,
  onReset,
  onGoToBlog,
  onGoToLivePreview,
  onOpenArticle,
}: ConverterPageProps) {
  const t = useT();
  const { content, locale } = useI18n();
  /** What this conversion is called and says, in the reader's language. */
  const words = content.conversions[conversion.id];
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
      toast.error(t('converter.fullscreen.error'));
    });
  };
  const { theme } = useTheme();

  /*
   * What the person came here for decides the whole of this screen's right-hand side.
   *
   * Somebody who converted a Word file wants the Markdown: handing them "Download .html" as the
   * one obvious button makes them go looking for the thing they actually asked for. So the primary
   * format follows the conversion, and the rest stay one click away.
   */
  const primary: DocFormat = conversion.to === 'html' ? 'html' : 'md';
  const secondary: DocFormat[] = (['md', 'html', 'txt'] as DocFormat[]).filter(
    (one) => one !== primary
  );

  /*
   * The front page's shorter list of questions: the doubts, without the details.
   *
   * Zipped here rather than imported ready-made, because the words belong to the locale on screen
   * and the flags do not — `FAQ_FLAGS[n]` is about `content.faq[n]`, position being the only id a
   * question has. See `src/lib/faq.ts`.
   */
  const questions = useMemo(
    () =>
      content.faq
        .map((one, index) => ({ ...one, ...FAQ_FLAGS[index] }))
        .filter((one) => !one.detail),
    [content.faq]
  );

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
        {/* On the front page the trail is there but unlinked — see `crumbsForConversion`. */}
        <AppBreadcrumbs
          items={crumbsForConversion(conversion, content, locale)}
          onNavigate={() => onConversionChange(DEFAULT_CONVERSION)}
        />

        <div className="flex flex-col gap-1">
          {/* The page's own h1: the header carries a wordmark, not a heading. */}
          <Typography
            variant="h1"
            weight="semibold"
            textColor="primary"
            className="text-lg md:text-lg"
          >
            {words.title}
          </Typography>
          <Typography variant="p" textColor="secondary">
            {words.blurb}
          </Typography>
        </div>

        <Dropzone
          isBusy={isBusy}
          extensions={conversion.extensions}
          title={t('converter.dropzone.title', {
            extension: conversion.extensions[0],
          })}
          hint={words.hint}
          onFiles={onFiles}
        />

        {/*
         * Word is the exception, and the only one: a .docx is a zip, so there is nothing to paste.
         * Every other conversion takes text, and the text becomes a file with this conversion's own
         * extension so that `onFiles` does the converting, the size check and the rest exactly as
         * it does for a dropped file.
         */}
        {conversion.id !== 'word-to-markdown' && (
          <PasteBox
            isBusy={isBusy}
            extension={conversion.extensions[0]}
            /*
             * Only for Markdown: the live preview renders Markdown, so offering it beside a CSV
             * would send somebody to a page that cannot do what they came for.
             */
            onGoToLivePreview={
              conversion.id === DEFAULT_CONVERSION ? onGoToLivePreview : undefined
            }
            onText={(text) =>
              onFiles([
                new File([text], `pasted${conversion.extensions[0]}`, {
                  type: 'text/plain',
                }),
              ])
            }
          />
        )}

        <ConversionPicker
          current={conversion.id}
          onChange={onConversionChange}
        />

        {/* Below the fold: two bands, each opening with a pill, so the page stops reading as one sheet. */}
        {articlesFor(locale).length > 0 && (
          <section className="mt-6 flex flex-col items-center gap-6 border-stroke border-t pt-12">
            <SectionHeading
              align="center"
              size="lg"
              eyebrow={t('converter.blog.eyebrow')}
              title={t('converter.blog.title')}
              description={t('converter.blog.blurb')}
            />

            {/* Six: two full rows of three, so the last row is never one card on its own. */}
            <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3">
              {articlesFor(locale)
                .slice(0, 6)
                .map((article) => (
                  <ArticleCard
                    key={article.slug}
                    title={article.title}
                    description={article.description}
                    href={articlePath(article.slug, locale)}
                    image={articleCardImage(article.slug, locale)}
                    onOpen={() => onOpenArticle(article.slug)}
                    tag={article.tag}
                    meta={formatArticleDate(article.date, INTL_LOCALES[locale])}
                  />
                ))}
            </div>

            <Button variant="secondary" size="sm" onClick={onGoToBlog}>
              {t('converter.blog.all')}
            </Button>
          </section>
        )}

        <section className="mt-10 flex flex-col items-center gap-8 rounded-2xl border border-stroke bg-surface-card2/40 px-4 py-12 sm:px-10">
          <SectionHeading
            align="center"
            size="lg"
            eyebrow={t('converter.faq.eyebrow')}
            title={t('converter.faq.title')}
            description={t('converter.faq.blurb')}
          />

          <Faq items={questions} className="max-w-3xl" />
        </section>
      </div>
    );
  }

  const source = primary === 'html' ? standalone : doc.markdown;

  const handleDownload = (format: DocFormat) => {
    downloadDoc(doc.name, doc.markdown, doc.createdAt, theme, format);

    toast.success(t('converter.download.done', { format: FORMAT_LABELS[format] }), {
      description: toFileName(doc.name, format),
    });
  };

  const handlePrint = async () => {
    try {
      await printDoc(doc.name, doc.html, doc.createdAt, theme, t);
    } catch (cause) {
      toast.error(t('converter.print.error'), {
        description:
          cause instanceof Error
            ? cause.message
            : t('converter.print.error.hint'),
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success(
        t('converter.copy.done', { format: FORMAT_LABELS[primary] })
      );
    } catch {
      toast.error(t('common.clipboard.error'));
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
                {t('converter.badge.converted')}
              </Badge>

              {doc.sources && (
                <Badge variant="secondary" size="sm" rounded="full">
                  {t('converter.badge.merged', { count: doc.sources.length })}
                </Badge>
              )}
            </div>
            <Typography variant="span" textColor="secondary" className="text-xs">
              {formatBytes(doc.size, INTL_LOCALES[locale])} ·{' '}
              {formatDateTime(doc.createdAt, INTL_LOCALES[locale])}
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
            {t('converter.newfile')}
          </Button>
          <Hint
            content={
              doc.remoteId
                ? t('converter.share.hint')
                : t('converter.share.hint.signedout')
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
                {t('converter.share')}
              </Button>
            </span>
          </Hint>

          <Button
            variant="secondary"
            size="sm"
            leftSlot={isCopied ? <Check /> : <Copy />}
            onClick={handleCopy}
          >
            {isCopied
              ? t('common.copied')
              : t('converter.copy', { format: FORMAT_LABELS[primary] })}
          </Button>

          {/* A split button: the conversion's own format under the thumb, the others in the menu. */}
          <div className="flex items-center">
            <Button
              variant="primary"
              size="sm"
              leftSlot={<Download />}
              className="rounded-r-none"
              onClick={() => handleDownload(primary)}
            >
              {t('converter.download', { format: primary })}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  variant="primary"
                  size="sm"
                  aria-label={t('converter.download.more')}
                  className="ml-px rounded-l-none"
                >
                  <ChevronDown />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {secondary.map((one) => (
                  <DropdownMenuItem
                    key={one}
                    onSelect={() => handleDownload(one)}
                  >
                    <Download className="size-4" />
                    {FORMAT_LABELS[one]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onSelect={() => void handlePrint()}>
                  <Printer className="size-4" />
                  {t('converter.print')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
              {t('converter.tab.preview')}
            </TabsTrigger>
            <TabsTrigger value="source">
              <FileCode2 className="size-4" />
              {primary === 'html'
                ? t('converter.tab.html')
                : t('converter.tab.markdown')}
            </TabsTrigger>
          </TabsList>

          {tab === 'preview' && (
            <Hint
              content={
                isFullscreen
                  ? t('converter.fullscreen.exit')
                  : t('converter.fullscreen.enter')
              }
            >
              <IconButton
                variant="tertiary"
                size="sm"
                aria-label={
                  isFullscreen
                    ? t('converter.fullscreen.exit')
                    : t('converter.fullscreen.enter')
                }
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
            language={primary === 'html' ? 'html' : 'markdown'}
            className="max-h-[70vh] rounded-xl bg-surface-page"
          >
            {source}
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
