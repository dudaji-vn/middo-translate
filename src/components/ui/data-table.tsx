"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/utils/cn"
import { Skeleton } from "./skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>
  rowProps?: React.TdHTMLAttributes<HTMLTableRowElement>
  headerProps?: React.HTMLAttributes<HTMLTableSectionElement>
  bodyProps?: React.HTMLAttributes<HTMLTableSectionElement>
  tableProps?: React.HTMLAttributes<HTMLTableElement>
  tableHeadProps?: React.ThHTMLAttributes<HTMLTableCellElement>
  loading?: boolean
  skeletonsRows?: number
}
interface SkeletonRowProps {
  columns: number;
  cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>;
  rowProps?: React.TdHTMLAttributes<HTMLTableRowElement>;
}

const SkeletonRow: React.FC<SkeletonRowProps> = ({ columns, cellProps, rowProps }) => {
  return (
    <TableRow {...rowProps}>
      {[...Array(columns)].map((_, index) => (
        <TableCell key={index} {...cellProps}>
            <Skeleton className="h-full min-h-[25px] w-11/12 rounded-none" />
        </TableCell>
      ))}
    </TableRow>
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
  loading,
  skeletonsRows,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table  {...tableProps} className={cn("border-none overflow-x-auto", tableProps?.className)}>
      <TableHeader {...headerProps} className={cn("bg-primary-100 border-none rounded-t-xl", headerProps?.className)} >
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}{...rowProps} className={cn("border-none", rowProps?.className)}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}  {...tableHeadProps}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody {...bodyProps}>
        {loading ? ( Array.from({ length: skeletonsRows || 5 }).map((_, index) => (
            <SkeletonRow key={index} columns={columns.length} cellProps={cellProps} rowProps={rowProps} />
          ))
        ) : (
          table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-none"
                {...rowProps}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} {...cellProps}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-none" {...rowProps}>
              <TableCell colSpan={columns.length} className="h-24 text-center" {...cellProps}>
                No results.
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>

  )
}
