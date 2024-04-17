import { Triangle } from '@/components/icons'
import { cn } from '@/utils/cn'
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/data-display/popover';
import { PopoverContentProps, PopoverProps } from '@radix-ui/react-popover';
import { Button } from '@/components/actions';
import { Pen } from 'lucide-react';

const UpdatingNodeWrapper = ({ children, open, onOpenChange, popoverContentProps = {} }: {
    children: React.ReactNode,
    open: boolean,
    onOpenChange: PopoverProps['onOpenChange'],
    popoverContentProps?: PopoverContentProps,
}) => {
    return (<Popover open={open} onOpenChange={onOpenChange} >
        <PopoverTrigger asChild>
            <Button.Icon color={'default'} size={'xs'} >
                <Pen size={18} />
            </Button.Icon>
        </PopoverTrigger>
        <PopoverContent {...popoverContentProps} className={cn("relative w-[420px] bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]", popoverContentProps?.className)}>
            <Triangle
                fill='#ffffff'
                position="top"
                className={"absolute rotate-0 left-4 top-0 -translate-y-full"}
            />
            <div
                className={cn('w-full flex flex-col h-full')}>
                {children}
            </div>
        </PopoverContent>
    </Popover >

    )
}

export default UpdatingNodeWrapper