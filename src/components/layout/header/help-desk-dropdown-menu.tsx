'use client';

import { Button } from '@/components/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/data-display'
import { ROUTE_NAMES } from '@/configs/route-name';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { Minus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation';
import React, { use, useMemo } from 'react'

const HelpDeskDropdownMenu = () => {

    const { isOnHelpDeskChat } = useBusinessNavigationData();
    const params = useParams();
    const router = useRouter();
    const items = useMemo(() => {
        if (isOnHelpDeskChat) 
        return [{
            name: 'Mute',
            onClick: () => {
                // TODO: implement this
            }
        }];
        return [
            {
                name: 'Complete',
                onClick: () => {
                    if (params?.businessId && params?.userId)
                        router.push(`${ROUTE_NAMES.HELPDESK_CONVERSATION}/${params.businessId}/rate/${params.userId}`)
                }
            },

        ]
    }, [isOnHelpDeskChat, params?.businessId, params?.userId]);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button.Icon variant={'ghost'} size={'xs'}>
                    <Minus />
                </Button.Icon>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {items.map(option => (
                    <DropdownMenuItem key={option.name} onSelect={option.onClick}>
                        {option.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default HelpDeskDropdownMenu