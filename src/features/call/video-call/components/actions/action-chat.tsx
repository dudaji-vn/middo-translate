import { Button } from '@/components/actions';
import { SubtitlesIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import socket from '@/lib/socket-io';
import { memo, useCallback, useEffect, useState } from 'react';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/features/chat/messages/types';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { useAppStore } from '@/stores/app.store';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';

const ActionChat = () => {
  const [newCount, setNewCount] = useState(0);
  const { isFullScreen, isShowChat, setShowChat, messageId } =
    useVideoCallStore();
  const isMobile = useAppStore((state) => state.isMobile);
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

  useEffect(() => {
    if (isMobile) setShowChat(false);
  }, [isMobile, setShowChat]);

  const onToggleDiscussion = useCallback(() => {
    setShowChat(!isShowChat);
  }, [setShowChat, isShowChat]);

  useKeyboardShortcut([SHORTCUTS.TOGGLE_DISCUSSION], onToggleDiscussion);

  return (
    <div className={cn('relative', !isFullScreen && 'hidden')}>
      <Tooltip
        title={isShowChat ? 'Hide chat' : 'Show chat'}
        triggerItem={
          <Button.Icon
            variant="default"
            size="xs"
            color={isShowChat ? 'primary' : 'default'}
            onClick={onToggleDiscussion}
          >
            <SubtitlesIcon />
          </Button.Icon>
        }
      />
      {newCount > 0 && (
        <div className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-xs text-white">
          {newCount}
        </div>
      )}
    </div>
  );
};

export default memo(ActionChat);
