import { get, post, put } from './api.service';
import { Member } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/spaces-crud/sections/members-columns';

export const createSpace = (data: {
  name: string;
  avatar?: string;
  backgroundImage?: string;
  members?: Member[];
  spaceId?: string;
}) => {
  return put('/help-desk/create-or-edit-space', data);
};

export const inviteMemberToSpace = (data: {
  email: string;
  role: string;
  spaceId: string;
}) => {
  return put('/help-desk/invite-member', data);
};
export const resendInvitation = (data: {
  email: string;
  role: string;
  spaceId: string;
}) => {
  return put('/help-desk/resend-invitation', data);
};


export const removeMemberFromSpace = (data: {
  email: string;
  spaceId: string;
}) => {
  return post('/help-desk/remove-member', data);
};


export const getSpaces = (type: 'joined-spaces' | undefined | null) => {
  const queryParams = type ? `?type=${type}` : '';
  return get(`/help-desk/spaces` + queryParams);
};
