import { axios } from '@/lib/axios';
import { get, post, put } from './api.service';

export const createExtension = (
  spaceId: string,
  data: {
    domains: Array<string>;
    color: string;
    language: string;
    firstMessage: string;
  },
) => {
  return put(`/help-desk/spaces/${spaceId}/extensions`, data);
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

export const trackGuest = async ({
  extensionId,
  domain,
}: {
  domain: string;
  extensionId: string;
}) => {
  try {
    const response = await fetch(`/help-desk/${extensionId}/visitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data?.data;
  } catch (error) {
    console.error('Error in track visitor on domain', error);
    return undefined;
  }
};

export const endConversation = (data: { roomId: string; senderId: string }) => {
  return post('/messages/end-conversation', data);
};
