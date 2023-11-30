import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import { NEXT_PUBLIC_FAKE_TOKEN } from '@/configs/env.public';
import { cookies } from 'next/headers';

export const getAccessToken = () => {
  // return cookies().get(ACCESS_TOKEN_NAME);
  return NEXT_PUBLIC_FAKE_TOKEN;
};
