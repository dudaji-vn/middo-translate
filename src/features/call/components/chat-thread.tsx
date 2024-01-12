import React, { useState } from 'react'
import { useVideoCallStore } from '../store/video-call.store'
import { twMerge } from 'tailwind-merge';
import { Lightbulb, MoreVertical, Subtitles, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/data-display';
import { Button } from '@/components/actions';
import { ChatBoxFooter } from '@/features/chat/rooms/components';

export default function ChatThread() {
    const { isFullScreen, isShowChat, setShowChat } = useVideoCallStore();
    const [isShowAlert, setShowAlert] = useState(true);
    return (
        <aside className={twMerge('max-w-[400px] w-full', (isFullScreen && isShowChat) ? 'block' : 'hidden')}>
            <div className='w-full h-full flex flex-col border-l border-neutral-50'>
                <div className='bg-neutral-50 p-1 pl-3 flex items-center justify-center text-primary gap-2'>
                    <Subtitles />
                    <span className='flex-1'>Discussion</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button.Icon
                                variant='default'
                                color='default'
                            >
                                <MoreVertical />
                            </Button.Icon>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className='flex gap-1' onClick={()=>setShowChat(false)}>
                                <X />
                                Close
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className='flex-1'>
                    <div className='p-3 overflow-auto'>
                        {isShowAlert && 
                        <div className='bg-neutral-50 rounded-xl p-2 relat'>
                            <div className='text-neutral-600 flex items-center'>
                                <Lightbulb className='text-neutral-400 w-4 h-4'/>
                                <p className='ml-1 flex-1'>Discussion created by Middo Call</p>
                                <X className='text-neutral-400 w-4 h-4 cursor-pointer' onClick={()=>setShowAlert(false)}/>
                            </div>
                            <p className='text-sm text-neutral-400 font-light mt-2'>Every messages, files and links were sent in this discussion have been saved in this group’s conversation. Members can access it even after the call is done.</p>
                        </div>}
                    </div>
                </div>
                <ChatBoxFooter></ChatBoxFooter>
            </div>
        </aside>
    )
}
