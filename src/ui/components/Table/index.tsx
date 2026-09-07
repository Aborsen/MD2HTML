'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { TableBody } from './TableBody';
import { TableCaption } from './TableCaption';
import { TableCell } from './TableCell';
import { TableFooter } from './TableFooter';
import type { TableSortDirection } from './TableHead';
import { TableHead } from './TableHead';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

function Table({
  className,
  wrapperClassName,
  ...props
}: ComponentProps<'table'> & { wrapperClassName?: string }) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        'relative w-full overflow-x-auto rounded-md border border-stroke bg-surface-card',
        wrapperClassName
      )}
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  type TableSortDirection,
};
