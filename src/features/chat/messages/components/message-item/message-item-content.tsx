import {
  textMiddleVariants,
  textVariants,
  wrapperMiddleVariants,
  wrapperVariants,
} from './message-item-text.style';
import { useEffect, useState } from 'react';

import { Message } from '../../types';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { translateText } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/features/chat/store';
import { RichTextView } from '@/components/rich-text-view';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useBusiness } from '@/hooks/use-business';

export interface ContentProps extends VariantProps<typeof wrapperVariants> {
  message: Message;
  setLinks?: (links: string[]) => void;
}

export const Content = ({ position, active, message }: ContentProps) => {
  const showMiddleTranslation = useChatStore(
    (state) => state.showMiddleTranslation,
  );
  const { isHelpDesk } = useBusiness();
  const { userLanguage, currentUserId } = useAuthStore((state) => ({
    userLanguage: state.user?.language,
    currentUserId: state.user?._id,
  }));
  console.log('message.content', message.content)
  const [contentDisplay, setContentDisplay] = useState(message.content);
  useEffect(() => {
    if (message.status === 'removed') {
      setContentDisplay(message.content);
      return;
    }

    if (
      message.language === userLanguage ||
      message.sender._id === currentUserId
      || isHelpDesk
    ) {
      setContentDisplay(message.content);
      return;
    }
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
    message.sender._id,
    currentUserId,
  ]);
  const isMe = message.sender._id === currentUserId;
  return (
    <div
      className={cn(
        wrapperVariants({ active, position, status: message.status }),
      )}
    >
      <div className={cn(textVariants({ position, status: message.status }))}>
        <RichTextView
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
      {message?.contentEnglish &&
        message.status !== 'removed' &&
        showMiddleTranslation &&
        !(message.language === DEFAULT_LANGUAGES_CODE.EN && isMe) && (
          <div className="relative mt-2">
            <TriangleSmall
              fill={position === 'right' ? '#72a5e9' : '#e6e6e6'}
              position="top"
              className="absolute left-4 top-0 -translate-y-full"
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
                  editorStyle="font-light text-sm"
                  content={message.contentEnglish}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
