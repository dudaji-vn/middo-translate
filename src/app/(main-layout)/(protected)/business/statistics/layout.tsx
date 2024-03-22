import { Typography } from '@/components/data-display'
import React from 'react'
import ChartFilterDropdown from './_components/report-chart/chart-filter-dropdown'
import TableSearch from './_components/clients-table/table-search'
import DownloadButton from './_components/clients-table/download-button'

const StatisticLayout = ({ report, clients, children }: {
    report: JSX.Element,
    clients: JSX.Element,
    children: JSX.Element
}) => {
    return (
        <main className='flex flex-col gap-4 w-full p-4'>
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
            <section className='space-y-4 w-full relative'>
                <div className="md:grid-cols-[20%_50%_30%] xl:grid-cols-[10%_70%_20%] grid-cols-6 grid items-center gap-4  font-medium w-full ">
                    <span className="text-base font-normal max-md:col-span-6 text-primary-500-main">
                        Clients List
                    </span>
                    <div className='max-md:col-span-5'>
                        <TableSearch className='py-2 w-full' />
                    </div>
                    <div className='max-md:col-span-1'>
                        <DownloadButton />
                    </div>
                </div>
                {clients}
            </section>
        </main>
    )
}

export default StatisticLayout