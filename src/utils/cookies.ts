import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import { FAKE_ACCESS_TOKEN } from '@/configs/common';
import { cookies } from 'next/headers';

export const getAccessToken = () => {
  // return cookies().get(ACCESS_TOKEN_NAME);
  return FAKE_ACCESS_TOKEN;
};
