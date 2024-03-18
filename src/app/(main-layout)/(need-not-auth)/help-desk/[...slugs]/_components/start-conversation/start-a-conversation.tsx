'use client'

import { PreviewCustomMessages } from '@/app/(main-layout)/(protected)/business/settings/_components/extention-modals/sections/preview-custom-messages'
import { Button } from '@/components/actions'
import { User } from '@/features/users/types'
import { startAGuestConversationService } from '@/services/extension.service'
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
        user: User
    }
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
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
            <PreviewCustomMessages sender={owner} content={businessData.firstMessage} />
            <Button
                className='h-11  w-2/3 md:max-w-48 mx-auto min-w-fit'
                variant={'default'}
                color={'primary'}
                shape={'square'}
                onClick={createAGuestConversation}
                disabled={isLoading}
            >
                Start a conversation
            </Button>
        </div>
    )
}

export default StartAConversation