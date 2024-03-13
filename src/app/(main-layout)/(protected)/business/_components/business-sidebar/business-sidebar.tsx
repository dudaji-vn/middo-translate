'use client'

import { Button } from "@/components/actions"
import { Typography } from "@/components/data-display"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/navigation"
import { useAppStore } from "@/stores/app.store"
import { cn } from "@/utils/cn"
import { Archive, CheckSquare, LineChartIcon, MessageSquare, Settings } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface SidebarContent {
    title: string
    icon: React.ReactNode
}

const sidebarContents = [
    {
        title: 'conversations',
        icon: <MessageSquare />,
    },
    {
        title: 'completed',
        icon: <CheckSquare />,
    },
    {
        title: 'archived',
        icon: <Archive />,
    },
    {
        title: 'statistics',
        icon: <LineChartIcon />
    },
    {
        title: 'settings',
        icon: <Settings />,
    },
]
const BusinessSidebarContent = ({ shrink, onSelectChange, selectedItem, notifications }: {
    shrink: boolean
    selectedItem?: {
        title: string
        icon: React.ReactNode
    }
    onSelectChange: (item: { title: string, icon: React.ReactNode }) => void,
    notifications?: { [key: string]: number }
}) => {
    return (
        <div className="flex flex-col items-start w-fit justify-start">
            {sidebarContents.map(({ icon, title }, index) => {
                const isSelected = selectedItem?.title === title;
                return (
                    <Button shape={'square'} variant={'ghost'} color={'default'} key={index} className={cn("flex w-full justify-start flex-row items-center text-left rounded-none p-5 gap-2 [&_svg]:w-5 [&_svg]:h-5 transition-all hover:bg-primary-300 duration-200",
                        isSelected ? 'bg-primary-500-main hover:!bg-primary-500-main [&_svg]:stroke-white' : 'hover:bg-primary-300',
                        
                    )}
                        onClick={() => onSelectChange({ icon, title })}
                    >
                        {icon}
                        <Typography className={cn(shrink ? 'md:invisible  transition ease-in-out scale-y-0 w-0 duration-200' : 'transition ease-in-out duration-300 capitalize', isSelected ? 'text-white ' : 'text-neutral-600')}>
                            {title}
                        </Typography>
                        {notifications?.[title] && notifications[title] > 0 && (
                            <div className="w-3 h-3 bg-primary-500-main rounded-full flex justify-center items-center">
                                <Typography className="text-white">
                                    {notifications[title]}
                                </Typography>
                            </div>
                        )}
                    </Button>
                )
            })}
        </div>
    )
}

const BusinessSidebar = () => {
    const { isMobile } = useAppStore()
    const [open, setOpen] = useState(false);
    const params = useParams()
    const [sellected, setSellected] = useState<SidebarContent | undefined>(sidebarContents.find(item => item.title === params?.conversationType) || undefined);
    const router = useRouter();
    const openSheet = () => {
        setOpen(true);
    }
    const closeSheet = () => {
        setOpen(false);
    }
    const onSelectedChange = (item: { title: string, icon: React.ReactNode }) => {
        setSellected(item)
        router.push('/business/' + item.title)
    }

    return (
        <Sheet open={!isMobile} modal={false} >
            <div className={cn("h-full w-full relative max-md:hidden",  )}onMouseEnter={openSheet}  >
                <SheetContent side={'left'} className="w-fit bottom-0 top-[51px] p-0 backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                    <div className="h-full  w-full" onMouseLeave={closeSheet}>
                        <BusinessSidebarContent shrink={!open} selectedItem={sellected} onSelectChange={onSelectedChange} />
                    </div>
                </SheetContent>
            </div>
        </Sheet>

    )
}

export default BusinessSidebar