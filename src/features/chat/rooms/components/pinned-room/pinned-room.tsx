import { useMemo } from 'react';
import { InboxType } from '../inbox/inbox';
import { RoomItem } from '../room-item';
import { Room } from '../../types';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

export interface PinnedRoomProps {
  currentRoomId?: string;
  type: InboxType;
  rooms?: Room[];
}

export const PinnedRoom = ({ currentRoomId, type, rooms }: PinnedRoomProps) => {
  const { businessData } = useBusinessExtensionStore();
  const { isBusiness } = useBusinessNavigationData();
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    const showHelpDeskRooms =
      isBusiness && businessData?._id && type === 'help-desk';
    return rooms.filter((room) => {
      if (showHelpDeskRooms) return room.isHelpDesk;
      if (type === 'all') return !room.isHelpDesk;
      if (type === 'group') return room.isGroup;
    });
  }, [rooms, type, businessData, isBusiness]);

  if (!filteredRooms || !filteredRooms.length) return null;
  return (
    <div>
      {filteredRooms.map((room) => (
        <RoomItem
          key={room._id}
          data={room}
          isActive={currentRoomId === room._id}
          currentRoomId={currentRoomId as string}
          businessId={businessData?._id}
        />
      ))}
      <div className="my-1 border-t"></div>
    </div>
  );
};
