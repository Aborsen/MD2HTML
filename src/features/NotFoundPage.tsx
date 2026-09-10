import { ArrowRight } from 'lucide-react';
import { useT } from '@/lib/i18n/context';
import { Button } from '@/ui/components/Button';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { Typography } from '@/ui/components/Typography';

/*
 * The page for an address that is not a page.
 *
 * It exists because the alternative was worse in two ways at once. Inside the app, every
 * unrecognised path fell through to the converter, so a typo rendered the front page under a
 * stranger's URL and nothing said the address was wrong. And on the way in, an address with no
 * prerendered file got the host's own grey error page, which carries no navigation at all — a
 * reader who mistyped one character had nothing to click.
 *
 * So: three ways out, named rather than hinted at, and no apology. A reader who arrives here
 * either mistyped something or followed a link that has gone, and neither is their fault.
 */
export function NotFoundPage({
  onGoToConverter,
  onGoToDocs,
  onGoToBlog,
}: {
  onGoToConverter: () => void;
  onGoToDocs: () => void;
  onGoToBlog: () => void;
}) {
  const t = useT();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-12">
      <SectionHeading
        align="center"
        size="lg"
        eyebrow={t('notfound.eyebrow')}
        title={t('notfound.title')}
        description={t('notfound.lede')}
      />

      {/*
       * The converter first and as the primary action, because it is what somebody who typed the
       * domain by hand was looking for, and because it is the one destination that needs no
       * explanation.
       */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button variant="primary" rightSlot={<ArrowRight />} onClick={onGoToConverter}>
          {t('notfound.converter')}
        </Button>
        <Button variant="secondary" onClick={onGoToDocs}>
          {t('notfound.docs')}
        </Button>
        <Button variant="tertiary" onClick={onGoToBlog}>
          {t('notfound.blog')}
        </Button>
      </div>

      <Typography variant="p" textColor="light" className="text-center text-xs">
        {t('notfound.note')}
      </Typography>
    </div>
  );
}
