import { axios } from '@/lib/axios';
import { get, post, put } from './api.service';

export const createExtension = (data: {
  domains: Array<string>;
  color: string;
  language: string;
  firstMessage: string;
  spaceId: string;
}) => {
  return put(`/help-desk/spaces/${data.spaceId}/extensions`, data);
};

export const deleteExtension = (extensionId: string) => {
  return axios.delete('/help-desk/extensions/' + extensionId);
};

export const startAGuestConversation = (data: {
  businessId: string;
  name: string;
  language: string;
  fromDomain?: string;
  email: string;
}) => {
  return post('/help-desk/clients', data);
};

export const endConversation = (data: { roomId: string; senderId: string }) => {
  return post('/messages/end-conversation', data);
};
