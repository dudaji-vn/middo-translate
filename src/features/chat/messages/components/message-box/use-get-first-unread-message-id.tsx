import { useEffect, useState } from 'react';
import { Message } from '../../types';

export const useGetFirstUnreadMessageId = ({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId?: string | null;
}) => {
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState<
    string | null
  >(null);
  useEffect(() => {
    if (firstUnreadMessageId || !currentUserId) return;
    let id = null;
    messages.forEach((message) => {
      if (
        !message.readBy?.includes(currentUserId) &&
        message.status === 'sent'
      ) {
        id = message._id;
      }
    });
    setFirstUnreadMessageId(id);
  }, [currentUserId, firstUnreadMessageId, messages]);
  return { firstUnreadMessageId };
};
