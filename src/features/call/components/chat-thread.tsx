import React, { useEffect, useState } from 'react'
import { useVideoCallStore } from '../store/video-call.store'
import { twMerge } from 'tailwind-merge';
import { Lightbulb, MoreVertical, Subtitles, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/data-display';
import { Button } from '@/components/actions';
import { ChatBoxFooter } from '@/features/chat/rooms/components';
import { getMessageIdFromCallIdService } from '@/services/message.service';
import Discussion from '@/features/chat/discussion/components/discussion';
import { useChatStore } from '@/features/chat/store';

export default function ChatThread({className}: {className?: string}) {
    const { isFullScreen, isShowChat, setShowChat, room, messageId, setMessageId } = useVideoCallStore();
    const [isShowAlert, setShowAlert] = useState(true);
    const { toggleShowMiddleTranslation,  showMiddleTranslation} = useChatStore();
    useEffect(() => {
        if(messageId) return;
        const callId = room?._id;
        if(!callId) return;
        const handleGetMessageId = async () => {
            const {data} = await getMessageIdFromCallIdService(callId);
            setMessageId(data)
        }
        handleGetMessageId();
    }, [room, messageId, setMessageId])

    if(!messageId) return null;
    return (
        <aside className={twMerge('md:max-w-[400px] w-full h-[424px] md:h-auto', className, (!isFullScreen || !isShowChat) && 'hidden md:hidden')}>
            <div className='w-full h-full flex flex-col border-l border-neutral-50'>
                <div className='bg-neutral-50 p-1 pl-3 flex items-center justify-center text-primary gap-2'>
                    <Subtitles className='w-4 h-4'/>
                    <span className='flex-1'>Discussion</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button.Icon
                                size='xs'
                                variant='default'
                                color='default'
                            >
                                <MoreVertical />
                            </Button.Icon>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className='flex gap-1' onClick={()=>toggleShowMiddleTranslation()}>
                                {showMiddleTranslation ? 'Hide' : 'Show'} translated message
                            </DropdownMenuItem>
                            <DropdownMenuItem className='flex gap-1' onClick={()=>setShowChat(false)}>
                                Close window
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <div className='p-3'>
                        {isShowAlert && 
                        <div className='bg-neutral-50 rounded-xl p-2'>
                            <div className='text-neutral-600 flex items-center'>
                                <Lightbulb className='text-neutral-400 w-4 h-4'/>
                                <p className='ml-1 flex-1'>Discussion created by Middo Call</p>
                                <X className='text-neutral-400 w-4 h-4 cursor-pointer' onClick={()=>setShowAlert(false)}/>
                            </div>
                            <p className='text-sm text-neutral-400 font-light mt-2'>Every messages, files and links were sent in this discussion have been saved in this group’s conversation. Members can access it even after the call is done.</p>
                        </div>}
                    </div>
                    <div className='flex-1 overflow-hidden'>
                        <div className='h-full'>
                            <Discussion messageId={messageId} />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
