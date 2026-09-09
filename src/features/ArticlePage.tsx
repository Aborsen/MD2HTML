import { useEffect, useMemo, useRef, useState } from 'react';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { DocumentPreview } from '@/components/DocumentPreview';
import { crumbsForArticle } from '@/lib/breadcrumbs';
import { articleCardImage } from '@/lib/covers';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { headingsFromHtml } from '@/lib/toc';
import { useActiveHeading } from '@/lib/use-active-heading';
import { TableOfContents } from '@/ui/components/TableOfContents';
import { ScrollToTop } from '@/components/ScrollToTop';
import {
  ARTICLES,
  articleBody,
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
import { ShareLinks } from '@/ui/components/ShareLinks';
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
const DEFAULT_TITLE = 'TransformPipe — Markdown to HTML';

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
  const t = useT();
  const { content, locale } = useI18n();
  /* The tag `Intl` wants, which is not the tag in the address — see `INTL_LOCALES`. */
  const dates = INTL_LOCALES[locale];
  const article = findArticle(slug);
  const body = useRef<HTMLDivElement>(null);

  /*
   * The prose is fetched rather than bundled.
   *
   * `articleBody` is a dynamic import, so an article's text is its own chunk and the front page
   * does not carry fifty of them. That makes the render two-pass: the title, the date and the
   * contents list are here immediately, the body arrives a moment later.
   *
   * The guard is the slug the text was asked for. Opening one article from inside another starts a
   * second fetch, and without it a slow first response could land after the second and paint the
   * wrong article's body under the right article's headline.
   */
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    let wanted = true;

    setMarkdown(null);
    void articleBody(slug).then((text) => {
      if (wanted) {
        setMarkdown(text ?? '');
      }
    });

    return () => {
      wanted = false;
    };
  }, [slug]);

  const html = useMemo(
    () => (markdown ? markdownToHtml(markdown) : ''),
    [markdown]
  );

  /* The contents come out of the rendered HTML, so the ids are the renderer's own. */
  const headings = useMemo(() => headingsFromHtml(html), [html]);
  const activeHeading = useActiveHeading(headings.map((one) => one.id));

  /*
   * An article is a page, not a state change: give it the title, and put the app's own back on the
   * way out. Not the title that was there before — on an article opened from a link, that is this
   * article's own prerendered title, which would then follow the reader to wherever they went next.
   */
  useEffect(() => {
    if (!article) {
      return;
    }

    document.title = `${article.title} — TransformPipe`;

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
          {t('article.missing.title')}
        </Typography>
        <Typography variant="p" textColor="secondary" className="text-sm">
          {t('article.missing.blurb')}
        </Typography>
        <Button variant="secondary" onClick={onBack}>
          {t('article.missing.back')}
        </Button>
      </div>
    );
  }

  const more = ARTICLES.filter((other) => other.slug !== article.slug).slice(0, 2);

  return (
    /*
     * Two columns from `lg`: the contents down the left, the article beside it. The same shape the
     * documentation uses, for the same reason — these pieces are four thousand words now, and a
     * reader who wants the section on one particular tool should not have to scroll to find it.
     */
    /*
     * 880px of article, 240px of contents, 40px between them: 1160 in total, which is where the
     * numbers came from rather than a preference. A four-thousand-word piece in a 768px column is
     * a lot of scrolling for the same words.
     */
    <div className="mx-auto flex w-full max-w-[72.5rem] gap-10">
      <TableOfContents
        items={headings}
        activeId={activeHeading}
        label={t('article.toc')}
        width="w-60"
      />

      <div className="flex min-w-0 max-w-[55rem] flex-1 flex-col gap-6">
        {/*
          * The trail replaces a back button. It does the same job — the Blog crumb goes back to the
          * list — and says two more things: where this page sits, and that there is a list at all,
          * which a reader arriving from a search result has no way to know.
          */}
        <AppBreadcrumbs
          items={crumbsForArticle(article, content)}
          onNavigate={(view) => (view === 'blog' ? onBack() : onGoToConverter())}
        />

      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" size="sm">
            {article.tag}
          </Badge>
          <Typography variant="span" textColor="light" className="text-xs">
            {/*
              * One sentence with holes in it rather than three fragments in a row: the dates and
              * the reading time are values, and a language that puts them in a different order can
              * only do it if the whole line is one string. Two keys because a revision date on an
              * unrevised piece is noise, so the line that mentions one is its own sentence.
              */}
            {article.updated
              ? t('article.meta.updated', {
                  date: formatArticleDate(article.date, dates),
                  updated: formatArticleDate(article.updated, dates),
                  minutes: article.readingMinutes,
                })
              : t('article.meta', {
                  date: formatArticleDate(article.date, dates),
                  minutes: article.readingMinutes,
                })}
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
        {markdown === null ? (
          /*
           * While the text is in flight. Sized to the reading measure rather than a spinner, so the
           * page does not jump when the prose replaces it.
           */
          <div className="flex flex-col gap-3" aria-hidden>
            {[100, 96, 88, 92, 70, 100, 84].map((width, index) => (
              <div
                key={`${width}-${index}`}
                className="h-4 animate-pulse rounded bg-surface-card2"
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
        ) : (
          <DocumentPreview html={html} className="md-article" />
        )}
      </div>

      {/*
        * Below the prose, not above it: somebody shares an article they have read.
        *
        * The origin comes from the browser rather than a constant, so a link shared from a preview
        * deployment points at the page the reader is actually looking at.
        */}
      <ShareLinks
        url={`${window.location.origin}${articlePath(article.slug)}`}
        title={article.title}
        label={t('article.share')}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-stroke bg-surface-card p-4">
        <Typography variant="span" textColor="secondary" className="text-sm">
          {t('article.cta.text')}
        </Typography>
        <Button size="sm" className="ml-auto" onClick={onGoToConverter}>
          {t('article.cta.button')}
        </Button>
      </div>

      {more.length > 0 && (
        <div className="flex flex-col gap-4 pt-2">
          <SectionHeading
            eyebrow={t('article.more.eyebrow')}
            title={t('article.more.title')}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {more.map((other) => (
              <ArticleCard
                key={other.slug}
                title={other.title}
                description={other.description}
                href={articlePath(other.slug)}
                image={articleCardImage(other.slug)}
                onOpen={() => onOpenArticle(other.slug)}
                tag={other.tag}
                meta={t('article.more.meta', {
                  minutes: other.readingMinutes,
                })}
              />
            ))}
          </div>
        </div>
      )}

      <ScrollToTop />
      </div>
    </div>
  );
}
