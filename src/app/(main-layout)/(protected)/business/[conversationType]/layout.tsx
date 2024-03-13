import { ChatMain } from '@/features/chat/components/chat-main'
import { ChatSidebar } from '@/features/chat/components/chat-sidebar'
import { Inbox } from '@/features/chat/rooms/components'
import React, { ReactNode } from 'react'

const BusinessConversationLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex">
            <ChatSidebar>
                <Inbox />
            </ChatSidebar>
            {children}
        </div>
    )
}
export default BusinessConversationLayout