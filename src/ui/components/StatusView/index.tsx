import { Typography } from '../Typography';
import { cva, type VariantProps } from 'class-variance-authority';
import { CircleAlert, CircleCheck, Inbox, Info, RefreshCw } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';

const containerVariants = cva(
  'flex min-h-0 flex-1 flex-col items-center justify-center rounded-lg text-center',
  {
    variants: {
      size: {
        xs: 'gap-1 p-3',
        sm: 'gap-3 px-4 py-6',
        md: 'gap-4 px-4 py-8',
        lg: 'gap-5 px-6 py-12',
      },
      surface: {
        embedded: '',
        standalone: 'border border-stroke bg-surface-card',
      },
    },
    defaultVariants: {
      size: 'md',
      surface: 'standalone',
    },
  }
);

const haloVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full',
  {
    variants: {
      tone: {
        neutral: 'bg-brand-primary/40 text-brand-tertiary',
        muted: 'bg-brand-primary/5 text-ink-secondary',
        error: 'bg-fb-red/10 text-fb-red-text',
        info: 'bg-brand-primary/10 text-brand-primary',
        success: 'bg-fb-green/10 text-fb-green',
        transparent: 'bg-transparent',
      },
      size: {
        xs: 'size-7 [&_svg]:size-4',
        sm: 'size-10 [&_svg]:size-5',
        md: 'size-14 [&_svg]:size-7',
        lg: 'size-16 [&_svg]:size-8',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  }
);

const TITLE_BY_SIZE = {
  xs: { variant: 'span', weight: 'medium' },
  sm: { variant: 'span', weight: 'bold' },
  md: { variant: 'lead', weight: 'bold' },
  lg: { variant: 'h3', weight: 'bold' },
} as const;

type StatusTone =
  | 'neutral'
  | 'muted'
  | 'error'
  | 'info'
  | 'success'
  | 'transparent';

const TONE_DEFAULT_ICON: Record<StatusTone, ReactNode> = {
  neutral: <Inbox aria-hidden="true" />,
  muted: <Inbox aria-hidden="true" />,
  error: <CircleAlert aria-hidden="true" />,
  info: <Info aria-hidden="true" />,
  success: <CircleCheck aria-hidden="true" />,
  transparent: null,
};

export interface StatusViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof containerVariants> {
  tone?: StatusTone;
  icon?: ReactNode;
  withIconHalo?: boolean;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  actionsOrientation?: 'inline' | 'stacked';
  retryLabel?: string;
  ref?: Ref<HTMLDivElement>;
  onRetry?: () => void;
}

const StatusView = ({
  tone = 'neutral',
  size,
  surface,
  icon,
  withIconHalo = true,
  title,
  description,
  actions,
  actionsOrientation = 'inline',
  retryLabel,
  className,
  ref,
  onRetry,
  ...props
}: StatusViewProps) => {
  const isError = tone === 'error';
  const isCompact = size === 'xs';
  const titleStyle = TITLE_BY_SIZE[size ?? 'md'];

  const resolvedIcon = icon === null ? null : (icon ?? TONE_DEFAULT_ICON[tone]);

  const resolvedActions =
    actions ??
    (onRetry && retryLabel ? (
      <Button
        variant="secondary"
        size="sm"
        rounded="full"
        leftSlot={<RefreshCw />}
        onClick={onRetry}
      >
        {retryLabel}
      </Button>
    ) : null);

  return (
    <div
      ref={ref}
      role={isError ? 'alert' : undefined}
      aria-live={isError ? 'assertive' : undefined}
      className={cn(containerVariants({ size, surface }), className)}
      {...props}
    >
      {resolvedIcon &&
        (withIconHalo ? (
          <span className={haloVariants({ tone, size })}>{resolvedIcon}</span>
        ) : (
          resolvedIcon
        ))}

      <div className="flex max-w-md flex-col items-center gap-1.5">
        <Typography
          variant={titleStyle.variant}
          weight={titleStyle.weight}
          textColor="primary"
          align="center"
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="p"
            textColor="secondary"
            align="center"
            className={
              isCompact
                ? 'text-balance text-xs leading-normal'
                : 'leading-relaxed'
            }
          >
            {description}
          </Typography>
        )}
      </div>

      {resolvedActions && (
        <div
          className={cn(
            'flex w-full max-w-xs',
            actionsOrientation === 'stacked'
              ? 'flex-col gap-3'
              : 'flex-row items-center justify-center gap-3'
          )}
        >
          {resolvedActions}
        </div>
      )}
    </div>
  );
};

StatusView.displayName = 'StatusView';

export { StatusView, containerVariants };
