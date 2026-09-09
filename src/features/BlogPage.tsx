import { useMemo, useState } from 'react';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { FilterChips } from '@/components/FilterChips';
import { blogCrumbs } from '@/lib/breadcrumbs';
import { articleCardImage } from '@/lib/covers';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { ScrollToTop } from '@/components/ScrollToTop';
import {
  articlePath,
  articlesFor,
  articleTags,
  formatArticleDate,
} from '@/lib/blog';
import { ArticleCard } from '@/ui/components/ArticleCard';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { Typography } from '@/ui/components/Typography';

interface BlogPageProps {
  onOpenArticle: (slug: string) => void;
  onGoToConverter: () => void;
}

const ALL = 'all';

/**
 * The article index: the newest piece given room, the rest in a grid, filtered by tag.
 *
 * The chips are the history's chips and the cards are the cards the converter shows — one filter
 * row and one card in the design system, used wherever a list of things needs narrowing.
 */
export function BlogPage({ onOpenArticle, onGoToConverter }: BlogPageProps) {
  const t = useT();
  const { content, locale } = useI18n();
  /* The tag `Intl` wants, which is not the tag in the address — see `INTL_LOCALES`. */
  const dates = INTL_LOCALES[locale];
  const [tag, setTag] = useState(ALL);

  /*
   * What this language has, which is not what English has.
   *
   * The blog is translated one article at a time, so a locale's index lists only the pieces that
   * exist in it. Listing the English ones under a German heading would be a page of links a German
   * reader cannot use, and it would make the count on the chips a lie.
   */
  const articles = useMemo(() => articlesFor(locale), [locale]);

  /*
   * Only the first chip has a word of its own. The rest are the tags as the articles themselves
   * write them — a German article carries a German tag — so a chip always matches something.
   */
  const chips = useMemo(
    () => [
      { value: ALL, label: t('blog.chip.all'), count: articles.length },
      ...articleTags(locale).map((name) => ({
        value: name,
        label: name,
        count: articles.filter((article) => article.tag === name).length,
      })),
    ],
    [articles, locale, t]
  );

  const shown = useMemo(
    () => (tag === ALL ? articles : articles.filter((a) => a.tag === tag)),
    [articles, tag]
  );

  const [lead, ...rest] = shown;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <SectionHeading
        align="center"
        size="lg"
        eyebrow={t('blog.eyebrow')}
        title={t('blog.title')}
        description={t('blog.blurb')}
        className="pt-2 pb-2"
      />

      {/* Centred under a centred heading; below `lg` they scroll, so they stay flush left there. */}
      <AppBreadcrumbs
        items={blogCrumbs(content, locale)}
        onNavigate={onGoToConverter}
        className="lg:self-center"
      />

      <FilterChips
        items={chips}
        value={tag}
        onValueChange={setTag}
        className="lg:justify-center"
      />

      {shown.length === 0 ? (
        <Typography variant="p" textColor="secondary" className="py-8 text-sm">
          {t('blog.empty')}
        </Typography>
      ) : (
        /*
         * Three across from `lg`, two at tablet width. With fifty articles a two-column list is a
         * very long scroll, and the cards carry a title and two lines — they do not need half the
         * page each. The lead keeps the full width, whatever the count.
         */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCard
            key={lead.slug}
            featured
            className="sm:col-span-2 lg:col-span-3"
            title={lead.title}
            description={lead.description}
            href={articlePath(lead.slug, locale)}
            image={articleCardImage(lead.slug, locale)}
            onOpen={() => onOpenArticle(lead.slug)}
            tag={lead.tag}
            meta={t('blog.card.meta', {
              date: formatArticleDate(lead.date, dates),
              minutes: lead.readingMinutes,
            })}
          />

          {rest.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title}
              description={article.description}
              href={articlePath(article.slug, locale)}
              image={articleCardImage(article.slug, locale)}
              onOpen={() => onOpenArticle(article.slug)}
              tag={article.tag}
              meta={t('blog.card.meta', {
                date: formatArticleDate(article.date, dates),
                minutes: article.readingMinutes,
              })}
            />
          ))}
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}
