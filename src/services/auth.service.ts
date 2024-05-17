import DataRequestSetCookie from '@/types/set-cookie-data.interface';
import { get, patch, post, put, remove } from './api.service';

import { AuthData } from '@/types';

export const login = async ({ email, password }: AuthData) => {};

export const registerService = ({ email, password }: AuthData) => {
  return post('/auth/sign-up', { email, password });
};
export const loginService = ({ email, password }: AuthData) => {
  return post('/auth/sign-in', { email, password });
};
export const verifyEmailService = () => {
  return get('/auth/activate-account');
};
export const resendEmailService = (email: string) => {
  return post('/auth/resend-verify-email', { email });
};
export const forgotPasswordService = (email: string) => {
  return post('/auth/forgot-password', { email });
};
export const resetPasswordService = (password: string) => {
  return put('/auth/reset-password', { password });
};
export const getProfileService = () => {
  return get('/auth/me');
};
export const addInfoUserService = (data: any) => {
  return patch('/users/setup', data);
};
export const signOutService = () => {
  return get('/auth/sign-out');
};
export const setCookieService = (data: DataRequestSetCookie[]) => {
  return post('/auth/set-cookie', data);
};
export const getCookieService = (keys: string[]) => {
  return post('/auth/get-cookie', { keys });
};

export const deleteAccount = () => {
  return remove('/auth/account', {});
};
