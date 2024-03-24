'use client'

import { Button } from '@/components/actions'
import { MiddlePaginationButtons } from '@/components/actions/pagination/middle-pagination'
import {
    Pagination,
    PaginationContent,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export type ClientPagination = {
    totalPage: number,
    limit: number,
    currentPage: number, 
    nextPage: number | null,
    previousPage: number | null,
    canNextPage: boolean,
    canPreviousPage: boolean
}
const ClientsPagination = ({ pagination, limitOptions, onLimitChange, onPageChange }: {
    limitOptions: number[],
    onPageChange: (page: number) => void,
    onLimitChange: (limit: number) => void,
    pagination: ClientPagination
}) => {
    const { limit, currentPage, nextPage, previousPage, canNextPage, canPreviousPage } = pagination;

    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            <Pagination>
                <PaginationContent className='gap-3'>
                    <div className='flex flex-row items-center'>
                        <p>Rows per page: {limit}</p>
                    </div>
                    <Button className='py-2' shape={'square'} variant={'ghost'} onClick={() =>  previousPage && onPageChange(previousPage)} disabled={!canPreviousPage}>
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                    <MiddlePaginationButtons pagination={pagination} onPageChange={onPageChange} />
                    <Button className='py-2' shape={'square'} variant={'ghost'} onClick={() => nextPage && onPageChange(nextPage)} disabled={!canNextPage}>
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ClientsPagination