import { post } from './api.service';

export const getMessageIdFromCallIdService = (callId: string) => {
  return post('/messages/get-message-id-from-call-id', { callId });
};

