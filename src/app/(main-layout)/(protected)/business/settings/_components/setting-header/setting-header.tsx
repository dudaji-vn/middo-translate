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

type ModalType = 'edit-extension' | 'create-extension' | 'edit-company' | undefined | null;
const headerVariants = cva('w-full flex flex-row', {
    variants: {
        modal: {
            'edit-extension': 'hidden',
            'create-extension': ' hidden',
            'edit-company': 'hidden'
        },
        navigation: {
            default: 'hidden',
            'create-extension': 'w-full py-2 flex flex-row gap-3',
            'edit-extension': 'w-full py-2 flex flex-row gap-3',
            'edit-company': 'w-full py-2 flex flex-row gap-3'
        },
    }
});

const mappedTitle = {
    'edit-extension': 'Edit Extension',
    'create-extension': 'Create Extension',
    'edit-company': 'Edit Company'
}

const SettingHeader = ({ data }: { data: any }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const modalType: ModalType = searchParams?.get('modal') as ModalType;
    const isEmpty = !data;
    return (<>
        <section className={cn('bg-white w-full p-10 flex flex-row gap-3', headerVariants({ modal: modalType }))}>
            <Avatar src='/avatar.svg' alt='avt' className='w-24 h-24' />
            <div className='flex flex-col gap-2'>
                <Typography variant={'h4'} className='text-neutral-800  font-semibold text-2xl leading-5'>DUDAJI Vietnam</Typography>
                <Typography className='text-neutral-600'>10 member</Typography>
                <div className='pt-1'>
                    {/* <Link href='/business/settings?modal=edit-company'> */}
                    <Button color={'secondary'} className='flex flex-row gap-2' shape={'square'} size={'sm'} >Edit<Pen size={15} /></Button>
                    {/* </Link> */}
                </div>
            </div>
        </section>
        <section className={cn('w-full flex flex-row items-center', headerVariants({ navigation: modalType || 'default' }))}>
            <Button.Icon
                onClick={() => {
                    router.back();
                }}
                variant={'ghost'}
                size={'xs'}
                color={'default'}
                className='text-neutral-600'
            >
                <ArrowLeft className="" />
            </Button.Icon>
            <Typography className='text-neutral-600 capitalize'>{mappedTitle[modalType || 'create-extension']}</Typography>
        </section>  
         <section className={(modalType || !modalType && !isEmpty) ? 'hidden' : 'w-full flex flex-col items-center'}>
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
                    <Link href='/business/settings?modal=create-extension'>
                        <Button variant={'default'} color={'primary'} shape={'square'} className={'mt-4 w-fit mx-auto'} >
                            <Plus className="h-4 w-4" />
                            <Typography className="ml-2 text-white">
                                Create Extension
                            </Typography>
                        </Button>
                    </Link>
                </TabsContent>
            </Tabs >
        </section>
    </>
    )
}

export default SettingHeader