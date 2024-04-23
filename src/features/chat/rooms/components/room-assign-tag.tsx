'use client'

import React, { cloneElement, use, useEffect } from 'react'
import { Room } from '../types'
import { Button } from '@/components/actions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/data-display/popover';
import { Tag } from 'lucide-react';
import { ActionItem } from './room-actions';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

const RoomAssignTag = ({
    id,
    onClosed
}: {
    id: Room['_id'];
    onClosed?: () => void;
}) => {
    const [open, setOpen] = React.useState(false);
    const { t } = useTranslation('common')
    useEffect(() => {
        if (!open) {
            // onClosed()
        }
    }, [open])

    return (
        <Popover open={open} >
            <PopoverTrigger asChild>
                <div className='relative flex cursor-pointer gap-2 select-none items-center rounded-md px-3 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-30'>
                    <Tag size={16} />
                    <span>{t(`CONVERSATION.TAG`)}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex max-h-[300px] min-h-[200px] w-[200px] max-w-[100vw] flex-col overflow-y-auto bg-white px-0 py-4"
            >

            </PopoverContent>
        </Popover>
    );
}

export default RoomAssignTag