import { businessAPI } from '@/features/chat/business/business.service'
import { ChatMain } from '@/features/chat/components/chat-main'
import { ChatSidebar } from '@/features/chat/components/chat-sidebar'
import { Inbox } from '@/features/chat/rooms/components'
import React, { ReactNode } from 'react'

const BusinessConversationLayout = async ({ children }: { children: ReactNode }) => {
    const businessData = await businessAPI.getMyBusiness()
    return (
        <div className="flex w-full">
            <ChatSidebar  businessData={businessData}>
                <Inbox  />
            </ChatSidebar>
            {children}
        </div>
    )
}
export default BusinessConversationLayout