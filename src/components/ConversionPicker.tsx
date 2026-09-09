import { ArrowRight, Check } from 'lucide-react';
import {
  CONVERSIONS,
  type ConversionId,
} from '@shared/conversions';
import { useI18n, useT } from '@/lib/i18n/context';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

interface ConversionPickerProps {
  current: ConversionId;
  onChange: (id: ConversionId) => void;
  className?: string;
}

/**
 * The conversions, as blocks under the dropzone.
 *
 * They took the place of three cards that praised the product — converted in this browser, several
 * files at once, a self-contained export — all true, all already said in the questions further
 * down, and none of them any use to somebody who arrived with a spreadsheet and could not see that
 * this app takes spreadsheets. The menu in the header held that, one click out of sight.
 *
 * Every entry is a real link to its own page as well as a button, so it can be middle-clicked,
 * copied, and followed by a crawler that will not click anything.
 */
export function ConversionPicker({
  current,
  onChange,
  className,
}: ConversionPickerProps) {
  const t = useT();
  const { content } = useI18n();

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Typography
        variant="span"
        weight="semibold"
        textColor="light"
        className="text-xxs uppercase tracking-wide"
      >
        {t('converter.picker.label')}
      </Typography>

      {/*
        * Five tracks at the top width, because there are five conversions and a grid of four
        * would leave the fifth alone on a row of its own — which reads as a mistake rather than
        * as the last item. Two on a phone, three in between.
        */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {CONVERSIONS.map((one) => {
          const isCurrent = one.id === current;

          return (
            <a
              key={one.id}
              href={one.path}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={(event) => {
                // The browser keeps the clicks it was asked for: new tab, new window, save.
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  return;
                }

                event.preventDefault();
                onChange(one.id);
              }}
              className={cn(
                'group flex flex-col gap-1 rounded-lg border p-4 no-underline transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2',
                isCurrent
                  ? 'border-brand-tertiary bg-surface-accent'
                  : 'border-stroke bg-surface-card hover:border-brand-tertiary'
              )}
            >
              <span className="flex items-center gap-1.5">
                <Typography
                  variant="span"
                  weight="semibold"
                  textColor={isCurrent ? 'accent' : 'primary'}
                  className="text-sm"
                >
                  {content.conversions[one.id].label}
                </Typography>

                {isCurrent ? (
                  <Check className="size-3.5 shrink-0 text-brand-tertiary" />
                ) : (
                  <ArrowRight className="size-3.5 shrink-0 text-ink-inactive transition-transform group-hover:translate-x-0.5" />
                )}
              </span>

              <Typography
                variant="span"
                textColor="secondary"
                className="text-xs"
              >
                {one.extensions.join(', ')}
              </Typography>
            </a>
          );
        })}
      </div>
    </div>
  );
}
