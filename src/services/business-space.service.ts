import { axios } from '@/lib/axios';
import { get, post, put } from './api.service';
import { Member } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/spaces-crud/sections/members-columns';

export const createOrEditSpace = (data: {
  name: string;
  avatar?: string;
  backgroundImage?: string;
  members?: Member[];
  spaceId?: string;
}) => {
  return put('/help-desk/create-or-edit-space', data);
};
export const deleteSpace = (spaceId: string) => {
  return axios.delete(`/help-desk/spaces/${spaceId}`);
};

export const inviteMembersToSpace = (data: {
  members: Array<{ email: string; role: string }>;
  spaceId: string;
}) => {
  return put('/help-desk/invite-member', data);
};
export const resendInvitation = (data: {
  email: string;
  role: string;
  spaceId: string;
}) => {
  return post('/help-desk/resend-invitation', data);
};

export const validateInvitation = (data: {
  token: string;
  status: 'accept' | 'decline';
}) => {
  return post('/help-desk/validate-invite', data);
};

export const removeMemberFromSpace = (data: {
  email: string;
  spaceId: string;
}) => {
  return axios.delete('/help-desk/remove-member', { data });
};

export const getSpaces = (type: 'joined-spaces' | undefined | null) => {
  const queryParams = type ? `?type=${type}` : '';
  return get(`/help-desk/spaces` + queryParams);
};

export const createOrEditTag = (data: {
  name: string;
  color: string;
  tagId?: string;
  spaceId: string;
}) => {
  return put('/help-desk/create-or-edit-tag', data);
};

export const deleteTag = ({
  tagId,
  spaceId,
}: {
  tagId: string;
  spaceId: string;
}) => {
  return axios.delete(`/help-desk/tags/${tagId}`, { data: { spaceId } });
};
