export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.round(diff / 60_000);

  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} h ago`;
  }

  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

export function toHtmlFileName(markdownName: string): string {
  return `${markdownName.replace(/\.(md|markdown|mdown|mkd|txt)$/i, '')}.html`;
}

/** The document's own format: what the row shows, and what a download hands over. */
/** What a stored document can be handed over as. Markdown is what it is; the rest are made. */
export type DocFormat = 'md' | 'html' | 'txt';

export const FORMAT_LABELS: Record<DocFormat, string> = {
  html: 'HTML',
  md: 'Markdown',
  txt: 'Plain text',
};

export function toMarkdownFileName(name: string): string {
  return /\.(md|markdown|mdown|mkd|txt)$/i.test(name) ? name : `${name}.md`;
}

export function toTextFileName(name: string): string {
  return `${name.replace(/\.[^.]+$/, '')}.txt`;
}

export function toFileName(name: string, format: DocFormat): string {
  if (format === 'html') {
    return toHtmlFileName(name);
  }

  return format === 'txt' ? toTextFileName(name) : toMarkdownFileName(name);
}
