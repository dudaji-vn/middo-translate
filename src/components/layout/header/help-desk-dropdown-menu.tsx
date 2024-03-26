'use client';

import { Button } from '@/components/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/data-display'
import { ROUTE_NAMES } from '@/configs/route-name';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { Minus } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { use, useMemo } from 'react'

const HelpDeskDropdownMenu = () => {

    const { isOnHelpDeskChat } = useBusinessNavigationData();
    const params = useParams();
    const roomId = params?.slugs?.[0] || '';
    const pathname = usePathname();
    console.log('pathname', pathname, roomId)
    const router = useRouter();
    const items = useMemo(() => {
        return [{
            name: 'Mute',
            onClick: () => {
                // TODO: implement this
            }
        },
        {
            name: 'Complete',
            onClick: () => {
                const next = String(pathname?.replace(roomId, 'rate'))
                router.replace(next)

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