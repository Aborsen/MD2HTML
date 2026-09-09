/*
 * The shape of `virtual:blog-index`, which `vite-plugin-blog.ts` generates at build time.
 *
 * Declared by hand because a virtual module has no file for TypeScript to read. It has to agree
 * with what the plugin emits and with `Article` in `src/lib/blog.ts` — minus the prose, which is
 * the whole point of the split.
 */
declare module 'virtual:blog-index' {
  /** Keyed by locale. A language with no translations yet is present and empty. */
  export const INDEX: Record<
    string,
    Array<{
      slug: string;
      title: string;
      description: string;
      date: string;
      updated?: string;
      tag: string;
      keywords: string[];
      readingMinutes: number;
    }>
  >;
}
