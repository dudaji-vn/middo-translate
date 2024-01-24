import { MainMessage } from '@/features/chat/discussion/components/main-message';
import { MessageActions } from '@/features/chat/messages/components/message-actions';
import { MessageItemWrapper } from '@/features/chat/messages/components/message-item/message-item-wrapper';
import { useAuthStore } from '@/stores/auth.store';
import { PinIcon, XIcon } from 'lucide-react';
import { useGetPinMessage } from '../../../hooks/use-get-pin-message';
import { useRoomId } from '../../../hooks/use-roomId';
import { RoomSideTabLayout } from './room-side-tab-layout';
import { useRoomSidebarTabs } from './room-side-tabs.hook';
import { Button } from '@/components/actions';
import { usePinMessage } from '@/features/chat/messages/hooks/use-pin-message';

export interface RoomSideTabPinnedProps {}

export const RoomSideTabPinned = (props: RoomSideTabPinnedProps) => {
  const roomId = useRoomId();
  const { data } = useGetPinMessage({ roomId });
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { changeToDefault } = useRoomSidebarTabs();
  const { pin: pinMutation } = usePinMessage();

  return (
    <MessageActions>
      <RoomSideTabLayout
        title="Pinned messages"
        icon={<PinIcon />}
        onBack={changeToDefault}
      >
        <div className="flex w-full flex-col divide-y divide-neutral-100  overflow-hidden p-3">
          {data?.map((pin) => {
            const isMe = pin.pinnedBy._id === currentUserId;
            return (
              <div key={pin._id} className="group relative flex flex-col py-3">
                <MessageItemWrapper
                  setActive={() => {}}
                  message={pin.message}
                  isMe={false}
                >
                  <MainMessage message={pin.message} />
                </MessageItemWrapper>
                <span className="ml-auto mt-1 text-xs font-light text-neutral-800">
                  Pinned by {isMe ? 'you' : pin.pinnedBy.name}
                </span>
                <Button.Icon
                  onClick={() => pinMutation(pin.message._id)}
                  variant="ghost"
                  color="default"
                  size="xs"
                  className="absolute right-0 top-0 hidden group-hover:flex"
                >
                  <XIcon />
                </Button.Icon>
              </div>
            );
          })}
        </div>
      </RoomSideTabLayout>
    </MessageActions>
  );
};
