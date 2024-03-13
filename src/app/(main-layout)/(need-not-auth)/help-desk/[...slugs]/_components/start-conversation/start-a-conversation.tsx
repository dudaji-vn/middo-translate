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
        _id: string

    }
}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { setData } = useAuthStore()
    const createAGuestConversation = async () => {
        console.log('create a guest conversation')
        setIsLoading(true)
        try {
            // TODO: correct payload, remove mock data
            startAGuestConversationService({
                businessId: businessData._id,
                name: 'HUYEN',
                language: 'vi',
                email: 'thanhhuyenkk122222@gmail.com'
            }).then((res) => { 
                console.log('res.data', res.data)
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
        <div className='h-full w-full flex flex-col items-center justify-end'>
            <Button variant={'default'} color={'primary'} onClick={createAGuestConversation} disabled={isLoading} >
                Start a conversation
            </Button>
        </div>
    )
}

export default StartAConversation