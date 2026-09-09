import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { ScrollToTop } from '@/components/ScrollToTop';
import { crumbsForStaticPage } from '@/lib/breadcrumbs';
import { formatDate } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { ISSUES_URL, type StaticPage as Page } from '@/lib/pages';
import { Typography } from '@/ui/components/Typography';

interface StaticPageProps {
  page: Page;
  onGoToConverter: () => void;
}

/**
 * One page of words — about, contact, or one of the legal three.
 *
 * All five share this renderer because they are the same shape: a title, a line, and sections of
 * short paragraphs. Five components would be five chances for the terms page to drift into looking
 * like a different site than the privacy page, which is precisely where a reader starts to wonder
 * who they are dealing with.
 *
 * The `page` it is handed says which page this is and where it lives; every word on it comes from
 * the catalogue under that same id, so the five shapes are one renderer in five languages rather
 * than twenty-five components.
 */
export function StaticPage({ page, onGoToConverter }: StaticPageProps) {
  const t = useT();
  const { content, locale } = useI18n();
  const words = content.pages[page.id];

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <AppBreadcrumbs
        items={crumbsForStaticPage(page, content, locale)}
        onNavigate={onGoToConverter}
      />

      <header className="flex flex-col gap-2">
        <Typography
          variant="h1"
          weight="semibold"
          textColor="primary"
          className="text-2xl md:text-3xl"
        >
          {words.title}
        </Typography>
        <Typography variant="p" textColor="secondary">
          {words.lede}
        </Typography>
        {/*
          * The day itself is not language and stays in `src/lib/pages.ts` beside the path, as the
          * ISO date it is. How it is written out is language, and that is `Intl`'s.
          */}
        {page.updated && (
          <Typography variant="span" textColor="light" className="text-xs">
            {t('page.updated', {
              date: formatDate(page.updated, INTL_LOCALES[locale]),
            })}
          </Typography>
        )}
      </header>

      <div className="flex flex-col gap-8">
        {words.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <Typography
              variant="h2"
              weight="semibold"
              textColor="primary"
              className="text-base"
            >
              {section.heading}
            </Typography>

            {section.body.map((paragraph) => (
              <Typography
                key={paragraph.slice(0, 40)}
                variant="p"
                textColor="secondary"
                className="text-sm leading-relaxed"
              >
                {paragraph}
              </Typography>
            ))}

            {section.items && (
              <ul className="flex flex-col gap-2 pl-5">
                {section.items.map((item) => (
                  <li
                    key={item.slice(0, 40)}
                    className="list-disc text-ink-secondary text-sm leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/*
        * Every one of these pages ends by telling somebody where a question goes.
        *
        * Two keys and not one: the anchor sits inside the sentence, so the words before it and the
        * words it carries are separate strings. A translator cannot move the link within the
        * sentence — the price of having a link in it at all.
        */}
      <footer className="border-stroke border-t pt-6">
        <Typography variant="p" textColor="secondary" className="text-sm">
          {t('page.questions')}{' '}
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-brand-tertiary underline-offset-2 hover:underline"
          >
            {t('page.questions.link')}
          </a>
          .
        </Typography>
      </footer>

      <ScrollToTop />
    </article>
  );
}
