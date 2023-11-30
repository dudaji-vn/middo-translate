'use client';

import { useEffect, useState } from 'react';

import { ArrowForward } from '@easy-eva-icons/react';
import { Button } from '@/components/actions';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { MemberList } from './member-list';
import { Participant } from '@/types/room';
import { SOCKET_CONFIG } from '@/configs/socket';
import { SideChatFooter } from './side-footer';
import { SideChatHeader } from './side-chat-header';
import { Switch } from '@/components/data-entry';
import { cn } from '@/utils/cn';
import { setRoomSetting } from '@/utils/local-storage';
import socket from '@/lib/socket-io';
import { useChat } from '../chat-context';
import { useIsMobile } from '@/hooks/use-is-mobile';

export interface SideChatProps {}

export const SideChat = (props: SideChatProps) => {
  const {
    room,
    user,
    closeSideChat,
    showSideChat,
    setIsShowFull,
    isShowFull,
    isQuickSend,
    setIsQuickSend,
  } = useChat();
  const isMobile = useIsMobile();

  const [members, setMembers] = useState<Participant[]>(room.participants);
  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.PARTICIPANT.UPDATE, (participants) => {
      setMembers(participants);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.PARTICIPANT.UPDATE);
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
            <Button.Icon
              onClick={closeSideChat}
              variant="ghost"
              color="default"
            >
              <ArrowForward />
            </Button.Icon>
          </div>
        )}
        <SideChatHeader room={{ ...room, participants: members }} />
        <div>
          {user.language !== DEFAULT_LANGUAGES_CODE.EN && (
            <div
              className={cn(
                'flex items-center justify-between bg-background p-5',
              )}
            >
              <span>Show English translate</span>{' '}
              <Switch
                checked={isShowFull}
                onCheckedChange={(checked) => {
                  setRoomSetting({ isShowFull: checked });
                  setIsShowFull(checked);
                }}
              />
            </div>
          )}
          <div className="bg-background px-5">
            <div className="border-t"></div>
          </div>

          <div
            className={cn(
              'flex items-center justify-between bg-background p-5',
            )}
          >
            <span>Quick send</span>
            <Switch
              checked={isQuickSend}
              onCheckedChange={(checked) => {
                setRoomSetting({ isQuickSend: checked });
                setIsQuickSend(checked);
              }}
            />
          </div>
        </div>

        <div className="bg-background">
          <MemberList host={room.host} members={members} />
        </div>
        <SideChatFooter roomCode={room.code} user={user} />
      </div>
    </>
  );
};
