import { Check } from 'lucide-react';
import { LocaleFlag } from './LocaleFlag';
import { useI18n } from '@/lib/i18n/context';
import { LOCALE_NAMES, LOCALES } from '@/lib/i18n/locales';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/DropdownMenu';
import { IconButton } from '@/ui/components/IconButton';
import { cn } from '@/ui/lib/utils';

/*
 * The language switcher.
 *
 * Each language is named in itself — Deutsch, not German — because the name a reader recognises is
 * the one in their own language, and a reader who has landed on the wrong one cannot read the list
 * that would get them out of it.
 *
 * Beside each name, its flag — and the name stays, because a flag is a country and a language is
 * not: German is spoken in three of them and Spanish across two continents. The flag makes an
 * entry findable at a glance; the name is what actually says which language it is. `LocaleFlag`
 * explains why they are drawn as SVG rather than written as emoji.
 *
 * Switching is a navigation, not a state change. `setLocale` rewrites the address to the same page
 * in the new language, so the choice is in the URL where it can be shared, reloaded and indexed —
 * and it is remembered, so the automatic choice never argues with a reader who has made one.
 */
export function LanguageMenu({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          variant="tertiary"
          size="sm"
          className={className}
          /*
           * Labelled in English, and deliberately: this is the control somebody reaches for when
           * the page is in a language they cannot read, so its label has to be the one word about
           * this button that is legible from any of the five.
           */
          aria-label="Language"
        >
          {/* The flag of the language you are in, so the control says what it will change. */}
          <LocaleFlag locale={locale} className="h-3 w-4" />
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {LOCALES.map((one) => (
          <DropdownMenuItem
            key={one}
            onSelect={() => setLocale(one)}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex min-w-0 items-center gap-2">
              <LocaleFlag locale={one} className="h-3 w-4" />
              <span lang={one}>{LOCALE_NAMES[one]}</span>
            </span>
            <Check
              aria-hidden
              className={cn(
                'size-3.5 text-brand-tertiary',
                one === locale ? 'opacity-100' : 'opacity-0'
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
