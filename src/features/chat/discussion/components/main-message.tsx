import { Avatar } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { RichTextView } from '@/components/rich-text-view';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { convertToTimeReadable } from '@/utils/time';
import { Clock9Icon, PhoneCallIcon, PhoneIcon } from 'lucide-react';
import moment from 'moment';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { DocumentMessage } from '../../messages/components/message-item/message-item-document';
import { ImageGallery } from '../../messages/components/message-item/message-item-image-gallery';
import { textVariants } from '../../messages/components/message-item/message-item-text.style';
import { Message } from '../../messages/types';
import { useChatStore } from '../../stores';
import { useTranslation } from 'react-i18next';
import { messageApi } from '../../messages/api';
import { MessageItemVideo } from '../../messages/components/message-item/message-item-video';
import { getLanguageByCode } from '@/utils/language-fn';

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
      <div className="ml-2 mt-1">
        {message.content && <TextMessage message={message} />}
        {message?.media && message.media.length > 0 && (
          <div className="ml-6">
            {message.media[0].type === 'image' && (
              <ImageGallery images={message.media} />
            )}
            <div className="flex w-fit justify-start">
              {message.media[0].type === 'document' && (
                <DocumentMessage isMe={false} file={message.media[0]} />
              )}
            </div>
            {message.media[0].type === 'video' && (
              <MessageItemVideo file={message.media[0]} />
            )}
          </div>
        )}
        {message?.call && <CallMessage message={message} />}
      </div>

      <span className="mt-2 flex items-center pl-8 pr-3 text-xs text-neutral-300">
        <Clock9Icon className="mr-1 inline-block size-3" />
        {moment(message.createdAt).format('lll')}
      </span>
    </div>
  );
};

const TextMessage = ({ message }: { message: Message }) => {
  const isMe = message.sender._id === useAuthStore.getState().user?._id;
  const enContent = message.translations?.en;
  const showMiddleTranslation = useChatStore(
    (state) => state.showMiddleTranslation,
  );
  const { t } = useTranslation('common');
  const userLanguage = useAuthStore((state) => state.user?.language);
  const [contentDisplay, setContentDisplay] = useState(message.content);
  useEffect(() => {
    if (message.status === 'removed') {
      setContentDisplay(t('CONVERSATION.REMOVED_A_MESSAGE'));
      return;
    }
    if (userLanguage === message.language || isMe) return;
    const translate = async () => {
      let translated = message.translations?.[userLanguage!];
      if (!translated) {
        try {
          const messageRes = await messageApi.translate({
            id: message._id,
            to: userLanguage!,
          });
          if (messageRes.translations)
            translated = messageRes.translations[userLanguage!];
        } catch (error) {
          console.error('Translate error', error);
        }
      }
      setContentDisplay(translated || message.content);
    };
    translate();
  }, [userLanguage, message, t, isMe]);
  return (
    <div className="flex flex-col pl-6">
      <RichTextView
        editorStyle="text-base md:text-sm"
        mentionClassName="left"
        content={contentDisplay}
      />
      {enContent && message.status !== 'removed' && showMiddleTranslation && (
        <div className="relative mt-2">
          <TriangleSmall
            fill="#f2f2f2"
            position="top"
            className="absolute left-4 top-0 -translate-y-full"
          />
          <div className="rounded-xl bg-neutral-50 p-3 py-2 text-neutral-600">
            <RichTextView
              editorStyle="text-base md:text-sm"
              mentionClassName="left"
              content={enContent}
            />
          </div>
        </div>
      )}
      <span className="mt-2 flex items-center pr-3 text-xs text-neutral-300">
        Translated from {getLanguageByCode(message.language)?.name}
      </span>
    </div>
  );
};

const CallMessage = ({ message }: { message: Message }) => {
  const { call } = message;
  const { t } = useTranslation('common');
  const { content, icon, subContent } = useMemo((): {
    content: string;
    icon: React.ReactNode;
    subContent?: string;
  } => {
    if (call?.endTime) {
      return {
        content: t('CONVERSATION.CALL_END_AT', {
          time: moment(call.endTime).format('HH:mm'),
        }),
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
    <div className="pl-6">
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
