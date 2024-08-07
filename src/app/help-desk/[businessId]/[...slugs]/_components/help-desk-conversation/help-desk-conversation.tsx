'use client';

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
import { memo, use, useEffect } from 'react';
import useClient from '@/hooks/use-client';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { cn } from '@/utils/cn';
import { Edge } from 'reactflow';
import FakeTyping from '@/app/test-it-out/_components/fake-typing';
import { useAppStore } from '@/stores/app.store';
import { useRoomSidebarTabs } from '@/features/chat/rooms/components/room-side/room-side-tabs/room-side-tabs.hook';
import { Allotment } from 'allotment';
import { MessageActions } from '@/features/chat/messages/components/message-actions';
import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { useRoomSearchStore } from '@/features/chat/stores/room-search.store';
import { SearchMessageBar } from '@/features/chat/rooms/components/search-message-bar';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';
import { announceToParent } from '@/utils/iframe-util';
import { useBusinessNavigationData } from '@/hooks';

const HelpDeskConversation = ({
  room,
  chatFlow,
  anonymousUser,
  isAnonymousPage,
  ...props
}: {
  room: Room;
  anonymousUser?: User;
  isAnonymousPage?: boolean;
  params: {
    slugs: string[];
  };
  chatFlow?: {
    nodes: FlowNode[];
    edges: Edge[];
  };
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { setRoom, setChatFlow, roomSendingState } =
    useBusinessExtensionStore();
  const isClient = useClient();
  const isMobile = useAppStore((state) => state.isMobile);

  const { currentSide } = useRoomSidebarTabs();
  useEffect(() => {
    if (room) {
      setRoom(room);
    }
    if (chatFlow?.edges || chatFlow?.nodes) {
      setChatFlow(chatFlow);
    }
  }, []);

  if (!isClient) return null;

  return (
    <div {...props} className={cn('h-full w-full', props.className)}>
      <ChatBoxProvider room={room}>
        <div className="flex h-full">
          {isMobile ? (
            <>
              <HelpDeskConversationContent
                room={room}
                anonymousUser={anonymousUser}
                isAnonymousPage={isAnonymousPage}
                roomSendingState={roomSendingState || ''}
              />
              <RoomSide />
            </>
          ) : (
            <Allotment defaultSizes={[400, 300]}>
              <Allotment.Pane minSize={300}>
                <HelpDeskConversationContent
                  room={room}
                  anonymousUser={anonymousUser}
                  isAnonymousPage={isAnonymousPage}
                  roomSendingState={roomSendingState || ''}
                />
              </Allotment.Pane>
              {currentSide && (
                <Allotment.Pane minSize={250} maxSize={600} preferredSize={400}>
                  <RoomSide />
                </Allotment.Pane>
              )}
            </Allotment>
          )}
        </div>
      </ChatBoxProvider>
    </div>
  );
};

const HelpDeskConversationContent = memo(
  ({
    room,
    anonymousUser,
    isAnonymousPage,
    roomSendingState,
  }: {
    room: Room;
    anonymousUser?: User;
    isAnonymousPage?: boolean;
    roomSendingState: string;
  }) => {
    const { isShowSearch } = useRoomSearchStore();

    return (
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-card">
        {!isAnonymousPage && (
          <>
            <ChatBoxHeader />
            {isShowSearch && <SearchMessageBar roomId={room._id} />}
          </>
        )}

        <MediaUploadProvider>
          <MediaUploadDropzone>
            <MessageActions>
              <MessagesBoxProvider
                room={room}
                guestId={anonymousUser?._id}
                isAnonymous={isAnonymousPage}
              >
                <MessageBox
                  room={room}
                  isAnonymous={isAnonymousPage}
                  guestId={anonymousUser?._id}
                />
                {roomSendingState === 'loading' && (
                  <FakeTyping name={room.space?.name} />
                )}
                <ChatBoxFooter
                  isAnonymous={isAnonymousPage}
                  guest={anonymousUser}
                />
              </MessagesBoxProvider>
            </MessageActions>
          </MediaUploadDropzone>
        </MediaUploadProvider>
      </div>
    );
  },
);

HelpDeskConversationContent.displayName = 'HelpDeskConversationContent';

export default HelpDeskConversation;
