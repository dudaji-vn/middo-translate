import { User } from '@/features/users/types';
import { patch } from './api.service';
import { Room } from '@/features/chat/rooms/types';

export const updateInfoUserService = (data: any) => {
  return patch('/users/update', { ...data });
};

export const updateInfoGuestService = (data: {
  phoneNumber?: string;
  userId: User['_id'];
  roomId?: Room['_id'];
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
