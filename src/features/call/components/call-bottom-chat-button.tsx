import { Button } from '@/components/actions';
import { SubtitlesIcon } from 'lucide-react';
import { useVideoCallStore } from '../store/video-call.store';
import { cn } from '@/utils/cn';
import socket from '@/lib/socket-io';
import { useEffect, useState } from 'react';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/features/chat/messages/types';

export interface CallBottomChatButtonProps {}

export const CallBottomChatButton = (props: CallBottomChatButtonProps) => {
  const [newCount, setNewCount] = useState(0);
  const { isFullScreen, isShowChat, setShowChat, messageId } =
    useVideoCallStore();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isShowChat) {
      setNewCount(0);
    }
    socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.JOIN, messageId);
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.NEW, (message: Message) => {
      queryClient.invalidateQueries(['message-replies', messageId]);
      if (isShowChat) return;
      setNewCount((prev) => prev + 1);
    });

    return () => {
      socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.LEAVE, messageId);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.REPLY.NEW);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageId, isShowChat]);
  return (
    <div className={cn('relative', !isFullScreen && 'hidden')}>
      <Button.Icon
        variant="default"
        size="xs"
        color={isShowChat ? 'primary' : 'default'}
        onClick={() => setShowChat(!isShowChat)}
      >
        <SubtitlesIcon />
      </Button.Icon>
      {newCount > 0 && (
        <div className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-xs text-white">
          {newCount}
        </div>
      )}
    </div>
  );
};
