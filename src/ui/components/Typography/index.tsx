import { cva, type VariantProps } from 'class-variance-authority';
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  PropsWithChildren,
  ReactNode,
  Ref,
} from 'react';
import { cn } from '../../lib/utils';

const typographyVariants = cva(null, {
  variants: {
    variant: {
      h1: 'scroll-m-20 font-medium text-3xl md:text-4xl',
      h2: 'scroll-m-20 font-medium text-2xl md:text-3xl',
      h3: 'texl-xl scroll-m-20 font-medium md:text-2xl',
      h4: 'scroll-m-20 font-medium text-lg md:text-xl',
      h5: 'scroll-m-20 font-medium text-base md:text-lg',
      h6: 'scroll-m-20 font-medium text-sm md:text-base',
      p: 'font-normal text-sm',
      div: 'font-normal text-base',
      span: 'font-medium text-sm',
      blockquote: 'font-medium italic',
      code: 'font-mono font-semibold',
      lead: 'font-semibold text-xl',
      large: 'font-semibold text-lg',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
    textColor: {
      primary: 'text-ink-primary',
      secondary: 'text-ink-secondary',
      light: 'text-ink-inactive',
      body: 'text-ink-body',
      accent: 'text-brand-primary',
      success: 'text-fb-green',
      destructive: 'text-fb-red-text',
      warning: 'text-fb-attention',
      white: 'text-content-on-solid',
      inherit: 'text-inherit',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    noWrap: {
      true: 'whitespace-nowrap',
      false: null,
    },
    weight: {
      light: 'font-light', //300
      normal: 'font-normal', //400
      medium: 'font-medium', //500
      semibold: 'font-semibold', //600
      bold: 'font-bold', //700
      extrabold: 'font-extrabold', //800
      black: 'font-black', //900
    },
    underline: {
      true: 'underline',
      false: null,
    },
    lineThrough: {
      true: 'line-through',
      false: null,
    },
    overline: {
      true: 'overline',
      false: null,
    },
  },
  defaultVariants: {
    variant: 'p',
    textColor: 'primary',
    align: 'left',
    noWrap: false,
  },
});

type TypographyElementVariants = NonNullable<
  VariantProps<typeof typographyVariants>['variant']
>;

/**
 * Maps variant keys to their standard HTML semantic tags.
 */
const variantElementMap: Record<TypographyElementVariants, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  span: 'span',
  div: 'div',
  blockquote: 'blockquote',
  code: 'code',
  lead: 'p',
  large: 'div',
};

type TypographyStyleProps = VariantProps<typeof typographyVariants>;

export type TypographyProps<E extends ElementType = 'p'> =
  TypographyStyleProps & {
    element?: E;
    ref?: Ref<ComponentRef<E>>;
    children?: ReactNode;
  } & Omit<ComponentPropsWithoutRef<E>, 'children' | 'color' | 'ref'>;

/*
 * A flexible typography component that supports semantic HTML tags and
 * consistent design system styles for text, headings, and specialized blocks.
 * It allows overriding the semantic element independently of the visual variant.
 */
export function Typography<E extends ElementType = 'p'>({
  className,
  variant,
  align,
  noWrap,
  textColor,
  element,
  underline,
  overline,
  lineThrough,
  leading,
  weight,
  ref,
  ...props
}: PropsWithChildren<TypographyProps<E>>) {
  const Component = element || (variant ? variantElementMap[variant] : 'p');

  return (
    <Component
      ref={ref}
      className={cn(
        typographyVariants({
          variant,
          align,
          noWrap,
          textColor,
          weight,
          lineThrough,
          underline,
          overline,
          leading,
          className,
        })
      )}
      {...(props as ComponentPropsWithoutRef<E>)}
    />
  );
}
