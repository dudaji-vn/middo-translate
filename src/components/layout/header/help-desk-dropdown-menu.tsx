'use client';

import { Button } from '@/components/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/data-display'
import { ROUTE_NAMES } from '@/configs/route-name';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { Minus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react'

const HelpDeskDropdownMenu = () => {

    const { isOnHelpDeskChat } = useBusinessNavigationData();
    const params = useParams();
    const roomId = params?.slugs?.[0] || '';
    const userId = params?.slugs?.[1];
    const router = useRouter();
    const items = useMemo(() => {
        return [{
            name: 'Complete',
            onClick: () => {
                if (!userId) return;
                router.replace(`${ROUTE_NAMES.HELPDESK_CONVERSATION}/${params?.businessId}/rate/${userId}`)

            },
        }]
    }, [params?.businessId, params?.userId]);
    if (!isOnHelpDeskChat) return null;
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