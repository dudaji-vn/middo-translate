'use client';

import { Button } from '@/components/actions';
import { MiddlePaginationButtons } from '@/components/actions/pagination/middle-pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { Pagination, PaginationContent } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export type ClientPagination = {
  totalPage: number;
  limit: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  canNextPage: boolean;
  canPreviousPage: boolean;
};
const ClientsPagination = ({
  pagination,
  limitOptions,
  onLimitChange,
  onPageChange,
}: {
  limitOptions: number[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pagination: ClientPagination;
}) => {
  const { limit, nextPage, previousPage, canNextPage, canPreviousPage } =
    pagination;

  return (
    <div className="flex w-full items-center justify-center space-x-2 py-4">
      <Pagination className="w-full">
        <PaginationContent className="gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <DropdownMenuLabel className="font-normal">
                Items per page: <span className="font-medium">{limit}</span>
              </DropdownMenuLabel>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {limitOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onSelect={() => onLimitChange(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="py-2"
            shape={'square'}
            variant={'ghost'}
            onClick={() => previousPage && onPageChange(previousPage)}
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="max-md:hidden">Previous</span>
          </Button>
          <MiddlePaginationButtons
            className="flex items-center gap-1 max-md:hidden"
            pagination={pagination}
            onPageChange={onPageChange}
          />
          <Button
            className="py-2"
            shape={'square'}
            variant={'ghost'}
            onClick={() => nextPage && onPageChange(nextPage)}
            disabled={!canNextPage}
          >
            <span className="max-md:hidden">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ClientsPagination;
