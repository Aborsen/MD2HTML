import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import uiConfig from './tailwind.ui.config';

/**
 * The design-system preset (`tailwind.ui.config.ts`) is extended 1:1 —
 * only `content` is widened to cover the app sources.
 */
const config: Config = {
  ...uiConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [...(uiConfig.plugins ?? []), animate],
};

export default config;
