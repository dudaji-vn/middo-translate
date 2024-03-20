import { Message } from '../types';
import { translateText } from '@/services/languages.service';
import { useAuthStore } from '@/stores/auth.store';
import { useTextCopy } from '@/hooks/use-text-copy';
import { convert } from 'html-to-text';

export const useCopyMessage = () => {
  const userLanguage = useAuthStore((state) => state.user?.language);
  const { copy } = useTextCopy();
  const copyMessage = async (message: Message) => {
    const plaintext = convert(message.content, {
      selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    });
    const translated = await translateText(
      plaintext,
      message?.language || message.sender.language,
      userLanguage,
    );
    copy(translated);
  };

  return { copyMessage };
};
