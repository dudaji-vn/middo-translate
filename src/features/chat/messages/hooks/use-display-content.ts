import { useAuthStore } from '@/stores/auth.store';
import { Message } from '../types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { messageApi } from '../api';
import { useTranslatedFromText } from '@/hooks/use-translated-from-text';

export const useDisplayContent = ({
  message,
  userLanguage,
}: {
  message: Message;
  userLanguage?: string;
}) => {
  const isMe = message.sender._id === useAuthStore.getState().user?._id;
  const translatedFrom = useTranslatedFromText({
    languageCode: message.language,
  });
  const [contentDisplay, setContentDisplay] = useState(message.content);
  const [isUseOriginal, setIsUseOriginal] = useState(true);
  const { t } = useTranslation('common');

  useEffect(() => {
    if (message.status === 'removed') {
      setContentDisplay(t('CONVERSATION.REMOVED_A_MESSAGE'));
      return;
    }
    if (userLanguage === message.language || isMe) {
      setContentDisplay(message.content);
      setIsUseOriginal(true);
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
          if (messageRes.translations) {
            translated = messageRes.translations[userLanguage!];
          }
        } catch (error) {
          console.error('Translate error', error);
        }
      }
      if (translated) {
        setIsUseOriginal(false);
      }
      setContentDisplay(translated || message.content);
    };
    translate();
  }, [
    isMe,
    message._id,
    message.content,
    message.language,
    message.status,
    message.translations,
    t,
    userLanguage,
  ]);
  return { contentDisplay, isUseOriginal, translatedFrom };
};
