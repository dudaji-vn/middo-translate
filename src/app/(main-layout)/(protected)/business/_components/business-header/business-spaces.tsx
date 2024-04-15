'use client'

import { Button } from '@/components/actions'
import { Avatar, Typography } from '@/components/data-display'
import { cn } from '@/utils/cn'
import { cva } from 'class-variance-authority'
import { Bell, Pen, Plus } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation';

import React, { useMemo } from 'react'
import SpacesList from './tabs-content/spaces-list'
import { TabsContentProps } from '@radix-ui/react-tabs'
import { BaseEntity } from '@/types'
import { User } from '@/features/users/types'
import { useAuthStore } from '@/stores/auth.store'
import Ping from './tabs-content/ping/ping'

export type BusinessTabType = 'all_spaces' | 'my_spaces' | 'joined_spaces';
export type BusinessTabItem = {
    value: BusinessTabType;
    label: string;
    componentProps?: Partial<TabsContentProps>;
}
export type TSpaceTag = 'my' | 'joined' | undefined;
export type TSpace = BaseEntity & {
    name: string;
    description?: string;
    members: string[];
    newMessagesCount: number;
    owner: User;
    tag?: TSpaceTag
}
const tabItems: BusinessTabItem[] = [
    {
        value: 'all_spaces',
        label: 'All spaces',
        componentProps: {
            className: ''
        }
    },
    {
        value: 'my_spaces',
        label: 'My spaces',
    },
    {
        value: 'joined_spaces',
        label: 'Joined spaces',
    }
]
type TModalType = 'create-space' | 'edit-space'
const BusinessSpaces = () => {
    const [tab, setTab] = React.useState<BusinessTabType>('all_spaces');
    const currentUser = useAuthStore(s => s.user);
    const searchParams = useSearchParams();
    const modal = useMemo(() => {
        const modal = searchParams?.get('modal')
        if (modal === 'create-space' || modal === 'edit-space') return modal;
        return null;
    }, [searchParams])

    const router = useRouter();
    return (
        <>
            <section className={modal ? 'hidden' : ''} >
                <div className={cn('bg-primary-100 w-full px-[5vw] py-5 flex items-end flex-row justify-between')}>
                    <div className='flex flex-row gap-3'>
                        <Avatar src={currentUser?.avatar ?? '/avatar.png'} alt='avt' className='w-16 h-16' />
                        <div className='flex flex-col gap-2'>
                            <Typography className='text-neutral-600 text-base font-normal leading-[18px]'>Hi, welcome back</Typography>
                            <Typography className='text-primary-500-main text-base font-semibold'>{currentUser?.name}</Typography>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 items-center h-fit'>
                        <Button
                            variant={'default'}
                            startIcon={<Plus className="h-4 w-4" />}
                            color={'primary'}
                            shape={'square'}
                            className={'w-fit'}
                            onClick={() => {
                                router.push('/business?modal=create-space')
                            }}
                            size={'xs'}
                        >
                            Create New Space
                        </Button>
                        <Button.Icon
                            variant={'default'}
                            color={'default'}
                            size={'xs'}
                            className='relative'
                        >
                            <Ping  className='absolute -top-[2px] -right-[8px]' size={12}/>
                            <Bell className='h-4 w-4' />
                        </Button.Icon>
                    </div>
                </div>
                <Tabs defaultValue='joined_spaces' className="w-full h-fit " value={tab} onValueChange={(val) => setTab(val as BusinessTabType)}>
                    <TabsList className='justify-start px-[5vw] h-fit'>
                        {tabItems.map((item) => (
                            <TabsTrigger key={item.value} value={item.value} className='max-w-fit px-8'>
                                {item.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabItems.map((item) => (
                        <TabsContent key={item.value} value={item.value} {...item.componentProps} className={cn('data-[state=active]:h-[calc(100vh-240px)] data-[state=active]:min-h-[400px] overflow-h-auto', item.componentProps?.className)}>
                            <SpacesList tab={item.value} />
                        </TabsContent>
                    ))}
                </Tabs>
            </section>
        </>
    )
}

export default BusinessSpaces