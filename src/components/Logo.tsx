import { cn } from '@/ui/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * The wordmark: `transform>pipe`, set in monospace with the caret in brand.
 *
 * The caret is doing the work. It is the shell's redirection operator, which is what the product
 * is — text in one shape, out in another — and it makes the two halves of a run-together name
 * legible without a space the domain does not have. Monospace because that is the typeface the
 * character belongs to; anywhere else it reads as punctuation someone forgot to remove.
 */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        'font-mono font-semibold text-base text-ink-primary tracking-tight',
        className
      )}
    >
      transform<span className="text-brand-tertiary">&gt;</span>pipe
    </span>
  );
}
