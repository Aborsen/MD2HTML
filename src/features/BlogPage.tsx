import { useMemo, useState } from 'react';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { FilterChips } from '@/components/FilterChips';
import { blogCrumbs } from '@/lib/breadcrumbs';
import { articleCardImage } from '@/lib/covers';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { ScrollToTop } from '@/components/ScrollToTop';
import {
  ARTICLES,
  articlePath,
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
   * Only the first chip has a word of its own. The rest are the articles' own tags, and the
   * articles are English — see the note in `src/lib/i18n/content.ts` about why they are not in the
   * catalogue — so a tag is shown as written rather than translated into a filter that matches
   * nothing.
   */
  const chips = useMemo(
    () => [
      { value: ALL, label: t('blog.chip.all'), count: ARTICLES.length },
      ...articleTags().map((name) => ({
        value: name,
        label: name,
        count: ARTICLES.filter((article) => article.tag === name).length,
      })),
    ],
    [t]
  );

  const shown = useMemo(
    () => (tag === ALL ? ARTICLES : ARTICLES.filter((a) => a.tag === tag)),
    [tag]
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
            href={articlePath(lead.slug)}
            image={articleCardImage(lead.slug)}
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
              href={articlePath(article.slug)}
              image={articleCardImage(article.slug)}
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
