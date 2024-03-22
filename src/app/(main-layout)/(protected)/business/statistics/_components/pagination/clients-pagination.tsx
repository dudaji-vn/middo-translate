'use client'

import { Button } from '@/components/actions'
import { MiddlePaginationButtons } from '@/components/actions/pagination/middle-pagination'
import {
    Pagination,
    PaginationContent,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const SelectPerpage = () => {
    return 
}

const ClientsPagination = ({ pagination, limitOptions }: {
    limitOptions: number[],
    pagination: {
        totalPage: number,
        limit: number,
        currentPage: number,
        nextPage: number,
        previousPage: number,
        canNextPage: boolean,
        canPreviousPage: boolean
    }
}) => {
    const router = useRouter();
    const searchParams = useSearchParams()

    const onPageChange = (page: number) => {

        const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
        current.set('currentPage', String(page));
        router.push(`/business/statistics?${current.toString()}`)
    }

    return (
        <div className="flex items-center justify-center space-x-2 py-4">

            <Pagination>
                <PaginationContent className='gap-3'>  <div className='flex flex-row items-center'>
                    <p>Rows per page: {pagination.limit}</p>
                </div>
                    <Button className='py-2' shape={'square'} variant={'ghost'} onClick={() => onPageChange(pagination.previousPage)} disabled={!pagination.canPreviousPage}>
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                    </Button>
                    <MiddlePaginationButtons pagination={pagination} onPageChange={onPageChange} />
                    <Button className='py-2' shape={'square'} variant={'ghost'} onClick={() => onPageChange(pagination.nextPage)} disabled={!pagination.canNextPage}>
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ClientsPagination