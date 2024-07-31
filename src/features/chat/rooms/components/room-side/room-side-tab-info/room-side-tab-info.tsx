import { Button } from '@/components/actions';
import { useChatBox } from '../../../contexts';
import { RoomDeleteConversation } from '../room-delete-conversation';
import { RoomInfo } from '../room-info';
import { RoomLeave } from '../room-leave';
import { RoomMember } from '../room-member';
import { RoomSetting } from '../room-setting';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { useRoomSidebarTabs } from '../room-side-tabs/room-side-tabs.hook';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import useClient from '@/hooks/use-client';
import { RoomBlock } from '../room-block';
import { Item } from '@/components/data-display';
import { useRoomSearchStore } from '@/features/chat/stores/room-search.store';
import { useCheckRoomRelationship } from '@/features/users/hooks/use-relationship';
export interface RoomSideTabInfoProps {}

export const RoomSideTabInfo = ({}: RoomSideTabInfoProps) => {
  const { changeToDefault } = useRoomSidebarTabs();
  const { isBusiness } = useBusinessNavigationData();
  const { setIsShowSearch } = useRoomSearchStore();
  const isClient = useClient();
  const { room } = useChatBox();
  const { relationshipStatus } = useCheckRoomRelationship(room);

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
      <div className="-mx-3 -mt-3 bg-[#fcfcfc] pb-2 pt-3 dark:bg-background">
        <RoomInfo room={room} isGuest={isBusiness} />
        <div className={isBusiness ? 'mb-8' : 'my-5'}>
          <Item
            onClick={() => setIsShowSearch(true)}
            className="border-b"
            leftIcon={<SearchIcon />}
          >
            Search messages
          </Item>
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
        <div className="mt-5 divide-y-[1px] divide-neutral-50 bg-white dark:divide-neutral-800 dark:bg-background">
          {room.isGroup && <RoomLeave roomId={room._id} />}
          {!room.isGroup && !isBusiness && <RoomBlock room={room} />}
          {!isBusiness && (
            <RoomDeleteConversation isGroup={room.isGroup} roomId={room._id} />
          )}
        </div>
      </div>
    </>
  );
};
