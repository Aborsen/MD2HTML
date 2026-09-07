import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import { THEME_COLORS } from './src/ui/lib/constants';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: THEME_COLORS,
      aria: {
        invalid: 'invalid="true"',
      },
      opacity: {
        disabled: 'var(--opacity-disabled)',
      },
      boxShadow: {
        rest: 'var(--shadow-rest)',
        'card-hover': 'var(--shadow-card-hover)',
        dropdown: 'var(--shadow-dropdown)',
        'segctrl-hover': 'var(--segctrl-hover-shadow)',
        'segctrl-active': 'var(--segctrl-active-shadow)',
        'lift-hover': 'var(--shadow-lift-hover)',
        'overlay-soft': 'var(--shadow-overlay-soft)',
        menu: 'var(--shadow-menu)',
        'banner-ic': 'var(--banner-ic-shadow)',
        'banner-grad-ic': 'var(--banner-grad-ic-shadow)',
      },
      fontSize: {
        xxs: '0.625rem',
        compact: '0.8125rem',
        ...defaultTheme.fontSize,
      },
      fontFamily: {
        sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        'content-narrow': 'var(--content-max-narrow)',
        'content-wide': 'var(--content-max-wide)',
        content: 'var(--content-max-width)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
        slow: 'var(--motion-slow)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        'skeleton-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'skeleton-shimmer': 'skeleton-shimmer 1.5s infinite ease-in-out',
      },
      backgroundImage: {
        'skeleton-shimmer':
          'linear-gradient(90deg, transparent 0%, transparent 30%, hsl(var(--brand-primary) / 0.1) 50%, transparent 70%, transparent 100%)',
        'primary-gradient':
          'linear-gradient(90deg, hsl(var(--brand-primary)) 50%, hsl(var(--brand-secondary)) 120.71%)',
        'chat-shell': 'var(--chat-shell-bg)',
        'chat-glow':
          'radial-gradient(ellipse 55vw 45vh at 50% 50%, var(--chat-glow-fill), transparent 65%)',
        'banner-grad-horizontal-wide': 'var(--banner-grad-horizontal-wide)',
        'banner-grad-diagonal-airy': 'var(--banner-grad-diagonal-airy)',
        'banner-grad-diagonal-fade': 'var(--banner-grad-diagonal-fade)',
        'banner-grad-horizontal-slab': 'var(--banner-grad-horizontal-slab)',
      },
    },
  },
  plugins: [
    // `pressed:` — actively pressed OR held open as an expanded trigger
    // (popover/dropdown/select triggers set aria-expanded; tooltips don't, so
    // a wrapping TooltipTrigger can't clobber it the way data-state gets
    // clobbered). Variant recipes write one `pressed:` utility instead of
    // duplicating aria-expanded rules; the `:hover` form keeps the pressed
    // fill while hovering an open trigger (out-specifies plain `hover:`).
    plugin(({ addVariant }) => {
      addVariant('pressed', [
        '&:active',
        '&[aria-expanded="true"]',
        '&[aria-expanded="true"]:hover',
      ]);
    }),
  ],
};

export default config;
