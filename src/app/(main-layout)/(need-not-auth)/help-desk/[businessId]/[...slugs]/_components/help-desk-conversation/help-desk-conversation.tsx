'use client'

import {
    ChatBoxFooter,
    ChatBoxHeader,
    RoomSide,
} from '@/features/chat/rooms/components';

import { ChatBoxProvider } from '@/features/chat/rooms/contexts';
import {
    MessageBox,
    MessagesBoxProvider,
} from '@/features/chat/messages/components/message-box';


import {
    MediaUploadDropzone,
    MediaUploadProvider,
} from '@/components/media-upload';
import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { useEffect } from 'react';
import useClient from '@/hooks/use-client';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { cn } from '@/utils/cn';
import { Edge } from 'reactflow';
import FakeTyping from '@/app/(main-layout)/(need-not-auth)/test-it-out/_components/fake-typing';
import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/business/settings/_components/extension-creation/steps/script-chat-flow/nested-flow';

const HelpDeskConversation = ({ room, chatFlow, anonymousUser, isAnonymousPage, ...props }: {
    room: Room;
    anonymousUser?: User;
    isAnonymousPage?: boolean;
    params: {
        slugs: string[];
    };
    chatFlow?: {
        nodes: FlowNode[];
        edges: Edge[];
    }
} & React.HTMLAttributes<HTMLDivElement>) => {
    const { setRoom, setChatFlow, roomSendingState } = useBusinessExtensionStore();
    const isClient = useClient()
    useEffect(() => {
        if (room) {
            setRoom(room);
        }
        if (chatFlow?.edges || chatFlow?.nodes) {
            setChatFlow(chatFlow);
        }
    }, [])
    if (!isClient) return null;

    return (
        <div {...props} className={cn("w-full h-main-container-height", props.className)}>
            <ChatBoxProvider room={room}>
                <div className="flex h-full">
                    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-card">
                        {!isAnonymousPage && <ChatBoxHeader />}
                        <MediaUploadProvider>
                            <MediaUploadDropzone>
                                <MessagesBoxProvider room={room} guestId={anonymousUser?._id} isAnonymous={isAnonymousPage}>
                                    <MessageBox room={room} isAnonymous={isAnonymousPage} guestId={anonymousUser?._id} />
                                    {roomSendingState === 'loading' && <FakeTyping />}
                                    <ChatBoxFooter isAnonymous={isAnonymousPage} guest={anonymousUser} />
                                </MessagesBoxProvider>
                            </MediaUploadDropzone>
                        </MediaUploadProvider>
                    </div>
                    <RoomSide />
                </div>
            </ChatBoxProvider>
        </div>
    );
};

export default HelpDeskConversation;
