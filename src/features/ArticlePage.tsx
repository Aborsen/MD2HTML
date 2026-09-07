import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { DocumentPreview } from '@/components/DocumentPreview';
import { ScrollToTop } from '@/components/ScrollToTop';
import {
  ARTICLES,
  articlePath,
  findArticle,
  formatArticleDate,
} from '@/lib/blog';
import { markdownToHtml } from '@/lib/markdown';
import type { AppView } from '@/lib/route';
import { ArticleCard } from '@/ui/components/ArticleCard';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { Typography } from '@/ui/components/Typography';

interface ArticlePageProps {
  slug: string;
  onBack: () => void;
  onOpenArticle: (slug: string) => void;
  /** For the links inside the article that point at the rest of the app. */
  onGoTo: (view: AppView) => void;
  onGoToConverter: () => void;
}

/** What index.html ships with; the tab goes back to it when an article closes. */
const DEFAULT_TITLE = 'M2H — Markdown to HTML';

/** The app's own addresses, as an article would write them. */
const VIEW_FOR_PATH: Record<string, AppView> = {
  '/': 'converter',
  '/history': 'history',
  '/docs': 'docs',
  '/blog': 'blog',
};

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
  onGoTo,
  onGoToConverter,
}: ArticlePageProps) {
  const article = findArticle(slug);
  const body = useRef<HTMLDivElement>(null);
  const html = useMemo(
    () => (article ? markdownToHtml(article.markdown) : ''),
    [article]
  );

  /*
   * An article is a page, not a state change: give it the title, and put the app's own back on the
   * way out. Not the title that was there before — on an article opened from a link, that is this
   * article's own prerendered title, which would then follow the reader to wherever they went next.
   */
  useEffect(() => {
    if (!article) {
      return;
    }

    document.title = `${article.title} — M2H`;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [article]);

  /*
   * Links inside the article body are plain anchors, and an anchor to /docs would reload the whole
   * application — losing whatever document the reader had open in the converter. Catch them here.
   *
   * On the article body rather than on the document: the cards further down this page already have
   * their own handler, and a listener on `document` would answer the same click a second time and
   * push two history entries for it.
   */
  useEffect(() => {
    const root = body.current;

    if (!root) {
      return;
    }

    const handle = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const href = (event.target as HTMLElement | null)
        ?.closest?.('a')
        ?.getAttribute('href');

      if (!href?.startsWith('/')) {
        return;
      }

      const path = href.replace(/\/$/, '') || '/';

      if (path.startsWith('/blog/')) {
        const target = path.slice('/blog/'.length);

        if (findArticle(target)) {
          event.preventDefault();
          onOpenArticle(target);
        }

        return;
      }

      const view = VIEW_FOR_PATH[path];

      if (view) {
        event.preventDefault();
        onGoTo(view);
      }
    };

    root.addEventListener('click', handle);

    return () => root.removeEventListener('click', handle);
  }, [onOpenArticle, onGoTo]);

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

      <div ref={body}>
        <DocumentPreview html={html} />
      </div>

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
