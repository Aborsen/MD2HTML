import { useMemo } from 'react';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { DocumentPreview } from '@/components/DocumentPreview';
import { ScrollToTop } from '@/components/ScrollToTop';
import { changelogCrumbs } from '@/lib/breadcrumbs';
import { useI18n, useT } from '@/lib/i18n/context';
import { markdownToHtml } from '@/lib/markdown';
import { CHANGELOG } from '@/lib/changelog';
import { SectionHeading } from '@/ui/components/SectionHeading';

/*
 * What has shipped, from the file the repository keeps.
 *
 * The entries are one Markdown file — `content/changelog.md` — rendered by the same converter the
 * product sells, which is the arrangement the blog uses and for the same reason: a release note
 * that breaks the renderer breaks a customer's document too, and this is a better place to find
 * that out. It also means the file is readable in the repository by somebody who never opens the
 * site, which is where a changelog is usually read from.
 *
 * The entries are English. The chrome around them is not, and the split is deliberate: a heading
 * and a lede are five short strings, while a changelog grows by an entry per release and five
 * translations per entry is a cost that gets skipped after the second release. The blog draws the
 * same line.
 */
export function ChangelogPage({
  onGoToConverter,
}: {
  onGoToConverter: () => void;
}) {
  const t = useT();
  const { content, locale } = useI18n();

  /* One file, parsed once. It is a few kilobytes and it does not change while the tab is open. */
  const html = useMemo(() => markdownToHtml(CHANGELOG), []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
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

      <DocumentPreview html={html} className="md-article" />

      <ScrollToTop />
    </div>
  );
}
