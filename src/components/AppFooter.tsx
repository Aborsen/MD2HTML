import { CONVERSIONS, type ConversionId } from '@shared/conversions';
import { Logo } from '@/components/Logo';
import { REPO_URL, STATIC_PAGES, type StaticPageId } from '@/lib/pages';
import type { AppView } from '@/lib/route';
import {
  SiteFooter,
  type FooterColumn,
} from '@/ui/components/SiteFooter';

interface AppFooterProps {
  onConversionChange: (id: ConversionId) => void;
  onViewChange: (view: AppView) => void;
  onOpenPage: (id: StaticPageId) => void;
}

/**
 * This app's footer: the design system's component, filled in from the app's own lists.
 *
 * Nothing here is typed out twice. The conversions come from `shared/conversions.ts` and the pages
 * from `src/lib/pages.ts`, so a fifth conversion or a new legal page appears down here without
 * anybody remembering to add it — which is the failure this replaced, a footer that promised a
 * self-contained HTML export and one line about the browser, and nothing else.
 */
export function AppFooter({
  onConversionChange,
  onViewChange,
  onOpenPage,
}: AppFooterProps) {
  const page = (id: StaticPageId) => {
    const one = STATIC_PAGES.find((each) => each.id === id)!;

    return {
      label: one.label,
      href: one.path,
      onNavigate: () => onOpenPage(id),
    };
  };

  const columns: FooterColumn[] = [
    {
      heading: 'Converter',
      links: CONVERSIONS.map((one) => ({
        label: one.label,
        href: one.path,
        onNavigate: () => onConversionChange(one.id),
      })),
    },
    {
      heading: 'Resources',
      links: [
        {
          label: 'Documentation',
          href: '/docs',
          onNavigate: () => onViewChange('docs'),
        },
        { label: 'Blog', href: '/blog', onNavigate: () => onViewChange('blog') },
        { label: 'Git', href: REPO_URL, external: true },
      ],
    },
    {
      heading: 'Company',
      links: [page('about'), page('contact')],
    },
    {
      heading: 'Legal',
      links: [page('privacy'), page('terms'), page('cookies')],
    },
  ];

  return (
    <SiteFooter
      brand={<Logo />}
      tagline="Markdown, HTML, Word, CSV and JSON documents, converted in your browser."
      builtBy="Built by Raudar Labs."
      columns={columns}
      note={`© Raudar Labs ${new Date().getFullYear()}`}
    />
  );
}
