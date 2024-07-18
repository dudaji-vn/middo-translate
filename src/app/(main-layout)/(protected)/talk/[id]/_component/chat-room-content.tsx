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
import { SearchMessageBar } from '@/features/chat/rooms/components/search-message-bar';
import { useChatBox } from '@/features/chat/rooms/contexts';
import { Room } from '@/features/chat/rooms/types';
import { useRoomSearchStore } from '@/features/chat/stores/room-search.store';
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

export const ChatRoomMain = ({ room }: { room: Room }) => {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-card md:rounded-none">
      <ChatBoxHeader />
      <PinnedBar />
      <SearchMessageBar roomId={room._id} />
      <MediaUploadProvider>
        <MediaUploadDropzone>
          <MessagesBoxProvider room={room}>
            <MessageActions>
              {room.status === 'waiting_group' && room.isGroup ? null : (
                <>
                  <MessageBox room={room} />
                  <RoomTyping />
                </>
              )}
              <ChatBoxFooter/>
            </MessageActions>
          </MessagesBoxProvider>
        </MediaUploadDropzone>
      </MediaUploadProvider>
    </div>
  );
};
export default ChatRoomContent;
