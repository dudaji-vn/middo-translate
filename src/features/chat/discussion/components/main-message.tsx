import { Avatar } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { RichTextView } from '@/components/rich-text-view';
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
import { useTranslation } from 'react-i18next';

export interface MainMessageProps {
  message: Message;
  className?: string;
}

export const MainMessage = ({ message, className }: MainMessageProps) => {
  const sender = message.sender;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-2">
        <Avatar size="xs" src={sender.avatar} alt={sender.name} />
        <span className="max-w-80 break-words text-sm font-semibold">
          {sender.name}
        </span>
      </div>
      <div className="ml-8 mt-1">
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
  const {t} = useTranslation('common');
  const userLanguage = useAuthStore((state) => state.user?.language);
  const [contentDisplay, setContentDisplay] = useState(message.content);
  useEffect(() => {
    if (message.status === 'removed') {
      setContentDisplay(t('CONVERSATION.REMOVED_A_MESSAGE'));
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
  }, [userLanguage, message, t]);
  return (
    <div className="flex flex-col">
      <RichTextView mentionClassName="left" content={contentDisplay} />
      {message?.contentEnglish &&
        message.status !== 'removed' &&
        showMiddleTranslation && (
          <div className="relative mt-2">
            <TriangleSmall
              fill="#f2f2f2"
              position="top"
              className="absolute left-4 top-0 -translate-y-full"
            />
            <div className="rounded-xl bg-neutral-50 p-3 py-2 text-neutral-600">
              <RichTextView
                mentionClassName="left"
                content={message.contentEnglish}
              />
            </div>
          </div>
        )}
    </div>
  );
};

const CallMessage = ({ message }: { message: Message }) => {
  const { call } = message;
  const {t} = useTranslation('common');
  const { content, icon, subContent } = useMemo((): {
    content: string;
    icon: React.ReactNode;
    subContent?: string;
  } => {
    if (call?.endTime) {
      return {
        content: t('CONVERSATION.CALL_END_AT', {time: moment(call.endTime).format('HH:mm')}),
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
      content: t('CONVERSATION.STARTED_CALL'),
      icon: <PhoneCallIcon className="mr-2 inline-block h-4 w-4" />,
    };
  }, [call?.createdAt, call?.endTime, t]);
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
