import { AnalyticsOptions, } from '@/features/chat/business/business.service'
import { cn } from '@/utils/cn'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import React from 'react'

const filterOptions: Record<AnalyticsOptions['type'], string> = {
    'custom': 'Custom',
    'last-month': 'Last month',
    'last-week': 'Last week',
    'last-year': 'Last year',
}

const ChartFilterDropdown = ({
    searchParams,
    ...props
}: {
    searchParams: {
        type: string
        custom: {
            fromDate: string
            toDate: string
        }
        search: string
    }
}) => {
    const {
        type,
        custom,
        search
    } = searchParams;

    return (
        <DropdownMenu {...props}>
            <DropdownMenuTrigger asChild>{type}</DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
            >
                {Object.entries(filterOptions).map(([key, value]) => {
                    return (
                        <Link
                            key={key}
                            href={`/business/statistics?type=${key}&search=${search}&custom.fromDate=${custom.fromDate}&custom.toDate=${custom.toDate}`}
                            className={cn(
                                'block px-4 py-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500',
                                {
                                    'bg-neutral-100 text-neutral-500': type === key
                                }
                            )}
                        >{value}
                        </Link>
                    )

                })}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ChartFilterDropdown