import { User } from '@/features/users/types';
import { patch } from './api.service';

export const updateInfoUserService = (data: any) => {
  return patch('/users/update', { ...data });
};

export const updateInfoGuestService = (data: {
  phoneNumber?: string;
  userId: User['_id'];
  spaceId: string;
}) => {
  return patch('/help-desk/edit-client-profile', { ...data });
};

export const changePasswordUserService = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return patch('/users/change-password', { ...data });
};
