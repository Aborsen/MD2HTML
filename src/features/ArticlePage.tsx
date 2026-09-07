import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { DocumentPreview } from '@/components/DocumentPreview';
import { ScrollToTop } from '@/components/ScrollToTop';
import {
  ARTICLES,
  articlePath,
  findArticle,
  formatArticleDate,
} from '@/lib/blog';
import { markdownToHtml } from '@/lib/markdown';
import { ArticleCard } from '@/ui/components/ArticleCard';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { Typography } from '@/ui/components/Typography';

interface ArticlePageProps {
  slug: string;
  onBack: () => void;
  onOpenArticle: (slug: string) => void;
  onGoToConverter: () => void;
}

/**
 * One article, rendered by the converter this site is about.
 *
 * The same `markdownToHtml` the app runs on an uploaded file, and the same stylesheet the exported
 * document carries. It is the shortest possible answer to "does it handle a real document" — this
 * page is one.
 */
export function ArticlePage({
  slug,
  onBack,
  onOpenArticle,
  onGoToConverter,
}: ArticlePageProps) {
  const article = findArticle(slug);
  const html = useMemo(
    () => (article ? markdownToHtml(article.markdown) : ''),
    [article]
  );

  // An article is a page, not a state change: give it the title, and put it back on the way out.
  useEffect(() => {
    if (!article) {
      return;
    }

    const previous = document.title;

    document.title = `${article.title} — M2H`;

    return () => {
      document.title = previous;
    };
  }, [article]);

  // Links inside the article body are plain anchors; keep in-app ones in the app.
  useEffect(() => {
    const handle = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.('a');
      const href = link?.getAttribute('href');

      if (
        !href?.startsWith('/blog/') ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = href.replace('/blog/', '').replace(/\/$/, '');

      if (findArticle(target)) {
        event.preventDefault();
        onOpenArticle(target);
      }
    };

    document.addEventListener('click', handle);

    return () => document.removeEventListener('click', handle);
  }, [onOpenArticle]);

  if (!article) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 py-12">
        <Typography variant="h2" className="text-xl md:text-xl">
          No such article
        </Typography>
        <Typography variant="p" textColor="secondary" className="text-sm">
          It may have been renamed. The index has everything that exists.
        </Typography>
        <Button variant="secondary" onClick={onBack}>
          Back to the blog
        </Button>
      </div>
    );
  }

  const more = ARTICLES.filter((other) => other.slug !== article.slug).slice(0, 2);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit cursor-pointer items-center gap-1.5 rounded-md text-ink-secondary text-sm transition-colors hover:text-ink-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4" />
        All articles
      </button>

      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" size="sm">
            {article.tag}
          </Badge>
          <Typography variant="span" textColor="light" className="text-xs">
            {formatArticleDate(article.date)} · {article.readingMinutes} min read
          </Typography>
        </div>

        <Typography variant="h1" className="text-2xl md:text-3xl">
          {article.title}
        </Typography>

        <Typography variant="p" textColor="secondary">
          {article.description}
        </Typography>
      </header>

      <DocumentPreview html={html} />

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-stroke bg-surface-card p-4">
        <Typography variant="span" textColor="secondary" className="text-sm">
          This page was written in Markdown and rendered by the converter it
          describes.
        </Typography>
        <Button size="sm" className="ml-auto" onClick={onGoToConverter}>
          Convert a file
        </Button>
      </div>

      {more.length > 0 && (
        <div className="flex flex-col gap-4 pt-2">
          <SectionHeading eyebrow="Next" title="Keep reading" />
          <div className="grid gap-4 md:grid-cols-2">
            {more.map((other) => (
              <ArticleCard
                key={other.slug}
                title={other.title}
                description={other.description}
                href={articlePath(other.slug)}
                onOpen={() => onOpenArticle(other.slug)}
                tag={other.tag}
                meta={`${other.readingMinutes} min read`}
              />
            ))}
          </div>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}
