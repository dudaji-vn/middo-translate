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

const HelpDeskConversation = ({ room,  anonymousUser, isAnonymousPage }: {
    room: Room;
    anonymousUser?: User;
    isAnonymousPage?: boolean;
    params: {
        slugs: string[];
    };
}) => {
    const { setRoom } = useBusinessExtensionStore();
    const isClient = useClient()
    useEffect(() => {
        if (room) {
            setRoom(room);
        }
    }, [])
    if (!isClient) return null;

    return (
        <div className="w-full max-md:h-main-container-height">
            <ChatBoxProvider room={room}>
                <div className="flex h-full">
                    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-card">
                        {!isAnonymousPage && <ChatBoxHeader />}
                        <MediaUploadProvider>
                            <MediaUploadDropzone>
                                <MessagesBoxProvider room={room} guestId={anonymousUser?._id} isAnonymous={isAnonymousPage}>
                                    <MessageBox room={room} isAnonymous={isAnonymousPage} guestId={anonymousUser?._id} />
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
