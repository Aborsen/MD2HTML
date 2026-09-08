import type { TocItem } from '@/ui/components/TableOfContents';

/**
 * The headings of a rendered document, for its contents list.
 *
 * Read out of the HTML rather than out of the Markdown, because the ids belong to the renderer.
 * `shared/markdown.ts` slugifies each heading and prefixes it with `doc-` — deduplicating repeats
 * as it goes — and a second implementation here would drift the moment somebody wrote two sections
 * with the same name.
 *
 * Only h2.
 *
 * It took h3 as well at first, and on a comparison article that is fifteen tool names and six FAQ
 * questions — thirty entries, most of them truncated, scrolling inside their own box. A contents
 * list is for seeing the shape of a piece at a glance, and a list you have to scroll is not a
 * glance. The eight sections an article actually has fit without one.
 */
export function headingsFromHtml(html: string): TocItem[] {
  const items: TocItem[] = [];
  const pattern = /<h(2)\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;

  for (const match of html.matchAll(pattern)) {
    const title = match[3]
      // Headings can carry inline markup — code spans and links, mostly.
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    if (title) {
      items.push({
        id: match[2],
        title,
        level: match[1] === '3' ? 3 : 2,
      });
    }
  }

  return items;
}
