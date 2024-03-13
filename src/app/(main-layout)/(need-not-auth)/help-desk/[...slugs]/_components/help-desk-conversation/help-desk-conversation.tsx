import {
    ChatBoxFooter,
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

const HelpDeskConversation = async ({ room, anonymousUser, isAnonymousPage, params: { slugs } }: {
    room: Room;
    anonymousUser?: User;
    isAnonymousPage?: boolean;
    params: {
        slugs: string[];
    };
}) => {
    return (
        <div className="w-full">
            <ChatBoxProvider room={room}>
                <div className="flex h-full">
                    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-card">
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
