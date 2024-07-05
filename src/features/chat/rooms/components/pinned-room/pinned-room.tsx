import { useMemo } from 'react';
import { InboxType } from '../inbox/inbox';
import { RoomItem } from '../room-item';
import { Room } from '../../types';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useChatStore } from '@/features/chat/stores';
import { isRoomOnline } from '../inbox/inbox-list';
import { useAuthStore } from '@/stores/auth.store';
import { EBusinessSidebarKeys } from '@/types/business.type';

export interface PinnedRoomProps {
  currentRoomId?: string;
  type: InboxType;
  rooms?: Room[];
}

export const PinnedRoom = ({ currentRoomId, type, rooms }: PinnedRoomProps) => {
  const onlineList = useChatStore((state) => state.onlineList);
  const user = useAuthStore((state) => state.user);

  const { businessExtension } = useBusinessExtensionStore();
  const { isBusiness, businessConversationType } = useBusinessNavigationData();
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    const showHelpDeskRooms =
      isBusiness && businessExtension?._id && type === 'help-desk';
    return rooms.filter((room) => {
      if (showHelpDeskRooms) return room.isHelpDesk;
      if (type === 'all') return !room.isHelpDesk;
      if (type === 'group') return room.isGroup;
    });
  }, [rooms, type, businessExtension, isBusiness]);

  if (businessConversationType === EBusinessSidebarKeys.Archived) return null;
  if (!filteredRooms || !filteredRooms.length) return null;
  return (
    <div>
      {filteredRooms.map((room) => (
        <RoomItem
          isOnline={isRoomOnline({
            currentUser: user!,
            onlineList,
            room,
          })}
          key={room._id}
          data={room}
          isActive={currentRoomId === room._id}
          currentRoomId={currentRoomId as string}
          businessId={businessExtension?._id}
        />
      ))}
      <div className="my-1 border-t"></div>
    </div>
  );
};
