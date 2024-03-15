'use client'

import { Button } from '@/components/actions'
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
    }
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { setData } = useAuthStore()
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
            <div className='w-fit overflow-hidden p-4 rounded-[20px] mr-auto bg-primary-500-main text-white relative rounded-bl-lg'>
                {businessData.firstMessage}
                <div className='text-left bg-primary-400 rounded-xl px-3 py-1'>
                    {businessData.firstMessageEnglish}
                </div>
            </div>
            <Button className='h-11  w-2/3 md:max-w-48 mx-auto min-w-fit' variant={'default'} color={'primary'} shape={'square'} onClick={createAGuestConversation} disabled={isLoading} >
                Start a conversation
            </Button>
        </div>
    )
}

export default StartAConversation