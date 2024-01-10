import { patch, post } from './api.service';

export const updateInfoUserService = (data: any) => {
  return patch('/users/update', { ...data });
};
export const changePasswordUserService = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return patch('/users/change-password', { ...data });
};
