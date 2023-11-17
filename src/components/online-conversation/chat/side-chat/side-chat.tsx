'use client';

import { ArrowForward } from '@easy-eva-icons/react';
import { IconButton } from '@/components/button';
import { SideChatBody } from './side-chat-body';
import { SideChatFooter } from './side-footer';
import { SideChatHeader } from './side-chat-header';
import { cn } from '@/utils/cn';
import { useChat } from '../chat-context';
import { useIsMobile } from '@/hooks/use-is-mobile';

export interface SideChatProps {}

export const SideChat = (props: SideChatProps) => {
  const { room, user, closeSideChat, showSideChat } = useChat();
  const isMobile = useIsMobile();
  return (
    <>
      {showSideChat && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 top-0 bg-black/70"></div>
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
        <SideChatBody room={room} />
        <SideChatFooter roomCode={room.code} user={user} />
      </div>
    </>
  );
};
