'use client'

import { FileDown } from 'lucide-react'
import React from 'react'

const DownloadButton = () => {
    return (
        <div className="w-fit relative cursor-pointer flex flex-row items-center text-primary-500-main  gap-2 rounded-xl bg-primary-200 px-3 py-1 active:!bg-primary-200 active:!text-shading md:hover:bg-neutral-100">
            <FileDown className="w-5 h-5" />
            <span>Export as CSV</span>
        </div>
    )
}

export default DownloadButton