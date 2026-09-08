import { ScrollToTop } from '@/components/ScrollToTop';
import { ISSUES_URL, type StaticPage as Page } from '@/lib/pages';
import { Typography } from '@/ui/components/Typography';

interface StaticPageProps {
  page: Page;
}

/**
 * One page of words — about, contact, or one of the legal three.
 *
 * All five share this renderer because they are the same shape: a title, a line, and sections of
 * short paragraphs. Five components would be five chances for the terms page to drift into looking
 * like a different site than the privacy page, which is precisely where a reader starts to wonder
 * who they are dealing with.
 */
export function StaticPage({ page }: StaticPageProps) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Typography
          variant="h1"
          weight="semibold"
          textColor="primary"
          className="text-2xl md:text-3xl"
        >
          {page.title}
        </Typography>
        <Typography variant="p" textColor="secondary">
          {page.lede}
        </Typography>
        {page.updated && (
          <Typography variant="span" textColor="light" className="text-xs">
            Last updated {page.updated}
          </Typography>
        )}
      </header>

      <div className="flex flex-col gap-8">
        {page.sections.map((section) => (
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

      {/* Every one of these pages ends by telling somebody where a question goes. */}
      <footer className="border-stroke border-t pt-6">
        <Typography variant="p" textColor="secondary" className="text-sm">
          Questions about any of this go to{' '}
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-brand-tertiary underline-offset-2 hover:underline"
          >
            the repository’s issues
          </a>
          .
        </Typography>
      </footer>

      <ScrollToTop />
    </article>
  );
}
