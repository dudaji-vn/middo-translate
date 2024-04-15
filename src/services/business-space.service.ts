import { axios } from '@/lib/axios';
import { get, post, put } from './api.service';
import { Member } from '@/app/(main-layout)/(protected)/business/_components/spaces-crud/sections/members-columns';

export const createSpaceService = (data: {
  name: string;
  avatar?: string;
  backgroundImage?: string;
  members?: Member[];
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
