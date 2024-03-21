'use client'

import { Button } from '@/components/actions'
import { FileDown } from 'lucide-react'
import React from 'react'

const DownloadButton = () => {
    return (
        <Button className="w-fit relative cursor-pointer h- flex flex-row items-center text-primary-500-main  gap-2 rounded-xl bg-primary-200 px-3 py-1 active:!bg-primary-200 active:!text-shading md:hover:bg-neutral-100">
            <FileDown className="w-5 h-5" />
            <span className='max-md:hidden'>Export as CSV</span>
        </Button>
    )
}

export default DownloadButton