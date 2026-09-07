import { mdDocTheme, MD_DOC_STYLE } from '@/lib/md-doc-css';
import { useTheme } from '@/lib/theme';
import { cn } from '@/ui/lib/utils';

interface DocumentPreviewProps {
  html: string;
  className?: string;
}

/**
 * Renders the converted fragment with exactly the stylesheet that ships inside the exported file,
 * so "preview" and "downloaded .html" always match — right down to the sheet's own background,
 * which follows the app theme in both places.
 */
export function DocumentPreview({ html, className }: DocumentPreviewProps) {
  const { theme } = useTheme();

  return (
    <>
      <style>{`${mdDocTheme(theme)}\n${MD_DOC_STYLE}`}</style>
      <div
        className={cn('md-doc', className)}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized with DOMPurify in markdownToHtml
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
