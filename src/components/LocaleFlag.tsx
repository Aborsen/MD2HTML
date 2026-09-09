import type { Locale } from '@/lib/i18n/locales';
import { cn } from '@/ui/lib/utils';

/*
 * A flag per language, drawn rather than typed.
 *
 * Not emoji. A regional-indicator pair is the obvious way to write 🇩🇪 and Windows does not render
 * it as a flag at all — it shows the two letters in a box — so the switcher would look broken on
 * the platform most of these readers are on. Four flat rectangles of SVG render identically
 * everywhere and weigh nothing.
 *
 * A flag is a country and a language is not: German is spoken in Austria and Switzerland, French
 * in Belgium and Quebec, Spanish across two continents. The mark beside a language name is a
 * shorthand for that language's own name, which is why the name is always there next to it in the
 * menu — the flag alone would be making a claim about a country nobody asked it to make.
 *
 * `en` is the Union Jack because this product writes British English, which is also what `Intl`
 * gets told (see `INTL_LOCALES`): "8 September 2026", not "September 8, 2026".
 */

/** 4:3, so all five sit on the same box whatever their real proportions are. */
const BOX = 'aria-hidden shrink-0 rounded-[1px]';

function Flag({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 16 12"
      className={cn(BOX, className)}
      role="presentation"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const FLAGS: Record<Locale, (className?: string) => React.ReactElement> = {
  /* Three horizontal bands: black, red, gold. */
  de: (className) => (
    <Flag className={className}>
      <rect width="16" height="4" fill="#000000" />
      <rect y="4" width="16" height="4" fill="#DD0000" />
      <rect y="8" width="16" height="4" fill="#FFCE00" />
    </Flag>
  ),

  /* Three vertical bands: blue, white, red. */
  fr: (className) => (
    <Flag className={className}>
      <rect width="16" height="12" fill="#FFFFFF" />
      <rect width="5.34" height="12" fill="#002395" />
      <rect x="10.66" width="5.34" height="12" fill="#ED2939" />
    </Flag>
  ),

  /* Red, yellow, red — the yellow band is half the height, not a third. */
  es: (className) => (
    <Flag className={className}>
      <rect width="16" height="12" fill="#AA151B" />
      <rect y="3" width="16" height="6" fill="#F1BF00" />
    </Flag>
  ),

  /* Three vertical bands: green, white, red. */
  it: (className) => (
    <Flag className={className}>
      <rect width="16" height="12" fill="#FFFFFF" />
      <rect width="5.34" height="12" fill="#008C45" />
      <rect x="10.66" width="5.34" height="12" fill="#CD212A" />
    </Flag>
  ),

  /*
   * The Union Jack: the blue ground, the white saltire, the red saltire inset within it, then the
   * white cross and the red cross over the top. Simplified in one way only — the real saltires are
   * counterchanged, offset either side of the diagonal, and at 16px that offset is invisible.
   */
  en: (className) => (
    <Flag className={className}>
      <rect width="16" height="12" fill="#012169" />
      <path d="M0 0 16 12M16 0 0 12" stroke="#FFFFFF" strokeWidth="2.4" />
      <path d="M0 0 16 12M16 0 0 12" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M8 0V12M0 6H16" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M8 0V12M0 6H16" stroke="#C8102E" strokeWidth="2.4" />
    </Flag>
  ),
};

export function LocaleFlag({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  return FLAGS[locale](className);
}
