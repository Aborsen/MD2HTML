/** Left + right (siblings or boundaries). */
const PAGINATION_SIDES = 2;

/** Current page + left ellipsis + right ellipsis when both dots are shown. */
const MIN_MIDDLE_SLOTS = 3;

export type PaginationRangeItem = number | 'dots-left' | 'dots-right';

export interface RangeArgs {
  start: number;
  end: number;
}

export const isEllipsisItem = (
  item: PaginationRangeItem
): item is 'dots-left' | 'dots-right' => {
  return item === 'dots-left' || item === 'dots-right';
};

export const range = ({ start, end }: RangeArgs) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

export interface GetPaginationRangeArgs {
  currentPage: number;
  totalPages: number;
  siblingCount: number;
  boundaryCount: number;
}

export const getPaginationRange = ({
  currentPage,
  totalPages,
  siblingCount,
  boundaryCount,
}: GetPaginationRangeArgs): PaginationRangeItem[] => {
  const totalPageNumbers =
    siblingCount * PAGINATION_SIDES +
    MIN_MIDDLE_SLOTS +
    boundaryCount * PAGINATION_SIDES;

  if (totalPageNumbers >= totalPages) {
    return range({ start: 1, end: totalPages });
  }

  const leftSiblingIndex = Math.max(
    currentPage - siblingCount,
    boundaryCount + 1
  );
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPages - boundaryCount
  );

  const showLeftDots = leftSiblingIndex > boundaryCount + PAGINATION_SIDES;
  const showRightDots = rightSiblingIndex < totalPages - boundaryCount - 1;

  const leftBoundary = range({ start: 1, end: boundaryCount });
  const rightBoundary = range({
    start: totalPages - boundaryCount + 1,
    end: totalPages,
  });

  if (!showLeftDots && showRightDots) {
    const leftItemCount =
      siblingCount * PAGINATION_SIDES + boundaryCount + PAGINATION_SIDES;
    return [
      ...range({ start: 1, end: leftItemCount }),
      'dots-right',
      ...rightBoundary,
    ];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount =
      siblingCount * PAGINATION_SIDES + boundaryCount + PAGINATION_SIDES;
    return [
      ...leftBoundary,
      'dots-left',
      ...range({ start: totalPages - rightItemCount + 1, end: totalPages }),
    ];
  }

  if (showLeftDots && showRightDots) {
    return [
      ...leftBoundary,
      'dots-left',
      ...range({ start: leftSiblingIndex, end: rightSiblingIndex }),
      'dots-right',
      ...rightBoundary,
    ];
  }

  return range({ start: 1, end: totalPages });
};
