import { useMutation } from '@tanstack/react-query';

import { CreateMessage, messageApi } from '../api';
import { Message } from '../types';
export type SendMessageProps = {
  roomId: string;
  isAnonymous?: boolean;
  addMessage: (message: Message) => void;
  parentId?: string;
  onSuccess?: (data: Message, variables: CreateMessage) => void;
};
export const useSendMessage = ({
  onSuccess,
}: { onSuccess?: (data: Message, variables: CreateMessage) => void } = {}) => {
  const { mutateAsync } = useMutation({
    mutationFn: messageApi.send,
    onSuccess(data, variables) {
      onSuccess?.(data, variables);
    },
  });
  return { sendMessage: mutateAsync };
};
