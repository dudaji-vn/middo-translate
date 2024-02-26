import { Avatar, Text } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { translateText } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { convertToTimeReadable } from '@/utils/time';
import { PhoneCallIcon, PhoneIcon } from 'lucide-react';
import moment from 'moment';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { DocumentMessage } from '../../messages/components/message-item/message-item-document';
import { ImageGallery } from '../../messages/components/message-item/message-item-image-gallery';
import { textVariants } from '../../messages/components/message-item/message-item-text.style';
import { Message } from '../../messages/types';
import { useChatStore } from '../../store';

export interface MainMessageProps {
  message: Message;
  className?: string;
}

export const MainMessage = ({ message, className }: MainMessageProps) => {
  const sender = message.sender;
  return (
    <div className={cn('flex flex-col', className)}>
      {message.type !== 'call' && (
        <div className="flex items-center gap-2">
          <Avatar size="xs" src={sender.avatar} alt={sender.name} />
          <span className="text-sm font-semibold">{sender.name}</span>
        </div>
      )}
      <div className={cn(message.type !== 'call' ? 'ml-8' : '')}>
        {message.content && <TextMessage message={message} />}
        {message?.media && message.media.length > 0 && (
          <Fragment>
            {message.media[0].type === 'image' && (
              <ImageGallery images={message.media} />
            )}
            <div className="flex w-fit justify-start">
              {message.media[0].type === 'document' && (
                <DocumentMessage isMe={false} file={message.media[0]} />
              )}
            </div>
          </Fragment>
        )}
        {message?.call && <CallMessage message={message} />}
      </div>
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
    if (message.status === 'removed') {
      setContentDisplay(message.content);
      return;
    }
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
    <div className="flex flex-col">
      <span className="text-sm font-normal">{contentDisplay}</span>
      {message?.contentEnglish &&
        message.status !== 'removed' &&
        showMiddleTranslation && (
          <div className="relative mt-2">
            <TriangleSmall
              fill="#e6e6e6"
              position="top"
              className="absolute left-4 top-0 -translate-y-full"
            />
            <div className="rounded-xl bg-neutral-50 p-3 py-2 text-neutral-600">
              <Text
                value={message.contentEnglish}
                className="text-start text-sm font-light"
              />
            </div>
          </div>
        )}
    </div>
  );
};

const CallMessage = ({ message }: { message: Message }) => {
  const { call, sender } = message;
  const { content, icon, subContent } = useMemo((): {
    content: string;
    icon: React.ReactNode;
    subContent?: string;
  } => {
    if (call?.endTime) {
      return {
        content: 'Call end at ' + moment(call.endTime).format('HH:mm'),
        subContent: convertToTimeReadable(
          call.createdAt as string,
          call.endTime,
        ),
        icon: (
          <PhoneIcon className="mr-2 inline-block h-4 w-4 rotate-[135deg]" />
        ),
      };
    }
    return {
      content: sender.name + ' has started a call',
      icon: <PhoneCallIcon className="mr-2 inline-block h-4 w-4" />,
    };
  }, [call?.createdAt, call?.endTime, sender.name]);
  return (
    <div>
      <div>
        <span
          className={cn(
            textVariants({ position: 'left', status: message.status }),
          )}
        >
          {icon}
          {content}
          <div className="mt-1 text-sm font-light">{subContent}</div>
        </span>
      </div>
    </div>
  );
};
