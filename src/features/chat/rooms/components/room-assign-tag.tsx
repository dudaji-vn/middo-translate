'use client'

import React, { use, useEffect } from 'react'
import { Room } from '../types'
import { Button } from '@/components/actions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/data-display/popover';
import { Tag } from 'lucide-react';

const RoomAssignTag = ({
    id,
    onClosed
}: {
    id: Room['_id'];
    onClosed?: () => void;
}) => {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (!open) {
            // onClosed()
        }
    }, [open])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={'default'}
                    color={'default'}
                    size={'xs'}
                    className="relative"
                    startIcon={<Tag />}
                >
                    Add tag
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex max-h-[400px] min-h-[300px] w-[462px] max-w-[100vw] flex-col overflow-y-auto bg-white px-0 py-4"
            >

            </PopoverContent>
        </Popover>
    );
}

export default RoomAssignTag