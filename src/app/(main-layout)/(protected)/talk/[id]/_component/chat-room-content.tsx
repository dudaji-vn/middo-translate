'use client';
import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import { MessageActions } from '@/features/chat/messages/components/message-actions';
import {
  MessageBox,
  MessagesBoxProvider,
} from '@/features/chat/messages/components/message-box';
import { ChatBoxHeader, RoomSide } from '@/features/chat/rooms/components';
import { PinnedBar } from '@/features/chat/rooms/components/pin-message-bar';
import { ChatBoxFooter } from '@/features/chat/rooms/components/room-box/room-box-footer';
import { RoomTyping } from '@/features/chat/rooms/components/room-box/room-typing';
import { useRoomSidebarTabs } from '@/features/chat/rooms/components/room-side/room-side-tabs/room-side-tabs.hook';
import { useChatBox } from '@/features/chat/rooms/contexts';
import { Room } from '@/features/chat/rooms/types';
import { useAppStore } from '@/stores/app.store';
import { Allotment } from 'allotment';

const ChatRoomContent = () => {
  const { room } = useChatBox();
  const isMobile = useAppStore((state) => state.isMobile);
  const { currentSide } = useRoomSidebarTabs();
  return (
    <div className="flex h-full">
      {isMobile ? (
        <>
          <ChatRoomMain room={room} />
          <RoomSide />
        </>
      ) : (
        <Allotment defaultSizes={[400, 300]}>
          <Allotment.Pane minSize={300}>
            <ChatRoomMain room={room} />
          </Allotment.Pane>
          {currentSide && (
            <Allotment.Pane minSize={250} maxSize={600} preferredSize={400}>
              <RoomSide />
            </Allotment.Pane>
          )}
        </Allotment>
      )}
    </div>
  );
};

const ChatRoomMain = ({ room }: { room: Room }) => {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-card">
      <ChatBoxHeader />
      <PinnedBar />
      <MediaUploadProvider>
        <MediaUploadDropzone>
          <MessagesBoxProvider room={room}>
            <MessageActions>
              {room.status === 'waiting' && room.isGroup ? (
                <div className="flex-1" />
              ) : (
                <>
                  <MessageBox room={room} />
                  <RoomTyping />
                </>
              )}
              <ChatBoxFooter />
            </MessageActions>
          </MessagesBoxProvider>
        </MediaUploadDropzone>
      </MediaUploadProvider>
    </div>
  );
};
export default ChatRoomContent;
