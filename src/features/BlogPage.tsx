import { useMemo, useState } from 'react';
import { FilterChips } from '@/components/FilterChips';
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
}

const ALL = 'all';

/**
 * The article index: the newest piece given room, the rest in a grid, filtered by tag.
 *
 * The chips are the history's chips and the cards are the cards the converter shows — one filter
 * row and one card in the design system, used wherever a list of things needs narrowing.
 */
export function BlogPage({ onOpenArticle }: BlogPageProps) {
  const [tag, setTag] = useState(ALL);

  const chips = useMemo(
    () => [
      { value: ALL, label: 'All', count: ARTICLES.length },
      ...articleTags().map((name) => ({
        value: name,
        label: name,
        count: ARTICLES.filter((article) => article.tag === name).length,
      })),
    ],
    []
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
        eyebrow="Blog"
        title="Markdown, and what to do with it"
        description="Conversion, syntax that breaks, publishing, and getting the whole thing to run without you."
        className="pt-2 pb-2"
      />

      {/* Centred under a centred heading; below `lg` they scroll, so they stay flush left there. */}
      <FilterChips
        items={chips}
        value={tag}
        onValueChange={setTag}
        className="lg:justify-center"
      />

      {shown.length === 0 ? (
        <Typography variant="p" textColor="secondary" className="py-8 text-sm">
          Nothing under that tag yet.
        </Typography>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <ArticleCard
            key={lead.slug}
            featured
            className="md:col-span-2"
            title={lead.title}
            description={lead.description}
            href={articlePath(lead.slug)}
            onOpen={() => onOpenArticle(lead.slug)}
            tag={lead.tag}
            meta={`${formatArticleDate(lead.date)} · ${lead.readingMinutes} min read`}
          />

          {rest.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title}
              description={article.description}
              href={articlePath(article.slug)}
              onOpen={() => onOpenArticle(article.slug)}
              tag={article.tag}
              meta={`${formatArticleDate(article.date)} · ${article.readingMinutes} min read`}
            />
          ))}
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}
