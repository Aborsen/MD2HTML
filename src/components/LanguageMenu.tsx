import { Check, Languages } from 'lucide-react';
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
 * that would get them out of it. No flags: a flag is a country, several of these languages are
 * spoken in many, and Spanish has no flag that does not exclude somebody.
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
          <Languages className="size-4" />
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {LOCALES.map((one) => (
          <DropdownMenuItem
            key={one}
            onSelect={() => setLocale(one)}
            className="flex items-center justify-between gap-3"
          >
            <span lang={one}>{LOCALE_NAMES[one]}</span>
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
