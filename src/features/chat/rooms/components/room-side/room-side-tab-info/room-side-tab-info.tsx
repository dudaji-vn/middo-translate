import { useChatBox } from '../../../contexts';
import { RoomCloud } from '../room-cloud';
import { RoomDeleteConversation } from '../room-delete-conversation';
import { RoomInfo } from '../room-info';
import { RoomLeave } from '../room-leave';
import { RoomMember } from '../room-member';
import { RoomSetting } from '../room-setting';

export interface RoomSideTabInfoProps {}

export const RoomSideTabInfo = ({}: RoomSideTabInfoProps) => {
  const { room } = useChatBox();
  return (
    <div>
      <RoomInfo room={room} />
      <div className="my-12">
        <RoomSetting room={room} />
        {room.isGroup && (
          <RoomMember members={room.participants} adminId={room.admin?._id} />
        )}
        <RoomCloud room={room} />
      </div>
      {room.isGroup && <RoomLeave roomId={room._id} />}
      <RoomDeleteConversation isGroup={room.isGroup} roomId={room._id} />
    </div>
  );
};
