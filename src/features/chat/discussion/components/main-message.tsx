import { Avatar } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { RichTextView } from '@/components/rich-text-view';
import { cn } from '@/utils/cn';
import { convertToTimeReadable } from '@/utils/time';
import { Clock9Icon, PhoneCallIcon, PhoneIcon } from 'lucide-react';
import moment from 'moment';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDisplayContent } from '../../messages/hooks/use-display-content';
import { Message } from '../../messages/types';
import { useChatStore } from '../../stores';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslatedFromText } from '@/hooks/use-translated-from-text';
import { useBoolean } from 'usehooks-ts';
import { useAppStore } from '@/stores/app.store';
import { ImageGallery } from '../../messages/components/message-item/message-item-image-gallery';
import { DocumentMessage } from '../../messages/components/message-item/message-item-document';
import { MessageItemVideo } from '../../messages/components/message-item/message-item-video';
import { textVariants } from '../../messages/components/message-item/message-item-text.style';

export interface MainMessageProps {
  message: Message;
  className?: string;
}

export const MainMessage = ({ message, className }: MainMessageProps) => {
  const sender = message.sender;

  const { toggle: toggleClick, value } = useBoolean(false);

  const translatedFrom = useTranslatedFromText({
    languageCode: message.language,
  });

  return (
    <div
      onClick={toggleClick}
      className={cn('flex cursor-pointer flex-col', className)}
    >
      <div className="flex items-center gap-2">
        <Avatar size="xs" src={sender.avatar} alt={sender.name} />
        <span className="max-w-80 flex-1 overflow-hidden break-words text-sm font-semibold">
          {sender.name}
        </span>
      </div>
      <div className="ml-2 mt-1">
        {message.content && <TextMessage isActive={value} message={message} />}
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

      <div className="mt-2 flex flex-wrap items-center gap-2 pl-8 text-xs text-neutral-300">
        {translatedFrom && (
          <span className="whitespace-nowrap">{translatedFrom}</span>
        )}
        <span className="flex items-center whitespace-nowrap text-xs">
          <Clock9Icon className="mr-1 inline-block size-3" />
          {moment(message.createdAt).format('lll')}
        </span>
      </div>
    </div>
  );
};

const TextMessage = ({
  message,
  isActive,
}: {
  message: Message;
  isActive: boolean;
}) => {
  const theme = useAppStore((state) => state.theme);
  const enContent = message.translations?.en;
  const showMiddleTranslation = useChatStore(
    (state) => state.showMiddleTranslation,
  );
  const userLanguage = useAuthStore((state) => state.user?.language);

  const { contentDisplay, isUseOriginal } = useDisplayContent({
    message,
    userLanguage,
  });
  return (
    <div className="flex flex-col pl-6">
      <RichTextView
        editorStyle={cn('text-base md:text-sm', {
          translated: !isUseOriginal,
        })}
        mentionClassName="left"
        content={contentDisplay}
      />
      {enContent &&
        message.status !== 'removed' &&
        (showMiddleTranslation || isActive) && (
          <div className="relative mt-2">
            <TriangleSmall
              fill={theme == 'light' ? '#f2f2f2' : '#191919'}
              position="top"
              className="absolute left-4 top-0 -translate-y-full"
            />
            <div className="rounded-xl bg-neutral-50 p-3 py-2 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-50">
              <RichTextView
                editorStyle="text-base md:text-sm translated"
                mentionClassName="left"
                content={enContent}
              />
            </div>
          </div>
        )}
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
        subContent:
          convertToTimeReadable(call.startTime || call.endTime, call.endTime) ||
          '0s',
        icon: (
          <PhoneIcon className="mr-2 inline-block h-4 w-4 rotate-[135deg]" />
        ),
      };
    }
    return {
      content: t('CONVERSATION.STARTED_CALL'),
      icon: <PhoneCallIcon className="mr-2 inline-block h-4 w-4" />,
    };
  }, [call?.endTime, call?.startTime, t]);
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
