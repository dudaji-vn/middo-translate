'use client';

import { PropsWithChildren, useState } from 'react';
import { Users2Icon, LayoutDashboard, MoreVertical } from 'lucide-react';
import { Button } from '@/components/actions/button';
import { ArrowBackOutline } from '@easy-eva-icons/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/data-display';
import { twMerge } from 'tailwind-merge';
import ButtonDataAction from '@/components/actions/button/button-data-action';

export interface VideoCallHeaderProps { }

export const VideoCallHeader = ({ }: VideoCallHeaderProps) => {
    const handleBack = () => { }
    const [isOpenMenuSelectLayout, setMenuSelectLayout] = useState(false);
    return (
        <header className='p-1 flex justify-between border-b border-neutral-50'>
            <div className='flex items-center'>
                <Button.Icon
                    variant="ghost"
                    color="default"
                    onClick={handleBack}
                    className="mr-1 max-w-9 max-h-9"
                >
                    <ArrowBackOutline className='w-5 h-5' />
                </Button.Icon>
                <span className='font-semibold'>Group name</span>
            </div>
            <div className='flex gap-2'>
                <ButtonDataAction>
                    <Users2Icon className='w-5 h-5 mr-2'/>
                    <span>4</span>
                </ButtonDataAction>
                <ButtonDataAction>01:00</ButtonDataAction>
                <DropdownMenu open={isOpenMenuSelectLayout} onOpenChange={()=>setMenuSelectLayout(prev=>!prev)}>
                    <DropdownMenuTrigger>
                    <ButtonDataAction>
                        <LayoutDashboard className='w-5 h-5 mr-2'/>
                        <span>View</span>
                    </ButtonDataAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
                        onClick={()=>setMenuSelectLayout(prev=>!prev)}
                    >
                        <div
                            className="flex items-center gap-2 p-4 active:!bg-background-darker active:!text-shading md:hover:bg-[#fafafa] md:hover:text-primary"
                        >
                            Layout 1
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu open={false} onOpenChange={()=>{}}>
                    <DropdownMenuTrigger>
                    <ButtonDataAction className='rounded-full px-2'>
                        <MoreVertical className='w-5 h-5'/>
                    </ButtonDataAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
                        onClick={()=>{}}
                    >
                        <div
                            className="flex items-center gap-2 p-4 active:!bg-background-darker active:!text-shading md:hover:bg-[#fafafa] md:hover:text-primary"
                        >
                            Layout 1
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
