'use server';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';
import { Tokens } from '@/types';
import { cookies } from 'next/headers';
import { getTokenMaxAge } from './jwt';

export const getAccessToken = () => {
  const accessToken = cookies().get(ACCESS_TOKEN_NAME);
  return accessToken;
};
export const getRefreshToken = () => {
  const refreshToken = cookies().get(REFRESH_TOKEN_NAME);
  return refreshToken;
};

export const setTokens = (tokens: Tokens) => {
  cookies().set(ACCESS_TOKEN_NAME, tokens.accessToken, {
    maxAge: getTokenMaxAge(tokens.accessToken),
  });
  cookies().set(REFRESH_TOKEN_NAME, tokens.refreshToken, {
    maxAge: getTokenMaxAge(tokens.refreshToken),
  });
};
