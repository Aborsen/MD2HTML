import { cn } from '@/ui/lib/utils';

interface LogoProps {
  className?: string;
}

/** Wordmark used in the app header. */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        'font-semibold text-base text-ink-primary tracking-tight',
        className
      )}
    >
      M<span className="text-brand-tertiary">2</span>H
    </span>
  );
}
