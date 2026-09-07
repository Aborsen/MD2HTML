import {
  CheckCircle2,
  Info,
  type LucideIcon,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import type { ToastVariant } from '.';

export const TOAST_DEFAULT_DURATION = 4000;

export const TOAST_DEFAULT_POSITION = 'top-right';

export const VARIANT_COLOR_MAP: Record<
  ToastVariant,
  { icon: string; progress: string }
> = {
  success: { icon: 'text-fb-green', progress: 'bg-fb-green' },
  info: { icon: 'text-brand-primary', progress: 'bg-brand-primary' },
  warning: { icon: 'text-fb-attention', progress: 'bg-fb-attention' },
  error: { icon: 'text-fb-red-text', progress: 'bg-fb-red-text' },
};

export const VARIANT_ICON_MAP: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  error: XCircle,
};

export const VARIANT_BG_MAP: Record<ToastVariant, string> = {
  success: 'bg-toast-bg-success',
  info: 'bg-toast-bg-info',
  warning: 'bg-toast-bg-warning',
  error: 'bg-toast-bg-error',
};

export const VARIANT_BORDER_MAP: Record<ToastVariant, string> = {
  success: 'border-toast-border-success',
  info: 'border-toast-border-info',
  warning: 'border-toast-border-warning',
  error: 'border-toast-border-error',
};
