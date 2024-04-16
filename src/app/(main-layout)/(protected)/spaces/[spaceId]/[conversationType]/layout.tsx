
import { ChatSidebar } from '@/features/chat/components/chat-sidebar'
import { businessAPI } from '@/features/chat/help-desk/api/business.service'
import { Inbox } from '@/features/chat/rooms/components'
import { EBusinessConversationKeys } from '@/types/business.type'
import { notFound } from 'next/navigation'
import React, { ReactNode } from 'react'

const BusinessConversationLayout = async ({ children, params }: {
    children: ReactNode,
    params: {
        conversationType: EBusinessConversationKeys,
        spaceId: string
    }
}) => {
    if (!Object.values(EBusinessConversationKeys).includes(params.conversationType)) {
        notFound();
    }
    const spaceData = await businessAPI.getMyExtension(params.spaceId);
    return (
        <div className="flex w-full">
            <ChatSidebar spaceData={spaceData}>
                <Inbox />
            </ChatSidebar>
            {children}
        </div>
    )
}
export default BusinessConversationLayout