import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';

const TRACK_COLOR = {
  primary: 'hsl(var(--surface-page))',
  secondary: 'hsl(var(--surface-page))',
};

const INDICATOR_COLOR = {
  primary: 'hsl(var(--brand-primary))',
  secondary: 'hsl(var(--brand-secondary))',
};

interface CircularProgressProps
  extends Omit<ComponentProps<'div'>, 'children'> {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary';
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

/**
 * Circular progress indicator that renders an SVG ring around optional children.
 */
const CircularProgress = ({
  value,
  max = 100,
  variant = 'primary',
  size = 40,
  strokeWidth = 2.5,
  className,
  children,
  ...props
}: CircularProgressProps) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const clampedValue = Math.min(Math.max(value ?? 0, 0), max);
  const offset = circumference - (clampedValue / max) * circumference;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      <svg
        className="absolute inset-0"
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={TRACK_COLOR[variant]}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={INDICATOR_COLOR[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      {children && <div className="relative">{children}</div>}
    </div>
  );
};

CircularProgress.displayName = 'CircularProgress';

export { CircularProgress, type CircularProgressProps };
