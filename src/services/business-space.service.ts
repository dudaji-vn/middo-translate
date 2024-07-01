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
  return put('/help-desk/spaces', data);
};
export const deleteSpace = (spaceId: string) => {
  return axios.delete(`/help-desk/spaces/${spaceId}`);
};

export const inviteMembersToSpace = (data: {
  members: Array<{ email: string; role: string }>;
  spaceId: string;
}) => {
  return post(`/help-desk/spaces/${data.spaceId}/invite-members`, data);
};
export const resendInvitation = (data: {
  email: string;
  role: string;
  spaceId: string;
}) => {
  const { spaceId, ...rest } = data;
  return post(`/help-desk/spaces/${spaceId}/resend-invitation`, rest);
};

export const validateInvitation = (data: {
  token: string;
  status: 'accept' | 'decline';
}) => {
  return post('/help-desk/validate-invite', data);
};

export const getInvitationByToken = (token: string) => {
  return get(`/help-desk/space-verify/${token}`);
};

export const removeMemberFromSpace = (data: {
  email: string;
  spaceId: string;
}) => {
  const { spaceId, ...rest } = data;
  return axios.delete(`/help-desk/spaces/${spaceId}/remove-member`, {
    data: rest,
  });
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
  return put(`help-desk/spaces/${data.spaceId}/tags`, data);
};

export const deleteTag = ({
  tagId,
  spaceId,
}: {
  tagId: string;
  spaceId: string;
}) => {
  return axios.delete(`/help-desk/spaces/${spaceId}/tags/${tagId}`, {
    data: { spaceId },
  });
};

export const changeRoleMember = (data: {
  email: string;
  role: string;
  spaceId: string;
}) => {
  return axios.patch(`/help-desk/spaces/${data.spaceId}/change-role`, data);
};
