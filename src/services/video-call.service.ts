import { post, get } from './api.service';

export const joinVideoCallRoom = (data: any) => {
  return post('/call', { ...data });
};
export const getVideoCall = (callSlug: string) => {
  return get(`/call/${callSlug}`);
};
