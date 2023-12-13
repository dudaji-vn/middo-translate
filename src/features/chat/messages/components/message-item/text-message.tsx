import { useEffect, useMemo, useState } from 'react';

import { Message } from '../../types';
import { Text } from '@/components/data-display';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { cn } from '@/utils/cn';
import { translateText } from '@/services/languages';
import { useAuthStore } from '@/stores/auth';
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
    if (userLanguage === message.sender.language) return;
    const translateContent = async () => {
      const translated = await translateText(
        message.contentEnglish || message.content,
        message.sender.language,
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
  ]);
  return (
    <div
      className={cn(
        'p-4',
        isMe ? 'bg-primary' : 'bg-colors-neutral-50',
        message.status === 'removed' && 'bg-transparent',
      )}
    >
      <span
        className={cn(
          'break-word-mt',
          isMe && 'text-background',
          message.status === 'removed' && 'text-neutral-300',
        )}
      >
        {contentDisplay}
      </span>
      {message?.contentEnglish && showMiddleTranslation && (
        <div className="relative mt-2">
          <TriangleSmall
            fill={isMe ? '#72a5e9' : '#e6e6e6'}
            position="top"
            className="absolute left-4 top-0 -translate-y-full"
          />
          <div
            className={cn(
              'mt-2 rounded-xl  p-3',
              isMe
                ? 'bg-colors-primary-400 text-background'
                : 'bg-colors-neutral-100 text-colors-neutral-600',
            )}
          >
            <Text
              value={message.contentEnglish}
              className="text-sm font-light "
            />
          </div>
        </div>
      )}
    </div>
  );
};
