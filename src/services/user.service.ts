import { User } from '@/features/users/types';
import { get, patch } from './api.service';
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
  const { spaceId, ...rest } = data;
  return patch(`/help-desk/spaces/${spaceId}/edit-client-profile`, {
    ...rest,
  });
};

export const changePasswordUserService = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return patch('/users/change-password', { ...data });
};

export const block = (userId: User['_id']) => {
  return patch(`/users/${userId}/block`, {});
};
export const unblock = (userId: User['_id']) => {
  return patch(`/users/${userId}/unblock`, {});
};

export const checkRelationship = (userId: User['_id']) => {
  return get(`/users/${userId}/relation`);
};
