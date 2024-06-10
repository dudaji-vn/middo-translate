import { MainMessage } from '@/features/chat/discussion/components/main-message';
import {
  MessageActions,
  actionItems,
  useMessageActions,
} from '@/features/chat/messages/components/message-actions';

import { Button } from '@/components/actions';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { Message } from '@/features/chat/messages/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import {
  Clock9Icon,
  MessageSquareDashedIcon,
  MoreVerticalIcon,
  PinIcon,
} from 'lucide-react';
import { cloneElement, useMemo } from 'react';
import { useGetPinnedMessages } from '../../../hooks/use-get-pinned-messages';
import { useRoomId } from '../../../hooks/use-roomId';
import { RoomSideTabLayout } from './room-side-tab-layout';
import { useRoomSidebarTabs } from './room-side-tabs.hook';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export interface RoomSideTabPinnedProps {}

export const RoomSideTabPinned = (props: RoomSideTabPinnedProps) => {
  const roomId = useRoomId();
  const { data } = useGetPinnedMessages({ roomId });
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { changeToDefault } = useRoomSidebarTabs();
  const { t } = useTranslation('common');
  return (
    <MessageActions>
      <RoomSideTabLayout
        title={t('CONVERSATION.PINNED_MESSAGES')}
        icon={<PinIcon />}
        onBack={changeToDefault}
      >
        {!data?.length && (
          <div className="flex h-full flex-col items-center  justify-center bg-white/80 backdrop-blur-lg">
            <MessageSquareDashedIcon className="mb-4 size-16 text-[#c5dcfa]" />
            <span className="w-[72%] text-center text-sm font-light">
              {t('CONVERSATION.NO_PIN')}
            </span>
          </div>
        )}
        <div className="flex w-full flex-col divide-y divide-neutral-100 dark:divide-neutral-900 overflow-x-hidden  overflow-y-scroll pb-3">
          {data?.map((pin) => {
            const isMe = pin.pinnedBy._id === currentUserId;
            const message = {
              ...pin.message,
              isPinned: true,
            };
            return (
              <div
                key={pin._id}
                className="group relative flex flex-col items-center p-3"
              >
                <div className="flex w-full justify-end">
                  <span className="break-word-mt  ml-auto text-xs font-light text-neutral-800 dark:text-neutral-50">
                    {t('CONVERSATION.PINED_BY', {
                      name: isMe ? t('CONVERSATION.YOU') : pin.pinnedBy.name,
                    })}
                  </span>
                  <span className="break-word-mt flex items-center whitespace-nowrap text-xs font-light text-neutral-800 dark:text-neutral-50">
                    &nbsp;at&nbsp;
                    {moment(pin.createdAt).format('ll')}
                  </span>
                </div>
                <div
                  key={pin._id}
                  className="group relative flex w-full flex-1 items-center"
                >
                  <MainMessage message={message} className="flex-1" />
                  <Menu isMe={isMe} message={message} />
                </div>
              </div>
            );
          })}
        </div>
      </RoomSideTabLayout>
    </MessageActions>
  );
};

const Menu = ({ isMe, message }: { isMe: boolean; message: Message }) => {
  const { onAction } = useMessageActions();
  const { t } = useTranslation('common');
  const items = useMemo(() => {
    return actionItems
      .filter((item) => {
        switch (item.action) {
          case 'copy':
            return message.type === 'text';
          case 'forward':
            return message.type !== 'call';
          case 'pin':
            return (
              !message.isPinned &&
              message.type !== 'call' &&
              message.forwardOf === undefined
            );
          case 'unpin':
            return message.isPinned;
          case 'remove':
            return false;
          case 'download':
            return message.type === 'media';
          default:
            return true;
        }
      })
      .map((item) => ({
        ...item,
        onAction: () =>
          onAction({
            action: item.action,
            message,
            isMe,
          }),
      }));
  }, [isMe, message, onAction]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button.Icon size="xs" variant="ghost" color="default">
          <MoreVerticalIcon />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='dark:bg-neutral-900 dark:border-neutral-800'>
        {items.map((item) => (
          <DropdownMenuItem
            disabled={item.disabled}
            key={item.action}
            onClick={item.onAction}
            className='dark:hover:bg-neutral-800'
          >
            {cloneElement(item.icon, {
              size: 16,
              className: cn('mr-2', item.color && `text-${item.color}`),
            })}

            <span className={cn(item.color && `text-${item.color}`)}>
              {t(item.label)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
