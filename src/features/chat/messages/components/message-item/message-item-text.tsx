import { useEffect, useState } from 'react';

import { Message } from '../../types';
import { Text } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { cn } from '@/utils/cn';
import { translateText } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { useChatStore } from '@/features/chat/store';

export interface TextMessageProps {
  isMe: boolean;
  message: Message;
}

export const TextMessage = ({ isMe, message }: TextMessageProps) => {
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
        'px-3 py-2',
        isMe ? 'bg-primary' : 'bg-neutral-50',
        message.status === 'removed' && 'bg-transparent',
      )}
    >
      <span
        className={cn(
          'break-word-mt text-start text-sm',
          isMe && 'text-background',
          message.status === 'removed' && 'text-neutral-300',
        )}
      >
        {contentDisplay}
      </span>
      {message?.contentEnglish &&
        message.status !== 'removed' &&
        showMiddleTranslation && (
          <div className="relative mt-2">
            <TriangleSmall
              fill={isMe ? '#72a5e9' : '#e6e6e6'}
              position="top"
              className="absolute left-4 top-0 -translate-y-full"
            />
            <div
              className={cn(
                'mb-1 mt-2 rounded-xl p-1 px-3',
                isMe
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
