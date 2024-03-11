import { get, patch, post, put } from './api.service';

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
export const saveCookieService = (data: {token: string, refresh_token: string}) => {
  return post('/auth/save-cookie', data);
}
export const getCookieService = () => {
  return get('/auth/get-cookie');
}