import { useMemo } from 'react';
import { InboxType } from '../inbox/inbox';
import { RoomItem } from '../room-item';
import { Room } from '../../types';

export interface PinnedRoomProps {
  currentRoomId?: string;
  type: InboxType;
  rooms?: Room[];
}

export const PinnedRoom = ({ currentRoomId, type, rooms }: PinnedRoomProps) => {
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room) => {
      if (type === 'all') return true;
      else if (type === 'group') return room.isGroup;
    });
  }, [rooms, type]);

  if (!filteredRooms || !filteredRooms.length) return null;
  return (
    <div className="">
      {filteredRooms.map((room) => (
        <RoomItem
          key={room._id}
          data={room}
          isActive={currentRoomId === room._id}
          currentRoomId={currentRoomId as string}
        />
      ))}
      <div className="my-1 border-t"></div>
    </div>
  );
};
