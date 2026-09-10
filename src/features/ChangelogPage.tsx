import { useMemo } from 'react';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { DocumentPreview } from '@/components/DocumentPreview';
import { ScrollToTop } from '@/components/ScrollToTop';
import { changelogCrumbs } from '@/lib/breadcrumbs';
import { changelogByYear } from '@/lib/changelog';
import { formatDate, formatMonth } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { markdownToHtml } from '@/lib/markdown';
import { Badge } from '@/ui/components/Badge';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { Typography } from '@/ui/components/Typography';

/*
 * What has shipped, grouped by month under the year it happened in.
 *
 * It was a flat list of cards, which is what a changelog looks like on its first day and stops
 * being once it is longer than a screen: a reader arrives asking "what changed since I last
 * looked", and a flat list answers that only by making them read every date. Month headings answer
 * it at a glance, and they are the landmark a year navigation can point at.
 *
 * The entries are English and the headings are not: `Intl` puts the month in the reader's
 * language, which costs nothing and is the one part of an entry that translates itself.
 */
export function ChangelogPage({
  onGoToConverter,
}: {
  onGoToConverter: () => void;
}) {
  const t = useT();
  const { content, locale } = useI18n();

  /*
   * The grouping and every body through the converter once. Thirteen short entries, and neither
   * the list nor its shape changes while the tab is open.
   */
  const years = useMemo(() => {
    const intl = INTL_LOCALES[locale];

    return changelogByYear().map((year) => ({
      year: year.year,
      months: year.months.map((month) => ({
        key: month.key,
        heading: formatMonth(month.key, intl),
        entries: month.entries.map((entry) => ({
          ...entry,
          html: markdownToHtml(entry.body),
          when: formatDate(entry.date, intl),
        })),
      })),
    }));
  }, [locale]);

  /*
   * The year navigation appears when there is more than one year to navigate between. Today there
   * is one, and a column headed "Browse by year" listing the only year there is would be chrome
   * pretending the archive is deeper than it is. The page is built for the second year; it just
   * does not claim it yet.
   */
  const browsable = years.length > 1;

  return (
    <div
      className={`mx-auto flex w-full flex-col gap-6 ${
        browsable ? 'max-w-5xl' : 'max-w-3xl'
      }`}
    >
      <AppBreadcrumbs
        items={changelogCrumbs(content, locale)}
        onNavigate={onGoToConverter}
      />

      <SectionHeading
        size="lg"
        eyebrow={t('changelog.eyebrow')}
        title={t('changelog.title')}
        description={t('changelog.lede')}
        className="pt-2"
      />

      <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:gap-10">
        {browsable && (
          /*
           * Anchors rather than buttons: a year is an address on this page, so it should be
           * openable in a new tab and shareable. The column sits after the entries in the source
           * and beside them on a wide screen — a reader arriving on a phone wants the newest
           * change, not a list of years, and `flex-row-reverse` moves the column without moving
           * the reading order.
           */
          <nav
            aria-label={t('changelog.years')}
            className="lg:sticky lg:top-24 lg:w-40 lg:shrink-0"
          >
            <Typography
              variant="span"
              textColor="light"
              className="block text-xxs uppercase tracking-wide"
            >
              {t('changelog.years')}
            </Typography>

            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {years.map((year) => (
                <li key={year.year}>
                  <a
                    href={`#changelog-${year.year}`}
                    className="inline-flex rounded-md border border-stroke px-2.5 py-1 text-sm tabular-nums transition-colors hover:border-brand-primary lg:border-transparent lg:px-2"
                  >
                    {year.year}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-10">
          {years.map((year) => (
            <section
              key={year.year}
              id={`changelog-${year.year}`}
              className="flex scroll-mt-24 flex-col gap-6"
            >
              {/*
               * The year is a heading only where it is one: with a single year on the page it is
               * the same word as the month heading's own year, and stacking them reads as a
               * mistake. It appears as soon as there is a second year to tell it apart from.
               */}
              {browsable && (
                <Typography
                  variant="h2"
                  className="border-b border-stroke pb-2 text-xl tabular-nums md:text-2xl"
                >
                  {year.year}
                </Typography>
              )}

              {year.months.map((month) => (
                <section key={month.key} className="flex flex-col gap-4">
                  {/*
                   * A label rather than a heading's usual size. It is a divider between groups of
                   * cards, and the cards carry the titles a reader is scanning for; a month set
                   * at the h3 default would outshout every entry under it.
                   *
                   * `md:text-xs` as well as `text-xs`, because the design system's `h3` sets
                   * `md:text-2xl` and a wide screen would otherwise take it back.
                   */}
                  <Typography
                    variant="h3"
                    textColor="light"
                    className="text-xs font-semibold uppercase tracking-wide md:text-xs"
                  >
                    {month.heading}
                  </Typography>

                  {/*
                   * An ordered list, because the order is the information: newest first, and a
                   * reader who stops reading has still seen the most recent thing.
                   */}
                  <ol className="flex flex-col gap-4">
                    {month.entries.map((entry) => (
                      <li
                        key={`${entry.date}-${entry.title}`}
                        className="flex flex-col gap-3 rounded-lg border border-stroke bg-surface-card p-5 md:p-6"
                      >
                        {/*
                         * The date leads, as it does on the entries themselves: a version is the
                         * exception — most of these shipped between tags — so a badge that is
                         * usually absent cannot be the thing a reader looks for first.
                         */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Typography
                            variant="span"
                            textColor="light"
                            className="text-xxs uppercase tracking-wide"
                          >
                            <time dateTime={entry.date}>{entry.when}</time>
                          </Typography>

                          {entry.version && (
                            <Badge variant="secondary" size="xs">
                              {entry.version}
                            </Badge>
                          )}
                        </div>

                        <Typography variant="h4" className="text-lg md:text-xl">
                          {entry.title}
                        </Typography>

                        {/*
                         * `md-article` rather than a class of its own: all it does is make the
                         * document sheet transparent and hand it the page colour, which is
                         * exactly right inside a card that already carries a background.
                         */}
                        <DocumentPreview html={entry.html} className="md-article" />
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </section>
          ))}
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}
