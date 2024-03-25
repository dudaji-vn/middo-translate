import { Typography } from '@/components/data-display'
import React from 'react'
import ChartFilterDropdown from './_components/report/report-chart/chart-filter-dropdown'

const StatisticLayout = ({ report, clients, children }: {
    report: JSX.Element,
    clients: JSX.Element,
    children: JSX.Element
}) => {
    return (
        <main className='flex flex-col gap-4 w-full p-4  overflow-x-hidden'>
            {children}
            <section className='space-y-4 w-full relative'>
                <Typography className=" flex flex-row items-center justify-between space-y-0  text-primary-500-main font-medium">
                    <span className="text-base font-normal">
                        Report
                    </span>
                    <ChartFilterDropdown />
                </Typography>
                {report}
            </section>
            {clients}
        </main>
    )
}

export default StatisticLayout