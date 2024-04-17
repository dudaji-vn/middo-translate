'use client'

import { extentionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options'
import { Button } from '@/components/actions'
import { Avatar, Typography } from '@/components/data-display'
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField'
import { InputSelectLanguage } from '@/components/form/input-select-language'
import { Sheet, SheetContent, SheetTrigger } from '@/components/navigation'
import { Form } from '@/components/ui/form'
import { createGuestInfoSchema } from '@/configs/yup-form'
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service'
import { messageApi } from '@/features/chat/messages/api'
import { Room } from '@/features/chat/rooms/types'
import useClient from '@/hooks/use-client'
import { startAGuestConversation } from '@/services/extension.service'
import { cn } from '@/utils/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getConnectedEdges } from 'reactflow'
import { z } from 'zod'

export type TGuestRoom = {
    clientTempId: string
    content: string
    contentEnglish: string
    language: string
    roomId: string
    userId: string
}
export type TStartAConversation = {
    businessId: string
    name: string
    language: string
    email: string
}

const StartAConversation = ({ extensionData, isAfterDoneAnCOnversation }: {
    isAfterDoneAnCOnversation?: boolean
    extensionData: TBusinessExtensionData
}) => {
    const router = useRouter()
    const isClient = useClient();
    const { user: owner } = extensionData || {};
    const theme = extentionsCustomThemeOptions.find((item) => item.name === extensionData.color || item.hex === extensionData.color) || extentionsCustomThemeOptions[0];
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const showForm = () => {
        setOpen(true);
    }
    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            language: '',
        },
        resolver: zodResolver(createGuestInfoSchema),
    });
    const {
        handleSubmit,
        trigger,
        setValue,
        watch,
        formState: { isSubmitting, errors },
    } = methods;
    const chatFlow = extensionData.chatFlow;
    const appendFirstMessageFromChatFlow = async (roomId: Room['_id']) => {
        if (!chatFlow) return;
        const { nodes, edges } = chatFlow;
        const rootNode = nodes.find(node => node.type === 'root');
        if (!rootNode) return;

        const rootEdges = getConnectedEdges([rootNode], edges)[0] || {};
        const rootChild = nodes.find(node => node.id === rootEdges.target);
        if (!rootChild) return;

        const childrenActions = nodes.filter(node => node.parentNode === rootChild.id);
        const payload = {
            content: rootChild.data?.content,
            roomId,
            type: 'flow-actions',
            language: watch('language'),
            mentions: [],
            actions: rootChild.type === 'message' ? undefined : childrenActions,
            userId: owner?._id,
        };
        await messageApi.sendAnonymousMessage({
            ...payload,
            senderType: 'bot',
            clientTempId: new Date().toISOString()
        });
    }

    if (!isClient)
        return null
    const submit = async (values: z.infer<typeof createGuestInfoSchema>) => {
        try {
            setLoading(true)
            await startAGuestConversation({
                businessId: extensionData._id,
                ...values
            }).then(async (res) => {
                const roomId = res.data.roomId;
                const user = res.data.user;
                await appendFirstMessageFromChatFlow(roomId);
                router.push(`/help-desk/${extensionData._id}/${roomId}/${user._id}?themeColor=${theme.name}`)
            })
        } catch (error) {
            console.error('Error in create a guest conversation', error)
        }
    }
    return (
        <div className={cn('h-full w-full flex flex-col justify-between py-3 px-4', isAfterDoneAnCOnversation ? 'max-h-60 my-auto' : 'pb-5 h-main-container-height')}>
            {isAfterDoneAnCOnversation ?
                <div className="max-w-screen-md m-auto flex flex-col gap-4 items-center px-4">
                    <Typography variant={'h4'} className="text-lg">Thank you!</Typography>
                    <Typography >Conversation end. <br /> Your rating has been sent successfully.</Typography>
                </div> :
                <div className="overflow-hidden  relative aspect-square max-h-[100px]  h-fit w-full flex flex-row gap-2">
                    <Avatar src={owner?.avatar ?? '/avatar.png'} alt={'avatar-sender'} className="size-16  p-1 border border-neutral-50" />
                    <div className="flex flex-col gap-1 w-full h-fit">
                        <p className="text-neutral-800 max-h-fit text-xs">Conversation with</p>
                        <p className="text-neutral-600 max-h-fit text-[24px] font-semibold">{owner?.name}</p>
                    </div>
                </div>
            }
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side='bottom' className={open ? 'w-full  bg-white max-md:rounded-t-2xl shadow-sm' : 'hidden'}>
                    <Form {...methods}>
                        <form onSubmit={handleSubmit(submit)} className="space-y-4 mx-auto max-w-md flex flex-col justify-center">
                            <Typography className='text-neutral-600 w-full text-2xl font-semibold leading-7 tracking-normal text-center'>Guest sign in</Typography>
                            <RHFInputField
                                name="name"
                                formLabel="Name"
                                formLabelProps={{ className: 'pl-0' }}
                                inputProps={{
                                    placeholder: 'Enter your name',
                                }}
                            />
                            <RHFInputField
                                name="email"
                                formLabel="Email"

                                formLabelProps={{ className: 'pl-0' }}
                                inputProps={{
                                    placeholder: 'Enter your email',
                                }}
                            />
                            <InputSelectLanguage
                                className="mt-5 rounded-md"
                                field="language"
                                setValue={setValue}
                                errors={errors.language}
                                trigger={trigger}
                                labelProps={{ className: 'ml-0 mb-2' }}
                            />
                            <Button
                                variant={'default'}
                                type={'submit'}
                                shape={'square'}
                                disabled={isSubmitting}
                                color={'primary'}
                                loading={isSubmitting || loading}
                                className='h-11  w-full '
                                style={{ backgroundColor: theme.hex }}
                            >
                                Start Conversation
                            </Button>
                        </form>
                    </Form>
                </SheetContent>
                <SheetTrigger>
                    <Button
                        className='h-11  w-2/3 md:max-w-48 mx-auto min-w-fit'
                        variant={'default'}
                        color={'primary'}
                        shape={'square'}
                        type={'button'}
                        onClick={showForm}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                    >
                        {isAfterDoneAnCOnversation ? "Click to start a new conversation!" : "Click to start a conversation"}
                    </Button>
                </SheetTrigger>
            </Sheet>

        </div>
    )
}

export default StartAConversation