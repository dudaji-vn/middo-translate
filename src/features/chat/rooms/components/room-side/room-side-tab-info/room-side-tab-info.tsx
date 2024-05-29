import { Button } from '@/components/actions';
import { useChatBox } from '../../../contexts';
import { RoomDeleteConversation } from '../room-delete-conversation';
import { RoomInfo } from '../room-info';
import { RoomLeave } from '../room-leave';
import { RoomMember } from '../room-member';
import { RoomSetting } from '../room-setting';
import { ArrowLeftIcon } from 'lucide-react';
import { useRoomSidebarTabs } from '../room-side-tabs/room-side-tabs.hook';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import useClient from '@/hooks/use-client';
export interface RoomSideTabInfoProps {}

export const RoomSideTabInfo = ({}: RoomSideTabInfoProps) => {
  const { changeToDefault } = useRoomSidebarTabs();
  const { isBusiness } = useBusinessNavigationData();
  const isClient = useClient();
  const { room } = useChatBox();

  if (!isClient) return null;

  return (
    <>
      <div className="-mx-3 px-1 pt-1 md:-mt-3 md:hidden">
        <Button.Icon
          size="xs"
          onClick={changeToDefault}
          variant="ghost"
          color="default"
        >
          <ArrowLeftIcon />
        </Button.Icon>
      </div>
      <div className="-mx-3 -mt-3 bg-[#fcfcfc] pb-2 pt-3">
        <RoomInfo room={room} isGuest={isBusiness} />
        <div className={isBusiness ? 'mb-8' : 'my-5'}>
          {!isBusiness && <RoomSetting room={room} />}
          {room.isGroup && (
            <RoomMember
              members={room.participants}
              pendingMembers={room.waitingUsers}
              rejectedMembers={room.rejectedUsers}
              adminId={room.admin?._id}
            />
          )}
        </div>
        <div className="mt-5 divide-y-[1px] divide-neutral-50 bg-white">
          {room.isGroup && <RoomLeave roomId={room._id} />}
          <RoomDeleteConversation isGroup={room.isGroup} roomId={room._id} />
        </div>
      </div>
    </>
  );
};
