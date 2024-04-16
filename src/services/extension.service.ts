import { axios } from '@/lib/axios';
import { get, post, put } from './api.service';

export const createExtension = (data: {
  domains: Array<string>;
  color: string;
  language: string;
  firstMessage: string;
  spaceId?: string;
}) => {
  return put('/help-desk/create-or-edit-business', data);
};

export const deleteExtension = () => {
  return axios.delete('/help-desk');
};

export const startAGuestConversation = (data: {
  businessId: string;
  name: string;
  language: string;
  email: string;
}) => {
  return post('/help-desk/create-client', data);
};
