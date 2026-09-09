import type { Translate } from './i18n/context';

export interface MergePart {
  name: string;
  markdown: string;
}

/**
 * Chains several documents into one.
 *
 * The parts are joined in the order they are given, separated by a horizontal rule — a boundary a
 * reader can see, and one that survives the round trip through HTML. Nothing is injected into the
 * text itself: a heading per file would collide with the heading the file usually already has, and
 * would then show up in the merged document as a duplicate title.
 */
export function mergeMarkdown(parts: MergePart[]): string {
  return parts
    .map((part) => part.markdown.trim())
    .filter(Boolean)
    .join('\n\n---\n\n');
}

/**
 * "notes.md + 2 more" — short enough for a row, specific enough to recognise.
 *
 * The words come from the caller, because this is a module and not a component: `t` is handed in
 * rather than fetched from a hook that only exists inside one. The two names that are not words —
 * one file's own name, and `merged.md` for a merge of nothing — stay here.
 */
export function mergedName(names: string[], t: Translate): string {
  if (names.length === 0) {
    return 'merged.md';
  }

  if (names.length === 1) {
    return names[0];
  }

  return t('common.merged.name', {
    first: names[0],
    count: names.length - 1,
  });
}
