'use client'

import { Button } from '@/components/actions'
import { Avatar, Text, Typography } from '@/components/data-display'
import { TriangleSmall } from '@/components/icons/triangle-small'
import { TimeDisplay } from '@/features/chat/messages/components/time-display'
import { User } from '@/features/users/types'
import { startAGuestConversationService } from '@/services/extension.service'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

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

const StartAConversation = ({ businessData }: {
    businessData: {
        _id: string,
        firstMessage: string,
        firstMessageEnglish: string,
        language: string,
        user: Partial<User>
    }
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { setData } = useAuthStore()
    const { user: owner } = businessData || {};
    const createAGuestConversation = async () => {
        setIsLoading(true)
        try {
            // TODO: correct payload, remove mock data
            startAGuestConversationService({
                businessId: businessData._id,
                name: 'HUYEN',
                language: 'vi',
                email: 'mockemail@gmockk.com'
            }).then((res) => {
                const roomId = res.data.roomId;
                const user = res.data.user;
                // setData({user})
                router.push(`/help-desk/${businessData._id}/${roomId}/${user._id}`)
            })
        } catch (error) {
            console.error('Error in create a guest conversation', error)
        }
        setIsLoading(false)
    }
    return (
        <div className='h-full w-full flex flex-col justify-between py-3 px-4'>

            <div >
                <TimeDisplay time={new Date().toLocaleDateString()} />
                <div className="w-full gap-1  pb-10 relative  flex pr-11 md:pr-20">
                    <div className="overflow-hidden relative aspect-square size-6 rounded-full mb-auto mr-1 mt-0.5 shrink-0">
                        <Avatar src={owner?.avatar || ''} alt={owner?.name || ''} size="xs" />
                    </div>
                    <div className="relative space-y-2">
                        <Typography className='p-1 text-sm leading-[18px] font-light text-neutral-600'>{owner?.name}</Typography>
                        <div className="w-fit min-w-10 bg-neutral-50 px-2 py-1 relative overflow-hidden rounded-[20px]">
                            <div className="px-3 py-2 bg-neutral-50 break-word-mt text-start tiptap prose editor-view prose-strong:text-current max-w-none w-full focus:outline-none text-current text-sm">
                                {businessData.firstMessage}
                            </div>
                            <div className={businessData.firstMessageEnglish ? "relative mt-2 min-w-10" : 'hidden'}>
                                <TriangleSmall
                                    fill={'#e6e6e6'}
                                    position="top"
                                    className="absolute left-4 top-0 -translate-y-full"
                                />
                                <div className={"mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600 relative"}>
                                    <Text
                                        value={businessData.firstMessage}
                                        className={"text-start text-sm font-light"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Button className='h-11  w-2/3 md:max-w-48 mx-auto min-w-fit' variant={'default'} color={'primary'} shape={'square'} onClick={createAGuestConversation} disabled={isLoading} >
                Start a conversation
            </Button>
        </div>
    )
}

export default StartAConversation