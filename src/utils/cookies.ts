import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import { cookies } from 'next/headers';

export const getAccessToken = () => {
  const accessToken = cookies().get(ACCESS_TOKEN_NAME);
  return accessToken;
};
