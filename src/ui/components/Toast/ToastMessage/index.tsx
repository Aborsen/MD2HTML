import { X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../Button';
import { IconButton } from '../../IconButton';
import { Typography } from '../../Typography';
import {
  TOAST_DEFAULT_DURATION,
  VARIANT_BG_MAP,
  VARIANT_BORDER_MAP,
  VARIANT_COLOR_MAP,
  VARIANT_ICON_MAP,
} from './constants';
import { ToastProgress } from './ToastProgress';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessageProps
  extends Omit<ComponentProps<'div'>, 'action'> {
  variant?: ToastVariant;
  message: ReactNode;
  description?: string;
  action?: ToastAction;
  icon?: ReactNode;
  duration?: number;
  onClose?: () => void;
}

export function ToastMessage({
  className,
  variant = 'info',
  message,
  description,
  action,
  icon,
  duration = TOAST_DEFAULT_DURATION,
  onClose,
  ...props
}: ToastMessageProps) {
  const showProgress = Number.isFinite(duration);

  const { icon: iconColor, progress: progressColor } =
    VARIANT_COLOR_MAP[variant];
  const IconComponent = VARIANT_ICON_MAP[variant];

  return (
    <div
      className={cn(
        'relative',
        'flex w-full flex-col gap-3',
        'overflow-hidden',
        'rounded-lg',
        'border',
        VARIANT_BORDER_MAP[variant],
        'p-4',
        VARIANT_BG_MAP[variant],
        'shadow-lg',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {icon ?? (
            <IconComponent
              className={cn('mb-auto size-5 shrink-0', iconColor)}
            />
          )}

          <div className="flex max-w-60 flex-col gap-0.5 text-left">
            <Typography
              variant="span"
              weight="medium"
              className="text-ink-primary"
            >
              {message}
            </Typography>
            {description && (
              <span className="text-ink-secondary text-xs leading-[1.4]">
                {description}
              </span>
            )}
          </div>
        </div>

        {onClose && (
          <IconButton
            variant="transparent"
            size="sm"
            className="mt-0.5 shrink-0 text-ink-body"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-4" />
          </IconButton>
        )}
      </div>

      {action && (
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            action.onClick();
            onClose?.();
          }}
        >
          {action.label}
        </Button>
      )}

      {showProgress && (
        <ToastProgress progressColor={progressColor} duration={duration} />
      )}
    </div>
  );
}

ToastMessage.displayName = 'ToastMessage';
