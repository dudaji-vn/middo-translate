import { axios } from '@/lib/axios';
import { get, put } from './api.service';
import { TChatScript } from '@/types/scripts.type';

export const createOrEditChatScript = (data: Partial<TChatScript>) => {
  const { spaceId, _id, ...rest } = data;
  const apiURL = `/spaces/${spaceId}/scripts${_id ? `/${_id}` : ''}`;
  return put(apiURL, rest);
};

export const deleteChatScript = (spaceId: string, scriptId: string) => {
  return axios.delete(`/spaces/${spaceId}/scripts/${scriptId}`);
};

export const getChatScript = (spaceId: string, scriptId: string) => {
  return get(`/spaces/${spaceId}/scripts/${scriptId}`);
};
