import { axios } from '@/lib/axios';
import { get, put } from './api.service';
import { TChatScript } from '@/types/scripts.type';

const baseUrl = '/help-desk/spaces/';

export const createOrEditChatScript = (data: Partial<TChatScript>) => {
  const { spaceId, _id, ...rest } = data;
  const apiURL = `${baseUrl}${spaceId}/scripts${_id ? `/${_id}` : ''}`;
  return put(apiURL, rest);
};

export const deleteChatScript = (data: {
  spaceId: string;
  scriptId: string;
}) => {
  const { spaceId, scriptId } = data;
  return axios.delete(`${baseUrl}${spaceId}/scripts/${scriptId}`);
};

export const getChatScript = (spaceId: string, scriptId: string) => {
  return get(`${baseUrl}${spaceId}/scripts/${scriptId}`);
};
