import { axios } from '@/lib/axios';
import { get, post, put } from './api.service';

export const createSpaceService = (data: {
  name: string;
  avatar?: string;
  backgroundImage?: string;
}) => {
  return put('/help-desk/create-or-edit-space', data);
};

export const inviteMemberService = (data: {
  email: string;
  role: string;
  spaceId?: string;
}) => {
  return put('/help-desk/invite-member', data);
};
