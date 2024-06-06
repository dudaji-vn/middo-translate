'use client';

import { Button } from '@/components/actions';
import { MiddlePaginationButtons } from '@/components/actions/pagination/middle-pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { Pagination, PaginationContent } from '@/components/ui/pagination';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export type ScriptPagination = {
  totalPage: number;
  limit: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  canNextPage: boolean;
  canPreviousPage: boolean;
};
const ScriptsPagination = ({
  pagination,
  limitOptions,
  onLimitChange,
  onPageChange,
}: {
  limitOptions: number[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pagination: ScriptPagination;
}) => {
  const { t } = useTranslation('common');
  const { limit, nextPage, previousPage, canNextPage, canPreviousPage } =
    pagination;

  return (
    <div className="flex w-full items-center justify-center space-x-2 py-4">
      <Pagination className="w-full">
        <PaginationContent className="gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                size={'xs'}
                variant={'ghost'}
                color={'default'}
                shape={'square'}
                className="flex flex-row items-center gap-1 font-normal "
                endIcon={<ChevronDown className="h-4 w-4" />}
              >
                <span className="max-md:hidden">
                  {t('PAGINATION.ITEMS_PER_PAGE')}&nbsp;
                </span>
                <span className="flex flex-row items-center gap-1 font-medium ">
                  {limit}
                </span>
              </Button>
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
            <span className="max-md:hidden">{t('PAGINATION.PREV')}</span>
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
            <span className="max-md:hidden">{t('PAGINATION.NEXT')}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ScriptsPagination;
