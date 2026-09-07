import DOMPurify from 'dompurify';
import {
  ALLOWED_ATTR,
  ALLOWED_TAGS,
  renderMarkdown,
} from '@shared/markdown';

export {
  buildNoticePage,
  buildSharedPage,
  buildStandaloneHtml,
  getDocStats,
} from '@shared/markdown';

/** The browser half of the converter: DOMPurify over the page's own DOM. */
export function markdownToHtml(markdown: string): string {
  return renderMarkdown(markdown, (html) =>
    DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [...ALLOWED_TAGS],
      ALLOWED_ATTR: [...ALLOWED_ATTR],
    })
  );
}
