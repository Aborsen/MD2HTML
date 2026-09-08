/*
 * The shape of `virtual:blog-index`, which `vite-plugin-blog.ts` generates at build time.
 *
 * Declared by hand because a virtual module has no file for TypeScript to read. It has to agree
 * with what the plugin emits and with `Article` in `src/lib/blog.ts` — minus the prose, which is
 * the whole point of the split.
 */
declare module 'virtual:blog-index' {
  export const INDEX: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
    tag: string;
    keywords: string[];
    readingMinutes: number;
  }>;
}
