'use client'

import { Button } from '@/components/actions'
import { exportToExcel } from '@/utils/export'
import { FileDown } from 'lucide-react'
import moment from 'moment'
import React from 'react'

const DownloadButton = ({ data }: { data: any }) => {

    return (
        <Button onClick={() =>
            exportToExcel({ data, fileName: `Middo Clients ${moment().format('DD/MM/YYYY-hh:mm')}` })
        }
            className="w-fit relative cursor-pointer z-20 flex flex-row items-center text-primary-500-main  gap-2 rounded-xl bg-primary-200 px-3 py-1 active:!bg-primary-200 active:!text-shading md:hover:bg-neutral-100">
            <FileDown className="w-5 h-5 max-md:my-[6px] mx-1" />
            <span className='max-md:hidden'>Export as CSV</span>
        </Button>
    )
}

export default DownloadButton