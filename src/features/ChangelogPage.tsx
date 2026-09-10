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
   * The year heading appears when there is more than one year: with a single year on the page it
   * is the same word as the month heading's own year, and stacking them reads as a mistake.
   *
   * The panel beside the entries does not wait for that, because it carries the scope note as
   * well as the years — what belongs in this list and what does not is worth saying on the first
   * day, and a reader who wonders why a fix they were sent is missing should not have to guess.
   */
  const browsable = years.length > 1;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
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

      <div className="flex flex-col-reverse gap-8 lg:flex-row-reverse lg:items-start lg:gap-10">
        {/*
         * Both directions are reversed, so the panel is first in the source and last on the
         * screen: beside the entries on a wide one and under them on a phone. A reader arriving
         * on a phone wants the newest change, not a list of years and a note about what the list
         * contains — that note reads better once the list has been read.
         */}
        <aside className="lg:sticky lg:top-24 lg:w-60 lg:shrink-0">
          <div className="flex flex-col gap-4 rounded-xl border border-stroke bg-surface-card p-5">
            {/*
             * Anchors rather than buttons: a year is an address on this page, so it should be
             * openable in a new tab, shareable, and reachable by keyboard without any script of
             * ours. Two to a row, at a size a thumb can hit.
             */}
            <nav aria-label={t('changelog.years')} className="flex flex-col gap-3">
              <Typography variant="span" className="text-xs font-bold uppercase tracking-wide">
                {t('changelog.years')}
              </Typography>

              <ul className="grid grid-cols-2 gap-2">
                {years.map((year) => (
                  <li key={year.year}>
                    <a
                      href={`#changelog-${year.year}`}
                      className="block rounded-full border border-stroke px-3 py-2 text-center text-sm font-medium tabular-nums transition-colors hover:border-stroke-hover hover:bg-surface-chips"
                    >
                      {year.year}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/*
             * What the list contains, under a rule, in the reader's language. The entries are the
             * changes somebody using the product would notice; the internal work is most of what
             * happens in the repository and none of it is here, which is a decision worth stating
             * rather than leaving a reader to infer from what is missing.
             */}
            <Typography
              variant="p"
              textColor="light"
              className="border-t border-stroke pt-4 text-xs leading-relaxed"
            >
              {t('changelog.scope')}
            </Typography>
          </div>
        </aside>

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
