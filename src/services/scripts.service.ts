import { axios } from '@/lib/axios';
import { get, put } from './api.service';
import { TChatScript } from '@/types/scripts.type';

export const createOrEditChatScript = (data: TChatScript) => {
  const { spaceId, ...rest } = data;
  const apiURL = `/spaces/${spaceId}/scripts/${spaceId}`;
  return put(apiURL, rest);
};

export const deleteChatScript = (spaceId: string, scriptId: string) => {
  return axios.delete(`/spaces/${spaceId}/scripts/${scriptId}`);
};

export const getChatScript = (spaceId: string, scriptId: string) => {
  return get(`/spaces/${spaceId}/scripts/${scriptId}`);
};
