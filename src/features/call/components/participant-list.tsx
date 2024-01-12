'use client';

import { MoreVertical, Pin, Trash2, UsersIcon, X } from 'lucide-react';
import { Avatar, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/data-display';

import { Button } from '@/components/actions/button';
import { useParticipantVideoCallStore } from '../store/participant.store';
import ParicipantInVideoCall from '../interfaces/participant';

export interface VideoCallHeaderProps { }

export const ParticipantListSidebar = ({ }: VideoCallHeaderProps) => {
    const { participants } = useParticipantVideoCallStore()
    let participantList = participants.filter((p: ParicipantInVideoCall) => !p.isShareScreen)
    return (
        <aside className='w-full md:max-w-[320px] h-full border-r border-neutral-50 md:relative absolute inset-0 z-10 bg-white flex flex-col'>
            <div className='p-1 pl-3 flex items-center justify-center gap-2 border-b border-neutral-50'>
                <UsersIcon className='w-4 h-4 stroke-primary' />
                <h2 className='text-primary text-base font-semibold flex-1'>Participants</h2>
                <button className='p-2 hover:bg-neutral-50 rounded-full'>
                    <X className='w-5 h-5 stroke-neutral-700'></X>
                </button>
            </div>
            <ul className='overflow-auto flex-1'>
                {participantList.map((participant: ParicipantInVideoCall) => (
                    <li key={participant.socketId} className='p-3 pr-1 flex items-center gap-2'>
                    <Avatar
                        src={participant.user?.avatar || '/avatar.png'}
                        alt={participant.user?.name || ''}
                        className='w-9 h-9'
                    />
                    <p className='text-neutral-800 flex-1'>{participant.user?.name || ''}</p>
                    <ParticipantAction />
                </li>
                ))}
            </ul>
        </aside>
    );
};


const ParticipantAction = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button.Icon
                    size="md"
                    variant="default"
                    color="default"
                    className="bg-transparent"
                >
                    <MoreVertical />
                </Button.Icon>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="flex items-center gap-1">
                    <Pin className='w-4 h-4' />
                    <span className='flex-1'>Pin</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-1">
                    <Trash2 className='w-4 h-4 text-error' />
                    <span className='flex-1 text-error'>Remove</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}