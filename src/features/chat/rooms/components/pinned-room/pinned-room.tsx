import { RoomItem } from '../room-item';
import { useGetPinnedRooms } from '@/features/chat/messages/hooks/use-pin-room';

export interface PinnedRoomProps {
  currentRoomId?: string;
}

export const PinnedRoom = ({ currentRoomId }: PinnedRoomProps) => {
  const { rooms } = useGetPinnedRooms();
  if (!rooms || !rooms.length) return null;
  return (
    <div className="">
      {rooms.map((room) => (
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
