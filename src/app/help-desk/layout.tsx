import { Typography } from '@/components/data-display'
import HelpDeskDropdownMenu from '@/components/layout/header/help-desk-dropdown-menu'
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data'
import { cn } from '@/utils/cn'
import Image from 'next/image'
import React from 'react'

const layout = ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <div className="full mx-auto flex h-full flex-col">
            <div
                className={cn(
                    'z-50 flex h-header  items-center gap-5 border-b border-neutral-50 bg-background py-4  pl-[1vw] pr-[5vw] md:pl-[5vw] w-full flex-row justify-between',
                )}
            >
                <div
                    className={cn(
                        'flex flex-row justify-start gap-2  items-center'
                    )}
                >
                    <Typography className={' ml-5 min-w-14 text-xs text-neutral-600'}>
                        Power by
                    </Typography>
                    <Image src="/logo.png" priority alt="logo" width={50} height={50} />
                </div>
                <HelpDeskDropdownMenu />
            </div>
            {children}
        </div>
    )
}

export default layout