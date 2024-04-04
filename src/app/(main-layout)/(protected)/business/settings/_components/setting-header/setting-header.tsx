'use client'

import { Button } from '@/components/actions'
import { Avatar, Typography } from '@/components/data-display'
import { cn } from '@/utils/cn'
import { cva } from 'class-variance-authority'
import { ArrowLeft, Pen, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation';

import React from 'react'
import BusinessExtension from '../extenstion/business-extension'
import NestedFlow from '../extension-creation/steps/script-chat-flow/nested-flow'

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

const SettingHeader = ({ data }: { data: any }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const modalType: ExtensionModalType = searchParams?.get('modal') as ExtensionModalType;
    const isEmpty = !data;
    return (<>
        <section className={cn('bg-white w-full p-10 flex flex-row gap-3', headerVariants({ modal: modalType }))}>
            <Avatar src='/avatar.svg' alt='avt' className='w-24 h-24' />
            <div className='flex flex-col gap-2'>
                <Typography variant={'h4'} className='text-neutral-800  font-semibold text-2xl leading-5'>DUDAJI Vietnam</Typography>
                <Typography className='text-neutral-600'>10 member</Typography>
                <div className='pt-1'>
                    {/* <Link href='/business/settings?modal=edit-company'> */}
                    <Button color={'secondary'} className='flex flex-row gap-2 h-10' shape={'square'} size={'sm'} >Edit<Pen size={15} /></Button>
                    {/* </Link> */}
                </div>
            </div>
        </section>
        <section className={(modalType) ? 'hidden' : 'w-full flex flex-col items-center'}>
            <Tabs defaultValue='members' className="w-full">
                <div className='w-full bg-white transition-all duration-300'>
                    <TabsList className='lg:max-w-fit'>
                        <TabsTrigger className='lg:px-10' value="members">Members Management</TabsTrigger>
                        <TabsTrigger className='lg:px-10' value="extension">Conversation Extension</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="members" className="p-4">
                    updating...
                </TabsContent>
                <TabsContent value="extension" className="p-4 w-full flex flex-col items-center">
                    <div className={isEmpty ? 'w-full flex flex-col items-center gap-2' : 'hidden'}>
                        <Image src='/empty-extentions.png' width={200} height={156} alt='empty-extentions' className='mx-auto my-3' />
                        <Typography className='text-neutral-800 font-semibold text-lg leading-5'>
                            Your extension is almost here!
                        </Typography>
                        <Typography className='text-neutral-600'>
                            Create a conversation extension with the help of ready-made theme or define a unique one on your own
                        </Typography>
                    </div>
                    <Link href='/business/settings?modal=create-extension' className={isEmpty ? '' : 'hidden'}>
                        <Button variant={'default'} color={'primary'} shape={'square'} className={'mt-4 w-fit mx-auto'} >
                            <Plus className="h-4 w-4" />
                            <Typography className="ml-2 text-white">
                                Create Extension
                            </Typography>
                        </Button>
                    </Link>
                    <BusinessExtension data={data} name='Middo Conversation Extension' />

                </TabsContent>
            </Tabs >
        </section>

    </>
    )
}

export default SettingHeader