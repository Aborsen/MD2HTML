export function getMaskImage(
  orientation: 'vertical' | 'horizontal',
  size: number,
  hasScrollBefore: boolean,
  hasScrollAfter: boolean
): string {
  if (!hasScrollBefore && !hasScrollAfter) return '';

  const direction = orientation === 'vertical' ? 'to bottom' : 'to right';

  if (hasScrollBefore && hasScrollAfter) {
    return `linear-gradient(${direction}, transparent, black ${size}px, black calc(100% - ${size}px), transparent)`;
  }

  if (hasScrollBefore) {
    return `linear-gradient(${direction}, transparent, black ${size}px, black)`;
  }

  return `linear-gradient(${direction}, black, black calc(100% - ${size}px), transparent)`;
}
