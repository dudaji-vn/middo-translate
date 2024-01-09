import { Message } from '../types';
import { translateText } from '@/services/languages';
import { useAuthStore } from '@/stores/auth';
import { useTextCopy } from '@/hooks/use-text-copy';

export const useCopyMessage = () => {
  const userLanguage = useAuthStore((state) => state.user?.language);
  const { copy } = useTextCopy();
  const copyMessage = async (message: Message) => {
    const translated = await translateText(
      message.content,
      message?.language || message.sender.language,
      userLanguage,
    );
    copy(translated);
  };

  return { copyMessage };
};
