'use client'

import { Button } from '@/components/actions'
import { Avatar, Typography } from '@/components/data-display'
import { cn } from '@/utils/cn'
import { cva } from 'class-variance-authority'
import { Pen, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation';

import React from 'react'
import BusinessExtension from '../extenstion/business-extension'
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service'
import { ROUTE_NAMES } from '@/configs/route-name'
import { TSpace } from '../../../_components/business-spaces'
import MembersList from '../members-list/members-list'

export type ExtensionModalType = 'edit-extension' | 'create-extension' | 'edit-company' | undefined | null;
const headerVariants = cva('w-full flex flex-row', {
    variants: {
        modal: {
            'edit-extension': 'hidden',
            'create-extension': ' hidden',
            'edit-company': 'hidden'
        },
    }
});

const SettingHeader = ({ space }: {

    space: {
        extension: TBusinessExtensionData;
    } & TSpace
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const modalType: ExtensionModalType = searchParams?.get('modal') as ExtensionModalType;
    const isExtensionEmpty = !space?.extension
    return (<>
        <section className='w-full h-fit px-10 py-5 bg-white'>
            <div className='bg-primary-100 p-3 rounded-[12px]  w-full flex flex-row justify-between'>
                <div className={cn('w-full flex flex-row gap-3', headerVariants({ modal: modalType }))}>
                    <Avatar src={space?.avatar || '/avatar.png'} alt='avt' className='w-24 h-24' />
                    <div className='flex flex-col gap-2'>
                        <Typography variant={'h4'} className='text-neutral-800  font-semibold text-2xl leading-5'>
                            {space?.name}
                        </Typography>
                        <Typography className='text-neutral-600'>
                            {space?.members?.length || 0} Members
                        </Typography>
                    </div>
                </div>
                <div className='pt-1'>
                    <Button color={'secondary'} className='flex flex-row gap-2 h-10' shape={'square'} size={'sm'} >Edit<Pen size={15} /></Button>
                </div>
            </div>
        </section>
        <section className={(modalType) ? 'hidden' : 'w-full bg-white flex flex-col items-center'}>
            <Tabs defaultValue='members' className="w-full">
                <div className='w-full bg-white transition-all duration-300'>
                    <TabsList className='w-full px-10  flex flex-row justify-start'>
                        <TabsTrigger className='lg:px-10 w-fit' value="members">Members Management</TabsTrigger>
                        <TabsTrigger className='lg:px-10  w-fit' value="extension">Conversation Extension</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="members" className="p-4">
                    <MembersList
                        members={space.members}
                        owner={space.owner}
                    />
                </TabsContent>
                <TabsContent value="extension" className="p-4 w-full flex flex-col items-center">
                    <div className={isExtensionEmpty ? 'w-full flex flex-col items-center gap-2' : 'hidden'}>
                        <Image src='/empty-extentions.png' width={200} height={156} alt='empty-extentions' className='mx-auto my-3' />
                        <Typography className='text-neutral-800 font-semibold text-lg leading-5'>
                            Your extension is almost here!
                        </Typography>
                        <Typography className='text-neutral-600'>
                            Create a conversation extension with the help of ready-made theme or define a unique one on your own
                        </Typography>
                    </div>
                    <Link href={`${ROUTE_NAMES.SPACES}/${params?.spaceId}/settings?modal=create-extension`} className={isExtensionEmpty ? '' : 'hidden'}>
                        <Button variant={'default'} color={'primary'} shape={'square'} className={'mt-4 w-fit mx-auto'} >
                            <Plus className="h-4 w-4" />
                            <Typography className="ml-2 text-white">
                                Create Extension
                            </Typography>
                        </Button>
                    </Link>
                    <BusinessExtension data={space.extension} name='Middo Conversation Extension' />
                </TabsContent>
            </Tabs >
        </section>

    </>
    )
}

export default SettingHeader