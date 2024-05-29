import { useTextCopy } from '@/hooks/use-text-copy';
import { useAuthStore } from '@/stores/auth.store';
import { convert } from 'html-to-text';
import { Message } from '../types';

export const useCopyMessage = () => {
  const user = useAuthStore((state) => state.user);
  const userLanguage = user?.language;
  const { copy } = useTextCopy();
  const copyMessage = async (message: Message) => {
    let content = message.content;
    const isMe = message.sender._id === user?._id;
    if (message.translations && message.translations[userLanguage!] && !isMe) {
      content = message.translations[userLanguage!];
    }
    const plaintext = convert(content, {
      selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    });
    copy(plaintext);
  };

  return { copyMessage };
};
