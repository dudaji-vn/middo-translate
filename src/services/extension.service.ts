import { get, post, put } from './api.service';

export const createExtensionService = (data: {
  domains: Array<string>;
  color: string;
  language: string;
  firstMessage: string;
}) => {
  return put('/help-desk/create-or-edit-business', data);
};

export const getExtensionService = () => {
  return get('/help-desk/my-business');
};


export const startAGuestConversationService = (data: {
  businessId: string;
  name: string;
  language: string;
  email: string;
}) => {
  return post('/help-desk/create-client', data);
};
