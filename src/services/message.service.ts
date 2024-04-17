import { get, post } from './api.service';

export const getMessageIdFromCallIdService = (callId: string) => {
  return post('/messages/get-message-id-from-call-id', { callId });
};

export const checkSeenMessage = (id: string) => {
  // const res: Response<{
  //   seen: boolean;
  // }> = await axiosWithInterceptor.get(`${basePath}/${id}/seen`);
  // return res.data;\

  return get(`/messages/${id}/seen`);
}