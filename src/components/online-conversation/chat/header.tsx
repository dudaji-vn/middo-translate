'use client';

import { Button } from '@/components/actions';
import { Logo } from '@/components/icons';
import { MoreVerticalOutline } from '@easy-eva-icons/react';
import { useChat } from './chat-context';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';

export interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  const { openSideChat, closeSideChat, room } = useChat();
  const host = room.host;

  const isMobile = useIsMobile();
  useEffect(() => {
    if (!isMobile) {
      openSideChat();
    } else {
      closeSideChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);
  return (
    <div className="chatNavigation">
      <div className="flex items-center gap-2">
        <div>
          <Logo width={28} />
        </div>
        <div>{host?.username}&apos;s room</div>
      </div>
      {isMobile && (
        <Button.Icon
          onClick={() => {
            openSideChat();
          }}
        >
          <MoreVerticalOutline />
        </Button.Icon>
      )}
    </div>
  );
};
