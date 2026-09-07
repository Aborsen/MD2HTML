import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

const BANNER_ROOT_LAYOUT = cn(
  'group/banner flex items-center gap-5 rounded-xl',
  'max-[880px]:flex-col max-[880px]:items-start max-[880px]:gap-3.5',
  'px-6 py-[1.625rem]',
  'max-[880px]:px-5 max-[880px]:py-5',
  'max-[600px]:p-4'
);

const ICON_BASE = cn(
  'box-border overflow-visible',
  'flex shrink-0 items-center justify-center',
  'size-[3.75rem]',
  '[&_svg]:size-7',
  'max-[880px]:size-11',
  'max-[880px]:[&_svg]:size-[22px]'
);

const ACTION_LAYOUT = cn(
  'shrink-0 max-[880px]:flex max-[880px]:w-full',
  'max-[880px]:[&_button]:max-w-48 max-[880px]:[&_button]:flex-1',
  'max-[880px]:[&_button]:justify-center',
  'max-[600px]:[&_button]:max-w-none'
);

const GRADIENT_PRIMARY_ACTION = cn(
  '[&_button]:border-transparent',
  '[&_button]:bg-banner-grad-text',
  '[&_button]:text-banner-grad-btn-text',
  '[&_button:hover]:bg-banner-grad-sub',
  '[&_button:hover]:text-banner-grad-btn-text',
  '[&_button:active]:bg-banner-grad-sub',
  '[&_button:active]:text-banner-grad-btn-text'
);

const bannerVariants = cva(BANNER_ROOT_LAYOUT, {
  variants: {
    variant: {
      default: cn('border border-stroke bg-surface-card'),
      horizontalWide: cn('border-none', 'bg-banner-grad-horizontal-wide'),
      diagonalAiry: cn('border-none', 'bg-banner-grad-diagonal-airy'),
      diagonalFade: cn('border-none', 'bg-banner-grad-diagonal-fade'),
      horizontalSlab: cn('border-none', 'bg-banner-grad-horizontal-slab'),
    },
    size: {
      default: '',
      sm: cn(
        'px-5 py-4',
        '[&_[data-slot=banner-icon]]:size-10',
        '[&_[data-slot=banner-icon]:not([data-gradient-icon])]:rounded-full',
        '[&_[data-slot=banner-icon]_svg]:size-5',
        '[&_[data-slot=banner-title]]:text-sm',
        '[&_[data-slot=banner-title]]:leading-5',
        '[&_[data-slot=banner-action]]:gap-2'
      ),
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface BannerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title: string;
  description?: ReactNode;
  descriptionClassName?: string;
  titleClassName?: string;
  icon?: ReactNode;
  iconClassName?: string;
  action?: ReactNode;
  actionClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

const Banner = ({
  title,
  description,
  descriptionClassName,
  titleClassName,
  icon,
  iconClassName,
  action,
  actionClassName,
  variant = 'default',
  size,
  className,
  ref,
  ...props
}: BannerProps) => {
  const resolvedVariant = variant ?? 'default';

  return (
    <div
      ref={ref}
      className={cn(
        bannerVariants({ variant: resolvedVariant, size }),
        className
      )}
      {...props}
    >
      {icon && (
        <div
          data-slot="banner-icon"
          className={cn(
            'rounded-full border-[1.5px] border-banner-grad-ic-border border-solid',
            'bg-banner-grad-ic-bg text-banner-grad-text',
            'shadow-banner-grad-ic',
            ICON_BASE,
            iconClassName
          )}
        >
          {icon}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Typography
          data-slot="banner-title"
          variant="h6"
          weight="semibold"
          className={cn(
            'm-0 text-base',
            'text-banner-grad-text',
            titleClassName
          )}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="p"
            weight="normal"
            className={cn(
              'max-w-[39.5rem] leading-normal',
              'text-banner-grad-sub [&_b]:font-semibold [&_b]:text-banner-grad-text',
              descriptionClassName
            )}
          >
            {description}
          </Typography>
        )}
      </div>

      {action && (
        <div
          data-slot="banner-action"
          className={cn(
            ACTION_LAYOUT,
            (resolvedVariant === 'horizontalWide' ||
              resolvedVariant === 'diagonalAiry') &&
              GRADIENT_PRIMARY_ACTION,
            actionClassName
          )}
        >
          {action}
        </div>
      )}
    </div>
  );
};

Banner.displayName = 'Banner';

export { Banner, bannerVariants };
