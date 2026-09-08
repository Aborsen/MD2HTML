import {
  mdArticleSurface,
  mdDocTheme,
  MD_DOC_STYLE,
  MD_PREVIEW_STYLE,
} from '@shared/md-doc-css';
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
      {/* The frame around the sheet paints the page background, so it needs the palette too. */}
      <style>{`${mdDocTheme(theme, '.md-doc, .md-sheet, .md-preview-frame')}\n${MD_DOC_STYLE}\n${MD_PREVIEW_STYLE}\n${mdArticleSurface(theme)}`}</style>

      <div className={cn('md-sheet', className)}>
        <div
          className="md-doc"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized with DOMPurify in markdownToHtml
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );
}
