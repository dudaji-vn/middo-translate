'use client'

import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import { cn } from '@/utils/cn'
import { cva } from 'class-variance-authority'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/navigation';

import React from 'react'
import BusinessExtension from '../extenstion/business-extension'
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service'
import { ROUTE_NAMES } from '@/configs/route-name'
import { TSpace } from '../../../_components/business-spaces'
import MembersList from '../members-list/members-list'
import { EditSpaceModal } from '../space-edition/edit-space-modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import EditSpaceImage from '../space-edition/edit-space-image'
import { DeleteSpaceModal } from '../space-edition/delete-space-modal'
import TagsList from '../tags-list/tags-list'
import { t } from 'i18next'
import { useAuthStore } from '@/stores/auth.store'
import { SPACE_SETTING_ITEMS } from './setting-items'
import { getUserSpaceRole } from './role.util'




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
const editSpaceSchema = z.object({
    spaceId: z.string().min(1, {
        message: 'Space ID is required.'
    }),
    name: z.string().min(1, {
        message: 'Space name is required.'
    }).max(30, {
        message: 'Space name is too long, maximum 30 characters.'
    }),
    avatar: z.string().min(1, {
        message: 'Space avatar is required.'
    }),
    tags: z.array(z.string()).optional(),
    backgroundImage: z.string().optional(),

});

export type TEditSpaceFormValues = z.infer<typeof editSpaceSchema>;
type SpaceSettingProps = {
    space: {
        extension: TBusinessExtensionData;
    } & TSpace
}

const SpaceSetting = ({ space }: SpaceSettingProps) => {
    const searchParams = useSearchParams();
    const params = useParams();
    const currentUser = useAuthStore(state => state.user);
    const currentUserRole = getUserSpaceRole(currentUser, space);
    const modalType: ExtensionModalType = searchParams?.get('modal') as ExtensionModalType;
    const isExtensionEmpty = !space?.extension;
    const isSpaceOwner = Boolean(currentUser?._id) && currentUser?._id === space?.owner?._id;

    const formEditSpace = useForm<TEditSpaceFormValues>({
        mode: 'onChange',
        defaultValues: {
            spaceId: params?.spaceId as string,
            name: space?.name || '',
            avatar: space?.avatar || '/avatar.svg',
            backgroundImage: space?.backgroundImage,
        },
        resolver: zodResolver(editSpaceSchema),
    });
    if (!space) {
        return null;
    }

    return (<>
        <section className={(modalType) ? 'hidden' : 'w-full h-fit md:px-10 px-3 py-5 bg-white'}>
            <Form {...formEditSpace}>
                <div className='bg-primary-100 p-3 rounded-[12px] items-center w-full flex flex-row justify-between'>
                    <div className={cn('w-full flex flex-row items-center gap-3', headerVariants({ modal: modalType }))}>
                        <EditSpaceImage uploadAble={isSpaceOwner} />
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-row gap-2 items-center'>
                                <Typography className='text-neutral-800  font-semibold  text-[18px] leading-5'>
                                    {space?.name}
                                </Typography>
                                {isSpaceOwner && <EditSpaceModal space={space} />}
                            </div>
                            <Typography className='text-neutral-400 font-normal text-sm leading-[18px]'>
                                {space?.members?.length || 0} Members
                            </Typography>
                        </div>
                    </div>
                    {isSpaceOwner && <DeleteSpaceModal space={space} />}
                </div>
            </Form>
        </section>
        <section className={(modalType) ? 'hidden' : 'w-full bg-white items-center'}>
            <Tabs defaultValue='members' className="w-full m-0 p-0">
                <div className='w-full bg-white transition-all duration-300 overflow-x-auto'>
                    <TabsList className='w-full sm:px-10  flex flex-row justify-start'>
                        {SPACE_SETTING_ITEMS.map(item => {
                            return <TabsTrigger
                                key={item.label}
                                value={item.name}
                                className={cn('lg:px-10 w-fit', {
                                    'hidden': !currentUserRole || !item.roles.view.find(role => role === currentUserRole)
                                })}>
                                {item.label}
                            </TabsTrigger>
                        })}
                    </TabsList>
                </div>
                <TabsContent value="members" className={cn("py-4",
                    {
                        'hidden': !currentUserRole || !SPACE_SETTING_ITEMS.find(item => item.name === 'members')?.roles.view.find(role => role === currentUserRole)
                    }
                )}>
                    <MembersList
                        space={space}
                    />
                </TabsContent>
                <TabsContent value="tags" className={cn("py-4", {
                    'hidden': !currentUserRole || !SPACE_SETTING_ITEMS.find(item => item.name === 'tags')?.roles.view.find(role => role === currentUserRole)
                })}>
                    <TagsList tags={space.tags} spaceId={space._id} myRole={currentUserRole} />
                </TabsContent>
                <TabsContent value="extension" className={cn("p-0 w-full flex flex-col items-center justify-center", {
                    'hidden': !currentUserRole || !SPACE_SETTING_ITEMS.find(item => item.name === 'extension')?.roles.view.find(role => role === currentUserRole)
                })}>
                    <div className={isExtensionEmpty ? 'w-full flex flex-col  items-center gap-2 min-h-[calc(100vh-350px)] justify-center' : 'hidden'}>
                        <Image src='/empty_extension.svg' width={200} height={156} alt='empty-extensions' className='mx-auto' />
                        <Typography className='text-neutral-800 font-semibold text-lg leading-5'>
                            Your extension is almost here!
                        </Typography>
                        <Typography className='text-neutral-600'>
                            Create a conversation extension with the help of ready-made theme or define a unique one on your own
                        </Typography>
                        <Link href={`${ROUTE_NAMES.SPACES}/${params?.spaceId}/settings?modal=create-extension`} className={isExtensionEmpty ? '' : 'hidden'}>
                            <Button variant={'default'} color={'primary'} shape={'square'} className={'mt-4 w-fit mx-auto'} >
                                <Plus className="h-4 w-4" />
                                <Typography className="ml-2 text-white">
                                    Create Extension
                                </Typography>
                            </Button>
                        </Link>
                    </div>
                    <BusinessExtension data={space.extension} name='Middo Conversation Extension' />
                </TabsContent>
            </Tabs >
        </section>

    </>
    )
}

export default SpaceSetting