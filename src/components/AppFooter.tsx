import { CONVERSIONS, type ConversionId } from '@shared/conversions';
import { Logo } from '@/components/Logo';
import { useI18n, useT } from '@/lib/i18n/context';
import { REPO_URL, STATIC_PAGES, type StaticPageId } from '@/lib/pages';
import type { Destination } from '@/lib/route';
import {
  SiteFooter,
  type FooterColumn,
} from '@/ui/components/SiteFooter';

interface AppFooterProps {
  onConversionChange: (id: ConversionId) => void;
  onViewChange: (view: Destination) => void;
  onOpenPage: (id: StaticPageId) => void;
}

/**
 * This app's footer: the design system's component, filled in from the app's own lists.
 *
 * Nothing here is typed out twice. Which conversions and which pages exist comes from
 * `shared/conversions.ts` and `src/lib/pages.ts`, and what each of them is called comes from the
 * catalogue under the same id — so a fifth conversion or a new legal page appears down here
 * without anybody remembering to add it, in whichever language the reader is in. That is the
 * failure this replaced: a footer that promised a self-contained HTML export and one line about
 * the browser, and nothing else.
 */
export function AppFooter({
  onConversionChange,
  onViewChange,
  onOpenPage,
}: AppFooterProps) {
  const t = useT();
  const { content } = useI18n();

  const page = (id: StaticPageId) => {
    const one = STATIC_PAGES.find((each) => each.id === id)!;

    return {
      label: content.pages[id].label,
      href: one.path,
      onNavigate: () => onOpenPage(id),
    };
  };

  const columns: FooterColumn[] = [
    {
      heading: t('footer.converter'),
      links: CONVERSIONS.map((one) => ({
        label: content.conversions[one.id].label,
        href: one.path,
        onNavigate: () => onConversionChange(one.id),
      })),
    },
    {
      heading: t('footer.resources'),
      links: [
        {
          label: t('footer.docs'),
          href: '/docs',
          onNavigate: () => onViewChange('docs'),
        },
        {
          label: t('footer.blog'),
          href: '/blog',
          onNavigate: () => onViewChange('blog'),
        },
        { label: t('footer.git'), href: REPO_URL, external: true },
      ],
    },
    {
      heading: t('footer.company'),
      links: [page('about'), page('contact')],
    },
    {
      heading: t('footer.legal'),
      links: [page('privacy'), page('terms'), page('cookies')],
    },
  ];

  return (
    <SiteFooter
      brand={<Logo />}
      tagline={t('footer.tagline')}
      builtBy={t('footer.builtby')}
      columns={columns}
      /* The year is a number, not a word: it goes in as a value the sentence has a hole for. */
      note={t('footer.note', { year: new Date().getFullYear() })}
      externalLabel={t('footer.external')}
    />
  );
}
