'use client';

import { Button } from '@/components/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/data-display'
import { ROUTE_NAMES } from '@/configs/route-name';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { LogOut, Menu } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react'

const HelpDeskDropdownMenu = () => {

    const { isOnHelpDeskChat } = useBusinessNavigationData();
    const params = useParams();
    const userId = params?.slugs?.[1];
    const router = useRouter();
    const items = useMemo(() => {
        return [{
            name: 'End conversation',
            icon: <LogOut  size={18}/>,
            onClick: () => {
                if (!userId) return;
                router.replace(`${ROUTE_NAMES.HELPDESK_CONVERSATION}/${params?.businessId}/rate/${userId}`)

            },
        }]
    }, [params, userId]);
    if (!isOnHelpDeskChat) return null;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button.Icon variant={'ghost'} size={'xs'} className='text-neutral-300'>
                    <Menu size={20} />
                </Button.Icon>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {items.map(option => (
                    <DropdownMenuItem key={option.name} onSelect={option.onClick} className='flex flex-row gap-2 text-neutral-600'>
                        {option.icon}
                        {option.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default HelpDeskDropdownMenu