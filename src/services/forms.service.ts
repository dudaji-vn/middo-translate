import { axios } from '@/lib/axios';
import { get, put } from './api.service';
import { BusinessForm } from '@/types/forms.type';

const baseUrl = '/help-desk/spaces/';

export const createOrEditBusinessForm = (data: Partial<BusinessForm>) => {
  const { spaceId, _id, ...rest } = data;
  const apiURL = `${baseUrl}${spaceId}/forms${_id ? `/${_id}` : ''}`;
  return put(apiURL, rest);
};

export const deleteBusinessForms = (data: {
  spaceId: string;
  formIds: string[];
}) => {
  const { spaceId, formIds } = data;
  return axios.delete(`${baseUrl}${spaceId}/forms`, {
    data: {
      formIds,
    },
  });
};

export const getBusinessForm = (
  spaceId: string,
  formId: string,
) => {
  return get(`${baseUrl}${spaceId}/forms/${formId}`);
};
