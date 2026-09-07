import { MD_DOC_STYLE, MD_DOC_THEME } from '@/lib/md-doc-css';
import { cn } from '@/ui/lib/utils';

interface DocumentPreviewProps {
  html: string;
  className?: string;
}

/**
 * Renders the converted fragment with exactly the stylesheet that ships inside
 * the exported file, so "preview" and "downloaded .html" always match — right
 * down to the sheet's own background, which the stylesheet paints.
 */
export function DocumentPreview({ html, className }: DocumentPreviewProps) {
  return (
    <>
      <style>{`${MD_DOC_THEME}\n${MD_DOC_STYLE}`}</style>
      <div
        className={cn('md-doc', className)}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized with DOMPurify in markdownToHtml
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
