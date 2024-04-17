import { useEffect, useMemo, useState } from 'react';
import {
  textMiddleVariants,
  textVariants,
  wrapperMiddleVariants,
  wrapperVariants,
} from './message-item-text.style';

import { TriangleSmall } from '@/components/icons/triangle-small';
import { RichTextView } from '@/components/rich-text-view';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useChatStore } from '@/features/chat/stores';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useAuthStore } from '@/stores/auth.store';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { cn } from '@/utils/cn';
import { VariantProps } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { Message } from '../../types';
import { messageApi } from '../../api';

export interface ContentProps extends VariantProps<typeof wrapperVariants> {
  message: Message;
  setLinks?: (links: string[]) => void;
}

export const Content = ({ position, active, message }: ContentProps) => {
  const { userLanguage, currentUserId } = useAuthStore((state) => ({
    userLanguage: state.user?.language,
    currentUserId: state.user?._id,
  }));

  const showMiddleTranslation = useChatStore(
    (state) => state.showMiddleTranslation,
  );
  const isMe = message.sender._id === currentUserId;
  const enContent = message.translations?.en;
  const showEnContent = useMemo(() => {
    if (!enContent) return false;
    if (message.status === 'removed') return false;
    if (!showMiddleTranslation) return false;
    if (message.language === DEFAULT_LANGUAGES_CODE.EN && isMe) return false;
    return true;
  }, [
    enContent,
    isMe,
    message.language,
    message.status,
    showMiddleTranslation,
  ]);
  const { t } = useTranslation('common');
  const { isHelpDesk } = useBusinessNavigationData();
  const { room } = useBusinessExtensionStore();

  const receiverLanguage = useMemo(() => {
    return isHelpDesk
      ? room?.participants?.find((p) => p.status === 'anonymous')?.language
      : userLanguage;
  }, [room, isHelpDesk, userLanguage]);

  const [contentDisplay, setContentDisplay] = useState(message.content);
  useEffect(() => {
    if (message.status === 'removed') {
      setContentDisplay(t('CONVERSATION.UNSEND_A_MESSAGE'));
      return;
    }
    if (
      (!isHelpDesk && message.language === userLanguage) ||
      isMe ||
      (isHelpDesk && position === 'right')
    ) {
      setContentDisplay(message.content);
      return;
    }
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
  }, [
    message.content,
    message.sender.language,
    message.status,
    message.language,
    message.sender._id,
    message.translations,
    receiverLanguage,
    currentUserId,
    t,
    isHelpDesk,
    userLanguage,
    isMe,
    position,
    message._id,
  ]);
  return (
    <div
      className={cn(
        wrapperVariants({ active, position, status: message.status }),
        position === 'right' ? 'me' : '',
      )}
    >
      <div className={cn(textVariants({ position, status: message.status }))}>
        <RichTextView
          editorStyle="text-base md:text-sm"
          mentions={
            message?.mentions?.map((mention) => ({
              id: mention._id,
              label: mention.name,
            })) || []
          }
          mentionClassName={position === 'right' ? 'right' : 'left'}
          content={contentDisplay}
        />
      </div>
      {showEnContent && (
        <div className="relative mt-2">
          <TriangleSmall
            position="top"
            className={cn(
              'absolute left-4 top-0 -translate-y-full fill-primary-400',
            )}
            pathProps={{
              className:
                position === 'right' ? 'fill-primary-400' : 'fill-[#e6e6e6]',
            }}
          />
          <div
            className={cn(
              wrapperMiddleVariants({
                position,
                active,
                status: message.status,
              }),
            )}
          >
            <div
              className={cn(
                textMiddleVariants({ position, status: message.status }),
              )}
            >
              <RichTextView
                mentionClassName={position === 'right' ? 'right' : 'left'}
                editorStyle="font-light text-base md:text-sm"
                content={enContent || ''}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
