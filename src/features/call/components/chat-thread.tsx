import React, { useEffect, useState } from 'react';
import { useVideoCallStore } from '../store/video-call.store';
import { twMerge } from 'tailwind-merge';
import {
  Lightbulb,
  MessageSquareQuote,
  Subtitles,
  X,
  XIcon,
} from 'lucide-react';
import { Button } from '@/components/actions';
import { getMessageIdFromCallIdService } from '@/services/message.service';
import Discussion from '@/features/chat/discussion/components/discussion';
import { useAppStore } from '@/stores/app.store';

export default function ChatThread({ className }: { className?: string }) {
  const {
    isFullScreen,
    isShowChat,
    setShowChat,
    room,
    messageId,
    setMessageId,
  } = useVideoCallStore();
  const isMobile = useAppStore((state) => state.isMobile);

  const [isShowAlert, setShowAlert] = useState(true);
  useEffect(() => {
    if (messageId) return;
    const callId = room?._id;
    if (!callId) return;
    const handleGetMessageId = async () => {
      const { data } = await getMessageIdFromCallIdService(callId);
      setMessageId(data);
    };
    handleGetMessageId();
  }, [room, messageId, setMessageId]);

  if (!messageId) return null;
  return (
    <aside
      className={twMerge(
        'w-full h-full flex-1 overflow-y-hidden border-t bg-background md:max-w-[400px] md:w-[400px] md:overflow-auto md:border-t-0 z-10',
        className,
        isMobile && 'fixed h-[calc(100dvh_-_104px)] top-[52px]',
        (!isFullScreen || !isShowChat) && 'hidden md:hidden',
      )}
    >
      <div className="flex h-full w-full flex-col border-l border-neutral-50">
        <div className="flex h-[53px] w-full items-center gap-2 border-b p-3 font-semibold text-primary">
          <MessageSquareQuote className="size-4" />
          <span>Discussion</span>
          <div className="ml-auto">
            <Button.Icon
              onClick={() => setShowChat(false)}
              size="xs"
              variant="ghost"
              color="default"
            >
              <XIcon />
            </Button.Icon>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          {isShowAlert && (
            <div className="p-3">
              <div className="rounded-xl bg-neutral-50 p-2">
                <div className="flex items-center text-neutral-600">
                  <Lightbulb className="h-4 w-4 text-neutral-400" />
                  <p className="ml-1 flex-1">
                    Discussion created by Middo Call
                  </p>
                  <X
                    className="h-4 w-4 cursor-pointer text-neutral-400"
                    onClick={() => setShowAlert(false)}
                  />
                </div>
                <p className="mt-2 text-sm font-light text-neutral-400">
                  Every messages, files and links were sent in this discussion
                  have been saved in this group’s conversation. Members can
                  access it even after the call is done.
                </p>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <div className="h-full">
              <Discussion messageId={messageId} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
