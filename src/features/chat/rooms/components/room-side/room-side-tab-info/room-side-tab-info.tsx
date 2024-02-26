import { Button } from '@/components/actions';
import { useChatBox } from '../../../contexts';
import { RoomCloud } from '../room-cloud';
import { RoomDeleteConversation } from '../room-delete-conversation';
import { RoomInfo } from '../room-info';
import { RoomLeave } from '../room-leave';
import { RoomMember } from '../room-member';
import { RoomSetting } from '../room-setting';
import { ArrowLeftIcon } from 'lucide-react';
import { useRoomSidebarTabs } from '../room-side-tabs/room-side-tabs.hook';

export interface RoomSideTabInfoProps {}

export const RoomSideTabInfo = ({}: RoomSideTabInfoProps) => {
  const { changeToDefault } = useRoomSidebarTabs();
  const { room } = useChatBox();
  return (
    <>
      <div className="-mx-3 -mt-3 px-1 pt-2 md:hidden">
        <Button.Icon onClick={changeToDefault} variant="ghost" color="default">
          <ArrowLeftIcon />
        </Button.Icon>
      </div>
      <div className="pb-2">
        <RoomInfo room={room} />
        <div className="my-8">
          <RoomSetting room={room} />
          {room.isGroup && (
            <RoomMember members={room.participants} adminId={room.admin?._id} />
          )}
          <RoomCloud room={room} />
        </div>
        {room.isGroup && <RoomLeave roomId={room._id} />}
        <RoomDeleteConversation isGroup={room.isGroup} roomId={room._id} />
      </div>
    </>
  );
};
