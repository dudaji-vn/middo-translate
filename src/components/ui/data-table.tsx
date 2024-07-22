'use client';

import {
  ColumnDef,
  TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { Skeleton } from './skeleton';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>;
  rowProps?: React.TdHTMLAttributes<HTMLTableRowElement>;
  headerProps?: React.HTMLAttributes<HTMLTableSectionElement>;
  bodyProps?: React.HTMLAttributes<HTMLTableSectionElement>;
  tableProps?: React.HTMLAttributes<HTMLTableElement>;
  tableHeadProps?: React.ThHTMLAttributes<HTMLTableCellElement>;
  loading?: boolean;
  skeletonsRows?: number;
  dividerRow?: boolean;
  dividerCol?: boolean;
  dividerRowProps?: React.HTMLAttributes<HTMLDivElement>;
  dividerColProps?: React.HTMLAttributes<HTMLDivElement>;
  dividerProps?: React.HTMLAttributes<HTMLDivElement>;

  tableInitialParams?: Partial<TableOptions<TData>>;
  customEmpty?: React.ReactNode;
}
interface SkeletonRowProps {
  columns: number;
  cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>;
  rowProps?: React.TdHTMLAttributes<HTMLTableRowElement>;
}

const SkeletonRow: React.FC<SkeletonRowProps> = ({
  columns,
  cellProps,
  rowProps,
}) => {
  return (
    <>
      <TableRow {...rowProps}>
        {[...Array(columns)].map((_, index) => (
          <TableCell key={index} {...cellProps}>
            <Skeleton className="h-full min-h-[25px] w-11/12 rounded-none dark:bg-neutral-900" />
          </TableCell>
        ))}
      </TableRow>
      <div
        key={Date.now()}
        className="h-2 w-full bg-white dark:bg-background"
      />
    </>
  );
};
export function DataTable<TData, TValue>({
  columns,
  data,
  cellProps,
  headerProps,
  bodyProps,
  rowProps,
  tableProps,
  tableHeadProps,
  dividerRow,
  dividerCol,
  dividerColProps,
  dividerRowProps,
  dividerProps,
  loading,
  skeletonsRows,
  tableInitialParams,
  customEmpty,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableInitialParams,
  });
  const { t } = useTranslation('common');
  return (
    <Table
      {...tableProps}
      className={cn('overflow-x-auto border-none', tableProps?.className)}
    >
      <TableHeader
        {...headerProps}
        className={cn(
          'rounded-t-xl border-none bg-primary-100',
          headerProps?.className,
        )}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            {...rowProps}
            className={cn('border-none ', rowProps?.className)}
          >
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  {...tableHeadProps}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'flex cursor-pointer select-none flex-row items-center gap-2 text-neutral-800 dark:text-neutral-50'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: (
                          <ChevronUp
                            size={20}
                            className="text-neutral-700 dark:text-neutral-50"
                          />
                        ),
                        desc: (
                          <ChevronDown
                            size={20}
                            className="text-neutral-700 dark:text-neutral-50"
                          />
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              );
            })}
            {/* {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} {...tableHeadProps}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })} */}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody {...bodyProps}>
        {loading ? (
          Array.from({ length: skeletonsRows || 5 }).map((_, index) => (
            <SkeletonRow
              key={index}
              columns={columns.length}
              cellProps={cellProps}
              rowProps={rowProps}
            />
          ))
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <>
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="border-none "
                {...rowProps}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} {...cellProps}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {dividerRow && (
                <div
                  className="h-2 w-full bg-white dark:bg-background"
                  {...dividerProps}
                  {...dividerRowProps}
                />
              )}
            </>
          ))
        ) : (
          <TableRow className="border-none" {...rowProps}>
            <TableCell
              colSpan={columns.length}
              {...cellProps}
              className={cn(
                cellProps?.className,
                'mx-auto  border-none  text-center text-neutral-800',
              )}
            >
              {customEmpty || t('COMMON.NO_DATA')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
