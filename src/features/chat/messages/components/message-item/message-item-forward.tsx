import { useEffect, useMemo, useRef, useState } from 'react';
import { Message } from '../../types';
import { ImageGallery } from './message-item-image-gallery';
import { DocumentMessage } from './message-item-document';
import { useChatStore } from '@/features/chat/store';
import { translateText } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { Room } from '@/features/chat/rooms/types';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { RichTextView } from '@/components/rich-text-view';
import { MessageItemVideo } from './message-item-video';

export interface MessageItemForwardProps {
  message: Message;
  isMe: boolean;
  hasParent: boolean;
}

export const MessageItemForward = ({
  message,
  hasParent,
  isMe,
}: MessageItemForwardProps) => {
  const mediaRef = useRef<HTMLDivElement>(null);
  const displayForwardFrom = useMemo(() => {
    let text = message?.sender?.name;
    if (message.room?.isGroup) {
      text += ` in ${message.room?.name || 'a group'}`;
    }
    return text;
  }, [message]);
  return (
    <div className="my-1 flex h-fit gap-1">
      {hasParent && !isMe && (
        <div>
          <div className="h-1/2 w-2 border-b border-l border-neutral-100" />
        </div>
      )}
      <div className="order-neutral-100 ml-auto w-fit rounded-2xl border p-2">
        <div
          style={{
            width: mediaRef.current?.clientWidth,
          }}
          className="overflow-hidden text-sm"
        >
          <span className="italic text-neutral-400">Forward from&nbsp;</span>
          <Wrapper room={message.room!}>
            <span className="break-all text-primary max-md:inline-block">
              {displayForwardFrom}
            </span>
          </Wrapper>
          <div className="mt-1">
            {message.content && <TextMessage message={message} />}
            {message?.media && message.media.length > 0 && (
              <div ref={mediaRef} className="w-fit">
                {message.media[0].type === 'image' && (
                  <ImageGallery images={message.media} />
                )}
                {message.media[0].type === 'document' && (
                  <DocumentMessage file={message.media[0]} />
                )}
                {message.media[0].type === 'video' && (
                  <MessageItemVideo file={message.media[0]} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {hasParent && isMe && (
        <div>
          <div className="h-1/2 w-2 border-b border-r border-neutral-100" />
        </div>
      )}
    </div>
  );
};

const TextMessage = ({ message }: { message: Message }) => {
  const showMiddleTranslation = useChatStore(
    (state) => state.showMiddleTranslation,
  );
  const userLanguage = useAuthStore((state) => state.user?.language);
  const [contentDisplay, setContentDisplay] = useState(message.content);
  useEffect(() => {
    if (userLanguage === message.sender.language) return;
    const translateContent = async () => {
      const translated = await translateText(
        message.content,
        message?.language || message.sender.language,
        userLanguage,
      );
      setContentDisplay(translated);
    };
    translateContent();
  }, [
    userLanguage,
    message.content,
    message.sender.language,
    message.contentEnglish,
    message.status,
    message.language,
  ]);
  return (
    <div className="p-1">
      <RichTextView content={contentDisplay} />
      {message?.contentEnglish &&
        message.status !== 'removed' &&
        showMiddleTranslation && (
          <div className="relative mt-2">
            <TriangleSmall
              fill="#F2F2F2"
              position="top"
              className="absolute left-4 top-0 -translate-y-full"
            />
            <div className={'mb-1 mt-2 rounded-xl bg-neutral-50 p-1 px-3'}>
              <RichTextView content={message.contentEnglish} />
            </div>
          </div>
        )}
    </div>
  );
};

const Wrapper = ({
  children,
  room,
}: {
  children: React.ReactNode;
  room: Room;
}) => {
  const userId = useAuthStore((state) => state.user?._id);
  const canRedirect = useMemo(() => {
    const isInRoom =
      room?.participants?.findIndex((p) => p._id === userId) !== -1;
    return isInRoom;
  }, [room?.participants, userId]);
  if (canRedirect) {
    return (
      <Link href={`${ROUTE_NAMES.ONLINE_CONVERSATION}/${room?._id}`}>
        {children}
      </Link>
    );
  }
  return <>{children}</>;
};
