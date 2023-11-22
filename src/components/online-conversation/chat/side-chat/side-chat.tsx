'use client';

import { ArrowForward } from '@easy-eva-icons/react';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { IconButton } from '@/components/button';
import { SideChatBody } from './side-chat-body';
import { SideChatFooter } from './side-footer';
import { SideChatHeader } from './side-chat-header';
import { Switch } from '@/components/switch';
import { cn } from '@/utils/cn';
import { useChat } from '../chat-context';
import { useIsMobile } from '@/hooks/use-is-mobile';

export interface SideChatProps {}

export const SideChat = (props: SideChatProps) => {
  const { room, user, closeSideChat, showSideChat, setIsShowFull, isShowFull } =
    useChat();
  const isMobile = useIsMobile();
  return (
    <>
      {showSideChat && isMobile && (
        <div
          onClick={closeSideChat}
          className="fixed bottom-0 left-0 right-0 top-0 bg-black/70"
        />
      )}
      <div
        className={cn(
          'flex h-full min-w-[30vw] flex-col gap-3 overflow-y-auto border-l bg-background-darker',
          isMobile
            ? 'fixed bottom-0 right-0 top-0 w-[80vw] transition-all duration-300'
            : '',
          showSideChat ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {isMobile && (
          <div className="mt-2 flex justify-end px-[5vw]">
            <IconButton onClick={closeSideChat} variant="ghost">
              <ArrowForward />
            </IconButton>
          </div>
        )}
        <SideChatHeader code={room.code} />
        {user.language !== DEFAULT_LANGUAGES_CODE.EN && (
          <div
            className={cn(
              'flex items-center justify-between bg-background p-5',
            )}
          >
            <span>Show middle translate</span>{' '}
            <Switch checked={isShowFull} onCheckedChange={setIsShowFull} />
          </div>
        )}
        <SideChatBody room={room} />
        <SideChatFooter roomCode={room.code} user={user} />
      </div>
    </>
  );
};
