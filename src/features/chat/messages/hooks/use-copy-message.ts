import { useTextCopy } from '@/hooks/use-text-copy';
import { useAuthStore } from '@/stores/auth.store';
import { convert } from 'html-to-text';
import { Message } from '../types';

export const useCopyMessage = () => {
  const user = useAuthStore((state) => state.user);
  const userLanguage = user?.language;
  const { copy } = useTextCopy();
  const copyMessage = async (message: Message, useOriginal?: boolean) => {
    let content = message.content;
    if (useOriginal) {
      content = message.content;
    } else {
      const isMe = message.sender._id === user?._id;
      if (
        message.translations &&
        message.translations[userLanguage!] &&
        !isMe
      ) {
        content = message.translations[userLanguage!];
      }
    }
    const plaintext = convert(content, {
      selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    });
    copy(plaintext);
  };
  const copyHtml = async (content: string) => {
    const plaintext = convert(content, {
      selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    });
    copy(plaintext);
  };
  return { copyMessage, copyHtml };
};
