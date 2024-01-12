import { textVariants, wrapperVariants } from './message-item-text.style';
import { useEffect, useState } from 'react';

import { Message } from '../../types';
import { Text } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { translateText } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/features/chat/store';

export interface TextMessageProps extends VariantProps<typeof wrapperVariants> {
  message: Message;
}

export const TextMessage = ({
  position,
  active,
  status,
  message,
}: TextMessageProps) => {
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
    <div
      className={cn(
        wrapperVariants({ active, position, status: message.status }),
      )}
    >
      <span className={cn(textVariants({ position, status: message.status }))}>
        {contentDisplay}
      </span>
      {message?.contentEnglish &&
        message.status !== 'removed' &&
        showMiddleTranslation && (
          <div className="relative mt-2">
            <TriangleSmall
              fill={position === 'right' ? '#72a5e9' : '#e6e6e6'}
              position="top"
              className="absolute left-4 top-0 -translate-y-full"
            />
            <div
              className={cn(
                'mb-1 mt-2 rounded-xl p-1 px-3',
                position === 'right'
                  ? 'bg-primary-400 text-background'
                  : 'bg-neutral-100 text-neutral-600',
              )}
            >
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
