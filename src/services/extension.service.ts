import { axios } from '@/lib/axios';
import { get, post, put } from './api.service';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';

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
  trackingId,
}: {
  domain: string;
  extensionId: string;
  trackingId?: string;
}) => {
  try {
    console.log('tracking-Guest', extensionId, domain, trackingId);
    const response = await fetch(
      `${NEXT_PUBLIC_URL}/api/help-desk/${extensionId}/visitor`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: 'http://localhost:3000/',
          ...(trackingId && { trackingId }),
        }),
      },
    );
    return await response.json();
  } catch (error) {
    console.error('Error in track visitor on domain', error);
    return undefined;
  }
};

export const endConversation = (data: { roomId: string; senderId: string }) => {
  return post('/messages/end-conversation', data);
};
