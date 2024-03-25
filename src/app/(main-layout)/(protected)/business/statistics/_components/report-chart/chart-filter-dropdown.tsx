'use client'

import { Button } from '@/components/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/data-display'
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/utils/cn'
import { addDays, format } from 'date-fns'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'


export type AnalyticsType = 'last-week' | 'last-month' | 'last-year' | 'custom';
export const analyticsType = ['last-week', 'last-month', 'last-year', 'custom'];
export type AnalyticsOptions = {
    type: AnalyticsType;
} & (
        | {
            type: 'custom';
            custom: {
                fromDate: string;
                toDate: string;
            };
        }
        | {
            type: Exclude<'last-week' | 'last-month' | 'last-year', 'custom'>;
            custom?: never;
        }
    );
const filterOptions: Record<AnalyticsOptions['type'], string> = {
    'custom': 'Custom',
    'last-month': 'Last month',
    'last-week': 'Last week',
    'last-year': 'Last year',
}
const defaultOption = 'last-week'
const generateHref = (type: AnalyticsType, custom: { fromDate: string, toDate: string }, search: string) => {
    if (!filterOptions[type]) {
        return null;
    }
    if (type === 'custom' && custom.fromDate && !custom.toDate) {
        return `/business/statistics?${new URLSearchParams({
            type: type || defaultOption,
            fromDate: custom.fromDate,
            toDate: custom.toDate,
            search: search || ''
        }).toString()}`
    } else if (type !== 'custom') {
        return `/business/statistics?${new URLSearchParams({
            type,
            search: search || ''
        }).toString()}`
    }
    return null;

}
export type ChartFilterDropdownProps = {
    // searchParams: {
    //     type: string
    //     fromDate: string
    //     toDate: string
    //     search: string
    // }
}
const ChartFilterDropdown = ({
    // searchParams,
    ...props
}: ChartFilterDropdownProps) => {
    const searchParams = useSearchParams()
    const type = searchParams?.get('type')
    const fromDate = searchParams?.get('fromDate') || ''
    const toDate = searchParams?.get('toDate') || ''
    const search = searchParams?.get('search') || ''

    const [openDropdown, setOpenDropdown] = useState(false);
    const [openDatePickerModal, setOpenDatePickerModal] = useState(false);
    const router = useRouter()

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: fromDate ? new Date(fromDate) : addDays(new Date(), -7),
        to: toDate ? new Date(toDate) : new Date(),
    })

  const current = new URLSearchParams(Array.from(searchParams?.entries() || []));

    const onConfirmRangeFilter = () => {
        current.set('fromDate', format(date?.from || new Date(), 'yyyy-MM-dd'));
        current.set('toDate', format(date?.to || new Date(), 'yyyy-MM-dd'));
        current.set('type', 'custom');
        const href = `/business/statistics?${current.toString()}`
        router.push(href)
        setOpenDatePickerModal(false)
    }


    return (<>
        <DropdownMenu onOpenChange={setOpenDropdown} open={openDropdown}>
            <DropdownMenuTrigger asChild onClick={() => {
                setOpenDropdown(prev => !prev)
            }}>
                <div className="relative flex flex-row items-center text-neutral-800  gap-2 rounded-xl bg-neutral-50 px-3 py-1 active:!bg-neutral-200 active:!text-shading md:hover:bg-neutral-100">
                    <span>{filterOptions[(type || defaultOption) as AnalyticsType]}</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3 "
                onClick={() => setOpenDropdown(false)}
            >
                {Object.entries(filterOptions).map(([key, value]) => {
                    const href = generateHref(key as AnalyticsType, { fromDate, toDate }, search) || '#';
                    if (key === 'custom')
                        return <DropdownMenuItem className=" rounded-none  block px-4 py-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500  outline-none" onClick={() => {
                            setOpenDatePickerModal(true)
                        }}>
                            Custom
                        </DropdownMenuItem>
                    return (
                        <Link
                            key={key}
                            href={href}
                            className={cn(
                                'block text-neutral-400 ',
                                {
                                    'bg-neutral-100 text-neutral-500': type === key
                                }
                            )}
                        >  <DropdownMenuItem className="flex rounded-none items-center outline-none">
                                {value}
                            </DropdownMenuItem>
                        </Link>
                    )
                })}

            </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmAlertModal
            title="Pick a date range"
            titleProps={{
                className: 'mx-auto'
            }}
            open={openDatePickerModal}
            onOpenChange={setOpenDatePickerModal}
            dialogContentProps={{
                className: 'w-full md:max-w-screen-md max-md:w-full max-md:h-[90vh] overflow-y-auto'
            }}
            footerProps={{
                className: 'hidden'
            }}
            onCancel={() => setOpenDatePickerModal(false)}
            onConfirm={onConfirmRangeFilter}

        >
            <div className='mx-auto flex flex-col items-center'>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                    date.to ? (
                        <div className='flex text-primary-600'>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                        </div>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                ) : (
                    <span>Pick a date</span>
                )}
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
            </div>
            <div className='flex justify-end px-4'>
                <Button
                    className='w-28 h-11'
                    size={'xs'}

                    onClick={onConfirmRangeFilter}
                >
                    Apply
                </Button>
            </div>
        </ConfirmAlertModal>
    </>
    )
}

export default ChartFilterDropdown