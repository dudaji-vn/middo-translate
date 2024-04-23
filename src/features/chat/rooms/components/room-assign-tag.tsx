'use client';

import React, { cloneElement, use, useEffect } from 'react';
import { Room } from '../types';
import { Button } from '@/components/actions';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/data-display/popover';
import { Circle, Tag } from 'lucide-react';
import { ActionItem } from './room-actions';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useSpaceStore } from '@/stores/space.store';
import { TConversationTag } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';

const RoomAssignTag = ({
    id,
    onClosed,
}: {
    id: Room['_id'];
    onClosed?: () => void;
}) => {
    const [open, setOpen] = React.useState(false);
    const { space } = useSpaceStore();
    const tags = space?.tags || ([] as TConversationTag[]);
    const { t } = useTranslation('common');
    useEffect(() => {
        if (open) {
            console.log('spaceData', space);
        }
    }, [open]);

    return (
        <Popover open={open}>
            <PopoverTrigger asChild>
                <div
                    onClick={() => setOpen(true)}
                    className="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none transition-colors hover:bg-primary-300 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-30"
                >
                    <Tag size={16} />
                    <span>{t(`CONVERSATION.TAG`)}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                onMouseLeave={() => setOpen(false)}
                className="flex h-auto max-h-[300px] w-[200px] max-w-[100vw] flex-col overflow-y-auto bg-white px-0 py-4"
            >
                <div className="divide-y divide-neutral-100">
                    <div className="flex flex-col">
                        {tags.map(({ _id, color, name }) => (
                            <div
                                key={name}
                                className={cn(
                                    'flex w-full cursor-pointer flex-row items-center justify-stretch px-4 py-2 hover:bg-neutral-100',
                                )}
                            >
                                <Circle size={12} fill={color} stroke={color} />
                                <span>{name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col"></div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default RoomAssignTag;
