import { cn } from '@/ui/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * The wordmark: `T>pipe`, set in monospace with the caret in brand.
 *
 * The caret is doing the work. It is the shell's redirection operator, which is what the product
 * is — text in one shape, out in another. Monospace because that is the typeface the character
 * belongs to; anywhere else it reads as punctuation someone forgot to remove.
 *
 * Six characters rather than fourteen, because the mark sits in a bar that also has to hold a
 * conversion picker, four links and an account menu, and the full name spent its width without
 * earning it — it is on the page in the title, the footer and the domain either way. The `T` is
 * the initial and `pipe` is the half of the name that says what the thing does, so the short form
 * loses the least. The favicon is this caret on its own, and has been from the start.
 */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        'font-mono font-semibold text-base text-ink-primary tracking-tight',
        className
      )}
    >
      T<span className="text-brand-tertiary">&gt;</span>pipe
    </span>
  );
}
