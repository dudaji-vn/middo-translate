'use client'

import { DEFAULT_THEME } from '@/app/(main-layout)/(protected)/business/settings/_components/extention-modals/sections/options'
import { PreviewCustomMessages } from '@/app/(main-layout)/(protected)/business/settings/_components/extention-modals/sections/preview-custom-messages'
import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField'
import { InputSelectLanguage } from '@/components/form/input-select-language'
import { Sheet, SheetContent, SheetTrigger } from '@/components/navigation'
import { Form, FormMessage } from '@/components/ui/form'
import { createGuestInfoSchema } from '@/configs/yup-form'
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service'
import { User } from '@/features/users/types'
import useClient from '@/hooks/use-client'
import { startAGuestConversationService } from '@/services/extension.service'
import { cn } from '@/utils/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
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

const StartAConversation = ({ businessData, isAfterDoneAnCOnversation }: {
    isAfterDoneAnCOnversation?: boolean
    businessData: TBusinessExtensionData
}) => {
    const router = useRouter()
    const isClient = useClient();
    const { user: owner } = businessData || {};
    const [open, setOpen] = useState(false);
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
        formState: { isSubmitting, errors },
    } = methods;
    if (!isClient)
        return null
    const submit = async (values: z.infer<typeof createGuestInfoSchema>) => {
        try {
            await startAGuestConversationService({
                businessId: businessData._id,
                ...values
            }).then((res) => {
                const roomId = res.data.roomId;
                const user = res.data.user;
                router.push(`/help-desk/${businessData._id}/${roomId}/${user._id}`)
            })
        } catch (error) {
            console.error('Error in create a guest conversation', error)
        }
    }
    return (
        <div className={cn('h-full w-full flex flex-col justify-between py-3 px-4', isAfterDoneAnCOnversation && 'max-h-60 my-auto')}>
            {isAfterDoneAnCOnversation ? <div className="max-w-screen-md m-auto flex flex-col gap-8 items-center">
                <Typography variant={'h2'} className="text-2xl">Thank you!</Typography>
                <Typography >Your rating has been sent successfully</Typography>
            </div> :
                <PreviewCustomMessages sender={owner} content={businessData.firstMessage} />}
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
                                className='h-11  w-full'
                                variant={'default'}
                                type={'submit'}
                                shape={'square'}
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                style={{ backgroundColor: businessData?.color || DEFAULT_THEME }}
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
                        style={{ backgroundColor: businessData?.color || DEFAULT_THEME }}
                    >
                        {isAfterDoneAnCOnversation ? "Click to start a new conversation!" : "Click to start a conversation"}
                    </Button>
                </SheetTrigger>
            </Sheet>

        </div>
    )
}

export default StartAConversation