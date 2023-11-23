'use client';

import { useEffect, useState } from 'react';

import { ArrowForward } from '@easy-eva-icons/react';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { IconButton } from '@/components/button';
import { MemberList } from './member-list';
import { Participant } from '@/types/room';
import { SideChatFooter } from './side-footer';
import { SideChatHeader } from './side-chat-header';
import { Switch } from '@/components/switch';
import { cn } from '@/utils/cn';
import socket from '@/lib/socket-io';
import { socketConfig } from '@/configs/socket';
import { useChat } from '../chat-context';
import { useIsMobile } from '@/hooks/use-is-mobile';

export interface SideChatProps {}

export const SideChat = (props: SideChatProps) => {
  const { room, user, closeSideChat, showSideChat, setIsShowFull, isShowFull } =
    useChat();
  const isMobile = useIsMobile();

  const [members, setMembers] = useState<Participant[]>(room.participants);
  useEffect(() => {
    socket.on(socketConfig.events.room.participant.update, (participants) => {
      setMembers(participants);
    });

    return () => {
      socket.off(socketConfig.events.room.participant.update);
    };
  }, []);

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
        <SideChatHeader room={{ ...room, participants: members }} />
        {user.language !== DEFAULT_LANGUAGES_CODE.EN && (
          <div
            className={cn(
              'flex items-center justify-between bg-background p-5',
            )}
          >
            <span>Show English translate</span>{' '}
            <Switch checked={isShowFull} onCheckedChange={setIsShowFull} />
          </div>
        )}

        <div className="bg-background">
          <MemberList host={room.host} members={members} />
        </div>
        <SideChatFooter roomCode={room.code} user={user} />
      </div>
    </>
  );
};
