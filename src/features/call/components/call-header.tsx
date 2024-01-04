'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { Users2Icon, LayoutDashboard, MoreVertical, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/actions/button';
import { ArrowBackOutline } from '@easy-eva-icons/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/data-display';
import { twMerge } from 'tailwind-merge';
import ButtonDataAction from '@/components/actions/button/button-data-action';
import { useVideoCallStore } from '../store';
import { useRouter } from 'next/navigation';
import {VIDEOCALL_LAYOUTS, VIDEOCALL_LAYOUTS_OPTION} from '../constant/layout';
import formatTextUppercase from '../utils/formatTextUppercase';
export interface VideoCallHeaderProps { }

export const VideoCallHeader = ({ }: VideoCallHeaderProps) => {
    const [isFullScreen, setFullScreen] = useState(false);
    const [isOpenMenuSelectLayout, setMenuSelectLayout] = useState(false);
    const { room, setConfirmLeave, setLayout, layout } = useVideoCallStore();
    const toggleFullScreen = () => {
        setFullScreen(prev => !prev);
        if (!isFullScreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    const handleBack = () => {
        setConfirmLeave(true)
    }
    useEffect(() => {
        const handleFullScreenChange = () => {
            if (document.fullscreenElement) {
                setFullScreen(true);
            } else {
                setFullScreen(false);
            }
        }
        window.addEventListener('fullscreenchange', handleFullScreenChange)
        return () => {
            window.removeEventListener('fullscreenchange',handleFullScreenChange)
        }
    }, [])

    const handleChangeLayout = (layout: keyof typeof VIDEOCALL_LAYOUTS) => {
        setLayout(layout);
    }

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
                <span className='font-semibold text-sm md:text-base'>{room.name || 'Metting'}</span>
            </div>
            <div className='flex gap-2'>
                <DropdownMenu open={isOpenMenuSelectLayout} onOpenChange={()=>setMenuSelectLayout(prev=>!prev)}>
                    <DropdownMenuTrigger>
                    <ButtonDataAction>
                        <span className="mr-2">
                            {VIDEOCALL_LAYOUTS_OPTION[layout]?.icon || <LayoutDashboard className='w-5 h-5'/>}
                        </span>
                        <span>{formatTextUppercase(layout)}</span>
                    </ButtonDataAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
                        onClick={()=>setMenuSelectLayout(prev=>!prev)}
                    >
                        {Object.keys(VIDEOCALL_LAYOUTS_OPTION).map((layout) => (
                            <div
                                key={VIDEOCALL_LAYOUTS_OPTION[layout].name}
                                className="flex items-center gap-2 p-4 active:!bg-background-darker active:!text-shading md:hover:bg-[#fafafa] md:hover:text-primary cursor-pointer"
                                onClick={()=>handleChangeLayout(layout as keyof typeof VIDEOCALL_LAYOUTS)}
                            >
                                {VIDEOCALL_LAYOUTS_OPTION[layout].icon}
                                {VIDEOCALL_LAYOUTS_OPTION[layout].name}
                            </div>
                        ))}
                        
                    </DropdownMenuContent>
                </DropdownMenu>
                <ButtonDataAction className="rounded-full md:flex hidden" onClick={toggleFullScreen}>
                    {isFullScreen ? <Minimize2 className='w-5 h-5'/> : <Maximize2 className='w-5 h-5'/>}
                </ButtonDataAction>
            </div>
        </header>
    );
};
